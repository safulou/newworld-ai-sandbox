import { describe, it, expect, beforeEach, vi } from 'vitest'
import { wormholeSlingshot, SLINGSHOT_CORRIDORS } from '../wormholeSlingshot'
import { worldTitanInvasion } from '../worldTitanInvasion'
import { neuralConsciousness, NEURAL_VESSELS } from '../neuralConsciousness'
import { quantumBroadcast } from '../quantumBroadcast'
import { achievements } from '../achievements'

describe('Part 13: Wormhole Slingshot, World Titan, Neural Consciousness, Quantum Broadcast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  // ── Engine 1: Wormhole Slingshot ───────────────────────────────────────────
  describe('Wormhole Gravity Slingshot Engine', () => {
    it('initializes with corridors and default orbital stats', () => {
      expect(Object.keys(wormholeSlingshot.corridors).length).toBe(Object.keys(SLINGSHOT_CORRIDORS).length)
      expect(wormholeSlingshot.stats.state).toBe('standby')
      expect(wormholeSlingshot.stats.currentVelocityC).toBe(1.0)
      expect(wormholeSlingshot.stats.vectorAngleDeg).toBe(0)
      expect(wormholeSlingshot.stats.dysonResonanceActive).toBe(true)
    })

    it('selects valid corridor and updates activeCorridor', () => {
      const ok = wormholeSlingshot.selectCorridor('galactic_core_chute')
      expect(ok).toBe(true)
      expect(wormholeSlingshot.stats.activeCorridor).toBe('galactic_core_chute')
    })

    it('adjusts vector angle and periapsis radius within bounds', () => {
      wormholeSlingshot.setVectorAngle(28)
      expect(wormholeSlingshot.stats.vectorAngleDeg).toBe(28)

      wormholeSlingshot.setPeriapsisRadius(50000)
      expect(wormholeSlingshot.stats.periapsisRadiusKm).toBe(50000)
    })

    it('initiates slingshot sequence and executes full orbital pass', () => {
      const started = wormholeSlingshot.initiateSlingshot()
      expect(started).toBe(true)
      expect(wormholeSlingshot.stats.state).toBe('approach')

      // Tick update during approach
      wormholeSlingshot.update(1.0)
      expect(wormholeSlingshot.stats.currentVelocityC).toBeGreaterThan(1.0)

      // Tick until slingshot periapsis and completion
      for (let i = 0; i < 40; i++) {
        wormholeSlingshot.update(0.5)
      }

      expect(wormholeSlingshot.stats.lorentzFactor).toBeGreaterThanOrEqual(1.0)
      expect(wormholeSlingshot.stats.totalSlingshotsCompleted).toBeGreaterThanOrEqual(1)
      expect(achievements.isUnlocked('slingshot_navigator')).toBe(true)
    })

    it('aborts slingshot and returns to standby', () => {
      wormholeSlingshot.stats.state = 'approach'
      wormholeSlingshot.abortSlingshot()
      expect(wormholeSlingshot.stats.state).toBe('standby')
    })
  })

  // ── Engine 2: World Titan Invasion ─────────────────────────────────────────
  describe('World Titan Colossus Invasion Engine', () => {
    beforeEach(() => {
      worldTitanInvasion.resetToDormant()
    })

    it('initializes with sovereign boss stats and dormant phase', () => {
      expect(worldTitanInvasion.boss.maxHp).toBe(50000)
      expect(worldTitanInvasion.boss.phase).toBe('dormant')
      expect(worldTitanInvasion.isCombatActive()).toBe(false)
    })

    it('summons titan invasion into Phase 1 Dark Veil', () => {
      const ok = worldTitanInvasion.summonTitanInvasion()
      expect(ok).toBe(true)
      expect(worldTitanInvasion.boss.phase).toBe('phase_1_dark_veil')
      expect(worldTitanInvasion.boss.shieldHp).toBe(15000)
      expect(worldTitanInvasion.isCombatActive()).toBe(true)
    })

    it('executes tactical orbital strike, titan breaker, and quantum trap', () => {
      worldTitanInvasion.summonTitanInvasion()

      // Orbital Strike
      const strikeOk = worldTitanInvasion.callOrbitalStrike()
      expect(strikeOk).toBe(true)
      expect(worldTitanInvasion.player.orbitalStrikeCooldown).toBe(12.0)
      expect(worldTitanInvasion.boss.shieldHp).toBe(15000 - 3600)

      // Titan Breaker
      const breakerOk = worldTitanInvasion.deployTitanBreaker()
      expect(breakerOk).toBe(true)
      expect(worldTitanInvasion.player.titanBreakerCooldown).toBe(5.0)

      // Quantum Trap
      const trapOk = worldTitanInvasion.triggerQuantumTrap()
      expect(trapOk).toBe(true)
      expect(worldTitanInvasion.boss.isStunned).toBe(true)
      expect(worldTitanInvasion.boss.stunTimer).toBe(4.5)

      // Rally Defensive Aura
      worldTitanInvasion.player.shield = 500
      worldTitanInvasion.rallyDefensiveAura()
      expect(worldTitanInvasion.player.shield).toBe(500 + 850)
    })

    it('advances through phases up to victory and awards mythic loot', () => {
      worldTitanInvasion.summonTitanInvasion()

      // Phase 1 -> Deplete shield (15,000)
      worldTitanInvasion.boss.shieldHp = 1000
      worldTitanInvasion.deployTitanBreaker() // 1800 dmg -> breaks shield
      expect(worldTitanInvasion.boss.phase).toBe('phase_2_antimatter_storm')

      // Phase 2 -> Destroy 4 tendrils
      for (let i = 0; i < 4; i++) {
        worldTitanInvasion.player.titanBreakerCooldown = 0
        worldTitanInvasion.deployTitanBreaker()
      }
      expect(worldTitanInvasion.boss.phase).toBe('phase_3_temporal_collapse')

      // Phase 3 -> Burn boss HP to 0
      worldTitanInvasion.boss.currentHp = 2000
      worldTitanInvasion.player.orbitalStrikeCooldown = 0
      worldTitanInvasion.callOrbitalStrike() // 3600 dmg -> kills boss
      expect(worldTitanInvasion.boss.phase).toBe('victory')
      expect(worldTitanInvasion.player.titansRepelled).toBeGreaterThanOrEqual(1)
      expect(worldTitanInvasion.player.mythicCoresLooted).toBeGreaterThanOrEqual(2)
      expect(achievements.isUnlocked('titan_vanquisher')).toBe(true)
    })

    it('ticks cooldowns and stun timer in update loop', () => {
      worldTitanInvasion.summonTitanInvasion()
      worldTitanInvasion.callOrbitalStrike()
      worldTitanInvasion.triggerQuantumTrap()

      expect(worldTitanInvasion.player.orbitalStrikeCooldown).toBe(12.0)
      expect(worldTitanInvasion.boss.isStunned).toBe(true)

      worldTitanInvasion.update(2.0)
      expect(worldTitanInvasion.player.orbitalStrikeCooldown).toBeCloseTo(10.0, 1)
      expect(worldTitanInvasion.boss.stunTimer).toBeCloseTo(2.5, 1)

      worldTitanInvasion.update(3.0)
      expect(worldTitanInvasion.boss.isStunned).toBe(false)
    })
  })

  // ── Engine 3: Quantum Neural Consciousness ─────────────────────────────────
  describe('Quantum Neural Consciousness Upload Engine', () => {
    it('initializes vessels and synaptic tree nodes', () => {
      expect(Object.keys(neuralConsciousness.vessels).length).toBe(Object.keys(NEURAL_VESSELS).length)
      expect(neuralConsciousness.nodes.length).toBe(12)
      expect(neuralConsciousness.stats.syncRate).toBeGreaterThanOrEqual(80)
    })

    it('transfers consciousness to different synthetic vessels', () => {
      const ok = neuralConsciousness.transferMindTo('android_frame')
      expect(ok).toBe(true)
      expect(neuralConsciousness.stats.activeVessel).toBe('android_frame')
      expect(neuralConsciousness.stats.statusMessage).toContain('自律生化合金義體')

      // Transfer to titan frame
      const titanOk = neuralConsciousness.transferMindTo('titan_frame')
      expect(titanOk).toBe(true)
      expect(neuralConsciousness.stats.activeVessel).toBe('titan_frame')
    })

    it('harvests memory shards through meditation', () => {
      const initial = neuralConsciousness.stats.memoryShards
      neuralConsciousness.harvestMemoryShards(50)
      expect(neuralConsciousness.stats.memoryShards).toBe(initial + 50)
    })

    it('unlocks synaptic nodes and awards transcendent achievement', () => {
      neuralConsciousness.stats.memoryShards = 500

      // Unlock multiple locked nodes
      const lockedNodes = neuralConsciousness.nodes.filter(n => !n.isUnlocked)
      for (const node of lockedNodes) {
        neuralConsciousness.unlockNode(node.id)
      }

      expect(neuralConsciousness.stats.totalNodesUnlocked).toBeGreaterThanOrEqual(8)
      expect(achievements.isUnlocked('mind_transcendent')).toBe(true)
    })
  })

  // ── Engine 4: Hyper-Subspace Quantum Broadcast BBS ─────────────────────────
  describe('Hyper-Subspace Quantum Broadcast BBS Engine', () => {
    it('initializes default broadcast messages and channels', () => {
      expect(quantumBroadcast.messages.length).toBeGreaterThanOrEqual(4)
      expect(quantumBroadcast.stats.activeChannel).toBe('galaxy_wide')
      expect(quantumBroadcast.stats.networkLatencyPs).toBe(0.04)
    })

    it('switches channels and filters messages properly', () => {
      quantumBroadcast.setChannel('black_market_wire')
      expect(quantumBroadcast.stats.activeChannel).toBe('black_market_wire')

      const filtered = quantumBroadcast.getMessagesForChannel('black_market_wire')
      expect(filtered.every(m => m.channel === 'black_market_wire')).toBe(true)
    })

    it('posts new transmission, updates stats and tracks achievement', () => {
      const ok = quantumBroadcast.postBroadcast(
        '【先鋒信標測試】全宇宙超空間訊號測試廣播已建立！',
        '開拓者指揮官',
        { x: 100, y: 50, z: 200 }
      )

      expect(ok).toBe(true)
      expect(quantumBroadcast.stats.totalSentByPlayer).toBeGreaterThanOrEqual(1)
      expect(quantumBroadcast.messages[0].senderName).toBe('開拓者指揮官')
      expect(quantumBroadcast.messages[0].coordinates).toEqual({ x: 100, y: 50, z: 200 })
      expect(achievements.isUnlocked('quantum_broadcaster')).toBe(true)
    })

    it('likes and tips broadcast messages', () => {
      const msg = quantumBroadcast.messages[0]
      const oldLikes = msg.likes
      const oldTips = msg.tipsCredits

      const likeOk = quantumBroadcast.likeMessage(msg.id)
      expect(likeOk).toBe(true)
      expect(msg.likes).toBe(oldLikes + 1)

      const tipOk = quantumBroadcast.tipMessage(msg.id, 500)
      expect(tipOk).toBe(true)
      expect(msg.tipsCredits).toBe(oldTips + 500)
      expect(quantumBroadcast.stats.totalTipsEarned).toBeGreaterThanOrEqual(500)
    })
  })
})
