<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌟</span>
          <div>
            <h2>中子星內核相對論性 π 介子凝聚與超流渦旋雪崩自轉突變</h2>
            <p class="subtitle">Chiral p-Wave Pion Condensate, ³P₂ Half-Quantum Superfluid Vortex Unpinning Avalanche & Pulsar Glitch</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="pion-glitch-svg">
            <defs>
              <linearGradient id="pionBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1c1607" />
                <stop offset="50%" stop-color="#33260b" />
                <stop offset="100%" stop-color="#0f0b03" />
              </linearGradient>

              <filter id="glowPion">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#pionBg)" rx="8" />

            <!-- Left: Neutron Star Inner Core Pion Domain Walls & ³P₂ Superfluid Vortex Avalanche -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="112" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 3" opacity="0.55" />
              <circle cx="165" cy="160" r="76" fill="none" stroke="#eab308" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.45" />
              <circle cx="165" cy="160" r="42" fill="rgba(234, 179, 8, 0.14)" stroke="#facc15" stroke-width="1.4" />

              <!-- Vortex Unpinning Avalanche Spiral -->
              <path
                :d="vortexSpiralPathD"
                fill="none"
                stroke="#fef08a"
                stroke-width="2.1"
                filter="url(#glowPion)"
              />

              <!-- 18 ³P₂ Superfluid Half-Quantum Vortex & Pion Domain Nodes -->
              <g v-for="vn in state.vortexNodes" :key="vn.id">
                <circle
                  :cx="vn.x"
                  :cy="vn.y"
                  :r="vn.isUnpinnedAvalanche ? 6.0 : 4.5"
                  :fill="vn.isUnpinnedAvalanche ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowPion)"
                />
                <text
                  :x="vn.x"
                  :y="vn.y - 9"
                  text-anchor="middle"
                  :fill="vn.isUnpinnedAvalanche ? '#fda4af' : '#bae6fd'"
                  font-size="8"
                  font-family="monospace"
                >
                  {{ vn.halfQuantumCirculation }}κ₀
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#fef08a" font-size="12" font-family="monospace">
                ρ/ρ₀ = {{ state.coreBaryonDensityRatioRho0 }} · Δν/ν = {{ state.pulsarGlitchMagnitudePPM }}×10⁻⁶ · L_ν = {{ state.pionUrcaNeutrinoLum36ErgS }}×10³⁶ erg/s
              </text>
            </g>

            <!-- Right: Pulsar Glitch & Pion Condensate Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#2b2008" stroke="#eab308" stroke-width="1" />
              <text x="14" y="22" fill="#fef08a" font-size="11" font-family="sans-serif">脈衝星自轉突變幅度 Δν / ν (Glitch)</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                {{ state.pulsarGlitchMagnitudePPM }} × 10⁻⁶ <tspan font-size="11" fill="#fde047">(ppm)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#2b2008" stroke="#eab308" stroke-width="1" />
              <text x="14" y="88" fill="#fef08a" font-size="11" font-family="sans-serif">π 介子疇壁渦旋釘扎能壘 E_pin (MeV)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                E_pin = {{ state.vortexPinningBarrierMev }} MeV
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#2b2008" stroke="#eab308" stroke-width="1" />
              <text x="14" y="154" fill="#fef08a" font-size="11" font-family="sans-serif">π 介子增強 Urca 微中子光度 L_ν</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.pionUrcaNeutrinoLum36ErgS }} × 10³⁶ erg/s
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#2b2008" stroke="#eab308" stroke-width="1" />
              <text x="14" y="220" fill="#fef08a" font-size="11" font-family="sans-serif">核心密度 ρ/ρ₀ 與差動滯後 ΔΩ_lag</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                {{ state.coreBaryonDensityRatioRho0 }} ρ₀ | ΔΩ = {{ state.crustSuperfluidLagRadS }} rad/s
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#47350d" />
              <rect x="14" y="252" :width="Math.min(250, (state.pulsarGlitchMagnitudePPM / 35) * 250)" height="6" rx="3" fill="#facc15" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">中子星內核 π 介子凝聚與超流渦旋雪崩體制選擇 (Regime Select)</label>
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

          <div class="control-group">
            <div class="slider-header">
              <span>內核重子密度比 ρ / ρ₀</span>
              <span class="value">{{ state.coreBaryonDensityRatioRho0 }} ρ₀</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="6.5"
              step="0.1"
              :value="state.coreBaryonDensityRatioRho0"
              @input="onDensityInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>手性 π 介子凝聚角 θ_c (deg)</span>
              <span class="value">{{ state.pionCondensateAngleDeg }}°</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="75.0"
              step="1.0"
              :value="state.pionCondensateAngleDeg"
              @input="onAngleInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>超流-星殼差動角速度滯後 ΔΩ_lag (rad/s)</span>
              <span class="value">{{ state.crustSuperfluidLagRadS }} rad/s</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.50"
              step="0.05"
              :value="state.crustSuperfluidLagRadS"
              @input="onLagInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playGlitchSound">
              🔊 激發脈衝星渦旋雪崩突變音
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
  pionCondensateNeutronStarVortexAvalancheEngine,
  PionCondensateGlitchRegime
} from '../engine/pionCondensateNeutronStarVortexAvalanche';

const uiStore = useUIStore();
const engine = pionCondensateNeutronStarVortexAvalancheEngine;
const state = computed(() => engine.getState());

const regimes: { id: PionCondensateGlitchRegime; label: string }[] = [
  { id: 'normal-nuclear-fermi-liquid', label: '常規核物質費米液體' },
  { id: 'pinned-3p2-superfluid-crust-lag', label: '³P₂ 超流釘扎與星殼差動滯後' },
  { id: 'chiral-pion-condensate-lattice', label: '手性 π 介子凝聚層狀晶格' },
  { id: 'catastrophic-vortex-unpinning-glitch', label: '巨型渦旋脫釘雪崩自轉突變' }
];

const vortexSpiralPathD = computed(() => {
  const pts = state.value.vortexNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setPionCondensateVortexAvalancheModal(false);
}

function onDensityInput(e: Event) {
  engine.setCoreBaryonDensityRatio(Number((e.target as HTMLInputElement).value));
}

function onAngleInput(e: Event) {
  engine.setPionCondensateAngle(Number((e.target as HTMLInputElement).value));
}

function onLagInput(e: Event) {
  engine.setCrustSuperfluidLag(Number((e.target as HTMLInputElement).value));
}

function playGlitchSound() {
  engine.triggerPulsarGlitchSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 12, 4, 0.82);
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
  background: #1a1405;
  border: 1px solid #eab308;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(234, 179, 8, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2b2108;
  border-bottom: 1px solid #ca8a04;
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
  color: #fefce8;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fde047;
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
  border: 1px solid #ca8a04;
}

.pion-glitch-svg {
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
  color: #fef08a;
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
  background: #362909;
  color: #fef9c3;
  border: 1px solid #ca8a04;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #ca8a04;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.45);
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
  color: #fef9c3;
}

.slider-header .value {
  font-family: monospace;
  color: #facc15;
}

input[type="range"] {
  accent-color: #eab308;
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
  background: #ca8a04;
  color: #ffffff;
}

.audio-btn:hover {
  background: #eab308;
}

.reset-btn {
  background: #40300b;
  color: #fef08a;
  border: 1px solid #ca8a04;
}

.reset-btn:hover {
  background: #5c4510;
  color: #ffffff;
}
</style>
