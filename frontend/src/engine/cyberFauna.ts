import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { sound } from './audio'
import { achievements } from './achievements'

export type HoundState = 'wild' | 'tamed' | 'sitting'

export interface HeartParticle {
  sprite: THREE.Sprite
  age: number
  lifetime: number
  vy: number
}

// -------------------------------------------------------------
// 1. Cyber Jellyfish (賽博發光水母)
// -------------------------------------------------------------
export class CyberJellyfish {
  public group: THREE.Group = new THREE.Group()
  private bellMesh: THREE.Mesh
  private tentacles: THREE.Mesh[] = []
  private origin: THREE.Vector3
  private animTime: number = Math.random() * 10

  constructor(pos: THREE.Vector3, colorHex: number = 0x00ffff) {
    this.origin = pos.clone()
    this.group.position.copy(pos)

    // Bell (Dome)
    const bellGeom = new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55)
    const bellMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.78,
    })
    this.bellMesh = new THREE.Mesh(bellGeom, bellMat)
    this.bellMesh.rotation.x = Math.PI
    this.group.add(this.bellMesh)

    // 4 Undulating Tentacles
    const tentGeom = new THREE.CylinderGeometry(0.04, 0.02, 0.8, 6)
    const tentMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.65,
    })

    const offsets = [
      [0.25, 0, 0.25],
      [-0.25, 0, 0.25],
      [0.25, 0, -0.25],
      [-0.25, 0, -0.25],
    ]

    for (const [ox, oy, oz] of offsets) {
      const tent = new THREE.Mesh(tentGeom, tentMat)
      tent.position.set(ox, oy - 0.4, oz)
      this.group.add(tent)
      this.tentacles.push(tent)
    }
  }

  public update(delta: number): void {
    this.animTime += delta * 2.2
    // Vertical sinusoidal swimming bob
    const bob = Math.sin(this.animTime) * 0.45
    this.group.position.y = this.origin.y + bob

    // Gentle horizontal drift
    this.group.position.x = this.origin.x + Math.sin(this.animTime * 0.5) * 0.8
    this.group.position.z = this.origin.z + Math.cos(this.animTime * 0.5) * 0.8

    // Pulsing bell expansion & contraction
    const pulse = 1.0 + Math.sin(this.animTime * 2) * 0.15
    this.bellMesh.scale.set(pulse, 1.0 / pulse, pulse)

    // Undulating tentacles
    for (let i = 0; i < this.tentacles.length; i++) {
      const t = this.tentacles[i]
      t.rotation.z = Math.sin(this.animTime * 2.5 + i) * 0.25
      t.rotation.x = Math.cos(this.animTime * 2.5 + i) * 0.25
    }
  }

  public dispose(): void {
    this.bellMesh.geometry.dispose()
    ;(this.bellMesh.material as THREE.Material).dispose()
    for (const t of this.tentacles) {
      t.geometry.dispose()
      ;(t.material as THREE.Material).dispose()
    }
  }
}

// -------------------------------------------------------------
// 2. Cyber Hound (賽博機械犬)
// -------------------------------------------------------------
export class CyberHound {
  public group: THREE.Group = new THREE.Group()
  public state: HoundState = 'wild'
  public name: string = 'Volt-01'

  private torsoMesh: THREE.Mesh
  private headMesh: THREE.Mesh
  private visorMesh: THREE.Mesh
  private tailMesh: THREE.Mesh
  private legs: THREE.Mesh[] = []

  private walkTime: number = 0
  private targetPos: THREE.Vector3 = new THREE.Vector3()
  private barkTimer: number = 0

