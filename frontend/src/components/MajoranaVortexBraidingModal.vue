<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card majorana-braid-modal">
      <header class="modal-header">
        <div class="title-group">
          <span class="icon-badge">🧬</span>
          <div>
            <h2>拓撲非阿貝爾馬約拉納超流渦旋晶格與通用拓撲量子編織計算機</h2>
            <p class="subtitle">Topological Non-Abelian Majorana Superfluid Vortex Lattice & Universal Braiding Computer</p>
          </div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </header>

      <div class="modal-body">
        <!-- 左側：半量子渦旋伊凡諾夫 8 字形世界線編織與魔術態蒸餾 SVG 視圖 -->
        <div class="viz-panel">
          <div class="svg-container">
            <svg viewBox="0 0 330 320" class="braid-svg">
              <defs>
                <radialGradient id="superfluidCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#34d399" stop-opacity="0.28" />
                  <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.12" />
                  <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
                </radialGradient>
              </defs>

              <rect width="330" height="320" fill="#060a14" rx="10" />
              <circle cx="165" cy="160" r="140" fill="url(#superfluidCore)" />

              <!-- 手性 p_x + i p_y 超流半量子渦旋編織軌道環 -->
              <circle cx="165" cy="160" r="76" fill="none" stroke="rgba(52, 211, 153, 0.3)" stroke-dasharray="5 4" />
              <circle cx="165" cy="160" r="38" fill="none" stroke="rgba(250, 204, 21, 0.25)" stroke-dasharray="3 3" />

              <!-- 成對渦旋之間的非阿貝爾費米子奇偶性融合弦 -->
              <g v-for="(node, idx) in state.vortexNodes" :key="'chord-' + node.id">
                <line
                  v-if="idx % 2 === 0 && state.vortexNodes[idx + 1]"
                  :x1="node.x"
                  :y1="node.y"
                  :x2="state.vortexNodes[idx + 1].x"
                  :y2="state.vortexNodes[idx + 1].y"
                  stroke="#38bdf8"
                  stroke-width="1.6"
                  stroke-opacity="0.65"
                />
              </g>

              <!-- 16 個馬約拉納零模渦旋核心與魔術態蒸餾輔助渦旋 -->
              <g v-for="node in state.vortexNodes" :key="node.id">
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  :r="node.vortexRole === 'magic-state-ancilla-vortex' ? 6.5 : 5.5"
                  :fill="vortexColor(node.vortexRole)"
                  stroke="#0f172a"
                  stroke-width="1.3"
                />
                <text
                  :x="node.x"
                  :y="node.y - 8"
                  fill="#e2e8f0"
                  font-size="7.5"
                  font-family="monospace"
                  text-anchor="middle"
                >
                  γ{{ node.id + 1 }}({{ node.fermionParityEigenvalue > 0 ? '+' : '-' }})
                </text>
              </g>

              <text x="12" y="22" fill="#6ee7b7" font-size="10" font-family="monospace">
                U_ij = exp(π γ_i γ_j / 4) | dim(H_GSD) = 2^(N-1) = {{ state.groundStateManifoldDimension }}
              </text>
              <text x="12" y="308" fill="#fde047" font-size="10" font-family="monospace">
                log10(p_braid) = {{ state.logicalCliffordGateErrorLog10.toFixed(2) }} | F_T(π/8) = {{ state.magicStateDistillationFidelity.toFixed(4) }}
              </text>
            </svg>
          </div>

          <div class="regime-banner">
            <span class="regime-tag">當前拓撲編織架構：</span>
            <strong>{{ regimeLabel(state.activeRegime) }}</strong>
          </div>
        </div>

        <!-- 右側：6 大物理指標與控制面板 -->
        <div class="control-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">CdGM 能隙溫度比 (Δ/k_B T)</span>
              <span class="m-val emerald">{{ state.cdgmCoreMinigapRatio.toFixed(1) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">半量子渦旋總數 (2N)</span>
              <span class="m-val cyan">{{ state.activeHalfQuantumVortexCount }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">基態簡併維度 (2^(N-1))</span>
              <span class="m-val gold">{{ state.groundStateManifoldDimension }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">編織邏輯錯誤率 (log10 p)</span>
              <span class="m-val violet">{{ state.logicalCliffordGateErrorLog10.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">魔術態 T-閘保真度 (F_T)</span>
              <span class="m-val emerald">{{ state.magicStateDistillationFidelity.toFixed(4) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">準粒子毒化保護時間 (τ_QP)</span>
              <span class="m-val cyan">{{ state.quasiparticlePoisoningTimeMs.toFixed(1) }} ms</span>
            </div>
          </div>

          <div class="sliders-box">
            <div class="slider-row">
              <label>
                <span>渦旋核心 CdGM 迷你能隙比 Δ_CdGM / (k_B T)</span>
                <strong>{{ state.cdgmCoreMinigapRatio.toFixed(1) }}</strong>
              </label>
              <input
                type="range"
                min="2.0"
                max="24.0"
                step="0.5"
                :value="state.cdgmCoreMinigapRatio"
                @input="onGapChange"
              />
            </div>

            <div class="slider-row">
              <label>
                <span>活動半量子馬約拉納渦旋總數 2N</span>
                <strong>{{ state.activeHalfQuantumVortexCount }}</strong>
              </label>
              <input
                type="range"
                min="4"
                max="16"
                step="2"
                :value="state.activeHalfQuantumVortexCount"
                @input="onVortexCountChange"
              />
            </div>
          </div>

          <div class="preset-row">
            <button
              v-for="r in regimes"
              :key="r.key"
              class="preset-btn"
              :class="{ active: state.activeRegime === r.key }"
              @click="selectRegime(r.key)"
            >
              {{ r.name }}
            </button>
          </div>

          <div class="action-row">
            <button class="sound-btn" @click="playSound">
              🔊 合成伊凡諾夫 π/4 非阿貝爾渦旋編織與 π/8 魔術態蒸餾共鳴音
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { achievements } from '@/engine/achievements'
import {
  majoranaSuperfluidVortexBraidingComputerEngine,
  type MajoranaVortexBraidingRegime
} from '@/engine/majoranaSuperfluidVortexBraidingComputer'

const ui = useUIStore()
const state = reactive(majoranaSuperfluidVortexBraidingComputerEngine.getState())
let timer: number | null = null

const regimes: { key: MajoranaVortexBraidingRegime; name: string }[] = [
  { key: 'ivanov-half-quantum-vortex-clifford-braid', name: '伊凡諾夫半量子渦旋 Clifford 編織' },
  { key: 'fermion-parity-interferometric-readout', name: '費米子奇偶性馬赫-曾德爾干涉讀取' },
  { key: 'bravyi-kitaev-magic-state-t-gate-distillation', name: '15-to-1 魔術態蒸餾 π/8 T-閘' },
  { key: 'fault-tolerant-universal-braid-circuit', name: '容錯通用拓撲量子編織計算線路' }
]

function syncState(): void {
  Object.assign(state, majoranaSuperfluidVortexBraidingComputerEngine.getState())
}

function onGapChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  majoranaSuperfluidVortexBraidingComputerEngine.setCdgmCoreMinigapRatio(val)
  syncState()
}

function onVortexCountChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  majoranaSuperfluidVortexBraidingComputerEngine.setActiveHalfQuantumVortexCount(val)
  syncState()
}

function selectRegime(r: MajoranaVortexBraidingRegime): void {
  majoranaSuperfluidVortexBraidingComputerEngine.setRegime(r)
  majoranaSuperfluidVortexBraidingComputerEngine.triggerMajoranaBraidingSound()
  achievements.unlock('majorana_superfluid_vortex_braiding_computer')
  syncState()
}

function playSound(): void {
  majoranaSuperfluidVortexBraidingComputerEngine.triggerMajoranaBraidingSound()
  achievements.unlock('majorana_superfluid_vortex_braiding_computer')
}

function vortexColor(role: string): string {
  if (role === 'majorana-zero-mode-core') return '#34d399'
  if (role === 'magic-state-ancilla-vortex') return '#facc15'
  return '#38bdf8'
}

function regimeLabel(r: MajoranaVortexBraidingRegime): string {
  return regimes.find(item => item.key === r)?.name || r
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  achievements.unlock('majorana_superfluid_vortex_braiding_computer')
  timer = window.setInterval(() => {
    majoranaSuperfluidVortexBraidingComputerEngine.update(0.06)
    syncState()
  }, 60)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  width: min(960px, 95vw);
  background: rgba(10, 15, 30, 0.96);
  border: 1px solid rgba(52, 211, 153, 0.45);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(52, 211, 153, 0.2);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: linear-gradient(90deg, rgba(52, 211, 153, 0.16), rgba(56, 189, 248, 0.08));
  border-bottom: 1px solid rgba(52, 211, 153, 0.25);
}
.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-badge {
  font-size: 28px;
}
.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #34d399;
}
.subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}
.close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.modal-body {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  padding: 20px;
}
.svg-container {
  background: #060a14;
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.braid-svg {
  width: 100%;
  height: auto;
  display: block;
}
.regime-banner {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #a7f3d0;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}
.metric-box {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.m-label {
  font-size: 11px;
  color: #94a3b8;
}
.m-val {
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
}
.m-val.emerald { color: #34d399; }
.m-val.cyan { color: #38bdf8; }
.m-val.gold { color: #facc15; }
.m-val.violet { color: #c084fc; }
.sliders-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}
.slider-row label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
  margin-bottom: 4px;
}
.slider-row input[type='range'] {
  width: 100%;
  accent-color: #34d399;
}
.preset-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.preset-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e2e8f0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.preset-btn.active,
.preset-btn:hover {
  background: rgba(52, 211, 153, 0.22);
  border-color: #34d399;
  color: #34d399;
}
.sound-btn {
  width: 100%;
  background: linear-gradient(90deg, #059669, #0284c7);
  border: none;
  color: #fff;
  padding: 11px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
</style>
