<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { quantumIslandEngine, type QuantumIslandRegime } from '../engine/quantumIslandReactor';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => quantumIslandEngine.getState());

const isOpen = computed(() => uiStore.mode === 'quantum-island');

const regimes: Array<{ id: QuantumIslandRegime; label: string; desc: string }> = [
  { id: 'pre-page-hawking', label: '佩吉前單調相', desc: '霍金天真輻射熵單調增長' },
  { id: 'qes-island-turnaround', label: '量子極值面湧現', desc: 'S_gen 極值化觸發佩吉轉折' },
  { id: 'entanglement-wedge-recovery', label: '糾纏楔重建', desc: '黑洞內部納入輻射糾纏楔' },
  { id: 'hayden-preskill-decoding', label: '希登-普雷斯基爾', desc: '全息 Petz 映射超高保真解碼' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateEvapTime(val: number) {
  quantumIslandEngine.setParameters({ evaporationTimeNormalized: val });
}

function updateL(val: number) {
  quantumIslandEngine.setParameters({ adSCurvatureRadiusL: val });
}

function updateG(val: number) {
  quantumIslandEngine.setParameters({ bathCouplingConstantG: val });
}

function updateGN(val: number) {
  quantumIslandEngine.setParameters({ newtonConstantGN: val });
}

function selectRegime(regime: QuantumIslandRegime) {
  quantumIslandEngine.setParameters({ regime });
  achievements.unlock('quantum_island_reactor');
}

function triggerDecoding() {
  quantumIslandEngine.triggerPetzMapDecoding();
  achievements.unlock('quantum_island_reactor');
}

function stepEvaporation() {
  quantumIslandEngine.advancePageEvaporation(0.05);
  achievements.unlock('quantum_island_reactor');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="island-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">🏝️</span>
          <div>
            <h2>AdS/BCFT 邊界量子島黑洞資訊恢復反應堆</h2>
            <p class="subtitle">Quantum Extremal Surface & Entanglement Wedge Petz Map Recovery Array</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 雙視圖展示：全息龐加萊幾何與佩吉曲線 -->
        <section class="visualizer-grid">
          <!-- 龐加萊圓盤與量子島視圖 -->
          <div class="vis-card">
            <div class="vis-card-title">
              <span>全息龐加萊切面與量子島 (AdS/BCFT)</span>
              <span class="badge" :class="{ active: state.isIslandFormed }">
                {{ state.isIslandFormed ? '量子島 I 已湧現 (QES)' : '未形成島 (I = ∅)' }}
              </span>
            </div>
            <div class="svg-wrapper">
              <svg viewBox="0 0 260 220" class="poincare-svg">
                <defs>
                  <radialGradient id="adsBulk" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#020617" />
                    <stop offset="70%" stop-color="#091830" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2" />
                  </radialGradient>
                  <radialGradient id="horizonGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#000000" />
                    <stop offset="85%" stop-color="#0f172a" />
                    <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6" />
                  </radialGradient>
                  <filter id="qesGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- AdS 邊界外圍 CFT 浴 (Bath R) -->
                <circle cx="130" cy="110" r="95" fill="url(#adsBulk)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2" />

                <!-- 霍金輻射浴粒子環 -->
                <g class="bath-particles">
                  <circle cx="225" cy="110" r="3" fill="#f59e0b" />
                  <circle cx="35" cy="110" r="3" fill="#f59e0b" />
                  <circle cx="130" cy="15" r="3" fill="#f59e0b" />
                  <circle cx="130" cy="205" r="3" fill="#f59e0b" />
                  <circle cx="197" cy="43" r="2.5" fill="#f59e0b" />
                  <circle cx="63" cy="177" r="2.5" fill="#f59e0b" />
                </g>

                <!-- 黑洞事件視界 -->
                <circle cx="130" cy="110" r="55" fill="url(#horizonGrad)" stroke="#f43f5e" stroke-width="1.5" />
                <text x="130" y="114" fill="#94a3b8" font-size="9" text-anchor="middle">黑洞內部</text>

                <!-- 量子島區域 (當 isIslandFormed 為真時展示) -->
                <g v-if="state.isIslandFormed">
                  <!-- 量子極值面 (QES = \partial I) -->
                  <circle
                    cx="130"
                    cy="110"
                    :r="Math.max(12, 50 * state.islandRadiusRatio)"
                    fill="#10b981"
                    fill-opacity="0.3"
                    stroke="#34d399"
                    stroke-width="2"
                    filter="url(#qesGlow)"
                  />
                  <!-- 糾纏楔虛線連接至輻射浴 -->
                  <line x1="130" y1="110" x2="225" y2="110" stroke="#34d399" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.7" />
                  <line x1="130" y1="110" x2="35" y2="110" stroke="#34d399" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.7" />
                  <text x="130" y="102" fill="#6ee7b7" font-size="10" font-weight="700" text-anchor="middle">量子島 I</text>
                  <text x="130" y="126" fill="#a7f3d0" font-size="7.5" text-anchor="middle">QES \partial I</text>
                </g>

                <!-- 標記文字 -->
                <text x="130" y="215" fill="#38bdf8" font-size="9" text-anchor="middle">邊界 CFT 浴 R</text>
              </svg>
            </div>
          </div>

          <!-- 佩吉曲線即時動態圖 -->
          <div class="vis-card">
            <div class="vis-card-title">
              <span>么正性佩吉曲線 (Page Curve)</span>
              <span class="text-sub">t_Page = {{ state.pageTimeNormalized }}</span>
            </div>
            <div class="svg-wrapper">
              <svg viewBox="0 0 260 220" class="page-chart-svg">
                <!-- 網格與坐標軸 -->
                <line x1="30" y1="180" x2="245" y2="180" stroke="#334155" stroke-width="1.5" />
                <line x1="30" y1="20" x2="30" y2="180" stroke="#334155" stroke-width="1.5" />
                <text x="240" y="195" fill="#64748b" font-size="8.5" text-anchor="end">蒸發時間 t</text>
                <text x="18" y="25" fill="#64748b" font-size="8.5">熵 S</text>

                <!-- 霍金單調遞增曲線 (紅色虛線) -->
                <line x1="30" y1="180" x2="230" y2="40" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.65" />
                <text x="235" y="45" fill="#f43f5e" font-size="7.5">S_Hawking</text>

                <!-- 量子島廣義熵曲線 (綠色向下曲線) -->
                <path d="M 125 105 Q 180 130 230 175" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.6" />
                <text x="232" y="170" fill="#10b981" font-size="7.5">S_island</text>

                <!-- 么正佩吉曲線實線 (青色粗線) -->
                <!-- 從 (30, 180) 上升到 (126, 105) 再下降至 (230, 175) -->
                <path d="M 30 180 L 126 105 Q 180 130 230 175" fill="none" stroke="#38bdf8" stroke-width="2.5" />

                <!-- 當前蒸發進度指示線 -->
                <!-- x 坐標映射: 30 + 200 * t -->
                <line
                  :x1="30 + 200 * state.evaporationTimeNormalized"
                  y1="20"
                  :x2="30 + 200 * state.evaporationTimeNormalized"
                  y2="180"
                  stroke="#fbbf24"
                  stroke-width="1.5"
                  stroke-dasharray="3 3"
                />
                <circle
                  :cx="30 + 200 * state.evaporationTimeNormalized"
                  :cy="state.evaporationTimeNormalized < state.pageTimeNormalized ? 180 - 75 * (state.evaporationTimeNormalized / state.pageTimeNormalized) : 105 + 70 * ((state.evaporationTimeNormalized - state.pageTimeNormalized) / (1 - state.pageTimeNormalized))"
                  r="4.5"
                  fill="#fbbf24"
                />
                <text :x="30 + 200 * state.evaporationTimeNormalized" y="16" fill="#fbbf24" font-size="8" text-anchor="middle">
                  t = {{ state.evaporationTimeNormalized.toFixed(2) }}
                </text>
              </svg>
            </div>
          </div>
        </section>

        <!-- 關鍵物理指標網格 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">細粒度糾纏熵 S(R)</span>
            <span class="m-value text-cyan">{{ state.pageEntropy }} <small>nat</small></span>
            <span class="m-sub">佩吉極值 min(S_H, S_I)</span>
          </div>

          <div class="metric-box">
            <span class="m-label">資訊解碼保真度 F</span>
            <span class="m-value" :class="state.decodingFidelityPct > 80 ? 'text-green' : 'text-amber'">
              {{ state.decodingFidelityPct }}%
            </span>
            <span class="m-sub">Petz 映射量子重構</span>
          </div>

          <div class="metric-box">
            <span class="m-label">QES 面積幾何項</span>
            <span class="m-value text-emerald">{{ state.qesAreaTerm }} <small>nat</small></span>
            <span class="m-sub">Area(\partial I) / 4G_N</span>
          </div>

          <div class="metric-box">
            <span class="m-label">佩吉時間轉折點 t_Page</span>
            <span class="m-value text-sky">{{ state.pageTimeNormalized }}</span>
            <span class="m-sub">當前蒸發: {{ (state.evaporationTimeNormalized * 100).toFixed(0) }}%</span>
          </div>
        </section>

        <!-- 模式切換 -->
        <section class="regimes-card">
          <h3>全息理論相態 (Holographic Regimes)</h3>
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
          <h3>黑洞蒸發與全息參數調諧</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>蒸發時間進度 t / t_evap:</span>
                <b>{{ state.evaporationTimeNormalized.toFixed(2) }}</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                :value="state.evaporationTimeNormalized"
                @input="updateEvapTime(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>AdS 曲率半徑 L_AdS:</span>
                <b>{{ state.adSCurvatureRadiusL.toFixed(1) }}</b>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.adSCurvatureRadiusL"
                @input="updateL(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>輻射浴耦合常數 g_bath:</span>
                <b>{{ state.bathCouplingConstantG.toFixed(2) }}</b>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                :value="state.bathCouplingConstantG"
                @input="updateG(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>有效牛頓引力常數 G_N:</span>
                <b>{{ state.newtonConstantGN.toFixed(2) }}</b>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.50"
                step="0.01"
                :value="state.newtonConstantGN"
                @input="updateGN(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn petz-btn" @click="triggerDecoding">
              🔮 Petz 逆映射內部資訊解碼 (Reconstruct Qubits)
            </button>
            <button class="action-btn step-btn" @click="stepEvaporation">
              ⏳ 步進黑洞霍金蒸發階段 (+5%)
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

.island-modal {
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.15);
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

.visualizer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.vis-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 12px;
}

.vis-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.badge.active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

.text-sub {
  font-size: 0.72rem;
  color: #64748b;
  font-family: monospace;
}

.svg-wrapper {
  background: #060b13;
  border-radius: 8px;
  border: 1px solid #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.poincare-svg, .page-chart-svg {
  width: 100%;
  max-height: 185px;
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
.text-sky { color: #0284c7; }
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
  border-color: #38bdf8;
}

.regime-btn.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
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
  color: #38bdf8;
  font-family: monospace;
}

input[type="range"] {
  accent-color: #38bdf8;
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

.petz-btn {
  background: #8b5cf6;
  color: #fff;
}

.petz-btn:hover {
  background: #7c3aed;
}

.step-btn {
  background: #0284c7;
  color: #fff;
}

.step-btn:hover {
  background: #0369a1;
}

@media (max-width: 768px) {
  .visualizer-grid, .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
