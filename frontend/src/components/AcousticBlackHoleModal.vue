<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔊</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              超流真空聲學事件視界發電機
            </h2>
            <p class="text-xs text-emerald-400/80 font-mono">
              Acoustic Black Hole BEC Dynamo • 超音速流體視界 M = v/cs > 1 聲學霍金輻射
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

      <!-- 4 大運作架構切換 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="m in modes"
          :key="m.id"
          @click="selectMode(m.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.mode === m.id
              ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-900/40 text-emerald-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ m.name }}</span>
          <span class="text-[10px] text-emerald-400/70">{{ m.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-emerald-400/70 mt-2 px-1">
            <span>超流凝聚體流線與聲學視界圈 (M > 1)</span>
            <span>流速: {{ state.fluidVelocityMs }} m/s (聲速 {{ state.soundSpeedMs }} m/s)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>聲學視界物理參數</span>
              <span :class="state.machNumber >= 1.0 ? 'text-emerald-400 font-bold' : 'text-amber-400'">
                {{ state.machNumber >= 1.0 ? '⚡ 超音速視界形成' : '⚠️ 亞音速無視界' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">馬赫數 M = v / cs：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.machNumber }} Mach</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">渦旋環量 κ：</span>
              <span class="font-mono text-teal-300 font-bold">{{ state.vortexCirculation }} h/m</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">聲學霍金溫度 TH：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ state.hawkingTemperatureNkT }} nK</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">超輻射能層增益：</span>
              <span class="font-mono text-indigo-300 font-bold">+{{ state.superradianceGainDb }} dB</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">發電機輸出功率：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.acousticDynamoPowerKw }} kW</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計採集聲子數：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalPhononsHarvested }} 對</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">收集熱聲子能量：</span>
              <span class="font-bold text-emerald-300 font-mono">{{ state.harvestedPhononEnergy.toFixed(1) }} pJ</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.harvestedPhononEnergy / 15)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流速與渦旋調節滑桿 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">凝聚體流速比 (Mach)：</span>
            <span class="font-mono text-emerald-300">{{ state.machNumber }} M</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.5"
            step="0.05"
            :value="state.machNumber"
            @input="onMachChange"
            class="w-full accent-emerald-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">克爾渦旋環量 κ (h/m)：</span>
            <span class="font-mono text-teal-300">{{ state.vortexCirculation }} h/m</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="10.0"
            step="0.2"
            :value="state.vortexCirculation"
            @input="onCirculationChange"
            class="w-full accent-teal-400 cursor-pointer"
          />
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerHarvest"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition active:scale-95"
          >
            ⚡ 採集霍金聲子對
          </button>
          <button
            @click="triggerBoom"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition active:scale-95"
          >
            💥 超音速聲爆過渡
          </button>
        </div>

        <button
          @click="toggleAutoHarvest"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-semibold border transition',
            state.autoHarvest
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          ]"
        >
          {{ state.autoHarvest ? '🟢 自動採集開' : '⚪ 自動採集關' }}
        </button>
      </div>

      <!-- 霍金聲子發射佇列歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 聲學霍金輻射熱聲子佇列 (Phonon Emission Stream)</span>
          <span class="text-[10px] text-slate-500">{{ state.phononPairs.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="p in state.phononPairs"
            :key="p.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-emerald-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-emerald-400 font-bold">#{{ p.id.slice(-6) }}</span>
              <span class="text-slate-400">能量: {{ p.energyEv }} eV</span>
              <span class="text-teal-300">頻率: {{ p.frequencyKhz }} kHz</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-cyan-300">糾纏保真度: {{ (p.entanglementFidelity * 100).toFixed(1) }}%</span>
              <span :class="p.escaped ? 'text-emerald-400' : 'text-slate-500'">
                {{ p.escaped ? '✓ 已逃逸' : '✗ 墜入視界' }}
              </span>
            </div>
          </div>
          <div v-if="state.phononPairs.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未捕獲熱聲子對，請啟動超音速並點擊採集按鈕
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
  acousticBlackHoleEngine,
  type AcousticHorizonMode,
  type AcousticDynamoState
} from '../engine/acousticBlackHole';

const uiStore = useUIStore();
const state = ref<AcousticDynamoState>(acousticBlackHoleEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let flowPhase = 0;

const modes: { id: AcousticHorizonMode; name: string; desc: string }[] = [
  { id: 'laval_nozzle', name: '超音速拉瓦爾噴嘴', desc: '漸縮漸擴超流視界' },
  { id: 'vortex_kerr', name: '旋轉渦旋克爾黑洞', desc: '超輻射能層 Ergosurface' },
  { id: 'hawking_converter', name: '霍金輻射熱電轉換', desc: '量子糾纏聲子收集' },
  { id: 'white_hole_dynamo', name: '超流真空白洞反爆', desc: '逆向流體超輻射增強' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectMode = (mode: AcousticHorizonMode) => {
  acousticBlackHoleEngine.setMode(mode);
  state.value = acousticBlackHoleEngine.getState();
};

const onMachChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  acousticBlackHoleEngine.setMachNumber(val);
  state.value = acousticBlackHoleEngine.getState();
};

const onCirculationChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  acousticBlackHoleEngine.setVortexCirculation(val);
  state.value = acousticBlackHoleEngine.getState();
};

const triggerHarvest = () => {
  acousticBlackHoleEngine.harvestHawkingPhonons();
  state.value = acousticBlackHoleEngine.getState();
};

const triggerBoom = () => {
  acousticBlackHoleEngine.triggerSonicBoomTransition();
  state.value = acousticBlackHoleEngine.getState();
};

const toggleAutoHarvest = () => {
  acousticBlackHoleEngine.setAutoHarvest(!state.value.autoHarvest);
  state.value = acousticBlackHoleEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  flowPhase += 0.04;

  ctx.fillStyle = '#02120d';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const M = state.value.machNumber;
  const kappa = state.value.vortexCirculation;

  // 繪製渦旋超流體流線向量場
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.lineWidth = 1;
  for (let r = 25; r < 130; r += 14) {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const angle = a + flowPhase * (kappa * 0.15 + 0.5) * (130 / r);
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 聲學能層 Ergosphere 外界
  if (kappa > 0) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    const ergoRadius = 75 + kappa * 4;
    ctx.arc(cx, cy, ergoRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 聲學事件視界圈 (Horizon, 只有當 M >= 1.0 時顯著成形)
  const horizonRadius = 45 * Math.min(2.5, M);
  ctx.beginPath();
  ctx.strokeStyle = M >= 1.0 ? '#10b981' : '#64748b';
  ctx.lineWidth = M >= 1.0 ? 3 : 1;
  ctx.shadowColor = M >= 1.0 ? '#10b981' : 'transparent';
  ctx.shadowBlur = M >= 1.0 ? 12 : 0;
  ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 中心聲學奇點「啞洞」(Dumb Hole Core)
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.stroke();

  // 霍金聲子對粒子動態 (從視界邊緣向外輻射)
  ctx.fillStyle = '#6ee7b7';
  for (let i = 0; i < 6; i++) {
    const angle = (flowPhase * 1.5 + i * (Math.PI / 3)) % (Math.PI * 2);
    const dist = horizonRadius + ((flowPhase * 30 + i * 20) % 70);
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;

    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  animId = requestAnimationFrame(drawCanvas);
};

onMounted(() => {
  drawCanvas();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
