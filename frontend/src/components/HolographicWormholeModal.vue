<template>
  <div v-if="uiStore.mode === 'holographic-wormhole'" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-5xl bg-slate-900/90 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-indigo-500/30 bg-indigo-950/30">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🕳️</span>
          <div>
            <h2 class="text-xl font-bold text-indigo-300 tracking-wider">
              全息蟲洞量子隱形傳態對偶反應爐
            </h2>
            <p class="text-xs text-indigo-400/70">
              ER=EPR Holographic Geometry · Gao-Jafferis-Wall Protocol · Traversable Wormhole Teleportation
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
          <div class="lg:col-span-8 bg-slate-950/80 rounded-xl border border-indigo-500/20 p-4 flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-2 text-xs font-mono text-indigo-400">
              <span>雙曲 AdS 幾何與可穿越蟲洞喉部世界線 (Traversable Wormhole Throat)</span>
              <span>喉部 Δv = {{ state.throatOpeningDv.toFixed(2) }} | 保真度 F = {{ (state.teleportFidelity * 100).toFixed(1) }}%</span>
            </div>
            <canvas ref="canvasRef" width="600" height="340" class="w-full h-[340px] rounded-lg bg-black border border-indigo-900/50 shadow-inner"></canvas>
            <div class="w-full flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> 左黑洞邊界 CFT_L</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span> 雙曲蟲洞喉部 (夏皮羅超前)</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> 右黑洞邊界 CFT_R</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 穿梭量子位元</span>
            </div>
          </div>

          <!-- Realtime Physics Telemetry -->
          <div class="lg:col-span-4 bg-slate-950/60 rounded-xl border border-indigo-500/20 p-4 flex flex-col justify-between space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-indigo-900/60 pb-1">
              全息引力隱形傳態遙測
            </h3>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">蟲洞喉部張開量 Δv</span>
                <span :class="state.throatOpeningDv > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400'">
                  {{ state.throatOpeningDv.toFixed(3) }}
                  <span class="text-[10px]">{{ state.throatOpeningDv > 0 ? '(可穿越)' : '(閉合閉塞)' }}</span>
                </span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">傳態量子保真度 F</span>
                <span class="text-indigo-300 font-bold">{{ (state.teleportFidelity * 100).toFixed(2) }} %</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">本體負能量密度 ⟨T_kk⟩</span>
                <span class="text-cyan-400">{{ state.negativeEnergyDensity.toFixed(3) }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">雙邊互資訊 I(L:R)</span>
                <span class="text-purple-300">{{ state.mutualInformation.toFixed(2) }} nats</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">李雅普諾夫指數 λ_L</span>
                <span class="text-amber-300">{{ state.lyapunovExponent.toFixed(2) }} (近混沌上限)</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800">
                <span class="text-slate-400">SYK 費米子數 N</span>
                <span class="text-slate-300">{{ state.sykFermionCount }} 模</span>
              </div>
            </div>

            <button
              @click="launchTeleport"
              class="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95"
            >
              🚀 注入量子位元穿梭 (Traverse Qubit)
            </button>
          </div>
        </div>

        <!-- Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-indigo-950">
          <!-- Left-Right Coupling Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>雙邊耦合強度 g_LR</span>
              <span class="text-indigo-400 font-mono">{{ state.couplingStrengthG.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              :value="state.couplingStrengthG"
              @input="onCouplingChange"
              class="w-full accent-indigo-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">負能量脈衝注入門</span>
          </div>

          <!-- TFD Temperature Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>TFD 溫度 T</span>
              <span class="text-cyan-400 font-mono">{{ state.tfdTemperature.toFixed(2) }}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.5"
              step="0.05"
              :value="state.tfdTemperature"
              @input="onTempChange"
              class="w-full accent-cyan-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">黑洞霍金熱態糾纏</span>
          </div>

          <!-- Insertion Time Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>位元注入時機 t_ins</span>
              <span class="text-purple-400 font-mono">{{ state.insertionTimeSec.toFixed(1) }} s</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="0.0"
              step="0.1"
              :value="state.insertionTimeSec"
              @input="onTimeChange"
              class="w-full accent-purple-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">過去早期射入擾亂</span>
          </div>

          <!-- SYK Fermions Slider -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-slate-300">
              <span>SYK 馬約拉納數 N</span>
              <span class="text-amber-400 font-mono">{{ state.sykFermionCount }}</span>
            </div>
            <input
              type="range"
              min="16"
              max="128"
              step="8"
              :value="state.sykFermionCount"
              @input="onFermionsChange"
              class="w-full accent-amber-500 cursor-pointer"
            />
            <span class="text-[10px] text-slate-500">全息非費米微觀態</span>
          </div>
        </div>

        <!-- Regime Selector Tabs -->
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            全息蟲洞幾何體制 (Wormhole Regimes)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="reg in regimes"
              :key="reg.key"
              @click="selectRegime(reg.key)"
              :class="[
                'p-3 rounded-xl border text-left transition flex flex-col justify-between',
                state.regime === reg.key
                  ? 'bg-indigo-950/60 border-indigo-400 shadow-lg text-indigo-200'
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
  holographicWormholeEngine,
  type WormholeRegime,
  type WormholeTeleportState
} from '../engine/holographicWormholeTeleport';
import { achievements } from '../engine/achievements';

const uiStore = useUIStore();
const state = ref<WormholeTeleportState>(holographicWormholeEngine.getState());
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animId: number | null = null;
let animPhase = 0;

const regimes: Array<{ key: WormholeRegime; title: string; icon: string; desc: string }> = [
  {
    key: 'quantum-teleport-pulse',
    title: '量子隱形傳態相',
    icon: '🚀',
    desc: '負能量張開蟲洞喉部，早期射入之量子位元因果穿越至右邊界完美解密重構。'
  },
  {
    key: 'negative-energy-throat',
    title: '負能量應力張開相',
    icon: '⚡',
    desc: '雙跡耦合產生平均負能量張量破缺 NEC 條件，形成正夏皮羅時間超前通道。'
  },
  {
    key: 'thermofield-double',
    title: 'TFD 雙邊糾纏靜止相',
    icon: '♾️',
    desc: '未加外部耦合之不可穿越 Einstein-Rosen 橋，事件視界阻隔因果資訊穿越。'
  },
  {
    key: 'syk-many-body-chaos',
    title: 'SYK 多體混亂擾亂態',
    icon: '🌪️',
    desc: '量子資訊達到最大李雅普諾夫混亂極限，資訊在多體自由度極速散佈。'
  }
];

function closeModal() {
  uiStore.closeOverlay();
}

function onCouplingChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicWormholeEngine.setCouplingG(val);
  syncState();
}

function onTempChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicWormholeEngine.setTemperature(val);
  syncState();
}

function onTimeChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  holographicWormholeEngine.setInsertionTime(val);
  syncState();
}

function onFermionsChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  holographicWormholeEngine.setSykFermions(val);
  syncState();
}

function selectRegime(regime: WormholeRegime) {
  holographicWormholeEngine.setRegime(regime);
  syncState();
}

function launchTeleport() {
  holographicWormholeEngine.launchQubitTeleport();
  achievements.unlock('holographic_wormhole_teleport');
  syncState();
}

function syncState() {
  state.value = { ...holographicWormholeEngine.getState() };
}

function drawVisualizer() {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  ctx.clearRect(0, 0, w, h);

  // 背景 AdS 雙曲暗色星雲
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
  bgGrad.addColorStop(0, '#0c071d');
  bgGrad.addColorStop(1, '#020107');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  animPhase += 0.03;

  // 1. 蟲洞幾何 (雙曲喉部)
  const leftX = w * 0.22;
  const rightX = w * 0.78;
  const midX = w * 0.5;
  const midY = h * 0.5;

  // 蟲洞喉部半徑 (受 throatOpeningDv 調控)
  const baseThroatRadius = Math.max(4, 25 + state.value.throatOpeningDv * 45);

  // 繪製左右邊界圓盤/漏斗 (AdS 幾何)
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.lineWidth = 1.5;

  // 上喉壁雙曲線
  ctx.beginPath();
  ctx.moveTo(leftX, 35);
  ctx.quadraticCurveTo(midX, midY - baseThroatRadius, rightX, 35);
  ctx.stroke();

  // 下喉壁雙曲線
  ctx.beginPath();
  ctx.moveTo(leftX, h - 35);
  ctx.quadraticCurveTo(midX, midY + baseThroatRadius, rightX, h - 35);
  ctx.stroke();

  // 喉部中央發光通道
  if (state.value.throatOpeningDv > 0) {
    const throatGrad = ctx.createRadialGradient(midX, midY, 2, midX, midY, baseThroatRadius);
    throatGrad.addColorStop(0, 'rgba(129, 140, 248, 0.75)');
    throatGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.3)');
    throatGrad.addColorStop(1, 'rgba(49, 46, 129, 0)');
    ctx.fillStyle = throatGrad;
    ctx.beginPath();
    ctx.ellipse(midX, midY, 22, baseThroatRadius, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 喉部閉合 (奇點閉鎖紅線)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, midY - 15);
    ctx.lineTo(midX, midY + 15);
    ctx.stroke();
  }

  // 繪製左右邊界黑洞事件視界
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(leftX, midY, 15, h * 0.38, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(rightX, midY, 15, h * 0.38, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 繪製雙邊糾纏射線 (ER=EPR 關聯流)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
  ctx.lineWidth = 1;
  const numLinks = 8;
  for (let i = 0; i < numLinks; i++) {
    const offset = ((i / numLinks) - 0.5) * 160;
    const wave = Math.sin(animPhase * 2 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(leftX, midY + offset);
    ctx.bezierCurveTo(midX, midY + offset * 0.2 + wave, midX, midY + offset * 0.2 - wave, rightX, midY + offset);
    ctx.stroke();
  }

  // 繪製穿梭量子位元粒子 (若處於穿梭階段)
  const p = state.value.qubitTransitPhase;
  if (p > 0 && p <= 1.0) {
    // 位元沿著雙曲線穿梭
    const qx = leftX + p * (rightX - leftX);
    const dip = Math.sin(p * Math.PI) * 12;
    const qy = midY + dip;

    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(qx, qy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 量子位元尾跡
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX, midY);
    ctx.lineTo(qx, qy);
    ctx.stroke();
  }

  // 邊界標籤
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('AdS_L 邊界 (CFT_L)', leftX, 22);

  ctx.fillStyle = '#c084fc';
  ctx.fillText('AdS_R 邊界 (CFT_R)', rightX, 22);

  ctx.fillStyle = '#818cf8';
  ctx.fillText('可穿越蟲洞喉部 (夏皮羅超前 Δv)', midX, h - 16);
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
