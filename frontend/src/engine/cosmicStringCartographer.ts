/**
 * cosmicStringCartographer.ts
 * 宇宙弦微波背景輻射透鏡測繪引擎 (Cosmic String CMB Lensing Cartographer Engine)
 * 模擬一維太初拓撲缺陷宇宙弦、錐形空間度規角虧缺雙重透鏡成像、
 * Kaiser-Stebbins 效應 CMB 階躍溫差與尖端/扭結引力波微爆
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

export type CosmicStringType = 'nambu_goto_open' | 'oscillating_loop' | 'superconducting_string' | 'cosmic_superstring'

export interface CosmicStringState {
  stringTensionGmuE7: number // G \mu / c^2 \times 10^7，基準 1.25
  deficitAngleArcsec: number // 角度虧缺 (角秒) \Delta \theta = 8 \pi G \mu
  cmbStepDeltaMicroK: number // Kaiser-Stebbins 溫差階躍 (\mu K)
  gravitationalWaveBursts: number // 捕獲引力波爆發次數
  surveyCoveragePercent: number // 巡天覆蓋率 0~100%
  stringLoopCount: number // 觀測閉環數
  cosmicStringFlux: number // 宇宙弦測繪數據貨幣
  stringType: CosmicStringType
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_cosmic_string_v1'

class CosmicStringCartographerEngine {
  private state: CosmicStringState = {
    stringTensionGmuE7: 1.25,
    deficitAngleArcsec: 2.4,
    cmbStepDeltaMicroK: 8.5,
    gravitationalWaveBursts: 12,
    surveyCoveragePercent: 76.5,
    stringLoopCount: 4,
    cosmicStringFlux: 390,
    stringType: 'oscillating_loop',
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): CosmicStringState {
    return this.state
  }

  public get stringTensionGmuE7(): number {
    return this.state.stringTensionGmuE7
  }

  public get deficitAngleArcsec(): number {
    return this.state.deficitAngleArcsec
  }

  public get cmbStepDeltaMicroK(): number {
    return this.state.cmbStepDeltaMicroK
  }

  public get gravitationalWaveBursts(): number {
    return this.state.gravitationalWaveBursts
  }

  public get surveyCoveragePercent(): number {
    return this.state.surveyCoveragePercent
  }

  public get cosmicStringFlux(): number {
    return this.state.cosmicStringFlux
  }

  public get stringType(): CosmicStringType {
    return this.state.stringType
  }

  /**
   * 切換宇宙弦型態
   */
  public switchStringType(type: CosmicStringType): void {
    if (this.state.stringType === type) return
    this.state.stringType = type
    this.saveState()

    playAudioTone(415.3, 0.15, 'sine')
    setTimeout(() => playAudioTone(622.25, 0.2, 'triangle'), 80)
  }

  /**
   * 捕捉尖端/扭結引力波微爆 (Detect Gravitational Wave Burst)
   */
  public detectGravitationalBurst(): { fluxYield: number; burstAmplitude: number } {
    const burstAmplitude = parseFloat((0.5 + Math.random() * 1.5).toFixed(2))
    const fluxYield = Math.round(50 + this.state.stringTensionGmuE7 * 20 + burstAmplitude * 15)

    this.state.gravitationalWaveBursts += 1
    this.state.cosmicStringFlux += fluxYield
    this.state.stringLoopCount += 1

    // 解鎖成就
    achievementsManager.unlock('cosmic_string_hunter')

    this.saveState()

    // 引力波微爆高頻尖嘯與衝量
    playNoiseBurst(0.2, 0.15)
    playAudioTone(220, 0.25, 'sawtooth')
    setTimeout(() => playAudioTone(880, 0.35, 'sawtooth'), 80)

    return { fluxYield, burstAmplitude }
  }

  /**
   * 巡天測繪 CMB 雙重透鏡階躍 (Survey CMB Lensing)
   */
  public surveyCMBLensing(): boolean {
    if (this.state.surveyCoveragePercent >= 99) return false

    this.state.surveyCoveragePercent = Math.min(100, parseFloat((this.state.surveyCoveragePercent + 3.5).toFixed(1)))
    this.state.cosmicStringFlux += 65
    this.state.cmbStepDeltaMicroK = parseFloat((8.5 + (this.state.surveyCoveragePercent / 20)).toFixed(1))

    this.saveState()

    playAudioTone(550, 0.15, 'sine')
    setTimeout(() => playAudioTone(770, 0.2, 'sine'), 80)

    return true
  }

  /**
   * 微調宇宙弦張力模型 (Adjust String Tension)
   */
  public adjustStringTension(delta: number): void {
    const nextT = Math.max(0.2, Math.min(5.0, parseFloat((this.state.stringTensionGmuE7 + delta).toFixed(2))))
    this.state.stringTensionGmuE7 = nextT
    this.state.deficitAngleArcsec = parseFloat((nextT * 1.92).toFixed(2))
    this.saveState()

    playAudioTone(440, 0.12, 'triangle')
  }

  /**
   * 主循環更新
   */
  public update(delta: number): void {
    if (delta < 0) return
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 宇宙弦振盪自律產生微量測繪通量
    const passive = Math.round(this.state.stringTensionGmuE7 * 2 + (this.state.surveyCoveragePercent / 40))
    this.state.cosmicStringFlux += Math.max(1, passive)

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

export const cosmicStringCartographer = new CosmicStringCartographerEngine()
