<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card hqec-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 59 · HOLOGRAPHIC QUANTUM ERROR CORRECTION &amp; HaPPY CODE</span>
          <h2>🕸️ 全息張量網路表面/狀態對偶與量子糾錯碼體重構器</h2>
          <p class="subtitle">Poincaré {5,4} Hyperbolic Pentagon Perfect-Tensor Code, Entanglement Wedge W_E(A) &amp; RT/JLMS Bulk Reconstruction</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">糾纏楔形區重構保真度 (F_Wedge)</span>
          <span class="kpi-value highlight-cyan">{{ (state.wedgeReconstructionFidelity * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">貪婪推算算符 O_A 體邏輯重構</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">RT 極小測地線切面 (|γ_A|)</span>
          <span class="kpi-value highlight-amber">{{ state.rtMinimalCutBondCount }} bonds</span>
          <span class="kpi-sub">笠-高柳張量網路極小割面積</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">廣義全息糾纏熵 S(A)</span>
          <span class="kpi-value highlight-emerald">{{ state.holoEntanglementEntropyBits.toFixed(1) }} bits</span>
          <span class="kpi-sub">Area(γ_A)/4G_N + S_bulk(W_E)</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">全息邏輯編碼率 (k_bulk / n_bdy)</span>
          <span class="kpi-value highlight-violet">{{ state.logicalEncodingRateKPerN.toFixed(3) }}</span>
          <span class="kpi-sub">雙曲 {5,4} 鑲嵌深度 L = {{ state.hyperbolicTessellationDepthL }}</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="hqec-svg">
            <defs>
              <radialGradient id="hqecDiskGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="0.38" />
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#060a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060a14" />
            <!-- Poincaré Disk Conformal UV Boundary -->
            <circle cx="165" cy="160" r="112" fill="url(#hqecDiskGrad)" stroke="#38bdf8" stroke-width="1.8" />
            <circle cx="165" cy="160" r="48" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3" />
            <circle cx="165" cy="160" r="94" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="4 3" />

            <!-- Ryu-Takayanagi Minimal Geodesic Arc γ_A -->
            <path
              d="M 92 75 Q 165 160 238 75"
              fill="none"
              stroke="#facc15"
              stroke-width="2.2"
              stroke-dasharray="5 3"
            />

            <!-- 19 Hyperbolic Pentagon Perfect Tensor Nodes -->
            <g v-for="node in state.tensorNodes" :key="node.id">
              <line
                v-if="node.id > 0"
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.insideEntanglementWedge ? '#34d399' : '#475569'"
                stroke-width="1"
                opacity="0.45"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.radialLayer === 0 ? 11 : node.radialLayer === 1 ? 6.5 : 4.8"
                :fill="node.insideEntanglementWedge ? '#10b981' : '#ef4444'"
                stroke="#f8fafc"
                stroke-width="1.1"
              />
            </g>

            <text x="12" y="22" fill="#6ee7b7" font-size="10" font-weight="bold">
              HaPPY {5,4} Hyperbolic Tensor Disk (f_A = {{ (state.boundarySubregionFractionFa * 100).toFixed(0) }}%)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Erasure p: {{ (state.boundaryErasureRatePerase * 100).toFixed(0) }}% | RT Cut: {{ state.rtMinimalCutBondCount }} bonds
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">全息張量量子糾錯體重構體制 (Holographic QEC Regimes)</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimeOptions"
                :key="opt.value"
                :class="['regime-btn', { active: state.activeRegime === opt.value }]"
                @click="selectRegime(opt.value)"
              >
                <span class="reg-icon">{{ opt.icon }}</span>
                <div class="reg-Info">
                  <strong>{{ opt.label }}</strong>
                  <small>{{ opt.desc }}</small>
                </div>
              </button>
            </div>
          </div>

          <div class="sliders-section">
            <div class="slider-group">
              <div class="slider-header">
                <span>邊界子區域保留覆蓋率 f_A = |A| / N_bdy (0.15 ~ 0.95)</span>
                <strong class="accent-cyan">{{ (state.boundarySubregionFractionFa * 100).toFixed(0) }}%</strong>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.95"
                step="0.01"
                :value="state.boundarySubregionFractionFa"
                @input="onFractionChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>共形邊界量子通道擦除錯誤率 p_erase (0.00 ~ 0.65)</span>
                <strong class="accent-amber">{{ (state.boundaryErasureRatePerase * 100).toFixed(0) }}%</strong>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.65"
                step="0.01"
                :value="state.boundaryErasureRatePerase"
                @input="onErasureChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 HaPPY 五邊形完美張量 RT 楔形重構共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置龐加萊雙曲糾錯網路
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import {
  holographicQuantumErrorCorrectionCodeEngine,
  type HolographicQecRegime
} from '../engine/holographicQuantumErrorCorrectionCode';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(holographicQuantumErrorCorrectionCodeEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: HolographicQecRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'happy-pentagon-perfect-tensor-code',
    label: 'HaPPY 五邊形完美張量碼',
    desc: '6-leg AME 完美張量鑲嵌，保護深層 AdS 體邏輯位元',
    icon: '🕸️'
  },
  {
    value: 'greedy-entanglement-wedge-reconstruction',
    label: '貪婪糾纏楔形區完全重構',
    desc: '大邊界子區域 f_A=82%，實現 F_Wedge > 99% 高保真體重構',
    icon: '🛡️'
  },
  {
    value: 'erasure-threshold-phase-transition',
    label: '50% 擦除錯誤全息相變閾值',
    desc: '逼近互補恢復臨界點，觀測 RT 切面不連續跳躍',
    icon: '⚡'
  },
  {
    value: 'uberholography-fractal-operator-support',
    label: '超全息康托爾分形邊界支撐',
    desc: 'Uberholography 分形穿孔邊界上重構體局部算符',
    icon: '🌌'
  }
];

function syncFromEngine(): void {
  Object.assign(state, holographicQuantumErrorCorrectionCodeEngine.getState());
}

function selectRegime(regime: HolographicQecRegime): void {
  holographicQuantumErrorCorrectionCodeEngine.setRegime(regime);
  holographicQuantumErrorCorrectionCodeEngine.triggerHolographicQecSound();
  achievements.unlock('holographic_qec_happy_bulk_reconstruction');
  syncFromEngine();
}

function onFractionChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicQuantumErrorCorrectionCodeEngine.setBoundarySubregionFraction(val);
  achievements.unlock('holographic_qec_happy_bulk_reconstruction');
  syncFromEngine();
}

function onErasureChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicQuantumErrorCorrectionCodeEngine.setBoundaryErasureRate(val);
  achievements.unlock('holographic_qec_happy_bulk_reconstruction');
  syncFromEngine();
}

