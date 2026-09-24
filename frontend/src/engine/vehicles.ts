import * as THREE from 'three'
import { sound } from './audio'
import { vehicleMod } from './vehicleMod'

export type VehicleType = 'none' | 'hoverboard' | 'speeder' | 'cruiser'

export interface VehicleStats {
  type: VehicleType
  name: string
  icon: string
  speedMultiplier: number
  hoverHeight: number
  description: string
}

export const VEHICLE_CONFIGS: Record<VehicleType, VehicleStats> = {
  none: { type: 'none', name: '步巡模式', icon: '👟', speedMultiplier: 1.0, hoverHeight: 0, description: '正常步行奔跑' },
  hoverboard: { type: 'hoverboard', name: '賽博懸浮滑板', icon: '🛹', speedMultiplier: 1.6, hoverHeight: 0.9, description: '輕巧靈活的個人滑板' },
  speeder: { type: 'speeder', name: '極速巡航艇', icon: '🏎️', speedMultiplier: 2.4, hoverHeight: 1.1, description: '雙渦輪等離子噴射艇' },
  cruiser: { type: 'cruiser', name: '量子突擊艦', icon: '🚀', speedMultiplier: 3.2, hoverHeight: 1.4, description: '四重反重力星艦' },
}

export class VehicleManager {
  private currentVehicle: VehicleType = 'none'
  private scene: THREE.Scene | null = null
  private hoverTime: number = 0

  // Meshes for each vehicle model
  private hoverboardMesh: THREE.Group | null = null
  private speederMesh: THREE.Group | null = null
  private cruiserMesh: THREE.Group | null = null

  // Thruster exhaust particles
  private exhaustParticles: THREE.Points | null = null

  public init(scene: THREE.Scene): void {
    this.scene = scene

    this.buildHoverboard()
    this.buildSpeeder()
    this.buildCruiser()
    this.buildExhaustParticles()
  }

