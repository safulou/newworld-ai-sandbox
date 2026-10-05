/**
 * NewWorld AI Sandbox - Ancient Dyson Sphere Megastructure Construction Engine
 * 
 * Implements:
 * - 4-Phase Celestial Megastructure Engineering (Swarm Mirror Arrays, Equatorial Superconducting Ring, Habitat Worlds, Complete Dyson Shell)
 * - Multi-resource construction contribution (Titanium Alloy, Superconducting Wire, Fusion Cores, Dark Matter Crystals)
 * - Stellar telemetry: Solar Luminosity, Power Generation (up to 100,000 MW), Megastructure Temperature & Structural Integrity
 * - Periodic Solar Flare Ejection events with interactive plasma deflection & supercharged energy harvest
 * - Pure Web Audio procedural audio synthesis (Solar flare roar, rotational megastructure hum, celestial harmonic chimes)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type MegastructurePhaseId = 'phase_1_swarm' | 'phase_2_ring' | 'phase_3_habitat' | 'phase_4_shell'

export interface MegastructurePhase {
  id: MegastructurePhaseId
  name: string
  subtitle: string
  progress: number         // 0 to 100%
  powerOutputMW: number    // Up to designated cap
  maxPowerMW: number
  isCompleted: boolean
  requiredTitanium: number
  requiredSuperconductor: number
  requiredFusionCores: number
  requiredDarkMatter: number
  description: string
  color: string
}

export interface DysonSphereStats {
  currentPhase: MegastructurePhaseId
  totalOutputMW: number
  totalProgress: number    // Overall 0 to 100%
  solarLuminosity: number  // Sol multiples (e.g. 1.0 Sol)
  sphereTemperatureK: number
  stellarAttunementActive: boolean
  activeSolarFlare: boolean
  solarFlareCountdown: number
  flaresHarvested: number
  contributionsCount: number
  inventory: {
    titaniumAlloy: number
    superconductingWire: number
    fusionCores: number
    darkMatterCrystals: number
  }
}

export const DEFAULT_MEGASTRUCTURE_PHASES: MegastructurePhase[] = [
  {
    id: 'phase_1_swarm',
    name: '一期：恆星反射鏡群 (Dyson Swarm Mirrors)',
    subtitle: '部署十萬面自律微型軌道太陽反光陣列',
    progress: 100,
    powerOutputMW: 15000,
    maxPowerMW: 15000,
    isCompleted: true,
    requiredTitanium: 2000,
    requiredSuperconductor: 1200,
    requiredFusionCores: 50,
    requiredDarkMatter: 20,
    description: '以極低軌道環繞恆星的輕量級光壓反射鏡，將恆星光輻射集中導向集能矩陣。',
    color: '#ffdd00'
  },
  {
    id: 'phase_2_ring',
    name: '二期：赤道超導集能環 (Equatorial Superconducting Ring)',
    subtitle: '建造跨越恆星赤道之剛性超導環帶骨架',
    progress: 45,
    powerOutputMW: 15750,
    maxPowerMW: 35000,
    isCompleted: false,
    requiredTitanium: 5000,
    requiredSuperconductor: 3500,
    requiredFusionCores: 150,
    requiredDarkMatter: 60,
    description: '巨大的封閉環狀剛性結構，搭載重型磁約束超導電纜與高壓微波能量發射塔。',
    color: '#00ffff'
  },
  {
    id: 'phase_3_habitat',
    name: '三期：星際巨環居住帶 (Habitat Ring Worlds)',
    subtitle: '於集能環背陽面構築旋轉離心生態艙',
    progress: 0,
    powerOutputMW: 0,
    maxPowerMW: 65000,
    isCompleted: false,
    requiredTitanium: 10000,
    requiredSuperconductor: 6000,
    requiredFusionCores: 300,
    requiredDarkMatter: 120,
    description: '具備大氣層維生與人造重力的人造環形世界，可容納千萬名跨星系先驅移民。',
    color: '#00ff88'
  },
  {
    id: 'phase_4_shell',
    name: '四期：完備戴森球天體外殼 (Full Dyson Shell)',
    subtitle: '完全包裹恆星之天體級超級工程終極體',
    progress: 0,
    powerOutputMW: 0,
    maxPowerMW: 100000,
    isCompleted: false,
    requiredTitanium: 25000,
    requiredSuperconductor: 15000,
    requiredFusionCores: 600,
    requiredDarkMatter: 300,
    description: '徹底捕捉恆星全頻段輻射與中微子流，達成全服無限能量與天體同調光環。',
    color: '#bd00ff'
  }
]

export class DysonSphereMegastructureEngine {
  public phases: MegastructurePhase[]
  public stats: DysonSphereStats = {
    currentPhase: 'phase_2_ring',
    totalOutputMW: 30750,
    totalProgress: 36.25,
    solarLuminosity: 1.25,
    sphereTemperatureK: 3500,
    stellarAttunementActive: true,
    activeSolarFlare: false,
    solarFlareCountdown: 30,
    flaresHarvested: 0,
    contributionsCount: 0,
    inventory: {
      titaniumAlloy: 1200,
      superconductingWire: 800,
      fusionCores: 45,
      darkMatterCrystals: 25
    }
  }

  private audioCtx: AudioContext | null = null
  private lastUpdate = 0

  constructor() {
    this.phases = JSON.parse(JSON.stringify(DEFAULT_MEGASTRUCTURE_PHASES))
    this.loadState()
    this.recalculateTotalOutput()
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

  // ── Resource Contributions ───────────────────────────────────────────────
  public contributeResources(
    titanium: number,
    superconductor: number,
    fusion: number,
    darkMatter: number
  ): boolean {
    const phase = this.phases.find(p => p.id === this.stats.currentPhase)
    if (!phase || phase.isCompleted) return false

    // Check inventory
    if (
      this.stats.inventory.titaniumAlloy < titanium ||
      this.stats.inventory.superconductingWire < superconductor ||
      this.stats.inventory.fusionCores < fusion ||
      this.stats.inventory.darkMatterCrystals < darkMatter
    ) {
      return false
    }

    this.stats.inventory.titaniumAlloy -= titanium
    this.stats.inventory.superconductingWire -= superconductor
    this.stats.inventory.fusionCores -= fusion
    this.stats.inventory.darkMatterCrystals -= darkMatter

    // Calculate progress increment
    const titaniumScore = (titanium / phase.requiredTitanium) * 35
    const superScore = (superconductor / phase.requiredSuperconductor) * 35
    const fusionScore = (fusion / phase.requiredFusionCores) * 20
    const darkScore = (darkMatter / phase.requiredDarkMatter) * 10
    const addedProgress = Math.max(1, Math.round(titaniumScore + superScore + fusionScore + darkScore))

    phase.progress = Math.min(100, phase.progress + addedProgress)
    phase.powerOutputMW = Math.round((phase.progress / 100) * phase.maxPowerMW)

    if (phase.progress >= 100) {
      phase.progress = 100
      phase.isCompleted = true
      this.advanceNextPhase()
    }

    this.stats.contributionsCount += 1
    this.recalculateTotalOutput()
    this.playConstructionProgress()
    this.saveState()
    return true
  }

  public fabricateMaterials(type: 'titanium' | 'wire' | 'core' | 'dark'): void {
    if (type === 'titanium') this.stats.inventory.titaniumAlloy += 250
    if (type === 'wire') this.stats.inventory.superconductingWire += 180
    if (type === 'core') this.stats.inventory.fusionCores += 10
    if (type === 'dark') this.stats.inventory.darkMatterCrystals += 5
    this.saveState()
  }

  private advanceNextPhase(): void {
    this.playCelestialAttunementChime()
    achievements.trackProgress('dyson_architect', 1)

    if (this.stats.currentPhase === 'phase_1_swarm') {
      this.stats.currentPhase = 'phase_2_ring'
    } else if (this.stats.currentPhase === 'phase_2_ring') {
      this.stats.currentPhase = 'phase_3_habitat'
    } else if (this.stats.currentPhase === 'phase_3_habitat') {
      this.stats.currentPhase = 'phase_4_shell'
    }
  }

  private recalculateTotalOutput(): void {
    let sum = 0
    let totalProgressSum = 0
    for (const phase of this.phases) {
      sum += phase.powerOutputMW
      totalProgressSum += phase.progress
    }
    this.stats.totalOutputMW = sum
    this.stats.totalProgress = Math.round((totalProgressSum / (this.phases.length * 100)) * 1000) / 10
  }

  // ── Solar Flare Ejection Mechanics ───────────────────────────────────────
  public harvestSolarFlare(): boolean {
    if (!this.stats.activeSolarFlare) return false
    this.stats.activeSolarFlare = false
    this.stats.flaresHarvested += 1
    this.stats.inventory.superconductingWire += 400
    this.stats.inventory.fusionCores += 15
    this.stats.inventory.darkMatterCrystals += 8

    this.playSolarFlare()
    this.saveState()
    return true
  }

  // ── Update Loop ──────────────────────────────────────────────────────────
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.lastUpdate < 300) return
    this.lastUpdate = now

    // Solar flare countdown
    if (!this.stats.activeSolarFlare) {
      this.stats.solarFlareCountdown -= delta
      if (this.stats.solarFlareCountdown <= 0) {
        this.stats.activeSolarFlare = true
        this.stats.solarFlareCountdown = 45 // Next flare in 45s
        this.playSolarFlare()
      }
    }
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playSolarFlare(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Filtered noise swoosh with low rumble
    const bufferSize = ctx.sampleRate * 0.8
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(320, now)
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.8)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  public playConstructionProgress(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.25)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  public playCelestialAttunementChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    // Celestial Major 9th Arpeggio: C4, E4, G4, B4, D5
    const notes = [261.63, 329.63, 392.0, 493.88, 587.33]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.1
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_dyson_sphere', JSON.stringify({
        phases: this.phases,
        stats: this.stats
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_dyson_sphere')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.phases) this.phases = parsed.phases
        if (parsed.stats) this.stats = { ...this.stats, ...parsed.stats }
      }
    } catch { /* ignore */ }
  }
}

export const dysonSphereMegastructure = new DysonSphereMegastructureEngine()
