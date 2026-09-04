<template>
  <div class="overlay" @click.self="close">
    <div class="chat-panel">
      <div class="chat-header">
        <span class="npc-avatar">🧙</span>
        <div>
          <div class="npc-name">{{ ui.currentNPCName || 'World Guide' }}</div>
          <div class="npc-role">AI NPC</div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="messages" ref="msgContainer">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="msg"
          :class="msg.role"
        >
          <span class="bubble">{{ msg.content }}</span>
        </div>
        <div v-if="loading" class="msg assistant">
          <span class="bubble typing">▌</span>
        </div>
      </div>

      <div class="input-row">
        <input
          v-model="inputText"
          placeholder="Say something..."
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
import { ref, nextTick, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { chatWithNPC } from '@/engine/ai'

const ui = useUIStore()
const settings = useSettingsStore()

const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([
  { role: 'assistant', content: `Hello, adventurer! I'm ${ui.currentNPCName || 'the World Guide'}. How can I help you explore this world?` }
])
const inputText = ref('')
const loading = ref(false)
const msgContainer = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()

const NPC_SYSTEM = `You are ${ui.currentNPCName || 'a friendly NPC'} in a voxel sandbox world called NewWorld.
You help players explore, build, and understand the world. Keep responses short (2-3 sentences max), friendly and in-character.
You know about: different block types, building techniques, the AI generation system, and lore of this world.`

onMounted(() => {
  inputEl.value?.focus()
  window.addEventListener('ai-chat', (e: Event) => {
    const custom = e as CustomEvent
    messages.value.push({ role: custom.detail.role, content: custom.detail.content })
    nextTick(() => {
      msgContainer.value?.scrollTo(0, msgContainer.value.scrollHeight)
    })
  })
})

function close(): void { ui.closeOverlay() }

async function send(): Promise<void> {
  if (!inputText.value.trim() || loading.value) return
  const userMsg = inputText.value.trim()
  inputText.value = ''
  messages.value.push({ role: 'user', content: userMsg })
  loading.value = true
  await nextTick()
  msgContainer.value?.scrollTo(0, msgContainer.value.scrollHeight)

  const reply = await chatWithNPC(
    messages.value.filter(m => m.role !== 'assistant' || messages.value.indexOf(m) > 0),
    NPC_SYSTEM,
    settings.apiKey,
    settings.provider
  )
  messages.value.push({ role: 'assistant', content: reply })
  loading.value = false
  await nextTick()
  msgContainer.value?.scrollTo(0, msgContainer.value.scrollHeight)
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 100px; z-index: 100;
}
.chat-panel {
  width: 420px; max-width: 95vw;
  display: flex; flex-direction: column; max-height: 400px;
}
.glass-panel {
  background: rgba(15, 20, 30, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.chat-header {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.npc-avatar { font-size: 28px; filter: drop-shadow(0 0 8px rgba(0,255,255,0.5)); }
.npc-name { font-weight: 600; font-size: 15px; letter-spacing: 0.5px; }
.npc-role { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
.close-btn { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; transition: color 0.2s; }
.close-btn:hover { color: #fff; }

.messages {
  flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
}
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.bubble {
  max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
}
.msg.user .bubble { background: rgba(0,255,255,0.1); border-color: rgba(0,255,255,0.3); color: #00ffff; }
.typing { animation: blink 0.8s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.input-row { display: flex; gap: 8px; padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.1); }
.input-row input {
  flex: 1; background: rgba(0,0,0,0.3); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
  padding: 10px 14px; font-family: inherit; font-size: 14px; transition: border-color 0.2s; outline: none;
}
.input-row input:focus { border-color: #00ffff; }
.input-row button {
  padding: 8px 16px; background: #00ffff; color: #000; border: none; border-radius: 8px; cursor: pointer;
  font-weight: 600; font-family: inherit; transition: transform 0.1s, box-shadow 0.2s;
}
.input-row button:disabled { opacity: 0.5; cursor: not-allowed; }
.input-row button:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 0 10px rgba(0,255,255,0.4); }
</style>
