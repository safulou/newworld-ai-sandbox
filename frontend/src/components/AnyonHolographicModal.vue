<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔮</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              非阿貝爾任意子全息量子糾錯編碼室
            </h2>
            <p class="text-xs text-indigo-400/80 font-mono">
              Non-Abelian Anyon Holographic Code • 斐波那契任意子 τ × τ = 1 + τ 龐加萊雙曲全息 HaPPY 表面碼
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

      <!-- 4 大全息編碼體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-indigo-950/60 border-indigo-400 shadow-md shadow-indigo-900/40 text-indigo-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-indigo-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-indigo-400/70 mt-2 px-1">
            <span>龐加萊圓盤雙曲五邊形全息張量網絡</span>
            <span>邏輯位元保真度: {{ (state.anyonBraidingFidelity * 100).toFixed(2) }}%</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>拓撲全息量子參數</span>
              <span class="text-indigo-400 font-bold">φ ≈ 1.618 黃金維度</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">邏輯量子位元數 k：</span>
              <span class="font-mono text-indigo-300 font-bold">{{ state.logicalQubitsCount }} Qubits</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">物理張量節點數 n：</span>
              <span class="font-mono text-violet-300 font-bold">{{ state.physicalQubitsCount }} 個</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">邏輯錯誤率 pL：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.logicalErrorRatePercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">編織操作保真度：</span>
              <span class="font-mono text-fuchsia-300 font-bold">{{ (state.anyonBraidingFidelity * 100).toFixed(2) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">AdS 曲率半徑 R：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.adsCurvatureRadius }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計校正症候群：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalSyndromesCorrected }} 次</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">全息糾纏熵通量：</span>
              <span class="font-bold text-indigo-300 font-mono">{{ state.holographicEntropyFlux.toFixed(1) }} EF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.holographicEntropyFlux / 10)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 曲率與代碼距離調節滑桿 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">AdS 曲率半徑 R：</span>
            <span class="font-mono text-indigo-300">{{ state.adsCurvatureRadius }}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.2"
            :value="state.adsCurvatureRadius"
            @input="onRadiusChange"
            class="w-full accent-indigo-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">全息代碼距離 d：</span>
            <span class="font-mono text-violet-300">{{ state.codeDistanceD }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="dVal in [3, 5, 7, 9]"
              :key="dVal"
              @click="onDistanceChange(dVal)"
              :class="[
                'flex-1 py-1 rounded-lg text-xs font-bold border transition',
                state.codeDistanceD === dVal
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              ]"
            >
              d = {{ dVal }}
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerFusion"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition active:scale-95"
          >
            ⚡ 執行斐波那契任意子融合
          </button>
          <button
            @click="triggerSyndrome"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-500/50 text-indigo-300 text-xs font-semibold transition active:scale-95"
          >
            🎯 提取穩定子症候群
          </button>
        </div>

        <button
          @click="toggleAutoCorrect"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-semibold border transition',
            state.autoCorrect
              ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          ]"
        >
          {{ state.autoCorrect ? '🟢 全息自動糾錯開' : '⚪ 全息自動糾錯關' }}
        </button>
      </div>

      <!-- 任意子融合歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 斐波那契任意子融合通道 (Anyon Fusion Channels)</span>
          <span class="text-[10px] text-slate-500">{{ state.fusionHistory.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="f in state.fusionHistory"
            :key="f.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-indigo-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-indigo-400 font-bold">#{{ f.id.slice(-6) }}</span>
              <span :class="f.channel === 'anyon_tau' ? 'text-fuchsia-300 font-bold' : 'text-slate-400'">
                通道: {{ f.channel === 'anyon_tau' ? 'τ (非阿貝爾態)' : '1 (真空相)' }}
              </span>
              <span class="text-amber-300">權重: {{ f.goldenRatioWeight.toFixed(3) }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-emerald-400">邏輯保真度: {{ f.logicalFidelityPercent }}%</span>
              <span class="text-cyan-300">症候群修正: {{ f.syndromeErrorCount }}</span>
            </div>
          </div>
          <div v-if="state.fusionHistory.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未執行任意子融合，請點擊上方按鈕測試斐波那契拓撲通道
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
  anyonHolographicEngine,
  type HolographicCodeRegime,
  type AnyonCodeState
} from '../engine/anyonHolographicCode';

const uiStore = useUIStore();
const state = ref<AnyonCodeState>(anyonHolographicEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let tilePhase = 0;

const regimes: { id: HolographicCodeRegime; name: string; desc: string }[] = [
  { id: 'happy_pentagon_code', name: 'HaPPY 全息表面碼', desc: '雙曲五邊形 AdS3/CFT2' },
  { id: 'fibonacci_braiding', name: '斐波那契編織量子閘', desc: '黃金維度非阿貝爾任意子' },
  { id: 'stabilizer_syndrome', name: '拓撲穩定子校正', desc: '高閾值症候群實時萃取' },
  { id: 'fault_tolerant_memory', name: '容錯量子邏輯記憶', desc: '幾何糾纏保護邏輯 Qubit' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectRegime = (regime: HolographicCodeRegime) => {
  anyonHolographicEngine.setRegime(regime);
  state.value = anyonHolographicEngine.getState();
};

const onRadiusChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  anyonHolographicEngine.setAdSCurvatureRadius(val);
  state.value = anyonHolographicEngine.getState();
};

const onDistanceChange = (d: number) => {
  anyonHolographicEngine.setCodeDistance(d);
  state.value = anyonHolographicEngine.getState();
};

const triggerFusion = () => {
  anyonHolographicEngine.performFibonacciFusion();
  state.value = anyonHolographicEngine.getState();
};

const triggerSyndrome = () => {
  anyonHolographicEngine.extractSyndrome();
  state.value = anyonHolographicEngine.getState();
};

const toggleAutoCorrect = () => {
  anyonHolographicEngine.setAutoCorrect(!state.value.autoCorrect);
  state.value = anyonHolographicEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  tilePhase += 0.02;

  ctx.fillStyle = '#070514';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxR = 120;

  // 1. 龐加萊圓盤外邊界 (Poincaré Disk Boundary / Conformal Infinity)
  ctx.beginPath();
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#818cf8';
  ctx.shadowBlur = 10;
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 2. 雙曲五邊形鋪砌 (Central & Layer 1 Pentagons)
  ctx.save();
  ctx.translate(cx, cy);

  // 中心五邊形
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 + tilePhase;
    const px = Math.cos(angle) * 45;
    const py = Math.sin(angle) * 45;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // 外層 5 個共形五邊形
  for (let j = 0; j < 5; j++) {
    const rot = (j * 2 * Math.PI) / 5 + tilePhase;
    ctx.save();
    ctx.rotate(rot);
    ctx.translate(65, 0);

    ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
    ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const ka = (k * 2 * Math.PI) / 5;
      const kx = Math.cos(ka) * 25;
      const ky = Math.sin(ka) * 25;
      if (k === 0) ctx.moveTo(kx, ky);
      else ctx.lineTo(kx, ky);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // 3. 斐波那契任意子編織交錯點 (Braiding Vertices)
  const phi = 1.618;
  for (let m = 0; m < 5; m++) {
    const ma = (m * 2 * Math.PI) / 5 + tilePhase * phi;
    const vx = Math.cos(ma) * 45;
    const vy = Math.sin(ma) * 45;

    ctx.beginPath();
    ctx.fillStyle = m % 2 === 0 ? '#f43f5e' : '#38bdf8';
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

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
