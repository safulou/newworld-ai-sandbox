<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>莫爾分數陳絕緣體與非阿貝爾任意子編織</h2>
            <p class="subtitle">Twisted Bilayer MoTe₂ Fractional Chern Insulator (FQAHE) & Non-Abelian Anyons</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="chern-svg">
            <defs>
              <linearGradient id="moireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#020617" />
              </linearGradient>
              <radialGradient id="anyonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="60%" stop-color="#818cf8" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#818cf8" stop-opacity="0" />
              </radialGradient>
              <filter id="glowChern">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#moireGrad)" rx="8" />

            <!-- Moiré Interference Pattern (Hexagonal grid with angle rotation) -->
            <g :transform="`rotate(${state.twistAngleDeg * 1.5}, 240, 180)`" opacity="0.45">
              <circle
                v-for="i in 18"
                :key="'ring' + i"
                cx="240"
                cy="180"
                :r="i * (state.moireLatticeNm * 2.8)"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.2"
                stroke-dasharray="4 6"
              />
            </g>

            <!-- Torus Topology Ground State Degeneracy Nodes -->
            <g transform="translate(240, 180)">
              <!-- Torus outer / inner boundary ring -->
              <ellipse cx="0" cy="0" rx="140" ry="85" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="5 5" />
              <ellipse cx="0" cy="0" rx="60" ry="35" fill="#0b0f19" stroke="#334155" stroke-width="1.8" />

              <!-- Anyon Nodes on Torus Surface -->
              <g v-for="idx in state.groundStateDegeneracy" :key="'deg' + idx">
                <circle
                  :cx="getDegeneracyNodeX(idx, state.groundStateDegeneracy)"
                  :cy="getDegeneracyNodeY(idx, state.groundStateDegeneracy)"
                  r="9"
                  fill="url(#anyonGlow)"
                  filter="url(#glowChern)"
                />
                <circle
                  :cx="getDegeneracyNodeX(idx, state.groundStateDegeneracy)"
                  :cy="getDegeneracyNodeY(idx, state.groundStateDegeneracy)"
                  r="4"
                  :fill="state.isNonAbelian ? '#f43f5e' : '#38bdf8'"
                />
                <text
                  :x="getDegeneracyNodeX(idx, state.groundStateDegeneracy)"
                  :y="getDegeneracyNodeY(idx, state.groundStateDegeneracy) - 14"
                  fill="#e2e8f0"
                  font-size="11"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  Ψ_{{ idx }}
                </text>
              </g>

              <!-- Braiding Path (if Non-Abelian nu = -1/2) -->
              <path
                v-if="state.isNonAbelian"
                d="M -70 -25 C -20 -60, 20 60, 70 25 C 20 60, -20 -60, -70 -25"
                stroke="#f43f5e"
                stroke-width="2.5"
                stroke-dasharray="3 3"
                fill="none"
                filter="url(#glowChern)"
              />
              <text v-if="state.isNonAbelian" x="0" y="4" fill="#fb7185" font-size="11" text-anchor="middle" font-weight="bold">
                非阿貝爾編織循環 (γ₁ γ₂ = -γ₂ γ₁)
              </text>
            </g>

            <!-- Hall Conductance Plateau Spectrum (Right Side) -->
            <g transform="translate(560, 40)">
              <rect x="0" y="0" width="210" height="280" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="105" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                零磁場反常霍爾電導 σ_xy (e²/h)
              </text>

              <!-- Spectrum Axis -->
              <line x1="40" y1="50" x2="40" y2="250" stroke="#475569" stroke-width="1.5" />
              <line x1="40" y1="250" x2="190" y2="250" stroke="#475569" stroke-width="1.5" />

              <!-- Filling Plateaus Lines -->
              <line x1="35" y1="70" x2="180" y2="70" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="30" y="74" fill="#60a5fa" font-size="10" text-anchor="end">ν=-1 (IQAH)</text>

              <line x1="35" y1="120" x2="180" y2="120" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="30" y="124" fill="#34d399" font-size="10" text-anchor="end">ν=-2/3 (Laughlin)</text>

              <line x1="35" y1="160" x2="180" y2="160" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="30" y="164" fill="#c084fc" font-size="10" text-anchor="end">ν=-3/5 (Jain)</text>

              <line x1="35" y1="190" x2="180" y2="190" stroke="#f43f5e" stroke-width="2" />
              <text x="30" y="194" fill="#f87171" font-size="10" text-anchor="end">ν=-1/2 (Pfaffian)</text>

              <!-- Active Filling Indicator Marker -->
              <circle :cx="110" :cy="getConductanceY(state.hallConductanceE2h)" r="7" fill="#38bdf8" filter="url(#glowChern)" />
              <text :x="125" :y="getConductanceY(state.hallConductanceE2h) + 4" fill="#38bdf8" font-size="12" font-family="monospace">
                {{ state.hallConductanceE2h.toFixed(3) }} e²/h
              </text>
            </g>

            <!-- State Summary Overlay in SVG -->
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="180" height="95" fill="#050814" fill-opacity="0.8" stroke="#1e293b" rx="6" />
              <text x="12" y="22" fill="#94a3b8" font-size="11">莫爾週期 a_M: <tspan fill="#38bdf8">{{ state.moireLatticeNm.toFixed(2) }} nm</tspan></text>
              <text x="12" y="42" fill="#94a3b8" font-size="11">平帶帶寬 W: <tspan fill="#f59e0b">{{ state.bandWidthMev.toFixed(1) }} meV</tspan></text>
              <text x="12" y="62" fill="#94a3b8" font-size="11">強相互作用 U/W: <tspan fill="#ec4899">{{ state.interactionRatio.toFixed(2) }}</tspan></text>
              <text x="12" y="82" fill="#94a3b8" font-size="11">準粒子電荷 e*: <tspan fill="#10b981">{{ state.fractionalCharge.toFixed(2) }} e</tspan></text>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">扭轉角度 θ</span>
            <span class="value">{{ state.twistAngleDeg.toFixed(2) }}°</span>
            <span class="sub">魔角臨界 ~3.7°</span>
          </div>
          <div class="metric-card">
            <span class="label">平帶填充數 ν</span>
            <span class="value highlight">{{ state.fillingNu }}</span>
            <span class="sub">基態簡併 D_g = {{ state.groundStateDegeneracy }}</span>
          </div>
          <div class="metric-card">
            <span class="label">多體電荷能隙 Δ_MB</span>
            <span class="value">{{ state.manyBodyGapMev.toFixed(2) }} meV</span>
            <span class="sub">熱穩定性 (T={{ state.temperatureKelvin.toFixed(1) }} K)</span>
          </div>
          <div class="metric-card">
            <span class="label">拓撲任意子統計</span>
            <span class="value" :class="{ 'warning-glow': state.isNonAbelian }">
              {{ state.isNonAbelian ? '非阿貝爾 Ising' : '阿貝爾任意子' }}
            </span>
            <span class="sub">{{ state.isNonAbelian ? '拓撲量子計算容錯位元' : '分數量子霍爾階數' }}</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>莫爾扭轉角 θ (deg):</label>
            <input
              type="range"
              min="2.0"
              max="5.5"
              step="0.05"
              :value="state.twistAngleDeg"
              @input="onTwistChange"
            />
            <span class="range-val">{{ state.twistAngleDeg.toFixed(2) }}°</span>
          </div>

          <div class="control-row">
            <label>環境溫度 T (Kelvin):</label>
            <input
              type="range"
              min="0.1"
              max="20.0"
              step="0.1"
              :value="state.temperatureKelvin"
              @input="onTempChange"
            />
            <span class="range-val">{{ state.temperatureKelvin.toFixed(1) }} K</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.fillingNu === '-1' }"
              @click="setFilling('-1')"
            >
              ν = -1 (整數陳)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.fillingNu === '-2/3' }"
              @click="setFilling('-2/3')"
            >
              ν = -2/3 (Laughlin e/3)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.fillingNu === '-3/5' }"
              @click="setFilling('-3/5')"
            >
              ν = -3/5 (Jain e/5)
            </button>
            <button
              class="regime-btn non-abelian"
              :class="{ active: state.fillingNu === '-1/2' }"
              @click="setFilling('-1/2')"
            >
              ν = -1/2 (Moore-Read 非阿貝爾)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.fillingNu === 'thermal-metal' }"
              @click="setFilling('thermal-metal')"
            >
              熱金屬相
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerBraiding">
              ⚡ 執行非阿貝爾任意子編織音律
            </button>
            <button class="action-btn secondary" @click="cycleFilling">
              🔄 輪換平帶填充數
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { fractionalChernEngine, type FractionalChernState, type FciFillingFraction } from '../engine/fractionalChernMoireMoTe2';
import { useUiStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUiStore();
const state = ref<FractionalChernState>(fractionalChernEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = fractionalChernEngine.getState();
};

onMounted(() => {
  achievements.unlock('fractional_chern_moire_mote2');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeModals();
};

const onTwistChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalChernEngine.setTwistAngle(val);
  refresh();
};

const onTempChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalChernEngine.setTemperature(val);
  refresh();
};

