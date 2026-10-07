<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚛️</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
              超對稱外爾費米子手性反常能源核
            </h2>
            <p class="text-xs text-amber-400/80 font-mono">
              Supersymmetric Weyl Anomaly Core • ABJ 手性反常 dρ₅/dt ∝ (E·B) ⊗ 手性磁效應無阻軸向超導
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

      <!-- 4 大手性反常能源體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-900/40 text-amber-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-amber-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-amber-400/70 mt-2 px-1">
            <span>外爾雙錐體 (χ=±1)、費米弧連線與軸向電荷流動通量</span>
            <span>手性化學勢 μ₅: {{ state.chiralChemicalPotentialMev.toFixed(1) }} meV (電導 {{ state.axialConductivityMs.toFixed(1) }} MS/m)</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-amber-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>手性電荷軸向泵浦監控</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-200">
              費米弧: {{ state.fermiArcLengthNm }} nm
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>電場 E (V/m)</span>
                <span class="text-amber-300 font-bold">{{ state.electricFieldVPerM }} V/m</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="500.0"
                step="5.0"
                :value="state.electricFieldVPerM"
                @input="onElectricChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>磁場 B (Tesla)</span>
                <span class="text-orange-300 font-bold">{{ state.magneticFieldTesla }} T</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14.0"
                step="0.1"
                :value="state.magneticFieldTesla"
                @input="onMagneticChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">平行積 E · B:</span>
              <span class="text-yellow-300 font-bold">{{ (state.electricFieldVPerM * state.magneticFieldTesla).toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">手性能源通量:</span>
              <span class="text-amber-300 font-bold">{{ state.chiralEnergyFlux.toFixed(1) }} pJ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計泵浦事件:</span>
              <span class="text-slate-200">{{ state.totalPumpingEventsCount }} 次</span>
            </div>
          </div>

          <!-- 操作按鈕列 -->
          <div class="flex flex-col gap-2 pt-2 border-t border-slate-700">
            <button
              @click="triggerChiralPump"
              class="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold text-white shadow-md shadow-amber-900/40 transition active:scale-[0.98]"
            >
              ⚡ 觸發外爾手性反常電荷泵浦
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="triggerBoost"
                class="py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 text-center transition"
              >
                💥 超對稱相變增益
              </button>
              <button
                @click="togglePumping"
                :class="[
                  'py-1.5 rounded-lg text-center font-bold transition',
                  state.autoPumping
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                ]"
              >
                {{ state.autoPumping ? '自動泵浦: ON' : '自動泵浦: OFF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 手性泵浦歷史紀錄 -->
      <div class="bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
        <h3 class="text-xs font-bold text-amber-300 flex items-center justify-between">
          <span>ABJ 手性電荷軸向泵浦與磁效應傳導日誌</span>
          <span class="text-[11px] text-slate-500">最近 20 筆</span>
        </h3>
        <div class="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          <div
            v-for="entry in state.pumpingHistory"
            :key="entry.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/30 text-slate-300"
          >
            <span class="text-amber-400 font-bold">E·B: {{ entry.edotBProduct.toFixed(0) }}</span>
            <span class="text-yellow-300">μ₅: {{ entry.chiralChemicalPotentialMev }} meV</span>
            <span class="text-orange-300">軸向流: {{ entry.axialCurrentDensityAmp }} A</span>
            <span class="text-slate-400">E={{ entry.electricFieldVPerM }}V/m, B={{ entry.magneticFieldTesla }}T</span>
            <span class="text-[10px] text-slate-500">{{ new Date(entry.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div v-if="state.pumpingHistory.length === 0" class="text-center text-slate-600 py-3">
            尚無手性反常泵浦紀錄，點擊按鈕施加平行電磁場 (E · B) 誘發軸向無阻電流
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
  weylChiralEngine, 
  WeylAnomalyRegime, 
  WeylChiralState 
} from '@/engine/weylChiralAnomaly';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref<WeylChiralState>(weylChiralEngine.getState());

let animId: number | null = null;
let animPhase = 0;

const regimes: { id: WeylAnomalyRegime; name: string; desc: string }[] = [
  { id: 'weyl_node_chiral_charge_pumping', name: '外爾電荷泵浦', desc: '平行電磁場破缺手性荷' },
  { id: 'chiral_magnetic_axial_current', name: '手性磁效應導通', desc: '沿磁場方向無阻耗電流' },
  { id: 'non_abelian_berry_monopole', name: '貝里單極子發散', desc: '動量空間拓撲單極子荷' },
  { id: 'supersymmetric_partner_fermion', name: '超對稱伴侶相變', desc: '費米子超對偶相干躍遷' }
];

function close() {
  uiStore.closeOverlay();
}

function selectRegime(regime: WeylAnomalyRegime) {
  weylChiralEngine.setRegime(regime);
  updateState();
}

function onElectricChange(e: Event) {
  const target = e.target as HTMLInputElement;
  weylChiralEngine.setElectricField(parseFloat(target.value));
  updateState();
}

function onMagneticChange(e: Event) {
  const target = e.target as HTMLInputElement;
  weylChiralEngine.setMagneticField(parseFloat(target.value));
  updateState();
}

function triggerChiralPump() {
  weylChiralEngine.triggerChiralPump();
  updateState();
}

function triggerBoost() {
  weylChiralEngine.triggerSupersymmetricBoost();
  updateState();
}

function togglePumping() {
  weylChiralEngine.setAutoPumping(!state.value.autoPumping);
  updateState();
}

function updateState() {
  state.value = weylChiralEngine.getState();
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

  // 1. 雙外爾錐節點座標 (Left Node χ=-1, Right Node χ=+1)
  const sep = 95;
  const leftX = cx - sep;
  const rightX = cx + sep;

  // 2. 繪製左外爾錐 (Left Weyl Cone χ=-1)
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.lineWidth = 1.5;

  // 上錐與下錐
  ctx.beginPath();
  ctx.moveTo(leftX - 35, cy - 65);
  ctx.lineTo(leftX, cy);
  ctx.lineTo(leftX + 35, cy - 65);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(leftX - 35, cy + 65);
  ctx.lineTo(leftX, cy);
  ctx.lineTo(leftX + 35, cy + 65);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // 節點奇點
  ctx.beginPath();
  ctx.arc(leftX, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8;
  ctx.fill();

  ctx.fillStyle = '#fca5a5';
  ctx.font = '10px monospace';
  ctx.fillText('χ = -1 (L)', leftX - 22, cy + 18);
  ctx.restore();

  // 3. 繪製右外爾錐 (Right Weyl Cone χ=+1)
  ctx.save();
  ctx.strokeStyle = '#f97316';
  ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(rightX - 35, cy - 65);
  ctx.lineTo(rightX, cy);
  ctx.lineTo(rightX + 35, cy - 65);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(rightX - 35, cy + 65);
  ctx.lineTo(rightX, cy);
  ctx.lineTo(rightX + 35, cy + 65);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rightX, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 8;
  ctx.fill();

  ctx.fillStyle = '#86efac';
  ctx.font = '10px monospace';
  ctx.fillText('χ = +1 (R)', rightX - 22, cy + 18);
  ctx.restore();

  // 4. 費米弧表面態 (Fermi Arc Surface States connecting nodes)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(leftX, cy);
  ctx.bezierCurveTo(leftX + 40, cy - 45, rightX - 40, cy - 45, rightX, cy);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = '9px monospace';
  ctx.fillText(`費米弧 Fermi Arc: ${state.value.fermiArcLengthNm} nm`, cx - 60, cy - 48);
  ctx.restore();

  // 5. 軸向手性電荷泵浦流 (Chiral Charge Pumping Flux between nodes)
  const fluxProgress = (animPhase * 2.0) % 1.0;
  ctx.save();
  for (let p = 0; p < 7; p++) {
    const prog = (fluxProgress + p / 7) % 1.0;
    const px = leftX + (rightX - leftX) * prog;
    const py = cy + Math.sin(prog * Math.PI) * 22;

    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 6;
    ctx.fill();
  }
  ctx.restore();

  // 6. 右下角手性磁效應導通儀
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.strokeRect(w - 180, h - 50, 164, 36);
  ctx.fillRect(w - 180, h - 50, 164, 36);

  ctx.fillStyle = '#fde68a';
  ctx.font = '10px monospace';
  ctx.fillText(`軸向電導率: ${state.value.axialConductivityMs} MS/m`, w - 172, h - 34);
  ctx.fillStyle = '#f97316';
  ctx.fillText(`平行積 E·B: ${(state.value.electricFieldVPerM * state.value.magneticFieldTesla).toFixed(0)}`, w - 172, h - 22);
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
