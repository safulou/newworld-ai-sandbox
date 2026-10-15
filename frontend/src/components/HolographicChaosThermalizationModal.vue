<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🌌</span>
          <div>
            <h2>全息量子混亂與極大李雅普諾夫熱化反應堆</h2>
            <p class="subtitle">AdS/CFT Holographic Fast Scramblers, OTOC Correlators & Maldacena-Shenker-Stanford Bound</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="chaos-svg">
            <defs>
              <linearGradient id="chaosBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020617" />
                <stop offset="50%" stop-color="#0a0f1d" />
                <stop offset="100%" stop-color="#14061f" />
              </linearGradient>

              <radialGradient id="horizonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.5" />
                <stop offset="90%" stop-color="#3b82f6" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>

              <radialGradient id="butterflyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
              </radialGradient>

              <filter id="glowChaos">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Spacetime Canvas Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#chaosBgGrad)" rx="8" />

            <!-- LEFT REGION: AdS Bulk & Black Hole Event Horizon (Fast Scrambler) -->
            <g transform="translate(190, 180)">
              <!-- AdS Boundary Circle -->
              <circle cx="0" cy="0" r="140" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="0" y="-148" fill="#64748b" font-size="10" text-anchor="middle">CFT 邊界 (z = 0)</text>

              <!-- Radial AdS Spatial Coordinates -->
              <circle
                v-for="r in 3"
                :key="'adsr' + r"
                cx="0"
                cy="0"
                :r="r * 35 + 25"
                fill="none"
                stroke="#1e293b"
                stroke-width="1"
              />

              <!-- Black Hole Scrambling Horizon Core -->
              <circle cx="0" cy="0" :r="28 + state.hawkingTemperatureKelvin * 4" fill="url(#horizonGlow)" filter="url(#glowChaos)" />
              <circle cx="0" cy="0" :r="16 + state.hawkingTemperatureKelvin * 2" fill="#000000" stroke="#ec4899" stroke-width="2" />
              <text x="0" y="4" fill="#f472b6" font-size="9" text-anchor="middle" font-weight="bold">HORIZON</text>

              <!-- Quantum Chaos Swirl Filaments -->
              <g :transform="`rotate(${state.timeElapsed * state.lyapunovExponentLambda * 12}, 0, 0)`">
                <path
                  v-for="a in 6"
                  :key="'swirl' + a"
                  :d="getSwirlPath(a)"
                  fill="none"
                  stroke="#a855f7"
                  stroke-width="1.5"
                  opacity="0.6"
                />
              </g>

              <!-- Butterfly Effect Wavefront Cones (Expanding at v_B) -->
              <circle
                cx="0"
                cy="0"
                :r="getButterflyRadius()"
                fill="none"
                stroke="#38bdf8"
                stroke-width="2"
                stroke-dasharray="6 4"
                filter="url(#glowChaos)"
              />
              <text :x="0" :y="getButterflyRadius() + 14" fill="#38bdf8" font-size="10" text-anchor="middle" font-weight="bold">
                蝴蝶波前 v_B = {{ state.butterflyVelocityC.toFixed(3) }} c
              </text>

              <!-- Perturbation Injection Point V(0) -->
              <circle cx="-140" cy="0" r="5" fill="#facc15" filter="url(#glowChaos)" />
              <text x="-140" y="-12" fill="#facc15" font-size="10" text-anchor="middle" font-weight="bold">V(0)</text>
            </g>

            <!-- RIGHT REGION: OTOC Correlator Plot F(t) vs t -->
            <g transform="translate(420, 40)">
              <!-- Plot Frame -->
              <rect x="0" y="0" width="350" height="230" fill="#070c18" stroke="#1e293b" rx="6" />
              <text x="14" y="24" fill="#f8fafc" font-size="12" font-weight="bold">
                時序失序關聯函數 OTOC: F(t) = ⟨W†(t) V†(0) W(t) V(0)⟩
              </text>

              <!-- Coordinate Axes -->
              <line x1="40" y1="200" x2="330" y2="200" stroke="#475569" stroke-width="1.5" />
              <line x1="40" y1="40" x2="40" y2="200" stroke="#475569" stroke-width="1.5" />
              <text x="330" y="214" fill="#94a3b8" font-size="10">時間 t</text>
              <text x="25" y="44" fill="#94a3b8" font-size="10">1.0</text>
              <text x="25" y="125" fill="#94a3b8" font-size="10">0.5</text>
              <text x="25" y="204" fill="#94a3b8" font-size="10">0.0</text>

              <!-- Grid reference lines -->
              <line x1="40" y1="120" x2="330" y2="120" stroke="#1e293b" stroke-dasharray="2 2" />

              <!-- Scrambling Time t_* Vertical Marker Line -->
              <line
                :x1="getScramblingMarkerX()"
                y1="40"
                :x2="getScramblingMarkerX()"
                y2="200"
                stroke="#f59e0b"
                stroke-width="1.5"
                stroke-dasharray="4 3"
              />
              <text :x="getScramblingMarkerX()" y="34" fill="#f59e0b" font-size="10" text-anchor="middle" font-weight="bold">
                擾亂時間 t* ({{ state.scramblingTimeSec.toFixed(2) }}s)
              </text>

              <!-- Theoretical MSS Exponential Curve Path -->
              <path
                :d="getOTOCPath()"
                fill="none"
                stroke="#ec4899"
                stroke-width="2.5"
                filter="url(#glowChaos)"
              />

              <!-- Current Operating Time Point -->
              <circle
                :cx="getCurrentOTOCPointX()"
                :cy="getCurrentOTOCPointY()"
                r="6"
                fill="#38bdf8"
                filter="url(#glowChaos)"
              />
              <circle
                :cx="getCurrentOTOCPointX()"
                :cy="getCurrentOTOCPointY()"
                r="2.5"
                fill="#ffffff"
              />

              <!-- Plot Legend -->
              <text x="45" y="222" fill="#ec4899" font-size="9.5">
                ● F(t) ~ 1 - (1/N²) e^(λ_L t)
              </text>
              <text x="200" y="222" fill="#38bdf8" font-size="9.5">
                ● 當前關聯度: {{ state.otocCorrelatorVal.toFixed(3) }}
              </text>
            </g>

            <!-- Bottom Banner Telemetry Bar -->
            <g transform="translate(420, 285)">
              <rect x="0" y="0" width="350" height="58" fill="#0b1329" stroke="#334155" rx="6" />
              <text x="14" y="22" fill="#94a3b8" font-size="10">MSS 界限飽和:</text>
              <text x="110" y="22" fill="#10b981" font-size="11" font-weight="bold">λ_L / (2π T_H) = 1.000 (飽和)</text>

              <text x="14" y="44" fill="#94a3b8" font-size="10">李雅普諾夫指數:</text>
              <text x="110" y="44" fill="#f43f5e" font-size="11" font-weight="bold" font-family="monospace">
                λ_L = {{ state.lyapunovExponentLambda.toFixed(2) }} s⁻¹
              </text>

              <text x="235" y="22" fill="#94a3b8" font-size="10">混亂資訊熱化:</text>
              <text x="335" y="22" fill="#a855f7" font-size="11" font-weight="bold" text-anchor="end">
                {{ state.scrambledFractionPct.toFixed(1) }}%
              </text>
            </g>
          </svg>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Slider 1: Hawking Temperature -->
          <div class="control-card">
            <div class="control-header">
              <label>全息黑洞霍金溫度 T_H (K)</label>
              <span class="value-badge">{{ state.hawkingTemperatureKelvin.toFixed(1) }} K</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              :value="state.hawkingTemperatureKelvin"
              @input="onTemperatureChange"
              class="slider"
            />
            <p class="control-desc">線性決定 MSS 李雅普諾夫指數上限 λ_L = 2π k_B T / ℏ</p>
          </div>

          <!-- Slider 2: Degrees of Freedom N^2 -->
          <div class="control-card">
            <div class="control-header">
              <label>全息微觀自由度 N² (規範群秩)</label>
              <span class="value-badge">{{ state.entropyDegreesN2 }}</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              :value="state.entropyDegreesN2"
              @input="onEntropyDegreesChange"
              class="slider"
            />
            <p class="control-desc">決定黑洞貝肯斯坦-霍金微觀熵與量子資訊擾亂時間 t*</p>
          </div>
        </div>

        <!-- Regime Selector & Actions -->
        <div class="actions-bar">
          <div class="regime-group">
            <button
              :class="['btn-regime', { active: state.regime === 'early-local-perturbation' }]"
              @click="setRegime('early-local-perturbation')"
            >
              早期局域微擾
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'exponential-otoc-decay' }]"
              @click="setRegime('exponential-otoc-decay')"
            >
              指數 OTOC 衰減
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'mss-bound-saturation' }]"
              @click="setRegime('mss-bound-saturation')"
            >
              MSS 極限飽和態
            </button>
            <button
              :class="['btn-regime', { active: state.regime === 'thermal-scrambled-equilibrium' }]"
              @click="setRegime('thermal-scrambled-equilibrium')"
            >
              混沌熱化熱平衡
            </button>
          </div>

          <div class="btn-group">
            <button class="btn-primary" @click="triggerScramble">
              🔥 激發急速混亂擾亂
            </button>
            <button class="btn-secondary" @click="toggleAudio">
              {{ state.audioEnabled ? '🔊 靜音合成' : '🔈 開啟音效' }}
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">量子李雅普諾夫混亂指數 λ_L</span>
            <span class="metric-value text-rose">{{ state.lyapunovExponentLambda.toFixed(2) }} s⁻¹</span>
            <span class="metric-sub">λ_L = 2π k_B T / ℏ (普朗克極限)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">量子資訊擾亂時間 t*</span>
            <span class="metric-value text-amber">{{ state.scramblingTimeSec.toFixed(3) }} s</span>
            <span class="metric-sub">t* = (1 / λ_L) · ln(N²)</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">時序失序關聯函數 OTOC F(t)</span>
            <span class="metric-value text-cyan">{{ state.otocCorrelatorVal.toFixed(3) }}</span>
            <span class="metric-sub">F(t) = ⟨[W(t), V(0)]²⟩ 對易子演化</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">全息蝴蝶擴展速度 v_B</span>
            <span class="metric-value text-purple">{{ (state.butterflyVelocityC * 100).toFixed(1) }}% c</span>
            <span class="metric-sub">AdS 全息重力波錐傳播極限</span>
          </div>
        </div>

        <!-- Theory Explainer Banner -->
        <div class="theory-box">
          <h4>🌌 物理理論背景：馬爾達西納-申克-斯坦福 (MSS) 混亂界限與黑洞極速擾亂</h4>
          <p>
            2016 年由 Maldacena、Shenker 與 Stanford 證明，在有限溫度 \(T\) 下的任何微觀量子多體系統中，量子李雅普諾夫指數存在絕對普朗克上限：
            \(\lambda_L \le \frac{2\pi k_B T}{\hbar}\)。透過 AdS/CFT 對偶性，帶有黑洞視界的全息愛因斯坦引力嚴格飽和此界限（\(\lambda_L = \frac{2\pi k_B T}{\hbar}\)），
            證明全息黑洞是宇宙中最快的資訊混亂攪拌器（Fastest Scramblers in Nature）。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicChaosEngine, type HolographicChaosState, type HolographicChaosRegime } from '../engine/holographicChaosThermalization';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<HolographicChaosState>(holographicChaosEngine.getState());
