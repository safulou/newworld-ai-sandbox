import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export type GameMode = 'creative' | 'survival'

export interface CombatStats {
  mode: GameMode
  health: number
  maxHealth: number
  shield: number
  maxShield: number
  saberActive: boolean
  dungeonActive: boolean
  bossActive: boolean
  bossHealth: number
  bossMaxHealth: number
}

export class BossGuardian {
  public mesh: THREE.Group = new THREE.Group()
  public health: number = 250
  public maxHealth: number = 250
  public isDefeated: boolean = false

  private coreMesh: THREE.Mesh
  private ringMesh: THREE.Mesh
  private orbitRings: THREE.Mesh[] = []
  private animTimer: number = 0
  private fireTimer: number = 0

  constructor(pos: THREE.Vector3) {
    this.mesh.position.copy(pos)

    // Central high-energy sphere
    const coreGeom = new THREE.DodecahedronGeometry(1.4, 1)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      emissive: 0xff0055,
      emissiveIntensity: 2.5,
      metalness: 0.8,
      roughness: 0.2,
    })
    this.coreMesh = new THREE.Mesh(coreGeom, coreMat)
    this.mesh.add(this.coreMesh)

    // Orbiting Defense Rings
    const ringGeom = new THREE.TorusGeometry(2.4, 0.12, 8, 24)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
    })
    this.ringMesh = new THREE.Mesh(ringGeom, ringMat)
    this.mesh.add(this.ringMesh)

    const ring2 = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }))
    ring2.rotation.x = Math.PI / 2
    this.mesh.add(ring2)
    this.orbitRings.push(this.ringMesh, ring2)
  }

  public takeDamage(dmg: number): boolean {
    this.health = Math.max(0, this.health - dmg)
    // Flash white on hit
    ;(this.coreMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff)
    setTimeout(() => {
      ;(this.coreMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xff0055)
    }, 120)

    if (this.health <= 0 && !this.isDefeated) {
      this.isDefeated = true
      return true
    }
    return false
  }

  public update(delta: number, playerPos: THREE.Vector3, onFireLaser?: (from: THREE.Vector3, to: THREE.Vector3) => void): void {
    if (this.isDefeated) return
    this.animTimer += delta

    // Floating sinusoidal hover
    this.mesh.position.y += Math.sin(this.animTimer * 2) * 0.015

    // Orbiting rings rotation
    this.ringMesh.rotation.x += delta * 1.5
    this.ringMesh.rotation.y += delta * 2.0
    this.orbitRings[1].rotation.y += delta * 1.8
    this.orbitRings[1].rotation.z += delta * 1.2

    // Fire laser bursts every 3.5s
    this.fireTimer += delta
    if (this.fireTimer >= 3.5) {
      this.fireTimer = 0
      if (onFireLaser) {
        onFireLaser(this.mesh.position.clone(), playerPos.clone())
      }
    }
  }

  public dispose(): void {
    this.coreMesh.geometry.dispose()
    ;(this.coreMesh.material as THREE.Material).dispose()
    for (const r of this.orbitRings) {
      r.geometry.dispose()
      ;(r.material as THREE.Material).dispose()
    }
  }
}

export class SurvivalCombatEngine {
  public stats: CombatStats = {
    mode: 'creative',
    health: 100,
    maxHealth: 100,
    shield: 100,
    maxShield: 100,
    saberActive: false,
    dungeonActive: false,
    bossActive: false,
    bossHealth: 250,
    bossMaxHealth: 250,
  }

  private scene: THREE.Scene | null = null
  private camera: THREE.Camera | null = null
  private saberGroup: THREE.Group = new THREE.Group()
  private saberBlade: THREE.Mesh | null = null
  private isSwinging: boolean = false
  private swingProgress: number = 0
  private timeSinceLastDmg: number = 5.0
  private boss: BossGuardian | null = null

  constructor() {
    this.initSaberMesh()
  }

  public init(scene: THREE.Scene, camera: THREE.Camera): void {
    this.scene = scene
    this.camera = camera
    if (this.camera) {
      this.camera.add(this.saberGroup)
    }
    this.saberGroup.visible = false
  }

