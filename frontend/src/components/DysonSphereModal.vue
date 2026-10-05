<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="dyson-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">☀️</span>
          <h2>遠古戴森球環形世界宏工程 (Ancient Dyson Sphere)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="dyson-content">
        <!-- Top Telemetry & Global Celestial Output -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">⚡</span>
            <div>
              <span class="t-label">全域天體發電出力:</span>
              <span class="t-val highlight">{{ stats.totalOutputMW.toLocaleString() }} MW</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🏗️</span>
            <div>
              <span class="t-label">戴森球完工總進度:</span>
              <span class="t-val">{{ stats.totalProgress }}%</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🔥</span>
            <div>
              <span class="t-label">恆星表面溫度 / 光度:</span>
              <span class="t-val">{{ stats.sphereTemperatureK }} K / {{ stats.solarLuminosity }} Sol</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">✨</span>
            <div>
              <span class="t-label">全服天體同調光環:</span>
              <span class="t-val buff-active">已激活 (+50% 產速)</span>
            </div>
          </div>
        </div>

        <!-- Solar Flare Event Banner -->
        <div v-if="stats.activeSolarFlare" class="flare-alert glass-panel">
          <div class="flare-info">
            <span class="flare-badge">🚨 太陽耀斑噴發中</span>
            <p>高能磁約束等離子雲突破日冕！點擊偏折吸收可捕獲大量超導合金與暗物質晶體！</p>
          </div>
          <button class="harvest-flare-btn" @click="harvestFlare">
            ⚡ 導引捕獲耀斑等離子
          </button>
        </div>

        <!-- Center: Interactive Holographic Canvas & Phases -->
        <div class="center-stage">
          <!-- Canvas Visualizer -->
          <div class="canvas-wrap glass-panel">
            <canvas ref="canvasRef" width="380" height="280"></canvas>
            <div class="canvas-legend">
              <span>恒星半徑: 696,340 km</span>
              <span>赤道環半徑: 1.2 AU</span>
            </div>
          </div>

          <!-- Phase Construction Progress List -->
          <div class="phases-list">
            <div
              v-for="phase in phases"
              :key="phase.id"
              class="phase-card glass-panel"
              :class="{ completed: phase.isCompleted, active: phase.id === stats.currentPhase }"
            >
              <div class="phase-top">
                <span class="phase-name" :style="{ color: phase.color }">{{ phase.name }}</span>
                <span class="phase-out">{{ phase.powerOutputMW.toLocaleString() }} / {{ phase.maxPowerMW.toLocaleString() }} MW</span>
              </div>
              <p class="phase-sub">{{ phase.subtitle }}</p>
              <div class="phase-bar">
                <div class="phase-fill" :style="{ width: `${phase.progress}%`, background: phase.color }"></div>
              </div>
              <div class="phase-footer">
                <span>進度: {{ phase.progress }}%</span>
                <span v-if="phase.isCompleted" class="complete-tag">✓ 工程完工</span>
                <span v-else-if="phase.id === stats.currentPhase" class="curr-tag">▶ 正在建設</span>
                <span v-else class="lock-tag">待解鎖</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Resource Investment & Fabrication Bar -->
        <div class="resource-contribute glass-panel">
          <div class="res-inventory">
            <h4>📦 開拓者天體工程素材庫存:</h4>
            <div class="res-pills">
              <span class="pill">🔩 鈦鋼板: <strong>{{ stats.inventory.titaniumAlloy }}</strong></span>
              <span class="pill">⚡ 超導線: <strong>{{ stats.inventory.superconductingWire }}</strong></span>
              <span class="pill">☢️ 聚變核: <strong>{{ stats.inventory.fusionCores }}</strong></span>
              <span class="pill">💎 暗物質晶石: <strong>{{ stats.inventory.darkMatterCrystals }}</strong></span>
            </div>
          </div>

          <div class="contribute-actions">
            <button class="fab-btn" @click="fabricate('titanium')">+250 鈦鋼板</button>
            <button class="fab-btn" @click="fabricate('wire')">+180 超導線</button>
            <button class="fab-btn" @click="fabricate('core')">+10 聚變核</button>
            <button class="fab-btn" @click="fabricate('dark')">+5 暗晶石</button>
            <button
              class="contribute-btn"
              :disabled="!canContribute"
              @click="contribute"
            >
              🚀 注入素材推進戴森工程
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  dysonSphereMegastructure
} from '@/engine/dysonSphereMegastructure'

const ui = useUIStore()
const engine = dysonSphereMegastructure
const stats = engine.stats
const phases = engine.phases

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId: number | null = null
let angle = 0

const canContribute = computed(() => {
  return (
    stats.inventory.titaniumAlloy >= 100 &&
    stats.inventory.superconductingWire >= 80 &&
    stats.inventory.fusionCores >= 5 &&
    stats.inventory.darkMatterCrystals >= 2
  )
})

