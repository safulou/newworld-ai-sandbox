<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🎯</span>
          <div>
            <h2>拓撲非互易光子晶體奇異點雷射發電機</h2>
            <p class="subtitle">Non-Hermitian Topological Photonic Crystal, PT-Symmetry Breaking & Unidirectional Edge-State Lasing</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="laser-svg">
            <defs>
              <linearGradient id="laserBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="50%" stop-color="#0b1329" />
                <stop offset="100%" stop-color="#051912" />
              </linearGradient>

              <radialGradient id="gainGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="lossGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="laserBeamGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="1" />
                <stop offset="50%" stop-color="#34d399" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </radialGradient>

              <filter id="glowLaser">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#laserBg)" rx="8" />

            <!-- Photonic Crystal Honeycomb/Square Resonator Array -->
            <g transform="translate(60, 60)">
              <!-- Lattice Grid Border (Topological Cavity) -->
              <rect x="0" y="0" width="440" height="220" fill="#070d1e" stroke="#1e293b" stroke-width="2" rx="8" />

              <!-- Cavity Gain & Loss Cylinders (PT Symmetric modulation) -->
              <g v-for="gx in 8" :key="'gx' + gx">
                <g v-for="gy in 4" :key="'gy' + gy">
                  <circle
                    :cx="gx * 48 - 10"
                    :cy="gy * 48 - 5"
                    r="9"
                    :fill="(gx + gy) % 2 === 0 ? 'url(#gainGlow)' : 'url(#lossGlow)'"
                    filter="url(#glowLaser)"
                  />
                  <circle
                    :cx="gx * 48 - 10"
                    :cy="gy * 48 - 5"
                    r="4"
                    :fill="(gx + gy) % 2 === 0 ? '#fb7185' : '#60a5fa'"
                  />
                </g>
              </g>

              <!-- Unidirectional Chiral Edge State Lasing Track (Counter-Clockwise) -->
              <rect
                x="12"
                y="12"
                width="416"
                height="196"
                fill="none"
                :stroke="state.chiralEdgeModeActive ? '#10b981' : '#475569'"
                :stroke-width="state.chiralEdgeModeActive ? 3 : 1"
                :stroke-dasharray="state.chiralEdgeModeActive ? '10 6' : '3 3'"
                filter="url(#glowLaser)"
              />

              <!-- Circulating Topological Lasing Wavepacket -->
              <circle
                v-if="state.chiralEdgeModeActive"
                :cx="getEdgeWaveX()"
                :cy="getEdgeWaveY()"
                r="10"
                fill="url(#laserBeamGlow)"
                filter="url(#glowLaser)"
              />

              <!-- Forward Output Laser Beam Port (Top-Right emitting rightward) -->
              <g v-if="state.chiralEdgeModeActive">
                <line x1="428" y1="30" x2="520" y2="30" stroke="#10b981" stroke-width="4" filter="url(#glowLaser)" />
                <polygon points="520,30 508,24 508,36" fill="#10b981" />
                <text x="475" y="18" fill="#10b981" font-size="10" font-weight="bold">前向 T₊ ({{ (state.forwardTransmissionTPlus * 100).toFixed(0) }}%)</text>
              </g>

              <!-- Backward Extinction Port (Bottom-Right, Extinguished) -->
              <g>
                <line x1="520" y1="190" x2="428" y2="190" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.4" />
                <text x="475" y="210" fill="#f43f5e" font-size="10" font-weight="bold">反向消光 T₋ ({{ state.backwardExtinctionTMinus.toExponential(1) }})</text>
              </g>
            </g>

            <!-- Bottom Left Exceptional Point Status Box -->
            <g transform="translate(60, 295)">
              <rect x="0" y="0" width="440" height="48" fill="#0b1329" stroke="#1e293b" rx="6" />
              <text x="14" y="20" fill="#94a3b8" font-size="10">非厄米奇異點狀態:</text>
              <text x="140" y="20" :fill="state.isPtSymmetryBroken ? '#10b981' : '#f59e0b'" font-size="11" font-weight="bold">
                {{ state.isPtSymmetryBroken ? '⚡ PT 對稱破缺 (γ > γ_EP) 奇異點激發' : '💤 PT 對稱守恆 (γ < γ_EP)' }}
              </text>

              <text x="14" y="38" fill="#94a3b8" font-size="10">單模輸出波長:</text>
              <text x="140" y="38" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace">
                λ = {{ state.chiralLasingWavelengthNm.toFixed(1) }} nm (電信 C-波段)
              </text>
            </g>

            <!-- Diagnostics Telemetry HUD (Right Side) -->
            <g transform="translate(560, 25)">
              <rect x="0" y="0" width="225" height="175" fill="#0b1329" opacity="0.85" rx="6" stroke="#334155" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">非互易雷射遙測</text>

              <text x="14" y="48" fill="#94a3b8" font-size="10">抽運激發功率 P:</text>
              <text x="210" y="48" fill="#f8fafc" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.pumpPowerMilliwatts.toFixed(1) }} mW
              </text>

              <text x="14" y="70" fill="#94a3b8" font-size="10">增益損耗參數 γ:</text>
              <text x="210" y="70" fill="#ec4899" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.gainLossParameterPs.toFixed(1) }} ps⁻¹
              </text>

              <text x="14" y="92" fill="#94a3b8" font-size="10">奇異點閾值 γ_EP:</text>
              <text x="210" y="92" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.exceptionalPointThresholdPs.toFixed(1) }} ps⁻¹
              </text>

              <text x="14" y="114" fill="#94a3b8" font-size="10">非互易隔離度 Iso:</text>
              <text x="210" y="114" fill="#10b981" font-size="11" font-weight="bold" text-anchor="end" font-family="monospace">
                {{ state.isolationRatioDb.toFixed(1) }} dB
              </text>

              <text x="14" y="136" fill="#94a3b8" font-size="10">前向傳輸率 T₊:</text>
              <text x="210" y="136" fill="#34d399" font-size="10" text-anchor="end" font-family="monospace">
                {{ (state.forwardTransmissionTPlus * 100).toFixed(1) }}%
              </text>

              <text x="14" y="158" fill="#94a3b8" font-size="10">反向消光比 T₋:</text>
              <text x="210" y="158" fill="#f43f5e" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.backwardExtinctionTMinus.toExponential(2) }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: Pump Power -->
          <div class="control-card">
            <div class="control-header">
              <label>光學激發抽運功率 P_pump (mW)</label>
              <span class="value-badge">{{ state.pumpPowerMilliwatts.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="180.0"
              step="2.0"
              :value="state.pumpPowerMilliwatts"
              @input="onPumpChange"
              class="slider"
            />
            <p class="control-desc">提供雷射受激輻射放大飽和光增益</p>
          </div>

          <!-- Slider 2: Gain/Loss Parameter -->
          <div class="control-card">
            <div class="control-header">
              <label>非厄米增益損耗參數 γ (ps⁻¹)</label>
              <span class="value-badge">{{ state.gainLossParameterPs.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="28.0"
              step="0.5"
              :value="state.gainLossParameterPs"
              @input="onGammaChange"
              class="slider"
            />
            <p class="control-desc">超越奇異點 (EP) 破缺 PT 對稱性並驅動非互易隔離</p>
          </div>
        </div>

        <!-- Regime Selector & Actions -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'pt-symmetric-quiescent' }]"
              @click="setRegime('pt-symmetric-quiescent')"
            >
              PT 對稱守恆相
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'exceptional-point-critical' }]"
              @click="setRegime('exceptional-point-critical')"
            >
              奇異點臨界合併相
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'chiral-edge-lasing' }]"
              @click="setRegime('chiral-edge-lasing')"
            >
              手性邊緣單模雷射
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'high-isolation-limit' }]"
              @click="setRegime('high-isolation-limit')"
            >
              高隔離度極限態
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerIsolation">
              🎯 激發極限非互易隔離
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">非互易光學隔離度 Iso</span>
            <span class="metric-value text-emerald">{{ state.isolationRatioDb.toFixed(1) }} dB</span>
            <span class="metric-sub">Iso = 10 · log₁₀(T₊ / T₋) > 40 dB</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">前向傳輸效率 T₊</span>
            <span class="metric-value text-cyan">{{ (state.forwardTransmissionTPlus * 100).toFixed(1) }}%</span>
            <span class="metric-sub">拓撲保護單向波導</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">反向消光比 T₋</span>
            <span class="metric-value text-rose">{{ state.backwardExtinctionTMinus.toExponential(2) }}</span>
            <span class="metric-sub">相消干涉完全阻斷反向反射</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">手性邊緣雷射模式</span>
            <span class="metric-value" :class="state.chiralEdgeModeActive ? 'text-purple' : 'text-slate'">
              {{ state.chiralEdgeModeActive ? '⚡ 激發 (Unidirectional)' : '💤 休眠' }}
            </span>
            <span class="metric-sub">破壞時間反演之單向單模光子態</span>
          </div>
        </div>

        <!-- Theory Explainer Banner -->
        <div class="theory-box">
          <h4>🎯 物理理論背景：非厄米拓撲光子晶體奇異點與手性單向雷射 (Non-Hermitian Topological Laser)</h4>
          <p>
            傳統雷射極易受到反向反射光反饋的擾亂而發生多模跳變與強度噪聲。非厄米拓撲光子晶體透過精確調製晶格的增益與損耗分佈，
            跨越非厄米奇異點（Exceptional Point, EP）使體能帶的本徵態與本徵值幾何合併。結合破壞時間反演的磁光效應，
            僅允許單向手性拓撲邊緣模式起振發光，反向傳播被強烈消光，達成無磁光隔離器下的巨大光學非互易性（\(\text{Iso} > 40\) dB）。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { topologicalNonReciprocalLaserEngine, type NonReciprocalLaserState, type NonReciprocalLaserRegime } from '../engine/topologicalNonReciprocalLaser';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<NonReciprocalLaserState>(topologicalNonReciprocalLaserEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onPumpChange(e: Event) {
  const target = e.target as HTMLInputElement;
  topologicalNonReciprocalLaserEngine.setPumpPower(parseFloat(target.value));
  state.value = topologicalNonReciprocalLaserEngine.getState();
}

function onGammaChange(e: Event) {
  const target = e.target as HTMLInputElement;
  topologicalNonReciprocalLaserEngine.setGainLossParameter(parseFloat(target.value));
  state.value = topologicalNonReciprocalLaserEngine.getState();
}

function setRegime(regime: NonReciprocalLaserRegime) {
  topologicalNonReciprocalLaserEngine.setRegime(regime);
  state.value = topologicalNonReciprocalLaserEngine.getState();
}

function triggerIsolation() {
  topologicalNonReciprocalLaserEngine.triggerIsolationBurst();
  state.value = topologicalNonReciprocalLaserEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  topologicalNonReciprocalLaserEngine.saveState();
}

function getEdgeWaveX(): number {
  const w = 416;
  const h = 196;
  const total = 2 * (w + h);
  const pos = (state.value.timeElapsed * 160) % total;
  // Counter-clockwise: (12, 12) -> (12, 208) -> (428, 208) -> (428, 12) -> (12, 12)
  if (pos < h) {
    return 12;
  } else if (pos < h + w) {
    return 12 + (pos - h);
  } else if (pos < 2 * h + w) {
    return 428;
  } else {
    return 428 - (pos - (2 * h + w));
  }
}

function getEdgeWaveY(): number {
  const w = 416;
  const h = 196;
  const total = 2 * (w + h);
  const pos = (state.value.timeElapsed * 160) % total;
  if (pos < h) {
    return 12 + pos;
  } else if (pos < h + w) {
    return 208;
  } else if (pos < 2 * h + w) {
    return 208 - (pos - (h + w));
  } else {
    return 12;
  }
}

function updateLoop() {
  topologicalNonReciprocalLaserEngine.update(0.016);
  state.value = topologicalNonReciprocalLaserEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('topological_non_reciprocal_laser');
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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15);
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

.laser-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  color: #10b981;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
}

.slider {
  width: 100%;
  cursor: pointer;
  accent-color: #10b981;
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
  background: #059669;
  color: #ffffff;
  border-color: #34d399;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #059669;
  border: 1px solid #34d399;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #047857;
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

.text-emerald { color: #10b981; }
.text-cyan { color: #38bdf8; }
.text-rose { color: #f43f5e; }
.text-purple { color: #c084fc; }
.text-slate { color: #64748b; }

.theory-box {
  background: #070c18;
  border: 1px solid #1e293b;
  border-left: 3px solid #10b981;
  border-radius: 6px;
  padding: 12px 14px;
}

.theory-box h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #34d399;
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
