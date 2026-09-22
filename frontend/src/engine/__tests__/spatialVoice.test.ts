import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import { SpatialAudioEngine } from '../spatialAudio'
import { SpatialVoiceEngine } from '../spatialVoice'

describe('WebRTC Spatial Voice & 3D Audio Engine', () => {
  let audio: SpatialAudioEngine
  let voice: SpatialVoiceEngine

  beforeEach(() => {
    audio = new SpatialAudioEngine()
    voice = new SpatialVoiceEngine()
  })

  it('should initialize with standard default voice settings', () => {
    expect(audio.getVoiceMasterVolume()).toBe(1.0)
    audio.setVoiceMasterVolume(1.5)
    expect(audio.getVoiceMasterVolume()).toBe(1.5)

    expect(voice.isJoined).toBe(false)
    expect(voice.isMicMuted).toBe(false)
    expect(voice.isDeafened).toBe(false)
    expect(voice.hearingRadius).toBe(50)
    expect(voice.masterVolume).toBe(1.0)
    expect(voice.beacon.active).toBe(false)
  })

  it('should toggle microphone and deafen states properly', () => {
    const muted = voice.toggleMic()
    expect(muted).toBe(true)
    expect(voice.isMicMuted).toBe(true)

    const unmuted = voice.toggleMic()
    expect(unmuted).toBe(false)
    expect(voice.isMicMuted).toBe(false)

    const deafened = voice.toggleDeafen()
    expect(deafened).toBe(true)
    expect(voice.isDeafened).toBe(true)

    const undeafened = voice.toggleDeafen()
    expect(undeafened).toBe(false)
    expect(voice.isDeafened).toBe(false)
  })

  it('should clamp volume and hearing radius within safe bounds', () => {
    voice.setMasterVolume(5.0)
    expect(voice.masterVolume).toBe(2.0)

    voice.setMasterVolume(-1.0)
    expect(voice.masterVolume).toBe(0.0)

    voice.setHearingRadius(5)
    expect(voice.hearingRadius).toBe(10)

    voice.setHearingRadius(200)
    expect(voice.hearingRadius).toBe(150)
  })

  it('should calculate 3D Euclidean distance and in-range attenuation correctly', () => {
    const listenerPos = new THREE.Vector3(0, 0, 0)
    const forward = new THREE.Vector3(0, 0, -1)
    const up = new THREE.Vector3(0, 1, 0)

    // Set beacon at (0, 0, 30) -> distance is 30m, within 50m radius
    voice.startBeacon(listenerPos)
    voice.beacon.position.set(0, 0, 30)
    voice.update(listenerPos, forward, up)

    expect(voice.beacon.distance).toBeCloseTo(30, 1)
    expect(voice.beacon.inRange).toBe(true)

    // Move listener far away -> distance > 50m
    const farListener = new THREE.Vector3(0, 0, 100)
    voice.update(farListener, forward, up)
    expect(voice.beacon.distance).toBeCloseTo(70, 1)
    expect(voice.beacon.inRange).toBe(false)
  })

  it('should allow toggling spatial test beacon on and off', () => {
    const playerPos = new THREE.Vector3(10, 5, -20)
    const started = voice.toggleBeacon(playerPos)
    expect(started).toBe(true)
    expect(voice.beacon.active).toBe(true)
    expect(voice.beacon.position.x).toBe(playerPos.x + 6)

    const stopped = voice.toggleBeacon(playerPos)
    expect(stopped).toBe(false)
    expect(voice.beacon.active).toBe(false)
  })
})
