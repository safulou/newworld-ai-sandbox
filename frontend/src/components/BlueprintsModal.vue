<template>
  <div class="overlay" @click.self="close">
    <div class="blueprint-panel glass-panel">
      <div class="header">
        <div class="header-left">
          <h2>🏛️ 全息建築藍圖庫 (Hologram Blueprint Architect)</h2>
          <span class="badge">AI 即時投影</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <p class="subtitle">選擇結構並在 3D 元宇宙中展開全息投影、旋轉方位，可一鍵建造或交由 AI NPC 伴侶工人物理鋪設！</p>

      <!-- AI Natural Language Search & Recommendation -->
      <div class="ai-search-box">
        <span class="ai-icon">✨</span>
        <input
          v-model="aiQuery"
          type="text"
          placeholder="輸入 AI 建築意圖（例如：鳥居、防禦地堡、金字塔、瞭望塔、高架橋）..."
          class="ai-input"
          @input="onAiSearch"
        />
        <button v-if="aiQuery" class="btn-clear" @click="aiQuery = ''">✕</button>
      </div>

      <div class="blueprint-grid">
        <div
          v-for="bp in filteredBlueprints"
          :key="bp.id"
          class="bp-card"
          :class="{ selected: selectedBp?.id === bp.id }"
          @click="selectBlueprint(bp)"
        >
          <div class="bp-icon">{{ bp.icon }}</div>
          <div class="bp-info">
            <div class="bp-name-row">
              <span class="bp-name">{{ bp.name }}</span>
              <span class="tag">{{ bp.category }}</span>
            </div>
            <div class="bp-desc">{{ bp.description }}</div>
            <div class="bp-meta">
              <span class="size-tag">📐 {{ bp.size.width }}×{{ bp.size.height }}×{{ bp.size.depth }}</span>
              <span class="blocks-count">🧱 {{ bp.blocks.length }} 體素方塊</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls & Actions -->
      <div class="footer">
        <div class="footer-left">
          <button
            class="btn-action-tool"
            :disabled="!selectedBp"
            @click="toggleHologramPreview"
          >
            {{ isHoloActive ? '👁️ 關閉全息投影' : '🌐 展開 3D 全息投影' }}
          </button>
          <button
            class="btn-action-tool"
            :disabled="!selectedBp || !isHoloActive"
            @click="rotateHologram"
            title="旋轉 90 度"
          >
            🔄 旋轉方位 ({{ rotationAngle }}°)
          </button>
        </div>

        <div class="footer-right">
          <button
            class="btn-npc-build"
            :disabled="!selectedBp"
            @click="assignToNpcWorker"
            title="指派附近 AI NPC 伴侶前往逐塊鋪設"
          >
            👷 指派 NPC 工人施工
          </button>
          <button
            class="btn-deploy"
            :disabled="!selectedBp"
            @click="deployInstant"
          >
            ⚡ 一鍵瞬時實體化
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { BuildAction } from '@/types/world'
import { BUILTIN_BLUEPRINTS, BlueprintDefinition, blueprintHologram } from '@/engine/blueprintHologram'
import { npcManager } from '@/engine/npc'
import { sound } from '@/engine/audio'

const emit = defineEmits<{
  (e: 'deploy', actions: BuildAction[]): void
}>()

const ui = useUIStore()

const blueprints = ref<BlueprintDefinition[]>(BUILTIN_BLUEPRINTS)
const selectedBp = ref<BlueprintDefinition | null>(blueprints.value[0] || null)
const aiQuery = ref('')
const isHoloActive = ref(blueprintHologram.getIsPreviewActive())
const rotationAngle = ref(0)

const filteredBlueprints = computed(() => {
  if (!aiQuery.value.trim()) return blueprints.value
  const q = aiQuery.value.trim().toLowerCase()
  return blueprints.value.filter(bp =>
    bp.name.toLowerCase().includes(q) ||
    bp.description.toLowerCase().includes(q) ||
    bp.category.toLowerCase().includes(q)
  )
})

