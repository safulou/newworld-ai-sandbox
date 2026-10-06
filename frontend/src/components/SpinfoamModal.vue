<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🕸️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-indigo-400">時空量子幾何自旋泡沫網絡 (Spinfoam Geometry Lattice)</h2>
            <p class="text-xs text-zinc-400">圈量子引力 (LQG) 普朗克節點演化 · 4-單純形幾何躍遷 · 離散面積與曲率量子</p>
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
          <div class="relative rounded-xl border border-indigo-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-indigo-500/30 text-[11px] text-indigo-300 font-mono">
              📐 幾何模態: {{ latticeName(state.currentLattice) }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              🔮 4-單純形相干度: {{ state.fourSimplexCoherencePercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">離散曲率量子</span>
              <span class="text-lg font-bold font-mono text-indigo-400">✨ {{ state.quantumCurvatureQuanta }}</span>
              <span class="text-[10px] text-zinc-500">時空微元能量</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">平均自旋數 j</span>
              <span class="text-lg font-bold font-mono text-purple-400">{{ state.averageSpinQuantum.toFixed(2) }} ℏ</span>
              <span class="text-[10px] text-zinc-500">普朗克截面特徵</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">量子體積</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.totalQuantumVolumePlanck }} ℓ_p³</span>
              <span class="text-[10px] text-zinc-500">16 普朗克節點</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="handleEvolveNetwork"
              class="rounded-xl border border-indigo-500/60 bg-indigo-950/40 hover:bg-indigo-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-indigo-300">🌌 演化自旋網絡</span>
              <span class="text-[10px] text-zinc-400">量子躍遷節點自旋 j</span>
            </button>
            <button
              @click="handleExciteCurvature"
              class="rounded-xl border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-purple-300">✨ 激發曲率量子</span>
              <span class="text-[10px] text-zinc-400">收穫幾何躍遷能量</span>
            </button>
            <button
              @click="handleHarmonizeSimplex"
              class="rounded-xl border border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-teal-300">⚖️ 諧振單純形幾何</span>
              <span class="text-[10px] text-zinc-400">提升 4-單純形相干度</span>
            </button>
          </div>
        </div>

        <!-- 右欄：幾何模態選擇與普朗克節點清單 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>📐 空間晶格幾何模態</span>
            <span class="text-xs text-indigo-400 font-mono">曲率: {{ state.quantumCurvatureQuanta }}</span>
          </div>

          <!-- 晶格切換按鈕組 -->
          <div class="grid grid-cols-4 gap-1.5">
            <button
              v-for="lat in latticeTypes"
              :key="lat.id"
              @click="handleSwitchLattice(lat.id)"
              :class="[
                'px-2 py-1.5 rounded-lg text-xs font-semibold transition',
                state.currentLattice === lat.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              ]"
            >
              {{ lat.name }}
            </button>
          </div>

          <div class="text-xs font-bold text-zinc-400 mt-2">普朗克節點自旋與本徵面積 (LQG Nodes)</div>

          <div class="space-y-2 overflow-y-auto max-h-[350px] pr-1">
            <div
              v-for="node in state.nodes"
              :key="node.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2.5 flex items-center justify-between hover:border-zinc-700 transition"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                <div>
                  <h4 class="text-xs font-mono font-semibold text-zinc-200">{{ node.id }}</h4>
                  <p class="text-[10px] text-zinc-400">纏結者 i_{{ node.intertwinerVal }} · 座標 ({{ node.x }}, {{ node.y }}, {{ node.z }})</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-mono font-bold text-indigo-400">j = {{ node.spinJ.toFixed(1) }}</span>
                <p class="text-[10px] text-amber-300/80 font-mono">面積: {{ node.areaQuantum }} ℓ_p²</p>
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
import { spinfoamGeometry, GeometryLatticeType } from '../engine/spinfoamGeometry'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(spinfoamGeometry.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const latticeTypes: Array<{ id: GeometryLatticeType; name: string }> = [
  { id: 'tetrahedron', name: '正四面體' },
  { id: 'hypersphere', name: '超球面' },
  { id: 'pentachoron', name: '五胞體' },
  { id: 'torus', name: '克萊因環' }
]

function latticeName(type: GeometryLatticeType): string {
  const match = latticeTypes.find(l => l.id === type)
  return match ? match.name : type
}

function close() {
  uiStore.closeOverlay()
}

function handleSwitchLattice(type: GeometryLatticeType) {
  spinfoamGeometry.switchLattice(type)
  state.value = { ...spinfoamGeometry.getState() }
}

function handleEvolveNetwork() {
  spinfoamGeometry.evolveSpinNetwork()
  state.value = { ...spinfoamGeometry.getState() }
}

function handleExciteCurvature() {
  spinfoamGeometry.exciteQuantumCurvature()
  state.value = { ...spinfoamGeometry.getState() }
}

function handleHarmonizeSimplex() {
  spinfoamGeometry.harmonizeSimplexAmplitude()
  state.value = { ...spinfoamGeometry.getState() }
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

  ctx.fillStyle = '#05040a'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.0015
  const nodes = state.value.nodes

  // 繪製節點間的 4-單純形自旋泡沫連接線
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)'
  ctx.lineWidth = 1.2
  for (let i = 0; i < nodes.length; i++) {
    for (let k = i + 1; k < nodes.length; k++) {
      if ((i + k) % 3 === 0) {
        const n1 = nodes[i]
        const n2 = nodes[k]
        // 3D 投影旋轉
        const cosT = Math.cos(t)
        const sinT = Math.sin(t)
        const x1 = cx + n1.x * cosT - n1.z * sinT
        const y1 = cy + n1.y
        const x2 = cx + n2.x * cosT - n2.z * sinT
        const y2 = cy + n2.y

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
  }

  // 繪製普朗克自旋節點
  nodes.forEach(n => {
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const px = cx + n.x * cosT - n.z * sinT
    const py = cy + n.y

    const radius = 3 + n.spinJ * 2
    ctx.fillStyle = n.spinJ >= 1.5 ? '#a855f7' : '#6366f1'
    ctx.shadowColor = '#818cf8'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(px, py, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  })

  animFrameId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  if (canvasRef.value) renderCanvas()
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>
