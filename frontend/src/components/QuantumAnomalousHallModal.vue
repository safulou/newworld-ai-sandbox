<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-emerald-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">💻</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-emerald-400">量子霍爾反常邊緣態超流體晶片 (Quantum Anomalous Hall Microchip)</h2>
            <p class="text-xs text-zinc-400">零外磁場本徵量子霍爾電導 · 鐵磁拓撲絕緣體 · 手性邊緣玻色超流 · 馬約拉納零能模防護</p>
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
          <div class="relative rounded-xl border border-emerald-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              💠 晶片架構: {{ currentArchName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-teal-500/30 text-[11px] text-teal-300 font-mono">
              🛡️ 雜質免疫度: {{ state.defectImmunityPercent }}% (無耗散)
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">拓撲能隙 / 溫度</span>
              <span class="text-lg font-bold font-mono text-emerald-400">{{ state.bandgapMilliEV.toFixed(1) }} meV</span>
              <span class="text-[10px] text-zinc-500">超低溫: {{ state.chipTemperatureMilliKelvin.toFixed(1) }} mK</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">量子電導階數 / 超流</span>
              <span class="text-lg font-bold font-mono text-cyan-400">σ_xy = {{ state.quantumConductanceQuanta }} e²/h</span>
              <span class="text-[10px] text-zinc-500">超流速: {{ state.superfluidVelocityNmPs }} nm/ps</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">拓撲量子運算次數</span>
              <span class="text-lg font-bold font-mono text-teal-400">⚡ {{ state.qubitOperationsCount }}</span>
              <span class="text-[10px] text-zinc-500">非阿貝爾編織運算</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="handleCompute"
              :disabled="state.isComputing"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              🚀 執行零耗散拓撲量子運算
            </button>
            <button
              @click="handleCool"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              ❄️ 注入聲子阻尼低溫冷卻 (+3.2 meV)
            </button>
          </div>

          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400 leading-relaxed">
            <span class="font-bold text-zinc-300">💡 物理機制簡介：</span>
            本晶片利用強自旋-軌道耦合與鐵磁相變打破時間反演對稱，電子僅能在樣品邊界朝單一方向行進。即使遇到空位、雜質或邊界裂縫，電子亦無法發生背向散射，從而在室溫/極低溫下達到完全零電阻與零焦耳熱！
          </div>
        </div>

        <!-- 右欄：4 大晶片拓撲架構選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            微晶片拓撲架構 (QAHE Architectures)
          </div>

          <div
            v-for="arch in archList"
            :key="arch.id"
            @click="handleSetArch(arch.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentArchitecture === arch.id
                ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-lg shadow-emerald-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-emerald-300">{{ arch.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                階數 C={{ arch.chernClass }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ arch.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>運算加速: {{ arch.speedScale }}x</span>
              <span>散射免疫: {{ arch.defectImmunity }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { quantumAnomalousHall, QAH_ARCHITECTURES, type QAHArchitecture } from '../engine/quantumAnomalousHall';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentArchitecture: quantumAnomalousHall.currentArchitecture,
  bandgapMilliEV: quantumAnomalousHall.bandgapMilliEV,
  superfluidVelocityNmPs: quantumAnomalousHall.superfluidVelocityNmPs,
  quantumConductanceQuanta: quantumAnomalousHall.quantumConductanceQuanta,
  qubitOperationsCount: quantumAnomalousHall.qubitOperationsCount,
  chipTemperatureMilliKelvin: quantumAnomalousHall.chipTemperatureMilliKelvin,
  isComputing: quantumAnomalousHall.isComputing,
  defectImmunityPercent: quantumAnomalousHall.defectImmunityPercent,
});

const archList = Object.values(QAH_ARCHITECTURES);
const currentArchName = computed(() => QAH_ARCHITECTURES[state.currentArchitecture]?.name || '');

function syncState() {
  state.currentArchitecture = quantumAnomalousHall.currentArchitecture;
  state.bandgapMilliEV = quantumAnomalousHall.bandgapMilliEV;
  state.superfluidVelocityNmPs = quantumAnomalousHall.superfluidVelocityNmPs;
  state.quantumConductanceQuanta = quantumAnomalousHall.quantumConductanceQuanta;
  state.qubitOperationsCount = quantumAnomalousHall.qubitOperationsCount;
  state.chipTemperatureMilliKelvin = quantumAnomalousHall.chipTemperatureMilliKelvin;
  state.isComputing = quantumAnomalousHall.isComputing;
  state.defectImmunityPercent = quantumAnomalousHall.defectImmunityPercent;
}

function handleCompute() {
  quantumAnomalousHall.executeTopologicalCompute();
  syncState();
}

function handleCool() {
  quantumAnomalousHall.coolAndStabilize();
  syncState();
}

function handleSetArch(arch: QAHArchitecture) {
  quantumAnomalousHall.setArchitecture(arch);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 晶片拓撲電路與手性單向超流動畫 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#020906';
  ctx.fillRect(0, 0, w, h);

  // 晶片微電路矩形基底
  const chipX = 40;
  const chipY = 30;
  const chipW = w - 80;
  const chipH = h - 60;

  ctx.fillStyle = '#052e16';
  ctx.fillRect(chipX, chipY, chipW, chipH);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(chipX, chipY, chipW, chipH);

  // 內部絕緣能隙區 (Insulating bulk)
  ctx.fillStyle = '#022c22';
  ctx.fillRect(chipX + 25, chipY + 25, chipW - 50, chipH - 50);

  // 中心量子位元結點 (Majorana junctions)
  const jx = w * 0.5;
  const jy = h * 0.5;
  for (let m = 0; m < 4; m++) {
    const mx = jx + (m - 1.5) * 45;
    ctx.beginPath();
    ctx.arc(mx, jy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.fill();
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 手性邊緣單向超流動粒子 (Chiral Edge Particles - Clockwise perimeter)
  const particleCount = 20;
  const perimeter = 2 * (chipW + chipH);

  for (let i = 0; i < particleCount; i++) {
    const dist = ((time * 120 * (state.superfluidVelocityNmPs / 5) + (i * perimeter / particleCount)) % perimeter);
    let px = 0;
    let py = 0;

    if (dist < chipW) {
      // 頂部向右
      px = chipX + dist;
      py = chipY;
    } else if (dist < chipW + chipH) {
      // 右側向下
      px = chipX + chipW;
      py = chipY + (dist - chipW);
    } else if (dist < 2 * chipW + chipH) {
      // 底部向左
      px = chipX + chipW - (dist - (chipW + chipH));
      py = chipY + chipH;
    } else {
      // 左側向上
      px = chipX;
      py = chipY + chipH - (dist - (2 * chipW + chipH));
    }

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6ee7b7';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

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
