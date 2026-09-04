<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>🎵 賽博合成音頻工作室 (Synth Studio)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="studio-body">
        <div class="control-row">
          <label>背景音樂狀態：</label>
          <button
            :class="['toggle-btn', { active: isPlaying }]"
            @click="toggleSynth"
          >
            {{ isPlaying ? '⏹️ 停止生成 (Mute)' : '▶️ 啟動過程生成音樂' }}
          </button>
        </div>

        <div class="control-row">
          <label>音樂調式 (Musical Scale)：</label>
          <select v-model="selectedScale" class="scale-select" @change="applyScale">
            <option value="dorian">⚡ Cyber Dorian (賽博多利亞調式)</option>
            <option value="pentatonic">🌌 Neon Pentatonic (霓虹五聲音階)</option>
            <option value="akebono">⛩️ Japanese Akebono (東方曙音階)</option>
            <option value="lydian">✨ Quantum Lydian (量子利底亞調式)</option>
          </select>
        </div>

        <div class="control-row">
          <label>速度節奏 (BPM: {{ bpm }})：</label>
          <input type="range" min="60" max="140" v-model.number="bpm" />
        </div>

        <div class="audio-visualizer">
          <div
            v-for="i in 16"
            :key="i"
            class="vis-bar"
            :style="{ height: `${Math.random() * (isPlaying ? 80 : 5) + 10}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { synth } from '@/engine/synth'
import { achievements } from '@/engine/achievements'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const isPlaying = ref(synth.getIsPlaying())
const selectedScale = ref('dorian')
const bpm = ref(84)

function toggleSynth(): void {
  synth.toggle()
  isPlaying.value = synth.getIsPlaying()
  if (isPlaying.value) {
    achievements.unlock('synth_lofi')
  }
}

function applyScale(): void {
  // Apply selected musical scale to synth
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

.studio-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-row label {
  font-size: 0.85rem;
  color: #a0aec0;
}

.toggle-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  color: #00ffff;
}

.scale-select {
  background: #111936;
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.audio-visualizer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.vis-bar {
  width: 16px;
  background: linear-gradient(180deg, #00ffff, #0088ff);
  border-radius: 2px;
  transition: height 0.1s ease;
}
</style>
