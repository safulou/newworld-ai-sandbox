import * as THREE from 'three'
import { Socket } from 'socket.io-client'
import { sound } from './audio'

export interface DamageNumberParticle {
  sprite: THREE.Sprite
  age: number
  lifetime: number
  vy: number
}

export interface RemoteSlashEffect {
  mesh: THREE.Mesh
  age: number
  lifetime: number
}

export class MultiplayerCombatEngine {
  private socket: Socket | null = null
  private scene: THREE.Scene | null = null
  private damageParticles: DamageNumberParticle[] = []
  private slashEffects: RemoteSlashEffect[] = []

  public init(socket: Socket | null, scene: THREE.Scene): void {
    this.socket = socket
    this.scene = scene
    this.bindSocketEvents()
  }

  private bindSocketEvents(): void {
    if (!this.socket) return

    // 1. Damage popup and hit reaction
    this.socket.on(
      'server:combat-damage',
      (data: {
        targetId?: string
        targetType: 'player' | 'boss'
        damage: number
        attackerName?: string
        position?: { x: number; y: number; z: number }
      }) => {
        if (data.position) {
          const pos = new THREE.Vector3(data.position.x, data.position.y + 1.2, data.position.z)
          this.spawnDamageNumber(pos, data.damage, data.damage >= 50)
        }
      }
    )

    // 2. Boss Guardian synchronization from remote allies
    this.socket.on(
      'server:boss-sync',
      (data: { health: number; maxHealth: number; isDefeated: boolean; position?: { x: number; y: number; z: number } }) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('remote-boss-sync', {
              detail: data,
            })
          )
        }
      }
    )

    // 3. Remote player saber slash visual wave
    this.socket.on(
      'server:combat-slash',
      (data: { position: { x: number; y: number; z: number }; rotY: number; saberColor?: number }) => {
        const pos = new THREE.Vector3(data.position.x, data.position.y, data.position.z)
        this.spawnRemoteSlashWave(pos, data.rotY, data.saberColor || 0x00ffff)
      }
    )
  }

  /**
   * Spawns a floating 3D neon damage number
   */
  public spawnDamageNumber(pos: THREE.Vector3, amount: number, isCrit: boolean = false): void {
    if (!this.scene) return

    let mat: THREE.SpriteMaterial
    if (typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = isCrit ? '#ff0055' : '#00ffff'
          ctx.font = isCrit ? 'bold 64px monospace, sans-serif' : 'bold 52px monospace, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = isCrit ? '#ff00aa' : '#00aaff'
          ctx.shadowBlur = 12

          const text = isCrit ? `⚡ -${amount} CRIT!` : `-${amount}`
          ctx.fillText(text, 128, 64)
          const texture = new THREE.CanvasTexture(canvas)
          mat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          })
        } else {
          mat = new THREE.SpriteMaterial({ color: isCrit ? 0xff0055 : 0x00ffff, transparent: true })
        }
      } catch {
        mat = new THREE.SpriteMaterial({ color: isCrit ? 0xff0055 : 0x00ffff, transparent: true })
      }
    } else {
      mat = new THREE.SpriteMaterial({ color: isCrit ? 0xff0055 : 0x00ffff, transparent: true })
    }

    const sprite = new THREE.Sprite(mat)
    sprite.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.4, (Math.random() - 0.5) * 0.4))
    sprite.scale.set(isCrit ? 1.6 : 1.2, isCrit ? 0.8 : 0.6, 1)

    this.scene.add(sprite)
    this.damageParticles.push({
      sprite,
      age: 0,
      lifetime: 1.1,
      vy: 1.5,
    })
  }

  /**
   * Spawns a visible 3D slash arc when a player swings Cyber Saber
   */
  public spawnRemoteSlashWave(pos: THREE.Vector3, rotY: number, colorHex: number = 0x00ffff): void {
    if (!this.scene) return

    const arcGeo = new THREE.TorusGeometry(1.2, 0.06, 6, 24, Math.PI * 0.75)
    const arcMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
    const arcMesh = new THREE.Mesh(arcGeo, arcMat)
    arcMesh.position.copy(pos).add(new THREE.Vector3(0, 0.8, 0))
    arcMesh.rotation.y = rotY
    arcMesh.rotation.x = Math.PI / 4

    this.scene.add(arcMesh)
    this.slashEffects.push({
      mesh: arcMesh,
      age: 0,
      lifetime: 0.25,
    })

    sound.playLaserShoot()
  }

  // -------------------------------------------------------------
  // Emitters
  // -------------------------------------------------------------

  public broadcastDamage(
    targetType: 'player' | 'boss',
    damage: number,
    pos: THREE.Vector3,
    targetId?: string,
    attackerName: string = 'Pioneer'
  ): void {
    // 1. Local popup
    this.spawnDamageNumber(pos, damage, damage >= 50)

    // 2. Broadcast to room
    if (this.socket) {
      this.socket.emit('client:combat-damage', {
        targetType,
        damage,
        targetId,
        attackerName,
        position: { x: pos.x, y: pos.y, z: pos.z },
      })
    }
  }

  public broadcastBossSync(health: number, maxHealth: number, isDefeated: boolean, pos?: THREE.Vector3): void {
    if (this.socket) {
      this.socket.emit('client:boss-sync', {
        health,
        maxHealth,
        isDefeated,
        position: pos ? { x: pos.x, y: pos.y, z: pos.z } : undefined,
      })
    }
  }

  public broadcastSlash(pos: THREE.Vector3, rotY: number, saberColor: number = 0x00ffff): void {
    this.spawnRemoteSlashWave(pos, rotY, saberColor)
    if (this.socket) {
      this.socket.emit('client:combat-slash', {
        position: { x: pos.x, y: pos.y, z: pos.z },
        rotY,
        saberColor,
      })
    }
  }

  public broadcastHealth(health: number, maxHealth: number, shield: number, maxShield: number): void {
    if (this.socket) {
      this.socket.emit('client:player-health', {
        health,
        maxHealth,
        shield,
        maxShield,
      })
    }
  }

  // -------------------------------------------------------------
  // Animation / Render Loop
  // -------------------------------------------------------------

  public update(delta: number): void {
    // 1. Damage number popups
    for (let i = this.damageParticles.length - 1; i >= 0; i--) {
      const p = this.damageParticles[i]
      p.age += delta
      if (p.age >= p.lifetime) {
        if (this.scene) this.scene.remove(p.sprite)
        p.sprite.geometry.dispose()
        ;(p.sprite.material as THREE.Material).dispose()
        this.damageParticles.splice(i, 1)
        continue
      }
      p.sprite.position.y += p.vy * delta
      p.vy = Math.max(0.2, p.vy - delta * 1.5) // gravity deceleration
      p.sprite.material.opacity = Math.max(0, 1 - p.age / p.lifetime)
    }

    // 2. Slash wave arcs
    for (let i = this.slashEffects.length - 1; i >= 0; i--) {
      const s = this.slashEffects[i]
      s.age += delta
      const progress = s.age / s.lifetime
      s.mesh.scale.multiplyScalar(1 + delta * 3)
      ;(s.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - progress)

      if (s.age >= s.lifetime) {
        if (this.scene) this.scene.remove(s.mesh)
        s.mesh.geometry.dispose()
        ;(s.mesh.material as THREE.Material).dispose()
        this.slashEffects.splice(i, 1)
      }
    }
  }

  public dispose(): void {
    if (this.scene) {
      for (const p of this.damageParticles) {
        this.scene.remove(p.sprite)
        p.sprite.geometry.dispose()
        ;(p.sprite.material as THREE.Material).dispose()
      }
      for (const s of this.slashEffects) {
        this.scene.remove(s.mesh)
        s.mesh.geometry.dispose()
        ;(s.mesh.material as THREE.Material).dispose()
      }
    }
    this.damageParticles = []
    this.slashEffects = []
  }
}

export const multiplayerCombat = new MultiplayerCombatEngine()
