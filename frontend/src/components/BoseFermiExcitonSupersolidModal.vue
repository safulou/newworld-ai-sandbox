<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">❄️</span>
          <div>
            <h2>超流玻色-費米混合拓撲激子超固體轉子</h2>
            <p class="subtitle">Bose-Fermi Exciton Supersolid, Roton Softening & Non-Classical Rotational Inertia (NCRI)</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="supersolid-svg">
            <defs>
              <linearGradient id="supersolidBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#041914" />
                <stop offset="50%" stop-color="#072c23" />
                <stop offset="100%" stop-color="#020e0b" />
              </linearGradient>

              <radialGradient id="dropletGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="1" />
                <stop offset="60%" stop-color="#10b981" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#059669" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowSupersolid">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#supersolidBg)" rx="8" />

            <!-- Left: Hexagonal Exciton Supersolid Droplet Crystal & Interstitial Vortices -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="118" fill="none" stroke="#10b981" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="52" fill="none" stroke="#34d399" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.4" />

              <!-- 13 Supersolid Exciton Droplets -->
              <g v-for="dp in state.droplets" :key="dp.id">
                <circle
                  :cx="dp.x"
                  :cy="dp.y"
                  :r="8 + dp.dropletDensity * 10"
                  fill="url(#dropletGlow)"
                  filter="url(#glowSupersolid)"
                />
                <!-- Interstitial Quantized Vortex Marker -->
                <circle
                  v-if="dp.hasInterstitialVortex"
                  :cx="dp.x"
                  :cy="dp.y"
                  r="4"
                  fill="#fbbf24"
                />
              </g>

              <text x="165" y="305" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="monospace">
                f_s (NCRI) = {{ state.ncriSuperfluidFractionFs }} · Δ_roton = {{ state.rotonEnergyGapMev }} meV
              </text>
            </g>

            <!-- Right: Roton Softening & Leggett NCRI Gauges -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#072b22" stroke="#10b981" stroke-width="1" />
              <text x="14" y="22" fill="#6ee7b7" font-size="11" font-family="sans-serif">非經典轉動慣量超流分數 f_s (NCRI)</text>
              <text x="14" y="45" fill="#34d399" font-size="19" font-weight="bold" font-family="monospace">
                f_s = {{ state.ncriSuperfluidFractionFs }} <tspan font-size="11" fill="#a7f3d0">(Leggett 界限)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#072b22" stroke="#10b981" stroke-width="1" />
              <text x="14" y="88" fill="#6ee7b7" font-size="11" font-family="sans-serif">旋子極小值軟化能隙 Δ_roton (meV)</text>
              <text x="14" y="111" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.rotonEnergyGapMev }} meV
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#072b22" stroke="#10b981" stroke-width="1" />
              <text x="14" y="154" fill="#6ee7b7" font-size="11" font-family="sans-serif">超固體晶格密度調制對比度 C_solid</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                C_solid = {{ state.crystalModulationContrast }}
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#072b22" stroke="#10b981" stroke-width="1" />
              <text x="14" y="220" fill="#6ee7b7" font-size="11" font-family="sans-serif">人工規範旋轉角速度 Ω (GHz)</text>
              <text x="14" y="242" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                Ω = {{ state.syntheticRotationOmega }} GHz
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#064e3b" />
              <rect x="14" y="252" :width="Math.min(250, state.ncriSuperfluidFractionFs * 250)" height="6" rx="3" fill="#34d399" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">玻色-費米激子超固體相變體制選擇 (Regime Select)</label>
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
              <span>偶極激子排斥耦合 g_dd (meV·nm²)</span>
              <span class="value">{{ state.dipolarCouplingDd }}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="80.0"
              step="1.0"
              :value="state.dipolarCouplingDd"
              @input="onGddInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>費米面波矢嵌套強度 k_F·d</span>
              <span class="value">{{ state.fermiSurfaceNestingKf }}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="3.50"
              step="0.05"
              :value="state.fermiSurfaceNestingKf"
              @input="onKfInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>人工規範旋轉角速度 Ω (GHz)</span>
              <span class="value">{{ state.syntheticRotationOmega }} GHz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              :value="state.syntheticRotationOmega"
              @input="onOmegaInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playSupersolidSound">
              🔊 激發旋子-戈德斯通雙模諧音
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
  boseFermiExcitonSupersolidRotorEngine,
  ExcitonSupersolidRegime
} from '../engine/boseFermiExcitonSupersolidRotor';

const uiStore = useUIStore();
const engine = boseFermiExcitonSupersolidRotorEngine;
const state = computed(() => engine.getState());

const regimes: { id: ExcitonSupersolidRegime; label: string }[] = [
  { id: 'normal-exciton-fermi-liquid', label: '正常激子-費米液體' },
  { id: 'uniform-dipolar-superfluid', label: '均勻偶極激子超流體' },
  { id: 'roton-softening-supersolid', label: '旋子軟化激子超固體' },
  { id: 'topological-vortex-supersolid-crystal', label: '拓撲渦旋超固體晶格' }
];

function handleClose() {
  uiStore.setBoseFermiExcitonSupersolidModal(false);
}

function onGddInput(e: Event) {
  engine.setDipolarCoupling(Number((e.target as HTMLInputElement).value));
}

function onKfInput(e: Event) {
  engine.setFermiSurfaceNesting(Number((e.target as HTMLInputElement).value));
}

function onOmegaInput(e: Event) {
  engine.setSyntheticRotation(Number((e.target as HTMLInputElement).value));
}

function playSupersolidSound() {
  engine.triggerSupersolidSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 12, 9, 0.8);
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
  background: #041a14;
  border: 1px solid #10b981;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #062920;
  border-bottom: 1px solid #059669;
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
  color: #ecfdf5;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #34d399;
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
  border: 1px solid #10b981;
}

.supersolid-svg {
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
  color: #6ee7b7;
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
  background: #073327;
  color: #a7f3d0;
  border: 1px solid #10b981;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.45);
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
  color: #a7f3d0;
}

.slider-header .value {
  font-family: monospace;
  color: #34d399;
}

input[type="range"] {
  accent-color: #10b981;
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
  background: #059669;
  color: #ffffff;
}

.audio-btn:hover {
  background: #10b981;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.4);
}

.reset-btn {
  background: #093b2e;
  color: #6ee7b7;
  border: 1px solid #10b981;
}

.reset-btn:hover {
  background: #0d5240;
  color: #ffffff;
}
</style>
