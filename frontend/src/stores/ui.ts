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
  | 'quests'
  | 'shaders'
  | 'skins'
  | 'minigames'
  | 'custom-blueprints'
  | 'vox-importer'
  | 'drone'
  | 'spatial-voice'
  | 'piano-roll'
  | 'schematic'
  | 'npc-customizer'
  | 'dimension'
  | 'fishing'
  | 'rail'
  | 'kinetics'
  | 'hydroponics'
  | 'visual-logic'
  | 'factory'
  | 'acoustics'
  | 'sculptor'
  | 'parkour'
  | 'observatory'
  | 'reactor'
  | 'leaderboard'
  | 'rangers'

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

  const isMinimapVisible = ref(true)

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
  function openPianoRoll(): void { mode.value = 'piano-roll' }
  function openSchematic(): void { mode.value = 'schematic' }
  function openNpcCustomizer(): void { mode.value = 'npc-customizer' }
  function openQuests(): void { mode.value = 'quests' }
  function openShaders(): void { mode.value = 'shaders' }
  function openSkins(): void { mode.value = 'skins' }
  function openMinigames(): void { mode.value = 'minigames' }
  function openCustomBlueprints(): void { mode.value = 'custom-blueprints' }
  function openVoxImporter(): void { mode.value = 'vox-importer' }
  function openDrone(): void { mode.value = 'drone' }
  function openSpatialVoice(): void { mode.value = 'spatial-voice' }
  function openDimension(): void { mode.value = 'dimension' }
  function openFishing(): void { mode.value = 'fishing' }
  function openRail(): void { mode.value = 'rail' }
  function openKinetics(): void { mode.value = 'kinetics' }
  function openHydroponics(): void { mode.value = 'hydroponics' }
  function openVisualLogic(): void { mode.value = 'visual-logic' }
  function openFactory(): void { mode.value = 'factory' }
  function openAcoustics(): void { mode.value = 'acoustics' }
  function openSculptor(): void { mode.value = 'sculptor' }
  function openParkour(): void { mode.value = 'parkour' }
  function openObservatory(): void { mode.value = 'observatory' }
  function openReactor(): void { mode.value = 'reactor' }
  function openLeaderboard(): void { mode.value = 'leaderboard' }
  function openRangers(): void { mode.value = 'rangers' }
  function setVoxImporterModal(open: boolean): void { mode.value = open ? 'vox-importer' : 'game' }
  function setDroneModal(open: boolean): void { mode.value = open ? 'drone' : 'game' }
  function setSpatialVoiceModal(open: boolean): void { mode.value = open ? 'spatial-voice' : 'game' }
  function setDimensionModal(open: boolean): void { mode.value = open ? 'dimension' : 'game' }
  function setFishingModal(open: boolean): void { mode.value = open ? 'fishing' : 'game' }
  function setRailModal(open: boolean): void { mode.value = open ? 'rail' : 'game' }
  function setKineticsModal(open: boolean): void { mode.value = open ? 'kinetics' : 'game' }
  function setHydroponicsModal(open: boolean): void { mode.value = open ? 'hydroponics' : 'game' }
  function setVisualLogicModal(open: boolean): void { mode.value = open ? 'visual-logic' : 'game' }
  function setFactoryModal(open: boolean): void { mode.value = open ? 'factory' : 'game' }
  function setAcousticsModal(open: boolean): void { mode.value = open ? 'acoustics' : 'game' }
  function setSculptorModal(open: boolean): void { mode.value = open ? 'sculptor' : 'game' }
  function setParkourModal(open: boolean): void { mode.value = open ? 'parkour' : 'game' }
  function setObservatoryModal(open: boolean): void { mode.value = open ? 'observatory' : 'game' }
  function setReactorModal(open: boolean): void { mode.value = open ? 'reactor' : 'game' }
  function setLeaderboardModal(open: boolean): void { mode.value = open ? 'leaderboard' : 'game' }
  function setRangersModal(open: boolean): void { mode.value = open ? 'rangers' : 'game' }
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
  function toggleMinimap(): boolean {
    isMinimapVisible.value = !isMinimapVisible.value
    return isMinimapVisible.value
  }

  return {
    mode, isLocked, buildStatus, currentNPCName, progressData, selectedBlock, timeOfDay, isMinimapVisible,
    openSettings, openBuildPrompt, openBlueprints, openInventory, openKeybinds, openChain, openPhoto, openAchievements, openTools, openExport, openSynth, openPianoRoll, openSchematic, openNpcCustomizer, openQuests, openShaders, openSkins, openMinigames, openCustomBlueprints, openVoxImporter, openDrone, openSpatialVoice, openDimension, openFishing, openRail, openKinetics, openHydroponics, openVisualLogic, openFactory, openAcoustics, openSculptor, openParkour, openObservatory, openReactor, openLeaderboard, openRangers, setVoxImporterModal, setDroneModal, setSpatialVoiceModal, setDimensionModal, setFishingModal, setRailModal, setKineticsModal, setHydroponicsModal, setVisualLogicModal, setFactoryModal, setAcousticsModal, setSculptorModal, setParkourModal, setObservatoryModal, setReactorModal, setLeaderboardModal, setRangersModal, openHelp, openNPCChat, openBuildProgress, closeOverlay,
    setLocked, setBuildStatus, setProgressData, setSelectedBlock, setTimeOfDay, toggleMinimap,
  }
})
