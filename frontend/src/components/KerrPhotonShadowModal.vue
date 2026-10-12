<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { kerrPhotonShadowEngine, type KerrShadowRegime } from '../engine/kerrPhotonShadow';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => kerrPhotonShadowEngine.getState());

const isOpen = computed(() => uiStore.mode === 'kerr-shadow');

const regimes: Array<{ id: KerrShadowRegime; label: string; desc: string }> = [
  { id: 'extremal-d-shadow', label: '極端 D 型陰影', desc: '自旋 a→M 順行側非對稱壓扁' },
  { id: 'photon-ring-multiloop', label: '光子次環收斂', desc: '指數衰減 w_n ~ exp(-n γ)' },
  { id: 'frame-dragging-ergosphere', label: '能層拖曳發電', desc: '彭羅斯超輻射負能量粒子萃取' },
  { id: 'shadow-asymmetry-metric', label: '幾何非對稱相', desc: '天球 Bardeen (α, β) 臨界線' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateSpin(val: number) {
  kerrPhotonShadowEngine.setParameters({ kerrSpinParameterA: val });
}

function updateMass(val: number) {
  kerrPhotonShadowEngine.setParameters({ blackHoleMassSolar: val });
}

function updateInc(val: number) {
  kerrPhotonShadowEngine.setParameters({ observerInclinationDeg: val });
}

function updateDisk(val: number) {
  kerrPhotonShadowEngine.setParameters({ accretionDiskRadiusRg: val });
}

function selectRegime(regime: KerrShadowRegime) {
  kerrPhotonShadowEngine.setParameters({ regime });
  achievements.unlock('kerr_photon_shadow');
}

function pulseErgo() {
  kerrPhotonShadowEngine.pulseErgosphereExtraction();
  achievements.unlock('kerr_photon_shadow');
}

function stepInc() {
  kerrPhotonShadowEngine.stepInclinationAngle(15.0);
  achievements.unlock('kerr_photon_shadow');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="shadow-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">🕳️</span>
          <div>
            <h2>克爾黑洞極端光子球與事件視界全息陰影重構陣列</h2>
            <p class="subtitle">Kerr Extremal Photon Sphere & Event Horizon Holographic Shadow Reconstruction Array</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 天球巴丁面陰影與相對論光子環視覺化 -->
        <section class="visualizer-card">
          <div class="vis-header">
            <h3>天球巴丁坐標平面 (α, β) 與都卜勒增強吸積光環</h3>
            <span class="badge" :class="{ extremal: state.kerrSpinParameterA > 0.9 }">
              {{ state.kerrSpinParameterA > 0.9 ? `極端克爾 (a = ${state.kerrSpinParameterA})` : `次極端 (a = ${state.kerrSpinParameterA})` }}
            </span>
          </div>

          <div class="svg-container">
            <svg viewBox="0 0 540 260" class="shadow-svg">
              <defs>
                <radialGradient id="shadowVoid" cx="45%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#000000" />
                  <stop offset="85%" stop-color="#02040a" />
                  <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.3" />
                </radialGradient>
                <linearGradient id="diskBeaming" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" /> <!-- 藍移順行接近側 -->
                  <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.3" /> <!-- 紅移遠離側 -->
                </linearGradient>
                <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- 吸積盤引力透鏡背景光弧 (上弧與下弧) -->
              <ellipse cx="270" cy="130" rx="210" ry="60" fill="none" stroke="url(#diskBeaming)" stroke-width="12" opacity="0.6" />
              <ellipse cx="270" cy="130" rx="170" ry="45" fill="none" stroke="#f59e0b" stroke-width="4" opacity="0.4" />

              <!-- 能層 (Ergosphere) 外輪廓 -->
              <ellipse cx="270" cy="130" rx="100" ry="85" fill="none" stroke="#06b6d4" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.5" />

              <!-- 克爾 D 型非對稱黑洞陰影核心 -->
              <!-- 順行側 (右側) 因極限拖曳變平，形成經典 D 字型幾何 -->
              <path
                :d="`M 270 50 C ${330 - 35 * state.kerrSpinParameterA} 50, ${355 - 45 * state.kerrSpinParameterA} 90, ${355 - 45 * state.kerrSpinParameterA} 130 C ${355 - 45 * state.kerrSpinParameterA} 170, ${330 - 35 * state.kerrSpinParameterA} 210, 270 210 C 190 210, 180 170, 180 130 C 180 90, 190 50, 270 50 Z`"
                fill="url(#shadowVoid)"
                stroke="#6366f1"
                stroke-width="1.5"
              />

              <!-- 第一級相對論光子環 (n=1 Photon Ring) -->
              <path
                :d="`M 270 55 C ${325 - 32 * state.kerrSpinParameterA} 55, ${348 - 42 * state.kerrSpinParameterA} 92, ${348 - 42 * state.kerrSpinParameterA} 130 C ${348 - 42 * state.kerrSpinParameterA} 168, ${325 - 32 * state.kerrSpinParameterA} 205, 270 205 C 195 205, 186 168, 186 130 C 186 92, 195 55, 270 55 Z`"
                fill="none"
                stroke="#e0e7ff"
                stroke-width="2.2"
                filter="url(#ringGlow)"
              />

              <!-- 第二級極窄光子環 (n=2 Sub-ring) -->
              <path
                :d="`M 270 58 C ${322 - 30 * state.kerrSpinParameterA} 58, ${344 - 40 * state.kerrSpinParameterA} 94, ${344 - 40 * state.kerrSpinParameterA} 130 C ${344 - 40 * state.kerrSpinParameterA} 166, ${322 - 30 * state.kerrSpinParameterA} 202, 270 202 C 198 202, 190 166, 190 130 C 190 94, 198 58, 270 58 Z`"
                fill="none"
                stroke="#38bdf8"
                stroke-width="1.2"
                opacity="0.8"
              />

              <!-- 標註文字 -->
              <text x="30" y="30" fill="#94a3b8" font-size="10" font-family="monospace">
                外事件視界 r_+ = {{ state.outerHorizonRg }} r_g | 順行光子球 r_ph^- = {{ state.photonSphereProgradeRg }} r_g
              </text>
              <text x="30" y="48" fill="#64748b" font-size="9" font-family="monospace">
                李雅普諾夫指數 γ = {{ state.lyapunovExponent }} | 陰影截面 A = {{ state.shadowAreaRg2 }} r_g² | 非對稱比 D = {{ state.shadowAsymmetryRatio }}
              </text>
              <text x="100" y="135" fill="#38bdf8" font-size="8.5">都卜勒藍移光瓣</text>
              <text x="400" y="135" fill="#f43f5e" font-size="8.5">紅移漸弱光瓣</text>
            </svg>
          </div>
        </section>

        <!-- 關鍵物理指標網格 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">無量綱自旋參數 a/M</span>
            <span class="m-value text-cyan">{{ state.kerrSpinParameterA.toFixed(3) }}</span>
            <span class="m-sub">極限閾值 1.000</span>
          </div>

          <div class="metric-box">
            <span class="m-label">光子次環收斂指數 γ</span>
            <span class="m-value text-green">{{ state.lyapunovExponent }}</span>
            <span class="m-sub">Lyapunov 徑向放大率</span>
          </div>

          <div class="metric-box">
            <span class="m-label">陰影非對稱度 D_asym</span>
            <span class="m-value text-emerald">{{ state.shadowAsymmetryRatio.toFixed(3) }}</span>
            <span class="m-sub">D 型橫向幾何壓縮率</span>
          </div>

          <div class="metric-box">
            <span class="m-label">彭羅斯發電功率 P_ergo</span>
            <span class="m-value text-amber">{{ state.penroseExtractionPowerMw.toFixed(0) }} <small>MW</small></span>
            <span class="m-sub">能層超輻射輸出</span>
          </div>
        </section>

        <!-- 相態選擇 -->
        <section class="regimes-card">
          <h3>克爾天體物理相態 (Kerr Shadow Regimes)</h3>
          <div class="regime-buttons">
            <button
              v-for="r in regimes"
              :key="r.id"
              class="regime-btn"
              :class="{ active: state.regime === r.id }"
              @click="selectRegime(r.id)"
            >
              <span class="btn-name">{{ r.label }}</span>
              <span class="btn-desc">{{ r.desc }}</span>
            </button>
          </div>
        </section>

        <!-- 控制滑桿與操作按鈕 -->
        <section class="controls-card">
          <h3>黑洞幾何參數與觀測姿態調諧</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>無量綱自旋 a/M:</span>
                <b>{{ state.kerrSpinParameterA.toFixed(3) }}</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.998"
                step="0.005"
                :value="state.kerrSpinParameterA"
                @input="updateSpin(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>黑洞質量 M:</span>
                <b>{{ state.blackHoleMassSolar.toFixed(1) }} M☉</b>
              </div>
              <input
                type="range"
                min="3.0"
                max="100.0"
                step="1.0"
                :value="state.blackHoleMassSolar"
                @input="updateMass(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>觀測傾角 θ_o:</span>
                <b>{{ state.observerInclinationDeg.toFixed(1) }}°</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="89.0"
                step="1.0"
                :value="state.observerInclinationDeg"
                @input="updateInc(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>吸積盤外徑 R_disk:</span>
                <b>{{ state.accretionDiskRadiusRg.toFixed(1) }} r_g</b>
              </div>
              <input
                type="range"
                min="6.0"
                max="50.0"
                step="1.0"
                :value="state.accretionDiskRadiusRg"
                @input="updateDisk(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn ergo-btn" @click="pulseErgo">
              ⚡ 彭羅斯超輻射發電脈衝 (Penrose Harvest)
            </button>
            <button class="action-btn step-btn" @click="stepInc">
              📐 步進觀測傾角 (+15°)
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.shadow-modal {
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f1f5f9;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.title-cluster {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-cluster .icon {
  font-size: 26px;
}

.title-cluster h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #f8fafc;
}

.title-cluster .subtitle {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #1e293b;
  color: #fff;
}

.modal-body {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visualizer-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.vis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vis-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.badge.extremal {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
  border-color: rgba(236, 72, 153, 0.4);
}

.svg-container {
  display: flex;
  justify-content: center;
  background: #040711;
  border-radius: 8px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.shadow-svg {
  width: 100%;
  max-height: 220px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric-box {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.m-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
}

.m-value small {
  font-size: 0.75rem;
  font-weight: normal;
  color: #94a3b8;
}

.m-sub {
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 4px;
}

.text-cyan { color: #38bdf8; }
.text-green { color: #34d399; }
.text-emerald { color: #10b981; }
.text-amber { color: #fbbf24; }

.regimes-card, .controls-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.regimes-card h3, .controls-card h3 {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #cbd5e1;
}

.regime-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.regime-btn {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #6366f1;
}

.regime-btn.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.btn-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
}

.btn-desc {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
}

.sliders-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #94a3b8;
}

.slider-header b {
  color: #6366f1;
  font-family: monospace;
}

input[type="range"] {
  accent-color: #6366f1;
}

.actions-row {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.ergo-btn {
  background: #4f46e5;
  color: #fff;
}

.ergo-btn:hover {
  background: #4338ca;
}

.step-btn {
  background: #0284c7;
  color: #fff;
}

.step-btn:hover {
  background: #0369a1;
}

@media (max-width: 768px) {
  .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
