<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-amber-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">〰️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-amber-400">宇宙弦微波背景輻射透鏡測繪儀 (Cosmic String Cartographer)</h2>
            <p class="text-xs text-zinc-400">一維太初拓撲缺陷 · 錐形空間度規雙重透鏡 · Kaiser-Stebbins 效應</p>
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
              📐 幾何角虧缺: Δθ = {{ state.deficitAngleArcsec }} 角秒
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-rose-500/30 text-[11px] text-rose-300 font-mono">
              💥 尖端/扭結引力波爆發: {{ state.gravitationalWaveBursts }} 次
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">宇宙弦張力 Gμ</span>
              <span class="text-lg font-bold font-mono text-amber-400">{{ state.stringTensionGmuE7.toFixed(2) }} × 10⁻⁷</span>
              <span class="text-[10px] text-zinc-500">超高線性質量密度</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">CMB 階躍溫差</span>
              <span class="text-lg font-bold font-mono text-cyan-400">{{ state.cmbStepDeltaMicroK }} μK</span>
              <span class="text-[10px] text-zinc-500">Kaiser-Stebbins 效應</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">測繪數據通量</span>
              <span class="text-lg font-bold font-mono text-emerald-400">✨ {{ state.cosmicStringFlux }}</span>
              <span class="text-[10px] text-zinc-500">覆蓋率: {{ state.surveyCoveragePercent.toFixed(1) }}%</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-4 gap-2">
            <button
              @click="handleDetectBurst"
              class="rounded-xl border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-rose-300">⚡ 捕捉引力微爆</span>
              <span class="text-[9px] text-zinc-400">尖端 Cusp 爆發</span>
            </button>
            <button
              @click="handleSurveyCMB"
              class="rounded-xl border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-cyan-300">🔭 巡天測繪 CMB</span>
              <span class="text-[9px] text-zinc-400">掃描雙重透鏡像</span>
            </button>
            <button
              @click="handleAdjustTension(0.1)"
              class="rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-amber-300">➕ 增強弦張力</span>
              <span class="text-[9px] text-zinc-400">+0.1 × 10⁻⁷</span>
            </button>
            <button
              @click="handleAdjustTension(-0.1)"
              class="rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 p-2.5 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-xs font-bold text-emerald-300">➖ 減弱弦張力</span>
              <span class="text-[9px] text-zinc-400">-0.1 × 10⁻⁷</span>
            </button>
          </div>
        </div>

        <!-- 右欄：宇宙弦型態與觀測幾何 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>〰️ 宇宙弦拓撲分類</span>
            <span class="text-xs text-amber-400 font-mono">通量: {{ state.cosmicStringFlux }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="s in stringTypes"
              :key="s.id"
              @click="handleSwitchType(s.id)"
              :class="[
                'p-2.5 rounded-xl border text-xs font-semibold transition text-left',
                state.stringType === s.id
                  ? 'border-amber-500 bg-amber-950/60 text-amber-200 shadow-md shadow-amber-500/20'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              ]"
            >
              <div class="font-bold">{{ s.name }}</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">{{ s.desc }}</div>
            </button>
          </div>

          <div class="text-xs font-bold text-zinc-400 mt-1">重力透鏡雙重成像幾何參數</div>

          <div class="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-amber-300">錐形度規角虧缺 Δθ = 8πGμ</span>
                <span class="font-mono text-zinc-300">{{ state.deficitAngleArcsec }} arcsec</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-cyan-300">CMB 溫度微擾階躍 ΔT/T</span>
                <span class="font-mono text-zinc-300">~ 2.8 × 10⁻⁵</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-rose-300">閉合振盪環總數</span>
                <span class="font-mono text-zinc-300">{{ state.stringLoopCount }} 個天體環</span>
              </div>
              <div class="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span class="text-emerald-300 font-bold">巡天測繪進度</span>
                <div class="flex items-center gap-2">
                  <div class="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full" :style="{ width: `${state.surveyCoveragePercent}%` }"></div>
                  </div>
                  <span class="font-mono text-emerald-400 font-bold">{{ state.surveyCoveragePercent.toFixed(1) }}%</span>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { cosmicStringCartographer, CosmicStringType } from '../engine/cosmicStringCartographer'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(cosmicStringCartographer.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const stringTypes: Array<{ id: CosmicStringType; name: string; desc: string }> = [
  { id: 'oscillating_loop', name: '閉合振盪環', desc: '迴圈收縮輻射高頻引力波' },
  { id: 'nambu_goto_open', name: '南部-後藤長弦', desc: '穿透全天域之無限長開放弦' },
  { id: 'superconducting_string', name: '超導宇宙弦', desc: '攜帶巨大電流電磁高能爆發' },
  { id: 'cosmic_superstring', name: '基本宇宙超弦', desc: '暴脹膨脹至天文尺度的 D 膜' }
]

function close() {
  uiStore.closeOverlay()
}

function handleDetectBurst() {
  cosmicStringCartographer.detectGravitationalBurst()
  state.value = { ...cosmicStringCartographer.getState() }
}

function handleSurveyCMB() {
  cosmicStringCartographer.surveyCMBLensing()
  state.value = { ...cosmicStringCartographer.getState() }
}

function handleAdjustTension(delta: number) {
  cosmicStringCartographer.adjustStringTension(delta)
  state.value = { ...cosmicStringCartographer.getState() }
}

function handleSwitchType(type: CosmicStringType) {
  cosmicStringCartographer.switchStringType(type)
  state.value = { ...cosmicStringCartographer.getState() }
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

  ctx.fillStyle = '#080502'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.002

  // 繪製微波背景階躍冷熱色塊 (Kaiser-Stebbins 兩側色差)
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)'
  ctx.fillRect(0, 0, cx, h)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'
  ctx.fillRect(cx, 0, w - cx, h)

  // 繪製高能一維宇宙弦 (穿越畫布的波浪線)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 2.5
  ctx.shadowColor = '#f59e0b'
  ctx.shadowBlur = 10
  ctx.beginPath()
  for (let y = 0; y <= h; y += 8) {
    const x = cx + Math.sin(y * 0.03 + t * 2) * 16 + Math.cos(y * 0.01) * 8
    if (y === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.shadowBlur = 0

  // 繪製背景星系被透鏡分割之孿生像 (Twin Images)
  const d = 35 + state.value.deficitAngleArcsec * 4
  ctx.fillStyle = '#38bdf8'
  ctx.shadowColor = '#38bdf8'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(cx - d, cy - 20, 5, 0, Math.PI * 2)
  ctx.arc(cx + d, cy - 20, 5, 0, Math.PI * 2)
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
