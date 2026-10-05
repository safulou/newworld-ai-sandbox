/**
 * NewWorld AI Sandbox - Interstellar Wormhole Gravity Slingshot Engine
 * 
 * Implements:
 * - Relativistic Stellar Gravity Well & Hyperbolic Slingshot Trajectory Physics
 * - 4 Interstellar Super-corridors (Cygnus Corridor, Galactic Core Chute, Orion Express, Magellanic Bridge)
 * - Interactive orbital inclination, periapsis distance tuning, and Lorentz time-dilation calculation
 * - Dyson Sphere energy resonance boost (+400% Superluminal exit velocity)
 * - Pure Web Audio procedural audio synthesis (Gravity well sub-drone, slingshot burn roar, superluminal exit chirp)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type CorridorId = 'cygnus_corridor' | 'galactic_core_chute' | 'orion_express' | 'magellanic_bridge'

export type SlingshotState = 'standby' | 'approach' | 'slingshot_burn' | 'superluminal_exit' | 'cooldown'

export interface SlingshotCorridor {
  id: CorridorId
  name: string
  destination: string
  distanceLY: number
  baseBoostMultiplier: number
  idealPeriapsisKm: number
  hazardRating: 'Moderate' | 'High' | 'Extreme'
  description: string
  color: string
}

export interface SlingshotStats {
  state: SlingshotState
  activeCorridor: CorridorId
  periapsisRadiusKm: number // Distance to stellar core
  vectorAngleDeg: number    // -45 to +45 deg
  currentVelocityC: number  // in multiples of c (light speed)
  lorentzFactor: number     // gamma factor
  burnProgress: number      // 0 to 100%
  heatPercentage: number    // 0 to 100%
  dysonResonanceActive: boolean
  totalSlingshotsCompleted: number
  lastExitVelocityC: number
  statusMessage: string
}

export const SLINGSHOT_CORRIDORS: Record<CorridorId, SlingshotCorridor> = {
  cygnus_corridor: {
    id: 'cygnus_corridor',
    name: '天鵝座大走廊 (Cygnus Corridor)',
    destination: 'Cygnus-X1 脈衝星雲',
    distanceLY: 6100,
    baseBoostMultiplier: 3.5,
    idealPeriapsisKm: 120000,
    hazardRating: 'Moderate',
    description: '沿著天鵝座緻密星際磁力線切入，軌道平緩穩定，適合常規星際穿梭。',
    color: '#00e5ff'
  },
  galactic_core_chute: {
    id: 'galactic_core_chute',
    name: '銀心超引力滑道 (Galactic Core Chute)',
    destination: '人馬座 A* 銀心超大質量黑洞視界',
    distanceLY: 26000,
    baseBoostMultiplier: 5.2,
    idealPeriapsisKm: 45000,
    hazardRating: 'Extreme',
    description: '利用中央恆星群重疊引力深井，獲得全宇宙最強大的相對論彈弓初速。',
    color: '#ff0055'
  },
  orion_express: {
    id: 'orion_express',
    name: '獵戶懸臂快車道 (Orion Express)',
    destination: '參宿四超新星遺跡星區',
    distanceLY: 642,
    baseBoostMultiplier: 2.8,
    idealPeriapsisKm: 180000,
    hazardRating: 'Moderate',
    description: '貫穿獵戶座分子雲複合體的近距走廊，安全系數高，航程極短。',
    color: '#00ff88'
  },
  magellanic_bridge: {
    id: 'magellanic_bridge',
    name: '大麥哲倫深空躍遷橋 (Magellanic Bridge)',
    destination: '大麥哲倫星系外圍潮汐流',
    distanceLY: 163000,
    baseBoostMultiplier: 4.5,
    idealPeriapsisKm: 75000,
    hazardRating: 'High',
    description: '跨越銀河系暈輪的銀河際超長程重力牽引通道，需精準校準偏航角。',
    color: '#bd00ff'
  }
}

export class WormholeSlingshotEngine {
  public corridors: Record<CorridorId, SlingshotCorridor>
  public stats: SlingshotStats = {
    state: 'standby',
    activeCorridor: 'cygnus_corridor',
    periapsisRadiusKm: 120000,
    vectorAngleDeg: 0,
    currentVelocityC: 1.0,
    lorentzFactor: 1.0,
    burnProgress: 0,
    heatPercentage: 15,
    dysonResonanceActive: true,
    totalSlingshotsCompleted: 0,
    lastExitVelocityC: 0,
    statusMessage: '重力井彈弓導航儀就緒，請選擇走廊並校準近星點切入向量。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.corridors = JSON.parse(JSON.stringify(SLINGSHOT_CORRIDORS))
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

  // ── Controls ─────────────────────────────────────────────────────────────
  public selectCorridor(id: CorridorId): boolean {
    if (this.stats.state !== 'standby') return false
    const corridor = this.corridors[id]
    if (!corridor) return false
    this.stats.activeCorridor = id
    this.stats.periapsisRadiusKm = corridor.idealPeriapsisKm
    this.saveState()
    return true
  }

  public setPeriapsis(km: number): void {
    if (this.stats.state !== 'standby') return
    this.stats.periapsisRadiusKm = Math.max(30000, Math.min(300000, Math.round(km)))
    this.saveState()
  }

  public setPeriapsisRadius(km: number): void {
    this.setPeriapsis(km)
  }

  public setVectorAngle(deg: number): void {
    if (this.stats.state !== 'standby') return
    this.stats.vectorAngleDeg = Math.max(-45, Math.min(45, Math.round(deg)))
    this.saveState()
  }

  public initiateSlingshot(): boolean {
    if (this.stats.state !== 'standby') return false
    this.stats.state = 'approach'
    this.stats.burnProgress = 0
    this.stats.currentVelocityC = 1.2
    this.stats.statusMessage = '🚀 切入恆星重力井雙曲線軌道，姿態推進器開始同步引力場。'

    this.playGravityWellHum()
    this.saveState()
    return true
  }

  public abortSlingshot(): void {
    if (this.stats.state !== 'standby') {
      this.stats.state = 'standby'
      this.stats.burnProgress = 0
      this.stats.currentVelocityC = 1.0
      this.stats.statusMessage = '⚠️ 已緊急引導反向微調噴口脫離重力井，回歸待命狀態。'
      this.saveState()
    }
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    const corridor = this.corridors[this.stats.activeCorridor]
    if (!corridor) return

    if (this.stats.state === 'approach') {
      this.stats.burnProgress += delta * 20
      this.stats.currentVelocityC += delta * 1.5
      this.stats.heatPercentage = Math.min(80, this.stats.heatPercentage + delta * 8)

      if (this.stats.burnProgress >= 40) {
        this.stats.state = 'slingshot_burn'
        this.stats.statusMessage = '🔥 到達近星點！戴森球能量同調點火，重力彈弓全力加速！'
        this.playBurnIgnition()
      }
    } else if (this.stats.state === 'slingshot_burn') {
      this.stats.burnProgress += delta * 25
      const anglePenalty = 1 - Math.abs(this.stats.vectorAngleDeg) / 90
      const distRatio = corridor.idealPeriapsisKm / Math.max(30000, this.stats.periapsisRadiusKm)
      const boostRate = corridor.baseBoostMultiplier * anglePenalty * distRatio * (this.stats.dysonResonanceActive ? 1.5 : 1.0)
      this.stats.currentVelocityC += delta * boostRate * 4
      this.stats.heatPercentage = Math.min(100, this.stats.heatPercentage + delta * 12)

      // Calculate Lorentz factor γ
      const beta = Math.min(0.9999, (this.stats.currentVelocityC - 1) / (this.stats.currentVelocityC + 1))
      this.stats.lorentzFactor = Math.round((1 / Math.sqrt(Math.max(0.0001, 1 - beta * beta))) * 10) / 10

      if (this.stats.burnProgress >= 85) {
        this.stats.state = 'superluminal_exit'
        this.stats.lastExitVelocityC = Math.round(this.stats.currentVelocityC * 10) / 10
        this.stats.statusMessage = `⚡ 彈弓成功甩出！突破相對論極限以 ${this.stats.lastExitVelocityC}c 衝入超空間走廊！`
        this.stats.totalSlingshotsCompleted += 1

        // Achievements
        achievements.trackProgress('slingshot_navigator', 1)
        this.playSuperluminalBurst()
      }
    } else if (this.stats.state === 'superluminal_exit') {
      this.stats.burnProgress += delta * 15
      if (this.stats.burnProgress >= 100) {
        this.stats.state = 'cooldown'
        this.stats.burnProgress = 100
        this.stats.statusMessage = '🌌 抵達目標星區星門節點，熱量冷卻散熱中。'
      }
    } else if (this.stats.state === 'cooldown') {
      this.stats.heatPercentage = Math.max(15, this.stats.heatPercentage - delta * 15)
      this.stats.currentVelocityC = Math.max(1.0, this.stats.currentVelocityC - delta * 5)
      if (this.stats.heatPercentage <= 20) {
        this.stats.state = 'standby'
        this.stats.burnProgress = 0
        this.stats.statusMessage = '系統冷卻完畢，導航儀已復位待命。'
      }
    }
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playGravityWellHum(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(45, now)
    osc.frequency.linearRampToValueAtTime(75, now + 1.5)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.8)
  }

  public playBurnIgnition(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(90, now)
    osc.frequency.exponentialRampToValueAtTime(320, now + 1.2)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.2)
  }

  public playSuperluminalBurst(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(2400, now + 1.4)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.5)
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_slingshot_telemetry', JSON.stringify({
        stats: this.stats
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_slingshot_telemetry')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
          if (this.stats.state !== 'standby') {
            this.stats.state = 'standby'
          }
        }
      }
    } catch { /* ignore */ }
  }
}

export const wormholeSlingshot = new WormholeSlingshotEngine()
