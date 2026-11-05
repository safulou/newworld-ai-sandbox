<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card dspatch-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 60 · HOLOGRAPHIC DE SITTER STATIC PATCH &amp; COSMOLOGICAL ISLAND</span>
          <h2>🌅 全息德西特靜止塊體視界熱化與宇宙學糾纏島嶼</h2>
          <p class="subtitle">dS₄/CFT₃ Static Patch, Gibbons-Hawking Temperature T_GH, Type II₁ von Neumann Algebra &amp; Antipodal Island</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">廣義佩奇糾纏熵比 (S_gen / S_dS)</span>
          <span class="kpi-value highlight-amber">{{ state.generalizedPageEntropyRatio.toFixed(3) }}</span>
          <span class="kpi-sub">受宇宙學最大熵 S_dS = πℓ_dS²/G_N 限制</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">對蹠宇宙學糾纏島嶼覆蓋率</span>
          <span class="kpi-value highlight-cyan">{{ state.antipodalIslandCoveragePct.toFixed(1) }}%</span>
          <span class="kpi-sub">t / t_Page = {{ state.observerPageTimeRatio.toFixed(2) }} QES 成核</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">吉本斯-霍金視界溫度 (T_GH)</span>
          <span class="kpi-value highlight-emerald">{{ state.gibbonsHawkingTempMeV.toFixed(2) }}</span>
          <span class="kpi-sub">T_GH = 1 / (2π ℓ_dS) 視界熱浴</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">馮·諾伊曼 II₁ 型代數跡指標</span>
          <span class="kpi-value highlight-violet">{{ state.typeII1TracePurityIndex.toFixed(3) }}</span>
          <span class="kpi-sub">Type II₁ Factor 最大熵正規化跡態</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="dspatch-svg">
            <defs>
              <radialGradient id="dspatchGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.38" />
                <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <!-- De Sitter Penrose Square Boundary -->
            <rect x="45" y="40" width="240" height="240" fill="url(#dspatchGlow)" stroke="#94a3b8" stroke-width="1.5" />

            <!-- Bifurcate Cosmological Event Horizons (Diagonal Null Rays) -->
            <line x1="45" y1="40" x2="285" y2="280" stroke="#facc15" stroke-width="1.6" stroke-dasharray="5 3" />
            <line x1="45" y1="280" x2="285" y2="40" stroke="#facc15" stroke-width="1.6" stroke-dasharray="5 3" />

            <!-- Bifurcation QES Surface at Center -->
            <circle cx="165" cy="160" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
            <text x="165" y="163" fill="#38bdf8" font-size="8.5" font-weight="bold" text-anchor="middle">QES</text>

            <!-- 18 Penrose Static Patch & Antipodal Island Nodes -->
            <g v-for="node in state.penroseNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.patchRegion === 'pode-observer' ? '#34d399' : node.patchRegion === 'horizon-qes' ? '#facc15' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#fde047" font-size="10" font-weight="bold">
              dS₄ Penrose Diagram: Pode (L) ↔ QES ↔ Antipodal Island (R)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              ℓ_dS/ℓ_Pl: {{ state.deSitterRadiusPlanckRatio.toFixed(1) }} | Island: {{ state.antipodalIslandCoveragePct.toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">德西特靜止塊體全息與宇宙島嶼體制 (dS Static-Patch Regimes)</label>
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
                <span>德西特視界半徑比 ℓ_dS / ℓ_Pl (5.0 ~ 60.0)</span>
                <strong class="accent-amber">{{ state.deSitterRadiusPlanckRatio.toFixed(1) }}</strong>
              </div>
              <input
                type="range"
                min="5.0"
                max="60.0"
                step="0.5"
                :value="state.deSitterRadiusPlanckRatio"
                @input="onRadiusChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>觀測者演化時間與佩奇時間比 t / t_Page (0.10 ~ 2.50)</span>
                <strong class="accent-cyan">{{ state.observerPageTimeRatio.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="2.50"
                step="0.05"
                :value="state.observerPageTimeRatio"
                @input="onTimeChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發南極觀測者與對蹠宇宙島嶼 QES 共軛雙音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置德西特靜止塊體態
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
  holographicDeSitterStaticPatchIslandEngine,
  type DeSitterStaticPatchRegime
} from '../engine/holographicDeSitterStaticPatchIsland';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(holographicDeSitterStaticPatchIslandEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: DeSitterStaticPatchRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'pre-page-gibbons-hawking-thermal-bath',
    label: '佩奇時間前吉本斯-霍金熱浴',
    desc: 't < t_Page，無島嶼成核，視界輻射糾纏熵隨時間線性增長',
    icon: '🌡️'
  },
  {
    value: 'type-ii1-von-neumann-maximal-entropy-state',
    label: '馮·諾伊曼 II₁ 型最大熵半經典態',
    desc: 't ≈ t_Page，達到德西特最大熵界限 S_dS = πℓ_dS²/G_N',
    icon: '📐'
  },
  {
    value: 'antipodal-cosmological-island-nucleation',
    label: '對蹠靜止塊體宇宙學糾纏島嶼',
    desc: 't > t_Page，量子極值曲面 QES 成核對蹠島嶼使佩奇曲線折返',
    icon: '🌅'
  },
  {
    value: 'stretched-horizon-hyperfast-scrambling',
    label: '拉伸視界超快量子資訊混洗',
    desc: '小半徑高溫德西特視界展現 O(1) 時間尺度超快非局域混洗',
    icon: '⚡'
  }
];

function syncFromEngine(): void {
  Object.assign(state, holographicDeSitterStaticPatchIslandEngine.getState());
}

function selectRegime(regime: DeSitterStaticPatchRegime): void {
  holographicDeSitterStaticPatchIslandEngine.setRegime(regime);
  holographicDeSitterStaticPatchIslandEngine.triggerDeSitterHorizonSound();
  achievements.unlock('holographic_desitter_static_patch_island');
  syncFromEngine();
}

function onRadiusChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicDeSitterStaticPatchIslandEngine.setDeSitterRadiusRatio(val);
  achievements.unlock('holographic_desitter_static_patch_island');
  syncFromEngine();
}

function onTimeChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicDeSitterStaticPatchIslandEngine.setObserverPageTimeRatio(val);
  achievements.unlock('holographic_desitter_static_patch_island');
  syncFromEngine();
}

function triggerSound(): void {
  holographicDeSitterStaticPatchIslandEngine.triggerDeSitterHorizonSound();
  achievements.unlock('holographic_desitter_static_patch_island');
}

function resetEngine(): void {
  holographicDeSitterStaticPatchIslandEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setHolographicDeSitterPatchModal(false);
}

onMounted(() => {
  achievements.unlock('holographic_desitter_static_patch_island');
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
  background: linear-gradient(145deg, #130e1c 0%, #1d152a 100%);
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(250, 204, 21, 0.2);
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
  color: #facc15;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fef9c3;
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
.dspatch-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(250, 204, 21, 0.3);
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
  border-color: #facc15;
  background: rgba(250, 204, 21, 0.16);
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
  background: linear-gradient(90deg, #d97706, #0284c7);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
