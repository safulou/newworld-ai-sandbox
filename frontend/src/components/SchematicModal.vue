<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel schematic-modal">
      <div class="modal-header">
        <div class="title-wrap">
          <h2>🏗️ 賽博體素藍圖工作室 (Schematic Studio)</h2>
          <span class="sub-badge">Prefab Stamp & Region Copy</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="tab-bar">
        <button
          :class="['tab-btn', { active: activeTab === 'prefabs' }]"
          @click="activeTab = 'prefabs'"
        >
          🏛️ 賽博預製組件 (Prefabs)
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'custom' }]"
          @click="activeTab = 'custom'"
        >
          💾 自訂藍圖 (Custom) ({{ schematics.customSchematics.length }})
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'copy' }]"
          @click="activeTab = 'copy'"
        >
          📐 空間框選複製 (Copy Box)
        </button>
      </div>

      <div class="modal-body">
        <!-- Tab 1: Prefabs & Custom List -->
        <div v-if="activeTab === 'prefabs' || activeTab === 'custom'" class="prefab-view">
          <div class="schematic-list">
            <div
              v-for="s in displayedSchematics"
              :key="s.id"
              class="schem-card"
              :class="{ selected: selectedSchem?.id === s.id }"
              @click="selectSchematic(s)"
            >
              <div class="card-header">
                <span class="schem-name">{{ s.name }}</span>
                <span class="schem-cat">{{ s.category }}</span>
              </div>
              <div class="card-meta">
                <span>尺寸: {{ s.dimensions.width }}×{{ s.dimensions.height }}×{{ s.dimensions.depth }}</span>
                <span>體素: {{ s.blocks.length }} 塊</span>
              </div>
            </div>

            <div v-if="displayedSchematics.length === 0" class="empty-hint">
              尚未有儲存的自訂藍圖。使用「空間框選複製」或「匯入 JSON」來新增！
            </div>
          </div>

          <!-- Preview & Controls Panel -->
          <div v-if="selectedSchem" class="schem-details">
            <div class="detail-header">
              <h3>{{ selectedSchem.name }}</h3>
              <span class="author-tag">作者: {{ selectedSchem.author }}</span>
            </div>

            <div class="rotation-bar">
              <label>旋轉方向：</label>
              <div class="rot-buttons">
                <button
                  v-for="deg in [0, 90, 180, 270]"
                  :key="deg"
                  :class="['rot-btn', { active: currentRotation === deg }]"
                  @click="currentRotation = deg as any"
                >
                  {{ deg }}°
                </button>
                <button class="rot-cycle-btn" @click="rotateClockwise">
                  🔄 +90°
                </button>
              </div>
            </div>

            <div class="block-preview-counts">
              <div class="preview-title">體素構成統計：</div>
              <div class="tags-container">
                <span
                  v-for="(count, type) in getBlockTypeCounts(selectedSchem)"
                  :key="type"
                  class="block-pill"
                >
                  {{ type }}: {{ count }}
                </span>
              </div>
            </div>

            <div class="action-buttons">
              <button class="primary-btn stamp-btn" @click="stampAtPlayer">
                🚀 放置於目前坐標
              </button>
              <button class="secondary-btn" @click="exportJson">
                📥 匯出 JSON
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 2: Copy Region Form -->
        <div v-if="activeTab === 'copy'" class="copy-view">
          <div class="copy-desc">
            請輸入欲框選複製的空間對角坐標 (Corner 1 到 Corner 2)，系統將抓取該立方體範圍內的所有實體體素。
          </div>

          <div class="coords-grid">
            <div class="coord-box">
              <h4>對角頂點 1 (Corner 1)</h4>
              <div class="inputs-row">
                <label>X: <input type="number" v-model.number="corner1.x" /></label>
                <label>Y: <input type="number" v-model.number="corner1.y" /></label>
                <label>Z: <input type="number" v-model.number="corner1.z" /></label>
              </div>
              <button class="small-btn" @click="setCornerToPlayer(1)">
                📍 設為當前玩家位置
              </button>
            </div>

            <div class="coord-box">
              <h4>對角頂點 2 (Corner 2)</h4>
              <div class="inputs-row">
                <label>X: <input type="number" v-model.number="corner2.x" /></label>
                <label>Y: <input type="number" v-model.number="corner2.y" /></label>
                <label>Z: <input type="number" v-model.number="corner2.z" /></label>
              </div>
              <button class="small-btn" @click="setCornerToPlayer(2)">
                📍 設為當前玩家位置
              </button>
            </div>
          </div>

          <div class="copy-form-row">
            <label>新藍圖名稱：</label>
            <input type="text" v-model="newSchemName" placeholder="例如：賽博總部基地" class="name-input" />
          </div>

          <button class="primary-btn capture-btn" @click="captureRegion">
            📦 捕獲並生成新藍圖
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="modal-footer">
        <label class="import-label">
          📤 匯入 JSON 藍圖檔:
          <input type="file" accept=".json" @change="onFileImport" class="file-input" />
        </label>
        <span v-if="message" class="status-msg">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { schematics, Schematic } from '@/engine/schematics'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const activeTab = ref<'prefabs' | 'custom' | 'copy'>('prefabs')
