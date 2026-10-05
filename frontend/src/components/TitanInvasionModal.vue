<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="titan-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">👑</span>
          <h2>全服世界首領宇宙泰坦浩劫 (World Titan Invasion)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="titan-content">
        <!-- Boss Banner Stage -->
        <div class="boss-card glass-panel" :class="bossPhaseClass">
          <div class="boss-top">
            <div class="boss-identity">
              <span class="boss-badge">{{ boss.title }}</span>
              <h3 class="boss-name">{{ boss.name }}</h3>
            </div>
            <div class="boss-phase-badge" :class="boss.phase">
              <span v-if="boss.phase === 'dormant'">💤 休眠信標偵測中</span>
              <span v-else-if="boss.phase === 'phase_1_dark_veil'">🛡️ 第一階段: 暗物質天幕偏折盾</span>
              <span v-else-if="boss.phase === 'phase_2_antimatter_storm'">⚡ 第二階段: 反物質湮滅風暴</span>
              <span v-else-if="boss.phase === 'phase_3_temporal_collapse'">🚨 終極狂暴: 時間碎裂坍縮</span>
              <span v-else-if="boss.phase === 'victory'">🏆 首領討伐完勝！</span>
              <span v-else-if="boss.phase === 'defeat'">❌ 戰術撤離失敗</span>
            </div>
          </div>

          <!-- Stun / Warning Banner -->
          <div v-if="boss.isStunned" class="status-alert stun-pulse">
            ⚡ 巨神受量子信標重力坍縮影響，處於時空停滯癱瘓中！({{ boss.stunTimer.toFixed(1) }}s)
          </div>
          <div v-else-if="boss.phase === 'phase_3_temporal_collapse'" class="status-alert enrage-pulse">
            ⚠️ 警告：克洛諾斯時空核心即將融毀！終末斬殺倒數：{{ Math.ceil(boss.enrageTimerSec) }} 秒！
          </div>

          <!-- Boss HP & Shield Gauges -->
          <div class="gauge-section">
            <!-- Shield Bar (Phase 1) -->
            <div v-if="boss.phase === 'phase_1_dark_veil'" class="gauge-bar-wrapper">
              <div class="gauge-label">
                <span>暗物質天幕盾</span>
                <span>{{ Math.round(boss.shieldHp) }} / {{ boss.maxShieldHp }}</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill shield-fill"
                  :style="{ width: `${(boss.shieldHp / boss.maxShieldHp) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Antimatter Tendrils (Phase 2) -->
            <div v-if="boss.phase === 'phase_2_antimatter_storm'" class="tendrils-row">
              <span class="tendril-label">反物質湮滅觸手核:</span>
              <div class="tendril-icons">
                <span
                  v-for="idx in 4"
                  :key="idx"
                  class="tendril-dot"
                  :class="{ active: idx <= boss.antimatterTendrils }"
                >
                  ⚡
                </span>
              </div>
              <span class="tendril-count">剩餘: {{ boss.antimatterTendrils }} / 4</span>
            </div>

            <!-- Boss HP Bar -->
            <div class="gauge-bar-wrapper">
              <div class="gauge-label">
                <span>巨神主體完整度</span>
                <span>{{ Math.round(boss.currentHp).toLocaleString() }} / {{ boss.maxHp.toLocaleString() }} ({{ ((boss.currentHp / boss.maxHp) * 100).toFixed(1) }}%)</span>
              </div>
              <div class="progress-track hp-track">
                <div
                  class="progress-fill boss-hp-fill"
                  :style="{ width: `${(boss.currentHp / boss.maxHp) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vanguard Telemetry & Tactical Actions Grid -->
        <div class="combat-grid">
          <!-- Vanguard Status -->
          <div class="player-panel glass-panel">
            <h4 class="panel-subtitle">🛡️ 先鋒前線指揮艦數據</h4>
            <div class="gauge-bar-wrapper">
              <div class="gauge-label">
                <span>裝甲艦體外殼</span>
                <span>{{ Math.round(player.hull) }} / {{ player.maxHull }}</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill player-hull-fill"
                  :style="{ width: `${Math.max(0, (player.hull / player.maxHull) * 100)}%` }"
                ></div>
              </div>
            </div>

            <div class="gauge-bar-wrapper">
              <div class="gauge-label">
                <span>偏折護盾能量</span>
                <span>{{ Math.round(player.shield) }} / {{ player.maxShield }}</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill player-shield-fill"
                  :style="{ width: `${Math.max(0, (player.shield / player.maxShield) * 100)}%` }"
                ></div>
              </div>
            </div>

            <div class="stats-counter-grid">
              <div class="counter-box">
                <span class="cnt-label">累計輸出傷害</span>
                <span class="cnt-val">{{ player.totalDamageDealt.toLocaleString() }}</span>
              </div>
              <div class="counter-box">
                <span class="cnt-label">討伐巨神次數</span>
                <span class="cnt-val highlight">{{ player.titansRepelled }}</span>
              </div>
              <div class="counter-box">
                <span class="cnt-label">獲得信用賞金</span>
                <span class="cnt-val">{{ player.creditsAwarded.toLocaleString() }} CR</span>
              </div>
              <div class="counter-box">
                <span class="cnt-label">神話時空核心</span>
                <span class="cnt-val mythic">{{ player.mythicCoresLooted }} 顆</span>
              </div>
            </div>
          </div>

          <!-- Tactical Strike Actions -->
          <div class="actions-panel glass-panel">
            <h4 class="panel-subtitle">⚡ 全服跨系統戰術打擊軍械</h4>
            <div class="tactical-btn-deck">
              <!-- Action 1: Orbital Strike -->
              <button
                class="tactical-btn orbital"
                :disabled="player.orbitalStrikeCooldown > 0 || !isCombatActive"
                @click="callOrbitalStrike"
              >
                <div class="btn-main">
                  <span class="btn-icon">🚀</span>
                  <div class="btn-text">
                    <span class="t-name">旗艦軌道光矛轟炸</span>
                    <span class="t-desc">造成 3,600 巨額打擊</span>
                  </div>
                </div>
                <span v-if="player.orbitalStrikeCooldown > 0" class="cd-tag">
                  {{ player.orbitalStrikeCooldown.toFixed(1) }}s
                </span>
              </button>

              <!-- Action 2: Titan Breaker Drill -->
              <button
                class="tactical-btn drill"
                :disabled="player.titanBreakerCooldown > 0 || !isCombatActive"
                @click="deployTitanBreaker"
              >
                <div class="btn-main">
                  <span class="btn-icon">🦾</span>
                  <div class="btn-text">
                    <span class="t-name">外骨骼超導破甲鑽</span>
                    <span class="t-desc">造成 1,800 貫穿傷害</span>
                  </div>
                </div>
                <span v-if="player.titanBreakerCooldown > 0" class="cd-tag">
                  {{ player.titanBreakerCooldown.toFixed(1) }}s
                </span>
              </button>

              <!-- Action 3: Quantum Trap -->
              <button
                class="tactical-btn trap"
                :disabled="player.quantumTrapCooldown > 0 || !isCombatActive"
                @click="triggerQuantumTrap"
              >
                <div class="btn-main">
                  <span class="btn-icon">🕳️</span>
                  <div class="btn-text">
                    <span class="t-name">量子信標重力坍縮陷阱</span>
                    <span class="t-desc">強制定身癱瘓巨神 4.5s</span>
                  </div>
                </div>
                <span v-if="player.quantumTrapCooldown > 0" class="cd-tag">
                  {{ player.quantumTrapCooldown.toFixed(1) }}s
                </span>
              </button>

              <!-- Action 4: Defensive Rally Aura -->
              <button
                class="tactical-btn aura"
                :disabled="player.rallyAuraCooldown > 0 || !isCombatActive"
                @click="rallyDefensiveAura"
              >
                <div class="btn-main">
                  <span class="btn-icon">🛡️</span>
                  <div class="btn-text">
                    <span class="t-name">全服戰術防護同調力場</span>
                    <span class="t-desc">護盾 +850，艦體 +450</span>
                  </div>
                </div>
                <span v-if="player.rallyAuraCooldown > 0" class="cd-tag">
                  {{ player.rallyAuraCooldown.toFixed(1) }}s
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Combat Event Log -->
        <div class="logs-panel glass-panel">
          <div class="logs-header">
            <span>📡 實時全服戰術廣播日誌 (Real-time Combat Log)</span>
            <span class="log-hint">自動同步最新 15 筆戰報</span>
          </div>
          <div class="logs-body">
            <div
              v-for="(log, idx) in player.combatLogs.slice(0, 15)"
              :key="idx"
              class="log-line"
              :class="{ 'first-log': idx === 0 }"
            >
              {{ log }}
            </div>
          </div>
        </div>

        <!-- Footer Control Buttons -->
        <div class="modal-footer">
          <button
            v-if="!isCombatActive"
            class="action-btn summon-btn"
            @click="summonTitan"
          >
            🔥 召喚世界首領泰坦入侵 (Summon Titan)
          </button>
          <button
            v-else
            class="action-btn retreat-btn"
            @click="abortInvasion"
          >
            ❌ 戰術撤離脫離戰場 (Tactical Retreat)
          </button>

          <button
            v-if="boss.phase === 'victory' || boss.phase === 'defeat'"
            class="action-btn reset-btn"
            @click="resetBoss"
          >
            🔄 重置時空偵測信標
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { worldTitanInvasion } from '../engine/worldTitanInvasion'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)
let timerInterval: number | null = null

