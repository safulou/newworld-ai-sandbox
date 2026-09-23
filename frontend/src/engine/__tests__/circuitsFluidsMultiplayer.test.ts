import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { CircuitEngine } from '../circuits'
import { FluidEngine } from '../fluids'
import { MultiplayerSyncEngine } from '../multiplayerSync'
import { NPCSocietyEngine, SOCIAL_DIALOGUES } from '../npcSociety'

describe('Quantum Wire & Cyber Logic Circuit Engine', () => {
  let circuitEngine: CircuitEngine

  beforeEach(() => {
    circuitEngine = new CircuitEngine()
  })

  it('should toggle mechanical switches and record active state', () => {
    const mockWorld = {
      getPlayerBlocks: () => new Map(),
      getBlock: () => null,
      setBlock: () => {}
    }

    expect(circuitEngine.isSwitchActive(10, 5, 10)).toBe(false)
    const onState = circuitEngine.toggleLever(10, 5, 10, mockWorld)
    expect(onState).toBe(true)
    expect(circuitEngine.isSwitchActive(10, 5, 10)).toBe(true)

    const offState = circuitEngine.toggleLever(10, 5, 10, mockWorld)
    expect(offState).toBe(false)
    expect(circuitEngine.isSwitchActive(10, 5, 10)).toBe(false)
  })

  it('should propagate power signal from power source along adjacent wire line', () => {
    const blockMap = new Map<string, { type: any; mesh: any }>()
    blockMap.set('0,0,0', { type: 'power_source', mesh: {} })
    blockMap.set('1,0,0', { type: 'wire_off', mesh: {} })
    blockMap.set('2,0,0', { type: 'wire_off', mesh: {} })

    const updatedBlocks: Record<string, string> = {}
    const mockWorld = {
      getPlayerBlocks: () => blockMap,
      getBlock: (x: number, y: number, z: number) => {
        const k = `${x},${y},${z}`
        return updatedBlocks[k] || blockMap.get(k)?.type || null
      },
      setBlock: (x: number, y: number, z: number, type: string) => {
        updatedBlocks[`${x},${y},${z}`] = type
      }
    }

    circuitEngine.simulateCircuits(mockWorld)
    expect(updatedBlocks['1,0,0']).toBe('wire_on')
    expect(updatedBlocks['2,0,0']).toBe('wire_on')
  })
})

describe('Cellular Automata Fluid Simulation (Water & Plasma Lava)', () => {
  let fluidEngine: FluidEngine

  beforeEach(() => {
    fluidEngine = new FluidEngine()
  })

  it('should spread fluid downwards into air blocks', () => {
    const worldBlocks: Record<string, string> = {
      '5,10,5': 'water',
      '5,9,5': 'air',
    }
    const mockWorld = {
      getBlock: (x: number, y: number, z: number) => worldBlocks[`${x},${y},${z}`] || 'air',
      setBlock: (x: number, y: number, z: number, type: string) => {
        worldBlocks[`${x},${y},${z}`] = type
      }
    }

    fluidEngine.addSource(5, 10, 5, 'water')
    fluidEngine.update(0.5, mockWorld)

    expect(worldBlocks['5,9,5']).toBe('water')
  })

  it('should turn water into obsidian when meeting magma', () => {
    const worldBlocks: Record<string, string> = {
      '0,5,0': 'water',
      '0,4,0': 'magma',
    }
    const mockWorld = {
      getBlock: (x: number, y: number, z: number) => worldBlocks[`${x},${y},${z}`] || 'air',
      setBlock: (x: number, y: number, z: number, type: string) => {
        worldBlocks[`${x},${y},${z}`] = type
      }
    }

    fluidEngine.addSource(0, 5, 0, 'water')
    fluidEngine.update(0.5, mockWorld)

    expect(worldBlocks['0,4,0']).toBe('obsidian')
  })

  it('should correctly detect player fluid immersion for swimming buoyancy', () => {
    const mockWorld = {
      getBlock: (x: number, y: number, z: number) => (x === 0 && y === 1 && z === 0 ? 'water' : 'air')
    }

    const res = fluidEngine.checkFluidImmersion(new THREE.Vector3(0.5, 0.8, 0.5), mockWorld)
    expect(res.inFluid).toBe(true)
    expect(res.type).toBe('water')
  })
})

describe('Real-time Co-op Multiplayer Engine', () => {
  it('should initialize with 1 player by default (local player)', () => {
    const mpSync = new MultiplayerSyncEngine()
    expect(mpSync.getOnlineCount()).toBe(1)
  })
})

describe('Autonomous Multi-Agent Society & Affinity System', () => {
  let npcSociety: NPCSocietyEngine

  beforeEach(() => {
    npcSociety = new NPCSocietyEngine()
  })

  it('should track and clamp affinity points between 0 and 100', () => {
    const initial = npcSociety.getAffinity('npc_architect')
    expect(initial).toBeGreaterThanOrEqual(0)

    const updated = npcSociety.addAffinity('npc_architect', 25)
    expect(updated).toBe(initial + 25)

    const clampedMax = npcSociety.addAffinity('npc_architect', 200)
    expect(clampedMax).toBe(100)

    const rank = npcSociety.getAffinityRank('npc_architect')
    expect(rank.title).toBe('元宇宙靈魂知己')
    expect(rank.color).toBe('#ff00ff')
  })

  it('should contain predefined multi-turn social dialogue pairs for NPC roster', () => {
    expect(SOCIAL_DIALOGUES.length).toBeGreaterThanOrEqual(3)
    for (const d of SOCIAL_DIALOGUES) {
      expect(d.speaker1Id).toBeDefined()
      expect(d.speaker2Id).toBeDefined()
      expect(d.line1.length).toBeGreaterThan(5)
      expect(d.line2.length).toBeGreaterThan(5)
    }
  })
})
