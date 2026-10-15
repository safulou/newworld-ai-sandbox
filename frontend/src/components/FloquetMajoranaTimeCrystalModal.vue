<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚡</span>
          <div>
            <h2>弗洛凱-馬約拉納時間晶體與週期倍增</h2>
            <p class="subtitle">Floquet-Majorana Discrete Time Crystal (DTC) & Subharmonic 2T Period Doubling</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="dtc-svg">
            <defs>
              <linearGradient id="dtcBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="60%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e1b4b" />
              </linearGradient>
              <radialGradient id="majoranaGlow0" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="majoranaGlowPi" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="1" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0" />
              </radialGradient>
              <filter id="glowDtc">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#dtcBgGrad)" rx="8" />

            <!-- Driven Kitaev Chain Lattice Sites (Horizontal Line at y = 100) -->
            <g transform="translate(60, 90)">
              <!-- Chain backbone line -->
              <line x1="0" y1="0" x2="420" y2="0" stroke="#334155" stroke-width="3" />

              <!-- Superconducting p-wave pairing bonds -->
              <path
                v-for="s in 7"
                :key="'bond' + s"
                :d="`M ${(s - 1) * 60} 0 Q ${(s - 0.5) * 60} -25 ${s * 60} 0`"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />

              <!-- Lattice Sites with MBL Disorder Heights -->
              <g v-for="s in 8" :key="'site' + s">
                <!-- Disorder bar -->
                <line
                  :x1="(s - 1) * 60"
                  y1="0"
                  :x2="(s - 1) * 60"
                  :y2="getDisorderBarHeight(s)"
                  stroke="#475569"
                  stroke-width="2"
                />
                <circle
                  :cx="(s - 1) * 60"
                  cy="0"
                  r="6"
                  fill="#0ea5e9"
                />
              </g>

              <!-- Left Boundary: Floquet Majorana 0-Mode -->
              <circle cx="0" cy="0" r="14" fill="url(#majoranaGlow0)" filter="url(#glowDtc)" />
              <circle cx="0" cy="0" r="5" fill="#38bdf8" />
              <text x="0" y="-30" fill="#38bdf8" font-size="11" text-anchor="middle" font-weight="bold">
                γ₀ (E = 0)
              </text>

              <!-- Right Boundary: Floquet Majorana pi-Mode -->
              <circle cx="420" cy="0" r="14" fill="url(#majoranaGlowPi)" filter="url(#glowDtc)" />
              <circle cx="420" cy="0" r="5" fill="#ec4899" />
              <text x="420" y="-30" fill="#f43f5e" font-size="11" text-anchor="middle" font-weight="bold">
                γ_π (E = π/T)
              </text>
            </g>

            <!-- Subharmonic 2T Period-Doubling Stroboscopic Magnetization Wave (y in [180, 320]) -->
            <g transform="translate(60, 240)">
              <!-- Baseline <sigma_z> = 0 -->
              <line x1="0" y1="0" x2="420" y2="0" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="425" y="4" fill="#64748b" font-size="10">⟨σ^z⟩ = 0</text>

              <!-- Drive Pulses markers at each period T -->
              <g v-for="p in 7" :key="'pulse' + p">
                <line :x1="(p - 1) * 70" y1="-50" :x2="(p - 1) * 70" y2="50" stroke="#1e293b" stroke-width="1" />
                <text :x="(p - 1) * 70" y="-55" fill="#94a3b8" font-size="9" text-anchor="middle">
                  {{ p - 1 }}T
                </text>
              </g>

              <!-- 2T Subharmonic Square Wave Trajectory -->
              <path
                :d="getSubharmonicPathSvg()"
                stroke="#facc15"
                stroke-width="2.5"
                fill="none"
                filter="url(#glowDtc)"
              />

              <text x="105" y="45" fill="#facc15" font-size="11" font-weight="bold">
                自發破缺離散時間平移對稱性 (2T 響應)
              </text>
            </g>

            <!-- Fourier Spectrum & Rigidity Gauge (Right Side: 530, 30) -->
            <g transform="translate(530, 30)">
              <rect x="0" y="0" width="240" height="300" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="120" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                亞諧波共振譜 S(ω)
              </text>

              <!-- Spectrum Axis -->
              <line x1="30" y1="130" x2="210" y2="130" stroke="#475569" stroke-width="1.5" />
              <line x1="30" y1="130" x2="30" y2="45" stroke="#475569" stroke-width="1.5" />

              <!-- Subharmonic Peak at omega / 2 -->
              <rect
                :x="120 - 10"
                :y="130 - state.subharmonicPeakIntensity * 75"
                width="20"
                :height="state.subharmonicPeakIntensity * 75"
                fill="#facc15"
                rx="3"
                filter="url(#glowDtc)"
              />
              <text x="120" y="145" fill="#facc15" font-size="11" text-anchor="middle" font-weight="bold">
                ω / 2 (2T)
              </text>
              <text x="120" :y="120 - state.subharmonicPeakIntensity * 75" fill="#ffffff" font-size="10" text-anchor="middle">
                {{ (state.subharmonicPeakIntensity * 100).toFixed(0) }}%
              </text>

              <!-- Fundamental Peak at omega -->
              <rect
                x="185"
                :y="130 - (1.0 - state.subharmonicPeakIntensity) * 45"
                width="15"
                :height="(1.0 - state.subharmonicPeakIntensity) * 45"
                fill="#64748b"
                rx="2"
              />
              <text x="192" y="145" fill="#64748b" font-size="10" text-anchor="middle">
                ω (1T)
              </text>

              <!-- Time Crystal Rigidity Gauge -->
              <g transform="translate(20, 185)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">時間結晶剛性 (抵禦頻率擾動)</text>
                <rect x="0" y="10" width="200" height="14" fill="#1e293b" rx="4" />
                <rect
                  x="0"
                  y="10"
                  :width="state.timeCrystalRigidity * 200"
                  height="14"
                  fill="#10b981"
                  rx="4"
                />
                <text x="100" y="22" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  {{ (state.timeCrystalRigidity * 100).toFixed(1) }}% 剛性平台
                </text>
              </g>

              <!-- Quasi-Energy pi-Mode value -->
              <g transform="translate(20, 240)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">準能級 π-模: <tspan fill="#ec4899">{{ state.quasiEnergyPiModeEv.toFixed(2) }} meV</tspan></text>
                <text x="0" y="18" fill="#94a3b8" font-size="11">MBL 無序 W: <tspan fill="#38bdf8">{{ state.disorderStrengthW.toFixed(1) }}</tspan></text>
                <text x="0" y="34" fill="#64748b" font-size="10">配對能隙 Δ = {{ state.pairingDeltaMev.toFixed(1) }} meV</text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">驅動週期 T</span>
            <span class="value">{{ state.drivePeriodT.toFixed(2) }} ms</span>
            <span class="sub">外加翻轉頻率</span>
          </div>
          <div class="metric-card">
            <span class="label">脈衝翻轉角 θ</span>
            <span class="value">{{ (state.pulseFlipAngleTheta / Math.PI).toFixed(2) }} π</span>
            <span class="sub">誤差抵禦不敏感區</span>
          </div>
          <div class="metric-card">
            <span class="label">2T 亞諧波強度</span>
            <span class="value highlight">{{ (state.subharmonicPeakIntensity * 100).toFixed(1) }}%</span>
            <span class="sub">結晶序參量</span>
          </div>
          <div class="metric-card">
            <span class="label">非平衡態相態</span>
            <span class="value">
              {{ getRegimeLabel(state.regime) }}
            </span>
            <span class="sub">0/π 模: {{ state.majoranaZeroModesCount }}/{{ state.majoranaPiModesCount }}</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>驅動週期 T (ms):</label>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              :value="state.drivePeriodT"
              @input="onPeriodChange"
            />
            <span class="range-val">{{ state.drivePeriodT.toFixed(1) }} ms</span>
          </div>

          <div class="control-row">
            <label>脈衝翻轉角 θ (rad):</label>
            <input
              type="range"
              min="0.5"
              max="3.8"
              step="0.05"
              :value="state.pulseFlipAngleTheta"
              @input="onAngleChange"
            />
            <span class="range-val">{{ (state.pulseFlipAngleTheta / Math.PI).toFixed(2) }} π</span>
          </div>

          <div class="control-row">
            <label>MBL 無序強度 W:</label>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              :value="state.disorderStrengthW"
              @input="onDisorderChange"
            />
            <span class="range-val">{{ state.disorderStrengthW.toFixed(1) }}</span>
          </div>

          <div class="control-row">
            <label>超導配對能隙 Δ (meV):</label>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              :value="state.pairingDeltaMev"
              @input="onDeltaChange"
            />
            <span class="range-val">{{ state.pairingDeltaMev.toFixed(1) }} meV</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'discrete-time-crystal' }"
              @click="setRegime('discrete-time-crystal')"
            >
              離散時間晶體 (2T 亞諧波)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'zero-pi-majorana' }"
              @click="setRegime('zero-pi-majorana')"
            >
              0-π 混合馬約拉納態
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'mbl-protected' }"
              @click="setRegime('mbl-protected')"
            >
              MBL 拓撲凍結態
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'thermal-ergodic' }"
              @click="setRegime('thermal-ergodic')"
            >
              熱化熔化態 (Ergodic)
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerResonance">
              ⚡ 激發 2T 亞諧波時間結晶共振
            </button>
            <button class="action-btn secondary" @click="cycleRegime">
              🔄 輪換時間晶體動力學機制
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { floquetMajoranaTimeCrystalEngine, type FloquetMajoranaTimeCrystalState, type FloquetTimeCrystalRegime } from '../engine/floquetMajoranaTimeCrystal';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<FloquetMajoranaTimeCrystalState>(floquetMajoranaTimeCrystalEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = floquetMajoranaTimeCrystalEngine.getState();
};

