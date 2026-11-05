<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card he3kz-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 61 · SUPERFLUID He-3 KIBBLE-ZUREK MONOPOLE &amp; EINSTEIN-CARTAN TORSION</span>
          <h2>🧊 超流氦-3 宇宙學基布爾-祖瑞克相變單極子與愛因斯坦-嘉當扭率渦旋</h2>
          <p class="subtitle">Volovik Universe in a Helium Droplet, KZM Defect Scaling n_vortex ∝ (τ₀/τ_Q)^(1/2), π₂ Dirac Monopoles &amp; Emergent Torsion</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">Kibble-Zurek 渦旋弦密度 (n_KZ)</span>
          <span class="kpi-value highlight-cyan">{{ state.kibbleZurekVortexDensityMm2.toFixed(1) }} mm⁻²</span>
          <span class="kpi-sub">遵循 (τ₀/τ_Q)^(1/2) 宇宙相變標度</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">愛因斯坦-嘉當有效時空扭率</span>
          <span class="kpi-value highlight-amber">|T| = {{ state.einsteinCartanTorsionScalar.toFixed(2) }}</span>
          <span class="kpi-sub">³He-A 軌道織構 ∇×l̂ 誘導外爾扭率</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">A-B 界面 π₂ 狄拉克單極荷</span>
          <span class="kpi-value highlight-emerald">N_mono = {{ state.diracMonopoleHomotopyCount }}</span>
          <span class="kpi-sub">終結奇異渦旋弦之 Boojum 單極子</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">沃洛維克手性反常動量譜流</span>
          <span class="kpi-value highlight-violet">{{ state.chiralSpectralFlowAnomalyKhz.toFixed(1) }} kHz</span>
          <span class="kpi-sub">Adler-Bell-Jackiw 準粒子重子生成</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="he3kz-svg">
            <defs>
              <radialGradient id="he3kzCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#10b981" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#060a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060a14" />
            <circle cx="165" cy="160" r="115" fill="url(#he3kzCoreGrad)" />

            <!-- A-B Phase Interface & Kibble-Zurek Homotopy Shells -->
            <circle cx="165" cy="160" r="52" fill="none" stroke="#facc15" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.7" />
            <circle cx="165" cy="160" r="76" fill="none" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.6" />
            <circle cx="165" cy="160" r="96" fill="none" stroke="#34d399" stroke-width="1.3" stroke-dasharray="6 3" opacity="0.6" />

            <!-- Central Neutron Big-Bang Quench Hot Spot -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
            <text x="165" y="157" fill="#7dd3fc" font-size="8.5" font-weight="bold" text-anchor="middle">³He A/B</text>
            <text x="165" y="168" fill="#facc15" font-size="8" text-anchor="middle">{{ state.abPhaseBoundaryPressureBar.toFixed(1) }} bar</text>

            <!-- 16 Topological Monopole, Vortex String & Boojum Nodes -->
            <g v-for="node in state.defectNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.defectHomotopyType === 'pi2-dirac-monopole' ? '#facc15' : node.defectHomotopyType === 'pi1-vortex-string' ? '#38bdf8' : '#34d399'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.defectHomotopyType === 'pi2-dirac-monopole' ? '#facc15' : node.defectHomotopyType === 'pi1-vortex-string' ? '#38bdf8' : '#34d399'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#7dd3fc" font-size="10" font-weight="bold">
              ³He Kibble-Zurek Defect Network (τ₀/τ_Q = {{ state.quenchRateInverseTauQ.toFixed(2) }}×10⁻³)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Torsion |T|: {{ state.einsteinCartanTorsionScalar.toFixed(2) }} | Monopoles: {{ state.diracMonopoleHomotopyCount }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">超流氦-3 宇宙相變與愛因斯坦-嘉當扭率體制 (He-3 Regimes)</label>
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
                <span>中子捕獲大霹靂淬火速率比 τ₀ / τ_Q (0.20 ~ 8.50 × 10⁻³)</span>
                <strong class="accent-cyan">{{ state.quenchRateInverseTauQ.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.20"
                max="8.50"
                step="0.10"
                :value="state.quenchRateInverseTauQ"
                @input="onQuenchChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>超流 ³He A-B 相變壓力 P (1.0 ~ 34.0 bar)</span>
                <strong class="accent-amber">{{ state.abPhaseBoundaryPressureBar.toFixed(1) }} bar</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="34.0"
                step="0.5"
                :value="state.abPhaseBoundaryPressureBar"
                @input="onPressureChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 ³He-A/B 狄拉克單極子與外爾扭率反常譜流音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置氦-3 宇宙液滴態
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
  superfluidHe3KibbleZurekMonopoleEngine,
  type He3KibbleZurekRegime
} from '../engine/superfluidHe3KibbleZurekMonopole';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(superfluidHe3KibbleZurekMonopoleEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: He3KibbleZurekRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'neutron-quench-kibble-zurek-vortex-tangle',
    label: '中子大霹靂淬火 KZM 宇宙弦纏結',
    desc: '764 keV 中子捕獲微觀火球快速冷卻，檢驗 Kibble-Zurek 標度律',
    icon: '💥'
  },
  {
    value: 'chiral-he3a-weyl-einstein-cartan-torsion',
    label: '手性 ³He-A 外爾愛因斯坦-嘉當扭率',
    desc: '高壓 P > 30 bar 手性外爾節點織構產生等效時空扭率與手性反常',
    icon: '🌀'
  },
  {
    value: 'ab-interface-dirac-monopole-boojum-array',
    label: 'A-B 相界面 π₂ 狄拉克單極子陣列',
    desc: '雙量子渦旋終結於 A-B 相界面形成拓撲保護狄拉克磁單極與 Boojum',
    icon: '🧊'
  },
  {
    value: 'half-quantum-alice-string-vortex-ring',
    label: '半量子愛麗絲弦 (Alice String) 渦旋環',
    desc: '自旋-軌道耦合鎖定下激發攜帶非阿貝爾通量之半量子愛麗絲宇宙弦',
    icon: '💍'
  }
];

function syncFromEngine(): void {
  Object.assign(state, superfluidHe3KibbleZurekMonopoleEngine.getState());
}

function selectRegime(regime: He3KibbleZurekRegime): void {
  superfluidHe3KibbleZurekMonopoleEngine.setRegime(regime);
  superfluidHe3KibbleZurekMonopoleEngine.triggerHe3KibbleZurekSound();
  achievements.unlock('superfluid_he3_kibble_zurek_torsion_monopole');
  syncFromEngine();
}

function onQuenchChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  superfluidHe3KibbleZurekMonopoleEngine.setQuenchRateInverseTauQ(val);
  achievements.unlock('superfluid_he3_kibble_zurek_torsion_monopole');
  syncFromEngine();
}

function onPressureChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  superfluidHe3KibbleZurekMonopoleEngine.setAbPhasePressureBar(val);
  achievements.unlock('superfluid_he3_kibble_zurek_torsion_monopole');
  syncFromEngine();
}

function triggerSound(): void {
  superfluidHe3KibbleZurekMonopoleEngine.triggerHe3KibbleZurekSound();
  achievements.unlock('superfluid_he3_kibble_zurek_torsion_monopole');
}

function resetEngine(): void {
  superfluidHe3KibbleZurekMonopoleEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setSuperfluidHe3KibbleZurekModal(false);
}

onMounted(() => {
  achievements.unlock('superfluid_he3_kibble_zurek_torsion_monopole');
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
  background: linear-gradient(145deg, #071220 0%, #0f1f30 100%);
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
.he3kz-svg {
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
  background: linear-gradient(90deg, #0284c7, #059669);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
