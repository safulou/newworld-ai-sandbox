<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card mattg-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 61 · MAGIC-ANGLE TWISTED TRILAYER GRAPHENE SPIN-TRIPLET SC</span>
          <h2>🥞 扭轉三層石墨烯平帶自旋三重態莫爾超導與手性包立極限突破</h2>
          <p class="subtitle">A-tw-A Mirror Symmetry θ = √2 θ_MATBG ≈ 1.56°, Flatband-Dirac Hybridization &amp; &gt;3.5× Pauli-Limit Violation</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">包立順磁極限突破比 (B_c∥ / B_P)</span>
          <span class="kpi-value highlight-violet">{{ state.pauliLimitViolationRatio.toFixed(2) }}×</span>
          <span class="kpi-sub">強面內磁場 B_∥ = {{ state.inPlaneMagneticFieldTesla.toFixed(1) }} T</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">自旋三重態莫爾能隙 (Δ_MATTG)</span>
          <span class="kpi-value highlight-cyan">{{ state.tripletSuperconductingGapMeV.toFixed(2) }} meV</span>
          <span class="kpi-sub">同位旋洪德耦合驅動等自旋配對</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">量子度規幾何超流剛度 (D_s)</span>
          <span class="kpi-value highlight-emerald">{{ state.quantumGeometricStiffnessK.toFixed(2) }} K</span>
          <span class="kpi-sub">Fubini-Study 量子度規主導超流</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">交替魔角與垂直電場 (θ, D_z)</span>
          <span class="kpi-value highlight-amber">{{ state.alternatingTwistAngleDeg.toFixed(2) }}°</span>
          <span class="kpi-sub">D_z = {{ state.displacementFieldDzVnm.toFixed(2) }} V/nm 鏡像宇稱雜化</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="mattg-svg">
            <defs>
              <radialGradient id="mattgCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#c084fc" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#22d3ee" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#060914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060914" />
            <circle cx="165" cy="160" r="115" fill="url(#mattgCoreGrad)" />

            <!-- Even Mirror-Parity Flat Band (M_z = +1) & Odd Dirac Cone (M_z = -1) Rings -->
            <circle cx="165" cy="160" r="48" fill="none" stroke="#c084fc" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.65" />
            <circle cx="165" cy="160" r="88" fill="none" stroke="#22d3ee" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65" />

            <!-- Central A-tw-A Moiré Superlattice Core -->
            <circle cx="165" cy="160" r="23" fill="#0f172a" stroke="#e879f9" stroke-width="2" />
            <text x="165" y="157" fill="#f0abfc" font-size="8.5" font-weight="bold" text-anchor="middle">MATTG</text>
            <text x="165" y="168" fill="#22d3ee" font-size="8" text-anchor="middle">{{ state.pauliLimitViolationRatio.toFixed(1) }}× B_P</text>

            <!-- 16 Trilayer Moiré Pairing Nodes -->
            <g v-for="node in state.moireNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.mirrorParityMz === 1 ? '#e879f9' : '#22d3ee'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.mirrorParityMz === 1 ? '#e879f9' : '#22d3ee'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#f0abfc" font-size="10" font-weight="bold">
              A-tw-A Trilayer Graphene (θ = {{ state.alternatingTwistAngleDeg.toFixed(2) }}°, B_∥ = {{ state.inPlaneMagneticFieldTesla.toFixed(1) }} T)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              D_z: {{ state.displacementFieldDzVnm.toFixed(2) }} V/nm | Stiffness D_s: {{ state.quantumGeometricStiffnessK.toFixed(2) }} K
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">交替扭轉三層石墨烯自旋三重態體制 (MATTG Regimes)</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimeOptions"
                :key="opt.value"
                :class="['regime-btn', { active: state.activeRegime === opt.value }]"
                @click="selectRegime(opt.value)"
              >
                <span class="reg-icon">{{ opt.icon }}</span>
                <div class="reg-Info">
                  <strong>{{ opt.label }}</strong>
                  <small>{{ opt.desc }}</small>
                </div>
              </button>
            </div>
          </div>

          <div class="sliders-section">
            <div class="slider-group">
              <div class="slider-header">
                <span>面內平行磁場 B_∥ (0.0 ~ 12.0 T)</span>
                <strong class="accent-violet">{{ state.inPlaneMagneticFieldTesla.toFixed(1) }} T</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="12.0"
                step="0.2"
                :value="state.inPlaneMagneticFieldTesla"
                @input="onFieldChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>垂直位移電場 D_z (0.00 ~ 0.90 V/nm)</span>
                <strong class="accent-cyan">{{ state.displacementFieldDzVnm.toFixed(2) }} V/nm</strong>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.90"
                step="0.02"
                :value="state.displacementFieldDzVnm"
                @input="onDzChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 √2 魔角三層平帶-狄拉克錐雜化三重態諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置三層魔角石墨烯態
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import {
  twistedTrilayerGrapheneTripletScEngine,
  type TwistedTrilayerGrapheneRegime
} from '../engine/twistedTrilayerGrapheneTripletSc';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(twistedTrilayerGrapheneTripletScEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: TwistedTrilayerGrapheneRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'zero-displacement-decoupled-flatband-dirac',
    label: '零電場鏡像對稱平帶-狄拉克解耦',
    desc: 'D_z = 0，M_z = ±1 偶宇稱重平帶與奇宇稱狄拉克錐正交解耦',
    icon: '🪞'
  },
  {
    value: 'optimal-dz-hybridized-ultra-strong-coupling',
    label: '最佳電場雜化超強耦合莫爾超導',
    desc: 'D_z ≈ 0.44 V/nm，ξ_GL 逼近粒子間距進入 BEC-BCS 交界區',
    icon: '⚡'
  },
  {
    value: 'pauli-limit-violating-spin-triplet-phase',
    label: '突破 3.5 倍包立極限自旋三重態',
    desc: 'B_∥ = 6.8 T 下仍保持零電阻超導，排除自旋單態配對',
    icon: '🥞'
  },
  {
    value: 'high-inplane-field-reentrant-nonunitary-sc',
    label: '高面內磁場重入非么正自旋三重態',
    desc: 'B_∥ > 8.5 T 觸發高場重入完全自旋極化 |↑↑⟩ 非么正超導相',
    icon: '🧲'
  }
];

