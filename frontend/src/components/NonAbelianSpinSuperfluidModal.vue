<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌀</span>
          <div>
            <h2>非阿貝爾自旋超流與外爾扭折反應堆</h2>
            <p class="subtitle">Dissipationless Pure Spin Supercurrent, Spin Josephson Effect & Weyl Topological Kinks</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="spin-svg">
            <defs>
              <linearGradient id="spinBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="50%" stop-color="#0c1126" />
                <stop offset="100%" stop-color="#19092b" />
              </linearGradient>

              <radialGradient id="kinkSolitonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="weylAnomalyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>

              <filter id="glowSpin">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#spinBg)" rx="8" />

            <!-- Easy-Plane Magnetic Lattice Chain (Horizontal at y = 175) -->
            <line x1="50" y1="175" x2="510" y2="175" stroke="#334155" stroke-width="3" />

            <!-- Topological Kink Soliton Highlight Area -->
            <g v-if="state.regime === 'topological-spin-kink' || state.topologicalWindingNumber > 1">
              <ellipse
                cx="280"
                cy="175"
                :rx="state.solitonKinkWidthNm * 4"
                :ry="55"
                fill="url(#kinkSolitonGlow)"
                filter="url(#glowSpin)"
              />
              <text x="280" y="105" fill="#f472b6" font-size="11" text-anchor="middle" font-weight="bold">
                TOPOLOGICAL SPIN KINK (ξ_s = {{ state.solitonKinkWidthNm.toFixed(1) }} nm)
              </text>
            </g>

            <!-- Coupled Weyl Semimetal Chiral Anomaly Node Bubble -->
            <g transform="translate(450, 80)">
              <circle cx="0" cy="0" r="32" fill="url(#weylAnomalyGlow)" filter="url(#glowSpin)" />
              <circle cx="0" cy="0" r="8" fill="#38bdf8" />
              <text x="0" y="-15" fill="#38bdf8" font-size="10" text-anchor="middle" font-weight="bold">
                WEYL NODE (ρ₅)
              </text>
            </g>

            <!-- Precessing Spin Vectors along Easy-Plane -->
            <g v-for="s in 14" :key="'spin' + s">
              <!-- Site Base Circle -->
              <circle
                :cx="getSiteX(s)"
                cy="175"
                r="4.5"
                fill="#475569"
              />

              <!-- Precessing Vector Arrow S_i -->
              <line
                :x1="getSiteX(s)"
                y1="175"
                :x2="getSpinArrowX(s)"
                :y2="getSpinArrowY(s)"
                :stroke="getSpinColor(s)"
                stroke-width="3"
                filter="url(#glowSpin)"
              />
              <circle
                :cx="getSpinArrowX(s)"
                :cy="getSpinArrowY(s)"
                r="3.5"
                :fill="getSpinColor(s)"
              />
            </g>

            <!-- Spin Supercurrent Direction Banner -->
            <g transform="translate(50, 260)">
              <rect x="0" y="0" width="460" height="42" fill="#0b1329" stroke="#1e293b" rx="6" />
              <text x="16" y="26" fill="#94a3b8" font-size="11">無耗散純自旋超流:</text>
              <text x="140" y="26" fill="#38bdf8" font-size="12" font-weight="bold" font-family="monospace">
                J_s = -ρ_s ∇φ_s = {{ state.spinSupercurrentDensity.toFixed(2) }} meV
              </text>
              <line x1="330" y1="21" x2="430" y2="21" stroke="#38bdf8" stroke-width="2.5" />
              <polygon points="430,21 422,17 422,25" fill="#38bdf8" />
            </g>

            <!-- Diagnostics Telemetry HUD (Right Side) -->
            <g transform="translate(560, 25)">
              <rect x="0" y="0" width="225" height="165" fill="#0b1329" opacity="0.85" rx="6" stroke="#334155" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">自旋超流遙測</text>

              <text x="14" y="48" fill="#94a3b8" font-size="10">自旋化學勢 μ_s:</text>
              <text x="210" y="48" fill="#f8fafc" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.spinChemicalPotentialUeV.toFixed(1) }} μeV
              </text>

              <text x="14" y="70" fill="#94a3b8" font-size="10">超流剛度 ρ_s:</text>
              <text x="210" y="70" fill="#38bdf8" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.spinStiffnessRhoS.toFixed(1) }} meV/nm
              </text>

              <text x="14" y="92" fill="#94a3b8" font-size="10">相位梯度 ∇φ_s:</text>
              <text x="210" y="92" fill="#a78bfa" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.phaseGradientGradPhi.toFixed(3) }} rad/nm
              </text>

              <text x="14" y="114" fill="#94a3b8" font-size="10">約瑟夫森頻率 ω_s:</text>
              <text x="210" y="114" fill="#facc15" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.spinJosephsonFrequencyGhz.toFixed(1) }} GHz
              </text>

              <text x="14" y="136" fill="#94a3b8" font-size="10">扭折孤子寬度 ξ_s:</text>
              <text x="210" y="136" fill="#ec4899" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.solitonKinkWidthNm.toFixed(1) }} nm
              </text>

              <text x="14" y="156" fill="#94a3b8" font-size="10">自旋繞數 W_s:</text>
              <text x="210" y="156" fill="#34d399" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.topologicalWindingNumber }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: Spin Chemical Potential -->
          <div class="control-card">
            <div class="control-header">
              <label>自旋化學勢偏置 μ_s (μeV)</label>
              <span class="value-badge">{{ state.spinChemicalPotentialUeV.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="150.0"
              step="1.0"
              :value="state.spinChemicalPotentialUeV"
              @input="onMuChange"
              class="slider"
            />
            <p class="control-desc">驅動自旋約瑟夫森高頻進動 ω_s = 2μ_s / ℏ</p>
          </div>

          <!-- Slider 2: Spin Stiffness -->
          <div class="control-card">
            <div class="control-header">
              <label>自旋超流剛度 ρ_s (meV/nm)</label>
              <span class="value-badge">{{ state.spinStiffnessRhoS.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="40.0"
              step="1.0"
              :value="state.spinStiffnessRhoS"
              @input="onRhoChange"
              class="slider"
            />
            <p class="control-desc">決定易面量子磁體抗相位畸變與扭折寬度</p>
          </div>

          <!-- Slider 3: Phase Gradient -->
          <div class="control-card">
            <div class="control-header">
              <label>自旋相位梯度 ∇φ_s (rad/nm)</label>
              <span class="value-badge">{{ state.phaseGradientGradPhi.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.45"
              step="0.01"
              :value="state.phaseGradientGradPhi"
              @input="onGradChange"
              class="slider"
            />
            <p class="control-desc">線性驅動無耗散純自旋超流傳輸 J_s</p>
          </div>
        </div>

        <!-- Regime Selector & Actions -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'uniform-spin-ground' }]"
              @click="setRegime('uniform-spin-ground')"
            >
              寧靜均勻自旋基態
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'dissipationless-supercurrent' }]"
              @click="setRegime('dissipationless-supercurrent')"
            >
              無耗散自旋超流態
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'topological-spin-kink' }]"
              @click="setRegime('topological-spin-kink')"
            >
              拓撲自旋扭折孤子
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'spin-josephson-oscillation' }]"
              @click="setRegime('spin-josephson-oscillation')"
            >
              自旋約瑟夫森振盪
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerJosephson">
              💥 激發約瑟夫森震盪
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">無耗散純自旋超流密度 J_s</span>
            <span class="metric-value text-cyan">{{ state.spinSupercurrentDensity.toFixed(2) }} meV</span>
            <span class="metric-sub">J_s = -ρ_s ∇φ_s (零熱損耗)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">自旋約瑟夫森頻率 ω_s</span>
            <span class="metric-value text-amber">{{ state.spinJosephsonFrequencyGhz.toFixed(1) }} GHz</span>
            <span class="metric-sub">ω_s = 2 μ_s / ℏ</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">拓撲扭折孤子寬度 ξ_s</span>
            <span class="metric-value text-pink">{{ state.solitonKinkWidthNm.toFixed(1) }} nm</span>
            <span class="metric-sub">~ √(A_ex / K_easy)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">外爾手性電荷積累 ρ₅</span>
            <span class="metric-value text-purple">{{ state.chiralChargeAccumulation.toFixed(2) }} a.u.</span>
            <span class="metric-sub">Chiral Anomaly (E · B)</span>
          </div>
        </div>

        <!-- Theory Explainer Banner -->
        <div class="theory-box">
          <h4>🌀 物理理論背景：易面量子磁體無耗散自旋超流與外爾費米子拓撲扭折 (Spin Superfluidity & Weyl Kink)</h4>
          <p>
            在易面鐵磁體/反鐵磁體中，磁化強度的面內方位角 \(\phi_s\) 扮演超流相位的角色。當施加非零自旋化學勢偏置時，
            自旋進動相位梯度驅動「無耗散純自旋超流」（Dissipationless Spin Supercurrent）。在強相位扭曲下，系統湧現帶有拓撲保護的自旋扭折（Spin Kink / Domain Wall Soliton）。
            當其耦合至外爾半金屬時，拓撲扭折透過手性反常（Chiral Anomaly）誘發手性電荷分離與自旋約瑟夫森振盪。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { nonAbelianSpinSuperfluidEngine, type NonAbelianSpinState, type SpinSuperfluidRegime } from '../engine/nonAbelianSpinSuperfluid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<NonAbelianSpinState>(nonAbelianSpinSuperfluidEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onMuChange(e: Event) {
  const target = e.target as HTMLInputElement;
  nonAbelianSpinSuperfluidEngine.setSpinChemicalPotential(parseFloat(target.value));
  state.value = nonAbelianSpinSuperfluidEngine.getState();
}

