<template>
  <div class="overlay" @click.self="close">
    <div class="leviathan-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🐉</span>
          <h2>深海深淵機械利維坦 Boss 討伐戰 (Deep-Sea Cyber Leviathan)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Layout: 3 Columns -->
      <div class="content-body">
        <!-- Col 1: Submarine Combat Status -->
        <div class="col-sub card-box">
          <div class="subhead">
            <span>🛡️ 電漿深潛艇戰鬥姿態</span>
            <span class="depth-badge">深度: {{ boss.stats.depth }}m</span>
          </div>

          <div class="sub-status-card">
            <div class="stat-row">
              <span>潛艇外殼完整度</span>
              <strong :class="{ danger: boss.stats.subHP < 300 }">{{ boss.stats.subHP }} / {{ boss.stats.subMaxHP }} HP</strong>
            </div>
            <div class="meter-track">
              <div class="meter-fill hp-fill" :style="{ width: (boss.stats.subHP / boss.stats.subMaxHP * 100) + '%' }"></div>
            </div>

            <div class="ammo-grid">
              <div class="ammo-box">
                <span class="a-label">🚀 電漿魚雷</span>
                <span class="a-val">{{ boss.stats.torpedoAmmo }} / {{ boss.stats.maxTorpedoAmmo }}</span>
              </div>
              <div class="ammo-box">
                <span class="a-label">📡 聲學誘餌</span>
                <span class="a-val">{{ boss.stats.decoyCharges }} / {{ boss.stats.maxDecoyCharges }}</span>
              </div>
            </div>

            <div v-if="boss.stats.isEmpStunned" class="status-warning emp-warn">
              ⚡ EMP 癱瘓中！剩餘 {{ boss.stats.empStunTimer.toFixed(1) }}s
            </div>
            <div v-else class="status-normal">
              🟢 電子火控系統連線正常
            </div>

            <div class="spawn-area">
              <button
                v-if="boss.stats.phase === 'dormant' || boss.stats.phase === 'defeated'"
                class="btn-spawn"
                @click="spawnBoss"
              >
                🌊 下潛至深淵召喚利維坦
              </button>
              <button
                v-else
                class="btn-reset"
                @click="boss.resetEncounter"
              >
                🛑 緊急回浮 (脫離戰鬥)
              </button>
            </div>
          </div>

          <!-- Trophy / Drops Showcase -->
          <div class="subhead" style="margin-top: 14px;">
            <span>🏆 深淵戰利品保險箱</span>
          </div>
          <div class="drops-list">
            <div v-if="boss.dropsVault.length === 0" class="empty-drops">
              尚未擊殺利維坦。完成討伐可獲神話級生化核心與超導裝甲。
            </div>
            <div
              v-for="(drop, idx) in boss.dropsVault"
              :key="idx"
              class="drop-item"
              :class="drop.rarity.toLowerCase()"
            >
              <div class="drop-head">
                <span class="drop-name">{{ drop.name }}</span>
                <span class="drop-count">x{{ drop.count }}</span>
              </div>
              <div class="drop-desc">{{ drop.description }}</div>
            </div>
          </div>
        </div>

        <!-- Col 2: Tactical Sonar Scope & Boss Arena -->
        <div class="col-arena card-box">
          <div class="subhead">
            <span>📡 360° 水下主動水聲聲納與巨獸姿態</span>
            <span class="phase-tag" :class="boss.stats.phase">{{ getPhaseLabel(boss.stats.phase) }}</span>
          </div>

          <!-- Boss HP Bar -->
          <div class="boss-health-card">
            <div class="boss-name-row">
              <span class="b-title">深海古機械利維坦 (CYBER LEVIATHAN TYPE-OMEGA)</span>
              <strong class="b-hp">{{ boss.stats.bossHP }} / {{ boss.stats.bossMaxHP }}</strong>
            </div>
            <div class="meter-track boss-track">
              <div class="meter-fill boss-fill" :style="{ width: (boss.stats.bossHP / boss.stats.bossMaxHP * 100) + '%' }"></div>
            </div>
            <div class="phase-markers">
              <span>Phase 1 (100%)</span>
              <span>Phase 2: EMP (70%)</span>
              <span>Phase 3: 自毀 (30%)</span>
            </div>
          </div>

          <!-- Channeling Banner -->
          <div v-if="boss.stats.channelingAttack" class="channel-alert">
            ⚠️ 警告：利維坦正在引導【{{ boss.stats.channelingAttack }}】！請立即釋放閃光聲納打斷！
          </div>

          <!-- Phase 3 Countdown -->
          <div v-if="boss.stats.phase === 'meltdown'" class="meltdown-alert">
            💥 核心自毀大裂變倒數：{{ boss.stats.meltdownCountdown.toFixed(1) }}s！在引爆前終結它！
          </div>

          <!-- Sonar Scope Visual Canvas -->
          <div class="sonar-screen">
            <canvas ref="sonarCanvas" width="460" height="240" class="sonar-cvs"></canvas>
          </div>

          <!-- Weapons Controls -->
          <div class="weapons-bar">
            <button
              class="w-btn torp-btn"
              :disabled="boss.stats.phase === 'dormant' || boss.stats.phase === 'defeated' || boss.stats.torpedoCooldown > 0 || boss.stats.torpedoAmmo <= 0 || boss.stats.isEmpStunned"
              @click="boss.fireTorpedo()"
            >
              🚀 電漿魚雷
              <span v-if="boss.stats.torpedoCooldown > 0">({{ boss.stats.torpedoCooldown.toFixed(1) }}s)</span>
            </button>

            <button
              class="w-btn flash-btn"
              :disabled="boss.stats.phase === 'dormant' || boss.stats.phase === 'defeated' || boss.stats.flashCooldown > 0 || boss.stats.isEmpStunned"
              @click="boss.fireFlashSonar()"
            >
              💡 閃光聲納
              <span v-if="boss.stats.flashCooldown > 0">({{ boss.stats.flashCooldown.toFixed(1) }}s)</span>
            </button>

            <button
              class="w-btn decoy-btn"
              :disabled="boss.stats.phase === 'dormant' || boss.stats.phase === 'defeated' || boss.stats.decoyCooldown > 0 || boss.stats.decoyCharges <= 0"
              @click="boss.deployDecoy()"
            >
              📡 部署誘餌
              <span v-if="boss.stats.decoyCooldown > 0">({{ boss.stats.decoyCooldown.toFixed(1) }}s)</span>
            </button>

            <button
              class="w-btn heal-btn"
              :disabled="boss.stats.repairCooldown > 0"
              @click="boss.repairHull()"
            >
              🔧 奈米自癒
              <span v-if="boss.stats.repairCooldown > 0">({{ boss.stats.repairCooldown.toFixed(1) }}s)</span>
            </button>
          </div>
        </div>

        <!-- Col 3: Combat Telemetry -->
        <div class="col-telemetry card-box">
          <div class="subhead">
            <span>📜 實時聲納戰鬥記錄</span>
            <span class="stat-badge">擊敗: {{ boss.stats.killCount }} 次</span>
          </div>

          <div class="telemetry-feed">
            <div v-for="(log, idx) in boss.combatLogs" :key="idx" class="feed-line">
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
import { leviathanBoss } from '@/engine/leviathanBoss'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const boss = leviathanBoss
const sonarCanvas = ref<HTMLCanvasElement | null>(null)
let animId: number = 0

