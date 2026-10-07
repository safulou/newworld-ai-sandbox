<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">💫</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">
              相對論性量子資訊穿梭超流波導
            </h2>
            <p class="text-xs text-cyan-400/80 font-mono">
              Relativistic Quantum Teleportation • 烏魯赫加速免疫貝爾基糾纏對 突破因果光錐限制跨視界傳態
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

      <!-- 4 大傳態體制切換 -->
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
            <span>加速林德勒楔形世界線與超流波導聲子通訊</span>
            <span>烏魯赫溫度 TU: {{ state.unruhTemperatureMicroK }} μK</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>相對論性量子參數</span>
              <span class="text-cyan-400 font-bold">貝爾基幾何免疫</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">系統加速度 a：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ state.accelerationG }} g</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">貝爾態糾纏保真度：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.bellFidelityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">量子吞吐量：</span>
              <span class="font-mono text-teal-300 font-bold">{{ state.quantumInformationThroughputQps }} Q/s</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">超流聲子波導流速：</span>
              <span class="font-mono text-sky-300 font-bold">{{ state.waveguidePhononSpeedMs }} m/s</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計隱形傳態：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalTeleportsExecuted }} 次</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">量子傳態通量：</span>
              <span class="font-bold text-cyan-300 font-mono">{{ state.teleportFlux.toFixed(1) }} TF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.teleportFlux / 12)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加速度調節滑桿 -->
      <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="w-full md:w-1/2 flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">相對論加速度 a (g)：</span>
            <span class="font-mono text-cyan-300">{{ state.accelerationG }} g</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="500.0"
            step="1.0"
            :value="state.accelerationG"
            @input="onAccChange"
            class="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerTeleport"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 transition active:scale-95"
          >
            ⚡ 執行跨視界量子隱形傳態
          </button>
          <button
            @click="calibrate"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/50 text-cyan-300 text-xs font-semibold transition active:scale-95"
          >
            🎯 校準超流波導
          </button>
          <button
            @click="toggleAutoTeleport"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-semibold border transition',
              state.autoTeleport
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            ]"
          >
            {{ state.autoTeleport ? '🟢 自動傳態開' : '⚪ 自動傳態關' }}
          </button>
        </div>
      </div>

      <!-- 傳態事件歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 跨視界量子隱形傳態事件佇列 (Teleportation Event Stream)</span>
          <span class="text-[10px] text-slate-500">{{ state.eventHistory.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="e in state.eventHistory"
            :key="e.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-cyan-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 font-bold">#{{ e.id.slice(-6) }}</span>
              <span class="text-slate-300">態: {{ e.qubitState }}</span>
              <span class="text-teal-300">a: {{ e.accelerationG }} g</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-emerald-400">保真度: {{ e.fidelityPercent }}%</span>
              <span class="text-sky-300">烏魯赫噪聲抑制: -{{ e.unruhNoiseSuppressedDb }} dB</span>
            </div>
          </div>
          <div v-if="state.eventHistory.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未執行量子態穿梭，請點擊上方按鈕執行相對論性傳態協定
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';
import {
  relativisticTeleportEngine,
  type RelativisticTeleportRegime,
  type RelativisticTeleportState
} from '../engine/relativisticTeleportation';

const uiStore = useUIStore();
const state = ref<RelativisticTeleportState>(relativisticTeleportEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let wavePhase = 0;

const regimes: { id: RelativisticTeleportRegime; name: string; desc: string }[] = [
  { id: 'unruh_immune_bell', name: '烏魯赫免疫貝爾態', desc: '相干幾何相位熱噪免疫' },
  { id: 'cross_horizon_phonon', name: '聲學視界跨界傳態', desc: 'BEC 拓撲聲子超音速穿梭' },
  { id: 'ctc_gravity_channel', name: '閉合類時曲線通道', desc: '時空引力極限糾纏度' },
  { id: 'lossless_relativistic_qkd', name: '零丟包量子密鑰', desc: '高加速深空安全密鑰中繼' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectRegime = (regime: RelativisticTeleportRegime) => {
  relativisticTeleportEngine.setRegime(regime);
  state.value = relativisticTeleportEngine.getState();
};

const onAccChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  relativisticTeleportEngine.setAccelerationG(val);
  state.value = relativisticTeleportEngine.getState();
};

const triggerTeleport = () => {
  relativisticTeleportEngine.teleportQuantumState();
  state.value = relativisticTeleportEngine.getState();
};

const calibrate = () => {
  relativisticTeleportEngine.calibrateWaveguide();
  state.value = relativisticTeleportEngine.getState();
};

const toggleAutoTeleport = () => {
  relativisticTeleportEngine.setAutoTeleport(!state.value.autoTeleport);
  state.value = relativisticTeleportEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  wavePhase += 0.035;

  ctx.fillStyle = '#031215';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const a = state.value.accelerationG;

  // 1. 閔可夫斯基時空平移光錐 (Light Cone 45° X-shaped)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 130, cy - 130);
  ctx.lineTo(cx + 130, cy + 130);
  ctx.moveTo(cx - 130, cy + 130);
  ctx.lineTo(cx + 130, cy - 130);
  ctx.stroke();

  // 2. 加速雙曲線世界線 (Rindler Hyperbola)
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 10;
  ctx.beginPath();

  const curvature = Math.max(15, 70 - (a / 500) * 45);
  for (let y = -110; y <= 110; y += 4) {
    const x = Math.sqrt(curvature * curvature + y * y);
    if (y === -110) ctx.moveTo(cx + x - curvature, cy + y);
    else ctx.lineTo(cx + x - curvature, cy + y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 3. 糾纏聲子波導粒子穿梭波紋 (Superfluid Waveguide Pulses)
  ctx.fillStyle = '#2dd4bf';
  for (let i = 0; i < 5; i++) {
    const t = ((wavePhase * 30 + i * 25) % 180) - 90;
    const px = cx + Math.cos(wavePhase + i) * 60;
    const py = cy + t;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 中心糾纏樞紐
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#14b8a6';
  ctx.shadowBlur = 15;
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  animId = requestAnimationFrame(drawCanvas);
};

onMounted(() => {
  drawCanvas();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
