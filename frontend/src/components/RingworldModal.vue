<template>
  <div class="ringworld-overlay" @click.self="ui.closeOverlay()">
    <div class="ringworld-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🪐</span>
          <div>
            <h2>星際巨構環形世界建造船塢</h2>
            <div class="subtitle">1 AU Megastructure Ringworld Fabricator & Habitable Segments</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">環帶尺度 / 半徑</span>
            <span class="val highlight">1.0 AU (9.4億 km)</span>
            <span class="sub">外壁寬度 160萬 km</span>
          </div>
          <div class="stat-card">
            <span class="label">可居住總面積</span>
            <span class="val area">{{ stats.totalHabitableAreaMillionKm2.toLocaleString() }} 萬 km²</span>
            <span class="sub">人口：{{ stats.totalPopulationMillion }} 百萬人</span>
          </div>
          <div class="stat-card">
            <span class="label">巨構總出力 / 產值</span>
            <span class="val power">{{ (stats.totalPowerGW / 1000).toFixed(1) }} TW</span>
            <span class="sub">+{{ stats.creditsPerSec.toLocaleString() }} CR/秒 稅收</span>
          </div>
          <div class="stat-card">
            <span class="label">總體建造完備度</span>
            <span class="val progress">{{ stats.overallConstructionPercent }}%</span>
            <span class="sub">{{ stats.naniteFabricationSwarms }} 隊奈米蜂群巡航</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Ringworld Arc around Central Star -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            巨構姿態：1 AU 軌道自轉平衡 [晝夜遮光板運轉中]
          </div>
        </div>

        <!-- Nanite Swarms & Fast Operations Bar -->
        <div class="operation-bar">
          <div class="op-info">
            <span class="op-title">🤖 奈米自律建造蜂群矩陣：</span>
            <span class="op-desc">共有 {{ stats.naniteFabricationSwarms }} 隊自律蜂群進行 24 小時連續分子熔接。</span>
          </div>
          <button
            class="upgrade-swarm-btn"
            :disabled="stats.naniteFabricationSwarms >= 10"
            @click="upgradeSwarms"
          >
            增擴奈米工程蜂群 (隊數: {{ stats.naniteFabricationSwarms }}/10)
          </button>
        </div>

        <!-- Habitable Segments Grid -->
        <div class="segments-section">
          <h3>🌍 環帶四大宜居板塊工程進度</h3>
          <div class="segments-grid">
            <div
              v-for="seg in Object.values(segments)"
              :key="seg.id"
              class="segment-card"
              :class="{ locked: !seg.unlocked }"
            >
              <div class="seg-header">
                <div class="seg-title-group">
                  <span class="seg-icon">{{ seg.icon }}</span>
                  <span class="seg-name">{{ seg.name }}</span>
                </div>
                <span class="seg-phase">階段 {{ seg.currentPhase }} / 4</span>
              </div>
              <p class="seg-desc">{{ seg.description }}</p>
              
              <div class="seg-progress-box">
                <div class="progress-label">
                  <span>當前工程階段進度:</span>
                  <span>{{ seg.phaseProgressPercent.toFixed(1) }}%</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar" :style="{ width: `${seg.phaseProgressPercent}%` }"></div>
                </div>
              </div>

              <div class="seg-details">
                <span>容納人口: {{ seg.populationMillion }} 百萬</span>
                <span>板塊出力: {{ (seg.powerOutputGW / 1000).toFixed(1) }} TW</span>
                <span>產能貢獻: +{{ seg.creditsPerSec }} CR/s</span>
              </div>

              <button
                class="advance-btn"
                :disabled="!seg.unlocked || (seg.currentPhase >= 4 && seg.phaseProgressPercent >= 100)"
                @click="advanceSegment(seg.id)"
              >
                {{ !seg.unlocked ? '尚未解鎖' : (seg.currentPhase >= 4 && seg.phaseProgressPercent >= 100) ? '板塊已完工' : '投入奈米蜂群推進' }}
              </button>
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
import { ringworldFabricator, RingSegmentId } from '@/engine/ringworldFabricator'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => ringworldFabricator.stats)
const segments = computed(() => ringworldFabricator.segments)

function advanceSegment(id: RingSegmentId): void {
  ringworldFabricator.advanceSegment(id)
}

function upgradeSwarms(): void {
  ringworldFabricator.upgradeNaniteSwarms()
}

