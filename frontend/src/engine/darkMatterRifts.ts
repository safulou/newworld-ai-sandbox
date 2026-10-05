/**
 * NewWorld AI Sandbox - Quantum Dark Matter Spatial Rift Exploration Engine
 * 
 * Implements:
 * - High-frequency quantum phase resonance tuning (100 MHz ~ 999 MHz) to tear open spatial rifts
 * - 4 Dark Matter Rift Dimensions (Entropy Void, Time Crystal Cavern, Antimatter Abyss, Zero-Point Singularity)
 * - Environmental radiation dosage & hazard telemetry (Suit Shield absorption, Geiger clicks, Coolant stabilization)
 * - Rift mineral harvesting & spatial anomaly interaction (Time Crystals, Dark Matter Motes, Void Serpent scales)
 * - Pure Web Audio procedural audio synthesis (Sub-harmonic phase hum, space-tear scream, crystal chimes, Geiger counter)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type RiftDimensionId = 'entropy_void' | 'time_crystal_cavern' | 'antimatter_abyss' | 'zero_point_singularity'

export interface RiftDimension {
  id: RiftDimensionId
  name: string
  subTitle: string
  optimalFrequencyMHz: number
  ambientRadiation: number // Rads/sec
  color: string
  description: string
  mythicDrops: string[]
}

export interface RiftMineralNode {
  id: string
  name: string
  mineralType: 'dark_matter' | 'time_crystal' | 'antimatter_cell' | 'zero_point_core'
  integrity: number // 0 to 100%
  extracted: boolean
  value: number
  icon: string
}

export interface RiftStats {
  isRiftOpen: boolean
  activeDimension: RiftDimensionId | null
  currentFrequencyMHz: number
  riftStability: number     // 0 to 100%
  radiationLevel: number    // 0 to 100%
  suitShield: number        // 0 to 1000
  maxSuitShield: number
  coolantPacks: number      // inventory
  darkMatterHarvested: number
  timeCrystalsHarvested: number
  coresExtracted: number
  totalRiftsStabilized: number
  statusMessage: string
}

export const RIFT_DIMENSIONS: Record<RiftDimensionId, RiftDimension> = {
  entropy_void: {
    id: 'entropy_void',
    name: '熵增虛空維度 (Entropy Void)',
    subTitle: '低溫分子凍結與暗物質織網',
    optimalFrequencyMHz: 432,
    ambientRadiation: 12,
    color: '#00e5ff',
    description: '熱力學第二定律在此失效的極限虛空，懸浮著由暗物質微胞構成的發光網狀聚合體。',
    mythicDrops: ['暗物質微胞', '虛空晶屑', '熵化織網']
  },
  time_crystal_cavern: {
    id: 'time_crystal_cavern',
    name: '時間晶體洞窟 (Time Crystal Cavern)',
    subTitle: '離散時空四維時間晶格結構',
    optimalFrequencyMHz: 528,
    ambientRadiation: 22,
    color: '#bd00ff',
    description: '在時間維度週期性重構的時空洞窟，可採集突破相對論限制的自旋時間晶體。',
    mythicDrops: ['四維時間晶石', '鐘慢流體', '光錐碎片']
  },
  antimatter_abyss: {
    id: 'antimatter_abyss',
    name: '反物質湮滅海 (Antimatter Abyss)',
    subTitle: '正反粒子臨界湮滅等離子海',
    optimalFrequencyMHz: 741,
    ambientRadiation: 35,
    color: '#ffaa00',
    description: '充斥高能伽馬射線與反質子流的狂暴深淵，需極度警惕外骨骼抗輻射防護盾完整度。',
    mythicDrops: ['反物質微粒原核', '湮滅超導板', '正電子阱']
  },
  zero_point_singularity: {
    id: 'zero_point_singularity',
    name: '零點奇點極限 (Zero-Point Singularity)',
    subTitle: '量子真空零點能源核心裂隙',
    optimalFrequencyMHz: 852,
    ambientRadiation: 50,
    color: '#ff0055',
    description: '時空幾何徹底瓦解的引力奇異點邊界，蘊藏全宇宙最崇高的零點真空能源。',
    mythicDrops: ['零點真空核', '奇異點黑洞珍珠', '時空弦碎片']
  }
}

export class DarkMatterRiftsEngine {
  public dimensions: Record<RiftDimensionId, RiftDimension>
  public mineralNodes: RiftMineralNode[] = []
  public stats: RiftStats = {
    isRiftOpen: false,
    activeDimension: null,
    currentFrequencyMHz: 400,
    riftStability: 0,
    radiationLevel: 0,
    suitShield: 1000,
    maxSuitShield: 1000,
    coolantPacks: 5,
    darkMatterHarvested: 0,
    timeCrystalsHarvested: 0,
    coresExtracted: 0,
    totalRiftsStabilized: 0,
    statusMessage: '量子信標暗物質相位調諧器待命中，請設定共振頻率。'
  }

  private audioCtx: AudioContext | null = null
  private lastUpdate = 0

  constructor() {
    this.dimensions = JSON.parse(JSON.stringify(RIFT_DIMENSIONS))
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

  // ── Frequency & Tuning Controls ──────────────────────────────────────────
  public setFrequency(freq: number): void {
    this.stats.currentFrequencyMHz = Math.max(100, Math.min(999, Math.round(freq)))
    this.playTuningTone(this.stats.currentFrequencyMHz)

    // Calculate stability against the closest dimension
    let matched: RiftDimensionId | null = null
    let minDiff = Infinity
    for (const [id, dim] of Object.entries(this.dimensions) as [RiftDimensionId, RiftDimension][]) {
      const diff = Math.abs(dim.optimalFrequencyMHz - this.stats.currentFrequencyMHz)
      if (diff < minDiff) {
        minDiff = diff
        matched = id
      }
    }

    if (matched && minDiff <= 25) {
      this.stats.riftStability = Math.round(Math.max(0, 100 - minDiff * 4))
      this.stats.statusMessage = `✨ 捕捉到相位共振頻率！[${this.dimensions[matched].name}] 空間穩定度 ${this.stats.riftStability}%`
    } else {
      this.stats.riftStability = Math.max(0, this.stats.riftStability - 10)
      this.stats.statusMessage = '調諧中：無明顯暗物質共振信號，請繼續調整頻率...'
    }

    this.saveState()
  }

  public stabilizeAndOpenRift(dimensionId: RiftDimensionId): boolean {
    const dim = this.dimensions[dimensionId]
    if (!dim) return false

    // Align to target frequency
    this.stats.currentFrequencyMHz = dim.optimalFrequencyMHz
    this.stats.riftStability = 100
    this.stats.isRiftOpen = true
    this.stats.activeDimension = dimensionId
    this.stats.radiationLevel = 0
    this.stats.suitShield = this.stats.maxSuitShield
    this.stats.totalRiftsStabilized += 1
    this.stats.statusMessage = `🌀 空間裂隙已強行撕開！進入 [${dim.name}]，請注意外骨骼防輻射護盾。`

    this.spawnMineralNodes(dimensionId)
    this.playSpatialTear()
    this.saveState()
    return true
  }

  public exitRift(): void {
    this.stats.isRiftOpen = false
    this.stats.activeDimension = null
    this.stats.radiationLevel = 0
    this.stats.statusMessage = '已安全撤回常態時空。'
    this.saveState()
  }

  // ── In-Rift Operations ───────────────────────────────────────────────────
  private spawnMineralNodes(dimensionId: RiftDimensionId): void {
    const dim = this.dimensions[dimensionId]
    this.mineralNodes = [
      {
        id: 'node_1',
        name: `${dim.name} 暗物質聚合塊`,
        mineralType: 'dark_matter',
        integrity: 100,
        extracted: false,
        value: 120,
        icon: '🌌'
      },
      {
        id: 'node_2',
        name: '自旋四維時間晶簇',
        mineralType: 'time_crystal',
        integrity: 100,
        extracted: false,
        value: 180,
        icon: '💎'
      },
      {
        id: 'node_3',
        name: '反質子高能微胞',
        mineralType: 'antimatter_cell',
        integrity: 100,
        extracted: false,
        value: 240,
        icon: '⚡'
      },
      {
        id: 'node_4',
        name: '零點真空奇異點核心',
        mineralType: 'zero_point_core',
        integrity: 100,
        extracted: false,
        value: 500,
        icon: '🔮'
      }
    ]
  }

  public extractMineralNode(nodeId: string): boolean {
    if (!this.stats.isRiftOpen) return false
    const node = this.mineralNodes.find(n => n.id === nodeId)
    if (!node || node.extracted) return false

    node.integrity -= 50
    this.playCrystalHarvest()

    if (node.integrity <= 0) {
      node.integrity = 0
      node.extracted = true
      if (node.mineralType === 'dark_matter') {
        this.stats.darkMatterHarvested += node.value
      } else if (node.mineralType === 'time_crystal') {
        this.stats.timeCrystalsHarvested += node.value
      } else {
        this.stats.coresExtracted += 1
      }
      this.stats.statusMessage = `⛏️ 成功採集 [${node.name}]！收穫稀有神話物質。`

      // Achievements
      achievements.trackProgress('rift_walker', 1)
    } else {
      this.stats.statusMessage = `⛏️ 開採脈衝激發：[${node.name}] 結構剩餘 ${node.integrity}%`
    }

    this.saveState()
    return true
  }

  public useCoolantPack(): boolean {
    if (this.stats.coolantPacks <= 0) return false
    this.stats.coolantPacks -= 1
    this.stats.radiationLevel = Math.max(0, this.stats.radiationLevel - 40)
    this.stats.suitShield = Math.min(this.stats.maxSuitShield, this.stats.suitShield + 500)
    this.stats.statusMessage = '🧪 注入抗輻射超導冷卻劑：輻射降低 -40%，外骨骼護盾充能 +500！'
    this.saveState()
    return true
  }

  public craftCoolantPack(): boolean {
    if (this.stats.darkMatterHarvested < 50) return false
    this.stats.darkMatterHarvested -= 50
    this.stats.coolantPacks += 1
    this.stats.statusMessage = '🛠️ 消耗 50 單位暗物質合成了 1 支抗輻射超導冷卻劑。'
    this.saveState()
    return true
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.lastUpdate < 300) return
    this.lastUpdate = now

    if (this.stats.isRiftOpen && this.stats.activeDimension) {
      const dim = this.dimensions[this.stats.activeDimension]
      const radIncrease = dim.ambientRadiation * delta * 0.4
      this.stats.radiationLevel = Math.min(100, this.stats.radiationLevel + radIncrease)

      // Shield decays if radiation > 30%
      if (this.stats.radiationLevel > 30) {
        const shieldDecay = (this.stats.radiationLevel - 30) * delta * 1.5
        this.stats.suitShield = Math.max(0, this.stats.suitShield - shieldDecay)
        this.playGeigerClick()
      }

      if (this.stats.suitShield <= 0 && this.stats.radiationLevel >= 95) {
        this.stats.statusMessage = '⚠️ 外骨骼防輻射護盾歸零！強行觸發緊急相位回傳保護。'
        this.exitRift()
      }
    }
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playTuningTone(freq: number): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    // Map MHz range 100~999 to Audible Hz 200~1200
    const audibleFreq = 200 + (freq - 100) * 1.11
    osc.frequency.setValueAtTime(audibleFreq, now)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  }

  public playSpatialTear(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.6)
    osc.frequency.exponentialRampToValueAtTime(120, now + 1.2)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.2)
  }

  public playCrystalHarvest(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [659.25, 880, 1174.66, 1760] // E minor high shimmer
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.05
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.15, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.35)
    })
  }

  public playGeigerClick(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, now)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_dark_matter_rifts', JSON.stringify({
        stats: this.stats,
        mineralNodes: this.mineralNodes
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_dark_matter_rifts')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
          if (this.stats.isRiftOpen && !this.stats.activeDimension) {
            this.stats.isRiftOpen = false
          }
        }
        if (parsed.mineralNodes) {
          this.mineralNodes = parsed.mineralNodes
        }
      }
    } catch { /* ignore */ }
  }
}

export const darkMatterRifts = new DarkMatterRiftsEngine()
