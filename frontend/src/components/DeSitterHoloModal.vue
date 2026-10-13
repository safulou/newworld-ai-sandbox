<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { deSitterHoloEngine, type DeSitterRegime } from '../engine/deSitterHoloStaticPatch';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => deSitterHoloEngine.getState());

const isOpen = computed(() => uiStore.mode === 'desitter-holo');

const regimes: Array<{ id: DeSitterRegime; label: string; desc: string }> = [
  { id: 'gibbons-hawking-thermal-equilibrium', label: '吉本斯-霍金視界熱平衡態', desc: '膨脹視界散發微觀 T_GH 輻射與極端視界熵' },
  { id: 'witten-type-ii1-maximal-entropy', label: 'Type II_1 馮諾依曼全息最大熵態', desc: '德西特緊緻空間無無窮遠邊界，態空間存在唯一最大混態' },
  { id: 'desitter-page-entanglement-transition', label: '德西特佩奇島嶼糾纏轉折態', desc: '量子極值面 (QES) 跨越視界形成島嶼，修復全息資訊' },
  { id: 'coleman-deluccia-bubble-nucleation', label: '真空泡泡量子穿隧核化態', desc: '真假真空穿隧衰變，幾率遵循 e^(-B_CDL)' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateLambda(val: number) {
  deSitterHoloEngine.modulateCosmologicalConstant(val - state.value.cosmologicalConstantLambda);
  achievements.unlock('desitter_holo_static_patch');
}

function updateMass(val: number) {
  deSitterHoloEngine.injectStaticPatchMass(val - state.value.staticPatchBlackHoleMassSolar);
  achievements.unlock('desitter_holo_static_patch');
}

function triggerBubble() {
  deSitterHoloEngine.triggerBubbleNucleation();
  achievements.unlock('desitter_holo_static_patch');
}

function sampleMicrostates() {
  deSitterHoloEngine.sampleHorizonMicrostates();
  achievements.unlock('desitter_holo_static_patch');
}

function reset() {
  deSitterHoloEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="desitter-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>德西特宇宙全息對偶與靜態膜極端熵 (de Sitter Static Patch Holography)</h2>
            <span class="subtitle">Cosmological Horizon, Gibbons-Hawking Entropy, Type II_1 von Neumann Algebra & dS Page Curve</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 德西特靜態膜因果鑽石、吉本斯-霍金視界與全息島嶼 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="desitter-svg">
            <defs>
              <radialGradient id="horizonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stop-color="#020617" stop-opacity="0.0" />
                <stop offset="92%" stop-color="#38bdf8" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0.9" />
              </radialGradient>
              <radialGradient id="observerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fbbf24" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 視界底板背景 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#030712" stroke="#a855f7" stroke-width="1.8" />

            <!-- 左側：德西特靜態膜全息投影盤面 (中心為觀測者世界線，外圍為宇宙視界) -->
            <g transform="translate(160, 160)">
              <!-- 靜態膜內部時空背景 -->
              <circle cx="0" cy="0" r="95" fill="#0a0f1d" stroke="#1e293b" stroke-width="1.2" />

              <!-- 吉本斯-霍金宇宙學視界發光層 (半徑隨 l_dS 動態伸縮) -->
              <circle
                cx="0"
                cy="0"
                :r="Math.min(105, 45 + state.horizonRadiusLdsGigaLy * 2.8)"
                fill="url(#horizonGlow)"
                stroke="#38bdf8"
                stroke-width="2"
                stroke-dasharray="6 3"
              >
                <animate attributeName="opacity" values="0.75;1;0.75" dur="4s" repeatCount="indefinite" />
              </circle>

              <!-- 泡泡穿隧核化光圈 (當處於泡泡核化態時) -->
              <circle
                v-if="state.regime === 'coleman-deluccia-bubble-nucleation'"
                cx="30"
                cy="-25"
                r="35"
                fill="none"
                stroke="#ec4899"
                stroke-width="2.5"
                stroke-dasharray="4 2"
              >
                <animate attributeName="r" values="10;45" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite" />
              </circle>

              <!-- 量子島嶼 (Quantum Island QES) 糾纏光弧 -->
              <g v-if="state.pageEntanglementIslandRatio > 0.4">
                <circle
                  cx="0"
                  cy="0"
                  :r="70"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="1.8"
                  stroke-dasharray="8 4"
                  opacity="0.8"
                >
                  <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="30s" repeatCount="indefinite" />
                </circle>
              </g>

              <!-- 內部微型黑洞 (若質量 > 0) -->
              <g v-if="state.staticPatchBlackHoleMassSolar > 0">
                <circle
                  cx="25"
                  cy="20"
                  :r="Math.min(18, 5 + state.staticPatchBlackHoleMassSolar * 0.35)"
                  fill="#000000"
                  stroke="#f43f5e"
                  stroke-width="2"
                />
                <text x="25" y="24" fill="#f43f5e" font-size="8" font-weight="bold" text-anchor="middle">M_bh</text>
              </g>

              <!-- 觀測者世界線中心光斑 -->
              <circle cx="0" cy="0" r="14" fill="url(#observerGlow)" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
              <text x="0" y="-18" fill="#fbbf24" font-size="9" font-weight="bold" text-anchor="middle">觀測者世界線</text>
            </g>

            <!-- 右側：Type II_1 馮諾依曼最大熵與佩奇島嶼能譜圖 -->
            <g transform="translate(330, 60)">
              <rect x="0" y="0" width="165" height="200" rx="12" fill="#0f172a" stroke="#1e293b" />
              <text x="12" y="22" fill="#e2e8f0" font-size="11" font-weight="bold">Type II_1 代數與島嶼熵</text>

              <!-- 視界熵長條 -->
              <text x="12" y="50" fill="#94a3b8" font-size="9">吉本斯-霍金視界熵 S_GH</text>
              <rect x="12" y="56" width="140" height="12" rx="4" fill="#1e293b" />
              <rect
                x="12"
                y="56"
                :width="Math.min(140, state.gibbonsHawkingEntropyS120 * 5.5)"
                height="12"
                rx="4"
                fill="#a855f7"
              />

              <!-- Type II_1 代數最大混態指標 -->
              <text x="12" y="90" fill="#94a3b8" font-size="9">Type II_1 最大混態度</text>
              <rect x="12" y="96" width="140" height="12" rx="4" fill="#1e293b" />
              <rect
                x="12"
                y="96"
                :width="state.vonNeumannMaximalEntropyRank * 140"
                height="12"
                rx="4"
                fill="#38bdf8"
              />

              <!-- 佩奇島嶼 QES 覆蓋度 -->
              <text x="12" y="130" fill="#94a3b8" font-size="9">佩奇量子島嶼轉折度</text>
              <rect x="12" y="136" width="140" height="12" rx="4" fill="#1e293b" />
              <rect
                x="12"
                y="136"
                :width="state.pageEntanglementIslandRatio * 140"
                height="12"
                rx="4"
                fill="#10b981"
              />

              <!-- 視界溫度顯示 -->
              <text x="12" y="176" fill="#fbbf24" font-size="10" font-weight="bold">
                T_GH: {{ state.gibbonsHawkingTempKelvin }} × 10⁻³⁰ K
              </text>
              <text x="12" y="192" fill="#94a3b8" font-size="9">
                視界半徑 l_dS: {{ state.horizonRadiusLdsGigaLy }} Gly
              </text>
            </g>

            <!-- 底部標籤 -->
            <g transform="translate(45, 275)">
              <rect x="0" y="0" width="450" height="20" rx="6" fill="#0f172a" />
              <text x="12" y="14" fill="#a855f7" font-size="10" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }} | 哈伯常數: {{ state.hubbleExpansionRateH }} km/s/Mpc | 熵階: {{ state.gibbonsHawkingEntropyS120 }} × 10¹²⁰ k_B
              </text>
            </g>
          </svg>
        </div>

        <!-- 數據卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">宇宙學常數 (Λ)</span>
            <span class="m-val highlight">{{ state.cosmologicalConstantLambda }}</span>
            <span class="m-sub">10⁻⁵² m⁻² 歸一化</span>
          </div>

          <div class="metric-card">
            <span class="m-label">宇宙視界半徑 (l_dS)</span>
            <span class="m-val">{{ state.horizonRadiusLdsGigaLy }} Gly</span>
            <span class="m-sub">十億光年因果邊界</span>
          </div>

          <div class="metric-card">
            <span class="m-label">吉本斯-霍金視界熵</span>
            <span class="m-val accent">{{ state.gibbonsHawkingEntropyS120 }}</span>
            <span class="m-sub">× 10¹²⁰ k_B 極端界限</span>
          </div>

          <div class="metric-card">
            <span class="m-label">視界熱溫度 (T_GH)</span>
            <span class="m-val">{{ state.gibbonsHawkingTempKelvin }} × 10⁻³⁰ K</span>
            <span class="m-sub">加速膨脹量子熱浴</span>
          </div>

          <div class="metric-card">
            <span class="m-label">靜態膜內部黑洞 (M_bh)</span>
            <span class="m-val highlight">{{ state.staticPatchBlackHoleMassSolar }} M☉</span>
            <span class="m-sub">Nariai 極限引力質量</span>
          </div>

          <div class="metric-card">
            <span class="m-label">Type II_1 態混雜度</span>
            <span class="m-val">{{ (state.vonNeumannMaximalEntropyRank * 100).toFixed(1) }}%</span>
            <span class="m-sub">馮諾依曼跡歸一態</span>
          </div>
        </div>

        <!-- 滑桿與控制按鈕 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>宇宙學常數 Λ (0.2 ~ 8.0): <b>{{ state.cosmologicalConstantLambda }}</b></label>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                :value="state.cosmologicalConstantLambda"
                @input="updateLambda(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>靜態膜微黑洞質量 (0.0 ~ 40.0 M☉): <b>{{ state.staticPatchBlackHoleMassSolar }} M☉</b></label>
              <input
                type="range"
                min="0.0"
                max="40.0"
                step="1.0"
                :value="state.staticPatchBlackHoleMassSolar"
                @input="updateMass(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="sampleMicrostates">
              🔮 採樣視界微觀態 (Type II_1 飽和)
            </button>
            <button class="action-btn secondary" @click="triggerBubble">
              🫧 觸發 Coleman-De Luccia 泡泡核化
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

.desitter-card {
  width: 820px;
  max-width: 95vw;
  max-height: 92vh;
  overflow-y: auto;
  background: #080614;
  border: 1px solid #a855f7;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(168, 85, 247, 0.2);
  color: #e2e8f0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px solid #1e293b;
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
  color: #c084fc;
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

.desitter-svg {
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
  background: #110c22;
  border: 1px solid #231942;
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
  color: #c084fc;
}

.m-val.accent {
  color: #38bdf8;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #110c22;
  border: 1px solid #231942;
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
  accent-color: #a855f7;
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
  background: #a855f7;
  color: #ffffff;
}

.action-btn.primary:hover {
  background: #c084fc;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
}

.action-btn.secondary {
  background: #ec4899;
  color: #ffffff;
}

.action-btn.secondary:hover {
  background: #f472b6;
  box-shadow: 0 0 12px rgba(236, 72, 153, 0.4);
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
