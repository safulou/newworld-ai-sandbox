<template>
  <div class="lb-overlay" @click.self="close">
    <div class="lb-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🏆</span>
          <div>
            <h2>全息幽靈競速與非同步電競天梯 (Ghost Replay & Leaderboard)</h2>
            <p class="subtitle">50ms 高頻遙測重放、全息幽靈並行競速與跨界挑戰碼</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Ghost Replay Status Box -->
      <div class="ghost-status-card">
        <div class="g-info">
          <span class="g-title">👻 個人最佳全息幽靈 (Active Personal Ghost)</span>
          <span class="g-desc">
            {{ activeGhost ? `已裝載：${activeGhost.playerName} (${formatTime(activeGhost.totalTimeMs)}) [${activeGhost.frames.length} 幀遙測]` : '尚未錄製個人幽靈。請前往跑酷賽道展開挑戰！' }}
          </span>
        </div>
        <div class="g-actions">
          <button
            v-if="activeGhost"
            :class="['ghost-btn', { playing: isPlayingGhost }]"
            @click="toggleGhostPlayback"
          >
            {{ isPlayingGhost ? '⏹️ 停止幽靈' : '▶️ 伴隨幽靈起跑' }}
          </button>
          <button v-if="activeGhost" class="code-btn" @click="copyChallengeCode">
            📋 複製挑戰碼
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['cat-tab', { active: currentCategory === cat.id }]"
          @click="currentCategory = cat.id"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Leaderboard Table -->
      <div class="table-container">
        <table class="lb-table">
          <thead>
            <tr>
              <th width="70">排名</th>
              <th>開拓者 (Pioneer)</th>
              <th>最速成績 / 數值</th>
              <th>挑戰識別碼</th>
              <th width="100">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredEntries" :key="entry.id" :class="{ 'top-three': entry.rank <= 3 }">
              <td>
                <span :class="['rank-badge', `rank-${entry.rank}`]">{{ entry.rank }}</span>
              </td>
              <td class="player-name">{{ entry.playerName }}</td>
              <td class="score-val">{{ entry.scoreText }}</td>
              <td class="challenge-code">{{ entry.challengeCode }}</td>
              <td>
                <button class="race-btn" @click="raceGhost(entry)">對決幽靈</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { ghostReplay, LeaderboardEntry } from '@/engine/ghostReplay'

const uiStore = useUIStore()

const activeGhost = ref(ghostReplay.activeGhost)
const isPlayingGhost = ref(ghostReplay.isPlayingGhost)
const currentCategory = ref<string>('skyline_sprint')

const categories = [
  { id: 'skyline_sprint', name: '天際線跑酷最速榜', icon: '🏁' },
  { id: 'inversion_gauntlet', name: '重力迴廊挑戰榜', icon: '🧲' },
  { id: 'crystal_dragon', name: '海龍皇垂釣重量榜', icon: '🐉' },
  { id: 'boss_speedrun', name: '守護者 Boss 討伐榜', icon: '⚔️' },
]

const filteredEntries = computed(() => {
  return ghostReplay.leaderboards.filter(l => l.category === currentCategory.value)
})

function close() {
  uiStore.mode = 'game'
}

function toggleGhostPlayback() {
  if (isPlayingGhost.value) {
    ghostReplay.stopGhostPlayback()
  } else {
    ghostReplay.startGhostPlayback()
  }
  isPlayingGhost.value = ghostReplay.isPlayingGhost
}

function copyChallengeCode() {
  if (!activeGhost.value) return
  const code = ghostReplay.exportChallengeCode(activeGhost.value)
  navigator.clipboard?.writeText(code)
  uiStore.setBuildStatus('📋 已成功將全息挑戰碼複製至剪貼簿！')
  setTimeout(() => uiStore.setBuildStatus(''), 2000)
}

function raceGhost(entry: LeaderboardEntry) {
  uiStore.setBuildStatus(`⚔️ 已載入開拓者 ${entry.playerName} 的全息幽靈賽道！準備競速！`)
  setTimeout(() => uiStore.setBuildStatus(''), 2500)
}

function formatTime(ms: number): string {
  return ghostReplay.formatTime(ms)
}
</script>

<style scoped>
.lb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lb-modal {
  width: 880px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
  border-radius: 12px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  padding-bottom: 14px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00f0ff;
  margin: 0;
}

.subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.ghost-status-card {
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.g-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #00f0ff;
  display: block;
}

.g-desc {
  font-size: 0.78rem;
  color: #94a3b8;
}

.g-actions {
  display: flex;
  gap: 8px;
}

.ghost-btn {
  background: #00f0ff;
  border: none;
  color: #040810;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.82rem;
  cursor: pointer;
}

.ghost-btn.playing {
  background: #ff007f;
  color: #fff;
}

.code-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.82rem;
  cursor: pointer;
}

.category-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.cat-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.cat-tab.active {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
}

.table-container {
  max-height: 240px;
  overflow-y: auto;
}

.lb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.lb-table th {
  text-align: left;
  padding: 10px;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.78rem;
}

.lb-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 700;
  font-size: 0.8rem;
}

.rank-1 { background: #ffe600; color: #040810; }
.rank-2 { background: #cbd5e1; color: #040810; }
.rank-3 { background: #cd7f32; color: #fff; }

.player-name {
  font-weight: 600;
  color: #f1f5f9;
}

.score-val {
  color: #00f0ff;
  font-weight: 700;
  font-family: monospace;
}

.challenge-code {
  color: #64748b;
  font-family: monospace;
  font-size: 0.75rem;
}

.race-btn {
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}
</style>
