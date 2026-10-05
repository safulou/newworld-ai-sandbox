/**
 * NewWorld AI Sandbox - Black Hole Event Horizon & Gravitational Singularity Extractor Engine
 * 
 * Implements:
 * - Relativistic Kerr Rotating Black Hole physics simulation (Schwarzschild radius, Ergosphere, Frame Dragging)
 * - Penrose Process energy extraction (tapping rotational energy of black hole ergosphere)
 * - Hawking radiation flux absorption & quantum singularity condensation
 * - 4 Extraction Tiers:
 *   1. Kerr Ergosphere Magnetic Tap (柯爾黑洞能層磁力擷取陣)
 *   2. Hawking Flux Absorption Sail (霍金輻射收集帆)
 *   3. Gravitational Wave Resonance Dynamo (引力波共振發電機)
 *   4. Quantum Singularity Quark Condenser (奇點夸克濃縮器)
 * - Thermal runaway & event horizon proximity warning
 * - Pure Web Audio procedural audio synthesis (Event horizon infrasound rumble, Penrose arc discharge, Hawking particle burst)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type ExtractorTierId = 'ergosphere_tap' | 'hawking_sail' | 'grav_wave_dynamo' | 'singularity_condenser'

export interface ExtractorTier {
  id: ExtractorTierId
  name: string
  powerOutputMW: number
  singularityMatterPerSec: number
  heatGenerationPerSec: number
  costCredits: number
  isUnlocked: boolean
  level: number
  description: string
  color: string
}

export interface SingularityStats {
  blackHoleMassSolar: number      // e.g. 4.1 million solar masses (Sagittarius A*)
  eventHorizonRadiusKm: number    // Schwarzschild radius Rs
  ergosphereRadiusKm: number      // Ergosphere outer boundary
  spinParameterA: number          // Dimensionless spin 0.0 ~ 0.998
  proximityRadiusKm: number       // Current probe/station distance
  totalExtractedPowerMW: number
  totalSingularityMatter: number
  coolingEfficiencyPercent: number
  coreTemperatureK: number
  dangerLevel: 'Safe' | 'Warning' | 'Critical Overheat' | 'Horizon Breach'
  isExtracting: boolean
  penroseEfficiencyPercent: number
  statusMessage: string
}

export const EXTRACTOR_TIERS: Record<ExtractorTierId, ExtractorTier> = {
  ergosphere_tap: {
    id: 'ergosphere_tap',
    name: '柯爾能層磁力流擷取陣 (Kerr Ergosphere Tap)',
    powerOutputMW: 8500,
    singularityMatterPerSec: 1.2,
    heatGenerationPerSec: 15,
    costCredits: 25000,
    isUnlocked: true,
    level: 1,
    description: '利用黑洞能層空間拖拽效應（Frame Dragging），將負能量粒子送入事件視界以換取超額動能輸出。',
    color: '#00e5ff'
  },
  hawking_sail: {
    id: 'hawking_sail',
    name: '量子霍金輻射收集帆 (Hawking Flux Sail)',
    powerOutputMW: 18000,
    singularityMatterPerSec: 3.5,
    heatGenerationPerSec: 28,
    costCredits: 60000,
    isUnlocked: false,
    level: 1,
    description: '於事件視界光子球邊緣張開超導超材料光帆，直接捕獲真空極化釋放之量子霍金微粒。',
    color: '#76ff03'
  },
  grav_wave_dynamo: {
    id: 'grav_wave_dynamo',
    name: '時空引力波共振發電機 (Gravitational Wave Dynamo)',
    powerOutputMW: 45000,
    singularityMatterPerSec: 8.0,
    heatGenerationPerSec: 45,
    costCredits: 140000,
    isUnlocked: false,
    level: 1,
    description: '吸積盤物質潮汐撕裂引發的時空漣漪共振，直接誘導產生百萬伏特超導真空電勢。',
    color: '#ff9100'
  },
  singularity_condenser: {
    id: 'singularity_condenser',
    name: '奇點夸克膠子濃縮器 (Singularity Quark Condenser)',
    powerOutputMW: 120000,
    singularityMatterPerSec: 22.0,
    heatGenerationPerSec: 75,
    costCredits: 350000,
    isUnlocked: false,
    level: 1,
    description: '極限物理學終極奇蹟：在微型視界周圍強行凝結自由夸克微胞，產出純淨奇異物質。',
    color: '#e040fb'
  }
}

export class SingularityExtractorEngine {
  public tiers: Record<ExtractorTierId, ExtractorTier>
  public stats: SingularityStats = {
    blackHoleMassSolar: 4100000,
    eventHorizonRadiusKm: 12100000,
    ergosphereRadiusKm: 18500000,
    spinParameterA: 0.94,
    proximityRadiusKm: 16000000,
    totalExtractedPowerMW: 8500,
    totalSingularityMatter: 150,
    coolingEfficiencyPercent: 85,
    coreTemperatureK: 320,
    dangerLevel: 'Safe',
    isExtracting: true,
    penroseEfficiencyPercent: 128.5,
    statusMessage: '奇點能層物理監測在線，彭羅斯反衝發電持續輸出中。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.tiers = JSON.parse(JSON.stringify(EXTRACTOR_TIERS))
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

  // ── Station Controls ───────────────────────────────────────────────────────
  public toggleExtraction(): boolean {
    this.stats.isExtracting = !this.stats.isExtracting
    this.stats.statusMessage = this.stats.isExtracting
      ? '⚡ 彭羅斯磁通迴路已接通，開始自黑洞能層抽取能量！'
      : '⏸️ 奇點磁通迴路已斷開，萃取站切入怠速散熱模式。'

    if (this.stats.isExtracting) {
      this.playArcDischarge()
    }
    this.saveState()
    return this.stats.isExtracting
  }

  public adjustProximity(deltaKm: number): void {
    // Cannot cross event horizon (Rs: 12.1m km), max safe distance 25m km
    const minSafe = this.stats.eventHorizonRadiusKm * 1.05
    const maxDist = 25000000
    this.stats.proximityRadiusKm = Math.max(minSafe, Math.min(maxDist, this.stats.proximityRadiusKm + deltaKm))
    
    // Closer distance increases Penrose efficiency but generates more heat
    const distFactor = (maxDist - this.stats.proximityRadiusKm) / (maxDist - minSafe)
    this.stats.penroseEfficiencyPercent = Math.round((100 + distFactor * 45) * 10) / 10
    this.updateDangerLevel()
    this.saveState()
  }

  public unlockOrUpgradeTier(tierId: ExtractorTierId): boolean {
    const tier = this.tiers[tierId]
    if (!tier) return false

    if (!tier.isUnlocked) {
      tier.isUnlocked = true
      this.stats.statusMessage = `🔓 成功部署並啟動了 [${tier.name}]！`
    } else {
      tier.level += 1
      tier.powerOutputMW = Math.round(tier.powerOutputMW * 1.35)
      tier.singularityMatterPerSec = Math.round(tier.singularityMatterPerSec * 1.3 * 10) / 10
      this.stats.statusMessage = `⚡ [${tier.name}] 升級至 Lv.${tier.level}，輸出功率躍升！`
    }

    this.recalculateTotalOutput()
    this.playPenrosePulse()

    // Achievement check
    if (this.stats.totalExtractedPowerMW >= 100000) {
      achievements.trackProgress('singularity_harvester', 1)
    }

    this.saveState()
    return true
  }

  public injectCoolant(): boolean {
    this.stats.coreTemperatureK = Math.max(280, this.stats.coreTemperatureK - 85)
    this.stats.coolingEfficiencyPercent = Math.min(100, this.stats.coolingEfficiencyPercent + 15)
    this.stats.statusMessage = '❄️ 超流體氦四冷卻劑注入核心，輻射熱負荷顯著壓制！'
    this.updateDangerLevel()
    this.saveState()
    return true
  }

  private recalculateTotalOutput(): void {
    let power = 0
    Object.values(this.tiers).forEach(t => {
      if (t.isUnlocked) {
        power += t.powerOutputMW
      }
    })
    // Apply Penrose Efficiency
    this.stats.totalExtractedPowerMW = Math.round(power * (this.stats.penroseEfficiencyPercent / 100))
  }

  private updateDangerLevel(): void {
    if (this.stats.proximityRadiusKm <= this.stats.eventHorizonRadiusKm * 1.1) {
      this.stats.dangerLevel = 'Horizon Breach'
    } else if (this.stats.coreTemperatureK > 650) {
      this.stats.dangerLevel = 'Critical Overheat'
    } else if (this.stats.coreTemperatureK > 480 || this.stats.proximityRadiusKm <= this.stats.ergosphereRadiusKm * 0.95) {
      this.stats.dangerLevel = 'Warning'
    } else {
      this.stats.dangerLevel = 'Safe'
    }
  }

  // ── Update Loop ────────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isExtracting) {
      // Natural cool down
      this.stats.coreTemperatureK = Math.max(290, this.stats.coreTemperatureK - delta * 15)
      this.updateDangerLevel()
      return
    }

    let matterRate = 0
    let heatRate = 0

    Object.values(this.tiers).forEach(t => {
      if (t.isUnlocked) {
        matterRate += t.singularityMatterPerSec
        heatRate += t.heatGenerationPerSec
      }
    })

    // Matter accumulation
    this.stats.totalSingularityMatter += matterRate * delta

    // Heat dynamic simulation
    const netHeat = (heatRate * (this.stats.penroseEfficiencyPercent / 100)) - (this.stats.coolingEfficiencyPercent * 0.4)
    this.stats.coreTemperatureK = Math.max(280, Math.min(950, this.stats.coreTemperatureK + netHeat * delta * 0.5))

    this.updateDangerLevel()

    // Automatic failsafe throttle if critical overheat
    if (this.stats.coreTemperatureK >= 850 && this.stats.isExtracting) {
      this.stats.isExtracting = false
      this.stats.statusMessage = '🚨 警報：堆芯溫度觸及熔毀閾值，重力電磁閥緊急切斷保護！'
      this.saveState()
    }
  }

  // ── Procedural Web Audio Sound Synthesis ───────────────────────────────────
  public playArcDischarge(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(60, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.45)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.45)
  }

  public playPenrosePulse(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [130.81, 164.81, 196.00, 261.63] // C3 Major chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.05
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_singularity_extractor', JSON.stringify({
        stats: this.stats,
        tiers: this.tiers
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_singularity_extractor')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.tiers) {
          this.tiers = parsed.tiers
        }
      }
    } catch { /* ignore */ }
  }
}

export const singularityExtractor = new SingularityExtractorEngine()
