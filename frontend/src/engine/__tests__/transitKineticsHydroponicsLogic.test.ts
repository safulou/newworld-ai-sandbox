import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { cyberRail } from '../cyberRail'
import { voxelKinetics } from '../voxelKinetics'
import { cyberHydroponics, CROP_SPECIES } from '../cyberHydroponics'
import { visualNodeEditor } from '../visualNodeEditor'

describe('Cyber Maglev Hyperloop Transit Engine', () => {
  beforeEach(() => {
    cyberRail.selectRoute('metro_loop')
    cyberRail.pod.speedKmh = 0
    cyberRail.pod.isBoarded = false
    cyberRail.pod.isAutoCruise = true
  })

  it('should initialize with preset routes and default Metro Loop route', () => {
    expect(cyberRail.routes.length).toBeGreaterThanOrEqual(2)
    expect(cyberRail.currentRoute.id).toBe('metro_loop')
    expect(cyberRail.currentRoute.stations.length).toBe(4)
    expect(cyberRail.pod.position.x).toBe(0)
    expect(cyberRail.pod.position.y).toBe(5)
  })

  it('should switch routes and re-position the bullet pod at route origin', () => {
    const success = cyberRail.selectRoute('void_express')
    expect(success).toBe(true)
    expect(cyberRail.currentRouteId).toBe('void_express')
    expect(cyberRail.pod.position.y).toBe(42) // Void realm elevation
  })

  it('should toggle boarding state and mount camera when boarded', () => {
    const camera = new THREE.PerspectiveCamera()
    const boarded = cyberRail.toggleBoarding(camera)
    expect(boarded).toBe(true)
    expect(cyberRail.pod.isBoarded).toBe(true)

    // Update with boarded pod moves camera with pod
    cyberRail.pod.position.set(10, 5, 20)
    cyberRail.update(0.1, camera)
    expect(camera.position.y).toBeGreaterThan(5)

    const unboarded = cyberRail.toggleBoarding()
    expect(unboarded).toBe(false)
  })

  it('should accelerate pod towards speed limit and advance waypoints', () => {
    cyberRail.pod.isAutoCruise = false
    cyberRail.pod.speedKmh = 50
    cyberRail.setTargetSpeed(110)

    // Update step
    cyberRail.update(1.0)
    expect(cyberRail.pod.speedKmh).toBeGreaterThan(50)
    expect(cyberRail.pod.progress).toBeGreaterThan(0)

    // Trigger high-speed run over 100 km/h
    cyberRail.pod.speedKmh = 105
    cyberRail.update(0.1)
    expect(cyberRail.pod.speedKmh).toBeGreaterThanOrEqual(100)
  })
})

describe('Voxel Kinetics Engine (Elevators, Blast Doors & Rotary Gears)', () => {
  beforeEach(() => {
    voxelKinetics.elevators = []
    voxelKinetics.blastDoors = []
    voxelKinetics.rotaryGears = []
    voxelKinetics.addElevator(0, 5, 25, '測試升降梯')
    voxelKinetics.addBlastDoor(10, 5, 10, 'z', '測試氣密門')
    voxelKinetics.addRotaryGear(15, 5, 15, 60, '測試齒輪')
  })

  it('should initialize and trigger vertical elevator travel', () => {
    const el = voxelKinetics.elevators[0]
    expect(el).toBeDefined()
    expect(el.currentY).toBe(5)
    expect(el.state).toBe('idle')

    // Trigger elevator to ascend
    voxelKinetics.triggerElevator(el.id)
    expect(el.state).toBe('moving_up')

    const playerPos = new THREE.Vector3(0, 6.5, 0)
    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 6.5, 0)

    // Update upward motion
    voxelKinetics.update(1.0, playerPos, camera)
    expect(el.currentY).toBeGreaterThan(5)
    expect(camera.position.y).toBeGreaterThan(6.5) // Player lifted with elevator

    // Complete ascension
    voxelKinetics.update(10.0, playerPos, camera)
    expect(el.currentY).toBe(25)
    expect(el.state).toBe('idle')
  })

  it('should automatically open blast door when player is in proximity and close when away', () => {
    const door = voxelKinetics.blastDoors[0]
    expect(door).toBeDefined()
    expect(door.openProgress).toBe(0)

    // Player walks close to door (distance < 3.8)
    const nearPlayer = new THREE.Vector3(10, 5, 11)
    voxelKinetics.update(0.5, nearPlayer)
    expect(door.targetOpen).toBe(true)
    expect(door.openProgress).toBeGreaterThan(0)

    // Full open
    voxelKinetics.update(1.0, nearPlayer)
    expect(door.openProgress).toBe(1.0)

    // Player walks away
    const farPlayer = new THREE.Vector3(50, 5, 50)
    voxelKinetics.update(0.5, farPlayer)
    expect(door.targetOpen).toBe(false)
    expect(door.openProgress).toBeLessThan(1.0)
  })

  it('should rotate kinetic gears according to RPM', () => {
    const gear = voxelKinetics.rotaryGears[0]
    expect(gear).toBeDefined()
    expect(gear.currentAngle).toBe(0)

    voxelKinetics.update(1.0, new THREE.Vector3(0, 0, 0))
    // 60 RPM = 1 rev per second = 2*PI radians
    expect(gear.currentAngle).toBeCloseTo(2 * Math.PI, 1)
  })
})

