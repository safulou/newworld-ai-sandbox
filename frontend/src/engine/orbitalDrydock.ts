/**
 * NewWorld AI Sandbox - Orbital Space Station & Modular Starship Drydock Engine
 *
 * Implements:
 * - Orbital altitude tracking (Y >= 180) & Zero-G microgravity physics simulation (inertia drift, RCS thrusters).
 * - Modular Starship Drydock: hull chassis, cockpit, warp rings, plasma sub-wings, shield emitters.
 * - Starship assembly stat calculations (Speed, Hull, Warp Factor, Energy Shield).
 * - Airlock docking depressurization & atmospheric transition.
 * - Pure Web Audio procedural sound synthesis (RCS bursts, airlock hiss, warp charge).
 */

import * as THREE from 'three'

export interface StarshipPart {
  id: string
  name: string
  slot: 'cockpit' | 'thruster' | 'wing' | 'warp' | 'shield'
  tier: number
  hullBonus: number
  speedBonus: number
  shieldBonus: number
  warpBonus: number
  description: string
  color: string
}

export interface StarshipConfig {
  name: string
  cockpit: string
  thruster: string
  wing: string
  warp: string
  shield: string
}

export interface StarshipStats {
  hull: number
  speed: number
  shield: number
  warpFactor: number
}

export const STARSHIP_PARTS_CATALOG: StarshipPart[] = [
  // Cockpits
  { id: 'cockpit_scout', name: '全息先鋒座艙', slot: 'cockpit', tier: 1, hullBonus: 100, speedBonus: 15, shieldBonus: 50, warpBonus: 1.0, description: '輕量化全周天穹景觀座艙', color: '#00ffff' },
  { id: 'cockpit_dread', name: '重裝泰坦艦橋', slot: 'cockpit', tier: 2, hullBonus: 300, speedBonus: -5, shieldBonus: 150, warpBonus: 0.5, description: '具備奈米複合裝甲的指揮艦橋', color: '#ffaa00' },
  
  // Thrusters
  { id: 'thrust_ion', name: '離子微脈衝引擎', slot: 'thruster', tier: 1, hullBonus: 20, speedBonus: 35, shieldBonus: 0, warpBonus: 0.5, description: '高效能長程巡航離子束', color: '#00aaff' },
  { id: 'thrust_plasma', name: '等離子雙聯推進器', slot: 'thruster', tier: 2, hullBonus: 50, speedBonus: 65, shieldBonus: 20, warpBonus: 1.5, description: '超臨界核融合直接推力噴口', color: '#ff00aa' },
  
  // Wings / Outriggers
  { id: 'wing_aero', name: '超音速前掠翼', slot: 'wing', tier: 1, hullBonus: 40, speedBonus: 20, shieldBonus: 10, warpBonus: 0.2, description: '兼顧大氣層破空與軌道姿態控制', color: '#00ff88' },
  { id: 'wing_solar', name: '全息光子翼板', slot: 'wing', tier: 2, hullBonus: 30, speedBonus: 10, shieldBonus: 80, warpBonus: 1.0, description: '採集宇宙射線轉化為力場動能', color: '#ffff00' },

  // Warp Rings
  { id: 'warp_compact', name: '超小型折躍環', slot: 'warp', tier: 1, hullBonus: 10, speedBonus: 5, shieldBonus: 0, warpBonus: 2.0, description: '次光速短程次元躍遷環', color: '#aa00ff' },
  { id: 'warp_quantum', name: '量子奇點驅動核心', slot: 'warp', tier: 2, hullBonus: 60, speedBonus: 15, shieldBonus: 40, warpBonus: 5.0, description: '折疊四維空間的深空躍遷核心', color: '#ff0055' },

  // Shield Emitters
  { id: 'shield_deflector', name: '動能偏折偏光盾', slot: 'shield', tier: 1, hullBonus: 20, speedBonus: 0, shieldBonus: 120, warpBonus: 0.0, description: '阻絕微隕石與宇宙射線', color: '#00e5ff' },
  { id: 'shield_barrier', name: '相位反重力屏障', slot: 'shield', tier: 2, hullBonus: 50, speedBonus: -5, shieldBonus: 260, warpBonus: 0.5, description: '多重等離子吸收相干力場', color: '#76ff03' },
]

