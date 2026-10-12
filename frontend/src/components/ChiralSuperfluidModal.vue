<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { chiralSuperfluidEngine, type ChiralSuperfluidRegime } from '../engine/chiralSuperfluidPWave';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => chiralSuperfluidEngine.getState());

const isOpen = computed(() => uiStore.mode === 'chiral-superfluid');

const regimes: Array<{ id: ChiralSuperfluidRegime; label: string; desc: string }> = [
  { id: 'weak-pairing-topological', label: '弱配對拓撲超流', desc: 'BCS 體制 (C=1, 手性無耗散邊界超流)' },
  { id: 'half-quantum-vortex-lattice', label: '半量子化渦旋晶格', desc: '阿布里科索夫渦旋核束縛馬約拉納態' },
  { id: 'strong-pairing-bec-crossover', label: '強配對 BEC 跨接', desc: '分子玻色凝聚體平庸相 (C=0)' },
  { id: 'spontaneous-edge-current', label: '自發手性巨流態', desc: '表面時間反演破缺無阻超流傳輸' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateGap(val: number) {
  chiralSuperfluidEngine.setParameters({ pairingGapDeltaMev: val });
}

function updateMu(val: number) {
  chiralSuperfluidEngine.setParameters({ chemicalPotentialMuMev: val });
}

function updateVortexCount(val: number) {
  chiralSuperfluidEngine.setParameters({ vortexDensityCount: val });
}

function updateTemp(val: number) {
  chiralSuperfluidEngine.setParameters({ temperatureKelvin: val });
}

function updateRotation(val: number) {
  chiralSuperfluidEngine.setParameters({ rotationalVelocityRads: val });
}

function selectRegime(regime: ChiralSuperfluidRegime) {
  chiralSuperfluidEngine.setParameters({ regime });
  achievements.unlock('chiral_pwave_superfluid');
}

function injectBraiding() {
  chiralSuperfluidEngine.injectMajoranaBraidingStep();
  achievements.unlock('chiral_pwave_superfluid');
}

function togglePhase() {
  chiralSuperfluidEngine.togglePairingPhase();
  achievements.unlock('chiral_pwave_superfluid');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="csf-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌊</span>
          <div>
            <h2>拓撲手性超流體反應堆 (p_x + i p_y Superfluid)</h2>
            <span class="subtitle">Chiral Cooper-Pair Majorana Vortex Lattice & Edge Supercurrent</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 手性超流渦旋晶格與邊緣流動圖 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="csf-svg">
            <defs>
              <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
                <stop offset="60%" stop-color="#0284c7" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#082f49" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="chiralRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="50%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>

            <!-- 反應腔室背景底網 -->
            <rect x="25" y="20" width="490" height="280" rx="20" fill="#030c17" stroke="#1e3a5f" stroke-width="2" />
            <circle cx="270" cy="160" r="125" fill="url(#vortexGlow)" />

            <!-- 同心旋轉等相位線圈 -->
            <circle cx="270" cy="160" r="105" fill="none" stroke="#0ea5e9" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="0 270 160" to="360 270 160" dur="18s" repeatCount="indefinite" />
            </circle>
            <circle cx="270" cy="160" r="75" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="360 270 160" to="0 270 160" dur="12s" repeatCount="indefinite" />
            </circle>

            <!-- 阿布里科索夫半量子化渦旋點陣 (HQV) -->
            <g>
              <template v-for="idx in Math.min(24, state.vortexDensityCount)" :key="'vortex-' + idx">
                <!-- 分佈在同心環上 -->
                <g :transform="`translate(${270 + Math.cos((idx * 2 * Math.PI) / Math.min(24, state.vortexDensityCount)) * (idx % 2 === 0 ? 50 : 85)}, ${160 + Math.sin((idx * 2 * Math.PI) / Math.min(24, state.vortexDensityCount)) * (idx % 2 === 0 ? 50 : 85)})`">
                  <circle r="7" fill="#ef4444" opacity="0.3" />
                  <circle r="4" fill="#38bdf8" />
                  <circle r="2" fill="#ffffff" />
                  <!-- 旋渦切向手性微箭頭 -->
                  <path d="M -3 -6 A 7 7 0 0 1 6 -3" fill="none" stroke="#22d3ee" stroke-width="1.2" />
                </g>
              </template>
            </g>

            <!-- 外圍手性無耗散邊界超電流軌道 (Chiral Edge Current) -->
            <circle
              cx="270"
              cy="160"
              r="125"
              fill="none"
              stroke="url(#chiralRingGrad)"
              stroke-width="4"
              stroke-dasharray="16 10"
            >
              <animate attributeName="stroke-dashoffset" values="0;-120" dur="2.5s" repeatCount="indefinite" />
            </circle>

            <!-- 標註資訊 -->
            <text x="50" y="55" fill="#38bdf8" font-size="12" font-weight="bold">手性 p+ip 邊界超流 (L_z = +ħ)</text>
            <text x="50" y="75" fill="#94a3b8" font-size="10">
              陳數 C = {{ state.chernNumber }} | 馬約拉納零能模: {{ state.majoranaZeroModesCount }} 顆
            </text>
            <text x="490" y="280" fill="#a855f7" font-size="11" text-anchor="end">
              邊界超流: {{ state.edgeSupercurrentMicroAmp.toFixed(1) }} μA | 凝聚度: {{ (state.condensateDensity * 100).toFixed(1) }}%
            </text>
          </svg>
        </div>

        <!-- 4 大相態選擇按鈕 -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            class="regime-btn"
            :class="{ active: state.regime === r.id }"
            @click="selectRegime(r.id)"
          >
            <span class="regime-name">{{ r.label }}</span>
            <span class="regime-desc">{{ r.desc }}</span>
          </button>
        </div>

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">拓撲陳數 C</span>
            <span class="m-val text-cyan">{{ state.chernNumber }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">馬約拉納零能模</span>
            <span class="m-val text-purple">{{ state.majoranaZeroModesCount }} 模</span>
          </div>
          <div class="metric-item">
            <span class="m-label">配對能隙 Δ_0</span>
            <span class="m-val text-emerald">{{ state.pairingGapDeltaMev.toFixed(2) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">自發角動量 L_z</span>
            <span class="m-val">{{ state.spontaneousAngularMomentumHbar.toFixed(1) }} ħ</span>
          </div>
          <div class="metric-item">
            <span class="m-label">無耗散邊界超流</span>
            <span class="m-val text-cyan">{{ state.edgeSupercurrentMicroAmp.toFixed(1) }} μA</span>
          </div>
          <div class="metric-item">
            <span class="m-label">拓撲糾纏熵 γ</span>
            <span class="m-val">{{ state.topologicalEntropyKatsura.toFixed(3) }}</span>
          </div>
        </div>

        <!-- 參數滑桿控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>超流配對能隙 (Δ_0)</span>
              <span class="val">{{ state.pairingGapDeltaMev.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="12.0"
              step="0.1"
              :value="state.pairingGapDeltaMev"
              @input="updateGap(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>化學勢 (μ, >0 拓撲相, <0 平庸相)</span>
              <span class="val">{{ state.chemicalPotentialMuMev.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="15.0"
              step="0.2"
              :value="state.chemicalPotentialMuMev"
              @input="updateMu(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>半量子化渦旋數量 (Vortices)</span>
              <span class="val">{{ state.vortexDensityCount }} 個</span>
            </div>
            <input
              type="range"
              min="1"
              max="64"
              step="1"
              :value="state.vortexDensityCount"
              @input="updateVortexCount(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>旋轉角速度 (Ω)</span>
              <span class="val">{{ state.rotationalVelocityRads.toFixed(1) }} rad/s</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="25.0"
              step="0.5"
              :value="state.rotationalVelocityRads"
              @input="updateRotation(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>操作溫度 (T)</span>
              <span class="val">{{ state.temperatureKelvin.toFixed(3) }} K</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="5.0"
              step="0.05"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="injectBraiding">
            🌀 激發馬約拉納非阿貝爾任意子編織步進
          </button>
          <button class="action-btn secondary" @click="togglePhase">
            🔄 切換 BCS 拓撲 ⇄ BEC 平庸相態
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.csf-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(8, 20, 36, 0.95), rgba(4, 12, 24, 0.98));
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 28px;
}

.title-group h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.content-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.csf-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.4);
}

.regime-btn.active {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-emerald { color: #34d399; }

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.slider-header .val {
  font-weight: 700;
  color: #38bdf8;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(90deg, #0284c7, #2563eb);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #0369a1, #1d4ed8);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

.action-btn.secondary:hover {
  background: rgba(56, 189, 248, 0.15);
}
</style>
