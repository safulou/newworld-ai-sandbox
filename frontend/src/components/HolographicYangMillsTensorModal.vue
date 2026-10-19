<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🕸️</span>
          <div>
            <h2>全息楊-米爾斯張量網路與多體糾纏幾何湧現重整化流引擎</h2>
            <p class="subtitle">Holographic SU(N_c) Yang-Mills MERA Tensor Network, Ryu-Takayanagi Geodesics & Wilson Confinement</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="ym-tensor-svg">
            <defs>
              <linearGradient id="ymTensorBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#140b24" />
                <stop offset="50%" stop-color="#21123d" />
                <stop offset="100%" stop-color="#090512" />
              </linearGradient>

              <filter id="glowTensor">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#ymTensorBg)" rx="8" />

            <!-- Left: Poincaré Disk MERA Hyperbolic Tensor Network & RT Minimal Geodesic -->
            <g transform="translate(65, 20)">
              <!-- UV CFT Boundary Circle -->
              <circle cx="165" cy="160" r="112" fill="none" stroke="#8b5cf6" stroke-width="1.8" opacity="0.65" />
              <!-- Intermediate MERA RG Layer -->
              <circle cx="165" cy="160" r="54" fill="none" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.5" />

              <!-- Ryu-Takayanagi Minimal Geodesic Cut Arc -->
              <path
                d="M 85 82 Q 165 170 245 82"
                fill="none"
                stroke="#f43f5e"
                stroke-width="2.8"
                stroke-dasharray="6 4"
                filter="url(#glowTensor)"
              />

              <!-- Radial RG Entanglement Bonds -->
              <g v-for="nd in state.tensorNodes" :key="'bond-' + nd.id">
                <line
                  v-if="nd.rgLayer > 0"
                  x1="165"
                  y1="160"
                  :x2="nd.x"
                  :y2="nd.y"
                  stroke="#7c3aed"
                  stroke-width="1.1"
                  opacity="0.45"
                />
              </g>

              <!-- 16 MERA Hyperbolic Tensor Nodes -->
              <g v-for="nd in state.tensorNodes" :key="nd.id">
                <circle
                  :cx="nd.x"
                  :cy="nd.y"
                  :r="4.5 + nd.bondEntanglementWeight * 5.0"
                  :fill="nd.isGeodesicCut ? '#f43f5e' : '#a78bfa'"
                  filter="url(#glowTensor)"
                />
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#ddd6fe" font-size="12" font-family="monospace">
                SU({{ state.gaugeGroupRankNc }}) · χ = {{ state.tensorBondDimensionChi }} · S_RT = {{ state.ryuTakayanagiEntropyKb }} k_B
              </text>
            </g>

            <!-- Right: Holographic RG & Wilson Confinement Gauges -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#1e1136" stroke="#7c3aed" stroke-width="1" />
              <text x="14" y="22" fill="#c4b5fd" font-size="11" font-family="sans-serif">笠-高柳極小測地線糾纏熵 S_RT (k_B)</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                S_RT = {{ state.ryuTakayanagiEntropyKb }} k_B
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#1e1136" stroke="#7c3aed" stroke-width="1" />
              <text x="14" y="88" fill="#c4b5fd" font-size="11" font-family="sans-serif">全息威爾森迴路面積律弦張力 σ_YM</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                σ_YM = {{ state.wilsonStringTensionSigma }} GeV²/fm
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#1e1136" stroke="#7c3aed" stroke-width="1" />
              <text x="14" y="154" fill="#c4b5fd" font-size="11" font-family="sans-serif">湧現雙曲體空間里奇曲率 |R_AdS|</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                |R_AdS| = {{ state.emergentAdsCurvatureR }} ℓ_P⁻²
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#1e1136" stroke="#7c3aed" stroke-width="1" />
              <text x="14" y="220" fill="#c4b5fd" font-size="11" font-family="sans-serif">張量鍵維度 χ 與 SU(N_c) 規範自由度</text>
              <text x="14" y="242" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                χ = {{ state.tensorBondDimensionChi }} · N_c = {{ state.gaugeGroupRankNc }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#2e1065" />
              <rect x="14" y="252" :width="Math.min(250, (state.tensorBondDimensionChi / 32.0) * 250)" height="6" rx="3" fill="#a78bfa" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">全息楊-米爾斯張量網路重整化體制選擇 (Regime Select)</label>
            <div class="regime-buttons">
              <button
                v-for="reg in regimes"
                :key="reg.id"
                class="regime-btn"
                :class="{ active: state.activeRegime === reg.id }"
                @click="engine.setRegime(reg.id)"
              >
                {{ reg.label }}
              </button>
            </div>
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>楊-米爾斯規範群階數 N_c</span>
              <span class="value">SU({{ state.gaugeGroupRankNc }})</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              :value="state.gaugeGroupRankNc"
              @input="onNcInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>張量網路鍵維度 χ</span>
              <span class="value">{{ state.tensorBondDimensionChi }}</span>
            </div>
            <input
              type="range"
              min="2"
              max="32"
              step="1"
              :value="state.tensorBondDimensionChi"
              @input="onChiInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>楊-米爾斯耦合常數 g_YM²</span>
              <span class="value">{{ state.ymCouplingSquaredG2 }}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="6.00"
              step="0.10"
              :value="state.ymCouplingSquaredG2"
              @input="onG2Input"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playTensorSound">
              🔊 激發雙曲重整化流尺度琶音
            </button>
            <button class="action-btn reset-btn" @click="resetEngine">
              🔄 重設狀態
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import {
  holographicYangMillsTensorNetworkEngine,
  HolographicYmTensorRegime
} from '../engine/holographicYangMillsTensorNetwork';

const uiStore = useUIStore();
const engine = holographicYangMillsTensorNetworkEngine;
const state = computed(() => engine.getState());

const regimes: { id: HolographicYmTensorRegime; label: string }[] = [
  { id: 'uv-conformal-perimeter-law', label: 'UV 共形周長律相' },
  { id: 'mera-entanglement-rg-flow', label: 'MERA 糾纏重整化流' },
  { id: 'su-n-area-law-confinement', label: 'SU(N) 面積律強禁閉' },
  { id: 'ads-black-hole-deconfinement-horizon', label: 'AdS 黑洞解禁閉視界' }
];

function handleClose() {
  uiStore.setHolographicYangMillsTensorModal(false);
}

function onNcInput(e: Event) {
  engine.setGaugeGroupRank(Number((e.target as HTMLInputElement).value));
}

function onChiInput(e: Event) {
  engine.setTensorBondDimension(Number((e.target as HTMLInputElement).value));
}

function onG2Input(e: Event) {
  engine.setYmCouplingSquared(Number((e.target as HTMLInputElement).value));
}

function playTensorSound() {
  engine.triggerYmTensorSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 3, 14, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 95vw;
  max-height: 92vh;
  background: #110921;
  border: 1px solid #8b5cf6;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(139, 92, 246, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1a0e33;
  border-bottom: 1px solid #6d28d9;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-wrap .icon {
  font-size: 28px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 19px;
  color: #ede9fe;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #a78bfa;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}

.close-btn:hover {
  color: #ffffff;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.viz-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #7c3aed;
}

.ym-tensor-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.full-width {
  grid-column: 1 / -1;
}

.group-label {
  display: block;
  font-size: 12px;
  color: #c4b5fd;
  margin-bottom: 8px;
}

.regime-buttons {
  display: flex;
  gap: 8px;
}

.regime-btn {
  flex: 1;
  padding: 8px 10px;
  font-size: 12px;
  background: #1f113b;
  color: #ddd6fe;
  border: 1px solid #7c3aed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #7c3aed;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(167, 139, 250, 0.45);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #ddd6fe;
}

.slider-header .value {
  font-family: monospace;
  color: #a78bfa;
}

input[type="range"] {
  accent-color: #8b5cf6;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-end;
}

.action-btn {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.audio-btn {
  background: #7c3aed;
  color: #ffffff;
}

.audio-btn:hover {
  background: #8b5cf6;
}

.reset-btn {
  background: #27154a;
  color: #c4b5fd;
  border: 1px solid #7c3aed;
}

.reset-btn:hover {
  background: #361d66;
  color: #ffffff;
}
</style>
