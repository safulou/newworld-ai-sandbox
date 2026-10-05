<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="slingshot-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🪐</span>
          <h2>跨星系蟲洞引力彈弓軌道網絡 (Wormhole Gravity Slingshot)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="slingshot-content">
        <!-- Top Status Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">⚡</span>
            <div>
              <span class="t-label">當前相對論速度:</span>
              <span class="t-val highlight">{{ stats.currentVelocityC.toFixed(1) }} c</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">⏳</span>
            <div>
              <span class="t-label">洛倫茲時間膨脹 γ:</span>
              <span class="t-val">{{ stats.lorentzFactor }}x</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🌡️</span>
            <div>
              <span class="t-label">外殼耐熱負荷:</span>
              <span class="t-val" :class="{ danger: stats.heatPercentage > 80 }">{{ Math.round(stats.heatPercentage) }}%</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">☀️</span>
            <div>
              <span class="t-label">戴森球共振推進:</span>
              <span class="t-val active">已同調 (+400%)</span>
            </div>
          </div>
        </div>

        <!-- Center Stage: Canvas Visualizer & Corridor Selector -->
        <div class="center-stage">
          <!-- Canvas Relativistic Orbit -->
          <div class="canvas-wrap glass-panel">
            <canvas ref="canvasRef" width="380" height="260"></canvas>
            <div class="canvas-legend">
              <span>近星點: {{ stats.periapsisRadiusKm.toLocaleString() }} km</span>
              <span>切入傾角: {{ stats.vectorAngleDeg }}°</span>
            </div>
          </div>

          <!-- Corridors Selection -->
          <div class="corridors-list">
            <div
              v-for="c in corridorsList"
              :key="c.id"
              class="corridor-card glass-panel"
              :class="{ active: c.id === stats.activeCorridor }"
              :style="{ borderColor: c.id === stats.activeCorridor ? c.color : 'rgba(255,255,255,0.15)' }"
              @click="selectCorridor(c.id)"
            >
              <div class="corridor-top">
                <span class="c-name" :style="{ color: c.color }">{{ c.name }}</span>
                <span class="c-dist">{{ c.distanceLY.toLocaleString() }} LY</span>
              </div>
              <p class="c-dest">📍 目的地: {{ c.destination }}</p>
              <div class="c-boost">
                <span>彈弓倍率: <strong>+{{ c.baseBoostMultiplier }}x</strong></span>
                <span class="hazard-badge" :class="c.hazardRating.toLowerCase()">{{ c.hazardRating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Orbital Controls & Slingshot Action -->
        <div class="controls-panel glass-panel">
          <div class="sliders-row">
            <div class="slider-group">
              <label>📐 切入向量角 ({{ stats.vectorAngleDeg }}°):</label>
              <input
                type="range"
                min="-45"
                max="45"
                step="1"
                v-model.number="vectorAngle"
                @input="onAngleChange"
                :disabled="stats.state !== 'standby'"
              />
            </div>

            <div class="slider-group">
              <label>🎯 近星點半徑 ({{ stats.periapsisRadiusKm.toLocaleString() }} km):</label>
              <input
                type="range"
                min="30000"
                max="300000"
                step="5000"
                v-model.number="periapsisKm"
                @input="onPeriapsisChange"
                :disabled="stats.state !== 'standby'"
              />
            </div>
          </div>

          <!-- Launch or Progress -->
          <div class="action-footer">
            <div v-if="stats.state !== 'standby'" class="progress-box">
              <div class="prog-info">
                <span>{{ progressText }}</span>
                <span>進度: {{ Math.round(stats.burnProgress) }}%</span>
              </div>
              <div class="prog-bar">
                <div class="prog-fill" :style="{ width: `${stats.burnProgress}%` }"></div>
              </div>
            </div>

            <div class="btn-group">
              <button
                v-if="stats.state === 'standby'"
                class="launch-btn"
                @click="initiateSlingshot"
              >
                🚀 切入恆星重力井雙曲線彈弓
              </button>
              <button
                v-else
                class="abort-btn"
                @click="abortSlingshot"
              >
                🛑 緊急脫離重力井
              </button>
            </div>
          </div>

          <div class="status-box">
            {{ stats.statusMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  wormholeSlingshot,
  SLINGSHOT_CORRIDORS,
  type CorridorId
} from '@/engine/wormholeSlingshot'

const ui = useUIStore()
const engine = wormholeSlingshot
const stats = engine.stats
const corridorsList = Object.values(SLINGSHOT_CORRIDORS)

const vectorAngle = ref(stats.vectorAngleDeg)
const periapsisKm = ref(stats.periapsisRadiusKm)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId: number | null = null
let orbitPhase = 0

const progressText = computed(() => {
  switch (stats.state) {
    case 'approach': return '靠近近星點中 (Approach)...'
    case 'slingshot_burn': return '近星點引力推進點火中 (Burn)！'
    case 'superluminal_exit': return '超光速彈出中 (Superluminal Exit)！'
    case 'cooldown': return '熱量散熱冷卻中 (Cooldown)...'
    default: return '待命中'
  }
})

function close(): void {
  ui.closeOverlay()
}

function selectCorridor(id: CorridorId): void {
  engine.selectCorridor(id)
  periapsisKm.value = engine.stats.periapsisRadiusKm
}

function onAngleChange(): void {
  engine.setVectorAngle(vectorAngle.value)
}

function onPeriapsisChange(): void {
  engine.setPeriapsis(periapsisKm.value)
}

function initiateSlingshot(): void {
  engine.initiateSlingshot()
}

function abortSlingshot(): void {
  engine.abortSlingshot()
}

function renderOrbitCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  const cx = w * 0.4
  const cy = h * 0.5

  ctx.clearRect(0, 0, w, h)

  // Draw Central Star & Gravity Well
  const starGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50)
  starGlow.addColorStop(0, '#ffffff')
  starGlow.addColorStop(0.3, '#ffcc00')
  starGlow.addColorStop(0.8, 'rgba(255, 61, 0, 0.4)')
  starGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = starGlow
  ctx.beginPath()
  ctx.arc(cx, cy, 50, 0, Math.PI * 2)
  ctx.fill()

  // Gravity field concentric circles
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)'
  ctx.lineWidth = 1
  for (let r = 70; r <= 160; r += 30) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Draw Hyperbolic Slingshot Trajectory
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((stats.vectorAngleDeg * Math.PI) / 180)

  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.beginPath()

  const pDist = 35 + (stats.periapsisRadiusKm / 300000) * 55
  // Plot hyperbolic curve x = pDist + a * t^2, y = b * t
  for (let t = -2.5; t <= 2.5; t += 0.1) {
    const px = pDist + 18 * (t * t)
    const py = 75 * t
    if (t === -2.5) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Animated probe on trajectory
  const probeT = (orbitPhase % 1) * 5 - 2.5
  const shipX = pDist + 18 * (probeT * probeT)
  const shipY = 75 * probeT

  ctx.fillStyle = '#ff0055'
  ctx.beginPath()
  ctx.arc(shipX, shipY, 5, 0, Math.PI * 2)
  ctx.fill()

  // Velocity vector trail
  ctx.strokeStyle = '#ffff00'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(shipX, shipY)
  ctx.lineTo(shipX + 36 * probeT * 0.2, shipY + 75 * 0.2)
  ctx.stroke()

  ctx.restore()

  orbitPhase += 0.015
  animId = requestAnimationFrame(renderOrbitCanvas)
}

onMounted(() => {
  renderOrbitCanvas()
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

.slingshot-modal {
  width: 92vw;
  max-width: 960px;
  max-height: 88vh;
  background: rgba(10, 16, 30, 0.95);
  border: 1px solid rgba(0, 229, 255, 0.4);
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.25);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: #e0f7fa;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 229, 255, 0.25);
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
  color: #00e5ff;
}

.close-btn {
  background: transparent;
  border: none;
  color: #80deea;
  font-size: 1.4rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff5252;
}

.slingshot-content {
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
  background: rgba(14, 25, 45, 0.6);
  border: 1px solid rgba(0, 229, 255, 0.3);
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
  color: #80cbc4;
  margin-right: 6px;
}

.t-val {
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #ffd700;
  font-size: 1.1rem;
}

.t-val.danger {
  color: #ff5252;
}

.t-val.active {
  color: #69f0ae;
}

.center-stage {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 16px;
}

@media (max-width: 820px) {
  .center-stage {
    grid-template-columns: 1fr;
  }
}

.canvas-wrap {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.canvas-legend {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.75rem;
  color: #b0bec5;
  margin-top: 4px;
}

.corridors-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.corridor-card {
  background: rgba(12, 22, 38, 0.7);
  border: 1px solid;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.corridor-card:hover {
  background: rgba(0, 229, 255, 0.12);
}

.corridor-card.active {
  background: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
}

.corridor-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.c-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.c-dist {
  font-size: 0.8rem;
  color: #80cbc4;
}

.c-dest {
  margin: 0;
  font-size: 0.8rem;
  color: #b0bec5;
}

.c-boost {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #ffd54f;
  margin-top: 2px;
}

.hazard-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.hazard-badge.moderate {
  background: rgba(0, 229, 255, 0.25);
  color: #00e5ff;
}

.hazard-badge.high {
  background: rgba(255, 170, 0, 0.25);
  color: #ffaa00;
}

.hazard-badge.extreme {
  background: rgba(255, 0, 85, 0.25);
  color: #ff1744;
}

.controls-panel {
  background: rgba(14, 25, 45, 0.7);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sliders-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 600px) {
  .sliders-row {
    grid-template-columns: 1fr;
  }
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  color: #b0bec5;
}

.slider-group input {
  accent-color: #00e5ff;
}

.action-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prog-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #80deea;
}

.prog-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #00e5ff, #ffff00);
  transition: width 0.2s;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
}

.launch-btn {
  background: #00b4d8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.launch-btn:hover {
  background: #0096c7;
  box-shadow: 0 0 12px rgba(0, 180, 216, 0.5);
}

.abort-btn {
  background: #d50000;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-weight: 700;
  cursor: pointer;
}

.status-box {
  background: rgba(0, 0, 0, 0.35);
  border-left: 3px solid #00e5ff;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #e0f7fa;
}
</style>
