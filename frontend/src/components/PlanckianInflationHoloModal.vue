<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">📡</span>
          <div>
            <h2>普朗克引力暴脹與全息對偶天線</h2>
            <p class="subtitle">Cosmic Slow-Roll Inflation, Primordial Gravitational Waves & Holographic CMB B-Modes</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="inflation-svg">
            <defs>
              <linearGradient id="cosmicInflationBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="50%" stop-color="#090e24" />
                <stop offset="100%" stop-color="#1e0c28" />
              </linearGradient>

              <radialGradient id="inflatonHorizonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="bModeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>

              <filter id="glowInflation">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Spacetime Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#cosmicInflationBg)" rx="8" />

            <!-- Expanding de Sitter Cosmic Spacetime Grid -->
            <g opacity="0.3">
              <circle
                v-for="r in 6"
                :key="'dS-ring' + r"
                cx="280"
                cy="180"
                :r="((state.timeElapsed * 35 + r * 35) % 210) + 15"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.2"
                stroke-dasharray="4 4"
              />
            </g>

            <!-- Holographic Singularity Inflaton Core (Hubble Horizon R_H = c/H) -->
            <g transform="translate(280, 180)">
              <!-- Singularity Core -->
              <circle cx="0" cy="0" r="32" fill="url(#inflatonHorizonGlow)" filter="url(#glowInflation)" />
              <circle cx="0" cy="0" r="10" fill="#ffffff" />
              <text x="0" y="-38" fill="#facc15" font-size="11" text-anchor="middle" font-weight="bold">
                哈伯視界 H = {{ state.hubbleScaleHOverMpl.toFixed(2) }} × 10⁻⁵ M_pl
              </text>

              <!-- Quadrupole Tensor Wave Ripples (Primordial GWs) -->
              <path
                v-for="w in 4"
                :key="'tensor' + w"
                :d="getTensorWavePath(w)"
                fill="none"
                stroke="#ec4899"
                :stroke-width="Math.max(1.5, state.tensorToScalarRatioR * 35)"
                filter="url(#glowInflation)"
              />
            </g>

            <!-- CMB B-Mode Polarization Swirl Pattern Overlay -->
            <g v-if="state.bModePolarizationActive">
              <g v-for="bx in 6" :key="'bx' + bx">
                <g v-for="by in 5" :key="'by' + by">
                  <!-- Small curl vector tick mark centered around grid -->
                  <line
                    :x1="60 + bx * 65"
                    :y1="40 + by * 55"
                    :x2="60 + bx * 65 + getCurlDx(bx, by)"
                    :y2="40 + by * 55 + getCurlDy(bx, by)"
                    stroke="#38bdf8"
                    stroke-width="2.5"
                    filter="url(#glowInflation)"
                  />
                  <circle
                    :cx="60 + bx * 65"
                    :cy="40 + by * 55"
                    r="2"
                    fill="#38bdf8"
                  />
                </g>
              </g>
              <text x="70" y="32" fill="#38bdf8" font-size="11" font-weight="bold">
                CMB B-MODE CURL (r = {{ state.tensorToScalarRatioR.toFixed(3) }})
              </text>
            </g>

            <!-- Diagnostics Telemetry HUD (Right Side) -->
            <g transform="translate(560, 25)">
              <rect x="0" y="0" width="225" height="175" fill="#0b1329" opacity="0.85" rx="6" stroke="#334155" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">暴脹宇宙學遙測</text>

              <text x="14" y="48" fill="#94a3b8" font-size="10">哈伯尺度 H/M_pl:</text>
              <text x="210" y="48" fill="#facc15" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.hubbleScaleHOverMpl.toFixed(2) }} × 10⁻⁵
              </text>

              <text x="14" y="70" fill="#94a3b8" font-size="10">第一慢滾參數 ε:</text>
              <text x="210" y="70" fill="#f8fafc" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.slowRollEpsilon.toFixed(4) }}
              </text>

              <text x="14" y="92" fill="#94a3b8" font-size="10">張量標量比 r:</text>
              <text x="210" y="92" fill="#ec4899" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.tensorToScalarRatioR.toFixed(4) }}
              </text>

              <text x="14" y="114" fill="#94a3b8" font-size="10">張量譜指數 n_t:</text>
              <text x="210" y="114" fill="#38bdf8" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.tensorSpectralIndexNt.toFixed(4) }}
              </text>

              <text x="14" y="136" fill="#94a3b8" font-size="10">引力波功率 P_t:</text>
              <text x="210" y="136" fill="#a78bfa" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.primordialGwPower.toFixed(2) }} × 10⁻¹⁰
              </text>

              <text x="14" y="158" fill="#94a3b8" font-size="10">全息奇異點尺度 z:</text>
              <text x="210" y="158" fill="#34d399" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.holographicRgScaleZ.toFixed(2) }} ℓ_P
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: Hubble Scale -->
          <div class="control-card">
            <div class="control-header">
              <label>暴脹哈伯尺度 H / M_pl (× 10⁻⁵)</label>
              <span class="value-badge">{{ state.hubbleScaleHOverMpl.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="4.5"
              step="0.05"
              :value="state.hubbleScaleHOverMpl"
              @input="onHubbleChange"
              class="slider"
            />
            <p class="control-desc">決定太初引力波振幅平方 P_t ~ 2(H/M_pl)²/π²</p>
          </div>

          <!-- Slider 2: Slow Roll Epsilon -->
          <div class="control-card">
            <div class="control-header">
              <label>慢滾參數 ε = -Ḣ / H²</label>
              <span class="value-badge">{{ state.slowRollEpsilon.toFixed(4) }}</span>
            </div>
            <input
              type="range"
              min="0.0005"
              max="0.025"
              step="0.0005"
              :value="state.slowRollEpsilon"
              @input="onEpsChange"
              class="slider"
            />
            <p class="control-desc">決定張量-標量比 r = 16ε 與張量紅移 n_t = -2ε</p>
          </div>

          <!-- Slider 3: Holographic Scale -->
          <div class="control-card">
            <div class="control-header">
              <label>全息對偶重整化尺度 z (ℓ_P)</label>
              <span class="value-badge">{{ state.holographicRgScaleZ.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              :value="state.holographicRgScaleZ"
              @input="onZChange"
              class="slider"
            />
            <p class="control-desc">利用全息場論邊界將太初大爆炸曲率奇異點平滑化</p>
          </div>
        </div>

        <!-- Regime Selector & Actions -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'slow-roll-uniform' }]"
              @click="setRegime('slow-roll-uniform')"
            >
              慢滾暴脹均勻相
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'primordial-gw-fluctuation' }]"
              @click="setRegime('primordial-gw-fluctuation')"
            >
              太初引力波漲落
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'holographic-singularity-flow' }]"
              @click="setRegime('holographic-singularity-flow')"
            >
              全息奇異點重整化
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'cmb-b-mode-polarization' }]"
              @click="setRegime('cmb-b-mode-polarization')"
            >
              CMB B-模旋度偏振
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerBMode">
              📡 激發 B-模引力波爆發
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">張量-標量比 r</span>
            <span class="metric-value text-amber">{{ state.tensorToScalarRatioR.toFixed(4) }}</span>
            <span class="metric-sub">r = 16 ε (一致性關係)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">太初引力波功率 P_t</span>
            <span class="metric-value text-pink">{{ state.primordialGwPower.toFixed(2) }} × 10⁻¹⁰</span>
            <span class="metric-sub">普朗克衛星巡天觀測上限</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">張量傾斜指數 n_t</span>
            <span class="metric-value text-cyan">{{ state.tensorSpectralIndexNt.toFixed(4) }}</span>
            <span class="metric-sub">n_t = -2 ε (微弱紅移)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">CMB B-模旋度偏振</span>
            <span class="metric-value" :class="state.bModePolarizationActive ? 'text-purple' : 'text-slate'">
              {{ state.bModePolarizationActive ? '⚡ 激活 (Tensor Active)' : '💤 休眠' }}
            </span>
            <span class="metric-sub">宇宙暴脹終極「確鑿指紋」</span>
          </div>
        </div>

        <!-- Theory Explainer Banner -->
        <div class="theory-box">
          <h4>📡 物理理論背景：普朗克暴脹宇宙學與全息對偶引力波天線 (Cosmic Inflation & Holographic B-Modes)</h4>
          <p>
            宇宙早期暴脹時期（$10^{-36}$ 秒），德西特空間的量子真空漲落被拉伸超出哈伯視界，凍結為橫向無跡「太初引力波」（Primordial Gravitational Waves）。
            這些張量擾動在宇宙微波背景輻射（CMB）上烙印下不可由純標量擾動產生的「B-模式旋度偏振」（B-Mode Curl Polarization）。
            透過 AdS/CFT 全息對偶，大爆炸初始奇異點被高維全息超引力重整化群流消解，提供無發散的太初擾動功率譜。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { planckianInflationHoloEngine, type PlanckianInflationState, type InflationHoloRegime } from '../engine/planckianInflationHoloAntenna';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<PlanckianInflationState>(planckianInflationHoloEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onHubbleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  planckianInflationHoloEngine.setHubbleScale(parseFloat(target.value));
  state.value = planckianInflationHoloEngine.getState();
}

