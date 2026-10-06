<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-teal-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-teal-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🧲</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-teal-400">軸子暗物質暈微波共振腔 (Sikivie Axion Haloscope)</h2>
            <p class="text-xs text-zinc-400">普里馬科夫雙光子轉化 · 超導高 Q 值共振腔 · 微電子伏特 (μeV) 質量調諧 · 量子極限放大</p>
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
          <div class="relative rounded-xl border border-teal-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-teal-500/30 text-[11px] text-teal-300 font-mono">
              📡 探測態: {{ currentModeName }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              ✨ 訊噪比 SNR: {{ state.currentSNR }} ({{ state.currentSNR > 5.0 ? '峰值共振中！' : '底噪監聽中' }})
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">共振頻率 / 軸子質量</span>
              <span class="text-lg font-bold font-mono text-teal-400">{{ state.resonanceFrequencyGhz.toFixed(2) }} GHz</span>
              <span class="text-[10px] text-zinc-500">m_a: {{ state.axionMassMicroEV.toFixed(2) }} μeV</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">超導磁場 / 品質 Q</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.magneticFieldTesla.toFixed(1) }} Tesla</span>
              <span class="text-[10px] text-zinc-500">Q = {{ (state.cavityQFactor / 1000).toFixed(0) }}k</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">捕獲軸子單光子</span>
              <span class="text-lg font-bold font-mono text-amber-400">⚡ {{ state.axionPhotonsHarvested }}</span>
              <span class="text-[10px] text-zinc-500">噪聲 T_sys: {{ state.systemNoiseTempKelvin }} K</span>
            </div>
          </div>

          <!-- 調諧棒角度滑桿 -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div class="flex justify-between items-center text-xs mb-1.5">
              <span class="text-zinc-300 font-medium">🎯 介電調諧棒旋轉角 (Tuning Rod Angle)</span>
              <span class="font-mono text-teal-400 font-bold">{{ state.tuningRodAngleDeg.toFixed(1) }}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="0.5"
              :value="state.tuningRodAngleDeg"
              @input="handleAngleChange"
              class="w-full accent-teal-500 bg-zinc-800 rounded-lg h-2 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>0° (4.5 GHz / 18.6 μeV)</span>
              <span>180° (7.2 GHz / 29.8 μeV)</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="handleHarvest"
              :disabled="state.currentSNR < 2.5"
              class="px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-teal-950/40"
            >
              📥 採集光子 ({{ state.currentSNR > 2.5 ? '可採集' : 'SNR不足' }})
            </button>
            <button
              @click="handleSweep"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🔄 步進頻率掃描 (+12°)
            </button>
            <button
              @click="handleBoostMagnetic"
              class="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              🧲 調諧磁場 (+1.0 T)
            </button>
          </div>
        </div>

        <!-- 右欄：4 大軸子物理能區模式選擇 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            軸子理論能區 (Axion Theoretical Regimes)
          </div>

          <div
            v-for="mode in modesList"
            :key="mode.id"
            @click="handleSetMode(mode.id)"
            :class="[
              'cursor-pointer rounded-xl border p-3 transition flex flex-col gap-1',
              state.currentMode === mode.id
                ? 'border-teal-500 bg-teal-950/30 text-white shadow-lg shadow-teal-950/20'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-teal-300">{{ mode.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400">
                SNR x{{ mode.snrBonus }}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">{{ mode.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
              <span>雙光子頂點: |g|={{ mode.couplingG }}</span>
              <span>期望能區: {{ mode.expectedMassRangeUeV }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { axionHaloscope, AXION_MODES, type AxionMode } from '../engine/axionHaloscope';
import { useUIStore } from '../stores/ui';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

const state = reactive({
  magneticFieldTesla: axionHaloscope.magneticFieldTesla,
  cavityQFactor: axionHaloscope.cavityQFactor,
  tuningRodAngleDeg: axionHaloscope.tuningRodAngleDeg,
  systemNoiseTempKelvin: axionHaloscope.systemNoiseTempKelvin,
  axionPhotonsHarvested: axionHaloscope.axionPhotonsHarvested,
  currentMode: axionHaloscope.currentMode,
  resonanceFrequencyGhz: axionHaloscope.resonanceFrequencyGhz,
  axionMassMicroEV: axionHaloscope.axionMassMicroEV,
  currentSNR: axionHaloscope.currentSNR,
});

const modesList = Object.values(AXION_MODES);
const currentModeName = computed(() => AXION_MODES[state.currentMode]?.name || '');

function syncState() {
  state.magneticFieldTesla = axionHaloscope.magneticFieldTesla;
  state.cavityQFactor = axionHaloscope.cavityQFactor;
  state.tuningRodAngleDeg = axionHaloscope.tuningRodAngleDeg;
  state.systemNoiseTempKelvin = axionHaloscope.systemNoiseTempKelvin;
  state.axionPhotonsHarvested = axionHaloscope.axionPhotonsHarvested;
  state.currentMode = axionHaloscope.currentMode;
  state.resonanceFrequencyGhz = axionHaloscope.resonanceFrequencyGhz;
  state.axionMassMicroEV = axionHaloscope.axionMassMicroEV;
  state.currentSNR = axionHaloscope.currentSNR;
}

function handleAngleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  axionHaloscope.setTuningRodAngle(parseFloat(target.value));
  syncState();
}

function handleHarvest() {
  axionHaloscope.harvestPhotons();
  syncState();
}

function handleSweep() {
  axionHaloscope.triggerSweep();
  syncState();
}

function handleBoostMagnetic() {
  const next = state.magneticFieldTesla >= 16.0 ? 8.0 : state.magneticFieldTesla + 1.0;
  axionHaloscope.setMagneticField(next);
  syncState();
}

function handleSetMode(mode: AxionMode) {
  axionHaloscope.setMode(mode);
  syncState();
}

function close() {
  uiStore.closeOverlay();
}

// ================= Canvas 2D 共振腔剖面與 FFT 頻譜繪製 =================
function renderCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = performance.now() * 0.002;

  // 背景黑底
  ctx.fillStyle = '#030708';
  ctx.fillRect(0, 0, w, h);

  // 左半部：圓柱共振腔截面 (Cavity Cross-section)
  const cx = 130;
  const cy = h * 0.5;
  const cavRadius = 80;

  // 1. 超導外壁
  ctx.beginPath();
  ctx.arc(cx, cy, cavRadius + 10, 0, Math.PI * 2);
  ctx.fillStyle = '#111827';
  ctx.fill();
  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 2. 腔內超導電磁驻波 (RF Standing Wave Field)
  for (let r = 1; r <= 3; r++) {
    const pulseR = (r * 22 + (time * 15) % 22);
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(45, 212, 191, ${0.15 + 0.1 * Math.sin(time * 3 + r)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 3. 旋轉介電調諧棒 (Dielectric Tuning Rod)
  const rodDist = 45;
  const rad = (state.tuningRodAngleDeg * Math.PI) / 180;
  const rodX = cx + Math.cos(rad) * rodDist;
  const rodY = cy + Math.sin(rad) * rodDist;
  const rodR = 18;

  ctx.beginPath();
  ctx.arc(rodX, rodY, rodR, 0, Math.PI * 2);
  ctx.fillStyle = '#14b8a6';
  ctx.shadowColor = '#2dd4bf';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 中心主軸銷
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#94a3b8';
  ctx.fill();

  // 右半部：實時功率譜 FFT 曲線 (Power Spectrum / Axion Peak)
  const specX = 260;
  const specY = 40;
  const specW = 270;
  const specH = 175;

  // 網格底
  ctx.fillStyle = '#061014';
  ctx.fillRect(specX, specY, specW, specH);
  ctx.strokeStyle = '#134e4a';
  ctx.lineWidth = 1;
  ctx.strokeRect(specX, specY, specW, specH);

  // 繪製微波噪聲基底與軸子共振峰
  ctx.beginPath();
  ctx.moveTo(specX, specY + specH - 20);
  const peakPosNorm = state.tuningRodAngleDeg / 180;
  const peakX = specX + peakPosNorm * specW;
  const snrHeight = Math.min(130, state.currentSNR * 12);

  for (let x = 0; x <= specW; x += 4) {
    const curX = specX + x;
    const noise = Math.sin(x * 0.2 + time * 10) * 4 + (Math.random() * 6 - 3);
    const distToPeak = Math.abs(curX - peakX);
    const peakGlow = Math.exp(-distToPeak * distToPeak / 18.0) * snrHeight;
    const curY = specY + specH - 25 - noise - peakGlow;
    ctx.lineTo(curX, curY);
  }

  ctx.strokeStyle = '#2dd4bf';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 標註峰值
  if (state.currentSNR > 4.0) {
    ctx.fillStyle = '#34d399';
    ctx.font = '11px monospace';
    ctx.fillText(`⚡ AXION PEAK: SNR ${state.currentSNR}`, peakX - 45, specY + 25);
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
