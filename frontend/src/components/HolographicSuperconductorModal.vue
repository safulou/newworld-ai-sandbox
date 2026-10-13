<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicSuperconductorEngine, type HolographicSCRegime } from '../engine/holographicSuperconductorAdSRN';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => holographicSuperconductorEngine.getState());

const isOpen = computed(() => uiStore.mode === 'holographic-superconductor');

const regimes: Array<{ id: HolographicSCRegime; label: string; desc: string }> = [
  { id: 'normal-metallic-ads-rn', label: '正常金屬相 (無毛 AdS-RN)', desc: 'T > T_c，純量場未凝聚，邊界呈現費米液體正常金屬歐姆傳導' },
  { id: 'bf-instability-critical-point', label: 'BF 邊界臨界不穩定相', desc: 'T ≈ T_c，近地平線有效質量 m_eff² < -1/4 跌破 BF 穩定極限，毛髮開始萌生' },
  { id: 'hairy-black-hole-condensate', label: '有毛黑洞超導凝聚態', desc: 'T < T_c，複純量場在體態自發凝聚，邊界 ⟨O₂⟩ 自發破缺 U(1) 規範對稱性' },
  { id: 'gap-saturating-superfluid', label: '能隙飽和極限超流相', desc: 'T ≪ T_c，低頻光學電導呈現純狄拉克 δ(ω) 超流奇異點，光學能隙 ω_g 完全開啟' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTRatio(val: number) {
  holographicSuperconductorEngine.setTemperatureRatio(val);
  achievements.unlock('holographic_superconductor');
}

function updateMu(val: number) {
  holographicSuperconductorEngine.setChemicalPotential(val);
  achievements.unlock('holographic_superconductor');
}

function updateCharge(val: number) {
  holographicSuperconductorEngine.setScalarCharge(val);
  achievements.unlock('holographic_superconductor');
}

function triggerPhaseTransition() {
  holographicSuperconductorEngine.triggerPhaseTransition();
  achievements.unlock('holographic_superconductor');
}

function cycleRegime() {
  holographicSuperconductorEngine.cycleRegime();
  achievements.unlock('holographic_superconductor');
}

function reset() {
  holographicSuperconductorEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="holo-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>全息超導與荷電黑洞 AdS-RN 純量凝聚 (Holographic Superconductor)</h2>
            <span class="subtitle">AdS/CFT Duality, Near-Horizon BF Instability, Hairy Black Hole & Optical Energy Gap</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="holo-svg">
            <defs>
              <linearGradient id="adsDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.1" />
                <stop offset="60%" stop-color="#4400aa" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#0a0020" stop-opacity="0.9" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.2" />
                <stop offset="65%" stop-color="#00ffaa" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#ff00bb" stop-opacity="0.9" />
              </linearGradient>
            </defs>

            <!-- 深空背景 -->
            <rect width="800" height="320" fill="#040714" />

            <!-- 左側：AdS 徑向體幾何與純量毛髮分佈 ψ(z) (Bulk AdS-RN & Scalar Hair) -->
            <g transform="translate(60, 40)">
              <rect x="0" y="0" width="340" height="240" rx="8" fill="url(#adsDepthGrad)" stroke="rgba(0, 243, 255, 0.25)" />
              <text x="170" y="24" fill="#00f3ff" font-size="12" font-weight="bold" text-anchor="middle">
                AdS 體幾何純量毛髮 ψ(z) 凝聚分佈
              </text>

              <!-- 邊界 z = 0 (CFT 邊界) -->
              <line x1="20" y1="45" x2="320" y2="45" stroke="#00f3ff" stroke-width="2" />
              <text x="32" y="40" fill="#00f3ff" font-size="9.5">CFT 邊界 (z = 0, μ = {{ state.chemicalPotentialMuGev }} GeV)</text>

              <!-- 黑洞事件地平線 z = z_h (Event Horizon) -->
              <line x1="20" y1="215" x2="320" y2="215" stroke="#ff0055" stroke-width="2.5" stroke-dasharray="5 3" />
              <text x="32" y="230" fill="#ff4d79" font-size="9.5">
                黑洞地平線 (z = z_h, T_H = {{ (state.criticalTemperatureTcGev * state.temperatureRatioTOverTc).toFixed(3) }} GeV)
              </text>

              <!-- BF 邊界警示線 (z ~ z_BF) -->
              <line x1="20" y1="165" x2="320" y2="165" stroke="#ffaa00" stroke-width="1" stroke-dasharray="2 2" />
              <text x="210" y="160" fill="#ffaa00" font-size="9">BF 邊界 (m_eff² = -0.25)</text>

              <!-- 純量毛髮幾何曲線 ψ(z) -->
              <path
                v-if="state.temperatureRatioTOverTc < 1.0"
                :d="`M 20 45 Q 120 70 ${20 + state.scalarHairPeakZ * 260} 150 T 260 215`"
                fill="none"
                stroke="url(#hairGrad)"
                stroke-width="3.5"
              />
              <path
                v-else
                d="M 20 45 L 260 215"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                stroke-dasharray="3 3"
                stroke-width="1.2"
              />

              <!-- 毛髮峰值發光節點 -->
              <circle
                v-if="state.temperatureRatioTOverTc < 1.0"
                :cx="20 + state.scalarHairPeakZ * 260"
                cy="150"
                r="6"
                fill="#00ffaa"
                stroke="#ffffff"
                stroke-width="1.8"
              >
                <animate attributeName="r" values="5;7.5;5" dur="1.8s" repeatCount="indefinite" />
              </circle>

              <text x="170" y="195" fill="#aaccff" font-size="9.5" text-anchor="middle">
                {{ state.bfBoundExceeded ? '🔥 跌破 BF 邊界：自發萌生純量毛髮 (Hairy Horizon)' : '體純量場處於穩定未凝聚態' }}
              </text>
            </g>

            <!-- 右側：全息光學電導譜 Re[σ(ω)] 與光學能隙 (Optical Conductivity Spectrum) -->
            <g transform="translate(440, 40)">
              <rect x="0" y="0" width="300" height="240" rx="8" fill="rgba(8, 12, 28, 0.85)" stroke="rgba(0, 243, 255, 0.25)" />
              <text x="150" y="24" fill="#00ffaa" font-size="12" font-weight="bold" text-anchor="middle">
                全息超導電導光譜 Re[σ(ω)]
              </text>

              <!-- 軸線 -->
              <line x1="35" y1="205" x2="275" y2="205" stroke="#556688" stroke-width="1.5" />
              <line x1="35" y1="45" x2="35" y2="205" stroke="#556688" stroke-width="1.5" />
              <text x="270" y="218" fill="#8899aa" font-size="9.5">ω (GeV)</text>
              <text x="20" y="42" fill="#8899aa" font-size="9.5">Re[σ]</text>

              <!-- 正常態電導 (水平線 T > Tc) -->
              <line x1="35" y1="130" x2="275" y2="130" stroke="#8899aa" stroke-dasharray="3 3" stroke-width="1.5" />
              <text x="180" y="122" fill="#8899aa" font-size="9">正常歐姆電導 σ_n</text>

              <!-- 超導態電導曲線 (帶能隙與超流 δ-峰) -->
              <g v-if="state.temperatureRatioTOverTc < 1.0">
                <!-- 光學能隙吸收曲線 -->
                <path
                  :d="`M 35 205 L ${35 + Math.min(100, state.opticalGapOmegaGGev * 70)} 205 Q ${55 + state.opticalGapOmegaGGev * 70} 145 275 130`"
                  fill="none"
                  stroke="#00ffaa"
                  stroke-width="2.5"
                />

                <!-- 零頻狄拉克 δ(ω) 超流密度奇異尖峰 (Infinite Dirac Peak) -->
                <line x1="36" y1="50" x2="36" y2="205" stroke="#00f3ff" stroke-width="4.5" />
                <polygon points="36,45 32,58 40,58" fill="#00f3ff" />
                <text x="45" y="60" fill="#00f3ff" font-size="9" font-weight="bold">
                  π n_s δ(ω) 超流奇點
                </text>

                <!-- 光學能隙標記線 ω_g -->
                <line
                  :x1="35 + Math.min(100, state.opticalGapOmegaGGev * 70)"
                  y1="195"
                  :x2="35 + Math.min(100, state.opticalGapOmegaGGev * 70)"
                  y2="215"
                  stroke="#ffd000"
                  stroke-width="2"
                />
                <text
                  :x="35 + Math.min(100, state.opticalGapOmegaGGev * 70)"
                  y="190"
                  fill="#ffd000"
                  font-size="9"
                  text-anchor="middle"
                >
                  ω_g ≈ {{ state.opticalGapOmegaGGev }}
                </text>
              </g>

              <text x="150" y="230" fill="#aaccff" font-size="9.5" text-anchor="middle">
                超導序參量 ⟨O₂⟩ = {{ state.orderParameterO2Gev2 }} GeV²
              </text>
            </g>
          </svg>
        </div>

        <!-- 數值指標矩陣 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">臨界溫度 T_c</span>
            <span class="val cyan">{{ state.criticalTemperatureTcGev }} GeV</span>
            <span class="sub">T/T_c = {{ state.temperatureRatioTOverTc }}</span>
          </div>

          <div class="metric-card">
            <span class="label">超導序參量 ⟨O₂⟩</span>
            <span class="val green">{{ state.orderParameterO2Gev2 }} GeV²</span>
            <span class="sub">自發破缺 U(1) 規範對稱性</span>
          </div>

          <div class="metric-card">
            <span class="label">超流密度 n_s</span>
            <span class="val gold">{{ state.superfluidDensityNsGev }} GeV</span>
            <span class="sub">狄拉克奇異點強度 π n_s</span>
          </div>

          <div class="metric-card">
            <span class="label">近地平線有效質量 m_eff²</span>
            <span class="val pink">{{ state.effectiveNearHorizonMass2 }}</span>
            <span class="sub">{{ state.bfBoundExceeded ? '跌破 BF 邊界 (-0.25)' : '符合 BF 穩定界' }}</span>
          </div>
        </div>

        <!-- 相態列表 -->
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

        <!-- 參數控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-info">
              <span>溫度比例 T / T_c (臨界相變點 = 1.0)</span>
              <span class="mono">{{ state.temperatureRatioTOverTc.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              :value="state.temperatureRatioTOverTc"
              @input="updateTRatio(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>邊界化學勢 μ (GeV)</span>
              <span class="mono">{{ state.chemicalPotentialMuGev }} GeV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.2"
              :value="state.chemicalPotentialMuGev"
              @input="updateMu(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>純量場電荷 q</span>
              <span class="mono">{{ state.scalarChargeQ }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              :value="state.scalarChargeQ"
              @input="updateCharge(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 操作按鈕列 -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerPhaseTransition">
            ❄️ 激發超導相變淬火 (0.15 T_c)
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉相態模式
          </button>
          <button class="btn btn-reset" @click="reset">
            ↺ 重置全息幾何
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
  background: rgba(4, 7, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.holo-card {
  background: #080d20;
  border: 1px solid rgba(0, 243, 255, 0.3);
  box-shadow: 0 0 35px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.05);
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
  color: #8397af;
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
  background: #040714;
  border-radius: 10px;
  border: 1px solid rgba(0, 243, 255, 0.25);
  overflow: hidden;
  margin-bottom: 1.2rem;
}

.holo-svg {
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
  background: rgba(12, 20, 42, 0.7);
  border: 1px solid rgba(0, 243, 255, 0.18);
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
.metric-card .val.gold { color: #ffd000; }
.metric-card .val.pink { color: #ff4d79; }

.metric-card .sub {
  font-size: 0.7rem;
  color: #6d84a3;
}

.regimes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.regime-item {
  background: rgba(10, 16, 36, 0.5);
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
  color: #7b93b0;
  line-height: 1.3;
}

.controls-panel {
  background: rgba(10, 16, 36, 0.6);
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
  color: #9cb1ce;
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
