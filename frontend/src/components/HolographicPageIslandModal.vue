<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🏝️</span>
          <div>
            <h2>全息佩奇曲線與量子極值島嶼</h2>
            <p class="subtitle">Holographic Many-Body Page Island & Entanglement Thermalization</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="page-svg">
            <defs>
              <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#475569" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9" />
              </linearGradient>
              <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f97316" stop-opacity="0.75" />
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0.4" />
              </linearGradient>
              <filter id="glowIsland">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="#090d16" rx="8" />

            <!-- Left Panel: Black Hole Spacetime & Quantum Island Geometry -->
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="340" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="170" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                黑洞視界與量子極值島嶼 (QES)
              </text>

              <!-- Central Singularity -->
              <circle cx="170" cy="160" r="14" fill="#000" stroke="#f43f5e" stroke-width="2" />
              <text x="170" y="164" fill="#f43f5e" font-size="9" text-anchor="middle" font-weight="bold">奇異點</text>

              <!-- Event Horizon Circle (shrinking with evaporation) -->
              <circle
                cx="170"
                cy="160"
                :r="Math.max(20, 110 * (1 - state.evaporationProgress * 0.7))"
                fill="none"
                stroke="#64748b"
                stroke-width="2"
                stroke-dasharray="4 3"
              />
              <text x="170" :y="160 - Math.max(20, 110 * (1 - state.evaporationProgress * 0.7)) - 6" fill="#94a3b8" font-size="10" text-anchor="middle">
                事件視界 rH (SBH = {{ state.bekensteinEntropy.toFixed(0) }})
              </text>

              <!-- Quantum Extremal Island (emerges inside horizon when hasIslandFormed) -->
              <g v-if="state.hasIslandFormed">
                <circle
                  cx="170"
                  cy="160"
                  :r="Math.max(16, 110 * (1 - state.evaporationProgress * 0.7) * state.islandRadiusFraction)"
                  fill="url(#islandGrad)"
                  stroke="#f97316"
                  stroke-width="2.5"
                  filter="url(#glowIsland)"
                />
                <text x="170" :y="160 + Math.max(16, 110 * (1 - state.evaporationProgress * 0.7) * state.islandRadiusFraction) + 14" fill="#fb923c" font-size="10" text-anchor="middle" font-weight="bold">
                  糾纏島嶼 I (QES 邊界)
                </text>
              </g>

              <!-- Outgoing Hawking radiation waves -->
              <g v-for="r in 3" :key="'rad' + r">
                <circle
                  cx="170"
                  cy="160"
                  :r="115 + r * 18"
                  fill="none"
                  stroke="#38bdf8"
                  :stroke-opacity="0.5 - r * 0.12"
                  stroke-width="1.5"
                  stroke-dasharray="2 3"
                />
              </g>
              <text x="170" y="305" fill="#38bdf8" font-size="10" text-anchor="middle">
                {{ state.hasIslandFormed ? '✨ 島嶼糾纏復原: 么正性維持' : '⚠️ 早期熱輻射 (無島嶼)' }}
              </text>
            </g>

            <!-- Right Panel: The Page Curve (Unitary vs Naive Hawking) -->
            <g transform="translate(400, 20)">
              <rect x="0" y="0" width="370" height="320" fill="#0f172a" stroke="#1e293b" rx="6" />
              <text x="185" y="25" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="bold">
                全息佩奇曲線 (Page Curve) 與資訊佯謬消解
              </text>

              <!-- Axis -->
              <line x1="40" y1="270" x2="340" y2="270" stroke="#334155" stroke-width="1.5" />
              <line x1="50" y1="40" x2="50" y2="280" stroke="#334155" stroke-width="1.5" />
              <text x="340" y="290" fill="#64748b" font-size="10" text-anchor="end">時間 τ = t / tevap</text>
              <text x="40" y="45" fill="#64748b" font-size="10" text-anchor="end">S (kB)</text>

              <!-- Page Time Vertical Marker -->
              <line :x1="50 + state.pageTimeProgress * 270" y1="50" :x2="50 + state.pageTimeProgress * 270" y2="270" stroke="#facc15" stroke-width="1.5" stroke-dasharray="3 3" />
              <text :x="50 + state.pageTimeProgress * 270" y="45" fill="#facc15" font-size="9" text-anchor="middle">
                佩奇時間 tPage
              </text>

              <!-- Naive Hawking Non-Unitary Entropy Curve (Red dashed) -->
              <path :d="getNaiveHawkingCurve()" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="3 3" fill="none" />
              <text x="310" y="75" fill="#f43f5e" font-size="9" text-anchor="end">佯謬熱態 S(t)</text>

              <!-- Bekenstein-Hawking S_BH Area Curve (Blue dotted) -->
              <path :d="getBekensteinCurve()" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="2 2" fill="none" />
              <text x="65" y="75" fill="#60a5fa" font-size="9">SBH(t)</text>

              <!-- Actual Unitary Page Curve (Cyan/Green Solid with Glow) -->
              <path :d="getPageCurve()" stroke="#34d399" stroke-width="3" fill="none" filter="url(#glowIsland)" />

              <!-- Current Time Cursor -->
              <line :x1="50 + state.evaporationProgress * 270" y1="50" :x2="50 + state.evaporationProgress * 270" y2="270" stroke="#38bdf8" stroke-width="2" />
              <circle :cx="50 + state.evaporationProgress * 270" :cy="getCurrentEntropyY()" r="5" fill="#38bdf8" />
              <text :x="50 + state.evaporationProgress * 270" :y="getCurrentEntropyY() - 8" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">
                S = {{ state.unitaryRadiationEntropy.toFixed(0) }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card highlight">
            <span class="label">實際么正輻射熵 S_rad</span>
            <span class="value green">{{ state.unitaryRadiationEntropy.toFixed(1) }} kB</span>
          </div>
          <div class="metric-card">
            <span class="label">黑洞視界熵 S_BH</span>
            <span class="value cyan">{{ state.bekensteinEntropy.toFixed(1) }} kB</span>
          </div>
          <div class="metric-card">
            <span class="label">佯謬熱態輻射熵 S_Hawk</span>
            <span class="value rose">{{ state.naiveHawkingEntropy.toFixed(1) }} kB</span>
          </div>
          <div class="metric-card">
            <span class="label">佩奇時間進度 τ_Page</span>
            <span class="value yellow">{{ (state.pageTimeProgress * 100).toFixed(1) }}% (相變點)</span>
          </div>
          <div class="metric-card">
            <span class="label">量子島嶼半徑比 r_I / r_H</span>
            <span class="value orange">{{ state.hasIslandFormed ? (state.islandRadiusFraction * 100).toFixed(1) + '%' : '尚未湧現' }}</span>
          </div>
          <div class="metric-card">
            <span class="label">量子爬亂時間 t_scr</span>
            <span class="value purple">{{ state.scramblingTimeMs.toFixed(1) }} ms</span>
          </div>
        </div>

        <!-- Sliders -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>黑洞蒸發進度 τ = t / tevap</span>
              <span class="slider-val">{{ (state.evaporationProgress * 100).toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              :value="state.evaporationProgress"
              @input="updateProgress(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0% (初期黑洞)</span>
              <span>50% (佩奇時間)</span>
              <span>100% (完全蒸發)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>初始黑洞貝肯斯坦熵 S0</span>
              <span class="slider-val">{{ state.initialEntropyS0.toFixed(0) }} kB</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              :value="state.initialEntropyS0"
              @input="updateS0(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>200 kB</span>
              <span>1000 kB (標準)</span>
              <span>3000 kB</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>全息輻射浴中央荷 c</span>
              <span class="slider-val">{{ state.cftCentralChargeC.toFixed(0) }}</span>
            </div>
            <input
              type="range"
              min="6"
              max="60"
              step="2"
              :value="state.cftCentralChargeC"
              @input="updateCentralCharge(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>6</span>
              <span>24 (玻色弦浴)</span>
              <span>60</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerPageThreshold">
            ⚡ 一鍵跳轉佩奇相變臨界點 (τ = 50%)
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉體制: {{ getRegimeLabel(state.regime) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { holographicPageIslandEngine, HolographicPageIslandState, PageIslandRegime } from '@/engine/holographicPageIslandThermalization';
import { useUIStore } from '@/stores/ui';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const state = ref<HolographicPageIslandState>(holographicPageIslandEngine.getState());
let timer: number | null = null;

onMounted(() => {
  achievements.unlock('holographic_page_island_thermalization');
  timer = window.setInterval(() => {
    state.value = holographicPageIslandEngine.getState();
  }, 50);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleClose() {
  uiStore.closeOverlay();
}

function updateProgress(val: number) {
  holographicPageIslandEngine.setEvaporationProgress(val);
  state.value = holographicPageIslandEngine.getState();
  achievements.unlock('holographic_page_island_thermalization');
}

function updateS0(val: number) {
  holographicPageIslandEngine.setInitialEntropy(val);
  state.value = holographicPageIslandEngine.getState();
}

function updateCentralCharge(val: number) {
  holographicPageIslandEngine.setCentralCharge(val);
  state.value = holographicPageIslandEngine.getState();
  achievements.unlock('holographic_page_island_thermalization');
}

function triggerPageThreshold() {
  holographicPageIslandEngine.triggerPageTransition();
  state.value = holographicPageIslandEngine.getState();
  achievements.unlock('holographic_page_island_thermalization');
}

function cycleRegime() {
  holographicPageIslandEngine.cycleRegime();
  state.value = holographicPageIslandEngine.getState();
  achievements.unlock('holographic_page_island_thermalization');
}

function getRegimeLabel(r: PageIslandRegime): string {
  switch (r) {
    case 'early-hawking-radiation': return '早期霍金輻射相';
    case 'page-threshold-qes': return '佩奇臨界相變相';
    case 'island-unitary-recovery': return '量子島嶼么正相';
    case 'complete-evaporation-remnant': return '終結熱化殘留相';
  }
}

// Page curve SVG helpers
function getBekensteinCurve(): string {
  let path = '';
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const s_bh = state.value.initialEntropyS0 * Math.pow(1.0 - t, 2);
    const x = 50 + t * 270;
    const y = 270 - (s_bh / state.value.initialEntropyS0) * 200;
    if (i === 0) path += `M ${x} ${y}`;
    else path += ` L ${x} ${y}`;
  }
  return path;
}

function getNaiveHawkingCurve(): string {
  let path = '';
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const s_h = state.value.initialEntropyS0 * t;
    const x = 50 + t * 270;
    const y = 270 - (s_h / state.value.initialEntropyS0) * 200;
    if (i === 0) path += `M ${x} ${y}`;
    else path += ` L ${x} ${y}`;
  }
  return path;
}

function getPageCurve(): string {
  let path = '';
  const S0 = state.value.initialEntropyS0;
  const c = state.value.cftCentralChargeC;

  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const s_h = S0 * t;
    const s_bh = S0 * Math.pow(1.0 - t, 2);
    const s_island = s_bh + (c / 6.0) * Math.log(1.0 + 10.0 * t);
    const s_rad = Math.min(s_h, s_island);

    const x = 50 + t * 270;
    const y = 270 - (s_rad / S0) * 200;
    if (i === 0) path += `M ${x} ${y}`;
    else path += ` L ${x} ${y}`;
  }
  return path;
}

function getCurrentEntropyY(): number {
  const S0 = state.value.initialEntropyS0;
  return 270 - (state.value.unitaryRadiationEntropy / S0) * 200;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 96vw;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap .icon {
  font-size: 28px;
}

.title-wrap h2 {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.title-wrap .subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
}
.close-btn:hover {
  color: #f1f5f9;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.viz-container {
  width: 100%;
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.page-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-card.highlight {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.metric-card .label {
  font-size: 11px;
  color: #94a3b8;
}

.metric-card .value {
  font-size: 15px;
  font-weight: 700;
  font-family: monospace;
}

.value.green { color: #10b981; }
.value.cyan { color: #38bdf8; }
.value.rose { color: #f43f5e; }
.value.yellow { color: #facc15; }
.value.orange { color: #f97316; }
.value.purple { color: #c084fc; }

.controls-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 16px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
}

.slider-val {
  font-family: monospace;
  font-weight: 700;
  color: #38bdf8;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.slider-hints {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
}

.actions-row {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: #059669;
  color: #fff;
}
.btn-primary:hover {
  background: #047857;
}

.btn-secondary {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}
.btn-secondary:hover {
  background: #334155;
  color: #fff;
}
</style>
