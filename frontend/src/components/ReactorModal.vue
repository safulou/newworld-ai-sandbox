<template>
  <div class="reactor-overlay" @click.self="close">
    <div class="reactor-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">☢️</span>
          <div>
            <h2>等離子核聚變反應堆控制台 (Plasma Fusion Reactor)</h2>
            <p class="subtitle">超導磁約束聚變核心、低溫冷卻管網與熱力學高壓蒸氣輪機</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Warning Klaxon Banner -->
      <div v-if="reactor.isMeltdownWarning" class="meltdown-banner">
        <span class="alarm-icon">⚠️</span>
        <span>警告：核心溫度超過 2600°C！磁約束力場衰退中，請立即插入控制棒或啟動緊急 SCRAM 停機！</span>
      </div>

      <!-- Main Gauges -->
      <div class="gauges-grid">
        <div class="gauge-card">
          <span class="g-label">核心溫度 (Core Temp)</span>
          <span
            class="g-val"
            :class="{
              nominal: reactor.coreTempC < 1500,
              hot: reactor.coreTempC >= 1500 && reactor.coreTempC <= 2600,
              critical: reactor.coreTempC > 2600,
            }"
          >
            {{ Math.round(reactor.coreTempC) }} <small>°C</small>
          </span>
          <div class="temp-bar">
            <div
              class="temp-fill"
              :style="{ width: Math.min(100, (reactor.coreTempC / 3000) * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="gauge-card">
          <span class="g-label">輸出功率 (Power Output)</span>
          <span class="g-val highlight">{{ Math.round(reactor.powerOutputMw) }} <small>MW</small></span>
          <span class="g-sub">蒸氣輪機: {{ Math.round(turbineRpm) }} RPM</span>
        </div>

        <div class="gauge-card">
          <span class="g-label">磁約束力場完整度</span>
          <span
            class="g-val"
            :class="{ safe: reactor.containmentFieldIntegrity > 50, danger: reactor.containmentFieldIntegrity <= 50 }"
          >
            {{ Math.round(reactor.containmentFieldIntegrity) }} <small>%</small>
          </span>
          <span class="g-sub">蒸氣壓: {{ Math.round(reactor.steamPressureKpa) }} kPa</span>
        </div>
      </div>

      <!-- Controls Grid -->
      <div class="controls-grid">
        <!-- Control Rods Adjustment -->
        <div class="control-box">
          <div class="box-title">
            <span>🎚️ 控制棒插入深度 (Control Rods)</span>
            <span class="val-tag">{{ reactor.controlRodsPercent }}% 插入</span>
          </div>
          <input
            v-model.number="rodsPercent"
            type="range"
            min="0"
            max="100"
            class="slider"
            @input="updateRods"
          />
          <div class="slider-labels">
            <span>0% (全功率燃燒)</span>
            <span>50% (巡航負載)</span>
            <span>100% (完全中子阻尼)</span>
          </div>
        </div>

        <!-- Coolant Flow Rate -->
        <div class="control-box">
          <div class="box-title">
            <span>❄️ 超低溫冷卻液流量 (Coolant Flow)</span>
            <span class="val-tag cyan">{{ reactor.coolantFlowLps }} L/s</span>
          </div>
          <input
            v-model.number="coolantFlow"
            type="range"
            min="0"
            max="500"
            class="slider cyan"
            @input="updateCoolant"
          />
          <div class="slider-labels">
            <span>0 L/s</span>
            <span>250 L/s</span>
            <span>500 L/s (極限注水)</span>
          </div>
        </div>
      </div>

      <!-- Actions Bottom Bar -->
      <div class="actions-bar">
        <button
          v-if="!reactor.isIgnited || reactor.isScrammed"
          class="ignite-btn"
          @click="ignite"
        >
          ⚡ 點火聚變反應核心 (Ignite Plasma Core)
        </button>
        <button v-else class="scram-btn" @click="scram">
          🛑 緊急停機 (EMERGENCY SCRAM)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { fluidThermodynamics } from '@/engine/fluidThermodynamics'

const uiStore = useUIStore()

const reactor = ref(fluidThermodynamics.reactor)
const turbineRpm = ref(fluidThermodynamics.turbineRpm)

const rodsPercent = ref(fluidThermodynamics.reactor.controlRodsPercent)
const coolantFlow = ref(fluidThermodynamics.reactor.coolantFlowLps)

let timer: number | null = null

function updateState() {
  reactor.value = { ...fluidThermodynamics.reactor }
  turbineRpm.value = fluidThermodynamics.turbineRpm
}

onMounted(() => {
  timer = window.setInterval(updateState, 150)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function close() {
  uiStore.mode = 'game'
}

function updateRods() {
  fluidThermodynamics.setControlRods(rodsPercent.value)
  updateState()
}

function updateCoolant() {
  fluidThermodynamics.setCoolantFlow(coolantFlow.value)
  updateState()
}

function ignite() {
  fluidThermodynamics.igniteReactor()
  rodsPercent.value = fluidThermodynamics.reactor.controlRodsPercent
  updateState()
}

function scram() {
  fluidThermodynamics.scramReactor()
  rodsPercent.value = 100
  updateState()
}
</script>

<style scoped>
.reactor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.reactor-modal {
  width: 860px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(255, 69, 0, 0.35);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.18);
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
  border-bottom: 1px solid rgba(255, 69, 0, 0.2);
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
  color: #ff6b35;
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

.meltdown-banner {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.8; }
  to { opacity: 1; }
}

.gauges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.gauge-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.g-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.g-val {
  font-size: 1.6rem;
  font-weight: 800;
}

.g-val.nominal { color: #38bdf8; }
.g-val.hot { color: #f59e0b; }
.g-val.critical { color: #ef4444; }
.g-val.highlight { color: #00f0ff; }
.g-val.safe { color: #39ff14; }
.g-val.danger { color: #ef4444; }

.g-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.temp-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}

.temp-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #f59e0b, #ef4444);
  transition: width 0.2s linear;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.control-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.box-title {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
}

.val-tag {
  color: #f59e0b;
}

.val-tag.cyan {
  color: #00f0ff;
}

.slider {
  width: 100%;
  accent-color: #f59e0b;
  cursor: pointer;
}

.slider.cyan {
  accent-color: #00f0ff;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #64748b;
}

.actions-bar {
  display: flex;
  justify-content: center;
}

.ignite-btn {
  width: 100%;
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  font-weight: 700;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ignite-btn:hover {
  background: #00f0ff;
  color: #040810;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.scram-btn {
  width: 100%;
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid #ef4444;
  color: #ef4444;
  font-weight: 800;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.scram-btn:hover {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}
</style>