function close(): void {
  ui.closeOverlay()
}

function spawnBoss(): void {
  boss.spawnEncounter()
}

function getPhaseLabel(phase: string): string {
  switch (phase) {
    case 'dormant': return '⚪ 休眠中 (Dormant)'
    case 'stalking': return '🔵 Phase 1: 幽閉巡弋'
    case 'emp_frenzy': return '⚡ Phase 2: 電磁狂暴'
    case 'meltdown': return '🔥 Phase 3: 臨界自毀'
    case 'defeated': return '🏆 討伐成功 (Defeated)'
    default: return phase
  }
}

// ── Sonar Canvas Animation ──────────────────────────────────────────────────
function drawSonar(): void {
  const canvas = sonarCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2

  // Background
  ctx.fillStyle = 'rgba(2, 10, 24, 0.4)'
  ctx.fillRect(0, 0, width, height)

  const time = Date.now() * 0.002

  // Concentric radar circles
  ctx.strokeStyle = 'rgba(0, 255, 200, 0.15)'
  ctx.lineWidth = 1
  for (let r = 30; r < 140; r += 30) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Crosshairs
  ctx.beginPath()
  ctx.moveTo(cx - 130, cy)
  ctx.lineTo(cx + 130, cy)
  ctx.moveTo(cx, cy - 110)
  ctx.lineTo(cx, cy + 110)
  ctx.stroke()

  // Rotating sonar sweep beam
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(time)
  const grad = ctx.createLinearGradient(0, 0, 130, 0)
  grad.addColorStop(0, 'rgba(0, 255, 200, 0.6)')
  grad.addColorStop(1, 'rgba(0, 255, 200, 0.0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, 130, -0.2, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Submarine player blip (center)
  ctx.fillStyle = '#00ffff'
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fill()

  // Leviathan target signature if active
  if (boss.stats.phase !== 'dormant' && boss.stats.phase !== 'defeated') {
    const levAngle = time * 0.6
    const levDist = 70 + Math.sin(time * 0.8) * 25
    const lx = cx + Math.cos(levAngle) * levDist
    const ly = cy + Math.sin(levAngle) * levDist

    // Leviathan cyber glow
    ctx.fillStyle = boss.stats.phase === 'meltdown' ? '#ff0055' : (boss.stats.phase === 'emp_frenzy' ? '#ffaa00' : '#ff3366')
    ctx.beginPath()
    ctx.arc(lx, ly, 8, 0, Math.PI * 2)
    ctx.fill()

    // Blip pulse rings
    ctx.strokeStyle = ctx.fillStyle
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(lx, ly, 14 + Math.sin(time * 5) * 4, 0, Math.PI * 2)
    ctx.stroke()

    // Leviathan label
    ctx.font = '10px monospace'
    ctx.fillText('LEVIATHAN', lx + 12, ly + 4)
  }

  animId = requestAnimationFrame(drawSonar)
}

onMounted(() => {
  drawSonar()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 16, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.leviathan-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(4, 12, 28, 0.96), rgba(10, 22, 44, 0.96));
  border: 1px solid rgba(0, 255, 200, 0.35);
  box-shadow: 0 0 40px rgba(0, 255, 200, 0.2);
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

.depth-badge {
  background: rgba(0, 255, 200, 0.15);
  color: #00ffcc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.danger {
  color: #ff0055;
  animation: blink 0.8s infinite alternate;
}

@keyframes blink {
  from { opacity: 0.6; }
  to { opacity: 1.0; }
}

.meter-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.meter-fill {
  height: 100%;
  transition: width 0.2s ease;
}
.hp-fill { background: linear-gradient(90deg, #ff0055, #00ffcc); }
.boss-fill { background: linear-gradient(90deg, #ffaa00, #ff0055); }

.ammo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.ammo-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.a-label {
  font-size: 0.7rem;
  color: #88aacc;
}

.a-val {
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
}

.status-warning {
  padding: 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
.emp-warn { background: rgba(255, 170, 0, 0.2); border: 1px solid #ffaa00; color: #ffaa00; }

.status-normal {
  font-size: 0.8rem;
  color: #00ff88;
  margin-bottom: 10px;
}

.btn-spawn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(90deg, #0088cc, #00ffcc);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.4);
}
.btn-reset {
  width: 100%;
  padding: 10px;
  background: rgba(255, 0, 85, 0.2);
  border: 1px solid #ff0055;
  color: #ff5588;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}

/* Drops Showcase */
.drops-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  flex: 1;
}

.empty-drops {
  font-size: 0.75rem;
  color: #6688aa;
  padding: 8px;
  text-align: center;
}

.drop-item {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 6px;
}
.drop-item.mythic { border-left: 3px solid #ff00aa; }
.drop-item.legendary { border-left: 3px solid #ffaa00; }
.drop-item.epic { border-left: 3px solid #aa00ff; }

.drop-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
}

.drop-desc {
  font-size: 0.7rem;
  color: #a0c0e0;
}

/* Center Col Arena */
.col-arena {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phase-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}
.phase-tag.dormant { background: rgba(255, 255, 255, 0.1); color: #888; }
.phase-tag.stalking { background: rgba(0, 255, 200, 0.2); color: #00ffcc; }
.phase-tag.emp_frenzy { background: rgba(255, 170, 0, 0.2); color: #ffaa00; }
.phase-tag.meltdown { background: rgba(255, 0, 85, 0.3); color: #ff0055; animation: blink 0.8s infinite alternate; }
.phase-tag.defeated { background: #00ff88; color: #000; }

.boss-health-card {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.boss-name-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: bold;
  color: #ff5588;
  margin-bottom: 4px;
}

.boss-track {
  height: 12px;
  margin-bottom: 4px;
}

.phase-markers {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #6688aa;
}

.channel-alert {
  background: rgba(255, 170, 0, 0.25);
  border: 1px solid #ffaa00;
  color: #ffaa00;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
}

.meltdown-alert {
  background: rgba(255, 0, 85, 0.3);
  border: 1px solid #ff0055;
  color: #ff5588;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  animation: blink 0.6s infinite alternate;
}

.sonar-screen {
  flex: 1;
  background: #000;
  border: 1px solid rgba(0, 255, 200, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.sonar-cvs {
  width: 100%;
  height: 100%;
  display: block;
}

.weapons-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.w-btn {
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
}
.torp-btn { background: linear-gradient(90deg, #ff0055, #ff5500); color: #fff; }
.flash-btn { background: linear-gradient(90deg, #0088cc, #00ffff); color: #000; }
.decoy-btn { background: rgba(170, 0, 255, 0.3); border: 1px solid #aa00ff; color: #e0b0ff; }
.heal-btn { background: rgba(0, 255, 136, 0.2); border: 1px solid #00ff88; color: #00ff88; }
.w-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Col Telemetry */
.telemetry-feed {
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

.feed-line {
  margin: 3px 0;
}
</style>
