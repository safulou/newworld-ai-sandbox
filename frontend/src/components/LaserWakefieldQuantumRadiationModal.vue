<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚡</span>
          <div>
            <h2>超強雷射等離子體尾波場吉電子伏特對撞與量子輻射反作用反應堆</h2>
            <p class="subtitle">Petawatt Plasma Bubble Wakefield, Strong-Field QED χ_e Recoil & Breit-Wheeler Pair Cascade</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="lwfa-qed-svg">
            <defs>
              <linearGradient id="lwfaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1c0610" />
                <stop offset="50%" stop-color="#2e091b" />
                <stop offset="100%" stop-color="#0f0208" />
              </linearGradient>

              <filter id="glowLwfa">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#lwfaBg)" rx="8" />

            <!-- Left: Plasma Cavitation Bubble Wakefield & Relativistic Electron/Positron Bunch -->
            <g transform="translate(20, 20)">
              <!-- Plasma Cavitation Bubble Sheath -->
              <ellipse
                cx="220"
                cy="160"
                rx="155"
                ry="82"
                fill="rgba(244, 63, 94, 0.08)"
                stroke="#f43f5e"
                stroke-width="2.0"
                stroke-dasharray="6 4"
                filter="url(#glowLwfa)"
              />

              <!-- Betatron Oscillation Trajectory -->
              <path
                :d="bunchPathD"
                fill="none"
                stroke="#38bdf8"
                stroke-width="2.4"
                filter="url(#glowLwfa)"
              />

              <!-- 16 Accelerated Electrons & Breit-Wheeler Positrons -->
              <g v-for="pt in state.bunchParticles" :key="pt.id">
                <circle
                  :cx="pt.x"
                  :cy="pt.y"
                  :r="4.0 + Math.min(5.0, pt.localQuantumChi * 2.5)"
                  :fill="pt.isPositronPair ? '#fde047' : '#38bdf8'"
                  filter="url(#glowLwfa)"
                />
              </g>

              <text x="220" y="306" text-anchor="middle" fill="#fecdd3" font-size="12" font-family="monospace">
                a_0 = {{ state.laserNormalizedPotentialA0 }} · χ_e = {{ state.quantumNonlinearityChiE }} · E_z = {{ state.wakefieldGradientGvM }} GV/m
              </text>
            </g>

            <!-- Right: Strong-Field QED & Wakefield Metrics -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#2d091a" stroke="#e11d48" stroke-width="1" />
              <text x="14" y="22" fill="#fda4af" font-size="11" font-family="sans-serif">尾波場縱向加速梯度 E_z (GV/m)</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                {{ state.wakefieldGradientGvM }} GV/m
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#2d091a" stroke="#e11d48" stroke-width="1" />
              <text x="14" y="88" fill="#fda4af" font-size="11" font-family="sans-serif">強場 QED 量子非線性參數 χ_e</text>
              <text x="14" y="111" fill="#fde047" font-size="18" font-weight="bold" font-family="monospace">
                χ_e = {{ state.quantumNonlinearityChiE }} <tspan font-size="11" fill="#fecdd3">(輻射反作用閾值)</tspan>
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#2d091a" stroke="#e11d48" stroke-width="1" />
              <text x="14" y="154" fill="#fda4af" font-size="11" font-family="sans-serif">尾波場峰值電子束能量 ε_max (GeV)</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.peakElectronEnergyGev }} GeV
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#2d091a" stroke="#e11d48" stroke-width="1" />
              <text x="14" y="220" fill="#fda4af" font-size="11" font-family="sans-serif">布萊特-惠勒正電子對產生率 Γ_e+e- (10⁹ s⁻¹)</text>
              <text x="14" y="242" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.breitWheelerPairRateGiga }} × 10⁹ s⁻¹
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#4c0519" />
              <rect x="14" y="252" :width="Math.min(250, (state.breitWheelerPairRateGiga / 150.0) * 250)" height="6" rx="3" fill="#f43f5e" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">等離子體尾波場與強場 QED 對撞體制選擇 (Regime Select)</label>
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
              <span>雷射正規化矢勢 a_0</span>
              <span class="value">{{ state.laserNormalizedPotentialA0 }}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="120.0"
              step="1.0"
              :value="state.laserNormalizedPotentialA0"
              @input="onA0Input"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>等離子體電子密度 n_e (10¹⁸ cm⁻³)</span>
              <span class="value">{{ state.plasmaDensity18Cm3 }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              :value="state.plasmaDensity18Cm3"
              @input="onDensityInput"
            />
          </div>

          <div class="control-group action-buttons full-width">
            <button class="action-btn audio-btn" @click="playWakefieldSound">
              🔊 激發空泡尾波場與伽瑪反衝啁啾音
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
  laserWakefieldQuantumRadiationColliderEngine,
  LaserWakefieldQedRegime
} from '../engine/laserWakefieldQuantumRadiationCollider';

const uiStore = useUIStore();
const engine = laserWakefieldQuantumRadiationColliderEngine;
const state = computed(() => engine.getState());

const regimes: { id: LaserWakefieldQedRegime; label: string }[] = [
  { id: 'linear-plasma-wakefield', label: '線性等離子體尾波場' },
  { id: 'nonlinear-cavitation-bubble-gev', label: '非線性空泡 GeV 加速' },
  { id: 'stochastic-quantum-radiation-recoil', label: '隨機量子輻射反作用' },
  { id: 'breit-wheeler-pair-avalanche', label: 'Breit-Wheeler 正負電子對雪崩' }
];

const bunchPathD = computed(() => {
  const pts = state.value.bunchParticles;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
});

function handleClose() {
  uiStore.setLaserWakefieldQuantumRadiationModal(false);
}

function onA0Input(e: Event) {
  engine.setLaserPotentialA0(Number((e.target as HTMLInputElement).value));
}

function onDensityInput(e: Event) {
  engine.setPlasmaDensity(Number((e.target as HTMLInputElement).value));
}

function playWakefieldSound() {
  engine.triggerWakefieldColliderSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 2, 7, 0.8);
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
  background: #1c050f;
  border: 1px solid #e11d48;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(225, 29, 72, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2b0817;
  border-bottom: 1px solid #be123c;
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
  color: #ffe4e6;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fb7185;
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
  border: 1px solid #e11d48;
}

.lwfa-qed-svg {
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
  color: #fda4af;
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
  background: #33091b;
  color: #fecdd3;
  border: 1px solid #e11d48;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #e11d48;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.45);
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
  color: #fecdd3;
}

.slider-header .value {
  font-family: monospace;
  color: #f43f5e;
}

input[type="range"] {
  accent-color: #e11d48;
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
  background: #e11d48;
  color: #ffffff;
}

.audio-btn:hover {
  background: #f43f5e;
}

.reset-btn {
  background: #3d0a20;
  color: #fda4af;
  border: 1px solid #e11d48;
}

.reset-btn:hover {
  background: #540e2c;
  color: #ffffff;
}
</style>
