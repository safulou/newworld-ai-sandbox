<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="raid-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">💥</span>
          <h2>公會空天旗艦突襲戰 (Syndicate Flagship Raids)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Combat Layout -->
      <div class="raid-content">
        <!-- Top Target Selector / Status -->
        <div class="target-bar glass-panel">
          <div class="target-info">
            <span class="faction-badge" :style="{ borderColor: currentTarget.color, color: currentTarget.color }">
              {{ currentTarget.factionName }}
            </span>
            <h3>{{ currentTarget.name }}</h3>
            <span class="class-type">{{ currentTarget.classType }}</span>
          </div>

          <div v-if="stats.phase === 'standby'" class="target-select">
            <label>切換目標旗艦:</label>
            <select v-model="selectedFaction" @change="onSelectFaction">
              <option value="arasaka_orbital">荒坂軌道 · 提亞馬特四號</option>
              <option value="neon_vanguard">霓虹先鋒 · 索拉里斯號</option>
              <option value="cygnus_mining">天鵝採礦 · 破岩巨鑚號</option>
              <option value="quantum_syndicate">量子辛迪加 · 奇異點零號</option>
            </select>
            <button class="start-btn" @click="startRaid">⚔️ 發起跨服旗艦突襲</button>
          </div>

          <div v-else class="phase-indicator">
            <span class="phase-tag" :class="stats.phase">
              {{ phaseTitle }}
            </span>
            <button class="abort-btn" @click="abortRaid">🛑 緊急脫離戰區</button>
          </div>
        </div>

        <!-- Center: Boss Flagship Subsystems & Countdown -->
        <div class="boss-arena glass-panel">
          <div class="boss-hud">
            <!-- Phase 1: Shields -->
            <div class="subsystem-box" :class="{ completed: currentTarget.shieldGenerators === 0, active: stats.phase === 'phase_1_shields' }">
              <div class="sub-header">
                <span>🛡️ 偏折護盾發生器</span>
                <span class="sub-val">{{ currentTarget.shieldGenerators }} / 4</span>
              </div>
              <div class="sub-bar">
                <div class="sub-fill shield" :style="{ width: `${(currentTarget.shieldGenerators / 4) * 100}%` }"></div>
              </div>
            </div>

            <!-- Phase 2: Flak -->
            <div class="subsystem-box" :class="{ completed: currentTarget.flakTurrets === 0, active: stats.phase === 'phase_2_flak' }">
              <div class="sub-header">
                <span>🔫 密集高射防空砲台</span>
                <span class="sub-val">{{ currentTarget.flakTurrets }} / 6</span>
              </div>
              <div class="sub-bar">
                <div class="sub-fill flak" :style="{ width: `${(currentTarget.flakTurrets / 6) * 100}%` }"></div>
              </div>
            </div>

            <!-- Phase 3: Core Hull & Meltdown Timer -->
            <div class="subsystem-box" :class="{ active: stats.phase === 'phase_3_meltdown' }">
              <div class="sub-header">
                <span>☢️ 暴露的反應堆核心 HP</span>
                <span class="sub-val">{{ currentTarget.currentHull }} / {{ currentTarget.maxHull }}</span>
              </div>
              <div class="sub-bar">
                <div class="sub-fill core" :style="{ width: `${(currentTarget.currentHull / currentTarget.maxHull) * 100}%` }"></div>
              </div>
              <div v-if="stats.phase === 'phase_3_meltdown'" class="meltdown-timer">
                ⏰ 臨界自毀倒數: <span class="timer-sec">{{ Math.ceil(currentTarget.reactorMeltdownTimer) }}s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Player Armaments Controls -->
        <div class="squadron-cockpit glass-panel">
          <div class="cockpit-stats">
            <div class="stat-unit">
              <span>🛡️ 突擊機護盾</span>
              <div class="stat-bar">
                <div class="stat-fill shield" :style="{ width: `${(squadron.shield / squadron.maxShield) * 100}%` }"></div>
              </div>
              <span>{{ Math.round(squadron.shield) }} / {{ squadron.maxShield }}</span>
            </div>
            <div class="stat-unit">
              <span>❤️ 裝甲外殼</span>
              <div class="stat-bar">
                <div class="stat-fill hull" :style="{ width: `${(squadron.hull / squadron.maxHull) * 100}%` }"></div>
              </div>
              <span>{{ Math.round(squadron.hull) }} / {{ squadron.maxHull }}</span>
            </div>
            <div class="stat-unit">
              <span>🚀 質子魚雷: <strong class="torp-count">{{ squadron.torpedoes }} 枚</strong></span>
            </div>
          </div>

          <div class="fire-controls">
            <button
              class="fire-btn flak"
              :disabled="squadron.flakCooldown > 0 || isCombatEnded"
              @click="fireFlak"
            >
              <span class="btn-icon">⚡</span>
              <span>雙聯防空機砲 (Flak)</span>
              <span class="cd" v-if="squadron.flakCooldown > 0">{{ squadron.flakCooldown.toFixed(1) }}s</span>
            </button>

            <button
              class="fire-btn torpedo"
              :disabled="squadron.torpedoCooldown > 0 || squadron.torpedoes <= 0 || isCombatEnded"
              @click="fireTorpedo"
            >
              <span class="btn-icon">🚀</span>
              <span>反艦質子重魚雷 (Torpedo)</span>
              <span class="cd" v-if="squadron.torpedoCooldown > 0">{{ squadron.torpedoCooldown.toFixed(1) }}s</span>
            </button>

            <button
              class="fire-btn jammer"
              :class="{ active: squadron.isJamming }"
              :disabled="squadron.jammerCooldown > 0 || squadron.isJamming || isCombatEnded"
              @click="activateJammer"
            >
              <span class="btn-icon">📡</span>
              <span>{{ squadron.isJamming ? `干擾中 (${squadron.jammingTimer.toFixed(1)}s)` : '電子干擾脈衝 (EW)' }}</span>
              <span class="cd" v-if="squadron.jammerCooldown > 0 && !squadron.isJamming">{{ squadron.jammerCooldown.toFixed(1) }}s</span>
            </button>

            <button
              class="fire-btn repair"
              :disabled="squadron.repairCooldown > 0 || isCombatEnded"
              @click="deployRepairSwarm"
            >
              <span class="btn-icon">🛠️</span>
              <span>奈米維修蜂群 (Repair)</span>
              <span class="cd" v-if="squadron.repairCooldown > 0">{{ squadron.repairCooldown.toFixed(1) }}s</span>
            </button>
          </div>
        </div>

        <!-- Combat Telemetry Log -->
        <div class="combat-log glass-panel">
          <div class="log-header">
            <span>📜 實時突襲戰鬥紀錄:</span>
            <span class="score-badge">⭐ 突襲積分: {{ stats.score }}</span>
            <span class="loot-badge">💰 累計獲益: {{ stats.creditsLooted.toLocaleString() }} CR</span>
          </div>
          <div class="log-entries">
            <div v-for="(log, idx) in stats.combatLog.slice(0, 7)" :key="idx" class="log-row">
              {{ log }}
            </div>
          </div>
        </div>

        <!-- Victory / Defeat Overlay -->
        <div v-if="stats.phase === 'victory'" class="victory-banner glass-panel">
          <h3>🎉 旗艦突襲大獲全勝！</h3>
          <p>敵方巨企旗艦已引爆解體，成功為所屬陣營掠奪戰略領地控制權與巨額信用點！</p>
          <button class="reset-btn" @click="resetStandby">返回待命作戰室</button>
        </div>
        <div v-if="stats.phase === 'defeat'" class="defeat-banner glass-panel">
          <h3>💀 突擊行動失敗</h3>
          <p>僚機外殼損毀或未能在反應堆自毀前全殲核心，已緊急脫離戰區。</p>
          <button class="reset-btn" @click="resetStandby">整補後重試</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  syndicateFlagshipRaids,
  type FlagshipFaction
} from '@/engine/syndicateFlagshipRaids'

