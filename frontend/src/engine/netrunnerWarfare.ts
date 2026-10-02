/**
 * NewWorld AI Sandbox - Multiplayer Netrunner ICE Warfare & Subnet Defense Engine
 * 
 * Implements:
 * - Chunk Private Subnet Core defense configuration (White, Tar, Black, Quantum ICE)
 * - Infiltration Raids against corporate/rival nodes with dual-progress race (Breach vs Trace)
 * - Intrusion countermeasures (EMP shock, Trace acceleration, Neural burn, ICE Flush)
 * - Pure Web Audio procedural sound synthesis (Cyber alert sirens, neural shock glitch, packet stream)
 * - LocalStorage client persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type ICEType = 'white' | 'tar' | 'black' | 'quantum'

export interface ICESlot {
  id: string
  type: ICEType
  name: string
  level: number
  health: number
  maxHealth: number
  description: string
  damagePerSec: number
  traceRateBonus: number
}

export interface SubnetCore {
  id: string
  name: string
  owner: string
  firewallHealth: number    // 0 to 100
  vaultCredits: number      // Stored credits
  techBlueprints: number    // Stored tech blueprints
  iceSlots: ICESlot[]
}

export interface RaidTarget {
  id: string
  name: string
  corp: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'
  lootCredits: number
  firewallMax: number
  firewallHealth: number
  iceTypes: ICEType[]
  description: string
  isCompromised: boolean
}

export interface WarfareStats {
  mode: 'defense' | 'raid'
  inRaid: boolean
  activeTargetId: string | null
  raidProgress: number       // 0 to 100%
  traceProgress: number      // 0 to 100%
  attackerHealth: number     // 0 to 100% (Neural Integrity)
  isDumped: boolean          // Forced disconnect to meatspace
  lockoutRemaining: number   // Lockout cooldown in seconds
  creditsWon: number
  creditsLost: number
  victories: number
  defeats: number
  alertActive: boolean
}

export const RAID_TARGETS: RaidTarget[] = [
  {
    id: 'node_arasaka_sub',
    name: '荒坂軌道數據中繼塔 (Arasaka Orbital Relay)',
    corp: 'Arasaka Security Grid',
    difficulty: 'Easy',
    lootCredits: 1200,
    firewallMax: 100,
    firewallHealth: 100,
    iceTypes: ['white', 'tar'],
    description: '外圍民用通訊樞紐，配置標準 White ICE 認證與初級 Tar 阻滯協議。',
    isCompromised: false,
  },
  {
    id: 'node_kangtao_vault',
    name: '康陶智慧軍械庫 (Kang-Tao Smart Foundry)',
    corp: 'Kang-Tao Munitions',
    difficulty: 'Medium',
    lootCredits: 2800,
    firewallMax: 200,
    firewallHealth: 200,
    iceTypes: ['white', 'black'],
    description: '智能武器製造中心，配置 Black ICE 神經反衝，對非法滲透者釋放高壓灼傷。',
    isCompromised: false,
  },
  {
    id: 'node_militech_black',
    name: '軍用科技黑域主機 (Militech Black-Site Hub)',
    corp: 'Militech Defense',
    difficulty: 'Hard',
    lootCredits: 5500,
    firewallMax: 350,
    firewallHealth: 350,
    iceTypes: ['tar', 'black', 'quantum'],
    description: '深層黑預算作戰主機，部署自我演化 Quantum ICE，每 10 秒動態更替加密金鑰。',
    isCompromised: false,
  },
  {
    id: 'node_quantum_citadel',
    name: '深空量子天網中樞 (DeepSpace Skynet Apex)',
    corp: 'Autonomous AI Concord',
    difficulty: 'Extreme',
    lootCredits: 10000,
    firewallMax: 500,
    firewallHealth: 500,
    iceTypes: ['white', 'tar', 'black', 'quantum'],
    description: '超智慧 AI 核心伺服器群，具備光速 Trace 反向鎖定與致命級神經燒腦機制。',
    isCompromised: false,
  },
]

export class NetrunnerWarfareEngine {
  public mySubnet: SubnetCore = {
    id: 'local_subnet_alpha',
    name: '開拓者基地子網 (Pioneer Subnet Core)',
    owner: 'Pioneer-01',
    firewallHealth: 100,
    vaultCredits: 4500,
    techBlueprints: 3,
    iceSlots: [
      { id: 'ice_1', type: 'white', name: 'White ICE 認證閘門', level: 2, health: 100, maxHealth: 100, description: '基本非法連線過濾與示警', damagePerSec: 0, traceRateBonus: 1.5 },
      { id: 'ice_2', type: 'tar', name: 'Tar ICE 黏滯陣列', level: 1, health: 100, maxHealth: 100, description: '拖慢入侵者指令執行速度 35%', damagePerSec: 0, traceRateBonus: 2.0 },
      { id: 'ice_3', type: 'black', name: 'Black ICE 神經反衝針', level: 2, health: 100, maxHealth: 100, description: '對入侵化身造成高壓電脈衝灼傷', damagePerSec: 8, traceRateBonus: 3.0 },
      { id: 'ice_4', type: 'quantum', name: 'Quantum ICE 重構器', level: 1, health: 100, maxHealth: 100, description: '動態重塑防火牆拓撲與加密雜湊', damagePerSec: 4, traceRateBonus: 2.5 },
    ],
  }

  public targets: RaidTarget[] = JSON.parse(JSON.stringify(RAID_TARGETS))
  public stats: WarfareStats = {
    mode: 'defense',
    inRaid: false,
    activeTargetId: null,
    raidProgress: 0,
    traceProgress: 0,
    attackerHealth: 100,
    isDumped: false,
    lockoutRemaining: 0,
    creditsWon: 0,
    creditsLost: 0,
    victories: 0,
    defeats: 0,
    alertActive: false,
  }

  public logs: string[] = ['[系統] 賽博子網防禦中樞已就緒。監聽連接埠 8080/443...']
  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
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

  // ── Attack / Infiltration Mechanics ──────────────────────────────────────────
  public startRaid(targetId: string): { success: boolean; message: string } {
    if (this.stats.isDumped) {
      return { success: false, message: `神經反衝鎖定中，尚餘 ${Math.ceil(this.stats.lockoutRemaining)} 秒修復期。` }
    }
    if (this.stats.inRaid) {
      return { success: false, message: '目前已有正在進行中的入侵滲透行動！' }
    }
    const target = this.targets.find(t => t.id === targetId)
    if (!target) return { success: false, message: '找不到目標子網節點。' }

    this.stats.inRaid = true
    this.stats.activeTargetId = targetId
    this.stats.raidProgress = 0
    this.stats.traceProgress = 0
    this.stats.attackerHealth = 100
    this.stats.mode = 'raid'

    this.addLog(`發起針對 [${target.name}] 的代碼滲透。ICE 防火牆掃描中...`)
    this.playDataStream()
    return { success: true, message: `連線建立！正在攻堅 ${target.name}` }
  }

  public executeBruteForce(): void {
    if (!this.stats.inRaid) return
    const boost = 14 + Math.random() * 6
    const trace = 10 + Math.random() * 4
    this.stats.raidProgress = Math.min(100, this.stats.raidProgress + boost)
    this.stats.traceProgress = Math.min(100, this.stats.traceProgress + trace)
    this.addLog(`執行暴力多線程破解：滲透進度 +${boost.toFixed(1)}%，追蹤率 +${trace.toFixed(1)}%`)
    this.playDataStream()
    this.checkRaidOutcome()
  }

  public executePacketSpoof(): void {
    if (!this.stats.inRaid) return
    const reduction = 15 + Math.random() * 8
    const boost = 4 + Math.random() * 3
    this.stats.traceProgress = Math.max(0, this.stats.traceProgress - reduction)
    this.stats.raidProgress = Math.min(100, this.stats.raidProgress + boost)
    this.addLog(`注入混淆偽裝封包：反向追蹤 -${reduction.toFixed(1)}%，滲透進度 +${boost.toFixed(1)}%`)
    this.playDataStream()
    this.checkRaidOutcome()
  }

  public executeLogicBomb(): void {
    if (!this.stats.inRaid) return
    const boost = 22 + Math.random() * 8
    const trace = 16 + Math.random() * 6
    this.stats.raidProgress = Math.min(100, this.stats.raidProgress + boost)
    this.stats.traceProgress = Math.min(100, this.stats.traceProgress + trace)
    this.addLog(`引爆邏輯死鎖炸彈：大面積瓦解防護網！進度 +${boost.toFixed(1)}%，警戒激增 +${trace.toFixed(1)}%`)
    this.playDataStream()
    this.checkRaidOutcome()
  }

  public executeZeroDay(): void {
    if (!this.stats.inRaid) return
    const boost = 32 + Math.random() * 10
    const trace = 24 + Math.random() * 8
    this.stats.raidProgress = Math.min(100, this.stats.raidProgress + boost)
    this.stats.traceProgress = Math.min(100, this.stats.traceProgress + trace)
    this.addLog(`部署未公開零日漏洞 (Zero-Day Exploit)：穿透內層協議！進度 +${boost.toFixed(1)}%，追蹤暴增 +${trace.toFixed(1)}%`)
    this.playDataStream()
    this.checkRaidOutcome()
  }

  public abortRaid(): void {
    if (this.stats.inRaid) {
      this.stats.inRaid = false
      this.stats.activeTargetId = null
      this.stats.raidProgress = 0
      this.stats.traceProgress = 0
      this.addLog('主動緊急中斷入侵連線，清除日誌痕跡撤離。')
      this.saveState()
    }
  }

  private checkRaidOutcome(): void {
    if (!this.stats.inRaid) return
    const target = this.targets.find(t => t.id === this.stats.activeTargetId)
    if (!target) return

    // Attacker victory
    if (this.stats.raidProgress >= 100) {
      this.stats.inRaid = false
      target.isCompromised = true
      const credits = target.lootCredits
      this.mySubnet.vaultCredits += credits
      this.mySubnet.techBlueprints += 1
      this.stats.creditsWon += credits
      this.stats.victories++
      this.addLog(`【突破成功】完全瓦解 ${target.name} 防火牆！竊得 ${credits} 信用點與 1 份機密科技藍圖！`)
      this.playBreachSuccess()
      achievements.unlock('ice_sentinel')
      this.saveState()
      return
    }

    // Defender counter: trace reached 100% or health dropped to 0
    if (this.stats.traceProgress >= 100 || this.stats.attackerHealth <= 0) {
      this.stats.inRaid = false
      this.stats.isDumped = true
      this.stats.lockoutRemaining = 20
      this.stats.defeats++
      const penalty = Math.min(this.mySubnet.vaultCredits, Math.round(target.lootCredits * 0.4))
      this.mySubnet.vaultCredits = Math.max(0, this.mySubnet.vaultCredits - penalty)
      this.stats.creditsLost += penalty
      this.addLog(`【追蹤超限】目標 Black ICE 成功反向鎖定 IP！連線強制燒斷（Dumped to Meatspace），扣除罰金 ${penalty} 信用點！`)
      this.playNeuralShock()
      this.saveState()
    }
  }

  // ── Subnet Defense Mechanics ────────────────────────────────────────────────
  public upgradeIce(slotId: string): boolean {
    const slot = this.mySubnet.iceSlots.find(s => s.id === slotId)
    if (!slot) return false
    const cost = slot.level * 800
    if (this.mySubnet.vaultCredits < cost) {
      this.addLog(`信用點不足！升級 ${slot.name} 需 ${cost} 信用點。`)
      return false
    }
    this.mySubnet.vaultCredits -= cost
    slot.level++
    slot.maxHealth += 25
    slot.health = slot.maxHealth
    slot.damagePerSec += 3
    slot.traceRateBonus += 0.8
    this.addLog(`[升級完成] ${slot.name} 提升至 Level ${slot.level}！防禦強度增加。`)
    this.saveState()
    return true
  }

  public triggerEmpDefense(): void {
    if (this.mySubnet.vaultCredits < 200) {
      this.addLog('信用點不足以啟動領地 EMP 衝擊波防禦 (需 200 點)。')
      return
    }
    this.mySubnet.vaultCredits -= 200
    this.stats.alertActive = false
    this.addLog('【EMP 激發】啟動領地高能電磁脈衝，瞬間瓦解入侵封包，重置追蹤天線！')
    this.playAlarmKlaxon()
    this.saveState()
  }

  public flushIceNodes(): void {
    for (const slot of this.mySubnet.iceSlots) {
      slot.health = slot.maxHealth
    }
    this.mySubnet.firewallHealth = 100
    this.addLog('【全域刷新】重啟全數 ICE 節點緩衝區，修復防火牆完整度至 100%。')
    this.saveState()
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return

    // Lockout countdown
    if (this.stats.isDumped) {
      this.stats.lockoutRemaining = Math.max(0, this.stats.lockoutRemaining - delta)
      if (this.stats.lockoutRemaining <= 0) {
        this.stats.isDumped = false
        this.stats.attackerHealth = 100
        this.addLog('神經接口修復完畢，冷卻結束，可重新連線網絡。')
        this.saveState()
      }
    }

    // Active raid simulation
    if (this.stats.inRaid) {
      const target = this.targets.find(t => t.id === this.stats.activeTargetId)
      if (target) {
        // Natural trace growth
        let traceRate = 3.5
        if (target.iceTypes.includes('black')) {
          traceRate += 2.0
          // Black ice deals neural burn
          this.stats.attackerHealth = Math.max(0, this.stats.attackerHealth - delta * 4)
        }
        if (target.iceTypes.includes('tar')) {
          traceRate += 1.5
        }
        if (target.iceTypes.includes('quantum')) {
          traceRate += 2.5
        }
        this.stats.traceProgress = Math.min(100, this.stats.traceProgress + delta * traceRate)
        this.checkRaidOutcome()
      }
    }
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playAlarmKlaxon(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.setValueAtTime(660, now + 0.15)
    osc.frequency.setValueAtTime(880, now + 0.3)
    osc.frequency.setValueAtTime(660, now + 0.45)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playNeuralShock(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1600, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  public playDataStream(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [1200, 1500, 1800, 2400]
    const freq = freqs[Math.floor(Math.random() * freqs.length)]

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  }

  public playBreachSuccess(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const melody = [587.33, 739.99, 880.00, 1174.66] // D5, F#5, A5, D6
    melody.forEach((f, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.1
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_netrunner_warfare')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.mySubnet) Object.assign(this.mySubnet, parsed.mySubnet)
        if (parsed.stats) {
          this.stats.creditsWon = parsed.stats.creditsWon || 0
          this.stats.creditsLost = parsed.stats.creditsLost || 0
          this.stats.victories = parsed.stats.victories || 0
          this.stats.defeats = parsed.stats.defeats || 0
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
        mySubnet: this.mySubnet,
        stats: {
          creditsWon: this.stats.creditsWon,
          creditsLost: this.stats.creditsLost,
          victories: this.stats.victories,
          defeats: this.stats.defeats,
        },
      }
      localStorage.setItem('nw_netrunner_warfare', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const netrunnerWarfare = new NetrunnerWarfareEngine()
