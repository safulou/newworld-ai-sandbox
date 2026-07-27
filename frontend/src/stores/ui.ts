import { defineStore } from 'pinia'
import { ref } from 'vue'

export type UIMode = 'game' | 'settings' | 'build-prompt' | 'npc-chat' | 'help'

export const useUIStore = defineStore('ui', () => {
  const mode = ref<UIMode>('game')
  const isLocked = ref(false)
  const buildStatus = ref('')
  const currentNPCName = ref('')

  function openSettings(): void { mode.value = 'settings' }
  function openBuildPrompt(): void { mode.value = 'build-prompt' }
  function openHelp(): void { mode.value = 'help' }
  function openNPCChat(name: string): void {
    currentNPCName.value = name
    mode.value = 'npc-chat'
  }
  function closeOverlay(): void { mode.value = 'game' }
  function setLocked(v: boolean): void { isLocked.value = v }
  function setBuildStatus(msg: string): void { buildStatus.value = msg }

  return {
    mode, isLocked, buildStatus, currentNPCName,
    openSettings, openBuildPrompt, openHelp, openNPCChat, closeOverlay, setLocked, setBuildStatus,
  }
})
