<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="council-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🏛️</span>
          <h2>星際外交聯盟與銀河議會 (Interstellar Galactic Council)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="council-content">
        <!-- Telemetry Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">🗳️</span>
            <div>
              <span class="t-label">開拓者代表表決權:</span>
              <span class="t-val highlight">{{ stats.playerDelegateWeight }} 票 (佔比 {{ ((stats.playerDelegateWeight / stats.totalCouncilSeats) * 100).toFixed(1) }}%)</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🎖️</span>
            <div>
              <span class="t-label">外交特使頭銜:</span>
              <span class="t-val">{{ stats.currentDiplomaticStanding }}</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">📜</span>
            <div>
              <span class="t-label">已生效全銀河法案:</span>
              <span class="t-val pass-val">{{ stats.passedResolutionsCount }} 部憲章</span>
            </div>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">⚖️</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- 4 Diplomatic Factions Grid -->
        <div class="factions-section">
          <h3 class="section-title">🤝 銀河四大政治陣營 (Diplomatic Blocs)</h3>
          <div class="factions-grid">
            <div
              v-for="fac in factionsList"
              :key="fac.id"
              class="faction-card glass-panel"
              :style="{ borderColor: fac.color }"
            >
              <div class="fac-top">
                <span class="fac-name" :style="{ color: fac.color }">{{ fac.name }}</span>
                <span class="fac-seats">{{ fac.delegateSeats }} 席</span>
              </div>
              <p class="fac-leader">👤 代表: {{ fac.leaderName }}</p>
              <p class="fac-ideology">💡 理念: {{ fac.ideology }}</p>

              <div class="rep-bar-wrap">
                <div class="rep-label">
                  <span>外交聲望:</span>
                  <span>{{ fac.standingReputation }} / 100</span>
                </div>
                <div class="rep-track">
                  <div
                    class="rep-fill"
                    :style="{ width: `${Math.max(0, fac.standingReputation)}%`, background: fac.color }"
                  ></div>
                </div>
              </div>

              <button
                class="reconcile-btn"
                @click="improveRep(fac.id)"
              >
                🤝 外交斡旋與注資 (+10 聲望 / +5 票)
              </button>
            </div>
          </div>
        </div>

        <!-- Legislative Resolutions Chamber -->
        <div class="resolutions-section">
          <h3 class="section-title">📜 銀河議會全體審議法案 (Legislative Resolutions)</h3>
          <div class="resolutions-list">
            <div
              v-for="res in resolutionsList"
              :key="res.id"
              class="resolution-card glass-panel"
              :class="res.status"
            >
              <div class="res-top">
                <div class="res-title-block">
                  <h4 class="res-title">{{ res.title }}</h4>
                  <span class="res-sponsor">提案方: {{ factions[res.sponsorFaction]?.name }}</span>
                </div>
                <div class="res-status-badge" :class="res.status">
                  <span v-if="res.status === 'passed_active'">✓ 法案已生效 (Active)</span>
                  <span v-else-if="res.status === 'voting_active'">⏳ 辯論審議中 (Voting)</span>
                  <span v-else-if="res.status === 'rejected'">✕ 遭議會否決 (Rejected)</span>
                </div>
              </div>

              <p class="res-desc">{{ res.description }}</p>
              <div class="res-buff">
                <span>🌟 憲章全服增益: <strong>{{ res.effectBuff }}</strong></span>
              </div>

              <!-- Vote Progress Bar -->
              <div class="votes-progress-bar">
                <div class="vote-label">
                  <span class="aye-text">贊成: {{ res.ayeVotes }} 票</span>
                  <span class="nay-text">反對: {{ res.nayVotes }} 票 (法定門檻 501 票)</span>
                </div>
                <div class="vote-track">
                  <div
                    class="aye-fill"
                    :style="{ width: `${(res.ayeVotes / 1000) * 100}%` }"
                  ></div>
                  <div
                    class="nay-fill"
                    :style="{ width: `${(res.nayVotes / 1000) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Voting Action Deck -->
              <div v-if="res.status === 'voting_active'" class="voting-actions">
                <button
                  class="vote-btn aye"
                  :disabled="res.playerVote !== 'none'"
                  @click="vote(res.id, 'aye')"
                >
                  👍 投贊成票 (Aye +{{ stats.playerDelegateWeight }})
                </button>
                <button
                  class="vote-btn nay"
                  :disabled="res.playerVote !== 'none'"
                  @click="vote(res.id, 'nay')"
                >
                  👎 投否決票 (Nay +{{ stats.playerDelegateWeight }})
                </button>
                <span v-if="res.playerVote !== 'none'" class="voted-tag">
                  您已投下 {{ res.playerVote === 'aye' ? '贊成' : '否決' }} 票
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  FactionId,
  galacticCouncil
} from '../engine/galacticCouncil'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)

