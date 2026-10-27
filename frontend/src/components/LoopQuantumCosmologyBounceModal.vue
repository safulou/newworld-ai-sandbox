<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card lqc-theme">
      <div class="modal-header">
        <div class="title-block">
          <span class="badge">PART 57 · LOOP QUANTUM COSMOLOGY BIG BOUNCE &amp; PLANCK STAR</span>
          <h2>🌌 圈量子宇宙學大反彈奇點消除與普朗克星白洞躍遷</h2>
          <p class="subtitle">Ashtekar Holonomy Friedmann Bounce H² ∝ ρ(1 - ρ/ρ_crit), Area Gap Δ_area &amp; Planck Star White-Hole Burst</p>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">LQG 最小面積能隙 (Δ_area)</span>
          <span class="kpi-value highlight-amber">{{ state.minimumAreaGapLp2.toFixed(2) }} ℓ_Pl²</span>
          <span class="kpi-sub">γ_BI = {{ state.barberoImmirziGamma.toFixed(4) }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">修正哈伯平方率 (H² / H_max²)</span>
          <span class="kpi-value highlight-cyan">{{ state.effectiveHubbleRateSquared.toFixed(3) }}</span>
          <span class="kpi-sub">ρ = ρ_crit 時 H → 0 反彈</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">量子幾何排斥加速度 (ä / a)</span>
          <span class="kpi-value highlight-emerald">+{{ state.quantumRepulsionAcceleration.toFixed(2) }} Pl</span>
          <span class="kpi-sub">全純修正消除奇點發散</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">普朗克星-白洞爆發峰值 (E_WH)</span>
          <span class="kpi-value highlight-violet">{{ state.whiteHoleBurstPeakMeV.toFixed(1) }} MeV</span>
          <span class="kpi-sub">黑洞-白洞量子引力穿隧</span>
        </div>
      </div>

      <div class="main-body">
        <div class="visual-panel">
          <svg viewBox="0 0 330 320" class="lqc-svg">
            <defs>
              <radialGradient id="bounceCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.55" />
                <stop offset="55%" stop-color="#6366f1" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="330" height="320" rx="12" fill="#070a14" />
            <circle cx="165" cy="160" r="115" fill="url(#bounceCoreGrad)" />

            <!-- Contracting -> Big Bounce Throat -> Expanding Cosmological Hyperbola -->
            <path
              d="M 65 40 Q 145 160 65 280"
              fill="none"
              stroke="#fbbf24"
              stroke-width="2"
              stroke-dasharray="4 3"
            />
            <path
              d="M 265 40 Q 185 160 265 280"
              fill="none"
              stroke="#fbbf24"
              stroke-width="2"
              stroke-dasharray="4 3"
            />

            <!-- Planck Star Core -->
            <circle cx="165" cy="160" r="24" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2" />
            <text x="165" y="157" fill="#fde047" font-size="9" font-weight="bold" text-anchor="middle">ρ_crit</text>
            <text x="165" y="168" fill="#38bdf8" font-size="8" text-anchor="middle">H = 0</text>

            <!-- 18 SU(2) Spin Network Volume Quanta Nodes -->
            <g v-for="node in state.spinNodes" :key="node.id">
              <line
                x1="165"
                y1="160"
                :x2="node.x"
                :y2="node.y"
                stroke="#818cf8"
                stroke-width="1"
                opacity="0.35"
              />
              <circle
                :cx="node.x"
                :cy="node.y"
                :r="3.5 + node.spinLabelJ * 1.8"
                :fill="node.isRebounding ? '#facc15' : '#38bdf8'"
                stroke="#f8fafc"
                stroke-width="1"
              />
            </g>

            <text x="12" y="22" fill="#fde047" font-size="10" font-weight="bold">
              LQC Spin-Network Big Bounce (ρ / ρ_crit = {{ state.energyDensityRatioRhoOverCrit.toFixed(2) }})
            </text>
            <text x="12" y="306" fill="#94a3b8" font-size="9">
              Regime: {{ state.activeRegime }} | Δ_area = {{ state.minimumAreaGapLp2.toFixed(2) }} ℓ_Pl²
            </text>
          </svg>
        </div>

        <div class="controls-panel">
          <div class="regime-section">
            <label class="section-title">圈量子宇宙學與普朗克星相區 (LQC Regimes)</label>
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
                <span>普朗克核心能量密度比 ρ / ρ_crit (0.05 ~ 1.00)</span>
                <strong class="accent-amber">{{ state.energyDensityRatioRhoOverCrit.toFixed(2) }}</strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.00"
                step="0.01"
                :value="state.energyDensityRatioRhoOverCrit"
                @input="onRhoChange"
              />
            </div>

            <div class="slider-group">
              <div class="slider-header">
                <span>Barbero-Immirzi 參數 γ_BI (0.12 ~ 0.50)</span>
                <strong class="accent-cyan">{{ state.barberoImmirziGamma.toFixed(4) }}</strong>
              </div>
              <input
                type="range"
                min="0.12"
                max="0.50"
                step="0.005"
                :value="state.barberoImmirziGamma"
                @input="onGammaChange"
              />
            </div>
          </div>

          <div class="action-row">
            <button class="action-btn primary" @click="triggerSound">
              🔊 觸發普朗克星大反彈引力脈衝音
            </button>
            <button class="action-btn secondary" @click="resetEngine">
              ↺ 重置 LQC 臨界反彈態
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
  loopQuantumCosmologyBouncePlanckStarEngine,
  type LqcBouncePlanckStarRegime
} from '../engine/loopQuantumCosmologyBouncePlanckStar';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = reactive(loopQuantumCosmologyBouncePlanckStarEngine.getState());
let syncTimer: ReturnType<typeof setInterval> | null = null;

