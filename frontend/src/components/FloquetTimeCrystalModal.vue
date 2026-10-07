<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⏳</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              非平衡態 Floquet 預熱拓撲時間晶體
            </h2>
            <p class="text-xs text-indigo-400/80 font-mono">
              Floquet Prethermal Time Crystal • 離散時間平移破缺 ⊗ 2T 亞諧波振盪 ⊗ 反熱化預熱高原
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

      <!-- 4 大非平衡動力學體制 -->
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
            <span>自旋鏈頻閃反轉狀態 M(nT) 與 2T 亞諧波對稱破缺軌跡</span>
            <span>驅動頻率: {{ (state.driveFrequencyKhz * 1000).toFixed(0) }} Hz • 壽命: {{ state.prethermalLifetimeSec.toFixed(1) }}s</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-indigo-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>Floquet 拓撲動態監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200">
              對稱破缺 {{ state.timeTranslationSymmetryBreakingPercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>驅動週期 T (ms)</span>
                <span class="text-indigo-300 font-bold">{{ state.drivePeriodMs }} ms</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.drivePeriodMs"
                @input="onPeriodChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>Floquet 能隙 (meV)</span>
                <span class="text-violet-300 font-bold">{{ state.floquetGapMev }} meV</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="40.0"
                step="1.0"
                :value="state.floquetGapMev"
                @input="onGapChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">頻閃磁化強度 M:</span>
              <span :class="state.stroboscopicMagnetization > 0 ? 'text-cyan-300' : 'text-rose-400'" class="font-bold">
                {{ state.stroboscopicMagnetization }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">亞諧波響應倍數:</span>
              <span class="text-amber-300 font-bold">{{ state.subharmonicOrder }}T (半頻響應)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Floquet-Chern 數:</span>
              <span class="text-emerald-300 font-bold">C_F = {{ state.floquetChernIndex }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計驅動週期:</span>
              <span class="text-white font-bold">{{ state.totalDrivenCycles }} 週期</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="triggerFlip"
              class="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-indigo-900/40 text-xs"
            >
              <span>🔄 頻閃自旋反轉</span>
            </button>
            <button
              @click="toggleDriving"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoStroboscopicDriving
                  ? 'border-indigo-500/80 bg-indigo-950/40 text-indigo-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoStroboscopicDriving ? '自動驅動: 開' : '自動驅動: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 頻閃記錄歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">頻閃磁化強度與亞諧波相位採樣</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.stroboscopicHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="r in state.stroboscopicHistory"
            :key="r.cycle"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-slate-400">週期 #{{ r.cycle }}</span>
            <span :class="r.magnetization >= 0 ? 'text-cyan-400' : 'text-rose-400'">
              M = {{ r.magnetization.toFixed(3) }}
            </span>
            <span class="text-indigo-300">Phase: {{ (r.subharmonicPhase / Math.PI).toFixed(1) }}π</span>
            <span class="text-amber-300">E {{ r.prethermalEnergy.toFixed(1) }}</span>
          </div>
          <div v-if="state.stroboscopicHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無頻閃採樣記錄，點擊上方按鈕觸發時間晶體翻轉。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { floquetTimeCrystalEngine, FloquetRegime } from '@/engine/floquetTimeCrystal';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(floquetTimeCrystalEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'subharmonic_2t_time_crystal' as FloquetRegime, name: '2T 亞諧波晶體', desc: '離散時間平移破缺振盪' },
  { id: 'floquet_prethermal_plateau' as FloquetRegime, name: '預熱拓撲高原', desc: '反熱化長壽命量子保護' },
  { id: 'anomalous_floquet_chern_insulator' as FloquetRegime, name: '反常 Floquet 相', desc: '週期驅動邊緣手性態' },
  { id: 'many_body_localized_dtc' as FloquetRegime, name: '多體局域化 DTC', desc: '強紊亂保護時間晶體' },
];

function close() {
  uiStore.setFloquetTimeCrystalOpen(false);
}

function selectRegime(r: FloquetRegime) {
  floquetTimeCrystalEngine.setRegime(r);
  state.value = floquetTimeCrystalEngine.getState();
}

function onPeriodChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetTimeCrystalEngine.setDrivePeriod(val);
  state.value = floquetTimeCrystalEngine.getState();
}

function onGapChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  floquetTimeCrystalEngine.setFloquetGap(val);
  state.value = floquetTimeCrystalEngine.getState();
}

function toggleDriving() {
  floquetTimeCrystalEngine.toggleAutoDriving();
  state.value = floquetTimeCrystalEngine.getState();
}

function triggerFlip() {
  floquetTimeCrystalEngine.triggerCycleFlip();
  state.value = floquetTimeCrystalEngine.getState();
  achievements.unlock('floquet_time_crystal');
}

function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = Date.now() * 0.003;

  ctx.fillStyle = '#050714';
  ctx.fillRect(0, 0, w, h);

  // 1. 上半部：1D 自旋鏈頻閃陣列 (Stroboscopic Spin Chain)
  const spinCount = 18;
  const spinY = 65;
  const spinSpacing = (w - 80) / (spinCount - 1);
  const currentMag = state.value.stroboscopicMagnetization;

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, spinY);
  ctx.lineTo(w - 40, spinY);
  ctx.stroke();

  for (let i = 0; i < spinCount; i++) {
    const sx = 40 + i * spinSpacing;
    const spinSign = currentMag >= 0 ? 1 : -1;
    // 自旋方向微小相位波動
    const angleOffset = Math.sin(time + i * 0.4) * 0.2;
    const arrowLen = 22;

    ctx.save();
    ctx.translate(sx, spinY);
    ctx.rotate(spinSign > 0 ? angleOffset : Math.PI + angleOffset);

    ctx.strokeStyle = spinSign > 0 ? '#38bdf8' : '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, arrowLen * 0.5);
    ctx.lineTo(0, -arrowLen * 0.5);
    ctx.lineTo(-4, -arrowLen * 0.5 + 6);
    ctx.moveTo(0, -arrowLen * 0.5);
    ctx.lineTo(4, -arrowLen * 0.5 + 6);
    ctx.stroke();

    ctx.fillStyle = spinSign > 0 ? '#38bdf8' : '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 2. 下半部：2T 亞諧波磁化振盪曲線圖
  const plotY = 175;
  const plotH = 65;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.fillRect(40, plotY - plotH, w - 80, plotH * 2);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, plotY - plotH, w - 80, plotH * 2);

  // 基準 0 線
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.beginPath();
  ctx.moveTo(40, plotY);
  ctx.lineTo(w - 40, plotY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 驅動信號 (T 週期高頻微波)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 40; x <= w - 40; x++) {
    const phase = ((x - 40) / 20) + time * 4;
    const y = plotY + Math.sin(phase) * (plotH * 0.25);
    if (x === 40) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 時間晶體響應信號 (2T 亞諧波方波/正弦，頻率減半)
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 40; x <= w - 40; x++) {
    const subharmonicPhase = ((x - 40) / 40) + time * 2;
    // 亞諧波振幅與方波化
    const wave = Math.tanh(Math.sin(subharmonicPhase) * 3);
    const y = plotY - wave * (plotH * 0.75);
    if (x === 40) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 標籤註記
  ctx.fillStyle = '#a5b4fc';
  ctx.font = '10px monospace';
  ctx.fillText('M = +1 (自旋上)', 48, plotY - plotH + 14);
  ctx.fillText('M = -1 (自旋下)', 48, plotY + plotH - 6);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('2T 亞諧波對稱破缺響應', w - 170, plotY - plotH + 14);
}

function loop() {
  floquetTimeCrystalEngine.update(0.016);
  state.value = floquetTimeCrystalEngine.getState();
  drawCanvas();
  animId = requestAnimationFrame(loop);
}

onMounted(() => {
  animId = requestAnimationFrame(loop);
});

onUnmounted(() => {
  if (animId !== null) cancelAnimationFrame(animId);
});
</script>
