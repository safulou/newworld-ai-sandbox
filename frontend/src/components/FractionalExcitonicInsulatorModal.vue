<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card fei-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 59 · FRACTIONAL EXCITONIC INSULATOR &amp; BILAYER FCI</span>
          <h2>⚛️ 分數激子絕緣體與時間反演對稱雙層分數陳態</h2>
          <p class="subtitle">Zero-Field Opposite-Chern Bilayer (C = ±1), Fractional Quasiparticle-Quasihole Pairing &amp; Counterflow Hall Drag R_xy^drag = m(h/e²)</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">分數激子絕緣體能隙 (Δ_FEI)</span>
          <span class="kpi-value highlight-cyan">{{ state.excitonicInsulatorGapMeV.toFixed(2) }} meV</span>
          <span class="kpi-sub">ν = 1/{{ state.fractionalDenominatorM }} 層間分數準粒子配對</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">對流霍爾拖曳電阻 (R_xy^drag)</span>
          <span class="kpi-value highlight-amber">{{ state.counterflowHallDragHPerE2.toFixed(2) }} h/e²</span>
          <span class="kpi-sub">理論量子化平台 m = {{ state.fractionalDenominatorM }}.00</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">複合費米子超流剛度 (ρ_s,CF)</span>
          <span class="kpi-value highlight-emerald">{{ state.cfSuperfluidStiffnessKelvin.toFixed(2) }} K</span>
          <span class="kpi-sub">電荷中性激子對流無耗散凝聚</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">分數磁旋子極小值 (Δ_roton)</span>
          <span class="kpi-value highlight-violet">{{ state.magnetorotonMinEnergyMeV.toFixed(2) }} meV</span>
          <span class="kpi-sub">Girvin-MacDonald-Platzman 集體模</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="fei-svg">
            <defs>
              <radialGradient id="feiCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#a855f7" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#060914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060914" />
            <circle cx="165" cy="160" r="115" fill="url(#feiCoreGrad)" />

            <!-- Opposite-Chern Bilayer Rings (Top C=+1, Bottom C=-1) -->
            <circle cx="165" cy="160" r="44" fill="none" stroke="#22d3ee" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.65" />
            <circle cx="165" cy="160" r="88" fill="none" stroke="#c084fc" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65" />

            <!-- Central Bilayer Fractional Exciton Core -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
            <text x="165" y="157" fill="#67e8f9" font-size="8.5" font-weight="bold" text-anchor="middle">e* = ±e/{{ state.fractionalDenominatorM }}</text>
            <text x="165" y="168" fill="#e879f9" font-size="8" text-anchor="middle">C = ±1</text>

            <!-- 16 Fractional Exciton Dipole Nodes -->
            <g v-for="node in state.excitonNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#38bdf8"
                stroke-width="1"
                :opacity="0.2 + node.interlayerBindingAmplitude * 0.4"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.2 + node.interlayerBindingAmplitude * 2.2"
                :fill="node.id < 6 ? '#22d3ee' : '#c084fc'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#67e8f9" font-size="10" font-weight="bold">
              Bilayer Fractional Exciton Condensate (ν = 1/{{ state.fractionalDenominatorM }})
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              U_inter/W: {{ state.interlayerCoulombRatioUd.toFixed(2) }} | Drag: {{ state.counterflowHallDragHPerE2.toFixed(2) }} h/e²
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">雙層莫爾分數激子量子相體制 (Bilayer FEI Regimes)</label>
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
                <span>層間庫侖吸引與平帶比 U_inter / W_band (0.20 ~ 4.50)</span>
                <strong class="accent-cyan">{{ state.interlayerCoulombRatioUd.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.20"
                max="4.50"
                step="0.05"
                :value="state.interlayerCoulombRatioUd"
                @input="onCoulombChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>垂直位移電場失諧 D_z (0.0 ~ 120.0 mV/nm)</span>
                <strong class="accent-amber">{{ state.displacementFieldMvNm.toFixed(1) }} mV/nm</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="120.0"
                step="1.0"
                :value="state.displacementFieldMvNm"
                @input="onFieldChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發分數電荷 e* = e/{{ state.fractionalDenominatorM }} 對流激子諧波音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置雙層分數激子態
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
  fractionalExcitonicInsulatorEngine,
  type FractionalExcitonicRegime
} from '../engine/fractionalExcitonicInsulator';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(fractionalExcitonicInsulatorEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: FractionalExcitonicRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'decoupled-bilayer-fractional-chern-liquid',
    label: '解耦雙層分數陳液體',
    desc: '弱層間耦合，上下層各自獨立形成 C=±1 Laughlin 液體',
    icon: '🌊'
  },
  {
    value: 'fractional-excitonic-insulator-nu-one-third',
    label: 'ν = 1/3 分數激子絕緣體 (FEI)',
    desc: 'e* = ±e/3 分數準粒子層間束縛與 R_xy^drag = 3h/e²',
    icon: '⚛️'
  },
  {
    value: 'composite-fermion-counterflow-superfluid',
    label: '複合費米子對流激子超流相',
    desc: '零垂直電場失諧下實現最高中性對流超流剛度 ρ_s,CF',
    icon: '❄️'
  },
  {
    value: 'fractional-magnetoroton-crystallization',
    label: 'ν = 1/5 分數磁旋子結晶態',
    desc: '高階 m=5 分數偶極激子與磁旋子集體模軟化結晶',
    icon: '💎'
  }
];

function syncFromEngine(): void {
  Object.assign(state, fractionalExcitonicInsulatorEngine.getState());
}

function selectRegime(regime: FractionalExcitonicRegime): void {
  fractionalExcitonicInsulatorEngine.setRegime(regime);
  fractionalExcitonicInsulatorEngine.triggerFractionalExcitonSound();
  achievements.unlock('fractional_excitonic_insulator_bilayer');
  syncFromEngine();
}

function onCoulombChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalExcitonicInsulatorEngine.setInterlayerCoulombRatio(val);
  achievements.unlock('fractional_excitonic_insulator_bilayer');
  syncFromEngine();
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  fractionalExcitonicInsulatorEngine.setDisplacementField(val);
  achievements.unlock('fractional_excitonic_insulator_bilayer');
  syncFromEngine();
}

function triggerSound(): void {
  fractionalExcitonicInsulatorEngine.triggerFractionalExcitonSound();
  achievements.unlock('fractional_excitonic_insulator_bilayer');
}

function resetEngine(): void {
  fractionalExcitonicInsulatorEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setFractionalExcitonicInsulatorModal(false);
}

onMounted(() => {
  achievements.unlock('fractional_excitonic_insulator_bilayer');
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
  background: linear-gradient(145deg, #080d1e 0%, #171130 100%);
  border: 1px solid rgba(34, 211, 238, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(34, 211, 238, 0.2);
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
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.14);
  border: 1px solid rgba(34, 211, 238, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #ecfeff;
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
.highlight-violet { color: #c084fc; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.fei-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(34, 211, 238, 0.3);
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
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.16);
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
.accent-amber { color: #facc15; }
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
  background: linear-gradient(90deg, #0891b2, #9333ea);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
