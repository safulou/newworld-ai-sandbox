<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div class="relative w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-zinc-950/95 p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh]">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">❄️</span>
          <div>
            <h2 class="text-xl font-bold tracking-wider text-cyan-400">中微子超流體暗物質探測陣列 (Superfluid Neutrino Detector)</h2>
            <p class="text-xs text-zinc-400">0.85 mK 氦三稀釋低溫腔體 · WIMP 弱相互作用大質量粒子 · 三味態振盪同調</p>
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
              🧊 極低溫環境: {{ state.cryoTempMilliKelvin.toFixed(3) }} mK
            </div>
            <div class="absolute bottom-2 right-3 px-2 py-1 rounded bg-black/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              🛡️ 本底過濾純度: {{ state.shieldingPurityPercent.toFixed(1) }}%
            </div>
          </div>

          <!-- 核心數值儀表盤 -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">聲子能量通量</span>
              <span class="text-lg font-bold font-mono text-cyan-400">🌀 {{ state.superfluidPhononFlux }}</span>
              <span class="text-[10px] text-zinc-500">超流體聲子貨幣</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">WIMP 暗物質事件</span>
              <span class="text-lg font-bold font-mono text-purple-400">🌌 {{ state.darkMatterWIMPCounts }} 次</span>
              <span class="text-[10px] text-zinc-500">累計事件: {{ state.totalEventsLogged }}</span>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex flex-col items-center justify-center">
              <span class="text-xs text-zinc-400">中微子味態比例</span>
              <span class="text-xs font-mono text-amber-300 font-bold mt-1">
                e:{{ state.flavorOscillationRatio.electron }}% | μ:{{ state.flavorOscillationRatio.muon }}% | τ:{{ state.flavorOscillationRatio.tau }}%
              </span>
              <span class="text-[10px] text-zinc-500">龐蒂科夫-牧-中川-坂田矩陣</span>
            </div>
          </div>

          <!-- 動作按鈕群 -->
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="handleHarvestPhonon"
              class="rounded-xl border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-cyan-300">⚡ 捕獲聲子閃光</span>
              <span class="text-[10px] text-zinc-400">提取原子核回衝熱能</span>
            </button>
            <button
              @click="handleCalibrateCryo"
              class="rounded-xl border border-teal-500/60 bg-teal-950/40 hover:bg-teal-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-teal-300">🌡️ 深度校準制冷槽</span>
              <span class="text-[10px] text-zinc-400">稀釋冷凝降溫壓制微噪</span>
            </button>
            <button
              @click="handleTuneOscillation"
              class="rounded-xl border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 p-3 text-center transition flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span class="text-sm font-bold text-purple-300">🌀 調諧味態濾鏡</span>
              <span class="text-[10px] text-zinc-400">擾動相位探測 WIMP</span>
            </button>
          </div>
        </div>

        <!-- 右欄：超低溫探測感測組件 -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          <div class="text-sm font-bold text-zinc-300 flex items-center justify-between">
            <span>❄️ 超低溫高靈敏探測矩陣</span>
            <span class="text-xs text-cyan-400 font-mono">聲子: {{ state.superfluidPhononFlux }}</span>
          </div>

          <div class="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            <div
              v-for="sensor in sensorList"
              :key="sensor.id"
              class="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-2 hover:border-zinc-700 transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-zinc-200">{{ sensor.name }}</h4>
                  <p class="text-[11px] text-zinc-400">等級 Lv.{{ sensor.level }} · 增益 +{{ (sensor.efficiencyBonus * 100).toFixed(0) }}%</p>
                </div>
                <button
                  @click="handleUpgradeSensor(sensor.id)"
                  :disabled="state.superfluidPhononFlux < sensor.costPhonon"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1',
                    state.superfluidPhononFlux >= sensor.costPhonon
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  ]"
                >
                  升級 ({{ sensor.costPhonon }} 聲子)
                </button>
              </div>
              <p class="text-[11px] text-zinc-400">{{ sensor.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { neutrinoDetector } from '../engine/neutrinoDetector'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const state = ref(neutrinoDetector.getState())
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

const sensorList = computed(() => Object.values(state.value.sensors))

function close() {
  uiStore.closeOverlay()
}

function handleHarvestPhonon() {
  neutrinoDetector.harvestPhononBurst()
  state.value = { ...neutrinoDetector.getState() }
}

function handleCalibrateCryo() {
  neutrinoDetector.calibrateCryoChamber()
  state.value = { ...neutrinoDetector.getState() }
}

function handleTuneOscillation() {
  neutrinoDetector.tuneOscillationFilter()
  state.value = { ...neutrinoDetector.getState() }
}

function handleUpgradeSensor(sensorId: string) {
  if (neutrinoDetector.upgradeSensor(sensorId)) {
    state.value = { ...neutrinoDetector.getState() }
  }
}

// 粒子特效
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  life: number
}
const particles: Particle[] = []

function initParticles(w: number, h: number) {
  particles.length = 0
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1,
      color: ['#38bdf8', '#818cf8', '#c084fc', '#34d399'][Math.floor(Math.random() * 4)],
      life: Math.random() * 100
    })
  }
}

function renderCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = '#030712'
  ctx.fillRect(0, 0, w, h)

  // 繪製極低溫超流體背景波紋
  const t = Date.now() * 0.002
  const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 160)
  grad.addColorStop(0, 'rgba(14, 165, 233, 0.25)')
  grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)')
  grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, 160, 0, Math.PI * 2)
  ctx.fill()

  // 繪製超導腔體同心圓環
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
  ctx.lineWidth = 1.5
  for (let r = 35; r <= 140; r += 35) {
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 繪製粒子與聲子散射光
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    p.life += 1

    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0

    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  })

  // 繪製中心中微子散射閃爍
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, 6 + Math.sin(t * 3) * 2, 0, Math.PI * 2)
  ctx.fill()

  animFrameId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    initParticles(canvas.width, canvas.height)
    renderCanvas()
  }
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>
