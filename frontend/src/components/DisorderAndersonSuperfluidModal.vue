<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { disorderAndersonEngine, type AndersonSuperfluidRegime } from '../engine/disorderAndersonTopologicalSuperfluid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => disorderAndersonEngine.getState());

const isOpen = computed(() => uiStore.mode === 'disorder-anderson');

const regimes: Array<{ id: AndersonSuperfluidRegime; label: string; desc: string }> = [
  {
    id: 'clean-topological-majorana-extended',
    label: '純淨拓撲馬約拉納擴展相 (W ≪ W_c)',
    desc: '無序強度遠低於拓撲臨界閾值，BdG 超導能隙維持完好，兩端馬約拉納零能模波函數牢固束縛，逆參與率 IPR 接近零，體態呈現離域擴展特徵'
  },
  {
    id: 'critical-multifractal-mobility-edge',
    label: '臨界多重分形遷移率邊緣相 (W ≈ W_c)',
    desc: '無序能標與超導能隙相互競爭達到臨界點，波函數空間分佈展現奇異自相似多重分形波動，非平衡糾纏熵急劇振盪'
  },
  {
    id: 'anderson-localized-trivial-insulator',
    label: '安德森局域化平庸絕緣相 (W > W_c)',
    desc: '強無序破壞拓撲相干性並完全關閉體能隙，所有本徵態呈指數包絡衰減局域化，兩端馬約拉納保護消失，IPR 躍升為局域峰'
  },
  {
    id: 'disorder-driven-topological-anderson',
    label: '無序誘導拓撲安德森超導相 (TAI)',
    desc: '在平庸絕緣體中透過特定中間強度無序重整化自能，反常將有效質量驅入拓撲非平庸區，由無序自發誘發拓撲保護邊界態'
  }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateDisorderStrength(val: number) {
  disorderAndersonEngine.setDisorderStrength(val);
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function updatePairingGap(val: number) {
  disorderAndersonEngine.setPairingGap(val);
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function updateChemicalPotential(val: number) {
  disorderAndersonEngine.setChemicalPotential(val);
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function updateHopping(val: number) {
  disorderAndersonEngine.setHoppingAmplitude(val);
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function triggerQuench() {
  disorderAndersonEngine.triggerQuantumQuench();
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function cycleRegime() {
  disorderAndersonEngine.cycleRegime();
  achievements.unlock('disorder_anderson_topological_superfluid');
}

function reset() {
  disorderAndersonEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="anderson-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌪️</span>
          <div>
            <h2>拓撲超流體安德森局域化 (Anderson Localization in Superfluids)</h2>
            <span class="subtitle">Disorder-Induced Quantum Quench, Multifractality & Majorana Protection</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="anderson-svg">
            <defs>
              <linearGradient id="andersonSubstrateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e1b4b" />
                <stop offset="100%" stop-color="#090d16" />
              </linearGradient>
              <linearGradient id="waveProfileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2" />
              </linearGradient>
              <radialGradient id="majoranaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#facc15" />
                <stop offset="60%" stop-color="#eab308" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#ca8a04" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深色背景與網格 -->
            <rect width="800" height="320" fill="#080c14" />
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 左側：1D 拓撲超導鏈與空間波函數密度分佈 |\psi(x)|^2 -->
            <g transform="translate(40, 50)">
              <!-- 底座框架 -->
              <rect x="0" y="0" width="420" height="230" rx="8" fill="url(#andersonSubstrateGrad)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="210" y="24" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">
                一維拓撲超導鏈空間波函數 |\psi(x)|² 與無序勢能 V(x)
              </text>

              <!-- 基線坐標軸 -->
              <line x1="25" y1="180" x2="395" y2="180" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
              <text x="395" y="195" fill="rgba(255,255,255,0.4)" font-size="9">位置 x (L = 32)</text>
              <text x="25" y="55" fill="rgba(255,255,255,0.4)" font-size="9">機率密度 |\psi|²</text>

              <!-- 32 節點空間直方圖 (柱狀波函數) -->
              <g transform="translate(30, 180)">
                <rect
                  v-for="(val, idx) in state.spatialWavefunctionProfile"
                  :key="'wf-'+idx"
                  :x="idx * 11.2"
                  :y="-Math.min(125, val * 115)"
                  width="8"
                  :height="Math.min(125, val * 115)"
                  fill="url(#waveProfileGrad)"
                  rx="1.5"
                />
              </g>

              <!-- 兩端馬約拉納零能模高亮發光球 (僅在拓撲相顯著) -->
              <g v-if="state.regime === 'clean-topological-majorana-extended' || state.regime === 'disorder-driven-topological-anderson'">
                <circle cx="34" cy="70" r="12" fill="url(#majoranaGlow)" />
                <circle cx="34" cy="70" r="4" fill="#ffffff" />
                <text x="34" y="50" text-anchor="middle" fill="#facc15" font-size="9" font-weight="bold">γ₁ (端點)</text>

                <circle cx="382" cy="70" r="12" fill="url(#majoranaGlow)" />
                <circle cx="382" cy="70" r="4" fill="#ffffff" />
                <text x="382" y="50" text-anchor="middle" fill="#facc15" font-size="9" font-weight="bold">γ₂ (端點)</text>
              </g>

              <!-- 指示文字 -->
              <text x="210" y="215" text-anchor="middle" fill="#38bdf8" font-size="10">
                無序 W = {{ state.disorderStrengthW.toFixed(2) }} meV | 閾值 Wc = {{ state.criticalDisorderThresholdWc.toFixed(2) }} meV
                | {{ state.disorderStrengthW < state.criticalDisorderThresholdWc ? '拓撲保護完好' : '安德森局域化破壞' }}
              </text>
            </g>

            <!-- 右側：逆參與率 IPR、局域化長度與非平衡糾纏熵相圖 -->
            <g transform="translate(490, 50)">
              <rect x="0" y="0" width="270" height="230" rx="8" fill="url(#andersonSubstrateGrad)" stroke="#818cf8" stroke-width="1.5" />
              <text x="135" y="24" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="bold">
                逆參與率 (IPR) 與局域化參數
              </text>

              <!-- IPR 圓環儀表 -->
              <g transform="translate(135, 95)">
                <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8" />
                <circle
                  cx="0"
                  cy="0"
                  r="45"
                  fill="none"
                  :stroke="state.inverseParticipationRatioIPR > 0.4 ? '#f43f5e' : '#38bdf8'"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="282.7"
                  :stroke-dashoffset="282.7 * (1.0 - state.inverseParticipationRatioIPR)"
                  transform="rotate(-90)"
                />
                <text x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">
                  {{ state.inverseParticipationRatioIPR.toFixed(3) }}
                </text>
                <text x="0" y="22" text-anchor="middle" fill="#94a3b8" font-size="8">逆參與率 (IPR)</text>
              </g>

              <!-- 局域化長度與淬火指標卡 -->
              <g transform="translate(25, 160)" font-size="10">
                <rect x="0" y="0" width="220" height="52" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" />
                <text x="10" y="18" fill="#cbd5e1">
                  局域化長度 ξ_loc:
                  <tspan fill="#facc15" font-weight="bold"> {{ state.localizationLengthNm.toFixed(1) }} nm</tspan>
                </text>
                <text x="10" y="34" fill="#cbd5e1">
                  馬約拉納重疊度:
                  <tspan fill="#a78bfa" font-weight="bold"> {{ state.majoranaEndOverlap.toFixed(4) }}</tspan>
                </text>
                <text x="10" y="48" fill="#cbd5e1">
                  淬火糾纏熵:
                  <tspan fill="#38bdf8" font-weight="bold"> {{ state.quenchedEntropyJoulePerK.toFixed(3) }} kB</tspan>
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 關鍵物理量指標卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">無序勢能強度 W</span>
            <span class="val highlight">{{ state.disorderStrengthW.toFixed(2) }} meV</span>
            <span class="sub">臨界閾值 {{ state.criticalDisorderThresholdWc.toFixed(2) }}</span>
          </div>

          <div class="metric-card">
            <span class="label">逆參與率 (IPR)</span>
            <span class="val" :class="{ warning: state.inverseParticipationRatioIPR > 0.4 }">
              {{ state.inverseParticipationRatioIPR.toFixed(3) }}
            </span>
            <span class="sub">{{ state.inverseParticipationRatioIPR > 0.4 ? '高度局域化' : '空間離域' }}</span>
          </div>

          <div class="metric-card">
            <span class="label">局域化長度 ξ_loc</span>
            <span class="val">{{ state.localizationLengthNm.toFixed(1) }} nm</span>
            <span class="sub">指數包絡衰減長度</span>
          </div>

          <div class="metric-card">
            <span class="label">超導配對能隙 Δ</span>
            <span class="val">{{ state.pairingGapDelta.toFixed(2) }} meV</span>
            <span class="sub">p-波拓撲隙</span>
          </div>

          <div class="metric-card">
            <span class="label">化學勢 μ</span>
            <span class="val">{{ state.chemicalPotentialMu.toFixed(2) }} meV</span>
            <span class="sub">費米面調諧</span>
          </div>

          <div class="metric-card">
            <span class="label">馬約拉納重疊度</span>
            <span class="val" :class="{ success: state.majoranaEndOverlap < 0.05 }">
              {{ state.majoranaEndOverlap.toFixed(4) }}
            </span>
            <span class="sub">零能模正交性</span>
          </div>

          <div class="metric-card">
            <span class="label">淬火非平衡糾纏熵</span>
            <span class="val">{{ state.quenchedEntropyJoulePerK.toFixed(3) }} kB</span>
            <span class="sub">拓撲量子信息</span>
          </div>

          <div class="metric-card">
            <span class="label">累計量子淬火次數</span>
            <span class="val">{{ state.accumulatedQuenchesCount }}</span>
            <span class="sub">重採樣次數</span>
          </div>
        </div>

        <!-- 交互調節滑桿群 -->
        <div class="controls-panel">
          <div class="slider-group">
            <div class="slider-header">
              <span>隨機雜質無序強度 W (meV)</span>
              <span class="slider-val">{{ state.disorderStrengthW.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.1"
              :value="state.disorderStrengthW"
              @input="updateDisorderStrength(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.0 (純淨)</span>
              <span>Wc ≈ {{ state.criticalDisorderThresholdWc.toFixed(1) }}</span>
              <span>10.0 (強無序)</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>p-波超導配對能隙 Δ (meV)</span>
              <span class="slider-val">{{ state.pairingGapDelta.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              :value="state.pairingGapDelta"
              @input="updatePairingGap(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.1 meV</span>
              <span>1.0 meV (典型)</span>
              <span>3.0 meV</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>化學勢 μ (meV)</span>
              <span class="slider-val">{{ state.chemicalPotentialMu.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
              step="0.2"
              :value="state.chemicalPotentialMu"
              @input="updateChemicalPotential(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>-4.0 meV</span>
              <span>0.0 meV (中心)</span>
              <span>+4.0 meV</span>
            </div>
          </div>

          <div class="slider-group">
            <div class="slider-header">
              <span>鄰近躍遷振幅 t (meV)</span>
              <span class="slider-val">{{ state.hoppingAmplitudeT.toFixed(2) }} meV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              :value="state.hoppingAmplitudeT"
              @input="updateHopping(parseFloat(($event.target as HTMLInputElement).value))"
            />
            <div class="slider-hints">
              <span>0.5 meV</span>
              <span>2.0 meV (典型)</span>
              <span>5.0 meV</span>
            </div>
          </div>
        </div>

        <!-- 物理相態模式選擇卡 -->
        <div class="regime-section">
          <h3>目前安德森物理相態 (Current Anderson Regime)</h3>
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
          <button class="action-btn primary" @click="triggerQuench">
            ⚡ 觸發隨機無序量子淬火 (Quantum Quench)
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

.anderson-card {
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

.anderson-svg {
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
