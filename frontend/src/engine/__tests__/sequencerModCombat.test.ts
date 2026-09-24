import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as THREE from 'three'
import { noteSequencer } from '../noteSequencer'
import { vehicleMod } from '../vehicleMod'
import { CyberHound } from '../cyberFauna'
import { faunaGear } from '../faunaGear'
import { multiplayerCombat } from '../multiplayerCombat'

describe('NoteSequencerEngine & MIDI Exporter', () => {
  beforeEach(() => {
    noteSequencer.stopRecording()
    noteSequencer.stopPlayback()
  })

  it('should record note events and compute total duration', () => {
    noteSequencer.startRecording('Test Session', 120)
    expect(noteSequencer.isRecording).toBe(true)

    noteSequencer.recordNote(0, 'bass', 0.8, 0.25)
    noteSequencer.recordNote(7, 'chip', 0.9, 0.2)
    noteSequencer.recordNote(12, 'bell', 1.0, 0.5)

    const song = noteSequencer.stopRecording()
    expect(noteSequencer.isRecording).toBe(false)
    expect(song.notes.length).toBe(3)
    expect(song.name).toBe('Test Session')
    expect(song.notes[0].pitch).toBe(0)
    expect(song.notes[0].instrument).toBe('bass')
    expect(song.notes[2].pitch).toBe(12)
    expect(song.totalDuration).toBeGreaterThan(0)
  })

  it('should export and re-import JSON track data', () => {
    noteSequencer.loadPreset('cyber_arp')
    const jsonStr = noteSequencer.exportJSON()
    expect(jsonStr).toContain('Cyberpunk Neon Arp')
    expect(jsonStr).toContain('"bpm": 128')

    const success = noteSequencer.importJSON(jsonStr)
    expect(success).toBe(true)
    expect(noteSequencer.currentSong.name).toBe('Cyberpunk Neon Arp')
    expect(noteSequencer.currentSong.notes.length).toBe(12)
  })

  it('should generate valid binary Standard MIDI File (SMF format 0)', () => {
    noteSequencer.loadPreset('matrix_sunrise')
    const midiBytes = noteSequencer.exportMIDI()
    expect(midiBytes).toBeInstanceOf(Uint8Array)
    expect(midiBytes.length).toBeGreaterThan(30)

    // Check 'MThd' header signature (0x4D, 0x54, 0x68, 0x64)
    expect(midiBytes[0]).toBe(0x4d)
    expect(midiBytes[1]).toBe(0x54)
    expect(midiBytes[2]).toBe(0x68)
    expect(midiBytes[3]).toBe(0x64)

    // Check header length (6 bytes)
    expect(midiBytes[7]).toBe(6)

    // Check SMF format 0 (single track)
    expect(midiBytes[8]).toBe(0)
    expect(midiBytes[9]).toBe(0)

    // Find 'MTrk' track signature in buffer
    const midiStr = String.fromCharCode(...midiBytes)
    expect(midiStr).toContain('MTrk')

    // Verify End-Of-Track event (0xFF 0x2F 0x00) is present at the end
    const last3 = [midiBytes[midiBytes.length - 3], midiBytes[midiBytes.length - 2], midiBytes[midiBytes.length - 1]]
    expect(last3).toEqual([0xff, 0x2f, 0x00])
  })

  it('should safely handle playback start and stop without exceptions', () => {
    noteSequencer.loadPreset('dungeon_bass')
    const noteSpy = vi.fn()
    const completeSpy = vi.fn()

    noteSequencer.play(noteSpy, completeSpy)
    expect(noteSequencer.isPlaying).toBe(true)

    noteSequencer.stopPlayback()
    expect(noteSequencer.isPlaying).toBe(false)
  })
})

