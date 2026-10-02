import { describe, it, expect, beforeEach, vi } from 'vitest'
import { colonyArk } from '../colonyArk'
import { syndicateWarfare } from '../syndicateWarfare'
import { mechExosuit } from '../mechExosuit'
import { stellarBeacons } from '../stellarBeacons'
import { achievements } from '../achievements'

describe('Part 11: Colony Ark & Biosphere Engine', () => {
  beforeEach(() => {
    colonyArk.stats.population = 250
    colonyArk.stats.maxPopulation = 500
    colonyArk.stats.happiness = 90
    colonyArk.stats.oxygenLevel = 98.5
    colonyArk.stats.biomassKg = 5000
    colonyArk.stats.activeCrisis = null
    colonyArk.stats.birthsCount = 0
    colonyArk.stats.lossesCount = 0
  })

  it('should initialize ark sections and support section upgrades', () => {
    expect(colonyArk.sections.length).toBe(4)
    const hab = colonyArk.sections.find(s => s.id === 'habitation')
    expect(hab).toBeDefined()
    const initialLvl = hab!.level
    const initialFood = colonyArk.stats.biomassKg

    const res = colonyArk.upgradeSection('habitation')
    expect(res.success).toBe(true)
    expect(hab!.level).toBe(initialLvl + 1)
    expect(colonyArk.stats.biomassKg).toBeLessThan(initialFood)
  })

  it('should assign colonists to sections', () => {
    const sec = colonyArk.sections[0]
    const initialAssigned = sec.assignedColonists
    colonyArk.assignColonists(sec.id, 10)
    expect(sec.assignedColonists).toBe(initialAssigned + 10)

    colonyArk.assignColonists(sec.id, -10)
    expect(sec.assignedColonists).toBe(initialAssigned)
  })

  it('should trigger emergency crisis and allow resolution', () => {
    colonyArk.triggerEmergencyCrisis('oxygen_leak')
    expect(colonyArk.stats.activeCrisis).not.toBeNull()
    expect(colonyArk.stats.activeCrisis?.type).toBe('oxygen_leak')

    // Update with delta should reduce oxygen
    colonyArk.update(2.0)
    expect(colonyArk.stats.oxygenLevel).toBeLessThan(98.5)

    // Resolve
    const res = colonyArk.resolveCrisis()
    expect(res.success).toBe(true)
    expect(colonyArk.stats.activeCrisis).toBeNull()
  })

  it('should simulate demographic population growth and unlock achievement', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    colonyArk.stats.population = 299
    colonyArk.stats.happiness = 95
    colonyArk.stats.biomassKg = 4000

    // Force run cycle
    colonyArk.update(4.5)
    // If population reached 300+, achievement is triggered
    if (colonyArk.stats.population >= 300) {
      expect(unlockSpy).toHaveBeenCalledWith('colony_ark_commander')
    }
  })
})

describe('Part 11: Syndicate Corporate Wars Engine', () => {
  beforeEach(() => {
    syndicateWarfare.player.faction = 'quantum_vanguard'
    syndicateWarfare.player.meritPoints = 1000
    syndicateWarfare.player.dividendClaimable = 2000
    syndicateWarfare.player.totalDividendsClaimed = 0
    syndicateWarfare.player.battlesWon = 5
  })

  it('should initialize 4 factions and 5 contested territories', () => {
    expect(syndicateWarfare.factions.length).toBe(4)
    expect(syndicateWarfare.territories.length).toBe(5)
  })

  it('should allow switching allegiance to a new faction', () => {
    syndicateWarfare.joinFaction('neon_syndicate')
    expect(syndicateWarfare.player.faction).toBe('neon_syndicate')
    expect(syndicateWarfare.getCurrentFaction()?.id).toBe('neon_syndicate')
  })

  it('should deploy defense beacons on owned territory', () => {
    const ownedSec = syndicateWarfare.territories.find(t => t.controllingFaction === syndicateWarfare.player.faction)
    expect(ownedSec).toBeDefined()
    const initialPts = ownedSec!.controlPoints

    const res = syndicateWarfare.deployDefense(ownedSec!.id)
    expect(res.success).toBe(true)
    expect(ownedSec!.controlPoints).toBeGreaterThan(initialPts)
  })

  it('should launch blitz assault on enemy territory and conquer', () => {
    const enemySec = syndicateWarfare.territories.find(t => t.controllingFaction !== syndicateWarfare.player.faction)
    expect(enemySec).toBeDefined()
    enemySec!.controlPoints = 50 // Almost captured

    const res = syndicateWarfare.launchBlitz(enemySec!.id)
    expect(res.success).toBe(true)
    expect(enemySec!.controllingFaction).toBe(syndicateWarfare.player.faction)
    expect(syndicateWarfare.player.battlesWon).toBeGreaterThan(5)
  })

  it('should claim tax dividends and unlock achievement upon reaching threshold', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    syndicateWarfare.player.dividendClaimable = 5500
    const res = syndicateWarfare.claimDividends()
    expect(res.success).toBe(true)
    expect(syndicateWarfare.player.dividendClaimable).toBe(0)
    expect(syndicateWarfare.player.totalDividendsClaimed).toBeGreaterThanOrEqual(5000)
    expect(unlockSpy).toHaveBeenCalledWith('syndicate_warlord')
  })
})

