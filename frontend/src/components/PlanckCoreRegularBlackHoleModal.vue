<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card pcrbh-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 61 · ASYMPTOTICALLY SAFE PLANCK-CORE REGULAR BLACK HOLE REMNANT</span>
          <h2>🕳️ 漸近安全量子引力普朗克核黑洞殘餘與非奇異正則視界共振器</h2>
          <p class="subtitle">Bonanno-Reuter RG-Improved Metric, De Sitter Core K(0) ≤ K_max, Horizon Merger r_+ = r_- &amp; Zero-Temp Dark-Matter Remnant</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">內外視界間距 (r_+ - r_-)</span>
          <span class="kpi-value highlight-cyan">{{ state.horizonSeparationPlanck.toFixed(2) }} ℓ_Pl</span>
          <span class="kpi-sub">M → M_crit 時雙視界簡併重合</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">修正霍金蒸發溫度 (T_H / T_Pl)</span>
          <span class="kpi-value highlight-amber">{{ state.hawkingTemperaturePlanckRatio.toFixed(4) }}</span>
          <span class="kpi-sub">殘餘極限處表面重力歸零停止蒸發</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">普朗克核有界曲率比 K(0)/K_Pl</span>
          <span class="kpi-value highlight-emerald">{{ state.coreKretschmannBoundedRatio.toFixed(3) }}</span>
          <span class="kpi-sub">消除經典 r=0 奇點，湧現德西特核</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">暗物質黑洞殘餘穩定度</span>
          <span class="kpi-value highlight-violet">{{ (state.remnantStabilityIndex * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">準正則內視界引力回聲駐波保護</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="pcrbh-svg">
            <defs>
              <radialGradient id="pcrbhCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="0.48" />
                <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#050812" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#050812" />
            <circle cx="165" cy="160" r="115" fill="url(#pcrbhCoreGrad)" />

            <!-- Outer Event Horizon r_+ and Inner Cauchy Horizon r_- -->
            <circle cx="165" cy="160" r="56" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.75" />
            <circle
              cx="165"
              cy="160"
              :r="Math.min(106, 58 + state.horizonSeparationPlanck * 3.2)"
              fill="none"
              stroke="#f472b6"
              stroke-width="1.5"
              stroke-dasharray="5 3"
              opacity="0.75"
            />

            <!-- Central Non-Singular De Sitter Planck Core -->
            <circle cx="165" cy="160" r="26" fill="#0f172a" stroke="#10b981" stroke-width="2.2" />
            <text x="165" y="157" fill="#6ee7b7" font-size="8.5" font-weight="bold" text-anchor="middle">dS Core</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">K &lt; ∞</text>

            <!-- 18 Regular Black Hole Horizon & Core Echo Nodes -->
            <g v-for="node in state.horizonNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                r="4.8"
                :fill="node.horizonZone === 'de-sitter-core' ? '#34d399' : node.horizonZone === 'inner-cauchy-horizon' ? '#38bdf8' : '#f472b6'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#6ee7b7" font-size="10" font-weight="bold">
              Bonanno-Reuter Regular Black Hole (M = {{ state.blackHoleMassPlanckRatio.toFixed(2) }} M_Pl)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              r_+ - r_-: {{ state.horizonSeparationPlanck.toFixed(2) }} ℓ_Pl | T_H: {{ state.hawkingTemperaturePlanckRatio.toFixed(4) }} T_Pl
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">漸近安全正則黑洞與普朗克殘餘體制 (Regular BH Regimes)</label>
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
                <span>黑洞質量與普朗克質量比 M / M_Pl (1.15 ~ 12.00)</span>
                <strong class="accent-cyan">{{ state.blackHoleMassPlanckRatio.toFixed(2) }} M_Pl</strong>
              </div>
              <input
                type="range"
                min="1.15"
                max="12.00"
                step="0.05"
                :value="state.blackHoleMassPlanckRatio"
                @input="onMassChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>重整化群紫外跑動修正係數 ω̃ (0.40 ~ 2.50)</span>
                <strong class="accent-emerald">{{ state.rgQuantumParameterOmega.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.40"
                max="2.50"
                step="0.02"
                :value="state.rgQuantumParameterOmega"
                @input="onOmegaChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發內外雙視界重合與普朗克核準正則回聲
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置普朗克核黑洞殘餘
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
  planckCoreRegularBlackHoleRemnantEngine,
  type PlanckCoreRemnantRegime
} from '../engine/planckCoreRegularBlackHoleRemnant';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(planckCoreRegularBlackHoleRemnantEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: PlanckCoreRemnantRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'semiclassical-two-horizon-hawking-evaporation',
    label: '半經典雙視界霍金熱蒸發相',
    desc: 'M ≫ M_Pl，外事件視界與內柯西視界明顯分離，遵循標準霍金輻射',
    icon: '🔥'
  },
  {
    value: 'maximum-hawking-temperature-inflexion-peak',
    label: '霍金溫度反曲極大值轉折點',
    desc: 'M ≈ 2.9 M_Pl，量子引力軟化開始主導，霍金溫度達到有限最高峰',
    icon: '📈'
  },
  {
    value: 'extremal-horizon-merger-planck-remnant',
    label: '極端雙視界重合零溫普朗克殘餘',
    desc: 'r_+ → r_-，T_H → 0 停止蒸發，形成穩定暗物質普朗克核殘餘',
    icon: '🕳️'
  },
  {
    value: 'de-sitter-core-quasinormal-echo-cavity',
    label: '德西特普朗克內核準正則回聲腔',
    desc: '無奇點德西特內核勢壘捕捉引力波，釋放離散準正則回聲脈衝',
    icon: '📡'
  }
];

function syncFromEngine(): void {
  Object.assign(state, planckCoreRegularBlackHoleRemnantEngine.getState());
}

function selectRegime(regime: PlanckCoreRemnantRegime): void {
  planckCoreRegularBlackHoleRemnantEngine.setRegime(regime);
  planckCoreRegularBlackHoleRemnantEngine.triggerPlanckRemnantSound();
  achievements.unlock('planck_core_regular_black_hole_remnant');
  syncFromEngine();
}

function onMassChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  planckCoreRegularBlackHoleRemnantEngine.setBlackHoleMassRatio(val);
  achievements.unlock('planck_core_regular_black_hole_remnant');
  syncFromEngine();
}

function onOmegaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  planckCoreRegularBlackHoleRemnantEngine.setRgQuantumParameter(val);
  achievements.unlock('planck_core_regular_black_hole_remnant');
  syncFromEngine();
}

function triggerSound(): void {
  planckCoreRegularBlackHoleRemnantEngine.triggerPlanckRemnantSound();
  achievements.unlock('planck_core_regular_black_hole_remnant');
}

function resetEngine(): void {
  planckCoreRegularBlackHoleRemnantEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setPlanckCoreBlackHoleRemnantModal(false);
}

onMounted(() => {
  achievements.unlock('planck_core_regular_black_hole_remnant');
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
  background: linear-gradient(145deg, #07121e 0%, #11182c 100%);
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
.pcrbh-svg {
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
.accent-emerald { color: #34d399; }
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
  background: linear-gradient(90deg, #059669, #db2777);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