const stats = computed(() => {
  void refreshTrigger.value
  return galacticCouncil.stats
})

const factions = computed(() => {
  void refreshTrigger.value
  return galacticCouncil.factions
})

const factionsList = computed(() => {
  void refreshTrigger.value
  return Object.values(galacticCouncil.factions)
})

const resolutionsList = computed(() => {
  void refreshTrigger.value
  return galacticCouncil.resolutions
})

function close(): void {
  ui.closeOverlay()
}

function vote(resId: string, choice: 'aye' | 'nay'): void {
  galacticCouncil.castVote(resId, choice)
  refreshTrigger.value += 1
}

function improveRep(factionId: FactionId): void {
  galacticCouncil.improveReputation(factionId, 10)
  refreshTrigger.value += 1
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
  padding: 16px;
}

.council-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(14, 18, 30, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(255, 215, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(22, 28, 48, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.25);
  background: rgba(255, 215, 0, 0.06);
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
  color: #ffd700;
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
  color: #ffd700;
}

.council-content {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Telemetry Bar */
.telemetry-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.tele-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-icon {
  font-size: 1.3rem;
}

.t-label {
  font-size: 0.76rem;
  color: #889;
  display: block;
}

.t-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #00e5ff;
}

.pass-val {
  color: #00ff88;
}

/* Status Banner */
.status-banner {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.25);
  font-size: 0.82rem;
  color: #fff8e1;
}

/* Section Title */
.section-title {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

/* Factions Grid */
.factions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .factions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.faction-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(18, 24, 40, 0.7);
}

.fac-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fac-name {
  font-size: 0.8rem;
  font-weight: 700;
}

.fac-seats {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9ab;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
}

.fac-leader {
  margin: 0;
  font-size: 0.72rem;
  color: #ccd;
}

.fac-ideology {
  margin: 0;
  font-size: 0.7rem;
  color: #889;
  line-height: 1.3;
  min-height: 36px;
}

.rep-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
}

.rep-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #889;
}

.rep-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}

.rep-fill {
  height: 100%;
  transition: width 0.3s;
}

.reconcile-btn {
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 5px;
  font-size: 0.72rem;
  color: #ccd;
  cursor: pointer;
  transition: all 0.2s;
}

.reconcile-btn:hover {
  background: rgba(255, 215, 0, 0.15);
  border-color: #ffd700;
  color: #ffd700;
}

/* Resolutions List */
.resolutions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resolution-card {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(18, 22, 36, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.resolution-card.passed_active {
  border-color: rgba(0, 255, 136, 0.35);
  background: rgba(0, 255, 136, 0.05);
}

.res-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.res-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.res-title {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #fff;
}

.res-sponsor {
  font-size: 0.7rem;
  color: #889;
}

.res-status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.res-status-badge.passed_active {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid #00ff88;
}

.res-status-badge.voting_active {
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
  border: 1px solid #00e5ff;
}

.res-status-badge.rejected {
  background: rgba(255, 23, 68, 0.15);
  color: #ff5252;
  border: 1px solid #ff1744;
}

.res-desc {
  margin: 0;
  font-size: 0.78rem;
  color: #ccd;
  line-height: 1.35;
}

.res-buff {
  font-size: 0.74rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
}

/* Vote Progress Bar */
.votes-progress-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vote-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
}

.aye-text { color: #00ff88; }
.nay-text { color: #ff5252; }

.vote-track {
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}

.aye-fill {
  background: linear-gradient(90deg, #00c853, #69f0ae);
  height: 100%;
}

.nay-fill {
  background: linear-gradient(90deg, #d50000, #ff5252);
  height: 100%;
  margin-left: auto;
}

.voting-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.vote-btn {
  padding: 6px 14px;
  border-radius: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.vote-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.vote-btn.aye {
  background: rgba(0, 255, 136, 0.15);
  border-color: #00ff88;
  color: #00ff88;
}

.vote-btn.aye:hover:not(:disabled) {
  background: #00ff88;
  color: #06101c;
}

.vote-btn.nay {
  background: rgba(255, 82, 82, 0.15);
  border-color: #ff5252;
  color: #ff5252;
}

.vote-btn.nay:hover:not(:disabled) {
  background: #ff5252;
  color: #fff;
}

.voted-tag {
  font-size: 0.72rem;
  color: #889;
}
</style>