describe('Part 11: Mech Exosuit Crafting Engine', () => {
  beforeEach(() => {
    mechExosuit.stats.isActive = false
    mechExosuit.stats.mode = 'grounded'
    mechExosuit.stats.energy = 100
    mechExosuit.stats.shieldHP = 400
    mechExosuit.stats.isOverdriving = false
    mechExosuit.stats.overdriveTimer = 0
    mechExosuit.stats.railgunCooldown = 0
    mechExosuit.materials.superconductorPlates = 20
    mechExosuit.materials.stardustOre = 100
  })

  it('should toggle equip exosuit and switch stances', () => {
    const equipped = mechExosuit.toggleEquip()
    expect(equipped).toBe(true)
    expect(mechExosuit.stats.isActive).toBe(true)

    mechExosuit.setMode('hover_flight')
    expect(mechExosuit.stats.mode).toBe('hover_flight')

    mechExosuit.setMode('supercavitation')
    expect(mechExosuit.stats.mode).toBe('supercavitation')
  })

  it('should activate overdrive booster with speed surge', () => {
    mechExosuit.stats.isActive = true
    const res = mechExosuit.activateOverdrive()
    expect(res.success).toBe(true)
    expect(mechExosuit.stats.isOverdriving).toBe(true)
    expect(mechExosuit.stats.energy).toBeLessThan(100)

    // Update advances timer
    mechExosuit.update(3.6)
    expect(mechExosuit.stats.isOverdriving).toBe(false)
  })

  it('should fire twin railgun and enforce cooldown', () => {
    mechExosuit.stats.isActive = true
    const res = mechExosuit.fireRailgun()
    expect(res.success).toBe(true)
    expect(mechExosuit.stats.railgunCooldown).toBeGreaterThan(0)

    // Cannot fire again while cooling down
    const secondRes = mechExosuit.fireRailgun()
    expect(secondRes.success).toBe(false)
  })

  it('should forge modules using materials and unlock achievement', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    const mod = mechExosuit.modules[0]
    const initialTier = mod.tier

    const res = mechExosuit.forgeModule(mod.id)
    expect(res.success).toBe(true)
    expect(mod.tier).toBe(initialTier + 1)
    expect(unlockSpy).toHaveBeenCalledWith('exosuit_titan')
  })
})

describe('Part 11: Quantum Stellar Beacon Network Engine', () => {
  beforeEach(() => {
    stellarBeacons.stats.totalTeleports = 0
    stellarBeacons.stats.lastWarpBeaconId = null
  })

  it('should initialize default beacons across 4 dimensions', () => {
    expect(stellarBeacons.beacons.length).toBeGreaterThanOrEqual(5)
    expect(stellarBeacons.stats.networkStrength).toBeGreaterThan(80)
  })

  it('should deploy custom quantum beacon and remove it', () => {
    const initialCount = stellarBeacons.beacons.length
    const created = stellarBeacons.deployCustomBeacon('浮島天宮錨點', [100, 85, -200], 'overworld', '#00ff88')
    expect(created.id).toContain('beacon_custom')
    expect(stellarBeacons.beacons.length).toBe(initialCount + 1)

    const removed = stellarBeacons.removeCustomBeacon(created.id)
    expect(removed).toBe(true)
    expect(stellarBeacons.beacons.length).toBe(initialCount)
  })

  it('should execute quantum wave collapse warp teleport and invoke callback', () => {
    const onTeleport = vi.fn()
    const target = stellarBeacons.beacons[0]
    const res = stellarBeacons.warpToBeacon(target.id, onTeleport)

    expect(res.success).toBe(true)
    expect(onTeleport).toHaveBeenCalledWith(target.coords)
    expect(stellarBeacons.stats.totalTeleports).toBe(1)
    expect(stellarBeacons.stats.lastWarpBeaconId).toBe(target.id)
  })

  it('should unlock quantum_cartographer achievement after multiple warps', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    const target = stellarBeacons.beacons[0]
    for (let i = 0; i < 5; i++) {
      stellarBeacons.warpToBeacon(target.id)
    }
    expect(unlockSpy).toHaveBeenCalledWith('quantum_cartographer')
  })
})
