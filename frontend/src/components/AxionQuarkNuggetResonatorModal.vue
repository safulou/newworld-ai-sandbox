<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">☄️</span>
          <div>
            <h2>相對論性軸子夸克團塊暗物質磁層諧振與反物質電離層湮滅</h2>
            <p class="subtitle">Axion Quark Nugget (AQN) CFL Core, Positron Electrosphere 511 keV Annihilation & Primakoff Flare</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="aqn-svg">
            <defs>
              <linearGradient id="aqnBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#211206" />
                <stop offset="50%" stop-color="#381d08" />
                <stop offset="100%" stop-color="#120903" />
              </linearGradient>

              <filter id="glowAqn">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#aqnBg)" rx="8" />

            <!-- Left: CFL Quark Core, Axion Domain Wall & Positron Electrosphere -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="108" fill="none" stroke="#f59e0b" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.5" />
              <circle cx="165" cy="160" r="56" fill="rgba(249, 115, 22, 0.16)" stroke="#fb923c" stroke-width="2.0" filter="url(#glowAqn)" />
              <circle cx="165" cy="160" r="24" fill="#ea580c" opacity="0.65" filter="url(#glowAqn)" />

              <!-- Primakoff & Annihilation Radiation Envelope -->
              <path
                :d="jetPathD"
                fill="none"
                stroke="#fde047"
                stroke-width="2.0"
                filter="url(#glowAqn)"
              />

              <!-- 16 Positron Annihilation & Primakoff Photon Nodes -->
              <g v-for="jn in state.jetNodes" :key="jn.id">
                <circle
                  :cx="jn.x"
                  :cy="jn.y"
                  :r="jn.isPositronJet ? 6.0 : 4.5"
                  :fill="jn.isPositronJet ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowAqn)"
                />
                <text
                  :x="jn.x"
                  :y="jn.y - 9"
                  text-anchor="middle"
                  :fill="jn.isPositronJet ? '#fda4af' : '#bae6fd'"
                  font-size="8"
                  font-family="monospace"
                >
                  {{ jn.isPositronJet ? '511k' : 'a→γ' }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#fed7aa" font-size="12" font-family="monospace">
                log₁₀|B| = {{ state.baryonChargeLog10B }} · m_a = {{ state.axionMassMicroEv }} μeV · Φ_511 = {{ state.annihilation511KevFlux }}×10¹⁸/s
              </text>
            </g>

            <!-- Right: AQN Dark Matter & Primakoff Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#2e1707" stroke="#f97316" stroke-width="1" />
              <text x="14" y="22" fill="#fed7aa" font-size="11" font-family="sans-serif">511 keV 正負電子對湮滅通量 Φ_511</text>
              <text x="14" y="45" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.annihilation511KevFlux }} × 10¹⁸ ph/s
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#2e1707" stroke="#f97316" stroke-width="1" />
              <text x="14" y="88" fill="#fed7aa" font-size="11" font-family="sans-serif">軸子疇壁 Primakoff 射電功率 P_radio</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.primakoffRadioPowerMw }} MW
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#2e1707" stroke="#f97316" stroke-width="1" />
              <text x="14" y="154" fill="#fed7aa" font-size="11" font-family="sans-serif">色味鎖定超導核心能隙 Δ_CFL (MeV)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                Δ_CFL = {{ state.cflColorSuperconductingGapMev }} MeV
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#2e1707" stroke="#f97316" stroke-width="1" />
              <text x="14" y="220" fill="#fed7aa" font-size="11" font-family="sans-serif">重子荷對數 log₁₀|B| 與軸子質量 m_a</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                10^{{ state.baryonChargeLog10B }} B | {{ state.axionMassMicroEv }} μeV
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#4a2409" />
              <rect x="14" y="252" :width="Math.min(250, ((state.baryonChargeLog10B - 24) / 4.5) * 250)" height="6" rx="3" fill="#fb923c" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">軸子夸克團塊磁層交互作用體制選擇 (Regime Select)</label>
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
              <span>團塊重子荷對數 log₁₀|B|</span>
              <span class="value">{{ state.baryonChargeLog10B }}</span>
            </div>
            <input
              type="range"
              min="24.0"
              max="28.5"
              step="0.1"
              :value="state.baryonChargeLog10B"
              @input="onBaryonInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>疇壁軸子質量 m_a (μeV)</span>
              <span class="value">{{ state.axionMassMicroEv }} μeV</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="250.0"
              step="5.0"
              :value="state.axionMassMicroEv"
              @input="onMassInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>磁層磁場強度 B_0 (Tesla)</span>
              <span class="value">{{ state.magnetosphereFieldTesla }} T</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="50.0"
              step="0.5"
              :value="state.magnetosphereFieldTesla"
              @input="onFieldInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playAqnSound">
              🔊 激發夸克團塊湮滅射電暴
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
  axionQuarkNuggetDarkMatterResonatorEngine,
  AxionQuarkNuggetRegime
} from '../engine/axionQuarkNuggetDarkMatterResonator';

const uiStore = useUIStore();
const engine = axionQuarkNuggetDarkMatterResonatorEngine;
const state = computed(() => engine.getState());

const regimes: { id: AxionQuarkNuggetRegime; label: string }[] = [
  { id: 'dormant-interstellar-aqn', label: '星際休眠夸克團塊' },
  { id: 'ionospheric-positron-electrosphere', label: '電離層正電子球激發' },
  { id: 'magnetosphere-primakoff-radio-flare', label: '磁層 Primakoff 射電暴' },
  { id: 'cfl-core-antimatter-annihilation-surge', label: 'CFL 反物質核心全功率湮滅' }
];

const jetPathD = computed(() => {
  const pts = state.value.jetNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setAxionQuarkNuggetResonatorModal(false);
}

function onBaryonInput(e: Event) {
  engine.setBaryonChargeLog10(Number((e.target as HTMLInputElement).value));
}

function onMassInput(e: Event) {
  engine.setAxionMassMicroEv(Number((e.target as HTMLInputElement).value));
}

function onFieldInput(e: Event) {
  engine.setMagnetosphereField(Number((e.target as HTMLInputElement).value));
}

function playAqnSound() {
  engine.triggerAqnResonanceSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 9, 3, 0.82);
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
  background: #1c0f05;
  border: 1px solid #f97316;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(249, 115, 22, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2e1808;
  border-bottom: 1px solid #ea580c;
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
  color: #ffedd5;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fdba74;
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
  border: 1px solid #ea580c;
}

.aqn-svg {
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
  color: #fed7aa;
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
  background: #361b08;
  color: #ffedd5;
  border: 1px solid #ea580c;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #ea580c;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.45);
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
  color: #ffedd5;
}

.slider-header .value {
  font-family: monospace;
  color: #fb923c;
}

input[type="range"] {
  accent-color: #f97316;
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
  background: #ea580c;
  color: #ffffff;
}

.audio-btn:hover {
  background: #f97316;
}

.reset-btn {
  background: #3d1f0a;
  color: #fed7aa;
  border: 1px solid #ea580c;
}

.reset-btn:hover {
  background: #592d0e;
  color: #ffffff;
}
</style>
