<template>
  <div v-if="uiStore.mode === 'moire-flatband'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-emerald-500/30 bg-emerald-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌀</span>
          <div>
            <h2 class="text-xl font-bold text-emerald-300 tracking-wider">
              拓撲莫爾超晶格平帶非常規超導反應堆
            </h2>
            <p class="text-xs text-emerald-400/70">
              Magic-Angle MATBG Moiré Superlattice · Quantum Metric Superfluidity · Correlated Mott Dome
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
        <!-- Canvas Visualizer -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 bg-slate-950/80 rounded-xl border border-emerald-500/20 p-4 flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-2 text-xs font-mono text-emerald-400">
              <span>雙層石墨烯莫爾超晶格干涉圖樣 (Moiré Interference Texture)</span>
              <span>θ = {{ state.twistAngleDeg.toFixed(2) }}° | LM = {{ state.moirePeriodNm.toFixed(1) }} nm</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-emerald-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> AA 堆垛局部極大 (亮核)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-700 inline-block"></span> AB/BA 伯納爾堆垛</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 超流渦旋核</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-emerald-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-900/60 pb-1">
              平帶強關聯遙測參數
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">平帶帶寬 W</span>
                <span class="text-emerald-300 font-semibold">{{ state.flatBandwidthMev.toFixed(2) }} meV</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">費米速度比 v_F*/v_F</span>
                <span class="text-cyan-300">{{ (state.fermiVelocityRatio * 100).toFixed(1) }} %</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">關聯強度 U/W</span>
                <span :class="state.coulombRatioUW > 3.0 ? 'text-amber-400 font-bold' : 'text-slate-300'">
                  {{ state.coulombRatioUW.toFixed(2) }}
                  <span v-if="state.coulombRatioUW > 3.0" class="text-[10px] text-amber-500">(強關聯)</span>
                </span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">超導能隙 Δ_SC</span>
                <span class="text-emerald-400 font-semibold">{{ state.superconductingGapMev.toFixed(3) }} meV</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">超導臨界溫度 T_c</span>
                <span class="text-purple-300">{{ state.criticalTempK.toFixed(2) }} K</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">量子幾何度規 Tr(g)</span>
                <span class="text-teal-300">{{ state.quantumMetricTrace.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">超流剛度 D_s</span>
                <span class="text-emerald-300 font-bold">{{ state.superfluidStiffness.toFixed(3) }}</span>
              </div>
            </div>

            <button
              @click="triggerSupercurrent"
              class="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              ⚡ 注入幾何超流脈衝 (Supercurrent)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-emerald-950">
          <!-- Twist Angle Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>旋轉扭角 θ</span>
              <span class="text-emerald-400 font-mono">{{ state.twistAngleDeg.toFixed(2) }}°</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="2.50"
              step="0.01"
              :value="state.twistAngleDeg"
              @input="onAngleChange"
              class="w-full accent-emerald-500 cursor-pointer"
            />
            <div class="flex gap-1 mt-1">
              <button
                @click="snapMagicAngle"
                class="px-2 py-0.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-[10px] rounded border border-emerald-700/50"
              >
                🎯 鎖定魔角 1.08°
              </button>
            </div>
          </div>

          <!-- Filling Factor Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>微觀填充數 ν</span>
              <span class="text-cyan-400 font-mono">{{ state.fillingFactor.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
              step="0.05"
              :value="state.fillingFactor"
              @input="onFillingChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <div class="flex gap-1 mt-1">
              <button
                @click="setFilling(-2.15)"
                class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] rounded"
              >
                ν = -2.15 (超導)
              </button>
              <button
                @click="setFilling(-2.0)"
                class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] rounded"
              >
                ν = -2 (莫特)
              </button>
            </div>
          </div>

          <!-- Temperature Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>晶格溫度 T</span>
              <span class="text-purple-400 font-mono">{{ state.temperatureKelvin.toFixed(2) }} K</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="10.0"
              step="0.05"
              :value="state.temperatureKelvin"
              @input="onTempChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">超導臨界溫度: {{ state.criticalTempK.toFixed(2) }} K</span>
          </div>

          <!-- Layer Coupling Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>層間耦合能 w0</span>
              <span class="text-teal-400 font-mono">{{ state.interlayerCouplingW0.toFixed(0) }} meV</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              step="1"
              :value="state.interlayerCouplingW0"
              @input="onCouplingChange"
              class="w-full accent-teal-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">AB/AA 弛豫調諧</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            強關聯拓撲運作體制 (Operating Regimes)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="reg in regimes"
              :key="reg.key"
              @click="selectRegime(reg.key)"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col justify-between',
                state.regime === reg.key
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-lg text-emerald-200'
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
  moireSuperconductorEngine,
  type MoireRegime,
  type MoireSuperconductorState
} from '../engine/moireFlatBandSuperconductor';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<MoireSuperconductorState>(moireSuperconductorEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const regimes: Array<{ key: MoireRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'unconventional-sc',
    title: '非常規超導圓頂態',
    icon: '⚡',
    desc: '在半填充莫爾超晶格微幅摻雜，庫珀對凝結於魔角平帶，超導能隙達到極大值。'
  },
  {
    key: 'mott-insulator',
    title: '莫特關聯絕緣相',
    icon: '🔒',
    desc: '整數填充數 ν = ±2 處庫侖能 U/W >> 1，電子自發局域化打開關聯莫特能隙。'
  },
  {
    key: 'valley-polarized',
    title: '自發谷極化陳絕緣態',
    icon: '🧭',
    desc: '時間反演自發破缺，谷簡併解除形成非零陳數 (Chern C ≠ 0) 反常霍爾態。'
  },
  {
    key: 'quantum-metric-sf',
    title: '量子度規超流剛度態',
    icon: '🌌',
    desc: '即便平帶費米速度近零，量子幾何度規 Fubini-Study 提供有限超流剛度。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onAngleChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  moireSuperconductorEngine.setTwistAngle(val);
  syncState();
}

function snapMagicAngle() {
  moireSuperconductorEngine.setTwistAngle(1.08);
  syncState();
}

function onFillingChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  moireSuperconductorEngine.setFillingFactor(val);
  syncState();
}

function setFilling(nu: number) {
  moireSuperconductorEngine.setFillingFactor(nu);
  syncState();
}

function onTempChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  moireSuperconductorEngine.setTemperature(val);
  syncState();
}

function onCouplingChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  moireSuperconductorEngine.setInterlayerCoupling(val);
  syncState();
}

function selectRegime(regime: MoireRegime) {
  moireSuperconductorEngine.setRegime(regime);
  syncState();
}

function triggerSupercurrent() {
  moireSuperconductorEngine.triggerSupercurrentPulse();
  achievements.unlock('moire_flatband_superconductor');
  syncState();
}

function syncState() {
  state.value = { ...moireSuperconductorEngine.getState() };
}

// 2D Canvas 視覺化繪製
function drawVisualizer() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  ctx.clearRect(0, 0, w, h);

  // 背景暗色星雲
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
  bgGrad.addColorStop(0, '#041611');
  bgGrad.addColorStop(1, '#010504');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  animPhase += 0.02;

  // 1. 繪製莫爾超晶格干涉圖樣 (左側 60% 寬度)
  const moireWidth = w * 0.65;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, moireWidth, h);
  ctx.clip();

  const angle = (state.value.twistAngleDeg * Math.PI) / 180;
  const periodPx = Math.max(12, Math.min(80, state.value.moirePeriodNm * 3.5));

  // 繪製六角網格乾涉點陣 (AA 亮斑與 AB/BA 背景)
  const cols = Math.ceil(moireWidth / periodPx) + 2;
  const rows = Math.ceil(h / (periodPx * 0.866)) + 2;

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const offsetX = (r % 2 === 0 ? 0 : periodPx * 0.5);
      const cx = c * periodPx + offsetX;
      const cy = r * periodPx * 0.866;

      // 旋轉動態漣漪
      const distCenter = Math.hypot(cx - moireWidth / 2, cy - h / 2);
      const pulse = Math.sin(distCenter * 0.05 - animPhase * 2) * 0.25;

      // AA 堆垛局部極大 (亮綠光環)
      const aaRadius = Math.max(4, periodPx * 0.28 * (1 + pulse));
      const aaGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, aaRadius);

      if (state.value.regime === 'unconventional-sc' && state.value.superconductingGapMev > 0) {
        aaGrad.addColorStop(0, 'rgba(52, 211, 153, 0.95)');
        aaGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.4)');
        aaGrad.addColorStop(1, 'rgba(6, 78, 59, 0)');
      } else if (state.value.regime === 'mott-insulator') {
        aaGrad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
        aaGrad.addColorStop(0.6, 'rgba(180, 83, 9, 0.3)');
        aaGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
      } else if (state.value.regime === 'valley-polarized') {
        aaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        aaGrad.addColorStop(0.6, 'rgba(2, 132, 199, 0.35)');
        aaGrad.addColorStop(1, 'rgba(12, 74, 110, 0)');
      } else {
        aaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
        aaGrad.addColorStop(0.6, 'rgba(126, 34, 206, 0.35)');
        aaGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
      }

      ctx.fillStyle = aaGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, aaRadius, 0, Math.PI * 2);
      ctx.fill();

      // 微觀六角鍵線條 (代表底層石墨烯蜂窩晶格)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const thetaK = (k * Math.PI) / 3 + angle;
        const x1 = cx + Math.cos(thetaK) * (periodPx * 0.45);
        const y1 = cy + Math.sin(thetaK) * (periodPx * 0.45);
        if (k === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // 超流渦旋線粒子 (若在超導態)
  if (state.value.superconductingGapMev > 0) {
    const numVortices = Math.floor(state.value.superfluidStiffness * 4);
    for (let v = 0; v < numVortices; v++) {
      const vx = moireWidth / 2 + Math.cos(animPhase + v * 1.5) * (70 + v * 25);
      const vy = h / 2 + Math.sin(animPhase + v * 1.5) * (40 + v * 15);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(vx, vy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  ctx.restore();

  // 2. 右側面板：布里淵區平帶能譜及超導圓頂曲線 (右側 35% 寬度)
  const specX = moireWidth + 10;
  const specW = w - specX - 10;
  ctx.save();
  ctx.fillStyle = 'rgba(10, 25, 20, 0.7)';
  ctx.fillRect(specX, 10, specW, h - 20);
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
  ctx.strokeRect(specX, 10, specW, h - 20);

  // 標題
  ctx.font = '10px monospace';
  ctx.fillStyle = '#34d399';
  ctx.fillText('超導圓頂 SC Dome Δ(ν)', specX + 10, 26);

  // 繪製超導圓頂曲線 (橫軸填充數 ν: -4 ~ +4, 縱軸能隙 Δ_SC)
  const domeBaseY = 160;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.beginPath();
  ctx.moveTo(specX + 10, domeBaseY);
  ctx.lineTo(specX + specW - 10, domeBaseY);
  ctx.stroke();

  // 繪製雙圓頂 (以 ν = -2 和 +2 附近為峰值)
  ctx.beginPath();
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2;
  for (let px = 0; px < specW - 20; px++) {
    const nu = -4 + (px / (specW - 20)) * 8;
    const d1 = Math.abs(nu - (-2.15));
    const d2 = Math.abs(nu - 2.2);
    const amp = Math.max(0, 1 - Math.min(d1, d2) / 0.85);
    const gapVal = amp * (state.value.criticalTempK * 0.28);
    const plotY = domeBaseY - gapVal * 35;
    const plotX = specX + 10 + px;
    if (px === 0) ctx.moveTo(plotX, plotY);
    else ctx.lineTo(plotX, plotY);
  }
  ctx.stroke();

  // 標記當前填充數垂直游標
  const currentCursorPx = specX + 10 + ((state.value.fillingFactor + 4) / 8) * (specW - 20);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(currentCursorPx, 35);
  ctx.lineTo(currentCursorPx, domeBaseY + 15);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#f43f5e';
  ctx.font = '9px monospace';
  ctx.fillText(`ν=${state.value.fillingFactor.toFixed(2)}`, currentCursorPx - 15, domeBaseY + 28);

  // 下半部：平帶態密度 D(E) (DOS Peak)
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('平帶態密度 DOS D(E)', specX + 10, domeBaseY + 46);

  const dosBaseY = h - 25;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let px = 0; px < specW - 20; px++) {
    const energy = -20 + (px / (specW - 20)) * 40;
    // 凡是平帶帶寬越窄，DOS 峰越高
    const bandwidth = Math.max(3.0, state.value.flatBandwidthMev);
    const dos = 50 * Math.exp(-Math.pow(energy / bandwidth, 2));
    const plotX = specX + 10 + px;
    const plotY = dosBaseY - dos;
    if (px === 0) ctx.moveTo(plotX, plotY);
    else ctx.lineTo(plotX, plotY);
  }
  ctx.stroke();

  ctx.restore();
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
