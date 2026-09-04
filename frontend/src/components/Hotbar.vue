<template>
  <div class="hotbar-container">
    <div class="hotbar glass-panel">
      <div
        v-for="(slot, idx) in slots"
        :key="slot.type"
        class="slot"
        :class="{ active: ui.selectedBlock === slot.type }"
        @click="selectSlot(slot.type)"
      >
        <span class="key-num">{{ idx + 1 }}</span>
        <div class="color-swatch" :style="{ backgroundColor: slot.color, boxShadow: `0 0 8px ${slot.color}` }"></div>
        <span class="slot-label">{{ slot.label }}</span>
      </div>
    </div>

    <!-- Quick action buttons next to hotbar -->
    <div class="quick-actions">
      <button class="action-btn ai-btn" @click="openAI">
        ⚡ AI Build (B)
      </button>
      <button class="action-btn bp-btn" @click="openBlueprints">
        🏛️ Blueprints (P)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { BlockType } from '@/types/world'
import { sound } from '@/engine/audio'

const ui = useUIStore()

const slots: { type: BlockType; label: string; color: string }[] = [
  { type: 'stone', label: 'Stone', color: '#1a1a24' },
  { type: 'brick', label: 'Brick', color: '#ff3344' },
  { type: 'plank', label: 'Plank', color: '#2a4466' },
  { type: 'wood', label: 'Wood', color: '#663322' },
  { type: 'glass', label: 'Glass', color: '#00ffff' },
  { type: 'leaves', label: 'Leaves', color: '#00ff88' },
  { type: 'grass', label: 'Grass', color: '#00aa44' },
  { type: 'sand', label: 'Sand', color: '#d4aa70' },
  { type: 'snow', label: 'Snow', color: '#ffffff' },
]

function selectSlot(type: BlockType): void {
  ui.setSelectedBlock(type)
  sound.playBlockPlace(type)
}

function openAI(): void {
  ui.openBuildPrompt()
}

function openBlueprints(): void {
  ui.openBlueprints()
}

function onKeyDown(e: KeyboardEvent): void {
  if (ui.mode !== 'game') return
  const num = parseInt(e.key)
  if (!isNaN(num) && num >= 1 && num <= 9) {
    const target = slots[num - 1]
    if (target) {
      selectSlot(target.type)
    }
  }
  if (e.code === 'KeyP') {
    openBlueprints()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.hotbar-container {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
  z-index: 20;
}

.hotbar {
  display: flex;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.slot {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.slot:hover {
  background: rgba(0, 255, 255, 0.15);
  border-color: rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
}

.slot.active {
  background: rgba(0, 255, 255, 0.22);
  border: 2px solid #00ffff;
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.5);
  transform: translateY(-3px);
}

.key-num {
  position: absolute;
  top: 2px;
  left: 5px;
  font-size: 10px;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-top: 4px;
}

.slot-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.2px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-btn {
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  color: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}
.ai-btn:hover {
  background: #00ffff;
  color: #000;
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.6);
  transform: translateY(-1px);
}

.bp-btn {
  background: rgba(255, 170, 0, 0.2);
  border: 1px solid #ffaa00;
  color: #ffaa00;
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.2);
}
.bp-btn:hover {
  background: #ffaa00;
  color: #000;
  box-shadow: 0 0 16px rgba(255, 170, 0, 0.6);
  transform: translateY(-1px);
}
</style>
