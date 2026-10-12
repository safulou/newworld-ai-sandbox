<template>
  <div v-if="uiStore.mode === 'gw-spin-memory'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-cyan-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌀</span>
          <div>
            <h2 class="text-xl font-bold text-cyan-300 tracking-wider">
              引力波自旋記憶與天球角動量流干涉網
            </h2>
            <p class="text-xs text-cyan-400/70">
              Gravitational Spin Memory · Subleading Soft Gravitons · BMS Superrotations Diff(S²) · Sagnac Curl Delay
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
          <div class="lg:col-span-8 bg-slate-950/80 rounded-xl border border-cyan-500/20 p-4 flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-2 text-xs font-mono text-cyan-400">
              <span>測試探針環天球角動量旋度場 (Spin Memory Velocity Curl & Sagnac Ring)</span>
              <span>Δv = {{ state.spinMemoryVelocityNmS.toFixed(2) }} nm/s | Δτ = {{ state.rotationalTimeDelayAs.toFixed(0) }} as</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-cyan-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> 永久切向旋度速度向量 (Curl v)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> 天球 BMS 超旋轉流線</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 雙黑洞自旋進動軸</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-cyan-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-900/60 pb-1">
              角動量通量與自旋記憶遙測
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">自旋速度躍遷 Δv_spin</span>
                <span class="text-cyan-300 font-semibold">{{ state.spinMemoryVelocityNmS.toFixed(3) }} nm/s</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">Sagnac 旋轉時間延遲</span>
                <span class="text-amber-300 font-bold">{{ state.rotationalTimeDelayAs.toFixed(1) }} as</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">輻射角動量比例 ΔJ/J</span>
                <span class="text-purple-400 font-semibold">{{ state.radiatedAngularMomentumPct.toFixed(1) }} %</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">BMS 超旋轉荷 Q_Y</span>
                <span class="text-emerald-400">{{ state.bmsSuperrotationCharge.toFixed(2) }} a.u.</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">天球速度場旋度 ∇×v</span>
                <span class="text-rose-400">{{ state.celestialVorticityCurl.toFixed(2) }} × 10⁻¹⁸ s⁻¹</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">克爾自旋參數 a/M</span>
                <span class="text-slate-300">{{ state.kerrSpinParameterChi.toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="triggerBurst"
              class="w-full py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              🌪️ 觸發克爾黑洞自旋併合暴 (Spin Burst)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-cyan-950">
          <!-- Kerr Spin Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>克爾自旋 a/M</span>
              <span class="text-cyan-400 font-mono">{{ state.kerrSpinParameterChi.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.01"
              :value="state.kerrSpinParameterChi"
              @input="onSpinChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">黑洞極限轉動</span>
          </div>

          <!-- Total Mass Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>雙星總質量 M</span>
              <span class="text-purple-400 font-mono">{{ state.totalMassSolar.toFixed(0) }} M☉</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              :value="state.totalMassSolar"
              @input="onMassChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">重力源規模</span>
          </div>

          <!-- Distance Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>源距離 r</span>
              <span class="text-amber-400 font-mono">{{ state.sourceDistanceMpc.toFixed(0) }} Mpc</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              :value="state.sourceDistanceMpc"
              @input="onDistanceChange"
              class="w-full accent-amber-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">宇宙學光度距離</span>
          </div>

          <!-- Misalignment Angle Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>自旋傾角 θ_spin</span>
              <span class="text-rose-400 font-mono">{{ state.misalignmentAngleDeg.toFixed(0) }}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              :value="state.misalignmentAngleDeg"
              @input="onAngleChange"
              class="w-full accent-rose-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">自旋進動不對稱軸</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            自旋記憶機制體制 (Spin Regimes)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="reg in regimes"
              :key="reg.key"
              @click="selectRegime(reg.key)"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col justify-between',
                state.regime === reg.key
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-lg text-cyan-200'
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
  gwSpinMemoryEngine,
  type GWSpinRegime,
  type GWSpinMemoryState
} from '../engine/gravitationalSpinMemory';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<GWSpinMemoryState>(gwSpinMemoryEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const regimes: Array<{ key: GWSpinRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'kerr-spin-orbit',
    title: '克爾自旋軌道記憶相',
    icon: '🌪️',
    desc: '進動克爾黑洞強角動量輻射通量，驅動測試粒子產生不可逆的軌道旋轉速度微踢。'
  },
  {
    key: 'bms-superrotation',
    title: 'BMS 天球超旋轉相',
    icon: '📐',
    desc: '天球共形 Killing 向量場產生微局部坐標剪切，映射無窮維 Virasoro 超旋轉荷。'
  },
  {
    key: 'subleading-soft-graviton',
    title: '次領頭軟引力子相',
    icon: '⚛️',
    desc: '對偶於次領頭階紅外軟引力子極點，保存角動量量子數於黑洞視界幾何。'
  },
  {
    key: 'pulsar-timing-curl',
    title: '脈衝星計時旋度相',
    icon: '⏱️',
    desc: '星際脈衝星計時陣列殘餘殘差呈現非零旋度 Curl 模式，產生永久 Sagnac 時間漂移。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onSpinChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwSpinMemoryEngine.setKerrSpin(val);
  syncState();
}

function onMassChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwSpinMemoryEngine.setTotalMass(val);
  syncState();
}

function onDistanceChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwSpinMemoryEngine.setDistance(val);
  syncState();
}

function onAngleChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwSpinMemoryEngine.setMisalignmentAngle(val);
  syncState();
}

function selectRegime(regime: GWSpinRegime) {
  gwSpinMemoryEngine.setRegime(regime);
  syncState();
}

function triggerBurst() {
  gwSpinMemoryEngine.triggerSpinBurst();
  achievements.unlock('gravitational_spin_memory');
  syncState();
}

function syncState() {
  state.value = { ...gwSpinMemoryEngine.getState() };
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
  bgGrad.addColorStop(0, '#041620');
  bgGrad.addColorStop(1, '#010508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  animPhase += 0.03;

  // 1. 左側：環形測試探針旋度速度向量場 (Curl Velocity Vectors)
  const ringX = w * 0.32;
  const ringY = h * 0.5;
  const ringRadius = 85;
  const numParticles = 20;

  // 繪製初始環
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.beginPath();
  ctx.arc(ringX, ringY, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 繪製自旋速度切向向量
  const vScale = Math.min(22, state.value.spinMemoryVelocityNmS * 3.5);
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2 + animPhase * 0.5;
    const px = ringX + Math.cos(angle) * ringRadius;
    const py = ringY + Math.sin(angle) * ringRadius;

    // 粒子點
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 切向速度箭頭 (逆時針方向 \nabla \times v)
    const tangAngle = angle + Math.PI / 2;
    const arrowLen = 12 + vScale;
    const tx = px + Math.cos(tangAngle) * arrowLen;
    const ty = py + Math.sin(tangAngle) * arrowLen;

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // 箭頭翼
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(tx, ty, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 中心標記與旋度渦心
  ctx.fillStyle = '#22d3ee';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('速度旋度場 ∇×v', ringX, ringY - 8);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`+${state.value.celestialVorticityCurl.toFixed(2)} × 10⁻¹⁸`, ringX, ringY + 12);

  // 2. 右側：天球 BMS 超旋轉流線與 Sagnac 時間差
  const rightX = w * 0.62;
  const rightW = w - rightX - 12;
  const panelY = 16;
  const panelH = h - 32;

  ctx.fillStyle = 'rgba(5, 20, 30, 0.7)';
  ctx.fillRect(rightX, panelY, rightW, panelH);
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
  ctx.strokeRect(rightX, panelY, rightW, panelH);

  ctx.textAlign = 'left';
  ctx.font = '10px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('天球超旋轉流線 (BMS Superrotations)', rightX + 10, panelY + 18);

  // 繪製天球雙極角動量流線
  const sphereMidX = rightX + rightW / 2;
  const sphereMidY = panelY + 95;
  const sphereR = 48;

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.beginPath();
  ctx.arc(sphereMidX, sphereMidY, sphereR, 0, Math.PI * 2);
  ctx.stroke();

  // 繪製流線 (剪切雙曲)
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.2;
  for (let s = -2; s <= 2; s++) {
    const yOff = s * 14;
    ctx.beginPath();
    ctx.moveTo(sphereMidX - 40, sphereMidY + yOff + Math.sin(animPhase + s) * 4);
    ctx.bezierCurveTo(
      sphereMidX - 10, sphereMidY + yOff * 0.4,
      sphereMidX + 10, sphereMidY + yOff * 0.4,
      sphereMidX + 40, sphereMidY + yOff - Math.sin(animPhase + s) * 4
    );
    ctx.stroke();
  }

  // 下半部：Sagnac 旋轉時間差量表
  const sagnacY = panelY + 180;
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`Sagnac 旋轉時間差 Δτ: ${state.value.rotationalTimeDelayAs.toFixed(0)} as`, rightX + 10, sagnacY);

  const barY = sagnacY + 10;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(rightX + 10, barY, rightW - 20, 16);
  const barWidth = Math.min(rightW - 20, (state.value.rotationalTimeDelayAs / 350) * (rightW - 20));
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(rightX + 10, barY, barWidth, 16);

  ctx.fillStyle = '#fff';
  ctx.fillText(`${state.value.rotationalTimeDelayAs.toFixed(1)} 阿秒`, rightX + 15, barY + 12);
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
