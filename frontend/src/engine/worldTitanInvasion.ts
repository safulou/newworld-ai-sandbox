/**
 * NewWorld AI Sandbox - World Titan Colossus Global Invasion Engine
 * 
 * Implements:
 * - Sovereign-tier World Boss: Chronos the Void Harvester (50,000 HP)
 * - 3 Multi-Phase Global Invasion Combat States (Dark Veil, Antimatter Beam Storm, 60s Temporal Meltdown Enrage)
 * - Multi-System Cross-Platform Strikes: Orbital Flagship Bombardment, Exosuit Titan Breaker, Quantum Collapse Trap, Defensive Rally Aura
 * - Contribution leaderboard tracking (DPS, Defense, Support, Mythic Drops)
 * - Pure Web Audio procedural audio synthesis (Titan earthquake footsteps, antimatter beam roars, orbital salvo, victory fanfare)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type TitanPhase = 'dormant' | 'phase_1_dark_veil' | 'phase_2_antimatter_storm' | 'phase_3_temporal_collapse' | 'victory' | 'defeat'

export interface TitanBoss {
  name: string
  title: string
  maxHp: number
  currentHp: number
  shieldHp: number
  maxShieldHp: number
  phase: TitanPhase
  enrageTimerSec: number // 60s countdown for phase 3
  isStunned: boolean
  stunTimer: number
  antimatterTendrils: number // Phase 2 sub-targets: 4
}

export interface PlayerVanguardStats {
  hull: number
  maxHull: number
  shield: number
  maxShield: number
  orbitalStrikeCooldown: number
  titanBreakerCooldown: number
  quantumTrapCooldown: number
  rallyAuraCooldown: number
  totalDamageDealt: number
  titansRepelled: number
  creditsAwarded: number
  mythicCoresLooted: number
  combatLogs: string[]
}

export class WorldTitanInvasionEngine {
  public boss: TitanBoss = {
    name: '克洛諾斯·虛空收割者 (Chronos the Void Harvester)',
    title: '主權級宇宙時空巨神 (Sovereign Titan Colossus)',
    maxHp: 50000,
    currentHp: 50000,
    shieldHp: 15000,
    maxShieldHp: 15000,
    phase: 'dormant',
    enrageTimerSec: 60,
    isStunned: false,
    stunTimer: 0,
    antimatterTendrils: 4
  }

  public player: PlayerVanguardStats = {
    hull: 2500,
    maxHull: 2500,
    shield: 1500,
    maxShield: 1500,
    orbitalStrikeCooldown: 0,
    titanBreakerCooldown: 0,
    quantumTrapCooldown: 0,
    rallyAuraCooldown: 0,
    totalDamageDealt: 0,
    titansRepelled: 0,
    creditsAwarded: 0,
    mythicCoresLooted: 0,
    combatLogs: ['全服警報信標待命中，空間裂隙邊界暫無巨神波動。']
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  // ── Encounter Flow ───────────────────────────────────────────────────────
  public summonTitanInvasion(): boolean {
    if (this.boss.phase !== 'dormant' && this.boss.phase !== 'victory' && this.boss.phase !== 'defeat') {
      return false
    }

    this.boss.currentHp = this.boss.maxHp
    this.boss.shieldHp = this.boss.maxShieldHp
    this.boss.phase = 'phase_1_dark_veil'
    this.boss.enrageTimerSec = 60
    this.boss.isStunned = false
    this.boss.stunTimer = 0
    this.boss.antimatterTendrils = 4

    this.player.hull = this.player.maxHull
    this.player.shield = this.player.maxShield
    this.player.orbitalStrikeCooldown = 0
    this.player.titanBreakerCooldown = 0
    this.player.quantumTrapCooldown = 0
    this.player.rallyAuraCooldown = 0

    this.player.combatLogs = [
      '🚨 [世界事件浩劫啟動] 主權級巨神克洛諾斯突破暗物質裂隙！第一階段：擊破 15,000 暗物質天幕偏折盾！'
    ]

    this.playTitanStomp()
    this.saveState()
    return true
  }

  public abortInvasion(): void {
    if (this.boss.phase !== 'dormant') {
      this.boss.phase = 'defeat'
      this.player.combatLogs.unshift('❌ 全服防衛軍戰術撤離，泰坦已撕裂時空遁回虛空。')
      this.saveState()
    }
  }

  public resetToDormant(): void {
    this.boss.phase = 'dormant'
    this.boss.currentHp = this.boss.maxHp
    this.boss.shieldHp = this.boss.maxShieldHp
    this.saveState()
  }

  // ── Tactical Actions ─────────────────────────────────────────────────────
  public callOrbitalStrike(): boolean {
    if (this.player.orbitalStrikeCooldown > 0 || !this.isCombatActive()) return false

    this.player.orbitalStrikeCooldown = 12.0
    const dmg = 3600
    this.applyDamageToTitan(dmg, '🚀 [旗艦軌道支援砲火] 雙星旗艦光矛齊射！造成 3,600 巨額打擊！')
    this.playOrbitalBombardment()
    this.saveState()
    return true
  }

  public deployTitanBreaker(): boolean {
    if (this.player.titanBreakerCooldown > 0 || !this.isCombatActive()) return false

    this.player.titanBreakerCooldown = 5.0
    const dmg = 1800
    this.applyDamageToTitan(dmg, '🦾 [外骨骼破甲鑽] 高頻超導鑽頭刺穿巨神裝甲！造成 1,800 貫穿傷害！')
    this.saveState()
    return true
  }

  public triggerQuantumTrap(): boolean {
    if (this.player.quantumTrapCooldown > 0 || !this.isCombatActive()) return false

    this.player.quantumTrapCooldown = 16.0
    this.boss.isStunned = true
    this.boss.stunTimer = 4.5
    this.player.combatLogs.unshift('🕳️ [量子信標坍縮陷阱] 強制引發重力塌縮！克洛諾斯陷入時空停滯癱瘓 (4.5 秒)！')
    this.saveState()
    return true
  }

  public rallyDefensiveAura(): boolean {
    if (this.player.rallyAuraCooldown > 0 || !this.isCombatActive()) return false

    this.player.rallyAuraCooldown = 10.0
    this.player.shield = Math.min(this.player.maxShield, this.player.shield + 850)
    this.player.hull = Math.min(this.player.maxHull, this.player.hull + 450)
    this.player.combatLogs.unshift('🛡️ [全服戰術防護力場] 偏折矩陣同調注入：護盾 +850，外殼 +450！')
    this.saveState()
    return true
  }

  private applyDamageToTitan(dmg: number, logMsg: string): void {
    this.player.totalDamageDealt += dmg

    if (this.boss.phase === 'phase_1_dark_veil') {
      if (this.boss.shieldHp > 0) {
        const absorbed = Math.min(this.boss.shieldHp, dmg)
        this.boss.shieldHp -= absorbed
        dmg -= absorbed
      }
      if (this.boss.shieldHp <= 0) {
        this.boss.phase = 'phase_2_antimatter_storm'
        this.player.combatLogs.unshift('⚡ [Phase 2: 反物質風暴] 暗物質天幕瓦解！肅清 4 處反物質湮滅觸手！')
        this.playAntimatterBeam()
      }
    }

    if (this.boss.phase === 'phase_2_antimatter_storm') {
      if (this.boss.antimatterTendrils > 0) {
        this.boss.antimatterTendrils -= 1
        this.player.combatLogs.unshift(`💥 摧毀 1 根湮滅觸手！剩餘: ${this.boss.antimatterTendrils}`)
        if (this.boss.antimatterTendrils === 0) {
          this.boss.phase = 'phase_3_temporal_collapse'
          this.player.combatLogs.unshift('🚨 [Phase 3: 時間碎裂暴走] 巨神陷入狂暴！60 秒終末自毀倒數全力斬殺！')
        }
      }
    }

    if (this.boss.phase === 'phase_3_temporal_collapse' && dmg > 0) {
      this.boss.currentHp = Math.max(0, this.boss.currentHp - dmg)
      if (this.boss.currentHp <= 0) {
        this.triggerVictory()
      }
    }

    this.player.combatLogs.unshift(logMsg)
  }

  private triggerVictory(): void {
    this.boss.phase = 'victory'
    this.boss.currentHp = 0
    this.player.titansRepelled += 1
    const lootCredits = 120000
    this.player.creditsAwarded += lootCredits
    this.player.mythicCoresLooted += 2

    this.player.combatLogs.unshift(
      `🏆 [世界首領討伐完勝] 宇宙巨神克洛諾斯徹底崩潰解體！獲得 ${lootCredits.toLocaleString()} CR 與 2 顆神話泰坦時空核心！`
    )

    // Achievements
    achievements.trackProgress('titan_vanquisher', 1)
    this.playTitanDefeatedFanfare()
    this.saveState()
  }

  public isCombatActive(): boolean {
    return (
      this.boss.phase === 'phase_1_dark_veil' ||
      this.boss.phase === 'phase_2_antimatter_storm' ||
      this.boss.phase === 'phase_3_temporal_collapse'
    )
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    // Player Cooldowns
    if (this.player.orbitalStrikeCooldown > 0) this.player.orbitalStrikeCooldown = Math.max(0, this.player.orbitalStrikeCooldown - delta)
    if (this.player.titanBreakerCooldown > 0) this.player.titanBreakerCooldown = Math.max(0, this.player.titanBreakerCooldown - delta)
    if (this.player.quantumTrapCooldown > 0) this.player.quantumTrapCooldown = Math.max(0, this.player.quantumTrapCooldown - delta)
    if (this.player.rallyAuraCooldown > 0) this.player.rallyAuraCooldown = Math.max(0, this.player.rallyAuraCooldown - delta)

    // Stun logic
    if (this.boss.isStunned) {
      this.boss.stunTimer -= delta
      if (this.boss.stunTimer <= 0) {
        this.boss.isStunned = false
      }
    }

    // Boss Combat Loop
    if (this.isCombatActive() && !this.boss.isStunned) {
      if (this.boss.phase === 'phase_3_temporal_collapse') {
        this.boss.enrageTimerSec -= delta
        if (this.boss.enrageTimerSec <= 0) {
          this.boss.phase = 'defeat'
          this.player.combatLogs.unshift('💀 終末浩劫時間倒數歸零！時空暴走泯滅戰區，防衛軍陣線崩潰。')
          this.saveState()
          return
        }
      }

      // Incoming damage from Titan
      if (Math.random() < 0.28 * delta) {
        let dmg = 150
        if (this.boss.phase === 'phase_2_antimatter_storm') dmg = 280
        if (this.boss.phase === 'phase_3_temporal_collapse') dmg = 420

        if (this.player.shield > 0) {
          const absorbed = Math.min(this.player.shield, dmg)
          this.player.shield -= absorbed
          dmg -= absorbed
        }
        if (dmg > 0) {
          this.player.hull = Math.max(0, this.player.hull - dmg)
        }

        if (this.player.hull <= 0) {
          this.boss.phase = 'defeat'
          this.player.combatLogs.unshift('💥 旗艦指揮護盾殉爆破裂！防衛行動失敗。')
          this.saveState()
        }
      }
    }
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playTitanStomp(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(55, now)
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.2)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.4)
  }

  public playAntimatterBeam(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(850, now)
    osc.frequency.linearRampToValueAtTime(280, now + 0.8)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.9)
  }

  public playOrbitalBombardment(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.6)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.8)
  }

  public playTitanDefeatedFanfare(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5] // C Major Grand Fanfare
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.1
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_world_titan', JSON.stringify({
        boss: this.boss,
        player: this.player
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_world_titan')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.boss) {
          this.boss = { ...this.boss, ...parsed.boss }
          if (this.isCombatActive()) {
            this.boss.phase = 'dormant'
          }
        }
        if (parsed.player) {
          this.player = { ...this.player, ...parsed.player }
        }
      }
    } catch { /* ignore */ }
  }
}

export const worldTitanInvasion = new WorldTitanInvasionEngine()
