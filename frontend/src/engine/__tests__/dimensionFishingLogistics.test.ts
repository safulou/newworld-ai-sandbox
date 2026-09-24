import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { dimensionWarp, DIMENSIONS } from '../dimensionWarp'
import { cyberFishing, FISH_SPECIES } from '../cyberFishing'
import { droneLogistics } from '../droneLogistics'

describe('Quantum Dimension Warp Engine', () => {
  beforeEach(() => {
    dimensionWarp.reset()
  })

  it('should initialize with overworld and standard 1.0x gravity', () => {
    expect(dimensionWarp.currentDimension).toBe('overworld')
    expect(dimensionWarp.getGravityMultiplier()).toBe(1.0)
    expect(dimensionWarp.currentInfo.name).toContain('霓虹都市主次元')
  })

  it('should reject warping to the same dimension', () => {
    const success = dimensionWarp.warpTo('overworld')
    expect(success).toBe(false)
  })

  it('should warp to neon_void and configure low gravity floating parameters', () => {
    const camera = new THREE.PerspectiveCamera()
    const mockWorld = {
      setBlock: () => {},
    }

    const success = dimensionWarp.warpTo('neon_void', mockWorld, camera)
    expect(success).toBe(true)
    expect(dimensionWarp.currentDimension).toBe('neon_void')
    expect(dimensionWarp.getGravityMultiplier()).toBe(0.45)
    expect(camera.position.y).toBe(45)
  })

  it('should warp to crystal_subcore and configure high gravity', () => {
    const camera = new THREE.PerspectiveCamera()
    const success = dimensionWarp.warpTo('crystal_subcore', undefined, camera)
    expect(success).toBe(true)
    expect(dimensionWarp.currentDimension).toBe('crystal_subcore')
    expect(dimensionWarp.getGravityMultiplier()).toBe(1.35)
    expect(camera.position.y).toBe(15)
  })

  it('should procedurally generate floating islands when generating terrain', () => {
    const placedBlocks: Record<string, string> = {}
    const mockWorld = {
      setBlock: (x: number, y: number, z: number, type: string) => {
        placedBlocks[`${x},${y},${z}`] = type
      },
    }

    dimensionWarp.generateDimensionTerrain('neon_void', mockWorld)
    // Central core monolith should be generated
    expect(placedBlocks['0,42,0']).toBe('quantum_core')
    expect(placedBlocks['0,43,0']).toBe('warp_conduit')
    expect(placedBlocks['0,44,0']).toBe('hologram_glass')

    dimensionWarp.generateDimensionTerrain('crystal_subcore', mockWorld)
    // Subcore pillar should be generated
    expect(placedBlocks['0,14,0']).toBe('plasma_containment')
    expect(placedBlocks['0,23,0']).toBe('quantum_core')
  })

  it('should provide comprehensive metadata for all 3 realms', () => {
    const keys = Object.keys(DIMENSIONS)
    expect(keys).toContain('overworld')
    expect(keys).toContain('neon_void')
    expect(keys).toContain('crystal_subcore')

    for (const info of Object.values(DIMENSIONS)) {
      expect(info.name.length).toBeGreaterThan(0)
      expect(info.themeColor).toBeGreaterThan(0)
      expect(info.gravityMultiplier).toBeGreaterThan(0)
      expect(info.description.length).toBeGreaterThan(0)
    }
  })
})

describe('Cyberpunk Plasma Angling & Deep-Sea Codex', () => {
  beforeEach(() => {
    cyberFishing.reset()
  })

  it('should have 8 distinct cyber aquatic species with valid attributes', () => {
    const speciesList = Object.values(FISH_SPECIES)
    expect(speciesList.length).toBe(8)

    const expectedIds = [
      'plasma_eel',
      'cyber_coelacanth',
      'pulse_puffer',
      'quantum_koi',
      'neon_chromasquid',
      'mecha_shark',
      'void_anglerfish',
      'crystal_sea_dragon',
    ]

    for (const id of expectedIds) {
      const sp = FISH_SPECIES[id]
      expect(sp).toBeDefined()
      expect(sp.minWeightKg).toBeLessThan(sp.maxWeightKg)
      expect(sp.minLengthCm).toBeLessThan(sp.maxLengthCm)
      expect(sp.catchChance).toBeGreaterThan(0)
      expect(sp.difficulty).toBeGreaterThanOrEqual(1.0)
    }
  })

  it('should cast rod and enter waiting state', () => {
    cyberFishing.castRod()
    expect(cyberFishing.state).toBe('waiting')
  })

  it('should fail hooking when waiting too early', () => {
    cyberFishing.castRod()
    expect(cyberFishing.state).toBe('waiting')
    const hooked = cyberFishing.hookLine()
    expect(hooked).toBe(false)
    expect(cyberFishing.state).toBe('escaped')
  })

  it('should hook successfully during nibble and initialize tension game', () => {
    cyberFishing.state = 'nibble'
    const hooked = cyberFishing.hookLine()
    expect(hooked).toBe(true)
    expect(cyberFishing.state).toBe('hooked')
    expect(cyberFishing.currentTargetFish).not.toBeNull()
    expect(cyberFishing.lineTension).toBe(50)
    expect(cyberFishing.reelProgress).toBe(25)
  })

  it('should increase reel progress when tension is within sweet zone', () => {
    cyberFishing.state = 'nibble'
    cyberFishing.hookLine()
    expect(cyberFishing.state).toBe('hooked')

    cyberFishing.lineTension = 55 // inside sweet zone 38 to 72
    const prevProgress = cyberFishing.reelProgress

    cyberFishing.updateReeling(0.1, false)
    expect(cyberFishing.reelProgress).toBeGreaterThan(prevProgress)
  })

  it('should snap line when tension hits 100', () => {
    cyberFishing.state = 'nibble'
    cyberFishing.hookLine()
    cyberFishing.lineTension = 95

    // Reeling heavily pushes tension over 100 (42 * 0.5 = +21)
    cyberFishing.updateReeling(0.5, true)
    expect(cyberFishing.lineTension).toBe(100)
    expect(cyberFishing.state).toBe('escaped')
  })

  it('should complete catch and record into codex upon reaching 100 progress', () => {
    cyberFishing.state = 'nibble'
    cyberFishing.hookLine()
    cyberFishing.reelProgress = 99.5
    cyberFishing.lineTension = 55

    cyberFishing.updateReeling(0.1, false)
    expect(cyberFishing.state).toBe('caught')
    expect(cyberFishing.lastCaughtFish).not.toBeNull()

    const caughtId = cyberFishing.lastCaughtFish!.species.id
    const record = cyberFishing.getCodexRecord(caughtId)
    expect(record).toBeDefined()
    expect(record?.caughtCount).toBeGreaterThanOrEqual(1)
    expect(cyberFishing.getTotalCaughtCount()).toBeGreaterThanOrEqual(1)
  })
})

