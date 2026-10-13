<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { weylFermiArcEngine, type WeylRegime } from '../engine/weylFermiArcChiralMagnetic';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => weylFermiArcEngine.getState());

const isOpen = computed(() => uiStore.mode === 'weyl-fermi-arc');

const regimes: Array<{ id: WeylRegime; label: string; desc: string }> = [
  { id: 'chiral-magnetic-effect-current', label: '手性磁效應拓撲淨電流相', desc: '平行電磁場破缺手性守恆建立軸向化學勢差 μ_5，觸發沿磁場無耗散拓撲 CME 巨電流與負縱向磁阻' },
  { id: 'fermi-arc-topological-transport', label: '表面費米弧非局域奇異軌道相', desc: '表面布里淵區連接外爾點之開放費米弧，電子穿透體外爾節點形成跨上下表面奇異非局域量子幾何振盪' },
  { id: 'quantum-anomaly-charge-pumping', label: '平行電磁場量子手性反常激增態', desc: '強電場 E·B 驅動左右手性節點間劇烈軸向電荷泵浦 (dn_5/dt ∝ E·B)，負磁阻呈拋物線暴漲' },
  { id: 'trivial-dirac-gap-closure', label: '對稱性恢復外爾點湮滅平庸態', desc: '外爾節點動量間距靠攏湮滅 (k_0 → 0)，費米弧縮回閉合形成常規平庸狄拉克能隙' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateE(val: number) {
  const diff = val - state.value.appliedParallelElectricEVPerM;
  weylFermiArcEngine.rampParallelElectricField(diff);
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function updateB(val: number) {
  const diff = val - state.value.appliedParallelMagneticBTesla;
  weylFermiArcEngine.sweepParallelMagneticField(diff);
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function updateK0(val: number) {
  const diff = val - state.value.weylNodeSeparationK0InvNm;
  weylFermiArcEngine.adjustWeylNodeSeparation(diff);
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function rampEAction() {
  weylFermiArcEngine.rampParallelElectricField(5.0);
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function sweepBAction() {
  weylFermiArcEngine.sweepParallelMagneticField(1.5);
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function triggerBurstAction() {
  weylFermiArcEngine.triggerChiralAnomalyBurst();
  achievements.unlock('weyl_fermi_arc_chiral_magnetic');
}

function reset() {
  weylFermiArcEngine.resetDefaults();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="weyl-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">⚡</span>
          <div>
            <h2>外爾半金屬費米弧與手性磁效應 (Weyl Fermi Arc & CME)</h2>
            <span class="subtitle">Topological Weyl Nodes, Fermi Arc Surface States, Chiral Anomaly & Negative LMR</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 外爾節點、開放費米弧與 CME 電流 -->
        <div class="svg-container">
          <svg viewBox="0 0 540 300" class="weyl-svg">
            <defs>
              <radialGradient id="nodePlusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <radialGradient id="nodeMinusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="1.0" />
                <stop offset="60%" stop-color="#e11d48" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#020617" stop-opacity="0.0" />
              </radialGradient>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="50%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
            </defs>

            <!-- 儀器底板背景 -->
            <rect x="20" y="15" width="500" height="270" rx="16" fill="#030712" stroke="#f59e0b" stroke-width="1.6" />

            <!-- 左側：3D 外爾半金屬布里淵區與手性單極節點對 -->
            <g transform="translate(145, 150)">
              <!-- 布里淵區框架菱形 -->
              <polygon points="0,-75 80,-30 80,45 0,90 -80,45 -80,-30" fill="rgba(15, 23, 42, 0.7)" stroke="#475569" stroke-width="1.2" stroke-dasharray="3 3" />

              <!-- 正手性外爾節點 W+ (C = +1) -->
              <circle cx="-38" cy="0" r="14" fill="url(#nodePlusGlow)" />
              <circle cx="-38" cy="0" r="4" fill="#fff" />
              <text x="-38" y="-18" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">W+ (C=+1)</text>

              <!-- 負手性外爾節點 W- (C = -1) -->
              <circle cx="38" cy="0" r="14" fill="url(#nodeMinusGlow)" />
              <circle cx="38" cy="0" r="4" fill="#fff" />
              <text x="38" y="-18" text-anchor="middle" fill="#f43f5e" font-size="10" font-weight="bold">W- (C=-1)</text>

              <!-- 表面開放費米弧 (Top Surface Fermi Arc) -->
              <path d="M -38 0 Q 0 -45, 38 0" fill="none" stroke="url(#arcGrad)" stroke-width="3">
                <animate attributeName="stroke-dasharray" values="2 2;6 3;2 2" dur="2s" repeatCount="indefinite" />
              </path>
              <text x="0" y="-32" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="bold">頂表面費米弧</text>

              <!-- 表面開放費米弧 (Bottom Surface Fermi Arc) -->
              <path d="M -38 0 Q 0 45, 38 0" fill="none" stroke="url(#arcGrad)" stroke-width="2.5" stroke-dasharray="4 2" opacity="0.7" />

              <!-- 手性磁效應拓撲電流向量 (J_CME ∥ B) -->
              <g v-if="state.chiralMagneticCurrentDensityMAcm2 > 50" transform="translate(0, 65)">
                <line x1="-30" y1="0" x2="30" y2="0" stroke="#f59e0b" stroke-width="2.5" />
                <polygon points="30,0 22,-4 22,4" fill="#f59e0b" />
                <text x="0" y="16" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="bold">J_CME ∝ μ₅ B</text>
              </g>
            </g>

            <!-- 右側：軸向化學勢與 CME 物理量儀表板 -->
            <g transform="translate(295, 45)">
              <rect x="0" y="0" width="205" height="205" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1" />
              <text x="14" y="24" fill="#fbbf24" font-size="12" font-weight="bold">拓撲手性反常指標</text>
              <line x1="14" y1="32" x2="191" y2="32" stroke="#334155" stroke-width="1" />

              <text x="14" y="55" fill="#94a3b8" font-size="10">軸向手性化學勢 μ₅:</text>
              <text x="14" y="74" fill="#38bdf8" font-size="14" font-weight="bold">{{ state.chiralChemicalPotentialMu5Mev.toFixed(2) }} meV</text>

              <text x="14" y="100" fill="#94a3b8" font-size="10">CME 淨電流密度 J_CME:</text>
              <text x="14" y="119" fill="#f59e0b" font-size="14" font-weight="bold">{{ state.chiralMagneticCurrentDensityMAcm2.toFixed(1) }} mA/cm²</text>

              <text x="14" y="145" fill="#94a3b8" font-size="10">負縱向磁導增益 Δσ/σ₀:</text>
              <text x="14" y="165" fill="#34d399" font-size="14" font-weight="bold">+{{ state.negativeMagnetoresistanceDeltaSigma.toFixed(1) }}% (LMR)</text>

              <text x="14" y="190" fill="#94a3b8" font-size="10">外爾軌道量子振盪: <b>{{ state.quantumOscillationFrequencyTesla.toFixed(1) }} T</b></text>
            </g>

            <!-- 狀態文字標籤 -->
            <g transform="translate(35, 245)">
              <rect x="0" y="0" width="270" height="28" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#f59e0b" stroke-width="1" />
              <text x="12" y="18" fill="#fbbf24" font-size="11" font-weight="bold">
                相態: {{ regimes.find(r => r.id === state.regime)?.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- 物理遙測數據指標 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-label">軸向化學勢 (μ₅)</span>
            <span class="m-val highlight">{{ state.chiralChemicalPotentialMu5Mev.toFixed(2) }} meV</span>
            <span class="m-sub">E·B 泵浦左右手性非對稱</span>
          </div>

          <div class="metric-card">
            <span class="m-label">CME 電流密度 (J)</span>
            <span class="m-val accent">{{ state.chiralMagneticCurrentDensityMAcm2.toFixed(1) }}</span>
            <span class="m-sub">mA/cm² 無耗散拓撲淨電流</span>
          </div>

          <div class="metric-card">
            <span class="m-label">負縱向磁阻增益</span>
            <span class="m-val">+{{ state.negativeMagnetoresistanceDeltaSigma.toFixed(1) }}%</span>
            <span class="m-sub">Δσ ∝ B² 磁導拋物線暴漲</span>
          </div>

          <div class="metric-card">
            <span class="m-label">費米弧長度 (L_arc)</span>
            <span class="m-val">{{ state.fermiArcArcLengthInvNm.toFixed(2) }} nm⁻¹</span>
            <span class="m-sub">表面布里淵區開放費米軌道</span>
          </div>

          <div class="metric-card">
            <span class="m-label">外爾振盪頻率 (F)</span>
            <span class="m-val">{{ state.quantumOscillationFrequencyTesla.toFixed(1) }} T</span>
            <span class="m-sub">跨表面非局域軌道量子幾何</span>
          </div>

          <div class="metric-card">
            <span class="m-label">平行磁場 (B)</span>
            <span class="m-val">{{ state.appliedParallelMagneticBTesla.toFixed(1) }} T</span>
            <span class="m-sub">手性磁效應驅動磁場</span>
          </div>
        </div>

        <!-- 互動控制面板 -->
        <div class="controls-panel">
          <div class="sliders-section">
            <div class="slider-row">
              <label>外加平行電場 E (0.1 ~ 50.0 ×10³ V/m): <b>{{ state.appliedParallelElectricEVPerM.toFixed(1) }}</b></label>
              <input
                type="range"
                min="0.1"
                max="50.0"
                step="0.5"
                :value="state.appliedParallelElectricEVPerM"
                @input="updateE(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>外加平行磁場 B (0.1 ~ 14.0 T): <b>{{ state.appliedParallelMagneticBTesla.toFixed(1) }} T</b></label>
              <input
                type="range"
                min="0.1"
                max="14.0"
                step="0.2"
                :value="state.appliedParallelMagneticBTesla"
                @input="updateB(Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <div class="slider-row">
              <label>外爾節點動量間距 2k₀ (0.1 ~ 2.5 nm⁻¹): <b>{{ state.weylNodeSeparationK0InvNm.toFixed(2) }} nm⁻¹</b></label>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.05"
                :value="state.weylNodeSeparationK0InvNm"
                @input="updateK0(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <div class="actions-section">
            <button class="action-btn primary" @click="rampEAction">
              ⚡ 注入平行電場 (+5 kV/m)
            </button>
            <button class="action-btn cyan" @click="sweepBAction">
              🧲 掃描平行磁場 (+1.5 T)
            </button>
            <button class="action-btn secondary" @click="triggerBurstAction">
              💥 觸發手性反常脈衝 (CME↑)
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

.weyl-card {
  width: 720px;
  max-width: 95vw;
  background: rgba(22, 18, 12, 0.92);
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.25);
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
  color: #fbbf24;
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

.weyl-svg {
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
  border: 1px solid rgba(245, 158, 11, 0.2);
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
  color: #38bdf8;
}

.m-val.accent {
  color: #fbbf24;
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
  color: #fbbf24;
}

.slider-row input[type="range"] {
  accent-color: #f59e0b;
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
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
  color: #fbbf24;
}

.action-btn.primary:hover {
  background: rgba(245, 158, 11, 0.35);
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
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.action-btn.secondary:hover {
  background: rgba(239, 68, 68, 0.35);
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
