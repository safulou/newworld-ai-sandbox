<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card mpbec-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 59 · MAGNON-POLARITON BEC &amp; CHIRAL SPIN-WAVE INTERFEROMETER</span>
          <h2>🌀 磁振子-極化激元玻色凝聚與非互易手性自旋波干涉儀</h2>
          <p class="subtitle">YIG Double-Minimum ±k₀ Magnon-Polariton BEC, Vacuum Rabi Splitting &amp; Interfacial DMI Sagnac Phase Δφ_NR</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">±k₀ 玻色凝聚佔居率 (n_BEC / n_tot)</span>
          <span class="kpi-value highlight-violet">{{ state.becCondensateFractionPct.toFixed(1) }}%</span>
          <span class="kpi-sub">平行參量泵浦 P/P_th = {{ state.parametricPumpRatioPth.toFixed(2) }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">非互易手性塞格奈克相移 (Δφ_NR)</span>
          <span class="kpi-value highlight-cyan">{{ state.nonreciprocalSagnacPhaseRad.toFixed(2) }} rad</span>
          <span class="kpi-sub">DMI 誘導 ±k₀ 自旋波群速度破缺</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">真空拉比劈裂強度 (g_mp / 2π)</span>
          <span class="kpi-value highlight-amber">{{ state.vacuumRabiCouplingMhz.toFixed(1) }} MHz</span>
          <span class="kpi-sub">YIG Kittel 模與 3D 微波腔強耦合</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">雙凝聚體干涉條紋可見度 (V)</span>
          <span class="kpi-value highlight-emerald">{{ (state.spatialStripeContrastVis * 100).toFixed(1) }}%</span>
          <span class="kpi-sub">|ψ_{+k₀} + ψ_{-k₀}|² 空間駐波對比</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="mpbec-svg">
            <defs>
              <radialGradient id="mpbecCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#c084fc" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#070914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070914" />
            <circle cx="165" cy="160" r="115" fill="url(#mpbecCoreGrad)" />

            <!-- Counter-Propagating ±k₀ Spin-Wave Sagnac Rings -->
            <circle cx="165" cy="160" r="56" fill="none" stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.65" />
            <circle cx="165" cy="160" r="86" fill="none" stroke="#e879f9" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65" />

            <!-- Central YIG-Cavity Hybridization Core -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#c084fc" stroke-width="2" />
            <text x="165" y="157" fill="#e879f9" font-size="8.5" font-weight="bold" text-anchor="middle">±k₀ BEC</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">{{ state.becCondensateFractionPct.toFixed(0) }}%</text>

            <!-- 16 Double-Minimum Magnon Condensate Nodes -->
            <g v-for="node in state.condensateNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                :stroke="node.valleyMinimumSign === 1 ? '#38bdf8' : '#e879f9'"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="4.2 + node.stripeDensityModulation * 2.2"
                :fill="node.valleyMinimumSign === 1 ? '#38bdf8' : '#e879f9'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#e879f9" font-size="10" font-weight="bold">
              YIG ±k₀ Magnon-Polariton BEC (D_DMI = {{ state.interfacialDmiConstantMjM2.toFixed(2) }} mJ/m²)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Δφ_NR: {{ state.nonreciprocalSagnacPhaseRad.toFixed(2) }} rad | Stripe Vis: {{ (state.spatialStripeContrastVis * 100).toFixed(1) }}%
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">磁振子-極化激元凝聚與非互易干涉體制 (Magnon BEC Regimes)</label>
            <div class="regime-buttons">
              <button
                v-for="opt in regimeOptions"
                :key="opt.value"
                :class="['regime-btn', { active: state.activeRegime === opt.value }]"
                @click="selectRegime(opt.value)"
              >
                <span class="reg-icon">{{ opt.icon }}</span>
                <div class="reg-Info">
                  <strong>{{ opt.label }}</strong>
                  <small>{{ opt.desc }}</small>
                </div>
              </button>
            </div>
          </div>

          <div class="sliders-section">
            <div class="slider-group">
              <div class="slider-header">
                <span>平行微波參量泵浦比 P / P_th (0.20 ~ 4.50)</span>
                <strong class="accent-violet">{{ state.parametricPumpRatioPth.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.20"
                max="4.50"
                step="0.05"
                :value="state.parametricPumpRatioPth"
                @input="onPumpChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>界面 Dzyaloshinskii-Moriya 常數 D_DMI (0.00 ~ 2.50 mJ/m²)</span>
                <strong class="accent-cyan">{{ state.interfacialDmiConstantMjM2.toFixed(2) }} mJ/m²</strong>
              </div>
              <input
                type="range"
                min="0.00"
                max="2.50"
                step="0.05"
                :value="state.interfacialDmiConstantMjM2"
                @input="onDmiChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 ±k₀ 雙極小值磁振子凝聚非互易拍頻音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置磁振子-極化激元凝聚態
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import {
  magnonPolaritonBecInterferometerEngine,
  type MagnonPolaritonBecRegime
} from '../engine/magnonPolaritonBecInterferometer';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(magnonPolaritonBecInterferometerEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: MagnonPolaritonBecRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'subthreshold-thermal-magnon-gas',
    label: '亞閾值熱平衡磁振子氣體',
    desc: 'P < P_th，自旋波遵循玻色-愛因斯坦熱分佈未發生宏觀凝聚',
    icon: '🌡️'
  },
  {
    value: 'parametric-double-minimum-magnon-bec',
    label: '±k₀ 雙極小值參量磁振子 BEC',
    desc: '跨越參量泵浦閾值，對稱填充 ±k₀ 形成高對比空間駐波條紋',
    icon: '❄️'
  },
  {
    value: 'strong-coupling-magnon-polariton-rabi-split',
    label: '強耦合磁振子-極化激元拉比劈裂',
    desc: 'g_mp/2π = 158 MHz 超強雜化，提升室溫極化激元凝聚佔居率',
    icon: '⚡'
  },
  {
    value: 'dmi-chiral-nonreciprocal-sagnac-interferometer',
    label: 'DMI 手性非互易塞格奈克干涉儀',
    desc: '界面 DMI 打破 ±k₀ 反演對稱，產生顯著非互易干涉相移 Δφ_NR',
    icon: '🌀'
  }
];

function syncFromEngine(): void {
  Object.assign(state, magnonPolaritonBecInterferometerEngine.getState());
}

function selectRegime(regime: MagnonPolaritonBecRegime): void {
  magnonPolaritonBecInterferometerEngine.setRegime(regime);
  magnonPolaritonBecInterferometerEngine.triggerMagnonPolaritonSound();
  achievements.unlock('magnon_polariton_bec_sagnac_interferometer');
  syncFromEngine();
}

function onPumpChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  magnonPolaritonBecInterferometerEngine.setParametricPumpRatio(val);
  achievements.unlock('magnon_polariton_bec_sagnac_interferometer');
  syncFromEngine();
}

function onDmiChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  magnonPolaritonBecInterferometerEngine.setInterfacialDmiConstant(val);
  achievements.unlock('magnon_polariton_bec_sagnac_interferometer');
  syncFromEngine();
}

