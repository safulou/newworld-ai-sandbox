<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { repulsiveCasimirEngine, type CasimirMotorRegime } from '../engine/repulsiveCasimirMotor';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => repulsiveCasimirEngine.getState());

const isOpen = computed(() => uiStore.mode === 'repulsive-casimir');

const regimes: Array<{ id: CasimirMotorRegime; label: string; desc: string }> = [
  { id: 'quantum-repulsive-levitation', label: '斥力量子懸浮', desc: '里夫席茲自由能反轉 F_C > 0 零接觸懸浮' },
  { id: 'topological-torque-motor', label: '真空扭矩馬達', desc: '各向異性主軸誘導持續旋轉力矩' },
  { id: 'zero-stiction-nanogap', label: '零靜黏滯超滑態', desc: '徹底消除奈米微機電 Stiction 故障' },
  { id: 'lifshitz-crossover-balance', label: '引斥零平衡點', desc: '外載重力與量子斥力精確抵消' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateGap(val: number) {
  repulsiveCasimirEngine.setParameters({ cavitySeparationNm: val });
}

function updateTheta(val: number) {
  repulsiveCasimirEngine.setParameters({ topologicalThetaAngleRad: val });
}

function updateKappa(val: number) {
  repulsiveCasimirEngine.setParameters({ chiralPolarizationDegree: val });
}

function updatePhi(val: number) {
  repulsiveCasimirEngine.setParameters({ rotorAngularOffsetDeg: val });
}

function selectRegime(regime: CasimirMotorRegime) {
  repulsiveCasimirEngine.setParameters({ regime });
  achievements.unlock('repulsive_casimir_motor');
}

function boostTorque() {
  repulsiveCasimirEngine.pulseTorqueBoost();
  achievements.unlock('repulsive_casimir_motor');
}

function tuneEquilibrium() {
  repulsiveCasimirEngine.tuneToEquilibriumGap();
  achievements.unlock('repulsive_casimir_motor');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="casimir-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">⚙️</span>
          <div>
            <h2>手性超材料動態拓撲卡西米爾斥力發電機</h2>
            <p class="subtitle">Chiral Metamaterial Topological Repulsive Casimir-Lifshitz Levitation Motor</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 量子真空微腔與懸浮轉子視覺化 -->
        <section class="visualizer-card">
          <div class="vis-header">
            <h3>手性超材料平板、真空斥力場 (F_C > 0) 與奈米轉子</h3>
            <span class="badge" :class="state.isRepulsive ? 'repulsive' : 'attractive'">
              {{ state.isRepulsive ? `量子斥力態 (+${state.casimirForcePn} pN)` : `常規引力態 (${state.casimirForcePn} pN)` }}
            </span>
          </div>

          <div class="svg-container">
            <svg viewBox="0 0 540 260" class="motor-svg">
              <defs>
                <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
                <filter id="rotorGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- 上導體板 (手性超材料) -->
              <rect x="70" y="40" width="400" height="24" rx="4" fill="url(#plateGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="270" y="56" fill="#94a3b8" font-size="10" text-anchor="middle">上超材料基底 (θ₁ = {{ state.topologicalThetaAngleRad.toFixed(2) }} rad)</text>

              <!-- 下導體板 -->
              <rect x="70" y="196" width="400" height="24" rx="4" fill="url(#plateGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="270" y="212" fill="#94a3b8" font-size="10" text-anchor="middle">下超材料基底 (θ₂ = 0)</text>

              <!-- 懸浮量子轉子 (位置隨 d 動態映射) -->
              <!-- y 坐標由 d 映射: 40 + 24 + (196 - 64) * (d / 250) -->
              <g :transform="`translate(270, ${100 + (state.cavitySeparationNm / 250) * 50})`">
                <!-- 轉子圓盤 -->
                <ellipse cx="0" cy="0" rx="140" ry="24" fill="#0f172a" stroke="#10b981" stroke-width="2.5" filter="url(#rotorGlow)" />
                <!-- 轉子光軸夾角示意 -->
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4 2" />
                <circle cx="0" cy="0" r="10" fill="#059669" />
                <text x="0" y="4" fill="#fff" font-size="9" text-anchor="middle">轉子</text>

                <!-- 旋轉扭矩動態指示 -->
                <path d="M 125 -10 A 130 20 0 0 1 125 10" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                <polygon points="126,14 122,8 130,8" fill="#fbbf24" />
              </g>

              <!-- 量子真空斥力力場箭頭 (當處於斥力時向上與向下推斥) -->
              <g v-if="state.isRepulsive" class="repulsive-arrows">
                <line x1="180" y1="90" x2="180" y2="72" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                <polygon points="180,68 176,76 184,76" fill="#10b981" />

                <line x1="360" y1="90" x2="360" y2="72" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                <polygon points="360,68 356,76 364,76" fill="#10b981" />

                <line x1="180" y1="170" x2="180" y2="188" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                <polygon points="180,192 176,184 184,184" fill="#10b981" />

                <line x1="360" y1="170" x2="360" y2="188" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
                <polygon points="360,192 356,184 364,184" fill="#10b981" />
              </g>

              <!-- 間隙標尺與數值 -->
              <line x1="490" y1="64" x2="490" y2="196" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2" />
              <text x="500" y="134" fill="#38bdf8" font-size="10" font-family="monospace">d = {{ state.cavitySeparationNm.toFixed(1) }} nm</text>
              <text x="30" y="30" fill="#64748b" font-size="9" font-family="monospace">
                平衡間距 d_eq: {{ state.levitationEquilibriumNm }} nm | 轉速: {{ state.rotorRpm.toFixed(0) }} RPM | 扭矩: {{ state.quantumTorquePnNm }} pN·nm
              </text>
            </svg>
          </div>
        </section>

        <!-- 關鍵物理指標網格 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">卡西米爾力 F_Casimir</span>
            <span class="m-value" :class="state.isRepulsive ? 'text-green' : 'text-amber'">
              {{ state.isRepulsive ? '+' : '' }}{{ state.casimirForcePn.toFixed(2) }} <small>pN</small>
            </span>
            <span class="m-sub">{{ state.isRepulsive ? '無接觸斥力懸浮' : '吸附黏滯力' }}</span>
          </div>

          <div class="metric-box">
            <span class="m-label">量子真空扭矩 \tau</span>
            <span class="m-value text-cyan">{{ state.quantumTorquePnNm.toFixed(2) }} <small>pN·nm</small></span>
            <span class="m-sub">光軸角 \phi = {{ state.rotorAngularOffsetDeg }}°</span>
          </div>

          <div class="metric-box">
            <span class="m-label">奈米轉子運轉轉速</span>
            <span class="m-value text-emerald">{{ state.rotorRpm.toFixed(0) }} <small>RPM</small></span>
            <span class="m-sub">零摩擦真空旋轉</span>
          </div>

          <div class="metric-box">
            <span class="m-label">穩定懸浮平衡間隙 d_eq</span>
            <span class="m-value text-amber">{{ state.levitationEquilibriumNm }} <small>nm</small></span>
            <span class="m-sub">當前間隙: {{ state.cavitySeparationNm.toFixed(1) }} nm</span>
          </div>
        </section>

        <!-- 模式切換 -->
        <section class="regimes-card">
          <h3>卡西米爾操作相態 (Casimir Motor Regimes)</h3>
          <div class="regime-buttons">
            <button
              v-for="r in regimes"
              :key="r.id"
              class="regime-btn"
              :class="{ active: state.regime === r.id }"
              @click="selectRegime(r.id)"
            >
              <span class="btn-name">{{ r.label }}</span>
              <span class="btn-desc">{{ r.desc }}</span>
            </button>
          </div>
        </section>

        <!-- 控制滑桿與操作按鈕 -->
        <section class="controls-card">
          <h3>微腔幾何與手性超材料參數調諧</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>微腔奈米間距 d:</span>
                <b>{{ state.cavitySeparationNm.toFixed(1) }} nm</b>
              </div>
              <input
                type="range"
                min="10.0"
                max="250.0"
                step="1.0"
                :value="state.cavitySeparationNm"
                @input="updateGap(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>拓撲磁電角 \theta:</span>
                <b>{{ state.topologicalThetaAngleRad.toFixed(2) }} rad</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.14159"
                step="0.05"
                :value="state.topologicalThetaAngleRad"
                @input="updateTheta(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>手性極化度 \kappa:</span>
                <b>{{ state.chiralPolarizationDegree.toFixed(2) }}</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                :value="state.chiralPolarizationDegree"
                @input="updateKappa(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>轉子主軸偏轉角 \phi:</span>
                <b>{{ state.rotorAngularOffsetDeg.toFixed(1) }}°</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="180.0"
                step="1.0"
                :value="state.rotorAngularOffsetDeg"
                @input="updatePhi(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn boost-btn" @click="boostTorque">
              🚀 注入量子扭矩加速轉子 (+3500 RPM)
            </button>
            <button class="action-btn eq-btn" @click="tuneEquilibrium">
              ⚖️ 自動調諧至懸浮平衡點 (Tune to d_eq)
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.casimir-modal {
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(16, 185, 129, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f1f5f9;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.title-cluster {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-cluster .icon {
  font-size: 26px;
}

.title-cluster h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #f8fafc;
}

.title-cluster .subtitle {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #1e293b;
  color: #fff;
}

.modal-body {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visualizer-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.vis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vis-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.badge.repulsive {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

.badge.attractive {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.4);
}

.svg-container {
  display: flex;
  justify-content: center;
  background: #060b13;
  border-radius: 8px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.motor-svg {
  width: 100%;
  max-height: 220px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric-box {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.m-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
}

.m-value small {
  font-size: 0.75rem;
  font-weight: normal;
  color: #94a3b8;
}

.m-sub {
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 4px;
}

.text-cyan { color: #38bdf8; }
.text-green { color: #34d399; }
.text-emerald { color: #10b981; }
.text-amber { color: #fbbf24; }

.regimes-card, .controls-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.regimes-card h3, .controls-card h3 {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #cbd5e1;
}

.regime-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.regime-btn {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #10b981;
}

.regime-btn.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
}

.btn-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
}

.btn-desc {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
}

.sliders-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #94a3b8;
}

.slider-header b {
  color: #10b981;
  font-family: monospace;
}

input[type="range"] {
  accent-color: #10b981;
}

.actions-row {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.boost-btn {
  background: #059669;
  color: #fff;
}

.boost-btn:hover {
  background: #047857;
}

.eq-btn {
  background: #0284c7;
  color: #fff;
}

.eq-btn:hover {
  background: #0369a1;
}

@media (max-width: 768px) {
  .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
