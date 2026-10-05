/**
 * NewWorld AI Sandbox - Ark Fleet Formations & Deep Space Expeditions Engine
 * 
 * Implements:
 * - Multi-Ark Interstellar Fleet Formations (V-Formation, Diamond, Orbital Ring, Hyper Line)
 * - 4 Expedition Capital Ship Classes (Ark One, Plasma Dreadnought, Bio-Freighter, Warp Escort)
 * - 4 Deep Space Exploration Zones (Andromeda Wormhole, Betelgeuse Supernova, Forerunner Dyson Ruin, Event Horizon Rift)
 * - Real-time transit telemetry, distance calculation, resource consumption (Fuel, Supplies, Ammo, Morale)
 * - Dynamic en-route encounter decisions (Gravitational Shear, Void Pirates, Alien Relic Signals)
 * - Pure Web Audio procedural audio synthesis (Fleet engine drone, warp jump boom, victory fanfare, combat alarm)
 * - LocalStorage state persistence & Meta-universe achievement unlock integration
 */

import { achievements } from './achievements'

export type FormationType = 'v_formation' | 'diamond' | 'orbital_ring' | 'hyper_line'

export type ExpeditionState = 'docked' | 'preparing' | 'in_transit' | 'encounter' | 'returning' | 'completed'

export type ShipClassId = 'ark_one' | 'plasma_dreadnought' | 'bio_freighter' | 'warp_escort'

export interface CapitalShip {
  id: ShipClassId
  name: string
  classRole: string
  level: number
  hull: number
  maxHull: number
  shield: number
  maxShield: number
  firepower: number
  cargoCapacity: number
  isActive: boolean
  specialPerk: string
  icon: string
}

export type ZoneId = 'andromeda_wormhole' | 'betelgeuse_supernova' | 'forerunner_dyson_ruin' | 'event_horizon_rift'

export interface ExpeditionZone {
  id: ZoneId
  name: string
  sectorName: string
  distanceLY: number // Light-Years
  difficulty: 'Normal' | 'Hard' | 'Extreme' | 'Nightmare'
  fuelCost: number
  suppliesCost: number
  description: string
  potentialRewards: string[]
  color: string
}

export interface DynamicEncounter {
  id: string
  title: string
  description: string
  threatLevel: 'Low' | 'Medium' | 'Critical'
  options: {
    label: string
    action: string
    resourceCost?: { fuel?: number; supplies?: number; ammo?: number }
    successChance: number // 0 to 1
  }[]
}

export interface FleetExpeditionStats {
  formation: FormationType
  state: ExpeditionState
  activeZoneId: ZoneId | null
  transitProgress: number // 0 to 100%
  transitSpeedLYs: number // Light-Years per sec
  fuel: number
  maxFuel: number
  supplies: number
  maxSupplies: number
  ammo: number
  maxAmmo: number
  fleetMorale: number     // 0 to 100%
  creditsVault: number
  relicsFound: number
  expeditionsCompleted: number
  activeEncounter: DynamicEncounter | null
  encounterResolvedMsg: string | null
}

export const DEFAULT_CAPITAL_SHIPS: CapitalShip[] = [
  {
    id: 'ark_one',
    name: '方舟一號殖民旗艦 (Ark-01 Genesis)',
    classRole: 'Flagship Colony Dreadnought',
    level: 1,
    hull: 10000,
    maxHull: 10000,
    shield: 5000,
    maxShield: 5000,
    firepower: 350,
    cargoCapacity: 5000,
    isActive: true,
    specialPerk: '全艦隊士氣衰減降低 40%，補給消耗 -20%',
    icon: '🛸'
  },
  {
    id: 'plasma_dreadnought',
    name: '等離子無畏戰列艦 (Plasma Dreadnought)',
    classRole: 'Heavy Assault Battleship',
    level: 1,
    hull: 6500,
    maxHull: 6500,
    shield: 4000,
    maxShield: 4000,
    firepower: 950,
    cargoCapacity: 1200,
    isActive: true,
    specialPerk: '遇敵戰鬥勝率提高 +35%，重型火力掩護',
    icon: '⚔️'
  },
  {
    id: 'bio_freighter',
    name: '生化深空重型駁船 (Bio-Freighter Gaia)',
    classRole: 'Logistics Resource Carrier',
    level: 1,
    hull: 4500,
    maxHull: 4500,
    shield: 2500,
    maxShield: 2500,
    firepower: 120,
    cargoCapacity: 8000,
    isActive: true,
    specialPerk: '航行週期自動再生微量生物補給 (+10/min)',
    icon: '📦'
  },
  {
    id: 'warp_escort',
    name: '曲率疾風護衛巡洋艦 (Warp Escort Swift)',
    classRole: 'Rapid Recon Frigate',
    level: 1,
    hull: 3200,
    maxHull: 3200,
    shield: 3500,
    maxShield: 3500,
    firepower: 420,
    cargoCapacity: 1500,
    isActive: true,
    specialPerk: '超空間航行速度躍升 +40%，規避空間畸變',
    icon: '⚡'
  }
]

