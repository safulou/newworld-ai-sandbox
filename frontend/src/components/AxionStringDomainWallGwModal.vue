<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 62 // COSMIC AXION STRING-DOMAIN WALL NETWORK &amp; NANO-HZ PTA GW</span>
          <h2>🌊 宇宙軸子弦-疇壁網路湮滅與納赫茲隨機引力波背景譜儀</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="axion-gw-svg">
            <defs>
              <radialGradient id="axionWallGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(250, 204, 21, 0.35)" />
                <stop offset="65%" stop-color="rgba(56, 189, 248, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#axionWallGlow)" />

            <!-- Cosmic axion string scaling ring & N_DW domain-wall tension ribbons -->
            <circle
              cx="165"
              cy="160"
              r="46"
              fill="none"
              stroke="rgba(250, 204, 21, 0.7)"
              stroke-width="2"
            />
            <circle
              cx="165"
              cy="160"
              r="74"
              fill="none"
              stroke="rgba(244, 63, 94, 0.55)"
              stroke-width="1.8"
              stroke-dasharray="6 4"
            />
            <circle
              cx="165"
              cy="160"
              r="98"
              fill="none"
              stroke="rgba(56, 189, 248, 0.45)"
              stroke-width="1.5"
              stroke-dasharray="3 3"
            />

            <!-- Domain wall tension spokes -->
            <line
              v-for="node in state.networkNodes"
              :key="'wall-' + node.id"
              x1="165"
              y1="160"
              :x2="node.x"
              :y2="node.y"
              stroke="rgba(250, 204, 21, 0.25)"
              stroke-width="1.2"
            />

            <!-- String loops, domain wall ribbons & Hellings-Downs pulsar nodes -->
            <g v-for="node in state.networkNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.defectStructure === 'hellings-downs-pulsar' ? 7 : 5.5"
                :fill="defectColor(node.defectStructure)"
                stroke="#0f172a"
                stroke-width="1.3"
              />
              <text
                v-if="node.id % 2 === 0"
                :x="node.x"
                :y="node.y - 9"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ defectLabel(node.defectStructure) }}
              </text>
            </g>

            <text x="14" y="22" fill="#fde047" font-size="10" font-family="monospace">
              U(1)_PQ String-Wall Network | N_DW = {{ state.domainWallNumberNdw }} | ξ = {{ state.stringScalingParameterXi.toFixed(1) }}
            </text>
            <text x="14" y="308" fill="#7dd3fc" font-size="10" font-family="monospace">
              log10(Ω_GW h²)={{ state.peakGwDensityLogOmegaH2.toFixed(2) }} | log10(f/Hz)={{ state.peakFrequencyLogHz.toFixed(2) }} | HD SNR={{ state.hellingsDownsQuadrupoleSnr.toFixed(1) }}
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">峰值引力波能量密度 log₁₀(Ω_GW h²)</span>
              <span class="m-val gold">{{ state.peakGwDensityLogOmegaH2.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">湮滅引力波峰值頻率 log₁₀(f/Hz)</span>
              <span class="m-val cyan">{{ state.peakFrequencyLogHz.toFixed(2) }} Hz</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Hellings-Downs 脈衝星四極 SNR</span>
              <span class="m-val emerald">{{ state.hellingsDownsQuadrupoleSnr.toFixed(1) }} σ</span>
            </div>
            <div class="metric-box">
              <span class="m-label">軸子色反常疇壁數 N_DW</span>
              <span class="m-val rose">N_DW = {{ state.domainWallNumberNdw }}</span>
            </div>
          </div>

          <div class="regime-group">
            <label>宇宙軸子弦-疇壁網路演化與引力波頻段區間</label>
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
              <span>佩切伊-奎因破缺能標 log₁₀(f_a / GeV)</span>
              <span class="slider-val">10^{{ state.pecceiQuinnScaleLogGeV.toFixed(2) }} GeV</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="15.5"
              step="0.1"
              :value="state.pecceiQuinnScaleLogGeV"
              @input="onScaleChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>QCD 瞬子位勢軸子疇壁拓撲數 N_DW</span>
              <span class="slider-val">N_DW = {{ state.domainWallNumberNdw }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              :value="state.domainWallNumberNdw"
              @input="onNdwChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發軸子弦-疇壁網路坍縮與脈衝星四極引力波和弦
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置宇宙軸子弦譜儀
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
  axionStringDomainWallGwBackgroundEngine,
  type AxionStringWallRegime
} from '../engine/axionStringDomainWallGwBackground';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(axionStringDomainWallGwBackgroundEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: AxionStringWallRegime; label: string }[] = [
  { id: 'post-inflation-scaling-axion-string-loops', label: '暴脹後軸子弦標度迴圈' },
  { id: 'ndw-one-string-wall-ribbon-collapse', label: 'N_DW=1 弦-疇壁張力坍縮' },
  { id: 'biased-ndw-greater-one-nanohertz-pta-peak', label: 'N_DW>1 偏置納赫茲 PTA 峰' },
  { id: 'hellings-downs-pulsar-quadrupole-lock', label: 'Hellings-Downs 脈衝星四極鎖相' }
];

function defectColor(t: string): string {
  if (t === 'hellings-downs-pulsar') return '#38bdf8';
  if (t === 'domain-wall-ribbon') return '#fb7185';
  return '#facc15';
}

function defectLabel(t: string): string {
  if (t === 'hellings-downs-pulsar') return 'PTA-MSP';
  if (t === 'domain-wall-ribbon') return 'DW-Wall';
  return 'PQ-Loop';
}

function syncState(): void {
  Object.assign(state, axionStringDomainWallGwBackgroundEngine.getState());
}

function selectRegime(regime: AxionStringWallRegime): void {
  axionStringDomainWallGwBackgroundEngine.setRegime(regime);
  axionStringDomainWallGwBackgroundEngine.triggerAxionStringGwSound();
  achievements.unlock('axion_string_domain_wall_nanohertz_gw');
  syncState();
}

function onScaleChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  axionStringDomainWallGwBackgroundEngine.setPecceiQuinnScaleLog(val);
  syncState();
}

function onNdwChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  axionStringDomainWallGwBackgroundEngine.setDomainWallNumber(val);
  syncState();
}

function triggerSound(): void {
  axionStringDomainWallGwBackgroundEngine.triggerAxionStringGwSound();
  achievements.unlock('axion_string_domain_wall_nanohertz_gw');
}

function resetEngine(): void {
  axionStringDomainWallGwBackgroundEngine.reset();
  syncState();
}

function close(): void {
  ui.setAxionStringDomainWallGwOpen(false);
}

onMounted(() => {
  achievements.unlock('axion_string_domain_wall_nanohertz_gw');
  timer = setInterval(() => {
    axionStringDomainWallGwBackgroundEngine.update(0.08);
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
.axion-gw-svg {
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
  background: linear-gradient(90deg, #ca8a04, #0284c7);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
