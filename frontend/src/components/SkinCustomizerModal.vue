<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>🧑‍🚀 賽博虛擬化身工坊 (Avatar Skin Studio)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="skin-layout">
        <!-- Preset Grid -->
        <div class="presets-section">
          <h3>經典裝甲套裝 (Presets)</h3>
          <div class="presets-grid">
            <div
              v-for="p in PRESET_SKINS"
              :key="p.skinName"
              :class="['preset-card', { active: currentSkin.skinName === p.skinName }]"
              @click="applyPreset(p)"
            >
              <div
                class="color-preview"
                :style="{ backgroundColor: '#' + p.suitColor.toString(16).padStart(6, '0') }"
              ></div>
              <div class="preset-info">
                <span class="preset-name">{{ p.skinName }}</span>
                <span class="preset-title">{{ p.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Options -->
        <div class="custom-section">
          <h3>個人化微調 (Customization)</h3>
          <div class="opt-row">
            <label>裝甲主色調 (Suit Hex):</label>
            <input type="color" v-model="suitHex" @change="updateCustomSkin" />
          </div>
          <div class="opt-row">
            <label>面罩輝光色 (Visor Hex):</label>
            <input type="color" v-model="visorHex" @change="updateCustomSkin" />
          </div>
          <div class="opt-row">
            <label>量子噴射背包 (Jetpack):</label>
            <input type="checkbox" v-model="currentSkin.jetpackEnabled" @change="updateCustomSkin" />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-save" @click="saveAndClose">確認裝備並保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PRESET_SKINS, AvatarSkin, skinManager } from '@/engine/skin'
import { sound } from '@/engine/audio'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const currentSkin = ref<AvatarSkin>({ ...skinManager.getSkin() })

const suitHex = ref('#' + currentSkin.value.suitColor.toString(16).padStart(6, '0'))
const visorHex = ref('#' + currentSkin.value.visorColor.toString(16).padStart(6, '0'))

function applyPreset(p: AvatarSkin): void {
  currentSkin.value = { ...p }
  suitHex.value = '#' + p.suitColor.toString(16).padStart(6, '0')
  visorHex.value = '#' + p.visorColor.toString(16).padStart(6, '0')
  sound.playUiClick()
}

function updateCustomSkin(): void {
  currentSkin.value.suitColor = parseInt(suitHex.value.replace('#', ''), 16)
  currentSkin.value.visorColor = parseInt(visorHex.value.replace('#', ''), 16)
  currentSkin.value.skinName = 'Custom Cyber'
}

function saveAndClose(): void {
  skinManager.setSkin(currentSkin.value)
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
  width: 620px;
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

.skin-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

h3 {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 10px;
}

.presets-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-card.active {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.preset-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  display: block;
}

.preset-title {
  font-size: 0.7rem;
  color: #888;
}

.custom-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 14px;
  border-radius: 8px;
}

.opt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #ddd;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-save {
  background: linear-gradient(135deg, #00ffff, #0088ff);
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.4);
}
</style>