describe('VehicleModManager & Customization', () => {
  beforeEach(() => {
    vehicleMod.config.overdriveBooster = false
    vehicleMod.config.gravStabilizer = false
    vehicleMod.config.turboColor = 'cyan'
    vehicleMod.config.exhaustStyle = 'plasma'
  })

  it('should switch turbo color and retrieve correct hex values', () => {
    vehicleMod.setTurboColor('magenta')
    expect(vehicleMod.config.turboColor).toBe('magenta')
    expect(vehicleMod.getTurboHex()).toBe(0xff007f)

    vehicleMod.setTurboColor('gold')
    expect(vehicleMod.getTurboHex()).toBe(0xffaa00)

    vehicleMod.setTurboColor('lime')
    expect(vehicleMod.getTurboHex()).toBe(0x39ff14)
  })

  it('should calculate overdrive speed multiplier correctly', () => {
    const baseMultiplier = 2.4 // Speeder base
    expect(vehicleMod.getEffectiveSpeedMultiplier(baseMultiplier, false)).toBe(2.4)

    // Toggle overdrive booster ON
    vehicleMod.toggleMod('overdriveBooster')
    expect(vehicleMod.config.overdriveBooster).toBe(true)
    // Base 2.4 + 0.5 = 2.9
    expect(vehicleMod.getEffectiveSpeedMultiplier(baseMultiplier, false)).toBe(2.9)

    // Sprint mode with overdrive: 2.4 + 0.5 + 0.4 = 3.3
    expect(vehicleMod.getEffectiveSpeedMultiplier(baseMultiplier, true)).toBe(3.3)
  })

  it('should toggle gravity stabilizer', () => {
    const active = vehicleMod.toggleMod('gravStabilizer')
    expect(active).toBe(true)
    expect(vehicleMod.config.gravStabilizer).toBe(true)
  })
})

describe('CyberHound Shoulder Cannon & FaunaGear', () => {
  it('should equip and unequip shoulder plasma cannons', () => {
    const hound = new CyberHound(new THREE.Vector3(0, 0, 0), 'tamed')
    expect(hound.isCannonEquipped).toBe(false)

    hound.equipCannon(0xff00aa)
    expect(hound.isCannonEquipped).toBe(true)

    hound.unequipCannon()
    expect(hound.isCannonEquipped).toBe(false)
  })

  it('should aim and fire laser at target when equipped and within range', () => {
    const hound = new CyberHound(new THREE.Vector3(0, 0, 0), 'tamed')
    hound.equipCannon(0x00ffff)

    const enemyPos = new THREE.Vector3(5, 0, 5)
    const laserSpy = vi.fn()

    // First update should fire laser
    const fired = hound.updateCombat(0.1, enemyPos, laserSpy)
    expect(fired).toBe(true)
    expect(laserSpy).toHaveBeenCalledOnce()

    // Immediate second update should be in cooldown
    const firedAgain = hound.updateCombat(0.1, enemyPos, laserSpy)
    expect(firedAgain).toBe(false)
  })

  it('should create and update FaunaGear laser beam effects', () => {
    const scene = new THREE.Scene()
    faunaGear.init(scene)

    faunaGear.spawnLaserBeam(new THREE.Vector3(0, 1, 0), new THREE.Vector3(10, 1, 10), 0x00ffff)
    expect(scene.children.length).toBe(1)

    // Fade laser beam
    faunaGear.update(0.1)
    expect(scene.children.length).toBe(1)

    // Expire laser beam (>0.22s)
    faunaGear.update(0.2)
    expect(scene.children.length).toBe(0)

    faunaGear.dispose()
  })
})

describe('MultiplayerCombatEngine & 3D Damage Popups', () => {
  it('should initialize and update damage number particles', () => {
    const scene = new THREE.Scene()
    multiplayerCombat.init(null, scene)

    multiplayerCombat.spawnDamageNumber(new THREE.Vector3(0, 2, 0), 35, false)
    expect(scene.children.length).toBe(1)

    multiplayerCombat.update(0.2)
    expect(scene.children.length).toBe(1)

    // Expire after 1.2s
    multiplayerCombat.update(1.2)
    expect(scene.children.length).toBe(0)

    multiplayerCombat.dispose()
  })

  it('should spawn remote slash waves and clean up after expiration', () => {
    const scene = new THREE.Scene()
    multiplayerCombat.init(null, scene)

    multiplayerCombat.spawnRemoteSlashWave(new THREE.Vector3(2, 1, 2), Math.PI / 2, 0x00ffff)
    expect(scene.children.length).toBe(1)

    multiplayerCombat.update(0.3)
    expect(scene.children.length).toBe(0)

    multiplayerCombat.dispose()
  })

  it('should emit broadcast methods without throwing when socket is null or disconnected', () => {
    const scene = new THREE.Scene()
    multiplayerCombat.init(null, scene)

    expect(() => {
      multiplayerCombat.broadcastDamage('boss', 50, new THREE.Vector3(0, 0, 0))
      multiplayerCombat.broadcastBossSync(150, 250, false)
      multiplayerCombat.broadcastSlash(new THREE.Vector3(0, 0, 0), 0)
      multiplayerCombat.broadcastHealth(90, 100, 80, 100)
    }).not.toThrow()
  })
})
