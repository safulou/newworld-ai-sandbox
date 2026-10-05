<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="broadcast-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">📻</span>
          <h2>超空間量子通訊廣播與星網 (Hyper-Subspace Quantum BBS)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="broadcast-content">
        <!-- Telemetry Status Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">📡</span>
            <div>
              <span class="t-label">量子糾纏時延:</span>
              <span class="t-val highlight">{{ stats.networkLatencyPs }} ps</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">✉️</span>
            <div>
              <span class="t-label">累計發送電文:</span>
              <span class="t-val">{{ stats.totalSentByPlayer }} 則</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">👍</span>
            <div>
              <span class="t-label">全網點讚同調:</span>
              <span class="t-val">{{ stats.totalLikesReceived }} 次</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">💰</span>
            <div>
              <span class="t-label">累計獲賞信用:</span>
              <span class="t-val tip-val">{{ stats.totalTipsEarned.toLocaleString() }} CR</span>
            </div>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">⚡</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- Main BBS Grid: Channels & Messages vs Composer -->
        <div class="bbs-grid">
          <!-- Left: Channels & Messages Feed -->
          <div class="feed-column">
            <!-- Channel Tabs -->
            <div class="channel-tabs">
              <button
                v-for="ch in channels"
                :key="ch.id"
                class="channel-btn"
                :class="{ active: stats.activeChannel === ch.id }"
                @click="selectChannel(ch.id)"
              >
                <span class="ch-icon">{{ ch.icon }}</span>
                <span>{{ ch.name }}</span>
              </button>
            </div>

            <!-- Messages List -->
            <div class="messages-container glass-panel">
              <div v-if="filteredMessages.length === 0" class="empty-feed">
                該頻段暫無量子通訊波束信號。
              </div>

              <div
                v-for="msg in filteredMessages"
                :key="msg.id"
                class="message-card glass-panel"
              >
                <div class="msg-header">
                  <div class="msg-sender">
                    <span class="sender-name">{{ msg.senderName }}</span>
                    <span v-if="msg.tagBadge" class="msg-tag">{{ msg.tagBadge }}</span>
                  </div>
                  <span class="msg-time">{{ msg.timestamp }}</span>
                </div>

                <p class="msg-content">{{ msg.content }}</p>

                <div v-if="msg.coordinates" class="msg-coords">
                  📍 空間座標: [X: {{ msg.coordinates.x }}, Y: {{ msg.coordinates.y }}, Z: {{ msg.coordinates.z }}]
                </div>

                <div class="msg-actions">
                  <button class="msg-action-btn like-btn" @click="likeMessage(msg.id)">
                    ❤️ 讚 ({{ msg.likes }})
                  </button>
                  <button class="msg-action-btn tip-btn" @click="tipMessage(msg.id)">
                    🪙 贊助 500 CR ({{ msg.tipsCredits }})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Transmit Composer -->
          <div class="composer-column glass-panel">
            <h3 class="composer-title">🚀 發射超空間量子電文</h3>

            <div class="form-group">
              <label>發送者身分代號:</label>
              <input
                type="text"
                v-model="senderName"
                placeholder="例如: 開拓者本人"
                class="cyber-input"
              />
            </div>

            <div class="form-group">
              <label>目標共振頻段:</label>
              <select v-model="composerChannel" class="cyber-select" @change="onComposerChannelChange">
                <option v-for="ch in channels" :key="ch.id" :value="ch.id">
                  {{ ch.icon }} {{ ch.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>廣播電文內容:</label>
              <textarea
                v-model="broadcastText"
                rows="4"
                placeholder="輸入星際通報、戰術坐標求援或資源交易線報..."
                class="cyber-textarea"
                maxlength="200"
              ></textarea>
              <span class="char-count">{{ broadcastText.length }} / 200 字</span>
            </div>

            <div class="coords-checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="includeCoords" />
                附帶當前軌道空間坐標 [X: 840, Y: 120, Z: -360]
              </label>
            </div>

            <button
              class="transmit-btn"
              :disabled="!broadcastText.trim()"
              @click="postTransmission"
            >
              📡 執行量子同調全頻廣播 (Broadcast)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BroadcastChannel,
  quantumBroadcast
} from '../engine/quantumBroadcast'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)

const channels: { id: BroadcastChannel; name: string; icon: string }[] = [
  { id: 'galaxy_wide', name: '全銀河星網', icon: '🌌' },
  { id: 'deep_space_logs', name: '深空日誌', icon: '🛰️' },
  { id: 'syndicate_tactical', name: '辛迪加戰術', icon: '⚔️' },
  { id: 'black_market_wire', name: '暗網線報', icon: '💰' }
]

