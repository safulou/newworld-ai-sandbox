<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { schwingerVacuumEngine, type SchwingerRegime } from '../engine/schwingerVacuumBreakdown';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => schwingerVacuumEngine.getState());

const isOpen = computed(() => uiStore.mode === 'schwinger-vacuum');

const regimes: Array<{ id: SchwingerRegime; label: string; desc: string }> = [
  { id: 'sub-critical-tunneling-suppressed', label: '亞臨界指數穿隧壓制相', desc: '電場低於舒溫格極限 E ≪ E_crit，虛正負電子對受庫侖束縛，穿隧率受到大作用量指數強烈壓制' },
  { id: 'quantum-schwinger-pair-onset', label: '強場非微擾狄拉克海電離萌生相', desc: '激光聚焦強度逼近極限，強電場在康普頓波長傾斜狄拉克負能海，虛粒子實體化穿隧生成電子-正電子對' },
  { id: 'qed-cascade-avalanche', label: 'Breit-Wheeler 光子-強場連鎖雪崩相', desc: '加速高能正負電子輻射伽瑪光子，光子在強場中再次衰變為正負電子對，引發幾何級數非線性級聯雪崩' },
  { id: 'plasma-screening-saturation', label: '超高密度等離子體自限遮蔽相', desc: '產生的正負電子等離子體密度達到臨界值，形成反向感應屏蔽電場，自發限制外加電場進一步崩潰' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateElectricField(val: number) {
  schwingerVacuumEngine.setElectricFieldRatio(val);
  achievements.unlock('schwinger_vacuum_breakdown');
}

function updateAvalanche(val: number) {
  schwingerVacuumEngine.setAvalancheFactor(val);
  achievements.unlock('schwinger_vacuum_breakdown');
}

function updateMagnetic(val: number) {
  schwingerVacuumEngine.setMagneticGuiding(val);
  achievements.unlock('schwinger_vacuum_breakdown');
}

function triggerAvalanche() {
  schwingerVacuumEngine.triggerCascadeAvalanche();
  achievements.unlock('schwinger_vacuum_breakdown');
}

function cycleRegime() {
  schwingerVacuumEngine.cycleRegime();
  achievements.unlock('schwinger_vacuum_breakdown');
}

function reset() {
  schwingerVacuumEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="schwinger-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚡</span>
          <div>
            <h2>舒溫格效應與強場 QED 真空衰變 (Schwinger Vacuum Breakdown)</h2>
            <span class="subtitle">Euler-Heisenberg Non-perturbative Dirac Sea Tunneling & Breit-Wheeler Cascades</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="schwinger-svg">
            <defs>
              <linearGradient id="laserBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.1" />
                <stop offset="50%" stop-color="#00f3ff" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1" />
              </linearGradient>
              <radialGradient id="pairSpark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#ff0055" />
                <stop offset="100%" stop-color="#770022" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="diracSeaGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#0a192f" />
                <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.4" />
              </linearGradient>
            </defs>

            <!-- 深邃太空背景 -->
            <rect width="800" height="320" fill="#040714" />

            <!-- 網格坐標系 -->
            <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
              <line v-for="i in 16" :key="'vg-'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="320" />
              <line v-for="j in 8" :key="'hg-'+j" x1="0" :y1="j * 40" x2="800" :y2="j * 40" />
            </g>

            <!-- 傾斜狄拉克負能海能帶模型 (Tilted Dirac Sea) -->
            <!-- 負能海 E < -mc² 隨空間強場 e E z 傾斜 -->
            <path
              :d="`M 50 ${260 - state.fieldRatioEOverEcrit * 60} L 380 ${260 + state.fieldRatioEOverEcrit * 40} L 380 300 L 50 300 Z`"
              fill="url(#diracSeaGrad)"
              stroke="#0284c7"
              stroke-width="1.5"
            />
            <text x="60" y="285" fill="#38bdf8" font-size="11" font-family="monospace">
              狄拉克負能海 (Filled Dirac Sea: E &lt; -m c²)
            </text>

            <!-- 正能區 E > +mc² -->
            <path
              :d="`M 50 ${70 - state.fieldRatioEOverEcrit * 60} L 380 ${70 + state.fieldRatioEOverEcrit * 40} L 380 30 L 50 30 Z`"
              fill="rgba(244, 63, 94, 0.15)"
              stroke="#f43f5e"
              stroke-width="1.5"
            />
            <text x="60" y="55" fill="#fb7185" font-size="11" font-family="monospace">
              傳導正能帶 (Conduction Sea: E &gt; +m c²)
            </text>

            <!-- 禁帶質量間隔 2mc² 與穿隧路徑 (Klein Tunneling Path) -->
            <line
              x1="200"
              y1="230"
              x2="200"
              y2="100"
              stroke="#eab308"
              stroke-width="2"
              stroke-dasharray="4 4"
            >
              <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
            </line>
            <circle cx="200" cy="165" r="5" fill="#eab308" />
            <text x="215" y="170" fill="#facc15" font-size="11" font-family="monospace">
              禁帶寬度 2 m c² (Δz = 2mc²/eE)
            </text>

            <!-- 右半側：強場焦點激光束與正負電子雪崩光斑 (Laser Focus & Pair Avalanche) -->
            <g transform="translate(420, 0)">
              <!-- 激光聚焦腰身 (Focus Waist) -->
              <ellipse
                cx="180"
                cy="160"
                :rx="Math.max(20, 50 * state.fieldRatioEOverEcrit)"
                :ry="Math.max(15, 60 * state.fieldRatioEOverEcrit)"
                fill="url(#laserBeamGrad)"
                stroke="#00f3ff"
                stroke-width="2"
              />

              <!-- 電場等位線輪廓 -->
              <ellipse
                cx="180"
                cy="160"
                :rx="Math.max(35, 75 * state.fieldRatioEOverEcrit)"
                :ry="Math.max(25, 90 * state.fieldRatioEOverEcrit)"
                fill="none"
                stroke="rgba(0, 243, 255, 0.3)"
                stroke-dasharray="5 5"
              />

              <!-- 正負電子對軌跡 (e- / e+ Spiral Pairs in Magnetic/Electric Field) -->
              <g v-if="state.fieldRatioEOverEcrit > 0.10">
                <!-- 電子 e- (藍色軌跡) -->
                <path
                  d="M 180 160 Q 220 120, 280 100 T 340 70"
                  stroke="#38bdf8"
                  stroke-width="2.5"
                  fill="none"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-40" dur="0.6s" repeatCount="indefinite" />
                </path>
                <circle cx="340" cy="70" r="5" fill="#38bdf8" />
                <text x="350" y="74" fill="#38bdf8" font-size="11" font-weight="bold">e⁻ (電子)</text>

                <!-- 正電子 e+ (粉紅軌跡) -->
                <path
                  d="M 180 160 Q 140 200, 80 220 T 20 250"
                  stroke="#f43f5e"
                  stroke-width="2.5"
                  fill="none"
                >
                  <animate attributeName="stroke-dashoffset" values="0;40" dur="0.6s" repeatCount="indefinite" />
                </path>
                <circle cx="20" cy="250" r="5" fill="#f43f5e" />
                <text x="30" y="254" fill="#f43f5e" font-size="11" font-weight="bold">e⁺ (正電子)</text>

                <!-- 碰撞生成高能伽瑪光子 (Breit-Wheeler Gamma Rays) -->
                <path
                  d="M 180 160 L 260 210 L 290 270"
                  stroke="#a855f7"
                  stroke-width="1.8"
                  stroke-dasharray="3 3"
                  fill="none"
                />
                <circle cx="290" cy="270" r="4" fill="#c084fc" />
                <text x="300" y="275" fill="#c084fc" font-size="10">γ 伽瑪光子</text>
              </g>

              <!-- 雪崩中心強光爆炸效果 (Cascade Avalanche Spark) -->
              <circle
                v-if="state.avalancheMultiplicationFactor > 500"
                cx="180"
                cy="160"
                r="38"
                fill="url(#pairSpark)"
              >
                <animate attributeName="r" values="25;45;25" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite" />
              </circle>

              <text x="180" y="30" text-anchor="middle" fill="#00f3ff" font-size="12" font-weight="bold">
                QED 激光焦點強度 (I = {{ state.laserIntensityWcm2.toExponential(1) }} W/cm²)
              </text>
            </g>

            <!-- 底部狀態標籤 -->
            <rect x="20" y="275" width="220" height="30" rx="6" fill="rgba(0, 0, 0, 0.6)" stroke="#00f3ff" stroke-width="1" />
            <text x="30" y="295" fill="#00f3ff" font-size="12" font-family="monospace">
              相態: {{ state.regime }}
            </text>

            <rect x="560" y="275" width="220" height="30" rx="6" fill="rgba(0, 0, 0, 0.6)" stroke="#f43f5e" stroke-width="1" />
            <text x="570" y="295" fill="#f43f5e" font-size="12" font-family="monospace">
              衰變事件: {{ state.totalPairCreationsCount }} 次
            </text>
          </svg>
        </div>

        <!-- 物理核心指標卡片面板 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">電場強度比 (E / E_crit)</span>
            <div class="val-unit">
              <span class="value text-cyan">{{ state.fieldRatioEOverEcrit.toFixed(2) }}</span>
              <span class="unit">E_crit</span>
            </div>
            <span class="desc">E_crit = 1.32 × 10¹⁸ V/m</span>
          </div>

          <div class="metric-card">
            <span class="label">正負電子穿隧產率 (Γ)</span>
            <div class="val-unit">
              <span class="value text-rose">{{ state.pairProductionRateM4S.toExponential(2) }}</span>
              <span class="unit">m⁻³ s⁻¹</span>
            </div>
            <span class="desc">非微擾指數項 exp(-π E_crit / E)</span>
          </div>

          <div class="metric-card">
            <span class="label">雪崩倍增因子 (Avalanche)</span>
            <div class="val-unit">
              <span class="value text-amber">{{ state.avalancheMultiplicationFactor.toFixed(0) }}</span>
              <span class="unit">× 倍</span>
            </div>
            <span class="desc">Breit-Wheeler 光子碰撞級聯</span>
          </div>

          <div class="metric-card">
            <span class="label">等離子體自限屏蔽場 (E_screen)</span>
            <div class="val-unit">
              <span class="value text-purple">{{ state.screeningBackFieldVm.toExponential(2) }}</span>
              <span class="unit">V/m</span>
            </div>
            <span class="desc">超高密對等離子體自激屏蔽極限</span>
          </div>
        </div>

        <!-- 控制滑桿與操作按鈕 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-group">
              <label>聚焦電場強度 (E / E_crit): <strong>{{ state.fieldRatioEOverEcrit.toFixed(2) }}</strong></label>
              <input
                type="range"
                min="0.02"
                max="1.50"
                step="0.02"
                :value="state.fieldRatioEOverEcrit"
                @input="updateElectricField(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>級聯雪崩倍增因子: <strong>{{ state.avalancheMultiplicationFactor.toFixed(0) }} ×</strong></label>
              <input
                type="range"
                min="1"
                max="100000"
                step="100"
                :value="state.avalancheMultiplicationFactor"
                @input="updateAvalanche(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>側向約束導引磁場 (B_guide): <strong>{{ state.magneticGuidingTesla.toFixed(0) }} T</strong></label>
              <input
                type="range"
                min="0"
                max="800"
                step="10"
                :value="state.magneticGuidingTesla"
                @input="updateMagnetic(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="btn btn-danger" @click="triggerAvalanche">
              ⚡ 觸發 Breit-Wheeler QED 級聯雪崩
            </button>
            <button class="btn btn-primary" @click="cycleRegime">
              🔄 輪轉物理相態
            </button>
            <button class="btn btn-secondary" @click="reset">
              ↺ 重置真空場
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
            <p>1. 舒溫格臨界場：$$E_{\text{crit}} = \frac{m_e^2 c^3}{e \hbar} \approx 1.32 \times 10^{18}\ \text{V/m}$$</p>
            <p>2. 非微擾狄拉克海穿隧率：$$\Gamma = \frac{(eE)^2}{4\pi^3 \hbar^2 c} \sum_{n=1}^\infty \frac{1}{n^2} \exp\left(-\frac{n \pi m_e^2 c^3}{e \hbar E}\right)$$</p>
            <p>3. 級聯雪崩條件：光子能量超過對產生閾值 $\chi_e = \frac{e \hbar}{m_e^3 c^4} |F_{\mu\nu} p^\nu| \gtrsim 1$，誘發無阻尼電子-光子連鎖倍增。</p>
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
  background: rgba(4, 6, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.schwinger-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #0b0f19;
  border: 1px solid rgba(0, 243, 255, 0.35);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(0, 243, 255, 0.2), inset 0 0 15px rgba(0, 243, 255, 0.08);
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
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid rgba(0, 243, 255, 0.25);
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
  color: #00f3ff;
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
  border: 1px solid rgba(0, 243, 255, 0.3);
  background: #040714;
}

.schwinger-svg {
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
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(0, 243, 255, 0.2);
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
.text-rose { color: #f43f5e; }
.text-amber { color: #f59e0b; }
.text-purple { color: #c084fc; }

.controls-panel {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(0, 243, 255, 0.15);
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
  accent-color: #00f3ff;
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
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
}

.btn-danger:hover {
  filter: brightness(1.15);
}

.btn-primary {
  background: linear-gradient(135deg, #0284c7, #0369a1);
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
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 8px;
  padding: 1rem;
}

.regime-info-card h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #00f3ff;
}

.regime-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.regime-item {
  background: rgba(10, 15, 26, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
  transition: all 0.2s;
}

.regime-item.active {
  border-color: #00f3ff;
  background: rgba(0, 243, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.15);
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
