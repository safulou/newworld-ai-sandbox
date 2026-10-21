<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">✡️</span>
          <div>
            <h2>籠目金屬配對密度波與手性軌道環電流超導</h2>
            <p class="subtitle">Kagome Star-of-David Chiral Loop Currents, 3Q Pair-Density Wave & Vestigial Charge-6e Condensate</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="kagome-svg">
            <defs>
              <linearGradient id="kagomeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a192f" />
                <stop offset="50%" stop-color="#172a46" />
                <stop offset="100%" stop-color="#050d1a" />
              </linearGradient>

              <filter id="glowKagome">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#kagomeBg)" rx="8" />

            <!-- Left: Star-of-David Kagome Lattice, Chiral Orbital Flux & 3Q PDW Superlattice -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="114" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="78" fill="none" stroke="#f59e0b" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.45" />

              <!-- Star-of-David Chiral Loop Path -->
              <path
                :d="starPathD"
                fill="rgba(56, 189, 248, 0.1)"
                stroke="#38bdf8"
                stroke-width="2.2"
                filter="url(#glowKagome)"
              />

              <!-- 18 Kagome Loop-Current & Charge-6e Vortex Nodes -->
              <g v-for="kn in state.kagomeNodes" :key="kn.id">
                <circle
                  :cx="kn.x"
                  :cy="kn.y"
                  :r="4.5 + kn.pdwGapAmplitudeMev * 2.2"
                  :fill="kn.plaquetteChirality > 0 ? '#fbbf24' : '#38bdf8'"
                  filter="url(#glowKagome)"
                />
                <text
                  :x="kn.x"
                  :y="kn.y - 9"
                  text-anchor="middle"
                  :fill="kn.plaquetteChirality > 0 ? '#fde68a' : '#bae6fd'"
                  font-size="8"
                  font-family="monospace"
                >
                  {{ kn.vortexWindingChargeE }}e
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="monospace">
                Φ_loop = {{ state.orbitalLoopFluxMilliPhi0 }} mΦ₀ · f_6e = {{ state.charge6eCondensateFraction }} · η_JDE = {{ state.josephsonDiodeEfficiencyPct }}%
              </text>
            </g>

            <!-- Right: Kagome PDW & Loop-Current Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#0f2547" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="22" fill="#7dd3fc" font-size="11" font-family="sans-serif">殘留高階電荷-6e 凝聚分數 f_6e (h/6e)</text>
              <text x="14" y="45" fill="#fbbf24" font-size="19" font-weight="bold" font-family="monospace">
                f_6e = {{ state.charge6eCondensateFraction }} <tspan font-size="11" fill="#bae6fd">(Little-Parks)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#0f2547" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="88" fill="#7dd3fc" font-size="11" font-family="sans-serif">無場內稟超導二極體整流效率 η_JDE</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                η_JDE = {{ state.josephsonDiodeEfficiencyPct }}%
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#0f2547" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="154" fill="#7dd3fc" font-size="11" font-family="sans-serif">極化克爾旋轉角 θ_K (時間反演破缺)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                θ_K = {{ state.polarKerrRotationMicroRad }} μrad
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#0f2547" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="220" fill="#7dd3fc" font-size="11" font-family="sans-serif">手性環電流磁通 Φ_loop 與 PDW 振幅 Δ_PDW</text>
              <text x="14" y="242" fill="#f43f5e" font-size="17" font-weight="bold" font-family="monospace">
                {{ state.orbitalLoopFluxMilliPhi0 }} mΦ₀ | {{ state.pdwModulationAmpMev }} meV
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#17386b" />
              <rect x="14" y="252" :width="Math.min(250, state.charge6eCondensateFraction * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">籠目晶格交織電子序與高階超導體制選擇 (Regime Select)</label>
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
              <span>手性軌道環電流磁通 Φ_loop (mΦ₀)</span>
              <span class="value">{{ state.orbitalLoopFluxMilliPhi0 }} mΦ₀</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="45.0"
              step="0.5"
              :value="state.orbitalLoopFluxMilliPhi0"
              @input="onFluxInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>3Q 配對密度波振幅 Δ_PDW (meV)</span>
              <span class="value">{{ state.pdwModulationAmpMev }} meV</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="3.50"
              step="0.05"
              :value="state.pdwModulationAmpMev"
              @input="onPdwInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>范霍夫奇異點能級失諧 |δμ_vHS| (meV)</span>
              <span class="value">{{ state.vanHoveDetuningMev }} meV</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="25.0"
              step="0.5"
              :value="state.vanHoveDetuningMev"
              @input="onDetuningInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playKagomeSound">
              🔊 激發籠目 6e 超導環電流諧音
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
  kagomePairDensityWaveLoopCurrentEngine,
  KagomePdwLoopRegime
} from '../engine/kagomePairDensityWaveLoopCurrent';

const uiStore = useUIStore();
const engine = kagomePairDensityWaveLoopCurrentEngine;
const state = computed(() => engine.getState());

const regimes: { id: KagomePdwLoopRegime; label: string }[] = [
  { id: 'normal-van-hove-kagome-metal', label: '正常態范霍夫籠目金屬' },
  { id: 'chiral-loop-current-flux-cdw', label: '手性軌道環電流 CDW 相' },
  { id: 'roton-pair-density-wave-3q', label: '3Q 旋子配對密度波超導' },
  { id: 'vestigial-charge-6e-condensate', label: '殘留電荷-6e (h/6e) 玻色凝聚' }
];

const starPathD = computed(() => {
  const pts = state.value.kagomeNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setKagomePairDensityWaveModal(false);
}

function onFluxInput(e: Event) {
  engine.setOrbitalLoopFlux(Number((e.target as HTMLInputElement).value));
}

function onPdwInput(e: Event) {
  engine.setPdwModulationAmp(Number((e.target as HTMLInputElement).value));
}

function onDetuningInput(e: Event) {
  engine.setVanHoveDetuning(Number((e.target as HTMLInputElement).value));
}

function playKagomeSound() {
  engine.triggerKagomePdwSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 13, 26, 0.82);
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
  background: #081529;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(14, 165, 233, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0e2445;
  border-bottom: 1px solid #0284c7;
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
  color: #f0f9ff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #7dd3fc;
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
  border: 1px solid #0284c7;
}

.kagome-svg {
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
  color: #7dd3fc;
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
  background: #102a52;
  color: #bae6fd;
  border: 1px solid #0284c7;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
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
  color: #bae6fd;
}

.slider-header .value {
  font-family: monospace;
  color: #fbbf24;
}

input[type="range"] {
  accent-color: #0ea5e9;
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
  background: #0284c7;
  color: #ffffff;
}

.audio-btn:hover {
  background: #0ea5e9;
}

.reset-btn {
  background: #143566;
  color: #7dd3fc;
  border: 1px solid #0284c7;
}

.reset-btn:hover {
  background: #1c498c;
  color: #ffffff;
}
</style>
