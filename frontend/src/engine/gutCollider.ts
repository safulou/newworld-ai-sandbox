/**
 * gutCollider.ts
 * 大統一理論規範玻色子對撞核心引擎 (Grand Unified Theory Gauge Boson Collider Engine)
 * 模擬 10^16 GeV 超高能標大統一相變、超重 X/Y 規範玻色子生成、
 * 重子數破壞與質子衰變觀測實驗
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

export type GUTColliderMode = 'georgi_glashow_su5' | 'spinor_so10' | 'exceptional_e6' | 'string_compact_gut'

export interface GUTColliderState {
  gutEnergyExponent: number // 10^x GeV，基準 16.0 (10^16 GeV)
  gaugeCouplingUnificationPercent: number // 耦合度 0~100%
  xyBosonYieldCounts: number // X/Y 玻色子生成數
  protonDecayEvents: number // 質子衰變觀測次數
  monopoleDensity: number // 磁單極子密度
  unificationFlux: number // 大統一通量貨幣
  colliderMode: GUTColliderMode
  totalCollisions: number
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_gut_collider_v1'

class GUTColliderEngine {
  private state: GUTColliderState = {
    gutEnergyExponent: 16.0,
    gaugeCouplingUnificationPercent: 86.5,
    xyBosonYieldCounts: 24,
    protonDecayEvents: 3,
    monopoleDensity: 0.18,
    unificationFlux: 280,
    colliderMode: 'spinor_so10',
    totalCollisions: 32,
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): GUTColliderState {
    return this.state
  }

  public get gutEnergyExponent(): number {
    return this.state.gutEnergyExponent
  }

  public get gaugeCouplingUnificationPercent(): number {
    return this.state.gaugeCouplingUnificationPercent
  }

  public get xyBosonYieldCounts(): number {
    return this.state.xyBosonYieldCounts
  }

  public get protonDecayEvents(): number {
    return this.state.protonDecayEvents
  }

  public get unificationFlux(): number {
    return this.state.unificationFlux
  }

  public get colliderMode(): GUTColliderMode {
    return this.state.colliderMode
  }

  /**
   * 切換大統一對撞模型
   */
  public switchMode(mode: GUTColliderMode): void {
    if (this.state.colliderMode === mode) return
    this.state.colliderMode = mode
    this.saveState()

    playAudioTone(480, 0.12, 'sine')
    setTimeout(() => playAudioTone(720, 0.18, 'triangle'), 70)
  }

  /**
   * 激發大統一超高能對撞 (Fire GUT Collision)
   */
  public fireGUTCollision(): { xyBosonGained: number; protonDecay: boolean } {
    const xyBosonGained = Math.round(2 + (this.state.gaugeCouplingUnificationPercent / 25))
    this.state.xyBosonYieldCounts += xyBosonGained
    this.state.totalCollisions += 1

    // 質子衰變機率檢測 (罕見事件)
    const decayChance = (this.state.gaugeCouplingUnificationPercent / 100) * 0.45
    let protonDecay = false
    if (Math.random() < decayChance) {
      this.state.protonDecayEvents += 1
      protonDecay = true
      this.state.unificationFlux += 150
    } else {
      this.state.unificationFlux += Math.round(30 + xyBosonGained * 5)
    }

    // 解鎖大統一成就
    achievementsManager.unlock('gut_grand_unifier')

    this.saveState()

    // 超高能對撞聲
    playNoiseBurst(0.25, 0.2)
    playAudioTone(160, 0.2, 'sawtooth')
    setTimeout(() => playAudioTone(960, 0.3, 'sine'), 90)

    return { xyBosonGained, protonDecay }
  }

  /**
   * 校準規範場耦合常數同調 (Align Gauge Couplings)
   */
  public alignGaugeCouplings(): boolean {
    if (this.state.gaugeCouplingUnificationPercent >= 99) return false

    this.state.gaugeCouplingUnificationPercent = Math.min(100, parseFloat((this.state.gaugeCouplingUnificationPercent + 4.5).toFixed(1)))
    this.state.gutEnergyExponent = parseFloat((16.0 + (this.state.gaugeCouplingUnificationPercent / 500)).toFixed(2))
    this.saveState()

    playAudioTone(520, 0.15, 'sine')
    setTimeout(() => playAudioTone(780, 0.2, 'triangle'), 80)

    return true
  }

  /**
   * 凝聚冷卻大統一磁單極子 (Condense Magnetic Monopoles)
   */
  public condenseMagneticMonopoles(): number {
    const cost = 100
    if (this.state.unificationFlux < cost) return 0

    this.state.unificationFlux -= cost
    this.state.monopoleDensity = parseFloat((this.state.monopoleDensity + 0.15).toFixed(2))
    this.state.gaugeCouplingUnificationPercent = Math.min(100, parseFloat((this.state.gaugeCouplingUnificationPercent + 2.5).toFixed(1)))

    this.saveState()

    playAudioTone(330, 0.2, 'triangle')
    setTimeout(() => playAudioTone(660, 0.3, 'sine'), 100)

    return this.state.monopoleDensity
  }

  /**
   * 主循環更新
   */
  public update(delta: number): void {
    if (delta < 0) return
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 自然產生微量大統一通量
    const passiveGain = Math.round((this.state.xyBosonYieldCounts * 0.1) + (this.state.gaugeCouplingUnificationPercent / 50))
    this.state.unificationFlux += Math.max(1, passiveGain)

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
          ...parsed
        }
      }
    } catch {
      // fallback
    }
  }
}

export const gutCollider = new GUTColliderEngine()
