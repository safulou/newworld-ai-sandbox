<template>
  <div class="chrono-overlay" @click.self="ui.closeOverlay()">
    <div class="chrono-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">⏳</span>
          <div>
            <h2>時間因果律校準儀與微型時空閉環</h2>
            <div class="subtitle">Chrono-Paradox Stabilizer & Closed Timelike Curve Engine</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">因果反衝度 (Paradox Flux)</span>
            <span class="val" :class="stats.paradoxFluxPercent > 60 ? 'danger' : 'flux'">
              {{ stats.paradoxFluxPercent.toFixed(1) }}%
            </span>
            <span class="sub">狀態：{{ stabilityLabel }}</span>
          </div>
          <div class="stat-card">
            <span class="label">超光速粒子儲量</span>
            <span class="val tachyon">⚡ {{ stats.tachyonParticles.toFixed(0) }}</span>
            <span class="sub">凝結器 Lv.{{ modules.condenser.level }} 自動產出</span>
          </div>
          <div class="stat-card">
            <span class="label">時間能源發電功率</span>
            <span class="val energy">{{ stats.temporalEnergyTW.toFixed(2) }} TW</span>
            <span class="sub">逆因果共振發電</span>
          </div>
          <div class="stat-card">
            <span class="label">因果債務平息次數</span>
            <span class="val success">🏆 {{ stats.debtsResolvedCount }} 次</span>
            <span class="sub">已結算類時閉環</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Curved Spacetime Metric Grid & Chrono Dial -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            時空曲率：{{ stats.timelineStability }} [反衝波：{{ (stats.paradoxFluxPercent * 0.8).toFixed(1) }} Hz]
          </div>
        </div>

        <!-- Temporal Borrowing & Active Debts Row -->
        <div class="borrow-section">
          <div class="borrow-header">
            <h4>⚡ 類時閉環預借系統 (Temporal Borrowing)</h4>
            <div class="borrow-btns">
              <button
                class="borrow-btn"
                :disabled="stats.paradoxFluxPercent >= 85"
                @click="borrowResource('research')"
              >
                🔬 預借 +5,000 科研
              </button>
              <button
                class="borrow-btn"
                :disabled="stats.paradoxFluxPercent >= 85"
                @click="borrowResource('energy')"
              >
                🔋 預借 +50,000 MW 能源
              </button>
              <button
                class="borrow-btn"
                :disabled="stats.paradoxFluxPercent >= 85"
                @click="borrowResource('tachyon')"
              >
                ⚛️ 預借 +100 超光速粒子
              </button>
            </div>
          </div>

          <!-- Active Debts Queue -->
          <div v-if="activeDebts.length > 0" class="debts-queue">
            <div
              v-for="debt in activeDebts"
              :key="debt.id"
              class="debt-item"
            >
              <div class="debt-info">
                <span class="debt-title">因果預借【{{ debt.type.toUpperCase() }}】</span>
                <span class="debt-timer">剩餘時限: {{ Math.max(0, debt.remainingSeconds).toFixed(1) }}s</span>
              </div>
              <div class="debt-progress-wrap">
                <div
                  class="debt-progress"
                  :style="{ width: `${Math.max(0, (debt.remainingSeconds / debt.initialDurationSec) * 100)}%` }"
                ></div>
              </div>
              <button class="repay-btn" @click="repayDebt(debt.id)">
                平息因果
              </button>
            </div>
          </div>
          <div v-else class="no-debts">
            目前無未結算的因果債務，時空閉環保持平穩。
          </div>
        </div>

        <!-- Chrono Stabilization & Module Upgrades Section -->
        <div class="stabilizer-controls">
          <div class="stabilizer-action-box">
            <div class="action-info">
              <span class="title">🌌 超光速粒子對衝注入 (Tachyon Damping)</span>
              <p>注入 25 單位超光速粒子以平息時空張力，使因果反衝度直接降低 20%。</p>
            </div>
            <button
              class="inject-btn"
              :disabled="stats.tachyonParticles < 25 || stats.paradoxFluxPercent <= 0"
              @click="injectTachyons"
            >
              注入粒子 (-20% 反衝)
            </button>
          </div>

          <!-- Modules Grid -->
          <div class="modules-grid">
            <div
              v-for="mod in Object.values(modules)"
              :key="mod.id"
              class="module-card"
            >
              <div class="mod-header">
                <span class="mod-name">{{ mod.name }}</span>
                <span class="mod-lvl">Lv.{{ mod.level }}</span>
              </div>
              <p class="mod-desc">{{ mod.bonusDesc }}</p>
              <div class="mod-cost">升級需: {{ mod.costTachyons * mod.level }} Tachyons</div>
              <button
                class="upgrade-mod-btn"
                :disabled="mod.level >= mod.maxLevel || stats.tachyonParticles < mod.costTachyons * mod.level"
                @click="upgradeModule(mod.id)"
              >
                {{ mod.level >= mod.maxLevel ? '已達滿級' : '升級模組' }}
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
import { chronoStabilizer, TemporalLoanType, ChronoModuleId } from '@/engine/chronoStabilizer'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => chronoStabilizer.stats)
const modules = computed(() => chronoStabilizer.modules)
const activeDebts = computed(() => chronoStabilizer.activeDebts)

const stabilityLabel = computed(() => {
  switch (stats.value.timelineStability) {
    case 'Stable': return '穩定基底 (Stable)'
    case 'Distorted': return '局部扭曲 (Distorted)'
    case 'Severe Paradox': return '劇烈悖論 (Severe Paradox)'
    case 'Collapse Imminent': return '臨界崩解 (Collapse Imminent)'
    default: return ''
  }
})

function borrowResource(type: TemporalLoanType): void {
  chronoStabilizer.borrowFutureResource(type)
}

