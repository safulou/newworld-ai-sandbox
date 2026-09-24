import { TimeOfDay } from '@/stores/ui'

export class AtmosphericAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private currentDrone: OscillatorNode | null = null
  private currentGain: GainNode | null = null
  private pulseTimer: any = null

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

  public setMuted(muted: boolean): void {
    this.isMuted = muted
    if (this.currentGain && this.ctx) {
      this.currentGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx.currentTime)
    }
  }

  /**
   * Smoothly crossfades ambient atmospheric soundscapes based on time of day
   */
  public transitionToTimeOfDay(time: TimeOfDay): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Fade out previous drone if active
    if (this.currentGain) {
      this.currentGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
      if (this.currentDrone) {
        this.currentDrone.stop(now + 1.3)
      }
      if (this.pulseTimer) {
        clearTimeout(this.pulseTimer)
        this.pulseTimer = null
      }
    }

    // Configure new drone parameters
    let baseFreq = 65.41 // C2 sub-bass
    let filterFreq = 400
    let waveType: OscillatorType = 'sine'
    let gainTarget = 0.045

    if (time === 'dawn') {
      baseFreq = 130.81 // C3
      filterFreq = 800
      waveType = 'triangle'
      gainTarget = 0.04
      this.scheduleQuantumChirps(ctx, 3)
    } else if (time === 'day') {
      baseFreq = 110 // A2
      filterFreq = 600
      waveType = 'sine'
      gainTarget = 0.035
    } else if (time === 'sunset') {
      baseFreq = 82.41 // E2
      filterFreq = 350
      waveType = 'sawtooth'
      gainTarget = 0.04
    } else {
      // Night: Deep cosmic resonance
      baseFreq = 55 // A1
      filterFreq = 220
      waveType = 'sine'
      gainTarget = 0.05
      this.scheduleQuantumChirps(ctx, 5)
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = waveType
    osc.frequency.setValueAtTime(baseFreq, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(filterFreq, now)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(gainTarget, now + 1.5)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)

    this.currentDrone = osc
    this.currentGain = gain
  }

  private scheduleQuantumChirps(ctx: AudioContext, count: number): void {
    if (typeof window === 'undefined') return

    const playChirp = () => {
      if (this.isMuted) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      const f0 = 1200 + Math.random() * 800
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f0, now)
      osc.frequency.exponentialRampToValueAtTime(f0 * 1.5, now + 0.08)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.11)
    }

    let fired = 0
    const triggerNext = () => {
      if (fired++ < count) {
        playChirp()
        this.pulseTimer = setTimeout(triggerNext, 800 + Math.random() * 1200)
      }
    }

    this.pulseTimer = setTimeout(triggerNext, 600)
  }

  public dispose(): void {
    if (this.currentDrone) {
      try { this.currentDrone.stop() } catch {}
      this.currentDrone = null
    }
    if (this.pulseTimer) {
      clearTimeout(this.pulseTimer)
      this.pulseTimer = null
    }
  }
}

export const atmosphericAudio = new AtmosphericAudioEngine()
