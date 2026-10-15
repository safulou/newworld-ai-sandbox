<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>量子渦旋霍爾效應與雙重超流反應堆</h2>
            <p class="subtitle">Quantum Vortex Hall Effect & Particle-Vortex Duality in Rotating Superfluids</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="vortex-svg">
            <defs>
              <linearGradient id="vortexBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#030712" />
                <stop offset="50%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#020617" />
              </linearGradient>
              <radialGradient id="vortexCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="60%" stop-color="#0ea5e9" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0" />
              </radialGradient>
              <filter id="glowVortex">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Superfluid Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#vortexBgGrad)" rx="8" />

            <!-- Superfluid Current Flow Streamlines (Horizontal J) -->
            <g opacity="0.35">
              <line
                v-for="i in 9"
                :key="'stream' + i"
                x1="40"
                :y1="i * 36"
                x2="520"
                :y2="i * 36"
                stroke="#38bdf8"
                stroke-width="1.5"
                stroke-dasharray="8 6"
              />
            </g>

            <!-- Pinning Centers (Periodic Potential Wells) -->
            <g opacity="0.45">
              <g v-for="px in 5" :key="'pinx' + px">
                <circle
                  v-for="py in 4"
                  :key="'piny' + py"
                  :cx="60 + px * 85"
                  :cy="50 + py * 65"
                  :r="state.pinningPotentialStrength * 4 + 3"
                  fill="none"
                  stroke="#f43f5e"
                  stroke-dasharray="2 3"
                />
              </g>
            </g>

            <!-- Quantized Vortex Core (Moving with v_L at Hall Angle) -->
            <g :transform="`translate(${getVortexX()}, ${getVortexY()})`">
              <!-- Circulation Swirl Rings -->
              <ellipse
                v-for="r in 4"
                :key="'ring' + r"
                cx="0"
                cy="0"
                :rx="r * 16"
                :ry="r * 16"
                fill="none"
                stroke="#38bdf8"
                stroke-width="1.4"
                stroke-dasharray="4 4"
                :transform="`rotate(${state.timeElapsed * 150 * state.vortexCirculationKappa}, 0, 0)`"
              />

              <!-- Core Singularity -->
              <circle cx="0" cy="0" r="10" fill="url(#vortexCoreGlow)" filter="url(#glowVortex)" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />

              <!-- Magnus Force Vector F_M (Perpendicular to relative velocity) -->
              <line
                x1="0"
                y1="0"
                :x2="getMagnusVecX()"
                :y2="getMagnusVecY()"
                stroke="#facc15"
                stroke-width="3"
                filter="url(#glowVortex)"
              />
              <text :x="getMagnusVecX() + 8" :y="getMagnusVecY()" fill="#facc15" font-size="11" font-weight="bold">
                F_M = {{ state.magnusForceMagnitude.toFixed(2) }}
              </text>

              <!-- Vortex Drift Velocity v_L Vector (At Hall angle) -->
              <line
                x1="0"
                y1="0"
                :x2="getVelocityVecX()"
                :y2="getVelocityVecY()"
                stroke="#10b981"
                stroke-width="2.5"
              />
              <text :x="getVelocityVecX() + 6" :y="getVelocityVecY() + 14" fill="#34d399" font-size="11" font-weight="bold">
                v_L (θ_H={{ state.hallAngleDeg.toFixed(1) }}°)
              </text>
            </g>

            <!-- Metrics & Dual Transition Panel (Right Side: 540, 30) -->
            <g transform="translate(540, 30)">
              <rect x="0" y="0" width="230" height="300" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="115" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                渦旋霍爾偏轉與對偶態
              </text>

              <!-- Hall Angle Gauge -->
              <g transform="translate(20, 50)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">渦旋霍爾角 θ_H</text>
                <text x="0" y="22" fill="#38bdf8" font-size="16" font-weight="bold" font-family="monospace">
                  {{ state.hallAngleDeg.toFixed(1) }}°
                </text>
                <text x="0" y="38" fill="#64748b" font-size="10">tan(θ_H) = ρ_s κ / η_drag</text>
              </g>

              <!-- Vortex Hall Conductivity -->
              <g transform="translate(20, 115)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">反常渦旋霍爾電導 σ_VH</text>
                <rect x="0" y="10" width="190" height="14" fill="#1e293b" rx="4" />
                <rect
                  x="0"
                  y="10"
                  :width="state.vortexHallConductivity * 190"
                  height="14"
                  fill="#38bdf8"
                  rx="4"
                />
                <text x="95" y="22" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  {{ (state.vortexHallConductivity * 100).toFixed(1) }}% ({{ state.vortexHallConductivity.toFixed(2) }} e²/h)
                </text>
              </g>

              <!-- Vortex Drift Velocity -->
              <g transform="translate(20, 175)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">縱向消散漂移速度 v_L</text>
                <text x="0" y="20" fill="#10b981" font-size="15" font-family="monospace">
                  {{ state.vortexVelocityVL.toFixed(2) }} mm/s
                </text>
                <text x="0" y="36" fill="#64748b" font-size="10">
                  {{ state.vortexVelocityVL === 0 ? '✓ 零耗散超流針扎' : '渦旋運動產生相滑耗散' }}
                </text>
              </g>

              <!-- Pinning Status Banner -->
              <g transform="translate(20, 235)">
                <rect
                  x="0"
                  y="0"
                  width="190"
                  height="38"
                  :fill="state.vortexVelocityVL === 0 ? '#064e3b' : '#312e81'"
                  :stroke="state.vortexVelocityVL === 0 ? '#10b981' : '#6366f1'"
                  rx="4"
                />
                <text x="95" y="16" fill="#ffffff" font-size="11" text-anchor="middle" font-weight="bold">
                  {{ state.vortexVelocityVL === 0 ? '✓ 臨界針扎無損超流' : '自由渦旋霍爾漂移流' }}
                </text>
                <text x="95" y="30" fill="#94a3b8" font-size="9" text-anchor="middle">
                  針扎強度 V_pin = {{ state.pinningPotentialStrength.toFixed(2) }} meV
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">超流體密度 ρ_s</span>
            <span class="value">{{ state.superfluidDensityRhoS.toFixed(2) }}</span>
            <span class="sub">10¹⁸ m⁻²</span>
          </div>
          <div class="metric-card">
            <span class="label">馬格納斯力 F_M</span>
            <span class="value">{{ state.magnusForceMagnitude.toFixed(2) }}</span>
            <span class="sub">10⁻¹² N/m (勞侖茲對偶)</span>
          </div>
          <div class="metric-card">
            <span class="label">霍爾偏轉角 θ_H</span>
            <span class="value highlight">{{ state.hallAngleDeg.toFixed(1) }}°</span>
            <span class="sub">橫向幾何偏轉</span>
          </div>
          <div class="metric-card">
            <span class="label">超流相態機制</span>
            <span class="value">
              {{ getRegimeLabel(state.regime) }}
            </span>
            <span class="sub">v_L = {{ state.vortexVelocityVL.toFixed(2) }} mm/s</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>超流體密度 ρ_s:</label>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              :value="state.superfluidDensityRhoS"
              @input="onDensityChange"
            />
            <span class="range-val">{{ state.superfluidDensityRhoS.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>外加傳輸電流 J (A/m):</label>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              :value="state.appliedCurrentDensity"
              @input="onCurrentChange"
            />
            <span class="range-val">{{ state.appliedCurrentDensity.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>介質摩擦拖曳係數 η:</label>
            <input
              type="range"
              min="0.05"
              max="2.5"
              step="0.05"
              :value="state.dragCoefficientEta"
              @input="onDragChange"
            />
            <span class="range-val">{{ state.dragCoefficientEta.toFixed(2) }}</span>
          </div>

          <div class="control-row">
            <label>針扎勢能強度 V_pin:</label>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              :value="state.pinningPotentialStrength"
              @input="onPinningChange"
            />
            <span class="range-val">{{ state.pinningPotentialStrength.toFixed(1) }}</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'vortex-hall-flow' }"
              @click="setRegime('vortex-hall-flow')"
            >
              渦旋霍爾流動相
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'zero-dissipation-pinned' }"
              @click="setRegime('zero-dissipation-pinned')"
            >
              零耗散超流針扎態
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'vortex-liquid-nematic' }"
              @click="setRegime('vortex-liquid-nematic')"
            >
              渦旋熔化液晶態
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'dual-insulator-transition' }"
              @click="setRegime('dual-insulator-transition')"
            >
              對偶超導-絕緣相變
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerDepinning">
              🌀 激發渦旋脫釘噴發音律
            </button>
            <button class="action-btn secondary" @click="cycleRegime">
              🔄 輪換雙重超流體制
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { quantumVortexHallEngine, type QuantumVortexHallState, type VortexHallRegime } from '../engine/quantumVortexHallSuperfluid';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<QuantumVortexHallState>(quantumVortexHallEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = quantumVortexHallEngine.getState();
};

