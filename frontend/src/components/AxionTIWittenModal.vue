<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { axionTIWittenEngine, type WittenEffectRegime } from '../engine/axionTIWittenEffect';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => axionTIWittenEngine.getState());

const isOpen = computed(() => uiStore.mode === 'axion-ti-witten');

const regimes: Array<{ id: WittenEffectRegime; label: string; desc: string }> = [
  { id: 'witten-effect-fractional-dyon', label: '維騰效應半整數分數二元荷相', desc: '狄拉克磁單極子在 θ=π 拓撲絕緣體中感應出精確 q=±e/2 半整數電荷，成為二元荷 (Dyon)' },
  { id: 'topological-magnetoelectric-polarization', label: '拓撲磁電交叉極化相 (TME)', desc: '外加電場激發同向磁化 (M ∝ E)，外加磁場激發同向電極化 (P ∝ B)，耦合係數由精細結構常數 α 鎖定' },
  { id: 'time-reversal-broken-half-hall', label: '時間反演破缺半整數量子霍爾相', desc: '表面磁化薄膜破缺時間反演打開狄拉克能隙，展現未配對 σ_xy = (1/2) e²/h 半整數霍爾電導' },
  { id: 'axion-domain-wall-chiral-edge', label: '軸子疇壁手性無耗散邊界態相', desc: 'θ 角在空間發生 2π 躍變之軸子疇壁，湧現單向手性拓撲導電通道' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTheta(val: number) {
  axionTIWittenEngine.setAxionVacuumTheta(val);
  achievements.unlock('axion_ti_witten_effect');
}

function updateElectric(val: number) {
  const diff = val - state.value.appliedElectricFieldVPerM;
  axionTIWittenEngine.pulseElectricField(diff);
  achievements.unlock('axion_ti_witten_effect');
}

function updateMagnetic(val: number) {
  const diff = val - state.value.appliedMagneticFieldTesla;
  axionTIWittenEngine.rampMagneticField(diff);
  achievements.unlock('axion_ti_witten_effect');
}

function pulseE() {
  axionTIWittenEngine.pulseElectricField(3.0);
  achievements.unlock('axion_ti_witten_effect');
}

function rampB() {
  axionTIWittenEngine.rampMagneticField(1.0);
  achievements.unlock('axion_ti_witten_effect');
}

function breakTR() {
  axionTIWittenEngine.breakTimeReversalGap(5.0);
  achievements.unlock('axion_ti_witten_effect');
}

function reset() {
  axionTIWittenEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="witten-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧲</span>
          <div>
            <h2>三維拓撲絕緣體軸子電動力學與維騰效應 (Axion TI & Witten Effect)</h2>
            <span class="subtitle">Topological θ-Term, Fractional Monopole Charge q = e/2, TME & Half-Integer Hall</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 軸子磁單極子與拓撲二元荷電雲 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="witten-svg">
            <defs>
              <radialGradient id="dyonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1.0" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="monopoleFieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ec4899" />
                <stop offset="50%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
            </defs>

            <!-- 晶片底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#0ea5e9" stroke-width="1.6" />

            <!-- 左側：3D TI 介質與嵌入狄拉克磁單極子 (Dyon) -->
            <g transform="translate(150, 150)">
              <!-- 拓撲絕緣體塊體框 -->
              <rect x="-80" y="-80" width="160" height="160" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2" opacity="0.6" />

              <!-- 表面半整數量子霍爾邊緣手性通道 -->
              <rect x="-70" y="-70" width="140" height="140" rx="10" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="5 3" />

              <!-- 維騰效應半電荷電雲 q = e/2 (以 inducedMonopoleChargeFractionalE 縮放) -->
              <circle cx="0" cy="0" :r="25 + state.inducedMonopoleChargeFractionalE * 60" fill="url(#dyonGlow)">
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
              </circle>

              <!-- 磁單極子輻射力線 -->
              <g stroke="#38bdf8" stroke-width="1.2" opacity="0.7">
                <line x1="0" y1="0" x2="-45" y2="-45" stroke-dasharray="3 2" />
                <line x1="0" y1="0" x2="45" y2="-45" stroke-dasharray="3 2" />
                <line x1="0" y1="0" x2="45" y2="45" stroke-dasharray="3 2" />
                <line x1="0" y1="0" x2="-45" y2="45" stroke-dasharray="3 2" />
                <line x1="0" y1="0" x2="0" y2="-55" />
                <line x1="0" y1="0" x2="0" y2="55" />
                <line x1="0" y1="0" x2="-55" y2="0" />
                <line x1="0" y1="0" x2="55" y2="0" />
              </g>

              <!-- 中心磁單極子核心 (g = 2π/e) -->
              <circle cx="0" cy="0" r="14" fill="#0284c7" stroke="#fff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">
                {{ state.inducedMonopoleChargeFractionalE.toFixed(2) }} e
              </text>
            </g>

            <!-- 右側：拓撲磁電效應 (TME) 極化與表面霍爾儀表 -->
            <g transform="translate(300, 60)">
              <rect x="0" y="0" width="200" height="180" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">拓撲磁電響應向量 (TME)</text>
              <line x1="14" y1="32" x2="186" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">電極化強度 P ∝ B:</text>
              <text x="14" y="75" fill="#fbbf24" font-size="13" font-weight="bold">{{ state.magnetoelectricPolarizationPE10 }} ×10⁻¹⁰ C/m²</text>

              <text x="14" y="105" fill="#94a3b8" font-size="10">磁化強度 M ∝ E:</text>
              <text x="14" y="125" fill="#38bdf8" font-size="13" font-weight="bold">{{ state.topologicalMagnetizationM }} A/m</text>

              <text x="14" y="152" fill="#94a3b8" font-size="10">表面霍爾電導 σ_xy:</text>
              <text x="14" y="170" fill="#ec4899" font-size="13" font-weight="bold">{{ state.surfaceHallConductanceUnitsE2H }} e²/h (半整數)</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 35)">
              <rect x="0" y="0" width="230" height="30" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#0ea5e9" stroke-width="1" />
              <text x="12" y="19" fill="#38bdf8" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">感應單極子電荷 (q)</span>
            <span class="m-val highlight">{{ state.inducedMonopoleChargeFractionalE }} e</span>
            <span class="m-sub">維騰效應半整數二元荷</span>
          </div>

          <div class="metric-card">
            <span class="m-label">軸子真空角 (θ)</span>
            <span class="m-val accent">{{ state.axionAngleThetaRad.toFixed(3) }} rad</span>
            <span class="m-sub">時間反演不變量 θ=π</span>
          </div>

          <div class="metric-card">
            <span class="m-label">拓撲電極化 (P)</span>
            <span class="m-val">{{ state.magnetoelectricPolarizationPE10 }} ×10⁻¹⁰</span>
            <span class="m-sub">外加磁場 B 誘發電極化</span>
          </div>

          <div class="metric-card">
            <span class="m-label">拓撲磁化強度 (M)</span>
            <span class="m-val">{{ state.topologicalMagnetizationM }} A/m</span>
            <span class="m-sub">外加電場 E 誘發磁化</span>
          </div>

          <div class="metric-card">
            <span class="m-label">表面霍爾電導 (σ_xy)</span>
            <span class="m-val">{{ state.surfaceHallConductanceUnitsE2H }} e²/h</span>
            <span class="m-sub">狄拉克表面未配對半整數態</span>
          </div>

          <div class="metric-card">
            <span class="m-label">表面磁能隙 (Δ_m)</span>
            <span class="m-val">{{ state.surfaceMagneticGapDeltaMev }} meV</span>
            <span class="m-sub">破缺時間反演表面鍍膜</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>軸子真空角 θ (0.0 ~ 6.28 rad): <b>{{ state.axionAngleThetaRad.toFixed(3) }} rad</b> (π = 3.142)</label>
              <input
                type="range"
                min="0.0"
                max="6.283"
                step="0.05"
                :value="state.axionAngleThetaRad"
                @input="updateTheta(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>外加電場 E (0.1 ~ 30.0 ×10⁴ V/m): <b>{{ state.appliedElectricFieldVPerM }}</b></label>
              <input
                type="range"
                min="0.1"
                max="30.0"
                step="0.5"
                :value="state.appliedElectricFieldVPerM"
                @input="updateElectric(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>外加磁場 B (0.05 ~ 12.0 T): <b>{{ state.appliedMagneticFieldTesla }} T</b></label>
              <input
                type="range"
                min="0.05"
                max="12.0"
                step="0.2"
                :value="state.appliedMagneticFieldTesla"
                @input="updateMagnetic(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="pulseE">
              ⚡ 注入脈衝電場 (+3)
            </button>
            <button class="action-btn cyan" @click="rampB">
              🧲 斜坡增強磁場 (+1 T)
            </button>
            <button class="action-btn secondary" @click="breakTR">
              🛡️ 破缺表面時間反演能隙 (+5 meV)
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

.witten-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(14, 165, 233, 0.35);
  box-shadow: 0 0 35px rgba(14, 165, 233, 0.25);
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

.witten-svg {
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
  border: 1px solid rgba(14, 165, 233, 0.2);
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
  accent-color: #0ea5e9;
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

.action-btn.cyan {
  background: #0d9488;
  color: #fff;
}
.action-btn.cyan:hover {
  background: #0f766e;
}

.action-btn.secondary {
  background: rgba(236, 72, 153, 0.15);
  color: #ec4899;
  border-color: rgba(236, 72, 153, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(236, 72, 153, 0.25);
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
