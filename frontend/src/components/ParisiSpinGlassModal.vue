<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { parisiSpinGlassEngine, type SpinGlassRegime } from '../engine/parisiSpinGlassUltrametric';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => parisiSpinGlassEngine.getState());

const isOpen = computed(() => uiStore.mode === 'parisi-spin-glass');

const regimes: Array<{ id: SpinGlassRegime; label: string; desc: string }> = [
  { id: 'parisi-full-rsb-ultrametric', label: '帕里西全層次複本破缺超度規相', desc: '低溫極端阻挫下自發複本破缺 (FRSB)，相空間嚴格滿足超度規強三角不等式，湧現分形樹狀層級結構' },
  { id: 'quantum-annealing-tunneling', label: '橫向場量子退火穿隧態', desc: '強橫向場 Γ 誘發宏觀量子穿隧效應，穿透崎嶇指數級高狹窄能壘，執行組合優化全局基態搜尋' },
  { id: 'spin-glass-frozen-landscape', label: '低溫自旋玻璃崎嶇凍結相', desc: '阻挫隨機交換耦合凍結於天文數字亞穩態谷底，處於局部極小值陷阱但尚未深度展開超度規' },
  { id: 'replica-symmetric-paramagnet', label: '高溫順磁複本對稱平庸相', desc: '熱漲落破壞自旋玻璃態 (T > T_f)，序參量消失 q_EA ≈ 0，超度規幾何崩解為單一高溫順磁相' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemp(val: number) {
  const diff = val - state.value.temperatureKelvinT;
  parisiSpinGlassEngine.coolToParisiGlass(diff);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function updateGamma(val: number) {
  const diff = val - state.value.transverseFieldGamma;
  parisiSpinGlassEngine.rampQuantumTransverseField(diff);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function updateRSB(val: number) {
  const diff = Math.round(val) - state.value.rsbBranchingLevelK;
  parisiSpinGlassEngine.deepenRSBBranching(diff);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function coolParisi() {
  parisiSpinGlassEngine.coolToParisiGlass(-0.25);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function rampGamma() {
  parisiSpinGlassEngine.rampQuantumTransverseField(0.8);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function deepenRSB() {
  parisiSpinGlassEngine.deepenRSBBranching(1);
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function triggerAnneal() {
  parisiSpinGlassEngine.triggerQuantumAnnealCycle();
  achievements.unlock('parisi_spin_glass_ultrametric');
}

function reset() {
  parisiSpinGlassEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="parisi-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌲</span>
          <div>
            <h2>量子自旋玻璃帕里西極值破缺與超度規 (Parisi Spin Glass & Ultrametricity)</h2>
            <span class="subtitle">SK Model Frustration, Full RSB Order Parameter q(x), Ultrametric Tree & Quantum Annealing</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 超度規樹狀分形拓撲與崎嶇能量景觀 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="parisi-svg">
            <defs>
              <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
              <radialGradient id="tunnelGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#6366f1" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 深空網格背景板 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#10b981" stroke-width="1.6" />

            <!-- 左側：超度規樹狀分形結構 (Ultrametric Tree) -->
            <g transform="translate(45, 35)">
              <text x="0" y="14" fill="#10b981" font-size="12" font-weight="bold">超度規樹狀幾何 (d(α,β) ≤ max(d(α,γ), d(β,γ)))</text>
              
              <!-- 樹根 (Root) -->
              <circle cx="120" cy="40" r="5" fill="#34d399" />
              
              <!-- 第一層分支 (Level 1) -->
              <line x1="120" y1="40" x2="70" y2="75" stroke="#10b981" stroke-width="2" />
              <line x1="120" y1="40" x2="170" y2="75" stroke="#10b981" stroke-width="2" />
              <circle cx="70" cy="75" r="4.5" fill="#10b981" />
              <circle cx="170" cy="75" r="4.5" fill="#10b981" />

              <!-- 第二層分支 (Level 2) -->
              <line x1="70" y1="75" x2="45" y2="115" stroke="#059669" stroke-width="1.6" />
              <line x1="70" y1="75" x2="95" y2="115" stroke="#059669" stroke-width="1.6" />
              <line x1="170" y1="75" x2="145" y2="115" stroke="#059669" stroke-width="1.6" />
              <line x1="170" y1="75" x2="195" y2="115" stroke="#059669" stroke-width="1.6" />
              <circle cx="45" cy="115" r="4" fill="#059669" />
              <circle cx="95" cy="115" r="4" fill="#059669" />
              <circle cx="145" cy="115" r="4" fill="#059669" />
              <circle cx="195" cy="115" r="4" fill="#059669" />

              <!-- 第三層分支 (Level 3 - 根據 rsbBranchingLevelK 條件渲染) -->
              <g v-if="state.rsbBranchingLevelK >= 3" stroke="#047857" stroke-width="1.2">
                <line x1="45" y1="115" x2="35" y2="155" />
                <line x1="45" y1="115" x2="55" y2="155" />
                <line x1="95" y1="115" x2="85" y2="155" />
                <line x1="95" y1="115" x2="105" y2="155" />
                <line x1="145" y1="115" x2="135" y2="155" />
                <line x1="145" y1="115" x2="155" y2="155" />
                <line x1="195" y1="115" x2="185" y2="155" />
                <line x1="195" y1="115" x2="205" y2="155" />
                <circle cx="35" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="55" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="85" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="105" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="135" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="155" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="185" cy="155" r="3" fill="#6ee7b7" />
                <circle cx="205" cy="155" r="3" fill="#6ee7b7" />
              </g>

              <!-- 崎嶇能谷基態標示 (Rugged Basins) -->
              <path d="M 20 185 Q 35 210, 50 185 T 80 185 T 110 185 T 140 185 T 170 185 T 200 185 T 225 185"
                    fill="none" stroke="#6366f1" stroke-width="1.8" />
              <!-- 量子穿隧波包 -->
              <ellipse v-if="state.transverseFieldGamma > 0.5"
                       :cx="110" :cy="195" :rx="15 + state.transverseFieldGamma * 4" :ry="6"
                       fill="url(#tunnelGlow)">
                <animate attributeName="cx" values="80;140;80" dur="2.2s" repeatCount="indefinite" />
              </ellipse>
            </g>

            <!-- 右側：帕里西序參量函數 q(x) 與能谷分佈 -->
            <g transform="translate(305, 50)">
              <rect x="0" y="0" width="195" height="195" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#10b981" stroke-width="1" />
              <text x="14" y="24" fill="#34d399" font-size="12" font-weight="bold">帕里西連續序參量 q(x)</text>
              <line x1="14" y1="32" x2="181" y2="32" stroke="#334155" stroke-width="1" />

              <!-- q(x) 座標軸 -->
              <line x1="25" y1="140" x2="175" y2="140" stroke="#64748b" stroke-width="1.2" />
              <line x1="25" y1="140" x2="25" y2="50" stroke="#64748b" stroke-width="1.2" />
              <text x="165" y="154" fill="#94a3b8" font-size="10">x (0→1)</text>
              <text x="12" y="46" fill="#94a3b8" font-size="10">q(x)</text>

              <!-- q(x) 階梯/連續曲線 (隨 q_EA 與 k 繪製) -->
              <path :d="`M 25 ${140 - 15} L 75 ${140 - 20} Q 110 ${140 - state.parisiEdwardsAndersonQEA * 70}, 150 ${140 - state.parisiEdwardsAndersonQEA * 85} L 175 ${140 - state.parisiEdwardsAndersonQEA * 85}`"
                    fill="none" stroke="#38bdf8" stroke-width="2.5" />
              
              <!-- 數值標註 -->
              <text x="30" y="172" fill="#94a3b8" font-size="10">q_EA = q(1):</text>
              <text x="115" y="172" fill="#38bdf8" font-size="12" font-weight="bold">{{ state.parisiEdwardsAndersonQEA.toFixed(3) }}</text>

              <text x="30" y="188" fill="#94a3b8" font-size="10">超度規聚集度:</text>
              <text x="115" y="188" fill="#10b981" font-size="12" font-weight="bold">{{ (state.ultrametricClusteringIndex * 100).toFixed(1) }}%</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 245)">
              <rect x="0" y="0" width="260" height="28" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
              <text x="12" y="18" fill="#34d399" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">EA 序參量 (q_EA)</span>
            <span class="m-val highlight">{{ state.parisiEdwardsAndersonQEA.toFixed(3) }}</span>
            <span class="m-sub">純態重疊度上限 q(1)</span>
          </div>

          <div class="metric-card">
            <span class="m-label">超度規聚集指數</span>
            <span class="m-val accent">{{ (state.ultrametricClusteringIndex * 100).toFixed(1) }}%</span>
            <span class="m-sub">樹狀強三角不等式滿足度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">亞穩態能谷數 log₁₀(N)</span>
            <span class="m-val">{{ state.energyLandscapeValleysLogN }}</span>
            <span class="m-sub">天文數字幾何阻挫陷阱</span>
          </div>

          <div class="metric-card">
            <span class="m-label">宏觀量子穿隧率</span>
            <span class="m-val">{{ state.quantumTunnelingRateGhz.toFixed(2) }} GHz</span>
            <span class="m-sub">橫向場 Γ 驅動穿透勢壘</span>
          </div>

          <div class="metric-card">
            <span class="m-label">每自旋自由能 (f)</span>
            <span class="m-val">{{ state.freeEnergyPerSpinF }} meV</span>
            <span class="m-sub">帕里西變分極小值解</span>
          </div>

          <div class="metric-card">
            <span class="m-label">橫向量子磁場 (Γ)</span>
            <span class="m-val">{{ state.transverseFieldGamma.toFixed(2) }}</span>
            <span class="m-sub">量子退火起伏強度</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>系統溫度 T (0.05 ~ 4.5 K): <b>{{ state.temperatureKelvinT.toFixed(2) }} K</b></label>
              <input
                type="range"
                min="0.05"
                max="4.5"
                step="0.05"
                :value="state.temperatureKelvinT"
                @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>橫向量子磁場 Γ (0.0 ~ 6.0): <b>{{ state.transverseFieldGamma.toFixed(2) }}</b></label>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.1"
                :value="state.transverseFieldGamma"
                @input="updateGamma(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>RSB 複本破缺層次 k (1 ~ 8): <b>{{ state.rsbBranchingLevelK }} 階</b></label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                :value="state.rsbBranchingLevelK"
                @input="updateRSB(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="deepenRSB">
              🌲 深化複本破缺 (+1 階)
            </button>
            <button class="action-btn cyan" @click="triggerAnneal">
              ⚡ 執行量子退火循環 (Anneal)
            </button>
            <button class="action-btn cyan" @click="rampGamma">
              🧲 橫向場擾動 (+0.8 Γ)
            </button>
            <button class="action-btn secondary" @click="coolParisi">
              ❄️ 深度冷凍玻璃態 (-0.25 K)
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

.parisi-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 20, 24, 0.92);
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
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
  color: #34d399;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
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
  display: flex;
  justify-content: center;
}

.parisi-svg {
  width: 100%;
  height: auto;
  max-height: 270px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.m-val.highlight {
  color: #38bdf8;
}

.m-val.accent {
  color: #34d399;
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
  border-radius: 10px;
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

.slider-row label b {
  color: #34d399;
}

.slider-row input[type="range"] {
  accent-color: #10b981;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1;
  min-width: 130px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
}

.action-btn.primary:hover {
  background: rgba(16, 185, 129, 0.35);
}

.action-btn.cyan {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #38bdf8;
}

.action-btn.cyan:hover {
  background: rgba(6, 182, 212, 0.35);
}

.action-btn.secondary {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #a5b4fc;
}

.action-btn.secondary:hover {
  background: rgba(99, 102, 241, 0.35);
}

.action-btn.reset {
  background: rgba(148, 163, 184, 0.15);
  border-color: #64748b;
  color: #cbd5e1;
}

.action-btn.reset:hover {
  background: rgba(148, 163, 184, 0.25);
}
</style>
