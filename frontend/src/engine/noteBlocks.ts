import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { achievements } from './achievements'

export type InstrumentType = 'bell' | 'bass' | 'chip' | 'drum'

export interface NoteParticle {
  sprite: THREE.Sprite
  age: number
  lifetime: number
  vx: number
  vy: number
  vz: number
}

export class NoteBlockEngine {
  private ctx: AudioContext | null = null
  private pitches: Map<string, number> = new Map() // key: "x,y,z" -> pitch (0-24)
  private particles: NoteParticle[] = []
  private scene: THREE.Scene | null = null
  private noteTextures: THREE.Texture[] = []

  constructor() {
    this.loadPitches()
    this.initTextures()
  }

  public init(scene: THREE.Scene): void {
    this.scene = scene
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  private loadPitches(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_note_blocks')
      if (saved) {
        const obj = JSON.parse(saved)
        this.pitches = new Map(Object.entries(obj))
      }
    } catch {
      // ignore
    }
  }

  private savePitches(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const obj = Object.fromEntries(this.pitches.entries())
      localStorage.setItem('nw_note_blocks', JSON.stringify(obj))
    } catch {
      // ignore
    }
  }

  private initTextures(): void {
    if (typeof document === 'undefined') return
    const symbols = ['♪', '♫', '♬']
    for (const sym of symbols) {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 88px monospace, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 12
        ctx.fillText(sym, 64, 64)
      }
      const tex = new THREE.CanvasTexture(canvas)
      this.noteTextures.push(tex)
    }
  }

  public getPitch(x: number, y: number, z: number): number {
    return this.pitches.get(`${x},${y},${z}`) ?? 0
  }

  public setPitch(x: number, y: number, z: number, pitch: number): void {
    this.pitches.set(`${x},${y},${z}`, ((pitch % 25) + 25) % 25)
    this.savePitches()
  }

  /**
   * Determine instrument type by the block underneath the note block
   */
  public getInstrument(x: number, y: number, z: number, world?: any): InstrumentType {
    if (!world || !world.getBlock) return 'bell'
    const belowType: BlockType = world.getBlock(x, y - 1, z)
    if (belowType === 'wood' || belowType === 'plank') return 'bass'
    if (belowType === 'matrix_grid' || belowType === 'cyber_plating' || belowType === 'wire_on') return 'chip'
    if (belowType === 'stone' || belowType === 'dirt' || belowType === 'basalt' || belowType === 'concrete') return 'drum'
    return 'bell'
  }

  /**
   * Right-click tunes the pitch upward by 1 semitone (0-24) and plays preview
   */
  public tune(x: number, y: number, z: number, world?: any, scene?: THREE.Scene): number {
    const current = this.getPitch(x, y, z)
    const next = (current + 1) % 25
    this.setPitch(x, y, z, next)
    this.trigger(x, y, z, world, scene)
    return next
  }

  /**
   * Plays the procedural note and spawns 3D floating neon note particles
   */
  public trigger(x: number, y: number, z: number, world?: any, scene?: THREE.Scene): void {
    const pitch = this.getPitch(x, y, z)
    const instrument = this.getInstrument(x, y, z, world)
    this.playTone(pitch, instrument)
    this.spawnParticle(x, y, z, pitch, scene || this.scene)

    achievements.unlock('note_sequencer')
  }

  /**
   * Synthesize instrument waveform tone
   */
  public playTone(pitch: number, instrument: InstrumentType = 'bell'): void {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // C3 = 130.81Hz, 2 octaves (24 semitones) up to C5 = 523.25Hz
    const baseFreq = 130.81
    const freq = baseFreq * Math.pow(2, pitch / 12)

    if (instrument === 'drum') {
      // Cyber kick / snare combo
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq * 1.5, now)
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)
      return
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (instrument === 'bass') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq * 0.5, now) // 1 octave lower for deep bass

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, now)
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.3)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.38)
    } else if (instrument === 'chip') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.28)
    } else {
      // Bell / Crystal chime (Sine with slight overtone)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.5)
    }
  }

  /**
   * Spawn a floating 3D neon musical note billboard sprite
   */
  private spawnParticle(x: number, y: number, z: number, pitch: number, scene?: THREE.Scene | null): void {
    const sc = scene || this.scene
    if (!sc || this.noteTextures.length === 0) return

    const texIndex = Math.floor(Math.random() * this.noteTextures.length)
    const hue = (pitch / 24) * 320 // 0 (red) -> 320 (violet/pink)
    const color = new THREE.Color(`hsl(${hue}, 100%, 65%)`)

    const mat = new THREE.SpriteMaterial({
      map: this.noteTextures[texIndex],
      color,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const sprite = new THREE.Sprite(mat)
    sprite.position.set(x + 0.5, y + 1.2, z + 0.5)
    sprite.scale.set(0.65, 0.65, 0.65)

    sc.add(sprite)

    this.particles.push({
      sprite,
      age: 0,
      lifetime: 1.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 1.2 + Math.random() * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
    })
  }

  /**
   * Per-frame animation for floating note particles
   */
  public update(delta: number): void {
    if (this.particles.length === 0) return

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.age += delta
      if (p.age >= p.lifetime) {
        if (p.sprite.parent) {
          p.sprite.parent.remove(p.sprite)
        }
        p.sprite.material.dispose()
        this.particles.splice(i, 1)
        continue
      }

      const progress = p.age / p.lifetime
      p.sprite.position.x += p.vx * delta
      p.sprite.position.y += p.vy * delta
      p.sprite.position.z += p.vz * delta

      // Scale bounce and fade
      const scale = 0.65 + Math.sin(progress * Math.PI) * 0.2
      p.sprite.scale.set(scale, scale, scale)
      p.sprite.material.opacity = (1 - progress) * 0.95
    }
  }

  public dispose(): void {
    for (const p of this.particles) {
      if (p.sprite.parent) {
        p.sprite.parent.remove(p.sprite)
      }
      p.sprite.material.dispose()
    }
    this.particles = []
    this.scene = null
  }
}

export const noteBlocks = new NoteBlockEngine()