const selectedSchem = ref<Schematic | null>(schematics.activeSchematic)
const currentRotation = ref<0 | 90 | 180 | 270>(schematics.activeRotation)
const message = ref('')

const playerCoord = ref({ x: 0, y: 0, z: 0 })
const corner1 = ref({ x: 0, y: 0, z: 0 })
const corner2 = ref({ x: 5, y: 5, z: 5 })
const newSchemName = ref('自訂基地建築')

const displayedSchematics = computed(() => {
  return activeTab.value === 'prefabs'
    ? schematics.prefabs
    : schematics.customSchematics
})

function selectSchematic(s: Schematic): void {
  selectedSchem.value = s
  schematics.selectSchematic(s.id)
}

function rotateClockwise(): void {
  currentRotation.value = schematics.rotateClockwise()
}

function getBlockTypeCounts(s: Schematic): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const b of s.blocks) {
    counts[b.type] = (counts[b.type] || 0) + 1
  }
  return counts
}

function stampAtPlayer(): void {
  if (!selectedSchem.value) return
  const world = (window as any).__voxelWorldInstance
  if (!world) {
    message.value = '⚠️ 世界引擎未就緒，無法直接放置'
    return
  }

  const placed = schematics.paste(
    world,
    selectedSchem.value,
    Math.round(playerCoord.value.x),
    Math.round(playerCoord.value.y),
    Math.round(playerCoord.value.z),
    currentRotation.value
  )
  message.value = `✅ 成功放置「${selectedSchem.value.name}」共 ${placed} 塊體素！`
}

function exportJson(): void {
  if (!selectedSchem.value) return
  schematics.downloadJSON(selectedSchem.value)
  message.value = `📥 已匯出 ${selectedSchem.value.name}.schem.json`
}

function setCornerToPlayer(corner: 1 | 2): void {
  if (corner === 1) {
    corner1.value = {
      x: Math.round(playerCoord.value.x),
      y: Math.round(playerCoord.value.y),
      z: Math.round(playerCoord.value.z),
    }
  } else {
    corner2.value = {
      x: Math.round(playerCoord.value.x),
      y: Math.round(playerCoord.value.y),
      z: Math.round(playerCoord.value.z),
    }
  }
}

function captureRegion(): void {
  const world = (window as any).__voxelWorldInstance
  if (!world) {
    message.value = '⚠️ 世界引擎未就緒'
    return
  }

  const created = schematics.copyRegion(
    world,
    corner1.value.x,
    corner1.value.y,
    corner1.value.z,
    corner2.value.x,
    corner2.value.y,
    corner2.value.z,
    newSchemName.value || '自訂建築'
  )

  selectedSchem.value = created
  activeTab.value = 'custom'
  message.value = `🎉 成功捕獲「${created.name}」，包含 ${created.blocks.length} 塊體素！`
}

