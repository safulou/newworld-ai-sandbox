import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { WeatherEngine, WEATHER_ROSTER, WeatherType } from '../weather'
import { VehicleManager, VEHICLE_CONFIGS } from '../vehicles'
import { NPCManager } from '../npc'

describe('Dynamic Weather Simulation & Ambient System', () => {
  let weatherEngine: WeatherEngine

  beforeEach(() => {
    weatherEngine = new WeatherEngine()
  })

  it('should initialize with clear weather by default', () => {
    expect(weatherEngine.getWeather()).toBe('clear')
    expect(WEATHER_ROSTER.clear.name).toBe('晴朗星空')
  })

  it('should cycle through all 5 dynamic weather states in correct order', () => {
    const sequence: WeatherType[] = ['neon_rain', 'thunderstorm', 'snow', 'sandstorm', 'clear']
    for (const expected of sequence) {
      const next = weatherEngine.cycleWeather()
      expect(next).toBe(expected)
      expect(weatherEngine.getWeather()).toBe(expected)
      expect(WEATHER_ROSTER[next]).toBeDefined()
    }
  })

  it('should explicitly set weather type and return valid metadata', () => {
    weatherEngine.setWeather('thunderstorm')
    expect(weatherEngine.getWeather()).toBe('thunderstorm')
    expect(WEATHER_ROSTER.thunderstorm.icon).toBe('⚡')
    expect(WEATHER_ROSTER.thunderstorm.color).toBe(0xff00ff)

    weatherEngine.setWeather('sandstorm')
    expect(weatherEngine.getWeather()).toBe('sandstorm')
    expect(WEATHER_ROSTER.sandstorm.icon).toBe('🌪️')
  })
})

describe('Cyber Voxel Vehicles & Speeder Workshop', () => {
  let vehicleMgr: VehicleManager

  beforeEach(() => {
    vehicleMgr = new VehicleManager()
  })

  it('should start with pedestrian mode and 1.0x speed multiplier', () => {
    expect(vehicleMgr.getVehicle()).toBe('none')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(1.0)
    expect(VEHICLE_CONFIGS.none.name).toBe('步巡模式')
  })

  it('should cycle through hoverboard, speeder, and cruiser with increasing speed multipliers', () => {
    // 1. None -> Hoverboard
    const v1 = vehicleMgr.cycleVehicle(new THREE.Vector3(0, 5, 0))
    expect(v1).toBe('hoverboard')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(1.6)

    // 2. Hoverboard -> Speeder
    const v2 = vehicleMgr.cycleVehicle(new THREE.Vector3(0, 5, 0))
    expect(v2).toBe('speeder')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(2.4)

    // 3. Speeder -> Cruiser
    const v3 = vehicleMgr.cycleVehicle(new THREE.Vector3(0, 5, 0))
    expect(v3).toBe('cruiser')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(3.2)

    // 4. Cruiser -> None
    const v4 = vehicleMgr.cycleVehicle(new THREE.Vector3(0, 5, 0))
    expect(v4).toBe('none')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(1.0)
  })

  it('should allow directly setting vehicle type', () => {
    vehicleMgr.setVehicle('speeder')
    expect(vehicleMgr.getVehicle()).toBe('speeder')
    expect(vehicleMgr.getSpeedMultiplier()).toBe(2.4)
  })
})

describe('Autonomous AI Worker Tasks', () => {
  it('should execute paving, flattening, and mining commands with valid response logs', async () => {
    const npcMgr = new NPCManager()
    const mockWorld: any = {
      setBlock: () => {},
      removeBlock: () => {},
      getBlock: () => null,
      isSolidAt: () => false,
    }
    const mockScene = new THREE.Scene()
    npcMgr.init(mockScene, mockWorld, new THREE.Vector3(0, 0, 0))

    const companion = npcMgr.getNPCById('npc_architect')
    expect(companion).toBeDefined()

    const paveResult = await companion!.executeWorkerTask('pave', new THREE.Vector3(10, 0, 10), new THREE.Vector3(0, 0, 1))
    expect(paveResult).toContain('鋪設')

    const flattenResult = await companion!.executeWorkerTask('flatten', new THREE.Vector3(5, 0, 5), new THREE.Vector3(1, 0, 0))
    expect(flattenResult).toContain('整地')

    const mineResult = await companion!.executeWorkerTask('mine', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1))
    expect(mineResult).toContain('採礦')
  })
})
