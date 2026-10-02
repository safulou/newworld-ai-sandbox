import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hyperjumpDrive } from '../hyperjumpDrive'
import { netrunnerWarfare } from '../netrunnerWarfare'
import { leviathanBoss } from '../leviathanBoss'
import { supergridPower } from '../supergridPower'
import { achievements } from '../achievements'

describe('Part 10: Hyperjump Drive Engine', () => {
  beforeEach(() => {
    hyperjumpDrive.stats.state = 'idle'
    hyperjumpDrive.stats.currentSectorId = 'sector_sol'
    hyperjumpDrive.stats.targetSectorId = 'sector_cygnus'
    hyperjumpDrive.stats.antimatterFuel = 100
    hyperjumpDrive.stats.capacitorCharge = 100
    hyperjumpDrive.stats.warpFactor = 10
    hyperjumpDrive.stats.chargeProgress = 0
    hyperjumpDrive.stats.warpProgress = 0
    hyperjumpDrive.stats.cooldownRemaining = 0
  })

  it('should initialize with star sectors and valid start coordinates', () => {
    expect(hyperjumpDrive.sectors.length).toBeGreaterThanOrEqual(5)
    const sol = hyperjumpDrive.getCurrentSector()
    expect(sol?.id).toBe('sector_sol')
    expect(sol?.discovered).toBe(true)
  })

  it('should allow selecting valid destination and clamp warp factor', () => {
    const success = hyperjumpDrive.selectDestination('sector_kepler')
    expect(success).toBe(true)
    expect(hyperjumpDrive.stats.targetSectorId).toBe('sector_kepler')

    hyperjumpDrive.setWarpFactor(65)
    expect(hyperjumpDrive.stats.warpFactor).toBe(50) // Max 50x

    hyperjumpDrive.setWarpFactor(-5)
    expect(hyperjumpDrive.stats.warpFactor).toBe(1)  // Min 1x
  })

  it('should reject jump initiation if target is same as current or fuel is low', () => {
    hyperjumpDrive.stats.targetSectorId = 'sector_sol'
    let res = hyperjumpDrive.initiateJump()
    expect(res.success).toBe(false)

    hyperjumpDrive.stats.targetSectorId = 'sector_cygnus'
    hyperjumpDrive.stats.antimatterFuel = 5
    res = hyperjumpDrive.initiateJump()
    expect(res.success).toBe(false)
    expect(res.message).toContain('反物質燃料不足')
  })

  it('should execute full jump lifecycle: idle -> charging -> in_warp -> arrival -> cooldown -> idle', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    hyperjumpDrive.stats.targetSectorId = 'sector_horizon'
    const res = hyperjumpDrive.initiateJump()
    expect(res.success).toBe(true)
    expect(hyperjumpDrive.stats.state).toBe('charging')

    // Advance 3.1s for charging to finish
    hyperjumpDrive.update(3.1)
    expect(hyperjumpDrive.stats.state).toBe('in_warp')
    expect(hyperjumpDrive.stats.antimatterFuel).toBeLessThan(100)

    // Advance 4.6s for in_warp transit to complete
    hyperjumpDrive.update(4.6)
    expect(hyperjumpDrive.stats.state).toBe('arrival')
    expect(hyperjumpDrive.stats.currentSectorId).toBe('sector_horizon')
    expect(unlockSpy).toHaveBeenCalledWith('hyperjump_voyager')

    // Advance 1.6s to transition to cooldown
    hyperjumpDrive.update(1.6)
    expect(hyperjumpDrive.stats.state).toBe('cooldown')
    expect(hyperjumpDrive.stats.cooldownRemaining).toBeGreaterThan(0)

    // Advance 6.1s to finish cooldown
    hyperjumpDrive.update(6.1)
    expect(hyperjumpDrive.stats.state).toBe('idle')
  })

  it('should allow aborting jump during charging', () => {
    hyperjumpDrive.initiateJump()
    expect(hyperjumpDrive.stats.state).toBe('charging')
    const aborted = hyperjumpDrive.abortJump()
    expect(aborted).toBe(true)
    expect(hyperjumpDrive.stats.state).toBe('idle')
  })

  it('should refuel antimatter correctly capped at 100%', () => {
    hyperjumpDrive.stats.antimatterFuel = 50
    hyperjumpDrive.refuelAntimatter(30)
    expect(hyperjumpDrive.stats.antimatterFuel).toBe(80)

    hyperjumpDrive.refuelAntimatter(50)
    expect(hyperjumpDrive.stats.antimatterFuel).toBe(100)
  })
})

