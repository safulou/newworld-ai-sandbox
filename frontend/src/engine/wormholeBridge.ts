/**
 * wormholeBridge.ts
 * 量子引力蟲洞橋與愛因斯坦-羅森橋引擎 (ER=EPR Quantum Wormhole Bridge Engine)
 * 模擬 ER=EPR 猜想（量子糾纏即微觀蟲洞）、卡西米爾效應負能量喉部支撐、
 * 莫里斯-索恩可穿越幾何與跨喉部量子傳態
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

export type WormholeTopologyType = 'planckian' | 'morris_thorne' | 'kerr_rift' | 'higher_dim'

export interface WormholeThroatNode {
  id: string
  zCoord: number // -10 ~ +10 喉部深度
  radius: number
  phase: number
}

export interface WormholeBridgeState {
  throatRadiusPlanck: number // 普朗克長度單位 基準 120
  casimirNegativeEnergyPercent: number // 0~100%
  entanglementFidelityPercent: number // 0~100%
  traversableFlux: number // 可穿越通量貨幣
  totalTeleportations: number
  topologyType: WormholeTopologyType
  throatNodes: WormholeThroatNode[]
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_wormhole_bridge_v1'

function generateInitialThroatNodes(): WormholeThroatNode[] {
  const nodes: WormholeThroatNode[] = []
  for (let i = 0; i < 11; i++) {
    const z = (i - 5) * 2 // -10 to +10
    // 雙曲喉部半徑：r(z) = r0 * cosh(z / a)
    const rad = 25 + Math.pow(z / 2, 2) * 1.5
    nodes.push({
      id: `node_z_${z}`,
      zCoord: z,
      radius: rad,
      phase: (i * Math.PI) / 5
    })
  }
  return nodes
}

class WormholeBridgeEngine {
  private state: WormholeBridgeState = {
    throatRadiusPlanck: 120,
    casimirNegativeEnergyPercent: 78.5,
    entanglementFidelityPercent: 92.0,
    traversableFlux: 350,
    totalTeleportations: 16,
    topologyType: 'morris_thorne',
    throatNodes: generateInitialThroatNodes(),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): WormholeBridgeState {
    return this.state
  }

  public get throatRadiusPlanck(): number {
    return this.state.throatRadiusPlanck
  }

  public get casimirNegativeEnergyPercent(): number {
    return this.state.casimirNegativeEnergyPercent
  }

  public get entanglementFidelityPercent(): number {
    return this.state.entanglementFidelityPercent
  }

  public get traversableFlux(): number {
    return this.state.traversableFlux
  }

  public get topologyType(): WormholeTopologyType {
    return this.state.topologyType
  }

  public get throatNodes(): WormholeThroatNode[] {
    return this.state.throatNodes
  }

  /**
   * 切換蟲洞幾何拓撲
   */
  public switchTopology(type: WormholeTopologyType): void {
    if (this.state.topologyType === type) return
    this.state.topologyType = type
    this.saveState()

    playAudioTone(440, 0.15, 'sine')
    setTimeout(() => playAudioTone(659.25, 0.2, 'triangle'), 80)
  }

  /**
   * 注入卡西米爾負能量通量 (Inject Casimir Negative Energy)
   */
  public injectCasimirNegativeEnergy(): boolean {
    if (this.state.casimirNegativeEnergyPercent >= 99) return false

    this.state.casimirNegativeEnergyPercent = Math.min(100, parseFloat((this.state.casimirNegativeEnergyPercent + 8.5).toFixed(1)))
    this.state.throatRadiusPlanck += 15

    // 重新調整節點喉徑
    this.state.throatNodes.forEach(n => {
      n.radius = parseFloat((25 + (this.state.throatRadiusPlanck / 10) + Math.pow(n.zCoord / 2, 2) * 1.5).toFixed(1))
    })

    this.saveState()

    playNoiseBurst(0.15, 0.1)
    playAudioTone(320, 0.2, 'sawtooth')
    setTimeout(() => playAudioTone(640, 0.25, 'sine'), 90)

    return true
  }

  /**
   * 執行跨喉部量子傳態 (Teleport Quantum Payload)
   */
  public teleportQuantumPayload(): { yieldFlux: number; success: boolean } {
    if (this.state.casimirNegativeEnergyPercent < 30) {
      return { yieldFlux: 0, success: false }
    }

    const yieldFlux = Math.round(45 + (this.state.throatRadiusPlanck / 5) * (this.state.entanglementFidelityPercent / 100))
    this.state.traversableFlux += yieldFlux
    this.state.totalTeleportations += 1

    // 消耗微幅負能量
    this.state.casimirNegativeEnergyPercent = Math.max(20, parseFloat((this.state.casimirNegativeEnergyPercent - 3.5).toFixed(1)))

    // 解鎖成就
    achievementsManager.unlock('wormhole_navigator')

    this.saveState()

    // 跨時空躍遷音效
    playAudioTone(261.63, 0.1, 'sine')
    setTimeout(() => playAudioTone(523.25, 0.15, 'sine'), 60)
    setTimeout(() => playAudioTone(1046.5, 0.3, 'triangle'), 120)

    return { yieldFlux, success: true }
  }

  /**
   * 校準雙端量子糾纏保真度 (Stabilize Entanglement)
   */
  public stabilizeEntanglement(): boolean {
    if (this.state.entanglementFidelityPercent >= 99) return false

    this.state.entanglementFidelityPercent = Math.min(100, parseFloat((this.state.entanglementFidelityPercent + 6.0).toFixed(1)))
    this.saveState()

    playAudioTone(587.33, 0.15, 'sine')
    setTimeout(() => playAudioTone(880, 0.25, 'sine'), 80)

    return true
  }

  /**
   * 拓寬喉部幾何半徑 (Widen Throat)
   */
  public widenThroat(): boolean {
    const cost = 120
    if (this.state.traversableFlux < cost) return false

    this.state.traversableFlux -= cost
    this.state.throatRadiusPlanck += 40
    this.state.casimirNegativeEnergyPercent = Math.min(100, this.state.casimirNegativeEnergyPercent + 5)
    this.saveState()

    playAudioTone(380, 0.2, 'triangle')
    setTimeout(() => playAudioTone(760, 0.3, 'sine'), 90)

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

    // 自然微幅負能量耗散
    if (this.state.casimirNegativeEnergyPercent > 40) {
      this.state.casimirNegativeEnergyPercent = Math.max(30, parseFloat((this.state.casimirNegativeEnergyPercent - 0.1).toFixed(2)))
    }

    // 自然產生被動通量
    const passive = Math.round((this.state.throatRadiusPlanck / 100) * (this.state.entanglementFidelityPercent / 100))
    this.state.traversableFlux += Math.max(1, passive)

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
          throatNodes: parsed.throatNodes || generateInitialThroatNodes()
        }
      }
    } catch {
      // fallback
    }
  }
}

export const wormholeBridge = new WormholeBridgeEngine()
