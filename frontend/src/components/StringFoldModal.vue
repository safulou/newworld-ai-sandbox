<template>
  <div class="string-fold-overlay" @click.self="ui.closeOverlay()">
    <div class="string-fold-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🎻</span>
          <div>
            <h2>超弦維度空間折疊傳輸矩陣</h2>
            <div class="subtitle">11D Superstring & Calabi-Yau Spatial Fold Transport</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">空間折疊壓縮比</span>
            <span class="val highlight">1 : {{ stats.currentFoldRatio.toLocaleString() }}</span>
            <span class="sub">卡拉比-丘六維幾何流形</span>
          </div>
          <div class="stat-card">
            <span class="label">弦膜剪切張力 (Tension)</span>
            <span class="val" :class="stats.stringTensionPercent > 70 ? 'danger' : 'tension'">
              {{ stats.stringTensionPercent.toFixed(1) }}%
            </span>
            <span class="sub">超弦晶格平穩度 {{ stats.calabiYauStabilityPercent.toFixed(0) }}%</span>
          </div>
          <div class="stat-card">
            <span class="label">已折疊傳輸資產</span>
            <span class="val matter">📦 {{ stats.totalMatterFoldedTons.toFixed(0) }} 噸</span>
            <span class="sub">零延遲瞬間物資折躍</span>
          </div>
          <div class="stat-card">
            <span class="label">當前超弦共振和弦</span>
            <span class="val harmonic">{{ activeHarmonicName }}</span>
            <span class="sub">模式頻率 {{ activeHarmonicFreq }} PHz</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Calabi-Yau 6D Manifold Projection -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            幾何流形：11D M-Theory [卡拉比-丘對偶流動中]
          </div>
        </div>

        <!-- Spatial Fold Action Control Bar -->
        <div class="fold-action-box" :class="{ alert: stats.stringTensionPercent > 80 }">
          <div class="fold-info">
            <span class="fold-title">🌀 跨星區瞬間物質對折傳輸 (Instant Fold Transit)</span>
            <p>利用超弦微觀維度緊緻化管道，瞬間將 50 噸物資折疊穿越數百萬光年歐幾里得空間。</p>
          </div>
          <div class="fold-btns">
            <button
              class="fold-btn"
              :disabled="stats.stringTensionPercent >= 85"
              @click="triggerInstantTransit"
            >
              🚀 瞬間空間對折 (50噸)
            </button>
            <button
              class="discharge-btn"
              :disabled="stats.stringTensionPercent <= 0"
              @click="dischargeTension"
            >
              ⚡ 釋放膜張力
            </button>
          </div>
        </div>

        <!-- 4 String Harmonics Grid -->
        <div class="harmonics-section">
          <h3>🎼 超弦共振和弦矩陣 (String Harmonics)</h3>
          <div class="harmonics-grid">
            <div
              v-for="h in Object.values(harmonics)"
              :key="h.id"
              class="harmonic-card"
              :class="{ active: stats.activeHarmonic === h.id, locked: !h.unlocked }"
            >
              <div class="harmonic-header">
                <span class="h-name">{{ h.name }}</span>
                <span class="h-lvl">Lv.{{ h.level }}</span>
              </div>
              <p class="h-desc">{{ h.description }}</p>
              <div class="h-details">
                <span>震盪頻率: {{ h.frequencyPHz }} PHz</span>
                <span>基礎壓縮比: 1:{{ h.compressionFactor.toLocaleString() }}</span>
              </div>
              <div class="h-actions">
                <button
                  class="h-btn switch-btn"
                  :disabled="!h.unlocked || stats.activeHarmonic === h.id"
                  @click="switchHarmonic(h.id)"
                >
                  {{ stats.activeHarmonic === h.id ? '當前共振中' : '調諧和弦' }}
                </button>
                <button
                  class="h-btn upgrade-btn"
                  :disabled="!h.unlocked || h.level >= 5"
                  @click="upgradeHarmonic(h.id)"
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
import { stringFoldMatrixEngine, StringHarmonicId } from '@/engine/stringFoldMatrix'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => stringFoldMatrixEngine.stats)
const harmonics = computed(() => stringFoldMatrixEngine.harmonics)

const activeHarmonicName = computed(() => {
  return harmonics.value[stats.value.activeHarmonic]?.name ?? ''
})

const activeHarmonicFreq = computed(() => {
  return harmonics.value[stats.value.activeHarmonic]?.frequencyPHz ?? 0
})

