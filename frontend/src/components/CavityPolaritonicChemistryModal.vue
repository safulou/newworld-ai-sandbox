<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">⚗️</span>
          <div>
            <h2>腔量子電動力學極化激元超化學與振動強耦合反應器</h2>
            <p class="subtitle">Fabry-Pérot Microcavity VSC/ESC Polaritonic Chemistry, Vacuum Rabi Splitting & Dark Catalysis</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="polariton-chem-svg">
            <defs>
              <linearGradient id="chemBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#072115" />
                <stop offset="50%" stop-color="#0d3824" />
                <stop offset="100%" stop-color="#04120b" />
              </linearGradient>

              <filter id="glowChem">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#chemBg)" rx="8" />

            <!-- Left: Fabry-Pérot Cavity Mirrors & Upper/Lower Polariton Potential Energy Surfaces (UP/LP PES) -->
            <g transform="translate(65, 20)">
              <rect x="35" y="25" width="8" height="255" rx="3" fill="#34d399" opacity="0.65" />
              <rect x="287" y="25" width="8" height="255" rx="3" fill="#34d399" opacity="0.65" />

              <!-- Upper & Lower Polariton PES Curves -->
              <path
                :d="upBranchPathD"
                fill="none"
                stroke="#f472b6"
                stroke-width="2.4"
                filter="url(#glowChem)"
              />
              <path
                :d="lpBranchPathD"
                fill="none"
                stroke="#34d399"
                stroke-width="2.4"
                filter="url(#glowChem)"
              />

              <!-- 18 Upper/Lower Polariton PES Nodes -->
              <g v-for="pn in state.pesNodes" :key="pn.id">
                <circle
                  :cx="pn.x"
                  :cy="pn.y"
                  :r="4.5 + pn.vibronCoherenceWeight * 3.5"
                  :fill="pn.branchType === 'UP' ? '#ec4899' : '#10b981'"
                  filter="url(#glowChem)"
                />
                <text
                  v-if="pn.id === 4 || pn.id === 13"
                  :x="pn.x"
                  :y="pn.y - 10"
                  text-anchor="middle"
                  :fill="pn.branchType === 'UP' ? '#fbcfe8' : '#a7f3d0'"
                  font-size="10"
                  font-weight="bold"
                  font-family="monospace"
                >
                  |{{ pn.branchType }}⟩
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="monospace">
                ℏΩ_R = {{ state.vacuumRabiSplittingMev }} meV · |Δ(ΔG‡)| = {{ state.activationBarrierReductionMev }} meV · k_VSC/k₀ = {{ state.reactionRateEnhancementFactor }}×
              </text>
            </g>

            <!-- Right: Polaritonic Chemistry & VSC Catalysis Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#092e1d" stroke="#10b981" stroke-width="1" />
              <text x="14" y="22" fill="#a7f3d0" font-size="11" font-family="sans-serif">真空強耦合化學反應速率增益 k_VSC / k₀</text>
              <text x="14" y="45" fill="#34d399" font-size="19" font-weight="bold" font-family="monospace">
                {{ state.reactionRateEnhancementFactor }}× <tspan font-size="11" fill="#d1fae5">(無光暗催化)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#092e1d" stroke="#10b981" stroke-width="1" />
              <text x="14" y="88" fill="#a7f3d0" font-size="11" font-family="sans-serif">過渡態活化能壘降低量 |Δ(ΔG‡)| (meV)</text>
              <text x="14" y="111" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                -{{ state.activationBarrierReductionMev }} meV
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#092e1d" stroke="#10b981" stroke-width="1" />
              <text x="14" y="154" fill="#a7f3d0" font-size="11" font-family="sans-serif">跨分子極化激元非定域相干長度 ξ_pol</text>
              <text x="14" y="177" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                ξ_pol = {{ state.polaritonDelocalizationNm }} nm
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#092e1d" stroke="#10b981" stroke-width="1" />
              <text x="14" y="220" fill="#a7f3d0" font-size="11" font-family="sans-serif">真空拉比劈裂 ℏΩ_R 與微腔品質 Q_cav</text>
              <text x="14" y="242" fill="#f472b6" font-size="17" font-weight="bold" font-family="monospace">
                {{ state.vacuumRabiSplittingMev }} meV | Q = {{ state.cavityQualityFactorQ }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#104f32" />
              <rect x="14" y="252" :width="Math.min(250, (state.vacuumRabiSplittingMev / 280) * 250)" height="6" rx="3" fill="#34d399" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">腔量子電動力學極化激元化學體制選擇 (Regime Select)</label>
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
              <span>集體真空拉比劈裂 ℏΩ_R (meV)</span>
              <span class="value">{{ state.vacuumRabiSplittingMev }} meV</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="280.0"
              step="5.0"
              :value="state.vacuumRabiSplittingMev"
              @input="onRabiInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>腔模-分子振動失諧 δ_cav (meV)</span>
              <span class="value">{{ state.cavityVibrationDetuningMev }} meV</span>
            </div>
            <input
              type="range"
              min="-50.0"
              max="50.0"
              step="2.0"
              :value="state.cavityVibrationDetuningMev"
              @input="onDetuningInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>光學微腔品質因子 Q_cav</span>
              <span class="value">Q = {{ state.cavityQualityFactorQ }}</span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              :value="state.cavityQualityFactorQ"
              @input="onQualityInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playChemSound">
              🔊 激發極化激元拉比劈裂雙音
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
  cavityPolaritonicSuperChemistryEngine,
  CavityPolaritonicChemistryRegime
} from '../engine/cavityPolaritonicSuperChemistry';

const uiStore = useUIStore();
const engine = cavityPolaritonicSuperChemistryEngine;
const state = computed(() => engine.getState());

const regimes: { id: CavityPolaritonicChemistryRegime; label: string }[] = [
  { id: 'uncoupled-arrhenius-thermal-kinetics', label: '無腔阿瑞尼士熱化學動力學' },
  { id: 'vibrational-strong-coupling-vsc-catalysis', label: '振動強耦合 (VSC) 真空暗催化' },
  { id: 'electronic-polariton-conical-intersection', label: '電子極化激元錐形交叉重塑' },
  { id: 'ultrastrong-vacuum-ground-state-condensate', label: '超強耦合真空基態極化凝聚' }
];

const upBranchPathD = computed(() => {
  const pts = state.value.pesNodes.filter((n) => n.branchType === 'UP');
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
});

const lpBranchPathD = computed(() => {
  const pts = state.value.pesNodes.filter((n) => n.branchType === 'LP');
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
});

function handleClose() {
  uiStore.setCavityPolaritonicChemistryModal(false);
}

function onRabiInput(e: Event) {
  engine.setVacuumRabiSplitting(Number((e.target as HTMLInputElement).value));
}

function onDetuningInput(e: Event) {
  engine.setCavityVibrationDetuning(Number((e.target as HTMLInputElement).value));
}

function onQualityInput(e: Event) {
  engine.setCavityQualityFactor(Number((e.target as HTMLInputElement).value));
}

function playChemSound() {
  engine.triggerPolaritonicChemistrySound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 18, 11, 0.82);
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
  background: #061c12;
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
  background: #0a2e1d;
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
  color: #6ee7b7;
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
  border: 1px solid #059669;
}

.polariton-chem-svg {
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
  background: #0d3b26;
  color: #d1fae5;
  border: 1px solid #059669;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #059669;
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
  color: #d1fae5;
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
}

.reset-btn {
  background: #114a30;
  color: #a7f3d0;
  border: 1px solid #059669;
}

.reset-btn:hover {
  background: #166340;
  color: #ffffff;
}
</style>
