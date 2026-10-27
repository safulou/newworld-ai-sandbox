<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🔷</span>
          <div>
            <h2>菱方五層石墨烯分數陳絕緣體與手性拓撲超導</h2>
            <p class="subtitle">ABCDE-Stacked Rhombohedral Pentalayer Graphene, Zero-Field FQAH Crystal & Chiral p+ip Superconductor</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="rhombo-svg">
            <defs>
              <linearGradient id="rhomboBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#071a26" />
                <stop offset="50%" stop-color="#0d2f45" />
                <stop offset="100%" stop-color="#040d14" />
              </linearGradient>

              <filter id="glowRhombo">
                <feGaussianBlur stdDeviation="2.7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#rhomboBg)" rx="8" />

            <!-- Left: ABCDE Rhombohedral Flat-Band Berry Curvature & Chiral p+ip Edge Current -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="114" fill="none" stroke="#22d3ee" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.5" />
              <circle cx="165" cy="160" r="78" fill="none" stroke="#38bdf8" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.45" />

              <!-- Chiral p+ip Superconducting Vortex & Hall Crystal Contour -->
              <path
                :d="rhomboPathD"
                fill="rgba(34, 211, 238, 0.1)"
                stroke="#22d3ee"
                stroke-width="2.2"
                filter="url(#glowRhombo)"
              />

              <!-- 18 ABCDE Flat-Band Isospin & Laughlin Quasihole Nodes -->
              <g v-for="fn in state.flatBandNodes" :key="fn.id">
                <circle
                  :cx="fn.x"
                  :cy="fn.y"
                  :r="4.5 + fn.berryCurvatureFlux * 4.2"
                  :fill="fn.valleyChiralityK > 0 ? '#06b6d4' : '#f43f5e'"
                  filter="url(#glowRhombo)"
                />
                <text
                  :x="fn.x"
                  :y="fn.y - 9"
                  text-anchor="middle"
                  :fill="fn.valleyChiralityK > 0 ? '#a5f3fc' : '#fda4af'"
                  font-size="8"
                  font-family="monospace"
                >
                  {{ fn.valleyChiralityK > 0 ? 'K↑' : "K'↓" }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#a5f3fc" font-size="12" font-family="monospace">
                D = {{ state.displacementFieldVNm }} V/nm · R_xy = {{ state.quantizedHallResistanceHOverE2 }} h/e² · I_c = {{ state.chiralCriticalCurrentNa }} nA
              </text>
            </g>

            <!-- Right: Rhombohedral Pentalayer Graphene Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#0b2638" stroke="#06b6d4" stroke-width="1" />
              <text x="14" y="22" fill="#67e8f9" font-size="11" font-family="sans-serif">零磁場量子化霍爾電阻 R_xy / (h/e²)</text>
              <text x="14" y="45" fill="#22d3ee" font-size="19" font-weight="bold" font-family="monospace">
                R_xy = {{ state.quantizedHallResistanceHOverE2 }} h/e²
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#0b2638" stroke="#06b6d4" stroke-width="1" />
              <text x="14" y="88" fill="#67e8f9" font-size="11" font-family="sans-serif">手性 p+ip 超導臨界電流 I_c (nA)</text>
              <text x="14" y="111" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                I_c = {{ state.chiralCriticalCurrentNa }} nA
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#0b2638" stroke="#06b6d4" stroke-width="1" />
              <text x="14" y="154" fill="#67e8f9" font-size="11" font-family="sans-serif">平帶貝里曲率偶極矩 Λ_BCD (nm)</text>
              <text x="14" y="177" fill="#f472b6" font-size="18" font-weight="bold" font-family="monospace">
                Λ_BCD = {{ state.berryCurvatureDipoleNm }} nm
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#0b2638" stroke="#06b6d4" stroke-width="1" />
              <text x="14" y="220" fill="#67e8f9" font-size="11" font-family="sans-serif">自旋-能谷同位旋極化度 P_sv 與填充 ν</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                P_sv = {{ state.spinValleyPolarizationPsv }} | ν = {{ state.moirélessFillingFactorNu }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#13405e" />
              <rect x="14" y="252" :width="Math.min(250, state.spinValleyPolarizationPsv * 250)" height="6" rx="3" fill="#22d3ee" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">菱方五層石墨烯平帶量子相體制選擇 (Regime Select)</label>
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
              <span>垂直位移電場強度 D (V/nm)</span>
              <span class="value">{{ state.displacementFieldVNm }} V/nm</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.40"
              step="0.02"
              :value="state.displacementFieldVNm"
              @input="onFieldInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>平帶分數填充因子 ν</span>
              <span class="value">ν = {{ state.moirélessFillingFactorNu }}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="1.00"
              step="0.01"
              :value="state.moirélessFillingFactorNu"
              @input="onNuInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>自旋-能谷極化度 P_sv</span>
              <span class="value">{{ state.spinValleyPolarizationPsv }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.00"
              step="0.01"
              :value="state.spinValleyPolarizationPsv"
              @input="onPolarizationInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playRhomboSound">
              🔊 激發菱方平帶手性超導諧音
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
  rhombohedralGrapheneChiralSuperconductorEngine,
  RhombohedralGrapheneRegime
} from '../engine/rhombohedralGrapheneChiralSuperconductor';

const uiStore = useUIStore();
const engine = rhombohedralGrapheneChiralSuperconductorEngine;
const state = computed(() => engine.getState());

const regimes: { id: RhombohedralGrapheneRegime; label: string }[] = [
  { id: 'unpolarized-rhombohedral-semimetal', label: '非極化菱方半金屬態' },
  { id: 'spin-valley-quarter-metal', label: '自旋-能谷四分之一金屬' },
  { id: 'anomalous-hall-crystal-fqah', label: '反常霍爾晶體與零場 FQAH' },
  { id: 'chiral-p-ip-topological-superconductor', label: '手性 p+ip 拓撲超導凝聚態' }
];

const rhomboPathD = computed(() => {
  const pts = state.value.flatBandNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setRhombohedralGrapheneModal(false);
}

function onFieldInput(e: Event) {
  engine.setDisplacementField(Number((e.target as HTMLInputElement).value));
}

function onNuInput(e: Event) {
  engine.setFillingFactorNu(Number((e.target as HTMLInputElement).value));
}

function onPolarizationInput(e: Event) {
  engine.setSpinValleyPolarization(Number((e.target as HTMLInputElement).value));
}

function playRhomboSound() {
  engine.triggerRhombohedralSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 13, 20, 0.82);
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
  background: #061621;
  border: 1px solid #06b6d4;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(6, 182, 212, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0a2538;
  border-bottom: 1px solid #0891b2;
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
  color: #ecfeff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #67e8f9;
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
  border: 1px solid #0891b2;
}

.rhombo-svg {
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
  color: #67e8f9;
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
  background: #0d3047;
  color: #cffafe;
  border: 1px solid #0891b2;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #0891b2;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.45);
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
  color: #cffafe;
}

.slider-header .value {
  font-family: monospace;
  color: #22d3ee;
}

input[type="range"] {
  accent-color: #06b6d4;
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
  background: #0891b2;
  color: #ffffff;
}

.audio-btn:hover {
  background: #06b6d4;
}

.reset-btn {
  background: #103b57;
  color: #67e8f9;
  border: 1px solid #0891b2;
}

.reset-btn:hover {
  background: #165178;
  color: #ffffff;
}
</style>
