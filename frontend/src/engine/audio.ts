import { BlockType } from '@/types/world'

class SoundEngine {
  private ctx: AudioContext | null = null
  private ambientNode: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private isMuted: boolean = false
  private lastFootstepTime: number = 0

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted
    if (this.ambientGain) {
      this.ambientGain.gain.value = muted ? 0 : 0.04
    }
  }

  // ── Block Place Sound ────────────────────────────────────────────────
  playBlockPlace(type: BlockType = 'stone'): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    // Pitch by material
    let baseFreq = 220
    let wave: OscillatorType = 'triangle'

    switch (type) {
      case 'glass':
      case 'water':
        baseFreq = 880
        wave = 'sine'
        break
      case 'snow':
      case 'leaves':
        baseFreq = 440
        wave = 'sine'
        break
      case 'wood':
      case 'plank':
        baseFreq = 260
        wave = 'triangle'
        break
      case 'brick':
      case 'stone':
        baseFreq = 160
        wave = 'square'
        break
      default:
        baseFreq = 200
        wave = 'triangle'
    }

    osc.type = wave
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.04)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.1)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  }

  // ── Block Break Sound ────────────────────────────────────────────────
  playBlockBreak(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.1)
  }

  // ── Footstep Sound ───────────────────────────────────────────────────
  playFootstep(type: BlockType = 'grass'): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    if (now - this.lastFootstepTime < 0.3) return // rate limit
    this.lastFootstepTime = now

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    let freq = 120
    if (type === 'stone' || type === 'brick') freq = 180
    else if (type === 'wood' || type === 'plank') freq = 150
    else if (type === 'water') freq = 300

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.05)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  // ── Jump Sound ───────────────────────────────────────────────────────
  playJump(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.12)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  // ── Build Complete Fanfare ───────────────────────────────────────────
  playBuildComplete(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const chords = [392.0, 523.25, 659.25, 783.99] // G4, C5, E5, G5
    const now = ctx.currentTime

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const time = now + idx * 0.09

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)

      gain.gain.setValueAtTime(0.1, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(time)
      osc.stop(time + 0.45)
    })
  }

  // ── Ambient Background Synthesizer ──────────────────────────────────
  startAmbience(): void {
    if (this.ambientNode) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      this.ambientNode = ctx.createOscillator()
      this.ambientGain = ctx.createGain()

      this.ambientNode.type = 'sine'
      this.ambientNode.frequency.setValueAtTime(55, ctx.currentTime) // A1 drone

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, ctx.currentTime)

      this.ambientNode.connect(this.ambientGain)
      this.ambientGain.connect(ctx.destination)

      this.ambientNode.start()
    } catch (e) {
      console.warn('Could not start ambient synthesizer', e)
    }
  }

  stopAmbience(): void {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop()
        this.ambientNode.disconnect()
      } catch (e) { /* ignore */ }
      this.ambientNode = null
      this.ambientGain = null
    }
  }
}

export const sound = new SoundEngine()
