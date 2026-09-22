<template>
  <div class="overlay" @click.self="close">
    <div class="voice-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-group">
          <span class="icon">🎙️</span>
          <h2>3D 空間語音通話 (WebRTC Spatial Voice)</h2>
          <span
            class="status-pill"
            :class="spatialVoice.connectionStatus"
          >
            {{ statusText }}
          </span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Controls Row -->
      <div class="controls-grid">
        <!-- Microphone Control Card -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">🎤 麥克風 (Microphone)</span>
            <button
              class="toggle-btn"
              :class="{ muted: spatialVoice.isMicMuted }"
              @click="toggleMic"
            >
              {{ spatialVoice.isMicMuted ? '🔇 已靜音 (Muted)' : '🎙️ 正常發話 (Live)' }}
            </button>
          </div>

          <!-- VU Meter -->
          <div class="vu-meter-container">
            <div class="vu-labels">
              <span>輸入音量</span>
              <span class="vu-val">{{ spatialVoice.isMicMuted ? 'Muted' : `${spatialVoice.localAudioLevel}%` }}</span>
            </div>
            <div class="vu-meter-track">
              <div
                class="vu-meter-fill"
                :style="{ width: `${spatialVoice.isMicMuted ? 0 : spatialVoice.localAudioLevel}%` }"
                :class="{ active: spatialVoice.isLocalSpeaking }"
              />
            </div>
          </div>
        </div>

        <!-- Deafen / Headphones Card -->
        <div class="control-card">
          <div class="card-header">
            <span class="card-title">🎧 耳機收聽 (Headphones)</span>
            <button
              class="toggle-btn"
              :class="{ deafened: spatialVoice.isDeafened }"
              @click="toggleDeafen"
            >
              {{ spatialVoice.isDeafened ? '🔇 全體靜音 (Deafened)' : '🔊 正常收聽 (Active)' }}
            </button>
          </div>

          <!-- Master Voice Volume Slider -->
          <div class="slider-group">
            <div class="slider-labels">
              <span>語音總音量</span>
              <span>{{ Math.round(spatialVoice.masterVolume * 100) }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              :value="spatialVoice.masterVolume"
              @input="onMasterVolumeChange"
            />
          </div>
        </div>

        <!-- Hearing Radius Card -->
        <div class="control-card full-width">
          <div class="card-header">
            <span class="card-title">📡 3D 空間聆聽半徑 (Spatial Hearing Range)</span>
            <span class="radius-val">{{ spatialVoice.hearingRadius }} 公尺 (Meters)</span>
          </div>
          <div class="slider-group">
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              :value="spatialVoice.hearingRadius"
              @input="onRadiusChange"
            />
            <div class="range-marks">
              <span>近距 (15m)</span>
              <span>標準 (50m)</span>
              <span>超遠視野 (120m)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Spatial Audio Test Beacon Section -->
      <div class="beacon-section">
        <div class="beacon-header">
          <div class="beacon-info">
            <span class="beacon-icon">🛰️</span>
            <div>
              <div class="beacon-title">3D 空間音訊測試信標 (Spatial Audio Beacon Test)</div>
              <div class="beacon-desc">
                在您前方 8 公尺生成虛擬 3D 空間音訊源。轉動視角或走動即可親耳體驗 HRTF 3D 環繞立體聲與距離衰減！
              </div>
            </div>
          </div>
          <button
            class="beacon-toggle-btn"
            :class="{ active: spatialVoice.beacon.active }"
            @click="toggleBeacon"
          >
            {{ spatialVoice.beacon.active ? '⏹️ 停止測試信標' : '▶️ 啟動空間測試信標' }}
          </button>
        </div>

        <div v-if="spatialVoice.beacon.active" class="beacon-telemetry">
          <div class="telemetry-pill">
            <span>📍 信標 3D 座標:</span>
            <strong>X: {{ spatialVoice.beacon.position.x.toFixed(1) }}, Y: {{ spatialVoice.beacon.position.y.toFixed(1) }}, Z: {{ spatialVoice.beacon.position.z.toFixed(1) }}</strong>
          </div>
          <div class="telemetry-pill">
            <span>📏 與玩家距離:</span>
            <strong :class="{ 'in-range': spatialVoice.beacon.inRange, 'out-range': !spatialVoice.beacon.inRange }">
              {{ spatialVoice.beacon.distance.toFixed(1) }} 公尺 ({{ spatialVoice.beacon.inRange ? '音訊範圍內' : '超出聆聽範圍' }})
            </strong>
          </div>
        </div>
      </div>

      <!-- Connected Voice Peers List -->
      <div class="peers-section">
        <div class="section-title">
          <span>👥 通話頻道玩家清單 (Connected Peers: {{ peersList.length }})</span>
          <span class="p2p-badge">⚡ WebRTC P2P Mesh</span>
        </div>

        <div v-if="peersList.length === 0" class="empty-peers">
          <div class="empty-icon">🛰️</div>
          <div class="empty-text">目前頻道內只有您一人在通話房間中。</div>
          <div class="empty-sub">
            您可以啟動上方的<strong>「空間測試信標」</strong>隨時測試 3D 定位與距離衰減，或開新分頁連線至伺服器即可多方通話！
          </div>
        </div>

        <div v-else class="peers-grid">
          <div
            v-for="peer in peersList"
            :key="peer.id"
            class="peer-card"
            :class="{ speaking: peer.isSpeaking }"
          >
            <div class="peer-top">
              <div class="peer-user">
                <div class="peer-avatar">👤</div>
                <div class="peer-details">
                  <span class="peer-name">{{ peer.creatorId }}</span>
                  <span class="peer-dist" :class="{ 'in-range': peer.inRange, 'out-range': !peer.inRange }">
                    📍 {{ peer.distance.toFixed(1) }}m ({{ peer.inRange ? '範圍內' : '超出半徑' }})
                  </span>
                </div>
              </div>

              <!-- Speaking / Mute Status Indicator -->
              <div class="peer-badges">
                <span v-if="peer.isMuted" class="badge muted">🎙️ 靜音</span>
                <span v-else-if="peer.isSpeaking" class="badge speaking">🔊 發話中</span>
                <span v-else class="badge idle">🎧 收聽中</span>
              </div>
            </div>

            <!-- Peer Volume & Mute Controls -->
            <div class="peer-controls">
              <div class="peer-slider">
                <span class="control-label">個別音量: {{ Math.round(peer.volume * 100) }}%</span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  :value="peer.volume"
                  @input="onPeerVolumeChange(peer.id, $event)"
                />
              </div>
              <button
                class="peer-mute-btn"
                :class="{ active: peer.isSelfMutedLocally }"
                @click="togglePeerMuteLocally(peer.id)"
              >
                {{ peer.isSelfMutedLocally ? '🚫 本地已靜音' : '🔊 靜音此人' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="tech-note">
          ⚡ 3D HRTF Web Audio Panner • WebRTC Mesh Signaling • Port: 4000
        </div>
        <button class="done-btn" @click="close">關閉 (ESC / X / F8)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { spatialVoice, SpatialVoicePeer } from '@/engine/spatialVoice'
import { sound } from '@/engine/audio'

const ui = useUIStore()
const refreshTimer = ref<any>(null)

const peersList = computed<SpatialVoicePeer[]>(() => {
  return spatialVoice.getPeersArray()
})

const statusText = computed(() => {
  switch (spatialVoice.connectionStatus) {
    case 'connected': return '🟢 已連線 (Connected)'
    case 'connecting': return '🟡 連線中 (Connecting...)'
    default: return '⚪ 未連線 (Disconnected)'
  }
})

function toggleMic(): void {
  spatialVoice.toggleMic()
  sound.playUiClick()
}

function toggleDeafen(): void {
  spatialVoice.toggleDeafen()
  sound.playUiClick()
}

function onMasterVolumeChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  spatialVoice.setMasterVolume(val)
}

function onRadiusChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  spatialVoice.setHearingRadius(val)
}

function toggleBeacon(): void {
  // Use camera position if available, otherwise default
  const pos = (window as any).__lastPlayerPos || { x: 0, y: 1, z: 0 }
  spatialVoice.toggleBeacon(pos)
  sound.playUiClick()
}

function onPeerVolumeChange(peerId: string, e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  spatialVoice.setPeerVolume(peerId, val)
}

function togglePeerMuteLocally(peerId: string): void {
  spatialVoice.togglePeerMuteLocally(peerId)
  sound.playUiClick()
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  // Trigger reactive tick for speaking meters & distances
  refreshTimer.value = setInterval(() => {
    // triggers Vue reactivity update
  }, 100)
})

onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 18, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.voice-panel {
  width: 720px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(10, 14, 26, 0.94);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 32px rgba(0, 255, 255, 0.15);
  color: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 14px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 1.8rem;
}

.title-group h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #00ffff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.status-pill.connected {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.4);
}

.status-pill.connecting {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
}

.status-pill.disconnected {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.4rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

/* Controls Grid */
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.control-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #eee;
}

.toggle-btn {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #00ffff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: rgba(0, 255, 255, 0.3);
}

.toggle-btn.muted, .toggle-btn.deafened {
  background: rgba(255, 70, 70, 0.15);
  border-color: rgba(255, 70, 70, 0.4);
  color: #ff5555;
}

/* VU Meter */
.vu-meter-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vu-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
}

.vu-val {
  font-weight: 600;
  color: #00ff88;
}

.vu-meter-track {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.vu-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #ffd700 80%, #ff3366);
  border-radius: 4px;
  transition: width 0.08s ease-out;
}

.vu-meter-fill.active {
  box-shadow: 0 0 10px #00ff88;
}

/* Sliders */
.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
}

input[type="range"] {
  width: 100%;
  accent-color: #00ffff;
  cursor: pointer;
}

.range-marks {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #666;
}

.radius-val {
  font-size: 0.8rem;
  font-weight: 700;
  color: #00ffff;
}