function onRhoChange(e: Event) {
  const target = e.target as HTMLInputElement;
  nonAbelianSpinSuperfluidEngine.setSpinStiffness(parseFloat(target.value));
  state.value = nonAbelianSpinSuperfluidEngine.getState();
}

function onGradChange(e: Event) {
  const target = e.target as HTMLInputElement;
  nonAbelianSpinSuperfluidEngine.setPhaseGradient(parseFloat(target.value));
  state.value = nonAbelianSpinSuperfluidEngine.getState();
}

function setRegime(regime: SpinSuperfluidRegime) {
  nonAbelianSpinSuperfluidEngine.setRegime(regime);
  state.value = nonAbelianSpinSuperfluidEngine.getState();
}

function triggerJosephson() {
  nonAbelianSpinSuperfluidEngine.triggerSpinJosephsonBurst();
  state.value = nonAbelianSpinSuperfluidEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  nonAbelianSpinSuperfluidEngine.saveState();
}

function getSiteX(s: number): number {
  return 60 + (s - 1) * 34;
}

function getSpinPhase(s: number): number {
  const x = (s - 1) * 34;
  const t = state.value.timeElapsed;
  const omega = (state.value.spinJosephsonFrequencyGhz / 100) * 3.5;
  let phase = x * state.value.phaseGradientGradPhi - t * omega;
  if (state.value.regime === 'topological-spin-kink') {
    // 2pi twist kink centered at site 7
    phase += Math.PI * Math.tanh((s - 7) / 2.2);
  }
  return phase;
}

