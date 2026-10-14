<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🪐</span>
          <div>
            <h2>克爾-紐曼黑洞能層與等離子體發電機</h2>
            <p class="subtitle">Kerr-Newman Ergosphere & Blandford-Znajek Relativistic Jet / Penrose Process</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="kerr-svg">
            <defs>
              <linearGradient id="kerrSpaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#02040a" />
                <stop offset="100%" stop-color="#0b0f19" />
              </linearGradient>
              <linearGradient id="jetGradNorth" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="30%" stop-color="#818cf8" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0.1" />
              </linearGradient>
              <linearGradient id="jetGradSouth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="30%" stop-color="#818cf8" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0.1" />
              </linearGradient>
              <radialGradient id="ergoGrad" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stop-color="#1e1b4b" stop-opacity="0.7" />
                <stop offset="85%" stop-color="#4338ca" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.1" />
              </radialGradient>
              <filter id="glowKerr">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Deep Space Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#kerrSpaceGrad)" rx="8" />

            <!-- Frame-Dragging Swirl Lines -->
            <g transform="translate(260, 180)" opacity="0.35">
              <ellipse
                v-for="i in 5"
                :key="'swirl' + i"
                cx="0"
                cy="0"
                :rx="70 + i * 22"
                :ry="50 + i * 16"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.2"
                stroke-dasharray="5 7"
                :transform="`rotate(${state.timeElapsed * 40 * (6 - i) * (state.spinParameterA + 0.1)}, 0, 0)`"
              />
            </g>

            <!-- Black Hole & Ergosphere Geometry (Center at 260, 180) -->
            <g transform="translate(260, 180)">
              <!-- Ergosphere Boundary (Oblate Spheroid) -->
              <!-- rx = r_ergo(pi/2), ry = r_ergo(0) = r_+ -->
              <ellipse
                cx="0"
                cy="0"
                :rx="getErgoPixelRx()"
                :ry="getHorizonPixelR()"
                fill="url(#ergoGrad)"
                stroke="#818cf8"
                stroke-width="2"
                stroke-dasharray="4 3"
                filter="url(#glowKerr)"
              />

              <!-- Event Horizon (Perfect Sphere r_+) -->
              <circle
                cx="0"
                cy="0"
                :r="getHorizonPixelR()"
                fill="#000000"
                stroke="#f43f5e"
                stroke-width="2.5"
              />

              <!-- Singularity Marker at center -->
              <circle cx="0" cy="0" r="3" fill="#facc15" filter="url(#glowKerr)" />

              <!-- North Relativistic Plasma Jet (Blandford-Znajek) -->
              <polygon
                points="-16,-45 16,-45 28,-160 -28,-160"
                fill="url(#jetGradNorth)"
                filter="url(#glowKerr)"
              />
              <!-- South Relativistic Plasma Jet -->
              <polygon
                points="-16,45 16,45 28,160 -28,160"
                fill="url(#jetGradSouth)"
                filter="url(#glowKerr)"
              />

              <!-- Penrose Process Particle Splitting Trajectory -->
              <g v-if="state.regime === 'penrose-energy-extraction'">
                <!-- Infalling Incident particle E_0 -->
                <path d="M -160 -90 Q -90 -40 -65 -15" stroke="#facc15" stroke-width="2" fill="none" stroke-dasharray="3 2" />
                <!-- Negative Energy Fragment into Horizon E_1 < 0 -->
                <path d="M -65 -15 Q -45 5 -20 5" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- Super-energetic Escaping Fragment E_2 > E_0 -->
                <path d="M -65 -15 Q -40 -60 120 -110" stroke="#10b981" stroke-width="3" fill="none" filter="url(#glowKerr)" />
                <circle cx="-65" cy="-15" r="5" fill="#facc15" />
                <text x="-95" y="-18" fill="#facc15" font-size="10">分裂點</text>
                <text x="70" y="-115" fill="#34d399" font-size="11" font-weight="bold">
                  η = {{ (state.penroseEfficiency * 100).toFixed(1) }}%
                </text>
              </g>

              <!-- Rotation Arrow -->
              <path
                d="M -40 75 A 85 85 0 0 0 40 75"
                stroke="#38bdf8"
                stroke-width="2"
                fill="none"
                marker-end="url(#arrow)"
              />
              <text x="0" y="92" fill="#38bdf8" font-size="10" text-anchor="middle">
                自旋角動量 J (a*={{ state.spinParameterA.toFixed(2) }})
              </text>
            </g>

            <!-- Metrics & Jet Output Gauge (Right Side: 530, 30) -->
            <g transform="translate(530, 30)">
              <rect x="0" y="0" width="240" height="300" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="120" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                能層提取與 BZ 發電機輸出
              </text>

              <!-- Blandford-Znajek Jet Power -->
              <g transform="translate(20, 50)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">BZ 電磁噴流功率 P_BZ</text>
                <text x="0" y="22" fill="#38bdf8" font-size="16" font-weight="bold" font-family="monospace">
                  {{ state.bzJetPowerWatts.toExponential(2) }} W
                </text>
                <text x="0" y="38" fill="#64748b" font-size="10">等離子體阿爾芬波外流</text>
              </g>

              <!-- Penrose Efficiency Gauge -->
              <g transform="translate(20, 115)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">彭羅斯能層提取效率 η</text>
                <rect x="0" y="10" width="200" height="14" fill="#1e293b" rx="4" />
                <rect
                  x="0"
                  y="10"
                  :width="Math.min(200, (state.penroseEfficiency - 1.0) / 0.3 * 200)"
                  height="14"
                  fill="#10b981"
                  rx="4"
                />
                <text x="100" y="22" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  {{ (state.penroseEfficiency * 100).toFixed(1) }}% (超能超增益)
                </text>
              </g>

              <!-- Horizon Angular Velocity -->
              <g transform="translate(20, 175)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">視界旋轉角速度 Ω_H</text>
                <text x="0" y="20" fill="#f59e0b" font-size="15" font-family="monospace">
                  {{ state.horizonAngularVelRadSec.toFixed(0) }} rad/s
                </text>
                <text x="0" y="36" fill="#64748b" font-size="10">拖曳靜止極限破缺 (g_tt > 0)</text>
              </g>

              <!-- Radii Comparison -->
              <g transform="translate(20, 235)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">幾何尺度比對</text>
                <text x="0" y="18" fill="#e2e8f0" font-size="11">視界 r_+: <tspan fill="#f43f5e">{{ state.horizonRadiusKm.toFixed(1) }} km</tspan></text>
                <text x="0" y="34" fill="#e2e8f0" font-size="11">能層赤道 r_ergo: <tspan fill="#818cf8">{{ state.ergoRadiusEquatorKm.toFixed(1) }} km</tspan></text>
                <text x="0" y="50" fill="#94a3b8" font-size="10">黑洞質量: {{ state.blackHoleMassM.toFixed(1) }} M_☉</text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">旋轉自旋參數 a*</span>
            <span class="value">{{ state.spinParameterA.toFixed(3) }}</span>
            <span class="sub">極值上限 0.998</span>
          </div>
          <div class="metric-card">
            <span class="label">無因次電荷 Q*</span>
            <span class="value">{{ state.chargeQ.toFixed(2) }}</span>
            <span class="sub">克爾-紐曼電荷比</span>
          </div>
          <div class="metric-card">
            <span class="label">彭羅斯效率 η</span>
            <span class="value highlight">{{ (state.penroseEfficiency * 100).toFixed(1) }}%</span>
            <span class="sub">質能提取增益</span>
          </div>
          <div class="metric-card">
            <span class="label">運行動態機制</span>
            <span class="value">
              {{ getRegimeLabel(state.regime) }}
            </span>
            <span class="sub">B = {{ state.magneticFieldGauss.toLocaleString() }} G</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>黑洞自旋 a* (J / M²):</label>
            <input
              type="range"
              min="0.0"
              max="0.998"
              step="0.01"
              :value="state.spinParameterA"
              @input="onSpinChange"
            />
            <span class="range-val">{{ state.spinParameterA.toFixed(2) }}</span>
          </div>

          <div class="control-row">
            <label>黑洞電荷 Q* (Q / M):</label>
            <input
              type="range"
              min="0.0"
              max="0.35"
              step="0.01"
              :value="state.chargeQ"
              @input="onChargeChange"
            />
            <span class="range-val">{{ state.chargeQ.toFixed(2) }}</span>
          </div>

          <div class="control-row">
            <label>外層吸積磁場 B (Gauss):</label>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              :value="state.magneticFieldGauss"
              @input="onMagChange"
            />
            <span class="range-val">{{ (state.magneticFieldGauss / 1000).toFixed(0) }}k G</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'blandford-znajek-jet' }"
              @click="setRegime('blandford-znajek-jet')"
            >
              布蘭福德-茲納耶克噴流 (BZ)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'penrose-energy-extraction' }"
              @click="setRegime('penrose-energy-extraction')"
            >
              彭羅斯負能粒子分裂 (η>1)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'ergosphere-drag' }"
              @click="setRegime('ergosphere-drag')"
            >
              能層參考系拖曳 (Lense-Thirring)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'extremal-limit' }"
              @click="setRegime('extremal-limit')"
            >
              極值黑洞極限 (a*→1)
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerPenrose">
              🪐 激發彭羅斯超能粒子分裂束
            </button>
            <button class="action-btn secondary" @click="cycleRegime">
              🔄 輪換相對論等離子發電機模式
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { kerrNewmanJetEngine, type KerrNewmanState, type KerrNewmanRegime } from '../engine/kerrNewmanErgosphereJet';
import { useUiStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUiStore();
const state = ref<KerrNewmanState>(kerrNewmanJetEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = kerrNewmanJetEngine.getState();
};

onMounted(() => {
  achievements.unlock('kerr_newman_ergosphere_jet');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeModals();
};

const onSpinChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  kerrNewmanJetEngine.setSpin(val);
  refresh();
};

const onChargeChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  kerrNewmanJetEngine.setCharge(val);
  refresh();
};

const onMagChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  kerrNewmanJetEngine.setMagneticField(val);
  refresh();
};

const setRegime = (regime: KerrNewmanRegime) => {
  kerrNewmanJetEngine.setRegime(regime);
  refresh();
};

const cycleRegime = () => {
  kerrNewmanJetEngine.cycleRegime();
  refresh();
};

const triggerPenrose = () => {
  kerrNewmanJetEngine.triggerPenroseExtraction();
  refresh();
};

const getHorizonPixelR = () => {
  return 45 * (state.value.horizonRadiusKm / 20.0);
};

const getErgoPixelRx = () => {
  return 45 * (state.value.ergoRadiusEquatorKm / 20.0);
};

const getRegimeLabel = (regime: KerrNewmanRegime) => {
  switch (regime) {
    case 'blandford-znajek-jet': return 'BZ 等離子噴流';
    case 'penrose-energy-extraction': return '彭羅斯超能提取';
    case 'ergosphere-drag': return '能層參考系拖曳';
    case 'extremal-limit': return '極值黑洞極限';
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

.kerr-svg {
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
  color: #10b981;
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
  background: #4f46e5;
  color: #ffffff;
  border-color: #818cf8;
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
  background: #4f46e5;
  color: white;
}

.action-btn.primary:hover {
  background: #6366f1;
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