  constructor(pos: THREE.Vector3, state: HoundState = 'wild') {
    this.state = state
    this.group.position.copy(pos)
    this.targetPos.copy(pos)

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x223344,
      metalness: 0.8,
      roughness: 0.3,
    })
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
    })
    const visorMat = new THREE.MeshBasicMaterial({
      color: this.state === 'wild' ? 0xffaa00 : 0x00ff88,
    })

    // Torso (0.7 long, 0.4 high, 0.35 wide)
    const torsoGeom = new THREE.BoxGeometry(0.35, 0.35, 0.7)
    this.torsoMesh = new THREE.Mesh(torsoGeom, bodyMat)
    this.torsoMesh.position.y = 0.4
    this.group.add(this.torsoMesh)

    // Head
    const headGeom = new THREE.BoxGeometry(0.28, 0.28, 0.32)
    this.headMesh = new THREE.Mesh(headGeom, bodyMat)
    this.headMesh.position.set(0, 0.6, 0.45)
    this.group.add(this.headMesh)

    // Visor (Eyes)
    const visorGeom = new THREE.BoxGeometry(0.22, 0.08, 0.06)
    this.visorMesh = new THREE.Mesh(visorGeom, visorMat)
    this.visorMesh.position.set(0, 0.63, 0.62)
    this.group.add(this.visorMesh)

    // Tail (Antenna)
    const tailGeom = new THREE.CylinderGeometry(0.02, 0.03, 0.3, 4)
    this.tailMesh = new THREE.Mesh(tailGeom, accentMat)
    this.tailMesh.position.set(0, 0.6, -0.4)
    this.tailMesh.rotation.x = -Math.PI / 4
    this.group.add(this.tailMesh)

    // 4 Articulated Legs
    const legGeom = new THREE.BoxGeometry(0.09, 0.35, 0.09)
    const legOffsets = [
      [-0.14, 0.18, 0.22],
      [0.14, 0.18, 0.22],
      [-0.14, 0.18, -0.22],
      [0.14, 0.18, -0.22],
    ]
    for (const [lx, ly, lz] of legOffsets) {
      const leg = new THREE.Mesh(legGeom, bodyMat)
      leg.position.set(lx, ly, lz)
      this.group.add(leg)
      this.legs.push(leg)
    }
  }

  public setTamed(): void {
    this.state = 'tamed'
    ;(this.visorMesh.material as THREE.MeshBasicMaterial).color.setHex(0x00ff88)
    achievements.unlock('cyber_tamer')
    this.playRobotBark()
  }

  public toggleSit(): void {
    if (this.state === 'tamed') {
      this.state = 'sitting'
      this.torsoMesh.position.y = 0.25
      this.headMesh.position.y = 0.45
      this.visorMesh.position.y = 0.48
      sound.playUiClick()
    } else if (this.state === 'sitting') {
      this.state = 'tamed'
      this.torsoMesh.position.y = 0.4
      this.headMesh.position.y = 0.6
      this.visorMesh.position.y = 0.63
      sound.playUiClick()
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    this.walkTime += delta * 6
    this.barkTimer -= delta

    if (this.state === 'sitting') {
      // Look towards player
      this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)
      this.tailMesh.rotation.z = Math.sin(this.walkTime * 2) * 0.2
      return
    }

    if (this.state === 'tamed') {
      // Follow player at distance ~3.5 meters
      const dist = this.group.position.distanceTo(playerPos)
      if (dist > 3.8) {
        const dir = playerPos.clone().sub(this.group.position).normalize()
        dir.y = 0
        const speed = dist > 8 ? 6.5 : 4.0
        this.group.position.addScaledVector(dir, speed * delta)
        this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)

        // Running leg swing
        for (let i = 0; i < this.legs.length; i++) {
          const sign = i % 2 === 0 ? 1 : -1
          this.legs[i].rotation.x = Math.sin(this.walkTime * 1.5) * 0.45 * sign
        }
        // Wag tail excitedly!
        this.tailMesh.rotation.z = Math.sin(this.walkTime * 3) * 0.5
      } else {
        // Idle
        this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)
        for (const leg of this.legs) {
          leg.rotation.x = 0
        }
        this.tailMesh.rotation.z = Math.sin(this.walkTime) * 0.25
      }
    } else {
      // Wild wandering behavior
      const distToTarget = this.group.position.distanceTo(this.targetPos)
      if (distToTarget < 1.0 || Math.random() < 0.005) {
        // Pick new random waypoint around original area
        this.targetPos.x += (Math.random() - 0.5) * 12
        this.targetPos.z += (Math.random() - 0.5) * 12
      }

      const dir = this.targetPos.clone().sub(this.group.position).normalize()
      dir.y = 0
      this.group.position.addScaledVector(dir, 1.8 * delta)
      this.group.lookAt(this.targetPos.x, this.group.position.y, this.targetPos.z)

      for (let i = 0; i < this.legs.length; i++) {
        const sign = i % 2 === 0 ? 1 : -1
        this.legs[i].rotation.x = Math.sin(this.walkTime) * 0.3 * sign
      }

      if (this.barkTimer <= 0 && Math.random() < 0.02) {
        this.barkTimer = 8 + Math.random() * 8
        this.playRobotBark()
      }
    }
  }

  public playRobotBark(): void {
    if (typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Two-tone digitized robotic bark (chirp-drop)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(620, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12)
    osc.frequency.setValueAtTime(540, now + 0.14)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.26)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }

  public dispose(): void {
    this.torsoMesh.geometry.dispose()
    this.headMesh.geometry.dispose()
    this.visorMesh.geometry.dispose()
    this.tailMesh.geometry.dispose()
    for (const leg of this.legs) {
      leg.geometry.dispose()
    }
  }
}

