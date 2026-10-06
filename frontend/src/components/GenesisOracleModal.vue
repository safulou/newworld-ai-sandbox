<template>
  <div class="oracle-overlay" @click.self="ui.closeOverlay()">
    <div class="oracle-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">📜</span>
          <div>
            <h2>量子宏觀創世神諭樹與宇宙常數微調</h2>
            <div class="subtitle">Quantum Macro-Genesis Oracle & Fine-Structure Tuning</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Body -->
      <div class="modal-body">
        <!-- Top Stats Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">創世神能儲備 (Genesis Energy)</span>
            <span class="val highlight">⚡ {{ stats.genesisEnergy.toFixed(1) }}</span>
            <span class="sub">聖壇自動湧現中</span>
          </div>
          <div class="stat-card">
            <span class="label">全宇宙產能倍率</span>
            <span class="val power">x{{ stats.energyMultiplier.toFixed(2) }}</span>
            <span class="sub">電網與物質鍛爐加成</span>
          </div>
          <div class="stat-card">
            <span class="label">光速與科研倍率</span>
            <span class="val research">x{{ stats.researchMultiplier.toFixed(2) }}</span>
            <span class="sub">護盾倍率 x{{ stats.shieldMultiplier.toFixed(2) }}</span>
          </div>
          <div class="stat-card">
            <span class="label">宇宙法則穩定度</span>
            <span class="val" :class="stats.stabilityIndexPercent < 60 ? 'danger' : 'stability'">
              {{ stats.stabilityIndexPercent }}%
            </span>
            <span class="sub">{{ stats.totalDecreesActive }} 項神諭法令生效</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Quantum Probability & Sacred Geometry -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            微觀場域：α={{ (stats.constants.alpha * 1000).toFixed(2) }}‰ | G={{ (stats.constants.gravitationalG * 1e11).toFixed(2) }} | Λ={{ (stats.constants.lambdaDarkEnergy * 1e52).toFixed(2) }}
          </div>
        </div>

        <!-- Fundamental Constants Tuning Sliders -->
        <div class="tuning-section">
          <div class="tuning-header">
            <h3>⚙️ 宇宙基礎物理常數微調 (Fundamental Constants)</h3>
            <button class="reset-btn" @click="resetDefaults">
              🔄 重置為標準模型
            </button>
          </div>
          <div class="sliders-grid">
            <div class="slider-card">
              <div class="slider-label">
                <span>精細結構常數 (α) - 電磁相互作用</span>
                <span class="slider-num">{{ stats.constants.alpha.toFixed(6) }}</span>
              </div>
              <input
                type="range"
                min="0.005000"
                max="0.009500"
                step="0.000100"
                :value="stats.constants.alpha"
                class="const-slider alpha"
                @input="onAlphaChange"
              />
            </div>
            <div class="slider-card">
              <div class="slider-label">
                <span>萬有引力常數 (G) - 時空幾何曲率</span>
                <span class="slider-num">{{ (stats.constants.gravitationalG * 1e11).toFixed(2) }} × 10⁻¹¹</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                :value="stats.constants.gravitationalG * 1e11"
                class="const-slider grav"
                @input="onGravChange"
              />
            </div>
            <div class="slider-card">
              <div class="slider-label">
                <span>宇宙學常數 (Λ) - 暗能量真空膨脹</span>
                <span class="slider-num">{{ (stats.constants.lambdaDarkEnergy * 1e52).toFixed(2) }} × 10⁻⁵²</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                :value="stats.constants.lambdaDarkEnergy * 1e52"
                class="const-slider lambda"
                @input="onLambdaChange"
              />
            </div>
          </div>
        </div>

        <!-- Sacred Creation Decrees Grid -->
        <div class="decrees-section">
          <h3>👑 創世神諭法令 (Sacred Decrees)</h3>
          <div class="decrees-grid">
            <div
              v-for="dec in Object.values(decrees)"
              :key="dec.id"
              class="decree-card"
              :class="{ active: dec.active }"
            >
              <div class="decree-header">
                <span class="dec-icon">{{ dec.icon }}</span>
                <span class="dec-name">{{ dec.name }}</span>
              </div>
              <p class="dec-desc">{{ dec.effectDesc }}</p>
              <div class="dec-cost">神能消耗: {{ dec.costGenesisEnergy }} 點</div>
              <button
                class="decree-toggle-btn"
                :class="{ active: dec.active }"
                :disabled="!dec.active && stats.genesisEnergy < dec.costGenesisEnergy"
                @click="toggleDecree(dec.id)"
              >
                {{ dec.active ? '頒布生效中 (點擊撤回)' : '頒布法令' }}
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
import { cosmicConstantsEngine, GenesisDecreeId } from '@/engine/cosmicConstantsTuning'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => cosmicConstantsEngine.stats)
const decrees = computed(() => cosmicConstantsEngine.decrees)