const senderName = ref('開拓者先鋒')
const composerChannel = ref<BroadcastChannel>(quantumBroadcast.stats.activeChannel)
const broadcastText = ref('')
const includeCoords = ref(true)

const stats = computed(() => {
  void refreshTrigger.value
  return quantumBroadcast.stats
})

const filteredMessages = computed(() => {
  void refreshTrigger.value
  return quantumBroadcast.getMessagesForChannel(stats.value.activeChannel)
})

function close(): void {
  ui.closeOverlay()
}

function selectChannel(ch: BroadcastChannel): void {
  quantumBroadcast.setChannel(ch)
  composerChannel.value = ch
  refreshTrigger.value += 1
}

function onComposerChannelChange(): void {
  quantumBroadcast.setChannel(composerChannel.value)
  refreshTrigger.value += 1
}

function likeMessage(id: string): void {
  quantumBroadcast.likeMessage(id)
  refreshTrigger.value += 1
}

function tipMessage(id: string): void {
  quantumBroadcast.tipMessage(id, 500)
  refreshTrigger.value += 1
}

function postTransmission(): void {
  if (!broadcastText.value.trim()) return

  const coords = includeCoords.value ? { x: 840, y: 120, z: -360 } : undefined
  quantumBroadcast.postBroadcast(broadcastText.value, senderName.value, coords)
  broadcastText.value = ''
  refreshTrigger.value += 1
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.broadcast-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(14, 18, 30, 0.95);
  border: 1px solid rgba(255, 145, 0, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(255, 145, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(22, 28, 48, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 145, 0, 0.25);
  background: rgba(255, 145, 0, 0.06);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title h2 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ff9100;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff9100;
}

.broadcast-content {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Telemetry Bar */
.telemetry-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.tele-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-icon {
  font-size: 1.3rem;
}

.t-label {
  font-size: 0.76rem;
  color: #889;
  display: block;
}

.t-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #00e5ff;
}

.tip-val {
  color: #ffea00;
  text-shadow: 0 0 6px rgba(255, 234, 0, 0.4);
}

/* Status Banner */
.status-banner {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 145, 0, 0.08);
  border: 1px solid rgba(255, 145, 0, 0.25);
  font-size: 0.82rem;
  color: #ffe0b2;
}

/* BBS Grid */
.bbs-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 14px;
}

@media (max-width: 820px) {
  .bbs-grid {
    grid-template-columns: 1fr;
  }
}

.feed-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.channel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #889;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.channel-btn.active {
  background: rgba(255, 145, 0, 0.16);
  border-color: #ff9100;
  color: #ff9100;
  font-weight: 600;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  max-height: 420px;
  overflow-y: auto;
}

.empty-feed {
  text-align: center;
  padding: 30px;
  color: #667;
  font-size: 0.85rem;
}

.message-card {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(18, 22, 34, 0.7);
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.msg-sender {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sender-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: #fff;
}

.msg-tag {
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 229, 255, 0.12);
  color: #00e5ff;
}

.msg-time {
  font-size: 0.7rem;
  color: #778;
}

.msg-content {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: #ccd;
}

.msg-coords {
  font-size: 0.72rem;
  color: #889;
  font-family: 'Courier New', Courier, monospace;
}

.msg-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.msg-action-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  color: #bbc;
  font-size: 0.72rem;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-btn:hover {
  color: #ff5252;
  border-color: #ff5252;
  background: rgba(255, 82, 82, 0.12);
}

.tip-btn:hover {
  color: #ffea00;
  border-color: #ffea00;
  background: rgba(255, 234, 0, 0.12);
}

/* Composer Column */
.composer-column {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.composer-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ff9100;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.76rem;
  color: #889;
}

.cyber-input, .cyber-select, .cyber-textarea {
  background: rgba(10, 14, 24, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 10px;
  color: #fff;
  font-size: 0.82rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.cyber-input:focus, .cyber-select:focus, .cyber-textarea:focus {
  border-color: #ff9100;
}

.char-count {
  font-size: 0.68rem;
  color: #667;
  text-align: right;
}

.coords-checkbox-row {
  font-size: 0.76rem;
  color: #889;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.transmit-btn {
  margin-top: auto;
  padding: 10px;
  background: linear-gradient(135deg, #e65100, #ff9100);
  border: 1px solid #ffa726;
  border-radius: 6px;
  color: #060c16;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 12px rgba(255, 145, 0, 0.35);
}

.transmit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 16px rgba(255, 145, 0, 0.5);
}

.transmit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
