<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">✨</span>
          <div>
            <h2>量子極化拓撲光子晶格</h2>
            <p class="subtitle">Microcavity Polariton Kagome Lattice, TE-TM Splitting & Flatband Laser</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="polariton-svg">
            <defs>
              <linearGradient id="polaritonBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#02141a" />
                <stop offset="50%" stop-color="#052530" />
                <stop offset="100%" stop-color="#010d12" />
              </linearGradient>

              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#22d3ee" stop-opacity="1" />
                <stop offset="50%" stop-color="#0891b2" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#164e63" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowPolariton">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#polaritonBg)" rx="8" />

            <!-- Photonic Mesh Lines -->
            <g opacity="0.12">
              <line v-for="x in 16" :key="'gx' + x" :x1="x * 50" y1="0" :x2="x * 50" y2="360" stroke="#06b6d4" stroke-dasharray="2 4" />
              <line v-for="y in 7" :key="'gy' + y" x1="0" :y1="y * 50" x2="800" :y2="y * 50" stroke="#06b6d4" stroke-dasharray="2 4" />
            </g>

            <!-- Kagome Photonic Lattice (Center-Left) -->
            <g transform="translate(100, 30)">
              <!-- Hopping Links Between Lattice Nodes -->
              <g v-for="(n1, i) in state.nodes" :key="'link-' + i">
                <g v-for="(n2, j) in state.nodes" :key="'link-' + i + '-' + j">
                  <line
                    v-if="j === (i + 1) % state.nodes.length || (i % 2 === 0 && j === (i + 6) % state.nodes.length)"
                    :x1="n1.x"
                    :y1="n1.y"
                    :x2="n2.x"
                    :y2="n2.y"
                    stroke="#0891b2"
                    :stroke-width="1.5 + state.chiralEdgeCurrent * 1.5"
                    :opacity="0.35 + state.polaritonLasingCoherence * 0.45"
                    filter="url(#glowPolariton)"
                  />
                </g>
              </g>

              <!-- Polariton Kagome Nodes -->
              <g v-for="n in state.nodes" :key="'pol-' + n.id">
                <circle
                  :cx="n.x"
                  :cy="n.y"
                  :r="8 + n.intensity * 8"
                  fill="url(#nodeGlow)"
                  filter="url(#glowPolariton)"
                  :opacity="0.6 + 0.4 * Math.sin(animTick * 3 + n.id)"
                />
                <circle :cx="n.x" :cy="n.y" r="3" fill="#ffffff" />

                <!-- Pseudospin Polarization Pointer -->
                <line
                  :x1="n.x"
                  :y1="n.y"
                  :x2="n.x + 12 * Math.cos(n.spinPseudospinRad)"
                  :y2="n.y - 12 * Math.sin(n.spinPseudospinRad)"
                  stroke="#a5f3fc"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />

                <!-- Flatband Indicator Marker -->
                <circle
                  v-if="n.isFlatBandLocked && state.activeRegime === 'flatband-condensation-laser'"
                  :cx="n.x"
                  :cy="n.y"
                  r="16"
                  fill="none"
                  stroke="#facc15"
                  stroke-width="1.5"
                  stroke-dasharray="2 3"
                />
              </g>
            </g>

            <!-- Flatband Coherence Meter (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="90" fill="#062633" rx="6" stroke="#0891b2" stroke-width="1" />
              <text x="15" y="24" fill="#cffafe" font-size="12" font-weight="bold">平帶凝聚相干度 (C_laser)</text>
              <text x="15" y="56" fill="#22d3ee" font-size="24" font-weight="bold" font-family="monospace">
                {{ (state.polaritonLasingCoherence * 100).toFixed(1) }}%
              </text>
              <rect x="15" y="66" width="180" height="8" fill="#164e63" rx="3" />
              <rect x="15" y="66" :width="180 * state.polaritonLasingCoherence" height="8" fill="#22d3ee" rx="3" />
            </g>

            <!-- Flatband Dispersion Slope & Edge Current (Middle Right) -->
            <g transform="translate(565, 135)">
              <rect x="0" y="0" width="210" height="90" fill="#062633" rx="6" stroke="#0891b2" stroke-width="1" />
              <text x="15" y="22" fill="#cffafe" font-size="12" font-weight="bold">能帶色散與手性邊緣流</text>
              <text x="15" y="46" fill="#cbd5e1" font-size="11">
                平帶色散斜率: <tspan fill="#facc15" font-weight="bold">{{ state.flatbandDispersionSlope }}</tspan>
              </text>
              <text x="15" y="66" fill="#cbd5e1" font-size="11">
                手性邊緣流: <tspan fill="#38bdf8" font-weight="bold">{{ (state.chiralEdgeCurrent * 100).toFixed(0) }}%</tspan>
              </text>
              <text x="15" y="82" fill="#a5f3fc" font-size="10">
                TE-TM 裂分: Δ_LT = {{ state.teTmSplittingDeltaLt }} meV
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#062633" rx="6" stroke="#0891b2" stroke-width="1" />
              <text x="15" y="22" fill="#cffafe" font-size="12" font-weight="bold">微腔光子物理參數</text>
              <text x="15" y="44" fill="#cbd5e1" font-size="11">失諧量 δ: <tspan fill="#38bdf8" font-weight="bold">{{ state.cavityDetuningDelta }} meV</tspan></text>
              <text x="15" y="64" fill="#cbd5e1" font-size="11">泵浦功率 P/P_th: <tspan fill="#f43f5e" font-weight="bold">{{ state.pumpPowerRatioP }}×</tspan></text>
              <text x="15" y="84" fill="#cbd5e1" font-size="11">籠目躍遷 J: <tspan fill="#22d3ee" font-weight="bold">{{ state.kagomeHoppingJ }} meV</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#0e7490" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#cffafe" font-size="12" font-weight="bold">
                當前體制: {{ regimeLabel(state.activeRegime) }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Regime Switching -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            :class="['regime-btn', { active: state.activeRegime === r.id }]"
            @click="selectRegime(r.id)"
          >
            <span class="regime-icon">{{ r.icon }}</span>
            <span class="regime-title">{{ r.name }}</span>
          </button>
        </div>

        <!-- Sliders & Controls -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">激子-光子腔模失諧量 δ (meV)</span>
              <span class="ctrl-value">{{ state.cavityDetuningDelta.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="-10.0"
              max="10.0"
              step="0.2"
              :value="state.cavityDetuningDelta"
              @input="onDetuningChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">光學泵浦注入功率比 P / P_th</span>
              <span class="ctrl-value">{{ state.pumpPowerRatioP.toFixed(2) }}×</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              :value="state.pumpPowerRatioP"
              @input="onPumpPowerChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">TE-TM 自旋軌道有效分裂 Δ_LT (meV)</span>
              <span class="ctrl-value">{{ state.teTmSplittingDeltaLt.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              :value="state.teTmSplittingDeltaLt"
              @input="onSplittingChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 平帶拓撲雷射諧波音</span>
          </button>
          <button class="action-btn reset-btn" @click="resetEngine">
            <span>↺ 恢復預設</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  quantumPolaritonTopologicalLatticeEngine,
  type PolaritonLatticeRegime,
  type PolaritonLatticeState
} from '../engine/quantumPolaritonTopologicalLattice';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<PolaritonLatticeState>({ ...quantumPolaritonTopologicalLatticeEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: PolaritonLatticeRegime; name: string; icon: string }[] = [
  { id: 'linear-photonic-kagome', name: '線性籠目晶格', icon: '🕸️' },
  { id: 'polariton-spin-hall', name: '光學自旋霍爾', icon: '⚛️' },
  { id: 'chiral-edge-soliton', name: '手性邊緣孤子', icon: '🌊' },
  { id: 'flatband-condensation-laser', name: '平帶凝聚雷射', icon: '🎯' }
];

function regimeLabel(regime: PolaritonLatticeRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: PolaritonLatticeRegime): void {
  quantumPolaritonTopologicalLatticeEngine.setRegime(regime);
  syncState();
}

function onDetuningChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumPolaritonTopologicalLatticeEngine.setCavityDetuning(val);
  syncState();
}

function onPumpPowerChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumPolaritonTopologicalLatticeEngine.setPumpPowerRatio(val);
  syncState();
}

function onSplittingChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumPolaritonTopologicalLatticeEngine.setTeTmSplitting(val);
  syncState();
}

function playSound(): void {
  quantumPolaritonTopologicalLatticeEngine.triggerLaserSound();
}

function resetEngine(): void {
  quantumPolaritonTopologicalLatticeEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...quantumPolaritonTopologicalLatticeEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  quantumPolaritonTopologicalLatticeEngine.update(0.016);
  syncState();
  animFrame = requestAnimationFrame(loop);
}

onMounted(() => {
  syncState();
  animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame);
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(1, 10, 14, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2200;
}

.modal-card {
  width: 860px;
  max-width: 95vw;
  max-height: 94vh;
  background: #021a22;
  border: 1px solid #0891b2;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(6, 182, 212, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f1f5f9;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #042633;
  border-bottom: 1px solid #0e7490;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap .icon {
  font-size: 28px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 1.15rem;
  color: #cffafe;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #22d3ee;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.close-btn:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #0e7490;
}

.polariton-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.regime-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: #083344;
  border: 1px solid #0e7490;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #0e4e66;
  border-color: #22d3ee;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  border-color: #cffafe;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #042633;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #0e7490;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-group {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.ctrl-label {
  color: #cbd5e1;
}

.ctrl-value {
  color: #22d3ee;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #06b6d4;
  background: #083344;
  border-radius: 3px;
  cursor: pointer;
}

.action-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sound-btn {
  background: #0e7490;
  border-color: #22d3ee;
  color: #cffafe;
}
.sound-btn:hover {
  background: #0891b2;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}

.reset-btn {
  background: #1e1b4b;
  border-color: #4338ca;
  color: #cbd5e1;
}
.reset-btn:hover {
  background: #312e81;
}
</style>
