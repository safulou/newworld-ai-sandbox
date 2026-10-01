import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { orbitalDrydock, STARSHIP_PARTS_CATALOG } from '../orbitalDrydock'
import { abyssalTrench } from '../abyssalTrench'
import { behaviorTree, BTNode } from '../behaviorTree'
import { cyberdeckNetrunning } from '../cyberdeckNetrunning'

describe('Part 9 Frontier Systems: Orbital Drydock, Abyssal Trench, Behavior Tree & Cyberdeck', () => {

  beforeEach(() => {
    // Reset basic states where applicable
    orbitalDrydock.dockingBayStatus = 'docked'
    orbitalDrydock.airlockPressure = 100
    orbitalDrydock.isZeroGActive = false
    orbitalDrydock.zeroGVelocity.set(0, 0, 0)

    abyssalTrench.hullIntegrity = 100
    abyssalTrench.oxygenBattery = 100
    abyssalTrench.floodlightOn = true

    behaviorTree.loadPreset('combat_vanguard')

    cyberdeckNetrunning.terminalHistory = []
  })

  // ==========================================
  // 1. Orbital Drydock & Zero-G Physics
  // ==========================================
  describe('Orbital Space Station & Modular Starship Drydock', () => {
    it('should have parts catalog and compute aggregated starship stats correctly', () => {
      expect(STARSHIP_PARTS_CATALOG.length).toBeGreaterThanOrEqual(10)
      const stats = orbitalDrydock.getStarshipStats()
      expect(stats.hull).toBeGreaterThanOrEqual(500)
      expect(stats.speed).toBeGreaterThan(0)
      expect(stats.shield).toBeGreaterThan(0)
      expect(stats.warpFactor).toBeGreaterThan(0)
    })

    it('should allow installing parts and dynamically update stats', () => {
      orbitalDrydock.setPart('cockpit', 'cockpit_dread')
      expect(orbitalDrydock.starship.cockpit).toBe('cockpit_dread')
      const stats = orbitalDrydock.getStarshipStats()
      expect(stats.hull).toBeGreaterThanOrEqual(800) // 500 base + 300 dread bonus
    })

    it('should cycle airlock between station pressure and vacuum', () => {
      expect(orbitalDrydock.airlockPressure).toBe(100)
      orbitalDrydock.cycleAirlock()
      expect(orbitalDrydock.isAirlockCycling).toBe(true)
    })

    it('should apply RCS thruster impulse in Zero-G', () => {
      const initialVel = orbitalDrydock.zeroGVelocity.clone()
      orbitalDrydock.triggerRcsBurst(new THREE.Vector3(0, 0, -1))
      expect(orbitalDrydock.zeroGVelocity.z).toBeLessThan(initialVel.z)
    })

    it('should handle starship launch and docking states', () => {
      orbitalDrydock.launchStarship()
      expect(orbitalDrydock.dockingBayStatus).toBe('launching')
    })
  })

  // ==========================================
  // 2. Abyssal Trench & Submersible Physics
  // ==========================================
  describe('Abyssal Trench & Submersible Physics', () => {
    it('should calculate hydrostatic pressure gradient accurately', () => {
      // Y = 16 (Sea surface) -> 1.0 Bar
      expect(abyssalTrench.calculatePressure(16)).toBe(1.0)
      expect(abyssalTrench.calculatePressure(20)).toBe(1.0)

      // Y = -64 (Deep trench floor) -> 100.0 Bar
      expect(abyssalTrench.calculatePressure(-64)).toBe(100.0)

      // Mid-depth Y = -24 (halfway from 16 to -64 is 40m depth) -> 50.5 Bar
      const mid = abyssalTrench.calculatePressure(-24)
      expect(mid).toBeGreaterThan(45)
      expect(mid).toBeLessThan(55)
    })

    it('should toggle floodlight status', () => {
      const initial = abyssalTrench.floodlightOn
      const toggled = abyssalTrench.toggleFloodlight()
      expect(toggled).toBe(!initial)
      expect(abyssalTrench.floodlightOn).toBe(!initial)
    })

    it('should trigger active sonar ping and find vents and leviathan contacts', () => {
      const contacts = abyssalTrench.triggerSonarPing(new THREE.Vector3(0, -30, 0))
      expect(Array.isArray(contacts)).toBe(true)
      expect(contacts.length).toBeGreaterThan(0)
      expect(contacts.some(c => c.type === 'vent')).toBe(true)
      expect(contacts.some(c => c.type === 'leviathan')).toBe(true)
    })

    it('should harvest minerals from hydrothermal vents', () => {
      const vent = abyssalTrench.vents[0]
      const mineralId = abyssalTrench.harvestVent(vent.id)
      expect(mineralId).toBe(vent.mineralYield)
      expect(abyssalTrench.inventory[vent.mineralYield]).toBeGreaterThanOrEqual(1)
    })
  })

  // ==========================================
  // 3. Holographic AI Behavior Tree Engine
  // ==========================================
  describe('Holographic AI Behavior Tree Engine', () => {
    it('should tick sequence nodes correctly (succeeding only if all children pass)', () => {
      const seqNode: BTNode = {
        id: 'test_seq',
        name: 'Test Sequence',
        type: 'sequence',
        children: [
          { id: 'act_1', name: 'A1', type: 'action' },
          { id: 'act_2', name: 'A2', type: 'action' }
        ]
      }
      const trace: string[] = []
      const status = behaviorTree.tickNode(seqNode, trace)
      expect(status).toBe('SUCCESS')
      expect(trace).toContain('test_seq')
      expect(trace).toContain('act_1')
      expect(trace).toContain('act_2')
    })

    it('should tick selector nodes correctly (fallback on first success)', () => {
      const selNode: BTNode = {
        id: 'test_sel',
        name: 'Test Selector',
        type: 'selector',
        children: [
          { id: 'cond_fail', name: 'C1', type: 'condition', conditionType: 'health_low' },
          { id: 'act_fallback', name: 'A1', type: 'action' }
        ]
      }
      behaviorTree.context.targetHp = 100 // High HP, so health_low condition fails
      const trace: string[] = []
      const status = behaviorTree.tickNode(selNode, trace)
      expect(status).toBe('SUCCESS')
      expect(trace).toContain('cond_fail')
      expect(trace).toContain('act_fallback')
    })

    it('should load preset behavior trees and support brain injection', () => {
      const success = behaviorTree.loadPreset('eco_warden_medic')
      expect(success).toBe(true)
      expect(behaviorTree.activeTree.id).toBe('root_medic')

      behaviorTree.injectBrain('cyber_hound')
      expect(behaviorTree.targetEntity).toBe('cyber_hound')
    })
  })

  // ==========================================
  // 4. Cyberdeck Terminal & Netrunning Protocol
  // ==========================================
  describe('Cyberdeck Terminal & Netrunning Protocol', () => {
    it('should execute terminal commands (help, scan, status)', () => {
      const resHelp = cyberdeckNetrunning.executeCommand('help')
      expect(resHelp.some(line => line.includes('可用命令清單'))).toBe(true)

      const resScan = cyberdeckNetrunning.executeCommand('scan')
      expect(resScan.some(line => line.includes('node_relay_01'))).toBe(true)

      const resStatus = cyberdeckNetrunning.executeCommand('status')
      expect(resStatus.some(line => line.includes('Militech'))).toBe(true)
    })

    it('should initialize Matrix Buffer Breach session on jackin', () => {
      const session = cyberdeckNetrunning.startBreach('node_relay_01')
      expect(session).toBeDefined()
      expect(session.grid.length).toBe(5)
      expect(session.grid[0].length).toBe(5)
      expect(session.targetSequence.length).toBe(3)
      expect(session.buffer.length).toBe(0)
      expect(session.activeMode).toBe('row')
      expect(session.activeIdx).toBe(0)
    })

    it('should enforce alternating row/column selection logic in matrix', () => {
      const session = cyberdeckNetrunning.startBreach('node_relay_01')
      // Turn 1: Active mode is 'row', activeIdx is 0
      // Selecting row 0, col 2 should succeed
      const selected = cyberdeckNetrunning.selectCell(0, 2)
      expect(selected).toBe(true)
      expect(session.buffer.length).toBe(1)
      // Now mode should flip to 'col', activeIdx should be 2
      expect(session.activeMode).toBe('col')
      expect(session.activeIdx).toBe(2)

      // Trying to select in col 3 should be rejected
      const invalidSelect = cyberdeckNetrunning.selectCell(1, 3)
      expect(invalidSelect).toBe(false)
    })

    it('should overload node via EMP command', () => {
      cyberdeckNetrunning.executeCommand('overload node_turret_02')
      const turret = cyberdeckNetrunning.nodes.find(n => n.id === 'node_turret_02')
      expect(turret?.isBreached).toBe(true)
    })
  })
})
