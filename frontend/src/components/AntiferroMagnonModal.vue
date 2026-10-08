<template>
  <div v-if="uiStore.mode === 'antiferro-magnon'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-rose-500/30 bg-rose-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🧲</span>
          <div>
            <h2 class="text-xl font-bold text-rose-300 tracking-wider">
              反鐵磁拓撲磁振子狄拉克半金屬波導
            </h2>
            <p class="text-xs text-rose-400/70">
              Antiferromagnetic THz Dynamics · Topological Dirac Magnon · Magnon Thermal Hall Effect
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
        >
          ✕
        </button>
      </div>

      <!-- Main Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Visualizer Canvas & Telemetry -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 bg-slate-950/80 rounded-xl border border-rose-500/20 p-4 flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-2 text-xs font-mono text-rose-400">
              <span>雙子晶格反鐵磁自旋波與手性邊界磁振子流 (AFM Spin Texture & Edge Mode)</span>
              <span>f = {{ state.resonanceFreqThz.toFixed(2) }} THz | C = {{ state.chernNumber }}</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-rose-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> 子晶格 A (自旋向上)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> 子晶格 B (自旋向下)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 手性邊界磁振子自旋流</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-rose-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-rose-900/60 pb-1">
              太赫茲自旋電子學遙測
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">AFM 共振頻率 f_AFM</span>
                <span class="text-rose-300 font-semibold">{{ state.resonanceFreqThz.toFixed(2) }} THz</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">磁振子拓撲能隙 Δ_M</span>
                <span class="text-amber-300">{{ state.topologicalGapMev.toFixed(2) }} meV</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">能帶陳數 Chern C</span>
                <span :class="state.chernNumber !== 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'">
                  {{ state.chernNumber }}
                  <span v-if="state.chernNumber !== 0" class="text-[10px] text-emerald-500">(拓撲相)</span>
                </span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">熱霍爾導率 κ_xy</span>
                <span class="text-cyan-300 font-bold">{{ state.thermalHallConductivity.toFixed(2) }} μW/(K·m)</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">自旋波群速度 v_g</span>
                <span class="text-purple-300">{{ state.spinWaveVelocityKmS.toFixed(1) }} km/s</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">貝里曲率峰值 Ω_max</span>
                <span class="text-rose-400">{{ state.berryCurvaturePeak.toFixed(1) }} Å²</span>
              </div>
            </div>

            <button
              @click="injectPulse"
              class="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              ⚡ 注入太赫茲磁振子激發脈衝 (THz Pulse)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-rose-950">
          <!-- Magnetic Field Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>外加磁場 B_z</span>
              <span class="text-rose-400 font-mono">{{ state.appliedFieldTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="0"
              max="10.0"
              step="0.1"
              :value="state.appliedFieldTesla"
              @input="onFieldChange"
              class="w-full accent-rose-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">翻轉臨界場: 4.8 T</span>
          </div>

          <!-- DMI Coupling Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>DMI 強度比 D/J</span>
              <span class="text-amber-400 font-mono">{{ state.dmiCouplingRatio.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.01"
              :value="state.dmiCouplingRatio"
              @input="onDmiChange"
              class="w-full accent-amber-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">空間反演破缺強度</span>
          </div>

          <!-- Temperature Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>晶格溫度 T</span>
              <span class="text-cyan-400 font-mono">{{ state.temperatureKelvin.toFixed(0) }} K</span>
            </div>
            <input
              type="range"
              min="1"
              max="300"
              step="5"
              :value="state.temperatureKelvin"
              @input="onTempChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">玻色分佈熱激發</span>
          </div>

          <!-- Neel Angle Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>奈爾向量角 θ_L</span>
              <span class="text-purple-400 font-mono">{{ state.neelAngleDeg.toFixed(0) }}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="1"
              :value="state.neelAngleDeg"
              @input="onAngleChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">反平行自旋軸</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            反鐵磁磁振子體制 (Magnon Regimes)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="reg in regimes"
              :key="reg.key"
              @click="selectRegime(reg.key)"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col justify-between',
                state.regime === reg.key
                  ? 'bg-rose-950/60 border-rose-400 shadow-lg text-rose-200'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              ]"
            >
              <div class="text-sm font-bold flex items-center gap-1.5">
                <span>{{ reg.icon }}</span>
                <span>{{ reg.title }}</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{{ reg.desc }}</p>
            </button>
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
  antiferroMagnonEngine,
  type AntiferroMagnonRegime,
  type AntiferroMagnonState
} from '../engine/antiferroTopologicalMagnon';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<AntiferroMagnonState>(antiferroMagnonEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const regimes: Array<{ key: AntiferroMagnonRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'terahertz-waveguide',
    title: '太赫茲狄拉克波導相',
    icon: '⚡',
    desc: '無阻尼超快 THz 反鐵磁自旋波彈道傳輸，群速度高達 20 km/s 以上。'
  },
  {
    key: 'neel-spin-flop',
    title: '奈爾向量自旋翻轉相',
    icon: '🔄',
    desc: '強外加磁場超過臨界閾值引致自旋翻轉，奈爾向量垂直偏轉誘發相變。'
  },
  {
    key: 'chiral-thermal-hall',
    title: '手性磁振子熱霍爾相',
    icon: '🔥',
    desc: 'DMI 破缺時間反演幾何貝里曲率偏折中性熱流，呈現巨非零橫向導率 κ_xy。'
  },
  {
    key: 'topological-edge-soliton',
    title: '拓撲邊界態自旋孤子相',
    icon: '🛡️',
    desc: '體態絕緣邊界導通，手性單向拓撲保護磁振子流免受背向散射阻滯。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onFieldChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  antiferroMagnonEngine.setAppliedField(val);
  syncState();
}

function onDmiChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  antiferroMagnonEngine.setDmiRatio(val);
  syncState();
}

function onTempChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  antiferroMagnonEngine.setTemperature(val);
  syncState();
}

function onAngleChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  antiferroMagnonEngine.setNeelAngle(val);
  syncState();
}

