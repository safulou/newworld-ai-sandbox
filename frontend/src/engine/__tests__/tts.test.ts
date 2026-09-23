import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sanitizeTextForSpeech,
  calculateDistanceAttenuation,
  NPC_VOICE_PROFILES,
  TTSEngine,
} from '../tts'

describe('TTS Engine & Voice Processing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sanitizeTextForSpeech', () => {
    it('removes markdown formatting and symbols', () => {
      const input = '### Hello **World**! This is a *test*.'
      const output = sanitizeTextForSpeech(input)
      expect(output).toBe('Hello World! This is a test.')
    })

    it('removes code blocks and backticks', () => {
      const input = 'Here is code ```const a = 1;``` and `inline_var`.'
      const output = sanitizeTextForSpeech(input)
      expect(output).toBe('Here is code and inline_var.')
    })

    it('strips emojis and special symbols', () => {
      const input = '🚀 Welcome to the metaverse! 🏰✨ Enjoy your stay 🎮'
      const output = sanitizeTextForSpeech(input)
      expect(output).toBe('Welcome to the metaverse! Enjoy your stay')
    })

    it('removes bracketed tags like [Architect] or [Worker]', () => {
      const input = '[Architect] Ready to build [Worker] status ok.'
      const output = sanitizeTextForSpeech(input)
      expect(output).toBe('Ready to build status ok.')
    })

    it('handles empty or whitespace strings gracefully', () => {
      expect(sanitizeTextForSpeech('')).toBe('')
      expect(sanitizeTextForSpeech('   \n\t  ')).toBe('')
    })
  })

  describe('calculateDistanceAttenuation', () => {
    it('returns full volume when close to NPC', () => {
      const source = { x: 0, y: 0, z: 0 }
      const listener = { x: 1, y: 0, z: 1 } // ~1.41m
      const gain = calculateDistanceAttenuation(source, listener, 50)
      expect(gain).toBe(1.0)
    })

    it('attenuates sound with distance', () => {
      const source = { x: 0, y: 0, z: 0 }
      const listenerClose = { x: 10, y: 0, z: 0 }
      const listenerFar = { x: 30, y: 0, z: 0 }

      const gainClose = calculateDistanceAttenuation(source, listenerClose, 50)
      const gainFar = calculateDistanceAttenuation(source, listenerFar, 50)

      expect(gainClose).toBeGreaterThan(gainFar)
      expect(gainClose).toBeLessThan(1.0)
    })

    it('reaches minimum cutoff at or beyond max distance', () => {
      const source = { x: 0, y: 0, z: 0 }
      const listener = { x: 100, y: 0, z: 0 }
      const gain = calculateDistanceAttenuation(source, listener, 50)
      expect(gain).toBe(0.05)
    })

    it('returns 1.0 when positions are undefined', () => {
      expect(calculateDistanceAttenuation()).toBe(1.0)
    })
  })

  describe('NPC_VOICE_PROFILES', () => {
    it('contains profiles for all 5 meta-companions', () => {
      const expectedIds = ['npc_architect', 'npc_sentinel', 'npc_lore', 'npc_merchant', 'npc_drone']
      for (const id of expectedIds) {
        expect(NPC_VOICE_PROFILES[id]).toBeDefined()
        expect(NPC_VOICE_PROFILES[id].name).toBeTruthy()
        expect(NPC_VOICE_PROFILES[id].pitch).toBeGreaterThan(0)
        expect(NPC_VOICE_PROFILES[id].rate).toBeGreaterThan(0)
      }
    })

    it('assigns unique vocal traits to characters', () => {
      // Aegis is deep and robotic
      expect(NPC_VOICE_PROFILES.npc_sentinel.pitch).toBeLessThan(0.8)
      // Sparky is high-pitched and fast
      expect(NPC_VOICE_PROFILES.npc_drone.pitch).toBeGreaterThan(1.4)
      expect(NPC_VOICE_PROFILES.npc_drone.rate).toBeGreaterThan(1.2)
      // Alex is balanced
      expect(NPC_VOICE_PROFILES.npc_architect.pitch).toBeCloseTo(0.95, 1)
    })
  })

  describe('TTSEngine instance', () => {
    it('initializes with default enabled state', () => {
      const engine = new TTSEngine()
      expect(engine.state.enabled).toBe(true)
      expect(engine.state.volume).toBeGreaterThan(0)
      expect(engine.isSpeaking.value).toBe(false)
    })

    it('handles stop cleanly without active audio', () => {
      const engine = new TTSEngine()
      expect(() => engine.stop()).not.toThrow()
      expect(engine.isSpeaking.value).toBe(false)
    })
  })
})
