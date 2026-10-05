<template>
  <div class="dyson-swarm-overlay" @click.self="ui.closeOverlay()">
    <div class="dyson-swarm-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🛰️</span>
          <div>
            <h2>戴森雲反射群集拓撲網絡</h2>
            <div class="subtitle">Dyson Swarm Mesh Collector & Solar Laser Relay Array</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">在軌反射鏡總數</span>
            <span class="val highlight">{{ stats.totalMirrors }} 面</span>
            <span class="sub">3 組開普勒軌道殼層</span>
          </div>
          <div class="stat-card">
            <span class="label">聚焦捕獲總能級</span>
            <span class="val power">{{ formatPower(stats.harnessedPowerWatts) }}</span>
            <span class="sub">{{ stats.harnessedPowerGW.toLocaleString() }} GW 輸出</span>
          </div>
          <div class="stat-card">
            <span class="label">軌道對準聚焦率</span>
            <span class="val" :class="stats.alignmentEfficiencyPercent < 70 ? 'danger' : 'success'">
              {{ stats.alignmentEfficiencyPercent.toFixed(1) }}%
            </span>
            <span class="sub">受太陽風輻射壓微擾</span>
          </div>
          <div class="stat-card">
            <span class="label">微隕石防護完整度</span>
            <span class="val" :class="stats.integrityPercent < 80 ? 'danger' : 'integrity'">
              {{ stats.integrityPercent.toFixed(1) }}%
            </span>
            <span class="sub">奈米蜂群 Lv.{{ stats.naniteRepairLevel }} 自動維修</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Orbiting Swarm Around Star -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            微波束目標：{{ beamTargetLabel }} [{{ stats.isBeaming ? '傳輸中' : '待機' }}]
          </div>
        </div>

        <!-- Beaming Target & Quick Operations Row -->
        <div class="operation-row">
          <div class="target-selector">
            <span class="target-title">📡 微波能束傳輸導向：</span>
            <div class="btn-group">
              <button
                class="target-btn"
                :class="{ active: stats.beamTarget === 'planetary_grid' }"
                @click="setBeamTarget('planetary_grid')"
              >
                🌍 行星受電網
              </button>
              <button
                class="target-btn"
                :class="{ active: stats.beamTarget === 'warp_gate' }"
                @click="setBeamTarget('warp_gate')"
              >
                🌀 星門重力井
              </button>
              <button
                class="target-btn"
                :class="{ active: stats.beamTarget === 'industrial_forge' }"
                @click="setBeamTarget('industrial_forge')"
              >
                ⚒️ 太陽物質鍛爐 ({{ stats.totalMatterSynthesizedKg.toFixed(0) }} kg)
              </button>
            </div>
          </div>
          <div class="quick-actions">
            <button class="action-btn align-btn" @click="calibrateAlignment">
              🎯 姿態推進微調
            </button>
            <button
              class="action-btn repair-btn"
              :disabled="stats.naniteRepairLevel >= 5"
              @click="upgradeNanites"
            >
              🛠️ 升級奈米維護 (Lv.{{ stats.naniteRepairLevel }})
            </button>
          </div>
        </div>

        <!-- Orbital Shells Management Section -->
        <div class="shells-section">
          <h3>🌌 軌道開普勒反射殼層配置</h3>
          <div class="shells-grid">
            <div
              v-for="shell in Object.values(shells)"
              :key="shell.id"
              class="shell-card"
            >
              <div class="shell-header">
                <span class="shell-name">{{ shell.name }}</span>
                <span class="shell-count">{{ shell.mirrorCount }} 面</span>
              </div>
              <div class="shell-details">
                <span>軌道半徑: {{ shell.radiusAU }} AU</span>
                <span>軌道傾角: {{ shell.inclinationDeg }}°</span>
                <span>幾何效率: {{ shell.efficiencyPercent }}%</span>
              </div>
              <button class="launch-btn" @click="launchMirrors(shell.id)">
                🚀 發射 +25 面光帆
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
import { dysonSwarmEngine, SwarmBeamTarget, OrbitalShellType } from '@/engine/dysonSwarmMesh'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => dysonSwarmEngine.stats)
const shells = computed(() => dysonSwarmEngine.shells)

const beamTargetLabel = computed(() => {
  switch (stats.value.beamTarget) {
    case 'planetary_grid': return '行星地表高頻受電網'
    case 'warp_gate': return '星門超空間跳躍電容'
    case 'industrial_forge': return '軌道太陽光壓合成鍛爐'
    default: return ''
  }
})

function formatPower(watts: number): string {
  if (watts >= 1e26) return `${(watts / 1e26).toFixed(2)} × 10²⁶ W`
  if (watts >= 1e21) return `${(watts / 1e21).toFixed(2)} ZW`
  if (watts >= 1e18) return `${(watts / 1e18).toFixed(2)} EW`
  if (watts >= 1e15) return `${(watts / 1e15).toFixed(2)} PW`
  if (watts >= 1e12) return `${(watts / 1e12).toFixed(2)} TW`
  return `${(watts / 1e9).toFixed(1)} GW`
}

function setBeamTarget(target: SwarmBeamTarget): void {
  dysonSwarmEngine.setBeamTarget(target)
}

function calibrateAlignment(): void {
  dysonSwarmEngine.calibrateAlignment()
}