onMounted(() => {
  achievements.unlock('quantum_vortex_hall_superfluid');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeOverlay();
};

const onDensityChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumVortexHallEngine.setSuperfluidDensity(val);
  refresh();
};

const onCurrentChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumVortexHallEngine.setAppliedCurrent(val);
  refresh();
};

const onDragChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumVortexHallEngine.setDragCoefficient(val);
  refresh();
};

const onPinningChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quantumVortexHallEngine.setPinningStrength(val);
  refresh();
};

const setRegime = (regime: VortexHallRegime) => {
  quantumVortexHallEngine.setRegime(regime);
  refresh();
};

const cycleRegime = () => {
  quantumVortexHallEngine.cycleRegime();
  refresh();
};

const triggerDepinning = () => {
  quantumVortexHallEngine.triggerVortexDepinningBurst();
  refresh();
};

const getVortexX = () => {
  if (state.value.vortexVelocityVL === 0) return 260;
  return 100 + ((state.value.timeElapsed * state.value.vortexVelocityVL * 25) % 360);
};

const getVortexY = () => {
  if (state.value.vortexVelocityVL === 0) return 180;
  const rad = (state.value.hallAngleDeg * Math.PI) / 180.0;
  return 180 - Math.sin(rad) * 45 * Math.sin(state.value.timeElapsed * 2.0);
};

