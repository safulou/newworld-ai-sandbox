<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card quasicrystal-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 57 · SUPERSPACE PHASON-PUMP QUASICRYSTAL PHONON DIODE</span>
          <h2>🔊 非阿貝爾拓撲聲子準晶與高維超空間相子泵浦二極體</h2>
          <p class="subtitle">Penrose / Ammann-Beenker Cut-and-Project Superspace C₂, Phason Flip Pumping &amp; Acoustic Diode Isolator</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">高維超空間第二陳數 (|C₂|)</span>
          <span class="kpi-value highlight-violet">C₂ = {{ state.superspaceSecondChernC2 }}</span>
          <span class="kpi-sub">4D/6D 超空間拓撲不變量</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">聲學二極體正反隔離度 (ISO)</span>
          <span class="kpi-value highlight-amber">{{ state.acousticDiodeIsolationDb.toFixed(1) }} dB</span>
          <span class="kpi-sub">非互易相子規範場整流</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">霍夫施塔特碎形能隙 (Δf_gap)</span>
          <span class="kpi-value highlight-cyan">{{ state.fractalBandgapWidthKhz.toFixed(1) }} kHz</span>
          <span class="kpi-sub">黃金比例逼近階數 N={{ state.goldenRatioApproximantOrder }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">手性相子邊界群速 (v_edge)</span>
          <span class="kpi-value highlight-emerald">{{ state.phasonBoundaryVelocityMs.toFixed(1) }} m/s</span>
          <span class="kpi-sub">無布洛赫平移對稱拓撲保護</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="quasicrystal-svg">
            <defs>
              <radialGradient id="penroseCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#8b5cf6" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="118" fill="url(#penroseCoreGrad)" />

            <!-- Golden-Ratio Decagonal Rings -->
            <circle cx="165" cy="160" r="46" fill="none" stroke="#f472b6" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
            <circle cx="165" cy="160" r="74.4" fill="none" stroke="#c084fc" stroke-width="1" stroke-dasharray="4 3" opacity="0.5" />
            <circle cx="165" cy="160" r="98.2" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.5" />

            <!-- Central Superspace Projection Window -->
            <polygon
              points="165,136 188,152 179,179 151,179 142,152"
              fill="#1e1b4b"
              stroke="#f472b6"
              stroke-width="2"
            />
            <text x="165" y="162" fill="#f9a8d4" font-size="9" font-weight="bold" text-anchor="middle">τ=1.618</text>

            <!-- 15 Penrose / Ammann-Beenker Superspace Tile Nodes -->
            <g v-for="node in state.tileNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#e879f9"
                stroke-width="1"
                opacity="0.32"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.5 + node.phasonFlipAmplitude * 3"
                :fill="node.id < 5 ? '#f472b6' : node.id < 10 ? '#c084fc' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#f9a8d4" font-size="10" font-weight="bold">
              Penrose Superspace Projection (φ_⊥ = {{ state.phasonPumpPhasePi.toFixed(2) }}π)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | ISO = {{ state.acousticDiodeIsolationDb.toFixed(1) }} dB
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">高維超空間聲子準晶相區 (Superspace Quasicrystal Regimes)</label>
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
                <span>正交超空間相子泵浦相位 φ_⊥ / π (0.00 ~ 2.00)</span>
                <strong class="accent-pink">{{ state.phasonPumpPhasePi.toFixed(2) }} π</strong>
              </div>
              <input
                type="range"
                min="0.00"
                max="2.00"
                step="0.02"
                :value="state.phasonPumpPhasePi"
                @input="onPhaseChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>超空間第二陳數 |C₂| (1 ~ 6)</span>
                <strong class="accent-violet">C₂ = {{ state.superspaceSecondChernC2 }}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                :value="state.superspaceSecondChernC2"
                @input="onChernChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>費波那契黃金分割逼近階數 N (3 ~ 12)</span>
                <strong class="accent-cyan">F_{{ state.goldenRatioApproximantOrder }}</strong>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                :value="state.goldenRatioApproximantOrder"
                @input="onOrderChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發黃金比例 τ=1.618 相子泵浦雙音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置彭羅斯五重超空間態
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
  quasicrystalTopologicalPhononDiodeEngine,
  type QuasicrystalPhononRegime
} from '../engine/quasicrystalTopologicalPhononDiode';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(quasicrystalTopologicalPhononDiodeEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: QuasicrystalPhononRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'Fibonacci-1d-phason-pump-chain',
    label: '費波那契 1D 相子拓撲泵浦鏈',
    desc: '2D 超空間投影，絕熱相子滑移驅動邊界聲子躍遷',
    icon: '📏'
  },
  {
    value: 'penrose-5fold-superspace-c2-insulator',
    label: '彭羅斯五重對稱 C₂ 拓撲準晶',
    desc: '5D 超空間 Cut-and-Project 投影與碎形能隙保護',
    icon: '⭐'
  },
  {
    value: 'ammann-beenker-8fold-chiral-edge',
    label: 'Ammann-Beenker 八重手性邊界',
    desc: '4D 超立方體無理數截面與無散射手性相子波導',
    icon: 'octagon'
  },
  {
    value: 'non-abelian-acoustic-diode-isolator',
    label: '非阿貝爾拓撲聲學二極體隔離器',
    desc: '超高正反向聲隔離度 ISO > 45 dB 與單向聲整流',
    icon: '🔊'
  }
];

function syncFromEngine(): void {
  Object.assign(state, quasicrystalTopologicalPhononDiodeEngine.getState());
}

function selectRegime(regime: QuasicrystalPhononRegime): void {
  quasicrystalTopologicalPhononDiodeEngine.setRegime(regime);
  quasicrystalTopologicalPhononDiodeEngine.triggerQuasicrystalPhononSound();
  achievements.unlock('quasicrystal_topological_phonon_diode');
  syncFromEngine();
}

function onPhaseChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  quasicrystalTopologicalPhononDiodeEngine.setPhasonPumpPhase(val);
  achievements.unlock('quasicrystal_topological_phonon_diode');
  syncFromEngine();
}

function onChernChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  quasicrystalTopologicalPhononDiodeEngine.setSuperspaceSecondChern(val);
  achievements.unlock('quasicrystal_topological_phonon_diode');
  syncFromEngine();
}

function onOrderChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  quasicrystalTopologicalPhononDiodeEngine.setApproximantOrder(val);
  achievements.unlock('quasicrystal_topological_phonon_diode');
  syncFromEngine();
}

function triggerSound(): void {
  quasicrystalTopologicalPhononDiodeEngine.triggerQuasicrystalPhononSound();
  achievements.unlock('quasicrystal_topological_phonon_diode');
}

function resetEngine(): void {
  quasicrystalTopologicalPhononDiodeEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setQuasicrystalPhononDiodeModal(false);
}

onMounted(() => {
  achievements.unlock('quasicrystal_topological_phonon_diode');
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
  background: linear-gradient(145deg, #12091d 0%, #1e1132 100%);
  border: 1px solid rgba(236, 72, 153, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(236, 72, 153, 0.2);
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
  color: #f472b6;
  background: rgba(236, 72, 153, 0.14);
  border: 1px solid rgba(236, 72, 153, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fce7f3;
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
.quasicrystal-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(236, 72, 153, 0.3);
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
  border-color: #f472b6;
  background: rgba(236, 72, 153, 0.16);
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
.accent-pink { color: #f472b6; }
.accent-violet { color: #c084fc; }
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
  background: linear-gradient(90deg, #db2777, #7c3aed);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
