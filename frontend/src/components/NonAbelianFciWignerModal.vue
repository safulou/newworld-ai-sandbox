<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 63 // NON-ABELIAN PF-FCI &amp; ANOMALOUS HALL WIGNER CRYSTAL</span>
          <h2>💎 非阿貝爾分數陳絕緣體與時間反演奇宇稱任意子維格納晶體</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="fci-wigner-svg">
            <defs>
              <radialGradient id="fciWignerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(52, 211, 153, 0.35)" />
                <stop offset="65%" stop-color="rgba(168, 85, 247, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <rect x="20" y="34" width="290" height="252" rx="14" fill="url(#fciWignerGlow)" stroke="rgba(52, 211, 153, 0.45)" stroke-width="1.8" />

            <!-- Chiral Majorana + Bose edge mode boundary -->
            <rect
              x="32"
              y="46"
              width="266"
              height="228"
              rx="10"
              fill="none"
              stroke="rgba(250, 204, 21, 0.6)"
              stroke-width="1.6"
              stroke-dasharray="5 3"
            />

            <!-- Triangular moiré Wigner crystal & non-Abelian e/4 Pfaffian anyon nodes -->
            <g v-for="node in state.crystalNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.siteExcitationType === 'anomalous-hall-wigner-site' ? 7.5 : 6"
                :fill="siteColor(node.siteExcitationType)"
                stroke="#0f172a"
                stroke-width="1.4"
              />
              <text
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ siteLabel(node.siteExcitationType) }}
              </text>
            </g>

            <text x="14" y="22" fill="#6ee7b7" font-size="10" font-family="monospace">
              ν=3/2 MoTe₂ 2nd Miniband | GSD={{ state.torusGroundStateDegeneracy }} | κ_xy={{ state.halfIntegerThermalHallK0.toFixed(2) }} κ_0
            </text>
            <text x="14" y="308" fill="#c084fc" font-size="10" font-family="monospace">
              Δ_Pf={{ state.pfaffianNonAbelianGapMeV.toFixed(2) }} meV | S(G_Bragg)={{ (state.wignerCrystalBraggOrder * 100).toFixed(1) }}% | r_s={{ state.coulombToBandwidthRatioRs.toFixed(1) }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">環面拓撲基態簡併度 GSD</span>
              <span class="m-val emerald">GSD = {{ state.torusGroundStateDegeneracy }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">半整數手性熱霍爾電導 κ_xy</span>
              <span class="m-val gold">{{ state.halfIntegerThermalHallK0.toFixed(2) }} κ₀</span>
            </div>
            <div class="metric-box">
              <span class="m-label">非阿貝爾 Pfaffian 能隙 Δ_Pf</span>
              <span class="m-val cyan">{{ state.pfaffianNonAbelianGapMeV.toFixed(2) }} meV</span>
            </div>
            <div class="metric-box">
              <span class="m-label">維格納晶體布拉格序 S(G)</span>
              <span class="m-val purple">{{ (state.wignerCrystalBraggOrder * 100).toFixed(1) }} %</span>
            </div>
          </div>

          <div class="regime-group">
            <label>高階莫爾平帶非阿貝爾分數陳態與反常霍爾晶體相區</label>
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
              <span>長程庫侖排斥與莫爾平帶寬度比 r_s = U / W</span>
              <span class="slider-val">{{ state.coulombToBandwidthRatioRs.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="14.0"
              step="0.2"
              :value="state.coulombToBandwidthRatioRs"
              @input="onRsChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>量子度規跡偏離理想 n=1 朗道能階指標 δTr(g)</span>
              <span class="slider-val">{{ state.quantumMetricTraceExcess.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="1.20"
              step="0.02"
              :value="state.quantumMetricTraceExcess"
              @input="onTraceChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 Moore-Read 半整數熱霍爾與反常維格納晶體共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置莫爾非阿貝爾陳晶
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
  nonAbelianFciAnomalousWignerCrystalEngine,
  type NonAbelianFciWignerRegime
} from '../engine/nonAbelianFciAnomalousWignerCrystal';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(nonAbelianFciAnomalousWignerCrystalEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: NonAbelianFciWignerRegime; label: string }[] = [
  { id: 'second-miniband-moore-read-pfaffian-fci', label: '第二微帶 Moore-Read 非阿貝爾態' },
  { id: 'anyon-wigner-supersolid-coexistence', label: 'e/4 任意子維格納超固共存相' },
  { id: 'reentrant-anomalous-hall-wigner-crystal', label: '重入反常霍爾維格納晶體 (C=1)' },
  { id: 'composite-fermion-metallic-fermi-sea', label: '零場複合費米子金屬費米海' }
];

function siteColor(t: string): string {
  if (t === 'anomalous-hall-wigner-site') return '#c084fc';
  if (t === 'neutral-majorana-fermion') return '#facc15';
  return '#34d399';
}

function siteLabel(t: string): string {
  if (t === 'anomalous-hall-wigner-site') return 'AHWC';
  if (t === 'neutral-majorana-fermion') return 'ψ_Maj';
  return 'e/4';
}

function syncState(): void {
  Object.assign(state, nonAbelianFciAnomalousWignerCrystalEngine.getState());
}

function selectRegime(regime: NonAbelianFciWignerRegime): void {
  nonAbelianFciAnomalousWignerCrystalEngine.setRegime(regime);
  nonAbelianFciAnomalousWignerCrystalEngine.triggerNonAbelianFciWignerSound();
  achievements.unlock('non_abelian_fci_anomalous_wigner_crystal');
  syncState();
}

function onRsChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianFciAnomalousWignerCrystalEngine.setCoulombToBandwidthRatio(val);
  syncState();
}

function onTraceChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  nonAbelianFciAnomalousWignerCrystalEngine.setQuantumMetricTraceExcess(val);
  syncState();
}

function triggerSound(): void {
  nonAbelianFciAnomalousWignerCrystalEngine.triggerNonAbelianFciWignerSound();
  achievements.unlock('non_abelian_fci_anomalous_wigner_crystal');
}

function resetEngine(): void {
  nonAbelianFciAnomalousWignerCrystalEngine.reset();
  syncState();
}

function close(): void {
  ui.setNonAbelianFciWignerOpen(false);
}

onMounted(() => {
  achievements.unlock('non_abelian_fci_anomalous_wigner_crystal');
  timer = setInterval(() => {
    nonAbelianFciAnomalousWignerCrystalEngine.update(0.08);
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
  border: 1px solid rgba(52, 211, 153, 0.45);
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
  border-bottom: 1px solid rgba(52, 211, 153, 0.25);
  background: rgba(15, 23, 42, 0.7);
}
.badge {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #34d399;
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
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fci-wigner-svg {
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
.m-val.emerald { color: #34d399; }
.m-val.gold { color: #facc15; }
.m-val.cyan { color: #38bdf8; }
.m-val.purple { color: #c084fc; }
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
  background: rgba(52, 211, 153, 0.2);
  border-color: #34d399;
  color: #6ee7b7;
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
  color: #34d399;
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
  background: linear-gradient(90deg, #059669, #7c3aed);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
