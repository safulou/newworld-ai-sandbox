<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">❄️</span>
          <div>
            <h2>莫爾拓撲激子絕緣體與對流超流反應堆</h2>
            <p class="subtitle">TMD Moiré Interlayer Excitons, Excitonic Insulator & Counterflow Superfluid BEC</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="exciton-svg">
            <defs>
              <linearGradient id="excitonBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020817" />
                <stop offset="50%" stop-color="#08142b" />
                <stop offset="100%" stop-color="#051b24" />
              </linearGradient>

              <radialGradient id="holeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="becCondensateGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.6" />
                <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>

              <filter id="glowExciton">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#excitonBg)" rx="8" />

            <!-- Moiré Superlattice Hexagonal Periodic Wells -->
            <g opacity="0.35">
              <polygon
                v-for="h in 8"
                :key="'moire-hex' + h"
                :points="getHexPoints(h * 90 - 20, 180, 42)"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />
            </g>

            <!-- Macroscopic BEC Phase Coherence Blanket Glow -->
            <rect
              v-if="state.counterflowSuperfluidActive"
              x="30"
              y="60"
              width="500"
              height="240"
              fill="url(#becCondensateGlow)"
              rx="12"
              filter="url(#glowExciton)"
            />

            <!-- Top Layer: WSe2 (Holes +e, Drift Right) -->
            <g transform="translate(40, 100)">
              <line x1="0" y1="0" x2="480" y2="0" stroke="#f43f5e" stroke-width="2.5" opacity="0.8" />
              <text x="495" y="4" fill="#f43f5e" font-size="11" font-weight="bold">WSe₂ (電洞層 +e)</text>

              <!-- Drifting Holes -->
              <g
                v-for="i in 7"
                :key="'hole' + i"
                :transform="`translate(${getHoleX(i)}, 0)`"
              >
                <circle cx="0" cy="0" r="12" fill="url(#holeGlow)" filter="url(#glowExciton)" />
                <circle cx="0" cy="0" r="4.5" fill="#fb7185" />
                <text x="0" y="3" fill="#ffffff" font-size="8" text-anchor="middle" font-weight="bold">+</text>
              </g>
            </g>

            <!-- Van der Waals Dielectric Tunnel Gap (y = 100 to 260) -->
            <g transform="translate(40, 0)">
              <!-- Interlayer Exciton Coulomb Dipole Springs -->
              <g v-for="i in 7" :key="'dipole' + i">
                <line
                  :x1="getHoleX(i)"
                  y1="100"
                  :x2="getElectronX(i)"
                  y2="260"
                  :stroke="state.excitonOrderParamMeV > 0 ? '#c084fc' : '#64748b'"
                  :stroke-width="state.excitonOrderParamMeV > 0 ? 2 : 1"
                  :stroke-dasharray="state.excitonOrderParamMeV > 0 ? 'none' : '4 4'"
                  filter="url(#glowExciton)"
                />
              </g>
            </g>

            <!-- Bottom Layer: MoSe2 (Electrons -e, Counterflow Drift Left) -->
            <g transform="translate(40, 260)">
              <line x1="0" y1="0" x2="480" y2="0" stroke="#38bdf8" stroke-width="2.5" opacity="0.8" />
              <text x="495" y="4" fill="#38bdf8" font-size="11" font-weight="bold">MoSe₂ (電子層 -e)</text>

              <!-- Drifting Electrons -->
              <g
                v-for="i in 7"
                :key="'elec' + i"
                :transform="`translate(${getElectronX(i)}, 0)`"
              >
                <circle cx="0" cy="0" r="12" fill="url(#electronGlow)" filter="url(#glowExciton)" />
                <circle cx="0" cy="0" r="4.5" fill="#38bdf8" />
                <text x="0" y="3" fill="#ffffff" font-size="8" text-anchor="middle" font-weight="bold">-</text>
              </g>
            </g>

            <!-- Counterflow Supercurrent Indicator Vectors -->
            <g transform="translate(40, 180)">
              <line x1="160" y1="-25" x2="260" y2="-25" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow)" />
              <text x="210" y="-35" fill="#f43f5e" font-size="10" text-anchor="middle" font-weight="bold">J_hole →</text>

              <line x1="260" y1="25" x2="160" y2="25" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)" />
              <text x="210" y="40" fill="#38bdf8" font-size="10" text-anchor="middle" font-weight="bold">← J_electron</text>

              <rect x="330" y="-20" width="160" height="40" fill="#0b1329" stroke="#334155" rx="6" />
              <text x="410" y="4" fill="#a855f7" font-size="11" text-anchor="middle" font-weight="bold">
                J_CF = J_h - J_e (無耗散)
              </text>
            </g>

            <!-- Diagnostics Telemetry HUD (Right Side) -->
            <g transform="translate(560, 25)">
              <rect x="0" y="0" width="225" height="165" fill="#0b1329" opacity="0.85" rx="6" stroke="#334155" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">激子絕緣體物理遙測</text>

              <text x="14" y="48" fill="#94a3b8" font-size="10">莫爾扭轉角 θ:</text>
              <text x="210" y="48" fill="#f8fafc" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.twistAngleDeg.toFixed(2) }}°
              </text>

              <text x="14" y="70" fill="#94a3b8" font-size="10">激子結合能 E_b:</text>
              <text x="210" y="70" fill="#ec4899" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.excitonBindingEnergyMeV.toFixed(1) }} meV
              </text>

              <text x="14" y="92" fill="#94a3b8" font-size="10">單粒子能隙 Δ_0:</text>
              <text x="210" y="92" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.singleParticleGapMeV.toFixed(1) }} meV
              </text>

              <text x="14" y="114" fill="#94a3b8" font-size="10">激子序參量 Δ_exc:</text>
              <text x="210" y="114" fill="#34d399" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.excitonOrderParamMeV.toFixed(1) }} meV
              </text>

              <text x="14" y="136" fill="#94a3b8" font-size="10">BKT 臨界溫度 T_c:</text>
              <text x="210" y="136" fill="#facc15" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.bktTransitionTempKelvin.toFixed(1) }} K
              </text>

              <text x="14" y="156" fill="#94a3b8" font-size="10">拓撲陳數 C_exc:</text>
              <text x="210" y="156" fill="#38bdf8" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.topologicalChernNum }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: Moiré Twist Angle -->
          <div class="control-card">
            <div class="control-header">
              <label>莫爾扭轉角 θ (度)</label>
              <span class="value-badge">{{ state.twistAngleDeg.toFixed(2) }}°</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="4.5"
              step="0.05"
              :value="state.twistAngleDeg"
              @input="onAngleChange"
              class="slider"
            />
            <p class="control-desc">調控莫爾超晶格微觀週期與層間波函數重疊</p>
          </div>

          <!-- Slider 2: Exciton Binding Energy -->
          <div class="control-card">
            <div class="control-header">
              <label>層間激子結合能 E_b (meV)</label>
              <span class="value-badge">{{ state.excitonBindingEnergyMeV.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="40.0"
              max="220.0"
              step="2.0"
              :value="state.excitonBindingEnergyMeV"
              @input="onEbChange"
              class="slider"
            />
            <p class="control-desc">當 E_b > Δ_0 時自發破缺 U(1) 進入激子絕緣相</p>
          </div>

          <!-- Slider 3: Single Particle Gap -->
          <div class="control-card">
            <div class="control-header">
              <label>單粒子帶隙 Δ_0 (meV)</label>
              <span class="value-badge">{{ state.singleParticleGapMeV.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="20.0"
              max="180.0"
              step="2.0"
              :value="state.singleParticleGapMeV"
              @input="onGapChange"
              class="slider"
            />
            <p class="control-desc">未配對電子-電洞能帶禁帶寬度</p>
          </div>

          <!-- Slider 4: Exciton Density -->
          <div class="control-card">
            <div class="control-header">
              <label>激子面密度 n_exc (10¹² cm⁻²)</label>
              <span class="value-badge">{{ state.excitonDensityCm2.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="8.0"
              step="0.1"
              :value="state.excitonDensityCm2"
              @input="onDensityChange"
              class="slider"
            />
            <p class="control-desc">直接決定 BKT 超流凝聚臨界相變溫度</p>
          </div>
        </div>

        <!-- Regime Selector & Actions -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'exciton-gas' }]"
              @click="setRegime('exciton-gas')"
            >
              激子氣體相
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'topological-excitonic-insulator' }]"
              @click="setRegime('topological-excitonic-insulator')"
            >
              拓撲激子絕緣體
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'exciton-bec-condensate' }]"
              @click="setRegime('exciton-bec-condensate')"
            >
              激子玻色凝聚態
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'counterflow-superfluid' }]"
              @click="setRegime('counterflow-superfluid')"
            >
              對流超流臨界相
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerCounterflow">
              ⚡ 激發對流超流突變
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">激子序參量 Δ_exc</span>
            <span class="metric-value text-emerald">{{ state.excitonOrderParamMeV.toFixed(1) }} meV</span>
            <span class="metric-sub">Δ_exc = √(E_b² - Δ_0²)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">BKT 凝聚臨界溫度 T_c</span>
            <span class="metric-value text-amber">{{ state.bktTransitionTempKelvin.toFixed(1) }} K</span>
            <span class="metric-sub">Berezinskii-Kosterlitz-Thouless</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">對流超流臨界速度 v_c</span>
            <span class="metric-value text-cyan">{{ (state.counterflowCriticalVelocityMs / 1000).toFixed(1) }} km/s</span>
            <span class="metric-sub">v_c = √(Δ_exc / m_exc)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">對流超流狀態 (Counterflow)</span>
            <span class="metric-value" :class="state.counterflowSuperfluidActive ? 'text-purple' : 'text-slate'">
              {{ state.counterflowSuperfluidActive ? '🌊 零耗散超流 (ρ_CF=0)' : '💤 普通耗散態' }}
            </span>
            <span class="metric-sub">反常霍爾電導 σ_xy = e²/h</span>
          </div>
        </div>

        <!-- Theory Explainer Banner -->
        <div class="theory-box">
          <h4>❄️ 物理理論背景：雙層 TMD 莫爾拓撲激子絕緣體與對流超流性 (Excitonic Insulator & Counterflow BEC)</h4>
          <p>
            在 WSe₂/MoSe₂ 雙層莫爾異質結中，微觀庫侖吸引力將頂層電洞與底層電子強烈束縛為「層間激子」(Interlayer Excitons)。
            當激子結合能超過單粒子帶隙（\(E_b > \Delta_0\)）時，自由載流子自發配對，基態發生自發破缺形成有能隙的「拓撲激子絕緣體」。
            在極低溫下，層間激子凝聚為玻色-愛因斯坦凝聚態（BEC），展現各向無耗散對流超流電導（頂層與底層電流反向流動時阻抗嚴格為零，\(\rho_{\text{CF}} = 0\)）。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { moireExcitonicInsulatorEngine, type MoireExcitonState, type MoireExcitonRegime } from '../engine/moireExcitonicInsulatorBec';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<MoireExcitonState>(moireExcitonicInsulatorEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onAngleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  moireExcitonicInsulatorEngine.setTwistAngle(parseFloat(target.value));
  state.value = moireExcitonicInsulatorEngine.getState();
}

