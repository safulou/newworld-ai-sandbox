import * as THREE from 'three'

interface DebrisParticle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  rotSpeed: THREE.Vector3
  life: number
  maxLife: number
}

export class ParticleEngine {
  private scene: THREE.Scene
  private debris: DebrisParticle[] = []
  private debrisGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18)

  // Weather particles
  private rainPoints: THREE.Points | null = null
  private snowPoints: THREE.Points | null = null
  private weatherType: 'clear' | 'rain' | 'snow' = 'clear'

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.initWeather()
  }

  // ── Block Break Debris Burst ──────────────────────────────────────────
  burstDebris(pos: { x: number; y: number; z: number }, colorHex: number, count: number = 12): void {
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
    })

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.debrisGeo, mat)
      mesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.6,
        pos.y + (Math.random() - 0.5) * 0.6,
        pos.z + (Math.random() - 0.5) * 0.6
      )

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 6
      )

      const rotSpeed = new THREE.Vector3(
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10
      )

      this.scene.add(mesh)
      this.debris.push({
        mesh,
        velocity,
        rotSpeed,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      })
    }
  }

  // ── Weather Particles ────────────────────────────────────────────────
  private initWeather(): void {
    // Rain
    const rainCount = 1200
    const rainGeo = new THREE.BufferGeometry()
    const rainPos = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPos[i] = (Math.random() - 0.5) * 100
      rainPos[i + 1] = Math.random() * 60 + 5
      rainPos[i + 2] = (Math.random() - 0.5) * 100
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3))
    const rainMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.4,
      transparent: true,
      opacity: 0.7,
    })
    this.rainPoints = new THREE.Points(rainGeo, rainMat)
    this.rainPoints.visible = false
    this.scene.add(this.rainPoints)

    // Snow
    const snowCount = 800
    const snowGeo = new THREE.BufferGeometry()
    const snowPos = new Float32Array(snowCount * 3)
    for (let i = 0; i < snowCount * 3; i += 3) {
      snowPos[i] = (Math.random() - 0.5) * 100
      snowPos[i + 1] = Math.random() * 50 + 5
      snowPos[i + 2] = (Math.random() - 0.5) * 100
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
    })
    this.snowPoints = new THREE.Points(snowGeo, snowMat)
    this.snowPoints.visible = false
    this.scene.add(this.snowPoints)
  }

  setWeather(type: 'clear' | 'rain' | 'snow'): void {
    this.weatherType = type
    if (this.rainPoints) this.rainPoints.visible = type === 'rain'
    if (this.snowPoints) this.snowPoints.visible = type === 'snow'
  }

  // ── Particle Animation Loop ──────────────────────────────────────────
  update(delta: number, playerPos?: { x: number; y: number; z: number }): void {
    // 1. Update Debris
    const gravity = -18
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const p = this.debris[i]
      p.life += delta

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh)
        p.mesh.geometry.dispose()
        this.debris.splice(i, 1)
        continue
      }

      p.velocity.y += gravity * delta
      p.mesh.position.addScaledVector(p.velocity, delta)
      p.mesh.rotation.x += p.rotSpeed.x * delta
      p.mesh.rotation.y += p.rotSpeed.y * delta

      const scale = 1 - p.life / p.maxLife
      p.mesh.scale.set(scale, scale, scale)
    }

    // 2. Update Weather
    if (this.weatherType === 'rain' && this.rainPoints) {
      const positions = this.rainPoints.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 45 * delta
        if (positions[i] < 0) {
          positions[i] = 60
          if (playerPos) {
            positions[i - 1] = playerPos.x + (Math.random() - 0.5) * 80
            positions[i + 1] = playerPos.z + (Math.random() - 0.5) * 80
          }
        }
      }
      this.rainPoints.geometry.attributes.position.needsUpdate = true
    } else if (this.weatherType === 'snow' && this.snowPoints) {
      const positions = this.snowPoints.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 10 * delta
        positions[i - 1] += Math.sin(positions[i] * 0.1) * 2 * delta
        if (positions[i] < 0) {
          positions[i] = 50
          if (playerPos) {
            positions[i - 1] = playerPos.x + (Math.random() - 0.5) * 80
            positions[i + 1] = playerPos.z + (Math.random() - 0.5) * 80
          }
        }
      }
      this.snowPoints.geometry.attributes.position.needsUpdate = true
    }
  }
}
