<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 63 // O(d,d) DOUBLE FIELD THEORY &amp; NON-GEOMETRIC R-FLUX</span>
          <h2>🕸️ 弦論 T-對偶雙場論與非幾何 R-磁通量子時空</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="dft-flux-svg">
            <defs>
              <radialGradient id="dftTorusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(56, 189, 248, 0.36)" />
                <stop offset="65%" stop-color="rgba(250, 204, 21, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#dftTorusGlow)" />

            <!-- Doubled torus T^{2d} momentum ring x^μ and winding ring x̃_μ -->
            <circle
              cx="165"
              cy="160"
              r="50"
              fill="none"
              stroke="rgba(56, 189, 248, 0.7)"
              stroke-width="2"
            />
            <circle
              cx="165"
              cy="160"
              r="82"
              fill="none"
              stroke="rgba(250, 204, 21, 0.6)"
              stroke-width="1.8"
              stroke-dasharray="5 3"
            />
            <circle
              cx="165"
              cy="160"
              r="98"
              fill="none"
              stroke="rgba(244, 63, 94, 0.45)"
              stroke-width="1.5"
              stroke-dasharray="3 3"
            />

            <!-- O(d,d) T-duality Buscher mapping spokes -->
            <line
              v-for="node in state.doubledNodes"
              :key="'buscher-' + node.id"
              x1="165"
              y1="160"
              :x2="node.x"
              :y2="node.y"
              stroke="rgba(56, 189, 248, 0.22)"
              stroke-width="1.2"
            />

            <!-- Momentum x^μ, Winding x̃_μ & Non-associative R^{ijk} triad nodes -->
            <g v-for="node in state.doubledNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.dualityFrameType === 'nonassociative-r-triad' ? 7 : 5.5"
                :fill="sectorColor(node.dualityFrameType)"
                stroke="#0f172a"
                stroke-width="1.3"
              />
              <text
                v-if="node.id % 2 === 0"
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ sectorLabel(node.dualityFrameType) }}
              </text>
            </g>

            <text x="14" y="22" fill="#7dd3fc" font-size="10" font-family="monospace">
              H_abc → f^a_bc → Q_c^{ab} → R^{abc} | [x^i, x^j, x^k] = l_s⁴ R^{ijk}
            </text>
            <text x="14" y="308" fill="#fde047" font-size="10" font-family="monospace">
              Step={{ chainName(state.tDualityBuscherChainStep) }} | |[x¹,x²,x³]|={{ state.jacobiatorNonAssociativity.toFixed(2) }} | ΔV_min={{ state.minimumQuantumVolumeLs3.toFixed(2) }} l_s³
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">三元雅可比子 |[x¹,x²,x³]|</span>
              <span class="m-val gold">{{ state.jacobiatorNonAssociativity.toFixed(2) }} l_s³</span>
            </div>
            <div class="metric-box">
              <span class="m-label">最小量子體積元 ΔV_min</span>
              <span class="m-val cyan">{{ state.minimumQuantumVolumeLs3.toFixed(2) }} l_s³</span>
            </div>
            <div class="metric-box">
              <span class="m-label">截面條件破缺指數 ∂_x ∂̃_x</span>
              <span class="m-val rose">{{ (state.sectionConditionViolationIndex * 100).toFixed(1) }} %</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Buscher T-對偶磁通階數</span>
              <span class="m-val emerald">{{ chainName(state.tDualityBuscherChainStep) }}</span>
            </div>
          </div>

          <div class="regime-group">
            <label>雙倍環面 T-對偶磁通鏈演化體制</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimes"
                :key="opt.id"
                :class="['regime-btn', { active: state.activeRegime === opt.id }]"
                @click="selectRegime(opt.id)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>非幾何 R-磁通量子數 R^{xyz} l_s²</span>
              <span class="slider-val">{{ state.nonGeometricRFluxQuantum.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="6.00"
              step="0.10"
              :value="state.nonGeometricRFluxQuantum"
              @input="onRFluxChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>O(d,d) 動量-纏繞座標混合角 θ_{O(d,d)}</span>
              <span class="slider-val">{{ state.windingMomentumMixAngleDeg.toFixed(1) }}°</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="90.0"
              step="1.0"
              :value="state.windingMomentumMixAngleDeg"
              @input="onAngleChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發動量-纏繞 T-對偶互換與非結合 R-磁通共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置雙場論磁通腔
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
  doubleFieldTheoryNonGeometricFluxEngine,
  type DoubleFieldTheoryRegime
} from '../engine/doubleFieldTheoryNonGeometricFlux';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(doubleFieldTheoryNonGeometricFluxEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: DoubleFieldTheoryRegime; label: string }[] = [
  { id: 'kalb-ramond-h-flux-geometric-torus', label: 'H_xyz 幾何 Kalb-Ramond 環面' },
  { id: 'twisted-torus-metric-f-flux-frame', label: 'f^x_yz 扭曲環面幾何通量' },
  { id: 'monodromy-t-fold-nongeometric-q-flux', label: 'Q_z^{xy} 全局非幾何 T-Fold' },
  { id: 'locally-nongeometric-nonassociative-r-flux', label: 'R^{xyz} 局域非幾何非結合相' }
];

function sectorColor(s: string): string {
  if (s === 'nonassociative-r-triad') return '#fb7185';
  if (s === 'winding-tilde-x-sector') return '#facc15';
  return '#38bdf8';
}

function sectorLabel(s: string): string {
  if (s === 'nonassociative-r-triad') return 'R-Triad';
  if (s === 'winding-tilde-x-sector') return 'x̃_μ';
  return 'x^μ';
}

function chainName(step: number): string {
  if (step === 0) return 'H_xyz (Geometric)';
  if (step === 1) return 'f^x_yz (Twisted)';
  if (step === 2) return 'Q_z^{xy} (T-Fold)';
  return 'R^{xyz} (Non-Geom)';
}

function syncState(): void {
  Object.assign(state, doubleFieldTheoryNonGeometricFluxEngine.getState());
}

function selectRegime(regime: DoubleFieldTheoryRegime): void {
  doubleFieldTheoryNonGeometricFluxEngine.setRegime(regime);
  doubleFieldTheoryNonGeometricFluxEngine.triggerDoubleFieldTheorySound();
  achievements.unlock('double_field_theory_non_geometric_r_flux');
  syncState();
}

function onRFluxChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  doubleFieldTheoryNonGeometricFluxEngine.setNonGeometricRFlux(val);
  syncState();
}

function onAngleChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  doubleFieldTheoryNonGeometricFluxEngine.setWindingMomentumMixAngle(val);
  syncState();
}

function triggerSound(): void {
  doubleFieldTheoryNonGeometricFluxEngine.triggerDoubleFieldTheorySound();
  achievements.unlock('double_field_theory_non_geometric_r_flux');
}

function resetEngine(): void {
  doubleFieldTheoryNonGeometricFluxEngine.reset();
  syncState();
}

function close(): void {
  ui.setDoubleFieldTheoryFluxOpen(false);
}

onMounted(() => {
  achievements.unlock('double_field_theory_non_geometric_r_flux');
  timer = setInterval(() => {
    doubleFieldTheoryNonGeometricFluxEngine.update(0.08);
    syncState();
  }, 80);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(920px, 95vw);
  background: linear-gradient(145deg, #0f172a 0%, #090d16 100%);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.25);
  background: rgba(15, 23, 42, 0.7);
}
.badge {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #38bdf8;
  font-family: monospace;
}
.title-group h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #f1f5f9;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  padding: 20px;
}
.viz-panel {
  background: #020617;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dft-flux-svg {
  width: 100%;
  height: auto;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.metric-box {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
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
  margin-top: 4px;
  font-family: monospace;
}
.m-val.gold { color: #facc15; }
.m-val.cyan { color: #38bdf8; }
.m-val.rose { color: #fb7185; }
.m-val.emerald { color: #34d399; }
.regime-group label {
  font-size: 12px;
  color: #cbd5e1;
  display: block;
  margin-bottom: 6px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #cbd5e1;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.regime-btn.active {
  background: rgba(56, 189, 248, 0.2);
  border-color: #38bdf8;
  color: #7dd3fc;
  font-weight: 600;
}
.slider-group {
  background: rgba(15, 23, 42, 0.6);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 6px;
}
.slider-val {
  color: #38bdf8;
  font-family: monospace;
}
.slider-group input[type='range'] {
  width: 100%;
}
.action-row {
  display: flex;
  gap: 10px;
  margin-top: auto;
}
.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn.primary {
  background: linear-gradient(90deg, #0284c7, #ca8a04);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
