<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card pbh-atom-modal">
      <header class="modal-header">
        <div class="title-group">
          <span class="icon-badge">⚛️</span>
          <div>
            <h2>原初黑洞超輻射軸子玻色雲與引力原子躍遷干涉儀</h2>
            <p class="subtitle">Primordial Black Hole Superradiant Axion Cloud & Gravitational Atom Transition</p>
          </div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </header>

      <div class="modal-body">
        <!-- 左側：引力原子 |211> / |322> 氫軌域波瓣與克爾能層 SVG 動態視圖 -->
        <div class="viz-panel">
          <div class="svg-container">
            <svg viewBox="0 0 330 320" class="pbh-svg">
              <defs>
                <radialGradient id="ergosphereGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#020617" stop-opacity="1" />
                  <stop offset="32%" stop-color="#38bdf8" stop-opacity="0.35" />
                  <stop offset="72%" stop-color="#c084fc" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
                </radialGradient>
              </defs>

              <rect width="330" height="320" fill="#060913" rx="10" />
              <circle cx="165" cy="160" r="142" fill="url(#ergosphereGlow)" />

              <!-- 引力玻爾軌道參考環 r_n = n^2 / (\alpha_g M) -->
              <circle cx="165" cy="160" r="58" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-dasharray="4 3" />
              <circle cx="165" cy="160" r="92" fill="none" stroke="rgba(192, 132, 252, 0.28)" stroke-dasharray="6 4" />

              <!-- 玻色新星自吸引內爆衝擊波環 -->
              <circle
                v-if="state.bosenovaCriticalityRatio >= 0.95"
                cx="165"
                cy="160"
                :r="105 + 12 * Math.sin(state.pulsePhase * 3)"
                fill="none"
                stroke="#f43f5e"
                stroke-width="2"
                stroke-dasharray="5 3"
              />

              <!-- 中心旋轉克爾黑洞與能層邊界 -->
              <ellipse
                cx="165"
                cy="160"
                :rx="24 + 8 * state.initialKerrSpinParameter"
                ry="22"
                fill="rgba(56, 189, 248, 0.14)"
                stroke="#38bdf8"
                stroke-width="1.3"
              />
              <circle cx="165" cy="160" r="15" fill="#020617" stroke="#facc15" stroke-width="1.5" />
              <text x="165" y="164" fill="#facc15" font-size="8" font-weight="bold" text-anchor="middle">Kerr PBH</text>

              <!-- 16 個引力原子氫軌域波瓣與躍遷節點 -->
              <g v-for="node in state.orbitalNodes" :key="node.id">
                <line
                  x1="165"
                  y1="160"
                  :x2="node.x"
                  :y2="node.y"
                  :stroke="nodeColor(node.quantumStateLabel)"
                  stroke-width="1.1"
                  stroke-opacity="0.38"
                />
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  :r="node.quantumStateLabel === 'bosenova-shock-shell' ? 6.5 : 5.2"
                  :fill="nodeColor(node.quantumStateLabel)"
                  stroke="#0f172a"
                  stroke-width="1.2"
                />
              </g>

              <text x="12" y="22" fill="#7dd3fc" font-size="10" font-family="monospace">
                α_g = G M μ_a / ℏc = {{ state.gravitationalFineStructureAlpha.toFixed(3) }} | a_* = {{ state.initialKerrSpinParameter.toFixed(2) }}
              </text>
              <text x="12" y="308" fill="#c084fc" font-size="10" font-family="monospace">
                M_cloud/M_BH = {{ state.axionCloudMassFractionPct.toFixed(2) }}% | log10(h_0) = {{ state.monochromaticGwStrainLog10.toFixed(2) }}
              </text>
            </svg>
          </div>

          <div class="regime-banner">
            <span class="regime-tag">當前引力原子相態：</span>
            <strong>{{ regimeLabel(state.activeRegime) }}</strong>
          </div>
        </div>

        <!-- 右側：6 大物理指標與超輻射控制面板 -->
        <div class="control-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">引力精細結構常數 (α_g)</span>
              <span class="m-val cyan">{{ state.gravitationalFineStructureAlpha.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">克爾初始自旋參數 (a_*)</span>
              <span class="m-val gold">{{ state.initialKerrSpinParameter.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">軸子玻色雲質量比 (M_c/M)</span>
              <span class="m-val emerald">{{ state.axionCloudMassFractionPct.toFixed(2) }}%</span>
            </div>
            <div class="metric-box">
              <span class="m-label">雷吉飽和平衡自旋 (a_Regge)</span>
              <span class="m-val violet">{{ state.reggeSpinDownEquilibriumA.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">單色引力波應變 (log10 h₀)</span>
              <span class="m-val cyan">{{ state.monochromaticGwStrainLog10.toFixed(2) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">玻色新星臨界比 (N/N_crit)</span>
              <span class="m-val rose">{{ state.bosenovaCriticalityRatio.toFixed(3) }}</span>
            </div>
          </div>

          <div class="sliders-box">
            <div class="slider-row">
              <label>
                <span>引力精細結構常數 α_g = G M μ_a / ℏc</span>
                <strong>{{ state.gravitationalFineStructureAlpha.toFixed(3) }}</strong>
              </label>
              <input
                type="range"
                min="0.04"
                max="0.48"
                step="0.005"
                :value="state.gravitationalFineStructureAlpha"
                @input="onAlphaChange"
              />
            </div>

            <div class="slider-row">
              <label>
                <span>原初黑洞無量綱克爾自旋 a_*</span>
                <strong>{{ state.initialKerrSpinParameter.toFixed(2) }}</strong>
              </label>
              <input
                type="range"
                min="0.15"
                max="0.99"
                step="0.01"
                :value="state.initialKerrSpinParameter"
                @input="onSpinChange"
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
              🔊 合成 |322⟩ → |211⟩ 引力原子巴耳末躍遷與玻色新星共鳴音
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
  primordialBlackHoleAxionGravitationalAtomEngine,
  type PbhGravitationalAtomRegime
} from '@/engine/primordialBlackHoleAxionGravitationalAtom'

const ui = useUIStore()
const state = reactive(primordialBlackHoleAxionGravitationalAtomEngine.getState())
let timer: number | null = null

const regimes: { key: PbhGravitationalAtomRegime; name: string }[] = [
  { key: 'superradiant-211-dipole-cloud-growth', name: '|211⟩ 偶極軸子雲超輻射生長' },
  { key: 'level-transition-322-to-211-monochromatic-gw', name: '|322⟩→|211⟩ 能階躍遷單色引力波' },
  { key: 'regge-trajectory-spin-down-saturation', name: '雷吉軌跡 ω_R = mΩ_H 自旋減速飽和' },
  { key: 'attractive-axion-self-interaction-bosenova', name: '軸子自吸引玻色新星 (Bosenova) 內爆' }
]

function syncState(): void {
  Object.assign(state, primordialBlackHoleAxionGravitationalAtomEngine.getState())
}

function onAlphaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  primordialBlackHoleAxionGravitationalAtomEngine.setGravitationalFineStructureAlpha(val)
  syncState()
}

function onSpinChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  primordialBlackHoleAxionGravitationalAtomEngine.setInitialKerrSpinParameter(val)
  syncState()
}

function selectRegime(r: PbhGravitationalAtomRegime): void {
  primordialBlackHoleAxionGravitationalAtomEngine.setRegime(r)
  primordialBlackHoleAxionGravitationalAtomEngine.triggerPbhGravitationalAtomSound()
  achievements.unlock('pbh_superradiant_axion_gravitational_atom')
  syncState()
}

function playSound(): void {
  primordialBlackHoleAxionGravitationalAtomEngine.triggerPbhGravitationalAtomSound()
  achievements.unlock('pbh_superradiant_axion_gravitational_atom')
}

function nodeColor(label: string): string {
  if (label === '2p-m1-211-lobe') return '#38bdf8'
  if (label === '3d-m2-322-quadrupole') return '#c084fc'
  return '#f43f5e'
}

function regimeLabel(r: PbhGravitationalAtomRegime): string {
  return regimes.find(item => item.key === r)?.name || r
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  achievements.unlock('pbh_superradiant_axion_gravitational_atom')
  timer = window.setInterval(() => {
    primordialBlackHoleAxionGravitationalAtomEngine.update(0.06)
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
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.2);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.16), rgba(192, 132, 252, 0.08));
  border-bottom: 1px solid rgba(56, 189, 248, 0.25);
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
  color: #38bdf8;
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
  background: #060913;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.pbh-svg {
  width: 100%;
  height: auto;
  display: block;
}
.regime-banner {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #bae6fd;
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
.m-val.cyan { color: #38bdf8; }
.m-val.gold { color: #facc15; }
.m-val.emerald { color: #34d399; }
.m-val.violet { color: #c084fc; }
.m-val.rose { color: #fb7185; }
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
  accent-color: #38bdf8;
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
  background: rgba(56, 189, 248, 0.22);
  border-color: #38bdf8;
  color: #38bdf8;
}
.sound-btn {
  width: 100%;
  background: linear-gradient(90deg, #0284c7, #7c3aed);
  border: none;
  color: #fff;
  padding: 11px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
</style>
