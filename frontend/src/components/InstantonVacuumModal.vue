<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { yangMillsInstantonEngine, type InstantonRegime } from '../engine/yangMillsInstantonVacuum';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => yangMillsInstantonEngine.getState());

const isOpen = computed(() => uiStore.mode === 'instanton-vacuum');

const regimes: Array<{ id: InstantonRegime; label: string; desc: string }> = [
  { id: 'classical-vacuum-wells', label: '經典真空勢阱相', desc: 'g 較弱，瞬子作用量 S_inst 龐大，WKB 穿隧速率受指數壓制，真空態近乎離散孤立' },
  { id: 'quantum-tunneling-bpst', label: 'BPST 瞬子強穿隧相', desc: 'g 增強，自對偶場組態形成密集瞬子氣，拓撲荷 Q = ±1 量子穿隧頻繁發生' },
  { id: 'theta-vacuum-interference', label: 'θ-真空相位干涉態', desc: '離散真空態形成 Bloch 疊加態 |θ⟩ = ∑ e^(inθ)|n⟩，真空能 E(θ) 呈現週期調製與 CP 破缺' },
  { id: 'axion-cp-restoration', label: '軸子 Peccei-Quinn 動態恢復相', desc: '引入動態軸子場 a(x)，瞬子勢能將真空期望值動態錨定於 θ̄ ≡ 0，解決強 CP 疑難' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateTheta(val: number) {
  yangMillsInstantonEngine.setThetaAngle(val);
  achievements.unlock('yang_mills_instanton_vacuum');
}

function updateCoupling(val: number) {
  yangMillsInstantonEngine.setGaugeCoupling(val);
  achievements.unlock('yang_mills_instanton_vacuum');
}

function toggleAxion() {
  yangMillsInstantonEngine.toggleAxionMechanism();
  achievements.unlock('yang_mills_instanton_vacuum');
}

function triggerTunneling() {
  yangMillsInstantonEngine.triggerInstantonTunneling();
  achievements.unlock('yang_mills_instanton_vacuum');
}

function cycleRegime() {
  yangMillsInstantonEngine.cycleRegime();
  achievements.unlock('yang_mills_instanton_vacuum');
}

function reset() {
  yangMillsInstantonEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="instanton-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>瞬子真空隧道效應與楊-米爾斯 θ-真空 (Yang-Mills Instanton Vacuum)</h2>
            <span class="subtitle">Self-Dual BPST Instantons, Pontryagin Index Q, Topological θ-Vacuum & Strong CP Axion</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="instanton-svg">
            <defs>
              <linearGradient id="tunnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.1" />
                <stop offset="50%" stop-color="#bf00ff" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#ff00aa" stop-opacity="0.1" />
              </linearGradient>
              <radialGradient id="instantonCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#00f3ff" />
                <stop offset="80%" stop-color="#9900ff" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深空背景 -->
            <rect width="800" height="320" fill="#050616" />

            <!-- 左側：多重拓撲真空勢阱景觀與 BPST 瞬子穿隧 (Periodic Vacuum Wells & Tunneling) -->
            <g transform="translate(50, 45)">
              <rect x="0" y="0" width="360" height="235" rx="8" fill="rgba(10, 12, 30, 0.85)" stroke="rgba(160, 0, 255, 0.3)" />
              <text x="180" y="24" fill="#bb77ff" font-size="12" font-weight="bold" text-anchor="middle">
                楊-米爾斯拓撲真空井 |n⟩ 與 BPST 穿隧
              </text>

              <!-- 週期性勢能景觀曲線 V(A) -->
              <!-- 勢阱 1 (|n-1⟩), 勢阱 2 (|n⟩), 勢阱 3 (|n+1⟩) -->
              <path
                d="M 30 180 C 60 180, 75 70, 95 70 C 115 70, 130 180, 160 180 C 190 180, 205 70, 225 70 C 245 70, 260 180, 290 180 C 320 180, 335 70, 350 70"
                fill="none"
                stroke="#6655aa"
                stroke-width="2.2"
              />

              <!-- 真空態標記 -->
              <text x="95" y="200" fill="#aaccff" font-size="10.5" text-anchor="middle">|n - 1⟩</text>
              <text x="225" y="200" fill="#00f3ff" font-size="11" text-anchor="middle" font-weight="bold">|n⟩</text>
              <text x="350" y="200" fill="#aaccff" font-size="10.5" text-anchor="middle">|n + 1⟩</text>

              <!-- BPST 瞬子歐幾里得時間穿隧路徑 (Q = +1) -->
              <path
                d="M 95 180 Q 160 30 225 180"
                fill="none"
                stroke="url(#tunnelGrad)"
                stroke-width="3"
                stroke-dasharray="5 3"
              />

              <!-- 瞬子核心光球 (Instanton Core ρ) -->
              <circle cx="160" cy="105" r="14" fill="url(#instantonCore)">
                <animate attributeName="r" values="11;17;11" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="160" y="90" fill="#ffffff" font-size="9.5" text-anchor="middle" font-weight="bold">
                Q = +1 瞬子 (ρ = {{ state.instantonScaleRhoFm }} fm)
              </text>

              <text x="180" y="222" fill="#88ffcc" font-size="9.5" text-anchor="middle">
                WKB 穿隧率 Γ ≈ {{ state.wkbTunnelingRateGamma }} fm⁻⁴ (S_inst = {{ state.instantonActionS }})
              </text>
            </g>

            <!-- 右側：θ-真空能量色散與軸子動態補償 (θ-Dispersion & Axion Restoration) -->
            <g transform="translate(450, 45)">
              <rect x="0" y="0" width="300" height="235" rx="8" fill="rgba(10, 12, 30, 0.85)" stroke="rgba(0, 243, 255, 0.3)" />
              <text x="150" y="24" fill="#00f3ff" font-size="12" font-weight="bold" text-anchor="middle">
                θ-真空能量 E(θ) = -χ_t cos(θ)
              </text>

              <!-- 軸線 -->
              <line x1="30" y1="130" x2="270" y2="130" stroke="#445577" stroke-width="1.5" />
              <line x1="150" y1="40" x2="150" y2="210" stroke="#445577" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="270" y="142" fill="#8899aa" font-size="9.5">θ</text>
              <text x="155" y="48" fill="#8899aa" font-size="9.5">E(θ)</text>

              <!-- -cos(θ) 能量曲線 (從 0 到 2π) -->
              <!-- x: 30 (0) -> 150 (π) -> 270 (2π) -->
              <path
                d="M 30 190 Q 90 190 150 70 Q 210 190 270 190"
                fill="none"
                stroke="#00f3ff"
                stroke-width="2.5"
              />

              <!-- 當前 θ 指示器 (Cursor) -->
              <g :transform="`translate(${30 + (state.effectiveThetaBarRad / (2 * Math.PI)) * 240}, ${130 - Math.cos(state.effectiveThetaBarRad) * 60})`">
                <circle cx="0" cy="0" r="6.5" fill="#ffd000" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="0" cy="0" r="11" fill="none" stroke="#ffd000" stroke-width="1" stroke-dasharray="2 2" />
              </g>

              <text x="150" y="210" fill="#ffd000" font-size="10" text-anchor="middle" font-weight="bold">
                有效拓撲角 θ̄ = {{ state.effectiveThetaBarRad.toFixed(4) }} rad
              </text>

              <text x="150" y="226" fill="#88ccff" font-size="9" text-anchor="middle">
                {{ state.axionMechanismEnabled ? '🛡️ 軸子場動態補償生效中 (θ̄ → 0 恢復 CP)' : '⚠️ 楊-米爾斯真空存在非零 CP 破缺' }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 數值指標矩陣 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">瞬子作用量 S_inst</span>
            <span class="val purple">{{ state.instantonActionS }}</span>
            <span class="sub">8π² / g² (g = {{ state.gaugeCouplingConstantG }})</span>
          </div>

          <div class="metric-card">
            <span class="label">真空能量密度 E(θ)</span>
            <span class="val cyan">{{ state.vacuumEnergyDensityMevFm3 }} MeV/fm³</span>
            <span class="sub">拓撲磁化率 χ_t = {{ state.topologicalSusceptibilityChiT }}</span>
          </div>

          <div class="metric-card">
            <span class="label">有效拓撲角 θ̄</span>
            <span class="val gold">{{ state.effectiveThetaBarRad.toFixed(4) }} rad</span>
            <span class="sub">{{ state.axionMechanismEnabled ? '軸子真空動態對齊' : '原初未補償角' }}</span>
          </div>

          <div class="metric-card">
            <span class="label">瞬子誘導軸子質量 m_a</span>
            <span class="val green">{{ state.axionMassMicroEv }} μeV</span>
            <span class="sub">穿隧次數：{{ state.tunnelingEventsCount }} 次</span>
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
              <span>楊-米爾斯拓撲角 θ (0 ~ 2π rad)</span>
              <span class="mono">{{ state.thetaAngleRad.toFixed(3) }} rad</span>
            </div>
            <input
              type="range"
              min="0"
              max="6.283"
              step="0.05"
              :value="state.thetaAngleRad"
              @input="updateTheta(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>規範耦合常數 g</span>
              <span class="mono">{{ state.gaugeCouplingConstantG }}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.4"
              step="0.05"
              :value="state.gaugeCouplingConstantG"
              @input="updateCoupling(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="toggle-row">
            <div class="toggle-info">
              <span class="toggle-title">軸子 Peccei-Quinn 動態消除機制</span>
              <span class="toggle-desc">引入動態純量場 a(x)，自發消除強 CP 破缺角 (θ̄ → 0)</span>
            </div>
            <button
              class="toggle-btn"
              :class="{ active: state.axionMechanismEnabled }"
              @click="toggleAxion"
            >
              {{ state.axionMechanismEnabled ? '已啟用' : '已關閉' }}
            </button>
          </div>
        </div>

        <!-- 操作按鈕列 -->
        <div class="actions-row">
          <button class="btn btn-primary" @click="triggerTunneling">
            🌌 觸發 BPST 瞬子量子穿隧
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉相態模式
          </button>
          <button class="btn btn-reset" @click="reset">
            ↺ 重置規範真空
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
  background: rgba(4, 5, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.instanton-card {
  background: #090a1f;
  border: 1px solid rgba(160, 50, 255, 0.35);
  box-shadow: 0 0 35px rgba(160, 30, 255, 0.2), inset 0 0 20px rgba(160, 50, 255, 0.05);
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
  border-bottom: 1px solid rgba(160, 50, 255, 0.25);
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
  color: #bb77ff;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.78rem;
  color: #8794ad;
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
  background: #050616;
  border-radius: 10px;
  border: 1px solid rgba(160, 50, 255, 0.3);
  overflow: hidden;
  margin-bottom: 1.2rem;
}

.instanton-svg {
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
  background: rgba(18, 15, 38, 0.7);
  border: 1px solid rgba(160, 50, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  display: flex;
  flex-direction: column;
}

.metric-card .label {
  font-size: 0.75rem;
  color: #9da6c0;
}

.metric-card .val {
  font-size: 1.25rem;
  font-weight: bold;
  font-family: monospace;
  margin: 0.2rem 0;
}

.metric-card .val.purple { color: #bb77ff; }
.metric-card .val.cyan { color: #00f3ff; }
.metric-card .val.gold { color: #ffd000; }
.metric-card .val.green { color: #00ffaa; }

.metric-card .sub {
  font-size: 0.7rem;
  color: #79839b;
}

.regimes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.regime-item {
  background: rgba(16, 12, 32, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  transition: all 0.2s;
}

.regime-item.active {
  background: rgba(160, 50, 255, 0.15);
  border-color: #bb77ff;
  box-shadow: 0 0 10px rgba(160, 50, 255, 0.25);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.2rem;
}

.regime-desc {
  font-size: 0.7rem;
  color: #8c96ae;
  line-height: 1.3;
}

.controls-panel {
  background: rgba(16, 12, 32, 0.6);
  border: 1px solid rgba(160, 50, 255, 0.2);
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
  color: #abb5c8;
}

.slider-info .mono {
  font-family: monospace;
  color: #bb77ff;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #bb77ff;
  cursor: pointer;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.toggle-title {
  font-size: 0.82rem;
  font-weight: bold;
  color: #ffffff;
}

.toggle-desc {
  font-size: 0.7rem;
  color: #7b88a0;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #8fa0b5;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: rgba(0, 255, 170, 0.2);
  border-color: #00ffaa;
  color: #00ffaa;
  box-shadow: 0 0 10px rgba(0, 255, 170, 0.25);
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
  background: linear-gradient(135deg, #9b5de5, #f15bb5);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(155, 93, 229, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #bb77ff, #ff77cc);
  box-shadow: 0 0 20px rgba(187, 119, 255, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #dce5f5;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #bb77ff;
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
