<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌌</span>
          <div>
            <h2>全息卡西米爾暗能量蟲洞引擎</h2>
            <p class="subtitle">Negative Energy Density NEC Violation, Morris-Thorne Metric & Phantom Dark Energy Throat</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="wormhole-svg">
            <defs>
              <linearGradient id="wormholeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#070214" />
                <stop offset="50%" stop-color="#14062e" />
                <stop offset="100%" stop-color="#05010f" />
              </linearGradient>

              <radialGradient id="throatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#e879f9" stop-opacity="1" />
                <stop offset="60%" stop-color="#a855f7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowWormhole">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#wormholeBg)" rx="8" />

            <!-- Left: Morris-Thorne Wormhole Throat Embedding Funnel (Center 220, 180) -->
            <g transform="translate(60, 20)">
              <!-- Outer event contour circles -->
              <ellipse cx="160" cy="80" rx="130" ry="25" fill="none" stroke="#818cf8" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.4" />
              <ellipse cx="160" cy="240" rx="130" ry="25" fill="none" stroke="#818cf8" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.4" />

              <!-- Throat Throat Narrowing Circle (r0) -->
              <ellipse
                cx="160"
                cy="160"
                :rx="25 + state.throatRadiusMeters * 3.5"
                ry="14"
                fill="url(#throatGlow)"
                stroke="#d946ef"
                stroke-width="2.5"
                filter="url(#glowWormhole)"
              />

              <!-- Hyperbolic Funnel Curved Profiles (Left & Right Flaring Curves) -->
              <path
                :d="throatUpperFunnelD"
                fill="none"
                stroke="#c084fc"
                stroke-width="2.5"
                filter="url(#glowWormhole)"
              />
              <path
                :d="throatLowerFunnelD"
                fill="none"
                stroke="#c084fc"
                stroke-width="2.5"
                filter="url(#glowWormhole)"
              />

              <!-- Sampling Profile Energy Nodes -->
              <g v-for="node in state.profileNodes" :key="node.id">
                <circle
                  :cx="160 + (node.id % 2 === 0 ? 1 : -1) * (25 + node.radiusR * 3.0)"
                  :cy="160 + node.heightZ * 8.0"
                  :r="3.5 + node.traversabilityDensity * 4.0"
                  fill="#f472b6"
                  opacity="0.85"
                  filter="url(#glowWormhole)"
                />
              </g>

              <text x="160" y="305" text-anchor="middle" fill="#e9d5ff" font-size="12" font-family="monospace">
                r₀ = {{ state.throatRadiusMeters }} m · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Real-time Topological Gauges & Parameters (x: 480 ~ 760) -->
            <g transform="translate(480, 40)">
              <!-- Metric 1: Traversable Quantum Flux -->
              <rect x="0" y="0" width="280" height="55" rx="6" fill="#200d3b" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="24" fill="#c084fc" font-size="11" font-family="sans-serif">全息可穿越量子通量 Φ_trav</text>
              <text x="14" y="46" fill="#38bdf8" font-size="20" font-weight="bold" font-family="monospace">
                {{ (state.traversableQuantumFlux * 100).toFixed(1) }} %
              </text>

              <!-- Metric 2: NEC Violation Factor -->
              <rect x="0" y="65" width="280" height="55" rx="6" fill="#200d3b" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="89" fill="#c084fc" font-size="11" font-family="sans-serif">零能量條件破缺係數 τ_NEC</text>
              <text x="14" y="111" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                τ = {{ state.necViolationFactor }} <tspan font-size="11" fill="#9ca3af">(T_00 &lt; 0)</tspan>
              </text>

              <!-- Metric 3: Phantom Dark Energy State Equation -->
              <rect x="0" y="130" width="280" height="55" rx="6" fill="#200d3b" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="154" fill="#c084fc" font-size="11" font-family="sans-serif">幻影暗能量狀態參數 w = p/ρ</text>
              <text x="14" y="176" fill="#e879f9" font-size="18" font-weight="bold" font-family="monospace">
                w = {{ state.phantomDarkEnergyW }} <tspan font-size="11" fill="#9ca3af">(w &lt; -1)</tspan>
              </text>

              <!-- Metric 4: Casimir Pressure Force -->
              <rect x="0" y="195" width="280" height="70" rx="6" fill="#200d3b" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="219" fill="#c084fc" font-size="11" font-family="sans-serif">宏觀卡西米爾吸力 (10⁻⁶ N/m²)</text>
              <text x="14" y="241" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.casimirAttractiveForceN }} μN/m²
              </text>
              <!-- Progress bar -->
              <rect x="14" y="250" width="250" height="6" rx="3" fill="#3b1764" />
              <rect x="14" y="250" :width="Math.min(250, (state.casimirAttractiveForceN / 200.0) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Regime Selection -->
          <div class="control-group full-width">
            <label class="group-label">相變與蟲洞喉管體制選擇 (Regime Select)</label>
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
              <span>卡西米爾板間距 d (nm)</span>
              <span class="value">{{ state.casimirPlateSeparationNm }} nm</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="1.0"
              :value="state.casimirPlateSeparationNm"
              @input="onPlateInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>幻影暗能量參數 w</span>
              <span class="value">{{ state.phantomDarkEnergyW }}</span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="-0.8"
              step="0.05"
              :value="state.phantomDarkEnergyW"
              @input="onWInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>蟲洞喉管半徑 r₀ (m)</span>
              <span class="value">{{ state.throatRadiusMeters }} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              :value="state.throatRadiusMeters"
              @input="onRadiusInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playWormholeSound">
              🔊 激發蟲洞喉管共鳴低頻音
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
  holographicCasimirWormholeEngine,
  CasimirWormholeRegime
} from '../engine/holographicCasimirWormholeEngine';

