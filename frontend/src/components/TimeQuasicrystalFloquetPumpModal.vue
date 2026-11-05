<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card tqfp-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 61 · TIME QUASICRYSTAL &amp; INCOMMENSURATE FLOQUET TOPOLOGICAL PUMP</span>
          <h2>⏳ 時間準晶與多頻無理數弗洛凱高階拓撲泵浦</h2>
          <p class="subtitle">Golden-Ratio Incommensurate Drive ω₂/ω₁ = φ ≈ 1.618, Synthetic Frequency Lattice (n₁, n₂) &amp; Quantized Energy Pump</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">時間準晶次諧波序參量 (Z_DTQC)</span>
          <span class="kpi-value highlight-amber">{{ state.subharmonicQuasiOrderParam.toFixed(3) }}</span>
          <span class="kpi-sub">ω = (p/2)ω₁ + (q/2)ω₂ 雙次諧波</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">合成頻率晶格陳數 (C_syn)</span>
          <span class="kpi-value highlight-cyan">C_syn = {{ state.syntheticFrequencyChernNumber }}</span>
          <span class="kpi-sub">2D (n₁, n₂) 合成頻率布洛赫帶</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">拓撲能量泵浦功率 (P_{1→2})</span>
          <span class="kpi-value highlight-emerald">{{ state.quantizedEnergyPumpRateHw2.toFixed(3) }} ħω₁²/2π</span>
          <span class="kpi-sub">雙驅動光場間量子化功率轉換</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">丟番圖預熱化壽命 log₁₀(N_cyc)</span>
          <span class="kpi-value highlight-violet">10^{{ state.prethermalLifetimeLogCycles.toFixed(2) }}</span>
          <span class="kpi-sub">無理數頻率抑制多體弗洛凱熱化</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="tqfp-svg">
            <defs>
              <radialGradient id="tqfpCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.42" />
                <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#tqfpCoreGrad)" />

            <!-- Synthetic Frequency Lattice Grid Lines -->
            <line x1="65" y1="60" x2="265" y2="260" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.45" />
            <line x1="65" y1="260" x2="265" y2="60" stroke="#facc15" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.45" />

            <!-- 16 Synthetic 2D Frequency Lattice Nodes (n1, n2) -->
            <g v-for="node in state.frequencyNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.0 + node.subharmonicFourierPeak * 2.5"
                :fill="(node.harmonicIndexN1 + node.harmonicIndexN2) % 2 === 0 ? '#facc15' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#fde047" font-size="10" font-weight="bold">
              2D Synthetic Frequency Lattice (ω₂/ω₁ = {{ state.frequencyRatioGoldenDetuning.toFixed(3) }})
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              C_syn: {{ state.syntheticFrequencyChernNumber }} | Pump P_{1→2}: {{ state.quantizedEnergyPumpRateHw2.toFixed(3) }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">多頻無理數時間準晶與合成拓撲泵浦體制 (DTQC Regimes)</label>
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
                <span>雙驅動頻率比 ω₂ / ω₁ (1.100 ~ 2.200，黃金比例 φ = 1.618)</span>
                <strong class="accent-amber">{{ state.frequencyRatioGoldenDetuning.toFixed(3) }}</strong>
              </div>
              <input
                type="range"
                min="1.100"
                max="2.200"
                step="0.002"
                :value="state.frequencyRatioGoldenDetuning"
                @input="onRatioChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>多體自旋伊辛耦合強度 J_int / ω₁ (0.05 ~ 1.20)</span>
                <strong class="accent-cyan">{{ state.manyBodyInteractionStrengthJ.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.20"
                step="0.02"
                :value="state.manyBodyInteractionStrengthJ"
                @input="onInteractionChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發黃金比例 φ = 1.618 雙次諧波時間準晶和弦
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置時間準晶拓撲泵
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
  timeQuasicrystalFloquetPumpEngine,
  type TimeQuasicrystalRegime
} from '../engine/timeQuasicrystalFloquetPump';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(timeQuasicrystalFloquetPumpEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: TimeQuasicrystalRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'single-frequency-subharmonic-dtc',
    label: '單頻週期倍增離散時間晶體',
    desc: 'ω₂/ω₁ = 1.000，退化為一維單頻 ω/2 週期倍增時間晶體',
    icon: '🕰️'
  },
  {
    value: 'golden-ratio-fibonacci-time-quasicrystal',
    label: '黃金比例斐波那契時間準晶',
    desc: 'ω₂/ω₁ = φ ≈ 1.618，丟番圖保護雙重無理數次諧波剛性序',
    icon: '⏳'
  },
  {
    value: 'quantized-synthetic-frequency-chern-pump',
    label: '合成頻率陳數 C_syn = 2 拓撲能量泵',
    desc: '2D 合成頻率晶格非零貝里曲率驅動雙光場量子化能量轉換',
    icon: '⚡'
  },
  {
    value: 'ergodic-floquet-thermalization-breakdown',
    label: '有理數共振 (3:2) 弗洛凱遍歷熱化',
    desc: 'ω₂/ω₁ = 1.500 觸發多光子共振吸收，預熱化平台崩潰至無限溫',
    icon: '🔥'
  }
];

function syncFromEngine(): void {
  Object.assign(state, timeQuasicrystalFloquetPumpEngine.getState());
}

function selectRegime(regime: TimeQuasicrystalRegime): void {
  timeQuasicrystalFloquetPumpEngine.setRegime(regime);
  timeQuasicrystalFloquetPumpEngine.triggerTimeQuasicrystalSound();
  achievements.unlock('time_quasicrystal_incommensurate_floquet_pump');
  syncFromEngine();
}

function onRatioChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  timeQuasicrystalFloquetPumpEngine.setFrequencyRatio(val);
  achievements.unlock('time_quasicrystal_incommensurate_floquet_pump');
  syncFromEngine();
}

function onInteractionChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  timeQuasicrystalFloquetPumpEngine.setManyBodyInteraction(val);
  achievements.unlock('time_quasicrystal_incommensurate_floquet_pump');
  syncFromEngine();
}

function triggerSound(): void {
  timeQuasicrystalFloquetPumpEngine.triggerTimeQuasicrystalSound();
  achievements.unlock('time_quasicrystal_incommensurate_floquet_pump');
}

function resetEngine(): void {
  timeQuasicrystalFloquetPumpEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setTimeQuasicrystalFloquetModal(false);
}

onMounted(() => {
  achievements.unlock('time_quasicrystal_incommensurate_floquet_pump');
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
  background: linear-gradient(145deg, #120e1e 0%, #1c142b 100%);
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
.tqfp-svg {
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
  background: linear-gradient(90deg, #d97706, #0284c7);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
