<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌌</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              太初原初引力波隨機背景干涉儀
            </h2>
            <p class="text-xs text-indigo-400/80 font-mono">
              Primordial Gravitational Wave SGWB • 暴脹張量微擾 r = T/S ⊗ 赫林斯-唐斯幾何交叉關聯 μ(θ)
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

      <!-- 4 大隨機引力波背景體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-indigo-950/60 border-indigo-400 shadow-md shadow-indigo-900/40 text-indigo-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-indigo-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-indigo-400/70 mt-2 px-1">
            <span>三衛星激光干涉臂幾何與 TDI 時空相位消除條紋</span>
            <span>靈敏度 SNR: {{ state.detectorSensitivitySnr.toFixed(1) }} (μ(60°): {{ state.hellingsDownsCorrelation }})</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-indigo-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>原初張量能譜監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200">
              臂長: {{ state.interferometerArmLengthGm }} Gm
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>張量標量比 r</span>
                <span class="text-indigo-300 font-bold">{{ state.tensorToScalarRatioR }}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.050"
                step="0.001"
                :value="state.tensorToScalarRatioR"
                @input="onRatioChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>干涉臂長 (Gm)</span>
                <span class="text-purple-300 font-bold">{{ state.interferometerArmLengthGm }} Gm</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                :value="state.interferometerArmLengthGm"
                @input="onArmChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">能量密度 h²Ω_gw:</span>
              <span class="text-pink-300 font-bold">{{ state.omegaGWScale }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">萃取能量:</span>
              <span class="text-indigo-300 font-bold">{{ state.totalEnergyHarvestedEv.toFixed(1) }} eV</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">捕獲波包計數:</span>
              <span class="text-slate-200">{{ state.detectedPacketsCount }} 個</span>
            </div>
          </div>

          <!-- 操作按鈕列 -->
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-700">
            <button
              @click="capturePacket"
              class="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-bold text-white shadow-md shadow-indigo-900/40 transition active:scale-[0.98]"
            >
              📡 捕獲原初張量引力波包
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="calibrate"
                class="py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 text-center transition"
              >
                🔭 TDI 相位校準
              </button>
              <button
                @click="toggleTracking"
                :class="[
                  'py-1.5 rounded-lg text-center font-bold transition',
                  state.autoCorrelationTracking
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-500/50'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                ]"
              >
                {{ state.autoCorrelationTracking ? '自動關聯: ON' : '自動關聯: OFF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 引力波歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
        <h3 class="text-xs font-bold text-indigo-300 flex items-center justify-between">
          <span>深空隨機背景引力波包偵測隊列</span>
          <span class="text-[11px] text-slate-500">最近 20 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          <div
            v-for="entry in state.waveHistory"
            :key="entry.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 text-slate-300"
          >
            <span class="text-indigo-400 font-bold">中心頻率 {{ (entry.centralFrequencyHz * 1000).toFixed(1) }} mHz</span>
            <span class="text-purple-300">應變 h: {{ entry.strainAmplitudeH }}</span>
            <span class="text-pink-300">偏振: {{ entry.tensorPolarization }}</span>
            <span class="text-slate-400">SNR: {{ entry.crossCorrelationSnr }}</span>
            <span class="text-[10px] text-slate-500">{{ new Date(entry.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div v-if="state.waveHistory.length === 0" class="text-center text-slate-600 py-3">
            尚無深空原初引力波捕獲紀錄，點擊按鈕執行 TDI 空間天線干涉測繪
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { 
  primordialGWEngine, 
  SGWBRegime, 
  PrimordialGWState 
} from '@/engine/primordialGravitationalWave';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref<PrimordialGWState>(primordialGWEngine.getState());

let animId: number | null = null;
let animPhase = 0;

const regimes: { id: SGWBRegime; name: string; desc: string }[] = [
  { id: 'slow_roll_inflation_tensor', name: '慢滾暴脹張量', desc: '太初量子真空張量微擾' },
  { id: 'first_order_electroweak_pt', name: '電弱一階相變', desc: '真真空氣泡超音速碰撞' },
  { id: 'primordial_black_hole_merger', name: '太初黑洞併合', desc: '微黑洞群旋進引力波峰' },
  { id: 'cosmic_string_loop_kinks', name: '宇宙弦迴路扭結', desc: '超高頻尖端隨機重力微爆' }
];

function close() {
  uiStore.closeOverlay();
}

function selectRegime(regime: SGWBRegime) {
  primordialGWEngine.setRegime(regime);
  updateState();
}

function onRatioChange(e: Event) {
  const target = e.target as HTMLInputElement;
  primordialGWEngine.setTensorRatioR(parseFloat(target.value));
  updateState();
}

function onArmChange(e: Event) {
  const target = e.target as HTMLInputElement;
  primordialGWEngine.setArmLengthGm(parseFloat(target.value));
  updateState();
}

function capturePacket() {
  primordialGWEngine.captureStrainPacket();
  updateState();
}

function calibrate() {
  primordialGWEngine.calibrateInterferometer();
  updateState();
}

function toggleTracking() {
  primordialGWEngine.setAutoTracking(!state.value.autoCorrelationTracking);
  updateState();
}

function updateState() {
  state.value = primordialGWEngine.getState();
}

function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  animPhase += 0.035;

  const cx = w / 2;
  const cy = h / 2;

  // 1. 三芒星星座衛星座標 (Equilateral Triangle Constellation)
  const armLen = 78 + state.value.interferometerArmLengthGm * 14;
  const sat1 = { x: cx, y: cy - armLen };
  const sat2 = { x: cx - armLen * Math.cos(Math.PI / 6), y: cy + armLen * Math.sin(Math.PI / 6) };
  const sat3 = { x: cx + armLen * Math.cos(Math.PI / 6), y: cy + armLen * Math.sin(Math.PI / 6) };

  // 2. 雙向激光干涉光束 (Laser Links with Phase Oscillations)
  const links = [[sat1, sat2], [sat2, sat3], [sat3, sat1]];

  ctx.save();
  links.forEach(([p1, p2], idx) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = idx === 0 ? 'rgba(99, 102, 241, 0.45)' : idx === 1 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(236, 72, 153, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 沿光路流動的光子脈衝
    const linkProg = (animPhase * 1.5 + idx * 0.33) % 1.0;
    const px = p1.x + (p2.x - p1.x) * linkProg;
    const py = p1.y + (p2.y - p1.y) * linkProg;

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 8;
    ctx.fill();
  });
  ctx.restore();

  // 3. 衛星節點與無拖曳檢驗質量 (Drag-Free Test Masses)
  const sats = [sat1, sat2, sat3];
  ctx.save();
  sats.forEach((s, idx) => {
    // 衛星外環
    ctx.beginPath();
    ctx.arc(s.x, s.y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 懸浮檢驗立方體/質量核
    const jitterX = Math.sin(animPhase * 2 + idx) * 1.5;
    const jitterY = Math.cos(animPhase * 2 + idx) * 1.5;
    ctx.beginPath();
    ctx.arc(s.x + jitterX, s.y + jitterY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 6;
    ctx.fill();
  });
  ctx.restore();

  // 4. TDI 時空相位幾何波紋 (Lissajous Interference Pattern in Center)
  ctx.save();
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    const lx = cx + Math.sin(t * 3 + animPhase) * 28;
    const ly = cy + Math.sin(t * 2) * 28;
    if (t === 0) ctx.moveTo(lx, ly);
    else ctx.lineTo(lx, ly);
  }
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 5. 右上角能譜密度指示
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 1;
  ctx.strokeRect(w - 180, 16, 164, 42);
  ctx.fillRect(w - 180, 16, 164, 42);

  ctx.fillStyle = '#a5b4fc';
  ctx.font = '10px monospace';
  ctx.fillText(`SGWB 能譜密度`, w - 172, 32);
  ctx.fillStyle = '#f472b6';
  ctx.fillText(`h²Ω_gw: ${state.value.omegaGWScale}`, w - 172, 48);
  ctx.restore();
}

function loop() {
  drawCanvas();
  animId = requestAnimationFrame(loop);
}

onMounted(() => {
  loop();
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
});
</script>