function onAlphaChange(e: Event): void {
  const target = e.target as HTMLInputElement
  cosmicConstantsEngine.setAlpha(parseFloat(target.value))
}

function onGravChange(e: Event): void {
  const target = e.target as HTMLInputElement
  cosmicConstantsEngine.setGravitationalG(parseFloat(target.value) * 1e-11)
}

function onLambdaChange(e: Event): void {
  const target = e.target as HTMLInputElement
  cosmicConstantsEngine.setLambdaDarkEnergy(parseFloat(target.value) * 1e-52)
}

function resetDefaults(): void {
  cosmicConstantsEngine.resetToDefaultConstants()
}

function toggleDecree(id: GenesisDecreeId): void {
  cosmicConstantsEngine.toggleDecree(id)
}

// ── Sacred Geometry Canvas Rendering ───────────────────────────────────────
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
  ctx.fillStyle = '#080a14'
  ctx.fillRect(0, 0, w, h)

  // Metatron's Cube sacred harmonic circles
  const alphaFactor = stats.value.constants.alpha / 0.007297
  const circleRadius = 38 * alphaFactor
  const nodeCount = 6

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(animTime * 0.4)

  // Central Hub
  ctx.beginPath()
  ctx.strokeStyle = '#fde047'
  ctx.lineWidth = 1.5
  ctx.arc(0, 0, circleRadius, 0, Math.PI * 2)
  ctx.stroke()

  // 6 Surrounding Petals
  const nodes: { x: number; y: number }[] = []
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i * Math.PI * 2) / nodeCount
    const nx = Math.cos(angle) * circleRadius
    const ny = Math.sin(angle) * circleRadius
    nodes.push({ x: nx, y: ny })

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)'
    ctx.lineWidth = 1
    ctx.arc(nx, ny, circleRadius, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Interconnecting sacred geometry lines
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
  ctx.lineWidth = 1
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      ctx.moveTo(nodes[i].x, nodes[i].y)
      ctx.lineTo(nodes[j].x, nodes[j].y)
    }
  }
  ctx.stroke()

  // Quantum Golden Core
  const pulse = Math.sin(animTime * 3) * 3
  ctx.beginPath()
  ctx.fillStyle = '#ffffff'
  ctx.arc(0, 0, 4 + pulse, 0, Math.PI * 2)
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
.oracle-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.oracle-modal {
  width: 820px; max-height: 90vh; background: #0c0e1a; border: 1px solid rgba(253, 224, 71, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(253, 224, 71, 0.2); display: flex; flex-direction: column;
  color: #fef9c3; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(253, 224, 71, 0.2);
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
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(253, 224, 71, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 15px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #fde047; }
.stat-card .power { color: #38bdf8; }
.stat-card .research { color: #c084fc; }
.stat-card .stability { color: #34d399; }
.stat-card .danger { color: #f43f5e; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(253, 224, 71, 0.3);
  background: #080a14;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #fde047;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.tuning-section {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(253, 224, 71, 0.2);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;
}
.tuning-header { display: flex; justify-content: space-between; align-items: center; }
.tuning-header h3 { margin: 0; font-size: 13px; color: #fde047; }
.reset-btn {
  background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 4px;
  padding: 4px 8px; font-size: 11px; cursor: pointer; transition: all 0.2s;
}
.reset-btn:hover { background: #334155; color: #ffffff; }

.sliders-grid { display: flex; flex-direction: column; gap: 8px; }
.slider-card { display: flex; flex-direction: column; gap: 4px; }
.slider-label { display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1; }
.slider-num { font-family: monospace; color: #fde047; font-weight: 700; }
.const-slider { accent-color: #fde047; cursor: pointer; }

.decrees-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #fde047; }
.decrees-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.decree-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(253, 224, 71, 0.2);
  border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;
  transition: all 0.2s;
}
.decree-card.active { border-color: #fde047; box-shadow: 0 0 12px rgba(253, 224, 71, 0.3); background: rgba(30, 27, 75, 0.5); }
.decree-header { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #f1f5f9; }
.dec-desc { margin: 0; font-size: 10px; color: #94a3b8; min-height: 26px; }
.dec-cost { font-size: 10px; color: #fbbf24; font-family: monospace; }
.decree-toggle-btn {
  background: #0284c7; color: #ffffff; border: none; border-radius: 4px; padding: 6px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.decree-toggle-btn.active { background: #d97706; }
.decree-toggle-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(253, 224, 71, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #fde047; font-family: monospace;
}
</style>
