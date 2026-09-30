import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { factoryLogistics } from '../factoryLogistics'
import { acousticEnvironment } from '../acousticEnvironment'
import { voxelSculptor } from '../voxelSculptor'
import { gravityAnomalies } from '../gravityAnomalies'

describe('Factory Logistics Engine (Conveyor Belts, Sorters & Autonomous Drones)', () => {
  beforeEach(() => {
    factoryLogistics.reset()
  })

  it('should initialize with default conveyor belts and sorters', () => {
    expect(factoryLogistics.belts.length).toBeGreaterThanOrEqual(5)
    expect(factoryLogistics.sorters.length).toBeGreaterThanOrEqual(1)
    expect(factoryLogistics.missions.length).toBeGreaterThanOrEqual(1)
  })

  it('should add and remove conveyor belts and toggle overdrive', () => {
    const belt = factoryLogistics.addBelt(10, 4, 10, 'south')
    expect(belt).toBeDefined()
    expect(belt.direction).toBe('south')

    factoryLogistics.setOverdrive(true)
    expect(factoryLogistics.isOverdrive).toBe(true)
    expect(belt.speed).toBe(5.0)

    factoryLogistics.setOverdrive(false)
    expect(belt.speed).toBe(2.5)

    factoryLogistics.removeBelt(belt.id)
    expect(factoryLogistics.belts.find(b => b.id === belt.id)).toBeUndefined()
  })

  it('should spawn items, advance along belt, and filter through optical sorters', () => {
    const item = factoryLogistics.spawnItem('quantum_spore')
    expect(item).toBeDefined()
    expect(item?.type).toBe('quantum_spore')
    expect(factoryLogistics.items.length).toBe(1)

    // Advance simulation
    factoryLogistics.update(0.1)
    expect(item?.progress).toBeGreaterThan(0)

    // Fast-forward to terminus processing
    for (let i = 0; i < 20; i++) {
      factoryLogistics.update(0.5)
    }
    expect(factoryLogistics.totalItemsProcessed).toBeGreaterThanOrEqual(1)
  })

  it('should advance autonomous drone logistics missions and cycle stages', () => {
    const mission = factoryLogistics.missions[0]
    expect(mission).toBeDefined()

    factoryLogistics.update(1.0)
    expect(mission.elapsed).toBeGreaterThan(0)
    expect(mission.status).toBe('flying_to_source')

    // Advance to loading stage
    factoryLogistics.update(1.5)
    expect(['flying_to_source', 'loading', 'flying_to_dest']).toContain(mission.status)
  })
})

describe('Acoustic Environment Engine (Occlusion, Underwater & Convolver Reverb)', () => {
  beforeEach(() => {
    acousticEnvironment.setEnvironment(false, false, 'neon_city')
  })

  it('should initialize with open-air parameters', () => {
    expect(acousticEnvironment.state.isUnderwater).toBe(false)
    expect(acousticEnvironment.state.isInsideCabin).toBe(false)
    expect(acousticEnvironment.state.currentRealm).toBe('neon_city')
  })

  it('should configure underwater lowpass filter and resonant occlusion', () => {
    acousticEnvironment.setEnvironment(true, false, 'neon_city')
    expect(acousticEnvironment.state.isUnderwater).toBe(true)

    acousticEnvironment.update(0.5)
    expect(acousticEnvironment.state.lowpassCutoff).toBeLessThan(10000)
    expect(acousticEnvironment.state.occlusionDb).toBeLessThan(0)
  })

  it('should configure hyperloop sealed cabin acoustic damping', () => {
    acousticEnvironment.setEnvironment(false, true, 'neon_city')
    expect(acousticEnvironment.state.isInsideCabin).toBe(true)

    acousticEnvironment.update(0.5)
    expect(acousticEnvironment.state.lowpassCutoff).toBeLessThan(5000)
    expect(acousticEnvironment.state.occlusionDb).toBeLessThan(0)
  })

  it('should trigger procedural sound pings cleanly without throwing', () => {
    expect(() => {
      acousticEnvironment.playUnderwaterBubble()
      acousticEnvironment.playSonarPulse()
      acousticEnvironment.playCabinVentHum()
    }).not.toThrow()
  })
})