describe('Part 10: Netrunner Warfare Engine', () => {
  beforeEach(() => {
    netrunnerWarfare.stats.inRaid = false
    netrunnerWarfare.stats.activeTargetId = null
    netrunnerWarfare.stats.raidProgress = 0
    netrunnerWarfare.stats.traceProgress = 0
    netrunnerWarfare.stats.attackerHealth = 100
    netrunnerWarfare.stats.isDumped = false
    netrunnerWarfare.stats.lockoutRemaining = 0
    netrunnerWarfare.mySubnet.vaultCredits = 5000
    netrunnerWarfare.mySubnet.firewallHealth = 100
  })

  it('should initialize local subnet with 4 ICE slots and raid targets', () => {
    expect(netrunnerWarfare.mySubnet.iceSlots.length).toBe(4)
    expect(netrunnerWarfare.targets.length).toBeGreaterThanOrEqual(4)
  })

  it('should upgrade ICE slots and deduct credits', () => {
    const slot = netrunnerWarfare.mySubnet.iceSlots[0]
    const initialLvl = slot.level
    const initialCredits = netrunnerWarfare.mySubnet.vaultCredits
    const cost = initialLvl * 800

    const ok = netrunnerWarfare.upgradeIce(slot.id)
    expect(ok).toBe(true)
    expect(slot.level).toBe(initialLvl + 1)
    expect(netrunnerWarfare.mySubnet.vaultCredits).toBe(initialCredits - cost)
  })

  it('should trigger EMP defense and flush ICE nodes', () => {
    netrunnerWarfare.mySubnet.iceSlots[0].health = 20
    netrunnerWarfare.flushIceNodes()
    expect(netrunnerWarfare.mySubnet.iceSlots[0].health).toBe(netrunnerWarfare.mySubnet.iceSlots[0].maxHealth)

    const beforeCredits = netrunnerWarfare.mySubnet.vaultCredits
    netrunnerWarfare.triggerEmpDefense()
    expect(netrunnerWarfare.mySubnet.vaultCredits).toBe(beforeCredits - 200)
  })

  it('should start infiltration raid and execute breach vectors', () => {
    const startRes = netrunnerWarfare.startRaid('node_arasaka_sub')
    expect(startRes.success).toBe(true)
    expect(netrunnerWarfare.stats.inRaid).toBe(true)

    // Execute Brute force
    const initialBreach = netrunnerWarfare.stats.raidProgress
    netrunnerWarfare.executeBruteForce()
    expect(netrunnerWarfare.stats.raidProgress).toBeGreaterThan(initialBreach)

    // Execute Packet Spoof
    const beforeTrace = netrunnerWarfare.stats.traceProgress
    netrunnerWarfare.executePacketSpoof()
    expect(netrunnerWarfare.stats.traceProgress).toBeLessThanOrEqual(beforeTrace)
  })

  it('should reward credits and blueprint upon 100% raid completion', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    netrunnerWarfare.startRaid('node_arasaka_sub')
    netrunnerWarfare.stats.raidProgress = 95
    netrunnerWarfare.executeBruteForce() // Pushes over 100%

    expect(netrunnerWarfare.stats.inRaid).toBe(false)
    expect(netrunnerWarfare.stats.victories).toBeGreaterThan(0)
    expect(unlockSpy).toHaveBeenCalledWith('ice_sentinel')
  })

  it('should trigger meatspace dump and penalty when trace hits 100%', () => {
    netrunnerWarfare.startRaid('node_arasaka_sub')
    netrunnerWarfare.stats.traceProgress = 95
    netrunnerWarfare.executeZeroDay() // Pushes trace over 100%

    expect(netrunnerWarfare.stats.inRaid).toBe(false)
    expect(netrunnerWarfare.stats.isDumped).toBe(true)
    expect(netrunnerWarfare.stats.lockoutRemaining).toBeGreaterThan(0)
  })
})

