<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card droplet-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 58 · DIPOLAR QUANTUM FERROELECTRIC SUPERFLUID &amp; LHY DROPLETS</span>
          <h2>💧 超冷極性分子偶極量子鐵電超流體與自束縛量子液滴</h2>
          <p class="subtitle">Microwave-Shielded Polar Molecules, Lee-Huang-Yang (LHY) n^(5/2) Stabilization &amp; Hexatic Droplet Supersolid</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">LHY 量子漲落排斥能 (E_LHY)</span>
          <span class="kpi-value highlight-cyan">{{ state.lhyQuantumRepulsionEnergyNhz.toFixed(2) }} kHz</span>
          <span class="kpi-sub">∝ n^(5/2) (1 + 1.5 ε_dd²) 抗塌縮</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">偶極旋子軟化能隙 (Δ_roton)</span>
          <span class="kpi-value highlight-amber">{{ state.rotonGapFrequencyHz.toFixed(1) }} Hz</span>
          <span class="kpi-sub">動量 k_roton 密度調制不穩定性</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">鐵電向列極化序 (P_ferro)</span>
          <span class="kpi-value highlight-emerald">{{ (state.ferroelectricPolarizationOrder * 100).toFixed(0) }}%</span>
          <span class="kpi-sub">有效電偶極矩 d = {{ state.effectiveElectricDipoleDebye.toFixed(2) }} D</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">自束縛液滴核心密度 (n₀)</span>
          <span class="kpi-value highlight-violet">{{ state.dropletEquilibriumDensity.toFixed(2) }}×10¹⁴</span>
          <span class="kpi-sub">cm⁻³ 無外阱零壓自束縛平衡</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="droplet-svg">
            <defs>
              <radialGradient id="dropletGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5" />
                <stop offset="55%" stop-color="#6366f1" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#dropletGlowGrad)" />

            <!-- Hexagonal Supersolid Lattice Guides -->
            <circle cx="165" cy="160" r="52" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
            <circle cx="165" cy="160" r="94" fill="none" stroke="#818cf8" stroke-width="1" stroke-dasharray="4 3" opacity="0.5" />

            <!-- 13 Self-Bound LHY Quantum Ferrofluid Droplet Nodes -->
            <g v-for="node in state.dropletNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#38bdf8"
                stroke-width="1"
                opacity="0.28"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.dropletRadiusUm * 1.1"
                fill="#0284c7"
                fill-opacity="0.45"
                stroke="#38bdf8"
                stroke-width="1.5"
              />
              <!-- Ferroelectric Dipole Arrow inside each Droplet -->
              <line
                :x1="node.x"
                :y1="node.y + 5"
                :x2="node.x"
                :y2="node.y - 5"
                stroke="#fde047"
                stroke-width="1.8"
              />
            </g>

            <text x="12" y="22" fill="#7dd3fc" font-size="10" font-weight="bold">
              LHY Dipolar Droplet Array (ε_dd = {{ state.relativeDipolarStrengthEpsDd.toFixed(2) }}, d = {{ state.effectiveElectricDipoleDebye.toFixed(2) }} D)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | P_ferro = {{ (state.ferroelectricPolarizationOrder * 100).toFixed(0) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">超冷偶極量子流體與液滴相區 (Dipolar Quantum Fluid Regimes)</label>
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
                <span>相對偶極強度 ε_dd = a_dd / a_s (0.50 ~ 2.20)</span>
                <strong class="accent-cyan">{{ state.relativeDipolarStrengthEpsDd.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.50"
                max="2.20"
                step="0.02"
                :value="state.relativeDipolarStrengthEpsDd"
                @input="onEpsChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>微波屏蔽有效電偶極矩 d_eff (0.2 ~ 4.5 Debye)</span>
                <strong class="accent-amber">{{ state.effectiveElectricDipoleDebye.toFixed(2) }} D</strong>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.5"
                step="0.05"
                :value="state.effectiveElectricDipoleDebye"
                @input="onDipoleChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 LHY 自束縛量子鐵電液滴諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置自束縛量子液滴態
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
  dipolarQuantumFerroelectricSuperfluidEngine,
  type DipolarFerroelectricRegime
} from '../engine/dipolarQuantumFerroelectricSuperfluid';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(dipolarQuantumFerroelectricSuperfluidEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: DipolarFerroelectricRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'contact-dominated-repulsive-bec',
    label: '接觸排斥主導常規玻色凝聚',
    desc: 'ε_dd < 1，短程 s-波排斥主導，無自束縛液滴',
    icon: '☁️'
  },
  {
    value: 'roton-minimum-softening-threshold',
    label: '偶極旋子極小值軟化臨界相',
    desc: 'ε_dd ≈ 1.0，有限動量 k_roton 激發能隙趨近軟化',
    icon: '〰️'
  },
  {
    value: 'lhy-stabilized-self-bound-droplet',
    label: 'LHY 量子漲落自束縛液滴相',
    desc: 'ε_dd > 1，李-黃-楊 n^(5/2) 排斥平衡偶極吸引',
    icon: '💧'
  },
  {
    value: 'ferroelectric-supersolid-droplet-crystal',
    label: '鐵電向列超固體液滴晶格',
    desc: '極性分子宏觀鐵電極化與蜂巢液滴超固體共存',
    icon: '🔷'
  }
];

function syncFromEngine(): void {
  Object.assign(state, dipolarQuantumFerroelectricSuperfluidEngine.getState());
}

function selectRegime(regime: DipolarFerroelectricRegime): void {
  dipolarQuantumFerroelectricSuperfluidEngine.setRegime(regime);
  dipolarQuantumFerroelectricSuperfluidEngine.triggerDipolarDropletSound();
  achievements.unlock('dipolar_quantum_ferroelectric_superfluid');
  syncFromEngine();
}

function onEpsChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  dipolarQuantumFerroelectricSuperfluidEngine.setRelativeDipolarStrength(val);
  achievements.unlock('dipolar_quantum_ferroelectric_superfluid');
  syncFromEngine();
}

function onDipoleChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  dipolarQuantumFerroelectricSuperfluidEngine.setEffectiveElectricDipole(val);
  achievements.unlock('dipolar_quantum_ferroelectric_superfluid');
  syncFromEngine();
}

function triggerSound(): void {
  dipolarQuantumFerroelectricSuperfluidEngine.triggerDipolarDropletSound();
  achievements.unlock('dipolar_quantum_ferroelectric_superfluid');
}

function resetEngine(): void {
  dipolarQuantumFerroelectricSuperfluidEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setDipolarFerroelectricModal(false);
}

onMounted(() => {
  achievements.unlock('dipolar_quantum_ferroelectric_superfluid');
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
  background: linear-gradient(145deg, #071222 0%, #0f1f38 100%);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.2);
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
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #e0f2fe;
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
.droplet-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(56, 189, 248, 0.3);
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
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.16);
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
.accent-cyan { color: #38bdf8; }
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
  background: linear-gradient(90deg, #0284c7, #4f46e5);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
