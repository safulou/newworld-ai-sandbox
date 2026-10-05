/**
 * NewWorld AI Sandbox - Kardashev Scale Civilizational Metric & Transcendence Engine
 * 
 * Implements:
 * - Kardashev Civilizational Index calculation: K = (log10(PowerWatts) - 6) / 10
 * - Civilizational Tiers:
 *   Type 0 (< 1.0): Pre-Planetary Industrial Civilization
 *   Type I (1.00 - 1.99): Planetary Civilization (Mastery of planetary energy)
 *   Type II (2.00 - 2.99): Stellar Civilization (Mastery of stellar / Dyson energy)
 *   Type III (3.00 - 3.99): Galactic Civilization (Mastery of galactic hyper-grid)
 *   Type IV (>= 4.00): Multiversal Transcendent Entity (Singularity Ascension)
 * - 4 Civilizational Ascension Pillars:
 *   1. Planetary Climate Grid (全球氣候宏觀調控矩陣)
 *   2. Stellar CME Magnetic Shield (恆星日冕噴發約束罩)
 *   3. Galactic Hyper-Grid (銀河超空間即時星網)
 *   4. Singularity Ascension Core (超維度奇點超脫之門)
 * - Transcendence Ascension & Prestige reset mechanism (Transcendence Shards & permanent multiplier)
 * - Pure Web Audio procedural audio synthesis (Crystalline harmonic chords & ascension chimes)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type KardashevTierType = 'Type 0' | 'Type I' | 'Type II' | 'Type III' | 'Type IV'

export type AscensionPillarId = 'climate_grid' | 'stellar_shield' | 'hyper_grid' | 'ascension_core'

export interface AscensionPillar {
  id: AscensionPillarId
  name: string
  level: number
  maxLevel: number
  costWattsEquivalent: number
  bonusDesc: string
  unlocked: boolean
  icon: string
}

export interface KardashevStats {
  currentPowerWatts: number
  kardashevIndex: number
  tier: KardashevTierType
  tierTitle: string
  transcendenceShards: number
  ascensionCount: number
  globalPowerMultiplier: number
  ascensionReadinessPercent: number
  highestRecordedIndex: number
  statusMessage: string
}

export const INITIAL_PILLARS: Record<AscensionPillarId, AscensionPillar> = {
  climate_grid: {
    id: 'climate_grid',
    name: '全球氣候宏觀調控矩陣 (Climate Harmonizer)',
    level: 1,
    maxLevel: 10,
    costWattsEquivalent: 1e16,
    bonusDesc: '行星能源生產效率 +15% / 級，全天候生態穩定度提升',
    unlocked: true,
    icon: '🌍'
  },
  stellar_shield: {
    id: 'stellar_shield',
    name: '恆星日冕噴發約束罩 (Stellar CME Shield)',
    level: 0,
    maxLevel: 10,
    costWattsEquivalent: 1e22,
    bonusDesc: '戴森雲反射群能量捕獲 +20% / 級，抵禦恆星風暴侵蝕',
    unlocked: false,
    icon: '☀️'
  },
  hyper_grid: {
    id: 'hyper_grid',
    name: '銀河超空間即時星網 (Galactic Hyper-Grid)',
    level: 0,
    maxLevel: 10,
    costWattsEquivalent: 1e28,
    bonusDesc: '跨星系科研與星門過境收益 +25% / 級',
    unlocked: false,
    icon: '🌌'
  },
  ascension_core: {
    id: 'ascension_core',
    name: '超維度奇點超脫之門 (Singularity Ascension Core)',
    level: 0,
    maxLevel: 5,
    costWattsEquivalent: 1e33,
    bonusDesc: '解鎖奇點飛升超脫能力，每次飛升獲得超越星芒加成 +50%',
    unlocked: false,
    icon: '🔮'
  }
}

export class KardashevEngine {
  public stats: KardashevStats = {
    currentPowerWatts: 4.5e14, // Starts in Type 0.86
    kardashevIndex: 0.865,
    tier: 'Type 0',
    tierTitle: '地表前行星文明 (Pre-Planetary Civilization)',
    transcendenceShards: 0,
    ascensionCount: 0,
    globalPowerMultiplier: 1.0,
    ascensionReadinessPercent: 0,
    highestRecordedIndex: 0.865,
    statusMessage: '文明能量監控中，持續擴建地熱、戴森雲與奇點網絡以提高能階。'
  }

  public pillars: Record<AscensionPillarId, AscensionPillar> = JSON.parse(JSON.stringify(INITIAL_PILLARS))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.recalculateIndex()
  }

  // ── Calculation Logic ───────────────────────────────────────────────────────
  public recalculateIndex(): void {
    // K = (log10(Watts) - 6) / 10
    const rawWatts = Math.max(1e6, this.stats.currentPowerWatts * this.stats.globalPowerMultiplier)
    const k = (Math.log10(rawWatts) - 6) / 10
    this.stats.kardashevIndex = parseFloat(k.toFixed(3))

    if (this.stats.kardashevIndex > this.stats.highestRecordedIndex) {
      this.stats.highestRecordedIndex = this.stats.kardashevIndex
    }

    // Determine Tier
    if (k < 1.0) {
      this.stats.tier = 'Type 0'
      this.stats.tierTitle = '地表前行星文明 (Pre-Planetary Civilization)'
    } else if (k < 2.0) {
      this.stats.tier = 'Type I'
      this.stats.tierTitle = '行星全域統御文明 (Planetary Civilization)'
    } else if (k < 3.0) {
      this.stats.tier = 'Type II'
      this.stats.tierTitle = '恆星系巨構戴森文明 (Stellar Civilization)'
    } else if (k < 4.0) {
      this.stats.tier = 'Type III'
      this.stats.tierTitle = '銀河超空間網絡文明 (Galactic Civilization)'
    } else {
      this.stats.tier = 'Type IV'
      this.stats.tierTitle = '超維度奇點超脫神族 (Multiversal Entity)'
    }

    // Unlock pillars based on index
    if (this.stats.kardashevIndex >= 1.2) this.pillars.stellar_shield.unlocked = true
    if (this.stats.kardashevIndex >= 2.0) this.pillars.hyper_grid.unlocked = true
    if (this.stats.kardashevIndex >= 2.5) this.pillars.ascension_core.unlocked = true

    // Check Ascension Readiness
    const pillarTotalLevels = Object.values(this.pillars).reduce((acc, p) => acc + p.level, 0)
    const readiness = Math.min(100, Math.floor((this.stats.kardashevIndex / 2.5) * 60 + (pillarTotalLevels / 25) * 40))
    this.stats.ascensionReadinessPercent = readiness

    // Achievement Check
    if (this.stats.kardashevIndex >= 2.0 || this.stats.ascensionCount > 0) {
      achievements.unlock('kardashev_ascendant')
    }

    this.saveState()
  }

  // ── Sync External Megastructure Power ──────────────────────────────────────
  public feedExternalPower(sourceWatts: number): void {
    if (sourceWatts > 0) {
      this.stats.currentPowerWatts += sourceWatts
      this.recalculateIndex()
    }
  }

  public setBasePower(watts: number): void {
    this.stats.currentPowerWatts = Math.max(1e12, watts)
    this.recalculateIndex()
  }

  // ── Pillar Upgrade ─────────────────────────────────────────────────────────
  public upgradePillar(pillarId: AscensionPillarId): boolean {
    const pillar = this.pillars[pillarId]
    if (!pillar || !pillar.unlocked || pillar.level >= pillar.maxLevel) {
      return false
    }

    // Cost verification: Requires sufficient civilization energy output
    if (this.stats.currentPowerWatts < pillar.costWattsEquivalent * pillar.level) {
      this.stats.statusMessage = `文明能級不足，無法解鎖下一階【${pillar.name}】`
      return false
    }

    pillar.level++
    this.playPillarChime()
    this.stats.statusMessage = `已成功升級天梯支柱：【${pillar.name}】至 Lv.${pillar.level}`
    
    // Pillar perks apply to multiplier
    this.updateGlobalMultiplier()
    this.recalculateIndex()
    return true
  }

  private updateGlobalMultiplier(): void {
    let mult = 1.0 + (this.stats.ascensionCount * 0.5) + (this.stats.transcendenceShards * 0.1)
    mult += (this.pillars.climate_grid.level - 1) * 0.15
    mult += this.pillars.stellar_shield.level * 0.20
    mult += this.pillars.hyper_grid.level * 0.25
    mult += this.pillars.ascension_core.level * 0.50
    this.stats.globalPowerMultiplier = parseFloat(mult.toFixed(2))
  }

  // ── Transcendence Singularity Ascension ─────────────────────────────────────
  public triggerAscension(): boolean {
    if (this.stats.ascensionReadinessPercent < 100 || this.stats.kardashevIndex < 2.0) {
      this.stats.statusMessage = '奇點超越條件未滿足（需卡爾達肖夫指數 >= 2.0 且飛升完備度 100%）'
      return false
    }

    const earnedShards = Math.max(1, Math.floor((this.stats.kardashevIndex - 1.5) * 5) + this.pillars.ascension_core.level * 2)
    this.stats.transcendenceShards += earnedShards
    this.stats.ascensionCount++

    // Soft reset current power to baseline with higher multiplier
    this.stats.currentPowerWatts = 1e16 // Reset to pure Type I baseline
    this.stats.statusMessage = `✨ 文明飛升奇點達成！已成功超越至維度 ${this.stats.ascensionCount}，獲得 ${earnedShards} 顆超越星芒！`
    
    this.playAscensionHarmonics()
    achievements.unlock('kardashev_ascendant')
    this.updateGlobalMultiplier()
    this.recalculateIndex()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    // Passive organic expansion of civilization energy
    const passiveGrowth = 5e11 * delta * (1 + this.pillars.climate_grid.level * 0.1)
    this.stats.currentPowerWatts += passiveGrowth
    this.recalculateIndex()
  }

  // ── Web Audio Procedural Synthesis ─────────────────────────────────────────
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  public playPillarChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3) // C6

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  public playAscensionHarmonics(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    // Serene cosmic chord: C4, E4, G4, B4, D5 (Major 9th)
    const chord = [261.63, 329.63, 392.00, 493.88, 587.33]
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.12

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1.2)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_kardashev_v1', JSON.stringify({
        stats: this.stats,
        pillars: this.pillars
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_kardashev_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.pillars) {
          this.pillars = parsed.pillars
        }
      }
    } catch { /* ignore */ }
  }
}

export const kardashevEngine = new KardashevEngine()
