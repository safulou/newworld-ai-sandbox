import * as THREE from 'three'
import { spatialAudio } from './spatialAudio'

export type WeatherType = 'clear' | 'neon_rain' | 'snow' | 'thunderstorm' | 'sandstorm'

export interface WeatherInfo {
  id: WeatherType
  name: string
  icon: string
  color: number
  description: string
}

export const WEATHER_ROSTER: Record<WeatherType, WeatherInfo> = {
  clear: { id: 'clear', name: '晴朗星空', icon: '☀️', color: 0x00ffff, description: '量子雲層消散，能見度極佳' },
  neon_rain: { id: 'neon_rain', name: '霓虹酸雨', icon: '🌧️', color: 0x00ffff, description: '帶有霓虹光譜的輕度電離雨' },
  snow: { id: 'snow', name: '量子微雪', icon: '❄️', color: 0xffffff, description: '零下低溫凝結的體素結晶' },
  thunderstorm: { id: 'thunderstorm', name: '高能雷暴', icon: '⚡', color: 0xff00ff, description: '強烈電漿放電與滾滾雷鳴' },
  sandstorm: { id: 'sandstorm', name: '賽博沙暴', icon: '🌪️', color: 0xffaa00, description: '高密度磁性微粒風暴' },
}

export class WeatherEngine {
  private scene: THREE.Scene | null = null
  private currentWeather: WeatherType = 'clear'
  private rainParticles: THREE.Points | null = null
  private snowParticles: THREE.Points | null = null
  private sandParticles: THREE.Points | null = null

  // Lightning effect state
  private lightningTimer: number = 0
  private isFlashing: boolean = false
  private originalBgColor: THREE.Color = new THREE.Color()

  // Audio nodes for procedural weather sound
  private ambientNoiseSource: AudioBufferSourceNode | null = null
  private rainGain: GainNode | null = null
  private windGain: GainNode | null = null
  private audioInitialized: boolean = false

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.originalBgColor.copy((this.scene.background as THREE.Color) || new THREE.Color(0x060714))

