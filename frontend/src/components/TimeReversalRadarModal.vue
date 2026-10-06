<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⏰</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-indigo-400">量子糾纏時間鏡像拓撲雷達 (Time-Reversal Radar)</h2>
            <p class="text-xs text-zinc-400">時間反演對稱性 T-Symmetry · 非線性相位共軛鏡 · 逆時序波前自聚焦 · 穿透超材料相位隱身</p>
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
        <!-- 左欄：Canvas 極坐標 PPI 雷達畫布與即時狀態 -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Canvas 視訊區 -->
          <div class="relative rounded-xl border border-indigo-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-indigo-500/30 text-[11px] text-indigo-300 font-mono">
              📡 探測波模: {{ currentModeName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-purple-500/30 text-[11px] text-purple-300 font-mono">
              ⏱️ 逆時聚焦點: {{ state.accumulatedEchoes }}
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">量子相干保真度</span>
              <span class="text-lg font-bold font-mono text-indigo-400">{{ state.coherenceIntegrity.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-indigo-500 h-full" :style="{ width: `${state.coherenceIntegrity}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">相位共軛增益</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.radarGainDb.toFixed(1) }} dB</span>
              <span class="text-[10px] text-zinc-500">穿透因數: {{ currentModePenetration }}x</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">探測目標解密</span>
              <span class="text-lg font-bold font-mono text-emerald-400">
                {{ uncloakedCount }} / {{ state.targets.length }}
              </span>
              <span class="text-[10px] text-zinc-500">已穿透隱形偽裝</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="handlePulse"
              :disabled="state.isPulsing"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/40"
            >
              🌌 釋放時間反演聚焦脈衝
            </button>
            <button
              @click="handleTune"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              ❄️ 注入超低溫量子泵 (+12%)
            </button>
            <button
              @click="handleRefresh"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🔄 重新掃描星區目標
            </button>
          </div>

          <!-- 目標解密狀態列表 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col gap-2">
            <span class="text-xs font-bold text-zinc-400">周遭空間目標相位特徵解析</span>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div
                v-for="target in state.targets"
                :key="target.id"
                class="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 flex flex-col gap-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-zinc-200 truncate">{{ target.name }}</span>
                  <span
                    :class="[
                      'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
                      target.uncloaked ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-400'
                    ]"
                  >
                    {{ target.uncloaked ? '已破隱' : `${target.cloakingPercent}% 隱匿` }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>方位: {{ target.bearingDeg }}°</span>
                  <span>距離: {{ target.distanceAU }} AU</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右欄：4 大時間反演掃描模式選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            時間反演探測體制 (Time-Reversal Regimes)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-lg shadow-indigo-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-indigo-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                穿透 x{{ mode.penetrationFactor }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>回波速度: {{ mode.echoSpeed }}c</span>
              <span>量子基準頻率: {{ mode.baseFreq }} Hz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { timeReversalRadar, TIME_REVERSAL_MODES, type TimeReversalMode } from '../engine/timeReversalRadar';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  currentMode: timeReversalRadar.currentMode,
  coherenceIntegrity: timeReversalRadar.coherenceIntegrity,
  radarGainDb: timeReversalRadar.radarGainDb,
  accumulatedEchoes: timeReversalRadar.accumulatedEchoes,
  isPulsing: timeReversalRadar.isPulsing,
  pulseProgress: timeReversalRadar.pulseProgress,
  sweepPhase: timeReversalRadar.sweepPhase,
  targets: timeReversalRadar.targets,
});

const modesList = Object.values(TIME_REVERSAL_MODES);
const currentModeName = computed(() => TIME_REVERSAL_MODES[state.currentMode]?.name || '');
const currentModePenetration = computed(() => TIME_REVERSAL_MODES[state.currentMode]?.penetrationFactor || 1.0);
const uncloakedCount = computed(() => state.targets.filter(t => t.uncloaked).length);

function syncState() {
  state.currentMode = timeReversalRadar.currentMode;
  state.coherenceIntegrity = timeReversalRadar.coherenceIntegrity;
  state.radarGainDb = timeReversalRadar.radarGainDb;
  state.accumulatedEchoes = timeReversalRadar.accumulatedEchoes;
  state.isPulsing = timeReversalRadar.isPulsing;
  state.pulseProgress = timeReversalRadar.pulseProgress;
  state.sweepPhase = timeReversalRadar.sweepPhase;
  state.targets = timeReversalRadar.targets;
}

function handlePulse() {
  timeReversalRadar.triggerPulse();
  syncState();
}

function handleTune() {
  timeReversalRadar.tuneCoherenceStabilizer();
  syncState();
}

function handleRefresh() {
  timeReversalRadar.refreshTargets();
  syncState();
}

function handleSetMode(mode: TimeReversalMode) {
  timeReversalRadar.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D PPI 雷達畫布與時間反演自聚焦繪製 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const maxR = h * 0.45;

  // 背景黑底
  ctx.fillStyle = '#04040a';
  ctx.fillRect(0, 0, w, h);

  // 1. 同心測距圓環 (Radar Range Rings)
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (maxR / 3) * r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 十字基準線
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.beginPath();
  ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
  ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR);
  ctx.stroke();

  // 2. 旋轉掃描光束 (Sweep Beam)
  const sweepAngle = (state.sweepPhase * Math.PI) / 180;
  const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  sweepGrad.addColorStop(0, 'rgba(129, 140, 248, 0.6)');
  sweepGrad.addColorStop(1, 'rgba(129, 140, 248, 0.05)');

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, maxR, sweepAngle - 0.4, sweepAngle);
  ctx.closePath();
  ctx.fillStyle = sweepGrad;
  ctx.fill();

  // 3. 時間反演逆向收縮聚焦波前 (Self-Focusing Inward Contracting Wave)
  if (state.isPulsing) {
    const inwardR = maxR * (1 - state.pulseProgress);
    ctx.beginPath();
    ctx.arc(cx, cy, inwardR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(192, 132, 252, ${0.8 - state.pulseProgress * 0.4})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // 4. 繪製探測目標 (Radar Target Blips)
  state.targets.forEach((target) => {
    const rad = (target.bearingDeg * Math.PI) / 180;
    const distNorm = Math.min(1.0, target.distanceAU / 2.0);
    const tx = cx + Math.cos(rad) * distNorm * maxR;
    const ty = cy + Math.sin(rad) * distNorm * maxR;

    if (target.uncloaked) {
      // 已破隱：鮮綠十字與文字標註
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx - 9, ty - 9, 18, 18);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '10px monospace';
      ctx.fillText(target.id, tx + 12, ty + 4);
    } else {
      // 隱匿中：暗紫幽靈微弱光暈
      const alpha = 0.2 + (1 - target.cloakingPercent / 100) * 0.4;
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(168, 85, 247, ${alpha + 0.2})`;
      ctx.stroke();
    }
  });

  // 雷達中心點
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

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
