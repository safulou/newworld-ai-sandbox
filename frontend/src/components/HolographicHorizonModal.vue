<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-emerald-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌐</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-emerald-400">全息宇宙事件視界編碼矩陣 (Holographic Horizon Matrix)</h2>
            <p class="text-xs text-zinc-400">全息原理 (Holographic Principle) · AdS/CFT 體-邊界共形場對偶 · 貝肯斯坦-霍金熵</p>
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
          <div class="relative rounded-xl border border-emerald-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              💠 龐加萊圓盤邊界 CFT (d={{ state.bulkDimensions - 1 }}) ↔ AdS_{{ state.bulkDimensions }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-teal-500/30 text-[11px] text-teal-300 font-mono">
              ⚡ 對偶保真度: {{ state.cftDualityFidelityPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">全息位元流通量</span>
              <span class="text-lg font-bold font-mono text-emerald-400">📡 {{ state.holographicBitsStream }}</span>
              <span class="text-[10px] text-zinc-500">投影產出貨幣</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">貝肯斯坦-霍金熵</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.bekensteinEntropyBits.toLocaleString() }} bits</span>
              <span class="text-[10px] text-zinc-500">S = A / 4 普朗克極限</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">視界表面積</span>
              <span class="text-lg font-bold font-mono text-amber-400">{{ state.horizonAreaPlanck2.toLocaleString() }} ℓ_p²</span>
              <span class="text-[10px] text-zinc-500">累計投影: {{ state.totalProjectionsCount }} 次</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              @click="handleProjectBulk"
              class="rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-emerald-300">🌌 體空間投影</span>
              <span class="text-[9px] text-zinc-400">重力映射至邊界場</span>
            </button>
            <button
              @click="handleSyncDuality"
              class="rounded-xl border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-cyan-300">🔄 同步共形對偶</span>
              <span class="text-[9px] text-zinc-400">提升 AdS/CFT 保真度</span>
            </button>
            <button
              @click="handleExpandHorizon"
              :disabled="state.holographicBitsStream < 250"
              :class="[
                'rounded-xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1',
                state.holographicBitsStream >= 250
                  ? 'border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-xs font-bold text-amber-300">📐 擴展視界面積</span>
              <span class="text-[9px] text-zinc-400">耗費 250 位元 (+512)</span>
            </button>
            <button
              @click="handleCompressBulk"
              class="rounded-xl border border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-teal-300">🗜️ 體拓撲壓縮</span>
              <span class="text-[9px] text-zinc-400">高維切片獲取位元流</span>
            </button>
          </div>
        </div>

        <!-- 右欄：邊界量子位元與糾纏環 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🌐 邊界 CFT 量子位元矩陣</span>
            <span class="text-xs text-emerald-400 font-mono">位元: {{ state.holographicBitsStream }}</span>
          </div>

          <div class="text-xs font-bold text-zinc-400">視界周長量子態 (Boundary Horizon Qubits)</div>

          <div class="space-y-2 overflow-y-auto max-h-[390px] pr-1">
            <div
              v-for="qubit in state.boundaryQubits"
              :key="qubit.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2.5 flex items-center justify-between hover:border-zinc-700 transition"
            >
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'w-2 h-2 rounded-full',
                    qubit.stateValue === 1 ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-cyan-500'
                  ]"
                ></span>
                <div>
                  <h4 class="text-xs font-mono font-semibold text-zinc-200">{{ qubit.id }}</h4>
                  <p class="text-[10px] text-zinc-400">相位角: {{ (qubit.polarTheta * 180 / Math.PI).toFixed(1) }}°</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-mono font-bold text-emerald-300">|{{ qubit.stateValue }}⟩</span>
                <p class="text-[10px] text-zinc-400">
                  <span v-if="qubit.entangled" class="text-teal-400">● 全息糾纏中</span>
                  <span v-else class="text-zinc-500">○ 自由自旋態</span>
                </p>
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
import { holographicHorizon } from '../engine/holographicHorizon'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(holographicHorizon.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

function close() {
  uiStore.closeOverlay()
}

function handleProjectBulk() {
  holographicHorizon.projectBulkToBoundary()
  state.value = { ...holographicHorizon.getState() }
}

function handleSyncDuality() {
  holographicHorizon.syncAdSCFTDuality()
  state.value = { ...holographicHorizon.getState() }
}

function handleExpandHorizon() {
  holographicHorizon.expandHorizonArea()
  state.value = { ...holographicHorizon.getState() }
}

function handleCompressBulk() {
  holographicHorizon.compressBulkSlice()
  state.value = { ...holographicHorizon.getState() }
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
  const r = 95

  ctx.fillStyle = '#020907'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.002

  // 繪製龐加萊雙曲圓盤背景漸層
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r)
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)')
  grad.addColorStop(0.7, 'rgba(6, 95, 70, 0.15)')
  grad.addColorStop(1, 'rgba(2, 9, 7, 0.95)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  // 繪製 Ryu-Takayanagi 測地線 (Geodesics)
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)'
  ctx.lineWidth = 1.2
  for (let i = 0; i < 8; i++) {
    const a1 = (i * Math.PI) / 4 + t * 0.2
    const a2 = a1 + Math.PI / 2
    const x1 = cx + Math.cos(a1) * r
    const y1 = cy + Math.sin(a1) * r
    const x2 = cx + Math.cos(a2) * r
    const y2 = cy + Math.sin(a2) * r

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    // 彎曲至體空間核心
    ctx.quadraticCurveTo(cx, cy, x2, y2)
    ctx.stroke()
  }

  // 繪製視界邊界 CFT 圓環
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // 繪製 24 個邊界量子位元
  const qubits = state.value.boundaryQubits
  qubits.forEach(q => {
    const theta = q.polarTheta + t * 0.1
    const px = cx + Math.cos(theta) * r
    const py = cy + Math.sin(theta) * r

    ctx.fillStyle = q.stateValue === 1 ? '#34d399' : '#06b6d4'
    ctx.shadowColor = q.stateValue === 1 ? '#34d399' : '#06b6d4'
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  })

  // 繪製體幾何中心特徵點
  ctx.fillStyle = '#6ee7b7'
  ctx.beginPath()
  ctx.arc(cx, cy, 4 + Math.sin(t * 3) * 1.5, 0, Math.PI * 2)
  ctx.fill()

  animFrameId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  if (canvasRef.value) renderCanvas()
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>