function onFileImport(e: Event): void {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  const reader = new FileReader()
  reader.onload = (evt) => {
    const content = evt.target?.result as string
    if (content) {
      const imported = schematics.importJSON(content)
      if (imported) {
        selectedSchem.value = imported
        activeTab.value = 'custom'
        message.value = `✅ 成功匯入「${imported.name}」！`
      } else {
        message.value = '❌ 檔案格式解析失敗'
      }
    }
  }
  reader.readAsText(file)
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  window.addEventListener('player-position', (e: Event) => {
    const custom = e as CustomEvent
    if (custom.detail) {
      playerCoord.value = {
        x: custom.detail.x ?? 0,
        y: custom.detail.y ?? 0,
        z: custom.detail.z ?? 0,
      }
    }
  })
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
}

.schematic-modal {
  width: 90vw;
  max-width: 900px;
  height: 80vh;
  max-height: 720px;
  background: rgba(13, 17, 23, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.35);
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #c9d1d9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(22, 27, 34, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #00f0ff;
}

.sub-badge {
  font-size: 0.72rem;
  background: rgba(0, 240, 255, 0.15);
  color: #58a6ff;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.close-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  font-size: 1.2rem;
  cursor: pointer;
}

.tab-bar {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background: #111620;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tab-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #8b949e;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(0, 240, 255, 0.15);
  border-color: rgba(0, 240, 255, 0.4);
  color: #00f0ff;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 16px;
  display: flex;
}

.prefab-view {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
}

.schematic-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 8px;
}

.schem-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.schem-card:hover {
  background: #1c2128;
  border-color: #58a6ff;
}

.schem-card.selected {
  background: rgba(0, 240, 255, 0.1);
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.schem-name {
  font-weight: 600;
  color: #f0f6fc;
}

.schem-cat {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: #58a6ff;
}

.card-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #8b949e;
}

.empty-hint {
  padding: 30px;
  text-align: center;
  color: #8b949e;
  font-size: 0.85rem;
}

.schem-details {
  flex: 1.2;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #30363d;
  padding-bottom: 8px;
}

.detail-header h3 {
  margin: 0;
  color: #00f0ff;
}

.author-tag {
  font-size: 0.75rem;
  color: #8b949e;
}

.rotation-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.rot-buttons {
  display: flex;
  gap: 6px;
}

.rot-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.rot-btn.active {
  background: #00f0ff;
  color: #000;
  font-weight: bold;
}

.rot-cycle-btn {
  background: #238636;
  border: 1px solid #2ea043;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.block-preview-counts {
  flex: 1;
  overflow-y: auto;
  background: #0d1117;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #21262d;
}

.preview-title {
  font-size: 0.75rem;
  color: #8b949e;
  margin-bottom: 8px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.block-pill {
  font-size: 0.72rem;
  background: #21262d;
  color: #58a6ff;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #30363d;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.primary-btn {
  flex: 1;
  background: #238636;
  border: 1px solid #2ea043;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #2ea043;
  box-shadow: 0 0 12px rgba(46, 160, 67, 0.4);
}

.secondary-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* Copy Region View */
.copy-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.copy-desc {
  font-size: 0.85rem;
  color: #8b949e;
  line-height: 1.4;
}

.coords-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.coord-box {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coord-box h4 {
  margin: 0;
  font-size: 0.85rem;
  color: #58a6ff;
}

.inputs-row {
  display: flex;
  gap: 8px;
}

.inputs-row label {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.inputs-row input {
  width: 55px;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 4px 6px;
  border-radius: 4px;
}

.small-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.copy-form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name-input {
  flex: 1;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 8px 12px;
  border-radius: 6px;
}

.capture-btn {
  padding: 12px;
  font-size: 0.95rem;
}

.modal-footer {
  padding: 10px 20px;
  background: rgba(16, 20, 28, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
}

.import-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b949e;
  cursor: pointer;
}

.file-input {
  font-size: 0.75rem;
  color: #c9d1d9;
}

.status-msg {
  color: #00ff88;
  font-weight: bold;
}
</style>
