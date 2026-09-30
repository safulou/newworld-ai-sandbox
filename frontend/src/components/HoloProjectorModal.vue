<template>
  <div class="holo-overlay" @click.self="close">
    <div class="holo-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🔮</span>
          <div>
            <h2>微體素全息雕刻儀與投影台 (Micro-Voxel Sculptor)</h2>
            <p class="subtitle">16x16x16 高密微體素自由雕塑、全息基座光束投影與 3D 霓虹跑馬燈</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Left: 16x16 Voxel Grid Slice Editor -->
        <div class="editor-panel">
          <div class="panel-header">
            <span>雕塑切片層 (Y: {{ activeY }})</span>
            <div class="layer-stepper">
              <button class="step-btn" :disabled="activeY <= 0" @click="activeY--">▼ 下層</button>
              <span class="layer-num">{{ activeY }} / 15</span>
              <button class="step-btn" :disabled="activeY >= 15" @click="activeY++">▲ 上層</button>
            </div>
          </div>

          <!-- 16x16 Grid -->
          <div class="voxel-grid">
            <div
              v-for="idx in 256"
              :key="idx"
              class="grid-cell"
              :style="{ backgroundColor: getCellColor(idx - 1) }"
              @mousedown="handleCellClick(idx - 1)"
            ></div>
          </div>

          <!-- Color Palette & Tools -->
          <div class="tools-bar">
            <div class="palette">
              <button
                v-for="color in palette"
                :key="color"
                :class="['color-swatch', { active: color === activeColor }]"
                :style="{ backgroundColor: color }"
                @click="activeColor = color"
              ></button>
            </div>

            <div class="tool-actions">
              <button :class="['t-btn', { active: activeTool === 'chisel' }]" @click="activeTool = 'chisel'">
                ⛏️ 雕刻
              </button>
              <button :class="['t-btn', { active: activeTool === 'eraser' }]" @click="activeTool = 'eraser'">
                🧹 擦除
              </button>
              <button class="t-btn danger" @click="clearCanvas">
                🗑️ 清空
              </button>
              <button class="t-btn save" @click="saveModel">
                💾 儲存作品
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Model Gallery & Hologram Projector Controls -->
        <div class="gallery-panel">
          <div class="section-block">
            <h3>🎨 作品模型庫 (Models)</h3>
            <div class="models-list">
              <div
                v-for="m in models"
                :key="m.id"
                :class="['model-card', { active: m.id === activeModel.id }]"
                @click="selectModel(m.id)"
              >
                <div class="m-info">
                  <span class="m-title">{{ m.name }}</span>
                  <span class="m-meta">{{ Object.keys(m.voxels).length }} 個微體素</span>
                </div>
                <button class="proj-deploy-btn" @click.stop="deployProjector(m.id)">
                  📡 投射至世界
                </button>
              </div>
            </div>
          </div>

          <!-- Hologram Projector Manager -->
          <div class="section-block">
            <h3>📡 當前世界全息基座 (Active Projectors)</h3>
            <div class="projectors-list">
              <div v-for="p in projectors" :key="p.id" class="p-card">
                <div class="p-info">
                  <span class="p-name">{{ p.name }}</span>
                  <span class="p-pos">[{{ p.x }}, {{ p.y }}, {{ p.z }}]</span>
                </div>
                <div class="p-controls">
                  <button
                    :class="['toggle-btn', { on: p.isEmitting }]"
                    @click="toggleProjector(p.id)"
                  >
                    {{ p.isEmitting ? '🟢 投射中' : '⚪ 關閉' }}
                  </button>
                  <button class="del-btn" @click="removeProjector(p.id)">✕</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Neon Signboard Ticker -->
          <div class="section-block">
            <h3>✨ 3D 霓虹懸浮跑馬燈 (Neon Holo-Sign)</h3>
            <div class="sign-input-box">
              <input v-model="newSignText" type="text" placeholder="輸入跑馬燈文字..." />
              <button class="primary-btn" @click="addSign">放置跑馬燈</button>
            </div>
            <div class="signs-list">
              <div v-for="s in signs" :key="s.id" class="sign-item">
                <span class="sign-txt">{{ s.text }}</span>
                <button class="del-btn" @click="removeSign(s.id)">✕</button>
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
import { useUIStore } from '@/stores/ui'
import {
  voxelSculptor,
  NEON_PALETTE,
} from '@/engine/voxelSculptor'

const uiStore = useUIStore()

