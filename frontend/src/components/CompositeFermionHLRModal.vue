<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { compositeFermionEngine, type CompositeFermionRegime } from '../engine/compositeFermionHLRLiquid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => compositeFermionEngine.getState());

const isOpen = computed(() => uiStore.mode === 'composite-fermion');

const regimes: Array<{ id: CompositeFermionRegime; label: string; desc: string }> = [
  {
    id: 'halperin-lee-read-half-filled-liquid',
    label: 'HLR 偶分母複合費米液體相 (ν = 1/2, Beff = 0)',
    desc: '每個電子吸附 2 個陳-西蒙斯統計磁通量子，平均場統計通量完全抵消外加強磁場，形成平均零磁場下自由運動的複合費米子與明確的圓形複合費米面'
  },
  {
    id: 'effective-cyclotron-geometric-resonance',
    label: '等效迴旋幾何共振振盪相 (ΔBeff ≠ 0, 2Rc* ≈ a)',
    desc: '微幅偏離半填充產生微弱等效磁場，複合費米子以直徑 2Rc* 作迴旋運動；當直徑與表面納米微結構週期 a 形成整數比時，縱向磁阻 ρxx 顯著躍升'
  },
  {
    id: 'composite-fermion-fractional-qhe',
    label: '複合費米子分數霍爾相 (Jain 序列 ν = 2/5, 3/7)',
    desc: '在等效剩餘磁場中，複合費米子自身填充整數個等效朗道能級，產生宏觀不可壓縮分數電荷量子霍爾基態'
  },
  {
    id: 'paired-pfaffian-moore-read-gap',
    label: 'Moore-Read 拓撲配對超流相 (Pfaffian 配對能隙)',
    desc: '複合費米子之間通過規範波動吸引相互作用形成 p-波拓撲配對超流體，賦予體激發具有非阿貝爾統計特性的半通量渦旋'
  }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateFillingFactor(val: number) {
  compositeFermionEngine.setFillingFactor(val);
  achievements.unlock('composite_fermion_hlr_liquid');
}

function updateTotalMagneticField(val: number) {
  compositeFermionEngine.setTotalMagneticField(val);
  achievements.unlock('composite_fermion_hlr_liquid');
}

function updateElectronDensity(val: number) {
  compositeFermionEngine.setElectronDensity(val);
  achievements.unlock('composite_fermion_hlr_liquid');
}

function updateModulationPeriod(val: number) {
  compositeFermionEngine.setModulationPeriod(val);
  achievements.unlock('composite_fermion_hlr_liquid');
}

function triggerResonance() {
  compositeFermionEngine.triggerGeometricResonance();
  achievements.unlock('composite_fermion_hlr_liquid');
}

function cycleRegime() {
  compositeFermionEngine.cycleRegime();
  achievements.unlock('composite_fermion_hlr_liquid');
}

function reset() {
  compositeFermionEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="composite-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚛️</span>
          <div>
            <h2>幾何複合費米子與 HLR 偶分母費米面 (Composite Fermion Liquid)</h2>
            <span class="subtitle">Chern-Simons Flux Attachment & Halperin-Lee-Read Non-Fermi Liquid at ν = 1/2</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="composite-svg">
            <defs>
              <linearGradient id="cfSubstrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#090d16" />
              </linearGradient>
              <radialGradient id="cfElectronGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#67e8f9" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#0e7490" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="fluxVortexGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" />
                <stop offset="60%" stop-color="#be123c" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#881337" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="cfsSeaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
                <stop offset="85%" stop-color="#0284c7" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.9" />
              </radialGradient>
            </defs>

            <!-- 深色微結構背景 -->
            <rect width="800" height="320" fill="#080c14" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：實空間 2DEG 納米微結構晶片與複合費米子統計通量附著 -->
            <g transform="translate(40, 50)">
              <!-- 晶片底板 -->
              <rect x="0" y="0" width="340" height="230" rx="8" fill="url(#cfSubstrateGrad)" stroke="#38bdf8" stroke-width="1.5" />

              <!-- 人工微結構週期光柵條紋 (Period a) -->
              <g opacity="0.3">
                <rect v-for="s in 7" :key="'stripe-'+s" :x="s * 45" y="5" width="20" height="220" fill="#3b82f6" rx="2" />
              </g>
              <text x="170" y="22" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">
                GaAs/AlGaAs 2DEG (表面週期 a = {{ state.surfaceModulationPeriodNm }} nm)
              </text>

              <!-- 外加強垂直磁場 B 箭頭標示 -->
              <g transform="translate(20, 45)" fill="#e0e7ff" font-size="10">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#818cf8" stroke-width="1.5" />
                <circle cx="10" cy="10" r="2.5" fill="#818cf8" />
                <text x="24" y="14" fill="#a5b4fc">B = {{ state.totalMagneticFieldTesla.toFixed(1) }} T (垂直外場)</text>
              </g>

              <!-- 陳-西蒙斯抵消淨磁場 B_eff -->
              <g transform="translate(20, 75)" font-size="10">
                <text :fill="Math.abs(state.effectiveMagneticFieldTesla) < 0.05 ? '#4ade80' : '#f59e0b'" font-weight="bold">
                  B_eff = B(1 - 2ν) = {{ state.effectiveMagneticFieldTesla.toFixed(3) }} T
                  {{ Math.abs(state.effectiveMagneticFieldTesla) < 0.05 ? ' (平均零磁場抵消！)' : '' }}
                </text>
              </g>

              <!-- 複合費米子與 2 統計通量束 (Composite Fermion with 2 attached vortices) -->
              <g transform="translate(170, 140)">
                <!-- 迴旋軌道直徑 2Rc* (當 Beff != 0 時顯示圓形軌道) -->
                <circle
                  v-if="state.cyclotronOrbitDiameterNm < 600"
                  cx="0"
                  cy="0"
                  :r="Math.min(65, state.cyclotronOrbitDiameterNm / 6)"
                  fill="none"
                  stroke="#fbbf24"
                  stroke-width="1.8"
                  stroke-dasharray="4 2"
                />
                <!-- 直線漂移虛線 (當 Beff ≈ 0 時) -->
                <line
                  v-else
                  x1="-70"
                  y1="0"
                  x2="70"
                  y2="0"
                  stroke="#4ade80"
                  stroke-width="2"
                  stroke-dasharray="5 3"
                />

                <!-- 費米子核心 (電子) -->
                <circle cx="0" cy="0" r="10" fill="url(#cfElectronGlow)" />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />

                <!-- 統計通量束 1 (tilde Phi_0) -->
                <circle cx="-14" cy="-10" r="7" fill="url(#fluxVortexGrad)" />
                <circle cx="-14" cy="-10" r="2.5" fill="#ffedd5" />
                <!-- 統計通量束 2 (tilde Phi_0) -->
                <circle cx="14" cy="-10" r="7" fill="url(#fluxVortexGrad)" />
                <circle cx="14" cy="-10" r="2.5" fill="#ffedd5" />

                <text x="0" y="24" text-anchor="middle" fill="#67e8f9" font-size="10" font-weight="bold">
                  e⁻ + 2Φ₀ 複合費米子
                </text>
              </g>

              <!-- 共振幾何指標指示文字 -->
              <text x="170" y="215" text-anchor="middle" fill="#facc15" font-size="11" font-weight="bold">
                迴旋直徑 2R_c* = {{ state.cyclotronOrbitDiameterNm < 600 ? state.cyclotronOrbitDiameterNm.toFixed(1) + ' nm' : '∞ (直線漂移)' }}
                | 2R_c*/a = {{ state.geometricResonanceIndex.toFixed(2) }}
              </text>
            </g>

            <!-- 右側：動量空間複合費米面 (CF-FS) 與幾何共振阻抗曲線 -->
            <g transform="translate(420, 50)">
              <!-- 背景框架 -->
              <rect x="0" y="0" width="340" height="230" rx="8" fill="url(#cfSubstrateGrad)" stroke="#818cf8" stroke-width="1.5" />
              <text x="170" y="22" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="bold">
                HLR 複合費米面 (k-Space) 與 幾何共振振盪
              </text>

              <!-- 動量空間圓形費米球 (kF*) -->
              <g transform="translate(100, 125)">
                <!-- 坐標軸 -->
                <line x1="-70" y1="0" x2="70" y2="0" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <line x1="0" y1="-70" x2="0" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <text x="65" y="-5" fill="rgba(255,255,255,0.4)" font-size="9">kx</text>
                <text x="5" y="-62" fill="rgba(255,255,255,0.4)" font-size="9">ky</text>

                <!-- 費米海圓球 -->
                <circle cx="0" cy="0" :r="Math.max(20, Math.min(58, state.compositeFermiWavevectorInvNm * 300))" fill="url(#cfsSeaGlow)" stroke="#38bdf8" stroke-width="2" />
                
                <!-- 費米波矢半徑標記箭頭 -->
                <line x1="0" y1="0" :x2="state.compositeFermiWavevectorInvNm * 212" :y2="-state.compositeFermiWavevectorInvNm * 212" stroke="#facc15" stroke-width="1.5" marker-end="url(#arrow)" />
                <text x="15" y="-25" fill="#facc15" font-size="9" font-weight="bold">k_F* = {{ state.compositeFermiWavevectorInvNm.toFixed(3) }} nm⁻¹</text>
                <text x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="8" opacity="0.8">HLR 費米球</text>
              </g>

              <!-- 右側小圖：縱向磁阻率 ρxx 幾何振盪條 -->
              <g transform="translate(200, 45)">
                <text x="0" y="10" fill="#cbd5e1" font-size="10" font-weight="bold">縱向磁阻 ρ_xx (幾何共振峰)</text>
                <rect x="0" y="20" width="120" height="135" fill="rgba(0,0,0,0.4)" rx="4" stroke="rgba(255,255,255,0.1)" />

                <!-- 阻抗數值與共振指示 -->
                <text x="60" y="55" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="bold">
                  {{ state.longitudinalMagnetoResistivityOhm.toFixed(1) }} Ω
                </text>
                <text x="60" y="75" text-anchor="middle" fill="#94a3b8" font-size="9">
                  ν 偏移 |Δν|: {{ Math.abs(state.fillingFactorNu - 0.5).toFixed(3) }}
                </text>

                <!-- 共振狀態燈 -->
                <rect
                  x="15"
                  y="95"
                  width="90"
                  height="22"
                  rx="4"
                  :fill="state.regime === 'effective-cyclotron-geometric-resonance' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(56, 189, 248, 0.15)'"
                  :stroke="state.regime === 'effective-cyclotron-geometric-resonance' ? '#eab308' : '#38bdf8'"
                />
                <text x="60" y="110" text-anchor="middle" :fill="state.regime === 'effective-cyclotron-geometric-resonance' ? '#fde047' : '#bae6fd'" font-size="9" font-weight="bold">
                  {{ state.regime === 'effective-cyclotron-geometric-resonance' ? '★ 幾何共振極大值' : '平滑費米液體響應' }}
                </text>
              </g>

              <!-- 底部歷史記錄條 -->
              <g transform="translate(10, 195)">
                <text x="5" y="12" fill="#94a3b8" font-size="9">遙測歷程 (填充分數 ν)：</text>
                <g v-for="(hist, idx) in state.telemetryHistory.slice(-8)" :key="'hist-'+idx" :transform="`translate(${80 + idx * 30}, 0)`">
                  <rect x="0" y="2" width="22" height="14" rx="2" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="0.8" />
                  <text x="11" y="13" text-anchor="middle" fill="#bae6fd" font-size="8">{{ hist.fillingNu.toFixed(2) }}</text>
                </g>
              </g>
            </g>
          </svg>
        </div>

        <!-- 關鍵物理量指標卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">朗道填充分數 ν</span>
            <span class="val highlight">{{ state.fillingFactorNu.toFixed(3) }}</span>
            <span class="sub">半填充 ν = 1/2</span>
          </div>

          <div class="metric-card">
            <span class="label">外加垂直強磁場 B</span>
            <span class="val">{{ state.totalMagneticFieldTesla.toFixed(1) }} T</span>
            <span class="sub">6.0 ~ 18.0 Tesla</span>
          </div>

          <div class="metric-card">
            <span class="label">複合費米子等效磁場 B_eff</span>
            <span class="val" :class="{ success: Math.abs(state.effectiveMagneticFieldTesla) < 0.05 }">
              {{ state.effectiveMagneticFieldTesla.toFixed(3) }} T
            </span>
            <span class="sub">B(1 - 2ν) 完全抵消</span>
          </div>

          <div class="metric-card">
            <span class="label">複合費米波矢 k_F*</span>
            <span class="val">{{ state.compositeFermiWavevectorInvNm.toFixed(3) }} nm⁻¹</span>
            <span class="sub">√(4π ρ₀) 費米面</span>
          </div>

          <div class="metric-card">
            <span class="label">迴旋軌道直徑 2R_c*</span>
            <span class="val">{{ state.cyclotronOrbitDiameterNm < 600 ? state.cyclotronOrbitDiameterNm.toFixed(1) + ' nm' : '∞ (直線漂移)' }}</span>
            <span class="sub">微結構共振指標</span>
          </div>

          <div class="metric-card">
            <span class="label">幾何共振比 2R_c*/a</span>
            <span class="val" :class="{ warning: state.regime === 'effective-cyclotron-geometric-resonance' }">
              {{ state.geometricResonanceIndex.toFixed(2) }}
            </span>
            <span class="sub">整數時形成阻抗峰</span>
          </div>

          <div class="metric-card">
            <span class="label">縱向磁阻率 ρ_xx</span>
            <span class="val">{{ state.longitudinalMagnetoResistivityOhm.toFixed(1) }} Ω</span>
            <span class="sub">幾何振盪響應</span>
          </div>

          <div class="metric-card">
            <span class="label">累計共振循環數</span>
            <span class="val">{{ state.accumulatedResonanceCyclesCount }}</span>
            <span class="sub">共振觀測次數</span>
          </div>
        </div>

        <!-- 交互調節滑桿群 -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>朗道填充分數 (Filling Factor ν)</span>
              <span class="slider-val">{{ state.fillingFactorNu.toFixed(3) }}</span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.60"
              step="0.005"
              :value="state.fillingFactorNu"
              @input="updateFillingFactor(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>ν = 0.40 (FQHE)</span>
              <span>ν = 0.50 (HLR 費米面)</span>
              <span>ν = 0.60</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>垂直強磁場強度 B (Tesla)</span>
              <span class="slider-val">{{ state.totalMagneticFieldTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="6.0"
              max="18.0"
              step="0.5"
              :value="state.totalMagneticFieldTesla"
              @input="updateTotalMagneticField(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>6.0 T</span>
              <span>12.0 T (典型)</span>
              <span>18.0 T</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>2D 電子面密度 ρ₀ (10¹¹ cm⁻²)</span>
              <span class="slider-val">{{ state.electronDensity10_11Cm2.toFixed(1) }} × 10¹¹ cm⁻²</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              :value="state.electronDensity10_11Cm2"
              @input="updateElectronDensity(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>1.0</span>
              <span>2.2</span>
              <span>4.0</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>表面納米條紋微結構週期 a (nm)</span>
              <span class="slider-val">{{ state.surfaceModulationPeriodNm.toFixed(0) }} nm</span>
            </div>
            <input
              type="range"
              min="100.0"
              max="400.0"
              step="10.0"
              :value="state.surfaceModulationPeriodNm"
              @input="updateModulationPeriod(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>100 nm</span>
              <span>200 nm (典型)</span>
              <span>400 nm</span>
            </div>
          </div>
        </div>

        <!-- 物理相態模式選擇卡 -->
        <div class="regime-section">
          <h3>目前拓撲相態 (Current Regime)</h3>
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
          <button class="action-btn primary" @click="triggerResonance">
            ⚡ 觸發 HLR 幾何共振 (Commensurability Peak)
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

.composite-card {
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

.composite-svg {
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
  color: #fbbf24;
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
