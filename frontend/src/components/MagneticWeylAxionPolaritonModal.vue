<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🧲</span>
          <div>
            <h2>磁性外爾半金屬軸子極化子與反鐵磁共振</h2>
            <p class="subtitle">Magnetic Weyl Axion Polariton & Antiferromagnetic Resonance</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="polariton-svg">
            <defs>
              <linearGradient id="gapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#dc2626" stop-opacity="0.08" />
              </linearGradient>
              <filter id="glowPolariton">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="#090d16" rx="8" />

            <!-- Left Panel: Dispersion Anti-crossing Branches -->
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="460" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="230" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                軸子極化子反交叉色散譜 ω(k) 與極化能隙
              </text>
              <line x1="40" y1="280" x2="420" y2="280" stroke="#334155" stroke-width="1.5" />
              <line x1="50" y1="40" x2="50" y2="290" stroke="#334155" stroke-width="1.5" />
              <text x="420" y="300" fill="#64748b" font-size="10" text-anchor="end">波矢 k</text>
              <text x="40" y="45" fill="#64748b" font-size="10" text-anchor="end">ω (THz)</text>

              <!-- Polaritonic Bandgap shaded region -->
              <rect
                x="50"
                :y="getFreqY(state.afmResonanceThz + state.polaritonGapWidthThz)"
                width="370"
                :height="getFreqY(state.afmResonanceThz) - getFreqY(state.afmResonanceThz + state.polaritonGapWidthThz)"
                fill="url(#gapGrad)"
                stroke="#f43f5e"
                stroke-width="1"
                stroke-dasharray="3 2"
              />
              <text x="240" :y="getFreqY(state.afmResonanceThz + state.polaritonGapWidthThz * 0.5) + 4" fill="#fb7185" font-size="10" text-anchor="middle" font-family="monospace">
                極化子全反射禁帶 Δω = {{ state.polaritonGapWidthThz.toFixed(2) }} THz
              </text>

              <!-- Uncoupled Light line (omega = c * k) -->
              <line x1="50" y1="280" x2="380" y2="60" stroke="#475569" stroke-width="1" stroke-dasharray="4 4" />
              <!-- Bare AFM magnon resonance line (omega = omega_AFM) -->
              <line x1="50" :y1="getFreqY(state.afmResonanceThz)" x2="420" :y2="getFreqY(state.afmResonanceThz)" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="2 2" />
              <text x="415" :y="getFreqY(state.afmResonanceThz) - 6" fill="#c084fc" font-size="9" text-anchor="end">
                ω_AFM = {{ state.afmResonanceThz.toFixed(1) }} THz
              </text>

              <!-- Upper Polariton Branch (UPB) -->
              <path :d="getUpbPath()" stroke="#38bdf8" stroke-width="2.5" fill="none" filter="url(#glowPolariton)" />

              <!-- Lower Polariton Branch (LPB) -->
              <path :d="getLpbPath()" stroke="#34d399" stroke-width="2.5" fill="none" filter="url(#glowPolariton)" />

              <!-- Current Probe Frequency Indicator Line -->
              <line x1="50" :y1="getFreqY(state.probeFrequencyThz)" x2="420" :y2="getFreqY(state.probeFrequencyThz)" stroke="#facc15" stroke-width="1.8" stroke-dasharray="3 3" />
              <circle cx="65" :cy="getFreqY(state.probeFrequencyThz)" r="4" fill="#facc15" />
              <text x="75" :y="getFreqY(state.probeFrequencyThz) - 6" fill="#facc15" font-size="10" font-weight="bold">
                探測 ω = {{ state.probeFrequencyThz.toFixed(2) }} THz (R = {{ (state.reflectivityR * 100).toFixed(0) }}%)
              </text>
            </g>

            <!-- Right Panel: Faraday Non-reciprocal Polarization Compass -->
            <g transform="translate(520, 20)">
              <rect x="0" y="0" width="250" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="125" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                非互易反常法拉第光學偏振
              </text>

              <!-- Compass circle -->
              <circle cx="125" cy="150" r="70" stroke="#334155" stroke-width="1.5" fill="none" />
              <line x1="125" y1="70" x2="125" y2="230" stroke="#1e293b" stroke-width="1" stroke-dasharray="2 2" />
              <line x1="45" y1="150" x2="205" y2="150" stroke="#1e293b" stroke-width="1" stroke-dasharray="2 2" />

              <!-- Original Polarization vector (along vertical 0 deg) -->
              <line x1="125" y1="150" x2="125" y2="85" stroke="#64748b" stroke-width="2" stroke-dasharray="3 3" />
              <text x="125" y="78" fill="#64748b" font-size="9" text-anchor="middle">入射偏振 (0°)</text>

              <!-- Rotated Faraday vector -->
              <line
                x1="125"
                y1="150"
                :x2="125 + 65 * Math.sin(state.faradayRotationDeg * Math.PI / 180)"
                :y2="150 - 65 * Math.cos(state.faradayRotationDeg * Math.PI / 180)"
                stroke="#ec4899"
                stroke-width="3"
                filter="url(#glowPolariton)"
              />
              <circle
                :cx="125 + 65 * Math.sin(state.faradayRotationDeg * Math.PI / 180)"
                :cy="150 - 65 * Math.cos(state.faradayRotationDeg * Math.PI / 180)"
                r="4"
                fill="#ec4899"
              />

              <!-- Angle Label -->
              <text x="125" y="250" fill="#ec4899" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">
                θF = +{{ state.faradayRotationDeg.toFixed(1) }}°
              </text>
              <text x="125" y="272" fill="#94a3b8" font-size="11" text-anchor="middle">
                柯爾旋轉 θK = {{ state.kerrRotationDeg.toFixed(1) }}°
              </text>
              <text x="125" y="295" fill="#34d399" font-size="10" text-anchor="middle">
                軸子-磁振子雜化: {{ (state.axionMagnonHybridization * 100).toFixed(0) }}%
              </text>
            </g>
          </svg>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card highlight">
            <span class="label">極化子禁帶寬度 Δω</span>
            <span class="value rose">{{ state.polaritonGapWidthThz.toFixed(2) }} THz</span>
          </div>
          <div class="metric-card">
            <span class="label">探測光反射率 R</span>
            <span class="value" :class="state.reflectivityR > 0.9 ? 'rose' : 'green'">
              {{ (state.reflectivityR * 100).toFixed(1) }}% {{ state.reflectivityR > 0.9 ? '(全反射)' : '' }}
            </span>
          </div>
          <div class="metric-card">
            <span class="label">非互易法拉第角 θF</span>
            <span class="value pink">+{{ state.faradayRotationDeg.toFixed(1) }}°</span>
          </div>
          <div class="metric-card">
            <span class="label">反鐵磁共振 ω_AFM</span>
            <span class="value purple">{{ state.afmResonanceThz.toFixed(2) }} THz</span>
          </div>
          <div class="metric-card">
            <span class="label">外爾軸子動量 b0</span>
            <span class="value cyan">{{ state.weylSeparationB0Ev.toFixed(2) }} eV</span>
          </div>
          <div class="metric-card">
            <span class="label">當前體制狀態</span>
            <span class="value yellow">{{ getRegimeLabel(state.regime) }}</span>
          </div>
        </div>

        <!-- Sliders -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>探測光頻率 ω / 2π</span>
              <span class="slider-val">{{ state.probeFrequencyThz.toFixed(2) }} THz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.02"
              :value="state.probeFrequencyThz"
              @input="updateProbeFreq(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.5 THz (下支)</span>
              <span>{{ state.afmResonanceThz.toFixed(1) }} THz (能隙)</span>
              <span>2.5 THz (上支)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>反鐵磁共振頻率 ω_AFM</span>
              <span class="slider-val">{{ state.afmResonanceThz.toFixed(2) }} THz</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.0"
              step="0.05"
              :value="state.afmResonanceThz"
              @input="updateAfm(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.6 THz</span>
              <span>1.2 THz (典型 EuCd2As2)</span>
              <span>2.0 THz</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>外爾軸子動量分離 b0</span>
              <span class="slider-val">{{ state.weylSeparationB0Ev.toFixed(2) }} eV</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.02"
              :value="state.weylSeparationB0Ev"
              @input="updateWeylSep(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.10 eV</span>
              <span>0.25 eV</span>
              <span>0.80 eV (強耦合)</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerResonance">
            ⚡ 一鍵激發軸子極化子反交叉共振
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉體制: {{ getRegimeLabel(state.regime) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { magneticWeylAxionEngine, MagneticWeylAxionState, AxionPolaritonRegime } from '@/engine/magneticWeylAxionPolariton';
import { useUIStore } from '@/stores/ui';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const state = ref<MagneticWeylAxionState>(magneticWeylAxionEngine.getState());
let timer: number | null = null;

onMounted(() => {
  achievements.unlock('magnetic_weyl_axion_polariton');
  timer = window.setInterval(() => {
    state.value = magneticWeylAxionEngine.getState();
  }, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleClose() {
  uiStore.closeOverlay();
}

function updateProbeFreq(val: number) {
  magneticWeylAxionEngine.setProbeFrequency(val);
  state.value = magneticWeylAxionEngine.getState();
  achievements.unlock('magnetic_weyl_axion_polariton');
}

function updateAfm(val: number) {
  magneticWeylAxionEngine.setAfmResonance(val);
  state.value = magneticWeylAxionEngine.getState();
}

function updateWeylSep(val: number) {
  magneticWeylAxionEngine.setWeylSeparation(val);
  state.value = magneticWeylAxionEngine.getState();
  achievements.unlock('magnetic_weyl_axion_polariton');
}

function triggerResonance() {
  magneticWeylAxionEngine.triggerPolaritonResonance();
  state.value = magneticWeylAxionEngine.getState();
  achievements.unlock('magnetic_weyl_axion_polariton');
}

function cycleRegime() {
  magneticWeylAxionEngine.cycleRegime();
  state.value = magneticWeylAxionEngine.getState();
  achievements.unlock('magnetic_weyl_axion_polariton');
}

function getRegimeLabel(r: AxionPolaritonRegime): string {
  switch (r) {
    case 'afm-quiescent': return '寧靜反鐵磁態';
    case 'axion-polariton-gap': return '極化子能隙態';
    case 'non-reciprocal-faraday': return '非互易法拉第態';
    case 'weyl-node-annihilation': return '外爾節點湮滅態';
  }
}

function getFreqY(freqThz: number): number {
  // Mapping frequency [0.0 to 2.5 THz] to SVG Y [280 to 50]
  const clamped = Math.max(0.0, Math.min(2.5, freqThz));
  return 280 - (clamped / 2.5) * 230;
}

function getUpbPath(): string {
  const w_afm = state.value.afmResonanceThz;
  const gap = state.value.polaritonGapWidthThz;
  let path = '';

  for (let k = 0; k <= 350; k += 10) {
    const ck = (k / 350) * 2.5;
    // Upper branch asymptotic to sqrt(ck^2 + (w_afm + gap)^2)
    const w = Math.sqrt(ck * ck * 0.7 + Math.pow(w_afm + gap, 2));
    const svgX = 50 + k;
    const svgY = getFreqY(w);
    if (k === 0) path += `M ${svgX} ${svgY}`;
    else path += ` L ${svgX} ${svgY}`;
  }
  return path;
}

function getLpbPath(): string {
  const w_afm = state.value.afmResonanceThz;
  let path = '';

  for (let k = 0; k <= 350; k += 10) {
    const ck = (k / 350) * 2.5;
    // Lower branch asymptotic to w_afm as k -> infinity
    const w = (w_afm * ck) / Math.sqrt(ck * ck + w_afm * w_afm * 0.6);
    const svgX = 50 + k;
    const svgY = getFreqY(w);
    if (k === 0) path += `M ${svgX} ${svgY}`;
    else path += ` L ${svgX} ${svgY}`;
  }
  return path;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 96vw;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
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
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.title-wrap .subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
}
.close-btn:hover {
  color: #f1f5f9;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.viz-container {
  width: 100%;
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.polariton-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-card.highlight {
  border-color: #f43f5e;
  background: rgba(244, 63, 94, 0.05);
}

.metric-card .label {
  font-size: 11px;
  color: #94a3b8;
}

.metric-card .value {
  font-size: 15px;
  font-weight: 700;
  font-family: monospace;
}

.value.rose { color: #f43f5e; }
.value.pink { color: #ec4899; }
.value.cyan { color: #38bdf8; }
.value.green { color: #34d399; }
.value.purple { color: #c084fc; }
.value.yellow { color: #facc15; }

.controls-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 16px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
}

.slider-val {
  font-family: monospace;
  font-weight: 700;
  color: #38bdf8;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.slider-hints {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
}

.actions-row {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: #e11d48;
  color: #fff;
}
.btn-primary:hover {
  background: #be123c;
}

.btn-secondary {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}
.btn-secondary:hover {
  background: #334155;
  color: #fff;
}
</style>
