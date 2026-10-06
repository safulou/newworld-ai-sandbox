/**
 * primordialBlackHole.ts
 * 太初原初黑洞星雲發電機引擎 (Primordial Black Hole Nebula Engine)
 * 模擬宇宙大爆炸初期微黑洞群之霍金輻射蒸發、磁約束懸浮籠物理與質量補給
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

export interface PrimordialBlackHoleItem {
  id: string
  name: string
  massKg: number // 質量
  initialMassKg: number
  hawkingTempKelvin: number // 霍金溫度 (反比於質量)
  powerYieldMW: number // 霍金發電出力 (MW)
  evaporationSecondsRemaining: number // 蒸發剩餘時間 (秒)
  hawkingPhotonsCaptured: number
  description: string
}

export interface PBHNebulaState {
  activeHoles: Record<string, PrimordialBlackHoleItem>
  magneticConfinementStabilityPercent: number // 0~100%
  totalHawkingPhotons: number // 霍金光子通量貨幣
  totalGridPowerMW: number // 併網總發電量
  feedMatterStockpileKg: number // 物質存量
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_pbh_nebula_v1'

const DEFAULT_HOLES: Record<string, PrimordialBlackHoleItem> = {
  pbh_micro: {
    id: 'pbh_micro',
    name: '克級微型原初黑洞 (Micro PBH)',
    massKg: 1000,
    initialMassKg: 1000,
    hawkingTempKelvin: 1.22e20,
    powerYieldMW: 8500,
    evaporationSecondsRemaining: 45,
    hawkingPhotonsCaptured: 120,
    description: '極微質量，霍金輻射爆發極致猛烈，需頻繁補充質量'
  },
  pbh_asteroid: {
    id: 'pbh_asteroid',
    name: '小行星級原初黑洞 (Asteroid PBH)',
    massKg: 500000,
    initialMassKg: 500000,
    hawkingTempKelvin: 2.45e17,
    powerYieldMW: 3200,
    evaporationSecondsRemaining: 360,
    hawkingPhotonsCaptured: 500,
    description: '質量穩定，持續穩定輸出微波高能霍金輻射'
  },
  pbh_lunar: {
    id: 'pbh_lunar',
    name: '月球級原初黑洞 (Lunar-Mass PBH)',
    massKg: 2000000,
    initialMassKg: 2000000,
    hawkingTempKelvin: 6.12e16,
    powerYieldMW: 1600,
    evaporationSecondsRemaining: 1800,
    hawkingPhotonsCaptured: 1200,
    description: '強大引力透鏡效應，提供超高磁約束力場與潮汐力'
  },
  pbh_quantum: {
    id: 'pbh_quantum',
    name: '極限旋轉量子微奇點 (Quantum Kerr PBH)',
    massKg: 50000,
    initialMassKg: 50000,
    hawkingTempKelvin: 2.44e18,
    powerYieldMW: 5800,
    evaporationSecondsRemaining: 120,
    hawkingPhotonsCaptured: 850,
    description: '具備極端角動量，在彭羅斯能層激發成對虛粒子溢出'
  }
}

class PrimordialBlackHoleEngine {
  private state: PBHNebulaState = {
    activeHoles: JSON.parse(JSON.stringify(DEFAULT_HOLES)),
    magneticConfinementStabilityPercent: 88.0,
    totalHawkingPhotons: 450,
    totalGridPowerMW: 19100,
    feedMatterStockpileKg: 250000,
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): PBHNebulaState {
    return this.state
  }

  public get activeHoles(): Record<string, PrimordialBlackHoleItem> {
    return this.state.activeHoles
  }

  public get totalHawkingPhotons(): number {
    return this.state.totalHawkingPhotons
  }

  public get totalGridPowerMW(): number {
    return this.state.totalGridPowerMW
  }

  public get magneticConfinementStabilityPercent(): number {
    return this.state.magneticConfinementStabilityPercent
  }

  public get feedMatterStockpileKg(): number {
    return this.state.feedMatterStockpileKg
  }

  /**
   * 向指定太初黑洞拋投物質補給質量 (Feed Matter)
   */
  public feedMass(holeId: string, amountKg: number = 5000): boolean {
    const hole = this.state.activeHoles[holeId]
    if (!hole) return false

    if (this.state.feedMatterStockpileKg < amountKg) {
      return false
    }

    this.state.feedMatterStockpileKg -= amountKg
    hole.massKg += amountKg
    hole.evaporationSecondsRemaining += Math.round(amountKg / 100)

    // 重新計算霍金溫度與出力（霍金溫度反比於質量）
    hole.hawkingTempKelvin = (1.22e23) / (hole.massKg || 1)
    hole.powerYieldMW = Math.min(25000, Math.round((1e7) / Math.sqrt(hole.massKg || 1) * 2.5))

    this.recalculateTotalPower()
    this.saveState()

    // 吞噬重力音效
    playAudioTone(150, 0.25, 'sawtooth')
    setTimeout(() => playAudioTone(95, 0.35, 'sine'), 100)
    return true
  }

  /**
   * 調諧磁約束懸浮籠 (Tune Magnetic Confinement Cage)
   */
  public tuneMagneticCage(): boolean {
    if (this.state.magneticConfinementStabilityPercent >= 99) return false

    this.state.magneticConfinementStabilityPercent = Math.min(100, this.state.magneticConfinementStabilityPercent + 15)
    this.saveState()

    // 超導高頻和弦
    playAudioTone(520, 0.15, 'sine')
    setTimeout(() => playAudioTone(780, 0.2, 'triangle'), 60)
    return true
  }

  /**
   * 捕獲霍金蒸發微爆能量 (Harvest Hawking Burst)
   */
  public harvestHawkingBurst(holeId: string): number {
    const hole = this.state.activeHoles[holeId]
    if (!hole) return 0

    // 依黑洞溫度與出力轉換高能光子通量
    const gained = Math.round((hole.powerYieldMW / 150) * (this.state.magneticConfinementStabilityPercent / 100))
    this.state.totalHawkingPhotons += gained
    hole.hawkingPhotonsCaptured += gained

    // 成就解鎖
    achievementsManager.unlock('pbh_harvester')

    this.saveState()

    // 採集激發音
    playNoiseBurst(0.2, 0.15)
    playAudioTone(920, 0.25, 'sine')
    return gained
  }

  /**
   * 捕獲並部署新的太初微黑洞 (Deploy New Micro PBH)
   */
  public deployNewMicroPBH(): boolean {
    const cost = 300
    if (this.state.totalHawkingPhotons < cost) return false

    this.state.totalHawkingPhotons -= cost
    const hole = this.state.activeHoles['pbh_micro']
    if (hole) {
      hole.massKg = hole.initialMassKg
      hole.evaporationSecondsRemaining = 60
    }

    this.state.feedMatterStockpileKg += 100000
    this.recalculateTotalPower()
    this.saveState()

    playAudioTone(220, 0.2, 'sine')
    setTimeout(() => playAudioTone(440, 0.25, 'sawtooth'), 80)
    return true
  }

  /**
   * 重新彙總總發電功率
   */
  private recalculateTotalPower(): void {
    let sum = 0
    for (const h of Object.values(this.state.activeHoles)) {
      sum += h.powerYieldMW
    }
    this.state.totalGridPowerMW = sum
  }

  /**
   * 主循環更新
   */
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 霍金蒸發倒數與微量質量減少
    for (const h of Object.values(this.state.activeHoles)) {
      if (h.evaporationSecondsRemaining > 0) {
        h.evaporationSecondsRemaining = Math.max(0, h.evaporationSecondsRemaining - Math.round(delta))
        h.massKg = Math.max(10, h.massKg - Math.round(delta * 2))
      } else {
        // 臨界質量微爆後重置極微質量循環
        h.massKg = 250
        h.evaporationSecondsRemaining = 20
      }
    }

    // 磁約束穩定度緩慢漂移
    this.state.magneticConfinementStabilityPercent = Math.max(
      20,
      this.state.magneticConfinementStabilityPercent - 0.05
    )

    this.recalculateTotalPower()
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
          activeHoles: { ...DEFAULT_HOLES, ...(parsed.activeHoles || {}) }
        }
      }
    } catch {
      // fallback
    }
  }
}

export const primordialBlackHole = new PrimordialBlackHoleEngine()
