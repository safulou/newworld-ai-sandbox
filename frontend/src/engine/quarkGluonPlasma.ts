/**
 * quarkGluonPlasma.ts
 * 夸克膠子等離子體原始重子重組爐引擎 (Quark-Gluon Plasma Nucleosynthesis Forge Engine)
 * 模擬宇宙大爆炸初期強子相變（2 兆度高溫）、漸近自由物理、磁力噴嘴拘束與奇異重子合成
 */

import { achievementsManager } from './achievements'

function playAudioTone(freq: number, duration: number = 0.2, type: OscillatorType = 'sine'): void {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch { /* ignore */ }
}

function playNoiseBurst(duration: number = 0.2, volume: number = 0.15): void {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    noise.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
  } catch { /* ignore */ }
}

export type QuarkFlavor = 'up' | 'down' | 'strange' | 'charm'

export interface QuarkDensityState {
  flavor: QuarkFlavor
  name: string
  colorCharge: string // 'Red' | 'Green' | 'Blue'
  energyDensityGeV: number
  unlocked: boolean
}

export interface QuarkPlasmaState {
  chamberTempTrillionK: number // 兆度 (10^12 K)，基準 2.15
  asymptoticFreedomPercent: number // 漸近自由度 0~100%
  confinementPressureTeraBar: number // 拘束壓 (TeraBar)
  strangeletStockpile: number // 奇異重子塊庫存
  heavyIonEnergyJoules: number // 重離子束能量
  totalCollisionsTriggered: number
  quarkDensities: Record<QuarkFlavor, QuarkDensityState>
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_quark_plasma_v1'

const DEFAULT_QUARKS: Record<QuarkFlavor, QuarkDensityState> = {
  up: {
    flavor: 'up',
    name: '上夸克基態 (Up Quark)',
    colorCharge: 'Red',
    energyDensityGeV: 2.2,
    unlocked: true
  },
  down: {
    flavor: 'down',
    name: '下夸克基態 (Down Quark)',
    colorCharge: 'Green',
    energyDensityGeV: 4.7,
    unlocked: true
  },
  strange: {
    flavor: 'strange',
    name: '奇異夸克高能態 (Strange Quark)',
    colorCharge: 'Blue',
    energyDensityGeV: 95.0,
    unlocked: true
  },
  charm: {
    flavor: 'charm',
    name: '魅夸克重核態 (Charm Quark)',
    colorCharge: 'Colorless (White Singlet)',
    energyDensityGeV: 1275.0,
    unlocked: false
  }
}

class QuarkGluonPlasmaEngine {
  private state: QuarkPlasmaState = {
    chamberTempTrillionK: 2.15,
    asymptoticFreedomPercent: 88.0,
    confinementPressureTeraBar: 520,
    strangeletStockpile: 45,
    heavyIonEnergyJoules: 1500,
    totalCollisionsTriggered: 18,
    quarkDensities: JSON.parse(JSON.stringify(DEFAULT_QUARKS)),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): QuarkPlasmaState {
    return this.state
  }

  public get strangeletStockpile(): number {
    return this.state.strangeletStockpile
  }

  public get chamberTempTrillionK(): number {
    return this.state.chamberTempTrillionK
  }

  public get asymptoticFreedomPercent(): number {
    return this.state.asymptoticFreedomPercent
  }

  public get confinementPressureTeraBar(): number {
    return this.state.confinementPressureTeraBar
  }

  public get quarkDensities(): Record<QuarkFlavor, QuarkDensityState> {
    return this.state.quarkDensities
  }

  /**
   * 激發高能重離子對撞 (Trigger Heavy Ion Collision)
   */
  public triggerHeavyIonCollision(): { tempDelta: number; freedomGained: number } {
    // 激發金/鉛離子束對撞，溫度瞬間暴升
    const tempDelta = parseFloat((0.15 + Math.random() * 0.25).toFixed(3))
    this.state.chamberTempTrillionK = parseFloat((this.state.chamberTempTrillionK + tempDelta).toFixed(3))

    const freedomGained = 4
    this.state.asymptoticFreedomPercent = Math.min(100, this.state.asymptoticFreedomPercent + freedomGained)
    this.state.heavyIonEnergyJoules += 200
    this.state.totalCollisionsTriggered += 1

    // 解鎖魅夸克
    if (this.state.chamberTempTrillionK >= 2.5) {
      this.state.quarkDensities.charm.unlocked = true
    }

    this.saveState()

    // 對撞撕裂音
    playNoiseBurst(0.35, 0.25)
    playAudioTone(180, 0.3, 'sawtooth')
    setTimeout(() => playAudioTone(920, 0.4, 'sawtooth'), 80)

    return { tempDelta, freedomGained }
  }

  /**
   * 調節超導磁力噴嘴壓制等離子洩漏 (Regulate Magnetic Nozzle)
   */
  public regulateMagneticNozzle(): boolean {
    if (this.state.confinementPressureTeraBar >= 900) return false

    this.state.confinementPressureTeraBar += 85
    this.state.asymptoticFreedomPercent = Math.min(100, this.state.asymptoticFreedomPercent + 5)
    this.saveState()

    playAudioTone(550, 0.15, 'sine')
    setTimeout(() => playAudioTone(825, 0.25, 'triangle'), 80)
    return true
  }

  /**
   * 人工合成超密奇異重子塊 (Synthesize Strangelet)
   */
  public synthesizeStrangelet(): number {
    if (this.state.chamberTempTrillionK < 1.5 || this.state.heavyIonEnergyJoules < 300) {
      return 0
    }

    this.state.heavyIonEnergyJoules -= 300
    const synthesized = Math.max(1, Math.round(this.state.asymptoticFreedomPercent * 0.15))
    this.state.strangeletStockpile += synthesized

    // 成就解鎖
    achievementsManager.unlock('quark_alchemist')

    this.saveState()

    // 重子凝聚金屬音
    playAudioTone(220, 0.3, 'sine')
    setTimeout(() => playAudioTone(330, 0.3, 'triangle'), 100)
    setTimeout(() => playAudioTone(660, 0.4, 'sine'), 200)

    return synthesized
  }

  /**
   * 注入液態夸克冷卻劑淬火 (Quench Plasma)
   */
  public quenchPlasma(): boolean {
    if (this.state.chamberTempTrillionK <= 1.0) return false

    this.state.chamberTempTrillionK = Math.max(1.0, parseFloat((this.state.chamberTempTrillionK - 0.4).toFixed(3)))
    this.state.confinementPressureTeraBar = Math.max(200, this.state.confinementPressureTeraBar - 50)
    this.saveState()

    playAudioTone(400, 0.2, 'sine')
    setTimeout(() => playAudioTone(200, 0.3, 'sine'), 100)
    return true
  }

  /**
   * 主循環更新
   */
  public update(delta: number): void {
    if (delta < 0) return
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 漸近自由度與溫度緩慢自然回歸
    if (this.state.chamberTempTrillionK > 2.0) {
      this.state.chamberTempTrillionK = Math.max(1.8, parseFloat((this.state.chamberTempTrillionK - 0.01).toFixed(3)))
    }

    // 重離子能量自然自律充能
    this.state.heavyIonEnergyJoules += 2

    this.saveState()
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch {
      // ignore
    }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        this.state = {
          ...this.state,
          ...parsed,
          quarkDensities: { ...DEFAULT_QUARKS, ...(parsed.quarkDensities || {}) }
        }
      }
    } catch {
      // fallback
    }
  }
}

export const quarkGluonPlasma = new QuarkGluonPlasmaEngine()