describe('Autonomous Drone Patrol & Aerial Airdrop Logistics', () => {
  beforeEach(() => {
    droneLogistics.clearWaypoints()
    droneLogistics.activeCrates = []
  })

  it('should add, navigate, and remove waypoints', () => {
    const wp1 = droneLogistics.addWaypoint({ x: 10, y: 15, z: 20 }, '基地北門')
    const wp2 = droneLogistics.addWaypoint({ x: 30, y: 18, z: 40 }, '能源塔前哨')

    expect(droneLogistics.waypoints.length).toBe(2)
    expect(droneLogistics.getActiveWaypoint()?.id).toBe(wp1.id)

    const removed = droneLogistics.removeWaypoint(wp1.id)
    expect(removed).toBe(true)
    expect(droneLogistics.waypoints.length).toBe(1)
    expect(droneLogistics.getActiveWaypoint()?.id).toBe(wp2.id)
  })

  it('should start and stop patrol state', () => {
    expect(droneLogistics.startPatrol()).toBe(false) // cannot start with 0 waypoints

    droneLogistics.addWaypoint({ x: 0, y: 15, z: 0 })
    expect(droneLogistics.startPatrol()).toBe(true)
    expect(droneLogistics.isPatrolling).toBe(true)

    droneLogistics.stopPatrol()
    expect(droneLogistics.isPatrolling).toBe(false)
  })

  it('should spawn tactical aerial airdrop crate with parachute and loot', () => {
    const dropPos = new THREE.Vector3(50, 10, 50)
    const crate = droneLogistics.spawnAirdrop(dropPos, 10)

    expect(crate).toBeDefined()
    expect(crate.position.y).toBeGreaterThan(30)
    expect(crate.targetY).toBe(10)
    expect(crate.isLanded).toBe(false)
    expect(crate.loot).toContain('quantum_core')
    expect(droneLogistics.activeCrates.length).toBe(1)
  })

  it('should descend crate during update and unpack voxels upon landing', () => {
    const dropPos = new THREE.Vector3(12, 10, 14)
    const crate = droneLogistics.spawnAirdrop(dropPos, 10)

    const placedBlocks: Record<string, string> = {}
    const mockWorld = {
      setBlock: (x: number, y: number, z: number, type: string) => {
        placedBlocks[`${x},${y},${z}`] = type
      },
    }

    const initialY = crate.position.y
    // Update step 1: descending
    droneLogistics.update(1.0, mockWorld)
    expect(crate.position.y).toBeLessThan(initialY)
    expect(crate.isLanded).toBe(false)

    // Fast-forward to touchdown
    crate.position.y = 10.5
    droneLogistics.update(0.5, mockWorld)

    expect(crate.isLanded).toBe(true)
    expect(crate.position.y).toBe(10)
    // Verify unpacked supply blocks
    expect(placedBlocks['12,10,14']).toBe('quantum_core')
    expect(placedBlocks['13,10,14']).toBe('amethyst')
    expect(placedBlocks['11,10,14']).toBe('plasma_containment')
    expect(placedBlocks['12,10,15']).toBe('matrix_grid')
  })

  it('should advance waypoint when drone reaches within proximity threshold', () => {
    droneLogistics.addWaypoint({ x: 0, y: 12, z: 0 })
    droneLogistics.addWaypoint({ x: 20, y: 12, z: 20 })
    droneLogistics.startPatrol()

    const droneMesh = new THREE.Group()
    droneMesh.position.set(0, 12, 0.5) // within 1.5 units of waypoint 0

    droneLogistics.update(0.1, undefined, droneMesh)
    expect(droneLogistics.activeWaypointIndex).toBe(1)
  })
})
