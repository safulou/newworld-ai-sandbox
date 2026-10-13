<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { gravitoElectromagnetismEngine, type GEMRegime } from '../engine/gravitoElectromagnetismLenseThirring';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => gravitoElectromagnetismEngine.getState());

const isOpen = computed(() => uiStore.mode === 'gravito-electromagnetism');

const regimes: Array<{ id: GEMRegime; label: string; desc: string }> = [
  { id: 'lense-thirring-frame-dragging', label: '蘭斯-蒂靈時空拖曳進動相', desc: '旋轉大天體非對角度規 g_0i 強制拖曳周圍局域慣性系，自旋陀螺儀經歷千毫角秒級剛性進動' },
  { id: 'gravitomagnetic-relativistic-jet', label: '極區引力磁場超相對論噴流相', desc: '近視界極區極限引力磁剪切張力準直加速雙極超相對論性電漿噴流，勞倫茲因子 γ > 4.5' },
  { id: 'schiff-gyroscopic-geodetic-precession', label: '席夫陀螺儀測地軌道複合歲差相', desc: '軌道測地線曲率歲差與時空拖曳進動疊加 (Ω_Schiff = Ω_geod + Ω_LT)，精確印證廣義相對論' },
  { id: 'newtonian-weak-field-limit', label: '靜態牛頓弱場平庸極限相', desc: '自旋角動量微弱 (J ≈ 0) 或大半徑遠場，引力磁效應衰減至零，退化為經典牛頓引力場' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateJ(val: number) {
  const diff = val - state.value.angularMomentumJScale;
  gravitoElectromagnetismEngine.spinUpAngularMomentum(diff);
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function updateR(val: number) {
  const diff = val - state.value.orbitalRadiusRkm;
  gravitoElectromagnetismEngine.shiftOrbitalRadius(diff);
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function updateV(val: number) {
  const diff = val - state.value.orbitalVelocityVFractionC;
  gravitoElectromagnetismEngine.accelerateOrbitalVelocity(diff);
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function spinUpAction() {
  gravitoElectromagnetismEngine.spinUpAngularMomentum(0.08);
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function shiftRadiusAction() {
  gravitoElectromagnetismEngine.shiftOrbitalRadius(-10.0);
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function triggerJetAction() {
  gravitoElectromagnetismEngine.triggerRelativisticJetSurge();
  achievements.unlock('gravito_electromagnetism_lense_thirring');
}

function reset() {
  gravitoElectromagnetismEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="gem-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧭</span>
          <div>
            <h2>引力電磁學與蘭斯-蒂靈時空拖曳 (Gravito-Electromagnetism & Lense-Thirring)</h2>
            <span class="subtitle">General Relativity GEM, Frame-Dragging Precession, Schiff Gyroscope & Relativistic Jet</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 時空渦旋拖曳與相對論噴流 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="gem-svg">
            <defs>
              <radialGradient id="kerrCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#0369a1" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="jetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#c084fc" />
              </linearGradient>
            </defs>

            <!-- 儀器底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#0ea5e9" stroke-width="1.6" />

            <!-- 左側：自旋天體、時空拖曳螺旋線與極區雙向噴流 -->
            <g transform="translate(145, 150)">
              <!-- 極區超相對論噴流光束 (Jet Beams) -->
              <g v-if="state.relativisticJetLorentzGamma > 2.0" opacity="0.85">
                <polygon points="-8,-25 8,-25 3,-100 -3,-100" fill="url(#jetGrad)">
                  <animate attributeName="opacity" values="0.7;1.0;0.7" dur="1.2s" repeatCount="indefinite" />
                </polygon>
                <polygon points="-8,25 8,25 3,100 -3,100" fill="url(#jetGrad)">
                  <animate attributeName="opacity" values="0.7;1.0;0.7" dur="1.2s" repeatCount="indefinite" />
                </polygon>
              </g>

              <!-- 時空拖曳螺旋力線 (Frame-Dragging Spirals) -->
              <g stroke="#0284c7" stroke-width="1.2" fill="none" opacity="0.65">
                <path d="M 0 0 C 25 15, 55 45, 75 0 C 85 -35, 45 -70, 0 -75 C -45 -75, -80 -35, -75 10 C -70 50, -30 80, 20 80"
                      stroke-dasharray="4 2">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
                </path>
                <circle cx="0" cy="0" r="50" stroke="#38bdf8" stroke-dasharray="3 3" opacity="0.4" />
                <circle cx="0" cy="0" r="75" stroke="#0ea5e9" stroke-dasharray="4 4" opacity="0.3" />
              </g>

              <!-- 中心自旋緻密天體 (Kerr Horizon) -->
              <circle cx="0" cy="0" :r="22 + state.angularMomentumJScale * 6" fill="url(#kerrCenterGlow)" stroke="#38bdf8" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">
                J={{ state.angularMomentumJScale.toFixed(2) }}
              </text>

              <!-- 軌道陀螺儀測試粒子 -->
              <g transform="translate(60, -25)">
                <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5" />
                <!-- 陀螺儀自旋進動向量 -->
                <line x1="0" y1="0" x2="14" y2="-14" stroke="#fbbf24" stroke-width="2" />
                <polygon points="14,-14 10,-10 11,-16" fill="#fbbf24" />
                <text x="8" y="14" fill="#fbbf24" font-size="9">Ω_LT</text>
              </g>
            </g>

            <!-- 右側：引力電磁參數與進動儀表板 -->
            <g transform="translate(295, 45)">
              <rect x="0" y="0" width="205" height="205" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#0ea5e9" stroke-width="1" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold">引力磁與拖曳物理量</text>
              <line x1="14" y1="32" x2="191" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">蘭斯-蒂靈進動 Ω_LT:</text>
              <text x="14" y="74" fill="#38bdf8" font-size="14" font-weight="bold">{{ state.lenseThirringFreqMilliArcsecYr.toFixed(1) }} mas/yr</text>

              <text x="14" y="100" fill="#94a3b8" font-size="10">等效引力磁場 B_g:</text>
              <text x="14" y="119" fill="#0284c7" font-size="14" font-weight="bold">{{ state.gravitomagneticFieldBgTeslaEq.toFixed(2) }} nT eq</text>

              <text x="14" y="145" fill="#94a3b8" font-size="10">時空拖曳速度 v_drag:</text>
              <text x="14" y="165" fill="#f59e0b" font-size="14" font-weight="bold">{{ state.frameDraggingVelocityKmS.toFixed(1) }} km/s</text>

              <text x="14" y="190" fill="#94a3b8" font-size="10">噴流勞倫茲因子 γ: <b>{{ state.relativisticJetLorentzGamma.toFixed(2) }}</b></text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 245)">
              <rect x="0" y="0" width="270" height="28" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#0ea5e9" stroke-width="1" />
              <text x="12" y="18" fill="#38bdf8" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">蘭斯-蒂靈進動率</span>
            <span class="m-val highlight">{{ state.lenseThirringFreqMilliArcsecYr.toFixed(1) }}</span>
            <span class="m-sub">mas/yr (時空拖曳角速度)</span>
          </div>

          <div class="metric-card">
            <span class="m-label">等效引力磁場 (B_g)</span>
            <span class="m-val accent">{{ state.gravitomagneticFieldBgTeslaEq.toFixed(2) }} nT</span>
            <span class="m-sub">自旋角動量誘導磁場</span>
          </div>

          <div class="metric-card">
            <span class="m-label">時空拖曳速度 (v_drag)</span>
            <span class="m-val">{{ state.frameDraggingVelocityKmS.toFixed(1) }} km/s</span>
            <span class="m-sub">局域慣性系切向渦旋速度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">噴流勞倫茲因子 (γ)</span>
            <span class="m-val">{{ state.relativisticJetLorentzGamma.toFixed(2) }}</span>
            <span class="m-sub">極區超相對論噴流加速</span>
          </div>

          <div class="metric-card">
            <span class="m-label">測地歲差率 (Ω_geod)</span>
            <span class="m-val">{{ state.geodeticPrecessionArcsecYr.toFixed(1) }} "/yr</span>
            <span class="m-sub">席夫陀螺儀時空曲率歲差</span>
          </div>

          <div class="metric-card">
            <span class="m-label">自旋角動量比例 (J)</span>
            <span class="m-val">{{ state.angularMomentumJScale.toFixed(2) }}</span>
            <span class="m-sub">克爾天體極限角動量比</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>自旋角動量 J (0.00 ~ 0.99 J_max): <b>{{ state.angularMomentumJScale.toFixed(2) }}</b></label>
              <input
                type="range"
                min="0.00"
                max="0.99"
                step="0.02"
                :value="state.angularMomentumJScale"
                @input="updateJ(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>軌道半徑 r (10.0 ~ 1000.0 km): <b>{{ state.orbitalRadiusRkm.toFixed(1) }} km</b></label>
              <input
                type="range"
                min="10.0"
                max="1000.0"
                step="10.0"
                :value="state.orbitalRadiusRkm"
                @input="updateR(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>軌道運行速度 v / c (0.01 ~ 0.85): <b>{{ state.orbitalVelocityVFractionC.toFixed(2) }} c</b></label>
              <input
                type="range"
                min="0.01"
                max="0.85"
                step="0.02"
                :value="state.orbitalVelocityVFractionC"
                @input="updateV(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="spinUpAction">
              🔄 旋量自旋加速 (+0.08 J)
            </button>
            <button class="action-btn cyan" @click="shiftRadiusAction">
              🧭 軌道向內逼近 (-10 km)
            </button>
            <button class="action-btn secondary" @click="triggerJetAction">
              ⚡ 激發極區超相對論噴流 (γ↑)
            </button>
            <button class="action-btn reset" @click="reset">
              🔄 復位預設
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.gem-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(10, 20, 30, 0.92);
  border: 1px solid rgba(14, 165, 233, 0.35);
  box-shadow: 0 0 35px rgba(14, 165, 233, 0.25);
  border-radius: 16px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title-group .icon {
  font-size: 32px;
}

h2 {
  font-size: 19px;
  font-weight: 700;
  color: #38bdf8;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  display: flex;
  justify-content: center;
}

.gem-svg {
  width: 100%;
  height: auto;
  max-height: 270px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.m-val.highlight {
  color: #38bdf8;
}

.m-val.accent {
  color: #0284c7;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
}

.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-row label {
  font-size: 12px;
  color: #cbd5e1;
}

.slider-row label b {
  color: #38bdf8;
}

.slider-row input[type="range"] {
  accent-color: #0ea5e9;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1;
  min-width: 130px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: rgba(14, 165, 233, 0.2);
  border-color: #0ea5e9;
  color: #38bdf8;
}

.action-btn.primary:hover {
  background: rgba(14, 165, 233, 0.35);
}

.action-btn.cyan {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #38bdf8;
}

.action-btn.cyan:hover {
  background: rgba(6, 182, 212, 0.35);
}

.action-btn.secondary {
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #c084fc;
}

.action-btn.secondary:hover {
  background: rgba(168, 85, 247, 0.35);
}

.action-btn.reset {
  background: rgba(148, 163, 184, 0.15);
  border-color: #64748b;
  color: #cbd5e1;
}

.action-btn.reset:hover {
  background: rgba(148, 163, 184, 0.25);
}
</style>