function syncFromEngine(): void {
  Object.assign(state, twistedTrilayerGrapheneTripletScEngine.getState());
}

function selectRegime(regime: TwistedTrilayerGrapheneRegime): void {
  twistedTrilayerGrapheneTripletScEngine.setRegime(regime);
  twistedTrilayerGrapheneTripletScEngine.triggerTrilayerGrapheneSound();
  achievements.unlock('twisted_trilayer_graphene_pauli_violation_sc');
  syncFromEngine();
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  twistedTrilayerGrapheneTripletScEngine.setInPlaneMagneticField(val);
  achievements.unlock('twisted_trilayer_graphene_pauli_violation_sc');
  syncFromEngine();
}

function onDzChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  twistedTrilayerGrapheneTripletScEngine.setDisplacementFieldDz(val);
  achievements.unlock('twisted_trilayer_graphene_pauli_violation_sc');
  syncFromEngine();
}

function triggerSound(): void {
  twistedTrilayerGrapheneTripletScEngine.triggerTrilayerGrapheneSound();
  achievements.unlock('twisted_trilayer_graphene_pauli_violation_sc');
}

function resetEngine(): void {
  twistedTrilayerGrapheneTripletScEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setTwistedTrilayerGrapheneScModal(false);
}

onMounted(() => {
  achievements.unlock('twisted_trilayer_graphene_pauli_violation_sc');
  syncTimer = setInterval(syncFromEngine, 80);
});

onUnmounted(() => {
  if (syncTimer) clearInterval(syncTimer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 18, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(940px, 95vw);
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #100b22 0%, #181132 100%);
  border: 1px solid rgba(232, 121, 249, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(232, 121, 249, 0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #e879f9;
  background: rgba(232, 121, 249, 0.14);
  border: 1px solid rgba(232, 121, 249, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fae8ff;
}
.subtitle {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.kpi-box {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.kpi-label {
  font-size: 11px;
  color: #94a3b8;
}
.kpi-value {
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 2px;
}
.kpi-sub {
  font-size: 10px;
  color: #64748b;
}
.highlight-cyan { color: #22d3ee; }
.highlight-amber { color: #facc15; }
.highlight-emerald { color: #34d399; }
.highlight-violet { color: #e879f9; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.mattg-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(232, 121, 249, 0.3);
  border-radius: 12px;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 10px;
  padding: 8px 10px;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
}
.regime-btn.active {
  border-color: #e879f9;
  background: rgba(232, 121, 249, 0.16);
}
.reg-Info strong {
  display: block;
  font-size: 12px;
}
.reg-Info small {
  font-size: 10px;
  color: #94a3b8;
}
.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.55);
  padding: 12px;
  border-radius: 10px;
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}
.slider-group input[type='range'] {
  width: 100%;
}
.accent-cyan { color: #22d3ee; }
.accent-violet { color: #e879f9; }
.action-row {
  display: flex;
  gap: 10px;
}
.action-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  border: none;
}
.action-btn.primary {
  background: linear-gradient(90deg, #a855f7, #0891b2);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
