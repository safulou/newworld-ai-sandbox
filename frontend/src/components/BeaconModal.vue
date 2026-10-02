<template>
  <div class="overlay" @click.self="close">
    <div class="beacon-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">📡</span>
          <h2>全息星圖量子跨次元躍遷信標網絡 (Quantum Stellar Beacon Network)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Top Network Status Banner -->
      <div class="top-banner">
        <div class="banner-stat">
          <span class="b-lbl">📡 總部署信標</span>
          <span class="b-val">{{ net.stats.totalBeacons }} 處</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🟢 在線活躍信標</span>
          <span class="b-val good">{{ net.stats.activeBeacons }} 處</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">📶 拓撲信號強度</span>
          <span class="b-val good">{{ net.stats.networkStrength }}%</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🌀 量子微熵值</span>
          <span class="b-val">{{ net.stats.quantumEntropy.toFixed(2) }} ΔS</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🚀 累計波函數坍縮折躍</span>
          <span class="b-val warp">{{ net.stats.totalTeleports }} 次</span>
        </div>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Col 1: Star Map Topological Canvas -->
        <div class="col-canvas card-box">
          <div class="subhead">
            <span>🌌 全息星圖量子節點拓撲 (3D Holographic Star Map)</span>
            <span class="tag-badge">實時頻率鎖定</span>
          </div>

          <div class="starmap-wrap">
            <canvas ref="starMapCanvas" width="560" height="340" class="starmap-cvs"></canvas>
          </div>

          <!-- Deploy Custom Beacon Form -->
          <div class="deploy-form">
            <div class="subhead" style="margin-bottom: 6px;">
              <span>📍 部署新量子錨點信標</span>
            </div>
            <div class="form-row">
              <input v-model="newBeaconName" placeholder="信標名稱 (例: 祕境浮島基地)..." class="inp-name" />
              <select v-model="newBeaconDim" class="sel-dim">
                <option value="overworld">主世界 (Overworld)</option>
                <option value="orbital_space">軌道太空 (Orbital)</option>
                <option value="deep_abyss">深海海溝 (Abyss)</option>
                <option value="deep_space">深空星系 (DeepSpace)</option>
              </select>
              <input v-model="newBeaconColor" type="color" class="inp-color" />
              <button class="btn-deploy" @click="deployBeacon">
                ⚡ 部署信標
              </button>
            </div>
          </div>
        </div>

        <!-- Col 2: Beacons Directory & Fast Travel Actions -->
        <div class="col-directory card-box">
          <div class="subhead">
            <span>🧭 跨次元量子信標名錄</span>
            <span class="tag-badge">無縫瞬時傳送</span>
          </div>

          <div class="beacons-list">
            <div
              v-for="b in net.beacons"
              :key="b.id"
              class="beacon-card"
              :class="{ offline: !b.isOnline }"
              :style="{ borderLeftColor: b.color }"
            >
              <div class="b-head">
                <span class="b-name" :style="{ color: b.color }">{{ b.name }}</span>
                <span class="dim-tag" :class="b.dimension">{{ getDimLabel(b.dimension) }}</span>
              </div>
              <div class="b-desc">{{ b.description }}</div>

              <div class="b-meta">
                <span>座標: [{{ b.coords.join(', ') }}]</span>
                <span>頻率: {{ b.frequencyGHz }} GHz</span>
                <span>折躍: {{ b.teleportCount }} 次</span>
              </div>

              <div class="b-actions">
                <button
                  class="btn-warp"
                  :disabled="!b.isOnline"
                  @click="warpTo(b.id)"
                >
                  🌀 瞬時折躍 (Fast Travel)
                </button>
                <button class="btn-toggle" @click="net.toggleBeacon(b.id)">
                  {{ b.isOnline ? '離線' : '上線' }}
                </button>
                <button v-if="b.isCustom" class="btn-del" @click="net.removeCustomBeacon(b.id)">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Logs -->
          <div class="subhead" style="margin-top: 10px; margin-bottom: 4px;">
            <span>📜 量子折躍遙測通訊</span>
          </div>
          <div class="beacon-logs">
            <div v-for="(log, idx) in net.logs" :key="idx" class="b-line">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { stellarBeacons, BeaconDimension } from '@/engine/stellarBeacons'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const net = stellarBeacons
const starMapCanvas = ref<HTMLCanvasElement | null>(null)
let animId: number = 0

const newBeaconName = ref('')
const newBeaconDim = ref<BeaconDimension>('overworld')
const newBeaconColor = ref('#00ffff')

function close(): void {
  ui.closeOverlay()
}

function getDimLabel(dim: BeaconDimension): string {
  switch (dim) {
    case 'overworld': return '主次元'
    case 'orbital_space': return '軌道太空'
    case 'deep_abyss': return '深淵海溝'
    case 'deep_space': return '深空星系'
  }
}

function warpTo(id: string): void {
  net.warpToBeacon(id)
}

function deployBeacon(): void {
  const x = Math.round((Math.random() - 0.5) * 200)
  const z = Math.round((Math.random() - 0.5) * 200)
  const y = newBeaconDim.value === 'orbital_space' ? 190 : (newBeaconDim.value === 'deep_abyss' ? -55 : 20)
  net.deployCustomBeacon(newBeaconName.value, [x, y, z], newBeaconDim.value, newBeaconColor.value)
  newBeaconName.value = ''
}

