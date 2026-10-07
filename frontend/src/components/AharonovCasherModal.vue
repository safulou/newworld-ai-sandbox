<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🧲</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              阿哈羅諾夫-卡舍爾中性費米子自旋拓撲干涉儀
            </h2>
            <p class="text-xs text-cyan-400/80 font-mono">
              Aharonov-Casher Spin Interferometer • 中性磁偶極繞線電荷 ⊗ 電磁拓撲對偶 ⊗ Rashba 自旋進動調製
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

      <!-- 4 大自旋幾何拓撲體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-900/40 text-cyan-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-cyan-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-cyan-400/70 mt-2 px-1">
            <span>中心線電荷輻射電場 E 與環路中性磁偶極幾何自旋進動向量 μ(θ)</span>
            <span>幾何相位: {{ state.acGeometricPhaseRad }} rad (進動角 {{ state.spinPrecessionAngleDeg }}°)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-cyan-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>自旋導納儀表監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200">
              極化純度 {{ state.spinPolarizationPercent }}%
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>線電荷密度 λ (nC/m)</span>
                <span class="text-cyan-300 font-bold">{{ state.lineChargeDensityNCPerM }} nC/m</span>
              </div>
              <input
                type="range"
                min="-20.0"
                max="20.0"
                step="0.5"
                :value="state.lineChargeDensityNCPerM"
                @input="onLineChargeChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>Rashba 耦合 α_R (p eV·m)</span>
                <span class="text-teal-300 font-bold">{{ state.rashbaCouplingPicoEVm }}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="50.0"
                step="1.0"
                :value="state.rashbaCouplingPicoEVm"
                @input="onRashbaChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">自旋量子導納 G:</span>
              <span :class="state.spinConductanceG0 < 0.2 ? 'text-rose-400' : 'text-emerald-300'" class="font-bold">
                {{ state.spinConductanceG0 }} G₀ {{ state.spinConductanceG0 < 0.2 ? '(相消陷波)' : '(導通)' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">自旋進動角度:</span>
              <span class="text-amber-300 font-bold">{{ state.spinPrecessionAngleDeg }}°</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">干涉條紋對比度:</span>
              <span class="text-cyan-300 font-bold">{{ (state.interferenceContrastRatio * 100).toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計干涉事件:</span>
              <span class="text-white font-bold">{{ state.totalInterferenceEvents }} 次</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="recordShot"
              class="flex-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-cyan-900/40 text-xs"
            >
              <span>🔬 採樣自旋干涉</span>
            </button>
            <button
              @click="toggleSweep"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoGateSweep
                  ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoGateSweep ? '閘極掃描: 開' : '閘極掃描: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 自旋干涉歷史採樣隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">中性費米子自旋拓撲干涉歷史採樣</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.telemetryHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="t in state.telemetryHistory"
            :key="t.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-cyan-300">Φ_AC: {{ t.phaseRad }} rad</span>
            <span :class="t.conductanceQuantum < 0.2 ? 'text-rose-400' : 'text-emerald-300'">
              G = {{ t.conductanceQuantum }} G₀
            </span>
            <span class="text-amber-300">θ {{ t.precessionAngleDeg }}°</span>
            <span class="text-teal-300">P {{ (t.polarizationPurity * 100).toFixed(1) }}%</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(t.timestamp) }}</span>
          </div>
          <div v-if="state.telemetryHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無干涉採樣記錄，點擊上方按鈕執行中性自旋干涉量測。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { aharonovCasherEngine, ACRegime } from '@/engine/aharonovCasher';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(aharonovCasherEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'neutral_neutron_geometric_phase' as ACRegime, name: '中子中性偶極相', desc: '純幾何 AC 相位宏觀干涉' },
  { id: 'rashba_spin_orbit_nanoring' as ACRegime, name: 'Rashba 奈米環', desc: '電場調控自旋電晶體開關' },
  { id: 'magnon_spin_wave_interference' as ACRegime, name: '磁子自旋波干涉', desc: '中性磁子幾何無耗散傳輸' },
  { id: 'duality_flux_spin_topological_gate' as ACRegime, name: 'AB-AC 對偶閘', desc: '電磁對偶拓撲量子邏輯' },
];

function close() {
  uiStore.setAharonovCasherOpen(false);
}

function selectRegime(r: ACRegime) {
  aharonovCasherEngine.setRegime(r);
  state.value = aharonovCasherEngine.getState();
}

function onLineChargeChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  aharonovCasherEngine.setLineCharge(val);
  state.value = aharonovCasherEngine.getState();
}

function onRashbaChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  aharonovCasherEngine.setRashbaCoupling(val);
  state.value = aharonovCasherEngine.getState();
}

function toggleSweep() {
  aharonovCasherEngine.toggleAutoSweep();
  state.value = aharonovCasherEngine.getState();
}

function recordShot() {
  aharonovCasherEngine.recordInterferenceShot();
  state.value = aharonovCasherEngine.getState();
  achievements.unlock('aharonov_casher_interferometer');
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

  ctx.fillStyle = '#040914';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const ringR = 95;

  // 1. 中心垂直帶電線柱 (Electric Line Charge λ)
  const lineCharge = state.value.lineChargeDensityNCPerM;
  ctx.fillStyle = lineCharge >= 0 ? '#38bdf8' : '#f43f5e';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(lineCharge >= 0 ? '+λ' : '-λ', cx, cy);

  // 2. 徑向輻射電場線 (Radial Electric Field E)
  const rayCount = 12;
  ctx.strokeStyle = lineCharge >= 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 63, 94, 0.25)';
  ctx.lineWidth = 1;
  for (let r = 0; r < rayCount; r++) {
    const angle = (r * Math.PI * 2) / rayCount;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 16, cy + Math.sin(angle) * 16);
    ctx.lineTo(cx + Math.cos(angle) * 130, cy + Math.sin(angle) * 130);
    ctx.stroke();
  }

  // 3. 中性自旋雙臂干涉奈米環軌道 (Dual Branch Nanoring)
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // 4. 自旋粒子沿環路軌跡與進動箭頭 μ(θ)
  const spinParticleCount = 8;
  const phaseShift = state.value.acGeometricPhaseRad;

  for (let p = 0; p < spinParticleCount; p++) {
    const orbitAngle = time * 0.9 + (p * Math.PI * 2) / spinParticleCount;
    const px = cx + Math.cos(orbitAngle) * ringR;
    const py = cy + Math.sin(orbitAngle) * ringR;

    // 自旋幾何進動方向
    const precAngle = orbitAngle + phaseShift * (orbitAngle / (Math.PI * 2));

    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    // 自旋箭頭
    const arrowLen = 14;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(precAngle) * arrowLen, py + Math.sin(precAngle) * arrowLen);
    ctx.stroke();
  }

  // 5. 干涉導納條紋疊加指標 (相消或相長)
  const cond = state.value.spinConductanceG0;
  ctx.textAlign = 'left';
  ctx.fillStyle = cond < 0.2 ? '#f43f5e' : '#34d399';
  ctx.font = '11px monospace';
  ctx.fillText(`量子電導: ${cond} G₀`, 16, 26);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(cond < 0.2 ? '⚠️ 幾何相消干涉 (開關關閉)' : '✅ 幾何相長干涉 (超流自旋導通)', 16, 42);
}

function loop() {
  aharonovCasherEngine.update(0.016);
  state.value = aharonovCasherEngine.getState();
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
