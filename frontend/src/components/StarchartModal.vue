<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🗺️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-indigo-400">量子糾纏全息星圖沙盤 (Quantum Holo-Starchart)</h2>
            <p class="text-xs text-zinc-400">宇宙纖維網拓撲觀測 · 多尺度宏觀星系縮放 · 量子中繼中樞</p>
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
          <!-- 尺度切換標籤列 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="scale in scaleOptions"
              :key="scale.id"
              @click="setZoom(scale.id)"
              class="rounded-lg px-2 py-1.5 text-xs font-semibold border transition text-center"
              :class="state.currentZoom === scale.id ? 'border-indigo-500 bg-indigo-900/60 text-indigo-200' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'"
            >
              {{ scale.label }}
            </button>
          </div>

          <!-- Canvas 視訊區 -->
          <div class="relative rounded-xl border border-indigo-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-indigo-500/30 text-[11px] text-indigo-300 font-mono">
              🌌 當前尺度: {{ currentScaleLabel }} (可視節點: {{ filteredNodes.length }})
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-teal-500/30 text-[11px] text-teal-300 font-mono">
              🔗 量子糾纏同步率: {{ state.entanglementSyncRatePercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">星圖製圖數據</span>
              <span class="text-lg font-bold font-mono text-indigo-400">📊 {{ state.stellarCartographyData }}</span>
              <span class="text-[10px] text-zinc-500">拓撲研究點數</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">已觀測宇宙纖維</span>
              <span class="text-lg font-bold font-mono text-cyan-400">🕸️ {{ state.observedFilamentCount }} 條</span>
              <span class="text-[10px] text-zinc-500">超星系團長城</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">糾纏同步率</span>
              <span class="text-lg font-bold font-mono text-emerald-400">{{ state.entanglementSyncRatePercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-emerald-500 h-full" :style="{ width: `${state.entanglementSyncRatePercent}%` }"></div>
              </div>
            </div>
          </div>

          <!-- 動作按鈕 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleScanRegion"
              class="rounded-xl border border-indigo-500/60 bg-indigo-950/40 hover:bg-indigo-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-indigo-300">🔭 掃描深空星區</span>
              <span class="text-[10px] text-zinc-400">獲取星圖數據與發現新纖維網</span>
            </button>
            <button
              @click="handleAnalyzeFilament"
              :disabled="state.stellarCartographyData < 80"
              class="rounded-xl border p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
              :class="state.stellarCartographyData >= 80 ? 'border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 text-teal-300' : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 cursor-not-allowed'"
            >
              <span class="text-sm font-bold">🧬 解析暗物質纖維網</span>
              <span class="text-[10px] text-zinc-400">消耗 80 點數據提升 6% 糾纏同步率</span>
            </button>
          </div>
        </div>

        <!-- 右欄：天體結點列表 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>✨ 當前尺度天體結點</span>
            <span class="text-xs text-indigo-400 font-mono">製圖數據: {{ state.stellarCartographyData }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="node in filteredNodes"
              :key="node.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2 hover:border-zinc-700 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ node.name }}</h4>
                  <p class="text-[11px] text-zinc-400">{{ node.spectralType }}</p>
                </div>
                <button
                  v-if="!node.entangled"
                  @click="syncRelay(node.id)"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold font-mono border border-indigo-500/60 bg-indigo-950/40 hover:bg-indigo-900 text-indigo-200 transition"
                >
                  量子同調
                </button>
                <span v-else class="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  ✓ 已糾纏
                </span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>活躍指數: {{ node.activityLevel.toFixed(0) }}%</span>
                <span>暗物質密度: {{ node.darkMatterDensity }}×</span>
                <span>坐標: ({{ node.x }}, {{ node.y }}, {{ node.z }})</span>
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
import { cosmicHoloStarchart, StarchartState, StarchartZoomLevel, CosmicNode } from '@/engine/cosmicHoloStarchart'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const state = ref<StarchartState>(cosmicHoloStarchart.getState())
const filteredNodes = computed<CosmicNode[]>(() => cosmicHoloStarchart.filteredNodes)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number | null = null
let angle = 0

const scaleOptions: { id: StarchartZoomLevel; label: string }[] = [
  { id: 'system_sandbox', label: '沙盒星系 (1 AU)' },
  { id: 'stellar_neighborhood', label: '鄰近恆星 (10 pc)' },
  { id: 'local_supercluster', label: '本超星系團 (10 Mpc)' },
  { id: 'cosmic_web', label: '宇宙纖維網 (100 Mpc)' }
]

const currentScaleLabel = computed(() => {
  return scaleOptions.find(s => s.id === state.value.currentZoom)?.label || ''
})

function close() {
  uiStore.closeOverlay()
}

function setZoom(scale: StarchartZoomLevel) {
  cosmicHoloStarchart.setZoomScale(scale)
  state.value = { ...cosmicHoloStarchart.getState() }
}

function syncRelay(id: string) {
  cosmicHoloStarchart.syncEntangledRelay(id)
  state.value = { ...cosmicHoloStarchart.getState() }
}

function handleScanRegion() {
  cosmicHoloStarchart.scanStellarRegion()
  state.value = { ...cosmicHoloStarchart.getState() }
}

function handleAnalyzeFilament() {
  cosmicHoloStarchart.analyzeDarkMatterFilament()
  state.value = { ...cosmicHoloStarchart.getState() }
}

function drawCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  angle += 0.015

  ctx.fillStyle = '#020208'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2

  // 1. 繪製背景宇宙纖維網連線 (暗紫/青色細線)
  const nodes = filteredNodes.value
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)'
  ctx.lineWidth = 1

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i]
      const n2 = nodes[j]
      const x1 = cx + n1.x * 1.5 + Math.cos(angle + i) * 6
      const y1 = cy + n1.y * 1.2 + Math.sin(angle + i) * 6
      const x2 = cx + n2.x * 1.5 + Math.cos(angle + j) * 6
      const y2 = cy + n2.y * 1.2 + Math.sin(angle + j) * 6

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  // 2. 繪製結點發光球體
  nodes.forEach((n: CosmicNode, idx: number) => {
    const px = cx + n.x * 1.5 + Math.cos(angle + idx) * 6
    const py = cy + n.y * 1.2 + Math.sin(angle + idx) * 6

    const rad = n.entangled ? 8 : 5
    const glow = ctx.createRadialGradient(px, py, 1, px, py, rad * 2)
    glow.addColorStop(0, n.entangled ? '#34d399' : '#818cf8')
    glow.addColorStop(1, 'transparent')

    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(px, py, rad * 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = n.entangled ? '#10b981' : '#6366f1'
    ctx.beginPath()
    ctx.arc(px, py, rad, 0, Math.PI * 2)
    ctx.fill()
  })

  // 3. 繪製全息掃描標尺圓環
  ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.arc(cx, cy, 100, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

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
