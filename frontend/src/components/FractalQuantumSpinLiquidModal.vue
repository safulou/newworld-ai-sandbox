<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🔺</span>
          <div>
            <h2>分數維度碎形量子自旋液體與任意子對偶全息干涉儀</h2>
            <p class="subtitle">Sierpiński Kitaev Spin Liquid, Vison Flux Fractionalization & Anyon Mach-Zehnder Interferometer</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="fractal-qsl-svg">
            <defs>
              <linearGradient id="fractalBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#04151f" />
                <stop offset="50%" stop-color="#072638" />
                <stop offset="100%" stop-color="#020c12" />
              </linearGradient>

              <radialGradient id="visonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#22d3ee" stop-opacity="1" />
                <stop offset="60%" stop-color="#0ea5e9" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.05" />
              </radialGradient>

              <filter id="glowQsl">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#fractalBg)" rx="8" />

            <!-- Left: Sierpiński Fractal Gasket & Anyon Interferometer Loops -->
            <g transform="translate(65, 25)">
              <!-- Outer Sierpiński Triangle -->
              <polygon points="160,35 55,245 265,245" fill="none" stroke="#0284c7" stroke-width="1.8" opacity="0.65" />
              <!-- Inner Inverted Lacunarity Hole (Vison Trapping Core) -->
              <polygon points="107.5,140 212.5,140 160,245" fill="rgba(14, 165, 233, 0.12)" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="4 3" />

              <!-- Mach-Zehnder Anyon Braiding Worldline Loop -->
              <ellipse
                cx="160"
                cy="165"
                rx="78"
                ry="46"
                fill="none"
                stroke="#f59e0b"
                stroke-width="1.6"
                stroke-dasharray="5 4"
                filter="url(#glowQsl)"
              />

              <!-- 15 Fractal Spin Liquid Sites -->
              <g v-for="st in state.sites" :key="st.id">
                <circle
                  :cx="st.x"
                  :cy="st.y"
                  :r="4.5 + st.majoranaDensity * 4.5"
                  :fill="st.visonFluxWp < 0 ? '#fbbf24' : 'url(#visonGlow)'"
                  filter="url(#glowQsl)"
                />
                <text
                  :x="st.x"
                  :y="st.y - 8"
                  text-anchor="middle"
                  :fill="st.visonFluxWp < 0 ? '#fde68a' : '#7dd3fc'"
                  font-size="9"
                  font-family="monospace"
                >
                  {{ st.visonFluxWp < 0 ? 'W=-1' : 'c_i' }}
                </text>
              </g>

              <text x="160" y="298" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="monospace">
                d_H = {{ state.hausdorffDimensionDh }} · d_s = {{ state.spectralDimensionDs }} · {{ regimeLabel }}
              </text>
            </g>

            <!-- Right: Topological Entanglement & Anyon Interferometry Gauges -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#082436" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="22" fill="#7dd3fc" font-size="11" font-family="sans-serif">碎形豪斯多夫維度 d_H / 譜維度 d_s</text>
              <text x="14" y="45" fill="#22d3ee" font-size="18" font-weight="bold" font-family="monospace">
                d_H = {{ state.hausdorffDimensionDh }} <tspan font-size="12" fill="#38bdf8">(d_s = {{ state.spectralDimensionDs }})</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#082436" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="88" fill="#7dd3fc" font-size="11" font-family="sans-serif">拓撲糾纏熵 γ_TEE (k_B)</text>
              <text x="14" y="111" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                γ_TEE = {{ state.topologicalEntanglementGamma }} k_B
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#082436" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="154" fill="#7dd3fc" font-size="11" font-family="sans-serif">Z_2 磁通子 / 伊辛任意子捕獲數 N_v</text>
              <text x="14" y="177" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                N_v = {{ state.visonVortexCount }} <tspan font-size="11" fill="#9ca3af">(d_σ = √2 非阿貝爾模)</tspan>
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#082436" stroke="#0284c7" stroke-width="1" />
              <text x="14" y="220" fill="#7dd3fc" font-size="11" font-family="sans-serif">馬赫-曾德爾任意子干涉可見度 V_int</text>
              <text x="14" y="242" fill="#f43f5e" font-size="18" font-weight="bold" font-family="monospace">
                V_int = {{ state.anyonInterferenceVisibility }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#0c3652" />
              <rect x="14" y="252" :width="Math.min(250, state.anyonInterferenceVisibility * 250)" height="6" rx="3" fill="#22d3ee" />
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">碎形自旋液體與任意子編織體制選擇 (Regime Select)</label>
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
              <span>豪斯多夫維度 d_H</span>
              <span class="value">{{ state.hausdorffDimensionDh }}</span>
            </div>
            <input
              type="range"
              min="1.30"
              max="2.00"
              step="0.01"
              :value="state.hausdorffDimensionDh"
              @input="onDhInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>Kitaev 交換耦合 J_K (meV)</span>
              <span class="value">{{ state.kitaevExchangeJMeV }} meV</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="50.0"
              step="1.0"
              :value="state.kitaevExchangeJMeV"
              @input="onJkInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>Z_2 磁通子 / 任意子數 N_v</span>
              <span class="value">{{ state.visonVortexCount }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              :value="state.visonVortexCount"
              @input="onNvInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playQslSound">
              🔊 激發任意子干涉黃金和弦
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
  fractalQuantumSpinLiquidInterferometerEngine,
  FractalSpinLiquidRegime
} from '../engine/fractalQuantumSpinLiquidInterferometer';

const uiStore = useUIStore();
const engine = fractalQuantumSpinLiquidInterferometerEngine;
const state = computed(() => engine.getState());

const regimes: { id: FractalSpinLiquidRegime; label: string }[] = [
  { id: 'abelian-toric-code-phase', label: '阿貝爾環面碼相 (d_H=1.95)' },
  { id: 'sierpinski-kitaev-spin-liquid', label: '謝爾賓斯基自旋液體 (d_H=1.585)' },
  { id: 'non-abelian-ising-anyon-braiding', label: '非阿貝爾伊辛任意子編織' },
  { id: 'holographic-fractal-duality-resonance', label: '全息碎形對偶共振態' }
];

const regimeLabel = computed(() => {
  const found = regimes.find(r => r.id === state.value.activeRegime);
  return found ? found.label : state.value.activeRegime;
});

function handleClose() {
  uiStore.setFractalQuantumSpinLiquidModal(false);
}

function onDhInput(e: Event) {
  engine.setHausdorffDimension(Number((e.target as HTMLInputElement).value));
}

function onJkInput(e: Event) {
  engine.setKitaevExchange(Number((e.target as HTMLInputElement).value));
}

function onNvInput(e: Event) {
  engine.setVisonVortexCount(Number((e.target as HTMLInputElement).value));
}

function playQslSound() {
  engine.triggerFractalQslSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 16, 0.8);
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
  background: #051622;
  border: 1px solid #0284c7;
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
  background: #082233;
  border-bottom: 1px solid #0369a1;
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

.fractal-qsl-svg {
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
  background: #0a293d;
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
  color: #22d3ee;
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
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.reset-btn {
  background: #0c314a;
  color: #7dd3fc;
  border: 1px solid #0284c7;
}

.reset-btn:hover {
  background: #124566;
  color: #ffffff;
}
</style>
