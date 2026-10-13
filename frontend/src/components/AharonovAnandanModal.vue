<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { aharonovAnandanEngine, type AARegime } from '../engine/aharonovAnandanGeometricPhase';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => aharonovAnandanEngine.getState());

const isOpen = computed(() => uiStore.mode === 'aa-geometric-phase');

const regimes: Array<{ id: AARegime; label: string; desc: string }> = [
  { id: 'aa-non-adiabatic-geometric-phase', label: '純非絕熱 AA 幾何相', desc: '射影希爾伯特空間閉環純幾何相，完全打破常規慢速絕熱定理束縛，實現高速純幾何演化' },
  { id: 'wilczek-zee-non-abelian-holonomy', label: '威爾切克-齊非阿貝爾完整群', desc: 'N 重簡併子空間之非阿貝爾酉矩陣完整群 U_AA ∈ U(N)，編譯非對易拓撲量子邏輯操作' },
  { id: 'ultra-fast-geometric-quantum-gate', label: '超高速容錯幾何量子門', desc: '奈秒級超高速演化 (τ ≤ 5 ns) 搭配 >92% 動態相消除，門保真度突破 99.9% 且本徵抗擾' },
  { id: 'mixed-dynamical-dominated-regime', label: '動態相主導雜散退相干態', desc: '動態相消除不充分 (δ_dyn >> β_AA)，量子態受哈密頓量微擾與能量漂移退相干干擾' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateOmega(val: number) {
  const diff = val - state.value.projectiveSolidAngleOmegaRad;
  aharonovAnandanEngine.tuneProjectiveSolidAngle(diff);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function updatePeriod(val: number) {
  const diff = val - state.value.evolutionPeriodTauNs;
  aharonovAnandanEngine.rampEvolutionPeriod(diff);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function updateCancellation(val: number) {
  const diff = val - state.value.dynamicalPhaseCancellationRate;
  aharonovAnandanEngine.optimizeDynamicalCancellation(diff);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function tuneOmegaAction() {
  aharonovAnandanEngine.tuneProjectiveSolidAngle(0.5);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function optimizeCancellationAction() {
  aharonovAnandanEngine.optimizeDynamicalCancellation(0.05);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function toggleNonAbelianAction() {
  const nextN = state.value.nonAbelianDegeneracyN === 3 ? 1 : 3;
  aharonovAnandanEngine.toggleNonAbelianDegeneracy(nextN);
  achievements.unlock('aharonov_anandan_geometric_phase');
}

function reset() {
  aharonovAnandanEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="aa-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">📐</span>
          <div>
            <h2>阿哈羅諾夫-安丹幾何相位與非阿貝爾拓撲泵浦 (Aharonov-Anandan Phase)</h2>
            <span class="subtitle">Non-Adiabatic Geometric Holonomy, Wilczek-Zee Non-Abelian Gauge & Fast Geometric Gate</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 射影希爾伯特球面軌線與幾何相位立體角 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="aa-svg">
            <defs>
              <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
                <stop offset="70%" stop-color="#059669" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34d399" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>

            <!-- 儀器底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#10b981" stroke-width="1.6" />

            <!-- 左側：射影布洛赫/希爾伯特空間 P(H) 球面與非絕熱閉環 -->
            <g transform="translate(145, 145)">
              <!-- 射影球面基底 -->
              <circle cx="0" cy="0" r="75" fill="url(#sphereGlow)" stroke="#059669" stroke-width="1.5" stroke-dasharray="4 2" />
              <!-- 赤道透視橢圓環 -->
              <ellipse cx="0" cy="0" rx="75" ry="24" fill="none" stroke="#047857" stroke-width="1.2" stroke-dasharray="3 3" />
              <!-- 垂直極軸線 -->
              <line x1="0" y1="-85" x2="0" y2="85" stroke="#334155" stroke-width="1" />
              <text x="6" y="-75" fill="#64748b" font-size="9">|0⟩</text>
              <text x="6" y="80" fill="#64748b" font-size="9">|1⟩</text>

              <!-- 非絕熱閉合射影演化軌線 C (立體角 Ω 隨參數調整) -->
              <path :d="`M 0 -65 C ${40 + state.projectiveSolidAngleOmegaRad * 10} -30, ${50 + state.projectiveSolidAngleOmegaRad * 12} 35, 0 55 C ${-40 - state.projectiveSolidAngleOmegaRad * 10} 35, ${-40 - state.projectiveSolidAngleOmegaRad * 8} -30, 0 -65 Z`"
                    fill="rgba(52, 211, 153, 0.15)" stroke="url(#orbitGrad)" stroke-width="2.5">
                <animate attributeName="stroke-dashoffset" values="0;40" dur="3s" repeatCount="indefinite" />
              </path>

              <!-- 幾何曲率向量單極子光斑 -->
              <circle cx="0" cy="0" :r="8 + state.nonAbelianDegeneracyN * 3" fill="#10b981" opacity="0.8">
                <animate attributeName="r" values="8;13;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="3" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">
                {{ state.nonAbelianDegeneracyN > 1 ? `U(${state.nonAbelianDegeneracyN})` : 'Ω_AA' }}
              </text>
            </g>

            <!-- 右側：幾何相位 vs 動態相抵消與門保真度儀表 -->
            <g transform="translate(295, 45)">
              <rect x="0" y="0" width="205" height="205" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#10b981" stroke-width="1" />
              <text x="14" y="24" fill="#34d399" font-size="12" font-weight="bold">非絕熱幾何相位指標</text>
              <line x1="14" y1="32" x2="191" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">AA 幾何相 β_AA:</text>
              <text x="14" y="74" fill="#34d399" font-size="14" font-weight="bold">{{ state.aaGeometricPhaseBetaRad.toFixed(3) }} rad ({{ (state.aaGeometricPhaseBetaRad / Math.PI).toFixed(2) }}π)</text>

              <text x="14" y="100" fill="#94a3b8" font-size="10">剩餘動態相 δ_dyn:</text>
              <text x="14" y="119" fill="#f59e0b" font-size="14" font-weight="bold">{{ state.dynamicalPhaseDeltaRad.toFixed(3) }} rad</text>

              <text x="14" y="145" fill="#94a3b8" font-size="10">幾何量子門保真度:</text>
              <text x="14" y="165" fill="#38bdf8" font-size="15" font-weight="bold">{{ (state.geometricGateFidelity * 100).toFixed(2) }}%</text>

              <text x="14" y="190" fill="#94a3b8" font-size="10">非絕熱週期泵浦電荷: <b>{{ state.nonAdiabaticPumpedChargeE }} e</b></text>
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
            <span class="m-label">AA 幾何相 (β_AA)</span>
            <span class="m-val highlight">{{ state.aaGeometricPhaseBetaRad.toFixed(3) }} rad</span>
            <span class="m-sub">閉環純幾何射影不變量</span>
          </div>

          <div class="metric-card">
            <span class="m-label">門保真度 (Fidelity)</span>
            <span class="m-val accent">{{ (state.geometricGateFidelity * 100).toFixed(2) }}%</span>
            <span class="m-sub">容錯幾何量子邏輯門</span>
          </div>

          <div class="metric-card">
            <span class="m-label">剩餘動態相 (δ_dyn)</span>
            <span class="m-val">{{ state.dynamicalPhaseDeltaRad.toFixed(3) }} rad</span>
            <span class="m-sub">自旋回波抵消殘差</span>
          </div>

          <div class="metric-card">
            <span class="m-label">週期泵浦電荷 (Q)</span>
            <span class="m-val">{{ state.nonAdiabaticPumpedChargeE }} e</span>
            <span class="m-sub">拓撲量子幾何泵浦</span>
          </div>

          <div class="metric-card">
            <span class="m-label">演化週期 (τ)</span>
            <span class="m-val">{{ state.evolutionPeriodTauNs.toFixed(1) }} ns</span>
            <span class="m-sub">超快速非絕熱演化</span>
          </div>

          <div class="metric-card">
            <span class="m-label">射影立體角 (Ω)</span>
            <span class="m-val">{{ state.projectiveSolidAngleOmegaRad.toFixed(2) }} rad</span>
            <span class="m-sub">P(H) 射影軌線包含面積</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>射影立體角 Ω (0.05 ~ 6.28 rad): <b>{{ state.projectiveSolidAngleOmegaRad.toFixed(2) }} rad</b></label>
              <input
                type="range"
                min="0.05"
                max="6.28"
                step="0.05"
                :value="state.projectiveSolidAngleOmegaRad"
                @input="updateOmega(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>演化週期 τ (0.1 ~ 50.0 ns): <b>{{ state.evolutionPeriodTauNs.toFixed(1) }} ns</b></label>
              <input
                type="range"
                min="0.1"
                max="50.0"
                step="0.5"
                :value="state.evolutionPeriodTauNs"
                @input="updatePeriod(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>動態相消除率 (0.00 ~ 1.00): <b>{{ (state.dynamicalPhaseCancellationRate * 100).toFixed(0) }}%</b></label>
              <input
                type="range"
                min="0.00"
                max="1.00"
                step="0.02"
                :value="state.dynamicalPhaseCancellationRate"
                @input="updateCancellation(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="tuneOmegaAction">
              📐 調諧立體角 (+0.5 rad)
            </button>
            <button class="action-btn cyan" @click="optimizeCancellationAction">
              ⚡ 最佳化動態相消除 (+5%)
            </button>
            <button class="action-btn secondary" @click="toggleNonAbelianAction">
              🧬 切換非阿貝爾簡併 ({{ state.nonAbelianDegeneracyN === 3 ? 'N=1' : 'N=3' }})
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

.aa-card {
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

.aa-svg {
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
  color: #34d399;
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
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #c084fc;
}

.action-btn.secondary:hover {
  background: rgba(168, 85, 247, 0.35);
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
