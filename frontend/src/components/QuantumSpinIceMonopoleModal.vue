<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 62 // PYROCHLORE EMERGENT U(1) QED &amp; MONOPOLE PLASMA</span>
          <h2>🧊 非阿貝爾量子自旋冰與湧現規範磁單極子電漿</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="spin-ice-svg">
            <defs>
              <radialGradient id="qsiPhotonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(56, 189, 248, 0.36)" />
                <stop offset="65%" stop-color="rgba(168, 85, 247, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#qsiPhotonGlow)" />

            <!-- Pyrochlore hexagonal ring-exchange loops -->
            <polygon
              points="165,112 207,136 207,184 165,208 123,184 123,136"
              fill="rgba(56, 189, 248, 0.08)"
              stroke="rgba(56, 189, 248, 0.65)"
              stroke-width="2"
            />
            <circle
              cx="165"
              cy="160"
              r="88"
              fill="none"
              stroke="rgba(192, 132, 252, 0.45)"
              stroke-width="1.6"
              stroke-dasharray="5 3"
            />

            <!-- Emergent electric flux Dirac strings between monopoles -->
            <line
              v-for="node in state.tetrahedronNodes"
              :key="'flux-' + node.id"
              x1="165"
              y1="160"
              :x2="node.x"
              :y2="node.y"
              :stroke="node.spinIceRuleConfig === '3-in-1-out-monopole' ? 'rgba(244, 63, 94, 0.45)' : node.spinIceRuleConfig === '1-in-3-out-antimonopole' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.22)'"
              stroke-width="1.3"
            />

            <!-- Pyrochlore tetrahedron & monopole/vison nodes -->
            <g v-for="node in state.tetrahedronNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="5 + node.pinchPointIntensity * 4.5"
                :fill="nodeColor(node.spinIceRuleConfig)"
                stroke="#0f172a"
                stroke-width="1.4"
              />
              <text
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ nodeLabel(node.spinIceRuleConfig) }}
              </text>
            </g>

            <text x="14" y="22" fill="#7dd3fc" font-size="10" font-family="monospace">
              H_ring = -K Σ(S⁺₁S⁻₂S⁺₃S⁻₄S⁺₅S⁻₆ + h.c.) | ∇·E_em = Q_m
            </text>
            <text x="14" y="308" fill="#c084fc" font-size="10" font-family="monospace">
              c_em={{ state.emergentLightSpeedMps.toFixed(1) }} m/s | α_em={{ state.effectiveFineStructureAlpha.toFixed(3) }} | Pinch={{ (state.pinchPointSharpnessRatio * 100).toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">湧現光子群速度 c_em</span>
              <span class="m-val cyan">{{ state.emergentLightSpeedMps.toFixed(1) }} m/s</span>
            </div>
            <div class="metric-box">
              <span class="m-label">湧現精細結構常數 α_em</span>
              <span class="m-val purple">{{ state.effectiveFineStructureAlpha.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">中子散射針尖點銳利度</span>
              <span class="m-val emerald">{{ (state.pinchPointSharpnessRatio * 100).toFixed(1) }}%</span>
            </div>
            <div class="metric-box">
              <span class="m-label">視覺子能隙 Δ_vison</span>
              <span class="m-val gold">{{ state.visonGapEnergyMeV.toFixed(3) }} meV</span>
            </div>
          </div>

          <div class="regime-group">
            <label>焦綠石量子自旋冰與單極電漿相態</label>
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
              <span>量子橫向交換耦合比 J_± / J_zz</span>
              <span class="slider-val">{{ state.transverseExchangeRatioJpm.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.35"
              step="0.005"
              :value="state.transverseExchangeRatioJpm"
              @input="onJpmChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>湧現磁單極子電漿濃度 n_mono</span>
              <span class="slider-val">{{ state.monopolePlasmaDensityPct.toFixed(1) }} %</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="65.0"
              step="0.5"
              :value="state.monopolePlasmaDensityPct"
              @input="onDensityChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發湧現光子與磁單極子電漿共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置焦綠石自旋冰腔
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
  quantumSpinIceMonopolePlasmaEngine,
  type QuantumSpinIceRegime
} from '../engine/quantumSpinIceMonopolePlasma';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(quantumSpinIceMonopolePlasmaEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: QuantumSpinIceRegime; label: string }[] = [
  { id: 'classical-paulings-two-in-two-out-ice', label: '古典二進二出保林冰' },
  { id: 'coherent-u1-quantum-spin-liquid-photon', label: 'U(1) 湧現無能隙光子' },
  { id: 'debye-screened-monopole-plasma-pinch', label: '德拜屏蔽磁單極電漿' },
  { id: 'pi-flux-fractionalized-vison-crystal', label: 'π-磁通分數視覺子晶體' }
];

function nodeColor(cfg: string): string {
  if (cfg === '3-in-1-out-monopole') return '#fb7185';
  if (cfg === '1-in-3-out-antimonopole') return '#38bdf8';
  if (cfg === 'pi-flux-vison') return '#c084fc';
  return '#34d399';
}

function nodeLabel(cfg: string): string {
  if (cfg === '3-in-1-out-monopole') return '+Q_m';
  if (cfg === '1-in-3-out-antimonopole') return '-Q_m';
  if (cfg === 'pi-flux-vison') return 'π-Vison';
  return '2in2out';
}

function syncState(): void {
  Object.assign(state, quantumSpinIceMonopolePlasmaEngine.getState());
}

function selectRegime(regime: QuantumSpinIceRegime): void {
  quantumSpinIceMonopolePlasmaEngine.setRegime(regime);
  quantumSpinIceMonopolePlasmaEngine.triggerQuantumSpinIceSound();
  achievements.unlock('quantum_spin_ice_emergent_monopole_plasma');
  syncState();
}

function onJpmChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumSpinIceMonopolePlasmaEngine.setTransverseExchangeRatio(val);
  syncState();
}

function onDensityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumSpinIceMonopolePlasmaEngine.setMonopolePlasmaDensity(val);
  syncState();
}

function triggerSound(): void {
  quantumSpinIceMonopolePlasmaEngine.triggerQuantumSpinIceSound();
  achievements.unlock('quantum_spin_ice_emergent_monopole_plasma');
}

function resetEngine(): void {
  quantumSpinIceMonopolePlasmaEngine.reset();
  syncState();
}

function close(): void {
  ui.setQuantumSpinIceMonopoleOpen(false);
}

onMounted(() => {
  achievements.unlock('quantum_spin_ice_emergent_monopole_plasma');
  timer = setInterval(() => {
    quantumSpinIceMonopolePlasmaEngine.update(0.08);
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
.spin-ice-svg {
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
.m-val.cyan { color: #38bdf8; }
.m-val.purple { color: #c084fc; }
.m-val.emerald { color: #34d399; }
.m-val.gold { color: #facc15; }
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
  background: linear-gradient(90deg, #0284c7, #7c3aed);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
