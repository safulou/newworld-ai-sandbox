import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface SonicLaunchPad {
  id: string
  name: string
  x: number
  y: number
  z: number
  verticalForce: number // e.g. 22
  forwardForce: number // e.g. 16
}

export interface ParkourCheckpoint {
  id: string
  x: number
  y: number
  z: number
  radius: number
}

export interface ParkourCourse {
  id: string
  name: string
  description: string
  checkpoints: ParkourCheckpoint[]
  bestTimeMs: number | null
}

export class GravityAnomaliesEngine {
  public isInverted: boolean = false
  public isGliding: boolean = false
  public launchPads: SonicLaunchPad[] = []
  public courses: ParkourCourse[] = []

  // Active Course Run
  public activeCourse: ParkourCourse | null = null
  public currentCheckpointIdx: number = 0
  public isRunActive: boolean = false
  public runStartTime: number = 0
  public currentRunElapsedMs: number = 0

  constructor() {
    this.courses = [
      {
        id: 'skyline_sprint',
        name: '霓虹天際線衝刺 (Skyline Sprint)',
        description: '穿越摩天大樓屋頂與等離子光圈的極速衝刺賽道。',
        checkpoints: [
          { id: 'cp_1', x: 0, y: 15, z: 0, radius: 2.5 },
          { id: 'cp_2', x: 20, y: 22, z: 10, radius: 2.5 },
          { id: 'cp_3', x: 45, y: 28, z: 25, radius: 2.5 },
          { id: 'cp_4', x: 70, y: 35, z: 40, radius: 3.0 },
        ],
        bestTimeMs: null,
      },
      {
        id: 'inversion_gauntlet',
        name: '重力顛倒迴廊 (Inversion Gauntlet)',
        description: '在天花板與地板之間反覆倒轉引力的立體空間挑戰。',
        checkpoints: [
          { id: 'ig_1', x: 0, y: 10, z: 0, radius: 2.5 },
          { id: 'ig_2', x: 0, y: 25, z: 15, radius: 2.5 },
          { id: 'ig_3', x: 15, y: 25, z: 30, radius: 2.5 },
          { id: 'ig_4', x: 30, y: 12, z: 45, radius: 3.0 },
        ],
        bestTimeMs: null,
      },
    ]

    this.launchPads = [
      {
        id: 'pad_default_1',
        name: '中央廣場超音速彈射台',
        x: 5,
        y: 4,
        z: 5,
        verticalForce: 24,
        forwardForce: 15,
      },
      {
        id: 'pad_default_2',
        name: '天際跳躍踏板',
        x: 20,
        y: 12,
        z: 20,
        verticalForce: 28,
        forwardForce: 20,
      },
    ]

    this.loadState()
  }

  public toggleGravityInversion(): boolean {
    this.isInverted = !this.isInverted
    sound.playWhoosh()
    achievements.unlock('gravity_defier')
    return this.isInverted
  }

  public setGliding(gliding: boolean): void {
    if (this.isGliding !== gliding) {
      this.isGliding = gliding
      if (gliding) {
        sound.playWhoosh()
        achievements.unlock('gravity_defier')
      }
    }
  }

  public addLaunchPad(x: number, y: number, z: number, verticalForce = 25, forwardForce = 15): SonicLaunchPad {
    const pad: SonicLaunchPad = {
      id: `pad_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: `動能彈射台 #${this.launchPads.length + 1}`,
      x,
      y,
      z,
      verticalForce,
      forwardForce,
    }
    this.launchPads.push(pad)
    sound.playUiClick()
    this.saveState()
    return pad
  }

  public removeLaunchPad(id: string): void {
    this.launchPads = this.launchPads.filter(p => p.id !== id)
    this.saveState()
  }

