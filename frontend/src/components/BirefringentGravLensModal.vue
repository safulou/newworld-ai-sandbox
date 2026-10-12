<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { birefringentGravLensEngine, type BirefringentLensRegime } from '../engine/birefringentGravLens';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => birefringentGravLensEngine.getState());

const isOpen = computed(() => uiStore.mode === 'birefringent-lens');

const regimes: Array<{ id: BirefringentLensRegime; label: string; desc: string }> = [
  { id: 'gravitational-vacuum-birefringence', label: '引力真空雙折射', desc: '左右旋圓偏振測地線分裂' },
  { id: 'pancharatnam-berry-geodesic', label: '潘查拉特納姆幾何相', desc: '天球偏振角累積與龐加萊球迴圈' },
  { id: 'einstein-polarized-twin-rings', label: '雙偏振愛因斯坦環', desc: '次級光子環正交偏振干涉像' },
  { id: 'weyl-curvature-parity-violation', label: '外爾曲率宇稱破缺', desc: '手性光子引力耦合與色散延遲' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateMass(val: number) {
  birefringentGravLensEngine.setParameters({ blackHoleMassSolar: val });
}

function updateSpin(val: number) {
  birefringentGravLensEngine.setParameters({ dimensionlessSpinAOverM: val });
}

function updateCoupling(val: number) {
  birefringentGravLensEngine.setParameters({ chiralWeylCouplingAlpha: val });
}

function updateImpact(val: number) {
  birefringentGravLensEngine.setParameters({ impactParameterRg: val });
}

function updateFreq(val: number) {
  birefringentGravLensEngine.setParameters({ photonFrequencyGhz: val });
}

function selectRegime(regime: BirefringentLensRegime) {
  birefringentGravLensEngine.setParameters({ regime });
  achievements.unlock('birefringent_grav_lens');
}

function pulseProbe() {
  birefringentGravLensEngine.pulsePolarizationProbe();
  achievements.unlock('birefringent_grav_lens');
}

function toggleCoupling() {
  birefringentGravLensEngine.toggleChiralCoupling();
  achievements.unlock('birefringent_grav_lens');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="bgl-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🔭</span>
          <div>
            <h2>雙折射引力透鏡干涉儀 (Birefringent Grav Lens)</h2>
            <span class="subtitle">Gravitational Vacuum Birefringence, Geometric Phase & Twin Einstein Rings</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 雙折射光路與愛因斯坦環分裂 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="bgl-svg">
            <defs>
              <radialGradient id="bhShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="65%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="lcpBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="rcpBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#be123c" />
              </linearGradient>
            </defs>

            <!-- 深空背景 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#040612" stroke="#2563eb" stroke-width="1.8" />

            <!-- 透鏡克爾黑洞核心與事件視界 -->
            <g transform="translate(270, 160)">
              <circle cx="0" cy="0" r="55" fill="url(#bhShadow)" />
              <circle cx="0" cy="0" r="28" fill="#020617" stroke="#3b82f6" stroke-width="2" />

              <!-- 愛因斯坦雙偏振環像 (Twin Einstein Rings) -->
              <!-- 左旋偏振環 (Cyan LCP) -->
              <ellipse cx="0" cy="0" rx="80" ry="76" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8 5" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
              </ellipse>
              <!-- 右旋偏振環 (Rose RCP) - 微分半徑分裂 -->
              <ellipse cx="0" cy="0" :rx="80 + state.birefringentSplittingMicroArcsec * 0.8" :ry="76 + state.birefringentSplittingMicroArcsec * 0.8" fill="none" stroke="#f43f5e" stroke-width="2.2" stroke-dasharray="6 6" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="22s" repeatCount="indefinite" />
              </ellipse>
            </g>

            <!-- 偏折測地線光路 (Geodesic Beams) -->
            <!-- LCP 左旋光束路徑 (Blue) -->
            <path d="M 45 100 Q 220 90, 270 120 T 495 140" fill="none" stroke="url(#lcpBeam)" stroke-width="3" stroke-dasharray="14 7">
              <animate attributeName="stroke-dashoffset" values="0;-100" dur="1.8s" repeatCount="indefinite" />
            </path>
            <!-- RCP 右旋光束路徑 (Rose) -->
            <path d="M 45 220 Q 220 230, 270 200 T 495 180" fill="none" stroke="url(#rcpBeam)" stroke-width="3" stroke-dasharray="14 7">
              <animate attributeName="stroke-dashoffset" values="0;-100" dur="2.1s" repeatCount="indefinite" />
            </path>

            <!-- 左側光源標註 -->
            <text x="50" y="55" fill="#38bdf8" font-size="11" font-weight="bold">
              左旋圓偏振 (LCP) | 右旋圓偏振 (RCP)
            </text>
            <text x="50" y="75" fill="#94a3b8" font-size="10">
              透鏡質量 M = {{ state.blackHoleMassSolar }} M_☉ | 克爾自旋 a/M = {{ state.dimensionlessSpinAOverM.toFixed(3) }}
            </text>

            <!-- 右側探測器偏振微分資訊 -->
            <text x="495" y="275" fill="#facc15" font-size="10" text-anchor="end">
              雙折射分裂: {{ state.birefringentSplittingMicroArcsec.toFixed(1) }} μas | 幾何時延: {{ state.differentialDelayPicoSec.toFixed(2) }} ps
            </text>
            <text x="495" y="255" fill="#c084fc" font-size="10" text-anchor="end">
              偏振旋轉角 Δθ = {{ state.polarizationRotationAngleDeg.toFixed(1) }}° (Φ_geom = {{ state.geometricBerryPhaseRad.toFixed(2) }} rad)
            </text>
          </svg>
        </div>

        <!-- 4 大體制按鈕 -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            class="regime-btn"
            :class="{ active: state.regime === r.id }"
            @click="selectRegime(r.id)"
          >
            <span class="regime-name">{{ r.label }}</span>
            <span class="regime-desc">{{ r.desc }}</span>
          </button>
        </div>

        <!-- 即時物理指標儀表盤 -->
        <div class="metric-grid">
          <div class="metric-item">
            <span class="m-label">雙折射分裂角</span>
            <span class="m-val text-cyan">{{ state.birefringentSplittingMicroArcsec.toFixed(1) }} μas</span>
          </div>
          <div class="metric-item">
            <span class="m-label">偏振旋角 Δθ</span>
            <span class="m-val text-purple">{{ state.polarizationRotationAngleDeg.toFixed(1) }}°</span>
          </div>
          <div class="metric-item">
            <span class="m-label">微分時間延遲</span>
            <span class="m-val text-emerald">{{ state.differentialDelayPicoSec.toFixed(2) }} ps</span>
          </div>
          <div class="metric-item">
            <span class="m-label">幾何貝里相 Φ</span>
            <span class="m-val text-cyan">{{ state.geometricBerryPhaseRad.toFixed(3) }} rad</span>
          </div>
          <div class="metric-item">
            <span class="m-label">愛因斯坦環半徑</span>
            <span class="m-val">{{ state.einsteinRingRadiusMicroArcsec.toFixed(1) }} μas</span>
          </div>
          <div class="metric-item">
            <span class="m-label">雙像消光比</span>
            <span class="m-val text-emerald">{{ (state.polarizationContrastRatio * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <!-- 參數控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>透鏡黑洞質量 (M, 太陽質量)</span>
              <span class="val">{{ state.blackHoleMassSolar.toFixed(0) }} M_☉</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="200.0"
              step="5.0"
              :value="state.blackHoleMassSolar"
              @input="updateMass(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>克爾自旋參數 (a/M)</span>
              <span class="val">{{ state.dimensionlessSpinAOverM.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.998"
              step="0.01"
              :value="state.dimensionlessSpinAOverM"
              @input="updateSpin(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>外爾手性耦合常數 (α_grav)</span>
              <span class="val">{{ state.chiralWeylCouplingAlpha.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.2"
              :value="state.chiralWeylCouplingAlpha"
              @input="updateCoupling(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>測地線衝擊參數 (b, R_g)</span>
              <span class="val">{{ state.impactParameterRg.toFixed(1) }} R_g</span>
            </div>
            <input
              type="range"
              min="2.5"
              max="30.0"
              step="0.5"
              :value="state.impactParameterRg"
              @input="updateImpact(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>探針光子頻率 (ν, GHz)</span>
              <span class="val">{{ state.photonFrequencyGhz.toFixed(0) }} GHz</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="600.0"
              step="10.0"
              :value="state.photonFrequencyGhz"
              @input="updateFreq(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="pulseProbe">
            ⚡ 發射雙偏振光子幾何相位探針
          </button>
          <button class="action-btn secondary" @click="toggleCoupling">
            🔄 切換宇稱破缺外爾手性耦合 ⇄ 幾何相
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.bgl-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(10, 18, 40, 0.95), rgba(4, 8, 24, 0.98));
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group .icon {
  font-size: 28px;
}

.title-group h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #38bdf8, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.content-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.bgl-svg {
  width: 100%;
  height: auto;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
}

.regime-btn.active {
  background: rgba(59, 130, 246, 0.18);
  border-color: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 0.7rem;
  color: #94a3b8;
}

.m-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
}

.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-emerald { color: #34d399; }

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.slider-header .val {
  font-weight: 700;
  color: #3b82f6;
}

input[type="range"] {
  width: 100%;
  accent-color: #3b82f6;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #1d4ed8, #2563eb);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.action-btn.secondary:hover {
  background: rgba(59, 130, 246, 0.15);
}
</style>
