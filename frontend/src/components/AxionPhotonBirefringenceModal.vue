<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card apbi-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 60 · AXION-PHOTON BIREFRINGENCE &amp; PRIMAKOFF RESONATOR</span>
          <h2>🔭 軸子-光子強磁場雙折射干涉儀與暗物質普里馬科夫共振腔</h2>
          <p class="subtitle">Chern-Simons L_{aγγ} = g_{aγγ} a E·B, Bow-Tie Fabry-Pérot LCP/RCP Phase Split &amp; ALPS-II Regeneration</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">真空雙折射旋轉角 (Δθ_biref)</span>
          <span class="kpi-value highlight-cyan">{{ state.birefringenceRotationNrad.toFixed(2) }} nrad</span>
          <span class="kpi-sub">LCP / RCP 圓偏振相速度相反偏移</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">普里馬科夫穿牆再生率 log₁₀(P)</span>
          <span class="kpi-value highlight-amber">{{ state.primakoffRegenerationLogProb.toFixed(2) }}</span>
          <span class="kpi-sub">P_{γ→a→γ} ∝ (g_{aγγ} B L)⁴ F_cav²</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">壓縮真空軸子訊噪比 (SNR)</span>
          <span class="kpi-value highlight-emerald">{{ state.shotNoiseSqueezedSnr.toFixed(1) }} σ</span>
          <span class="kpi-sub">突破散粒雜訊標準量子極限</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">法布里-珀羅腔精細度 (F_cav)</span>
          <span class="kpi-value highlight-violet">{{ state.opticalCavityFinesseK.toFixed(0) }}k</span>
          <span class="kpi-sub">橫向偶極磁場 B = {{ state.transverseMagneticFieldTesla.toFixed(1) }} T</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="apbi-svg">
            <defs>
              <radialGradient id="apbiCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" />
                <stop offset="55%" stop-color="#f59e0b" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#060914" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#060914" />
            <circle cx="165" cy="160" r="115" fill="url(#apbiCoreGrad)" />

            <!-- Bow-Tie Fabry-Pérot Optical Cavity Guide Path -->
            <polygon
              points="69,92 261,228 261,92 69,228"
              fill="none"
              stroke="#38bdf8"
              stroke-width="1.4"
              stroke-dasharray="5 3"
              opacity="0.65"
            />

            <!-- Central Primakoff Magnetic Dipole Conversion Wall -->
            <circle cx="165" cy="160" r="22" fill="#0f172a" stroke="#facc15" stroke-width="2" />
            <text x="165" y="157" fill="#fde047" font-size="8.5" font-weight="bold" text-anchor="middle">a ↔ γ</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">{{ state.transverseMagneticFieldTesla.toFixed(1) }} T</text>

            <!-- 16 LCP/RCP Birefringence Cavity Nodes -->
            <g v-for="node in state.cavityNodes" :key="node.id">
              <circle
                :cx="node.x"
                :cy="node.y"
                r="5.0"
                :fill="node.polarizationChirality === 'LCP' ? '#38bdf8' : '#facc15'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#7dd3fc" font-size="10" font-weight="bold">
              Bow-Tie Axion Birefringence Cavity (g_aγγ = {{ state.axionPhotonCouplingG11.toFixed(2) }}×10⁻¹¹ GeV⁻¹)
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Δθ_biref: {{ state.birefringenceRotationNrad.toFixed(2) }} nrad | SNR: {{ state.shotNoiseSqueezedSnr.toFixed(1) }} σ
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">軸子-光子雙折射與穿牆干涉體制 (Axion Cavity Regimes)</label>
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
                <span>軸子-雙光子耦合 g_aγγ (0.10 ~ 12.00 × 10⁻¹¹ GeV⁻¹)</span>
                <strong class="accent-cyan">{{ state.axionPhotonCouplingG11.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="12.00"
                step="0.10"
                :value="state.axionPhotonCouplingG11"
                @input="onCouplingChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>橫向超導偶極磁場 B_ext (1.0 ~ 18.0 T)</span>
                <strong class="accent-amber">{{ state.transverseMagneticFieldTesla.toFixed(1) }} T</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="18.0"
                step="0.5"
                :value="state.transverseMagneticFieldTesla"
                @input="onFieldChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 激發 LCP/RCP 軸子真空雙折射圓偏振拍頻音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置軸子雙折射干涉腔
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
  axionPhotonBirefringenceInterferometerEngine,
  type AxionBirefringenceRegime
} from '../engine/axionPhotonBirefringenceInterferometer';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(axionPhotonBirefringenceInterferometerEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: AxionBirefringenceRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'qcd-axion-bowtie-birefringence-cavity',
    label: 'QCD 軸子領結型雙折射諧振腔',
    desc: '四鏡環形腔消除反射雙折射背景，專注量測 a(t) 圓偏振相移',
    icon: '🔭'
  },
  {
    value: 'primakoff-light-shining-through-wall-alps',
    label: 'ALPS-II 普里馬科夫穿牆光再生',
    desc: '產生腔與再生腔雙重鎖頻共振，P_{γ→a→γ} 放大 F_cav² 倍',
    icon: '🧱'
  },
  {
    value: 'ultralight-alp-dark-matter-stochastic-halo',
    label: '超輕類軸子 (ALP) 暗物質暈探測',
    desc: '14 T 強磁場與高精細腔協同探測銀河系相干 ALP 暗物質場',
    icon: '🌌'
  },
  {
    value: 'quantum-squeezed-vacuum-shot-noise-bypass',
    label: '量子壓縮真空注入超越散粒雜訊',
    desc: '注入相位壓縮態光子，使軸子雙折射靈敏度突破標準量子極限',
    icon: '💎'
  }
];

function syncFromEngine(): void {
  Object.assign(state, axionPhotonBirefringenceInterferometerEngine.getState());
}

function selectRegime(regime: AxionBirefringenceRegime): void {
  axionPhotonBirefringenceInterferometerEngine.setRegime(regime);
  axionPhotonBirefringenceInterferometerEngine.triggerAxionBirefringenceSound();
  achievements.unlock('axion_photon_birefringence_interferometer');
  syncFromEngine();
}

function onCouplingChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  axionPhotonBirefringenceInterferometerEngine.setAxionPhotonCoupling(val);
  achievements.unlock('axion_photon_birefringence_interferometer');
  syncFromEngine();
}

function onFieldChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  axionPhotonBirefringenceInterferometerEngine.setTransverseMagneticField(val);
  achievements.unlock('axion_photon_birefringence_interferometer');
  syncFromEngine();
}

function triggerSound(): void {
  axionPhotonBirefringenceInterferometerEngine.triggerAxionBirefringenceSound();
  achievements.unlock('axion_photon_birefringence_interferometer');
}

function resetEngine(): void {
  axionPhotonBirefringenceInterferometerEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setAxionPhotonBirefringenceModal(false);
}

onMounted(() => {
  achievements.unlock('axion_photon_birefringence_interferometer');
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
  background: linear-gradient(145deg, #080f22 0%, #15142e 100%);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.2);
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
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #e0f2fe;
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
.highlight-violet { color: #c084fc; }
.main-body {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 18px;
}
.apbi-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(56, 189, 248, 0.3);
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
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.16);
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
.accent-amber { color: #facc15; }
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
  background: linear-gradient(90deg, #0284c7, #ca8a04);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
