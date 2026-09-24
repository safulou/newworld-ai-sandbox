<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel piano-roll-modal">
      <div class="modal-header">
        <div class="title-wrap">
          <h2>🎹 賽博鋼琴卷軸工作室 (Piano Roll Studio)</h2>
          <span class="sub-badge">16-Step DAW Matrix</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Transport Controls -->
      <div class="toolbar">
        <div class="transport-group">
          <button
            class="action-btn play-btn"
            :class="{ active: isPlaying }"
            @click="togglePlay"
          >
            {{ isPlaying ? '⏹️ 停止' : '▶️ 播放' }}
          </button>
          <button
            class="action-btn loop-btn"
            :class="{ active: isLooping }"
            @click="toggleLoop"
            title="循環播放開關"
          >
            🔁 {{ isLooping ? '循環開' : '單次' }}
          </button>
        </div>

        <div class="bpm-group">
          <label>節奏 (BPM): <strong>{{ bpm }}</strong></label>
          <input
            type="range"
            min="60"
            max="180"
            v-model.number="bpm"
            @input="updateBpm"
          />
        </div>

        <div class="instrument-tabs">
          <button
            v-for="inst in instruments"
            :key="inst.id"
            :class="['inst-tab', inst.id, { active: currentInstrument === inst.id }]"
            @click="selectInstrument(inst.id)"
          >
            <span class="icon">{{ inst.icon }}</span>
            <span class="label">{{ inst.name }}</span>
            <span class="counter">({{ countNotes(inst.id) }})</span>
          </button>
        </div>

        <div class="preset-group">
          <select v-model="selectedPreset" @change="applyPreset" class="preset-select">
            <option value="" disabled>🎵 載入預設曲目...</option>
            <option value="neon_chip">⚡ 霓虹晶片 (Neon Chip)</option>
            <option value="crystal_bell">💎 水晶共鳴 (Crystal Bell)</option>
            <option value="cyber_techno">🚀 賽博鐵克諾 (Cyber Techno)</option>
          </select>
        </div>

        <div class="actions-group">
          <button class="small-btn danger" @click="clearCurrentTrack" title="清空目前樂器軌道">
            🗑️ 清空軌
          </button>
          <button class="small-btn" @click="exportMidi" title="匯出標準 0-Type MIDI 檔案">
            💾 匯出 MIDI
          </button>
        </div>
      </div>

      <!-- Piano Roll Matrix -->
      <div class="sequencer-container">
        <!-- Steps Header Bar -->
        <div class="steps-header">
          <div class="pitch-gutter-header">音高 (Pitch)</div>
          <div class="steps-ruler">
            <div
              v-for="s in 16"
              :key="s"
              class="step-num"
              :class="{
                'beat-start': (s - 1) % 4 === 0,
                'current-step': currentStep === (s - 1)
              }"
            >
              {{ s }}
            </div>
          </div>
        </div>

        <!-- Scrollable Matrix Viewport -->
        <div class="matrix-viewport">
          <div
            v-for="(pitchName, revIdx) in reversedPitchNames"
            :key="pitchName"
            class="matrix-row"
            :class="{ 'is-sharp': pitchName.includes('#') }"
          >
            <!-- Piano Key Column -->
            <div
              class="pitch-key"
              :class="{ 'black-key': pitchName.includes('#'), 'white-key': !pitchName.includes('#') }"
              @mousedown="auditionPitch(getPitchIndex(revIdx))"
            >
              <span class="key-label">{{ pitchName }}</span>
            </div>

            <!-- 16 Sequencer Cells -->
            <div class="cells-row">
              <div
                v-for="s in 16"
                :key="s"
                class="cell"
                :class="[
                  currentInstrument,
                  {
                    'active': isCellActive(currentInstrument, getPitchIndex(revIdx), s - 1),
                    'beat-group': (s - 1) % 4 === 0,
                    'playhead': currentStep === (s - 1)
                  }
                ]"
                @click="toggleCell(getPitchIndex(revIdx), s - 1)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="modal-footer">
        <div class="tips">
          <span>💡 提示: 點擊左側琴鍵試聽音高，點擊網格編排音符。支援即時合成器與多軌混音，可直接匯出標準 MIDI。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { pianoRoll, PITCH_NAMES, STEP_COUNT } from '@/engine/pianoRoll'
