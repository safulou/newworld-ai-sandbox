<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card kondo-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 57 · HEAVY-FERMION KONDO-BREAKDOWN QCP</span>
          <h2>⚛️ 重費米子近藤崩潰量子臨界點與費米面重構譜儀</h2>
          <p class="subtitle">YbRh₂Si₂ / CeCoIn₅ Doniach Phase Diagram, Small-to-Large Fermi Surface Jump &amp; ω/T Strange Metal Scaling</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">準粒子有效質量比 (m* / m_e)</span>
          <span class="kpi-value highlight-emerald">{{ state.effectiveQuasiparticleMassRatio.toFixed(0) }} m_e</span>
          <span class="kpi-sub">QCP (g = 1.0) 質量冪律發散</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Luttinger 費米面體積 (V_FS)</span>
          <span class="kpi-value highlight-cyan">{{ (state.fermiSurfaceVolumeFraction * 100).toFixed(0) }}%</span>
          <span class="kpi-sub">小費米面 (50%) ↔ 大費米面 (100%)</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">霍爾係數重構躍變 (R_H Ratio)</span>
          <span class="kpi-value highlight-amber">{{ state.hallCoefficientJumpRatio.toFixed(2) }}×</span>
          <span class="kpi-sub">4f 局域磁矩退局域化跳躍</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">奇異金屬 ω/T 標度指數 (α)</span>
          <span class="kpi-value highlight-violet">{{ state.omegaOverTScalingExponent.toFixed(2) }}</span>
          <span class="kpi-sub">普朗克耗散線性電阻扇區</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="kondo-svg">
            <defs>
              <radialGradient id="kondoQcpGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#kondoQcpGrad)" />

            <!-- Small Fermi Surface Reference Circle -->
            <circle cx="165" cy="160" r="56" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6" />
            <!-- Large Composite Fermi Surface Reference Circle -->
            <circle cx="165" cy="160" r="104" fill="none" stroke="#34d399" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.6" />

            <!-- Central 4f Local Moment / Kondo Singlet Core -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#10b981" stroke-width="2" />
            <text x="165" y="157" fill="#34d399" font-size="9" font-weight="bold" text-anchor="middle">4f + c</text>
            <text x="165" y="168" fill="#fde047" font-size="8" text-anchor="middle">g={{ state.doniachTuningRatioG.toFixed(2) }}</text>

            <!-- 16 Momentum-Space Fermi Surface Reconstruction Nodes -->
            <g v-for="node in state.latticeNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.isKondoSingletScreened ? '#34d399' : '#f59e0b'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.5"
                :fill="node.isKondoSingletScreened ? '#10b981' : '#f59e0b'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#6ee7b7" font-size="10" font-weight="bold">
              Kondo-Breakdown Fermi Volume Jump (V_FS = {{ (state.fermiSurfaceVolumeFraction * 100).toFixed(0) }}%)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | m*/m_e = {{ state.effectiveQuasiparticleMassRatio.toFixed(0) }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">Doniach 重費米子量子臨界相區 (Kondo Lattice Regimes)</label>
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
                <span>Doniach 耦合比 g = J_K / J_c (0.40 ~ 1.80, QCP=1.00)</span>
                <strong class="accent-emerald">{{ state.doniachTuningRatioG.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.40"
                max="1.80"
                step="0.02"
                :value="state.doniachTuningRatioG"
                @input="onDoniachChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>外部量子臨界調諧磁場 B (0.01 ~ 12.0 T)</span>
                <strong class="accent-cyan">{{ state.magneticFieldTesla.toFixed(2) }} T</strong>
              </div>
              <input
                type="range"
                min="0.01"
                max="12.0"
                step="0.05"
                :value="state.magneticFieldTesla"
                @input="onFieldChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發大小費米面 Luttinger 重構諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置 g=1.0 近藤崩潰臨界點
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
  heavyFermionKondoBreakdownQcpEngine,
  type HeavyFermionKondoRegime
} from '../engine/heavyFermionKondoBreakdownQcp';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(heavyFermionKondoBreakdownQcpEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: HeavyFermionKondoRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'antiferromagnetic-small-fermi-surface',
    label: 'RKKY 反鐵磁小費米面相',
    desc: 'g < 1，4f 局域磁矩有序，費米面僅含傳導電子',
    icon: '🧲'
  },
  {
    value: 'kondo-breakdown-local-qcp-fan',
    label: '近藤崩潰局域量子臨界點',
    desc: 'g = 1.0，近藤單態瓦解，霍爾係數 R_H 陡峭躍變',
    icon: '⚡'
  },
  {
    value: 'heavy-fermi-liquid-large-fermi-surface',
    label: '重費米液體大費米面相',
    desc: 'g > 1，4f 與傳導電子雜化形成複合重準粒子',
    icon: '⚛️'
  },
  {
    value: 'strange-metal-planckian-entanglement',
    label: '奇異金屬 ω/T 量子糾纏扇區',
    desc: '有效質量 m* → 1000 m_e，非費米液體線性電阻',
    icon: '🔥'
  }
];

function syncFromEngine(): void {
  Object.assign(state, heavyFermionKondoBreakdownQcpEngine.getState());
}

function selectRegime(regime: HeavyFermionKondoRegime): void {
  heavyFermionKondoBreakdownQcpEngine.setRegime(regime);
  heavyFermionKondoBreakdownQcpEngine.triggerKondoQcpSound();
  achievements.unlock('heavy_fermion_kondo_breakdown_qcp');
  syncFromEngine();
}

function onDoniachChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  heavyFermionKondoBreakdownQcpEngine.setDoniachTuningRatio(val);
  achievements.unlock('heavy_fermion_kondo_breakdown_qcp');
  syncFromEngine();
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  heavyFermionKondoBreakdownQcpEngine.setMagneticFieldTesla(val);
  achievements.unlock('heavy_fermion_kondo_breakdown_qcp');
  syncFromEngine();
}

function triggerSound(): void {
  heavyFermionKondoBreakdownQcpEngine.triggerKondoQcpSound();
  achievements.unlock('heavy_fermion_kondo_breakdown_qcp');
}

function resetEngine(): void {
  heavyFermionKondoBreakdownQcpEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setHeavyFermionKondoQcpModal(false);
}

onMounted(() => {
  achievements.unlock('heavy_fermion_kondo_breakdown_qcp');
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
  background: linear-gradient(145deg, #071318 0%, #0d1f2d 100%);
  border: 1px solid rgba(16, 185, 129, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.2);
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
  color: #34d399;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #d1fae5;
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
.kondo-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(16, 185, 129, 0.3);
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
  border-color: #34d399;
  background: rgba(16, 185, 129, 0.16);
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
.accent-emerald { color: #34d399; }
.accent-cyan { color: #38bdf8; }
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
  background: linear-gradient(90deg, #059669, #0284c7);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
