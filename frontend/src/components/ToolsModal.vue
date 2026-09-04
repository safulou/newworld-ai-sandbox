<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>🛠️ 空間工具庫 (Metaverse Toolset)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="tools-grid">
        <div
          v-for="t in toolList"
          :key="t.id"
          :class="['tool-card', { active: currentTool === t.id }]"
          @click="selectTool(t.id)"
        >
          <div class="tool-icon">{{ t.icon }}</div>
          <div class="tool-info">
            <span class="tool-name">{{ t.name }}</span>
            <span class="tool-desc">{{ t.desc }}</span>
          </div>
          <div class="status-indicator">
            {{ currentTool === t.id ? '裝備中' : '選擇' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ToolType } from '@/types/world'
import { tools } from '@/engine/tools'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const currentTool = ref<ToolType>(tools.getActiveTool())

const toolList: Array<{ id: ToolType; name: string; icon: string; desc: string }> = [
  { id: 'pickaxe', name: '標準鎬與手持建造', icon: '⛏️', desc: '左鍵破壞方塊、右鍵放置手持方塊' },
  { id: 'wand', name: 'WorldEdit 空間魔杖', icon: '🪄', desc: '標定 Pos1/Pos2 區域並進行批次填充或替換' },
  { id: 'gravity_gun', name: '量子引力槍', icon: '🔫', desc: '吸附並懸浮物理方塊團，朝準心發射投擲' },
  { id: 'palette_brush', name: '材質色彩重鑄筆刷', icon: '🎨', desc: '直接點擊方塊以當前選定材質覆蓋，無需重新挖掘' },
  { id: 'blaster', name: '電漿爆破發射器', icon: '💣', desc: '發射高能電漿彈丸，於著彈點引發球形爆破' },
  { id: 'ruler', name: '3D 空間幾何測量尺', icon: '📐', desc: '點選兩點測量空間歐幾里得直線距離與各軸分量' },
]

function selectTool(id: ToolType): void {
  currentTool.value = id
  tools.setTool(id)
  ui.closeOverlay()
}

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
  width: 580px;
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

.tools-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tool-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 255, 255, 0.3);
}

.tool-card.active {
  background: rgba(0, 255, 255, 0.1);
  border-color: #00ffff;
}

.tool-icon {
  font-size: 1.8rem;
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-name {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.tool-desc {
  font-size: 0.75rem;
  color: #888;
}

.status-indicator {
  font-size: 0.75rem;
  color: #00ffff;
  font-weight: 600;
  background: rgba(0, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
