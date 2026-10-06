<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-sky-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-sky-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌉</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-sky-400">量子引力蟲洞橋 (ER=EPR Quantum Wormhole)</h2>
            <p class="text-xs text-zinc-400">愛因斯坦-羅森橋 · 卡西米爾負能量喉部支撐 · 莫里斯-索恩可穿越幾何</p>
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
          <div class="relative rounded-xl border border-sky-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-sky-500/30 text-[11px] text-sky-300 font-mono">
              🌌 拓撲型態: {{ topologyName(state.topologyType) }}
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              ⚡ 糾纏保真度: {{ state.entanglementFidelityPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">喉部半徑</span>
              <span class="text-lg font-bold font-mono text-sky-400">{{ state.throatRadiusPlanck }} ℓ_p</span>
              <span class="text-[10px] text-zinc-500">可穿越空間跨度</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">卡西米爾負能量</span>
              <span class="text-lg font-bold font-mono text-purple-400">{{ state.casimirNegativeEnergyPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-purple-500 h-full" :style="{ width: `${state.casimirNegativeEnergyPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">穿越通量貨幣</span>
              <span class="text-lg font-bold font-mono text-amber-400">✨ {{ state.traversableFlux }}</span>
              <span class="text-[10px] text-zinc-500">傳態完成: {{ state.totalTeleportations }} 次</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              @click="handleInjectCasimir"
              class="rounded-xl border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-purple-300">🌀 注入負能量</span>
              <span class="text-[9px] text-zinc-400">防範重力塌縮</span>
            </button>
            <button
              @click="handleTeleport"
              class="rounded-xl border border-sky-500/60 bg-sky-950/40 hover:bg-sky-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-sky-300">⚡ 穿喉傳態</span>
              <span class="text-[9px] text-zinc-400">ER=EPR 穿梭</span>
            </button>
            <button
              @click="handleStabilize"
              class="rounded-xl border border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-teal-300">⚖️ 校準糾纏</span>
              <span class="text-[9px] text-zinc-400">提升雙端保真</span>
            </button>
            <button
              @click="handleWiden"
              :disabled="state.traversableFlux < 120"
              :class="[
                'rounded-xl border p-2.5 text-center transition flex flex-col items-center justify-center gap-1',
                state.traversableFlux >= 120
                  ? 'border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-xs font-bold text-amber-300">📐 拓寬喉徑</span>
              <span class="text-[9px] text-zinc-400">耗費 120 通量</span>
            </button>
          </div>
        </div>

        <!-- 右欄：拓撲切換與喉部幾何節點 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🌌 蟲洞時空拓撲模態</span>
            <span class="text-xs text-sky-400 font-mono">通量: {{ state.traversableFlux }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="topo in topologies"
              :key="topo.id"
              @click="handleSwitchTopology(topo.id)"
              :class="[
                'p-2 rounded-xl border text-xs font-semibold transition text-left',
                state.topologyType === topo.id
                  ? 'border-sky-500 bg-sky-950/60 text-sky-200 shadow-md shadow-sky-500/20'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              ]"
            >
              <div class="font-bold">{{ topo.name }}</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">{{ topo.desc }}</div>
            </button>
          </div>

          <div class="text-xs font-bold text-zinc-400 mt-1">喉部雙曲深度節點 (Throat Hyperbolic Slices)</div>

          <div class="space-y-1.5 overflow-y-auto max-h-[310px] pr-1">
            <div
              v-for="node in state.throatNodes"
              :key="node.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 flex items-center justify-between hover:border-zinc-700 transition"
            >
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <div>
                  <h4 class="text-xs font-mono font-semibold text-zinc-200">z = {{ node.zCoord > 0 ? `+${node.zCoord}` : node.zCoord }}</h4>
                  <p class="text-[10px] text-zinc-400">卡西米爾相角: {{ (node.phase * 180 / Math.PI).toFixed(0) }}°</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-mono font-bold text-sky-400">r = {{ node.radius }}</span>
                <p class="text-[9px] text-purple-400">雙曲極小值面</p>
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
import { wormholeBridge, WormholeTopologyType } from '../engine/wormholeBridge'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(wormholeBridge.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const topologies: Array<{ id: WormholeTopologyType; name: string; desc: string }> = [
  { id: 'morris_thorne', name: '莫里斯-索恩', desc: '球對稱無奇點可穿越蟲洞' },
  { id: 'planckian', name: '普朗克微蟲洞', desc: '量子時空泡沫微觀短暫連通' },
  { id: 'kerr_rift', name: '克爾旋轉裂隙', desc: '角動量奇異環引力橋' },
  { id: 'higher_dim', name: '五維高維重力通道', desc: '膜宇宙 Randall-Sundrum 捷徑' }
]

function topologyName(type: WormholeTopologyType): string {
  const match = topologies.find(t => t.id === type)
  return match ? match.name : type
}

function close() {
  uiStore.closeOverlay()
}

function handleInjectCasimir() {
  wormholeBridge.injectCasimirNegativeEnergy()
  state.value = { ...wormholeBridge.getState() }
}

function handleTeleport() {
  wormholeBridge.teleportQuantumPayload()
  state.value = { ...wormholeBridge.getState() }
}

function handleStabilize() {
  wormholeBridge.stabilizeEntanglement()
  state.value = { ...wormholeBridge.getState() }
}

function handleWiden() {
  wormholeBridge.widenThroat()
  state.value = { ...wormholeBridge.getState() }
}

function handleSwitchTopology(type: WormholeTopologyType) {
  wormholeBridge.switchTopology(type)
  state.value = { ...wormholeBridge.getState() }
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

  ctx.fillStyle = '#03050c'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.002
  const nodes = state.value.throatNodes

  // 繪製透視雙曲漏斗輪廓
  ctx.lineWidth = 1.2
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const zOffset = node.zCoord * 10
    const ringRadius = node.radius * 1.8 + Math.sin(t * 2 + node.phase) * 3

    ctx.strokeStyle = i === 5 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(125, 211, 252, 0.35)'
    ctx.beginPath()
    ctx.ellipse(cx + zOffset * 1.8, cy, ringRadius * 0.4, ringRadius, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 繪製喉部中心量子糾纏流線
  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = -100; x <= 100; x += 10) {
    const px = cx + x * 1.8
    const py = cy + Math.sin(x * 0.08 + t * 4) * 12
    if (x === -100) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 雙端開口發光特徵
  ctx.fillStyle = '#38bdf8'
  ctx.shadowColor = '#38bdf8'
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.arc(cx - 90 * 1.8, cy, 6, 0, Math.PI * 2)
  ctx.arc(cx + 90 * 1.8, cy, 6, 0, Math.PI * 2)
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
