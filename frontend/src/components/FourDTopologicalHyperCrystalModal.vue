<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🧊</span>
          <div>
            <h2>四維拓撲絕緣體二階陳數超幾何晶體</h2>
            <p class="subtitle">4D Quantum Hall Effect, Tesseract SO(4) Projection & Second Chern Invariant C₂</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="hyper-svg">
            <defs>
              <linearGradient id="hyperBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#12031a" />
                <stop offset="50%" stop-color="#210830" />
                <stop offset="100%" stop-color="#0b0110" />
              </linearGradient>

              <radialGradient id="vertexGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f472b6" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#db2777" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#831843" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowHyper">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#hyperBg)" rx="8" />

            <!-- 4D Hyper-grid Space Backdrop -->
            <g opacity="0.15">
              <line v-for="x in 16" :key="'hx' + x" :x1="x * 50" y1="0" :x2="x * 50" y2="360" stroke="#f472b6" stroke-dasharray="2 4" />
              <line v-for="y in 7" :key="'hy' + y" x1="0" :y1="y * 50" x2="800" :y2="y * 50" stroke="#f472b6" stroke-dasharray="2 4" />
            </g>

            <!-- Tesseract 4D SO(4) Projection View -->
            <g transform="translate(100, 20)">
              <!-- 32 Hyper-Edges -->
              <g v-for="(e, idx) in state.edges" :key="'edge-' + idx">
                <line
                  v-if="state.vertices[e.from] && state.vertices[e.to]"
                  :x1="state.vertices[e.from].projX"
                  :y1="state.vertices[e.from].projY"
                  :x2="state.vertices[e.to].projX"
                  :y2="state.vertices[e.to].projY"
                  :stroke="((e.from & 8) !== (e.to & 8)) ? '#f472b6' : '#ec4899'"
                  :stroke-width="((e.from & 8) !== (e.to & 8)) ? 2.0 : 1.2"
                  :opacity="0.35 + state.secondChernNumberC2 * 0.3"
                  filter="url(#glowHyper)"
                />
              </g>

              <!-- 16 Hyper-Vertices -->
              <g v-for="v in state.vertices" :key="'vert-' + v.id">
                <circle
                  :cx="v.projX"
                  :cy="v.projY"
                  :r="v.w > 0 ? 5.5 : 4.0"
                  fill="url(#vertexGlow)"
                  filter="url(#glowHyper)"
                />
                <circle
                  :cx="v.projX"
                  :cy="v.projY"
                  :r="2"
                  fill="#ffffff"
                />
              </g>
            </g>

            <!-- 3D Surface Dirac Cone (Center Right) -->
            <g transform="translate(410, 45)">
              <rect x="0" y="0" width="135" height="135" fill="#240733" rx="6" stroke="#db2777" stroke-width="1" />
              <text x="12" y="20" fill="#fbcfe8" font-size="11" font-weight="bold">3D 表面狄拉克錐</text>
              <!-- Dirac Cone Cones (Upper and Lower) -->
              <polygon points="67,65 30,28 105,28" fill="#f43f5e" opacity="0.45" />
              <polygon points="67,70 30,110 105,110" fill="#38bdf8" opacity="0.45" />
              <!-- Dirac Node Point -->
              <circle cx="67.5" cy="67.5" r="3.5" fill="#f8fafc" />
              <text x="67.5" y="125" fill="#f472b6" font-size="10" text-anchor="middle" font-family="monospace">
                v_F = {{ state.surfaceDiracVelocity1e5 }}
              </text>
            </g>

            <!-- Second Chern Number Gauge (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="95" fill="#240733" rx="6" stroke="#ec4899" stroke-width="1" />
              <text x="15" y="24" fill="#fbcfe8" font-size="12" font-weight="bold">非阿貝爾二階陳數 (C₂)</text>
              <text x="15" y="58" fill="#f472b6" font-size="30" font-weight="bold" font-family="monospace">
                C₂ = {{ state.secondChernNumberC2 }}
              </text>
              <text x="15" y="80" fill="#9d4edd" font-size="11" font-weight="bold">
                {{ state.secondChernNumberC2 === 0 ? '平庸絕緣體' : (state.secondChernNumberC2 === 1 ? '單二階拓撲態' : '雙重二階超晶相') }}
              </text>
            </g>

            <!-- Berry Curvature Flux & Non-linear Hall (Middle Right) -->
            <g transform="translate(565, 140)">
              <rect x="0" y="0" width="210" height="85" fill="#240733" rx="6" stroke="#db2777" stroke-width="1" />
              <text x="15" y="22" fill="#fbcfe8" font-size="12" font-weight="bold">貝里曲率通量 Tr(ℱ∧ℱ)</text>
              <text x="15" y="48" fill="#f472b6" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.berryCurvatureFlux }}
              </text>
              <text x="15" y="70" fill="#cbd5e1" font-size="11">
                非線性霍爾: {{ state.nonLinearHallConductance }} (e² / 4π²ℏ)
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#240733" rx="6" stroke="#db2777" stroke-width="1" />
              <text x="15" y="22" fill="#fbcfe8" font-size="12" font-weight="bold">超空間物理參數</text>
              <text x="15" y="44" fill="#cbd5e1" font-size="11">狄拉克質量 M₄: <tspan fill="#38bdf8" font-weight="bold">{{ state.diracMassM4 }} eV</tspan></text>
              <text x="15" y="64" fill="#cbd5e1" font-size="11">4D 旋轉角: <tspan fill="#facc15" font-weight="bold">{{ state.hyperRotationAngleDeg.toFixed(1) }}°</tspan></text>
              <text x="15" y="84" fill="#cbd5e1" font-size="11">超立方頂點數: <tspan fill="#ec4899" font-weight="bold">16 V / 32 E</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#4a044e" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#fbcfe8" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">狄拉克質量參數 M₄ (eV)</span>
              <span class="ctrl-value">{{ state.diracMassM4.toFixed(2) }} eV</span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              :value="state.diracMassM4"
              @input="onMassChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">四維超空間旋轉角度 θ_4D (度)</span>
              <span class="ctrl-value">{{ state.hyperRotationAngleDeg.toFixed(1) }}°</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="360.0"
              step="1.0"
              :value="state.hyperRotationAngleDeg"
              @input="onRotationChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 四度等比超立體和聲</span>
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
  fourDTopologicalHyperCrystalEngine,
  type FourDHyperCrystalRegime,
  type FourDHyperCrystalState
} from '../engine/fourDTopologicalHyperCrystal';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<FourDHyperCrystalState>({ ...fourDTopologicalHyperCrystalEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: FourDHyperCrystalRegime; name: string; icon: string }[] = [
  { id: 'trivial-hyper-insulator', name: '平庸超晶相', icon: '🔲' },
  { id: 'second-chern-topological', name: '二階陳數相', icon: '🧊' },
  { id: 'double-chern-exotic', name: '雙重超幾何相', icon: '🔮' },
  { id: 'hyper-surface-critical', name: '狄拉克錐臨界相', icon: '⚡' }
];

function regimeLabel(regime: FourDHyperCrystalRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: FourDHyperCrystalRegime): void {
  fourDTopologicalHyperCrystalEngine.setRegime(regime);
  syncState();
}

function onMassChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fourDTopologicalHyperCrystalEngine.setDiracMass(val);
  syncState();
}

function onRotationChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fourDTopologicalHyperCrystalEngine.setHyperRotation(val);
  syncState();
}

function playSound(): void {
  fourDTopologicalHyperCrystalEngine.triggerHyperSound();
}

function resetEngine(): void {
  fourDTopologicalHyperCrystalEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...fourDTopologicalHyperCrystalEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  fourDTopologicalHyperCrystalEngine.update(0.016);
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
  background: rgba(14, 2, 20, 0.82);
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
  background: #14041e;
  border: 1px solid #db2777;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(244, 114, 182, 0.35);
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
  background: #240733;
  border-bottom: 1px solid #be185d;
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
  color: #fbcfe8;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #f472b6;
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
  border: 1px solid #831843;
}

.hyper-svg {
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
  background: #2d0b3f;
  border: 1px solid #831843;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #4a044e;
  border-color: #db2777;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #be185d, #ec4899);
  border-color: #fbcfe8;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(244, 114, 182, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #20052c;
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
  accent-color: #ec4899;
  background: #701a75;
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
  border-color: #ec4899;
  color: #fbcfe8;
}
.sound-btn:hover {
  background: #86198f;
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
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
