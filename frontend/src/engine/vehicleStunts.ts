import * as THREE from 'three'
import { sound } from './audio'
import { VehicleType, vehicles } from './vehicles'

export interface PassengerSeat {
  id: string
  name: string
  offset: THREE.Vector3
}

export interface StuntState {
  isRolling: boolean
  rollDirection: 'left' | 'right'
  rollProgress: number // 0 to 1
  rollAngle: number // current radians
  rollCooldown: number // seconds remaining
  boostActive: boolean
  boostTime: number
}

export class VehicleStuntEngine {
  public state: StuntState = {
    isRolling: false,
    rollDirection: 'left',
    rollProgress: 0,
    rollAngle: 0,
    rollCooldown: 0,
    boostActive: false,
    boostTime: 0,
  }

  // Multi-seat co-op passenger tracking
  private passengers: PassengerSeat[] = []
  private maxSeats: Record<VehicleType, number> = {
    none: 0,
    hoverboard: 0,
    speeder: 1,
    cruiser: 2,
  }

  // Seat offsets relative to vehicle center
  private seatOffsets: Record<VehicleType, THREE.Vector3[]> = {
    none: [],
    hoverboard: [],
    speeder: [new THREE.Vector3(0, 0.25, -0.9)], // Rear seat
    cruiser: [
      new THREE.Vector3(-0.6, 0.35, -1.0), // Port co-pilot
      new THREE.Vector3(0.6, 0.35, -1.0),  // Starboard co-pilot
    ],
  }

  /**
   * Triggers a 360-degree acrobatic barrel roll
   */
  public triggerBarrelRoll(direction: 'left' | 'right'): boolean {
    const currentVeh = vehicles.getVehicle()
    if (currentVeh === 'none') return false
    if (this.state.isRolling || this.state.rollCooldown > 0) return false

    this.state.isRolling = true
    this.state.rollDirection = direction
    this.state.rollProgress = 0
    this.state.rollAngle = 0
    this.state.rollCooldown = 1.2 // 1.2s cooldown

    sound.playWhoosh()
    this.dispatchStuntEvent('barrel-roll', { direction })
    return true
  }

  /**
   * Triggers a momentary warp overdrive burst
   */
  public triggerWarpBurst(): boolean {
    const currentVeh = vehicles.getVehicle()
    if (currentVeh === 'none') return false
    if (this.state.boostActive) return false

    this.state.boostActive = true
    this.state.boostTime = 0.8 // 0.8s burst
    sound.playExplosion()
    this.dispatchStuntEvent('warp-burst', {})
    return true
  }

  /**
   * Updates stunt timers, rotation physics, and returns roll rotation angle in radians
   */
  public update(delta: number): number {
    // Cooldown countdown
    if (this.state.rollCooldown > 0) {
      this.state.rollCooldown = Math.max(0, this.state.rollCooldown - delta)
    }

    // Warp boost countdown
    if (this.state.boostActive) {
      this.state.boostTime = Math.max(0, this.state.boostTime - delta)
      if (this.state.boostTime <= 0) {
        this.state.boostActive = false
      }
    }

    // Barrel roll progress
    if (this.state.isRolling) {
      const rollDuration = 0.65 // seconds for complete 360 roll
      this.state.rollProgress += delta / rollDuration

      if (this.state.rollProgress >= 1.0) {
        this.state.isRolling = false
        this.state.rollProgress = 0
        this.state.rollAngle = 0
      } else {
        // Smooth sine ease in-out
        const t = this.state.rollProgress
        const ease = 0.5 * (1 - Math.cos(Math.PI * t))
        const fullTurn = Math.PI * 2
        this.state.rollAngle = this.state.rollDirection === 'left' ? -ease * fullTurn : ease * fullTurn
      }
    } else {
      this.state.rollAngle = 0
    }

    return this.state.rollAngle
  }

  public getStuntSpeedBonus(): number {
    let bonus = 1.0
    if (this.state.isRolling) bonus += 0.35 // +35% speed during roll
    if (this.state.boostActive) bonus += 0.75 // +75% speed during warp burst
    return bonus
  }

  // ---------------------------------------------------------------------------
  // Multi-seat Co-op Mounting
  // ---------------------------------------------------------------------------

  public canMountPassenger(): boolean {
    const veh = vehicles.getVehicle()
    const max = this.maxSeats[veh] || 0
    return this.passengers.length < max
  }

  public mountPassenger(id: string, name: string): boolean {
    const veh = vehicles.getVehicle()
    const max = this.maxSeats[veh] || 0
    if (this.passengers.length >= max) return false
    if (this.passengers.some(p => p.id === id)) return false

    const seatIdx = this.passengers.length
    const offset = this.seatOffsets[veh][seatIdx] || new THREE.Vector3(0, 0, -1)

    this.passengers.push({ id, name, offset: offset.clone() })
    sound.playTeleport()
    this.dispatchStuntEvent('passenger-mounted', { id, name, seatIdx })
    return true
  }

  public dismountPassenger(id: string): boolean {
    const idx = this.passengers.findIndex(p => p.id === id)
    if (idx === -1) return false
    this.passengers.splice(idx, 1)
    sound.playUiClick()
    this.dispatchStuntEvent('passenger-dismounted', { id })
    return true
  }

  public getPassengers(): readonly PassengerSeat[] {
    return this.passengers
  }

  public clearPassengers(): void {
    this.passengers = []
  }

  /**
   * Calculates world positions of mounted passengers given vehicle world position and yaw
   */
  public getPassengerWorldPositions(vehiclePos: THREE.Vector3, yaw: number): { id: string; name: string; position: THREE.Vector3 }[] {
    const cosY = Math.cos(yaw)
    const sinY = Math.sin(yaw)

    return this.passengers.map(p => {
      // Rotate local offset by vehicle yaw
      const rotatedX = p.offset.x * cosY + p.offset.z * sinY
      const rotatedZ = -p.offset.x * sinY + p.offset.z * cosY
      const worldPos = new THREE.Vector3(
        vehiclePos.x + rotatedX,
        vehiclePos.y + p.offset.y,
        vehiclePos.z + rotatedZ
      )
      return { id: p.id, name: p.name, position: worldPos }
    })
  }

  private dispatchStuntEvent(type: string, detail: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`vehicle-stunt-${type}`, { detail }))
    }
  }
}

export const vehicleStunts = new VehicleStuntEngine()