onMounted(() => {
  achievements.unlock('floquet_majorana_time_crystal');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeOverlay();
};

const onPeriodChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetMajoranaTimeCrystalEngine.setDrivePeriod(val);
  refresh();
};

const onAngleChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetMajoranaTimeCrystalEngine.setPulseAngle(val);
  refresh();
};

const onDisorderChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetMajoranaTimeCrystalEngine.setDisorder(val);
  refresh();
};

const onDeltaChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetMajoranaTimeCrystalEngine.setPairingDelta(val);
  refresh();
};

const setRegime = (regime: FloquetTimeCrystalRegime) => {
  floquetMajoranaTimeCrystalEngine.setRegime(regime);
  refresh();
};

const cycleRegime = () => {
  floquetMajoranaTimeCrystalEngine.cycleRegime();
  refresh();
};

const triggerResonance = () => {
  floquetMajoranaTimeCrystalEngine.triggerSubharmonicResonance();
  refresh();
};

const getDisorderBarHeight = (siteIdx: number) => {
  const w = state.value.disorderStrengthW;
  const hash = Math.sin(siteIdx * 93.7) * 10000;
  const frac = (hash - Math.floor(hash)) * 2 - 1;
  return frac * w * 3.5;
};

const getSubharmonicPathSvg = () => {
  const points: string[] = [];
  const amp = state.value.subharmonicPeakIntensity * 32.0;

  for (let p = 0; p < 6; p++) {
    const xStart = p * 70;
    const xEnd = (p + 1) * 70;
    const yVal = (p % 2 === 0 ? -1 : 1) * amp;

    if (p === 0) {
      points.push(`M ${xStart} ${yVal}`);
    } else {
      points.push(`L ${xStart} ${yVal}`);
    }
    points.push(`L ${xEnd} ${yVal}`);
  }
  return points.join(' ');
};

const getRegimeLabel = (regime: FloquetTimeCrystalRegime) => {
  switch (regime) {
    case 'discrete-time-crystal': return '離散時間晶體';
    case 'zero-pi-majorana': return '0-π 馬約拉納態';
    case 'mbl-protected': return 'MBL 拓撲凍結';
    case 'thermal-ergodic': return '熱化熔化態';
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

.dtc-svg {
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
  color: #facc15;
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
  background: #eab308;
  color: #000000;
  font-weight: 600;
  border-color: #fde047;
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
  background: #ca8a04;
  color: white;
}

.action-btn.primary:hover {
  background: #eab308;
  color: black;
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
