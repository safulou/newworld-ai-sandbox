<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-violet-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-violet-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚛️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-violet-400">大統一理論規範玻色子對撞核心 (GUT Collider)</h2>
            <p class="text-xs text-zinc-400">10^16 GeV 超高能標 · X/Y 規範玻色子生成 · 重子數破壞與質子衰變</p>
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
          <div class="relative rounded-xl border border-violet-900/50 bg-black overflow-hidden flex items-center justify-center h-64">
            <canvas ref="canvasRef" width="560" height="256" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-2 left-3 px-2 py-1 rounded bg-black/70 border border-violet-500/30 text-[11px] text-violet-300 font-mono">
              ⚡ 能階: 10^{{ state.gutEnergyExponent.toFixed(2) }} GeV (GUT Scale)
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
              ⚛️ 質子衰變事件: {{ state.protonDecayEvents }} 次 (τ_p > 10^34 年)
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">耦合常數統一度</span>
              <span class="text-lg font-bold font-mono text-violet-400">{{ state.gaugeCouplingUnificationPercent.toFixed(1) }}%</span>
              <div class="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                <div class="bg-violet-500 h-full" :style="{ width: `${state.gaugeCouplingUnificationPercent}%` }"></div>
              </div>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">X/Y 規範玻色子</span>
              <span class="text-lg font-bold font-mono text-fuchsia-400">✨ {{ state.xyBosonYieldCounts }} 顆</span>
              <span class="text-[10px] text-zinc-500">超重規範子 (10^15 GeV)</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">大統一通量</span>
              <span class="text-lg font-bold font-mono text-amber-400">🌀 {{ state.unificationFlux }}</span>
              <span class="text-[10px] text-zinc-500">對撞次數: {{ state.totalCollisions }}</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="handleFireCollision"
              class="rounded-xl border border-violet-500/60 bg-violet-950/40 hover:bg-violet-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-violet-300">💥 激發超高能對撞</span>
              <span class="text-[10px] text-zinc-400">生成 X/Y 玻色子</span>
            </button>
            <button
              @click="handleAlignCouplings"
              class="rounded-xl border border-fuchsia-500/60 bg-fuchsia-950/40 hover:bg-fuchsia-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-fuchsia-300">⚖️ 校準規範耦合常數</span>
              <span class="text-[10px] text-zinc-400">微調強弱電超對稱相交</span>
            </button>
            <button
              @click="handleCondenseMonopoles"
              :disabled="state.unificationFlux < 100"
              :class="[
                'rounded-xl border p-3 text-center transition flex flex-col items-center justify-center gap-1',
                state.unificationFlux >= 100
                  ? 'border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 cursor-pointer active:scale-95'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              ]"
            >
              <span class="text-sm font-bold text-amber-300">🧲 凝聚磁單極子</span>
              <span class="text-[10px] text-zinc-400">耗費 100 通量 (+0.15)</span>
            </button>
          </div>
        </div>

        <!-- 右欄：對撞模型與理論架構 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>📐 大統一對撞模型選擇</span>
            <span class="text-xs text-violet-400 font-mono">通量: {{ state.unificationFlux }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="m in modes"
              :key="m.id"
              @click="handleSwitchMode(m.id)"
              :class="[
                'p-2.5 rounded-xl border text-xs font-semibold transition text-left',
                state.colliderMode === m.id
                  ? 'border-violet-500 bg-violet-950/60 text-violet-200 shadow-md shadow-violet-500/20'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              ]"
            >
              <div class="font-bold">{{ m.name }}</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">{{ m.desc }}</div>
            </button>
          </div>

          <div class="text-xs font-bold text-zinc-400 mt-2">三大相互作用耦合常數統一演化</div>

          <div class="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-cyan-400">U(1)_Y 弱超荷規範常數 α_1</span>
                <span class="font-mono text-zinc-300">0.0169 → 0.040</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-emerald-400">SU(2)_L 弱同位旋規範常數 α_2</span>
                <span class="font-mono text-zinc-300">0.0337 → 0.040</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-rose-400">SU(3)_C 強色荷規範常數 α_3</span>
                <span class="font-mono text-zinc-300">0.1187 → 0.040</span>
              </div>
              <div class="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span class="text-amber-300 font-bold">磁單極子密度 (t'Hooft-Polyakov)</span>
                <span class="font-mono text-amber-400 font-bold">{{ state.monopoleDensity.toFixed(2) }} / fm³</span>
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
import { gutCollider, GUTColliderMode } from '../engine/gutCollider'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(gutCollider.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const modes: Array<{ id: GUTColliderMode; name: string; desc: string }> = [
  { id: 'spinor_so10', name: 'SO(10) 旋量群', desc: '包含右手中微子大質量 seesaw' },
  { id: 'georgi_glashow_su5', name: 'SU(5) 經典模型', desc: '喬治-格拉肖最簡對稱群' },
  { id: 'exceptional_e6', name: 'E6 例外群', desc: '超弦低能有效大統一群' },
  { id: 'string_compact_gut', name: '弦緊緻化 GUT', desc: '卡拉比-丘流形軌道統一' }
]

function close() {
  uiStore.closeOverlay()
}

function handleFireCollision() {
  gutCollider.fireGUTCollision()
  state.value = { ...gutCollider.getState() }
}

function handleAlignCouplings() {
  gutCollider.alignGaugeCouplings()
  state.value = { ...gutCollider.getState() }
}

function handleCondenseMonopoles() {
  gutCollider.condenseMagneticMonopoles()
  state.value = { ...gutCollider.getState() }
}

function handleSwitchMode(mode: GUTColliderMode) {
  gutCollider.switchMode(mode)
  state.value = { ...gutCollider.getState() }
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

  ctx.fillStyle = '#06030c'
  ctx.fillRect(0, 0, w, h)

  const t = Date.now() * 0.0025

  // 繪製三道匯聚光線 (強、弱、電磁) 聚焦於中央大統一奇點
  const beamColors = ['#06b6d4', '#10b981', '#f43f5e']
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 + t * 0.5
    const sx = cx + Math.cos(angle) * 160
    const sy = cy + Math.sin(angle) * 90

    ctx.strokeStyle = beamColors[i]
    ctx.lineWidth = 2.5
    ctx.shadowColor = beamColors[i]
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(cx, cy)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // 繪製對撞生成之 X/Y 玻色子軌跡
  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 1.2
  for (let k = 0; k < 6; k++) {
    const a = t * 1.5 + (k * Math.PI) / 3
    const r = 40 + Math.sin(t * 3 + k) * 15
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 中央超高能大統一核心
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#a855f7'
  ctx.shadowBlur = 18
  ctx.beginPath()
  ctx.arc(cx, cy, 7 + Math.sin(t * 6) * 3, 0, Math.PI * 2)
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
