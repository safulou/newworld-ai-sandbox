/**
 * NewWorld AI Sandbox - Syndicate Flagship Corporate Raids Engine
 * 
 * Implements:
 * - 4 Syndicate Megacorporate Flagships (Solaris Prime, Tiamat IV, Behemoth Drill, Null Singularity)
 * - 3-Phase Multi-Stage Flagship Assault State Machine (Phase 1: Shield Array, Phase 2: Flak Turrets, Phase 3: Critical Reactor Core Meltdown)
 * - Squadron Tactical Armaments: Dual Flak Cannons, Heavy Proton Torpedoes, EW Target Jammer, Nanite Repair Swarm
 * - Dynamic boss combat loop, targeting subsystem components, combat telemetry & territory dividend payouts
 * - Pure Web Audio procedural audio synthesis (Heavy flak bursts, torpedo whooshes, meltdown sirens, catastrophic explosions)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type FlagshipFaction = 'neon_vanguard' | 'arasaka_orbital' | 'cygnus_mining' | 'quantum_syndicate'

export type RaidPhase = 'standby' | 'phase_1_shields' | 'phase_2_flak' | 'phase_3_meltdown' | 'victory' | 'defeat'

export interface FlagshipTarget {
  id: FlagshipFaction
  name: string
  factionName: string
  classType: string
  maxHull: number
  currentHull: number
  shieldGenerators: number   // Phase 1 target: 4 units
  flakTurrets: number        // Phase 2 target: 6 units
  reactorMeltdownTimer: number // Phase 3 timer: 45s
  specialAbility: string
  color: string
}

export interface PlayerSquadron {
  hull: number
  maxHull: number
  shield: number
  maxShield: number
  torpedoes: number
  maxTorpedoes: number
  flakCooldown: number
  torpedoCooldown: number
  jammerCooldown: number
  repairCooldown: number
  isJamming: boolean
  jammingTimer: number
}

export interface FlagshipRaidStats {
  activeFaction: FlagshipFaction
  phase: RaidPhase
  score: number
  raidsWon: number
  creditsLooted: number
  territoryInfluenceBonus: number
  combatLog: string[]
}

export const FLAGSHIP_TARGETS: Record<FlagshipFaction, FlagshipTarget> = {
  neon_vanguard: {
    id: 'neon_vanguard',
    name: '日光耀斑·索拉里斯號 (Solaris Prime)',
    factionName: 'Neon Vanguard 霓虹先鋒',
    classType: 'Solar Supercarrier',
    maxHull: 24000,
    currentHull: 24000,
    shieldGenerators: 4,
    flakTurrets: 6,
    reactorMeltdownTimer: 45,
    specialAbility: '等離子全向高熱輻射波',
    color: '#00ffff'
  },
  arasaka_orbital: {
    id: 'arasaka_orbital',
    name: '軌道要塞·提亞馬特四號 (Tiamat IV)',
    factionName: 'Arasaka Orbital 荒坂軌道',
    classType: 'Heavy Orbital Dreadnought',
    maxHull: 28000,
    currentHull: 28000,
    shieldGenerators: 4,
    flakTurrets: 6,
    reactorMeltdownTimer: 45,
    specialAbility: '超高壓重型電磁軌道齊射',
    color: '#ff0055'
  },
  cygnus_mining: {
    id: 'cygnus_mining',
    name: '深空巨獸·破岩巨鑚號 (Behemoth Drill)',
    factionName: 'Cygnus Deep Mining 天鵝採礦',
    classType: 'Super-Heavy Titan Ram',
    maxHull: 32000,
    currentHull: 32000,
    shieldGenerators: 4,
    flakTurrets: 6,
    reactorMeltdownTimer: 45,
    specialAbility: '分子粉碎震波與爆破碎片',
    color: '#ffaa00'
  },
  quantum_syndicate: {
    id: 'quantum_syndicate',
    name: '虛空特異·奇異點零號 (Null Singularity)',
    factionName: 'Quantum Syndicate 量子辛迪加',
    classType: 'Void Phase Battleship',
    maxHull: 22000,
    currentHull: 22000,
    shieldGenerators: 4,
    flakTurrets: 6,
    reactorMeltdownTimer: 45,
    specialAbility: '相位隱匿躍遷與時空擾動',
    color: '#bd00ff'
  }
}

export class SyndicateFlagshipRaidsEngine {
  public targets: Record<FlagshipFaction, FlagshipTarget>
  public squadron: PlayerSquadron = {
    hull: 1500,
    maxHull: 1500,
    shield: 1000,
    maxShield: 1000,
    torpedoes: 14,
    maxTorpedoes: 14,
    flakCooldown: 0,
    torpedoCooldown: 0,
    jammerCooldown: 0,
    repairCooldown: 0,
    isJamming: false,
    jammingTimer: 0
  }

  public stats: FlagshipRaidStats = {
    activeFaction: 'arasaka_orbital',
    phase: 'standby',
    score: 0,
    raidsWon: 0,
    creditsLooted: 0,
    territoryInfluenceBonus: 0,
    combatLog: ['突擊中隊已進入突襲空域，等待戰術指令。']
  }

  private audioCtx: AudioContext | null = null
  private lastUpdate = 0

  constructor() {
    this.targets = JSON.parse(JSON.stringify(FLAGSHIP_TARGETS))
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

  // ── Raid Engagement Controls ─────────────────────────────────────────────
  public selectTarget(faction: FlagshipFaction): void {
    if (this.stats.phase !== 'standby') return
    this.stats.activeFaction = faction
    this.resetTargetState(faction)
    this.saveState()
  }

  public startRaid(): boolean {
    if (this.stats.phase !== 'standby') return false
    this.resetTargetState(this.stats.activeFaction)
    this.squadron.hull = this.squadron.maxHull
    this.squadron.shield = this.squadron.maxShield
    this.squadron.torpedoes = this.squadron.maxTorpedoes
    this.squadron.flakCooldown = 0
    this.squadron.torpedoCooldown = 0
    this.squadron.jammerCooldown = 0
    this.squadron.repairCooldown = 0

    this.stats.phase = 'phase_1_shields'
    this.stats.combatLog = [
      `🚨 [Phase 1: 護盾陣列] 突襲已開始！鎖定目標 ${this.targets[this.stats.activeFaction].name}，摧毀 4 處偏折護盾發生器！`
    ]
    this.playMeltdownKlaxon()
    this.saveState()
    return true
  }

  public abortRaid(): void {
    if (this.stats.phase !== 'standby') {
      this.stats.phase = 'defeat'
      this.stats.combatLog.unshift('❌ 突襲中隊已強制撤出戰區。')
      this.saveState()
    }
  }

  public resetToStandby(): void {
    this.stats.phase = 'standby'
    this.resetTargetState(this.stats.activeFaction)
    this.saveState()
  }

  private resetTargetState(faction: FlagshipFaction): void {
    const defaultData = FLAGSHIP_TARGETS[faction]
    this.targets[faction] = {
      ...defaultData,
      currentHull: defaultData.maxHull,
      shieldGenerators: 4,
      flakTurrets: 6,
      reactorMeltdownTimer: 45
    }
  }

  // ── Combat Actions ───────────────────────────────────────────────────────
  public fireFlakCannons(): boolean {
    if (this.squadron.flakCooldown > 0 || this.stats.phase === 'standby' || this.stats.phase === 'victory' || this.stats.phase === 'defeat') {
      return false
    }

    this.squadron.flakCooldown = 0.4
    const target = this.targets[this.stats.activeFaction]
    this.playFlakFire()

    if (this.stats.phase === 'phase_1_shields') {
      this.stats.combatLog.unshift('💥 機砲打擊護盾發生器外殼，造成輕度破壞！')
      if (Math.random() < 0.4 && target.shieldGenerators > 0) {
        target.shieldGenerators -= 1
        this.stats.combatLog.unshift(`🎯 摧毀 1 座護盾發生器！剩餘: ${target.shieldGenerators}`)
        if (target.shieldGenerators === 0) {
          this.advanceToPhase2()
        }
      }
    } else if (this.stats.phase === 'phase_2_flak') {
      if (target.flakTurrets > 0) {
        target.flakTurrets -= 1
        this.stats.combatLog.unshift(`🎯 機砲擊毀 1 座敵艦防空砲台！剩餘砲台: ${target.flakTurrets}`)
        if (target.flakTurrets === 0) {
          this.advanceToPhase3()
        }
      }
    } else if (this.stats.phase === 'phase_3_meltdown') {
      target.currentHull = Math.max(0, target.currentHull - 450)
      this.stats.combatLog.unshift(`🔥 直擊暴露的反應堆核心！造成 450 傷害 (剩餘: ${target.currentHull})`)
      if (target.currentHull === 0) {
        this.triggerVictory()
      }
    }

    this.stats.score += 80
    this.saveState()
    return true
  }

  public fireProtonTorpedo(): boolean {
    if (
      this.squadron.torpedoCooldown > 0 ||
      this.squadron.torpedoes <= 0 ||
      this.stats.phase === 'standby' ||
      this.stats.phase === 'victory' ||
      this.stats.phase === 'defeat'
    ) {
      return false
    }

    this.squadron.torpedoes -= 1
    this.squadron.torpedoCooldown = 2.5
    const target = this.targets[this.stats.activeFaction]
    this.playTorpedoLaunch()

    if (this.stats.phase === 'phase_1_shields') {
      if (target.shieldGenerators > 0) {
        target.shieldGenerators = Math.max(0, target.shieldGenerators - 1)
        this.stats.combatLog.unshift(`🚀 質子魚雷精確貫穿！擊破 1 座護盾發生器！剩餘: ${target.shieldGenerators}`)
        if (target.shieldGenerators === 0) {
          this.advanceToPhase2()
        }
      }
    } else if (this.stats.phase === 'phase_2_flak') {
      target.flakTurrets = Math.max(0, target.flakTurrets - 2)
      this.stats.combatLog.unshift(`🚀 質子魚雷大範圍轟爆！炸毀 2 座防空砲台！剩餘: ${target.flakTurrets}`)
      if (target.flakTurrets === 0) {
        this.advanceToPhase3()
      }
    } else if (this.stats.phase === 'phase_3_meltdown') {
      target.currentHull = Math.max(0, target.currentHull - 2800)
      this.stats.combatLog.unshift(`🚀 質子魚雷貫穿反應堆引爆高能鏈式反應！造成 2800 毀滅打擊！`)
      if (target.currentHull === 0) {
        this.triggerVictory()
      }
    }

    this.stats.score += 250
    this.saveState()
    return true
  }

  public activateJammer(): boolean {
    if (this.squadron.jammerCooldown > 0 || this.squadron.isJamming) return false
    this.squadron.isJamming = true
    this.squadron.jammingTimer = 5.0
    this.squadron.jammerCooldown = 12.0
    this.stats.combatLog.unshift('📡 電子干擾脈衝已啟動！旗艦火控鎖定已失效 (持續 5 秒)！')
    this.saveState()
    return true
  }

  public deployRepairSwarm(): boolean {
    if (this.squadron.repairCooldown > 0) return false
    this.squadron.repairCooldown = 15.0
    this.squadron.shield = Math.min(this.squadron.maxShield, this.squadron.shield + 600)
    this.squadron.hull = Math.min(this.squadron.maxHull, this.squadron.hull + 500)
    this.stats.combatLog.unshift('🛠️ 奈米維修蜂群注入：裝甲修復 +500，護盾充能 +600！')
    this.saveState()
    return true
  }

  // ── Phase Transitions ────────────────────────────────────────────────────
  private advanceToPhase2(): void {
    this.stats.phase = 'phase_2_flak'
    this.stats.combatLog.unshift('⚠️ [Phase 2: 防空網火控] 敵艦偏折護盾已崩解！密集高射砲台啟動，肅清 6 處防空砲！')
    this.playMeltdownKlaxon()
  }

  private advanceToPhase3(): void {
    this.stats.phase = 'phase_3_meltdown'
    this.stats.combatLog.unshift('🚨 [Phase 3: 核心熔毀倒數] 砲台全數摧毀！反應堆排熱閥大開，在 45 秒自毀前傾瀉火力摧毀核心！')
    this.playMeltdownKlaxon()
  }

  private triggerVictory(): void {
    this.stats.phase = 'victory'
    this.stats.raidsWon += 1
    const looted = 65000
    this.stats.creditsLooted += looted
    this.stats.territoryInfluenceBonus += 350
    this.stats.combatLog.unshift(`🏆 突襲大獲全勝！敵方旗艦已引爆殉爆解體，獲取 ${looted} 信用點與 +350 領地影響力！`)

    // Track achievement
    achievements.trackProgress('flagship_corsair', 1)

    this.playShipDestruction()
    this.saveState()
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.lastUpdate < 100) return
    this.lastUpdate = now

    // Squadron cooldowns
    if (this.squadron.flakCooldown > 0) this.squadron.flakCooldown = Math.max(0, this.squadron.flakCooldown - delta)
    if (this.squadron.torpedoCooldown > 0) this.squadron.torpedoCooldown = Math.max(0, this.squadron.torpedoCooldown - delta)
    if (this.squadron.jammerCooldown > 0) this.squadron.jammerCooldown = Math.max(0, this.squadron.jammerCooldown - delta)
    if (this.squadron.repairCooldown > 0) this.squadron.repairCooldown = Math.max(0, this.squadron.repairCooldown - delta)

    if (this.squadron.isJamming) {
      this.squadron.jammingTimer -= delta
      if (this.squadron.jammingTimer <= 0) {
        this.squadron.isJamming = false
      }
    }

    // Flagship attack logic
    if (this.stats.phase === 'phase_1_shields' || this.stats.phase === 'phase_2_flak' || this.stats.phase === 'phase_3_meltdown') {
      const target = this.targets[this.stats.activeFaction]

      // Phase 3 countdown timer
      if (this.stats.phase === 'phase_3_meltdown') {
        target.reactorMeltdownTimer -= delta
        if (target.reactorMeltdownTimer <= 0) {
          target.reactorMeltdownTimer = 0
          this.stats.phase = 'defeat'
          this.stats.combatLog.unshift('💀 反應堆臨界自毀衝擊波席捲空域！突擊中隊未能在時限內撤離，任務失敗。')
          this.saveState()
          return
        }
      }

      // Incoming enemy damage if not jammed
      if (!this.squadron.isJamming && Math.random() < 0.25 * delta) {
        let dmg = 120
        if (this.stats.phase === 'phase_2_flak') dmg = 220
        if (this.stats.phase === 'phase_3_meltdown') dmg = 350

        if (this.squadron.shield > 0) {
          const absorbed = Math.min(this.squadron.shield, dmg)
          this.squadron.shield -= absorbed
          dmg -= absorbed
        }
        if (dmg > 0) {
          this.squadron.hull = Math.max(0, this.squadron.hull - dmg)
        }

        if (this.squadron.hull <= 0) {
          this.stats.phase = 'defeat'
          this.stats.combatLog.unshift('💥 突擊中隊僚機外殼破裂解體！任務失敗。')
          this.saveState()
        }
      }
    }
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playFlakFire(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Noise burst for anti-aircraft cannon
    const bufferSize = ctx.sampleRate * 0.12
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.12)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  public playTorpedoLaunch(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.8)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.8)
  }

  public playMeltdownKlaxon(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.setValueAtTime(600, now + 0.2)
    osc.frequency.setValueAtTime(900, now + 0.4)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playShipDestruction(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Low boom oscillator + descending rumble
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 2.5)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 2.5)
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_flagship_raids', JSON.stringify({
        stats: this.stats,
        targets: this.targets
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_flagship_raids')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
          // Don't restore in the middle of active combat
          if (this.stats.phase !== 'standby') {
            this.stats.phase = 'standby'
          }
        }
        if (parsed.targets) {
          this.targets = { ...this.targets, ...parsed.targets }
        }
      }
    } catch { /* ignore */ }
  }
}

export const syndicateFlagshipRaids = new SyndicateFlagshipRaidsEngine()
