import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BlockType } from '@/types/world'

export type UIMode =
  | 'game'
  | 'settings'
  | 'build-prompt'
  | 'npc-chat'
  | 'help'
  | 'build-progress'
  | 'blueprints'
  | 'inventory'
  | 'keybinds'
  | 'chain'
  | 'photo'
  | 'achievements'
  | 'tools'
  | 'export'
  | 'synth'

export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night'

export interface BuildProgressData {
  status: 'planning' | 'building' | 'done' | 'error'
  prompt: string
  tokens?: number
  estimatedMs?: number
  blocksTotal?: number
  blocksPlaced?: number
  description?: string
  message?: string
}

export const useUIStore = defineStore('ui', () => {
  const mode = ref<UIMode>('game')
  const isLocked = ref(false)
  const buildStatus = ref('')
  const currentNPCName = ref('')
  const progressData = ref<BuildProgressData | null>(null)
  const selectedBlock = ref<BlockType>('stone')
  const timeOfDay = ref<TimeOfDay>('night')

  function openSettings(): void { mode.value = 'settings' }
  function openBuildPrompt(): void { mode.value = 'build-prompt' }
  function openBlueprints(): void { mode.value = 'blueprints' }
  function openInventory(): void { mode.value = 'inventory' }
  function openKeybinds(): void { mode.value = 'keybinds' }
  function openChain(): void { mode.value = 'chain' }
  function openPhoto(): void { mode.value = 'photo' }
  function openAchievements(): void { mode.value = 'achievements' }
  function openTools(): void { mode.value = 'tools' }
  function openExport(): void { mode.value = 'export' }
  function openSynth(): void { mode.value = 'synth' }
  function openHelp(): void { mode.value = 'help' }
  function openNPCChat(name: string): void {
    currentNPCName.value = name
    mode.value = 'npc-chat'
  }
  function openBuildProgress(): void { mode.value = 'build-progress' }
  function closeOverlay(): void { mode.value = 'game' }
  function setLocked(v: boolean): void { isLocked.value = v }
  function setBuildStatus(msg: string): void { buildStatus.value = msg }
  function setProgressData(data: BuildProgressData | null): void { progressData.value = data }
  function setSelectedBlock(b: BlockType): void { selectedBlock.value = b }
  function setTimeOfDay(t: TimeOfDay): void {
    timeOfDay.value = t
    window.dispatchEvent(new CustomEvent('time-of-day', { detail: t }))
  }

  return {
    mode, isLocked, buildStatus, currentNPCName, progressData, selectedBlock, timeOfDay,
    openSettings, openBuildPrompt, openBlueprints, openInventory, openKeybinds, openChain, openPhoto, openAchievements, openTools, openExport, openSynth, openHelp, openNPCChat, openBuildProgress, closeOverlay,
    setLocked, setBuildStatus, setProgressData, setSelectedBlock, setTimeOfDay,
  }
})