function onAiSearch(): void {
  if (filteredBlueprints.value.length > 0) {
    selectBlueprint(filteredBlueprints.value[0])
  }
}

function selectBlueprint(bp: BlueprintDefinition): void {
  selectedBp.value = bp
  sound.playUiClick()
  if (isHoloActive.value) {
    blueprintHologram.showBlueprint(bp.id)
  }
}

function toggleHologramPreview(): void {
  if (!selectedBp.value) return
  if (blueprintHologram.getIsPreviewActive()) {
    blueprintHologram.hideBlueprint()
    isHoloActive.value = false
  } else {
    blueprintHologram.showBlueprint(selectedBp.value.id)
    isHoloActive.value = true
  }
}

function rotateHologram(): void {
  rotationAngle.value = blueprintHologram.rotate()
}

function deployInstant(): void {
  if (!selectedBp.value) return
  // Convert blueprint blocks to BuildAction[] for App.vue / GameCanvas
  const actions: BuildAction[] = selectedBp.value.blocks.map(b => ({
    type: 'place_block',
    position: [b.x, b.y, b.z],
    material: b.type,
  }))

  emit('deploy', actions)
  blueprintHologram.hideBlueprint()
  close()
}

async function assignToNpcWorker(): Promise<void> {
  if (!selectedBp.value) return
  const companion = npcManager.getNPCById('alex') || npcManager.getNPCs()[0]
  if (companion) {
    const blocks = selectedBp.value.blocks.map(b => ({
      x: b.x,
      y: b.y,
      z: b.z,
      type: b.type,
    }))
    blueprintHologram.hideBlueprint()
    close()
    await companion.executeBlueprintConstruction(blocks)
  } else {
    deployInstant()
  }
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.blueprint-panel {
  width: 780px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: rgba(10, 16, 32, 0.92);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 255, 255, 0.2);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

h2 {
  font-size: 20px;
  font-weight: 700;
  color: #00ffff;
  letter-spacing: 0.5px;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  color: #00ffff;
  border-radius: 12px;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover { color: #ff0055; }

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin: 6px 0 16px;
  line-height: 1.5;
}

.ai-search-box {
  display: flex;
  align-items: center;
  background: rgba(0, 255, 255, 0.06);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 10px;
  padding: 8px 14px;
  margin-bottom: 16px;
  gap: 10px;
}

.ai-icon { font-size: 16px; }

.ai-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 13px;
  outline: none;
}
.ai-input::placeholder { color: rgba(255, 255, 255, 0.4); }

.btn-clear {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 6px;
}

.bp-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bp-card:hover {
  background: rgba(0, 255, 255, 0.08);
  border-color: rgba(0, 255, 255, 0.35);
  transform: translateY(-2px);
}

.bp-card.selected {
  background: rgba(0, 255, 255, 0.16);
  border: 1.5px solid #00ffff;
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.3);
}

.bp-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bp-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bp-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bp-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.tag {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.bp-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  margin: 6px 0 8px;
  line-height: 1.4;
}

.bp-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.size-tag {
  color: #ffaa00;
  font-family: monospace;
}

.blocks-count {
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.footer-left {
  display: flex;
  gap: 8px;
}

.footer-right {
  display: flex;
  gap: 10px;
}

.btn-action-tool {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-action-tool:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.2);
}
.btn-action-tool:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-npc-build {
  background: rgba(255, 170, 0, 0.2);
  border: 1px solid #ffaa00;
  color: #ffcc00;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-npc-build:hover:not(:disabled) {
  background: rgba(255, 170, 0, 0.35);
  box-shadow: 0 0 12px rgba(255, 170, 0, 0.4);
}
.btn-npc-build:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-deploy {
  background: linear-gradient(135deg, #00ffff, #0088ff);
  color: #000;
  border: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.4);
}
.btn-deploy:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 22px rgba(0, 255, 255, 0.7);
}
.btn-deploy:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