let animId: number | null = null;

function handleClose() {
  uiStore.closeOverlay();
}

function onTemperatureChange(e: Event) {
  const target = e.target as HTMLInputElement;
  holographicChaosEngine.setTemperature(parseFloat(target.value));
  state.value = holographicChaosEngine.getState();
}

function onEntropyDegreesChange(e: Event) {
  const target = e.target as HTMLInputElement;
  holographicChaosEngine.setEntropyDegrees(parseFloat(target.value));
  state.value = holographicChaosEngine.getState();
}

function setRegime(regime: HolographicChaosRegime) {
  holographicChaosEngine.setRegime(regime);
  state.value = holographicChaosEngine.getState();
}

function triggerScramble() {
  holographicChaosEngine.triggerRapidScramblingBurst();
  state.value = holographicChaosEngine.getState();
}

function toggleAudio() {
  state.value.audioEnabled = !state.value.audioEnabled;
  holographicChaosEngine.saveState();
}

function getSwirlPath(index: number): string {
  const angle = (index * 60 * Math.PI) / 180;
  const r1 = 30;
  const r2 = 120;
  const x1 = Math.cos(angle) * r1;
  const y1 = Math.sin(angle) * r1;
  const x2 = Math.cos(angle + 1.2) * r2;
  const y2 = Math.sin(angle + 1.2) * r2;
  const cx = Math.cos(angle + 0.6) * 80;
  const cy = Math.sin(angle + 0.6) * 80;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function getButterflyRadius(): number {
  const tNorm = (state.value.timeElapsed % state.value.scramblingTimeSec) / Math.max(0.1, state.value.scramblingTimeSec);
  return 35 + tNorm * 95;
}

function getScramblingMarkerX(): number {
  return 200; // Fixed visual marker at middle of curve domain
}

function getOTOCPath(): string {
  let path = 'M 40 50';
  for (let px = 40; px <= 320; px += 10) {
    const fraction = (px - 40) / 280; // 0 to 1
    // Exponential decay curve from 1.0 (y=50) down to 0.0 (y=200)
    const yVal = 50 + 150 * Math.pow(fraction, 2.2);
    path += ` L ${px} ${Math.min(200, yVal).toFixed(1)}`;
  }
  return path;
}

function getCurrentOTOCPointX(): number {
  const fraction = 1.0 - Math.min(1.0, Math.max(0.0, state.value.otocCorrelatorVal));
  return 40 + Math.min(280, Math.pow(fraction, 0.45) * 280);
}

function getCurrentOTOCPointY(): number {
  const f = Math.min(1.0, Math.max(0.0, state.value.otocCorrelatorVal));
  return 200 - f * 150;
}

function updateLoop() {
  holographicChaosEngine.update(0.016);
  state.value = holographicChaosEngine.getState();
  animId = requestAnimationFrame(updateLoop);
}

onMounted(() => {
  achievements.unlock('holographic_chaos_thermalization');
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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(236, 72, 153, 0.15);
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

.chaos-svg {
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
  color: #ec4899;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
}

.slider {
  width: 100%;
  cursor: pointer;
  accent-color: #ec4899;
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
  background: #db2777;
  color: #ffffff;
  border-color: #f472b6;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background: #e11d48;
  border: 1px solid #fb7185;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #be123c;
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

.text-rose { color: #f43f5e; }
.text-amber { color: #f59e0b; }
.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }

.theory-box {
  background: #070c18;
  border: 1px solid #1e293b;
  border-left: 3px solid #ec4899;
  border-radius: 6px;
  padding: 12px 14px;
}

.theory-box h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #f472b6;
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
