<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🕳️</span>
          <div>
            <h2>全息 SYK 雙邊耦合可穿越蟲洞與量子資訊引力傳態</h2>
            <p class="subtitle">Gao-Jafferis-Wall / Maldacena-Qi Traversable AdS₂ Wormhole, Operator Size-Winding & Teleportation</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="syk-wormhole-svg">
            <defs>
              <linearGradient id="sykBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0d1124" />
                <stop offset="50%" stop-color="#1c1f42" />
                <stop offset="100%" stop-color="#060812" />
              </linearGradient>

              <filter id="glowSyk">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#sykBg)" rx="8" />

            <!-- Left: AdS_2 Traversable Throat Geometry, Left/Right SYK Boundaries & Size-Winding Chords -->
            <g transform="translate(65, 20)">
              <!-- Hyperbolic Wormhole Throat Walls -->
              <path d="M 65 45 Q 165 105 265 45" fill="none" stroke="#818cf8" stroke-width="2.0" />
              <path d="M 65 275 Q 165 215 265 275" fill="none" stroke="#818cf8" stroke-width="2.0" />
              <ellipse cx="65" cy="160" rx="22" ry="115" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" stroke-width="1.6" />
              <ellipse cx="265" cy="160" rx="22" ry="115" fill="rgba(244, 114, 182, 0.1)" stroke="#f472b6" stroke-width="1.6" />

              <!-- Traversing Geodesic & Majorana Chord Web -->
              <path
                :d="chordPathD"
                fill="none"
                stroke="#34d399"
                stroke-width="2.0"
                stroke-dasharray="4 3"
                filter="url(#glowSyk)"
              />

              <!-- 16 Left/Right SYK Boundary & Bulk Throat Nodes -->
              <g v-for="cn in state.chordNodes" :key="cn.id">
                <circle
                  :cx="cn.x"
                  :cy="cn.y"
                  :r="cn.boundarySide === 'bulk-throat' ? 6.5 : 5.0"
                  :fill="cn.boundarySide === 'L' ? '#38bdf8' : cn.boundarySide === 'R' ? '#f472b6' : '#fbbf24'"
                  filter="url(#glowSyk)"
                />
                <text
                  :x="cn.x"
                  :y="cn.y - 9"
                  text-anchor="middle"
                  fill="#e0e7ff"
                  font-size="8"
                  font-family="monospace"
                >
                  {{ cn.boundarySide === 'bulk-throat' ? 'ψ_tele' : `${cn.boundarySide}:${cn.operatorSizeN}` }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#c7d2fe" font-size="12" font-family="monospace">
                μ/J = {{ state.bilinearCouplingMuOverJ }} · W_size = {{ state.sizeWindingCoherenceW }} · F_tele = {{ state.teleportationFidelityF }}
              </text>
            </g>

            <!-- Right: SYK Wormhole & Size-Winding Telemetry -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#151936" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="22" fill="#c7d2fe" font-size="11" font-family="sans-serif">全息蟲洞量子傳態保真度 F_tele</text>
              <text x="14" y="45" fill="#34d399" font-size="19" font-weight="bold" font-family="monospace">
                F_tele = {{ state.teleportationFidelityF }} <tspan font-size="11" fill="#a7f3d0">(GJW 協議)</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#151936" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="88" fill="#c7d2fe" font-size="11" font-family="sans-serif">算符尺寸纏繞相干度 W_size (Size-Winding)</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                W_size = {{ state.sizeWindingCoherenceW }}
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#151936" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="154" fill="#c7d2fe" font-size="11" font-family="sans-serif">施瓦茨蟲洞喉部能隙 Δ_throat / J</text>
              <text x="14" y="177" fill="#f472b6" font-size="18" font-weight="bold" font-family="monospace">
                Δ_throat / J = {{ state.schwarzianThroatGapOverJ }}
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#151936" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="220" fill="#c7d2fe" font-size="11" font-family="sans-serif">雙邊耦合 μ/J 與馬約拉納費米子數 N</text>
              <text x="14" y="242" fill="#fbbf24" font-size="17" font-weight="bold" font-family="monospace">
                μ/J = {{ state.bilinearCouplingMuOverJ }} | N = {{ state.majoranaFermionCountN }}
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#232959" />
              <rect x="14" y="252" :width="Math.min(250, state.teleportationFidelityF * 250)" height="6" rx="3" fill="#34d399" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">全息 SYK 雙邊耦合與可穿越蟲洞體制選擇 (Regime Select)</label>
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
              <span>雙邊 GJW 耦合強度 μ_GJW / J</span>
              <span class="value">{{ state.bilinearCouplingMuOverJ }}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.60"
              step="0.01"
              :value="state.bilinearCouplingMuOverJ"
              @input="onMuInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>無因次逆溫度 βJ</span>
              <span class="value">{{ state.inverseTemperatureBetaJ }}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="45.0"
              step="0.5"
              :value="state.inverseTemperatureBetaJ"
              @input="onBetaInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>SYK 馬約拉納費米子總數 N</span>
              <span class="value">N = {{ state.majoranaFermionCountN }}</span>
            </div>
            <input
              type="range"
              min="16"
              max="128"
              step="4"
              :value="state.majoranaFermionCountN"
              @input="onCountInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playSykSound">
              🔊 激發全息蟲洞尺寸纏繞傳態音
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
  holographicSykWormholeTeleportationEngine,
  HolographicSykWormholeRegime
} from '../engine/holographicSykWormholeTeleportation';

