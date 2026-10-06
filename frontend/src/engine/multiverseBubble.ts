/**
 * NewWorld AI Sandbox - Multiverse Bubble Topology & Inflationary Landscape Engine
 * 
 * Implements:
 * - Eternal Cosmological Inflation & Parallel Universe Bubble topology
 * - 4 Distinct Parallel Universe Bubbles:
 *   1. High-Gravity Cosmos (高重力緻密宇宙): Extreme gravity, ultra-dense exotic metals
 *   2. Antimatter Mirror (反物質鏡像宇宙): Charge-parity inverted, massive annihilation yields
 *   3. Variable Lightspeed Realm (可變光速流動宇宙): Dynamic speed of light, hyper-speed research
 *   4. Hyper-Entropy Void (高熵虛空寂滅宇宙): Rapid entropy decay, zero-point singularity gems
 * - Quantum Resonance Harmonic Frequency Tuning (0.1 ~ 100.0 THz)
 * - Membrane Stability & Dimensional Penetration
 * - Multiverse Probe Cruise & Exotic Multiversal Flux harvesting
 * - Pure Web Audio procedural audio synthesis (Dimensional whoosh sweep & harmonic bell chimes)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type UniverseBubbleId = 'high_gravity' | 'antimatter' | 'variable_light' | 'hyper_entropy'

export interface UniverseBubble {
  id: UniverseBubbleId
  name: string
  cosmicConstantDeviation: string
  primaryYield: string
  resonanceFrequencyTHz: number
  membraneStabilityPercent: number
  probesDispatched: number
  harvestRatePerSec: number
  unlocked: boolean
  description: string
  color: string
}

export interface MultiverseStats {
  activeUniverseId: UniverseBubbleId
  totalMultiversalFlux: number
  globalResonanceTHz: number
  membraneIntegrityPercent: number
  probesAvailable: number
  fluxMultiplier: number
  isTuningActive: boolean
  statusMessage: string
}

export const UNIVERSE_BUBBLES: Record<UniverseBubbleId, UniverseBubble> = {
  high_gravity: {
    id: 'high_gravity',
    name: '高重力緻密宇宙 (Dense High-G Cosmos)',
    cosmicConstantDeviation: '重力常數 G × 3.5',
    primaryYield: '緻密重力合金 (Dense Grav-Alloys)',
    resonanceFrequencyTHz: 14.8,
    membraneStabilityPercent: 92,
    probesDispatched: 2,
    harvestRatePerSec: 15.0,
    unlocked: true,
    description: '重力場極度強大的緻密宇宙，天體坍縮為超固態晶體，蘊含無與倫比的高密抗壓合金。',
    color: '#38bdf8'
  },
  antimatter: {
    id: 'antimatter',
    name: '反物質鏡像宇宙 (Antimatter Mirror)',
    cosmicConstantDeviation: '電荷-宇稱對稱性 CP 倒置',
    primaryYield: '正電子反質子微胞 (Antiproton Cells)',
    resonanceFrequencyTHz: 38.4,
    membraneStabilityPercent: 85,
    probesDispatched: 1,
    harvestRatePerSec: 25.0,
    unlocked: true,
    description: '物質世界完全由反質子與正電子構成的鏡像世界，質能湮滅效率達到極限。',
    color: '#f43f5e'
  },
  variable_light: {
    id: 'variable_light',
    name: '可變光速流動宇宙 (Variable Lightspeed Realm)',
    cosmicConstantDeviation: '真空光速 c × 10.0',
    primaryYield: '超光速量子態 (Superluminal Quantum Data)',
    resonanceFrequencyTHz: 62.1,
    membraneStabilityPercent: 78,
    probesDispatched: 0,
    harvestRatePerSec: 40.0,
    unlocked: false,
    description: '真空中電磁波速高達十倍的奇異宇宙，信息傳遞與微觀粒子運算達到維度巔峰。',
    color: '#a855f7'
  },
  hyper_entropy: {
    id: 'hyper_entropy',
    name: '高熵虛空寂滅宇宙 (Hyper-Entropy Void)',
    cosmicConstantDeviation: '熵增常數 S × 5.0',
    primaryYield: '零點奇異結晶 (Zero-Point Singularity Gems)',
    resonanceFrequencyTHz: 89.6,
    membraneStabilityPercent: 70,
    probesDispatched: 0,
    harvestRatePerSec: 65.0,
    unlocked: false,
    description: '熱力學時間箭頭急劇衰竭的終末宇宙，真空中凝結出永恆不壞的零點奇異晶石。',
    color: '#fbbf24'
  }
}

export class MultiverseBubbleEngine {
  public stats: MultiverseStats = {
    activeUniverseId: 'high_gravity',
    totalMultiversalFlux: 120.0,
    globalResonanceTHz: 14.8,
    membraneIntegrityPercent: 95.0,
    probesAvailable: 5,
    fluxMultiplier: 1.0,
    isTuningActive: true,
    statusMessage: '多重宇宙景觀拓撲觀測儀已連線，正鎖定高重力緻密宇宙泡泡。'
  }

  public bubbles: Record<UniverseBubbleId, UniverseBubble> = JSON.parse(JSON.stringify(UNIVERSE_BUBBLES))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.checkUnlocks()
  }

  // ── Calculation & Unlocks ──────────────────────────────────────────────────
  public checkUnlocks(): void {
    if (this.stats.totalMultiversalFlux >= 500) {
      this.bubbles.variable_light.unlocked = true
    }
    if (this.stats.totalMultiversalFlux >= 2000) {
      this.bubbles.hyper_entropy.unlocked = true
    }
    this.saveState()
  }

  // ── Select / Traverse to Bubble Universe ────────────────────────────────────
  public selectUniverse(universeId: UniverseBubbleId): boolean {
    const bubble = this.bubbles[universeId]
    if (!bubble || !bubble.unlocked) return false

    this.stats.activeUniverseId = universeId
    this.stats.globalResonanceTHz = bubble.resonanceFrequencyTHz
    this.stats.statusMessage = `已調諧時空膜共振，成功觀測並穿梭至【${bubble.name}】！`
    this.playTraverseSound()

    achievements.unlock('multiverse_traveler')
    this.saveState()
    return true
  }

  // ── Dispatch Probe into Bubble ─────────────────────────────────────────────
  public dispatchProbe(universeId: UniverseBubbleId): boolean {
    const bubble = this.bubbles[universeId]
    if (!bubble || !bubble.unlocked) return false
    if (this.stats.probesAvailable <= 0) {
      this.stats.statusMessage = '可用自律維度探針數量不足，請等待探針巡航返航！'
      return false
    }

    this.stats.probesAvailable--
    bubble.probesDispatched++
    this.stats.statusMessage = `🚀 已發射自律維度探針進入【${bubble.name}】，奇異通量採集率提升！`
    this.playChimeSound()
    this.saveState()
    return true
  }

  // ── Tune Resonance Frequency ───────────────────────────────────────────────
  public tuneFrequency(freqTHz: number): void {
    this.stats.globalResonanceTHz = parseFloat(freqTHz.toFixed(1))
    const currentBubble = this.bubbles[this.stats.activeUniverseId]

    // Check tuning alignment
    const diff = Math.abs(this.stats.globalResonanceTHz - currentBubble.resonanceFrequencyTHz)
    if (diff < 0.5) {
      currentBubble.membraneStabilityPercent = 100
      this.stats.statusMessage = `✨ 共振頻率完美同調！時空膜穩定度達到 100%，通量產出效率激增！`
      this.playChimeSound()
    } else {
      currentBubble.membraneStabilityPercent = Math.max(40, Math.floor(100 - diff * 8))
    }

    this.saveState()
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isTuningActive) return

    // Harvest flux from all active probes across unlocked universes
    let totalHarvest = 0
    Object.values(this.bubbles).forEach(bubble => {
      if (bubble.unlocked && bubble.probesDispatched > 0) {
        const yieldPerSec = bubble.harvestRatePerSec * bubble.probesDispatched * (bubble.membraneStabilityPercent / 100)
        totalHarvest += yieldPerSec * delta * this.stats.fluxMultiplier
      }
    })

    this.stats.totalMultiversalFlux += totalHarvest
    this.checkUnlocks()
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

  public playTraverseSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playChimeSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5 Major Chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.06

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_multiverse_bubble_v1', JSON.stringify({
        stats: this.stats,
        bubbles: this.bubbles
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_multiverse_bubble_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.bubbles) {
          this.bubbles = parsed.bubbles
        }
      }
    } catch { /* ignore */ }
  }
}

export const multiverseBubbleEngine = new MultiverseBubbleEngine()
