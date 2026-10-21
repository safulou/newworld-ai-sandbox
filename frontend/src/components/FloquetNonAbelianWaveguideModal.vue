<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌈</span>
          <div>
            <h2>弗洛凱螺旋調制光子波導陣列與非阿貝爾任意子編織器</h2>
            <p class="subtitle">Helical Photonic Waveguide Synthetic Gauge Field, Wilczek-Zee U(N) Holonomy & π-Mode Braiding</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="waveguide-svg">
            <defs>
              <linearGradient id="wgBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1f0921" />
                <stop offset="50%" stop-color="#38103b" />
                <stop offset="100%" stop-color="#110412" />
              </linearGradient>

              <filter id="glowWg">
                <feGaussianBlur stdDeviation="2.7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#wgBg)" rx="8" />

            <!-- Left: Helically Modulated Photonic Waveguide Cores & Non-Abelian Worldline Braids -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="112" fill="none" stroke="#f472b6" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="56" fill="none" stroke="#38bdf8" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.45" />

              <!-- Helical Braiding Worldlines -->
              <path
                :d="helixPathD"
                fill="rgba(244, 114, 182, 0.08)"
                stroke="#f472b6"
                stroke-width="2.2"
                filter="url(#glowWg)"
              />

              <!-- 16 Helical Waveguide Core & π-Mode Edge Nodes -->
              <g v-for="wn in state.waveguideNodes" :key="wn.id">
                <circle
                  :cx="wn.x"
                  :cy="wn.y"
                  :r="4.5 + wn.holonomyMatrixWeight * 4"
                  :fill="wn.isPiModeEdgeChannel ? '#ec4899' : '#38bdf8'"
                  filter="url(#glowWg)"
                />
                <text
                  :x="wn.x"
                  :y="wn.y - 9"
                  text-anchor="middle"
                  :fill="wn.isPiModeEdgeChannel ? '#fbcfe8' : '#bae6fd'"
                  font-size="8"
                  font-family="monospace"
                >
                  ψ_{{ wn.zeroModeSubspaceIdx }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#fbcfe8" font-size="12" font-family="monospace">
                |Tr(U_WZ)|/N = {{ state.wilczekZeeHolonomyNorm }} · Δε_π = {{ state.floquetPiGapInverseCm }} cm⁻¹ · V_HOM = {{ state.homBraidingVisibilityPct }}%
              </text>
            </g>

            <!-- Right: Non-Abelian Photonic Holonomy & π-Mode Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#2d0c30" stroke="#ec4899" stroke-width="1" />
              <text x="14" y="22" fill="#fbcfe8" font-size="11" font-family="sans-serif">Wilczek-Zee 非阿貝爾和樂保真度 |Tr(U_WZ)|/N</text>
              <text x="14" y="45" fill="#f472b6" font-size="19" font-weight="bold" font-family="monospace">
                |Tr(U_WZ)|/N = {{ state.wilczekZeeHolonomyNorm }}
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#2d0c30" stroke="#ec4899" stroke-width="1" />
              <text x="14" y="88" fill="#fbcfe8" font-size="11" font-family="sans-serif">反常弗洛凱準能量 π-模能隙 Δε_π (cm⁻¹)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                Δε_π = {{ state.floquetPiGapInverseCm }} cm⁻¹
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#2d0c30" stroke="#ec4899" stroke-width="1" />
              <text x="14" y="154" fill="#fbcfe8" font-size="11" font-family="sans-serif">雙光子 HOM 非阿貝爾編織干涉可見度 V_HOM</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                V_HOM = {{ state.homBraidingVisibilityPct }}%
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#2d0c30" stroke="#ec4899" stroke-width="1" />
              <text x="14" y="220" fill="#fbcfe8" font-size="11" font-family="sans-serif">螺旋空間頻率 Ω_z 與波導螺旋半徑 R_h</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                {{ state.helixModulationFreqCm }} cm⁻¹ | {{ state.helixRadiusUm }} μm
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#4d1452" />
              <rect x="14" y="252" :width="Math.min(250, state.wilczekZeeHolonomyNorm * 250)" height="6" rx="3" fill="#ec4899" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">弗洛凱螺旋光子波導與非阿貝爾和樂體制選擇 (Regime Select)</label>
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
              <span>螺旋調制空間頻率 Ω_z (cm⁻¹)</span>
              <span class="value">{{ state.helixModulationFreqCm }} cm⁻¹</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="24.0"
              step="0.5"
              :value="state.helixModulationFreqCm"
              @input="onFreqInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>波導螺旋半徑 R_h (μm)</span>
              <span class="value">{{ state.helixRadiusUm }} μm</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="35.0"
              step="0.5"
              :value="state.helixRadiusUm"
              @input="onRadiusInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>倏逝波耦合強度 J_0 (cm⁻¹)</span>
              <span class="value">{{ state.evanescentCouplingCm }} cm⁻¹</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              :value="state.evanescentCouplingCm"
              @input="onCouplingInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playWaveguideSound">
              🔊 激發非阿貝爾光子編織諧音
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
  floquetNonAbelianPhotonicWaveguideEngine,
  FloquetPhotonicWaveguideRegime
} from '../engine/floquetNonAbelianPhotonicWaveguide';

const uiStore = useUIStore();
const engine = floquetNonAbelianPhotonicWaveguideEngine;
const state = computed(() => engine.getState());

const regimes: { id: FloquetPhotonicWaveguideRegime; label: string }[] = [
  { id: 'straight-abelian-waveguide-array', label: '平直阿貝爾波導陣列' },
  { id: 'anomalous-floquet-chiral-edge', label: '反常弗洛凱手性邊界態' },
  { id: 'wilczek-zee-non-abelian-holonomy', label: 'Wilczek-Zee 非阿貝爾和樂' },
  { id: 'pi-mode-photonic-anyon-braider', label: 'π-模光子任意子編織器' }
];

const helixPathD = computed(() => {
  const pts = state.value.waveguideNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setFloquetNonAbelianWaveguideModal(false);
}

function onFreqInput(e: Event) {
  engine.setHelixModulationFreq(Number((e.target as HTMLInputElement).value));
}

function onRadiusInput(e: Event) {
  engine.setHelixRadius(Number((e.target as HTMLInputElement).value));
}

function onCouplingInput(e: Event) {
  engine.setEvanescentCoupling(Number((e.target as HTMLInputElement).value));
}

function playWaveguideSound() {
  engine.triggerFloquetWaveguideSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 4, 18, 0.82);
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
  background: #1c071e;
  border: 1px solid #ec4899;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(236, 72, 153, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2e0b30;
  border-bottom: 1px solid #db2777;
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
  color: #fdf2f8;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #f9a8d4;
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
  border: 1px solid #db2777;
}

.waveguide-svg {
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
  color: #fbcfe8;
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
  background: #380e3b;
  color: #fce7f3;
  border: 1px solid #db2777;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #db2777;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(244, 114, 182, 0.45);
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
  color: #fce7f3;
}

.slider-header .value {
  font-family: monospace;
  color: #f472b6;
}

input[type="range"] {
  accent-color: #ec4899;
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
  background: #db2777;
  color: #ffffff;
}

.audio-btn:hover {
  background: #ec4899;
}

.reset-btn {
  background: #421045;
  color: #fbcfe8;
  border: 1px solid #db2777;
}

.reset-btn:hover {
  background: #5e1763;
  color: #ffffff;
}
</style>
