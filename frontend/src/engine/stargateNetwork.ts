/**
 * NewWorld AI Sandbox - Hyperspace Stargate Network & Transit Hub Engine
 * 
 * Implements:
 * - Megastructure Interstellar Stargate Ring Topology
 * - 4 Galactic Terminus Hubs (Sol Prime, Vega Nexus, Centauri Tri-Star, Rim Void Terminus)
 * - 7-Symbol Stargate Chevron Dialing Sequence & Locking Mechanism
 * - Wormhole Event Horizon "Puddle" Vortex Activation
 * - Stability containment field regulation & Transit Toll revenue market
 * - Pure Web Audio procedural audio synthesis (Chevron clack, horizon kawoosh vortex, wormhole traversal chime)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type StargateId = 'sol_prime' | 'vega_nexus' | 'centauri_tristar' | 'rim_void'

export interface StargateHub {
  id: StargateId
  name: string
  galaxySector: string
  distanceLY: number
  transitTollCredits: number
  chevronCode: number[] // 7 glyph indices
  status: 'offline' | 'dialing' | 'active_open' | 'cooling'
  wormholeStability: number // 0 ~ 100%
  color: string
  description: string
}

export interface StargateStats {
  activeOrigin: StargateId
  targetDestination: StargateId | null
  currentChevronLocked: number // 0 to 7
  isWormholeOpen: boolean
  networkPowerKWh: number
  totalTransitsCompleted: number
  totalTollsEarnedCredits: number
  statusMessage: string
}

export const STARGATE_HUBS: Record<StargateId, StargateHub> = {
  sol_prime: {
    id: 'sol_prime',
    name: '太陽系開拓者樞紐 (Sol Gateway Prime)',
    galaxySector: '獵戶臂 核心拓荒區',
    distanceLY: 0,
    transitTollCredits: 1200,
    chevronCode: [1, 4, 9, 14, 18, 24, 31],
    status: 'offline',
    wormholeStability: 100,
    color: '#00e5ff',
    description: '太陽系柯伊伯帶邊界之超環星門，連結全銀河最繁忙的商貿與開拓航線。'
  },
  vega_nexus: {
    id: 'vega_nexus',
    name: '織女星阿爾法超環 (Vega Nexus Ring)',
    galaxySector: '天琴座 織女星二期',
    distanceLY: 25,
    transitTollCredits: 2500,
    chevronCode: [3, 8, 12, 17, 22, 28, 35],
    status: 'offline',
    wormholeStability: 96,
    color: '#00ff88',
    description: '坐落於織女星年輕原行星盤中，充沛的恆星等離子流賦予其超凡能量容量。'
  },
  centauri_tristar: {
    id: 'centauri_tristar',
    name: '半人馬三元雙星門 (Centauri Tri-Star Gate)',
    galaxySector: '半人馬座 南門二前哨',
    distanceLY: 4.37,
    transitTollCredits: 1800,
    chevronCode: [2, 7, 11, 16, 21, 26, 33],
    status: 'offline',
    wormholeStability: 98,
    color: '#ff9100',
    description: '利用三合星引力天平建立的雙向星門，為最近距離深空折躍樞紐。'
  },
  rim_void: {
    id: 'rim_void',
    name: '銀河邊緣虛空終端 (Rim Void Terminus)',
    galaxySector: '銀暈極限 虛空裂隙',
    distanceLY: 58000,
    transitTollCredits: 8000,
    chevronCode: [5, 10, 15, 20, 25, 30, 36],
    status: 'offline',
    wormholeStability: 85,
    color: '#e040fb',
    description: '矗立於銀河外圍星際虛空中的遠古先行者星門，通往未知的暗物質星雲深處。'
  }
}

export class StargateNetworkEngine {
  public hubs: Record<StargateId, StargateHub>
  public stats: StargateStats = {
    activeOrigin: 'sol_prime',
    targetDestination: null,
    currentChevronLocked: 0,
    isWormholeOpen: false,
    networkPowerKWh: 450000,
    totalTransitsCompleted: 0,
    totalTollsEarnedCredits: 0,
    statusMessage: '星門環狀拓撲待命，請選擇目標星域終端並啟動 7 符文編碼鎖定。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.hubs = JSON.parse(JSON.stringify(STARGATE_HUBS))
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  // ── Dialing Controls ───────────────────────────────────────────────────────
  public selectDestination(targetId: StargateId): boolean {
    if (this.stats.isWormholeOpen) return false
    if (targetId === this.stats.activeOrigin) return false

    this.stats.targetDestination = targetId
    this.stats.currentChevronLocked = 0
    this.hubs[this.stats.activeOrigin].status = 'dialing'
    this.stats.statusMessage = `🎯 目標鎖定 [${this.hubs[targetId].name}]，請手動或自動撥動 7 顆星門楔形鎖 (Chevrons)。`
    this.saveState()
    return true
  }

  public lockNextChevron(): boolean {
    if (!this.stats.targetDestination || this.stats.isWormholeOpen) return false
    if (this.stats.currentChevronLocked >= 7) return false

    this.stats.currentChevronLocked += 1
    const target = this.hubs[this.stats.targetDestination]
    const glyphIndex = target.chevronCode[this.stats.currentChevronLocked - 1]

    this.stats.statusMessage = `🔒 楔形鎖 #${this.stats.currentChevronLocked} 鎖定！天體星圖符文 [Glyph ${glyphIndex}] 就位。`
    this.playChevronLockSound()

    if (this.stats.currentChevronLocked === 7) {
      this.stats.statusMessage = '✨ 7 顆楔形鎖全數精準咬合！可隨時激發人工事件視界微型蟲洞！'
    }

    this.saveState()
    return true
  }

  public autoDialAllChevrons(): boolean {
    if (!this.stats.targetDestination || this.stats.isWormholeOpen) return false
    this.stats.currentChevronLocked = 7
    this.stats.statusMessage = '⚡ 自動超導序列編碼完成！7 顆楔形鎖全部成功同調咬合！'
    this.playChevronLockSound()
    this.saveState()
    return true
  }

  public openWormhole(): boolean {
    if (!this.stats.targetDestination || this.stats.currentChevronLocked < 7) return false
    if (this.stats.networkPowerKWh < 25000) {
      this.stats.statusMessage = '⚠️ 星門電網能量儲備不足 (需 25,000 kWh)！'
      return false
    }

    this.stats.networkPowerKWh -= 25000
    this.stats.isWormholeOpen = true
    this.hubs[this.stats.activeOrigin].status = 'active_open'
    const target = this.hubs[this.stats.targetDestination]
    target.status = 'active_open'

    this.stats.statusMessage = `🌀 事件視界蟲洞噴湧張開！雙向引力通道已同調至 [${target.name}]！`
    this.playVortexKawooshSound()
    this.saveState()
    return true
  }

  public traverseWormhole(): boolean {
    if (!this.stats.isWormholeOpen || !this.stats.targetDestination) return false

    const target = this.hubs[this.stats.targetDestination]
    this.stats.totalTransitsCompleted += 1
    const toll = target.transitTollCredits
    this.stats.totalTollsEarnedCredits += toll

    this.stats.statusMessage = `🚀 躍遷成功！您已抵達 [${target.name}]，繳納/收益過路費 ${toll} CR！`

    // Achievement
    achievements.trackProgress('stargate_dialer', 1)

    this.playTraversalSound()

    // Flip origin to new arrival hub
    this.stats.activeOrigin = target.id
    this.stats.targetDestination = null
    this.stats.currentChevronLocked = 0
    this.stats.isWormholeOpen = false
    Object.values(this.hubs).forEach(h => { h.status = 'offline' })

    this.saveState()
    return true
  }

  public shutdownWormhole(): void {
    this.stats.isWormholeOpen = false
    this.stats.currentChevronLocked = 0
    this.stats.targetDestination = null
    Object.values(this.hubs).forEach(h => { h.status = 'offline' })
    this.stats.statusMessage = '🔌 星門超導電磁偏轉線圈已安全關閉，水面視界消散。'
    this.saveState()
  }

  // ── Procedural Web Audio Sound Synthesis ───────────────────────────────────
  public playChevronLockSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  }

  public playVortexKawooshSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Dual oscillator explosive expansion whoosh
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'sawtooth'
    osc2.type = 'sine'
    osc1.frequency.setValueAtTime(50, now)
    osc1.frequency.exponentialRampToValueAtTime(450, now + 0.25)
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.6)

    osc2.frequency.setValueAtTime(90, now)
    osc2.frequency.exponentialRampToValueAtTime(600, now + 0.3)
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.7)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.7)
    osc2.stop(now + 0.7)
  }

  public playTraversalSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [220, 329.63, 440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.06
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_stargate_network', JSON.stringify({
        stats: this.stats,
        hubs: this.hubs
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_stargate_network')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.hubs) {
          this.hubs = parsed.hubs
        }
      }
    } catch { /* ignore */ }
  }
}

export const stargateNetwork = new StargateNetworkEngine()
