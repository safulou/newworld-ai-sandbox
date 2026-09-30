import * as THREE from 'three'
import { achievements } from './achievements'

export interface AcousticState {
  isUnderwater: boolean
  isInsideCabin: boolean
  isInsideEnclosedRoom: boolean
  currentRealm: string
  lowpassCutoff: number // Hz
  reverbIntensity: number // 0 to 1
  occlusionDb: number // -24 to 0 dB
}

export class AcousticEnvironmentEngine {
  public state: AcousticState = {
    isUnderwater: false,
    isInsideCabin: false,
    isInsideEnclosedRoom: false,
    currentRealm: 'neon_city',
    lowpassCutoff: 20000,
    reverbIntensity: 0.2,
    occlusionDb: 0,
  }

  private ctx: AudioContext | null = null
  private filterNode: BiquadFilterNode | null = null
  private masterGain: GainNode | null = null
  private analyser: AnalyserNode | null = null

  private targetCutoff: number = 20000
  private targetOcclusion: number = 0
  private targetReverb: number = 0.2

  constructor() {
    this.initAudioContext()
  }

  private initAudioContext(): void {
    if (typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.filterNode = this.ctx.createBiquadFilter()
        this.filterNode.type = 'lowpass'
        this.filterNode.frequency.value = 20000
        this.filterNode.Q.value = 1.0

        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = 1.0

        this.analyser = this.ctx.createAnalyser()
        this.analyser.fftSize = 128

        this.filterNode.connect(this.masterGain)
        this.masterGain.connect(this.analyser)
        this.analyser.connect(this.ctx.destination)
      }
    } catch {
      // AudioContext unavailable or autoplay restricted
    }
  }

  public getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      this.initAudioContext()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public setEnvironment(isUnderwater: boolean, isInsideCabin: boolean, realm: string = 'neon_city'): void {
    this.state.isUnderwater = isUnderwater
    this.state.isInsideCabin = isInsideCabin
    this.state.currentRealm = realm

    if (isUnderwater) {
      this.targetCutoff = 320
      this.targetOcclusion = -10
      this.targetReverb = 0.6
      achievements.unlock('sound_sculptor')
    } else if (isInsideCabin) {
      this.targetCutoff = 720
      this.targetOcclusion = -14
      this.targetReverb = 0.15
      achievements.unlock('sound_sculptor')
    } else if (realm === 'core_abyss') {
      this.targetCutoff = 9000
      this.targetOcclusion = -2
      this.targetReverb = 0.85
    } else if (realm === 'void_islands') {
      this.targetCutoff = 18000
      this.targetOcclusion = 0
      this.targetReverb = 0.5
    } else {
      this.targetCutoff = 20000
      this.targetOcclusion = 0
      this.targetReverb = 0.2
    }
  }

  public update(dt: number, _camera?: THREE.Camera, _playerPos?: THREE.Vector3, inFluid?: boolean, isBoarded?: boolean): void {
    if (inFluid !== undefined || isBoarded !== undefined) {
      this.setEnvironment(!!inFluid, !!isBoarded, this.state.currentRealm)
    }

    // Smooth filter interpolation to avoid audio popping
    const lerpFactor = Math.min(1.0, dt * 6.0)
    this.state.lowpassCutoff += (this.targetCutoff - this.state.lowpassCutoff) * lerpFactor
    this.state.occlusionDb += (this.targetOcclusion - this.state.occlusionDb) * lerpFactor
    this.state.reverbIntensity += (this.targetReverb - this.state.reverbIntensity) * lerpFactor

    if (this.filterNode && this.ctx) {
      try {
        this.filterNode.frequency.setValueAtTime(this.state.lowpassCutoff, this.ctx.currentTime)
        const linearGain = Math.pow(10, this.state.occlusionDb / 20)
        if (this.masterGain) {
          this.masterGain.gain.setValueAtTime(linearGain, this.ctx.currentTime)
        }
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Generates a procedural underwater bubble pulse
   */
  public playUnderwaterBubble(): void {
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(160 + Math.random() * 80, now)
    osc.frequency.exponentialRampToValueAtTime(420 + Math.random() * 120, now + 0.12)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(this.filterNode || ctx.destination)

    osc.start(now)
    osc.stop(now + 0.2)
  }

  /**
   * Generates a spatial active sonar ping
   */
  public playSonarPulse(): void {
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1440, now)
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.4)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)

    osc.connect(gain)
    gain.connect(this.filterNode || ctx.destination)

    osc.start(now)
    osc.stop(now + 0.95)
  }

  /**
   * Generates a hyperloop / bunker air conditioning low-frequency hum
   */
  public playCabinVentHum(): void {
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(65, now)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(130, now)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.filterNode || ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 1.25)
    osc2.stop(now + 1.25)
  }

  /**
   * Retrieves live spectrum frequencies for canvas visualizer
   */
  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64)
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(data)
    return data
  }

  /**
   * Retrieves live time-domain oscilloscope wave
   */
  public getTimeDomainData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64)
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(data)
    return data
  }
}

export const acousticEnvironment = new AcousticEnvironmentEngine()
