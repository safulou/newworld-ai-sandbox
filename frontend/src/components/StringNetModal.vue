<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-fuchsia-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-fuchsia-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🕸️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-fuchsia-400">全息共形場宇宙弦網冷凝 (CFT String-Net Condensate)</h2>
            <p class="text-xs text-zinc-400">文小剛弦網理論 · 閉弦迴路湧現光子 · 開弦端點湧現電子 · 拓撲基態簡併度與任意子分支融合</p>
          </div>
        </div>
        <button
          @click="close"
          class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <!-- 主體雙欄排版 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1">
        <!-- 左欄：Canvas 畫布與即時狀態 -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Canvas 視訊區 -->
          <div class="relative rounded-xl border border-fuchsia-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-fuchsia-500/30 text-[11px] text-fuchsia-300 font-mono">
              🌀 凝聚相: {{ currentPhaseName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-pink-500/30 text-[11px] text-pink-300 font-mono">
              ⚛️ 任意子型態: {{ currentAnyonType }} (簡併 D={{ state.groundStateDegeneracy }})
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">弦網凝聚純度</span>
              <span class="text-lg font-bold font-mono text-fuchsia-400">{{ state.condensatePurity.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-fuchsia-500 h-full" :style="{ width: `${state.condensatePurity}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">湧現光子通量</span>
              <span class="text-lg font-bold font-mono text-amber-400">✨ {{ Math.round(state.emergentPhotonsFlux) }}</span>
              <span class="text-[10px] text-zinc-500">閉弦集體震盪</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">湧現費米子端點</span>
              <span class="text-lg font-bold font-mono text-cyan-400">⚡ {{ state.emergentFermionsCount }}</span>
              <span class="text-[10px] text-zinc-500">開弦帶電準粒子</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="handleFusion"
              class="px-3 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-fuchsia-950/40"
            >
              🕸️ 分支融合 (Fusion)
            </button>
            <button
              @click="handleExciteFermion"
              :disabled="state.condensatePurity < 15"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              ✂️ 剪切激發費米子對 (+2)
            </button>
            <button
              @click="handlePurify"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              💎 淨化真空基態 (+15%)
            </button>
          </div>

          <!-- 弦密度滑桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">📐 微觀自旋弦分支密度 (Branch Density)</span>
              <span class="font-mono text-fuchsia-400 font-bold">{{ state.stringBranchDensity.toFixed(2) }}x</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              :value="state.stringBranchDensity * 100"
              @input="handleDensityChange"
              class="w-full accent-fuchsia-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <p class="text-[10px] text-zinc-500 mt-1">提升分支密度可顯著增加閉弦迴路重組頻率，加速涌現光子電磁通量產率</p>
          </div>
        </div>

        <!-- 右欄：4 大弦網凝聚態拓撲相選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            拓撲物態相 (Topological Phases)
          </div>

          <div
            v-for="phase in phasesList"
            :key="phase.id"
            @click="handleSetPhase(phase.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentPhase === phase.id
                ? 'border-fuchsia-500 bg-fuchsia-950/30 text-white shadow-lg shadow-fuchsia-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-fuchsia-300">{{ phase.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                簡併度 D={{ phase.degeneracy }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ phase.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>任意子態: {{ phase.anyonType }}</span>
              <span>湧現倍率: {{ phase.emergentSpeed }}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { stringNetCondensate, STRING_NET_PHASES, type StringNetPhase } from '../engine/stringNetCondensate';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentPhase: stringNetCondensate.currentPhase,
  condensatePurity: stringNetCondensate.condensatePurity,
  stringBranchDensity: stringNetCondensate.stringBranchDensity,
  emergentPhotonsFlux: stringNetCondensate.emergentPhotonsFlux,
  emergentFermionsCount: stringNetCondensate.emergentFermionsCount,
  groundStateDegeneracy: stringNetCondensate.groundStateDegeneracy,
  totalFusions: stringNetCondensate.totalFusions,
});

const phasesList = Object.values(STRING_NET_PHASES);
const currentPhaseName = computed(() => STRING_NET_PHASES[state.currentPhase]?.name || '');
const currentAnyonType = computed(() => STRING_NET_PHASES[state.currentPhase]?.anyonType || '');

function syncState() {
  state.currentPhase = stringNetCondensate.currentPhase;
  state.condensatePurity = stringNetCondensate.condensatePurity;
  state.stringBranchDensity = stringNetCondensate.stringBranchDensity;
  state.emergentPhotonsFlux = stringNetCondensate.emergentPhotonsFlux;
  state.emergentFermionsCount = stringNetCondensate.emergentFermionsCount;
  state.groundStateDegeneracy = stringNetCondensate.groundStateDegeneracy;
  state.totalFusions = stringNetCondensate.totalFusions;
}

function handleFusion() {
  stringNetCondensate.triggerBranchFusion();
  syncState();
}

function handleExciteFermion() {
  stringNetCondensate.exciteFermionPair();
  syncState();
}

function handlePurify() {
  stringNetCondensate.purifyGroundState();
  syncState();
}

function handleDensityChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = parseFloat(target.value) / 100;
  stringNetCondensate.setBranchDensity(val);
  syncState();
}

function handleSetPhase(phase: StringNetPhase) {
  stringNetCondensate.setPhase(phase);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 弦網晶格與湧現粒子動畫 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#06020a';
  ctx.fillRect(0, 0, w, h);

  // 1. 繪製六角蜂巢 / 三角分支弦網絡 (Hexagonal / Triangular String-Net Lattice)
  const cols = 8;
  const rows = 4;
  const cellW = w / (cols + 1);
  const cellH = h / (rows + 1);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = `rgba(217, 70, 239, ${0.3 + 0.2 * (state.condensatePurity / 100)})`;

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = (c + 1) * cellW + ((r % 2) * (cellW * 0.5));
      const y = (r + 1) * cellH;

      // 弦網微觀波動震盪 (String fluctuation)
      const wave = Math.sin(time * 3 + c * 0.8 + r * 1.2) * 4 * state.stringBranchDensity;

      // 分支連線到右方與下方節點
      if (c < cols) {
        ctx.beginPath();
        ctx.moveTo(x, y + wave);
        ctx.lineTo(x + cellW * 0.8, y + wave);
        ctx.stroke();
      }
      if (r < rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + wave);
        ctx.lineTo(x + cellW * 0.4, y + cellH + wave);
        ctx.stroke();
      }

      // 節點自旋環
      ctx.beginPath();
      ctx.arc(x, y + wave, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f0abfc';
      ctx.fill();
    }
  }

  // 2. 閉合弦迴路 (Closed Loops - Emergent Photons)
  const loopCount = 4;
  for (let i = 0; i < loopCount; i++) {
    const lx = (w * 0.25) + i * 110 + Math.sin(time * 2 + i) * 20;
    const ly = (h * 0.4) + Math.cos(time * 2.5 + i) * 35;
    const loopR = 18 + Math.sin(time * 4 + i) * 4;

    ctx.beginPath();
    ctx.arc(lx, ly, loopR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 迴路中心光子閃光
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // 3. 開弦端點 (Open Ends - Emergent Fermions)
  const fermionVisuals = Math.min(8, Math.max(2, Math.floor(state.emergentFermionsCount / 10)));
  for (let j = 0; j < fermionVisuals; j++) {
    const fx = (w * 0.15) + (j * 65) % (w * 0.7);
    const fy = h * 0.75 + Math.sin(time * 5 + j) * 15;

    ctx.beginPath();
    ctx.arc(fx, fy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 斷裂弦短尾
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx - 15, fy + 8);
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  animationFrameId = requestAnimationFrame(renderCanvas);
}

onMounted(() => {
  syncState();
  renderCanvas();
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
