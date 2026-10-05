<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="singularity-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🕳️</span>
          <h2>黑洞視界能層與奇點萃取站 (Gravitational Singularity Extractor)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="singularity-content">
        <!-- Telemetry Status Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">⚡</span>
            <div>
              <span class="t-label">彭羅斯淨出力:</span>
              <span class="t-val highlight">{{ stats.totalExtractedPowerMW.toLocaleString() }} MW</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🌀</span>
            <div>
              <span class="t-label">能層反衝效率:</span>
              <span class="t-val">{{ stats.penroseEfficiencyPercent }}%</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🌡️</span>
            <div>
              <span class="t-label">堆芯熱負荷:</span>
              <span class="t-val" :class="{ danger: stats.coreTemperatureK > 550 }">{{ Math.round(stats.coreTemperatureK) }} K</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">💎</span>
            <div>
              <span class="t-label">奇異夸克微胞:</span>
              <span class="t-val matter-val">{{ Math.floor(stats.totalSingularityMatter).toLocaleString() }} 單位</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="danger-badge" :class="stats.dangerLevel.toLowerCase().replace(' ', '-')">
              {{ stats.dangerLevel }}
            </span>
          </div>
        </div>

        <!-- Status Message Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">📡</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- Center Stage: Canvas Visualizer & Proximity Controls -->
        <div class="center-stage">
          <!-- Canvas: Relativistic Kerr Black Hole -->
          <div class="canvas-wrap glass-panel">
            <canvas ref="canvasRef" width="400" height="260"></canvas>
            <div class="canvas-overlay-data">
              <span>事件視界 Rs: {{ (stats.eventHorizonRadiusKm / 1000000).toFixed(1) }}M km</span>
              <span>能層界線: {{ (stats.ergosphereRadiusKm / 1000000).toFixed(1) }}M km</span>
              <span>萃取站距離: {{ (stats.proximityRadiusKm / 1000000).toFixed(2) }}M km</span>
            </div>
          </div>

          <!-- Controls: Proximity & Coolant Deck -->
          <div class="side-controls glass-panel">
            <h4 class="ctrl-title">🛸 空間拖拽軌道微調 (Ergosphere Proximity)</h4>
            <p class="ctrl-desc">越靠近能層，彭羅斯反衝發電效率越高，但吸積盤潮汐力與熱負荷急劇倍增。</p>

            <div class="proximity-buttons">
              <button class="step-btn warn" @click="adjustProximity(-1000000)">
                ⬇️ 推進靠近視界 (-1M km)
              </button>
              <button class="step-btn safe" @click="adjustProximity(1000000)">
                ⬆️ 退至安全外軌 (+1M km)
              </button>
            </div>

            <div class="coolant-block">
              <div class="coolant-info">
                <span>超流體氦四散熱系統: {{ stats.coolingEfficiencyPercent }}%</span>
              </div>
              <button class="coolant-btn" @click="injectCoolant">
                ❄️ 注入極冷超流體氦四 (-85 K)
              </button>
            </div>

            <div class="master-switch">
              <button
                class="switch-btn"
                :class="{ active: stats.isExtracting }"
                @click="toggleExtract"
              >
                {{ stats.isExtracting ? '⚡ 正在自能層抽取磁通 (運行中)' : '⏸️ 磁通迴路已切斷 (點擊啟動)' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Extraction Tiers Deck -->
        <div class="tiers-section">
          <h3 class="section-title">⚙️ 奇點工程萃取設備矩陣 (Extraction Tiers)</h3>
          <div class="tiers-grid">
            <div
              v-for="tier in tiersList"
              :key="tier.id"
              class="tier-card glass-panel"
              :class="{ unlocked: tier.isUnlocked }"
              :style="{ borderColor: tier.isUnlocked ? tier.color : 'rgba(255, 255, 255, 0.12)' }"
            >
              <div class="tier-top">
                <span class="tier-name" :style="{ color: tier.color }">{{ tier.name }}</span>
                <span v-if="tier.isUnlocked" class="tier-lvl">Lv.{{ tier.level }}</span>
                <span v-else class="tier-locked">未部署</span>
              </div>

              <p class="tier-desc">{{ tier.description }}</p>

              <div class="tier-stats">
                <span>出力: <strong>+{{ tier.powerOutputMW.toLocaleString() }} MW</strong></span>
                <span>奇異物質: <strong>+{{ tier.singularityMatterPerSec }}/s</strong></span>
                <span>熱量: <strong>+{{ tier.heatGenerationPerSec }} K/s</strong></span>
              </div>

              <button
                class="tier-action-btn"
                :style="{ borderColor: tier.color, color: tier.isUnlocked ? '#fff' : tier.color }"
                @click="upgradeTier(tier.id)"
              >
                {{ tier.isUnlocked ? `⚡ 升級模組 (Lv.${tier.level + 1})` : `🔓 部署設備 (${tier.costCredits.toLocaleString()} CR)` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ExtractorTierId,
  singularityExtractor
} from '../engine/singularityExtractor'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null
let angleOffset = 0

const stats = computed(() => {
  void refreshTrigger.value
  return singularityExtractor.stats
})

const tiersList = computed(() => {
  void refreshTrigger.value
  return Object.values(singularityExtractor.tiers)
})

function close(): void {
  ui.closeOverlay()
}

function toggleExtract(): void {
  singularityExtractor.toggleExtraction()
  refreshTrigger.value += 1
}

function adjustProximity(deltaKm: number): void {
  singularityExtractor.adjustProximity(deltaKm)
  refreshTrigger.value += 1
}

function injectCoolant(): void {
  singularityExtractor.injectCoolant()
  refreshTrigger.value += 1
}

function upgradeTier(tierId: ExtractorTierId): void {
  singularityExtractor.unlockOrUpgradeTier(tierId)
  refreshTrigger.value += 1
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

  // Background clear
  ctx.fillStyle = '#060914'
  ctx.fillRect(0, 0, w, h)

  angleOffset += 0.02

  // Accretion disk matter spiral particles
  for (let i = 0; i < 60; i++) {
    const a = angleOffset + (i * Math.PI) / 30
    const rad = 45 + ((i * 3.5) % 75)
    const px = cx + Math.cos(a) * rad * 1.5
    const py = cy + Math.sin(a) * rad * 0.55
    const isApproaching = Math.sin(a) < 0

    ctx.fillStyle = isApproaching ? 'rgba(0, 229, 255, 0.7)' : 'rgba(255, 100, 30, 0.5)'
    ctx.beginPath()
    ctx.arc(px, py, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Ergosphere outer ellipse (Frame Dragging)
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.ellipse(cx, cy, 75, 50, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Photon sphere glowing ring
  const grad = ctx.createRadialGradient(cx, cy, 22, cx, cy, 38)
  grad.addColorStop(0, '#000')
  grad.addColorStop(0.6, 'rgba(255, 145, 0, 0.8)')
  grad.addColorStop(1, 'rgba(255, 23, 68, 0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 38, 0, Math.PI * 2)
  ctx.fill()

  // Event horizon black shadow
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(cx, cy, 25, 0, Math.PI * 2)
  ctx.fill()

  // Singularity center point
  ctx.fillStyle = '#e040fb'
  ctx.beginPath()
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
  ctx.fill()

  // Extractor Station Position dot
  const stationDistRatio = (stats.value.proximityRadiusKm - 12100000) / (25000000 - 12100000)
  const stationRad = 40 + stationDistRatio * 65
  const stAngle = -angleOffset * 0.7
  const sx = cx + Math.cos(stAngle) * stationRad * 1.4
  const sy = cy + Math.sin(stAngle) * stationRad * 0.6

  // Magnetic tether beam to Ergosphere
  ctx.strokeStyle = stats.value.isExtracting ? 'rgba(0, 229, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(sx, sy)
  ctx.stroke()

  // Station dot
  ctx.fillStyle = '#00e5ff'
  ctx.beginPath()
  ctx.arc(sx, sy, 4.5, 0, Math.PI * 2)
  ctx.fill()
}

function loop(): void {
  renderCanvas()
  animFrameId = requestAnimationFrame(loop)
}

onMounted(() => {
  loop()
})

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.singularity-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(12, 16, 28, 0.95);
  border: 1px solid rgba(224, 64, 251, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(224, 64, 251, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(20, 26, 44, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(224, 64, 251, 0.25);
  background: rgba(224, 64, 251, 0.06);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title h2 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #e040fb;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e040fb;
}

.singularity-content {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Telemetry Bar */
.telemetry-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.tele-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-icon {
  font-size: 1.3rem;
}

.t-label {
  font-size: 0.76rem;
  color: #889;
  display: block;
}

.t-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #00e5ff;
}

.t-val.danger {
  color: #ff5252;
}

.matter-val {
  color: #e040fb;
  text-shadow: 0 0 6px rgba(224, 64, 251, 0.4);
}

.danger-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
  border: 1px solid #00ff88;
}

.danger-badge.warning {
  background: rgba(255, 145, 0, 0.15);
  color: #ff9100;
  border-color: #ff9100;
}

.danger-badge.critical-overheat, .danger-badge.horizon-breach {
  background: rgba(255, 23, 68, 0.2);
  color: #ff1744;
  border-color: #ff1744;
  animation: blink 0.8s infinite alternate;
}

@keyframes blink {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

/* Status Banner */
.status-banner {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(224, 64, 251, 0.08);
  border: 1px solid rgba(224, 64, 251, 0.25);
  font-size: 0.82rem;
  color: #f3e5f5;
}

/* Center Stage */
.center-stage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 820px) {
  .center-stage {
    grid-template-columns: 1fr;
  }
}

.canvas-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060914;
}

.canvas-wrap canvas {
  width: 100%;
  height: 260px;
  display: block;
}

.canvas-overlay-data {
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #889;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
}

.side-controls {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ctrl-title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #00e5ff;
}

.ctrl-desc {
  margin: 0;
  font-size: 0.72rem;
  color: #889;
  line-height: 1.3;
}

.proximity-buttons {
  display: flex;
  gap: 8px;
}

.step-btn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e0e6ed;
}

.step-btn.warn:hover {
  border-color: #ff9100;
  color: #ff9100;
}

.step-btn.safe:hover {
  border-color: #00ff88;
  color: #00ff88;
}

.coolant-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 229, 255, 0.05);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 229, 255, 0.15);
}

.coolant-info {
  font-size: 0.72rem;
  color: #00e5ff;
}

.coolant-btn {
  padding: 6px;
  background: linear-gradient(135deg, #0091ea, #00b0ff);
  border: none;
  border-radius: 4px;
  color: #06101c;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.coolant-btn:hover {
  box-shadow: 0 0 10px rgba(0, 176, 255, 0.4);
}

.master-switch {
  margin-top: auto;
}

.switch-btn {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #aaa;
}

.switch-btn.active {
  background: linear-gradient(135deg, #aa00ff, #e040fb);
  color: #fff;
  border-color: #ea80fc;
  box-shadow: 0 0 15px rgba(224, 64, 251, 0.35);
}

/* Tiers Section */
.section-title {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.tiers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .tiers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tier-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(18, 24, 40, 0.7);
  transition: all 0.2s;
}

.tier-card.unlocked {
  background: rgba(22, 30, 52, 0.85);
}

.tier-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tier-name {
  font-size: 0.82rem;
  font-weight: 600;
}

.tier-lvl {
  font-size: 0.7rem;
  font-weight: 700;
  color: #00ff88;
  background: rgba(0, 255, 136, 0.12);
  padding: 1px 6px;
  border-radius: 4px;
}

.tier-locked {
  font-size: 0.7rem;
  color: #778;
}

.tier-desc {
  margin: 0;
  font-size: 0.7rem;
  color: #889;
  line-height: 1.3;
  min-height: 48px;
}

.tier-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.68rem;
  color: #9ab;
  background: rgba(0, 0, 0, 0.25);
  padding: 4px 6px;
  border-radius: 4px;
}

.tier-action-btn {
  margin-top: 6px;
  background: transparent;
  border: 1px solid;
  border-radius: 5px;
  padding: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tier-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
</style>
