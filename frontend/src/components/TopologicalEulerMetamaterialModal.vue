<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🧬</span>
          <div>
            <h2>拓撲歐拉類多能隙超材料與非阿貝爾四元數節點編織</h2>
            <p class="subtitle">Multi-Gap Patch Euler Class χ_D, Quaternion Q_8 Frame Charges & Braiding Obstruction to Annihilation</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="euler-svg">
            <defs>
              <linearGradient id="eulerBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0b1528" />
                <stop offset="50%" stop-color="#152447" />
                <stop offset="100%" stop-color="#060b17" />
              </linearGradient>

              <filter id="glowEuler">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="360" fill="url(#eulerBg)" rx="8" />

            <!-- Left: Brillouin Zone Patch D & Multi-Gap Quaternion Braiding Worldlines -->
            <g transform="translate(65, 20)">
              <circle cx="165" cy="160" r="112" fill="rgba(99, 102, 241, 0.08)" stroke="#818cf8" stroke-width="1.3" stroke-dasharray="6 3" />
              <circle cx="165" cy="160" r="64" fill="none" stroke="#f472b6" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.55" />

              <!-- Non-Abelian Dirac Node Braiding Trajectory -->
              <path
                :d="braidPathD"
                fill="none"
                stroke="#a5b4fc"
                stroke-width="2.2"
                filter="url(#glowEuler)"
              />

              <!-- 12 Multi-Gap Band Nodes with Quaternion Charges -->
              <g v-for="bn in state.bandNodes" :key="bn.id">
                <circle
                  :cx="bn.x"
                  :cy="bn.y"
                  :r="5 + bn.eulerCurvatureDensity * 4"
                  :fill="bn.gapIndex === 1 ? '#ec4899' : '#38bdf8'"
                  filter="url(#glowEuler)"
                />
                <text
                  :x="bn.x"
                  :y="bn.y - 9"
                  text-anchor="middle"
                  :fill="bn.gapIndex === 1 ? '#fbcfe8' : '#bae6fd'"
                  font-size="9"
                  font-weight="bold"
                  font-family="monospace"
                >
                  {{ bn.quaternionCharge }}
                </text>
              </g>

              <text x="165" y="306" text-anchor="middle" fill="#c7d2fe" font-size="12" font-family="monospace">
                χ_D = {{ state.patchEulerInvariantChi }} · Φ_Q8 = {{ state.nonAbelianFramePhasePi }}π · ΔE_obst = {{ state.annihilationBarrierMev }} meV
              </text>
            </g>

            <!-- Right: Euler Class & Quaternion Braiding Metrics -->
            <g transform="translate(480, 38)">
              <rect x="0" y="0" width="280" height="56" rx="6" fill="#111d3b" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="22" fill="#c7d2fe" font-size="11" font-family="sans-serif">區塊歐拉類不變量 χ_D (Patch Euler Class)</text>
              <text x="14" y="45" fill="#ec4899" font-size="19" font-weight="bold" font-family="monospace">
                χ_D = {{ state.patchEulerInvariantChi }} <tspan font-size="11" fill="#e0e7ff">({{ state.patchEulerInvariantChi >= 2 ? '拓撲阻挫保護' : '可成對湮滅' }})</tspan>
              </text>

              <rect x="0" y="66" width="280" height="56" rx="6" fill="#111d3b" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="88" fill="#c7d2fe" font-size="11" font-family="sans-serif">非阿貝爾四元數標架相位 Φ_Q8 / π</text>
              <text x="14" y="111" fill="#38bdf8" font-size="18" font-weight="bold" font-family="monospace">
                Φ_Q8 = {{ state.nonAbelianFramePhasePi }} π (Q_8 ∈ {±i,±j,±k})
              </text>

              <rect x="0" y="132" width="280" height="56" rx="6" fill="#111d3b" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="154" fill="#c7d2fe" font-size="11" font-family="sans-serif">節點湮滅拓撲阻挫能壘 ΔE_obst (meV)</text>
              <text x="14" y="177" fill="#4ade80" font-size="18" font-weight="bold" font-family="monospace">
                {{ state.annihilationBarrierMev }} meV
              </text>

              <rect x="0" y="198" width="280" height="72" rx="6" fill="#111d3b" stroke="#6366f1" stroke-width="1" />
              <text x="14" y="220" fill="#c7d2fe" font-size="11" font-family="sans-serif">多能隙聲光邊界波導透射增益 T_edge (dB)</text>
              <text x="14" y="242" fill="#fbbf24" font-size="18" font-weight="bold" font-family="monospace">
                T_edge = +{{ state.edgeAcousticTransmissionDb }} dB
              </text>
              <rect x="14" y="252" width="250" height="6" rx="3" fill="#1e3266" />
              <rect x="14" y="252" :width="Math.min(250, (state.edgeAcousticTransmissionDb / 60) * 250)" height="6" rx="3" fill="#818cf8" />
            </g>
          </svg>
        </div>

        <div class="controls-grid">
          <div class="control-group full-width">
            <label class="group-label">拓撲歐拉類多能隙超材料體制選擇 (Regime Select)</label>
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
              <span>區塊歐拉類不變量 χ_D (0, 1, 2, 4)</span>
              <span class="value">χ_D = {{ state.patchEulerInvariantChi }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              :value="state.patchEulerInvariantChi"
              @input="onEulerInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>動量空間編織應變度 ε_braid (%)</span>
              <span class="value">{{ state.braidingStrainPercent }}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="6.0"
              step="0.2"
              :value="state.braidingStrainPercent"
              @input="onStrainInput"
            />
          </div>

          <div class="control-group">
            <div class="slider-header">
              <span>相鄰能隙耦合強度 J_gap (THz)</span>
              <span class="value">{{ state.intergapCouplingThz }} THz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              :value="state.intergapCouplingThz"
              @input="onCouplingInput"
            />
          </div>

          <div class="control-group action-buttons">
            <button class="action-btn audio-btn" @click="playEulerSound">
              🔊 激發四元數節點編織諧音
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
  topologicalEulerClassMetamaterialEngine,
  EulerClassMetamaterialRegime
} from '../engine/topologicalEulerClassMetamaterial';

