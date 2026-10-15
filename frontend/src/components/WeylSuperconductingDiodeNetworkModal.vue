<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">🕸️</span>
          <div>
            <h2>手性外爾半金屬拓撲超導二極體網絡</h2>
            <p class="subtitle">Multi-Terminal Josephson Diode Network, Chiral Magnetic Effect & Logic Gates</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="weyl-svg">
            <defs>
              <linearGradient id="weylBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#050a14" />
                <stop offset="50%" stop-color="#0c1524" />
                <stop offset="100%" stop-color="#070d18" />
              </linearGradient>

              <radialGradient id="weylCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#818cf8" stop-opacity="0.8" />
                <stop offset="70%" stop-color="#4f46e5" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#312e81" stop-opacity="0" />
              </radialGradient>

              <filter id="glowWeyl">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#weylBg)" rx="8" />

            <!-- Chiral Weyl Crystal Core (Center) -->
            <g transform="translate(320, 180)">
              <circle cx="0" cy="0" r="75" fill="url(#weylCoreGlow)" />
              <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="3 3" />

              <!-- Weyl Node Pairs (+k0 and -k0) -->
              <circle cx="-25" cy="0" r="7" fill="#ef4444" filter="url(#glowWeyl)" />
              <text x="-25" y="-12" fill="#fca5a5" font-size="10" text-anchor="middle">W- (手性 -1)</text>

              <circle cx="25" cy="0" r="7" fill="#3b82f6" filter="url(#glowWeyl)" />
              <text x="25" y="-12" fill="#93c5fd" font-size="10" text-anchor="middle">W+ (手性 +1)</text>

              <!-- Fermi Arc Surface States -->
              <path
                d="M -25,0 C -15,-30 15,-30 25,0"
                fill="none"
                stroke="#a855f7"
                stroke-width="2.5"
                filter="url(#glowWeyl)"
              />
              <path
                d="M -25,0 C -15,30 15,30 25,0"
                fill="none"
                stroke="#c084fc"
                stroke-width="2.5"
                stroke-dasharray="4 2"
              />

              <!-- 4-Terminal Superconducting Electrodes & Current Channels -->
              <!-- T1: Top (0, -110), T2: Right (130, 0), T3: Bottom (0, 110), T4: Left (-130, 0) -->
              <g v-for="(t, idx) in terminals" :key="'term' + idx">
                <!-- Junction Leads -->
                <line
                  :x1="0"
                  :y1="0"
                  :x2="t.x"
                  :y2="t.y"
                  :stroke="getLeadColor(idx)"
                  :stroke-width="2 + Math.abs(state.networkDiodeEfficiencyPercent) * 0.08"
                  opacity="0.8"
                />

                <!-- Non-Reciprocal Supercurrent Particle Flow -->
                <circle
                  v-for="p in 3"
                  :key="'part' + idx + p"
                  :cx="t.x * (((animTick * 1.5 + p * 0.33) % 1))"
                  :cy="t.y * (((animTick * 1.5 + p * 0.33) % 1))"
                  r="3"
                  :fill="getLeadColor(idx)"
                  filter="url(#glowWeyl)"
                />

                <!-- Terminal Electrode Pad -->
                <circle :cx="t.x" :cy="t.y" r="16" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
                <text :x="t.x" :y="t.y + 4" fill="#e0e7ff" font-size="11" font-weight="bold" text-anchor="middle">
                  T{{ idx + 1 }}
                </text>
                <text :x="t.x" :y="t.y + 24" fill="#a5b4fc" font-size="9" text-anchor="middle">
                  φ: {{ (state.terminalPhasesRad[idx] || 0).toFixed(2) }}
                </text>
              </g>

              <!-- Central Chirality Circulation Ring -->
              <circle
                cx="0"
                cy="0"
                r="45"
                fill="none"
                stroke="#6366f1"
                stroke-width="1.5"
                stroke-dasharray="6 4"
                :transform="`rotate(${animTick * 45})`"
              />
            </g>

            <!-- Right HUD Panel: Rectification Matrix Heatmap & CME Status -->
            <g transform="translate(560, 40)">
              <rect x="-10" y="-10" width="230" height="280" fill="#030712" stroke="#1f2937" rx="8" />
              <text x="5" y="15" fill="#e2e8f0" font-size="12" font-weight="bold">4x4 整流效率矩陣 R_ij</text>

              <!-- Matrix Grid -->
              <g transform="translate(15, 35)">
                <g v-for="(row, r) in state.rectificationMatrix" :key="'r' + r">
                  <g v-for="(val, c) in row" :key="'c' + c">
                    <rect
                      :x="c * 44"
                      :y="r * 32"
                      width="40"
                      height="28"
                      :fill="getMatrixCellColor(val)"
                      rx="4"
                    />
                    <text
                      :x="c * 44 + 20"
                      :y="r * 32 + 18"
                      fill="#ffffff"
                      font-size="10"
                      font-weight="bold"
                      text-anchor="middle"
                    >
                      {{ val > 0 ? '+' : '' }}{{ val.toFixed(2) }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- CME Status Indicator -->
              <g transform="translate(5, 185)">
                <text x="0" y="0" fill="#818cf8" font-size="11" font-weight="bold">手性磁效應 (CME) 驅動</text>
                <text x="0" y="18" fill="#94a3b8" font-size="10">
                  J_CME ∝ μ_5 · B: {{ (state.chiralChemicalPotentialMu5 * 1.4).toFixed(1) }} μA
                </text>
                <text x="0" y="36" fill="#10b981" font-size="11" font-weight="bold">
                  邏輯閘狀態: [{{ state.logicGateMode }}] 輸出有效
                </text>
                <text x="0" y="54" fill="#eab308" font-size="11">
                  平均整流效率 η: {{ state.networkDiodeEfficiencyPercent.toFixed(1) }}%
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Controls Grid -->
        <div class="controls-grid">
          <!-- Regime / Gate Modes -->
          <div class="ctrl-group">
            <label class="group-label">邏輯閘編程 (Logic Mode)</label>
            <div class="btn-wrap">
              <button
                v-for="mode in (['AND', 'OR', 'XOR'] as const)"
                :key="mode"
                class="gate-btn"
                :class="{ active: state.logicGateMode === mode }"
                @click="setGateMode(mode)"
              >
                閘: {{ mode }}
              </button>
            </div>

            <label class="group-label" style="margin-top: 10px;">操作體系 (Regime)</label>
            <div class="btn-wrap">
              <button
                v-for="r in regimes"
                :key="r.key"
                class="regime-btn"
                :class="{ active: state.activeRegime === r.key }"
                @click="setRegime(r.key)"
              >
                {{ r.label }}
              </button>
            </div>
          </div>

          <!-- Parameter Sliders -->
          <div class="ctrl-group">
            <div class="slider-row">
              <div class="slider-header">
                <span>手性化學勢 μ_5:</span>
                <span class="value">{{ state.chiralChemicalPotentialMu5.toFixed(1) }} meV</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                :value="state.chiralChemicalPotentialMu5"
                @input="onMu5Change"
              />
            </div>

            <div class="slider-row">
              <div class="slider-header">
                <span>外爾節點動量間距 k_0:</span>
                <span class="value">{{ state.weylNodeSeparationK0.toFixed(2) }} nm⁻¹</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                :value="state.weylNodeSeparationK0"
                @input="onK0Change"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="ctrl-group actions">
            <button class="action-btn pulse" @click="triggerPulse">
              ⚡ 切換邏輯態脈衝
            </button>
            <button class="action-btn reset" @click="resetDefaults">
              🔄 恢復預設參數
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">網絡整流效率 η_net</span>
            <span class="stat-value text-indigo">{{ state.networkDiodeEfficiencyPercent.toFixed(1) }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">費米弧界面穿透率</span>
            <span class="stat-value text-cyan">{{ (state.fermiArcTransparency * 100).toFixed(1) }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">多端點超導結數</span>
            <span class="stat-value text-purple">4 端點 (6 通道)</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">無耗散整流穩定度</span>
            <span class="stat-value text-emerald">拓撲保護</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  weylSuperconductingDiodeNetworkEngine,
  type WeylDiodeRegime
} from '../engine/weylSuperconductingDiodeNetwork';
import { useUIStore } from '../stores/ui';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref(weylSuperconductingDiodeNetworkEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const terminals = [
  { x: 0, y: -110 },
  { x: 130, y: 0 },
  { x: 0, y: 110 },
  { x: -130, y: 0 }
];

const regimes: { key: WeylDiodeRegime; label: string }[] = [
  { key: 'quiescent-multi-terminal', label: '靜止多端點' },
  { key: 'fermi-arc-supercurrent', label: '費米弧超流' },
  { key: 'programmable-diode-rectification', label: '可編程二極整流' },
  { key: 'non-abelian-circulation-interference', label: '非阿貝爾環流干涉' }
];

const refreshState = () => {
  state.value = weylSuperconductingDiodeNetworkEngine.getState();
};

const getLeadColor = (idx: number) => {
  const colors = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24'];
  return colors[idx % 4];
};

const getMatrixCellColor = (val: number) => {
  if (val === 0) return '#1f2937';
  if (val > 0) {
    const alpha = Math.min(1.0, 0.3 + val * 1.5);
    return `rgba(59, 130, 246, ${alpha})`;
  } else {
    const alpha = Math.min(1.0, 0.3 + Math.abs(val) * 1.5);
    return `rgba(239, 68, 68, ${alpha})`;
  }
};

const setGateMode = (mode: 'AND' | 'OR' | 'XOR') => {
  weylSuperconductingDiodeNetworkEngine.setLogicGateMode(mode);
  refreshState();
  achievements.unlock('weyl_superconducting_diode_network');
};

const setRegime = (regime: WeylDiodeRegime) => {
  weylSuperconductingDiodeNetworkEngine.setRegime(regime);
  refreshState();
  achievements.unlock('weyl_superconducting_diode_network');
};

const onMu5Change = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylSuperconductingDiodeNetworkEngine.setChiralChemicalPotential(val);
  refreshState();
  achievements.unlock('weyl_superconducting_diode_network');
};

const onK0Change = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  weylSuperconductingDiodeNetworkEngine.setWeylNodeSeparation(val);
  refreshState();
};

const triggerPulse = () => {
  weylSuperconductingDiodeNetworkEngine.triggerNetworkLogicPulse();
  refreshState();
  achievements.unlock('weyl_superconducting_diode_network');
};

const resetDefaults = () => {
  weylSuperconductingDiodeNetworkEngine.resetDefaults();
  refreshState();
};

const handleClose = () => {
  uiStore.closeOverlay();
};

const loop = () => {
  animTick.value += 0.025;
  weylSuperconductingDiodeNetworkEngine.update(0.016);
  animId = requestAnimationFrame(loop);
};

onMounted(() => {
  animId = requestAnimationFrame(loop);
  achievements.unlock('weyl_superconducting_diode_network');
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: #090e1c;
  border: 1px solid #1e293b;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  background: #050914;
  border-bottom: 1px solid #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap .icon {
  font-size: 28px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 18px;
  color: #818cf8;
  font-weight: 700;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #64748b;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #1e293b;
  color: #f8fafc;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.viz-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1e293b;
}

.weyl-svg {
  width: 100%;
  height: auto;
  display: block;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  background: #050814;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.group-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
}

.btn-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gate-btn {
  background: #1e1b4b;
  border: 1px solid #4338ca;
  color: #c7d2fe;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.gate-btn.active {
  background: #4f46e5;
  color: #ffffff;
  border-color: #818cf8;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

.regime-btn {
  background: #0f172a;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.regime-btn.active {
  background: #312e81;
  color: #e0e7ff;
  border-color: #6366f1;
}

.slider-row {
  margin-bottom: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.slider-header .value {
  color: #818cf8;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #818cf8;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.pulse {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
}

.action-btn.pulse:hover {
  background: linear-gradient(135deg, #4338ca, #3730a3);
}

.action-btn.reset {
  background: #1e293b;
  color: #94a3b8;
}

.action-btn.reset:hover {
  background: #334155;
  color: #f8fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: #050814;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
}

.text-indigo { color: #818cf8; }
.text-cyan { color: #06b6d4; }
.text-purple { color: #c084fc; }
.text-emerald { color: #10b981; }
</style>
