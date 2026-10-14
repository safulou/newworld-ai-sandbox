<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { magicAngleGrapheneEngine, type MatbgRegime } from '../engine/magicAngleTwistedGraphene';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => magicAngleGrapheneEngine.getState());

const isOpen = computed(() => uiStore.mode === 'magic-angle-graphene');

const regimes: Array<{ id: MatbgRegime; label: string; desc: string }> = [
  { id: 'dispersive-dirac-semimetal', label: '大角度色散狄拉克半金屬態', desc: '夾角偏離魔角 (θ > 1.3°)，層間隧穿弱於費米速度，帶寬 W ≫ 25 meV，展現傳統半金屬色散且庫侖關聯受壓制' },
  { id: 'quenched-magic-flat-band', label: '魔角淬火極限超窄平帶態', desc: '扭轉角調諧至第一魔角 θ ≈ 1.08°，狄拉克費米速度淬火趨近零 (v_F* → 0)，費米面附近形成極窄拓撲平帶 (W ~ 8 meV)' },
  { id: 'correlated-mott-insulator', label: '半填充整數關聯莫特絕緣相', desc: '載流子精確調至 ν = ±2 莫爾單胞半填充，強庫侖排斥能 U/W > 3 打開關聯莫特能隙，金屬態自發凍結為絕緣體' },
  { id: 'unconventional-superconducting-dome', label: '微量摻雜非常規超導穹頂相', desc: '由 ν = -2 微量靜電摻雜失穩莫特態，強關聯電子配對湧現高溫非常規超導穹頂 (Tc ≈ 1.72 K)，電阻驟降至零' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTwistAngle(val: number) {
  magicAngleGrapheneEngine.setTwistAngle(val);
  achievements.unlock('magic_angle_twisted_graphene');
}

function updateFillingFactor(val: number) {
  magicAngleGrapheneEngine.setFillingFactor(val);
  achievements.unlock('magic_angle_twisted_graphene');
}

function updateTemperature(val: number) {
  magicAngleGrapheneEngine.setTemperature(val);
  achievements.unlock('magic_angle_twisted_graphene');
}

function updateDisplacementField(val: number) {
  magicAngleGrapheneEngine.setDisplacementField(val);
  achievements.unlock('magic_angle_twisted_graphene');
}

function triggerSupercon() {
  magicAngleGrapheneEngine.triggerSuperconductivity();
  achievements.unlock('magic_angle_twisted_graphene');
}

function cycleRegime() {
  magicAngleGrapheneEngine.cycleRegime();
  achievements.unlock('magic_angle_twisted_graphene');
}

function reset() {
  magicAngleGrapheneEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="graphene-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚛️</span>
          <div>
            <h2>魔角扭轉雙層石墨烯平帶 (Magic-Angle Graphene MATBG)</h2>
            <span class="subtitle">Bistritzer-MacDonald Moiré Superlattice & Correlated Superconductivity Dome</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="graphene-svg">
            <defs>
              <pattern id="moireHex" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 24 6.9 L 24 20.8 L 12 27.7 L 0 20.8 L 0 6.9 Z" fill="none" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1" />
              </pattern>
              <linearGradient id="flatBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#34d399" />
                <stop offset="100%" stop-color="#059669" />
              </linearGradient>
            </defs>

            <!-- 深色背景 -->
            <rect width="800" height="320" fill="#021c14" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：莫爾超晶格干涉圖樣 (Moiré Superlattice Honeycomb Interference) -->
            <g transform="translate(60, 60)">
              <!-- 底層石墨烯蜂巢網格 -->
              <rect x="0" y="0" width="300" height="200" fill="url(#moireHex)" opacity="0.6" />

              <!-- 頂層扭轉石墨烯蜂巢網格 (隨扭轉角度旋轉干涉) -->
              <g :transform="`rotate(${state.twistAngleDeg * 4}, 150, 100)`">
                <rect x="0" y="0" width="300" height="200" fill="url(#moireHex)" opacity="0.8" />
              </g>

              <!-- AA 堆疊區 (莫爾波腹，電子局域中心) -->
              <circle
                v-for="(pos, idx) in [
                  {cx: 80, cy: 70}, {cx: 220, cy: 70},
                  {cx: 150, cy: 130}, {cx: 80, cy: 190}, {cx: 220, cy: 190}
                ]"
                :key="'aa-'+idx"
                :cx="pos.cx"
                :cy="pos.cy"
                :r="Math.max(10, 22 - state.flatBandWidthMev * 0.2)"
                fill="rgba(52, 211, 153, 0.3)"
                stroke="#34d399"
                stroke-width="1.5"
              />

              <!-- 莫爾週期 L_M 標註 -->
              <line x1="80" y1="70" x2="220" y2="70" stroke="#facc15" stroke-dasharray="3 3" stroke-width="1.5" />
              <text x="150" y="62" text-anchor="middle" fill="#facc15" font-size="10" font-weight="bold">
                L_M = {{ state.moireSuperlatticePeriodNm }} nm
              </text>
            </g>

            <!-- 右側：平帶色散 E(k) 與超導/莫特相圖 (Dispersion & Phase Diagram) -->
            <g transform="translate(560, 160)">
              <!-- 坐標軸: 動量 k vs 能量 E (meV) -->
              <line x1="-120" y1="90" x2="140" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="-110" y1="90" x2="-110" y2="-90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="145" y="94" fill="rgba(255, 255, 255, 0.6)" font-size="11">k</text>
              <text x="-114" y="-95" fill="rgba(255, 255, 255, 0.6)" font-size="11">E (meV)</text>

              <!-- 費米能級 E_F 基準線 -->
              <line x1="-110" y1="0" x2="130" y2="0" stroke="rgba(255, 255, 255, 0.3)" stroke-dasharray="4 4" stroke-width="1.5" />
              <text x="135" y="4" fill="rgba(255, 255, 255, 0.5)" font-size="9">E_F</text>

              <!-- 魔角超窄活性平帶 (Flat Band: 帶寬 W 壓縮至極限) -->
              <!-- 上平帶 -->
              <path
                :d="`
                  M -110 ${-state.flatBandWidthMev * 1.5}
                  Q 0 ${-state.flatBandWidthMev * 0.5}, 120 ${-state.flatBandWidthMev * 1.5}
                `"
                fill="none"
                stroke="#10b981"
                stroke-width="3"
              />
              <!-- 下平帶 -->
              <path
                :d="`
                  M -110 ${state.flatBandWidthMev * 1.5}
                  Q 0 ${state.flatBandWidthMev * 0.5}, 120 ${state.flatBandWidthMev * 1.5}
                `"
                fill="none"
                stroke="#34d399"
                stroke-width="3"
              />

              <!-- 帶寬 W 雙向標註 -->
              <line x1="50" :y1="-state.flatBandWidthMev * 1.5" x2="50" :y2="state.flatBandWidthMev * 1.5" stroke="#facc15" stroke-width="1.5" />
              <text x="58" y="4" fill="#facc15" font-size="10">W = {{ state.flatBandWidthMev }} meV</text>

              <!-- 非常規超導穹頂 (Superconducting Dome Highlight) -->
              <g v-if="state.superconductingTcKelvin > 0.1" transform="translate(0, 50)">
                <path
                  d="M -50 0 Q 0 -35, 50 0 Z"
                  fill="rgba(16, 185, 129, 0.35)"
                  stroke="#34d399"
                  stroke-width="2"
                />
                <text x="0" y="-12" text-anchor="middle" fill="#34d399" font-size="10" font-weight="bold">
                  超導穹頂 (Tc = {{ state.superconductingTcKelvin }} K)
                </text>
              </g>

              <!-- 莫特絕緣能隙標記 (Mott Gap) -->
              <g v-if="state.mottInsulatingGapMev > 0.5">
                <rect x="-30" :y="-state.mottInsulatingGapMev * 2" width="60" :height="state.mottInsulatingGapMev * 4" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1.5" />
                <text x="0" y="4" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="bold">Mott 能隙</text>
              </g>
            </g>

            <!-- 標註文字 -->
            <text x="60" y="40" fill="#34d399" font-size="12" font-weight="bold">莫爾超晶格幾何干涉 (θ = {{ state.twistAngleDeg }}°)</text>
            <text x="470" y="40" fill="#10b981" font-size="12" font-weight="bold">BM 連續模型活性極窄平帶色散</text>
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
            <div class="label">平帶帶寬 W</div>
            <div class="value cyan">{{ state.flatBandWidthMev }} <span class="unit">meV (極限淬火)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">莫爾庫侖排斥能 U</div>
            <div class="value green">{{ state.coulombInteractionUMev }} <span class="unit">meV (U/W > 3)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">臨界超導轉變溫度 Tc</div>
            <div class="value yellow">{{ state.superconductingTcKelvin }} <span class="unit">K</span></div>
          </div>
          <div class="metric-card">
            <div class="label">莫特絕緣能隙 Δ_Mott</div>
            <div class="value purple">{{ state.mottInsulatingGapMev }} <span class="unit">meV (ν = ±2)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">莫爾超晶格週期 L_M</div>
            <div class="value orange">{{ state.moireSuperlatticePeriodNm }} <span class="unit">nm</span></div>
          </div>
          <div class="metric-card">
            <div class="label">超導相變激發次數</div>
            <div class="value pink">{{ state.superconductingPhaseEventsCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>雙層石墨烯扭轉夾角 θ (度)</span>
              <span class="val-display">{{ state.twistAngleDeg.toFixed(2) }}° (魔角 1.08°)</span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.45"
              step="0.01"
              :value="state.twistAngleDeg"
              @input="updateTwistAngle(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>莫爾填充分數 ν (電子數/單胞)</span>
              <span class="val-display">{{ state.moireFillingFactorNu.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
              step="0.05"
              :value="state.moireFillingFactorNu"
              @input="updateFillingFactor(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>系統溫度 T (Kelvin)</span>
              <span class="val-display">{{ state.temperatureKelvin.toFixed(2) }} K</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="20.0"
              step="0.1"
              :value="state.temperatureKelvin"
              @input="updateTemperature(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>垂直層間電位移場 D (V/nm)</span>
              <span class="val-display">{{ state.perpendicularDisplacementVNm.toFixed(2) }} V/nm</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.80"
              step="0.02"
              :value="state.perpendicularDisplacementVNm"
              @input="updateDisplacementField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerSupercon">
            ⚛️ 激發魔角超導相變穹頂
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
  background: rgba(2, 28, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.graphene-card {
  background: #062b21;
  border: 1px solid rgba(52, 211, 153, 0.3);
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.25);
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
  background: rgba(6, 43, 33, 0.9);
  border-bottom: 1px solid rgba(52, 211, 153, 0.2);
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
  color: #34d399;
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
  background: #021c14;
  border-radius: 10px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  overflow: hidden;
}

.graphene-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(6, 78, 59, 0.5);
  border: 1px solid rgba(52, 211, 153, 0.25);
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
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  border: 1px solid #34d399;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(52, 211, 153, 0.3);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(6, 43, 33, 0.7);
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
.green { color: #34d399; }
.yellow { color: #facc15; }
.purple { color: #c084fc; }
.orange { color: #fb923c; }
.pink { color: #f472b6; }

.controls-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: rgba(6, 43, 33, 0.6);
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
  color: #34d399;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #34d399;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #059669, #10b981);
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
  background: linear-gradient(135deg, #34d399, #059669);
  box-shadow: 0 0 15px rgba(52, 211, 153, 0.4);
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