export class OrbitalDrydockEngine {
  private static instance: OrbitalDrydockEngine | null = null
  private audioCtx: AudioContext | null = null

  // Orbital Environment & Zero-G state
  public isZeroGActive: boolean = false
  public isAirlockCycling: boolean = false
  public airlockPressure: number = 100 // 100% (inside station) to 0% (vacuum)
  public orbitalAltitude: number = 240 // Default orbital level (Y)
  public zeroGVelocity: THREE.Vector3 = new THREE.Vector3()
  public rcsActive: boolean = false

  // Modular Starship State
  public starship: StarshipConfig = {
    name: '星雲先鋒號 (Nebula Vanguard)',
    cockpit: 'cockpit_scout',
    thruster: 'thrust_plasma',
    wing: 'wing_aero',
    warp: 'warp_compact',
    shield: 'shield_deflector'
  }

  // Station Docking Bays
  public dockingBayStatus: 'docked' | 'launching' | 'orbiting' | 're-entering' = 'docked'

  private constructor() {
    this.loadStarship()
  }

  public static getInstance(): OrbitalDrydockEngine {
    if (!OrbitalDrydockEngine.instance) {
      OrbitalDrydockEngine.instance = new OrbitalDrydockEngine()
    }
    return OrbitalDrydockEngine.instance
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
   * Calculate assembled starship total stats
   */
  public getStarshipStats(): StarshipStats {
    let hull = 500
    let speed = 50
    let shield = 200
    let warpFactor = 1.0

    const partIds = [
      this.starship.cockpit,
      this.starship.thruster,
      this.starship.wing,
      this.starship.warp,
      this.starship.shield
    ]

    for (const id of partIds) {
      const part = STARSHIP_PARTS_CATALOG.find(p => p.id === id)
      if (part) {
        hull += part.hullBonus
        speed += part.speedBonus
        shield += part.shieldBonus
        warpFactor += part.warpBonus
      }
    }

    return {
      hull: Math.max(100, hull),
      speed: Math.max(10, speed),
      shield: Math.max(50, shield),
      warpFactor: Math.max(0.5, Number(warpFactor.toFixed(1)))
    }
  }

  public setPart(slot: keyof Omit<StarshipConfig, 'name'>, partId: string): void {
    const part = STARSHIP_PARTS_CATALOG.find(p => p.id === partId && p.slot === slot)
    if (part) {
      this.starship[slot] = partId
      this.saveStarship()
      this.playInstallPartSound()
    }
  }

  public setStarshipName(name: string): void {
    this.starship.name = name.trim() || '未命名星艦'
    this.saveStarship()
  }

  /**
   * Toggle Airlock cycle between Station (100% Pressurized) and Orbital Vacuum (0% Pressurized)
   */
  public cycleAirlock(onComplete?: (targetVacuum: boolean) => void): void {
    if (this.isAirlockCycling) return
    this.initAudio()
    this.isAirlockCycling = true
    const toVacuum = this.airlockPressure > 50

    this.playAirlockSound(toVacuum)

    const startP = this.airlockPressure
    const targetP = toVacuum ? 0 : 100
    const duration = 2000 // 2.0s
    const startTime = performance.now()

    const step = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      this.airlockPressure = Math.round(startP + (targetP - startP) * progress)

      if (progress < 1) {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(step)
        } else {
          setTimeout(step, 16)
        }
      } else {
        this.airlockPressure = targetP
        this.isAirlockCycling = false
        this.isZeroGActive = toVacuum
        if (onComplete) onComplete(toVacuum)
      }
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(step)
    } else {
      setTimeout(step, 16)
    }
  }

  /**
   * Apply an RCS thruster burst in Zero-G
   */
  public triggerRcsBurst(direction: THREE.Vector3): void {
    this.initAudio()
    this.rcsActive = true
    const impulse = direction.clone().normalize().multiplyScalar(4.5)
    this.zeroGVelocity.add(impulse)
    // Clamp max orbital drift speed
    if (this.zeroGVelocity.length() > 25) {
      this.zeroGVelocity.setLength(25)
    }

    this.playRcsSound()
    setTimeout(() => {
      this.rcsActive = false
    }, 200)
  }

  /**
   * Launch Starship from Docking Bay into Orbit
   */
  public launchStarship(): void {
    if (this.dockingBayStatus !== 'docked') return
    this.initAudio()
    this.dockingBayStatus = 'launching'
    this.playLaunchWarpSound()

    setTimeout(() => {
      this.dockingBayStatus = 'orbiting'
      this.isZeroGActive = true
      this.airlockPressure = 0
    }, 2500)
  }

  /**
   * Dock Starship back into Station Bay
   */
  public dockStarship(): void {
    if (this.dockingBayStatus !== 'orbiting') return
    this.initAudio()
    this.dockingBayStatus = 're-entering'
    this.playAirlockSound(false)

    setTimeout(() => {
      this.dockingBayStatus = 'docked'
      this.zeroGVelocity.set(0, 0, 0)
    }, 2000)
  }

  /**
   * Update orbital microgravity and drift per frame
   */
  public update(dt: number, playerPos?: THREE.Vector3): void {
    // If player is high in orbit (Y >= 180), activate Zero-G
    if (playerPos) {
      this.orbitalAltitude = playerPos.y
      if (playerPos.y >= 180 && !this.isZeroGActive) {
        this.isZeroGActive = true
      } else if (playerPos.y < 160 && this.isZeroGActive && this.dockingBayStatus === 'docked') {
        this.isZeroGActive = false
      }
    }

    // Zero-G inertia damping
    if (this.isZeroGActive && playerPos) {
      // Extremely low atmospheric drag in vacuum (0.985 / sec)
      const damping = Math.pow(0.985, dt * 60)
      this.zeroGVelocity.multiplyScalar(damping)
      playerPos.addScaledVector(this.zeroGVelocity, dt)
    }
  }

  // --- Web Audio Procedural Synthesis ---

  private playInstallPartSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  private playRcsSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const bufSize = this.audioCtx.sampleRate * 0.18
    const buffer = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35
    }

    const noise = this.audioCtx.createBufferSource()
    noise.buffer = buffer

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, now)
    filter.Q.setValueAtTime(3.0, now)

    const gain = this.audioCtx.createGain()
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioCtx.destination)

    noise.start(now)
  }

  private playAirlockSound(depressurize: boolean): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const duration = 1.8
    const bufSize = Math.floor(this.audioCtx.sampleRate * duration)
    const buffer = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25
    }

    const noise = this.audioCtx.createBufferSource()
    noise.buffer = buffer

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    if (depressurize) {
      filter.frequency.setValueAtTime(2500, now)
      filter.frequency.exponentialRampToValueAtTime(300, now + duration)
    } else {
      filter.frequency.setValueAtTime(300, now)
      filter.frequency.exponentialRampToValueAtTime(2500, now + duration)
    }

    const gain = this.audioCtx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioCtx.destination)

    noise.start(now)
  }

  private playLaunchWarpSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 2.0)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 1.6)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 2.4)
  }

  // --- Persistence ---

  private saveStarship(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('newworld_starship_config', JSON.stringify(this.starship))
    }
  }

  private loadStarship(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('newworld_starship_config')
      if (saved) {
        try {
          this.starship = { ...this.starship, ...JSON.parse(saved) }
        } catch (e) {
          console.warn('Failed to parse starship config:', e)
        }
      }
    }
  }
}

export const orbitalDrydock = OrbitalDrydockEngine.getInstance()
