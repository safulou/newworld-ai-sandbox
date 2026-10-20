<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🧲</span>
          <div>
            <h2>交錯磁性體手性自旋分光器與非互易自旋波二極體</h2>
            <p class="subtitle">Altermagnetic d/g/i-Wave Spin Splitting, Giant Spin-Splitter Effect & Chiral Magnon Diode</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="altermagnet-svg">
            <defs>
              <linearGradient id="altBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1a0c24" />
                <stop offset="50%" stop-color="#2c123d" />
                <stop offset="100%" stop-color="#0d0512" />
              </linearGradient>

              <filter id="glowAlt">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#altBg)" rx="8" />

            <!-- Left: Momentum-Space Altermagnetic d/g/i-Wave Spin-Split Fermi Surface -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="115" fill="none" stroke="#c084fc" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="60" fill="none" stroke="#38bdf8" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.45" />

              <!-- Spin-Split Anisotropic Fermi Contour -->
              <path
                :d="lobePathD"
                fill="rgba(192, 132, 252, 0.12)"
                stroke="#e879f9"
                stroke-width="2.4"
                filter="url(#glowAlt)"
              />

              <!-- 16 Momentum Lobe & Chiral Magnon Nodes -->
              <g v-for="node in state.fermiLobeNodes" :key="node.id">
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  :r="5 + node.magnonChiralityFlux * 4"
                  :fill="node.spinPolarization > 0 ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowAlt)"
                />
                <text
                  :x="node.x"
                  :y="node.y - 9"
                  text-anchor="middle"
                  :fill="node.spinPolarization > 0 ? '#fda4af' : '#bae6fd'"
                  font-size="9"
                  font-family="monospace"
                >
                  {{ node.spinPolarization > 0 ? '↑' : '↓' }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#f5d0fe" font-size="12" font-family="monospace">
                N_l = {{ state.harmonicMultipoleOrderN }} ({{ waveName }}) · θ_SS = {{ state.spinSplitterAngleDeg }}°
              </text>
            </g>

            <!-- Right: Altermagnetic Spin-Splitter & Magnon Diode Metrics -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#230e36" stroke="#a855f7" stroke-width="1" />
              <text x="14" y="22" fill="#e9d5ff" font-size="11" font-family="sans-serif">自旋分光角 θ_SS (無需 SOC)</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                θ_SS = {{ state.spinSplitterAngleDeg }}° <tspan font-size="11" fill="#f5d0fe">({{ waveName }})</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#230e36" stroke="#a855f7" stroke-width="1" />
              <text x="14" y="88" fill="#e9d5ff" font-size="11" font-family="sans-serif">手性磁振子色散劈裂 Δω_mag (THz)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.chiralMagnonSplittingThz }} THz
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#230e36" stroke="#a855f7" stroke-width="1" />
              <text x="14" y="154" fill="#e9d5ff" font-size="11" font-family="sans-serif">非相對論交換劈裂能 Δ_alt (eV)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.exchangeSplittingEv }} eV (M_net = 0)
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#230e36" stroke="#a855f7" stroke-width="1" />
              <text x="14" y="220" fill="#e9d5ff" font-size="11" font-family="sans-serif">自旋波二極體非互易整流比 η_rect</text>
              <text x="14" y="242" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                η_rect = {{ state.magnonDiodeRectificationRatio }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#3b175c" />
              <rect x="14" y="252" :width="Math.min(250, state.magnonDiodeRectificationRatio * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">交錯磁性晶體對稱與自旋波二極體體制選擇 (Regime Select)</label>
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
              <span>多極諧波階數 N_l (2=d, 4=g, 6=i)</span>
              <span class="value">N_l = {{ state.harmonicMultipoleOrderN }} ({{ waveName }})</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              step="2"
              :value="state.harmonicMultipoleOrderN"
              @input="onOrderInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>非相對論交換劈裂 Δ_alt (eV)</span>
              <span class="value">{{ state.exchangeSplittingEv }} eV</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.60"
              step="0.05"
              :value="state.exchangeSplittingEv"
              @input="onSplitInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>奈爾向量晶軸取向角 θ_L (deg)</span>
              <span class="value">{{ state.neelVectorAngleDeg }}°</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="180.0"
              step="2.5"
              :value="state.neelVectorAngleDeg"
              @input="onNeelInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playAltermagnetSound">
              🔊 激發交錯磁自旋分光諧音
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
  altermagneticChiralSpinSplitterEngine,
  AltermagneticSymmetryRegime
} from '../engine/altermagneticChiralSpinSplitter';

const uiStore = useUIStore();
const engine = altermagneticChiralSpinSplitterEngine;
const state = computed(() => engine.getState());

const regimes: { id: AltermagneticSymmetryRegime; label: string }[] = [
  { id: 'collinear-afm-degenerate', label: '傳統共線反鐵磁簡併態' },
  { id: 'd-wave-rutile-spin-splitter', label: 'd-Wave 金紅石自旋分光 (RuO₂)' },
  { id: 'g-wave-hexagonal-altermagnet', label: 'g-Wave 六方交錯磁體 (MnTe)' },
  { id: 'i-wave-chiral-magnon-diode', label: 'i-Wave 手性磁振子二極體' }
];

const waveName = computed(() => {
  const n = state.value.harmonicMultipoleOrderN;
  if (n === 2) return 'd-wave';
  if (n === 4) return 'g-wave';
  return 'i-wave';
});

const lobePathD = computed(() => {
  const pts = state.value.fermiLobeNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setAltermagneticSpinSplitterModal(false);
}

function onOrderInput(e: Event) {
  engine.setMultipoleOrder(Number((e.target as HTMLInputElement).value));
}

function onSplitInput(e: Event) {
  engine.setExchangeSplitting(Number((e.target as HTMLInputElement).value));
}

function onNeelInput(e: Event) {
  engine.setNeelVectorAngle(Number((e.target as HTMLInputElement).value));
}

function playAltermagnetSound() {
  engine.triggerAltermagneticSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 5, 22, 0.82);
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
  background: #140821;
  border: 1px solid #c084fc;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(192, 132, 252, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #220d38;
  border-bottom: 1px solid #9333ea;
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
  color: #fae8ff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #d8b4fe;
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
  border: 1px solid #9333ea;
}

.altermagnet-svg {
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
  color: #e9d5ff;
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
  background: #270f40;
  color: #f3e8ff;
  border: 1px solid #9333ea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #9333ea;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
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
  color: #f3e8ff;
}

.slider-header .value {
  font-family: monospace;
  color: #e879f9;
}

input[type="range"] {
  accent-color: #c084fc;
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
  background: #9333ea;
  color: #ffffff;
}

.audio-btn:hover {
  background: #a855f7;
}

.reset-btn {
  background: #2e114d;
  color: #e9d5ff;
  border: 1px solid #9333ea;
}

.reset-btn:hover {
  background: #441970;
  color: #ffffff;
}
</style>
