<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { quantumMetricSuperfluidEngine, type QuantumMetricRegime } from '../engine/quantumMetricSuperfluid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => quantumMetricSuperfluidEngine.getState());

const isOpen = computed(() => uiStore.mode === 'quantum-metric');

const regimes: Array<{ id: QuantumMetricRegime; label: string; desc: string }> = [
  { id: 'quantum-metric-geometric-superfluid', label: '幾何度規超流主導相', desc: '富比尼-斯特迪度規 D_s 突破 BCS 平帶失效' },
  { id: 'fubini-study-flat-band-bound', label: '量子度規剛度理論下界', desc: '飽和 D_s ≥ (4e²/ħ) ∫√det(g) d²k' },
  { id: 'berry-curvature-anomalous-diamagnet', label: '莫爾反常軌道抗磁相', desc: '非阿貝爾假自旋反常巨抗磁磁化率' },
  { id: 'moire-pseudospin-texture-vortex', label: '假自旋紋理拓撲渦旋', desc: '莫爾微胞超導相干幾何渦旋點陣' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateAngle(val: number) {
  quantumMetricSuperfluidEngine.setParameters({ twistAngleDegrees: val });
}

function updateMetricG(val: number) {
  quantumMetricSuperfluidEngine.setParameters({ quantumMetricIntegralG: val });
}

function updateBandwidth(val: number) {
  quantumMetricSuperfluidEngine.setParameters({ effectiveBandwidthWMev: val });
}

function updatePairing(val: number) {
  quantumMetricSuperfluidEngine.setParameters({ pairingPotentialUMev: val });
}

function updateDensity(val: number) {
  quantumMetricSuperfluidEngine.setParameters({ carrierDensityE12Cm2: val });
}

function selectRegime(regime: QuantumMetricRegime) {
  quantumMetricSuperfluidEngine.setParameters({ regime });
  achievements.unlock('quantum_metric_superfluid');
}

function tuneMagic() {
  quantumMetricSuperfluidEngine.tuneToMagicAngle();
  achievements.unlock('quantum_metric_superfluid');
}

function pulseFlux() {
  quantumMetricSuperfluidEngine.pulseGeometricFlux();
  achievements.unlock('quantum_metric_superfluid');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="qms-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>莫爾平帶量子度規幾何超流反應堆 (Quantum Metric Superfluid)</h2>
            <span class="subtitle">Fubini-Study Quantum Metric, Flat-Band Superfluid Weight & Magic Angle 1.08°</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 莫爾超晶格幾何度規與超流剛度對比 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="qms-svg">
            <defs>
              <radialGradient id="moireCellGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="metricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="50%" stop-color="#10b981" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>

            <!-- 莫爾超晶格底板 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#020817" stroke="#06b6d4" stroke-width="1.8" />

            <!-- 六角莫爾微胞陣列 (Moiré Superlattice Hexagons) -->
            <g transform="translate(200, 160)">
              <circle cx="0" cy="0" r="95" fill="url(#moireCellGlow)" />

              <!-- 莫爾晶格干涉六角網 -->
              <polygon
                points="0,-75 65,-37.5 65,37.5 0,75 -65,37.5 -65,-37.5"
                fill="none"
                stroke="#06b6d4"
                stroke-width="2"
                stroke-dasharray="6 4"
                opacity="0.85"
              >
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="40s" repeatCount="indefinite" />
              </polygon>

              <polygon
                points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5"
                fill="none"
                stroke="#10b981"
                stroke-width="1.5"
                opacity="0.75"
              >
                <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="25s" repeatCount="indefinite" />
              </polygon>

              <!-- AA 堆疊核心超導凝結光斑 -->
              <circle cx="0" cy="0" r="16" fill="#38bdf8" stroke="#ffffff" stroke-width="2.2">
                <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="4" fill="#082f49" font-size="9" font-weight="bold" text-anchor="middle">AA-核</text>
            </g>

            <!-- 右側 D_s 幾何超流剛度 vs 常規 BCS 剛度直條對比 -->
            <g transform="translate(370, 75)">
              <text x="0" y="15" fill="#e2e8f0" font-size="11" font-weight="bold">超流剛度機制對比 (D_s)</text>

              <!-- 幾何剛度 (長條) -->
              <rect x="0" y="30" width="130" height="20" rx="6" fill="#1e293b" />
              <rect
                x="0"
                y="30"
                :width="Math.min(130, state.geometricSuperfluidWeightDs * 2.8)"
                height="20"
                rx="6"
                fill="url(#metricGrad)"
              />
              <text x="135" y="45" fill="#06b6d4" font-size="10" font-weight="bold">
                {{ state.geometricSuperfluidWeightDs.toFixed(1) }} meV (幾何)
              </text>

              <!-- 常規 BCS 剛度 (極短條) -->
              <rect x="0" y="65" width="130" height="20" rx="6" fill="#1e293b" />
              <rect
                x="0"
                y="65"
                :width="Math.min(130, state.conventionalBcsWeightDs * 2.8)"
                height="20"
                rx="6"
                fill="#f43f5e"
              />
              <text x="135" y="80" fill="#f43f5e" font-size="10" font-weight="bold">
                {{ state.conventionalBcsWeightDs.toFixed(1) }} meV (BCS)
              </text>

              <!-- 幾何剛度佔比指示 -->
              <text x="0" y="115" fill="#facc15" font-size="10" font-weight="bold">
                幾何度規貢獻比: {{ state.geometricDominanceRatioPercent.toFixed(1) }}%
              </text>
              <text x="0" y="135" fill="#94a3b8" font-size="9">
                魔角 θ = {{ state.twistAngleDegrees.toFixed(2) }}° (偏離 Δθ = {{ Math.abs(state.twistAngleDegrees - 1.08).toFixed(2) }}°)
              </text>
            </g>

            <!-- 左側標註 -->
            <text x="45" y="52" fill="#06b6d4" font-size="11" font-weight="bold">
              魔角莫爾量子幾何張量 (∫g d²k = {{ state.quantumMetricIntegralG.toFixed(1) }})
            </text>
            <text x="45" y="70" fill="#94a3b8" font-size="10">
              能寬 W = {{ state.effectiveBandwidthWMev.toFixed(1) }} meV | 配對 U = {{ state.pairingPotentialUMev.toFixed(0) }} meV
            </text>

            <!-- 底部標註 -->
            <text x="495" y="275" fill="#38bdf8" font-size="10" text-anchor="end">
              臨界超電流 I_c = {{ state.superfluidCriticalCurrentMicroAmp.toFixed(1) }} μA | 載流子 {{ state.carrierDensityE12Cm2.toFixed(1) }}×10¹² cm⁻²
            </text>
            <text x="495" y="255" fill="#10b981" font-size="10" text-anchor="end">
              反常軌道抗磁率 χ_dia = {{ state.orbitalDiamagneticSusceptibility.toFixed(1) }}×10⁻⁵
            </text>
          </svg>
        </div>

        <!-- 4 大相態體制按鈕 -->
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
            <span class="m-label">幾何超流剛度 D_s</span>
            <span class="m-val text-cyan">{{ state.geometricSuperfluidWeightDs.toFixed(1) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">幾何剛度貢獻比</span>
            <span class="m-val text-gold">{{ state.geometricDominanceRatioPercent.toFixed(1) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">臨界超電流 I_c</span>
            <span class="m-val text-emerald">{{ state.superfluidCriticalCurrentMicroAmp.toFixed(1) }} μA</span>
          </div>
          <div class="metric-item">
            <span class="m-label">量子度規積分 ∫g</span>
            <span class="m-val text-cyan">{{ state.quantumMetricIntegralG.toFixed(1) }}</span>
          </div>
          <div class="metric-item">
            <span class="m-label">常規 BCS 剛度</span>
            <span class="m-val text-rose">{{ state.conventionalBcsWeightDs.toFixed(1) }} meV</span>
          </div>
          <div class="metric-item">
            <span class="m-label">反常軌道抗磁率</span>
            <span class="m-val text-emerald">{{ state.orbitalDiamagneticSusceptibility.toFixed(1) }}×10⁻⁵</span>
          </div>
        </div>

        <!-- 參數調節面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>莫爾扭轉角 (θ, 度, 魔角 1.08°)</span>
              <span class="val">{{ state.twistAngleDegrees.toFixed(2) }}°</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.80"
              step="0.01"
              :value="state.twistAngleDegrees"
              @input="updateAngle(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>量子度規布里淵區積分 (∫g d²k)</span>
              <span class="val">{{ state.quantumMetricIntegralG.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12.0"
              step="0.1"
              :value="state.quantumMetricIntegralG"
              @input="updateMetricG(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>莫爾扁帶能寬 (W, meV)</span>
              <span class="val">{{ state.effectiveBandwidthWMev.toFixed(1) }} meV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="30.0"
              step="0.5"
              :value="state.effectiveBandwidthWMev"
              @input="updateBandwidth(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>庫珀對吸引相互作用 (U, meV)</span>
              <span class="val">{{ state.pairingPotentialUMev.toFixed(0) }} meV</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="40.0"
              step="1.0"
              :value="state.pairingPotentialUMev"
              @input="updatePairing(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>載流子面密度 (n_e, 10¹² cm⁻²)</span>
              <span class="val">{{ state.carrierDensityE12Cm2.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.1"
              :value="state.carrierDensityE12Cm2"
              @input="updateDensity(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="tuneMagic">
            🎯 鎖定魔角 1.08° 並極大化量子幾何度規
          </button>
          <button class="action-btn secondary" @click="pulseFlux">
            🌀 注入莫爾幾何相干通量脈衝
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
  animation: fadeIn 0.25s ease-out;
}

.qms-card {
  width: 90%;
  max-width: 680px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(4, 28, 48, 0.9));
  border: 1px solid rgba(6, 182, 212, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px 24px;
  background: rgba(4, 28, 48, 0.6);
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon {
  font-size: 28px;
}

h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ecfeff;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.75rem;
  color: #67e8f9;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
}

.content-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.qms-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5));
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.regime-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.regime-btn:hover {
  border-color: rgba(6, 182, 212, 0.5);
  background: rgba(4, 28, 48, 0.4);
}

.regime-btn.active {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.25));
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.regime-desc {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 3px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
}

.m-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-top: 4px;
}

.text-cyan {
  color: #06b6d4;
}

.text-gold {
  color: #facc15;
}

.text-emerald {
  color: #34d399;
}

.text-rose {
  color: #fb7185;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.4);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.slider-header .val {
  color: #06b6d4;
  font-family: monospace;
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: #06b6d4;
  background: rgba(255, 255, 255, 0.1);
  height: 6px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 10px;
}

.action-btn {
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(8, 145, 178, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(6, 182, 212, 0.5);
}

.action-btn.secondary {
  background: rgba(4, 28, 48, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.4);
  color: #cffafe;
}

.action-btn.secondary:hover {
  background: rgba(8, 42, 70, 0.8);
  border-color: rgba(6, 182, 212, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
