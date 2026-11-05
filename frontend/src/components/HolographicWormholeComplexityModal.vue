<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 62 // HOLOGRAPHIC COMPLEXITY = VOLUME (CV 2.0) &amp; ER BRIDGE</span>
          <h2>🕳️ 全息蟲洞複雜度等於體積生長與後佩奇量子洛倫茲橋</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="wormhole-cv-svg">
            <defs>
              <radialGradient id="erThroatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(168, 85, 247, 0.38)" />
                <stop offset="65%" stop-color="rgba(244, 63, 94, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#erThroatGlow)" />

            <!-- Two-sided AdS Penrose diagram boundaries and future/past singularities -->
            <line x1="35" y1="45" x2="35" y2="275" stroke="#38bdf8" stroke-width="2.5" />
            <line x1="295" y1="45" x2="295" y2="275" stroke="#34d399" stroke-width="2.5" />
            <path d="M 35 45 Q 165 65 295 45" fill="none" stroke="rgba(244, 63, 94, 0.65)" stroke-width="1.8" stroke-dasharray="4 3" />
            <path d="M 35 275 Q 165 255 295 275" fill="none" stroke="rgba(244, 63, 94, 0.65)" stroke-width="1.8" stroke-dasharray="4 3" />

            <!-- Bifurcate horizons -->
            <line x1="35" y1="45" x2="295" y2="275" stroke="rgba(250, 204, 21, 0.35)" stroke-width="1.4" stroke-dasharray="5 4" />
            <line x1="295" y1="45" x2="35" y2="275" stroke="rgba(250, 204, 21, 0.35)" stroke-width="1.4" stroke-dasharray="5 4" />

            <!-- Maximal spatial slice Σ_max connecting Left CFT and Right CFT -->
            <g v-for="node in state.bridgeNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.5 + node.localVolumeElement * 4.5"
                :fill="sliceColor(node.sliceRegion)"
                stroke="#0f172a"
                stroke-width="1.3"
              />
              <text
                v-if="node.id % 3 === 0"
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                10^{{ node.circuitDepthGatesLog }}
              </text>
            </g>

            <text x="14" y="22" fill="#c084fc" font-size="10" font-family="monospace">
              C_V = max_Σ [V(Σ) / (G_N l_AdS)] | dC/dt → 2M/(πℏ)
            </text>
            <text x="14" y="308" fill="#fde047" font-size="10" font-family="monospace">
              V/V_sat={{ (state.maximalSliceVolumeNormalized * 100).toFixed(1) }}% | dC/dt={{ state.lloydGrowthRateRatio.toFixed(3) }} | P_baby={{ (state.babyUniverseTunnelingProb * 100).toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">最大類空切面體積比 V/V_sat</span>
              <span class="m-val purple">{{ (state.maximalSliceVolumeNormalized * 100).toFixed(1) }} %</span>
            </div>
            <div class="metric-box">
              <span class="m-label">勞埃德複雜度生長率比</span>
              <span class="m-val cyan">{{ state.lloydGrowthRateRatio.toFixed(3) }} × (2M/πℏ)</span>
            </div>
            <div class="metric-box">
              <span class="m-label">衝擊波折返延遲 Δt_sw / t_*</span>
              <span class="m-val gold">{{ state.switchbackDelayScramblingUnits.toFixed(2) }} t_*</span>
            </div>
            <div class="metric-box">
              <span class="m-label">嬰兒宇宙非微擾穿隧率 P_baby</span>
              <span class="m-val emerald">{{ (state.babyUniverseTunnelingProb * 100).toFixed(1) }} %</span>
            </div>
          </div>

          <div class="regime-group">
            <label>永恆雙邊黑洞愛因斯坦-羅森橋複雜度演化區間</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimes"
                :key="opt.id"
                :class="['regime-btn', { active: state.activeRegime === opt.id }]"
                @click="selectRegime(opt.id)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>邊界演化時間與指數熵高原時間比 t / e^{S_BH}</span>
              <span class="slider-val">{{ state.boundaryTimeExpEntropyRatio.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.60"
              step="0.02"
              :value="state.boundaryTimeExpEntropyRatio"
              @input="onTimeRatioChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>邊界蝴蝶效應衝擊波能量微擾 δE / T_H</span>
              <span class="slider-val">{{ state.shockwavePerturbationEnergy.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="5.00"
              step="0.05"
              :value="state.shockwavePerturbationEnergy"
              @input="onShockwaveChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發愛因斯坦-羅森橋最大切面與嬰兒宇宙穿隧共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置全息蟲洞複雜度腔
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import {
  holographicWormholeComplexityVolumeEngine,
  type WormholeComplexityRegime
} from '../engine/holographicWormholeComplexityVolume';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(holographicWormholeComplexityVolumeEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: WormholeComplexityRegime; label: string }[] = [
  { id: 'lloyd-bound-linear-volume-ramp', label: '勞埃德上界線性體積暴脹' },
  { id: 'shockwave-switchback-scrambling-delay', label: '衝擊波折返混洗延遲' },
  { id: 'exponential-time-baby-universe-plateau', label: '指數時間嬰兒宇宙高原' },
  { id: 'white-hole-bounce-complexity-decreasing', label: '白洞反彈複雜度收縮' }
];

function sliceColor(region: string): string {
  if (region === 'left-cft-boundary') return '#38bdf8';
  if (region === 'right-cft-boundary') return '#34d399';
  if (region === 'shockwave-caustic') return '#fb7185';
  return '#c084fc';
}

function syncState(): void {
  Object.assign(state, holographicWormholeComplexityVolumeEngine.getState());
}

function selectRegime(regime: WormholeComplexityRegime): void {
  holographicWormholeComplexityVolumeEngine.setRegime(regime);
  holographicWormholeComplexityVolumeEngine.triggerWormholeComplexitySound();
  achievements.unlock('holographic_wormhole_complexity_volume_plateau');
  syncState();
}

function onTimeRatioChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicWormholeComplexityVolumeEngine.setBoundaryTimeRatio(val);
  syncState();
}

function onShockwaveChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicWormholeComplexityVolumeEngine.setShockwavePerturbation(val);
  syncState();
}

function triggerSound(): void {
  holographicWormholeComplexityVolumeEngine.triggerWormholeComplexitySound();
  achievements.unlock('holographic_wormhole_complexity_volume_plateau');
}

function resetEngine(): void {
  holographicWormholeComplexityVolumeEngine.reset();
  syncState();
}

function close(): void {
  ui.setHolographicWormholeComplexityOpen(false);
}

onMounted(() => {
  achievements.unlock('holographic_wormhole_complexity_volume_plateau');
  timer = setInterval(() => {
    holographicWormholeComplexityVolumeEngine.update(0.08);
    syncState();
  }, 80);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(920px, 95vw);
  background: linear-gradient(145deg, #0f172a 0%, #090d16 100%);
  border: 1px solid rgba(192, 132, 252, 0.45);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(192, 132, 252, 0.25);
  background: rgba(15, 23, 42, 0.7);
}
.badge {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #c084fc;
  font-family: monospace;
}
.title-group h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #f1f5f9;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  padding: 20px;
}
.viz-panel {
  background: #020617;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wormhole-cv-svg {
  width: 100%;
  height: auto;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.metric-box {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.m-label {
  font-size: 11px;
  color: #94a3b8;
}
.m-val {
  font-size: 17px;
  font-weight: 700;
  margin-top: 4px;
  font-family: monospace;
}
.m-val.purple { color: #c084fc; }
.m-val.cyan { color: #38bdf8; }
.m-val.gold { color: #facc15; }
.m-val.emerald { color: #34d399; }
.regime-group label {
  font-size: 12px;
  color: #cbd5e1;
  display: block;
  margin-bottom: 6px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #cbd5e1;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.regime-btn.active {
  background: rgba(192, 132, 252, 0.2);
  border-color: #c084fc;
  color: #e9d5ff;
  font-weight: 600;
}
.slider-group {
  background: rgba(15, 23, 42, 0.6);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 6px;
}
.slider-val {
  color: #c084fc;
  font-family: monospace;
}
.slider-group input[type='range'] {
  width: 100%;
}
.action-row {
  display: flex;
  gap: 10px;
  margin-top: auto;
}
.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn.primary {
  background: linear-gradient(90deg, #9333ea, #2563eb);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