const uiStore = useUIStore();
const engine = holographicCasimirWormholeEngine;
const state = computed(() => engine.getState());

const regimes: { id: CasimirWormholeRegime; label: string }[] = [
  { id: 'sub-critical-casimir-vacuum', label: '亞臨界真空 (w=-0.95)' },
  { id: 'nec-violating-phantom-field', label: 'NEC破缺幻影相 (w=-1.25)' },
  { id: 'stable-traversable-throat', label: '穩態可穿越喉管 (w=-1.55)' },
  { id: 'superluminal-horizon-expansion', label: '超光速暴脹 (w=-2.2)' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const throatUpperFunnelD = computed(() => {
  const r0 = 25 + state.value.throatRadiusMeters * 3.5;
  return `M ${160 - r0} 160 Q ${160 - r0 * 1.5} 110, 30 80 M ${160 + r0} 160 Q ${160 + r0 * 1.5} 110, 290 80`;
});

const throatLowerFunnelD = computed(() => {
  const r0 = 25 + state.value.throatRadiusMeters * 3.5;
  return `M ${160 - r0} 160 Q ${160 - r0 * 1.5} 210, 30 240 M ${160 + r0} 160 Q ${160 + r0 * 1.5} 210, 290 240`;
});

function handleClose() {
  uiStore.setCasimirWormholeModal(false);
}

function onPlateInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setPlateSeparation(val);
}

function onWInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setPhantomDarkEnergyW(val);
}

function onRadiusInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setThroatRadius(val);
}

function playWormholeSound() {
  engine.triggerWormholeSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 1, 12, 0.78);
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
  background: #0f041f;
  border: 1px solid #9333ea;
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
  background: #190733;
  border-bottom: 1px solid #7e22ce;
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
  border: 1px solid #7e22ce;
}

.wormhole-svg {
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
  background: #1e093d;
  color: #d8b4fe;
  border: 1px solid #9333ea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #9333ea;
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
  color: #e9d5ff;
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
  background: #9333ea;
  color: #ffffff;
}

.audio-btn:hover {
  background: #a855f7;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.4);
}

.reset-btn {
  background: #2a0c54;
  color: #d8b4fe;
  border: 1px solid #9333ea;
}

.reset-btn:hover {
  background: #3b1175;
  color: #ffffff;
}
</style>