function upgradeNanites(): void {
  dysonSwarmEngine.upgradeNaniteRepair()
}

function launchMirrors(shellId: OrbitalShellType): void {
  dysonSwarmEngine.launchMirrors(shellId, 25)
}

// ── Dynamic Canvas Rendering ───────────────────────────────────────────────
function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  animTime += 0.02
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2

  // Background
  ctx.fillStyle = '#060913'
  ctx.fillRect(0, 0, w, h)

  // Central Star Corona & Glow
  const pulse = Math.sin(animTime * 2) * 3
  const starGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32 + pulse)
  starGrad.addColorStop(0, '#ffffff')
  starGrad.addColorStop(0.2, '#fde047')
  starGrad.addColorStop(0.6, '#f97316')
  starGrad.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.fillStyle = starGrad
  ctx.arc(cx, cy, 32 + pulse, 0, Math.PI * 2)
  ctx.fill()

  // Keplerian Orbital Shells
  const shellConfigs = [
    { a: 80, b: 35, rot: 0, color: 'rgba(250, 204, 21, 0.4)', mirrors: shells.value.equatorial.mirrorCount },
    { a: 110, b: 45, rot: Math.PI / 4, color: 'rgba(56, 189, 248, 0.4)', mirrors: shells.value.inclined.mirrorCount },
    { a: 140, b: 55, rot: Math.PI / 2, color: 'rgba(168, 85, 247, 0.4)', mirrors: shells.value.polar.mirrorCount },
  ]

  shellConfigs.forEach((cfg, sIdx) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(cfg.rot)

    // Orbital ellipse
    ctx.beginPath()
    ctx.strokeStyle = cfg.color
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.ellipse(0, 0, cfg.a, cfg.b, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Render mirror particles orbiting
    const particleCount = Math.min(32, Math.max(8, Math.floor(cfg.mirrors / 4)))
    for (let p = 0; p < particleCount; p++) {
      const angle = animTime * (0.6 + sIdx * 0.2) + (p * Math.PI * 2) / particleCount
      const px = Math.cos(angle) * cfg.a
      const py = Math.sin(angle) * cfg.b

      // Mirror reflection glint
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(px, py, 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Occasional laser beam to center or target
      if (p % 4 === 0 && stats.value.isBeaming) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)'
        ctx.lineWidth = 1
        ctx.moveTo(px, py)
        ctx.lineTo(0, 0)
        ctx.stroke()
      }
    }
    ctx.restore()
  })

  // Laser Relay Beam to Output Target
  if (stats.value.isBeaming) {
    const targetX = w - 60
    const targetY = h - 50

    const beamGrad = ctx.createLinearGradient(cx, cy, targetX, targetY)
    beamGrad.addColorStop(0, 'rgba(253, 224, 71, 0.8)')
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.9)')

    ctx.beginPath()
    ctx.strokeStyle = beamGrad
    ctx.lineWidth = 3
    ctx.moveTo(cx, cy)
    ctx.lineTo(targetX, targetY)
    ctx.stroke()

    // Target terminal node
    ctx.beginPath()
    ctx.fillStyle = '#38bdf8'
    ctx.arc(targetX, targetY, 6, 0, Math.PI * 2)
    ctx.fill()
  }

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
.dyson-swarm-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.dyson-swarm-modal {
  width: 820px; max-height: 90vh; background: #0c0f1d; border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(250, 204, 21, 0.2); display: flex; flex-direction: column;
  color: #fef08a; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(250, 204, 21, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #fde047; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(250, 204, 21, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 16px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #fde047; }
.stat-card .power { color: #38bdf8; }
.stat-card .success { color: #34d399; }
.stat-card .danger { color: #f43f5e; }
.stat-card .integrity { color: #a78bfa; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(250, 204, 21, 0.3);
  background: #060913;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #fde047;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.operation-row {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(250, 204, 21, 0.2);
  border-radius: 8px; padding: 12px 14px;
}
.target-selector { display: flex; align-items: center; gap: 10px; }
.target-title { font-size: 12px; color: #94a3b8; white-space: nowrap; }
.btn-group { display: flex; gap: 6px; }
.target-btn {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px;
  padding: 6px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.target-btn.active {
  background: #ca8a04; color: #ffffff; border-color: #fde047;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
}

.quick-actions { display: flex; gap: 8px; }
.action-btn {
  border: none; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.align-btn { background: #0284c7; color: #ffffff; }
.align-btn:hover { background: #0ea5e9; }
.repair-btn { background: #7c3aed; color: #ffffff; }
.repair-btn:hover:not(:disabled) { background: #8b5cf6; }
.repair-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.shells-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #fde047; }
.shells-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.shell-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(250, 204, 21, 0.2);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.shell-header { display: flex; justify-content: space-between; align-items: center; }
.shell-name { font-size: 12px; font-weight: 700; color: #f1f5f9; }
.shell-count { font-size: 12px; color: #fde047; font-family: monospace; font-weight: 700; }
.shell-details { display: flex; flex-direction: column; gap: 2px; font-size: 11px; color: #94a3b8; }
.launch-btn {
  margin-top: 4px; background: #eab308; color: #000000; border: none; border-radius: 6px;
  padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.launch-btn:hover { background: #facc15; box-shadow: 0 0 12px rgba(250, 204, 21, 0.4); }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(250, 204, 21, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #fde047; font-family: monospace;
}
</style>
