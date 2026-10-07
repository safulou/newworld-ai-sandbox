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
      <Minimap v-if="ui.mode === 'game'" />
    </Transition>
    <Transition name="fade">
      <MultiplayerChat v-if="ui.mode === 'game'" />
    </Transition>
    <Transition name="fade">
      <Hotbar v-if="ui.mode === 'game'" />
    </Transition>
    <Transition name="fade">
      <InventoryModal v-if="ui.mode === 'inventory'" />
    </Transition>
    <Transition name="fade">
      <KeybindsModal v-if="ui.mode === 'keybinds'" />
    </Transition>
    <Transition name="fade">
      <ToolsModal v-if="ui.mode === 'tools'" />
    </Transition>
    <Transition name="fade">
      <PhotoModeModal v-if="ui.mode === 'photo'" />
    </Transition>
    <Transition name="fade">
      <AchievementsModal v-if="ui.mode === 'achievements'" />
    </Transition>
    <Transition name="fade">
      <QuestLogModal v-if="ui.mode === 'quests'" />
    </Transition>
    <Transition name="fade">
      <ShadersModal v-if="ui.mode === 'shaders'" />
    </Transition>
    <Transition name="fade">
      <SkinCustomizerModal v-if="ui.mode === 'skins'" />
    </Transition>
    <Transition name="fade">
      <MinigamesModal
        v-if="ui.mode === 'minigames'"
        @launch-parkour="onLaunchParkour"
        @launch-laser="onLaunchLaser"
        @launch-snake="onLaunchSnake"
      />
    </Transition>
    <Transition name="fade">
      <BlueprintEditorModal
        v-if="ui.mode === 'custom-blueprints'"
        @deploy-blueprint="onDeployCustomBlueprint"
      />
    </Transition>
    <Transition name="fade">
      <VoxImporterModal
        v-if="ui.mode === 'vox-importer'"
        @deploy-vox="onDeployVox"
      />
    </Transition>
    <Transition name="fade">
      <DroneControlModal
        v-if="ui.mode === 'drone'"
        @launch-drone="onLaunchDrone"
        @recall-drone="onRecallDrone"
      />
    </Transition>
    <Transition name="fade">
      <SpatialVoiceModal v-if="ui.mode === 'spatial-voice'" />
    </Transition>
    <Transition name="fade">
      <ExportModal
        v-if="ui.mode === 'export'"
        :player-blocks="gameCanvas?.getWorldBlocks()"
      />
    </Transition>
    <Transition name="fade">
      <SynthStudioModal v-if="ui.mode === 'synth'" />
    </Transition>
    <Transition name="fade">
      <PianoRollModal v-if="ui.mode === 'piano-roll'" />
    </Transition>
    <Transition name="fade">
      <SchematicModal v-if="ui.mode === 'schematic'" />
    </Transition>
    <Transition name="fade">
      <NPCCustomizerModal v-if="ui.mode === 'npc-customizer'" />
    </Transition>
    <Transition name="fade">
      <DimensionModal v-if="ui.mode === 'dimension'" />
    </Transition>
    <Transition name="fade">
      <FishingModal v-if="ui.mode === 'fishing'" />
    </Transition>
    <Transition name="fade">
      <RailTransitModal v-if="ui.mode === 'rail'" />
    </Transition>
    <Transition name="fade">
      <KineticsModal v-if="ui.mode === 'kinetics'" />
    </Transition>
    <Transition name="fade">
      <HydroponicsModal v-if="ui.mode === 'hydroponics'" />
    </Transition>
    <Transition name="fade">
      <VisualLogicModal v-if="ui.mode === 'visual-logic'" />
    </Transition>
    <Transition name="fade">
      <FactoryModal v-if="ui.mode === 'factory'" />
    </Transition>
    <Transition name="fade">
      <AcousticsModal v-if="ui.mode === 'acoustics'" />
    </Transition>
    <Transition name="fade">
      <HoloProjectorModal v-if="ui.mode === 'sculptor'" />
    </Transition>
    <Transition name="fade">
      <ParkourModal v-if="ui.mode === 'parkour'" />
    </Transition>
    <Transition name="fade">
      <ObservatoryModal v-if="ui.mode === 'observatory'" />
    </Transition>
    <Transition name="fade">
      <ReactorModal v-if="ui.mode === 'reactor'" />
    </Transition>
    <Transition name="fade">
      <LeaderboardModal v-if="ui.mode === 'leaderboard'" />
    </Transition>
    <Transition name="fade">
      <RangerModal v-if="ui.mode === 'rangers'" />
    </Transition>
    <Transition name="fade">
      <DrydockModal v-if="ui.mode === 'drydock'" />
    </Transition>
    <Transition name="fade">
      <AbyssalModal v-if="ui.mode === 'abyssal'" />
    </Transition>
    <Transition name="fade">
      <BehaviorTreeModal v-if="ui.mode === 'behaviorTree'" />
    </Transition>
    <Transition name="fade">
      <CyberdeckModal v-if="ui.mode === 'cyberdeck'" />
    </Transition>
    <Transition name="fade">
      <HyperjumpModal v-if="ui.mode === 'hyperjump'" />
    </Transition>
    <Transition name="fade">
      <NetrunnerWarfareModal v-if="ui.mode === 'netrunner-warfare'" />
    </Transition>
    <Transition name="fade">
      <LeviathanModal v-if="ui.mode === 'leviathan'" />
    </Transition>
    <Transition name="fade">
      <SupergridModal v-if="ui.mode === 'supergrid'" />
    </Transition>
    <Transition name="fade">
      <ColonyArkModal v-if="ui.mode === 'colony-ark'" />
    </Transition>
    <Transition name="fade">
      <SyndicateModal v-if="ui.mode === 'syndicate'" />
    </Transition>
    <Transition name="fade">
      <ExosuitModal v-if="ui.mode === 'exosuit'" />
    </Transition>
    <Transition name="fade">
      <BeaconModal v-if="ui.mode === 'stellar-beacon'" />
    </Transition>
    <Transition name="fade">
      <FleetExpeditionModal v-if="ui.mode === 'ark-expedition'" />
    </Transition>
    <Transition name="fade">
      <FlagshipRaidModal v-if="ui.mode === 'flagship-raid'" />
    </Transition>
    <Transition name="fade">
      <DarkMatterRiftModal v-if="ui.mode === 'dark-matter-rift'" />
    </Transition>
    <Transition name="fade">
      <DysonSphereModal v-if="ui.mode === 'dyson-sphere'" />
    </Transition>
    <Transition name="fade">
      <SlingshotModal v-if="ui.mode === 'wormhole-slingshot'" />
    </Transition>
    <Transition name="fade">
      <TitanInvasionModal v-if="ui.mode === 'world-titan'" />
    </Transition>
    <Transition name="fade">
      <ConsciousnessModal v-if="ui.mode === 'neural-mind'" />
    </Transition>
    <Transition name="fade">
      <BroadcastModal v-if="ui.mode === 'quantum-broadcast'" />
    </Transition>
    <Transition name="fade">
      <SingularityModal v-if="ui.mode === 'singularity'" />
    </Transition>
    <Transition name="fade">
      <StargateModal v-if="ui.mode === 'stargate'" />
    </Transition>
    <Transition name="fade">
      <CouncilModal v-if="ui.mode === 'council'" />
    </Transition>
    <Transition name="fade">
      <GenomeForgeModal v-if="ui.mode === 'genome-forge'" />
    </Transition>
    <Transition name="fade">
      <KardashevModal v-if="ui.mode === 'kardashev'" />
    </Transition>
    <Transition name="fade">
      <DysonSwarmModal v-if="ui.mode === 'dyson-swarm'" />
    </Transition>
    <Transition name="fade">
      <PlanetaryCoreModal v-if="ui.mode === 'planetary-core'" />
    </Transition>
    <Transition name="fade">
      <ChronoModal v-if="ui.mode === 'chrono'" />
    </Transition>
    <Transition name="fade">
      <MultiverseModal v-if="ui.mode === 'multiverse'" />
    </Transition>
    <Transition name="fade">
      <RingworldModal v-if="ui.mode === 'ringworld'" />
    </Transition>
    <Transition name="fade">
      <GenesisOracleModal v-if="ui.mode === 'genesis-oracle'" />
    </Transition>
    <Transition name="fade">
      <StringFoldModal v-if="ui.mode === 'string-fold'" />
    </Transition>
    <Transition name="fade">
      <VacuumWardModal v-if="ui.mode === 'vacuum-ward'" />
    </Transition>
    <Transition name="fade">
      <PrimordialNebulaModal v-if="ui.mode === 'primordial-nebula'" />
    </Transition>
    <Transition name="fade">
      <StarchartModal v-if="ui.mode === 'starchart'" />
    </Transition>
    <Transition name="fade">
      <TachyonicModal v-if="ui.mode === 'tachyonic'" />
    </Transition>
    <Transition name="fade">
      <NeutrinoDetectorModal v-if="ui.mode === 'neutrino-detector'" />
    </Transition>
    <Transition name="fade">
      <QuarkPlasmaModal v-if="ui.mode === 'quark-plasma'" />
    </Transition>
    <Transition name="fade">
      <SpinfoamModal v-if="ui.mode === 'spinfoam'" />
    </Transition>
    <Transition name="fade">
      <HolographicHorizonModal v-if="ui.mode === 'holographic-horizon'" />
    </Transition>
    <Transition name="fade">
      <WormholeBridgeModal v-if="ui.mode === 'wormhole-bridge'" />
    </Transition>
    <Transition name="fade">
      <GutColliderModal v-if="ui.mode === 'gut-collider'" />
    </Transition>
    <Transition name="fade">
      <TopologicalChernModal v-if="ui.mode === 'topological-chern'" />
    </Transition>
    <Transition name="fade">
      <CosmicStringModal v-if="ui.mode === 'cosmic-string'" />
    </Transition>
    <Transition name="fade">
      <AntimatterPropulsionModal v-if="ui.mode === 'antimatter-propulsion'" />
    </Transition>
    <Transition name="fade">
      <AxionHaloscopeModal v-if="ui.mode === 'axion-haloscope'" />
    </Transition>
    <Transition name="fade">
      <TimeReversalRadarModal v-if="ui.mode === 'time-reversal-radar'" />
    </Transition>
    <Transition name="fade">
      <StringNetModal v-if="ui.mode === 'string-net'" />
    </Transition>
    <Transition name="fade">
      <SupergravitySpinorModal v-if="ui.mode === 'supergravity-spinor'" />
    </Transition>
    <Transition name="fade">
      <PenroseCCCModal v-if="ui.mode === 'penrose-ccc'" />
    </Transition>
    <Transition name="fade">
      <QuantumAnomalousHallModal v-if="ui.mode === 'quantum-anomalous-hall'" />
    </Transition>
    <Transition name="fade">
      <FermionicDarkMatterModal v-if="ui.mode === 'fermionic-dark-matter'" />
    </Transition>
    <Transition name="fade">
      <RainbowGravitonModal v-if="ui.mode === 'rainbow-graviton'" />
    </Transition>
    <Transition name="fade">
      <AcousticBlackHoleModal v-if="ui.mode === 'acoustic-black-hole'" />
    </Transition>
    <Transition name="fade">
      <ScarredTimeCrystalModal v-if="ui.mode === 'scarred-time-crystal'" />
    </Transition>
    <Transition name="fade">
      <CornerStateModal v-if="ui.mode === 'corner-state'" />
    </Transition>
    <Transition name="fade">
      <CasimirTorqueModal v-if="ui.mode === 'casimir-torque'" />
    </Transition>
    <Transition name="fade">
      <AnyonHolographicModal v-if="ui.mode === 'anyon-holographic'" />
    </Transition>
    <Transition name="fade">
      <RelativisticTeleportModal v-if="ui.mode === 'relativistic-teleport'" />
    </Transition>
    <Transition name="fade">
      <PlanckVacuumCavityModal v-if="ui.mode === 'planck-vacuum'" />
    </Transition>
    <Transition name="fade">
      <ChainExplorer v-if="ui.mode === 'chain'" />
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
    <ProfilerHUD />
    <MobileControls />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameCanvas from '@/components/GameCanvas.vue'
