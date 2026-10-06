/**
 * NewWorld AI Sandbox - Quantum Macro-Genesis Oracle & Fine-Structure Tuning Engine
 * 
 * Implements:
 * - Fundamental Cosmic Constants Fine-Tuning:
 *   1. α (Fine-Structure Constant, default ~0.007297, range 0.0050 ~ 0.0095)
 *      Modulates electromagnetic coupling, superconductivity & energy efficiency.
 *   2. G (Newtonian Gravitational Constant, default 6.674e-11, range 4.0e-11 ~ 9.5e-11)
 *      Modulates spacetime curvature, kinetic inertia & ore density.
 *   3. Λ (Cosmological Constant / Dark Energy, default 1.1e-52, range 0.5e-52 ~ 3.0e-52)
 *      Modulates metric expansion of space, warp corridors & void flux.
 * - 4 Sacred Creation Decrees (創世神諭法令):
 *   1. Decree of Luminescence (光明法則: 光速極限躍遷 +25% 科研加速)
 *   2. Decree of Abundance (物質豐饒法則: 質能豐度倍增 +30% 工業產出)
 *   3. Decree of Negentropy (逆熵奇蹟法則: 零磨損設備抗老化衰減)
 *   4. Decree of Transcendent Cohesion (靈能同調法則: 全域護盾與超維度倍率 +50%)
 * - Genesis Energy Pool (創世神能) & Constant Reset failsafe
 * - Pure Web Audio procedural audio synthesis (Sacred bell resonant chimes & sub-octave drone)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type GenesisDecreeId = 'decree_light' | 'decree_matter' | 'decree_entropy' | 'decree_psionic'

export interface GenesisDecree {
  id: GenesisDecreeId
  name: string
  active: boolean
  costGenesisEnergy: number
  effectDesc: string
  icon: string
}

export interface CosmicConstants {
  alpha: number // Fine-structure constant ~ 0.007297
  gravitationalG: number // ~ 6.674e-11
  lambdaDarkEnergy: number // ~ 1.1e-52
}

export interface GenesisStats {
  constants: CosmicConstants
  genesisEnergy: number
  energyMultiplier: number
  researchMultiplier: number
  shieldMultiplier: number
  stabilityIndexPercent: number
  totalDecreesActive: number
  statusMessage: string
}

export const INITIAL_DECREES: Record<GenesisDecreeId, GenesisDecree> = {
  decree_light: {
    id: 'decree_light',
    name: '光明躍遷法則 (Decree of Luminescence)',
    active: false,
    costGenesisEnergy: 100,
    effectDesc: '微觀光子相互作用加速，全文明科研產出效率 +25%',
    icon: '✨'
  },
  decree_matter: {
    id: 'decree_matter',
    name: '物質豐饒法則 (Decree of Abundance)',
    active: false,
    costGenesisEnergy: 150,
    effectDesc: '重子物質合成截面增益，所有採礦與物質鍛爐產能 +30%',
    icon: '💎'
  },
  decree_entropy: {
    id: 'decree_entropy',
    name: '逆熵永恆奇蹟 (Decree of Negentropy)',
    active: false,
    costGenesisEnergy: 200,
    effectDesc: '局部時空熵減逆行，機械磨損率與反衝衰竭歸零',
    icon: '⏳'
  },
  decree_psionic: {
    id: 'decree_psionic',
    name: '靈能超維同調 (Decree of Transcendent Cohesion)',
    active: false,
    costGenesisEnergy: 300,
    effectDesc: '意識場與宇宙真空同調，全艦隊偏折護盾值與奇點倍率 +50%',
    icon: '🔮'
  }
}

export class CosmicConstantsEngine {
  public stats: GenesisStats = {
    constants: {
      alpha: 0.007297,
      gravitationalG: 6.674e-11,
      lambdaDarkEnergy: 1.1e-52
    },
    genesisEnergy: 250.0,
    energyMultiplier: 1.0,
    researchMultiplier: 1.0,
    shieldMultiplier: 1.0,
    stabilityIndexPercent: 100.0,
    totalDecreesActive: 0,
    statusMessage: '創世神諭聖壇已啟動，基本物理常數維持在標準宇宙模型。'
  }

  public decrees: Record<GenesisDecreeId, GenesisDecree> = JSON.parse(JSON.stringify(INITIAL_DECREES))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.recalculateEffects()
  }

  // ── Calculation ────────────────────────────────────────────────────────────
  public recalculateEffects(): void {
    const defaultAlpha = 0.007297
    const defaultG = 6.674e-11
    const defaultLambda = 1.1e-52

    // Deviation factors
    const alphaRatio = this.stats.constants.alpha / defaultAlpha
    const gRatio = this.stats.constants.gravitationalG / defaultG
    const lambdaRatio = this.stats.constants.lambdaDarkEnergy / defaultLambda

    // Energy: boosted by lower electromagnetic resistance or higher G compaction
    let energyMult = 1.0 + (1 - alphaRatio) * 0.5 + (gRatio - 1) * 0.4
    // Research: boosted by higher lightspeed / lambda expansion
    let resMult = 1.0 + (alphaRatio - 1) * 0.3 + (lambdaRatio - 1) * 0.5
    // Shield: boosted by electromagnetic cohesion
    let shieldMult = 1.0 + (alphaRatio - 1) * 0.6

    // Apply active decrees
    let activeCount = 0
    if (this.decrees.decree_light.active) { resMult += 0.25; activeCount++ }
    if (this.decrees.decree_matter.active) { energyMult += 0.30; activeCount++ }
    if (this.decrees.decree_psionic.active) { shieldMult += 0.50; energyMult += 0.20; activeCount++ }
    if (this.decrees.decree_entropy.active) { activeCount++ }

    this.stats.energyMultiplier = parseFloat(Math.max(0.5, energyMult).toFixed(2))
    this.stats.researchMultiplier = parseFloat(Math.max(0.5, resMult).toFixed(2))
    this.stats.shieldMultiplier = parseFloat(Math.max(0.5, shieldMult).toFixed(2))
    this.stats.totalDecreesActive = activeCount

    // Stability: drops if constants deviate too far from default
    const totalDeviation = Math.abs(alphaRatio - 1) + Math.abs(gRatio - 1) + Math.abs(lambdaRatio - 1)
    this.stats.stabilityIndexPercent = Math.max(30, Math.floor(100 - totalDeviation * 40))

    if (activeCount >= 2 || totalDeviation > 0.4) {
      achievements.unlock('genesis_oracle')
    }

    this.saveState()
  }

  // ── Set Constant ───────────────────────────────────────────────────────────
  public setAlpha(val: number): void {
    this.stats.constants.alpha = Math.min(0.0095, Math.max(0.0050, val))
    this.stats.statusMessage = `微調精細結構常數 α 至 ${this.stats.constants.alpha.toFixed(6)}`
    this.recalculateEffects()
  }

  public setGravitationalG(val: number): void {
    this.stats.constants.gravitationalG = Math.min(9.5e-11, Math.max(4.0e-11, val))
    this.stats.statusMessage = `微調重力常數 G 至 ${(this.stats.constants.gravitationalG * 1e11).toFixed(2)} × 10⁻¹¹`
    this.recalculateEffects()
  }

  public setLambdaDarkEnergy(val: number): void {
    this.stats.constants.lambdaDarkEnergy = Math.min(3.0e-52, Math.max(0.5e-52, val))
    this.stats.statusMessage = `微調宇宙學常數 Λ 至 ${(this.stats.constants.lambdaDarkEnergy * 1e52).toFixed(2)} × 10⁻⁵²`
    this.recalculateEffects()
  }

  public resetToDefaultConstants(): void {
    this.stats.constants = {
      alpha: 0.007297,
      gravitationalG: 6.674e-11,
      lambdaDarkEnergy: 1.1e-52
    }
    this.stats.statusMessage = '已重置所有宇宙基本物理常數至標準基底模型。'
    this.playSacredBell()
    this.recalculateEffects()
  }

  // ── Toggle Genesis Decree ──────────────────────────────────────────────────
  public toggleDecree(decreeId: GenesisDecreeId): boolean {
    const dec = this.decrees[decreeId]
    if (!dec) return false

    if (!dec.active) {
      if (this.stats.genesisEnergy < dec.costGenesisEnergy) {
        this.stats.statusMessage = `創世神能不足，無法頒布【${dec.name}】（需 ${dec.costGenesisEnergy} 神能）`
        return false
      }
      this.stats.genesisEnergy -= dec.costGenesisEnergy
      dec.active = true
      this.stats.statusMessage = `✨ 創世神諭生效：【${dec.name}】已賦予全宇宙物理法則！`
      this.playSacredBell()
    } else {
      dec.active = false
      this.stats.statusMessage = `已解除神諭法令：【${dec.name}】`
    }

    this.recalculateEffects()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    // Passive accumulation of genesis energy
    const stabilityBonus = this.stats.stabilityIndexPercent / 100
    this.stats.genesisEnergy += (1.5 * stabilityBonus * delta)
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

  public playSacredBell(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Sacred harmonic chime chords (Pythagorean 432Hz tuning)
    const bellFreqs = [432.0, 648.0, 864.0]
    bellFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.05

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.2, t)
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
      localStorage.setItem('nw_cosmic_constants_v1', JSON.stringify({
        stats: this.stats,
        decrees: this.decrees
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_cosmic_constants_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.decrees) {
          this.decrees = parsed.decrees
        }
      }
    } catch { /* ignore */ }
  }
}

export const cosmicConstantsEngine = new CosmicConstantsEngine()
