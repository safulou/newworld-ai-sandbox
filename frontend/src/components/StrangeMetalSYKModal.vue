<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { strangeMetalSYKEngine, type StrangeMetalRegime } from '../engine/strangeMetalSYKChaos';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => strangeMetalSYKEngine.getState());

const isOpen = computed(() => uiStore.mode === 'strange-metal-syk');

const regimes: Array<{ id: StrangeMetalRegime; label: string; desc: string }> = [
  { id: 'fermi-liquid-sub-planckian', label: '低溫費米液體亞普朗克態', desc: '低溫弱耦合區間，準粒子壽命長 τ ∝ T⁻²，電阻率遵從朗道費米液體 T² 冪律，尚未達到普朗克耗散極限' },
  { id: 'strange-metal-planckian-linear', label: '奇異金屬普朗克極限線性耗散相', desc: '準粒子完全解體，能量耗散速率達到不確定性原理上限 ħ/τ ≈ k_B T，電阻率在極寬溫度範圍內保持純線性 ρ ∝ T' },
  { id: 'syk-fast-scrambling-chaos', label: 'SYK 極限量子混亂與快速爬亂相', desc: '馬約拉納費米子全對全隨機交互作用飽和 MSS 量子混亂上界 λ_L → 2π k_B T / ħ，量子資訊以對數時間 t_scr ∝ ln(N) 迅速爬亂' },
  { id: 'jt-black-hole-holographic-thermal', label: 'JT 引力 AdS₂ 全息黑洞熱化相', desc: '在強耦合共形紅外極限下，SYK 模型精確對偶於二維 Jackiw-Teitelboim (JT) 膨脹子引力極值黑洞視界熱力學' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTemperature(val: number) {
  strangeMetalSYKEngine.setTemperature(val);
  achievements.unlock('strange_metal_syk_chaos');
}

function updateCoupling(val: number) {
  strangeMetalSYKEngine.setSykCoupling(val);
  achievements.unlock('strange_metal_syk_chaos');
}

function updateMajoranaN(val: number) {
  strangeMetalSYKEngine.setMajoranaN(val);
  achievements.unlock('strange_metal_syk_chaos');
}

function triggerScrambling() {
  strangeMetalSYKEngine.triggerFastScrambling();
  achievements.unlock('strange_metal_syk_chaos');
}

function cycleRegime() {
  strangeMetalSYKEngine.cycleRegime();
  achievements.unlock('strange_metal_syk_chaos');
}

function reset() {
  strangeMetalSYKEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="syk-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🔥</span>
          <div>
            <h2>奇異金屬普朗克極限耗散與 SYK 全息混亂 (Strange Metal & SYK)</h2>
            <span class="subtitle">Planckian Dissipation, Sachdev-Ye-Kitaev Random 4-Fermions & MSS Bound Holography</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="syk-svg">
            <defs>
              <linearGradient id="otocWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff0055" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1" />
              </linearGradient>
              <radialGradient id="jtGravityHorizon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="70%" stop-color="#3b0764" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.2" />
              </radialGradient>
            </defs>

            <!-- 深黑背景 -->
            <rect width="800" height="320" fill="#060713" />

            <!-- 左側：SYK 馬約拉納費米子全對全超圖網絡 (SYK Majorana Hypergraph Network) -->
            <g transform="translate(200, 160)">
              <!-- AdS2 全息黑洞底光 -->
              <circle cx="0" cy="0" r="105" fill="url(#jtGravityHorizon)" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="4 4" />

              <!-- 全對全隨機 4-費米子耦合弦 (Random All-to-All Quartic Couplings J_ijkl) -->
              <g stroke="rgba(244, 63, 94, 0.35)" stroke-width="1">
                <!-- 預定義 16 個節點圓環幾何分佈 -->
                <!-- 交叉對角線隨機連線 -->
                <line x1="-80" y1="-40" x2="80" y2="40" stroke="#f59e0b" stroke-opacity="0.5" />
                <line x1="-40" y1="-80" x2="40" y2="80" stroke="#ec4899" stroke-opacity="0.5" />
                <line x1="-90" y1="0" x2="90" y2="0" stroke="#38bdf8" stroke-opacity="0.4" />
                <line x1="0" y1="-90" x2="0" y2="90" stroke="#a855f7" stroke-opacity="0.4" />
                <line x1="-65" y1="-65" x2="65" y2="65" stroke="#f43f5e" stroke-opacity="0.6" />
                <line x1="-65" y1="65" x2="65" y2="-65" stroke="#00f3ff" stroke-opacity="0.5" />
                <line x1="-70" y1="30" x2="50" y2="-75" stroke="#eab308" stroke-opacity="0.4" />
                <line x1="70" y1="30" x2="-50" y2="-75" stroke="#fb7185" stroke-opacity="0.4" />
              </g>

              <!-- OTOC 爬亂波前展開 (OTOC Scrambling Shockwave) -->
              <circle
                cx="0"
                cy="0"
                :r="Math.min(95, 20 + state.mssBoundSaturationRatio * 75)"
                fill="none"
                stroke="#ff0055"
                :stroke-width="state.regime === 'syk-fast-scrambling-chaos' ? 3 : 1.5"
                stroke-dasharray="6 4"
              >
                <animate attributeName="stroke-dashoffset" values="0;-40" dur="1s" repeatCount="indefinite" />
              </circle>

              <!-- 馬約拉納費米子實體節點 (16 個代表點，旋轉分佈) -->
              <g v-for="idx in 12" :key="'maj-'+idx">
                <circle
                  :cx="90 * Math.cos((idx * 2 * Math.PI) / 12)"
                  :cy="90 * Math.sin((idx * 2 * Math.PI) / 12)"
                  r="5.5"
                  :fill="idx % 2 === 0 ? '#00f3ff' : '#f43f5e'"
                  stroke="#ffffff"
                  stroke-width="1.2"
                />
              </g>

              <!-- 中心 JT 黑洞奇點 / 全息中心 -->
              <circle cx="0" cy="0" r="12" fill="#000000" stroke="#f59e0b" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#f59e0b" font-size="9" font-family="monospace">AdS₂</text>

              <text x="0" y="125" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">
                SYK 全對全馬約拉納網絡 (N = {{ state.majoranaFermionsN }})
              </text>
            </g>

            <!-- 右側：奇異金屬線性電阻率與普朗克極限耗散曲線 (T-linear vs T² Graph) -->
            <g transform="translate(450, 40)">
              <!-- 坐標軸 -->
              <rect width="310" height="230" fill="rgba(15, 23, 42, 0.4)" rx="6" stroke="rgba(100, 116, 139, 0.3)" />
              <line x1="45" y1="190" x2="290" y2="190" stroke="#64748b" stroke-width="1.5" />
              <line x1="45" y1="190" x2="45" y2="25" stroke="#64748b" stroke-width="1.5" />

              <text x="290" y="205" text-anchor="end" fill="#94a3b8" font-size="10" font-family="monospace">溫度 T (K)</text>
              <text x="40" y="20" fill="#94a3b8" font-size="10" font-family="monospace">電阻率 ρ (μΩ·cm)</text>

              <!-- 費米液體 T² 曲線 (藍色虛線) -->
              <path
                d="M 45 185 Q 120 180, 280 60"
                stroke="#38bdf8"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                fill="none"
              />
              <text x="230" y="55" fill="#38bdf8" font-size="10">費米液體 ρ ∝ T²</text>

              <!-- 奇異金屬 T-線性電阻率 (紅色實線，斜率正比於普朗克極限常數 C) -->
              <line
                x1="45"
                y1="180"
                x2="280"
                :y2="Math.max(40, 180 - state.linearResistivityMicroOhmCm * 1.6)"
                stroke="#f43f5e"
                stroke-width="2.5"
              />
              <text x="200" y="115" fill="#f43f5e" font-size="10" font-weight="bold">
                奇異金屬 ρ(T) = ρ₀ + A·T
              </text>

              <!-- 當前工作點標示點 -->
              <circle
                :cx="Math.min(275, 45 + (state.temperatureKelvin / 250) * 235)"
                :cy="Math.max(45, 180 - (state.linearResistivityMicroOhmCm / 150) * 135)"
                r="6"
                fill="#f59e0b"
                stroke="#ffffff"
                stroke-width="2"
              />
              <text
                :x="Math.min(240, 55 + (state.temperatureKelvin / 250) * 235)"
                :y="Math.max(40, 170 - (state.linearResistivityMicroOhmCm / 150) * 135)"
                fill="#facc15"
                font-size="11"
                font-weight="bold"
              >
                T = {{ state.temperatureKelvin.toFixed(0) }} K | ρ = {{ state.linearResistivityMicroOhmCm.toFixed(1) }}
              </text>

              <!-- 普朗克極限時間數值標記 -->
              <text x="55" y="50" fill="#00f3ff" font-size="11" font-family="monospace">
                普朗克散射時間: τ_P = {{ state.planckianScatteringTimeFs }} fs
              </text>
              <text x="55" y="70" fill="#c084fc" font-size="11" font-family="monospace">
                MSS 界飽和度: {{ (state.mssBoundSaturationRatio * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- 底部狀態條 -->
            <rect x="20" y="275" width="280" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#f43f5e" stroke-width="1" />
            <text x="30" y="295" fill="#fb7185" font-size="12" font-family="monospace">
              相態: {{ state.regime }}
            </text>

            <rect x="520" y="275" width="260" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#00f3ff" stroke-width="1" />
            <text x="530" y="295" fill="#38bdf8" font-size="12" font-family="monospace">
              量子爬亂時間: t_scr = {{ state.scramblingTimeFs }} fs
            </text>
          </svg>
        </div>

        <!-- 物理核心指標卡片面板 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">普朗克極限散射時間 (τ_Planck)</span>
            <div class="val-unit">
              <span class="value text-cyan">{{ state.planckianScatteringTimeFs.toFixed(1) }}</span>
              <span class="unit">fs</span>
            </div>
            <span class="desc">ħ / (C · k_B · T) 極限鬆弛</span>
          </div>

          <div class="metric-card">
            <span class="label">MSS 界飽和比 (λ_L / λ_MSS)</span>
            <div class="val-unit">
              <span class="value text-rose">{{ (state.mssBoundSaturationRatio * 100).toFixed(1) }}</span>
              <span class="unit">%</span>
            </div>
            <span class="desc">極限混亂 λ_MSS = 2π k_B T / ħ</span>
          </div>

          <div class="metric-card">
            <span class="label">線性電阻率 (ρ_linear)</span>
            <div class="val-unit">
              <span class="value text-amber">{{ state.linearResistivityMicroOhmCm.toFixed(1) }}</span>
              <span class="unit">μΩ·cm</span>
            </div>
            <span class="desc">純 T-線性奇異金屬耗散</span>
          </div>

          <div class="metric-card">
            <span class="label">信息爬亂時間 (t_scramble)</span>
            <div class="val-unit">
              <span class="value text-purple">{{ state.scramblingTimeFs.toFixed(1) }}</span>
              <span class="unit">fs</span>
            </div>
            <span class="desc">t_scr ≈ (1/λ_L) · ln(N)</span>
          </div>
        </div>

        <!-- 控制滑桿與操作按鈕 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-group">
              <label>系統溫度 (T): <strong>{{ state.temperatureKelvin.toFixed(1) }} K</strong></label>
              <input
                type="range"
                min="1.0"
                max="250.0"
                step="1.0"
                :value="state.temperatureKelvin"
                @input="updateTemperature(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>SYK 4-費米子耦合 (J): <strong>{{ state.sykCouplingJEv.toFixed(2) }} eV</strong></label>
              <input
                type="range"
                min="0.10"
                max="2.50"
                step="0.05"
                :value="state.sykCouplingJEv"
                @input="updateCoupling(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>馬約拉納費米子數量 (N): <strong>{{ state.majoranaFermionsN }}</strong></label>
              <input
                type="range"
                min="16"
                max="512"
                step="16"
                :value="state.majoranaFermionsN"
                @input="updateMajoranaN(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="btn btn-danger" @click="triggerScrambling">
              🔥 激發極限量子爬亂 (Trigger Fast Scrambling)
            </button>
            <button class="btn btn-primary" @click="cycleRegime">
              🔄 輪轉物理相態
            </button>
            <button class="btn btn-secondary" @click="reset">
              ↺ 重置奇異金屬態
            </button>
          </div>
        </div>

        <!-- 相態與理論詳細說明卡片 -->
        <div class="regime-info-card">
          <h4>當前物理相態說明</h4>
          <div class="regime-list">
            <div
              v-for="reg in regimes"
              :key="reg.id"
              class="regime-item"
              :class="{ active: state.regime === reg.id }"
            >
              <div class="regime-title">{{ reg.label }}</div>
              <div class="regime-desc">{{ reg.desc }}</div>
            </div>
          </div>
          <div class="formula-box">
            <div class="formula-title">物理理論公式 (Theoretical Physics Formulae):</div>
            <p>1. 普朗克耗散極限 (Planckian Dissipation)：$$\frac{\hbar}{\tau} \approx C k_B T, \quad C \sim \mathcal{O}(1)$$ 準粒子概念失效，電阻率呈現普遍斜率 $\rho(T) = \rho_0 + A T$。</p>
            <p>2. MSS 量子混亂上界 (Maldacena-Shenker-Stanford Bound)：$$\lambda_L \le \frac{2\pi k_B T}{\hbar}$$ SYK 模型與強引力黑洞均以最大速率飽和此界限。</p>
            <p>3. 快速量子爬亂時間 (Fast Scrambling Time)：$$t_{\text{scramble}} = \frac{1}{\lambda_L} \ln N$$ 黑洞與 SYK 系統是自然界中最高效的量子資訊打亂器。</p>
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
  background: rgba(3, 4, 12, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.syk-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #090a16;
  border: 1px solid rgba(244, 63, 94, 0.35);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(244, 63, 94, 0.2), inset 0 0 15px rgba(244, 63, 94, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e2e8f0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(30, 10, 20, 0.85);
  border-bottom: 1px solid rgba(244, 63, 94, 0.25);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon {
  font-size: 1.8rem;
}

.title-group h2 {
  font-size: 1.25rem;
  margin: 0;
  color: #fb7185;
  font-weight: 700;
}

.subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: monospace;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.content-body {
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.visualizer-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(244, 63, 94, 0.3);
  background: #060713;
}

.syk-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.metric-card {
  background: rgba(26, 12, 22, 0.65);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-card .label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.val-unit {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.val-unit .value {
  font-size: 1.35rem;
  font-weight: bold;
  font-family: monospace;
}

.val-unit .unit {
  font-size: 0.75rem;
  color: #64748b;
}

.metric-card .desc {
  font-size: 0.7rem;
  color: #64748b;
}

.text-cyan { color: #00f3ff; }
.text-rose { color: #fb7185; }
.text-amber { color: #f59e0b; }
.text-purple { color: #c084fc; }

.controls-panel {
  background: rgba(26, 12, 22, 0.55);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.slider-group label {
  font-size: 0.8rem;
  color: #cbd5e1;
}

.slider-group input[type="range"] {
  accent-color: #f43f5e;
  cursor: pointer;
}

.actions-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-danger {
  background: linear-gradient(135deg, #f43f5e, #be123c);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.35);
}

.btn-danger:hover {
  filter: brightness(1.15);
}

.btn-primary {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #ffffff;
}

.btn-primary:hover {
  filter: brightness(1.15);
}

.btn-secondary {
  background: rgba(51, 65, 85, 0.8);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.btn-secondary:hover {
  background: rgba(71, 85, 105, 0.9);
  color: #ffffff;
}

.regime-info-card {
  background: rgba(26, 12, 22, 0.55);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-radius: 8px;
  padding: 1rem;
}

.regime-info-card h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #fb7185;
}

.regime-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.regime-item {
  background: rgba(18, 10, 16, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
  transition: all 0.2s;
}

.regime-item.active {
  border-color: #f43f5e;
  background: rgba(244, 63, 94, 0.12);
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.18);
}

.regime-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
}

.regime-desc {
  font-size: 0.7rem;
  color: #94a3b8;
  line-height: 1.35;
}

.formula-box {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px dashed rgba(100, 116, 139, 0.3);
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.45;
}

.formula-title {
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.25rem;
}
</style>
