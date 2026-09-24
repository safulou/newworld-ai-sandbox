import * as THREE from 'three'
import { sound } from './audio'
import { VehicleType, vehicles } from './vehicles'
import { survivalCombat } from './survivalCombat'

export interface VehicleProjectile {
  id: string
  pos: THREE.Vector3
  vel: THREE.Vector3
  color: number
  damage: number
  life: number
  maxLife: number
  ownerId: string
  mesh?: THREE.Mesh
}

export interface VehicleCombatStats {
  hull: number
  maxHull: number
  shield: number
  maxShield: number
  energy: number
  maxEnergy: number
  isOverheated: boolean
  shotsFired: number
  hitsScored: number
}

export class VehicleCombatEngine {
  private scene: THREE.Scene | null = null
  public projectiles: VehicleProjectile[] = []
  public stats: VehicleCombatStats = {
    hull: 150,
    maxHull: 150,
    shield: 100,
    maxShield: 100,
    energy: 100,
    maxEnergy: 100,
    isOverheated: false,
    shotsFired: 0,
    hitsScored: 0,
  }

  private fireCooldown: number = 0
  private lastFiredCannonSide: 'left' | 'right' = 'left'
  private projectileGeometry: THREE.BufferGeometry | null = null
  private projectileMaterialCache: Map<number, THREE.Material> = new Map()

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.projectileGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 6)
    this.projectileGeometry.rotateX(Math.PI / 2)
  }

  public canFire(): boolean {
    const veh = vehicles.getVehicle()
    if (veh === 'none') return false
    if (this.stats.isOverheated) return false
    if (this.fireCooldown > 0) return false
    return this.stats.energy >= 12
  }

  /**
   * Fires vehicle plasma bolts forward from vehicle muzzle offsets
   */
  public fire(
    vehiclePos: THREE.Vector3,
    direction: THREE.Vector3,
    vehicleType: VehicleType = vehicles.getVehicle(),
    ownerId: string = 'local_player'
  ): VehicleProjectile | null {
    if (vehicleType === 'none') return null
    if (this.fireCooldown > 0 || this.stats.isOverheated) return null
    if (this.stats.energy < 12) {
      sound.playUiClick()
      return null
    }

    // Deduct plasma energy
    this.stats.energy = Math.max(0, this.stats.energy - 12)
    if (this.stats.energy <= 0) {
      this.stats.isOverheated = true
    }

    this.fireCooldown = vehicleType === 'cruiser' ? 0.18 : 0.12
    this.stats.shotsFired++

    // Determine muzzle offset based on vehicle type and alternating side
    const muzzleOffset = new THREE.Vector3()
    const speed = 75 // m/s projectile speed

    if (vehicleType === 'hoverboard') {
      muzzleOffset.set(0, 0.1, 0.8)
    } else if (vehicleType === 'speeder') {
      const side = this.lastFiredCannonSide === 'left' ? -0.8 : 0.8
      this.lastFiredCannonSide = this.lastFiredCannonSide === 'left' ? 'right' : 'left'
      muzzleOffset.set(side, 0.1, 1.2)
    } else {
      // Cruiser quad cannons
      const side = this.lastFiredCannonSide === 'left' ? -1.1 : 1.1
      this.lastFiredCannonSide = this.lastFiredCannonSide === 'left' ? 'right' : 'left'
      muzzleOffset.set(side, 0.25, 1.6)
    }

    // Orient offset by vehicle direction
    const right = new THREE.Vector3(-direction.z, 0, direction.x).normalize()
    const spawnPos = vehiclePos.clone()
      .add(right.clone().multiplyScalar(muzzleOffset.x))
      .add(new THREE.Vector3(0, muzzleOffset.y, 0))
      .add(direction.clone().multiplyScalar(muzzleOffset.z))

    const vel = direction.clone().normalize().multiplyScalar(speed)
    const color = vehicleType === 'cruiser' ? 0x00ff88 : (vehicleType === 'speeder' ? 0xff0055 : 0x00ffff)
    const damage = vehicleType === 'cruiser' ? 35 : (vehicleType === 'speeder' ? 25 : 18)

    const proj: VehicleProjectile = {
      id: `vproj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pos: spawnPos.clone(),
      vel,
      color,
      damage,
      life: 0,
      maxLife: 1.8,
      ownerId,
    }

    if (this.scene && this.projectileGeometry) {
      let mat = this.projectileMaterialCache.get(color)
      if (!mat) {
        mat = new THREE.MeshBasicMaterial({ color, wireframe: false })
        this.projectileMaterialCache.set(color, mat)
      }
      const mesh = new THREE.Mesh(this.projectileGeometry, mat)
      mesh.position.copy(spawnPos)
      mesh.lookAt(spawnPos.clone().add(direction))
      this.scene.add(mesh)
      proj.mesh = mesh
    }

    this.projectiles.push(proj)
    sound.playLaserShoot()
    this.dispatchUpdate()
    return proj
  }

  /**
   * Updates projectile flight physics, collision checks, and plasma recharge
   */
  public update(delta: number, world?: any): { hitCount: number } {
    let hitCount = 0

    // Cooldown & energy recharge
    if (this.fireCooldown > 0) {
      this.fireCooldown = Math.max(0, this.fireCooldown - delta)
    }

    // Energy recovery
    if (this.stats.energy < this.stats.maxEnergy) {
      this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + 28 * delta)
      if (this.stats.isOverheated && this.stats.energy > 40) {
        this.stats.isOverheated = false
      }
    }

    // Shield auto-recharge
    if (this.stats.shield < this.stats.maxShield) {
      this.stats.shield = Math.min(this.stats.maxShield, this.stats.shield + 15 * delta)
    }

    // Projectile motion and collision
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.life += delta

      const step = p.vel.clone().multiplyScalar(delta)
      p.pos.add(step)
      if (p.mesh) {
        p.mesh.position.copy(p.pos)
      }

      let hit = false

      // 1. Collision with Boss Guardian
      const boss = survivalCombat.getBoss()
      if (boss && !boss.isDefeated) {
        const bossDist = p.pos.distanceTo(boss.mesh.position)
        if (bossDist < 3.2) {
          survivalCombat.damageBoss(p.damage, p.pos)
          this.stats.hitsScored++
          hitCount++
          hit = true
        }
      }

      // 2. Collision with solid voxel blocks in world
      if (!hit && world) {
        const bx = Math.floor(p.pos.x)
        const by = Math.floor(p.pos.y)
        const bz = Math.floor(p.pos.z)
        const block = world.getBlock(bx, by, bz)
        if (block && block !== 'air' && block !== 'water') {
          hit = true
        }
      }

      // Remove expired or collided projectiles
      if (hit || p.life >= p.maxLife) {
        if (p.mesh && this.scene) {
          this.scene.remove(p.mesh)
        }
        this.projectiles.splice(i, 1)
      }
    }

    return { hitCount }
  }

  public takeVehicleDamage(dmg: number): { hull: number; shield: number; destroyed: boolean } {
    let absorbed = Math.min(this.stats.shield, dmg)
    this.stats.shield -= absorbed
    let remaining = dmg - absorbed
    this.stats.hull = Math.max(0, this.stats.hull - remaining)

    const destroyed = this.stats.hull <= 0
    if (destroyed) {
      sound.playExplosion()
      // Reset vehicle on destruction
      vehicles.setVehicle('none')
      this.repair(100)
    } else {
      sound.playExplosion()
    }

    this.dispatchUpdate()
    return { hull: this.stats.hull, shield: this.stats.shield, destroyed }
  }

  public repair(amount: number = 50): void {
    this.stats.hull = Math.min(this.stats.maxHull, this.stats.hull + amount)
    this.stats.shield = this.stats.maxShield
    this.stats.energy = this.stats.maxEnergy
    this.stats.isOverheated = false
    this.fireCooldown = 0
    this.dispatchUpdate()
  }

  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vehicle-combat-update', { detail: { ...this.stats } }))
    }
  }

  public dispose(): void {
    if (this.scene) {
      for (const p of this.projectiles) {
        if (p.mesh) this.scene.remove(p.mesh)
      }
    }
    this.projectiles = []
    this.projectileMaterialCache.forEach((mat) => mat.dispose())
    this.projectileMaterialCache.clear()
    if (this.projectileGeometry) {
      this.projectileGeometry.dispose()
      this.projectileGeometry = null
    }
    this.scene = null
  }
}

export const vehicleCombat = new VehicleCombatEngine()