function getSpinArrowX(s: number): number {
  const phase = getSpinPhase(s);
  return getSiteX(s) + Math.cos(phase) * 22;
}

function getSpinArrowY(s: number): number {
  const phase = getSpinPhase(s);
  return 175 + Math.sin(phase) * 22;
}

function getSpinColor(s: number): string {
  if (state.value.regime === 'topological-spin-kink' && Math.abs(s - 7) <= 2) {
    return '#ec4899';
  }
  return '#38bdf8';
}

function updateLoop() {
  nonAbelianSpinSuperfluidEngine.update(0.016);
  state.value = nonAbelianSpinSuperfluidEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('non_abelian_spin_superfluid');
  animId = requestAnimationFrame(updateLoop);
});

onUnmounted(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId);
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: #090d16;
  border: 1px solid #334155;
  border-radius: 12px;
  width: 100%;
  max-width: 860px;
  max-height: 94vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #1e293b;
  background: #0b1120;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap .icon {
  font-size: 26px;
}

.title-wrap h2 {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f8fafc;
  background: #1e293b;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1e293b;
  background: #020617;
}

.spin-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.control-card {
  background: #0b1120;
  border: 1px solid #1e293b;
  padding: 12px 14px;
  border-radius: 8px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.control-header label {
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
}

.value-badge {
  font-size: 11px;
  font-family: monospace;
  font-weight: 700;
  color: #38bdf8;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
}

.slider {
  width: 100%;
  cursor: pointer;
  accent-color: #8b5cf6;
}

.control-desc {
  font-size: 10px;
  color: #64748b;
  margin: 6px 0 0 0;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.regime-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-regime {
  background: #0f172a;
  border: 1px solid #334155;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-regime:hover {
  color: #f8fafc;
  background: #1e293b;
}

.btn-regime.active {
  background: #7c3aed;
  color: #ffffff;
  border-color: #a78bfa;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #7c3aed;
  border: 1px solid #a78bfa;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-secondary {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #334155;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric-card {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 10px;
  color: #94a3b8;
}

.metric-value {
  font-size: 13px;
  font-weight: 700;
  font-family: monospace;
}

.metric-sub {
  font-size: 9px;
  color: #64748b;
}

.text-cyan { color: #38bdf8; }
.text-amber { color: #f59e0b; }
.text-pink { color: #ec4899; }
.text-purple { color: #c084fc; }

.theory-box {
  background: #070c18;
  border: 1px solid #1e293b;
  border-left: 3px solid #8b5cf6;
  border-radius: 6px;
  padding: 12px 14px;
}

.theory-box h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #a78bfa;
}

.theory-box p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
