import * as THREE from 'three'
import { sound } from './audio'

export type VehicleType = 'none' | 'hoverboard' | 'mech'

export class VehicleManager {
  private currentVehicle: VehicleType = 'none'
  private hoverboardMesh: THREE.Group | null = null
  private scene: THREE.Scene | null = null
  private hoverTime: number = 0

  public init(scene: THREE.Scene): void {
    this.scene = scene

    // Build Cyber Hoverboard
    this.hoverboardMesh = new THREE.Group()
    const deckGeo = new THREE.BoxGeometry(0.8, 0.08, 1.8)
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x111936,
      metalness: 0.9,
      roughness: 0.2,
    })
    const deck = new THREE.Mesh(deckGeo, deckMat)

    const neonRingGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 24)
    const neonMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.5,
    })
    const frontRing = new THREE.Mesh(neonRingGeo, neonMat)
    frontRing.rotation.x = Math.PI / 2
    frontRing.position.set(0, -0.06, 0.6)

    const rearRing = new THREE.Mesh(neonRingGeo, neonMat)
    rearRing.rotation.x = Math.PI / 2
    rearRing.position.set(0, -0.06, -0.6)

    this.hoverboardMesh.add(deck, frontRing, rearRing)
    this.hoverboardMesh.visible = false
    this.scene.add(this.hoverboardMesh)
  }

  public getVehicle(): VehicleType {
    return this.currentVehicle
  }

  public toggleHoverboard(playerPos: THREE.Vector3): VehicleType {
    if (this.currentVehicle === 'hoverboard') {
      this.currentVehicle = 'none'
      if (this.hoverboardMesh) this.hoverboardMesh.visible = false
      sound.playUiClick()
    } else {
      this.currentVehicle = 'hoverboard'
      if (this.hoverboardMesh) {
        this.hoverboardMesh.visible = true
        this.hoverboardMesh.position.copy(playerPos)
      }
      sound.playTeleport()
    }
    return this.currentVehicle
  }

  public update(delta: number, playerPos: THREE.Vector3, isMoving: boolean): void {
    if (this.currentVehicle === 'hoverboard' && this.hoverboardMesh) {
      this.hoverTime += delta * 6
      const hoverOffset = Math.sin(this.hoverTime) * 0.08
      this.hoverboardMesh.position.set(playerPos.x, playerPos.y - 0.9 + hoverOffset, playerPos.z)

      if (isMoving) {
        this.hoverboardMesh.rotation.z = Math.sin(this.hoverTime * 1.5) * 0.05
      } else {
        this.hoverboardMesh.rotation.z = 0
      }
    }
  }

  public dispose(): void {
    if (this.hoverboardMesh && this.scene) {
      this.scene.remove(this.hoverboardMesh)
      this.hoverboardMesh = null
    }
  }
}

export const vehicles = new VehicleManager()
