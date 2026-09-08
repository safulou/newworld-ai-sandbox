<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <div class="title-wrap">
          <h2>📜 元宇宙任務手冊 (Quest Log)</h2>
          <span class="badge">{{ activeCount }} 進行中</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="quests-list">
        <div
          v-for="q in questList"
          :key="q.id"
          :class="['quest-card', { completed: q.completed }]"
        >
          <div class="quest-header">
            <div class="quest-title-row">
              <span class="quest-title">{{ q.title }}</span>
              <span class="giver-tag">{{ q.giverName }} ({{ q.giverRole }})</span>
            </div>
            <span class="status-badge">{{ q.completed ? '✅ 已完成' : '⏳ 進行中' }}</span>
          </div>

          <p class="quest-desc">{{ q.description }}</p>

          <div class="steps-list">
            <div
              v-for="s in q.steps"
              :key="s.id"
              class="step-item"
            >
              <span class="step-check">{{ s.completed ? '☑️' : '◻️' }}</span>
              <span class="step-desc">{{ s.description }}</span>
              <span class="step-progress">{{ s.currentCount }} / {{ s.targetCount }}</span>
            </div>
          </div>

          <div class="reward-row">
            <span class="reward-label">🎁 任務獎勵：</span>
            <span class="reward-text">{{ q.rewardDescription }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { questEngine } from '@/engine/quests'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const questList = ref(questEngine.getAll())

const activeCount = computed(() => questList.value.filter(q => !q.completed).length)

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
  width: 680px;
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

.quests-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 6px;
}

.quest-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quest-card.completed {
  border-color: rgba(0, 255, 136, 0.3);
  background: rgba(0, 255, 136, 0.03);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quest-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quest-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.giver-tag {
  font-size: 0.75rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: #00ffff;
}

.quest-desc {
  font-size: 0.85rem;
  color: #aaa;
  line-height: 1.4;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 6px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #ddd;
}

.step-progress {
  margin-left: auto;
  color: #00ffff;
  font-weight: 600;
}

.reward-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 8px;
}

.reward-label {
  color: #ffd700;
  font-weight: 600;
}

.reward-text {
  color: #fff;
}
</style>
