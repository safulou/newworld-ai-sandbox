<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📐</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
              拓撲超導高階角態量子中繼陣列
            </h2>
            <p class="text-xs text-amber-400/80 font-mono">
              Higher-Order Corner State Relay • 四極矩拓撲超導 q_xy = e/2 零能馬約拉納非阿貝爾編織
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

      <!-- 4 大拓撲角態架構切換 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="a in architectures"
          :key="a.id"
          @click="selectArchitecture(a.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.architecture === a.id
              ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-900/40 text-amber-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ a.name }}</span>
          <span class="text-[10px] text-amber-400/70">{{ a.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-amber-400/70 mt-2 px-1">
            <span>2D 奈米超導晶格與 4 頂角馬約拉納束縛態 (γ1~γ4)</span>
            <span>局域長度 ξ: {{ state.cornerLocalizationLengthNm }} nm</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>高階拓撲超導參數</span>
              <span class="text-amber-400 font-bold">qxy = e/2 四極矩</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">體超導能隙 Δ：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.bulkGapMev }} meV</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">角態零能偏離：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.majoranaZeroEnergyMev }} μeV</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">非阿貝爾編織保真度：</span>
              <span class="font-mono text-orange-300 font-bold">{{ state.braidingFidelityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">糾纏中繼保真度：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ (state.relayEntanglementFidelity * 100).toFixed(2) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計幾何編織：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalBraidsExecuted }} 次</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">拓撲角態通量：</span>
              <span class="font-bold text-amber-300 font-mono">{{ state.cornerFlux.toFixed(1) }} CF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.cornerFlux / 12)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 四極矩質量滑桿 -->
      <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="w-full md:w-1/2 flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">體四極矩質量參數 m：</span>
            <span class="font-mono text-amber-300">{{ state.quadrupoleMass }}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.05"
            :value="state.quadrupoleMass"
            @input="onMassChange"
            class="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerBraid"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-900/40 transition active:scale-95"
          >
            ⚡ 執行馬約拉納角態編織
          </button>
          <button
            @click="transmitKey"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-300 text-xs font-semibold transition active:scale-95"
          >
            🔒 鎖定糾纏密鑰
          </button>
          <button
            @click="toggleAutoBraid"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-semibold border transition',
              state.autoBraid
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            ]"
          >
            {{ state.autoBraid ? '🟢 自動編織開' : '⚪ 自動編織關' }}
          </button>
        </div>
      </div>

      <!-- 馬約拉納角態編織操作歷史 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 角態馬約拉納非阿貝爾編織紀錄 (Braiding Event Stream)</span>
          <span class="text-[10px] text-slate-500">{{ state.braidHistory.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="b in state.braidHistory"
            :key="b.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-amber-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold">#{{ b.id.slice(-6) }}</span>
              <span class="text-slate-400">頂角: [{{ b.braidedCorners[0] }}, {{ b.braidedCorners[1] }}]</span>
              <span class="text-orange-300">相位: {{ b.topologicalPhaseDeg }}°</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-yellow-300">保真度: {{ b.fidelityPercent }}%</span>
              <span class="text-emerald-400">糾纏位元: {{ b.entangledQubits }} Q</span>
            </div>
          </div>
          <div v-if="state.braidHistory.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未執行馬約拉納角態編織，請點擊上方按鈕執行非阿貝爾拓撲操作
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
  higherOrderTopoEngine,
  type CornerArchType,
  type HOTSCState
} from '../engine/higherOrderTopoSuperconductor';

const uiStore = useUIStore();
const state = ref<HOTSCState>(higherOrderTopoEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let braidPhase = 0;

const architectures: { id: CornerArchType; name: string; desc: string }[] = [
  { id: 'quadrupole_2d_hotsc', name: '二維四極矩拓撲超導', desc: '體能隙邊緣絕緣 4 角束縛態' },
  { id: 'hinge_mode_bismuth', name: '三維三階鉍基鉸鏈態', desc: '奈米晶線 1D 無耗散鉸鏈' },
  { id: 'majorana_braiding_bus', name: '馬約拉納四方編織陣列', desc: '非阿貝爾幾何相位量子閘' },
  { id: 'fault_tolerant_relay', name: '長程容錯量子糾纏中繼', desc: '高保真量子密鑰安全分發' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectArchitecture = (arch: CornerArchType) => {
  higherOrderTopoEngine.setArchitecture(arch);
  state.value = higherOrderTopoEngine.getState();
};

const onMassChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  higherOrderTopoEngine.setQuadrupoleMass(val);
  state.value = higherOrderTopoEngine.getState();
};

const triggerBraid = () => {
  const c1 = Math.floor(Math.random() * 4) + 1;
  let c2 = Math.floor(Math.random() * 4) + 1;
  if (c2 === c1) c2 = (c1 % 4) + 1;
  higherOrderTopoEngine.performMajoranaBraid(c1, c2);
  state.value = higherOrderTopoEngine.getState();
};

const transmitKey = () => {
  higherOrderTopoEngine.transmitEntangledKey();
  state.value = higherOrderTopoEngine.getState();
};

const toggleAutoBraid = () => {
  higherOrderTopoEngine.setAutoBraid(!state.value.autoBraid);
  state.value = higherOrderTopoEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  braidPhase += 0.04;

  ctx.fillStyle = '#140c02';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const boxSize = 140;
  const half = boxSize / 2;

  // 1. 超導正方奈米晶格本體 (Bulk)
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(cx - half, cy - half, boxSize, boxSize);

  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - half, cy - half, boxSize, boxSize);

  // 繪製內部四極子電場箭頭向量
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // 十字線
  ctx.moveTo(cx - half + 20, cy);
  ctx.lineTo(cx + half - 20, cy);
  ctx.moveTo(cx, cy - half + 20);
  ctx.lineTo(cx, cy + half - 20);
  ctx.stroke();

  // 2. 四個頂角馬約拉納零能態亮斑 (Corners 1, 2, 3, 4)
  const corners = [
    { id: 1, x: cx - half, y: cy - half, label: 'γ1' },
    { id: 2, x: cx + half, y: cy - half, label: 'γ2' },
    { id: 3, x: cx + half, y: cy + half, label: 'γ3' },
    { id: 4, x: cx - half, y: cy + half, label: 'γ4' }
  ];

  corners.forEach((c, idx) => {
    const pulse = Math.sin(braidPhase * 3 + idx * (Math.PI / 2)) * 3;
    const r = 8 + pulse;

    ctx.beginPath();
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 標籤
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(c.label, c.x + (c.x > cx ? 8 : -22), c.y + (c.y > cy ? 14 : -8));
  });

  // 3. 非阿貝爾幾何編織動態環 (Braiding Loop)
  ctx.save();
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  const braidRadius = 38;
  const bx = cx + Math.cos(braidPhase * 2) * 20;
  const by = cy + Math.sin(braidPhase * 2) * 20;

  ctx.beginPath();
  ctx.arc(bx, by, braidRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
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
