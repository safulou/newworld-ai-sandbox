/**
 * NewWorld AI Sandbox - Hyperjump Hyperspace Drive Engine
 * 
 * Implements:
 * - Starship Warp Drive Core & Antimatter Fuel capacitor telemetry
 * - Deep Space Star Sectors & Keplerian coordinates navigation
 * - Hyperspace jump lifecycle: idle -> charging -> in_warp (particle tunnel) -> arrival -> cooldown
 * - Pure Web Audio procedural audio synthesis (ramp charge, hyperspace tunnel drone, warp boom shockwave)
 * - Meta-universe achievement integration and client localStorage persistence
 */

import { achievements } from './achievements'

export interface StarSector {
  id: string
  name: string
  distanceLightSec: number
  coordinates: [number, number, number]
  description: string
  hazardLevel: 'Low' | 'Moderate' | 'Severe' | 'Extreme'
  resources: string[]
  color: string
  discovered: boolean
}

export type HyperjumpState = 'idle' | 'charging' | 'in_warp' | 'arrival' | 'cooldown'

export interface HyperjumpStats {
  state: HyperjumpState
  warpFactor: number           // 1x to 50x warp speed
  antimatterFuel: number       // 0 to 100%
  capacitorCharge: number      // 0 to 100%
  chargeProgress: number       // 0 to 100%
  warpProgress: number         // 0 to 100%
  cooldownRemaining: number    // seconds
  currentSectorId: string
  targetSectorId: string
  totalJumps: number
  lastJumpTime: number
}

export const STAR_SECTORS: StarSector[] = [
  {
    id: 'sector_sol',
    name: '太陽系新世界前哨 (NewWorld Solar Outpost)',
    distanceLightSec: 0,
    coordinates: [0, 0, 0],
    description: '母星近地軌道與微重力船塢總部，擁有穩定的量子通信與充沛能源。',
    hazardLevel: 'Low',
    resources: ['鈦合金結構體', '太陽能電池板', '純淨液態水'],
    color: '#00ffff',
    discovered: true,
  },
  {
    id: 'sector_cygnus',
    name: 'Cygnus-X1 脈衝星雲 (Cygnus Pulsar Nebula)',
    distanceLightSec: 9720,
    coordinates: [9200, 450, -3100],
    description: '高能脈衝星輻射交織的電離星雲，富含電漿反物質與高密質子流。',
    hazardLevel: 'Moderate',
    resources: ['電漿反物質雲', '高能質子核', '脈衝星磁晶'],
    color: '#ff00aa',
    discovered: false,
  },
  {
    id: 'sector_kepler',
    name: 'Kepler 深空殘骸環 (Kepler Debris Ring)',
    distanceLightSec: 12280,
    coordinates: [-4200, 880, 11500],
    description: '遠古先祖星艦艦隊交戰遺留之巨型金屬殘骸帶，充斥強烈引力碎屑。',
    hazardLevel: 'Severe',
    resources: ['先祖星艦合金', '折躍環超導線圈', '加密記憶晶體'],
    color: '#ffaa00',
    discovered: false,
  },
  {
    id: 'sector_horizon',
    name: 'Event Horizon 虛空黑洞視界 (Event Horizon Singularity)',
    distanceLightSec: 25045,
    coordinates: [0, -1500, -25000],
    description: '超大質量黑洞吸積盤邊緣，四維時空曲率極限撕裂，產生物理法則奇異點。',
    hazardLevel: 'Extreme',
    resources: ['奇異點量子核', '暗物質引力微胞', '時空畸變拓撲體'],
    color: '#aa00ff',
    discovered: false,
  },
  {
    id: 'sector_omega',
    name: 'Neon-Omega 遠古外星母星 (Neon-Omega Progenitor)',
    distanceLightSec: 19250,
    coordinates: [18000, 2200, 6400],
    description: '籠罩在全息以太極光中的失落第十文明母星，蘊藏超光速曲率古籍。',
    hazardLevel: 'Severe',
    resources: ['超維度以太結晶', '外星神經矩陣', '先驅者核心'],
    color: '#00ff88',
    discovered: false,
  },
]

export class HyperjumpDriveEngine {
  public sectors: StarSector[] = JSON.parse(JSON.stringify(STAR_SECTORS))
  public stats: HyperjumpStats = {
    state: 'idle',
    warpFactor: 10,
    antimatterFuel: 85,
    capacitorCharge: 100,
    chargeProgress: 0,
    warpProgress: 0,
    cooldownRemaining: 0,
    currentSectorId: 'sector_sol',
    targetSectorId: 'sector_cygnus',
    totalJumps: 0,
    lastJumpTime: 0,
  }

  private audioCtx: AudioContext | null = null
  private chargeDuration: number = 3.0    // 3 seconds charge
  private warpDuration: number = 4.5      // 4.5 seconds hyperspace transit
  private cooldownDuration: number = 6.0  // 6 seconds cooldown
  private stateTimer: number = 0

