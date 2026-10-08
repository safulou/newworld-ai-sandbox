<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-red-500/40 rounded-2xl shadow-2xl shadow-red-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-red-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚛️</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              拓撲馬約拉納零能模非阿貝爾量子編織晶片
            </h2>
            <p class="text-xs text-red-400/80 font-mono">
              Majorana Braiding Chip • 一維 Kitaev 拓撲超導 ⊗ T型結非阿貝爾編織 ⊗ 宇稱容錯量子位元
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

      <!-- 4 大拓撲編織體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-red-950/60 border-red-400 shadow-md shadow-red-900/40 text-red-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-red-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-red-400/70 mt-2 px-1">
            <span>T-Junction 奈米線接面馬約拉納零能模 (γ₁, γ₂, γ₃) 非阿貝爾編織軌跡</span>
            <span>拓撲能隙: {{ state.topologicalGapMev }} meV • 宇稱讀出: {{ state.fermionParityReadout }}</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-red-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>馬約拉納量子位元遙測</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-200">
              保真度 {{ state.groundStateFidelityPercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>外加塞曼磁場 B_z (T)</span>
                <span class="text-red-300 font-bold">{{ state.zeemanFieldTesla }} T</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                :value="state.zeemanFieldTesla"
                @input="onZeemanChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>超導近鄰能隙 Δ (meV)</span>
                <span class="text-rose-300 font-bold">{{ state.superconductingGapMev }} meV</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                :value="state.superconductingGapMev"
                @input="onGapChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">編織么正旋轉角:</span>
              <span class="text-amber-300 font-bold">{{ state.braidingAngleDeg }}° (π/2 編織)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">費米子宇稱態:</span>
              <span :class="state.fermionParityReadout.includes('Even') ? 'text-emerald-300' : 'text-cyan-300'" class="font-bold">
                {{ state.fermionParityReadout }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">量子相干時間 T_2:</span>
              <span class="text-white font-bold">{{ state.qubitDecoherenceTimeUs }} μs</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計拓撲編織次數:</span>
              <span class="text-white font-bold">{{ state.totalBraidsExecuted }} 次</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="braid"
              class="flex-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-red-900/40 text-xs"
            >
              <span>🔄 執行非阿貝爾編織</span>
            </button>
            <button
              @click="toggleBraiding"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoBraidingCycle
                  ? 'border-red-500/80 bg-red-950/40 text-red-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoBraidingCycle ? '自動編織: 開' : '自動編織: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 編織歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">非阿貝爾馬約拉納交換操作歷史隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.braidHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="b in state.braidHistory"
            :key="b.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-red-400">{{ b.braidPair }}</span>
            <span class="text-amber-300">相位 {{ b.unitaryPhaseDeg }}°</span>
            <span :class="b.fermionParity.includes('Even') ? 'text-emerald-400' : 'text-cyan-400'">
              {{ b.fermionParity }}
            </span>
            <span class="text-slate-400">保真度 {{ (b.topologicalFidelity * 100).toFixed(2) }}%</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(b.timestamp) }}</span>
          </div>
          <div v-if="state.braidHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無編織操作記錄，點擊上方按鈕執行非阿貝爾編織。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { majoranaBraidingEngine, MajoranaRegime } from '@/engine/majoranaBraidingQubit';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(majoranaBraidingEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'topological_kitaev_wire_edge' as MajoranaRegime, name: 'Kitaev 奈米線端態', desc: '一維拓撲超導兩端零能模' },
  { id: 't_junction_non_abelian_braid' as MajoranaRegime, name: 'T型結非阿貝爾編織', desc: '絕熱交換操作產生么正門' },
  { id: 'parity_qubit_topological_gate' as MajoranaRegime, name: '宇稱容錯量子門', desc: '全域拓撲相位相干保護' },
  { id: 'majorana_surface_code_fault_tolerant' as MajoranaRegime, name: '2D 表面編織代碼', desc: '可擴展容錯拓撲量子記憶' },
];

function close() {
  uiStore.setMajoranaBraidingOpen(false);
}

function selectRegime(r: MajoranaRegime) {
  majoranaBraidingEngine.setRegime(r);
  state.value = majoranaBraidingEngine.getState();
}

function onZeemanChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  majoranaBraidingEngine.setZeemanField(val);
  state.value = majoranaBraidingEngine.getState();
}

function onGapChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  majoranaBraidingEngine.setSuperconductingGap(val);
  state.value = majoranaBraidingEngine.getState();
}

function toggleBraiding() {
  majoranaBraidingEngine.toggleAutoBraiding();
  state.value = majoranaBraidingEngine.getState();
}

function braid() {
  majoranaBraidingEngine.executeBraidStep();
  state.value = majoranaBraidingEngine.getState();
  achievements.unlock('majorana_braiding_qubit');
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

  ctx.fillStyle = '#0f0507';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = 160;

  // 1. 繪製 T 型接面超導奈米線 (T-Junction Superconducting Nanowire)
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 水平橫臂 (左端至右端)
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy);
  ctx.lineTo(cx + 160, cy);
  ctx.stroke();

  // 垂直縱臂 (中心向下)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 100);
  ctx.stroke();

  // 奈米線核心通道
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 160, cy);
  ctx.lineTo(cx + 160, cy);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 100);
  ctx.stroke();

  // 2. 馬約拉納零能模束縛點 (γ₁, γ₂, γ₃)
  // 三個端點位置：左端、右端、頂端
  const pLeft = { x: cx - 160, y: cy };
  const pRight = { x: cx + 160, y: cy };
  const pTop = { x: cx, y: cy - 100 };

  const modes = [
    { label: 'γ₁', x: pLeft.x, y: pLeft.y, color: '#f87171' },
    { label: 'γ₂', x: pRight.x, y: pRight.y, color: '#38bdf8' },
    { label: 'γ₃', x: pTop.x, y: pTop.y, color: '#fbbf24' }
  ];

  modes.forEach((m, idx) => {
    // 零能波函數峰波紋 (Majorana Peak)
    const pulse = Math.sin(time * 3 + idx * 2) * 4;
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 8 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(m.label, m.x - 6, m.y + (m.y < cy ? -14 : 24));
  });

  // 3. 非阿貝爾編織交換虛擬引導軌跡
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(cx, cy - 40, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. 編織么正算符標記
  ctx.fillStyle = '#fca5a5';
  ctx.font = '11px monospace';
  ctx.fillText(`編織么正門: B_12 = exp(π/4 γ₁γ₂)`, 18, 28);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`基態費米子宇稱守恆: P_12 = iγ₁γ₂`, 18, 46);
}

function loop() {
  majoranaBraidingEngine.update(0.016);
  state.value = majoranaBraidingEngine.getState();
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
