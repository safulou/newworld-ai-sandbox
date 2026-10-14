<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { surfaceCodeEngine, type SurfaceCodeRegime } from '../engine/surfaceCodeQuantumMemory';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => surfaceCodeEngine.getState());

const isOpen = computed(() => uiStore.mode === 'surface-code');

const regimes: Array<{ id: SurfaceCodeRegime; label: string; desc: string }> = [
  {
    id: 'quiescent-fault-tolerant-code-space',
    label: '寧靜容錯基態代碼空間相 (p ≪ p_th)',
    desc: '物理錯誤率遠低於 1.05% 容錯臨界閾值，整個二維同調晶格維持在穩定子 +1 本徵基態空間中，邏輯位元保真度逼近 100%'
  },
  {
    id: 'active-syndrome-extraction-stabilizer',
    label: '動態穩定子徵候提取相 (As, Bp 測量)',
    desc: '輔助徵候量子位元高頻交替提取頂點星形算符 As (Z-錯誤) 與方塊算符 Bp (X-錯誤)，晶格內部出現成對點狀拓撲任意子激發'
  },
  {
    id: 'mwpm-topological-string-correction',
    label: 'MWPM 拓撲弦匹配糾錯中相 (Anyon Annihilation)',
    desc: '執行最小權重完全匹配 (MWPM) 圖論算法，找到距離最近的任意子對並施加局部同調泡利修正弦，將任意子對拉近並湮滅至真空'
  },
  {
    id: 'logical-error-percolation-threshold',
    label: '邏輯錯誤滲流臨界相 (p ≥ p_th ≈ 1.05%)',
    desc: '物理錯誤率突破表面碼臨界閾值，任意子錯誤鏈路發生幾何滲流貫穿整個晶格邊界，形成同調非平庸環路，導致邏輯量子位元非可逆翻轉'
  }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateCodeDistance(val: number) {
  surfaceCodeEngine.setCodeDistance(val);
  achievements.unlock('surface_code_topological_memory');
}

function updatePhysicalErrorRate(val: number) {
  surfaceCodeEngine.setPhysicalErrorRate(val);
  achievements.unlock('surface_code_topological_memory');
}

function updateMeasurementRounds(val: number) {
  surfaceCodeEngine.setMeasurementRounds(val);
  achievements.unlock('surface_code_topological_memory');
}

function triggerCorrection() {
  surfaceCodeEngine.triggerMwpmCorrection();
  achievements.unlock('surface_code_topological_memory');
}

function cycleRegime() {
  surfaceCodeEngine.cycleRegime();
  achievements.unlock('surface_code_topological_memory');
}

function reset() {
  surfaceCodeEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="surface-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧩</span>
          <div>
            <h2>表面碼同調量子記憶體 (Surface Code Topological Memory)</h2>
            <span class="subtitle">Kitaev Toric Lattice, Anyon Syndromes & Minimum-Weight Perfect Matching (MWPM)</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="surface-svg">
            <defs>
              <linearGradient id="codeSubstrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#090d16" />
              </linearGradient>
              <radialGradient id="starZGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" />
                <stop offset="60%" stop-color="#e11d48" />
                <stop offset="100%" stop-color="#9f1239" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="plaqXGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="60%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深色背景與網格 -->
            <rect width="800" height="320" fill="#080c14" />
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：表面碼 d x d 棋盤格拓撲晶格 -->
            <g transform="translate(40, 50)">
              <rect x="0" y="0" width="370" height="230" rx="8" fill="url(#codeSubstrateGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="185" y="24" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">
                表面碼晶格 (碼距 d = {{ state.codeDistanceD }}, {{ state.totalDataQubitsCount }} 物理位元)
              </text>

              <!-- 棋盤晶格網格線 -->
              <g transform="translate(45, 45)">
                <!-- 網格橫縱線 -->
                <line v-for="x in (state.codeDistanceD + 1)" :key="'glx-'+x" :x1="(x - 1) * (280 / state.codeDistanceD)" y1="0" :x2="(x - 1) * (280 / state.codeDistanceD)" y2="140" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
                <line v-for="y in (state.codeDistanceD + 1)" :key="'gly-'+y" x1="0" :y1="(y - 1) * (140 / state.codeDistanceD)" x2="280" :y2="(y - 1) * (140 / state.codeDistanceD)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />

                <!-- 棋盤方塊填色 (Plaquette Bp) -->
                <g v-for="px in state.codeDistanceD" :key="'p-row-'+px">
                  <rect
                    v-for="py in state.codeDistanceD"
                    :key="'plaq-'+px+'-'+py"
                    :x="(px - 1) * (280 / state.codeDistanceD) + 3"
                    :y="(py - 1) * (140 / state.codeDistanceD) + 3"
                    :width="(280 / state.codeDistanceD) - 6"
                    :height="(140 / state.codeDistanceD) - 6"
                    :fill="(px + py) % 2 === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(244, 63, 94, 0.12)'"
                    rx="3"
                  />
                </g>

                <!-- 任意子缺陷點 (Anyon Defects) -->
                <g v-for="(def, dIdx) in state.defectsList" :key="'def-'+dIdx">
                  <circle
                    :cx="def.x * (280 / state.codeDistanceD) + (280 / (2 * state.codeDistanceD))"
                    :cy="def.y * (140 / state.codeDistanceD) + (140 / (2 * state.codeDistanceD))"
                    r="7"
                    :fill="def.type === 'star-Z' ? 'url(#starZGrad)' : 'url(#plaqXGrad)'"
                  />
                  <circle
                    :cx="def.x * (280 / state.codeDistanceD) + (280 / (2 * state.codeDistanceD))"
                    :cy="def.y * (140 / state.codeDistanceD) + (140 / (2 * state.codeDistanceD))"
                    r="2.5"
                    fill="#ffffff"
                  />
                </g>
              </g>

              <text x="185" y="215" text-anchor="middle" fill="#38bdf8" font-size="10">
                星形算符 As (Z 錯誤: 紅) | 面心算符 Bp (X 錯誤: 藍) | 任意子數: {{ state.activeAnyonDefectsCount }}
              </text>
            </g>

            <!-- 右側：容錯閾值曲線與邏輯錯誤率 P_L -->
            <g transform="translate(440, 50)">
              <rect x="0" y="0" width="320" height="230" rx="8" fill="url(#codeSubstrateGrad)" stroke="#818cf8" stroke-width="1.5" />
              <text x="160" y="24" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="bold">
                容錯閾值定理 (pth ≈ 1.05%) 與邏輯保真度
              </text>

              <!-- 閾值曲線示意圖 -->
              <g transform="translate(35, 45)">
                <line x1="0" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <line x1="0" y1="120" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <text x="220" y="132" fill="rgba(255,255,255,0.4)" font-size="9">物理錯誤 p</text>
                <text x="5" y="15" fill="rgba(255,255,255,0.4)" font-size="9">邏輯錯誤 PL</text>

                <!-- 閾值虛線 (pth = 1.05%) -->
                <line x1="125" y1="10" x2="125" y2="120" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3" />
                <text x="125" y="132" text-anchor="middle" fill="#f43f5e" font-size="8">pth=1.05%</text>

                <!-- 邏輯錯誤曲線：低於閾值指數壓制，高於閾值滲流發散 -->
                <path
                  d="M 10 118 Q 70 115, 125 70 T 240 15"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2"
                />

                <!-- 當前物理錯誤率指針點 -->
                <circle
                  :cx="Math.min(240, Math.max(10, (state.physicalErrorRateP / 0.02) * 125))"
                  cy="70"
                  r="5"
                  fill="#facc15"
                />
              </g>

              <!-- 數值指標卡片 -->
              <g transform="translate(20, 160)" font-size="10">
                <rect x="0" y="0" width="280" height="52" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" />
                <text x="10" y="18" fill="#cbd5e1">
                  邏輯保真度 F_L:
                  <tspan fill="#4ade80" font-weight="bold"> {{ state.logicalFidelityPercent.toFixed(4) }}%</tspan>
                </text>
                <text x="10" y="34" fill="#cbd5e1">
                  單週期邏輯錯誤率 P_L:
                  <tspan fill="#38bdf8" font-weight="bold"> {{ state.logicalErrorRatePerCycle }}</tspan>
                </text>
                <text x="10" y="48" fill="#cbd5e1">
                  狀態評定:
                  <tspan :fill="state.physicalErrorRateP < 0.0105 ? '#4ade80' : '#f43f5e'" font-weight="bold">
                    {{ state.physicalErrorRateP < 0.0105 ? '✔ 處於容錯保護區' : '✖ 突破閾值：錯誤滲流' }}
                  </tspan>
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 關鍵物理量指標卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">拓撲碼距 d</span>
            <span class="val highlight">d = {{ state.codeDistanceD }}</span>
            <span class="sub">奇數 {{ state.codeDistanceD }}×{{ state.codeDistanceD }} 晶格</span>
          </div>

          <div class="metric-card">
            <span class="label">物理錯誤率 p</span>
            <span class="val" :class="{ success: state.physicalErrorRateP < 0.0105, warning: state.physicalErrorRateP >= 0.0105 }">
              {{ (state.physicalErrorRateP * 100).toFixed(2) }}%
            </span>
            <span class="sub">容錯閾值 1.05%</span>
          </div>

          <div class="metric-card">
            <span class="label">邏輯位元保真度 F_L</span>
            <span class="val success">{{ state.logicalFidelityPercent.toFixed(3) }}%</span>
            <span class="sub">容錯量子壽命</span>
          </div>

          <div class="metric-card">
            <span class="label">單週期邏輯錯誤率 P_L</span>
            <span class="val">{{ state.logicalErrorRatePerCycle }}</span>
            <span class="sub">指數抑制 P_L ∝ p^((d+1)/2)</span>
          </div>

          <div class="metric-card">
            <span class="label">數據物理位元 N_data</span>
            <span class="val">{{ state.totalDataQubitsCount }} 個</span>
            <span class="sub">d² + (d-1)²</span>
          </div>

          <div class="metric-card">
            <span class="label">輔助檢驗徵候位元</span>
            <span class="val">{{ state.totalSyndromeQubitsCount }} 個</span>
            <span class="sub">星形與方塊安定子</span>
          </div>

          <div class="metric-card">
            <span class="label">活化任意子缺陷數</span>
            <span class="val" :class="{ warning: state.activeAnyonDefectsCount > 4 }">
              {{ state.activeAnyonDefectsCount }} 個
            </span>
            <span class="sub">e / m 任意子對</span>
          </div>

          <div class="metric-card">
            <span class="label">累計糾錯週期數</span>
            <span class="val">{{ state.accumulatedCyclesCount }}</span>
            <span class="sub">MWPM 追蹤次數</span>
          </div>
        </div>

        <!-- 交互調節滑桿群 -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>拓撲碼距 (Code Distance d)</span>
              <span class="slider-val">d = {{ state.codeDistanceD }}</span>
            </div>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              :value="state.codeDistanceD"
              @input="updateCodeDistance(parseInt(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>d = 3 (17位元)</span>
              <span>d = 5 (41位元)</span>
              <span>d = 11 (221位元)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>物理單量子門錯誤率 p (%)</span>
              <span class="slider-val">{{ (state.physicalErrorRateP * 100).toFixed(2) }}%</span>
            </div>
            <input
              type="range"
              min="0.0005"
              max="0.03"
              step="0.0005"
              :value="state.physicalErrorRateP"
              @input="updatePhysicalErrorRate(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.05% (超導位元)</span>
              <span>pth = 1.05% (臨界點)</span>
              <span>3.0% (滲流區)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>每週期徵候量測輪數 (Rounds)</span>
              <span class="slider-val">{{ state.measurementRoundsPerCycle }} 輪</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              :value="state.measurementRoundsPerCycle"
              @input="updateMeasurementRounds(parseInt(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>1 輪</span>
              <span>4 輪 (典型)</span>
              <span>10 輪</span>
            </div>
          </div>
        </div>

        <!-- 物理相態模式選擇卡 -->
        <div class="regime-section">
          <h3>目前表面碼容錯相態 (Current Surface Code Regime)</h3>
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
          <button class="action-btn primary" @click="triggerCorrection">
            🧩 觸發 MWPM 拓撲弦匹配糾錯 (Run MWPM Correction)
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

.surface-card {
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

.surface-svg {
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
