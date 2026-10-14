<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { blackHoleQuantumEchoesEngine, type BlackHoleEchoRegime } from '../engine/blackHoleQuantumEchoes';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => blackHoleQuantumEchoesEngine.getState());

const isOpen = computed(() => uiStore.mode === 'black-hole-echoes');

const regimes: Array<{ id: BlackHoleEchoRegime; label: string; desc: string }> = [
  { id: 'classical-black-hole-no-echo', label: '經典廣義相對論無毛黑洞純吸收態', desc: '事件視界為單向完全吸收邊界 (R_hor = 0)，外來引力波完全陷入視界無任何回聲反射' },
  { id: 'planckian-quantum-membrane-resonance', label: '普朗克微觀量子反射膜空腔諧振態', desc: '視界外普朗克尺度 Δr ~ ℓ_P 存在微觀量子膜表面 (R_hor > 0.85)，光子球與膜構成超高 Q 值諧振腔' },
  { id: 'periodic-gravitational-wave-echo-train', label: '週期性衰減引力波量子迴聲脈衝串發射相', desc: '主並合鈴鳴 (Ringdown) 之後，引力波在空腔多次反彈，以特徵延遲 Δt_echo 週期性發射衰減迴聲串' },
  { id: 'fuzzball-microstate-dispersion-echoes', label: '模糊球微觀態非均勻色散迴聲相', desc: '弦論無奇點模糊球微觀幾何具有豐富的多重干涉與拓撲色散，引發非等間距調製微弱波包迴聲' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateMass(val: number) {
  blackHoleQuantumEchoesEngine.setBlackHoleMass(val);
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function updateDistance(val: number) {
  blackHoleQuantumEchoesEngine.setQuantumMembraneDistance(val);
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function updateReflectivity(val: number) {
  blackHoleQuantumEchoesEngine.setHorizonReflectivity(val);
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function updateTransmission(val: number) {
  blackHoleQuantumEchoesEngine.setPhotonSphereTransmission(val);
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function triggerEchoBurst() {
  blackHoleQuantumEchoesEngine.triggerQuantumEchoesBurst();
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function cycleRegime() {
  blackHoleQuantumEchoesEngine.cycleRegime();
  achievements.unlock('black_hole_quantum_horizon_echoes');
}

function reset() {
  blackHoleQuantumEchoesEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="echoes-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🪐</span>
          <div>
            <h2>黑洞量子視界引力波迴聲 (Black Hole Quantum Echoes)</h2>
            <span class="subtitle">Planckian Horizon Membrane, Effective Cavity Resonances & Decaying GW Echo Trains</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="echoes-svg">
            <defs>
              <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="70%" stop-color="#1e1035" />
                <stop offset="100%" stop-color="#581c87" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="barrierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.8" />
              </linearGradient>
            </defs>

            <!-- 深邃宇宙背景 -->
            <rect width="800" height="320" fill="#05050f" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：黑洞剖面、普朗克量子膜與光子球空腔模型 -->
            <g transform="translate(60, 60)">
              <!-- 黑洞幾何中心奇異點 -->
              <circle cx="160" cy="100" r="45" fill="url(#singularityGlow)" stroke="#c084fc" stroke-width="2" />
              <text x="160" y="104" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">r = 2M 視界</text>

              <!-- 普朗克量子反射膜 (距視界 Δr ~ ℓ_P) -->
              <!-- 膜外圈半徑隨反射率高亮 -->
              <circle
                cx="160"
                cy="100"
                :r="55 + state.quantumMembraneDistancePlanck * 2"
                fill="none"
                :stroke="state.horizonReflectivityRatio > 0.05 ? '#e879f9' : 'rgba(255,255,255,0.1)'"
                :stroke-width="state.horizonReflectivityRatio > 0.05 ? 2.5 : 1"
                stroke-dasharray="3 3"
              />
              <text
                v-if="state.horizonReflectivityRatio > 0.05"
                x="160"
                :y="38 - state.quantumMembraneDistancePlanck * 2"
                text-anchor="middle"
                fill="#e879f9"
                font-size="10"
                font-weight="bold"
              >
                量子膜 (R = {{ (state.horizonReflectivityRatio * 100).toFixed(0) }}%)
              </text>

              <!-- 光子球有效勢壘 (r = 3M) -->
              <circle cx="160" cy="100" r="105" fill="none" stroke="#a855f7" stroke-width="2" />
              <text x="160" y="-12" text-anchor="middle" fill="#a855f7" font-size="11" font-weight="bold">光子球勢壘 (r = 3M)</text>

              <!-- 空腔內引力波反彈路徑 (Cavity Reflections) -->
              <g v-if="state.horizonReflectivityRatio > 0.05">
                <line x1="160" y1="-5" x2="160" :y2="45 - state.quantumMembraneDistancePlanck * 2" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 2" />
                <line x1="160" y1="205" x2="160" :y2="155 + state.quantumMembraneDistancePlanck * 2" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 2" />
                <line x1="55" y1="100" :x2="105 - state.quantumMembraneDistancePlanck * 2" y2="100" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 2" />
                <line x1="265" y1="100" :x2="215 + state.quantumMembraneDistancePlanck * 2" y2="100" stroke="#f472b6" stroke-width="2" stroke-dasharray="4 2" />
              </g>

              <!-- 標註文字 -->
              <text x="160" y="225" text-anchor="middle" fill="#cbd5e1" font-size="11">
                黑洞質量 M = {{ state.blackHoleMassSolar }} M_☉ | 膜距 = {{ state.quantumMembraneDistancePlanck }} ℓ_P
              </text>
            </g>

            <!-- 右側：時域引力波主鈴鳴與週期性量子迴聲波形圖 (GW Strain h(t)) -->
            <g transform="translate(520, 160)">
              <!-- 坐標軸: 時間 t (ms) vs 應變 h(t) -->
              <line x1="-80" y1="0" x2="220" y2="0" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <line x1="-80" y1="-90" x2="-80" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />
              <text x="225" y="4" fill="rgba(255, 255, 255, 0.6)" font-size="11">t (ms)</text>
              <text x="-84" y="-95" fill="rgba(255, 255, 255, 0.6)" font-size="11">Strain h(t)</text>

              <!-- 主並合鈴鳴峰 (Primary Ringdown Peak at t = 0) -->
              <path
                d="
                  M -80 0
                  Q -70 -75, -60 70
                  T -45 -50
                  T -30 30
                  T -15 0
                "
                fill="none"
                stroke="#c084fc"
                stroke-width="3"
              />
              <text x="-55" y="-80" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">主鈴鳴 (Ringdown)</text>

              <!-- 週期性量子迴聲序列 (Echo 1, Echo 2, Echo 3) -->
              <g v-if="state.horizonReflectivityRatio > 0.05">
                <!-- 第一迴聲 (Echo 1 at t = Δt_echo) -->
                <path
                  :d="`
                    M 20 0
                    Q 28 ${-50 * state.echoDampingFactorRatio}, 36 ${45 * state.echoDampingFactorRatio}
                    T 48 ${-25 * state.echoDampingFactorRatio}
                    T 60 0
                  `"
                  fill="none"
                  stroke="#e879f9"
                  stroke-width="2.5"
                />
                <text x="40" y="-45" text-anchor="middle" fill="#e879f9" font-size="9" font-weight="bold">Echo 1</text>

                <!-- 第二迴聲 (Echo 2 at t = 2 Δt_echo) -->
                <path
                  :d="`
                    M 95 0
                    Q 103 ${-50 * Math.pow(state.echoDampingFactorRatio, 2)}, 111 ${45 * Math.pow(state.echoDampingFactorRatio, 2)}
                    T 123 ${-25 * Math.pow(state.echoDampingFactorRatio, 2)}
                    T 135 0
                  `"
                  fill="none"
                  stroke="#e879f9"
                  stroke-width="2"
                  opacity="0.8"
                />
                <text x="115" y="-30" text-anchor="middle" fill="#e879f9" font-size="9" font-weight="bold">Echo 2</text>

                <!-- 第三迴聲 (Echo 3 at t = 3 Δt_echo) -->
                <path
                  :d="`
                    M 170 0
                    Q 178 ${-50 * Math.pow(state.echoDampingFactorRatio, 3)}, 186 ${45 * Math.pow(state.echoDampingFactorRatio, 3)}
                    T 198 ${-25 * Math.pow(state.echoDampingFactorRatio, 3)}
                    T 210 0
                  `"
                  fill="none"
                  stroke="#e879f9"
                  stroke-width="1.5"
                  opacity="0.6"
                />
                <text x="190" y="-18" text-anchor="middle" fill="#e879f9" font-size="9">Echo 3</text>

                <!-- 迴聲延遲雙向標註箭頭 -->
                <line x1="-15" y1="40" x2="20" y2="40" stroke="#facc15" stroke-width="1.5" />
                <text x="2" y="55" text-anchor="middle" fill="#facc15" font-size="10">Δt = {{ state.echoDelayTimeMs }} ms</text>
              </g>

              <g v-else transform="translate(60, -20)">
                <text x="0" y="20" fill="rgba(255, 255, 255, 0.4)" font-size="11">無迴聲 (經典純黑洞邊界)</text>
              </g>
            </g>

            <!-- 標註文字 -->
            <text x="60" y="35" fill="#c084fc" font-size="12" font-weight="bold">黑洞視界量子反射膜與光子球空腔</text>
            <text x="470" y="35" fill="#e879f9" font-size="12" font-weight="bold">衰減引力波量子迴聲序列 (Echo Train)</text>
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
            <div class="label">迴聲時間間隔 Δt_echo</div>
            <div class="value cyan">{{ state.echoDelayTimeMs }} <span class="unit">ms</span></div>
          </div>
          <div class="metric-card">
            <div class="label">相鄰迴聲衰減因子</div>
            <div class="value purple">{{ state.echoDampingFactorRatio }} <span class="unit">倍 (A_n+1 / A_n)</span></div>
          </div>
          <div class="metric-card">
            <div class="label">空腔諧振品質因數 Q</div>
            <div class="value green">{{ state.cavityQualityFactorQ }} <span class="unit"></span></div>
          </div>
          <div class="metric-card">
            <div class="label">準正規模式頻率 f_QNM</div>
            <div class="value yellow">{{ state.fundamentalQuasinormalFreqHz }} <span class="unit">Hz</span></div>
          </div>
          <div class="metric-card">
            <div class="label">視界膜反射率 R_hor</div>
            <div class="value orange">{{ (state.horizonReflectivityRatio * 100).toFixed(1) }} <span class="unit">%</span></div>
          </div>
          <div class="metric-card">
            <div class="label">累計偵測迴聲次數</div>
            <div class="value pink">{{ state.detectedEchoesTrainCount.toLocaleString() }} <span class="unit">次</span></div>
          </div>
        </div>

        <!-- 參數調節滑桿群 -->
        <div class="controls-panel">
          <div class="control-row">
            <div class="control-label">
              <span>黑洞質量 M (太陽質量 M_☉)</span>
              <span class="val-display">{{ state.blackHoleMassSolar.toFixed(1) }} M_☉</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="120.0"
              step="1.0"
              :value="state.blackHoleMassSolar"
              @input="updateMass(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>視界膜微觀距離 Δr / ℓ_P</span>
              <span class="val-display">{{ state.quantumMembraneDistancePlanck.toFixed(1) }} ℓ_P</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              :value="state.quantumMembraneDistancePlanck"
              @input="updateDistance(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>量子視界膜反射率 R_hor</span>
              <span class="val-display">{{ (state.horizonReflectivityRatio * 100).toFixed(0) }}%</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.99"
              step="0.01"
              :value="state.horizonReflectivityRatio"
              @input="updateReflectivity(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="control-row">
            <div class="control-label">
              <span>光子球勢壘穿透率 T_barrier</span>
              <span class="val-display">{{ (state.photonSphereTransmissionRatio * 100).toFixed(0) }}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              :value="state.photonSphereTransmissionRatio"
              @input="updateTransmission(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="actions-panel">
          <button class="btn-primary" @click="triggerEchoBurst">
            🪐 激發並合鈴鳴與量子迴聲脈衝序列
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
  background: rgba(5, 5, 15, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.echoes-card {
  background: #0f0a1c;
  border: 1px solid rgba(192, 132, 252, 0.3);
  box-shadow: 0 0 40px rgba(147, 51, 234, 0.25);
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
  background: rgba(15, 10, 28, 0.9);
  border-bottom: 1px solid rgba(192, 132, 252, 0.2);
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
  background: #05050f;
  border-radius: 10px;
  border: 1px solid rgba(192, 132, 252, 0.2);
  overflow: hidden;
}

.echoes-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(192, 132, 252, 0.25);
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
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-btn.cycle {
  background: rgba(192, 132, 252, 0.15);
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
  background: rgba(192, 132, 252, 0.3);
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
  background: linear-gradient(135deg, #c084fc, #7c3aed);
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
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