const uiStore = useUIStore();
const engine = topologicalEulerClassMetamaterialEngine;
const state = computed(() => engine.getState());

const regimes: { id: EulerClassMetamaterialRegime; label: string }[] = [
  { id: 'trivial-zero-euler-annihilated', label: '平庸零歐拉類湮滅態 (χ=0)' },
  { id: 'single-gap-stiefel-whitney-dipole', label: '單能隙 Stiefel-Whitney 偶極 (χ=1)' },
  { id: 'braided-euler-class-two-obstruction', label: '非阿貝爾編織阻挫態 (χ=2)' },
  { id: 'high-euler-quaternionic-meron-lattice', label: '高階四元數半斯格明子晶格 (χ=4)' }
];

const braidPathD = computed(() => {
  const pts = state.value.bandNodes;
  if (!pts || pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x} ${pts[i].y}`;
  }
  d += ' Z';
  return d;
});

function handleClose() {
  uiStore.setTopologicalEulerMetamaterialModal(false);
}

function onEulerInput(e: Event) {
  engine.setPatchEulerInvariant(Number((e.target as HTMLInputElement).value));
}

function onStrainInput(e: Event) {
  engine.setBraidingStrain(Number((e.target as HTMLInputElement).value));
}

function onCouplingInput(e: Event) {
  engine.setIntergapCoupling(Number((e.target as HTMLInputElement).value));
}

function playEulerSound() {
  engine.triggerEulerBraidingSound();
}

function resetEngine() {
  engine.reset();
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 24, 0.82);
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
  background: #0a1329;
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
  background: #122147;
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

.euler-svg {
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
  background: #162856;
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
  color: #818cf8;
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
  background: #1a2f66;
  color: #c7d2fe;
  border: 1px solid #4f46e5;
}

.reset-btn:hover {
  background: #25428f;
  color: #ffffff;
}
</style>
