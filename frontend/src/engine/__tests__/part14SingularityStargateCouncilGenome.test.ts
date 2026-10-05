import { describe, it, expect, beforeEach, vi } from 'vitest'
import { singularityExtractor, EXTRACTOR_TIERS } from '../singularityExtractor'
import { stargateNetwork, STARGATE_HUBS } from '../stargateNetwork'
import { galacticCouncil, COUNCIL_FACTIONS } from '../galacticCouncil'
import { xenobiologyForge, GENE_STRANDS, ORGANISM_BLUEPRINTS } from '../xenobiologyForge'
import { achievements } from '../achievements'

describe('Part 14: Singularity Extractor, Stargate Network, Galactic Council, Genome Forge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  // ── Engine 1: Singularity Extractor ────────────────────────────────────────
  describe('Black Hole Ergosphere & Singularity Extractor Engine', () => {
    it('initializes with Kerr black hole physical attributes and 4 tiers', () => {
      expect(singularityExtractor.stats.blackHoleMassSolar).toBe(4100000)
      expect(singularityExtractor.stats.eventHorizonRadiusKm).toBe(12100000)
      expect(singularityExtractor.stats.ergosphereRadiusKm).toBe(18500000)
      expect(singularityExtractor.stats.spinParameterA).toBe(0.94)
      expect(Object.keys(singularityExtractor.tiers).length).toBe(Object.keys(EXTRACTOR_TIERS).length)
      expect(singularityExtractor.stats.isExtracting).toBe(true)
    })

    it('toggles extraction on and off', () => {
      const state1 = singularityExtractor.toggleExtraction()
      expect(state1).toBe(false)
      expect(singularityExtractor.stats.isExtracting).toBe(false)

      const state2 = singularityExtractor.toggleExtraction()
      expect(state2).toBe(true)
      expect(singularityExtractor.stats.isExtracting).toBe(true)
    })

    it('adjusts proximity closer to horizon and increases Penrose efficiency', () => {
      const oldEfficiency = singularityExtractor.stats.penroseEfficiencyPercent
      singularityExtractor.adjustProximity(-2000000)
      expect(singularityExtractor.stats.proximityRadiusKm).toBeLessThan(16000000)
      expect(singularityExtractor.stats.penroseEfficiencyPercent).toBeGreaterThan(oldEfficiency)
    })

    it('unlocks and upgrades tiers, calculates output and tracks achievement', () => {
      singularityExtractor.unlockOrUpgradeTier('hawking_sail')
      expect(singularityExtractor.tiers.hawking_sail.isUnlocked).toBe(true)

      // Unlock high-tier singularity condenser
      singularityExtractor.unlockOrUpgradeTier('singularity_condenser')
      expect(singularityExtractor.tiers.singularity_condenser.isUnlocked).toBe(true)
      expect(singularityExtractor.stats.totalExtractedPowerMW).toBeGreaterThanOrEqual(100000)
      expect(achievements.isUnlocked('singularity_harvester')).toBe(true)
    })

    it('injects superfluid helium coolant and reduces core temperature', () => {
      singularityExtractor.stats.coreTemperatureK = 600
      singularityExtractor.injectCoolant()
      expect(singularityExtractor.stats.coreTemperatureK).toBe(600 - 85)
      expect(singularityExtractor.stats.coolingEfficiencyPercent).toBe(100)
    })

    it('accumulates matter and simulates heat dynamics in update loop', () => {
      const initialMatter = singularityExtractor.stats.totalSingularityMatter
      singularityExtractor.stats.isExtracting = true
      singularityExtractor.update(2.0)
      expect(singularityExtractor.stats.totalSingularityMatter).toBeGreaterThan(initialMatter)
    })
  })

  // ── Engine 2: Stargate Network ─────────────────────────────────────────────
  describe('Hyperspace Stargate Network & Transit Hub Engine', () => {
    beforeEach(() => {
      stargateNetwork.shutdownWormhole()
    })

    it('initializes with 4 galactic hubs and default Sol Prime origin', () => {
      expect(Object.keys(stargateNetwork.hubs).length).toBe(Object.keys(STARGATE_HUBS).length)
      expect(stargateNetwork.stats.activeOrigin).toBe('sol_prime')
      expect(stargateNetwork.stats.networkPowerKWh).toBeGreaterThanOrEqual(400000)
      expect(stargateNetwork.stats.isWormholeOpen).toBe(false)
    })

    it('selects destination hub and prepares dialing status', () => {
      const ok = stargateNetwork.selectDestination('vega_nexus')
      expect(ok).toBe(true)
      expect(stargateNetwork.stats.targetDestination).toBe('vega_nexus')
      expect(stargateNetwork.stats.currentChevronLocked).toBe(0)
    })

    it('locks chevrons step-by-step or with auto-dial', () => {
      stargateNetwork.selectDestination('centauri_tristar')
      stargateNetwork.lockNextChevron()
      expect(stargateNetwork.stats.currentChevronLocked).toBe(1)

      stargateNetwork.autoDialAllChevrons()
      expect(stargateNetwork.stats.currentChevronLocked).toBe(7)
    })

    it('opens wormhole consuming network power and executes dimensional traversal', () => {
      stargateNetwork.selectDestination('rim_void')
      stargateNetwork.autoDialAllChevrons()

      const oldPower = stargateNetwork.stats.networkPowerKWh
      const opened = stargateNetwork.openWormhole()
      expect(opened).toBe(true)
      expect(stargateNetwork.stats.isWormholeOpen).toBe(true)
      expect(stargateNetwork.stats.networkPowerKWh).toBe(oldPower - 25000)

      const traversed = stargateNetwork.traverseWormhole()
      expect(traversed).toBe(true)
      expect(stargateNetwork.stats.activeOrigin).toBe('rim_void')
      expect(stargateNetwork.stats.totalTransitsCompleted).toBeGreaterThanOrEqual(1)
      expect(stargateNetwork.stats.totalTollsEarnedCredits).toBeGreaterThanOrEqual(8000)
      expect(achievements.isUnlocked('stargate_dialer')).toBe(true)
    })
  })

  // ── Engine 3: Galactic Council ─────────────────────────────────────────────
  describe('Interstellar Council & Galactic Diplomacy Engine', () => {
    it('initializes 4 galactic blocs and resolutions chamber', () => {
      expect(Object.keys(galacticCouncil.factions).length).toBe(Object.keys(COUNCIL_FACTIONS).length)
      expect(galacticCouncil.resolutions.length).toBeGreaterThanOrEqual(4)
      expect(galacticCouncil.stats.playerDelegateWeight).toBeGreaterThan(100)
    })

    it('casts voting ballot with delegate weight and passes resolution', () => {
      const activeRes = galacticCouncil.resolutions.find(r => r.status === 'voting_active')!
      expect(activeRes).toBeDefined()

      const voted = galacticCouncil.castVote(activeRes.id, 'aye')
      expect(voted).toBe(true)
      expect(activeRes.playerVote).toBe('aye')
      expect(activeRes.ayeVotes).toBeGreaterThanOrEqual(501)
      expect(activeRes.status).toBe('passed_active')
      expect(achievements.isUnlocked('council_speaker')).toBe(true)
    })

    it('improves diplomatic reputation and awards more delegate seats', () => {
      const oldRep = galacticCouncil.factions.nomad_belters.standingReputation
      const oldWeight = galacticCouncil.stats.playerDelegateWeight

      const ok = galacticCouncil.improveReputation('nomad_belters', 15)
      expect(ok).toBe(true)
      expect(galacticCouncil.factions.nomad_belters.standingReputation).toBe(oldRep + 15)
      expect(galacticCouncil.stats.playerDelegateWeight).toBeGreaterThan(oldWeight)
    })
  })

  // ── Engine 4: Xenobiology Genome Forge ─────────────────────────────────────
  describe('Xenobiology Genome Forge & Bio-Mutagen Lab Engine', () => {
    it('initializes exotic gene strands and synthetic blueprints', () => {
      expect(Object.keys(xenobiologyForge.strands).length).toBe(Object.keys(GENE_STRANDS).length)
      expect(Object.keys(xenobiologyForge.blueprints).length).toBe(Object.keys(ORGANISM_BLUEPRINTS).length)
      expect(xenobiologyForge.stats.bioCatalystsCount).toBeGreaterThanOrEqual(100)
    })

    it('harvests bio-catalysts from greenhouse synthesis', () => {
      const oldCatalyst = xenobiologyForge.stats.bioCatalystsCount
      xenobiologyForge.harvestBioCatalyst(50)
      expect(xenobiologyForge.stats.bioCatalystsCount).toBe(oldCatalyst + 50)
    })

    it('starts gene splicing incubation, fast-forwards and completes birth', () => {
      xenobiologyForge.stats.bioCatalystsCount = 500
      const started = xenobiologyForge.startIncubation('crystal_hexapod')
      expect(started).toBe(true)
      expect(xenobiologyForge.stats.activeIncubatingOrganism).toBe('crystal_hexapod')
      expect(xenobiologyForge.stats.incubatorProgress).toBe(0)

      // Fast forward incubation
      xenobiologyForge.fastForwardIncubation(40)
      expect(xenobiologyForge.stats.incubatorProgress).toBe(40)

      xenobiologyForge.fastForwardIncubation(70) // Exceeds 100 -> completes!
      expect(xenobiologyForge.blueprints.crystal_hexapod.isSynthesized).toBe(true)
      expect(xenobiologyForge.stats.activeIncubatingOrganism).toBeNull()
      expect(xenobiologyForge.stats.activeOrganismsCount).toBeGreaterThanOrEqual(2)
      expect(achievements.isUnlocked('genome_architect')).toBe(true)
    })
  })
})
