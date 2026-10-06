<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚡</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-cyan-400">超光速因果律超弦通訊網 (Tachyonic Causality Mesh)</h2>
            <p class="text-xs text-zinc-400">快子逆因果通信 · 接收未來時間線預警 · 閔可夫斯基光錐干預</p>
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
          <div class="relative rounded-xl border border-cyan-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              ⏳ 逆向時間偏移: {{ state.temporalTimelineOffsetSeconds }}s (T{{ state.temporalTimelineOffsetSeconds > 0 ? '+' : '' }}{{ state.temporalTimelineOffsetSeconds }}s)
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              🛡️ 因果律完整度: {{ state.causalityIntegrityPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">快子通量儲備</span>
              <span class="text-lg font-bold font-mono text-cyan-400">⚡ {{ state.tachyonicFlux }}</span>
              <span class="text-[10px] text-zinc-500">超光速粒子</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">因果律完整度</span>
              <span class="text-lg font-bold font-mono text-emerald-400">{{ state.causalityIntegrityPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-emerald-500 h-full" :style="{ width: `${state.causalityIntegrityPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">已平息悖論數</span>
              <span class="text-lg font-bold font-mono text-purple-400">🌀 {{ state.totalParadoxesDampened }} 次</span>
              <span class="text-[10px] text-zinc-500">阻尼器運作次數</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleTransmitPrecognitive"
              :disabled="state.tachyonicFlux < 80"
              class="rounded-xl border p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
              :class="state.tachyonicFlux >= 80 ? 'border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200' : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 cursor-not-allowed'"
            >
              <span class="text-sm font-bold">📡 反向廣播先知預警</span>
              <span class="text-[10px] text-zinc-400">消耗 80 快子延伸逆時間位移 -10s</span>
            </button>
            <button
              @click="handleDampenParadox"
              class="rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-emerald-300">🛡️ 啟動因果律阻尼器</span>
              <span class="text-[10px] text-zinc-400">修復因果律完整度 (+15%)</span>
            </button>
          </div>
        </div>

        <!-- 右欄：未來電報清單 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>📜 來自未來時間線之先知電報</span>
            <span class="text-xs text-cyan-400 font-mono">快子: {{ state.tachyonicFlux }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="d in state.dispatches"
              :key="d.id"
              class="rounded-xl border bg-zinc-900/80 p-3 flex flex-col gap-2 transition"
              :class="d.resolved ? 'border-zinc-800 opacity-70' : 'border-cyan-500/40 hover:border-cyan-500'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ d.title }}</h4>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono font-bold"
                    :class="{
                      'bg-emerald-950 text-emerald-400 border border-emerald-500/30': d.threatLevel === 'low',
                      'bg-amber-950 text-amber-400 border border-amber-500/30': d.threatLevel === 'medium',
                      'bg-red-950 text-red-400 border border-red-500/30': d.threatLevel === 'high' || d.threatLevel === 'critical',
                    }"
                  >
                    {{ d.threatLevel }}
                  </span>
                </div>
                <button
                  v-if="d.received && !d.resolved"
                  @click="receiveDispatch(d.id)"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold font-mono border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900 text-cyan-200 transition"
                >
                  接收處理
                </button>
                <span v-else-if="d.resolved" class="text-xs text-emerald-400 font-mono">
                  ✓ 已化解
                </span>
                <span v-else class="text-xs text-zinc-500 font-mono">
                  🔒 未接收
                </span>
              </div>
              <p class="text-[11px] text-zinc-400">{{ d.content }}</p>
              <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>時間位移: {{ d.timelineOffsetSeconds }}s</span>
                <span class="text-cyan-400 font-bold">+{{ d.rewardFlux }} 快子通量</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { tachyonicCausalityMesh, TachyonicMeshState } from '@/engine/tachyonicCausalityMesh'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const state = ref<TachyonicMeshState>(tachyonicCausalityMesh.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number | null = null
let angle = 0

function close() {
  uiStore.closeOverlay()
}

function receiveDispatch(id: string) {
  tachyonicCausalityMesh.receiveFutureTransmission(id)
  state.value = { ...tachyonicCausalityMesh.getState() }
}

function handleTransmitPrecognitive() {
  tachyonicCausalityMesh.transmitPrecognitiveWarning()
  state.value = { ...tachyonicCausalityMesh.getState() }
}

function handleDampenParadox() {
  tachyonicCausalityMesh.dampenCausalityParadox()
  state.value = { ...tachyonicCausalityMesh.getState() }
}

function drawCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  angle += 0.025

  ctx.fillStyle = '#020408'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2

  // 1. 繪製閔可夫斯基時空光錐 (Minkowski Light Cone)
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
  ctx.lineWidth = 1.5

  // 45 度光錐漸近線
  ctx.beginPath()
  ctx.moveTo(cx - 120, cy - 100)
  ctx.lineTo(cx + 120, cy + 100)
  ctx.moveTo(cx - 120, cy + 100)
  ctx.lineTo(cx + 120, cy - 100)
  ctx.stroke()

  // 未來光錐與過去光錐橢圓截面
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)'
  ctx.beginPath()
  ctx.ellipse(cx, cy - 80, 80, 20, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx, cy + 80, 80, 20, 0, 0, Math.PI * 2)
  ctx.stroke()

  // 2. 超光速快子逆時間軌跡 (類空間隔 Spacelike Trajectory)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = -100; x <= 100; x += 5) {
    const t = (x / 50) + angle
    // 快子世界線斜率大於 45 度 (v > c)
    const px = cx + x
    const py = cy + Math.sin(t * 3) * 15 - (x * 0.2)
    if (x === -100) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 3. 原點現在 (Here-Now) 脈衝發光點
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(cx, cy, 5 + Math.sin(angle * 4) * 2, 0, Math.PI * 2)
  ctx.fill()

  animFrame = requestAnimationFrame(drawCanvas)
}

onMounted(() => {
  animFrame = requestAnimationFrame(drawCanvas)
})

onUnmounted(() => {
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame)
  }
})
</script>