function onEbChange(e: Event) {
  const target = e.target as HTMLInputElement;
  moireExcitonicInsulatorEngine.setExcitonBindingEnergy(parseFloat(target.value));
  state.value = moireExcitonicInsulatorEngine.getState();
}

function onGapChange(e: Event) {
  const target = e.target as HTMLInputElement;
  moireExcitonicInsulatorEngine.setSingleParticleGap(parseFloat(target.value));
  state.value = moireExcitonicInsulatorEngine.getState();
}

function onDensityChange(e: Event) {
  const target = e.target as HTMLInputElement;
  moireExcitonicInsulatorEngine.setExcitonDensity(parseFloat(target.value));
  state.value = moireExcitonicInsulatorEngine.getState();
}

function setRegime(regime: MoireExcitonRegime) {
  moireExcitonicInsulatorEngine.setRegime(regime);
  state.value = moireExcitonicInsulatorEngine.getState();
}

function triggerCounterflow() {
  moireExcitonicInsulatorEngine.triggerCounterflowBurst();
  state.value = moireExcitonicInsulatorEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  moireExcitonicInsulatorEngine.saveState();
}

function getHexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function getHoleX(index: number): number {
  const speed = state.value.counterflowSuperfluidActive ? 55 : 20;
  return ((index * 68 + state.value.timeElapsed * speed) % 460) + 10;
}