import HUD from '@/components/HUD.vue'
import ProfilerHUD from '@/components/ProfilerHUD.vue'
import MobileControls from '@/components/MobileControls.vue'
import Minimap from '@/components/Minimap.vue'
import MultiplayerChat from '@/components/MultiplayerChat.vue'
import Hotbar from '@/components/Hotbar.vue'
import InventoryModal from '@/components/InventoryModal.vue'
import KeybindsModal from '@/components/KeybindsModal.vue'
import ToolsModal from '@/components/ToolsModal.vue'
import PhotoModeModal from '@/components/PhotoModeModal.vue'
import AchievementsModal from '@/components/AchievementsModal.vue'
import QuestLogModal from '@/components/QuestLogModal.vue'
import ShadersModal from '@/components/ShadersModal.vue'
import SkinCustomizerModal from '@/components/SkinCustomizerModal.vue'
import MinigamesModal from '@/components/MinigamesModal.vue'
import BlueprintEditorModal from '@/components/BlueprintEditorModal.vue'
import VoxImporterModal from '@/components/VoxImporterModal.vue'
import DroneControlModal from '@/components/DroneControlModal.vue'
import SpatialVoiceModal from '@/components/SpatialVoiceModal.vue'
import ExportModal from '@/components/ExportModal.vue'
import SynthStudioModal from '@/components/SynthStudioModal.vue'
import PianoRollModal from '@/components/PianoRollModal.vue'
import SchematicModal from '@/components/SchematicModal.vue'
import NPCCustomizerModal from '@/components/NPCCustomizerModal.vue'
import DimensionModal from '@/components/DimensionModal.vue'
import FishingModal from '@/components/FishingModal.vue'
import RailTransitModal from '@/components/RailTransitModal.vue'
import KineticsModal from '@/components/KineticsModal.vue'
import HydroponicsModal from '@/components/HydroponicsModal.vue'
import VisualLogicModal from '@/components/VisualLogicModal.vue'
import FactoryModal from '@/components/FactoryModal.vue'
import AcousticsModal from '@/components/AcousticsModal.vue'
import HoloProjectorModal from '@/components/HoloProjectorModal.vue'
import ParkourModal from '@/components/ParkourModal.vue'
import ObservatoryModal from '@/components/ObservatoryModal.vue'
import ReactorModal from '@/components/ReactorModal.vue'
import LeaderboardModal from '@/components/LeaderboardModal.vue'
import RangerModal from '@/components/RangerModal.vue'
import DrydockModal from '@/components/DrydockModal.vue'
import AbyssalModal from '@/components/AbyssalModal.vue'
import BehaviorTreeModal from '@/components/BehaviorTreeModal.vue'
import CyberdeckModal from '@/components/CyberdeckModal.vue'
import HyperjumpModal from '@/components/HyperjumpModal.vue'
import NetrunnerWarfareModal from '@/components/NetrunnerWarfareModal.vue'
import LeviathanModal from '@/components/LeviathanModal.vue'
import SupergridModal from '@/components/SupergridModal.vue'
import ColonyArkModal from '@/components/ColonyArkModal.vue'
import SyndicateModal from '@/components/SyndicateModal.vue'
import ExosuitModal from '@/components/ExosuitModal.vue'
import BeaconModal from '@/components/BeaconModal.vue'
import FleetExpeditionModal from '@/components/FleetExpeditionModal.vue'
import FlagshipRaidModal from '@/components/FlagshipRaidModal.vue'
import DarkMatterRiftModal from '@/components/DarkMatterRiftModal.vue'
import DysonSphereModal from '@/components/DysonSphereModal.vue'
import SlingshotModal from '@/components/SlingshotModal.vue'
import TitanInvasionModal from '@/components/TitanInvasionModal.vue'
import ConsciousnessModal from '@/components/ConsciousnessModal.vue'
import BroadcastModal from '@/components/BroadcastModal.vue'
import SingularityModal from '@/components/SingularityModal.vue'
import StargateModal from '@/components/StargateModal.vue'
import CouncilModal from '@/components/CouncilModal.vue'
import GenomeForgeModal from '@/components/GenomeForgeModal.vue'
import KardashevModal from '@/components/KardashevModal.vue'
import DysonSwarmModal from '@/components/DysonSwarmModal.vue'
import PlanetaryCoreModal from '@/components/PlanetaryCoreModal.vue'
import ChronoModal from '@/components/ChronoModal.vue'
import MultiverseModal from '@/components/MultiverseModal.vue'
import RingworldModal from '@/components/RingworldModal.vue'
import GenesisOracleModal from '@/components/GenesisOracleModal.vue'
import StringFoldModal from '@/components/StringFoldModal.vue'
import VacuumWardModal from '@/components/VacuumWardModal.vue'
import PrimordialNebulaModal from '@/components/PrimordialNebulaModal.vue'
import StarchartModal from '@/components/StarchartModal.vue'
import TachyonicModal from '@/components/TachyonicModal.vue'
import NeutrinoDetectorModal from '@/components/NeutrinoDetectorModal.vue'
import QuarkPlasmaModal from '@/components/QuarkPlasmaModal.vue'
import SpinfoamModal from '@/components/SpinfoamModal.vue'
import HolographicHorizonModal from '@/components/HolographicHorizonModal.vue'
import WormholeBridgeModal from '@/components/WormholeBridgeModal.vue'
import GutColliderModal from '@/components/GutColliderModal.vue'
import TopologicalChernModal from '@/components/TopologicalChernModal.vue'
import CosmicStringModal from '@/components/CosmicStringModal.vue'
import AntimatterPropulsionModal from '@/components/AntimatterPropulsionModal.vue'
import AxionHaloscopeModal from '@/components/AxionHaloscopeModal.vue'
import TimeReversalRadarModal from '@/components/TimeReversalRadarModal.vue'
import StringNetModal from '@/components/StringNetModal.vue'
import SupergravitySpinorModal from '@/components/SupergravitySpinorModal.vue'
import PenroseCCCModal from '@/components/PenroseCCCModal.vue'
import QuantumAnomalousHallModal from '@/components/QuantumAnomalousHallModal.vue'
import FermionicDarkMatterModal from '@/components/FermionicDarkMatterModal.vue'
import RainbowGravitonModal from '@/components/RainbowGravitonModal.vue'
import AcousticBlackHoleModal from '@/components/AcousticBlackHoleModal.vue'
import ScarredTimeCrystalModal from '@/components/ScarredTimeCrystalModal.vue'
import CornerStateModal from '@/components/CornerStateModal.vue'
import CasimirTorqueModal from '@/components/CasimirTorqueModal.vue'
import AnyonHolographicModal from '@/components/AnyonHolographicModal.vue'
import RelativisticTeleportModal from '@/components/RelativisticTeleportModal.vue'
import PlanckVacuumCavityModal from '@/components/PlanckVacuumCavityModal.vue'

