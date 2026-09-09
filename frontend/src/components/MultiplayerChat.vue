<template>
  <div class="chat-container glass-panel">
    <!-- Channel Tabs -->
    <div class="channel-tabs">
      <button
        v-for="ch in channels"
        :key="ch.id"
        :class="['ch-tab', { active: activeChannel === ch.id }]"
        @click="activeChannel = ch.id"
      >
        {{ ch.name }}
      </button>
    </div>

    <!-- Messages Area -->
    <div class="messages-feed" ref="feedRef">
      <div
        v-for="msg in filteredMessages"
        :key="msg.id"
        class="chat-msg"
      >
        <span class="msg-time">{{ msg.time }}</span>
        <span class="msg-sender" :class="msg.channel">{{ msg.sender }}:</span>
        <span class="msg-content">{{ msg.content }}</span>
      </div>
    </div>

    <!-- Emote Quick Bar -->
    <div class="emote-bar">
      <button
        v-for="e in EMOTE_LIST"
        :key="e.id"
        class="emote-btn"
        :title="e.name"
        @click="sendEmote(e)"
      >
        {{ e.icon }}
      </button>
    </div>

    <!-- Input Box -->
    <div class="input-row">
      <input
        v-model="inputContent"
        placeholder="發送訊息至元宇宙頻道 (按 Enter 發送)..."
        @keydown.enter="sendMessage"
      />
      <button class="send-btn" @click="sendMessage">發送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { EMOTE_LIST, EmoteData } from '@/engine/chat'
import { sound } from '@/engine/audio'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

interface DisplayMessage {
  id: string
  sender: string
  content: string
  channel: 'global' | 'local' | 'party' | 'system'
  time: string
}

const activeChannel = ref<'global' | 'local' | 'system'>('global')
const inputContent = ref('')
const feedRef = ref<HTMLDivElement>()

const channels: Array<{ id: 'global' | 'local' | 'system'; name: string }> = [
  { id: 'global', name: '🌐 全域 (Global)' },
  { id: 'local', name: '📍 近距 (Local)' },
  { id: 'system', name: '⚡ 系統 (System)' },
]

const messages = ref<DisplayMessage[]>([
  { id: '1', sender: '系統 (System)', content: '歡迎進入 NewWorld 3D AI 體素元宇宙！', channel: 'system', time: '10:00' },
  { id: '2', sender: 'Alex (Architect)', content: '隨時指令我為您代工建造任何宏偉結構！', channel: 'global', time: '10:01' },
])

const filteredMessages = computed(() => {
  if (activeChannel.value === 'global') return messages.value
  return messages.value.filter(m => m.channel === activeChannel.value || m.channel === 'system')
})

function sendMessage(): void {
  const text = inputContent.value.trim()
  if (!text) return

  const newMsg: DisplayMessage = {
    id: 'msg_' + Date.now(),
    sender: settings.creatorId || '你 (Pioneer)',
    content: text,
    channel: activeChannel.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }

  messages.value.push(newMsg)
  inputContent.value = ''
  sound.playUiClick()

  window.dispatchEvent(new CustomEvent('player-chat', { detail: newMsg }))

  nextTick(() => {
    if (feedRef.value) {
      feedRef.value.scrollTop = feedRef.value.scrollHeight
    }
  })
}

function sendEmote(e: EmoteData): void {
  const newMsg: DisplayMessage = {
    id: 'msg_' + Date.now(),
    sender: settings.creatorId || '你 (Pioneer)',
    content: `[動作] ${e.icon} ${e.name}`,
    channel: 'local',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
  messages.value.push(newMsg)
  sound.playFanfare()
}
</script>

<style scoped>
.chat-container {
  position: absolute;
  bottom: 60px;
  left: 20px;
  width: 380px;
  height: 260px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
  z-index: 50;
}

.channel-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 6px;
}

.ch-tab {
  background: none;
  border: none;
  color: #888;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.ch-tab.active {
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  font-weight: 700;
}

.messages-feed {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}

.chat-msg {
  font-size: 0.8rem;
  line-height: 1.3;
  word-break: break-word;
}

.msg-time {
  color: #555;
  font-size: 0.7rem;
  margin-right: 6px;
}

.msg-sender {
  font-weight: 600;
  margin-right: 6px;
}

.msg-sender.global { color: #00ffff; }
.msg-sender.local { color: #00ff88; }
.msg-sender.system { color: #ffd700; }

.msg-content {
  color: #eee;
}

.emote-bar {
  display: flex;
  gap: 6px;
}

.emote-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 0.9rem;
}

.emote-btn:hover {
  background: rgba(0, 255, 255, 0.2);
}

.input-row {
  display: flex;
  gap: 6px;
}

.input-row input {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  outline: none;
}

.input-row input:focus {
  border-color: #00ffff;
}

.send-btn {
  background: #00ffff;
  color: #000;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
