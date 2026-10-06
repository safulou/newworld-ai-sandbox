/**
 * neutrinoDetector.ts
 * 中微子超流體暗物質探測陣列引擎 (Neutrino Superfluid Dark Matter Detector Engine)
 * 模擬極低溫（mK）超流體氦三聲子凝聚、中微子味態振盪檢測與 WIMP 暗物質粒子碰撞
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

export interface CryoSensorComponent {
  id: string
  name: string
  level: number
  costPhonon: number
  efficiencyBonus: number
  description: string
}

export interface NeutrinoDetectorState {
  cryoTempMilliKelvin: number // 基準 0.85 mK
  superfluidPhononFlux: number // 超流體聲子通量貨幣
  flavorOscillationRatio: {
    electron: number // %
    muon: number // %
    tau: number // %
  }
  darkMatterWIMPCounts: number
  shieldingPurityPercent: number // 0~100%
  totalEventsLogged: number
  sensors: Record<string, CryoSensorComponent>
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_neutrino_detector_v1'

const DEFAULT_SENSORS: Record<string, CryoSensorComponent> = {
  cryo_pump: {
    id: 'cryo_pump',
    name: '氦三/氦四極低溫稀釋制冷機',
    level: 1,
    costPhonon: 150,
    efficiencyBonus: 0.2,
    description: '持續維持零下 273.149°C 超流體絕對低溫環境'
  },
  phonon_sensor: {
    id: 'phonon_sensor',
    name: 'TES 超導轉變邊緣聲子感測器',
    level: 1,
    costPhonon: 300,
    efficiencyBonus: 0.35,
    description: '毫電子伏特級極致靈敏度，捕捉原子核回衝聲子熱脈衝'
  },
  muon_veto: {
    id: 'muon_veto',
    name: '深層地底宇宙線繆子反符合防護罩',
    level: 1,
    costPhonon: 500,
    efficiencyBonus: 0.25,
    description: '過濾高空大氣宇宙射線本底雜訊，提升探測信噪比'
  },
  optical_pmt: {
    id: 'optical_pmt',
    name: '單光子超低溫光電倍增管陣列',
    level: 1,
    costPhonon: 800,
    efficiencyBonus: 0.45,
    description: '捕獲超流體中中微子散射產生的極微弱切倫科夫閃爍光子'
  }
}

class NeutrinoDetectorEngine {
  private state: NeutrinoDetectorState = {
    cryoTempMilliKelvin: 0.85,
    superfluidPhononFlux: 260,
    flavorOscillationRatio: {
      electron: 38,
      muon: 37,
      tau: 25
    },
    darkMatterWIMPCounts: 14,
    shieldingPurityPercent: 91.5,
    totalEventsLogged: 42,
    sensors: JSON.parse(JSON.stringify(DEFAULT_SENSORS)),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): NeutrinoDetectorState {
    return this.state
  }

  public get sensors(): Record<string, CryoSensorComponent> {
    return this.state.sensors
  }

  public get superfluidPhononFlux(): number {
    return this.state.superfluidPhononFlux
  }

  public get cryoTempMilliKelvin(): number {
    return this.state.cryoTempMilliKelvin
  }

  public get shieldingPurityPercent(): number {
    return this.state.shieldingPurityPercent
  }

  public get darkMatterWIMPCounts(): number {
    return this.state.darkMatterWIMPCounts
  }

  /**
   * 升級指定超低溫探測組件
   */
  public upgradeSensor(sensorId: string): boolean {
    const s = this.state.sensors[sensorId]
    if (!s) return false

    if (this.state.superfluidPhononFlux < s.costPhonon) {
      return false
    }

    this.state.superfluidPhononFlux -= s.costPhonon
    s.level += 1
    s.costPhonon = Math.round(s.costPhonon * 1.6)

    // 提升純度與降溫
    this.state.shieldingPurityPercent = Math.min(100, this.state.shieldingPurityPercent + 3 * s.efficiencyBonus)
    this.state.cryoTempMilliKelvin = Math.max(0.05, parseFloat((this.state.cryoTempMilliKelvin - 0.05 * s.efficiencyBonus).toFixed(3)))

    this.saveState()

    playAudioTone(480, 0.15, 'triangle')
    setTimeout(() => playAudioTone(720, 0.2, 'sine'), 80)
    return true
  }

  /**
   * 深度校準制冷槽 (Calibrate Cryo Chamber)
   */
  public calibrateCryoChamber(): boolean {
    if (this.state.cryoTempMilliKelvin <= 0.1) return false

    this.state.cryoTempMilliKelvin = Math.max(0.05, parseFloat((this.state.cryoTempMilliKelvin * 0.7).toFixed(3)))
    this.state.shieldingPurityPercent = Math.min(100, this.state.shieldingPurityPercent + 4)
    this.saveState()

    playAudioTone(300, 0.25, 'sine')
    setTimeout(() => playAudioTone(450, 0.3, 'sine'), 100)
    return true
  }

  /**
   * 調諧中微子振盪味態濾鏡 (Tune Oscillation Filter)
   */
  public tuneOscillationFilter(): { electron: number; muon: number; tau: number } {
    // 隨機動態相位角擾動
    const e = Math.floor(25 + Math.random() * 25)
    const m = Math.floor(25 + Math.random() * 25)
    const t = 100 - e - m
    this.state.flavorOscillationRatio = { electron: e, muon: m, tau: t }

    // 發現新的暗物質碰撞事件
    if (Math.random() < 0.6) {
      this.state.darkMatterWIMPCounts += 1
    }
    this.state.totalEventsLogged += 1

    this.saveState()

    playAudioTone(640, 0.12, 'sawtooth')
    setTimeout(() => playAudioTone(960, 0.2, 'triangle'), 70)
    return this.state.flavorOscillationRatio
  }

  /**
   * 捕獲聲子閃光能量 (Harvest Phonon Burst)
   */
  public harvestPhononBurst(): number {
    const gained = Math.round(40 + this.state.shieldingPurityPercent * 0.8 + this.state.darkMatterWIMPCounts * 2)
    this.state.superfluidPhononFlux += gained
    this.state.totalEventsLogged += 1

    // 檢查成就解鎖
    achievementsManager.unlock('neutrino_whisperer')

    this.saveState()

    playNoiseBurst(0.15, 0.1)
    playAudioTone(880, 0.2, 'sine')
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

    // 自然微動溫漂
    const drift = (Math.random() - 0.48) * 0.005
    this.state.cryoTempMilliKelvin = Math.max(0.05, parseFloat((this.state.cryoTempMilliKelvin + drift).toFixed(3)))

    // 感測器自律捕獲聲子通量
    let passiveGain = 0
    for (const s of Object.values(this.state.sensors)) {
      passiveGain += s.level * s.efficiencyBonus * 0.2
    }
    this.state.superfluidPhononFlux += Math.round(passiveGain)

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
          sensors: { ...DEFAULT_SENSORS, ...(parsed.sensors || {}) }
        }
      }
    } catch {
      // fallback
    }
  }
}

export const neutrinoDetector = new NeutrinoDetectorEngine()
