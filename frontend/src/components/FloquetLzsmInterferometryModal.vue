<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚡</span>
          <div>
            <h2>弗洛凱-斯圖克伯格量子位元干涉儀</h2>
            <p class="subtitle">Floquet-LZSM Qubit Interferometry & Coherent Destruction of Tunneling (CDT)</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="lzsm-svg">
            <defs>
              <linearGradient id="lzsmBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#050814" />
                <stop offset="100%" stop-color="#111827" />
              </linearGradient>
              <linearGradient id="fringeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#a855f7" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.8" />
              </linearGradient>
              <filter id="glowLzsm">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#lzsmBgGrad)" rx="8" />

            <!-- Grid Lines -->
            <line v-for="y in 6" :key="'gy' + y" x1="40" :y1="y * 50" x2="760" :y2="y * 50" stroke="#1e293b" stroke-dasharray="3 3" />
            <line v-for="x in 12" :key="'gx' + x" :x1="x * 60 + 20" y1="20" :x2="x * 60 + 20" y2="340" stroke="#1e293b" stroke-dasharray="3 3" />

            <!-- Avoided Crossing Energy Trajectory (Left: x in [40, 480]) -->
            <g transform="translate(0, 0)">
              <!-- Axis Center Line (Energy = 0) -->
              <line x1="40" y1="180" x2="480" y2="180" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="50" y="172" fill="#64748b" font-size="11">E = 0 (避交叉點)</text>

              <!-- Upper / Lower Adiabatic Energy Surfaces E_+(t), E_-(t) -->
              <path :d="getAdiabaticBranchPath(1)" stroke="#38bdf8" stroke-width="2.5" fill="none" filter="url(#glowLzsm)" />
              <path :d="getAdiabaticBranchPath(-1)" stroke="#f43f5e" stroke-width="2.5" fill="none" filter="url(#glowLzsm)" />

              <!-- Avoided Gap Split Marker at Center -->
              <line x1="260" :y1="180 - state.tunnelingDeltaGhz * 18" x2="260" :y2="180 + state.tunnelingDeltaGhz * 18" stroke="#facc15" stroke-width="2" />
              <text x="270" y="184" fill="#facc15" font-size="11" font-family="monospace">
                Δ = {{ state.tunnelingDeltaGhz.toFixed(2) }} GHz
              </text>

              <!-- Landau-Zener Transition Arrows at crossings -->
              <circle cx="260" cy="180" r="14" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3 3" />
              <text x="260" y="215" fill="#c084fc" font-size="10" text-anchor="middle">
                P_LZ = {{ (state.transitionProbPlz * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- Stückelberg Diamond Fringes & Bessel CDT Gauge (Right: x in [520, 760]) -->
            <g transform="translate(520, 30)">
              <rect x="0" y="0" width="240" height="300" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="120" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                斯圖克伯格干涉與 CDT 相消
              </text>

              <!-- Diamond Fringe Visualization -->
              <g transform="translate(120, 100)">
                <polygon
                  :points="getDiamondPoints()"
                  fill="url(#fringeGrad)"
                  stroke="#38bdf8"
                  stroke-width="1.5"
                  :fill-opacity="state.excitedStatePopulation * 0.75 + 0.15"
                />
                <circle cx="0" cy="0" r="4" fill="#facc15" />
                <text x="0" y="4" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  Φ_St={{ (state.stuckelbergPhaseRad / Math.PI).toFixed(2) }}π
                </text>
              </g>

              <!-- Population Bar Gauge -->
              <g transform="translate(30, 180)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">激發態布居 P_+</text>
                <rect x="0" y="10" width="180" height="14" fill="#1e293b" rx="4" />
                <rect
                  x="0"
                  y="10"
                  :width="state.excitedStatePopulation * 180"
                  height="14"
                  :fill="state.coherentDestructionActive ? '#10b981' : '#38bdf8'"
                  rx="4"
                />
                <text x="90" y="22" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  {{ (state.excitedStatePopulation * 100).toFixed(1) }}%
                </text>
              </g>

              <!-- Bessel J_0 Value & CDT Status -->
              <g transform="translate(30, 230)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">貝索函數 J_0(A/ω): <tspan fill="#f59e0b">{{ state.besselJ0Val.toFixed(3) }}</tspan></text>
                <rect
                  v-if="state.coherentDestructionActive"
                  x="0"
                  y="12"
                  width="180"
                  height="24"
                  fill="#064e3b"
                  stroke="#10b981"
                  rx="4"
                />
                <text
                  v-if="state.coherentDestructionActive"
                  x="90"
                  y="28"
                  fill="#34d399"
                  font-size="11"
                  text-anchor="middle"
                  font-weight="bold"
                >
                  ✓ CDT 穿隧相消凍結
                </text>
                <text v-else x="0" y="28" fill="#64748b" font-size="10">
                  A / ω = {{ (state.driveAmplitudeAGhz / state.driveFrequencyOmegaGhz).toFixed(2) }} (距 CDT 零點)
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">靜態偏置 ε₀</span>
            <span class="value">{{ state.biasEpsilon0Ghz.toFixed(2) }} GHz</span>
            <span class="sub">DC 能級失諧</span>
          </div>
          <div class="metric-card">
            <span class="label">驅動參數 A / ω</span>
            <span class="value">{{ (state.driveAmplitudeAGhz / state.driveFrequencyOmegaGhz).toFixed(2) }}</span>
            <span class="sub">A = {{ state.driveAmplitudeAGhz.toFixed(1) }} GHz, ω = {{ state.driveFrequencyOmegaGhz.toFixed(1) }} GHz</span>
          </div>
          <div class="metric-card">
            <span class="label">斯圖克伯格相位 Φ_St</span>
            <span class="value highlight">{{ (state.stuckelbergPhaseRad / Math.PI).toFixed(2) }} π</span>
            <span class="sub">雙路徑幾何干涉</span>
          </div>
          <div class="metric-card">
            <span class="label">干涉相干模式</span>
            <span class="value" :class="{ 'cdt-glow': state.coherentDestructionActive }">
              {{ state.coherentDestructionActive ? 'CDT 穿隧相消' : state.regime }}
            </span>
            <span class="sub">P_LZ = {{ (state.transitionProbPlz * 100).toFixed(1) }}%</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>靜態偏置 ε₀ (GHz):</label>
            <input
              type="range"
              min="-6.0"
              max="6.0"
              step="0.1"
              :value="state.biasEpsilon0Ghz"
              @input="onBiasChange"
            />
            <span class="range-val">{{ state.biasEpsilon0Ghz.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>驅動振幅 A (GHz):</label>
            <input
              type="range"
              min="0.2"
              max="12.0"
              step="0.1"
              :value="state.driveAmplitudeAGhz"
              @input="onAmplitudeChange"
            />
            <span class="range-val">{{ state.driveAmplitudeAGhz.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>驅動頻率 ω/2π (GHz):</label>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              :value="state.driveFrequencyOmegaGhz"
              @input="onFreqChange"
            />
            <span class="range-val">{{ state.driveFrequencyOmegaGhz.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>穿隧分裂 Δ (GHz):</label>
            <input
              type="range"
              min="0.05"
              max="1.5"
              step="0.05"
              :value="state.tunnelingDeltaGhz"
              @input="onDeltaChange"
            />
            <span class="range-val">{{ state.tunnelingDeltaGhz.toFixed(2) }}</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'lzsm-fringes' }"
              @click="setRegime('lzsm-fringes')"
            >
              菱形相干干涉條紋
            </button>
            <button
              class="regime-btn cdt"
              :class="{ active: state.regime === 'coherent-destruction' }"
              @click="setRegime('coherent-destruction')"
            >
              CDT 穿隧相消 (J₀=0)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'adiabatic-passage' }"
              @click="setRegime('adiabatic-passage')"
            >
              絕熱通過 (RAP)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'multiphoton-resonance' }"
              @click="setRegime('multiphoton-resonance')"
            >
              多光子共振 (ε₀=nω)
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerChirp">
              ⚡ 激發 LZSM 相干干涉音律
            </button>
            <button class="action-btn secondary" @click="cycleRegime">
              🔄 輪換干涉動力學機制
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { floquetLzsmEngine, type FloquetLzsmState, type LzsmRegime } from '../engine/floquetLzsmQubitInterferometry';
import { useUiStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUiStore();
const state = ref<FloquetLzsmState>(floquetLzsmEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = floquetLzsmEngine.getState();
};

onMounted(() => {
  achievements.unlock('floquet_lzsm_qubit_interferometry');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeModals();
};

const onBiasChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetLzsmEngine.setBias(val);
  refresh();
};

const onAmplitudeChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetLzsmEngine.setDriveAmplitude(val);
  refresh();
};

const onFreqChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetLzsmEngine.setDriveFrequency(val);
  refresh();
};

const onDeltaChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetLzsmEngine.setTunneling(val);
  refresh();
};

const setRegime = (regime: LzsmRegime) => {
  floquetLzsmEngine.setRegime(regime);
  refresh();
};

const cycleRegime = () => {
  floquetLzsmEngine.cycleRegime();
  refresh();
};

const triggerChirp = () => {
  floquetLzsmEngine.playInterferenceChirp();
};

const getAdiabaticBranchPath = (sign: number) => {
  const points: string[] = [];
  const A = state.value.driveAmplitudeAGhz;
  const eps0 = state.value.biasEpsilon0Ghz;
  const Delta = state.value.tunnelingDeltaGhz;

  for (let x = 40; x <= 480; x += 10) {
    const t = ((x - 40) / 440) * 2 * Math.PI;
    const epsT = eps0 + A * Math.cos(t);
    const energy = sign * 0.5 * Math.sqrt(epsT * epsT + Delta * Delta);
    const y = 180 - energy * 16;
    points.push(`${x === 40 ? 'M' : 'L'} ${x} ${y}`);
  }
  return points.join(' ');
};

const getDiamondPoints = () => {
  const scale = 50 + state.value.excitedStatePopulation * 35;
  return `0,${-scale} ${scale * 0.9},0 0,${scale} ${-scale * 0.9},0`;
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

.lzsm-svg {
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
  color: #a855f7;
}

.metric-card .value.cdt-glow {
  color: #34d399;
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
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
  width: 160px;
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
  background: #3b82f6;
  color: #ffffff;
  border-color: #60a5fa;
}

.regime-btn.cdt.active {
  background: #059669;
  border-color: #34d399;
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