  constructor() {
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.audioCtx = new AudioCtx()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public selectDestination(sectorId: string): boolean {
    if (this.stats.state !== 'idle' && this.stats.state !== 'cooldown') return false
    const target = this.sectors.find(s => s.id === sectorId)
    if (!target) return false
    this.stats.targetSectorId = sectorId
    this.saveState()
    return true
  }

  public setWarpFactor(factor: number): void {
    if (this.stats.state !== 'idle') return
    this.stats.warpFactor = Math.min(50, Math.max(1, factor))
  }

  public refuelAntimatter(amount: number = 25): void {
    this.stats.antimatterFuel = Math.min(100, this.stats.antimatterFuel + amount)
    this.saveState()
  }

  public initiateJump(): { success: boolean; message: string } {
    if (this.stats.state !== 'idle') {
      return { success: false, message: `曲率引擎目前處於 ${this.stats.state} 狀態，無法重複點火。` }
    }
    if (this.stats.currentSectorId === this.stats.targetSectorId) {
      return { success: false, message: '目標星系與當前所在星系相同，請選擇新的深空象限。' }
    }
    const fuelNeeded = Math.round(15 * (this.stats.warpFactor / 10))
    if (this.stats.antimatterFuel < fuelNeeded) {
      return { success: false, message: `反物質燃料不足！本次跳躍需 ${fuelNeeded}%，現有 ${this.stats.antimatterFuel}%。` }
    }
    if (this.stats.capacitorCharge < 50) {
      return { success: false, message: '曲率電容尚未完全充滿，請稍候重試。' }
    }

    // Start charging sequence
    this.stats.state = 'charging'
    this.stats.chargeProgress = 0
    this.stateTimer = 0
    this.playWarpChargeAudio()

    return { success: true, message: `曲率躍遷啟動！目標：${this.getCurrentTarget()?.name}，曲率倍率 ${this.stats.warpFactor}x。` }
  }

  public abortJump(): boolean {
    if (this.stats.state === 'charging') {
      this.stats.state = 'idle'
      this.stats.chargeProgress = 0
      this.stateTimer = 0
      return true
    }
    return false
  }

  public update(delta: number): void {
    if (delta <= 0) return

    // Natural capacitor trickle recharging
    if (this.stats.capacitorCharge < 100 && this.stats.state !== 'charging') {
      this.stats.capacitorCharge = Math.min(100, this.stats.capacitorCharge + delta * 5)
    }

    switch (this.stats.state) {
      case 'charging': {
        this.stateTimer += delta
        this.stats.chargeProgress = Math.min(100, (this.stateTimer / this.chargeDuration) * 100)
        if (this.stateTimer >= this.chargeDuration) {
          // Transition to in_warp
          const fuelNeeded = Math.round(15 * (this.stats.warpFactor / 10))
          this.stats.antimatterFuel = Math.max(0, this.stats.antimatterFuel - fuelNeeded)
          this.stats.capacitorCharge = Math.max(0, this.stats.capacitorCharge - 60)
          this.stats.state = 'in_warp'
          this.stats.warpProgress = 0
          this.stateTimer = 0
          this.playWarpBoomAudio()
        }
        break
      }
      case 'in_warp': {
        this.stateTimer += delta
        this.stats.warpProgress = Math.min(100, (this.stateTimer / this.warpDuration) * 100)
        if (this.stateTimer >= this.warpDuration) {
          // Arrival
          this.stats.state = 'arrival'
          this.stats.currentSectorId = this.stats.targetSectorId
          this.stats.totalJumps++
          this.stats.lastJumpTime = Date.now()

          // Discover destination
          const dest = this.sectors.find(s => s.id === this.stats.currentSectorId)
          if (dest) dest.discovered = true

          this.playArrivalChime()
          achievements.unlock('hyperjump_voyager')
          this.stateTimer = 0
          this.saveState()
        }
        break
      }
      case 'arrival': {
        this.stateTimer += delta
        if (this.stateTimer >= 1.5) {
          // Transition to cooldown
          this.stats.state = 'cooldown'
          this.stats.cooldownRemaining = this.cooldownDuration
          this.stateTimer = 0
        }
        break
      }
      case 'cooldown': {
        this.stats.cooldownRemaining = Math.max(0, this.stats.cooldownRemaining - delta)
        if (this.stats.cooldownRemaining <= 0) {
          this.stats.state = 'idle'
          this.saveState()
        }
        break
      }
    }
  }

  public getCurrentSector(): StarSector | undefined {
    return this.sectors.find(s => s.id === this.stats.currentSectorId)
  }

  public getCurrentTarget(): StarSector | undefined {
    return this.sectors.find(s => s.id === this.stats.targetSectorId)
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playWarpChargeAudio(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + this.chargeDuration)

    // Pulsing volume gain
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.25, now + this.chargeDuration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + this.chargeDuration)
  }

  public playWarpBoomAudio(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Sub-bass drop
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(180, now)
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2)

    subGain.gain.setValueAtTime(0.4, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 1.2)

    // White noise explosion burst
    try {
      const bufferSize = ctx.sampleRate * 0.8
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2))
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2400, now)
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.8)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.3, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)

      noise.start(now)
      noise.stop(now + 0.8)
    } catch {
      // Audio buffer fallback
    }
  }

  public playArrivalChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Major Arpeggio)
    const now = ctx.currentTime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.12

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.8)
    })
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_hyperjump')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) Object.assign(this.stats, parsed.stats)
        if (parsed.sectors && Array.isArray(parsed.sectors)) {
          for (const s of parsed.sectors) {
            const match = this.sectors.find(x => x.id === s.id)
            if (match) match.discovered = !!s.discovered
          }
        }
      }
    } catch {
      // Ignore load error
    }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const payload = {
        stats: {
          warpFactor: this.stats.warpFactor,
          antimatterFuel: this.stats.antimatterFuel,
          capacitorCharge: this.stats.capacitorCharge,
          currentSectorId: this.stats.currentSectorId,
          targetSectorId: this.stats.targetSectorId,
          totalJumps: this.stats.totalJumps,
          lastJumpTime: this.stats.lastJumpTime,
        },
        sectors: this.sectors.map(s => ({ id: s.id, discovered: s.discovered })),
      }
      localStorage.setItem('nw_hyperjump', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const hyperjumpDrive = new HyperjumpDriveEngine()
