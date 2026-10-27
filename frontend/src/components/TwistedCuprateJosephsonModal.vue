<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card cuprate-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 57 · HIGH-Tc TWISTED CUPRATE d+id JOSEPHSON</span>
          <h2>❄️ 扭轉雙層銅氧化物高溫超導 d+id 拓撲約瑟夫森節</h2>
          <p class="subtitle">Twisted Bilayer Bi₂Sr₂CaCu₂O₈+δ 45° Magic Twist, Charge-4e Co-Tunneling &amp; Half-Quantum Fluxon Diode</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">二階/一階穿隧比 (J₂ / |J₁|)</span>
          <span class="kpi-value highlight-cyan">{{ state.coTunnelingHarmonicRatioJ2J1.toFixed(2) }}×</span>
          <span class="kpi-sub">雙庫柏對 4e 協同穿隧主導度</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">自發時間反演破缺角 (φ₀)</span>
          <span class="kpi-value highlight-amber">{{ state.spontaneousTrsPhaseDeg.toFixed(1) }}°</span>
          <span class="kpi-sub">基態鎖相 ±arccos(J₁/2J₂)</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">d+id 拓撲手性能隙 (Δ_topo)</span>
          <span class="kpi-value highlight-emerald">{{ state.chiralTopologicalGapMev.toFixed(2) }} meV</span>
          <span class="kpi-sub">陳數 C = ±4 手性邊界模保護</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">二極體非互易整流率 (η_JDE)</span>
          <span class="kpi-value highlight-violet">{{ state.josephsonDiodeRectificationPct.toFixed(1) }}%</span>
          <span class="kpi-sub">h/4e 夏皮羅階梯權重: {{ (state.fractionalShapiroVisibility * 100).toFixed(0) }}%</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="cuprate-svg">
            <defs>
              <radialGradient id="cuprateCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#a855f7" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="118" fill="url(#cuprateCoreGrad)" />

            <!-- Upper and Lower Twisted CuO2 Bilayer Reference Circles -->
            <circle cx="165" cy="160" r="88" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.5" />
            <circle cx="165" cy="160" r="104" fill="none" stroke="#f472b6" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.5" />

            <!-- Nodal d-wave Axes rotated by twistAngle -->
            <line x1="55" y1="160" x2="275" y2="160" stroke="#334155" stroke-width="1" />
            <line x1="165" y1="50" x2="165" y2="270" stroke="#334155" stroke-width="1" />

            <!-- Semifluxon Core -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#facc15" stroke-width="2" />
            <text x="165" y="157" fill="#facc15" font-size="9" font-weight="bold" text-anchor="middle">Φ₀ / 2</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">C = ±4</text>

            <!-- 16 d_{x^2-y^2} + i d_{xy} Pairing Lobe Nodes -->
            <g v-for="node in state.lobeNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.layerIndex === 1 ? '#38bdf8' : '#f472b6'"
                stroke-width="1"
                opacity="0.32"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.layerIndex === 1 ? 5.5 : 6.5"
                :fill="node.dWaveSign > 0 ? '#38bdf8' : '#f43f5e'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#7dd3fc" font-size="10" font-weight="bold">
              Bi-2212 Twisted CuO₂ Bilayer (θ = {{ state.twistAngleDeg.toFixed(2) }}°)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | Δ_topo = {{ state.chiralTopologicalGapMev.toFixed(2) }} meV
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">高溫超導莫爾約瑟夫森相區 (Twisted Cuprate Regimes)</label>
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
                <span>層間扭轉角 θ (30.0° ~ 45.0° 魔角)</span>
                <strong class="accent-cyan">{{ state.twistAngleDeg.toFixed(2) }}°</strong>
              </div>
              <input
                type="range"
                min="30.0"
                max="45.0"
                step="0.05"
                :value="state.twistAngleDeg"
                @input="onTwistChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>二階雙庫柏對協同穿隧 J₂ (0.2 ~ 6.0 meV)</span>
                <strong class="accent-amber">{{ state.interlayerCouplingJ2Mev.toFixed(2) }} meV</strong>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.1"
                :value="state.interlayerCouplingJ2Mev"
                @input="onJ2Change"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發電荷-4e 半磁通夏皮羅諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置 45° 魔角拓撲相
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
  twistedCuprateHighTcJosephsonEngine,
  type TwistedCuprateRegime
} from '../engine/twistedCuprateHighTcJosephson';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(twistedCuprateHighTcJosephsonEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: TwistedCuprateRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'untwisted-nodal-d-wave-junction',
    label: '無扭轉無能隙 d_{x²-y²} 結',
    desc: '一階 J₁ cos(φ) 主導，保護四個狄拉克節點',
    icon: '🍀'
  },
  {
    value: 'near-45-degree-second-harmonic-crossover',
    label: '近 45° 二階諧波交叉相',
    desc: 'cos(2θ) → 0 抑制單對穿隧，雙庫柏對 4e 湧現',
    icon: '⚡'
  },
  {
    value: 'chiral-d-plus-id-topological-phase',
    label: '手性 d+id 拓撲高溫超導相',
    desc: '自發破缺 TRS (φ₀ ≈ ±π/2)，開啟 C=±4 拓撲能隙',
    icon: '❄️'
  },
  {
    value: 'semifluxon-fractional-shapiro-diode',
    label: '半磁通渦旋與約瑟夫森二極體',
    desc: '自發 Φ₀/2 分數渦旋與非互易超電流二極體整流',
    icon: '🌀'
  }
];

function syncFromEngine(): void {
  Object.assign(state, twistedCuprateHighTcJosephsonEngine.getState());
}

function selectRegime(regime: TwistedCuprateRegime): void {
  twistedCuprateHighTcJosephsonEngine.setRegime(regime);
  twistedCuprateHighTcJosephsonEngine.triggerTwistedCuprateSound();
  achievements.unlock('twisted_cuprate_high_tc_josephson');
  syncFromEngine();
}

function onTwistChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  twistedCuprateHighTcJosephsonEngine.setTwistAngleDeg(val);
  achievements.unlock('twisted_cuprate_high_tc_josephson');
  syncFromEngine();
}

function onJ2Change(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  twistedCuprateHighTcJosephsonEngine.setInterlayerCouplingJ2(val);
  achievements.unlock('twisted_cuprate_high_tc_josephson');
  syncFromEngine();
}

function triggerSound(): void {
  twistedCuprateHighTcJosephsonEngine.triggerTwistedCuprateSound();
  achievements.unlock('twisted_cuprate_high_tc_josephson');
}

function resetEngine(): void {
  twistedCuprateHighTcJosephsonEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setTwistedCuprateJosephsonModal(false);
}

onMounted(() => {
  achievements.unlock('twisted_cuprate_high_tc_josephson');
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
  background: linear-gradient(145deg, #090e1e 0%, #101830 100%);
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
.cuprate-svg {
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
  background: linear-gradient(90deg, #0284c7, #6366f1);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
