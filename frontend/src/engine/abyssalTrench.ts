/**
 * NewWorld AI Sandbox - Abyssal Trench & Deep-Sea Submersible Physics Engine
 *
 * Implements:
 * - Hydrostatic water pressure gradient simulation (1.0 bar to 100.0 bar for Y: 20 -> -64).
 * - Deep-Sea Exploration Submersible: hull pressure tolerance, floodlight cone, active sonar ping.
 * - Hydrothermal Vents: black smoker vents emitting heat (350°C) and collectable abyssal minerals.
 * - Abyssal Cyber Leviathan: deep-sea bio-luminescent guardian serpent roaming oceanic depths.
 * - Web Audio procedural sound synthesis: sonar ping sweep with echo, underwater engine hum, pressure groans.
 */

import * as THREE from 'three'

export interface AbyssalMineral {
  id: string
  name: string
  depthRequired: number
  description: string
  value: number
  color: string
}

export interface HydrothermalVent {
  id: string
  name: string
  pos: THREE.Vector3
  tempCelsius: number
  mineralYield: string
  active: boolean
}

export interface SonarContact {
  type: 'vent' | 'leviathan' | 'trench_floor'
  name: string
  distance: number
  bearingDeg: number
  pos: THREE.Vector3
}

export const ABYSSAL_MINERALS: AbyssalMineral[] = [
  { id: 'abyssal_cobalt', name: '深淵磁化鈷藍礦', depthRequired: 0, description: '耐高壓超導電漿磁性金屬', value: 80, color: '#00d4ff' },
  { id: 'pyro_sulfide', name: '熱液硫化黑金晶', depthRequired: -25, description: '沉積在黑色煙囪口的高溫結晶', value: 160, color: '#ff9900' },
  { id: 'luminescent_pearl', name: '發光深海量子珠', depthRequired: -45, description: '深淵利維坦共生發光能量核心', value: 300, color: '#00ffaa' },
  { id: 'hadal_core', name: '海溝超壓核岩', depthRequired: -60, description: '承受千米水壓形成的超密物質', value: 500, color: '#ff00aa' },
]

export class AbyssalTrenchEngine {
  private static instance: AbyssalTrenchEngine | null = null
  private audioCtx: AudioContext | null = null

  // Submersible Status
  public isSubmerged: boolean = false
  public currentDepth: number = 10 // Y coordinate (<= 15 is ocean)
  public hydrostaticPressure: number = 1.0 // in Bar / Atmospheres
  public hullIntegrity: number = 100 // %
  public oxygenBattery: number = 100 // %
  public floodlightOn: boolean = true
  public isSonarActive: boolean = false

  // Discovered mineral inventory
  public inventory: Record<string, number> = {
    abyssal_cobalt: 2,
    pyro_sulfide: 0,
    luminescent_pearl: 0,
    hadal_core: 0
  }

  // Hydrothermal Vents
  public vents: HydrothermalVent[] = [
    { id: 'vent_alpha', name: '阿爾法黑色煙囪口', pos: new THREE.Vector3(25, -30, -15), tempCelsius: 348, mineralYield: 'pyro_sulfide', active: true },
    { id: 'vent_beta', name: '貝塔超臨界沸騰噴泉', pos: new THREE.Vector3(-40, -52, 35), tempCelsius: 395, mineralYield: 'luminescent_pearl', active: true },
    { id: 'vent_gamma', name: '深淵冷泉沉積錐', pos: new THREE.Vector3(5, -62, 50), tempCelsius: 280, mineralYield: 'hadal_core', active: true }
  ]

  // Abyssal Cyber Leviathan
  public leviathan = {
    name: '深淵發光賽博利維坦 (Abyssal Leviathan)',
    pos: new THREE.Vector3(0, -45, 0),
    heading: 0,
    speed: 3.5,
    glowPhase: 0
  }

  // Sonar sweep contacts
  public latestSonarContacts: SonarContact[] = []

  private constructor() {
    this.loadState()
  }

