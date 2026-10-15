<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌌</span>
          <div>
            <h2>全息引力波奇異偏振探測天線</h2>
            <p class="subtitle">Extended Gravity Theories, 6 Polarization Modes & Holographic Cavity Interferometry</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="gw-svg">
            <defs>
              <linearGradient id="gwBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#050a1a" />
                <stop offset="50%" stop-color="#0a1533" />
                <stop offset="100%" stop-color="#030612" />
              </linearGradient>

              <radialGradient id="armGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.1" />
              </radialGradient>

              <filter id="glowGw">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#gwBg)" rx="8" />

            <!-- Spacetime Curvature Ripple Grid -->
            <g opacity="0.12">
              <circle
                v-for="r in 6"
                :key="'sp-' + r"
                cx="240"
                cy="180"
                :r="r * 32 + ((animTick * 25) % 32)"
                fill="none"
                stroke="#60a5fa"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />
            </g>

            <!-- Interferometer L-Arms & Mirror Geometry -->
            <g transform="translate(140, 180)">
              <!-- X Arm Beam -->
              <line
                x1="0"
                y1="0"
                x2="150"
                y2="0"
                stroke="#38bdf8"
                :stroke-width="2 + Math.sin(animTick * 8) * 0.8"
                filter="url(#glowGw)"
              />
              <!-- Y Arm Beam -->
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-130"
                stroke="#38bdf8"
                :stroke-width="2 + Math.cos(animTick * 8) * 0.8"
                filter="url(#glowGw)"
              />

              <!-- Beam Splitter Core (45 deg) -->
              <polygon points="-8,-8 8,8 6,10 -10,-6" fill="#93c5fd" />
              
              <!-- End Mirrors -->
              <rect x="148" y="-12" width="6" height="24" fill="#60a5fa" rx="2" />
              <rect x="-12" y="-136" width="24" height="6" fill="#60a5fa" rx="2" />

              <!-- Holographic CFT Horizon Node -->
              <circle cx="0" cy="0" r="14" fill="url(#armGlow)" filter="url(#glowGw)" />
              <circle cx="0" cy="0" r="5" fill="#f8fafc" />
            </g>

            <!-- Six Polarization Deformation Quadrupole Modes Grid (Right/Center) -->
            <g transform="translate(320, 25)">
              <text x="10" y="16" fill="#93c5fd" font-size="12" font-weight="bold">六維偏振四極矩受激形變模式</text>
              <g v-for="(p, idx) in state.patterns" :key="'pat-' + idx">
                <g :transform="`translate(${(idx % 3) * 75 + 30}, ${Math.floor(idx / 3) * 70 + 48})`">
                  <!-- Deformation Ellipse -->
                  <ellipse
                    cx="0"
                    cy="0"
                    :rx="18 * p.axisRatioX"
                    :ry="18 * p.axisRatioY"
                    fill="none"
                    :stroke="p.type === 'tensor' ? '#38bdf8' : (p.type === 'scalar' ? '#f43f5e' : '#a855f7')"
                    stroke-width="2"
                    filter="url(#glowGw)"
                  />
                  <!-- Inner Core -->
                  <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
                  <!-- Label -->
                  <text x="0" y="28" fill="#cbd5e1" font-size="9" text-anchor="middle" font-family="monospace">
                    {{ p.name.split(' ')[0] }}
                  </text>
                </g>
              </g>
            </g>

            <!-- Exotic Ratio Gauge (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="85" fill="#0c1938" rx="6" stroke="#2563eb" stroke-width="1" />
              <text x="15" y="22" fill="#bfdbfe" font-size="12" font-weight="bold">奇異偏振比率 (ξ_exotic)</text>
              <circle cx="45" cy="52" r="22" fill="none" stroke="#1e3a8a" stroke-width="5" />
              <circle
                cx="45"
                cy="52"
                r="22"
                fill="none"
                stroke="#60a5fa"
                stroke-width="5"
                stroke-dasharray="138"
                :stroke-dashoffset="138 * (1 - state.exoticPolarizationRatio)"
                transform="rotate(-90, 45, 52)"
              />
              <text x="45" y="56" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">
                {{ (state.exoticPolarizationRatio * 100).toFixed(0) }}%
              </text>
              <text x="85" y="46" fill="#93c5fd" font-size="11">純量/向量激發</text>
              <text x="85" y="64" fill="#f43f5e" font-size="11" font-weight="bold">
                {{ state.exoticPolarizationRatio > 0.5 ? '超越愛因斯坦 GR' : '標準張量主導' }}
              </text>
            </g>

            <!-- Holographic SNR Meter (Middle Right) -->
            <g transform="translate(565, 130)">
              <rect x="0" y="0" width="210" height="90" fill="#0c1938" rx="6" stroke="#3b82f6" stroke-width="1" />
              <text x="15" y="22" fill="#bfdbfe" font-size="12" font-weight="bold">全息信噪比 SNR</text>
              <text x="15" y="52" fill="#60a5fa" font-size="22" font-weight="bold" font-family="monospace">
                +{{ state.holographicSnrDb }} dB
              </text>
              <!-- Progress Indicator -->
              <rect x="15" y="64" width="180" height="8" fill="#1e3a8a" rx="3" />
              <rect x="15" y="64" :width="Math.min(180, (state.holographicSnrDb / 50) * 180)" height="8" fill="#38bdf8" rx="3" />
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 230)">
              <rect x="0" y="0" width="210" height="100" fill="#0c1938" rx="6" stroke="#2563eb" stroke-width="1" />
              <text x="15" y="22" fill="#bfdbfe" font-size="12" font-weight="bold">引力應變物理分量</text>
              <text x="15" y="42" fill="#93c5fd" font-size="10">張量 (h+, h×): <tspan fill="#38bdf8" font-weight="bold">{{ state.strainHPlus }} / {{ state.strainHCross }}</tspan></text>
              <text x="15" y="60" fill="#93c5fd" font-size="10">呼吸純量 hb: <tspan fill="#f43f5e" font-weight="bold">{{ state.strainHBreathing }} × 10⁻²¹</tspan></text>
              <text x="15" y="78" fill="#93c5fd" font-size="10">剪切向量 hv: <tspan fill="#c084fc" font-weight="bold">{{ state.strainHVector }} × 10⁻²¹</tspan></text>
              <text x="15" y="94" fill="#93c5fd" font-size="10">啁啾質量 Mc: <tspan fill="#facc15" font-weight="bold">{{ state.chirpMassSolarM }} M_⊙</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#1e3a8a" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#dbeafe" font-size="12" font-weight="bold">
                當前體制: {{ regimeLabel(state.activeRegime) }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Regime Switching -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            :class="['regime-btn', { active: state.activeRegime === r.id }]"
            @click="selectRegime(r.id)"
          >
            <span class="regime-icon">{{ r.icon }}</span>
            <span class="regime-title">{{ r.name }}</span>
          </button>
        </div>

        <!-- Sliders & Controls -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">奇異偏振比率 ξ_exotic</span>
              <span class="ctrl-value">{{ (state.exoticPolarizationRatio * 100).toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              :value="state.exoticPolarizationRatio"
              @input="onExoticRatioChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">天線天頂傾角 θ_sky (度)</span>
              <span class="ctrl-value">{{ state.skyInclinationDeg.toFixed(1) }}°</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="180.0"
              step="1.0"
              :value="state.skyInclinationDeg"
              @input="onSkyInclinationChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">共振光學腔品質因數 log10(Q_opt)</span>
              <span class="ctrl-value">{{ state.cavityQualityLogQ.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="7.0"
              step="0.05"
              :value="state.cavityQualityLogQ"
              @input="onCavityQualityChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 雙星合併引力波 Chirp</span>
          </button>
          <button class="action-btn reset-btn" @click="resetEngine">
            <span>↺ 恢復預設</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  holographicGravitationalWaveAntennaEngine,
  type HolographicGwRegime,
  type HolographicGwState
} from '../engine/holographicGravitationalWaveAntenna';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<HolographicGwState>({ ...holographicGravitationalWaveAntennaEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: HolographicGwRegime; name: string; icon: string }[] = [
  { id: 'general-relativity-tensor', name: '標準純張量相', icon: '📏' },
  { id: 'breathing-scalar-dominant', name: '呼吸純量相', icon: '🫁' },
  { id: 'vector-shear-resonance', name: '向量剪切相', icon: '⚡' },
  { id: 'full-six-polarization-extreme', name: '六偏振極限相', icon: '🌌' }
];

function regimeLabel(regime: HolographicGwRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: HolographicGwRegime): void {
  holographicGravitationalWaveAntennaEngine.setRegime(regime);
  syncState();
}

function onExoticRatioChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicGravitationalWaveAntennaEngine.setExoticRatio(val);
  syncState();
}

function onSkyInclinationChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicGravitationalWaveAntennaEngine.setSkyInclination(val);
  syncState();
}

function onCavityQualityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicGravitationalWaveAntennaEngine.setCavityQuality(val);
  syncState();
}

function playSound(): void {
  holographicGravitationalWaveAntennaEngine.triggerChirpSound();
}

function resetEngine(): void {
  holographicGravitationalWaveAntennaEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...holographicGravitationalWaveAntennaEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  holographicGravitationalWaveAntennaEngine.update(0.016);
  syncState();
  animFrame = requestAnimationFrame(loop);
}

onMounted(() => {
  syncState();
  animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame);
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 20, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2200;
}

.modal-card {
  width: 860px;
  max-width: 95vw;
  max-height: 94vh;
  background: #060d24;
  border: 1px solid #2563eb;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(59, 130, 246, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f1f5f9;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0a1638;
  border-bottom: 1px solid #1d4ed8;
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
  font-size: 1.15rem;
  color: #bfdbfe;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #60a5fa;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.close-btn:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1e3a8a;
}

.gw-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.regime-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: #0d1e47;
  border: 1px solid #1e40af;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #1e3a8a;
  border-color: #3b82f6;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  border-color: #93c5fd;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #091536;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #1e3a8a;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-group {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.ctrl-label {
  color: #cbd5e1;
}

.ctrl-value {
  color: #60a5fa;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #3b82f6;
  background: #1e3a8a;
  border-radius: 3px;
  cursor: pointer;
}

.action-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sound-btn {
  background: #1e3a8a;
  border-color: #3b82f6;
  color: #bfdbfe;
}
.sound-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

.reset-btn {
  background: #1e1b4b;
  border-color: #4338ca;
  color: #cbd5e1;
}
.reset-btn:hover {
  background: #312e81;
}
</style>
