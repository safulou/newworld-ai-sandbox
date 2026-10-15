<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>非厄米阿貝爾-希格斯弦拓撲渦旋網絡</h2>
            <p class="subtitle">Nielsen-Olesen Cosmic Strings, Non-Hermitian Skin Effect & Exceptional Point Annihilation</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="higgs-svg">
            <defs>
              <linearGradient id="higgsBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a0518" />
                <stop offset="50%" stop-color="#140a2b" />
                <stop offset="100%" stop-color="#070210" />
              </linearGradient>

              <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#c084fc" stop-opacity="1" />
                <stop offset="40%" stop-color="#9333ea" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#3b0764" stop-opacity="0.05" />
              </radialGradient>

              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.9" />
              </linearGradient>

              <filter id="glowHiggs">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#higgsBg)" rx="8" />

            <!-- Cosmic Grid / Metric Distortion -->
            <g opacity="0.15">
              <line v-for="x in 16" :key="'gx' + x" :x1="x * 50" y1="0" :x2="x * 50" y2="360" stroke="#a855f7" stroke-dasharray="2 4" />
              <line v-for="y in 7" :key="'gy' + y" x1="0" :y1="y * 50" x2="800" :y2="y * 50" stroke="#a855f7" stroke-dasharray="2 4" />
            </g>

            <!-- Cosmic Strings Interconnecting Vortices -->
            <g transform="translate(180, 20)">
              <!-- String Tension Filaments -->
              <g v-for="(v1, i) in state.vortices" :key="'str-' + i">
                <g v-for="(v2, j) in state.vortices" :key="'str-' + i + '-' + j">
                  <line
                    v-if="j > i"
                    :x1="v1.x"
                    :y1="v1.y"
                    :x2="v2.x"
                    :y2="v2.y"
                    stroke="#a855f7"
                    :stroke-width="1.2 + (state.stringTensionGev2 / 30)"
                    :opacity="0.25 + state.skinLocalizationFactor * 0.45"
                    stroke-dasharray="4 2"
                  />
                  <!-- Reconnection Energy Sparkles -->
                  <circle
                    v-if="j > i && Math.sin(animTick * 6 + i * 2 + j) > 0.6"
                    :cx="(v1.x + v2.x) / 2"
                    :cy="(v1.y + v2.y) / 2"
                    r="3.5"
                    fill="#f43f5e"
                    filter="url(#glowHiggs)"
                  />
                </g>
              </g>

              <!-- Vortices -->
              <g v-for="v in state.vortices" :key="'vort-' + v.id">
                <!-- Outer Circulating Flux Halo -->
                <circle
                  :cx="v.x"
                  :cy="v.y"
                  :r="22 + v.fluxDensity * 3"
                  fill="url(#vortexGlow)"
                  :opacity="0.7 + 0.3 * Math.sin(animTick * 4 + v.id)"
                  filter="url(#glowHiggs)"
                />

                <!-- Circulation Flow Ring -->
                <circle
                  :cx="v.x"
                  :cy="v.y"
                  :r="14 + v.winding * 2"
                  fill="none"
                  :stroke="v.winding > 0 ? '#38bdf8' : '#ec4899'"
                  stroke-width="1.8"
                  stroke-dasharray="6 3"
                  :transform="`rotate(${(animTick * 60 * (v.winding > 0 ? 1 : -1)) % 360}, ${v.x}, ${v.y})`"
                />

                <!-- Core Singular Point -->
                <circle :cx="v.x" :cy="v.y" r="4.5" fill="#f8fafc" />
                <text :x="v.x + 8" :y="v.y - 8" fill="#e2e8f0" font-size="11" font-family="monospace">
                  n={{ v.winding > 0 ? '+' : '' }}{{ v.winding }}
                </text>
              </g>
            </g>

            <!-- Non-Hermitian Skin Effect Polarization Indicator (Top Right) -->
            <g transform="translate(560, 45)">
              <rect x="0" y="0" width="210" height="75" fill="#1e1035" rx="6" stroke="#9333ea" stroke-width="1" />
              <text x="15" y="24" fill="#d8b4fe" font-size="12" font-weight="bold">非厄米趨膚偏折向 (NHSE)</text>
              <!-- Gradient Bar -->
              <rect x="15" y="34" width="180" height="12" fill="url(#skinGrad)" rx="3" />
              <!-- Current Pointer -->
              <polygon
                :points="`${15 + state.skinLocalizationFactor * 180},28 ${21 + state.skinLocalizationFactor * 180},20 ${9 + state.skinLocalizationFactor * 180},20`"
                fill="#f43f5e"
              />
              <text x="15" y="62" fill="#94a3b8" font-size="11">
                趨膚因子: {{ (state.skinLocalizationFactor * 100).toFixed(1) }}% (右側極化)
              </text>
            </g>

            <!-- Exceptional Point Gauge (Middle Right) -->
            <g transform="translate(560, 135)">
              <rect x="0" y="0" width="210" height="85" fill="#1e1035" rx="6" stroke="#c084fc" stroke-width="1" />
              <text x="15" y="24" fill="#e9d5ff" font-size="12" font-weight="bold">奇異點接近度 (EP Proximity)</text>
              <circle cx="45" cy="54" r="22" fill="none" stroke="#4c1d95" stroke-width="5" />
              <circle
                cx="45"
                cy="54"
                r="22"
                fill="none"
                stroke="#c084fc"
                stroke-width="5"
                stroke-dasharray="138"
                :stroke-dashoffset="138 * (1 - state.exceptionalPointProximity)"
                transform="rotate(-90, 45, 54)"
              />
              <text x="45" y="58" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">
                {{ (state.exceptionalPointProximity * 100).toFixed(0) }}%
              </text>
              <text x="85" y="48" fill="#cbd5e1" font-size="11">γ_EP ≈ 0.707</text>
              <text x="85" y="66" fill="#f43f5e" font-size="11" font-weight="bold">
                {{ state.exceptionalPointProximity > 0.85 ? '臨界分支湮滅！' : '亞臨界弦晶相' }}
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(560, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#1e1035" rx="6" stroke="#9333ea" stroke-width="1" />
              <text x="15" y="22" fill="#d8b4fe" font-size="12" font-weight="bold">弦網絡物理量</text>
              <text x="15" y="44" fill="#94a3b8" font-size="11">弦張力 μ: <tspan fill="#38bdf8" font-weight="bold">{{ state.stringTensionGev2 }} GeV²</tspan></text>
              <text x="15" y="64" fill="#94a3b8" font-size="11">GL 參數 κ: <tspan fill="#f59e0b" font-weight="bold">{{ state.glParameterKappa }}</tspan></text>
              <text x="15" y="84" fill="#94a3b8" font-size="11">重聯激發率: <tspan fill="#ec4899" font-weight="bold">{{ state.reconnectionRateHz }} Hz</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#2e1065" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#e9d5ff" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">希格斯真空期望值 v (GeV)</span>
              <span class="ctrl-value">{{ state.higgsVevGev.toFixed(2) }} GeV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.05"
              :value="state.higgsVevGev"
              @input="onHiggsVevChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">非厄米耗散/增益率 γ_NH</span>
              <span class="ctrl-value">{{ state.nhDissipationRate.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              :value="state.nhDissipationRate"
              @input="onNhDissipationChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">渦旋量子卷繞數 n</span>
              <span class="ctrl-value">{{ state.vortexWindingN }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              :value="state.vortexWindingN"
              @input="onVortexWindingChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 弦張力啁啾音效</span>
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
  nonHermitianAbelianHiggsEngine,
  type NonHermitianHiggsRegime,
  type NonHermitianHiggsState
} from '../engine/nonHermitianAbelianHiggsString';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<NonHermitianHiggsState>({ ...nonHermitianAbelianHiggsEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: NonHermitianHiggsRegime; name: string; icon: string }[] = [
  { id: 'abelian-superconducting-vortex', name: '阿貝爾超導相', icon: '⚡' },
  { id: 'non-hermitian-skin-network', name: '非厄米弦網絡', icon: '🕸️' },
  { id: 'exceptional-point-annihilation', name: '奇異點相消相', icon: '💥' },
  { id: 'cosmic-string-reconnection', name: '宇宙弦重聯相', icon: '🌌' }
];

function regimeLabel(regime: NonHermitianHiggsRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: NonHermitianHiggsRegime): void {
  nonHermitianAbelianHiggsEngine.setRegime(regime);
  syncState();
}

function onHiggsVevChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonHermitianAbelianHiggsEngine.setHiggsVev(val);
  syncState();
}

function onNhDissipationChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonHermitianAbelianHiggsEngine.setNhDissipation(val);
  syncState();
}

function onVortexWindingChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  nonHermitianAbelianHiggsEngine.setVortexWinding(val);
  syncState();
}

function playSound(): void {
  nonHermitianAbelianHiggsEngine.triggerChirpSound();
}

function resetEngine(): void {
  nonHermitianAbelianHiggsEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...nonHermitianAbelianHiggsEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  nonHermitianAbelianHiggsEngine.update(0.016);
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
  background: rgba(4, 2, 12, 0.82);
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
  background: #0d061c;
  border: 1px solid #7e22ce;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(168, 85, 247, 0.35);
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
  background: #15092d;
  border-bottom: 1px solid #6b21a8;
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
  color: #e9d5ff;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #a855f7;
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
  border: 1px solid #4c1d95;
}

.higgs-svg {
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
  background: #180d33;
  border: 1px solid #581c87;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #25124f;
  border-color: #9333ea;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #7e22ce, #a855f7);
  border-color: #c084fc;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #140b29;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #3b0764;
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
  color: #c084fc;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #a855f7;
  background: #2e1065;
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
  background: #3b0764;
  border-color: #9333ea;
  color: #e9d5ff;
}
.sound-btn:hover {
  background: #581c87;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
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
