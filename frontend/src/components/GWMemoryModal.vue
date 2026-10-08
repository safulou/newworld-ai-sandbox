<template>
  <div v-if="uiStore.mode === 'gw-memory'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-amber-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌌</span>
          <div>
            <h2 class="text-xl font-bold text-amber-300 tracking-wider">
              時空引力波記憶效應天線矩陣
            </h2>
            <p class="text-xs text-amber-400/70">
              Christodoulou Non-Linear Memory · BMS Supertranslations · Soft Graviton Vacuum Hair
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
          <div class="lg:col-span-8 bg-slate-950/80 rounded-xl border border-amber-500/20 p-4 flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-2 text-xs font-mono text-amber-400">
              <span>自由測試質量陣列永久度規應變殘餘 (Permanent Metric Strain Ring)</span>
              <span>相: {{ (state.mergerPhase * 100).toFixed(0) }}% | ΔL = {{ state.testMassDisplacementPm.toFixed(2) }} pm</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-amber-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> 瞬態引力波四極振盪 h+(t)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 永久直流記憶應變 Δh_mem</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> BMS 軟毛天球展開</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-amber-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-amber-900/60 pb-1">
              度規記憶與 BMS 遙測
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">永久記憶應變 Δh_mem</span>
                <span class="text-amber-300 font-semibold">{{ state.memoryStrainH.toExponential(3) }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">振盪峰值應變 h_peak</span>
                <span class="text-cyan-300">{{ state.oscillatoryPeakH.toExponential(3) }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">4km 臂測試質量位移 ΔL</span>
                <span class="text-amber-400 font-bold">{{ state.testMassDisplacementPm.toFixed(3) }} pm</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">BMS 超平移荷 Q_α</span>
                <span class="text-purple-300">{{ state.bmsSupertranslationCharge.toFixed(2) }} a.u.</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">軟引力子紅外量子密度</span>
                <span class="text-teal-300">{{ state.softGravitonDensity.toFixed(2) }} a.u.</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">輻射能量損失 E_rad</span>
                <span class="text-rose-400">{{ (state.totalMassSolar * (state.radiatedEnergyPct / 100)).toFixed(1) }} M☉</span>
              </div>
            </div>

            <button
              @click="triggerMerger"
              class="w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              💥 觸發雙黑洞併合引力波暴 (Merger Burst)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-amber-950">
          <!-- Distance Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>天體距離 r</span>
              <span class="text-amber-400 font-mono">{{ state.sourceDistanceMpc.toFixed(0) }} Mpc</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              :value="state.sourceDistanceMpc"
              @input="onDistanceChange"
              class="w-full accent-amber-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">紅移 z ≈ {{ (state.sourceDistanceMpc / 4200).toFixed(3) }}</span>
          </div>

          <!-- Total Mass Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>雙星總質量 M</span>
              <span class="text-cyan-400 font-mono">{{ state.totalMassSolar.toFixed(0) }} M☉</span>
            </div>
            <input
              type="range"
              min="15"
              max="200"
              step="5"
              :value="state.totalMassSolar"
              @input="onMassChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">黑洞質量等級</span>
          </div>

          <!-- Mass Ratio Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>質量比 q = m1/m2</span>
              <span class="text-purple-400 font-mono">{{ state.massRatioQ.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.1"
              :value="state.massRatioQ"
              @input="onRatioChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">非對稱質量併合</span>
          </div>

          <!-- Radiated Energy Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>輻射損失率 E_rad</span>
              <span class="text-rose-400 font-mono">{{ state.radiatedEnergyPct.toFixed(1) }} %</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="9.0"
              step="0.2"
              :value="state.radiatedEnergyPct"
              @input="onRadiatedChange"
              class="w-full accent-rose-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">轉換為重力波能量</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            引力波記憶機制體制 (Memory Regimes)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="reg in regimes"
              :key="reg.key"
              @click="selectRegime(reg.key)"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col justify-between',
                state.regime === reg.key
                  ? 'bg-amber-950/60 border-amber-400 shadow-lg text-amber-200'
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
  gwMemoryEngine,
  type GWMemoryRegime,
  type GWMemoryState
} from '../engine/gravitationalWaveMemory';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<GWMemoryState>(gwMemoryEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let visualPhase = 0;

const regimes: Array<{ key: GWMemoryRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'christodoulou-nonlinear',
    title: '非線性重力記憶相',
    icon: '🌀',
    desc: '發射之引力波能量通量自身產生二次引力效應，引發不可逆之永久時空應變階躍。'
  },
  {
    key: 'linear-supernova',
    title: '天體非對稱噴流相',
    icon: '💥',
    desc: '超新星爆發非對稱中微子噴流引致物質四極矩二階導數永久改變。'
  },
  {
    key: 'bms-supertranslation',
    title: 'BMS 漸近超平移相',
    icon: '📐',
    desc: '無窮遠光錐邊界 I+ 上的無窮維 BMS 超平移對稱性，真空間之幾何幾何跳躍。'
  },
  {
    key: 'soft-graviton-vacuum',
    title: '軟引力子量子態相',
    icon: '⚛️',
    desc: 'Weinberg 軟引力子紅外量子穿戴，黑洞視界軟毛攜帶全息量子資訊。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onDistanceChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwMemoryEngine.setDistance(val);
  syncState();
}

function onMassChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwMemoryEngine.setTotalMass(val);
  syncState();
}

function onRatioChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwMemoryEngine.setMassRatio(val);
  syncState();
}

function onRadiatedChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  gwMemoryEngine.setRadiatedEnergy(val);
  syncState();
}

function selectRegime(regime: GWMemoryRegime) {
  gwMemoryEngine.setRegime(regime);
  syncState();
}

function triggerMerger() {
  gwMemoryEngine.triggerMergerBurst();
  achievements.unlock('gravitational_wave_memory');
  syncState();
}

function syncState() {
  state.value = { ...gwMemoryEngine.getState() };
}

function drawVisualizer() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  ctx.clearRect(0, 0, w, h);

  // 背景暗黑空域
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
  bgGrad.addColorStop(0, '#120c02');
  bgGrad.addColorStop(1, '#050300');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  visualPhase += 0.03;

  // 1. 左側：環形自由測試質量陣列 (Test Mass Array Ring)
  const ringCenterX = w * 0.32;
  const ringCenterY = h / 2;
  const ringRadius = 90;

  // 測試粒子數
  const numParticles = 24;

  // 根據當前 mergerPhase 計算應變：
  // 瞬態振盪應變 + 永久記憶偏置應變
  const phase = state.value.mergerPhase;
  let dynamicOsc = 0;
  let dcOffset = 0;

  if (phase > 0 && phase < 0.75) {
    const f = 15 + 40 * Math.pow(phase / 0.75, 2);
    dynamicOsc = Math.sin(visualPhase * f) * (phase / 0.75) * 22;
  }
  if (phase > 0.4) {
    const memProgress = Math.min(1.0, (phase - 0.4) / 0.4);
    dcOffset = memProgress * (state.value.testMassDisplacementPm * 15);
  } else {
    dcOffset = state.value.testMassDisplacementPm * 10;
  }

  // 繪製未受微擾的初始圓形虛線
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 繪製應變形變後的測試粒子
  ctx.beginPath();
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2;
    // 四極形變 h_+: x 軸拉伸，y 軸壓縮 (cos 2*angle)
    const quadFactor = Math.cos(2 * angle);
    const rCurrent = ringRadius + quadFactor * (dynamicOsc + dcOffset);
    const px = ringCenterX + Math.cos(angle) * rCurrent;
    const py = ringCenterY + Math.sin(angle) * rCurrent;

    // 粒子點
    ctx.fillStyle = dcOffset > 0.5 ? '#f59e0b' : '#38bdf8';
    ctx.shadowColor = dcOffset > 0.5 ? '#d97706' : '#0284c7';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 連結連線
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 中心標記與文字
  ctx.fillStyle = '#f59e0b';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('測試探針環 (L=4km)', ringCenterX, ringCenterY - 10);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`ΔL_mem: +${dcOffset.toFixed(1)} a.u.`, ringCenterX, ringCenterY + 12);

  // 2. 右側面板：應變波形圖 (h+(t) 振盪 + 永久直流階躍 Δh_mem)
  const waveX = w * 0.62;
  const waveW = w - waveX - 16;
  const waveY = 20;
  const waveH = h - 40;

  ctx.fillStyle = 'rgba(15, 10, 5, 0.7)';
  ctx.fillRect(waveX, waveY, waveW, waveH);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.strokeRect(waveX, waveY, waveW, waveH);

  // 坐標軸
  const midY = waveY + waveH / 2;
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
  ctx.beginPath();
  ctx.moveTo(waveX, midY);
  ctx.lineTo(waveX + waveW, midY);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = '10px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('瞬態四極振盪 h+(t)', waveX + 10, waveY + 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('永久記憶階躍 Δh_mem', waveX + 10, waveY + 32);

  // 繪製波形曲線 (取自 waveformHistory 或動態投影)
  const history = state.value.waveformHistory;
  if (history.length > 2) {
    // 瞬態振盪 (藍色)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const px = waveX + 10 + (idx / (history.length - 1)) * (waveW - 20);
      const py = midY - (pt.oscillatoryStrain / 1e-21) * 35;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // 永久記憶直流階躍 (金色高亮)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const px = waveX + 10 + (idx / (history.length - 1)) * (waveW - 20);
      const py = midY - (pt.dcMemoryStrain / 1e-22) * 25;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  } else {
    // 靜態展示典型階躍
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    for (let i = 0; i < waveW - 20; i++) {
      const t = i / (waveW - 20);
      const osc = t < 0.7 ? Math.sin(t * 35) * Math.pow(t, 2) * 30 : Math.sin(t * 50) * Math.exp(-(t - 0.7) * 15) * 30;
      const px = waveX + 10 + i;
      const py = midY - osc;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < waveW - 20; i++) {
      const t = i / (waveW - 20);
      const step = 1 / (1 + Math.exp(-(t - 0.7) * 20));
      const px = waveX + 10 + i;
      const py = midY - step * 25;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
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
