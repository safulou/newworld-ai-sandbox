<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-blue-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-blue-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔭</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-blue-400">費米子暗物質量子壓縮透鏡 (Fermionic Dark Matter Squeezer)</h2>
            <p class="text-xs text-zinc-400">泡利不相容原理 · keV 無菌中微子費米球 · 量子壓縮真空度規 · 暗矮星與暗星體解密</p>
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
          <div class="relative rounded-xl border border-blue-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
              🌌 核心密度: {{ currentCoreDensity }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              🔍 透鏡分辨率: {{ state.lensResolutionPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">費米動量 / 波長</span>
              <span class="text-lg font-bold font-mono text-blue-400">{{ state.fermiMomentumKeV.toFixed(1) }} keV/c</span>
              <span class="text-[10px] text-zinc-500">λ_F: {{ state.fermiWavelengthAngstrom }} Å</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">量子壓縮度 / 噪聲</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.quantumSqueezingDb.toFixed(1) }} dB</span>
              <span class="text-[10px] text-zinc-500">真空正交壓縮</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">泡利簡併壓力 / 暗星</span>
              <span class="text-lg font-bold font-mono text-indigo-400">{{ Math.round(state.pauliPressureMegaPascal) }} MPa</span>
              <span class="text-[10px] text-zinc-500">已解密暗體: {{ state.discoveredDarkBodiesCount }}</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-1 gap-2">
            <button
              @click="handleProbe"
              :disabled="state.isProbing"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/40"
            >
              🔭 啟動費米球量子壓縮波前探測 (Probe Dark Star)
            </button>
          </div>

          <!-- 量子壓縮度滑桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">🎛️ 量子引力透鏡壓縮度 (Quantum Squeezing)</span>
              <span class="font-mono text-cyan-400 font-bold">{{ state.quantumSqueezingDb.toFixed(1) }} dB</span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              :value="state.quantumSqueezingDb * 10"
              @input="handleSqueezingChange"
              class="w-full accent-cyan-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <p class="text-[10px] text-zinc-500 mt-1">調高壓縮度可大幅壓低正交量子測不準噪聲，揭露隱匿在星系暈深處的微小暗矮星</p>
          </div>
        </div>

        <!-- 右欄：4 大費米暗物質能態選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            費米暗物質能態 (Fermionic States)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-blue-500 bg-blue-950/30 text-white shadow-lg shadow-blue-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-blue-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                半徑 x{{ mode.fermiRadiusScale }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>核心能區: {{ mode.coreDensityRange }}</span>
              <span>壓縮感度: {{ mode.squeezingSensitivity }}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { fermionicDarkMatter, DARK_FERMI_MODES, type DarkFermiMode } from '../engine/fermionicDarkMatter';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentMode: fermionicDarkMatter.currentMode,
  fermiMomentumKeV: fermionicDarkMatter.fermiMomentumKeV,
  quantumSqueezingDb: fermionicDarkMatter.quantumSqueezingDb,
  pauliPressureMegaPascal: fermionicDarkMatter.pauliPressureMegaPascal,
  discoveredDarkBodiesCount: fermionicDarkMatter.discoveredDarkBodiesCount,
  lensResolutionPercent: fermionicDarkMatter.lensResolutionPercent,
  isProbing: fermionicDarkMatter.isProbing,
  fermiWavelengthAngstrom: fermionicDarkMatter.fermiWavelengthAngstrom,
});

const modesList = Object.values(DARK_FERMI_MODES);
const currentCoreDensity = computed(() => DARK_FERMI_MODES[state.currentMode]?.coreDensityRange || '');

function syncState() {
  state.currentMode = fermionicDarkMatter.currentMode;
  state.fermiMomentumKeV = fermionicDarkMatter.fermiMomentumKeV;
  state.quantumSqueezingDb = fermionicDarkMatter.quantumSqueezingDb;
  state.pauliPressureMegaPascal = fermionicDarkMatter.pauliPressureMegaPascal;
  state.discoveredDarkBodiesCount = fermionicDarkMatter.discoveredDarkBodiesCount;
  state.lensResolutionPercent = fermionicDarkMatter.lensResolutionPercent;
  state.isProbing = fermionicDarkMatter.isProbing;
  state.fermiWavelengthAngstrom = fermionicDarkMatter.fermiWavelengthAngstrom;
}

function handleProbe() {
  fermionicDarkMatter.probeFermiSurface();
  syncState();
}

function handleSqueezingChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = parseFloat(target.value) / 10;
  fermionicDarkMatter.setQuantumSqueezing(val);
  syncState();
}

function handleSetMode(mode: DarkFermiMode) {
  fermionicDarkMatter.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 費米球動量空間與量子壓縮透鏡繪製 =================
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
  ctx.fillStyle = '#02050e';
  ctx.fillRect(0, 0, w, h);

  // 1. 泡利排斥力等位能球環 (Pauli Degeneracy Pressure Shells)
  const fermiR = 60 + (state.fermiMomentumKeV / 2);
  for (let s = 1; s <= 4; s++) {
    const sr = (fermiR / 4) * s;
    ctx.beginPath();
    ctx.arc(cx, cy, sr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 + 0.1 * Math.sin(time * 3 + s)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 2. 量子壓縮橢圓變形透鏡環 (Quantum Squeezed Ellipse Ring)
  const squeezeFactor = 1 + (state.quantumSqueezingDb / 30);
  ctx.beginPath();
  ctx.ellipse(cx, cy, fermiR * squeezeFactor, fermiR / squeezeFactor, time * 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 3. 探測到的暗矮星核心 (Dark Dwarf Core Blip)
  const angle = time * 0.8;
  const targetX = cx + Math.cos(angle) * 35;
  const targetY = cy + Math.sin(angle) * 35;

  ctx.beginPath();
  ctx.arc(targetX, targetY, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#60a5fa';
  ctx.shadowColor = '#3b82f6';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // 瞄準十字準星
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(targetX - 12, targetY); ctx.lineTo(targetX + 12, targetY);
  ctx.moveTo(targetX, targetY - 12); ctx.lineTo(targetX, targetY + 12);
  ctx.stroke();

  ctx.fillStyle = '#bfdbfe';
  ctx.font = '10px monospace';
  ctx.fillText('DARK DWARF CORE', targetX + 15, targetY + 4);

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
