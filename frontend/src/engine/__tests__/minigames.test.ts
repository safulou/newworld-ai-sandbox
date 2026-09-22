import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { MinigamesEngine } from '../minigames'

describe('Minigames Engine Suite (Laser Arena & Voxel Snake)', () => {
  let engine: MinigamesEngine
  let scene: THREE.Scene

  beforeEach(() => {
    engine = new MinigamesEngine()
    scene = new THREE.Scene()
    engine.init(scene)
  })

  it('should initialize with default state', () => {
    expect(engine.state.type).toBe('none')
    expect(engine.state.isActive).toBe(false)
    expect(engine.state.score).toBe(0)
    expect(engine.state.combo).toBe(1)
  })

  it('should generate parkour course actions and activate parkour mode', () => {
    const actions = engine.generateParkourCourse({ x: 0, y: 10, z: 0 })
    expect(actions.length).toBeGreaterThan(20)
    expect(engine.state.type).toBe('parkour')
    expect(engine.state.isActive).toBe(true)
  })

  it('should generate laser arena with boundary, towers, and combat drones', () => {
    const origin = { x: 50, y: 5, z: 50 }
    const actions = engine.generateLaserArena(origin)

    expect(actions.length).toBeGreaterThan(50)
    expect(engine.state.type).toBe('laser_arena')
    expect(engine.state.isActive).toBe(true)
    expect(engine.state.timer).toBe(60)
    expect(engine.drones.length).toBe(5)
  })

  it('should register laser hits on active combat drones and calculate combo score', () => {
    engine.generateLaserArena({ x: 0, y: 0, z: 0 })
    const drone = engine.drones[0]
    expect(drone.alive).toBe(true)

    // Fire laser at drone coordinates
    const hit = engine.checkLaserHit(drone.position)
    expect(hit).toBe(true)
    expect(drone.alive).toBe(false)
    expect(engine.state.targetsHit).toBe(1)
    expect(engine.state.score).toBe(100)
    expect(engine.state.combo).toBe(2)

    // Miss laser
    const miss = engine.checkLaserHit(new THREE.Vector3(999, 999, 999))
    expect(miss).toBe(false)
  })

  it('should generate voxel snake arena and track food consumption', () => {
    const origin = { x: -30, y: 0, z: -30 }
    const actions = engine.generateSnakeArena(origin)

    expect(actions.length).toBeGreaterThan(50)
    expect(engine.state.type).toBe('voxel_snake')
    expect(engine.state.isActive).toBe(true)
    expect(engine.state.snakeLength).toBe(3)
    expect(engine.state.applesEaten).toBe(0)

    // Move player close to food
    const nearFood = engine.foodPos.clone()
    engine.update(0.1, nearFood)

    expect(engine.state.applesEaten).toBe(1)
    expect(engine.state.snakeLength).toBe(5)
    expect(engine.state.score).toBeGreaterThan(0)
  })

  it('should detect wall collision when player leaves snake arena boundary', () => {
    const origin = { x: 0, y: 0, z: 0 }
    engine.generateSnakeArena(origin)

    // Move player far outside arena boundary (size = 12, so > 12.5)
    const outsidePos = new THREE.Vector3(20, 1, 0)
    engine.update(0.1, outsidePos)

    expect(engine.state.isGameOver).toBe(true)
    expect(engine.state.isActive).toBe(false)
    expect(engine.state.statusMessage).toContain('撞擊防護力場邊界')
  })
})
