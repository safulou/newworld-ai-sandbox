<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚡</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
              極限普朗克常數真空相變臨界諧振腔
            </h2>
            <p class="text-xs text-amber-400/80 font-mono">
              Planck Constant Dynamical Vacuum Cavity • SQUID 動態卡西米爾效應 虛光子激發轉化真實微波光子對
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

      <!-- 4 大共振腔體制切換 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-900/40 text-amber-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-amber-400/70">{{ r.desc }}</span>
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
            <span>SQUID 超導反射鏡光速抖動與腔體微波駐波</span>
            <span>振動頻率: {{ state.mirrorFrequencyGhz }} GHz (光子率 {{ state.photonProductionRateKps }} kps)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>動態量子真空參數</span>
              <span class="text-amber-400 font-bold">DCE 實光子湧現</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">微波光子產生率：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.photonProductionRateKps }} kps</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">有效普朗克作用量 ħeff：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.effectivePlanckScale }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">真空相變臨界度：</span>
              <span class="font-mono text-orange-300 font-bold">{{ state.phaseTransitionCriticalityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">共振腔品質因子 Q：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ (state.cavityQualityFactor / 1000).toFixed(0) }}k</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計產生光子數：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.totalPhotonsHarvested }} 顆</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">萃取真空能量：</span>
              <span class="font-bold text-amber-300 font-mono">{{ state.extractedVacuumEnergyPj.toFixed(1) }} pJ</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.extractedVacuumEnergyPj / 15)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 振動頻率與 Q 值調節滑桿 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">鏡面振動頻率 ωm (GHz)：</span>
            <span class="font-mono text-amber-300">{{ state.mirrorFrequencyGhz }} GHz</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="24.0"
            step="0.2"
            :value="state.mirrorFrequencyGhz"
            @input="onFreqChange"
            class="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">腔體品質因子 Q (x10³)：</span>
            <span class="font-mono text-yellow-300">{{ (state.cavityQualityFactor / 1000).toFixed(0) }}k</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            :value="state.cavityQualityFactor"
            @input="onQChange"
            class="w-full accent-yellow-400 cursor-pointer"
          />
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerPhotons"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-900/40 transition active:scale-95"
          >
            ⚡ 激發動態真空微波光子對
          </button>
          <button
            @click="triggerPhase"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-300 text-xs font-semibold transition active:scale-95"
          >
            💥 觸發真空臨界玻色相變
          </button>
        </div>

        <button
          @click="toggleAutoExcite"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-semibold border transition',
            state.autoExcite
              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          ]"
        >
          {{ state.autoExcite ? '🟢 自動激發光子開' : '⚪ 自動激發光子關' }}
        </button>
      </div>

      <!-- 動態光子對產生佇列 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 激發動態微波光子對隊列 (Dynamical Photon Pairs)</span>
          <span class="text-[10px] text-slate-500">{{ state.photonPairs.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="p in state.photonPairs"
            :key="p.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-amber-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold">#{{ p.id.slice(-6) }}</span>
              <span class="text-slate-300">頻率: {{ p.frequencyGhz }} GHz</span>
              <span class="text-orange-300">模數: M{{ p.modeNumber }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-yellow-300">壓縮度: {{ p.quantumSqueezingDb }} dB</span>
              <span class="text-emerald-400">糾纏: ✓ 已量子鎖定</span>
            </div>
          </div>
          <div v-if="state.photonPairs.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未激發真空微波光子對，請啟動 GHz 振動鏡面激發
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
  planckVacuumEngine,
  type PlanckCavityRegime,
  type PlanckCavityState
} from '../engine/planckVacuumCavity';

const uiStore = useUIStore();
const state = ref<PlanckCavityState>(planckVacuumEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let vibePhase = 0;

const regimes: { id: PlanckCavityRegime; name: string; desc: string }[] = [
  { id: 'squid_dynamical_vacuum', name: 'SQUID 動態真空', desc: '超導量子干涉超高頻微波' },
  { id: 'vibrating_mirror', name: '光速抖動反射鏡', desc: '幾何邊界條件週期性調製' },
  { id: 'critical_vacuum_bec', name: '臨界真空玻色相變', desc: '對稱性破缺宏觀凝聚態' },
  { id: 'planck_fluctuation_tap', name: '普朗克量子起伏', desc: '微觀零點場直接能量萃取' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectRegime = (regime: PlanckCavityRegime) => {
  planckVacuumEngine.setRegime(regime);
  state.value = planckVacuumEngine.getState();
};

const onFreqChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  planckVacuumEngine.setMirrorFrequencyGhz(val);
  state.value = planckVacuumEngine.getState();
};

const onQChange = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  planckVacuumEngine.setCavityQualityFactor(val);
  state.value = planckVacuumEngine.getState();
};

const triggerPhotons = () => {
  planckVacuumEngine.generateDynamicalPhotons();
  state.value = planckVacuumEngine.getState();
};

const triggerPhase = () => {
  planckVacuumEngine.triggerPhaseTransition();
  state.value = planckVacuumEngine.getState();
};

const toggleAutoExcite = () => {
  planckVacuumEngine.setAutoExcite(!state.value.autoExcite);
  state.value = planckVacuumEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  vibePhase += (state.value.mirrorFrequencyGhz / 10.0) * 0.15;

  ctx.fillStyle = '#140c03';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const mirrorDist = 180;
  const vibeDelta = Math.sin(vibePhase * 4) * 8;

  // 1. 左側固定反射鏡
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - mirrorDist / 2 - 12, cy - 80, 12, 160);

  // 2. 右側高速抖動 SQUID 超導鏡面 (Vibrating Mirror)
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 12;
  const mirrorX = cx + mirrorDist / 2 + vibeDelta;
  ctx.fillRect(mirrorX, cy - 80, 12, 160);
  ctx.shadowBlur = 0;

  // 3. 腔體內部駐波電場 (Standing Wave)
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const leftX = cx - mirrorDist / 2;
  const currentL = mirrorX - leftX;
  const nodes = 3;

  for (let x = leftX; x <= mirrorX; x += 3) {
    const normX = (x - leftX) / currentL;
    const wave = Math.sin(normX * Math.PI * nodes) * Math.cos(vibePhase * 2) * 45;
    if (x === leftX) ctx.moveTo(x, cy + wave);
    else ctx.lineTo(x, cy + wave);
  }
  ctx.stroke();

  // 4. 動態卡西米爾效應產生之微波光子對 (Photon Pairs)
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 4; i++) {
    const px = cx + ((vibePhase * 20 + i * 35) % (currentL * 0.8)) - (currentL * 0.4);
    const py1 = cy - 20 + Math.sin(vibePhase + i) * 15;
    const py2 = cy + 20 - Math.sin(vibePhase + i) * 15;

    ctx.beginPath();
    ctx.arc(px, py1, 3, 0, Math.PI * 2);
    ctx.arc(px, py2, 3, 0, Math.PI * 2);
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