import { InstrumentType, noteBlocks } from '@/engine/noteBlocks'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const instruments: { id: InstrumentType; name: string; icon: string }[] = [
  { id: 'chip', name: '晶片 (Chip)', icon: '🕹️' },
  { id: 'bass', name: '貝斯 (Bass)', icon: '🎸' },
  { id: 'bell', name: '水晶鐘 (Bell)', icon: '🔔' },
  { id: 'drum', name: '電子鼓 (Drum)', icon: '🥁' },
]

const currentInstrument = ref<InstrumentType>(pianoRoll.currentInstrument)
const bpm = ref(pianoRoll.bpm)
const isPlaying = ref(pianoRoll.isPlaying)
const isLooping = ref(pianoRoll.isLooping)
const currentStep = ref(pianoRoll.currentStep)
const selectedPreset = ref('')

// Reversed pitch names so high pitches (C5) are at the top and low pitches (C3) are at the bottom
const reversedPitchNames = computed(() => [...PITCH_NAMES].reverse())

function getPitchIndex(revIdx: number): number {
  return 24 - revIdx
}

function isCellActive(inst: InstrumentType, pitch: number, step: number): boolean {
  return pianoRoll.grid[inst]?.[pitch]?.[step] ?? false
}

function toggleCell(pitch: number, step: number): void {
  pianoRoll.toggleCell(currentInstrument.value, pitch, step)
}

function auditionPitch(pitch: number): void {
  noteBlocks.playTone(pitch, currentInstrument.value)
}

function selectInstrument(inst: InstrumentType): void {
  currentInstrument.value = inst
  pianoRoll.currentInstrument = inst
}

function togglePlay(): void {
  if (isPlaying.value) {
    pianoRoll.stop()
  } else {
    pianoRoll.play((step) => {
      currentStep.value = step
    })
  }
  isPlaying.value = pianoRoll.isPlaying
}

function toggleLoop(): void {
  pianoRoll.isLooping = !pianoRoll.isLooping
  isLooping.value = pianoRoll.isLooping
}

function updateBpm(): void {
  pianoRoll.bpm = bpm.value
}

function applyPreset(): void {
  if (!selectedPreset.value) return
  pianoRoll.loadPreset(selectedPreset.value as any)
  bpm.value = pianoRoll.bpm
  selectedPreset.value = ''
}

function clearCurrentTrack(): void {
  pianoRoll.clear(currentInstrument.value)
}

function exportMidi(): void {
  pianoRoll.exportMIDI('cyber_daw_sequence.mid')
}

function countNotes(inst: InstrumentType): number {
  let count = 0
  const rows = pianoRoll.grid[inst]
  if (!rows) return 0
  for (let p = 0; p < 25; p++) {
    for (let s = 0; s < STEP_COUNT; s++) {
      if (rows[p][s]) count++
    }
  }
  return count
}

function close(): void {
  if (isPlaying.value) {
    pianoRoll.stop()
  }
  ui.closeOverlay()
}

function handleUpdateEvent(e: Event): void {
  const detail = (e as CustomEvent).detail
  if (detail) {
    isPlaying.value = detail.isPlaying
    currentStep.value = detail.currentStep
  }
}

onMounted(() => {
  window.addEventListener('piano-roll-update', handleUpdateEvent)
})