const setFilling = (nu: FciFillingFraction) => {
  fractionalChernEngine.setFilling(nu);
  refresh();
};

const cycleFilling = () => {
  fractionalChernEngine.cycleFilling();
  refresh();
};

const triggerBraiding = () => {
  fractionalChernEngine.triggerNonAbelianBraiding();
  refresh();
};

const getDegeneracyNodeX = (idx: number, total: number) => {
  const angle = ((idx - 1) / total) * 2 * Math.PI;
  return Math.cos(angle) * 105;
};

const getDegeneracyNodeY = (idx: number, total: number) => {
  const angle = ((idx - 1) / total) * 2 * Math.PI;
  return Math.sin(angle) * 60;
};

const getConductanceY = (sigma: number) => {
  // Map sigma in [-1.0, 0.0] to [70, 250]
  const clamped = Math.max(-1.0, Math.min(0.0, sigma));
  return 250 + clamped * 180;
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

.chern-svg {
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

.metric-card .value.warning-glow {
  color: #f43f5e;
  text-shadow: 0 0 8px rgba(244, 63, 94, 0.6);
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

.regime-btn.non-abelian.active {
  background: #e11d48;
  border-color: #fb7185;
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
  background: #e11d48;
  color: white;
}

.action-btn.primary:hover {
  background: #f43f5e;
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
