<template>
  <div v-if="uiStore.mode === 'chiral-pump'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-amber-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚛️</span>
          <div>
            <h2 class="text-xl font-bold text-amber-300 tracking-wider">
              拓撲手性反常弗蘭肯斯坦量子泵浦反應堆
            </h2>
            <p class="text-xs text-amber-400/70">
              3D Weyl Semimetal · ABJ Chiral Anomaly · Chiral Magnetic Effect (CME) · Fermi Arc Transport
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
              <span>動量空間外爾雙錐體與表面費米弧 (Weyl Cones & Fermi Arc Pumping)</span>
              <span>E·B = {{ (state.electricFieldKvCm * state.magneticFieldTesla * Math.cos(state.alignmentAngleDeg * Math.PI / 180)).toFixed(1) }} | J_CME = {{ state.chiralMagneticCurrent.toFixed(1) }} A/mm²</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-amber-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> 外爾節點 χ = +1 (源)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> 外爾節點 χ = -1 (匯)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 表面費米弧拓撲態</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-amber-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-amber-900/60 pb-1">
              外爾反常量子泵浦遙測
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">軸向化學勢 μ_5</span>
                <span class="text-amber-300 font-semibold">{{ state.axialChemicalPotentialMev.toFixed(2) }} meV</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">CME 無耗散電流密度</span>
                <span class="text-cyan-300 font-bold">{{ state.chiralMagneticCurrent.toFixed(1) }} A/mm²</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">軸向電荷泵浦率 dn5/dt</span>
                <span class="text-rose-400 font-semibold">{{ state.axialPumpingRate.toFixed(2) }} × 10²⁸</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">巨負磁阻電導增益</span>
                <span class="text-emerald-400 font-bold">+{{ state.magnetoConductanceGainPct.toFixed(0) }} %</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">手性磁波速度 v_χ</span>
                <span class="text-purple-300">{{ state.chiralWaveVelocityKmS.toFixed(1) }} km/s</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">節點動量距離 2k_0</span>
                <span class="text-slate-300">{{ state.weylNodeSeparation.toFixed(2) }} Å⁻¹</span>
              </div>
            </div>

            <button
              @click="triggerPulse"
              class="w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              ⚡ 注入軸向手性電荷脈衝 (Chiral Pulse)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-amber-950">
          <!-- Electric Field Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>平行電場 E_z</span>
              <span class="text-amber-400 font-mono">{{ state.electricFieldKvCm.toFixed(1) }} kV/cm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              :value="state.electricFieldKvCm"
              @input="onElectricChange"
              class="w-full accent-amber-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">軸向泵浦驅動場</span>
          </div>

          <!-- Magnetic Field Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>外加磁場 B_z</span>
              <span class="text-cyan-400 font-mono">{{ state.magneticFieldTesla.toFixed(1) }} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12.0"
              step="0.1"
              :value="state.magneticFieldTesla"
              @input="onMagneticChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">朗道能級拓撲簡併</span>
          </div>

          <!-- Alignment Angle Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>E 與 B 夾角 θ_EB</span>
              <span class="text-purple-400 font-mono">{{ state.alignmentAngleDeg.toFixed(0) }}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              :value="state.alignmentAngleDeg"
              @input="onAngleChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">cos(θ) 反常通量係數</span>
          </div>

          <!-- Relaxation Time Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>谷間弛豫時間 τ_v</span>
              <span class="text-rose-400 font-mono">{{ state.interValleyRelaxationPs.toFixed(0) }} ps</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              :value="state.interValleyRelaxationPs"
              @input="onRelaxationChange"
              class="w-full accent-rose-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">拓撲保護抗散射壽命</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            手性反常運作體制 (Pump Regimes)
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
  chiralAnomalyEngine,
  type ChiralPumpRegime,
  type ChiralPumpState
} from '../engine/chiralAnomalyQuantumPump';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<ChiralPumpState>(chiralAnomalyEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const regimes: Array<{ key: ChiralPumpRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'floquet-axial-pump',
    title: '弗洛凱軸向泵浦相',
    icon: '⚡',
    desc: '動態電磁驅動下破缺手性荷守恆，於正負外爾錐間源源不絕泵浦非平衡態軸向電荷。'
  },
  {
    key: 'chiral-magnetic-wave',
    title: '手性磁波傳輸相',
    icon: '🌊',
    desc: '軸向與向量電荷密度交替耦合振盪，形成超音速手性磁聲波 (CMW) 無耗散集體傳播。'
  },
  {
    key: 'fermi-arc-transport',
    title: '表面費米弧彈道相',
    icon: '🌈',
    desc: '晶體表面非閉合費米弧將雙外爾節點投影相連，提供免受背向散射之單向彈道通道。'
  },
  {
    key: 'axionic-spin-transistor',
    title: '軸子自旋開關相',
    icon: '🎛️',
    desc: '軸子電動力學 θ E·B 項引致巨負縱向磁阻，實現超高開關比量子拓撲電晶體。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onElectricChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  chiralAnomalyEngine.setElectricField(val);
  syncState();
}

function onMagneticChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  chiralAnomalyEngine.setMagneticField(val);
  syncState();
}

function onAngleChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  chiralAnomalyEngine.setAlignmentAngle(val);
  syncState();
}

function onRelaxationChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  chiralAnomalyEngine.setRelaxationTime(val);
  syncState();
}

function selectRegime(regime: ChiralPumpRegime) {
  chiralAnomalyEngine.setRegime(regime);
  syncState();
}

function triggerPulse() {
  chiralAnomalyEngine.triggerChiralPulse();
  achievements.unlock('chiral_anomaly_pump');
  syncState();
}

