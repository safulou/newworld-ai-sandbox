<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card attosecond-weyl-modal">
      <header class="modal-header">
        <div class="title-group">
          <span class="icon-badge">⚡</span>
          <div>
            <h2>阿秒雷射強場高次諧波外爾半金屬與非微擾貝里曲率動態布洛赫譜儀</h2>
            <p class="subtitle">Attosecond Strong-Field High-Harmonic Weyl Semimetal & Berry Curvature Bloch Spectrometer</p>
          </div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </header>

      <div class="modal-body">
        <!-- 左側：外爾節點貝里單極子與 8 字形動態布洛赫偶次諧波軌跡 SVG 視圖 -->
        <div class="viz-panel">
          <div class="svg-container">
            <svg viewBox="0 0 330 320" class="atto-svg">
              <defs>
                <radialGradient id="xuvBurstGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#facc15" stop-opacity="0.34" />
                  <stop offset="55%" stop-color="#fb7185" stop-opacity="0.16" />
                  <stop offset="100%" stop-color="#070a14" stop-opacity="0" />
                </radialGradient>
              </defs>

              <rect width="330" height="320" fill="#060913" rx="10" />
              <circle cx="165" cy="160" r="142" fill="url(#xuvBurstGlow)" />

              <!-- 布里淵區軸線與正負手性外爾單極子 W+ / W- -->
              <line x1="25" y1="160" x2="305" y2="160" stroke="rgba(250, 204, 21, 0.25)" stroke-dasharray="4 3" />
              <line x1="165" y1="30" x2="165" y2="290" stroke="rgba(56, 189, 248, 0.25)" stroke-dasharray="4 3" />

              <circle cx="115" cy="160" r="9" fill="#38bdf8" stroke="#fff" stroke-width="1.4" />
              <text x="115" y="145" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">
                W⁺ (+{{ state.weylMonopoleChiralityCharge }})
              </text>

              <circle cx="215" cy="160" r="9" fill="#fb7185" stroke="#fff" stroke-width="1.4" />
              <text x="215" y="145" fill="#fb7185" font-size="9" font-weight="bold" text-anchor="middle">
                W⁻ (-{{ state.weylMonopoleChiralityCharge }})
              </text>

              <!-- 16 個奇/偶次諧波與阿秒 XUV 脈衝節點 -->
              <g v-for="node in state.harmonicNodes" :key="node.id">
                <line
                  x1="165"
                  y1="160"
                  :x2="node.x"
                  :y2="node.y"
                  :stroke="harmonicColor(node.harmonicChannel)"
                  stroke-width="1"
                  stroke-opacity="0.35"
                />
                <circle
                  :cx="node.x"
                  :cy="node.y"
                  :r="node.harmonicChannel === 'attosecond-xuv-chirp-burst' ? 6.2 : 5.0"
                  :fill="harmonicColor(node.harmonicChannel)"
                  stroke="#0f172a"
                  stroke-width="1.2"
                />
                <text
                  :x="node.x"
                  :y="node.y - 7"
                  fill="#f8fafc"
                  font-size="7.5"
                  font-family="monospace"
                  text-anchor="middle"
                >
                  H{{ node.harmonicOrderN }}
                </text>
              </g>

              <text x="12" y="22" fill="#fde047" font-size="10" font-family="monospace">
                γ_K = {{ state.keldyshAdiabaticityGamma.toFixed(3) }} | N_cutoff = H{{ state.highHarmonicCutoffOrderN }}
              </text>
              <text x="12" y="308" fill="#fda4af" font-size="10" font-family="monospace">
                I_2n^⊥ / I_(2n+1)^∥ = {{ state.evenToOddBerryHarmonicRatio.toFixed(3) }} | τ_atto = {{ state.isolatedAttosecondPulseWidthAs.toFixed(1) }} as
              </text>
            </svg>
          </div>

          <div class="regime-banner">
            <span class="regime-tag">當前強場阿秒光譜體制：</span>
            <strong>{{ regimeLabel(state.activeRegime) }}</strong>
          </div>
        </div>

        <!-- 右側：6 大物理指標與控制面板 -->
        <div class="control-panel">
          <div class="metrics-grid">
            <div class="metric-box">
              <span class="m-label">峰值雷射電場 (E₀)</span>
              <span class="m-val gold">{{ state.peakLaserElectricFieldMvCm.toFixed(1) }} MV/cm</span>
            </div>
            <div class="metric-box">
              <span class="m-label">外爾單極拓撲荷 (|C_W|)</span>
              <span class="m-val cyan">±{{ state.weylMonopoleChiralityCharge }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Keldysh 穿隧參數 (γ_K)</span>
              <span class="m-val emerald">{{ state.keldyshAdiabaticityGamma.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">XUV 諧波截止階數 (N_cut)</span>
              <span class="m-val violet">H{{ state.highHarmonicCutoffOrderN }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">貝里偶次/奇次諧波比</span>
              <span class="m-val rose">{{ state.evenToOddBerryHarmonicRatio.toFixed(3) }}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">孤立阿秒脈衝寬度 (τ_atto)</span>
              <span class="m-val gold">{{ state.isolatedAttosecondPulseWidthAs.toFixed(1) }} as</span>
            </div>
          </div>

          <div class="sliders-box">
            <div class="slider-row">
              <label>
                <span>強場中紅外雷射峰值電場 E₀ (MV/cm)</span>
                <strong>{{ state.peakLaserElectricFieldMvCm.toFixed(1) }} MV/cm</strong>
              </label>
              <input
                type="range"
                min="4.0"
                max="36.0"
                step="0.5"
                :value="state.peakLaserElectricFieldMvCm"
                @input="onFieldChange"
              />
            </div>

            <div class="slider-row">
              <label>
                <span>外爾節點貝里單極子拓撲陳數 |C_Weyl| (1 / 2 / 4)</span>
                <strong>|C_W| = {{ state.weylMonopoleChiralityCharge }}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                :value="state.weylMonopoleChiralityCharge"
                @input="onChargeChange"
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
              🔊 合成貝里曲率反常偶次諧波 (2nω₀) 與孤立阿秒 XUV 啾頻脈衝音
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
  attosecondWeylHighHarmonicBerrySpectrometerEngine,
  type AttosecondWeylHhgRegime
} from '@/engine/attosecondWeylHighHarmonicBerrySpectrometer'

const ui = useUIStore()
const state = reactive(attosecondWeylHighHarmonicBerrySpectrometerEngine.getState())
let timer: number | null = null

const regimes: { key: AttosecondWeylHhgRegime; name: string }[] = [
  { key: 'intraband-dynamic-bloch-oscillation-comb', name: '帶內動態布洛赫振盪奇次諧波梳' },
  { key: 'berry-monopole-anomalous-even-harmonics', name: '貝里單極子反常正交偶次諧波 2nω₀' },
  { key: 'keldysh-tunneling-xuv-cutoff-extension', name: 'Keldysh γ_K<1 穿隧 XUV 截止延伸' },
  { key: 'isolated-sub100as-chiral-xuv-attosecond-pulse', name: '孤立 <60 as 手性極紫外阿秒脈衝' }
]

function syncState(): void {
  Object.assign(state, attosecondWeylHighHarmonicBerrySpectrometerEngine.getState())
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value)
  attosecondWeylHighHarmonicBerrySpectrometerEngine.setPeakLaserElectricField(val)
  syncState()
}

function onChargeChange(e: Event): void {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  attosecondWeylHighHarmonicBerrySpectrometerEngine.setWeylMonopoleChiralityCharge(val)
  syncState()
}

function selectRegime(r: AttosecondWeylHhgRegime): void {
  attosecondWeylHighHarmonicBerrySpectrometerEngine.setRegime(r)
  attosecondWeylHighHarmonicBerrySpectrometerEngine.triggerAttosecondWeylHhgSound()
  achievements.unlock('attosecond_weyl_high_harmonic_berry_pulse')
  syncState()
}

function playSound(): void {
  attosecondWeylHighHarmonicBerrySpectrometerEngine.triggerAttosecondWeylHhgSound()
  achievements.unlock('attosecond_weyl_high_harmonic_berry_pulse')
}

function harmonicColor(channel: string): string {
  if (channel === 'even-berry-anomalous-harmonic') return '#fb7185'
  if (channel === 'attosecond-xuv-chirp-burst') return '#facc15'
  return '#38bdf8'
}

function regimeLabel(r: AttosecondWeylHhgRegime): string {
  return regimes.find(item => item.key === r)?.name || r
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  achievements.unlock('attosecond_weyl_high_harmonic_berry_pulse')
  timer = window.setInterval(() => {
    attosecondWeylHighHarmonicBerrySpectrometerEngine.update(0.06)
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
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(250, 204, 21, 0.2);
  color: #f8fafc;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: linear-gradient(90deg, rgba(250, 204, 21, 0.16), rgba(244, 63, 94, 0.08));
  border-bottom: 1px solid rgba(250, 204, 21, 0.25);
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
  color: #facc15;
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
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.atto-svg {
  width: 100%;
  height: auto;
  display: block;
}
.regime-banner {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(250, 204, 21, 0.12);
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #fef08a;
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
.m-val.gold { color: #facc15; }
.m-val.cyan { color: #38bdf8; }
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
  accent-color: #facc15;
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
  background: rgba(250, 204, 21, 0.22);
  border-color: #facc15;
  color: #facc15;
}
.sound-btn {
  width: 100%;
  background: linear-gradient(90deg, #ca8a04, #e11d48);
  border: none;
  color: #fff;
  padding: 11px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
</style>
