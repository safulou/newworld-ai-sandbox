<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { axionCherenkovEngine, type AxionCherenkovRegime } from '../engine/axionGravitationalCherenkov';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => axionCherenkovEngine.getState());

const isOpen = computed(() => uiStore.mode === 'axion-cherenkov');

const regimes: Array<{ id: AxionCherenkovRegime; label: string; desc: string }> = [
  { id: 'sub-cherenkov-stable-propagation', label: '次切倫科夫亞臨界穩定相', desc: '激波速度小於引力相速度 (v < c_grav)，無引力波耗散' },
  { id: 'gravitational-cherenkov-shock-cone', label: '引力切倫科夫相干激波錐相', desc: '超引力相速度 (v > c_grav)，時空自發產生相干引力激波錐' },
  { id: 'axion-string-cusp-burst', label: '軸子宇宙弦尖點坍縮巨暴發相', desc: '宇宙弦尖點激烈振盪對撞，爆發 PeV 級相對論性引力脈衝' },
  { id: 'bimetric-metric-birefringence-decay', label: '雙度規度規雙折射衰減相', desc: '雙度規張量微擾引發強引力波色散與普朗克截斷耗散' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateVelocity(val: number) {
  const current = state.value.particleVelocityNormalized;
  const diff = val - current;
  if (Math.abs(diff) > 0.000001) {
    axionCherenkovEngine.injectRelativisticAxionShock(diff * 1e4);
  }
  achievements.unlock('axion_gravitational_cherenkov');
}

function updateGravitonSpeed(val: number) {
  const diff = val - state.value.gravitonSpeedFraction;
  axionCherenkovEngine.modulateGravitonPhaseVelocity(diff);
  achievements.unlock('axion_gravitational_cherenkov');
}

function injectAxionShock() {
  axionCherenkovEngine.injectRelativisticAxionShock(5.0);
  achievements.unlock('axion_gravitational_cherenkov');
}

function triggerCuspBurst() {
  axionCherenkovEngine.triggerAxionStringCusp();
  achievements.unlock('axion_gravitational_cherenkov');
}

function dampShock() {
  axionCherenkovEngine.dampEnergyLoss();
  achievements.unlock('axion_gravitational_cherenkov');
}

function reset() {
  axionCherenkovEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="cherenkov-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚡</span>
          <div>
            <h2>軸子弦星系激波與引力切倫科夫天線 (Axion Gravitational Cherenkov)</h2>
            <span class="subtitle">PQ Cosmic String Cusps, Bimetric c_grav Shock Waves & High-Energy Graviton Cones</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 引力切倫科夫激波錐與宇宙弦振盪 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="cherenkov-svg">
            <defs>
              <linearGradient id="coneGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85" />
                <stop offset="40%" stop-color="#6366f1" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.05" />
              </linearGradient>
              <radialGradient id="cuspBurstGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1.0" />
                <stop offset="50%" stop-color="#fb923c" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 深空背景網格 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#38bdf8" stroke-width="1.6" />

            <!-- 宇宙弦環與背景重力微擾 -->
            <path
              d="M 60,150 Q 140,50 260,150 T 460,150"
              fill="none"
              stroke="#0ea5e9"
              stroke-width="1.2"
              stroke-dasharray="3 3"
              opacity="0.4"
            />

            <!-- 引力切倫科夫錐 (以 cherenkovAngleDeg 展開) -->
            <g transform="translate(180, 150)">
              <!-- 錐面波前扇形 (頂點在 0,0，朝左傳播，波錐向後向右散開) -->
              <polygon
                :points="`0,0 ${280},${-Math.tan((state.cherenkovAngleDeg * Math.PI) / 180) * 1600} ${280},${Math.tan((state.cherenkovAngleDeg * Math.PI) / 180) * 1600}`"
                fill="url(#coneGrad)"
                opacity="0.75"
              />

              <!-- 激波錐波前同心圓弧 -->
              <path
                v-for="r in [40, 90, 150, 220]"
                :key="r"
                :d="`M ${r * 0.8},${-r * Math.tan((state.cherenkovAngleDeg * Math.PI) / 180) * 4.5} Q ${r * 0.4},0 ${r * 0.8},${r * Math.tan((state.cherenkovAngleDeg * Math.PI) / 180) * 4.5}`"
                fill="none"
                stroke="#38bdf8"
                :stroke-width="1.5"
                opacity="0.8"
              />

              <!-- 粒子激波頂點與前進向量 -->
              <circle cx="0" cy="0" :r="state.regime === 'axion-string-cusp-burst' ? 14 : 7" fill="url(#cuspBurstGlow)">
                <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <line x1="0" y1="0" x2="-70" y2="0" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow)" />
              <text x="-75" y="-10" fill="#f43f5e" font-size="11" font-weight="bold">v = {{ state.particleVelocityNormalized }} c</text>

              <!-- 切倫科夫角標註線 -->
              <line x1="0" y1="0" :x2="160" :y2="-Math.tan((state.cherenkovAngleDeg * Math.PI) / 180) * 900" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 2" />
              <line x1="0" y1="0" x2="160" y2="0" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" />
              <text x="70" y="-12" fill="#fbbf24" font-size="12" font-weight="bold">θ_C = {{ state.cherenkovAngleDeg }}°</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 45)">
              <rect x="0" y="0" width="220" height="32" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1" />
              <text x="12" y="20" fill="#38bdf8" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">切倫科夫開角 (θ_C)</span>
            <span class="m-val highlight">{{ state.cherenkovAngleDeg }}°</span>
            <span class="m-sub">cos θ = c_grav / v</span>
          </div>

          <div class="metric-card">
            <span class="m-label">引力輻射功率</span>
            <span class="m-val accent">{{ state.gravitationalRadiationPowerWatts }} ×10²⁸ W</span>
            <span class="m-sub">高頻相干重力波錐</span>
          </div>

          <div class="metric-card">
            <span class="m-label">能量耗散率 (dE/dx)</span>
            <span class="m-val">{{ state.energyLossRateGevPerMeter }} ×10⁵ GeV/m</span>
            <span class="m-sub">普朗克截斷耗散</span>
          </div>

          <div class="metric-card">
            <span class="m-label">引力子相速度 (c_grav)</span>
            <span class="m-val">{{ state.gravitonSpeedFraction }} c</span>
            <span class="m-sub">雙度規修正微擾</span>
          </div>

          <div class="metric-card">
            <span class="m-label">激波能量 (E_shock)</span>
            <span class="m-val">{{ state.shockEnergyPev }} PeV</span>
            <span class="m-sub">宇宙弦尖點激發能</span>
          </div>

          <div class="metric-card">
            <span class="m-label">勞倫茲因子 (γ)</span>
            <span class="m-val">{{ state.lorentzFactorGamma }}</span>
            <span class="m-sub">超相對論性膨脹率</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>粒子激波速度 v/c (0.99000 ~ 0.99999): <b>{{ state.particleVelocityNormalized }} c</b></label>
              <input
                type="range"
                min="0.99000"
                max="0.99999"
                step="0.00002"
                :value="state.particleVelocityNormalized"
                @input="updateVelocity(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>引力子相速度 c_grav/c (0.99000 ~ 0.99990): <b>{{ state.gravitonSpeedFraction }} c</b></label>
              <input
                type="range"
                min="0.99000"
                max="0.99990"
                step="0.00005"
                :value="state.gravitonSpeedFraction"
                @input="updateGravitonSpeed(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="injectAxionShock">
              ⚡ 注入軸子激波 (+5 PeV)
            </button>
            <button class="action-btn burst" @click="triggerCuspBurst">
              💥 激發宇宙弦尖點坍縮暴發
            </button>
            <button class="action-btn secondary" @click="dampShock">
              🛡️ 阻尼激波耗散
            </button>
            <button class="action-btn reset" @click="reset">
              🔄 復位預設
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.cherenkov-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(56, 189, 248, 0.35);
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.25);
  border-radius: 16px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title-group .icon {
  font-size: 32px;
}

h2 {
  font-size: 19px;
  font-weight: 700;
  color: #38bdf8;
  margin: 0;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #f87171;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cherenkov-svg {
  width: 100%;
  max-height: 250px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  padding: 10px 14px;
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
  color: #f8fafc;
  margin: 3px 0;
}

.m-val.highlight {
  color: #fbbf24;
}

.m-val.accent {
  color: #38bdf8;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
}

.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-row label {
  font-size: 12px;
  color: #cbd5e1;
}

.slider-row input[type="range"] {
  accent-color: #38bdf8;
  height: 6px;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: #0284c7;
  color: #fff;
}
.action-btn.primary:hover {
  background: #0369a1;
}

.action-btn.burst {
  background: #e11d48;
  color: #fff;
}
.action-btn.burst:hover {
  background: #be123c;
}

.action-btn.secondary {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(56, 189, 248, 0.25);
}

.action-btn.reset {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
  margin-left: auto;
}
.action-btn.reset:hover {
  background: rgba(148, 163, 184, 0.25);
  color: #fff;
}
</style>
