<template>
  <div class="photo-overlay">
    <div class="photo-controls glass-panel">
      <div class="modal-header">
        <h2>📷 賽博光影相機 (Photo Mode)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="control-group">
        <label>視野視角 (FOV): {{ fov }}°</label>
        <input type="range" min="30" max="110" v-model.number="fov" @input="updateCamera" />
      </div>

      <div class="control-group">
        <label>光暈輝光 (Bloom): {{ bloom.toFixed(1) }}</label>
        <input type="range" min="0" max="3" step="0.1" v-model.number="bloom" />
      </div>

      <div class="control-group">
        <label>風格濾鏡 (LUT Filter):</label>
        <div class="filter-chips">
          <button
            v-for="f in filters"
            :key="f.id"
            :class="['chip', { active: activeFilter === f.id }]"
            @click="activeFilter = f.id"
          >
            {{ f.name }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="action-btn primary" @click="takeScreenshot">
          📸 拍攝高解析度快照 (Snapshot)
        </button>
        <button class="action-btn secondary" @click="close">
          返回沙盒 (ESC)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { achievements } from '@/engine/achievements'
import { sound } from '@/engine/audio'

const ui = useUIStore()

const fov = ref(75)
const bloom = ref(1.4)
const activeFilter = ref('cyber')

const filters = [
  { id: 'none', name: '原色 (Standard)' },
  { id: 'cyber', name: '賽博霓虹 (Cyberpunk)' },
  { id: 'noir', name: '深淵黑白 (Film Noir)' },
  { id: 'vintage', name: '復古暖調 (Vintage)' },
]

function updateCamera(): void {
  window.dispatchEvent(new CustomEvent('update-fov', { detail: fov.value }))
}

function takeScreenshot(): void {
  sound.playFanfare()
  achievements.trackProgress('photo_snap', 1)

  const canvas = document.querySelector('canvas')
  if (canvas) {
    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `newworld_snapshot_${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 30px;
  pointer-events: none;
  z-index: 1000;
}

.photo-controls {
  width: 380px;
  padding: 24px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.2rem;
  color: #00ffff;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 0.85rem;
  color: #a0aec0;
}

input[type='range'] {
  accent-color: #00ffff;
  width: 100%;
}

.filter-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.active {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  color: #00ffff;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.action-btn {
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00ffff, #0088ff);
  color: #000;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
