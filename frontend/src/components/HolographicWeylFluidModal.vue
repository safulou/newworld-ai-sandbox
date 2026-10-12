<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicWeylFluidEngine, type HoloWeylFluidRegime } from '../engine/holographicWeylFluid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => holographicWeylFluidEngine.getState());

const isOpen = computed(() => uiStore.mode === 'holo-weyl-fluid');

const regimes: Array<{ id: HoloWeylFluidRegime; label: string; desc: string }> = [
  { id: 'kss-minimal-viscosity-fluid', label: 'KSS 極小黏滯流態', desc: 'η/s = 1/(4π) 宇宙近完美流體' },
  { id: 'holographic-anomalous-hall', label: '全息拓撲反常霍爾', desc: '體陳-西蒙斯幾何誘導邊界傳導' },
  { id: 'quantum-critical-strange-metal', label: '量子臨界奇異金屬', desc: '線性溫度電阻與普朗克極限耗散' },
  { id: 'axial-gravitational-anomaly', label: '軸向引力反常渦旋', desc: '量子引力混合流體渦度極化' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemp(val: number) {
  holographicWeylFluidEngine.setParameters({ temperatureRatioTOverTc: val });
}

function updateNodeB(val: number) {
  holographicWeylFluidEngine.setParameters({ axialNodeSeparationB: val });
}

function updateMu(val: number) {
  holographicWeylFluidEngine.setParameters({ chemicalPotentialMu: val });
}

function updateCSAlpha(val: number) {
  holographicWeylFluidEngine.setParameters({ chernSimonsCouplingAlpha: val });
}

function updateRadiusL(val: number) {
  holographicWeylFluidEngine.setParameters({ adsCurvatureRadiusL: val });
}

function selectRegime(regime: HoloWeylFluidRegime) {
  holographicWeylFluidEngine.setParameters({ regime });
  achievements.unlock('holographic_weyl_fluid');
}

function pulseAnomaly() {
  holographicWeylFluidEngine.pulseAxialAnomalyPacket();
  achievements.unlock('holographic_weyl_fluid');
}

function toggleKSS() {
  holographicWeylFluidEngine.toggleKSSPrecision();
  achievements.unlock('holographic_weyl_fluid');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="hwf-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌪️</span>
          <div>
            <h2>全息外爾量子臨界流體 (AdS/CFT Weyl Fluid Engine)</h2>
            <span class="subtitle">AdS_4/CFT_3 Gravity, KSS Viscosity Bound & Holographic Anomalous Hall</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 全息 AdS 重力切片與臨界外爾流體紋理 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="hwf-svg">
            <defs>
              <linearGradient id="adsBulkSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="60%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#311042" />
              </linearGradient>
              <linearGradient id="streamlineFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
            </defs>

            <!-- AdS 空間雙曲背景幾何 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="url(#adsBulkSky)" stroke="#6366f1" stroke-width="1.8" />

            <!-- 頂部邊界 CFT_3 (z = 0) -->
            <line x1="45" y1="50" x2="495" y2="50" stroke="#38bdf8" stroke-width="3" />
            <text x="55" y="42" fill="#38bdf8" font-size="11" font-weight="bold">邊界 CFT_3 (外爾半金屬臨界流體 z = 0)</text>

            <!-- 底部黑洞視界 (z = z_h) -->
            <line x1="45" y1="260" x2="495" y2="260" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6 4" />
            <text x="55" y="280" fill="#f43f5e" font-size="11" font-weight="bold">AdS 黑洞視界 (熱浴熵密度 s = {{ state.quantumEntropyDensity.toFixed(1) }})</text>

            <!-- 體空間愛因斯坦-麥克斯韋-陳-西蒙斯軸向規範通量管 (Axial Gauge Field Flux) -->
            <g opacity="0.7">
              <path d="M 160 50 C 180 120, 180 190, 160 260" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="8 6" />
              <path d="M 380 50 C 360 120, 360 190, 380 260" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="8 6" />
            </g>

            <!-- 邊界外爾雙錐節點投影 (Chiral Weyl Nodes b) -->
            <g transform="translate(160, 50)">
              <circle r="7" fill="#38bdf8" />
              <text x="0" y="-12" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Weyl Node (+)</text>
            </g>
            <g transform="translate(380, 50)">
              <circle r="7" fill="#f43f5e" />
              <text x="0" y="-12" fill="#f43f5e" font-size="10" font-weight="bold" text-anchor="middle">Weyl Node (-)</text>
            </g>

            <!-- 完美流體流線 (Nearly Perfect Quantum Streamlines) -->
            <g opacity="0.85">
              <path d="M 70 120 C 180 90, 360 150, 470 120" fill="none" stroke="url(#streamlineFlow)" stroke-width="3" stroke-dasharray="16 8">
                <animate attributeName="stroke-dashoffset" values="0;-120" dur="2.2s" repeatCount="indefinite" />
              </path>
              <path d="M 70 160 C 190 190, 350 130, 470 160" fill="none" stroke="url(#streamlineFlow)" stroke-width="2.5" stroke-dasharray="14 7">
                <animate attributeName="stroke-dashoffset" values="0;-100" dur="2.8s" repeatCount="indefinite" />
              </path>
              <path d="M 70 200 C 170 230, 370 170, 470 200" fill="none" stroke="url(#streamlineFlow)" stroke-width="2" stroke-dasharray="12 6">
                <animate attributeName="stroke-dashoffset" values="0;-90" dur="3.4s" repeatCount="indefinite" />
              </path>
            </g>

            <!-- KSS 黏滯極限儀表徽章 -->
            <g transform="translate(270, 150)">
              <rect x="-85" y="-22" width="170" height="44" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
              <text x="0" y="-4" fill="#34d399" font-size="10" font-weight="bold" text-anchor="middle">
                KSS 宇宙最小剪切黏滯
              </text>
              <text x="0" y="14" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">
                η/s = {{ state.viscosityToEntropyRatioEtaOverS.toFixed(4) }} (1/4π)
              </text>
            </g>
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
            <span class="m-label">剪切黏滯比 η/s</span>
            <span class="m-val text-emerald">{{ state.viscosityToEntropyRatioEtaOverS.toFixed(4) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">全息反常霍爾 σ_xy</span>
            <span class="m-val text-cyan">{{ state.anomalousHallConductanceE2H.toFixed(3) }} e²/h</span>
          </div>
          <div class="metric-item">
            <span class="m-label">普朗克弛豫速率</span>
            <span class="m-val text-purple">{{ state.planckianDissipationRateThz.toFixed(1) }} THz</span>
          </div>
          <div class="metric-item">
            <span class="m-label">手性渦度反常導率</span>
            <span class="m-val text-emerald">{{ state.chiralVorticalConductivityCv.toFixed(2) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">視界黑洞全息熵</span>
            <span class="m-val">{{ state.quantumEntropyDensity.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">外爾節點分離 b</span>
            <span class="m-val text-cyan">{{ state.axialNodeSeparationB.toFixed(1) }} ħ</span>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>溫度比 (T / T_c)</span>
              <span class="val">{{ state.temperatureRatioTOverTc.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="5.0"
              step="0.05"
              :value="state.temperatureRatioTOverTc"
              @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>外爾節點動量分離 (b)</span>
              <span class="val">{{ state.axialNodeSeparationB.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.1"
              :value="state.axialNodeSeparationB"
              @input="updateNodeB(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>化學勢 (μ / T)</span>
              <span class="val">{{ state.chemicalPotentialMu.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="12.0"
              step="0.2"
              :value="state.chemicalPotentialMu"
              @input="updateMu(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>全息陳-西蒙斯拓撲耦合 (α)</span>
              <span class="val">{{ state.chernSimonsCouplingAlpha.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              :value="state.chernSimonsCouplingAlpha"
              @input="updateCSAlpha(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>AdS 空間曲率半徑 (L)</span>
              <span class="val">{{ state.adsCurvatureRadiusL.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              :value="state.adsCurvatureRadiusL"
              @input="updateRadiusL(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="pulseAnomaly">
            ⚡ 激發軸向引力反常霍爾脈衝
          </button>
          <button class="action-btn secondary" @click="toggleKSS">
            🌊 對齊 KSS 宇宙極小黏滯流界限
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

.hwf-card {
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(20, 10, 36, 0.95), rgba(10, 5, 20, 0.98));
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.2);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
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
  background: linear-gradient(90deg, #c084fc, #38bdf8);
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
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.hwf-svg {
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
  border: 1px solid rgba(168, 85, 247, 0.2);
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
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.4);
}

.regime-btn.active {
  background: rgba(168, 85, 247, 0.18);
  border-color: #c084fc;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
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
  color: #c084fc;
}

input[type="range"] {
  width: 100%;
  accent-color: #c084fc;
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
  background: linear-gradient(90deg, #9333ea, #c026d3);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(192, 38, 211, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(90deg, #7e22ce, #a21caf);
}

.action-btn.secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
}

.action-btn.secondary:hover {
  background: rgba(168, 85, 247, 0.15);
}
</style>
