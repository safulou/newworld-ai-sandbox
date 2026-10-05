/**
 * NewWorld AI Sandbox - Hyper-Subspace Quantum Broadcast & Star BBS Engine
 * 
 * Implements:
 * - Cross-dimensional Quantum Entanglement BBS Bulletin Board Network
 * - 4 Frequency Channels (Galaxy Wide, Syndicate Tactical, Deep Space Logs, Black Market Wire)
 * - Rich Transmissions: 3D Spatial Coordinates tagging, AI Blueprint payloads, Upvotes, Credit Tips
 * - Pure Web Audio procedural audio synthesis (Morse-like quantum pulses, transmit chirp, incoming chime)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type BroadcastChannel = 'galaxy_wide' | 'syndicate_tactical' | 'deep_space_logs' | 'black_market_wire'

export interface BroadcastMessage {
  id: string
  channel: BroadcastChannel
  senderName: string
  content: string
  timestamp: string
  coordinates?: { x: number; y: number; z: number }
  likes: number
  tipsCredits: number
  tagBadge?: string
}

export interface BroadcastStats {
  activeChannel: BroadcastChannel
  totalSentByPlayer: number
  totalLikesReceived: number
  totalTipsEarned: number
  networkLatencyPs: number // Picoseconds quantum latency
  isTransmitting: boolean
  statusMessage: string
}

export const DEFAULT_BROADCAST_MESSAGES: BroadcastMessage[] = [
  {
    id: 'msg_1',
    channel: 'galaxy_wide',
    senderName: '方舟先鋒指揮部',
    content: '致全體開拓者：遠古戴森球二期赤道超導環已進入攻堅階段，歡迎各公會注資超導合金！',
    timestamp: '10:42:15',
    coordinates: { x: 0, y: 180, z: 0 },
    likes: 42,
    tipsCredits: 5000,
    tagBadge: '📢 官方公告'
  },
  {
    id: 'msg_2',
    channel: 'deep_space_logs',
    senderName: '天鵝座巡弋艦隊',
    content: '在仙女座蟲洞深處探測到時間晶體洞窟裂隙，座標已加密標記，注意外骨骼防輻射護盾。',
    timestamp: '10:55:02',
    coordinates: { x: 1250, y: -45, z: 860 },
    likes: 28,
    tipsCredits: 2400,
    tagBadge: '🌌 深空日誌'
  },
  {
    id: 'msg_3',
    channel: 'syndicate_tactical',
    senderName: '荒坂軌道衛隊長',
    content: '緊急防禦警報：霓虹先鋒正向天鵝座 X1 中繼站集結空天旗艦，所有駐防人員立即登機！',
    timestamp: '11:10:40',
    coordinates: { x: -450, y: 60, z: 320 },
    likes: 19,
    tipsCredits: 1200,
    tagBadge: '⚔️ 戰術情報'
  },
  {
    id: 'msg_4',
    channel: 'black_market_wire',
    senderName: '夜城暗網商人',
    content: '高價收購 [泰坦時空核心] 與 [先行者古代編碼器]，每顆出價 150,000 信用點，支持量子錢包即時撮合。',
    timestamp: '11:18:22',
    likes: 35,
    tipsCredits: 8000,
    tagBadge: '💰 黑市交易'
  }
]

export class QuantumBroadcastEngine {
  public messages: BroadcastMessage[] = []
  public stats: BroadcastStats = {
    activeChannel: 'galaxy_wide',
    totalSentByPlayer: 0,
    totalLikesReceived: 0,
    totalTipsEarned: 0,
    networkLatencyPs: 0.04,
    isTransmitting: false,
    statusMessage: '超空間量子廣播星網連線正常，全頻段共振監聽中。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.messages = JSON.parse(JSON.stringify(DEFAULT_BROADCAST_MESSAGES))
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

  // ── Channels & Filtering ─────────────────────────────────────────────────
  public setChannel(channel: BroadcastChannel): void {
    this.stats.activeChannel = channel
    this.saveState()
  }

  public getMessagesForChannel(channel?: BroadcastChannel): BroadcastMessage[] {
    const ch = channel || this.stats.activeChannel
    return this.messages.filter(m => m.channel === ch)
  }

  // ── Transmission Controls ────────────────────────────────────────────────
  public postBroadcast(
    content: string,
    senderName: string = '開拓者本人',
    coords?: { x: number; y: number; z: number }
  ): boolean {
    if (!content.trim()) return false

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const newMsg: BroadcastMessage = {
      id: `msg_${Date.now()}`,
      channel: this.stats.activeChannel,
      senderName,
      content: content.trim(),
      timestamp: timeStr,
      coordinates: coords,
      likes: 1,
      tipsCredits: 0,
      tagBadge: '📡 開拓者電文'
    }

    this.messages.unshift(newMsg)
    this.stats.totalSentByPlayer += 1
    this.stats.statusMessage = '🚀 量子電文已成功廣播發射至超空間星網！'

    // Achievements
    achievements.trackProgress('quantum_broadcaster', 1)

    this.playTransmitSound()
    this.saveState()
    return true
  }

  public likeMessage(messageId: string): boolean {
    const msg = this.messages.find(m => m.id === messageId)
    if (!msg) return false

    msg.likes += 1
    this.playLikeChime()
    this.saveState()
    return true
  }

  public tipMessage(messageId: string, amount: number = 500): boolean {
    const msg = this.messages.find(m => m.id === messageId)
    if (!msg) return false

    msg.tipsCredits += amount
    this.stats.totalTipsEarned += amount
    this.playLikeChime()
    this.saveState()
    return true
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playTransmitSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Morse-like binary harmonic sweep
    const freqs = [880, 1174.66, 1760]
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.06
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.08, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.05)
    })
  }

  public playLikeChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(987.77, now) // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.1) // E6

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_quantum_broadcast', JSON.stringify({
        messages: this.messages,
        stats: this.stats
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_quantum_broadcast')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.messages) {
          this.messages = parsed.messages
        }
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
      }
    } catch { /* ignore */ }
  }
}

export const quantumBroadcast = new QuantumBroadcastEngine()
