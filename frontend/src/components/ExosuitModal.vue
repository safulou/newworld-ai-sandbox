<template>
  <div class="overlay" @click.self="close">
    <div class="exosuit-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🦾</span>
          <h2>利維坦生物機械外骨骼裝配鍛造 (Leviathan Bio-Mechanical Exosuit)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Controls & Stance Bar -->
      <div class="stance-bar">
        <button
          class="btn-toggle-equip"
          :class="{ active: exosuit.stats.isActive }"
          @click="exosuit.toggleEquip()"
        >
          {{ exosuit.stats.isActive ? '✅ 外骨骼裝配中 (Equipped)' : '⚪ 卸載離線 (Unequipped)' }}
        </button>

        <div class="mode-toggles">
          <button
            class="mode-btn"
            :class="{ active: exosuit.stats.mode === 'grounded' }"
            :disabled="!exosuit.stats.isActive"
            @click="exosuit.setMode('grounded')"
          >
            🚶 地面機動
          </button>
          <button
            class="mode-btn"
            :class="{ active: exosuit.stats.mode === 'hover_flight' }"
            :disabled="!exosuit.stats.isActive"
            @click="exosuit.setMode('hover_flight')"
          >
            🛸 高空懸浮
          </button>
          <button
            class="mode-btn"
            :class="{ active: exosuit.stats.mode === 'supercavitation' }"
            :disabled="!exosuit.stats.isActive"
            @click="exosuit.setMode('supercavitation')"
          >
            🌊 水下超空泡
          </button>
        </div>

        <div class="combat-actions">
          <button
            class="act-btn overdrive-btn"
            :disabled="!exosuit.stats.isActive || exosuit.stats.energy < 30 || exosuit.stats.isOverdriving"
            @click="exosuit.activateOverdrive()"
          >
            ⚡ 超載推進 {{ exosuit.stats.isOverdriving ? `(${exosuit.stats.overdriveTimer.toFixed(1)}s)` : '' }}
          </button>
          <button
            class="act-btn rail-btn"
            :disabled="!exosuit.stats.isActive || exosuit.stats.railgunCooldown > 0"
            @click="exosuit.fireRailgun()"
          >
            💥 軌道砲開火 {{ exosuit.stats.railgunCooldown > 0 ? `(${exosuit.stats.railgunCooldown.toFixed(1)}s)` : '' }}
          </button>
        </div>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Col 1: 4 Modular Exosuit Components -->
        <div class="col-modules card-box">
          <div class="subhead">
            <span>🛠️ 模組化生化外骨骼部位</span>
            <span class="tag-badge">奈米自癒裝甲</span>
          </div>

          <div class="modules-grid">
            <div
              v-for="mod in exosuit.modules"
              :key="mod.id"
              class="module-card"
              :style="{ borderColor: mod.color }"
            >
              <div class="mod-head">
                <span class="mod-name" :style="{ color: mod.color }">{{ mod.name }}</span>
                <span class="mod-tier">Tier {{ mod.tier }}/{{ mod.maxTier }}</span>
              </div>
              <div class="mod-desc">{{ mod.description }}</div>

              <div class="mod-specs">
                <span>外骨骼護盾: +{{ mod.bonusHP }} HP</span>
                <span>航速倍率: {{ mod.speedMultiplier }}x</span>
                <span>電容儲備: {{ mod.energyCapacity }}%</span>
              </div>

              <div class="mod-action">
                <button
                  class="btn-forge"
                  :disabled="mod.tier >= mod.maxTier || exosuit.materials.superconductorPlates < mod.tier * 2 || exosuit.materials.stardustOre < mod.tier * 15"
                  @click="exosuit.forgeModule(mod.id)"
                >
                  {{ mod.tier >= mod.maxTier ? '已達最高階級' : `鍛造升階 (需超導板x${mod.tier * 2}、星塵x${mod.tier * 15})` }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2: Telemetry, Materials & 3D Wireframe Preview -->
        <div class="col-preview card-box">
          <div class="subhead">
            <span>🎒 鍛造材料與遙測數值</span>
          </div>

          <!-- Materials Display -->
          <div class="materials-grid">
            <div class="mat-card">
              <span class="m-lbl">🐉 利維坦生化核心</span>
              <span class="m-val">{{ exosuit.materials.bioCores }} 枚</span>
            </div>
            <div class="mat-card">
              <span class="m-lbl">🛡️ 深淵超導金屬板</span>
              <span class="m-val">{{ exosuit.materials.superconductorPlates }} 片</span>
            </div>
            <div class="mat-card">
              <span class="m-lbl">✨ 宇宙墜落星塵</span>
              <span class="m-val">{{ exosuit.materials.stardustOre }} 顆</span>
            </div>
            <div class="mat-card">
              <span class="m-lbl">💰 信用點存量</span>
              <span class="m-val">{{ exosuit.materials.credits.toLocaleString() }} 點</span>
            </div>
          </div>

          <!-- Telemetry Bars -->
          <div class="telemetry-bars">
            <div class="t-bar-item">
              <div class="t-lbl"><span>⚡ 核心電容儲量</span><strong>{{ Math.round(exosuit.stats.energy) }}%</strong></div>
              <div class="bar-track"><div class="bar-fill energy-fill" :style="{ width: exosuit.stats.energy + '%' }"></div></div>
            </div>
            <div class="t-bar-item">
              <div class="t-lbl"><span>🛡️ 外骨骼生化護盾</span><strong>{{ Math.round(exosuit.stats.shieldHP) }} / {{ exosuit.stats.maxShieldHP }} HP</strong></div>
              <div class="bar-track"><div class="bar-fill shield-fill" :style="{ width: (exosuit.stats.shieldHP / exosuit.stats.maxShieldHP * 100) + '%' }"></div></div>
            </div>
          </div>

          <!-- Wireframe Canvas -->
          <div class="canvas-wrap">
            <canvas ref="wireframeCanvas" width="380" height="130" class="wf-cvs"></canvas>
          </div>

          <!-- Logs -->
          <div class="subhead" style="margin-top: 10px; margin-bottom: 4px;">
            <span>📜 機甲神經回饋日誌</span>
          </div>
          <div class="suit-logs">
            <div v-for="(log, idx) in exosuit.logs" :key="idx" class="s-line">
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
import { mechExosuit } from '@/engine/mechExosuit'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const exosuit = mechExosuit
const wireframeCanvas = ref<HTMLCanvasElement | null>(null)
let animId: number = 0

function close(): void {
  ui.closeOverlay()
}

// ── Wireframe Canvas Visualizer ─────────────────────────────────────────────
function drawWireframe(): void {
  const canvas = wireframeCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.fillRect(0, 0, width, height)

  const time = Date.now() * 0.002

  // Rotating 3D Hexagon Holographic Core
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(time * 0.5)

  ctx.strokeStyle = exosuit.stats.isActive ? '#00ffff' : '#556677'
  ctx.lineWidth = 1.5

  for (let r = 20; r <= 50; r += 15) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  // Cross hair lines
  ctx.beginPath()
  ctx.moveTo(-70, 0)
  ctx.lineTo(70, 0)
  ctx.moveTo(0, -50)
  ctx.lineTo(0, 50)
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
  ctx.stroke()

  ctx.restore()

  animId = requestAnimationFrame(drawWireframe)
}

onMounted(() => {
  drawWireframe()
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

.exosuit-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(8, 14, 32, 0.96), rgba(18, 26, 52, 0.96));
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
  padding: 12px 20px;
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

/* Stance Bar */
.stance-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 10px;
}

.btn-toggle-equip {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ccc;
  cursor: pointer;
}
.btn-toggle-equip.active {
  background: rgba(0, 255, 255, 0.25);
  border-color: #00ffff;
  color: #00ffff;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
}

.mode-toggles {
  display: flex;
  gap: 6px;
}

.mode-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #a0c0e0;
  cursor: pointer;
}
.mode-btn.active {
  background: rgba(0, 255, 200, 0.2);
  border-color: #00ffcc;
  color: #00ffcc;
}
.mode-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.combat-actions {
  display: flex;
  gap: 8px;
}

