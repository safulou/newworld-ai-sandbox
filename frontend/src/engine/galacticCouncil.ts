/**
 * NewWorld AI Sandbox - Interstellar Council & Galactic Diplomacy Engine
 * 
 * Implements:
 * - 4 Galactic Diplomatic Blocs (Pioneer Alliance, Synthetic Collective, Progenitor Custodians, Nomad Belters)
 * - Dynamic Galactic Legislative Resolutions & Voting Chamber
 * - Delegate Weighted Ballots (based on player achievements, fleet strength & capital)
 * - Active Resolution Charters & Civilization-Wide Economic / Tactical Buffs
 * - Pure Web Audio procedural audio synthesis (Council gavel strike, voting chime, veto/sanction klaxon)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type FactionId = 'pioneer_alliance' | 'synthetic_collective' | 'progenitor_custodians' | 'nomad_belters'

export interface CouncilFaction {
  id: FactionId
  name: string
  ideology: string
  standingReputation: number // -100 to +100
  delegateSeats: number
  leaderName: string
  color: string
}

export type ResolutionStatus = 'proposed' | 'voting_active' | 'passed_active' | 'rejected'

export interface GalacticResolution {
  id: string
  title: string
  sponsorFaction: FactionId
  description: string
  ayeVotes: number
  nayVotes: number
  playerVote: 'aye' | 'nay' | 'none'
  status: ResolutionStatus
  effectBuff: string
}

export interface CouncilStats {
  playerDelegateWeight: number // e.g. 150 votes
  totalCouncilSeats: number    // 1000 seats
  passedResolutionsCount: number
  currentDiplomaticStanding: string
  statusMessage: string
}

export const COUNCIL_FACTIONS: Record<FactionId, CouncilFaction> = {
  pioneer_alliance: {
    id: 'pioneer_alliance',
    name: '先驅者星際開拓聯盟 (Pioneer Planetary Alliance)',
    ideology: '擴張基建、自由開拓、行星地球化改造',
    standingReputation: 65,
    delegateSeats: 320,
    leaderName: '議長 艾蓮娜·范德堡',
    color: '#00e5ff'
  },
  synthetic_collective: {
    id: 'synthetic_collective',
    name: '賽博合成智慧共生體 (Synthetic Collective)',
    ideology: '全域算法同調、極限運算、機械自動化',
    standingReputation: 40,
    delegateSeats: 260,
    leaderName: '超主機節點 歐米茄-7',
    color: '#00ff88'
  },
  progenitor_custodians: {
    id: 'progenitor_custodians',
    name: '遠古先行者遺產託管會 (Progenitor Custodians)',
    ideology: '暗物質環境保護、古星門維護、遺產神聖性',
    standingReputation: 25,
    delegateSeats: 220,
    leaderName: '大司庫 沃爾塔克',
    color: '#bd00ff'
  },
  nomad_belters: {
    id: 'nomad_belters',
    name: '深空遊牧採礦公會 (Nomad Void Belters)',
    ideology: '小行星自由採集、免稅自由貿易、反壟斷',
    standingReputation: 50,
    delegateSeats: 200,
    leaderName: '艦隊代表 馬可斯·羅德',
    color: '#ff9100'
  }
}

export const DEFAULT_RESOLUTIONS: GalacticResolution[] = [
  {
    id: 'res_dyson_standard',
    title: '全銀河戴森球能源標準協定 (Galactic Dyson Grid Accord)',
    sponsorFaction: 'pioneer_alliance',
    description: '統一全域戴森球能源併網頻率，所有成員國享有 +30% 超導電網收益與能源折價。',
    ayeVotes: 580,
    nayVotes: 240,
    playerVote: 'none',
    status: 'passed_active',
    effectBuff: '戴森球併網電價收益 +30%'
  },
  {
    id: 'res_stargate_subsidies',
    title: '跨星系星門過路費平準補貼法案 (Stargate Toll Subsidy Act)',
    sponsorFaction: 'nomad_belters',
    description: '由銀河儲備金撥款補貼所有星門樞紐，將跨象限星門躍遷過路費常態性調降 35%。',
    ayeVotes: 420,
    nayVotes: 390,
    playerVote: 'none',
    status: 'voting_active',
    effectBuff: '星門躍遷通行費減免 35%'
  },
  {
    id: 'res_dark_matter_safety',
    title: '暗物質時空裂隙環境安全公約 (Rift Radiation Containment Treaty)',
    sponsorFaction: 'progenitor_custodians',
    description: '強制所有開採者加裝超導防護閥，大幅降低環境輻射累積，神話級時空晶石產率 +40%。',
    ayeVotes: 310,
    nayVotes: 490,
    playerVote: 'none',
    status: 'voting_active',
    effectBuff: '暗物質裂隙神話產率 +40%'
  },
  {
    id: 'res_ai_citizenship',
    title: '自律合成生物智械公民權章程 (Synthetic Sentience Charter)',
    sponsorFaction: 'synthetic_collective',
    description: '承認所有高級 NPC 與義體載體具備完全法定人格，所有技能突觸同調速率提升 25%。',
    ayeVotes: 220,
    nayVotes: 510,
    playerVote: 'none',
    status: 'voting_active',
    effectBuff: '神經意識突觸同調速率 +25%'
  }
]

export class GalacticCouncilEngine {
  public factions: Record<FactionId, CouncilFaction>
  public resolutions: GalacticResolution[] = []
  public stats: CouncilStats = {
    playerDelegateWeight: 180,
    totalCouncilSeats: 1000,
    passedResolutionsCount: 1,
    currentDiplomaticStanding: '銀河開拓特使 (Plenipotentiary Envoy)',
    statusMessage: '星際議會大廳就緒，多項重大銀河法案正在辯論審議中。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.factions = JSON.parse(JSON.stringify(COUNCIL_FACTIONS))
    this.resolutions = JSON.parse(JSON.stringify(DEFAULT_RESOLUTIONS))
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

  // ── Voting Controls ────────────────────────────────────────────────────────
  public castVote(resolutionId: string, choice: 'aye' | 'nay'): boolean {
    const res = this.resolutions.find(r => r.id === resolutionId)
    if (!res || res.status !== 'voting_active') return false
    if (res.playerVote !== 'none') return false // Already voted

    res.playerVote = choice
    const weight = this.stats.playerDelegateWeight

    if (choice === 'aye') {
      res.ayeVotes += weight
      this.stats.statusMessage = `🗳️ 您以 ${weight} 票代表權贊成法案 [${res.title}]！`
    } else {
      res.nayVotes += weight
      this.stats.statusMessage = `🗳️ 您以 ${weight} 票代表權否決法案 [${res.title}]！`
    }

    // Check pass condition (> 500 votes in council)
    if (res.ayeVotes >= 501) {
      res.status = 'passed_active'
      this.stats.passedResolutionsCount += 1
      this.stats.statusMessage = `📜 [法案通過] 《${res.title}》正式簽署生效！全服生效增益：${res.effectBuff}`
      this.playGavelStrike()

      // Track achievement
      achievements.trackProgress('council_speaker', 1)
    } else if (res.nayVotes >= 501) {
      res.status = 'rejected'
      this.stats.statusMessage = `❌ [法案遭否決] 《${res.title}》未達法定多數，議會決議駁回。`
      this.playSanctionKlaxon()
    } else {
      this.playVoteChime()
    }

    this.saveState()
    return true
  }

  public improveReputation(factionId: FactionId, amount: number = 10): boolean {
    const faction = this.factions[factionId]
    if (!faction) return false

    faction.standingReputation = Math.min(100, faction.standingReputation + amount)
    this.stats.playerDelegateWeight += 5
    this.stats.statusMessage = `🤝 透過外交斡旋，與 [${faction.name}] 關係升溫 (+${amount})，代表權票數增加！`

    this.playVoteChime()
    this.saveState()
    return true
  }

  // ── Procedural Web Audio Sound Synthesis ───────────────────────────────────
  public playGavelStrike(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Heavy wooden / metallic gavel strike
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18)

    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  public playVoteChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(659.25, now) // E5
    osc.frequency.setValueAtTime(880, now + 0.08) // A5

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  public playSanctionKlaxon(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.setValueAtTime(220, now + 0.15)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_galactic_council', JSON.stringify({
        stats: this.stats,
        factions: this.factions,
        resolutions: this.resolutions
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_galactic_council')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.factions) {
          this.factions = parsed.factions
        }
        if (parsed.resolutions) {
          this.resolutions = parsed.resolutions
        }
      }
    } catch { /* ignore */ }
  }
}

export const galacticCouncil = new GalacticCouncilEngine()
