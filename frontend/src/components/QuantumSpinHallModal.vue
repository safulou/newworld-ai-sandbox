<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { quantumSpinHallEngine, type QuantumSpinHallRegime } from '../engine/quantumSpinHallHelical';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => quantumSpinHallEngine.getState());

const isOpen = computed(() => uiStore.mode === 'quantum-spin-hall');

const regimes: Array<{ id: QuantumSpinHallRegime; label: string; desc: string }> = [
  { id: 'ballistic-helical-transport', label: '彈道螺旋傳輸相', desc: '時間反演保護無散射 (G = 2 e²/h)' },
  { id: 'spin-momentum-locked-filter', label: '自旋動量過濾態', desc: '100% 偏振純淨自旋流注入' },
  { id: 'magnetic-gap-opening', label: '磁性隙破缺相', desc: '時間反演破缺與狄拉克能隙打開' },
  { id: 'kramers-doublet-resonance', label: '克拉默斯共振態', desc: '非磁性通道無損穿隧共振' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateThickness(val: number) {
  quantumSpinHallEngine.setParameters({ quantumWellThicknessNm: val });
}

function updateFermi(val: number) {
  quantumSpinHallEngine.setParameters({ fermiEnergyMev: val });
}

function updateMagnetic(val: number) {
  quantumSpinHallEngine.setParameters({ magneticExchangeFieldTesla: val });
}

function updateImpurities(val: number) {
  quantumSpinHallEngine.setParameters({ impurityDensityIndex: val });
}

function updateGap(val: number) {
  quantumSpinHallEngine.setParameters({ bulkBandgapMev: val });
}

function selectRegime(regime: QuantumSpinHallRegime) {
  quantumSpinHallEngine.setParameters({ regime });
  achievements.unlock('quantum_spin_hall_helical');
}

function injectSpin() {
  quantumSpinHallEngine.injectPureSpinPacket();
  achievements.unlock('quantum_spin_hall_helical');
}

function toggleMagnetic() {
  quantumSpinHallEngine.toggleMagneticField();
  achievements.unlock('quantum_spin_hall_helical');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="qsh-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🛡️</span>
          <div>
            <h2>量子自旋霍爾效應晶片 (Quantum Spin Hall Chip)</h2>
            <span class="subtitle">Helical Edge States, Time-Reversal Symmetry & Zero Backscattering</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 螺旋邊緣態與狄拉克錐圖 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="qsh-svg">
            <defs>
              <linearGradient id="tiBulkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#052e16" stop-opacity="0.6" />
                <stop offset="50%" stop-color="#022c22" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#052e16" stop-opacity="0.6" />
              </linearGradient>
              <linearGradient id="spinUpFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="spinDownFlow" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#e11d48" />
              </linearGradient>
            </defs>

            <!-- 塊體 2D 拓撲絕緣體奈米帶 -->
            <rect x="35" y="30" width="470" height="260" rx="16" fill="url(#tiBulkGrad)" stroke="#10b981" stroke-width="1.8" />

            <!-- 塊體內部絕緣網格 -->
            <g opacity="0.25">
              <line v-for="x in 9" :key="'grid-x-' + x" :x1="35 + x * 47" y1="30" :x2="35 + x * 47" y2="290" stroke="#34d399" stroke-width="1" stroke-dasharray="3 3" />
              <line v-for="y in 5" :key="'grid-y-' + y" x1="35" :y1="30 + y * 43" x2="505" :y2="30 + y * 43" stroke="#34d399" stroke-width="1" stroke-dasharray="3 3" />
            </g>

            <!-- 塊體中央文字標記 -->
            <text x="270" y="150" fill="#34d399" font-size="14" font-weight="bold" text-anchor="middle" opacity="0.8">
              塊體絕緣態 (拓撲能隙 Δ = {{ state.bulkBandgapMev.toFixed(1) }} meV)
            </text>
            <text x="270" y="172" fill="#6ee7b7" font-size="11" text-anchor="middle" opacity="0.7">
              ℤ₂ 拓撲指標 = {{ state.z2Invariant }} (克拉默斯雙重態 𝒯² = -1)
            </text>

            <!-- 頂部邊界：自旋向上向右傳播 (Spin-Up Right Mover) -->
            <rect x="45" y="42" width="450" height="18" rx="6" fill="#0369a1" opacity="0.25" />
            <line x1="50" y1="51" x2="490" y2="51" stroke="url(#spinUpFlow)" stroke-width="4" stroke-dasharray="14 8">
              <animate attributeName="stroke-dashoffset" values="0;-110" dur="2s" repeatCount="indefinite" />
            </line>
            <!-- 自旋向上標籤 -->
            <g transform="translate(90, 51)">
              <circle r="7" fill="#38bdf8" />
              <path d="M 0 3 L 0 -3 M -3 -1 L 0 -4 L 3 -1" stroke="#ffffff" stroke-width="1.4" fill="none" />
              <text x="14" y="4" fill="#38bdf8" font-size="11" font-weight="bold">Spin ↑ (k_x > 0 向右)</text>
            </g>

            <!-- 底部邊界：自旋向下向左傳播 (Spin-Down Left Mover) -->
            <rect x="45" y="260" width="450" height="18" rx="6" fill="#be123c" opacity="0.25" />
            <line x1="490" y1="269" x2="50" y2="269" stroke="url(#spinDownFlow)" stroke-width="4" stroke-dasharray="14 8">
              <animate attributeName="stroke-dashoffset" values="0;-110" dur="2s" repeatCount="indefinite" />
            </line>
            <!-- 自旋向下標籤 -->
            <g transform="translate(420, 269)">
              <circle r="7" fill="#f43f5e" />
              <path d="M 0 -3 L 0 3 M -3 1 L 0 4 L 3 1" stroke="#ffffff" stroke-width="1.4" fill="none" />
              <text x="-14" y="4" fill="#f43f5e" font-size="11" font-weight="bold" text-anchor="end">Spin ↓ (k_x &lt; 0 向左)</text>
            </g>

            <!-- 非磁性雜質與繞射相消 (Zero Backscattering) 示意點 -->
            <g transform="translate(260, 51)">
              <circle r="6" fill="#eab308" opacity="0.8" />
              <text x="0" y="-10" fill="#fde047" font-size="9" text-anchor="middle">非磁性雜質</text>
              <path d="M -15 0 Q 0 -12 15 0" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2" />
            </g>

            <!-- 磁場破缺提示 -->
            <g v-if="state.magneticExchangeFieldTesla > 0.05" transform="translate(390, 100)">
              <rect x="-60" y="-15" width="120" height="30" rx="8" fill="#450a0a" stroke="#ef4444" stroke-width="1.2" />
              <text x="0" y="4" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">
                ⚠️ B_mag = {{ state.magneticExchangeFieldTesla.toFixed(1) }} T (破缺 𝒯)
              </text>
            </g>
          </svg>
        </div>

        <!-- 4 大體制按鈕 -->
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
            <span class="m-label">電導率 G</span>
            <span class="m-val text-emerald">{{ state.conductanceE2H.toFixed(3) }} e²/h</span>
          </div>
          <div class="metric-item">
            <span class="m-label">ℤ₂ 拓撲不變量</span>
            <span class="m-val text-cyan">{{ state.z2Invariant }} (非平凡)</span>
          </div>
          <div class="metric-item">
            <span class="m-label">自旋動量鎖定極化率</span>
            <span class="m-val text-purple">{{ (state.spinPolarizationRatio * 100).toFixed(1) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">彈性背向散射抑制率</span>
            <span class="m-val text-emerald">{{ state.backscatteringSuppressionPercent.toFixed(1) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">彈道平均自由程</span>
            <span class="m-val">{{ state.meanFreePathMicrons.toFixed(1) }} μm</span>
          </div>
          <div class="metric-item">
            <span class="m-label">邊界焦耳熱耗散</span>
            <span class="m-val">{{ state.dissipationHeatNanoWatt.toFixed(2) }} nW</span>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>量子阱厚度 (d, >6.3 nm 反轉)</span>
              <span class="val">{{ state.quantumWellThicknessNm.toFixed(1) }} nm</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.1"
              :value="state.quantumWellThicknessNm"
              @input="updateThickness(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>費米能階 (E_F)</span>
              <span class="val">{{ state.fermiEnergyMev.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="-40.0"
              max="40.0"
              step="0.5"
              :value="state.fermiEnergyMev"
              @input="updateFermi(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>磁性交換場 (B_mag, 破缺時間反演)</span>
              <span class="val">{{ state.magneticExchangeFieldTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.2"
              :value="state.magneticExchangeFieldTesla"
              @input="updateMagnetic(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>雜質散射中心密度</span>
              <span class="val">{{ (state.impurityDensityIndex * 100).toFixed(0) }}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              :value="state.impurityDensityIndex"
              @input="updateImpurities(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>塊體能隙 (Δ_bulk)</span>
              <span class="val">{{ state.bulkBandgapMev.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="2.0"
              :value="state.bulkBandgapMev"
              @input="updateGap(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="injectSpin">
            ⚡ 注入自旋動量鎖定純自旋流封包
          </button>
          <button class="action-btn secondary" @click="toggleMagnetic">
            🧲 切換時間反演對稱 ⇄ 磁性狄拉克隙
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
  padding: 16px;
}

.qsh-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(6, 30, 20, 0.95), rgba(4, 18, 14, 0.98));
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 28px;
}

.title-group h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #10b981, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.content-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.qsh-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.4);
}

.regime-btn.active {
  background: rgba(16, 185, 129, 0.18);
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-emerald { color: #34d399; }

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.slider-header .val {
  font-weight: 700;
  color: #10b981;
}

input[type="range"] {
  width: 100%;
  accent-color: #10b981;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(90deg, #059669, #0d9488);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #047857, #0f766e);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.action-btn.secondary:hover {
  background: rgba(16, 185, 129, 0.15);
}
</style>
