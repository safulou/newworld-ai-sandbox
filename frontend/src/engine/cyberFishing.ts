import { achievements } from './achievements'

export type FishRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface FishSpecies {
  id: string
  name: string
  scientificName: string
  rarity: FishRarity
  icon: string
  color: string
  description: string
  minWeightKg: number
  maxWeightKg: number
  minLengthCm: number
  maxLengthCm: number
  catchChance: number
  difficulty: number // 1 (easy) to 5 (legendary)
}

export interface FishRecord {
  speciesId: string
  caughtCount: number
  maxWeightKg: number
  maxLengthCm: number
  firstCaughtTimestamp: number
}

export type FishingState = 'idle' | 'casting' | 'waiting' | 'nibble' | 'hooked' | 'caught' | 'escaped'

export const FISH_SPECIES: Record<string, FishSpecies> = {
  plasma_eel: {
    id: 'plasma_eel',
    name: '等離子電鰻',
    scientificName: 'Electrophorus cyberneticus',
    rarity: 'common',
    icon: '⚡',
    color: '#00ffff',
    description: '體表流淌著 120V 高頻微脈衝電漿，常見於都市水冷循環渠與霓虹湖泊。',
    minWeightKg: 1.2,
    maxWeightKg: 4.8,
    minLengthCm: 60,
    maxLengthCm: 140,
    catchChance: 35,
    difficulty: 1.2,
  },
  cyber_coelacanth: {
    id: 'cyber_coelacanth',
    name: '賽博腔棘魚',
    scientificName: 'Latimeria mechanica',
    rarity: 'uncommon',
    icon: '🐟',
    color: '#3b82f6',
    description: '活化石骨骼覆蓋奈米鈦合金鱗片，在深水區緩慢悠游。',
    minWeightKg: 8.5,
    maxWeightKg: 28.0,
    minLengthCm: 90,
    maxLengthCm: 180,
    catchChance: 25,
    difficulty: 1.8,
  },
  pulse_puffer: {
    id: 'pulse_puffer',
    name: '脈衝充能河豚',
    scientificName: 'Tetraodontidae pulsaris',
    rarity: 'uncommon',
    icon: '🐡',
    color: '#10b981',
    description: '受到刺激時會膨脹並發射電磁脈衝 (EMP)，能短暫癱瘓附近電子感測器。',
    minWeightKg: 0.8,
    maxWeightKg: 3.5,
    minLengthCm: 25,
    maxLengthCm: 65,
    catchChance: 20,
    difficulty: 2.0,
  },
  quantum_koi: {
    id: 'quantum_koi',
    name: '量子錦鯉',
    scientificName: 'Cyprinus quantus',
    rarity: 'rare',
    icon: '🎏',
    color: '#a855f7',
    description: '處於波粒二象性疊加態的神奇生物，鱗光會在紫羅蘭色與深粉色間躍變。',
    minWeightKg: 2.0,
    maxWeightKg: 7.2,
    minLengthCm: 40,
    maxLengthCm: 90,
    catchChance: 12,
    difficulty: 2.6,
  },
  neon_chromasquid: {
    id: 'neon_chromasquid',
    name: '霓虹幻彩烏賊',
    scientificName: 'Teuthida chromata',
    rarity: 'rare',
    icon: '🦑',
    color: '#ec4899',
    description: '能以高達每秒 60 幀頻率變換體表全息光澤，以光影誘捕浮游體素。',
    minWeightKg: 3.5,
    maxWeightKg: 12.0,
    minLengthCm: 50,
    maxLengthCm: 130,
    catchChance: 10,
    difficulty: 3.0,
  },
  mecha_shark: {
    id: 'mecha_shark',
    name: '機甲巡弋鯊',
    scientificName: 'Carcharodon mechatronicus',
    rarity: 'epic',
    icon: '🦈',
    color: '#64748b',
    description: '配備流線型碳化鎢導流鰭與水下聲納，擁有極強的咬合力與拉扯爆發。',
    minWeightKg: 45.0,
    maxWeightKg: 180.0,
    minLengthCm: 180,
    maxLengthCm: 320,
    catchChance: 5,
    difficulty: 3.8,
  },
  void_anglerfish: {
    id: 'void_anglerfish',
    name: '虛空晶鬚鮟鱇',
    scientificName: 'Lophius vacuumensis',
    rarity: 'epic',
    icon: '🎣',
    color: '#9333ea',
    description: '頭頂懸吊著一顆微縮紫水晶奇點發光擬餌，生活在深空浮島虛空水潭深處。',
    minWeightKg: 15.0,
    maxWeightKg: 55.0,
    minLengthCm: 80,
    maxLengthCm: 170,
    catchChance: 4,
    difficulty: 4.2,
  },
  crystal_sea_dragon: {
    id: 'crystal_sea_dragon',
    name: '晶核深淵海龍皇',
    scientificName: 'Phycodurus draconis crystallus',
    rarity: 'legendary',
    icon: '🐉',
    color: '#f59e0b',
    description: '元宇宙傳說級神獸，身軀由高純度結晶體與電漿熔岩凝結而成，極為罕見。',
    minWeightKg: 80.0,
    maxWeightKg: 350.0,
    minLengthCm: 250,
    maxLengthCm: 500,
    catchChance: 2,
    difficulty: 5.0,
  },
}

