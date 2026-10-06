/**
 * tachyonicCausalityMesh.ts
 * 超光速因果律超弦通訊網引擎 (Tachyonic Causality Mesh Engine)
 * 模擬快子 (Tachyons) 逆時間因果通信、接收未來時間線電報、先知預警與時序悖論阻尼器
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

export interface FutureDispatch {
  id: string
  title: string
  timelineOffsetSeconds: number // -60s ~ -10s
  received: boolean
  resolved: boolean
  content: string
  rewardFlux: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface TachyonicMeshState {
  tachyonicFlux: number // 快子通量儲備
  causalityIntegrityPercent: number // 因果律完整度 0~100%
  temporalTimelineOffsetSeconds: number // 當前逆向時間偏移量
  dispatches: Record<string, FutureDispatch>
  totalParadoxesDampened: number
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_tachyonic_mesh_v1'

const DEFAULT_DISPATCHES: Record<string, FutureDispatch> = {
  tele_flare: {
    id: 'tele_flare',
    title: '【+45s 未來預警】極端恆星 X 級耀斑即將爆發',
    timelineOffsetSeconds: -45,
    received: true,
    resolved: false,
    content: '未來觀測站檢測到母恆星磁力線重聯，預先部屬戴森雲反射鏡可防禦衝擊並採集超量等離子。',
    rewardFlux: 150,
    threatLevel: 'high'
  },
  tele_resources: {
    id: 'tele_resources',
    title: '【+30s 未來反饋】高能超導逆向時間量子材料包裹',
    timelineOffsetSeconds: -30,
    received: true,
    resolved: false,
    content: '由 T+30s 未來實驗室反向折躍之高階超導材料，拆封後即刻補貼當前世界生產網絡。',
    rewardFlux: 280,
    threatLevel: 'low'
  },
  tele_rift: {
    id: 'tele_rift',
    title: '【+60s 終端警告】暗物質時空剪切臨界裂隙',
    timelineOffsetSeconds: -60,
    received: false,
    resolved: false,
    content: '局部度規張力達極限，若不及時啟動快子阻尼器，將引發微型時間環崩塌。',
    rewardFlux: 350,
    threatLevel: 'critical'
  },
  tele_discovery: {
    id: 'tele_discovery',
    title: '【+15s 先知靈感】卡拉比-丘超弦幾何諧振公式',
    timelineOffsetSeconds: -15,
    received: true,
    resolved: false,
    content: '未來意識群完成全維度閉弦幾何求值，逆向傳遞之數值大幅提升超弦折疊穩定度。',
    rewardFlux: 200,
    threatLevel: 'medium'
  }
}

class TachyonicCausalityMeshEngine {
  private state: TachyonicMeshState = {
    tachyonicFlux: 320,
    causalityIntegrityPercent: 86.5,
    temporalTimelineOffsetSeconds: -30,
    dispatches: JSON.parse(JSON.stringify(DEFAULT_DISPATCHES)),
    totalParadoxesDampened: 0,
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): TachyonicMeshState {
    return this.state
  }

  public get tachyonicFlux(): number {
    return this.state.tachyonicFlux
  }

  public get causalityIntegrityPercent(): number {
    return this.state.causalityIntegrityPercent
  }

  public get temporalTimelineOffsetSeconds(): number {
    return this.state.temporalTimelineOffsetSeconds
  }

  public get dispatches(): Record<string, FutureDispatch> {
    return this.state.dispatches
  }

  /**
   * 接收並解決未來預警電報 (Receive & Resolve Future Dispatch)
   */
  public receiveFutureTransmission(dispatchId: string): boolean {
    const d = this.state.dispatches[dispatchId]
    if (!d || d.resolved) return false

    d.received = true
    d.resolved = true
    this.state.tachyonicFlux += d.rewardFlux
    this.state.causalityIntegrityPercent = Math.min(100, this.state.causalityIntegrityPercent + 8)

    // 解鎖成就
    achievementsManager.unlock('tachyonic_prophet')

    this.saveState()

    // 快子接收音效（逆向調頻感）
    playAudioTone(1200, 0.15, 'sawtooth')
    setTimeout(() => playAudioTone(600, 0.25, 'sine'), 100)
    return true
  }

  /**
   * 向過去時間線廣播先知預警 (Transmit Precognitive Warning)
   */
  public transmitPrecognitiveWarning(): boolean {
    const cost = 80
    if (this.state.tachyonicFlux < cost) return false

    this.state.tachyonicFlux -= cost
    // 逆向擴展時間偏移量
    this.state.temporalTimelineOffsetSeconds = Math.max(-120, this.state.temporalTimelineOffsetSeconds - 10)
    this.state.causalityIntegrityPercent = Math.min(100, this.state.causalityIntegrityPercent + 5)

    // 隨機解鎖未接收的未來電報
    const unreceived = Object.values(this.state.dispatches).find(d => !d.received)
    if (unreceived) {
      unreceived.received = true
    }

    this.saveState()

    // 莫斯逆向音效
    playAudioTone(880, 0.1, 'sine')
    setTimeout(() => playAudioTone(1320, 0.15, 'triangle'), 60)
    setTimeout(() => playAudioTone(1760, 0.2, 'sine'), 120)
    return true
  }

  /**
   * 啟動因果律阻尼器平息悖論 (Dampen Causality Paradox)
   */
  public dampenCausalityParadox(): boolean {
    if (this.state.causalityIntegrityPercent >= 98) return false

    this.state.causalityIntegrityPercent = Math.min(100, this.state.causalityIntegrityPercent + 15)
    this.state.totalParadoxesDampened += 1
    this.saveState()

    // 平息阻尼音
    playNoiseBurst(0.2, 0.1)
    playAudioTone(440, 0.3, 'sine')
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

    // 快子自發緩慢積累
    this.state.tachyonicFlux += 1

    // 檢查是否有未解決的緊急事件造成的因果微損耗
    const pendingCritical = Object.values(this.state.dispatches).some(d => d.threatLevel === 'critical' && !d.resolved)
    if (pendingCritical) {
      this.state.causalityIntegrityPercent = Math.max(20, this.state.causalityIntegrityPercent - 0.1)
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
          dispatches: { ...DEFAULT_DISPATCHES, ...(parsed.dispatches || {}) }
        }
      }
    } catch {
      // fallback
    }
  }
}

export const tachyonicCausalityMesh = new TachyonicCausalityMeshEngine()
