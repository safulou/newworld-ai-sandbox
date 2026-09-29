import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface ElevatorEntity {
  id: string
  name: string
  x: number
  z: number
  currentY: number
  minY: number
  maxY: number
  state: 'idle' | 'moving_up' | 'moving_down'
  speed: number // blocks per second
  mesh?: THREE.Group
}

export interface BlastDoorEntity {
  id: string
  name: string
  x: number
  y: number
  z: number
  axis: 'x' | 'z'
  openProgress: number // 0 (closed) to 1 (fully open)
  targetOpen: boolean
  mesh?: THREE.Group
}

export interface RotaryGearEntity {
  id: string
  name: string
  x: number
  y: number
  z: number
  rpm: number
  currentAngle: number
  mesh?: THREE.Group
}

export class VoxelKineticsEngine {
  public elevators: ElevatorEntity[] = []
  public blastDoors: BlastDoorEntity[] = []
  public rotaryGears: RotaryGearEntity[] = []

  private scene: THREE.Scene | null = null
  private audioCtx: AudioContext | null = null

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.setupDefaultContraptions()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public playPneumaticHiss(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const bufferSize = ctx.sampleRate * 0.25
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, now)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.18, now)
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  public playElevatorBell(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1046.5, now) // C6
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  private setupDefaultContraptions(): void {
    // 1. Central Plaza High-Rise Elevator
    this.addElevator(0, 5, 25, '中央廣場觀光升降電梯')
    // 2. High-Tech Airlock Blast Door
    this.addBlastDoor(15, 5, 10, 'z', '防護力場氣密滑門')
    // 3. Kinetic Generator Gear
    this.addRotaryGear(20, 8, 20, 24, '量子動力旋轉齒輪')
  }

  public addElevator(x: number, minY: number, maxY: number, name: string): ElevatorEntity {
    const id = `elev_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const el: ElevatorEntity = {
      id,
      name,
      x,
      z: 0,
      currentY: minY,
      minY,
      maxY,
      state: 'idle',
      speed: 4.5,
    }

    if (this.scene) {
      const group = new THREE.Group()
      // Platform deck
      const deckGeo = new THREE.BoxGeometry(3.0, 0.3, 3.0)
      const deckMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3,
      })
      const deck = new THREE.Mesh(deckGeo, deckMat)
      group.add(deck)

      // Neon edge rim
      const rimGeo = new THREE.BoxGeometry(3.1, 0.1, 3.1)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.2,
      })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      rim.position.y = -0.1
      group.add(rim)

      group.position.set(x, minY, 0)
      this.scene.add(group)
      el.mesh = group
    }

    this.elevators.push(el)
    achievements.unlock('kinetic_engineer')
    return el
  }

  public addBlastDoor(x: number, y: number, z: number, axis: 'x' | 'z', name: string): BlastDoorEntity {
    const id = `door_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const door: BlastDoorEntity = {
      id,
      name,
      x,
      y,
      z,
      axis,
      openProgress: 0,
      targetOpen: false,
    }

    if (this.scene) {
      const group = new THREE.Group()
      // Left Door Leaf
      const leafGeo = new THREE.BoxGeometry(axis === 'x' ? 1.0 : 0.2, 2.8, axis === 'z' ? 1.0 : 0.2)
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.7,
        roughness: 0.4,
      })
      const leafLeft = new THREE.Mesh(leafGeo, leafMat)
      const leafRight = new THREE.Mesh(leafGeo, leafMat)
      leafLeft.name = 'leafLeft'
      leafRight.name = 'leafRight'
      leafLeft.position.set(axis === 'x' ? -0.5 : 0, 1.4, axis === 'z' ? -0.5 : 0)
      leafRight.position.set(axis === 'x' ? 0.5 : 0, 1.4, axis === 'z' ? 0.5 : 0)

      group.add(leafLeft)
      group.add(leafRight)
      group.position.set(x, y, z)
      this.scene.add(group)
      door.mesh = group
    }

    this.blastDoors.push(door)
    achievements.unlock('kinetic_engineer')
    return door
  }

  public addRotaryGear(x: number, y: number, z: number, rpm: number, name: string): RotaryGearEntity {
    const id = `gear_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const gear: RotaryGearEntity = {
      id,
      name,
      x,
      y,
      z,
      rpm,
      currentAngle: 0,
    }

    if (this.scene) {
      const group = new THREE.Group()
      const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16)
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
      const hub = new THREE.Mesh(hubGeo, hubMat)
      hub.rotation.x = Math.PI / 2
      group.add(hub)

      // 4 Teeth / Blades
      for (let i = 0; i < 4; i++) {
        const toothGeo = new THREE.BoxGeometry(0.3, 2.4, 0.3)
        const toothMat = new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8,
        })
        const tooth = new THREE.Mesh(toothGeo, toothMat)
        tooth.rotation.z = (Math.PI / 4) * i
        group.add(tooth)
      }

      group.position.set(x, y, z)
      this.scene.add(group)
      gear.mesh = group
    }

    this.rotaryGears.push(gear)
    return gear
  }

  public triggerElevator(id: string): void {
    const el = this.elevators.find(e => e.id === id)
    if (!el) return
    if (el.state === 'idle') {
      el.state = el.currentY <= (el.minY + 1.0) ? 'moving_up' : 'moving_down'
      sound.playUiClick()
    }
  }

  public update(delta: number, playerPos: THREE.Vector3, camera?: THREE.PerspectiveCamera): void {
    // 1. Update Elevators
    for (const el of this.elevators) {
      if (el.state !== 'idle') {
        const prevY = el.currentY
        if (el.state === 'moving_up') {
          el.currentY += el.speed * delta
          if (el.currentY >= el.maxY) {
            el.currentY = el.maxY
            el.state = 'idle'
            this.playElevatorBell()
          }
        } else if (el.state === 'moving_down') {
          el.currentY -= el.speed * delta
          if (el.currentY <= el.minY) {
            el.currentY = el.minY
            el.state = 'idle'
            this.playElevatorBell()
          }
        }

        const deltaY = el.currentY - prevY
        if (el.mesh) {
          el.mesh.position.y = el.currentY
        }

        // Check if player is standing on elevator (within 1.6m horizontal, and just above deck)
        const distHoriz = Math.hypot(playerPos.x - el.x, playerPos.z - el.z)
        if (distHoriz < 1.6 && Math.abs(playerPos.y - (prevY + 1.5)) < 1.0) {
          if (camera) {
            camera.position.y += deltaY
          }
        }
      }
    }

    // 2. Update Sliding Blast Doors
    for (const door of this.blastDoors) {
      const dist = Math.hypot(playerPos.x - door.x, playerPos.z - door.z)
      const shouldOpen = dist < 3.8

      if (shouldOpen !== door.targetOpen) {
        door.targetOpen = shouldOpen
        this.playPneumaticHiss()
      }

      const openSpeed = 3.0 // 0.33s full open
      if (door.targetOpen && door.openProgress < 1.0) {
        door.openProgress = Math.min(1.0, door.openProgress + openSpeed * delta)
      } else if (!door.targetOpen && door.openProgress > 0) {
        door.openProgress = Math.max(0, door.openProgress - openSpeed * delta)
      }

      if (door.mesh) {
        const left = door.mesh.getObjectByName('leafLeft')
        const right = door.mesh.getObjectByName('leafRight')
        const offset = door.openProgress * 1.2
        if (left && right) {
          if (door.axis === 'x') {
            left.position.x = -0.5 - offset
            right.position.x = 0.5 + offset
          } else {
            left.position.z = -0.5 - offset
            right.position.z = 0.5 + offset
          }
        }
      }
    }

    // 3. Update Rotary Gears
    for (const gear of this.rotaryGears) {
      const radPerSec = (gear.rpm * 2 * Math.PI) / 60
      gear.currentAngle += radPerSec * delta
      if (gear.mesh) {
        gear.mesh.rotation.z = gear.currentAngle
      }
    }
  }
}

export const voxelKinetics = new VoxelKineticsEngine()
