<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🔮</span>
          <div>
            <h2>旋轉黑洞全息超糾纏引力透鏡天線</h2>
            <p class="subtitle">Kerr Black Hole SDL Gravitational Lensing, Relativistic Einstein Rings & Tri-State Hyper-Entanglement</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="hyper-lens-svg">
            <defs>
              <linearGradient id="lensBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#050212" />
                <stop offset="50%" stop-color="#110729" />
                <stop offset="100%" stop-color="#090317" />
              </linearGradient>

              <radialGradient id="bhHorizon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="85%" stop-color="#0f0724" />
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0.8" />
              </radialGradient>

              <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                <stop offset="90%" stop-color="#ec4899" stop-opacity="0" />
                <stop offset="96%" stop-color="#c084fc" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
              </radialGradient>

              <filter id="glowLens">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#lensBg)" rx="8" />

            <!-- Spacetime Geodesic Grid (Curving towards BH) -->
            <g opacity="0.18">
              <circle
                v-for="r in 7"
                :key="'grid-r' + r"
                cx="260"
                cy="180"
                :r="r * 32"
                fill="none"
                stroke="#c084fc"
                stroke-width="1"
              />
            </g>

            <!-- Relativistic Concentric Einstein Rings -->
            <g transform="translate(260, 180)">
              <!-- Black Hole Shadow & Event Horizon -->
              <circle cx="0" cy="0" r="48" fill="url(#bhHorizon)" filter="url(#glowLens)" />
              <text x="0" y="4" fill="#e9d5ff" font-size="10" font-weight="bold" text-anchor="middle">
                克爾黑洞 (r_H)
              </text>

              <!-- Photon Sphere Boundary r_ph -->
              <circle
                cx="0"
                cy="0"
                r="72"
                fill="none"
                stroke="#f43f5e"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />
              <text x="0" y="-76" fill="#fb7185" font-size="9" text-anchor="middle">光子球臨界邊界 r_ph</text>

              <!-- Relativistic Einstein Rings of Order n = 1, 2, 3, 4 -->
              <g v-for="ring in state.relativisticRings" :key="'ring' + ring.order">
                <circle
                  cx="0"
                  cy="0"
                  :r="72 + ring.radius * 3.5"
                  fill="none"
                  stroke="#c084fc"
                  :stroke-width="1.5 + ring.intensity * 2.5"
                  :opacity="0.3 + ring.intensity * 0.7"
                  filter="url(#glowLens)"
                />
              </g>

              <!-- Orbiting Lensed Photons Wavepacket -->
              <circle
                :cx="Math.cos(animTick * 3.0) * (78 + (state.impactParameterRatio - 1) * 30)"
                :cy="Math.sin(animTick * 3.0) * (78 + (state.impactParameterRatio - 1) * 30)"
                r="6"
                fill="#f472b6"
                filter="url(#glowLens)"
              />
            </g>

            <!-- Lensing Light Ray Trajectories (Incoming Left -> Wrapping -> Emitting Right) -->
            <g transform="translate(40, 40)" opacity="0.85">
              <path
                d="M 20 60 Q 180 80 220 120 T 320 180"
                fill="none"
                stroke="#38bdf8"
                stroke-width="2"
                stroke-dasharray="4 2"
                filter="url(#glowLens)"
              />
              <text x="25" y="52" fill="#38bdf8" font-size="10">超糾纏入射光束</text>
            </g>

            <!-- Right Panel: Tri-State Hyper-Entanglement Decoder -->
            <g transform="translate(510, 30)">
              <rect x="0" y="0" width="265" height="300" fill="#0b031c" stroke="#a855f7" stroke-width="1.2" rx="6" />
              <text x="132" y="24" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">
                三重超糾纏態量測矩陣
              </text>

              <!-- Three degrees of freedom visual bars -->
              <!-- 1. Polarization Mode -->
              <g transform="translate(20, 50)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11" font-weight="bold">1. 偏振態 (Polarization):</text>
                <text x="225" y="0" fill="#38bdf8" font-size="11" text-anchor="end">|H⟩ + |V⟩</text>
                <rect x="0" y="8" width="225" height="8" fill="#1e1b4b" rx="4" />
                <rect x="0" y="8" width="215" height="8" fill="#38bdf8" rx="4" filter="url(#glowLens)" />
              </g>

              <!-- 2. Orbital Angular Momentum OAM -->
              <g transform="translate(20, 95)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11" font-weight="bold">2. 軌道角動量 (OAM):</text>
                <text x="225" y="0" fill="#c084fc" font-size="11" text-anchor="end">ℓ = ±{{ state.oamModeNumberL }}</text>
                <rect x="0" y="8" width="225" height="8" fill="#1e1b4b" rx="4" />
                <rect x="0" y="8" :width="Math.min(225, state.oamModeNumberL * 45)" height="8" fill="#c084fc" rx="4" filter="url(#glowLens)" />
              </g>

              <!-- 3. Time-Bin Early/Late -->
              <g transform="translate(20, 140)">
                <text x="0" y="0" fill="#cbd5e1" font-size="11" font-weight="bold">3. 時域時隙 (Time-Bin):</text>
                <text x="225" y="0" fill="#f43f5e" font-size="11" text-anchor="end">|early⟩ + |late⟩</text>
                <rect x="0" y="8" width="225" height="8" fill="#1e1b4b" rx="4" />
                <rect x="0" y="8" width="205" height="8" fill="#f43f5e" rx="4" filter="url(#glowLens)" />
              </g>

              <!-- Fidelity & Lensing Metrics -->
              <g transform="translate(20, 190)">
                <rect x="0" y="0" width="225" height="95" fill="#15082b" stroke="#6b21a8" stroke-width="1" rx="6" />

                <text x="12" y="24" fill="#94a3b8" font-size="10">超糾纏保真度 F_hyper:</text>
                <text x="213" y="24" fill="#a855f7" font-size="13" font-weight="bold" text-anchor="end">
                  {{ (state.hyperEntanglementFidelity * 100).toFixed(2) }}%
                </text>

                <text x="12" y="46" fill="#94a3b8" font-size="10">強偏折角 α(b):</text>
                <text x="213" y="46" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="end">
                  {{ state.deflectionAngleRad.toFixed(2) }} rad
                </text>

                <text x="12" y="68" fill="#94a3b8" font-size="10">全息引力增益:</text>
                <text x="213" y="68" fill="#34d399" font-size="11" font-weight="bold" text-anchor="end">
                  +{{ state.holographicGainDb.toFixed(1) }} dB
                </text>

                <text x="12" y="86" fill="#94a3b8" font-size="9">愛因斯坦環角徑: {{ state.einsteinRingRadiusArcsec.toFixed(1) }}"</text>
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
              <span>黑洞自旋 a*: <strong>{{ state.blackHoleSpinAStar.toFixed(3) }}</strong></span>
              <input
                type="range"
                min="0.0"
                max="0.998"
                step="0.005"
                :value="state.blackHoleSpinAStar"
                @input="handleSpinChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>衝擊參數比 b/b_c: <strong>{{ state.impactParameterRatio.toFixed(3) }}</strong></span>
              <input
                type="range"
                min="1.001"
                max="2.5"
                step="0.005"
                :value="state.impactParameterRatio"
                @input="handleImpactChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>OAM 軌道拓撲荷 ℓ: <strong>{{ state.oamModeNumberL }}</strong></span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                :value="state.oamModeNumberL"
                @input="handleOamChange"
              />
            </label>
          </div>
        </div>

        <!-- Action Button -->
        <div class="action-row">
          <button class="pulse-btn" @click="triggerFocus">
            🔮 激發全息超糾纏引力透鏡共振聚焦 (三和弦雙曲滑音)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { holographicHyperEntangledLensEngine, HyperLensRegime, HyperLensState } from '@/engine/holographicHyperEntangledLens';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const state = ref<HyperLensState>(holographicHyperEntangledLensEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const regimes = [
  { id: 'weak-deflection-lensing' as HyperLensRegime, name: '幾何弱偏折相', icon: '🌌', desc: '幾何成像, 弱干涉' },
  { id: 'strong-deflection-einstein-ring' as HyperLensRegime, name: '強偏折愛因斯坦環態', icon: '⭕', desc: 'b → b_c, SDL 對數發散' },
  { id: 'hyper-entangled-multiplexing' as HyperLensRegime, name: '三重超糾纏分發態', icon: '🔮', desc: '偏振-OAM-時隙三態耦合' },
  { id: 'holographic-fidelity-amplification' as HyperLensRegime, name: '全息視界保真度增強', icon: '✨', desc: 'F > 98%, +48 dB 增益' },
];

function handleClose() {
  uiStore.closeOverlay();
}

function setRegime(regime: HyperLensRegime) {
  holographicHyperEntangledLensEngine.setRegime(regime);
  state.value = holographicHyperEntangledLensEngine.getState();
}

function handleSpinChange(e: Event) {
  const target = e.target as HTMLInputElement;
  holographicHyperEntangledLensEngine.setBlackHoleSpin(parseFloat(target.value));
  state.value = holographicHyperEntangledLensEngine.getState();
}

function handleImpactChange(e: Event) {
  const target = e.target as HTMLInputElement;
  holographicHyperEntangledLensEngine.setImpactParameter(parseFloat(target.value));
  state.value = holographicHyperEntangledLensEngine.getState();
}

function handleOamChange(e: Event) {
  const target = e.target as HTMLInputElement;
  holographicHyperEntangledLensEngine.setOamMode(parseInt(target.value, 10));
  state.value = holographicHyperEntangledLensEngine.getState();
}

function triggerFocus() {
  holographicHyperEntangledLensEngine.triggerHolographicFocusPulse();
  state.value = holographicHyperEntangledLensEngine.getState();
}

function loop() {
  animTick.value += 0.025;
  holographicHyperEntangledLensEngine.update(0.016);
  state.value = holographicHyperEntangledLensEngine.getState();
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
  background: #090314;
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.2);
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
  color: #c084fc;
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
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.hyper-lens-svg {
  width: 100%;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.regime-btn {
  background: #100824;
  border: 1px solid #1e113d;
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
  border-color: #c084fc;
  background: #1c0e38;
}

.regime-btn.active {
  border-color: #a855f7;
  background: rgba(168, 85, 247, 0.25);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
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
  background: #110729;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #23124d;
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
  accent-color: #a855f7;
}

.action-row {
  display: flex;
  justify-content: center;
}

.pulse-btn {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.pulse-btn:hover {
  background: linear-gradient(135deg, #6d28d9, #5b21b6);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.5);
  transform: translateY(-1px);
}
</style>