onMounted(() => {
  timerInterval = window.setInterval(() => {
    refreshTrigger.value += 1
  }, 100)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
})

const boss = computed(() => {
  void refreshTrigger.value
  return worldTitanInvasion.boss
})

const player = computed(() => {
  void refreshTrigger.value
  return worldTitanInvasion.player
})

const isCombatActive = computed(() => {
  void refreshTrigger.value
  return worldTitanInvasion.isCombatActive()
})

const bossPhaseClass = computed(() => {
  return `phase-${boss.value.phase}`
})

function close(): void {
  ui.closeOverlay()
}

function summonTitan(): void {
  worldTitanInvasion.summonTitanInvasion()
  refreshTrigger.value += 1
}

function abortInvasion(): void {
  worldTitanInvasion.abortInvasion()
  refreshTrigger.value += 1
}

function resetBoss(): void {
  worldTitanInvasion.resetToDormant()
  refreshTrigger.value += 1
}

function callOrbitalStrike(): void {
  worldTitanInvasion.callOrbitalStrike()
  refreshTrigger.value += 1
}

function deployTitanBreaker(): void {
  worldTitanInvasion.deployTitanBreaker()
  refreshTrigger.value += 1
}

function triggerQuantumTrap(): void {
  worldTitanInvasion.triggerQuantumTrap()
  refreshTrigger.value += 1
}

