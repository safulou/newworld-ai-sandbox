<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 63 // ULTRA-LONG-RANGE RYDBERG TRILOBITE &amp; BOSE POLARON</span>
          <h2>🦋 超冷里德堡分子宏觀三葉蟲雙極子與玻色極化子束縛晶格</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="trilobite-svg">
            <defs>
              <radialGradient id="trilobiteGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(250, 204, 21, 0.36)" />
                <stop offset="65%" stop-color="rgba(244, 63, 94, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#trilobiteGlow)" />

            <!-- Ionic core Rb+ and distant ground-state perturber atom -->
            <circle cx="115" cy="160" r="8" fill="#fb7185" stroke="#fff" stroke-width="1.5" />
            <circle cx="215" cy="160" r="7" fill="#38bdf8" stroke="#fff" stroke-width="1.5" />
            <line x1="115" y1="160" x2="215" y2="160" stroke="rgba(250, 204, 21, 0.65)" stroke-width="2" stroke-dasharray="4 3" />

            <!-- Trilobite high-l interference lobes / Butterfly p-wave wings -->
            <g v-for="node in state.lobeNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.5 + node.electronDensityProbability * 5"
                :fill="lobeColor(node.orbitalCharacter)"
                stroke="#0f172a"
                stroke-width="1.3"
              />
              <text
                v-if="node.id % 3 === 0"
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ lobeLabel(node.orbitalCharacter) }}
              </text>
            </g>

            <text x="14" y="22" fill="#fde047" font-size="10" font-family="monospace">
              V_Fermi = (2πℏ²/m_e) a_s δ(r-R) | n = {{ state.principalQuantumNumberN }}
            </text>
            <text x="14" y="308" fill="#fb7185" font-size="10" font-family="monospace">
              d={{ state.permanentDipoleMomentDebye.toFixed(0) }} Debye | R_eq={{ state.equilibriumBondLengthA0.toFixed(0) }} a₀ | N_bound={{ state.polaronBoundBosonCount }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">永久電偶極矩 d_trilobite</span>
              <span class="m-val gold">{{ state.permanentDipoleMomentDebye.toFixed(1) }} Debye</span>
            </div>
            <div class="metric-box">
              <span class="m-label">超長程平衡鍵長 R_eq</span>
              <span class="m-val cyan">{{ state.equilibriumBondLengthA0.toFixed(0) }} a₀</span>
            </div>
            <div class="metric-box">
              <span class="m-label">極化子束縛玻色子數 N_bound</span>
              <span class="m-val emerald">{{ state.polaronBoundBosonCount }} Bosons</span>
            </div>
            <div class="metric-box">
              <span class="m-label">拉姆齊極化子紅移 Δν</span>
              <span class="m-val rose">-{{ state.ramseyPolaronRedshiftMHz.toFixed(1) }} MHz</span>
            </div>
          </div>

          <div class="regime-group">
            <label>超長程里德堡分子波函數與多體玻色極化子相區</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimes"
                :key="opt.id"
                :class="['regime-btn', { active: state.activeRegime === opt.id }]"
                @click="selectRegime(opt.id)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>里德堡電子主量子數 n</span>
              <span class="slider-val">n = {{ state.principalQuantumNumberN }}</span>
            </div>
            <input
              type="range"
              min="35"
              max="95"
              step="1"
              :value="state.principalQuantumNumberN"
              @input="onNChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>超冷 BEC 背景原子密度對數 log₁₀(n_BEC / cm⁻³)</span>
              <span class="slider-val">10^{{ state.becBackgroundDensityLogCm3.toFixed(2) }} cm⁻³</span>
            </div>
            <input
              type="range"
              min="12.0"
              max="15.2"
              step="0.1"
              :value="state.becBackgroundDensityLogCm3"
              @input="onDensityChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發三葉蟲千德拜偶極與玻色極化子殼層諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置里德堡三葉蟲腔
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
  ultralongRangeRydbergTrilobitePolaronEngine,
  type RydbergTrilobiteRegime
} from '../engine/ultralongRangeRydbergTrilobitePolaron';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(ultralongRangeRydbergTrilobitePolaronEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: RydbergTrilobiteRegime; label: string }[] = [
  { id: 'high-l-trilobite-kilodebye-macrodimer', label: '高角動量三葉蟲千德拜分子' },
  { id: 'p-wave-shape-resonance-butterfly-state', label: 'p-波形狀共振蝴蝶態分子' },
  { id: 'many-body-rydberg-bose-polaron-shell', label: '多體里德堡玻色極化子殼層' },
  { id: 'dipole-aligned-trilobite-chain-crystal', label: '千德拜偶極對齊三葉蟲晶鏈' }
];

