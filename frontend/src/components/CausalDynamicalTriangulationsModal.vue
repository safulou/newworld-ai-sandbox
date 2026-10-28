<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card cdt-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 58 · CAUSAL DYNAMICAL TRIANGULATIONS QUANTUM SPACETIME</span>
          <h2>🔺 因果動力學三角剖分量子時空相變與四維德西特湧現</h2>
          <p class="subtitle">Ambjørn-Jurkiewicz-Loll 4-Simplex Path Integral, de Sitter Volume Profile V₃(τ) ∝ cos³(τ/R) &amp; UV d_s → 2</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">宏觀豪斯多夫維度 (d_H)</span>
          <span class="kpi-value highlight-emerald">{{ state.macroscopicHausdorffDimDh.toFixed(2) }} D</span>
          <span class="kpi-sub">德西特相 C_dS 自發湧現 4.00D</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">普朗克短距譜維度 (d_s(0))</span>
          <span class="kpi-value highlight-cyan">{{ state.uvPlanckSpectralDimDs0.toFixed(2) }} D</span>
          <span class="kpi-sub">紫外線動態維度約化 d_s → 2</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">三維空間體積峰值 (V₃(0))</span>
          <span class="kpi-value highlight-amber">{{ state.deSitterThreeVolumePeak.toFixed(1) }}k</span>
          <span class="kpi-sub">N_(4,1) 單純形 cos³(τ/R) 包絡</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">量子體積漲落比 (δV₃ / V₃)</span>
          <span class="kpi-value highlight-violet">{{ (state.quantumVolumeFluctuationDeltaV * 100).toFixed(0) }}%</span>
          <span class="kpi-sub">Regge 量子引力路徑積分漲落</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="cdt-svg">
            <defs>
              <radialGradient id="cdtDeSitterGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#6366f1" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#cdtDeSitterGrad)" />

            <!-- Proper-Time Foliation Horizontal Slices -->
            <line v-for="tIdx in 7" :key="tIdx" x1="55" :y1="35 + tIdx * 32" x2="275" :y2="35 + tIdx * 32" stroke="#1e293b" stroke-width="1" />

            <!-- de Sitter cos^3(tau) Envelope Curves -->
            <path
              d="M 165 35 C 265 95, 265 225, 165 285"
              fill="none"
              stroke="#34d399"
              stroke-width="2"
              stroke-dasharray="4 3"
            />
            <path
              d="M 165 35 C 65 95, 65 225, 165 285"
              fill="none"
              stroke="#34d399"
              stroke-width="2"
              stroke-dasharray="4 3"
            />

            <!-- 16 4-Simplex (4,1) & (3,2) Triangulation Slice Nodes -->
            <g v-for="node in state.simplexNodes" :key="node.id">
              <line
                x1="165"
                :y1="node.y"
                :x2="node.x"
                :y2="node.y"
                stroke="#38bdf8"
                stroke-width="1.2"
                opacity="0.4"
              />
              <polygon
                :points="`${node.x},${node.y - 5} ${node.x + 5},${node.y + 4} ${node.x - 5},${node.y + 4}`"
                :fill="node.simplexType === '4-1' ? '#34d399' : '#818cf8'"
                stroke="#f8fafc"
                stroke-width="0.9"
              />
            </g>

            <text x="12" y="22" fill="#6ee7b7" font-size="10" font-weight="bold">
              CDT 4-Simplex Foliation (κ₀ = {{ state.bareInverseNewtonKappa0.toFixed(2) }}, Δ = {{ state.causalAnisotropyDelta.toFixed(2) }})
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Phase: {{ state.activeRegime }} | d_H = {{ state.macroscopicHausdorffDimDh.toFixed(2) }}D
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">CDT 洛倫茲量子時空四相圖 (CDT Spacetime Phases)</label>
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
                <span>裸逆牛頓耦合常數 κ₀ (0.50 ~ 4.80)</span>
                <strong class="accent-emerald">{{ state.bareInverseNewtonKappa0.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.50"
                max="4.80"
                step="0.05"
                :value="state.bareInverseNewtonKappa0"
                @input="onKappaChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>因果時間-空間各向異性參數 Δ_CDT (0.02 ~ 1.20)</span>
                <strong class="accent-cyan">{{ state.causalAnisotropyDelta.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.02"
                max="1.20"
                step="0.02"
                :value="state.causalAnisotropyDelta"
                @input="onDeltaChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發單純形德西特 4D 湧現共鳴音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置 C_dS 四維德西特宇宙相
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
  causalDynamicalTriangulationsSpacetimeEngine,
  type CdtQuantumSpacetimeRegime
} from '../engine/causalDynamicalTriangulationsSpacetime';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(causalDynamicalTriangulationsSpacetimeEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: CdtQuantumSpacetimeRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'branched-polymer-phase-a',
    label: '相 A：樹枝狀分叉聚合物相',
    desc: '大 κ₀ 區間，時空退化為 d_H ≈ 2 分叉幾何樹',
    icon: '🌿'
  },
  {
    value: 'crumpled-collapsed-phase-b',
    label: '相 B：高維皺縮坍縮相',
    desc: '極小 Δ_CDT，所有單純形凝聚於單一奇異時間片',
    icon: '🕸️'
  },
  {
    value: 'bifurcation-signature-phase-cb',
    label: '相 C_b：拓撲分岔過渡相',
    desc: '空間三維切片出現周期性渦旋分岔結構',
    icon: '🔀'
  },
  {
    value: 'emergent-4d-desitter-universe-cds',
    label: '相 C_dS：四維德西特宇宙相',
    desc: '湧現 d_H = 4.00 宏觀宇宙與 V₃(τ) ∝ cos³(τ/R)',
    icon: '🔺'
  }
];

function syncFromEngine(): void {
  Object.assign(state, causalDynamicalTriangulationsSpacetimeEngine.getState());
}

function selectRegime(regime: CdtQuantumSpacetimeRegime): void {
  causalDynamicalTriangulationsSpacetimeEngine.setRegime(regime);
  causalDynamicalTriangulationsSpacetimeEngine.triggerCdtSpacetimeSound();
  achievements.unlock('causal_dynamical_triangulations_spacetime');
  syncFromEngine();
}

function onKappaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  causalDynamicalTriangulationsSpacetimeEngine.setBareInverseNewtonKappa0(val);
  achievements.unlock('causal_dynamical_triangulations_spacetime');
  syncFromEngine();
}

function onDeltaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  causalDynamicalTriangulationsSpacetimeEngine.setCausalAnisotropyDelta(val);
  achievements.unlock('causal_dynamical_triangulations_spacetime');
  syncFromEngine();
}

function triggerSound(): void {
  causalDynamicalTriangulationsSpacetimeEngine.triggerCdtSpacetimeSound();
  achievements.unlock('causal_dynamical_triangulations_spacetime');
}

function resetEngine(): void {
  causalDynamicalTriangulationsSpacetimeEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setCausalDynamicalTriangulationsModal(false);
}

onMounted(() => {
  achievements.unlock('causal_dynamical_triangulations_spacetime');
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
  background: linear-gradient(145deg, #071319 0%, #101d32 100%);
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
  color: #d1fae5;
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
.cdt-svg {
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
.accent-emerald { color: #34d399; }
.accent-cyan { color: #38bdf8; }
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
  background: linear-gradient(90deg, #059669, #4f46e5);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
