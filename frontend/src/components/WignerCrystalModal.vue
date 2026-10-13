<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { wignerCrystalEngine, type WignerRegime } from '../engine/wignerCrystalQuantumMelting';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => wignerCrystalEngine.getState());

const isOpen = computed(() => uiStore.mode === 'wigner-crystal');

const regimes: Array<{ id: WignerRegime; label: string; desc: string }> = [
  { id: 'hexagonal-wigner-crystal', label: '六角維格納量子固相', desc: 'r_s ≥ 37，庫侖強局域化，具備有限剪切模量' },
  { id: 'kthny-quantum-melting-intermediate', label: 'KTHNY 拓撲缺陷熔化態', desc: '位錯對解離，晶格剛度崩解的中間過渡相' },
  { id: 'quantum-nematic-liquid-crystal', label: '電子向列量子液晶相', desc: '平移對稱恢復但旋轉破缺，巨電導率各向異性' },
  { id: 'correlated-fermi-liquid', label: '等向性強關聯費米液體', desc: '高密度量子流體，動能主導等向性傳輸' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateDensity(val: number) {
  wignerCrystalEngine.compressElectronDensity(val - state.value.electronDensityN10Cm2);
  achievements.unlock('wigner_crystal_quantum_melting');
}

function updateMagnetic(val: number) {
  wignerCrystalEngine.sweepMagneticField(val);
  achievements.unlock('wigner_crystal_quantum_melting');
}

function applyStrain() {
  wignerCrystalEngine.applyInPlaneStrain(0.35);
  achievements.unlock('wigner_crystal_quantum_melting');
}

function pulseDepin() {
  wignerCrystalEngine.pulseDefectDepinning();
  achievements.unlock('wigner_crystal_quantum_melting');
}

function reset() {
  wignerCrystalEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="wigner-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">❄️</span>
          <div>
            <h2>高階維格納晶體量子熔化與向列量子液晶 (Wigner Crystal & Nematic Liquid)</h2>
            <span class="subtitle">2DEG Strong Correlation, KTHNY Defect Melting, Anisotropic Nematicity & Depinning</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 維格納六角點陣、向列液晶指向矢與各向異性橢圓 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="wigner-svg">
            <defs>
              <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1.0" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="anisotropyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#ef4444" />
              </linearGradient>
            </defs>

            <!-- 基底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#040b17" stroke="#38bdf8" stroke-width="1.8" />

            <!-- 左側：二維電子氣六角維格納晶格 (受剪切模量與熔化調製) -->
            <g transform="translate(160, 160)">
              <!-- 背景晶胞保護環 -->
              <circle cx="0" cy="0" r="95" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="4 4" />

              <!-- 六角點陣電子群 (7個晶格點) -->
              <g :transform="state.regime === 'quantum-nematic-liquid-crystal' ? `rotate(${state.directorAngleRad * 57.3})` : 'none'">
                <!-- 中心點 -->
                <circle cx="0" cy="0" r="10" fill="url(#electronGlow)">
                  <animate attributeName="r" values="9;11;9" dur="1.5s" repeatCount="indefinite" />
                </circle>

                <!-- 周圍六角點 -->
                <g v-for="(pt, idx) in [
                  { x: 0, y: -55 }, { x: 48, y: -27.5 }, { x: 48, y: 27.5 },
                  { x: 0, y: 55 }, { x: -48, y: 27.5 }, { x: -48, y: -27.5 }
                ]" :key="idx">
                  <!-- 晶格彈性鍵結線 (熔化時變淡或消失) -->
                  <line
                    x1="0"
                    y1="0"
                    :x2="pt.x"
                    :y2="pt.y"
                    stroke="#38bdf8"
                    :stroke-width="state.latticeShearModulusMu > 0 ? 1.8 : 0.4"
                    :stroke-dasharray="state.regime === 'kthny-quantum-melting-intermediate' ? '4 3' : 'none'"
                    :opacity="state.latticeShearModulusMu > 0 ? 0.75 : 0.2"
                  />
                  <!-- 電子光斑 -->
                  <circle
                    :cx="pt.x + (state.regime === 'correlated-fermi-liquid' ? (idx % 2 === 0 ? 8 : -8) : 0)"
                    :cy="pt.y"
                    :r="state.latticeShearModulusMu > 0 ? 8 : 6"
                    fill="url(#electronGlow)"
                  />
                </g>
              </g>

              <!-- 向列指向矢箭頭 (當處於向列液晶相時) -->
              <g v-if="state.regime === 'quantum-nematic-liquid-crystal' || state.nematicOrderParameterS > 0.3">
                <line
                  :x1="-65 * Math.cos(state.directorAngleRad)"
                  :y1="-65 * Math.sin(state.directorAngleRad)"
                  :x2="65 * Math.cos(state.directorAngleRad)"
                  :y2="65 * Math.sin(state.directorAngleRad)"
                  stroke="#f59e0b"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <circle
                  :cx="65 * Math.cos(state.directorAngleRad)"
                  :cy="65 * Math.sin(state.directorAngleRad)"
                  r="4"
                  fill="#f59e0b"
                />
              </g>
            </g>

            <!-- 右側：電阻率各向異性橢圓與傳輸比例 (ρ_xx / ρ_yy) -->
            <g transform="translate(330, 60)">
              <rect x="0" y="0" width="165" height="200" rx="12" fill="#0b1329" stroke="#1e293b" />
              <text x="12" y="22" fill="#e2e8f0" font-size="11" font-weight="bold">傳輸各向異性橢圓</text>

              <!-- 橢圓可視化 -->
              <g transform="translate(82, 100)">
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="Math.min(70, 25 + state.resistivityAnisotropyRatio * 1.2)"
                  :ry="Math.max(12, 50 / Math.max(1, state.resistivityAnisotropyRatio * 0.25))"
                  :transform="`rotate(${state.directorAngleRad * 57.3})`"
                  fill="none"
                  stroke="url(#anisotropyGrad)"
                  stroke-width="2.5"
                />
                <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
                <line x1="-70" y1="0" x2="70" y2="0" stroke="#475569" stroke-width="0.8" stroke-dasharray="2 2" />
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#475569" stroke-width="0.8" stroke-dasharray="2 2" />
              </g>

              <text x="82" y="172" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">
                ρ_xx / ρ_yy = {{ state.resistivityAnisotropyRatio }}
              </text>
              <text x="82" y="188" fill="#94a3b8" font-size="9" text-anchor="middle">
                向列序參量 S: {{ state.nematicOrderParameterS }}
              </text>
            </g>

            <!-- 底部標籤列 -->
            <g transform="translate(45, 275)">
              <rect x="0" y="0" width="450" height="20" rx="6" fill="#0f172a" />
              <text x="12" y="14" fill="#38bdf8" font-size="10" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }} | 庫侖比 r_s: {{ state.wignerParameterRs }} | 解釘電場: {{ state.depinningThresholdFieldVcm }} V/cm
              </text>
            </g>
          </svg>
        </div>

        <!-- 數據卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">維格納參數 (r_s)</span>
            <span class="m-val highlight">{{ state.wignerParameterRs }}</span>
            <span class="m-sub">結晶臨界值 r_s ≈ 37.0</span>
          </div>

          <div class="metric-card">
            <span class="m-label">電子密度 (n_e)</span>
            <span class="m-val">{{ state.electronDensityN10Cm2 }} × 10¹⁰ cm⁻²</span>
            <span class="m-sub">面載流子濃度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">晶格剪切模量 (μ_s)</span>
            <span class="m-val accent">{{ state.latticeShearModulusMu }}</span>
            <span class="m-sub">固態剛性 10⁻⁶ dyn/cm</span>
          </div>

          <div class="metric-card">
            <span class="m-label">向列序參量 (S)</span>
            <span class="m-val">{{ state.nematicOrderParameterS }}</span>
            <span class="m-sub">旋轉對稱破缺強度</span>
          </div>

          <div class="metric-card">
            <span class="m-label">電阻各向異性 (ρ_xx/ρ_yy)</span>
            <span class="m-val highlight">{{ state.resistivityAnisotropyRatio }}</span>
            <span class="m-sub">巨各向異性電導率</span>
          </div>

          <div class="metric-card">
            <span class="m-label">垂直強磁場 (B)</span>
            <span class="m-val">{{ state.magneticFieldTesla }} T</span>
            <span class="m-sub">微波共振 {{ state.microwaveResonanceFreqGhz }} GHz</span>
          </div>
        </div>

        <!-- 滑桿與控制按鈕 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>電子密度 n_e (0.2 ~ 8.0 × 10¹⁰ cm⁻²): <b>{{ state.electronDensityN10Cm2 }}</b></label>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                :value="state.electronDensityN10Cm2"
                @input="updateDensity(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>垂直強磁場 B (0.0 ~ 14.0 T): <b>{{ state.magneticFieldTesla }} T</b></label>
              <input
                type="range"
                min="0.0"
                max="14.0"
                step="0.2"
                :value="state.magneticFieldTesla"
                @input="updateMagnetic(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="applyStrain">
              📐 施加面內剪切應變 (轉動指向矢)
            </button>
            <button class="action-btn secondary" @click="pulseDepin">
              🌊 微波脈衝解釘滑移位錯
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
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.wigner-card {
  width: 820px;
  max-width: 95vw;
  max-height: 92vh;
  overflow-y: auto;
  background: #060e1a;
  border: 1px solid #38bdf8;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(56, 189, 248, 0.2);
  color: #e2e8f0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 14px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 28px;
}

h2 {
  margin: 0;
  font-size: 19px;
  color: #38bdf8;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f87171;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.wigner-svg {
  width: 100%;
  max-width: 720px;
  height: auto;
  border-radius: 12px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.metric-card {
  background: #0b1329;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 18px;
  font-weight: bold;
  color: #f8fafc;
}

.m-val.highlight {
  color: #38bdf8;
}

.m-val.accent {
  color: #f59e0b;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #0b1329;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
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

.slider-row input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.actions-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #f59e0b;
  color: #020617;
}

.action-btn.primary:hover {
  background: #fbbf24;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

.action-btn.secondary {
  background: #38bdf8;
  color: #020617;
}

.action-btn.secondary:hover {
  background: #7dd3fc;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.action-btn.reset {
  background: #334155;
  color: #cbd5e1;
  margin-left: auto;
}

.action-btn.reset:hover {
  background: #475569;
}
</style>
