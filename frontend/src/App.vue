<template>
  <div class="app">
    <GameCanvas
      ref="gameCanvas"
      @ready="onWorldReady"
      @npc-interact="ui.openNPCChat($event)"
    />
    <Transition name="fade">
      <HUD v-if="ui.mode === 'game'" />
    </Transition>
    <Transition name="fade">
      <Hotbar v-if="ui.mode === 'game'" />
    </Transition>
    <Transition name="fade">
      <BuildPrompt v-if="ui.mode === 'build-prompt'" @build="onBuild" />
    </Transition>
    <Transition name="fade">
      <BlueprintsModal v-if="ui.mode === 'blueprints'" @deploy="onDeployBlueprint" />
    </Transition>
    <Transition name="fade">
      <NPCChat v-if="ui.mode === 'npc-chat'" />
    </Transition>
    <Transition name="fade">
      <SettingsPanel
        v-if="ui.mode === 'settings'"
        @save="gameCanvas?.saveWorld()"
        @export="gameCanvas?.exportWorld()"
        @import="gameCanvas?.importWorldJSON($event)"
        @clear="gameCanvas?.clearWorld()"
      />
    </Transition>
    <Transition name="fade">
      <BuildProgress v-if="ui.mode === 'build-progress'" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameCanvas from '@/components/GameCanvas.vue'
import HUD from '@/components/HUD.vue'
import Hotbar from '@/components/Hotbar.vue'
import BuildPrompt from '@/components/BuildPrompt.vue'
import BlueprintsModal from '@/components/BlueprintsModal.vue'
import NPCChat from '@/components/NPCChat.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import BuildProgress from '@/components/BuildProgress.vue'
import { useUIStore } from '@/stores/ui'
import { WorldEngine } from '@/engine/world'
import { AIBuildResponse, BuildAction } from '@/types/world'

const ui = useUIStore()
const gameCanvas = ref<InstanceType<typeof GameCanvas>>()

onMounted(() => {
  window.addEventListener('build-progress', (e: Event) => {
    const data = (e as CustomEvent).detail
    ui.setProgressData(data)
    
    if (data.status !== 'done' && data.status !== 'error') {
      if (ui.mode !== 'build-progress') {
        ui.openBuildProgress()
      }
    }
  })
})

function onWorldReady(world: WorldEngine): void {
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

function onDeployBlueprint(actions: BuildAction[]): void {
  gameCanvas.value?.applyBuild({ description: 'Blueprint Deployment', actions })
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  overflow: hidden; 
  background: #000; 
  font-family: 'Inter', sans-serif; 
}

.app { width: 100vw; height: 100vh; position: relative; }

/* Global Glassmorphism utilities */
.glass-panel {
  background: rgba(15, 20, 30, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 12px;
  color: #fff;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
