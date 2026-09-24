import * as THREE from 'three'
import { sound } from './audio'

export interface LaserBeamEffect {
  line: THREE.Line
  age: number
  lifetime: number
}

export class FaunaGearManager {
  private scene: THREE.Scene | null = null
  private laserBeams: LaserBeamEffect[] = []

  public init(scene: THREE.Scene): void {
    this.scene = scene
  }

  /**
   * Spawns a glowing neon laser beam from hound cannon muzzle to enemy target
   */
  public spawnLaserBeam(from: THREE.Vector3, to: THREE.Vector3, colorHex: number = 0x00ffff): void {
    if (!this.scene) return

    const points = [from.clone(), to.clone()]
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
    })

    const line = new THREE.Line(geom, mat)
    this.scene.add(line)
    this.laserBeams.push({
      line,
      age: 0,
      lifetime: 0.22, // quick beam flash
    })

    // Sound effect
    sound.playUiClick()
  }

  /**
   * Updates all active laser beams (fades opacity and removes upon expiration)
   */
  public update(delta: number): void {
    if (!this.scene) return

    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i]
      b.age += delta
      const progress = b.age / b.lifetime

      const mat = b.line.material as THREE.LineBasicMaterial
      mat.opacity = Math.max(0, 1 - progress)

      if (b.age >= b.lifetime) {
        this.scene.remove(b.line)
        b.line.geometry.dispose()
        mat.dispose()
        this.laserBeams.splice(i, 1)
      }
    }
  }

  public dispose(): void {
    if (this.scene) {
      for (const b of this.laserBeams) {
        this.scene.remove(b.line)
        b.line.geometry.dispose()
        ;(b.line.material as THREE.Material).dispose()
      }
    }
    this.laserBeams = []
  }
}

export const faunaGear = new FaunaGearManager()
