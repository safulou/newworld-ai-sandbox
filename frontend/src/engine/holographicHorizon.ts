/**
 * holographicHorizon.ts
 * 全息宇宙事件視界編碼矩陣引擎 (Holographic Horizon Encoding Matrix Engine)
 * 模擬全息原理 (Holographic Principle)、AdS/CFT 反德西特體-邊界對偶、
 * 貝肯斯坦-霍金視界熵編碼與 Ryu-Takayanagi 全息糾纏表面投影
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

export interface BoundaryQubit {
  id: string
  polarTheta: number // 0 ~ 2PI
  polarRadius: number // 0 ~ 1
  stateValue: number // 0 or 1 or superposition 0.5
  entangled: boolean
}

export interface HolographicHorizonState {
  horizonAreaPlanck2: number // 視界普朗克表面積 (A / \ell_p^2)
  bekensteinEntropyBits: number // S = A / (4 * ln 2)
  boundaryQubitsDensity: number // 量子位元密度
  holographicBitsStream: number // 全息位元流產量貨幣
  cftDualityFidelityPercent: number // 對偶保真度 0~100%
  bulkDimensions: number // 預設 5 (AdS_5 x S^5)
  totalProjectionsCount: number
  boundaryQubits: BoundaryQubit[]
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_holographic_horizon_v1'

function generateInitialBoundaryQubits(): BoundaryQubit[] {
  const qubits: BoundaryQubit[] = []
  for (let i = 0; i < 24; i++) {
    const theta = (i * Math.PI * 2) / 24
    qubits.push({
      id: `qubit_${i}`,
      polarTheta: theta,
      polarRadius: 0.95,
      stateValue: Math.random() > 0.5 ? 1 : 0,
      entangled: i % 2 === 0
    })
  }
  return qubits
}

class HolographicHorizonEngine {
  private state: HolographicHorizonState = {
    horizonAreaPlanck2: 4096,
    bekensteinEntropyBits: 1024,
    boundaryQubitsDensity: 0.25,
    holographicBitsStream: 420,
    cftDualityFidelityPercent: 88.5,
    bulkDimensions: 5,
    totalProjectionsCount: 36,
    boundaryQubits: generateInitialBoundaryQubits(),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): HolographicHorizonState {
    return this.state
  }

  public get boundaryQubits(): BoundaryQubit[] {
    return this.state.boundaryQubits
  }

  public get holographicBitsStream(): number {
    return this.state.holographicBitsStream
  }

  public get horizonAreaPlanck2(): number {
    return this.state.horizonAreaPlanck2
  }

  public get bekensteinEntropyBits(): number {
    return this.state.bekensteinEntropyBits
  }

  public get cftDualityFidelityPercent(): number {
    return this.state.cftDualityFidelityPercent
  }

  /**
   * 投影體空間至邊界共形場 (Project Bulk to Boundary)
   */
  public projectBulkToBoundary(): { entropyYield: number; newQubits: number } {
    // 擾動邊界量子位元相態
    this.state.boundaryQubits.forEach(q => {
      q.stateValue = Math.random() > 0.4 ? 1 : 0
      q.entangled = Math.random() < 0.65
    })

    const entropyYield = Math.round(50 + (this.state.horizonAreaPlanck2 / 64) * (this.state.cftDualityFidelityPercent / 100))
    this.state.holographicBitsStream += entropyYield
    this.state.totalProjectionsCount += 1

    // 視界微擴張
    this.state.horizonAreaPlanck2 += 64
    this.state.bekensteinEntropyBits = Math.round(this.state.horizonAreaPlanck2 / 4)

    this.saveState()

    playNoiseBurst(0.18, 0.12)
    playAudioTone(587.33, 0.15, 'sawtooth')
    setTimeout(() => playAudioTone(880, 0.2, 'sine'), 90)

    return { entropyYield, newQubits: 24 }
  }

  /**
   * 同步 AdS/CFT 共形場全息對偶性 (Sync AdS/CFT Duality)
   */
  public syncAdSCFTDuality(): boolean {
    if (this.state.cftDualityFidelityPercent >= 99) return false

    this.state.cftDualityFidelityPercent = Math.min(100, parseFloat((this.state.cftDualityFidelityPercent + 4.5).toFixed(1)))
    this.state.holographicBitsStream += 80

    // 解鎖成就
    achievementsManager.unlock('holographic_architect')

    this.saveState()

    playAudioTone(440, 0.2, 'sine')
    setTimeout(() => playAudioTone(659.25, 0.25, 'triangle'), 80)
    setTimeout(() => playAudioTone(987.77, 0.35, 'sine'), 160)

    return true
  }

  /**
   * 擴展視界表面積並注入貝肯斯坦熵 (Expand Horizon Area)
   */
  public expandHorizonArea(): boolean {
    const cost = 250
    if (this.state.holographicBitsStream < cost) {
      return false
    }

    this.state.holographicBitsStream -= cost
    this.state.horizonAreaPlanck2 += 512
    this.state.bekensteinEntropyBits = Math.round(this.state.horizonAreaPlanck2 / 4)
    this.state.boundaryQubitsDensity = parseFloat((this.state.boundaryQubits.length / (this.state.horizonAreaPlanck2 / 64)).toFixed(3))

    this.saveState()

    playAudioTone(330, 0.25, 'triangle')
    setTimeout(() => playAudioTone(493.88, 0.3, 'sine'), 100)

    return true
  }

  /**
   * 體幾何拓撲切片壓縮 (Compress Bulk Slice)
   */
  public compressBulkSlice(): number {
    const gained = Math.round(this.state.bekensteinEntropyBits * 0.12 + 45)
    this.state.holographicBitsStream += gained
    this.state.cftDualityFidelityPercent = Math.min(100, parseFloat((this.state.cftDualityFidelityPercent + 1.2).toFixed(1)))

    this.saveState()

    playAudioTone(740, 0.15, 'sine')
    setTimeout(() => playAudioTone(1108.73, 0.2, 'sine'), 80)

    return gained
  }

  /**
   * 主循環更新
   */
  public update(delta: number): void {
    if (delta < 0) return
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 自然微幅邊界位元漲落
    const passiveBits = Math.round((this.state.bekensteinEntropyBits / 200) * (this.state.cftDualityFidelityPercent / 100))
    this.state.holographicBitsStream += Math.max(1, passiveBits)

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
          boundaryQubits: parsed.boundaryQubits || generateInitialBoundaryQubits()
        }
      }
    } catch {
      // fallback
    }
  }
}

export const holographicHorizon = new HolographicHorizonEngine()
