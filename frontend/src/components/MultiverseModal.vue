<template>
  <div class="multiverse-modal-overlay" @click.self="ui.closeOverlay()">
    <div class="multiverse-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🫧</span>
          <div>
            <h2>平行宇宙泡泡世界拓撲觀測儀</h2>
            <div class="subtitle">Multiverse Bubble Topology & Inflationary Landscape</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">當前觀測宇宙泡泡</span>
            <span class="val highlight">{{ activeBubbleName }}</span>
            <span class="sub">{{ activeBubbleDeviation }}</span>
          </div>
          <div class="stat-card">
            <span class="label">多元宇宙奇異通量</span>
            <span class="val flux">✨ {{ stats.totalMultiversalFlux.toFixed(1) }}</span>
            <span class="sub">加成倍率 x{{ stats.fluxMultiplier.toFixed(2) }}</span>
          </div>
          <div class="stat-card">
            <span class="label">膜共振調諧頻率</span>
            <span class="val freq">{{ stats.globalResonanceTHz.toFixed(1) }} THz</span>
            <span class="sub">膜完整度 {{ stats.membraneIntegrityPercent.toFixed(0) }}%</span>
          </div>
          <div class="stat-card">
            <span class="label">可用自律維度探針</span>
            <span class="val probes">🚀 {{ stats.probesAvailable }} 架</span>
            <span class="sub">巡航採集中</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Multiverse Inflation Landscape -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            泡泡拓撲膜：{{ stats.activeUniverseId.toUpperCase() }} [同調率 {{ currentStability }}%]
          </div>
        </div>

        <!-- Frequency Tuning & Alignment Controls -->
        <div class="tuning-bar">
          <div class="tuning-info">
            <span class="tuning-title">📻 維度時空膜頻率調諧：</span>
            <span class="tuning-val">{{ stats.globalResonanceTHz.toFixed(1) }} THz</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="95.0"
            step="0.5"
            :value="stats.globalResonanceTHz"
            class="freq-slider"
            @input="onSliderInput"
          />
          <div class="quick-freqs">
            <button
              v-for="b in Object.values(bubbles)"
              :key="b.id"
              class="quick-freq-btn"
              :class="{ active: stats.activeUniverseId === b.id }"
              :disabled="!b.unlocked"
              @click="tuneToBubble(b.resonanceFrequencyTHz)"
            >
              {{ b.resonanceFrequencyTHz }} THz
            </button>
          </div>
        </div>

        <!-- Universe Bubbles Grid -->
        <div class="bubbles-section">
          <h3>🌌 平行宇宙景觀泡泡清單</h3>
          <div class="bubbles-grid">
            <div
              v-for="b in Object.values(bubbles)"
              :key="b.id"
              class="bubble-card"
              :class="{ active: stats.activeUniverseId === b.id, locked: !b.unlocked }"
            >
              <div class="bubble-header">
                <span class="bubble-name" :style="{ color: b.color }">{{ b.name }}</span>
                <span class="bubble-freq">{{ b.resonanceFrequencyTHz }} THz</span>
              </div>
              <p class="bubble-desc">{{ b.description }}</p>
              <div class="bubble-details">
                <span>物理法則偏差: {{ b.cosmicConstantDeviation }}</span>
                <span>核心產物: {{ b.primaryYield }}</span>
                <span>在軌探針: {{ b.probesDispatched }} 架 (產速 +{{ (b.harvestRatePerSec * b.probesDispatched).toFixed(1) }}/s)</span>
              </div>
              <div class="bubble-actions">
                <button
                  class="action-btn select-btn"
                  :disabled="!b.unlocked || stats.activeUniverseId === b.id"
                  @click="selectBubble(b.id)"
                >
                  {{ stats.activeUniverseId === b.id ? '當前連線' : '調諧穿梭' }}
                </button>
                <button
                  class="action-btn dispatch-btn"
                  :disabled="!b.unlocked || stats.probesAvailable <= 0"
                  @click="dispatchProbe(b.id)"
                >
                  發射探針
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Message Banner -->
        <div class="status-banner">
          {{ stats.statusMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { multiverseBubbleEngine, UniverseBubbleId } from '@/engine/multiverseBubble'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => multiverseBubbleEngine.stats)
const bubbles = computed(() => multiverseBubbleEngine.bubbles)

const activeBubbleName = computed(() => {
  return bubbles.value[stats.value.activeUniverseId]?.name ?? ''
})

const activeBubbleDeviation = computed(() => {
  return bubbles.value[stats.value.activeUniverseId]?.cosmicConstantDeviation ?? ''
})

const currentStability = computed(() => {
  return bubbles.value[stats.value.activeUniverseId]?.membraneStabilityPercent ?? 0
})

function selectBubble(id: UniverseBubbleId): void {
  multiverseBubbleEngine.selectUniverse(id)
}

function dispatchProbe(id: UniverseBubbleId): void {
  multiverseBubbleEngine.dispatchProbe(id)
}

function tuneToBubble(freq: number): void {
  multiverseBubbleEngine.tuneFrequency(freq)
}

function onSliderInput(e: Event): void {
  const target = e.target as HTMLInputElement
  multiverseBubbleEngine.tuneFrequency(parseFloat(target.value))
}

// ── Dynamic Canvas Rendering: Floating Universe Foam Bubbles ───────────────
function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  animTime += 0.02
  const w = canvas.width
  const h = canvas.height

  // Dark quantum foam background
  ctx.fillStyle = '#060714'
  ctx.fillRect(0, 0, w, h)

  // Floating Multiverse Bubble representations
  const bubblePositions = [
    { x: w * 0.22, y: h * 0.5, r: 48, id: 'high_gravity', color: '#38bdf8' },
    { x: w * 0.42, y: h * 0.45, r: 52, id: 'antimatter', color: '#f43f5e' },
    { x: w * 0.62, y: h * 0.55, r: 46, id: 'variable_light', color: '#a855f7' },
    { x: w * 0.82, y: h * 0.48, r: 50, id: 'hyper_entropy', color: '#fbbf24' },
  ]

  // Interconnecting filament conduits
  for (let i = 0; i < bubblePositions.length - 1; i++) {
    const b1 = bubblePositions[i]
    const b2 = bubblePositions[i + 1]

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'
    ctx.lineWidth = 1.5
    ctx.moveTo(b1.x, b1.y)
    ctx.bezierCurveTo((b1.x + b2.x) / 2, b1.y - 25, (b1.x + b2.x) / 2, b2.y + 25, b2.x, b2.y)
    ctx.stroke()
  }

  // Draw each bubble
  bubblePositions.forEach(b => {
    const isCurrent = stats.value.activeUniverseId === b.id
    const floatY = b.y + Math.sin(animTime * 1.5 + b.x) * 6
    const pulse = isCurrent ? Math.sin(animTime * 4) * 4 : 0

    // Bubble glow gradient
    const grad = ctx.createRadialGradient(b.x, floatY, 4, b.x, floatY, b.r + pulse)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    grad.addColorStop(0.3, `${b.color}88`)
    grad.addColorStop(0.8, `${b.color}22`)
    grad.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.fillStyle = grad
    ctx.arc(b.x, floatY, b.r + pulse, 0, Math.PI * 2)
    ctx.fill()

    // Outer membrane ring
    ctx.beginPath()
    ctx.strokeStyle = isCurrent ? '#ffffff' : `${b.color}88`
    ctx.lineWidth = isCurrent ? 2.5 : 1.2
    ctx.arc(b.x, floatY, b.r + pulse, 0, Math.PI * 2)
    ctx.stroke()

    // Active probes orbiting bubble
    const bubbleData = bubbles.value[b.id as UniverseBubbleId]
    const probeCount = bubbleData?.probesDispatched ?? 0
    for (let p = 0; p < probeCount; p++) {
      const pAngle = animTime * 2 + (p * Math.PI * 2) / Math.max(1, probeCount)
      const px = b.x + Math.cos(pAngle) * (b.r + 14)
      const py = floatY + Math.sin(pAngle) * (b.r + 14)

      ctx.beginPath()
      ctx.fillStyle = '#fde047'
      ctx.arc(px, py, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  animId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  animId = requestAnimationFrame(renderCanvas)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
})
</script>

<style scoped>
.multiverse-modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.multiverse-modal {
  width: 820px; max-height: 90vh; background: #0b0e1b; border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(56, 189, 248, 0.25); display: flex; flex-direction: column;
  color: #e0f2fe; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #38bdf8; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 15px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #38bdf8; }
.stat-card .flux { color: #fbbf24; }
.stat-card .freq { color: #a855f7; }
.stat-card .probes { color: #34d399; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.3);
  background: #060714;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #38bdf8;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.tuning-bar {
  background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 12px;
}
.tuning-info { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 12px; }
.tuning-title { color: #94a3b8; }
.tuning-val { color: #38bdf8; font-weight: 700; font-family: monospace; }
.freq-slider { flex: 1; accent-color: #38bdf8; cursor: pointer; }
.quick-freqs { display: flex; gap: 6px; }
.quick-freq-btn {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 4px;
  padding: 4px 8px; font-size: 10px; font-family: monospace; cursor: pointer; transition: all 0.2s;
}
.quick-freq-btn.active {
  background: #0284c7; color: #ffffff; border-color: #38bdf8;
}

.bubbles-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #7dd3fc; }
.bubbles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.bubble-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.bubble-card.active { border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.3); }
.bubble-card.locked { opacity: 0.5; }
.bubble-header { display: flex; justify-content: space-between; align-items: center; }
.bubble-name { font-size: 13px; font-weight: 700; }
.bubble-freq { font-size: 11px; color: #94a3b8; font-family: monospace; }
.bubble-desc { margin: 0; font-size: 11px; color: #94a3b8; min-height: 28px; }
.bubble-details { display: flex; flex-direction: column; gap: 2px; font-size: 10px; color: #64748b; }
.bubble-actions { display: flex; gap: 6px; margin-top: 4px; }
.action-btn {
  flex: 1; border: none; border-radius: 4px; padding: 6px 10px; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.select-btn { background: #0284c7; color: #ffffff; }
.select-btn:hover:not(:disabled) { background: #0ea5e9; }
.select-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
.dispatch-btn { background: #059669; color: #ffffff; }
.dispatch-btn:hover:not(:disabled) { background: #10b981; }
.dispatch-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(56, 189, 248, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #38bdf8; font-family: monospace;
}
</style>
