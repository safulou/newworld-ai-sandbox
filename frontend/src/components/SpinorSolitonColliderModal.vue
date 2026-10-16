<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">💥</span>
          <div>
            <h2>旋量超流全息奇異孤子碰撞反應堆</h2>
            <p class="subtitle">Spinor BEC F=1, Relativistic Soliton Collision & Holographic Black Hole Merger</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="collider-svg">
            <defs>
              <linearGradient id="colliderBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#140702" />
                <stop offset="50%" stop-color="#2b1104" />
                <stop offset="100%" stop-color="#0d0401" />
              </linearGradient>

              <radialGradient id="solitonGlowLeft" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fb923c" stop-opacity="1" />
                <stop offset="50%" stop-color="#ea580c" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#7c2d12" stop-opacity="0.05" />
              </radialGradient>

              <radialGradient id="solitonGlowRight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
                <stop offset="50%" stop-color="#e11d48" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#881337" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowCollider">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#colliderBg)" rx="8" />

            <!-- Trajectory Guide Grid -->
            <g opacity="0.15">
              <line v-for="x in 16" :key="'cx' + x" :x1="x * 50" y1="0" :x2="x * 50" y2="360" stroke="#f97316" stroke-dasharray="2 4" />
              <line v-for="y in 7" :key="'cy' + y" x1="0" :y1="y * 50" x2="800" :y2="y * 50" stroke="#f97316" stroke-dasharray="2 4" />
            </g>

            <!-- Soliton Collision Chamber (Center Left) -->
            <g transform="translate(100, 30)">
              <!-- Impact Center Axis -->
              <line x1="150" y1="20" x2="150" y2="280" stroke="#7c2d12" stroke-width="1.5" stroke-dasharray="4 3" />
              
              <!-- Shockwave Emission Ring at collision center -->
              <circle
                cx="150"
                cy="150"
                :r="25 + 35 * Math.sin(animTick * 4)"
                fill="none"
                stroke="#fb923c"
                stroke-width="1.8"
                stroke-dasharray="3 3"
                opacity="0.6"
                filter="url(#glowCollider)"
              />

              <!-- Left Soliton Wavepacket -->
              <ellipse
                :cx="state.packet.xLeft"
                :cy="state.packet.yPos"
                :rx="12 * state.packet.widthUm * 0.4"
                :ry="24"
                fill="url(#solitonGlowLeft)"
                filter="url(#glowCollider)"
              />
              <circle :cx="state.packet.xLeft" :cy="state.packet.yPos" r="4" fill="#ffffff" />

              <!-- Right Soliton Wavepacket -->
              <ellipse
                :cx="state.packet.xRight"
                :cy="state.packet.yPos"
                :rx="12 * state.packet.widthUm * 0.4"
                :ry="24"
                fill="url(#solitonGlowRight)"
                filter="url(#glowCollider)"
              />
              <circle :cx="state.packet.xRight" :cy="state.packet.yPos" r="4" fill="#ffffff" />

              <!-- Velocity Vector Arrows -->
              <line
                :x1="state.packet.xLeft"
                :y1="state.packet.yPos - 32"
                :x2="state.packet.xLeft + 25 * state.collisionVelocityRatio"
                :y2="state.packet.yPos - 32"
                stroke="#fed7aa"
                stroke-width="2"
                marker-end="url(#arrow)"
              />
              <line
                :x1="state.packet.xRight"
                :y1="state.packet.yPos - 32"
                :x2="state.packet.xRight - 25 * state.collisionVelocityRatio"
                :y2="state.packet.yPos - 32"
                stroke="#fecdd3"
                stroke-width="2"
                marker-end="url(#arrow)"
              />
            </g>

            <!-- Holographic Horizon Entropy Gain (Top Right) -->
            <g transform="translate(565, 35)">
              <rect x="0" y="0" width="210" height="90" fill="#2d1205" rx="6" stroke="#ea580c" stroke-width="1" />
              <text x="15" y="24" fill="#ffedd5" font-size="12" font-weight="bold">全息視界熵增 (ΔS_holo)</text>
              <text x="15" y="56" fill="#fb923c" font-size="24" font-weight="bold" font-family="monospace">
                +{{ state.holographicHorizonEntropyDelta }} k_B
              </text>
              <rect x="15" y="66" width="180" height="8" fill="#7c2d12" rx="3" />
              <rect x="15" y="66" :width="Math.min(180, (state.holographicHorizonEntropyDelta / 100) * 180)" height="8" fill="#f97316" rx="3" />
            </g>

            <!-- 3-Component Spin Density (Middle Right) -->
            <g transform="translate(565, 135)">
              <rect x="0" y="0" width="210" height="90" fill="#2d1205" rx="6" stroke="#ea580c" stroke-width="1" />
              <text x="15" y="22" fill="#ffedd5" font-size="12" font-weight="bold">自旋-1 凝聚三組分密度</text>
              <text x="15" y="44" fill="#cbd5e1" font-size="11">
                |ψ₊₁|²: <tspan fill="#fb923c" font-weight="bold">{{ state.packet.spinDensityPlus1 }}</tspan>
              </text>
              <text x="15" y="62" fill="#cbd5e1" font-size="11">
                |ψ₀|²: <tspan fill="#facc15" font-weight="bold">{{ state.packet.spinDensityZero }}</tspan>
              </text>
              <text x="15" y="80" fill="#cbd5e1" font-size="11">
                |ψ₋₁|²: <tspan fill="#f43f5e" font-weight="bold">{{ state.packet.spinDensityMinus1 }}</tspan>
              </text>
            </g>

            <!-- Metrics Bar (Bottom Right) -->
            <g transform="translate(565, 235)">
              <rect x="0" y="0" width="210" height="95" fill="#2d1205" rx="6" stroke="#ea580c" stroke-width="1" />
              <text x="15" y="22" fill="#ffedd5" font-size="12" font-weight="bold">對撞動力學物理參數</text>
              <text x="15" y="44" fill="#cbd5e1" font-size="11">自旋相互作用 c₂: <tspan fill="#fb923c" font-weight="bold">{{ state.spinInteractionC2Hz }} Hz</tspan></text>
              <text x="15" y="64" fill="#cbd5e1" font-size="11">對撞速度 v/v_s: <tspan fill="#f43f5e" font-weight="bold">{{ state.collisionVelocityRatio }}×</tspan></text>
              <text x="15" y="84" fill="#cbd5e1" font-size="11">穿透能量分額: <tspan fill="#facc15" font-weight="bold">{{ (state.transmittedEnergyFraction * 100).toFixed(0) }}%</tspan></text>
            </g>

            <!-- Bottom Left Regime Label -->
            <g transform="translate(30, 325)">
              <rect x="0" y="0" width="280" height="26" fill="#9a3412" rx="4" opacity="0.85" />
              <text x="10" y="18" fill="#ffedd5" font-size="12" font-weight="bold">
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
              <span class="ctrl-label">自旋交換作用常數 c₂ (Hz)</span>
              <span class="ctrl-value">{{ state.spinInteractionC2Hz.toFixed(1) }} Hz</span>
            </div>
            <input
              type="range"
              min="-20.0"
              max="20.0"
              step="0.5"
              :value="state.spinInteractionC2Hz"
              @input="onInteractionChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">相對碰撞速度比率 v_rel / v_s</span>
              <span class="ctrl-value">{{ state.collisionVelocityRatio.toFixed(2) }}×</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              :value="state.collisionVelocityRatio"
              @input="onVelocityChange"
              class="cyber-slider"
            />
          </div>

          <div class="control-row">
            <div class="label-group">
              <span class="ctrl-label">碰撞衝擊參數 b (μm)</span>
              <span class="ctrl-value">{{ state.impactParameterUm.toFixed(1) }} μm</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.2"
              :value="state.impactParameterUm"
              @input="onImpactChange"
              class="cyber-slider"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-footer">
          <button class="action-btn sound-btn" @click="playSound">
            <span>🔊 孤子對撞脈衝音效</span>
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
  spinorSolitonColliderEngine,
  type SpinorSolitonRegime,
  type SpinorSolitonState
} from '../engine/spinorSolitonCollider';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const state = ref<SpinorSolitonState>({ ...spinorSolitonColliderEngine.getState() });
const animTick = ref(0);
let animFrame: number | null = null;

