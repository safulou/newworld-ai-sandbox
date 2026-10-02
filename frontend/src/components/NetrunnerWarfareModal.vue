<template>
  <div class="overlay" @click.self="close">
    <div class="warfare-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🛡️</span>
          <h2>賽博黑客領地防衛與網絡潛入 (Netrunner Subnet Warfare)</h2>
        </div>
        <div class="header-right">
          <div class="mode-tabs">
            <button
              class="tab-btn"
              :class="{ active: currentTab === 'defense' }"
              @click="currentTab = 'defense'"
            >
              🛡️ 子網核心防衛
            </button>
            <button
              class="tab-btn"
              :class="{ active: currentTab === 'raid' }"
              @click="currentTab = 'raid'"
            >
              ⚔️ 節點滲透入侵
            </button>
          </div>
          <button class="close-btn" @click="close">✕</button>
        </div>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <!-- TAB 1: SUBSET DEFENSE MODE -->
        <div v-if="currentTab === 'defense'" class="defense-layout">
          <!-- Left: Subnet Core Status -->
          <div class="col-core card-box">
            <div class="subhead">
              <span>🖥️ 領地子網伺服器核心</span>
              <span class="online-tag">🟢 在線監聽</span>
            </div>
            <div class="core-summary">
              <div class="core-title">{{ warfare.mySubnet.name }}</div>
              <div class="core-meta">擁有者: <strong>{{ warfare.mySubnet.owner }}</strong></div>
              
              <div class="stat-row">
                <span>防火牆完整度</span>
                <strong>{{ warfare.mySubnet.firewallHealth }}%</strong>
              </div>
              <div class="meter-track">
                <div class="meter-fill hp-fill" :style="{ width: warfare.mySubnet.firewallHealth + '%' }"></div>
              </div>

              <div class="vault-info">
                <div class="vault-card">
                  <span class="v-label">💰 保險庫信用點</span>
                  <span class="v-val">{{ warfare.mySubnet.vaultCredits.toLocaleString() }} 點</span>
                </div>
                <div class="vault-card">
                  <span class="v-label">📜 機密科技藍圖</span>
                  <span class="v-val">{{ warfare.mySubnet.techBlueprints }} 份</span>
                </div>
              </div>

              <div class="countermeasures">
                <div class="subhead" style="margin-top: 10px;">
                  <span>⚡ 應急反制指令</span>
                </div>
                <button class="cmd-btn emp-btn" @click="triggerEmp">
                  ⚡ 激發全域 EMP 脈衝 (-200 點)
                </button>
                <button class="cmd-btn flush-btn" @click="flushIce">
                  🔄 重洗 ICE 防護節點
                </button>
              </div>
            </div>
          </div>

          <!-- Right: ICE Slots Defense Grid -->
          <div class="col-ice card-box">
            <div class="subhead">
              <span>🧱 部署中 ICE (Intrusion Countermeasure Electronics) 矩陣</span>
              <span class="tag-badge">4 槽位</span>
            </div>

            <div class="ice-grid">
              <div
                v-for="ice in warfare.mySubnet.iceSlots"
                :key="ice.id"
                class="ice-card"
                :class="ice.type"
              >
                <div class="ice-header">
                  <span class="ice-type-badge">{{ ice.type.toUpperCase() }}</span>
                  <span class="ice-name">{{ ice.name }}</span>
                  <span class="ice-level">Lv.{{ ice.level }}</span>
                </div>
                <div class="ice-desc">{{ ice.description }}</div>
                <div class="ice-specs">
                  <span>生命: {{ ice.health }}/{{ ice.maxHealth }}</span>
                  <span v-if="ice.damagePerSec > 0">反衝: {{ ice.damagePerSec }} DPS</span>
                  <span>追蹤倍率: +{{ ice.traceRateBonus.toFixed(1) }}x</span>
                </div>
                <button class="btn-upgrade" @click="upgradeIce(ice.id)">
                  ⬆️ 升級 ({{ ice.level * 800 }} 點)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: INFILTRATION RAID MODE -->
        <div v-else class="raid-layout">
          <!-- Col 1: Target Nodes Selection -->
          <div class="col-targets card-box">
            <div class="subhead">
              <span>🎯 企業與叛軍子網節點</span>
            </div>
            <div class="targets-list">
              <div
                v-for="target in warfare.targets"
                :key="target.id"
                class="target-card"
                :class="{
                  active: warfare.stats.activeTargetId === target.id,
                  compromised: target.isCompromised
                }"
                @click="selectRaidTarget(target.id)"
              >
                <div class="target-head">
                  <span class="t-name">{{ target.name }}</span>
                  <span class="t-diff" :class="target.difficulty.toLowerCase()">{{ target.difficulty }}</span>
                </div>
                <div class="t-corp">{{ target.corp }}</div>
                <div class="t-desc">{{ target.description }}</div>
                <div class="t-foot">
                  <span>💰 懸賞: {{ target.lootCredits.toLocaleString() }} 點</span>
                  <span v-if="target.isCompromised" class="comp-badge">已攻破</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Col 2: Active Cyber Breach Arena -->
          <div class="col-breach card-box">
            <div class="subhead">
              <span>💻 矩陣代碼攻堅競技場</span>
              <span v-if="warfare.stats.isDumped" class="dumped-badge">🚨 神經鎖定中 ({{ Math.ceil(warfare.stats.lockoutRemaining) }}s)</span>
              <span v-else-if="warfare.stats.inRaid" class="live-badge">🔴 滲透中</span>
              <span v-else class="idle-badge">⚪ 離線</span>
            </div>

            <!-- Dual Progress Race Visualizer -->
            <div class="race-container">
              <div class="race-lane">
                <div class="lane-label">
                  <span>🔓 滲透破解進度 (Breach Progress)</span>
                  <strong>{{ warfare.stats.raidProgress.toFixed(1) }}%</strong>
                </div>
                <div class="meter-track">
                  <div class="meter-fill breach-fill" :style="{ width: warfare.stats.raidProgress + '%' }"></div>
                </div>
              </div>

              <div class="race-lane">
                <div class="lane-label">
                  <span>🚨 目標反向追蹤 (Trace Route)</span>
                  <strong :class="{ danger: warfare.stats.traceProgress > 75 }">{{ warfare.stats.traceProgress.toFixed(1) }}%</strong>
                </div>
                <div class="meter-track">
                  <div class="meter-fill trace-fill" :style="{ width: warfare.stats.traceProgress + '%' }"></div>
                </div>
              </div>

              <div class="race-lane">
                <div class="lane-label">
                  <span>🧠 神經接口完整度 (Neural Integrity)</span>
                  <strong>{{ warfare.stats.attackerHealth.toFixed(1) }}%</strong>
                </div>
                <div class="meter-track">
                  <div class="meter-fill health-fill" :style="{ width: warfare.stats.attackerHealth + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Infiltration Commands -->
            <div class="commands-panel">
              <div v-if="!warfare.stats.inRaid" class="start-btn-area">
                <button
                  class="btn-start-raid"
                  :disabled="!warfare.stats.activeTargetId || warfare.stats.isDumped"
                  @click="startRaid"
                >
                  🚀 連線並發起代碼滲透 (Jack In)
                </button>
              </div>
              <div v-else class="action-grid">
                <button class="act-btn" @click="warfare.executeBruteForce()">
                  🔨 暴力破解 (+15% 破解 / +10% 追蹤)
                </button>
                <button class="act-btn" @click="warfare.executePacketSpoof()">
                  🎭 注入偽裝封包 (-15% 追蹤 / +4% 破解)
                </button>
                <button class="act-btn" @click="warfare.executeLogicBomb()">
                  💣 邏輯死鎖炸彈 (+22% 破解 / +16% 追蹤)
                </button>
                <button class="act-btn" @click="warfare.executeZeroDay()">
                  ⚡ 部署零日漏洞 (+32% 破解 / +24% 追蹤)
                </button>
                <button class="act-btn abort-btn" @click="warfare.abortRaid()">
                  🛑 緊急斷線撤離 (Abort)
                </button>
              </div>
            </div>

            <!-- Terminal Logs -->
            <div class="terminal-logs">
              <div v-for="(log, idx) in warfare.logs" :key="idx" class="log-line">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { netrunnerWarfare } from '@/engine/netrunnerWarfare'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const warfare = netrunnerWarfare
