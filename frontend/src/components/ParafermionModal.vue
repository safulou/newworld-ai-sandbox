<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { parafermionEngine, type ParafermionRegime } from '../engine/parafermionZeroModes';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => parafermionEngine.getState());

const isOpen = computed(() => uiStore.mode === 'parafermion-modes');

const regimes: Array<{ id: ParafermionRegime; label: string; desc: string }> = [
  { id: 'z4-parafermion-topological-qudit', label: 'Z₄ 帕拉費米子四態拓撲量元相', desc: '4 重非局域拓撲基態簡併度，構建固有容錯高維 Tetracubit' },
  { id: 'fractional-josephson-8pi-period', label: '8π 週期分數約瑟夫森超流態', desc: '分數電荷 e* = e/2 準粒子穿隧，展現 8π 超長週期無耗散微波超電流' },
  { id: 'non-clifford-braiding-gate', label: '非克利福德拓撲編織邏輯門相', desc: '帕拉費米子編織直接編譯 π/12 非克利福德相移門，突破東尼-基塔耶夫定理' },
  { id: 'quasi-particle-poisoning-quench', label: '準粒子拓撲中毒退相干態', desc: '殘餘未配對費米子隧穿破壞拓撲宇稱保護，引發保真度跌落' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updatePhase(val: number) {
  const diff = val - state.value.josephsonPhasePhiRad;
  parafermionEngine.advanceJosephsonPhase(diff);
  achievements.unlock('parafermion_zero_modes');
}

function updateGap(val: number) {
  const diff = val - state.value.superconductingGapDeltaMev;
  parafermionEngine.tuneSuperconductingProximity(diff);
  achievements.unlock('parafermion_zero_modes');
}

function advancePhase() {
  parafermionEngine.advanceJosephsonPhase(1.57);
  achievements.unlock('parafermion_zero_modes');
}

function executeBraid() {
  parafermionEngine.executeParafermionBraid();
  achievements.unlock('parafermion_zero_modes');
}

function purifyPoisoning() {
  parafermionEngine.purifyQuasiparticlePoisoning();
  achievements.unlock('parafermion_zero_modes');
}

function reset() {
  parafermionEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="para-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧬</span>
          <div>
            <h2>非阿貝爾帕拉費米子與拓撲四重量子位元 (Parafermion Tetracubit)</h2>
            <span class="subtitle">Z₄ Fractional Zero Modes, 8π-Periodic Supercurrent & Intrinsic Non-Clifford Braiding</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG Z_4 四重拓撲星環與 8π 約瑟夫森波形 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="para-svg">
            <defs>
              <radialGradient id="quditGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#059669" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34d399" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a78bfa" />
              </linearGradient>
            </defs>

            <!-- 晶片底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#10b981" stroke-width="1.6" />

            <!-- 左側：Z_4 帕拉費米子四態簡併星形環 -->
            <g transform="translate(150, 150)">
              <!-- 拓撲相干光環 -->
              <circle cx="0" cy="0" r="75" fill="url(#quditGlow)">
                <animate attributeName="r" values="70;82;70" dur="2.5s" repeatCount="indefinite" />
              </circle>

              <!-- 拓撲四量子態幾何十字 -->
              <line x1="-65" y1="0" x2="65" y2="0" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" />
              <line x1="0" y1="-65" x2="0" y2="65" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" />
              <circle cx="0" cy="0" r="50" fill="none" stroke="#059669" stroke-width="1.5" />

              <!-- 四個 Z_4 簡併基態點 -->
              <!-- |0> 頂, |1> 右, |2> 底, |3> 左 -->
              <g
                v-for="(p, i) in [
                  { x: 0, y: -50, label: '|0⟩' },
                  { x: 50, y: 0, label: '|1⟩' },
                  { x: 0, y: 50, label: '|2⟩' },
                  { x: -50, y: 0, label: '|3⟩' }
                ]"
                :key="i"
              >
                <circle :cx="p.x" :cy="p.y" r="13" fill="#0f172a" stroke="#34d399" stroke-width="2" />
                <text :x="p.x" :y="p.y + 4" text-anchor="middle" fill="#34d399" font-size="11" font-weight="bold">
                  {{ p.label }}
                </text>
              </g>

              <!-- 中心編織相移指示器 -->
              <circle cx="0" cy="0" r="16" fill="#047857" />
              <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">
                {{ state.braidingPhaseShiftDeg }}°
              </text>
            </g>

            <!-- 右側：8π 週期約瑟夫森超電流 Sin 波形展示 -->
            <g transform="translate(300, 60)">
              <rect x="0" y="0" width="200" height="180" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#10b981" stroke-width="1" />
              <text x="14" y="24" fill="#34d399" font-size="12" font-weight="bold">8π 分數約瑟夫森曲線</text>
              <line x1="14" y1="32" x2="186" y2="32" stroke="#334155" stroke-width="1" />

              <!-- 坐標軸 (中線 y=105) -->
              <line x1="20" y1="105" x2="180" y2="105" stroke="#475569" stroke-width="1" />

              <!-- 正弦波形：I(phi) = I_0 sin(phi/4)，週期為 8\pi -->
              <path
                d="M 20,105 Q 60,65 100,105 T 180,105"
                fill="none"
                stroke="url(#waveGrad)"
                stroke-width="2.5"
              />

              <!-- 當前相位點標記 (在波形上的投影) -->
              <circle
                :cx="20 + ((state.josephsonPhasePhiRad / (8 * Math.PI)) * 160)"
                :cy="105 - (state.fractionalSupercurrentMicroAmp / 40) * 35"
                r="6"
                fill="#fbbf24"
              />

              <text x="14" y="152" fill="#94a3b8" font-size="10">超電流 I(φ):</text>
              <text x="75" y="152" fill="#38bdf8" font-size="12" font-weight="bold">{{ state.fractionalSupercurrentMicroAmp }} μA</text>

              <text x="14" y="170" fill="#94a3b8" font-size="10">當前相位 φ:</text>
              <text x="75" y="170" fill="#fbbf24" font-size="12" font-weight="bold">{{ state.josephsonPhasePhiRad }} rad (8π)</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 35)">
              <rect x="0" y="0" width="230" height="30" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#10b981" stroke-width="1" />
              <text x="12" y="19" fill="#34d399" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">拓撲基態簡併度</span>
            <span class="m-val highlight">{{ state.topologicalDegeneracyRank }} 重</span>
            <span class="m-sub">Z₄ 代數階數 m=4</span>
          </div>

          <div class="metric-card">
            <span class="m-label">編織門保真度</span>
            <span class="m-val accent">{{ (state.nonCliffordGateFidelity * 100).toFixed(2) }}%</span>
            <span class="m-sub">非克利福德 π/12 門</span>
          </div>

          <div class="metric-card">
            <span class="m-label">分數超電流 I(φ)</span>
            <span class="m-val">{{ state.fractionalSupercurrentMicroAmp }} μA</span>
            <span class="m-sub">8π 約瑟夫森穿隧</span>
          </div>

          <div class="metric-card">
            <span class="m-label">超導近鄰能隙 (Δ)</span>
            <span class="m-val">{{ state.superconductingGapDeltaMev }} meV</span>
            <span class="m-sub">拓撲微觀防護能隙</span>
          </div>

          <div class="metric-card">
            <span class="m-label">準粒子中毒率 (Γ_p)</span>
            <span class="m-val">{{ state.quasiparticlePoisoningRateKhz }} kHz</span>
            <span class="m-sub">極限抑制退相干</span>
          </div>

          <div class="metric-card">
            <span class="m-label">非阿貝爾相移 (θ)</span>
            <span class="m-val">{{ state.braidingPhaseShiftDeg }}°</span>
            <span class="m-sub">通用拓撲邏輯門</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>約瑟夫森相位 φ (0.0 ~ 25.13 rad / 8π): <b>{{ state.josephsonPhasePhiRad }} rad</b></label>
              <input
                type="range"
                min="0.0"
                max="25.13"
                step="0.2"
                :value="state.josephsonPhasePhiRad"
                @input="updatePhase(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>超導近鄰能隙 Δ (0.5 ~ 6.0 meV): <b>{{ state.superconductingGapDeltaMev }} meV</b></label>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                :value="state.superconductingGapDeltaMev"
                @input="updateGap(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="advancePhase">
              ⚡ 推進約瑟夫森相位 (+π/2)
            </button>
            <button class="action-btn emerald" @click="executeBraid">
              🧬 執行非阿貝爾帕拉費米子編織
            </button>
            <button class="action-btn secondary" @click="purifyPoisoning">
              💧 淨化準粒子中毒
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

.para-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 15, 29, 0.92);
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
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
  color: #34d399;
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

.para-svg {
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
  border: 1px solid rgba(16, 185, 129, 0.2);
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
  color: #34d399;
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
  accent-color: #10b981;
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
  background: #059669;
  color: #fff;
}
.action-btn.primary:hover {
  background: #047857;
}

.action-btn.emerald {
  background: #0d9488;
  color: #fff;
}
.action-btn.emerald:hover {
  background: #0f766e;
}

.action-btn.secondary {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.3);
}
.action-btn.secondary:hover {
  background: rgba(16, 185, 129, 0.25);
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
