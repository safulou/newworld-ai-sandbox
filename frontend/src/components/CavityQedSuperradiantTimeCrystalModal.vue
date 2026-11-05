<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card ctc-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 59 · CAVITY-QED SUPERRADIANT CONTINUOUS TIME CRYSTAL</span>
          <h2>⏱️ 腔量子電動力學超輻射時間晶體與耗散極限環雷射</h2>
          <p class="subtitle">Open Dicke-Lindblad Master Equation, Liouvillian Gap Closure Re(λ₁)→0 &amp; Sub-Schawlow-Townes Superradiant Clock</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">時間晶體極限環頻率 (ω_CTC / 2π)</span>
          <span class="kpi-value highlight-amber">{{ state.limitCycleFrequencyKhz.toFixed(1) }} kHz</span>
          <span class="kpi-sub">Im(λ₁) = ±ω_CTC 連續時間破缺</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">劉維爾相干品質因子 (Q_CTC)</span>
          <span class="kpi-value highlight-cyan">{{ state.liouvillianCoherenceQualityQ.toFixed(1) }}</span>
          <span class="kpi-sub">ω_CTC / |Re(λ₁)| 極限環壽命標度</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">超輻射腔內光子標度 (|⟨a⟩|² / N²)</span>
          <span class="kpi-value highlight-emerald">{{ (state.superradiantPhotonScaleN2 * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">集體原子偶極同步宏觀相干輻射</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Schawlow-Townes 線寬壓縮</span>
          <span class="kpi-value highlight-violet">-{{ state.schawlowTownesSuppressionDb.toFixed(1) }} dB</span>
          <span class="kpi-sub">⁸⁷Sr 毫赫茲超輻射主動光鐘增益</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="ctc-svg">
            <defs>
              <radialGradient id="ctcGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#ec4899" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070914" />
            <circle cx="165" cy="160" r="115" fill="url(#ctcGlowGrad)" />

            <!-- Collective Bloch Sphere Projection & Hopf Limit Cycle Orbit -->
            <ellipse cx="165" cy="160" rx="88" ry="72" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.65" />
            <circle cx="165" cy="160" r="46" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3 3" opacity="0.45" />

            <!-- Central High-Finesse Cavity Mode Core -->
            <circle cx="165" cy="160" r="21" fill="#0f172a" stroke="#fbbf24" stroke-width="2" />
            <text x="165" y="157" fill="#fde047" font-size="8.5" font-weight="bold" text-anchor="middle">C_coll</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">{{ state.collectiveCooperativityC.toFixed(1) }}</text>

            <!-- 16 Dicke Limit-Cycle Trajectory Nodes -->
            <g v-for="node in state.limitCycleNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#fbbf24"
                stroke-width="1"
                opacity="0.32"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.blochInversionJz >= 0 ? '#facc15' : '#f472b6'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#fde047" font-size="10" font-weight="bold">
              Dicke-Lindblad Limit Cycle (ω_CTC = {{ state.limitCycleFrequencyKhz.toFixed(1) }} kHz)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              W_pump/κ: {{ state.incoherentRepumpRatioW.toFixed(2) }} | Q_CTC: {{ state.liouvillianCoherenceQualityQ.toFixed(1) }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">開放 Dicke-Lindblad 超輻射動力學體制 (Time-Crystal Regimes)</label>
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
                <span>集體 Dicke 協同參數 C_coll = 4g²N / κγ_⊥ (0.5 ~ 25.0)</span>
                <strong class="accent-amber">{{ state.collectiveCooperativityC.toFixed(1) }}</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="25.0"
                step="0.5"
                :value="state.collectiveCooperativityC"
                @input="onCooperativityChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>非相干重泵浦速率比 W_pump / κ (0.10 ~ 3.50)</span>
                <strong class="accent-cyan">{{ state.incoherentRepumpRatioW.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="3.50"
                step="0.05"
                :value="state.incoherentRepumpRatioW"
                @input="onRepumpChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發超輻射連續時間晶體極限環拍頻鐘音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置腔 QED 時間晶體態
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
  cavityQedSuperradiantTimeCrystalEngine,
  type SuperradiantTimeCrystalRegime
} from '../engine/cavityQedSuperradiantTimeCrystal';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(cavityQedSuperradiantTimeCrystalEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: SuperradiantTimeCrystalRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'subthreshold-normal-cavity-decay',
    label: '亞閾值正常空腔弛豫態',
    desc: 'C_coll < C_crit，原子偶極未同步，腔場指數衰減至真空',
    icon: '🌑'
  },
  {
    value: 'stationary-hepp-lieb-superradiant-phase',
    label: '穩態 Hepp-Lieb 超輻射相',
    desc: 'Z₂ 對稱破缺穩態超輻射定點，輸出連續相干毫赫茲雷射',
    icon: '🌟'
  },
  {
    value: 'autonomous-limit-cycle-continuous-time-crystal',
    label: '自發極限環連續時間晶體 (CTC)',
    desc: '跨越 Hopf 分岔，Re(λ₁)→0 自發破缺連續時間平移對稱',
    icon: '⏱️'
  },
  {
    value: 'period-doubled-chaotic-dicke-turbulence',
    label: '強泵浦倍週期分岔與 Dicke 混沌',
    desc: '極高協同度與強重泵浦下觸發高階極限環倍週期分岔',
    icon: '🌀'
  }
];

function syncFromEngine(): void {
  Object.assign(state, cavityQedSuperradiantTimeCrystalEngine.getState());
}

function selectRegime(regime: SuperradiantTimeCrystalRegime): void {
  cavityQedSuperradiantTimeCrystalEngine.setRegime(regime);
  cavityQedSuperradiantTimeCrystalEngine.triggerSuperradiantClockSound();
  achievements.unlock('cavity_qed_superradiant_time_crystal');
  syncFromEngine();
}

function onCooperativityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  cavityQedSuperradiantTimeCrystalEngine.setCollectiveCooperativity(val);
  achievements.unlock('cavity_qed_superradiant_time_crystal');
  syncFromEngine();
}

function onRepumpChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  cavityQedSuperradiantTimeCrystalEngine.setIncoherentRepumpRatio(val);
  achievements.unlock('cavity_qed_superradiant_time_crystal');
  syncFromEngine();
}

function triggerSound(): void {
  cavityQedSuperradiantTimeCrystalEngine.triggerSuperradiantClockSound();
  achievements.unlock('cavity_qed_superradiant_time_crystal');
}

function resetEngine(): void {
  cavityQedSuperradiantTimeCrystalEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setCavityQedSuperradiantTcModal(false);
}

onMounted(() => {
  achievements.unlock('cavity_qed_superradiant_time_crystal');
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
  background: linear-gradient(145deg, #130d1e 0%, #1f1429 100%);
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(250, 204, 21, 0.2);
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
  color: #facc15;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fef9c3;
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
.ctc-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(250, 204, 21, 0.3);
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
  border-color: #facc15;
  background: rgba(250, 204, 21, 0.16);
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
  background: linear-gradient(90deg, #d97706, #db2777);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
