<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="title-group">
          <span class="badge">PART 63 // PENROSE TWISTOR SPACE CP³ &amp; HODGES MHV GRAVITON</span>
          <h2>🌀 彭羅斯扭量理論與全息自對偶引力子散射振幅儀</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="viz-panel">
          <svg viewBox="0 0 330 320" class="twistor-svg">
            <defs>
              <radialGradient id="twistorSpaceGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(168, 85, 247, 0.36)" />
                <stop offset="65%" stop-color="rgba(56, 189, 248, 0.16)" />
                <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
              </radialGradient>
            </defs>

            <circle cx="165" cy="160" r="136" fill="url(#twistorSpaceGlow)" />

            <!-- Projective twistor space CP¹_x holomorphic curves & deformed fibration -->
            <ellipse
              cx="165"
              cy="160"
              :rx="54 + state.holomorphicDeformationNormH1 * 12"
              :ry="54 - state.holomorphicDeformationNormH1 * 8"
              fill="rgba(168, 85, 247, 0.08)"
              stroke="rgba(192, 132, 252, 0.65)"
              stroke-width="2"
            />
            <circle
              cx="165"
              cy="160"
              r="88"
              fill="none"
              stroke="rgba(56, 189, 248, 0.45)"
              stroke-width="1.6"
              stroke-dasharray="5 3"
            />

            <!-- Incidence null ray lines ω^A = i x^{AA'} π_{A'} -->
            <line
              v-for="node in state.twistorNodes"
              :key="'ray-' + node.id"
              x1="165"
              y1="160"
              :x2="node.x"
              :y2="node.y"
              stroke="rgba(192, 132, 252, 0.25)"
              stroke-width="1.2"
            />

            <!-- Graviton helicity punctures & CP¹ holomorphic line nodes -->
            <g v-for="node in state.twistorNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="node.helicityState === '-2-anti-self-dual' ? 8 : 5.5"
                :fill="nodeColor(node.helicityState)"
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
                {{ nodeLabel(node.helicityState) }}
              </text>
            </g>

            <text x="14" y="22" fill="#c084fc" font-size="10" font-family="monospace">
              ω^A = i x^{AA'} π_{A'} | h ∈ H¹(PT, O(2)) | w_{1+∞} Symmetry
            </text>
            <text x="14" y="308" fill="#7dd3fc" font-size="10" font-family="monospace">
              |Ψ_ABCD|={{ state.selfDualWeylCurvatureScalar.toFixed(2) }} | log10|M_n|={{ state.hodgesMhvAmplitudeLogMod.toFixed(2) }} | w_{1+∞}={{ (state.wInfinityWardIdentityFidelity * 100).toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">自對偶外爾曲率 |Ψ_ABCD|</span>
              <span class="m-val purple">{{ state.selfDualWeylCurvatureScalar.toFixed(2) }} M_Pl²</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Hodges MHV 振幅 log₁₀|M_n|</span>
              <span class="m-val cyan">{{ state.hodgesMhvAmplitudeLogMod.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">w_{1+∞} 軟引力子代數保真度</span>
              <span class="m-val emerald">{{ (state.wInfinityWardIdentityFidelity * 100).toFixed(1) }} %</span>
            </div>
            <div class="metric-box">
              <span class="m-label">天球全純 OPE 共形權重</span>
              <span class="m-val gold">Δ = {{ state.celestialTwistorOPEIndex.toFixed(2) }}</span>
            </div>
          </div>

          <div class="regime-group">
            <label>射影扭量空間與全息引力子散射工作體制</label>
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
              <span>全純複結構形變上同調範數 ||h||_{H¹(PT, O(2))}</span>
              <span class="slider-val">{{ state.holomorphicDeformationNormH1.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.80"
              step="0.05"
              :value="state.holomorphicDeformationNormH1"
              @input="onDeformChange"
            />
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>散射外部自對偶引力子多重數 n</span>
              <span class="slider-val">n = {{ state.externalGravitonMultiplicityN }} gravitons</span>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              step="1"
              :value="state.externalGravitonMultiplicityN"
              @input="onMultiplicityChange"
            />
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發彭羅斯非線性引力子與 w_{1+∞} 扭量共鳴
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置射影扭量振幅儀
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
  penroseTwistorSelfDualGravitonEngine,
  type PenroseTwistorRegime
} from '../engine/penroseTwistorSelfDualGraviton';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const ui = useUIStore();
const state = reactive(penroseTwistorSelfDualGravitonEngine.getState());
let timer: ReturnType<typeof setInterval> | null = null;

const regimes: { id: PenroseTwistorRegime; label: string }[] = [
  { id: 'null-ray-incidence-cp1-riemann-sphere', label: '零測地線 CP¹ 黎曼球關聯' },
  { id: 'nonlinear-graviton-self-dual-weyl-deformation', label: '非線性引力子自對偶複形變' },
  { id: 'hodges-mhv-graviton-determinant-scattering', label: 'Hodges 行列式 MHV 振幅' },
  { id: 'w-infinity-soft-graviton-symmetry-tower', label: 'w_{1+∞} 軟引力子流代數塔' }
];

function nodeColor(h: string): string {
  if (h === '-2-anti-self-dual') return '#fb7185';
  if (h === 'cp1-holomorphic-line') return '#c084fc';
  return '#38bdf8';
}

function nodeLabel(h: string): string {
  if (h === '-2-anti-self-dual') return 'h=-2';
  if (h === 'cp1-holomorphic-line') return 'CP¹_x';
  return 'h=+2';
}

function syncState(): void {
  Object.assign(state, penroseTwistorSelfDualGravitonEngine.getState());
}

function selectRegime(regime: PenroseTwistorRegime): void {
  penroseTwistorSelfDualGravitonEngine.setRegime(regime);
  penroseTwistorSelfDualGravitonEngine.triggerPenroseTwistorSound();
  achievements.unlock('penrose_twistor_self_dual_graviton_amplitude');
  syncState();
}

function onDeformChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  penroseTwistorSelfDualGravitonEngine.setHolomorphicDeformationNorm(val);
  syncState();
}

function onMultiplicityChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  penroseTwistorSelfDualGravitonEngine.setExternalGravitonMultiplicity(val);
  syncState();
}

function triggerSound(): void {
  penroseTwistorSelfDualGravitonEngine.triggerPenroseTwistorSound();
  achievements.unlock('penrose_twistor_self_dual_graviton_amplitude');
}

function resetEngine(): void {
  penroseTwistorSelfDualGravitonEngine.reset();
  syncState();
}

function close(): void {
  ui.setPenroseTwistorGravitonOpen(false);
}

onMounted(() => {
  achievements.unlock('penrose_twistor_self_dual_graviton_amplitude');
  timer = setInterval(() => {
    penroseTwistorSelfDualGravitonEngine.update(0.08);
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
  border: 1px solid rgba(192, 132, 252, 0.45);
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
  border-bottom: 1px solid rgba(192, 132, 252, 0.25);
  background: rgba(15, 23, 42, 0.7);
}
.badge {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #c084fc;
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
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.twistor-svg {
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
.m-val.purple { color: #c084fc; }
.m-val.cyan { color: #38bdf8; }
.m-val.emerald { color: #34d399; }
.m-val.gold { color: #facc15; }
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
  background: rgba(192, 132, 252, 0.2);
  border-color: #c084fc;
  color: #e9d5ff;
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
  color: #c084fc;
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
  background: linear-gradient(90deg, #9333ea, #0284c7);
  border: none;
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
