<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { fractionalSpinLiquidEngine, type SpinLiquidRegime } from '../engine/fractionalSpinLiquid';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => fractionalSpinLiquidEngine.getState());

const isOpen = computed(() => uiStore.mode === 'spin-liquid');

const regimes: Array<{ id: SpinLiquidRegime; label: string; desc: string }> = [
  { id: 'non-abelian-ising', label: '非阿貝爾伊辛相', desc: '手性馬約拉納與 Ising 任意子 (c=1/2)' },
  { id: 'gapless-majorana-metal', label: '無能隙半金屬', desc: '費米子狄拉克錐線性能譜' },
  { id: 'toric-code-abelian', label: '環面編碼相', desc: '阿貝爾 Z2 拓撲量子編碼態' },
  { id: 'flux-vison-crystal', label: '緻密 Vison 晶格', desc: '超密磁通渦旋凝聚態' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateJx(val: number) {
  fractionalSpinLiquidEngine.setParameters({ exchangeJxMev: val });
}

function updateJy(val: number) {
  fractionalSpinLiquidEngine.setParameters({ exchangeJyMev: val });
}

function updateJz(val: number) {
  fractionalSpinLiquidEngine.setParameters({ exchangeJzMev: val });
}

function updateB(val: number) {
  fractionalSpinLiquidEngine.setParameters({ magneticFieldTesla: val });
}

function updateTemp(val: number) {
  fractionalSpinLiquidEngine.setParameters({ temperatureKelvin: val });
}

function selectRegime(regime: SpinLiquidRegime) {
  fractionalSpinLiquidEngine.setParameters({ regime });
  achievements.unlock('kitaev_spin_liquid');
}

function triggerVison() {
  fractionalSpinLiquidEngine.injectVisonVortex();
  achievements.unlock('kitaev_spin_liquid');
}

function triggerBraiding() {
  fractionalSpinLiquidEngine.braidIsingAnyonPair();
  achievements.unlock('kitaev_spin_liquid');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="spin-liquid-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">🌀</span>
          <div>
            <h2>拓撲分數量子自旋液體與基塔耶夫蜂巢晶格反應堆</h2>
            <p class="subtitle">Kitaev Honeycomb Non-Abelian Anyon Lattice & Fractional Majorana Resonator</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 蜂巢晶格與 Z2 磁通渦旋視覺化 -->
        <section class="visualizer-card">
          <div class="vis-header">
            <h3>基塔耶夫蜂巢晶格、鍵各向異性與 Vison 磁通 (W_p)</h3>
            <span class="badge" :class="state.majoranaBandgapMev > 0 ? 'gapped' : 'gapless'">
              {{ state.majoranaBandgapMev > 0 ? `拓撲能隙: ${state.majoranaBandgapMev.toFixed(2)} meV` : '無能隙狄拉克態' }}
            </span>
          </div>

          <div class="svg-container">
            <svg viewBox="0 0 540 260" class="lattice-svg">
              <defs>
                <filter id="visonGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- 蜂巢六角形網格單元示意 -->
              <!-- Plaquette 1 (左) -->
              <polygon points="120,70 160,95 160,145 120,170 80,145 80,95" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
              <!-- Plaquette 2 (中央) -->
              <polygon points="240,70 280,95 280,145 240,170 200,145 200,95" fill="#1e293b" stroke="#475569" stroke-width="2" />
              <!-- Plaquette 3 (右) -->
              <polygon points="360,70 400,95 400,145 360,170 320,145 320,95" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
              <!-- Plaquette 4 (下中) -->
              <polygon points="180,145 220,170 220,220 180,245 140,220 140,170" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
              <!-- Plaquette 5 (下右) -->
              <polygon points="300,145 340,170 340,220 300,245 260,220 260,170" fill="#0f172a" stroke="#334155" stroke-width="1.5" />

              <!-- 各向異性三色鍵 (x-link: 紅, y-link: 綠, z-link: 藍) -->
              <!-- x-links (斜向左上) -->
              <line x1="80" y1="95" x2="120" y2="70" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" />
              <line x1="200" y1="95" x2="240" y2="70" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round" />
              <line x1="320" y1="95" x2="360" y2="70" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" />

              <!-- y-links (斜向右上) -->
              <line x1="120" y1="70" x2="160" y2="95" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
              <line x1="240" y1="70" x2="280" y2="95" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
              <line x1="360" y1="70" x2="400" y2="95" stroke="#10b981" stroke-width="3" stroke-linecap="round" />

              <!-- z-links (垂直垂直鍵) -->
              <line x1="160" y1="95" x2="160" y2="145" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
              <line x1="200" y1="95" x2="200" y2="145" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" />
              <line x1="280" y1="95" x2="280" y2="145" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" />
              <line x1="320" y1="95" x2="320" y2="145" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />

              <!-- 中央 Vison 磁通渦旋 (W_p = -1) 亮核 -->
              <g class="vison-core" filter="url(#visonGlow)">
                <circle cx="240" cy="120" r="16" fill="#f59e0b" fill-opacity="0.3" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 2" />
                <circle cx="240" cy="120" r="6" fill="#f59e0b" />
                <text x="240" y="124" fill="#000" font-size="8" font-weight="bold" text-anchor="middle">W_p</text>
              </g>

              <!-- 任意子編織軌跡動態指示 (Ising Anyon \sigma) -->
              <path
                d="M 215 120 A 25 25 0 1 1 265 120 A 25 25 0 1 1 215 120"
                fill="none"
                stroke="#ec4899"
                stroke-width="1.8"
                stroke-dasharray="4 3"
                opacity="0.8"
              />
              <circle cx="265" cy="120" r="4.5" fill="#ec4899" />

              <!-- 圖例說明文字 -->
              <text x="30" y="30" fill="#94a3b8" font-size="10" font-family="monospace">
                X-鍵 (J_x={{ state.exchangeJxMev }}) | Y-鍵 (J_y={{ state.exchangeJyMev }}) | Z-鍵 (J_z={{ state.exchangeJzMev }})
              </text>
              <text x="30" y="50" fill="#64748b" font-size="9" font-family="monospace">
                編織 Berry 相位: {{ state.anyonBraidingPhaseDeg }}° | 拓撲糾纏熵 γ: {{ state.topologicalEntanglementEntropy.toFixed(3) }} (ln 2)
              </text>
            </svg>
          </div>
        </section>

        <!-- 關鍵物理指標網格 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">熱霍爾電導比 K_xy / K_0</span>
            <span class="m-value" :class="Math.abs(state.thermalHallConductanceRatio - 0.5) < 0.03 ? 'text-green' : 'text-amber'">
              {{ state.thermalHallConductanceRatio.toFixed(3) }}
            </span>
            <span class="m-sub">理論半整數量子化基準 0.500</span>
          </div>

          <div class="metric-box">
            <span class="m-label">馬約拉納拓撲能隙 \Delta_M</span>
            <span class="m-value text-cyan">{{ state.majoranaBandgapMev.toFixed(2) }} <small>meV</small></span>
            <span class="m-sub">\kappa \propto B_x B_y B_z / J^2</span>
          </div>

          <div class="metric-box">
            <span class="m-label">Z2 磁通渦旋能隙 \Delta_v</span>
            <span class="m-value text-emerald">{{ state.visonFluxGapMev.toFixed(2) }} <small>meV</small></span>
            <span class="m-sub">Vison 形成閥值能壘</span>
          </div>

          <div class="metric-box">
            <span class="m-label">面平均 Vison 激發密度</span>
            <span class="m-value text-sky">{{ state.visonDensityPerPlaquette.toFixed(3) }}</span>
            <span class="m-sub">W_p = -1 缺陷比例</span>
          </div>
        </section>

        <!-- 模式切換 -->
        <section class="regimes-card">
          <h3>基塔耶夫相態選擇 (Kitaev Phases)</h3>
          <div class="regime-buttons">
            <button
              v-for="r in regimes"
              :key="r.id"
              class="regime-btn"
              :class="{ active: state.regime === r.id }"
              @click="selectRegime(r.id)"
            >
              <span class="btn-name">{{ r.label }}</span>
              <span class="btn-desc">{{ r.desc }}</span>
            </button>
          </div>
        </section>

        <!-- 控制滑桿與操作按鈕 -->
        <section class="controls-card">
          <h3>各向異性超交換與磁場調諧</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>X 鍵交換能 J_x:</span>
                <b>{{ state.exchangeJxMev.toFixed(1) }} meV</b>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.exchangeJxMev"
                @input="updateJx(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>Y 鍵交換能 J_y:</span>
                <b>{{ state.exchangeJyMev.toFixed(1) }} meV</b>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.exchangeJyMev"
                @input="updateJy(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>Z 鍵交換能 J_z:</span>
                <b>{{ state.exchangeJzMev.toFixed(1) }} meV</b>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.exchangeJzMev"
                @input="updateJz(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>外加磁場 B_xyz:</span>
                <b>{{ state.magneticFieldTesla.toFixed(1) }} T</b>
              </div>
              <input
                type="range"
                min="0.0"
                max="10.0"
                step="0.2"
                :value="state.magneticFieldTesla"
                @input="updateB(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>操作溫度 T:</span>
                <b>{{ state.temperatureKelvin.toFixed(2) }} K</b>
              </div>
              <input
                type="range"
                min="0.01"
                max="15.0"
                step="0.1"
                :value="state.temperatureKelvin"
                @input="updateTemp(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn vison-btn" @click="triggerVison">
              🌀 注入 Z2 磁通渦旋 (Inject Vison)
            </button>
            <button class="action-btn braid-btn" @click="triggerBraiding">
              ⚛️ 執行非阿貝爾任意子編織 (Braid Anyons)
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.spin-liquid-modal {
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(245, 158, 11, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f1f5f9;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.title-cluster {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-cluster .icon {
  font-size: 26px;
}

.title-cluster h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #f8fafc;
}

.title-cluster .subtitle {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #1e293b;
  color: #fff;
}

.modal-body {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visualizer-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.vis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vis-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.badge.gapped {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

.badge.gapless {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.4);
}

.svg-container {
  display: flex;
  justify-content: center;
  background: #060b13;
  border-radius: 8px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.lattice-svg {
  width: 100%;
  max-height: 220px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric-box {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.m-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
}

.m-value small {
  font-size: 0.75rem;
  font-weight: normal;
  color: #94a3b8;
}

.m-sub {
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 4px;
}

.text-cyan { color: #38bdf8; }
.text-green { color: #34d399; }
.text-emerald { color: #10b981; }
.text-sky { color: #0284c7; }
.text-amber { color: #fbbf24; }

.regimes-card, .controls-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 14px;
}

.regimes-card h3, .controls-card h3 {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #cbd5e1;
}

.regime-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.regime-btn {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #f59e0b;
}

.regime-btn.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
}

.btn-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
}

.btn-desc {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 2px;
}

.sliders-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #94a3b8;
}

.slider-header b {
  color: #f59e0b;
  font-family: monospace;
}

input[type="range"] {
  accent-color: #f59e0b;
}

.actions-row {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.vison-btn {
  background: #d97706;
  color: #fff;
}

.vison-btn:hover {
  background: #b45309;
}

.braid-btn {
  background: #db2777;
  color: #fff;
}

.braid-btn:hover {
  background: #be185d;
}

@media (max-width: 768px) {
  .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
