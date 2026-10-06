<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-purple-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⌛</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              量子多體疤痕時間晶體調諧器
            </h2>
            <p class="text-xs text-purple-400/80 font-mono">
              Many-Body Scarred Time Crystal • 突破 ETH 熱化 亞諧波週期倍增 2T/3T 相干振盪
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

      <!-- 4 大多體疤痕驅動拓撲 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="t in topologies"
          :key="t.id"
          @click="selectTopology(t.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.topology === t.id
              ? 'bg-purple-950/60 border-purple-400 shadow-md shadow-purple-900/40 text-purple-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ t.name }}</span>
          <span class="text-[10px] text-purple-400/70">{{ t.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-purple-400/70 mt-2 px-1">
            <span>Rydberg 自旋鏈與希爾伯特李薩如疤痕軌跡</span>
            <span>響應週期: {{ state.subharmonicMultiplier }}T (驅動 {{ state.drivingFrequencyHz }} Hz)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>非熱化疤痕態動力學</span>
              <span class="text-purple-400 font-bold">ETH 熱化免疫</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">亞諧波週期倍增：</span>
              <span class="font-mono text-purple-300 font-bold">{{ state.subharmonicMultiplier }}T Floquet</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">馮諾依曼糾纏熵 SvN：</span>
              <span class="font-mono text-fuchsia-300 font-bold">{{ state.entanglementEntropy }} (超低熵)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">相干復甦保真度：</span>
              <span class="font-mono text-pink-300 font-bold">{{ state.revivalFidelityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">翻轉角 θ：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ (state.flipAngleRad / Math.PI).toFixed(2) }} π</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累積調諧週期：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.totalCyclesTuned }} 輪</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">時間晶體相干通量：</span>
              <span class="font-bold text-purple-300 font-mono">{{ state.timeCrystalFlux.toFixed(1) }} TF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.timeCrystalFlux / 10)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 頻率與翻轉角調節滑桿 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">Floquet 驅動頻率 (Hz)：</span>
            <span class="font-mono text-purple-300">{{ state.drivingFrequencyHz }} Hz</span>
          </div>
          <input
            type="range"
            min="10.0"
            max="120.0"
            step="1.0"
            :value="state.drivingFrequencyHz"
            @input="onFreqChange"
            class="w-full accent-purple-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">自旋翻轉角 θ (rad)：</span>
            <span class="font-mono text-pink-300">{{ (state.flipAngleRad / Math.PI).toFixed(2) }} π</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="4.0"
            step="0.05"
            :value="state.flipAngleRad"
            @input="onAngleChange"
            class="w-full accent-pink-400 cursor-pointer"
          />
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerPulse"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition active:scale-95"
          >
            ⚡ 激發疤痕復甦脈衝
          </button>
          <button
            @click="triggerPxp"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/50 text-purple-300 text-xs font-semibold transition active:scale-95"
          >
            🔔 PXP 躍遷阻斷鐘響
          </button>
        </div>

        <button
          @click="toggleAutoDrive"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-semibold border transition',
            state.autoDrive
              ? 'bg-purple-950/60 border-purple-500 text-purple-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          ]"
        >
          {{ state.autoDrive ? '🟢 Floquet 自動驅動開' : '⚪ Floquet 自動驅動關' }}
        </button>
      </div>

      <!-- 亞諧波振盪紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 亞諧波多體疤痕復甦振盪記錄 (Subharmonic Revival Stream)</span>
          <span class="text-[10px] text-slate-500">{{ state.scarHarmonics.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="h in state.scarHarmonics"
            :key="h.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-purple-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-purple-400 font-bold">#{{ h.id.slice(-6) }}</span>
              <span class="text-slate-400">亞諧波: {{ h.harmonicRatio }}</span>
              <span class="text-fuchsia-300">保真度: {{ h.revivalFidelity }}%</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-pink-300">糾纏熵: {{ h.entanglementEntropy }}</span>
              <span class="text-cyan-400">FFT 峰值: +{{ h.subharmonicPeakDb }} dB</span>
            </div>
          </div>
          <div v-if="state.scarHarmonics.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未激發疤痕復甦脈衝，請點擊上方按鈕激發相干振盪
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
  manyBodyScarredEngine,
  type ScarTopologyType,
  type ScarredCrystalState
} from '../engine/manyBodyScarredTimeCrystal';

const uiStore = useUIStore();
const state = ref<ScarredCrystalState>(manyBodyScarredEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const topologies: { id: ScarTopologyType; name: string; desc: string }[] = [
  { id: 'pxp_rydberg_chain', name: 'PXP 里德伯自旋鏈', desc: '巨自旋封鎖 2T 振盪' },
  { id: 'floquet_subharmonic_dtc', name: 'Floquet 離散時間晶體', desc: '時間平移對稱破缺 2T' },
  { id: 'flat_band_scar', name: '拓撲平帶非阿貝爾態', desc: '3T 次諧波特異軌道' },
  { id: 'athermal_rubidium', name: '反常非熱化銣原子陣', desc: '4T 多體疤痕長程相干' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectTopology = (top: ScarTopologyType) => {
  manyBodyScarredEngine.setTopology(top);
  state.value = manyBodyScarredEngine.getState();
};

const onFreqChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  manyBodyScarredEngine.setDrivingFrequency(val);
  state.value = manyBodyScarredEngine.getState();
};

const onAngleChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  manyBodyScarredEngine.setFlipAngle(val);
  state.value = manyBodyScarredEngine.getState();
};

const triggerPulse = () => {
  manyBodyScarredEngine.triggerScarPulse();
  state.value = manyBodyScarredEngine.getState();
};

const triggerPxp = () => {
  manyBodyScarredEngine.triggerPxpRevival();
  state.value = manyBodyScarredEngine.getState();
};

const toggleAutoDrive = () => {
  manyBodyScarredEngine.setAutoDrive(!state.value.autoDrive);
  state.value = manyBodyScarredEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  animPhase += 0.04;

  ctx.fillStyle = '#0f051d';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const multiplier = state.value.subharmonicMultiplier;

  // 1. 繪製頂部 Rydberg 自旋鏈 (10 個交替原子點陣)
  const numAtoms = 12;
  const startX = 40;
  const atomSpacing = (w - 80) / (numAtoms - 1);
  const chainY = 45;

  for (let i = 0; i < numAtoms; i++) {
    const x = startX + i * atomSpacing;
    const spinState = Math.sin(animPhase * (4.0 / multiplier) + i * Math.PI) > 0;
    
    // 鏈結線
    if (i < numAtoms - 1) {
      ctx.strokeStyle = '#3b0764';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, chainY);
      ctx.lineTo(x + atomSpacing, chainY);
      ctx.stroke();
    }

    // 原子結點
    ctx.beginPath();
    ctx.fillStyle = spinState ? '#c084fc' : '#475569';
    ctx.shadowColor = spinState ? '#c084fc' : 'transparent';
    ctx.shadowBlur = spinState ? 8 : 0;
    ctx.arc(x, chainY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 自旋方向指示箭頭
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, chainY + (spinState ? 4 : -4));
    ctx.lineTo(x, chainY + (spinState ? -4 : 4));
    ctx.stroke();
  }

  // 2. 希爾伯特空間李薩如疤痕軌跡 (Lissajous Scar Trajectory)
  ctx.save();
  ctx.translate(cx, cy + 25);
  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#d946ef';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  
  const trajPoints = 180;
  const A = 130;
  const B = 65;
  const aFreq = multiplier;
  const bFreq = 1;
  const deltaPhase = animPhase;

  for (let t = 0; t <= Math.PI * 2; t += (Math.PI * 2) / trajPoints) {
    const px = A * Math.sin(aFreq * t + deltaPhase);
    const py = B * Math.sin(bFreq * t);
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 軌道上當前相干狀態點
  const currX = A * Math.sin(aFreq * animPhase + deltaPhase);
  const currY = B * Math.sin(bFreq * animPhase);
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.arc(currX, currY, 5, 0, Math.PI * 2);
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
