<template>
  <div class="observatory-overlay" @click.self="close">
    <div class="observatory-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🔭</span>
          <div>
            <h2>全息星空天文台與天體軌道力學 (Celestial Observatory)</h2>
            <p class="subtitle">雙子月克卜勒軌道運行、流星雨墜星採集與系外行星光譜巡天</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Inventory & Cosmic Events Banner -->
      <div class="telemetry-bar">
        <div class="stat-card">
          <span class="stat-label">宇宙星塵儲量 (Cosmic Stardust)</span>
          <span class="stat-value highlight">{{ stardustInventory }} <small>克拉</small></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">已登錄系外行星</span>
          <span class="stat-value">{{ discoveries.length }} <small>顆</small></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">雙子月天象週期</span>
          <span class="stat-value cyan">青月 (120s) / 赤月 (75s)</span>
        </div>
        <div class="stat-card action-card">
          <button class="meteor-btn" @click="triggerMeteorShower">
            ☄️ 召喚流星雨 (Meteor Shower)
          </button>
        </div>
      </div>

      <!-- Main Columns -->
      <div class="main-grid">
        <!-- Left: Celestial Orrery & Bodies -->
        <div class="panel-section">
          <div class="section-title">
            <span>🌌 天體軌道運行儀 (Celestial Orrery)</span>
            <span class="badge">{{ bodies.length }} 天體運行中</span>
          </div>

          <div class="bodies-list">
            <div v-for="b in bodies" :key="b.id" class="body-card" :style="{ borderColor: b.color }">
              <div class="body-top">
                <span class="b-name" :style="{ color: b.color }">{{ b.name }}</span>
                <span class="b-phase">{{ b.phase }}</span>
              </div>
              <div class="b-stats">
                <span>軌道半徑: {{ b.orbitRadius }}m</span>
                <span>公轉週期: {{ b.orbitalPeriodSec }}s</span>
                <span>座標: [{{ Math.round(b.position.x) }}, {{ Math.round(b.position.z) }}]</span>
              </div>
            </div>
          </div>

          <!-- Stardust Harvesting -->
          <div class="stardust-box">
            <div class="box-header">
              <span>☄️ 墜星碎屑節點 (Stardust Deposits)</span>
              <span class="tag">{{ activeDeposits.length }} 處墜點</span>
            </div>
            <div v-if="activeDeposits.length === 0" class="empty-hint">
              目前地表無墜落星塵。請點擊上方按鈕召喚流星雨！
            </div>
            <div v-else class="deposits-list">
              <div v-for="d in activeDeposits" :key="d.id" class="deposit-item">
                <span>座標 [{{ Math.round(d.x) }}, {{ Math.round(d.y) }}, {{ Math.round(d.z) }}] (+{{ d.value }} 星塵)</span>
                <button class="harvest-btn" @click="harvest(d.id)">⛏️ 採集</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Spectrograph Telescope & Exoplanet Scanner -->
        <div class="panel-section">
          <div class="section-title">
            <span>🛰️ 光學分光望遠鏡巡天 (Exoplanet Spectrograph)</span>
            <button class="scan-btn" @click="scanTelescope">📡 開始全天域掃描</button>
          </div>

          <div class="exoplanet-list">
            <div v-for="exo in discoveries" :key="exo.id" class="exo-card">
              <div class="exo-header">
                <span class="exo-name">{{ exo.name }}</span>
                <span :class="['habit-badge', { habitable: exo.habitable }]">
                  {{ exo.habitable ? '🌱 宜居星球' : '☣️ 極端環境' }}
                </span>
              </div>
              <div class="exo-details">
                <span>光譜型: {{ exo.spectralClass }}</span>
                <span>距離: {{ exo.distanceLy }} 光年</span>
                <span>地表均溫: {{ exo.surfaceTempC }} °C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { celestialObservatory } from '@/engine/celestialObservatory'

const uiStore = useUIStore()

const bodies = ref(celestialObservatory.celestialBodies)
const stardustInventory = ref(celestialObservatory.cosmicStardustInventory)
const discoveries = ref(celestialObservatory.discoveries)
const deposits = ref(celestialObservatory.stardustDeposits)

const activeDeposits = computed(() => deposits.value.filter(d => !d.harvested))

let timer: number | null = null

function updateState() {
  bodies.value = [...celestialObservatory.celestialBodies]
  stardustInventory.value = celestialObservatory.cosmicStardustInventory
  discoveries.value = [...celestialObservatory.discoveries]
  deposits.value = [...celestialObservatory.stardustDeposits]
}

onMounted(() => {
  timer = window.setInterval(updateState, 200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function close() {
  uiStore.mode = 'game'
}

function triggerMeteorShower() {
  celestialObservatory.triggerMeteorShower(6)
  updateState()
}

function harvest(id: string) {
  celestialObservatory.harvestStardust(id)
  updateState()
}

function scanTelescope() {
  celestialObservatory.scanExoplanet()
  updateState()
}
</script>

<style scoped>
.observatory-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.observatory-modal {
  width: 920px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
  border-radius: 12px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  padding-bottom: 14px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00f0ff;
  margin: 0;
}

.subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.telemetry-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
}

.stat-value.highlight { color: #ffe600; }
.stat-value.cyan { color: #00f0ff; }

.action-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.meteor-btn {
  width: 100%;
  height: 100%;
  background: rgba(255, 230, 0, 0.15);
  border: 1px solid #ffe600;
  color: #ffe600;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.meteor-btn:hover {
  background: rgba(255, 230, 0, 0.3);
  box-shadow: 0 0 15px rgba(255, 230, 0, 0.4);
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #38bdf8;
}

.badge {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.bodies-list, .exoplanet-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.body-card, .exo-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.body-top, .exo-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.85rem;
}

.b-phase {
  font-size: 0.75rem;
  color: #94a3b8;
}

.b-stats, .exo-details {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.stardust-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.box-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #cbd5e1;
}

.tag {
  color: #ffe600;
}

.empty-hint {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
  padding: 6px 0;
}

.deposits-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 110px;
  overflow-y: auto;
}

.deposit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
}

.harvest-btn {
  background: rgba(255, 230, 0, 0.2);
  border: 1px solid #ffe600;
  color: #ffe600;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.72rem;
  cursor: pointer;
}

.scan-btn {
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.habit-badge {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.habit-badge.habitable {
  background: rgba(57, 255, 20, 0.2);
  color: #39ff14;
}
</style>
