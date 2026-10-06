/**
 * spinfoamGeometry.ts
 * 時空量子幾何自旋泡沫網絡引擎 (Spinfoam Quantum Geometry Lattice Engine)
 * 模擬圈量子引力 (LQG) 自旋網絡節點演化、4-單純形自旋泡沫幾何躍遷與離散曲率量子激發
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

export type GeometryLatticeType = 'tetrahedron' | 'hypersphere' | 'pentachoron' | 'torus'

export interface SpinfoamNode {
  id: string
  x: number
  y: number
  z: number
  spinJ: number // 1/2 = 0.5, 1, 3/2 = 1.5, 2...
  intertwinerVal: number
  areaQuantum: number // 8 \pi \gamma \ell_p^2 \sqrt{j(j+1)}
}

export interface SpinfoamState {
  currentLattice: GeometryLatticeType
  planckianNodesCount: number
  averageSpinQuantum: number
  quantumCurvatureQuanta: number // 離散曲率量子貨幣
  fourSimplexCoherencePercent: number // 0~100%
  totalQuantumVolumePlanck: number
  nodes: SpinfoamNode[]
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_spinfoam_geometry_v1'

function generateInitialNodes(): SpinfoamNode[] {
  const list: SpinfoamNode[] = []
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16
    const r = 40 + (i % 3) * 15
    const j = [0.5, 1.0, 1.5, 2.0][i % 4]
    list.push({
      id: `node_${i}`,
      x: Math.round(Math.cos(angle) * r),
      y: Math.round(Math.sin(angle) * r),
      z: (i % 4) * 10 - 15,
      spinJ: j,
      intertwinerVal: (i % 2) + 1,
      areaQuantum: parseFloat((8 * Math.PI * 0.237 * Math.sqrt(j * (j + 1))).toFixed(2))
    })
  }
  return list
}

class SpinfoamGeometryEngine {
  private state: SpinfoamState = {
    currentLattice: 'tetrahedron',
    planckianNodesCount: 16,
    averageSpinQuantum: 1.25,
    quantumCurvatureQuanta: 310,
    fourSimplexCoherencePercent: 84.5,
    totalQuantumVolumePlanck: 1420,
    nodes: generateInitialNodes(),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): SpinfoamState {
    return this.state
  }

  public get nodes(): SpinfoamNode[] {
    return this.state.nodes
  }

  public get quantumCurvatureQuanta(): number {
    return this.state.quantumCurvatureQuanta
  }

  public get fourSimplexCoherencePercent(): number {
    return this.state.fourSimplexCoherencePercent
  }

  public get currentLattice(): GeometryLatticeType {
    return this.state.currentLattice
  }

  /**
   * 切換圈量子空間晶格模態
   */
  public switchLattice(type: GeometryLatticeType): void {
    if (this.state.currentLattice === type) return
    this.state.currentLattice = type
    this.saveState()

    playAudioTone(440, 0.15, 'sine')
    setTimeout(() => playAudioTone(660, 0.2, 'triangle'), 80)
  }

  /**
   * 演算圈量子自旋網絡演化 (Evolve Spin Network)
   */
  public evolveSpinNetwork(): boolean {
    // 每個節點自旋躍遷
    this.state.nodes.forEach(n => {
      const step = Math.random() < 0.5 ? 0.5 : -0.5
      n.spinJ = Math.max(0.5, Math.min(3.0, n.spinJ + step))
      n.areaQuantum = parseFloat((8 * Math.PI * 0.237 * Math.sqrt(n.spinJ * (n.spinJ + 1))).toFixed(2))
    })

    // 重新彙整平均自旋與體積
    let sumJ = 0
    this.state.nodes.forEach(n => sumJ += n.spinJ)
    this.state.averageSpinQuantum = parseFloat((sumJ / this.state.nodes.length).toFixed(2))
    this.state.totalQuantumVolumePlanck += Math.round(this.state.averageSpinQuantum * 45)
    this.state.fourSimplexCoherencePercent = Math.min(100, this.state.fourSimplexCoherencePercent + 3)

    this.saveState()

    // 圈量子躍遷琶音
    playAudioTone(523.25, 0.1, 'sine')
    setTimeout(() => playAudioTone(659.25, 0.12, 'sine'), 50)
    setTimeout(() => playAudioTone(783.99, 0.15, 'triangle'), 100)
    return true
  }

  /**
   * 激發離散曲率量子 (Excite Quantum Curvature)
   */
  public exciteQuantumCurvature(): number {
    const gained = Math.round(this.state.averageSpinQuantum * 25 + (this.state.fourSimplexCoherencePercent / 2))
    this.state.quantumCurvatureQuanta += gained

    // 成就解鎖
    achievementsManager.unlock('spinfoam_weaver')

    this.saveState()

    playNoiseBurst(0.12, 0.1)
    playAudioTone(880, 0.2, 'sine')
    return gained
  }

  /**
   * 諧振 4-單純形幾何振幅 (Harmonize Simplex Amplitude)
   */
  public harmonizeSimplexAmplitude(): boolean {
    if (this.state.fourSimplexCoherencePercent >= 99) return false

    this.state.fourSimplexCoherencePercent = Math.min(100, this.state.fourSimplexCoherencePercent + 12)
    this.saveState()

    playAudioTone(370, 0.2, 'sine')
    setTimeout(() => playAudioTone(740, 0.3, 'sine'), 90)
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

    // 自然微量自旋漂移
    if (Math.random() < 0.2) {
      const idx = Math.floor(Math.random() * this.state.nodes.length)
      const target = this.state.nodes[idx]
      if (target) {
        target.spinJ = Math.max(0.5, Math.min(3.0, target.spinJ + (Math.random() < 0.5 ? 0.5 : -0.5)))
      }
    }

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
          nodes: parsed.nodes || generateInitialNodes()
        }
      }
    } catch {
      // fallback
    }
  }
}

export const spinfoamGeometry = new SpinfoamGeometryEngine()