function triggerSound(): void {
  magnonPolaritonBecInterferometerEngine.triggerMagnonPolaritonSound();
  achievements.unlock('magnon_polariton_bec_sagnac_interferometer');
}

function resetEngine(): void {
  magnonPolaritonBecInterferometerEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setMagnonPolaritonBecModal(false);
}

onMounted(() => {
  achievements.unlock('magnon_polariton_bec_sagnac_interferometer');
  syncTimer = setInterval(syncFromEngine, 80);
});

onUnmounted(() => {
  if (syncTimer) clearInterval(syncTimer);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 18, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.modal-card {
  width: min(940px, 95vw);
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #100b22 0%, #1a1033 100%);
  border: 1px solid rgba(192, 132, 252, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(192, 132, 252, 0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #e879f9;
  background: rgba(232, 121, 249, 0.14);
  border: 1px solid rgba(232, 121, 249, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fae8ff;
}
.subtitle {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}
.close-btn {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.kpi-box {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.kpi-label {
  font-size: 11px;
  color: #94a3b8;
}
.kpi-value {
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 2px;
}
.kpi-sub {
  font-size: 10px;
  color: #64748b;
}
.highlight-cyan { color: #38bdf8; }
.highlight-amber { color: #facc15; }
.highlight-emerald { color: #34d399; }
.highlight-violet { color: #e879f9; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.mpbec-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}
.regime-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.regime-btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 10px;
  padding: 8px 10px;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
}
.regime-btn.active {
  border-color: #e879f9;
  background: rgba(232, 121, 249, 0.16);
}
.reg-Info strong {
  display: block;
  font-size: 12px;
}
.reg-Info small {
  font-size: 10px;
  color: #94a3b8;
}
.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(15, 23, 42, 0.55);
  padding: 12px;
  border-radius: 10px;
}
.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}
.slider-group input[type='range'] {
  width: 100%;
}
.accent-cyan { color: #38bdf8; }
.accent-violet { color: #e879f9; }
.action-row {
  display: flex;
  gap: 10px;
}
.action-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  border: none;
}
.action-btn.primary {
  background: linear-gradient(90deg, #9333ea, #0284c7);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