function onEpsChange(e: Event) {
  const target = e.target as HTMLInputElement;
  planckianInflationHoloEngine.setSlowRollEpsilon(parseFloat(target.value));
  state.value = planckianInflationHoloEngine.getState();
}

function onZChange(e: Event) {
  const target = e.target as HTMLInputElement;
  planckianInflationHoloEngine.setHolographicScale(parseFloat(target.value));
  state.value = planckianInflationHoloEngine.getState();
}

function setRegime(regime: InflationHoloRegime) {
  planckianInflationHoloEngine.setRegime(regime);
  state.value = planckianInflationHoloEngine.getState();
}

function triggerBMode() {
  planckianInflationHoloEngine.triggerBModeBurst();
  state.value = planckianInflationHoloEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  planckianInflationHoloEngine.saveState();
}

function getTensorWavePath(index: number): string {
  const r = 50 + index * 32;
  const t = state.value.timeElapsed * 2;
  const deform = Math.sin(t + index) * 12;
  return `M ${-r} 0 Q 0 ${r + deform} ${r} 0 Q 0 ${-(r + deform)} ${-r} 0`;
}

function getCurlDx(bx: number, by: number): number {
  const angle = (bx * 0.8 + by * 0.6 + state.value.timeElapsed * 1.5);
  return Math.cos(angle) * 14;
}

function getCurlDy(bx: number, by: number): number {
  const angle = (bx * 0.8 + by * 0.6 + state.value.timeElapsed * 1.5);
  return Math.sin(angle) * 14;
}

function updateLoop() {
  planckianInflationHoloEngine.update(0.016);
  state.value = planckianInflationHoloEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('planckian_inflation_holo_antenna');
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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.15);
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

.inflation-svg {
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
  color: #facc15;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
}

.slider {
  width: 100%;
  cursor: pointer;
  accent-color: #f59e0b;
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
  background: #d97706;
  color: #ffffff;
  border-color: #fbbf24;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #d97706;
  border: 1px solid #fbbf24;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #b45309;
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

.text-amber { color: #f59e0b; }
.text-pink { color: #ec4899; }
.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-slate { color: #64748b; }

.theory-box {
  background: #070c18;
  border: 1px solid #1e293b;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
  padding: 12px 14px;
}

.theory-box h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #fbbf24;
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
