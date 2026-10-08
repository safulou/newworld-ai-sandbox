<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-violet-500/40 rounded-2xl shadow-2xl shadow-violet-950/60 p-6 text-slate-100 flex flex-col gap-6">
      <!-- 頂部標題與關閉按鈕 -->
      <div class="flex items-center justify-between border-b border-violet-500/30 pb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🕳️</span>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              卡魯扎-克萊因高維引力微型黑洞探針
            </h2>
            <p class="text-xs text-violet-400/80 font-mono">
              Kaluza-Klein Micro Black Hole Probe • 大額外維度 ADD 膜世界 ⊗ TeV 普朗克標度 ⊗ 高維霍金熱蒸發
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

      <!-- 4 大高維重力探測體制 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="r in regimes"
          :key="r.id"
          @click="selectRegime(r.id)"
          :class="[
            'p-3 rounded-xl border text-left transition flex flex-col gap-1',
            state.regime === r.id
              ? 'bg-violet-950/60 border-violet-400 shadow-md shadow-violet-900/40 text-violet-200'
              : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 text-slate-400'
          ]"
        >
          <span class="text-xs font-bold text-white">{{ r.name }}</span>
          <span class="text-[10px] text-violet-400/70">{{ r.desc }}</span>
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
          <div class="w-full flex justify-between items-center text-[11px] text-violet-400/70 mt-2 px-1">
            <span>緊緻化額外維度流形圓柱與微型黑洞霍金爆炸等方粒子噴流簇射</span>
            <span>額外維度: d={{ state.extraDimensionsCount }} • 視界半徑: {{ state.horizonRadiusAttometer }} am</span>
          </div>
        </div>

        <!-- 物理數值儀表板 -->
        <div class="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-between gap-3 text-xs">
          <div class="font-bold text-violet-300 border-b border-slate-700 pb-2 flex items-center justify-between">
            <span>高維黑洞探測遙測</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-violet-900/60 text-violet-200">
              霍金溫度 {{ state.hawkingTemperatureGev }} GeV
            </span>
          </div>

          <div class="space-y-2 font-mono">
            <div>
              <div class="flex justify-between text-slate-400">
                <span>額外維度數 d (2 ~ 6)</span>
                <span class="text-violet-300 font-bold">d = {{ state.extraDimensionsCount }}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                :value="state.extraDimensionsCount"
                @input="onDimensionsChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>基本普朗克能標 M_* (TeV)</span>
                <span class="text-purple-300 font-bold">{{ state.fundamentalPlanckScaleTev }} TeV</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.2"
                :value="state.fundamentalPlanckScaleTev"
                @input="onPlanckScaleChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 mt-1"
              />
            </div>

            <div>
              <div class="flex justify-between text-slate-400">
                <span>對撞質心能 √s (TeV)</span>
                <span class="text-indigo-300 font-bold">{{ state.collisionEnergyTev }} TeV</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="28.0"
                step="0.5"
                :value="state.collisionEnergyTev"
                @input="onCollisionEnergyChange"
                class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 mt-1"
              />
            </div>

            <div class="flex justify-between border-t border-slate-700/60 pt-1">
              <span class="text-slate-400">KK 引力子塔發射率:</span>
              <span class="text-amber-300 font-bold">{{ state.kkGravitonEmissionRateMegaHz }} MHz</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">累計微型黑洞成核:</span>
              <span class="text-white font-bold">{{ state.totalMicroBlackHolesFormed }} 個</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2 border-t border-slate-700/60">
            <button
              @click="collapse"
              class="flex-1 py-1.5 px-2 rounded-lg bg-violet-600 hover:bg-violet-500 font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-violet-900/40 text-xs"
            >
              <span>💥 激發重力坍縮成核</span>
            </button>
            <button
              @click="toggleLuminosity"
              :class="[
                'py-1.5 px-3 rounded-lg border font-bold text-xs transition',
                state.autoColliderLuminosity
                  ? 'border-violet-500/80 bg-violet-950/40 text-violet-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              ]"
            >
              {{ state.autoColliderLuminosity ? '對撞光度: 開' : '對撞光度: 關' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 黑洞蒸發歷史隊列 -->
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/40 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">微型黑洞四階段霍金蒸發爆炸歷史隊列</span>
          <span class="text-[10px] text-slate-500">最新 {{ state.evaporationHistory.length }} 筆</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
          <div
            v-for="b in state.evaporationHistory"
            :key="b.id"
            class="flex items-center justify-between p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono"
          >
            <span class="text-violet-300">質量 {{ b.massTev }} TeV</span>
            <span class="text-purple-400">視界 {{ b.horizonRadiusAttometer }} am</span>
            <span class="text-amber-300">噴流數 {{ b.multiplicityJets }}</span>
            <span class="text-rose-400">{{ b.temperatureGev }} GeV</span>
            <span class="text-slate-500 text-[9px]">{{ formatTime(b.timestamp) }}</span>
          </div>
          <div v-if="state.evaporationHistory.length === 0" class="col-span-2 text-center text-slate-500 text-xs py-3">
            尚無微黑洞成核蒸發記錄，點擊上方按鈕激發高能對撞坍縮。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { kaluzaKleinBlackHoleEngine, KKRegime } from '@/engine/kaluzaKleinMicroBlackHole';
import { achievements } from '@/engine/achievements';

const uiStore = useUIStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref(kaluzaKleinBlackHoleEngine.getState());

let animId: number | null = null;

const regimes = [
  { id: 'tev_scale_gravity_blackhole' as KKRegime, name: 'TeV 標度重力黑洞', desc: '大額外維度微型黑洞成核' },
  { id: 'kk_graviton_tower_emission' as KKRegime, name: 'KK 重力子塔發射', desc: '微觀緊緻維度引力子激發' },
  { id: 'four_stage_hawking_evaporation' as KKRegime, name: '四階段霍金爆炸', desc: '多重等方性粒子噴流簇射' },
  { id: 'planck_remnant_string_ball' as KKRegime, name: '普朗克微殘餘態', desc: '終極弦球對稱性轉化' },
];

function close() {
  uiStore.setKaluzaKleinOpen(false);
}

function selectRegime(r: KKRegime) {
  kaluzaKleinBlackHoleEngine.setRegime(r);
  state.value = kaluzaKleinBlackHoleEngine.getState();
}

function onDimensionsChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  kaluzaKleinBlackHoleEngine.setDimensions(val);
  state.value = kaluzaKleinBlackHoleEngine.getState();
}

function onPlanckScaleChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  kaluzaKleinBlackHoleEngine.setPlanckScale(val);
  state.value = kaluzaKleinBlackHoleEngine.getState();
}

