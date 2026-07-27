<template>
  <div class="app">
    <GameCanvas
      ref="gameCanvas"
      @ready="onWorldReady"
      @npc-interact="ui.openNPCChat($event)"
    />
    <HUD v-if="ui.mode === 'game'" />
    <BuildPrompt v-if="ui.mode === 'build-prompt'" @build="onBuild" />
    <NPCChat v-if="ui.mode === 'npc-chat'" />
    <SettingsPanel
      v-if="ui.mode === 'settings'"
      @save="gameCanvas?.saveWorld()"
      @export="gameCanvas?.exportWorld()"
      @import="gameCanvas?.importWorldJSON($event)"
      @clear="gameCanvas?.clearWorld()"
    />

    <!-- click-to-start overlay -->
    <div v-if="!ui.isLocked && ui.mode === 'game'" class="start-overlay">
      <div class="start-card">
        <h1>NewWorld AI Sandbox</h1>
        <p>Click to enter &nbsp;·&nbsp; WASD to move &nbsp;·&nbsp; T to build with AI</p>
        <p class="hint">Press F1 to configure your AI provider</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameCanvas from '@/components/GameCanvas.vue'
import HUD from '@/components/HUD.vue'
import BuildPrompt from '@/components/BuildPrompt.vue'
import NPCChat from '@/components/NPCChat.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { useUIStore } from '@/stores/ui'
import { WorldEngine } from '@/engine/world'
import { AIBuildResponse } from '@/types/world'

const ui = useUIStore()
const gameCanvas = ref<InstanceType<typeof GameCanvas>>()

function onWorldReady(world: WorldEngine): void {
  // auto-load saved world
  const saved = localStorage.getItem('nw_world')
  if (saved) {
    try {
      world.loadWorldData(JSON.parse(saved))
    } catch { /* ignore corrupt save */ }
  }
}

function onBuild(result: AIBuildResponse): void {
  gameCanvas.value?.applyBuild(result)
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { overflow: hidden; background: #000; }

.app { width: 100vw; height: 100vh; position: relative; }

.start-overlay {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5); z-index: 50; pointer-events: none;
}
.start-card {
  text-align: center; color: #fff; font-family: monospace;
}
.start-card h1 { font-size: 32px; margin-bottom: 12px; letter-spacing: 2px; }
.start-card p { font-size: 14px; color: rgba(255,255,255,0.7); }
.start-card .hint { margin-top: 6px; font-size: 12px; color: rgba(255,255,255,0.4); }
</style>
