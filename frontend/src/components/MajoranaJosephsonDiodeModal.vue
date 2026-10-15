<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚡</span>
          <div>
            <h2>拓撲馬約拉納零模約瑟夫森二極體</h2>
            <p class="subtitle">Non-Reciprocal Supercurrent Rectification, Anomalous Phase Shift & 4π Fractional Tunneling</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="diode-svg">
            <defs>
              <linearGradient id="diodeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020d1a" />
                <stop offset="50%" stop-color="#081a2e" />
                <stop offset="100%" stop-color="#041220" />
              </linearGradient>

              <radialGradient id="mzmGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="supercurrentGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>

              <filter id="glowDiode">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#diodeBg)" rx="8" />

            <!-- Left Superconductor Lead S1 -->
            <g transform="translate(40, 100)">
              <rect x="0" y="0" width="130" height="160" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6" />
              <text x="65" y="30" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">超導電極 S₁</text>
              <text x="65" y="55" fill="#94a3b8" font-size="10" text-anchor="middle">Δ · exp(iφ₁)</text>
              <!-- Cooper Pair Icons -->
              <circle cx="45" cy="90" r="6" fill="#38bdf8" />
              <circle cx="55" cy="90" r="6" fill="#38bdf8" />
              <text x="50" y="115" fill="#bae6fd" font-size="9" text-anchor="middle">庫珀對 (2e)</text>
            </g>

            <!-- Topological Nanowire Barrier / Junction Core -->
            <g transform="translate(170, 150)">
              <rect x="0" y="0" width="160" height="60" fill="#0f172a" stroke="#64748b" stroke-width="1.5" rx="4" />
              <text x="80" y="24" fill="#94a3b8" font-size="10" text-anchor="middle">半導體奈米線弱鏈 (SOC + B_x)</text>

              <!-- In-plane Magnetic Field Arrow -->
              <line x1="20" y1="42" x2="140" y2="42" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 3" />
              <polygon points="135,39 145,42 135,45" fill="#f59e0b" />
              <text x="80" y="54" fill="#fbbf24" font-size="9" text-anchor="middle">B_x 面內磁場 →</text>

              <!-- Majorana Zero Modes (MZM) at ends -->
              <g v-if="state.isTopologicalMajoranaActive">
                <!-- Left MZM γ1 -->
                <circle cx="10" cy="30" r="14" fill="url(#mzmGlow)" filter="url(#glowDiode)" />
                <circle cx="10" cy="30" r="5" fill="#10b981" />
                <text x="10" y="-8" fill="#34d399" font-size="9" text-anchor="middle" font-weight="bold">γ₁ (MZM)</text>

                <!-- Right MZM γ2 -->
                <circle cx="150" cy="30" r="14" fill="url(#mzmGlow)" filter="url(#glowDiode)" />
                <circle cx="150" cy="30" r="5" fill="#10b981" />
                <text x="150" y="-8" fill="#34d399" font-size="9" text-anchor="middle" font-weight="bold">γ₂ (MZM)</text>

                <!-- 4π Single-Electron Fractional Tunneling Flow -->
                <path
                  d="M 25 30 Q 80 15 135 30"
                  fill="none"
                  stroke="#34d399"
                  stroke-width="2.5"
                  stroke-dasharray="4 2"
                  filter="url(#glowDiode)"
                />
              </g>

              <!-- Forward Supercurrent Flow (Thick Asymmetric Jet) -->
              <path
                d="M 20 20 Q 80 5 140 20"
                fill="none"
                stroke="#38bdf8"
                :stroke-width="Math.max(1, state.forwardCriticalCurrentIcPlus * 0.8)"
                opacity="0.85"
                filter="url(#glowDiode)"
              />
            </g>

            <!-- Right Superconductor Lead S2 -->
            <g transform="translate(330, 100)">
              <rect x="0" y="0" width="130" height="160" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6" />
              <text x="65" y="30" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">超導電極 S₂</text>
              <text x="65" y="55" fill="#94a3b8" font-size="10" text-anchor="middle">Δ · exp(iφ₂)</text>
              <!-- Cooper Pair Icons -->
              <circle cx="45" cy="90" r="6" fill="#38bdf8" />
              <circle cx="55" cy="90" r="6" fill="#38bdf8" />
              <text x="50" y="115" fill="#bae6fd" font-size="9" text-anchor="middle">庫珀對 (2e)</text>
            </g>

            <!-- Top Asymmetry Indicator Banner -->
            <g transform="translate(180, 50)">
              <rect x="0" y="0" width="140" height="32" fill="#031120" stroke="#f59e0b" stroke-width="1.2" rx="6" />
              <text x="70" y="20" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">
                二極體整流率 η: {{ state.diodeEfficiencyEtaPercent.toFixed(1) }}%
              </text>
            </g>

            <!-- Right Panel: Current-Phase Relation (CPR) Curve -->
            <g transform="translate(500, 30)">
              <rect x="0" y="0" width="280" height="300" fill="#030d1a" stroke="#0284c7" stroke-width="1.2" rx="6" />
              <text x="140" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">
                電流-相位關係 CPR: I(φ)
              </text>

              <!-- Graph axes -->
              <g transform="translate(40, 140)">
                <line x1="0" y1="0" x2="220" y2="0" stroke="#475569" stroke-width="1" />
                <line x1="0" y1="-90" x2="0" y2="90" stroke="#475569" stroke-width="1" />
                <text x="225" y="4" fill="#64748b" font-size="9">φ</text>
                <text x="4" y="-85" fill="#64748b" font-size="9">+I_c</text>
                <text x="4" y="95" fill="#64748b" font-size="9">-I_c</text>

                <!-- CPR Plot Path -->
                <path
                  :d="cprSvgPath"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2"
                  filter="url(#glowDiode)"
                />

                <!-- Current Operating Point -->
                <circle
                  :cx="currentPointX"
                  :cy="currentPointY"
                  r="5"
                  fill="#f43f5e"
                  filter="url(#glowDiode)"
                />

                <!-- Asymmetric critical current guide lines -->
                <line
                  x1="0"
                  :y1="-state.forwardCriticalCurrentIcPlus * 12"
                  x2="220"
                  :y2="-state.forwardCriticalCurrentIcPlus * 12"
                  stroke="#10b981"
                  stroke-width="1"
                  stroke-dasharray="2 2"
                />
                <text x="210" :y="-state.forwardCriticalCurrentIcPlus * 12 - 3" fill="#34d399" font-size="8" text-anchor="end">
                  I_c+ = {{ state.forwardCriticalCurrentIcPlus.toFixed(2) }} μA
                </text>

                <line
                  x1="0"
                  :y1="state.reverseCriticalCurrentIcMinus * 12"
                  x2="220"
                  :y2="state.reverseCriticalCurrentIcMinus * 12"
                  stroke="#ef4444"
                  stroke-width="1"
                  stroke-dasharray="2 2"
                />
                <text x="210" :y="state.reverseCriticalCurrentIcMinus * 12 + 10" fill="#f87171" font-size="8" text-anchor="end">
                  |I_c-| = {{ state.reverseCriticalCurrentIcMinus.toFixed(2) }} μA
                </text>
              </g>

              <!-- Metrics -->
              <g transform="translate(20, 255)">
                <text x="0" y="0" fill="#94a3b8" font-size="10">反常相移 φ₀: <strong style="color: #38bdf8">{{ state.anomalousPhaseShiftPhi0Rad.toFixed(3) }} rad</strong></text>
                <text x="140" y="0" fill="#94a3b8" font-size="10">4π 穿隧振幅: <strong style="color: #34d399">{{ state.majoranaTunnelingAmplitude.toFixed(2) }} μA</strong></text>
                <text x="0" y="20" fill="#94a3b8" font-size="10">當前相位 φ: <strong style="color: #f59e0b">{{ state.currentPhase.toFixed(2) }} rad</strong></text>
                <text x="140" y="20" fill="#94a3b8" font-size="10">拓撲相狀態: <strong style="color: #34d399">{{ state.isTopologicalMajoranaActive ? '活躍 (MZM)' : '非拓撲' }}</strong></text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Regime Selector -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            :class="['regime-btn', { active: state.activeRegime === r.id }]"
            @click="setRegime(r.id)"
          >
            <span class="regime-icon">{{ r.icon }}</span>
            <div class="regime-info">
              <span class="regime-title">{{ r.name }}</span>
              <span class="regime-desc">{{ r.desc }}</span>
            </div>
          </button>
        </div>

        <!-- Sliders & Interactive Controls -->
        <div class="controls-grid">
          <div class="control-card">
            <label>
              <span>面內磁場 B_x: <strong>{{ state.inPlaneMagneticFieldTesla.toFixed(2) }} T</strong></span>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.05"
                :value="state.inPlaneMagneticFieldTesla"
                @input="handleBFieldChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>自旋軌道耦合 α: <strong>{{ state.spinOrbitCouplingAlpha.toFixed(1) }} meV·nm</strong></span>
              <input
                type="range"
                min="10.0"
                max="80.0"
                step="1.0"
                :value="state.spinOrbitCouplingAlpha"
                @input="handleAlphaChange"
              />
            </label>
          </div>

          <div class="control-card summary-card">
            <span class="sum-title">無耗散超導二極體指標</span>
            <div class="sum-val">η = {{ state.diodeEfficiencyEtaPercent.toFixed(1) }}%</div>
            <div class="sum-sub">ΔI_c = {{ (state.forwardCriticalCurrentIcPlus - state.reverseCriticalCurrentIcMinus).toFixed(2) }} μA</div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="action-row">
          <button class="pulse-btn" @click="triggerBreakdown">
            ⚡ 觸發超導二極體反常穿隧擊穿 (非對稱突波音效)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { majoranaJosephsonDiodeEngine, JosephsonDiodeRegime, JosephsonDiodeState } from '@/engine/majoranaJosephsonDiode';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const state = ref<JosephsonDiodeState>(majoranaJosephsonDiodeEngine.getState());
