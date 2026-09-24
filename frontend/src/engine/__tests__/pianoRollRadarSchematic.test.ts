import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as THREE from 'three'
import { pianoRoll, PITCH_NAMES, STEP_COUNT } from '../pianoRoll'
import { vehicleStunts } from '../vehicleStunts'
import { vehicles } from '../vehicles'
import { radar } from '../radar'
import { schematics, PREFAB_NEON_TREE, PREFAB_WARP_GATE } from '../schematics'

describe('PianoRollEngine & Step Sequencer Matrix', () => {
  beforeEach(() => {
    pianoRoll.stop()
    pianoRoll.clear()
  })

  it('should initialize empty 25x16 matrix across 4 instruments', () => {
    const grid = pianoRoll.createEmptyGrid()
    expect(Object.keys(grid)).toEqual(['bell', 'bass', 'chip', 'drum'])
    expect(grid.chip.length).toBe(25)
    expect(grid.chip[0].length).toBe(STEP_COUNT)
    expect(PITCH_NAMES.length).toBe(25)
  })

  it('should toggle notes correctly and ignore out-of-bound indices', () => {
    expect(pianoRoll.toggleCell('chip', 12, 0)).toBe(true)
    expect(pianoRoll.grid.chip[12][0]).toBe(true)

    // Toggle off
    expect(pianoRoll.toggleCell('chip', 12, 0)).toBe(false)
    expect(pianoRoll.grid.chip[12][0]).toBe(false)

    // Out of bounds
    expect(pianoRoll.toggleCell('chip', 99, 0)).toBe(false)
    expect(pianoRoll.toggleCell('chip', 0, 99)).toBe(false)
  })

  it('should load presets correctly', () => {
    pianoRoll.loadPreset('crystal_bell')
    expect(pianoRoll.bpm).toBe(95)
    // Check crystal bell has active bell notes
    const activeBellCount = pianoRoll.grid.bell.flat().filter(Boolean).length
    expect(activeBellCount).toBeGreaterThan(0)

    pianoRoll.loadPreset('cyber_techno')
    expect(pianoRoll.bpm).toBe(135)
    const activeDrums = pianoRoll.grid.drum.flat().filter(Boolean).length
    expect(activeDrums).toBeGreaterThan(0)
  })

  it('should compile piano roll grid into SequenceSong with note events', () => {
    pianoRoll.grid.chip[12][0] = true
    pianoRoll.grid.bass[0][4] = true
    const song = pianoRoll.compileToSong('Test DAW Track')

    expect(song.name).toBe('Test DAW Track')
    expect(song.bpm).toBe(pianoRoll.bpm)
    expect(song.notes.length).toBe(2)
    expect(song.notes.some(n => n.instrument === 'chip' && n.pitch === 12)).toBe(true)
    expect(song.notes.some(n => n.instrument === 'bass' && n.pitch === 0)).toBe(true)
  })

  it('should load from SequenceSong and restore grid cells', () => {
    const mockSong = {
      version: '1.0',
      name: 'Restored Song',
      bpm: 120,
      author: 'Tester',
      createdAt: new Date().toISOString(),
      totalDuration: 2.0,
      notes: [
        { id: '1', time: 0, pitch: 7, instrument: 'bell' as const, volume: 1, duration: 0.2 },
        { id: '2', time: 0.25, pitch: 14, instrument: 'bass' as const, volume: 1, duration: 0.2 },
      ],
    }

    pianoRoll.loadFromSong(mockSong)
    expect(pianoRoll.bpm).toBe(120)
    expect(pianoRoll.grid.bell[7][0]).toBe(true)
    expect(pianoRoll.grid.bass[14][2]).toBe(true) // 0.25s / (60/120/4 = 0.125) = step 2
  })

  it('should handle playback controls', () => {
    const stepSpy = vi.fn()
    pianoRoll.play(stepSpy)
    expect(pianoRoll.isPlaying).toBe(true)
    expect(pianoRoll.currentStep).toBe(0)

    pianoRoll.stop()
    expect(pianoRoll.isPlaying).toBe(false)
    expect(pianoRoll.currentStep).toBe(-1)
  })
})

