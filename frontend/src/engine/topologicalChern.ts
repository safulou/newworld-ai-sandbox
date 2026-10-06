/**
 * topologicalChern.ts
 * 拓撲量子幾何陳類數纖維叢矩陣引擎 (Topological Chern Number Fiber Bundle Matrix Engine)
 * 模擬布里淵區貝里曲率幾何、第一陳類數拓撲不變量 (C \in Z)、
 * 無耗散手性邊緣態與非阿貝爾任意子量子編織
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

export type ChernPhaseType = 'quantum_hall' | 'topological_insulator' | 'weyl_semimetal' | 'fractional_chern'

export interface EdgeChannelWave {
  id: string
  phaseAngle: number
  speed: number
  amplitude: number
}

export interface TopologicalChernState {
  chernNumber: number // 整數拓撲數 C \in Z 基準 1
  berryCurvatureFlux: number // 貝里曲率通量 2pi * C
  chiralEdgeChannels: number // 手性邊緣通道數
  hallConductanceQuantized: number // e^2 / h 倍率
  topologicalProtectionPercent: number // 0~100%
  chiralFluxStockpile: number // 手性拓撲通量貨幣
  phaseType: ChernPhaseType
  totalBraids: number
  edgeWaves: EdgeChannelWave[]
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_topological_chern_v1'

function generateInitialEdgeWaves(): EdgeChannelWave[] {
  const waves: EdgeChannelWave[] = []
  for (let i = 0; i < 8; i++) {
    waves.push({
      id: `wave_${i}`,
      phaseAngle: (i * Math.PI * 2) / 8,
      speed: 1.2 + (i % 3) * 0.4,
      amplitude: 15 + (i % 2) * 8
    })
  }
  return waves
}

class TopologicalChernEngine {
  private state: TopologicalChernState = {
    chernNumber: 1,
    berryCurvatureFlux: 6.28,
    chiralEdgeChannels: 3,
    hallConductanceQuantized: 1.0,
    topologicalProtectionPercent: 94.0,
    chiralFluxStockpile: 310,
    phaseType: 'quantum_hall',
    totalBraids: 20,
    edgeWaves: generateInitialEdgeWaves(),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): TopologicalChernState {
    return this.state
  }

  public get chernNumber(): number {
    return this.state.chernNumber
  }

  public get berryCurvatureFlux(): number {
    return this.state.berryCurvatureFlux
  }

  public get chiralEdgeChannels(): number {
    return this.state.chiralEdgeChannels
  }

  public get hallConductanceQuantized(): number {
    return this.state.hallConductanceQuantized
  }

  public get chiralFluxStockpile(): number {
    return this.state.chiralFluxStockpile
  }

  public get topologicalProtectionPercent(): number {
    return this.state.topologicalProtectionPercent
  }

  public get phaseType(): ChernPhaseType {
    return this.state.phaseType
  }

  public get edgeWaves(): EdgeChannelWave[] {
    return this.state.edgeWaves
  }

  /**
   * 切換拓撲物態相
   */
  public switchPhase(phase: ChernPhaseType): void {
    if (this.state.phaseType === phase) return
    this.state.phaseType = phase
    this.saveState()

    playAudioTone(466.16, 0.15, 'sine')
    setTimeout(() => playAudioTone(698.46, 0.2, 'triangle'), 80)
  }

  /**
   * 躍遷陳類數整數階 (Shift Chern Number)
   */
  public shiftChernNumber(delta: number): boolean {
    const nextC = this.state.chernNumber + delta
    if (nextC < 0 || nextC > 4) return false

    this.state.chernNumber = nextC
    this.state.berryCurvatureFlux = parseFloat((nextC * 2 * Math.PI).toFixed(2))
    this.state.hallConductanceQuantized = nextC
    this.state.chiralEdgeChannels = Math.max(1, nextC * 2)

    this.saveState()

    playAudioTone(350, 0.2, 'sawtooth')
    setTimeout(() => playAudioTone(700, 0.25, 'sine'), 90)

    return true
  }

  /**
   * 任意子幾何編織 (Braid Anyonic Phases)
   */
  public braidAnyonicPhases(): number {
    const gained = Math.round(35 + this.state.chernNumber * 25 + (this.state.topologicalProtectionPercent / 4))
    this.state.chiralFluxStockpile += gained
    this.state.totalBraids += 1

    // 解鎖成就
    achievementsManager.unlock('topological_braider')

    this.saveState()

    // 編織音階
    playNoiseBurst(0.12, 0.08)
    playAudioTone(523.25, 0.1, 'sine')
    setTimeout(() => playAudioTone(659.25, 0.12, 'triangle'), 60)
    setTimeout(() => playAudioTone(783.99, 0.15, 'sine'), 120)

    return gained
  }

  /**
   * 強化拓撲保護度防退相干 (Reinforce Topological Protection)
   */
  public reinforceProtection(): boolean {
    if (this.state.topologicalProtectionPercent >= 99) return false

    this.state.topologicalProtectionPercent = Math.min(100, parseFloat((this.state.topologicalProtectionPercent + 5.5).toFixed(1)))
    this.saveState()

    playAudioTone(600, 0.15, 'sine')
    setTimeout(() => playAudioTone(900, 0.2, 'sine'), 80)

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

    // 手性邊緣態自律無耗散通量
    const passiveGain = Math.round(this.state.chernNumber * 1.5 + (this.state.topologicalProtectionPercent / 50))
    this.state.chiralFluxStockpile += Math.max(1, passiveGain)

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
          edgeWaves: parsed.edgeWaves || generateInitialEdgeWaves()
        }
      }
    } catch {
      // fallback
    }
  }
}

export const topologicalChern = new TopologicalChernEngine()
