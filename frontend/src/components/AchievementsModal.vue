<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <div class="title-wrap">
          <h2>🏆 元宇宙成就殿堂 (Achievements)</h2>
          <span class="badge">{{ unlockedCount }} / {{ totalCount }} 已解鎖</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Categories -->
      <div class="tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['tab', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Achievements Grid -->
      <div class="achievements-grid">
        <div
          v-for="ach in filteredAchievements"
          :key="ach.id"
          :class="['ach-card', { unlocked: ach.unlocked }]"
        >
          <div class="ach-icon">{{ ach.icon }}</div>
          <div class="ach-info">
            <div class="ach-top">
              <span class="ach-title">{{ ach.title }}</span>
              <span class="ach-status">{{ ach.unlocked ? '✅ 已解鎖' : '🔒 未解鎖' }}</span>
            </div>
            <p class="ach-desc">{{ ach.description }}</p>
            <div class="progress-bar-wrap">
              <div
                class="progress-bar-fill"
                :style="{ width: `${(ach.progress / ach.maxProgress) * 100}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ ach.progress }} / {{ ach.maxProgress }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { achievements } from '@/engine/achievements'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const allAchievements = ref(achievements.getAll())
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部成就' },
  { id: 'building', name: '🏗️ 建築工程' },
  { id: 'exploration', name: '🚀 探索冒險' },
  { id: 'scifi', name: '🤖 賽博科技' },
  { id: 'mastery', name: '👑 宗師榮耀' },
]

const totalCount = computed(() => allAchievements.value.length)
const unlockedCount = computed(() => allAchievements.value.filter(a => a.unlocked).length)

const filteredAchievements = computed(() => {
  if (activeCategory.value === 'all') return allAchievements.value
  return allAchievements.value.filter(a => a.category === activeCategory.value)
})

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 700px;
  max-height: 80vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap h2 {
  font-size: 1.3rem;
  color: #00ffff;
  font-weight: 700;
}

.badge {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.tab {
  background: none;
  border: none;
  color: #888;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab.active {
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 55vh;
  padding-right: 6px;
}

.ach-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  border-radius: 8px;
  opacity: 0.6;
  transition: all 0.2s;
}

.ach-card.unlocked {
  opacity: 1;
  border-color: rgba(0, 255, 255, 0.3);
  background: rgba(0, 255, 255, 0.05);
}

.ach-icon {
  font-size: 2rem;
}

.ach-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ach-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ach-title {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.ach-status {
  font-size: 0.75rem;
  color: #00ff88;
}

.ach-desc {
  font-size: 0.8rem;
  color: #888;
}

.progress-bar-wrap {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #00ff88);
}

.progress-text {
  font-size: 0.7rem;
  color: #666;
  text-align: right;
}
</style>
