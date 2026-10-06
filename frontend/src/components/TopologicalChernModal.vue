<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-emerald-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌀</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-emerald-400">拓撲量子幾何陳類數纖維叢 (Chern Fiber Bundle)</h2>
            <p class="text-xs text-zinc-400">布里淵區貝里曲率積分 · 第一陳類數拓撲不變量 C ∈ ℤ · 無耗散手性邊緣流</p>
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
              💠 第一陳類數: C = {{ state.chernNumber }} (拓撲階數)
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              🛡️ 拓撲保護度: {{ state.topologicalProtectionPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">貝里曲率通量</span>
              <span class="text-lg font-bold font-mono text-emerald-400">{{ state.berryCurvatureFlux.toFixed(2) }} 2π</span>
              <span class="text-[10px] text-zinc-500">布里淵區幾何相位</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">霍爾電導量子化</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.hallConductanceQuantized }} e²/h</span>
              <span class="text-[10px] text-zinc-500">{{ state.chiralEdgeChannels }} 條手性通道</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">手性拓撲通量</span>
              <span class="text-lg font-bold font-mono text-amber-400">✨ {{ state.chiralFluxStockpile }}</span>
              <span class="text-[10px] text-zinc-500">編織次數: {{ state.totalBraids }}</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              @click="handleBraid"
              class="rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-emerald-300">🪢 任意子編織</span>
              <span class="text-[9px] text-zinc-400">拓撲幾何求值</span>
            </button>
            <button
              @click="handleShiftChern(1)"
              :disabled="state.chernNumber >= 4"
              :class="[
                'rounded-xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1',
                state.chernNumber < 4
                  ? 'border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-xs font-bold text-cyan-300">🔼 陳類數 +1</span>
              <span class="text-[9px] text-zinc-400">躍遷電導階數</span>
            </button>
            <button
              @click="handleShiftChern(-1)"
              :disabled="state.chernNumber <= 0"
              :class="[
                'rounded-xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1',
                state.chernNumber > 0
                  ? 'border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-xs font-bold text-amber-300">🔽 陳類數 -1</span>
              <span class="text-[9px] text-zinc-400">退階拓撲物相</span>
            </button>
            <button
              @click="handleReinforce"
              class="rounded-xl border border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-teal-300">🛡️ 強化保護</span>
              <span class="text-[9px] text-zinc-400">防熱退相干</span>
            </button>
          </div>
        </div>

        <!-- 右欄：拓撲物相選擇與手性邊緣波 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🌀 拓撲物質相態模態</span>
            <span class="text-xs text-emerald-400 font-mono">通量: {{ state.chiralFluxStockpile }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="p in phases"
              :key="p.id"
              @click="handleSwitchPhase(p.id)"
              :class="[
                'p-2.5 rounded-xl border text-xs font-semibold transition text-left',
                state.phaseType === p.id
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md shadow-emerald-500/20'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              ]"
            >
              <div class="font-bold">{{ p.name }}</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">{{ p.desc }}</div>
            </button>
          </div>

          <div class="text-xs font-bold text-zinc-400 mt-1">無耗散邊緣態波函數 (Chiral Edge Currents)</div>

          <div class="space-y-1.5 overflow-y-auto max-h-[310px] pr-1">
            <div
              v-for="wave in state.edgeWaves"
              :key="wave.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 flex items-center justify-between hover:border-zinc-700 transition"
            >
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <div>
                  <h4 class="text-xs font-mono font-semibold text-zinc-200">{{ wave.id }}</h4>
                  <p class="text-[10px] text-zinc-400">相速度: {{ wave.speed }}c · 振幅: {{ wave.amplitude }} pm</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-mono font-bold text-emerald-400">無雜質散射</span>
                <p class="text-[9px] text-cyan-400">拓撲保護中</p>
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
import { topologicalChern, ChernPhaseType } from '../engine/topologicalChern'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(topologicalChern.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const phases: Array<{ id: ChernPhaseType; name: string; desc: string }> = [
  { id: 'quantum_hall', name: '量子霍爾態', desc: '整數陳類數無耗散邊界態' },
  { id: 'topological_insulator', name: '拓撲絕緣體', desc: '體內絕緣，表面超導金屬態' },
  { id: 'weyl_semimetal', name: '韋爾半金屬', desc: '拓撲費米弧與軸子異常' },
  { id: 'fractional_chern', name: '分數陳絕緣體', desc: '強關聯分數電荷任意子' }
]

function close() {
  uiStore.closeOverlay()
}

function handleBraid() {
  topologicalChern.braidAnyonicPhases()
  state.value = { ...topologicalChern.getState() }
}

function handleShiftChern(delta: number) {
  topologicalChern.shiftChernNumber(delta)
  state.value = { ...topologicalChern.getState() }
}

function handleReinforce() {
  topologicalChern.reinforceProtection()
  state.value = { ...topologicalChern.getState() }
}

function handleSwitchPhase(phase: ChernPhaseType) {
  topologicalChern.switchPhase(phase)
  state.value = { ...topologicalChern.getState() }
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

  ctx.fillStyle = '#020905'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.002
  const C = state.value.chernNumber

  // 繪製布里淵區貝里曲率旋渦網格
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)'
  ctx.lineWidth = 1
  for (let r = 20; r <= 100; r += 20) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 繪製手性邊緣流軌跡 (邊界順時針旋轉粒子)
  const edgeRadius = 110
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, edgeRadius, 0, Math.PI * 2)
  ctx.stroke()

  const particleCount = 12 + C * 4
  for (let i = 0; i < particleCount; i++) {
    const angle = (i * Math.PI * 2) / particleCount + t * 1.5
    const px = cx + Math.cos(angle) * edgeRadius
    const py = cy + Math.sin(angle) * edgeRadius

    ctx.fillStyle = '#34d399'
    ctx.shadowColor = '#34d399'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(px, py, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 中心貝里曲率奇異點
  ctx.fillStyle = '#6ee7b7'
  ctx.beginPath()
  ctx.arc(cx, cy, 5 + Math.sin(t * 4) * 2, 0, Math.PI * 2)
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
