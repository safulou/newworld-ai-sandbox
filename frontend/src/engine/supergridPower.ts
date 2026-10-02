/**
 * NewWorld AI Sandbox - Supergrid Power Distribution & Energy Market Engine
 * 
 * Implements:
 * - Multi-base interconnected Supergrid backbone across 4 global substations
 * - Real-time Grid Frequency (50.00 Hz), SMES superconducting energy storage, cascading blackout protection
 * - Dynamic Electricity & Carbon Offset Futures Exchange Market
 * - Pure Web Audio procedural sound synthesis (High-voltage AC hum, frequency divergence alarms, market trade chimes)
 * - LocalStorage state & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export interface Substation {
  id: string
  name: string
  location: string
  generationMW: number
  demandMW: number
  isOnline: boolean
  isShed: boolean
  type: 'nuclear' | 'solar_orbital' | 'hydro_abyssal' | 'industrial'
  color: string
}

export interface MarketTicker {
  kwhPrice: number           // Credits per KWh (0.05 to 0.95)
  carbonPrice: number        // Credits per Ton CO2 (15 to 80)
  priceHistory: number[]     // Last 20 data points
  trend: 'up' | 'down' | 'stable'
}

export interface PlayerWallet {
  credits: number
  powerContractsKWh: number
  carbonCreditsTon: number
  totalProfit: number
}

export interface SupergridStats {
  totalGenerationMW: number
  totalDemandMW: number
  netBalanceMW: number
  gridFrequency: number      // Target: 50.00 Hz
  stabilityPercent: number   // 0 to 100%
  smesCapacityMWh: number    // 10,000 MWh max
  smesStoredMWh: number      // Current energy stored
  smesRateMW: number         // Positive = charging, Negative = discharging
  isBlackout: boolean
  blackoutTimer: number
}

export const SUBSTATIONS_DEFAULT: Substation[] = [
  {
    id: 'sub_alpha',
    name: 'Alpha 都市核心配電所 (Urban Core)',
    location: '新世界中樞市中心 (Chunk 0,0)',
    generationMW: 1200,
    demandMW: 1450,
    isOnline: true,
    isShed: false,
    type: 'solar_orbital',
    color: '#00ffff',
  },
  {
    id: 'sub_beta',
    name: 'Beta 軌道船塢配電所 (Orbital Drydock)',
    location: '軌道星艦船塢 (Y >= 180)',
    generationMW: 3200,
    demandMW: 2800,
    isOnline: true,
    isShed: false,
    type: 'solar_orbital',
    color: '#ff00aa',
  },
  {
    id: 'sub_gamma',
    name: 'Gamma 深海聚變發電站 (Abyssal Fusion)',
    location: '海溝深淵熱液口 (Y < -50)',
    generationMW: 4800,
    demandMW: 1100,
    isOnline: true,
    isShed: false,
    type: 'nuclear',
    color: '#00ff88',
  },
  {
    id: 'sub_delta',
    name: 'Delta 工業物流配電所 (Industrial Matrix)',
    location: '自動化工廠製造區 (Chunk 4,-2)',
    generationMW: 1600,
    demandMW: 3400,
    isOnline: true,
    isShed: false,
    type: 'industrial',
    color: '#ffaa00',
  },
]

export class SupergridPowerEngine {
  public substations: Substation[] = JSON.parse(JSON.stringify(SUBSTATIONS_DEFAULT))
  public stats: SupergridStats = {
    totalGenerationMW: 10800,
    totalDemandMW: 8750,
    netBalanceMW: 2050,
    gridFrequency: 50.00,
    stabilityPercent: 98,
    smesCapacityMWh: 10000,
    smesStoredMWh: 6800,
    smesRateMW: 0,
    isBlackout: false,
    blackoutTimer: 0,
  }

  public market: MarketTicker = {
    kwhPrice: 0.28,
    carbonPrice: 38.5,
    priceHistory: [0.26, 0.27, 0.27, 0.28, 0.29, 0.28, 0.28, 0.30, 0.29, 0.28],
    trend: 'stable',
  }

  public wallet: PlayerWallet = {
    credits: 5000,
    powerContractsKWh: 2500,
    carbonCreditsTon: 15,
    totalProfit: 0,
  }

  public logs: string[] = ['[電網調度] 超導主幹電網同調運轉中。全線頻率 50.00 Hz 標稱鎖定。']
  private audioCtx: AudioContext | null = null
  private marketTickerTimer: number = 0

  constructor() {
    this.loadState()
    this.calculateTotals()
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

  // ── Grid Balancing Actions ──────────────────────────────────────────────────
  public autoBalanceFrequency(): { success: boolean; message: string } {
    if (this.stats.isBlackout) {
      return { success: false, message: '電網處於大斷電狀態，請先執行重啟流程。' }
    }

    this.calculateTotals()
    const diff = this.stats.totalGenerationMW - this.stats.totalDemandMW

    // Compensate net difference with SMES charge or discharge
    if (diff > 0) {
      // Absorb excess generation into SMES
      this.stats.smesRateMW = Math.min(2000, diff)
      this.addLog(`[智慧調度] 吸收過剩發電 +${this.stats.smesRateMW.toFixed(0)} MW 至超導磁能電池 (SMES)`)
    } else {
      // Discharge SMES into grid
      this.stats.smesRateMW = Math.max(-2000, diff)
      this.addLog(`[智慧調度] 從 SMES 釋放放電 ${Math.abs(this.stats.smesRateMW).toFixed(0)} MW 補足負載缺口`)
    }

    this.stats.gridFrequency = 50.00
    this.stats.stabilityPercent = 99
    this.playBlackoutRecovery()
    this.saveState()

    return { success: true, message: '全網智慧同調完成！電網頻率重置為 50.00 Hz。' }
  }

  public emergencyLoadShedding(substationId?: string): { success: boolean; message: string } {
    if (substationId) {
      const sub = this.substations.find(s => s.id === substationId)
      if (!sub) return { success: false, message: '找不到指定變電所' }
      sub.isShed = !sub.isShed
      this.addLog(`【手動負載切除】${sub.name} 狀態變更為：${sub.isShed ? '已切除部分負載' : '恢復全額供電'}`)
    } else {
      // Shed heavy industrial load automatically
      const industrial = this.substations.find(s => s.id === 'sub_delta')
      if (industrial) industrial.isShed = true
      this.addLog('【緊急負載切除】自動切除 Delta 工業重載，削減 50% 負載以保全都市核心！')
    }

    this.calculateTotals()
    this.playFrequencyAlarm()
    this.saveState()
    return { success: true, message: '緊急卸載指令已執行。' }
  }

  public adjustSubstationOutput(substationId: string, deltaMW: number): void {
    const sub = this.substations.find(s => s.id === substationId)
    if (!sub || !sub.isOnline) return
    sub.generationMW = Math.max(100, Math.min(8000, sub.generationMW + deltaMW))
    this.calculateTotals()
    this.saveState()
  }

  public toggleSubstation(substationId: string): void {
    const sub = this.substations.find(s => s.id === substationId)
    if (!sub) return
    sub.isOnline = !sub.isOnline
    this.addLog(`變電所 [${sub.name}] 已${sub.isOnline ? '併網上線' : '切換離線隔離'}`)
    this.calculateTotals()
    this.saveState()
  }

  private calculateTotals(): void {
    let gen = 0
    let dem = 0
    for (const sub of this.substations) {
      if (sub.isOnline) {
        gen += sub.generationMW
        dem += sub.isShed ? sub.demandMW * 0.5 : sub.demandMW
      }
    }
    this.stats.totalGenerationMW = gen
    this.stats.totalDemandMW = dem
    this.stats.netBalanceMW = (gen - dem) - this.stats.smesRateMW

    // Dynamic frequency calculation
    const imbalanceRatio = dem > 0 ? (gen - dem - this.stats.smesRateMW) / dem : 0
    this.stats.gridFrequency = Math.max(47.5, Math.min(52.5, 50.00 + imbalanceRatio * 2.5))

    // Stability evaluation
    const freqDev = Math.abs(this.stats.gridFrequency - 50.00)
    this.stats.stabilityPercent = Math.max(0, Math.min(100, Math.round(100 - freqDev * 40)))

    // Blackout check
    if ((this.stats.gridFrequency <= 48.2 || this.stats.gridFrequency >= 51.8) && !this.stats.isBlackout) {
      this.triggerBlackout()
    }
  }

  private triggerBlackout(): void {
    this.stats.isBlackout = true
    this.stats.blackoutTimer = 15
    this.stats.stabilityPercent = 0
    this.addLog('【全服大跳電】電網頻率嚴重失衡突破安全閥值！保護繼電器跳脫！進入緊急黑啟動 (Black Start)！')
    this.playFrequencyAlarm()
  }

  public manualBlackStart(): void {
    if (!this.stats.isBlackout) return
    this.stats.isBlackout = false
    this.stats.blackoutTimer = 0
    for (const sub of this.substations) {
      sub.isOnline = true
      sub.isShed = false
    }
    this.stats.gridFrequency = 50.00
    this.stats.stabilityPercent = 95
    this.addLog('【黑啟動成功】全次元電網重置，超導母線重新上電併網！')
    this.playBlackoutRecovery()
    this.saveState()
  }

  // ── Energy & Carbon Market Exchange ─────────────────────────────────────────
  public buyPower(kwh: number): { success: boolean; message: string } {
    const cost = Math.round(kwh * this.market.kwhPrice)
    if (this.wallet.credits < cost) {
      return { success: false, message: `資金不足！購買 ${kwh} KWh 需 ${cost} 信用點。` }
    }
    this.wallet.credits -= cost
    this.wallet.powerContractsKWh += kwh
    this.addLog(`[市場購入] 買入 ${kwh} KWh 電力合約，單價 ${this.market.kwhPrice.toFixed(3)}，總計 ${cost} 信用點。`)
    this.playTradeChime()
    this.saveState()
    return { success: true, message: `成功購入 ${kwh} KWh！` }
  }

  public sellPower(kwh: number): { success: boolean; message: string } {
    if (this.wallet.powerContractsKWh < kwh) {
      return { success: false, message: `持有電力合約不足！現有 ${this.wallet.powerContractsKWh} KWh。` }
    }
    const earnings = Math.round(kwh * this.market.kwhPrice)
    this.wallet.powerContractsKWh -= kwh
    this.wallet.credits += earnings
    this.wallet.totalProfit += earnings
    this.addLog(`[市場售出] 賣出 ${kwh} KWh 電力合約，獲得 ${earnings} 信用點！`)
    this.playTradeChime()

    if (this.wallet.totalProfit >= 2500) {
      achievements.unlock('supergrid_overlord')
    }
    this.saveState()
    return { success: true, message: `成功售出獲利 ${earnings} 信用點！` }
  }

  public buyCarbon(tons: number): { success: boolean; message: string } {
    const cost = Math.round(tons * this.market.carbonPrice)
    if (this.wallet.credits < cost) return { success: false, message: '信用點不足。' }
    this.wallet.credits -= cost
    this.wallet.carbonCreditsTon += tons
    this.addLog(`[碳交易購入] 購入 ${tons} 噸綠色聚變碳抵換配額，耗費 ${cost} 信用點。`)
    this.playTradeChime()
    this.saveState()
    return { success: true, message: `購入 ${tons} 噸碳配額。` }
  }

  public sellCarbon(tons: number): { success: boolean; message: string } {
    if (this.wallet.carbonCreditsTon < tons) return { success: false, message: '碳配額不足。' }
    const earnings = Math.round(tons * this.market.carbonPrice)
    this.wallet.carbonCreditsTon -= tons
    this.wallet.credits += earnings
    this.wallet.totalProfit += earnings
    this.addLog(`[碳交易售出] 售出 ${tons} 噸碳配額，獲得 ${earnings} 信用點。`)
    this.playTradeChime()

    if (this.wallet.totalProfit >= 2500) {
      achievements.unlock('supergrid_overlord')
    }
    this.saveState()
    return { success: true, message: `售出獲得 ${earnings} 信用點。` }
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return

    // Blackout countdown
    if (this.stats.isBlackout) {
      this.stats.blackoutTimer = Math.max(0, this.stats.blackoutTimer - delta)
      if (this.stats.blackoutTimer <= 0) {
        this.manualBlackStart()
      }
      return
    }

    // Battery charge/discharge integration
    if (this.stats.smesRateMW !== 0) {
      const deltaMWh = (this.stats.smesRateMW * (delta / 3600))
      this.stats.smesStoredMWh = Math.max(0, Math.min(this.stats.smesCapacityMWh, this.stats.smesStoredMWh + deltaMWh))
    }

    this.calculateTotals()

    // Market ticker fluctuations every 3 seconds
    this.marketTickerTimer += delta
    if (this.marketTickerTimer >= 3.0) {
      this.marketTickerTimer = 0
      const priceDelta = (Math.random() - 0.48) * 0.03
      this.market.kwhPrice = Math.max(0.06, Math.min(0.92, this.market.kwhPrice + priceDelta))
      this.market.carbonPrice = Math.max(18, Math.min(75, this.market.carbonPrice + (Math.random() - 0.5) * 1.5))

      this.market.priceHistory.push(parseFloat(this.market.kwhPrice.toFixed(3)))
      if (this.market.priceHistory.length > 15) this.market.priceHistory.shift()
      this.market.trend = priceDelta >= 0 ? 'up' : 'down'
    }
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playTransformerHum(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // 50Hz AC harmonic hum
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(50, now)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(100, now)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 1.2)
    osc2.stop(now + 1.2)
  }

  public playFrequencyAlarm(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(1046.50, now) // C6
    osc.frequency.setValueAtTime(1318.51, now + 0.15) // E6

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  public playTradeChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [987.77, 1318.51] // B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.08
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  public playBlackoutRecovery(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const chord = [261.63, 329.63, 392.00, 523.25] // C Major
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.09
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_supergrid_power')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.wallet) Object.assign(this.wallet, parsed.wallet)
        if (parsed.substations && Array.isArray(parsed.substations)) {
          for (const s of parsed.substations) {
            const match = this.substations.find(x => x.id === s.id)
            if (match) {
              match.generationMW = s.generationMW ?? match.generationMW
              match.isOnline = s.isOnline ?? match.isOnline
              match.isShed = s.isShed ?? match.isShed
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
      const payload = {
        wallet: this.wallet,
        substations: this.substations.map(s => ({
          id: s.id,
          generationMW: s.generationMW,
          isOnline: s.isOnline,
          isShed: s.isShed,
        })),
      }
      localStorage.setItem('nw_supergrid_power', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const supergridPower = new SupergridPowerEngine()
