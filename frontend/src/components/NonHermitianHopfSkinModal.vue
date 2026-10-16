<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>非厄米奇異環霍普夫絕緣體與高階皮膚渦旋反應器</h2>
            <p class="subtitle">3D Non-Hermitian Hopf Insulator, Weyl Exceptional Rings & Higher-Order Skin Vortex Collapse</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="hopf-skin-svg">
            <defs>
              <linearGradient id="hopfSkinBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#14051c" />
                <stop offset="50%" stop-color="#22092e" />
                <stop offset="100%" stop-color="#09020f" />
              </linearGradient>

              <radialGradient id="skinNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1" />
                <stop offset="55%" stop-color="#e879f9" stop-opacity="0.65" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowSkin">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#hopfSkinBg)" rx="8" />

            <!-- Left: 3D Cube OBC Boundary & Weyl Exceptional Ring + Corner Skin Vortices -->
            <g transform="translate(65, 25)">
              <!-- 3D Cube Wireframe Boundary -->
              <rect x="65" y="55" width="190" height="190" fill="none" stroke="#9333ea" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.45" />
              <!-- Corner Skin Accumulator Highlights -->
              <circle cx="255" cy="55" :r="14 + state.nonReciprocalGamma * 12" fill="#f43f5e" opacity="0.22" filter="url(#glowSkin)" />
              <circle cx="65" cy="245" :r="14 + state.nonReciprocalGamma * 12" fill="#38bdf8" opacity="0.22" filter="url(#glowSkin)" />

              <!-- Weyl Exceptional Ring Contour -->
              <ellipse
                cx="160"
                cy="155"
                :rx="40 + state.exceptionalRingRadiusNmInv * 95"
                :ry="24 + state.exceptionalRingRadiusNmInv * 55"
                fill="none"
                stroke="#f472b6"
                stroke-width="2.2"
                stroke-dasharray="6 3"
                filter="url(#glowSkin)"
              />

              <!-- Braided Hopf-Skin Path -->
              <path
                :d="hopfPathD"
                fill="none"
                stroke="#e879f9"
                :stroke-width="2.6"
                filter="url(#glowSkin)"
              />

              <!-- 16 Skin Vortex Nodes -->
              <g v-for="nd in state.nodes" :key="nd.id">
                <circle
                  :cx="nd.x"
                  :cy="nd.y"
                  :r="4.0 + nd.skinWeight * 5.0"
                  fill="url(#skinNodeGlow)"
                  filter="url(#glowSkin)"
                />
                <line
                  :x1="nd.x"
                  :y1="nd.y"
                  :x2="nd.x + Math.cos(nd.complexPhaseRad) * 9"
                  :y2="nd.y + Math.sin(nd.complexPhaseRad) * 9"
                  :stroke="nd.vortexChirality > 0 ? '#fda4af' : '#67e8f9'"
                  stroke-width="1.4"
                />
              </g>

              <text x="160" y="298" text-anchor="middle" fill="#f5d0fe" font-size="12" font-family="monospace">
                W_H = {{ state.hopfLinkingNumberWh }} · ν_braid = {{ state.complexBraidingIndex }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Real-time Non-Hermitian Topological Metrics -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#210b30" stroke="#a21caf" stroke-width="1" />
              <text x="14" y="22" fill="#f0abfc" font-size="11" font-family="sans-serif">外爾奇異環半徑 R_EP (nm⁻¹)</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                {{ state.exceptionalRingRadiusNmInv }} nm⁻¹ <tspan font-size="11" fill="#d8b4fe">(EP 簡併環)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#210b30" stroke="#a21caf" stroke-width="1" />
              <text x="14" y="88" fill="#f0abfc" font-size="11" font-family="sans-serif">非互易趨膚局域化長度 ξ_skin (nm)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.skinLocalizationXiNm }} nm
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#210b30" stroke="#a21caf" stroke-width="1" />
              <text x="14" y="154" fill="#f0abfc" font-size="11" font-family="sans-serif">複數能譜編織指數 ν_braid</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                ν = {{ state.complexBraidingIndex }} <tspan font-size="11" fill="#9ca3af">(B_n 辮群拓撲不變量)</tspan>
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#210b30" stroke="#a21caf" stroke-width="1" />
              <text x="14" y="220" fill="#f0abfc" font-size="11" font-family="sans-serif">高階頂角皮膚渦旋密度 ρ_corner (10¹² cm⁻²)</text>
              <text x="14" y="242" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.cornerSkinDensity }} × 10¹² cm⁻²
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#3b0764" />
              <rect x="14" y="252" :width="Math.min(250, (state.cornerSkinDensity / 120.0) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">非厄米霍普夫與高階皮膚體制選擇 (Regime Select)</label>
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
              <span>霍普夫拓撲環繞數 W_H</span>
              <span class="value">{{ state.hopfLinkingNumberWh }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              :value="state.hopfLinkingNumberWh"
              @input="onWhInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>非互易趨膚不對稱 γ_skin</span>
              <span class="value">{{ state.nonReciprocalGamma }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.50"
              step="0.05"
              :value="state.nonReciprocalGamma"
              @input="onGammaInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>非厄米增益損耗 Γ (meV)</span>
              <span class="value">{{ state.gainLossParameterMev }} meV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="40.0"
              step="0.5"
              :value="state.gainLossParameterMev"
              @input="onGainLossInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playHopfSkinSound">
              🔊 激發非厄米複數編織諧音
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
  nonHermitianHopfSkinInsulatorEngine,
  NonHermitianHopfRegime
} from '../engine/nonHermitianHopfSkinInsulator';

const uiStore = useUIStore();
const engine = nonHermitianHopfSkinInsulatorEngine;
const state = computed(() => engine.getState());

const regimes: { id: NonHermitianHopfRegime; label: string }[] = [
  { id: 'hermitian-hopf-link', label: '厄米霍普夫環鏈 (W_H=1)' },
  { id: 'weyl-exceptional-ring', label: '外爾奇異簡併環 (W_H=2)' },
  { id: 'higher-order-corner-skin', label: '高階頂角皮膚凝聚 (W_H=3)' },
  { id: 'complex-braiding-vortex-collapse', label: '複數能譜編織塌縮 (W_H=4)' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const hopfPathD = computed(() => {
  const pts = state.value.nodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setNonHermitianHopfSkinModal(false);
}

function onWhInput(e: Event) {
  engine.setHopfLinkingNumber(Number((e.target as HTMLInputElement).value));
}

function onGammaInput(e: Event) {
  engine.setNonReciprocalGamma(Number((e.target as HTMLInputElement).value));
}

function onGainLossInput(e: Event) {
  engine.setGainLossParameter(Number((e.target as HTMLInputElement).value));
}

function playHopfSkinSound() {
  engine.triggerHopfSkinSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 2, 12, 0.8);
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
  background: #12061c;
  border: 1px solid #c026d3;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(217, 70, 239, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1d092b;
  border-bottom: 1px solid #a21caf;
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
  color: #e879f9;
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
  border: 1px solid #a21caf;
}

.hopf-skin-svg {
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
  color: #f0abfc;
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
  background: #240a36;
  color: #f5d0fe;
  border: 1px solid #a21caf;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #a21caf;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(232, 121, 249, 0.45);
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
  color: #f5d0fe;
}

.slider-header .value {
  font-family: monospace;
  color: #f43f5e;
}

input[type="range"] {
  accent-color: #d946ef;
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
  background: #a21caf;
  color: #ffffff;
}

.audio-btn:hover {
  background: #c026d3;
  box-shadow: 0 0 12px rgba(232, 121, 249, 0.4);
}

.reset-btn {
  background: #2e0f42;
  color: #f0abfc;
  border: 1px solid #a21caf;
}

.reset-btn:hover {
  background: #431660;
  color: #ffffff;
}
</style>
