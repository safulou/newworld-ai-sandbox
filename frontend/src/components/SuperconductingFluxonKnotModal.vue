<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🪢</span>
          <div>
            <h2>超導拓撲磁通子扭結結晶器</h2>
            <p class="subtitle">Faddeev-Niemi Hopfions, 3D Trefoil Fluxon Knots & Topological Untying Avalanche</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="knot-svg">
            <defs>
              <linearGradient id="knotBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a0518" />
                <stop offset="50%" stop-color="#16082e" />
                <stop offset="100%" stop-color="#05020c" />
              </linearGradient>

              <radialGradient id="knotNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
                <stop offset="60%" stop-color="#a855f7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowKnot">
                <feGaussianBlur stdDeviation="3.0" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#knotBg)" rx="8" />

            <!-- Left: 3D Projected Fluxon Knot (Center 220, 180) -->
            <g transform="translate(70, 30)">
              <!-- Outer magnetic bounding cage -->
              <circle cx="150" cy="150" r="130" fill="none" stroke="#6b21a8" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.4" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="#9333ea" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.3" />

              <!-- Knot path connections -->
              <path
                :d="knotPathD"
                fill="none"
                stroke="#c084fc"
                stroke-width="3.5"
                filter="url(#glowKnot)"
              />

              <!-- Projected 3D Sampling Nodes -->
              <g v-for="pt in state.knotPoints" :key="pt.id">
                <circle
                  :cx="pt.x"
                  :cy="pt.y"
                  :r="4.5 + pt.magneticFieldB * 3.0"
                  fill="url(#knotNodeGlow)"
                  filter="url(#glowKnot)"
                />
                <!-- Tangent vector arrow -->
                <line
                  :x1="pt.x"
                  :y1="pt.y"
                  :x2="pt.x + pt.tangentX * 8"
                  :y2="pt.y + pt.tangentY * 8"
                  stroke="#fb7185"
                  stroke-width="1.5"
                  opacity="0.8"
                />
              </g>

              <text x="150" y="295" text-anchor="middle" fill="#d8b4fe" font-size="12" font-family="monospace">
                Q_H = {{ state.hopfInvariantQ }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Real-time Topological Gauges & Parameters (x: 480 ~ 760) -->
            <g transform="translate(480, 40)">
              <!-- Metric 1: Hopf Invariant Badge -->
              <rect x="0" y="0" width="280" height="55" rx="6" fill="#1e1035" stroke="#7e22ce" stroke-width="1" />
              <text x="14" y="24" fill="#a855f7" font-size="11" font-family="sans-serif">霍普夫拓撲不變量 Q_H</text>
              <text x="14" y="46" fill="#f43f5e" font-size="20" font-weight="bold" font-family="monospace">
                Q_H = {{ state.hopfInvariantQ }} <tspan font-size="11" fill="#9ca3af">(高斯環繞度)</tspan>
              </text>

              <!-- Metric 2: Knot Helicity Density -->
              <rect x="0" y="65" width="280" height="55" rx="6" fill="#1e1035" stroke="#7e22ce" stroke-width="1" />
              <text x="14" y="89" fill="#a855f7" font-size="11" font-family="sans-serif">扭結螺旋度密度 H_k (10¹² Wb²/m³)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.knotHelicityDensity }} <tspan font-size="11" fill="#9ca3af">Wb²/m³</tspan>
              </text>

              <!-- Metric 3: Topological Binding Energy -->
              <rect x="0" y="130" width="280" height="55" rx="6" fill="#1e1035" stroke="#7e22ce" stroke-width="1" />
              <text x="14" y="154" fill="#a855f7" font-size="11" font-family="sans-serif">拓撲扭結束縛能 E_knot (meV)</text>
              <text x="14" y="176" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.topologicalBindingEnergyMev }} <tspan font-size="11" fill="#9ca3af">meV</tspan>
              </text>

              <!-- Metric 4: Untying Current Threshold -->
              <rect x="0" y="195" width="280" height="70" rx="6" fill="#1e1035" stroke="#7e22ce" stroke-width="1" />
              <text x="14" y="219" fill="#a855f7" font-size="11" font-family="sans-serif">臨界解結電流閾值 I_untying (mA)</text>
              <text x="14" y="241" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.untyingCurrentThresholdMa }} mA
              </text>
              <!-- Progress bar -->
              <rect x="14" y="250" width="250" height="6" rx="3" fill="#2d154d" />
              <rect x="14" y="250" :width="Math.min(250, (state.untyingCurrentThresholdMa / 80.0) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Regime Selection -->
          <div class="control-group full-width">
            <label class="group-label">相變與扭結體制選擇 (Regime Select)</label>
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
              <span>霍普夫不變量 Q_H</span>
              <span class="value">{{ state.hopfInvariantQ }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              :value="state.hopfInvariantQ"
              @input="onHopfInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>約瑟夫森耦合能 E_J (meV)</span>
              <span class="value">{{ state.josephsonCouplingEjMeVR }} meV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="30.0"
              step="0.5"
              :value="state.josephsonCouplingEjMeVR"
              @input="onEjInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>霍普夫晶格常數 a₀ (nm)</span>
              <span class="value">{{ state.fluxonLatticeConstantNm }} nm</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="60.0"
              step="1.0"
              :value="state.fluxonLatticeConstantNm"
              @input="onA0Input"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playKnotSound">
              🔊 激發拓撲扭結諧波音效
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
  superconductingFluxonKnotCrystallizerEngine,
  FluxonKnotRegime
} from '../engine/superconductingFluxonKnotCrystallizer';

const uiStore = useUIStore();
const engine = superconductingFluxonKnotCrystallizerEngine;
const state = computed(() => engine.getState());

const regimes: { id: FluxonKnotRegime; label: string }[] = [
  { id: 'unknotted-vortex-gas', label: '平庸渦旋氣 (Q=0)' },
  { id: 'trefoil-fluxon-knot', label: '三葉扭結孤子 (Q=1)' },
  { id: 'hopfion-link-lattice', label: '霍普夫環鏈晶格 (Q=2)' },
  { id: 'topological-untying-avalanche', label: '臨界解結雪崩 (Q=3)' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const knotPathD = computed(() => {
  const pts = state.value.knotPoints;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setFluxonKnotModal(false);
}

function onHopfInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setHopfInvariant(val);
}

function onEjInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setJosephsonCoupling(val);
}

function onA0Input(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setFluxonLatticeConstant(val);
}

function playKnotSound() {
  engine.triggerKnotSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 2, 10, 0.78);
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
  background: #0d071a;
  border: 1px solid #7e22ce;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(168, 85, 247, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #140b29;
  border-bottom: 1px solid #6b21a8;
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
  color: #f3e8ff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #c084fc;
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
  border: 1px solid #6b21a8;
}

.knot-svg {
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
  color: #c084fc;
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
  background: #190c33;
  color: #d8b4fe;
  border: 1px solid #7e22ce;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #7e22ce;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
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
  color: #d8b4fe;
}

.slider-header .value {
  font-family: monospace;
  color: #f43f5e;
}

input[type="range"] {
  accent-color: #a855f7;
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
  background: #7e22ce;
  color: #ffffff;
}

.audio-btn:hover {
  background: #9333ea;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.4);
}

.reset-btn {
  background: #271442;
  color: #c084fc;
  border: 1px solid #7e22ce;
}

.reset-btn:hover {
  background: #3b1d63;
  color: #ffffff;
}
</style>