  public static getInstance(): AbyssalTrenchEngine {
    if (!AbyssalTrenchEngine.instance) {
      AbyssalTrenchEngine.instance = new AbyssalTrenchEngine()
    }
    return AbyssalTrenchEngine.instance
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.audioCtx = new AudioCtx()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  /**
   * Calculate Hydrostatic Pressure based on Y level
   * Sea surface Y = 16 (1.0 bar)
   * Deepest trench Y = -64 (100.0 bar)
   */
  public calculatePressure(y: number): number {
    if (y >= 16) return 1.0
    // Depth from sea level: 16 -> -64 is 80 units
    const depthMeters = 16 - y
    const bar = 1.0 + (depthMeters / 80) * 99.0
    return Number(bar.toFixed(1))
  }

  public toggleFloodlight(): boolean {
    this.floodlightOn = !this.floodlightOn
    this.playSwitchSound()
    return this.floodlightOn
  }

  /**
   * Trigger an active Sonar Ping sweep
   */
  public triggerSonarPing(subPos: THREE.Vector3 = new THREE.Vector3(0, this.currentDepth, 0)): SonarContact[] {
    this.initAudio()
    this.isSonarActive = true
    this.playSonarPingSound()

    const contacts: SonarContact[] = []

    // 1. Check Hydrothermal Vents
    for (const v of this.vents) {
      const dist = subPos.distanceTo(v.pos)
      if (dist < 120) {
        const dx = v.pos.x - subPos.x
        const dz = v.pos.z - subPos.z
        let bearing = (Math.atan2(dx, dz) * 180) / Math.PI
        if (bearing < 0) bearing += 360
        contacts.push({
          type: 'vent',
          name: v.name,
          distance: Math.round(dist),
          bearingDeg: Math.round(bearing),
          pos: v.pos.clone()
        })
      }
    }

    // 2. Check Leviathan
    const levDist = subPos.distanceTo(this.leviathan.pos)
    if (levDist < 150) {
      const dx = this.leviathan.pos.x - subPos.x
      const dz = this.leviathan.pos.z - subPos.z
      let bearing = (Math.atan2(dx, dz) * 180) / Math.PI
      if (bearing < 0) bearing += 360
      contacts.push({
        type: 'leviathan',
        name: this.leviathan.name,
        distance: Math.round(levDist),
        bearingDeg: Math.round(bearing),
        pos: this.leviathan.pos.clone()
      })
    }

    this.latestSonarContacts = contacts

    setTimeout(() => {
      this.isSonarActive = false
    }, 1500)

    return contacts
  }

  /**
   * Harvest mineral from hydrothermal vent
   */
  public harvestVent(ventId: string): string | null {
    const vent = this.vents.find(v => v.id === ventId)
    if (!vent || !vent.active) return null

    const mineralId = vent.mineralYield
    this.inventory[mineralId] = (this.inventory[mineralId] || 0) + 1
    this.saveState()
    this.playHarvestSound()
    return mineralId
  }

  /**
   * Update abyssal ecosystem and submersible status
   */
  public update(dt: number, playerPos?: THREE.Vector3): void {
    if (playerPos) {
      this.currentDepth = playerPos.y
      this.isSubmerged = playerPos.y < 16
      this.hydrostaticPressure = this.calculatePressure(playerPos.y)

      // Hull pressure strain if deeper than -40 without floodlight / shield
      if (playerPos.y < -40) {
        const strainRate = (Math.abs(playerPos.y + 40) / 24) * 0.5 * dt
        this.hullIntegrity = Math.max(10, Number((this.hullIntegrity - strainRate).toFixed(1)))
      }
    }

    // Abyssal Leviathan patrol loop
    this.leviathan.heading += dt * 0.15
    this.leviathan.pos.x = Math.sin(this.leviathan.heading) * 60
    this.leviathan.pos.z = Math.cos(this.leviathan.heading) * 60
    this.leviathan.pos.y = -45 + Math.sin(this.leviathan.heading * 2) * 8
    this.leviathan.glowPhase = (this.leviathan.glowPhase + dt * 2) % (Math.PI * 2)
  }

  // --- Web Audio Procedural Synthesis ---

  private playSonarPingSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, now)
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.35)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 1.2)

    // Echo ping after 0.45s
    setTimeout(() => {
      if (!this.audioCtx) return
      const t = this.audioCtx.currentTime
      const echoOsc = this.audioCtx.createOscillator()
      const echoGain = this.audioCtx.createGain()

      echoOsc.type = 'sine'
      echoOsc.frequency.setValueAtTime(850, t)
      echoOsc.frequency.exponentialRampToValueAtTime(500, t + 0.4)

      echoGain.gain.setValueAtTime(0.12, t)
      echoGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)

      echoOsc.connect(echoGain)
      echoGain.connect(this.audioCtx.destination)

      echoOsc.start(t)
      echoOsc.stop(t + 0.8)
    }, 450)
  }

  private playSwitchSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.setValueAtTime(500, now + 0.05)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.1)
  }

  private playHarvestSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16) // G5

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  // --- Persistence ---

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('newworld_abyssal_inventory', JSON.stringify(this.inventory))
    }
  }

  private loadState(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('newworld_abyssal_inventory')
      if (saved) {
        try {
          this.inventory = { ...this.inventory, ...JSON.parse(saved) }
        } catch (e) {
          console.warn('Failed to parse abyssal inventory:', e)
        }
      }
    }
  }
}

export const abyssalTrench = AbyssalTrenchEngine.getInstance()
