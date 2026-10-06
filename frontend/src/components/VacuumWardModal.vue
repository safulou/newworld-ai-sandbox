<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-red-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-red-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🛡️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-red-400">暗能量真空衰變抵禦力場 (Vacuum Decay Ward)</h2>
            <p class="text-xs text-zinc-400">希格斯勢能偽真空相變防護 · 超對稱防護天幕 (SUSY Phase Screen)</p>
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
          <div class="relative rounded-xl border border-red-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-red-500/30 text-[11px] text-red-300 font-mono">
              💥 擴散中相變泡泡半徑: {{ state.decayBubbleRadiusKm.toLocaleString() }} km
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              🛡️ 天幕阻尼強度: {{ state.susyFieldStrengthPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">希格斯場勢能</span>
              <span class="text-lg font-bold font-mono text-amber-400">{{ state.higgsFieldPotentialGeV.toFixed(3) }} GeV</span>
              <span class="text-[10px] text-zinc-500">標準 125.09 GeV</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">真空間穩定度</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.fieldStabilityPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-cyan-500 h-full" :style="{ width: `${state.fieldStabilityPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">超對稱真空精華</span>
              <span class="text-lg font-bold font-mono text-purple-400">✨ {{ state.vacuumEssence }}</span>
              <span class="text-[10px] text-zinc-500">抵禦次數: {{ state.totalIncursionsRepelled }}</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="handleActivateScreen"
              class="rounded-xl border border-red-500/60 bg-red-950/40 hover:bg-red-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-red-300">💥 展開超對稱天幕</span>
              <span class="text-[10px] text-zinc-400">強行壓縮排斥相變泡泡</span>
            </button>
            <button
              @click="handleStabilizeHiggs"
              class="rounded-xl border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-cyan-300">⚖️ 平息希格斯微擾</span>
              <span class="text-[10px] text-zinc-400">校準勢能回歸 125.09</span>
            </button>
            <button
              @click="handleHarvestEssence"
              class="rounded-xl border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-purple-300">🔮 萃取真空精華</span>
              <span class="text-[10px] text-zinc-400">獲取超對稱能量點</span>
            </button>
          </div>
        </div>

        <!-- 右欄：超對稱錨點加固矩陣 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🛡️ 超對稱穩定錨點陣列</span>
            <span class="text-xs text-purple-400 font-mono">精華: {{ state.vacuumEssence }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="anchor in state.anchors"
              :key="anchor.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2 hover:border-zinc-700 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ anchor.name }}</h4>
                  <p class="text-[11px] text-zinc-400">{{ anchor.field }} · Lv.{{ anchor.level }}</p>
                </div>
                <button
                  @click="reinforceAnchor(anchor.id)"
                  :disabled="state.vacuumEssence < anchor.costEssence"
                  class="rounded-lg px-3 py-1.5 text-xs font-semibold font-mono transition border"
                  :class="state.vacuumEssence >= anchor.costEssence ? 'border-purple-500 bg-purple-900/50 hover:bg-purple-800 text-purple-200' : 'border-zinc-700 bg-zinc-800/50 text-zinc-500 cursor-not-allowed'"
                >
                  升級 ({{ anchor.costEssence }})
                </button>
              </div>
              <p class="text-[11px] text-zinc-400">{{ anchor.description }}</p>
              <div class="flex items-center justify-between text-[10px] text-zinc-500">
                <span>防護效率加乘: +{{ (anchor.efficiencyBonus * 100).toFixed(0) }}%</span>
                <span>自動天幕回充率: +{{ (anchor.level * 0.1).toFixed(1) }}/s</span>
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
import { vacuumDecayWard, VacuumWardState } from '@/engine/vacuumDecayWard'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const state = ref<VacuumWardState>(vacuumDecayWard.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number | null = null
let angle = 0

function close() {
  uiStore.closeOverlay()
}

function reinforceAnchor(id: string) {
  vacuumDecayWard.reinforceAnchor(id)
  state.value = { ...vacuumDecayWard.getState() }
}

function handleActivateScreen() {
  vacuumDecayWard.activateSupersymmetricScreen()
  state.value = { ...vacuumDecayWard.getState() }
}

function handleStabilizeHiggs() {
  vacuumDecayWard.stabilizeHiggsField()
  state.value = { ...vacuumDecayWard.getState() }
}

function handleHarvestEssence() {
  vacuumDecayWard.harvestVacuumEssence()
  state.value = { ...vacuumDecayWard.getState() }
}

function drawCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  angle += 0.025

  ctx.fillStyle = '#050308'
  ctx.fillRect(0, 0, w, h)

  // 1. 繪製背景墨西哥帽雙井勢能曲線 (Higgs Mexican Hat Potential)
  ctx.strokeStyle = 'rgba(255, 60, 60, 0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = 0; x < w; x += 4) {
    const normX = (x - w / 2) / 80
    // V(phi) = -mu^2 phi^2 + lambda phi^4
    const potY = h / 2 + 50 - (normX * normX * 18 - Math.pow(normX, 4) * 1.5)
    if (x === 0) ctx.moveTo(x, potY)
    else ctx.lineTo(x, potY)
  }
  ctx.stroke()

  // 2. 繪製中央展開中的超對稱防護光幕 (綠/青色同心圓弧)
  const cx = w / 2
  const cy = h / 2
  const susyRadius = 70 + Math.sin(angle * 2) * 5
  ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 + (state.value.susyFieldStrengthPercent / 200)})`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, susyRadius, 0, Math.PI * 2)
  ctx.stroke()

  // 旋轉防護符號
  for (let i = 0; i < 4; i++) {
    const theta = angle + (i * Math.PI) / 2
    const px = cx + Math.cos(theta) * susyRadius
    const py = cy + Math.sin(theta) * susyRadius
    ctx.fillStyle = '#34d399'
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. 繪製向內侵蝕的真真空破滅泡泡邊界 (深紅衝擊波)
  const bubbleVisualRadius = Math.min(130, 80 + (state.value.decayBubbleRadiusKm / 100000) * 45)
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'
  ctx.setLineDash([6, 6])
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, bubbleVisualRadius, 0, Math.PI * 2)
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
