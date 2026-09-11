<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>📦 MagicaVoxel 3D 體素資產中心 (VOX Importer)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Drag & Drop Zone -->
      <div
        class="dropzone"
        :class="{ active: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <div class="drop-icon">📁</div>
        <p class="drop-text">拖曳 <code>.vox</code> (MagicaVoxel) 檔案至此處，或點擊下方載入精選預設模型</p>
        <input
          type="file"
          accept=".vox"
          ref="fileInputRef"
          class="file-input-hidden"
          @change="handleFileInput"
        />
        <button class="browse-btn" @click="triggerFileInput">瀏覽本機 .VOX 檔案</button>
      </div>

      <!-- Presets Selector -->
      <div class="presets-section">
        <h3>🚀 精選賽博體素模型庫</h3>
        <div class="presets-grid">
          <div
            v-for="p in PRESETS"
            :key="p.id"
            :class="['preset-card', { selected: selectedPreset === p.id }]"
            @click="selectPreset(p.id)"
          >
            <span class="p-icon">{{ p.icon }}</span>
            <div class="p-details">
              <span class="p-name">{{ p.name }}</span>
              <span class="p-desc">{{ p.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Model Info -->
      <div v-if="currentModel" class="model-summary">
        <div class="sum-row">
          <span>📦 模型名稱: <strong>{{ currentModel.name }}</strong></span>
          <span>📐 尺寸: <strong>{{ currentModel.size.x }} × {{ currentModel.size.y }} × {{ currentModel.size.z }}</strong></span>
          <span>🧱 體素總數: <strong>{{ currentModel.blocks.length }}</strong></span>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn secondary" @click="close">取消</button>
        <button class="btn primary" :disabled="!currentModel" @click="deployModel">
          🚀 部署到當前玩家座標
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ParsedVoxModel,
  parseVoxBinary,
  generatePresetVoxModel,
} from '@/engine/vox'
import { sound } from '@/engine/audio'
import { useUIStore } from '@/stores/ui'
import { BlockPlacement } from '@/types/world'

const emit = defineEmits<{
  (e: 'deploy-vox', blocks: BlockPlacement[]): void
}>()

const ui = useUIStore()
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()
const selectedPreset = ref<'mech' | 'spaceship' | 'dragon' | 'spire' | 'cybertree'>('mech')
const currentModel = ref<ParsedVoxModel | null>(generatePresetVoxModel('mech'))

const PRESETS: Array<{ id: 'mech' | 'spaceship' | 'dragon' | 'spire' | 'cybertree'; name: string; icon: string; desc: string }> = [
  { id: 'mech', name: '泰坦-V 突擊機甲 (Titan-V Mech)', icon: '🤖', desc: '14 格高雙足作戰裝甲，配備肩扛電漿砲' },
  { id: 'spaceship', name: '幻影護衛星艦 (Phantom Corvette)', icon: '🛸', desc: '賽博流線型曲率巡航艦，雙渦輪推進器' },
  { id: 'dragon', name: '以太機械巨龍 (Aether Cyber Dragon)', icon: '🐉', desc: '展翼 14 格的黑曜石合金機械巨龍' },
  { id: 'spire', name: '柯羅諾斯量子尖塔 (Chronos Spire)', icon: '🏛️', desc: '27 格高大理石方尖碑，內部蘊藏超核' },
  { id: 'cybertree', name: '生化發光巨樹 (Bioluminescent Tree)', icon: '🌳', desc: '發光螢光枝葉與脈衝生命迴路' },
]

function selectPreset(id: 'mech' | 'spaceship' | 'dragon' | 'spire' | 'cybertree'): void {
  selectedPreset.value = id
  currentModel.value = generatePresetVoxModel(id)
  sound.playUiClick()
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

function handleFileInput(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    loadVoxFile(file)
  }
}

function handleFileDrop(e: DragEvent): void {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.name.endsWith('.vox')) {
    loadVoxFile(file)
  } else {
    alert('請拖曳標準 .vox 格式檔案！')
  }
}

function loadVoxFile(file: File): void {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const buffer = reader.result as ArrayBuffer
      currentModel.value = parseVoxBinary(buffer, file.name.replace('.vox', ''))
      sound.playFanfare()
      ui.setBuildStatus(`✅ 成功解析 MagicaVoxel 檔案: ${file.name}`)
      setTimeout(() => ui.setBuildStatus(''), 2500)
    } catch (err: unknown) {
      alert('解析 .vox 檔案失敗: ' + (err as Error).message)
    }
  }
  reader.readAsArrayBuffer(file)
}

function deployModel(): void {
  if (!currentModel.value) return
  emit('deploy-vox', currentModel.value.blocks)
  sound.playFanfare()
  close()
}

function close(): void {
  ui.setVoxImporterModal(false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 90%;
  max-width: 680px;
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 24px;
  background: rgba(14, 20, 36, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #00ffff;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

.dropzone {
  border: 2px dashed rgba(0, 255, 255, 0.4);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  background: rgba(0, 255, 255, 0.04);
  transition: all 0.2s;
  margin-bottom: 20px;
}

.dropzone.active {
  border-color: #39ff14;
  background: rgba(57, 255, 20, 0.08);
}

.drop-icon {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.file-input-hidden {
  display: none;
}

.browse-btn {
  margin-top: 10px;
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid #00ffff;
  color: #00ffff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin: 12px 0 20px 0;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-card:hover,
.preset-card.selected {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.12);
}

.p-icon {
  font-size: 2rem;
}

.p-name {
  display: block;
  font-weight: bold;
  color: #ffffff;
}

.p-desc {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
}

.model-summary {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn.primary {
  background: linear-gradient(135deg, #00f0ff, #7000ff);
  border: none;
  color: #ffffff;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #cbd5e1;
}
</style>
