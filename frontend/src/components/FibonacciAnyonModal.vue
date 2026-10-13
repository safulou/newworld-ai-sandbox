<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { fibonacciAnyonEngine, type FibonacciAnyonRegime, type QuantumGateTarget } from '../engine/fibonacciAnyonBraiding';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => fibonacciAnyonEngine.getState());

const isOpen = computed(() => uiStore.mode === 'fibonacci-anyon');

const regimes: Array<{ id: FibonacciAnyonRegime; label: string; desc: string }> = [
  { id: 'fibonacci-universal-tqc', label: '通用拓撲量子計算', desc: 'SU(2) 緻密編織，無魔態蒸餾' },
  { id: 'golden-fusion-tree', label: '黃金比例聚變樹', desc: 'τ × τ = 1 + τ 拓撲希爾伯特空間' },
  { id: 'braid-group-density', label: '緻密辮群單元酉矩陣', desc: 'Solovay-Kitaev 任意量子門編譯' },
  { id: 'topological-vacuum-protection', label: '拓撲真空能隙保護', desc: '指數級抑制非局域退相干' }
];

const gates: Array<{ id: QuantumGateTarget; label: string }> = [
  { id: 'hadamard-gate', label: 'Hadamard (H)' },
  { id: 'phase-shift-t', label: 'Phase Shift (T)' },
  { id: 'cnot-entangling', label: 'CNOT (2-Qubit)' },
  { id: 'identity-idle', label: 'Identity (I)' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateAnyonCount(val: number) {
  fibonacciAnyonEngine.setParameters({ anyonCountN: val });
}

function updateTemp(val: number) {
  fibonacciAnyonEngine.setParameters({ temperatureKelvin: val });
}

function updateGap(val: number) {
  fibonacciAnyonEngine.setParameters({ topologicalGapMev: val });
}

function selectRegime(regime: FibonacciAnyonRegime) {
  fibonacciAnyonEngine.setParameters({ regime });
  achievements.unlock('fibonacci_anyon_braiding');
}

function executeBraid() {
  fibonacciAnyonEngine.executeBraidStep();
  achievements.unlock('fibonacci_anyon_braiding');
}

function compileGate(target: QuantumGateTarget) {
  fibonacciAnyonEngine.synthesizeUniversalGate(target);
  achievements.unlock('fibonacci_anyon_braiding');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="fab-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧬</span>
          <div>
            <h2>菲波那契金鍵任意子編織處理器 (Fibonacci Anyon Processor)</h2>
            <span class="subtitle">Universal Topological Quantum Computing, Golden Ratio d_τ & Dense Braid Group</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 任意子世界線編織與黃金比例聚變樹 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="fab-svg">
            <defs>
              <radialGradient id="goldenSpiralGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#b45309" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#78350f" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="strandGold1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#d97706" />
              </linearGradient>
              <linearGradient id="strandGold2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
            </defs>

            <!-- 深金黑底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#08080f" stroke="#d97706" stroke-width="1.8" />

            <!-- 黃金比例聚變中心光暈 -->
            <circle cx="270" cy="160" r="85" fill="url(#goldenSpiralGlow)" />

            <!-- 菲波那契任意子編織世界線 Strands -->
            <g v-for="i in Math.min(state.anyonCountN, 8)" :key="'strand-' + i">
              <!-- 正弦波交織路徑 -->
              <path
                :d="`M 50 ${60 + i * 24} Q ${180 + (i % 2) * 40} ${40 + (i % 3) * 50}, 270 ${60 + i * 24} T 490 ${60 + i * 24}`"
                fill="none"
                :stroke="i % 2 === 0 ? 'url(#strandGold1)' : 'url(#strandGold2)'"
                :stroke-width="2.5"
                :stroke-dasharray="i % 3 === 0 ? '8 4' : 'none'"
                opacity="0.85"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  :values="i % 2 === 0 ? '0;-60' : '0;60'"
                  :dur="`${2.5 + i * 0.4}s`"
                  repeatCount="indefinite"
                />
              </path>

              <!-- 任意子準粒子頂點 -->
              <circle
                :cx="70 + (i * 45)"
                :cy="60 + i * 24"
                r="6.5"
                :fill="i % 2 === 0 ? '#fbbf24' : '#38bdf8'"
                stroke="#ffffff"
                stroke-width="1.8"
              >
                <animate attributeName="r" values="6;8;6" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </g>

            <!-- 聚變樹節點標記 (τ × τ = 1 + τ) -->
            <g transform="translate(270, 160)">
              <circle cx="0" cy="0" r="28" fill="#18181b" stroke="#f59e0b" stroke-width="2" />
              <text x="0" y="5" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle">
                d_τ = 1.618
              </text>
            </g>

            <!-- 左側標註 -->
            <text x="45" y="52" fill="#fbbf24" font-size="11" font-weight="bold">
              菲波那契任意子 (N = {{ state.anyonCountN }} | dim(H) = {{ state.hilbertSpaceDimension }})
            </text>
            <text x="45" y="70" fill="#94a3b8" font-size="10">
              能隙 Δ = {{ state.topologicalGapMev.toFixed(1) }} meV | 溫度 T = {{ (state.temperatureKelvin * 1000).toFixed(0) }} mK
            </text>

            <!-- 右側標註 -->
            <text x="495" y="275" fill="#38bdf8" font-size="10" text-anchor="end">
              門保真度 F = {{ (state.braidFidelity * 100).toFixed(2) }}% | 編織步數 {{ state.braidStepsCount }}
            </text>
            <text x="495" y="255" fill="#facc15" font-size="10" text-anchor="end">
              目標門: {{ state.targetGate }} | 拓撲熵 S = {{ state.topologicalEntropyS.toFixed(4) }}
            </text>
          </svg>
        </div>

        <!-- 目標邏輯門快速編譯選擇列 -->
        <div class="gates-bar">
          <span class="bar-title">目標量子門編譯：</span>
          <button
            v-for="g in gates"
            :key="g.id"
            class="gate-btn"
            :class="{ active: state.targetGate === g.id }"
            @click="compileGate(g.id)"
          >
            {{ g.label }}
          </button>
        </div>

        <!-- 4 大相態體制選擇 -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            class="regime-btn"
            :class="{ active: state.regime === r.id }"
            @click="selectRegime(r.id)"
          >
            <span class="regime-name">{{ r.label }}</span>
            <span class="regime-desc">{{ r.desc }}</span>
          </button>
        </div>

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">黃金量子維度 d_τ</span>
            <span class="m-val text-gold">{{ state.goldenRatioDimension.toFixed(4) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">拓撲門保真度 F</span>
            <span class="m-val text-cyan">{{ (state.braidFidelity * 100).toFixed(2) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">聚變維度 dim(H)</span>
            <span class="m-val text-emerald">{{ state.hilbertSpaceDimension }} (F_{{ state.anyonCountN - 1 }})</span>
          </div>
          <div class="metric-item">
            <span class="m-label">拓撲糾纏熵 S_topo</span>
            <span class="m-val text-gold">{{ state.topologicalEntropyS.toFixed(4) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">非阿貝爾相位 Φ</span>
            <span class="m-val text-cyan">{{ state.braidPhaseAccumulatedRad.toFixed(2) }} rad</span>
          </div>
          <div class="metric-item">
            <span class="m-label">編織步數 N_braid</span>
            <span class="m-val text-emerald">{{ state.braidStepsCount }} 步</span>
          </div>
        </div>

        <!-- 參數滑桿面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>菲波那契任意子數量 (N 顆)</span>
              <span class="val">{{ state.anyonCountN }} 顆</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              :value="state.anyonCountN"
              @input="updateAnyonCount(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>操作溫度 (T, K)</span>
              <span class="val">{{ (state.temperatureKelvin * 1000).toFixed(1) }} mK</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.5"
              step="0.005"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>拓撲超導能隙 (Δ, meV)</span>
              <span class="val">{{ state.topologicalGapMev.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="8.0"
              step="0.2"
              :value="state.topologicalGapMev"
              @input="updateGap(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="executeBraid">
            ⚡ 執行基本非阿貝爾編織步進 (σ_i)
          </button>
          <button class="action-btn secondary" @click="compileGate(state.targetGate)">
            🎯 Solovay-Kitaev 編譯通用拓撲量子門
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
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;
}

.fab-card {
  width: 90%;
  max-width: 680px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(45, 26, 6, 0.9));
  border: 1px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px 24px;
  background: rgba(45, 26, 6, 0.6);
  border-bottom: 1px solid rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon {
  font-size: 28px;
}

h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fef3c7;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.75rem;
  color: #fcd34d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
}

.content-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.fab-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5));
}

.gates-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.5);
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.bar-title {
  font-size: 0.75rem;
  color: #cbd5e1;
  font-weight: 600;
}

.gate-btn {
  padding: 6px 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.gate-btn:hover {
  border-color: #f59e0b;
  color: #fef08a;
}

.gate-btn.active {
  background: #f59e0b;
  color: #0f172a;
  font-weight: bold;
  border-color: #fbbf24;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.regime-btn:hover {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(45, 26, 6, 0.4);
}

.regime-btn.active {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.25));
  border-color: #f59e0b;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.regime-desc {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 3px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
}

.m-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-top: 4px;
}

.text-gold {
  color: #fbbf24;
}

.text-cyan {
  color: #38bdf8;
}

.text-emerald {
  color: #34d399;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.4);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.slider-header .val {
  color: #fbbf24;
  font-family: monospace;
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: #f59e0b;
  background: rgba(255, 255, 255, 0.1);
  height: 6px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 10px;
}

.action-btn {
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #0f172a;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(245, 158, 11, 0.5);
}

.action-btn.secondary {
  background: rgba(45, 26, 6, 0.8);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fef3c7;
}

.action-btn.secondary:hover {
  background: rgba(69, 39, 9, 0.8);
  border-color: rgba(245, 158, 11, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
