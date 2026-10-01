<template>
  <div class="overlay" @click.self="close">
    <div class="abyss-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🌊</span>
          <h2>深海深淵海溝與電漿深潛艇 (Abyssal Submersible)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Content -->
      <div class="content-body">
        <!-- Left: Cockpit Telemetry & Controls -->
        <div class="col-telemetry">
          <div class="card-box">
            <div class="subhead">🎛️ 深潛艇座艙姿態儀</div>
            <div class="tele-grid">
              <div class="gauge-card">
                <span class="g-label">當前深度 (Y)</span>
                <span class="g-val depth">{{ Math.round(depth) }} m</span>
                <span class="g-sub">{{ depth < 16 ? '海溝深淵區' : '海面大氣層' }}</span>
              </div>
              <div class="gauge-card">
                <span class="g-label">靜水水壓 (Pressure)</span>
                <span class="g-val pressure">{{ pressure }} Bar</span>
                <span class="g-sub">大氣壓 (ATM)</span>
              </div>
              <div class="gauge-card">
                <span class="g-label">外殼抗壓 (Hull)</span>
                <span class="g-val hull" :class="{ danger: hull < 40 }">{{ hull }}%</span>
                <span class="g-sub">超壓結構穩定</span>
              </div>
              <div class="gauge-card">
                <span class="g-label">電漿電池 (Power)</span>
                <span class="g-val power">{{ battery }}%</span>
                <span class="g-sub">氧氣維生系統</span>
              </div>
            </div>

            <!-- Controls -->
            <div class="controls-row">
              <button
                class="btn-act light-btn"
                :class="{ active: floodlight }"
                @click="toggleLight"
              >
                {{ floodlight ? '💡 前向深海聚光燈 (ON)' : '🌑 前向深海聚光燈 (OFF)' }}
              </button>
              <button
                class="btn-act ping-btn"
                :disabled="isPinging"
                @click="pingSonar"
              >
                {{ isPinging ? '📡 聲納脈衝回波探測中...' : '📡 發射主動聲納脈衝 (Sonar Ping)' }}
              </button>
            </div>
          </div>

          <!-- Harvested Abyssal Minerals -->
          <div class="card-box">
            <div class="subhead">💎 深淵礦物採樣資產</div>
            <div class="mineral-list">
              <div
                v-for="m in mineralsCatalog"
                :key="m.id"
                class="mineral-row"
              >
                <div class="min-left">
                  <span class="min-dot" :style="{ backgroundColor: m.color }"></span>
                  <div class="min-info">
                    <span class="min-name">{{ m.name }}</span>
                    <span class="min-desc">{{ m.description }}</span>
                  </div>
                </div>
                <div class="min-right">
                  <span class="min-count">x{{ inventory[m.id] || 0 }}</span>
                  <span class="min-val">{{ m.value }} 晶體</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Circular Active Sonar Radar & Vents -->
        <div class="col-radar">
          <div class="card-box radar-box">
            <div class="subhead">
              <span>📡 360° 深淵水聲聲納螢幕</span>
              <span class="status-badge" :class="{ live: isPinging }">
                {{ isPinging ? 'PINGING...' : 'STANDBY' }}
              </span>
            </div>

            <!-- Sonar Canvas Display -->
            <div class="sonar-screen-wrap">
              <canvas ref="sonarCanvas" width="300" height="300" class="sonar-canvas"></canvas>
            </div>

            <!-- Sonar Contacts List -->
            <div class="contacts-wrap">
              <div class="contacts-title">聲納回波目標 (Contacts: {{ contacts.length }})</div>
              <div v-if="contacts.length === 0" class="empty-contacts">
                點擊「發射主動聲納脈衝」掃描周圍 150m 水域
              </div>
              <div v-else class="contacts-list">
                <div
                  v-for="(c, idx) in contacts"
                  :key="idx"
                  class="contact-item"
                  :class="c.type"
                >
                  <span class="c-type-icon">
                    {{ c.type === 'leviathan' ? '🐉' : '🌋' }}
                  </span>
                  <div class="c-details">
                    <span class="c-name">{{ c.name }}</span>
                    <span class="c-bearing">方位 {{ c.bearingDeg }}° | 距離 {{ c.distance }}m</span>
                  </div>
                  <button
                    v-if="c.type === 'vent'"
                    class="btn-harvest"
                    @click="harvestVent(c.name)"
                  >
                    採樣
                  </button>
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
import {
  abyssalTrench,
  ABYSSAL_MINERALS,
  SonarContact
} from '@/engine/abyssalTrench'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const depth = ref(abyssalTrench.currentDepth)
const pressure = ref(abyssalTrench.hydrostaticPressure)
const hull = ref(abyssalTrench.hullIntegrity)
const battery = ref(abyssalTrench.oxygenBattery)
const floodlight = ref(abyssalTrench.floodlightOn)
const isPinging = ref(abyssalTrench.isSonarActive)
const inventory = ref({ ...abyssalTrench.inventory })
const contacts = ref<SonarContact[]>([...abyssalTrench.latestSonarContacts])

