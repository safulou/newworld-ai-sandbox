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
  | 'drydock'
  | 'abyssal'
  | 'behaviorTree'
  | 'cyberdeck'
  | 'hyperjump'
  | 'netrunner-warfare'
  | 'leviathan'
  | 'supergrid'
  | 'colony-ark'
  | 'syndicate'
  | 'exosuit'
  | 'stellar-beacon'
  | 'ark-expedition'
  | 'flagship-raid'
  | 'dark-matter-rift'
  | 'dyson-sphere'
  | 'wormhole-slingshot'
  | 'world-titan'
  | 'neural-mind'
  | 'quantum-broadcast'
  | 'singularity'
  | 'stargate'
  | 'council'
  | 'genome-forge'
  | 'kardashev'
  | 'dyson-swarm'
  | 'planetary-core'
  | 'chrono'
  | 'multiverse'
  | 'ringworld'
  | 'genesis-oracle'
  | 'string-fold'
  | 'vacuum-ward'
  | 'primordial-nebula'
  | 'starchart'
  | 'tachyonic'
  | 'neutrino-detector'
  | 'quark-plasma'
  | 'spinfoam'
  | 'holographic-horizon'
  | 'wormhole-bridge'
  | 'gut-collider'
  | 'topological-chern'
  | 'cosmic-string'
  | 'antimatter-propulsion'
  | 'axion-haloscope'
  | 'time-reversal-radar'
  | 'string-net'
  | 'supergravity-spinor'
  | 'penrose-ccc'
  | 'quantum-anomalous-hall'
  | 'fermionic-dark-matter'
  | 'rainbow-graviton'
  | 'acoustic-black-hole'
  | 'scarred-time-crystal'
  | 'corner-state'
  | 'casimir-torque'
  | 'anyon-holographic'
  | 'relativistic-teleport'
  | 'planck-vacuum'

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
  function openDrydock(): void { mode.value = 'drydock' }
  function openAbyssal(): void { mode.value = 'abyssal' }
  function openBehaviorTree(): void { mode.value = 'behaviorTree' }
  function openCyberdeck(): void { mode.value = 'cyberdeck' }
  function openHyperjump(): void { mode.value = 'hyperjump' }
  function openNetrunnerWarfare(): void { mode.value = 'netrunner-warfare' }
  function openLeviathan(): void { mode.value = 'leviathan' }
  function openSupergrid(): void { mode.value = 'supergrid' }
  function openColonyArk(): void { mode.value = 'colony-ark' }
  function openSyndicate(): void { mode.value = 'syndicate' }
  function openExosuit(): void { mode.value = 'exosuit' }
  function openStellarBeacon(): void { mode.value = 'stellar-beacon' }
  function openArkExpedition(): void { mode.value = 'ark-expedition' }
  function openFlagshipRaid(): void { mode.value = 'flagship-raid' }
  function openDarkMatterRift(): void { mode.value = 'dark-matter-rift' }
  function openDysonSphere(): void { mode.value = 'dyson-sphere' }
  function openWormholeSlingshot(): void { mode.value = 'wormhole-slingshot' }
  function openWorldTitan(): void { mode.value = 'world-titan' }
  function openNeuralMind(): void { mode.value = 'neural-mind' }
  function openQuantumBroadcast(): void { mode.value = 'quantum-broadcast' }
  function openSingularity(): void { mode.value = 'singularity' }
  function openStargate(): void { mode.value = 'stargate' }
  function openCouncil(): void { mode.value = 'council' }
  function openGenomeForge(): void { mode.value = 'genome-forge' }
  function openKardashev(): void { mode.value = 'kardashev' }
  function openDysonSwarm(): void { mode.value = 'dyson-swarm' }
  function openPlanetaryCore(): void { mode.value = 'planetary-core' }
  function openChrono(): void { mode.value = 'chrono' }
  function openMultiverse(): void { mode.value = 'multiverse' }
  function openRingworld(): void { mode.value = 'ringworld' }
  function openGenesisOracle(): void { mode.value = 'genesis-oracle' }
  function openStringFold(): void { mode.value = 'string-fold' }
  function openVacuumWard(): void { mode.value = 'vacuum-ward' }
  function openPrimordialNebula(): void { mode.value = 'primordial-nebula' }
  function openStarchart(): void { mode.value = 'starchart' }
  function openTachyonic(): void { mode.value = 'tachyonic' }
  function openNeutrinoDetector(): void { mode.value = 'neutrino-detector' }
  function openQuarkPlasma(): void { mode.value = 'quark-plasma' }
  function openSpinfoam(): void { mode.value = 'spinfoam' }
  function openHolographicHorizon(): void { mode.value = 'holographic-horizon' }
  function setNeutrinoDetectorModal(open: boolean): void { mode.value = open ? 'neutrino-detector' : 'game' }
  function setQuarkPlasmaModal(open: boolean): void { mode.value = open ? 'quark-plasma' : 'game' }
  function setSpinfoamModal(open: boolean): void { mode.value = open ? 'spinfoam' : 'game' }
  function setHolographicHorizonModal(open: boolean): void { mode.value = open ? 'holographic-horizon' : 'game' }
  function openWormholeBridge(): void { mode.value = 'wormhole-bridge' }
  function openGutCollider(): void { mode.value = 'gut-collider' }
  function openTopologicalChern(): void { mode.value = 'topological-chern' }
  function openCosmicString(): void { mode.value = 'cosmic-string' }
  function openAntimatterPropulsion(): void { mode.value = 'antimatter-propulsion' }
  function openAxionHaloscope(): void { mode.value = 'axion-haloscope' }
  function openTimeReversalRadar(): void { mode.value = 'time-reversal-radar' }
  function openStringNet(): void { mode.value = 'string-net' }
  function openSupergravitySpinor(): void { mode.value = 'supergravity-spinor' }
  function openPenroseCCC(): void { mode.value = 'penrose-ccc' }
  function openQuantumAnomalousHall(): void { mode.value = 'quantum-anomalous-hall' }
  function openFermionicDarkMatter(): void { mode.value = 'fermionic-dark-matter' }
  function openRainbowGraviton(): void { mode.value = 'rainbow-graviton' }
  function openAcousticBlackHole(): void { mode.value = 'acoustic-black-hole' }
  function openScarredTimeCrystal(): void { mode.value = 'scarred-time-crystal' }
  function openCornerState(): void { mode.value = 'corner-state' }
  function openCasimirTorque(): void { mode.value = 'casimir-torque' }
  function openAnyonHolographic(): void { mode.value = 'anyon-holographic' }
  function openRelativisticTeleport(): void { mode.value = 'relativistic-teleport' }
  function openPlanckVacuum(): void { mode.value = 'planck-vacuum' }
  function setWormholeBridgeModal(open: boolean): void { mode.value = open ? 'wormhole-bridge' : 'game' }
  function setGutColliderModal(open: boolean): void { mode.value = open ? 'gut-collider' : 'game' }
  function setTopologicalChernModal(open: boolean): void { mode.value = open ? 'topological-chern' : 'game' }
  function setCosmicStringModal(open: boolean): void { mode.value = open ? 'cosmic-string' : 'game' }
  function setAntimatterPropulsionModal(open: boolean): void { mode.value = open ? 'antimatter-propulsion' : 'game' }
  function setAxionHaloscopeModal(open: boolean): void { mode.value = open ? 'axion-haloscope' : 'game' }
  function setTimeReversalRadarModal(open: boolean): void { mode.value = open ? 'time-reversal-radar' : 'game' }
  function setStringNetModal(open: boolean): void { mode.value = open ? 'string-net' : 'game' }
  function setSupergravitySpinorModal(open: boolean): void { mode.value = open ? 'supergravity-spinor' : 'game' }
  function setPenroseCCCModal(open: boolean): void { mode.value = open ? 'penrose-ccc' : 'game' }
  function setQuantumAnomalousHallModal(open: boolean): void { mode.value = open ? 'quantum-anomalous-hall' : 'game' }
  function setFermionicDarkMatterModal(open: boolean): void { mode.value = open ? 'fermionic-dark-matter' : 'game' }
  function setRainbowGravitonModal(open: boolean): void { mode.value = open ? 'rainbow-graviton' : 'game' }
  function setAcousticBlackHoleModal(open: boolean): void { mode.value = open ? 'acoustic-black-hole' : 'game' }
  function setScarredTimeCrystalModal(open: boolean): void { mode.value = open ? 'scarred-time-crystal' : 'game' }
  function setCornerStateModal(open: boolean): void { mode.value = open ? 'corner-state' : 'game' }
  function setCasimirTorqueModal(open: boolean): void { mode.value = open ? 'casimir-torque' : 'game' }
  function setAnyonHolographicModal(open: boolean): void { mode.value = open ? 'anyon-holographic' : 'game' }
  function setRelativisticTeleportModal(open: boolean): void { mode.value = open ? 'relativistic-teleport' : 'game' }
  function setPlanckVacuumModal(open: boolean): void { mode.value = open ? 'planck-vacuum' : 'game' }
  function setMode(m: UIMode): void { mode.value = m }
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
  function setDrydockModal(open: boolean): void { mode.value = open ? 'drydock' : 'game' }
  function setAbyssalModal(open: boolean): void { mode.value = open ? 'abyssal' : 'game' }
  function setBehaviorTreeModal(open: boolean): void { mode.value = open ? 'behaviorTree' : 'game' }
  function setCyberdeckModal(open: boolean): void { mode.value = open ? 'cyberdeck' : 'game' }
  function setHyperjumpModal(open: boolean): void { mode.value = open ? 'hyperjump' : 'game' }
  function setNetrunnerWarfareModal(open: boolean): void { mode.value = open ? 'netrunner-warfare' : 'game' }
  function setLeviathanModal(open: boolean): void { mode.value = open ? 'leviathan' : 'game' }
  function setSupergridModal(open: boolean): void { mode.value = open ? 'supergrid' : 'game' }
  function setColonyArkModal(open: boolean): void { mode.value = open ? 'colony-ark' : 'game' }
  function setSyndicateModal(open: boolean): void { mode.value = open ? 'syndicate' : 'game' }
  function setExosuitModal(open: boolean): void { mode.value = open ? 'exosuit' : 'game' }
  function setStellarBeaconModal(open: boolean): void { mode.value = open ? 'stellar-beacon' : 'game' }
  function setArkExpeditionModal(open: boolean): void { mode.value = open ? 'ark-expedition' : 'game' }
  function setFlagshipRaidModal(open: boolean): void { mode.value = open ? 'flagship-raid' : 'game' }
  function setDarkMatterRiftModal(open: boolean): void { mode.value = open ? 'dark-matter-rift' : 'game' }
  function setDysonSphereModal(open: boolean): void { mode.value = open ? 'dyson-sphere' : 'game' }
  function setWormholeSlingshotModal(open: boolean): void { mode.value = open ? 'wormhole-slingshot' : 'game' }
  function setWorldTitanModal(open: boolean): void { mode.value = open ? 'world-titan' : 'game' }
  function setNeuralMindModal(open: boolean): void { mode.value = open ? 'neural-mind' : 'game' }
  function setQuantumBroadcastModal(open: boolean): void { mode.value = open ? 'quantum-broadcast' : 'game' }
  function setSingularityModal(open: boolean): void { mode.value = open ? 'singularity' : 'game' }
  function setStargateModal(open: boolean): void { mode.value = open ? 'stargate' : 'game' }
  function setCouncilModal(open: boolean): void { mode.value = open ? 'council' : 'game' }
  function setGenomeForgeModal(open: boolean): void { mode.value = open ? 'genome-forge' : 'game' }
  function setKardashevModal(open: boolean): void { mode.value = open ? 'kardashev' : 'game' }
  function setDysonSwarmModal(open: boolean): void { mode.value = open ? 'dyson-swarm' : 'game' }
  function setPlanetaryCoreModal(open: boolean): void { mode.value = open ? 'planetary-core' : 'game' }
  function setChronoModal(open: boolean): void { mode.value = open ? 'chrono' : 'game' }
  function setMultiverseModal(open: boolean): void { mode.value = open ? 'multiverse' : 'game' }
  function setRingworldModal(open: boolean): void { mode.value = open ? 'ringworld' : 'game' }
  function setGenesisOracleModal(open: boolean): void { mode.value = open ? 'genesis-oracle' : 'game' }
  function setStringFoldModal(open: boolean): void { mode.value = open ? 'string-fold' : 'game' }
  function setVacuumWardModal(open: boolean): void { mode.value = open ? 'vacuum-ward' : 'game' }
  function setPrimordialNebulaModal(open: boolean): void { mode.value = open ? 'primordial-nebula' : 'game' }
  function setStarchartModal(open: boolean): void { mode.value = open ? 'starchart' : 'game' }
  function setTachyonicModal(open: boolean): void { mode.value = open ? 'tachyonic' : 'game' }
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
    openSettings, openBuildPrompt, openBlueprints, openInventory, openKeybinds, openChain, openPhoto, openAchievements, openTools, openExport, openSynth, openPianoRoll, openSchematic, openNpcCustomizer, openQuests, openShaders, openSkins, openMinigames, openCustomBlueprints, openVoxImporter, openDrone, openSpatialVoice, openDimension, openFishing, openRail, openKinetics, openHydroponics, openVisualLogic, openFactory, openAcoustics, openSculptor, openParkour, openObservatory, openReactor, openLeaderboard, openRangers, openDrydock, openAbyssal, openBehaviorTree, openCyberdeck, openHyperjump, openNetrunnerWarfare, openLeviathan, openSupergrid, openColonyArk, openSyndicate, openExosuit, openStellarBeacon, openArkExpedition, openFlagshipRaid, openDarkMatterRift, openDysonSphere, openWormholeSlingshot, openWorldTitan, openNeuralMind, openQuantumBroadcast, openSingularity, openStargate, openCouncil, openGenomeForge, openKardashev, openDysonSwarm, openPlanetaryCore, openChrono, openMultiverse, openRingworld, openGenesisOracle, openStringFold, openVacuumWard, openPrimordialNebula, openStarchart, openTachyonic, openNeutrinoDetector, openQuarkPlasma, openSpinfoam, openHolographicHorizon, openWormholeBridge, openGutCollider, openTopologicalChern, openCosmicString, setVoxImporterModal, setDroneModal, setSpatialVoiceModal, setDimensionModal, setFishingModal, setRailModal, setKineticsModal, setHydroponicsModal, setVisualLogicModal, setFactoryModal, setAcousticsModal, setSculptorModal, setParkourModal, setObservatoryModal, setReactorModal, setLeaderboardModal, setRangersModal, setDrydockModal, setAbyssalModal, setBehaviorTreeModal, setCyberdeckModal, setHyperjumpModal, setNetrunnerWarfareModal, setLeviathanModal, setSupergridModal, setColonyArkModal, setSyndicateModal, setExosuitModal, setStellarBeaconModal, setArkExpeditionModal, setFlagshipRaidModal, setDarkMatterRiftModal, setDysonSphereModal, setWormholeSlingshotModal, setWorldTitanModal, setNeuralMindModal, setQuantumBroadcastModal, setSingularityModal, setStargateModal, setCouncilModal, setGenomeForgeModal, setKardashevModal, setDysonSwarmModal, setPlanetaryCoreModal, setChronoModal, setMultiverseModal, setRingworldModal, setGenesisOracleModal, setStringFoldModal, setVacuumWardModal, setPrimordialNebulaModal, setStarchartModal, setTachyonicModal, setNeutrinoDetectorModal, setQuarkPlasmaModal, setSpinfoamModal, setHolographicHorizonModal, setWormholeBridgeModal, setGutColliderModal, setTopologicalChernModal, setCosmicStringModal, setAntimatterPropulsionModal, setAxionHaloscopeModal, setTimeReversalRadarModal, setStringNetModal, openAntimatterPropulsion, openAxionHaloscope, openTimeReversalRadar, openStringNet, setSupergravitySpinorModal, setPenroseCCCModal, setQuantumAnomalousHallModal, setFermionicDarkMatterModal, openSupergravitySpinor, openPenroseCCC, openQuantumAnomalousHall, openFermionicDarkMatter, setRainbowGravitonModal, setAcousticBlackHoleModal, setScarredTimeCrystalModal, setCornerStateModal, openRainbowGraviton, openAcousticBlackHole, openScarredTimeCrystal, openCornerState, setCasimirTorqueModal, setAnyonHolographicModal, setRelativisticTeleportModal, setPlanckVacuumModal, openCasimirTorque, openAnyonHolographic, openRelativisticTeleport, openPlanckVacuum, setMode, openHelp, openNPCChat, openBuildProgress, closeOverlay,
    setLocked, setBuildStatus, setProgressData, setSelectedBlock, setTimeOfDay, toggleMinimap,
  }
})
