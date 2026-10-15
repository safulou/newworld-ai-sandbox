<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌊</span>
          <div>
            <h2>分數量子霍爾條紋相與向列液晶反應堆</h2>
            <p class="subtitle">Higher Landau Levels, Electronic Nematic Phase & Giant Resistivity Anisotropy</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="stripe-svg">
            <defs>
              <linearGradient id="stripeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020e1a" />
                <stop offset="50%" stop-color="#071829" />
                <stop offset="100%" stop-color="#030b14" />
              </linearGradient>

              <radialGradient id="bubbleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1" />
              </radialGradient>

              <filter id="glowStripe">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#stripeBg)" rx="8" />

            <!-- Grid Mesh -->
            <g opacity="0.12">
              <line v-for="x in 16" :key="'gx' + x" :x1="x * 50" y1="0" :x2="x * 50" y2="360" stroke="#38bdf8" stroke-dasharray="2 4" />
              <line v-for="y in 7" :key="'gy' + y" x1="0" :y1="y * 50" x2="800" :y2="y * 50" stroke="#38bdf8" stroke-dasharray="2 4" />
            </g>

            <!-- 2DEG Stripe Phase / Bubble Phase View -->
            <g transform="translate(240, 180)">
              <!-- Stripe Phase (Rotated by Nematic Angle) -->
              <g v-if="state.activeRegime !== 'triangular-bubble-lattice'" :transform="`rotate(${state.nematicDirectorAngleDeg})`">
                <g v-for="s in 15" :key="'str' + s">
                  <rect
                    :x="-220"
                    :y="(s - 8) * 26 + (Math.sin(animTick * 3 + s) * 2)"
                    width="440"
                    :height="10 + state.nematicOrderParameterS * 8"
                    :fill="s % 2 === 0 ? '#38bdf8' : '#0ea5e9'"
                    :opacity="0.25 + state.nematicOrderParameterS * 0.55"
                    rx="4"
                    filter="url(#glowStripe)"
                  />
                  <!-- Electron Charge Density Drift -->
                  <circle
                    v-for="d in 4"
                    :key="'drift' + s + d"
                    :cx="-180 + ((animTick * 40 + d * 110) % 360)"
                    :cy="(s - 8) * 26 + 6"
                    r="2.5"
                    fill="#e0f2fe"
                    opacity="0.8"
                  />
                </g>
              </g>

              <!-- Triangular Bubble Lattice Phase -->
              <g v-else>
                <g v-for="row in 7" :key="'brow' + row">
                  <circle
                    v-for="col in 9"
                    :key="'bcol' + col"
                    :cx="(col - 5) * 44 + ((row % 2) * 22)"
                    :cy="(row - 4) * 38"
                    :r="state.bubbleClusterRadiusNm * 0.7 + Math.sin(animTick * 4 + row + col) * 1.5"
                    fill="url(#bubbleGlow)"
                    stroke="#38bdf8"
                    stroke-width="1.5"
                    filter="url(#glowStripe)"
                  />
                </g>
              </g>
            </g>

            <!-- Left HUD: Nematic Director Compass -->
            <g transform="translate(80, 100)">
              <circle cx="0" cy="0" r="50" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 2" />
              <line x1="-50" y1="0" x2="50" y2="0" stroke="#64748b" stroke-width="1" />
              <line x1="0" y1="-50" x2="0" y2="50" stroke="#64748b" stroke-width="1" />
              
              <!-- Director Vector n -->
              <line
                x1="0"
                y1="0"
                :x2="45 * Math.cos(state.nematicDirectorAngleDeg * Math.PI / 180)"
                :y2="45 * Math.sin(state.nematicDirectorAngleDeg * Math.PI / 180)"
                stroke="#38bdf8"
                stroke-width="3"
                filter="url(#glowStripe)"
              />
              <circle
                :cx="45 * Math.cos(state.nematicDirectorAngleDeg * Math.PI / 180)"
                :cy="45 * Math.sin(state.nematicDirectorAngleDeg * Math.PI / 180)"
                r="4"
                fill="#38bdf8"
              />
              <text x="0" y="70" fill="#94a3b8" font-size="11" text-anchor="middle">向列指向矢 n: {{ state.nematicDirectorAngleDeg.toFixed(1) }}°</text>
            </g>

            <!-- Density Wave 1D Cut Section (Bottom Right) -->
            <g transform="translate(560, 260)">
              <rect x="-10" y="-55" width="230" height="90" fill="#03101c" stroke="#1e293b" rx="6" />
              <text x="5" y="-38" fill="#38bdf8" font-size="11" font-weight="bold">CDW 電荷密度波切面</text>
              <path :d="densityPath" fill="none" stroke="#38bdf8" stroke-width="2" filter="url(#glowStripe)" />
            </g>

            <!-- Right HUD: Resistivity Gauge -->
            <g transform="translate(560, 60)">
              <rect x="-10" y="-15" width="230" height="125" fill="#03101c" stroke="#1e293b" rx="6" />
              <text x="5" y="5" fill="#e2e8f0" font-size="12" font-weight="bold">各向異性縱向電阻率</text>
              
              <text x="5" y="32" fill="#94a3b8" font-size="11">ρ_xx (平行): {{ state.longitudinalResistivityXx.toFixed(1) }} kΩ/□</text>
              <rect x="5" y="38" width="200" height="6" fill="#1e293b" rx="3" />
              <rect x="5" y="38" :width="Math.min(200, state.longitudinalResistivityXx * 3.5)" height="6" fill="#38bdf8" rx="3" />

              <text x="5" y="65" fill="#94a3b8" font-size="11">ρ_yy (垂直): {{ state.longitudinalResistivityYy.toFixed(1) }} kΩ/□</text>
              <rect x="5" y="71" width="200" height="6" fill="#1e293b" rx="3" />
              <rect x="5" y="71" :width="Math.min(200, state.longitudinalResistivityYy * 3.5)" height="6" fill="#f43f5e" rx="3" />

              <text x="5" y="98" fill="#eab308" font-size="11" font-weight="bold">巨各向異性比 α_nem: {{ state.anisotropyRatio.toFixed(1) }}x</text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Regime Selector -->
          <div class="ctrl-group">
            <label class="group-label">相變體系 (Regime)</label>
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
                <span>朗道填充因子 ν:</span>
                <span class="value">{{ state.landauFillingNu.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="6.0"
                step="0.05"
                :value="state.landauFillingNu"
                @input="onNuChange"
              />
            </div>

            <div class="slider-row">
              <div class="slider-header">
                <span>向列指向矢方向角 θ_nem:</span>
                <span class="value">{{ state.nematicDirectorAngleDeg }}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="1"
                :value="state.nematicDirectorAngleDeg"
                @input="onAngleChange"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="ctrl-group actions">
            <button class="action-btn pulse" @click="triggerPulse">
              ⚡ 偏轉指向矢脈衝
            </button>
            <button class="action-btn reset" @click="resetDefaults">
              🔄 恢復預設參數
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">向列液晶秩序參數 S</span>
            <span class="stat-value text-cyan">{{ state.nematicOrderParameterS.toFixed(3) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">條紋空間調製週期 λ_s</span>
            <span class="stat-value text-blue">{{ state.stripePeriodNm.toFixed(1) }} nm</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">巨磁阻各向異性比 α_nem</span>
            <span class="stat-value text-amber">{{ state.anisotropyRatio.toFixed(1) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">當前物態相容度</span>
            <span class="stat-value text-emerald">100% 拓撲保護</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  fractionalHallStripeLiquidCrystalEngine,
  type FqhStripeRegime
} from '../engine/fractionalHallStripeLiquidCrystal';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref(fractionalHallStripeLiquidCrystalEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const regimes: { key: FqhStripeRegime; label: string }[] = [
  { key: 'isotropic-fermi-liquid', label: '等方性費米液體' },
  { key: 'electronic-nematic', label: '電子向列液晶' },
  { key: 'giant-anisotropic-stripe', label: '巨各向異性條紋相' },
  { key: 'triangular-bubble-lattice', label: '三角泡泡晶格' }
];

const densityPath = computed(() => {
  const pts = state.value.stripeDensityField;
  if (!pts || pts.length === 0) return '';
  return pts.map((p, idx) => {
    const x = idx * 5.2;
    const y = -10 - p * 25;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
});

const refreshState = () => {
  state.value = fractionalHallStripeLiquidCrystalEngine.getState();
};

const setRegime = (regime: FqhStripeRegime) => {
  fractionalHallStripeLiquidCrystalEngine.setRegime(regime);
  refreshState();
  achievements.unlock('fractional_hall_stripe_liquid_crystal');
};

const onNuChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalHallStripeLiquidCrystalEngine.setLandauFilling(val);
  refreshState();
  achievements.unlock('fractional_hall_stripe_liquid_crystal');
};

const onAngleChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalHallStripeLiquidCrystalEngine.setDirectorAngle(val);
  refreshState();
};

const triggerPulse = () => {
  fractionalHallStripeLiquidCrystalEngine.triggerNematicDirectorPulse();
  refreshState();
  achievements.unlock('fractional_hall_stripe_liquid_crystal');
};

const resetDefaults = () => {
  fractionalHallStripeLiquidCrystalEngine.resetDefaults();
  refreshState();
};

const handleClose = () => {
  uiStore.closeOverlay();
};

const loop = () => {
  animTick.value += 0.03;
  fractionalHallStripeLiquidCrystalEngine.update(0.016);
  animId = requestAnimationFrame(loop);
};

onMounted(() => {
  animId = requestAnimationFrame(loop);
  achievements.unlock('fractional_hall_stripe_liquid_crystal');
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
  background: #09131f;
  border: 1px solid #1e3a5f;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  background: #040d18;
  border-bottom: 1px solid #1e3a5f;
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
  color: #38bdf8;
  font-weight: 700;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #64748b;
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
  background: #1e293b;
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
  border: 1px solid #1e293b;
}

.stripe-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  background: #040c16;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.group-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
}

.btn-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.regime-btn {
  background: #0b1a2d;
  border: 1px solid #1e3a5f;
  color: #94a3b8;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: #132845;
  color: #f8fafc;
}

.regime-btn.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

.slider-row {
  margin-bottom: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.slider-header .value {
  color: #38bdf8;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
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
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: white;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
}

.action-btn.pulse:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
}

.action-btn.reset {
  background: #1e293b;
  color: #94a3b8;
}

.action-btn.reset:hover {
  background: #334155;
  color: #f8fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #040c16;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.text-cyan { color: #06b6d4; }
.text-blue { color: #38bdf8; }
.text-amber { color: #f59e0b; }
.text-emerald { color: #10b981; }
</style>
