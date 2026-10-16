<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌊</span>
          <div>
            <h2>相對論性引力波磁流體阿爾文孤子共振腔</h2>
            <p class="subtitle">GRMHD Alfvén Envelope Solitons, Gertsenshtein Parametric Coupling & FRB Poynting Surge</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="alfven-gw-svg">
            <defs>
              <linearGradient id="alfvenBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#170c04" />
                <stop offset="50%" stop-color="#291406" />
                <stop offset="100%" stop-color="#0d0602" />
              </linearGradient>

              <filter id="glowAlfven">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#alfvenBg)" rx="8" />

            <!-- Left: Relativistic Alfvén-GW Soliton Envelope & Magnetosphere Flux Tubes -->
            <g transform="translate(20, 20)">
              <!-- Background Guide Magnetic Field Lines B_0 -->
              <line x1="25" y1="80" x2="415" y2="80" stroke="#9a3412" stroke-width="1" stroke-dasharray="6 4" opacity="0.5" />
              <line x1="25" y1="160" x2="415" y2="160" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6" />
              <line x1="25" y1="240" x2="415" y2="240" stroke="#9a3412" stroke-width="1" stroke-dasharray="6 4" opacity="0.5" />

              <!-- DNLS Soliton Waveform Path -->
              <path
                :d="wavePathD"
                fill="none"
                stroke="#fb923c"
                stroke-width="3.2"
                filter="url(#glowAlfven)"
              />

              <!-- Wavefront Sampling Nodes -->
              <g v-for="wn in state.waveNodes" :key="wn.id">
                <circle
                  :cx="wn.x"
                  :cy="wn.y - 20"
                  :r="3.2 + wn.solitonEnvelope * 4.5"
                  fill="#fde047"
                  filter="url(#glowAlfven)"
                />
              </g>

              <text x="220" y="305" text-anchor="middle" fill="#fed7aa" font-size="12" font-family="monospace">
                v_A / c = {{ state.alfvenVelocityRatioC }} · M_A = {{ state.solitonMachNumber }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: GRMHD & Gertsenshtein Parametric Gauges -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#2b1406" stroke="#d97706" stroke-width="1" />
              <text x="14" y="22" fill="#fdba74" font-size="11" font-family="sans-serif">相對論阿爾文波速比 v_A / c</text>
              <text x="14" y="45" fill="#fbbf24" font-size="19" font-weight="bold" font-family="monospace">
                {{ state.alfvenVelocityRatioC }} c <tspan font-size="11" fill="#fed7aa">(σ_mag = {{ state.magnetizationSigma }})</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#2b1406" stroke="#d97706" stroke-width="1" />
              <text x="14" y="88" fill="#fdba74" font-size="11" font-family="sans-serif">蓋爾森斯坦引力波-阿爾文轉換率 η_GW→A</text>
              <text x="14" y="111" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.gertsenshteinConversionPct }} %
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#2b1406" stroke="#d97706" stroke-width="1" />
              <text x="14" y="154" fill="#fdba74" font-size="11" font-family="sans-serif">引力波特徵應變對數 log₁₀(h₀)</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                10^({{ state.gwStrainLog10 }})
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#2b1406" stroke="#d97706" stroke-width="1" />
              <text x="14" y="220" fill="#fdba74" font-size="11" font-family="sans-serif">電磁坡印廷輻射光度 L_EM (10⁴⁴ erg/s)</text>
              <text x="14" y="242" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.poyntingFluxLuminosity }} × 10⁴⁴ erg/s
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#431407" />
              <rect x="14" y="252" :width="Math.min(250, (state.poyntingFluxLuminosity / 250.0) * 250)" height="6" rx="3" fill="#fb923c" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">相對論引力波-阿爾文共振體制選擇 (Regime Select)</label>
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
              <span>引力波應變對數 log₁₀(h₀)</span>
              <span class="value">{{ state.gwStrainLog10 }}</span>
            </div>
            <input
              type="range"
              min="-22.0"
              max="-16.0"
              step="0.5"
              :value="state.gwStrainLog10"
              @input="onStrainInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>相對論磁化參數 σ_mag</span>
              <span class="value">{{ state.magnetizationSigma }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="50.0"
              step="0.5"
              :value="state.magnetizationSigma"
              @input="onSigmaInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>磁聲孤子馬赫數 M_A</span>
              <span class="value">{{ state.solitonMachNumber }}</span>
            </div>
            <input
              type="range"
              min="1.05"
              max="5.00"
              step="0.05"
              :value="state.solitonMachNumber"
              @input="onMachInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playAlfvenSound">
              🔊 激發阿爾文-引力波孤子脈衝音
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
  gravitationalAlfvenSolitonResonatorEngine,
  GravitationalAlfvenRegime
} from '../engine/gravitationalAlfvenSolitonResonator';

const uiStore = useUIStore();
const engine = gravitationalAlfvenSolitonResonatorEngine;
const state = computed(() => engine.getState());

const regimes: { id: GravitationalAlfvenRegime; label: string }[] = [
  { id: 'linear-alfven-gw-dispersion', label: '線性色散耦合' },
  { id: 'parametric-gertsenshtein-resonance', label: '蓋爾森斯坦參量共振' },
  { id: 'dnls-alfven-envelope-soliton', label: 'DNLS 包絡阿爾文孤子' },
  { id: 'relativistic-frb-poynting-shock', label: 'FRB 坡印廷激波爆發' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const wavePathD = computed(() => {
  const pts = state.value.waveNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y - 20}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y - 20}`;
  }
  return d;
});

function handleClose() {
  uiStore.setGravitationalAlfvenSolitonModal(false);
}

function onStrainInput(e: Event) {
  engine.setGwStrainLog10(Number((e.target as HTMLInputElement).value));
}

function onSigmaInput(e: Event) {
  engine.setMagnetizationSigma(Number((e.target as HTMLInputElement).value));
}

function onMachInput(e: Event) {
  engine.setSolitonMachNumber(Number((e.target as HTMLInputElement).value));
}

function playAlfvenSound() {
  engine.triggerAlfvenSolitonSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(12, 6, 2, 0.8);
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
  background: #1a0c04;
  border: 1px solid #ea580c;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(249, 115, 22, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #291306;
  border-bottom: 1px solid #c2410c;
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
  color: #ffedd5;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fb923c;
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
  border: 1px solid #ea580c;
}

.alfven-gw-svg {
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
  color: #fdba74;
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
  background: #2e1507;
  color: #fed7aa;
  border: 1px solid #ea580c;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #ea580c;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(251, 146, 60, 0.45);
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
  color: #fed7aa;
}

.slider-header .value {
  font-family: monospace;
  color: #fbbf24;
}

input[type="range"] {
  accent-color: #f97316;
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
  background: #ea580c;
  color: #ffffff;
}

.audio-btn:hover {
  background: #f97316;
  box-shadow: 0 0 12px rgba(251, 146, 60, 0.4);
}

.reset-btn {
  background: #361808;
  color: #fdba74;
  border: 1px solid #ea580c;
}

.reset-btn:hover {
  background: #4d220b;
  color: #ffffff;
}
</style>
