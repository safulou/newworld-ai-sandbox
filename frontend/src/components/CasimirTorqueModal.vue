<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-rose-500/40 rounded-2xl shadow-2xl shadow-rose-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-rose-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚙️</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              拓撲缺陷卡西米爾真空扭矩馬達
            </h2>
            <p class="text-xs text-rose-400/80 font-mono">
              Casimir Vacuum Torque Motor • 雙折射晶體非對稱量子零點場扭矩 τ ∝ (sin 2θ / d³) · Δϵ
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

      <!-- 4 大卡西米爾扭矩工作體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-rose-950/60 border-rose-400 shadow-md shadow-rose-900/40 text-rose-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-rose-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-rose-400/70 mt-2 px-1">
            <span>各向異性旋轉微片與真空側向扭矩場</span>
            <span>轉速: {{ state.rotationSpeedRpm.toFixed(0) }} RPM (扭矩 {{ state.torqueFemtoNm }} fN·m)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="space-y-2">
            <div class="text-slate-400 font-semibold border-b border-slate-700 pb-1 flex justify-between">
              <span>量子卡西米爾力學</span>
              <span class="text-rose-400 font-bold">零摩擦超真空</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">側向旋轉扭矩 τ：</span>
              <span class="font-mono text-rose-300 font-bold">{{ state.torqueFemtoNm }} fN·m</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">馬達角速度：</span>
              <span class="font-mono text-pink-300 font-bold">{{ state.rotationSpeedRpm.toFixed(0) }} RPM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">零點輸出功率：</span>
              <span class="font-mono text-amber-300 font-bold">{{ state.outputPowerAttoWatt }} aW</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">真空懸浮穩定度：</span>
              <span class="font-mono text-emerald-300 font-bold">{{ state.levitationStabilityPercent }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">板間距 d：</span>
              <span class="font-mono text-cyan-300 font-bold">{{ state.gapDistanceNm }} nm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計旋轉衝擊：</span>
              <span class="font-mono text-yellow-300 font-bold">{{ state.totalSpinsExecuted }} 次</span>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 flex flex-col gap-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">零點能儲備通量：</span>
              <span class="font-bold text-rose-300 font-mono">{{ state.vacuumZeroEnergyFlux.toFixed(1) }} VF</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, state.vacuumZeroEnergyFlux / 12)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 間距與旋轉角調節滑桿 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">奈米板間隙 d (nm)：</span>
            <span class="font-mono text-rose-300">{{ state.gapDistanceNm }} nm</span>
          </div>
          <input
            type="range"
            min="10.0"
            max="120.0"
            step="1.0"
            :value="state.gapDistanceNm"
            @input="onGapChange"
            class="w-full accent-rose-400 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-semibold">各向異性夾角 θ (deg)：</span>
            <span class="font-mono text-pink-300">{{ state.rotationAngleDeg }}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            :value="state.rotationAngleDeg"
            @input="onAngleChange"
            class="w-full accent-pink-400 cursor-pointer"
          />
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="triggerSpin"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition active:scale-95"
          >
            ⚡ 啟動量子旋轉加速
          </button>
          <button
            @click="triggerResonance"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/50 text-rose-300 text-xs font-semibold transition active:scale-95"
          >
            🔔 零點共振增益
          </button>
        </div>

        <button
          @click="toggleAutoDrive"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-semibold border transition',
            state.autoDrive
              ? 'bg-rose-950/60 border-rose-500 text-rose-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          ]"
        >
          {{ state.autoDrive ? '🟢 真空自轉驅動開' : '⚪ 真空自轉驅動關' }}
        </button>
      </div>

      <!-- 扭量運作歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
        <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>📡 卡西米爾真空扭矩記錄 (Torque Telemetry Stream)</span>
          <span class="text-[10px] text-slate-500">{{ state.torqueLogs.length }} 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 text-[11px] font-mono">
          <div
            v-for="l in state.torqueLogs"
            :key="l.id"
            class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:border-rose-500/40 transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-rose-400 font-bold">#{{ l.id.slice(-6) }}</span>
              <span class="text-slate-400">間距: {{ l.gapNm }} nm</span>
              <span class="text-pink-300">角度: {{ l.angleDeg }}°</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-amber-300">扭矩: {{ l.torqueFemtoNm }} fN·m</span>
              <span class="text-emerald-400">功率: {{ l.powerAttoWatt }} aW</span>
            </div>
          </div>
          <div v-if="state.torqueLogs.length === 0" class="text-center text-slate-600 py-3 text-xs">
            尚未執行旋轉測試，請點擊上方按鈕激發卡西米爾力學扭矩
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
  casimirTorqueEngine,
  type CasimirRegime,
  type CasimirMotorState
} from '../engine/casimirTorqueMotor';