const uiStore = useUIStore();
const engine = holographicSykWormholeTeleportationEngine;
const state = computed(() => engine.getState());

const regimes: { id: HolographicSykWormholeRegime; label: string }[] = [
  { id: 'disconnected-chaotic-black-holes', label: '解耦混亂雙黑洞態' },
  { id: 'negative-energy-shockwave-focusing', label: '負能量衝擊波視界聚焦' },
  { id: 'gjw-size-winding-teleportation', label: 'GJW 算符尺寸纏繞引力傳態' },
  { id: 'maldacena-qi-eternal-wormhole', label: 'Maldacena-Qi 永恆可穿越蟲洞' }
];

const chordPathD = computed(() => {
  const pts = state.value.chordNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  return d;
});

function handleClose() {
  uiStore.setHolographicSykWormholeModal(false);
}

function onMuInput(e: Event) {
  engine.setBilinearCouplingMu(Number((e.target as HTMLInputElement).value));
}

function onBetaInput(e: Event) {
  engine.setInverseTemperatureBetaJ(Number((e.target as HTMLInputElement).value));
}

function onCountInput(e: Event) {
  engine.setMajoranaFermionCount(Number((e.target as HTMLInputElement).value));
}

function playSykSound() {
  engine.triggerSykWormholeSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 8, 18, 0.82);
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
  background: #0b0e21;
  border: 1px solid #6366f1;
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(99, 102, 241, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #141838;
  border-bottom: 1px solid #4f46e5;
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
  color: #eef2ff;
}

.title-wrap .subtitle {
  margin: 4px 0 0;
  font-size: 11px;
  color: #a5b4fc;
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
  border: 1px solid #4f46e5;
}

.syk-wormhole-svg {
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
  color: #c7d2fe;
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
  background: #191f47;
  color: #e0e7ff;
  border: 1px solid #4f46e5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active, .regime-btn:hover {
  background: #4f46e5;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(129, 140, 248, 0.45);
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
  color: #e0e7ff;
}

.slider-header .value {
  font-family: monospace;
  color: #34d399;
}

input[type="range"] {
  accent-color: #6366f1;
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
  background: #4f46e5;
  color: #ffffff;
}

.audio-btn:hover {
  background: #6366f1;
}

.reset-btn {
  background: #1f2659;
  color: #c7d2fe;
  border: 1px solid #4f46e5;
}

.reset-btn:hover {
  background: #2c367d;
  color: #ffffff;
}
</style>
