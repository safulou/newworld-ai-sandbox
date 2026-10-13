<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { topologicalKondoEngine, type TKIRegime } from '../engine/topologicalKondoInsulator';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => topologicalKondoEngine.getState());

const isOpen = computed(() => uiStore.mode === 'topological-kondo');

const regimes: Array<{ id: TKIRegime; label: string; desc: string }> = [
  { id: 'high-temp-heavy-fermi-liquid', label: '高溫重費米液體相', desc: 'T > T_K，局域 4f 磁矩尚未屏蔽，傳導電子與局域磁矩處於弱耦合散射態' },
  { id: 'bulk-insulating-kondo-gap', label: '體態近藤雜化絕緣相', desc: 'T_sat < T < T_K，相干近藤能隙 Δ_K 完全開啟，體態載流子指數凍結' },
  { id: 'topological-surface-dirac-saturation', label: '拓撲表面狄拉克飽和相', desc: 'T < 4 K，體態絕緣電阻被無耗散表面狄拉克金屬態短路，呈現飽和電阻平台' },
  { id: 'parity-inverted-kondo-quench', label: '宇稱反轉拓撲淬火態', desc: '強雜化驅動布里淵區 3 個 X 點宇稱反轉，激發 Z_2 = 1 強拓撲態與奇數狄拉克錐' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemperature(val: number) {
  topologicalKondoEngine.setTemperature(val);
  achievements.unlock('topological_kondo_insulator');
}

function updateHybridization(val: number) {
  topologicalKondoEngine.setHybridizationStrength(val);
  achievements.unlock('topological_kondo_insulator');
}

function updateKondoCoupling(val: number) {
  topologicalKondoEngine.setKondoCoupling(val);
  achievements.unlock('topological_kondo_insulator');
}

function triggerQuench() {
  topologicalKondoEngine.triggerThermalQuench();
  achievements.unlock('topological_kondo_insulator');
}

function cycleRegime() {
  topologicalKondoEngine.cycleRegime();
  achievements.unlock('topological_kondo_insulator');
}

function reset() {
  topologicalKondoEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="tki-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚛️</span>
          <div>
            <h2>拓撲近藤絕緣體與表面狄拉克錐 (Topological Kondo Insulator)</h2>
            <span class="subtitle">Strongly Correlated f-d Hybridization, Parity Inversion & Resistance Saturation Plateau</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="tki-svg">
            <defs>
              <radialGradient id="diracGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#0077ff" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#001133" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff0077" />
                <stop offset="100%" stop-color="#7700ff" />
              </linearGradient>
            </defs>

            <!-- 背景方格 -->
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 243, 255, 0.08)" stroke-width="1"/>
            </pattern>
            <rect width="800" height="320" fill="url(#grid)" />

            <!-- 左側：表面狄拉克錐 3D 能量曲面 (Surface Dirac Cone) -->
            <g transform="translate(180, 160)">
              <!-- 狄拉克光暈 -->
              <circle cx="0" cy="0" r="105" fill="url(#diracGlow)" />

              <!-- 上錐曲面 (導帶) -->
              <path d="M -85 -95 Q 0 -60 85 -95 L 0 0 Z" fill="rgba(0, 243, 255, 0.25)" stroke="#00f3ff" stroke-width="1.8" />
              <ellipse cx="0" cy="-95" rx="85" ry="24" fill="none" stroke="#00f3ff" stroke-dasharray="4 3" stroke-width="1.2" />

              <!-- 下錐曲面 (價帶) -->
              <path d="M -85 95 Q 0 60 85 95 L 0 0 Z" fill="rgba(119, 0, 255, 0.25)" stroke="#aa00ff" stroke-width="1.8" />
              <ellipse cx="0" cy="95" rx="85" ry="24" fill="none" stroke="#aa00ff" stroke-dasharray="4 3" stroke-width="1.2" />

              <!-- 狄拉克節點 (Dirac Point E = 0) -->
              <circle cx="0" cy="0" r="4.5" fill="#ffffff">
                <animate attributeName="r" values="4;6.5;4" dur="2s" repeatCount="indefinite" />
              </circle>

              <!-- 表面自旋-動量鎖定手性自旋箭頭 (Spin-Momentum Locking) -->
              <g stroke="#00ffcc" stroke-width="2" fill="none">
                <!-- 旋渦自旋箭頭 (Fermi Circle) -->
                <ellipse cx="0" cy="-45" rx="42" ry="12" stroke="rgba(0, 255, 204, 0.6)" stroke-width="1.5" />
                <path d="M 42 -45 L 36 -40 M 42 -45 L 36 -50" stroke="#00ffcc" stroke-width="2" />
                <path d="M -42 -45 L -36 -40 M -42 -45 L -36 -50" stroke="#00ffcc" stroke-width="2" />
              </g>

              <text x="0" y="130" fill="#00f3ff" text-anchor="middle" font-size="11.5" font-weight="bold">
                (001) 表面金屬狄拉克錐 (v_F = {{ state.diracConeFermiVelocityVf }} × 10⁴ m/s)
              </text>
            </g>

            <!-- 右側：電阻率對溫度相變曲線與飽和平台 (Bulk vs Surface Transport) -->
            <g transform="translate(460, 45)">
              <rect x="0" y="0" width="300" height="230" rx="8" fill="rgba(10, 15, 30, 0.85)" stroke="rgba(0, 243, 255, 0.2)" />
              <text x="150" y="24" fill="#ffffff" text-anchor="middle" font-size="12" font-weight="bold">
                電阻率-溫度傳導相變 (Log ρ vs T)
              </text>

              <!-- 座標軸 -->
              <line x1="40" y1="200" x2="280" y2="200" stroke="#556688" stroke-width="1.5" />
              <line x1="40" y1="40" x2="40" y2="200" stroke="#556688" stroke-width="1.5" />
              <text x="275" y="215" fill="#8899aa" font-size="10">T (K)</text>
              <text x="25" y="38" fill="#8899aa" font-size="10">ρ</text>

              <!-- 體態熱活化曲線 (虛線) -->
              <path d="M 50 50 Q 80 160 270 190" fill="none" stroke="#ff3366" stroke-dasharray="3 3" stroke-width="1.5" />
              <text x="115" y="110" fill="#ff3366" font-size="9.5">體態活化 (exp(Δ/2T))</text>

              <!-- 表面態短路實測曲線 (實線帶飽和平台) -->
              <!-- 飽和平台在 low T (left side) 處變平！ -->
              <path d="M 40 70 L 100 70 Q 140 140 270 190" fill="none" stroke="#00f3ff" stroke-width="2.5" />

              <!-- 飽和平台高亮框 -->
              <rect x="40" y="60" width="60" height="20" fill="rgba(0, 243, 255, 0.2)" stroke="#00f3ff" stroke-width="1" />
              <text x="70" y="52" fill="#00f3ff" font-size="9" text-anchor="middle" font-weight="bold">
                飽和平台 (~{{ state.bulkResistivityOhmCm }} Ω·cm)
              </text>

              <!-- 當前溫度指示球 -->
              <circle
                :cx="Math.min(270, Math.max(40, 40 + (state.temperatureKelvin / 150) * 230))"
                :cy="state.saturationPlateauActive ? 70 : Math.min(190, 70 + (state.temperatureKelvin / 150) * 120)"
                r="5.5"
                fill="#ffdd00"
                stroke="#ffffff"
                stroke-width="1.5"
              />

              <!-- 狀態標籤 -->
              <text x="150" y="222" fill="#88ffaa" font-size="10" text-anchor="middle">
                當前狀態：{{ state.saturationPlateauActive ? '拓撲表面傳導主導 (短路平台)' : '體態熱活化載流傳導' }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 數值指標矩陣 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">近藤雜化能隙 Δ_K</span>
            <span class="val cyan">{{ state.kondoGapDeltaMev }} meV</span>
            <span class="sub">相干近藤溫度 T_K = {{ state.kondoTemperatureTkKelvin }} K</span>
          </div>

          <div class="metric-card">
            <span class="label">拓撲不變量 ℤ₂</span>
            <span class="val green">{{ state.z2TopologicalInvariant === 1 ? 'ℤ₂ = 1 (強拓撲)' : 'ℤ₂ = 0 (平凡)' }}</span>
            <span class="sub">3 個 X 點宇稱反轉奇宇稱態</span>
          </div>

          <div class="metric-card">
            <span class="label">重費米子質量 m*/m₀</span>
            <span class="val purple">{{ state.effectiveMassRatioMStar }} ×</span>
            <span class="sub">f-d 強關聯質量重整化倍率</span>
          </div>

          <div class="metric-card">
            <span class="label">表面拓撲電導 G_surf</span>
            <span class="val gold">{{ state.surfaceConductanceMicroSiemens }} μS</span>
            <span class="sub">總飽和電阻 ρ = {{ state.bulkResistivityOhmCm }} Ω·cm</span>
          </div>
        </div>

        <!-- 相態選擇列表 -->
        <div class="regimes-list">
          <div
            v-for="r in regimes"
            :key="r.id"
            class="regime-item"
            :class="{ active: state.regime === r.id }"
          >
            <div class="regime-name">{{ r.label }}</div>
            <div class="regime-desc">{{ r.desc }}</div>
          </div>
        </div>

        <!-- 物理參數調諧滑桿 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-info">
              <span>系統溫度 T (Kelvin)</span>
              <span class="mono">{{ state.temperatureKelvin }} K</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="120"
              step="0.5"
              :value="state.temperatureKelvin"
              @input="updateTemperature(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>f-d 軌域雜化強度 V_fd</span>
              <span class="mono">{{ state.hybridizationStrengthVfdEv }} eV</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.35"
              step="0.01"
              :value="state.hybridizationStrengthVfdEv"
              @input="updateHybridization(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>近藤交換耦合 J_fd</span>
              <span class="mono">{{ state.kondoCouplingConstantJEv }} eV</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.02"
              :value="state.kondoCouplingConstantJEv"
              @input="updateKondoCoupling(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 操作按鈕列 -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerQuench">
            ❄️ 低溫拓撲淬火 (0.5 K)
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉相態模式
          </button>
          <button class="btn btn-reset" @click="reset">
            ↺ 重置系統
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
  background: rgba(4, 8, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.tki-card {
  background: #070d1d;
  border: 1px solid rgba(0, 243, 255, 0.3);
  box-shadow: 0 0 35px rgba(0, 243, 255, 0.18), inset 0 0 20px rgba(0, 243, 255, 0.05);
  border-radius: 14px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  overflow-y: auto;
  color: #dce5f5;
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 243, 255, 0.2);
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  font-size: 2.2rem;
}

.header h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #00f3ff;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.78rem;
  color: #7a8fa6;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8fa0b5;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.visualizer-container {
  background: #030712;
  border-radius: 10px;
  border: 1px solid rgba(0, 243, 255, 0.25);
  overflow: hidden;
  margin-bottom: 1.2rem;
}

.tki-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.metric-card {
  background: rgba(12, 22, 45, 0.7);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  display: flex;
  flex-direction: column;
}

.metric-card .label {
  font-size: 0.75rem;
  color: #8da4c4;
}

.metric-card .val {
  font-size: 1.25rem;
  font-weight: bold;
  font-family: monospace;
  margin: 0.2rem 0;
}

.metric-card .val.cyan { color: #00f3ff; }
.metric-card .val.green { color: #00ffaa; }
.metric-card .val.purple { color: #bb77ff; }
.metric-card .val.gold { color: #ffd000; }

.metric-card .sub {
  font-size: 0.7rem;
  color: #6a7f99;
}

.regimes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.regime-item {
  background: rgba(10, 18, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  transition: all 0.2s;
}

.regime-item.active {
  background: rgba(0, 243, 255, 0.12);
  border-color: #00f3ff;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.2rem;
}

.regime-desc {
  font-size: 0.7rem;
  color: #7e94b0;
  line-height: 1.3;
}

.controls-panel {
  background: rgba(10, 18, 36, 0.6);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.slider-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #a0b6d3;
}

.slider-info .mono {
  font-family: monospace;
  color: #00f3ff;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #00f3ff;
  cursor: pointer;
}

.actions-row {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #00f3ff, #0096c7);
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #dce5f5;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #00f3ff;
}

.btn-reset {
  background: transparent;
  color: #8da4c4;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-reset:hover {
  color: #ff6688;
  border-color: #ff6688;
}

@media (max-width: 650px) {
  .regimes-list {
    grid-template-columns: 1fr;
  }
  .actions-row {
    flex-direction: column;
  }
}
</style>
