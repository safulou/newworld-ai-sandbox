<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌌</span>
          <div>
            <h2>全息重整化群流與不可逆 c-定理</h2>
            <p class="subtitle">AdS/CFT Holographic RG Flow & Zamolodchikov Irreversible c-Theorem</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="holo-svg">
            <defs>
              <linearGradient id="bulkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1e1b4b" />
                <stop offset="40%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#030712" />
              </linearGradient>
              <linearGradient id="cCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
              <filter id="glowHolo">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Holographic Bulk Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#bulkGrad)" rx="8" />

            <!-- AdS Boundary at z = 0 (Left line) -->
            <line x1="60" y1="30" x2="60" y2="330" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4 2" />
            <text x="60" y="24" fill="#38bdf8" font-size="11" text-anchor="middle" font-weight="bold">
              AdS 紫外邊界 z=0 (CFT_UV)
            </text>

            <!-- Infrared Horizon z -> inf (Right line) -->
            <line x1="480" y1="30" x2="480" y2="330" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 2" />
            <text x="480" y="24" fill="#f43f5e" font-size="11" text-anchor="middle" font-weight="bold">
              紅外幾何深處 z→∞ (CFT_IR)
            </text>

            <!-- Bulk Metric Warping Grid (Hyperbolic geometry lines) -->
            <g opacity="0.25">
              <path
                v-for="i in 8"
                :key="'warp' + i"
                :d="`M 60 ${40 + i * 35} C ${160 + i * 20} ${40 + i * 35}, ${320} ${180}, 480 ${180}`"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.2"
              />
            </g>

            <!-- Holographic c(z) Monotonic Flow Curve in [60, 480] -->
            <path
              :d="getCentralChargeCurveSvg()"
              stroke="url(#cCurveGrad)"
              stroke-width="3"
              fill="none"
              filter="url(#glowHolo)"
            />

            <!-- Current Energy Scale z Marker Line -->
            <line
              :x1="getZPixel(state.energyScaleZ)"
              y1="40"
              :x2="getZPixel(state.energyScaleZ)"
              y2="320"
              stroke="#facc15"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
            <circle
              :cx="getZPixel(state.energyScaleZ)"
              :cy="getCPixel(state.currentCentralCharge)"
              r="7"
              fill="#facc15"
              filter="url(#glowHolo)"
            />
            <text
              :x="getZPixel(state.energyScaleZ)"
              :y="getCPixel(state.currentCentralCharge) - 14"
              fill="#facc15"
              font-size="11"
              text-anchor="middle"
              font-weight="bold"
            >
              c(z) = {{ state.currentCentralCharge.toFixed(1) }}
            </text>

            <!-- Arrow showing monotonic flow direction -->
            <path d="M 230 180 L 290 180" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)" />
            <text x="260" y="172" fill="#38bdf8" font-size="10" text-anchor="middle">
              不可逆粗粒化 dc/dz ≤ 0
            </text>

            <!-- Holographic RG Flow Metrics Panel (Right Side: 520, 30) -->
            <g transform="translate(520, 30)">
              <rect x="0" y="0" width="250" height="300" fill="#0f172a" stroke="#334155" rx="6" />
              <text x="125" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                超引力疇壁與自由度耗散
              </text>

              <!-- Central Charge Comparison -->
              <g transform="translate(20, 50)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">紫外中央荷 c_UV: <tspan fill="#38bdf8">{{ state.uvCentralCharge.toFixed(1) }}</tspan></text>
                <text x="0" y="20" fill="#cbd5e1" font-size="11">紅外中央荷 c_IR: <tspan fill="#f43f5e">{{ state.irCentralCharge.toFixed(1) }}</tspan></text>
                <text x="0" y="40" fill="#a855f7" font-size="11">目前能階 c(z): <tspan fill="#facc15">{{ state.currentCentralCharge.toFixed(1) }}</tspan></text>
              </g>

              <!-- Degree of Freedom Loss Gauge -->
              <g transform="translate(20, 115)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11">微觀自由度累積粗粒化損失</text>
                <rect x="0" y="10" width="210" height="14" fill="#1e293b" rx="4" />
                <rect
                  x="0"
                  y="10"
                  :width="(state.degreesOfFreedomLossPct / 100) * 210"
                  height="14"
                  fill="#ec4899"
                  rx="4"
                />
                <text x="105" y="22" fill="#ffffff" font-size="10" text-anchor="middle" font-weight="bold">
                  {{ state.degreesOfFreedomLossPct.toFixed(1) }}% 資訊耗散
                </text>
              </g>

              <!-- Beta function & Coupling -->
              <g transform="translate(20, 175)">
                <text x="0" y="0" fill="#94a3b8" font-size="11">貝塔函數 β(g): <tspan fill="#f59e0b">{{ state.betaFunctionVal.toFixed(3) }}</tspan></text>
                <text x="0" y="20" fill="#94a3b8" font-size="11">標量耦合 g(z): <tspan fill="#10b981">{{ state.scalarCouplingG.toFixed(2) }}</tspan></text>
                <text x="0" y="38" fill="#64748b" font-size="10">定點條件: β(g*) = 0</text>
              </g>

              <!-- Null Energy Condition (NEC) status banner -->
              <g transform="translate(20, 235)">
                <rect x="0" y="0" width="210" height="38" fill="#064e3b" stroke="#10b981" rx="4" />
                <text x="105" y="16" fill="#34d399" font-size="11" text-anchor="middle" font-weight="bold">
                  ✓ 零能量條件 (NEC) 成立
                </text>
                <text x="105" y="30" fill="#6ee7b7" font-size="9" text-anchor="middle">
                  A''(r) ≤ 0 保證 c-定理單調不增
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">全息尺度 z</span>
            <span class="value">{{ state.energyScaleZ.toFixed(2) }}</span>
            <span class="sub">{{ state.energyScaleZ < 1 ? '接近 UV 高能界' : '深入 IR 低能端' }}</span>
          </div>
          <div class="metric-card">
            <span class="label">當前中央荷 c(z)</span>
            <span class="value highlight">{{ state.currentCentralCharge.toFixed(1) }}</span>
            <span class="sub">微觀態密度測度</span>
          </div>
          <div class="metric-card">
            <span class="label">自由度損失率</span>
            <span class="value">{{ state.degreesOfFreedomLossPct.toFixed(1) }}%</span>
            <span class="sub">不可逆資訊熵流</span>
          </div>
          <div class="metric-card">
            <span class="label">全息重整化狀態</span>
            <span class="value">
              {{ getRegimeLabel(state.regime) }}
            </span>
            <span class="sub">β(g) = {{ state.betaFunctionVal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <div class="control-row">
            <label>全息徑向尺度 z (AdS 深度):</label>
            <input
              type="range"
              min="0.05"
              max="9.5"
              step="0.05"
              :value="state.energyScaleZ"
              @input="onZChange"
            />
            <span class="range-val">{{ state.energyScaleZ.toFixed(2) }}</span>
          </div>

          <div class="control-row">
            <label>紫外中央荷 c_UV:</label>
            <input
              type="range"
              min="50"
              max="300"
              step="5"
              :value="state.uvCentralCharge"
              @input="onUvChange"
            />
            <span class="range-val">{{ state.uvCentralCharge.toFixed(0) }}</span>
          </div>

          <div class="control-row">
            <label>紅外中央荷 c_IR:</label>
            <input
              type="range"
              min="10"
              max="120"
              step="2"
              :value="state.irCentralCharge"
              @input="onIrChange"
            />
            <span class="range-val">{{ state.irCentralCharge.toFixed(0) }}</span>
          </div>

          <div class="btn-group">
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'uv-fixed-point' }"
              @click="setRegime('uv-fixed-point')"
            >
              紫外共形定點 (UV CFT)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'rg-c-flow' }"
              @click="setRegime('rg-c-flow')"
            >
              重整化群 c-流動
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'ir-conformal-fixed' }"
              @click="setRegime('ir-conformal-fixed')"
            >
              紅外共形定點 (IR CFT)
            </button>
            <button
              class="regime-btn"
              :class="{ active: state.regime === 'domain-wall-kink' }"
              @click="setRegime('domain-wall-kink')"
            >
              超引力疇壁孤子紐結
            </button>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="triggerKink">
              🌌 激發全息疇壁孤子紐結共鳴
            </button>
            <button class="action-btn secondary" @click="cycleRegime">
              🔄 輪換全息重整化群流動相
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { holographicCTheoremEngine, type HolographicCTheoremState, type HolographicRgRegime } from '../engine/holographicCTheoremRgFlow';
import { useUiStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUiStore();
const state = ref<HolographicCTheoremState>(holographicCTheoremEngine.getState());
let timer: number | null = null;

const refresh = () => {
  state.value = holographicCTheoremEngine.getState();
};

onMounted(() => {
  achievements.unlock('holographic_c_theorem_rg_flow');
  timer = window.setInterval(refresh, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleClose = () => {
  uiStore.closeModals();
};

const onZChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicCTheoremEngine.setEnergyScale(val);
  refresh();
};

const onUvChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicCTheoremEngine.setUvCharge(val);
  refresh();
};

const onIrChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicCTheoremEngine.setIrCharge(val);
  refresh();
};

const setRegime = (regime: HolographicRgRegime) => {
  holographicCTheoremEngine.setRegime(regime);
  refresh();
};

const cycleRegime = () => {
  holographicCTheoremEngine.cycleRegime();
  refresh();
};

const triggerKink = () => {
  holographicCTheoremEngine.triggerKinkTransition();
  refresh();
};

const getZPixel = (z: number) => {
  // Map z from [0.0, 10.0] to [60, 480]
  const clamped = Math.max(0.0, Math.min(10.0, z));
  return 60 + (clamped / 10.0) * 420;
};

const getCPixel = (c: number) => {
  // Map c from [c_IR, c_UV] to [280, 70]
  const cUv = state.value.uvCentralCharge;
  const cIr = state.value.irCentralCharge;
  const frac = (c - cIr) / Math.max(1.0, cUv - cIr);
  return 280 - frac * 210;
};

const getCentralChargeCurveSvg = () => {
  const points: string[] = [];
  const cUv = state.value.uvCentralCharge;
  const cIr = state.value.irCentralCharge;
  const z0 = 2.0;

  for (let z = 0.05; z <= 10.0; z += 0.25) {
    const ratio = z / z0;
    const cZ = cIr + (cUv - cIr) / (1.0 + ratio * ratio);
    const x = getZPixel(z);
    const y = getCPixel(cZ);
    points.push(`${z === 0.05 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
};

const getRegimeLabel = (regime: HolographicRgRegime) => {
  switch (regime) {
    case 'uv-fixed-point': return '紫外共形定點';
    case 'rg-c-flow': return '重整化群 c-流';
    case 'ir-conformal-fixed': return '紅外共形定點';
    case 'domain-wall-kink': return '疇壁孤子紐結';
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

.holo-svg {
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
  color: #c084fc;
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
  background: #6366f1;
  color: #ffffff;
  border-color: #a5b4fc;
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
  background: #4338ca;
  color: white;
}

.action-btn.primary:hover {
  background: #4f46e5;
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
