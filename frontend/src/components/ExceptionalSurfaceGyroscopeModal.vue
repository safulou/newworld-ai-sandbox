<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card es3-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 58 · NON-HERMITIAN EXCEPTIONAL-SURFACE GYROSCOPE</span>
          <h2>🧭 非厄米三階奇異點表面量子塞格奈克陀螺儀</h2>
          <p class="subtitle">Third-Order Exceptional Surface (ES₃) Cube-Root Splitting Δω ∝ Ω^(1/3), PT Symmetry &amp; Sagnac Enhancement</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">奇異本徵頻率劈裂 (Δω_ES / 2π)</span>
          <span class="kpi-value highlight-cyan">{{ state.eigenfrequencySplittingKhz.toFixed(1) }} kHz</span>
          <span class="kpi-sub">ES_{{ state.exceptionalOrderN }} 階非解析根號劈裂</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">塞格奈克靈敏度放大 (G_ES)</span>
          <span class="kpi-value highlight-amber">{{ state.sensitivityEnhancementFactor.toFixed(1) }}×</span>
          <span class="kpi-sub">對比傳統厄米微環線性陀螺儀</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">奇異點簡併階數 (Order N)</span>
          <span class="kpi-value highlight-emerald">EP_{{ state.exceptionalOrderN }}</span>
          <span class="kpi-sub">Δω ∝ (Ω_rot)^(1/{{ state.exceptionalOrderN }})</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Petermann 線寬因子 (K_P)</span>
          <span class="kpi-value highlight-violet">{{ state.petermannLinewidthFactor.toFixed(1) }}</span>
          <span class="kpi-sub">非正交本徵雙正交重疊度</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="es3-svg">
            <defs>
              <radialGradient id="es3CoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.48" />
                <stop offset="55%" stop-color="#ec4899" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#es3CoreGrad)" />

            <!-- 3-Sheeted Riemann Surface Branch Cuts -->
            <circle cx="165" cy="160" r="52" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55" />
            <circle cx="165" cy="160" r="78" fill="none" stroke="#f472b6" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.55" />
            <circle cx="165" cy="160" r="102" fill="none" stroke="#facc15" stroke-width="1.2" stroke-dasharray="6 3" opacity="0.55" />

            <!-- Central Exceptional Surface Degeneracy Singularity -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
            <text x="165" y="157" fill="#fb7185" font-size="9" font-weight="bold" text-anchor="middle">ES_{{ state.exceptionalOrderN }}</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">Ω^(1/{{ state.exceptionalOrderN }})</text>

            <!-- 18 Riemann Sheet Eigenmode Nodes -->
            <g v-for="node in state.riemannNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.sheetBranchIndex === 1 ? '#38bdf8' : node.sheetBranchIndex === 2 ? '#f472b6' : '#facc15'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.2"
                :fill="node.sheetBranchIndex === 1 ? '#38bdf8' : node.sheetBranchIndex === 2 ? '#f472b6' : '#facc15'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#7dd3fc" font-size="10" font-weight="bold">
              ES₃ Riemann Hypersurface (Ω_rot = {{ state.rotationRateRadPerSec.toFixed(3) }} rad/s)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | Gain: {{ state.sensitivityEnhancementFactor.toFixed(1) }}×
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">非厄米奇異點塞格奈克工作體制 (Exceptional Gyro Regimes)</label>
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
                <span>塞格奈克旋轉角速度微擾 Ω_rot (0.001 ~ 2.000 rad/s)</span>
                <strong class="accent-cyan">{{ state.rotationRateRadPerSec.toFixed(3) }} rad/s</strong>
              </div>
              <input
                type="range"
                min="0.001"
                max="2.000"
                step="0.001"
                :value="state.rotationRateRadPerSec"
                @input="onOmegaChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>非厄米 PT 增益-損耗平衡比 γ_PT / J (0.10 ~ 2.00)</span>
                <strong class="accent-amber">{{ state.nonHermitianGainLossGamma.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="2.00"
                step="0.02"
                :value="state.nonHermitianGainLossGamma"
                @input="onGammaChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 ES₃ 立方根三葉黎曼曲面拍頻音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置三階奇異點表面態
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
  nonHermitianExceptionalSurfaceGyroscopeEngine,
  type ExceptionalSurfaceGyroRegime
} from '../engine/nonHermitianExceptionalSurfaceGyroscope';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(nonHermitianExceptionalSurfaceGyroscopeEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: ExceptionalSurfaceGyroRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'hermitian-linear-sagnac-ring',
    label: '傳統厄米線性塞格奈克環',
    desc: 'Order N=1，頻率劈裂 Δω ∝ Ω_rot 線性響應',
    icon: '⭕'
  },
  {
    value: 'pt-symmetric-ep2-square-root-split',
    label: 'PT 對稱二階奇異點 (EP₂)',
    desc: 'Order N=2，平方根劈裂 Δω ∝ √Ω_rot 增強',
    icon: '⚖️'
  },
  {
    value: 'chiral-exceptional-surface-es3-cube-root',
    label: '手性三階奇異點超曲面 (ES₃)',
    desc: 'Order N=3，立方根劈裂 Δω ∝ Ω^(1/3) 免疫製程微擾',
    icon: '🧭'
  },
  {
    value: 'petermann-noise-squeezed-quantum-gyro',
    label: 'Petermann 量子壓縮極限陀螺儀',
    desc: '極微弱角速度區間實現 >100× 塞格奈克放大',
    icon: '🔬'
  }
];

function syncFromEngine(): void {
  Object.assign(state, nonHermitianExceptionalSurfaceGyroscopeEngine.getState());
}

function selectRegime(regime: ExceptionalSurfaceGyroRegime): void {
  nonHermitianExceptionalSurfaceGyroscopeEngine.setRegime(regime);
  nonHermitianExceptionalSurfaceGyroscopeEngine.triggerExceptionalGyroSound();
  achievements.unlock('non_hermitian_exceptional_surface_gyro');
  syncFromEngine();
}

function onOmegaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonHermitianExceptionalSurfaceGyroscopeEngine.setRotationRate(val);
  achievements.unlock('non_hermitian_exceptional_surface_gyro');
  syncFromEngine();
}

function onGammaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonHermitianExceptionalSurfaceGyroscopeEngine.setNonHermitianGainLoss(val);
  achievements.unlock('non_hermitian_exceptional_surface_gyro');
  syncFromEngine();
}

function triggerSound(): void {
  nonHermitianExceptionalSurfaceGyroscopeEngine.triggerExceptionalGyroSound();
  achievements.unlock('non_hermitian_exceptional_surface_gyro');
}

function resetEngine(): void {
  nonHermitianExceptionalSurfaceGyroscopeEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setExceptionalSurfaceGyroModal(false);
}

onMounted(() => {
  achievements.unlock('non_hermitian_exceptional_surface_gyro');
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
  background: linear-gradient(145deg, #090d1f 0%, #161233 100%);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.2);
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
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #e0f2fe;
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
.es3-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(56, 189, 248, 0.3);
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
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.16);
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
  background: linear-gradient(90deg, #0284c7, #db2777);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