function rallyDefensiveAura(): void {
  worldTitanInvasion.rallyDefensiveAura()
  refreshTrigger.value += 1
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.titan-modal {
  width: 900px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(14, 18, 28, 0.94);
  border: 1px solid rgba(255, 60, 60, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(255, 40, 40, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(22, 28, 44, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 60, 60, 0.3);
  background: rgba(255, 40, 40, 0.08);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title h2 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ff5252;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff5252;
}

.titan-content {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Boss Card */
.boss-card {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 70, 70, 0.35);
  background: rgba(30, 16, 22, 0.6);
}

.boss-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.boss-identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.boss-badge {
  font-size: 0.72rem;
  color: #ff9100;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.boss-name {
  font-size: 1.25rem;
  color: #ff4d4d;
  margin: 0;
}

.boss-phase-badge {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.boss-phase-badge.phase_1_dark_veil {
  border-color: #00e5ff;
  color: #00e5ff;
}

.boss-phase-badge.phase_2_antimatter_storm {
  border-color: #ff9100;
  color: #ff9100;
}

.boss-phase-badge.phase_3_temporal_collapse {
  border-color: #ff1744;
  color: #ff1744;
  animation: pulse 1s infinite alternate;
}

.boss-phase-badge.victory {
  border-color: #00ff88;
  color: #00ff88;
}

.status-alert {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.stun-pulse {
  background: rgba(0, 229, 255, 0.2);
  border: 1px solid #00e5ff;
  color: #00e5ff;
  animation: pulse 0.8s infinite alternate;
}

.enrage-pulse {
  background: rgba(255, 23, 68, 0.25);
  border: 1px solid #ff1744;
  color: #ff5252;
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

.gauge-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gauge-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gauge-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #9ab;
}

.progress-track {
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hp-track {
  height: 14px;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.boss-hp-fill {
  background: linear-gradient(90deg, #ff1744, #ff5252, #ff8a80);
  box-shadow: 0 0 10px rgba(255, 23, 68, 0.5);
}

.shield-fill {
  background: linear-gradient(90deg, #00b0ff, #00e5ff);
}

.tendrils-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 145, 0, 0.3);
}

.tendril-label {
  color: #ff9100;
}

.tendril-icons {
  display: flex;
  gap: 6px;
}

.tendril-dot {
  font-size: 1rem;
  opacity: 0.2;
  transition: opacity 0.3s;
}

.tendril-dot.active {
  opacity: 1;
  color: #ffea00;
  text-shadow: 0 0 6px #ffea00;
}

.tendril-count {
  margin-left: auto;
  font-size: 0.78rem;
  color: #ccc;
}

/* Combat Grid */
.combat-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .combat-grid {
    grid-template-columns: 1fr;
  }
}

.player-panel, .actions-panel {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-subtitle {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #00e5ff;
}

.player-hull-fill {
  background: linear-gradient(90deg, #00c853, #69f0ae);
}

.player-shield-fill {
  background: linear-gradient(90deg, #2979ff, #40c4ff);
}

.stats-counter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 4px;
}

.counter-box {
  background: rgba(0, 0, 0, 0.35);
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.cnt-label {
  font-size: 0.7rem;
  color: #889;
}

.cnt-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.cnt-val.highlight {
  color: #ff9100;
}

.cnt-val.mythic {
  color: #bd00ff;
  text-shadow: 0 0 6px rgba(189, 0, 255, 0.5);
}

/* Tactical Actions */
.tactical-btn-deck {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tactical-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(18, 24, 38, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #e0e6ed;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.tactical-btn:hover:not(:disabled) {
  border-color: #00e5ff;
  background: rgba(0, 229, 255, 0.12);
  transform: translateY(-1px);
}

.tactical-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.t-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
}

.t-desc {
  font-size: 0.7rem;
  color: #889;
}

.cd-tag {
  font-size: 0.82rem;
  font-weight: 700;
  color: #ff5252;
  background: rgba(255, 82, 82, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Logs Panel */
.logs-panel {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(10, 14, 22, 0.85);
}

.logs-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #00e5ff;
  font-weight: 600;
}

.log-hint {
  font-size: 0.7rem;
  color: #667;
}

.logs-body {
  max-height: 120px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.78rem;
}

.log-line {
  color: #aaa;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.log-line.first-log {
  color: #00ff88;
  font-weight: 600;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.action-btn {
  padding: 8px 18px;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.summon-btn {
  background: linear-gradient(135deg, #d50000, #ff5252);
  color: #fff;
  border-color: #ff8a80;
  box-shadow: 0 0 12px rgba(255, 23, 68, 0.4);
}

.summon-btn:hover {
  background: linear-gradient(135deg, #ff1744, #ff8a80);
  transform: translateY(-1px);
}

.retreat-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ff5252;
  border-color: #ff5252;
}

.retreat-btn:hover {
  background: rgba(255, 82, 82, 0.2);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #00e5ff;
  border-color: rgba(0, 229, 255, 0.4);
}

.reset-btn:hover {
  background: rgba(0, 229, 255, 0.15);
}
</style>
