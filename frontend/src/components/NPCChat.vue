<template>
  <div class="overlay" @click.self="close">
    <div class="chat-panel glass-panel">
      <div class="chat-header">
        <span class="npc-avatar">🧙</span>
        <div>
          <div class="npc-name">{{ ui.currentNPCName || 'Cyber Architect' }}</div>
          <div class="npc-role">Autonomous AI NPC</div>
        </div>
        <button class="close-btn" @click="close">✕</button>
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
            <span>{{ msg.content }}</span>
          </div>
        </div>
        <div v-if="loading" class="msg assistant">
          <span class="bubble typing">▌ Generating response...</span>
        </div>
      </div>

      <div class="input-row">
        <input
          v-model="inputText"
          placeholder="Ask anything or command: 'Build a cyber tower here'..."
          @keydown.enter="send"
          :disabled="loading"
          ref="inputEl"
        />
        <button @click="send" :disabled="loading || !inputText.trim()">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { chatWithNPC, localFallback } from '@/engine/ai'
import { sound } from '@/engine/audio'

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
    content: `Greetings, architect! I'm ${ui.currentNPCName || 'the Cyber Architect'}. You can converse with me or command me to construct any structure at your location (e.g. "Build a glowing cyber tower" or "蓋一座城堡")!`
  }
])
const inputText = ref('')
const loading = ref(false)
const msgContainer = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()

const playerPos = ref({ x: 0, y: 0, z: 0 })

const NPC_SYSTEM = `You are ${ui.currentNPCName || 'Cyber Architect'}, a sentient AI Guide & Master Architect in the Neon Oasis Voxel Metaverse.
You help players explore, understand coordinates, and build procedural architectures.
Keep responses concise (2-3 sentences max), inspiring, and cyberpunk-themed.`

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
      content: `🎉 Construction completed! ${custom.detail.blocksTotal || ''} blocks placed on your plot.`,
      isBuilderNotice: true
    })
    scrollToBottom()
  }
}

onMounted(() => {
  inputEl.value?.focus()
  window.addEventListener('player-position', onPlayerPosition)
  window.addEventListener('ai-chat', onAiChatMessage)
  window.addEventListener('build-progress', onBuildProgress)
})

onUnmounted(() => {
  window.removeEventListener('player-position', onPlayerPosition)
  window.removeEventListener('ai-chat', onAiChatMessage)
  window.removeEventListener('build-progress', onBuildProgress)
})

function close(): void { ui.closeOverlay() }

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

  const isBuildCommand = BUILD_COMMAND_REGEX.test(userMsg)

  if (isBuildCommand) {
    // ── Autonomous AI Builder Trigger ──
    const px = playerPos.value.x
    const pz = playerPos.value.z
    
    messages.value.push({
      role: 'assistant',
      content: `⚡ Initializing voxel construction matrix for "${userMsg}" at [${px}, ${pz}]! Deploying procedural architecture...`,
      isBuilderNotice: true
    })
    scrollToBottom()

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
    NPC_SYSTEM,
    settings.apiKey,
    settings.provider
  )

  messages.value.push({ role: 'assistant', content: reply })
  loading.value = false
  scrollToBottom()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 90px; z-index: 100;
  backdrop-filter: blur(4px);
}

.chat-panel {
  width: 480px; max-width: 95vw;
  display: flex; flex-direction: column; max-height: 440px;
  background: rgba(14, 18, 30, 0.92);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.chat-header {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.npc-avatar { font-size: 26px; filter: drop-shadow(0 0 8px rgba(0,255,255,0.6)); }
.npc-name { font-weight: 700; font-size: 15px; color: #00ffff; letter-spacing: 0.5px; }
.npc-role { font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
.close-btn { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #fff; }

.messages {
  flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
}
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.bubble {
  max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
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
