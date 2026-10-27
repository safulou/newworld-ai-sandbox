<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>漸近安全量子引力與非微擾紫外線不動點對撞</h2>
            <p class="subtitle">Weinberg-Reuter Non-Gaussian UV Fixed Point (g*, λ*), Wetterich FRG Flow & Spacetime Dimensional Reduction</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="asymptotic-svg">
            <defs>
              <linearGradient id="asymBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#140b29" />
                <stop offset="50%" stop-color="#24144a" />
                <stop offset="100%" stop-color="#0a0514" />
              </linearGradient>

              <filter id="glowAsym">
                <feGaussianBlur stdDeviation="2.7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#asymBg)" rx="8" />

            <!-- Left: (g_k, λ_k) Phase Space Spiral RG Trajectory into Reuter UV Fixed Point -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="114" fill="none" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="12" fill="#f43f5e" filter="url(#glowAsym)" />
              <text x="165" y="142" text-anchor="middle" fill="#fda4af" font-size="10" font-weight="bold" font-family="monospace">
                UV FP (g*, λ*)
              </text>

              <!-- Spiral RG Flow Curve -->
              <path
                :d="spiralPathD"
                fill="none"
                stroke="#c084fc"
                stroke-width="2.4"
                filter="url(#glowAsym)"
              />

              <!-- 16 Wetterich RG Flow Trajectory Nodes -->
              <g v-for="rn in state.rgSpiralNodes" :key="rn.id">
                <circle
                  :cx="rn.x"
                  :cy="rn.y"
                  :r="rn.isNearUvAttractor ? 5.5 : 4.2"
                  :fill="rn.isNearUvAttractor ? '#38bdf8' : '#a855f7'"
                  filter="url(#glowAsym)"
                />
                <text
                  v-if="rn.id % 3 === 0"
                  :x="rn.x"
                  :y="rn.y - 8"
                  text-anchor="middle"
                  fill="#e9d5ff"
                  font-size="8"
                  font-family="monospace"
                >
                  d_s={{ rn.localSpectralDim }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#e9d5ff" font-size="12" font-family="monospace">
                (g_k, λ_k) = ({{ state.runningDimensionlessNewtonG }}, {{ state.runningDimensionlessLambda }}) · d_s(k) = {{ state.spacetimeSpectralDimensionDs }}
              </text>
            </g>

            <!-- Right: Asymptotically Safe Gravity Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#1e103d" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="22" fill="#d8b4fe" font-size="11" font-family="sans-serif">時空有效譜維度 d_s(k) (4D → 2D 約化)</text>
              <text x="14" y="45" fill="#38bdf8" font-size="19" font-weight="bold" font-family="monospace">
                d_s(k) = {{ state.spacetimeSpectralDimensionDs }} <tspan font-size="11" fill="#e9d5ff">(UV 分形)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#1e103d" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="88" fill="#d8b4fe" font-size="11" font-family="sans-serif">跑動無因次牛頓與宇宙學耦合 (g_k, λ_k)</text>
              <text x="14" y="111" fill="#f43f5e" font-size="17" font-weight="bold" font-family="monospace">
                g = {{ state.runningDimensionlessNewtonG }} | λ = {{ state.runningDimensionlessLambda }}
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#1e103d" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="154" fill="#d8b4fe" font-size="11" font-family="sans-serif">么正化超普朗克引力子散射截面 σ_grav</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                σ_grav = {{ state.unitarizedGravitonCrossSectionPb }} pb
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#1e103d" stroke="#9333ea" stroke-width="1" />
              <text x="14" y="220" fill="#d8b4fe" font-size="11" font-family="sans-serif">重整化截斷能標 k / M_Pl 與 R² 耦合 θ₃</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                k = {{ state.rgMomentumScaleKOverMpl }} M_Pl | θ₃ = {{ state.curvatureSquaredCouplingTheta3 }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#321b66" />
              <rect x="14" y="252" :width="Math.min(250, (state.runningDimensionlessNewtonG / 0.71) * 250)" height="6" rx="3" fill="#c084fc" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">漸近安全量子引力重整化群流體制選擇 (Regime Select)</label>
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
              <span>重整化截斷能標 k / M_Pl</span>
              <span class="value">{{ state.rgMomentumScaleKOverMpl }} M_Pl</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="12.0"
              step="0.15"
              :value="state.rgMomentumScaleKOverMpl"
              @input="onScaleInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>高階曲率平方 R² 耦合 θ₃</span>
              <span class="value">{{ state.curvatureSquaredCouplingTheta3 }}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="3.50"
              step="0.05"
              :value="state.curvatureSquaredCouplingTheta3"
              @input="onThetaInput"
            />
          </div>

          <div class="control-group action-buttons full-width">
            <button class="action-btn audio-btn" @click="playAsymSound">
              🔊 激發紫外不動點維度約化諧音
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
  asymptoticallySafeGravityColliderEngine,
  AsymptoticallySafeGravityRegime
} from '../engine/asymptoticallySafeGravityCollider';

const uiStore = useUIStore();
const engine = asymptoticallySafeGravityColliderEngine;
const state = computed(() => engine.getState());

const regimes: { id: AsymptoticallySafeGravityRegime; label: string }[] = [
  { id: 'infrared-einstein-hilbert-4d', label: '紅外線愛因斯坦-希爾伯特 4D 相' },
  { id: 'crossover-planckian-rg-threshold', label: '普朗克能標重整化群交界區' },
  { id: 'reuter-non-gaussian-uv-fixed-point', label: 'Reuter 非高斯紫外不動點' },
  { id: 'dimensional-reduction-2d-fractal-spacetime', label: '紫外 2D 譜維度約化分形時空' }
];

const spiralPathD = computed(() => {
  const pts = state.value.rgSpiralNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
});

function handleClose() {
  uiStore.setAsymptoticallySafeGravityModal(false);
}

function onScaleInput(e: Event) {
  engine.setRgMomentumScale(Number((e.target as HTMLInputElement).value));
}

function onThetaInput(e: Event) {
  engine.setCurvatureSquaredCoupling(Number((e.target as HTMLInputElement).value));
}

function playAsymSound() {
  engine.triggerAsymptoticSafetySound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 20, 0.82);
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
  background: #120924;
  border: 1px solid #a855f7;
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
  background: #1f103d;
  border-bottom: 1px solid #9333ea;
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
  color: #faf5ff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #d8b4fe;
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
  border: 1px solid #9333ea;
}

.asymptotic-svg {
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
  color: #d8b4fe;
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
  background: #27144d;
  color: #f3e8ff;
  border: 1px solid #9333ea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #9333ea;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
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
  color: #f3e8ff;
}

.slider-header .value {
  font-family: monospace;
  color: #c084fc;
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
}

.reset-btn {
  background: #2e175c;
  color: #d8b4fe;
  border: 1px solid #9333ea;
}

.reset-btn:hover {
  background: #402080;
  color: #ffffff;
}
</style>
