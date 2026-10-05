<template>
  <div class="planetary-core-overlay" @click.self="ui.closeOverlay()">
    <div class="planetary-core-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🌋</span>
          <div>
            <h2>全球地熱超深鑽井與行星地核引擎</h2>
            <div class="subtitle">Planetary Core Dynamo & Super-Deep Geothermal Borehole</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">當前鑽探深度 / 地層</span>
            <span class="val highlight">{{ stats.currentDepthKm.toFixed(1) }} km</span>
            <span class="sub">{{ currentStratumName }}</span>
          </div>
          <div class="stat-card">
            <span class="label">地核溫度 / 地熱發電</span>
            <span class="val temp">{{ stats.coreTemperatureK.toFixed(0) }} K</span>
            <span class="sub">⚡ {{ (stats.totalGeothermalPowerMW / 1000).toFixed(1) }} GW 恆定輸出</span>
          </div>
          <div class="stat-card">
            <span class="label">地磁發電機磁盾</span>
            <span class="val shield">{{ stats.geodynamoShieldPercent }}% 屏障</span>
            <span class="sub">完全防禦宇宙風暴</span>
          </div>
          <div class="stat-card">
            <span class="label">板塊構造應力 / 深核結晶</span>
            <span class="val" :class="stats.tectonicStressPercent > 75 ? 'danger' : 'stress'">
              {{ stats.tectonicStressPercent.toFixed(1) }}%
            </span>
            <span class="sub">💎 已收穫 {{ stats.coreCrystalsHarvested }} 枚結晶</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Planetary Strata Cross-section -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            鑽頭狀態：{{ activeBitName }} [{{ stats.isDrilling ? '超臨界鑽進中' : '待機' }}]
          </div>
        </div>

        <!-- Seismic Stress & Venting Emergency Control -->
        <div class="venting-box" :class="{ alert: stats.seismicWarning }">
          <div class="vent-info">
            <div class="vent-title">
              <span class="vent-icon">{{ stats.seismicWarning ? '🚨' : '🛡️' }}</span>
              <span>板塊應力安全釋放控制 (Seismic Stress Relief)</span>
            </div>
            <p>鑽探會累積地殼構造應力。當應力超過 80% 時可能引發破壞性地震。啟動脈衝洩壓閥可安全冷卻斷層並凝析高價值「深核結晶」。</p>
            <div class="stress-bar-wrap">
              <div
                class="stress-bar"
                :class="{ high: stats.tectonicStressPercent > 70 }"
                :style="{ width: `${stats.tectonicStressPercent}%` }"
              ></div>
            </div>
          </div>
          <button
            class="vent-btn"
            :disabled="stats.tectonicStressPercent < 5"
            @click="ventStress"
          >
            啟動脈衝洩壓閥
          </button>
        </div>

        <!-- Drill Bit Matrix -->
        <div class="drill-section">
          <h3>⚙️ 地核鑽具裝配矩陣 (Drill Bit Assemblies)</h3>
          <div class="drill-grid">
            <div
              v-for="bit in Object.values(drillBits)"
              :key="bit.id"
              class="bit-card"
              :class="{ active: stats.activeDrillBit === bit.id }"
            >
              <div class="bit-header">
                <span class="bit-name">{{ bit.name }}</span>
                <span class="bit-lvl">Lv.{{ bit.level }}</span>
              </div>
              <div class="bit-details">
                <span>鑽速: {{ (bit.drillingSpeedKmSec * 60).toFixed(1) }} km/分</span>
                <span>耐溫極限: {{ bit.heatResistanceK }} K</span>
              </div>
              <div class="bit-actions">
                <button
                  class="action-sub-btn switch-btn"
                  :disabled="stats.activeDrillBit === bit.id"
                  @click="switchBit(bit.id)"
                >
                  {{ stats.activeDrillBit === bit.id ? '裝備中' : '裝備' }}
                </button>
                <button
                  class="action-sub-btn upgrade-btn"
                  @click="upgradeBit(bit.id)"
                >
                  升級
                </button>
              </div>
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
import { planetaryCoreEngine, DrillBitType } from '@/engine/planetaryCoreEngine'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => planetaryCoreEngine.stats)
const strata = computed(() => planetaryCoreEngine.strata)
const drillBits = computed(() => planetaryCoreEngine.drillBits)

const currentStratumName = computed(() => {
  return strata.value[stats.value.targetStratum]?.name ?? '未知地層'
})

const activeBitName = computed(() => {
  return drillBits.value[stats.value.activeDrillBit]?.name ?? ''
})

function switchBit(id: DrillBitType): void {
  planetaryCoreEngine.switchDrillBit(id)
}

function upgradeBit(id: DrillBitType): void {
  planetaryCoreEngine.upgradeDrillBit(id)
}

function ventStress(): void {
  planetaryCoreEngine.ventTectonicStress()
}