const uiStore = useUIStore();
const state = ref<CasimirMotorState>(casimirTorqueEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let rotPhase = 0;

const regimes: { id: CasimirRegime; name: string; desc: string }[] = [
  { id: 'birefringent_calcite', name: '方解石雙折射', desc: '雙軸各向異性零點扭矩' },
  { id: 'chiral_weyl', name: '手性外爾半金屬', desc: '拓撲表面態側向力增益' },
  { id: 'negative_casimir_levitation', name: '負卡西米爾斥力', desc: '超材料懸浮零接觸磨損' },
  { id: 'dynamical_vacuum_drive', name: '動態真空共振', desc: '真空破缺共振驅動' }
];

const close = () => {
  uiStore.closeOverlay();
};

const selectRegime = (regime: CasimirRegime) => {
  casimirTorqueEngine.setRegime(regime);
  state.value = casimirTorqueEngine.getState();
};

const onGapChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  casimirTorqueEngine.setGapDistanceNm(val);
  state.value = casimirTorqueEngine.getState();
};

const onAngleChange = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  casimirTorqueEngine.setRotationAngleDeg(val);
  state.value = casimirTorqueEngine.getState();
};

const triggerSpin = () => {
  casimirTorqueEngine.spinMotor();
  state.value = casimirTorqueEngine.getState();
};

const triggerResonance = () => {
  casimirTorqueEngine.triggerResonanceBoost();
  state.value = casimirTorqueEngine.getState();
};

const toggleAutoDrive = () => {
  casimirTorqueEngine.setAutoDrive(!state.value.autoDrive);
  state.value = casimirTorqueEngine.getState();
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  rotPhase += (state.value.rotationSpeedRpm / 12000) * 0.08;

  ctx.fillStyle = '#11050a';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const thetaRad = (state.value.rotationAngleDeg * Math.PI) / 180;

  // 1. 繪製底部固定超導基底晶片 (Stator)
  ctx.fillStyle = '#1e1b2e';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 100, cy - 25, 200, 50);
  ctx.fillRect(cx - 100, cy - 25, 200, 50);

  // 2. 懸浮旋轉轉子晶片 (Rotor - 旋轉角度 θ)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(thetaRad + rotPhase);

  ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
  ctx.strokeStyle = '#fb7185';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 12;

  // 橢圓或長方旋轉薄片
  ctx.beginPath();
  ctx.roundRect(-90, -18, 180, 36, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 各向異性主光軸箭頭 (Optical Axis)
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-75, 0);
  ctx.lineTo(75, 0);
  ctx.stroke();

  ctx.restore();

  // 3. 卡西米爾側向力向量切線箭頭
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 側向扭矩箭頭
  const arrowAngle = thetaRad + rotPhase;
  const tx = Math.cos(arrowAngle) * 110;
  const ty = Math.sin(arrowAngle) * 110;
  ctx.beginPath();
  ctx.fillStyle = '#f43f5e';
  ctx.arc(tx, ty, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  animId = requestAnimationFrame(drawCanvas);
};

onMounted(() => {
  drawCanvas();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
