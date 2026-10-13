<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { floquetAndreevEngine, type FloquetAndreevRegime } from '../engine/floquetAndreevSuperconductor';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => floquetAndreevEngine.getState());

const isOpen = computed(() => uiStore.mode === 'floquet-andreev');

const regimes: Array<{ id: FloquetAndreevRegime; label: string; desc: string }> = [
  { id: 'floquet-majorana-pi-mode', label: '反常弗洛凱 π-模', desc: 'W_π = 1 準能量邊界拓撲保護態' },
  { id: 'dynamical-andreev-bound-states', label: '動態安德烈夫束縛態', desc: 'E_ABS 微波驅動反交叉分裂' },
  { id: 'landau-zener-stueckelberg', label: 'LZS 相干量子干涉', desc: 'Landau-Zener 非絕熱相位累積' },
  { id: 'nonequilibrium-supercurrent', label: '非平衡拓撲超電流', desc: '多光子輔助穿隧無耗散超流泵' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateFreq(val: number) {
  floquetAndreevEngine.setParameters({ driveFrequencyGhz: val });
}

function updateAmp(val: number) {
  floquetAndreevEngine.setParameters({ driveAmplitudeVolts: val });
}

function updateTrans(val: number) {
  floquetAndreevEngine.setParameters({ junctionTransparencyD: val });
}

function updatePhi(val: number) {
  floquetAndreevEngine.setParameters({ phaseDifferencePhiRad: val });
}

function updateGap(val: number) {
  floquetAndreevEngine.setParameters({ superconductingGapMev: val });
}

function selectRegime(regime: FloquetAndreevRegime) {
  floquetAndreevEngine.setParameters({ regime });
  achievements.unlock('floquet_andreev_superconductor');
}

function pulsePump() {
  floquetAndreevEngine.pulseMicrowavePump();
  achievements.unlock('floquet_andreev_superconductor');
}

function togglePiMode() {
  floquetAndreevEngine.togglePiModeCoupling();
  achievements.unlock('floquet_andreev_superconductor');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="fam-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚡</span>
          <div>
            <h2>弗洛凱拓撲超導與安德烈夫量子引擎 (Floquet Andreev Engine)</h2>
            <span class="subtitle">Floquet Majorana π-Modes, Dynamical Andreev Bound States & LZS Interferometry</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 弗洛凱準能量區與動態 ABS 能譜 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="fam-svg">
            <defs>
              <linearGradient id="absCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
              <radialGradient id="piModeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.9" />
                <stop offset="70%" stop-color="#8b5cf6" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 深翠黑底版 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#040d12" stroke="#10b981" stroke-width="1.8" />

            <!-- 弗洛凱布里淵區準能量坐標軸 -->
            <g transform="translate(270, 160)">
              <!-- 背景準能量格線 -->
              <line x1="-200" y1="0" x2="200" y2="0" stroke="#334155" stroke-width="1.2" stroke-dasharray="4 4" />
              <line x1="-200" y1="-85" x2="200" y2="-85" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
              <line x1="-200" y1="85" x2="200" y2="85" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />

              <!-- 安德烈夫束縛態能譜曲線 E_ABS(φ) -->
              <path
                d="M -180 -70 Q -90 10, 0 65 T 180 -70"
                fill="none"
                stroke="url(#absCurveGrad)"
                stroke-width="3.2"
              />
              <path
                d="M -180 70 Q -90 -10, 0 -65 T 180 70"
                fill="none"
                stroke="url(#absCurveGrad)"
                stroke-width="3.2"
                stroke-dasharray="6 3"
              />

              <!-- ε = 0 馬約拉納零模光心 -->
              <circle cx="0" cy="0" r="10" fill="#34d399" stroke="#ffffff" stroke-width="2">
                <animate attributeName="r" values="9;12;9" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="4" fill="#022c22" font-size="10" font-weight="bold" text-anchor="middle">0-模</text>

              <!-- ε = π/ħ 馬約拉納 π-模光圈 (頂部與底部邊界) -->
              <circle cx="-160" cy="-85" r="14" fill="url(#piModeGlow)">
                <animate attributeName="r" values="12;16;12" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="85" r="14" fill="url(#piModeGlow)">
                <animate attributeName="r" values="12;16;12" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <text x="-160" y="-81" fill="#f472b6" font-size="9" font-weight="bold" text-anchor="middle">π-模</text>
              <text x="160" y="89" fill="#f472b6" font-size="9" font-weight="bold" text-anchor="middle">π-模</text>

              <!-- LZS 相位穿隧干涉波紋動態 -->
              <ellipse
                v-if="state.regime === 'landau-zener-stueckelberg'"
                cx="0"
                cy="0"
                rx="65"
                ry="30"
                fill="none"
                stroke="#38bdf8"
                stroke-width="1.5"
                stroke-dasharray="8 4"
              >
                <animate attributeName="rx" values="30;95;30" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
              </ellipse>
            </g>

            <!-- 左側標註 -->
            <text x="45" y="52" fill="#34d399" font-size="11" font-weight="bold">
              弗洛凱-布里淵區準能量譜 (Ω = {{ state.driveFrequencyGhz.toFixed(1) }} GHz)
            </text>
            <text x="45" y="70" fill="#94a3b8" font-size="10">
              驅動電壓 V₀ = {{ state.driveAmplitudeVolts.toFixed(2) }} mV | 穿透率 D = {{ state.junctionTransparencyD.toFixed(2) }}
            </text>

            <!-- 右側拓撲不變量與超流指標 -->
            <text x="495" y="275" fill="#facc15" font-size="10" text-anchor="end">
              非平衡超電流 I_c = {{ state.nonequilibriumSupercurrentMicroAmp.toFixed(1) }} μA | ABS 能階 {{ state.andreevBoundStateEnergyMev.toFixed(3) }} meV
            </text>
            <text x="495" y="255" fill="#f472b6" font-size="10" text-anchor="end">
              拓撲數 (W₀, W_π) = ({{ state.floquetInvariantW0 }}, {{ state.floquetInvariantWPi }}) | π-模準能 {{ (state.quasiEnergyMevPiMode * 1000).toFixed(1) }} μeV
            </text>
          </svg>
        </div>

        <!-- 4 大相態體制按鈕 -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            class="regime-btn"
            :class="{ active: state.regime === r.id }"
            @click="selectRegime(r.id)"
          >
            <span class="regime-name">{{ r.label }}</span>
            <span class="regime-desc">{{ r.desc }}</span>
          </button>
        </div>

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">反常 π-模不變量 W_π</span>
            <span class="m-val text-pink">{{ state.floquetInvariantWPi }} (Z-拓撲)</span>
          </div>
          <div class="metric-item">
            <span class="m-label">零模拓撲數 W₀</span>
            <span class="m-val text-emerald">{{ state.floquetInvariantW0 }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">ABS 束縛態能階</span>
            <span class="m-val text-cyan">{{ state.andreevBoundStateEnergyMev.toFixed(3) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">非平衡拓撲超電流</span>
            <span class="m-val text-emerald">{{ state.nonequilibriumSupercurrentMicroAmp.toFixed(1) }} μA</span>
          </div>
          <div class="metric-item">
            <span class="m-label">π-模準能量</span>
            <span class="m-val text-pink">{{ (state.quasiEnergyMevPiMode * 1000).toFixed(1) }} μeV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">微波頻率 Ω/2π</span>
            <span class="m-val text-cyan">{{ state.driveFrequencyGhz.toFixed(1) }} GHz</span>
          </div>
        </div>

        <!-- 參數調節面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>微波驅動頻率 (Ω/2π, GHz)</span>
              <span class="val">{{ state.driveFrequencyGhz.toFixed(1) }} GHz</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="60.0"
              step="1.0"
              :value="state.driveFrequencyGhz"
              @input="updateFreq(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>微波電壓振幅 (V₀, mV)</span>
              <span class="val">{{ state.driveAmplitudeVolts.toFixed(2) }} mV</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="5.0"
              step="0.05"
              :value="state.driveAmplitudeVolts"
              @input="updateAmp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>約瑟夫森接面穿透率 (D)</span>
              <span class="val">{{ state.junctionTransparencyD.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.999"
              step="0.01"
              :value="state.junctionTransparencyD"
              @input="updateTrans(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>約瑟夫森相位差 (φ, rad)</span>
              <span class="val">{{ state.phaseDifferencePhiRad.toFixed(2) }} rad</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="6.28"
              step="0.05"
              :value="state.phaseDifferencePhiRad"
              @input="updatePhi(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>靜態超導能隙 (Δ, meV)</span>
              <span class="val">{{ state.superconductingGapMev.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              :value="state.superconductingGapMev"
              @input="updateGap(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="pulsePump">
            ⚡ 注入高頻微波泵浦並驅動多光子超電流
          </button>
          <button class="action-btn secondary" @click="togglePiMode">
            ✨ 切換反常弗洛凱 π-模 ⇄ ABS 動態束縛態
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
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;
}

.fam-card {
  width: 90%;
  max-width: 680px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(4, 40, 30, 0.9));
  border: 1px solid rgba(16, 185, 129, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px 24px;
  background: rgba(4, 40, 30, 0.6);
  border-bottom: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon {
  font-size: 28px;
}

h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ecfdf5;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.75rem;
  color: #6ee7b7;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
}

.content-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.fam-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5));
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.regime-btn:hover {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(4, 40, 30, 0.4);
}

.regime-btn.active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.25));
  border-color: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.regime-desc {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 3px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
}

.m-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-top: 4px;
}

.text-pink {
  color: #f472b6;
}

.text-emerald {
  color: #34d399;
}

.text-cyan {
  color: #38bdf8;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.4);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.slider-header .val {
  color: #34d399;
  font-family: monospace;
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: #10b981;
  background: rgba(255, 255, 255, 0.1);
  height: 6px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 10px;
}

.action-btn {
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #059669, #10b981);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
}

.action-btn.secondary {
  background: rgba(4, 40, 30, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #d1fae5;
}

.action-btn.secondary:hover {
  background: rgba(6, 60, 45, 0.8);
  border-color: rgba(16, 185, 129, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
