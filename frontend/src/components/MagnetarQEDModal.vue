<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../stores/ui';
import { magnetarQEDEngine, type MagnetarRegime } from '../engine/magnetarQEDVacuumBirefringence';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = computed(() => magnetarQEDEngine.getState());

const isOpen = computed(() => uiStore.mode === 'magnetar-qed');

const regimes: Array<{ id: MagnetarRegime; label: string; desc: string }> = [
  { id: 'quiescent-vacuum-birefringence', label: '寧靜期 QED 偏振雙折射態', desc: '超強磁場極化真空，O模與X模產生折射率分裂，X射線光子具備 >80% 高度線性偏振' },
  { id: 'critical-crust-strain', label: '臨界地殼磁應變積累相', desc: '超導通量管張力累積，固態地殼剪切應變逼近斷裂極限 σ_crust → σ_break' },
  { id: 'catastrophic-starquake-flare', label: '災變性地殼星震與巨型耀斑', desc: '地殼脆性破裂釋放 10⁴⁴ - 10⁴⁶ erg 磁重聯能量，爆發瞬態伽瑪射線巨型耀斑' },
  { id: 'alfven-qpo-resonance', label: '相對論阿爾芬波諧振態', desc: '破裂能量注入偶極磁力線，激發 v_A ≈ c 之剪切波駐波，產生準週期振盪 (QPOs)' }
];

function handleClose() {
  uiStore.closeOverlay();
}

function updateBField(val: number) {
  magnetarQEDEngine.setMagneticField(val);
  achievements.unlock('magnetar_qed_vacuum_birefringence');
}

function updateStress(val: number) {
  magnetarQEDEngine.setCrustStress(val);
  achievements.unlock('magnetar_qed_vacuum_birefringence');
}

function updatePhotonEnergy(val: number) {
  magnetarQEDEngine.setPhotonEnergy(val);
  achievements.unlock('magnetar_qed_vacuum_birefringence');
}

function triggerStarquake() {
  magnetarQEDEngine.triggerStarquake();
  achievements.unlock('magnetar_qed_vacuum_birefringence');
}

function cycleRegime() {
  magnetarQEDEngine.cycleRegime();
  achievements.unlock('magnetar_qed_vacuum_birefringence');
}

