/**
 * NewWorld AI Sandbox - Deep-Sea Cyber Leviathan Boss Encounter Engine
 * 
 * Implements:
 * - 3-phase abyssal Boss encounter (Stalking, EMP Frenzy, Critical Meltdown 60s countdown)
 * - Submarine combat weaponry: Plasma Torpedoes, Flash Sonar, Acoustic Decoys, Repair Nanites
 * - Procedural Web Audio: FM synthesis whale roar, torpedo thrust, underwater depth-charge explosions
 * - LocalStorage state & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type BossPhase = 'stalking' | 'emp_frenzy' | 'meltdown' | 'defeated' | 'dormant'

export interface BossStats {
  phase: BossPhase
  bossHP: number
  bossMaxHP: number
  subHP: number
  subMaxHP: number
  torpedoAmmo: number
  maxTorpedoAmmo: number
  decoyCharges: number
  maxDecoyCharges: number
  isBlinded: boolean
  blindTimer: number
  isEmpStunned: boolean
  empStunTimer: number
  meltdownCountdown: number  // 60 seconds during Phase 3
  channelingAttack: string | null
  channelTimer: number
  torpedoCooldown: number
  flashCooldown: number
  decoyCooldown: number
  repairCooldown: number
  killCount: number
  bestTime: number
  depth: number              // meters below sea level (e.g. -58m)
}

export interface BossDrop {
  id: string
  name: string
  count: number
  rarity: 'Epic' | 'Legendary' | 'Mythic'
  description: string
}

export class LeviathanBossEngine {
  public stats: BossStats = {
    phase: 'dormant',
    bossHP: 5000,
    bossMaxHP: 5000,
    subHP: 1000,
    subMaxHP: 1000,
    torpedoAmmo: 14,
    maxTorpedoAmmo: 14,
    decoyCharges: 3,
    maxDecoyCharges: 3,
    isBlinded: false,
    blindTimer: 0,
    isEmpStunned: false,
    empStunTimer: 0,
    meltdownCountdown: 60,
    channelingAttack: null,
    channelTimer: 0,
    torpedoCooldown: 0,
    flashCooldown: 0,
    decoyCooldown: 0,
    repairCooldown: 0,
    killCount: 0,
    bestTime: 0,
    depth: -58.4,
  }

  public combatLogs: string[] = ['[聲納雷達] 海溝水下 -58.4m 偵測到巨型生化機械熱能特徵...']
  public dropsVault: BossDrop[] = []
  private encounterTimer: number = 0
  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public addLog(msg: string): void {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false })
    this.combatLogs.unshift(`[${time}] ${msg}`)
    if (this.combatLogs.length > 50) this.combatLogs.pop()
  }

  public spawnEncounter(): void {
    this.stats.phase = 'stalking'
    this.stats.bossHP = this.stats.bossMaxHP
    this.stats.subHP = this.stats.subMaxHP
    this.stats.torpedoAmmo = this.stats.maxTorpedoAmmo
    this.stats.decoyCharges = this.stats.maxDecoyCharges
    this.stats.isBlinded = false
    this.stats.blindTimer = 0
    this.stats.isEmpStunned = false
    this.stats.empStunTimer = 0
    this.stats.meltdownCountdown = 60
    this.stats.channelingAttack = null
    this.stats.channelTimer = 0
    this.stats.torpedoCooldown = 0
    this.stats.flashCooldown = 0
    this.stats.decoyCooldown = 0
    this.stats.repairCooldown = 0
    this.encounterTimer = 0

    this.addLog('【警報】機械利維坦（Cyber Leviathan）破水現身！全長 32m，電磁觸鬚發散刺眼幽藍光芒！')
    this.playLeviathanRoar()
  }

  public resetEncounter(): void {
    this.stats.phase = 'dormant'
    this.stats.channelingAttack = null
    this.stats.isBlinded = false
    this.stats.isEmpStunned = false
  }

  // ── Submarine Combat Actions ────────────────────────────────────────────────
  public fireTorpedo(): { success: boolean; message: string } {
    if (this.stats.phase === 'dormant' || this.stats.phase === 'defeated') {
      return { success: false, message: '目前無處於戰鬥中的利維坦。' }
    }
    if (this.stats.isEmpStunned) {
      return { success: false, message: '潛艇受到 EMP 衝擊波癱瘓中，武器系統暫時離線！' }
    }
    if (this.stats.torpedoCooldown > 0) {
      return { success: false, message: `魚雷裝填中，冷卻尚餘 ${this.stats.torpedoCooldown.toFixed(1)} 秒。` }
    }
    if (this.stats.torpedoAmmo <= 0) {
      return { success: false, message: '電漿魚雷彈藥已耗盡！' }
    }

    this.stats.torpedoAmmo--
    this.stats.torpedoCooldown = 2.4
    const dmg = 360 + Math.round(Math.random() * 80)
    this.stats.bossHP = Math.max(0, this.stats.bossHP - dmg)

    this.addLog(`發射導向電漿魚雷！命中利維坦外殼，造成 ${dmg} 點高壓爆破傷害！(剩餘彈藥: ${this.stats.torpedoAmmo})`)
    this.playTorpedoFire()
    setTimeout(() => this.playUnderwaterExplosion(), 300)

    this.checkPhaseTransition()
    return { success: true, message: `魚雷命中！造成 ${dmg} 點傷害。` }
  }

  public fireFlashSonar(): { success: boolean; message: string } {
    if (this.stats.phase === 'dormant' || this.stats.phase === 'defeated') {
      return { success: false, message: '無交戰目標。' }
    }
    if (this.stats.isEmpStunned) {
      return { success: false, message: '潛艇 EMP 癱瘓中！' }
    }
    if (this.stats.flashCooldown > 0) {
      return { success: false, message: `閃光聲納冷卻中，尚餘 ${this.stats.flashCooldown.toFixed(1)} 秒。` }
    }

    this.stats.flashCooldown = 8.0
    this.stats.isBlinded = true
    this.stats.blindTimer = 4.0
    const interrupted = this.stats.channelingAttack
    this.stats.channelingAttack = null
    this.stats.channelTimer = 0

    this.addLog(`釋放高能閃光聲納脈衝！利維坦光學感測器致盲 4 秒！${interrupted ? '【成功中斷其蓄力招式！】' : ''}`)
    this.playFlashSonarAudio()
    return { success: true, message: '高能聲納發射！利維坦致盲 4 秒。' }
  }

  public deployDecoy(): { success: boolean; message: string } {
    if (this.stats.phase === 'dormant' || this.stats.phase === 'defeated') return { success: false, message: '無交戰目標。' }
    if (this.stats.decoyCooldown > 0) return { success: false, message: `誘餌冷卻中 (${this.stats.decoyCooldown.toFixed(1)}s)` }
    if (this.stats.decoyCharges <= 0) return { success: false, message: '聲學誘餌次數已耗盡！' }

    this.stats.decoyCharges--
    this.stats.decoyCooldown = 12.0
    this.addLog(`投擲聲學全息誘餌！利維坦聲納已被欺騙，下一次衝撞將完全偏移！(剩餘誘餌: ${this.stats.decoyCharges})`)
    this.playFlashSonarAudio()
    return { success: true, message: '誘餌已部署！' }
  }

  public repairHull(): { success: boolean; message: string } {
    if (this.stats.repairCooldown > 0) return { success: false, message: `奈米修復冷卻中 (${this.stats.repairCooldown.toFixed(1)}s)` }
    this.stats.repairCooldown = 15.0
    const heal = 320
    this.stats.subHP = Math.min(this.stats.subMaxHP, this.stats.subHP + heal)
    this.addLog(`啟動奈米機器人外殼自癒：潛艇外殼修復 +${heal} HP！(現有外殼: ${this.stats.subHP}/${this.stats.subMaxHP})`)
    return { success: true, message: `外殼修復 +${heal} HP` }
  }

  // ── State & Phase Logic ─────────────────────────────────────────────────────
  private checkPhaseTransition(): void {
    if (this.stats.bossHP <= 0) {
      this.handleBossVictory()
      return
    }

    const hpRatio = this.stats.bossHP / this.stats.bossMaxHP
    if (hpRatio <= 0.3 && this.stats.phase !== 'meltdown') {
      this.stats.phase = 'meltdown'
      this.stats.meltdownCountdown = 60
      this.addLog('【Phase 3 臨界狂暴】利維坦機械核心超載！進入 60 秒自毀裂變倒數！必須在引爆前將其殲滅！')
      this.playLeviathanRoar()
    } else if (hpRatio <= 0.7 && this.stats.phase === 'stalking') {
      this.stats.phase = 'emp_frenzy'
      this.addLog('【Phase 2 電磁暴走】利維坦張開電漿背鰭，海流中充斥劇烈電磁火花！準備釋放全向 EMP 衝擊波！')
      this.playLeviathanRoar()
    }
  }

  private handleBossVictory(): void {
    this.stats.phase = 'defeated'
    this.stats.killCount++
    if (this.stats.bestTime === 0 || this.encounterTimer < this.stats.bestTime) {
      this.stats.bestTime = Math.round(this.encounterTimer)
    }

    // Award Drops
    this.dropsVault.push(
      { id: 'drop_core', name: '古代利維坦生化微胞核心 (Leviathan Bio-Cell Core)', count: 1, rarity: 'Mythic', description: '蘊含高維電漿與古代遺傳因子的極致能源核心' },
      { id: 'drop_plate', name: '深淵超導金屬裝甲板 (Abyssal Superconductor Plates)', count: 4, rarity: 'Legendary', description: '可抵禦 150 Bar 超高壓與極限衝擊的航太級合金' },
      { id: 'drop_trophy', name: '深海利維坦全息戰利品圖騰 (Leviathan Holo-Trophy)', count: 1, rarity: 'Epic', description: '銘刻開拓者勇者之名的 3D 全息立體戰利雕像' }
    )

    this.addLog(`【討伐大捷】機械利維坦解體墜入海溝！耗時 ${this.encounterTimer.toFixed(1)} 秒！獲得神話核心與超導裝甲！`)
    achievements.unlock('leviathan_slayer')
    this.saveState()
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return

    // Cooldown reductions
    if (this.stats.torpedoCooldown > 0) this.stats.torpedoCooldown = Math.max(0, this.stats.torpedoCooldown - delta)
    if (this.stats.flashCooldown > 0) this.stats.flashCooldown = Math.max(0, this.stats.flashCooldown - delta)
    if (this.stats.decoyCooldown > 0) this.stats.decoyCooldown = Math.max(0, this.stats.decoyCooldown - delta)
    if (this.stats.repairCooldown > 0) this.stats.repairCooldown = Math.max(0, this.stats.repairCooldown - delta)

    // Stun / Blind timers
    if (this.stats.isBlinded) {
      this.stats.blindTimer = Math.max(0, this.stats.blindTimer - delta)
      if (this.stats.blindTimer <= 0) this.stats.isBlinded = false
    }
    if (this.stats.isEmpStunned) {
      this.stats.empStunTimer = Math.max(0, this.stats.empStunTimer - delta)
      if (this.stats.empStunTimer <= 0) {
        this.stats.isEmpStunned = false
        this.addLog('潛艇重啟完成，電子系統恢復正常。')
      }
    }

    if (this.stats.phase === 'dormant' || this.stats.phase === 'defeated') return

    this.encounterTimer += delta

    // Phase 3 Meltdown Timer
    if (this.stats.phase === 'meltdown') {
      this.stats.meltdownCountdown = Math.max(0, this.stats.meltdownCountdown - delta)
      if (this.stats.meltdownCountdown <= 0) {
        // Explode
        this.stats.subHP = 0
        this.stats.phase = 'dormant'
        this.addLog('【自毀大爆炸】利維坦超載自爆！深海衝擊波將深潛艇完全壓碎！討伐失敗。')
        this.playUnderwaterExplosion()
        return
      }
    }

    // AI Boss behavior: attack channeling
    if (!this.stats.isBlinded) {
      this.stats.channelTimer += delta
      if (!this.stats.channelingAttack && this.stats.channelTimer >= 5.0) {
        this.stats.channelTimer = 0
        const rand = Math.random()
        if (this.stats.phase === 'emp_frenzy' && rand > 0.4) {
          this.stats.channelingAttack = 'EMP 衝擊波 (EMP Surge)'
          this.addLog('【利維坦正在蓄力】背鰭電容充電中！準備釋放全向 EMP 衝擊波！(可用閃光聲納打斷)')
        } else {
          this.stats.channelingAttack = '利齒撕咬衝撞 (Abyssal Bite)'
          this.addLog('【利維坦鎖定目標】水下推進器全開，狂暴撕咬襲來！(可部署聲學誘餌)')
        }
      } else if (this.stats.channelingAttack && this.stats.channelTimer >= 3.0) {
        // Execute attack
        const attackName = this.stats.channelingAttack
        this.stats.channelingAttack = null
        this.stats.channelTimer = 0

        if (attackName.includes('EMP')) {
          this.stats.isEmpStunned = true
          this.stats.empStunTimer = 3.5
          this.addLog('【EMP 炸裂】強烈電磁脈衝掃過，深潛艇儀表與武器系統癱瘓 3.5 秒！')
          this.playEmpShock()
        } else {
          // Bite
          const dmg = 120 + Math.round(Math.random() * 40)
          this.stats.subHP = Math.max(0, this.stats.subHP - dmg)
          this.addLog(`【沉重打擊】利維坦利齒咬穿外殼，深潛艇承受 ${dmg} 點結構損傷！`)
          this.playUnderwaterExplosion()
          if (this.stats.subHP <= 0) {
            this.stats.phase = 'dormant'
            this.addLog('深潛艇結構全毀，緊急逃生艙發射回浮球！討伐失敗。')
          }
        }
      }
    }
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playLeviathanRoar(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // FM Synthesis for monstrous cyber whale roar
    const carrier = ctx.createOscillator()
    const modulator = ctx.createOscillator()
    const modGain = ctx.createGain()
    const mainGain = ctx.createGain()

    carrier.type = 'sawtooth'
    carrier.frequency.setValueAtTime(65, now)
    carrier.frequency.exponentialRampToValueAtTime(140, now + 0.8)
    carrier.frequency.exponentialRampToValueAtTime(45, now + 2.0)

    modulator.type = 'sine'
    modulator.frequency.setValueAtTime(14, now)
    modulator.frequency.linearRampToValueAtTime(8, now + 2.0)

    modGain.gain.setValueAtTime(120, now)
    modGain.gain.linearRampToValueAtTime(30, now + 2.0)

    mainGain.gain.setValueAtTime(0.01, now)
    mainGain.gain.linearRampToValueAtTime(0.35, now + 0.3)
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2)

    modulator.connect(modGain)
    modGain.connect(carrier.frequency)
    carrier.connect(mainGain)
    mainGain.connect(ctx.destination)

    carrier.start(now)
    modulator.start(now)
    carrier.stop(now + 2.2)
    modulator.stop(now + 2.2)
  }

  public playTorpedoFire(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  public playUnderwaterExplosion(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, now)
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.8)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.8)
  }

  public playFlashSonarAudio(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2400, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.5)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  public playEmpShock(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.setValueAtTime(1200, now + 0.1)
    osc.frequency.setValueAtTime(150, now + 0.2)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_leviathan_boss')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.killCount) this.stats.killCount = parsed.killCount
        if (parsed.bestTime) this.stats.bestTime = parsed.bestTime
        if (parsed.dropsVault) this.dropsVault = parsed.dropsVault
      }
    } catch {
      // Ignore load error
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const payload = {
        killCount: this.stats.killCount,
        bestTime: this.stats.bestTime,
        dropsVault: this.dropsVault,
      }
      localStorage.setItem('nw_leviathan_boss', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const leviathanBoss = new LeviathanBossEngine()