onUnmounted(() => {
  window.removeEventListener('piano-roll-update', handleUpdateEvent)
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

.piano-roll-modal {
  width: 92vw;
  max-width: 1080px;
  height: 86vh;
  max-height: 850px;
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
  font-size: 1.25rem;
  color: #00f0ff;
  letter-spacing: 0.5px;
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
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff4d6d;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  background: rgba(16, 20, 28, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.transport-group {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.play-btn.active {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
  box-shadow: 0 0 10px rgba(46, 160, 67, 0.4);
}

.loop-btn.active {
  background: rgba(0, 240, 255, 0.2);
  border-color: #00f0ff;
  color: #00f0ff;
}

.bpm-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.bpm-group input[type="range"] {
  width: 90px;
  accent-color: #00f0ff;
}

.instrument-tabs {
  display: flex;
  gap: 6px;
}

.inst-tab {
  background: #161b22;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.inst-tab.active.chip {
  background: rgba(255, 184, 0, 0.15);
  border-color: #ffb800;
  color: #ffb800;
  box-shadow: 0 0 8px rgba(255, 184, 0, 0.25);
}

.inst-tab.active.bass {
  background: rgba(163, 113, 247, 0.15);
  border-color: #a371f7;
  color: #a371f7;
  box-shadow: 0 0 8px rgba(163, 113, 247, 0.25);
}

.inst-tab.active.bell {
  background: rgba(0, 240, 255, 0.15);
  border-color: #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.25);
}

.inst-tab.active.drum {
  background: rgba(255, 77, 109, 0.15);
  border-color: #ff4d6d;
  color: #ff4d6d;
  box-shadow: 0 0 8px rgba(255, 77, 109, 0.25);
}

.counter {
  font-size: 0.72rem;
  opacity: 0.75;
}

.preset-select {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.actions-group {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.small-btn {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.small-btn:hover {
  background: #30363d;
}

.small-btn.danger:hover {
  background: rgba(255, 77, 109, 0.2);
  border-color: #ff4d6d;
  color: #ff4d6d;
}

/* Sequencer Container */
.sequencer-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: #090d13;
}

.steps-header {
  display: flex;
  height: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #111620;
}

.pitch-gutter-header {
  width: 75px;
  min-width: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  color: #8b949e;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.steps-ruler {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #8b949e;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.step-num.beat-start {
  color: #58a6ff;
  font-weight: bold;
  background: rgba(88, 166, 255, 0.05);
}

.step-num.current-step {
  background: rgba(0, 240, 255, 0.2);
  color: #00f0ff;
  font-weight: bold;
}

/* Matrix Viewport */
.matrix-viewport {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.matrix-row {
  display: flex;
  height: 26px;
  min-height: 26px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.matrix-row.is-sharp {
  background: rgba(0, 0, 0, 0.25);
}

.pitch-key {
  width: 75px;
  min-width: 75px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  font-size: 0.72rem;
  font-family: monospace;
  cursor: pointer;
  user-select: none;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s;
}

.pitch-key.white-key {
  color: #c9d1d9;
  background: #131822;
}

.pitch-key.black-key {
  color: #8b949e;
  background: #0d1117;
  font-weight: bold;
}

.pitch-key:hover {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
}

.cells-row {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
}

.cell {
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  position: relative;
  transition: background 0.1s, box-shadow 0.1s;
}

.cell.beat-group {
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.cell:hover {
  background: rgba(255, 255, 255, 0.06);
}

.cell.playhead {
  background: rgba(0, 240, 255, 0.08);
}

/* Active notes per instrument */
.cell.active.chip {
  background: #ffb800;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 184, 0, 0.6);
  border-radius: 3px;
}

.cell.active.bass {
  background: #a371f7;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(163, 113, 247, 0.6);
  border-radius: 3px;
}

.cell.active.bell {
  background: #00f0ff;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 240, 255, 0.6);
  border-radius: 3px;
}

.cell.active.drum {
  background: #ff4d6d;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 77, 109, 0.6);
  border-radius: 3px;
}

.modal-footer {
  padding: 10px 20px;
  background: rgba(16, 20, 28, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
  color: #8b949e;
}
</style>