function selectRegime(regime: AntiferroMagnonRegime) {
  antiferroMagnonEngine.setRegime(regime);
  syncState();
}

function injectPulse() {
  antiferroMagnonEngine.injectTHzMagnonPulse();
  achievements.unlock('antiferro_topological_magnon');
  syncState();
}

function syncState() {
  state.value = { ...antiferroMagnonEngine.getState() };
}

function drawVisualizer() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  ctx.clearRect(0, 0, w, h);

  // 背景
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
  bgGrad.addColorStop(0, '#150508');
  bgGrad.addColorStop(1, '#050102');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  animPhase += 0.04;

  // 1. 左側 60%：反鐵磁雙子晶格 (A/B) 蜂窩點陣與自旋向量
  const latticeW = w * 0.62;
  const spacing = 32;
  const cols = Math.floor(latticeW / spacing);
  const rows = Math.floor((h - 40) / (spacing * 0.866));

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, latticeW, h);
  ctx.clip();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = (r % 2 === 0 ? 0 : spacing * 0.5);
      const cx = 35 + c * spacing + offsetX;
      const cy = 35 + r * spacing * 0.866;

      // 判定雙子晶格 (A 或 B)
      const isSubA = (c + r) % 2 === 0;

      // 自旋歲差 (太赫茲高頻歲差圓錐)
      const precFreq = state.value.resonanceFreqThz * 2.5;
      const precPhase = animPhase * precFreq + (cx + cy) * 0.03;
      const precRadius = 7 + (state.value.topologicalGapMev * 1.2);

      const spinDx = Math.cos(precPhase) * precRadius;
      const spinDy = (isSubA ? -1 : 1) * (14 + Math.sin(precPhase) * 3);

      // 繪製晶格原子點
      ctx.fillStyle = isSubA ? '#3b82f6' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 繪製反平行自旋箭頭
      ctx.strokeStyle = isSubA ? '#60a5fa' : '#fb7185';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + spinDx, cy + spinDy);
      ctx.stroke();

      // 箭頭端點
      ctx.fillStyle = isSubA ? '#93c5fd' : '#fca5a5';
      ctx.beginPath();
      ctx.arc(cx + spinDx, cy + spinDy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 若處於拓撲相 (Chern C != 0)，繪製手性邊緣自旋流
  if (state.value.chernNumber !== 0) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 4]);
    ctx.lineDashOffset = -animPhase * 30;

    // 沿著邊界流動
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(latticeW - 20, 20);
    ctx.lineTo(latticeW - 20, h - 20);
    ctx.lineTo(20, h - 20);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();

  // 2. 右側 38%：磁振子貝里曲率能帶圖與熱霍爾流 (Berry Curvature & Thermal Hall)
  const berryX = latticeW + 8;
  const berryW = w - berryX - 12;
  const berryY = 16;
  const berryH = h - 32;

  ctx.fillStyle = 'rgba(25, 8, 12, 0.7)';
  ctx.fillRect(berryX, berryY, berryW, berryH);
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
  ctx.strokeRect(berryX, berryY, berryW, berryH);

  ctx.font = '10px monospace';
  ctx.fillStyle = '#fb7185';
  ctx.fillText('磁振子能帶與狄拉克錐節點', berryX + 8, berryY + 16);

  // 繪製光學支與聲學支狄拉克錐與拓撲能隙
  const bandMidX = berryX + berryW / 2;
  const bandMidY = berryY + 110;
  const gapHalf = Math.max(3, state.value.topologicalGapMev * 5);

  ctx.strokeStyle = '#38bdf8'; // 聲學支 (Acoustic Magnon)
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = -50; px <= 50; px++) {
    const energy = Math.sqrt(px * px * 0.8 + gapHalf * gapHalf);
    const plotX = bandMidX + px;
    const plotY = bandMidY + energy;
    if (px === -50) ctx.moveTo(plotX, plotY);
    else ctx.lineTo(plotX, plotY);
  }
  ctx.stroke();

  ctx.strokeStyle = '#f43f5e'; // 光學支 (Optical Magnon)
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = -50; px <= 50; px++) {
    const energy = Math.sqrt(px * px * 0.8 + gapHalf * gapHalf);
    const plotX = bandMidX + px;
    const plotY = bandMidY - energy;
    if (px === -50) ctx.moveTo(plotX, plotY);
    else ctx.lineTo(plotX, plotY);
  }
  ctx.stroke();

  // 能隙標記
  ctx.strokeStyle = '#fbbf24';
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(bandMidX - 15, bandMidY - gapHalf);
  ctx.lineTo(bandMidX + 15, bandMidY - gapHalf);
  ctx.moveTo(bandMidX - 15, bandMidY + gapHalf);
  ctx.lineTo(bandMidX + 15, bandMidY + gapHalf);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '9px monospace';
  ctx.fillText(`Δ_M = ${state.value.topologicalGapMev.toFixed(2)} meV`, bandMidX + 20, bandMidY + 3);

  // 下半部：熱霍爾熱通量導率量表
  const hallBaseY = berryY + berryH - 50;
  ctx.fillStyle = '#67e8f9';
  ctx.fillText(`熱霍爾效應 κ_xy: ${state.value.thermalHallConductivity.toFixed(1)}`, berryX + 8, hallBaseY);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(berryX + 8, hallBaseY + 8, berryW - 16, 14);
  const hallBarWidth = Math.min(berryW - 16, (state.value.thermalHallConductivity / 40.0) * (berryW - 16));
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(berryX + 8, hallBaseY + 8, hallBarWidth, 14);
}

function animateLoop() {
  drawVisualizer();
  animId = requestAnimationFrame(animateLoop);
}

onMounted(() => {
  animId = requestAnimationFrame(animateLoop);
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
