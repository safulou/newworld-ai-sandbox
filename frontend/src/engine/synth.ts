/**
 * Procedural Lo-Fi Ambient Music Synthesizer
 * Generates endless relaxing atmospheric chord progressions using Web Audio API
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null
  private isPlaying: boolean = false
  private masterGain: GainNode | null = null
  private timer: number | null = null

  // Minor / Cyber chord progressions (C minor, Ab major, Eb major, Bb major)
  private chords = [
    [130.81, 155.56, 196.00, 246.94], // C3, Eb3, G3, B3 (Cm7)
    [103.83, 130.81, 155.56, 207.65], // Ab2, C3, Eb3, Ab3 (Abmaj7)
    [155.56, 196.00, 233.08, 293.66], // Eb3, G3, Bb3, D4 (Ebmaj7)
    [116.54, 146.83, 174.61, 233.08], // Bb2, D3, F3, Bb3 (Bb)
  ]
  private chordIdx = 0

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

  public start(): void {
    if (this.isPlaying) return
    const ctx = this.getContext()
    if (!ctx) return

    this.isPlaying = true
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.04, ctx.currentTime)
    this.masterGain.connect(ctx.destination)

    this.playNextChord()
  }

  private playNextChord(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime
    const chord = this.chords[this.chordIdx]
    this.chordIdx = (this.chordIdx + 1) % this.chords.length

    // Filter for warm lo-fi tape sound
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, now)

    const chordGain = this.ctx.createGain()
    chordGain.gain.setValueAtTime(0.001, now)
    chordGain.gain.exponentialRampToValueAtTime(0.06, now + 1.8) // slow attack
    chordGain.gain.exponentialRampToValueAtTime(0.001, now + 5.8) // slow release

    chord.forEach(freq => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      // Slight detune for analog warmth
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now)

      osc.connect(filter)
      osc.start(now)
      osc.stop(now + 6.0)
    })

    filter.connect(chordGain)
    chordGain.connect(this.masterGain)

    // Schedule next chord
    this.timer = window.setTimeout(() => {
      this.playNextChord()
    }, 5500)
  }

  public stop(): void {
    this.isPlaying = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.masterGain) {
      this.masterGain.disconnect()
      this.masterGain = null
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop()
      return false
    } else {
      this.start()
      return true
    }
  }
}

export const ambientSynth = new AmbientSynth()