  private buildHoverboard(): void {
    if (!this.scene) return
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

  private buildSpeeder(): void {
    if (!this.scene) return
    this.speederMesh = new THREE.Group()

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0a1026, metalness: 0.85, roughness: 0.25 })
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2.0 })
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, roughness: 0.1 })

    // Streamlined body
    const mainHull = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 3.2), bodyMat)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 4), bodyMat)
    nose.rotation.x = -Math.PI / 2
    nose.position.set(0, 0, 2.0)

    // Cockpit canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 1.2), glassMat)
    canopy.position.set(0, 0.35, 0.2)

    // Dual Twin Plasma Thrusters
    const leftThruster = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.4, 16), accentMat)
    leftThruster.rotation.x = Math.PI / 2
    leftThruster.position.set(-0.8, -0.05, -1.2)

    const rightThruster = leftThruster.clone()
    rightThruster.position.x = 0.8

    // Wings
    const wingGeo = new THREE.BoxGeometry(2.8, 0.06, 0.8)
    const wings = new THREE.Mesh(wingGeo, bodyMat)
    wings.position.set(0, 0, -0.4)

    this.speederMesh.add(mainHull, nose, canopy, leftThruster, rightThruster, wings)
    this.speederMesh.visible = false
    this.scene.add(this.speederMesh)
  }

  private buildCruiser(): void {
    if (!this.scene) return
    this.cruiserMesh = new THREE.Group()

    const armorMat = new THREE.MeshStandardMaterial({ color: 0x1c1e33, metalness: 0.9, roughness: 0.3 })
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 3.0 })
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x7700ff, transparent: true, opacity: 0.5 })

    // Massive armored hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 4.0), armorMat)
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.4), shieldMat)
    bridge.position.set(0, 0.55, -0.3)

    // Quad Anti-Grav Engines
    const engineGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.6, 16)
    const e1 = new THREE.Mesh(engineGeo, coreMat)
    e1.rotation.x = Math.PI / 2
    e1.position.set(-1.3, -0.1, -1.5)
    const e2 = e1.clone()
    e2.position.x = 1.3
    const e3 = e1.clone()
    e3.position.set(-1.3, -0.1, 0.8)
    const e4 = e1.clone()
    e4.position.set(1.3, -0.1, 0.8)

    this.cruiserMesh.add(hull, bridge, e1, e2, e3, e4)
    this.cruiserMesh.visible = false
    this.scene.add(this.cruiserMesh)
  }

  private buildExhaustParticles(): void {
    if (!this.scene) return
    const count = 120
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    const mat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    this.exhaustParticles = new THREE.Points(geo, mat)
    this.exhaustParticles.visible = false
    this.scene.add(this.exhaustParticles)
  }

  public getVehicle(): VehicleType {
    return this.currentVehicle
  }

  public getSpeedMultiplier(isSprinting: boolean = false): number {
    const base = VEHICLE_CONFIGS[this.currentVehicle].speedMultiplier
    if (this.currentVehicle === 'none') return base
    return vehicleMod.getEffectiveSpeedMultiplier(base, isSprinting)
  }

  public toggleHoverboard(playerPos: THREE.Vector3): VehicleType {
    return this.cycleVehicle(playerPos)
  }

  public cycleVehicle(playerPos: THREE.Vector3): VehicleType {
    const list: VehicleType[] = ['none', 'hoverboard', 'speeder', 'cruiser']
    const nextIdx = (list.indexOf(this.currentVehicle) + 1) % list.length
    return this.setVehicle(list[nextIdx], playerPos)
  }

  public setVehicle(type: VehicleType, playerPos?: THREE.Vector3): VehicleType {
    this.currentVehicle = type

    if (this.hoverboardMesh) this.hoverboardMesh.visible = type === 'hoverboard'
    if (this.speederMesh) this.speederMesh.visible = type === 'speeder'
    if (this.cruiserMesh) this.cruiserMesh.visible = type === 'cruiser'
    if (this.exhaustParticles) this.exhaustParticles.visible = type !== 'none'

    if (type === 'none') {
      sound.playUiClick()
    } else {
      sound.playTeleport()
      if (playerPos) {
        this.update(0, playerPos, false)
      }
    }

    return this.currentVehicle
  }

  public update(delta: number, playerPos: THREE.Vector3, isMoving: boolean, playerYaw: number = 0): void {
    if (this.currentVehicle === 'none') {
      if (this.exhaustParticles) this.exhaustParticles.visible = false
      return
    }

    this.hoverTime += delta * 6
    const config = VEHICLE_CONFIGS[this.currentVehicle]
    const hoverBob = Math.sin(this.hoverTime) * 0.08
    const vehicleY = playerPos.y - config.hoverHeight + hoverBob

    let activeMesh: THREE.Group | null = null
    if (this.currentVehicle === 'hoverboard') activeMesh = this.hoverboardMesh
    else if (this.currentVehicle === 'speeder') activeMesh = this.speederMesh
    else if (this.currentVehicle === 'cruiser') activeMesh = this.cruiserMesh

    if (activeMesh) {
      activeMesh.position.set(playerPos.x, vehicleY, playerPos.z)
      activeMesh.rotation.y = playerYaw

      // Dynamic Banking & Sway
      if (isMoving) {
        activeMesh.rotation.z = Math.sin(this.hoverTime * 1.5) * 0.06
        activeMesh.rotation.x = -0.05 // Slight pitch forward on acceleration
      } else {
        activeMesh.rotation.z = 0
        activeMesh.rotation.x = 0
      }
    }

    // Update exhaust particles behind the vehicle
    if (this.exhaustParticles && isMoving) {
      this.exhaustParticles.visible = true
      const pos = this.exhaustParticles.geometry.attributes.position.array as Float32Array
      const tailOffset = this.currentVehicle === 'cruiser' ? 2.5 : 1.5

      for (let i = 0; i < pos.length; i += 3) {
        pos[i] = playerPos.x + Math.sin(playerYaw) * tailOffset + (Math.random() - 0.5) * 0.6
        pos[i + 1] = vehicleY + (Math.random() - 0.5) * 0.3
        pos[i + 2] = playerPos.z + Math.cos(playerYaw) * tailOffset + (Math.random() - 0.5) * 0.6
      }
      this.exhaustParticles.geometry.attributes.position.needsUpdate = true
    } else if (this.exhaustParticles) {
      this.exhaustParticles.visible = false
    }
  }

  public dispose(): void {
    if (this.scene) {
      if (this.hoverboardMesh) this.scene.remove(this.hoverboardMesh)
      if (this.speederMesh) this.scene.remove(this.speederMesh)
      if (this.cruiserMesh) this.scene.remove(this.cruiserMesh)
      if (this.exhaustParticles) this.scene.remove(this.exhaustParticles)
    }
    this.hoverboardMesh = null
    this.speederMesh = null
    this.cruiserMesh = null
    this.exhaustParticles = null
  }
}

export const vehicles = new VehicleManager()
