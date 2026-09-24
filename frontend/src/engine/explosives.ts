import * as THREE from 'three'
import { sound } from './audio'
import { BlockType } from '@/types/world'
import { BLOCK_COLORS } from './blocks'

interface DebrisParticle {
  pos: THREE.Vector3
  vel: THREE.Vector3
  color: THREE.Color
  life: number
  maxLife: number
}

export class ExplosivesEngine {
  private scene: THREE.Scene | null = null
  private particles: DebrisParticle[] = []
  private debrisPoints: THREE.Points | null = null
  private geometry: THREE.BufferGeometry | null = null
  private maxParticles = 600

  public init(scene: THREE.Scene): void {
    this.scene = scene

    this.geometry = new THREE.BufferGeometry()
    const pos = new Float32Array(this.maxParticles * 3)
    const colors = new Float32Array(this.maxParticles * 3)

    this.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    })

    this.debrisPoints = new THREE.Points(this.geometry, mat)
    this.debrisPoints.frustumCulled = false
    this.scene.add(this.debrisPoints)
  }

  public detonate(
    x: number,
    y: number,
    z: number,
    world: any,
    playerPos?: THREE.Vector3
  ): void {
    sound.playExplosion()

    const radius = 3
    const destroyedCoords: { x: number; y: number; z: number; type: BlockType }[] = []

    for (let ox = -radius; ox <= radius; ox++) {
      for (let oy = -radius; oy <= radius; oy++) {
        for (let oz = -radius; oz <= radius; oz++) {
          const distSq = ox * ox + oy * oy + oz * oz
          if (distSq <= radius * radius) {
            const bx = x + ox
            const by = y + oy
            const bz = z + oz
            const block = world.getBlock(bx, by, bz)
            // Indestructible blocks guard (e.g. obsidian / bedrock / air)
            if (block && block !== 'air' && block !== 'obsidian') {
              destroyedCoords.push({ x: bx, y: by, z: bz, type: block })
            }
          }
        }
      }
    }

    // Remove blocks
    for (const b of destroyedCoords) {
      world.removeBlock(b.x, b.y, b.z)
      this.spawnDebris(b.x + 0.5, b.y + 0.5, b.z + 0.5, b.type)
    }

    // Player knockback impulse if nearby
    if (playerPos) {
      const dist = playerPos.distanceTo(new THREE.Vector3(x, y, z))
      if (dist < 6.0) {
        window.dispatchEvent(new CustomEvent('explosion-knockback', {
          detail: {
            origin: { x, y, z },
            force: Math.max(5, (6.0 - dist) * 4),
            damage: Math.round(Math.max(10, (6.0 - dist) * 10))
          }
        }))
      }
    }
  }

  private spawnDebris(x: number, y: number, z: number, type: BlockType): void {
    const hex = BLOCK_COLORS[type] || 0xffaa00
    const color = new THREE.Color(hex)

    const count = 3
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift()
      }
      this.particles.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          Math.random() * 12 + 2,
          (Math.random() - 0.5) * 14
        ),
        color,
        life: 0,
        maxLife: 1.5 + Math.random() * 1.0,
      })
    }
  }

  public update(delta: number): void {
    if (!this.geometry || this.particles.length === 0) return

    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = this.geometry.attributes.color as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    const col = colAttr.array as Float32Array

    const gravity = -18

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life += delta
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1)
        continue
      }

      p.vel.y += gravity * delta
      p.pos.addScaledVector(p.vel, delta)
    }

    // Rebuild points buffer
    let ptr = 0
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      const alpha = 1.0 - p.life / p.maxLife

      pos[ptr] = p.pos.x
      pos[ptr + 1] = p.pos.y
      pos[ptr + 2] = p.pos.z

      col[ptr] = p.color.r * alpha
      col[ptr + 1] = p.color.g * alpha
      col[ptr + 2] = p.color.b * alpha

      ptr += 3
    }

    // Clear unused slots
    for (let i = ptr; i < this.maxParticles * 3; i++) {
      pos[i] = 0
      pos[i + 1] = -9999
      pos[i + 2] = 0
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  }

  public dispose(): void {
    if (this.scene && this.debrisPoints) {
      this.scene.remove(this.debrisPoints)
    }
    this.particles = []
    this.debrisPoints = null
    this.geometry = null
  }
}

export const explosives = new ExplosivesEngine()