/* Beacon Section */
.beacon-section {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.beacon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.beacon-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.beacon-icon {
  font-size: 1.8rem;
}

.beacon-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #00ffff;
}

.beacon-desc {
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 2px;
}

.beacon-toggle-btn {
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  color: #00ffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.beacon-toggle-btn.active {
  background: rgba(255, 70, 70, 0.2);
  border-color: #ff5555;
  color: #ff5555;
}

.beacon-telemetry {
  display: flex;
  gap: 16px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
}

.telemetry-pill strong.in-range {
  color: #00ff88;
}

.telemetry-pill strong.out-range {
  color: #ff5555;
}

/* Peers Section */
.peers-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ccc;
}

.p2p-badge {
  font-size: 0.7rem;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 2px 8px;
  border-radius: 6px;
}

.empty-peers {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ddd;
}

.empty-sub {
  font-size: 0.75rem;
  color: #888;
  margin-top: 6px;
}

.peers-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.peer-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s;
}

.peer-card.speaking {
  border-color: #00ff88;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.2);
}

.peer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.peer-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.peer-avatar {
  font-size: 1.4rem;
}

.peer-details {
  display: flex;
  flex-direction: column;
}

.peer-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00ffff;
}

.peer-dist {
  font-size: 0.75rem;
  color: #888;
}

.peer-dist.in-range { color: #00ff88; }
.peer-dist.out-range { color: #ff5555; }

.peer-badges .badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.badge.speaking {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.badge.muted {
  background: rgba(255, 70, 70, 0.2);
  color: #ff5555;
}

.badge.idle {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

.peer-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.peer-slider {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-label {
  font-size: 0.7rem;
  color: #888;
}

.peer-mute-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ccc;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
}

.peer-mute-btn.active {
  background: rgba(255, 70, 70, 0.2);
  border-color: #ff5555;
  color: #ff5555;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.tech-note {
  font-size: 0.7rem;
  color: #666;
}

.done-btn {
  background: #00ffff;
  color: #000;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
