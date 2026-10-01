import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface CelestialBody {
  id: string
  name: string
  color: string
  radius: number
  orbitRadius: number
  orbitalPeriodSec: number
  currentAngle: number
  position: THREE.Vector3
  phase: string
}

export interface StardustNode {
  id: string
  x: number
  y: number
  z: number
  harvested: boolean
  value: number
}

export interface ExoplanetDiscovery {
  id: string
  name: string
  spectralClass: string
  distanceLy: number
  habitable: boolean
  surfaceTempC: number
  discoveredAt: number
}

export interface ConstellationLine {
  fromId: string
  toId: string
}

export const EXOPLANET_CATALOG = [
  { name: 'Kepler-452b 賽博異構體', spectralClass: 'G2V', distanceLy: 1402, habitable: true, surfaceTempC: 15 },
  { name: 'Gliese 667Cc 脈衝潮汐星', spectralClass: 'M3V', distanceLy: 23.6, habitable: true, surfaceTempC: 4 },
  { name: 'Proxima Centauri b 霓虹荒原', spectralClass: 'M5.5V', distanceLy: 4.24, habitable: false, surfaceTempC: -39 },
  { name: 'Trappist-1e 等離子海洋星', spectralClass: 'M8V', distanceLy: 39.5, habitable: true, surfaceTempC: -15 },
  { name: 'WASP-12b 超導燃燒氣態巨行星', spectralClass: 'F9V', distanceLy: 870, habitable: false, surfaceTempC: 2250 },
]

export class CelestialObservatoryEngine {
  public celestialBodies: CelestialBody[] = []
  public activeMeteorShower: boolean = false
  public stardustDeposits: StardustNode[] = []
  public discoveries: ExoplanetDiscovery[] = []
  public constellationLines: ConstellationLine[] = []

  public cosmicStardustInventory: number = 0
  public telescopeMagnification: number = 25 // 10x to 100x
  public telescopeTargetAngle: number = 0

  private meshGroup: THREE.Group | null = null

  constructor() {
    this.initCelestialBodies()
    this.loadState()
  }

  public init(scene?: THREE.Scene): void {
    if (scene && !this.meshGroup) {
      this.meshGroup = new THREE.Group()
      this.meshGroup.name = 'CelestialObservatorySceneGroup'
      scene.add(this.meshGroup)
    }
  }

  private initCelestialBodies(): void {
    this.celestialBodies = [
      {
        id: 'cyan_moon',
        name: '賽博青月 (Cyan Moon)',
        color: '#00f0ff',
        radius: 12,
        orbitRadius: 180,
        orbitalPeriodSec: 120, // 2 minutes full cycle
        currentAngle: 0,
        position: new THREE.Vector3(180, 80, 0),
        phase: '盈凸月 (Waxing Gibbous)',
      },
      {
        id: 'magenta_moon',
        name: '等離子赤月 (Magenta Moon)',
        color: '#ff007f',
        radius: 8,
        orbitRadius: 130,
        orbitalPeriodSec: 75,
        currentAngle: Math.PI / 2,
        position: new THREE.Vector3(0, 70, 130),
        phase: '半影殘月 (Waning Crescent)',
      },
      {
        id: 'pulsar_core',
        name: '次階量子脈衝星 (Quantum Pulsar)',
        color: '#ffe600',
        radius: 4,
        orbitRadius: 240,
        orbitalPeriodSec: 240,
        currentAngle: Math.PI,
        position: new THREE.Vector3(-240, 120, 0),
        phase: '高頻旋轉 (Rapid Spin)',
      },
    ]
  }

  public triggerMeteorShower(count: number = 5): void {
    this.activeMeteorShower = true
    sound.playWhoosh()

    for (let i = 0; i < count; i++) {
      const deposit: StardustNode = {
        id: `stardust_${Date.now()}_${i}`,
        x: (Math.random() - 0.5) * 60,
        y: 5 + Math.random() * 2,
        z: (Math.random() - 0.5) * 60,
        harvested: false,
        value: 10 + Math.floor(Math.random() * 20),
      }
      this.stardustDeposits.push(deposit)
    }

    achievements.unlock('stargazer_astronomer')
    this.saveState()
  }

  public harvestStardust(id: string): number {
    const deposit = this.stardustDeposits.find(d => d.id === id)
    if (!deposit || deposit.harvested) return 0

    deposit.harvested = true
    this.cosmicStardustInventory += deposit.value
    sound.playBuildComplete()
    achievements.unlock('stargazer_astronomer')
    this.saveState()
    return deposit.value
  }

  public scanExoplanet(): ExoplanetDiscovery | null {
    const remaining = EXOPLANET_CATALOG.filter(
      p => !this.discoveries.some(d => d.name === p.name)
    )
    if (remaining.length === 0) return null

    const target = remaining[Math.floor(Math.random() * remaining.length)]
    const discovery: ExoplanetDiscovery = {
      id: `exo_${Date.now()}`,
      name: target.name,
      spectralClass: target.spectralClass,
      distanceLy: target.distanceLy,
      habitable: target.habitable,
      surfaceTempC: target.surfaceTempC,
      discoveredAt: Date.now(),
    }
    this.discoveries.push(discovery)
    sound.playFanfare()
    achievements.unlock('stargazer_astronomer')
    this.saveState()
    return discovery
  }

  public addConstellationLine(fromId: string, toId: string): void {
    this.constellationLines.push({ fromId, toId })
    sound.playUiClick()
    this.saveState()
  }

  public update(dt: number): void {
    // Advance Keplerian celestial orbits
    for (const body of this.celestialBodies) {
      body.currentAngle += ((2 * Math.PI) / body.orbitalPeriodSec) * dt
      body.position.x = Math.cos(body.currentAngle) * body.orbitRadius
      body.position.z = Math.sin(body.currentAngle) * body.orbitRadius
    }
  }

  public reset(): void {
    this.initCelestialBodies()
    this.activeMeteorShower = false
    this.stardustDeposits = []
    this.discoveries = []
    this.constellationLines = []
    this.cosmicStardustInventory = 0
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_celestial_observatory')
      if (data) {
        const parsed = JSON.parse(data)
        this.discoveries = parsed.discoveries || []
        this.cosmicStardustInventory = parsed.cosmicStardustInventory || 0
        this.constellationLines = parsed.constellationLines || []
        this.stardustDeposits = parsed.stardustDeposits || []
      }
    } catch {
      // Ignored
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        discoveries: this.discoveries,
        cosmicStardustInventory: this.cosmicStardustInventory,
        constellationLines: this.constellationLines,
        stardustDeposits: this.stardustDeposits,
      }
      localStorage.setItem('cyber_celestial_observatory', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const celestialObservatory = new CelestialObservatoryEngine()
