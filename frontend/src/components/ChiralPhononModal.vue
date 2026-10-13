<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { chiralPhononEngine, type ChiralPhononRegime } from '../engine/chiralPhononAcousticHall';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => chiralPhononEngine.getState());

const isOpen = computed(() => uiStore.mode === 'chiral-phonon');

const regimes: Array<{ id: ChiralPhononRegime; label: string; desc: string }> = [
  { id: 'acoustic-anomalous-hall-deflection', label: '反常聲霍爾橫向偏轉相', desc: '聲子感受非零貝里曲率，無磁場自發橫向偏轉 θ_H' },
  { id: 'topological-chiral-heat-rectifier', label: '拓撲手性熱整流二極體', desc: '手性破壞互易性，構造極致單向熱流閥' },
  { id: 'magnon-phonon-hybrid-polariton', label: '磁子-聲子拓撲強雜化態', desc: '反鐵磁自旋波與手性聲子強相干耦合' },
  { id: 'chiral-phonon-circular-vibration', label: '手性原子圓周旋轉態', desc: '原子軌道旋轉攜帶非零固有角動量 l_ph' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateFreq(val: number) {
  chiralPhononEngine.tuneAcousticResonance(val);
  achievements.unlock('chiral_phonon_acoustic_hall');
}

function toggleHandedness() {
  chiralPhononEngine.switchPhononHandedness();
  achievements.unlock('chiral_phonon_acoustic_hall');
}

function pulseHeatFlux() {
  chiralPhononEngine.injectAcousticHeatFlux(0.8);
  achievements.unlock('chiral_phonon_acoustic_hall');
}

function coupleMagnon() {
  chiralPhononEngine.coupleMagnonDrive();
  achievements.unlock('chiral_phonon_acoustic_hall');
}

function reset() {
  chiralPhononEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="chiral-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🔊</span>
          <div>
            <h2>拓撲手性聲子與量子反常聲霍爾效應 (Chiral Phonon & Acoustic Hall)</h2>
            <span class="subtitle">Circular Atomic Orbitals, Phonon Berry Curvature, Zero-Field Acoustic Hall & Diode</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 手性原子圓周旋轉軌道、縱向注入與橫向偏轉光錐 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="chiral-svg">
            <defs>
              <radialGradient id="phononOrbitGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
                <stop offset="70%" stop-color="#059669" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="deflectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
            </defs>

            <!-- 背景底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#02140d" stroke="#10b981" stroke-width="1.8" />

            <!-- 左側：六角蜂巢晶格手性原子圓周旋轉軌道 -->
            <g transform="translate(160, 160)">
              <!-- 晶格保護圈 -->
              <circle cx="0" cy="0" r="95" fill="none" stroke="#064e3b" stroke-width="1.2" stroke-dasharray="4 4" />

              <!-- 六角格點與旋轉軌道 -->
              <g v-for="(node, idx) in [
                { x: 0, y: 0 },
                { x: 0, y: -50 }, { x: 43, y: -25 }, { x: 43, y: 25 },
                { x: 0, y: 50 }, { x: -43, y: 25 }, { x: -43, y: -25 }
              ]" :key="idx">
                <!-- 旋轉軌道圓環 -->
                <circle :cx="node.x" :cy="node.y" r="14" fill="none" stroke="#10b981" stroke-width="1.2" opacity="0.6" />

                <!-- 旋轉手性原子 (以 state.phononChiralityIndex 方向轉動) -->
                <g :transform="`translate(${node.x}, ${node.y})`">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      :from="state.phononChiralityIndex > 0 ? '0 0 0' : '360 0 0'"
                      :to="state.phononChiralityIndex > 0 ? '360 0 0' : '0 0 0'"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <circle cx="14" cy="0" r="4.5" fill="#34d399" />
                    <line x1="0" y1="0" x2="14" y2="0" stroke="#34d399" stroke-width="1.2" />
                  </g>
                </g>
              </g>

              <!-- 中心手性角動量標誌 -->
              <circle cx="0" cy="0" r="8" fill="#059669" />
              <text x="0" y="3" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">
                {{ state.phononChiralityIndex > 0 ? '⟳ R' : '⟲ L' }}
              </text>
            </g>

            <!-- 右側：縱向聲注入與反常橫向聲偏轉角 (θ_H) 光錐 -->
            <g transform="translate(330, 60)">
              <rect x="0" y="0" width="165" height="200" rx="12" fill="#042317" stroke="#065f46" />
              <text x="12" y="22" fill="#e2e8f0" font-size="11" font-weight="bold">反常聲霍爾偏轉 θ_H</text>

              <!-- 聲波波導示意 -->
              <g transform="translate(82, 100)">
                <!-- 基準入射方向 (縱向聲波) -->
                <line x1="-50" y1="0" x2="0" y2="0" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4 2" />
                <polygon points="0,0 -8,-4 -8,4" fill="#94a3b8" />
                <text x="-35" y="-8" fill="#94a3b8" font-size="8">縱向聲流</text>

                <!-- 反常偏轉光錐 (角度受 transverseAcousticDeflectionDeg 調製) -->
                <g :transform="`rotate(${-state.transverseAcousticDeflectionDeg})`">
                  <line x1="0" y1="0" x2="60" y2="0" stroke="url(#deflectionGrad)" stroke-width="3.5" />
                  <polygon points="60,0 50,-5 50,5" fill="#10b981" />
                  <circle cx="60" cy="0" r="6" fill="#10b981" opacity="0.6">
                    <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>

                <!-- 偏轉角弧線 -->
                <path
                  d="M 25 0 A 25 25 0 0 0 25 -10"
                  fill="none"
                  stroke="#fbbf24"
                  stroke-width="1.5"
                  stroke-dasharray="2 2"
                />
              </g>

              <text x="82" y="165" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">
                偏轉角: {{ state.transverseAcousticDeflectionDeg }}°
              </text>
              <text x="82" y="182" fill="#94a3b8" font-size="9" text-anchor="middle">
                整流比: {{ state.acousticDiodeRectificationRatio }} : 1
              </text>
            </g>

            <!-- 底部狀態標籤 -->
            <g transform="translate(45, 275)">
              <rect x="0" y="0" width="450" height="20" rx="6" fill="#064e3b" />
              <text x="12" y="14" fill="#6ee7b7" font-size="10" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }} | 貝里曲率: {{ state.phononBerryCurvatureOmega }} × 10⁻²⁰ m² | κ_xy: {{ state.thermalAcousticHallKappaXy }} mW/(K·m)
              </text>
            </g>
          </svg>
        </div>

        <!-- 數據卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">聲子手性指標 (l_ph)</span>
            <span class="m-val highlight">{{ state.phononChiralityIndex > 0 ? '+1.0 ℏ (右旋)' : '-1.0 ℏ (左旋)' }}</span>
            <span class="m-sub">拓撲陳數 C_ph = {{ state.topologicalPhononChernNumber }}</span>
          </div>

          <div class="metric-card">
            <span class="m-label">反常聲偏轉角 (θ_H)</span>
            <span class="m-val accent">{{ state.transverseAcousticDeflectionDeg }}°</span>
            <span class="m-sub">零磁場純幾何偏轉</span>
          </div>

          <div class="metric-card">
            <span class="m-label">聲熱霍爾係數 (κ_xy)</span>
            <span class="m-val">{{ state.thermalAcousticHallKappaXy }}</span>
            <span class="m-sub">10⁻³ W/(K·m) 橫向熱流</span>
          </div>

          <div class="metric-card">
            <span class="m-label">聲二極體單向整流比</span>
            <span class="m-val highlight">{{ state.acousticDiodeRectificationRatio }}</span>
            <span class="m-sub">打破互易性單向導通</span>
          </div>

          <div class="metric-card">
            <span class="m-label">聲子貝里曲率 (Ω_ph)</span>
            <span class="m-val">{{ state.phononBerryCurvatureOmega }}</span>
            <span class="m-sub">× 10⁻²⁰ m² 動量幾何</span>
          </div>

          <div class="metric-card">
            <span class="m-label">聲頻共振 (f)</span>
            <span class="m-val">{{ state.acousticFrequencyTHz }} THz</span>
            <span class="m-sub">晶格溫度 {{ state.latticeTemperatureKelvin }} K</span>
          </div>
        </div>

        <!-- 控制滑桿與操作按鈕 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>聲學共振頻率 (0.5 ~ 15.0 THz): <b>{{ state.acousticFrequencyTHz }} THz</b></label>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                :value="state.acousticFrequencyTHz"
                @input="updateFreq(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="toggleHandedness">
              🔄 反轉聲子旋轉手性 (左旋 ↔ 右旋)
            </button>
            <button class="action-btn secondary" @click="pulseHeatFlux">
              🔥 注入聲熱流脈衝 (+Ω_ph)
            </button>
            <button class="action-btn tertiary" @click="coupleMagnon">
              🧲 耦合磁子非共線驅動 (極大化整流)
            </button>
            <button class="action-btn reset" @click="reset">
              🔄 復位預設
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.chiral-card {
  width: 820px;
  max-width: 95vw;
  max-height: 92vh;
  overflow-y: auto;
  background: #021a11;
  border: 1px solid #10b981;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.2);
  color: #e2e8f0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px solid #064e3b;
  padding-bottom: 14px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 28px;
}