const activeY = ref(6)
const palette = NEON_PALETTE
const activeColor = ref(voxelSculptor.activeColor)
const activeTool = ref<'chisel' | 'eraser'>('chisel')

const models = ref(voxelSculptor.models)
const activeModel = ref(voxelSculptor.activeModel)
const projectors = ref(voxelSculptor.projectors)
const signs = ref(voxelSculptor.signs)
const newSignText = ref('★ 賽博先鋒交易所 ★ 營業中 ★')

function close() {
  uiStore.mode = 'game'
}

function getCellColor(cellIdx: number): string {
  const x = cellIdx % 16
  const z = Math.floor(cellIdx / 16)
  const key = `${x},${activeY.value},${z}`
  return activeModel.value.voxels[key] || 'rgba(255, 255, 255, 0.04)'
}

function handleCellClick(cellIdx: number) {
  const x = cellIdx % 16
  const z = Math.floor(cellIdx / 16)
  if (activeTool.value === 'eraser') {
    voxelSculptor.removeVoxel(x, activeY.value, z)
  } else {
    voxelSculptor.setVoxel(x, activeY.value, z, activeColor.value)
  }
  activeModel.value = { ...voxelSculptor.activeModel }
}

function clearCanvas() {
  voxelSculptor.clearCanvas()
  activeModel.value = { ...voxelSculptor.activeModel }
}

function saveModel() {
  voxelSculptor.saveActiveModel()
  models.value = [...voxelSculptor.models]
}

function selectModel(id: string) {
  voxelSculptor.selectModel(id)
  activeModel.value = { ...voxelSculptor.activeModel }
}

function deployProjector(modelId: string) {
  voxelSculptor.addProjector(0, 5, 0, modelId, activeColor.value)
  projectors.value = [...voxelSculptor.projectors]
}

function toggleProjector(id: string) {
  voxelSculptor.toggleProjector(id)
  projectors.value = [...voxelSculptor.projectors]
}

function removeProjector(id: string) {
  voxelSculptor.removeProjector(id)
  projectors.value = [...voxelSculptor.projectors]
}

function addSign() {
  if (!newSignText.value.trim()) return
  voxelSculptor.addSign(newSignText.value, 0, 7, 0, activeColor.value)
  signs.value = [...voxelSculptor.signs]
}

function removeSign(id: string) {
  voxelSculptor.removeSign(id)
  signs.value = [...voxelSculptor.signs]
}
</script>

<style scoped>
.holo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.holo-modal {
  width: 950px;
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
  padding-bottom: 12px;
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

.main-layout {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 20px;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #38bdf8;
}

.layer-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-btn {
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: #00f0ff;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.layer-num {
  font-size: 0.82rem;
  color: #e2e8f0;
}

.voxel-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 2px;
  width: 420px;
  height: 420px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px;
  border-radius: 6px;
  margin: 0 auto;
}

.grid-cell {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.1s;
}

.grid-cell:hover {
  transform: scale(1.15);
  box-shadow: 0 0 6px #00f0ff;
}

.tools-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.palette {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-swatch.active {
  border-color: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 8px currentColor;
}

.tool-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.t-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.t-btn.active {
  background: rgba(0, 240, 255, 0.2);
  border-color: #00f0ff;
  color: #00f0ff;
}

.t-btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

.t-btn.save {
  background: rgba(56, 189, 248, 0.2);
  border-color: #38bdf8;
  color: #38bdf8;
}

.gallery-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-block {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-block h3 {
  font-size: 0.85rem;
  color: #38bdf8;
  margin: 0;
}

.models-list, .projectors-list, .signs-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.model-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
}

.model-card.active {
  border-color: #00f0ff;
  background: rgba(0, 240, 255, 0.1);
}

.m-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-title {
  font-size: 0.82rem;
  font-weight: 600;
}

.m-meta {
  font-size: 0.7rem;
  color: #94a3b8;
}

.proj-deploy-btn {
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  font-size: 0.72rem;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.p-card, .sign-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.p-info {
  display: flex;
  gap: 8px;
}

.p-pos {
  color: #94a3b8;
}

.p-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  font-size: 0.72rem;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn.on {
  background: rgba(57, 255, 20, 0.2);
  border-color: #39ff14;
  color: #39ff14;
}

.del-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px 6px;
}

.sign-input-box {
  display: flex;
  gap: 8px;
}

.sign-input-box input {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 6px 10px;
  font-size: 0.82rem;
}

.primary-btn {
  background: #00f0ff;
  border: none;
  color: #040810;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>
