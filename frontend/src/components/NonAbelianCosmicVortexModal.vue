<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { nonAbelianCosmicVortexEngine, type CosmicVortexRegime } from '../engine/nonAbelianCosmicVortex';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => nonAbelianCosmicVortexEngine.getState());

const isOpen = computed(() => uiStore.mode === 'non-abelian-vortex');

const regimes: Array<{ id: CosmicVortexRegime; label: string; desc: string }> = [
  { id: 'bps-saturated-topological-vortex', label: 'BPS 臨界飽和拓撲渦旋相', desc: '希格斯耦合與規範耦合平衡 (β=1.0)，標量吸引與規範排斥完全抵消，任意間距平行渦旋弦保持零力靜態平衡' },
  { id: 'non-abelian-flux-reconnection-surge', label: '非阿貝爾磁通碰撞重聯激增相', desc: '非可換辮群色通量高速碰撞重聯激增 (p > 0.6)，伴隨三叉 Y-junctions 接頭形成與高能暴脹弦環爆發' },
  { id: 'abrikosov-vortex-lattice-array', label: '阿布里科索夫六角超流渦旋陣列態', desc: '第二類超導區 (β > 1.8)，渦旋排斥相互作用佔優，自組織排列為穩態六角阿布里科索夫色磁渦旋點陣' },
  { id: 'semilocal-string-network-decay', label: '半局域宇宙弦網衰減輻射相', desc: '第一類超導吸引區 (β < 1.0)，閉合弦環在張力驅動下近光速坍縮，爆發大統一尺度超高能宇宙線粒子' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateBeta(val: number) {
  const diff = val - state.value.bpsCouplingRatioBeta;
  nonAbelianCosmicVortexEngine.tuneBPSCouplingRatio(diff);
  achievements.unlock('non_abelian_cosmic_vortex');
}

function updateWinding(val: number) {
  const diff = Math.round(val) - state.value.vortexWindingNumberN;
  nonAbelianCosmicVortexEngine.exciteWindingQuanta(diff);
  achievements.unlock('non_abelian_cosmic_vortex');
}

function updateReconnection(val: number) {
  // 手動微調重聯幾率
  const s = nonAbelianCosmicVortexEngine.getState();
  s.stringReconnectionProbP = Number(Math.max(0.01, Math.min(1.0, val)).toFixed(2));
  nonAbelianCosmicVortexEngine.tuneBPSCouplingRatio(0); // 觸發物理重算
  achievements.unlock('non_abelian_cosmic_vortex');
}

function lockBPS() {
  nonAbelianCosmicVortexEngine.lockExactBPSSaturation();
  achievements.unlock('non_abelian_cosmic_vortex');
}

function exciteQuanta() {
  nonAbelianCosmicVortexEngine.exciteWindingQuanta(1);
  achievements.unlock('non_abelian_cosmic_vortex');
}

function triggerCollision() {
  nonAbelianCosmicVortexEngine.triggerNonAbelianCollision();
  achievements.unlock('non_abelian_cosmic_vortex');
}

function reset() {
  nonAbelianCosmicVortexEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="vortex-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🌀</span>
          <div>
            <h2>非阿貝爾宇宙渦旋弦與暴脹發電機 (Non-Abelian Cosmic Vortex)</h2>
            <span class="subtitle">ANO Cosmic Strings, BPS Bound β=1.0 Zero-Force, Flux Reconnection & Y-Junctions</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 非阿貝爾渦旋截面、BPS 零力力線與色通量重聯 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="vortex-svg">
            <defs>
              <radialGradient id="vortexCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="fluxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ec4899" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#f59e0b" />
              </linearGradient>
            </defs>

            <!-- 深邃宇宙星空背景板 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#f43f5e" stroke-width="1.6" />

            <!-- 左側：平行非阿貝爾 ANO 渦旋對與相互作用場線 -->
            <g transform="translate(145, 145)">
              <!-- 背景力線：依據 interVortexForceNormalized 決定吸引/BPS平行/排斥 -->
              <g stroke="#64748b" stroke-width="1.2" opacity="0.6">
                <!-- 渦旋 1 (x = -45) 與 渦旋 2 (x = +45) 間的場線 -->
                <path :d="state.interVortexForceNormalized === 0 
                  ? 'M -45 -60 L 45 -60 M -45 0 L 45 0 M -45 60 L 45 60'
                  : state.interVortexForceNormalized > 0
                    ? 'M -45 -50 Q 0 -20, 45 -50 M -45 50 Q 0 20, 45 50'
                    : 'M -45 -50 Q 0 -70, 45 -50 M -45 50 Q 0 70, 45 50'"
                  fill="none" stroke="#f43f5e" stroke-dasharray="4 3" />
              </g>

              <!-- 左渦旋弦核心 1 (SU(2) 色通量) -->
              <circle cx="-45" cy="0" :r="16 + state.vortexWindingNumberN * 4" fill="url(#vortexCoreGlow)">
                <animate attributeName="opacity" values="0.7;1.0;0.7" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <!-- 拓撲環繞同心圓線 -->
              <circle cx="-45" cy="0" :r="8 + state.vortexWindingNumberN * 2" fill="none" stroke="#06b6d4" stroke-width="1.5" />
              <circle cx="-45" cy="0" :r="14 + state.vortexWindingNumberN * 3" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 2" />
              <text x="-45" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">n={{ state.vortexWindingNumberN }}</text>

              <!-- 右渦旋弦核心 2 (SU(2) 色通量) -->
              <circle cx="45" cy="0" :r="16 + state.vortexWindingNumberN * 4" fill="url(#vortexCoreGlow)">
                <animate attributeName="opacity" values="0.7;1.0;0.7" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <!-- 拓撲環繞同心圓線 -->
              <circle cx="45" cy="0" :r="8 + state.vortexWindingNumberN * 2" fill="none" stroke="#06b6d4" stroke-width="1.5" />
              <circle cx="45" cy="0" :r="14 + state.vortexWindingNumberN * 3" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 2" />
              <text x="45" y="4" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">n={{ state.vortexWindingNumberN }}</text>

              <!-- 力平衡指示文字 -->
              <text x="0" y="85" text-anchor="middle" fill="#cbd5e1" font-size="11">
                {{ Math.abs(state.interVortexForceNormalized) < 0.1 ? '⚡ BPS 飽和：力完全抵消 (F = 0)' : state.interVortexForceNormalized > 0 ? '↗ 排斥力 (Type II 超導陣列)' : '↙ 吸引力 (Type I 弦環坍縮)' }}
              </text>
            </g>

            <!-- 右側：宇宙弦暴脹參數儀表板 -->
            <g transform="translate(295, 50)">
              <rect x="0" y="0" width="205" height="195" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#f43f5e" stroke-width="1" />
              <text x="14" y="24" fill="#fb7185" font-size="12" font-weight="bold">暴脹宇宙弦拓撲參數</text>
              <line x1="14" y1="32" x2="191" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">弦張力 μ:</text>
              <text x="14" y="74" fill="#f43f5e" font-size="14" font-weight="bold">{{ state.stringTensionMuGev2 }} ×10³⁰ GeV²</text>

              <text x="14" y="100" fill="#94a3b8" font-size="10">非阿貝爾通量量子 Φ:</text>
              <text x="14" y="119" fill="#06b6d4" font-size="14" font-weight="bold">{{ state.nonAbelianFluxQuantumHBarC.toFixed(1) }} ℏc/e</text>

              <text x="14" y="145" fill="#94a3b8" font-size="10">重聯幾率 p (Y-junction):</text>
              <text x="14" y="164" fill="#f59e0b" font-size="14" font-weight="bold">{{ (state.stringReconnectionProbP * 100).toFixed(0) }}% ({{ state.stringReconnectionProbP < 0.4 ? '非阿貝爾阻挫' : '激增重聯' }})</text>

              <text x="14" y="188" fill="#94a3b8" font-size="9">核心半徑 r_core: {{ state.coreRadiusFemtometer }} fm</text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 245)">
              <rect x="0" y="0" width="270" height="28" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#f43f5e" stroke-width="1" />
              <text x="12" y="18" fill="#fb7185" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">宇宙弦張力 (μ)</span>
            <span class="m-val highlight">{{ state.stringTensionMuGev2 }} ×10³⁰</span>
            <span class="m-sub">GeV² 暴脹尺度張力</span>
          </div>

          <div class="metric-card">
            <span class="m-label">BPS 耦合比 (β)</span>
            <span class="m-val accent">{{ state.bpsCouplingRatioBeta.toFixed(2) }}</span>
            <span class="m-sub">β = λ / (2g²) (1.0為BPS)</span>
          </div>

          <div class="metric-card">
            <span class="m-label">渦旋相互作用力 (F)</span>
            <span class="m-val">{{ state.interVortexForceNormalized.toFixed(2) }}</span>
            <span class="m-sub">0=平衡, >0=斥力, <0=引力</span>
          </div>

          <div class="metric-card">
            <span class="m-label">拓撲環繞數 (n)</span>
            <span class="m-val">{{ state.vortexWindingNumberN }}</span>
            <span class="m-sub">同倫群 π₁(G/H) 量子</span>
          </div>

          <div class="metric-card">
            <span class="m-label">碰撞重聯幾率 (p)</span>
            <span class="m-val">{{ (state.stringReconnectionProbP * 100).toFixed(0) }}%</span>
            <span class="m-sub">非可換辮群碰撞幾率</span>
          </div>

          <div class="metric-card">
            <span class="m-label">核心半徑 (r_core)</span>
            <span class="m-val">{{ state.coreRadiusFemtometer }} fm</span>
            <span class="m-sub">希格斯真空期望尺度</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>BPS 耦合比 β (0.2 ~ 3.0): <b>{{ state.bpsCouplingRatioBeta.toFixed(2) }}</b> (1.0 = BPS 飽和平衡)</label>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                :value="state.bpsCouplingRatioBeta"
                @input="updateBeta(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>拓撲環繞數 n (1 ~ 6): <b>{{ state.vortexWindingNumberN }}</b></label>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                :value="state.vortexWindingNumberN"
                @input="updateWinding(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>碰撞重聯幾率 p (0.01 ~ 1.00): <b>{{ (state.stringReconnectionProbP * 100).toFixed(0) }}%</b></label>
              <input
                type="range"
                min="0.01"
                max="1.00"
                step="0.02"
                :value="state.stringReconnectionProbP"
                @input="updateReconnection(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="lockBPS">
              ⚖️ 鎖定 BPS 臨界飽和 (β=1.0)
            </button>
            <button class="action-btn cyan" @click="exciteQuanta">
              🌀 激發環繞通量量子 (+1 n)
            </button>
            <button class="action-btn secondary" @click="triggerCollision">
              💥 觸發非阿貝爾碰撞重聯 (p↑)
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
  background: rgba(3, 7, 18, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.vortex-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(18, 12, 24, 0.92);
  border: 1px solid rgba(244, 63, 94, 0.35);
  box-shadow: 0 0 35px rgba(244, 63, 94, 0.25);
  border-radius: 16px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title-group .icon {
  font-size: 32px;
}

h2 {
  font-size: 19px;
  font-weight: 700;
  color: #fb7185;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.svg-container {
  display: flex;
  justify-content: center;
}

.vortex-svg {
  width: 100%;
  height: auto;
  max-height: 270px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
}

.m-val {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.m-val.highlight {
  color: #f43f5e;
}

.m-val.accent {
  color: #fb7185;
}

.m-sub {
  font-size: 10px;
  color: #64748b;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
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

.slider-row label b {
  color: #fb7185;
}

.slider-row input[type="range"] {
  accent-color: #f43f5e;
  cursor: pointer;
}

.actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1;
  min-width: 130px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: rgba(244, 63, 94, 0.2);
  border-color: #f43f5e;
  color: #fb7185;
}

.action-btn.primary:hover {
  background: rgba(244, 63, 94, 0.35);
}

.action-btn.cyan {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #38bdf8;
}

.action-btn.cyan:hover {
  background: rgba(6, 182, 212, 0.35);
}

.action-btn.secondary {
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #c084fc;
}

.action-btn.secondary:hover {
  background: rgba(168, 85, 247, 0.35);
}

.action-btn.reset {
  background: rgba(148, 163, 184, 0.15);
  border-color: #64748b;
  color: #cbd5e1;
}

.action-btn.reset:hover {
  background: rgba(148, 163, 184, 0.25);
}
</style>
