<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { quantumSpinHallEngine, type QSHRegime } from '../engine/quantumSpinHallFractionalSoliton';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => quantumSpinHallEngine.getState());

const isOpen = computed(() => uiStore.mode === 'quantum-spin-hall-soliton');

const regimes: Array<{ id: QSHRegime; label: string; desc: string }> = [
  { id: 'topological-qsh-helical-edge', label: '拓撲量子自旋霍爾螺旋邊緣態相', desc: 'HgTe/CdTe 量子阱厚度 d > d_c 發生能帶反轉 (M < 0)，時間反演對稱性保護螺旋邊緣態，無背散射量子化電導 G = 2 e²/h' },
  { id: 'normal-band-insulator', label: '平庸常規能帶絕緣體相', desc: '厚度小於臨界值 d < d_c 能帶未反轉 (M > 0)，邊緣無無隙導電通道，體能隙完全封閉無傳導' },
  { id: 'magnetic-domain-wall-gap', label: '時間反演破缺磁性交換能隙態', desc: '外加磁性交換場破壞克萊默簡併對稱性，螺旋邊緣態狄拉克點打開質量能隙，量子化電導遭破壞衰減' },
  { id: 'fractional-soliton-confinement', label: 'Jackiw-Rebbi 磁疇壁分數孤子態', desc: '磁性疇壁處質量反轉 M(x) 穿過零點，拓撲束縛半整數零能費米子解，攜帶精確 Jackiw-Rebbi 分數電荷 Q = ± e/2' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateThickness(val: number) {
  quantumSpinHallEngine.setWellThickness(val);
  achievements.unlock('quantum_spin_hall_fractional_soliton');
}

function updateExchangeField(val: number) {
  quantumSpinHallEngine.setExchangeField(val);
  achievements.unlock('quantum_spin_hall_fractional_soliton');
}

function updateSOC(val: number) {
  quantumSpinHallEngine.setSpinOrbitCoupling(val);
  achievements.unlock('quantum_spin_hall_fractional_soliton');
}

function createSoliton() {
  quantumSpinHallEngine.createFractionalSoliton();
  achievements.unlock('quantum_spin_hall_fractional_soliton');
}

function cycleRegime() {
  quantumSpinHallEngine.cycleRegime();
  achievements.unlock('quantum_spin_hall_fractional_soliton');
}

function reset() {
  quantumSpinHallEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="qsh-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🛡️</span>
          <div>
            <h2>拓撲量子自旋霍爾螺旋邊緣態與分數孤子 (Quantum Spin Hall & Fractional Soliton)</h2>
            <span class="subtitle">BHZ Band Inversion, Helical Edge States, G = 2 e²/h & Jackiw-Rebbi e/2 Soliton</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="qsh-svg">
            <defs>
              <linearGradient id="quantumWellBulk" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="50%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#0f172a" />
              </linearGradient>
              <linearGradient id="solitonChargeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
                <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </linearGradient>
            </defs>

            <!-- 深邃晶格背景 -->
            <rect width="800" height="320" fill="#040814" />

            <!-- 左側：二維量子阱樣品與螺旋邊緣態 (2D Strip Helical Channels) -->
            <g transform="translate(40, 35)">
              <!-- 二維量子阱晶片基底 -->
              <rect
                x="0"
                y="30"
                width="420"
                height="190"
                rx="8"
                fill="url(#quantumWellBulk)"
                stroke="#334155"
                stroke-width="1.5"
              />
              <text x="210" y="130" text-anchor="middle" fill="#64748b" font-size="12" font-family="monospace">
                HgTe / CdTe 量子阱絕緣體內部 (Insulating Bulk Gap: |M| = {{ Math.abs(state.bandInversionMassMev).toFixed(1) }} meV)
              </text>

              <!-- 上邊緣螺旋通道 (Top Helical Edge) -->
              <!-- 自旋向上 向右傳輸 (Spin-Up Right-Mover, Cyan) -->
              <line
                x1="10"
                y1="35"
                x2="410"
                y2="35"
                stroke="#00f3ff"
                :stroke-width="state.bandInversionMassMev < 0 ? 3 : 1"
                :stroke-dasharray="state.bandInversionMassMev < 0 ? 'none' : '4 4'"
              />
              <path d="M 390 31 L 410 35 L 390 39 Z" fill="#00f3ff" v-if="state.bandInversionMassMev < 0" />
              <text x="15" y="25" fill="#00f3ff" font-size="10" font-weight="bold">
                ↑ 自旋向上 (Spin-Up Right-Mover)
              </text>

              <!-- 自旋向下 向左傳輸 (Spin-Down Left-Mover, Rose) -->
              <line
                x1="410"
                y1="48"
                x2="10"
                y2="48"
                stroke="#f43f5e"
                :stroke-width="state.bandInversionMassMev < 0 ? 3 : 1"
                :stroke-dasharray="state.bandInversionMassMev < 0 ? 'none' : '4 4'"
              />
              <path d="M 30 44 L 10 48 L 30 52 Z" fill="#f43f5e" v-if="state.bandInversionMassMev < 0" />
              <text x="320" y="25" fill="#f43f5e" font-size="10" font-weight="bold">
                ↓ 自旋向下 (Spin-Down Left)
              </text>

              <!-- 下邊緣螺旋通道 (Bottom Helical Edge) -->
              <line
                x1="410"
                y1="205"
                x2="10"
                y2="205"
                stroke="#00f3ff"
                :stroke-width="state.bandInversionMassMev < 0 ? 3 : 1"
              />
              <path d="M 30 201 L 10 205 L 30 209 Z" fill="#00f3ff" v-if="state.bandInversionMassMev < 0" />

              <line
                x1="10"
                y1="218"
                x2="410"
                y2="218"
                stroke="#f43f5e"
                :stroke-width="state.bandInversionMassMev < 0 ? 3 : 1"
              />
              <path d="M 390 214 L 410 218 L 390 222 Z" fill="#f43f5e" v-if="state.bandInversionMassMev < 0" />

              <!-- 磁性疇壁與 Jackiw-Rebbi 分數孤子 (Domain Wall & Soliton) -->
              <g v-if="state.regime === 'fractional-soliton-confinement' || state.solitonCreationsCount > 0" transform="translate(210, 0)">
                <!-- 疇壁虛線 -->
                <line x1="0" y1="20" x2="0" y2="230" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3" />
                <!-- 孤子電荷雲 sech²(x/ξ) -->
                <rect x="-35" y="30" width="70" height="190" fill="url(#solitonChargeGrad)" rx="4" />
                <!-- 上邊界孤子核心 -->
                <circle cx="0" cy="42" r="9" fill="#f59e0b" stroke="#ffffff" stroke-width="2">
                  <animate attributeName="r" values="7;11;7" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="15" y="47" fill="#facc15" font-size="11" font-weight="bold">
                  Q = {{ state.solitonFractionalChargeE > 0 ? '+' : '' }}{{ state.solitonFractionalChargeE.toFixed(2) }} e
                </text>
                <!-- 疇壁說明 -->
                <text x="0" y="245" text-anchor="middle" fill="#f59e0b" font-size="10" font-family="monospace">
                  Jackiw-Rebbi 零模孤子 (Q = ± e/2)
                </text>
              </g>
            </g>

            <!-- 右側：能帶反轉狄拉克色散關係 (BHZ Band Inversion Dispersion E vs kx) -->
            <g transform="translate(500, 35)">
              <rect width="260" height="210" fill="rgba(15, 23, 42, 0.5)" rx="6" stroke="rgba(100, 116, 139, 0.3)" />

              <!-- 坐標軸 -->
              <line x1="20" y1="105" x2="240" y2="105" stroke="#64748b" stroke-width="1.2" />
              <line x1="130" y1="195" x2="130" y2="15" stroke="#64748b" stroke-width="1.2" />
              <text x="240" y="120" text-anchor="end" fill="#94a3b8" font-size="10">k_x</text>
              <text x="125" y="20" text-anchor="end" fill="#94a3b8" font-size="10">E</text>

              <!-- 體導帶與價帶能帶雙曲線 (Bulk Bands) -->
              <!-- 導帶 E > 0 -->
              <path
                :d="`M 30 ${60 + (state.bandInversionMassMev > 0 ? 15 : -10)} Q 130 ${90 + (state.bandInversionMassMev > 0 ? 15 : -10)} 230 ${60 + (state.bandInversionMassMev > 0 ? 15 : -10)}`"
                stroke="#38bdf8"
                stroke-width="2"
                fill="none"
              />
              <!-- 價帶 E < 0 -->
              <path
                :d="`M 30 ${150 - (state.bandInversionMassMev > 0 ? 15 : -10)} Q 130 ${120 - (state.bandInversionMassMev > 0 ? 15 : -10)} 230 ${150 - (state.bandInversionMassMev > 0 ? 15 : -10)}`"
                stroke="#ec4899"
                stroke-width="2"
                fill="none"
              />

              <!-- 拓撲螺旋邊緣態狄拉克交叉 (Dirac Crossing when M < 0) -->
              <g v-if="state.bandInversionMassMev < 0">
                <line x1="60" y1="155" x2="200" y2="55" stroke="#00f3ff" stroke-width="2.2" />
                <line x1="60" y1="55" x2="200" y2="155" stroke="#f43f5e" stroke-width="2.2" />
                <!-- 狄拉克點 (Dirac Point) -->
                <circle cx="130" cy="105" r="4.5" fill="#facc15" />
                <text x="140" y="100" fill="#facc15" font-size="10" font-weight="bold">狄拉克點 (k_x=0)</text>
              </g>

              <text x="130" y="190" text-anchor="middle" fill="#38bdf8" font-size="10" font-family="monospace">
                反轉能帶質量 M = {{ state.bandInversionMassMev.toFixed(1) }} meV
              </text>
            </g>

            <!-- 底部狀態條 -->
            <rect x="20" y="275" width="280" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#00f3ff" stroke-width="1" />
            <text x="30" y="295" fill="#00f3ff" font-size="12" font-family="monospace">
              相態: {{ state.regime }}
            </text>

            <rect x="520" y="275" width="260" height="30" rx="6" fill="rgba(0,0,0,0.6)" stroke="#f59e0b" stroke-width="1" />
            <text x="530" y="295" fill="#facc15" font-size="12" font-family="monospace">
              孤子創生次數: {{ state.solitonCreationsCount }} 次
            </text>
          </svg>
        </div>

        <!-- 物理核心指標卡片面板 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">反轉能帶質量 (M)</span>
            <div class="val-unit">
              <span class="value" :class="state.bandInversionMassMev < 0 ? 'text-cyan' : 'text-rose'">
                {{ state.bandInversionMassMev.toFixed(1) }}
              </span>
              <span class="unit">meV</span>
            </div>
            <span class="desc">M &lt; 0 為拓撲反轉相 (d_c = 6.3 nm)</span>
          </div>

          <div class="metric-card">
            <span class="label">量子化霍爾電導 (G)</span>
            <div class="val-unit">
              <span class="value text-cyan">{{ state.quantizedConductanceMicroSiemens.toFixed(2) }}</span>
              <span class="unit">μS (2 e²/h)</span>
            </div>
            <span class="desc">雙螺旋邊緣通道無耗散傳導</span>
          </div>

          <div class="metric-card">
            <span class="label">背散射壓制率</span>
            <div class="val-unit">
              <span class="value text-purple">{{ state.backscatteringSuppressionPercent.toFixed(1) }}</span>
              <span class="unit">%</span>
            </div>
            <span class="desc">時間反演對稱性保護克萊默簡併</span>
          </div>

          <div class="metric-card">
            <span class="label">Jackiw-Rebbi 分數孤子</span>
            <div class="val-unit">
              <span class="value text-amber">
                {{ state.solitonFractionalChargeE > 0 ? '+' : '' }}{{ state.solitonFractionalChargeE.toFixed(2) }}
              </span>
              <span class="unit">e</span>
            </div>
            <span class="desc">磁性疇壁半整數拓撲電荷</span>
          </div>
        </div>

        <!-- 控制滑桿與操作按鈕 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-group">
              <label>量子阱厚度 (d): <strong>{{ state.quantumWellThicknessNm.toFixed(2) }} nm</strong></label>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                :value="state.quantumWellThicknessNm"
                @input="updateThickness(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>交換磁場 (B_exchange): <strong>{{ state.magneticExchangeFieldTesla.toFixed(2) }} T</strong></label>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                :value="state.magneticExchangeFieldTesla"
                @input="updateExchangeField(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <div class="slider-group">
              <label>自旋-軌道耦合 (λ_SOC): <strong>{{ state.spinOrbitCouplingEv.toFixed(2) }} eV</strong></label>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.02"
                :value="state.spinOrbitCouplingEv"
                @input="updateSOC(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="btn btn-warning" @click="createSoliton">
              🛡️ 創生 Jackiw-Rebbi e/2 分數孤子
            </button>
            <button class="btn btn-primary" @click="cycleRegime">
              🔄 輪轉物理相態
            </button>
            <button class="btn btn-secondary" @click="reset">
              ↺ 重置拓撲量子阱
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
            <p>1. BHZ 模型能帶反轉：$$M(d) = \epsilon_0 - \alpha (d - d_c)$$，當厚度 $d > d_c \approx 6.3\ \text{nm}$ 時 $M < 0$，s-型能帶與 p-型能帶反轉。</p>
            <p>2. 量子化螺旋電導：雙邊緣通道提供兩個獨立方向自旋電流，$$G = 2 \frac{e^2}{h} \approx 77.48\ \mu\text{S}$$，受時間反演對稱性 $\Theta^2 = -1$ 保護免於非磁性雜質背散射。</p>
            <p>3. Jackiw-Rebbi 指數定理：疇壁質量反轉 $M(x \to \pm\infty) = \pm M_0$ 導致狄拉克算子存在單個零能束縛態，攜帶分數電荷 $$Q_{\text{soliton}} = -\frac{e}{2} \operatorname{sgn}(M_1 - M_2) = \pm \frac{e}{2}$$。</p>
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
  background: rgba(3, 6, 16, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.qsh-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #090e1a;
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
  background: rgba(12, 22, 38, 0.85);
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
  background: #040814;
}

.qsh-svg {
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
.text-rose { color: #fb7185; }
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

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
}

.btn-warning:hover {
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