describe('Voxel Micro-Sculptor Engine & Hologram Projector Pedestals', () => {
  beforeEach(() => {
    voxelSculptor.reset()
  })

  it('should initialize with preset models, projectors, and neon signs', () => {
    expect(voxelSculptor.models.length).toBeGreaterThanOrEqual(2)
    expect(voxelSculptor.projectors.length).toBeGreaterThanOrEqual(1)
    expect(voxelSculptor.signs.length).toBeGreaterThanOrEqual(1)
  })

  it('should carve, recolor, and clear 16x16 micro-voxels', () => {
    voxelSculptor.setVoxel(5, 5, 5, '#00f0ff')
    expect(voxelSculptor.activeModel.voxels['5,5,5']).toBe('#00f0ff')

    voxelSculptor.fillBox(0, 0, 0, 2, 2, 2, '#ff007f')
    expect(voxelSculptor.activeModel.voxels['0,0,0']).toBe('#ff007f')
    expect(voxelSculptor.activeModel.voxels['2,2,2']).toBe('#ff007f')

    voxelSculptor.removeVoxel(5, 5, 5)
    expect(voxelSculptor.activeModel.voxels['5,5,5']).toBeUndefined()

    voxelSculptor.clearCanvas()
    expect(Object.keys(voxelSculptor.activeModel.voxels).length).toBe(0)
  })

  it('should deploy and toggle hologram projectors and update rotation', () => {
    const proj = voxelSculptor.addProjector(10, 5, 10, voxelSculptor.models[0].id, '#39ff14')
    expect(proj).toBeDefined()
    expect(proj.isEmitting).toBe(true)

    voxelSculptor.update(0.5)
    expect(proj.currentRotation).toBeGreaterThan(0)

    voxelSculptor.toggleProjector(proj.id)
    expect(proj.isEmitting).toBe(false)
  })

  it('should manage 3D scrolling neon signs', () => {
    const sign = voxelSculptor.addSign('CYBER CITY', 0, 10, 0, '#ffe600')
    expect(sign.text).toBe('CYBER CITY')

    voxelSculptor.update(0.5)
    expect(sign.scrollOffset).toBeGreaterThan(0)
  })
})

describe('Gravity Anomalies & Parkour Engine', () => {
  beforeEach(() => {
    gravityAnomalies.reset()
  })

  it('should toggle directional gravity inversion', () => {
    expect(gravityAnomalies.isInverted).toBe(false)

    const inverted = gravityAnomalies.toggleGravityInversion()
    expect(inverted).toBe(true)
    expect(gravityAnomalies.isInverted).toBe(true)

    gravityAnomalies.toggleGravityInversion()
    expect(gravityAnomalies.isInverted).toBe(false)
  })

  it('should trigger sonic launch pad impulses on stepping', () => {
    const playerPos = new THREE.Vector3(5.2, 4.2, 5.2)
    const playerVel = new THREE.Vector3(0, 0, 0)

    const launched = gravityAnomalies.checkLaunchPadTrigger(playerPos, playerVel)
    expect(launched).toBe(true)
    expect(playerVel.y).toBeGreaterThan(15)
  })

  it('should apply glider aerodynamics to velocity', () => {
    gravityAnomalies.setGliding(true)
    const vel = new THREE.Vector3(10, -20, 10)

    gravityAnomalies.applyGliderPhysics(vel, 0.1)
    // Downward speed should be capped at -2.5
    expect(vel.y).toBe(-2.5)
  })

  it('should track parkour time-attack courses from start to checkpoint finish', () => {
    const course = gravityAnomalies.courses[0]
    gravityAnomalies.startCourse(course.id)
    expect(gravityAnomalies.isRunActive).toBe(true)
    expect(gravityAnomalies.currentCheckpointIdx).toBe(0)

    // Move to checkpoint 1
    const cp1 = course.checkpoints[0]
    gravityAnomalies.update(0.1, new THREE.Vector3(cp1.x, cp1.y, cp1.z))
    expect(gravityAnomalies.currentCheckpointIdx).toBe(1)

    // Complete all checkpoints
    for (let i = 1; i < course.checkpoints.length; i++) {
      const cp = course.checkpoints[i]
      gravityAnomalies.update(0.1, new THREE.Vector3(cp.x, cp.y, cp.z))
    }

    expect(gravityAnomalies.isRunActive).toBe(false)
    expect(course.bestTimeMs).toBeGreaterThanOrEqual(0)
  })
})
