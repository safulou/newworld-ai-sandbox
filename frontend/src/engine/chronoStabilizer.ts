/**
 * NewWorld AI Sandbox - Chrono-Paradox Stabilizer & Closed Timelike Curve Engine
 * 
 * Implements:
 * - Closed Timelike Curves (CTC) Quantum Mechanics & Retrocausality
 * - Temporal Borrowing (因果預借系統):
 *   1. Research Loan (預借未來科研點數 +5,000)
 *   2. Energy Surge Loan (預借未來電網儲能 +50,000 MW)
 *   3. Tachyon Particle Loan (預借超光速量子態 +100 Tachyons)
 * - Temporal Debt & Countdown (因果債務結算與逾期懲罰):
 *   Loans must be settled within the repayment window or trigger a Paradox Flux spike.
 * - Paradox Flux (因果反衝度 0 - 100%):
 *   High paradox causes timeline anomalies and timeline collapse risk at 100%.
 * - 4 Chrono-Stabilizer Laboratory Modules:
 *   1. Tachyon Condenser (超光速粒子凝結器)
 *   2. Causality Sink (因果沉降池)
 *   3. Quantum Timeline Anchor (量子時間錨定器)
 *   4. Retrocausal Resonator (逆因果共振發電機)
 * - Pure Web Audio procedural audio synthesis (Chrono ticking, tachyon pulse, paradox warning dissonance)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type TemporalLoanType = 'research' | 'energy' | 'tachyon'

export interface TemporalDebt {
  id: string
  type: TemporalLoanType
  amountBorrowed: number
  costToRepay: number
  remainingSeconds: number
  initialDurationSec: number
  isRepaid: boolean
}

export type ChronoModuleId = 'condenser' | 'sink' | 'anchor' | 'resonator'

export interface ChronoModule {
  id: ChronoModuleId
  name: string
  level: number
  maxLevel: 5
  costTachyons: number
  bonusDesc: string
}

export interface ChronoStats {
  paradoxFluxPercent: number
  tachyonParticles: number
  temporalEnergyTW: number
  debtsResolvedCount: number
  timelineStability: 'Stable' | 'Distorted' | 'Severe Paradox' | 'Collapse Imminent'
  isStabilizerActive: boolean
  statusMessage: string
}

export const CHRONO_MODULES: Record<ChronoModuleId, ChronoModule> = {
  condenser: {
    id: 'condenser',
    name: '超光速粒子凝結器 (Tachyon Condenser)',
    level: 1,
    maxLevel: 5,
    costTachyons: 50,
    bonusDesc: '每秒自動凝結超光速粒子 +1.5 / 級'
  },
  sink: {
    id: 'sink',
    name: '因果沉降抑制池 (Causality Sink)',
    level: 1,
    maxLevel: 5,
    costTachyons: 80,
    bonusDesc: '降低因果反衝自然累積速率 -20% / 級'
  },
  anchor: {
    id: 'anchor',
    name: '量子時間錨定器 (Timeline Anchor)',
    level: 1,
    maxLevel: 5,
    costTachyons: 120,
    bonusDesc: '延長因果預借償還時限 +25% / 級'
  },
  resonator: {
    id: 'resonator',
    name: '逆因果共振發電機 (Retrocausal Resonator)',
    level: 1,
    maxLevel: 5,
    costTachyons: 200,
    bonusDesc: '時間閉環穩定時，提供全文明時間能源 +2.0 TW / 級'
  }
}

export class ChronoStabilizerEngine {
  public stats: ChronoStats = {
    paradoxFluxPercent: 12.0,
    tachyonParticles: 150,
    temporalEnergyTW: 5.0,
    debtsResolvedCount: 0,
    timelineStability: 'Stable',
    isStabilizerActive: true,
    statusMessage: '時空閉環校準儀運行中，因果波動維持於安全閾值以內。'
  }

  public modules: Record<ChronoModuleId, ChronoModule> = JSON.parse(JSON.stringify(CHRONO_MODULES))
  public activeDebts: TemporalDebt[] = []

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.updateStabilityStatus()
  }

  // ── Status & Calculation ───────────────────────────────────────────────────
  public updateStabilityStatus(): void {
    const flux = this.stats.paradoxFluxPercent

    if (flux < 30) {
      this.stats.timelineStability = 'Stable'
    } else if (flux < 65) {
      this.stats.timelineStability = 'Distorted'
    } else if (flux < 90) {
      this.stats.timelineStability = 'Severe Paradox'
    } else {
      this.stats.timelineStability = 'Collapse Imminent'
    }

    // Energy generation from resonator
    this.stats.temporalEnergyTW = (this.modules.resonator.level * 2.5) * (1 - flux / 200)

    this.saveState()
  }

  // ── Temporal Borrowing ─────────────────────────────────────────────────────
  public borrowFutureResource(type: TemporalLoanType): boolean {
    if (this.stats.paradoxFluxPercent >= 85) {
      this.stats.statusMessage = '⚠️ 因果反衝度過高，時空連續體拒絕建立新的類時閉環！'
      return false
    }

    const duration = 45 * (1 + (this.modules.anchor.level - 1) * 0.25)
    let amount = 0
    let cost = 0

    if (type === 'research') {
      amount = 5000
      cost = 6000
      this.stats.statusMessage = '⚡ 成功從未來時間線預借 +5,000 科研點數！請在時限內平息因果。'
    } else if (type === 'energy') {
      amount = 50000
      cost = 65000
      this.stats.statusMessage = '⚡ 成功預借未來電網超載儲能 +50,000 MW！'
    } else if (type === 'tachyon') {
      amount = 100
      cost = 130
      this.stats.tachyonParticles += amount
      this.stats.statusMessage = '⚡ 成功預借 +100 超光速粒子！'
    }

    const debt: TemporalDebt = {
      id: `debt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      amountBorrowed: amount,
      costToRepay: cost,
      remainingSeconds: duration,
      initialDurationSec: duration,
      isRepaid: false
    }

    this.activeDebts.push(debt)
    this.stats.paradoxFluxPercent = Math.min(100, this.stats.paradoxFluxPercent + 10)
    this.playTickSound()
    this.updateStabilityStatus()
    return true
  }

  // ── Repay Debt ─────────────────────────────────────────────────────────────
  public repayDebt(debtId: string): boolean {
    const idx = this.activeDebts.findIndex(d => d.id === debtId)
    if (idx === -1) return false

    const debt = this.activeDebts[idx]
    debt.isRepaid = true
    this.activeDebts.splice(idx, 1)

    // Smooth paradox flux on repayment
    this.stats.paradoxFluxPercent = Math.max(0, this.stats.paradoxFluxPercent - 15)
    this.stats.debtsResolvedCount++
    this.stats.statusMessage = '✨ 因果債務已順利結算！時空反衝度大幅降低。'
    this.playTachyonInjectSound()

    if (this.stats.debtsResolvedCount >= 5) {
      achievements.unlock('chrono_navigator')
    }

    this.updateStabilityStatus()
    return true
  }

  // ── Inject Tachyons to Damp Paradox ────────────────────────────────────────
  public injectTachyons(): boolean {
    if (this.stats.tachyonParticles < 25) {
      this.stats.statusMessage = '超光速粒子儲備不足（需 25 Tachyons）'
      return false
    }

    this.stats.tachyonParticles -= 25
    this.stats.paradoxFluxPercent = Math.max(0, this.stats.paradoxFluxPercent - 20)
    this.stats.statusMessage = '超光速粒子注入成功，因果反衝震盪已被吸收衰減！'
    this.playTachyonInjectSound()
    this.updateStabilityStatus()
    return true
  }

  // ── Upgrade Chrono Module ──────────────────────────────────────────────────
  public upgradeModule(modId: ChronoModuleId): boolean {
    const mod = this.modules[modId]
    if (!mod || mod.level >= mod.maxLevel) return false

    const cost = mod.costTachyons * mod.level
    if (this.stats.tachyonParticles < cost) {
      this.stats.statusMessage = `超光速粒子不足，無法升級【${mod.name}】（需 ${cost} Tachyons）`
      return false
    }

    this.stats.tachyonParticles -= cost
    mod.level++
    this.stats.statusMessage = `已升級時空實驗室模組：【${mod.name}】至 Lv.${mod.level}`
    this.playTachyonInjectSound()
    this.updateStabilityStatus()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isStabilizerActive) return

    // Passive tachyon generation
    const gen = 1.2 * this.modules.condenser.level * delta
    this.stats.tachyonParticles += gen

    // Passive natural paradox dampening / gain
    const sinkDamp = 0.05 * this.modules.sink.level * delta
    if (this.activeDebts.length === 0) {
      this.stats.paradoxFluxPercent = Math.max(0, this.stats.paradoxFluxPercent - sinkDamp)
    }

    // Tick active debts
    for (let i = this.activeDebts.length - 1; i >= 0; i--) {
      const debt = this.activeDebts[i]
      debt.remainingSeconds -= delta

      // Debt expired without manual repayment -> Severe penalty
      if (debt.remainingSeconds <= 0) {
        this.stats.paradoxFluxPercent = Math.min(100, this.stats.paradoxFluxPercent + 25)
        this.stats.statusMessage = `🚨 警告：因果債務【${debt.type}】超時未結算！引發強烈時空反衝！`
        this.playParadoxAlarm()
        this.activeDebts.splice(i, 1)
      }
    }

    // Paradox Collapse Critical Event
    if (this.stats.paradoxFluxPercent >= 100) {
      this.stats.paradoxFluxPercent = 50
      this.stats.statusMessage = '💥 時空連續體局部塌陷！時間反衝力場重設，部分能量與粒子被維度裂隙吞噬。'
      this.stats.tachyonParticles = Math.floor(this.stats.tachyonParticles * 0.6)
      this.playParadoxAlarm()
    }

    this.updateStabilityStatus()
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

  public playTickSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(1400, now)
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  public playTachyonInjectSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  public playParadoxAlarm(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Dissonant tritone alarm (440Hz + 622Hz)
    const freqs = [440, 622]
    freqs.forEach(freq => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.5)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_chrono_stabilizer_v1', JSON.stringify({
        stats: this.stats,
        modules: this.modules,
        activeDebts: this.activeDebts
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_chrono_stabilizer_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.modules) {
          this.modules = parsed.modules
        }
        if (Array.isArray(parsed.activeDebts)) {
          this.activeDebts = parsed.activeDebts
        }
      }
    } catch { /* ignore */ }
  }
}

export const chronoStabilizer = new ChronoStabilizerEngine()
