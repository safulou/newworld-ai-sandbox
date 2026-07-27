import { AIBuildResponse, BuildAction } from '@/types/world'

const SYSTEM_PROMPT = `You are a voxel world builder AI. Given a natural language description, output ONLY valid JSON with this exact schema:
{
  "description": "brief description of what was built",
  "actions": [
    { "type": "place_block", "position": [x, y, z], "material": "blockType" }
  ]
}

Available block types: grass, dirt, stone, wood, leaves, sand, water, brick, glass, plank, snow
Coordinate system: x=east/west, y=up/down, z=north/south. Origin [0,0,0] is the build center.
Keep builds compact (max 20x20x20). y=0 is ground level.
Output ONLY the JSON object, no markdown, no explanation.`

function localFallback(prompt: string): AIBuildResponse {
  const lower = prompt.toLowerCase()
  const actions: BuildAction[] = []

  if (lower.includes('house') || lower.includes('home') || lower.includes('cottage') || lower.includes('屋') || lower.includes('房')) {
    // 5x4x5 simple house
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        actions.push({ type: 'place_block', position: [x, 0, z], material: 'plank' })
        if (x === -2 || x === 2 || z === -2 || z === 2) {
          for (let y = 1; y <= 3; y++) {
            const isWindow = (y === 2) && (x === 0 || z === 0)
            actions.push({ type: 'place_block', position: [x, y, z], material: isWindow ? 'glass' : 'plank' })
          }
        }
      }
    }
    // roof
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        actions.push({ type: 'place_block', position: [x, 4, z], material: 'wood' })
      }
    }
    return { description: 'A simple wooden house with glass windows', actions }
  }

  if (lower.includes('tower') || lower.includes('castle') || lower.includes('塔')) {
    for (let y = 0; y <= 8; y++) {
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          if (Math.abs(dx) === 2 || Math.abs(dz) === 2) {
            actions.push({ type: 'place_block', position: [dx, y, dz], material: 'stone' })
          }
        }
      }
    }
    return { description: 'A stone tower', actions }
  }

  if (lower.includes('tree') || lower.includes('forest') || lower.includes('樹')) {
    const positions: [number, number][] = [[0,0],[-4,3],[4,-3],[3,5],[-5,-4]]
    for (const [tx, tz] of positions) {
      for (let y = 0; y < 4; y++) actions.push({ type: 'place_block', position: [tx, y, tz], material: 'wood' })
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          for (let dy = 3; dy <= 5; dy++) {
            if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy === 5) continue
            actions.push({ type: 'place_block', position: [tx+dx, dy, tz+dz], material: 'leaves' })
          }
        }
      }
    }
    return { description: 'A small forest of trees', actions }
  }

  if (lower.includes('pyramid') || lower.includes('金字塔')) {
    for (let y = 0; y < 6; y++) {
      const r = 5 - y
      for (let x = -r; x <= r; x++) {
        for (let z = -r; z <= r; z++) {
          actions.push({ type: 'place_block', position: [x, y, z], material: 'sand' })
        }
      }
    }
    return { description: 'A sand pyramid', actions }
  }

  // default: a small platform
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      actions.push({ type: 'place_block', position: [x, 0, z], material: 'stone' })
    }
  }
  return { description: 'A stone platform (try: house, tower, tree, pyramid)', actions }
}

export async function generateBuild(
  prompt: string,
  apiKey: string,
  provider: 'openai' | 'gemini' | 'claude' | 'local',
  buildOrigin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
): Promise<AIBuildResponse> {
  if (provider === 'local' || !apiKey) {
    return localFallback(prompt)
  }

  try {
    let rawJson = ''

    if (provider === 'openai') {
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
      rawJson = data.choices?.[0]?.message?.content ?? ''
    } else if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${prompt}` }] }],
          }),
        }
      )
      const data = await res.json()
      rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
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
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      rawJson = data.content?.[0]?.text ?? ''
    }

    // strip markdown code fences if present
    rawJson = rawJson.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed: AIBuildResponse = JSON.parse(rawJson)

    // offset all actions to build origin
    const offset = buildOrigin
    parsed.actions = parsed.actions.map(a => ({
      ...a,
      position: [
        a.position[0] + offset.x,
        a.position[1] + offset.y,
        a.position[2] + offset.z,
      ] as [number, number, number],
    }))

    return parsed
  } catch {
    console.warn('AI call failed, falling back to local generator')
    return localFallback(prompt)
  }
}

export async function chatWithNPC(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string,
  apiKey: string,
  provider: 'openai' | 'gemini' | 'claude' | 'local'
): Promise<string> {
  if (provider === 'local' || !apiKey) {
    const greetings = [
      "Hello, traveler! Welcome to NewWorld.",
      "I'm glad you're here. What would you like to know?",
      "This world has many secrets. Ask me anything!",
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          temperature: 0.8,
          max_tokens: 512,
        }),
      })
      const data = await res.json()
      return data.choices?.[0]?.message?.content ?? '...'
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
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: systemPrompt,
          messages,
        }),
      })
      const data = await res.json()
      return data.content?.[0]?.text ?? '...'
    }
    return 'Hello, traveler!'
  } catch {
    return 'Hello, traveler!'
  }
}
