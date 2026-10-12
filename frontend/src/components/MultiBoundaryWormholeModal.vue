<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { multiBoundaryWormholeEngine, type MultiWormholeRegime } from '../engine/multiBoundaryWormhole';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => multiBoundaryWormholeEngine.getState());

const isOpen = computed(() => uiStore.mode === 'multi-wormhole');

const regimes: Array<{ id: MultiWormholeRegime; label: string; desc: string }> = [
  { id: 'tripartite-ghz-teleport', label: '三方 GHZ 傳態', desc: '極大糾纏多邊界因果蟲洞傳態' },
  { id: 'multi-throat-shapiro-open', label: '多喉夏皮羅超前', desc: '負能量張開所有分支喉口 Δv > 0' },
  { id: 'quantum-secret-sharing', label: '量子秘密共享', desc: '多方聯合測量協同還原位元' },
  { id: 'entanglement-junction-flux', label: '全息結點通量', desc: 'Ryu-Takayanagi 糾纏面中央交會' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateCoupling(val: number) {
  multiBoundaryWormholeEngine.setParameters({ throatCouplingG: val });
}

function updateRadius(val: number) {
  multiBoundaryWormholeEngine.setParameters({ wormholeRadiusAdS: val });
}

function updateScrambling(val: number) {
  multiBoundaryWormholeEngine.setParameters({ scramblingTimePs: val });
}

function selectRegime(regime: MultiWormholeRegime) {
  multiBoundaryWormholeEngine.setParameters({ regime });
  achievements.unlock('multiboundary_wormhole');
}

function injectPacket() {
  multiBoundaryWormholeEngine.injectMultiQubitPacket();
  achievements.unlock('multiboundary_wormhole');
}

function toggleTopology() {
  multiBoundaryWormholeEngine.toggleBoundaryTopology();
  achievements.unlock('multiboundary_wormhole');
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="wormhole-modal">
      <header class="modal-header">
        <div class="title-cluster">
          <span class="icon">🌌</span>
          <div>
            <h2>AdS/dS 雙曲多端可穿越蟲洞多體糾纏網絡</h2>
            <p class="subtitle">Multi-Boundary Traversable Wormhole & Multipartite Holographic Secret Sharing Array</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </header>

      <div class="modal-body">
        <!-- 多端雙曲全息幾何與中心喉管結點視覺化 -->
        <section class="visualizer-card">
          <div class="vis-header">
            <h3>多邊界 AdS 龐加萊切面與中心糾纏結點 (Junction)</h3>
            <span class="badge" :class="state.isThroatTraversable ? 'open' : 'closed'">
              {{ state.isThroatTraversable ? `全喉張開 (Δv = +${state.shapiroAdvanceAs} as)` : '喉口閉合 (Δv ≤ 0)' }}
            </span>
          </div>

          <div class="svg-container">
            <svg viewBox="0 0 540 260" class="wormhole-svg">
              <defs>
                <radialGradient id="junctionGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                  <stop offset="60%" stop-color="#0284c7" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#0369a1" stop-opacity="0.0" />
                </radialGradient>
                <filter id="junctionGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- 中心多端喉管交匯核心 (Central Junction) -->
              <circle cx="270" cy="130" r="32" fill="url(#junctionGrad)" filter="url(#junctionGlow)" />
              <text x="270" y="134" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">糾纏結點</text>

              <!-- 邊界 1: 左側 CFT₁ -->
              <circle cx="90" cy="130" r="45" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
              <text x="90" y="134" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">CFT₁</text>
              <!-- 喉管 1 連接線 -->
              <line x1="135" y1="130" x2="238" y2="130" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6 3" opacity="0.8" />

              <!-- 邊界 2: 右上 CFT₂ -->
              <circle cx="430" cy="70" r="42" fill="#0f172a" stroke="#10b981" stroke-width="2" />
              <text x="430" y="74" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">CFT₂</text>
              <!-- 喉管 2 連接線 -->
              <line x1="390" y1="85" x2="295" y2="115" stroke="#10b981" stroke-width="4" stroke-dasharray="6 3" opacity="0.8" />

              <!-- 邊界 3: 右下 CFT₃ -->
              <circle cx="430" cy="190" r="42" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
              <text x="430" y="194" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">CFT₃</text>
              <!-- 喉管 3 連接線 -->
              <line x1="390" y1="175" x2="295" y2="145" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6 3" opacity="0.8" />

              <!-- 若為 4 邊界，展示第 4 個頂部邊界 CFT₄ -->
              <g v-if="state.boundaryCountN === 4">
                <circle cx="270" cy="35" r="30" fill="#0f172a" stroke="#ec4899" stroke-width="2" />
                <text x="270" y="39" fill="#ec4899" font-size="9" font-weight="bold" text-anchor="middle">CFT₄</text>
                <line x1="270" y1="65" x2="270" y2="98" stroke="#ec4899" stroke-width="3.5" stroke-dasharray="5 3" opacity="0.8" />
              </g>

              <!-- 穿越中的量子位元封包 (動態小光點) -->
              <g class="transit-qubits">
                <circle cx="185" cy="130" r="4.5" fill="#e0e7ff" filter="url(#junctionGlow)" />
                <circle cx="345" cy="100" r="4" fill="#a7f3d0" />
                <circle cx="345" cy="160" r="4" fill="#fde68a" />
              </g>

              <!-- 資訊標註 -->
              <text x="20" y="25" fill="#94a3b8" font-size="10" font-family="monospace">
                幾何型態: {{ state.boundaryCountN }} 端褲襠黎曼曲面 | 多體 GHZ 糾纏負度: {{ state.ghzEntanglementNegativity }}
              </text>
              <text x="20" y="42" fill="#64748b" font-size="9" font-family="monospace">
                在途量子包: {{ state.activeTransitPackets }} 個 | 喉徑面積 Area/4G: {{ state.throatAreaG }} | 秘密共享保真度: {{ state.multipartiteFidelityPct }}%
              </text>
            </svg>
          </div>
        </section>

        <!-- 關鍵物理指標網格 -->
        <section class="metrics-grid">
          <div class="metric-box">
            <span class="m-label">夏皮羅時間超前 \Delta v</span>
            <span class="m-value text-cyan">+{{ state.shapiroAdvanceAs }} <small>as</small></span>
            <span class="m-sub">正向因果喉口張開</span>
          </div>

          <div class="metric-box">
            <span class="m-label">多方量子傳態保真度 F</span>
            <span class="m-value" :class="state.multipartiteFidelityPct > 90 ? 'text-green' : 'text-amber'">
              {{ state.multipartiteFidelityPct }}%
            </span>
            <span class="m-sub">GHZ 秘密共享還原</span>
          </div>

          <div class="metric-box">
            <span class="m-label">多體糾纏負度 (Negativity)</span>
            <span class="m-value text-emerald">{{ state.ghzEntanglementNegativity }}</span>
            <span class="m-sub">真三體/四體糾纏</span>
          </div>

          <div class="metric-box">
            <span class="m-label">在途量子封包數</span>
            <span class="m-value text-amber">{{ state.activeTransitPackets }} <small>pkts</small></span>
            <span class="m-sub">跨喉因果世界線</span>
          </div>
        </section>

        <!-- 模式切換 -->
        <section class="regimes-card">
          <h3>多端全息相態 (Multi-Wormhole Regimes)</h3>
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
          <h3>多跡耦合與 AdS 幾何參數調諧</h3>
          <div class="sliders-grid">
            <div class="slider-group">
              <div class="slider-header">
                <span>多跡邊界耦合強度 g_ij:</span>
                <b>{{ state.throatCouplingG.toFixed(2) }}</b>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                :value="state.throatCouplingG"
                @input="updateCoupling(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>AdS 喉徑半徑 L_AdS:</span>
                <b>{{ state.wormholeRadiusAdS.toFixed(1) }}</b>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                :value="state.wormholeRadiusAdS"
                @input="updateRadius(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>多體擾亂時間 t_scr:</span>
                <b>{{ state.scramblingTimePs.toFixed(1) }} ps</b>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                :value="state.scramblingTimePs"
                @input="updateScrambling(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-row">
            <button class="action-btn inject-btn" @click="injectPacket">
              🌐 注入多方密鑰量子資訊包 (Inject Qubits)
            </button>
            <button class="action-btn topo-btn" @click="toggleTopology">
              🔄 切換幾何端數 ({{ state.boundaryCountN === 3 ? '切換為 4-端' : '切換為 3-端' }})
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

.wormhole-modal {
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.15);
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

.badge.open {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

.badge.closed {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.4);
}

.svg-container {
  display: flex;
  justify-content: center;
  background: #040812;
  border-radius: 8px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.wormhole-svg {
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
  border-color: #38bdf8;
}

.regime-btn.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
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
  color: #38bdf8;
  font-family: monospace;
}

input[type="range"] {
  accent-color: #38bdf8;
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

.inject-btn {
  background: #0284c7;
  color: #fff;
}

.inject-btn:hover {
  background: #0369a1;
}

.topo-btn {
  background: #8b5cf6;
  color: #fff;
}

.topo-btn:hover {
  background: #7c3aed;
}

@media (max-width: 768px) {
  .metrics-grid, .regime-buttons, .sliders-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