function repayDebt(id: string): void {
  chronoStabilizer.repayDebt(id)
}

function injectTachyons(): void {
  chronoStabilizer.injectTachyons()
}

function upgradeModule(id: ChronoModuleId): void {
  chronoStabilizer.upgradeModule(id)
}

// ── Spacetime Metric Grid & Chrono Dial Canvas ──────────────────────────────
function renderCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  animTime += 0.025
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2

  // Background
  ctx.fillStyle = '#080a14'
  ctx.fillRect(0, 0, w, h)

  // Curved Spacetime Metric Grid
  const flux = stats.value.paradoxFluxPercent / 100
  const cols = 24
  const rows = 10
  const stepX = w / cols
  const stepY = h / rows

  ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 + flux * 0.25})`
  ctx.lineWidth = 1

  for (let i = 0; i <= cols; i++) {
    ctx.beginPath()
    for (let j = 0; j <= rows; j++) {
      const origX = i * stepX
      const origY = j * stepY

      // Distance from center well
      const dx = origX - cx
      const dy = origY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const warp = Math.sin(dist * 0.03 - animTime * 2) * (15 * flux)

      const px = origX + (dx / (dist + 1)) * warp
      const py = origY + (dy / (dist + 1)) * warp

      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // Central Chrono Dial
  const dialRadius = 45
  ctx.beginPath()
  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 2
  ctx.arc(cx, cy, dialRadius, 0, Math.PI * 2)
  ctx.stroke()

  // Rotating Clock Hands (Counter-clockwise backwards in time)
  const angleHour = -animTime * 1.5
  const angleMin = -animTime * 4.0

  ctx.beginPath()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 3
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(angleHour) * 24, cy + Math.sin(angleHour) * 24)
  ctx.stroke()

  ctx.beginPath()
  ctx.strokeStyle = '#f43f5e'
  ctx.lineWidth = 2
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(angleMin) * 36, cy + Math.sin(angleMin) * 36)
  ctx.stroke()

  // Center Tachyon Core
  ctx.beginPath()
  ctx.fillStyle = '#ffffff'
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fill()

  // Paradox Oscillograph along bottom
  ctx.beginPath()
  ctx.strokeStyle = flux > 0.6 ? '#f43f5e' : '#34d399'
  ctx.lineWidth = 1.5
  for (let x = 0; x < w; x += 4) {
    const y = h - 20 + Math.sin(x * 0.05 + animTime * 5) * (8 * flux + 2)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

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
.chrono-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.chrono-modal {
  width: 820px; max-height: 90vh; background: #0c0f1d; border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(168, 85, 247, 0.25); display: flex; flex-direction: column;
  color: #f3e8ff; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #c084fc; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 16px; font-weight: 700; font-family: monospace; }
.stat-card .flux { color: #c084fc; }
.stat-card .danger { color: #f43f5e; }
.stat-card .tachyon { color: #38bdf8; }
.stat-card .energy { color: #fbbf24; }
.stat-card .success { color: #34d399; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(168, 85, 247, 0.3);
  background: #080a14;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #c084fc;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.borrow-section {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;
}
.borrow-header { display: flex; justify-content: space-between; align-items: center; }
.borrow-header h4 { margin: 0; font-size: 13px; color: #c084fc; }
.borrow-btns { display: flex; gap: 8px; }
.borrow-btn {
  background: #1e293b; color: #e2e8f0; border: 1px solid #334155; border-radius: 6px;
  padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.borrow-btn:hover:not(:disabled) { background: #334155; border-color: #c084fc; }
.borrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.debts-queue { display: flex; flex-direction: column; gap: 6px; }
.debt-item {
  display: flex; align-items: center; gap: 12px; background: rgba(30, 27, 75, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; padding: 6px 10px;
}
.debt-info { display: flex; flex-direction: column; min-width: 140px; }
.debt-title { font-size: 11px; font-weight: 700; color: #f1f5f9; }
.debt-timer { font-size: 10px; color: #f43f5e; font-family: monospace; }
.debt-progress-wrap {
  flex: 1; height: 8px; background: rgba(15, 23, 42, 0.8); border-radius: 4px; overflow: hidden;
}
.debt-progress { height: 100%; background: linear-gradient(90deg, #f43f5e, #fbbf24); transition: width 0.1s; }
.repay-btn {
  background: #059669; color: #ffffff; border: none; border-radius: 4px; padding: 4px 10px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.repay-btn:hover { background: #10b981; }

.no-debts { font-size: 11px; color: #64748b; font-style: italic; }

.stabilizer-controls { display: flex; flex-direction: column; gap: 12px; }
.stabilizer-action-box {
  background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;
}
.action-info .title { font-size: 12px; font-weight: 700; color: #c084fc; }
.action-info p { margin: 2px 0 0 0; font-size: 11px; color: #94a3b8; }
.inject-btn {
  background: #7c3aed; color: #ffffff; border: none; border-radius: 6px; padding: 8px 14px;
  font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.inject-btn:hover:not(:disabled) { background: #8b5cf6; box-shadow: 0 0 12px rgba(168, 85, 247, 0.5); }
.inject-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.modules-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.module-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;
}
.mod-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #f1f5f9; }
.mod-lvl { color: #c084fc; font-family: monospace; }
.mod-desc { margin: 0; font-size: 10px; color: #94a3b8; min-height: 28px; }
.mod-cost { font-size: 10px; color: #fbbf24; font-family: monospace; }
.upgrade-mod-btn {
  background: #2563eb; color: #ffffff; border: none; border-radius: 4px; padding: 5px 8px;
  font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.upgrade-mod-btn:hover:not(:disabled) { background: #3b82f6; }
.upgrade-mod-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(168, 85, 247, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #c084fc; font-family: monospace;
}
</style>