export class CyberFishingEngine {
  public state: FishingState = 'idle'
  public currentTargetFish: FishSpecies | null = null
  public lineTension: number = 50 // 0 to 100
  public reelProgress: number = 20 // 0 to 100
  public sweetZoneMin: number = 38
  public sweetZoneMax: number = 72
  public lastCaughtFish: {
    species: FishSpecies
    weightKg: number
    lengthCm: number
  } | null = null

  private biteTimeoutId: number | null = null
  private nibbleTimeoutId: number | null = null
  private codex: Map<string, FishRecord> = new Map()
  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadCodex()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public playCastSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  public playBiteAlert(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.setValueAtTime(1320, now + 0.1)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  public playReelClick(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(1200, now)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)
  }

  public playLineSnap(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  public playCatchSuccess(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [523.25, 659.25, 783.99, 1046.5]
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      gain.gain.setValueAtTime(0.18, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.45)
    })
  }

  /**
   * Cast rod into water
   */
  public castRod(): void {
    this.clearTimers()
    this.state = 'waiting'
    this.playCastSound()

    // Random bite interval between 1.8s and 4.2s
    const biteDelay = 1800 + Math.random() * 2400
    this.biteTimeoutId = setTimeout(() => {
      this.triggerBite()
    }, biteDelay) as unknown as number
  }

  private triggerBite(): void {
    if (this.state !== 'waiting') return
    this.state = 'nibble'
    this.playBiteAlert()

    // Player has 2.2 seconds to react
    this.nibbleTimeoutId = setTimeout(() => {
      if (this.state === 'nibble') {
        this.state = 'escaped'
        this.playLineSnap()
      }
    }, 2200) as unknown as number
  }

  /**
   * Player hooks the line during nibble
   */
  public hookLine(): boolean {
    if (this.state !== 'nibble') {
      if (this.state === 'waiting') {
        // Pulled too early
        this.clearTimers()
        this.state = 'escaped'
        this.playLineSnap()
      }
      return false
    }

    this.clearTimers()
    this.currentTargetFish = this.selectRandomSpecies()
    this.lineTension = 50
    this.reelProgress = 25
    this.state = 'hooked'
    return true
  }

  /**
   * Updates line physics, reeling tension, and progress
   */
  public updateReeling(delta: number, isReeling: boolean): void {
    if (this.state !== 'hooked' || !this.currentTargetFish) return

    const difficulty = this.currentTargetFish.difficulty

    // Player action effect
    if (isReeling) {
      this.lineTension += 42 * delta
      this.playReelClick()
    } else {
      this.lineTension -= 26 * delta
    }

    // Fish thrashing movement
    const fishPull = Math.sin(performance.now() * 0.005 * difficulty) * (25 * difficulty) * delta
    this.lineTension += fishPull
    this.lineTension = Math.max(0, Math.min(100, this.lineTension))

    // Sweet zone checking
    const inSweetZone = this.lineTension >= this.sweetZoneMin && this.lineTension <= this.sweetZoneMax
    if (inSweetZone) {
      this.reelProgress += (26 / Math.sqrt(difficulty)) * delta
    } else if (this.lineTension > 85 || this.lineTension < 20) {
      this.reelProgress -= 16 * delta
    }

    // Check line break
    if (this.lineTension >= 100) {
      this.state = 'escaped'
      this.playLineSnap()
      return
    }

    // Check fish got away
    if (this.reelProgress <= 0) {
      this.state = 'escaped'
      this.playLineSnap()
      return
    }

    // Check catch complete!
    if (this.reelProgress >= 100) {
      this.completeCatch()
    }
  }

  private completeCatch(): void {
    if (!this.currentTargetFish) return

    const sp = this.currentTargetFish
    const weight = +(sp.minWeightKg + Math.random() * (sp.maxWeightKg - sp.minWeightKg)).toFixed(2)
    const length = Math.round(sp.minLengthCm + Math.random() * (sp.maxLengthCm - sp.minLengthCm))

    this.lastCaughtFish = {
      species: sp,
      weightKg: weight,
      lengthCm: length,
    }

    this.recordCatch(sp.id, weight, length)
    this.state = 'caught'
    this.playCatchSuccess()

    achievements.unlock('cyber_angler')

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fish-caught', {
          detail: {
            species: sp,
            weightKg: weight,
            lengthCm: length,
          },
        })
      )
    }
  }

  public reset(): void {
    this.clearTimers()
    this.state = 'idle'
    this.currentTargetFish = null
    this.lineTension = 50
    this.reelProgress = 20
  }

  private selectRandomSpecies(): FishSpecies {
    const list = Object.values(FISH_SPECIES)
    const totalWeight = list.reduce((sum, f) => sum + f.catchChance, 0)
    let rand = Math.random() * totalWeight
    for (const f of list) {
      if (rand < f.catchChance) {
        return f
      }
      rand -= f.catchChance
    }
    return list[0]
  }

  private recordCatch(speciesId: string, weight: number, length: number): void {
    const existing = this.codex.get(speciesId)
    if (existing) {
      existing.caughtCount += 1
      existing.maxWeightKg = Math.max(existing.maxWeightKg, weight)
      existing.maxLengthCm = Math.max(existing.maxLengthCm, length)
    } else {
      this.codex.set(speciesId, {
        speciesId,
        caughtCount: 1,
        maxWeightKg: weight,
        maxLengthCm: length,
        firstCaughtTimestamp: Date.now(),
      })
    }
    this.saveCodex()
  }

  private loadCodex(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_fish_codex')
      if (data) {
        const parsed = JSON.parse(data)
        Object.entries(parsed).forEach(([k, v]) => {
          this.codex.set(k, v as FishRecord)
        })
      }
    } catch {
      // Ignored
    }
  }

  private saveCodex(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const obj: Record<string, FishRecord> = {}
      for (const [k, v] of this.codex.entries()) {
        obj[k] = v
      }
      localStorage.setItem('cyber_fish_codex', JSON.stringify(obj))
    } catch {
      // Ignored
    }
  }

  public getCodexRecord(speciesId: string): FishRecord | undefined {
    return this.codex.get(speciesId)
  }

  public getAllRecords(): Record<string, FishRecord> {
    const obj: Record<string, FishRecord> = {}
    for (const [k, v] of this.codex.entries()) {
      obj[k] = v
    }
    return obj
  }

  public getDiscoveredCount(): number {
    return this.codex.size
  }

  public getTotalCaughtCount(): number {
    let sum = 0
    for (const r of this.codex.values()) {
      sum += r.caughtCount
    }
    return sum
  }

  public clearTimers(): void {
    if (this.biteTimeoutId !== null) {
      clearTimeout(this.biteTimeoutId)
      this.biteTimeoutId = null
    }
    if (this.nibbleTimeoutId !== null) {
      clearTimeout(this.nibbleTimeoutId)
      this.nibbleTimeoutId = null
    }
  }
}

export const cyberFishing = new CyberFishingEngine()