const ui = useUIStore()
const engine = syndicateFlagshipRaids
const stats = engine.stats
const squadron = engine.squadron

const selectedFaction = ref<FlagshipFaction>(stats.activeFaction)

const currentTarget = computed(() => {
  return engine.targets[stats.activeFaction]
})

const isCombatEnded = computed(() => {
  return stats.phase === 'standby' || stats.phase === 'victory' || stats.phase === 'defeat'
})

const phaseTitle = computed(() => {
  switch (stats.phase) {
    case 'phase_1_shields': return '⚡ Phase 1: 摧毀偏折護盾發生器'
    case 'phase_2_flak': return '🔥 Phase 2: 肅清密集高射防空砲'
    case 'phase_3_meltdown': return '🚨 Phase 3: 核心熔毀倒數搶攻'
    case 'victory': return '🏆 突襲完勝'
    case 'defeat': return '💀 任務失敗'
    default: return '待命'
  }
})

function close(): void {
  ui.closeOverlay()
}

function onSelectFaction(): void {
  engine.selectTarget(selectedFaction.value)
}

function startRaid(): void {
  engine.startRaid()
}

function abortRaid(): void {
  engine.abortRaid()
}

function resetStandby(): void {
  engine.resetToStandby()
}

function fireFlak(): void {
  engine.fireFlakCannons()
}

