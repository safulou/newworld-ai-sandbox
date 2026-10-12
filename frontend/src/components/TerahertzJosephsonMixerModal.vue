<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { terahertzJosephsonMixerEngine, type JosephsonMixerRegime } from '../engine/terahertzJosephsonMixer';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => terahertzJosephsonMixerEngine.getState());

const isOpen = computed(() => uiStore.mode === 'thz-josephson');

const regimes: Array<{ id: JosephsonMixerRegime; label: string; desc: string }> = [
  { id: 'squeezed-vacuum-tmsv', label: '雙模微波壓縮', desc: '低於真空量子噪聲極限 (SQL)' },
  { id: 'shapiro-phase-lock', label: '夏皮羅量子階躍', desc: '整數量子化微波鎖相台階 (V_n)' },
  { id: 'parametric-four-wave-mix', label: '四波混頻放大', desc: '約瑟夫森非線性電感寬頻放大' },
  { id: 'quantum-noise-limited-detector', label: '太赫茲極限探測', desc: '超導超快相干混頻外差接收' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateVoltage(val: number) {
  terahertzJosephsonMixerEngine.setParameters({ biasVoltageMilliVolt: val });
}

function updatePumpFreq(val: number) {
  terahertzJosephsonMixerEngine.setParameters({ rfPumpFrequencyThz: val });
}

function updateCriticalCurrent(val: number) {
  terahertzJosephsonMixerEngine.setParameters({ junctionCriticalCurrentMicroAmp: val });
}

function updateTemp(val: number) {
  terahertzJosephsonMixerEngine.setParameters({ temperatureKelvin: val });
}

function selectRegime(regime: JosephsonMixerRegime) {
  terahertzJosephsonMixerEngine.setParameters({ regime });
  achievements.unlock('terahertz_josephson_mixer');
}

function triggerParametricPump() {
  terahertzJosephsonMixerEngine.pulseParametricPump();
  achievements.unlock('terahertz_josephson_mixer');
}

function triggerShapiroStep() {
  terahertzJosephsonMixerEngine.stepShapiroHarmonic();
  achievements.unlock('terahertz_josephson_mixer');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="josephson-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">📻</span>
          <h2>太赫茲約瑟夫森量子混頻器 (THz Josephson Mixer)</h2>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 約瑟夫森結、夏皮羅階梯與雙模壓縮相空間橢圓 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="josephson-svg">
            <defs>
              <linearGradient id="scLeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
              <radialGradient id="squeezedGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#881337" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 視圖背景 -->
            <rect x="25" y="20" width="490" height="280" rx="14" fill="#030712" stroke="#1f2937" stroke-width="2" />

            <!-- 左側超導電極與右側超導電極 (SIS 結構) -->
            <rect x="45" y="60" width="110" height="90" rx="8" fill="url(#scLeadGrad)" opacity="0.8" />
            <rect x="175" y="60" width="110" height="90" rx="8" fill="url(#scLeadGrad)" opacity="0.8" />
            <!-- 中間奈米絕緣勢壘 (Barrier) -->
            <rect x="155" y="55" width="20" height="100" rx="3" fill="#fbbf24" opacity="0.9" />
            <text x="100" y="110" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">超導體 S_1</text>
            <text x="230" y="110" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">超導體 S_2</text>
            <text x="165" y="45" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">勢壘 d~2nm</text>

            <!-- 交流庫珀對隧穿相位波 -->
            <path
              d="M 60,195 Q 115,165 165,195 T 270,195"
              fill="none"
              stroke="#00ffff"
              stroke-width="2.5"
            >
              <animate attributeName="d" values="M 60,195 Q 115,165 165,195 T 270,195; M 60,195 Q 115,225 165,195 T 270,195; M 60,195 Q 115,165 165,195 T 270,195" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="60" y="225" fill="#38bdf8" font-size="11">超導相位振盪 f_J = {{ state.josephsonFrequencyThz.toFixed(2) }} THz</text>

            <!-- 右側相空間：雙模微波壓縮橢圓 (TMSV Phase Space) -->
            <g transform="translate(400, 110)">
              <!-- 真空漲落圓形 (SQL 基準) -->
              <circle cx="0" cy="0" r="50" fill="none" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 4" />
              <!-- 壓縮發光 -->
              <ellipse cx="0" cy="0" rx="18" ry="65" fill="url(#squeezedGlow)" transform="rotate(-35)" />
              <!-- 壓縮狀態相空間輪廓 -->
              <ellipse cx="0" cy="0" rx="18" ry="65" fill="none" stroke="#f43f5e" stroke-width="2.5" transform="rotate(-35)" />
              <!-- 座標軸 -->
              <line x1="-60" y1="0" x2="60" y2="0" stroke="#6b7280" stroke-width="1" />
              <line x1="0" y1="-60" x2="0" y2="60" stroke="#6b7280" stroke-width="1" />
              <text x="0" y="75" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">
                壓縮度 {{ state.squeezingFactorDb.toFixed(1) }} dB
              </text>
            </g>

            <!-- 下方夏皮羅階梯 I-V 示意 -->
            <g transform="translate(60, 245)">
              <text x="0" y="25" fill="#fbbf24" font-size="11" font-weight="bold">
                夏皮羅階數 n = {{ state.shapiroStepOrderN }} ➔ 台階電壓 V_n = {{ state.shapiroStepVoltageMv.toFixed(2) }} mV
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

        <!-- 即時物理指標儀表板 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">約瑟夫森頻率 f_J</span>
            <span class="m-val text-cyan">{{ state.josephsonFrequencyThz.toFixed(3) }} THz</span>
          </div>
          <div class="metric-item">
            <span class="m-label">雙模壓縮度 S</span>
            <span class="m-val text-rose">{{ state.squeezingFactorDb.toFixed(1) }} dB</span>
          </div>
          <div class="metric-item">
            <span class="m-label">夏皮羅台階 V_n</span>
            <span class="m-val text-amber">{{ state.shapiroStepVoltageMv.toFixed(2) }} mV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">量子效率 η</span>
            <span class="m-val">{{ state.quantumEfficiencyPct.toFixed(1) }} %</span>
          </div>
          <div class="metric-item">
            <span class="m-label">相位抖動 Δt</span>
            <span class="m-val">{{ state.phaseJitterFemtosec.toFixed(1) }} fs</span>
          </div>
          <div class="metric-item">
            <span class="m-label">混頻增益 G</span>
            <span class="m-val text-cyan">{{ state.convertedMixerGainDb.toFixed(1) }} dB</span>
          </div>
        </div>

        <!-- 物理參數調控滑桿 -->
        <div class="slider-controls">
          <div class="control-row">
            <label>直流偏壓 V_dc: {{ state.biasVoltageMilliVolt.toFixed(2) }} mV</label>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.05"
              :value="state.biasVoltageMilliVolt"
              @input="updateVoltage(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>太赫茲幫浦頻率 f_pump: {{ state.rfPumpFrequencyThz.toFixed(2) }} THz</label>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.05"
              :value="state.rfPumpFrequencyThz"
              @input="updatePumpFreq(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>約瑟夫森臨界電流 I_c: {{ state.junctionCriticalCurrentMicroAmp.toFixed(0) }} μA</label>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              :value="state.junctionCriticalCurrentMicroAmp"
              @input="updateCriticalCurrent(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>操作結溫 T: {{ state.temperatureKelvin.toFixed(2) }} K</label>
            <input
              type="range"
              min="0.01"
              max="9.0"
              step="0.05"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 診斷動作列 -->
        <div class="action-footer">
          <button class="action-btn rose" @click="triggerParametricPump">
            📡 注入參量放大幫浦
          </button>
          <button class="action-btn amber" @click="triggerShapiroStep">
            ⚡ 遞增夏皮羅諧波台階 (n)
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
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.josephson-card {
  width: 620px;
  max-width: 95vw;
  background: #090e17;
  border: 1px solid rgba(244, 63, 94, 0.35);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(244, 63, 94, 0.2), 0 20px 45px rgba(0, 0, 0, 0.9);
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 24px;
}

.title-group h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #f43f5e;
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #03080f;
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.josephson-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.regime-btn {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #f43f5e;
  background: #1e1124;
}

.regime-btn.active {
  background: rgba(244, 63, 94, 0.18);
  border-color: #f43f5e;
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.35);
}

.regime-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.regime-desc {
  font-size: 11px;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 11px;
  color: #64748b;
}

.m-val {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.text-cyan {
  color: #38bdf8;
}

.text-rose {
  color: #fb7185;
}

.text-amber {
  color: #fbbf24;
}

.slider-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  padding: 12px;
  border-radius: 12px;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-row label {
  font-size: 12px;
  color: #94a3b8;
}

.control-row input[type='range'] {
  width: 100%;
  accent-color: #f43f5e;
}

.action-footer {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.rose {
  background: rgba(244, 63, 94, 0.15);
  border-color: #f43f5e;
  color: #fb7185;
}

.action-btn.rose:hover {
  background: rgba(244, 63, 94, 0.3);
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.4);
}

.action-btn.amber {
  background: rgba(251, 191, 36, 0.15);
  border-color: #fbbf24;
  color: #fcd34d;
}

.action-btn.amber:hover {
  background: rgba(251, 191, 36, 0.3);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}
</style>
