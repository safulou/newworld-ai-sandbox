<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { dBraneDBIEngine, type DBraneRegime } from '../engine/dBraneDBINonlinearVacuum';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => dBraneDBIEngine.getState());

const isOpen = computed(() => uiStore.mode === 'd-brane-dbi');

const regimes: Array<{ id: DBraneRegime; label: string; desc: string }> = [
  { id: 'dbi-critical-field-saturation', label: 'DBI 非線性極限場飽和相', desc: '膜上電場逼近玻恩-英費爾德極限 E_crit，開弦張力崩潰並本徵消除自能發散奇點' },
  { id: 'tachyon-condensation-brane-reconnection', label: '快子凝聚膜幾何重聯喉管相', desc: '次弦長距離 (d < ℓ_s) 引發開弦快子質量失穩 (m² < 0)，膜間熔接形成平滑重聯蟲洞喉管' },
  { id: 'intersecting-brane-flux-compactification', label: '相交 D-膜通量緊緻化穩定相', desc: '相交角度與卡什米爾引力引發平坦慢滾勢能，維持膜世界暴脹與標準模型規範群湧現' },
  { id: 'free-asymptotic-brane-propagation', label: '自由漸近膜空間漂移平庸相', desc: '膜間距遠大於弦長尺度 (d ≫ ℓ_s)，快子模式消失且膜間相互作用微弱退化' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateD(val: number) {
  const diff = val - state.value.interBraneDistanceStringUnits;
  dBraneDBIEngine.adjustInterBraneDistance(diff);
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function updateE(val: number) {
  const diff = val - state.value.worldvolumeElectricFieldRatio;
  dBraneDBIEngine.rampElectricFieldRatio(diff);
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function adjustDAction() {
  dBraneDBIEngine.adjustInterBraneDistance(-0.25);
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function rampEAction() {
  dBraneDBIEngine.rampElectricFieldRatio(0.08);
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function triggerCollapseAction() {
  dBraneDBIEngine.triggerTachyonCondensationCollapse();
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function decoupleAction() {
  dBraneDBIEngine.decoupleBraneSeparation();
  achievements.unlock('d_brane_dbi_nonlinear_vacuum');
}

function reset() {
  dBraneDBIEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="dbrane-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🛡️</span>
          <div>
            <h2>超弦 D-膜重聯與 DBI 非線性真空反應堆 (D-Brane & DBI Vacuum)</h2>
            <span class="subtitle">Dirichlet Brane Reconnection, Born-Infeld Limit E_crit, Tachyon Neck & Brane Inflation</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 平行/相交 D-膜、重聯喉管與開弦通量 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="dbrane-svg">
            <defs>
              <linearGradient id="braneGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#c084fc" />
              </linearGradient>
              <linearGradient id="throatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#c084fc" />
              </linearGradient>
            </defs>

            <!-- 儀器底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#8b5cf6" stroke-width="1.6" />

            <!-- 左側：頂部 D-膜與底部 D-膜及連接喉管 -->
            <g transform="translate(145, 150)">
              <!-- 頂部 D-膜面 (Upper D-Brane) -->
              <rect x="-90" :y="-60 - state.interBraneDistanceStringUnits * 8" width="180" height="14" rx="4" fill="url(#braneGrad1)" opacity="0.85" />
              <text x="0" :y="-48 - state.interBraneDistanceStringUnits * 8" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">D-膜 (Dp⁺)</text>

              <!-- 底部 D-膜面 (Lower D-Brane) -->
              <rect x="-90" :y="46 + state.interBraneDistanceStringUnits * 8" width="180" height="14" rx="4" fill="url(#braneGrad1)" opacity="0.85" />
              <text x="0" :y="58 + state.interBraneDistanceStringUnits * 8" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">D-膜 (Dp⁻)</text>

              <!-- 重聯幾何喉管 (Tachyon Neck Throat) 當 r_throat > 0 -->
              <g v-if="state.reconnectionThroatRadiusLs > 0">
                <path :d="`M ${-state.reconnectionThroatRadiusLs * 12} ${-46 - state.interBraneDistanceStringUnits * 8} Q 0 0, ${-state.reconnectionThroatRadiusLs * 12} ${46 + state.interBraneDistanceStringUnits * 8} L ${state.reconnectionThroatRadiusLs * 12} ${46 + state.interBraneDistanceStringUnits * 8} Q 0 0, ${state.reconnectionThroatRadiusLs * 12} ${-46 - state.interBraneDistanceStringUnits * 8} Z`"
                      fill="url(#throatGrad)" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.75;0.4" dur="2.2s" repeatCount="indefinite" />
                </path>
                <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">快子重聯喉管</text>
              </g>

              <!-- 伸展微觀開弦力線 (Open Strings) -->
              <g v-else stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6">
                <line x1="-50" :y1="-46 - state.interBraneDistanceStringUnits * 8" x2="-50" :y2="46 + state.interBraneDistanceStringUnits * 8" />
                <line x1="0" :y1="-46 - state.interBraneDistanceStringUnits * 8" x2="0" :y2="46 + state.interBraneDistanceStringUnits * 8" />
                <line x1="50" :y1="-46 - state.interBraneDistanceStringUnits * 8" x2="50" :y2="46 + state.interBraneDistanceStringUnits * 8" />
              </g>

              <!-- 膜間距離標記線 -->
              <line x1="95" :y1="-50 - state.interBraneDistanceStringUnits * 8" x2="95" :y2="50 + state.interBraneDistanceStringUnits * 8" stroke="#f59e0b" stroke-width="1.5" />
              <text x="100" y="4" fill="#fbbf24" font-size="9">d={{ state.interBraneDistanceStringUnits.toFixed(2) }} ℓ_s</text>
            </g>

            <!-- 右側：DBI 因子與弦論參數儀表板 -->
            <g transform="translate(295, 45)">
              <rect x="0" y="0" width="205" height="205" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#8b5cf6" stroke-width="1" />
              <text x="14" y="24" fill="#c084fc" font-size="12" font-weight="bold">DBI 非線性真空指標</text>
              <line x1="14" y1="32" x2="191" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">快子質量平方 m²:</text>
              <text x="14" y="74" :fill="state.tachyonMassSquaredNegative < 0 ? '#f43f5e' : '#34d399'" font-size="14" font-weight="bold">{{ state.tachyonMassSquaredNegative.toFixed(3) }} α'⁻¹ ({{ state.tachyonMassSquaredNegative < 0 ? '快子失穩' : '平穩' }})</text>

              <text x="14" y="100" fill="#94a3b8" font-size="10">DBI 根號因子 √(1-(E/E_c)²):</text>
              <text x="14" y="119" fill="#38bdf8" font-size="14" font-weight="bold">{{ state.dbiSquareRootFactor.toFixed(3) }}</text>

              <text x="14" y="145" fill="#94a3b8" font-size="10">重聯喉管半徑 r_throat:</text>
              <text x="14" y="165" fill="#f59e0b" font-size="14" font-weight="bold">{{ state.reconnectionThroatRadiusLs.toFixed(2) }} ℓ_s</text>

              <text x="14" y="190" fill="#94a3b8" font-size="10">閉弦引力輻射: <b>{{ state.closedStringRadiationPower }} ×10³² W</b></text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 245)">
              <rect x="0" y="0" width="270" height="28" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#8b5cf6" stroke-width="1" />
              <text x="12" y="18" fill="#c084fc" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">快子質量 (m²)</span>
            <span class="m-val" :class="state.tachyonMassSquaredNegative < 0 ? 'alert' : 'highlight'">{{ state.tachyonMassSquaredNegative.toFixed(3) }}</span>
            <span class="m-sub">α'⁻¹ (負值為快子凝聚)</span>
          </div>

          <div class="metric-card">
            <span class="m-label">DBI 根號因子</span>
            <span class="m-val accent">{{ state.dbiSquareRootFactor.toFixed(3) }}</span>
            <span class="m-sub">玻恩-英費爾德場非線性度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">重聯喉管半徑</span>
            <span class="m-val">{{ state.reconnectionThroatRadiusLs.toFixed(2) }} ℓ_s</span>
            <span class="m-sub">膜間熔接幾何蟲洞喉管</span>
          </div>

          <div class="metric-card">
            <span class="m-label">卡西米爾吸引力</span>
            <span class="m-val">{{ state.casimirInteractionForceN }} ×10²⁸ N</span>
            <span class="m-sub">膜間引力-拉蒙德張力</span>
          </div>

          <div class="metric-card">
            <span class="m-label">膜間距 (d)</span>
            <span class="m-val">{{ state.interBraneDistanceStringUnits.toFixed(2) }} ℓ_s</span>
            <span class="m-sub">普朗克弦長尺度相對距離</span>
          </div>

          <div class="metric-card">
            <span class="m-label">電場比值 (E/E_crit)</span>
            <span class="m-val">{{ state.worldvolumeElectricFieldRatio.toFixed(2) }}</span>
            <span class="m-sub">膜世界臨界玻恩極限比</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>膜間相對距離 d (0.1 ~ 8.0 ℓ_s): <b>{{ state.interBraneDistanceStringUnits.toFixed(2) }} ℓ_s</b></label>
              <input
                type="range"
                min="0.1"
                max="8.0"
                step="0.1"
                :value="state.interBraneDistanceStringUnits"
                @input="updateD(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>膜上電場強度比 E / E_crit (0.00 ~ 0.99): <b>{{ state.worldvolumeElectricFieldRatio.toFixed(2) }}</b></label>
              <input
                type="range"
                min="0.00"
                max="0.99"
                step="0.02"
                :value="state.worldvolumeElectricFieldRatio"
                @input="updateE(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="adjustDAction">
              🛡️ 逼近膜間距離 (-0.25 ℓ_s)
            </button>
            <button class="action-btn cyan" @click="rampEAction">
              ⚡ 提升臨界電場 (+0.08)
            </button>
            <button class="action-btn secondary" @click="triggerCollapseAction">
              💥 觸發快子凝聚塌陷重聯
            </button>
            <button class="action-btn decouple" @click="decoupleAction">
              🌌 漸近解耦拉遠 (+4.5 ℓ_s)
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

.dbrane-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(18, 12, 28, 0.92);
  border: 1px solid rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 35px rgba(139, 92, 246, 0.25);
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
  color: #c084fc;
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

.dbrane-svg {
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
  border: 1px solid rgba(139, 92, 246, 0.2);
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
  color: #c084fc;
}

.m-val.alert {
  color: #f43f5e;
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
  color: #c084fc;
}

.slider-row input[type="range"] {
  accent-color: #8b5cf6;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  color: #c084fc;
}

.action-btn.primary:hover {
  background: rgba(139, 92, 246, 0.35);
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
  background: rgba(244, 63, 94, 0.2);
  border-color: #f43f5e;
  color: #fb7185;
}

.action-btn.secondary:hover {
  background: rgba(244, 63, 94, 0.35);
}

.action-btn.decouple {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
}

.action-btn.decouple:hover {
  background: rgba(16, 185, 129, 0.35);
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