function lobeColor(c: string): string {
  if (c === 'butterfly-pwave-wing') return '#fb7185';
  if (c === 'trapped-bec-boson') return '#34d399';
  return '#facc15';
}

function lobeLabel(c: string): string {
  if (c === 'butterfly-pwave-wing') return 'p-Wing';
  if (c === 'trapped-bec-boson') return 'BEC-Atom';
  return 'Trilobite';
}

function syncState(): void {
  Object.assign(state, ultralongRangeRydbergTrilobitePolaronEngine.getState());
}

function selectRegime(regime: RydbergTrilobiteRegime): void {
  ultralongRangeRydbergTrilobitePolaronEngine.setRegime(regime);
  ultralongRangeRydbergTrilobitePolaronEngine.triggerRydbergTrilobiteSound();
  achievements.unlock('ultralong_range_rydberg_trilobite_polaron');
  syncState();
}

function onNChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  ultralongRangeRydbergTrilobitePolaronEngine.setPrincipalQuantumNumber(val);
  syncState();
}

function onDensityChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  ultralongRangeRydbergTrilobitePolaronEngine.setBecBackgroundDensityLog(val);
  syncState();
}

function triggerSound(): void {
  ultralongRangeRydbergTrilobitePolaronEngine.triggerRydbergTrilobiteSound();
  achievements.unlock('ultralong_range_rydberg_trilobite_polaron');
}

function resetEngine(): void {
  ultralongRangeRydbergTrilobitePolaronEngine.reset();
  syncState();
}

function close(): void {
  ui.setRydbergTrilobitePolaronOpen(false);
}

onMounted(() => {
  achievements.unlock('ultralong_range_rydberg_trilobite_polaron');
  timer = setInterval(() => {
    ultralongRangeRydbergTrilobitePolaronEngine.update(0.08);
    syncState();
  }, 80);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(920px, 95vw);
  background: linear-gradient(145deg, #0f172a 0%, #090d16 100%);
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(250, 204, 21, 0.25);
  background: rgba(15, 23, 42, 0.7);
}
.badge {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #facc15;
  font-family: monospace;
}
.title-group h2 {
  margin: 4px 0 0;
  font-size: 18px;
  color: #f1f5f9;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  padding: 20px;
}
.viz-panel {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trilobite-svg {
  width: 100%;
  height: auto;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.metric-box {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.m-label {
  font-size: 11px;
  color: #94a3b8;
}
.m-val {
  font-size: 17px;
  font-weight: 700;
  margin-top: 4px;
  font-family: monospace;
}
.m-val.gold { color: #facc15; }
.m-val.cyan { color: #38bdf8; }
.m-val.emerald { color: #34d399; }
.m-val.rose { color: #fb7185; }
.regime-group label {
  font-size: 12px;
  color: #cbd5e1;
  display: block;
  margin-bottom: 6px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #cbd5e1;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.regime-btn.active {
  background: rgba(250, 204, 21, 0.2);
  border-color: #facc15;
  color: #fde047;
  font-weight: 600;
}
.slider-group {
  background: rgba(15, 23, 42, 0.6);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 6px;
}
.slider-val {
  color: #facc15;
  font-family: monospace;
}
.slider-group input[type='range'] {
  width: 100%;
}
.action-row {
  display: flex;
  gap: 10px;
  margin-top: auto;
}
.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn.primary {
  background: linear-gradient(90deg, #ca8a04, #e11d48);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
