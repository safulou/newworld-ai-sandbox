<template>
  <div class="overlay" @click.self="close">
    <div class="chat-panel glass-panel">
      <div class="chat-header">
        <span class="npc-avatar">{{ npcAvatar }}</span>
        <div>
          <div class="npc-name">{{ currentTitle }} ({{ ui.currentNPCName || 'Cyber Architect' }})</div>
          <div class="npc-role">
            <span class="role-badge">AI NPC COMPANION</span>
            <span v-if="tts.isSpeaking.value" class="voice-wave-indicator">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
              <span class="speaking-label">發話中...</span>
            </span>
          </div>
        </div>

        <div class="header-actions">
          <!-- TTS Voice Toggle & Rate -->
          <button
            class="header-btn"
            :class="{ active: settings.ttsEnabled }"
            @click="toggleTts"
            :title="settings.ttsEnabled ? '語音朗讀開啟 (點擊關閉)' : '語音朗讀關閉 (點擊開啟)'"
          >
            {{ settings.ttsEnabled ? '🔊 語音' : '🔇 靜音' }}
          </button>
          <button
            v-if="settings.ttsEnabled"
            class="header-btn rate-btn"
            @click="cycleRate"
            title="調整 NPC 說話語速"
          >
            {{ settings.ttsRate }}x
          </button>
          <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
        </div>
      </div>

      <div class="messages" ref="msgContainer">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="msg"
          :class="[msg.role, { 'builder-notice': msg.isBuilderNotice }]"
        >
          <div class="bubble">
            <span v-if="msg.isBuilderNotice" class="badge-builder">🏗️ AI BUILDER</span>
            <span class="msg-text">{{ msg.content }}</span>
            <button
              v-if="msg.role === 'assistant' && !msg.isBuilderNotice"
              class="replay-btn"
              @click="playVoice(msg.content)"
              title="重新朗讀此段語音"
            >
              🔊
            </button>
          </div>
        </div>
        <div v-if="loading" class="msg assistant">
          <span class="bubble typing">▌ 正在思考中...</span>
        </div>
      </div>

      <div class="input-row">
        <input
          v-model="inputText"
          placeholder="詢問任何問題或下達建造指令（例：蓋一座發光高塔）..."
          @keydown.enter="send"
          :disabled="loading"
          ref="inputEl"
        />
        <button @click="send" :disabled="loading || !inputText.trim()">發送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { chatWithNPC, localFallback } from '@/engine/ai'
import { sound } from '@/engine/audio'
import { tts, NPC_VOICE_PROFILES } from '@/engine/tts'
import { npcManager } from '@/engine/npc'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isBuilderNotice?: boolean
}

const ui = useUIStore()
const settings = useSettingsStore()

const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content: `你好，我是 ${ui.currentNPCName || 'Alex'}！你可以隨時與我對話交流，或向我下達建造指令（例如「蓋一座賽博塔」或「建造城堡」）！`
  }
])
const inputText = ref('')
const loading = ref(false)
const msgContainer = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()

const playerPos = ref({ x: 0, y: 0, z: 0 })

const npcAvatar = computed(() => {
  const name = (ui.currentNPCName || '').toLowerCase()
  if (name.includes('sparky') || name.includes('drone')) return '🛸'
  if (name.includes('aegis') || name.includes('sentinel')) return '🛡️'
  if (name.includes('chronos') || name.includes('lore')) return '⏳'
  if (name.includes('vex') || name.includes('merchant')) return '💎'
  if (name.includes('alex') || name.includes('architect')) return '👨‍🚀'
  return '🧙'
})

const currentTitle = computed(() => {
  const name = (ui.currentNPCName || '').toLowerCase()
  for (const prof of Object.values(NPC_VOICE_PROFILES)) {
    if (prof.name.toLowerCase() === name || prof.id.toLowerCase() === name) {
      return prof.title
    }
  }
  return '賽博伴侶'
})

const NPC_SYSTEM = computed(() => {
  return `You are ${ui.currentNPCName || 'Alex'}, a sentient AI companion in the NewWorld Voxel Metaverse.
You help players explore, understand 3D coordinates, and build procedural architectures.
Keep responses concise (2-3 sentences max), inspiring, and cyberpunk-themed.`
})

const BUILD_COMMAND_REGEX = /(build|create|construct|make|tower|castle|house|fort|pyramid|skyscraper|structure|portal|spire|shrine|biome|forest|tree|plaza|bridge|temple|gate|dome|cottage|arch|蓋|建|做一個|造|建造|設計)/i

function onPlayerPosition(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    playerPos.value = {
      x: Math.floor(custom.detail.x),
      y: Math.floor(custom.detail.y),
      z: Math.floor(custom.detail.z),
    }
  }
}