let animId: number | null = null;

const regimes = [
  { id: 'conventional-symmetric' as JosephsonDiodeRegime, name: '傳統對稱約瑟夫森態', icon: '⚖️', desc: 'φ₀ = 0, η = 0% 無整流' },
  { id: 'phi0-nonreciprocal' as JosephsonDiodeRegime, name: '反常相移非互易態', icon: '📐', desc: 'φ₀ ≠ 0, 弱非對稱 CPR' },
  { id: 'giant-diode' as JosephsonDiodeRegime, name: '巨超導二極體整流態', icon: '⚡', desc: 'η > 25%, 強非互易臨界流' },
  { id: 'majorana-4pi-tunneling' as JosephsonDiodeRegime, name: '馬約拉納 4π 分數穿隧態', icon: '🌀', desc: 'MZM 單電子穿隧, 拓撲保護' },
];

const cprSvgPath = computed(() => {
  const curve = state.value.cprCurve;
  if (!curve || curve.length === 0) return '';
  return curve.map((pt, idx) => {
    const x = (pt.phi / (4 * Math.PI)) * 220;
    const y = -pt.current * 12; // 放大比例
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
});

const currentPointX = computed(() => {
  return (state.value.currentPhase / (4 * Math.PI)) * 220;
});

const currentPointY = computed(() => {
  const phi = state.value.currentPhase;
  const phi0 = state.value.anomalousPhaseShiftPhi0Rad;
  const I1 = 3.5;
  const I2 = state.value.activeRegime === 'conventional-symmetric' ? 0.0 : 1.5;
  const IM = state.value.isTopologicalMajoranaActive ? state.value.majoranaTunnelingAmplitude : 0.0;
  const current = I1 * Math.sin(phi) + I2 * Math.sin(2 * phi - phi0) + IM * Math.sin((phi - phi0) / 2.0);
  return -current * 12;
});

function handleClose() {
  uiStore.closeOverlay();
}

function setRegime(regime: JosephsonDiodeRegime) {
  majoranaJosephsonDiodeEngine.setRegime(regime);
  state.value = majoranaJosephsonDiodeEngine.getState();
}

function handleBFieldChange(e: Event) {
  const target = e.target as HTMLInputElement;
  majoranaJosephsonDiodeEngine.setMagneticField(parseFloat(target.value));
  state.value = majoranaJosephsonDiodeEngine.getState();
}

function handleAlphaChange(e: Event) {
  const target = e.target as HTMLInputElement;
  majoranaJosephsonDiodeEngine.setSpinOrbitAlpha(parseFloat(target.value));
  state.value = majoranaJosephsonDiodeEngine.getState();
}

function triggerBreakdown() {
  majoranaJosephsonDiodeEngine.triggerDiodeBreakdownPulse();
  state.value = majoranaJosephsonDiodeEngine.getState();
}

function loop() {
  majoranaJosephsonDiodeEngine.update(0.016);
  state.value = majoranaJosephsonDiodeEngine.getState();
  animId = requestAnimationFrame(loop);
}

onMounted(() => {
  animId = requestAnimationFrame(loop);
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
  max-height: 92vh;
  background: #090d16;
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e2e8f0;
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #10b981;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #94a3b8;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f43f5e;
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
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.diode-svg {
  width: 100%;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.regime-btn {
  background: #101726;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #10b981;
  background: #132724;
}

.regime-btn.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.regime-icon {
  font-size: 20px;
}

.regime-info {
  display: flex;
  flex-direction: column;
}

.regime-title {
  font-size: 12px;
  font-weight: bold;
  color: #f8fafc;
}

.regime-desc {
  font-size: 10px;
  color: #94a3b8;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.control-card {
  background: #0f172a;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.control-card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #cbd5e1;
}

.control-card input[type="range"] {
  width: 100%;
  accent-color: #10b981;
}

.summary-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #042f2e;
  border-color: #115e59;
}

.sum-title {
  font-size: 11px;
  color: #5eead4;
}

.sum-val {
  font-size: 20px;
  font-weight: bold;
  color: #34d399;
  margin: 4px 0;
}

.sum-sub {
  font-size: 10px;
  color: #99f6e4;
}

.action-row {
  display: flex;
  justify-content: center;
}

.pulse-btn {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.pulse-btn:hover {
  background: linear-gradient(135deg, #047857, #065f46);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.5);
  transform: translateY(-1px);
}
</style>
