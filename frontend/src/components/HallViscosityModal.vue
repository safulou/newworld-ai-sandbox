<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { hallViscosityEngine, type HallViscosityRegime } from '../engine/hallViscosityReadRezayi';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => hallViscosityEngine.getState());

const isOpen = computed(() => uiStore.mode === 'hall-viscosity');

const regimes: Array<{ id: HallViscosityRegime; label: string; desc: string }> = [
  { id: 'dissipative-viscous-fluid', label: '傳統常規對稱耗散流體相', desc: '拓撲自旋移位 S = 0，奇性黏度消失 (η_H = 0)，流體剪切應力產生正焦耳耗散功率與熱熵增' },
  { id: 'integer-qhe-hall-viscosity', label: '整數量子霍爾態奇性黏滯相', desc: 'ν = 1 朗道能階完全填充，Wen-Zee 拓撲移位 S = 1，奇性黏度嚴格量子化，剪切變形嚴格無熱耗散' },
  { id: 'fractional-laughlin-odd-viscosity', label: '分數量子霍爾勞夫林手性相', desc: 'ν = 1/3 強關聯複合費米子態，拓撲移位 S = 3，平均軌道自旋 s̄ = 1.5，展現強烈聲學圓雙折射分裂' },
  { id: 'non-abelian-pfaffian-chiral-shear', label: '非阿貝爾摩爾-里德手性剪切相', desc: 'ν = 5/2 拓撲超流態，馬約拉納準粒子編織引發幾何流體邊界反對稱剪切應力張量最大化' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateDensity(val: number) {
  hallViscosityEngine.setDensity(val);
  achievements.unlock('hall_viscosity_read_rezayi');
}

function updateMagneticField(val: number) {
  hallViscosityEngine.setMagneticField(val);
  achievements.unlock('hall_viscosity_read_rezayi');
}

function updateShift(val: number) {
  hallViscosityEngine.setShiftS(val);
  achievements.unlock('hall_viscosity_read_rezayi');
}

function updateFillingFactor(val: number) {
  hallViscosityEngine.setFillingFactor(val);
  achievements.unlock('hall_viscosity_read_rezayi');
}

function triggerChiralShear() {
  hallViscosityEngine.triggerChiralShearWave();
  achievements.unlock('hall_viscosity_read_rezayi');
}

function cycleRegime() {
  hallViscosityEngine.cycleRegime();
  achievements.unlock('hall_viscosity_read_rezayi');
}

function reset() {
  hallViscosityEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="viscosity-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌊</span>
          <div>
            <h2>量子霍爾奇性黏度 (Hall Viscosity & Read-Rezayi)</h2>
            <span class="subtitle">Geometric Hydrodynamics, Wen-Zee Shift & Non-Dissipative Odd Shear Stress</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="viscosity-svg">
            <defs>
              <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3" />
                <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.3" />
              </linearGradient>
              <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#22d3ee" />
                <stop offset="60%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#082f49" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深色背景 -->
            <rect width="800" height="320" fill="#020617" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：2D 手性量子流體液滴與非耗散奇性剪切流場 (Chiral Fluid Droplet) -->
            <g transform="translate(240, 160)">
              <!-- 背景參考圓 (平衡無剪切態) -->
              <circle cx="0" cy="0" r="95" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3 3" stroke-width="1.5" />

              <!-- 奇性剪切動態變形液滴 (Odd Viscosity Deformation: 應力旋轉 90 度，面積與能量嚴格守恆) -->
              <!-- 變形振幅隨 η_H 動態調製 -->
              <path
                :d="`
                  M 0 ${-95 - state.hallViscosityPascalS * 5}
                  C ${55 + state.hallViscosityPascalS * 8} ${-95 + state.hallViscosityPascalS * 6},
                    ${95 + state.hallViscosityPascalS * 8} ${-55 - state.hallViscosityPascalS * 4},
                    ${95 + state.hallViscosityPascalS * 6} 0
                  C ${95 - state.hallViscosityPascalS * 4} ${55 + state.hallViscosityPascalS * 6},
                    ${55 - state.hallViscosityPascalS * 8} ${95 + state.hallViscosityPascalS * 4},
                    0 ${95 + state.hallViscosityPascalS * 5}
                  C ${-55 - state.hallViscosityPascalS * 8} ${95 - state.hallViscosityPascalS * 4},
                    ${-95 - state.hallViscosityPascalS * 6} ${55 - state.hallViscosityPascalS * 8},
                    ${-95 - state.hallViscosityPascalS * 6} 0
                  C ${-95 + state.hallViscosityPascalS * 4} ${-55 + state.hallViscosityPascalS * 6},
                    ${-55 + state.hallViscosityPascalS * 6} ${-95 - state.hallViscosityPascalS * 5},
                    0 ${-95 - state.hallViscosityPascalS * 5}
                  Z
                `"
                fill="url(#fluidGrad)"
                stroke="#06b6d4"
                stroke-width="2.5"
              />

              <!-- 邊界手性漂移流線環 (Chiral Boundary Drift Streamlines) -->
              <circle
                cx="0"
                cy="0"
                :r="80"
                fill="none"
                stroke="#38bdf8"
                stroke-width="2"
                stroke-dasharray="14 8"
                :transform="`rotate(${state.shearStressCycleCount * 12})`"
              />

              <!-- 中心拓撲幾何軌道自旋渦旋核心 (Orbital Spin Vortex Core) -->
              <circle cx="0" cy="0" :r="22" fill="url(#vortexGlow)" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">s̄ = {{ state.meanOrbitalSpinSBar }}</text>

              <!-- 應力向量箭頭 (反對稱剪切應力 T_xy = -T_yx) -->
              <g stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)">
                <line x1="-70" y1="-70" x2="-45" y2="-85" />
                <line x1="70" y1="70" x2="45" y2="85" />
                <line x1="70" y1="-70" x2="85" y2="-45" />
                <line x1="-70" y1="70" x2="-85" y2="45" />
              </g>
            </g>

            <!-- 右側：聲學雙折射聲速分裂頻譜 (Acoustic Circular Birefringence) -->
            <g transform="translate(580, 160)">
              <!-- 坐標軸: 頻率 ω vs 聲速 v_s -->
              <line x1="-120" y1="90" x2="140" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="-110" y1="90" x2="-110" y2="-90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="145" y="94" fill="rgba(255, 255, 255, 0.6)" font-size="11">ω (rad/s)</text>
              <text x="-114" y="-95" fill="rgba(255, 255, 255, 0.6)" font-size="11">v_s (m/s)</text>

              <!-- 常規聲速基準線 (v0) -->
              <line x1="-110" y1="10" x2="130" y2="10" stroke="rgba(255, 255, 255, 0.25)" stroke-dasharray="4 4" stroke-width="1.5" />
              <text x="135" y="14" fill="rgba(255, 255, 255, 0.4)" font-size="9">v₀ (基準)</text>

              <!-- 右旋圓偏振聲波色散曲線 (Right-Handed Sound Wave v_R) -->
              <path
                :d="`M -110 10 Q 0 ${10 - state.acousticBirefringenceSplitM_S * 7}, 130 ${10 - state.acousticBirefringenceSplitM_S * 14}`"
                fill="none"
                stroke="#22c55e"
                stroke-width="2.5"
              />
              <text x="100" y="-35" fill="#22c55e" font-size="10" font-weight="bold">v_R (右旋聲速)</text>

              <!-- 左旋圓偏振聲波色散曲線 (Left-Handed Sound Wave v_L) -->
              <path
                :d="`M -110 10 Q 0 ${10 + state.acousticBirefringenceSplitM_S * 7}, 130 ${10 + state.acousticBirefringenceSplitM_S * 14}`"
                fill="none"
                stroke="#a855f7"
                stroke-width="2.5"
              />
              <text x="100" y="55" fill="#a855f7" font-size="10" font-weight="bold">v_L (左旋聲速)</text>

              <!-- 聲速差雙箭頭標註 -->
              <line x1="60" :y1="10 - state.acousticBirefringenceSplitM_S * 10" x2="60" :y2="10 + state.acousticBirefringenceSplitM_S * 10" stroke="#facc15" stroke-width="1.5" />
              <text x="68" y="14" fill="#facc15" font-size="10">Δv_s = {{ state.acousticBirefringenceSplitM_S }} m/s</text>
            </g>

            <!-- 標註文字 -->
            <text x="50" y="50" fill="#06b6d4" font-size="12" font-weight="bold">非耗散反對稱剪切應力場 (T_ij^odd V_ij ≡ 0)</text>
            <text x="50" y="70" fill="rgba(255, 255, 255, 0.5)" font-size="10">拓撲移位 S = {{ state.wenZeeShiftS }} | 填充分數 ν = {{ state.fillingFactorNu }}</text>
            <text x="470" y="50" fill="#38bdf8" font-size="12" font-weight="bold">聲波圓雙折射 (Circular Birefringence)</text>
            <text x="470" y="70" fill="rgba(255, 255, 255, 0.5)" font-size="10">橫波聲子偏振分裂 | 磁場 B = {{ state.magneticFieldTesla }} T</text>
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
            <div class="label">奇性霍爾黏度 η_H</div>
            <div class="value cyan">{{ state.hallViscosityPascalS }} <span class="unit">×10⁻¹¹ Pa·s</span></div>
          </div>
          <div class="metric-card">
            <div class="label">平均軌道自旋 s̄</div>
            <div class="value green">{{ state.meanOrbitalSpinSBar }} <span class="unit">ħ/2</span></div>
          </div>
          <div class="metric-card">
            <div class="label">能量耗散功率 Q̇</div>
            <div class="value yellow">{{ state.energyDissipationRateWatts }} <span class="unit">W (嚴格為0)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">聲學雙折射聲速差</div>
            <div class="value purple">{{ state.acousticBirefringenceSplitM_S }} <span class="unit">m/s</span></div>
          </div>
          <div class="metric-card">
            <div class="label">邊界曲率手性漂移</div>
            <div class="value orange">{{ state.boundaryCurvatureDriftVelocityKmS }} <span class="unit">km/s</span></div>
          </div>
          <div class="metric-card">
            <div class="label">累計剪切循環週期</div>
            <div class="value pink">{{ state.shearStressCycleCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>2D 電子面密度 ρ₀ (10¹¹ cm⁻²)</span>
              <span class="val-display">{{ state.electronDensity10_11Cm2.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              :value="state.electronDensity10_11Cm2"
              @input="updateDensity(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>垂直外加磁場 B (Tesla)</span>
              <span class="val-display">{{ state.magneticFieldTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              :value="state.magneticFieldTesla"
              @input="updateMagneticField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>Wen-Zee 拓撲移位參數 S</span>
              <span class="val-display">{{ state.wenZeeShiftS.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.5"
              :value="state.wenZeeShiftS"
              @input="updateShift(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>朗道能階填充分數 ν</span>
              <span class="val-display">{{ state.fillingFactorNu.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              :value="state.fillingFactorNu"
              @input="updateFillingFactor(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerChiralShear">
            🌊 激發手性非耗散剪切共鳴
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
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.viscosity-card {
  background: #0b1329;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.25);
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
  background: rgba(11, 19, 41, 0.9);
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
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
  color: #06b6d4;
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
  background: #020617;
  border-radius: 10px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  overflow: hidden;
}

.viscosity-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.25);
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
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  border: 1px solid #06b6d4;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(6, 182, 212, 0.3);
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

.cyan { color: #06b6d4; }
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
  color: #06b6d4;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #06b6d4;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #0891b2, #0284c7);
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
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
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