import ChainExplorer from '@/components/ChainExplorer.vue'
import BuildPrompt from '@/components/BuildPrompt.vue'
import BlueprintsModal from '@/components/BlueprintsModal.vue'
import NPCChat from '@/components/NPCChat.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import BuildProgress from '@/components/BuildProgress.vue'
import { useUIStore } from '@/stores/ui'
import { WorldEngine } from '@/engine/world'
import { AIBuildResponse, BuildAction, BlockPlacement } from '@/types/world'
import { minigames } from '@/engine/minigames'
import { CustomBlueprint } from '@/engine/schematic'
import { droneManager } from '@/engine/drone'

const ui = useUIStore()
const gameCanvas = ref<InstanceType<typeof GameCanvas>>()

onMounted(() => {
  window.addEventListener('build-progress', (e: Event) => {
    const data = (e as CustomEvent).detail
    ui.setProgressData(data)
    
    if (data.status !== 'done' && data.status !== 'completed' && data.status !== 'error') {
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

function onDeployCustomBlueprint(bp: CustomBlueprint): void {
  gameCanvas.value?.applyBuild({ description: bp.name, actions: bp.actions })
}

function onDeployVox(blocks: BlockPlacement[]): void {
  const actions: BuildAction[] = blocks.map(b => ({
    type: 'place_block',
    position: [b.x, b.y, b.z],
    material: b.type,
  }))
  gameCanvas.value?.applyBuild({ description: 'MagicaVoxel Model', actions })
}

function onLaunchDrone(): void {
  const pos = gameCanvas.value?.getPlayerPosition()
  if (pos) {
    droneManager.launch(pos)
  }
}

function onRecallDrone(): void {
  droneManager.recall()
}

function onLaunchParkour(): void {
  const actions = minigames.generateParkourCourse({ x: 0, y: 15, z: 0 })
  gameCanvas.value?.applyBuild({ description: 'Neon Parkour Arena', actions })
}

function onLaunchLaser(): void {
  const pos = gameCanvas.value?.getPlayerPosition() || { x: 0, y: 0, z: 0 }
  const actions = minigames.generateLaserArena(pos)
  gameCanvas.value?.applyBuild({ description: 'Cyber Laser PvP Arena', actions })
}

function onLaunchSnake(): void {
  const pos = gameCanvas.value?.getPlayerPosition() || { x: 0, y: 0, z: 0 }
  const actions = minigames.generateSnakeArena(pos)
  gameCanvas.value?.applyBuild({ description: '3D Voxel Snake Arena', actions })
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
  transform: translateY(10px) scale(0.98);
}
</style>