function onCollisionEnergyChange(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  kaluzaKleinBlackHoleEngine.setCollisionEnergy(val);
  state.value = kaluzaKleinBlackHoleEngine.getState();
}

function toggleLuminosity() {
  kaluzaKleinBlackHoleEngine.toggleColliderLuminosity();
  state.value = kaluzaKleinBlackHoleEngine.getState();
}

function collapse() {
  kaluzaKleinBlackHoleEngine.triggerBlackHoleCollapse();
  state.value = kaluzaKleinBlackHoleEngine.getState();
  achievements.unlock('kaluza_klein_micro_blackhole');
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

  ctx.fillStyle = '#06030d';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  // 1. 背景：緊緻化卡魯扎-克萊因高維流形圓環 (Compactified KK Cylinder)
  const ringCount = state.value.extraDimensionsCount;
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
  ctx.lineWidth = 1;
  for (let d = 1; d <= ringCount; d++) {
    const rx = 35 + d * 22;
    const ry = (35 + d * 22) * 0.55;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, time * 0.2 + d * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. 中心微型黑洞事件視界 (Micro Black Hole Horizon)
  const hr = Math.max(12, state.value.horizonRadiusAttometer * 12);
  const bhGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, hr);
  bhGrad.addColorStop(0, '#000000');
  bhGrad.addColorStop(0.7, '#1e1035');
  bhGrad.addColorStop(1, 'rgba(139, 92, 246, 0.5)');
  ctx.fillStyle = bhGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, hr, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, hr, 0, Math.PI * 2);
  ctx.stroke();

  // 3. 霍金蒸發等方粒子噴流簇射 (Isotropic Hawking Jets)
  const jetCount = 14;
  for (let j = 0; j < jetCount; j++) {
    const jAngle = (j * Math.PI * 2) / jetCount + time * 0.4;
    const jPhase = (time * 2 + j * 0.2) % 1;
    const startDist = hr + 4;
    const endDist = hr + 40 + jPhase * 70;

    const jx1 = cx + Math.cos(jAngle) * startDist;
    const jy1 = cy + Math.sin(jAngle) * startDist;
    const jx2 = cx + Math.cos(jAngle) * endDist;
    const jy2 = cy + Math.sin(jAngle) * endDist;

    ctx.strokeStyle = 'rgba(232, 121, 249, ' + (1 - jPhase) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(jx1, jy1);
    ctx.lineTo(jx2, jy2);
    ctx.stroke();

    // 噴流末端粒子
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(jx2, jy2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. 標籤註記
  ctx.fillStyle = '#ddd6fe';
  ctx.font = '11px monospace';
  ctx.fillText(`基本普朗克標度: M_* = ${state.value.fundamentalPlanckScaleTev} TeV`, 16, 26);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`卡魯扎-克萊因高維引力坍縮成核截面 σ ∝ π r_H²`, 16, 42);
}

function loop() {
  kaluzaKleinBlackHoleEngine.update(0.016);
  state.value = kaluzaKleinBlackHoleEngine.getState();
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
