import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface EcoWardenDrone {
  id: string
  name: string
  position: THREE.Vector3
  targetPosition: THREE.Vector3
  status: 'patrolling' | 'extinguishing_fire' | 'replanting' | 'healing_fauna'
  seedlingsPlanted: number
  firesExtinguished: number
  batteryPercent: number
}

export interface GeneticMutatedPup {
  id: string
  name: string
  geneTrait: string
  laserDamage: number
  skinColor: string
  speedMultiplier: number
  bornAt: number
}

export interface BreedingChamber {
  isActive: boolean
  parentA: string
  parentB: string
  catalyzer: 'quantum_plasma' | 'chrono_serum' | 'cryo_stabilizer'
  progress: number // 0 to 1
  elapsedSec: number
  durationSec: number
  result: GeneticMutatedPup | null
}

export class CyberRangersEngine {
  public wardens: EcoWardenDrone[] = []
  public breedingChamber: BreedingChamber = {
    isActive: false,
    parentA: '機械獵犬-阿爾法',
    parentB: '機械獵犬-貝塔',
    catalyzer: 'quantum_plasma',
    progress: 0,
    elapsedSec: 0,
    durationSec: 10,
    result: null,
  }

  public mutatedHounds: GeneticMutatedPup[] = []
  public ecosystemHealthIndex: number = 88 // 0 to 100%
  public isEcoBuffActive: boolean = true

  constructor() {
    this.initDefaultWardens()
    this.loadState()
  }

  private initDefaultWardens(): void {
    this.wardens = [
      {
        id: 'warden_1',
        name: '綠洲自律巡護員 #01',
        position: new THREE.Vector3(12, 12, 8),
        targetPosition: new THREE.Vector3(30, 10, 20),
        status: 'patrolling',
        seedlingsPlanted: 14,
        firesExtinguished: 3,
        batteryPercent: 96,
      },
      {
        id: 'warden_2',
        name: '林冠繁育巡護員 #02',
        position: new THREE.Vector3(-15, 14, 25),
        targetPosition: new THREE.Vector3(-5, 10, 40),
        status: 'replanting',
        seedlingsPlanted: 28,
        firesExtinguished: 5,
        batteryPercent: 89,
      },
    ]
  }

  public startBreeding(
    parentA: string = '機械獵犬-阿爾法',
    parentB: string = '機械獵犬-貝塔',
    catalyzer: 'quantum_plasma' | 'chrono_serum' | 'cryo_stabilizer' = 'quantum_plasma'
  ): void {
    this.breedingChamber = {
      isActive: true,
      parentA,
      parentB,
      catalyzer,
      progress: 0,
      elapsedSec: 0,
      durationSec: 8,
      result: null,
    }
    sound.playWhoosh()
    this.saveState()
  }

  public update(dt: number): void {
    // 1. Update Autonomous Wardens
    for (const w of this.wardens) {
      const dir = w.targetPosition.clone().sub(w.position)
      const dist = dir.length()

      if (dist > 1.0) {
        dir.normalize()
        w.position.addScaledVector(dir, 4.0 * dt)
      } else {
        // Reached destination, pick new random patrol point
        w.targetPosition.set(
          (Math.random() - 0.5) * 80,
          8 + Math.random() * 8,
          (Math.random() - 0.5) * 80
        )
        w.seedlingsPlanted += Math.random() > 0.5 ? 1 : 0
      }
    }

    // 2. Update Breeding Chamber
    if (this.breedingChamber.isActive && !this.breedingChamber.result) {
      this.breedingChamber.elapsedSec += dt
      this.breedingChamber.progress = Math.min(
        1.0,
        this.breedingChamber.elapsedSec / this.breedingChamber.durationSec
      )

      if (this.breedingChamber.progress >= 1.0) {
        this.completeBreeding()
      }
    }

    // 3. Compute Ecosystem Health
    const totalPlants = this.wardens.reduce((sum, w) => sum + w.seedlingsPlanted, 40)
    this.ecosystemHealthIndex = Math.min(100, Math.round(50 + totalPlants * 0.8))
    this.isEcoBuffActive = this.ecosystemHealthIndex >= 80

    if (this.isEcoBuffActive) {
      achievements.unlock('ecosystem_guardian')
    }
  }

  private completeBreeding(): void {
    const traits = [
      { trait: '超導等離子光翼 (Plasma Wings)', color: '#00f0ff', dmg: 35, speed: 1.4 },
      { trait: '雙管超頻脈衝雷射 (Dual Pulse Laser)', color: '#ff007f', dmg: 48, speed: 1.2 },
      { trait: '星雲幻影潛行護盾 (Nebula Cloak)', color: '#a855f7', dmg: 28, speed: 1.6 },
    ]
    const chosen = traits[Math.floor(Math.random() * traits.length)]

    const pup: GeneticMutatedPup = {
      id: `pup_${Date.now()}`,
      name: `賽博獵犬·幼體 #${this.mutatedHounds.length + 1}`,
      geneTrait: chosen.trait,
      laserDamage: chosen.dmg,
      skinColor: chosen.color,
      speedMultiplier: chosen.speed,
      bornAt: Date.now(),
    }

    this.breedingChamber.result = pup
    this.mutatedHounds.push(pup)
    sound.playFanfare()
    achievements.unlock('ecosystem_guardian')
    this.saveState()
  }

  public reset(): void {
    this.initDefaultWardens()
    this.breedingChamber = {
      isActive: false,
      parentA: '機械獵犬-阿爾法',
      parentB: '機械獵犬-貝塔',
      catalyzer: 'quantum_plasma',
      progress: 0,
      elapsedSec: 0,
      durationSec: 8,
      result: null,
    }
    this.mutatedHounds = []
    this.ecosystemHealthIndex = 88
    this.isEcoBuffActive = true
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_rangers_ecosystem')
      if (data) {
        const parsed = JSON.parse(data)
        this.mutatedHounds = parsed.mutatedHounds || []
      }
    } catch {
      // Ignored
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        mutatedHounds: this.mutatedHounds,
      }
      localStorage.setItem('cyber_rangers_ecosystem', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const cyberRangers = new CyberRangersEngine()
