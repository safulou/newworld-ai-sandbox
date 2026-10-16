<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">❄️</span>
          <div>
            <h2>非阿貝爾分形高階拓撲超導體</h2>
            <p class="subtitle">Sierpinski Carpet HOTSC, Non-Abelian Majorana Corner Modes & Braiding Qubits</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="hotsc-svg">
            <defs>
              <linearGradient id="hotscBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#030d1a" />
                <stop offset="50%" stop-color="#081e36" />
                <stop offset="100%" stop-color="#020812" />
              </linearGradient>

              <radialGradient id="cornerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowCorner">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#hotscBg)" rx="8" />

            <!-- Sierpinski Carpet Fractal Grid (Center-Left) -->
            <g transform="translate(100, 30)">
              <!-- Outer Boundary Square (200x200) -->
              <rect
                x="50"
                y="50"
                width="200"
                height="200"
                fill="none"
                stroke="#0284c7"
                stroke-width="2"
                stroke-dasharray="4 2"
              />

              <!-- Sub-fractal Cavities (Center cutouts) -->
              <!-- Generation 1 Central Cutout (66.6x66.6) -->
              <rect
                x="117"
                y="117"
                width="66"
                height="66"
                fill="#030d1a"
                stroke="#38bdf8"
                stroke-width="1.5"
                opacity="0.85"
              />

              <!-- Generation 2 Secondary Cutouts -->
              <g v-if="state.fractalGeneration >= 2" fill="#020812" stroke="#0ea5e9" stroke-width="0.8" opacity="0.6">
                <rect x="72" y="72" width="22" height="22" />
                <rect x="139" y="72" width="22" height="22" />
                <rect x="206" y="72" width="22" height="22" />
                <rect x="72" y="139" width="22" height="22" />
                <rect x="206" y="139" width="22" height="22" />
                <rect x="72" y="206" width="22" height="22" />
                <rect x="139" y="206" width="22" height="22" />
                <rect x="206" y="206" width="22" height="22" />
              </g>

              <!-- Braiding Worldline Trajectory Loop -->
              <path
                v-if="state.activeRegime === 'non-abelian-braiding-qubit'"
                :d="`M 50 50 Q ${150 + 20 * Math.sin(animTick * 4)} 100 250 50 T 250 250 T 50 250 Z`"
                fill="none"
                stroke="#f43f5e"
                stroke-width="1.8"
                stroke-dasharray="4 3"
                filter="url(#glowCorner)"
              />

              <!-- Majorana Corner Modes (MCMs) -->
              <g v-for="c in state.cornerModes" :key="'mcm-' + c.id">
                <circle
                  :cx="c.x"
                  :cy="c.y"
                  :r="12 * c.wavefunctionDensity + (c.isExterior ? 4 : 2)"
                  fill="url(#cornerGlow)"
                  filter="url(#glowCorner)"
                  :opacity="0.6 + 0.4 * Math.sin(animTick * 3 + c.id)"
                />
                <circle :cx="c.x" :cy="c.y" r="3.5" fill="#f8fafc" />
                <text :x="c.x + (c.x > 150 ? 8 : -22)" :y="c.y + (c.y > 150 ? 14 : -8)" fill="#e0f2fe" font-size="9" font-family="monospace">
                  γ_{{ c.id }}
                </text>
              </g>
            </g>

            <!-- Bloch Sphere Qubit View (Center-Right) -->
            <g transform="translate(420, 50)">
              <rect x="0" y="0" width="130" height="130" fill="#08203d" rx="6" stroke="#0284c7" stroke-width="1" />
              <text x="12" y="18" fill="#bae6fd" font-size="11" font-weight="bold">非阿貝爾布洛赫球</text>
              <!-- Sphere Projection Circle -->
              <circle cx="65" cy="72" r="36" fill="none" stroke="#0369a1" stroke-width="1.5" stroke-dasharray="3 3" />
              <ellipse cx="65" cy="72" rx="36" ry="12" fill="none" stroke="#0284c7" stroke-width="1" />
              <!-- State Vector Arrow -->
              <line
                x1="65"
                y1="72"
                :x2="65 + 32 * Math.sin(state.qubitBlochThetaRad) * Math.cos(state.qubitBlochPhiRad)"
                :y2="72 - 32 * Math.cos(state.qubitBlochThetaRad)"
                stroke="#f43f5e"
                stroke-width="2.2"
                stroke-linecap="round"
                filter="url(#glowCorner)"
              />
              <circle
                :cx="65 + 32 * Math.sin(state.qubitBlochThetaRad) * Math.cos(state.qubitBlochPhiRad)"
                :cy="72 - 32 * Math.cos(state.qubitBlochThetaRad)"
                r="3.5"
                fill="#f43f5e"
              />
              <text x="65" y="122" fill="#7dd3fc" font-size="9" text-anchor="middle" font-family="monospace">
                |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩
              </text>
            </g>

            <!-- Braiding Fidelity Gauge (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="90" fill="#08203d" rx="6" stroke="#0284c7" stroke-width="1" />
              <text x="15" y="24" fill="#bae6fd" font-size="12" font-weight="bold">非阿貝爾編織保真度 (F)</text>
              <text x="15" y="56" fill="#38bdf8" font-size="24" font-weight="bold" font-family="monospace">
                {{ (state.braidingFidelity * 100).toFixed(2) }}%
              </text>
              <rect x="15" y="66" width="180" height="8" fill="#0c4a6e" rx="3" />
              <rect x="15" y="66" :width="180 * state.braidingFidelity" height="8" fill="#38bdf8" rx="3" />
            </g>

            <!-- Majorana Localization Length (Middle Right) -->
            <g transform="translate(565, 135)">
              <rect x="0" y="0" width="210" height="85" fill="#08203d" rx="6" stroke="#0284c7" stroke-width="1" />
              <text x="15" y="22" fill="#bae6fd" font-size="12" font-weight="bold">角隅模定域長度 (ξ_M)</text>
              <text x="15" y="50" fill="#38bdf8" font-size="20" font-weight="bold" font-family="monospace">
                {{ state.cornerModeLocalizationNm }} nm
              </text>
              <text x="15" y="70" fill="#94a3b8" font-size="11">
                分形維數: d_f ≈ 1.893 (謝爾賓斯基)
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 230)">
              <rect x="0" y="0" width="210" height="100" fill="#08203d" rx="6" stroke="#0284c7" stroke-width="1" />
              <text x="15" y="22" fill="#bae6fd" font-size="12" font-weight="bold">超導微觀物理參數</text>
              <text x="15" y="42" fill="#94a3b8" font-size="11">配對能隙 Δ₀: <tspan fill="#38bdf8" font-weight="bold">{{ state.pairingGapDelta }} meV</tspan></text>
              <text x="15" y="60" fill="#94a3b8" font-size="11">SOC 強度 α: <tspan fill="#f59e0b" font-weight="bold">{{ state.socStrengthAlpha }} meV</tspan></text>
              <text x="15" y="78" fill="#94a3b8" font-size="11">化學勢 μ: <tspan fill="#ec4899" font-weight="bold">{{ state.chemicalPotentialMu }} meV</tspan></text>
              <text x="15" y="94" fill="#94a3b8" font-size="11">角隅零模數: <tspan fill="#a855f7" font-weight="bold">8 MCMs (Ising Anyons)</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#0369a1" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#e0f2fe" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">超導配對能隙 Δ₀ (meV)</span>
              <span class="ctrl-value">{{ state.pairingGapDelta.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.05"
              :value="state.pairingGapDelta"
              @input="onPairingGapChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">自旋軌道耦合強度 α_SOC (meV)</span>
              <span class="ctrl-value">{{ state.socStrengthAlpha.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="50.0"
              step="0.5"
              :value="state.socStrengthAlpha"
              @input="onSocStrengthChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">費米能化學勢 μ (meV)</span>
              <span class="ctrl-value">{{ state.chemicalPotentialMu.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="2.0"
              step="0.05"
              :value="state.chemicalPotentialMu"
              @input="onChemicalPotentialChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">謝爾賓斯基分形遞歸層數 (Generation)</span>
              <span class="ctrl-value">Gen {{ state.fractalGeneration }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              :value="state.fractalGeneration"
              @input="onGenerationChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 任意子編織量子滑音</span>
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
  nonAbelianFractalTopologicalSuperconductorEngine,
  type FractalHOTSCRegime,
  type FractalHOTSCState
} from '../engine/nonAbelianFractalTopologicalSuperconductor';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<FractalHOTSCState>({ ...nonAbelianFractalTopologicalSuperconductorEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: FractalHOTSCRegime; name: string; icon: string }[] = [
  { id: 'trivial-fractal-metal', name: '平庸分形金屬', icon: '🔩' },
  { id: 'first-order-chiral-sc', name: '一階手性超導', icon: '🌊' },
  { id: 'second-order-fractal-corner', name: '二階角隅馬約拉納', icon: '❄️' },
  { id: 'non-abelian-braiding-qubit', name: '任意子編織量子位元', icon: '🔮' }
];

function regimeLabel(regime: FractalHOTSCRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: FractalHOTSCRegime): void {
  nonAbelianFractalTopologicalSuperconductorEngine.setRegime(regime);
  syncState();
}

function onPairingGapChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianFractalTopologicalSuperconductorEngine.setPairingGap(val);
  syncState();
}

function onSocStrengthChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianFractalTopologicalSuperconductorEngine.setSocStrength(val);
  syncState();
}

function onChemicalPotentialChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianFractalTopologicalSuperconductorEngine.setChemicalPotential(val);
  syncState();
}

function onGenerationChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  nonAbelianFractalTopologicalSuperconductorEngine.setFractalGeneration(val);
  syncState();
}

function playSound(): void {
  nonAbelianFractalTopologicalSuperconductorEngine.triggerBraidingSound();
}

function resetEngine(): void {
  nonAbelianFractalTopologicalSuperconductorEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...nonAbelianFractalTopologicalSuperconductorEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  nonAbelianFractalTopologicalSuperconductorEngine.update(0.016);
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
  background: rgba(2, 8, 18, 0.82);
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
  background: #041224;
  border: 1px solid #0284c7;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.35);
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
  background: #08203d;
  border-bottom: 1px solid #0369a1;
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
  color: #e0f2fe;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #38bdf8;
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
  border: 1px solid #0369a1;
}

.hotsc-svg {
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
  background: #0b294c;
  border: 1px solid #0369a1;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #0f3766;
  border-color: #38bdf8;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  border-color: #bae6fd;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #08203d;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #0c4a6e;
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
  color: #38bdf8;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #38bdf8;
  background: #0c4a6e;
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
  background: #0369a1;
  border-color: #38bdf8;
  color: #e0f2fe;
}
.sound-btn:hover {
  background: #0284c7;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
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
