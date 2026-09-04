<template>
  <div class="progress-overlay">
    <div class="progress-panel glass-panel">
      <h2>🤖 Agent Orchestrator</h2>
      <p class="subtitle">{{ data?.prompt || 'Initializing...' }}</p>

      <div class="metrics-grid">
        <div class="metric">
          <span class="label">STATUS</span>
          <span class="val" :class="data?.status || 'planning'">
            {{ formatStatus(data?.status) }}
          </span>
        </div>
        <div class="metric">
          <span class="label">TOKENS</span>
          <span class="val neon">{{ data?.tokens || '...' }}</span>
        </div>
        <div class="metric">
          <span class="label">EST TIME</span>
          <span class="val neon">{{ data?.estimatedMs ? Math.round(data.estimatedMs/1000) + 's' : '...' }}</span>
        </div>
      </div>

      <div class="progress-container" v-if="data?.blocksTotal">
        <div class="progress-labels">
          <span>Blocks Placed</span>
          <span>{{ data?.blocksPlaced || 0 }} / {{ data?.blocksTotal || 0 }}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
      
      <div v-if="data?.description" class="desc">
        {{ data.description }}
      </div>
      
      <div v-if="data?.message" class="error-msg">
        {{ data.message }}
      </div>

      <div class="actions">
        <button class="btn-close" v-if="isDone" @click="close">Continue Exploring</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const data = computed(() => ui.progressData)

const isDone = computed(() => data.value?.status === 'done' || data.value?.status === 'error')

const progressPercent = computed(() => {
  if (!data.value?.blocksTotal) return 0
  return ((data.value?.blocksPlaced || 0) / data.value.blocksTotal) * 100
})

function formatStatus(status?: string) {
  switch (status) {
    case 'planning': return 'Planning...'
    case 'building': return 'Constructing...'
    case 'done': return 'Complete'
    case 'error': return 'Error'
    default: return 'Initializing...'
  }
}

function close() {
  ui.closeOverlay()
}
</script>

<style scoped>
.progress-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  backdrop-filter: blur(5px);
}
.progress-panel {
  width: 500px; padding: 24px; display: flex; flex-direction: column; gap: 20px;
}
.glass-panel {
  background: rgba(15, 20, 30, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 255, 255, 0.15);
  color: white;
}
h2 { margin: 0; font-size: 24px; color: #fff; text-shadow: 0 0 10px rgba(0,255,255,0.5); }
.subtitle { margin: 0; color: #00ffff; font-style: italic; opacity: 0.8; }

.metrics-grid {
  display: flex; justify-content: space-between;
  background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;
}
.metric { display: flex; flex-direction: column; align-items: center; }
.label { font-size: 11px; opacity: 0.6; font-weight: bold; margin-bottom: 4px; }
.val { font-size: 16px; font-weight: bold; }
.val.neon { color: #00ffff; text-shadow: 0 0 8px rgba(0,255,255,0.4); }
.val.planning { color: #f39c12; }
.val.building { color: #3498db; }
.val.done { color: #2ecc71; }
.val.error { color: #e74c3c; }

.progress-container { display: flex; flex-direction: column; gap: 8px; }
.progress-labels { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; }
.progress-bar-bg { width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; }
.progress-bar-fill {
  height: 100%; background: linear-gradient(90deg, #00ffff, #0088ff);
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0,255,255,0.5);
}

.desc { font-size: 14px; opacity: 0.8; line-height: 1.4; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); }
.error-msg { color: #e74c3c; font-size: 14px; }

.actions { display: flex; justify-content: center; margin-top: 10px; }
.btn-close {
  padding: 10px 24px; background: rgba(0, 255, 255, 0.2); border: 1px solid #00ffff; color: #00ffff;
  border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; transition: all 0.2s;
}
.btn-close:hover { background: rgba(0, 255, 255, 0.4); box-shadow: 0 0 15px rgba(0,255,255,0.4); }
</style>
