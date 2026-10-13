<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { twistedPolaritonEngine, type TwistedPolaritonRegime } from '../engine/twistedPolaritonFlatBand';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => twistedPolaritonEngine.getState());

const isOpen = computed(() => uiStore.mode === 'twisted-polariton');

const regimes: Array<{ id: TwistedPolaritonRegime; label: string; desc: string }> = [
  { id: 'flat-band-slow-light-condensation', label: '莫爾平帶慢光 BEC 凝聚相', desc: '群速度 v_g→0，有效質量發散，低閾值玻色凝聚' },
  { id: 'pseudospin-vortex-soliton', label: '假自旋拓撲半孤子漩渦相', desc: 'TE-TM 自旋軌道耦合誘發反常拓撲電荷光學流' },
  { id: 'strong-coupling-rabi-splitting', label: '超強耦合拉比分裂飽和相', desc: '激子-微腔光子巨雜化能級分裂 ℏΩ_R' },
  { id: 'linear-dispersive-polariton', label: '線性色散弱泵浦相', desc: '遠離魔角或低功率常規色散極化激元' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTwist(val: number) {
  twistedPolaritonEngine.setTwistAngle(val);
  achievements.unlock('twisted_polariton_flat_band');
}

function updateDetuning(val: number) {
  twistedPolaritonEngine.tuneCavityResonance(val - state.value.cavityDetuningDeltaMev);
  achievements.unlock('twisted_polariton_flat_band');
}

function pulsePump() {
  twistedPolaritonEngine.pulseOpticalPump(15.0);
  achievements.unlock('twisted_polariton_flat_band');
}

function triggerSoliton() {
  twistedPolaritonEngine.triggerSolitonVortex();
  achievements.unlock('twisted_polariton_flat_band');
}

function reset() {
  twistedPolaritonEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="polariton-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌈</span>
          <div>
            <h2>扭轉多層光子晶體拓撲平帶極化激元 (Twisted Polariton Flat-Band)</h2>
            <span class="subtitle">Moiré Photonic Superlattice, Slow Light Dispersion, Polariton BEC & Half-Solitons</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 莫爾光子平帶、反交叉色散與 BEC 慢光漩渦 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="polariton-svg">
            <defs>
              <radialGradient id="becGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#818cf8" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="polaritonRabiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ec4899" />
                <stop offset="50%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
            </defs>

            <!-- 腔體底板背景 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#030712" stroke="#38bdf8" stroke-width="1.8" />

            <!-- 左側：莫爾微腔干涉與玻色-愛因斯坦凝聚態光斑 -->
            <g transform="translate(160, 160)">
              <!-- BEC 相干光暈 -->
              <circle cx="0" cy="0" :r="30 + (state.becCondensateFractionPercent * 0.65)" fill="url(#becGlow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
              </circle>

              <!-- 兩層扭轉布拉格光子晶體微柵干涉 (以 twistAngleDeg 旋轉) -->
              <g :transform="`rotate(${-state.twistAngleDeg * 12})`" opacity="0.65">
                <circle cx="0" cy="0" r="80" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" />
                <line x1="-80" y1="0" x2="80" y2="0" stroke="#38bdf8" stroke-width="1.2" />
                <line x1="0" y1="-80" x2="0" y2="80" stroke="#38bdf8" stroke-width="1.2" />
                <line x1="-56" y1="-56" x2="56" y2="56" stroke="#38bdf8" stroke-width="1.2" />
                <line x1="-56" y1="56" x2="56" y2="-56" stroke="#38bdf8" stroke-width="1.2" />
              </g>

              <g :transform="`rotate(${state.twistAngleDeg * 12})`" opacity="0.75">
                <circle cx="0" cy="0" r="65" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="6 3" />
                <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="#ec4899" stroke-width="1.5" />
              </g>

              <!-- 中心凝聚核與半孤子漩渦指示 -->
              <circle cx="0" cy="0" r="16" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5">
                <animate attributeName="r" values="14;18;14" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="4" fill="#082f49" font-size="9" font-weight="bold" text-anchor="middle">BEC-核</text>

              <!-- 慢光波包軌道 -->
              <circle
                cx="0"
                cy="0"
                r="45"
                fill="none"
                stroke="#fbbf24"
                stroke-width="1.8"
                stroke-dasharray="8 6"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  :dur="`${Math.max(2, 60 * state.groupVelocityNormalized)}s`"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            <!-- 右側：上/下極化激元反交叉色散能譜 (Rabi Splitting) -->
            <g transform="translate(325, 60)">
              <rect x="0" y="0" width="170" height="200" rx="12" fill="#0f172a" stroke="#334155" />
              <text x="12" y="24" fill="#e2e8f0" font-size="11" font-weight="bold">極化激元能譜色散 E(k)</text>

              <!-- 坐標軸 -->
              <line x1="20" y1="160" x2="155" y2="160" stroke="#475569" stroke-width="1.2" />
              <line x1="87" y1="35" x2="87" y2="165" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
              <text x="87" y="175" fill="#64748b" font-size="9" text-anchor="middle">k = 0</text>

              <!-- 上極化激元曲線 (UP) -->
              <path
                d="M 25 65 Q 87 105 150 65"
                fill="none"
                stroke="#ec4899"
                stroke-width="2.4"
              />
              <text x="125" y="60" fill="#ec4899" font-size="9" font-weight="bold">UP</text>

              <!-- 下極化激元平帶曲線 (LP - 平帶受魔角 1.80° 調製) -->
              <path
                :d="`M 25 ${145 - state.groupVelocityNormalized * 150} Q 87 ${135} 150 ${145 - state.groupVelocityNormalized * 150}`"
                fill="none"
                stroke="#38bdf8"
                stroke-width="2.8"
              />
              <text x="125" y="130" fill="#38bdf8" font-size="9" font-weight="bold">LP (平帶)</text>

              <!-- 拉比分裂 ℏΩ_R 雙箭頭標註 -->
              <line x1="87" y1="105" x2="87" y2="135" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="2 2" />
              <text x="96" y="122" fill="#fbbf24" font-size="9" font-weight="bold">ℏΩ_R: {{ state.rabiSplittingOmegaRMev }} meV</text>
            </g>

            <!-- 底部狀態標籤 -->
            <g transform="translate(45, 275)">
              <rect x="0" y="0" width="450" height="20" rx="6" fill="#1e293b" />
              <text x="12" y="14" fill="#38bdf8" font-size="10" font-weight="bold">
                當前相態: {{ regimes.find(r => r.id === state.regime)?.label }} | 群速度: {{ (state.groupVelocityNormalized * 100).toFixed(3) }}% c | 拓撲電荷: Q={{ state.solitonTopologicalCharge }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">扭轉角度 (θ)</span>
            <span class="m-val highlight">{{ state.twistAngleDeg }}°</span>
            <span class="m-sub">魔角 1.80° 對齊</span>
          </div>

          <div class="metric-card">
            <span class="m-label">慢光群速度 (v_g / c)</span>
            <span class="m-val">{{ (state.groupVelocityNormalized * 100).toFixed(3) }}%</span>
            <span class="m-sub">色散平帶延遲率</span>
          </div>

          <div class="metric-card">
            <span class="m-label">BEC 凝聚態佔比</span>
            <span class="m-val accent">{{ state.becCondensateFractionPercent }}%</span>
            <span class="m-sub">宏觀相干玻色流</span>
          </div>

          <div class="metric-card">
            <span class="m-label">臨界泵浦閾值 (P_th)</span>
            <span class="m-val">{{ state.thresholdPumpPowerMilliWatt }} mW</span>
            <span class="m-sub">平帶激發閾值抑制</span>
          </div>

          <div class="metric-card">
            <span class="m-label">二階相干度 g^(2)(0)</span>
            <span class="m-val">{{ state.secondOrderCoherenceG2 }}</span>
            <span class="m-sub">1.0 飽和完全相干</span>
          </div>

          <div class="metric-card">
            <span class="m-label">拓撲半孤子荷 (Q)</span>
            <span class="m-val">{{ state.solitonTopologicalCharge }}</span>
            <span class="m-sub">TE-TM 假自旋環</span>
          </div>
        </div>

        <!-- 相態選擇與控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>扭轉角 θ (0.5° ~ 5.0°): <b>{{ state.twistAngleDeg }}°</b></label>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.05"
                :value="state.twistAngleDeg"
                @input="updateTwist(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>微腔失諧量 δ (-15 ~ +15 meV): <b>{{ state.cavityDetuningDeltaMev }} meV</b></label>
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                :value="state.cavityDetuningDeltaMev"
                @input="updateDetuning(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="pulsePump">
              🚀 注入脈衝泵浦光 (+15 mW)
            </button>
            <button class="action-btn secondary" @click="triggerSoliton">
              🌀 激發假自旋半孤子渦旋
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

.polariton-card {
  width: 820px;
  max-width: 95vw;
  max-height: 92vh;
  overflow-y: auto;
  background: #090d16;
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

.polariton-svg {
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
  background: #0f172a;
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
  color: #a855f7;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #0f172a;
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
  background: #38bdf8;
  color: #020617;
}

.action-btn.primary:hover {
  background: #7dd3fc;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.action-btn.secondary {
  background: #8b5cf6;
  color: #ffffff;
}

.action-btn.secondary:hover {
  background: #a78bfa;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
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