const currentTab = ref<'defense' | 'raid'>('defense')

function close(): void {
  ui.closeOverlay()
}

function triggerEmp(): void {
  warfare.triggerEmpDefense()
}

function flushIce(): void {
  warfare.flushIceNodes()
}

function upgradeIce(id: string): void {
  warfare.upgradeIce(id)
}

function selectRaidTarget(id: string): void {
  if (warfare.stats.inRaid) return
  warfare.stats.activeTargetId = id
}

function startRaid(): void {
  if (!warfare.stats.activeTargetId) return
  warfare.startRaid(warfare.stats.activeTargetId)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 16, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.warfare-panel {
  width: 95vw;
  max-width: 1200px;
  height: 88vh;
  max-height: 800px;
  background: linear-gradient(135deg, rgba(8, 14, 28, 0.96), rgba(18, 26, 48, 0.96));
  border: 1px solid rgba(0, 255, 200, 0.35);
  box-shadow: 0 0 35px rgba(0, 255, 200, 0.2);
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mode-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #a0c0e0;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}
.tab-btn.active {
  background: rgba(0, 255, 200, 0.2);
  border-color: #00ffcc;
  color: #00ffcc;
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
  flex: 1;
  padding: 16px;
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
  margin-bottom: 12px;
}

.online-tag {
  color: #00ff88;
  font-size: 0.75rem;
}

/* Defense Layout */
.defense-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  height: 100%;
}

.core-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.core-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #00ffcc;
}

