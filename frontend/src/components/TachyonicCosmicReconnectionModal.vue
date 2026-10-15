<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🪐</span>
          <div>
            <h2>超弦重聯與快子喉管躍遷反應堆</h2>
            <p class="subtitle">Tachyonic Cosmic String Intercommutation & Graviton Cusp Radiation</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="tachyonic-svg">
            <defs>
              <linearGradient id="cosmicBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="50%" stop-color="#090d16" />
                <stop offset="100%" stop-color="#180728" />
              </linearGradient>

              <radialGradient id="tachyonThroatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="cuspBurstGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="1" />
                <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
              </radialGradient>

              <filter id="glowTachyon">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Spacetime Metric Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#cosmicBg)" rx="8" />

            <!-- Spacetime Curvature Grid -->
            <g opacity="0.25">
              <path
                v-for="y in 7"
                :key="'gridy' + y"
                :d="`M 30 ${y * 45} Q 400 ${y * 45 + Math.sin(state.timeElapsed * 2 + y) * 15} 770 ${y * 45}`"
                fill="none"
                stroke="#6366f1"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
              <path
                v-for="x in 11"
                :key="'gridx' + x"
                :d="`M ${x * 70} 20 Q ${x * 70 + Math.cos(state.timeElapsed * 2 + x) * 15} 180 ${x * 70} 340`"
                fill="none"
                stroke="#6366f1"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
            </g>

            <!-- Intercommuting Cosmic Strings (Before/During Reconnection) -->
            <g v-if="state.regime !== 'closed-string-decay'">
              <!-- String A (Upper strand bending toward center) -->
              <path
                :d="getStringAPath()"
                fill="none"
                stroke="#38bdf8"
                :stroke-width="Math.max(2, state.stringTensionGmu * 1.5)"
                filter="url(#glowTachyon)"
              />

              <!-- String B (Lower strand bending toward center) -->
              <path
                :d="getStringBPath()"
                fill="none"
                stroke="#a855f7"
                :stroke-width="Math.max(2, state.stringTensionGmu * 1.5)"
                filter="url(#glowTachyon)"
              />

              <!-- Tachyonic Reconnection Throat Neck -->
              <g :transform="`translate(380, 180)`">
                <!-- Condensation instability glow -->
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="state.throatRadiusPlanck * 2.2"
                  :ry="state.throatRadiusPlanck * 1.4"
                  fill="url(#tachyonThroatGlow)"
                  filter="url(#glowTachyon)"
                />

                <!-- Throat bridge wormhole contour -->
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="state.throatRadiusPlanck * 1.2"
                  :ry="state.throatRadiusPlanck * 0.7"
                  fill="none"
                  :stroke="state.tachyonMassSquared < 0 ? '#ec4899' : '#94a3b8'"
                  stroke-width="2"
                  stroke-dasharray="3 3"
                />

                <!-- Flux lines through throat -->
                <line
                  v-for="f in 5"
                  :key="'flux' + f"
                  :x1="-state.throatRadiusPlanck"
                  :y1="(f - 3) * 6"
                  :x2="state.throatRadiusPlanck"
                  :y2="(f - 3) * 6"
                  stroke="#f472b6"
                  stroke-width="1"
                  opacity="0.8"
                />
              </g>
            </g>

            <!-- Closed String Decay / Graviton Loop Fission Regime -->
            <g v-else>
              <!-- Oscillating Closed String Loop -->
              <ellipse
                cx="380"
                cy="180"
                :rx="45 + Math.sin(state.timeElapsed * 10) * 15"
                :ry="35 + Math.cos(state.timeElapsed * 10) * 12"
                fill="none"
                stroke="#ec4899"
                stroke-width="3"
                filter="url(#glowTachyon)"
              />

              <!-- Expanding Graviton Shockwaves -->
              <circle
                v-for="g in 4"
                :key="'gw' + g"
                cx="380"
                cy="180"
                :r="((state.timeElapsed * 60 + g * 35) % 150) + 20"
                fill="none"
                stroke="#fbbf24"
                :stroke-width="2.5"
                :opacity="Math.max(0, 1 - (((state.timeElapsed * 60 + g * 35) % 150) / 150))"
              />
            </g>

            <!-- Cusp Relativistic Jet Beams (Emits at cusp point when v > 0.6c) -->
            <g v-if="state.cuspRadiationActive">
              <circle cx="480" cy="180" r="16" fill="url(#cuspBurstGlow)" filter="url(#glowTachyon)" />
              <polygon
                points="480,180 680,120 720,180 680,240"
                fill="#facc15"
                opacity="0.45"
                filter="url(#glowTachyon)"
              />
              <line x1="480" y1="180" x2="720" y2="180" stroke="#fef08a" stroke-width="3" />
              <text x="600" y="150" fill="#fef08a" font-size="11" font-weight="bold">
                CUSP JET (γ >> 1)
              </text>
            </g>

            <!-- Diagnostics & Telemetry Overlay HUD (Right Side) -->
            <g transform="translate(560, 25)">
              <rect x="0" y="0" width="225" height="155" fill="#0b1329" opacity="0.85" rx="6" stroke="#334155" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">重聯物理遙測 (Telemetry)</text>

              <text x="14" y="48" fill="#94a3b8" font-size="10">無因次張力 Gμ:</text>
              <text x="210" y="48" fill="#f8fafc" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.stringTensionGmu.toFixed(2) }} × 10⁻⁷
              </text>

              <text x="14" y="70" fill="#94a3b8" font-size="10">相對碰撞速度 v/c:</text>
              <text x="210" y="70" fill="#38bdf8" font-size="10" text-anchor="end" font-family="monospace">
                {{ (state.collisionVelocityC * 100).toFixed(1) }}% c
              </text>

              <text x="14" y="92" fill="#94a3b8" font-size="10">快子質量平方 m_T²:</text>
              <text x="210" y="92" :fill="state.tachyonMassSquared < 0 ? '#ec4899' : '#34d399'" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.tachyonMassSquared.toFixed(2) }} ℏ/c²
              </text>

              <text x="14" y="114" fill="#94a3b8" font-size="10">喉管半徑 r_throat:</text>
              <text x="210" y="114" fill="#facc15" font-size="10" text-anchor="end" font-family="monospace">
                {{ state.throatRadiusPlanck.toFixed(1) }} ℓ_P
              </text>

              <text x="14" y="136" fill="#94a3b8" font-size="10">重聯穿透機率 P_rec:</text>
              <text x="210" y="136" fill="#a78bfa" font-size="10" text-anchor="end" font-family="monospace">
                {{ (state.reconnectionProbability * 100).toFixed(0) }}%
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: String Tension Gmu -->
          <div class="control-card">
            <div class="control-header">
              <label>宇宙弦張力 Gμ (× 10⁻⁷)</label>
              <span class="value-badge">{{ state.stringTensionGmu.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              :value="state.stringTensionGmu"
              @input="onTensionChange"
              class="slider"
            />
            <p class="control-desc">決定微觀超弦質量密度與重力子波前破壞力</p>
          </div>

          <!-- Slider 2: Collision Velocity v/c -->
          <div class="control-card">
            <div class="control-header">
              <label>相對碰撞速度 v/c</label>
              <span class="value-badge">{{ (state.collisionVelocityC * 100).toFixed(0) }}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.01"
              :value="state.collisionVelocityC"
              @input="onVelocityChange"
              class="slider"
            />
            <p class="control-desc">超相對論性碰撞激發尖突 (Cusp) 奇異引力波噴流</p>
          </div>

          <!-- Slider 3: Tachyon Mass Squared -->
          <div class="control-card">
            <div class="control-header">
              <label>快子質量平方 m_T²</label>
              <span class="value-badge" :class="{ negative: state.tachyonMassSquared < 0 }">
                {{ state.tachyonMassSquared.toFixed(2) }}
              </span>
            </div>
            <input
              type="range"
              min="-10.0"
              max="4.0"
              step="0.2"
              :value="state.tachyonMassSquared"
              @input="onTachyonMassChange"
              class="slider"
            />
            <p class="control-desc">負值觸發不穩定 D-膜真空快子凝聚與局部喉管開裂</p>
          </div>
        </div>

        <!-- Regime Selector & Action Buttons -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'free-string-wiggle' }]"
              @click="setRegime('free-string-wiggle')"
            >
              自由弦波動
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'tachyon-condensation' }]"
              @click="setRegime('tachyon-condensation')"
            >
              快子凝聚態
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'throat-reconnection' }]"
              @click="setRegime('throat-reconnection')"
            >
              喉管重聯開裂
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'closed-string-decay' }]"
              @click="setRegime('closed-string-decay')"
            >
              閉弦衰變發射
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerRupture">
              💥 觸發喉管重聯突變
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Stats / Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">閉弦引力子輻射功率 P_GW</span>
            <span class="metric-value text-amber">{{ state.gravitonBurstPowerWatts.toExponential(2) }} W</span>
            <span class="metric-sub">P_GW = Γ G μ² c γ² (普朗克極限)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">重聯喉管普朗克半徑 r_throat</span>
            <span class="metric-value text-pink">{{ state.throatRadiusPlanck.toFixed(1) }} ℓ_P</span>
            <span class="metric-sub">~ √(ℏ c / |m_T²|)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">弦尖突相干輻射 (Cusp Jet)</span>
            <span class="metric-value" :class="state.cuspRadiationActive ? 'text-cyan' : 'text-slate'">
              {{ state.cuspRadiationActive ? '⚡ 激活 (Relativistic)' : '💤 休眠' }}
            </span>
            <span class="metric-sub">相對論洛倫茲因子 γ > 1.4</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">重聯穿透機率 P_rec</span>
            <span class="metric-value text-purple">{{ (state.reconnectionProbability * 100).toFixed(0) }}%</span>
            <span class="metric-sub">取決於超弦耦合常數 g_s</span>
          </div>
        </div>

        <!-- Scientific Context Banner -->
        <div class="theory-box">
          <h4>🌌 物理理論背景：超弦重聯互通與快子凝聚 (Polchinski-Sen D-Brane Dynamics)</h4>
          <p>
            在弦論宇宙學中，宇宙弦（Cosmic Strings）碰撞時發生互通重聯（Intercommutation）。當 D-膜與反 D-膜對撞時，開弦快子場質量平方 \(m_T^2 < 0\)
            導致玻色真空失穩，觸發快子凝聚並形成局部微觀蟲洞喉管。弦線重聯過程中，尖突（Cusps）與扭折（Kinks）會以極度平行的相干束形式噴射出高頻引力子爆發（Gravitational Wave Bursts）。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { tachyonicReconnectionEngine, type TachyonicReconnectionState, type TachyonicReconnectionRegime } from '../engine/tachyonicCosmicReconnection';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<TachyonicReconnectionState>(tachyonicReconnectionEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onTensionChange(e: Event) {
  const target = e.target as HTMLInputElement;
  tachyonicReconnectionEngine.setStringTension(parseFloat(target.value));
  state.value = tachyonicReconnectionEngine.getState();
}

function onVelocityChange(e: Event) {
  const target = e.target as HTMLInputElement;
  tachyonicReconnectionEngine.setCollisionVelocity(parseFloat(target.value));
  state.value = tachyonicReconnectionEngine.getState();
}

function onTachyonMassChange(e: Event) {
  const target = e.target as HTMLInputElement;
  tachyonicReconnectionEngine.setTachyonMassSquared(parseFloat(target.value));
  state.value = tachyonicReconnectionEngine.getState();
}

function setRegime(regime: TachyonicReconnectionRegime) {
  tachyonicReconnectionEngine.setRegime(regime);
  state.value = tachyonicReconnectionEngine.getState();
}

function triggerRupture() {
  tachyonicReconnectionEngine.triggerThroatRupture();
  state.value = tachyonicReconnectionEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  tachyonicReconnectionEngine.saveState();
}

function getStringAPath(): string {
  const t = state.value.timeElapsed * 3;
  const neckY = 180 - state.value.throatRadiusPlanck * 1.5;
  const wiggle1 = Math.sin(t) * 12;
  const wiggle2 = Math.cos(t) * 10;
  return `M 40,80 Q 200,${90 + wiggle1} 380,${neckY} Q 560,${90 + wiggle2} 740,80`;
}

function getStringBPath(): string {
  const t = state.value.timeElapsed * 3;
  const neckY = 180 + state.value.throatRadiusPlanck * 1.5;
  const wiggle1 = Math.sin(t + 1.5) * 12;
  const wiggle2 = Math.cos(t + 1.5) * 10;
  return `M 40,280 Q 200,${270 + wiggle1} 380,${neckY} Q 560,${270 + wiggle2} 740,280`;
}

function updateLoop() {
  tachyonicReconnectionEngine.update(0.016);
  state.value = tachyonicReconnectionEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('tachyonic_cosmic_reconnection');
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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.15);
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

.tachyonic-svg {
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

.value-badge.negative {
  color: #ec4899;
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
  background: #ec4899;
  border: 1px solid #f472b6;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #db2777;
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
.text-purple { color: #c084fc; }
.text-cyan { color: #38bdf8; }
.text-slate { color: #64748b; }

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
  color: #c084fc;
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
