<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌈</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              宇宙弦重力子彩虹度規探測網
            </h2>
            <p class="text-xs text-cyan-400/80 font-mono">
              Rainbow Metric Graviton Mesh • 普朗克尺度色散修正 ds² = -dt²/f(E)² + dx²/g(E)²
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

      <!-- 4 大彩虹能譜體制切換 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="m in models"
          :key="m.id"
          @click="selectModel(m.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.model === m.id
              ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-900/40 text-cyan-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ m.name }}</span>
          <span class="text-[10px] text-cyan-400/70">{{ m.desc }}</span>
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
            <span>時空晶格彩虹折射率波包</span>
            <span>色散延遲 Δt: {{ state.dispersionDelayPs }} ps</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>彩虹度規物理狀態</span>
              <span class="text-cyan-400">Ep = 1.22 × 10¹⁹ GeV</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">時間度規修正 f(E)：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ state.metricFactorF }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">空間度規修正 g(E)：</span>
              <span class="font-mono text-sky-300 font-bold">{{ state.metricFactorG }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">重力波相速度 vp / c：</span>
              <span class="font-mono text-indigo-300 font-bold">{{ state.phaseVelocityC }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">微觀有效時空曲率：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.effectiveCurvature }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">網格校準進度：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.meshCalibrationLevel.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累積重力子暴：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalBurstsDetected }} 批</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">彩虹能量儲備：</span>
              <span class="font-bold text-cyan-300 font-mono">{{ state.rainbowFlux.toFixed(1) }} RF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.rainbowFlux / 10)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 能量調節滑桿與操作按鈕 -->
      <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="w-full md:w-1/2 flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">探測能量尺度 E / Ep：</span>
            <span class="font-mono text-cyan-300">{{ state.probeEnergyRatio.toFixed(2) }} Ep</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="1.00"
            step="0.01"
            :value="state.probeEnergyRatio"
            @input="onEnergyChange"
            class="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerCapture"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 transition active:scale-95"
          >
            ⚡ 捕獲宇宙弦重力子暴
          </button>
          <button
            @click="calibrate"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/50 text-cyan-300 text-xs font-semibold transition active:scale-95"
          >
            🎯 校準度規網
          </button>
          <button
            @click="toggleAutoCalibrate"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-semibold border transition',
              state.autoCalibrate
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            ]"
          >
            {{ state.autoCalibrate ? '🟢 自動校準開' : '⚪ 自動校準關' }}
          </button>
        </div>
      </div>

      <!-- 捕獲重力子波包歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 最近捕獲重力子波包隊列 (Graviton Burst Packets)</span>
          <span class="text-[10px] text-slate-500">{{ state.detectedPackets.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="pkt in state.detectedPackets"
            :key="pkt.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-cyan-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 font-bold">#{{ pkt.id.slice(-6) }}</span>
              <span class="text-slate-400">E: {{ pkt.energyRatio }} Ep</span>
              <span class="text-sky-300">λ: {{ pkt.wavelengthNm }} nm</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-indigo-300">延遲: {{ pkt.groupDelayPs }} ps</span>
              <span class="text-emerald-400">信噪比: {{ pkt.snr }} dB</span>
            </div>
          </div>
          <div v-if="state.detectedPackets.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未捕獲高能重力子波包，請點擊上方按鈕探測
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
  rainbowGravitonEngine,
  type RainbowModelType,
  type RainbowMeshState
} from '../engine/rainbowGravitonMesh';

const uiStore = useUIStore();
const state = ref<RainbowMeshState>(rainbowGravitonEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let wavePhase = 0;

const models: { id: RainbowModelType; name: string; desc: string }[] = [
  { id: 'planck_dispersion', name: '普朗克修正色散', desc: 'f=1, g=√(1-ηE/Ep)' },
  { id: 'string_scattering', name: '弦論硬散射彩虹', desc: '指數級高能軟化色散' },
  { id: 'cosmic_microlens', name: '宇宙弦重力透鏡', desc: '強曲率度規折射延遲' },
  { id: 'lqg_minimal_length', name: '圈量子引力彩虹', desc: '最小長度不變普朗克網' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectModel = (model: RainbowModelType) => {
  rainbowGravitonEngine.setModel(model);
  state.value = rainbowGravitonEngine.getState();
};

const onEnergyChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  rainbowGravitonEngine.setProbeEnergy(val);
  state.value = rainbowGravitonEngine.getState();
};

const triggerCapture = () => {
  rainbowGravitonEngine.triggerGravitonCapture();
  state.value = rainbowGravitonEngine.getState();
};

const calibrate = () => {
  rainbowGravitonEngine.calibrateMesh();
  state.value = rainbowGravitonEngine.getState();
};

const toggleAutoCalibrate = () => {
  rainbowGravitonEngine.setAutoCalibrate(!state.value.autoCalibrate);
  state.value = rainbowGravitonEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  wavePhase += 0.035;

  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // 繪製背景彩虹度規彎曲晶格 (Grid)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  const gridSize = 24;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const cx = w / 2;
  const cy = h / 2;
  const E = state.value.probeEnergyRatio;

  // 繪製彩虹七彩同心波動環
  const colors = [
    'rgba(239, 68, 68, 0.65)',   // 紅
    'rgba(249, 115, 22, 0.65)',  // 橙
    'rgba(234, 179, 8, 0.65)',   // 黃
    'rgba(34, 197, 94, 0.65)',   // 綠
    'rgba(6, 182, 212, 0.65)',   // 青
    'rgba(59, 130, 246, 0.65)',  // 藍
    'rgba(168, 85, 247, 0.65)'   // 紫
  ];

  for (let i = 0; i < 7; i++) {
    const r = (wavePhase * 25 + i * 22) % (Math.min(w, h) * 0.48);
    ctx.beginPath();
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2 + E * 2;
    // 橢圓因色散而變形
    const radiusX = r * (1.0 + (1.0 - state.value.metricFactorG) * 0.5);
    const radiusY = r * state.value.metricFactorF;
    ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 繪製宇宙弦尖端高能噴發射線 (Cosmic String Cusp)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2; a += 0.2) {
    const rayLen = 50 + Math.sin(a * 4 + wavePhase * 3) * 20 * E;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * rayLen, Math.sin(a) * rayLen);
  }
  ctx.stroke();

  // 中心奇異點
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.arc(0, 0, 6 + E * 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  animId = requestAnimationFrame(drawCanvas);
};

onMounted(() => {
  drawCanvas();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
