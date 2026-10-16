<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">♾️</span>
          <div>
            <h2>拓撲非阿貝爾自旋梅比烏斯條共振腔</h2>
            <p class="subtitle">Non-Orientable Manifold, Intrinsic Berry Phase γ = π, Half-Integer OAM & Non-Abelian Holonomy</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="mobius-svg">
            <defs>
              <linearGradient id="mobiusBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#041217" />
                <stop offset="50%" stop-color="#06222c" />
                <stop offset="100%" stop-color="#020a0d" />
              </linearGradient>

              <radialGradient id="mobiusNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#2dd4bf" stop-opacity="1" />
                <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowMobius">
                <feGaussianBlur stdDeviation="3.0" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#mobiusBg)" rx="8" />

            <!-- Left: 3D Projected Möbius Strip (Center 220, 180) -->
            <g transform="translate(70, 30)">
              <!-- Outer guide ring -->
              <ellipse cx="150" cy="150" rx="120" ry="100" fill="none" stroke="#0e7490" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.3" />

              <!-- Möbius ribbon edge path -->
              <path
                :d="ribbonPathD"
                fill="none"
                stroke="#38bdf8"
                stroke-width="3"
                filter="url(#glowMobius)"
              />

              <!-- Nodes & Spin Orientation Vectors -->
              <g v-for="node in state.nodes" :key="node.id">
                <circle
                  :cx="node.xProj"
                  :cy="node.yProj"
                  :r="4.0 + node.edgeCurrentDensity * 3.0"
                  fill="url(#mobiusNodeGlow)"
                  filter="url(#glowMobius)"
                />
                <!-- Spin tilt vector line -->
                <line
                  :x1="node.xProj"
                  :y1="node.yProj"
                  :x2="node.xProj + Math.cos(node.spinTiltRad) * 12"
                  :y2="node.yProj + Math.sin(node.spinTiltRad) * 12"
                  stroke="#f43f5e"
                  stroke-width="2"
                  opacity="0.85"
                />
              </g>

              <text x="150" y="295" text-anchor="middle" fill="#7dd3fc" font-size="12" font-family="monospace">
                N_twist = {{ state.twistNumberN }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Real-time Topological Gauges & Parameters (x: 480 ~ 760) -->
            <g transform="translate(480, 40)">
              <!-- Metric 1: Intrinsic Berry Phase -->
              <rect x="0" y="0" width="280" height="55" rx="6" fill="#082b35" stroke="#0891b2" stroke-width="1" />
              <text x="14" y="24" fill="#22d3ee" font-size="11" font-family="sans-serif">內稟幾何貝里相位 γ_Berry</text>
              <text x="14" y="46" fill="#f43f5e" font-size="20" font-weight="bold" font-family="monospace">
                {{ isMobius ? 'γ = π rad (4π 復原)' : 'γ = 0 rad (平庸)' }}
              </text>

              <!-- Metric 2: Subharmonic Interference -->
              <rect x="0" y="65" width="280" height="55" rx="6" fill="#082b35" stroke="#0891b2" stroke-width="1" />
              <text x="14" y="89" fill="#22d3ee" font-size="11" font-family="sans-serif">亞諧波干涉對比度 (Subharmonic Contrast)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ (state.subharmonicInterference * 100).toFixed(1) }} %
              </text>

              <!-- Metric 3: Spin Precession Angle -->
              <rect x="0" y="130" width="280" height="55" rx="6" fill="#082b35" stroke="#0891b2" stroke-width="1" />
              <text x="14" y="154" fill="#22d3ee" font-size="11" font-family="sans-serif">非阿貝爾自旋進動累計角 θ_spin (rad)</text>
              <text x="14" y="176" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.spinPrecessionAngleRad }} rad
              </text>

              <!-- Metric 4: Persistent Spin Current -->
              <rect x="0" y="195" width="280" height="70" rx="6" fill="#082b35" stroke="#0891b2" stroke-width="1" />
              <text x="14" y="219" fill="#22d3ee" font-size="11" font-family="sans-serif">持久拓撲自旋流 I_s (μA)</text>
              <text x="14" y="241" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.persistentSpinCurrentUa }} μA
              </text>
              <!-- Progress bar -->
              <rect x="14" y="250" width="250" height="6" rx="3" fill="#0a3b47" />
              <rect x="14" y="250" :width="Math.min(250, (state.persistentSpinCurrentUa / 35.0) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Regime Selection -->
          <div class="control-group full-width">
            <label class="group-label">相變與梅比烏斯幾何體制選擇 (Regime Select)</label>
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

          <!-- Parameter Sliders -->
          <div class="control-group">
            <div class="slider-header">
              <span>扭轉半圈數 N_twist</span>
              <span class="value">{{ state.twistNumberN }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              :value="state.twistNumberN"
              @input="onTwistInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>Rashba SOC 強度 α (meV·nm)</span>
              <span class="value">{{ state.socStrengthAlpha }} meV·nm</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="50.0"
              step="1.0"
              :value="state.socStrengthAlpha"
              @input="onSocInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>費米能級 E_F (meV)</span>
              <span class="value">{{ state.fermiEnergyEfMev }} meV</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="2.0"
              :value="state.fermiEnergyEfMev"
              @input="onEfInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playMobiusSound">
              🔊 激發幾何貝里諧和音效
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
  topologicalSpinMobiusResonatorEngine,
  SpinMobiusRegime
} from '../engine/topologicalSpinMobiusResonator';

const uiStore = useUIStore();
const engine = topologicalSpinMobiusResonatorEngine;
const state = computed(() => engine.getState());

const regimes: { id: SpinMobiusRegime; label: string }[] = [
  { id: 'cylindrical-trivial-ribbon', label: '圓柱平庸帶 (N=0)' },
  { id: 'mobius-single-twist', label: '梅比烏斯單扭 (N=1)' },
  { id: 'chiral-spin-precession-strip', label: '手性自旋進動 (N=1)' },
  { id: 'non-abelian-holonomy-knot', label: '非阿貝爾完整旋轉 (N=3)' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

const isMobius = computed(() => state.value.twistNumberN % 2 === 1);

const ribbonPathD = computed(() => {
  const nodes = state.value.nodes;
  if (!nodes || nodes.length === 0) return '';
  let d = `M ${nodes[0].xProj} ${nodes[0].yProj}`;
  for (let i = 1; i < nodes.length; i++) {
    d += ` L ${nodes[i].xProj} ${nodes[i].yProj}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setSpinMobiusModal(false);
}

function onTwistInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setTwistNumber(val);
}

function onSocInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setSocStrength(val);
}

function onEfInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  engine.setFermiEnergy(val);
}

function playMobiusSound() {
  engine.triggerMobiusSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 8, 12, 0.78);
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
  background: #05161c;
  border: 1px solid #0891b2;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(6, 182, 212, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0a252f;
  border-bottom: 1px solid #0e7490;
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
  color: #e0f2fe;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #38bdf8;
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
  border: 1px solid #0e7490;
}

.mobius-svg {
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
  color: #38bdf8;
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
  background: #092a35;
  color: #7dd3fc;
  border: 1px solid #0891b2;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #0891b2;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
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
  color: #bae6fd;
}

.slider-header .value {
  font-family: monospace;
  color: #f43f5e;
}

input[type="range"] {
  accent-color: #06b6d4;
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
  background: #0891b2;
  color: #ffffff;
}

.audio-btn:hover {
  background: #06b6d4;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.reset-btn {
  background: #0d3845;
  color: #7dd3fc;
  border: 1px solid #0891b2;
}

.reset-btn:hover {
  background: #154c5c;
  color: #ffffff;
}
</style>