function fireTorpedo(): void {
  engine.fireProtonTorpedo()
}

function activateJammer(): void {
  engine.activateJammer()
}

function deployRepairSwarm(): void {
  engine.deployRepairSwarm()
}
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
}

.raid-modal {
  width: 92vw;
  max-width: 960px;
  max-height: 88vh;
  background: rgba(16, 10, 24, 0.94);
  border: 1px solid rgba(255, 0, 85, 0.4);
  box-shadow: 0 0 35px rgba(255, 0, 85, 0.25);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: #fce4ec;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 0, 85, 0.2);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.8rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #ff3366;
}

.close-btn {
  background: transparent;
  border: none;
  color: #f48fb1;
  font-size: 1.4rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff1744;
}

.raid-content {
  padding: 18px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.target-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 10, 25, 0.6);
  border: 1px solid rgba(255, 0, 85, 0.3);
  border-radius: 8px;
  padding: 12px 18px;
}

.target-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.faction-badge {
  border: 1px solid;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
}

.target-info h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #fff;
}

.class-type {
  font-size: 0.8rem;
  color: #f48fb1;
}

.target-select {
  display: flex;
  align-items: center;
  gap: 10px;
}

.target-select select {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff3366;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
}

.start-btn {
  background: #ff0055;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.start-btn:hover {
  background: #ff1744;
  box-shadow: 0 0 12px rgba(255, 0, 85, 0.6);
}

.phase-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.phase-tag {
  background: rgba(255, 0, 85, 0.3);
  border: 1px solid #ff0055;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  color: #ff4081;
}

.abort-btn {
  background: #d50000;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
}

.boss-arena {
  background: rgba(20, 8, 22, 0.7);
  border: 1px solid rgba(255, 0, 85, 0.25);
  border-radius: 8px;
  padding: 16px;
}

.boss-hud {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.subsystem-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s;
}

.subsystem-box.active {
  border-color: #ff0055;
  box-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
}

.subsystem-box.completed {
  border-color: #00e676;
  opacity: 0.6;
}

.sub-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.sub-val {
  font-weight: 700;
}

.sub-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.sub-fill.shield {
  height: 100%;
  background: #00e5ff;
  transition: width 0.3s;
}

.sub-fill.flak {
  height: 100%;
  background: #ffab00;
  transition: width 0.3s;
}

.sub-fill.core {
  height: 100%;
  background: #ff1744;
  transition: width 0.3s;
}

.meltdown-timer {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ff5252;
  font-weight: 700;
}

.timer-sec {
  font-size: 1.1rem;
  color: #ffd600;
}

.squadron-cockpit {
  background: rgba(14, 20, 34, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cockpit-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-unit {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: #b0bec5;
}

.stat-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill.shield {
  height: 100%;
  background: #00e5ff;
}

.stat-fill.hull {
  height: 100%;
  background: #00e676;
}

.torp-count {
  color: #ffd54f;
  font-size: 0.95rem;
}

.fire-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.fire-btn {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #e0f7fa;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  transition: all 0.2s;
}

.fire-btn:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.25);
  border-color: #00ffff;
}

.fire-btn.flak {
  border-color: #ffab00;
}

.fire-btn.torpedo {
  border-color: #ff3d00;
}

.fire-btn.jammer {
  border-color: #bd00ff;
}

.fire-btn.jammer.active {
  background: rgba(189, 0, 255, 0.3);
  box-shadow: 0 0 10px #bd00ff;
}

.fire-btn.repair {
  border-color: #00e676;
}

.fire-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fire-btn .cd {
  font-size: 0.8rem;
  color: #ff5252;
}

.combat-log {
  background: rgba(10, 10, 15, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;
  color: #b0bec5;
}

.score-badge {
  color: #ffd54f;
  font-weight: 700;
}

.loot-badge {
  color: #69f0ae;
  font-weight: 700;
}

.log-entries {
  font-family: monospace;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-row {
  color: #eceff1;
}

.victory-banner,
.defeat-banner {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
}

.victory-banner {
  background: rgba(0, 230, 118, 0.15);
  border: 1px solid #00e676;
}

.victory-banner h3 {
  color: #00e676;
  margin: 0 0 8px;
}

.defeat-banner {
  background: rgba(213, 0, 0, 0.15);
  border: 1px solid #d50000;
}

.defeat-banner h3 {
  color: #ff1744;
  margin: 0 0 8px;
}

.reset-btn {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}
</style>
