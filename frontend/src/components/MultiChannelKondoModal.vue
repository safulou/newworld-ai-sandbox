<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { multiChannelKondoEngine, type MultiChannelKondoRegime } from '../engine/multiChannelKondo';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => multiChannelKondoEngine.getState());

const isOpen = computed(() => uiStore.mode === 'multichannel-kondo');

const regimes: Array<{ id: MultiChannelKondoRegime; label: string; desc: string }> = [
  { id: 'two-channel-overscreened-nfl', label: '雙通道過度屏蔽相', desc: '殘餘 0.5 ln2 分數熵與非費米液體' },
  { id: 'fermi-liquid-singlet-crossover', label: '費米單重態交叉相', desc: '各向異性主導完全屏蔽單重態' },
  { id: 'quantum-critical-strange-metal', label: '量子臨界奇異金屬', desc: '非費米線性電阻與對數奇異性' },
  { id: 'non-abelian-majorana-entropy', label: '馬約拉納熵鎖定態', desc: '分數化孤立零能模量子臨界點' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateJk(val: number) {
  multiChannelKondoEngine.setParameters({ kondoExchangeJkEv: val });
}

function updateAnisotropy(val: number) {
  multiChannelKondoEngine.setParameters({ channelAnisotropyDelta: val });
}

function updateEd(val: number) {
  multiChannelKondoEngine.setParameters({ impurityLevelEdEv: val });
}

function updateTk(val: number) {
  multiChannelKondoEngine.setParameters({ kondoTemperatureTk: val });
}

function updateTemp(val: number) {
  multiChannelKondoEngine.setParameters({ temperatureKelvin: val });
}

function selectRegime(regime: MultiChannelKondoRegime) {
  multiChannelKondoEngine.setParameters({ regime });
  achievements.unlock('multichannel_kondo_nfl');
}

function balanceSymmetry() {
  multiChannelKondoEngine.balanceChannelsSymmetry();
  achievements.unlock('multichannel_kondo_nfl');
}

function tuneMajorana() {
  multiChannelKondoEngine.tuneToMajoranaPoint();
  achievements.unlock('multichannel_kondo_nfl');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="kondo-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>多通道近藤非費米反應堆 (Two-Channel Kondo Engine)</h2>
            <span class="subtitle">Overscreened Non-Fermi Liquid, Residual Entropy & Quantum Criticality</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 雙通道過度屏蔽與局域雜質自旋圖 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="kondo-svg">
            <defs>
              <radialGradient id="impurityCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#b91c1c" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#450a0a" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="ch1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
              <linearGradient id="ch2Grad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#7c3aed" />
                <stop offset="100%" stop-color="#c084fc" />
              </linearGradient>
            </defs>

            <!-- 腔體底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#090514" stroke="#4c1d95" stroke-width="1.8" />

            <!-- 中央局域磁性雜質 (S = 1/2 Impurity) -->
            <g transform="translate(270, 160)">
              <circle cx="0" cy="0" r="45" fill="url(#impurityCore)" />
              <circle cx="0" cy="0" r="16" fill="#ef4444" />
              <!-- 局域自旋箭頭 (Spin-1/2 Arrow) -->
              <path d="M 0 10 L 0 -10 M -4 -4 L 0 -12 L 4 -4" stroke="#ffffff" stroke-width="2.2" fill="none" />
              <text x="0" y="30" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">
                S = 1/2 雜質
              </text>
            </g>

            <!-- 通道 1：左側傳導電子屏蔽雲 (Channel 1) -->
            <g transform="translate(130, 160)">
              <ellipse cx="0" cy="0" rx="65" ry="45" fill="#0369a1" opacity="0.25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 4" />
              <path d="M -50 0 L 35 0" stroke="url(#ch1Grad)" stroke-width="3" stroke-dasharray="10 6">
                <animate attributeName="stroke-dashoffset" values="0;-40" dur="1.5s" repeatCount="indefinite" />
              </path>
              <text x="0" y="-12" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">
                通道 1 (J₁)
              </text>
              <text x="0" y="8" fill="#93c5fd" font-size="9" text-anchor="middle">
                傳導自旋 s₁
              </text>
            </g>

            <!-- 通道 2：右側傳導電子屏蔽雲 (Channel 2) -->
            <g transform="translate(410, 160)">
              <ellipse cx="0" cy="0" rx="65" ry="45" fill="#581c87" opacity="0.25" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="6 4" />
              <path d="M 50 0 L -35 0" stroke="url(#ch2Grad)" stroke-width="3" stroke-dasharray="10 6">
                <animate attributeName="stroke-dashoffset" values="0;-40" dur="1.5s" repeatCount="indefinite" />
              </path>
              <text x="0" y="-12" fill="#c084fc" font-size="11" font-weight="bold" text-anchor="middle">
                通道 2 (J₂)
              </text>
              <text x="0" y="8" fill="#d8b4fe" font-size="9" text-anchor="middle">
                傳導自旋 s₂
              </text>
            </g>

            <!-- 殘餘分數熵指示徽章 (Residual Entropy S_imp = 1/2 ln 2) -->
            <g transform="translate(270, 75)">
              <rect x="-95" y="-18" width="190" height="36" rx="10" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="1.4" />
              <text x="0" y="-2" fill="#c4b5fd" font-size="10" font-weight="bold" text-anchor="middle">
                非阿貝爾殘餘熵 S_imp(0)
              </text>
              <text x="0" y="12" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">
                {{ state.residualImpurityEntropy.toFixed(4) }} k_B (½ ln 2)
              </text>
            </g>

            <!-- 底部標記資訊 -->
            <text x="45" y="275" fill="#94a3b8" font-size="10">
              各向異性 Δ = {{ state.channelAnisotropyDelta.toFixed(2) }} | NFL 權重: {{ (state.nonFermiLiquidWeight * 100).toFixed(0) }}%
            </text>
            <text x="495" y="275" fill="#a855f7" font-size="10" text-anchor="end">
              奇異磁化率 χ(T) = {{ state.magneticSusceptibilityLog.toFixed(2) }} | G = {{ state.differentialConductanceE2H.toFixed(2) }} e²/h
            </text>
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
            <span class="m-label">殘餘雜質熵 S_imp</span>
            <span class="m-val text-purple">{{ state.residualImpurityEntropy.toFixed(4) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">NFL 臨界權重</span>
            <span class="m-val text-cyan">{{ (state.nonFermiLiquidWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">微分電導率 G</span>
            <span class="m-val text-emerald">{{ state.differentialConductanceE2H.toFixed(2) }} e²/h</span>
          </div>
          <div class="metric-item">
            <span class="m-label">奇異磁化率 χ(T)</span>
            <span class="m-val text-purple">{{ state.magneticSusceptibilityLog.toFixed(2) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">馬約拉納相干度</span>
            <span class="m-val text-emerald">{{ (state.majoranaCorrelationDegree * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">奇異電阻率比值</span>
            <span class="m-val">{{ state.strangeMetalResistivityRatio.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>近藤交換耦合 (J_K)</span>
              <span class="val">{{ state.kondoExchangeJkEv.toFixed(2) }} eV</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="3.0"
              step="0.05"
              :value="state.kondoExchangeJkEv"
              @input="updateJk(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>通道各向異性 (Δ, 0 為完美過度屏蔽)</span>
              <span class="val">{{ state.channelAnisotropyDelta.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.05"
              :value="state.channelAnisotropyDelta"
              @input="updateAnisotropy(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>雜質能階 (ε_d)</span>
              <span class="val">{{ state.impurityLevelEdEv.toFixed(1) }} eV</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="1.0"
              step="0.2"
              :value="state.impurityLevelEdEv"
              @input="updateEd(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>近藤溫度標度 (T_K)</span>
              <span class="val">{{ state.kondoTemperatureTk.toFixed(1) }} K</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="120.0"
              step="1.0"
              :value="state.kondoTemperatureTk"
              @input="updateTk(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>操作溫度 (T)</span>
              <span class="val">{{ state.temperatureKelvin.toFixed(3) }} K</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="50.0"
              step="0.1"
              :value="state.temperatureKelvin"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="balanceSymmetry">
            ⚖️ 恢復雙通道各向同性對稱 (Δ = 0)
          </button>
          <button class="action-btn secondary" @click="tuneMajorana">
            🎯 鎖定非阿貝爾馬約拉納分數殘餘熵態
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

.kondo-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(20, 10, 36, 0.95), rgba(10, 5, 24, 0.98));
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
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
  background: linear-gradient(90deg, #c084fc, #38bdf8);
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
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.kondo-svg {
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
  border: 1px solid rgba(168, 85, 247, 0.2);
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
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.4);
}

.regime-btn.active {
  background: rgba(168, 85, 247, 0.18);
  border-color: #c084fc;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
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
  color: #c084fc;
}

input[type="range"] {
  width: 100%;
  accent-color: #c084fc;
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
  background: linear-gradient(90deg, #7c3aed, #9333ea);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #6d28d9, #7e22ce);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
}

.action-btn.secondary:hover {
  background: rgba(168, 85, 247, 0.15);
}
</style>
