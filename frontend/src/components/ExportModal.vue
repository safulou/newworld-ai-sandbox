<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>📦 數位資產匯出中心 (Asset Exporter)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <p class="subtitle">將你在元宇宙中親手雕刻或 AI 協同生成的 3D 體素結構匯出為標準數位資產：</p>

      <div class="export-options">
        <div class="export-card">
          <div class="card-icon">📐</div>
          <div class="card-content">
            <h3>Wavefront .OBJ + .MTL 3D 格式</h3>
            <p>標準 3D 幾何模型與材質調色盤，可直接匯入 Blender、Maya、Unity、Unreal Engine 進行電影級渲染或遊戲開發。</p>
          </div>
          <button class="export-btn primary" @click="handleExportOBJ">
            ⬇️ 匯出 .OBJ 模型
          </button>
        </div>

        <div class="export-card">
          <div class="card-icon">📜</div>
          <div class="card-content">
            <h3>輕量化 Schematic JSON 數據</h3>
            <p>保存當前世界的體素座標與材質定義，方便於其他元宇宙伺服器或存檔點無損重構。</p>
          </div>
          <button class="export-btn secondary" @click="handleExportJSON">
            ⬇️ 匯出 .JSON 數據
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exporter } from '@/engine/exporter'
import { achievements } from '@/engine/achievements'
import { useUIStore } from '@/stores/ui'
import { sound } from '@/engine/audio'

const props = defineProps<{
  playerBlocks?: Map<string, any>
}>()

const ui = useUIStore()

function handleExportOBJ(): void {
  if (props.playerBlocks) {
    exporter.exportToOBJ(props.playerBlocks)
    sound.playFanfare()
    achievements.unlock('export_obj')
    ui.closeOverlay()
  }
}

function handleExportJSON(): void {
  if (props.playerBlocks) {
    exporter.exportToJSON(props.playerBlocks)
    sound.playFanfare()
    ui.closeOverlay()
  }
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
  width: 600px;
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

.subtitle {
  font-size: 0.85rem;
  color: #a0aec0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 8px;
}

.card-icon {
  font-size: 2.2rem;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 4px;
}

.card-content p {
  font-size: 0.75rem;
  color: #888;
  line-height: 1.4;
}

.export-btn {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  transition: all 0.2s;
}

.export-btn.primary {
  background: linear-gradient(135deg, #00ffff, #0088ff);
  color: #000;
}

.export-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.4);
}

.export-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
