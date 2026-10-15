<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🧪</span>
          <div>
            <h2>動態自旋極化子玻色凝聚膠體</h2>
            <p class="subtitle">Spin-Phonon Coupling, Viscoelastic Quantum Gel & Supersolid Shear Rigidity</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="gel-svg">
            <defs>
              <linearGradient id="gelBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#021a14" />
                <stop offset="50%" stop-color="#062e24" />
                <stop offset="100%" stop-color="#01140f" />
              </linearGradient>

              <radialGradient id="polaronGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#059669" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#064e3b" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowGel">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#gelBg)" rx="8" />

            <!-- Viscoelastic Shear Wave Ribbons -->
            <g opacity="0.18">
              <path
                v-for="line in 6"
                :key="'shear-' + line"
                :d="`M 0 ${60 * line} Q 200 ${60 * line + Math.sin(animTick * 3 + line) * 35} 400 ${60 * line} T 800 ${60 * line}`"
                fill="none"
                stroke="#10b981"
                stroke-width="1.5"
                stroke-dasharray="3 5"
              />
            </g>

            <!-- Quantum Gel Network Mesh -->
            <g transform="translate(180, 20)">
              <!-- Polymer Chains Between Polarons -->
              <g v-for="(c1, i) in state.clusters" :key="'chain-' + i">
                <g v-for="(c2, j) in state.clusters" :key="'chain-' + i + '-' + j">
                  <line
                    v-if="j > i"
                    :x1="c1.x"
                    :y1="c1.y"
                    :x2="c2.x"
                    :y2="c2.y"
                    stroke="#10b981"
                    :stroke-width="1.0 + c1.strainAmplitude * 2"
                    :opacity="0.3 + (state.storageModulusGPrimeKPa / 200) * 0.5"
                  />
                  <!-- Phonon Cloud Pulse Along Chain -->
                  <circle
                    v-if="j > i && Math.sin(animTick * 5 + i * 3 + j) > 0.5"
                    :cx="(c1.x + c2.x) / 2"
                    :cy="(c1.y + c2.y) / 2"
                    r="3.2"
                    fill="#6ee7b7"
                    filter="url(#glowGel)"
                  />
                </g>
              </g>

              <!-- Polaron Clusters -->
              <g v-for="c in state.clusters" :key="'cluster-' + c.id">
                <!-- Outer Phonon Halo -->
                <circle
                  :cx="c.x"
                  :cy="c.y"
                  :r="c.radius * 1.8"
                  fill="url(#polaronGlow)"
                  filter="url(#glowGel)"
                  :opacity="0.6 + 0.4 * Math.sin(animTick * 3 + c.id)"
                />

                <!-- Polaron Core -->
                <circle
                  :cx="c.x"
                  :cy="c.y"
                  :r="c.radius * 0.8"
                  fill="#10b981"
                  stroke="#a7f3d0"
                  stroke-width="1.5"
                />

                <!-- Spin Arrow Vector -->
                <line
                  :x1="c.x"
                  :y1="c.y"
                  :x2="c.x + 14 * Math.cos(animTick * 2 + c.id)"
                  :y2="c.y - 14 * Math.sin(animTick * 2 + c.id)"
                  stroke="#fef08a"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <text :x="c.x + 12" :y="c.y - 10" fill="#a7f3d0" font-size="10" font-family="monospace">
                  S={{ c.spinPolarization.toFixed(1) }}
                </text>
              </g>
            </g>

            <!-- Cole-Cole Complex Shear Modulus Chart (Top Right) -->
            <g transform="translate(560, 40)">
              <rect x="0" y="0" width="210" height="90" fill="#03251c" rx="6" stroke="#059669" stroke-width="1" />
              <text x="15" y="22" fill="#a7f3d0" font-size="12" font-weight="bold">複數剪切模量 G*(ω)</text>
              <!-- Semi-circle trajectory in G'-G'' plane -->
              <path
                d="M 25 72 A 65 50 0 0 1 185 72"
                fill="none"
                stroke="#047857"
                stroke-width="2"
                stroke-dasharray="2 3"
              />
              <!-- Operating Point on Trajectory -->
              <circle
                :cx="35 + Math.min(140, (state.storageModulusGPrimeKPa / 160) * 140)"
                :cy="72 - Math.min(45, (state.lossModulusGDoublePrimeKPa / 70) * 45)"
                r="5"
                fill="#34d399"
                filter="url(#glowGel)"
              />
              <text x="25" y="86" fill="#6ee7b7" font-size="10">
                G'={{ state.storageModulusGPrimeKPa }} kPa | G''={{ state.lossModulusGDoublePrimeKPa }} kPa
              </text>
            </g>

            <!-- Viscoelastic Loss Factor Gauge (Middle Right) -->
            <g transform="translate(560, 140)">
              <rect x="0" y="0" width="210" height="85" fill="#03251c" rx="6" stroke="#10b981" stroke-width="1" />
              <text x="15" y="24" fill="#6ee7b7" font-size="12" font-weight="bold">黏彈損耗因子 tan δ</text>
              <circle cx="45" cy="54" r="22" fill="none" stroke="#064e3b" stroke-width="5" />
              <circle
                cx="45"
                cy="54"
                r="22"
                fill="none"
                stroke="#34d399"
                stroke-width="5"
                stroke-dasharray="138"
                :stroke-dashoffset="138 * Math.max(0, 1 - state.lossFactorTanDelta / 1.5)"
                transform="rotate(-90, 45, 54)"
              />
              <text x="45" y="58" fill="#f0fdf4" font-size="12" font-weight="bold" text-anchor="middle">
                {{ state.lossFactorTanDelta.toFixed(2) }}
              </text>
              <text x="85" y="48" fill="#a7f3d0" font-size="11">tan δ = G'' / G'</text>
              <text x="85" y="66" fill="#facc15" font-size="11" font-weight="bold">
                {{ state.lossFactorTanDelta < 0.4 ? '超固態彈性主導' : '黏性流體耗散' }}
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(560, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#03251c" rx="6" stroke="#059669" stroke-width="1" />
              <text x="15" y="22" fill="#a7f3d0" font-size="12" font-weight="bold">極化膠體物性參數</text>
              <text x="15" y="44" fill="#6ee7b7" font-size="11">有效質量 m*/m: <tspan fill="#fef08a" font-weight="bold">{{ state.effectiveMassRatio }}×</tspan></text>
              <text x="15" y="64" fill="#6ee7b7" font-size="11">自旋極化率 χ: <tspan fill="#38bdf8" font-weight="bold">{{ state.spinPolarizabilityChi }}</tspan></text>
              <text x="15" y="84" fill="#6ee7b7" font-size="11">剪切頻率 ω: <tspan fill="#ec4899" font-weight="bold">{{ state.shearFrequencyHz }} Hz</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#064e3b" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#a7f3d0" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">自旋-聲子耦合常數 g_sp</span>
              <span class="ctrl-value">{{ state.spinPhononCouplingG.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              :value="state.spinPhononCouplingG"
              @input="onCouplingChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">玻色膠體密度 ρ_gel (10¹⁸ cm⁻³)</span>
              <span class="ctrl-value">{{ state.gelDensity1e18.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.1"
              :value="state.gelDensity1e18"
              @input="onDensityChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">動態剪切震盪頻率 ω_shear (Hz)</span>
              <span class="ctrl-value">{{ state.shearFrequencyHz.toFixed(1) }} Hz</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="120.0"
              step="1.0"
              :value="state.shearFrequencyHz"
              @input="onFrequencyChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 膠體共鳴彈性音</span>
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
  dynamicalSpinPolaronBoseGelEngine,
  type SpinPolaronGelRegime,
  type SpinPolaronGelState
} from '../engine/dynamicalSpinPolaronBoseGel';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<SpinPolaronGelState>({ ...dynamicalSpinPolaronBoseGelEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: SpinPolaronGelRegime; name: string; icon: string }[] = [
  { id: 'polaron-fermi-liquid', name: '極化子費米液體', icon: '💧' },
  { id: 'viscoelastic-bose-gel', name: '黏彈玻色膠體', icon: '🧪' },
  { id: 'coherent-supersolid-gel', name: '相干超固態凝膠', icon: '💎' },
  { id: 'viscoelastic-avalanche', name: '黏彈雪崩應變', icon: '⚡' }
];

function regimeLabel(regime: SpinPolaronGelRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: SpinPolaronGelRegime): void {
  dynamicalSpinPolaronBoseGelEngine.setRegime(regime);
  syncState();
}

function onCouplingChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  dynamicalSpinPolaronBoseGelEngine.setSpinPhononCoupling(val);
  syncState();
}

function onDensityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  dynamicalSpinPolaronBoseGelEngine.setGelDensity(val);
  syncState();
}

function onFrequencyChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  dynamicalSpinPolaronBoseGelEngine.setShearFrequency(val);
  syncState();
}

function playSound(): void {
  dynamicalSpinPolaronBoseGelEngine.triggerGelResonanceSound();
}

function resetEngine(): void {
  dynamicalSpinPolaronBoseGelEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...dynamicalSpinPolaronBoseGelEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  dynamicalSpinPolaronBoseGelEngine.update(0.016);
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
  background: rgba(2, 14, 10, 0.82);
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
  background: #021a14;
  border: 1px solid #059669;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.35);
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
  background: #03251c;
  border-bottom: 1px solid #047857;
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
  color: #a7f3d0;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #34d399;
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
  border: 1px solid #065f46;
}

.gel-svg {
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
  background: #064e3b;
  border: 1px solid #047857;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #047857;
  border-color: #10b981;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #059669, #10b981);
  border-color: #6ee7b7;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(52, 211, 153, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #032b21;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #064e3b;
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
  color: #6ee7b7;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #10b981;
  background: #064e3b;
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
  background: #065f46;
  border-color: #10b981;
  color: #a7f3d0;
}
.sound-btn:hover {
  background: #047857;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
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
