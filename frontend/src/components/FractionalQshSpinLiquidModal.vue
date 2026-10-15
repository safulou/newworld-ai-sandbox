<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚛️</span>
          <div>
            <h2>莫爾分數量子自旋霍爾與雙重自旋液體反應堆</h2>
            <p class="subtitle">Fractional Quantum Spin Hall (FQSH), Spin-Charge Separation & Dual Spin Liquid</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="fqsh-svg">
            <defs>
              <linearGradient id="fqshBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020b14" />
                <stop offset="50%" stop-color="#071b2e" />
                <stop offset="100%" stop-color="#04121d" />
              </linearGradient>

              <radialGradient id="holonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#eab308" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#eab308" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="spinonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
              </radialGradient>

              <filter id="glowFqsh">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#fqshBg)" rx="8" />

            <!-- Moiré Mini-Brillouin Zone Hexagons -->
            <g opacity="0.25">
              <polygon
                v-for="h in 6"
                :key="'moire-hex' + h"
                :points="getHexPoints(h * 90 - 10, 180, 48)"
                fill="none"
                stroke="#38bdf8"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />
            </g>

            <!-- Dual Topological Spin Liquid RVB Resonating Bonds -->
            <g v-if="state.activeRegime === 'dual-spin-liquid'" opacity="0.65">
              <line
                v-for="(bond, idx) in rvbBonds"
                :key="'bond' + idx"
                :x1="bond.x1"
                :y1="bond.y1"
                :x2="bond.x2"
                :y2="bond.y2"
                stroke="#c084fc"
                stroke-width="2"
                stroke-dasharray="4 2"
                filter="url(#glowFqsh)"
              />
            </g>

            <!-- Top Helical Edge Channel: Spin-Up Electrons (Drift Right, Blue) -->
            <g transform="translate(40, 70)">
              <line x1="0" y1="0" x2="480" y2="0" stroke="#38bdf8" stroke-width="3" opacity="0.8" />
              <text x="495" y="4" fill="#38bdf8" font-size="11" font-weight="bold">螺旋邊界通道 (自旋向上 ↑, 手性右移)</text>
              <polygon points="475,-4 485,0 475,4" fill="#38bdf8" />

              <!-- Spin-Up Edge Wave Packets -->
              <g
                v-for="i in 5"
                :key="'spin-up' + i"
                :transform="`translate(${(animTick * 60 + i * 90) % 480}, 0)`"
              >
                <circle cx="0" cy="0" r="5" fill="#38bdf8" filter="url(#glowFqsh)" />
                <text x="0" y="-8" fill="#bae6fd" font-size="9" text-anchor="middle">↑</text>
              </g>
            </g>

            <!-- Bottom Helical Edge Channel: Spin-Down Electrons (Drift Left, Pink) -->
            <g transform="translate(40, 270)">
              <line x1="0" y1="0" x2="480" y2="0" stroke="#f43f5e" stroke-width="3" opacity="0.8" />
              <text x="495" y="4" fill="#f43f5e" font-size="11" font-weight="bold">螺旋邊界通道 (自旋向下 ↓, 手性左移)</text>
              <polygon points="5,-4 -5,0 5,4" fill="#f43f5e" />

              <!-- Spin-Down Edge Wave Packets -->
              <g
                v-for="i in 5"
                :key="'spin-down' + i"
                :transform="`translate(${480 - ((animTick * 60 + i * 90) % 480)}, 0)`"
              >
                <circle cx="0" cy="0" r="5" fill="#f43f5e" filter="url(#glowFqsh)" />
                <text x="0" y="14" fill="#fecdd3" font-size="9" text-anchor="middle">↓</text>
              </g>
            </g>

            <!-- Bulk 2D: Spin-Charge Separation Chamber -->
            <g transform="translate(40, 110)">
              <rect x="0" y="0" width="480" height="140" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="2 4" rx="6" />
              <text x="10" y="20" fill="#94a3b8" font-size="10">體態拓撲自旋液體 / 自旋-電荷分離域</text>

              <!-- Holons (Fast Drift, Yellow, q = e*, S = 0) -->
              <g
                v-for="k in 4"
                :key="'holon' + k"
                :transform="`translate(${((animTick * state.holonVelocity * 20 + k * 120) % 460) + 10}, ${40 + (k % 2) * 50})`"
              >
                <circle cx="0" cy="0" r="14" fill="url(#holonGlow)" filter="url(#glowFqsh)" />
                <circle cx="0" cy="0" r="6" fill="#eab308" />
                <text x="0" y="3" fill="#ffffff" font-size="8" text-anchor="middle" font-weight="bold">e*</text>
                <text x="0" y="-9" fill="#fde047" font-size="8" text-anchor="middle">荷子</text>
              </g>

              <!-- Spinons (Slow Drift, Cyan, q = 0, S = 1/2) -->
              <g
                v-for="k in 4"
                :key="'spinon' + k"
                :transform="`translate(${((animTick * state.spinonVelocity * 20 + k * 120) % 460) + 10}, ${65 + (k % 2) * 40})`"
              >
                <circle cx="0" cy="0" r="12" fill="url(#spinonGlow)" filter="url(#glowFqsh)" />
                <circle cx="0" cy="0" r="5" fill="#06b6d4" />
                <text x="0" y="3" fill="#ffffff" font-size="8" text-anchor="middle" font-weight="bold">S</text>
                <text x="0" y="16" fill="#67e8f9" font-size="8" text-anchor="middle">自旋子</text>
              </g>
            </g>

            <!-- Right Panel: Fractional Conductance & Entropy Display -->
            <g transform="translate(560, 40)">
              <rect x="0" y="0" width="220" height="280" fill="#030d18" stroke="#0ea5e9" stroke-width="1.2" rx="6" />
              <text x="110" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">拓撲量測分析儀</text>

              <!-- Fractional Plateaus Mini-Graph -->
              <g transform="translate(20, 50)">
                <line x1="0" y1="90" x2="180" y2="90" stroke="#475569" stroke-width="1" />
                <line x1="0" y1="0" x2="0" y2="90" stroke="#475569" stroke-width="1" />
                <text x="185" y="94" fill="#64748b" font-size="9">ν</text>
                <text x="4" y="-4" fill="#64748b" font-size="9">σ_xy^s</text>

                <!-- Step plateaus for 1/3, 2/3, 1 -->
                <path
                  d="M 0 90 L 30 90 L 40 60 L 80 60 L 90 30 L 130 30 L 140 0 L 170 0"
                  fill="none"
                  stroke="#06b6d4"
                  stroke-width="2"
                />
                <!-- Current Filling Indicator Point -->
                <circle
                  :cx="Math.min(170, state.fillingNu * 170)"
                  :cy="90 - Math.min(90, state.spinHallConductance * 90)"
                  r="4.5"
                  fill="#f43f5e"
                  filter="url(#glowFqsh)"
                />
              </g>

              <g transform="translate(20, 170)">
                <text x="0" y="0" fill="#94a3b8" font-size="10">自旋霍爾電導 σ_xy^s:</text>
                <text x="180" y="0" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="end">
                  {{ state.spinHallConductance.toFixed(3) }} (e/4π)
                </text>

                <text x="0" y="24" fill="#94a3b8" font-size="10">速度分離比 (v_h / v_s):</text>
                <text x="180" y="24" fill="#eab308" font-size="12" font-weight="bold" text-anchor="end">
                  {{ state.spinChargeSeparationRatio.toFixed(2) }}x
                </text>

                <text x="0" y="48" fill="#94a3b8" font-size="10">拓撲糾纏熵 γ:</text>
                <text x="180" y="48" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="end">
                  {{ state.topologicalEntropy.toFixed(4) }}
                </text>

                <text x="0" y="72" fill="#94a3b8" font-size="10">邊緣穿透長度 ξ:</text>
                <text x="180" y="72" fill="#34d399" font-size="12" font-weight="bold" text-anchor="end">
                  {{ state.helicalEdgeDecayLength.toFixed(1) }} nm
                </text>
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
              <span>莫爾扭轉角 θ: <strong>{{ state.twistAngleDeg.toFixed(2) }}°</strong></span>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.05"
                :value="state.twistAngleDeg"
                @input="handleTwistChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>莫爾平帶填充 ν: <strong>{{ state.fillingNu.toFixed(3) }}</strong></span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.01"
                :value="state.fillingNu"
                @input="handleFillingChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>庫侖相互作用 U: <strong>{{ state.coulombU.toFixed(1) }} meV</strong></span>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.coulombU"
                @input="handleCoulombChange"
              />
            </label>
          </div>
        </div>

        <!-- Action Button -->
        <div class="action-row">
          <button class="pulse-btn" @click="triggerPulse">
            ⚡ 激發自旋-電荷分離超流脈衝 (雙頻滑音調諧)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { fractionalQshSpinLiquidEngine, FQSHRegime, FQSHState } from '@/engine/fractionalQshSpinLiquid';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const state = ref<FQSHState>(fractionalQshSpinLiquidEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const regimes = [
  { id: 'integer-qsh' as FQSHRegime, name: '整數量子自旋霍爾相', icon: '🌀', desc: 'ν = 1, σ_xy^s = 1 (e/4π)' },
  { id: 'fractional-qsh' as FQSHRegime, name: '莫爾分數量子自旋霍爾態', icon: '⚛️', desc: 'ν = 2/3, 拓撲分數電導' },
  { id: 'spin-charge-separation' as FQSHRegime, name: '自旋-電荷分離液體態', icon: '⚡', desc: '荷子與自旋子異速漂移' },
  { id: 'dual-spin-liquid' as FQSHRegime, name: '雙重拓撲量子自旋液體', icon: '🔮', desc: 'RVB 共振鍵網絡 γ = 2 ln 2' },
];

const rvbBonds = [
  { x1: 120, y1: 150, x2: 180, y2: 170 },
  { x1: 200, y1: 160, x2: 270, y2: 140 },
  { x1: 290, y1: 170, x2: 360, y2: 160 },
  { x1: 380, y1: 150, x2: 440, y2: 180 },
  { x1: 160, y1: 210, x2: 220, y2: 230 },
  { x1: 260, y1: 220, x2: 330, y2: 200 }
];

function getHexPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

function handleClose() {
  uiStore.closeOverlay();
}

function setRegime(regime: FQSHRegime) {
  fractionalQshSpinLiquidEngine.setRegime(regime);
  state.value = fractionalQshSpinLiquidEngine.getState();
}

function handleTwistChange(e: Event) {
  const target = e.target as HTMLInputElement;
  fractionalQshSpinLiquidEngine.setTwistAngle(parseFloat(target.value));
  state.value = fractionalQshSpinLiquidEngine.getState();
}

function handleFillingChange(e: Event) {
  const target = e.target as HTMLInputElement;
  fractionalQshSpinLiquidEngine.setFillingNu(parseFloat(target.value));
  state.value = fractionalQshSpinLiquidEngine.getState();
}

function handleCoulombChange(e: Event) {
  const target = e.target as HTMLInputElement;
  fractionalQshSpinLiquidEngine.setCoulombU(parseFloat(target.value));
  state.value = fractionalQshSpinLiquidEngine.getState();
}

function triggerPulse() {
  fractionalQshSpinLiquidEngine.triggerSpinChargePulse();
  state.value = fractionalQshSpinLiquidEngine.getState();
}

function loop() {
  animTick.value += 0.03;
  fractionalQshSpinLiquidEngine.update(0.016);
  state.value = fractionalQshSpinLiquidEngine.getState();
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
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.2);
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
  color: #38bdf8;
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
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.fqsh-svg {
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
  border-color: #38bdf8;
  background: #132238;
}

.regime-btn.active {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.2);
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
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
  accent-color: #0ea5e9;
}

.action-row {
  display: flex;
  justify-content: center;
}

.pulse-btn {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.pulse-btn:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.5);
  transform: translateY(-1px);
}
</style>
