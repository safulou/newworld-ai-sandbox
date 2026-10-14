<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { chiralMajoranaEngine, type ChiralMajoranaRegime } from '../engine/chiralMajoranaFermionQAH';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => chiralMajoranaEngine.getState());

const isOpen = computed(() => uiStore.mode === 'chiral-majorana');

const regimes: Array<{ id: ChiralMajoranaRegime; label: string; desc: string }> = [
  { id: 'integer-qah-chiral-dirac-mode', label: '整數量子反常霍爾相 (M ≫ Δ, σ = e²/h)', desc: '強交換場壓制超導配對，表面態為單向傳播之完整複數狄拉克費米邊緣態，展現整數量子化電導 1.0 e²/h' },
  { id: 'half-quantized-chiral-majorana-plateau', label: '手性馬約拉納半整數平台相 (M ≈ Δ, σ = 0.5 e²/h)', desc: '交換能隙與超導能隙達到拓撲相變平衡，狄拉克邊緣態解離為一對獨立手性馬約拉納天使粒子，呈現精確半整數電導平台' },
  { id: 'trivial-superconducting-gap', label: '平庸超導相 (M ≪ Δ, σ = 0)', desc: '超導配對占主導地位，拓撲陳數為零，邊緣通道完全被體能隙屏蔽，低溫電導跌至零' },
  { id: 'non-abelian-majorana-braiding-active', label: '非阿貝爾馬約拉納邊界網絡編織態', desc: '手性馬約拉納波包在 T 型或十字節點網絡進行拓撲非阿貝爾幾何編織，構造容錯拓撲量子邏輯門' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateExchangeField(val: number) {
  chiralMajoranaEngine.setExchangeField(val);
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function updateSuperconductingGap(val: number) {
  chiralMajoranaEngine.setSuperconductingGap(val);
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function updateChemicalPotential(val: number) {
  chiralMajoranaEngine.setChemicalPotential(val);
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function updateMagneticField(val: number) {
  chiralMajoranaEngine.setMagneticField(val);
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function triggerPlateau() {
  chiralMajoranaEngine.triggerMajoranaPlateau();
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function cycleRegime() {
  chiralMajoranaEngine.cycleRegime();
  achievements.unlock('chiral_majorana_qah_half_quantized');
}

function reset() {
  chiralMajoranaEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="majorana-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">👼</span>
          <div>
            <h2>手性馬約拉納天使粒子 (Chiral Majorana Fermion Modes)</h2>
            <span class="subtitle">Quantum Anomalous Hall-Superconductor Hybrid & Half-Quantized Conductance σ = 0.5 e²/h</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="majorana-svg">
            <defs>
              <linearGradient id="qahSubstrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e1b4b" />
                <stop offset="50%" stop-color="#312e81" />
                <stop offset="100%" stop-color="#0f172a" />
              </linearGradient>
              <linearGradient id="scIslandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4" />
                <stop offset="50%" stop-color="#22d3ee" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.4" />
              </linearGradient>
              <radialGradient id="majoranaParticleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#facc15" />
                <stop offset="100%" stop-color="#d97706" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深色微結構背景 -->
            <rect width="800" height="320" fill="#0b0f19" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：QAH-SC 異質結霍爾條晶片與手性邊界通道 -->
            <g transform="translate(60, 60)">
              <!-- 磁性拓撲絕緣體 QAH 霍爾條基底 -->
              <rect x="0" y="40" width="360" height="130" rx="8" fill="url(#qahSubstrateGrad)" stroke="#4338ca" stroke-width="2" />

              <!-- 超導近鄰覆蓋電極 (Nb Superconductor Strip) -->
              <rect x="110" y="20" width="140" height="170" rx="6" fill="url(#scIslandGrad)" stroke="#22d3ee" stroke-dasharray="4 2" stroke-width="2" />
              <text x="180" y="36" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="bold">Nb 超導條帶 (Δ₀ = {{ state.superconductingPairGapMev }} meV)</text>

              <!-- 磁性摻雜自旋磁化箭頭 M_z -->
              <g fill="#818cf8" opacity="0.6">
                <circle cx="50" cy="90" r="10" fill="none" stroke="#818cf8" stroke-width="1.5" />
                <circle cx="50" cy="90" r="3" fill="#818cf8" />
                <circle cx="50" cy="130" r="10" fill="none" stroke="#818cf8" stroke-width="1.5" />
                <circle cx="50" cy="130" r="3" fill="#818cf8" />
                <circle cx="310" cy="90" r="10" fill="none" stroke="#818cf8" stroke-width="1.5" />
                <circle cx="310" cy="90" r="3" fill="#818cf8" />
                <circle cx="310" cy="130" r="10" fill="none" stroke="#818cf8" stroke-width="1.5" />
                <circle cx="310" cy="130" r="3" fill="#818cf8" />
              </g>

              <!-- 手性邊界通道 (Chiral Edge Modes) -->
              <!-- 上邊緣：左到右傳播 -->
              <line x1="0" y1="40" x2="360" y2="40" stroke="#facc15" stroke-width="2.5" />
              <!-- 下邊緣：右到左傳播 -->
              <line x1="360" y1="170" x2="0" y2="170" stroke="#facc15" stroke-width="2.5" />

              <!-- 在超導區分裂為一對手性馬約拉納模式 (γ1 和 γ2) -->
              <g v-if="state.hallConductanceE2OverH === 0.5 || state.hallConductanceE2OverH === 1.0">
                <!-- 第一手性馬約拉納模式 γ1 (沿超導介面傳播) -->
                <path
                  d="M 110 40 C 110 90, 110 120, 110 170"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <!-- 第二手性馬約拉納模式 γ2 (沿外邊緣傳播) -->
                <path
                  d="M 250 40 C 250 90, 250 120, 250 170"
                  fill="none"
                  stroke="#f59e0b"
                  stroke-width="3"
                  stroke-linecap="round"
                />

                <!-- 馬約拉納粒子沿邊緣移動的光斑 -->
                <circle :cx="110" :cy="40 + (state.accumulatedMajoranaEventsCount * 8) % 130" r="7" fill="url(#majoranaParticleGlow)" />
                <text :x="95" :y="45 + (state.accumulatedMajoranaEventsCount * 8) % 130" fill="#38bdf8" font-size="11" font-weight="bold">γ₁</text>

                <circle :cx="250" :cy="170 - (state.accumulatedMajoranaEventsCount * 8) % 130" r="7" fill="url(#majoranaParticleGlow)" />
                <text :x="265" :y="175 - (state.accumulatedMajoranaEventsCount * 8) % 130" fill="#f59e0b" font-size="11" font-weight="bold">γ₂</text>
              </g>

              <!-- 標註文字 -->
              <text x="50" y="65" fill="#facc15" font-size="10">狄拉克費米邊緣 c</text>
              <text x="180" y="105" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">
                M/Δ₀ = {{ (state.exchangeFieldMev / state.superconductingPairGapMev).toFixed(2) }}
              </text>
              <text x="180" y="125" text-anchor="middle" fill="#67e8f9" font-size="10">
                解離度: {{ (state.majoranaDecouplingRatio * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- 右側：半整數量子化霍爾電導台階圖 (Half-Quantized Step Curve) -->
            <g transform="translate(560, 160)">
              <!-- 坐標軸: 交換場 M (或外場 B) vs 電導 σ12 (e²/h) -->
              <line x1="-120" y1="80" x2="140" y2="80" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="-110" y1="80" x2="-110" y2="-90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="145" y="84" fill="rgba(255, 255, 255, 0.6)" font-size="11">M (meV)</text>
              <text x="-114" y="-95" fill="rgba(255, 255, 255, 0.6)" font-size="11">σ₁₂ (e²/h)</text>

              <!-- 電導平台刻度 (0, 0.5, 1.0) -->
              <!-- 1.0 e²/h -->
              <line x1="-110" y1="-50" x2="130" y2="-50" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="3 3" stroke-width="1" />
              <text x="-135" y="-46" fill="rgba(255, 255, 255, 0.5)" font-size="10">1.0</text>

              <!-- 0.5 e²/h (天使粒子特徵半整數平台) -->
              <line x1="-110" y1="15" x2="130" y2="15" stroke="rgba(250, 204, 21, 0.3)" stroke-dasharray="3 3" stroke-width="1.5" />
              <text x="-135" y="19" fill="#facc15" font-size="10" font-weight="bold">0.5</text>

              <!-- 0.0 e²/h -->
              <text x="-135" y="84" fill="rgba(255, 255, 255, 0.5)" font-size="10">0.0</text>

              <!-- 量子化電導台階階梯路徑 -->
              <path
                d="
                  M -110 80
                  L -30 80
                  L -30 15
                  L 50 15
                  L 50 -50
                  L 130 -50
                "
                fill="none"
                stroke="#64748b"
                stroke-width="2.5"
              />

              <!-- 半整數平台加粗高亮 (0.5 e²/h 區域) -->
              <line x1="-30" y1="15" x2="50" y2="15" stroke="#facc15" stroke-width="4.5" stroke-linecap="round" />
              <text x="10" y="3" text-anchor="middle" fill="#facc15" font-size="10" font-weight="bold">
                天使粒子平台 (0.5 e²/h)
              </text>

              <!-- 當前工作點標記 -->
              <circle
                :cx="state.hallConductanceE2OverH === 0.0 ? -70 : (state.hallConductanceE2OverH === 0.5 ? 10 : 90)"
                :cy="state.hallConductanceE2OverH === 0.0 ? 80 : (state.hallConductanceE2OverH === 0.5 ? 15 : -50)"
                r="6"
                fill="#ffffff"
                stroke="#f59e0b"
                stroke-width="2.5"
              />
            </g>

            <!-- 標註文字 -->
            <text x="60" y="40" fill="#facc15" font-size="12" font-weight="bold">QAH-超導體手性馬約拉納解離拓撲界面</text>
            <text x="470" y="40" fill="#38bdf8" font-size="12" font-weight="bold">兩端電導半整數平台與拓撲中心荷 c = 1/2</text>
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
            <div class="label">霍爾電導平台 σ₁₂</div>
            <div class="value yellow">{{ state.hallConductanceE2OverH }} <span class="unit">e²/h (精確半整數)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">兩端電導絕對值</div>
            <div class="value cyan">{{ state.hallConductanceMicroSiemens }} <span class="unit">μS</span></div>
          </div>
          <div class="metric-card">
            <div class="label">馬約拉納解離度</div>
            <div class="value green">{{ (state.majoranaDecouplingRatio * 100).toFixed(1) }} <span class="unit">%</span></div>
          </div>
          <div class="metric-card">
            <div class="label">熱霍爾中央荷 c</div>
            <div class="value purple">{{ state.thermalHallConductanceCentralC }} <span class="unit">(半整數 c=1/2)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">非阿貝爾編織保真度</div>
            <div class="value orange">{{ (state.braidingFidelityRatio * 100).toFixed(1) }} <span class="unit">%</span></div>
          </div>
          <div class="metric-card">
            <div class="label">手性馬約拉納傳輸週期</div>
            <div class="value pink">{{ state.accumulatedMajoranaEventsCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>磁性交換能隙 M (meV)</span>
              <span class="val-display">{{ state.exchangeFieldMev.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.5"
              step="0.05"
              :value="state.exchangeFieldMev"
              @input="updateExchangeField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>超導近鄰配對能隙 Δ₀ (meV)</span>
              <span class="val-display">{{ state.superconductingPairGapMev.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              :value="state.superconductingPairGapMev"
              @input="updateSuperconductingGap(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>化學勢偏離 μ (μeV)</span>
              <span class="val-display">{{ state.chemicalPotentialUev.toFixed(0) }} μeV</span>
            </div>
            <input
              type="range"
              min="-500"
              max="500"
              step="20"
              :value="state.chemicalPotentialUev"
              @input="updateChemicalPotential(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>外加垂直磁場 B (Tesla)</span>
              <span class="val-display">{{ state.magneticFieldTesla.toFixed(2) }} T</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.05"
              :value="state.magneticFieldTesla"
              @input="updateMagneticField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerPlateau">
            👼 激發半整數手性馬約拉納平台 (0.5 e²/h)
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
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.majorana-card {
  background: #101524;
  border: 1px solid rgba(250, 204, 21, 0.3);
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.25);
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
  background: rgba(16, 21, 36, 0.9);
  border-bottom: 1px solid rgba(250, 204, 21, 0.2);
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
  color: #facc15;
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
  background: #0b0f19;
  border-radius: 10px;
  border: 1px solid rgba(250, 204, 21, 0.2);
  overflow: hidden;
}

.majorana-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(250, 204, 21, 0.25);
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
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
  border: 1px solid #facc15;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(250, 204, 21, 0.3);
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
  color: #facc15;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #facc15;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #d97706, #f59e0b);
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
  background: linear-gradient(135deg, #facc15, #d97706);
  box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
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
