<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-red-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-red-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🚀</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-red-400">反物質暗能量湮滅推進矩陣 (Relativistic Annihilation Propulsion)</h2>
            <p class="text-xs text-zinc-400">正反質子微爆 · 勞侖茲因子膨脹 γ · 暗能量負壓斥力噴流 · 0.99c 相對論航行</p>
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
          <div class="relative rounded-xl border border-red-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-red-500/30 text-[11px] text-red-300 font-mono">
              ⚡ 推進模式: {{ currentModeName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
              🌌 航行距離: {{ state.accumulatedLightYears.toFixed(3) }} 光年
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">航行速度 v/c</span>
              <span class="text-lg font-bold font-mono text-red-400">{{ (state.velocityFraction * 100).toFixed(2) }}% c</span>
              <span class="text-[10px] text-zinc-500">勞侖茲 γ: {{ state.lorentzGamma.toFixed(2) }}</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">反物質儲備</span>
              <span class="text-lg font-bold font-mono text-purple-400">{{ state.antimatterReserveMg.toFixed(1) }} mg</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-purple-500 h-full" :style="{ width: `${Math.min(100, state.antimatterReserveMg / 3)}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">當前推力 / 比衝</span>
              <span class="text-lg font-bold font-mono text-amber-400">{{ Math.round(state.currentThrustKN) }} kN</span>
              <span class="text-[10px] text-zinc-500">I_sp: {{ (state.currentIsp / 1e6).toFixed(1) }}M 秒</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="handleBurst"
              :disabled="state.antimatterReserveMg < 1.0"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40"
            >
              💥 觸發湮滅微爆 (-1.2mg)
            </button>
            <button
              @click="handleRestock"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🧪 補給反物質 (+25mg)
            </button>
            <button
              @click="handleRepairNozzle"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🧲 校準磁約束 ({{ state.magneticNozzleIntegrity.toFixed(0) }}%)
            </button>
          </div>

          <!-- 暗能量負壓比例拉桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">🌌 暗能量負壓混合比 (Dark Energy Warp Ratio)</span>
              <span class="font-mono text-purple-400 font-bold">{{ (state.darkEnergyRatio * 100).toFixed(0) }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              :value="state.darkEnergyRatio * 100"
              @input="handleRatioChange"
              class="w-full accent-purple-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <p class="text-[10px] text-zinc-500 mt-1">注入負壓強暗能量泡可減緩磁鏡熱負載，並在飛船前方引導幾何曲率拉伸</p>
          </div>
        </div>

        <!-- 右欄：4 大微爆推進模式選擇與物理說明 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            推進拓撲模式選擇 (Propulsion Regimes)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-red-500 bg-red-950/30 text-white shadow-lg shadow-red-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-red-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                γ x{{ mode.gammaMultiplier }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>基準 I_sp: {{ (mode.ispBase / 1e6).toFixed(1) }}M 秒</span>
              <span>推力乘數: {{ mode.thrustScale }}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { antimatterPropulsion, ANTIMATTER_MODES, type AntimatterMode } from '../engine/antimatterPropulsion';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  velocityFraction: antimatterPropulsion.velocityFraction,
  antimatterReserveMg: antimatterPropulsion.antimatterReserveMg,
  darkEnergyRatio: antimatterPropulsion.darkEnergyRatio,
  magneticNozzleIntegrity: antimatterPropulsion.magneticNozzleIntegrity,
  currentThrustKN: antimatterPropulsion.currentThrustKN,
  accumulatedLightYears: antimatterPropulsion.accumulatedLightYears,
  lorentzGamma: antimatterPropulsion.lorentzGamma,
  currentIsp: antimatterPropulsion.currentIsp,
  currentMode: antimatterPropulsion.currentMode,
});

const modesList = Object.values(ANTIMATTER_MODES);
const currentModeName = computed(() => ANTIMATTER_MODES[state.currentMode]?.name || '');

function syncState() {
  state.velocityFraction = antimatterPropulsion.velocityFraction;
  state.antimatterReserveMg = antimatterPropulsion.antimatterReserveMg;
  state.darkEnergyRatio = antimatterPropulsion.darkEnergyRatio;
  state.magneticNozzleIntegrity = antimatterPropulsion.magneticNozzleIntegrity;
  state.currentThrustKN = antimatterPropulsion.currentThrustKN;
  state.accumulatedLightYears = antimatterPropulsion.accumulatedLightYears;
  state.lorentzGamma = antimatterPropulsion.lorentzGamma;
  state.currentIsp = antimatterPropulsion.currentIsp;
  state.currentMode = antimatterPropulsion.currentMode;
}

function handleBurst() {
  antimatterPropulsion.triggerAnnihilationBurst();
  syncState();
}

function handleRestock() {
  antimatterPropulsion.restockAntimatter(25);
  syncState();
}

function handleRepairNozzle() {
  antimatterPropulsion.repairMagneticNozzle();
  syncState();
}

function handleRatioChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = parseFloat(target.value) / 100;
  antimatterPropulsion.setDarkEnergyRatio(val);
  syncState();
}

function handleSetMode(mode: AntimatterMode) {
  antimatterPropulsion.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 相對論都卜勒噴流動畫 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w * 0.35;
  const cy = h * 0.5;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, w, h);

  // 星流 (Starfield streaking due to relativistic speed)
  const starCount = 45;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  const streakLen = 10 + state.velocityFraction * 60;
  for (let i = 0; i < starCount; i++) {
    const sx = ((i * 37 + time * 200 * state.velocityFraction) % w);
    const sy = (i * 29) % h;
    ctx.lineWidth = 1 + (i % 2);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx - streakLen, sy);
    ctx.stroke();
  }

  // 飛船磁鏡噴口與湮滅中心
  const thrustActive = state.currentThrustKN > 300;
  const exhaustLen = 120 + (state.currentThrustKN / 10);

  // 1. 噴射反物質高能等離子光錐 (Exhaust Cone)
  const grad = ctx.createLinearGradient(cx, cy, cx + exhaustLen, cy);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.2, 'rgba(255, 80, 50, 0.8)');
  grad.addColorStop(0.6, 'rgba(160, 30, 240, 0.5)');
  grad.addColorStop(1, 'rgba(20, 0, 50, 0)');

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + exhaustLen, cy - 35 - Math.sin(time * 8) * 5);
  ctx.lineTo(cx + exhaustLen * 1.1, cy);
  ctx.lineTo(cx + exhaustLen, cy + 35 + Math.sin(time * 8) * 5);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // 2. 磁約束同心環 (Magnetic Nozzle Rings)
  for (let r = 1; r <= 4; r++) {
    const rx = cx + r * 22;
    const ry = 18 + r * 5;
    ctx.beginPath();
    ctx.ellipse(rx, cy, 6, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + 0.3 * Math.sin(time * 4 + r)})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 3. 暗能量負壓斥力波紋 (Dark Energy Warping Front)
  if (state.darkEnergyRatio > 0.05) {
    const warpCount = 3;
    for (let i = 0; i < warpCount; i++) {
      const wx = cx - 40 - ((time * 50 + i * 35) % 90);
      ctx.beginPath();
      ctx.arc(wx, cy, 30 + i * 15, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.strokeStyle = `rgba(168, 85, 247, ${state.darkEnergyRatio * 0.6})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  // 4. 飛船船體線框簡筆 (Ship Hull Silhouette)
  ctx.fillStyle = '#27272a';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 70, cy);
  ctx.lineTo(cx - 30, cy - 14);
  ctx.lineTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.lineTo(cx - 30, cy + 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. 湮滅閃爍核心
  ctx.beginPath();
  ctx.arc(cx, cy, thrustActive ? 9 + Math.random() * 4 : 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

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