const regimeOptions: { value: LqcBouncePlanckStarRegime; label: string; desc: string; icon: string }[] = [
  {
    value: 'classical-friedmann-collapse',
    label: '經典弗里德曼引力坍縮',
    desc: '低密度區 ρ ≪ ρ_crit，遵循廣義相對論 H² ∝ ρ',
    icon: '📉'
  },
  {
    value: 'holonomy-quantum-repulsion-onset',
    label: '全純量子排斥力啟動',
    desc: '跨越 ρ > ρ_crit/3，量子幾何開始減緩坍縮',
    icon: '🛡️'
  },
  {
    value: 'unitary-big-bounce-singularity-free',
    label: '么正大反彈無奇點過渡',
    desc: 'ρ → ρ_crit ≈ 0.41 ρ_Pl，H=0 實現收縮至膨脹反彈',
    icon: '🌌'
  },
  {
    value: 'planck-star-white-hole-tunneling',
    label: '普朗克星-白洞量子穿隧',
    desc: '黑洞普朗克星核心反彈為白洞並釋放高能伽瑪暴',
    icon: '💥'
  }
];

function syncFromEngine(): void {
  Object.assign(state, loopQuantumCosmologyBouncePlanckStarEngine.getState());
}

function selectRegime(regime: LqcBouncePlanckStarRegime): void {
  loopQuantumCosmologyBouncePlanckStarEngine.setRegime(regime);
  loopQuantumCosmologyBouncePlanckStarEngine.triggerLqcBounceSound();
  achievements.unlock('lqc_big_bounce_planck_star');
  syncFromEngine();
}

function onRhoChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  loopQuantumCosmologyBouncePlanckStarEngine.setEnergyDensityRatio(val);
  achievements.unlock('lqc_big_bounce_planck_star');
  syncFromEngine();
}

function onGammaChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  loopQuantumCosmologyBouncePlanckStarEngine.setBarberoImmirziGamma(val);
  achievements.unlock('lqc_big_bounce_planck_star');
  syncFromEngine();
}

function triggerSound(): void {
  loopQuantumCosmologyBouncePlanckStarEngine.triggerLqcBounceSound();
  achievements.unlock('lqc_big_bounce_planck_star');
}

function resetEngine(): void {
  loopQuantumCosmologyBouncePlanckStarEngine.reset();
  syncFromEngine();
}

function close(): void {
  uiStore.setLoopQuantumCosmologyBounceModal(false);
}

onMounted(() => {
  achievements.unlock('lqc_big_bounce_planck_star');
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
  background: linear-gradient(145deg, #0b0d1e 0%, #151934 100%);
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 16px;
  padding: 20px 24px;
  color: #f1f5f9;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(250, 204, 21, 0.18);
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
  color: #facc15;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.35);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 4px;
}
.title-block h2 {
  margin: 2px 0;
  font-size: 20px;
  color: #fef9c3;
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
.lqc-svg {
  width: 100%;
  height: auto;
  border: 1px solid rgba(250, 204, 21, 0.3);
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
  border-color: #facc15;
  background: rgba(250, 204, 21, 0.16);
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
  background: linear-gradient(90deg, #d97706, #6366f1);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}
</style>