export const EXPEDITION_ZONES: ExpeditionZone[] = [
  {
    id: 'andromeda_wormhole',
    name: '仙女座先鋒蟲洞 (Andromeda Wormhole)',
    sectorName: 'Sector AND-09',
    distanceLY: 25000,
    difficulty: 'Normal',
    fuelCost: 1200,
    suppliesCost: 600,
    description: '穩定的自然蟲洞重力透鏡，通往鄰近星系的先鋒前哨站。適合初級遠征與探勘。',
    potentialRewards: ['蟲洞重力晶核', '20,000 信用點', '深空星圖拓撲數據'],
    color: '#00ffff'
  },
  {
    id: 'betelgeuse_supernova',
    name: '參宿四超新星遺跡 (Betelgeuse Remnant)',
    sectorName: 'Orion Nebula-B4',
    distanceLY: 64000,
    difficulty: 'Hard',
    fuelCost: 2800,
    suppliesCost: 1400,
    description: '劇烈爆發後遺留的脈衝星雲與重元素吸積盤，蘊藏極稀有的恆星火花核。',
    potentialRewards: ['恆星火花核', '45,000 信用點', '重元素超導合金'],
    color: '#ffaa00'
  },
  {
    id: 'forerunner_dyson_ruin',
    name: '先行者失落戴森環 (Forerunner Dyson Ring)',
    sectorName: 'Cygnus Void Ruin',
    distanceLY: 120000,
    difficulty: 'Extreme',
    fuelCost: 4500,
    suppliesCost: 2200,
    description: '數百萬年前古外星先驅者所留下的天體級集能環殘骸，具有未知的空間編碼器。',
    potentialRewards: ['先行者古代編碼器', '80,000 信用點', '天體工程藍圖矩陣'],
    color: '#bd00ff'
  },
  {
    id: 'event_horizon_rift',
    name: '視界邊緣引力裂口 (Event Horizon Abyss)',
    sectorName: 'Sagittarius A* Perimeter',
    distanceLY: 250000,
    difficulty: 'Nightmare',
    fuelCost: 7500,
    suppliesCost: 3800,
    description: '位於銀河中心超巨質量黑洞潮汐力場邊緣，極限扭曲的時空奇異點裂痕。',
    potentialRewards: ['奇異點暗物質核', '150,000 信用點', '零點真空能源核心'],
    color: '#ff0055'
  }
]

export class ArkFleetExpeditionsEngine {
  public ships: CapitalShip[] = []
  public stats: FleetExpeditionStats = {
    formation: 'v_formation',
    state: 'docked',
    activeZoneId: null,
    transitProgress: 0,
    transitSpeedLYs: 250,
    fuel: 10000,
    maxFuel: 10000,
    supplies: 5000,
    maxSupplies: 5000,
    ammo: 2000,
    maxAmmo: 2000,
    fleetMorale: 100,
    creditsVault: 50000,
    relicsFound: 0,
    expeditionsCompleted: 0,
    activeEncounter: null,
    encounterResolvedMsg: null
  }

  private audioCtx: AudioContext | null = null
  private lastUpdateTime = 0

