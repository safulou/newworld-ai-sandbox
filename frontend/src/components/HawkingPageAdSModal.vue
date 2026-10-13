<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { hawkingPageAdSEngine, type HawkingPageRegime } from '../engine/hawkingPageAdSPhaseTransition';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => hawkingPageAdSEngine.getState());

const isOpen = computed(() => uiStore.mode === 'hawking-page-ads');

const regimes: Array<{ id: HawkingPageRegime; label: string; desc: string }> = [
  { id: 'thermal-ads-confined-gas', label: '熱 AdS 幾何顏色禁閉相', desc: '低溫 T < T_HP 下純引力輻射氣體佔優，對偶於 N=4 規範場論顏色禁閉相 (O(1) 自由度)' },
  { id: 'large-bh-deconfined-plasma', label: '大黑洞解禁閉等離子相', desc: '高溫 T > T_HP 下史瓦西-AdS 大黑洞穩定存在，對偶於強耦合夸克-膠子等離子體 (O(N²) 自由度)' },
  { id: 'metastable-coexistence-threshold', label: '臨界霍金-佩奇雙穩態相變點', desc: '邊界溫度精確對齊 T_HP = 3/(2πL)，自由能反轉 ΔF = 0，引力一階相變潛熱釋放' },
  { id: 'small-bh-evaporation-runaway', label: '負比熱小黑洞霍金蒸發態', desc: '半徑小於臨界尺度的負比熱小黑洞，因霍金熱輻射不穩定而蒸發或坍縮' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemp(val: number) {
  const diff = val - state.value.boundaryTemperatureT;
  hawkingPageAdSEngine.heatBoundaryCFT(diff);
  achievements.unlock('hawking_page_ads_phase_transition');
}

function updateRadius(val: number) {
  const diff = val - state.value.adsRadiusL;
  hawkingPageAdSEngine.tuneAdSCurvatureRadius(diff);
  achievements.unlock('hawking_page_ads_phase_transition');
}

function heatCFT() {
  hawkingPageAdSEngine.heatBoundaryCFT(0.2);
  achievements.unlock('hawking_page_ads_phase_transition');
}

function coolGas() {
  hawkingPageAdSEngine.coolToThermalAdS();
  achievements.unlock('hawking_page_ads_phase_transition');
}

function triggerTransition() {
  hawkingPageAdSEngine.triggerHawkingPageTransition();
  achievements.unlock('hawking_page_ads_phase_transition');
}

function reset() {
  hawkingPageAdSEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="hp-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🕳️</span>
          <div>
            <h2>霍金-佩奇黑洞相變與全息引力凝聚 (Hawking-Page AdS Transition)</h2>
            <span class="subtitle">Thermal AdS Gas vs Large Black Hole, Confinement-Deconfinement & Polyakov Loop</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 全息雙曲圓盤幾何與黑洞視界 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="hp-svg">
            <defs>
              <radialGradient id="bhGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#020617" stop-opacity="1.0" />
                <stop offset="70%" stop-color="#7c3aed" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0.0" />
              </radialGradient>
              <radialGradient id="plasmaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8" />
                <stop offset="80%" stop-color="#ef4444" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="freeEnergyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="50%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#ef4444" />
              </linearGradient>
            </defs>

            <!-- 深空雙曲背景板 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#7c3aed" stroke-width="1.6" />

            <!-- 左側：AdS 彭加萊圓盤幾何與黑洞視界 -->
            <g transform="translate(150, 150)">
              <!-- AdS 邊界環 -->
              <circle cx="0" cy="0" r="90" fill="none" stroke="#6366f1" stroke-width="2.5" />
              <!-- 雙曲測地線網絡環 -->
              <circle cx="0" cy="0" r="70" fill="none" stroke="#4338ca" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.6" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="#3730a3" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.4" />

              <!-- 解禁閉等離子光暈 (以 polyakovLoopExpectation 縮放) -->
              <circle cx="0" cy="0" :r="20 + state.polyakovLoopExpectation * 65" fill="url(#plasmaGlow)">
                <animate attributeName="opacity" values="0.7;0.95;0.7" dur="2s" repeatCount="indefinite" />
              </circle>

              <!-- 黑洞事件視界 (以 horizonRadiusRPlus 縮放) -->
              <circle
                v-if="state.horizonRadiusRPlus > 0.1 && state.regime !== 'thermal-ads-confined-gas'"
                cx="0"
                cy="0"
                :r="Math.min(85, state.horizonRadiusRPlus * 8.5)"
                fill="url(#bhGlow)"
              >
                <animate attributeName="r" values="32;36;32" dur="3s" repeatCount="indefinite" />
              </circle>

              <!-- 熱 AdS 粒子氣體粒子 (當處於禁閉態時) -->
              <g v-if="state.regime === 'thermal-ads-confined-gas'" opacity="0.85">
                <circle
                  v-for="(pos, idx) in [
                    [-30, -20], [25, -35], [-15, 30], [35, 20], [0, -10],
                    [-45, 15], [15, -15], [-20, -45], [40, -10], [-35, 40]
                  ]"
                  :key="idx"
                  :cx="pos[0]"
                  :cy="pos[1]"
                  r="3.5"
                  fill="#38bdf8"
                >
                  <animate attributeName="opacity" values="0.3;1.0;0.3" :dur="`${1.5 + (idx % 3) * 0.5}s`" repeatCount="indefinite" />
                </circle>
              </g>

              <!-- 中心視界半徑標註 -->
              <text x="0" y="4" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="bold">
                {{ state.regime === 'thermal-ads-confined-gas' ? '熱 AdS 氣' : `r₊ = ${state.horizonRadiusRPlus}` }}
              </text>
            </g>

            <!-- 右側：吉布斯自由能差 ΔF(T) 與波利亞科夫圈序參量 -->
            <g transform="translate(300, 60)">
              <rect x="0" y="0" width="200" height="180" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#7c3aed" stroke-width="1" />
              <text x="14" y="24" fill="#a78bfa" font-size="12" font-weight="bold">自由能差 ΔF = F_BH - F_AdS</text>
              <line x1="14" y1="32" x2="186" y2="32" stroke="#334155" stroke-width="1" />

              <!-- ΔF = 0 零基準線 (y=105) -->
              <line x1="20" y1="105" x2="180" y2="105" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
              <text x="155" y="100" fill="#64748b" font-size="9">ΔF = 0</text>

              <!-- 自由能曲線 (高溫負，低溫正) -->
              <path
                d="M 25,65 C 60,75 100,105 175,155"
                fill="none"
                stroke="url(#freeEnergyGrad)"
                stroke-width="2.5"
              />

              <!-- 當前工作點標記 -->
              <circle
                :cx="Math.min(175, Math.max(25, 25 + (state.boundaryTemperatureT / 3.5) * 150))"
                :cy="Math.max(45, Math.min(160, 105 - state.freeEnergyDifferenceDeltaF * 1.8))"
                r="6"
                fill="#fbbf24"
              />

              <text x="14" y="148" fill="#94a3b8" font-size="10">自由能差 ΔF:</text>
              <text x="90" y="148" fill="#38bdf8" font-size="12" font-weight="bold">{{ state.freeEnergyDifferenceDeltaF }}</text>

              <text x="14" y="168" fill="#94a3b8" font-size="10">波利亞科夫 ⟨L⟩:</text>
              <text x="90" y="168" fill="#f59e0b" font-size="12" font-weight="bold">{{ state.polyakovLoopExpectation }}</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 35)">
              <rect x="0" y="0" width="230" height="30" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#7c3aed" stroke-width="1" />
              <text x="12" y="19" fill="#a78bfa" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">邊界溫度 (T)</span>
            <span class="m-val highlight">{{ state.boundaryTemperatureT }}</span>
            <span class="m-sub">T_HP = {{ state.hawkingPageTempThp }}</span>
          </div>

          <div class="metric-card">
            <span class="m-label">自由能差 (ΔF)</span>
            <span class="m-val accent">{{ state.freeEnergyDifferenceDeltaF }}</span>
            <span class="m-sub">負值代表大黑洞相佔優</span>
          </div>

          <div class="metric-card">
            <span class="m-label">視界貝肯斯坦熵 (S)</span>
            <span class="m-val">{{ state.blackHoleHorizonEntropyS }} ×10⁴ k_B</span>
            <span class="m-sub">O(N²) 巨微觀態熵</span>
          </div>

          <div class="metric-card">
            <span class="m-label">波利亞科夫圈 ⟨L⟩</span>
            <span class="m-val">{{ state.polyakovLoopExpectation }}</span>
            <span class="m-sub">全息解禁閉序參量</span>
          </div>

          <div class="metric-card">
            <span class="m-label">AdS 曲率半徑 (L)</span>
            <span class="m-val">{{ state.adsRadiusL }}</span>
            <span class="m-sub">反德西特幾何尺度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">大黑洞比熱 (C_V)</span>
            <span class="m-val">{{ state.specificHeatCv }}</span>
            <span class="m-sub">正比熱熱力學穩定態</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>邊界溫度 T (0.05 ~ 3.50): <b>{{ state.boundaryTemperatureT }}</b> (臨界 T_HP = {{ state.hawkingPageTempThp }})</label>
              <input
                type="range"
                min="0.05"
                max="3.50"
                step="0.05"
                :value="state.boundaryTemperatureT"
                @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>AdS 曲率半徑 L (1.0 ~ 15.0): <b>{{ state.adsRadiusL }}</b></label>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                :value="state.adsRadiusL"
                @input="updateRadius(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="heatCFT">
              🔥 加熱邊界 CFT (+0.2)
            </button>
            <button class="action-btn purple" @click="triggerTransition">
              ⚖️ 觸發霍金-佩奇相變點
            </button>
            <button class="action-btn secondary" @click="coolGas">
              ❄️ 冷卻至熱 AdS 禁閉氣體
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

.hp-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(124, 58, 237, 0.35);
  box-shadow: 0 0 35px rgba(124, 58, 237, 0.25);
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
  color: #a78bfa;
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

.hp-svg {
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
  border: 1px solid rgba(124, 58, 237, 0.2);
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
  color: #a78bfa;
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
  accent-color: #7c3aed;
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
  background: #ea580c;
  color: #fff;
}
.action-btn.primary:hover {
  background: #c2410c;
}

.action-btn.purple {
  background: #7c3aed;
  color: #fff;
}
.action-btn.purple:hover {
  background: #6d28d9;
}

.action-btn.secondary {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(56, 189, 248, 0.25);
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