function getElectronX(index: number): number {
  const speed = state.value.counterflowSuperfluidActive ? 55 : 20;
  const raw = (index * 68 - state.value.timeElapsed * speed) % 460;
  return (raw < 0 ? raw + 460 : raw) + 10;
}

function updateLoop() {
  moireExcitonicInsulatorEngine.update(0.016);
  state.value = moireExcitonicInsulatorEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('moire_excitonic_insulator_bec');
  animId = requestAnimationFrame(updateLoop);
});

onUnmounted(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId);
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: #090d16;
  border: 1px solid #334155;
  border-radius: 12px;
  width: 100%;
  max-width: 860px;
  max-height: 94vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #1e293b;
  background: #0b1120;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap .icon {
  font-size: 26px;
}

.title-wrap h2 {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f8fafc;
  background: #1e293b;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1e293b;
  background: #020817;
}

.exciton-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.control-card {
  background: #0b1120;
  border: 1px solid #1e293b;
  padding: 12px 14px;
  border-radius: 8px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.control-header label {
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
}

.value-badge {
  font-size: 11px;
  font-family: monospace;
  font-weight: 700;
  color: #38bdf8;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
}

.slider {
  width: 100%;
  cursor: pointer;
  accent-color: #38bdf8;
}

.control-desc {
  font-size: 10px;
  color: #64748b;
  margin: 6px 0 0 0;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.regime-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-regime {
  background: #0f172a;
  border: 1px solid #334155;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-regime:hover {
  color: #f8fafc;
  background: #1e293b;
}

.btn-regime.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #38bdf8;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #0284c7;
  border: 1px solid #38bdf8;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #0369a1;
}

.btn-secondary {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #334155;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric-card {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 10px;
  color: #94a3b8;
}

.metric-value {
  font-size: 13px;
  font-weight: 700;
  font-family: monospace;
}

.metric-sub {
  font-size: 9px;
  color: #64748b;
}

.text-emerald { color: #10b981; }
.text-amber { color: #f59e0b; }
.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-slate { color: #64748b; }

.theory-box {
  background: #070c18;
  border: 1px solid #1e293b;
  border-left: 3px solid #38bdf8;
  border-radius: 6px;
  padding: 12px 14px;
}

.theory-box h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #38bdf8;
}

.theory-box p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
