<template>
  <div class="overlay" @click.self="close">
    <div class="hyperjump-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🌌</span>
          <h2>星艦超空間曲率躍遷驅動 (Hyperjump Hyperspace Drive)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Layout: 3 Columns -->
      <div class="content-body">
        <!-- Col 1: Star Sectors Navigation Catalog -->
        <div class="col-sectors">
          <div class="card-box">
            <div class="subhead">
              <span>🧭 深空目標星系象限</span>
              <span class="tag-badge">{{ hyperjump.sectors.filter(s => s.discovered).length }}/{{ hyperjump.sectors.length }} 已探明</span>
            </div>

            <div class="sectors-list">
              <div
                v-for="sec in hyperjump.sectors"
                :key="sec.id"
                class="sector-card"
                :class="{
                  active: hyperjump.stats.targetSectorId === sec.id,
                  current: hyperjump.stats.currentSectorId === sec.id,
                  locked: !sec.discovered && hyperjump.stats.currentSectorId !== sec.id
                }"
                @click="selectSector(sec.id)"
              >
                <div class="sector-head">
                  <span class="sector-name" :style="{ color: sec.color }">{{ sec.name }}</span>
                  <span v-if="hyperjump.stats.currentSectorId === sec.id" class="badge-curr">當前位置</span>
                  <span v-else-if="sec.discovered" class="badge-disc">已探明</span>
                  <span v-else class="badge-hazard" :class="sec.hazardLevel.toLowerCase()">{{ sec.hazardLevel }}</span>
                </div>
                <div class="sector-desc">{{ sec.description }}</div>
                <div class="sector-meta">
                  <span>距離: {{ sec.distanceLightSec.toLocaleString() }} 光秒</span>
                  <span>座標: [{{ sec.coordinates.join(', ') }}]</span>
                </div>
                <div class="sector-res">
                  <span v-for="res in sec.resources" :key="res" class="res-tag">{{ res }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2: Center Canvas Warp Tunnel & Flight Controller -->
        <div class="col-center">
          <div class="tunnel-container">
            <canvas ref="tunnelCanvas" class="tunnel-canvas" width="460" height="260"></canvas>
            <div class="tunnel-overlay">
              <div class="flight-status-badge" :class="hyperjump.stats.state">
                {{ getStateLabel(hyperjump.stats.state) }}
              </div>
              <div v-if="hyperjump.stats.state === 'charging'" class="progress-box">
                <div class="prog-text">曲率線圈高頻充能中... {{ Math.round(hyperjump.stats.chargeProgress) }}%</div>
                <div class="prog-bar"><div class="fill charging-fill" :style="{ width: hyperjump.stats.chargeProgress + '%' }"></div></div>
              </div>
              <div v-if="hyperjump.stats.state === 'in_warp'" class="progress-box">
                <div class="prog-text">超空間蟲洞穿梭中... {{ Math.round(hyperjump.stats.warpProgress) }}%</div>
                <div class="prog-bar"><div class="fill warp-fill" :style="{ width: hyperjump.stats.warpProgress + '%' }"></div></div>
              </div>
              <div v-if="hyperjump.stats.state === 'cooldown'" class="progress-box">
                <div class="prog-text">曲率散熱冷卻中... 尚餘 {{ hyperjump.stats.cooldownRemaining.toFixed(1) }}s</div>
                <div class="prog-bar"><div class="fill cooldown-fill" :style="{ width: ((6 - hyperjump.stats.cooldownRemaining) / 6 * 100) + '%' }"></div></div>
              </div>
            </div>
          </div>

          <!-- Controls Console -->
          <div class="controls-box card-box">
            <div class="slider-row">
              <label>曲率速度倍率: <strong class="neon-val">{{ hyperjump.stats.warpFactor }}x Warp</strong> (約 {{ (hyperjump.stats.warpFactor * 3.4).toFixed(1) }} 倍光速)</label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                :value="hyperjump.stats.warpFactor"
                :disabled="hyperjump.stats.state !== 'idle'"
                @input="onWarpSlider"
              />
            </div>

            <div class="meters-row">
              <div class="meter-item">
                <div class="meter-label">
                  <span>⚛️ 反物質燃料</span>
                  <strong>{{ hyperjump.stats.antimatterFuel }}%</strong>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fuel-fill" :style="{ width: hyperjump.stats.antimatterFuel + '%' }"></div>
                </div>
              </div>

              <div class="meter-item">
                <div class="meter-label">
                  <span>⚡ 躍遷電容儲量</span>
                  <strong>{{ Math.round(hyperjump.stats.capacitorCharge) }}%</strong>
                </div>
                <div class="meter-track">
                  <div class="meter-fill cap-fill" :style="{ width: hyperjump.stats.capacitorCharge + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="actions-row">
              <button
                v-if="hyperjump.stats.state === 'idle'"
                class="btn-engage"
                @click="engageJump"
              >
                🚀 啟動曲率折躍 (Engage Warp)
              </button>
              <button
                v-else-if="hyperjump.stats.state === 'charging'"
                class="btn-abort"
                @click="abortJump"
              >
                🛑 緊急中斷充能 (Abort)
              </button>
              <button
                v-else
                class="btn-disabled"
                disabled
              >
                {{ getStateLabel(hyperjump.stats.state) }}...
              </button>

              <button class="btn-refuel" @click="refuel">
                ⛽ 補充反物質 (+25%)
              </button>
            </div>
          </div>
        </div>

        <!-- Col 3: Telemetry & Log -->
        <div class="col-telemetry">
          <div class="card-box">
            <div class="subhead">
              <span>📊 航行遙測與時空度規</span>
            </div>
            <div class="telemetry-grid">
              <div class="tele-item">
                <span class="label">當前座標</span>
                <span class="val">{{ currentSector?.coordinates.join(', ') }}</span>
              </div>
              <div class="tele-item">
                <span class="label">目標象限</span>
                <span class="val" :style="{ color: targetSector?.color }">{{ targetSector?.name }}</span>
              </div>
              <div class="tele-item">
                <span class="label">四維空間畸變率</span>
                <span class="val">{{ (hyperjump.stats.warpFactor * 0.18).toFixed(2) }} Tensor-G</span>
              </div>
              <div class="tele-item">
                <span class="label">累計曲率跳躍</span>
                <span class="val">{{ hyperjump.stats.totalJumps }} 次</span>
              </div>
            </div>

            <div class="subhead" style="margin-top: 14px;">
              <span>📜 導航通訊廣播</span>
            </div>
            <div class="broadcast-box">
              <p>• 曲率核心磁約束場：穩定 (Magnetic Bottleneck 99.8%)</p>
              <p>• 目的地蟲洞喉徑：已鎖定 {{ targetSector?.distanceLightSec }} 光秒深度</p>
              <p>• 微重力船塢協定：超空間跳躍許可代碼已簽名</p>
              <p>• 提示：跳躍至極限區域可能採集到神話級稀有星塵與以太核心。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { hyperjumpDrive } from '@/engine/hyperjumpDrive'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const hyperjump = hyperjumpDrive
const tunnelCanvas = ref<HTMLCanvasElement | null>(null)
let animId: number = 0

const currentSector = computed(() => hyperjump.getCurrentSector())
const targetSector = computed(() => hyperjump.getCurrentTarget())

function close(): void {
  ui.closeOverlay()
}

function selectSector(id: string): void {
  hyperjump.selectDestination(id)
}

function onWarpSlider(e: Event): void {
  const val = Number((e.target as HTMLInputElement).value)
  hyperjump.setWarpFactor(val)
}

function engageJump(): void {
  hyperjump.initiateJump()
}

function abortJump(): void {
  hyperjump.abortJump()
}

function refuel(): void {
  hyperjump.refuelAntimatter(25)
}

function getStateLabel(state: string): string {
  switch (state) {
    case 'idle': return '🟢 待命 (Ready)'
    case 'charging': return '⚡ 充能中 (Charging)'
    case 'in_warp': return '🌌 超空間穿梭中 (In Warp)'
    case 'arrival': return '✨ 抵達象限 (Arrived)'
    case 'cooldown': return '❄️ 散熱冷卻 (Cooldown)'
    default: return state
  }
}

// ── Hyperspace Tunnel Particle Streaks Simulation ────────────────────────────
interface StarParticle {
  x: number
  y: number
  z: number
  pz: number
  color: string
}

let stars: StarParticle[] = []

function initStars(): void {
  stars = []
  const colors = ['#00ffff', '#ff00aa', '#ffffff', '#77aaff', '#cc88ff']
  for (let i = 0; i < 240; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      z: Math.random() * 800,
      pz: 800,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function renderTunnel(): void {
  const canvas = tunnelCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2

  // Background fade for motion blur
  ctx.fillStyle = 'rgba(5, 7, 18, 0.35)'
  ctx.fillRect(0, 0, width, height)

  const state = hyperjump.stats.state
  let speed = 4
  if (state === 'charging') speed = 12
  else if (state === 'in_warp') speed = 45
  else if (state === 'cooldown') speed = 2

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i]
    s.pz = s.z
    s.z -= speed

    if (s.z <= 0) {
      s.z = 800
      s.pz = 800
      s.x = (Math.random() - 0.5) * 800
      s.y = (Math.random() - 0.5) * 600
    }

    const k = 250 / s.z
    const px = s.x * k + cx
    const py = s.y * k + cy

    const pk = 250 / s.pz
    const prevX = s.x * pk + cx
    const prevY = s.y * pk + cy

    if (px >= 0 && px <= width && py >= 0 && py <= height) {
      const size = Math.max(1, (1 - s.z / 800) * 3)
      ctx.beginPath()
      ctx.strokeStyle = state === 'in_warp' ? '#00ffff' : s.color
      ctx.lineWidth = size
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(px, py)
      ctx.stroke()
    }
  }

  // Radial grid tunnel rings during in_warp
  if (state === 'in_warp') {
    const time = Date.now() * 0.003
    for (let r = 20; r < 200; r += 40) {
      const radius = ((r + time * 50) % 200)
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 * (1 - radius / 200)})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  animId = requestAnimationFrame(renderTunnel)
}

onMounted(() => {
  initStars()
  renderTunnel()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 20, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.hyperjump-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(8, 14, 32, 0.95), rgba(16, 24, 52, 0.95));
  border: 1px solid rgba(0, 255, 255, 0.35);
  box-shadow: 0 0 35px rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0f0ff;
  font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area h2 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: 1px;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.close-btn {
  background: transparent;
  border: none;
  color: #88aacc;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-btn:hover { color: #ff0055; }

.content-body {
  display: grid;
  grid-template-columns: 320px 1fr 300px;
  gap: 16px;
  padding: 16px;
  flex: 1;
  overflow: hidden;
}

.card-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.subhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 600;
  color: #77ccff;
  margin-bottom: 10px;
}

.tag-badge {
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Sectors list */
.sectors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.sector-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sector-card:hover {
  background: rgba(0, 255, 255, 0.08);
  border-color: rgba(0, 255, 255, 0.4);
}

.sector-card.active {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.12);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

.sector-card.current {
  border-left: 3px solid #ffaa00;
}

.sector-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.badge-curr {
  background: #ffaa00;
  color: #000;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
}

.badge-disc {
  background: #00ff88;
  color: #000;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
}

.badge-hazard {
  font-size: 0.65rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
}
.badge-hazard.low { background: #00ff88; color: #000; }
.badge-hazard.moderate { background: #ffaa00; color: #000; }
.badge-hazard.severe { background: #ff5500; color: #fff; }
.badge-hazard.extreme { background: #aa00ff; color: #fff; }

.sector-desc {
  font-size: 0.75rem;
  color: #a0c0e0;
  margin: 6px 0;
  line-height: 1.3;
}

.sector-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #6688aa;
}

.sector-res {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.res-tag {
  background: rgba(255, 255, 255, 0.06);
  color: #cceeff;
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 3px;
}

/* Center Col */
.col-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tunnel-container {
  position: relative;
  width: 100%;
  height: 280px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.tunnel-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.tunnel-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  pointer-events: none;
}

.flight-status-badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.flight-status-badge.idle { border-color: #00ff88; color: #00ff88; }
.flight-status-badge.charging { border-color: #ffaa00; color: #ffaa00; animation: blink 1s infinite alternate; }
.flight-status-badge.in_warp { border-color: #00ffff; color: #00ffff; box-shadow: 0 0 15px rgba(0, 255, 255, 0.6); }
.flight-status-badge.cooldown { border-color: #77aaff; color: #77aaff; }

@keyframes blink {
  from { opacity: 0.6; }
  to { opacity: 1.0; }
}

.progress-box {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 6px;
  padding: 8px 12px;
}

.prog-text {
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: #00ffff;
}

.prog-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.prog-bar .fill {
  height: 100%;
  transition: width 0.1s linear;
}
.charging-fill { background: linear-gradient(90deg, #ffaa00, #ff0055); }
.warp-fill { background: linear-gradient(90deg, #00ffff, #aa00ff); }
.cooldown-fill { background: #77aaff; }

/* Controls */
.controls-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 12px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.neon-val {
  color: #00ffff;
}

.meters-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.meter-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
}
.fuel-fill { background: linear-gradient(90deg, #00ff88, #00ffff); }
.cap-fill { background: linear-gradient(90deg, #ffaa00, #ff00aa); }

.actions-row {
  display: flex;
  gap: 10px;
}

.btn-engage {
  flex: 2;
  background: linear-gradient(90deg, #0088cc, #00ffff);
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
  transition: all 0.2s ease;
}
.btn-engage:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(0, 255, 255, 0.8); }

.btn-abort {
  flex: 2;
  background: #ff0055;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
}

.btn-disabled {
  flex: 2;
  background: rgba(255, 255, 255, 0.1);
  color: #777;
  border: none;
  border-radius: 6px;
  padding: 10px;
}

.btn-refuel {
  flex: 1;
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #00ffff;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-refuel:hover { background: rgba(0, 255, 255, 0.3); }

/* Col Telemetry */
.telemetry-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tele-item {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.04);
  padding: 6px 8px;
  border-radius: 4px;
}

.tele-item .label {
  font-size: 0.7rem;
  color: #6688aa;
}

.tele-item .val {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ffffff;
}

.broadcast-box {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px;
  font-size: 0.75rem;
  color: #a0c0e0;
  line-height: 1.4;
  overflow-y: auto;
  flex: 1;
}

.broadcast-box p {
  margin: 4px 0;
}
</style>