const regimes: { id: SpinorSolitonRegime; name: string; icon: string }[] = [
  { id: 'polar-ground-fluid', name: '極性基態超流', icon: '❄️' },
  { id: 'soliton-pair-acceleration', name: '孤子對向加速', icon: '⚡' },
  { id: 'relativistic-soliton-collision', name: '相對論孤子對撞', icon: '💥' },
  { id: 'holographic-black-hole-merger', name: '全息黑洞融合', icon: '🕳️' }
];

function regimeLabel(regime: SpinorSolitonRegime): string {
  const match = regimes.find(r => r.id === regime);
  return match ? match.name : regime;
}

function selectRegime(regime: SpinorSolitonRegime): void {
  spinorSolitonColliderEngine.setRegime(regime);
  syncState();
}

function onInteractionChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  spinorSolitonColliderEngine.setSpinInteraction(val);
  syncState();
}

function onVelocityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  spinorSolitonColliderEngine.setCollisionVelocity(val);
  syncState();
}

function onImpactChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  spinorSolitonColliderEngine.setImpactParameter(val);
  syncState();
}

function playSound(): void {
  spinorSolitonColliderEngine.triggerCollisionSound();
}

function resetEngine(): void {
  spinorSolitonColliderEngine.reset();
  syncState();
}

function handleClose(): void {
  uiStore.closeModals();
}

function syncState(): void {
  state.value = { ...spinorSolitonColliderEngine.getState() };
}

function loop(): void {
  animTick.value += 0.04;
  spinorSolitonColliderEngine.update(0.016);
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
  background: rgba(18, 5, 2, 0.82);
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
  background: #1c0803;
  border: 1px solid #ea580c;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(249, 115, 22, 0.35);
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
  background: #2b0e05;
  border-bottom: 1px solid #c2410c;
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
  color: #ffedd5;
  letter-spacing: 0.5px;
}

.title-wrap .subtitle {
  margin: 2px 0 0 0;
  font-size: 0.78rem;
  color: #fb923c;
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
  border: 1px solid #9a3412;
}

.collider-svg {
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
  background: #431407;
  border: 1px solid #9a3412;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.regime-btn:hover {
  background: #7c2d12;
  border-color: #fb923c;
  color: #f8fafc;
}

.regime-btn.active {
  background: linear-gradient(135deg, #c2410c, #ea580c);
  border-color: #ffedd5;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #2b0e05;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #7c2d12;
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
  color: #fb923c;
  font-weight: bold;
  font-family: monospace;
}

.cyber-slider {
  width: 100%;
  height: 6px;
  accent-color: #ea580c;
  background: #431407;
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
  background: #9a3412;
  border-color: #ea580c;
  color: #ffedd5;
}
.sound-btn:hover {
  background: #c2410c;
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
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
