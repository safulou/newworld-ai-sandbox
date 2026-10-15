<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">💎</span>
          <div>
            <h2>自旋軌道耦合分形外爾時間晶體</h2>
            <p class="subtitle">Spin-Orbit Coupling (SOC), Fractal Hausdorff Manifold & 4T Floquet Time Crystal</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="tc-svg">
            <defs>
              <linearGradient id="tcBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#021213" />
                <stop offset="50%" stop-color="#052427" />
                <stop offset="100%" stop-color="#010e0f" />
              </linearGradient>

              <radialGradient id="fractalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#0f766e" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#134e4a" stop-opacity="0" />
              </radialGradient>

              <filter id="glowTC">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#tcBg)" rx="8" />

            <!-- Sierpinski Fractal Lattice (Left / Center) -->
            <g transform="translate(240, 180)">
              <!-- Rotating Aura -->
              <circle cx="0" cy="0" r="105" fill="url(#fractalGlow)" />
              <polygon
                points="0,-100 86,50 -86,50"
                fill="none"
                stroke="#2dd4bf"
                stroke-width="2"
                filter="url(#glowTC)"
                :transform="`rotate(${animTick * 12})`"
              />

              <!-- Sub-triangles for fractal depth -->
              <g :transform="`rotate(${animTick * 12})`">
                <polygon
                  v-if="state.fractalRecursionDepth >= 2"
                  points="0,50 -43,-25 43,-25"
                  fill="none"
                  stroke="#14b8a6"
                  stroke-width="1.5"
                  stroke-dasharray="3 3"
                />
                <polygon
                  v-if="state.fractalRecursionDepth >= 3"
                  points="0,-25 -21.5,12.5 21.5,12.5"
                  fill="none"
                  stroke="#5eead4"
                  stroke-width="1"
                />
                <polygon
                  v-if="state.fractalRecursionDepth >= 4"
                  points="-43,12.5 -64.5,50 -21.5,50"
                  fill="none"
                  stroke="#99f6e4"
                  stroke-width="0.8"
                />
                <polygon
                  v-if="state.fractalRecursionDepth >= 4"
                  points="43,12.5 21.5,50 64.5,50"
                  fill="none"
                  stroke="#99f6e4"
                  stroke-width="0.8"
                />
              </g>

              <!-- Weyl Nodes on Fractal Vertices with Spin-Orbit Precession -->
              <g v-for="(v, idx) in fractalVertices" :key="'vert' + idx">
                <circle
                  :cx="v.x"
                  :cy="v.y"
                  r="7"
                  fill="#0d9488"
                  stroke="#2dd4bf"
                  stroke-width="2"
                  filter="url(#glowTC)"
                />
                <!-- Spin precession vector -->
                <line
                  :x1="v.x"
                  :y1="v.y"
                  :x2="v.x + 18 * Math.cos(animTick * 4 + idx * 1.5)"
                  :y2="v.y + 18 * Math.sin(animTick * 4 + idx * 1.5)"
                  stroke="#f59e0b"
                  stroke-width="2"
                />
              </g>

              <text x="0" y="130" fill="#5eead4" font-size="11" text-anchor="middle">
                豪斯多夫分形維度 d_f = {{ state.fractalHausdorffDim }}
              </text>
            </g>

            <!-- Right HUD 1: Magnetization Trajectory 4T Waveform -->
            <g transform="translate(480, 50)">
              <rect x="-10" y="-10" width="310" height="135" fill="#021719" stroke="#115e59" rx="6" />
              <text x="5" y="12" fill="#2dd4bf" font-size="11" font-weight="bold">
                時間晶體序參量 ⟨σ_z(t)⟩ (4T 週期四倍化次諧波)
              </text>
              <path :d="trajectoryPath" fill="none" stroke="#2dd4bf" stroke-width="2.5" filter="url(#glowTC)" />
              <line x1="5" y1="65" x2="295" y2="65" stroke="#134e4a" stroke-dasharray="2 3" />
              <text x="5" y="115" fill="#94a3b8" font-size="10">
                目前 ⟨σ_z⟩: {{ state.orderParameterSigmaZ.toFixed(3) }} | 拓撲剛性 R: {{ (state.timeCrystalRigidityIndex * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- Right HUD 2: Subharmonic Fourier Spectrum Series -->
            <g transform="translate(480, 205)">
              <rect x="-10" y="-10" width="310" height="135" fill="#021719" stroke="#115e59" rx="6" />
              <text x="5" y="12" fill="#14b8a6" font-size="11" font-weight="bold">
                次諧波傅立葉功率譜 |F(ω)|² (峰值於 f = Ω/4)
              </text>
              <path :d="spectrumPath" fill="none" stroke="#f59e0b" stroke-width="2" filter="url(#glowTC)" />
              <!-- Subharmonic Peak Indicator -->
              <line x1="80" y1="20" x2="80" y2="105" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 2" />
              <text x="85" y="35" fill="#fca5a5" font-size="9">次諧波峰 (4T, {{ state.fourierSubharmonicPeakDb }} dB)</text>
              <text x="5" y="115" fill="#94a3b8" font-size="10">
                驅動頻率 Ω/2π: {{ state.floquetDriveFreqKhz.toFixed(1) }} kHz | 次諧波響應: {{ (state.floquetDriveFreqKhz / 4).toFixed(2) }} kHz
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Grid -->
        <div class="controls-grid">
          <!-- Regime Selector -->
          <div class="ctrl-group">
            <label class="group-label">非平衡物態體系 (Regime)</label>
            <div class="btn-wrap">
              <button
                v-for="r in regimes"
                :key="r.key"
                class="regime-btn"
                :class="{ active: state.activeRegime === r.key }"
                @click="setRegime(r.key)"
              >
                {{ r.label }}
              </button>
            </div>
          </div>

          <!-- Parameter Sliders -->
          <div class="ctrl-group">
            <div class="slider-row">
              <div class="slider-header">
                <span>自旋軌道耦合強度 λ_SOC:</span>
                <span class="value">{{ state.socStrengthLambda.toFixed(1) }} meV</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                :value="state.socStrengthLambda"
                @input="onSocChange"
              />
            </div>

            <div class="slider-row">
              <div class="slider-header">
                <span>翻轉脈衝微擾 ε:</span>
                <span class="value">{{ state.perturbationEpsilon.toFixed(3) }} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.25"
                step="0.005"
                :value="state.perturbationEpsilon"
                @input="onEpsChange"
              />
            </div>

            <div class="slider-row">
              <div class="slider-header">
                <span>分形晶格遞歸深度:</span>
                <span class="value">N = {{ state.fractalRecursionDepth }}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                :value="state.fractalRecursionDepth"
                @input="onDepthChange"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="ctrl-group actions">
            <button class="action-btn pulse" @click="triggerResonance">
              ⚡ 激發時間晶體共鳴脈衝
            </button>
            <button class="action-btn reset" @click="resetDefaults">
              🔄 恢復預設參數
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">時間晶體剛性指數 R</span>
            <span class="stat-value text-teal">{{ (state.timeCrystalRigidityIndex * 100).toFixed(1) }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">次諧波峰值功率</span>
            <span class="stat-value text-amber">{{ state.fourierSubharmonicPeakDb.toFixed(1) }} dB</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">分形豪斯多夫維度</span>
            <span class="stat-value text-cyan">d_f = {{ state.fractalHausdorffDim }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">離散時間平移破缺</span>
            <span class="stat-value text-emerald">4T 鎖定 (DTTS)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  socFractalWeylTimeCrystalEngine,
  type SocFractalCrystalRegime
} from '../engine/socFractalWeylTimeCrystal';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref(socFractalWeylTimeCrystalEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const fractalVertices = [
  { x: 0, y: -90 },
  { x: 78, y: 45 },
  { x: -78, y: 45 }
];

const regimes: { key: SocFractalCrystalRegime; label: string }[] = [
  { key: 'thermalized-ergodic', label: '熱化遍歷相' },
  { key: 'prethermal-weyl-oscillator', label: '預熱化振盪' },
  { key: 'soc-subharmonic-time-crystal', label: 'SOC 次諧波晶體' },
  { key: 'hofstadter-fractal-topological-rigid', label: '霍夫施塔特拓撲剛性' }
];

const trajectoryPath = computed(() => {
  const traj = state.value.magnetizationTrajectory;
  if (!traj || traj.length === 0) return '';
  return traj.map((val, idx) => {
    const x = 10 + (idx / 50) * 280;
    const y = 65 - val * 45;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
});

const spectrumPath = computed(() => {
  const spec = state.value.fourierSpectrumSeries;
  if (!spec || spec.length === 0) return '';
  return spec.map((val, idx) => {
    const x = 10 + (idx / 64) * 280;
    const y = 105 - val * 75;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
});

const refreshState = () => {
  state.value = socFractalWeylTimeCrystalEngine.getState();
};

const setRegime = (regime: SocFractalCrystalRegime) => {
  if (regime === 'hofstadter-fractal-topological-rigid') {
    socFractalWeylTimeCrystalEngine.setSocStrength(35.0);
    socFractalWeylTimeCrystalEngine.setPerturbationEpsilon(0.02);
  } else if (regime === 'soc-subharmonic-time-crystal') {
    socFractalWeylTimeCrystalEngine.setSocStrength(25.0);
    socFractalWeylTimeCrystalEngine.setPerturbationEpsilon(0.06);
  } else if (regime === 'prethermal-weyl-oscillator') {
    socFractalWeylTimeCrystalEngine.setSocStrength(12.0);
    socFractalWeylTimeCrystalEngine.setPerturbationEpsilon(0.12);
  } else {
    socFractalWeylTimeCrystalEngine.setSocStrength(2.0);
    socFractalWeylTimeCrystalEngine.setPerturbationEpsilon(0.24);
  }
  refreshState();
  achievements.unlock('soc_fractal_weyl_time_crystal');
};

const onSocChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  socFractalWeylTimeCrystalEngine.setSocStrength(val);
  refreshState();
  achievements.unlock('soc_fractal_weyl_time_crystal');
};

const onEpsChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  socFractalWeylTimeCrystalEngine.setPerturbationEpsilon(val);
  refreshState();
  achievements.unlock('soc_fractal_weyl_time_crystal');
};

const onDepthChange = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value);
  socFractalWeylTimeCrystalEngine.setFractalRecursionDepth(val);
  refreshState();
  achievements.unlock('soc_fractal_weyl_time_crystal');
};

const triggerResonance = () => {
  socFractalWeylTimeCrystalEngine.triggerChirpAudio();
  refreshState();
  achievements.unlock('soc_fractal_weyl_time_crystal');
};

const resetDefaults = () => {
  socFractalWeylTimeCrystalEngine.resetDefaults();
  refreshState();
};

const handleClose = () => {
  uiStore.closeOverlay();
};

const loop = () => {
  animTick.value += 0.025;
  socFractalWeylTimeCrystalEngine.update(0.016);
  animId = requestAnimationFrame(loop);
};

onMounted(() => {
  animId = requestAnimationFrame(loop);
  achievements.unlock('soc_fractal_weyl_time_crystal');
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #06181a;
  border: 1px solid #115e59;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  background: #021213;
  border-bottom: 1px solid #115e59;
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
  margin: 0;
  font-size: 18px;
  color: #2dd4bf;
  font-weight: 700;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #5eead4;
  opacity: 0.8;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #134e4a;
  color: #f8fafc;
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
  border: 1px solid #115e59;
}

.tc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  background: #021415;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #115e59;
}

.group-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #2dd4bf;
  margin-bottom: 8px;
}

.btn-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.regime-btn {
  background: #042f2e;
  border: 1px solid #0f766e;
  color: #99f6e4;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: #115e59;
  color: #f8fafc;
}

.regime-btn.active {
  background: #0d9488;
  color: #ffffff;
  border-color: #2dd4bf;
  box-shadow: 0 0 10px rgba(45, 212, 191, 0.4);
}

.slider-row {
  margin-bottom: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #5eead4;
  margin-bottom: 4px;
}

.slider-header .value {
  color: #2dd4bf;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #2dd4bf;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.pulse {
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  box-shadow: 0 0 12px rgba(13, 148, 136, 0.4);
}

.action-btn.pulse:hover {
  background: linear-gradient(135deg, #0f766e, #115e59);
}

.action-btn.reset {
  background: #134e4a;
  color: #99f6e4;
}

.action-btn.reset:hover {
  background: #115e59;
  color: #f8fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #021415;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #115e59;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #5eead4;
  opacity: 0.8;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.text-teal { color: #2dd4bf; }
.text-amber { color: #f59e0b; }
.text-cyan { color: #06b6d4; }
.text-emerald { color: #10b981; }
</style>
