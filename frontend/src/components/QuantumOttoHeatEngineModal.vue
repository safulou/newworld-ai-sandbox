<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🔥</span>
          <div>
            <h2>非馬可夫壓縮熱庫量子奧托熱機與麥克斯韋量子妖反饋</h2>
            <p class="subtitle">Squeezed Thermal Reservoir Quantum Otto Cycle, Super-Carnot Efficiency & Ergotropy Harvesting</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="otto-svg">
            <defs>
              <linearGradient id="ottoBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#240a0a" />
                <stop offset="50%" stop-color="#3d1212" />
                <stop offset="100%" stop-color="#140505" />
              </linearGradient>

              <filter id="glowOtto">
                <feGaussianBlur stdDeviation="2.7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#ottoBg)" rx="8" />

            <!-- Left: Phase-Space Squeezed Wigner Ellipse & 4-Stroke Quantum Otto Cycle -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="112" fill="none" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45" />
              <ellipse
                cx="165"
                cy="160"
                :rx="Math.min(115, 58 * (1 + state.bathSqueezingParamRs * 0.45))"
                :ry="Math.max(24, 58 / (1 + state.bathSqueezingParamRs * 0.45))"
                fill="rgba(244, 63, 94, 0.12)"
                stroke="#fb7185"
                stroke-width="1.8"
                filter="url(#glowOtto)"
              />

              <!-- 4-Stroke Otto Trajectory -->
              <path
                :d="strokePathD"
                fill="none"
                stroke="#fbbf24"
                stroke-width="2.2"
                filter="url(#glowOtto)"
              />

              <!-- 16 Squeezed Wigner & Otto Stroke Nodes -->
              <g v-for="sn in state.strokeNodes" :key="sn.id">
                <circle
                  :cx="sn.x"
                  :cy="sn.y"
                  :r="4.5 + sn.ergotropyDensity * 3.5"
                  :fill="sn.strokeIndex % 2 === 0 ? '#f43f5e' : '#38bdf8'"
                  filter="url(#glowOtto)"
                />
                <text
                  :x="sn.x"
                  :y="sn.y - 9"
                  text-anchor="middle"
                  :fill="sn.strokeIndex % 2 === 0 ? '#fda4af' : '#bae6fd'"
                  font-size="8"
                  font-family="monospace"
                >
                  S{{ sn.strokeIndex }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#fecdd3" font-size="12" font-family="monospace">
                r_s = {{ state.bathSqueezingParamRs }} · η_Otto = {{ state.quantumOttoEfficiencyPct }}% (η_C = {{ state.classicalCarnotLimitPct }}%)
              </text>
            </g>

            <!-- Right: Quantum Otto Cycle & Ergotropy Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#330e14" stroke="#f43f5e" stroke-width="1" />
              <text x="14" y="22" fill="#fda4af" font-size="11" font-family="sans-serif">壓縮熱庫量子奧托效率 η_Otto</text>
              <text x="14" y="45" fill="#fbbf24" font-size="19" font-weight="bold" font-family="monospace">
                η_Otto = {{ state.quantumOttoEfficiencyPct }}% <tspan font-size="11" fill="#4ade80">(> η_Carnot)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#330e14" stroke="#f43f5e" stroke-width="1" />
              <text x="14" y="88" fill="#fda4af" font-size="11" font-family="sans-serif">經典熱平衡卡諾效率基準 η_Carnot</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                η_Carnot = {{ state.classicalCarnotLimitPct }}% (1 - T_c/T_h)
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#330e14" stroke="#f43f5e" stroke-width="1" />
              <text x="14" y="154" fill="#fda4af" font-size="11" font-family="sans-serif">單循環可提取相干功 W_ergo (ℏω₁)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                W_ergo = {{ state.ergotropyWorkOutputHbarW }} ℏω₁
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#330e14" stroke="#f43f5e" stroke-width="1" />
              <text x="14" y="220" fill="#fda4af" font-size="11" font-family="sans-serif">熱庫壓縮參數 r_s 與頻率壓縮比 ω₂/ω₁</text>
              <text x="14" y="242" fill="#fb7185" font-size="17" font-weight="bold" font-family="monospace">
                r_s = {{ state.bathSqueezingParamRs }} | ω₂/ω₁ = {{ state.compressionRatioOmega }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#541620" />
              <rect x="14" y="252" :width="Math.min(250, (state.quantumOttoEfficiencyPct / 100) * 250)" height="6" rx="3" fill="#fbbf24" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">量子奧托熱機與壓縮熱庫體制選擇 (Regime Select)</label>
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
              <span>熱庫雙光子壓縮參數 r_s</span>
              <span class="value">r_s = {{ state.bathSqueezingParamRs }}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="1.80"
              step="0.05"
              :value="state.bathSqueezingParamRs"
              @input="onSqueezeInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>絕熱頻率壓縮比 ω₂ / ω₁</span>
              <span class="value">{{ state.compressionRatioOmega }}</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="5.0"
              step="0.1"
              :value="state.compressionRatioOmega"
              @input="onCompressionInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>高低溫熱庫溫度比 T_h / T_c</span>
              <span class="value">{{ state.bathTemperatureRatioThTc }}</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="10.0"
              step="0.5"
              :value="state.bathTemperatureRatioThTc"
              @input="onTempRatioInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playOttoSound">
              🔊 激發量子奧托四衝程諧音
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
  quantumOttoSqueezeHeatEngine,
  QuantumOttoEngineRegime
} from '../engine/quantumOttoSqueezeHeatEngine';

const uiStore = useUIStore();
const engine = quantumOttoSqueezeHeatEngine;
const state = computed(() => engine.getState());

const regimes: { id: QuantumOttoEngineRegime; label: string }[] = [
  { id: 'classical-markovian-otto-cycle', label: '經典馬可夫平衡奧托循環' },
  { id: 'adiabatic-shortcut-sta-stroke', label: '絕熱捷徑 (STA) 無摩擦循環' },
  { id: 'squeezed-bath-super-carnot-regime', label: '壓縮熱庫超卡諾效率體制' },
  { id: 'quantum-demon-ergotropy-harvester', label: '麥克斯韋量子妖相干功收割' }
];

const strokePathD = computed(() => {
  const pts = state.value.strokeNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setQuantumOttoHeatEngineModal(false);
}

function onSqueezeInput(e: Event) {
  engine.setBathSqueezingParam(Number((e.target as HTMLInputElement).value));
}

function onCompressionInput(e: Event) {
  engine.setCompressionRatioOmega(Number((e.target as HTMLInputElement).value));
}

function onTempRatioInput(e: Event) {
  engine.setBathTemperatureRatio(Number((e.target as HTMLInputElement).value));
}

function playOttoSound() {
  engine.triggerQuantumOttoSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 5, 7, 0.82);
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
  background: #1f080b;
  border: 1px solid #f43f5e;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(244, 63, 94, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #330d13;
  border-bottom: 1px solid #e11d48;
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
  color: #fff1f2;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fda4af;
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
  border: 1px solid #e11d48;
}

.otto-svg {
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
  color: #fda4af;
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
  background: #3d0f17;
  color: #ffe4e6;
  border: 1px solid #e11d48;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #e11d48;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(251, 113, 133, 0.45);
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
  color: #ffe4e6;
}

.slider-header .value {
  font-family: monospace;
  color: #fbbf24;
}

input[type="range"] {
  accent-color: #f43f5e;
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
  background: #e11d48;
  color: #ffffff;
}

.audio-btn:hover {
  background: #f43f5e;
}

.reset-btn {
  background: #47121b;
  color: #fda4af;
  border: 1px solid #e11d48;
}

.reset-btn:hover {
  background: #631926;
  color: #ffffff;
}
</style>
