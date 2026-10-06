<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-amber-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🕳️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-amber-400">太初原初黑洞星雲發電機 (Primordial Black Hole Nebula)</h2>
            <p class="text-xs text-zinc-400">大爆炸原初微黑洞群 · 磁約束懸浮籠 · 霍金輻射極限蒸發發電</p>
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
          <div class="relative rounded-xl border border-amber-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
              ⚡ 霍金總發電出力: {{ state.totalGridPowerMW.toLocaleString() }} MW
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
              🧲 磁約束籠穩定度: {{ state.magneticConfinementStabilityPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">霍金光子通量</span>
              <span class="text-lg font-bold font-mono text-amber-400">☀️ {{ state.totalHawkingPhotons }}</span>
              <span class="text-[10px] text-zinc-500">蒸發微爆能量</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">物質原料儲備</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ (state.feedMatterStockpileKg / 1000).toFixed(1) }} 噸</span>
              <span class="text-[10px] text-zinc-500">質量拋投原料</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">併網發電出力</span>
              <span class="text-lg font-bold font-mono text-emerald-400">{{ (state.totalGridPowerMW / 1000).toFixed(2) }} GW</span>
              <span class="text-[10px] text-zinc-500">超導直通全服</span>
            </div>
          </div>

          <!-- 全域控制按鈕 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleTuneCage"
              class="rounded-xl border border-blue-500/60 bg-blue-950/40 hover:bg-blue-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-blue-300">🧲 調諧磁約束懸浮籠</span>
              <span class="text-[10px] text-zinc-400">增強磁力矩防禦黑洞逃逸 (+15%)</span>
            </button>
            <button
              @click="handleDeployMicro"
              class="rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-amber-300">✨ 捕獲新微型太初黑洞</span>
              <span class="text-[10px] text-zinc-400">消耗 300 霍金光子捕獲微奇點</span>
            </button>
          </div>
        </div>

        <!-- 右欄：太初黑洞矩陣 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>🕳️ 原初黑洞發電機列表</span>
            <span class="text-xs text-amber-400 font-mono">光子通量: {{ state.totalHawkingPhotons }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="hole in state.activeHoles"
              :key="hole.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2 hover:border-zinc-700 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ hole.name }}</h4>
                  <p class="text-[11px] text-amber-400 font-mono">出力: {{ hole.powerYieldMW }} MW · 蒸發剩餘: {{ hole.evaporationSecondsRemaining }}s</p>
                </div>
                <div class="flex gap-1.5">
                  <button
                    @click="feedMass(hole.id)"
                    class="rounded-lg px-2.5 py-1 text-xs font-semibold font-mono border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900 text-cyan-200 transition"
                  >
                    補給質量
                  </button>
                  <button
                    @click="harvestBurst(hole.id)"
                    class="rounded-lg px-2.5 py-1 text-xs font-semibold font-mono border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900 text-amber-200 transition"
                  >
                    採集通量
                  </button>
                </div>
              </div>
              <p class="text-[11px] text-zinc-400">{{ hole.description }}</p>
              <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>質量: {{ (hole.massKg).toLocaleString() }} kg</span>
                <span>霍金溫度: {{ hole.hawkingTempKelvin.toExponential(2) }} K</span>
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
import { primordialBlackHole, PBHNebulaState } from '@/engine/primordialBlackHole'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const state = ref<PBHNebulaState>(primordialBlackHole.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number | null = null
let angle = 0

function close() {
  uiStore.closeOverlay()
}

function feedMass(id: string) {
  primordialBlackHole.feedMass(id, 10000)
  state.value = { ...primordialBlackHole.getState() }
}

function harvestBurst(id: string) {
  primordialBlackHole.harvestHawkingBurst(id)
  state.value = { ...primordialBlackHole.getState() }
}

function handleTuneCage() {
  primordialBlackHole.tuneMagneticCage()
  state.value = { ...primordialBlackHole.getState() }
}

function handleDeployMicro() {
  primordialBlackHole.deployNewMicroPBH()
  state.value = { ...primordialBlackHole.getState() }
}

function drawCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  angle += 0.03

  ctx.fillStyle = '#030205'
  ctx.fillRect(0, 0, w, h)

  // 1. 繪製中央磁約束懸浮籠線框 (藍色超導八邊形)
  const cx = w / 2
  const cy = h / 2
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + angle * 0.2
    const px = cx + Math.cos(a) * 85
    const py = cy + Math.sin(a) * 85
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()

  // 2. 繪製多個旋轉微黑洞光斑與愛因斯坦環
  const holes = Object.values(state.value.activeHoles)
  holes.forEach((_h, idx) => {
    const orbitR = 30 + idx * 22
    const theta = angle * (1 + idx * 0.4) + (idx * Math.PI) / 2
    const bx = cx + Math.cos(theta) * orbitR
    const by = cy + Math.sin(theta) * orbitR

    // 霍金光子發射光芒 (金色徑向漸層)
    const radGrd = ctx.createRadialGradient(bx, by, 1, bx, by, 12)
    radGrd.addColorStop(0, '#fef08a')
    radGrd.addColorStop(0.4, '#f59e0b')
    radGrd.addColorStop(1, 'transparent')
    ctx.fillStyle = radGrd
    ctx.beginPath()
    ctx.arc(bx, by, 12, 0, Math.PI * 2)
    ctx.fill()

    // 黑色事件視界中心
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(bx, by, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // 3. 霍金粒子向外射出的粒子光流
  for (let i = 0; i < 16; i++) {
    const pa = (i * Math.PI * 2) / 16 + angle
    const pr = 65 + ((i * 13 + angle * 40) % 60)
    const px = cx + Math.cos(pa) * pr
    const py = cy + Math.sin(pa) * pr
    ctx.fillStyle = 'rgba(251, 191, 36, 0.65)'
    ctx.fillRect(px, py, 2, 2)
  }

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