.core-meta {
  font-size: 0.85rem;
  color: #88aacc;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.meter-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: width 0.2s ease;
}
.hp-fill { background: linear-gradient(90deg, #ff0055, #00ffcc); }
.breach-fill { background: linear-gradient(90deg, #00ffff, #00ff88); }
.trace-fill { background: linear-gradient(90deg, #ffaa00, #ff0055); }
.health-fill { background: #00ffcc; }

.vault-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;
}

.vault-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.v-label {
  font-size: 0.7rem;
  color: #88aacc;
}

.v-val {
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
}

.countermeasures {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.cmd-btn {
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
}
.emp-btn { background: rgba(255, 170, 0, 0.25); border: 1px solid #ffaa00; color: #ffaa00; }
.emp-btn:hover { background: rgba(255, 170, 0, 0.4); }
.flush-btn { background: rgba(0, 255, 200, 0.2); border: 1px solid #00ffcc; color: #00ffcc; }
.flush-btn:hover { background: rgba(0, 255, 200, 0.35); }

/* ICE Slots */
.ice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
}

.ice-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.ice-card.white { border-left: 4px solid #ffffff; }
.ice-card.tar { border-left: 4px solid #ffaa00; }
.ice-card.black { border-left: 4px solid #ff0055; }
.ice-card.quantum { border-left: 4px solid #00ffff; }

.ice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ice-type-badge {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.ice-name {
  font-weight: bold;
  font-size: 0.95rem;
  color: #fff;
}

.ice-level {
  color: #00ffcc;
  font-weight: bold;
}

.ice-desc {
  font-size: 0.8rem;
  color: #a0c0e0;
  margin: 6px 0;
}

.ice-specs {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.75rem;
  color: #77aacc;
  margin-bottom: 8px;
}

.btn-upgrade {
  background: rgba(0, 255, 200, 0.15);
  border: 1px solid rgba(0, 255, 200, 0.4);
  color: #00ffcc;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}
.btn-upgrade:hover { background: rgba(0, 255, 200, 0.3); }

/* Raid Layout */
.raid-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  height: 100%;
}

.targets-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.target-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
}
.target-card:hover { border-color: rgba(0, 255, 200, 0.4); }
.target-card.active { border-color: #00ffcc; background: rgba(0, 255, 200, 0.12); }
.target-card.compromised { opacity: 0.6; }

.target-head {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.t-diff {
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 3px;
}
.t-diff.easy { background: #00ff88; color: #000; }
.t-diff.medium { background: #ffaa00; color: #000; }
.t-diff.hard { background: #ff5500; color: #fff; }
.t-diff.extreme { background: #aa00ff; color: #fff; }

.t-corp {
  font-size: 0.75rem;
  color: #00ffcc;
  margin: 2px 0;
}

.t-desc {
  font-size: 0.75rem;
  color: #a0c0e0;
  margin: 4px 0;
}

.t-foot {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #ffaa00;
}

.comp-badge {
  color: #00ff88;
  font-weight: bold;
}

/* Col Breach */
.col-breach {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.race-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.lane-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
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

.btn-start-raid {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #0088cc, #00ffcc);
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.4);
}
.btn-start-raid:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.act-btn {
  padding: 8px;
  background: rgba(0, 255, 200, 0.15);
  border: 1px solid rgba(0, 255, 200, 0.35);
  color: #e0f0ff;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
}
.act-btn:hover { background: rgba(0, 255, 200, 0.3); }

.abort-btn {
  grid-column: span 2;
  background: rgba(255, 0, 85, 0.2);
  border-color: #ff0055;
  color: #ff5588;
  text-align: center;
}

.terminal-logs {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 255, 200, 0.2);
  border-radius: 6px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #00ff88;
  overflow-y: auto;
  flex: 1;
}

.log-line {
  margin: 3px 0;
}
</style>
