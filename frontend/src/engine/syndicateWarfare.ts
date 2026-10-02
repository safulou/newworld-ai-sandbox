/**
 * NewWorld AI Sandbox - Multiplayer Syndicate Corporate Wars Engine
 * 
 * Implements:
 * - 4 rival mega-corporate syndicates with unique faction perks
 * - 5 persistent contested world territory sectors (influence control points, defense beacons, tax dividends)
 * - Faction warfare operations (Deploy Defense Grid, Subnet Blitz assault, Dividend distribution)
 * - Pure Web Audio procedural audio synthesis (War horn fanfare, conquest chords, dividend chime)
 * - LocalStorage state & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type FactionId = 'neon_syndicate' | 'arasaka_sec' | 'cygnus_fleet' | 'quantum_vanguard'

export interface Faction {
  id: FactionId
  name: string
  motto: string
  perkDescription: string
  color: string
  totalSectorsHeld: number
}

export interface TerritorySector {
  id: string
  name: string
  location: string
  controllingFaction: FactionId
  controlPoints: number       // 0 to 1000
  maxControlPoints: number
  defenseTier: number         // 1 to 5
  dailyDividends: number      // Stored credits
  isContested: boolean
}

export interface PlayerSyndicateProfile {
  faction: FactionId
  rank: 'Recruit' | 'Enforcer' | 'Commander' | 'Overlord'
  meritPoints: number
  dividendClaimable: number
  totalDividendsClaimed: number
  battlesWon: number
}

export const FACTIONS: Faction[] = [
  {
    id: 'neon_syndicate',
    name: '霓虹暗網辛迪加 (Neon Syndicate)',
    motto: '在光影暗處主宰數據鏈',
    perkDescription: '網絡黑客入侵速度 +25%，子網隱匿度提升',
    color: '#00ffff',
    totalSectorsHeld: 1,
  },
  {
    id: 'arasaka_sec',
    name: '荒坂重工防衛軍 (Arasaka Security)',
    motto: '絕對鋼鐵秩序與軍械壟斷',
    perkDescription: '領地哨戒砲塔火力 +30%，裝甲抗性提升',
    color: '#ff0055',
    totalSectorsHeld: 1,
  },
  {
    id: 'cygnus_fleet',
    name: '天鵝座深空遠征艦隊 (Cygnus Fleet)',
    motto: '星辰彼端皆為吾之領土',
    perkDescription: '星艦曲率躍遷冷卻 -30%，推進力提升',
    color: '#ffaa00',
    totalSectorsHeld: 1,
  },
  {
    id: 'quantum_vanguard',
    name: '量子科學開拓先鋒 (Quantum Vanguard)',
    motto: '解析宇宙真理，超越奇異點',
    perkDescription: '超導電網發電量 +35%，科技藍圖產能加成',
    color: '#aa00ff',
    totalSectorsHeld: 2,
  },
]

export const DEFAULT_TERRITORIES: TerritorySector[] = [
  {
    id: 'sector_downtown',
    name: '新世界都市中樞核心 (Downtown Core)',
    location: 'Chunk (0, 0)',
    controllingFaction: 'neon_syndicate',
    controlPoints: 650,
    maxControlPoints: 1000,
    defenseTier: 3,
    dailyDividends: 3200,
    isContested: true,
  },
  {
    id: 'sector_drydock',
    name: '軌道星艦造船廠 (Orbital Drydock)',
    location: 'Y >= 180',
    controllingFaction: 'cygnus_fleet',
    controlPoints: 820,
    maxControlPoints: 1000,
    defenseTier: 4,
    dailyDividends: 4500,
    isContested: false,
  },
  {
    id: 'sector_abyss',
    name: '深海海溝熱液開採區 (Abyssal Trench)',
    location: 'Y < -50',
    controllingFaction: 'arasaka_sec',
    controlPoints: 740,
    maxControlPoints: 1000,
    defenseTier: 3,
    dailyDividends: 2800,
    isContested: true,
  },
  {
    id: 'sector_industry',
    name: '自動化重工矩陣 (Industrial Matrix)',
    location: 'Chunk (4, -2)',
    controllingFaction: 'quantum_vanguard',
    controlPoints: 900,
    maxControlPoints: 1000,
    defenseTier: 5,
    dailyDividends: 5200,
    isContested: false,
  },
  {
    id: 'sector_stargate',
    name: '脈衝星雲折躍門 (Cygnus Stargate)',
    location: '深空象限 [9200, 450, -3100]',
    controllingFaction: 'quantum_vanguard',
    controlPoints: 780,
    maxControlPoints: 1000,
    defenseTier: 4,
    dailyDividends: 4800,
    isContested: true,
  },
]

export class SyndicateWarfareEngine {
  public factions: Faction[] = JSON.parse(JSON.stringify(FACTIONS))
  public territories: TerritorySector[] = JSON.parse(JSON.stringify(DEFAULT_TERRITORIES))
  public player: PlayerSyndicateProfile = {
    faction: 'quantum_vanguard',
    rank: 'Commander',
    meritPoints: 1450,
    dividendClaimable: 1800,
    totalDividendsClaimed: 0,
    battlesWon: 8,
  }

  public warLogs: string[] = ['[軍事通訊] 公會聯盟領地戰役已開啟，5 大戰略據點爭奪進行中。']
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
    this.warLogs.unshift(`[${time}] ${msg}`)
    if (this.warLogs.length > 50) this.warLogs.pop()
  }

  public joinFaction(factionId: FactionId): void {
    if (this.player.faction === factionId) return
    this.player.faction = factionId
    const f = this.factions.find(x => x.id === factionId)
    this.addLog(`[陣營轉換] 您已宣誓效忠於【${f?.name}】！獲得專屬陣營加成。`)
    this.playWarHorn()
    this.saveState()
  }

  public deployDefense(sectorId: string): { success: boolean; message: string } {
    const sector = this.territories.find(t => t.id === sectorId)
    if (!sector) return { success: false, message: '找不到指定據點' }

    if (sector.controllingFaction !== this.player.faction) {
      return { success: false, message: '只能在己方陣營佔領的據點部署防衛陣列！' }
    }

    sector.controlPoints = Math.min(sector.maxControlPoints, sector.controlPoints + 60)
    if (sector.defenseTier < 5 && Math.random() < 0.3) {
      sector.defenseTier++
    }
    this.player.meritPoints += 25
    this.addLog(`[防務加固] 於【${sector.name}】部署量子哨戒陣列！控制點 +60，功勳 +25。`)
    this.playCaptureSound()
    this.saveState()
    return { success: true, message: '防衛部署完畢！' }
  }

  public launchBlitz(sectorId: string): { success: boolean; message: string } {
    const sector = this.territories.find(t => t.id === sectorId)
    if (!sector) return { success: false, message: '找不到指定據點' }

    if (sector.controllingFaction === this.player.faction) {
      return { success: false, message: '該據點已由己方陣營統治，無需發起進攻！' }
    }

    const dmg = 120 + Math.round(Math.random() * 60)
    sector.controlPoints -= dmg
    this.player.meritPoints += 40

    if (sector.controlPoints <= 0) {
      // Conquest!
      const prevFaction = sector.controllingFaction
      sector.controllingFaction = this.player.faction
      sector.controlPoints = 350
      sector.isContested = false
      this.player.battlesWon++
      this.player.dividendClaimable += 1000

      this.addLog(`⚔️【據點佔領】擊潰 ${prevFaction} 防禦！【${sector.name}】現已被【${this.getCurrentFaction()?.name}】完全佔領！`)
      this.playCaptureSound()

      if (this.player.battlesWon >= 10) {
        achievements.unlock('syndicate_warlord')
      }
    } else {
      this.addLog(`[火力突襲] 突擊【${sector.name}】防禦網！削弱敵方控制點 -${dmg}，功勳 +40。`)
      this.playWarHorn()
    }

    this.saveState()
    return { success: true, message: `突襲成功！削弱敵方 ${dmg} 點控制度。` }
  }

  public claimDividends(): { success: boolean; message: string } {
    if (this.player.dividendClaimable <= 0) {
      return { success: false, message: '目前無可領取的領地分紅' }
    }

    const amount = this.player.dividendClaimable
    this.player.dividendClaimable = 0
    this.player.totalDividendsClaimed += amount
    this.addLog(`[分紅領取] 成功領取領地稅率分紅 +${amount.toLocaleString()} 信用點！`)
    this.playDividendChime()

    if (this.player.totalDividendsClaimed >= 5000) {
      achievements.unlock('syndicate_warlord')
    }

    this.saveState()
    return { success: true, message: `領取 ${amount} 點分紅！` }
  }

  public getCurrentFaction(): Faction | undefined {
    return this.factions.find(f => f.id === this.player.faction)
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return

    // Periodic dividend accumulation and territory contest simulation
    if (Math.random() < 0.015) {
      // Accumulate dividend based on sectors held
      const mySectors = this.territories.filter(t => t.controllingFaction === this.player.faction)
      const bonus = mySectors.reduce((acc, s) => acc + s.dailyDividends * 0.02, 0)
      this.player.dividendClaimable += Math.round(bonus)
    }
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playWarHorn(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Synth brass fanfare
    const notes = [146.83, 220.00, 293.66] // D3, A3, D4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.08
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  public playCaptureSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25] // C Major 9
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.07
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  }

  public playDividendChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [1046.50, 1318.51, 1567.98] // C6, E6, G6
    freqs.forEach((freq, idx) => {
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

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_syndicate_warfare')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.player) Object.assign(this.player, parsed.player)
        if (parsed.territories && Array.isArray(parsed.territories)) {
          for (const t of parsed.territories) {
            const match = this.territories.find(x => x.id === t.id)
            if (match) {
              match.controllingFaction = t.controllingFaction ?? match.controllingFaction
              match.controlPoints = t.controlPoints ?? match.controlPoints
              match.defenseTier = t.defenseTier ?? match.defenseTier
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
        player: this.player,
        territories: this.territories.map(t => ({
          id: t.id,
          controllingFaction: t.controllingFaction,
          controlPoints: t.controlPoints,
          defenseTier: t.defenseTier,
        })),
      }
      localStorage.setItem('nw_syndicate_warfare', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const syndicateWarfare = new SyndicateWarfareEngine()
