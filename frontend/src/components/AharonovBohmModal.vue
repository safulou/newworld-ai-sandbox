<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🧲</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              阿哈羅諾夫-玻姆幾何相位超導環陣列
            </h2>
            <p class="text-xs text-emerald-400/80 font-mono">
              Aharonov-Bohm Ring Array • 電子波拓撲幾何相位 Δγ = 2π(Φ/Φ₀) ⊗ 介觀持續電流 I = -∂E/∂Φ
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

      <!-- 4 大幾何相位干涉體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-900/40 text-emerald-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-emerald-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-emerald-400/70 mt-2 px-1">
            <span>超導奈米環電磁向量勢 A 與持續無耗散超導超流環</span>
            <span>幾何相位: {{ state.geometricPhaseRad.toFixed(3) }} rad (對比度 {{ state.interferenceVisibilityPercent.toFixed(1) }}%)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-emerald-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>量子干涉儀表監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200">
              半徑: {{ state.ringRadiusNm }} nm
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>磁通量子比 Φ / Φ_0</span>
                <span class="text-emerald-300 font-bold">{{ state.magneticFluxRatio }}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.05"
                :value="state.magneticFluxRatio"
                @input="onFluxChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>超導環半徑 (nm)</span>
                <span class="text-teal-300 font-bold">{{ state.ringRadiusNm }} nm</span>
              </div>
              <input
                type="range"
                min="50.0"
                max="500.0"
                step="5.0"
                :value="state.ringRadiusNm"
                @input="onRadiusChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">持續電流 I:</span>
              <span class="text-amber-300 font-bold">{{ state.persistentCurrentMicroAmp }} μA</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">相干長度 L_φ:</span>
              <span class="text-emerald-300 font-bold">{{ state.phaseCoherenceLengthUm }} μm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累積能量通量:</span>
              <span class="text-slate-200">{{ state.persistentEnergyFlux.toFixed(1) }} pJ</span>
            </div>
          </div>

          <!-- 操作按鈕列 -->
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-700">
            <button
              @click="sampleInterference"
              class="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg font-bold text-white shadow-md shadow-emerald-900/40 transition active:scale-[0.98]"
            >
              ⚡ 採樣持續超導量子干涉
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="lockOptimumFlux"
                class="py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 text-center transition"
              >
                🔒 鎖定 0.25Φ₀ 極值
              </button>
              <button
                @click="toggleModulation"
                :class="[
                  'py-1.5 rounded-lg text-center font-bold transition',
                  state.autoFluxModulation
                    ? 'bg-teal-900/60 text-teal-300 border border-teal-500/50'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                ]"
              >
                {{ state.autoFluxModulation ? '自動調變: ON' : '自動調變: OFF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 持續電流歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
        <h3 class="text-xs font-bold text-emerald-300 flex items-center justify-between">
          <span>介觀超導環持續電流與拓撲幾何相位日誌</span>
          <span class="text-[11px] text-slate-500">最近 20 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          <div
            v-for="entry in state.currentHistory"
            :key="entry.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 text-slate-300"
          >
            <span class="text-emerald-400 font-bold">磁通 {{ entry.fluxRatio }} Φ₀</span>
            <span class="text-amber-300">電流: {{ entry.currentMicroAmp }} μA</span>
            <span class="text-teal-300">相位: {{ entry.geometricPhaseRad }} rad</span>
            <span class="text-slate-400">對比度: {{ (entry.interferenceVisibility * 100).toFixed(0) }}%</span>
            <span class="text-[10px] text-slate-500">{{ new Date(entry.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div v-if="state.currentHistory.length === 0" class="text-center text-slate-600 py-3">
            尚無持續電流採樣紀錄，點擊按鈕測量超導環路無耗散量子流
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
  aharonovBohmEngine, 
  ABRegime, 
  AharonovBohmState 
} from '@/engine/aharonovBohmRing';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref<AharonovBohmState>(aharonovBohmEngine.getState());

let animId: number | null = null;
let animPhase = 0;

const regimes: { id: ABRegime; name: string; desc: string }[] = [
  { id: 'fractional_flux_persistent_current', name: '分數磁通超流', desc: '分數磁通持續無耗散電流' },
  { id: 'aharonov_casher_spin_topological', name: '自旋幾何相位', desc: '阿哈羅諾夫-卡舍爾電場自旋' },
  { id: 'mesoscopic_quantum_ring_multipath', name: '多臂路徑干涉', desc: '多路徑相干波函數疊加' },
  { id: 'topological_flux_qubit_coherence', name: '磁通量子相干', desc: '拓撲自旋鎖定超導位元' }
];

function close() {
  uiStore.closeOverlay();
}

function selectRegime(regime: ABRegime) {
  aharonovBohmEngine.setRegime(regime);
  updateState();
}

function onFluxChange(e: Event) {
  const target = e.target as HTMLInputElement;
  aharonovBohmEngine.setFluxRatio(parseFloat(target.value));
  updateState();
}

function onRadiusChange(e: Event) {
  const target = e.target as HTMLInputElement;
  aharonovBohmEngine.setRingRadiusNm(parseFloat(target.value));
  updateState();
}

function sampleInterference() {
  aharonovBohmEngine.sampleInterference();
  updateState();
}

function lockOptimumFlux() {
  aharonovBohmEngine.lockOptimumPersistentFlux();
  updateState();
}

function toggleModulation() {
  aharonovBohmEngine.setAutoModulation(!state.value.autoFluxModulation);
  updateState();
}

function updateState() {
  state.value = aharonovBohmEngine.getState();
}

function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  animPhase += 0.04;

  const cx = w / 2;
  const cy = h / 2;

  // 1. 中心穿透磁通量線管 (Magnetic Flux Tube / Solenoid in Center)
  const fluxVal = state.value.magneticFluxRatio;
  const solenoidR = 24;

  ctx.save();
  const solGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, solenoidR);
  solGrad.addColorStop(0, '#f59e0b');
  solGrad.addColorStop(0.7, '#d97706');
  solGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');

  ctx.beginPath();
  ctx.arc(cx, cy, solenoidR, 0, Math.PI * 2);
  ctx.fillStyle = solGrad;
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Φ=${fluxVal}Φ₀`, cx, cy + 4);
  ctx.restore();

  // 2. 超導奈米環幾何 (Superconducting Ring Geometry)
  const ringR = 80 + (state.value.ringRadiusNm / 500.0) * 45;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 14;
  ctx.stroke();

  // 內外金屬輪廓線
  ctx.beginPath();
  ctx.arc(cx, cy, ringR - 7, 0, Math.PI * 2);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, ringR + 7, 0, Math.PI * 2);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 3. 電子機率波干涉條紋 (Electron Wave Interference Fringes)
  const segments = 60;
  ctx.save();
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const waveAmp = Math.cos(angle * 4 + animPhase * 2 + state.value.geometricPhaseRad);
    const bright = Math.max(0.1, (waveAmp + 1.0) / 2.0);

    const px = cx + Math.cos(angle) * ringR;
    const py = cy + Math.sin(angle) * ringR;

    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(52, 211, 153, ${bright})`;
    ctx.fill();
  }
  ctx.restore();

  // 4. 持續超導無耗散電流向量方向 (Persistent Current Vector)
  const current = state.value.persistentCurrentMicroAmp;
  const currentDirection = current >= 0 ? 1 : -1;
  const currentSpeed = animPhase * 1.8 * currentDirection;

  ctx.save();
  for (let c = 0; c < 8; c++) {
    const cAngle = currentSpeed + (c / 8) * Math.PI * 2;
    const cpx = cx + Math.cos(cAngle) * ringR;
    const cpy = cy + Math.sin(cAngle) * ringR;

    ctx.beginPath();
    ctx.arc(cpx, cpy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.fill();
  }
  ctx.restore();

  // 5. 左下角電流強度指示器
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, h - 48, 150, 34);
  ctx.fillRect(16, h - 48, 150, 34);

  ctx.fillStyle = '#6ee7b7';
  ctx.font = '10px monospace';
  ctx.fillText(`持續電流: ${current} μA`, 24, h - 32);
  ctx.fillStyle = '#fcd34d';
  ctx.fillText(`相干度: ${state.value.interferenceVisibilityPercent.toFixed(1)}%`, 24, h - 20);
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
