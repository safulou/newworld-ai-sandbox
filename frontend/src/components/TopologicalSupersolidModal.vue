<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">❄️</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">
              拓撲超固體量子渦旋流動反應堆
            </h2>
            <p class="text-xs text-cyan-400/80 font-mono">
              Topological Supersolid Reactor • 空間平移與 U(1) 規範雙重破缺 ρ(r) ⊗ v_s = ħ/m ∇φ
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition"
          title="關閉視窗"
        >
          ✕
        </button>
      </div>

      <!-- 4 大超固體工作體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-900/40 text-cyan-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-cyan-400/70">{{ r.desc }}</span>
        </button>
      </div>

      <!-- 核心視覺化畫布與即時物理數值 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Canvas 2D 視覺化 -->
        <div class="md:col-span-2 bg-slate-950/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center">
          <canvas
            ref="canvasRef"
            width="520"
            height="280"
            class="w-full max-w-[520px] h-[280px] rounded-lg bg-slate-950"
          ></canvas>
          <div class="w-full flex justify-between items-center text-[11px] text-cyan-400/70 mt-2 px-1">
            <span>偶極晶格自組織液滴陣列與量子化渦旋軌跡</span>
            <span>超流比例: {{ state.superfluidFractionPercent.toFixed(1) }}% (慣量比 I/I_c: {{ state.rotationalInertiaFraction.toFixed(3) }})</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-cyan-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>雙重對稱破缺監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200">
              液滴: {{ state.dropletCount }} 顆
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>偶極作用比 ε_dd</span>
                <span class="text-cyan-300 font-bold">{{ state.dipolarInteractionRatio }}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                :value="state.dipolarInteractionRatio"
                @input="onDipolarChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>羅頓能級 Δ_roton</span>
                <span class="text-teal-300 font-bold">{{ state.rotonMinimumEnergyKhz }} kHz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="15.0"
                step="0.1"
                :value="state.rotonMinimumEnergyKhz"
                @input="onRotonChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">量子化渦旋數:</span>
              <span class="text-sky-300 font-bold">{{ state.quantizedVorticesCount }} 個</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">超固態通量:</span>
              <span class="text-cyan-300 font-bold">{{ state.supersolidEnergyFlux.toFixed(1) }} pJ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計成核次數:</span>
              <span class="text-slate-200">{{ state.totalVorticesNucleated }} 次</span>
            </div>
          </div>

          <!-- 操作按鈕列 -->
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-700">
            <button
              @click="nucleateVortex"
              class="w-full py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 rounded-lg font-bold text-white shadow-md shadow-cyan-900/40 transition active:scale-[0.98]"
            >
              🌀 成核穿透量子化渦旋
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="triggerRotonResonance"
                class="py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 text-center transition"
              >
                🌊 羅頓共振激波
              </button>
              <button
                @click="toggleAutoVortex"
                :class="[
                  'py-1.5 rounded-lg text-center font-bold transition',
                  state.autoVortexInjection
                    ? 'bg-teal-900/60 text-teal-300 border border-teal-500/50'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                ]"
              >
                {{ state.autoVortexInjection ? '自動成核: ON' : '自動成核: OFF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 量子渦旋歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
        <h3 class="text-xs font-bold text-cyan-300 flex items-center justify-between">
          <span>昂薩格-費曼量子渦旋透射日誌</span>
          <span class="text-[11px] text-slate-500">最近 20 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          <div
            v-for="entry in state.vortexHistory"
            :key="entry.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/30 text-slate-300"
          >
            <span class="text-cyan-400 font-bold">渦旋核 {{ entry.coreRadiusNm }} nm</span>
            <span class="text-teal-300">環流: {{ entry.circulationQuantum }} h/m</span>
            <span class="text-sky-300">超流份額: {{ (entry.superfluidFraction * 100).toFixed(0) }}%</span>
            <span class="text-slate-400">晶格干涉: {{ entry.latticeInterferencePercent }}%</span>
            <span class="text-[10px] text-slate-500">{{ new Date(entry.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div v-if="state.vortexHistory.length === 0" class="text-center text-slate-600 py-3">
            尚無量子化渦旋成核紀錄，點擊按鈕激發超流渦旋穿透晶陣
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { 
  topologicalSupersolidEngine, 
  SupersolidRegime, 
  TopologicalSupersolidState 
} from '@/engine/topologicalSupersolid';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref<TopologicalSupersolidState>(topologicalSupersolidEngine.getState());

let animId: number | null = null;
let animPhase = 0;

const regimes: { id: SupersolidRegime; name: string; desc: string }[] = [
  { id: 'droplet_crystal_superfluid', name: '偶極液滴晶格', desc: '空間平移與超流共存' },
  { id: 'roton_excitation_condensate', name: '羅頓軟化激波', desc: '色散極小臨界凝聚' },
  { id: 'quantized_vortex_lattice', name: '量子渦旋透射', desc: '阿布里科索夫晶格穿透' },
  { id: 'non_classical_rotational_inertia', name: '非經典轉動慣量', desc: '無阻旋轉慣量反常抑制' }
];

function close() {
  uiStore.closeOverlay();
}

function selectRegime(regime: SupersolidRegime) {
  topologicalSupersolidEngine.setRegime(regime);
  updateState();
}

function onDipolarChange(e: Event) {
  const target = e.target as HTMLInputElement;
  topologicalSupersolidEngine.setDipolarRatio(parseFloat(target.value));
  updateState();
}

function onRotonChange(e: Event) {
  const target = e.target as HTMLInputElement;
  topologicalSupersolidEngine.setRotonMinimumKhz(parseFloat(target.value));
  updateState();
}

function nucleateVortex() {
  topologicalSupersolidEngine.nucleateVortex();
  updateState();
}

function triggerRotonResonance() {
  topologicalSupersolidEngine.triggerRotonResonance();
  updateState();
}

function toggleAutoVortex() {
  topologicalSupersolidEngine.setAutoVortexInjection(!state.value.autoVortexInjection);
  updateState();
}

function updateState() {
  state.value = topologicalSupersolidEngine.getState();
}

function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  animPhase += 0.04;

  const cx = w / 2;
  const cy = h / 2;

  // 1. 背景超流相位等高波紋
  ctx.save();
  for (let r = 20; r < 240; r += 25) {
    const phaseOffset = Math.sin(animPhase + r * 0.05) * 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r + phaseOffset, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 - r * 0.0003})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // 2. 三角/六角偶極液滴晶格 (Dipolar Droplet Array)
  const dropletCount = state.value.dropletCount;
  const ringSteps = [1, 6, 12, 18];
  let dropletsPlaced = 0;

  ctx.save();
  for (let ring = 0; ring < ringSteps.length && dropletsPlaced < dropletCount; ring++) {
    const countInRing = ringSteps[ring];
    const ringRadius = ring * 36;

    for (let i = 0; i < countInRing && dropletsPlaced < dropletCount; i++) {
      const angle = (i / countInRing) * Math.PI * 2 + (ring * 0.3) + animPhase * 0.08;
      const dx = cx + Math.cos(angle) * ringRadius;
      const dy = cy + Math.sin(angle) * ringRadius;

      // 液滴光暈
      const radGrad = ctx.createRadialGradient(dx, dy, 2, dx, dy, 14);
      radGrad.addColorStop(0, 'rgba(34, 211, 238, 0.95)');
      radGrad.addColorStop(0.5, 'rgba(20, 184, 166, 0.6)');
      radGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.beginPath();
      ctx.arc(dx, dy, 14, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.fill();

      // 液滴中心核
      ctx.beginPath();
      ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.fill();

      dropletsPlaced++;
    }
  }
  ctx.restore();

  // 3. 量子化阿布里科索夫渦旋核 (Circling Vortices)
  const vortexCount = Math.min(8, state.value.quantizedVorticesCount);
  ctx.save();
  for (let v = 0; v < vortexCount; v++) {
    const vAngle = animPhase * 0.6 + (v / vortexCount) * Math.PI * 2;
    const vRadius = 65 + Math.sin(animPhase + v) * 18;
    const vx = cx + Math.cos(vAngle) * vRadius;
    const vy = cy + Math.sin(vAngle) * vRadius;

    // 渦旋旋轉尾跡
    ctx.beginPath();
    ctx.arc(vx, vy, 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();

    // 渦旋奇異點中心
    ctx.beginPath();
    ctx.arc(vx, vy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.fill();
  }
  ctx.restore();

  // 4. 左下角非經典慣量儀 (NCRI Indicator)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, h - 50, 150, 36);
  ctx.fillRect(16, h - 50, 150, 36);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '10px monospace';
  ctx.fillText(`NCRI 慣量比: ${state.value.rotationalInertiaFraction.toFixed(3)}`, 24, h - 34);

  // 慣量長條圖
  ctx.fillStyle = '#0e7490';
  ctx.fillRect(24, h - 26, 134, 6);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(24, h - 26, 134 * (1.0 - state.value.rotationalInertiaFraction), 6);
  ctx.restore();
}

function loop() {
  drawCanvas();
  animId = requestAnimationFrame(loop);
}

onMounted(() => {
  loop();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
