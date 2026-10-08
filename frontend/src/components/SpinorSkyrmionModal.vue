<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌀</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              旋量玻色-愛因斯坦凝聚斯格明子拓撲天體反應堆
            </h2>
            <p class="text-xs text-amber-400/80 font-mono">
              Spinor Skyrmion Condensate • 自旋 F=1 多分量序參量 ⊗ 拓撲荷 Q ⊗ 合成規範場狄拉克單極子
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

      <!-- 4 大旋量拓撲動力學體制 -->
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
            <span>2D 旋量斯格明子向量場紋理 (刺猬/螺旋幾何) 與向列相流線</span>
            <span>拓撲荷: Q={{ state.topologicalChargeQ }} • 向列序: {{ state.spinNematicOrderParameter }}</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-amber-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>旋量自旋紋理遙測</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-200">
              相干性 {{ state.condensateCoherencePercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>二次塞曼位移 q (kHz)</span>
                <span class="text-amber-300 font-bold">{{ state.quadraticZeemanKhz }} kHz</span>
              </div>
              <input
                type="range"
                min="-5.0"
                max="15.0"
                step="0.5"
                :value="state.quadraticZeemanKhz"
                @input="onZeemanChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>斯格明子密度 (10⁸ cm⁻²)</span>
                <span class="text-orange-300 font-bold">{{ state.skyrmionDensity1e8 }}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                :value="state.skyrmionDensity1e8"
                @input="onDensityChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">自旋量子數:</span>
              <span class="text-yellow-300 font-bold">F = {{ state.spinF }} (³組分)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">合成單極子通量:</span>
              <span class="text-emerald-300 font-bold">{{ state.monopoleSyntheticFlux }} h/e</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">向列液晶態序:</span>
              <span class="text-cyan-300 font-bold">{{ state.spinNematicOrderParameter }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">成核斯格明子:</span>
              <span class="text-white font-bold">{{ state.totalSkyrmionsGenerated }} 個</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="nucleate"
              class="flex-1 py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-amber-900/40 text-xs"
            >
              <span>🌀 成核斯格明子</span>
            </button>
            <button
              @click="togglePrecession"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoTexturePrecession
                  ? 'border-amber-500/80 bg-amber-950/40 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoTexturePrecession ? '進動流: 開' : '進動流: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 斯格明子歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">斯格明子拓撲核成核事件歷史隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.skyrmionHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="s in state.skyrmionHistory"
            :key="s.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-amber-400">拓撲荷 Q={{ s.topologicalCharge }}</span>
            <span class="text-orange-300">核半徑 {{ s.coreRadiusNm }} nm</span>
            <span class="text-yellow-300">極化 {{ (s.spinPolarization * 100).toFixed(0) }}%</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(s.timestamp) }}</span>
          </div>
          <div v-if="state.skyrmionHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無斯格明子成核事件，點擊上方按鈕激發自旋拓撲成核。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { spinorSkyrmionEngine, SpinorRegime } from '@/engine/spinorSkyrmionCondensate';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(spinorSkyrmionEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'ferromagnetic_skyrmion_lattice' as SpinorRegime, name: '鐵磁斯格明子晶格', desc: '自組織 2D 拓撲自旋刺猬陣列' },
  { id: 'polar_coreless_vortex_pair' as SpinorRegime, name: '極性無核渦旋對', desc: '梅森子對偶無奇異性旋轉' },
  { id: 'synthetic_gauge_monopole' as SpinorRegime, name: '合成規範單極子', desc: '貝里曲率 3D 狄拉克拓撲荷' },
  { id: 'spin_nematic_director_liquid' as SpinorRegime, name: '自旋向列液晶態', desc: '無磁化強度雙重指向矢流' },
];

function close() {
  uiStore.setSpinorSkyrmionOpen(false);
}

function selectRegime(r: SpinorRegime) {
  spinorSkyrmionEngine.setRegime(r);
  state.value = spinorSkyrmionEngine.getState();
}

function onZeemanChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  spinorSkyrmionEngine.setQuadraticZeeman(val);
  state.value = spinorSkyrmionEngine.getState();
}

function onDensityChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  spinorSkyrmionEngine.setSkyrmionDensity(val);
  state.value = spinorSkyrmionEngine.getState();
}

function togglePrecession() {
  spinorSkyrmionEngine.toggleAutoPrecession();
  state.value = spinorSkyrmionEngine.getState();
}

function nucleate() {
  spinorSkyrmionEngine.nucleateSkyrmion();
  state.value = spinorSkyrmionEngine.getState();
  achievements.unlock('spinor_skyrmion_condensate');
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const time = Date.now() * 0.002;

  ctx.fillStyle = '#0b0803';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  // 1. 2D 斯格明子自旋向量紋理網格 (Spinor Vector Field Grid)
  const step = 26;
  const cols = Math.floor(w / step);
  const rows = Math.floor(h / step);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * step + step * 0.5;
      const py = r * step + step * 0.5;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 斯格明子外圍自旋向上 (S_z > 0)，核心自旋向下 (S_z < 0)
      // 拓撲荷 Q 決定方位角纏繞率
      const q = state.value.topologicalChargeQ;
      const phi = Math.atan2(dy, dx);
      const theta = Math.PI * Math.exp(-dist / 65); // 核心為 π，向外衰減為 0

      // 自旋分量
      const spinAngle = q * phi + time * 0.8;
      const arrowLen = 10;
      const ax = Math.cos(spinAngle) * Math.sin(theta) * arrowLen;
      const ay = Math.sin(spinAngle) * Math.sin(theta) * arrowLen;

      // 顏色依 S_z = cos(theta) 調色
      const sz = Math.cos(theta); // 核心 -1 (紅/橙)，外圍 +1 (金/黃)
      const color = sz < 0 ? '#f97316' : '#fde047';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + ax, py + ay);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. 斯格明子核心邊界環 (Topological Core Horizon)
  const coreR = 65;
  ctx.save();
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -time * 20;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. 核心奇異點向列相光暈 (Core Director Liquid)
  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50);
  grad.addColorStop(0, 'rgba(234, 88, 12, 0.5)');
  grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.fill();

  // 4. 合成狄拉克單極子磁力線 (Synthetic Monopole Streamlines)
  if (state.value.topologicalChargeQ !== 0) {
    const rayCount = 8;
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < rayCount; i++) {
      const a = (i * Math.PI * 2) / rayCount + time * 0.4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15);
      ctx.lineTo(cx + Math.cos(a) * 140, cy + Math.sin(a) * 140);
      ctx.stroke();
    }
  }
}

function loop() {
  spinorSkyrmionEngine.update(0.016);
  state.value = spinorSkyrmionEngine.getState();
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
