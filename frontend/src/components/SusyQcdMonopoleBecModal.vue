<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚛️</span>
          <div>
            <h2>超對稱量子色動力學磁單極玻色凝聚環</h2>
            <p class="subtitle">N=2 Seiberg-Witten Monopole BEC, Dual Meissner Effect & Linear Color String Confinement</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="monopole-svg">
            <defs>
              <linearGradient id="monopoleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#051214" />
                <stop offset="50%" stop-color="#0a2529" />
                <stop offset="100%" stop-color="#02090a" />
              </linearGradient>

              <radialGradient id="monopoleNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="1" />
                <stop offset="60%" stop-color="#10b981" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#065f46" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowMonopole">
                <feGaussianBlur stdDeviation="3.0" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#monopoleBg)" rx="8" />

            <!-- Left: Toroidal Monopole BEC Ring (Center 220, 180) -->
            <g transform="translate(70, 30)">
              <!-- Torus Outer & Inner Bounding Circles -->
              <circle cx="150" cy="150" r="115" fill="none" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.35" />
              <circle cx="150" cy="150" r="45" fill="none" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.35" />

              <!-- Electric Color Flux Confinement Cord Lines -->
              <path
                :d="colorStringTensionD"
                fill="none"
                stroke="#10b981"
                stroke-width="3"
                filter="url(#glowMonopole)"
              />

              <!-- Condensed Monopole Nodes (12 on ring) -->
              <g v-for="node in state.ringNodes" :key="node.id">
                <circle
                  :cx="node.xProj"
                  :cy="node.yProj"
                  :r="4.5 + node.electricFluxDensity * 3.5"
                  fill="url(#monopoleNodeGlow)"
                  filter="url(#glowMonopole)"
                />
                <!-- Dual Meissner magnetic phase vector -->
                <line
                  :x1="node.xProj"
                  :y1="node.yProj"
                  :x2="node.xProj + Math.cos(node.monopolePhase) * 10"
                  :y2="node.yProj + Math.sin(node.monopolePhase) * 10"
                  stroke="#fbbf24"
                  stroke-width="1.8"
                  opacity="0.85"
                />
              </g>

              <text x="150" y="295" text-anchor="middle" fill="#6ee7b7" font-size="12" font-family="monospace">
                ρ_M = {{ state.monopoleDensityRhoM }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Real-time Topological Gauges & Parameters (x: 480 ~ 760) -->
            <g transform="translate(480, 40)">
              <!-- Metric 1: Dual Persistent Supercurrent -->
              <rect x="0" y="0" width="280" height="55" rx="6" fill="#082d24" stroke="#059669" stroke-width="1" />
              <text x="14" y="24" fill="#34d399" font-size="11" font-family="sans-serif">對偶持久磁超電流 I_mag (μA)</text>
              <text x="14" y="46" fill="#fbbf24" font-size="20" font-weight="bold" font-family="monospace">
                {{ state.persistentDualCurrentUa }} μA
              </text>

              <!-- Metric 2: Color String Tension -->
              <rect x="0" y="65" width="280" height="55" rx="6" fill="#082d24" stroke="#059669" stroke-width="1" />
              <text x="14" y="89" fill="#34d399" font-size="11" font-family="sans-serif">夸克色弦張力 σ_E (GeV/fm)</text>
              <text x="14" y="111" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.colorStringTensionGevFm }} GeV/fm <tspan font-size="11" fill="#9ca3af">(線性禁閉)</tspan>
              </text>

              <!-- Metric 3: Dual Meissner Penetration Depth -->
              <rect x="0" y="130" width="280" height="55" rx="6" fill="#082d24" stroke="#059669" stroke-width="1" />
              <text x="14" y="154" fill="#34d399" font-size="11" font-family="sans-serif">對偶穿透深度 λ_dual (nm)</text>
              <text x="14" y="176" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.dualMeissnerPenetrationNm }} nm
              </text>

              <!-- Metric 4: Seiberg-Witten Moduli Parameter -->
              <rect x="0" y="195" width="280" height="70" rx="6" fill="#082d24" stroke="#059669" stroke-width="1" />
              <text x="14" y="219" fill="#34d399" font-size="11" font-family="sans-serif">Seiberg-Witten 耦合參數 Im(τ) = 8π/g²</text>
              <text x="14" y="241" fill="#a7f3d0" font-size="18" font-weight="bold" font-family="monospace">
                Im(τ) = {{ state.seibergWittenTauImag }}
              </text>
              <!-- Progress bar -->
              <rect x="14" y="250" width="250" height="6" rx="3" fill="#054536" />
              <rect x="14" y="250" :width="Math.min(250, (state.seibergWittenTauImag / 6.0) * 250)" height="6" rx="3" fill="#34d399" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Regime Selection -->
          <div class="control-group full-width">
            <label class="group-label">相變與超對稱單極體制選擇 (Regime Select)</label>
            <div class="regime-buttons">
              <button
                v-for="reg in regimes"
                :key="reg.id"
                class="regime-btn"
                :class="{ active: state.activeRegime === reg.id }"
                @click="engine.setRegime(reg.id)"
              >
                {{ reg.label }}
              </button>
            </div>
          </div>

          <!-- Parameter Sliders -->
          <div class="control-group">
            <div class="slider-header">
              <span>磁單極凝聚密度 ρ_M (10¹⁶ cm⁻³)</span>
              <span class="value">{{ state.monopoleDensityRhoM }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="1.0"
              :value="state.monopoleDensityRhoM"
              @input="onRhoInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>色弦張力 σ_E (GeV/fm)</span>
              <span class="value">{{ state.colorStringTensionGevFm }} GeV/fm</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              :value="state.colorStringTensionGevFm"
              @input="onSigmaInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>SW 模參數 Im(τ) = 8π/g²</span>
              <span class="value">{{ state.seibergWittenTauImag }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              :value="state.seibergWittenTauImag"
              @input="onTauInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playMonopoleSound">
              🔊 激發對偶邁斯納禁閉音效
            </button>
            <button class="action-btn reset-btn" @click="resetEngine">
              🔄 重設狀態
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import {
  susyQcdMonopoleBecRingEngine,
  SusyMonopoleRegime
} from '../engine/susyQcdMonopoleBecRing';

const uiStore = useUIStore();
const engine = susyQcdMonopoleBecRingEngine;
const state = computed(() => engine.getState());

const regimes: { id: SusyMonopoleRegime; label: string }[] = [
  { id: 'coulomb-massless-monopole', label: '庫侖無質量單極' },
  { id: 'dual-meissner-condensation', label: '對偶邁斯納凝聚' },
  { id: 'confined-color-string-tube', label: '色通量管強禁閉' },
  { id: 'argyres-douglas-critical-point', label: 'AD共形臨界點' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const colorStringTensionD = computed(() => {
  const nodes = state.value.ringNodes;
  if (!nodes || nodes.length === 0) return '';
  let d = `M ${nodes[0].xProj} ${nodes[0].yProj}`;
  for (let i = 1; i < nodes.length; i++) {
    d += ` L ${nodes[i].xProj} ${nodes[i].yProj}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setSusyMonopoleModal(false);
}

function onRhoInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setMonopoleDensity(val);
}

function onSigmaInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setStringTension(val);
}

function onTauInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setSeibergWittenCoupling(val);
}

function playMonopoleSound() {
  engine.triggerMonopoleSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 10, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 95vw;
  max-height: 92vh;
  background: #06191b;
  border: 1px solid #059669;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #092629;
  border-bottom: 1px solid #047857;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-wrap .icon {
  font-size: 28px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 19px;
  color: #ecfdf5;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #34d399;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.close-btn:hover {
  color: #ffffff;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.viz-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #047857;
}

.monopole-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.full-width {
  grid-column: 1 / -1;
}

.group-label {
  display: block;
  font-size: 12px;
  color: #34d399;
  margin-bottom: 8px;
}

.regime-buttons {
  display: flex;
  gap: 8px;
}

.regime-btn {
  flex: 1;
  padding: 8px 10px;
  font-size: 12px;
  background: #072e27;
  color: #a7f3d0;
  border: 1px solid #059669;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #059669;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #d1fae5;
}

.slider-header .value {
  font-family: monospace;
  color: #f43f5e;
}

input[type="range"] {
  accent-color: #10b981;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-end;
}

.action-btn {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.audio-btn {
  background: #059669;
  color: #ffffff;
}

.audio-btn:hover {
  background: #10b981;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.4);
}

.reset-btn {
  background: #0a3d33;
  color: #a7f3d0;
  border: 1px solid #059669;
}

.reset-btn:hover {
  background: #0f5245;
  color: #ffffff;
}
</style>
