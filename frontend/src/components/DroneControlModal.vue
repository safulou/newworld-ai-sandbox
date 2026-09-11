<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>🛸 無人偵查機控制終端 (Sparky Drone Command)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Telemetry Status Grid -->
      <div class="telemetry-grid">
        <div class="telemetry-card">
          <span class="label">狀態</span>
          <span class="val" :class="{ active: droneState.isActive }">
            {{ droneState.isActive ? '🟢 巡航中 (Active)' : '⚪ 待命中 (Standby)' }}
          </span>
        </div>
        <div class="telemetry-card">
          <span class="label">電池電量</span>
          <span class="val">{{ Math.round(droneState.batteryPercent) }}%</span>
          <div class="batt-bar">
            <div class="batt-fill" :style="{ width: droneState.batteryPercent + '%' }"></div>
          </div>
        </div>
        <div class="telemetry-card">
          <span class="label">飛行高度</span>
          <span class="val">{{ Math.round(droneState.altitude) }}m AGL</span>
        </div>
        <div class="telemetry-card">
          <span class="label">熱成像視覺</span>
          <span class="val" :class="{ active: droneState.thermalVision }">
            {{ droneState.thermalVision ? '🔥 ON' : '❄️ OFF' }}
          </span>
        </div>
      </div>

      <!-- Flight Modes -->
      <div class="mode-section">
        <h3>🧭 飛行巡航模式</h3>
        <div class="modes-row">
          <button
            class="mode-btn"
            :class="{ active: droneState.mode === 'manual' }"
            @click="setMode('manual')"
          >
            🕹️ 手動懸停 (Manual)
          </button>
          <button
            class="mode-btn"
            :class="{ active: droneState.mode === 'orbit' }"
            @click="setMode('orbit')"
          >
            🔄 環繞偵查 (Orbit)
          </button>
          <button
            class="mode-btn"
            :class="{ active: droneState.mode === 'survey' }"
            @click="setMode('survey')"
          >
            📡 地形掃描 (Survey)
          </button>
        </div>
      </div>

      <!-- Drone Actions -->
      <div class="drone-actions">
        <button class="action-btn" @click="toggleThermal">
          👁️ 切換熱成像/夜視
        </button>
        <button v-if="!droneState.isActive" class="action-btn primary" @click="launchDrone">
          🚀 升空無人機 (Launch)
        </button>
        <button v-else class="action-btn danger" @click="recallDrone">
          🛬 召回無人機 (Recall)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { droneManager, DroneState } from '@/engine/drone'
import { useUIStore } from '@/stores/ui'

const emit = defineEmits<{
  (e: 'launch-drone'): void
  (e: 'recall-drone'): void
}>()

const ui = useUIStore()
const droneState = ref<DroneState>(droneManager.getState())
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    droneState.value = droneManager.getState()
  }, 200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function launchDrone(): void {
  emit('launch-drone')
  droneState.value = droneManager.getState()
}

function recallDrone(): void {
  emit('recall-drone')
  droneState.value = droneManager.getState()
}

function toggleThermal(): void {
  droneManager.toggleThermal()
  droneState.value = droneManager.getState()
}

function setMode(mode: 'manual' | 'orbit' | 'survey'): void {
  droneManager.setMode(mode)
  droneState.value = droneManager.getState()
}

function close(): void {
  ui.setDroneModal(false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 90%;
  max-width: 540px;
  border-radius: 16px;
  padding: 24px;
  background: rgba(14, 20, 36, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #00ffff;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

.telemetry-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.telemetry-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
}

.telemetry-card .label {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.telemetry-card .val {
  font-size: 1.1rem;
  font-weight: bold;
}

.telemetry-card .val.active {
  color: #39ff14;
}

.batt-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.batt-fill {
  height: 100%;
  background: linear-gradient(90deg, #39ff14, #00f0ff);
  transition: width 0.3s;
}

.modes-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.mode-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
}

.mode-btn.active {
  background: rgba(0, 255, 255, 0.18);
  border-color: #00ffff;
  color: #00ffff;
  font-weight: bold;
}

.drone-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00f0ff, #7000ff);
  border: none;
}

.action-btn.danger {
  background: linear-gradient(135deg, #ff4d4f, #d9363e);
  border: none;
}
</style>
