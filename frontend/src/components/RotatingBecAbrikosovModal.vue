<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { rotatingBecEngine, type RotatingBecRegime } from '../engine/rotatingBecAbrikosovLattice';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => rotatingBecEngine.getState());

const isOpen = computed(() => uiStore.mode === 'rotating-bec');

const regimes: Array<{ id: RotatingBecRegime; label: string; desc: string }> = [
  {
    id: 'subcritical-irrotational-superfluid',
    label: '亞臨界無旋超流體相 (Ω < Ω_c1)',
    desc: '旋轉角速度低於第一臨界頻率，凝聚體表面展現微弱橢圓表面四極形變，超流體維持嚴格無旋 (curl v = 0)，內部無量子化渦旋'
  },
  {
    id: 'sparse-few-vortex-precession',
    label: '稀疏量子化渦旋進動相 (Ω_c1 ≤ Ω < Ω_c2)',
    desc: '少數幾根單量子化環量渦旋線克服熱力學能壘刺入凝聚體，在托馬斯-費米邊界內以固定幾何多邊形對稱公轉進動'
  },
  {
    id: 'triangular-abrikosov-lattice-crystalline',
    label: '阿布里科索夫六角三角渦旋晶格相',
    desc: '密集量子渦旋在對數排斥作用下自組織形成長程有序六角晶格，呈現有限剪切剛性，並支撐低頻無耗散 Tkachenko 橫向剪切彈性波'
  },
  {
    id: 'lowest-landau-level-quantum-hall-smectic',
    label: '最低朗道能級近晶液晶熔化相 (Ω ≈ ω_perp)',
    desc: '旋轉離心力幾乎完全平衡陷阱束縛力，凝聚體進入二維巨朗道能階 (LLL)，微觀渦旋核芯重疊並誘導晶格向分數量子霍爾液滴或近晶液晶態熔化'
  }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateRotationFrequency(val: number) {
  rotatingBecEngine.setRotationFrequency(val);
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function updateTrapFrequency(val: number) {
  rotatingBecEngine.setTrapFrequency(val);
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function updateAtomNumber(val: number) {
  rotatingBecEngine.setAtomNumber(val);
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function updateScatteringLength(val: number) {
  rotatingBecEngine.setScatteringLength(val);
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function triggerCrystallization() {
  rotatingBecEngine.triggerLatticeCrystallization();
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function cycleRegime() {
  rotatingBecEngine.cycleRegime();
  achievements.unlock('rotating_bec_abrikosov_lattice');
}

function reset() {
  rotatingBecEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="bec-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>旋轉 BEC 阿布里科索夫晶格 (Rotating BEC Abrikosov Lattice)</h2>
            <span class="subtitle">Synthetic Gauge Field, Triangular Vortex Crystal & Tkachenko Shear Wave</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="bec-svg">
            <defs>
              <linearGradient id="becSubstrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#090d16" />
              </linearGradient>
              <radialGradient id="becCloudGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="70%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.0" />
              </radialGradient>
              <radialGradient id="vortexCoreHole" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#080c14" />
                <stop offset="60%" stop-color="#080c14" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
              </radialGradient>
            </defs>

            <!-- 深色背景與網格 -->
            <rect width="800" height="320" fill="#080c14" />
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：2D 凝聚體截面與阿布里科索夫六角渦旋晶格坐標 -->
            <g transform="translate(40, 50)">
              <rect x="0" y="0" width="370" height="230" rx="8" fill="url(#becSubstrateGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="185" y="24" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">
                超冷 BEC 原子雲 (R⊥ = {{ state.condensateRadiusMicron.toFixed(1) }} μm) 與六角渦旋核
              </text>

              <!-- 托馬斯-費米圓盤凝聚體雲 -->
              <g transform="translate(185, 125)">
                <!-- 旋轉背景流線環 -->
                <circle cx="0" cy="0" r="88" fill="none" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="6 4" opacity="0.4" />
                <!-- 凝聚體密度雲 -->
                <circle cx="0" cy="0" r="82" fill="url(#becCloudGrad)" />

                <!-- 量子化渦旋核芯晶格 (Vortex Lattice Points) -->
                <g v-for="(vortex, vIdx) in state.vortexPositions" :key="'vortex-'+vIdx">
                  <circle
                    :cx="vortex.x * 76"
                    :cy="vortex.y * 76"
                    r="4.5"
                    fill="url(#vortexCoreHole)"
                  />
                  <circle
                    :cx="vortex.x * 76"
                    :cy="vortex.y * 76"
                    r="1.8"
                    fill="#080c14"
                  />
                  <!-- 小旋轉箭頭環 (環量 kappa = h/m) -->
                  <circle
                    :cx="vortex.x * 76"
                    :cy="vortex.y * 76"
                    r="4"
                    fill="none"
                    stroke="#facc15"
                    stroke-width="0.8"
                    stroke-dasharray="2 2"
                    opacity="0.8"
                  />
                </g>
              </g>

              <!-- 底部標籤 -->
              <text x="185" y="215" text-anchor="middle" fill="#facc15" font-size="10" font-weight="bold">
                渦旋總數 N_v = {{ state.vortexCount }} | 六角晶格常數 b = {{ state.abrikosovLatticeConstantMicron.toFixed(2) }} μm
              </text>
            </g>

            <!-- 右側：Tkachenko 剪切彈性波與費曼密度曲線 -->
            <g transform="translate(440, 50)">
              <rect x="0" y="0" width="320" height="230" rx="8" fill="url(#becSubstrateGrad)" stroke="#818cf8" stroke-width="1.5" />
              <text x="160" y="24" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="bold">
                Tkachenko 橫向剪切波速與有效磁場
              </text>

              <!-- 彈性波色散小圖 -->
              <g transform="translate(35, 50)">
                <line x1="0" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <line x1="0" y1="120" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <text x="235" y="132" fill="rgba(255,255,255,0.4)" font-size="9">波矢 k</text>
                <text x="5" y="15" fill="rgba(255,255,255,0.4)" font-size="9">頻率 ωT</text>

                <!-- Tkachenko 色散直線 -->
                <line x1="0" y1="120" x2="220" y2="35" stroke="#38bdf8" stroke-width="2" />
                <!-- 剪切正弦波形展示 -->
                <path
                  d="M 10 70 Q 30 50, 50 70 T 90 70 T 130 70 T 170 70 T 210 70"
                  fill="none"
                  stroke="#fbbf24"
                  stroke-width="1.5"
                  opacity="0.8"
                />
              </g>

              <!-- 物理參數數值卡 -->
              <g transform="translate(20, 160)" font-size="10">
                <rect x="0" y="0" width="280" height="52" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" />
                <text x="10" y="18" fill="#cbd5e1">
                  Tkachenko 剪切波速 v_T:
                  <tspan fill="#38bdf8" font-weight="bold"> {{ state.tkachenkoWaveSpeedMmS.toFixed(2) }} mm/s</tspan>
                </text>
                <text x="10" y="34" fill="#cbd5e1">
                  費曼渦旋密度 n_v:
                  <tspan fill="#facc15" font-weight="bold"> {{ state.feynmanVortexDensityPerMm2.toFixed(1) }} mm⁻²</tspan>
                </text>
                <text x="10" y="48" fill="#cbd5e1">
                  渦旋癒合長度 ξ:
                  <tspan fill="#a78bfa" font-weight="bold"> {{ state.healingLengthMicron.toFixed(2) }} μm</tspan>
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 關鍵物理量指標卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">旋轉角速度 Ω</span>
            <span class="val highlight">{{ state.rotationFrequencyOmegaRadS.toFixed(1) }} rad/s</span>
            <span class="sub">比值 Ω/ω⊥ = {{ (state.rotationFrequencyOmegaRadS / state.trapFrequencyOmegaPerpRadS).toFixed(2) }}</span>
          </div>

          <div class="metric-card">
            <span class="label">量子化渦旋總數 N_v</span>
            <span class="val success">{{ state.vortexCount }} 根</span>
            <span class="sub">阿布里科索夫六角陣</span>
          </div>

          <div class="metric-card">
            <span class="label">費曼渦旋密度 n_v</span>
            <span class="val">{{ state.feynmanVortexDensityPerMm2.toFixed(1) }} mm⁻²</span>
            <span class="sub">mΩ / (πℏ) 均勻度</span>
          </div>

          <div class="metric-card">
            <span class="label">Tkachenko 剪切波速</span>
            <span class="val">{{ state.tkachenkoWaveSpeedMmS.toFixed(2) }} mm/s</span>
            <span class="sub">晶格彈性橫波</span>
          </div>

          <div class="metric-card">
            <span class="label">六角晶格常數 b</span>
            <span class="val">{{ state.abrikosovLatticeConstantMicron.toFixed(2) }} μm</span>
            <span class="sub">渦旋間距</span>
          </div>

          <div class="metric-card">
            <span class="label">渦旋癒合長度 ξ</span>
            <span class="val">{{ state.healingLengthMicron.toFixed(2) }} μm</span>
            <span class="sub">核芯直徑尺度</span>
          </div>

          <div class="metric-card">
            <span class="label">凝聚體雲半徑 R⊥</span>
            <span class="val">{{ state.condensateRadiusMicron.toFixed(1) }} μm</span>
            <span class="sub">托馬斯-費米邊界</span>
          </div>

          <div class="metric-card">
            <span class="label">累計旋轉總圈數</span>
            <span class="val">{{ state.accumulatedRotationRevolutions }}</span>
            <span class="sub">超流迴轉數</span>
          </div>
        </div>

        <!-- 交互調節滑桿群 -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>旋轉角速度 Ω (rad/s)</span>
              <span class="slider-val">{{ state.rotationFrequencyOmegaRadS.toFixed(1) }} rad/s</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="250.0"
              step="2.0"
              :value="state.rotationFrequencyOmegaRadS"
              @input="updateRotationFrequency(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.0 (靜止)</span>
              <span>145.0 (晶格)</span>
              <span>250.0 (近晶相)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>橫向磁光阱頻率 ω⊥ (rad/s)</span>
              <span class="slider-val">{{ state.trapFrequencyOmegaPerpRadS.toFixed(1) }} rad/s</span>
            </div>
            <input
              type="range"
              min="100.0"
              max="300.0"
              step="5.0"
              :value="state.trapFrequencyOmegaPerpRadS"
              @input="updateTrapFrequency(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>100.0</span>
              <span>180.0 (典型)</span>
              <span>300.0</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>玻色凝聚原子數 N (10⁵ 顆)</span>
              <span class="slider-val">{{ state.atomNumber10_5.toFixed(1) }} × 10⁵</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              :value="state.atomNumber10_5"
              @input="updateAtomNumber(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.5</span>
              <span>3.5 (典型)</span>
              <span>10.0</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>s-波散射長度 a_s (Bohr a₀)</span>
              <span class="slider-val">{{ state.scatteringLengthBohrA0.toFixed(0) }} a₀</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="200.0"
              step="5.0"
              :value="state.scatteringLengthBohrA0"
              @input="updateScatteringLength(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>10 a₀</span>
              <span>100 a₀ (Rb-87)</span>
              <span>200 a₀</span>
            </div>
          </div>
        </div>

        <!-- 物理相態模式選擇卡 -->
        <div class="regime-section">
          <h3>目前旋轉超流相態 (Current BEC Regime)</h3>
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
          <button class="action-btn primary" @click="triggerCrystallization">
            🌀 觸發阿布里科索夫六角渦旋晶格結晶 (Crystallize)
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

.bec-card {
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

.bec-svg {
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
