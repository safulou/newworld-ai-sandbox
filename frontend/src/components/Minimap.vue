<template>
  <div v-if="ui.isMinimapVisible" class="minimap-panel glass-panel">
    <div class="minimap-header">
      <div class="header-left">
        <span class="radar-dot"></span>
        <span class="coords">X: {{ Math.floor(playerPos.x) }} Z: {{ Math.floor(playerPos.z) }}</span>
      </div>
      <button class="zoom-btn" @click="cycleZoom" :title="'切換雷達探測半徑 (目前: ' + radar.currentRange + 'm)'">
        {{ radar.currentZoom }}x
      </button>
    </div>

    <canvas ref="mapCanvas" width="150" height="150" class="map-canvas"></canvas>

    <div class="minimap-footer">
      <span class="chunk-badge">區塊 [{{ Math.floor(playerPos.x / 16) }}, {{ Math.floor(playerPos.z / 16) }}]</span>
      <div class="blip-counts">
        <span v-if="entityCounts.npc > 0" title="AI NPC 伴侶">🤖{{ entityCounts.npc }}</span>
        <span v-if="entityCounts.hound > 0" title="賽博機械獵犬">🐕{{ entityCounts.hound }}</span>
        <span v-if="entityCounts.boss > 0" class="boss-warn" title="地牢領主守護者">👾{{ entityCounts.boss }}</span>
        <span v-if="entityCounts.player > 0" title="線上遠端玩家">🧑‍🚀{{ entityCounts.player }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { radar } from '@/engine/radar'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const mapCanvas = ref<HTMLCanvasElement>()
const playerPos = ref({ x: 0, y: 0, z: 0, yaw: 0 })
const entityCounts = ref({ npc: 0, hound: 0, boss: 0, player: 0 })

let animId: number
let lastTime = performance.now()
const pVec = new THREE.Vector3()

function onPlayerMoved(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    playerPos.value = {
      x: custom.detail.x ?? 0,
      y: custom.detail.y ?? 0,
      z: custom.detail.z ?? 0,
      yaw: custom.detail.yaw ?? 0,
    }
  }
}

function cycleZoom(): void {
  radar.cycleZoom()
}

function updateCounts(blips: any[]): void {
  let npc = 0
  let hound = 0
  let boss = 0
  let player = 0
  for (const b of blips) {
    if (b.type === 'npc') npc++
    else if (b.type === 'hound') hound++
    else if (b.type === 'boss') boss++
    else if (b.type === 'player') player++
  }
  entityCounts.value = { npc, hound, boss, player }
}

function renderRadar(): void {
  animId = requestAnimationFrame(renderRadar)
  const canvas = mapCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const now = performance.now()
  const delta = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  radar.update(delta)
  pVec.set(playerPos.value.x, playerPos.value.y, playerPos.value.z)
  radar.draw(ctx, 150, 150, pVec, playerPos.value.yaw)

  // Update counts periodically
  if (Math.random() < 0.1) {
    const blips = radar.scan(pVec)
    updateCounts(blips)
  }
}

onMounted(() => {
  window.addEventListener('player-position', onPlayerMoved)
  lastTime = performance.now()
  renderRadar()
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
  background: rgba(10, 15, 26, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.35);
  border-radius: 12px;
  pointer-events: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 240, 255, 0.12);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.minimap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: monospace;
  font-size: 11px;
  color: #00f0ff;
  font-weight: 700;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
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

.zoom-btn {
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: #00f0ff;
  border-radius: 4px;
  font-size: 10px;
  font-family: monospace;
  font-weight: bold;
  padding: 1px 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.zoom-btn:hover {
  background: rgba(0, 240, 255, 0.28);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.map-canvas {
  display: block;
  border-radius: 50%;
  background: #070c16;
  border: 1px solid rgba(0, 240, 255, 0.25);
  box-shadow: inset 0 0 12px rgba(0, 240, 255, 0.15);
}

.minimap-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
  font-family: monospace;
}

.blip-counts {
  display: flex;
  gap: 6px;
  font-size: 10px;
}

.boss-warn {
  color: #ff0055;
  font-weight: bold;
  animation: pulse-warn 1s infinite alternate;
}

@keyframes pulse-warn {
  from { opacity: 0.6; }
  to { opacity: 1; }
}
</style>
