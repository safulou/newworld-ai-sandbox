<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicComplexityActionEngine, type HolographicComplexityRegime } from '../engine/holographicComplexityAction';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => holographicComplexityActionEngine.getState());

const isOpen = computed(() => uiStore.mode === 'holo-complexity');

const regimes: Array<{ id: HolographicComplexityRegime; label: string; desc: string }> = [
  { id: 'action-wdw-lloyd-bound', label: 'CA 勞埃德極限相', desc: 'WDW 作用量飽和 2M/(πℏ) 線性增長' },
  { id: 'volume-maximal-slice', label: 'CV 極大體積相', desc: '極大類空超曲面幾何體積膨脹' },
  { id: 'late-time-saturation', label: '極晚期飽和態', desc: '量子態空間指數量子混沌高原' },
  { id: 'scrambling-switchback-shock', label: '震波折返相', desc: '引力減震波破壞微觀相干延遲' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateMass(val: number) {
  holographicComplexityActionEngine.setParameters({ blackHoleMassSolar: val });
}

function updateAdsRadius(val: number) {
  holographicComplexityActionEngine.setParameters({ adsCurvatureRadius: val });
}

function updateTime(val: number) {
  holographicComplexityActionEngine.setParameters({ evolutionTimeGyr: val });
}

function updateQubits(val: number) {
  holographicComplexityActionEngine.setParameters({ boundaryQubitCount: val });
}

function selectRegime(regime: HolographicComplexityRegime) {
  holographicComplexityActionEngine.setParameters({ regime });
  achievements.unlock('holographic_complexity_action');
}

function triggerShockwave() {
  holographicComplexityActionEngine.injectShockwavePerturbation();
  achievements.unlock('holographic_complexity_action');
}

function stepTime() {
  holographicComplexityActionEngine.stepEvolutionTime(3.0);
  achievements.unlock('holographic_complexity_action');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="complexity-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <h2>全息複雜度作用量引擎 (Holographic Complexity Engine)</h2>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 潘洛斯時空圖、WDW 斑塊菱形與勞埃德極限增長 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="complexity-svg">
            <defs>
              <linearGradient id="wdwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
                <stop offset="50%" stop-color="#047857" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#064e3b" stop-opacity="0.25" />
              </linearGradient>
              <linearGradient id="singularityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="50%" stop-color="#f87171" />
                <stop offset="100%" stop-color="#ef4444" />
              </linearGradient>
            </defs>

            <!-- 視圖背景 -->
            <rect x="25" y="20" width="490" height="280" rx="14" fill="#030712" stroke="#1f2937" stroke-width="2" />

            <!-- 潘洛斯圖框架 (Penrose Diagram) -->
            <!-- 左右邊界 (CFT_L, CFT_R) -->
            <line x1="80" y1="50" x2="80" y2="270" stroke="#38bdf8" stroke-width="3" />
            <line x1="460" y1="50" x2="460" y2="270" stroke="#38bdf8" stroke-width="3" />
            <text x="80" y="42" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">CFT_L 邊界</text>
            <text x="460" y="42" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">CFT_R 邊界</text>

            <!-- 頂部類空奇點 (Black Hole Singularity) -->
            <line x1="80" y1="50" x2="460" y2="50" stroke="url(#singularityGrad)" stroke-width="4" stroke-dasharray="6 4" />
            <text x="270" y="42" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">未來引力奇點 r = 0</text>

            <!-- 事件視界光錐交叉線 (Event Horizons) -->
            <line x1="80" y1="270" x2="270" y2="50" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 4" />
            <line x1="460" y1="270" x2="270" y2="50" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 4" />

            <!-- WDW 斑塊 (Wheeler-DeWitt Patch) 幾何內部體積 -->
            <!-- 隨時間推進在黑洞內部延伸 -->
            <polygon
              points="270,160 380,105 270,50 160,105"
              fill="url(#wdwGrad)"
              stroke="#10b981"
              stroke-width="2"
            />
            <text x="270" y="115" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">
              WDW 作用量斑塊 I_WDW
            </text>

            <!-- 震波擾動光線 (Shockwave pulse) -->
            <line
              x1="80"
              y1="190"
              x2="270"
              y2="105"
              stroke="#f59e0b"
              stroke-width="2.5"
              stroke-dasharray="8 4"
            >
              <animate attributeName="stroke-dashoffset" values="0;-40" dur="1s" repeatCount="indefinite" />
            </line>
            <text x="145" y="180" fill="#fbbf24" font-size="10">減震波 W(t_w)</text>

            <!-- 底部勞埃德極限飽和與數值標記 -->
            <g transform="translate(60, 245)">
              <text x="0" y="25" fill="#10b981" font-size="11" font-weight="bold">
                勞埃德飽和比: {{ (state.lloydBoundSaturationRatio * 100).toFixed(1) }}% | 增長率 dC/dt = {{ state.actionGrowthRateGatesSec.toFixed(1) }}×10¹² Gates/s
              </text>
            </g>
          </svg>
        </div>

        <!-- 4 大體制按鈕 -->
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

        <!-- 即時物理指標儀表板 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">全息電路複雜度 C</span>
            <span class="m-val text-emerald">{{ state.complexityValueGigaGates.toFixed(1) }} G-Gates</span>
          </div>
          <div class="metric-item">
            <span class="m-label">勞埃德增長率</span>
            <span class="m-val text-cyan">{{ state.actionGrowthRateGatesSec.toFixed(1) }} Gates/s</span>
          </div>
          <div class="metric-item">
            <span class="m-label">勞埃德飽和度</span>
            <span class="m-val text-amber">{{ (state.lloydBoundSaturationRatio * 100).toFixed(1) }} %</span>
          </div>
          <div class="metric-item">
            <span class="m-label">WDW 斑塊體積</span>
            <span class="m-val">{{ state.wdwPatchVolumeAdS4.toFixed(0) }} ℓ⁴</span>
          </div>
          <div class="metric-item">
            <span class="m-label">擾亂時間 t_scr</span>
            <span class="m-val">{{ state.scramblingTimeGyr.toFixed(2) }} Gyr</span>
          </div>
          <div class="metric-item">
            <span class="m-label">震波延遲時間</span>
            <span class="m-val text-rose">{{ state.shockwaveDelayGyr.toFixed(2) }} Gyr</span>
          </div>
        </div>

        <!-- 物理參數調控滑桿 -->
        <div class="slider-controls">
          <div class="control-row">
            <label>黑洞質量 M: {{ state.blackHoleMassSolar.toFixed(1) }} M_☉</label>
            <input
              type="range"
              min="5.0"
              max="100.0"
              step="1.0"
              :value="state.blackHoleMassSolar"
              @input="updateMass(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>AdS 曲率半徑 ℓ: {{ state.adsCurvatureRadius.toFixed(1) }}</label>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              :value="state.adsCurvatureRadius"
              @input="updateAdsRadius(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>演化時間 t: {{ state.evolutionTimeGyr.toFixed(1) }} Gyr</label>
            <input
              type="range"
              min="0.0"
              max="50.0"
              step="0.5"
              :value="state.evolutionTimeGyr"
              @input="updateTime(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>邊界 Qubit 數 S: {{ state.boundaryQubitCount }} 位元</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              :value="state.boundaryQubitCount"
              @input="updateQubits(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 診斷動作列 -->
        <div class="action-footer">
          <button class="action-btn amber" @click="triggerShockwave">
            ⚡ 注入引力減震波微擾
          </button>
          <button class="action-btn emerald" @click="stepTime">
            ⏳ 前進全息演化時間 (+3 Gyr)
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
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.complexity-card {
  width: 620px;
  max-width: 95vw;
  background: #090e17;
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(16, 185, 129, 0.2), 0 20px 45px rgba(0, 0, 0, 0.9);
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 24px;
}

.title-group h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #10b981;
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #03080f;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.complexity-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.regime-btn {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #10b981;
  background: #064e3b;
}

.regime-btn.active {
  background: rgba(16, 185, 129, 0.18);
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
}

.regime-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.regime-desc {
  font-size: 11px;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 11px;
  color: #64748b;
}

.m-val {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.text-cyan {
  color: #38bdf8;
}

.text-amber {
  color: #fbbf24;
}

.text-emerald {
  color: #34d399;
}

.text-rose {
  color: #fb7185;
}

.slider-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  padding: 12px;
  border-radius: 12px;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-row label {
  font-size: 12px;
  color: #94a3b8;
}

.control-row input[type='range'] {
  width: 100%;
  accent-color: #10b981;
}

.action-footer {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.amber {
  background: rgba(251, 191, 36, 0.15);
  border-color: #fbbf24;
  color: #fcd34d;
}

.action-btn.amber:hover {
  background: rgba(251, 191, 36, 0.3);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}

.action-btn.emerald {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
}

.action-btn.emerald:hover {
  background: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}
</style>
