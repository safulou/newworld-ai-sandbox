/**
 * cosmicHoloStarchart.ts
 * 量子糾纏全息星圖沙盤引擎 (Quantum Entangled Holo-Starchart Engine)
 * 提供 4 階宏觀多尺度宇宙星圖縮放（宇宙纖維網、本超星系團、鄰近恆星系、沙盒系統），
 * 量子糾纏中繼站同步與暗物質纖維網拓撲觀測
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

export type StarchartZoomLevel = 'cosmic_web' | 'local_supercluster' | 'stellar_neighborhood' | 'system_sandbox'

export interface CosmicNode {
  id: string
  name: string
  scale: StarchartZoomLevel
  x: number
  y: number
  z: number
  activityLevel: number // 0~100%
  darkMatterDensity: number // 0.1~5.0
  entangled: boolean
  spectralType: string
}

export interface StarchartState {
  currentZoom: StarchartZoomLevel
  nodes: CosmicNode[]
  entanglementSyncRatePercent: number // 0~100%
  stellarCartographyData: number // 星圖製圖點數
  observedFilamentCount: number
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_cosmic_starchart_v1'

const DEFAULT_NODES: CosmicNode[] = [
  // 宇宙纖維網尺度
  { id: 'node_perseus', name: '英仙-雙魚超星系團纖維 (Perseus-Pisces)', scale: 'cosmic_web', x: -120, y: 80, z: 40, activityLevel: 94, darkMatterDensity: 3.8, entangled: true, spectralType: 'Cosmic Void Wall' },
  { id: 'node_laniakea', name: '拉尼亞凱亞超星系團核心 (Laniakea Core)', scale: 'cosmic_web', x: 0, y: 0, z: 0, activityLevel: 99, darkMatterDensity: 4.5, entangled: true, spectralType: 'Great Attractor' },
  { id: 'node_shapley', name: '夏普力超星系團引力井 (Shapley Supercluster)', scale: 'cosmic_web', x: 150, y: -60, z: -80, activityLevel: 88, darkMatterDensity: 4.9, entangled: false, spectralType: 'Supercluster Massive' },

  // 本超星系團尺度
  { id: 'node_virgo', name: '處女座星系團主引力源 (Virgo Cluster)', scale: 'local_supercluster', x: -40, y: 30, z: 10, activityLevel: 82, darkMatterDensity: 2.9, entangled: true, spectralType: 'Giant Elliptical M87' },
  { id: 'node_centaurus', name: '半人馬座大引力源支流 (Centaurus Flow)', scale: 'local_supercluster', x: 60, y: -20, z: 30, activityLevel: 76, darkMatterDensity: 3.1, entangled: false, spectralType: 'Spiral Dense' },

  // 鄰近恆星系尺度
  { id: 'node_sirius', name: '天狼星雙星系統 (Sirius A/B)', scale: 'stellar_neighborhood', x: -15, y: -10, z: 5, activityLevel: 91, darkMatterDensity: 1.2, entangled: true, spectralType: 'A1V + DA2 White Dwarf' },
  { id: 'node_vega', name: '織女星塵埃盤系 (Vega Alpha Lyrae)', scale: 'stellar_neighborhood', x: 25, y: 15, z: -10, activityLevel: 85, darkMatterDensity: 1.4, entangled: false, spectralType: 'A0V Fast Rotator' },

  // 沙盒系統尺度
  { id: 'node_sol_prime', name: '新世界太陽系母星軌道 (Sol Prime)', scale: 'system_sandbox', x: 0, y: 0, z: 0, activityLevel: 100, darkMatterDensity: 1.0, entangled: true, spectralType: 'G2V Main Sequence' },
  { id: 'node_ring_orbit', name: '環形世界巨構 1 AU 軌道帶', scale: 'system_sandbox', x: 10, y: 0, z: 5, activityLevel: 96, darkMatterDensity: 0.8, entangled: true, spectralType: 'Megastructure Habitat' }
]

class CosmicHoloStarchartEngine {
  private state: StarchartState = {
    currentZoom: 'system_sandbox',
    nodes: JSON.parse(JSON.stringify(DEFAULT_NODES)),
    entanglementSyncRatePercent: 82.5,
    stellarCartographyData: 280,
    observedFilamentCount: 16,
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): StarchartState {
    return this.state
  }

  public get currentZoom(): StarchartZoomLevel {
    return this.state.currentZoom
  }

  public get nodes(): CosmicNode[] {
    return this.state.nodes
  }

  public get filteredNodes(): CosmicNode[] {
    return this.state.nodes.filter(n => n.scale === this.state.currentZoom)
  }

  public get entanglementSyncRatePercent(): number {
    return this.state.entanglementSyncRatePercent
  }

  public get stellarCartographyData(): number {
    return this.state.stellarCartographyData
  }

  /**
   * 切換星圖尺度 (Zoom Level)
   */
  public setZoomScale(level: StarchartZoomLevel): void {
    if (this.state.currentZoom === level) return
    this.state.currentZoom = level
    this.saveState()

    // 縮放音效
    playAudioTone(380, 0.15, 'sine')
    setTimeout(() => playAudioTone(570, 0.2, 'triangle'), 60)
  }

  /**
   * 量子糾纏同步中繼節點 (Sync Entangled Relay)
   */
  public syncEntangledRelay(nodeId: string): boolean {
    const node = this.state.nodes.find(n => n.id === nodeId)
    if (!node) return false

    node.entangled = true
    this.state.entanglementSyncRatePercent = Math.min(100, this.state.entanglementSyncRatePercent + 4)
    this.state.stellarCartographyData += 50
    this.state.observedFilamentCount += 1

    // 檢查成就
    const allEntangled = this.state.nodes.every(n => n.entangled)
    if (allEntangled || this.state.observedFilamentCount >= 20) {
      achievementsManager.unlock('cosmic_cartographer')
    }

    this.saveState()

    // 量子雙和弦
    playAudioTone(660, 0.2, 'sine')
    setTimeout(() => playAudioTone(990, 0.3, 'sine'), 100)
    return true
  }

  /**
   * 掃描區域獲取製圖數據 (Scan Region)
   */
  public scanStellarRegion(): number {
    const reward = Math.round(30 + this.state.entanglementSyncRatePercent * 0.4)
    this.state.stellarCartographyData += reward
    this.state.observedFilamentCount += 1
    this.saveState()

    playAudioTone(523, 0.12, 'triangle')
    setTimeout(() => playAudioTone(659, 0.18, 'sine'), 80)
    return reward
  }

  /**
   * 解析暗物質纖維網 (Analyze Dark Matter Filament)
   */
  public analyzeDarkMatterFilament(): boolean {
    if (this.state.stellarCartographyData < 80) return false
    this.state.stellarCartographyData -= 80
    this.state.entanglementSyncRatePercent = Math.min(100, this.state.entanglementSyncRatePercent + 6)
    this.saveState()

    playAudioTone(440, 0.2, 'sawtooth')
    setTimeout(() => playAudioTone(880, 0.3, 'sine'), 90)
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

    // 節點活動微擾
    for (const n of this.state.nodes) {
      if (Math.random() < 0.2) {
        n.activityLevel = Math.min(100, Math.max(30, n.activityLevel + (Math.random() - 0.5) * 4))
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
          nodes: parsed.nodes || JSON.parse(JSON.stringify(DEFAULT_NODES))
        }
      }
    } catch {
      // fallback
    }
  }
}

export const cosmicHoloStarchart = new CosmicHoloStarchartEngine()
