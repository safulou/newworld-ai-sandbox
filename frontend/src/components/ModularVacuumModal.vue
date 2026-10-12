<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { modularHamiltonianVacuumEngine, type ModularVacuumRegime } from '../engine/modularHamiltonianVacuum';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => modularHamiltonianVacuumEngine.getState());

const isOpen = computed(() => uiStore.mode === 'modular-vacuum');

const regimes: Array<{ id: ModularVacuumRegime; label: string; desc: string }> = [
  { id: 'bisognano-wichmann-rindler', label: '林德勒模態流相', desc: '幾何角加速對偶與雙曲旋轉' },
  { id: 'entanglement-first-law-saturation', label: '糾纏第一定律飽和', desc: 'δS = δ⟨K⟩ 保真度 100%' },
  { id: 'quantum-energy-inequality-ward', label: 'QEI 負能約束相', desc: '量子能量不等式穩定力場' },
  { id: 'relative-entropy-monotonicity', label: '相對熵單調相', desc: 'Araki 量子資訊單調守恆' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateRadius(val: number) {
  modularHamiltonianVacuumEngine.setParameters({ entangledRegionRadiusLp: val });
}

function updateAcceleration(val: number) {
  modularHamiltonianVacuumEngine.setParameters({ unruhAccelerationScaleE20: val });
}

function updateModularTime(val: number) {
  modularHamiltonianVacuumEngine.setParameters({ modularTimeParameterS: val });
}

function updateFlux(val: number) {
  modularHamiltonianVacuumEngine.setParameters({ vacuumNegativeEnergyFlux: val });
}

function selectRegime(regime: ModularVacuumRegime) {
  modularHamiltonianVacuumEngine.setParameters({ regime });
  achievements.unlock('modular_hamiltonian_vacuum');
}

function saturateFirstLaw() {
  modularHamiltonianVacuumEngine.saturateEntanglementFirstLaw();
  achievements.unlock('modular_hamiltonian_vacuum');
}

function stepFlow() {
  modularHamiltonianVacuumEngine.stepModularFlow();
  achievements.unlock('modular_hamiltonian_vacuum');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="mod-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚛️</span>
          <div>
            <h2>富田-竹崎模態流真空引擎 (Modular Hamiltonian Engine)</h2>
            <span class="subtitle">Tomita-Takesaki Modular Flow, Bisognano-Wichmann & Entanglement First Law</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 林德勒雙曲時空與模態流線 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="mod-svg">
            <defs>
              <radialGradient id="rindlerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5" />
                <stop offset="60%" stop-color="#0284c7" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="modularFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="50%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#ec4899" />
              </linearGradient>
            </defs>

            <!-- 閔可夫斯基背景網格 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#030712" stroke="#1e293b" stroke-width="1.8" />
            <circle cx="270" cy="160" r="120" fill="url(#rindlerGlow)" />

            <!-- 時空光錐 (Light Cone x = ±t) -->
            <line x1="150" y1="40" x2="390" y2="280" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5" />
            <line x1="150" y1="280" x2="390" y2="40" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5" />

            <!-- 林德勒右楔區 (Right Rindler Wedge x > |t|) 標註 -->
            <path d="M 270 160 L 490 50 L 490 270 Z" fill="#0284c7" opacity="0.12" />

            <!-- 模態流雙曲線 (Modular Boost Hyperbolas x^2 - t^2 = const) -->
            <g opacity="0.8">
              <path d="M 460 60 Q 330 160 460 260" fill="none" stroke="url(#modularFlowGrad)" stroke-width="2.5" stroke-dasharray="14 8">
                <animate attributeName="stroke-dashoffset" values="0;-100" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 420 80 Q 310 160 420 240" fill="none" stroke="url(#modularFlowGrad)" stroke-width="2" stroke-dasharray="12 6">
                <animate attributeName="stroke-dashoffset" values="0;-90" dur="2.4s" repeatCount="indefinite" />
              </path>
              <path d="M 380 100 Q 290 160 380 220" fill="none" stroke="url(#modularFlowGrad)" stroke-width="1.8" stroke-dasharray="10 5">
                <animate attributeName="stroke-dashoffset" values="0;-80" dur="2.8s" repeatCount="indefinite" />
              </path>
            </g>

            <!-- 模態時間參數指示點 -->
            <g :transform="`translate(${320 + Math.abs(state.modularTimeParameterS) * 16}, ${160 + state.modularTimeParameterS * 14})`">
              <circle r="8" fill="#ec4899" opacity="0.4" />
              <circle r="4" fill="#f43f5e" />
              <text x="12" y="4" fill="#fbcfe8" font-size="10" font-weight="bold">
                s = {{ state.modularTimeParameterS.toFixed(1) }}
              </text>
            </g>

            <!-- 標註資訊 -->
            <text x="45" y="55" fill="#38bdf8" font-size="11" font-weight="bold">
              Bisognano-Wichmann 模態流 (a = {{ (state.unruhAccelerationScaleE20 * 10).toFixed(0) }}×10¹⁹ m/s²)
            </text>
            <text x="45" y="75" fill="#94a3b8" font-size="10">
              安魯溫度 T_U = {{ state.unruhTemperatureKelvin.toFixed(1) }} K | QEI 穩定度: {{ (state.qeiStabilityBound * 100).toFixed(0) }}%
            </text>
            <text x="495" y="275" fill="#34d399" font-size="10" text-anchor="end">
              糾纏第一定律 δS/δ⟨K⟩ = {{ (state.entanglementEntropyDeviation / Math.max(0.1, state.modularHamiltonianExpectation)).toFixed(3) }}
            </text>
          </svg>
        </div>

        <!-- 4 大體制按鈕 -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            class="regime-btn"
            :class="{ active: state.regime === r.id }"
            @click="selectRegime(r.id)"
          >
            <span class="regime-name">{{ r.label }}</span>
            <span class="regime-desc">{{ r.desc }}</span>
          </button>
        </div>

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">模態能量 ⟨K⟩</span>
            <span class="m-val text-cyan">{{ state.modularHamiltonianExpectation.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">糾纏熵增量 δS</span>
            <span class="m-val text-emerald">{{ state.entanglementEntropyDeviation.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">安魯溫度 T_U</span>
            <span class="m-val text-purple">{{ state.unruhTemperatureKelvin.toFixed(1) }} K</span>
          </div>
          <div class="metric-item">
            <span class="m-label">QEI 穩定係數</span>
            <span class="m-val text-emerald">{{ (state.qeiStabilityBound * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">相對熵 S(ρ||σ)</span>
            <span class="m-val">{{ state.relativeEntropyMonotonic.toFixed(2) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">真空應力 ⟨T_00⟩</span>
            <span class="m-val text-cyan">{{ state.vacuumStressTensorT00.toFixed(3) }}</span>
          </div>
        </div>

        <!-- 參數滑桿控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>糾纏區域半徑 (R, ℓ_p)</span>
              <span class="val">{{ state.entangledRegionRadiusLp.toFixed(1) }} ℓ_p</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="0.5"
              :value="state.entangledRegionRadiusLp"
              @input="updateRadius(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>安魯加速度尺度 (a, 10²⁰ m/s²)</span>
              <span class="val">{{ state.unruhAccelerationScaleE20.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              :value="state.unruhAccelerationScaleE20"
              @input="updateAcceleration(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>模態時間參數 (s)</span>
              <span class="val">{{ state.modularTimeParameterS.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.2"
              :value="state.modularTimeParameterS"
              @input="updateModularTime(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>負能量通量注入 (QEI 測試)</span>
              <span class="val">{{ state.vacuumNegativeEnergyFlux.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="25.0"
              step="0.5"
              :value="state.vacuumNegativeEnergyFlux"
              @input="updateFlux(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="saturateFirstLaw">
            ⚖️ 飽和糾纏第一定律 (δS = δ⟨K⟩)
          </button>
          <button class="action-btn secondary" @click="stepFlow">
            🌀 演進富田-竹崎模態流參數步進
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.mod-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(8, 20, 36, 0.95), rgba(4, 12, 24, 0.98));
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 28px;
}

.title-group h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.content-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.mod-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.4);
}

.regime-btn.active {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-emerald { color: #34d399; }

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.slider-header .val {
  font-weight: 700;
  color: #38bdf8;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(90deg, #0284c7, #2563eb);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #0369a1, #1d4ed8);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

.action-btn.secondary:hover {
  background: rgba(56, 189, 248, 0.15);
}
</style>
