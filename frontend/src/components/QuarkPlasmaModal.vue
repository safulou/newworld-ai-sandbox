<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-rose-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-rose-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🔥</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-rose-400">夸克膠子等離子體重組爐 (Quark-Gluon Plasma Forge)</h2>
            <p class="text-xs text-zinc-400">2.15 兆度太初極限相變 · 漸近自由強相互作用 · 奇異重子人工核合成</p>
          </div>
        </div>
        <button
          @click="close"
          class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <!-- 主體雙欄排版 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1">
        <!-- 左欄：Canvas 畫布與即時狀態 -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Canvas 視訊區 -->
          <div class="relative rounded-xl border border-rose-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-rose-500/30 text-[11px] text-rose-300 font-mono">
              🌡️ 等離子相變溫度: {{ state.chamberTempTrillionK.toFixed(2) }} 兆度 K
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
              🧲 磁力拘束壓: {{ state.confinementPressureTeraBar }} TeraBar
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">漸近自由度</span>
              <span class="text-lg font-bold font-mono text-rose-400">{{ state.asymptoticFreedomPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-rose-500 h-full" :style="{ width: `${state.asymptoticFreedomPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">奇異重子塊庫存</span>
              <span class="text-lg font-bold font-mono text-amber-400">✨ {{ state.strangeletStockpile }} 塊</span>
              <span class="text-[10px] text-zinc-500">重子凝聚精華</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">重離子對撞束能</span>
              <span class="text-lg font-bold font-mono text-cyan-400">⚡ {{ state.heavyIonEnergyJoules }} J</span>
              <span class="text-[10px] text-zinc-500">對撞觸發: {{ state.totalCollisionsTriggered }} 次</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              @click="handleTriggerCollision"
              class="rounded-xl border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-rose-300">💥 重離子對撞</span>
              <span class="text-[9px] text-zinc-400">溫度暴升釋放膠子</span>
            </button>
            <button
              @click="handleRegulateNozzle"
              class="rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-amber-300">🧲 調節磁力噴嘴</span>
              <span class="text-[9px] text-zinc-400">強化拘束壓制洩漏</span>
            </button>
            <button
              @click="handleSynthesizeStrangelet"
              :disabled="state.chamberTempTrillionK < 1.5 || state.heavyIonEnergyJoules < 300"
              :class="[
                'rounded-xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1',
                state.chamberTempTrillionK >= 1.5 && state.heavyIonEnergyJoules >= 300
                  ? 'border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-xs font-bold text-purple-300">🧪 合成奇異重子</span>
              <span class="text-[9px] text-zinc-400">耗費 300J 束能</span>
            </button>
            <button
              @click="handleQuenchPlasma"
              class="rounded-xl border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-cyan-300">🧊 冷卻淬火</span>
              <span class="text-[9px] text-zinc-400">快速抑制過載腔溫</span>
            </button>
          </div>
        </div>

        <!-- 右欄：夸克能級與色荷態清單 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🌈 夸克味態與色荷能階矩陣</span>
            <span class="text-xs text-rose-400 font-mono">奇異重子: {{ state.strangeletStockpile }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="quark in quarkList"
              :key="quark.flavor"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-1.5 hover:border-zinc-700 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ quark.name }}</h4>
                  <p class="text-[11px] text-zinc-400">色荷: <span class="font-mono text-amber-300">{{ quark.colorCharge }}</span></p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold text-rose-400">{{ quark.energyDensityGeV }} GeV</span>
                  <div class="text-[10px]">
                    <span v-if="quark.unlocked" class="text-emerald-400">● 自由態已解鎖</span>
                    <span v-else class="text-zinc-500">○ 需腔溫 2.5 兆度</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { quarkGluonPlasma } from '../engine/quarkGluonPlasma'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(quarkGluonPlasma.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const quarkList = computed(() => Object.values(state.value.quarkDensities))

function close() {
  uiStore.closeOverlay()
}

function handleTriggerCollision() {
  quarkGluonPlasma.triggerHeavyIonCollision()
  state.value = { ...quarkGluonPlasma.getState() }
}

function handleRegulateNozzle() {
  quarkGluonPlasma.regulateMagneticNozzle()
  state.value = { ...quarkGluonPlasma.getState() }
}

function handleSynthesizeStrangelet() {
  quarkGluonPlasma.synthesizeStrangelet()
  state.value = { ...quarkGluonPlasma.getState() }
}

function handleQuenchPlasma() {
  quarkGluonPlasma.quenchPlasma()
  state.value = { ...quarkGluonPlasma.getState() }
}

function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2

  ctx.fillStyle = '#080205'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.003

  // 繪製強磁托卡馬克環光暈
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 140)
  grad.addColorStop(0, 'rgba(244, 63, 94, 0.4)')
  grad.addColorStop(0.5, 'rgba(251, 146, 60, 0.2)')
  grad.addColorStop(1, 'rgba(8, 2, 5, 0.95)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 140, 0, Math.PI * 2)
  ctx.fill()

  // 繪製旋轉色荷束光線 (RGB 色荷)
  const colors = ['#ef4444', '#22c55e', '#3b82f6']
  for (let i = 0; i < 3; i++) {
    const angleOffset = (i * Math.PI * 2) / 3 + t
    ctx.strokeStyle = colors[i]
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(cx, cy, 80, 45, angleOffset, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 膠子通量管網絡
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'
  ctx.lineWidth = 1
  for (let k = 0; k < 6; k++) {
    const a = t * 1.5 + (k * Math.PI) / 3
    const x1 = cx + Math.cos(a) * 60
    const y1 = cy + Math.sin(a) * 35
    const x2 = cx + Math.cos(a + Math.PI / 2) * 60
    const y2 = cy + Math.sin(a + Math.PI / 2) * 35
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 中心超高溫對撞核心
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#f43f5e'
  ctx.shadowBlur = 15
  ctx.beginPath()
  ctx.arc(cx, cy, 8 + Math.sin(t * 5) * 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  animFrameId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  if (canvasRef.value) renderCanvas()
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>
