<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">💠</span>
          <div>
            <h2>非阿貝爾量子自旋軌道液體與四極矩拓撲八極子絕緣體</h2>
            <p class="subtitle">SU(4) Kugel-Khomskii Spin-Orbital Liquid, BBH Quantized Octupole q_xyz = e/2 & ±e/2 Corner Charges</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="octupole-svg">
            <defs>
              <linearGradient id="octupoleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#171005" />
                <stop offset="50%" stop-color="#2b1d07" />
                <stop offset="100%" stop-color="#0d0802" />
              </linearGradient>

              <filter id="glowOctupole">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#octupoleBg)" rx="8" />

            <!-- Left: 3D Projected BBH π-Flux Cube & 8 Fractional ±e/2 Corner Charges -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="115" fill="none" stroke="#f59e0b" stroke-width="1.1" stroke-dasharray="4 4" opacity="0.4" />

              <!-- Cube Edges Connecting the 8 Octupole Corners -->
              <path
                :d="cubeWireframeD"
                fill="none"
                stroke="#fbbf24"
                stroke-width="2.0"
                opacity="0.7"
              />

              <!-- 8 Corner Fractional Charge Nodes -->
              <g v-for="cv in state.cornerVertices" :key="cv.id">
                <circle
                  :cx="cv.x"
                  :cy="cv.y"
                  :r="6 + cv.spinOrbitalEntanglement * 4"
                  :fill="cv.octupoleSign > 0 ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowOctupole)"
                />
                <text
                  :x="cv.x"
                  :y="cv.y - 10"
                  text-anchor="middle"
                  :fill="cv.octupoleSign > 0 ? '#fda4af' : '#7dd3fc'"
                  font-size="10"
                  font-family="monospace"
                >
                  {{ cv.fractionalChargeE > 0 ? `+${cv.fractionalChargeE}e` : `${cv.fractionalChargeE}e` }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#fde68a" font-size="12" font-family="monospace">
                q_xyz = {{ state.quantizedOctupoleIndexQxyz }} e · |Q_corner| = {{ state.cornerFractionalChargeE }} e
              </text>
            </g>

            <!-- Right: BBH Octupole & SU(4) Spin-Orbital Gauges -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#291a06" stroke="#d97706" stroke-width="1" />
              <text x="14" y="22" fill="#fcd34d" font-size="11" font-family="sans-serif">體拓撲八極矩不變量 q_xyz / e</text>
              <text x="14" y="45" fill="#fbbf24" font-size="19" font-weight="bold" font-family="monospace">
                q_xyz = {{ state.quantizedOctupoleIndexQxyz }} e <tspan font-size="11" fill="#fde68a">(BBH 三階不變量)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#291a06" stroke="#d97706" stroke-width="1" />
              <text x="14" y="88" fill="#fcd34d" font-size="11" font-family="sans-serif">頂角分數化累積電荷 |Q_corner|</text>
              <text x="14" y="111" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                ±{{ state.cornerFractionalChargeE }} e
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#291a06" stroke="#d97706" stroke-width="1" />
              <text x="14" y="154" fill="#fcd34d" font-size="11" font-family="sans-serif">SU(4) 自旋-軌道糾纏能隙 Δ_SO (meV)</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.su4SpinOrbitalGapMev }} meV
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#291a06" stroke="#d97706" stroke-width="1" />
              <text x="14" y="220" fill="#fcd34d" font-size="11" font-family="sans-serif">晶胞面規範磁通 Φ/π 與躍遷比 λ/γ</text>
              <text x="14" y="242" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                Φ = {{ state.plaquettePiFluxRatio }}π · λ/γ = {{ state.intercellHoppingRatioLambda }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#451a03" />
              <rect x="14" y="252" :width="Math.min(250, (state.cornerFractionalChargeE / 0.5) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">自旋軌道液體與拓撲八極子體制選擇 (Regime Select)</label>
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
              <span>晶胞間/內躍遷比 λ/γ</span>
              <span class="value">{{ state.intercellHoppingRatioLambda }}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="3.50"
              step="0.05"
              :value="state.intercellHoppingRatioLambda"
              @input="onLambdaInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>Kugel-Khomskii 耦合 J_SO (meV)</span>
              <span class="value">{{ state.kugelKhomskiiCouplingJso }} meV</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="60.0"
              step="1.0"
              :value="state.kugelKhomskiiCouplingJso"
              @input="onJsoInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>晶格面規範磁通比 Φ/π</span>
              <span class="value">{{ state.plaquettePiFluxRatio }} π</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              :value="state.plaquettePiFluxRatio"
              @input="onFluxInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playOctupoleSound">
              🔊 激發拓撲八極子 π-磁通共鳴音
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
  spinOrbitalOctupoleInsulatorEngine,
  SpinOrbitalOctupoleRegime
} from '../engine/spinOrbitalOctupoleInsulator';

const uiStore = useUIStore();
const engine = spinOrbitalOctupoleInsulatorEngine;
const state = computed(() => engine.getState());

const regimes: { id: SpinOrbitalOctupoleRegime; label: string }[] = [
  { id: 'trivial-dipolar-mott-insulator', label: '平庸偶極莫特絕緣體' },
  { id: 'quadrupolar-hinge-semimetal', label: '四極矩稜態半金屬' },
  { id: 'bbh-quantized-octupole-corner', label: 'BBH 量子化八極子頂角態' },
  { id: 'su4-non-abelian-spin-orbital-liquid', label: 'SU(4) 非阿貝爾自旋軌道液體' }
];

const cubeWireframeD = computed(() => {
  const v = state.value.cornerVertices;
  if (!v || v.length < 8) return '';
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  return edges.map(([a, b]) => `M ${v[a].x} ${v[a].y} L ${v[b].x} ${v[b].y}`).join(' ');
});

function handleClose() {
  uiStore.setSpinOrbitalOctupoleModal(false);
}

function onLambdaInput(e: Event) {
  engine.setHoppingRatioLambda(Number((e.target as HTMLInputElement).value));
}

function onJsoInput(e: Event) {
  engine.setKugelKhomskiiCoupling(Number((e.target as HTMLInputElement).value));
}

function onFluxInput(e: Event) {
  engine.setPlaquettePiFlux(Number((e.target as HTMLInputElement).value));
}

function playOctupoleSound() {
  engine.triggerOctupoleSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(12, 8, 2, 0.8);
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
  background: #1a1104;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #291b06;
  border-bottom: 1px solid #d97706;
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
  color: #fef3c7;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fbbf24;
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
  border: 1px solid #d97706;
}

.octupole-svg {
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
  color: #fcd34d;
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
  background: #2e1e07;
  color: #fde68a;
  border: 1px solid #d97706;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #d97706;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.45);
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
  color: #fde68a;
}

.slider-header .value {
  font-family: monospace;
  color: #fbbf24;
}

input[type="range"] {
  accent-color: #f59e0b;
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
  background: #d97706;
  color: #ffffff;
}

.audio-btn:hover {
  background: #f59e0b;
}

.reset-btn {
  background: #382408;
  color: #fcd34d;
  border: 1px solid #d97706;
}

.reset-btn:hover {
  background: #4f330b;
  color: #ffffff;
}
</style>