function triggerSound(): void {
  holographicQuantumErrorCorrectionCodeEngine.triggerHolographicQecSound();
  achievements.unlock('holographic_qec_happy_bulk_reconstruction');
}

function resetEngine(): void {
  holographicQuantumErrorCorrectionCodeEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setHolographicQecBulkModal(false);
}

onMounted(() => {
  achievements.unlock('holographic_qec_happy_bulk_reconstruction');
  syncTimer = setInterval(syncFromEngine, 80);
});

onUnmounted(() => {
  if (syncTimer) clearInterval(syncTimer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 18, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(940px, 95vw);
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #07111e 0%, #0e1e2e 100%);
  border: 1px solid rgba(52, 211, 153, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(52, 211, 153, 0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #34d399;
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #ecfdf5;
}
.subtitle {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.kpi-box {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.kpi-label {
  font-size: 11px;
  color: #94a3b8;
}
.kpi-value {
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 2px;
}
.kpi-sub {
  font-size: 10px;
  color: #64748b;
}
.highlight-cyan { color: #38bdf8; }
.highlight-amber { color: #facc15; }
.highlight-emerald { color: #34d399; }
.highlight-violet { color: #c084fc; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.hqec-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 12px;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 10px;
  padding: 8px 10px;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
}
.regime-btn.active {
  border-color: #34d399;
  background: rgba(52, 211, 153, 0.16);
}
.reg-Info strong {
  display: block;
  font-size: 12px;
}
.reg-Info small {
  font-size: 10px;
  color: #94a3b8;
}
.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.55);
  padding: 12px;
  border-radius: 10px;
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}
.slider-group input[type='range'] {
  width: 100%;
}
.accent-cyan { color: #38bdf8; }
.accent-amber { color: #facc15; }
.action-row {
  display: flex;
  gap: 10px;
}
.action-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  border: none;
}
.action-btn.primary {
  background: linear-gradient(90deg, #059669, #0284c7);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