  constructor() {
    this.ships = JSON.parse(JSON.stringify(DEFAULT_CAPITAL_SHIPS))
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

  // ── Formation Operations ──────────────────────────────────────────────────
  public setFormation(formation: FormationType): void {
    this.stats.formation = formation
    this.saveState()
  }

  public getFormationBuff(): string {
    switch (this.stats.formation) {
      case 'v_formation': return '航行巡弋速度 +25%，燃油經濟性 +15%'
      case 'diamond': return '全艦偏折護盾同調 +30%，抵禦異常環境'
      case 'orbital_ring': return '資源採集貨運量 +40%，補給消耗 -20%'
      case 'hyper_line': return '遭遇戰先攻重裝火力 +50%，突破敵對防線'
    }
  }

  // ── Ship Management ───────────────────────────────────────────────────────
  public upgradeShip(shipId: ShipClassId): boolean {
    const ship = this.ships.find(s => s.id === shipId)
    if (!ship) return false
    const cost = ship.level * 15000
    if (this.stats.creditsVault < cost) return false

    this.stats.creditsVault -= cost
    ship.level += 1
    ship.maxHull += Math.round(ship.maxHull * 0.2)
    ship.hull = ship.maxHull
    ship.maxShield += Math.round(ship.maxShield * 0.2)
    ship.shield = ship.maxShield
    ship.firepower += Math.round(ship.firepower * 0.25)
    ship.cargoCapacity += Math.round(ship.cargoCapacity * 0.2)

    this.playVictoryFanfare()
    this.saveState()
    return true
  }

  public repairAllShips(): boolean {
    const cost = 5000
    if (this.stats.creditsVault < cost) return false
    this.stats.creditsVault -= cost
    for (const ship of this.ships) {
      ship.hull = ship.maxHull
      ship.shield = ship.maxShield
    }
    this.saveState()
    return true
  }

  // ── Expedition Control ───────────────────────────────────────────────────
  public launchExpedition(zoneId: ZoneId): boolean {
    if (this.stats.state !== 'docked') return false
    const zone = EXPEDITION_ZONES.find(z => z.id === zoneId)
    if (!zone) return false

    if (this.stats.fuel < zone.fuelCost || this.stats.supplies < zone.suppliesCost) {
      return false
    }

    this.stats.fuel -= zone.fuelCost
    this.stats.supplies -= zone.suppliesCost
    this.stats.activeZoneId = zoneId
    this.stats.transitProgress = 0
    this.stats.state = 'in_transit'
    this.stats.encounterResolvedMsg = null
    this.stats.activeEncounter = null

    // Speed calculation influenced by warp escort ship and formation
    let speed = 250
    if (this.stats.formation === 'v_formation') speed *= 1.25
    const escort = this.ships.find(s => s.id === 'warp_escort')
    if (escort && escort.isActive) speed *= (1 + escort.level * 0.1)
    this.stats.transitSpeedLYs = Math.round(speed)

    this.playWarpJumpSound()
    this.saveState()
    return true
  }

  public abortExpedition(): void {
    if (this.stats.state === 'in_transit' || this.stats.state === 'encounter') {
      this.stats.state = 'returning'
      this.stats.encounterResolvedMsg = '艦隊已中斷任務並啟動曲率折返程序。'
      this.saveState()
    }
  }

  // ── Encounter Handling ───────────────────────────────────────────────────
  public resolveEncounter(action: string): boolean {
    if (!this.stats.activeEncounter) return false

    const opt = this.stats.activeEncounter.options.find(o => o.action === action)
    if (!opt) return false

    if (opt.resourceCost) {
      if (opt.resourceCost.fuel && this.stats.fuel < opt.resourceCost.fuel) return false
      if (opt.resourceCost.supplies && this.stats.supplies < opt.resourceCost.supplies) return false
      if (opt.resourceCost.ammo && this.stats.ammo < opt.resourceCost.ammo) return false

      if (opt.resourceCost.fuel) this.stats.fuel -= opt.resourceCost.fuel
      if (opt.resourceCost.supplies) this.stats.supplies -= opt.resourceCost.supplies
      if (opt.resourceCost.ammo) this.stats.ammo -= opt.resourceCost.ammo
    }

    // Success calculation
    let success = Math.random() < opt.successChance
    if (this.stats.formation === 'hyper_line') success = true

    if (success) {
      this.stats.fleetMorale = Math.min(100, this.stats.fleetMorale + 10)
      this.stats.creditsVault += 8000
      this.stats.encounterResolvedMsg = `✅ 決策成功：艦隊成功化解 [${this.stats.activeEncounter.title}]，士氣提升並回收 8,000 信用點！`
      this.playVictoryFanfare()
    } else {
      this.stats.fleetMorale = Math.max(20, this.stats.fleetMorale - 15)
      // Damage ships slightly
      for (const ship of this.ships) {
        ship.shield = Math.max(0, ship.shield - 300)
        if (ship.shield === 0) {
          ship.hull = Math.max(500, ship.hull - 400)
        }
      }
      this.stats.encounterResolvedMsg = `⚠️ 遭遇波折：[${this.stats.activeEncounter.title}] 造成艦隊護盾過載受創，士氣下降。`
    }

    this.stats.activeEncounter = null
    this.stats.state = 'in_transit'
    this.saveState()
    return true
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.lastUpdateTime < 250) return
    this.lastUpdateTime = now

    if (this.stats.state === 'in_transit') {
      const zone = EXPEDITION_ZONES.find(z => z.id === this.stats.activeZoneId)
      if (!zone) return

      // Progress calculation
      const progressDelta = (this.stats.transitSpeedLYs / zone.distanceLY) * 100 * delta * 5
      this.stats.transitProgress += progressDelta

      // Chance of random encounter around 40% ~ 60%
      if (
        !this.stats.activeEncounter &&
        this.stats.transitProgress > 40 &&
        this.stats.transitProgress < 65 &&
        Math.random() < 0.08
      ) {
        this.triggerRandomEncounter()
        return
      }

      if (this.stats.transitProgress >= 100) {
        this.completeExpedition(zone)
      }
    } else if (this.stats.state === 'returning') {
      this.stats.transitProgress -= 8 * delta
      if (this.stats.transitProgress <= 0) {
        this.stats.transitProgress = 0
        this.stats.state = 'docked'
        this.stats.activeZoneId = null
      }
    }
  }

