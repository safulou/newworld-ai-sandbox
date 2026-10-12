<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { axionInsulatorResonatorEngine, type AxionInsulatorRegime } from '../engine/axionInsulatorResonator';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => axionInsulatorResonatorEngine.getState());

const isOpen = computed(() => uiStore.mode === 'axion-insulator');

const regimes: Array<{ id: AxionInsulatorRegime; label: string; desc: string }> = [
  { id: 'quantized-tme-theta-pi', label: '量子化磁電態 (θ=π)', desc: '精確量子化軸子電動力學響應' },
  { id: 'axion-polariton-hybrid', label: '軸子極化激元相', desc: '微波光子-反鐵磁磁振子強耦合' },
  { id: 'surface-half-hall-chiral', label: '相反表面半霍爾', desc: '上下表面 ±1/2 e²/h 手性傳導' },
  { id: 'canted-antiferro-crossover', label: '外場傾斜反鐵磁', desc: '自旋傾斜相變與對稱性交叉' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateLayers(val: number) {
  axionInsulatorResonatorEngine.setParameters({ sampleLayerCount: val });
}

function updateExchange(val: number) {
  axionInsulatorResonatorEngine.setParameters({ magneticExchangeEnergyMev: val });
}

function updateCavityFreq(val: number) {
  axionInsulatorResonatorEngine.setParameters({ cavityResonanceGhz: val });
}

function updateMagBias(val: number) {
  axionInsulatorResonatorEngine.setParameters({ externalMagneticBiasTesla: val });
}

function updateTemp(val: number) {
  axionInsulatorResonatorEngine.setParameters({ temperatureKelvin: val });
}

function selectRegime(regime: AxionInsulatorRegime) {
  axionInsulatorResonatorEngine.setParameters({ regime });
  achievements.unlock('axion_insulator_resonator');
}

function triggerAxionPulse() {
  axionInsulatorResonatorEngine.pumpDynamicalAxionWave();
  achievements.unlock('axion_insulator_resonator');
}

function triggerLayerStep() {
  axionInsulatorResonatorEngine.toggleLayerParity();
  achievements.unlock('axion_insulator_resonator');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="axion-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧲</span>
          <h2>動態軸子絕緣體諧振腔 (Axion Insulator Resonator)</h2>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 反鐵磁層狀幾何、法拉第光束偏轉與軸子極化激元波 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="axion-svg">
            <defs>
              <linearGradient id="layerGradUp" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#0ea5e9" />
              </linearGradient>
              <linearGradient id="layerGradDown" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#e11d48" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>

            <!-- 視圖背景 -->
            <rect x="25" y="20" width="490" height="280" rx="14" fill="#030712" stroke="#1f2937" stroke-width="2" />

            <!-- 左側反鐵磁偶數層堆疊 (Layer Stack) -->
            <g transform="translate(60, 50)">
              <template v-for="l in state.sampleLayerCount" :key="'layer-' + l">
                <!-- 單層板 -->
                <rect
                  :x="0"
                  :y="(l - 1) * (180 / state.sampleLayerCount)"
                  width="180"
                  :height="(150 / state.sampleLayerCount)"
                  rx="4"
                  :fill="l % 2 === 1 ? 'url(#layerGradUp)' : 'url(#layerGradDown)'"
                  opacity="0.85"
                />
                <!-- 自旋箭頭指示 -->
                <text
                  :x="90"
                  :y="(l - 1) * (180 / state.sampleLayerCount) + (110 / state.sampleLayerCount)"
                  fill="#ffffff"
                  font-size="11"
                  font-weight="bold"
                  text-anchor="middle"
                >
                  {{ l % 2 === 1 ? '↑ S_z (+M)' : '↓ S_z (-M)' }}
                </text>
              </template>

              <!-- 上表面與下表面量子霍爾半態標註 -->
              <text x="90" y="-8" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">
                上表面: σ_xy = +1/2 e²/h
              </text>
              <text x="90" y="200" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="middle">
                下表面: σ_xy = -1/2 e²/h
              </text>
            </g>

            <!-- 右側微波諧振腔與動態法拉第偏轉光束 -->
            <g transform="translate(300, 40)">
              <rect x="0" y="20" width="190" height="180" rx="12" fill="#0b132b" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 4" />
              <text x="95" y="45" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">微波軸子極化腔</text>

              <!-- 入射光與透射法拉第旋轉光束 -->
              <line x1="-30" y1="110" x2="30" y2="110" stroke="#fcd34d" stroke-width="3" />
              <text x="-10" y="98" fill="#fcd34d" font-size="10">入射光 E_0</text>

              <!-- 腔內動態軸子波擾動 -->
              <path
                d="M 30,110 Q 75,70 120,110 T 170,110"
                fill="none"
                stroke="url(#beamGrad)"
                stroke-width="3"
              >
                <animate attributeName="stroke-dashoffset" values="0;40" dur="1.5s" repeatCount="indefinite" />
              </path>

              <!-- 旋轉出射角度標記 -->
              <line x1="170" y1="110" x2="215" y2="92" stroke="#a855f7" stroke-width="3" />
              <text x="145" y="80" fill="#c084fc" font-size="10" font-weight="bold">
                θ_F = {{ state.faradayRotationAngleDeg.toFixed(3) }}°
              </text>
              <text x="95" y="180" fill="#a855f7" font-size="11" text-anchor="middle">
                拉比劈裂 Ω_R = {{ state.axionPolaritonRabiSplitGhz.toFixed(1) }} GHz
              </text>
            </g>

            <!-- 底部核心公式說明 -->
            <text x="60" y="275" fill="#94a3b8" font-size="11">
              體態軸子角 θ = {{ state.quantizedThetaRad.toFixed(3) }} rad (≈ π) | 磁電響應 α_tme = {{ state.magnetoelectricResponseAlpha.toFixed(3) }} α
            </text>
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
            <span class="m-label">軸子拓撲角 θ</span>
            <span class="m-val text-cyan">{{ state.quantizedThetaRad.toFixed(3) }} rad</span>
          </div>
          <div class="metric-item">
            <span class="m-label">磁電響應 α_tme</span>
            <span class="m-val text-amber">{{ state.magnetoelectricResponseAlpha.toFixed(3) }} α</span>
          </div>
          <div class="metric-item">
            <span class="m-label">法拉第旋轉 θ_F</span>
            <span class="m-val text-purple">{{ state.faradayRotationAngleDeg.toFixed(3) }}°</span>
          </div>
          <div class="metric-item">
            <span class="m-label">極化激元劈裂</span>
            <span class="m-val">{{ state.axionPolaritonRabiSplitGhz.toFixed(2) }} GHz</span>
          </div>
          <div class="metric-item">
            <span class="m-label">表面狄拉克能隙</span>
            <span class="m-val">{{ state.surfaceDiracGapMev.toFixed(1) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">反常克爾角 θ_K</span>
            <span class="m-val text-cyan">{{ state.kerrRotationAngleDeg.toFixed(1) }}°</span>
          </div>
        </div>

        <!-- 物理參數調控滑桿 -->
        <div class="slider-controls">
          <div class="control-row">
            <label>反鐵磁偶數層數 N: {{ state.sampleLayerCount }} 層</label>
            <input
              type="range"
              min="2"
              max="12"
              step="2"
              :value="state.sampleLayerCount"
              @input="updateLayers(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>磁交換能 J_ex: {{ state.magneticExchangeEnergyMev.toFixed(1) }} meV</label>
            <input
              type="range"
              min="5.0"
              max="40.0"
              step="0.5"
              :value="state.magneticExchangeEnergyMev"
              @input="updateExchange(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>諧振腔頻率 f_cav: {{ state.cavityResonanceGhz.toFixed(1) }} GHz</label>
            <input
              type="range"
              min="10.0"
              max="120.0"
              step="1.0"
              :value="state.cavityResonanceGhz"
              @input="updateCavityFreq(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>外加偏壓磁場 B_ext: {{ state.externalMagneticBiasTesla.toFixed(1) }} T</label>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.1"
              :value="state.externalMagneticBiasTesla"
              @input="updateMagBias(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>操作溫度 T: {{ state.temperatureKelvin.toFixed(2) }} K</label>
            <input
              type="range"
              min="0.01"
              max="30.0"
              step="0.1"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 診斷動作列 -->
        <div class="action-footer">
          <button class="action-btn purple" @click="triggerAxionPulse">
            ⚡ 激發動態軸子極化波
          </button>
          <button class="action-btn amber" @click="triggerLayerStep">
            🔄 切換層數宇稱 (N+2)
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

.axion-card {
  width: 620px;
  max-width: 95vw;
  background: #090e17;
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(168, 85, 247, 0.2), 0 20px 45px rgba(0, 0, 0, 0.9);
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
  color: #c084fc;
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
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.axion-svg {
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
  border-color: #c084fc;
  background: #201138;
}

.regime-btn.active {
  background: rgba(168, 85, 247, 0.18);
  border-color: #a855f7;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.35);
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

.text-amber {
  color: #fbbf24;
}

.text-purple {
  color: #c084fc;
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
  accent-color: #a855f7;
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

.action-btn.purple {
  background: rgba(168, 85, 247, 0.15);
  border-color: #a855f7;
  color: #c084fc;
}

.action-btn.purple:hover {
  background: rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
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
