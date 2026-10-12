<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { holographicMicrostateEngine, type HoloMicrostateRegime } from '../engine/holographicMicrostateMesh';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => holographicMicrostateEngine.getState());

const isOpen = computed(() => uiStore.mode === 'holo-microstate');

const regimes: Array<{ id: HoloMicrostateRegime; label: string; desc: string }> = [
  { id: 'fuzzball-smooth-microstate', label: '絨毛球平滑微觀態', desc: 'D1-D5-P 弦膜平滑冠帽，消除奇點與視界' },
  { id: 'tensor-network-mera-emergence', label: 'MERA/HaPPY 張量網', desc: '雙曲彭加萊圓盤完美張量體空間幾何湧現' },
  { id: 'multipole-structure-resolution', label: '高階多極矩全息重構', desc: '超重力毛髮解析，突破經典無毛定理' },
  { id: 'gravitational-quantum-echo', label: '量子視界引力波回波', desc: '普朗克尺度邊界量子反射與等間距回波序列' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateDimension(val: number) {
  holographicMicrostateEngine.setParameters({ microstateDimensionLog10: val });
}

function updateCharge(val: number) {
  holographicMicrostateEngine.setParameters({ stringChargeProductQ: val });
}

function updateDepth(val: number) {
  holographicMicrostateEngine.setParameters({ tensorNetworkDepth: val });
}

function updateReflectivity(val: number) {
  holographicMicrostateEngine.setParameters({ echoReflectivityPercent: val });
}

function updateCapRadius(val: number) {
  holographicMicrostateEngine.setParameters({ fuzzballCapRadiusPlanck: val });
}

function selectRegime(regime: HoloMicrostateRegime) {
  holographicMicrostateEngine.setParameters({ regime });
  achievements.unlock('holographic_microstate_mesh');
}

function emitWavepacket() {
  holographicMicrostateEngine.emitEchoWavepacket();
  achievements.unlock('holographic_microstate_mesh');
}

function toggleCap() {
  holographicMicrostateEngine.toggleFuzzballCap();
  achievements.unlock('holographic_microstate_mesh');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="hmm-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🔮</span>
          <div>
            <h2>全息微觀態與弦網重構機 (Holo Microstate Mesh)</h2>
            <span class="subtitle">AdS/CFT Wormhole Microstates, HaPPY Tensor Network & Fuzzball Superstrata</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 全息彭加萊圓盤、HaPPY 張量網與平滑幾何冠帽 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 320" class="hmm-svg">
            <defs>
              <radialGradient id="poincareDisc" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#050814" />
                <stop offset="70%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.3" />
              </radialGradient>
              <radialGradient id="fuzzballCapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#c084fc" stop-opacity="0.9" />
                <stop offset="40%" stop-color="#818cf8" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="echoPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fb7185" />
                <stop offset="50%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#e11d48" />
              </linearGradient>
            </defs>

            <!-- 深邃幾何背景 -->
            <rect x="25" y="20" width="490" height="280" rx="18" fill="#030712" stroke="#6366f1" stroke-width="1.8" />

            <!-- 彭加萊圓盤 (Poincaré Disk) AdS 邊界 -->
            <g transform="translate(270, 160)">
              <circle cx="0" cy="0" r="120" fill="url(#poincareDisc)" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="6 4" opacity="0.85" />

              <!-- MERA / HaPPY 張量網絡多層雙曲晶格 (Hyperbolic Layers) -->
              <circle
                v-for="layer in state.tensorNetworkDepth"
                :key="layer"
                cx="0"
                cy="0"
                :r="25 + (layer * (90 / state.tensorNetworkDepth))"
                fill="none"
                :stroke="layer % 2 === 0 ? '#818cf8' : '#c084fc'"
                :stroke-width="1.2"
                :opacity="0.3 + (layer / state.tensorNetworkDepth) * 0.5"
                :stroke-dasharray="layer % 2 === 0 ? '4 3' : '2 2'"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  :from="layer % 2 === 0 ? '0 0 0' : '360 0 0'"
                  :to="layer % 2 === 0 ? '360 0 0' : '0 0 0'"
                  :dur="`${18 + layer * 3}s`"
                  repeatCount="indefinite"
                />
              </circle>

              <!-- 張量網絡連接節點 (Tensor Nodes) 輻向線 -->
              <line
                v-for="i in 12"
                :key="'spoke-' + i"
                :x1="0"
                :y1="0"
                :x2="115 * Math.cos((i * 30 * Math.PI) / 180)"
                :y2="115 * Math.sin((i * 30 * Math.PI) / 180)"
                stroke="#475569"
                stroke-width="0.8"
                opacity="0.4"
              />

              <!-- Fuzzball 絨毛球平滑超重力冠帽 (Smooth Superstrata Cap) -->
              <circle
                cx="0"
                cy="0"
                :r="state.fuzzballCapRadiusPlanck * 2.8"
                fill="url(#fuzzballCapGlow)"
              >
                <animate attributeName="r" :values="`${state.fuzzballCapRadiusPlanck * 2.8};${state.fuzzballCapRadiusPlanck * 3.3};${state.fuzzballCapRadiusPlanck * 2.8}`" dur="3s" repeatCount="indefinite" />
              </circle>

              <!-- 冠帽中央核心微觀態幾何無奇異點光暈 -->
              <circle cx="0" cy="0" r="12" fill="#e0e7ff" stroke="#a855f7" stroke-width="2.5" opacity="0.9" />

              <!-- 引力波回波脈衝同心環 (Gravitational Echoes) -->
              <circle
                v-if="state.echoReflectivityPercent > 20"
                cx="0"
                cy="0"
                r="65"
                fill="none"
                stroke="url(#echoPulse)"
                stroke-width="2"
                stroke-dasharray="10 6"
                opacity="0.75"
              >
                <animate attributeName="r" values="30;118;30" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>

            <!-- 左上角物理狀態文字 -->
            <text x="45" y="52" fill="#38bdf8" font-size="11" font-weight="bold">
              彭加萊圓盤 HaPPY 張量網絡 (深度 {{ state.tensorNetworkDepth }} 層)
            </text>
            <text x="45" y="70" fill="#94a3b8" font-size="10">
              弦荷 Q = {{ state.stringChargeProductQ }} | 冠帽半徑 r_cap = {{ state.fuzzballCapRadiusPlanck.toFixed(1) }} ℓ_p
            </text>

            <!-- 右下角全息微觀態重構指標 -->
            <text x="495" y="275" fill="#facc15" font-size="10" text-anchor="end">
              回波延遲 Δt_echo = {{ state.echoDelayTimeMilliSec.toFixed(1) }} ms | 反射率 {{ state.echoReflectivityPercent.toFixed(1) }}%
            </text>
            <text x="495" y="255" fill="#c084fc" font-size="10" text-anchor="end">
              貝肯斯坦熵 S = {{ state.microstateEntropyBekenstein.toFixed(1) }} | 多極矩 N_ℓ = {{ state.multipoleMomentsCount }}
            </text>
          </svg>
        </div>

        <!-- 4 大體制切換 -->
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
            <span class="m-label">微觀態熵 S_BH</span>
            <span class="m-val text-purple">{{ state.microstateEntropyBekenstein.toFixed(1) }} k_B</span>
          </div>
          <div class="metric-item">
            <span class="m-label">張量保真度 F</span>
            <span class="m-val text-cyan">{{ (state.tensorContractionFidelity * 100).toFixed(1) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">回波延遲 Δt</span>
            <span class="m-val text-emerald">{{ state.echoDelayTimeMilliSec.toFixed(1) }} ms</span>
          </div>
          <div class="metric-item">
            <span class="m-label">多極矩階數 N_ℓ</span>
            <span class="m-val text-purple">{{ state.multipoleMomentsCount }} 階</span>
          </div>
          <div class="metric-item">
            <span class="m-label">幾何平滑性指數</span>
            <span class="m-val text-cyan">{{ (state.geometricSmoothnessIndex * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric-item">
            <span class="m-label">普朗克反射率</span>
            <span class="m-val text-rose">{{ state.echoReflectivityPercent.toFixed(1) }}%</span>
          </div>
        </div>

        <!-- 參數調節面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-header">
              <span>希爾伯特空間微觀態維度 (log₁₀ D)</span>
              <span class="val">{{ state.microstateDimensionLog10.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.1"
              :value="state.microstateDimensionLog10"
              @input="updateDimension(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>D1-D5-P 弦膜荷乘積 (Q_1 Q_5 Q_p)</span>
              <span class="val">{{ state.stringChargeProductQ }}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1200"
              step="10"
              :value="state.stringChargeProductQ"
              @input="updateCharge(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>HaPPY 全息張量網絡深度 (層級)</span>
              <span class="val">{{ state.tensorNetworkDepth }} 層</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              :value="state.tensorNetworkDepth"
              @input="updateDepth(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>量子視界回波反射率 (%)</span>
              <span class="val">{{ state.echoReflectivityPercent.toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="99.0"
              step="0.5"
              :value="state.echoReflectivityPercent"
              @input="updateReflectivity(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-header">
              <span>絨毛球幾何平滑冠帽半徑 (r_cap, ℓ_p)</span>
              <span class="val">{{ state.fuzzballCapRadiusPlanck.toFixed(1) }} ℓ_p</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              :value="state.fuzzballCapRadiusPlanck"
              @input="updateCapRadius(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 動作按鈕群 -->
        <div class="action-buttons">
          <button class="action-btn primary" @click="emitWavepacket">
            🌊 發射微觀態引力波回波探針序列
          </button>
          <button class="action-btn secondary" @click="toggleCap">
            ✨ 切換絨毛球平滑冠帽 ⇄ 張量幾何湧現
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

.hmm-card {
  width: 90%;
  max-width: 680px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 27, 75, 0.9));
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px 24px;
  background: rgba(30, 27, 75, 0.6);
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
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
  color: #f8fafc;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.75rem;
  color: #a78bfa;
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
  gap: 18px;
}

.svg-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hmm-svg {
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
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.regime-btn:hover {
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(30, 27, 75, 0.4);
}

.regime-btn.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.25));
  border-color: #a855f7;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
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

.text-purple {
  color: #c084fc;
}

.text-cyan {
  color: #38bdf8;
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
  color: #38bdf8;
  font-family: monospace;
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: #8b5cf6;
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
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(168, 85, 247, 0.5);
}

.action-btn.secondary {
  background: rgba(30, 27, 75, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #e2e8f0;
}

.action-btn.secondary:hover {
  background: rgba(49, 46, 129, 0.8);
  border-color: rgba(168, 85, 247, 0.6);
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
