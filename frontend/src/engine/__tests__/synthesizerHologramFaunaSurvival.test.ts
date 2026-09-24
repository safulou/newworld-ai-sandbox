import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as THREE from 'three'
import { NoteBlockEngine } from '../noteBlocks'
import { BlueprintHologramEngine, BUILTIN_BLUEPRINTS } from '../blueprintHologram'
import { CyberHound, CyberJellyfish, QuantumButterflySwarm } from '../cyberFauna'
import { SurvivalCombatEngine, BossGuardian } from '../survivalCombat'
import { BlockType } from '@/types/world'

describe('Comprehensive Testing: Synthesizer, Hologram, Fauna & Survival Combat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // -----------------------------------------------------------------
  // 1. Cyber Note Blocks & Synthesizer
  // -----------------------------------------------------------------
  describe('Cyber Note Block & Synthesizer System', () => {
    it('should correctly tune pitch from 0 to 24 semitones and wrap around', () => {
      const noteEngine = new NoteBlockEngine()
      expect(noteEngine.getPitch(10, 5, 10)).toBe(0)

      noteEngine.setPitch(10, 5, 10, 5)
      expect(noteEngine.getPitch(10, 5, 10)).toBe(5)

      // Tune wraps at 25 (0-24)
      noteEngine.setPitch(10, 5, 10, 24)
      const tuned = noteEngine.tune(10, 5, 10)
      expect(tuned).toBe(0)
    })

    it('should select distinct instruments based on the foundation block', () => {
      const noteEngine = new NoteBlockEngine()
      const mockWorld = {
        getBlock: (x: number, _y: number, _z: number): BlockType => {
          if (x === 0) return 'wood'
          if (x === 1) return 'cyber_plating'
          if (x === 2) return 'stone'
          return 'obsidian'
        }
      }

      expect(noteEngine.getInstrument(0, 5, 0, mockWorld)).toBe('bass')
      expect(noteEngine.getInstrument(1, 5, 0, mockWorld)).toBe('chip')
      expect(noteEngine.getInstrument(2, 5, 0, mockWorld)).toBe('drum')
      expect(noteEngine.getInstrument(3, 5, 0, mockWorld)).toBe('bell')
    })
  })

  // -----------------------------------------------------------------
  // 2. AI Blueprint Hologram & Instant Architect
  // -----------------------------------------------------------------
  describe('AI Blueprint Hologram & Instant Architect', () => {
    it('should provide built-in scifi blueprints with valid block definitions', () => {
      expect(BUILTIN_BLUEPRINTS.length).toBeGreaterThanOrEqual(4)
      const watchtower = BUILTIN_BLUEPRINTS.find(b => b.id === 'cyber_watchtower')
      expect(watchtower).toBeDefined()
      expect(watchtower?.blocks.length).toBeGreaterThan(15)

      const torii = BUILTIN_BLUEPRINTS.find(b => b.id === 'torii_gate')
      expect(torii).toBeDefined()
      expect(torii?.blocks.some(b => b.type === 'neon_magenta')).toBe(true)
    })

    it('should calculate transformed coordinates with 90-degree rotations', () => {
      const holoEngine = new BlueprintHologramEngine()
      holoEngine.showBlueprint('torii_gate', new THREE.Vector3(10, 5, 20))
      expect(holoEngine.getIsPreviewActive()).toBe(true)

      const initialBlocks = holoEngine.getTransformedBlocks()
      expect(initialBlocks.length).toBeGreaterThan(0)
      expect(initialBlocks[0].x).toBeGreaterThanOrEqual(10)

      // Rotate 90 deg
      const rot = holoEngine.rotate()
      expect(rot).toBe(90)
      const rotatedBlocks = holoEngine.getTransformedBlocks()
      expect(rotatedBlocks.length).toBe(initialBlocks.length)
    })
  })

  // -----------------------------------------------------------------
  // 3. Cyber Fauna & Pets Ecosystem
  // -----------------------------------------------------------------
  describe('Cyber Fauna & Companion Pets', () => {
    it('should initialize cyber hound and handle wild to tamed transition', () => {
      const hound = new CyberHound(new THREE.Vector3(0, 0, 0), 'wild')
      expect(hound.state).toBe('wild')

      hound.setTamed()
      expect(hound.state).toBe('tamed')

      hound.toggleSit()
      expect(hound.state).toBe('sitting')

      hound.toggleSit()
      expect(hound.state).toBe('tamed')
    })

    it('should initialize jellyfish and butterfly flocking swarms cleanly', () => {
      const jf = new CyberJellyfish(new THREE.Vector3(0, 2, 0))
      expect(jf.group).toBeDefined()
      jf.update(0.016)

      const swarm = new QuantumButterflySwarm(new THREE.Vector3(0, 2, 0), 10)
      expect(swarm.group.children.length).toBe(10)
      swarm.update(0.016)
    })
  })

  // -----------------------------------------------------------------
  // 4. Survival Adventure & Combat System
  // -----------------------------------------------------------------
  describe('Survival Adventure & Combat System', () => {
    it('should toggle game mode and toggle beam saber', () => {
      const combat = new SurvivalCombatEngine()
      expect(combat.stats.mode).toBe('creative')

      const mode = combat.toggleGameMode()
      expect(mode).toBe('survival')
      expect(combat.stats.mode).toBe('survival')

      expect(combat.stats.saberActive).toBe(false)
      const saberOn = combat.toggleSaber()
      expect(saberOn).toBe(true)
      expect(combat.stats.saberActive).toBe(true)
    })

    it('should absorb damage with shield first, then health', () => {
      const combat = new SurvivalCombatEngine()
      combat.stats.mode = 'survival'
      combat.stats.health = 100
      combat.stats.shield = 50

      combat.takeDamage(30)
      expect(combat.stats.shield).toBe(20)
      expect(combat.stats.health).toBe(100)

      combat.takeDamage(35)
      // 20 absorbed by shield, 15 to health
      expect(combat.stats.shield).toBe(0)
      expect(combat.stats.health).toBe(85)
    })

    it('should handle Boss Guardian damage and defeat', () => {
      const boss = new BossGuardian(new THREE.Vector3(0, 10, 0))
      expect(boss.health).toBe(250)
      expect(boss.isDefeated).toBe(false)

      const defeated1 = boss.takeDamage(100)
      expect(defeated1).toBe(false)
      expect(boss.health).toBe(150)

      const defeated2 = boss.takeDamage(200)
      expect(defeated2).toBe(true)
      expect(boss.health).toBe(0)
      expect(boss.isDefeated).toBe(true)
    })
  })
})
