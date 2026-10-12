<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { quantumKerrCombEngine, type KerrCombRegime } from '../engine/quantumKerrSolitonComb';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => quantumKerrCombEngine.getState());

const isOpen = computed(() => uiStore.mode === 'kerr-comb');

const regimes: Array<{ id: KerrCombRegime; label: string; desc: string }> = [
  { id: 'dissipative-kerr-soliton', label: '單孤子鎖模相', desc: '低雜訊超快飛秒脈衝列車' },
  { id: 'octave-spanning-comb', label: '八度跨度自參考', desc: 'f-2f 載波包絡偏移精確鎖定' },
  { id: 'multi-soliton-crystal', label: '孤子分子晶體態', desc: '超穩定高諧波等間距輸出' },
  { id: 'quantum-squeezed-frequency-comb', label: '多模量子壓縮態', desc: '亞泊松光子突破散粒雜訊極限' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateQ(val: number) {
  quantumKerrCombEngine.setParameters({ cavityQualityFactorMillion: val });
}

function updatePower(val: number) {
  quantumKerrCombEngine.setParameters({ pumpPowerMilliWatt: val });
}

function updateDetuning(val: number) {
  quantumKerrCombEngine.setParameters({ laserDetuningGhz: val });
}

function updateRadius(val: number) {
  quantumKerrCombEngine.setParameters({ microRingRadiusMicrons: val });
}

function updateDispersion(val: number) {
  quantumKerrCombEngine.setParameters({ dispersionParameterD2Khz: val });
}

function selectRegime(regime: KerrCombRegime) {
  quantumKerrCombEngine.setParameters({ regime });
  achievements.unlock('quantum_kerr_soliton_comb');
}

function triggerSweep() {
  quantumKerrCombEngine.triggerSolitonStepSweep();
  achievements.unlock('quantum_kerr_soliton_comb');
}

function toggleSqueezing() {
  quantumKerrCombEngine.toggleSqueezingMode();
  achievements.unlock('quantum_kerr_soliton_comb');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="qkc-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌈</span>
          <div>
            <h2>巨克爾量子孤子光頻梳 (Kerr Soliton Frequency Comb)</h2>
            <span class="subtitle">Dissipative Kerr Solitons, Octave Spanning & Quantum Squeezing</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 微環腔孤子與光頻梳齒譜圖 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="qkc-svg">
            <defs>
              <radialGradient id="ringCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8" />
                <stop offset="70%" stop-color="#312e81" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="combSpectrum" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="25%" stop-color="#f59e0b" />
                <stop offset="50%" stop-color="#10b981" />
                <stop offset="75%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>

            <!-- 背景底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#060818" stroke="#3730a3" stroke-width="1.8" />

            <!-- 左側：微環光學諧振腔與旋轉孤子光脈衝 (Microresonator) -->
            <g transform="translate(145, 120)">
              <circle cx="0" cy="0" r="80" fill="url(#ringCore)" stroke="#4338ca" stroke-width="1.5" />
              <circle cx="0" cy="0" r="62" fill="#030712" stroke="#6366f1" stroke-width="2" />

              <!-- 輸入匯流排波導 (Bus Waveguide) -->
              <line x1="-115" y1="65" x2="115" y2="65" stroke="#818cf8" stroke-width="3" />
              <!-- 耦合光子流 -->
              <line x1="-115" y1="65" x2="0" y2="65" stroke="#c084fc" stroke-width="3" stroke-dasharray="8 6">
                <animate attributeName="stroke-dashoffset" values="0;-40" dur="0.8s" repeatCount="indefinite" />
              </line>

              <!-- 循環旋轉耗散克爾孤子脈衝 (Dissipative Soliton) -->
              <circle cx="62" cy="0" r="9" fill="#f43f5e" opacity="0.4" />
              <circle cx="62" cy="0" r="5" fill="#facc15" />
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="2.4s" repeatCount="indefinite" />
            </g>

            <!-- 右側：等間距頻率梳齒譜 (Optical Frequency Comb Teeth) -->
            <g transform="translate(290, 45)">
              <rect x="0" y="0" width="210" height="150" rx="10" fill="#0f172a" stroke="#475569" stroke-width="1.2" opacity="0.9" />
              <text x="105" y="22" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">
                等間距梳齒譜 (f_rep = {{ state.repetitionRateGhz.toFixed(1) }} GHz)
              </text>

              <!-- 頻率梳齒陣列 (Comb Lines) -->
              <g transform="translate(15, 125)">
                <line v-for="c in 19" :key="'comb-' + c"
                  :x1="c * 9"
                  y1="0"
                  :x2="c * 9"
                  :y2="-Math.max(15, Math.sin((c / 19) * Math.PI) * 85 + (c % 2 === 0 ? 10 : -8))"
                  stroke="url(#combSpectrum)"
                  stroke-width="2.5"
                />
              </g>

              <!-- f-2f 自參考干涉標籤 -->
              <text x="105" y="142" fill="#38bdf8" font-size="9" text-anchor="middle">
                f-2f 信噪比: {{ state.f2fInterferometricSnrDb.toFixed(1) }} dB
              </text>
            </g>

            <!-- 底部：微環與量子壓縮度狀態說明 -->
            <g transform="translate(45, 235)">
              <rect x="0" y="0" width="450" height="50" rx="8" fill="#1e1b4b" opacity="0.5" stroke="#4f46e5" stroke-width="1" />
              <text x="18" y="22" fill="#a5b4fc" font-size="11" font-weight="bold">
                孤子脈寬: {{ state.solitonPulseWidthFemtosecond.toFixed(1) }} fs | 總齒數: {{ state.combLineCount }} 齒
              </text>
              <text x="18" y="40" fill="#f43f5e" font-size="11">
                多模量子壓縮: {{ state.quantumSqueezingDb.toFixed(1) }} dB (突破標準量子極限 SQL)
              </text>
              <text x="430" y="32" fill="#34d399" font-size="10" text-anchor="end">
                Q = {{ state.cavityQualityFactorMillion.toFixed(1) }}M
              </text>
            </g>
          </svg>
        </div>

        <!-- 4 大體制按鈕 -->
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
            <span class="m-label">孤子脈寬 τ_p</span>
            <span class="m-val text-purple">{{ state.solitonPulseWidthFemtosecond.toFixed(1) }} fs</span>
          </div>
          <div class="metric-item">
            <span class="m-label">頻率梳齒數量</span>
            <span class="m-val text-cyan">{{ state.combLineCount }} 齒</span>
          </div>
          <div class="metric-item">
            <span class="m-label">重頻 f_rep</span>
            <span class="m-val text-emerald">{{ state.repetitionRateGhz.toFixed(1) }} GHz</span>
          </div>
          <div class="metric-item">
            <span class="m-label">多模量子壓縮度</span>
            <span class="m-val text-purple">{{ state.quantumSqueezingDb.toFixed(1) }} dB</span>
          </div>
          <div class="metric-item">
            <span class="m-label">f-2f 自參考 SNR</span>
            <span class="m-val text-cyan">{{ state.f2fInterferometricSnrDb.toFixed(1) }} dB</span>
          </div>
          <div class="metric-item">
            <span class="m-label">相位雜訊 @10kHz</span>
            <span class="m-val">{{ state.photonPhaseNoiseDbcHz.toFixed(1) }} dBc</span>
          </div>
        </div>

        <!-- 參數控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>腔品質因子 (Q, 百萬)</span>
              <span class="val">{{ state.cavityQualityFactorMillion.toFixed(1) }} M</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="80.0"
              step="1.0"
              :value="state.cavityQualityFactorMillion"
              @input="updateQ(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>泵浦激光功率 (P_in)</span>
              <span class="val">{{ state.pumpPowerMilliWatt.toFixed(0) }} mW</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="600.0"
              step="10.0"
              :value="state.pumpPowerMilliWatt"
              @input="updatePower(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>激光-腔失諧量 (δ)</span>
              <span class="val">{{ state.laserDetuningGhz.toFixed(1) }} GHz</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="15.0"
              step="0.2"
              :value="state.laserDetuningGhz"
              @input="updateDetuning(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>微環半徑 (R)</span>
              <span class="val">{{ state.microRingRadiusMicrons.toFixed(0) }} μm</span>
            </div>
            <input
              type="range"
              min="20.0"
              max="250.0"
              step="5.0"
              :value="state.microRingRadiusMicrons"
              @input="updateRadius(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>反常色散參數 (D_2 / 2π)</span>
              <span class="val">{{ state.dispersionParameterD2Khz.toFixed(0) }} kHz</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="500.0"
              step="10.0"
              :value="state.dispersionParameterD2Khz"
              @input="updateDispersion(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="triggerSweep">
            🚀 觸發紅失諧調頻步進鎖定單孤子
          </button>
          <button class="action-btn secondary" @click="toggleSqueezing">
            🌌 切換多模量子壓縮 ⇄ 八度寬譜
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
  padding: 16px;
}

.qkc-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(15, 12, 41, 0.95), rgba(8, 6, 26, 0.98));
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(129, 140, 248, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(129, 140, 248, 0.2);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 28px;
}

.title-group h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #818cf8, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.content-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(129, 140, 248, 0.2);
}

.qkc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: rgba(129, 140, 248, 0.1);
  border-color: rgba(129, 140, 248, 0.4);
}

.regime-btn.active {
  background: rgba(129, 140, 248, 0.18);
  border-color: #818cf8;
  box-shadow: 0 0 12px rgba(129, 140, 248, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-emerald { color: #34d399; }

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.slider-header .val {
  font-weight: 700;
  color: #818cf8;
}

input[type="range"] {
  width: 100%;
  accent-color: #818cf8;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(90deg, #6366f1, #a855f7);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #4f46e5, #9333ea);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(129, 140, 248, 0.3);
  color: #a5b4fc;
}

.action-btn.secondary:hover {
  background: rgba(129, 140, 248, 0.15);
}
</style>
