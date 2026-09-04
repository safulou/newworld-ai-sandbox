<template>
  <div class="minimap-panel glass-panel">
    <div class="minimap-header">
      <span class="radar-dot"></span>
      <span class="coords">X: {{ Math.floor(playerPos.x) }} Z: {{ Math.floor(playerPos.z) }}</span>
    </div>
    <canvas ref="mapCanvas" width="140" height="140" class="map-canvas"></canvas>
    <div class="minimap-footer">
      <span>Chunk [{{ Math.floor(playerPos.x / 16) }}, {{ Math.floor(playerPos.z / 16) }}]</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mapCanvas = ref<HTMLCanvasElement>()
const playerPos = ref({ x: 0, y: 0, z: 0 })
let animId: number

function onPlayerMoved(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    playerPos.value = { x: custom.detail.x, y: custom.detail.y, z: custom.detail.z }
  }
}

function drawMinimap(): void {
  animId = requestAnimationFrame(drawMinimap)
  const canvas = mapCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, 140, 140)

  // Background radar grid
  ctx.fillStyle = 'rgba(8, 12, 24, 0.9)'
  ctx.fillRect(0, 0, 140, 140)

  // Draw grid lines (16-block chunk boundaries)
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)'
  ctx.lineWidth = 1

  const centerX = 70
  const centerY = 70
  const scale = 1.6 // pixels per block

  const offsetX = (playerPos.value.x * scale) % (16 * scale)
  const offsetZ = (playerPos.value.z * scale) % (16 * scale)

  for (let x = -70; x <= 140; x += 16 * scale) {
    ctx.beginPath()
    ctx.moveTo(x - offsetX + 70, 0)
    ctx.lineTo(x - offsetX + 70, 140)
    ctx.stroke()
  }
  for (let z = -70; z <= 140; z += 16 * scale) {
    ctx.beginPath()
    ctx.moveTo(0, z - offsetZ + 70)
    ctx.lineTo(140, z - offsetZ + 70)
    ctx.stroke()
  }

  // Radar circular rings
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(centerX, centerY, 60, 0, Math.PI * 2)
  ctx.stroke()

  // NPC Guide Marker (fixed relative to center)
  const npcRelX = centerX + (0 - playerPos.value.x) * scale
  const npcRelZ = centerY + (4 - playerPos.value.z) * scale
  if (npcRelX >= 5 && npcRelX <= 135 && npcRelZ >= 5 && npcRelZ <= 135) {
    ctx.fillStyle = '#00ff88'
    ctx.shadowColor = '#00ff88'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(npcRelX, npcRelZ, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // Player Marker (at center)
  ctx.fillStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2)
  ctx.fill()

  // Vision cone
  ctx.fillStyle = 'rgba(0, 255, 255, 0.25)'
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.arc(centerX, centerY, 22, -Math.PI / 2 - 0.4, -Math.PI / 2 + 0.4)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0
}

onMounted(() => {
  window.addEventListener('player-position', onPlayerMoved)
  drawMinimap()
})

onUnmounted(() => {
  window.removeEventListener('player-position', onPlayerMoved)
  cancelAnimationFrame(animId)
})
</script>

<style scoped>
.minimap-panel {
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 8px;
  background: rgba(12, 16, 28, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 12px;
  pointer-events: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
  z-index: 20;
}

.minimap-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-family: monospace;
  font-size: 11px;
  color: #00ffff;
  font-weight: 700;
}

.radar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 6px #00ff88;
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.map-canvas {
  display: block;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.minimap-footer {
  margin-top: 6px;
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
}
</style>
