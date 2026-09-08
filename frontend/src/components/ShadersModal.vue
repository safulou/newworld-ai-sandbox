<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>✨ 著色器與後製特效工作室 (Shaders & Post-FX)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="shader-controls">
        <div class="control-card">
          <div class="card-title">🌸 輝光強度 (Unreal Bloom)</div>
          <input type="range" min="0" max="3" step="0.1" v-model.number="bloomStrength" @input="updateShaders" />
          <span class="val-label">{{ bloomStrength.toFixed(1) }}</span>
        </div>

        <div class="control-card">
          <div class="card-title">📺 賽博掃描線 (CRT Scanlines)</div>
          <button
            :class="['toggle-chip', { active: scanlinesEnabled }]"
            @click="toggleScanlines"
          >
            {{ scanlinesEnabled ? '開啟中 (ON)' : '已關閉 (OFF)' }}
          </button>
        </div>

        <div class="control-card">
          <div class="card-title">🌈 色差偏移 (Chromatic Aberration)</div>
          <button
            :class="['toggle-chip', { active: chromaticEnabled }]"
            @click="toggleChromatic"
          >
            {{ chromaticEnabled ? '開啟中 (ON)' : '已關閉 (OFF)' }}
          </button>
        </div>

        <div class="control-card">
          <div class="card-title">🎬 膠片顆粒 (Film Grain)</div>
          <button
            :class="['toggle-chip', { active: grainEnabled }]"
            @click="toggleGrain"
          >
            {{ grainEnabled ? '開啟中 (ON)' : '已關閉 (OFF)' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { sound } from '@/engine/audio'

const ui = useUIStore()

const bloomStrength = ref(1.4)
const scanlinesEnabled = ref(false)
const chromaticEnabled = ref(false)
const grainEnabled = ref(false)

function updateShaders(): void {
  window.dispatchEvent(new CustomEvent('update-bloom', { detail: bloomStrength.value }))
}

function toggleScanlines(): void {
  scanlinesEnabled.value = !scanlinesEnabled.value
  sound.playUiClick()
}

function toggleChromatic(): void {
  chromaticEnabled.value = !chromaticEnabled.value
  sound.playUiClick()
}

function toggleGrain(): void {
  grainEnabled.value = !grainEnabled.value
  sound.playUiClick()
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
  width: 540px;
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

.shader-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  border-radius: 8px;
}

.card-title {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 600;
}

.val-label {
  font-size: 0.85rem;
  color: #00ffff;
  font-weight: 700;
  min-width: 35px;
  text-align: right;
}

input[type='range'] {
  accent-color: #00ffff;
  width: 140px;
}

.toggle-chip {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #aaa;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-chip.active {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  color: #00ffff;
  font-weight: 700;
}
</style>
