<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-lime-500/40 rounded-2xl shadow-2xl shadow-lime-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-lime-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🎯</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              非厄米拓撲奇異點雷射放大器
            </h2>
            <p class="text-xs text-lime-400/80 font-mono">
              Exceptional Point Laser • 宇稱-時間對稱破缺 ⊗ 分數階奇點劈裂 ⊗ 拓撲高靈敏傳感
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

      <!-- 4 大非厄米拓撲放大體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-lime-950/60 border-lime-400 shadow-md shadow-lime-900/40 text-lime-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-lime-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-lime-400/70 mt-2 px-1">
            <span>非厄米複本徵值黎曼分支切口 (Re-Im λ) 與微腔耦合激光束</span>
            <span>EP 階數: {{ state.orderOfEP }}階 • 增益倍率: {{ state.sensitivityEnhancementRatio }}x</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-lime-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>奇異點拓撲傳感儀表</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-lime-900/60 text-lime-200">
              斜率效率 {{ state.laserSlopeEfficiencyPercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>增益/損耗率 γ (GHz)</span>
                <span class="text-lime-300 font-bold">{{ state.gainLossParameterGhz }} GHz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                :value="state.gainLossParameterGhz"
                @input="onGainLossChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lime-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>耦合強度 κ (GHz)</span>
                <span class="text-emerald-300 font-bold">{{ state.couplingStrengthGhz }} GHz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                :value="state.couplingStrengthGhz"
                @input="onCouplingChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">本徵值實部 Re(λ):</span>
              <span class="text-teal-300 font-bold">{{ state.eigenvalueRealGhz }} GHz</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">本徵值虛部 Im(λ):</span>
              <span :class="state.eigenvalueImagGhz > 0 ? 'text-rose-400' : 'text-slate-300'" class="font-bold">
                {{ state.eigenvalueImagGhz }} GHz {{ state.eigenvalueImagGhz > 0 ? '(PT破缺)' : '(PT對稱)' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">分數階靈敏度增益:</span>
              <span class="text-amber-300 font-bold">{{ state.sensitivityEnhancementRatio }} 倍</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計激光脈衝數:</span>
              <span class="text-white font-bold">{{ state.totalLasingPulses }} 次</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="injectPerturbation"
              class="flex-1 py-1.5 px-2 rounded-lg bg-lime-600 hover:bg-lime-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-lime-900/40 text-xs"
            >
              <span>⚡ 注入微擾傳感</span>
            </button>
            <button
              @click="toggleStabilization"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoEPStabilization
                  ? 'border-lime-500/80 bg-lime-950/40 text-lime-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoEPStabilization ? 'EP鎖定: 開' : 'EP鎖定: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 傳感事件歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">非厄米分數階靈敏度傳感取樣歷史隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.sensingHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="s in state.sensingHistory"
            :key="s.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-lime-300">微擾 ε: {{ s.perturbationMicro }} μ</span>
            <span class="text-emerald-300">Δλ {{ s.eigenvalueSplittingGhz }} GHz</span>
            <span class="text-amber-300">增強 {{ s.enhancementFactor }}x</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(s.timestamp) }}</span>
          </div>
          <div v-if="state.sensingHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無傳感採樣記錄，點擊上方按鈕激發微擾注入。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { exceptionalPointEngine, EPRegime } from '@/engine/exceptionalPointLaser';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(exceptionalPointEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'pt_symmetric_balanced_gain_loss' as EPRegime, name: 'PT 平衡增益態', desc: '實數光譜穩定單模激光' },
  { id: 'higher_order_ep3_sensor' as EPRegime, name: 'EP3 立方根傳感', desc: '三階奇點極限靈敏度增益' },
  { id: 'topological_chiral_mode_transfer' as EPRegime, name: '手性模式環繞態', desc: '圍繞奇異點非對稱轉換' },
  { id: 'unidirectional_invisibility_laser' as EPRegime, name: '單向隱形激光', desc: '無反射非對稱光子散射' },
];

function close() {
  uiStore.setExceptionalPointOpen(false);
}

function selectRegime(r: EPRegime) {
  exceptionalPointEngine.setRegime(r);
  state.value = exceptionalPointEngine.getState();
}

function onGainLossChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  exceptionalPointEngine.setGainLoss(val);
  state.value = exceptionalPointEngine.getState();
}

function onCouplingChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  exceptionalPointEngine.setCoupling(val);
  state.value = exceptionalPointEngine.getState();
}

function toggleStabilization() {
  exceptionalPointEngine.toggleAutoStabilization();
  state.value = exceptionalPointEngine.getState();
}

function injectPerturbation() {
  exceptionalPointEngine.injectSensingPerturbation();
  state.value = exceptionalPointEngine.getState();
  achievements.unlock('exceptional_point_laser');
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

  ctx.fillStyle = '#040d08';
  ctx.fillRect(0, 0, w, h);

  // 1. 左側：微腔增益-損耗耦合激光陣列 (Coupled Microcavity Resonators)
  const leftX1 = 80;
  const leftX2 = 180;
  const cavY = 140;
  const cavR = 36;

  // 增益腔 (綠/青光暈)
  const gGrad = ctx.createRadialGradient(leftX1, cavY, 5, leftX1, cavY, cavR);
  gGrad.addColorStop(0, '#a3e635');
  gGrad.addColorStop(0.7, 'rgba(74, 222, 128, 0.4)');
  gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gGrad;
  ctx.beginPath();
  ctx.arc(leftX1, cavY, cavR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a3e635';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 損耗腔 (紅/紫光暈)
  const lGrad = ctx.createRadialGradient(leftX2, cavY, 5, leftX2, cavY, cavR);
  lGrad.addColorStop(0, '#f43f5e');
  lGrad.addColorStop(0.7, 'rgba(244, 63, 94, 0.3)');
  lGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lGrad;
  ctx.beginPath();
  ctx.arc(leftX2, cavY, cavR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 腔間耦合光子通道 (Coupling Channel κ)
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(leftX1 + cavR, cavY);
  ctx.lineTo(leftX2 - cavR, cavY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#fef08a';
  ctx.font = '10px monospace';
  ctx.fillText('增益 +iγ', leftX1 - 22, cavY + 52);
  ctx.fillText('損耗 -iγ', leftX2 - 22, cavY + 52);

  // 2. 右側：複本徵值黎曼分支切面與奇點軌跡 (Riemann Sheet & Branch Point)
  const rightCx = 380;
  const rightCy = 140;

  // 坐標軸 (Re λ vs Im λ)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rightCx - 95, rightCy);
  ctx.lineTo(rightCx + 95, rightCy);
  ctx.moveTo(rightCx, rightCy - 95);
  ctx.lineTo(rightCx, rightCy + 95);
  ctx.stroke();

  // 黎曼螺旋分支雙葉 (Riemann Sheets)
  const epDist = Math.abs(state.value.gainLossParameterGhz - state.value.couplingStrengthGhz) * 12;
  ctx.strokeStyle = 'rgba(163, 230, 53, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 4; a += 0.1) {
    const r = (a / (Math.PI * 4)) * 75;
    const rx = rightCx + Math.cos(a + time * 0.6) * r;
    const ry = rightCy + Math.sin(a + time * 0.6) * (r * 0.6);
    if (a === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.stroke();

  // 奇異點核心 (EP Singularity Point)
  ctx.fillStyle = '#bef264';
  ctx.beginPath();
  ctx.arc(rightCx + (epDist > 2 ? 10 : 0), rightCy, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.font = '11px monospace';
  ctx.fillText('EP 奇異點', rightCx - 26, rightCy - 12);
  ctx.fillText('複本徵值空間 (Re-Im λ)', rightCx - 58, rightCy + 115);
}

function loop() {
  exceptionalPointEngine.update(0.016);
  state.value = exceptionalPointEngine.getState();
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