// ── Planetary Strata Cross-section Canvas ───────────────────────────────────
function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  animTime += 0.02
  const w = canvas.width
  const h = canvas.height

  // Background
  ctx.fillStyle = '#0a0d18'
  ctx.fillRect(0, 0, w, h)

  // Planetary strata horizontal slices
  const layers = [
    { name: '地殼岩石圈 (0-35km)', color: '#475569', y: 0, height: 40 },
    { name: '上部地函 (35-670km)', color: '#b45309', y: 40, height: 60 },
    { name: '下部地函 (670-2890km)', color: '#dc2626', y: 100, height: 75 },
    { name: '外地核鐵鎳液態熔岩 (2890-5150km)', color: '#fbbf24', y: 175, height: 65 },
  ]

  layers.forEach(l => {
    ctx.fillStyle = l.color
    ctx.fillRect(0, l.y, w, l.height)

    // Stratum boundary line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, l.y)
    ctx.lineTo(w, l.y)
    ctx.stroke()

    // Label
    ctx.font = '10px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(l.name, 12, l.y + 16)
  })

  // Convective loops in outer core (bottom)
  const coreY = 175
  for (let c = 0; c < 5; c++) {
    const cx = 100 + c * 140
    const cy = coreY + 32
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)'
    ctx.lineWidth = 1.5
    ctx.arc(cx, cy, 18, animTime * 1.5, animTime * 1.5 + Math.PI * 1.5)
    ctx.stroke()
  }

  // Drill borehole shaft descending from top to current depth
  const drillProgress = Math.min(1.0, stats.value.currentDepthKm / 5150)
  const drillShaftX = w / 2
  const drillTipY = drillProgress * h

  // Shaft pipe
  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(drillShaftX, 0)
  ctx.lineTo(drillShaftX, drillTipY)
  ctx.stroke()

  // Rotating drill tip
  const tipRadius = 6 + Math.sin(animTime * 10) * 1.5
  ctx.beginPath()
  ctx.fillStyle = '#fde047'
  ctx.arc(drillShaftX, drillTipY, tipRadius, 0, Math.PI * 2)
  ctx.fill()

  // Magma spray sparks at drill tip
  for (let s = 0; s < 6; s++) {
    const angle = Math.random() * Math.PI * 2
    const dist = 8 + Math.random() * 12
    const sx = drillShaftX + Math.cos(angle) * dist
    const sy = drillTipY + Math.sin(angle) * dist
    ctx.fillStyle = '#f97316'
    ctx.fillRect(sx, sy, 2, 2)
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
.planetary-core-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.planetary-core-modal {
  width: 820px; max-height: 90vh; background: #0c0f1d; border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(239, 68, 68, 0.2); display: flex; flex-direction: column;
  color: #fecaca; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #f87171; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 16px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #f87171; }
.stat-card .temp { color: #fbbf24; }
.stat-card .shield { color: #38bdf8; }
.stat-card .stress { color: #fb923c; }
.stat-card .danger { color: #ef4444; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(239, 68, 68, 0.3);
  background: #0a0d18;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #f87171;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.venting-box {
  background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  transition: all 0.3s;
}
.venting-box.alert {
  border-color: #ef4444; background: rgba(69, 10, 10, 0.6);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}
.vent-info { flex: 1; }
.vent-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #fca5a5; }
.vent-info p { margin: 4px 0 8px 0; font-size: 11px; color: #94a3b8; }
.stress-bar-wrap {
  width: 100%; height: 10px; background: rgba(15, 23, 42, 0.9); border-radius: 5px;
  overflow: hidden; border: 1px solid rgba(239, 68, 68, 0.3);
}
.stress-bar { height: 100%; background: linear-gradient(90deg, #f97316, #ef4444); transition: width 0.3s; }
.stress-bar.high { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
.vent-btn {
  background: #dc2626; color: #ffffff; border: none; border-radius: 8px; padding: 10px 18px;
  font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s;
}
.vent-btn:hover:not(:disabled) { background: #ef4444; box-shadow: 0 0 14px rgba(239, 68, 68, 0.5); }
.vent-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.drill-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #fca5a5; }
.drill-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.bit-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;
}
.bit-card.active { border-color: #f87171; box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
.bit-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #f1f5f9; }
.bit-lvl { color: #f87171; font-family: monospace; }
.bit-details { display: flex; flex-direction: column; gap: 2px; font-size: 10px; color: #94a3b8; }
.bit-actions { display: flex; gap: 4px; margin-top: 4px; }
.action-sub-btn {
  flex: 1; border: none; border-radius: 4px; padding: 4px 6px; font-size: 10px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.switch-btn { background: #0284c7; color: #ffffff; }
.switch-btn:hover:not(:disabled) { background: #0ea5e9; }
.switch-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
.upgrade-btn { background: #d97706; color: #ffffff; }
.upgrade-btn:hover { background: #f59e0b; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #f87171; font-family: monospace;
}
</style>
