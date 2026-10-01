<template>
  <div class="ranger-overlay" @click.self="close">
    <div class="ranger-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🐾</span>
          <div>
            <h2>AI 荒野生態巡護員與機械獸基因繁育 (Cyber Rangers)</h2>
            <p class="subtitle">自然生態自律修復、環境多樣性指標與賽博獵犬基因突變繁育</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Ecosystem Health Banner -->
      <div class="eco-banner">
        <div class="eco-gauge">
          <div class="gauge-top">
            <span>🌿 元宇宙生態健康指標 (Ecosystem Health Index)</span>
            <span class="gauge-val" :class="{ optimal: healthIndex >= 80 }">{{ healthIndex }}%</span>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill" :style="{ width: healthIndex + '%' }"></div>
          </div>
        </div>
        <div class="buff-card">
          <span class="buff-title">全域增益 (Global Eco-Buff)</span>
          <span class="buff-desc" :class="{ active: isBuffActive }">
            {{ isBuffActive ? '⚡ 資源採集速度 +25% 生效中！' : '⚪ 生態指數需大於 80% 啟動' }}
          </span>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="main-grid">
        <!-- Left: Autonomous Eco-Wardens -->
        <div class="panel-section">
          <div class="section-title">
            <span>🚁 自律生態巡護無人機 (Eco-Warden Drones)</span>
            <span class="badge">{{ wardens.length }} 架執勤中</span>
          </div>

          <div class="wardens-list">
            <div v-for="w in wardens" :key="w.id" class="warden-card">
              <div class="w-header">
                <span class="w-name">{{ w.name }}</span>
                <span class="w-status">{{ statusLabel(w.status) }}</span>
              </div>
              <div class="w-stats">
                <span>座標: [{{ Math.round(w.position.x) }}, {{ Math.round(w.position.z) }}]</span>
                <span>育苗: {{ w.seedlingsPlanted }} 株</span>
                <span>電量: {{ w.batteryPercent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Genetic Breeding & Mutation Chamber -->
        <div class="panel-section">
          <div class="section-title">
            <span>🧬 機械獸基因繁育艙 (Breeding & Mutation)</span>
            <span class="badge">{{ mutatedHounds.length }} 隻繁育後代</span>
          </div>

          <div class="chamber-box">
            <div class="chamber-inputs">
              <div class="parent-col">
                <label>母體 (Parent A)</label>
                <input v-model="parentA" type="text" />
              </div>
              <div class="parent-col">
                <label>父體 (Parent B)</label>
                <input v-model="parentB" type="text" />
              </div>
            </div>

            <div class="catalyzer-row">
              <label>等離子催化劑 (Catalyzer):</label>
              <select v-model="selectedCatalyzer">
                <option value="quantum_plasma">✨ 量子等離子 (催化光翼)</option>
                <option value="chrono_serum">⏱️ 時空基因血清 (催化雙聯脈衝)</option>
                <option value="cryo_stabilizer">❄️ 超低溫穩定劑 (催化幻影護盾)</option>
              </select>
            </div>

            <!-- Progress Bar -->
            <div v-if="chamber.isActive" class="breed-progress">
              <div class="bp-label">
                <span>{{ chamber.result ? '🎉 基因突變成功！幼體已誕生' : '🧬 基因重構進行中...' }}</span>
                <span>{{ Math.round(chamber.progress * 100) }}%</span>
              </div>
              <div class="bp-bar">
                <div class="bp-fill" :style="{ width: chamber.progress * 100 + '%' }"></div>
              </div>
            </div>

            <button
              class="breed-btn"
              :disabled="chamber.isActive && !chamber.result"
              @click="startBreeding"
            >
              {{ chamber.isActive && !chamber.result ? '🧬 繁育重構中...' : '⚡ 開始基因重構繁育' }}
            </button>
          </div>

          <!-- Mutated Offspring List -->
          <div class="offspring-list">
            <div
              v-for="pup in mutatedHounds"
              :key="pup.id"
              class="pup-card"
              :style="{ borderLeftColor: pup.skinColor }"
            >
              <div class="pup-top">
                <span class="pup-name" :style="{ color: pup.skinColor }">{{ pup.name }}</span>
                <span class="pup-trait">{{ pup.geneTrait }}</span>
              </div>
              <div class="pup-stats">
                <span>⚡ 戰鬥雷射: {{ pup.laserDamage }} 傷害</span>
                <span>👟 機動速度: {{ (pup.speedMultiplier * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { cyberRangers } from '@/engine/cyberRangers'

const uiStore = useUIStore()

const wardens = ref(cyberRangers.wardens)
const chamber = ref(cyberRangers.breedingChamber)
const mutatedHounds = ref(cyberRangers.mutatedHounds)
const healthIndex = ref(cyberRangers.ecosystemHealthIndex)
const isBuffActive = ref(cyberRangers.isEcoBuffActive)

const parentA = ref(chamber.value.parentA)
const parentB = ref(chamber.value.parentB)
const selectedCatalyzer = ref<'quantum_plasma' | 'chrono_serum' | 'cryo_stabilizer'>('quantum_plasma')

let timer: number | null = null

function updateState() {
  wardens.value = [...cyberRangers.wardens]
  chamber.value = { ...cyberRangers.breedingChamber }
  mutatedHounds.value = [...cyberRangers.mutatedHounds]
  healthIndex.value = cyberRangers.ecosystemHealthIndex
  isBuffActive.value = cyberRangers.isEcoBuffActive
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

function startBreeding() {
  cyberRangers.startBreeding(parentA.value, parentB.value, selectedCatalyzer.value)
  updateState()
}

function statusLabel(status: string): string {
  switch (status) {
    case 'patrolling': return '🌲 巡邏護林'
    case 'replanting': return '🌱 荒地育苗'
    case 'extinguishing_fire': return '🧯 撲滅火源'
    case 'healing_fauna': return '🩺 救治動物'
    default: return '⚪ 待命'
  }
}
</script>

<style scoped>
.ranger-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ranger-modal {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(57, 255, 20, 0.35);
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.15);
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
  border-bottom: 1px solid rgba(57, 255, 20, 0.2);
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
  color: #39ff14;
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

.eco-banner {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
}

.eco-gauge {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gauge-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.gauge-val {
  font-weight: 800;
  font-size: 1.1rem;
}

.gauge-val.optimal {
  color: #39ff14;
}

.gauge-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #39ff14);
}

.buff-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.buff-title {
  font-size: 0.75rem;
  color: #94a3b8;
}

.buff-desc {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.buff-desc.active {
  color: #ffe600;
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
  background: rgba(57, 255, 20, 0.15);
  color: #39ff14;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.wardens-list, .offspring-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
}

.warden-card, .pup-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pup-card {
  border-left: 4px solid #39ff14;
}

.w-header, .pup-top {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.85rem;
}

.w-status, .pup-trait {
  font-size: 0.75rem;
  color: #39ff14;
}

.w-stats, .pup-stats {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.chamber-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chamber-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.parent-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.parent-col label, .catalyzer-row label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.parent-col input, .catalyzer-row select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 6px;
  font-size: 0.82rem;
}

.catalyzer-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breed-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bp-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #39ff14;
}

.bp-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bp-fill {
  height: 100%;
  background: #39ff14;
  transition: width 0.2s linear;
}

.breed-btn {
  background: rgba(57, 255, 20, 0.2);
  border: 1px solid #39ff14;
  color: #39ff14;
  font-weight: 700;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.breed-btn:hover:not(:disabled) {
  background: #39ff14;
  color: #040810;
}

.breed-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
