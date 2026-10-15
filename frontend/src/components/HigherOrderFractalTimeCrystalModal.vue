<template>
  <div class="modal-backdrop" @click.self="handleClose">
    <div class="modal-card">
      <header class="modal-header">
        <div class="title-wrap">
          <span class="icon">❄️</span>
          <div>
            <h2>高階非阿貝爾分形時間晶體反應堆</h2>
            <p class="subtitle">Sierpinski Fractal Geometry, HOTI Corner Mode Locking & Subharmonic 3T Period Multiplication</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="Close">✕</button>
      </header>

      <div class="modal-body">
        <!-- SVG Interactive Visualizer -->
        <div class="viz-container">
          <svg viewBox="0 0 800 360" class="fractal-svg">
            <defs>
              <linearGradient id="fractalBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#020d18" />
                <stop offset="50%" stop-color="#091b2c" />
                <stop offset="100%" stop-color="#04111d" />
              </linearGradient>

              <radialGradient id="cornerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
                <stop offset="50%" stop-color="#0284c7" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
              </radialGradient>

              <filter id="glowFractal">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background -->
            <rect x="0" y="0" width="800" height="360" fill="url(#fractalBg)" rx="8" />

            <!-- Sierpinski Fractal Lattice (Left Panel) -->
            <g transform="translate(60, 40)">
              <rect x="0" y="0" width="360" height="280" fill="#041220" stroke="#0369a1" stroke-width="1.2" rx="6" />
              <text x="180" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">
                謝爾賓斯基分形晶格 (d_f ≈ 1.585)
              </text>

              <!-- Recursive Triangles -->
              <g v-for="(tri, idx) in sierpinskiTriangles" :key="'tri' + idx">
                <polygon
                  :points="`${tri.p1.x},${tri.p1.y} ${tri.p2.x},${tri.p2.y} ${tri.p3.x},${tri.p3.y}`"
                  fill="none"
                  stroke="#0284c7"
                  stroke-width="1.2"
                  opacity="0.65"
                />
              </g>

              <!-- HOTI Corner Modes (Highlighted Pinned Nodes) -->
              <g v-for="(corner, idx) in cornerNodes" :key="'corner' + idx">
                <circle
                  :cx="corner.x"
                  :cy="corner.y"
                  r="8"
                  fill="url(#cornerGlow)"
                  filter="url(#glowFractal)"
                />
                <circle
                  :cx="corner.x"
                  :cy="corner.y"
                  :r="3 + Math.sin(animTick * 4.0 + idx) * 1.5"
                  fill="#7dd3fc"
                />
              </g>
            </g>

            <!-- Right Panel: Subharmonic 3T Time-Correlation & Fourier Spectrum -->
            <g transform="translate(450, 40)">
              <rect x="0" y="0" width="310" height="280" fill="#030f1b" stroke="#0ea5e9" stroke-width="1.2" rx="6" />
              <text x="155" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">
                亞諧波 3T 結晶序與傅立葉頻譜
              </text>

              <!-- 1. Time-Domain Correlation Graph C(t) -->
              <g transform="translate(25, 45)">
                <line x1="0" y1="40" x2="260" y2="40" stroke="#334155" stroke-width="1" />
                <line x1="0" y1="0" x2="0" y2="80" stroke="#334155" stroke-width="1" />
                <text x="265" y="44" fill="#64748b" font-size="9">t (驅動週期)</text>
                <text x="5" y="10" fill="#64748b" font-size="9">⟨σ₀^z(t)σ₀^z(0)⟩</text>

                <!-- Correlation Polyline -->
                <path
                  :d="correlationSvgPath"
                  fill="none"
                  stroke="#38bdf8"
                  stroke-width="2"
                  filter="url(#glowFractal)"
                />
              </g>

              <!-- 2. Fourier Spectrum S(ω) -->
              <g transform="translate(25, 150)">
                <line x1="0" y1="50" x2="260" y2="50" stroke="#334155" stroke-width="1" />
                <line x1="0" y1="0" x2="0" y2="50" stroke="#334155" stroke-width="1" />
                <text x="265" y="54" fill="#64748b" font-size="9">ω/Ω</text>
                <text x="5" y="10" fill="#64748b" font-size="9">S(ω)</text>

                <!-- Fourier Peaks Bars -->
                <g v-for="(peak, idx) in state.fourierPeaks" :key="'peak' + idx">
                  <line
                    :x1="peak.freq * 200"
                    y1="50"
                    :x2="peak.freq * 200"
                    :y2="50 - peak.power * 45"
                    stroke="#06b6d4"
                    stroke-width="3"
                    filter="url(#glowFractal)"
                  />
                  <text
                    :x="peak.freq * 200"
                    :y="42 - peak.power * 45"
                    fill="#a5f3fc"
                    font-size="8"
                    text-anchor="middle"
                  >
                    {{ peak.freq === 1 ? '1' : peak.freq.toFixed(2) }}
                  </text>
                </g>
              </g>

              <!-- Metrics -->
              <g transform="translate(25, 225)">
                <text x="0" y="0" fill="#94a3b8" font-size="10">分形維數 d_f: <strong style="color: #38bdf8">{{ state.fractalDimension.toFixed(4) }}</strong></text>
                <text x="140" y="0" fill="#94a3b8" font-size="10">HOTI 角隅模數: <strong style="color: #38bdf8">{{ state.hotiCornerModesCount }}</strong></text>
                <text x="0" y="20" fill="#94a3b8" font-size="10">晶體剛性: <strong style="color: #34d399">{{ (state.timeCrystalRigidity * 100).toFixed(1) }}%</strong></text>
                <text x="140" y="20" fill="#94a3b8" font-size="10">週期倍增: <strong style="color: #f59e0b">{{ state.subharmonicOrder }}T ({{ state.subharmonicOrder * state.drivePeriodMs }} ms)</strong></text>
                <text x="0" y="38" fill="#94a3b8" font-size="10">MBL 無序勢阱: <strong style="color: #c084fc">{{ state.mblDisorderPotential.toFixed(1) }} meV (防止熱化)</strong></text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Regime Selector -->
        <div class="regime-grid">
          <button
            v-for="r in regimes"
            :key="r.id"
            :class="['regime-btn', { active: state.activeRegime === r.id }]"
            @click="setRegime(r.id)"
          >
            <span class="regime-icon">{{ r.icon }}</span>
            <div class="regime-info">
              <span class="regime-title">{{ r.name }}</span>
              <span class="regime-desc">{{ r.desc }}</span>
            </div>
          </button>
        </div>

        <!-- Sliders & Interactive Controls -->
        <div class="controls-grid">
          <div class="control-card">
            <label>
              <span>分形遞迴階數 (Generation): <strong>第 {{ state.recursionGeneration }} 階</strong></span>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                :value="state.recursionGeneration"
                @input="handleGenChange"
              />
            </label>
          </div>

          <div class="control-card">
            <label>
              <span>MBL 無序勢能 W: <strong>{{ state.mblDisorderPotential.toFixed(1) }} meV</strong></span>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                :value="state.mblDisorderPotential"
                @input="handleDisorderChange"
              />
            </label>
          </div>

          <div class="control-card summary-card">
            <span class="sum-title">自相似時間晶體剛性</span>
            <div class="sum-val">{{ (state.timeCrystalRigidity * 100).toFixed(1) }}%</div>
            <div class="sum-sub">{{ state.subharmonicOrder }}T 亞諧波穩定結晶序</div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="action-row">
          <button class="pulse-btn" @click="triggerPing">
            ❄️ 觸發角隅拓撲鎖定結晶脈衝 (高頻清脆晶體共鳴音)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { higherOrderFractalTimeCrystalEngine, FractalTimeCrystalRegime, FractalTimeCrystalState } from '@/engine/higherOrderFractalTimeCrystal';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const state = ref<FractalTimeCrystalState>(higherOrderFractalTimeCrystalEngine.getState());
