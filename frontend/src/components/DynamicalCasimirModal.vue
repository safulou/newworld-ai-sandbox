<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { dynamicalCasimirEngine, type DynamicalCasimirRegime } from '../engine/dynamicalCasimirEffect';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => dynamicalCasimirEngine.getState());

const isOpen = computed(() => uiStore.mode === 'dynamical-casimir');

const regimes: Array<{ id: DynamicalCasimirRegime; label: string; desc: string }> = [
  { id: 'quiescent-vacuum-virtual-pairs', label: '寧靜基態虛光子對起伏相', desc: '反射鏡振動速度遠低於相對論閾值 β ≪ 0.05，量子電磁場以真空零點能起伏為主，無宏觀真實光子逃逸' },
  { id: 'sub-threshold-parametric-amplification', label: '亞臨界參量共振微波放大態', desc: 'SQUID 磁通高頻震盪驅動微波傳輸線諧振，引發微弱雙模參量放大，產生次泊松分佈量子噪聲壓制' },
  { id: 'relativistic-dynamical-casimir-emission', label: '相對論性運動反射鏡連續光子對輻射相', desc: '等效反射鏡速度達到 β ≈ 0.25c，玻戈留玻夫非平庸變換自發將虛光子拉出狄拉克真空，連續發射糾纏微波光子對' },
  { id: 'quantum-squeezing-saturation', label: '正交分量極限量子噪聲壓縮飽和態', desc: '超高腔品質因數 Q > 30000 促使單正交分量噪聲降至標準量子極限以下 (> 10 dB)，雙模糾纏熵達極限飽和' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateVelocity(val: number) {
  dynamicalCasimirEngine.setMirrorVelocityBeta(val);
  achievements.unlock('dynamical_casimir_effect');
}

function updateFrequency(val: number) {
  dynamicalCasimirEngine.setOscillationFreq(val);
  achievements.unlock('dynamical_casimir_effect');
}

function updateFlux(val: number) {
  dynamicalCasimirEngine.setSquidFlux(val);
  achievements.unlock('dynamical_casimir_effect');
}

function updateCavityQ(val: number) {
  dynamicalCasimirEngine.setCavityQ(val);
  achievements.unlock('dynamical_casimir_effect');
}

function triggerDce() {
  dynamicalCasimirEngine.triggerDceEmission();
  achievements.unlock('dynamical_casimir_effect');
}

function cycleRegime() {
  dynamicalCasimirEngine.cycleRegime();
  achievements.unlock('dynamical_casimir_effect');
}

function reset() {
  dynamicalCasimirEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="casimir-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚡</span>
          <div>
            <h2>動力學卡西米爾效應 (Dynamical Casimir Effect)</h2>
            <span class="subtitle">SQUID Non-adiabatic Relativistic Boundary & Entangled Vacuum Squeezing</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="casimir-svg">
            <defs>
              <linearGradient id="cavityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.2" />
                <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2" />
              </linearGradient>
              <linearGradient id="mirrorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <radialGradient id="photonPairGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深色背景 -->
            <rect width="800" height="320" fill="#030712" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 傳輸線共振腔 (Coplanar Waveguide Transmission Line) -->
            <rect x="60" y="70" width="380" height="180" rx="8" fill="url(#cavityGrad)" stroke="#0284c7" stroke-width="2" />
            <line x1="60" y1="160" x2="440" y2="160" stroke="#38bdf8" stroke-dasharray="4 4" stroke-width="1.5" />

            <!-- 諧振腔常微波駐波分佈 -->
            <path
              :d="`M 60 160 Q 155 ${160 - 55 * Math.sin(state.effectiveMirrorVelocityBeta * 15)}, 250 160 T 440 160`"
              fill="none"
              stroke="#67e8f9"
              stroke-width="2.5"
              stroke-linecap="round"
            />

            <!-- SQUID 超導運動反射鏡 (震盪端點) -->
            <!-- 鏡面隨有效速度動態水平偏移 -->
            <g :transform="`translate(${435 + Math.sin(state.effectiveMirrorVelocityBeta * 20) * 12}, 0)`">
              <rect x="0" y="80" width="16" height="160" rx="4" fill="url(#mirrorGlow)" stroke="#7dd3fc" stroke-width="2" />
              <line x1="8" y1="60" x2="8" y2="80" stroke="#38bdf8" stroke-width="2" />
              <line x1="8" y1="240" x2="8" y2="260" stroke="#38bdf8" stroke-width="2" />
              <!-- SQUID 環狀線圈符號 -->
              <circle cx="8" cy="50" r="10" fill="none" stroke="#f59e0b" stroke-width="2" />
              <text x="8" y="54" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">Φ</text>
            </g>

            <!-- 產生的微波光子對 (向兩側逃逸的糾纏光子) -->
            <g v-if="state.effectiveMirrorVelocityBeta > 0.05">
              <!-- 光子對 1 -->
              <circle :cx="340 - (state.totalEmittedPhotonsCount % 120)" cy="135" r="10" fill="url(#photonPairGlow)" />
              <text :x="340 - (state.totalEmittedPhotonsCount % 120)" y="139" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">ω₁</text>

              <!-- 光子對 2 -->
              <circle :cx="340 - (state.totalEmittedPhotonsCount % 120)" cy="185" r="10" fill="url(#photonPairGlow)" />
              <text :x="340 - (state.totalEmittedPhotonsCount % 120)" y="189" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">ω₂</text>

              <!-- 糾纏光子對連接光纖線 -->
              <line
                :x1="340 - (state.totalEmittedPhotonsCount % 120)"
                y1="135"
                :x2="340 - (state.totalEmittedPhotonsCount % 120)"
                y2="185"
                stroke="#38bdf8"
                stroke-dasharray="2 2"
                stroke-width="1.5"
              />
            </g>

            <!-- 右側：相空間正交分量壓縮橢圓 (Phase Space Squeezed Vacuum State) -->
            <g transform="translate(620, 160)">
              <!-- 坐標軸 X1 (同相), X2 (正交) -->
              <line x1="-100" y1="0" x2="100" y2="0" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" />
              <text x="105" y="4" fill="rgba(255, 255, 255, 0.6)" font-size="11">X₁</text>
              <text x="-4" y="-105" fill="rgba(255, 255, 255, 0.6)" font-size="11">X₂</text>

              <!-- 標準量子極限圓 (SQL: r = 0, ΔX1 = ΔX2 = 0.5) -->
              <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="3 3" stroke-width="1.5" />
              <text x="48" y="-48" fill="rgba(255, 255, 255, 0.3)" font-size="9">SQL (0 dB)</text>

              <!-- 壓縮真空態橢圓 (Squeezed State Ellipse) -->
              <!-- X1 噪聲壓低: rx = 45 * exp(-r), X2 噪聲拉寬: ry = 45 * exp(r) -->
              <ellipse
                cx="0"
                cy="0"
                :rx="Math.max(8, 45 * Math.sqrt(state.quadratureNoiseRatio))"
                :ry="Math.min(95, 45 / Math.sqrt(Math.max(0.05, state.quadratureNoiseRatio)))"
                transform="rotate(-25)"
                fill="rgba(56, 189, 248, 0.2)"
                stroke="#38bdf8"
                stroke-width="2.5"
              />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
            </g>

            <!-- 標註文字 -->
            <text x="70" y="100" fill="#38bdf8" font-size="12" font-weight="bold">SQUID 共振微波傳輸線腔</text>
            <text x="70" y="120" fill="rgba(255, 255, 255, 0.5)" font-size="10">Q = {{ state.cavityQualityFactorQ }} | f₀ = {{ state.boundaryOscillationFreqGhz }} GHz</text>
            <text x="560" y="50" fill="#7dd3fc" font-size="12" font-weight="bold">雙模壓縮真空 (TMSV) 相空間</text>
            <text x="560" y="70" fill="rgba(255, 255, 255, 0.5)" font-size="10">壓縮度 = {{ state.quantumSqueezingDb }} dB | 噪聲比 = {{ state.quadratureNoiseRatio }}</text>
          </svg>
        </div>

        <!-- 物理相態橫幅與描述 -->
        <div class="regime-banner">
          <div class="regime-title">
            <span class="badge">{{ state.regime }}</span>
            <span class="desc">{{ regimes.find(r => r.id === state.regime)?.desc }}</span>
          </div>
          <button class="action-btn cycle" @click="cycleRegime">相態輪轉</button>
        </div>

        <!-- 即時物理量監測儀表盤 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="label">光子對生成率 Γ</div>
            <div class="value cyan">{{ state.photonPairRatePerSec.toExponential(2) }} <span class="unit">對/秒</span></div>
          </div>
          <div class="metric-card">
            <div class="label">量子噪聲壓縮度</div>
            <div class="value green">{{ state.quantumSqueezingDb }} <span class="unit">dB</span></div>
          </div>
          <div class="metric-card">
            <div class="label">雙模糾纏熵 S_ent</div>
            <div class="value yellow">{{ state.twoModeEntanglementEntropy }} <span class="unit">nats</span></div>
          </div>
          <div class="metric-card">
            <div class="label">輻射微波功率</div>
            <div class="value purple">{{ state.microwaveEmissionPowerPw }} <span class="unit">pW</span></div>
          </div>
          <div class="metric-card">
            <div class="label">次泊松噪聲比 (ΔX₁)²</div>
            <div class="value orange">{{ state.quadratureNoiseRatio }} <span class="unit">SQL</span></div>
          </div>
          <div class="metric-card">
            <div class="label">累計發射光子計數</div>
            <div class="value pink">{{ state.totalEmittedPhotonsCount.toLocaleString() }} <span class="unit">個</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>等效運動反射鏡速度 β (v/c)</span>
              <span class="val-display">{{ state.effectiveMirrorVelocityBeta.toFixed(2) }} c</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.40"
              step="0.01"
              :value="state.effectiveMirrorVelocityBeta"
              @input="updateVelocity(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>邊界調製頻率 f₀ (GHz)</span>
              <span class="val-display">{{ state.boundaryOscillationFreqGhz.toFixed(1) }} GHz</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="25.0"
              step="0.2"
              :value="state.boundaryOscillationFreqGhz"
              @input="updateFrequency(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>SQUID 外加磁通量 Φ / Φ₀</span>
              <span class="val-display">{{ state.squidMagneticFluxPhi0.toFixed(2) }} Φ₀</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.50"
              step="0.01"
              :value="state.squidMagneticFluxPhi0"
              @input="updateFlux(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>傳輸線腔品質因數 Q</span>
              <span class="val-display">{{ state.cavityQualityFactorQ.toLocaleString() }}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              :value="state.cavityQualityFactorQ"
              @input="updateCavityQ(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerDce">
            ⚡ 觸發相對論性光子對爆發
          </button>
          <button class="btn-secondary" @click="reset">
            ↺ 系統還原
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.casimir-card {
  background: #0f172a;
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 40px rgba(2, 132, 199, 0.25);
  border-radius: 14px;
  width: 100%;
  max-width: 860px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e2e8f0;
}

.header {
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 26px;
}

.title-group h2 {
  margin: 0;
  font-size: 18px;
  color: #38bdf8;
  font-weight: 700;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

.content-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visualizer-container {
  background: #030712;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  overflow: hidden;
}

.casimir-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 10px 14px;
  border-radius: 8px;
  gap: 12px;
}

.regime-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge {
  font-family: monospace;
  font-size: 11px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid #38bdf8;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(56, 189, 248, 0.3);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-card .label {
  font-size: 11px;
  color: #94a3b8;
}

.metric-card .value {
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
}

.metric-card .unit {
  font-size: 10px;
  color: #64748b;
  font-weight: normal;
}

.cyan { color: #38bdf8; }
.green { color: #4ade80; }
.yellow { color: #facc15; }
.purple { color: #c084fc; }
.orange { color: #fb923c; }
.pink { color: #f472b6; }

.controls-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: rgba(15, 23, 42, 0.6);
  padding: 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
}

.val-display {
  font-family: monospace;
  color: #38bdf8;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #38bdf8;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
}

.btn-secondary {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}
</style>
