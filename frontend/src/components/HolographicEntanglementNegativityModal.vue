<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicNegativityEngine, type HolographicNegativityRegime } from '../engine/holographicEntanglementNegativity';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => holographicNegativityEngine.getState());

const isOpen = computed(() => uiStore.mode === 'holographic-negativity');

const regimes: Array<{ id: HolographicNegativityRegime; label: string; desc: string }> = [
  {
    id: 'connected-entanglement-wedge-non-zero-negativity',
    label: '連通糾纏楔相 (d < d_c, EWCS > 0)',
    desc: '兩子區間間隔小於臨界距離，體幾何中 Ryu-Takayanagi 測地線包絡相連，糾纏楔橫截面 EWCS 顯著大於零，對數糾纏負度證明純量子糾纏非零存在'
  },
  {
    id: 'critical-conformal-cross-section-transition',
    label: '臨界共形橫截面拓撲相變相 (d ≈ d_c)',
    desc: '間隔逼近幾何臨界值 dc = √(l1·l2)，體測地線發生一級拓撲重聯突變，EWCS 橫截面達到幾何奇異縮小臨界點'
  },
  {
    id: 'disjoint-disconnected-wedge-vanishing-negativity',
    label: '分離斷開糾纏楔相 (d > d_c, EWCS = 0)',
    desc: '糾纏楔斷裂為兩個孤立雙曲漏斗，EWCS 橫截面突降為零，混合態量子糾纏負度嚴格淬火消失，僅殘留熱噪聲與宏觀古典相關'
  },
  {
    id: 'large-central-charge-thermal-holo-plasma',
    label: '大中央荷高溫全息等離子體相 (BTZ)',
    desc: 'AdS 體幾何中心湧現 BTZ 荷電黑洞事件視界，有限溫度引發測地線熱形變，量子糾纏負度受到高溫等離子體熱遮蔽指數抑制'
  }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateCentralCharge(val: number) {
  holographicNegativityEngine.setCentralCharge(val);
  achievements.unlock('holographic_entanglement_negativity');
}

function updateSubsystemL1(val: number) {
  holographicNegativityEngine.setSubsystemLengthL1(val);
  achievements.unlock('holographic_entanglement_negativity');
}

function updateSubsystemL2(val: number) {
  holographicNegativityEngine.setSubsystemLengthL2(val);
  achievements.unlock('holographic_entanglement_negativity');
}

function updateSeparationD(val: number) {
  holographicNegativityEngine.setIntervalSeparationD(val);
  achievements.unlock('holographic_entanglement_negativity');
}

function updateTemperature(val: number) {
  holographicNegativityEngine.setTemperature(val);
  achievements.unlock('holographic_entanglement_negativity');
}

function triggerMaxWedge() {
  holographicNegativityEngine.triggerMaxEntanglementWedge();
  achievements.unlock('holographic_entanglement_negativity');
}

function cycleRegime() {
  holographicNegativityEngine.cycleRegime();
  achievements.unlock('holographic_entanglement_negativity');
}

function reset() {
  holographicNegativityEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="holo-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>全息共形反常與糾纏負度 (Holographic Entanglement Negativity)</h2>
            <span class="subtitle">AdS3/CFT2 Duality, Central Charge c & Entanglement Wedge Cross Section (EWCS)</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="holo-svg">
            <defs>
              <linearGradient id="holoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#090d16" />
              </linearGradient>
              <radialGradient id="poincareDiscGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8" />
                <stop offset="80%" stop-color="#0f172a" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.4" />
              </radialGradient>
            </defs>

            <!-- 深色背景與網格 -->
            <rect width="800" height="320" fill="#080c14" />
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：Poincaré 圓盤雙曲體幾何、RT 測地線與 EWCS 糾纏楔 -->
            <g transform="translate(40, 50)">
              <rect x="0" y="0" width="370" height="230" rx="8" fill="url(#holoBgGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="185" y="24" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">
                AdS₃ 雙曲體幾何與 RT 測地線 (中央荷 c = {{ state.centralChargeC.toFixed(0) }})
              </text>

              <!-- 龐加萊圓盤 (Poincaré Disk) -->
              <g transform="translate(185, 125)">
                <!-- 邊界 CFT 圓環 -->
                <circle cx="0" cy="0" r="80" fill="url(#poincareDiscGrad)" stroke="#38bdf8" stroke-width="1.5" />

                <!-- 邊界子區間 A1 (青色弧線) -->
                <path
                  d="M -60 53 A 80 80 0 0 1 -15 78"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="5"
                />
                <!-- 邊界子區間 A2 (粉紅色弧線) -->
                <path
                  d="M 15 78 A 80 80 0 0 1 60 53"
                  fill="none"
                  stroke="#f43f5e"
                  stroke-width="5"
                />

                <!-- RT 測地線 γ_A1 (雙曲半圓弧) -->
                <path
                  d="M -60 53 Q -35 25, -15 78"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="1.5"
                  stroke-dasharray="3 2"
                />
                <!-- RT 測地線 γ_A2 (雙曲半圓弧) -->
                <path
                  d="M 15 78 Q 35 25, 60 53"
                  fill="none"
                  stroke="#f43f5e"
                  stroke-width="1.5"
                  stroke-dasharray="3 2"
                />

                <!-- EWCS 糾纏楔橫截面橋樑 (金色實線/相變虛線) -->
                <line
                  v-if="state.entanglementWedgeCrossSectionEW > 0.05"
                  x1="-35"
                  y1="40"
                  x2="35"
                  y2="40"
                  stroke="#facc15"
                  stroke-width="3"
                />
                <!-- 斷裂提示虛線 -->
                <line
                  v-else
                  x1="-35"
                  y1="40"
                  x2="35"
                  y2="40"
                  stroke="rgba(244, 63, 94, 0.4)"
                  stroke-width="1.5"
                  stroke-dasharray="3 3"
                />

                <text x="-37" y="70" fill="#38bdf8" font-size="9" font-weight="bold">A₁</text>
                <text x="37" y="70" fill="#f43f5e" font-size="9" font-weight="bold">A₂</text>
                <text x="0" y="32" text-anchor="middle" :fill="state.entanglementWedgeCrossSectionEW > 0 ? '#facc15' : '#94a3b8'" font-size="8" font-weight="bold">
                  {{ state.entanglementWedgeCrossSectionEW > 0 ? 'EWCS (EW)' : 'Wedge Disconnected' }}
                </text>
              </g>

              <text x="185" y="215" text-anchor="middle" fill="#facc15" font-size="10" font-weight="bold">
                間距 d = {{ state.intervalSeparationD.toFixed(1) }} | 臨界閾值 dc = {{ state.criticalSeparationDc.toFixed(1) }}
                | {{ state.intervalSeparationD < state.criticalSeparationDc ? '✔ 糾纏楔連通' : '✖ 拓撲斷開' }}
              </text>
            </g>

            <!-- 右側：糾纏負度 \mathcal{E} 與互資訊 I(A1:A2) 隨間隔 d 曲線 -->
            <g transform="translate(440, 50)">
              <rect x="0" y="0" width="320" height="230" rx="8" fill="url(#holoBgGrad)" stroke="#818cf8" stroke-width="1.5" />
              <text x="160" y="24" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="bold">
                對數糾纏負度 \mathcal{E}(d) 與互資訊相圖
              </text>

              <!-- 坐標軸與相變曲線 -->
              <g transform="translate(35, 45)">
                <line x1="0" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <line x1="0" y1="120" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <text x="215" y="132" fill="rgba(255,255,255,0.4)" font-size="9">間隔距離 d</text>
                <text x="5" y="15" fill="rgba(255,255,255,0.4)" font-size="9">負度 E / 互資訊 I</text>

                <!-- 臨界相變垂直虛線 (dc) -->
                <line x1="120" y1="10" x2="120" y2="120" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3" />
                <text x="120" y="132" text-anchor="middle" fill="#f43f5e" font-size="8">dc={{ state.criticalSeparationDc.toFixed(0) }}</text>

                <!-- 對數糾纏負度曲線：在 dc 處一級相變斷崖歸零 -->
                <path
                  d="M 10 30 Q 60 45, 120 90 L 120 120 L 240 120"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2.5"
                />
                <!-- 古典互資訊曲線：連續衰減至尾部 -->
                <path
                  d="M 10 20 Q 80 50, 160 95 T 240 115"
                  fill="none"
                  stroke="#fbbf24"
                  stroke-width="1.2"
                  stroke-dasharray="4 2"
                  opacity="0.8"
                />

                <!-- 當前間距指針球 -->
                <circle
                  :cx="Math.min(240, Math.max(10, (state.intervalSeparationD / 80) * 120))"
                  :cy="state.logarithmicNegativityE > 0 ? 60 : 120"
                  r="5"
                  fill="#facc15"
                />
              </g>

              <!-- 數值卡 -->
              <g transform="translate(20, 160)" font-size="10">
                <rect x="0" y="0" width="280" height="52" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" />
                <text x="10" y="18" fill="#cbd5e1">
                  對數糾纏負度 \mathcal{E}:
                  <tspan fill="#38bdf8" font-weight="bold"> {{ state.logarithmicNegativityE.toFixed(3) }}</tspan>
                </text>
                <text x="10" y="34" fill="#cbd5e1">
                  糾纏楔橫截面 EWCS:
                  <tspan fill="#facc15" font-weight="bold"> {{ state.entanglementWedgeCrossSectionEW.toFixed(3) }}</tspan>
                </text>
                <text x="10" y="48" fill="#cbd5e1">
                  互資訊 I(A₁ : A₂):
                  <tspan fill="#a78bfa" font-weight="bold"> {{ state.mutualInformationI.toFixed(3) }}</tspan>
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 關鍵物理量指標卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">對數糾纏負度 \mathcal{E}</span>
            <span class="val highlight" :class="{ success: state.logarithmicNegativityE > 0, warning: state.logarithmicNegativityE === 0 }">
              {{ state.logarithmicNegativityE.toFixed(3) }}
            </span>
            <span class="sub">{{ state.logarithmicNegativityE > 0 ? '真量子糾纏存在' : '無量子糾纏' }}</span>
          </div>

          <div class="metric-card">
            <span class="label">糾纏楔橫截面 EWCS</span>
            <span class="val">{{ state.entanglementWedgeCrossSectionEW.toFixed(3) }}</span>
            <span class="sub">雙曲體截面長度</span>
          </div>

          <div class="metric-card">
            <span class="label">臨界斷裂距離 dc</span>
            <span class="val">{{ state.criticalSeparationDc.toFixed(1) }}</span>
            <span class="sub">√(l1 · l2) 幾何相變</span>
          </div>

          <div class="metric-card">
            <span class="label">共形反常中央荷 c</span>
            <span class="val">{{ state.centralChargeC.toFixed(1) }}</span>
            <span class="sub">3 R_AdS / 2 G_N</span>
          </div>

          <div class="metric-card">
            <span class="label">子區間 A1 長度 l1</span>
            <span class="val">{{ state.subsystemLengthL1.toFixed(0) }}</span>
            <span class="sub">CFT 邊界長度</span>
          </div>

          <div class="metric-card">
            <span class="label">子區間 A2 長度 l2</span>
            <span class="val">{{ state.subsystemLengthL2.toFixed(0) }}</span>
            <span class="sub">CFT 邊界長度</span>
          </div>

          <div class="metric-card">
            <span class="label">區間間隔距離 d</span>
            <span class="val" :class="{ success: state.intervalSeparationD < state.criticalSeparationDc }">
              {{ state.intervalSeparationD.toFixed(1) }}
            </span>
            <span class="sub">邊界分離間距</span>
          </div>

          <div class="metric-card">
            <span class="label">互資訊 I(A1 : A2)</span>
            <span class="val">{{ state.mutualInformationI.toFixed(3) }}</span>
            <span class="sub">總資訊相關度</span>
          </div>
        </div>

        <!-- 交互調節滑桿群 -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>共形場論中央荷 (Central Charge c)</span>
              <span class="slider-val">c = {{ state.centralChargeC.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="1.0"
              :value="state.centralChargeC"
              @input="updateCentralCharge(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>1.0 (自由費米子)</span>
              <span>12.0 (典型)</span>
              <span>50.0 (強引力全息)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>子區間間隔距離 (Separation d)</span>
              <span class="slider-val">d = {{ state.intervalSeparationD.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="120.0"
              step="1.0"
              :value="state.intervalSeparationD"
              @input="updateSeparationD(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>1.0 (緊鄰)</span>
              <span>dc = {{ state.criticalSeparationDc.toFixed(0) }} (相變)</span>
              <span>120.0 (斷開)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>子區間 A1 長度 l1</span>
              <span class="slider-val">{{ state.subsystemLengthL1.toFixed(0) }}</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="5.0"
              :value="state.subsystemLengthL1"
              @input="updateSubsystemL1(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>10.0</span>
              <span>40.0 (典型)</span>
              <span>100.0</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>子區間 A2 長度 l2</span>
              <span class="slider-val">{{ state.subsystemLengthL2.toFixed(0) }}</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="5.0"
              :value="state.subsystemLengthL2"
              @input="updateSubsystemL2(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>10.0</span>
              <span>40.0 (典型)</span>
              <span>100.0</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>全息等離子體溫度 (BTZ Temperature T)</span>
              <span class="slider-val">T = {{ state.temperatureKelvin.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              :value="state.temperatureKelvin"
              @input="updateTemperature(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.0 (純態 AdS)</span>
              <span>1.5 (熱態)</span>
              <span>5.0 (強熱遮蔽)</span>
            </div>
          </div>
        </div>

        <!-- 物理相態模式選擇卡 -->
        <div class="regime-section">
          <h3>目前全息幾何相態 (Current Holographic Regime)</h3>
          <div class="regime-grid">
            <div
              v-for="r in regimes"
              :key="r.id"
              class="regime-card"
              :class="{ active: state.regime === r.id }"
            >
              <div class="regime-header">
                <span class="regime-bullet"></span>
                <span class="regime-name">{{ r.label }}</span>
              </div>
              <p class="regime-desc">{{ r.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 操作快捷按鈕 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="triggerMaxWedge">
            🌌 觸發糾纏楔橫截面極大化 (Max Entanglement Wedge)
          </button>
          <button class="action-btn secondary" @click="cycleRegime">
            🔄 輪轉相態 (Cycle Regime)
          </button>
          <button class="action-btn outline" @click="reset">
            ↺ 系統重置 (Reset)
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
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
  overflow-y: auto;
}

.holo-card {
  background: linear-gradient(135deg, #0b1120 0%, #0f172a 100%);
  border: 1px solid rgba(56, 189, 248, 0.35);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.title-group .icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.6));
}

.title-group h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

.title-group .subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
  margin-top: 0.15rem;
  font-family: monospace;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

.content-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 82vh;
  overflow-y: auto;
}

.visualizer-container {
  background: #080c14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
}

.holo-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-card .label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.metric-card .val {
  font-size: 1.15rem;
  font-weight: 700;
  font-family: monospace;
  color: #e2e8f0;
}

.metric-card .val.highlight {
  color: #38bdf8;
}

.metric-card .val.success {
  color: #4ade80;
}

.metric-card .val.warning {
  color: #f43f5e;
}

.metric-card .sub {
  font-size: 0.68rem;
  color: #64748b;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1rem;
}

@media (max-width: 640px) {
  .controls-panel {
    grid-template-columns: 1fr;
  }
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #cbd5e1;
}

.slider-val {
  font-family: monospace;
  color: #38bdf8;
}

input[type='range'] {
  width: 100%;
  accent-color: #38bdf8;
  cursor: pointer;
}

.slider-hints {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #64748b;
}

.regime-section h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .regime-grid {
    grid-template-columns: 1fr;
  }
}

.regime-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.regime-card.active {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.15);
}

.regime-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.regime-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748b;
}

.regime-card.active .regime-bullet {
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
}

.regime-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #cbd5e1;
}

.regime-card.active .regime-name {
  color: #38bdf8;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border: 1px solid #38bdf8;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

.action-btn.outline {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn.outline:hover {
  color: #f1f5f9;
  border-color: rgba(255, 255, 255, 0.25);
}
</style>