const animTick = ref(0);
let animId: number | null = null;

const regimes = [
  { id: 'sierpinski-ground-state' as FractalTimeCrystalRegime, name: '分形晶格基態', icon: '📐', desc: '幾何分形基態, 無驅動' },
  { id: 'hoti-corner-locked' as FractalTimeCrystalRegime, name: '高階拓撲角隅鎖定相', icon: '🔒', desc: 'HOTI 邊界角隅態保護' },
  { id: 'subharmonic-period-3t' as FractalTimeCrystalRegime, name: '亞諧波 3T 週期倍增態', icon: '❄️', desc: '破缺離散時間對稱性' },
  { id: 'self-similar-rigid-crystal' as FractalTimeCrystalRegime, name: '分形自相似剛性時間晶體', icon: '✨', desc: 'MBL 防熱化, 剛性 98.5%' },
];

interface Point { x: number; y: number; }
interface Triangle { p1: Point; p2: Point; p3: Point; }

const sierpinskiTriangles = computed<Triangle[]>(() => {
  const gen = state.value.recursionGeneration;
  const p1 = { x: 180, y: 40 };
  const p2 = { x: 30, y: 260 };
  const p3 = { x: 330, y: 260 };

  const triangles: Triangle[] = [];

  function recurse(a: Point, b: Point, c: Point, depth: number) {
    if (depth === 1) {
      triangles.push({ p1: a, p2: b, p3: c });
      return;
    }
    const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
    const ca = { x: (c.x + a.x) / 2, y: (c.y + a.y) / 2 };

    recurse(a, ab, ca, depth - 1);
    recurse(ab, b, bc, depth - 1);
    recurse(ca, bc, c, depth - 1);
  }

  recurse(p1, p2, p3, gen);
  return triangles;
});