    this.createRainSystem()
    this.createSnowSystem()
    this.createSandSystem()
    this.initProceduralAudio()
  }

  private createRainSystem(): void {
    if (!this.scene) return
    const count = 1800
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 120
      pos[i + 1] = Math.random() * 60 + 5
      pos[i + 2] = (Math.random() - 0.5) * 120
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })

    this.rainParticles = new THREE.Points(geo, mat)
    this.rainParticles.visible = false
    this.scene.add(this.rainParticles)
  }

  private createSnowSystem(): void {
    if (!this.scene) return
    const count = 1000
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 120
      pos[i + 1] = Math.random() * 50 + 5
      pos[i + 2] = (Math.random() - 0.5) * 120
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.65,
      transparent: true,
      opacity: 0.85,
    })

    this.snowParticles = new THREE.Points(geo, mat)
    this.snowParticles.visible = false
    this.scene.add(this.snowParticles)
  }

  private createSandSystem(): void {
    if (!this.scene) return
    const count = 1200
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 100
      pos[i + 1] = Math.random() * 25 + 2
      pos[i + 2] = (Math.random() - 0.5) * 100
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xffaa33,
      size: 0.55,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    this.sandParticles = new THREE.Points(geo, mat)
    this.sandParticles.visible = false
    this.scene.add(this.sandParticles)
  }

  private initProceduralAudio(): void {
    if (this.audioInitialized) return
    const ctx = spatialAudio.getAudioContext()
    if (!ctx) return

    try {
      // Create white noise buffer for rain and wind simulation
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      this.ambientNoiseSource = ctx.createBufferSource()
      this.ambientNoiseSource.buffer = noiseBuffer
      this.ambientNoiseSource.loop = true

      // Rain filter (lowpass filter for gentle rain patter)
      const rainFilter = ctx.createBiquadFilter()
      rainFilter.type = 'lowpass'
      rainFilter.frequency.setValueAtTime(1000, ctx.currentTime)

      this.rainGain = ctx.createGain()
      this.rainGain.gain.setValueAtTime(0, ctx.currentTime)

      // Wind filter (bandpass filter for howling breeze)
      const windFilter = ctx.createBiquadFilter()
      windFilter.type = 'bandpass'
      windFilter.frequency.setValueAtTime(450, ctx.currentTime)
      windFilter.Q.setValueAtTime(3.0, ctx.currentTime)

      this.windGain = ctx.createGain()
      this.windGain.gain.setValueAtTime(0, ctx.currentTime)

      this.ambientNoiseSource.connect(rainFilter)
      rainFilter.connect(this.rainGain)
      this.rainGain.connect(ctx.destination)

      this.ambientNoiseSource.connect(windFilter)
      windFilter.connect(this.windGain)
      this.windGain.connect(ctx.destination)

      this.ambientNoiseSource.start()
      this.audioInitialized = true
    } catch {
      // Audio autoplay may be suspended until interaction
    }
  }

  public getWeather(): WeatherType {
    return this.currentWeather
  }

  public setWeather(type: WeatherType): void {
    this.currentWeather = type
    if (!this.audioInitialized) this.initProceduralAudio()

    if (this.rainParticles) {
      this.rainParticles.visible = type === 'neon_rain' || type === 'thunderstorm'
      const mat = this.rainParticles.material as THREE.PointsMaterial
      mat.color.setHex(type === 'thunderstorm' ? 0xff00ff : 0x00ffff)
    }

    if (this.snowParticles) {
      this.snowParticles.visible = type === 'snow'
    }

    if (this.sandParticles) {
      this.sandParticles.visible = type === 'sandstorm'
    }

    // Adjust sound gains
    const ctx = spatialAudio.getAudioContext()
    if (ctx && this.rainGain && this.windGain) {
      const now = ctx.currentTime
      if (type === 'neon_rain') {
        this.rainGain.gain.linearRampToValueAtTime(0.08, now + 1.0)
        this.windGain.gain.linearRampToValueAtTime(0.02, now + 1.0)
      } else if (type === 'thunderstorm') {
        this.rainGain.gain.linearRampToValueAtTime(0.15, now + 1.0)
        this.windGain.gain.linearRampToValueAtTime(0.06, now + 1.0)
      } else if (type === 'sandstorm') {
        this.rainGain.gain.linearRampToValueAtTime(0, now + 1.0)
        this.windGain.gain.linearRampToValueAtTime(0.12, now + 1.0)
      } else if (type === 'snow') {
        this.rainGain.gain.linearRampToValueAtTime(0, now + 1.0)
        this.windGain.gain.linearRampToValueAtTime(0.04, now + 1.0)
      } else {
        this.rainGain.gain.linearRampToValueAtTime(0, now + 1.0)
        this.windGain.gain.linearRampToValueAtTime(0.01, now + 1.0)
      }
    }
  }

  public cycleWeather(): WeatherType {
    const list: WeatherType[] = ['clear', 'neon_rain', 'thunderstorm', 'snow', 'sandstorm']
    const nextIdx = (list.indexOf(this.currentWeather) + 1) % list.length
    this.setWeather(list[nextIdx])
    return this.currentWeather
  }

  public isLightningActive(): boolean {
    return this.isFlashing
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (this.currentWeather === 'clear') return

    // 1. Update Rain / Thunderstorm
    if ((this.currentWeather === 'neon_rain' || this.currentWeather === 'thunderstorm') && this.rainParticles) {
      const pos = this.rainParticles.geometry.attributes.position.array as Float32Array
      const speed = this.currentWeather === 'thunderstorm' ? 75 : 55

      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= speed * delta
        if (pos[i] < playerPos.y - 10) {
          pos[i] = playerPos.y + 45 + Math.random() * 15
          pos[i - 1] = playerPos.x + (Math.random() - 0.5) * 100
          pos[i + 1] = playerPos.z + (Math.random() - 0.5) * 100
        }
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true
    }

    // 2. Update Snow
    if (this.currentWeather === 'snow' && this.snowParticles) {
      const pos = this.snowParticles.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 12 * delta
        pos[i - 1] += Math.sin(pos[i] * 0.1) * 2.5 * delta
        if (pos[i] < playerPos.y - 10) {
          pos[i] = playerPos.y + 40 + Math.random() * 10
          pos[i - 1] = playerPos.x + (Math.random() - 0.5) * 100
          pos[i + 1] = playerPos.z + (Math.random() - 0.5) * 100
        }
      }
      this.snowParticles.geometry.attributes.position.needsUpdate = true
    }

    // 3. Update Sandstorm
    if (this.currentWeather === 'sandstorm' && this.sandParticles) {
      const pos = this.sandParticles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += 40 * delta // horizontal drift
        pos[i + 1] += (Math.random() - 0.5) * 5 * delta
        if (pos[i] > playerPos.x + 50) {
          pos[i] = playerPos.x - 50
          pos[i + 1] = playerPos.y + Math.random() * 20
          pos[i + 2] = playerPos.z + (Math.random() - 0.5) * 80
        }
      }
      this.sandParticles.geometry.attributes.position.needsUpdate = true
    }

    // 4. Quantum Lightning simulation during Thunderstorm
    if (this.currentWeather === 'thunderstorm' && this.scene) {
      this.lightningTimer -= delta
      if (this.lightningTimer <= 0) {
        // Trigger lightning flash
        this.triggerLightningFlash()
        this.lightningTimer = 4.0 + Math.random() * 6.0
      }
    }
  }

  private triggerLightningFlash(): void {
    if (!this.scene) return
    const sky = this.scene.background as THREE.Color
    if (!sky) return

    this.isFlashing = true
    sky.setHex(0xe0ffff) // Bright flash
    if (this.scene.fog) {
      this.scene.fog.color.setHex(0xe0ffff)
    }

    // Play procedural thunder clap
    this.playThunderSound()

    setTimeout(() => {
      if (this.scene) {
        const bg = this.scene.background as THREE.Color
        if (bg) bg.copy(this.originalBgColor)
        if (this.scene.fog) this.scene.fog.color.copy(this.originalBgColor)
      }
      this.isFlashing = false
    }, 120)
  }

  private playThunderSound(): void {
    const ctx = spatialAudio.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.5)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(250, now)
    filter.frequency.exponentialRampToValueAtTime(60, now + 1.5)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 1.8)
  }

  public dispose(): void {
    if (this.scene) {
      if (this.rainParticles) this.scene.remove(this.rainParticles)
      if (this.snowParticles) this.scene.remove(this.snowParticles)
      if (this.sandParticles) this.scene.remove(this.sandParticles)
    }
    if (this.ambientNoiseSource) {
      try { this.ambientNoiseSource.stop() } catch { /* ignore */ }
    }
  }
}

export const weather = new WeatherEngine()