function onAiChatMessage(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    messages.value.push({
      role: custom.detail.role === 'user' ? 'user' : 'assistant',
      content: custom.detail.content,
      isBuilderNotice: custom.detail.content.includes('[Architect]') || custom.detail.content.includes('[Worker]')
    })
    scrollToBottom()
  }
}

function onBuildProgress(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail && custom.detail.status === 'completed') {
    messages.value.push({
      role: 'assistant',
      content: `🎉 建造完成！共放置了 ${custom.detail.blocksTotal || ''} 個方塊至當前領地。`,
      isBuilderNotice: true
    })
    scrollToBottom()
  }
}

function toggleTts(): void {
  settings.setTtsEnabled(!settings.ttsEnabled)
  tts.state.enabled = settings.ttsEnabled
  if (!settings.ttsEnabled) {
    tts.stop()
  } else {
    // Play greeting sample
    playVoice(`語音系統已啟動。`)
  }
}

function cycleRate(): void {
  const rates = [0.8, 1.0, 1.2, 1.5]
  const idx = rates.indexOf(settings.ttsRate)
  const next = rates[(idx + 1) % rates.length]
  settings.setTtsRate(next)
  tts.state.rateMultiplier = next
}

function playVoice(text: string): void {
  const companion = npcManager.getNPCByName(ui.currentNPCName)
  const npcPos = companion ? companion.getPosition() : undefined
  tts.speak(ui.currentNPCName, text, npcPos, playerPos.value, settings.apiKey)
}

onMounted(() => {
  inputEl.value?.focus()
  window.addEventListener('player-position', onPlayerPosition)
  window.addEventListener('ai-chat', onAiChatMessage)
  window.addEventListener('build-progress', onBuildProgress)

  // Greet player on opening chat
  if (settings.ttsEnabled && messages.value.length > 0) {
    playVoice(messages.value[0].content)
  }
})

onUnmounted(() => {
  window.removeEventListener('player-position', onPlayerPosition)
  window.removeEventListener('ai-chat', onAiChatMessage)
  window.removeEventListener('build-progress', onBuildProgress)
  tts.stop()
})

function close(): void {
  tts.stop()
  ui.closeOverlay()
}

function scrollToBottom(): void {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}

async function send(): Promise<void> {
  if (!inputText.value.trim() || loading.value) return
  const userMsg = inputText.value.trim()
  inputText.value = ''
  
  messages.value.push({ role: 'user', content: userMsg })
  loading.value = true
  scrollToBottom()

  const isWorkerCommand = /(鋪路|鋪一條路|pave|整地|鏟平|平整|flatten|採礦|開採|挖礦|mine)/i.test(userMsg)
  if (isWorkerCommand) {
    let task: 'pave' | 'flatten' | 'mine' = 'pave'
    if (/(整地|鏟平|平整|flatten)/i.test(userMsg)) task = 'flatten'
    else if (/(採礦|開採|挖礦|mine)/i.test(userMsg)) task = 'mine'

    const companion = npcManager.getNPCByName(ui.currentNPCName)
    const taskName = task === 'pave' ? '鋪設賽博路面' : (task === 'flatten' ? '清理整平目標區域' : '開鑿下行採礦坑道')
    const startMsg = `收到指令！${ui.currentNPCName || 'Alex'} 正在為您「${taskName}」...`
    messages.value.push({
      role: 'assistant',
      content: startMsg,
      isBuilderNotice: true
    })
    scrollToBottom()
    if (settings.ttsEnabled) playVoice(startMsg)

    if (companion) {
      const result = await companion.executeWorkerTask(task, playerPos.value)
      messages.value.push({
        role: 'assistant',
        content: `🎉 ${result}`,
        isBuilderNotice: true
      })
      scrollToBottom()
      if (settings.ttsEnabled) playVoice(result)
    }

    loading.value = false
    return
  }

  const isBuildCommand = BUILD_COMMAND_REGEX.test(userMsg)

  if (isBuildCommand) {
    // ── Autonomous AI Builder Trigger ──
    const px = playerPos.value.x
    const pz = playerPos.value.z
    
    const buildMsg = `⚡ 正在座標 [${px}, ${pz}] 初始化「${userMsg}」的體素建築矩陣！`
    messages.value.push({
      role: 'assistant',
      content: buildMsg,
      isBuilderNotice: true
    })
    scrollToBottom()

    if (settings.ttsEnabled) {
      playVoice(buildMsg)
    }

    try {
      if (settings.provider === 'local') {
        const build = localFallback(userMsg, { x: px, y: 0, z: pz })
        window.dispatchEvent(new CustomEvent('direct-build', { detail: build }))
        sound.playBuildComplete()
      } else {
        // Submit to decentralized build task pool
        fetch('http://localhost:4000/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMsg,
            cx: px,
            cz: pz,
            creatorId: settings.creatorId
          })
        }).catch(() => {
          // Fallback if backend is offline
          const build = localFallback(userMsg, { x: px, y: 0, z: pz })
          window.dispatchEvent(new CustomEvent('direct-build', { detail: build }))
          sound.playBuildComplete()
        })
      }
    } catch {
      const build = localFallback(userMsg, { x: px, y: 0, z: pz })
      window.dispatchEvent(new CustomEvent('direct-build', { detail: build }))
    }

    loading.value = false
    scrollToBottom()
    return
  }

  // Regular NPC Chat
  const reply = await chatWithNPC(
    messages.value
      .filter(m => !m.isBuilderNotice)
      .map(m => ({ role: m.role, content: m.content })),
    NPC_SYSTEM.value,
    settings.apiKey,
    settings.provider
  )

  messages.value.push({ role: 'assistant', content: reply })
  loading.value = false
  scrollToBottom()

  if (settings.ttsEnabled) {
    playVoice(reply)
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 90px; z-index: 100;
  backdrop-filter: blur(4px);
}