const getMagnusVecX = () => {
  return 0;
};

const getMagnusVecY = () => {
  return -state.value.magnusForceMagnitude * 12.0;
};

const getVelocityVecX = () => {
  const rad = (state.value.hallAngleDeg * Math.PI) / 180.0;
  return Math.cos(rad) * state.value.vortexVelocityVL * 14.0 + 35;
};

const getVelocityVecY = () => {
  const rad = (state.value.hallAngleDeg * Math.PI) / 180.0;
  return -Math.sin(rad) * state.value.vortexVelocityVL * 14.0;
};

const getRegimeLabel = (regime: VortexHallRegime) => {
  switch (regime) {
    case 'vortex-hall-flow': return '渦旋霍爾流動';
    case 'zero-dissipation-pinned': return '零耗散超流針扎';
    case 'vortex-liquid-nematic': return '渦旋熔化液晶';
    case 'dual-insulator-transition': return '對偶絕緣相變';
    default: return regime;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  width: 92%;
  max-width: 900px;
  background: #0b0f19;
  border: 1px solid #1e293b;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  padding: 16px 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 18px;
  margin: 0;
  color: #f1f5f9;
  font-weight: 600;
}

.subtitle {
  font-size: 11px;
  margin: 2px 0 0 0;
  color: #64748b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #f87171;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #050814;
  border: 1px solid #1e293b;
}

.vortex-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.metric-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}

.metric-card .label {
  font-size: 11px;
  color: #94a3b8;
}

.metric-card .value {
  font-size: 17px;
  font-weight: bold;
  color: #38bdf8;
  font-family: monospace;
  margin-top: 4px;
}

.metric-card .value.highlight {
  color: #10b981;
}

.metric-card .sub {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #0f172a;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-row label {
  font-size: 12px;
  color: #cbd5e1;
  width: 170px;
}

.control-row input[type='range'] {
  flex: 1;
}

.range-val {
  font-size: 12px;
  font-family: monospace;
  color: #38bdf8;
  width: 60px;
  text-align: right;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.regime-btn {
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 6px;
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.regime-btn.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #38bdf8;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.action-btn {
  flex: 1;
  padding: 9px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #0284c7;
  color: white;
}

.action-btn.primary:hover {
  background: #0369a1;
}

.action-btn.secondary {
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
}

.action-btn.secondary:hover {
  background: #334155;
}
</style>
