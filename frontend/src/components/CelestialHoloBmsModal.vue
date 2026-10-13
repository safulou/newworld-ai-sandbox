<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { celestialHoloBmsEngine, type CelestialHoloRegime } from '../engine/celestialHoloBms';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => celestialHoloBmsEngine.getState());

const isOpen = computed(() => uiStore.mode === 'celestial-bms');

const regimes: Array<{ id: CelestialHoloRegime; label: string; desc: string }> = [
  { id: 'celestial-cft-conformal-primary', label: '天球共形初級波函數', desc: '梅林變換 S-矩陣對偶與 CCFT 關聯' },
  { id: 'bms-supertranslation-memory', label: 'BMS 超平移度規剪切', desc: 'ΔC_zz 引力波永久時空幾何記憶' },
  { id: 'soft-graviton-ward-identity', label: '軟引力子瓦德恆等式', desc: '零能極限定理對偶漸近量子守恆荷' },
  { id: 'virasoro-superrotation-stress', label: '天球維拉宿共形應力', desc: '天球能量動量張量 T(z) 超旋轉對稱' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateRadius(val: number) {
  celestialHoloBmsEngine.setParameters({ asymptoticRadiusRpc: val });
}

function updateShear(val: number) {
  celestialHoloBmsEngine.setParameters({ metricShearAmplitudeDeltaC: val });
}

function updateWeight(val: number) {
  celestialHoloBmsEngine.setParameters({ celestialConformalWeightDelta: val });
}

function updateCutoff(val: number) {
  celestialHoloBmsEngine.setParameters({ softGravitonEnergyCutoffGev: val });
}

function updateSpin(val: number) {
  celestialHoloBmsEngine.setParameters({ conformalSpinJ: val });
}

function selectRegime(regime: CelestialHoloRegime) {
  celestialHoloBmsEngine.setParameters({ regime });
  achievements.unlock('celestial_holo_bms');
}

function pulseSoft() {
  celestialHoloBmsEngine.pulseSoftGraviton();
  achievements.unlock('celestial_holo_bms');
}

function rotateAngle() {
  celestialHoloBmsEngine.rotateSuperrotationAngle();
  achievements.unlock('celestial_holo_bms');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="chb-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>引力波天球全息與 BMS 漸近天線 (Celestial Holo BMS)</h2>
            <span class="subtitle">Celestial CFT S-Matrix, Soft Graviton Theorem & Supertranslation Memory</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 天球投影與四極度規剪切形變 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="chb-svg">
            <defs>
              <radialGradient id="celestialSphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
                <stop offset="70%" stop-color="#1e1b4b" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#020617" />
              </radialGradient>
              <linearGradient id="shearLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#c084fc" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
            </defs>

            <!-- 深邃太空外框 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#020617" stroke="#38bdf8" stroke-width="1.8" />

            <!-- 天球球面投影 (Celestial Sphere CS^2) -->
            <g transform="translate(270, 160)">
              <circle cx="0" cy="0" r="115" fill="url(#celestialSphereGlow)" stroke="#60a5fa" stroke-width="2" stroke-dasharray="6 4" opacity="0.8" />

              <!-- BMS 超平移度規剪切四極形變場 (Quadupolar Shear Pattern) -->
              <ellipse
                cx="0"
                cy="0"
                :rx="75 + state.metricShearAmplitudeDeltaC * 2.2"
                :ry="75 - state.metricShearAmplitudeDeltaC * 1.5"
                fill="none"
                stroke="url(#shearLineGrad)"
                stroke-width="2.5"
                :transform="`rotate(${state.celestialMetricShearAngleDeg})`"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  :from="`${state.celestialMetricShearAngleDeg} 0 0`"
                  :to="`${state.celestialMetricShearAngleDeg + 360} 0 0`"
                  dur="30s"
                  repeatCount="indefinite"
                />
              </ellipse>

              <ellipse
                cx="0"
                cy="0"
                :rx="75 - state.metricShearAmplitudeDeltaC * 1.5"
                :ry="75 + state.metricShearAmplitudeDeltaC * 2.2"
                fill="none"
                stroke="#a855f7"
                stroke-width="1.8"
                stroke-dasharray="4 4"
                opacity="0.7"
                :transform="`rotate(${state.celestialMetricShearAngleDeg + 90})`"
              />

              <!-- 天球共形緯度/經度線 -->
              <circle cx="0" cy="0" r="45" fill="none" stroke="#475569" stroke-width="0.8" opacity="0.5" />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#475569" stroke-width="0.8" opacity="0.5" />
              <line x1="-110" y1="0" x2="110" y2="0" stroke="#334155" stroke-width="1" stroke-dasharray="2 2" />
              <line x1="0" y1="-110" x2="0" y2="110" stroke="#334155" stroke-width="1" stroke-dasharray="2 2" />

              <!-- 軟引力子零能中心光點 -->
              <circle cx="0" cy="0" r="9" fill="#f8fafc" stroke="#38bdf8" stroke-width="2.5">
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            <!-- 左側天球資訊 -->
            <text x="45" y="52" fill="#38bdf8" font-size="11" font-weight="bold">
              二維天球共形場論 CCFT (自旋 J = {{ state.conformalSpinJ }})
            </text>
            <text x="45" y="70" fill="#94a3b8" font-size="10">
              漸近半徑 r = {{ state.asymptoticRadiusRpc.toFixed(1) }} kpc | 共形維度 Δ = {{ state.celestialConformalWeightDelta.toFixed(1) }}
            </text>

            <!-- 右側 BMS 記憶與軟定理指標 -->
            <text x="495" y="275" fill="#facc15" font-size="10" text-anchor="end">
              BMS 記憶剪切 ΔC = {{ state.metricShearAmplitudeDeltaC.toFixed(1) }}×10⁻²¹ | 極化角 {{ state.celestialMetricShearAngleDeg.toFixed(0) }}°
            </text>
            <text x="495" y="255" fill="#c084fc" font-size="10" text-anchor="end">
              超平移電荷 Q_f = {{ state.bmsSupertranslationChargeQ.toFixed(1) }} | 軟極點強度 {{ state.softFactorSingularityScale.toFixed(1) }}
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

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">超平移電荷 Q_f</span>
            <span class="m-val text-cyan">{{ state.bmsSupertranslationChargeQ.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">度規剪切 ΔC_zz</span>
            <span class="m-val text-rose">{{ state.metricShearAmplitudeDeltaC.toFixed(1) }}×10⁻²¹</span>
          </div>
          <div class="metric-item">
            <span class="m-label">梅林振幅強度</span>
            <span class="m-val text-purple">{{ state.mellinAmplitudeIntensity.toFixed(3) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">維拉宿中心荷 c_eff</span>
            <span class="m-val text-cyan">{{ state.virasoroCentralChargeEff.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">軟極點奇異度</span>
            <span class="m-val text-gold">{{ state.softFactorSingularityScale.toFixed(1) }} (1/ω)</span>
          </div>
          <div class="metric-item">
            <span class="m-label">剪切極化旋角</span>
            <span class="m-val text-emerald">{{ state.celestialMetricShearAngleDeg.toFixed(0) }}°</span>
          </div>
        </div>

        <!-- 參數調節面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>漸近半徑 (r, kpc)</span>
              <span class="val">{{ state.asymptoticRadiusRpc.toFixed(1) }} kpc</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="1.0"
              :value="state.asymptoticRadiusRpc"
              @input="updateRadius(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>度規剪切振幅 (ΔC_zz, 10⁻²¹)</span>
              <span class="val">{{ state.metricShearAmplitudeDeltaC.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20.0"
              step="0.1"
              :value="state.metricShearAmplitudeDeltaC"
              @input="updateShear(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>天球共形維度 (Δ = 1 + iλ)</span>
              <span class="val">{{ state.celestialConformalWeightDelta.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              :value="state.celestialConformalWeightDelta"
              @input="updateWeight(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>軟引力子紅外截斷能標 (GeV)</span>
              <span class="val">{{ state.softGravitonEnergyCutoffGev.toFixed(3) }} GeV</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="1.0"
              step="0.01"
              :value="state.softGravitonEnergyCutoffGev"
              @input="updateCutoff(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>共形自旋 (J, 整數/半整數)</span>
              <span class="val">{{ state.conformalSpinJ }}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="1"
              :value="state.conformalSpinJ"
              @input="updateSpin(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="pulseSoft">
            🌊 激發軟引力子輻射並記錄 BMS 度規剪切
          </button>
          <button class="action-btn secondary" @click="rotateAngle">
            🌀 旋轉天球維拉宿超旋轉四極極化角
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

.chb-card {
  width: 90%;
  max-width: 680px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(20, 24, 60, 0.9));
  border: 1px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px 24px;
  background: rgba(20, 24, 60, 0.6);
  border-bottom: 1px solid rgba(56, 189, 248, 0.3);
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
  color: #f0f9ff;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.75rem;
  color: #7dd3fc;
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

.chb-svg {
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
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.regime-btn:hover {
  border-color: rgba(56, 189, 248, 0.5);
  background: rgba(20, 24, 60, 0.4);
}

.regime-btn.active {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(168, 85, 247, 0.25));
  border-color: #38bdf8;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
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

.text-cyan {
  color: #38bdf8;
}

.text-rose {
  color: #fb7185;
}

.text-purple {
  color: #c084fc;
}

.text-gold {
  color: #facc15;
}

.text-emerald {
  color: #34d399;
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
  color: #38bdf8;
  font-family: monospace;
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: #38bdf8;
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
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.5);
}

.action-btn.secondary {
  background: rgba(20, 24, 60, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #e0f2fe;
}

.action-btn.secondary:hover {
  background: rgba(30, 41, 80, 0.8);
  border-color: rgba(56, 189, 248, 0.6);
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
