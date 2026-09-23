<template>
  <div v-if="visible" class="profiler-hud">
    <div class="profiler-header">
      <span class="cyber-tag">CYBER PROFILER [F3]</span>
      <span class="fps-badge" :class="{ smooth: fps >= 50, warning: fps < 50 && fps >= 30, critical: fps < 30 }">
        {{ fps }} FPS ({{ frameTime }}ms)
      </span>
    </div>

    <div class="profiler-grid">
      <!-- Section 1: Coordinates & Spatial Location -->
      <div class="metric-block">
        <div class="block-title">📍 空間座標 (Spatial Coordinates)</div>
        <div class="metric-row">XYZ: <span class="val">{{ coords.x }} / {{ coords.y }} / {{ coords.z }}</span></div>
        <div class="metric-row">區塊 (Chunk): <span class="val">[{{ currentChunk.cx }}, {{ currentChunk.cz }}]</span></div>
        <div class="metric-row">朝向 (Facing): <span class="val">{{ facing }}</span></div>
        <div class="metric-row">生態系 (Biome): <span class="val">{{ biomeName }}</span></div>
      </div>

      <!-- Section 2: Rendering & WebGL Memory -->
      <div class="metric-block">
        <div class="block-title">🎨 WebGL 渲染管線 (Render Pipeline)</div>
        <div class="metric-row">Draw Calls: <span class="val">{{ drawCalls }}</span></div>
        <div class="metric-row">三角形數 (Triangles): <span class="val">{{ triangles.toLocaleString() }}</span></div>
        <div class="metric-row">幾何體內存 (Geometries): <span class="val">{{ geometriesCount }}</span></div>
        <div class="metric-row">紋理緩存 (Textures): <span class="val">{{ texturesCount }}</span></div>
      </div>

      <!-- Section 3: Environment & Atmosphere -->
      <div class="metric-block">
        <div class="block-title">⛅ 環境與載具 (Atmosphere & Gear)</div>
        <div class="metric-row">天候氣象: <span class="val">{{ weatherName }}</span></div>
        <div class="metric-row">晝夜時段: <span class="val">{{ ui.timeOfDay.toUpperCase() }}</span></div>
        <div class="metric-row">載具狀態: <span class="val">{{ vehicleName }} ({{ speedMult }}x)</span></div>
        <div class="metric-row">3D 語音節點: <span class="val">{{ voicePeers }} 位在線</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { weather, WEATHER_ROSTER } from '@/engine/weather'
import { vehicles, VEHICLE_CONFIGS } from '@/engine/vehicles'
import { spatialVoice } from '@/engine/spatialVoice'

const ui = useUIStore()

const visible = ref(false)
const fps = ref(60)
const frameTime = ref('16.6')
const drawCalls = ref(0)
const triangles = ref(0)
const geometriesCount = ref(0)
const texturesCount = ref(0)

const coords = ref({ x: 0, y: 0, z: 0 })
const currentChunk = ref({ cx: 0, cz: 0 })
const facing = ref('北 (North)')
const biomeName = ref('Neon City Core')

const weatherName = computed(() => WEATHER_ROSTER[weather.getWeather()]?.name || '晴朗')
const vehicleName = computed(() => VEHICLE_CONFIGS[vehicles.getVehicle()]?.name || '步巡')
const speedMult = computed(() => vehicles.getSpeedMultiplier())
const voicePeers = computed(() => spatialVoice.peers.size)

let lastTime = performance.now()
let frames = 0
let rafId: number | null = null

function updateProfiler(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    if (custom.detail.coords) coords.value = custom.detail.coords
    if (custom.detail.chunk) currentChunk.value = custom.detail.chunk
    if (custom.detail.facing) facing.value = custom.detail.facing
    if (custom.detail.biome) biomeName.value = custom.detail.biome
    if (custom.detail.drawCalls !== undefined) drawCalls.value = custom.detail.drawCalls
    if (custom.detail.triangles !== undefined) triangles.value = custom.detail.triangles
    if (custom.detail.geometries !== undefined) geometriesCount.value = custom.detail.geometries
    if (custom.detail.textures !== undefined) texturesCount.value = custom.detail.textures
  }
}

function calculateFPS(): void {
  const now = performance.now()
  frames++
  if (now >= lastTime + 1000) {
    fps.value = Math.round((frames * 1000) / (now - lastTime))
    frameTime.value = (1000 / Math.max(1, fps.value)).toFixed(1)
    frames = 0
    lastTime = now
  }
  rafId = requestAnimationFrame(calculateFPS)
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'F3') {
    e.preventDefault()
    visible.value = !visible.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('profiler-update', updateProfiler)
  rafId = requestAnimationFrame(calculateFPS)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('profiler-update', updateProfiler)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.profiler-hud {
  position: fixed;
  top: 18px;
  left: 18px;
  background: rgba(10, 14, 26, 0.88);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 10px;
  padding: 14px 18px;
  color: #fff;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 11px;
  z-index: 99;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7), 0 0 16px rgba(0, 255, 255, 0.15);
  pointer-events: none;
  min-width: 320px;
}

.profiler-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.cyber-tag {
  color: #00ffff;
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 12px;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}

.fps-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  background: rgba(0, 255, 136, 0.15);
}
.fps-badge.smooth { color: #00ff88; }
.fps-badge.warning { color: #ffaa00; background: rgba(255, 170, 0, 0.15); }
.fps-badge.critical { color: #ff0055; background: rgba(255, 0, 85, 0.15); }

.profiler-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric-block {
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 2px solid #00ffff;
}

.block-title {
  color: #00ffff;
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.metric-row {
  color: #8899aa;
  line-height: 1.5;
}

.val {
  color: #ffffff;
  font-weight: 600;
}
</style>
