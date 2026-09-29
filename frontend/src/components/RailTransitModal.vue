<template>
  <div class="rail-overlay" @click.self="close">
    <div class="rail-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🚄</span>
          <div>
            <h2>磁浮超迴路列車調度台 (Hyperloop Transit)</h2>
            <p class="subtitle">跨區塊與多元次元高速磁浮客運系統</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Route Selector -->
      <div class="routes-container">
        <button
          v-for="route in availableRoutes"
          :key="route.id"
          :class="['route-chip', { active: route.id === currentRouteId }]"
          :style="{ '--route-color': route.color }"
          @click="selectRoute(route.id)"
        >
          <span class="dot"></span>
          {{ route.name }}
        </button>
      </div>

      <div class="main-grid">
        <!-- Left: Telemetry & Pod Cockpit Controls -->
        <div class="cockpit-panel">
          <div class="speed-gauge">
            <div class="speed-num">{{ Math.round(podState.speedKmh) }}</div>
            <div class="speed-unit">KM / H</div>
            <div class="speed-bar-bg">
              <div
                class="speed-bar-fill"
                :style="{ width: (podState.speedKmh / 120) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <div class="telemetry-rows">
            <div class="tele-item">
              <span class="label">行駛狀態</span>
              <span class="val" :class="{ moving: podState.speedKmh > 5 }">
                {{ podState.speedKmh > 5 ? '⚡ 高速巡航中' : '⚪ 月台停靠中' }}
              </span>
            </div>
            <div class="tele-item">
              <span class="label">自動定速巡航</span>
              <span class="val" :class="{ on: podState.isAutoCruise }">
                {{ podState.isAutoCruise ? '🟢 啟用 (Auto)' : '⚪ 手動 (Manual)' }}
              </span>
            </div>
            <div class="tele-item">
              <span class="label">搭乘模式</span>
              <span class="val" :class="{ boarded: podState.isBoarded }">
                {{ podState.isBoarded ? '🧑‍🚀 已入座登車' : '🚶 車外月台' }}
              </span>
            </div>
          </div>

          <!-- Target Speed Slider -->
          <div class="slider-control" v-if="!podState.isAutoCruise">
            <div class="slider-header">
              <span>設定手動巡航目標速度</span>
              <span>{{ targetSpeed }} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              v-model.number="targetSpeed"
              @input="onSpeedSliderChange"
            />
          </div>

          <!-- Actions -->
          <div class="action-grid">
            <button
              :class="['btn-action', { active: podState.isBoarded }]"
              @click="toggleBoard"
            >
              {{ podState.isBoarded ? '🚶 離開車廂 (Dismount)' : '🚀 登車搭乘 (Board Pod)' }}
            </button>
            <button class="btn-action secondary" @click="toggleCruise">
              {{ podState.isAutoCruise ? '🕹️ 切換手動駕駛' : '🤖 啟動自動巡航' }}
            </button>
          </div>
        </div>

        <!-- Right: Stations Timeline -->
        <div class="stations-panel">
          <h3>📍 沿線站點導覽</h3>
          <div class="station-timeline">
            <div
              v-for="(st, idx) in activeStations"
              :key="st.id"
              class="station-node"
            >
              <div class="node-indicator">
                <span class="node-circle"></span>
                <span class="node-line" v-if="idx < activeStations.length - 1"></span>
              </div>
              <div class="node-info">
                <div class="station-title">{{ st.name }}</div>
                <div class="station-coords">
                  座標: [{{ Math.round(st.position.x) }}, {{ Math.round(st.position.y) }}, {{ Math.round(st.position.z) }}]
                </div>
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
import { cyberRail, TrainPodState, RailRoute } from '@/engine/cyberRail'

const ui = useUIStore()

const currentRouteId = ref<string>(cyberRail.currentRouteId)
const podState = ref<TrainPodState>({ ...cyberRail.pod })
const targetSpeed = ref<number>(cyberRail.pod.targetSpeedKmh)
const availableRoutes = computed<RailRoute[]>(() => cyberRail.routes)
const activeStations = computed(() => cyberRail.currentRoute.stations)

let pollTimer: number | null = null

onMounted(() => {
  pollTimer = window.setInterval(() => {
    podState.value = { ...cyberRail.pod }
    currentRouteId.value = cyberRail.currentRouteId
  }, 100)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function selectRoute(id: string): void {
  cyberRail.selectRoute(id)
  currentRouteId.value = id
  podState.value = { ...cyberRail.pod }
}

function toggleBoard(): void {
  const boarded = cyberRail.toggleBoarding()
  podState.value = { ...cyberRail.pod }
  ui.setBuildStatus(boarded ? '🚄 已進入超迴路列車艙！享受高速穿梭體驗' : '🚶 已離開列車艙')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function toggleCruise(): void {
  cyberRail.toggleAutoCruise()
  podState.value = { ...cyberRail.pod }
}

function onSpeedSliderChange(): void {
  cyberRail.setTargetSpeed(targetSpeed.value)
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.rail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;
}

.rail-modal {
  width: 95%;
  max-width: 820px;
  background: rgba(10, 16, 32, 0.96);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.15);
  padding: 24px;
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #00ffff);
}

.modal-header h2 {
  font-size: 1.35rem;
  margin: 0;
  background: linear-gradient(135deg, #00ffff, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  font-size: 1.2rem;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(255, 60, 60, 0.2);
  color: #ff6b6b;
}

.routes-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.route-chip {
  padding: 8px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.route-chip .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--route-color);
  box-shadow: 0 0 6px var(--route-color);
}

.route-chip.active {
  background: rgba(0, 255, 255, 0.15);
  border-color: var(--route-color);
  color: #ffffff;
  font-weight: 700;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

.cockpit-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.speed-gauge {
  text-align: center;
  margin-bottom: 16px;
}

.speed-num {
  font-size: 3rem;
  font-weight: 900;
  font-family: monospace;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  line-height: 1;
}

.speed-unit {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
  letter-spacing: 2px;
}

.speed-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
}

.speed-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #38bdf8);
  transition: width 0.1s linear;
}

.telemetry-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.tele-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}

.tele-item .label {
  color: #94a3b8;
}

.tele-item .val.moving {
  color: #38bdf8;
  font-weight: 700;
}

.tele-item .val.on {
  color: #39ff14;
}

.tele-item .val.boarded {
  color: #f59e0b;
  font-weight: 700;
}

.slider-control {
  margin-bottom: 16px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #94a3b8;
  margin-bottom: 6px;
}

.slider-control input[type="range"] {
  width: 100%;
}

.action-grid {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.btn-action {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #00ffff, #38bdf8);
  color: #050b14;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.35);
  transition: all 0.2s;
}

.btn-action.active {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
}

.btn-action.secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  box-shadow: none;
}

.stations-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
}

.stations-panel h3 {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: #38bdf8;
}

.station-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.station-node {
  display: flex;
  gap: 14px;
}

.node-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
}

.node-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 8px #00ffff;
}

.node-line {
  width: 2px;
  flex: 1;
  background: rgba(0, 255, 255, 0.3);
  margin-top: 4px;
  min-height: 24px;
}

.station-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
}

.station-coords {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
  margin-top: 2px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 720px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
