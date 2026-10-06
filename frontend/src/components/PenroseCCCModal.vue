<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-amber-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⏳</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-amber-400">潘洛斯宇宙循環相干引力波測量儀 (Penrose CCC Detector)</h2>
            <p class="text-xs text-zinc-400">共形循環宇宙學 (CCC) · 前一紀元黑洞碰撞霍金點 · 共形度規重整化 Ω² · 跨紀元因果視界</p>
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
          <div class="relative rounded-xl border border-amber-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
              🌌 觀測體制: {{ currentModeName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-yellow-500/30 text-[11px] text-yellow-300 font-mono">
              ✨ 引力子信噪比 SNR: {{ state.cccGravitonSNR }}
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">當前宇宙紀元</span>
              <span class="text-lg font-bold font-mono text-amber-400">紀元 {{ state.aeonIndex }} (Aeon {{ romanAeon }})</span>
              <span class="text-[10px] text-zinc-500">無限循環連續</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">共形因子 Ω / 曲率</span>
              <span class="text-lg font-bold font-mono text-orange-400">{{ state.conformalFactorOmega.toFixed(2) }}</span>
              <span class="text-[10px] text-zinc-500">平滑度: {{ state.metricCurvatureSmoothness }}</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">捕獲霍金點環數</span>
              <span class="text-lg font-bold font-mono text-yellow-400">⭕ {{ state.hawkingPointsLogged }}</span>
              <span class="text-[10px] text-zinc-500">視界相干: {{ state.horizonIntegrity.toFixed(1) }}%</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="handleScan"
              :disabled="state.isScanning"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40"
            >
              🔭 掃描 CMB 霍金點同溫環
            </button>
            <button
              @click="handleAdvanceAeon"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🔄 跨越共形邊界 (Aeon Leap)
            </button>
          </div>

          <!-- 共形比例因子滑桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">📐 共形度規縮放因子 (Conformal Factor Ω)</span>
              <span class="font-mono text-amber-400 font-bold">{{ state.conformalFactorOmega.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              :value="state.conformalFactorOmega * 100"
              @input="handleOmegaChange"
              class="w-full accent-amber-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <p class="text-[10px] text-zinc-500 mt-1">在末日無質量階段，共形重整化消除光子波長尺度，使終點幾何無縫映照為下一紀元大爆炸</p>
          </div>
        </div>

        <!-- 右欄：4 大跨紀元觀測模式選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            跨宇宙紀元觀測模式 (CCC Regimes)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-amber-500 bg-amber-950/30 text-white shadow-lg shadow-amber-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-amber-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                SNR x{{ mode.snrMultiplier }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>共形靈敏度: {{ mode.omegaSensitivity }}x</span>
              <span>幾何基頻: {{ mode.baseAudioFreq }} Hz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { penroseCCCDetector, CCC_MODES, type CCCMode } from '../engine/penroseCCCDetector';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentMode: penroseCCCDetector.currentMode,
  aeonIndex: penroseCCCDetector.aeonIndex,
  conformalFactorOmega: penroseCCCDetector.conformalFactorOmega,
  hawkingPointsLogged: penroseCCCDetector.hawkingPointsLogged,
  cccGravitonSNR: penroseCCCDetector.cccGravitonSNR,
  horizonIntegrity: penroseCCCDetector.horizonIntegrity,
  isScanning: penroseCCCDetector.isScanning,
  metricCurvatureSmoothness: penroseCCCDetector.metricCurvatureSmoothness,
});

const modesList = Object.values(CCC_MODES);
const currentModeName = computed(() => CCC_MODES[state.currentMode]?.name || '');

const romanAeons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const romanAeon = computed(() => romanAeons[state.aeonIndex - 1] || `${state.aeonIndex}`);

function syncState() {
  state.currentMode = penroseCCCDetector.currentMode;
  state.aeonIndex = penroseCCCDetector.aeonIndex;
  state.conformalFactorOmega = penroseCCCDetector.conformalFactorOmega;
  state.hawkingPointsLogged = penroseCCCDetector.hawkingPointsLogged;
  state.cccGravitonSNR = penroseCCCDetector.cccGravitonSNR;
  state.horizonIntegrity = penroseCCCDetector.horizonIntegrity;
  state.isScanning = penroseCCCDetector.isScanning;
  state.metricCurvatureSmoothness = penroseCCCDetector.metricCurvatureSmoothness;
}

function handleScan() {
  penroseCCCDetector.scanHawkingPoints();
  syncState();
}

function handleAdvanceAeon() {
  penroseCCCDetector.advanceAeon();
  syncState();
}

function handleOmegaChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = parseFloat(target.value) / 100;
  penroseCCCDetector.setConformalOmega(val);
  syncState();
}

function handleSetMode(mode: CCCMode) {
  penroseCCCDetector.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 潘洛斯共形階梯圖與霍金點光環繪製 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#070503';
  ctx.fillRect(0, 0, w, h);

  // 左半部：共形循環階梯圖 (Penrose CCC Crossover Diagram)
  const diagX = 30;
  const diagY = 30;
  const diagW = 200;
  const diagH = 190;

  // 上一個宇宙紀元 (Previous Aeon)
  ctx.fillStyle = 'rgba(180, 83, 9, 0.15)';
  ctx.fillRect(diagX, diagY + diagH * 0.5, diagW, diagH * 0.5);

  // 當前宇宙紀元 (Current Aeon)
  ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
  ctx.fillRect(diagX, diagY, diagW, diagH * 0.5);

  // 共形交界面 (Crossover Horizon I+ = I-)
  ctx.beginPath();
  ctx.moveTo(diagX, diagY + diagH * 0.5);
  ctx.lineTo(diagX + diagW, diagY + diagH * 0.5);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 文字標註
  ctx.fillStyle = '#fde68a';
  ctx.font = '10px monospace';
  ctx.fillText('現紀元 (Aeon N) 大爆炸', diagX + 10, diagY + 25);
  ctx.fillText('共形跨界視界 (I+ ≡ I-)', diagX + 10, diagY + diagH * 0.5 - 6);
  ctx.fillText('前紀元 (Aeon N-1) 蒸發終點', diagX + 10, diagY + diagH - 15);

  // 右半部：CMB 霍金點同心同溫環 (Hawking Points Concentric Rings)
  const cx = 390;
  const cy = h * 0.5;

  // 霍金點同心環
  const ringCount = 5;
  for (let r = 1; r <= ringCount; r++) {
    const radius = r * 18 + Math.sin(time * 2 + r) * 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 + 0.15 * Math.sin(time * 3 + r)})`;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  // 霍金點中心黑洞併合引力波爆發
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // 散射同溫光斑
  for (let p = 0; p < 4; p++) {
    const px = cx + Math.cos(time * 1.2 + p * 1.5) * 60;
    const py = cy + Math.sin(time * 1.2 + p * 1.5) * 50;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
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
