<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { superfluidHelium3Engine, type SuperfluidHe3Regime } from '../engine/superfluidHelium3BPhase';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => superfluidHelium3Engine.getState());

const isOpen = computed(() => uiStore.mode === 'superfluid-helium3');

const regimes: Array<{ id: SuperfluidHe3Regime; label: string; desc: string }> = [
  { id: 'isotropic-b-phase-topological', label: '等向拓撲 B 相 (BW 態, Nw = 2)', desc: 'p-波自旋三重態配對，完全等向無節點能隙，具備時間反演對稱性保護，表面湧現無質量二維馬約拉納費米雙錐' },
  { id: 'anisotropic-a-phase-weyl-nodes', label: '各向異性 A 相 (ABM 外爾超流態)', desc: '高壓高溫區軌道動量沿軸向排列，能隙在南北極點閉合形成外爾費米點節點，呈現手性拓撲超流' },
  { id: 'surface-andreev-majorana-bound', label: '表面安德烈夫-馬約拉納束縛態共振相', desc: '表面逆安德烈夫反射捕獲零能馬約拉納準粒子，引發超強高頻橫向聲學阻抗異常吸收峰' },
  { id: 'normal-fermi-liquid-depaired', label: '高溫正常費米液體相 (T > Tc)', desc: '溫度突破毫開爾文超流相變臨界點，庫珀對完全去配對熱解離，退化為朗道正常費米液體' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemperature(val: number) {
  superfluidHelium3Engine.setTemperature(val);
  achievements.unlock('superfluid_helium3_topological_b');
}

function updatePressure(val: number) {
  superfluidHelium3Engine.setPressure(val);
  achievements.unlock('superfluid_helium3_topological_b');
}

function updateLeggettAngle(val: number) {
  superfluidHelium3Engine.setLeggettAngle(val);
  achievements.unlock('superfluid_helium3_topological_b');
}

function triggerResonance() {
  superfluidHelium3Engine.triggerSurfaceAndreevResonance();
  achievements.unlock('superfluid_helium3_topological_b');
}

function cycleRegime() {
  superfluidHelium3Engine.cycleRegime();
  achievements.unlock('superfluid_helium3_topological_b');
}

function reset() {
  superfluidHelium3Engine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="he3-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧪</span>
          <div>
            <h2>超流氦-3 拓撲 B 相與馬約拉納表面費米錐 (Superfluid ³He-B)</h2>
            <span class="subtitle">p-Wave Triplet BW State, Leggett Angle & Class DIII Surface Majorana Cones</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="he3-svg">
            <defs>
              <linearGradient id="cavityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.4" />
                <stop offset="50%" stop-color="#0369a1" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#082f49" stop-opacity="0.9" />
              </linearGradient>
              <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <radialGradient id="majoranaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#67e8f9" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深邃超低溫背景 -->
            <rect width="800" height="320" fill="#040c1a" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：毫開爾文超流氦-3 樣品圓柱低溫腔與表面自旋流 -->
            <g transform="translate(60, 50)">
              <!-- 腔體頂部透視橢圓 (表面態區域) -->
              <ellipse cx="160" cy="50" rx="130" ry="35" fill="url(#cavityGrad)" stroke="#38bdf8" stroke-width="2" />
              <!-- 腔體主體圓柱側面 -->
              <path d="M 30 50 L 30 190 C 30 225, 290 225, 290 190 L 290 50 Z" fill="url(#cavityGrad)" stroke="#0284c7" stroke-width="1.5" opacity="0.8" />
              <!-- 腔體底面透視線 -->
              <ellipse cx="160" cy="190" rx="130" ry="35" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-dasharray="4 4" stroke-width="1.5" />

              <!-- 表面馬約拉納自旋-動量垂直鎖定流環 (Surface Majorana Spin Current) -->
              <ellipse
                v-if="state.superfluidOrderParamDeltaUev > 0"
                cx="160"
                cy="50"
                rx="110"
                ry="28"
                fill="none"
                stroke="#67e8f9"
                stroke-width="2"
                stroke-dasharray="8 6"
                :transform="`rotate(${state.surfaceAndreevBoundCount * 6}, 160, 50)`"
              />

              <!-- 自旋箭頭 (自旋-軌道鎖定) -->
              <g v-if="state.superfluidOrderParamDeltaUev > 0" stroke="#facc15" stroke-width="2">
                <line x1="80" y1="42" x2="60" y2="32" />
                <line x1="240" y1="58" x2="260" y2="68" />
                <text x="50" y="28" fill="#facc15" font-size="10" font-weight="bold">s ⊥ p</text>
              </g>

              <!-- 萊格特角 θ_L 幾何自旋旋轉軸 -->
              <line x1="160" y1="50" :x2="160 + 60 * Math.cos(state.leggettAngleDeg * Math.PI / 180)" :y2="50 - 60 * Math.sin(state.leggettAngleDeg * Math.PI / 180)" stroke="#f43f5e" stroke-width="2.5" />
              <text x="170" y="30" fill="#f43f5e" font-size="10" font-weight="bold">θ_L = {{ state.leggettAngleDeg }}°</text>

              <!-- 腔體中心文字 -->
              <text x="160" y="125" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="bold">
                ³He-B 體態拓撲超流 (Nw = 2)
              </text>
              <text x="160" y="145" text-anchor="middle" fill="#94a3b8" font-size="10">
                P = {{ state.pressureBar }} bar | Tc = {{ state.criticalTemperatureTcMk }} mK
              </text>
            </g>

            <!-- 右側：二維表面馬約拉納雙錐色散 E(k_∥) 與橫向聲阻抗 -->
            <g transform="translate(560, 160)">
              <!-- 坐標軸: 面內動量 k_∥ vs 能量 E -->
              <line x1="-120" y1="0" x2="140" y2="0" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="145" y="4" fill="rgba(255, 255, 255, 0.6)" font-size="11">k_∥</text>
              <text x="-4" y="-105" fill="rgba(255, 255, 255, 0.6)" font-size="11">E</text>

              <!-- 體超流能隙邊界線 ±Δ(T) -->
              <line x1="-110" :y1="-state.superfluidOrderParamDeltaUev * 200" x2="130" :y2="-state.superfluidOrderParamDeltaUev * 200" stroke="rgba(56, 189, 248, 0.3)" stroke-dasharray="4 4" stroke-width="1.5" />
              <line x1="-110" :y1="state.superfluidOrderParamDeltaUev * 200" x2="130" :y2="state.superfluidOrderParamDeltaUev * 200" stroke="rgba(56, 189, 248, 0.3)" stroke-dasharray="4 4" stroke-width="1.5" />
              <text x="135" :y="-state.superfluidOrderParamDeltaUev * 200 + 4" fill="rgba(56, 189, 248, 0.6)" font-size="9">+Δ</text>
              <text x="135" :y="state.superfluidOrderParamDeltaUev * 200 + 4" fill="rgba(56, 189, 248, 0.6)" font-size="9">-Δ</text>

              <!-- 二維表面馬約拉納無質量費米錐 (E = ± c_⊥ |k_∥|) -->
              <g v-if="state.superfluidOrderParamDeltaUev > 0">
                <!-- 上錐 -->
                <polygon
                  :points="`
                    0,0
                    ${-70},${-state.surfaceMajoranaVelocityM_S * 2.2}
                    ${70},${-state.surfaceMajoranaVelocityM_S * 2.2}
                  `"
                  fill="url(#coneGrad)"
                  opacity="0.35"
                  stroke="#38bdf8"
                  stroke-width="2"
                />
                <!-- 下錐 -->
                <polygon
                  :points="`
                    0,0
                    ${-70},${state.surfaceMajoranaVelocityM_S * 2.2}
                    ${70},${state.surfaceMajoranaVelocityM_S * 2.2}
                  `"
                  fill="url(#coneGrad)"
                  opacity="0.35"
                  stroke="#38bdf8"
                  stroke-width="2"
                />

                <!-- 頂點零能馬約拉納態核心光斑 -->
                <circle cx="0" cy="0" r="6" fill="url(#majoranaGlow)" />
                <text x="12" y="-6" fill="#ffffff" font-size="11" font-weight="bold">γ(0)</text>
              </g>

              <!-- 橫向聲學阻抗 Z_⊥ 吸收曲線標記 -->
              <g transform="translate(0, 70)">
                <text x="0" y="16" text-anchor="middle" fill="#67e8f9" font-size="10">
                  橫向聲阻抗 Z_⊥ = {{ state.transverseAcousticImpedanceMpaS_M }} MPa·s/m
                </text>
              </g>
            </g>

            <!-- 標註文字 -->
            <text x="60" y="35" fill="#38bdf8" font-size="12" font-weight="bold">B相 p-波三重態低溫超流腔</text>
            <text x="470" y="35" fill="#67e8f9" font-size="12" font-weight="bold">表面無質量馬約拉納錐 (E = c_⊥ |k|)</text>
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
            <div class="label">超流能隙序參量 Δ(T)</div>
            <div class="value cyan">{{ state.superfluidOrderParamDeltaUev }} <span class="unit">μeV (等向能隙)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">臨界超流溫度 Tc</div>
            <div class="value green">{{ state.criticalTemperatureTcMk }} <span class="unit">mK</span></div>
          </div>
          <div class="metric-card">
            <div class="label">表面馬約拉納速度 c_⊥</div>
            <div class="value yellow">{{ state.surfaceMajoranaVelocityM_S }} <span class="unit">m/s</span></div>
          </div>
          <div class="metric-card">
            <div class="label">橫向高頻聲阻抗 Z_⊥</div>
            <div class="value purple">{{ state.transverseAcousticImpedanceMpaS_M }} <span class="unit">MPa·s/m</span></div>
          </div>
          <div class="metric-card">
            <div class="label">表面拓撲自旋流密度</div>
            <div class="value orange">{{ state.surfaceSpinCurrentDensityNaM }} <span class="unit">nA/m</span></div>
          </div>
          <div class="metric-card">
            <div class="label">表面束縛態激發次數</div>
            <div class="value pink">{{ state.surfaceAndreevBoundCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>系統溫度 T (milli-Kelvin)</span>
              <span class="val-display">{{ state.temperatureMilliKelvin.toFixed(2) }} mK</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.5"
              step="0.05"
              :value="state.temperatureMilliKelvin"
              @input="updateTemperature(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>腔體壓力 P (bar)</span>
              <span class="val-display">{{ state.pressureBar.toFixed(1) }} bar</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="34.0"
              step="0.5"
              :value="state.pressureBar"
              @input="updatePressure(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>萊格特自旋-軌道角 θ_L (度)</span>
              <span class="val-display">{{ state.leggettAngleDeg.toFixed(1) }}° (經典 104°)</span>
            </div>
            <input
              type="range"
              min="45.0"
              max="160.0"
              step="1.0"
              :value="state.leggettAngleDeg"
              @input="updateLeggettAngle(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerResonance">
            🧪 激發表面安德烈夫-馬約拉納共振
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
  background: rgba(4, 12, 26, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.he3-card {
  background: #091a33;
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 40px rgba(2, 132, 199, 0.25);
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
  background: rgba(9, 26, 51, 0.9);
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
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
  color: #38bdf8;
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
  background: #040c1a;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  overflow: hidden;
}

.he3-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.25);
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
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid #38bdf8;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn.cycle:hover {
  background: rgba(56, 189, 248, 0.3);
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
  color: #38bdf8;
  font-weight: bold;
}

input[type="range"] {
  accent-color: #38bdf8;
  cursor: pointer;
}

.actions-panel {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 2;
  background: linear-gradient(135deg, #0284c7, #0369a1);
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
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
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