describe('Part 10: Deep-Sea Cyber Leviathan Boss Engine', () => {
  beforeEach(() => {
    leviathanBoss.resetEncounter()
  })

  it('should spawn encounter with full boss HP and submarine stats', () => {
    leviathanBoss.spawnEncounter()
    expect(leviathanBoss.stats.phase).toBe('stalking')
    expect(leviathanBoss.stats.bossHP).toBe(5000)
    expect(leviathanBoss.stats.subHP).toBe(1000)
    expect(leviathanBoss.stats.torpedoAmmo).toBe(14)
  })

  it('should fire torpedoes, deal damage and consume ammo', () => {
    leviathanBoss.spawnEncounter()
    const res = leviathanBoss.fireTorpedo()
    expect(res.success).toBe(true)
    expect(leviathanBoss.stats.torpedoAmmo).toBe(13)
    expect(leviathanBoss.stats.bossHP).toBeLessThan(5000)
    expect(leviathanBoss.stats.torpedoCooldown).toBeGreaterThan(0)
  })

  it('should transition through phases: stalking -> emp_frenzy (<70%) -> meltdown (<30%)', () => {
    leviathanBoss.spawnEncounter()
    // Reduce Boss HP to 65%
    leviathanBoss.stats.bossHP = 3200
    leviathanBoss.fireTorpedo()
    expect(leviathanBoss.stats.phase).toBe('emp_frenzy')

    // Reduce Boss HP to 25%
    leviathanBoss.stats.bossHP = 1200
    leviathanBoss.stats.torpedoCooldown = 0
    leviathanBoss.fireTorpedo()
    expect(leviathanBoss.stats.phase).toBe('meltdown')
    expect(leviathanBoss.stats.meltdownCountdown).toBe(60)
  })

  it('should fire flash sonar to blind boss and deploy acoustic decoy', () => {
    leviathanBoss.spawnEncounter()
    leviathanBoss.stats.channelingAttack = 'EMP 衝擊波'
    const flashRes = leviathanBoss.fireFlashSonar()
    expect(flashRes.success).toBe(true)
    expect(leviathanBoss.stats.isBlinded).toBe(true)
    expect(leviathanBoss.stats.channelingAttack).toBeNull() // Interrupted!

    const decoyRes = leviathanBoss.deployDecoy()
    expect(decoyRes.success).toBe(true)
    expect(leviathanBoss.stats.decoyCharges).toBe(2)
  })

  it('should defeat boss at 0 HP, award mythic drops, and unlock achievement', () => {
    const unlockSpy = vi.spyOn(achievements, 'unlock')
    leviathanBoss.spawnEncounter()
    leviathanBoss.stats.bossHP = 100
    leviathanBoss.fireTorpedo()

    expect(leviathanBoss.stats.phase).toBe('defeated')
    expect(leviathanBoss.stats.killCount).toBeGreaterThan(0)
    expect(leviathanBoss.dropsVault.some(d => d.id === 'drop_core')).toBe(true)
    expect(unlockSpy).toHaveBeenCalledWith('leviathan_slayer')
  })
})

describe('Part 10: Supergrid Power & Energy Market Engine', () => {
  beforeEach(() => {
    supergridPower.stats.isBlackout = false
    supergridPower.wallet.credits = 5000
    supergridPower.wallet.powerContractsKWh = 2000
    supergridPower.wallet.carbonCreditsTon = 10
    supergridPower.wallet.totalProfit = 0
  })

  it('should initialize with interconnected substations and calculate net balance', () => {
    expect(supergridPower.substations.length).toBe(4)
    expect(supergridPower.stats.totalGenerationMW).toBeGreaterThan(0)
    expect(supergridPower.stats.totalDemandMW).toBeGreaterThan(0)
  })

  it('should auto-balance grid frequency to 50.00 Hz using SMES storage', () => {
    supergridPower.stats.gridFrequency = 48.9
    const res = supergridPower.autoBalanceFrequency()
    expect(res.success).toBe(true)
    expect(supergridPower.stats.gridFrequency).toBe(50.00)
    expect(supergridPower.stats.stabilityPercent).toBeGreaterThanOrEqual(95)
  })

  it('should execute emergency load shedding on substations', () => {
    const sub = supergridPower.substations[0]
    expect(sub.isShed).toBe(false)
    supergridPower.emergencyLoadShedding(sub.id)
    expect(sub.isShed).toBe(true)
  })

  it('should adjust substation output and toggle online state', () => {
    const sub = supergridPower.substations[0]
    const initialGen = sub.generationMW
    supergridPower.adjustSubstationOutput(sub.id, 400)
    expect(sub.generationMW).toBe(initialGen + 400)

    supergridPower.toggleSubstation(sub.id)
    expect(sub.isOnline).toBe(false)
  })

  it('should trade electricity and carbon contracts in the energy market', () => {
    const initialCredits = supergridPower.wallet.credits
    const buyRes = supergridPower.buyPower(1000)
    expect(buyRes.success).toBe(true)
    expect(supergridPower.wallet.powerContractsKWh).toBe(3000)
    expect(supergridPower.wallet.credits).toBeLessThan(initialCredits)

    const sellRes = supergridPower.sellPower(1000)
    expect(sellRes.success).toBe(true)
    expect(supergridPower.wallet.powerContractsKWh).toBe(2000)
    expect(supergridPower.wallet.totalProfit).toBeGreaterThan(0)
  })

  it('should trigger blackout recovery via manual black start', () => {
    supergridPower.stats.isBlackout = true
    supergridPower.manualBlackStart()
    expect(supergridPower.stats.isBlackout).toBe(false)
    expect(supergridPower.stats.gridFrequency).toBe(50.00)
  })
})