function close(): void {
  ui.closeOverlay()
}

function harvestFlare(): void {
  engine.harvestSolarFlare()
}

function fabricate(type: 'titanium' | 'wire' | 'core' | 'dark'): void {
  engine.fabricateMaterials(type)
}

function contribute(): void {
  engine.contributeResources(100, 80, 5, 2)
}

function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  // Star glow
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.3, '#ffcc00')
  grad.addColorStop(0.7, '#ff3d00')
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 75, 0, Math.PI * 2)
  ctx.fill()

  // Equatorial Dyson Ring (Ellipse)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(0.35)

  ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(0, 0, 140, 45, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Ring nodes
  for (let i = 0; i < 8; i++) {
    const nodeAngle = (i / 8) * Math.PI * 2 + angle * 0.5
    const nx = Math.cos(nodeAngle) * 140
    const ny = Math.sin(nodeAngle) * 45
    ctx.fillStyle = '#00ffff'
    ctx.beginPath()
    ctx.arc(nx, ny, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Swarm mirror satellites (Phase 1)
  const mirrorCount = 24
  for (let m = 0; m < mirrorCount; m++) {
    const ma = (m / mirrorCount) * Math.PI * 2 + angle * (m % 2 === 0 ? 0.7 : -0.5)
    const radX = 110 + (m % 5) * 12
    const radY = 70 + (m % 4) * 8
    const mx = Math.cos(ma) * radX
    const my = Math.sin(ma) * radY
    ctx.fillStyle = '#ffea00'
    ctx.fillRect(mx - 1.5, my - 1.5, 3, 3)
  }

  ctx.restore()

  angle += 0.02
  animId = requestAnimationFrame(renderCanvas)
}

onMounted(() => {
  renderCanvas()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dyson-modal {
  width: 92vw;
  max-width: 980px;
  max-height: 88vh;
  background: rgba(18, 14, 10, 0.95);
  border: 1px solid rgba(255, 170, 0, 0.4);
  box-shadow: 0 0 35px rgba(255, 170, 0, 0.25);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: #fff8e1;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 170, 0, 0.25);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.8rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #ffb300;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffe082;
  font-size: 1.4rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff5252;
}

.dyson-content {
  padding: 18px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.telemetry-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: rgba(30, 20, 10, 0.6);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: 8px;
  padding: 12px 18px;
  gap: 12px;
}

.tele-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.t-icon {
  font-size: 1.4rem;
}

.t-label {
  color: #ffecb3;
  margin-right: 6px;
}

.t-val {
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #ffd700;
  font-size: 1rem;
}

.buff-active {
  color: #69f0ae;
  font-weight: 700;
}

.flare-alert {
  background: rgba(255, 61, 0, 0.2);
  border: 1px solid #ff3d00;
  border-radius: 8px;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { border-color: #ff3d00; }
  50% { border-color: #ff9100; box-shadow: 0 0 14px rgba(255, 61, 0, 0.5); }
}

.flare-info p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #ffccbc;
}

.flare-badge {
  background: #d50000;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
}

.harvest-flare-btn {
  background: #ff6d00;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.harvest-flare-btn:hover {
  background: #ff9100;
}

.center-stage {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 16px;
}

@media (max-width: 800px) {
  .center-stage {
    grid-template-columns: 1fr;
  }
}

.canvas-wrap {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.canvas-legend {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.75rem;
  color: #b0bec5;
  margin-top: 6px;
}

.phases-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phase-card {
  background: rgba(25, 20, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.phase-card.completed {
  border-color: #00e676;
}

.phase-card.active {
  border-color: #ffd600;
  box-shadow: 0 0 10px rgba(255, 214, 0, 0.25);
}

.phase-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 700;
}

.phase-sub {
  margin: 0;
  font-size: 0.75rem;
  color: #b0bec5;
}

.phase-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}

.phase-fill {
  height: 100%;
}

.phase-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.complete-tag {
  color: #00e676;
  font-weight: 700;
}

.curr-tag {
  color: #ffd600;
  font-weight: 700;
}

.lock-tag {
  color: #78909c;
}

.resource-contribute {
  background: rgba(25, 20, 15, 0.7);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.res-inventory h4 {
  margin: 0 0 6px;
  font-size: 0.9rem;
  color: #ffe082;
}

.res-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.pill strong {
  color: #ffd54f;
}

.contribute-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.fab-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.8rem;
}

.fab-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.contribute-btn {
  margin-left: auto;
  background: #ff8f00;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.contribute-btn:hover:not(:disabled) {
  background: #ffa000;
  box-shadow: 0 0 12px rgba(255, 143, 0, 0.5);
}

.contribute-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
