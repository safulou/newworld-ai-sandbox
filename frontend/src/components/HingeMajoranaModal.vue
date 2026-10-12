<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { hingeMajoranaEngine, type HingeMajoranaRegime } from '../engine/hingeMajoranaSuperconductor';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => hingeMajoranaEngine.getState());

const isOpen = computed(() => uiStore.mode === 'hinge-majorana');

const regimes: Array<{ id: HingeMajoranaRegime; label: string; desc: string }> = [
  { id: 'chiral-hinge-majorana', label: '手性鉸鏈態', desc: '1D 四邊界無耗散單向傳播模' },
  { id: 'corner-zero-mode', label: '頂角零能模', desc: '8 頂點二階拓撲束縛態' },
  { id: 'surface-mass-inversion', label: '表面質量反轉', desc: 'Mx/My 相鄰域壁狄拉克零點' },
  { id: 'fractional-thermal-hall', label: '半整數熱霍爾', desc: '嚴格量子化 c/2 = 0.50 傳導' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateGap(val: number) {
  hingeMajoranaEngine.setParameters({ bulkPairingGapDeltaMev: val });
}

function updateZeeman(val: number) {
  hingeMajoranaEngine.setParameters({ zeemanExchangeFieldTesla: val });
}

function updateDisorder(val: number) {
  hingeMajoranaEngine.setParameters({ hingeDisorderPotentialMev: val });
}

function updateTemp(val: number) {
  hingeMajoranaEngine.setParameters({ operatingTempKelvin: val });
}

function selectRegime(regime: HingeMajoranaRegime) {
  hingeMajoranaEngine.setParameters({ regime });
  achievements.unlock('hinge_majorana_superconductor');
}

function toggleDomainWall() {
  hingeMajoranaEngine.invertSurfaceDomainWall();
  achievements.unlock('hinge_majorana_superconductor');
}

function pumpBraiding() {
  hingeMajoranaEngine.pumpHingeBraidingStep();
  achievements.unlock('hinge_majorana_superconductor');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="hinge-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">📐</span>
          <div>
            <h2>三維二階拓撲超導馬約拉納手性鉸鏈態晶片</h2>
            <p class="subtitle">Higher-Order Topological Superconductor 1D Chiral Majorana Hinge Resonator</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 3D 晶體等角投影與手性鉸鏈流視覺化 -->
        <section class="visualizer-card">
          <div class="vis-header">
            <h3>HOTSC 等角晶格與 1D 馬約拉納鉸鏈邊界流</h3>
            <span class="badge" :class="{ reversed: state.isReversedChirality }">
              {{ state.isReversedChirality ? '逆向手性傳播 (k_z < 0)' : '正向手性傳播 (k_z > 0)' }}
            </span>
          </div>

          <div class="svg-container">
            <svg viewBox="0 0 500 300" class="hinge-svg">
              <defs>
                <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
                <linearGradient id="frontFace" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#0369a1" stop-opacity="0.08" />
                </linearGradient>
                <linearGradient id="rightFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#059669" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#047857" stop-opacity="0.08" />
                </linearGradient>
                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- 等角 3D 立方體頂面 -->
              <polygon points="250,50 370,110 250,170 130,110" fill="url(#topFace)" stroke="#334155" stroke-width="1.5" />
              <!-- 等角 3D 立方體正面 (X-面) -->
              <polygon points="130,110 250,170 250,260 130,200" fill="url(#frontFace)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4" />
              <!-- 等角 3D 立方體右面 (Y-面) -->
              <polygon points="250,170 370,110 370,200 250,260" fill="url(#rightFace)" stroke="#34d399" stroke-width="1.5" stroke-opacity="0.4" />

              <!-- 表面質量標籤 -->
              <text x="180" y="195" fill="#38bdf8" font-size="11" font-weight="600" opacity="0.9">X-面 (M_x > 0)</text>
              <text x="300" y="195" fill="#34d399" font-size="11" font-weight="600" opacity="0.9">Y-面 (M_y < 0)</text>
              <text x="235" y="115" fill="#94a3b8" font-size="10">全能隙塊體</text>

              <!-- 1D 手性馬約拉納鉸鏈態光束 (四條垂直與交界邊線) -->
              <!-- 中央相交鉸鏈 (X/Y 域壁) -->
              <line
                x1="250" y1="170" x2="250" y2="260"
                stroke="#10b981"
                stroke-width="4"
                stroke-linecap="round"
                stroke-dasharray="8 4"
                :class="['chiral-beam', state.isReversedChirality ? 'reverse' : 'forward']"
                filter="url(#glowGreen)"
              />
              <!-- 左外鉸鏈 -->
              <line
                x1="130" y1="110" x2="130" y2="200"
                stroke="#06b6d4"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-dasharray="8 4"
                :class="['chiral-beam', state.isReversedChirality ? 'forward' : 'reverse']"
                filter="url(#glowCyan)"
              />
              <!-- 右外鉸鏈 -->
              <line
                x1="370" y1="110" x2="370" y2="200"
                stroke="#06b6d4"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-dasharray="8 4"
                :class="['chiral-beam', state.isReversedChirality ? 'forward' : 'reverse']"
                filter="url(#glowCyan)"
              />
              <!-- 頂部後側鉸鏈 -->
              <line
                x1="250" y1="50" x2="250" y2="140"
                stroke="#10b981"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-dasharray="6 3"
                opacity="0.6"
              />

              <!-- 頂角馬約拉納束縛態圓點 (在 corner-zero-mode 模式顯著發光) -->
              <g v-if="state.regime === 'corner-zero-mode'" class="corner-nodes">
                <circle cx="250" cy="170" r="6" fill="#f43f5e" filter="url(#glowCyan)" />
                <circle cx="250" cy="260" r="6" fill="#f43f5e" filter="url(#glowCyan)" />
                <circle cx="130" cy="110" r="5" fill="#f43f5e" />
                <circle cx="130" cy="200" r="5" fill="#f43f5e" />
                <circle cx="370" cy="110" r="5" fill="#f43f5e" />
                <circle cx="370" cy="200" r="5" fill="#f43f5e" />
                <circle cx="250" cy="50"  r="5" fill="#f43f5e" />
              </g>

              <!-- 手性流動標註與公式浮水印 -->
              <text x="20" y="30" fill="#64748b" font-size="11" font-family="monospace">
                E(k_z) = \hbar v_F k_z | K_H = 0.50 K_0 | N_hinge = {{ state.topologicalWindingNumber }}
              </text>
            </svg>
          </div>
        </section>

        <!-- 物理指標卡片 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">馬約拉納費米速度 v_F</span>
            <span class="m-value text-cyan">{{ state.majoranaVelocityKmS }} <small>km/s</small></span>
            <span class="m-sub">1D 線性狄拉克色散率</span>
          </div>

          <div class="metric-box">
            <span class="m-label">熱霍爾電導比 K_H / K_0</span>
            <span class="m-value" :class="Math.abs(state.thermalHallConductanceRatio - 0.5) < 0.03 ? 'text-green' : 'text-amber'">
              {{ state.thermalHallConductanceRatio.toFixed(3) }}
            </span>
            <span class="m-sub">理論半整數量子化基準 0.500</span>
          </div>

          <div class="metric-box">
            <span class="m-label">鉸鏈態橫向局域長度 \xi_H</span>
            <span class="m-value text-emerald">{{ state.hingeLocalizationLengthNm }} <small>nm</small></span>
            <span class="m-sub">域壁橫向包絡寬度</span>
          </div>

          <div class="metric-box">
            <span class="m-label">手性準粒子電流 I_chiral</span>
            <span class="m-value text-sky">{{ state.chiralCurrentNa.toFixed(2) }} <small>nA</small></span>
            <span class="m-sub">方向: {{ state.isReversedChirality ? '-k_z' : '+k_z' }}</span>
          </div>
        </section>

        <!-- 拓撲相選擇 -->
        <section class="regimes-card">
          <h3>拓撲操作態模式 (Topological Regimes)</h3>
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

        <!-- 控制滑桿與互動觸發 -->
        <section class="controls-card">
          <h3>物理場調諧與編織激發</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>塊體配對能隙 \Delta_0:</span>
                <b>{{ state.bulkPairingGapDeltaMev.toFixed(2) }} meV</b>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                :value="state.bulkPairingGapDeltaMev"
                @input="updateGap(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>塞曼交換磁場 B_z:</span>
                <b>{{ state.zeemanExchangeFieldTesla.toFixed(2) }} T</b>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.1"
                :value="state.zeemanExchangeFieldTesla"
                @input="updateZeeman(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>鉸鏈雜質無序能勢 V_dis:</span>
                <b>{{ state.hingeDisorderPotentialMev.toFixed(2) }} meV</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.05"
                :value="state.hingeDisorderPotentialMev"
                @input="updateDisorder(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>晶片操作溫度 T:</span>
                <b>{{ state.operatingTempKelvin.toFixed(2) }} K</b>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.50"
                step="0.01"
                :value="state.operatingTempKelvin"
                @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn wall-btn" @click="toggleDomainWall">
              🔄 表面域壁磁化反轉 (Invert Chirality)
            </button>
            <button class="action-btn braid-btn" @click="pumpBraiding">
              ⚡ 鉸鏈馬約拉納編織週期步進 (Braiding Step)
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

.hinge-modal {
  width: 100%;
  max-width: 860px;
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
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.badge.reversed {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.4);
}

.svg-container {
  display: flex;
  justify-content: center;
  background: #060b13;
  border-radius: 8px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.hinge-svg {
  width: 100%;
  max-height: 240px;
}

@keyframes beamFlowForward {
  from {
    stroke-dashoffset: 24;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes beamFlowReverse {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 24;
  }
}

.chiral-beam.forward {
  animation: beamFlowForward 1s linear infinite;
}

.chiral-beam.reverse {
  animation: beamFlowReverse 1s linear infinite;
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
  color: #38bdf8;
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

.wall-btn {
  background: #0284c7;
  color: #fff;
}

.wall-btn:hover {
  background: #0369a1;
}

.braid-btn {
  background: #059669;
  color: #fff;
}

.braid-btn:hover {
  background: #047857;
}

@media (max-width: 768px) {
  .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
