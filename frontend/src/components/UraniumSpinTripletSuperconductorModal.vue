<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card ute2-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 58 · UTe₂ SPIN-TRIPLET &amp; LAZARUS RE-ENTRANT SUPERCONDUCTIVITY</span>
          <h2>🧲 拓撲手性自旋三重態鈾基超導體與高磁場拉撒路重入超導</h2>
          <p class="subtitle">UTe₂ Equal-Spin Triplet d(k), 34.5 T Metamagnetic Jump &amp; 40–65 T Lazarus Re-Entrant Superconducting Dome</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">超越包立順磁極限 (B / B_P)</span>
          <span class="kpi-value highlight-amber">{{ state.pauliLimitExceedanceRatio.toFixed(1) }}×</span>
          <span class="kpi-sub">等自旋三重態 |↑↑⟩ 免於順磁拆對</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">三重態超導序參量 (|d(k)|)</span>
          <span class="kpi-value highlight-cyan">{{ state.tripletOrderParameterDMeV.toFixed(2) }} meV</span>
          <span class="kpi-sub">奇宇稱手性 B_3u + i B_2u 配對</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">5f 變磁躍變磁化 (M_5f)</span>
          <span class="kpi-value highlight-violet">{{ state.metamagneticPolarizationMuB.toFixed(2) }} μ_B</span>
          <span class="kpi-sub">B_m ≈ 34.5 T 一階變磁跳躍</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">手性馬約拉納電導 (G_Maj)</span>
          <span class="kpi-value highlight-emerald">{{ state.chiralMajoranaConductanceE2H.toFixed(2) }} e²/h</span>
          <span class="kpi-sub">台階邊緣手性馬約拉納表面弧</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="ute2-svg">
            <defs>
              <radialGradient id="ute2CoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.48" />
                <stop offset="55%" stop-color="#f59e0b" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#ute2CoreGrad)" />

            <!-- Cylindrical Heavy-Fermion Brillouin Zone Pillars -->
            <ellipse cx="165" cy="160" rx="82" ry="96" fill="none" stroke="#c084fc" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.55" />
            <ellipse cx="165" cy="160" rx="64" ry="88" fill="none" stroke="#fbbf24" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.55" />

            <!-- Central U-5f Kagome-Ladder Core -->
            <circle cx="165" cy="160" r="24" fill="#1e1b4b" stroke="#facc15" stroke-width="2" />
            <text x="165" y="157" fill="#fde047" font-size="9" font-weight="bold" text-anchor="middle">|↑↑⟩</text>
            <text x="165" y="168" fill="#c084fc" font-size="8" text-anchor="middle">{{ state.appliedFieldTeslaB.toFixed(1) }} T</text>

            <!-- 16 Equal-Spin Triplet d-Vector Fermi Nodes -->
            <g v-for="node in state.tripletNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#c084fc"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.5"
                :fill="node.spinTripletProjection === 'up-up' ? '#facc15' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#e9d5ff" font-size="10" font-weight="bold">
              UTe₂ Triplet Dome (B = {{ state.appliedFieldTeslaB.toFixed(1) }} T, θ_bc = {{ state.fieldTiltAngleBcDeg.toFixed(1) }}°)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | B/B_Pauli = {{ state.pauliLimitExceedanceRatio.toFixed(1) }}×
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">UTe₂ 強磁場自旋三重態相圖 (UTe₂ High-Field Regimes)</label>
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
                <span>外加強磁場 B (0.0 ~ 65.0 T, 變磁躍變 34.5 T)</span>
                <strong class="accent-amber">{{ state.appliedFieldTeslaB.toFixed(1) }} T</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="65.0"
                step="0.5"
                :value="state.appliedFieldTeslaB"
                @input="onFieldChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>b-c 晶面磁場傾角 θ_bc (0.0° ~ 45.0°, 最佳角 28°)</span>
                <strong class="accent-violet">{{ state.fieldTiltAngleBcDeg.toFixed(1) }}°</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="45.0"
                step="0.5"
                :value="state.fieldTiltAngleBcDeg"
                @input="onTiltChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 48T 拉撒路重入自旋三重態諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置拉撒路超高場穹頂
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
  uraniumTopologicalSpinTripletSuperconductorEngine,
  type UraniumTripletScRegime
} from '../engine/uraniumTopologicalSpinTripletSuperconductor';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(uraniumTopologicalSpinTripletSuperconductorEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: UraniumTripletScRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'zero-field-chiral-triplet-sc1',
    label: '低場手性三重態超導相 (SC₁)',
    desc: 'B < 15 T，時間反演破缺手性表面馬約拉納態',
    icon: '❄️'
  },
  {
    value: 'pauli-exceeding-field-reinforced-sc2',
    label: '超包立極限磁場增強相 (SC₂)',
    desc: 'B ≈ 18–34 T，橫向鐵磁自旋漲落反常強化 T_c',
    icon: '⚡'
  },
  {
    value: 'metamagnetic-critical-jump-35t',
    label: '34.5 T 一階變磁量子相變',
    desc: 'B_m = 34.5 T，5f 磁化強度發生階躍式極化重構',
    icon: '📈'
  },
  {
    value: 'lazarus-ultra-high-field-reentrant-dome',
    label: '40–65 T 拉撒路重入超導穹頂',
    desc: 'θ_bc ≈ 28° 極化順磁態內奇蹟重入高場超導相',
    icon: '🧲'
  }
];

function syncFromEngine(): void {
  Object.assign(state, uraniumTopologicalSpinTripletSuperconductorEngine.getState());
}

function selectRegime(regime: UraniumTripletScRegime): void {
  uraniumTopologicalSpinTripletSuperconductorEngine.setRegime(regime);
  uraniumTopologicalSpinTripletSuperconductorEngine.triggerUraniumTripletSound();
  achievements.unlock('uranium_spin_triplet_lazarus_superconductor');
  syncFromEngine();
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  uraniumTopologicalSpinTripletSuperconductorEngine.setAppliedFieldTesla(val);
  achievements.unlock('uranium_spin_triplet_lazarus_superconductor');
  syncFromEngine();
}

function onTiltChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  uraniumTopologicalSpinTripletSuperconductorEngine.setFieldTiltAngleDeg(val);
  achievements.unlock('uranium_spin_triplet_lazarus_superconductor');
  syncFromEngine();
}

function triggerSound(): void {
  uraniumTopologicalSpinTripletSuperconductorEngine.triggerUraniumTripletSound();
  achievements.unlock('uranium_spin_triplet_lazarus_superconductor');
}

function resetEngine(): void {
  uraniumTopologicalSpinTripletSuperconductorEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setUraniumSpinTripletModal(false);
}

onMounted(() => {
  achievements.unlock('uranium_spin_triplet_lazarus_superconductor');
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
  background: linear-gradient(145deg, #100b22 0%, #1c1335 100%);
  border: 1px solid rgba(192, 132, 252, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(192, 132, 252, 0.2);
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
  color: #c084fc;
  background: rgba(192, 132, 252, 0.14);
  border: 1px solid rgba(192, 132, 252, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #f3e8ff;
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
.highlight-cyan { color: #38bdf8; }
.highlight-amber { color: #facc15; }
.highlight-emerald { color: #34d399; }
.highlight-violet { color: #c084fc; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.ute2-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(192, 132, 252, 0.3);
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
  border-color: #c084fc;
  background: rgba(192, 132, 252, 0.16);
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
.accent-amber { color: #facc15; }
.accent-violet { color: #c084fc; }
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
  background: linear-gradient(90deg, #7c3aed, #d97706);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
