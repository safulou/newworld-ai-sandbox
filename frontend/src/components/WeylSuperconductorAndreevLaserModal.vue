<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 62 // WEYL SUPERCONDUCTOR CHIRAL ANDREEV ARC &amp; BERRY DIPOLE LASER</span>
          <h2>⚡ 拓撲外爾超導體手性安德烈夫束縛態與貝里偶極微波雷射</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="weyl-sc-svg">
            <defs>
              <radialGradient id="weylScGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(52, 211, 153, 0.35)" />
                <stop offset="65%" stop-color="rgba(250, 204, 21, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#weylScGlow)" />

            <!-- Momentum-space dipole axis connecting +1 and -1 Bogoliubov-Weyl nodes -->
            <line
              :x1="state.andreevNodes[0]?.x || 85"
              y1="160"
              :x2="state.andreevNodes[state.andreevNodes.length - 1]?.x || 245"
              y2="160"
              stroke="rgba(250, 204, 21, 0.65)"
              stroke-width="2"
              stroke-dasharray="5 3"
            />

            <!-- Chiral Majorana-Andreev surface Fermi arcs & Weyl monopole nodes -->
            <g v-for="node in state.andreevNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.nodeChirality !== 0 ? 9.5 : 5.5"
                :fill="node.nodeChirality === 1 ? '#fb7185' : node.nodeChirality === -1 ? '#38bdf8' : '#34d399'"
                stroke="#0f172a"
                stroke-width="1.4"
              />
              <text
                v-if="node.nodeChirality !== 0 || node.id % 3 === 0"
                :x="node.x"
                :y="node.y - 11"
                text-anchor="middle"
                fill="#e2e8f0"
                font-size="8"
                font-family="monospace"
              >
                {{ node.nodeChirality === 1 ? 'C_BdG=+1' : node.nodeChirality === -1 ? 'C_BdG=-1' : 'ABS' }}
              </text>
            </g>

            <text x="14" y="22" fill="#6ee7b7" font-size="10" font-family="monospace">
              H_BdG(k): Δk_W={{ state.weylNodeSeparationInvNm.toFixed(2) }} nm⁻¹ | Chiral Majorana Arc
            </text>
            <text x="14" y="308" fill="#fde047" font-size="10" font-family="monospace">
              G_arc={{ state.chiralAndreevArcConductanceG0.toFixed(2) }} e²/h | Gain={{ state.stimulatedMicrowaveGainDb.toFixed(1) }} dB | η_2ω={{ state.nonlinearHallRectificationPct.toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">手性安德烈夫表面弧電導</span>
              <span class="m-val emerald">{{ state.chiralAndreevArcConductanceG0.toFixed(2) }} e²/h</span>
            </div>
            <div class="metric-box">
              <span class="m-label">受激微波雷射增益 G_laser</span>
              <span class="m-val gold">+{{ state.stimulatedMicrowaveGainDb.toFixed(1) }} dB</span>
            </div>
            <div class="metric-box">
              <span class="m-label">貝里偶極二倍頻整流 η_2ω</span>
              <span class="m-val cyan">{{ state.nonlinearHallRectificationPct.toFixed(1) }} %</span>
            </div>
            <div class="metric-box">
              <span class="m-label">外爾超導節點間距 Δk_W</span>
              <span class="m-val rose">{{ state.weylNodeSeparationInvNm.toFixed(2) }} nm⁻¹</span>
            </div>
          </div>

          <div class="regime-group">
            <label>拓撲外爾超導體與手性安德烈夫雷射工作區間</label>
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
              <span>Bogoliubov-Weyl 節點動量間距 Δk_W</span>
              <span class="slider-val">{{ state.weylNodeSeparationInvNm.toFixed(2) }} nm⁻¹</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="1.80"
              step="0.03"
              :value="state.weylNodeSeparationInvNm"
              @input="onSeparationChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>貝里曲率偶極矩強度 D_BCD</span>
              <span class="slider-val">{{ state.berryCurvatureDipoleNm.toFixed(2) }} nm</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="2.40"
              step="0.05"
              :value="state.berryCurvatureDipoleNm"
              @input="onDipoleChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>非平衡準粒子偏壓泵浦比 eV_bias / Δ_0</span>
              <span class="slider-val">{{ state.quasiparticlePumpBiasRatio.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="2.50"
              step="0.05"
              :value="state.quasiparticlePumpBiasRatio"
              @input="onBiasChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發手性安德烈夫表面弧與二倍頻雷射諧音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置外爾超導雷射腔
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
  weylSuperconductorChiralAndreevLaserEngine,
  type WeylSuperconductorLaserRegime
} from '../engine/weylSuperconductorChiralAndreevLaser';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(weylSuperconductorChiralAndreevLaserEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: WeylSuperconductorLaserRegime; label: string }[] = [
  { id: 'bogoliubov-weyl-node-dipole-splitting', label: 'Bogoliubov 外爾節點劈裂' },
  { id: 'surface-majorana-andreev-arc-transport', label: '表面馬約拉納-安德烈夫弧' },
  { id: 'berry-curvature-dipole-second-harmonic', label: '貝里偶極二倍頻約瑟夫森' },
  { id: 'stimulated-chiral-andreev-microwave-laser', label: '受激安德烈夫微波雷射' }
];

function syncState(): void {
  Object.assign(state, weylSuperconductorChiralAndreevLaserEngine.getState());
}

function selectRegime(regime: WeylSuperconductorLaserRegime): void {
  weylSuperconductorChiralAndreevLaserEngine.setRegime(regime);
  weylSuperconductorChiralAndreevLaserEngine.triggerWeylAndreevLaserSound();
  achievements.unlock('weyl_superconductor_chiral_andreev_laser');
  syncState();
}

function onSeparationChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylSuperconductorChiralAndreevLaserEngine.setWeylNodeSeparation(val);
  syncState();
}

function onDipoleChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylSuperconductorChiralAndreevLaserEngine.setBerryCurvatureDipole(val);
  syncState();
}

function onBiasChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylSuperconductorChiralAndreevLaserEngine.setQuasiparticlePumpBias(val);
  syncState();
}

function triggerSound(): void {
  weylSuperconductorChiralAndreevLaserEngine.triggerWeylAndreevLaserSound();
  achievements.unlock('weyl_superconductor_chiral_andreev_laser');
}

function resetEngine(): void {
  weylSuperconductorChiralAndreevLaserEngine.reset();
  syncState();
}

function close(): void {
  ui.setWeylSuperconductorAndreevOpen(false);
}

onMounted(() => {
  achievements.unlock('weyl_superconductor_chiral_andreev_laser');
  timer = setInterval(() => {
    weylSuperconductorChiralAndreevLaserEngine.update(0.08);
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
.weyl-sc-svg {
  width: 100%;
  height: auto;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  padding: 9px 12px;
  display: flex;
  flex-direction: column;
}
.m-label {
  font-size: 11px;
  color: #94a3b8;
}
.m-val {
  font-size: 16px;
  font-weight: 700;
  margin-top: 3px;
  font-family: monospace;
}
.m-val.emerald { color: #34d399; }
.m-val.gold { color: #facc15; }
.m-val.cyan { color: #38bdf8; }
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
  padding: 7px 10px;
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
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #e2e8f0;
  margin-bottom: 4px;
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
  background: linear-gradient(90deg, #059669, #0284c7);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
