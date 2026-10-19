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
  | 'topological-supersolid'
  | 'primordial-gw'
  | 'aharonov-bohm'
  | 'weyl-chiral'
  | 'exciton-polariton'
  | 'floquet-time-crystal'
  | 'hawking-unruh'
  | 'aharonov-casher'
  | 'spinor-skyrmion'
  | 'exceptional-point'
  | 'majorana-braiding'
  | 'kaluza-klein'
  | 'moire-flatband'
  | 'gw-memory'
  | 'antiferro-magnon'
  | 'holographic-wormhole'
  | 'chiral-pump'
  | 'gw-spin-memory'
  | 'hinge-majorana'
  | 'quantum-island'
  | 'spin-liquid'
  | 'kerr-shadow'
  | 'repulsive-casimir'
  | 'multi-wormhole'
  | 'fractional-hall'
  | 'thz-josephson'
  | 'axion-insulator'
  | 'holo-complexity'
  | 'chiral-superfluid'
  | 'quantum-spin-hall'
  | 'kerr-comb'
  | 'holo-weyl-fluid'
  | 'modular-vacuum'
  | 'multichannel-kondo'
  | 'birefringent-lens'
  | 'holo-microstate'
  | 'fibonacci-anyon'
  | 'celestial-bms'
  | 'floquet-andreev'
  | 'quantum-metric'
  | 'twisted-polariton'
  | 'wigner-crystal'
  | 'desitter-holo'
  | 'chiral-phonon'
  | 'axion-cherenkov'
  | 'four-d-quantum-hall'
  | 'parafermion-modes'
  | 'calabi-yau-moduli'
  | 'hawking-page-ads'
  | 'axion-ti-witten'
  | 'parisi-spin-glass'
  | 'non-abelian-vortex'
  | 'aa-geometric-phase'
  | 'gravito-electromagnetism'
  | 'weyl-fermi-arc'
  | 'd-brane-dbi'
  | 'topological-kondo'
  | 'magnetar-qed'
  | 'holographic-superconductor'
  | 'instanton-vacuum'
  | 'schwinger-vacuum'
  | 'black-hole-superradiance'
  | 'strange-metal-syk'
  | 'quantum-spin-hall-soliton'
  | 'dynamical-casimir'
  | 'hall-viscosity'
  | 'gravitational-anomaly'
  | 'magic-angle-graphene'
  | 'superfluid-helium3'
  | 'chiral-majorana'
  | 'black-hole-echoes'
  | 'composite-fermion'
  | 'disorder-anderson'
  | 'rotating-bec'
  | 'surface-code'
  | 'holographic-negativity'
  | 'dirac-klein'
  | 'spin-orbit-bec'
  | 'axion-polariton'
  | 'page-island'
  | 'fractional-chern'
  | 'floquet-lzsm'
  | 'kerr-newman'
  | 'holo-c-theorem'
  | 'vortex-hall'
  | 'floquet-time-crystal-majorana'
  | 'tachyonic-reconnection'
  | 'holo-chaos'
  | 'moire-exciton-bec'
  | 'non-abelian-spin-superfluid'
  | 'planckian-inflation-holo'
  | 'topological-laser'
  | 'fractional-qsh-spin-liquid'
  | 'majorana-josephson-diode'
  | 'holographic-hyper-entangled-lens'
  | 'higher-order-fractal-time-crystal'
  | 'fractional-hall-stripe-liquid-crystal'
  | 'weyl-superconducting-diode-network'
  | 'micro-black-hole-teleportation'
  | 'soc-fractal-weyl-time-crystal'
  | 'non-hermitian-abelian-higgs'
  | 'dynamical-spin-polaron-gel'
  | 'holographic-gravitational-wave'
  | 'four-d-topological-hyper-crystal'
  | 'non-abelian-fractal-hots'
  | 'weyl-chiral-gravitational-fluid'
  | 'quantum-polariton-lattice'
  | 'spinor-soliton-collider'
  | 'superconducting-fluxon-knot'
  | 'topological-spin-mobius'
  | 'holographic-casimir-wormhole'
  | 'susy-qcd-monopole-bec'
  | 'non-hermitian-hopf-skin'
  | 'fractal-quantum-spin-liquid'
  | 'gravitational-alfven-soliton'
  | 'bose-fermi-exciton-supersolid'
  | 'topological-chiral-weyl-phonon'
  | 'holographic-yang-mills-tensor'
  | 'spin-orbital-octupole'
  | 'laser-wakefield-quantum-radiation'

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
  function openTopologicalSupersolid(): void { mode.value = 'topological-supersolid' }
  function openPrimordialGW(): void { mode.value = 'primordial-gw' }
  function openAharonovBohm(): void { mode.value = 'aharonov-bohm' }
  function openWeylChiral(): void { mode.value = 'weyl-chiral' }
  function openExcitonPolariton(): void { mode.value = 'exciton-polariton' }
  function openFloquetTimeCrystal(): void { mode.value = 'floquet-time-crystal' }
  function openHawkingUnruh(): void { mode.value = 'hawking-unruh' }
  function openAharonovCasher(): void { mode.value = 'aharonov-casher' }
  function openSpinorSkyrmion(): void { mode.value = 'spinor-skyrmion' }
  function openExceptionalPoint(): void { mode.value = 'exceptional-point' }
  function openMajoranaBraiding(): void { mode.value = 'majorana-braiding' }
  function openKaluzaKlein(): void { mode.value = 'kaluza-klein' }
  function openMoireFlatBand(): void { mode.value = 'moire-flatband' }
  function openGWMemory(): void { mode.value = 'gw-memory' }
  function openAntiferroMagnon(): void { mode.value = 'antiferro-magnon' }
  function openHolographicWormhole(): void { mode.value = 'holographic-wormhole' }
  function openChiralPump(): void { mode.value = 'chiral-pump' }
  function openGWSpinMemory(): void { mode.value = 'gw-spin-memory' }
  function openHingeMajorana(): void { mode.value = 'hinge-majorana' }
  function openQuantumIsland(): void { mode.value = 'quantum-island' }
  function openSpinLiquid(): void { mode.value = 'spin-liquid' }
  function setSpinLiquidModal(open: boolean): void { mode.value = open ? 'spin-liquid' : 'game' }
  function setSpinLiquidOpen(open: boolean): void { mode.value = open ? 'spin-liquid' : 'game' }
  function openKerrShadow(): void { mode.value = 'kerr-shadow' }
  function setKerrShadowModal(open: boolean): void { mode.value = open ? 'kerr-shadow' : 'game' }
  function setKerrShadowOpen(open: boolean): void { mode.value = open ? 'kerr-shadow' : 'game' }
  function openRepulsiveCasimir(): void { mode.value = 'repulsive-casimir' }
  function setRepulsiveCasimirModal(open: boolean): void { mode.value = open ? 'repulsive-casimir' : 'game' }
  function setRepulsiveCasimirOpen(open: boolean): void { mode.value = open ? 'repulsive-casimir' : 'game' }
  function openMultiWormhole(): void { mode.value = 'multi-wormhole' }
  function setMultiWormholeModal(open: boolean): void { mode.value = open ? 'multi-wormhole' : 'game' }
  function setMultiWormholeOpen(open: boolean): void { mode.value = open ? 'multi-wormhole' : 'game' }
  function openFractionalHall(): void { mode.value = 'fractional-hall' }
  function setFractionalHallModal(open: boolean): void { mode.value = open ? 'fractional-hall' : 'game' }
  function setFractionalHallOpen(open: boolean): void { mode.value = open ? 'fractional-hall' : 'game' }
  function openThzJosephson(): void { mode.value = 'thz-josephson' }
  function setThzJosephsonModal(open: boolean): void { mode.value = open ? 'thz-josephson' : 'game' }
  function setThzJosephsonOpen(open: boolean): void { mode.value = open ? 'thz-josephson' : 'game' }
  function openAxionInsulator(): void { mode.value = 'axion-insulator' }
  function setAxionInsulatorModal(open: boolean): void { mode.value = open ? 'axion-insulator' : 'game' }
  function setAxionInsulatorOpen(open: boolean): void { mode.value = open ? 'axion-insulator' : 'game' }
  function openHoloComplexity(): void { mode.value = 'holo-complexity' }
  function setHoloComplexityModal(open: boolean): void { mode.value = open ? 'holo-complexity' : 'game' }
  function setHoloComplexityOpen(open: boolean): void { mode.value = open ? 'holo-complexity' : 'game' }
  function openChiralSuperfluid(): void { mode.value = 'chiral-superfluid' }
  function setChiralSuperfluidModal(open: boolean): void { mode.value = open ? 'chiral-superfluid' : 'game' }
  function setChiralSuperfluidOpen(open: boolean): void { mode.value = open ? 'chiral-superfluid' : 'game' }
  function openQuantumSpinHall(): void { mode.value = 'quantum-spin-hall' }
  function setQuantumSpinHallModal(open: boolean): void { mode.value = open ? 'quantum-spin-hall' : 'game' }
  function setQuantumSpinHallOpen(open: boolean): void { mode.value = open ? 'quantum-spin-hall' : 'game' }
  function openKerrComb(): void { mode.value = 'kerr-comb' }
  function setKerrCombModal(open: boolean): void { mode.value = open ? 'kerr-comb' : 'game' }
  function setKerrCombOpen(open: boolean): void { mode.value = open ? 'kerr-comb' : 'game' }
  function openHoloWeylFluid(): void { mode.value = 'holo-weyl-fluid' }
  function setHoloWeylFluidModal(open: boolean): void { mode.value = open ? 'holo-weyl-fluid' : 'game' }
  function setHoloWeylFluidOpen(open: boolean): void { mode.value = open ? 'holo-weyl-fluid' : 'game' }
  function openModularVacuum(): void { mode.value = 'modular-vacuum' }
  function setModularVacuumModal(open: boolean): void { mode.value = open ? 'modular-vacuum' : 'game' }
  function setModularVacuumOpen(open: boolean): void { mode.value = open ? 'modular-vacuum' : 'game' }
  function openMultiChannelKondo(): void { mode.value = 'multichannel-kondo' }
  function setMultiChannelKondoModal(open: boolean): void { mode.value = open ? 'multichannel-kondo' : 'game' }
  function setMultiChannelKondoOpen(open: boolean): void { mode.value = open ? 'multichannel-kondo' : 'game' }
  function openBirefringentLens(): void { mode.value = 'birefringent-lens' }
  function setBirefringentLensModal(open: boolean): void { mode.value = open ? 'birefringent-lens' : 'game' }
  function setBirefringentLensOpen(open: boolean): void { mode.value = open ? 'birefringent-lens' : 'game' }
  function openHoloMicrostate(): void { mode.value = 'holo-microstate' }
  function setHoloMicrostateModal(open: boolean): void { mode.value = open ? 'holo-microstate' : 'game' }
  function setHoloMicrostateOpen(open: boolean): void { mode.value = open ? 'holo-microstate' : 'game' }
  function openFibonacciAnyon(): void { mode.value = 'fibonacci-anyon' }
  function setFibonacciAnyonModal(open: boolean): void { mode.value = open ? 'fibonacci-anyon' : 'game' }
  function setFibonacciAnyonOpen(open: boolean): void { mode.value = open ? 'fibonacci-anyon' : 'game' }
  function openCelestialBms(): void { mode.value = 'celestial-bms' }
  function setCelestialBmsModal(open: boolean): void { mode.value = open ? 'celestial-bms' : 'game' }
  function setCelestialBmsOpen(open: boolean): void { mode.value = open ? 'celestial-bms' : 'game' }
  function openFloquetAndreev(): void { mode.value = 'floquet-andreev' }
  function setFloquetAndreevModal(open: boolean): void { mode.value = open ? 'floquet-andreev' : 'game' }
  function setFloquetAndreevOpen(open: boolean): void { mode.value = open ? 'floquet-andreev' : 'game' }
  function openQuantumMetric(): void { mode.value = 'quantum-metric' }
  function setQuantumMetricModal(open: boolean): void { mode.value = open ? 'quantum-metric' : 'game' }
  function setQuantumMetricOpen(open: boolean): void { mode.value = open ? 'quantum-metric' : 'game' }
  function openTwistedPolariton(): void { mode.value = 'twisted-polariton' }
  function setTwistedPolaritonModal(open: boolean): void { mode.value = open ? 'twisted-polariton' : 'game' }
  function setTwistedPolaritonOpen(open: boolean): void { mode.value = open ? 'twisted-polariton' : 'game' }
  function openWignerCrystal(): void { mode.value = 'wigner-crystal' }
  function setWignerCrystalModal(open: boolean): void { mode.value = open ? 'wigner-crystal' : 'game' }
  function setWignerCrystalOpen(open: boolean): void { mode.value = open ? 'wigner-crystal' : 'game' }
  function openDeSitterHolo(): void { mode.value = 'desitter-holo' }
  function setDeSitterHoloModal(open: boolean): void { mode.value = open ? 'desitter-holo' : 'game' }
  function setDeSitterHoloOpen(open: boolean): void { mode.value = open ? 'desitter-holo' : 'game' }
  function openChiralPhonon(): void { mode.value = 'chiral-phonon' }
  function setChiralPhononModal(open: boolean): void { mode.value = open ? 'chiral-phonon' : 'game' }
  function setChiralPhononOpen(open: boolean): void { mode.value = open ? 'chiral-phonon' : 'game' }
  function openAxionCherenkov(): void { mode.value = 'axion-cherenkov' }
  function setAxionCherenkovModal(open: boolean): void { mode.value = open ? 'axion-cherenkov' : 'game' }
  function setAxionCherenkovOpen(open: boolean): void { mode.value = open ? 'axion-cherenkov' : 'game' }
  function openFourDQuantumHall(): void { mode.value = 'four-d-quantum-hall' }
  function setFourDQuantumHallModal(open: boolean): void { mode.value = open ? 'four-d-quantum-hall' : 'game' }
  function setFourDQuantumHallOpen(open: boolean): void { mode.value = open ? 'four-d-quantum-hall' : 'game' }
  function openParafermion(): void { mode.value = 'parafermion-modes' }
  function setParafermionModal(open: boolean): void { mode.value = open ? 'parafermion-modes' : 'game' }
  function setParafermionOpen(open: boolean): void { mode.value = open ? 'parafermion-modes' : 'game' }
  function openCalabiYauModuli(): void { mode.value = 'calabi-yau-moduli' }
  function setCalabiYauModuliModal(open: boolean): void { mode.value = open ? 'calabi-yau-moduli' : 'game' }
  function setCalabiYauModuliOpen(open: boolean): void { mode.value = open ? 'calabi-yau-moduli' : 'game' }
  function openHawkingPageAdS(): void { mode.value = 'hawking-page-ads' }
  function setHawkingPageAdSModal(open: boolean): void { mode.value = open ? 'hawking-page-ads' : 'game' }
  function setHawkingPageAdSOpen(open: boolean): void { mode.value = open ? 'hawking-page-ads' : 'game' }
  function openAxionTIWitten(): void { mode.value = 'axion-ti-witten' }
  function setAxionTIWittenModal(open: boolean): void { mode.value = open ? 'axion-ti-witten' : 'game' }
  function setAxionTIWittenOpen(open: boolean): void { mode.value = open ? 'axion-ti-witten' : 'game' }
  function openParisiSpinGlass(): void { mode.value = 'parisi-spin-glass' }
  function setParisiSpinGlassModal(open: boolean): void { mode.value = open ? 'parisi-spin-glass' : 'game' }
  function setParisiSpinGlassOpen(open: boolean): void { mode.value = open ? 'parisi-spin-glass' : 'game' }
  function openNonAbelianVortex(): void { mode.value = 'non-abelian-vortex' }
  function setNonAbelianVortexModal(open: boolean): void { mode.value = open ? 'non-abelian-vortex' : 'game' }
  function setNonAbelianVortexOpen(open: boolean): void { mode.value = open ? 'non-abelian-vortex' : 'game' }
  function openAAGeometricPhase(): void { mode.value = 'aa-geometric-phase' }
  function setAAGeometricPhaseModal(open: boolean): void { mode.value = open ? 'aa-geometric-phase' : 'game' }
  function setAAGeometricPhaseOpen(open: boolean): void { mode.value = open ? 'aa-geometric-phase' : 'game' }
  function openGravitoElectromagnetism(): void { mode.value = 'gravito-electromagnetism' }
  function setGravitoElectromagnetismModal(open: boolean): void { mode.value = open ? 'gravito-electromagnetism' : 'game' }
  function setGravitoElectromagnetismOpen(open: boolean): void { mode.value = open ? 'gravito-electromagnetism' : 'game' }
  function openWeylFermiArc(): void { mode.value = 'weyl-fermi-arc' }
  function setWeylFermiArcModal(open: boolean): void { mode.value = open ? 'weyl-fermi-arc' : 'game' }
  function setWeylFermiArcOpen(open: boolean): void { mode.value = open ? 'weyl-fermi-arc' : 'game' }
  function openDBraneDBI(): void { mode.value = 'd-brane-dbi' }
  function setDBraneDBIModal(open: boolean): void { mode.value = open ? 'd-brane-dbi' : 'game' }
  function setDBraneDBIOpen(open: boolean): void { mode.value = open ? 'd-brane-dbi' : 'game' }
  function openTopologicalKondo(): void { mode.value = 'topological-kondo' }
  function setTopologicalKondoModal(open: boolean): void { mode.value = open ? 'topological-kondo' : 'game' }
  function setTopologicalKondoOpen(open: boolean): void { mode.value = open ? 'topological-kondo' : 'game' }
  function openMagnetarQED(): void { mode.value = 'magnetar-qed' }
  function setMagnetarQEDModal(open: boolean): void { mode.value = open ? 'magnetar-qed' : 'game' }
  function setMagnetarQEDOpen(open: boolean): void { mode.value = open ? 'magnetar-qed' : 'game' }
  function openHolographicSuperconductor(): void { mode.value = 'holographic-superconductor' }
  function setHolographicSuperconductorModal(open: boolean): void { mode.value = open ? 'holographic-superconductor' : 'game' }
  function setHolographicSuperconductorOpen(open: boolean): void { mode.value = open ? 'holographic-superconductor' : 'game' }
  function openInstantonVacuum(): void { mode.value = 'instanton-vacuum' }
  function setInstantonVacuumModal(open: boolean): void { mode.value = open ? 'instanton-vacuum' : 'game' }
  function setInstantonVacuumOpen(open: boolean): void { mode.value = open ? 'instanton-vacuum' : 'game' }
  function openSchwingerVacuum(): void { mode.value = 'schwinger-vacuum' }
  function setSchwingerVacuumModal(open: boolean): void { mode.value = open ? 'schwinger-vacuum' : 'game' }
  function setSchwingerVacuumOpen(open: boolean): void { mode.value = open ? 'schwinger-vacuum' : 'game' }
  function openBlackHoleSuperradiance(): void { mode.value = 'black-hole-superradiance' }
  function setBlackHoleSuperradianceModal(open: boolean): void { mode.value = open ? 'black-hole-superradiance' : 'game' }
  function setBlackHoleSuperradianceOpen(open: boolean): void { mode.value = open ? 'black-hole-superradiance' : 'game' }
  function openStrangeMetalSYK(): void { mode.value = 'strange-metal-syk' }
  function setStrangeMetalSYKModal(open: boolean): void { mode.value = open ? 'strange-metal-syk' : 'game' }
  function setStrangeMetalSYKOpen(open: boolean): void { mode.value = open ? 'strange-metal-syk' : 'game' }
  function openQuantumSpinHallSoliton(): void { mode.value = 'quantum-spin-hall-soliton' }
  function setQuantumSpinHallSolitonModal(open: boolean): void { mode.value = open ? 'quantum-spin-hall-soliton' : 'game' }
  function setQuantumSpinHallSolitonOpen(open: boolean): void { mode.value = open ? 'quantum-spin-hall-soliton' : 'game' }
  function openDynamicalCasimir(): void { mode.value = 'dynamical-casimir' }
  function setDynamicalCasimirModal(open: boolean): void { mode.value = open ? 'dynamical-casimir' : 'game' }
  function setDynamicalCasimirOpen(open: boolean): void { mode.value = open ? 'dynamical-casimir' : 'game' }
  function openHallViscosity(): void { mode.value = 'hall-viscosity' }
  function setHallViscosityModal(open: boolean): void { mode.value = open ? 'hall-viscosity' : 'game' }
  function setHallViscosityOpen(open: boolean): void { mode.value = open ? 'hall-viscosity' : 'game' }
  function openGravitationalAnomaly(): void { mode.value = 'gravitational-anomaly' }
  function setGravitationalAnomalyModal(open: boolean): void { mode.value = open ? 'gravitational-anomaly' : 'game' }
  function setGravitationalAnomalyOpen(open: boolean): void { mode.value = open ? 'gravitational-anomaly' : 'game' }
  function openMagicAngleGraphene(): void { mode.value = 'magic-angle-graphene' }
  function setMagicAngleGrapheneModal(open: boolean): void { mode.value = open ? 'magic-angle-graphene' : 'game' }
  function setMagicAngleGrapheneOpen(open: boolean): void { mode.value = open ? 'magic-angle-graphene' : 'game' }
  function openSuperfluidHelium3(): void { mode.value = 'superfluid-helium3' }
  function setSuperfluidHelium3Modal(open: boolean): void { mode.value = open ? 'superfluid-helium3' : 'game' }
  function setSuperfluidHelium3Open(open: boolean): void { mode.value = open ? 'superfluid-helium3' : 'game' }
  function openChiralMajorana(): void { mode.value = 'chiral-majorana' }
  function setChiralMajoranaModal(open: boolean): void { mode.value = open ? 'chiral-majorana' : 'game' }
  function setChiralMajoranaOpen(open: boolean): void { mode.value = open ? 'chiral-majorana' : 'game' }
  function openBlackHoleEchoes(): void { mode.value = 'black-hole-echoes' }
  function setBlackHoleEchoesModal(open: boolean): void { mode.value = open ? 'black-hole-echoes' : 'game' }
  function setBlackHoleEchoesOpen(open: boolean): void { mode.value = open ? 'black-hole-echoes' : 'game' }
  function openCompositeFermion(): void { mode.value = 'composite-fermion' }
  function setCompositeFermionModal(open: boolean): void { mode.value = open ? 'composite-fermion' : 'game' }
  function setCompositeFermionOpen(open: boolean): void { mode.value = open ? 'composite-fermion' : 'game' }
  function openDisorderAnderson(): void { mode.value = 'disorder-anderson' }
  function setDisorderAndersonModal(open: boolean): void { mode.value = open ? 'disorder-anderson' : 'game' }
  function setDisorderAndersonOpen(open: boolean): void { mode.value = open ? 'disorder-anderson' : 'game' }
  function openRotatingBec(): void { mode.value = 'rotating-bec' }
  function setRotatingBecModal(open: boolean): void { mode.value = open ? 'rotating-bec' : 'game' }
  function setRotatingBecOpen(open: boolean): void { mode.value = open ? 'rotating-bec' : 'game' }
  function openSurfaceCode(): void { mode.value = 'surface-code' }
  function setSurfaceCodeModal(open: boolean): void { mode.value = open ? 'surface-code' : 'game' }
  function setSurfaceCodeOpen(open: boolean): void { mode.value = open ? 'surface-code' : 'game' }
  function openHolographicNegativity(): void { mode.value = 'holographic-negativity' }
  function setHolographicNegativityModal(open: boolean): void { mode.value = open ? 'holographic-negativity' : 'game' }
  function setHolographicNegativityOpen(open: boolean): void { mode.value = open ? 'holographic-negativity' : 'game' }
  function openDiracKlein(): void { mode.value = 'dirac-klein' }
  function setDiracKleinModal(open: boolean): void { mode.value = open ? 'dirac-klein' : 'game' }
  function setDiracKleinOpen(open: boolean): void { mode.value = open ? 'dirac-klein' : 'game' }
  function openSpinOrbitBec(): void { mode.value = 'spin-orbit-bec' }
  function setSpinOrbitBecModal(open: boolean): void { mode.value = open ? 'spin-orbit-bec' : 'game' }
  function setSpinOrbitBecOpen(open: boolean): void { mode.value = open ? 'spin-orbit-bec' : 'game' }
  function openAxionPolariton(): void { mode.value = 'axion-polariton' }
  function setAxionPolaritonModal(open: boolean): void { mode.value = open ? 'axion-polariton' : 'game' }
  function setAxionPolaritonOpen(open: boolean): void { mode.value = open ? 'axion-polariton' : 'game' }
  function openPageIsland(): void { mode.value = 'page-island' }
  function setPageIslandModal(open: boolean): void { mode.value = open ? 'page-island' : 'game' }
  function setPageIslandOpen(open: boolean): void { mode.value = open ? 'page-island' : 'game' }
  function openFractionalChern(): void { mode.value = 'fractional-chern' }
  function setFractionalChernModal(open: boolean): void { mode.value = open ? 'fractional-chern' : 'game' }
  function setFractionalChernOpen(open: boolean): void { mode.value = open ? 'fractional-chern' : 'game' }
  function openFloquetLzsm(): void { mode.value = 'floquet-lzsm' }
  function setFloquetLzsmModal(open: boolean): void { mode.value = open ? 'floquet-lzsm' : 'game' }
  function setFloquetLzsmOpen(open: boolean): void { mode.value = open ? 'floquet-lzsm' : 'game' }
  function openKerrNewman(): void { mode.value = 'kerr-newman' }
  function setKerrNewmanModal(open: boolean): void { mode.value = open ? 'kerr-newman' : 'game' }
  function setKerrNewmanOpen(open: boolean): void { mode.value = open ? 'kerr-newman' : 'game' }
  function openHoloCTheorem(): void { mode.value = 'holo-c-theorem' }
  function setHoloCTheoremModal(open: boolean): void { mode.value = open ? 'holo-c-theorem' : 'game' }
  function setHoloCTheoremOpen(open: boolean): void { mode.value = open ? 'holo-c-theorem' : 'game' }
  function openVortexHall(): void { mode.value = 'vortex-hall' }
  function setVortexHallModal(open: boolean): void { mode.value = open ? 'vortex-hall' : 'game' }
  function setVortexHallOpen(open: boolean): void { mode.value = open ? 'vortex-hall' : 'game' }
  function openFloquetMajoranaTimeCrystal(): void { mode.value = 'floquet-time-crystal-majorana' }
  function setFloquetMajoranaTimeCrystalModal(open: boolean): void { mode.value = open ? 'floquet-time-crystal-majorana' : 'game' }
  function setFloquetMajoranaTimeCrystalOpen(open: boolean): void { mode.value = open ? 'floquet-time-crystal-majorana' : 'game' }
  function openTachyonicReconnection(): void { mode.value = 'tachyonic-reconnection' }
  function setTachyonicReconnectionModal(open: boolean): void { mode.value = open ? 'tachyonic-reconnection' : 'game' }
  function setTachyonicReconnectionOpen(open: boolean): void { mode.value = open ? 'tachyonic-reconnection' : 'game' }
  function openHoloChaos(): void { mode.value = 'holo-chaos' }
  function setHoloChaosModal(open: boolean): void { mode.value = open ? 'holo-chaos' : 'game' }
  function setHoloChaosOpen(open: boolean): void { mode.value = open ? 'holo-chaos' : 'game' }
  function openMoireExcitonBec(): void { mode.value = 'moire-exciton-bec' }
  function setMoireExcitonBecModal(open: boolean): void { mode.value = open ? 'moire-exciton-bec' : 'game' }
  function setMoireExcitonBecOpen(open: boolean): void { mode.value = open ? 'moire-exciton-bec' : 'game' }
  function openNonAbelianSpinSuperfluid(): void { mode.value = 'non-abelian-spin-superfluid' }
  function setNonAbelianSpinSuperfluidModal(open: boolean): void { mode.value = open ? 'non-abelian-spin-superfluid' : 'game' }
  function setNonAbelianSpinSuperfluidOpen(open: boolean): void { mode.value = open ? 'non-abelian-spin-superfluid' : 'game' }
  function openPlanckianInflationHolo(): void { mode.value = 'planckian-inflation-holo' }
  function setPlanckianInflationHoloModal(open: boolean): void { mode.value = open ? 'planckian-inflation-holo' : 'game' }
  function setPlanckianInflationHoloOpen(open: boolean): void { mode.value = open ? 'planckian-inflation-holo' : 'game' }
  function openTopologicalLaser(): void { mode.value = 'topological-laser' }
  function setTopologicalLaserModal(open: boolean): void { mode.value = open ? 'topological-laser' : 'game' }
  function setTopologicalLaserOpen(open: boolean): void { mode.value = open ? 'topological-laser' : 'game' }
  function openFractionalQshSpinLiquid(): void { mode.value = 'fractional-qsh-spin-liquid' }
  function setFractionalQshSpinLiquidModal(open: boolean): void { mode.value = open ? 'fractional-qsh-spin-liquid' : 'game' }
  function setFractionalQshSpinLiquidOpen(open: boolean): void { mode.value = open ? 'fractional-qsh-spin-liquid' : 'game' }
  function openMajoranaJosephsonDiode(): void { mode.value = 'majorana-josephson-diode' }
  function setMajoranaJosephsonDiodeModal(open: boolean): void { mode.value = open ? 'majorana-josephson-diode' : 'game' }
  function setMajoranaJosephsonDiodeOpen(open: boolean): void { mode.value = open ? 'majorana-josephson-diode' : 'game' }
  function openHolographicHyperEntangledLens(): void { mode.value = 'holographic-hyper-entangled-lens' }
  function setHolographicHyperEntangledLensModal(open: boolean): void { mode.value = open ? 'holographic-hyper-entangled-lens' : 'game' }
  function setHolographicHyperEntangledLensOpen(open: boolean): void { mode.value = open ? 'holographic-hyper-entangled-lens' : 'game' }
  function openHigherOrderFractalTimeCrystal(): void { mode.value = 'higher-order-fractal-time-crystal' }
  function setHigherOrderFractalTimeCrystalModal(open: boolean): void { mode.value = open ? 'higher-order-fractal-time-crystal' : 'game' }
  function setHigherOrderFractalTimeCrystalOpen(open: boolean): void { mode.value = open ? 'higher-order-fractal-time-crystal' : 'game' }
  function openFractionalHallStripeLiquidCrystal(): void { mode.value = 'fractional-hall-stripe-liquid-crystal' }
  function setFractionalHallStripeLiquidCrystalModal(open: boolean): void { mode.value = open ? 'fractional-hall-stripe-liquid-crystal' : 'game' }
  function setFractionalHallStripeLiquidCrystalOpen(open: boolean): void { mode.value = open ? 'fractional-hall-stripe-liquid-crystal' : 'game' }
  function openWeylSuperconductingDiodeNetwork(): void { mode.value = 'weyl-superconducting-diode-network' }
  function setWeylSuperconductingDiodeNetworkModal(open: boolean): void { mode.value = open ? 'weyl-superconducting-diode-network' : 'game' }
  function setWeylSuperconductingDiodeNetworkOpen(open: boolean): void { mode.value = open ? 'weyl-superconducting-diode-network' : 'game' }
  function openMicroBlackHoleTeleportation(): void { mode.value = 'micro-black-hole-teleportation' }
  function setMicroBlackHoleTeleportationModal(open: boolean): void { mode.value = open ? 'micro-black-hole-teleportation' : 'game' }
  function setMicroBlackHoleTeleportationOpen(open: boolean): void { mode.value = open ? 'micro-black-hole-teleportation' : 'game' }
  function openSocFractalWeylTimeCrystal(): void { mode.value = 'soc-fractal-weyl-time-crystal' }
  function setSocFractalWeylTimeCrystalModal(open: boolean): void { mode.value = open ? 'soc-fractal-weyl-time-crystal' : 'game' }
  function setSocFractalWeylTimeCrystalOpen(open: boolean): void { mode.value = open ? 'soc-fractal-weyl-time-crystal' : 'game' }
  function openNonHermitianAbelianHiggs(): void { mode.value = 'non-hermitian-abelian-higgs' }
  function setNonHermitianAbelianHiggsModal(open: boolean): void { mode.value = open ? 'non-hermitian-abelian-higgs' : 'game' }
  function setNonHermitianAbelianHiggsOpen(open: boolean): void { mode.value = open ? 'non-hermitian-abelian-higgs' : 'game' }
  function openDynamicalSpinPolaronGel(): void { mode.value = 'dynamical-spin-polaron-gel' }
  function setDynamicalSpinPolaronGelModal(open: boolean): void { mode.value = open ? 'dynamical-spin-polaron-gel' : 'game' }
  function setDynamicalSpinPolaronGelOpen(open: boolean): void { mode.value = open ? 'dynamical-spin-polaron-gel' : 'game' }
  function openHolographicGravitationalWave(): void { mode.value = 'holographic-gravitational-wave' }
  function setHolographicGravitationalWaveModal(open: boolean): void { mode.value = open ? 'holographic-gravitational-wave' : 'game' }
  function setHolographicGravitationalWaveOpen(open: boolean): void { mode.value = open ? 'holographic-gravitational-wave' : 'game' }
  function openFourDTopologicalHyperCrystal(): void { mode.value = 'four-d-topological-hyper-crystal' }
  function setFourDTopologicalHyperCrystalModal(open: boolean): void { mode.value = open ? 'four-d-topological-hyper-crystal' : 'game' }
  function setFourDTopologicalHyperCrystalOpen(open: boolean): void { mode.value = open ? 'four-d-topological-hyper-crystal' : 'game' }
  function openNonAbelianFractalHots(): void { mode.value = 'non-abelian-fractal-hots' }
  function setNonAbelianFractalHotsModal(open: boolean): void { mode.value = open ? 'non-abelian-fractal-hots' : 'game' }
  function setNonAbelianFractalHotsOpen(open: boolean): void { mode.value = open ? 'non-abelian-fractal-hots' : 'game' }
  function openWeylChiralGravitationalFluid(): void { mode.value = 'weyl-chiral-gravitational-fluid' }
  function setWeylChiralGravitationalFluidModal(open: boolean): void { mode.value = open ? 'weyl-chiral-gravitational-fluid' : 'game' }
  function setWeylChiralGravitationalFluidOpen(open: boolean): void { mode.value = open ? 'weyl-chiral-gravitational-fluid' : 'game' }
  function openQuantumPolaritonLattice(): void { mode.value = 'quantum-polariton-lattice' }
  function setQuantumPolaritonLatticeModal(open: boolean): void { mode.value = open ? 'quantum-polariton-lattice' : 'game' }
  function setQuantumPolaritonLatticeOpen(open: boolean): void { mode.value = open ? 'quantum-polariton-lattice' : 'game' }
  function openSpinorSolitonCollider(): void { mode.value = 'spinor-soliton-collider' }
  function setSpinorSolitonColliderModal(open: boolean): void { mode.value = open ? 'spinor-soliton-collider' : 'game' }
  function setSpinorSolitonColliderOpen(open: boolean): void { mode.value = open ? 'spinor-soliton-collider' : 'game' }
  function openFluxonKnot(): void { mode.value = 'superconducting-fluxon-knot' }
  function setFluxonKnotModal(open: boolean): void { mode.value = open ? 'superconducting-fluxon-knot' : 'game' }
  function setFluxonKnotOpen(open: boolean): void { mode.value = open ? 'superconducting-fluxon-knot' : 'game' }
  function openSpinMobius(): void { mode.value = 'topological-spin-mobius' }
  function setSpinMobiusModal(open: boolean): void { mode.value = open ? 'topological-spin-mobius' : 'game' }
  function setSpinMobiusOpen(open: boolean): void { mode.value = open ? 'topological-spin-mobius' : 'game' }
  function openCasimirWormhole(): void { mode.value = 'holographic-casimir-wormhole' }
  function setCasimirWormholeModal(open: boolean): void { mode.value = open ? 'holographic-casimir-wormhole' : 'game' }
  function setCasimirWormholeOpen(open: boolean): void { mode.value = open ? 'holographic-casimir-wormhole' : 'game' }
  function openSusyMonopole(): void { mode.value = 'susy-qcd-monopole-bec' }
  function setSusyMonopoleModal(open: boolean): void { mode.value = open ? 'susy-qcd-monopole-bec' : 'game' }
  function setSusyMonopoleOpen(open: boolean): void { mode.value = open ? 'susy-qcd-monopole-bec' : 'game' }
  function openNonHermitianHopfSkin(): void { mode.value = 'non-hermitian-hopf-skin' }
  function setNonHermitianHopfSkinModal(open: boolean): void { mode.value = open ? 'non-hermitian-hopf-skin' : 'game' }
  function setNonHermitianHopfSkinOpen(open: boolean): void { mode.value = open ? 'non-hermitian-hopf-skin' : 'game' }
  function openFractalQuantumSpinLiquid(): void { mode.value = 'fractal-quantum-spin-liquid' }
  function setFractalQuantumSpinLiquidModal(open: boolean): void { mode.value = open ? 'fractal-quantum-spin-liquid' : 'game' }
  function setFractalQuantumSpinLiquidOpen(open: boolean): void { mode.value = open ? 'fractal-quantum-spin-liquid' : 'game' }
  function openGravitationalAlfvenSoliton(): void { mode.value = 'gravitational-alfven-soliton' }
  function setGravitationalAlfvenSolitonModal(open: boolean): void { mode.value = open ? 'gravitational-alfven-soliton' : 'game' }
  function setGravitationalAlfvenSolitonOpen(open: boolean): void { mode.value = open ? 'gravitational-alfven-soliton' : 'game' }
  function openBoseFermiExcitonSupersolid(): void { mode.value = 'bose-fermi-exciton-supersolid' }
  function setBoseFermiExcitonSupersolidModal(open: boolean): void { mode.value = open ? 'bose-fermi-exciton-supersolid' : 'game' }
  function setBoseFermiExcitonSupersolidOpen(open: boolean): void { mode.value = open ? 'bose-fermi-exciton-supersolid' : 'game' }
  function openTopologicalChiralWeylPhonon(): void { mode.value = 'topological-chiral-weyl-phonon' }
  function setTopologicalChiralWeylPhononModal(open: boolean): void { mode.value = open ? 'topological-chiral-weyl-phonon' : 'game' }
  function setTopologicalChiralWeylPhononOpen(open: boolean): void { mode.value = open ? 'topological-chiral-weyl-phonon' : 'game' }
  function openHolographicYangMillsTensor(): void { mode.value = 'holographic-yang-mills-tensor' }
  function setHolographicYangMillsTensorModal(open: boolean): void { mode.value = open ? 'holographic-yang-mills-tensor' : 'game' }
  function setHolographicYangMillsTensorOpen(open: boolean): void { mode.value = open ? 'holographic-yang-mills-tensor' : 'game' }
  function openSpinOrbitalOctupole(): void { mode.value = 'spin-orbital-octupole' }
  function setSpinOrbitalOctupoleModal(open: boolean): void { mode.value = open ? 'spin-orbital-octupole' : 'game' }
  function setSpinOrbitalOctupoleOpen(open: boolean): void { mode.value = open ? 'spin-orbital-octupole' : 'game' }
  function openLaserWakefieldQuantumRadiation(): void { mode.value = 'laser-wakefield-quantum-radiation' }
  function setLaserWakefieldQuantumRadiationModal(open: boolean): void { mode.value = open ? 'laser-wakefield-quantum-radiation' : 'game' }
  function setLaserWakefieldQuantumRadiationOpen(open: boolean): void { mode.value = open ? 'laser-wakefield-quantum-radiation' : 'game' }
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
  function setTopologicalSupersolidModal(open: boolean): void { mode.value = open ? 'topological-supersolid' : 'game' }
  function setPrimordialGWModal(open: boolean): void { mode.value = open ? 'primordial-gw' : 'game' }
  function setAharonovBohmModal(open: boolean): void { mode.value = open ? 'aharonov-bohm' : 'game' }
  function setWeylChiralModal(open: boolean): void { mode.value = open ? 'weyl-chiral' : 'game' }
  function setExcitonPolaritonModal(open: boolean): void { mode.value = open ? 'exciton-polariton' : 'game' }
  function setExcitonPolaritonOpen(open: boolean): void { mode.value = open ? 'exciton-polariton' : 'game' }
  function setFloquetTimeCrystalModal(open: boolean): void { mode.value = open ? 'floquet-time-crystal' : 'game' }
  function setFloquetTimeCrystalOpen(open: boolean): void { mode.value = open ? 'floquet-time-crystal' : 'game' }
  function setHawkingUnruhModal(open: boolean): void { mode.value = open ? 'hawking-unruh' : 'game' }
  function setHawkingUnruhOpen(open: boolean): void { mode.value = open ? 'hawking-unruh' : 'game' }
  function setAharonovCasherModal(open: boolean): void { mode.value = open ? 'aharonov-casher' : 'game' }
  function setAharonovCasherOpen(open: boolean): void { mode.value = open ? 'aharonov-casher' : 'game' }
  function setSpinorSkyrmionModal(open: boolean): void { mode.value = open ? 'spinor-skyrmion' : 'game' }
  function setSpinorSkyrmionOpen(open: boolean): void { mode.value = open ? 'spinor-skyrmion' : 'game' }
  function setExceptionalPointModal(open: boolean): void { mode.value = open ? 'exceptional-point' : 'game' }
  function setExceptionalPointOpen(open: boolean): void { mode.value = open ? 'exceptional-point' : 'game' }
  function setMajoranaBraidingModal(open: boolean): void { mode.value = open ? 'majorana-braiding' : 'game' }
  function setMajoranaBraidingOpen(open: boolean): void { mode.value = open ? 'majorana-braiding' : 'game' }
  function setKaluzaKleinModal(open: boolean): void { mode.value = open ? 'kaluza-klein' : 'game' }
  function setKaluzaKleinOpen(open: boolean): void { mode.value = open ? 'kaluza-klein' : 'game' }
  function setMoireFlatBandModal(open: boolean): void { mode.value = open ? 'moire-flatband' : 'game' }
  function setMoireFlatBandOpen(open: boolean): void { mode.value = open ? 'moire-flatband' : 'game' }
  function setGWMemoryModal(open: boolean): void { mode.value = open ? 'gw-memory' : 'game' }
  function setGWMemoryOpen(open: boolean): void { mode.value = open ? 'gw-memory' : 'game' }
  function setAntiferroMagnonModal(open: boolean): void { mode.value = open ? 'antiferro-magnon' : 'game' }
  function setAntiferroMagnonOpen(open: boolean): void { mode.value = open ? 'antiferro-magnon' : 'game' }
  function setHolographicWormholeModal(open: boolean): void { mode.value = open ? 'holographic-wormhole' : 'game' }
  function setHolographicWormholeOpen(open: boolean): void { mode.value = open ? 'holographic-wormhole' : 'game' }
  function setChiralPumpModal(open: boolean): void { mode.value = open ? 'chiral-pump' : 'game' }
  function setChiralPumpOpen(open: boolean): void { mode.value = open ? 'chiral-pump' : 'game' }
  function setGWSpinMemoryModal(open: boolean): void { mode.value = open ? 'gw-spin-memory' : 'game' }
  function setGWSpinMemoryOpen(open: boolean): void { mode.value = open ? 'gw-spin-memory' : 'game' }
  function setHingeMajoranaModal(open: boolean): void { mode.value = open ? 'hinge-majorana' : 'game' }
  function setHingeMajoranaOpen(open: boolean): void { mode.value = open ? 'hinge-majorana' : 'game' }
  function setQuantumIslandModal(open: boolean): void { mode.value = open ? 'quantum-island' : 'game' }
  function setQuantumIslandOpen(open: boolean): void { mode.value = open ? 'quantum-island' : 'game' }
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
    openSettings, openBuildPrompt, openBlueprints, openInventory, openKeybinds, openChain, openPhoto, openAchievements, openTools, openExport, openSynth, openPianoRoll, openSchematic, openNpcCustomizer, openQuests, openShaders, openSkins, openMinigames, openCustomBlueprints, openVoxImporter, openDrone, openSpatialVoice, openDimension, openFishing, openRail, openKinetics, openHydroponics, openVisualLogic, openFactory, openAcoustics, openSculptor, openParkour, openObservatory, openReactor, openLeaderboard, openRangers, openDrydock, openAbyssal, openBehaviorTree, openCyberdeck, openHyperjump, openNetrunnerWarfare, openLeviathan, openSupergrid, openColonyArk, openSyndicate, openExosuit, openStellarBeacon, openArkExpedition, openFlagshipRaid, openDarkMatterRift, openDysonSphere, openWormholeSlingshot, openWorldTitan, openNeuralMind, openQuantumBroadcast, openSingularity, openStargate, openCouncil, openGenomeForge, openKardashev, openDysonSwarm, openPlanetaryCore, openChrono, openMultiverse, openRingworld, openGenesisOracle, openStringFold, openVacuumWard, openPrimordialNebula, openStarchart, openTachyonic, openNeutrinoDetector, openQuarkPlasma, openSpinfoam, openHolographicHorizon, openWormholeBridge, openGutCollider, openTopologicalChern, openCosmicString, setVoxImporterModal, setDroneModal, setSpatialVoiceModal, setDimensionModal, setFishingModal, setRailModal, setKineticsModal, setHydroponicsModal, setVisualLogicModal, setFactoryModal, setAcousticsModal, setSculptorModal, setParkourModal, setObservatoryModal, setReactorModal, setLeaderboardModal, setRangersModal, setDrydockModal, setAbyssalModal, setBehaviorTreeModal, setCyberdeckModal, setHyperjumpModal, setNetrunnerWarfareModal, setLeviathanModal, setSupergridModal, setColonyArkModal, setSyndicateModal, setExosuitModal, setStellarBeaconModal, setArkExpeditionModal, setFlagshipRaidModal, setDarkMatterRiftModal, setDysonSphereModal, setWormholeSlingshotModal, setWorldTitanModal, setNeuralMindModal, setQuantumBroadcastModal, setSingularityModal, setStargateModal, setCouncilModal, setGenomeForgeModal, setKardashevModal, setDysonSwarmModal, setPlanetaryCoreModal, setChronoModal, setMultiverseModal, setRingworldModal, setGenesisOracleModal, setStringFoldModal, setVacuumWardModal, setPrimordialNebulaModal, setStarchartModal, setTachyonicModal, setNeutrinoDetectorModal, setQuarkPlasmaModal, setSpinfoamModal, setHolographicHorizonModal, setWormholeBridgeModal, setGutColliderModal, setTopologicalChernModal, setCosmicStringModal, setAntimatterPropulsionModal, setAxionHaloscopeModal, setTimeReversalRadarModal, setStringNetModal, openAntimatterPropulsion, openAxionHaloscope, openTimeReversalRadar, openStringNet, setSupergravitySpinorModal, setPenroseCCCModal, setQuantumAnomalousHallModal, setFermionicDarkMatterModal, openSupergravitySpinor, openPenroseCCC, openQuantumAnomalousHall, openFermionicDarkMatter, setRainbowGravitonModal, setAcousticBlackHoleModal, setScarredTimeCrystalModal, setCornerStateModal, openRainbowGraviton, openAcousticBlackHole, openScarredTimeCrystal, openCornerState, setCasimirTorqueModal, setAnyonHolographicModal, setRelativisticTeleportModal, setPlanckVacuumModal, openCasimirTorque, openAnyonHolographic, openRelativisticTeleport, openPlanckVacuum, setTopologicalSupersolidModal, setPrimordialGWModal, setAharonovBohmModal, setWeylChiralModal, openTopologicalSupersolid, openPrimordialGW, openAharonovBohm, openWeylChiral, setExcitonPolaritonModal, setExcitonPolaritonOpen, openExcitonPolariton, setFloquetTimeCrystalModal, setFloquetTimeCrystalOpen, openFloquetTimeCrystal, setHawkingUnruhModal, setHawkingUnruhOpen, openHawkingUnruh, setAharonovCasherModal, setAharonovCasherOpen, openAharonovCasher, setSpinorSkyrmionModal, setSpinorSkyrmionOpen, openSpinorSkyrmion, setExceptionalPointModal, setExceptionalPointOpen, openExceptionalPoint, setMajoranaBraidingModal, setMajoranaBraidingOpen, openMajoranaBraiding, setKaluzaKleinModal, setKaluzaKleinOpen, openKaluzaKlein, openMoireFlatBand, setMoireFlatBandModal, setMoireFlatBandOpen, openGWMemory, setGWMemoryModal, setGWMemoryOpen, openAntiferroMagnon, setAntiferroMagnonModal, setAntiferroMagnonOpen, openHolographicWormhole, setHolographicWormholeModal, setHolographicWormholeOpen, openChiralPump, setChiralPumpModal, setChiralPumpOpen, openGWSpinMemory, setGWSpinMemoryModal, setGWSpinMemoryOpen, openHingeMajorana, setHingeMajoranaModal, setHingeMajoranaOpen, openQuantumIsland, setQuantumIslandModal, setQuantumIslandOpen, openSpinLiquid, setSpinLiquidModal, setSpinLiquidOpen, openKerrShadow, setKerrShadowModal, setKerrShadowOpen, openRepulsiveCasimir, setRepulsiveCasimirModal, setRepulsiveCasimirOpen, openMultiWormhole, setMultiWormholeModal, setMultiWormholeOpen, openFractionalHall, setFractionalHallModal, setFractionalHallOpen, openThzJosephson, setThzJosephsonModal, setThzJosephsonOpen, openAxionInsulator, setAxionInsulatorModal, setAxionInsulatorOpen, openHoloComplexity, setHoloComplexityModal, setHoloComplexityOpen, openChiralSuperfluid, setChiralSuperfluidModal, setChiralSuperfluidOpen, openQuantumSpinHall, setQuantumSpinHallModal, setQuantumSpinHallOpen, openKerrComb, setKerrCombModal, setKerrCombOpen, openHoloWeylFluid, setHoloWeylFluidModal, setHoloWeylFluidOpen, openModularVacuum, setModularVacuumModal, setModularVacuumOpen, openMultiChannelKondo, setMultiChannelKondoModal, setMultiChannelKondoOpen, openBirefringentLens, setBirefringentLensModal, setBirefringentLensOpen, openHoloMicrostate, setHoloMicrostateModal, setHoloMicrostateOpen, openFibonacciAnyon, setFibonacciAnyonModal, setFibonacciAnyonOpen, openCelestialBms, setCelestialBmsModal, setCelestialBmsOpen, openFloquetAndreev, setFloquetAndreevModal, setFloquetAndreevOpen, openQuantumMetric, setQuantumMetricModal, setQuantumMetricOpen, openTwistedPolariton, setTwistedPolaritonModal, setTwistedPolaritonOpen, openWignerCrystal, setWignerCrystalModal, setWignerCrystalOpen, openDeSitterHolo, setDeSitterHoloModal, setDeSitterHoloOpen, openChiralPhonon, setChiralPhononModal, setChiralPhononOpen, openAxionCherenkov, setAxionCherenkovModal, setAxionCherenkovOpen, openFourDQuantumHall, setFourDQuantumHallModal, setFourDQuantumHallOpen, openParafermion, setParafermionModal, setParafermionOpen, openCalabiYauModuli, setCalabiYauModuliModal, setCalabiYauModuliOpen, openHawkingPageAdS, setHawkingPageAdSModal, setHawkingPageAdSOpen, openAxionTIWitten, setAxionTIWittenModal, setAxionTIWittenOpen, openParisiSpinGlass, setParisiSpinGlassModal, setParisiSpinGlassOpen, openNonAbelianVortex, setNonAbelianVortexModal, setNonAbelianVortexOpen, openAAGeometricPhase, setAAGeometricPhaseModal, setAAGeometricPhaseOpen, openGravitoElectromagnetism, setGravitoElectromagnetismModal, setGravitoElectromagnetismOpen, openWeylFermiArc, setWeylFermiArcModal, setWeylFermiArcOpen, openDBraneDBI, setDBraneDBIModal, setDBraneDBIOpen, openTopologicalKondo, setTopologicalKondoModal, setTopologicalKondoOpen, openMagnetarQED, setMagnetarQEDModal, setMagnetarQEDOpen, openHolographicSuperconductor, setHolographicSuperconductorModal, setHolographicSuperconductorOpen, openInstantonVacuum, setInstantonVacuumModal, setInstantonVacuumOpen,
    openSchwingerVacuum, setSchwingerVacuumModal, setSchwingerVacuumOpen,
    openBlackHoleSuperradiance, setBlackHoleSuperradianceModal, setBlackHoleSuperradianceOpen,
    openStrangeMetalSYK, setStrangeMetalSYKModal, setStrangeMetalSYKOpen,
    openQuantumSpinHallSoliton, setQuantumSpinHallSolitonModal, setQuantumSpinHallSolitonOpen,
    openDynamicalCasimir, setDynamicalCasimirModal, setDynamicalCasimirOpen,
    openHallViscosity, setHallViscosityModal, setHallViscosityOpen,
    openGravitationalAnomaly, setGravitationalAnomalyModal, setGravitationalAnomalyOpen,
    openMagicAngleGraphene, setMagicAngleGrapheneModal, setMagicAngleGrapheneOpen,
    openSuperfluidHelium3, setSuperfluidHelium3Modal, setSuperfluidHelium3Open,
    openChiralMajorana, setChiralMajoranaModal, setChiralMajoranaOpen,
    openBlackHoleEchoes, setBlackHoleEchoesModal, setBlackHoleEchoesOpen,
    openCompositeFermion, setCompositeFermionModal, setCompositeFermionOpen,
    openDisorderAnderson, setDisorderAndersonModal, setDisorderAndersonOpen,
    openRotatingBec, setRotatingBecModal, setRotatingBecOpen,
    openSurfaceCode, setSurfaceCodeModal, setSurfaceCodeOpen,
    openHolographicNegativity, setHolographicNegativityModal, setHolographicNegativityOpen,
    openDiracKlein, setDiracKleinModal, setDiracKleinOpen,
    openSpinOrbitBec, setSpinOrbitBecModal, setSpinOrbitBecOpen,
    openAxionPolariton, setAxionPolaritonModal, setAxionPolaritonOpen,
    openPageIsland, setPageIslandModal, setPageIslandOpen,
    openFractionalChern, setFractionalChernModal, setFractionalChernOpen,
    openFloquetLzsm, setFloquetLzsmModal, setFloquetLzsmOpen,
    openKerrNewman, setKerrNewmanModal, setKerrNewmanOpen,
    openHoloCTheorem, setHoloCTheoremModal, setHoloCTheoremOpen,
    openVortexHall, setVortexHallModal, setVortexHallOpen,
    openFloquetMajoranaTimeCrystal, setFloquetMajoranaTimeCrystalModal, setFloquetMajoranaTimeCrystalOpen,
    openTachyonicReconnection, setTachyonicReconnectionModal, setTachyonicReconnectionOpen,
    openHoloChaos, setHoloChaosModal, setHoloChaosOpen,
    openMoireExcitonBec, setMoireExcitonBecModal, setMoireExcitonBecOpen,
    openNonAbelianSpinSuperfluid, setNonAbelianSpinSuperfluidModal, setNonAbelianSpinSuperfluidOpen,
    openPlanckianInflationHolo, setPlanckianInflationHoloModal, setPlanckianInflationHoloOpen,
    openTopologicalLaser, setTopologicalLaserModal, setTopologicalLaserOpen,
    openFractionalQshSpinLiquid, setFractionalQshSpinLiquidModal, setFractionalQshSpinLiquidOpen,
    openMajoranaJosephsonDiode, setMajoranaJosephsonDiodeModal, setMajoranaJosephsonDiodeOpen,
    openHolographicHyperEntangledLens, setHolographicHyperEntangledLensModal, setHolographicHyperEntangledLensOpen,
    openHigherOrderFractalTimeCrystal, setHigherOrderFractalTimeCrystalModal, setHigherOrderFractalTimeCrystalOpen,
    openFractionalHallStripeLiquidCrystal, setFractionalHallStripeLiquidCrystalModal, setFractionalHallStripeLiquidCrystalOpen,
    openWeylSuperconductingDiodeNetwork, setWeylSuperconductingDiodeNetworkModal, setWeylSuperconductingDiodeNetworkOpen,
    openMicroBlackHoleTeleportation, setMicroBlackHoleTeleportationModal, setMicroBlackHoleTeleportationOpen,
    openSocFractalWeylTimeCrystal, setSocFractalWeylTimeCrystalModal, setSocFractalWeylTimeCrystalOpen,
    openNonHermitianAbelianHiggs, setNonHermitianAbelianHiggsModal, setNonHermitianAbelianHiggsOpen,
    openDynamicalSpinPolaronGel, setDynamicalSpinPolaronGelModal, setDynamicalSpinPolaronGelOpen,
    openHolographicGravitationalWave, setHolographicGravitationalWaveModal, setHolographicGravitationalWaveOpen,
    openFourDTopologicalHyperCrystal, setFourDTopologicalHyperCrystalModal, setFourDTopologicalHyperCrystalOpen,
    openNonAbelianFractalHots, setNonAbelianFractalHotsModal, setNonAbelianFractalHotsOpen,
    openWeylChiralGravitationalFluid, setWeylChiralGravitationalFluidModal, setWeylChiralGravitationalFluidOpen,
    openQuantumPolaritonLattice, setQuantumPolaritonLatticeModal, setQuantumPolaritonLatticeOpen,
    openSpinorSolitonCollider, setSpinorSolitonColliderModal, setSpinorSolitonColliderOpen,
    openFluxonKnot, setFluxonKnotModal, setFluxonKnotOpen,
    openSpinMobius, setSpinMobiusModal, setSpinMobiusOpen,
    openCasimirWormhole, setCasimirWormholeModal, setCasimirWormholeOpen,
    openSusyMonopole, setSusyMonopoleModal, setSusyMonopoleOpen,
    openNonHermitianHopfSkin, setNonHermitianHopfSkinModal, setNonHermitianHopfSkinOpen,
    openFractalQuantumSpinLiquid, setFractalQuantumSpinLiquidModal, setFractalQuantumSpinLiquidOpen,
    openGravitationalAlfvenSoliton, setGravitationalAlfvenSolitonModal, setGravitationalAlfvenSolitonOpen,
    openBoseFermiExcitonSupersolid, setBoseFermiExcitonSupersolidModal, setBoseFermiExcitonSupersolidOpen,
    openTopologicalChiralWeylPhonon, setTopologicalChiralWeylPhononModal, setTopologicalChiralWeylPhononOpen,
    openHolographicYangMillsTensor, setHolographicYangMillsTensorModal, setHolographicYangMillsTensorOpen,
    openSpinOrbitalOctupole, setSpinOrbitalOctupoleModal, setSpinOrbitalOctupoleOpen,
    openLaserWakefieldQuantumRadiation, setLaserWakefieldQuantumRadiationModal, setLaserWakefieldQuantumRadiationOpen,
    setMode, openHelp, openNPCChat, openBuildProgress, closeOverlay, closeModals: closeOverlay,
    setLocked, setBuildStatus, setProgressData, setSelectedBlock, setTimeOfDay, toggleMinimap,
  }
})

export const useUiStore = useUIStore;
