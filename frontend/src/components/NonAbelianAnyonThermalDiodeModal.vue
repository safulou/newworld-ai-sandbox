<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card naatd-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 60 · NON-ABELIAN ANYON INTERFEROMETER &amp; MAJORANA THERMAL DIODE</span>
          <h2>🔥 非阿貝爾任意子量子霍爾干涉熱電二極體與手性馬約拉納熱流閥</h2>
          <p class="subtitle">ν = 5/2 Ising Anyon σ×σ = I + ψ Even-Odd Interference Extinction &amp; Half-Integer Thermal Hall κ_xy = (5/2)κ₀</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">e/4 任意子奇偶干涉可見度</span>
          <span class="kpi-value highlight-cyan">{{ (state.e4InterferenceVisibility * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">N_σ = {{ state.localizedAnyonCountNsigma }} ({{ state.localizedAnyonCountNsigma % 2 === 0 ? '偶數恢復' : '奇數消光' }})</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">半整數手性熱霍爾電導 (κ_xy)</span>
          <span class="kpi-value highlight-amber">{{ state.halfIntegerThermalHallK0.toFixed(2) }} κ₀</span>
          <span class="kpi-sub">c_- = 5/2 手性馬約拉納邊界模</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">非阿貝爾編織統計相移 (Δθ)</span>
          <span class="kpi-value highlight-violet">{{ state.nonAbelianBraidingPhasePi.toFixed(2) }} π</span>
          <span class="kpi-sub">Δθ = N_σ × (π/4) 拓撲相移</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">馬約拉納熱二極體整流效率</span>
          <span class="kpi-value highlight-emerald">{{ state.thermalDiodeRectificationPct.toFixed(1) }}%</span>
          <span class="kpi-sub">雙 QPC 非線性馬約拉納熱流閥</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="naatd-svg">
            <defs>
              <radialGradient id="naatdCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.42" />
                <stop offset="55%" stop-color="#a855f7" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070914" />
            <circle cx="165" cy="160" r="115" fill="url(#naatdCoreGrad)" />

            <!-- Fabry-Pérot Double-QPC Chiral Edge Interferometer Loop -->
            <ellipse cx="165" cy="160" rx="88" ry="68" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.65" />
            <!-- QPC1 & QPC2 Tunneling Bridges -->
            <line x1="105" y1="108" x2="105" y2="212" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="225" y1="108" x2="225" y2="212" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" />

            <!-- Central Localized Ising Anyon Island -->
            <circle cx="165" cy="160" r="24" fill="#0f172a" stroke="#fb7185" stroke-width="2" />
            <text x="165" y="157" fill="#fda4af" font-size="8.5" font-weight="bold" text-anchor="middle">N_σ = {{ state.localizedAnyonCountNsigma }}</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">{{ state.localizedAnyonCountNsigma % 2 === 0 ? 'EVEN' : 'ODD' }}</text>

            <!-- 16 Anyon Braiding & Chiral Edge Nodes -->
            <g v-for="node in state.braidingNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.2"
                :fill="node.fusionChannel === 'ising-sigma' ? '#facc15' : node.fusionChannel === 'majorana-psi' ? '#f43f5e' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#fda4af" font-size="10" font-weight="bold">
              ν = 5/2 Fabry-Pérot Anyon Interferometer (κ_xy = {{ state.halfIntegerThermalHallK0.toFixed(2) }} κ₀)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Vis_e/4: {{ (state.e4InterferenceVisibility * 100).toFixed(1) }}% | Thermal Diode: {{ state.thermalDiodeRectificationPct.toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">非阿貝爾任意子奇偶干涉與熱二極體體制 (Anyon Diode Regimes)</label>
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
                <span>干涉腔釘扎局域 e/4 伊辛任意子數 N_σ (0 ~ 8)</span>
                <strong class="accent-cyan">N_σ = {{ state.localizedAnyonCountNsigma }}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                :value="state.localizedAnyonCountNsigma"
                @input="onAnyonCountChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>跨量子點接觸溫差偏壓比 ΔT / T₀ (0.10 ~ 2.50)</span>
                <strong class="accent-rose">{{ state.thermalGradientRatioDeltaT.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="2.50"
                step="0.05"
                :value="state.thermalGradientRatioDeltaT"
                @input="onThermalChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發伊辛任意子 σ×σ = I + ψ 奇偶編織諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置非阿貝爾熱流干涉儀
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
  nonAbelianAnyonThermalDiodeEngine,
  type NonAbelianThermalDiodeRegime
} from '../engine/nonAbelianAnyonThermalDiode';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(nonAbelianAnyonThermalDiodeEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: NonAbelianThermalDiodeRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'pfaffian-even-anyon-ab-interference',
    label: '偶數任意子 (N_σ=2) e/4 干涉恢復',
    desc: '偶數個局域 σ 融合為玻色子/費米子，e/4 干涉清晰且相移 π/2',
    icon: '✨'
  },
  {
    value: 'non-abelian-odd-anyon-braiding-extinction',
    label: '奇數任意子 (N_σ=3) 非阿貝爾消光',
    desc: '奇數個 σ 與邊界準粒子糾纏改變融合通道，e/4 干涉完全熄滅',
    icon: '🌑'
  },
  {
    value: 'half-integer-thermal-hall-kappa-five-halves',
    label: 'κ_xy = (5/2)κ₀ 半整數熱霍爾平台',
    desc: '驗證無電荷手性馬約拉納邊界模攜帶 c_- = 1/2 分數熱流量子',
    icon: '🔥'
  },
  {
    value: 'chiral-majorana-thermal-rectifier-valve',
    label: '手性馬約拉納高整流熱流二極體閥',
    desc: '強溫差偏壓下透過非線性 QPC 達成 >90% 單向馬約拉納熱整流',
    icon: '⚡'
  }
];

function syncFromEngine(): void {
  Object.assign(state, nonAbelianAnyonThermalDiodeEngine.getState());
}

function selectRegime(regime: NonAbelianThermalDiodeRegime): void {
  nonAbelianAnyonThermalDiodeEngine.setRegime(regime);
  nonAbelianAnyonThermalDiodeEngine.triggerAnyonBraidingSound();
  achievements.unlock('non_abelian_anyon_thermal_diode_interferometer');
  syncFromEngine();
}

function onAnyonCountChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianAnyonThermalDiodeEngine.setLocalizedAnyonCount(val);
  achievements.unlock('non_abelian_anyon_thermal_diode_interferometer');
  syncFromEngine();
}

function onThermalChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianAnyonThermalDiodeEngine.setThermalGradientRatio(val);
  achievements.unlock('non_abelian_anyon_thermal_diode_interferometer');
  syncFromEngine();
}

function triggerSound(): void {
  nonAbelianAnyonThermalDiodeEngine.triggerAnyonBraidingSound();
  achievements.unlock('non_abelian_anyon_thermal_diode_interferometer');
}

function resetEngine(): void {
  nonAbelianAnyonThermalDiodeEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setNonAbelianAnyonThermalDiodeModal(false);
}

onMounted(() => {
  achievements.unlock('non_abelian_anyon_thermal_diode_interferometer');
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
  background: linear-gradient(145deg, #160a1c 0%, #241028 100%);
  border: 1px solid rgba(244, 63, 94, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(244, 63, 94, 0.2);
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
  color: #fb7185;
  background: rgba(244, 63, 94, 0.14);
  border: 1px solid rgba(244, 63, 94, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #ffe4e6;
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
.highlight-violet { color: #e879f9; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.naatd-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(244, 63, 94, 0.3);
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
  border-color: #fb7185;
  background: rgba(244, 63, 94, 0.16);
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
.accent-rose { color: #fb7185; }
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
  background: linear-gradient(90deg, #e11d48, #9333ea);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
