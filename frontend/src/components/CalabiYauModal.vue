<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { calabiYauModuliEngine, type CalabiYauRegime } from '../engine/calabiYauModuliStabilization';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => calabiYauModuliEngine.getState());

const isOpen = computed(() => uiStore.mode === 'calabi-yau-moduli');

const regimes: Array<{ id: CalabiYauRegime; label: string; desc: string }> = [
  { id: 'kklt-metastable-desitter-vacuum', label: 'KKLT 亞穩德西特真空相', desc: '抗 D3-膜翹曲喉管上推平衡 AdS 負能，形成微小正宇宙常數亞穩真空間' },
  { id: 'supersymmetric-anti-desitter-trough', label: '超對稱 AdS 深度通量陷阱相', desc: '上推強度不足或通量超勢主導，系統墜入超對稱負能量 AdS 谷底' },
  { id: 'cosmological-slow-roll-inflation', label: '宇宙慢滾暴脹平坦勢能相', desc: '模場在高原勢能慢滾 (ε << 1)，驅動指數膨脹並產生 CMB 原初擾動' },
  { id: 'decompactification-runaway-limit', label: '解緊緻化十維逃逸發散相', desc: '模場體積趨近無窮 (σ → ∞)，額外維度展開導致十維平坦時空解體' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateSigma(val: number) {
  const diff = val - state.value.kaehlerModulusSigma;
  calabiYauModuliEngine.driveSlowRollInflation(diff);
  achievements.unlock('calabi_yau_moduli_stabilization');
}

function updateUplift(val: number) {
  const diff = val - state.value.warpedUpliftTensionD;
  calabiYauModuliEngine.adjustWarpedUplift(diff);
  achievements.unlock('calabi_yau_moduli_stabilization');
}

function driveInflation() {
  calabiYauModuliEngine.driveSlowRollInflation(2.0);
  achievements.unlock('calabi_yau_moduli_stabilization');
}

function lockFlux() {
  calabiYauModuliEngine.lockFluxSuperpotential();
  achievements.unlock('calabi_yau_moduli_stabilization');
}

function preventRunaway() {
  calabiYauModuliEngine.preventDecompactificationRunaway();
  achievements.unlock('calabi_yau_moduli_stabilization');
}

function reset() {
  calabiYauModuliEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="cy-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🪐</span>
          <div>
            <h2>卡拉比-丘流形模場穩定性與暴脹發電機 (Calabi-Yau Moduli Engine)</h2>
            <span class="subtitle">CY₃ Compactification, GVW Flux Superpotential, KKLT de Sitter Vacuum & Slow-Roll Inflation</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 卡拉比-丘六維複幾何投影與 KKLT 勢能曲線 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="cy-svg">
            <defs>
              <linearGradient id="cyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#ec4899" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.9" />
              </linearGradient>
              <radialGradient id="modulusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fbbf24" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#d97706" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 反應堆腔體底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#f59e0b" stroke-width="1.6" />

            <!-- 左側：卡拉比-丘 6D 流形剖面幾何曲面輪廓 -->
            <g transform="translate(150, 150)">
              <!-- 幾何流形同心扭曲曲面 (以體積 sigma 縮放) -->
              <path
                d="M -70,-30 C -40,-80 40,-80 70,-30 C 100,20 60,80 0,70 C -60,80 -100,20 -70,-30 Z"
                fill="none"
                stroke="url(#cyGrad)"
                stroke-width="2.2"
                opacity="0.8"
              />
              <path
                d="M -50,-15 C -25,-60 25,-60 50,-15 C 75,25 40,65 0,55 C -40,65 -75,25 -50,-15 Z"
                fill="none"
                stroke="#ec4899"
                stroke-width="1.5"
                stroke-dasharray="4 2"
                opacity="0.7"
              />
              <path
                d="M -30,-5 C -15,-40 15,-40 30,-5 C 45,15 25,45 0,35 C -25,45 -45,15 -30,-5 Z"
                fill="none"
                stroke="#f59e0b"
                stroke-width="1.2"
                opacity="0.6"
              />

              <!-- 中心凱勒模場量子點 -->
              <circle cx="0" cy="0" :r="10 + (state.calabiYauVolumeNormalized / 5)" fill="url(#modulusGlow)">
                <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="4" text-anchor="middle" fill="#030712" font-size="10" font-weight="bold">
                σ={{ state.kaehlerModulusSigma }}
              </text>
            </g>

            <!-- 右側：KKLT 有效勢能曲線 V_eff(sigma) 與慢滾位置 -->
            <g transform="translate(300, 60)">
              <rect x="0" y="0" width="200" height="180" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1" />
              <text x="14" y="24" fill="#fbbf24" font-size="12" font-weight="bold">KKLT 有效勢能 V_eff(σ)</text>
              <line x1="14" y1="32" x2="186" y2="32" stroke="#334155" stroke-width="1" />

              <!-- V=0 零能基準線 (y=110) -->
              <line x1="20" y1="110" x2="180" y2="110" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
              <text x="160" y="105" fill="#64748b" font-size="9">V = 0</text>

              <!-- KKLT 雙阱勢能曲線：左側高阻擋，AdS谷，抗膜上推局域極小值，右側漸近趨於 0 -->
              <path
                d="M 25,40 C 35,160 50,150 70,95 C 90,65 120,105 180,108"
                fill="none"
                stroke="#f59e0b"
                stroke-width="2.5"
              />

              <!-- 當前模場狀態點在勢能曲線上的標記 -->
              <circle
                :cx="Math.min(175, Math.max(25, 25 + (state.kaehlerModulusSigma / 35) * 150))"
                :cy="Math.max(45, Math.min(160, 110 - state.effectiveVacuumEnergyEv * 2.8))"
                r="6"
                fill="#ec4899"
              />

              <text x="14" y="148" fill="#94a3b8" font-size="10">有效真空能 V_eff:</text>
              <text x="100" y="148" fill="#fbbf24" font-size="12" font-weight="bold">{{ state.effectiveVacuumEnergyEv }} e-120</text>

              <text x="14" y="168" fill="#94a3b8" font-size="10">張標比 r (CMB):</text>
              <text x="100" y="168" fill="#38bdf8" font-size="12" font-weight="bold">{{ state.tensorToScalarRatioR }}</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 35)">
              <rect x="0" y="0" width="230" height="30" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
              <text x="12" y="19" fill="#fbbf24" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">有效真空能 (V_eff)</span>
            <span class="m-val highlight">{{ state.effectiveVacuumEnergyEv }} ×10⁻¹²⁰</span>
            <span class="m-sub">亞穩德西特正微小能量</span>
          </div>

          <div class="metric-card">
            <span class="m-label">凱勒體積模場 (σ)</span>
            <span class="m-val accent">{{ state.kaehlerModulusSigma }}</span>
            <span class="m-sub">Re(T) 緊緻化流形體積</span>
          </div>

          <div class="metric-card">
            <span class="m-label">慢滾參數 (ε)</span>
            <span class="m-val">{{ state.slowRollEpsilon }}</span>
            <span class="m-sub">CMB 暴脹高原平坦度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">張標比 (r)</span>
            <span class="m-val">{{ state.tensorToScalarRatioR }}</span>
            <span class="m-sub">原初引力波觀測界限</span>
          </div>

          <div class="metric-card">
            <span class="m-label">標度譜指數 (n_s)</span>
            <span class="m-val">{{ state.spectralIndexNs }}</span>
            <span class="m-sub">CMB 普朗克觀測對齊</span>
          </div>

          <div class="metric-card">
            <span class="m-label">CY₃ 幾何體積</span>
            <span class="m-val">{{ state.calabiYauVolumeNormalized }}</span>
            <span class="m-sub">V ∝ σ³/² 歸一化體積</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>凱勒模場實部 σ (2.0 ~ 35.0): <b>{{ state.kaehlerModulusSigma }}</b></label>
              <input
                type="range"
                min="2.0"
                max="35.0"
                step="0.5"
                :value="state.kaehlerModulusSigma"
                @input="updateSigma(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>翹曲喉抗膜上推強度 D (0.0 ~ 5.0): <b>{{ state.warpedUpliftTensionD }}</b></label>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                :value="state.warpedUpliftTensionD"
                @input="updateUplift(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="driveInflation">
              🪐 推進模場慢滾暴脹 (+2.0)
            </button>
            <button class="action-btn gold" @click="lockFlux">
              🔒 鎖定 GVW 通量超勢 W₀
            </button>
            <button class="action-btn secondary" @click="preventRunaway">
              🛡️ 抑制十維解緊緻化逃逸
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
  background: rgba(3, 7, 18, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cy-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.25);
  border-radius: 16px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title-group .icon {
  font-size: 32px;
}

h2 {
  font-size: 19px;
  font-weight: 700;
  color: #fbbf24;
  margin: 0;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #f87171;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cy-svg {
  width: 100%;
  max-height: 250px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
  margin: 3px 0;
}

.m-val.highlight {
  color: #fbbf24;
}

.m-val.accent {
  color: #f59e0b;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
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
  accent-color: #f59e0b;
  height: 6px;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: #d97706;
  color: #fff;
}
.action-btn.primary:hover {
  background: #b45309;
}

.action-btn.gold {
  background: #b45309;
  color: #fff;
}
.action-btn.gold:hover {
  background: #92400e;
}

.action-btn.secondary {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(245, 158, 11, 0.25);
}

.action-btn.reset {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
  margin-left: auto;
}
.action-btn.reset:hover {
  background: rgba(148, 163, 184, 0.25);
  color: #fff;
}
</style>