function syncState() {
  state.value = { ...chiralAnomalyEngine.getState() };
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
  bgGrad.addColorStop(0, '#1c0f05');
  bgGrad.addColorStop(1, '#050201');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  animPhase += 0.035;

  // 1. 左側 60%：動量空間外爾雙錐體 (Weyl Cones) 與表面費米弧
  const weylW = w * 0.62;
  const midY = h * 0.52;
  const node1X = weylW * 0.28; // χ = -1
  const node2X = weylW * 0.72; // χ = +1
  const coneRadius = 45;

  // 繪製左外爾錐 (χ = -1, 藍色匯)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(node1X, midY);
  ctx.lineTo(node1X - coneRadius, midY - 60);
  ctx.lineTo(node1X + coneRadius, midY - 60);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(node1X, midY);
  ctx.lineTo(node1X - coneRadius, midY + 60);
  ctx.lineTo(node1X + coneRadius, midY + 60);
  ctx.closePath();
  ctx.stroke();

  // 節點核心發光 (藍)
  const grad1 = ctx.createRadialGradient(node1X, midY, 1, node1X, midY, 20);
  grad1.addColorStop(0, '#38bdf8');
  grad1.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = grad1;
  ctx.beginPath();
  ctx.arc(node1X, midY, 20, 0, Math.PI * 2);
  ctx.fill();

  // 繪製右外爾錐 (χ = +1, 紅/金源)
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(node2X, midY);
  ctx.lineTo(node2X - coneRadius, midY - 60);
  ctx.lineTo(node2X + coneRadius, midY - 60);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(node2X, midY);
  ctx.lineTo(node2X - coneRadius, midY + 60);
  ctx.lineTo(node2X + coneRadius, midY + 60);
  ctx.closePath();
  ctx.stroke();

  // 節點核心發光 (紅)
  const grad2 = ctx.createRadialGradient(node2X, midY, 1, node2X, midY, 20);
  grad2.addColorStop(0, '#f43f5e');
  grad2.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(node2X, midY, 20, 0, Math.PI * 2);
  ctx.fill();

  // 2. 表面費米弧 (Fermi Arc: 連接兩外爾節點的拓撲表面弧線)
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(node1X, midY);
  ctx.quadraticCurveTo((node1X + node2X) / 2, midY - 45, node2X, midY);
  ctx.stroke();

  // 3. 軸向電荷泵浦流粒子 (由左向右流動)
  const numPumpParticles = Math.min(25, Math.floor(state.value.axialPumpingRate * 4));
  for (let i = 0; i < numPumpParticles; i++) {
    const pFrac = ((animPhase * 0.8 + i / numPumpParticles) % 1);
    const px = node1X + pFrac * (node2X - node1X);
    const dip = Math.sin(pFrac * Math.PI) * 18;
    const py = midY + dip;

    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 標籤
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('外爾節點 χ = -1 (Sink)', node1X, midY + 80);
  ctx.fillStyle = '#f43f5e';
  ctx.fillText('外爾節點 χ = +1 (Source)', node2X, midY + 80);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('表面拓撲費米弧 (Fermi Arc)', (node1X + node2X) / 2, midY - 55);

  // 4. 右側 38%：CME 手性磁電流與負縱向磁阻電導儀表
  const rightX = weylW + 10;
  const rightW = w - rightX - 12;
  const panelY = 16;
  const panelH = h - 32;

  ctx.fillStyle = 'rgba(25, 12, 5, 0.7)';
  ctx.fillRect(rightX, panelY, rightW, panelH);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.strokeRect(rightX, panelY, rightW, panelH);

  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('手性磁效應 CME 電流輸出', rightX + 10, panelY + 18);

  // CME 電流進度條
  const cmeBarY = panelY + 28;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(rightX + 10, cmeBarY, rightW - 20, 16);
  const cmeWidth = Math.min(rightW - 20, (state.value.chiralMagneticCurrent / 180) * (rightW - 20));
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(rightX + 10, cmeBarY, cmeWidth, 16);

  ctx.fillStyle = '#fff';
  ctx.font = '9px monospace';
  ctx.fillText(`${state.value.chiralMagneticCurrent.toFixed(1)} A/mm²`, rightX + 15, cmeBarY + 12);

  // 巨負縱向磁阻 (NLMR) 增益圖
  const nlmrY = panelY + 70;
  ctx.fillStyle = '#34d399';
  ctx.fillText('巨負縱向磁阻 NLMR 電導增益', rightX + 10, nlmrY);

  const nlmrBarY = nlmrY + 10;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(rightX + 10, nlmrBarY, rightW - 20, 16);
  const nlmrWidth = Math.min(rightW - 20, (state.value.magnetoConductanceGainPct / 600) * (rightW - 20));
  ctx.fillStyle = '#10b981';
  ctx.fillRect(rightX + 10, nlmrBarY, nlmrWidth, 16);

  ctx.fillStyle = '#fff';
  ctx.fillText(`+${state.value.magnetoConductanceGainPct.toFixed(0)} %`, rightX + 15, nlmrBarY + 12);

  // 底部手性磁波 (CMW) 波形動態
  const waveY = panelY + 130;
  ctx.fillStyle = '#c084fc';
  ctx.fillText(`手性磁波 CMW (v=${state.value.chiralWaveVelocityKmS.toFixed(0)}km/s)`, rightX + 10, waveY);

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let px = 0; px < rightW - 20; px++) {
    const waveX = rightX + 10 + px;
    const waveOffset = Math.sin(px * 0.08 - animPhase * 3) * 14;
    const plotY = waveY + 35 + waveOffset;
    if (px === 0) ctx.moveTo(waveX, plotY);
    else ctx.lineTo(waveX, plotY);
  }
  ctx.stroke();
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