describe('Cyber Hydroponics & Bio-Synthesis Farm', () => {
  beforeEach(() => {
    cyberHydroponics.activeBuffs = []
    cyberHydroponics.cropInventory = {
      quantum_spores: 2,
      plasma_melon: 2,
      matrix_nightshade: 2,
    }
  })

  it('should define 4 genetically modified crops with valid growth attributes', () => {
    const crops = Object.values(CROP_SPECIES)
    expect(crops.length).toBe(4)
    expect(CROP_SPECIES.quantum_spores).toBeDefined()
    expect(CROP_SPECIES.plasma_melon).toBeDefined()
    expect(CROP_SPECIES.matrix_nightshade).toBeDefined()
    expect(CROP_SPECIES.chrono_wheat).toBeDefined()

    for (const c of crops) {
      expect(c.growthTimeSeconds).toBeGreaterThan(0)
    }
  })

  it('should plant, water, and grow crop through stages until harvest', () => {
    const pod = cyberHydroponics.pods[3]
    pod.cropId = null
    pod.stage = 'seed'
    pod.growthProgress = 0

    // 1. Plant
    const planted = cyberHydroponics.plantCrop(pod.slotIndex, 'chrono_wheat')
    expect(planted).toBe(true)
    expect(pod.cropId).toBe('chrono_wheat')
    expect(pod.hydration).toBe(100)

    // 2. Growth update
    cyberHydroponics.update(5.0)
    expect(pod.growthProgress).toBeGreaterThan(0)
    expect(pod.stage).toBe('sprout')

    // 3. Fast-forward to mature
    pod.growthProgress = 100
    pod.stage = 'mature'

    // 4. Harvest
    const prevCount = cyberHydroponics.cropInventory['chrono_wheat'] || 0
    const harvested = cyberHydroponics.harvestPod(pod.slotIndex)
    expect(harvested).toBe(true)
    expect(cyberHydroponics.cropInventory['chrono_wheat']).toBe(prevCount + 1)
    expect(pod.cropId).toBeNull()
  })

  it('should brew bio-synthesizer potion and apply active buff', () => {
    expect(cyberHydroponics.activeBuffs.length).toBe(0)
    const brewed = cyberHydroponics.brewPotion('potion_sonic_speed')
    expect(brewed).toBe(true)
    expect(cyberHydroponics.activeBuffs.length).toBe(1)
    expect(cyberHydroponics.activeBuffs[0].id).toBe('buff_speed')
    expect(cyberHydroponics.cropInventory['plasma_melon']).toBe(0) // consumed 2

    // Countdown test
    cyberHydroponics.update(10.0)
    expect(cyberHydroponics.activeBuffs[0].remainingSeconds).toBe(50)
  })
})

describe('Visual Node Editor Engine', () => {
  beforeEach(() => {
    visualNodeEditor.reset()
    visualNodeEditor.activeGraph.nodes = []
    visualNodeEditor.activeGraph.connections = []
  })

  it('should add, connect, and remove logic nodes', () => {
    const node1 = visualNodeEditor.addNode('event_player_enter', 50, 50)
    const node2 = visualNodeEditor.addNode('act_broadcast_msg', 250, 50)
    expect(node1).not.toBeNull()
    expect(node2).not.toBeNull()
    expect(visualNodeEditor.activeGraph.nodes.length).toBe(2)

    const conn = visualNodeEditor.addConnection(node1!.id, 'exec', node2!.id, 'exec')
    expect(conn).not.toBeNull()
    expect(visualNodeEditor.activeGraph.connections.length).toBe(1)

    visualNodeEditor.removeConnection(conn!.id)
    expect(visualNodeEditor.activeGraph.connections.length).toBe(0)

    visualNodeEditor.removeNode(node1!.id)
    expect(visualNodeEditor.activeGraph.nodes.length).toBe(1)
  })

  it('should trigger logic network and execute actions downstream', () => {
    const node1 = visualNodeEditor.addNode('event_player_enter', 0, 0)
    const node2 = visualNodeEditor.addNode('act_play_sound', 200, 0)
    expect(node1).toBeDefined()
    expect(node2).toBeDefined()
    const conn = visualNodeEditor.addConnection(node1!.id, 'exec', node2!.id, 'exec')
    expect(conn).toBeDefined()

    expect(() => {
      visualNodeEditor.triggerEvent('event_player_enter')
    }).not.toThrow()
  })
})
