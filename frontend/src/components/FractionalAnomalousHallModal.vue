<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { fractionalAnomalousHallEngine, type FQAHRegime } from '../engine/fractionalAnomalousHall';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => fractionalAnomalousHallEngine.getState());

const isOpen = computed(() => uiStore.mode === 'fractional-hall');

const regimes: Array<{ id: FQAHRegime; label: string; desc: string }> = [
  { id: 'fractional-anyon-laughlin', label: 'Laughlin 任意子態', desc: '分數量子化階躍 (ν = -2/3, -1/3)' },
  { id: 'composite-fermi-liquid', label: '複合費米液體', desc: '零磁場費米面幾何金屬相' },
  { id: 'non-abelian-moore-read', label: 'Moore-Read 普法芬', desc: '非阿貝爾分數量子霍爾態 (ν = -5/2)' },
  { id: 'wigner-crystal-charge-order', label: '維格納電荷晶體', desc: '超晶格電荷局域化絕緣態' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTwist(val: number) {
  fractionalAnomalousHallEngine.setParameters({ moiréTwistAngleDeg: val });
}

function updateDisplacement(val: number) {
  fractionalAnomalousHallEngine.setParameters({ displacementFieldMvNm: val });
}

function updateInteraction(val: number) {
  fractionalAnomalousHallEngine.setParameters({ interactionStrengthUOverW: val });
}

function updateTemp(val: number) {
  fractionalAnomalousHallEngine.setParameters({ temperatureKelvin: val });
}

function selectRegime(regime: FQAHRegime) {
  fractionalAnomalousHallEngine.setParameters({ regime });
  achievements.unlock('fractional_anomalous_hall');
}

function injectAnyon() {
  fractionalAnomalousHallEngine.injectLaughlinQuasiParticle();
  achievements.unlock('fractional_anomalous_hall');
}

function cycleFraction() {
  fractionalAnomalousHallEngine.cycleFillingFraction();
  achievements.unlock('fractional_anomalous_hall');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="fqah-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚛️</span>
          <h2>量子反常分數霍爾反應堆 (FQAH Moiré Reactor)</h2>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 莫爾超晶格與分數任意子手性邊界流 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="fqah-svg">
            <defs>
              <radialGradient id="moiréGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#00ffcc" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#001a26" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00ffcc" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>

            <!-- 莫爾晶格幾何底紋 -->
            <rect x="30" y="25" width="480" height="270" rx="16" fill="#040c14" stroke="#1e293b" stroke-width="2" />
            <circle cx="270" cy="160" r="130" fill="url(#moiréGlow)" />

            <!-- 莫爾超晶格干涉陣列 -->
            <g opacity="0.6">
              <template v-for="i in 9" :key="'row-' + i">
                <template v-for="j in 15" :key="'dot-' + i + '-' + j">
                  <circle
                    :cx="45 + j * 30 + ((i % 2) * 15)"
                    :cy="40 + i * 26"
                    :r="Math.sin((i * 0.7 + j * 0.9) * (state.moiréTwistAngleDeg / 2.0)) * 3.5 + 4.5"
                    :fill="(i + j) % 3 === 0 ? '#38bdf8' : '#00ffcc'"
                    :opacity="0.4 + 0.5 * Math.sin(j * 0.5 + i * 0.4)"
                  />
                </template>
              </template>
            </g>

            <!-- Laughlin 分數電荷任意子激發斑點 -->
            <g>
              <circle cx="220" cy="140" r="16" fill="#a855f7" opacity="0.3" />
              <circle cx="220" cy="140" r="8" fill="#e879f9" />
              <text x="220" y="144" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">e/3</text>

              <circle cx="320" cy="170" r="16" fill="#a855f7" opacity="0.3" />
              <circle cx="320" cy="170" r="8" fill="#e879f9" />
              <text x="320" y="174" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">e/3</text>

              <circle cx="270" cy="200" r="14" fill="#06b6d4" opacity="0.3" />
              <circle cx="270" cy="200" r="7" fill="#22d3ee" />
              <text x="270" y="204" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">e*</text>
            </g>

            <!-- 無耗散手性邊界電流環 (Chiral Edge Flow) -->
            <rect
              x="50"
              y="40"
              width="440"
              height="240"
              rx="12"
              fill="none"
              stroke="url(#edgeGrad)"
              stroke-width="3"
              stroke-dasharray="12 8"
            >
              <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite" />
            </rect>

            <!-- 標註文字 -->
            <text x="65" y="65" fill="#38bdf8" font-size="12" font-weight="bold">手性邊緣流 J_edge (無外加磁場)</text>
            <text x="475" y="265" fill="#a855f7" font-size="11" text-anchor="end">
              ν = {{ state.fillingFactorNu.toFixed(3) }} (σ_xy = {{ state.fractionalConductanceE2H.toFixed(3) }} e²/h)
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
            <span class="m-label">霍爾電導 σ_xy</span>
            <span class="m-val text-cyan">{{ state.fractionalConductanceE2H.toFixed(3) }} e²/h</span>
          </div>
          <div class="metric-item">
            <span class="m-label">準粒子電荷 e*</span>
            <span class="m-val text-purple">{{ (state.quasiParticleChargeFraction).toFixed(3) }} e</span>
          </div>
          <div class="metric-item">
            <span class="m-label">拓撲能隙 Δ_FQAH</span>
            <span class="m-val text-emerald">{{ state.topologicalGapMev.toFixed(2) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">貝里均勻係數</span>
            <span class="m-val">{{ state.berryCurvatureUniformity.toFixed(2) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">量子度規 det(g)</span>
            <span class="m-val">{{ state.quantumMetricDeterminant.toFixed(2) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">無耗散邊界電流</span>
            <span class="m-val text-cyan">{{ state.chiralEdgeCurrentNanoAmp.toFixed(1) }} nA</span>
          </div>
        </div>

        <!-- 物理參數調控滑桿 -->
        <div class="slider-controls">
          <div class="control-row">
            <label>莫爾扭轉角 θ: {{ state.moiréTwistAngleDeg.toFixed(2) }}°</label>
            <input
              type="range"
              min="1.2"
              max="4.5"
              step="0.05"
              :value="state.moiréTwistAngleDeg"
              @input="updateTwist(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>垂直位移電場 D: {{ state.displacementFieldMvNm.toFixed(1) }} mV/nm</label>
            <input
              type="range"
              min="0.0"
              max="50.0"
              step="0.5"
              :value="state.displacementFieldMvNm"
              @input="updateDisplacement(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>庫侖作用比 U/W: {{ state.interactionStrengthUOverW.toFixed(1) }}</label>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.2"
              :value="state.interactionStrengthUOverW"
              @input="updateInteraction(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <label>操作溫度 T: {{ state.temperatureKelvin.toFixed(2) }} K</label>
            <input
              type="range"
              min="0.01"
              max="10.0"
              step="0.05"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 診斷動作列 -->
        <div class="action-footer">
          <button class="action-btn cyan" @click="injectAnyon">
            ⚡ 激發 Laughlin 任意子
          </button>
          <button class="action-btn purple" @click="cycleFraction">
            🔄 切換分數填充階躍 (ν)
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

.fqah-card {
  width: 620px;
  max-width: 95vw;
  background: #090e17;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(56, 189, 248, 0.2), 0 20px 45px rgba(0, 0, 0, 0.9);
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
  color: #38bdf8;
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
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.fqah-svg {
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
  border-color: #38bdf8;
  background: #172554;
}

.regime-btn.active {
  background: rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.35);
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

.text-purple {
  color: #c084fc;
}

.text-emerald {
  color: #34d399;
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
  accent-color: #38bdf8;
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

.action-btn.cyan {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #38bdf8;
}

.action-btn.cyan:hover {
  background: rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
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
</style>
