<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-purple-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌌</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              霍金-安魯效應全息引力對偶量子微波探測器
            </h2>
            <p class="text-xs text-purple-400/80 font-mono">
              Hawking-Unruh Holographic Detector • 彎曲時空量子場論 ⊗ 類比加速視界 ⊗ 雙模壓縮微波光子對
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

      <!-- 4 大全息微波探測體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-purple-950/60 border-purple-400 shadow-md shadow-purple-900/40 text-purple-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-purple-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-purple-400/70 mt-2 px-1">
            <span>事件視界加速光錐與雙模壓縮態相空間 Wigner 旋轉橢圓分佈</span>
            <span>溫度: {{ state.hawkingUnruhTempMilliKelvin }} mK • 糾纏熵: {{ state.twoModeEntanglementEntropy }} ebits</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-purple-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>視界微波輻射監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-200">
              保真度 {{ state.quantumFidelityPercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>等效加速度 a (10¹⁸ m/s²)</span>
                <span class="text-purple-300 font-bold">{{ state.effectiveAcceleration1e18 }}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                :value="state.effectiveAcceleration1e18"
                @input="onAccChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>壓縮度 (Squeezing dB)</span>
                <span class="text-fuchsia-300 font-bold">{{ state.squeezingFactorDb }} dB</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="20.0"
                step="0.5"
                :value="state.squeezingFactorDb"
                @input="onSqueezingChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">霍金-安魯輻射率:</span>
              <span class="text-amber-300 font-bold">{{ state.microwavePhotonRateMegaHz }} MHz</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">全息對偶半徑:</span>
              <span class="text-cyan-300 font-bold">{{ state.conformalRadiusNm }} nm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">雙模糾纏熵:</span>
              <span class="text-emerald-300 font-bold">{{ state.twoModeEntanglementEntropy }} ebits</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計探測光子暴:</span>
              <span class="text-white font-bold">{{ state.totalBurstsDetected }} 次</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="triggerBurst"
              class="flex-1 py-1.5 px-2 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-purple-900/40 text-xs"
            >
              <span>📡 採集微波光子對</span>
            </button>
            <button
              @click="toggleFluctuation"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoHorizonFluctuation
                  ? 'border-purple-500/80 bg-purple-950/40 text-purple-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoHorizonFluctuation ? '視界動態: 開' : '視界動態: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 光子暴探測歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">雙模壓縮微波光子探測事件隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.burstHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="b in state.burstHistory"
            :key="b.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-purple-300">頻率 {{ b.frequencyGhz }} GHz</span>
            <span class="text-fuchsia-400">壓縮 {{ b.squeezingDecibel }} dB</span>
            <span class="text-emerald-300">S_EE {{ b.conformalEntropy }}</span>
            <span class="text-amber-300">{{ b.coincidenceRateKhz }} kHz</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(b.timestamp) }}</span>
          </div>
          <div v-if="state.burstHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無微波光子對記錄，點擊上方按鈕觸發視界光子採集。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { hawkingUnruhDetectorEngine, HawkingUnruhRegime } from '@/engine/hawkingUnruhDetector';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(hawkingUnruhDetectorEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'analog_blackhole_event_horizon' as HawkingUnruhRegime, name: '超導模擬視界', desc: '超音速傳輸線黑洞模擬' },
  { id: 'unruh_accelerated_frame_squeezing' as HawkingUnruhRegime, name: '安魯加速壓縮', desc: '動態卡西米爾真空輻射' },
  { id: 'two_mode_squeezed_microwave' as HawkingUnruhRegime, name: '雙模糾纏微波', desc: 'TMSV 糾纏光子符合計數' },
  { id: 'holographic_ryu_takayanagi_boundary' as HawkingUnruhRegime, name: '全息邊界對偶', desc: 'AdS/CFT 視界糾纏幾何' },
];

function close() {
  uiStore.setHawkingUnruhOpen(false);
}

function selectRegime(r: HawkingUnruhRegime) {
  hawkingUnruhDetectorEngine.setRegime(r);
  state.value = hawkingUnruhDetectorEngine.getState();
}

function onAccChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  hawkingUnruhDetectorEngine.setAcceleration(val);
  state.value = hawkingUnruhDetectorEngine.getState();
}

function onSqueezingChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  hawkingUnruhDetectorEngine.setSqueezingDb(val);
  state.value = hawkingUnruhDetectorEngine.getState();
}

function toggleFluctuation() {
  hawkingUnruhDetectorEngine.toggleAutoFluctuation();
  state.value = hawkingUnruhDetectorEngine.getState();
}

function triggerBurst() {
  hawkingUnruhDetectorEngine.triggerPhotonBurst();
  state.value = hawkingUnruhDetectorEngine.getState();
  achievements.unlock('hawking_unruh_detector');
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

  ctx.fillStyle = '#060412';
  ctx.fillRect(0, 0, w, h);

  // 1. 左側：事件視界光錐與加速度雙曲線 (Rindler Horizon & Light Cone)
  const leftCenterX = 130;
  const leftCenterY = 140;

  // 光錐線
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftCenterX - 90, leftCenterY - 90);
  ctx.lineTo(leftCenterX + 90, leftCenterY + 90);
  ctx.moveTo(leftCenterX - 90, leftCenterY + 90);
  ctx.lineTo(leftCenterX + 90, leftCenterY - 90);
  ctx.stroke();

  // 均勻加速觀測者世界線 (Rindler 雙曲線)
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const accParam = 35 + state.value.effectiveAcceleration1e18 * 4;
  for (let tStep = -60; tStep <= 60; tStep += 2) {
    const xCoord = leftCenterX + Math.sqrt(accParam * accParam + tStep * tStep) - accParam + 20;
    const yCoord = leftCenterY - tStep;
    if (tStep === -60) ctx.moveTo(xCoord, yCoord);
    else ctx.lineTo(xCoord, yCoord);
  }
  ctx.stroke();

  // 視界黑洞黑體核心
  ctx.fillStyle = '#030108';
  ctx.beginPath();
  ctx.arc(leftCenterX, leftCenterY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 霍金熱輻射微波粒子發射 (自視界向外飛逸)
  const photonCount = 8;
  for (let i = 0; i < photonCount; i++) {
    const pPhase = (time * 1.5 + i / photonCount) % 1;
    const pDist = 24 + pPhase * 80;
    const pAngle = (i * Math.PI * 2) / photonCount + time * 0.3;
    const px = leftCenterX + Math.cos(pAngle) * pDist;
    const py = leftCenterY + Math.sin(pAngle) * pDist;

    ctx.fillStyle = 'rgba(244, 114, 182, ' + (1 - pPhase) + ')';
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. 右側：相空間 Wigner 雙模壓縮真空態旋轉橢圓 (Two-Mode Squeezed Vacuum Ellipse)
  const rightCenterX = 370;
  const rightCenterY = 140;

  // 相空間坐標軸
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rightCenterX - 100, rightCenterY);
  ctx.lineTo(rightCenterX + 100, rightCenterY);
  ctx.moveTo(rightCenterX, rightCenterY - 100);
  ctx.lineTo(rightCenterX, rightCenterY + 100);
  ctx.stroke();

  // 壓縮橢圓 (長軸拉伸、短軸壓縮至量子極限之下)
  const squeezeRatio = state.value.squeezingFactorDb / 5.0; // 壓縮比
  const majorRadius = 25 * Math.sqrt(squeezeRatio);
  const minorRadius = Math.max(5, 25 / Math.sqrt(squeezeRatio));
  const rotAngle = time * 0.8;

  ctx.save();
  ctx.translate(rightCenterX, rightCenterY);
  ctx.rotate(rotAngle);

  // 壓縮態熱圖輪廓 (三層等高線)
  [1.0, 0.65, 0.3].forEach((scale, idx) => {
    ctx.strokeStyle = idx === 0 ? '#e879f9' : idx === 1 ? '#a855f7' : '#6366f1';
    ctx.lineWidth = 2 - idx * 0.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, majorRadius * scale, minorRadius * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();

  // 標記文本
  ctx.fillStyle = '#d8b4fe';
  ctx.font = '10px monospace';
  ctx.fillText('加速視界 Rindler 座標', leftCenterX - 55, leftCenterY + 115);
  ctx.fillText('相空間 Wigner 壓縮態', rightCenterX - 55, rightCenterY + 115);
}

function loop() {
  hawkingUnruhDetectorEngine.update(0.016);
  state.value = hawkingUnruhDetectorEngine.getState();
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