// ── Perspective Canvas Rendering: Curving Megastructure Ringworld ───────────
function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  animTime += 0.015
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2

  // Background Starfield
  ctx.fillStyle = '#060814'
  ctx.fillRect(0, 0, w, h)

  // Central Sun
  const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28)
  sunGrad.addColorStop(0, '#ffffff')
  sunGrad.addColorStop(0.3, '#fef08a')
  sunGrad.addColorStop(0.7, '#f97316')
  sunGrad.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.fillStyle = sunGrad
  ctx.arc(cx, cy, 28, 0, Math.PI * 2)
  ctx.fill()

  // Gigantic Ringworld Arc curving in 3D perspective
  const ringA = 320
  const ringB = 95

  ctx.save()
  ctx.translate(cx, cy)

  // Outer structural rim (Atmospheric wall)
  ctx.beginPath()
  ctx.strokeStyle = '#0284c7'
  ctx.lineWidth = 5
  ctx.ellipse(0, 0, ringA, ringB, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Inner terrain ribbon
  ctx.beginPath()
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.ellipse(0, 0, ringA - 4, ringB - 2, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Day-Night Shadow Squares orbiting inside ring
  const shadowCount = 6
  for (let s = 0; s < shadowCount; s++) {
    const angle = animTime * 0.8 + (s * Math.PI * 2) / shadowCount
    const sx = Math.cos(angle) * 75
    const sy = Math.sin(angle) * 25

    // Draw shadow rectangle
    ctx.save()
    ctx.translate(sx, sy)
    ctx.rotate(angle)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)'
    ctx.lineWidth = 1
    ctx.fillRect(-12, -4, 24, 8)
    ctx.strokeRect(-12, -4, 24, 8)
    ctx.restore()
  }

  // Active nanite repair sparks on ring
  for (let sp = 0; sp < 8; sp++) {
    const pAngle = animTime * 1.5 + sp * 0.8
    const px = Math.cos(pAngle) * ringA
    const py = Math.sin(pAngle) * ringB
    ctx.fillStyle = '#fde047'
    ctx.fillRect(px, py, 2.5, 2.5)
  }

  ctx.restore()

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
.ringworld-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.ringworld-modal {
  width: 820px; max-height: 90vh; background: #0b0e1b; border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(16, 185, 129, 0.2); display: flex; flex-direction: column;
  color: #ecfdf5; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(16, 185, 129, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #34d399; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 15px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #34d399; }
.stat-card .area { color: #38bdf8; }
.stat-card .power { color: #fbbf24; }
.stat-card .progress { color: #a78bfa; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.3);
  background: #060814;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #34d399;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.operation-bar {
  background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;
}
.op-title { font-size: 12px; font-weight: 700; color: #34d399; }
.op-desc { font-size: 11px; color: #94a3b8; margin-left: 6px; }
.upgrade-swarm-btn {
  background: #059669; color: #ffffff; border: none; border-radius: 6px; padding: 6px 14px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.upgrade-swarm-btn:hover:not(:disabled) { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
.upgrade-swarm-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.segments-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #6ee7b7; }
.segments-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.segment-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.segment-card.locked { opacity: 0.5; }
.seg-header { display: flex; justify-content: space-between; align-items: center; }
.seg-title-group { display: flex; align-items: center; gap: 8px; }
.seg-icon { font-size: 20px; }
.seg-name { font-size: 13px; font-weight: 700; color: #f1f5f9; }
.seg-phase { font-size: 11px; color: #34d399; font-family: monospace; }
.seg-desc { margin: 0; font-size: 11px; color: #94a3b8; min-height: 28px; }

.seg-progress-box { display: flex; flex-direction: column; gap: 4px; }
.progress-label { display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
.progress-bar-wrap {
  width: 100%; height: 6px; background: rgba(15, 23, 42, 0.8); border-radius: 3px; overflow: hidden;
}
.progress-bar { height: 100%; background: linear-gradient(90deg, #059669, #34d399); transition: width 0.3s; }

.seg-details { display: flex; flex-direction: column; gap: 2px; font-size: 10px; color: #64748b; }
.advance-btn {
  background: #0284c7; color: #ffffff; border: none; border-radius: 6px; padding: 8px 12px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 4px;
}
.advance-btn:hover:not(:disabled) { background: #0ea5e9; }
.advance-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(16, 185, 129, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #34d399; font-family: monospace;
}
</style>