.act-btn {
  padding: 6px 14px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
}
.overdrive-btn { background: linear-gradient(90deg, #ff8800, #ffaa00); color: #000; border: none; }
.rail-btn { background: linear-gradient(90deg, #ff0055, #ff00aa); color: #fff; border: none; }
.act-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Content Body */
.content-body {
  display: grid;
  grid-template-columns: 1fr 380px;
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
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.module-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mod-head {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.mod-name { font-size: 0.9rem; }
.mod-tier { font-size: 0.75rem; color: #88aacc; }

.mod-desc {
  font-size: 0.75rem;
  color: #a0c0e0;
  margin: 6px 0;
  line-height: 1.3;
}

.mod-specs {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.75rem;
  color: #77aacc;
  margin-bottom: 8px;
}

.btn-forge {
  width: 100%;
  padding: 8px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #00ffff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}
.btn-forge:disabled {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: not-allowed;
}

/* Col Preview */
.materials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.mat-card {
  background: rgba(255, 255, 255, 0.04);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.m-lbl { font-size: 0.65rem; color: #88aacc; }
.m-val { font-size: 0.95rem; font-weight: bold; color: #fff; }

.telemetry-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.t-bar-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.t-lbl {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.bar-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill { height: 100%; }
.energy-fill { background: linear-gradient(90deg, #ffaa00, #00ffff); }
.shield-fill { background: linear-gradient(90deg, #ff0055, #00ffaa); }

.canvas-wrap {
  height: 130px;
  background: #000;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  overflow: hidden;
}
.wf-cvs { width: 100%; height: 100%; display: block; }

.suit-logs {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #88ccee;
  overflow-y: auto;
  flex: 1;
}

.s-line { margin: 3px 0; }
</style>
