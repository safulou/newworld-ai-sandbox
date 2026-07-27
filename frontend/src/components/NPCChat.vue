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

onMounted(() => inputEl.value?.focus())

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
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 100px; z-index: 100;
}
.chat-panel {
  background: #1a1a2e; color: #eee; border-radius: 12px; width: 420px; max-width: 95vw;
  font-family: monospace; display: flex; flex-direction: column; max-height: 400px;
}
.chat-header {
  display: flex; align-items: center; gap: 10px; padding: 14px 16px;
  border-bottom: 1px solid #333;
}
.npc-avatar { font-size: 28px; }
.npc-name { font-weight: bold; font-size: 15px; }
.npc-role { font-size: 11px; color: #888; }
.close-btn { margin-left: auto; background: none; border: none; color: #888; font-size: 16px; cursor: pointer; }
.close-btn:hover { color: #fff; }

.messages {
  flex: 1; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;
}
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.bubble {
  max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4;
  background: #2a2a4a;
}
.msg.user .bubble { background: #5555ff; }
.typing { animation: blink 0.8s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.input-row { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #333; }
.input-row input {
  flex: 1; background: #111; color: #eee; border: 1px solid #444; border-radius: 6px;
  padding: 8px 10px; font-family: monospace; font-size: 13px;
}
.input-row input:focus { outline: none; border-color: #7c7cff; }
.input-row button {
  padding: 8px 14px; background: #5555ff; color: #fff; border: none; border-radius: 6px; cursor: pointer;
}
.input-row button:disabled { background: #333; color: #666; cursor: not-allowed; }
</style>
