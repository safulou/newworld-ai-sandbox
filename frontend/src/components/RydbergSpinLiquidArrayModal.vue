<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🔬</span>
          <div>
            <h2>里德堡光鑷陣列非阿貝爾拓撲自旋液體與共振價鍵干涉儀</h2>
            <p class="subtitle">Rydberg Blockade Ruby Lattice, RVB Dimer Spin Liquid & Fredenhagen-Marcu String Order</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="rydberg-svg">
            <defs>
              <linearGradient id="rydbergBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#061f1e" />
                <stop offset="50%" stop-color="#0b3330" />
                <stop offset="100%" stop-color="#031211" />
              </linearGradient>

              <filter id="glowRydberg">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#rydbergBg)" rx="8" />

            <!-- Left: Ruby Lattice Rydberg Blockade Circles & RVB Dimer Loops -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="116" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="82" fill="none" stroke="#2dd4bf" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.4" />

              <!-- Closed Wilson Loop String Path -->
              <path
                :d="wilsonLoopPathD"
                fill="rgba(45, 212, 191, 0.08)"
                stroke="#2dd4bf"
                stroke-width="2.2"
                filter="url(#glowRydberg)"
              />

              <!-- 18 Rydberg Tweezer Dimer & Blockade Radii -->
              <g v-for="dn in state.dimerNodes" :key="dn.id">
                <circle
                  :cx="dn.x"
                  :cy="dn.y"
                  :r="dn.blockadeRadiusNorm"
                  fill="none"
                  stroke="#5eead4"
                  stroke-width="0.7"
                  stroke-dasharray="2 2"
                  opacity="0.35"
                />
                <circle
                  :cx="dn.x"
                  :cy="dn.y"
                  :r="4.5 + dn.dimerOccupationProb * 4.5"
                  :fill="dn.visonParityCharge > 0 ? '#10b981' : '#f59e0b'"
                  filter="url(#glowRydberg)"
                />
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#99f6e4" font-size="12" font-family="monospace">
                R_b/a = {{ state.blockadeRatioRbOverA }} · O_FM = {{ state.fredenhagenMarcuOrder }} · γ_top = {{ state.topologicalEntanglementGamma }} ln2
              </text>
            </g>

            <!-- Right: Rydberg Spin Liquid & String Operator Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#082e2c" stroke="#14b8a6" stroke-width="1" />
              <text x="14" y="22" fill="#99f6e4" font-size="11" font-family="sans-serif">Fredenhagen-Marcu 拓撲序參量 O_FM</text>
              <text x="14" y="45" fill="#2dd4bf" font-size="19" font-weight="bold" font-family="monospace">
                O_FM = {{ state.fredenhagenMarcuOrder }} <tspan font-size="11" fill="#ccfbf1">(RVB 液態)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#082e2c" stroke="#14b8a6" stroke-width="1" />
              <text x="14" y="88" fill="#99f6e4" font-size="11" font-family="sans-serif">封閉威爾森弦算符奇偶期望值 ⟨W_Z⟩</text>
              <text x="14" y="111" fill="#34d399" font-size="18" font-weight="bold" font-family="monospace">
                ⟨W_Z(C)⟩ = {{ state.wilsonLoopParityExpectation }}
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#082e2c" stroke="#14b8a6" stroke-width="1" />
              <text x="14" y="154" fill="#99f6e4" font-size="11" font-family="sans-serif">拓撲糾纏熵 γ_top (ln 2 單位)</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                γ_top = {{ state.topologicalEntanglementGamma }} ln 2
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#082e2c" stroke="#14b8a6" stroke-width="1" />
              <text x="14" y="220" fill="#99f6e4" font-size="11" font-family="sans-serif">里德堡阻塞比 R_b / a 與失諧 Δ/Ω</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                R_b/a = {{ state.blockadeRatioRbOverA }} | Δ/Ω = {{ state.normalizedDetuningDeltaOmega }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#0f4743" />
              <rect x="14" y="252" :width="Math.min(250, state.fredenhagenMarcuOrder * 250)" height="6" rx="3" fill="#2dd4bf" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">里德堡光鑷紅寶石晶格量子相體制選擇 (Regime Select)</label>
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
              <span>里德堡阻塞比 R_b / a</span>
              <span class="value">{{ state.blockadeRatioRbOverA }}</span>
            </div>
            <input
              type="range"
              min="1.10"
              max="2.40"
              step="0.02"
              :value="state.blockadeRatioRbOverA"
              @input="onBlockadeInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>歸一化雷射失諧 Δ / Ω</span>
              <span class="value">{{ state.normalizedDetuningDeltaOmega }}</span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="4.5"
              step="0.05"
              :value="state.normalizedDetuningDeltaOmega"
              @input="onDetuningInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>里德堡拉比頻率 Ω / 2π (MHz)</span>
              <span class="value">{{ state.rabiFrequencyMhz }} MHz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12.0"
              step="0.5"
              :value="state.rabiFrequencyMhz"
              @input="onRabiInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playRydbergSound">
              🔊 激發里德堡二聚體弦共鳴
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
  rydbergTopologicalSpinLiquidArrayEngine,
  RydbergSpinLiquidRegime
} from '../engine/rydbergTopologicalSpinLiquidArray';

const uiStore = useUIStore();
const engine = rydbergTopologicalSpinLiquidArrayEngine;
const state = computed(() => engine.getState());

const regimes: { id: RydbergSpinLiquidRegime; label: string }[] = [
  { id: 'disordered-paramagnetic-monomer', label: '無序順磁單體態' },
  { id: 'valence-bond-solid-crystal', label: '價鍵固體結晶相 (VBS)' },
  { id: 'z2-rvb-topological-spin-liquid', label: 'Z₂ 共振價鍵拓撲自旋液體' },
  { id: 'non-abelian-vison-braiding-liquid', label: '非阿貝爾磁通子編織液態' }
];

const wilsonLoopPathD = computed(() => {
  const pts = state.value.dimerNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setRydbergSpinLiquidArrayModal(false);
}

function onBlockadeInput(e: Event) {
  engine.setBlockadeRatio(Number((e.target as HTMLInputElement).value));
}

function onDetuningInput(e: Event) {
  engine.setNormalizedDetuning(Number((e.target as HTMLInputElement).value));
}

function onRabiInput(e: Event) {
  engine.setRabiFrequency(Number((e.target as HTMLInputElement).value));
}

function playRydbergSound() {
  engine.triggerRydbergArraySound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 16, 15, 0.82);
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
  background: #051c1a;
  border: 1px solid #14b8a6;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(20, 184, 166, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #092e2b;
  border-bottom: 1px solid #0d9488;
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
  color: #f0fdfa;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #5eead4;
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
  border: 1px solid #0d9488;
}

.rydberg-svg {
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
  color: #99f6e4;
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
  background: #0a3632;
  color: #ccfbf1;
  border: 1px solid #0d9488;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #0d9488;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(45, 212, 191, 0.45);
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
  color: #ccfbf1;
}

.slider-header .value {
  font-family: monospace;
  color: #2dd4bf;
}

input[type="range"] {
  accent-color: #14b8a6;
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
  background: #0d9488;
  color: #ffffff;
}

.audio-btn:hover {
  background: #14b8a6;
}

.reset-btn {
  background: #0d3d39;
  color: #99f6e4;
  border: 1px solid #0d9488;
}

.reset-btn:hover {
  background: #135751;
  color: #ffffff;
}
</style>
