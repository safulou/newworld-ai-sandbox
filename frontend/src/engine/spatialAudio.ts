import * as THREE from 'three'

/**
 * Spatial Audio & Positional Sound Engine using Web Audio API
 */
export class SpatialAudioEngine {
  private audioCtx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private listenerPos: THREE.Vector3 = new THREE.Vector3()

  public init(): void {
    if (this.audioCtx) return
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    this.audioCtx = new AudioContextClass()
    this.masterGain = this.audioCtx.createGain()
    this.masterGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime)
    this.masterGain.connect(this.audioCtx.destination)

    this.ambientGain = this.audioCtx.createGain()
    this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime)
    this.ambientGain.connect(this.masterGain)
  }

  public updateListenerPosition(pos: THREE.Vector3): void {
    this.listenerPos.copy(pos)
    if (this.audioCtx && this.audioCtx.listener) {
      if (this.audioCtx.listener.positionX) {
        this.audioCtx.listener.positionX.setValueAtTime(pos.x, this.audioCtx.currentTime)
        this.audioCtx.listener.positionY.setValueAtTime(pos.y, this.audioCtx.currentTime)
        this.audioCtx.listener.positionZ.setValueAtTime(pos.z, this.audioCtx.currentTime)
      } else {
        this.audioCtx.listener.setPosition(pos.x, pos.y, pos.z)
      }
    }
  }

  /**
   * Plays a 3D localized sound at specific world coordinates
   */
  public play3DSound(
    worldPos: { x: number; y: number; z: number },
    frequency: number = 440,
    type: OscillatorType = 'sine',
    durationSec: number = 0.4
  ): void {
    if (!this.audioCtx || !this.masterGain) return

    // Calculate distance attenuation
    const dx = worldPos.x - this.listenerPos.x
    const dy = worldPos.y - this.listenerPos.y
    const dz = worldPos.z - this.listenerPos.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (dist > 50) return // Out of hearing range

    // Volume drops inversely with distance
    const volume = Math.max(0.01, 1 / (1 + dist * 0.15))
    // Stereo panning based on X relative to listener
    const pan = Math.max(-1, Math.min(1, dx / 20))

    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()
    const panner = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null

    osc.type = type
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime)

    gain.gain.setValueAtTime(volume * 0.4, this.audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + durationSec)

    if (panner) {
      panner.pan.setValueAtTime(pan, this.audioCtx.currentTime)
      osc.connect(gain)
      gain.connect(panner)
      panner.connect(this.masterGain)
    } else {
      osc.connect(gain)
      gain.connect(this.masterGain)
    }

    osc.start()
    osc.stop(this.audioCtx.currentTime + durationSec)
  }

  /**
   * Plays electric cyber pulse sound
   */
  public playCyberPulse(pos: { x: number; y: number; z: number }): void {
    this.play3DSound(pos, 880, 'sawtooth', 0.25)
  }

  /**
   * Plays quantum warp whoosh sound
   */
  public playQuantumWarp(pos: { x: number; y: number; z: number }): void {
    this.play3DSound(pos, 220, 'sine', 0.8)
  }
}

export const spatialAudio = new SpatialAudioEngine()
