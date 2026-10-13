<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { fourDQuantumHallEngine, type FourDHallRegime } from '../engine/fourDQuantumHallSynthetic';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => fourDQuantumHallEngine.getState());

const isOpen = computed(() => uiStore.mode === 'four-d-quantum-hall');

const regimes: Array<{ id: FourDHallRegime; label: string; desc: string }> = [
  { id: 'second-chern-synthetic-4d-hall', label: '第二陳數量子化四維霍爾相', desc: '第二陳數 c_2 嚴格拓撲整數保護，合成維度布里淵區完全閉合' },
  { id: '3d-chiral-weyl-hypersurface', label: '三維邊界手性外爾超表面相', desc: '4D 體態在 3D 物理邊界投影出無質量手性外爾費米子態，零雜質背散射' },
  { id: 'nonlinear-quantized-current-surge', label: '非線性電磁三重霍爾激增電流相', desc: '強電場與高階磁張量激發 J^μ ∝ ε^μνρσ E_ν B_ρσ 巨非線性霍爾電流' },
  { id: 'synthetic-dimension-decoupled-lattice', label: '合成維度解耦平庸布洛赫相', desc: '合成維度躍遷極度弱化，4D 拓撲退化為孤立二維平庸晶格' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateElectricField(val: number) {
  const diff = val - state.value.drivingElectricFieldExVcm;
  fourDQuantumHallEngine.applyNonlinearDrive(diff);
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function updateSyntheticCoupling(val: number) {
  const diff = val - state.value.syntheticCouplingStrengthOmega;
  fourDQuantumHallEngine.pumpSyntheticCoupling(diff);
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function pumpCoupling() {
  fourDQuantumHallEngine.pumpSyntheticCoupling(0.5);
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function invertTopology() {
  fourDQuantumHallEngine.invertSecondChernTopology();
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function pulseNonlinearDrive() {
  fourDQuantumHallEngine.applyNonlinearDrive(4.0);
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function dampModes() {
  fourDQuantumHallEngine.dampHypersurfaceModes();
  achievements.unlock('four_d_quantum_hall_synthetic');
}

function reset() {
  fourDQuantumHallEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="hall-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌐</span>
          <div>
            <h2>拓撲四維量子霍爾效應與第二陳數合成維度反應堆 (4D Quantum Hall Effect)</h2>
            <span class="subtitle">Second Chern Number c_2, 4D Tesseract Lattice, Nonlinear Current & 3D Chiral Weyl Surface</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 四維超立方體投影與合成維度電流流線 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="hall-svg">
            <defs>
              <linearGradient id="tesseractGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0.9" />
              </linearGradient>
              <radialGradient id="weylNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#6366f1" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 反應堆腔體背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#8b5cf6" stroke-width="1.6" />

            <!-- 4D 超立方體 (Tesseract) 八角投影骨架 -->
            <g transform="translate(180, 150)">
              <!-- 外立方體頂點 -->
              <!-- A(-90,-70), B(90,-70), C(90,70), D(-90,70) -->
              <!-- 內立方體頂點 (以合成躍遷耦合 omega 縮放) -->
              <!-- a(-45,-35), b(45,-35), c(45,35), d(-45,35) -->
              <!-- 外立方體邊框 -->
              <polygon points="-90,-70 90,-70 90,70 -90,70" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.6" />
              <!-- 內立方體邊框 -->
              <polygon
                :points="`${-35 * state.syntheticCouplingStrengthOmega},${-25 * state.syntheticCouplingStrengthOmega} ${35 * state.syntheticCouplingStrengthOmega},${-25 * state.syntheticCouplingStrengthOmega} ${35 * state.syntheticCouplingStrengthOmega},${25 * state.syntheticCouplingStrengthOmega} ${-35 * state.syntheticCouplingStrengthOmega},${25 * state.syntheticCouplingStrengthOmega}`"
                fill="none"
                stroke="#ec4899"
                stroke-width="2"
                opacity="0.8"
              />

              <!-- 4D 超立方體頂點跨維度跳躍線 (z, w 合成維度) -->
              <line x1="-90" y1="-70" :x2="-35 * state.syntheticCouplingStrengthOmega" :y2="-25 * state.syntheticCouplingStrengthOmega" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 2" />
              <line x1="90" y1="-70" :x2="35 * state.syntheticCouplingStrengthOmega" :y2="-25 * state.syntheticCouplingStrengthOmega" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 2" />
              <line x1="90" y1="70" :x2="35 * state.syntheticCouplingStrengthOmega" :y2="25 * state.syntheticCouplingStrengthOmega" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 2" />
              <line x1="-90" y1="70" :x2="-35 * state.syntheticCouplingStrengthOmega" :y2="25 * state.syntheticCouplingStrengthOmega" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 2" />

              <!-- 頂點節點 -->
              <circle
                v-for="(p, i) in [
                  [-90, -70], [90, -70], [90, 70], [-90, 70],
                  [-35 * state.syntheticCouplingStrengthOmega, -25 * state.syntheticCouplingStrengthOmega],
                  [35 * state.syntheticCouplingStrengthOmega, -25 * state.syntheticCouplingStrengthOmega],
                  [35 * state.syntheticCouplingStrengthOmega, 25 * state.syntheticCouplingStrengthOmega],
                  [-35 * state.syntheticCouplingStrengthOmega, 25 * state.syntheticCouplingStrengthOmega]
                ]"
                :key="i"
                :cx="p[0]"
                :cy="p[1]"
                r="4.5"
                fill="#38bdf8"
              />

              <!-- 中心第二陳數拓撲核與外爾費米子旋轉光環 -->
              <circle cx="0" cy="0" :r="22 + Math.abs(state.secondChernNumberC2) * 8" fill="url(#weylNodeGlow)">
                <animate attributeName="r" values="24;32;24" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="5" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">
                c₂ = {{ state.secondChernNumberC2 }}
              </text>
            </g>

            <!-- 右側：非線性霍爾響應電流與外爾流線標註 -->
            <g transform="translate(340, 60)">
              <rect x="0" y="0" width="160" height="180" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#8b5cf6" stroke-width="1" />
              <text x="14" y="24" fill="#a78bfa" font-size="12" font-weight="bold">4D 拓撲非線性向量</text>
              <line x1="14" y1="32" x2="146" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">J^μ ∝ c₂ ε^μνρσ E_ν B_ρσ</text>
              <text x="14" y="75" fill="#38bdf8" font-size="13" font-weight="bold">{{ state.nonlinearHallCurrentDensityMicroAmp }} μA/cm³</text>

              <text x="14" y="105" fill="#94a3b8" font-size="10">邊界手性外爾速度 v_W</text>
              <text x="14" y="125" fill="#ec4899" font-size="13" font-weight="bold">{{ (state.hypersurfaceWeylVelocityNormalized * 100).toFixed(1) }}% c</text>

              <text x="14" y="155" fill="#94a3b8" font-size="10">4D 布里淵體積 V_BZ</text>
              <text x="14" y="172" fill="#fbbf24" font-size="12" font-weight="bold">{{ state.fourDimensionalBrillouinVolume }}</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 35)">
              <rect x="0" y="0" width="230" height="30" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#8b5cf6" stroke-width="1" />
              <text x="12" y="19" fill="#a78bfa" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">第二陳數 (c₂)</span>
            <span class="m-val highlight">{{ state.secondChernNumberC2 }}</span>
            <span class="m-sub">4D 拓撲不變量 Tr(F∧F)</span>
          </div>

          <div class="metric-card">
            <span class="m-label">非線性霍爾電流</span>
            <span class="m-val accent">{{ state.nonlinearHallCurrentDensityMicroAmp }} μA/cm³</span>
            <span class="m-sub">電磁三重外積響應</span>
          </div>

          <div class="metric-card">
            <span class="m-label">邊界外爾速度 (v_W)</span>
            <span class="m-val">{{ (state.hypersurfaceWeylVelocityNormalized * 100).toFixed(1) }}% c</span>
            <span class="m-sub">3D 手性邊界態速度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">合成躍遷耦合 (Ω_w)</span>
            <span class="m-val">{{ state.syntheticCouplingStrengthOmega }}</span>
            <span class="m-sub">光學頻率梳躍遷強度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">驅動電場 (E_x)</span>
            <span class="m-val">{{ state.drivingElectricFieldExVcm }} V/cm</span>
            <span class="m-sub">非線性外場驅動</span>
          </div>

          <div class="metric-card">
            <span class="m-label">手性表面態密度</span>
            <span class="m-val">{{ state.chiralSurfaceStateDensityE11 }} ×10¹¹ cm⁻²</span>
            <span class="m-sub">無背散射保護態</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>驅動電場 E_x (0.5 ~ 25.0 V/cm): <b>{{ state.drivingElectricFieldExVcm }} V/cm</b></label>
              <input
                type="range"
                min="0.5"
                max="25.0"
                step="0.5"
                :value="state.drivingElectricFieldExVcm"
                @input="updateElectricField(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>合成躍遷耦合 Ω_w (0.1 ~ 5.0): <b>{{ state.syntheticCouplingStrengthOmega }}</b></label>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                :value="state.syntheticCouplingStrengthOmega"
                @input="updateSyntheticCoupling(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="pumpCoupling">
              🌐 增強合成躍遷耦合 (+0.5)
            </button>
            <button class="action-btn purple" @click="invertTopology">
              🔄 翻轉第二陳數拓撲相
            </button>
            <button class="action-btn secondary" @click="pulseNonlinearDrive">
              ⚡ 注入強電場驅動 (+4 V/cm)
            </button>
            <button class="action-btn cyan" @click="dampModes">
              🛡️ 抑制超表面散射
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

.hall-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 35px rgba(139, 92, 246, 0.25);
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
  color: #a78bfa;
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

.hall-svg {
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
  border: 1px solid rgba(139, 92, 246, 0.2);
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
  color: #a78bfa;
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
  accent-color: #8b5cf6;
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
  background: #7c3aed;
  color: #fff;
}
.action-btn.primary:hover {
  background: #6d28d9;
}

.action-btn.purple {
  background: #c026d3;
  color: #fff;
}
.action-btn.purple:hover {
  background: #a21caf;
}

.action-btn.secondary {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  border-color: rgba(139, 92, 246, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(139, 92, 246, 0.25);
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
