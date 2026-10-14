<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { gravitationalChiralAnomalyEngine, type GravitationalAnomalyRegime } from '../engine/gravitationalChiralAnomalyWeyl';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => gravitationalChiralAnomalyEngine.getState());

const isOpen = computed(() => uiStore.mode === 'gravitational-anomaly');

const regimes: Array<{ id: GravitationalAnomalyRegime; label: string; desc: string }> = [
  { id: 'trivial-fermi-liquid-lorentz', label: '傳統費米液體洛倫茲守恆相', desc: '平行磁場極弱或溫度梯度消失，手性引力反常未被激發，熱電輸運嚴格滿足維德曼-夫蘭茲定律 (L/L₀ = 1.0)' },
  { id: 'mixed-gravitational-anomaly-active', label: '混合引力-手性反常激發態', desc: '溫度梯度透過魯丁格對偶產生虛引力場，與外加磁場耦合 (∇T · B)，激發軸向手性不守恆熱能泵浦' },
  { id: 'quantum-wiedemann-franz-violation', label: '量子維德曼-夫蘭茲定律破壞相', desc: '引力反常熱流僅傳輸熱熵而不轉移淨電荷，使縱向磁熱導率 (LMTC) 巨幅激增，洛倫茲比值 L/L₀ > 2.5' },
  { id: 'topological-thermal-hall-saturation', label: '拓撲熱霍爾電導量子化飽和相', desc: '強磁場與高溫梯度驅動外爾錐間手性態極限填滿，黎曼龐特里亞金曲率標量達到極限平台，熱霍爾電導量子化飽和' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemperature(val: number) {
  gravitationalChiralAnomalyEngine.setTemperature(val);
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function updateThermalGradient(val: number) {
  gravitationalChiralAnomalyEngine.setThermalGradient(val);
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function updateMagneticField(val: number) {
  gravitationalChiralAnomalyEngine.setMagneticField(val);
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function updateNodesSeparation(val: number) {
  gravitationalChiralAnomalyEngine.setNodesSeparation(val);
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function triggerBurst() {
  gravitationalChiralAnomalyEngine.triggerGravitationalAnomalyBurst();
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function cycleRegime() {
  gravitationalChiralAnomalyEngine.cycleRegime();
  achievements.unlock('gravitational_chiral_anomaly_weyl');
}

function reset() {
  gravitationalChiralAnomalyEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="anomaly-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>外爾引力反常熱電輸運 (Gravitational Chiral Anomaly)</h2>
            <span class="subtitle">Mixed Axial-Gravitational Anomaly, Luttinger Equivalence & Wiedemann-Franz Violation</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="anomaly-svg">
            <defs>
              <linearGradient id="thermalSlabGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#ef4444" stop-opacity="0.9" />
              </linearGradient>
              <linearGradient id="heatFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f97316" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#eab308" stop-opacity="0.9" />
              </linearGradient>
            </defs>

            <!-- 深色背景 -->
            <rect width="800" height="320" fill="#030712" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：3D 外爾半金屬樣品 (晶體薄板) 與魯丁格熱-引力流場 -->
            <g transform="translate(60, 60)">
              <!-- 晶體外框 (透視長方體) -->
              <!-- 頂面 -->
              <polygon points="0,50 60,10 360,10 300,50" fill="rgba(139, 92, 246, 0.2)" stroke="#a855f7" stroke-width="1.5" />
              <!-- 正面 (具備低溫 T_L 到高溫 T_H 梯度) -->
              <polygon points="0,50 300,50 300,190 0,190" fill="url(#thermalSlabGrad)" stroke="#c084fc" stroke-width="2" />
              <!-- 側面 -->
              <polygon points="300,50 360,10 360,150 300,190" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" stroke-width="1.5" />

              <!-- 外爾節點對稱分佈 (Weyl Nodes K+ and K-) -->
              <g transform="translate(150, 120)">
                <!-- 手性 +1 外爾錐 (左手徵) -->
                <circle cx="-50" cy="0" r="12" fill="#38bdf8" />
                <text cx="-50" cy="4" text-anchor="middle" fill="#000000" font-size="10" font-weight="bold">W⁺</text>

                <!-- 手性 -1 外爾錐 (右手徵) -->
                <circle cx="50" cy="0" r="12" fill="#ef4444" />
                <text cx="50" cy="4" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">W⁻</text>

                <!-- 外爾節點動量間距 2k0 -->
                <line x1="-38" y1="0" x2="38" y2="0" stroke="#facc15" stroke-dasharray="3 3" stroke-width="1.5" />
                <text x="0" y="-8" text-anchor="middle" fill="#facc15" font-size="10">2k₀ = {{ state.weylNodesSeparationInvNm }} nm⁻¹</text>
              </g>

              <!-- 平行外加磁場向量線 (B ∥ ∇T) -->
              <g stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4">
                <line x1="20" y1="80" x2="280" y2="80" />
                <line x1="20" y1="160" x2="280" y2="160" />
              </g>
              <text x="250" y="74" fill="#38bdf8" font-size="11" font-weight="bold">B ({{ state.magneticFieldParallelTesla }} T) →</text>

              <!-- 軸向引力反常誘導手性熱流線 J_Q -->
              <path
                v-if="state.magneticFieldParallelTesla > 0.5"
                :d="`M 30 120 Q 150 ${120 - state.chiralGravitationalHeatCurrentMwM2 * 0.15}, 270 120`"
                fill="none"
                stroke="#fbbf24"
                stroke-width="3.5"
                stroke-linecap="round"
              />
              <text v-if="state.magneticFieldParallelTesla > 0.5" x="120" y="105" fill="#fbbf24" font-size="11" font-weight="bold">
                J_Q 熱流 ({{ state.chiralGravitationalHeatCurrentMwM2 }} mW/m²) →
              </text>

              <!-- 溫度梯度標記 -->
              <text x="5" y="210" fill="#60a5fa" font-size="11">低溫 T_C ({{ (state.temperatureKelvin - 5).toFixed(1) }} K)</text>
              <text x="210" y="210" fill="#f87171" font-size="11">高溫 T_H ({{ (state.temperatureKelvin + 5).toFixed(1) }} K)</text>
            </g>

            <!-- 右側：維德曼-夫蘭茲定律違背圖 (Wiedemann-Franz Violation Curve L/L0) -->
            <g transform="translate(560, 160)">
              <!-- 坐標軸: 平行磁場 B vs 洛倫茲比值 L/L0 -->
              <line x1="-90" y1="90" x2="170" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="-80" y1="90" x2="-80" y2="-90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="175" y="94" fill="rgba(255, 255, 255, 0.6)" font-size="11">B (T)</text>
              <text x="-84" y="-95" fill="rgba(255, 255, 255, 0.6)" font-size="11">L / L₀</text>

              <!-- 傳統金屬洛倫茲常數基準線 L/L0 = 1.0 (WF 守恆) -->
              <line x1="-80" y1="40" x2="160" y2="40" stroke="rgba(255, 255, 255, 0.25)" stroke-dasharray="4 4" stroke-width="1.5" />
              <text x="165" y="44" fill="rgba(255, 255, 255, 0.4)" font-size="9">L₀ (常數)</text>

              <!-- 引力反常巨幅破壞曲線 (B^2 正磁熱導率使得 L/L0 激增) -->
              <path
                :d="`
                  M -80 40
                  Q 40 ${40 - state.lorentzRatioLOverL0 * 12}, 150 ${40 - state.lorentzRatioLOverL0 * 24}
                `"
                fill="none"
                stroke="#f43f5e"
                stroke-width="3"
              />

              <!-- 當前工作點標記 -->
              <circle
                :cx="-80 + state.magneticFieldParallelTesla * 14"
                :cy="40 - (state.lorentzRatioLOverL0 - 1.0) * 26"
                r="5"
                fill="#ffffff"
                stroke="#f43f5e"
                stroke-width="2"
              />
              <text
                :x="-70 + state.magneticFieldParallelTesla * 14"
                :y="30 - (state.lorentzRatioLOverL0 - 1.0) * 26"
                fill="#f43f5e"
                font-size="11"
                font-weight="bold"
              >
                L/L₀ = {{ state.lorentzRatioLOverL0 }}
              </text>
            </g>

            <!-- 標註文字 -->
            <text x="60" y="40" fill="#a855f7" font-size="12" font-weight="bold">外爾費米子魯丁格虛引力勢場 (ψ = -∇T / T)</text>
            <text x="470" y="40" fill="#f43f5e" font-size="12" font-weight="bold">維德曼-夫蘭茲定律巨幅破壞 (L / L₀ ≫ 1)</text>
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
            <div class="label">引力反常熱流 J_Q</div>
            <div class="value cyan">{{ state.chiralGravitationalHeatCurrentMwM2 }} <span class="unit">mW/m²</span></div>
          </div>
          <div class="metric-card">
            <div class="label">洛倫茲比值 L / L₀</div>
            <div class="value green">{{ state.lorentzRatioLOverL0 }} <span class="unit">倍 (WF定律偏差)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">縱向磁熱導率 κ_xx</div>
            <div class="value yellow">{{ state.longitudinalThermalConductivityWmK }} <span class="unit">W/(m·K)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">魯丁格等效黎曼曲率</div>
            <div class="value purple">{{ state.gravitationalCurvatureScalarCm2.toExponential(2) }} <span class="unit">cm⁻²</span></div>
          </div>
          <div class="metric-card">
            <div class="label">外爾錐間隙 2k₀</div>
            <div class="value orange">{{ state.weylNodesSeparationInvNm }} <span class="unit">nm⁻¹</span></div>
          </div>
          <div class="metric-card">
            <div class="label">反常熱輸運週期</div>
            <div class="value pink">{{ state.anomalyEventsAccumulatedCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>樣品平均溫度 T (Kelvin)</span>
              <span class="val-display">{{ state.temperatureKelvin.toFixed(1) }} K</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="120.0"
              step="1.0"
              :value="state.temperatureKelvin"
              @input="updateTemperature(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>沿 x 軸溫度梯度 ∇T (K/mm)</span>
              <span class="val-display">{{ state.thermalGradientKPerMm.toFixed(1) }} K/mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="15.0"
              step="0.1"
              :value="state.thermalGradientKPerMm"
              @input="updateThermalGradient(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>平行外加磁場 B (Tesla)</span>
              <span class="val-display">{{ state.magneticFieldParallelTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="16.0"
              step="0.5"
              :value="state.magneticFieldParallelTesla"
              @input="updateMagneticField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>外爾節點動量空間間距 2k₀ (nm⁻¹)</span>
              <span class="val-display">{{ state.weylNodesSeparationInvNm.toFixed(2) }} nm⁻¹</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              :value="state.weylNodesSeparationInvNm"
              @input="updateNodesSeparation(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerBurst">
            🌌 激發極限引力反常熱輸運
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
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.anomaly-card {
  background: #0d1117;
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.25);
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
  background: rgba(13, 17, 23, 0.9);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
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
  color: #c084fc;
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
  background: #030712;
  border-radius: 10px;
  border: 1px solid rgba(168, 85, 247, 0.2);
  overflow: hidden;
}

.anomaly-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.25);
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
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid #c084fc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(168, 85, 247, 0.3);
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

.cyan { color: #38bdf8; }
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
  color: #c084fc;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #c084fc;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #7c3aed, #9333ea);
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
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
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
