import { Socket } from 'socket.io-client'
import { useSettingsStore } from '@/stores/settings'
import { compileDSL } from './dsl'
import { SYSTEM_PROMPT } from './ai'
import { BlockPlacement, BuildAction } from '@/types/world'

export class DecentralizedWorker {
  private socket: Socket
  private isProcessing = false

  constructor(socket: Socket) {
    this.socket = socket
    
    // Listen for new compute tasks from P2P task pool
    this.socket.on('new-task', (task: any) => {
      this.evaluateTask(task)
    })
  }

  private async evaluateTask(task: any) {
    if (this.isProcessing) return

    const settings = useSettingsStore()
    if (settings.provider === 'local' || !settings.apiKey) return

    this.isProcessing = true
    
    this.socket.emit('claim-task', task.id, async (response: any) => {
      if (response && response.success) {
        await this.executeTask(response.task, settings.provider, settings.apiKey)
      } else {
        this.isProcessing = false
      }
    })
  }

  private async executeTask(task: any, provider: string, apiKey: string) {
    const { prompt, cx, cz } = task

    this.socket.emit('task-progress', { status: 'planning', prompt })

    try {
      let rawJson = ''
      let tokens = 0

      if (provider === 'gemini') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              generationConfig: { temperature: 0.7 }
            }),
          }
        )
        const data = await res.json()
        if (data.error) throw new Error(data.error.message)
        rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        tokens = data.usageMetadata?.candidatesTokenCount ?? 0
      } else if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2048,
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error.message)
        rawJson = data.choices?.[0]?.message?.content ?? ''
        tokens = data.usage?.total_tokens ?? 0
      } else if (provider === 'claude') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error.message)
        rawJson = data.content?.[0]?.text ?? ''
        tokens = (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0)
      }

      const cleaned = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      let actions: BuildAction[] = []
      if (parsed.commands && Array.isArray(parsed.commands)) {
        actions = compileDSL(parsed.commands, { x: cx, y: 0, z: cz })
      } else if (parsed.actions && Array.isArray(parsed.actions)) {
        actions = parsed.actions.map((a: any) => ({
          ...a,
          position: [cx + a.position[0], a.position[1], cz + a.position[2]],
        }))
      }

      const blocksToPlace: BlockPlacement[] = actions.map(a => ({
        x: a.position[0],
        y: a.position[1],
        z: a.position[2],
        type: a.material,
      }))

      const totalBlocks = blocksToPlace.length
      const stepBatchSize = Math.max(1, Math.floor(totalBlocks / 40)) // batch placements for responsive UI
      const estimatedMs = Math.min(5000, totalBlocks * 20)

      let i = 0
      const blocksResult: BlockPlacement[] = []

      const interval = setInterval(() => {
        if (i >= totalBlocks) {
          clearInterval(interval)
          this.socket.emit('submit-task', { taskId: task.id, blocks: blocksResult })
          this.isProcessing = false
          return
        }

        const nextLimit = Math.min(totalBlocks, i + stepBatchSize)
        for (let idx = i; idx < nextLimit; idx++) {
          blocksResult.push(blocksToPlace[idx])
        }
        i = nextLimit

        this.socket.emit('task-progress', {
          status: 'building',
          prompt,
          tokens,
          estimatedMs,
          blocksTotal: totalBlocks,
          blocksPlaced: i,
          description: parsed.description || 'Constructing procedural architecture',
        })
      }, 50)

    } catch (e: any) {
      console.error('Task execution error:', e)
      this.socket.emit('task-progress', { status: 'error', message: e.message })
      this.isProcessing = false
    }
  }
}
