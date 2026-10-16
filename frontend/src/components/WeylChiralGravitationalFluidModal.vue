<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>動態外爾手性引力異常流體</h2>
            <p class="subtitle">Relativistic Weyl Fluid, Mixed Gravitational-Chiral Anomaly & Chiral Vortical Effect</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="fluid-svg">
            <defs>
              <linearGradient id="fluidBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#140317" />
                <stop offset="50%" stop-color="#24072b" />
                <stop offset="100%" stop-color="#0e0110" />
              </linearGradient>

              <radialGradient id="vortexCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
                <stop offset="40%" stop-color="#c026d3" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#4a044e" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowFluid">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#fluidBg)" rx="8" />

            <!-- Spacetime Curvature Torsion Grid -->
            <g opacity="0.15">
              <circle
                v-for="r in 6"
                :key="'curv-' + r"
                cx="240"
                cy="180"
                :r="r * 28 + ((animTick * 20) % 28)"
                fill="none"
                stroke="#d946ef"
                stroke-width="1.2"
                stroke-dasharray="3 3"
              />
            </g>

            <!-- Rotational Weyl Fluid Streamlines (Center Left) -->
            <g transform="translate(90, 30)">
              <!-- Central Vortex Core -->
              <circle
                cx="150"
                cy="150"
                :r="18 + (state.fluidVorticityOmega / 5)"
                fill="url(#vortexCore)"
                filter="url(#glowFluid)"
                :opacity="0.7 + 0.3 * Math.sin(animTick * 4)"
              />
              <circle cx="150" cy="150" r="4" fill="#ffffff" />

              <!-- Tangential Velocity Streamlines -->
              <g v-for="s in state.streamlines" :key="'str-' + s.id">
                <circle
                  :cx="s.x"
                  :cy="s.y"
                  :r="4 + s.curvatureDensity * 1.5"
                  fill="#f472b6"
                  filter="url(#glowFluid)"
                />
                <!-- Velocity Vector Arrow -->
                <line
                  :x1="s.x"
                  :y1="s.y"
                  :x2="s.x + s.vx * 2.5"
                  :y2="s.y + s.vy * 2.5"
                  stroke="#fb7185"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <!-- Chiral Trailing Stream Ribbon -->
                <path
                  :d="`M ${s.x} ${s.y} Q ${150 + (s.x - 150) * 0.7} ${150 + (s.y - 150) * 0.7} 150 150`"
                  fill="none"
                  stroke="#c026d3"
                  stroke-width="1.2"
                  stroke-dasharray="2 4"
                  opacity="0.45"
                />
              </g>
            </g>

            <!-- Chiral Vortical Current Meter (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="90" fill="#200527" rx="6" stroke="#c026d3" stroke-width="1" />
              <text x="15" y="24" fill="#f5d0fe" font-size="12" font-weight="bold">手性渦旋電流 (J_v)</text>
              <text x="15" y="56" fill="#f472b6" font-size="24" font-weight="bold" font-family="monospace">
                {{ state.chiralVorticalCurrent }} × 10⁴ A/m²
              </text>
              <rect x="15" y="66" width="180" height="8" fill="#4a044e" rx="3" />
              <rect x="15" y="66" :width="Math.min(180, (state.chiralVorticalCurrent / 120) * 180)" height="8" fill="#d946ef" rx="3" />
            </g>

            <!-- Thermal Hall & Hall Viscosity (Middle Right) -->
            <g transform="translate(565, 135)">
              <rect x="0" y="0" width="210" height="90" fill="#200527" rx="6" stroke="#c026d3" stroke-width="1" />
              <text x="15" y="22" fill="#f5d0fe" font-size="12" font-weight="bold">量子熱霍爾與奇異黏度</text>
              <text x="15" y="46" fill="#cbd5e1" font-size="11">
                熱霍爾 κ_xy: <tspan fill="#38bdf8" font-weight="bold">{{ state.thermalHallConductivity }} W/m·K</tspan>
              </text>
              <text x="15" y="66" fill="#cbd5e1" font-size="11">
                霍爾黏度 η_H: <tspan fill="#facc15" font-weight="bold">{{ state.hallViscosity }} × 10⁻⁶ Pa·s</tspan>
              </text>
              <text x="15" y="82" fill="#a855f7" font-size="10">
                反常係數: C_grav = 1 / 384π²
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#200527" rx="6" stroke="#c026d3" stroke-width="1" />
              <text x="15" y="22" fill="#f5d0fe" font-size="12" font-weight="bold">外爾相對論流體參數</text>
              <text x="15" y="44" fill="#cbd5e1" font-size="11">手性化學勢 μ₅: <tspan fill="#f43f5e" font-weight="bold">{{ state.chiralChemicalPotentialMu5 }} meV</tspan></text>
              <text x="15" y="64" fill="#cbd5e1" font-size="11">流體渦度 Ω: <tspan fill="#c026d3" font-weight="bold">{{ state.fluidVorticityOmega }} rad/s</tspan></text>
              <text x="15" y="84" fill="#cbd5e1" font-size="11">李雅普諾夫 λ_L: <tspan fill="#38bdf8" font-weight="bold">{{ state.lyapunovExponent }} × 10¹² s⁻¹</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#581c87" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#f5d0fe" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">手性化學勢 μ₅ (meV)</span>
              <span class="ctrl-value">{{ state.chiralChemicalPotentialMu5.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="40.0"
              step="0.5"
              :value="state.chiralChemicalPotentialMu5"
              @input="onPotentialChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">流體角渦度 Ω (rad/s)</span>
              <span class="ctrl-value">{{ state.fluidVorticityOmega.toFixed(1) }} rad/s</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="100.0"
              step="1.0"
              :value="state.fluidVorticityOmega"
              @input="onVorticityChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">局部流體溫度 T (K)</span>
              <span class="ctrl-value">{{ state.fluidTemperatureK.toFixed(1) }} K</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="0.5"
              :value="state.fluidTemperatureK"
              @input="onTemperatureChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 手性引力渦度滑音</span>
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
  weylChiralGravitationalFluidEngine,
  type WeylFluidRegime,
  type WeylFluidState
} from '../engine/weylChiralGravitationalFluid';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<WeylFluidState>({ ...weylChiralGravitationalFluidEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: WeylFluidRegime; name: string; icon: string }[] = [
  { id: 'laminar-weyl-gas', name: '層流外爾氣體', icon: '💨' },
  { id: 'chiral-vortical-fluid', name: '手性渦旋流體', icon: '🌀' },
  { id: 'gravitational-anomaly-turbulent', name: '引力反常湍流', icon: '⚡' },
  { id: 'fast-thermal-scrambling', name: '極限熱攪動相', icon: '🔥' }
];

function regimeLabel(regime: WeylFluidRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: WeylFluidRegime): void {
  weylChiralGravitationalFluidEngine.setRegime(regime);
  syncState();
}

function onPotentialChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylChiralGravitationalFluidEngine.setChiralPotential(val);
  syncState();
}

function onVorticityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylChiralGravitationalFluidEngine.setVorticity(val);
  syncState();
}

function onTemperatureChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylChiralGravitationalFluidEngine.setTemperature(val);
  syncState();
}

function playSound(): void {
  weylChiralGravitationalFluidEngine.triggerVortexSound();
}

function resetEngine(): void {
  weylChiralGravitationalFluidEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...weylChiralGravitationalFluidEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  weylChiralGravitationalFluidEngine.update(0.016);
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
  background: rgba(10, 2, 14, 0.82);
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
  background: #14041b;
  border: 1px solid #c026d3;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(217, 70, 239, 0.35);
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
  background: #200527;
  border-bottom: 1px solid #a21caf;
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
  color: #f5d0fe;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #d946ef;
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
  border: 1px solid #701a75;
}

.fluid-svg {
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
  background: #2e0838;
  border: 1px solid #701a75;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #4a044e;
  border-color: #c026d3;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #a21caf, #d946ef);
  border-color: #f5d0fe;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #1c0326;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #701a75;
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
  color: #f472b6;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #d946ef;
  background: #4a044e;
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
  background: #701a75;
  border-color: #c026d3;
  color: #f5d0fe;
}
.sound-btn:hover {
  background: #86198f;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.4);
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