// -------------------------------------------------------------
// 3. Quantum Butterfly Swarm (量子能量蝶群 - Boids 算法)
// -------------------------------------------------------------
export interface ButterflyBoid {
  mesh: THREE.Group
  pos: THREE.Vector3
  vel: THREE.Vector3
  leftWing: THREE.Mesh
  rightWing: THREE.Mesh
  flapSpeed: number
  flapOffset: number
}

export class QuantumButterflySwarm {
  public group: THREE.Group = new THREE.Group()
  private butterflies: ButterflyBoid[] = []
  private boundsRadius: number = 14

  constructor(origin: THREE.Vector3, count: number = 18) {
    this.group.position.copy(origin)

    const wingGeom = new THREE.PlaneGeometry(0.16, 0.16)
    const wingMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })

    for (let i = 0; i < count; i++) {
      const bGroup = new THREE.Group()
      const leftWing = new THREE.Mesh(wingGeom, wingMat)
      leftWing.position.x = -0.08
      const rightWing = new THREE.Mesh(wingGeom, wingMat)
      rightWing.position.x = 0.08

      bGroup.add(leftWing)
      bGroup.add(rightWing)

      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        1.5 + Math.random() * 3,
        (Math.random() - 0.5) * 8
      )
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 2
      )

      bGroup.position.copy(pos)
      this.group.add(bGroup)

      this.butterflies.push({
        mesh: bGroup,
        pos,
        vel,
        leftWing,
        rightWing,
        flapSpeed: 14 + Math.random() * 8,
        flapOffset: Math.random() * Math.PI * 2,
      })
    }
  }

  public update(delta: number): void {
    const count = this.butterflies.length
    if (count === 0) return

    for (let i = 0; i < count; i++) {
      const b = this.butterflies[i]

      // Boids Rules: Separation, Alignment, Cohesion
      let sepX = 0, sepY = 0, sepZ = 0
      let alignX = 0, alignY = 0, alignZ = 0
      let cohX = 0, cohY = 0, cohZ = 0
      let neighbors = 0

      for (let j = 0; j < count; j++) {
        if (i === j) continue
        const other = this.butterflies[j]
        const dist = b.pos.distanceTo(other.pos)
        if (dist < 3.5 && dist > 0.01) {
          // Separation
          sepX += (b.pos.x - other.pos.x) / dist
          sepY += (b.pos.y - other.pos.y) / dist
          sepZ += (b.pos.z - other.pos.z) / dist

          // Alignment
          alignX += other.vel.x
          alignY += other.vel.y
          alignZ += other.vel.z

          // Cohesion
          cohX += other.pos.x
          cohY += other.pos.y
          cohZ += other.pos.z
          neighbors++
        }
      }

      if (neighbors > 0) {
        alignX /= neighbors
        alignY /= neighbors
        alignZ /= neighbors
        cohX = (cohX / neighbors - b.pos.x) * 0.4
        cohY = (cohY / neighbors - b.pos.y) * 0.4
        cohZ = (cohZ / neighbors - b.pos.z) * 0.4

        b.vel.x += (sepX * 1.5 + alignX * 0.2 + cohX) * delta
        b.vel.y += (sepY * 1.5 + alignY * 0.2 + cohY) * delta
        b.vel.z += (sepZ * 1.5 + alignZ * 0.2 + cohZ) * delta
      }

      // Bound to origin sphere
      const distFromCenter = b.pos.length()
      if (distFromCenter > this.boundsRadius) {
        b.vel.sub(b.pos.clone().multiplyScalar(0.8 * delta))
      }

      // Cap speed
      b.vel.clampLength(0.8, 3.2)
      b.pos.addScaledVector(b.vel, delta)
      b.mesh.position.copy(b.pos)

      // Heading orientation
      b.mesh.lookAt(b.pos.clone().add(b.vel))

      // Wing flapping animation
      const flap = Math.sin(Date.now() * 0.012 * b.flapSpeed + b.flapOffset) * 0.9
      b.leftWing.rotation.y = flap
      b.rightWing.rotation.y = -flap
    }
  }

  public dispose(): void {
    for (const b of this.butterflies) {
      b.leftWing.geometry.dispose()
      ;(b.leftWing.material as THREE.Material).dispose()
    }
    this.butterflies = []
  }
}

