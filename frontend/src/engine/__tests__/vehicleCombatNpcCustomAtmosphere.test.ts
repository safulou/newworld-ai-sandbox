import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { vehicleCombat } from '../vehicleCombat'
import { vehicles } from '../vehicles'
import { npcCustomizer } from '../npcCustomizer'
import { atmosphericAudio } from '../atmosphericAudio'
import { atmosphericParticles } from '../atmosphericParticles'

describe('VehicleCombatEngine & Plasma Dogfight', () => {
  beforeEach(() => {
    vehicles.setVehicle('speeder')
    vehicleCombat.repair(150)
    vehicleCombat.projectiles = []
  })

  it('should prevent firing when on foot (vehicle is none)', () => {
    vehicles.setVehicle('none')
    expect(vehicleCombat.canFire()).toBe(false)
    const proj = vehicleCombat.fire(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1))
    expect(proj).toBeNull()
  })

  it('should fire plasma projectiles from speeder dual cannons and deduct energy', () => {
    expect(vehicleCombat.canFire()).toBe(true)
    const initialEnergy = vehicleCombat.stats.energy

    const origin = new THREE.Vector3(10, 5, 20)
    const dir = new THREE.Vector3(0, 0, 1)
    const proj = vehicleCombat.fire(origin, dir, 'speeder')

    expect(proj).not.toBeNull()
    expect(proj?.ownerId).toBe('local_player')
    expect(proj?.damage).toBe(25)
    expect(vehicleCombat.stats.energy).toBeLessThan(initialEnergy)
    expect(vehicleCombat.stats.shotsFired).toBe(1)
    expect(vehicleCombat.projectiles.length).toBe(1)
  })

  it('should absorb damage with shields before hull', () => {
    vehicleCombat.stats.shield = 100
    vehicleCombat.stats.hull = 150

    // Take 60 damage -> absorbed completely by shield
    const res1 = vehicleCombat.takeVehicleDamage(60)
    expect(res1.shield).toBe(40)
    expect(res1.hull).toBe(150)
    expect(res1.destroyed).toBe(false)

    // Take 80 damage -> 40 shield absorbed, 40 hull damage
    const res2 = vehicleCombat.takeVehicleDamage(80)
    expect(res2.shield).toBe(0)
    expect(res2.hull).toBe(110)
    expect(res2.destroyed).toBe(false)
  })

  it('should update projectile position and expire after maxLife', () => {
    const origin = new THREE.Vector3(0, 0, 0)
    const dir = new THREE.Vector3(1, 0, 0)
    const proj = vehicleCombat.fire(origin, dir, 'cruiser')
    expect(proj).not.toBeNull()

    // Step 0.1s
    vehicleCombat.update(0.1)
    expect(proj!.pos.x).toBeGreaterThan(5)

    // Step 2.5s (exceeds maxLife of 1.8s)
    vehicleCombat.update(2.5)
    expect(vehicleCombat.projectiles.length).toBe(0)
  })

  it('should restore stats on repair', () => {
    vehicleCombat.takeVehicleDamage(50)
    vehicleCombat.repair(100)
    expect(vehicleCombat.stats.hull).toBe(150)
    expect(vehicleCombat.stats.shield).toBe(100)
    expect(vehicleCombat.stats.isOverheated).toBe(false)
  })
})

describe('NPCCustomizerEngine & Companion Studio', () => {
  beforeEach(() => {
    const def = npcCustomizer.getConfig('npc_guide')
    def.armorColor = '#00f0ff'
    def.wings = 'hologram_wings'
    def.headgear = 'halo_crown'
    def.aura = 'plasma_shield'
    def.personality = 'diligent'
    npcCustomizer.setConfig(def)
  })

  it('should retrieve default config for NPC companions', () => {
    const guideCfg = npcCustomizer.getConfig('npc_guide')
    expect(guideCfg.npcId).toBe('npc_guide')
    expect(guideCfg.wings).toBe('hologram_wings')
    expect(guideCfg.headgear).toBe('halo_crown')

    const minerCfg = npcCustomizer.getConfig('npc_miner')
    expect(minerCfg.npcId).toBe('npc_miner')
    expect(minerCfg.personality).toBe('stoic')
  })

  it('should update and save custom configuration', () => {
    const cfg = npcCustomizer.getConfig('npc_builder')
    cfg.wings = 'jetpack'
    cfg.personality = 'quirky'
    cfg.customGreeting = 'Echo 正在研發超空間加速器！'
    npcCustomizer.setConfig(cfg)

    const updated = npcCustomizer.getConfig('npc_builder')
    expect(updated.wings).toBe('jetpack')
    expect(updated.personality).toBe('quirky')
    expect(updated.customGreeting).toContain('超空間加速器')
  })

  it('should generate valid Three.js mesh groups for accessories', () => {
    const wings = npcCustomizer.createWingsMesh('hologram_wings', 0x00f0ff)
    expect(wings).toBeInstanceOf(THREE.Group)
    expect(wings.children.length).toBeGreaterThan(0)

    const jetpack = npcCustomizer.createWingsMesh('jetpack', 0xffaa00)
    expect(jetpack).toBeInstanceOf(THREE.Group)

    const headgear = npcCustomizer.createHeadgearMesh('combat_visor', 0xff0055)
    expect(headgear).toBeInstanceOf(THREE.Group)

    const aura = npcCustomizer.createAuraMesh('plasma_shield', 0x00ff88)
    expect(aura).toBeInstanceOf(THREE.Group)
  })

  it('should apply accessories to NPC group without crashing', () => {
    const group = new THREE.Group()
    npcCustomizer.applyToNPCGroup('npc_guide', group, false)
    expect(group.children.length).toBe(1)

    // Re-applying replaces previous accessory group
    npcCustomizer.applyToNPCGroup('npc_guide', group, false)
    expect(group.children.length).toBe(1)
  })
})

describe('AtmosphericAudioEngine & AtmosphericParticlesEngine', () => {
  it('should transition atmospheric audio across all 4 times of day without throwing', () => {
    expect(() => {
      atmosphericAudio.transitionToTimeOfDay('dawn')
      atmosphericAudio.transitionToTimeOfDay('day')
      atmosphericAudio.transitionToTimeOfDay('sunset')
      atmosphericAudio.transitionToTimeOfDay('night')
    }).not.toThrow()
  })

  it('should handle muting on atmospheric audio', () => {
    expect(() => {
      atmosphericAudio.setMuted(true)
      atmosphericAudio.setMuted(false)
    }).not.toThrow()
  })

  it('should initialize and update atmospheric volumetric particles', () => {
    const scene = new THREE.Scene()
    atmosphericParticles.init(scene)

    expect(() => {
      atmosphericParticles.setTimeOfDay('night')
      atmosphericParticles.setTimeOfDay('sunset')
      atmosphericParticles.setTimeOfDay('day')
    }).not.toThrow()

    // Step motion update
    const camPos = new THREE.Vector3(10, 5, 20)
    expect(() => {
      atmosphericParticles.update(0.1, camPos)
    }).not.toThrow()

    atmosphericParticles.dispose()
  })
})
