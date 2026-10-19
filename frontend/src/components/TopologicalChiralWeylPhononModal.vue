<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🎵</span>
          <div>
            <h2>拓撲手性時間反演破缺外爾聲子超流體與熱霍爾渦旋晶格</h2>
            <p class="subtitle">Chiral Weyl Phonon Monopoles, Surface Phonon Arcs & Phonon Thermal Hall Superfluid</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="weyl-phonon-svg">
            <defs>
              <linearGradient id="phononBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a1624" />
                <stop offset="50%" stop-color="#11243b" />
                <stop offset="100%" stop-color="#050b12" />
              </linearGradient>

              <filter id="glowPhonon">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#phononBg)" rx="8" />

            <!-- Left: 3D Phonon Brillouin Zone & Chiral Surface Phonon Fermi Arcs -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="115" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <circle cx="165" cy="160" r="55" fill="none" stroke="#a855f7" stroke-width="1.0" stroke-dasharray="3 3" opacity="0.45" />

              <!-- Phonon Surface Fermi Arc Connections -->
              <path
                :d="arcPathD"
                fill="none"
                stroke="#22d3ee"
                stroke-width="2.5"
                filter="url(#glowPhonon)"
              />

              <!-- 14 Weyl Phonon Monopole & Vortex Nodes -->
              <g v-for="pn in state.phononNodes" :key="pn.id">
                <circle
                  :cx="pn.x"
                  :cy="pn.y"
                  :r="5 + pn.berryFluxDensity * 4"
                  :fill="pn.chiralityCharge > 0 ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowPhonon)"
                />
                <text
                  :x="pn.x"
                  :y="pn.y - 9"
                  text-anchor="middle"
                  :fill="pn.chiralityCharge > 0 ? '#fda4af' : '#bae6fd'"
                  font-size="9"
                  font-family="monospace"
                >
                  {{ pn.chiralityCharge > 0 ? `+${pn.chiralityCharge}` : pn.chiralityCharge }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="monospace">
                |C_ph| = {{ state.phononMonopoleChargeC }} · κ_xy^ph = {{ state.thermalHallConductivityMw }} mW/K·m
              </text>
            </g>

            <!-- Right: Chiral Phonon & Thermal Hall Metrics -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#0d2138" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="22" fill="#7dd3fc" font-size="11" font-family="sans-serif">外爾聲子單極陳數荷 |C_ph|</text>
              <text x="14" y="45" fill="#f43f5e" font-size="19" font-weight="bold" font-family="monospace">
                C_ph = ±{{ state.phononMonopoleChargeC }} <tspan font-size="11" fill="#bae6fd">(貝里通量源)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#0d2138" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="88" fill="#7dd3fc" font-size="11" font-family="sans-serif">聲子熱霍爾電導率 κ_xy^ph (mW/K·m)</text>
              <text x="14" y="111" fill="#22d3ee" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.thermalHallConductivityMw }} mW/K·m
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#0d2138" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="154" fill="#7dd3fc" font-size="11" font-family="sans-serif">手性聲子贗角動量密度 J_z^ph (ℏ/nm³)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.chiralAngularMomentumDensity }} ℏ/nm³
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#0d2138" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="220" fill="#7dd3fc" font-size="11" font-family="sans-serif">聲子超流凝聚相干度 f_BEC</text>
              <text x="14" y="242" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                f_BEC = {{ state.superfluidCoherenceFraction }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#0c3454" />
              <rect x="14" y="252" :width="Math.min(250, state.superfluidCoherenceFraction * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">外爾聲子超流與熱霍爾體制選擇 (Regime Select)</label>
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
              <span>外爾聲子單極荷 |C_ph|</span>
              <span class="value">{{ state.phononMonopoleChargeC }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              :value="state.phononMonopoleChargeC"
              @input="onChargeInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>自旋-聲子耦合強度 g_sp (meV)</span>
              <span class="value">{{ state.spinPhononCouplingMeV }} meV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="45.0"
              step="0.5"
              :value="state.spinPhononCouplingMeV"
              @input="onCouplingInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>橫向熱梯度 ΔT/L (K/μm)</span>
              <span class="value">{{ state.thermalGradientKelvinUm }} K/μm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30.0"
              step="0.5"
              :value="state.thermalGradientKelvinUm"
              @input="onGradInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playPhononSound">
              🔊 激發手性聲子熱霍爾諧音
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
  topologicalChiralWeylPhononSuperfluidEngine,
  ChiralWeylPhononRegime
} from '../engine/topologicalChiralWeylPhononSuperfluid';

const uiStore = useUIStore();
const engine = topologicalChiralWeylPhononSuperfluidEngine;
const state = computed(() => engine.getState());

const regimes: { id: ChiralWeylPhononRegime; label: string }[] = [
  { id: 'achiral-acoustic-lattice', label: '非手性聲學晶格' },
  { id: 'single-weyl-phonon-monopole', label: '單外爾聲子單極 (C=1)' },
  { id: 'double-weyl-surface-arc-condensate', label: '雙外爾表面聲子費米弧 (C=2)' },
  { id: 'quantized-thermal-hall-superfluid', label: '量子化熱霍爾超流體 (C=4)' }
];

const arcPathD = computed(() => {
  const pts = state.value.phononNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setTopologicalChiralWeylPhononModal(false);
}

function onChargeInput(e: Event) {
  engine.setPhonopoleCharge(Number((e.target as HTMLInputElement).value));
}

function onCouplingInput(e: Event) {
  engine.setSpinPhononCoupling(Number((e.target as HTMLInputElement).value));
}

function onGradInput(e: Event) {
  engine.setThermalGradient(Number((e.target as HTMLInputElement).value));
}

function playPhononSound() {
  engine.triggerWeylPhononSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 18, 0.8);
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
  background: #071424;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(14, 165, 233, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0c213b;
  border-bottom: 1px solid #0284c7;
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
  border: 1px solid #0284c7;
}

.weyl-phonon-svg {
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
  color: #7dd3fc;
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
  background: #0d2745;
  color: #bae6fd;
  border: 1px solid #0284c7;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
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
  color: #38bdf8;
}

input[type="range"] {
  accent-color: #0ea5e9;
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
  background: #0284c7;
  color: #ffffff;
}

.audio-btn:hover {
  background: #0ea5e9;
}

.reset-btn {
  background: #0f3054;
  color: #7dd3fc;
  border: 1px solid #0284c7;
}

.reset-btn:hover {
  background: #164475;
  color: #ffffff;
}
</style>