h2 {
  margin: 0;
  font-size: 19px;
  color: #34d399;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f87171;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.chiral-svg {
  width: 100%;
  max-width: 720px;
  height: auto;
  border-radius: 12px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.metric-card {
  background: #04291c;
  border: 1px solid #065f46;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 18px;
  font-weight: bold;
  color: #f8fafc;
}

.m-val.highlight {
  color: #34d399;
}

.m-val.accent {
  color: #38bdf8;
}

.m-sub {
  font-size: 10px;
  color: #6ee7b7;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #04291c;
  border: 1px solid #065f46;
  border-radius: 12px;
  padding: 16px;
}

.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-row label {
  font-size: 12px;
  color: #cbd5e1;
}

.slider-row input[type="range"] {
  width: 100%;
  accent-color: #10b981;
}

.actions-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #10b981;
  color: #021a11;
}

.action-btn.primary:hover {
  background: #34d399;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.action-btn.secondary {
  background: #0284c7;
  color: #ffffff;
}

.action-btn.secondary:hover {
  background: #38bdf8;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
}

.action-btn.tertiary {
  background: #7c3aed;
  color: #ffffff;
}

.action-btn.tertiary:hover {
  background: #a78bfa;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
}

.action-btn.reset {
  background: #334155;
  color: #cbd5e1;
  margin-left: auto;
}

.action-btn.reset:hover {
  background: #475569;
}
</style>
