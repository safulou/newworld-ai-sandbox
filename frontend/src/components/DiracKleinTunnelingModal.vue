<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🎯</span>
          <div>
            <h2>狄拉克克萊因穿隧與 Veselago 負折射透鏡</h2>
            <p class="subtitle">Dirac Klein Tunneling & Negative Refractive Index Veselago Lens</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="klein-svg">
            <defs>
              <linearGradient id="barrierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.1" />
              </linearGradient>
              <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background & Grid -->
            <rect x="0" y="0" width="800" height="360" fill="#090d16" rx="8" />
            <line v-for="y in 6" :key="'gy' + y" x1="40" :y1="y * 50" x2="760" :y2="y * 50" stroke="#1e293b" stroke-dasharray="3 3" />
            <line v-for="x in 12" :key="'gx' + x" :x1="x * 60 + 20" y1="20" :x2="x * 60 + 20" y2="340" stroke="#1e293b" stroke-dasharray="3 3" />

            <!-- Potential Barrier Region V(x) -->
            <rect x="300" y="30" width="200" height="300" fill="url(#barrierGrad)" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4 2" />
            <text x="400" y="55" fill="#93c5fd" font-size="12" text-anchor="middle" font-family="monospace">
              靜電勢壘 V0 = {{ state.barrierHeightEv.toFixed(2) }} eV (寬度 D = {{ state.barrierWidthNm.toFixed(0) }} nm)
            </text>

            <!-- Region 1, 2, 3 labels -->
            <text x="160" y="60" fill="#64748b" font-size="11" text-anchor="middle">區域 I: 狄拉克電子 (n1 = +1)</text>
            <text x="400" y="315" fill="#f43f5e" font-size="11" text-anchor="middle">
              區域 II: 狄拉克電洞 (n2 = {{ state.refractiveIndexN2.toFixed(2) }})
            </text>
            <text x="640" y="60" fill="#64748b" font-size="11" text-anchor="middle">區域 III: 穿透電子 (n3 = +1)</text>

            <!-- Normal Interface Boundary Line -->
            <line x1="300" y1="30" x2="300" y2="330" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2" />
            <line x1="500" y1="30" x2="500" y2="330" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2" />

            <!-- Normal Axis Reference at impact point -->
            <line x1="200" y1="180" x2="400" y2="180" stroke="#475569" stroke-width="1" stroke-dasharray="4 4" />

            <!-- Incident Dirac Ray (Angle theta) -->
            <path
              :d="`M ${300 - 180 * Math.cos(state.incidentAngleDeg * Math.PI / 180)} ${180 - 180 * Math.sin(state.incidentAngleDeg * Math.PI / 180)} L 300 180`"
              stroke="#38bdf8"
              stroke-width="3.5"
              fill="none"
              filter="url(#glow)"
            />

            <!-- Reflected Dirac Ray (Angle -theta) with amplitude 1 - T -->
            <path
              v-if="state.reflectionProbability > 0.01"
              :d="`M 300 180 L ${300 - 120 * Math.cos(state.incidentAngleDeg * Math.PI / 180)} ${180 + 120 * Math.sin(state.incidentAngleDeg * Math.PI / 180)}`"
              stroke="#f43f5e"
              :stroke-width="Math.max(1, state.reflectionProbability * 3)"
              stroke-opacity="0.8"
              stroke-dasharray="3 2"
              fill="none"
            />

            <!-- Negative Refraction Inside Barrier (Veselago Ray bends to the SAME side of normal!) -->
            <path
              :d="getNegativeRefractionPath()"
              stroke="#ec4899"
              stroke-width="3"
              fill="none"
              filter="url(#glow)"
            />

            <!-- Transmitted Ray (exiting at x = 500) -->
            <path
              :d="getTransmittedPath()"
              stroke="#10b981"
              stroke-width="3"
              fill="none"
              filter="url(#glow)"
            />

            <!-- Caustic Veselago Focal Point -->
            <circle :cx="getFocalX()" :cy="180" r="5" fill="#facc15" filter="url(#glow)" />
            <text :x="getFocalX()" y="165" fill="#facc15" font-size="11" text-anchor="middle" font-weight="bold">
              Veselago 焦點 (fv={{ state.veselagoFocalLengthNm.toFixed(0) }}nm)
            </text>

            <!-- Polar / Angular Transmission Spectrum Miniature curve -->
            <g transform="translate(680, 200)">
              <rect x="-60" y="-70" width="120" height="130" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="0" y="-52" fill="#94a3b8" font-size="10" text-anchor="middle">透射譜 T(θ)</text>
              <line x1="-50" y1="40" x2="50" y2="40" stroke="#475569" stroke-width="1" />
              <line x1="-50" y1="-40" x2="-50" y2="40" stroke="#475569" stroke-width="1" />
              <!-- Spectrum line -->
              <path :d="getTransmissionCurveSvg()" stroke="#38bdf8" stroke-width="2" fill="none" />
              <!-- Current Angle Marker -->
              <circle :cx="-50 + (state.incidentAngleDeg / 80) * 100" :cy="40 - state.actualTransmission * 75" r="4" fill="#ec4899" />
            </g>

            <!-- Angle Indicator Arc -->
            <text x="240" y="165" fill="#38bdf8" font-size="12" font-family="monospace">
              θ = {{ state.incidentAngleDeg.toFixed(1) }}°
            </text>
          </svg>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card highlight">
            <span class="label">正入射透射率 T(0)</span>
            <span class="value cyan">{{ (state.normalTransmission * 100).toFixed(1) }}% (完美穿隧)</span>
          </div>
          <div class="metric-card">
            <span class="label">當前傾斜透射率 T(θ)</span>
            <span class="value" :class="state.actualTransmission > 0.8 ? 'green' : 'amber'">
              {{ (state.actualTransmission * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="metric-card">
            <span class="label">勢壘有效折射率 n2</span>
            <span class="value rose">{{ state.refractiveIndexN2.toFixed(2) }} (負折射)</span>
          </div>
          <div class="metric-card">
            <span class="label">Veselago 焦點距離 fv</span>
            <span class="value yellow">{{ state.veselagoFocalLengthNm.toFixed(1) }} nm</span>
          </div>
          <div class="metric-card">
            <span class="label">往返干涉相位 2 qx D</span>
            <span class="value purple">{{ state.fabryPerotPhaseRad.toFixed(2) }} rad</span>
          </div>
          <div class="metric-card">
            <span class="label">背向散射反射率 R</span>
            <span class="value orange">{{ (state.reflectionProbability * 100).toFixed(1) }}%</span>
          </div>
        </div>

        <!-- Interactive Sliders -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>入射角度 θ</span>
              <span class="slider-val">{{ state.incidentAngleDeg.toFixed(1) }}°</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="75.0"
              step="0.5"
              :value="state.incidentAngleDeg"
              @input="updateAngle(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.0° (完美穿隧)</span>
              <span>15.0° (法布里-佩羅)</span>
              <span>75.0° (全反射)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>入射電子能 E</span>
              <span class="slider-val">{{ state.incidentEnergyEv.toFixed(2) }} eV</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.02"
              :value="state.incidentEnergyEv"
              @input="updateEnergy(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.05 eV</span>
              <span>0.15 eV (狄拉克)</span>
              <span>0.80 eV</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>靜電勢壘高度 V0</span>
              <span class="slider-val">{{ state.barrierHeightEv.toFixed(2) }} eV</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.50"
              step="0.05"
              :value="state.barrierHeightEv"
              @input="updateBarrierHeight(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.10 eV</span>
              <span>0.35 eV (p-n 結)</span>
              <span>1.50 eV (高能障)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>勢壘空間寬度 D</span>
              <span class="slider-val">{{ state.barrierWidthNm.toFixed(0) }} nm</span>
            </div>
            <input
              type="range"
              min="20.0"
              max="150.0"
              step="5.0"
              :value="state.barrierWidthNm"
              @input="updateBarrierWidth(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>20 nm</span>
              <span>50 nm</span>
              <span>150 nm</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerPerfectKlein">
            ⚡ 一鍵激發垂直克萊因穿隧 (θ = 0°)
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
import { diracKleinTunnelingEngine, DiracKleinState, KleinRegime } from '@/engine/diracKleinTunnelingVeselago';
import { useUIStore } from '@/stores/ui';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const state = ref<DiracKleinState>(diracKleinTunnelingEngine.getState());
let timer: number | null = null;

onMounted(() => {
  achievements.unlock('dirac_klein_tunneling_veselago');
  timer = window.setInterval(() => {
    state.value = diracKleinTunnelingEngine.getState();
  }, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleClose() {
  uiStore.closeOverlay();
}

function updateAngle(val: number) {
  diracKleinTunnelingEngine.setIncidentAngle(val);
  state.value = diracKleinTunnelingEngine.getState();
  achievements.unlock('dirac_klein_tunneling_veselago');
}

function updateEnergy(val: number) {
  diracKleinTunnelingEngine.setIncidentEnergy(val);
  state.value = diracKleinTunnelingEngine.getState();
  achievements.unlock('dirac_klein_tunneling_veselago');
}

function updateBarrierHeight(val: number) {
  diracKleinTunnelingEngine.setBarrierHeight(val);
  state.value = diracKleinTunnelingEngine.getState();
  achievements.unlock('dirac_klein_tunneling_veselago');
}

function updateBarrierWidth(val: number) {
  diracKleinTunnelingEngine.setBarrierWidth(val);
  state.value = diracKleinTunnelingEngine.getState();
}

function triggerPerfectKlein() {
  diracKleinTunnelingEngine.triggerPerfectTunneling();
  state.value = diracKleinTunnelingEngine.getState();
  achievements.unlock('dirac_klein_tunneling_veselago');
}

function cycleRegime() {
  diracKleinTunnelingEngine.cycleRegime();
  state.value = diracKleinTunnelingEngine.getState();
  achievements.unlock('dirac_klein_tunneling_veselago');
}

function getRegimeLabel(r: KleinRegime): string {
  switch (r) {
    case 'normal-klein': return '正入射克萊因穿隧 (T=1.0)';
    case 'fabry-perot': return '法布里-佩羅諧振干涉';
    case 'veselago-lens': return 'Veselago 負折射透鏡';
    case 'magnetic-confined': return '強磁場邊緣態約束';
  }
}

// Geometric calculations for SVG rays
function getNegativeRefractionPath(): string {
  const theta = (state.value.incidentAngleDeg * Math.PI) / 180;
  const n2 = state.value.refractiveIndexN2;
  // Snell's law: sin(theta') = sin(theta) / n2
  const sinThetaPrime = Math.sin(theta) / Math.abs(n2);
  const clampedSin = Math.max(-1.0, Math.min(1.0, sinThetaPrime));
  const thetaPrime = Math.asin(clampedSin);

  // Negative refraction: in Veselago lens, the beam refracts to the SAME side of the normal (positive Y offset!)
  const dy = 200 * Math.tan(thetaPrime);
  return `M 300 180 L 500 ${180 + dy}`;
}

function getTransmittedPath(): string {
  const theta = (state.value.incidentAngleDeg * Math.PI) / 180;
  const n2 = state.value.refractiveIndexN2;
  const sinThetaPrime = Math.sin(theta) / Math.abs(n2);
  const clampedSin = Math.max(-1.0, Math.min(1.0, sinThetaPrime));
  const thetaPrime = Math.asin(clampedSin);
  const dy = 200 * Math.tan(thetaPrime);

  // Exiting barrier: refracts back to original angle
  const exitY = 180 + dy;
  const targetX = 660;
  const targetY = exitY + (targetX - 500) * Math.tan(theta);
  return `M 500 ${exitY} L ${targetX} ${targetY}`;
}

function getFocalX(): number {
  return 500 + Math.min(120, state.value.veselagoFocalLengthNm * 1.5);
}

function getTransmissionCurveSvg(): string {
  let path = '';
  for (let a = 0; a <= 80; a += 5) {
    const t = diracKleinTunnelingEngine.calculateTransmission(a);
    const x = -50 + (a / 80) * 100;
    const y = 40 - t * 75;
    if (a === 0) path += `M ${x} ${y}`;
    else path += ` L ${x} ${y}`;
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

.klein-svg {
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
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.05);
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

.value.cyan { color: #38bdf8; }
.value.green { color: #34d399; }
.value.amber { color: #f59e0b; }
.value.rose { color: #fb7185; }
.value.yellow { color: #facc15; }
.value.purple { color: #c084fc; }
.value.orange { color: #fb923c; }

.controls-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  background: #0284c7;
  color: #fff;
}
.btn-primary:hover {
  background: #0369a1;
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
