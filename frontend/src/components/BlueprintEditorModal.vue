<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>📐 自訂藍圖工坊 (Custom Blueprint Creator)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="blueprint-form">
        <div class="form-group">
          <label>藍圖名稱 (Blueprint Name):</label>
          <input v-model="bpName" placeholder="例如：賽博天線塔、古風涼亭、霓虹拱門" />
        </div>

        <div class="form-group">
          <label>建築描述 (Description):</label>
          <input v-model="bpDesc" placeholder="簡述此建築的特點與構造" />
        </div>

        <div class="saved-list-section">
          <h3>我的自訂藍圖庫 ({{ customList.length }})</h3>
          <div class="bp-grid">
            <div
              v-for="b in customList"
              :key="b.id"
              class="bp-card"
            >
              <div class="bp-top">
                <span class="bp-title">{{ b.name }}</span>
                <span class="bp-count">{{ b.blocksCount }} 方塊</span>
              </div>
              <p class="bp-desc">{{ b.description }}</p>
              <span class="bp-dim">尺寸：{{ b.size.width }}×{{ b.size.height }}×{{ b.size.depth }}</span>
              <button class="btn-deploy" @click="deployCustomBlueprint(b)">
                ⚡ 一鍵部署到眼前
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">關閉 (ESC)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CustomBlueprint, schematicManager } from '@/engine/schematic'
import { sound } from '@/engine/audio'
import { useUIStore } from '@/stores/ui'

const emit = defineEmits<{
  (e: 'deploy-blueprint', bp: CustomBlueprint): void
}>()

const ui = useUIStore()
const bpName = ref('')
const bpDesc = ref('')
const customList = ref<CustomBlueprint[]>(schematicManager.getAll())

function deployCustomBlueprint(bp: CustomBlueprint): void {
  emit('deploy-blueprint', bp)
  sound.playFanfare()
  close()
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
  width: 660px;
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

.blueprint-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  color: #a0aec0;
}

.form-group input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
}

.form-group input:focus {
  border-color: #00ffff;
}

.saved-list-section h3 {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 10px;
}

.bp-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 35vh;
  overflow-y: auto;
}

.bp-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bp-title {
  font-weight: 700;
  color: #fff;
  font-size: 0.9rem;
}

.bp-count {
  font-size: 0.75rem;
  color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.bp-desc {
  font-size: 0.75rem;
  color: #888;
}

.bp-dim {
  font-size: 0.7rem;
  color: #666;
}

.btn-deploy {
  align-self: flex-start;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  color: #00ffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 4px;
}

.btn-deploy:hover {
  background: #00ffff;
  color: #000;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 12px;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