function reset() {
  magnetarQEDEngine.reset();
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
    <div class="magnetar-card">
      <div class="header">
        <div class="title-group">
          <span class="icon">🧲</span>
          <div>
            <h2>中子星磁星 QED 真空雙折射與星震 (Magnetar QED & Starquake)</h2>
            <span class="subtitle">Euler-Heisenberg Vacuum Birefringence, Crust Rupture & Relativistic Alfvén QPOs</span>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div class="content-body">
        <!-- SVG 物理視覺化儀表板 -->
        <div class="visualizer-container">
          <svg viewBox="0 0 800 320" class="magnetar-svg">
            <defs>
              <radialGradient id="magnetarCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="35%" stop-color="#ff3366" />
                <stop offset="70%" stop-color="#990033" />
                <stop offset="100%" stop-color="#220011" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="flareFlash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="50%" stop-color="#ffaa00" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#ff0044" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- 深空背景 -->
            <rect width="800" height="320" fill="#04060e" />

            <!-- 磁星偶極磁力線環 (Dipole Magnetic Field Lines) -->
            <g transform="translate(400, 160)" stroke="rgba(255, 50, 100, 0.35)" fill="none" stroke-width="1.5">
              <!-- 對稱閉合磁力線 -->
              <path d="M 0 -35 C 160 -180, 220 180, 0 35" stroke-dasharray="6 4" />
              <path d="M 0 -35 C -160 -180, -220 180, 0 35" stroke-dasharray="6 4" />
              <path d="M 0 -35 C 280 -250, 340 250, 0 35" stroke="rgba(255, 100, 150, 0.25)" stroke-dasharray="8 6" />
              <path d="M 0 -35 C -280 -250, -340 250, 0 35" stroke="rgba(255, 100, 150, 0.25)" stroke-dasharray="8 6" />

              <!-- 阿爾芬剪切波駐波振盪波形 (Alfvén Standing Wave Waves) -->
              <path
                d="M 0 -35 Q 120 -80 180 0 T 0 35"
                stroke="#00f3ff"
                stroke-width="2.2"
                fill="none"
              >
                <animate attributeName="stroke-width" values="1.5;3;1.5" dur="1.2s" repeatCount="indefinite" />
              </path>
              <path
                d="M 0 -35 Q -120 -80 -180 0 T 0 35"
                stroke="#00f3ff"
                stroke-width="2.2"
                fill="none"
              >
                <animate attributeName="stroke-width" values="1.5;3;1.5" dur="1.2s" repeatCount="indefinite" />
              </path>

              <!-- 中子星本體 (Neutron Star Sphere Radius ~ 10-12 km) -->
              <circle cx="0" cy="0" r="38" fill="url(#magnetarCoreGlow)" />
              <circle cx="0" cy="0" r="35" fill="#220011" stroke="#ff3366" stroke-width="2" />

              <!-- 地殼破裂震源裂縫 (Starquake Rupture Epicenter Faults) -->
              <g v-if="state.crustStressRatio >= 0.8" stroke="#ffee00" stroke-width="2.5">
                <path d="M -15 10 L -5 22 L 8 18 L 18 28" />
                <path d="M 10 -15 L 22 -8 L 28 -20" />
                <circle cx="-5" cy="22" r="3.5" fill="#ffffff" />
                <circle cx="22" cy="-8" r="3.5" fill="#ffffff" />
              </g>

              <!-- 巨型伽瑪射線耀斑爆發光斑 (Giant Flare Flash) -->
              <circle
                v-if="state.regime === 'catastrophic-starquake-flare'"
                cx="0"
                cy="0"
                r="110"
                fill="url(#flareFlash)"
              >
                <animate attributeName="r" values="70;140;70" dur="0.8s" repeatCount="indefinite" />
              </circle>

              <!-- 磁極光軸 (Magnetic Axis) -->
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 3" />
            </g>

            <!-- 左側：QED 真空雙折射雙光束分離 (O-Mode & X-Mode Birefringence Beam Split) -->
            <g transform="translate(80, 50)">
              <rect x="0" y="0" width="220" height="210" rx="6" fill="rgba(8, 12, 24, 0.85)" stroke="rgba(255, 50, 100, 0.3)" />
              <text x="110" y="24" fill="#ff77aa" font-size="11.5" font-weight="bold" text-anchor="middle">
                QED 真空雙折射 (Δn = {{ state.deltaRefractiveIndex }})
              </text>

              <!-- 入射光束 -->
              <line x1="20" y1="110" x2="70" y2="110" stroke="#ffffff" stroke-width="2" />
              <text x="45" y="100" fill="#aaaaaa" font-size="9" text-anchor="middle">入射 X 射線</text>

              <!-- 真空極化雙折射菱形晶體模擬 -->
              <polygon points="70,70 130,110 70,150" fill="rgba(255, 0, 100, 0.15)" stroke="#ff3366" stroke-width="1.5" />

              <!-- O 模光束 (Ordinary Mode) -->
              <line x1="130" y1="110" x2="200" y2="80" stroke="#00f3ff" stroke-width="2" stroke-dasharray="4 2" />
              <text x="175" y="72" fill="#00f3ff" font-size="9">O 模 (n_⊥)</text>

              <!-- X 模光束 (Extraordinary Mode) -->
              <line x1="130" y1="110" x2="200" y2="140" stroke="#ffdd00" stroke-width="2" />
              <text x="175" y="155" fill="#ffdd00" font-size="9">X 模 (n_∥)</text>

              <text x="110" y="190" fill="#00ffaa" font-size="10.5" font-weight="bold" text-anchor="middle">
                偏振度 Π_L = {{ (state.linearPolarizationDegreePiL * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- 右側：阿爾芬剪切波 QPO 準週期振盪頻譜 (Alfvén QPO Spectrum) -->
            <g transform="translate(560, 50)">
              <rect x="0" y="0" width="200" height="210" rx="6" fill="rgba(8, 12, 24, 0.85)" stroke="rgba(0, 243, 255, 0.3)" />
              <text x="100" y="24" fill="#00f3ff" font-size="11.5" font-weight="bold" text-anchor="middle">
                相對論阿爾芬波 QPO
              </text>

              <!-- QPO 諧振頻率條狀圖 -->
              <g transform="translate(25, 45)">
                <text x="0" y="15" fill="#88aacc" font-size="9">18 Hz (基頻剪切)</text>
                <rect x="0" y="20" :width="state.dominantQpoFrequencyHz === 18 ? 140 : 25" height="8" fill="#00b4d8" />

                <text x="0" y="45" fill="#88aacc" font-size="9">30 Hz (偶極共振)</text>
                <rect x="0" y="50" :width="state.dominantQpoFrequencyHz === 30 ? 140 : 35" height="8" fill="#00b4d8" />

                <text x="0" y="75" fill="#88aacc" font-size="9">92 Hz (主導泛音)</text>
                <rect x="0" y="80" :width="state.dominantQpoFrequencyHz === 92 ? 140 : 50" height="8" fill="#00f3ff" />

                <text x="0" y="105" fill="#88aacc" font-size="9">150 Hz (高階剪切)</text>
                <rect x="0" y="110" :width="state.dominantQpoFrequencyHz === 150 ? 140 : 30" height="8" fill="#ffd000" />

                <text x="0" y="135" fill="#88aacc" font-size="9">620 Hz (核心超導波)</text>
                <rect x="0" y="140" :width="state.dominantQpoFrequencyHz === 620 ? 140 : 20" height="8" fill="#ff3366" />
              </g>
            </g>
          </svg>
        </div>

        <!-- 數值指標矩陣 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="label">表面偶極磁場 B / B_QED</span>
            <span class="val pink">{{ state.bOverBqedRatio }} × B_QED</span>
            <span class="sub">B = {{ state.magneticFieldGauss.toExponential(2) }} G</span>
          </div>

          <div class="metric-card">
            <span class="label">線性偏振度 Π_L</span>
            <span class="val cyan">{{ (state.linearPolarizationDegreePiL * 100).toFixed(1) }}%</span>
            <span class="sub">真空雙折射相位差延遲</span>
          </div>

          <div class="metric-card">
            <span class="label">阿爾芬波速 v_A / c</span>
            <span class="val green">{{ state.alfvenWaveSpeedRatioC }} c</span>
            <span class="sub">主導 QPO = {{ state.dominantQpoFrequencyHz }} Hz</span>
          </div>

          <div class="metric-card">
            <span class="label">星震耀斑能量 E_flare</span>
            <span class="val gold">{{ state.flareEnergyErg.toExponential(2) }} erg</span>
            <span class="sub">累計星震觸發：{{ state.starquakeTriggerCount }} 次</span>
          </div>
        </div>

        <!-- 相態列表 -->
        <div class="regimes-list">
          <div
            v-for="r in regimes"
            :key="r.id"
            class="regime-item"
            :class="{ active: state.regime === r.id }"
          >
            <div class="regime-name">{{ r.label }}</div>
            <div class="regime-desc">{{ r.desc }}</div>
          </div>
        </div>

        <!-- 參數控制面板 -->
        <div class="controls-panel">
          <div class="slider-row">
            <div class="slider-info">
              <span>磁星表面偶極磁場 B (Gauss)</span>
              <span class="mono">{{ state.magneticFieldGauss.toExponential(2) }} G</span>
            </div>
            <input
              type="range"
              min="1e13"
              max="1.5e15"
              step="1e13"
              :value="state.magneticFieldGauss"
              @input="updateBField(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>地殼磁剪切應變比 σ / σ_crit (≥ 1 觸發星震)</span>
              <span class="mono">{{ state.crustStressRatio.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.25"
              step="0.02"
              :value="state.crustStressRatio"
              @input="updateStress(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div class="slider-row">
            <div class="slider-info">
              <span>X 射線光子能量 (keV)</span>
              <span class="mono">{{ state.photonEnergyKev }} keV</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              :value="state.photonEnergyKev"
              @input="updatePhotonEnergy(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>

        <!-- 操作按鈕列 -->
        <div class="actions-row">
          <button class="btn btn-danger" @click="triggerStarquake">
            💥 觸發地殼星震 (Starquake)
          </button>
          <button class="btn btn-secondary" @click="cycleRegime">
            🔄 輪轉相態模式
          </button>
          <button class="btn btn-reset" @click="reset">
            ↺ 重置磁星
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 16, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.magnetar-card {
  background: #090c1a;
  border: 1px solid rgba(255, 50, 100, 0.35);
  box-shadow: 0 0 35px rgba(255, 30, 80, 0.2), inset 0 0 20px rgba(255, 50, 100, 0.05);
  border-radius: 14px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  overflow-y: auto;
  color: #dce5f5;
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 50, 100, 0.25);
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  font-size: 2.2rem;
}

.header h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #ff4d79;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 0.78rem;
  color: #8899aa;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8fa0b5;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.visualizer-container {
  background: #04060e;
  border-radius: 10px;
  border: 1px solid rgba(255, 50, 100, 0.3);
  overflow: hidden;
  margin-bottom: 1.2rem;
}

.magnetar-svg {
  width: 100%;
  height: auto;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.metric-card {
  background: rgba(20, 15, 35, 0.7);
  border: 1px solid rgba(255, 50, 100, 0.2);
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  display: flex;
  flex-direction: column;
}

.metric-card .label {
  font-size: 0.75rem;
  color: #a0a8be;
}

.metric-card .val {
  font-size: 1.25rem;
  font-weight: bold;
  font-family: monospace;
  margin: 0.2rem 0;
}

.metric-card .val.pink { color: #ff4d79; }
.metric-card .val.cyan { color: #00f3ff; }
.metric-card .val.green { color: #00ffaa; }
.metric-card .val.gold { color: #ffd000; }

.metric-card .sub {
  font-size: 0.7rem;
  color: #7b8599;
}

.regimes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.regime-item {
  background: rgba(18, 12, 28, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  transition: all 0.2s;
}

.regime-item.active {
  background: rgba(255, 50, 100, 0.15);
  border-color: #ff4d79;
  box-shadow: 0 0 10px rgba(255, 50, 100, 0.25);
}

.regime-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.2rem;
}

.regime-desc {
  font-size: 0.7rem;
  color: #8c98ad;
  line-height: 1.3;
}

.controls-panel {
  background: rgba(18, 12, 28, 0.6);
  border: 1px solid rgba(255, 50, 100, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.slider-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #b0b8c8;
}

.slider-info .mono {
  font-family: monospace;
  color: #ff4d79;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  accent-color: #ff4d79;
  cursor: pointer;
}

.actions-row {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-danger {
  background: linear-gradient(135deg, #ff0055, #b3003b);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 0, 85, 0.4);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff3377, #d90048);
  box-shadow: 0 0 20px rgba(255, 0, 85, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #dce5f5;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #ff4d79;
}

.btn-reset {
  background: transparent;
  color: #8da4c4;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-reset:hover {
  color: #ff6688;
  border-color: #ff6688;
}

@media (max-width: 650px) {
  .regimes-list {
    grid-template-columns: 1fr;
  }
  .actions-row {
    flex-direction: column;
  }
}
</style>
