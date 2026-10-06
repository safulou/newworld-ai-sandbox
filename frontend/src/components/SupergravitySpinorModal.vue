<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-violet-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-violet-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌀</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-violet-400">旋量網絡超引力旋轉推進 (Supergravity Spinor Propulsion)</h2>
            <p class="text-xs text-zinc-400">N=8 極大超引力 · 彭羅斯扭量空間 CP³ · 慣性質量消融 (m_i → 0) · 格拉斯曼數無慣性躍遷</p>
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
          <div class="relative rounded-xl border border-violet-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-violet-500/30 text-[11px] text-violet-300 font-mono">
              🌌 幾何空間: {{ currentModeTwistorDim }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              ⚡ 等效慣性: {{ (state.effectiveInertialMassRatio * 100).toFixed(2) }}% ({{ state.effectiveInertialMassRatio < 0.05 ? '無慣性狀態！' : '慣性抑制中' }})
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">慣性質量消除</span>
              <span class="text-lg font-bold font-mono text-violet-400">{{ state.inertiaSuppressionPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-violet-500 h-full" :style="{ width: `${state.inertiaSuppressionPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">扭量通量 / 躍遷</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ Math.round(state.twistorFlux) }} Ψ</span>
              <span class="text-[10px] text-zinc-500">躍遷次數: {{ state.totalSpinorJumps }}</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">引力微子相干度</span>
              <span class="text-lg font-bold font-mono text-amber-400">{{ state.gravitinoCoherence.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-amber-500 h-full" :style="{ width: `${state.gravitinoCoherence}%` }"></div>
              </div>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="handleJump"
              :disabled="state.isJumping || state.gravitinoCoherence < 20"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-violet-950/40"
            >
              🚀 觸發無慣性超引力幾何躍遷
            </button>
            <button
              @click="handleTuneGravitino"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              ✨ 調諧引力微子相干態 (+15%)
            </button>
          </div>

          <!-- 慣性質量消除滑桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">⚖️ 局部慣性質量消融率 (Inertia Suppression Ratio)</span>
              <span class="font-mono text-violet-400 font-bold">{{ state.inertiaSuppressionPercent.toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              :value="state.inertiaSuppressionPercent"
              @input="handleInertiaChange"
              class="w-full accent-violet-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <p class="text-[10px] text-zinc-500 mt-1">消融至 100% 時飛船不再受等效原理束縛，可於光速下完成直角轉向且艦體無剪切過載</p>
          </div>
        </div>

        <!-- 右欄：4 大超引力多重態模式選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            超引力多重態架構 (SUGRA Multiplets)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-violet-500 bg-violet-950/30 text-white shadow-lg shadow-violet-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-violet-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                消融 x{{ mode.inertiaSuppressionMultiplier }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>旋量頻寬: {{ mode.spinorBandwidthTHz }} THz</span>
              <span>扭量流形: {{ mode.twistorDim }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { supergravitySpinor, SUGRA_MODES, type SupergravityMode } from '../engine/supergravitySpinor';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentMode: supergravitySpinor.currentMode,
  inertiaSuppressionPercent: supergravitySpinor.inertiaSuppressionPercent,
  twistorFlux: supergravitySpinor.twistorFlux,
  gravitinoCoherence: supergravitySpinor.gravitinoCoherence,
  spinorAngularVelocityDeg: supergravitySpinor.spinorAngularVelocityDeg,
  totalSpinorJumps: supergravitySpinor.totalSpinorJumps,
  isJumping: supergravitySpinor.isJumping,
  jumpProgress: supergravitySpinor.jumpProgress,
  effectiveInertialMassRatio: supergravitySpinor.effectiveInertialMassRatio,
});

const modesList = Object.values(SUGRA_MODES);
const currentModeTwistorDim = computed(() => SUGRA_MODES[state.currentMode]?.twistorDim || '');

function syncState() {
  state.currentMode = supergravitySpinor.currentMode;
  state.inertiaSuppressionPercent = supergravitySpinor.inertiaSuppressionPercent;
  state.twistorFlux = supergravitySpinor.twistorFlux;
  state.gravitinoCoherence = supergravitySpinor.gravitinoCoherence;
  state.spinorAngularVelocityDeg = supergravitySpinor.spinorAngularVelocityDeg;
  state.totalSpinorJumps = supergravitySpinor.totalSpinorJumps;
  state.isJumping = supergravitySpinor.isJumping;
  state.jumpProgress = supergravitySpinor.jumpProgress;
  state.effectiveInertialMassRatio = supergravitySpinor.effectiveInertialMassRatio;
}

function handleJump() {
  supergravitySpinor.triggerSpinorJump();
  syncState();
}

function handleTuneGravitino() {
  supergravitySpinor.tuneGravitinoCoherence();
  syncState();
}

function handleInertiaChange(e: Event) {
  const target = e.target as HTMLInputElement;
  supergravitySpinor.setInertiaSuppression(parseFloat(target.value));
  syncState();
}

function handleSetMode(mode: SupergravityMode) {
  supergravitySpinor.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 彭羅斯扭量球與旋量箭頭網絡繪製 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#06030c';
  ctx.fillRect(0, 0, w, h);

  // 1. 彭羅斯扭量球立體網格線 (Twistor Sphere)
  const sphereR = 75;
  const rotAngle = (state.spinorAngularVelocityDeg * Math.PI) / 180;

  ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
  ctx.lineWidth = 1.5;

  // 經線與緯線同心圓
  for (let lat = -2; lat <= 2; lat++) {
    const latY = cy + lat * 25;
    const latR = Math.sqrt(Math.max(0, sphereR * sphereR - (lat * 25) * (lat * 25)));
    ctx.beginPath();
    ctx.ellipse(cx, latY, latR, latR * 0.35, rotAngle * 0.1, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. 旋量網絡格拉斯曼箭頭 (Grassmann Spinor Arrows)
  const arrowCount = 8;
  for (let i = 0; i < arrowCount; i++) {
    const aAngle = (i * (Math.PI * 2 / arrowCount)) + time * 1.5;
    const ax = cx + Math.cos(aAngle) * (sphereR + 25);
    const ay = cy + Math.sin(aAngle) * (sphereR * 0.65 + 15);

    ctx.beginPath();
    ctx.arc(ax, ay, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();

    // 向量連線至扭量核心
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ax, ay);
    ctx.strokeStyle = `rgba(192, 132, 252, ${0.2 + 0.2 * Math.sin(time * 4 + i)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 3. 無慣性躍遷波前 (Zero-Inertia Warp Wave)
  if (state.isJumping) {
    const warpR = sphereR * (1 + state.jumpProgress * 1.8);
    ctx.beginPath();
    ctx.arc(cx, cy, warpR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(168, 85, 247, ${1 - state.jumpProgress})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // 4. 超引力核心奇點光暈
  ctx.beginPath();
  ctx.arc(cx, cy, 10 + Math.sin(time * 5) * 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 20;
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