// ── 3D Star Map Topology Simulation ─────────────────────────────────────────
function drawStarMap(): void {
  const canvas = starMapCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2

  ctx.fillStyle = 'rgba(2, 6, 18, 0.4)'
  ctx.fillRect(0, 0, width, height)

  const time = Date.now() * 0.0015

  // Draw background star dust
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 12345.67) % width)
    const sy = ((i * 76543.21) % height)
    ctx.fillRect(sx, sy, 1.5, 1.5)
  }

  // Draw Quantum Entanglement Mesh Lines between beacons
  const beacons = net.beacons
  const screenPositions: { x: number; y: number; color: string; online: boolean; name: string }[] = []

  beacons.forEach((b, idx) => {
    const angle = (idx / beacons.length) * Math.PI * 2 + time * 0.2
    const radius = 90 + (idx % 2 === 0 ? 35 : -20)
    const px = cx + Math.cos(angle) * radius
    const py = cy + Math.sin(angle) * (radius * 0.65)
    screenPositions.push({ x: px, y: py, color: b.color, online: b.isOnline, name: b.name })
  })

  // Lines
  ctx.lineWidth = 1
  for (let i = 0; i < screenPositions.length; i++) {
    for (let j = i + 1; j < screenPositions.length; j++) {
      if (screenPositions[i].online && screenPositions[j].online) {
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.18)'
        ctx.beginPath()
        ctx.moveTo(screenPositions[i].x, screenPositions[i].y)
        ctx.lineTo(screenPositions[j].x, screenPositions[j].y)
        ctx.stroke()
      }
    }
  }

  // Draw Beacons nodes
  screenPositions.forEach(p => {
    // Pulse ring
    if (p.online) {
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(p.x, p.y, 8 + Math.sin(time * 3) * 3, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Node Dot
    ctx.fillStyle = p.online ? p.color : '#555555'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()

    // Node Label
    ctx.fillStyle = '#ffffff'
    ctx.font = '10px monospace'
    ctx.fillText(p.name.slice(0, 8), p.x + 8, p.y + 3)
  })

  animId = requestAnimationFrame(drawStarMap)
}

onMounted(() => {
  drawStarMap()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 20, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.beacon-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(6, 14, 30, 0.96), rgba(12, 24, 48, 0.96));
  border: 1px solid rgba(0, 255, 200, 0.35);
  box-shadow: 0 0 35px rgba(0, 255, 200, 0.2);
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
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(0, 255, 200, 0.2);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #00ffcc;
  text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
}

.close-btn {
  background: transparent;
  border: none;
  color: #88aacc;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-btn:hover { color: #ff0055; }

/* Top Banner */
.top-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 10px;
}

.banner-stat { display: flex; flex-direction: column; }
.b-lbl { font-size: 0.7rem; color: #88aacc; }
.b-val { font-size: 1.1rem; font-weight: bold; }
.good { color: #00ff88; }
.warp { color: #00ffff; }

/* Content Body */
.content-body {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 16px;
  padding: 16px;
  flex: 1;
  overflow: hidden;
}

.card-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px;
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
  background: rgba(0, 255, 200, 0.15);
  color: #00ffcc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Star Map */
.starmap-wrap {
  flex: 1;
  background: #000;
  border: 1px solid rgba(0, 255, 200, 0.3);
  border-radius: 6px;
  overflow: hidden;
}
.starmap-cvs { width: 100%; height: 100%; display: block; }

.deploy-form {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 6px;
}

.form-row {
  display: flex;
  gap: 8px;
}

.inp-name {
  flex: 2;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.sel-dim {
  flex: 1.2;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #00ffcc;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.inp-color {
  width: 38px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.btn-deploy {
  padding: 6px 12px;
  background: linear-gradient(90deg, #0088cc, #00ffcc);
  color: #000;
  font-weight: bold;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Beacons List */
.beacons-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.beacon-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left-width: 4px;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.beacon-card.offline { opacity: 0.5; border-color: #555; }

.b-head {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.b-name { font-size: 0.85rem; }

.dim-tag {
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 3px;
}
.dim-tag.overworld { background: #00ff88; color: #000; }
.dim-tag.orbital_space { background: #ff00aa; color: #fff; }
.dim-tag.deep_abyss { background: #0088ff; color: #fff; }
.dim-tag.deep_space { background: #aa00ff; color: #fff; }

.b-desc { font-size: 0.7rem; color: #88aacc; }

.b-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #6688aa;
}

.b-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.btn-warp {
  flex: 1;
  padding: 6px;
  background: linear-gradient(90deg, #0088cc, #00ffcc);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}
.btn-warp:disabled { background: rgba(255, 255, 255, 0.1); color: #666; cursor: not-allowed; }

.btn-toggle {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ccc;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}

.btn-del {
  padding: 4px 8px;
  background: rgba(255, 0, 85, 0.2);
  border: 1px solid #ff0055;
  color: #ff5588;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}

.beacon-logs {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #88ccee;
  overflow-y: auto;
  flex: 1;
}

.b-line { margin: 2px 0; }
</style>
