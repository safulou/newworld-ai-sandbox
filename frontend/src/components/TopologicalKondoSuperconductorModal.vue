<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card tksc-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 60 · TOPOLOGICAL KONDO SUPERCONDUCTOR &amp; MAJORANA KRAMERS PAIRS</span>
          <h2>🧬 拓撲近藤超導體與時間反演不變馬約拉納克萊默斯對</h2>
          <p class="subtitle">Odd-Parity 4f-5d Kondo Hybridization, Class DIII Z₂ = 1 Invariant &amp; Kramers-Protected 4e²/h Zero-Bias Peak</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">克萊默斯對零偏壓電導 G(0)</span>
          <span class="kpi-value highlight-emerald">{{ state.kramersZeroBiasConductanceE2H.toFixed(2) }} e²/h</span>
          <span class="kpi-sub">時間反演保護雙通道 4.00 e²/h</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">DIII 類 Z₂ 拓撲不變量 (ν_DIII)</span>
          <span class="kpi-value highlight-cyan">Z₂ = {{ state.diiiZ2TopologicalInvariant }}</span>
          <span class="kpi-sub">T² = -1 克萊默斯簡併保護</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">重費米子近藤相干溫度 (T*)</span>
          <span class="kpi-value highlight-amber">{{ state.kondoCoherenceTemperatureK.toFixed(1) }} K</span>
          <span class="kpi-sub">4f 局域磁矩與 5d 傳導帶雜化</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">分數 8π 自旋約瑟夫森權重</span>
          <span class="kpi-value highlight-violet">{{ (state.fractionalJosephson8PiWeight * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">γ_{1↑}, γ_{2↓} 奇宇稱對稱自旋泵浦</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="tksc-svg">
            <defs>
              <radialGradient id="tkscCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#060a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060a14" />
            <circle cx="165" cy="160" r="115" fill="url(#tkscCoreGrad)" />

            <!-- Time-Reversal Conjugate Kramers Vortex Rings (↑ and ↓) -->
            <circle cx="165" cy="160" r="66" fill="none" stroke="#34d399" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.65" />
            <circle cx="165" cy="160" r="76" fill="none" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65" />

            <!-- Central Heavy-Fermion Kondo Singlet Core -->
            <circle cx="165" cy="160" r="23" fill="#0f172a" stroke="#10b981" stroke-width="2" />
            <text x="165" y="157" fill="#6ee7b7" font-size="8.5" font-weight="bold" text-anchor="middle">MKP DIII</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">4e²/h</text>

            <!-- 16 Majorana Kramers Pair Vortex Nodes -->
            <g v-for="node in state.kramersNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.kramersPartnerSign === 1 ? '#34d399' : '#38bdf8'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.kramersPartnerSign === 1 ? '#34d399' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#6ee7b7" font-size="10" font-weight="bold">
              Majorana Kramers Pairs (V_K = {{ state.kondoHybridizationStrengthMeV.toFixed(1) }} meV)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Zeeman B_Z: {{ state.timeReversalBreakingZeemanTesla.toFixed(2) }} T | G(0): {{ state.kramersZeroBiasConductanceE2H.toFixed(2) }} e²/h
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">拓撲近藤超導與克萊默斯對體制 (Kondo SC Regimes)</label>
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
                <span>奇宇稱 4f-5d 近藤雜化強度 V_K (1.0 ~ 25.0 meV)</span>
                <strong class="accent-emerald">{{ state.kondoHybridizationStrengthMeV.toFixed(1) }} meV</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                :value="state.kondoHybridizationStrengthMeV"
                @input="onHybridizationChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>時間反演破缺塞曼微擾場 B_Z (0.00 ~ 6.00 T)</span>
                <strong class="accent-cyan">{{ state.timeReversalBreakingZeemanTesla.toFixed(2) }} T</strong>
              </div>
              <input
                type="range"
                min="0.00"
                max="6.00"
                step="0.05"
                :value="state.timeReversalBreakingZeemanTesla"
                @input="onZeemanChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發馬約拉納克萊默斯對 γ_{1↑}/γ_{2↓} 簡併共鳴音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置拓撲近藤超導態
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
  topologicalKondoSuperconductorEngine,
  type TopologicalKondoScRegime
} from '../engine/topologicalKondoSuperconductor';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(topologicalKondoSuperconductorEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: TopologicalKondoScRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'trivial-heavy-fermion-singlet-sc',
    label: '平庸重費米子自旋單態超導',
    desc: '弱近藤雜化 V_K < 6 meV，未發生能帶反轉 (Z₂ = 0)',
    icon: '⚪'
  },
  {
    value: 'diii-majorana-kramers-pair-phase',
    label: 'DIII 類馬約拉納克萊默斯對相',
    desc: 'T² = -1 保護雙馬約拉納零模，零偏壓電導 G(0) = 4e²/h',
    icon: '🧬'
  },
  {
    value: 'fractional-8pi-spin-josephson-pump',
    label: '分數化 8π 週期時間反演自旋泵',
    desc: '零磁場強近藤相干下激發 8π 週期馬約拉納自旋約瑟夫森流',
    icon: '⚡'
  },
  {
    value: 'zeeman-split-chiral-class-d-crossover',
    label: '塞曼破缺手性 Class D 單模相',
    desc: '強外加磁場破壞克萊默斯簡併，退化為單通道 2e²/h 峰',
    icon: '🧲'
  }
];

function syncFromEngine(): void {
  Object.assign(state, topologicalKondoSuperconductorEngine.getState());
}

function selectRegime(regime: TopologicalKondoScRegime): void {
  topologicalKondoSuperconductorEngine.setRegime(regime);
  topologicalKondoSuperconductorEngine.triggerKondoKramersSound();
  achievements.unlock('topological_kondo_majorana_kramers_superconductor');
  syncFromEngine();
}

function onHybridizationChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  topologicalKondoSuperconductorEngine.setKondoHybridizationStrength(val);
  achievements.unlock('topological_kondo_majorana_kramers_superconductor');
  syncFromEngine();
}

function onZeemanChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  topologicalKondoSuperconductorEngine.setTimeReversalBreakingZeeman(val);
  achievements.unlock('topological_kondo_majorana_kramers_superconductor');
  syncFromEngine();
}

function triggerSound(): void {
  topologicalKondoSuperconductorEngine.triggerKondoKramersSound();
  achievements.unlock('topological_kondo_majorana_kramers_superconductor');
}

function resetEngine(): void {
  topologicalKondoSuperconductorEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setTopologicalKondoSuperconductorModal(false);
}

onMounted(() => {
  achievements.unlock('topological_kondo_majorana_kramers_superconductor');
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
  background: linear-gradient(145deg, #07131c 0%, #0f1f2c 100%);
  border: 1px solid rgba(52, 211, 153, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(52, 211, 153, 0.2);
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
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #ecfdf5;
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
.tksc-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(52, 211, 153, 0.3);
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
  background: rgba(52, 211, 153, 0.16);
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
.accent-emerald { color: #34d399; }
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