describe('VehicleStuntEngine & Acrobatic Physics', () => {
  beforeEach(() => {
    vehicles.setVehicle('speeder')
    vehicleStunts.state.isRolling = false
    vehicleStunts.state.rollCooldown = 0
    vehicleStunts.state.boostActive = false
    vehicleStunts.clearPassengers()
  })

  it('should trigger barrel roll when vehicle is active', () => {
    const triggered = vehicleStunts.triggerBarrelRoll('left')
    expect(triggered).toBe(true)
    expect(vehicleStunts.state.isRolling).toBe(true)
    expect(vehicleStunts.state.rollDirection).toBe('left')
    expect(vehicleStunts.state.rollCooldown).toBeGreaterThan(0)

    // Cannot trigger again during roll/cooldown
    expect(vehicleStunts.triggerBarrelRoll('right')).toBe(false)
  })

  it('should prevent stunt roll when on foot', () => {
    vehicles.setVehicle('none')
    expect(vehicleStunts.triggerBarrelRoll('left')).toBe(false)
  })

  it('should update roll angles and speed bonuses', () => {
    vehicleStunts.triggerBarrelRoll('right')
    expect(vehicleStunts.getStuntSpeedBonus()).toBeCloseTo(1.35)

    // Step halfway through roll (0.65s duration / 2 ~ 0.325s)
    const angleMid = vehicleStunts.update(0.325)
    expect(angleMid).toBeGreaterThan(0)

    // Finish roll
    vehicleStunts.update(0.4)
    expect(vehicleStunts.state.isRolling).toBe(false)
    expect(vehicleStunts.state.rollAngle).toBe(0)
  })

  it('should support warp speed bursts', () => {
    expect(vehicleStunts.triggerWarpBurst()).toBe(true)
    expect(vehicleStunts.state.boostActive).toBe(true)
    expect(vehicleStunts.getStuntSpeedBonus()).toBeCloseTo(1.75)

    // Expires after delta
    vehicleStunts.update(0.9)
    expect(vehicleStunts.state.boostActive).toBe(false)
    expect(vehicleStunts.getStuntSpeedBonus()).toBe(1.0)
  })

  it('should manage co-op passenger seats and calculate rotated world offsets', () => {
    vehicles.setVehicle('speeder') // Max 1 passenger
    expect(vehicleStunts.canMountPassenger()).toBe(true)
    expect(vehicleStunts.mountPassenger('p1', 'Alice')).toBe(true)
    expect(vehicleStunts.canMountPassenger()).toBe(false) // Speeder full
    expect(vehicleStunts.mountPassenger('p2', 'Bob')).toBe(false)

    // Passenger positions
    const pos = new THREE.Vector3(10, 5, 20)
    const yaw = 0
    const passengerPos = vehicleStunts.getPassengerWorldPositions(pos, yaw)
    expect(passengerPos.length).toBe(1)
    expect(passengerPos[0].name).toBe('Alice')
    expect(passengerPos[0].position.x).toBe(10)
    expect(passengerPos[0].position.z).toBeCloseTo(19.1) // 20 + offset.z (-0.9)

    // Dismount
    expect(vehicleStunts.dismountPassenger('p1')).toBe(true)
    expect(vehicleStunts.getPassengers().length).toBe(0)
  })
})

