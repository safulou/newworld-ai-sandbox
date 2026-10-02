/**
 * NewWorld AI Sandbox - Quantum Stellar Beacon Network & Fast Travel Engine
 * 
 * Implements:
 * - Deployable Quantum Stellar Beacon anchors across 4 dimensions (Overworld, Deep Abyss, Orbital Station, Deep Space)
 * - Frequency tuning & 3D holographic star map topological network routing
 * - Instant quantum wave collapse teleportation (zero latency coordinate warping)
 * - Pure Web Audio procedural audio synthesis (Rhythmic quantum beacon pings, space-fold warping audio)
 * - LocalStorage state & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type BeaconDimension = 'overworld' | 'deep_abyss' | 'orbital_space' | 'deep_space'

export interface QuantumBeacon {
  id: string
  name: string
  dimension: BeaconDimension
  coords: [number, number, number]
  frequencyGHz: number
  color: string
  isOnline: boolean
  teleportCount: number
  description: string
  isCustom: boolean
}

export interface BeaconNetworkStats {
  totalBeacons: number
  activeBeacons: number
  networkStrength: number     // 0 to 100%
  quantumEntropy: number      // 0 to 100%
  totalTeleports: number
  lastWarpBeaconId: string | null
}

export const DEFAULT_BEACONS: QuantumBeacon[] = [
  {
    id: 'beacon_city',
    name: '新世界拓荒者核心廣場 (Pioneer Core Plaza)',
    dimension: 'overworld',
    coords: [0, 16, 0],
    frequencyGHz: 1420.405,
    color: '#00ffff',
    isOnline: true,
    teleportCount: 0,
    description: '母星主城中央量子噴泉傳送基座，連線訊號極為穩定。',
    isCustom: false,
  },
  {
    id: 'beacon_orbit',
    name: '軌道星艦船塢氣閘平台 (Orbital Station Airlock)',
    dimension: 'orbital_space',
    coords: [0, 195, 0],
    frequencyGHz: 2450.000,
    color: '#ff00aa',
    isOnline: true,
    teleportCount: 0,
    description: '高度 Y=195 微重力太空港，可俯瞰母星全景與星艦泊位。',
    isCustom: false,
  },
  {
    id: 'beacon_abyss',
    name: '深海海溝黑色煙囪熱液口 (Abyssal Hydrothermal Vent)',
    dimension: 'deep_abyss',
    coords: [15, -58, -42],
    frequencyGHz: 915.200,
    color: '#00ff88',
    isOnline: true,
    teleportCount: 0,
    description: '水下 -58m 深海熱液開採基地，伴隨地心高壓電漿地熱。',
    isCustom: false,
  },
  {
    id: 'beacon_cygnus',
    name: 'Cygnus-X1 脈衝星前哨站 (Cygnus Outpost)',
    dimension: 'deep_space',
    coords: [9200, 450, -3100],
    frequencyGHz: 5800.500,
    color: '#ffaa00',
    isOnline: true,
    teleportCount: 0,
    description: '遠征深空高能脈衝星雲，採集反物質與宇宙射線。',
    isCustom: false,
  },
  {
    id: 'beacon_singularity',
    name: 'Event Horizon 黑洞視界觀測塔 (Singularity Spire)',
    dimension: 'deep_space',
    coords: [0, -1500, -25000],
    frequencyGHz: 9999.999,
    color: '#aa00ff',
    isOnline: true,
    teleportCount: 0,
    description: '時空曲率無限奇異點邊緣，全維度量子通訊極限端點。',
    isCustom: false,
  },
]

export class StellarBeaconEngine {
  public beacons: QuantumBeacon[] = JSON.parse(JSON.stringify(DEFAULT_BEACONS))
  public stats: BeaconNetworkStats = {
    totalBeacons: 5,
    activeBeacons: 5,
    networkStrength: 98,
    quantumEntropy: 1.2,
    totalTeleports: 0,
    lastWarpBeaconId: null,
  }

  public logs: string[] = ['[量子導航] 全域量子躍遷信標網絡拓撲已鎖定。']
  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.refreshStats()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public addLog(msg: string): void {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false })
    this.logs.unshift(`[${time}] ${msg}`)
    if (this.logs.length > 50) this.logs.pop()
  }

  public warpToBeacon(beaconId: string, onTeleport?: (coords: [number, number, number]) => void): { success: boolean; message: string } {
    const beacon = this.beacons.find(b => b.id === beaconId)
    if (!beacon) return { success: false, message: '找不到指定量子信標' }
    if (!beacon.isOnline) return { success: false, message: '該信標處於離線狀態，無法建立波函數坍縮通道！' }

    beacon.teleportCount++
    this.stats.totalTeleports++
    this.stats.lastWarpBeaconId = beaconId

    this.addLog(`🌀【量子波函數坍縮折躍】瞬時折躍至【${beacon.name}】！座標: [${beacon.coords.join(', ')}]`)
    this.playQuantumWarp()

    if (onTeleport) {
      onTeleport(beacon.coords)
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('beacon-teleport', { detail: { coords: beacon.coords, dimension: beacon.dimension } }))
    }

    if (this.stats.totalTeleports >= 5) {
      achievements.unlock('quantum_cartographer')
    }

    this.saveState()
    return { success: true, message: `已折躍至 ${beacon.name}` }
  }

  public deployCustomBeacon(name: string, coords: [number, number, number], dimension: BeaconDimension, color: string = '#00ffff'): QuantumBeacon {
    const newBeacon: QuantumBeacon = {
      id: `beacon_custom_${Date.now()}`,
      name: name.trim() || '自訂量子信標錨點',
      dimension,
      coords,
      frequencyGHz: parseFloat((1000 + Math.random() * 8000).toFixed(3)),
      color,
      isOnline: true,
      teleportCount: 0,
      description: '開拓者手動部署之空間相位鎖定信標。',
      isCustom: true,
    }

    this.beacons.push(newBeacon)
    this.refreshStats()
    this.addLog(`[信標部署] 成功在座標 [${coords.join(', ')}] 啟動新信標【${newBeacon.name}】！頻率: ${newBeacon.frequencyGHz} GHz。`)
    this.playBeaconPulse()

    if (this.beacons.length >= 6) {
      achievements.unlock('quantum_cartographer')
    }

    this.saveState()
    return newBeacon
  }

  public removeCustomBeacon(beaconId: string): boolean {
    const idx = this.beacons.findIndex(b => b.id === beaconId && b.isCustom)
    if (idx < 0) return false
    const removed = this.beacons.splice(idx, 1)[0]
    this.refreshStats()
    this.addLog(`[信標拆卸] 已解除信標【${removed.name}】之量子糾纏頻率。`)
    this.saveState()
    return true
  }

  public toggleBeacon(beaconId: string): void {
    const beacon = this.beacons.find(b => b.id === beaconId)
    if (!beacon) return
    beacon.isOnline = !beacon.isOnline
    this.refreshStats()
    this.addLog(`信標 [${beacon.name}] 現已${beacon.isOnline ? '併線上線' : '切換隔離離線'}`)
    this.saveState()
  }

  private refreshStats(): void {
    this.stats.totalBeacons = this.beacons.length
    this.stats.activeBeacons = this.beacons.filter(b => b.isOnline).length
    this.stats.networkStrength = Math.round((this.stats.activeBeacons / Math.max(1, this.stats.totalBeacons)) * 100)
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return
    // Subtle quantum entropy micro-drift
    this.stats.quantumEntropy = 1.0 + Math.sin(Date.now() * 0.001) * 0.4
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playBeaconPulse(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1760, now) // A6
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  public playQuantumWarp(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Down-sweep followed by upward sonic ring
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(2400, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.35)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.7)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.7)
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_stellar_beacons')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) Object.assign(this.stats, parsed.stats)
        if (parsed.customBeacons && Array.isArray(parsed.customBeacons)) {
          for (const cb of parsed.customBeacons) {
            if (!this.beacons.some(b => b.id === cb.id)) {
              this.beacons.push(cb)
            }
          }
        }
      }
    } catch {
      // Ignore load error
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const customBeacons = this.beacons.filter(b => b.isCustom)
      const payload = {
        stats: this.stats,
        customBeacons,
      }
      localStorage.setItem('nw_stellar_beacons', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const stellarBeacons = new StellarBeaconEngine()