  private triggerRandomEncounter(): void {
    const encounters: DynamicEncounter[] = [
      {
        id: 'gravitational_shear',
        title: '微型黑洞時空剪切波',
        description: '艦隊曲率泡即將受到強烈引力剪切干擾，若不處置可能導致跳躍泡塌陷受損。',
        threatLevel: 'Medium',
        options: [
          {
            label: '超頻鑽石護盾硬扛衝擊',
            action: 'overcharge_shields',
            resourceCost: { fuel: 150 },
            successChance: 0.75
          },
          {
            label: '緊急折向變軌規避',
            action: 'evasive_reroute',
            resourceCost: { fuel: 300 },
            successChance: 0.95
          }
        ]
      },
      {
        id: 'void_pirate_ambush',
        title: '深空虛空海盜截擊伏擊',
        description: '3 艘改裝突擊巡洋艦自小行星群陰影殺出，意圖掠奪駁船補給物資。',
        threatLevel: 'Critical',
        options: [
          {
            label: '無畏艦主砲齊射殲滅敵艦',
            action: 'dreadnought_salvo',
            resourceCost: { ammo: 200 },
            successChance: 0.85
          },
          {
            label: '釋放干擾誘餌並全速脫離',
            action: 'decoy_boost',
            resourceCost: { supplies: 150 },
            successChance: 0.7
          }
        ]
      },
      {
        id: 'forerunner_beacon',
        title: '先行者古代沉沒信標廣播',
        description: '探測陣列捕捉到未知頻率的古代外星信號源，正脈衝發出高能引力波。',
        threatLevel: 'Low',
        options: [
          {
            label: '派發無人機探測解析信號',
            action: 'probe_signal',
            resourceCost: { supplies: 80 },
            successChance: 0.9
          },
          {
            label: '直接牽引信標主體回收藍圖',
            action: 'salvage_beacon',
            resourceCost: { fuel: 100 },
            successChance: 0.65
          }
        ]
      }
    ]

    const pick = encounters[Math.floor(Math.random() * encounters.length)]
    this.stats.activeEncounter = pick
    this.stats.state = 'encounter'
    this.playAlarmAlert()
    this.saveState()
  }

  private completeExpedition(zone: ExpeditionZone): void {
    this.stats.state = 'completed'
    this.stats.transitProgress = 100
    this.stats.expeditionsCompleted += 1
    this.stats.relicsFound += 1

    let rewardCredits = 25000
    if (zone.id === 'betelgeuse_supernova') rewardCredits = 50000
    if (zone.id === 'forerunner_dyson_ruin') rewardCredits = 90000
    if (zone.id === 'event_horizon_rift') rewardCredits = 180000

    this.stats.creditsVault += rewardCredits
    this.stats.fleetMorale = Math.min(100, this.stats.fleetMorale + 15)

    // Achievements
    achievements.trackProgress('fleet_admiral', 1)

    this.playVictoryFanfare()
    this.saveState()
  }

  public returnToHangar(): void {
    this.stats.state = 'docked'
    this.stats.activeZoneId = null
    this.stats.transitProgress = 0
    this.stats.activeEncounter = null
    this.stats.encounterResolvedMsg = null
    this.saveState()
  }

  public resupplyFleet(): boolean {
    const cost = 8000
    if (this.stats.creditsVault < cost) return false
    this.stats.creditsVault -= cost
    this.stats.fuel = this.stats.maxFuel
    this.stats.supplies = this.stats.maxSupplies
    this.stats.ammo = this.stats.maxAmmo
    this.stats.fleetMorale = 100
    this.saveState()
    return true
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playCruiseDrone(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(65, now)
    osc.frequency.exponentialRampToValueAtTime(72, now + 1.2)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.5)
  }

  public playWarpJumpSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 1.8)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 2.0)
  }

  public playVictoryFanfare(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [329.63, 440, 554.37, 659.25, 880] // E Major triad
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.09
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.45)
    })
  }

  public playAlarmAlert(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(750, now)
    osc.frequency.setValueAtTime(500, now + 0.15)
    osc.frequency.setValueAtTime(750, now + 0.3)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_ark_expeditions', JSON.stringify({
        ships: this.ships,
        stats: this.stats
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_ark_expeditions')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.ships) this.ships = parsed.ships
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
          // If loaded during an encounter or transit, keep sane values
          if (this.stats.state === 'in_transit' && !this.stats.activeZoneId) {
            this.stats.state = 'docked'
          }
        }
      }
    } catch { /* ignore */ }
  }
}

export const arkFleetExpeditions = new ArkFleetExpeditionsEngine()
