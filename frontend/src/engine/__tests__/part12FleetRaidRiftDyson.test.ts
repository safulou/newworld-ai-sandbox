import { describe, it, expect, beforeEach, vi } from 'vitest'
import { arkFleetExpeditions, EXPEDITION_ZONES } from '../arkFleetExpeditions'
import { syndicateFlagshipRaids } from '../syndicateFlagshipRaids'
import { darkMatterRifts } from '../darkMatterRifts'
import { dysonSphereMegastructure } from '../dysonSphereMegastructure'
import { achievements } from '../achievements'

describe('Part 12: Ark Fleet, Flagship Raids, Dark Matter Rifts, Dyson Sphere', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  // ── Engine 1: Ark Fleet Formations & Expeditions ───────────────────────────
  describe('Ark Fleet Formations & Deep Space Expeditions Engine', () => {
    it('initializes with 4 capital ships and default stats', () => {
      expect(arkFleetExpeditions.ships.length).toBe(4)
      expect(arkFleetExpeditions.stats.state).toBe('docked')
      expect(arkFleetExpeditions.stats.fuel).toBe(10000)
      expect(arkFleetExpeditions.stats.supplies).toBe(5000)
      expect(arkFleetExpeditions.stats.formation).toBe('v_formation')
    })

    it('sets fleet formations and returns proper buffs', () => {
      arkFleetExpeditions.setFormation('diamond')
      expect(arkFleetExpeditions.stats.formation).toBe('diamond')
      expect(arkFleetExpeditions.getFormationBuff()).toContain('偏折護盾同調')

      arkFleetExpeditions.setFormation('orbital_ring')
      expect(arkFleetExpeditions.getFormationBuff()).toContain('資源採集貨運量')
    })

    it('upgrades capital ship attributes when funds are available', () => {
      arkFleetExpeditions.stats.creditsVault = 50000
      const ship = arkFleetExpeditions.ships[0]
      const oldHull = ship.maxHull
      const oldFirepower = ship.firepower

      const upgraded = arkFleetExpeditions.upgradeShip(ship.id)
      expect(upgraded).toBe(true)
      expect(ship.level).toBe(2)
      expect(ship.maxHull).toBeGreaterThan(oldHull)
      expect(ship.firepower).toBeGreaterThan(oldFirepower)
    })

    it('launches expedition, reduces resources, and calculates speed', () => {
      arkFleetExpeditions.stats.fuel = 5000
      arkFleetExpeditions.stats.supplies = 3000
      arkFleetExpeditions.stats.state = 'docked'

      const launched = arkFleetExpeditions.launchExpedition('andromeda_wormhole')
      expect(launched).toBe(true)
      expect(arkFleetExpeditions.stats.state).toBe('in_transit')
      expect(arkFleetExpeditions.stats.activeZoneId).toBe('andromeda_wormhole')
      expect(arkFleetExpeditions.stats.fuel).toBe(5000 - EXPEDITION_ZONES[0].fuelCost)
      expect(arkFleetExpeditions.stats.supplies).toBe(3000 - EXPEDITION_ZONES[0].suppliesCost)
      expect(arkFleetExpeditions.stats.transitSpeedLYs).toBeGreaterThan(200)
    })

    it('handles aborting expedition and returning to hangar', () => {
      arkFleetExpeditions.stats.state = 'in_transit'
      arkFleetExpeditions.abortExpedition()
      expect(arkFleetExpeditions.stats.state).toBe('returning')

      arkFleetExpeditions.returnToHangar()
      expect(arkFleetExpeditions.stats.state).toBe('docked')
      expect(arkFleetExpeditions.stats.activeZoneId).toBeNull()
    })

    it('resolves dynamic encounters successfully', () => {
      arkFleetExpeditions.stats.activeEncounter = {
        id: 'test_shear',
        title: '引力時空剪切',
        description: '測試剪切波',
        threatLevel: 'Medium',
        options: [
          {
            label: '偏折護盾同調',
            action: 'shield_sync',
            resourceCost: { fuel: 50 },
            successChance: 1.0
          }
        ]
      }
      arkFleetExpeditions.stats.fuel = 500
      arkFleetExpeditions.stats.formation = 'hyper_line'

      const resolved = arkFleetExpeditions.resolveEncounter('shield_sync')
      expect(resolved).toBe(true)
      expect(arkFleetExpeditions.stats.activeEncounter).toBeNull()
      expect(arkFleetExpeditions.stats.encounterResolvedMsg).toContain('決策成功')
    })

    it('resupplies fleet to maximum capacity', () => {
      arkFleetExpeditions.stats.creditsVault = 20000
      arkFleetExpeditions.stats.fuel = 1000
      arkFleetExpeditions.stats.supplies = 500
      arkFleetExpeditions.resupplyFleet()

      expect(arkFleetExpeditions.stats.fuel).toBe(arkFleetExpeditions.stats.maxFuel)
      expect(arkFleetExpeditions.stats.supplies).toBe(arkFleetExpeditions.stats.maxSupplies)
    })
  })

  // ── Engine 2: Syndicate Flagship Raids ─────────────────────────────────────
  describe('Syndicate Flagship Corporate Raids Engine', () => {
    it('initializes flagship targets and player squadron', () => {
      expect(syndicateFlagshipRaids.stats.phase).toBe('standby')
      expect(syndicateFlagshipRaids.squadron.hull).toBe(1500)
      expect(syndicateFlagshipRaids.squadron.torpedoes).toBe(14)
      expect(syndicateFlagshipRaids.targets.arasaka_orbital.name).toContain('提亞馬特四號')
    })

    it('switches targets and starts raid into phase 1 shields', () => {
      syndicateFlagshipRaids.selectTarget('neon_vanguard')
      expect(syndicateFlagshipRaids.stats.activeFaction).toBe('neon_vanguard')

      const started = syndicateFlagshipRaids.startRaid()
      expect(started).toBe(true)
      expect(syndicateFlagshipRaids.stats.phase).toBe('phase_1_shields')
      expect(syndicateFlagshipRaids.targets.neon_vanguard.shieldGenerators).toBe(4)
    })

    it('destroys shield generators with torpedoes and advances to phase 2', () => {
      syndicateFlagshipRaids.stats.phase = 'phase_1_shields'
      syndicateFlagshipRaids.squadron.torpedoCooldown = 0
      syndicateFlagshipRaids.squadron.torpedoes = 10
      const target = syndicateFlagshipRaids.targets[syndicateFlagshipRaids.stats.activeFaction]
      target.shieldGenerators = 1

      syndicateFlagshipRaids.fireProtonTorpedo()
      expect(target.shieldGenerators).toBe(0)
      expect(syndicateFlagshipRaids.stats.phase).toBe('phase_2_flak')
    })

    it('neutralizes flak turrets and advances to phase 3 meltdown', () => {
      syndicateFlagshipRaids.stats.phase = 'phase_2_flak'
      syndicateFlagshipRaids.squadron.torpedoCooldown = 0
      syndicateFlagshipRaids.squadron.torpedoes = 10
      const target = syndicateFlagshipRaids.targets[syndicateFlagshipRaids.stats.activeFaction]
      target.flakTurrets = 2

      syndicateFlagshipRaids.fireProtonTorpedo()
      expect(target.flakTurrets).toBe(0)
      expect(syndicateFlagshipRaids.stats.phase).toBe('phase_3_meltdown')
      expect(target.reactorMeltdownTimer).toBe(45)
    })

    it('destroys reactor core in phase 3 and triggers victory', () => {
      syndicateFlagshipRaids.stats.phase = 'phase_3_meltdown'
      syndicateFlagshipRaids.squadron.torpedoCooldown = 0
      syndicateFlagshipRaids.squadron.torpedoes = 10
      const target = syndicateFlagshipRaids.targets[syndicateFlagshipRaids.stats.activeFaction]
      target.currentHull = 1000

      syndicateFlagshipRaids.fireProtonTorpedo()
      expect(target.currentHull).toBe(0)
      expect(syndicateFlagshipRaids.stats.phase).toBe('victory')
      expect(syndicateFlagshipRaids.stats.raidsWon).toBeGreaterThan(0)
    })

    it('activates electronic jammer and deploys nanite repair swarm', () => {
      syndicateFlagshipRaids.squadron.jammerCooldown = 0
      syndicateFlagshipRaids.squadron.isJamming = false

      const jam = syndicateFlagshipRaids.activateJammer()
      expect(jam).toBe(true)
      expect(syndicateFlagshipRaids.squadron.isJamming).toBe(true)
      expect(syndicateFlagshipRaids.squadron.jammingTimer).toBe(5.0)

      syndicateFlagshipRaids.squadron.repairCooldown = 0
      syndicateFlagshipRaids.squadron.hull = 800
      const rep = syndicateFlagshipRaids.deployRepairSwarm()
      expect(rep).toBe(true)
      expect(syndicateFlagshipRaids.squadron.hull).toBe(1300)
    })
  })

  // ── Engine 3: Quantum Dark Matter Rifts ────────────────────────────────────
  describe('Quantum Dark Matter Spatial Rift Engine', () => {
    it('initializes with 4 rift dimensions and frequency tuner', () => {
      expect(Object.keys(darkMatterRifts.dimensions).length).toBe(4)
      expect(darkMatterRifts.stats.isRiftOpen).toBe(false)
      expect(darkMatterRifts.stats.currentFrequencyMHz).toBe(400)
    })

    it('tunes frequency and calculates stability with closest rift dimension', () => {
      darkMatterRifts.setFrequency(432)
      expect(darkMatterRifts.stats.currentFrequencyMHz).toBe(432)
      expect(darkMatterRifts.stats.riftStability).toBe(100)
      expect(darkMatterRifts.stats.statusMessage).toContain('熵增虛空維度')
    })

    it('stabilizes and tears open rift to spawn mineral nodes', () => {
      const opened = darkMatterRifts.stabilizeAndOpenRift('entropy_void')
      expect(opened).toBe(true)
      expect(darkMatterRifts.stats.isRiftOpen).toBe(true)
      expect(darkMatterRifts.stats.activeDimension).toBe('entropy_void')
      expect(darkMatterRifts.mineralNodes.length).toBe(4)
    })

    it('extracts mineral node and increases inventory', () => {
      darkMatterRifts.stabilizeAndOpenRift('time_crystal_cavern')
      const node = darkMatterRifts.mineralNodes[1] // time crystal
      expect(node.extracted).toBe(false)

      darkMatterRifts.extractMineralNode(node.id) // integrity 50
      darkMatterRifts.extractMineralNode(node.id) // integrity 0 -> extracted
      expect(node.extracted).toBe(true)
      expect(darkMatterRifts.stats.timeCrystalsHarvested).toBeGreaterThan(0)
    })

    it('uses coolant pack to purge radiation and restore suit shield', () => {
      darkMatterRifts.stats.coolantPacks = 3
      darkMatterRifts.stats.radiationLevel = 60
      darkMatterRifts.stats.suitShield = 400

      const used = darkMatterRifts.useCoolantPack()
      expect(used).toBe(true)
      expect(darkMatterRifts.stats.coolantPacks).toBe(2)
      expect(darkMatterRifts.stats.radiationLevel).toBe(20)
      expect(darkMatterRifts.stats.suitShield).toBe(900)
    })

    it('crafts coolant packs using harvested dark matter', () => {
      darkMatterRifts.stats.darkMatterHarvested = 100
      darkMatterRifts.stats.coolantPacks = 1

      const crafted = darkMatterRifts.craftCoolantPack()
      expect(crafted).toBe(true)
      expect(darkMatterRifts.stats.coolantPacks).toBe(2)
      expect(darkMatterRifts.stats.darkMatterHarvested).toBe(50)
    })
  })

  // ── Engine 4: Ancient Dyson Sphere Megastructure ──────────────────────────
  describe('Ancient Dyson Sphere Megastructure Engine', () => {
    it('initializes 4 megastructure phases with initial power output', () => {
      expect(dysonSphereMegastructure.phases.length).toBe(4)
      expect(dysonSphereMegastructure.stats.totalOutputMW).toBeGreaterThan(30000)
      expect(dysonSphereMegastructure.stats.stellarAttunementActive).toBe(true)
    })

    it('fabricates construction materials into inventory', () => {
      const oldTitanium = dysonSphereMegastructure.stats.inventory.titaniumAlloy
      dysonSphereMegastructure.fabricateMaterials('titanium')
      expect(dysonSphereMegastructure.stats.inventory.titaniumAlloy).toBe(oldTitanium + 250)

      const oldWire = dysonSphereMegastructure.stats.inventory.superconductingWire
      dysonSphereMegastructure.fabricateMaterials('wire')
      expect(dysonSphereMegastructure.stats.inventory.superconductingWire).toBe(oldWire + 180)
    })

    it('contributes materials to active phase and increases progress and power output', () => {
      dysonSphereMegastructure.stats.currentPhase = 'phase_2_ring'
      const phase = dysonSphereMegastructure.phases.find(p => p.id === 'phase_2_ring')!
      const oldProgress = phase.progress
      const oldPower = phase.powerOutputMW

      dysonSphereMegastructure.stats.inventory.titaniumAlloy = 1000
      dysonSphereMegastructure.stats.inventory.superconductingWire = 1000
      dysonSphereMegastructure.stats.inventory.fusionCores = 50
      dysonSphereMegastructure.stats.inventory.darkMatterCrystals = 20

      const contributed = dysonSphereMegastructure.contributeResources(200, 150, 10, 5)
      expect(contributed).toBe(true)
      expect(phase.progress).toBeGreaterThan(oldProgress)
      expect(phase.powerOutputMW).toBeGreaterThan(oldPower)
      expect(dysonSphereMegastructure.stats.contributionsCount).toBeGreaterThan(0)
    })

    it('harvests active solar flare for massive superconductor and dark crystal materials', () => {
      dysonSphereMegastructure.stats.activeSolarFlare = true
      const oldWire = dysonSphereMegastructure.stats.inventory.superconductingWire

      const harvested = dysonSphereMegastructure.harvestSolarFlare()
      expect(harvested).toBe(true)
      expect(dysonSphereMegastructure.stats.activeSolarFlare).toBe(false)
      expect(dysonSphereMegastructure.stats.inventory.superconductingWire).toBe(oldWire + 400)
      expect(dysonSphereMegastructure.stats.flaresHarvested).toBe(1)
    })

    it('tracks achievements when completing milestone phases', () => {
      const trackSpy = vi.spyOn(achievements, 'trackProgress')
      dysonSphereMegastructure.stats.currentPhase = 'phase_1_swarm'
      const phase = dysonSphereMegastructure.phases.find(p => p.id === 'phase_1_swarm')!
      phase.progress = 98
      phase.isCompleted = false

      dysonSphereMegastructure.stats.inventory.titaniumAlloy = 500
      dysonSphereMegastructure.stats.inventory.superconductingWire = 500
      dysonSphereMegastructure.stats.inventory.fusionCores = 20
      dysonSphereMegastructure.stats.inventory.darkMatterCrystals = 10

      dysonSphereMegastructure.contributeResources(100, 100, 5, 2)
      expect(phase.progress).toBe(100)
      expect(phase.isCompleted).toBe(true)
      expect(trackSpy).toHaveBeenCalledWith('dyson_architect', 1)
    })
  })
})
