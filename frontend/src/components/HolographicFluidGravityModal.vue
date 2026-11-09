<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card fluid-gravity-modal">
      <header class="modal-header">
        <div class="title-group">
          <span class="icon-badge">🌊</span>
          <div>
            <h2>全息流體-引力對偶與反德西特黑洞視界相對論性量子湍流引擎</h2>
            <p class="subtitle">Holographic Fluid/Gravity Correspondence & AdS Horizon Relativistic Quantum Turbulence</p>
          </div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </header>

      <div class="modal-body">
        <!-- 左側：碎形黑洞視界波紋與逆能量級聯 k^{-5/3} 偶極渦旋 SVG 動態視圖 -->
        <div class="viz-panel">
          <div class="svg-container">
            <svg viewBox="0 0 330 320" class="fluid-svg">
              <defs>
                <radialGradient id="horizonTurbulenceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#c084fc" stop-opacity="0.3" />
                  <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.16" />
                  <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
                </radialGradient>
              </defs>

              <rect width="330" height="320" fill="#060913" rx="10" />
              <circle cx="165" cy="160" r="142" fill="url(#horizonTurbulenceGlow)" />

              <!-- 碎形黑洞事件視界等高線 (D_H = 2 + \Delta D) -->
              <circle cx="141" cy="160" r="52" fill="none" stroke="rgba(56, 189, 248, 0.32)" stroke-dasharray="5 3" />
              <circle cx="189" cy="160" r="52" fill="none" stroke="rgba(244, 63, 94, 0.32)" stroke-dasharray="5 3" />
              <circle cx="165" cy="160" r="102" fill="none" stroke="rgba(192, 132, 252, 0.25)" stroke-dasharray="3 3" />

              <!-- 16 個正/反氣旋全息渦旋與 Raychaudhuri 視界剪切節點 -->
              <g v-for="node in state.eddyNodes" :key="node.id">
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  :r="11 - node.wavenumberK"
                  fill="none"
                  :stroke="eddyColor(node.eddyPolarity)"
                  stroke-width="1.1"
                  stroke-opacity="0.45"
                />
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  r="4.8"
                  :fill="eddyColor(node.eddyPolarity)"
                  stroke="#0f172a"
                  stroke-width="1.2"
                />
              </g>

              <text x="12" y="22" fill="#e9d5ff" font-size="10" font-family="monospace">
                4π(η/s) = 1 - 4λ_GB = {{ state.kssViscosityToEntropyRatio4Pi.toFixed(3) }} | D_H = {{ state.horizonFractalDimensionDh.toFixed(3) }}
              </text>
              <text x="12" y="308" fill="#7dd3fc" font-size="10" font-family="monospace">
                E(k) ∝ k^(-{{ state.inverseCascadeSpectralSlope.toFixed(3) }}) | dA_H/dt = {{ state.raychaudhuriEntropyProduction.toFixed(2) }}
              </text>
            </svg>
          </div>

          <div class="regime-banner">
            <span class="regime-tag">當前流體/引力對偶體制：</span>
            <strong>{{ regimeLabel(state.activeRegime) }}</strong>
          </div>
        </div>

        <!-- 右側：6 大物理指標與控制面板 -->
        <div class="control-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">全息超流雷諾數 (log10 Re)</span>
              <span class="m-val cyan">{{ state.superfluidReynoldsNumberLog10.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Gauss-Bonnet 耦合 (λ_GB)</span>
              <span class="m-val violet">{{ state.gaussBonnetCouplingLambda.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">KSS 黏滯熵比 4π(η/s)</span>
              <span class="m-val gold">{{ state.kssViscosityToEntropyRatio4Pi.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">黑洞視界碎形維度 (D_H)</span>
              <span class="m-val emerald">{{ state.horizonFractalDimensionDh.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">逆級聯能譜指數 (-α_E)</span>
              <span class="m-val cyan">{{ state.inverseCascadeSpectralSlope.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Raychaudhuri 視界熵增率</span>
              <span class="m-val rose">{{ state.raychaudhuriEntropyProduction.toFixed(2) }}</span>
            </div>
          </div>

          <div class="sliders-box">
            <div class="slider-row">
              <label>
                <span>邊界共形流體雷諾數對數 log10(Re_s)</span>
                <strong>{{ state.superfluidReynoldsNumberLog10.toFixed(2) }}</strong>
              </label>
              <input
                type="range"
                min="1.5"
                max="6.0"
                step="0.1"
                :value="state.superfluidReynoldsNumberLog10"
                @input="onReynoldsChange"
              />
            </div>

            <div class="slider-row">
              <label>
                <span>高階引力 Gauss-Bonnet 耦合 λ_GB</span>
                <strong>{{ state.gaussBonnetCouplingLambda.toFixed(3) }}</strong>
              </label>
              <input
                type="range"
                min="-0.15"
                max="0.09"
                step="0.005"
                :value="state.gaussBonnetCouplingLambda"
                @input="onLambdaChange"
              />
            </div>
          </div>

          <div class="preset-row">
            <button
              v-for="r in regimes"
              :key="r.key"
              class="preset-btn"
              :class="{ active: state.activeRegime === r.key }"
              @click="selectRegime(r.key)"
            >
              {{ r.name }}
            </button>
          </div>

          <div class="action-row">
            <button class="sound-btn" @click="playSound">
              🔊 合成 k^(-5/3) 逆能量級聯與碎形黑洞視界 Raychaudhuri 剪切共鳴音
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { achievements } from '@/engine/achievements'
import {
  holographicFluidGravityHorizonTurbulenceEngine,
  type HolographicFluidGravityRegime
} from '@/engine/holographicFluidGravityHorizonTurbulence'

const ui = useUIStore()
const state = reactive(holographicFluidGravityHorizonTurbulenceEngine.getState())
let timer: number | null = null

const regimes: { key: HolographicFluidGravityRegime; name: string }[] = [
  { key: 'kss-minimal-viscosity-hydrodynamic-shear', name: 'KSS 極小黏滯度 η/s = 1/4π 剪切流' },
  { key: 'inverse-energy-cascade-kolmogorov-k53', name: '科爾莫戈羅夫 k^(-5/3) 逆能量級聯' },
  { key: 'fractal-black-brane-horizon-vortex-shedding', name: '碎形黑膜視界 D_H > 2 渦旋脫落' },
  { key: 'giant-vortex-dipole-superfluid-condensate', name: '邊界巨型偶極渦旋對凝聚態' }
]

function syncState(): void {
  Object.assign(state, holographicFluidGravityHorizonTurbulenceEngine.getState())
}

function onReynoldsChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  holographicFluidGravityHorizonTurbulenceEngine.setSuperfluidReynoldsNumberLog10(val)
  syncState()
}

function onLambdaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  holographicFluidGravityHorizonTurbulenceEngine.setGaussBonnetCouplingLambda(val)
  syncState()
}

function selectRegime(r: HolographicFluidGravityRegime): void {
  holographicFluidGravityHorizonTurbulenceEngine.setRegime(r)
  holographicFluidGravityHorizonTurbulenceEngine.triggerFluidGravityTurbulenceSound()
  achievements.unlock('holographic_fluid_gravity_horizon_turbulence')
  syncState()
}

function playSound(): void {
  holographicFluidGravityHorizonTurbulenceEngine.triggerFluidGravityTurbulenceSound()
  achievements.unlock('holographic_fluid_gravity_horizon_turbulence')
}

function eddyColor(polarity: string): string {
  if (polarity === 'cyclonic-positive-vorticity') return '#38bdf8'
  if (polarity === 'anticyclonic-negative-vorticity') return '#fb7185'
  return '#c084fc'
}

function regimeLabel(r: HolographicFluidGravityRegime): string {
  return regimes.find(item => item.key === r)?.name || r
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  achievements.unlock('holographic_fluid_gravity_horizon_turbulence')
  timer = window.setInterval(() => {
    holographicFluidGravityHorizonTurbulenceEngine.update(0.06)
    syncState()
  }, 60)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  width: min(960px, 95vw);
  background: rgba(10, 15, 30, 0.96);
  border: 1px solid rgba(192, 132, 252, 0.45);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(192, 132, 252, 0.2);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: linear-gradient(90deg, rgba(192, 132, 252, 0.16), rgba(56, 189, 248, 0.08));
  border-bottom: 1px solid rgba(192, 132, 252, 0.25);
}
.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-badge {
  font-size: 28px;
}
.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #c084fc;
}
.subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}
.close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  padding: 20px;
}
.svg-container {
  background: #060913;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.fluid-svg {
  width: 100%;
  height: auto;
  display: block;
}
.regime-banner {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(192, 132, 252, 0.12);
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #e9d5ff;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}
.metric-box {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.m-label {
  font-size: 11px;
  color: #94a3b8;
}
.m-val {
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
}
.m-val.cyan { color: #38bdf8; }
.m-val.violet { color: #c084fc; }
.m-val.gold { color: #facc15; }
.m-val.emerald { color: #34d399; }
.m-val.rose { color: #fb7185; }
.sliders-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}
.slider-row label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
  margin-bottom: 4px;
}
.slider-row input[type='range'] {
  width: 100%;
  accent-color: #c084fc;
}
.preset-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.preset-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e2e8f0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.preset-btn.active,
.preset-btn:hover {
  background: rgba(192, 132, 252, 0.22);
  border-color: #c084fc;
  color: #c084fc;
}
.sound-btn {
  width: 100%;
  background: linear-gradient(90deg, #9333ea, #0284c7);
  border: none;
  color: #fff;
  padding: 11px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
</style>