  private initSaberMesh(): void {
    // Cyber Beam Saber: Hilt + Plasma Blade
    const hiltGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8)
    const hiltMat = new THREE.MeshStandardMaterial({
      color: 0x111926,
      metalness: 0.9,
      roughness: 0.2,
    })
    const hilt = new THREE.Mesh(hiltGeom, hiltMat)

    const bladeGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8)
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.92,
    })
    this.saberBlade = new THREE.Mesh(bladeGeom, bladeMat)
    this.saberBlade.position.y = 0.7

    this.saberGroup.add(hilt)
    this.saberGroup.add(this.saberBlade)

    // Position in first-person right hand
    this.saberGroup.position.set(0.45, -0.4, -0.75)
    this.saberGroup.rotation.set(-0.35, 0.2, -0.2)
  }

  public toggleGameMode(): GameMode {
    this.stats.mode = this.stats.mode === 'creative' ? 'survival' : 'creative'
    sound.playUiClick()
    this.dispatchUpdate()
    return this.stats.mode
  }

  public toggleSaber(): boolean {
    this.stats.saberActive = !this.stats.saberActive
    this.saberGroup.visible = this.stats.saberActive
    if (this.stats.saberActive) {
      sound.playUiClick()
    }
    this.dispatchUpdate()
    return this.stats.saberActive
  }

  /**
   * Swing Cyber Saber in a slashing arc
   */
  public attackSwing(playerPos: THREE.Vector3, _cameraDir?: THREE.Vector3): void {
    if (!this.stats.saberActive || this.isSwinging) return

    this.isSwinging = true
    this.swingProgress = 0
    this.playSaberSlashSound()

    // Hit detection against Boss or nearby monsters
    if (this.boss && !this.boss.isDefeated) {
      const dist = this.boss.mesh.position.distanceTo(playerPos)
      if (dist < 4.5) {
        const defeated = this.boss.takeDamage(35)
        this.stats.bossHealth = this.boss.health
        sound.playBlockBreak('diamond_block')
        if (defeated) {
          this.onBossDefeated()
        }
      }
    }

    this.dispatchUpdate()
  }

  public takeDamage(amount: number): void {
    if (this.stats.mode === 'creative') return
    this.timeSinceLastDmg = 0

    // Shield absorbs first
    if (this.stats.shield > 0) {
      const absorbed = Math.min(this.stats.shield, amount)
      this.stats.shield -= absorbed
      amount -= absorbed
      sound.playBlockBreak('glass')
    }

    if (amount > 0) {
      this.stats.health = Math.max(0, this.stats.health - amount)
      sound.playBlockBreak('mud')
    }

    if (this.stats.health <= 0) {
      this.handleDeath()
    }

    this.dispatchUpdate()
  }

  private handleDeath(): void {
    sound.playGameOver()
    // Auto respawn after 2.5s
    setTimeout(() => {
      this.stats.health = this.stats.maxHealth
      this.stats.shield = this.stats.maxShield
      sound.playLevelUp()
      this.dispatchUpdate()
    }, 2500)
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    // Shield auto-recharge after 4s without damage
    this.timeSinceLastDmg += delta
    if (this.stats.mode === 'survival' && this.timeSinceLastDmg > 4.0 && this.stats.shield < this.stats.maxShield) {
      this.stats.shield = Math.min(this.stats.maxShield, this.stats.shield + 20 * delta)
      this.dispatchUpdate()
    }

    // Saber swinging animation
    if (this.isSwinging) {
      this.swingProgress += delta * 7.5
      if (this.swingProgress >= 1.0) {
        this.isSwinging = false
        this.swingProgress = 0
        this.saberGroup.rotation.set(-0.35, 0.2, -0.2)
      } else {
        // Arc slash rotation
        const arc = Math.sin(this.swingProgress * Math.PI)
        this.saberGroup.rotation.x = -0.35 - arc * 1.2
        this.saberGroup.rotation.y = 0.2 - arc * 0.8
        this.saberGroup.rotation.z = -0.2 + arc * 1.5
      }
    }

    // Boss update
    if (this.boss && !this.boss.isDefeated) {
      this.boss.update(delta, playerPos, (from, to) => {
        // Laser fire from boss towards player
        const dist = from.distanceTo(to)
        if (dist < 18) {
          this.takeDamage(18)
        }
      })
    }
  }

  /**
   * Generates a 3-chamber procedural challenge dungeon at Y=8 underground
   */
  public generateDungeonChambers(origin: THREE.Vector3, world: any): void {
    if (!world) return
    this.stats.dungeonActive = true

    const ox = Math.floor(origin.x)
    const oy = Math.max(4, Math.floor(origin.y))
    const oz = Math.floor(origin.z)

    // Chamber 1: Laser Hallway (width: 5, height: 4, length: 12)
    for (let x = -2; x <= 2; x++) {
      for (let z = 0; z <= 12; z++) {
        for (let y = 0; y <= 4; y++) {
          const bx = ox + x, by = oy + y, bz = oz + z
          if (x === -2 || x === 2 || y === 0 || y === 4) {
            world.setBlock(bx, by, bz, 'basalt')
          } else {
            world.setBlock(bx, by, bz, 'air')
          }
        }
      }
    }
    // Laser cross beams in Chamber 1
    world.setBlock(ox - 1, oy + 1, oz + 4, 'neon_magenta')
    world.setBlock(ox, oy + 1, oz + 4, 'neon_magenta')
    world.setBlock(ox + 1, oy + 1, oz + 4, 'neon_magenta')

    world.setBlock(ox - 1, oy + 2, oz + 8, 'neon_cyan')
    world.setBlock(ox, oy + 2, oz + 8, 'neon_cyan')
    world.setBlock(ox + 1, oy + 2, oz + 8, 'neon_cyan')

    // Chamber 2: Anti-gravity Parkour Room (8x6x12)
    const c2z = oz + 13
    for (let x = -4; x <= 4; x++) {
      for (let z = 0; z <= 14; z++) {
        for (let y = 0; y <= 6; y++) {
          const bx = ox + x, by = oy + y, bz = c2z + z
          if (x === -4 || x === 4 || y === 0 || y === 6) {
            world.setBlock(bx, by, bz, y === 0 ? 'magma' : 'cyber_plating')
          } else {
            world.setBlock(bx, by, bz, 'air')
          }
        }
      }
    }
    // Stepping stones and jump pad
    world.setBlock(ox - 2, oy + 1, c2z + 3, 'obsidian')
    world.setBlock(ox, oy + 2, c2z + 6, 'jump_pad')
    world.setBlock(ox + 2, oy + 3, c2z + 9, 'obsidian')
    world.setBlock(ox, oy + 1, c2z + 12, 'concrete')

    // Chamber 3: Boss Guardian Vault (12x8x12)
    const c3z = c2z + 15
    for (let x = -6; x <= 6; x++) {
      for (let z = 0; z <= 14; z++) {
        for (let y = 0; y <= 8; y++) {
          const bx = ox + x, by = oy + y, bz = c3z + z
          if (x === -6 || x === 6 || y === 0 || y === 8 || z === 14) {
            world.setBlock(bx, by, bz, (x === -6 || x === 6) ? 'matrix_grid' : 'cyber_plating')
          } else {
            world.setBlock(bx, by, bz, 'air')
          }
        }
      }
    }

    // Spawn Boss Guardian in Chamber 3
    if (this.scene) {
      if (this.boss) this.boss.dispose()
      const bossPos = new THREE.Vector3(ox, oy + 3.5, c3z + 7)
      this.boss = new BossGuardian(bossPos)
      this.scene.add(this.boss.mesh)
      this.stats.bossActive = true
      this.stats.bossHealth = 250
      this.stats.bossMaxHealth = 250
    }

    sound.playLevelUp()
    this.dispatchUpdate()
  }

  private onBossDefeated(): void {
    this.stats.bossActive = false
    sound.playBuildComplete()
    achievements.unlock('dungeon_slayer')
    this.dispatchUpdate()
  }

  private playSaberSlashSound(): void {
    if (typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Swoosh plasma slash (pitch sweep noise + resonant filter)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.18)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)
  }

  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('combat-stats-update', { detail: { ...this.stats } }))
    }
  }

  public dispose(): void {
    if (this.camera) {
      this.camera.remove(this.saberGroup)
    }
    if (this.boss) {
      if (this.scene) this.scene.remove(this.boss.mesh)
      this.boss.dispose()
      this.boss = null
    }
    this.scene = null
    this.camera = null
  }
}

export const survivalCombat = new SurvivalCombatEngine()
