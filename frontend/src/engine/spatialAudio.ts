import * as THREE from 'three'

export interface SpatialVoiceNodeController {
  sourceNode: MediaStreamAudioSourceNode
  pannerNode: PannerNode
  gainNode: GainNode
  analyserNode: AnalyserNode
  updatePosition: (pos: { x: number; y: number; z: number }) => void
  setVolume: (vol: number) => void
  getAudioLevel: () => number
  dispose: () => void
}

/**
 * Spatial Audio & Positional Sound Engine using Web Audio API
 * Supports 3D HRTF Panning, WebRTC Voice Streams & Distance Attenuation
 */
export class SpatialAudioEngine {
  private audioCtx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private voiceMasterGain: GainNode | null = null
  private listenerPos: THREE.Vector3 = new THREE.Vector3()
  private voiceVolume: number = 1.0

  public init(): void {
    if (this.audioCtx) return
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    this.audioCtx = new AudioContextClass()

    // Master bus
    this.masterGain = this.audioCtx.createGain()
    this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime)
    this.masterGain.connect(this.audioCtx.destination)

    // Ambient submix
    this.ambientGain = this.audioCtx.createGain()
    this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime)
    this.ambientGain.connect(this.masterGain)

    // WebRTC Voice submix
    this.voiceMasterGain = this.audioCtx.createGain()
    this.voiceMasterGain.gain.setValueAtTime(this.voiceVolume, this.audioCtx.currentTime)
    this.voiceMasterGain.connect(this.masterGain)
  }

  public async resumeContext(): Promise<void> {
    if (!this.audioCtx) this.init()
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume()
      } catch (e) {
        console.warn('[SpatialAudio] AudioContext resume error:', e)
      }
    }
  }

  public getAudioContext(): AudioContext | null {
    if (!this.audioCtx) this.init()
    return this.audioCtx
  }

  public getVoiceMasterGain(): GainNode | null {
    return this.voiceMasterGain
  }

  public setVoiceMasterVolume(volume: number): void {
    this.voiceVolume = Math.max(0, Math.min(2.0, volume))
    if (this.audioCtx && this.voiceMasterGain) {
      this.voiceMasterGain.gain.setValueAtTime(this.voiceVolume, this.audioCtx.currentTime)
    }
  }

  public getVoiceMasterVolume(): number {
    return this.voiceVolume
  }

  public updateListenerPosition(pos: THREE.Vector3): void {
    this.updateListener(pos)
  }

  /**
   * Updates 3D listener position and orientation vectors (Forward & Up)
   */
  public updateListener(
    pos: THREE.Vector3,
    forward?: THREE.Vector3,
    up?: THREE.Vector3
  ): void {
    this.listenerPos.copy(pos)
    if (!this.audioCtx || !this.audioCtx.listener) return

    const listener = this.audioCtx.listener
    const t = this.audioCtx.currentTime

    // Position
    if (listener.positionX) {
      listener.positionX.setValueAtTime(pos.x, t)
      listener.positionY.setValueAtTime(pos.y, t)
      listener.positionZ.setValueAtTime(pos.z, t)
    } else {
      listener.setPosition(pos.x, pos.y, pos.z)
    }

    // Orientation (if provided)
    if (forward && up) {
      if (listener.forwardX) {
        listener.forwardX.setValueAtTime(forward.x, t)
        listener.forwardY.setValueAtTime(forward.y, t)
        listener.forwardZ.setValueAtTime(forward.z, t)
        listener.upX.setValueAtTime(up.x, t)
        listener.upY.setValueAtTime(up.y, t)
        listener.upZ.setValueAtTime(up.z, t)
      } else {
        listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z)
      }
    }
  }

  /**
   * Creates a high-fidelity 3D Spatial Audio Node pipeline for a WebRTC MediaStream
   */
  public createSpatialVoiceNode(
    stream: MediaStream,
    initialPos: { x: number; y: number; z: number }
  ): SpatialVoiceNodeController | null {
    this.init()
    if (!this.audioCtx || !this.voiceMasterGain) return null

    try {
      const sourceNode = this.audioCtx.createMediaStreamSource(stream)

      // Dynamic Voice Activity Analyser (for VAD & speech meter)
      const analyserNode = this.audioCtx.createAnalyser()
      analyserNode.fftSize = 64
      analyserNode.smoothingTimeConstant = 0.4

      // Individual Peer Gain
      const gainNode = this.audioCtx.createGain()
      gainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime)

      // 3D Panner Node (HRTF binaural spatialization)
      const pannerNode = this.audioCtx.createPanner()
      pannerNode.panningModel = 'HRTF'
      pannerNode.distanceModel = 'inverse'
      pannerNode.refDistance = 2.0 // Full volume within 2m
      pannerNode.maxDistance = 60.0 // Cutoff beyond 60m
      pannerNode.rolloffFactor = 1.2
      pannerNode.coneInnerAngle = 360
      pannerNode.coneOuterAngle = 360
      pannerNode.coneOuterGain = 0

      // Initial position
      if (pannerNode.positionX) {
        pannerNode.positionX.setValueAtTime(initialPos.x, this.audioCtx.currentTime)
        pannerNode.positionY.setValueAtTime(initialPos.y, this.audioCtx.currentTime)
        pannerNode.positionZ.setValueAtTime(initialPos.z, this.audioCtx.currentTime)
      } else {
        pannerNode.setPosition(initialPos.x, initialPos.y, initialPos.z)
      }

      // Graph: Source -> Analyser -> Peer Gain -> 3D Panner -> Voice Master -> Master
      sourceNode.connect(analyserNode)
      analyserNode.connect(gainNode)
      gainNode.connect(pannerNode)
      pannerNode.connect(this.voiceMasterGain)

      const timeDomainBuffer = new Uint8Array(analyserNode.fftSize)

      const controller: SpatialVoiceNodeController = {
        sourceNode,
        pannerNode,
        gainNode,
        analyserNode,
        updatePosition: (pos: { x: number; y: number; z: number }) => {
          if (!this.audioCtx) return
          const now = this.audioCtx.currentTime
          if (pannerNode.positionX) {
            pannerNode.positionX.setValueAtTime(pos.x, now)
            pannerNode.positionY.setValueAtTime(pos.y, now)
            pannerNode.positionZ.setValueAtTime(pos.z, now)
          } else {
            pannerNode.setPosition(pos.x, pos.y, pos.z)
          }
        },
        setVolume: (vol: number) => {
          if (!this.audioCtx) return
          gainNode.gain.setValueAtTime(Math.max(0, Math.min(2.0, vol)), this.audioCtx.currentTime)
        },
        getAudioLevel: (): number => {
          analyserNode.getByteTimeDomainData(timeDomainBuffer)
          let sumSquares = 0
          for (let i = 0; i < timeDomainBuffer.length; i++) {
            const normalized = (timeDomainBuffer[i] - 128) / 128
            sumSquares += normalized * normalized
          }
          const rms = Math.sqrt(sumSquares / timeDomainBuffer.length)
          return Math.min(100, Math.round(rms * 250))
        },
        dispose: () => {
          try {
            sourceNode.disconnect()
            analyserNode.disconnect()
            gainNode.disconnect()
            pannerNode.disconnect()
          } catch (err) {
            // Ignore disconnect errors on teardown
          }
        }
      }

      return controller
    } catch (e) {
      console.error('[SpatialAudio] Failed to create spatial voice node:', e)
      return null
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

    if (dist > 60) return // Out of hearing range

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
   * Emits a simulated 3D spatial voice / radio broadcast beep for audio testing
   */
  public createSyntheticBeaconSound(
    pos: { x: number; y: number; z: number },
    type: 'cyber_pulse' | 'voice_blip' | 'radio_ping' = 'cyber_pulse'
  ): void {
    if (type === 'cyber_pulse') {
      this.play3DSound(pos, 580, 'sawtooth', 0.2)
      setTimeout(() => this.play3DSound(pos, 880, 'sine', 0.25), 100)
    } else if (type === 'voice_blip') {
      this.play3DSound(pos, 440, 'triangle', 0.15)
      setTimeout(() => this.play3DSound(pos, 660, 'triangle', 0.15), 120)
      setTimeout(() => this.play3DSound(pos, 520, 'sine', 0.3), 240)
    } else {
      this.play3DSound(pos, 320, 'sine', 0.5)
    }
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
