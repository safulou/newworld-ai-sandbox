import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { celestialObservatory } from '../celestialObservatory'
import { fluidThermodynamics } from '../fluidThermodynamics'
import { ghostReplay } from '../ghostReplay'
import { cyberRangers } from '../cyberRangers'

describe('Celestial Observatory Engine (Keplerian Orbits & Meteor Stardust)', () => {
  beforeEach(() => {
    celestialObservatory.reset()
  })

  it('should initialize with 3 celestial bodies and valid orbital parameters', () => {
    expect(celestialObservatory.celestialBodies.length).toBe(3)
    const cyanMoon = celestialObservatory.celestialBodies.find(b => b.id === 'cyan_moon')
    expect(cyanMoon).toBeDefined()
    expect(cyanMoon?.orbitalPeriodSec).toBe(120)
  })

  it('should advance celestial orbits over time', () => {
    const moon = celestialObservatory.celestialBodies[0]
    const initialAngle = moon.currentAngle

    celestialObservatory.update(1.0)
    expect(moon.currentAngle).toBeGreaterThan(initialAngle)
  })

  it('should trigger meteor shower and harvest stardust nodes', () => {
    celestialObservatory.triggerMeteorShower(4)
    expect(celestialObservatory.activeMeteorShower).toBe(true)
    expect(celestialObservatory.stardustDeposits.length).toBe(4)

    const deposit = celestialObservatory.stardustDeposits[0]
    const harvested = celestialObservatory.harvestStardust(deposit.id)
    expect(harvested).toBeGreaterThan(0)
    expect(deposit.harvested).toBe(true)
    expect(celestialObservatory.cosmicStardustInventory).toBe(harvested)
  })

  it('should scan and log new exoplanets into discoveries catalog', () => {
    const discovery = celestialObservatory.scanExoplanet()
    expect(discovery).toBeDefined()
    expect(celestialObservatory.discoveries.length).toBe(1)
    expect(discovery?.distanceLy).toBeGreaterThan(0)
  })
})

describe('Fluid Thermodynamics & Fusion Reactor Core Engine', () => {
  beforeEach(() => {
    fluidThermodynamics.reset()
  })

  it('should initialize in safe SCRAM state with default cells', () => {
    expect(fluidThermodynamics.reactor.isIgnited).toBe(false)
    expect(fluidThermodynamics.reactor.isScrammed).toBe(true)
    expect(fluidThermodynamics.reactor.controlRodsPercent).toBe(100)
    expect(fluidThermodynamics.thermalCells.size).toBeGreaterThanOrEqual(3)
  })

  it('should ignite reactor and produce megawatt power and steam pressure', () => {
    fluidThermodynamics.igniteReactor()
    expect(fluidThermodynamics.reactor.isIgnited).toBe(true)
    expect(fluidThermodynamics.reactor.controlRodsPercent).toBe(25)

    // Advance thermal update
    for (let i = 0; i < 10; i++) {
      fluidThermodynamics.update(0.5)
    }

    expect(fluidThermodynamics.reactor.coreTempC).toBeGreaterThan(25)
    expect(fluidThermodynamics.reactor.powerOutputMw).toBeGreaterThan(0)
    expect(fluidThermodynamics.turbineRpm).toBeGreaterThan(0)
  })

  it('should trigger emergency SCRAM and shut down fuel reactions', () => {
    fluidThermodynamics.igniteReactor()
    fluidThermodynamics.update(1.0)

    fluidThermodynamics.scramReactor()
    expect(fluidThermodynamics.reactor.controlRodsPercent).toBe(100)
    expect(fluidThermodynamics.reactor.isScrammed).toBe(true)
    expect(fluidThermodynamics.reactor.isMeltdownWarning).toBe(false)
  })

  it('should transition water to steam above boiling point', () => {
    fluidThermodynamics.setCell(5, 5, 5, 110, 'water')
    fluidThermodynamics.update(0.1)

    const cell = fluidThermodynamics.getCell(5, 5, 5)
    expect(cell?.fluidType).toBe('steam')
  })
})

describe('Ghost Replay & Asynchronous Esports Leaderboard Engine', () => {
  beforeEach(() => {
    ghostReplay.reset()
  })

  it('should initialize with preset leaderboards', () => {
    expect(ghostReplay.leaderboards.length).toBeGreaterThanOrEqual(4)
    expect(ghostReplay.leaderboards[0].category).toBe('skyline_sprint')
  })

  it('should record player telemetry frames and generate ghost recording', () => {
    ghostReplay.startRecording('skyline_sprint', 'PlayerTest')
    expect(ghostReplay.isRecording).toBe(true)

    // Sample telemetry at step
    ghostReplay.sampleFrame(new THREE.Vector3(10, 5, 10), 0.5, false)
    ghostReplay.sampleFrame(new THREE.Vector3(20, 8, 15), 0.7, true)

    const finished = ghostReplay.stopRecording()
    expect(finished).toBeDefined()
    expect(ghostReplay.isRecording).toBe(false)
    expect(ghostReplay.activeGhost).toBe(finished)
  })

  it('should play back ghost telemetry and export challenge code', () => {
    ghostReplay.startRecording('skyline_sprint', 'PlayerGhost')
    ghostReplay.sampleFrame(new THREE.Vector3(0, 0, 0), 0, false)
    ghostReplay.sampleFrame(new THREE.Vector3(10, 0, 0), 0, false)
    const ghost = ghostReplay.stopRecording()

    expect(ghost).toBeDefined()
    const code = ghostReplay.exportChallengeCode(ghost!)
    expect(code.startsWith('NW_GHOST_')).toBe(true)

    ghostReplay.startGhostPlayback()
    expect(ghostReplay.isPlayingGhost).toBe(true)

    ghostReplay.update(0.05)
    ghostReplay.stopGhostPlayback()
    expect(ghostReplay.isPlayingGhost).toBe(false)
  })
})

describe('Cyber Rangers & Autonomous Ecosystem Engine', () => {
  beforeEach(() => {
    cyberRangers.reset()
  })

  it('should initialize with eco-wardens and active eco-buff', () => {
    expect(cyberRangers.wardens.length).toBeGreaterThanOrEqual(2)
    expect(cyberRangers.ecosystemHealthIndex).toBeGreaterThanOrEqual(80)
    expect(cyberRangers.isEcoBuffActive).toBe(true)
  })

  it('should update autonomous wardens patrolling positions', () => {
    const warden = cyberRangers.wardens[0]
    const initialX = warden.position.x

    cyberRangers.update(1.0)
    expect(warden.position.x).not.toBe(initialX)
  })

  it('should complete genetic breeding cycle and hatch mutated puppy', () => {
    cyberRangers.startBreeding('獵犬A', '獵犬B', 'quantum_plasma')
    expect(cyberRangers.breedingChamber.isActive).toBe(true)

    // Fast forward breeding duration (8 seconds)
    cyberRangers.update(8.5)

    expect(cyberRangers.breedingChamber.progress).toBe(1.0)
    expect(cyberRangers.breedingChamber.result).toBeDefined()
    expect(cyberRangers.mutatedHounds.length).toBe(1)
    expect(cyberRangers.mutatedHounds[0].geneTrait).toBeDefined()
  })
})
