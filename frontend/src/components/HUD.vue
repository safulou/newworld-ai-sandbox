<template>
  <div class="hud">
    <!-- crosshair -->
    <div class="crosshair">
      <div class="ch-h" /><div class="ch-v" />
    </div>

    <!-- block palette -->
    <div class="palette">
      <button
        v-for="b in blocks"
        :key="b"
        class="palette-btn"
        :class="{ active: selectedBlock === b }"
        :style="{ background: blockColor(b) }"
        :title="b"
        @click="settings.setSelectedBlock(b)"
      />
    </div>

    <!-- keybinds hint -->
    <div class="hint">
      WASD Move &nbsp;|&nbsp; Space Jump &nbsp;|&nbsp; LClick Break &nbsp;|&nbsp; RClick Place &nbsp;|&nbsp;
      T Build &nbsp;|&nbsp; E NPC &nbsp;|&nbsp; F1 Settings &nbsp;|&nbsp; F2 Save &nbsp;|&nbsp; ESC Unlock
    </div>

    <!-- build status -->
    <div v-if="ui.buildStatus" class="build-status">{{ ui.buildStatus }}</div>

    <!-- provider badge -->
    <div class="provider-badge" :class="settings.provider">
      {{ settings.provider === 'local' ? '🧱 Local AI' : `⚡ ${settings.provider}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUIStore } from '@/stores/ui'
import { BLOCK_COLORS } from '@/engine/blocks'
import { BlockType } from '@/types/world'

const settings = useSettingsStore()
const ui = useUIStore()

const blocks: BlockType[] = ['stone', 'dirt', 'grass', 'wood', 'plank', 'brick', 'glass', 'sand', 'snow', 'leaves']
const selectedBlock = computed(() => settings.selectedBlock)

function blockColor(b: BlockType): string {
  const hex = BLOCK_COLORS[b].toString(16).padStart(6, '0')
  return `#${hex}`
}
</script>

<style scoped>
.hud { position: fixed; inset: 0; pointer-events: none; font-family: monospace; }

.crosshair {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 20px; height: 20px;
}
.ch-h { position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background: rgba(255,255,255,0.8); transform: translateY(-50%); }
.ch-v { position: absolute; left: 50%; top: 0; width: 2px; height: 100%; background: rgba(255,255,255,0.8); transform: translateX(-50%); }

.palette {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 4px; pointer-events: all;
  background: rgba(0,0,0,0.5); padding: 6px; border-radius: 8px;
}
.palette-btn {
  width: 36px; height: 36px; border: 2px solid transparent; border-radius: 4px; cursor: pointer;
  transition: border-color 0.15s;
}
.palette-btn.active { border-color: #fff; }

.hint {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.6); font-size: 11px; white-space: nowrap;
}

.build-status {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% + 60px));
  background: rgba(0,0,0,0.7); color: #fff; padding: 8px 16px; border-radius: 6px;
  font-size: 14px;
}

.provider-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(0,0,0,0.6); color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 12px;
}
.provider-badge.openai { color: #10a37f; }
.provider-badge.gemini { color: #4285f4; }
.provider-badge.claude { color: #d97706; }
</style>
