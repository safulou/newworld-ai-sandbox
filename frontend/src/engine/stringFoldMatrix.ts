/**
 * NewWorld AI Sandbox - 11-Dimensional Superstring & Calabi-Yau Spatial Fold Transport Engine
 * 
 * Implements:
 * - Calabi-Yau 6D compactified manifold geometry simulation
 * - 11-Dimensional M-Theory spatial metric folding
 * - Zero-latency hyper-dimensional instant matter transit
 * - 4 String Resonance Harmonics (超弦共振和弦):
 *   1. Open String Flux (開弦動能流): Eliminates physical friction & inertia
 *   2. Closed String Graviton (閉弦引力子共振): Gravitational well neutralization
 *   3. D-Brane Tension Web (D-膜維度張力網): Structural anchor against spacetime tearing
 *   4. M-Theory Dual Fold (M-理論對偶躍遷): Trans-dimensional infinite logistics fold
 * - Spatial Fold Ratio (空間折疊比 1:1 ~ 1:100,000)
 * - Membrane Shear Tension & Safe Tension Discharge Pulse
 * - Pure Web Audio procedural audio synthesis (Crystalline string pluck & warp whoosh)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type StringHarmonicId = 'open_string' | 'closed_string' | 'd_brane' | 'm_theory'

export interface StringHarmonic {
  id: StringHarmonicId
  name: string
  frequencyPHz: number // PHz (Petahertz)
  compressionFactor: number
  unlocked: boolean
  level: number
  description: string
}

export interface StringFoldStats {
  currentFoldRatio: number // e.g. 10000 means 1:10,000 compression
  stringTensionPercent: number
  totalMatterFoldedTons: number
  calabiYauStabilityPercent: number
  activeHarmonic: StringHarmonicId
  isFoldEngaged: boolean
  statusMessage: string
}

export const STRING_HARMONICS: Record<StringHarmonicId, StringHarmonic> = {
  open_string: {
    id: 'open_string',
    name: '開弦動能流 (Open String Flux)',
    frequencyPHz: 125,
    compressionFactor: 1000,
    unlocked: true,
    level: 1,
    description: '端點固定於 D-膜的開弦振動模式，消弭物質運載中的所有微觀摩擦阻力。'
  },
  closed_string: {
    id: 'closed_string',
    name: '閉弦引力子共振 (Closed String Graviton)',
    frequencyPHz: 340,
    compressionFactor: 5000,
    unlocked: true,
    level: 1,
    description: '自旋為 2 的閉弦無質量粒子震盪，直接中和行星與黑洞的外部引力井束縛。'
  },
  d_brane: {
    id: 'd_brane',
    name: 'D-膜高維張力網 (D-Brane Tension Web)',
    frequencyPHz: 680,
    compressionFactor: 25000,
    unlocked: false,
    level: 0,
    description: '高維超曲面張力支架，將三維歐幾里得空間緊密錨定於六維卡拉比-丘幾何。'
  },
  m_theory: {
    id: 'm_theory',
    name: 'M-理論對偶躍遷 (M-Theory Dual Fold)',
    frequencyPHz: 999,
    compressionFactor: 100000,
    unlocked: false,
    level: 0,
    description: '十一維超引力與五種超弦理論的統一對偶對稱折疊，達成極限瞬移零延遲。'
  }
}

export class StringFoldMatrixEngine {
  public stats: StringFoldStats = {
    currentFoldRatio: 1000,
    stringTensionPercent: 24.0,
    totalMatterFoldedTons: 450,
    calabiYauStabilityPercent: 96.0,
    activeHarmonic: 'open_string',
    isFoldEngaged: true,
    statusMessage: '卡拉比-丘超弦六維幾何折疊矩陣連線中，空間折疊比率 1:1,000。'
  }

  public harmonics: Record<StringHarmonicId, StringHarmonic> = JSON.parse(JSON.stringify(STRING_HARMONICS))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.recalculateRatio()
  }

  // ── Calculation ────────────────────────────────────────────────────────────
  public recalculateRatio(): void {
    const active = this.harmonics[this.stats.activeHarmonic]
    const baseFactor = active?.compressionFactor ?? 1000
    const lvl = active?.level ?? 1

    this.stats.currentFoldRatio = baseFactor * lvl

    if (this.stats.currentFoldRatio >= 5000) {
      this.harmonics.d_brane.unlocked = true
    }
    if (this.stats.currentFoldRatio >= 50000) {
      this.harmonics.m_theory.unlocked = true
    }

    if (this.stats.currentFoldRatio >= 100000) {
      achievements.unlock('string_weaver')
    }

    this.saveState()
  }

  // ── Switch Harmonic Mode ───────────────────────────────────────────────────
  public switchHarmonic(harmonicId: StringHarmonicId): boolean {
    const h = this.harmonics[harmonicId]
    if (!h || !h.unlocked) return false

    this.stats.activeHarmonic = harmonicId
    this.stats.statusMessage = `已調諧超弦共振模式：【${h.name}】`
    this.playStringPluck()
    this.recalculateRatio()
    return true
  }

  // ── Instant Instant Spatial Fold Transit ───────────────────────────────────
  public triggerInstantTransit(matterAmountTons: number = 50): boolean {
    if (this.stats.stringTensionPercent >= 85) {
      this.stats.statusMessage = '⚠️ 弦張力剪切風險過高，超空間折疊受阻！請先釋放膜張力。'
      return false
    }

    this.stats.totalMatterFoldedTons += matterAmountTons
    this.stats.stringTensionPercent = Math.min(100, this.stats.stringTensionPercent + 12)
    this.stats.statusMessage = `✨ 瞬間空間對折成功！透過卡拉比-丘流形折躍傳輸 ${matterAmountTons} 噸超維資產！`
    this.playWarpWhoosh()
    this.recalculateRatio()
    return true
  }

  // ── Discharge Membrane Tension Pulse ───────────────────────────────────────
  public dischargeTension(): void {
    this.stats.stringTensionPercent = 0
    this.stats.calabiYauStabilityPercent = 100
    this.stats.statusMessage = '膜張力釋放脈衝啟動，超弦幾何晶格已恢復平穩基底！'
    this.playStringPluck()
    this.saveState()
  }

  // ── Upgrade Harmonic ───────────────────────────────────────────────────────
  public upgradeHarmonic(harmonicId: StringHarmonicId): boolean {
    const h = this.harmonics[harmonicId]
    if (!h || !h.unlocked || h.level >= 5) return false

    h.level++
    this.stats.statusMessage = `超弦和弦【${h.name}】已升級至 Lv.${h.level}！`
    this.playStringPluck()
    this.recalculateRatio()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isFoldEngaged) return

    // Slowly accumulate tension under continuous fold load
    const loadTension = 0.08 * (this.stats.currentFoldRatio / 10000) * delta
    this.stats.stringTensionPercent = Math.min(100, this.stats.stringTensionPercent + loadTension)

    // Passive cargo transit
    this.stats.totalMatterFoldedTons += (0.2 * (this.stats.currentFoldRatio / 1000) * delta)

    if (this.stats.stringTensionPercent >= 90) {
      this.stats.calabiYauStabilityPercent = Math.max(20, 100 - (this.stats.stringTensionPercent - 80) * 4)
    }

    this.saveState()
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

  public playStringPluck(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Karplus-Strong string pluck imitation with high harmonics
    const pluckFreqs = [440.0, 880.0, 1320.0, 1760.0]
    pluckFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.03

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.15 / (idx + 1), t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.35)
    })
  }

  public playWarpWhoosh(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(60, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.5)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_string_fold_v1', JSON.stringify({
        stats: this.stats,
        harmonics: this.harmonics
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_string_fold_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.harmonics) {
          this.harmonics = parsed.harmonics
        }
      }
    } catch { /* ignore */ }
  }
}

export const stringFoldMatrixEngine = new StringFoldMatrixEngine()
