<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-pink-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">✨</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              拓撲激子極化激元量子流體反應堆
            </h2>
            <p class="text-xs text-pink-400/80 font-mono">
              Topological Exciton-Polariton Condensate • 半導體微腔強耦合 ⊗ 非平衡玻色凝聚 ⊗ 手性邊界暗孤子
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

      <!-- 4 大運行動力學體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-pink-950/60 border-pink-400 shadow-md shadow-pink-900/40 text-pink-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-pink-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-pink-400/70 mt-2 px-1">
            <span>六角微腔光學蜂窩晶格拓撲邊緣手性流與孤子陷波傳播</span>
            <span>陳數: C={{ state.topologicalChernNumber }} • 聲速: {{ state.soundVelocityKmPerS }} km/s</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-pink-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>微腔極化激元遙測</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-pink-900/60 text-pink-200">
              凝聚度 {{ (state.condensateFraction * 100).toFixed(1) }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>拉比分裂能 ħΩ_R (meV)</span>
                <span class="text-pink-300 font-bold">{{ state.rabiSplittingMev }} meV</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="30.0"
                step="0.2"
                :value="state.rabiSplittingMev"
                @input="onRabiChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>微腔-激子失諧 δ (meV)</span>
                <span class="text-rose-300 font-bold">{{ state.cavityDetuningMev }} meV</span>
              </div>
              <input
                type="range"
                min="-10.0"
                max="10.0"
                step="0.5"
                :value="state.cavityDetuningMev"
                @input="onDetuningChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">激子庫密度 n_R:</span>
              <span class="text-amber-300 font-bold">{{ state.reservoirDensity1e10 }} ×10¹⁰ cm⁻²</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">超流純度:</span>
              <span class="text-emerald-300 font-bold">{{ state.superfluidPurityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">手性孤子數:</span>
              <span class="text-pink-300 font-bold">{{ state.solitonCount }} 個</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">收穫極化光子:</span>
              <span class="text-white font-bold">{{ state.totalHarvestedPhotonCount }}</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="injectSoliton"
              class="flex-1 py-1.5 px-2 rounded-lg bg-pink-600 hover:bg-pink-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-pink-900/40 text-xs"
            >
              <span>⚡ 注入拓撲孤子</span>
            </button>
            <button
              @click="togglePumping"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoPumpingModulation
                  ? 'border-pink-500/80 bg-pink-950/40 text-pink-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoPumpingModulation ? '自動泵浦: 開' : '自動泵浦: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 孤子動態遙測歷史列表 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">手性暗孤子與渦旋遙測事件隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.solitonHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="s in state.solitonHistory"
            :key="s.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-pink-400">凹陷深度 {{ (s.depthRatio * 100).toFixed(0) }}%</span>
            <span class="text-rose-300">速 {{ s.velocityKmPerS }} km/s</span>
            <span class="text-amber-300">Δθ {{ s.phaseJumpRad }} rad</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(s.timestamp) }}</span>
          </div>
          <div v-if="state.solitonHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無手性暗孤子脈衝事件，點擊上方按鈕激發孤子注入。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { excitonPolaritonEngine, PolaritonRegime } from '@/engine/excitonPolaritonCondensate';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(excitonPolaritonEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'bose_einstein_condensate_phase' as PolaritonRegime, name: '玻色凝聚相', desc: '極低有效質量室溫凝聚' },
  { id: 'topological_chiral_edge_soliton' as PolaritonRegime, name: '手性拓撲孤子', desc: '蜂窩微腔邊界無耗散傳播' },
  { id: 'half_quantum_vortex_superfluid' as PolaritonRegime, name: '半量子自旋渦旋', desc: '自旋依賴量子化超流渦旋' },
  { id: 'room_temperature_polariton_laser' as PolaritonRegime, name: '極化微腔激光', desc: '反轉無門檻同調激光發射' },
];

function close() {
  uiStore.setExcitonPolaritonOpen(false);
}

function selectRegime(r: PolaritonRegime) {
  excitonPolaritonEngine.setRegime(r);
  state.value = excitonPolaritonEngine.getState();
}

function onRabiChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  excitonPolaritonEngine.setRabiSplitting(val);
  state.value = excitonPolaritonEngine.getState();
}

function onDetuningChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  excitonPolaritonEngine.setDetuning(val);
  state.value = excitonPolaritonEngine.getState();
}

function togglePumping() {
  excitonPolaritonEngine.toggleAutoPumping();
  state.value = excitonPolaritonEngine.getState();
}

function injectSoliton() {
  excitonPolaritonEngine.injectSolitonPulse();
  state.value = excitonPolaritonEngine.getState();
  achievements.unlock('exciton_polariton_condensate');
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

  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // 1. 繪製六角蜂窩微腔格點晶格背景
  const hexSize = 22;
  const cols = Math.ceil(w / (hexSize * 1.7)) + 1;
  const rows = Math.ceil(h / (hexSize * 1.5)) + 1;

  ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
  ctx.lineWidth = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * hexSize * 1.7 + (r % 2 === 1 ? hexSize * 0.85 : 0);
      const cy = r * hexSize * 1.5;

      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const angle = (a * Math.PI) / 3;
        const hx = cx + Math.cos(angle) * (hexSize * 0.5);
        const hy = cy + Math.sin(angle) * (hexSize * 0.5);
        if (a === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // 2. 邊緣拓撲手性流光環 (Topological Edge State)
  if (state.value.topologicalChernNumber !== 0) {
    const pad = 24;
    ctx.save();
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 6]);
    ctx.lineDashOffset = -time * 30;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    ctx.restore();
  }

  // 3. 凝聚體波函數密度熱力流動 (Condensate Wavefunction Density)
  const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 180);
  grad.addColorStop(0, 'rgba(244, 114, 182, 0.35)');
  grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.18)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 180, 0, Math.PI * 2);
  ctx.fill();

  // 4. 動態極化激元暗孤子陷波凹陷軌跡 (Dark Solitons)
  const count = state.value.solitonCount;
  for (let i = 0; i < count; i++) {
    const angle = time * 0.8 + (i * (Math.PI * 2) / count);
    const radius = 70 + Math.sin(time + i) * 20;
    const sx = w / 2 + Math.cos(angle) * radius;
    const sy = h / 2 + Math.sin(angle) * radius;

    // 暗孤子核心：反向凹陷（黑色核心 + 粉金外圈）
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, 9, 0, Math.PI * 2);
    ctx.stroke();

    // 孤子伴隨手性波紋
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy, 14, angle, angle + Math.PI);
    ctx.stroke();
  }

  // 5. 激子庫微觀粒子群 (Reservoir Excitons)
  const particleCount = 20;
  for (let p = 0; p < particleCount; p++) {
    const px = (Math.sin(time * 0.4 + p * 2.1) * 0.5 + 0.5) * (w - 60) + 30;
    const py = (Math.cos(time * 0.5 + p * 1.8) * 0.5 + 0.5) * (h - 60) + 30;
    ctx.fillStyle = 'rgba(253, 224, 71, 0.7)';
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  excitonPolaritonEngine.update(0.016);
  state.value = excitonPolaritonEngine.getState();
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