  /**
   * Checks if player stepped onto any launch pad
   */
  public checkLaunchPadTrigger(playerPos: THREE.Vector3, playerVel: THREE.Vector3): boolean {
    for (const pad of this.launchPads) {
      const dx = playerPos.x - (pad.x + 0.5)
      const dy = playerPos.y - (pad.y + 0.5)
      const dz = playerPos.z - (pad.z + 0.5)
      const horizDist = Math.sqrt(dx * dx + dz * dz)

      if (horizDist < 1.1 && Math.abs(dy) < 1.2) {
        // Trigger launch boost!
        playerVel.y = pad.verticalForce * (this.isInverted ? -1 : 1)
        playerVel.x += (dx / (horizDist || 1)) * pad.forwardForce
        playerVel.z += (dz / (horizDist || 1)) * pad.forwardForce

        sound.playWhoosh()
        achievements.unlock('gravity_defier')
        return true
      }
    }
    return false
  }

  /**
   * Applies glider aerodynamics to player velocity
   */
  public applyGliderPhysics(vel: THREE.Vector3, dt: number): void {
    if (!this.isGliding) return

    // Cap downward sink rate gently
    if (this.isInverted) {
      vel.y = Math.min(vel.y, 2.5)
    } else {
      vel.y = Math.max(vel.y, -2.5)
    }

    // Preserve and damp forward momentum
    vel.x *= Math.pow(0.98, dt * 60)
    vel.z *= Math.pow(0.98, dt * 60)
  }

  // ── Parkour Course Loop ───────────────────────────────────────────────
  public startCourse(courseId: string): void {
    const course = this.courses.find(c => c.id === courseId)
    if (!course) return

    this.activeCourse = course
    this.currentCheckpointIdx = 0
    this.isRunActive = true
    this.runStartTime = Date.now()
    this.currentRunElapsedMs = 0
    sound.playUiClick()
  }

  public stopCourse(): void {
    this.isRunActive = false
    this.activeCourse = null
  }

  public update(dt: number, playerPos?: THREE.Vector3, playerVel?: THREE.Vector3): void {
    if (playerPos && playerVel) {
      this.checkLaunchPadTrigger(playerPos, playerVel)
      if (this.isGliding) {
        this.applyGliderPhysics(playerVel, dt)
      }
    }

    // Update active parkour run
    if (this.isRunActive && this.activeCourse && playerPos) {
      this.currentRunElapsedMs = Date.now() - this.runStartTime
      const targetCp = this.activeCourse.checkpoints[this.currentCheckpointIdx]

      if (targetCp) {
        const dist = playerPos.distanceTo(new THREE.Vector3(targetCp.x, targetCp.y, targetCp.z))
        if (dist <= targetCp.radius) {
          // Checkpoint reached!
          sound.playUiClick()
          this.currentCheckpointIdx++

          // Finished course!
          if (this.currentCheckpointIdx >= this.activeCourse.checkpoints.length) {
            this.finishCourse()
          }
        }
      }
    }
  }

  private finishCourse(): void {
    if (!this.activeCourse) return

    const time = this.currentRunElapsedMs
    if (!this.activeCourse.bestTimeMs || time < this.activeCourse.bestTimeMs) {
      this.activeCourse.bestTimeMs = time
    }

    this.isRunActive = false
    sound.playFanfare()
    achievements.unlock('gravity_defier')
    this.saveState()
  }

  public reset(): void {
    this.isInverted = false
    this.isGliding = false
    this.isRunActive = false
    this.activeCourse = null
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_gravity_parkour')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.courses) {
          for (const c of parsed.courses) {
            const existing = this.courses.find(e => e.id === c.id)
            if (existing) {
              existing.bestTimeMs = c.bestTimeMs
            }
          }
        }
        if (parsed.launchPads) {
          this.launchPads = parsed.launchPads
        }
      }
    } catch {
      // Ignored
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        courses: this.courses.map(c => ({ id: c.id, bestTimeMs: c.bestTimeMs })),
        launchPads: this.launchPads,
      }
      localStorage.setItem('cyber_gravity_parkour', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const gravityAnomalies = new GravityAnomaliesEngine()
