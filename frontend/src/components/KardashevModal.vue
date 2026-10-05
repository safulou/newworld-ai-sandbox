<template>
  <div class="kardashev-modal-overlay" @click.self="ui.closeOverlay()">
    <div class="kardashev-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <span class="icon">🌌</span>
          <div>
            <h2>卡爾達肖夫文明等級評定與奇點超越儀</h2>
            <div class="subtitle">Kardashev Civilizational Metric & Transcendence Ascension</div>
          </div>
        </div>
        <button class="close-btn" @click="ui.closeOverlay()">✕</button>
      </div>

      <!-- Main Content -->
      <div class="modal-body">
        <!-- Top Statistics Banner -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">卡爾達肖夫指數 (K)</span>
            <span class="val highlight">Type {{ stats.kardashevIndex.toFixed(3) }}</span>
            <span class="sub">{{ stats.tierTitle }}</span>
          </div>
          <div class="stat-card">
            <span class="label">文明總功率輸出</span>
            <span class="val power">{{ formatPower(stats.currentPowerWatts * stats.globalPowerMultiplier) }}</span>
            <span class="sub">基礎 {{ formatPower(stats.currentPowerWatts) }}</span>
          </div>
          <div class="stat-card">
            <span class="label">全域宇宙能量倍率</span>
            <span class="val multiplier">x{{ stats.globalPowerMultiplier.toFixed(2) }}</span>
            <span class="sub">飛升加成 +{{ ((stats.globalPowerMultiplier - 1) * 100).toFixed(0) }}%</span>
          </div>
          <div class="stat-card">
            <span class="label">超越星芒 / 飛升次數</span>
            <span class="val shards">🔮 {{ stats.transcendenceShards }} 顆</span>
            <span class="sub">已完成 {{ stats.ascensionCount }} 次奇點超脫</span>
          </div>
        </div>

        <!-- Canvas Visualizer: Multidimensional Civilization Web -->
        <div class="canvas-container">
          <canvas ref="canvasRef" width="760" height="240"></canvas>
          <div class="canvas-badge">
            維度能級狀態：{{ stats.tier }} [完備度 {{ stats.ascensionReadinessPercent }}%]
          </div>
        </div>

        <!-- Ascension Pillars Section -->
        <div class="pillars-section">
          <h3>🏛️ 四大文明飛升天梯支柱 (Ascension Pillars)</h3>
          <div class="pillars-grid">
            <div
              v-for="pillar in Object.values(pillars)"
              :key="pillar.id"
              class="pillar-card"
              :class="{ locked: !pillar.unlocked, maxed: pillar.level >= pillar.maxLevel }"
            >
              <div class="pillar-header">
                <span class="pillar-icon">{{ pillar.icon }}</span>
                <div class="pillar-info">
                  <span class="name">{{ pillar.name }}</span>
                  <span class="level">Lv.{{ pillar.level }} / {{ pillar.maxLevel }}</span>
                </div>
              </div>
              <p class="desc">{{ pillar.bonusDesc }}</p>
              <div class="cost-row">
                <span>需求功率門檻:</span>
                <span class="cost">{{ formatPower(pillar.costWattsEquivalent * pillar.level) }}</span>
              </div>
              <button
                class="upgrade-btn"
                :disabled="!pillar.unlocked || pillar.level >= pillar.maxLevel || stats.currentPowerWatts < pillar.costWattsEquivalent * pillar.level"
                @click="upgradePillar(pillar.id)"
              >
                {{ !pillar.unlocked ? '尚未解鎖' : pillar.level >= pillar.maxLevel ? '已達極限' : '升級支柱' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Transcendence Ascension Activation Card -->
        <div class="ascension-box">
          <div class="ascension-info">
            <h4>✨ 奇點飛升超脫之門 (Transcendence Singularity)</h4>
            <p>當文明達到 Type II 恆星級能階（K ≥ 2.0）且飛升完備度達到 100% 時，可突破當前維度邊界，凝聚超越星芒並永久賦予宇宙能量倍率。</p>
            <div class="progress-bar-wrap">
              <div class="progress-bar" :style="{ width: `${stats.ascensionReadinessPercent}%` }"></div>
              <span class="progress-text">{{ stats.ascensionReadinessPercent }}% 完備度</span>
            </div>
          </div>
          <button
            class="ascend-btn"
            :disabled="stats.ascensionReadinessPercent < 100 || stats.kardashevIndex < 2.0"
            @click="triggerAscension"
          >
            啟動奇點超越飛升
          </button>
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
import { kardashevEngine, AscensionPillarId } from '@/engine/kardashevTranscendence'

const ui = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let animTime = 0

const stats = computed(() => kardashevEngine.stats)
const pillars = computed(() => kardashevEngine.pillars)

function formatPower(watts: number): string {
  if (watts >= 1e36) return `${(watts / 1e36).toFixed(2)} YW (Type III)`
  if (watts >= 1e26) return `${(watts / 1e26).toFixed(2)} × 10²⁶ W (Type II)`
  if (watts >= 1e21) return `${(watts / 1e21).toFixed(2)} ZW (澤瓦)`
  if (watts >= 1e18) return `${(watts / 1e18).toFixed(2)} EW (艾瓦)`
  if (watts >= 1e15) return `${(watts / 1e15).toFixed(2)} PW (拍瓦)`
  if (watts >= 1e12) return `${(watts / 1e12).toFixed(2)} TW (太瓦)`
  if (watts >= 1e9) return `${(watts / 1e9).toFixed(2)} GW (吉瓦)`
  return `${(watts / 1e6).toFixed(1)} MW`
}

function upgradePillar(id: AscensionPillarId): void {
  kardashevEngine.upgradePillar(id)
}

function triggerAscension(): void {
  kardashevEngine.triggerAscension()
}

// ── Visualizer Animation ───────────────────────────────────────────────────
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

  // Deep space background
  ctx.fillStyle = '#050711'
  ctx.fillRect(0, 0, w, h)

  // Starfield
  for (let i = 0; i < 40; i++) {
    const sx = (Math.sin(i * 99 + animTime * 0.1) * 0.5 + 0.5) * w
    const sy = (Math.cos(i * 33 + animTime * 0.08) * 0.5 + 0.5) * h
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (i % 3) * 0.2})`
    ctx.fillRect(sx, sy, 1.5, 1.5)
  }

  // Kardashev Energy Waveforms
  const kIndex = stats.value.kardashevIndex
  const rings = [
    { radius: 40, color: 'rgba(0, 220, 255, ', maxK: 1.0, label: 'Type I 行星圈' },
    { radius: 75, color: 'rgba(255, 200, 0, ', maxK: 2.0, label: 'Type II 恆星圈' },
    { radius: 110, color: 'rgba(200, 80, 255, ', maxK: 3.0, label: 'Type III 銀河圈' },
    { radius: 140, color: 'rgba(255, 255, 255, ', maxK: 4.0, label: 'Type IV 超維奇點' },
  ]

  rings.forEach((r, idx) => {
    const isReached = kIndex >= (idx === 0 ? 0.8 : rings[idx - 1].maxK)
    const alpha = isReached ? 0.8 : 0.2
    ctx.beginPath()
    ctx.strokeStyle = `${r.color}${alpha})`
    ctx.lineWidth = isReached ? 2.5 : 1
    ctx.arc(cx, cy, r.radius, 0, Math.PI * 2)
    ctx.stroke()

    if (isReached) {
      // Rotating energetic nodal particles
      const nodeCount = 4 + idx * 3
      for (let n = 0; n < nodeCount; n++) {
        const angle = animTime * (0.8 - idx * 0.15) + (n * Math.PI * 2) / nodeCount
        const nx = cx + Math.cos(angle) * r.radius
        const ny = cy + Math.sin(angle) * r.radius
        ctx.beginPath()
        ctx.fillStyle = `${r.color}0.9)`
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })

  // Central Core Beacon
  const pulse = Math.sin(animTime * 3) * 4
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24 + pulse)
  coreGrad.addColorStop(0, '#ffffff')
  coreGrad.addColorStop(0.4, '#00e5ff')
  coreGrad.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.fillStyle = coreGrad
  ctx.arc(cx, cy, 24 + pulse, 0, Math.PI * 2)
  ctx.fill()

  // Central Text
  ctx.font = 'bold 11px monospace'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(`K ${kIndex.toFixed(2)}`, cx, cy + 4)

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
.kardashev-modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.kardashev-modal {
  width: 820px; max-height: 90vh; background: #0c0f1d; border: 1px solid rgba(0, 229, 255, 0.35);
  border-radius: 12px; box-shadow: 0 0 35px rgba(0, 229, 255, 0.25); display: flex; flex-direction: column;
  color: #e0f2fe; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; background: rgba(14, 23, 42, 0.9); border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  display: flex; justify-content: space-between; align-items: center;
}
.title-group { display: flex; align-items: center; gap: 12px; }
.title-group .icon { font-size: 28px; }
.title-group h2 { margin: 0; font-size: 18px; color: #38bdf8; font-weight: 700; letter-spacing: 0.5px; }
.subtitle { font-size: 11px; color: #94a3b8; font-family: monospace; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover { color: #f43f5e; }

.modal-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.stat-card .label { font-size: 11px; color: #94a3b8; }
.stat-card .val { font-size: 16px; font-weight: 700; font-family: monospace; }
.stat-card .highlight { color: #38bdf8; }
.stat-card .power { color: #fbbf24; }
.stat-card .multiplier { color: #34d399; }
.stat-card .shards { color: #c084fc; }
.stat-card .sub { font-size: 10px; color: #64748b; }

.canvas-container {
  position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.3);
  background: #050711;
}
.canvas-container canvas { display: block; width: 100%; height: auto; }
.canvas-badge {
  position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #38bdf8;
  background: rgba(15, 23, 42, 0.75); padding: 3px 8px; border-radius: 4px; font-family: monospace;
}

.pillars-section h3 { margin: 0 0 10px 0; font-size: 14px; color: #7dd3fc; }
.pillars-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.pillar-card {
  background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.pillar-card.locked { opacity: 0.5; border-color: rgba(100, 116, 139, 0.3); }
.pillar-header { display: flex; align-items: center; gap: 10px; }
.pillar-icon { font-size: 24px; }
.pillar-info { display: flex; flex-direction: column; }
.pillar-info .name { font-size: 13px; font-weight: 700; color: #e2e8f0; }
.pillar-info .level { font-size: 11px; color: #38bdf8; font-family: monospace; }
.pillar-card .desc { margin: 0; font-size: 11px; color: #94a3b8; min-height: 28px; }
.cost-row { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
.cost-row .cost { color: #fbbf24; font-family: monospace; }
.upgrade-btn {
  background: #0284c7; color: #ffffff; border: none; border-radius: 6px; padding: 6px 12px;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.upgrade-btn:hover:not(:disabled) { background: #0ea5e9; box-shadow: 0 0 12px rgba(14, 165, 233, 0.4); }
.upgrade-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.ascension-box {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
  border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 8px; padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.ascension-info h4 { margin: 0 0 4px 0; font-size: 14px; color: #c084fc; }
.ascension-info p { margin: 0 0 8px 0; font-size: 11px; color: #94a3b8; max-width: 520px; }
.progress-bar-wrap {
  width: 100%; height: 16px; background: rgba(15, 23, 42, 0.9); border-radius: 8px;
  overflow: hidden; position: relative; border: 1px solid rgba(168, 85, 247, 0.3);
}
.progress-bar { height: 100%; background: linear-gradient(90deg, #7c3aed, #c084fc); transition: width 0.3s; }
.progress-text {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #ffffff; font-weight: 700; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
.ascend-btn {
  background: linear-gradient(135deg, #7c3aed, #a855f7); color: #ffffff; border: none;
  border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; cursor: pointer;
  white-space: nowrap; transition: all 0.2s;
}
.ascend-btn:hover:not(:disabled) {
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.6); transform: translateY(-1px);
}
.ascend-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.status-banner {
  background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(56, 189, 248, 0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #38bdf8; font-family: monospace;
}
</style>