describe('RadarEngine & Tactical Entity Scanning', () => {
  it('should cycle zoom levels and scale radar ranges', () => {
    expect(radar.currentZoom).toBe(1)
    expect(radar.currentRange).toBe(48)

    radar.cycleZoom()
    expect(radar.currentZoom).toBe(2)
    expect(radar.currentRange).toBe(96)

    radar.cycleZoom()
    expect(radar.currentZoom).toBe(4)
    expect(radar.currentRange).toBe(192)

    radar.cycleZoom()
    expect(radar.currentZoom).toBe(1)
  })

  it('should advance sweep angle smoothly on update', () => {
    radar.sweepAngle = 0
    radar.update(0.5)
    expect(radar.sweepAngle).toBeCloseTo(1.2)
  })

  it('should scan entities and return blips without throwing', () => {
    const center = new THREE.Vector3(0, 5, 0)
    const blips = radar.scan(center)
    expect(Array.isArray(blips)).toBe(true)
  })
})

describe('SchematicEngine & Prefab Stamping', () => {
  it('should have standard built-in prefabs loaded', () => {
    expect(schematics.prefabs.length).toBeGreaterThanOrEqual(4)
    const neonTree = schematics.selectSchematic('prefab-neon-tree')
    expect(neonTree).toBeDefined()
    expect(neonTree?.name).toContain('賽博霓虹樹')
    expect(neonTree?.blocks.length).toBeGreaterThan(10)
  })

  it('should rotate schematic blocks 90, 180, 270 degrees correctly', () => {
    const original = PREFAB_WARP_GATE
    const origW = original.dimensions.width
    const origD = original.dimensions.depth

    // 90 deg rotation swaps width and depth
    const rot90 = schematics.rotate(original, 90)
    expect(rot90.dimensions.width).toBe(origD)
    expect(rot90.dimensions.depth).toBe(origW)
    expect(rot90.blocks.length).toBe(original.blocks.length)

    // 180 deg preserves dimensions
    const rot180 = schematics.rotate(original, 180)
    expect(rot180.dimensions.width).toBe(origW)
    expect(rot180.dimensions.depth).toBe(origD)

    // 270 deg swaps width and depth
    const rot270 = schematics.rotate(original, 270)
    expect(rot270.dimensions.width).toBe(origD)
    expect(rot270.dimensions.depth).toBe(origW)
  })

  it('should copy a region from world and paste back', () => {
    const worldMap = new Map<string, string>()
    const mockWorld = {
      getBlock: (x: number, y: number, z: number) => worldMap.get(`${x},${y},${z}`) || 'air',
      setBlock: (x: number, y: number, z: number, type: string) => {
        worldMap.set(`${x},${y},${z}`, type)
      },
    }

    // Place some test blocks in world
    mockWorld.setBlock(10, 2, 10, 'neon_cyan')
    mockWorld.setBlock(11, 2, 10, 'basalt')
    mockWorld.setBlock(10, 3, 10, 'quantum_core')

    // Copy region (10, 2, 10) to (12, 4, 12)
    const captured = schematics.copyRegion(mockWorld, 10, 2, 10, 12, 4, 12, 'Unit Test Box')
    expect(captured.blocks.length).toBe(3)
    expect(captured.dimensions.width).toBe(3)
    expect(captured.dimensions.height).toBe(3)
    expect(captured.dimensions.depth).toBe(3)

    // Paste at new location (50, 0, 50)
    const placed = schematics.paste(mockWorld, captured, 50, 0, 50, 0)
    expect(placed).toBe(3)
    expect(mockWorld.getBlock(50, 0, 50)).toBe('neon_cyan')
    expect(mockWorld.getBlock(51, 0, 50)).toBe('basalt')
    expect(mockWorld.getBlock(50, 1, 50)).toBe('quantum_core')
  })

  it('should export and import JSON schematics accurately', () => {
    const jsonStr = schematics.exportJSON(PREFAB_NEON_TREE)
    expect(jsonStr).toContain('prefab-neon-tree')
    expect(jsonStr).toContain('blocks')

    const imported = schematics.importJSON(jsonStr)
    expect(imported).not.toBeNull()
    expect(imported?.id).toBe(PREFAB_NEON_TREE.id)
    expect(imported?.blocks.length).toBe(PREFAB_NEON_TREE.blocks.length)
  })
})
