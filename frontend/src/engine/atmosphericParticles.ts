import * as THREE from 'three'
import { TimeOfDay } from '@/stores/ui'

export class AtmosphericParticlesEngine {
  private scene: THREE.Scene | null = null
  private particles: THREE.Points | null = null
  private positions: Float32Array | null = null
  private colors: Float32Array | null = null
  private count: number = 500
  private boxSize: number = 45
  private animTime: number = 0

  public init(scene: THREE.Scene): void {
    this.scene = scene
    const geo = new THREE.BufferGeometry()
    this.positions = new Float32Array(this.count * 3)
    this.colors = new Float32Array(this.count * 3)

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      this.positions[idx] = (Math.random() - 0.5) * this.boxSize
      this.positions[idx + 1] = Math.random() * (this.boxSize * 0.6)
      this.positions[idx + 2] = (Math.random() - 0.5) * this.boxSize

      // Default night cyan/magenta motes
      const isCyan = Math.random() > 0.4
      this.colors[idx] = isCyan ? 0.0 : 1.0
      this.colors[idx + 1] = isCyan ? 0.94 : 0.2
      this.colors[idx + 2] = 1.0
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.particles = new THREE.Points(geo, mat)
    this.scene.add(this.particles)
  }

  public setTimeOfDay(time: TimeOfDay): void {
    if (!this.colors || !this.particles) return

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      if (time === 'night') {
        const isCyan = Math.random() > 0.4
        this.colors[idx] = isCyan ? 0.0 : 0.8
        this.colors[idx + 1] = isCyan ? 0.9 : 0.1
        this.colors[idx + 2] = 1.0
      } else if (time === 'sunset') {
        this.colors[idx] = 1.0
        this.colors[idx + 1] = 0.45 + Math.random() * 0.2
        this.colors[idx + 2] = 0.1
      } else if (time === 'dawn') {
        this.colors[idx] = 0.9
        this.colors[idx + 1] = 0.7
        this.colors[idx + 2] = 0.95
      } else {
        // Day
        this.colors[idx] = 1.0
        this.colors[idx + 1] = 0.95
        this.colors[idx + 2] = 0.8
      }
    }

    const colorAttr = this.particles.geometry.getAttribute('color')
    if (colorAttr) {
      colorAttr.needsUpdate = true
    }

    const mat = this.particles.material as THREE.PointsMaterial
    mat.opacity = time === 'night' ? 0.85 : 0.45
  }

  public update(delta: number, cameraPos: THREE.Vector3): void {
    if (!this.particles || !this.positions) return

    this.animTime += delta * 0.8
    const halfBox = this.boxSize / 2
    const heightBox = this.boxSize * 0.6

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3

      // Gentle floating sine motion
      this.positions[idx] += Math.sin(this.animTime + i) * 0.02
      this.positions[idx + 1] += Math.cos(this.animTime * 0.5 + i) * 0.015 - 0.005
      this.positions[idx + 2] += Math.cos(this.animTime + i) * 0.02

      // Wrap around camera volume
      if (this.positions[idx] - cameraPos.x > halfBox) this.positions[idx] -= this.boxSize
      if (this.positions[idx] - cameraPos.x < -halfBox) this.positions[idx] += this.boxSize

      if (this.positions[idx + 1] - cameraPos.y > heightBox) this.positions[idx + 1] -= heightBox
      if (this.positions[idx + 1] - cameraPos.y < -5) this.positions[idx + 1] += heightBox

      if (this.positions[idx + 2] - cameraPos.z > halfBox) this.positions[idx + 2] -= this.boxSize
      if (this.positions[idx + 2] - cameraPos.z < -halfBox) this.positions[idx + 2] += this.boxSize
    }

    const posAttr = this.particles.geometry.getAttribute('position')
    if (posAttr) {
      posAttr.needsUpdate = true
    }
  }

  public dispose(): void {
    if (this.scene && this.particles) {
      this.scene.remove(this.particles)
      this.particles.geometry.dispose()
      ;(this.particles.material as THREE.Material).dispose()
      this.particles = null
    }
    this.positions = null
    this.colors = null
    this.scene = null
  }
}

export const atmosphericParticles = new AtmosphericParticlesEngine()