const cornerNodes = computed<Point[]>(() => {
  const gen = state.value.recursionGeneration;
  if (gen === 1) {
    return [
      { x: 180, y: 40 },
      { x: 30, y: 260 },
      { x: 330, y: 260 }
    ];
  }
  // 採集前幾組主角隅點
  const pts: Point[] = [];
  for (const tri of sierpinskiTriangles.value) {
    pts.push(tri.p1);
    pts.push(tri.p2);
    pts.push(tri.p3);
  }
  // 取樣去重
  return pts.slice(0, Math.min(27, Math.pow(3, gen)));
});

const correlationSvgPath = computed(() => {
  const history = state.value.timeCorrelationHistory;
  if (!history || history.length === 0) return '';
  return history.map((val, idx) => {
    const x = (idx / 50) * 260;
    const y = 40 - val * 32;
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
});

function handleClose() {
  uiStore.closeOverlay();
}

function setRegime(regime: FractalTimeCrystalRegime) {
  higherOrderFractalTimeCrystalEngine.setRegime(regime);
  state.value = higherOrderFractalTimeCrystalEngine.getState();
}

function handleGenChange(e: Event) {
  const target = e.target as HTMLInputElement;
  higherOrderFractalTimeCrystalEngine.setRecursionGeneration(parseInt(target.value, 10));
  state.value = higherOrderFractalTimeCrystalEngine.getState();
}

function handleDisorderChange(e: Event) {
  const target = e.target as HTMLInputElement;
  higherOrderFractalTimeCrystalEngine.setMblDisorder(parseFloat(target.value));
  state.value = higherOrderFractalTimeCrystalEngine.getState();
}

function triggerPing() {
  higherOrderFractalTimeCrystalEngine.triggerFractalPulse();
  state.value = higherOrderFractalTimeCrystalEngine.getState();
}

function loop() {
  animTick.value += 0.03;
  higherOrderFractalTimeCrystalEngine.update(0.016);
  state.value = higherOrderFractalTimeCrystalEngine.getState();
  animId = requestAnimationFrame(loop);
}

onMounted(() => {
  animId = requestAnimationFrame(loop);
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
  max-height: 92vh;
  background: #090d16;
  border: 1px solid rgba(14, 165, 233, 0.35);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(14, 165, 233, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e2e8f0;
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #38bdf8;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  color: #94a3b8;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f43f5e;
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
  border: 1px solid rgba(14, 165, 233, 0.2);
}

.fractal-svg {
  width: 100%;
  display: block;
}

.regime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.regime-btn {
  background: #0c1626;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.regime-btn:hover {
  border-color: #38bdf8;
  background: #0f223d;
}

.regime-btn.active {
  border-color: #0284c7;
  background: rgba(2, 132, 199, 0.25);
  box-shadow: 0 0 10px rgba(2, 132, 199, 0.3);
}

.regime-icon {
  font-size: 20px;
}

.regime-info {
  display: flex;
  flex-direction: column;
}

.regime-title {
  font-size: 12px;
  font-weight: bold;
  color: #f8fafc;
}

.regime-desc {
  font-size: 10px;
  color: #94a3b8;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.control-card {
  background: #0f172a;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.control-card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #cbd5e1;
}

.control-card input[type="range"] {
  width: 100%;
  accent-color: #0ea5e9;
}

.summary-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #082f49;
  border-color: #0369a1;
}

.sum-title {
  font-size: 11px;
  color: #7dd3fc;
}

.sum-val {
  font-size: 20px;
  font-weight: bold;
  color: #38bdf8;
  margin: 4px 0;
}

.sum-sub {
  font-size: 10px;
  color: #bae6fd;
}

.action-row {
  display: flex;
  justify-content: center;
}

.pulse-btn {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.pulse-btn:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.5);
  transform: translateY(-1px);
}
</style>
