<template>
  <div class="hud">
    <!-- Top Left: Virtual Land Plot & Metaverse Info -->
    <div class="plot-panel glass-panel">
      <div class="plot-header">
        <span class="plot-icon">🏛️</span>
        <span class="plot-title">{{ currentPlot?.plotName || `Chunk [${currentChunk.cx}, ${currentChunk.cz}]` }}</span>
      </div>
      <div class="plot-owner">
        Owner: <span :class="{ 'self-owned': isOwner, 'public-land': !currentPlot }">{{ ownerText }}</span>
      </div>
      <button v-if="!currentPlot" class="btn-claim" @click="claimPlot">
        ⚡ Claim Plot
      </button>
    </div>

    <!-- Top Right: Provider Badge, Audio Controls & Quick Undo -->
    <div class="top-right-bar">
      <button class="hud-btn undo-btn" @click="triggerUndo" title="Undo Last Build (Ctrl+Z)">
        ↩️ Undo (Ctrl+Z)
      </button>
      <button class="hud-btn audio-btn" :class="{ muted: isMuted }" @click="toggleAudio">
        {{ isMuted ? '🔇 Audio Off' : '🔊 Audio On' }}
      </button>
      <div class="provider-badge" :class="settings.provider">
        {{ settings.provider === 'local' ? '🧱 Local AI' : `⚡ ${settings.provider.toUpperCase()}` }}
      </div>
    </div>

    <!-- Center: Build status notification -->
    <div v-if="ui.buildStatus" class="build-status">{{ ui.buildStatus }}</div>

    <!-- Bottom: Controls hint -->
    <div class="hint">
      WASD: Move &nbsp;|&nbsp; Left Click: Break &nbsp;|&nbsp; Right Click: Place &nbsp;|&nbsp; 1-9: Select &nbsp;|&nbsp; P: Blueprints &nbsp;|&nbsp; B: AI Build &nbsp;|&nbsp; Ctrl+Z: Undo &nbsp;|&nbsp; F1: Settings &nbsp;|&nbsp; F2: Save
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUIStore } from '@/stores/ui'
import { sound } from '@/engine/audio'

const settings = useSettingsStore()
const ui = useUIStore()

const isMuted = ref(false)
const currentChunk = ref({ cx: 0, cz: 0 })
const currentPlot = ref<any>(null)

const isOwner = computed(() => {
  return currentPlot.value && currentPlot.value.owner_id === settings.creatorId
})

const ownerText = computed(() => {
  if (!currentPlot.value) return 'Public Domain'
  if (isOwner.value) return 'You (Owner)'
  return currentPlot.value.owner_id
})

function toggleAudio(): void {
  isMuted.value = !isMuted.value
  sound.setMuted(isMuted.value)
}

function triggerUndo(): void {
  window.dispatchEvent(new CustomEvent('undo-build'))
}

async function fetchPlotInfo(cx: number, cz: number): Promise<void> {
  try {
    const res = await fetch(`http://localhost:4000/api/plots/${cx}/${cz}`)
    if (res.ok) {
      const data = await res.json()
      currentPlot.value = data
    }
  } catch {
    currentPlot.value = null
  }
}

async function claimPlot(): Promise<void> {
  try {
    const plotName = prompt('Enter a name for this land plot:', `Cyber Estate [${currentChunk.value.cx}, ${currentChunk.value.cz}]`)
    if (!plotName) return

    const res = await fetch('http://localhost:4000/api/plots/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cx: currentChunk.value.cx,
        cz: currentChunk.value.cz,
        owner_id: settings.creatorId || 'anonymous_pioneer',
        plot_name: plotName
      })
    })
    if (res.ok) {
      const result = await res.json()
      currentPlot.value = result.plot
      sound.playBuildComplete()
    }
  } catch (e) {
    console.error('Failed to claim plot', e)
  }
}

function onPlayerMoved(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    const ncx = Math.floor(custom.detail.x / 16)
    const ncz = Math.floor(custom.detail.z / 16)
    if (ncx !== currentChunk.value.cx || ncz !== currentChunk.value.cz) {
      currentChunk.value = { cx: ncx, cz: ncz }
      fetchPlotInfo(ncx, ncz)
    }
  }
}

onMounted(() => {
  window.addEventListener('player-position', onPlayerMoved)
  fetchPlotInfo(0, 0)
  sound.startAmbience()
})

onUnmounted(() => {
  window.removeEventListener('player-position', onPlayerMoved)
  sound.stopAmbience()
})
</script>

<style scoped>
.hud { position: fixed; inset: 0; pointer-events: none; font-family: 'Inter', system-ui, sans-serif; }

.plot-panel {
  position: absolute; top: 20px; left: 20px;
  background: rgba(12, 16, 28, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  pointer-events: auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}
.plot-header { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; color: #00ffff; }
.plot-owner { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.public-land { color: #00ff88; font-weight: 600; }
.self-owned { color: #ffd700; font-weight: 700; text-shadow: 0 0 8px rgba(255,215,0,0.5); }
.btn-claim {
  margin-top: 8px; background: rgba(0, 255, 255, 0.2); border: 1px solid #00ffff;
  color: #00ffff; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
  cursor: pointer; transition: all 0.2s;
}
.btn-claim:hover { background: #00ffff; color: #000; transform: translateY(-1px); box-shadow: 0 0 10px rgba(0,255,255,0.5); }

.top-right-bar {
  position: absolute; top: 20px; right: 20px;
  display: flex; align-items: center; gap: 10px;
  pointer-events: auto;
}

.hud-btn {
  background: rgba(12, 16, 28, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff; padding: 7px 14px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.hud-btn:hover { border-color: #00ffff; color: #00ffff; box-shadow: 0 0 10px rgba(0,255,255,0.25); }

.undo-btn {
  border-color: rgba(0, 255, 255, 0.3);
  color: #00ffff;
}
.undo-btn:hover { background: rgba(0, 255, 255, 0.2); transform: translateY(-1px); }

.audio-btn.muted { color: rgba(255,255,255,0.4); }

.provider-badge {
  background: rgba(12, 16, 28, 0.82); backdrop-filter: blur(12px);
  color: #fff; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
  border: 1px solid rgba(255,255,255,0.15);
}
.provider-badge.openai { color: #10a37f; border-color: rgba(16,163,127,0.4); text-shadow: 0 0 8px rgba(16,163,127,0.5); }
.provider-badge.gemini { color: #4285f4; border-color: rgba(66,133,244,0.4); text-shadow: 0 0 8px rgba(66,133,244,0.5); }
.provider-badge.claude { color: #f59e0b; border-color: rgba(245,158,11,0.4); text-shadow: 0 0 8px rgba(245,158,11,0.5); }

.hint {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.85); font-size: 12px; white-space: nowrap;
  background: rgba(12, 16, 28, 0.82); backdrop-filter: blur(12px);
  padding: 6px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  font-weight: 500;
}

.build-status {
  position: absolute; top: 15%; left: 50%; transform: translate(-50%, 0);
  background: rgba(0,255,255,0.15); color: #00ffff; padding: 12px 28px; border-radius: 10px;
  border: 1px solid rgba(0,255,255,0.4); backdrop-filter: blur(12px);
  font-size: 15px; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,255,0.5);
  box-shadow: 0 0 24px rgba(0,255,255,0.25);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
</style>