const mineralsCatalog = ABYSSAL_MINERALS
const sonarCanvas = ref<HTMLCanvasElement | null>(null)
let animId: number | null = null
let sweepAngle = 0

function toggleLight(): void {
  floodlight.value = abyssalTrench.toggleFloodlight()
}

function pingSonar(): void {
  isPinging.value = true
  contacts.value = abyssalTrench.triggerSonarPing()
  setTimeout(() => {
    isPinging.value = false
  }, 1500)
}

function harvestVent(ventName: string): void {
  const vent = abyssalTrench.vents.find(v => v.name === ventName)
  if (vent) {
    abyssalTrench.harvestVent(vent.id)
    inventory.value = { ...abyssalTrench.inventory }
    ui.setBuildStatus(`💎 成功從 ${vent.name} 採樣深淵礦物！`)
    setTimeout(() => ui.setBuildStatus(''), 2000)
  }
}

function drawSonar(): void {
  const canvas = sonarCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const radius = w / 2 - 10

  // Clear
  ctx.fillStyle = '#030b14'
  ctx.fillRect(0, 0, w, h)

  // Radar rings
  ctx.strokeStyle = 'rgba(0, 255, 200, 0.2)'
  ctx.lineWidth = 1
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath()
    ctx.arc(cx, cy, (radius / 3) * r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Crosshairs
  ctx.beginPath()
  ctx.moveTo(cx, 10)
  ctx.lineTo(cx, h - 10)
  ctx.moveTo(10, cy)
  ctx.lineTo(w - 10, cy)
  ctx.stroke()

  // Rotating sweep line
  sweepAngle += 0.03
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(sweepAngle)

  const grad = ctx.createLinearGradient(0, 0, radius, 0)
  grad.addColorStop(0, 'rgba(0, 255, 200, 0.6)')
  grad.addColorStop(1, 'rgba(0, 255, 200, 0.0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, -0.35, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Draw contacts blips
  for (const c of contacts.value) {
    const normDist = Math.min(1, c.distance / 150) * radius
    const rad = ((c.bearingDeg - 90) * Math.PI) / 180
    const bx = cx + Math.cos(rad) * normDist
    const by = cy + Math.sin(rad) * normDist

    ctx.beginPath()
    ctx.arc(bx, by, c.type === 'leviathan' ? 6 : 4, 0, Math.PI * 2)
    ctx.fillStyle = c.type === 'leviathan' ? '#ff0077' : '#ffaa00'
    ctx.fill()
    ctx.shadowBlur = 8
    ctx.shadowColor = ctx.fillStyle
    ctx.shadowBlur = 0
  }

  // Center Sub dot
  ctx.beginPath()
  ctx.arc(cx, cy, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#00ffff'
  ctx.fill()

  animId = requestAnimationFrame(drawSonar)
}

onMounted(() => {
  animId = requestAnimationFrame(drawSonar)
})

onUnmounted(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId)
  }
})

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(2, 6, 12, 0.88);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(10px);
}
.abyss-panel {
  width: 940px; max-width: 95vw; max-height: 90vh;
  background: rgba(6, 14, 24, 0.95);
  border: 1px solid rgba(0, 255, 200, 0.35);
  border-radius: 14px; color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  display: flex; flex-direction: column; overflow: hidden;
}
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid rgba(0, 255, 200, 0.15);
  background: rgba(0, 255, 200, 0.05);
}
.title-area { display: flex; align-items: center; gap: 10px; }
.title-area h2 { font-size: 18px; color: #00ffcc; font-weight: 700; margin: 0; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #ff0055; }

.content-body {
  display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px;
  padding: 20px; overflow-y: auto;
}

.card-box {
  background: rgba(8, 20, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; padding: 16px; margin-bottom: 16px;
}
.subhead {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 14px; font-weight: 700; color: #00e5ff; margin-bottom: 12px;
}

.tele-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;
}
.gauge-card {
  background: rgba(0,0,0,0.4); border-radius: 8px; padding: 10px;
  display: flex; flex-direction: column; gap: 4px;
}
.g-label { font-size: 11px; color: rgba(255,255,255,0.6); }
.g-val { font-size: 16px; font-weight: 700; }
.g-val.depth { color: #00ffff; }
.g-val.pressure { color: #ffaa00; }
.g-val.hull { color: #00ff88; }
.g-val.hull.danger { color: #ff0055; }
.g-val.power { color: #ffff00; }
.g-sub { font-size: 10px; color: rgba(255,255,255,0.4); }

.controls-row { display: flex; flex-direction: column; gap: 8px; }
.btn-act {
  background: rgba(0, 255, 200, 0.15); border: 1px solid #00ffcc;
  color: #00ffcc; border-radius: 6px; padding: 10px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-act:hover:not(:disabled) {
  background: #00ffcc; color: #000; box-shadow: 0 0 12px rgba(0,255,200,0.5);
}
.btn-act:disabled { opacity: 0.5; cursor: not-allowed; }
.light-btn.active {
  background: rgba(255, 215, 0, 0.2); border-color: #ffd700; color: #ffd700;
}

.mineral-list { display: flex; flex-direction: column; gap: 8px; }
.mineral-row {
  background: rgba(0,0,0,0.3); border-radius: 6px; padding: 8px 12px;
  display: flex; justify-content: space-between; align-items: center;
}
.min-left { display: flex; align-items: center; gap: 8px; }
.min-dot { width: 10px; height: 10px; border-radius: 50%; }
.min-info { display: flex; flex-direction: column; }
.min-name { font-size: 12px; font-weight: 600; color: #fff; }
.min-desc { font-size: 10px; color: rgba(255,255,255,0.5); }
.min-right { display: flex; flex-direction: column; align-items: flex-end; }
.min-count { font-size: 13px; font-weight: 700; color: #00ffcc; }
.min-val { font-size: 10px; color: rgba(255,255,255,0.4); }

.sonar-screen-wrap {
  display: flex; justify-content: center; margin: 10px 0;
}
.sonar-canvas {
  background: #030b14; border-radius: 50%; border: 2px solid rgba(0, 255, 200, 0.4);
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.2);
}
.status-badge { font-size: 11px; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.1); }
.status-badge.live { background: #00ffcc; color: #000; font-weight: 700; }

.contacts-wrap { margin-top: 10px; }
.contacts-title { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
.empty-contacts { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; padding: 10px; }
.contacts-list { display: flex; flex-direction: column; gap: 6px; max-height: 140px; overflow-y: auto; }
.contact-item {
  background: rgba(0,0,0,0.4); border-radius: 6px; padding: 6px 10px;
  display: flex; align-items: center; justify-content: space-between;
}
.contact-item.leviathan { border-left: 3px solid #ff0077; }
.contact-item.vent { border-left: 3px solid #ffaa00; }
.c-type-icon { font-size: 14px; margin-right: 6px; }
.c-details { display: flex; flex-direction: column; flex: 1; }
.c-name { font-size: 11px; font-weight: 600; color: #fff; }
.c-bearing { font-size: 10px; color: rgba(255,255,255,0.5); }
.btn-harvest {
  background: rgba(255, 170, 0, 0.2); border: 1px solid #ffaa00;
  color: #ffaa00; border-radius: 4px; padding: 2px 8px; font-size: 10px; font-weight: 700;
  cursor: pointer;
}
.btn-harvest:hover { background: #ffaa00; color: #000; }
</style>