// -------------------------------------------------------------
// 4. Cyber Fauna Manager (生態系整合管理器)
// -------------------------------------------------------------
export class CyberFaunaManager {
  private scene: THREE.Scene | null = null
  private jellyfishList: CyberJellyfish[] = []
  private hounds: CyberHound[] = []
  private swarms: QuantumButterflySwarm[] = []
  private heartParticles: HeartParticle[] = []
  private heartTexture: THREE.Texture | null = null

  constructor() {
    this.initHeartTexture()
  }

  private initHeartTexture(): void {
    if (typeof document === 'undefined') return
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ff0055'
      ctx.font = '48px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = '#ff66aa'
      ctx.shadowBlur = 10
      ctx.fillText('💖', 32, 34)
    }
    this.heartTexture = new THREE.CanvasTexture(canvas)
  }

  public init(scene: THREE.Scene, spawnCenter: THREE.Vector3): void {
    this.dispose()
    this.scene = scene

    // 1. Spawn 3 Cyber Jellyfish drifting in space
    const jOffsets = [
      new THREE.Vector3(4, 3, -6),
      new THREE.Vector3(-8, 4, 8),
      new THREE.Vector3(12, 5, 10),
    ]
    for (const off of jOffsets) {
      const pos = spawnCenter.clone().add(off)
      const jf = new CyberJellyfish(pos, Math.random() < 0.5 ? 0x00ffff : 0xff00aa)
      scene.add(jf.group)
      this.jellyfishList.push(jf)
    }

    // 2. Spawn 2 Cyber Hounds (One near spawn as wild)
    const h1 = new CyberHound(spawnCenter.clone().add(new THREE.Vector3(3, 0.5, 3)), 'wild')
    scene.add(h1.group)
    this.hounds.push(h1)

    // 3. Spawn Butterfly Swarm in nearby field
    const swarm = new QuantumButterflySwarm(spawnCenter.clone().add(new THREE.Vector3(0, 1.5, -5)), 18)
    scene.add(swarm.group)
    this.swarms.push(swarm)
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    for (const j of this.jellyfishList) {
      j.update(delta)
    }
    for (const h of this.hounds) {
      h.update(delta, playerPos)
    }
    for (const s of this.swarms) {
      s.update(delta)
    }

    // Heart particles
    for (let i = this.heartParticles.length - 1; i >= 0; i--) {
      const p = this.heartParticles[i]
      p.age += delta
      if (p.age >= p.lifetime) {
        if (p.sprite.parent) p.sprite.parent.remove(p.sprite)
        p.sprite.material.dispose()
        this.heartParticles.splice(i, 1)
        continue
      }
      p.sprite.position.y += p.vy * delta
      p.sprite.material.opacity = 1 - p.age / p.lifetime
    }
  }

  /**
   * Player interacts with nearby fauna (e.g. Right Click with Quantum Core to tame hound)
   */
  public interactWithFauna(playerPos: THREE.Vector3, _heldBlock?: BlockType): boolean {
    for (const hound of this.hounds) {
      const dist = hound.group.position.distanceTo(playerPos)
      if (dist < 4.0) {
        if (hound.state === 'wild') {
          // Tame requirement: holding quantum_core, amethyst, or diamond_block (or any click)
          hound.setTamed()
          this.spawnHeartBurst(hound.group.position)
          sound.playLevelUp()
          return true
        } else {
          hound.toggleSit()
          return true
        }
      }
    }
    return false
  }

  public spawnHeartBurst(pos: THREE.Vector3): void {
    if (!this.scene || !this.heartTexture) return
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.heartTexture,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.8 + Math.random() * 0.4, (Math.random() - 0.5) * 0.8))
      sprite.scale.set(0.5, 0.5, 0.5)
      this.scene.add(sprite)

      this.heartParticles.push({
        sprite,
        age: 0,
        lifetime: 1.5,
        vy: 1.2 + Math.random() * 0.4,
      })
    }
  }

  public getHounds(): CyberHound[] {
    return this.hounds
  }

  public dispose(): void {
    for (const j of this.jellyfishList) {
      if (this.scene) this.scene.remove(j.group)
      j.dispose()
    }
    for (const h of this.hounds) {
      if (this.scene) this.scene.remove(h.group)
      h.dispose()
    }
    for (const s of this.swarms) {
      if (this.scene) this.scene.remove(s.group)
      s.dispose()
    }
    for (const p of this.heartParticles) {
      if (p.sprite.parent) p.sprite.parent.remove(p.sprite)
      p.sprite.material.dispose()
    }
    this.jellyfishList = []
    this.hounds = []
    this.swarms = []
    this.heartParticles = []
    this.scene = null
  }
}

export const cyberFauna = new CyberFaunaManager()
