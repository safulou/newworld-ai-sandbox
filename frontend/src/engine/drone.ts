import * as THREE from 'three'
import { sound } from './audio'

export interface DroneState {
  isActive: boolean
  batteryPercent: number
  altitude: number
  speed: number
  mode: 'manual' | 'orbit' | 'survey'
  thermalVision: boolean
}

export class DroneManager {
  private droneMesh: THREE.Group | null = null
  private scene: THREE.Scene | null = null
  private playerPos: THREE.Vector3 = new THREE.Vector3()
  private state: DroneState = {
    isActive: false,
    batteryPercent: 100,
    altitude: 15,
    speed: 0,
    mode: 'manual',
    thermalVision: false,
  }
  private orbitAngle = 0

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.createDroneMesh()
  }

  private createDroneMesh(): void {
    if (!this.scene) return
    const group = new THREE.Group()

    // Central chassis
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.25, 8)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      metalness: 0.9,
      roughness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    group.add(body)

    // Glowing core sensor
    const sensorGeo = new THREE.SphereGeometry(0.2, 16, 16)
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.0,
    })
    const sensor = new THREE.Mesh(sensorGeo, sensorMat)
    sensor.position.set(0, -0.15, 0.3)
    group.add(sensor)

    // 4 Quadcopter Arms and Rotor blades
    const armGeo = new THREE.BoxGeometry(1.6, 0.05, 0.05)
    const armMat = new THREE.MeshStandardMaterial({ color: 0x2a3b5c, metalness: 0.8 })
    const arm1 = new THREE.Mesh(armGeo, armMat)
    const arm2 = new THREE.Mesh(armGeo, armMat)
    arm1.rotation.y = Math.PI / 4
    arm2.rotation.y = -Math.PI / 4
    group.add(arm1)
    group.add(arm2)

    // Rotors
    const rotorGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16)
    const rotorMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.6,
    })

    const positions = [
      [-0.6, 0.1, -0.6],
      [0.6, 0.1, -0.6],
      [-0.6, 0.1, 0.6],
      [0.6, 0.1, 0.6],
    ]

    for (const pos of positions) {
      const rotor = new THREE.Mesh(rotorGeo, rotorMat)
      rotor.position.set(pos[0], pos[1], pos[2])
      group.add(rotor)
    }

    group.visible = false
    this.scene.add(group)
    this.droneMesh = group
  }

  public launch(playerPosition: THREE.Vector3): void {
    if (!this.droneMesh) return
    this.playerPos.copy(playerPosition)
    this.state.isActive = true
    this.state.batteryPercent = 100
    this.state.altitude = 12
    this.droneMesh.position.set(playerPosition.x, playerPosition.y + 12, playerPosition.z + 5)
    this.droneMesh.visible = true
    sound.playFanfare()
  }

  public recall(): void {
    if (!this.droneMesh) return
    this.state.isActive = false
    this.droneMesh.visible = false
    sound.playUiClick()
  }

  public toggleThermal(): boolean {
    this.state.thermalVision = !this.state.thermalVision
    sound.playUiClick()
    return this.state.thermalVision
  }

  public setMode(mode: 'manual' | 'orbit' | 'survey'): void {
    this.state.mode = mode
    sound.playUiClick()
  }

  public getState(): DroneState {
    return { ...this.state }
  }

  public getDronePosition(): THREE.Vector3 {
    return this.droneMesh ? this.droneMesh.position.clone() : new THREE.Vector3()
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (!this.state.isActive || !this.droneMesh) return

    this.playerPos.copy(playerPos)

    // Battery drain
    this.state.batteryPercent = Math.max(0, this.state.batteryPercent - delta * 0.5)
    if (this.state.batteryPercent <= 0) {
      this.recall()
      return
    }

    if (this.state.mode === 'orbit') {
      this.orbitAngle += delta * 0.8
      const radius = 15
      const targetX = this.playerPos.x + Math.cos(this.orbitAngle) * radius
      const targetZ = this.playerPos.z + Math.sin(this.orbitAngle) * radius
      const targetY = this.playerPos.y + this.state.altitude + Math.sin(this.orbitAngle * 2) * 1.5

      this.droneMesh.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05)
      this.droneMesh.lookAt(this.playerPos)
    } else if (this.state.mode === 'survey') {
      // Hover survey gently
      const time = performance.now() * 0.002
      this.droneMesh.position.y = this.playerPos.y + this.state.altitude + Math.sin(time) * 0.8
    }

    // Spin rotors
    this.droneMesh.children.forEach((child, idx) => {
      if (idx >= 3) {
        child.rotation.y += delta * 25
      }
    })
  }
}

export const droneManager = new DroneManager()