.chat-panel {
  width: 520px; max-width: 95vw;
  display: flex; flex-direction: column; max-height: 480px;
  background: rgba(14, 18, 30, 0.94);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 255, 0.15);
}

.chat-header {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.npc-avatar { font-size: 28px; filter: drop-shadow(0 0 8px rgba(0,255,255,0.6)); }
.npc-name { font-weight: 700; font-size: 15px; color: #00ffff; letter-spacing: 0.5px; }
.npc-role { font-size: 10px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.role-badge { text-transform: uppercase; letter-spacing: 1px; }

.voice-wave-indicator {
  display: inline-flex; align-items: center; gap: 3px;
  color: #00ff88; font-size: 10px; font-weight: 700;
}
.voice-wave-indicator .bar {
  display: inline-block; width: 2px; height: 10px; background: #00ff88;
  border-radius: 1px; animation: soundWave 0.8s ease-in-out infinite alternate;
}
.voice-wave-indicator .b1 { animation-delay: 0.1s; }
.voice-wave-indicator .b2 { animation-delay: 0.3s; }
.voice-wave-indicator .b3 { animation-delay: 0.5s; }
.voice-wave-indicator .b4 { animation-delay: 0.2s; }

@keyframes soundWave {
  0% { height: 3px; }
  100% { height: 12px; }
}

.header-actions {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
}
.header-btn {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 4px 8px;
  border-radius: 6px; cursor: pointer; transition: all 0.2s;
}
.header-btn:hover { background: rgba(0,255,255,0.2); color: #00ffff; border-color: rgba(0,255,255,0.4); }
.header-btn.active { background: rgba(0,255,255,0.2); color: #00ffff; border-color: #00ffff; }
.rate-btn { font-family: monospace; }

.close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; transition: color 0.2s; padding: 0 4px; }
.close-btn:hover { color: #fff; }

.messages {
  flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
}
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.bubble {
  max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  position: relative; word-break: break-word;
}
.msg.user .bubble { background: rgba(0,255,255,0.12); border-color: rgba(0,255,255,0.35); color: #00ffff; }

.msg.builder-notice .bubble {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #e0ffff;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.15);
}

.badge-builder {
  display: block; font-size: 9px; font-weight: 800; color: #00ffff;
  letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase;
}

.replay-btn {
  margin-left: 8px; background: none; border: none; cursor: pointer;
  font-size: 12px; opacity: 0.6; transition: opacity 0.2s, transform 0.1s;
  vertical-align: middle;
}
.replay-btn:hover { opacity: 1.0; transform: scale(1.2); }

.typing { animation: blink 0.8s steps(1) infinite; color: #00ffff; }
@keyframes blink { 50% { opacity: 0; } }

.input-row { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); }
.input-row input {
  flex: 1; background: rgba(0,0,0,0.4); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
  padding: 10px 14px; font-family: inherit; font-size: 13px; transition: border-color 0.2s; outline: none;
}
.input-row input:focus { border-color: #00ffff; box-shadow: 0 0 8px rgba(0,255,255,0.3); }
.input-row button {
  padding: 8px 18px; background: #00ffff; color: #000; border: none; border-radius: 8px; cursor: pointer;
  font-weight: 700; font-family: inherit; transition: transform 0.1s, box-shadow 0.2s;
}
.input-row button:disabled { opacity: 0.5; cursor: not-allowed; }
.input-row button:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 0 12px rgba(0,255,255,0.5); }
</style>
