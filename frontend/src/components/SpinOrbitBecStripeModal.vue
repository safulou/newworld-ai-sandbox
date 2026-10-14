<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌈</span>
          <div>
            <h2>自旋-軌道耦合玻色凝聚條紋超固相</h2>
            <p class="subtitle">Spin-Orbit Coupled BEC & Stripe Phase Superfluidity</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="bec-svg">
            <defs>
              <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#ec4899" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.8" />
              </linearGradient>
              <filter id="glowStripe">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="#090d16" rx="8" />

            <!-- Left Panel: Dispersion Curve E-(kx) -->
            <g transform="translate(40, 20)">
              <rect x="0" y="0" width="340" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="170" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                單粒子雙能阱色散曲線 E-(kx)
              </text>
              <line x1="30" y1="260" x2="310" y2="260" stroke="#334155" stroke-width="1.5" />
              <line x1="170" y1="40" x2="170" y2="280" stroke="#334155" stroke-width="1.5" />
              <text x="310" y="280" fill="#64748b" font-size="10" text-anchor="end">kx</text>
              <text x="160" y="45" fill="#64748b" font-size="10" text-anchor="end">E/ER</text>

              <!-- Dispersion Curve -->
              <path :d="getDispersionPath()" stroke="#38bdf8" stroke-width="2.5" fill="none" filter="url(#glowStripe)" />

              <!-- Minima Markers -->
              <g v-if="state.minimaWavenumberK0 > 0.05">
                <circle :cx="170 - (state.minimaWavenumberK0 / 12) * 110" :cy="getDispersionMinY()" r="5" fill="#ec4899" />
                <circle :cx="170 + (state.minimaWavenumberK0 / 12) * 110" :cy="getDispersionMinY()" r="5" fill="#ec4899" />
                <text :cx="170 - (state.minimaWavenumberK0 / 12) * 110" :cy="getDispersionMinY() + 20" fill="#ec4899" font-size="10" text-anchor="middle">
                  -k0
                </text>
                <text :cx="170 + (state.minimaWavenumberK0 / 12) * 110" :cy="getDispersionMinY() + 20" fill="#ec4899" font-size="10" text-anchor="middle">
                  +k0
                </text>
              </g>
              <g v-else>
                <circle cx="170" :cy="getDispersionMinY()" r="5" fill="#10b981" />
                <text x="170" :y="getDispersionMinY() + 20" fill="#10b981" font-size="10" text-anchor="middle">
                  k = 0 (單能阱)
                </text>
              </g>
            </g>

            <!-- Right Panel: Real-Space Stripe Phase Density n(x, y) -->
            <g transform="translate(420, 20)">
              <rect x="0" y="0" width="340" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="170" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                超固態空間密度週期條紋 n(x, y)
              </text>

              <!-- Stripe simulation bars -->
              <g v-for="i in 14" :key="'st' + i">
                <rect
                  :x="30 + (i - 1) * 20"
                  y="45"
                  width="12"
                  height="180"
                  :fill="i % 2 === 0 ? '#38bdf8' : '#ec4899'"
                  :opacity="0.25 + state.stripeContrast * 0.65 * Math.abs(Math.sin((i / 14) * Math.PI))"
                  rx="3"
                />
                <!-- Spin Arrows along stripe -->
                <line
                  :x1="36 + (i - 1) * 20"
                  :y1="i % 2 === 0 ? 115 : 145"
                  :x2="36 + (i - 1) * 20"
                  :y2="i % 2 === 0 ? 145 : 115"
                  :stroke="i % 2 === 0 ? '#67e8f9' : '#f472b6'"
                  stroke-width="2"
                  marker-end="url(#arrow)"
                />
              </g>

              <!-- Anisotropic Superfluid Ellipse -->
              <g transform="translate(170, 265)">
                <text x="0" y="-22" fill="#94a3b8" font-size="11" text-anchor="middle">各向異性超流剛度張量</text>
                <!-- Outer reference circle (isotropic = 1.0) -->
                <ellipse cx="0" cy="0" rx="60" ry="22" stroke="#334155" stroke-dasharray="3 3" fill="none" />
                <!-- Actual anisotropic superfluid ellipse -->
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="Math.max(10, 60 * state.superfluidFractionX)"
                  :ry="22 * state.superfluidFractionY"
                  fill="rgba(56, 189, 248, 0.2)"
                  stroke="#38bdf8"
                  stroke-width="2"
                />
                <text x="0" y="4" fill="#38bdf8" font-size="10" text-anchor="middle" font-family="monospace">
                  fs,x = {{ (state.superfluidFractionX * 100).toFixed(0) }}%, fs,y = 100%
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card highlight">
            <span class="label">空間條紋週期 λ</span>
            <span class="value cyan">{{ state.stripeWavelengthNm > 0 ? state.stripeWavelengthNm.toFixed(1) + ' nm' : '無 (單能阱)' }}</span>
          </div>
          <div class="metric-card">
            <span class="label">條紋密度反差 C</span>
            <span class="value pink">{{ (state.stripeContrast * 100).toFixed(1) }}%</span>
          </div>
          <div class="metric-card">
            <span class="label">軸向超流剛度 fs,x</span>
            <span class="value" :class="state.superfluidFractionX > 0.6 ? 'green' : 'amber'">
              {{ (state.superfluidFractionX * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="metric-card">
            <span class="label">基態動量波矢 k0</span>
            <span class="value purple">{{ state.minimaWavenumberK0.toFixed(3) }} μm⁻¹</span>
          </div>
          <div class="metric-card">
            <span class="label">回衝能量 ER / h</span>
            <span class="value yellow">{{ state.recoilEnergyKhz.toFixed(2) }} kHz</span>
          </div>
          <div class="metric-card">
            <span class="label">當前體制狀態</span>
            <span class="value orange">{{ getRegimeShort(state.regime) }}</span>
          </div>
        </div>

        <!-- Sliders -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>拉曼耦合強度 ℏΩR / ER</span>
              <span class="slider-val">{{ state.ramanCouplingER.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="5.50"
              step="0.05"
              :value="state.ramanCouplingER"
              @input="updateCoupling(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.10 (深雙阱)</span>
              <span>4.00 (臨界轉折)</span>
              <span>5.50 (單阱)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>拉曼失諧 ℏδ / ER</span>
              <span class="slider-val">{{ state.ramanDetuningER.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="-1.50"
              max="1.50"
              step="0.05"
              :value="state.ramanDetuningER"
              @input="updateDetuning(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>-1.50 (自旋向左)</span>
              <span>0.00 (對稱雙能阱)</span>
              <span>+1.50 (自旋向右)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>回衝波矢 kR</span>
              <span class="slider-val">{{ state.recoilWavenumberUm.toFixed(1) }} μm⁻¹</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="16.0"
              step="0.5"
              :value="state.recoilWavenumberUm"
              @input="updateRecoil(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>3.0 μm⁻¹</span>
              <span>8.0 μm⁻¹ (典型紅寶石光)</span>
              <span>16.0 μm⁻¹</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerSupersolid">
            ⚡ 一鍵激發空間條紋超固相
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
import { spinOrbitBecEngine, SpinOrbitBecState, SocBecRegime } from '@/engine/spinOrbitBecStripePhase';
import { useUIStore } from '@/stores/ui';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const state = ref<SpinOrbitBecState>(spinOrbitBecEngine.getState());
let timer: number | null = null;

onMounted(() => {
  achievements.unlock('spin_orbit_bec_stripe_phase');
  timer = window.setInterval(() => {
    state.value = spinOrbitBecEngine.getState();
  }, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleClose() {
  uiStore.closeOverlay();
}

function updateCoupling(val: number) {
  spinOrbitBecEngine.setRamanCoupling(val);
  state.value = spinOrbitBecEngine.getState();
  achievements.unlock('spin_orbit_bec_stripe_phase');
}

function updateDetuning(val: number) {
  spinOrbitBecEngine.setRamanDetuning(val);
  state.value = spinOrbitBecEngine.getState();
}

function updateRecoil(val: number) {
  spinOrbitBecEngine.setRecoilWavenumber(val);
  state.value = spinOrbitBecEngine.getState();
}

function triggerSupersolid() {
  spinOrbitBecEngine.triggerSupersolidInterference();
  state.value = spinOrbitBecEngine.getState();
  achievements.unlock('spin_orbit_bec_stripe_phase');
}

function cycleRegime() {
  spinOrbitBecEngine.cycleRegime();
  state.value = spinOrbitBecEngine.getState();
  achievements.unlock('spin_orbit_bec_stripe_phase');
}

function getRegimeLabel(r: SocBecRegime): string {
  switch (r) {
    case 'stripe-supersolid': return '條紋超固態 (Omega_R < 4 ER)';
    case 'single-minimum': return '單能阱零動量態 (Omega_R >= 4 ER)';
    case 'plane-wave': return '自旋極化平面波態';
    case 'raman-quench': return '非絕熱拉曼淬火態';
  }
}

function getRegimeShort(r: SocBecRegime): string {
  switch (r) {
    case 'stripe-supersolid': return '條紋超固相';
    case 'single-minimum': return '單能阱相';
    case 'plane-wave': return '平面波相';
    case 'raman-quench': return '拉曼淬火態';
  }
}

function getDispersionPath(): string {
  const omega = state.value.ramanCouplingER;
  const delta = state.value.ramanDetuningER;
  let path = '';

  for (let px = -12; px <= 12; px += 0.5) {
    // Single-particle lower dispersion E_-(kx) = kx^2 + 1 - sqrt((2*kx + delta/2)^2 + (omega/2)^2)
    const kx = px / 6.0;
    const radical = Math.sqrt(Math.pow(2.0 * kx + delta * 0.5, 2) + Math.pow(omega * 0.5, 2));
    const E = kx * kx + 1.0 - radical;

    const svgX = 170 + (px / 12) * 110;
    const svgY = 220 - (E * 25);
    if (px === -12) path += `M ${svgX} ${svgY}`;
    else path += ` L ${svgX} ${svgY}`;
  }
  return path;
}

function getDispersionMinY(): number {
  const omega = state.value.ramanCouplingER;
  const k0 = state.value.minimaWavenumberK0 / 8.0;
  const radical = Math.sqrt(Math.pow(2.0 * k0, 2) + Math.pow(omega * 0.5, 2));
  const E = k0 * k0 + 1.0 - radical;
  return 220 - (E * 25);
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

.bec-svg {
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
.value.pink { color: #ec4899; }
.value.green { color: #34d399; }
.value.amber { color: #f59e0b; }
.value.purple { color: #c084fc; }
.value.yellow { color: #facc15; }
.value.orange { color: #fb923c; }

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