function triggerInstantTransit(): void {
  stringFoldMatrixEngine.triggerInstantTransit(50)
}

function dischargeTension(): void {
  stringFoldMatrixEngine.dischargeTension()
}

function switchHarmonic(id: StringHarmonicId): void {
  stringFoldMatrixEngine.switchHarmonic(id)
}

function upgradeHarmonic(id: StringHarmonicId): void {
  stringFoldMatrixEngine.upgradeHarmonic(id)
}

// ── Calabi-Yau 6D Manifold 2D Cross-section Projection Canvas ───────────────
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
  ctx.fillStyle = '#060714'
  ctx.fillRect(0, 0, w, h)

  // Rotating Calabi-Yau wireframe curves
  const curves = 8
  const tension = stats.value.stringTensionPercent / 100

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(animTime * 0.3)

  for (let c = 0; c < curves; c++) {
    const angleOffset = (c * Math.PI * 2) / curves
    ctx.beginPath()

    const hue = (c * 45 + animTime * 30) % 360
    ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${0.35 + tension * 0.4})`
    ctx.lineWidth = 1.2

    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      // Parametric Calabi-Yau cross-section approximation
      const r = (55 + Math.sin(t * 3 + animTime * 2 + angleOffset) * 28) * (1 - tension * 0.2)
      const x = Math.cos(t) * r
      const y = Math.sin(t * 2) * (r * 0.7)

      if (t === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  // Central Superstring Fold Singularity
  const corePulse = Math.sin(animTime * 4) * 3
  ctx.beginPath()
  ctx.fillStyle = '#ffffff'
  ctx.arc(0, 0, 3 + corePulse, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

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
.string-fold-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.string-fold-modal {
  width: 820px; max-height: 90vh; background: #0c0e1a; border: 1px solid rgba(192, 132, 252, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(192, 132, 252, 0.25); display: flex; flex-direction: column;
  color: #f5f3ff; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(192, 132, 252, 0.2);
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
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(192, 132, 252, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 15px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #c084fc; }
.stat-card .tension { color: #38bdf8; }
.stat-card .danger { color: #f43f5e; }
.stat-card .matter { color: #fbbf24; }
.stat-card .harmonic { color: #34d399; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(192, 132, 252, 0.3);
  background: #060714;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #c084fc;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.fold-action-box {
  background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(192, 132, 252, 0.25);
  border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  transition: all 0.3s;
}
.fold-action-box.alert {
  border-color: #f43f5e; background: rgba(76, 5, 25, 0.6);
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.3);
}
.fold-title { font-size: 13px; font-weight: 700; color: #e9d5ff; }
.fold-info p { margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; }
.fold-btns { display: flex; gap: 8px; }
.fold-btn {
  background: #7c3aed; color: #ffffff; border: none; border-radius: 6px; padding: 8px 14px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.fold-btn:hover:not(:disabled) { background: #8b5cf6; box-shadow: 0 0 12px rgba(192, 132, 252, 0.4); }
.fold-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
.discharge-btn {
  background: #0284c7; color: #ffffff; border: none; border-radius: 6px; padding: 8px 12px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.discharge-btn:hover:not(:disabled) { background: #0ea5e9; }
.discharge-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.harmonics-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #e9d5ff; }
.harmonics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.harmonic-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(192, 132, 252, 0.2);
  border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;
}
.harmonic-card.active { border-color: #c084fc; box-shadow: 0 0 10px rgba(192, 132, 252, 0.3); }
.harmonic-card.locked { opacity: 0.5; }
.harmonic-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #f1f5f9; }
.h-lvl { color: #c084fc; font-family: monospace; }
.h-desc { margin: 0; font-size: 10px; color: #94a3b8; min-height: 24px; }
.h-details { display: flex; flex-direction: column; gap: 2px; font-size: 10px; color: #64748b; }
.h-actions { display: flex; gap: 6px; margin-top: 4px; }
.h-btn {
  border: none; border-radius: 4px; padding: 4px 8px; font-size: 10px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.switch-btn { flex: 2; background: #2563eb; color: #ffffff; }
.switch-btn:hover:not(:disabled) { background: #3b82f6; }
.switch-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
.upgrade-btn { flex: 1; background: #059669; color: #ffffff; }
.upgrade-btn:hover:not(:disabled) { background: #10b981; }
.upgrade-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(192, 132, 252, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #c084fc; font-family: monospace;
}
</style>
