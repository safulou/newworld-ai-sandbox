<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { blackHoleSuperradianceEngine, type SuperradianceRegime } from '../engine/blackHoleSuperradianceAxion';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => blackHoleSuperradianceEngine.getState());

const isOpen = computed(() => uiStore.mode === 'black-hole-superradiance');

const regimes: Array<{ id: SuperradianceRegime; label: string; desc: string }> = [
  { id: 'exponential-superradiant-instability', label: '指數級超輻射不穩定增長相', desc: '超輕軸子玻色子波在旋轉克爾黑洞能層發生彭羅斯式能量抽取，粒子數按 exp(Γ_SR · t) 指數暴增形成巨型引力原子凝聚星雲' },
  { id: 'continuous-gravitational-wave-hum', label: '連續單色引力波長鳴相', desc: '軸子星雲質量達標，軸子雙體湮滅發射連續單色四極引力波 (f_GW ≈ 2 f_axion)，使黑洞自旋持久平緩減速 (Spin-down)' },
  { id: 'bosenova-explosive-collapse', label: '玻色新星 (Bosenova) 內爆星震相', desc: '星雲質量突破引力自吸引崩潰極限 M_crit，星雲發生劇烈非線性自吸引坍縮，部分軸子墜入視界並引發強烈引力波突發爆發' },
  { id: 'quiescent-kerr-horizon', label: '亞臨界寧靜克爾黑洞相', desc: '黑洞自旋不足 (a* < a_crit) 或玻色子頻率高於地平線角速度 (ω > m Ω_H)，超輻射散射增益為負，無法形成穩定星雲' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateSpin(val: number) {
  blackHoleSuperradianceEngine.setSpin(val);
  achievements.unlock('black_hole_superradiance_axion');
}

function updateAxionMass(val: number) {
  blackHoleSuperradianceEngine.setAxionMassEv(val);
  achievements.unlock('black_hole_superradiance_axion');
}

function updateCloudMass(val: number) {
  blackHoleSuperradianceEngine.setCloudMassFraction(val);
  achievements.unlock('black_hole_superradiance_axion');
}

function triggerBosenova() {
  blackHoleSuperradianceEngine.triggerBosenova();
  achievements.unlock('black_hole_superradiance_axion');
}

function cycleRegime() {
  blackHoleSuperradianceEngine.cycleRegime();
  achievements.unlock('black_hole_superradiance_axion');
}

function reset() {
  blackHoleSuperradianceEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="bh-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>旋轉黑洞超輻射不穩定性與軸子玻色子雲 (Black Hole Superradiance & Axion)</h2>
            <span class="subtitle">Ergosphere Superradiant Extraction, Gravitational Atom Ψ₂₁₁ & Bosenova Implosion</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="bh-svg">
            <defs>
              <radialGradient id="bhHorizon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" />
                <stop offset="85%" stop-color="#050505" />
                <stop offset="100%" stop-color="#1e1035" />
              </radialGradient>
              <radialGradient id="ergosphereGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.35" />
                <stop offset="80%" stop-color="#6366f1" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#00f3ff" stop-opacity="0.0" />
              </radialGradient>
              <radialGradient id="axionCloudGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.7" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="bosenovaFlash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1.0" />
                <stop offset="30%" stop-color="#fb7185" stop-opacity="0.8" />
                <stop offset="70%" stop-color="#881337" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深空背景 -->
            <rect width="800" height="320" fill="#03040c" />

            <!-- 連續單色四極引力波螺旋波前 (Spiral Gravitational Waves) -->
            <g transform="translate(400, 160)" stroke="rgba(0, 243, 255, 0.25)" fill="none">
              <circle
                v-for="r in [70, 110, 150, 190, 230, 270]"
                :key="'gw-'+r"
                cx="0"
                cy="0"
                :r="r"
                :stroke-width="r % 80 === 0 ? 1.5 : 0.8"
                stroke-dasharray="10 8"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  :dur="`${Math.max(2, 10 - state.dimensionlessSpinAStar * 6)}s`"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            <!-- 引力原子軸子玻色子凝聚星雲環 Ψ₂₁₁ (Toroidal Hydrogenic Wavefunction Cloud) -->
            <g transform="translate(400, 160)">
              <!-- 雙葉對稱甜甜圈環形星雲 (Toroidal Clouds left and right) -->
              <ellipse
                cx="-85"
                cy="0"
                rx="65"
                ry="48"
                fill="url(#axionCloudGrad)"
                :transform="`rotate(${state.dimensionlessSpinAStar * 15})`"
              >
                <animate attributeName="rx" values="60;70;60" dur="2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse
                cx="85"
                cy="0"
                rx="65"
                ry="48"
                fill="url(#axionCloudGrad)"
                :transform="`rotate(${state.dimensionlessSpinAStar * 15})`"
              >
                <animate attributeName="rx" values="60;70;60" dur="2s" repeatCount="indefinite" />
              </ellipse>

              <!-- 能層 (Ergosphere: r_ergo(θ) = M + √(M² - a² cos²θ)) -->
              <ellipse
                cx="0"
                cy="0"
                :rx="58"
                :ry="Math.max(35, 58 * Math.sqrt(1 - state.dimensionlessSpinAStar * state.dimensionlessSpinAStar * 0.7))"
                fill="url(#ergosphereGrad)"
                stroke="#a855f7"
                stroke-width="1.8"
                stroke-dasharray="6 3"
              />

              <!-- 事件視界 (Event Horizon: r+ = M + √(M² - a²)) -->
              <circle
                cx="0"
                cy="0"
                :r="Math.max(22, 36 * (1 + Math.sqrt(Math.max(0.01, 1 - state.dimensionlessSpinAStar * state.dimensionlessSpinAStar))) / 2)"
                fill="url(#bhHorizon)"
                stroke="#00f3ff"
                stroke-width="2.5"
              />

              <!-- 自旋旋渦線與拖曳效應 (Lense-Thirring Frame Dragging) -->
              <path
                d="M -30 -15 Q 0 -35 30 -15 T -30 15"
                stroke="#38bdf8"
                stroke-width="1.8"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  :dur="`${Math.max(1, 4 - state.dimensionlessSpinAStar * 3)}s`"
                  repeatCount="indefinite"
                />
              </path>

              <!-- 奇異點/黑洞中心標示 -->
              <circle cx="0" cy="0" r="3" fill="#ffffff" />

              <!-- Bosenova 爆發星震閃光 (Bosenova Implosion Flash) -->
              <circle
                v-if="state.regime === 'bosenova-explosive-collapse'"
                cx="0"
                cy="0"
                r="110"
                fill="url(#bosenovaFlash)"
              >
                <animate attributeName="r" values="60;140;60" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </g>

            <!-- 標註文字 -->
            <text x="35" y="45" fill="#a855f7" font-size="12" font-family="monospace">
              能層邊界 (Ergosphere Boundary r_ergo)
            </text>
            <text x="35" y="65" fill="#ec4899" font-size="12" font-family="monospace">
              軸子引力原子星雲 Ψ₂₁₁ (M_cloud / M_BH = {{ (state.cloudMassFraction * 100).toFixed(1) }}%)
            </text>
            <text x="35" y="85" fill="#00f3ff" font-size="12" font-family="monospace">
              視界轉速 f_H = {{ state.horizonFrequencyHz }} Hz | a* = {{ state.dimensionlessSpinAStar.toFixed(2) }}
            </text>

            <text x="765" y="45" text-anchor="end" fill="#38bdf8" font-size="12" font-family="monospace">
              四極 GW 頻率: {{ state.continuousGwFrequencyHz }} Hz
            </text>
            <text x="765" y="65" text-anchor="end" fill="#f59e0b" font-size="12" font-family="monospace">
              引力波光度: {{ state.gwLuminosityErgS.toExponential(1) }} erg/s
            </text>

            <!-- 底部狀態條 -->
            <rect x="20" y="275" width="280" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#a855f7" stroke-width="1" />
            <text x="30" y="295" fill="#c084fc" font-size="12" font-family="monospace">
              相態: {{ state.regime }}
            </text>

            <rect x="520" y="275" width="260" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#f43f5e" stroke-width="1" />
            <text x="530" y="295" fill="#fb7185" font-size="12" font-family="monospace">
              Bosenova 星震崩潰次數: {{ state.bosenovaCollapseCount }} 次
            </text>
          </svg>
        </div>

        <!-- 物理核心指標卡片面板 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">無量綱自旋 (a*)</span>
            <div class="val-unit">
              <span class="value text-cyan">{{ state.dimensionlessSpinAStar.toFixed(3) }}</span>
              <span class="unit">Jc / GM²</span>
            </div>
            <span class="desc">極端克爾極限 a* → 1.0</span>
          </div>

          <div class="metric-card">
            <span class="label">引力精細結構常數 (α_g)</span>
            <div class="val-unit">
              <span class="value text-purple">{{ state.gravitationalAlphaG.toFixed(3) }}</span>
              <span class="unit">GMμ / ħc</span>
            </div>
            <span class="desc">共振匹配條件 α_g ≈ 0.1 - 0.4</span>
          </div>

          <div class="metric-card">
            <span class="label">連續引力波頻率 (f_GW)</span>
            <div class="val-unit">
              <span class="value text-rose">{{ state.continuousGwFrequencyHz.toFixed(1) }}</span>
              <span class="unit">Hz</span>
            </div>
            <span class="desc">單色連續波 f_GW ≈ 2 f_axion</span>
          </div>

          <div class="metric-card">
            <span class="label">Bosenova 塌縮臨界比例</span>
            <div class="val-unit">
              <span class="value text-amber">{{ (state.bosenovaThresholdFraction * 100).toFixed(1) }}</span>
              <span class="unit">% M_BH</span>
            </div>
            <span class="desc">自吸引內爆極限 M_crit / M</span>
          </div>
        </div>

        <!-- 控制滑桿與操作按鈕 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-group">
              <label>黑洞無量綱自旋 (a*): <strong>{{ state.dimensionlessSpinAStar.toFixed(2) }}</strong></label>
              <input
                type="range"
                min="0.10"
                max="0.99"
                step="0.01"
                :value="state.dimensionlessSpinAStar"
                @input="updateSpin(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>軸子超輕質量 (μ): <strong>{{ (state.axionMassEv * 1e12).toFixed(2) }} × 10⁻¹² eV</strong></label>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.05"
                :value="state.axionMassEv * 1e12"
                @input="updateAxionMass(Number(($event.target as HTMLInputElement).value) * 1e-12)"
              />
            </div>
            <div class="slider-group">
              <label>星雲質量佔比 (M_cloud / M_BH): <strong>{{ (state.cloudMassFraction * 100).toFixed(2) }}%</strong></label>
              <input
                type="range"
                min="0.002"
                max="0.12"
                step="0.002"
                :value="state.cloudMassFraction"
                @input="updateCloudMass(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="btn btn-danger" @click="triggerBosenova">
              💥 誘發 Bosenova 星震內爆 (Trigger Bosenova)
            </button>
            <button class="btn btn-primary" @click="cycleRegime">
              🔄 輪轉物理相態
            </button>
            <button class="btn btn-secondary" @click="reset">
              ↺ 重置引力系統
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
            <p>1. 超輻射放大條件：$$\omega < m \Omega_H, \quad \Omega_H = \frac{a_* c}{2 r_+} = \frac{c^3 a_*}{2 G M (1 + \sqrt{1 - a_*^2})}$$</p>
            <p>2. 引力精細結構常數：$$\alpha_g = \frac{G M \mu}{\hbar c} = \frac{r_g}{\lambda_c} \approx 0.148 \left(\frac{M}{10 M_\odot}\right)\left(\frac{\mu}{10^{-12}\ \text{eV}}\right)$$</p>
            <p>3. 連續引力波輻射：雙軸子湮滅輻射單色 GW，光度 $L_{\text{GW}} \sim \left(\frac{M_{\text{cloud}}}{M_{\text{BH}}}\right)^2 \alpha_g^{14} \frac{c^5}{G}$，驅動黑洞自旋持久降速 (Spin-down Regge Trajectory)。</p>
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

.bh-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #090a16;
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(168, 85, 247, 0.2), inset 0 0 15px rgba(168, 85, 247, 0.08);
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
  background: rgba(19, 14, 38, 0.85);
  border-bottom: 1px solid rgba(168, 85, 247, 0.25);
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
  color: #c084fc;
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
  border: 1px solid rgba(168, 85, 247, 0.3);
  background: #03040c;
}

.bh-svg {
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
  background: rgba(22, 17, 43, 0.65);
  border: 1px solid rgba(168, 85, 247, 0.2);
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
.text-purple { color: #c084fc; }
.text-rose { color: #fb7185; }
.text-amber { color: #f59e0b; }

.controls-panel {
  background: rgba(22, 17, 43, 0.55);
  border: 1px solid rgba(168, 85, 247, 0.15);
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
  accent-color: #a855f7;
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
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(236, 72, 153, 0.35);
}

.btn-danger:hover {
  filter: brightness(1.15);
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
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
  background: rgba(22, 17, 43, 0.55);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 8px;
  padding: 1rem;
}

.regime-info-card h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #c084fc;
}

.regime-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.regime-item {
  background: rgba(15, 12, 30, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
  transition: all 0.2s;
}

.regime-item.active {
  border-color: #a855f7;
  background: rgba(168, 85, 247, 0.12);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.18);
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
