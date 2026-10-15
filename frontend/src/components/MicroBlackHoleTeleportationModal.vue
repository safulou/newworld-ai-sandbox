<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🕳️</span>
          <div>
            <h2>微觀黑洞全息引力子隱形傳態天線</h2>
            <p class="subtitle">ER=EPR Duality, Traversable Wormhole & Holographic Quantum Teleportation</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="teleport-svg">
            <defs>
              <linearGradient id="bhBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a0314" />
                <stop offset="50%" stop-color="#120524" />
                <stop offset="100%" stop-color="#05010a" />
              </linearGradient>

              <radialGradient id="leftHorizonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="70%" stop-color="#7c3aed" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="rightHorizonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#67e8f9" stop-opacity="0" />
              </radialGradient>

              <filter id="glowBH">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#bhBg)" rx="8" />

            <!-- Spacetime Curvature Grid Lines -->
            <g opacity="0.15">
              <path
                v-for="g in 11"
                :key="'grid' + g"
                :d="`M 50,${g * 30 + 15} Q 400,${180 + (g - 6) * 8} 750,${g * 30 + 15}`"
                fill="none"
                stroke="#a855f7"
                stroke-width="1.5"
              />
            </g>

            <!-- Traversable Wormhole Throat (Center) -->
            <g transform="translate(400, 180)">
              <!-- Throat Envelope Curves -->
              <path
                :d="`M -200,-50 Q 0,${-state.wormholeThroatRadiusNm * 2.2} 200,-50`"
                fill="none"
                stroke="#d8b4fe"
                :stroke-width="1.5 + state.wormholeThroatRadiusNm * 0.15"
                filter="url(#glowBH)"
              />
              <path
                :d="`M -200,50 Q 0,${state.wormholeThroatRadiusNm * 2.2} 200,50`"
                fill="none"
                stroke="#d8b4fe"
                :stroke-width="1.5 + state.wormholeThroatRadiusNm * 0.15"
                filter="url(#glowBH)"
              />

              <!-- Negative Energy Shockwave Flare (⟨T_kk⟩ < 0) -->
              <g v-if="state.wormholeThroatRadiusNm > 0">
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="state.wormholeThroatRadiusNm * 3.5"
                  :ry="state.wormholeThroatRadiusNm * 2.0"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2"
                  stroke-dasharray="6 3"
                  filter="url(#glowBH)"
                  :opacity="0.4 + (Math.sin(animTick * 6) + 1) * 0.3"
                />
                <!-- Traversing Graviton Wave Packets -->
                <circle
                  v-for="p in 4"
                  :key="'grav' + p"
                  :cx="-160 + ((animTick * 120 + p * 80) % 320)"
                  cy="0"
                  r="3.5"
                  fill="#38bdf8"
                  filter="url(#glowBH)"
                />
              </g>

              <!-- Left Event Horizon (BH_L) -->
              <g transform="translate(-200, 0)">
                <circle cx="0" cy="0" r="50" fill="url(#leftHorizonGlow)" />
                <circle cx="0" cy="0" r="50" fill="none" stroke="#a855f7" stroke-width="2" filter="url(#glowBH)" />
                <circle cx="0" cy="0" r="32" fill="#030008" />
                <text x="0" y="4" fill="#e9d5ff" font-size="11" font-weight="bold" text-anchor="middle">BH_L</text>
                <text x="0" y="70" fill="#c084fc" font-size="10" text-anchor="middle">發送端黑洞視界</text>

                <!-- Infalling Qubit -->
                <g :transform="`translate(${-80 + (animTick * 35) % 80}, 0)`">
                  <circle cx="0" cy="0" r="5" fill="#f43f5e" filter="url(#glowBH)" />
                  <text x="0" y="-8" fill="#fda4af" font-size="9" text-anchor="middle">|ψ⟩</text>
                </g>
              </g>

              <!-- Right Event Horizon (BH_R) -->
              <g transform="translate(200, 0)">
                <circle cx="0" cy="0" r="50" fill="url(#rightHorizonGlow)" />
                <circle cx="0" cy="0" r="50" fill="none" stroke="#06b6d4" stroke-width="2" filter="url(#glowBH)" />
                <circle cx="0" cy="0" r="32" fill="#030008" />
                <text x="0" y="4" fill="#cffafe" font-size="11" font-weight="bold" text-anchor="middle">BH_R</text>
                <text x="0" y="70" fill="#67e8f9" font-size="10" text-anchor="middle">接收端黑洞視界</text>

                <!-- Emergent Descrambled Qubit -->
                <g v-if="state.qubitStateTransferred" :transform="`translate(${50 + (animTick * 45) % 90}, 0)`">
                  <circle cx="0" cy="0" r="5" fill="#10b981" filter="url(#glowBH)" />
                  <text x="0" y="-8" fill="#6ee7b7" font-size="9" text-anchor="middle">|ψ'⟩</text>
                </g>
              </g>

              <!-- Wormhole Status Label -->
              <text x="0" y="-80" fill="#e2e8f0" font-size="12" font-weight="bold" text-anchor="middle">
                {{ state.wormholeThroatRadiusNm > 0 ? '⚡ 可穿越蟲洞喉管已開啟' : '🔒 經典引力喉管閉合 (NEC 滿足)' }}
              </text>
              <text x="0" y="-62" fill="#94a3b8" font-size="10" text-anchor="middle">
                r_throat: {{ state.wormholeThroatRadiusNm.toFixed(1) }} nm | 保真度 F: {{ (state.teleportationFidelity * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- Bottom Left Teleportation Protocol Info -->
            <g transform="translate(40, 270)">
              <rect x="-10" y="-10" width="220" height="85" fill="#090314" stroke="#2e1065" rx="6" />
              <text x="5" y="12" fill="#c084fc" font-size="11" font-weight="bold">Gao-Jafferis-Wall 耦合算符</text>
              <text x="5" y="30" fill="#94a3b8" font-size="10">h · O_L(-t) O_R(t) 雙邊糾纏脈衝</text>
              <text x="5" y="48" fill="#94a3b8" font-size="10">攪拌時間 t_*: {{ state.scramblingTimeMs.toFixed(1) }} ms</text>
              <text x="5" y="66" fill="#38bdf8" font-size="10">可穿越窗口: {{ state.traversalWindowDurationMs.toFixed(1) }} ms</text>
            </g>
          </svg>
        </div>

        <!-- Controls Grid -->
        <div class="controls-grid">
          <!-- Regime Selector -->
          <div class="ctrl-group">
            <label class="group-label">傳態幾何體系 (Regime)</label>
            <div class="btn-wrap">
              <button
                v-for="r in regimes"
                :key="r.key"
                class="regime-btn"
                :class="{ active: state.activeRegime === r.key }"
                @click="setRegime(r.key)"
              >
                {{ r.label }}
              </button>
            </div>
          </div>

          <!-- Parameter Sliders -->
          <div class="ctrl-group">
            <div class="slider-row">
              <div class="slider-header">
                <span>霍金溫度 T_H:</span>
                <span class="value">{{ state.hawkingTemperatureKelvin.toFixed(1) }} nK</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                :value="state.hawkingTemperatureKelvin"
                @input="onTempChange"
              />
            </div>

            <div class="slider-row">
              <div class="slider-header">
                <span>負能量衝擊波強度 |⟨T_kk⟩|:</span>
                <span class="value">{{ state.negativeEnergyFlux.toFixed(1) }} J/m³</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                :value="state.negativeEnergyFlux"
                @input="onFluxChange"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="ctrl-group actions">
            <button class="action-btn pulse" @click="triggerShockwave">
              ⚡ 發射全息傳態衝擊波
            </button>
            <button class="action-btn reset" @click="resetDefaults">
              🔄 恢復預設幾何
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">隱形傳態保真度 F</span>
            <span class="stat-value text-purple">{{ (state.teleportationFidelity * 100).toFixed(1) }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">可穿越喉管半徑</span>
            <span class="stat-value text-cyan">{{ state.wormholeThroatRadiusNm.toFixed(1) }} nm</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">量子快速攪拌時間</span>
            <span class="stat-value text-blue">{{ state.scramblingTimeMs.toFixed(1) }} ms</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">ER=EPR 么正性</span>
            <span class="stat-value text-emerald">資訊守恆</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  microBlackHoleTeleportationEngine,
  type HoleTeleportRegime
} from '../engine/microBlackHoleTeleportationAntenna';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref(microBlackHoleTeleportationEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const regimes: { key: HoleTeleportRegime; label: string }[] = [
  { key: 'non-traversable-dual-bh', label: '閉合雙黑洞' },
  { key: 'negative-energy-shockwave', label: '負能量激發' },
  { key: 'holographic-teleportation-active', label: '全息傳態啟用' },
  { key: 'planckian-descrambling-emission', label: '普朗克解擾輻射' }
];

const refreshState = () => {
  state.value = microBlackHoleTeleportationEngine.getState();
};

const setRegime = (regime: HoleTeleportRegime) => {
  microBlackHoleTeleportationEngine.setRegime(regime);
  refreshState();
  achievements.unlock('micro_black_hole_teleportation');
};

const onTempChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  microBlackHoleTeleportationEngine.setHawkingTemperature(val);
  refreshState();
  achievements.unlock('micro_black_hole_teleportation');
};

const onFluxChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  microBlackHoleTeleportationEngine.setNegativeEnergyFlux(val);
  refreshState();
  achievements.unlock('micro_black_hole_teleportation');
};

const triggerShockwave = () => {
  microBlackHoleTeleportationEngine.triggerShockwaveTeleport();
  refreshState();
  achievements.unlock('micro_black_hole_teleportation');
};

const resetDefaults = () => {
  microBlackHoleTeleportationEngine.resetDefaults();
  refreshState();
};

const handleClose = () => {
  uiStore.closeOverlay();
};

const loop = () => {
  animTick.value += 0.025;
  microBlackHoleTeleportationEngine.update(0.016);
  animId = requestAnimationFrame(loop);
};

onMounted(() => {
  animId = requestAnimationFrame(loop);
  achievements.unlock('micro_black_hole_teleportation');
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
  max-height: 90vh;
  background: #0f071a;
  border: 1px solid #2e1065;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  background: #0a0314;
  border-bottom: 1px solid #2e1065;
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
  margin: 0;
  font-size: 18px;
  color: #c084fc;
  font-weight: 700;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #7e69ab;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #1e1b4b;
  color: #f8fafc;
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
  border: 1px solid #2e1065;
}

.teleport-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  background: #090314;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #2e1065;
}

.group-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #c084fc;
  margin-bottom: 8px;
}

.btn-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.regime-btn {
  background: #17092c;
  border: 1px solid #3b0764;
  color: #d8b4fe;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: #240e45;
  color: #f8fafc;
}

.regime-btn.active {
  background: #7c3aed;
  color: #ffffff;
  border-color: #c084fc;
  box-shadow: 0 0 10px rgba(192, 132, 252, 0.4);
}

.slider-row {
  margin-bottom: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #a855f7;
  margin-bottom: 4px;
}

.slider-header .value {
  color: #d8b4fe;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #a855f7;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.pulse {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
}

.action-btn.pulse:hover {
  background: linear-gradient(135deg, #6d28d9, #5b21b6);
}

.action-btn.reset {
  background: #1e1b4b;
  color: #a855f7;
}

.action-btn.reset:hover {
  background: #2e1065;
  color: #f8fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #090314;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #2e1065;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #7e69ab;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.text-purple { color: #c084fc; }
.text-cyan { color: #06b6d4; }
.text-blue { color: #38bdf8; }
.text-emerald { color: #10b981; }
</style>
