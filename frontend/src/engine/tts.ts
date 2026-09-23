import { ref, reactive } from 'vue'
import { spatialAudio } from './spatialAudio'
import { achievements } from './achievements'

export interface NPCVoiceProfile {
  id: string
  name: string
  title: string
  pitch: number
  rate: number
  preferredLang: string
  preferredVoices: string[]
  openAIVoice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  isRobot?: boolean
}

export const NPC_VOICE_PROFILES: Record<string, NPCVoiceProfile> = {
  npc_architect: {
    id: 'npc_architect',
    name: 'Alex',
    title: '首席元宇宙架構師',
    pitch: 0.95,
    rate: 1.05,
    preferredLang: 'zh-TW',
    preferredVoices: ['Google 國語', 'Mei-Jia', 'HsiaoChen', 'Microsoft Yating', 'Daniel', 'Alex'],
    openAIVoice: 'onyx',
  },
  npc_sentinel: {
    id: 'npc_sentinel',
    name: 'Aegis',
    title: '邊界防衛機甲',
    pitch: 0.65,
    rate: 0.90,
    preferredLang: 'zh-TW',
    preferredVoices: ['Google 國語', 'Zhiwei', 'Microsoft Yunyang', 'Fred', 'George'],
    openAIVoice: 'fable',
    isRobot: true,
  },
  npc_lore: {
    id: 'npc_lore',
    name: 'Chronos',
    title: '量子歷史學者',
    pitch: 0.82,
    rate: 0.92,
    preferredLang: 'zh-TW',
    preferredVoices: ['Google 國語', 'HanHan', 'Microsoft Kangkang', 'Oliver', 'Bruce'],
    openAIVoice: 'echo',
  },
  npc_merchant: {
    id: 'npc_merchant',
    name: 'Vex',
    title: '星際貿易商',
    pitch: 1.20,
    rate: 1.15,
    preferredLang: 'zh-TW',
    preferredVoices: ['Google 國語', 'HsiaoYu', 'Microsoft Xiaoxiao', 'Samantha', 'Victoria'],
    openAIVoice: 'nova',
  },
  npc_drone: {
    id: 'npc_drone',
    name: 'Sparky',
    title: '伴隨偵查無人機',
    pitch: 1.65,
    rate: 1.30,
    preferredLang: 'zh-TW',
    preferredVoices: ['Google 國語', 'Ting-Ting', 'Microsoft Hanhan', 'Junior', 'Pipe Organ'],
    openAIVoice: 'shimmer',
    isRobot: true,
  },
}

/**
 * Filter code, emojis, markdown headers, and bracketed prompt markers
 * to ensure smooth and natural text-to-speech pronunciation
 */
export function sanitizeTextForSpeech(text: string): string {
  return text
    // Remove markdown code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bracket tags like [Architect], [Worker], [Server]
    .replace(/\[[A-Za-z0-9_\u4e00-\u9fa5\s]+\]/g, '')
    // Remove markdown headings and formatting (*, #, ~, >)
    .replace(/[*#~>]/g, '')
    // Remove markdown underscores for italics while preserving identifier_names
    .replace(/(^|\s)_+([^_]+)_+(\s|$)/g, '$1$2$3')
    // Replace emojis and symbols with space
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Collapse consecutive whitespaces
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Calculate 3D distance attenuation multiplier (0.0 ~ 1.0)
 */
export function calculateDistanceAttenuation(
  sourcePos?: { x: number; y: number; z: number },
  listenerPos?: { x: number; y: number; z: number },
  maxDistance: number = 45
): number {
  if (!sourcePos || !listenerPos) return 1.0
  const dx = sourcePos.x - listenerPos.x
  const dy = sourcePos.y - listenerPos.y
  const dz = sourcePos.z - listenerPos.z
  const dist = Math.hypot(dx, dy, dz)

  if (dist <= 2.5) return 1.0
  if (dist >= maxDistance) return 0.05
  return Math.max(0.05, 1.0 - Math.pow(dist / maxDistance, 1.2))
}

export class TTSEngine {
  public isSpeaking = ref(false)
  public currentSpeaker = ref<string | null>(null)
  public currentText = ref<string>('')
  public speechProgress = ref(0)
  public availableVoices = ref<SpeechSynthesisVoice[]>([])

  private synth: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private activeAudioSource: AudioBufferSourceNode | null = null

  public state = reactive({
    enabled: true,
    volume: 1.0,
    rateMultiplier: 1.0,
    pitchMultiplier: 1.0,
    provider: 'browser' as 'browser' | 'openai',
  })

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.loadVoices()
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices()
      }
    }
    this.loadSettings()
  }

  private loadVoices(): void {
    if (!this.synth) return
    const voices = this.synth.getVoices()
    if (voices && voices.length > 0) {
      this.availableVoices.value = voices
    }
  }

  private loadSettings(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const en = localStorage.getItem('nw_tts_enabled')
      if (en !== null) this.state.enabled = en === 'true'
      const vol = localStorage.getItem('nw_tts_volume')
      if (vol !== null) this.state.volume = Number(vol)
      const rate = localStorage.getItem('nw_tts_rate')
      if (rate !== null) this.state.rateMultiplier = Number(rate)
      const pitch = localStorage.getItem('nw_tts_pitch')
      if (pitch !== null) this.state.pitchMultiplier = Number(pitch)
      const prov = localStorage.getItem('nw_tts_provider')
      if (prov === 'browser' || prov === 'openai') this.state.provider = prov
    } catch {
      // Ignore localStorage read errors
    }
  }

  public saveSettings(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_tts_enabled', String(this.state.enabled))
      localStorage.setItem('nw_tts_volume', String(this.state.volume))
      localStorage.setItem('nw_tts_rate', String(this.state.rateMultiplier))
      localStorage.setItem('nw_tts_pitch', String(this.state.pitchMultiplier))
      localStorage.setItem('nw_tts_provider', this.state.provider)
    } catch {
      // Ignore localStorage write errors
    }
  }

  /**
   * Resolve best matching voice for a given profile and text language
   */
  public getBestVoiceForProfile(profile: NPCVoiceProfile, text: string): SpeechSynthesisVoice | null {
    if (!this.availableVoices.value.length && this.synth) {
      this.loadVoices()
    }
    const voices = this.availableVoices.value
    if (!voices || voices.length === 0) return null

    // Check if text is predominantly Chinese
    const hasChinese = /[\u4e00-\u9fa5]/.test(text)
    const targetLang = hasChinese ? 'zh' : 'en'

    // 1. Try matching preferred voice names
    for (const pref of profile.preferredVoices) {
      const match = voices.find(v => v.name.toLowerCase().includes(pref.toLowerCase()))
      if (match) return match
    }

    // 2. Try matching target language
    const langMatches = voices.filter(v => v.lang.toLowerCase().startsWith(targetLang))
    if (langMatches.length > 0) {
      return langMatches[0]
    }

    // 3. Fallback to first available or default voice
    return voices.find(v => v.default) || voices[0]
  }

  /**
   * Speak message from an NPC with custom pitch, rate, and 3D distance attenuation
   */
  public async speak(
    npcIdentifier: string,
    text: string,
    npcPos?: { x: number; y: number; z: number },
    playerPos?: { x: number; y: number; z: number },
    apiKey?: string
  ): Promise<void> {
    if (!this.state.enabled) return

    const cleanText = sanitizeTextForSpeech(text)
    if (!cleanText) return

    // Stop any active speech
    this.stop()

    // Find profile
    let profile = NPC_VOICE_PROFILES[npcIdentifier]
    if (!profile) {
      // Match by name
      const found = Object.values(NPC_VOICE_PROFILES).find(
        p => p.name.toLowerCase() === npcIdentifier.toLowerCase()
      )
      profile = found || NPC_VOICE_PROFILES.npc_architect
    }

    // Calculate distance volume attenuation
    const distanceGain = calculateDistanceAttenuation(npcPos, playerPos, 50)
    const effectiveVolume = Math.max(0.05, Math.min(1.0, this.state.volume * distanceGain))

    this.isSpeaking.value = true
    this.currentSpeaker.value = profile.id
    this.currentText.value = cleanText
    this.speechProgress.value = 0

    // Trigger unlock achievement
    achievements.unlock('npc_voice_hearer')

    // Broadcast speech start event for 3D world billboard & avatar animation
    window.dispatchEvent(
      new CustomEvent('npc-speech-start', {
        detail: {
          npcId: profile.id,
          npcName: profile.name,
          text: cleanText,
          position: npcPos,
        },
      })
    )

    // Sparky drone robot chirping sound effect
    if (profile.id === 'npc_drone') {
      this.playRobotChirp(profile.pitch, npcPos)
    }

    // ── Option A: OpenAI TTS (if configured & key provided) ──
    if (this.state.provider === 'openai' && apiKey) {
      try {
        await this.speakOpenAI(cleanText, profile, effectiveVolume, npcPos)
        this.onSpeechEnd(profile.id)
        return
      } catch (err) {
        console.warn('[TTS] OpenAI TTS failed, falling back to Web Speech API:', err)
      }
    }

    // ── Option B: Web Speech Synthesis API ──
    if (!this.synth) {
      this.onSpeechEnd(profile.id)
      return
    }

    const utterance = new SpeechSynthesisUtterance(cleanText)
    this.currentUtterance = utterance

    const voice = this.getBestVoiceForProfile(profile, cleanText)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    }

    utterance.pitch = Math.max(0.5, Math.min(2.0, profile.pitch * this.state.pitchMultiplier))
    utterance.rate = Math.max(0.5, Math.min(2.0, profile.rate * this.state.rateMultiplier))
    utterance.volume = effectiveVolume

    utterance.onboundary = (event) => {
      if (cleanText.length > 0) {
        this.speechProgress.value = Math.min(1.0, event.charIndex / cleanText.length)
      }
    }

    utterance.onend = () => {
      this.onSpeechEnd(profile.id)
    }

    utterance.onerror = (e) => {
      console.warn('[TTS] SpeechSynthesis error:', e)
      this.onSpeechEnd(profile.id)
    }

    try {
      this.synth.speak(utterance)
    } catch (e) {
      console.warn('[TTS] Speak failed:', e)
      this.onSpeechEnd(profile.id)
    }
  }

  private onSpeechEnd(npcId: string): void {
    this.isSpeaking.value = false
    this.currentSpeaker.value = null
    this.currentText.value = ''
    this.speechProgress.value = 1.0
    this.currentUtterance = null

    window.dispatchEvent(
      new CustomEvent('npc-speech-end', {
        detail: { npcId },
      })
    )
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance
  }

  /**
   * Stop active speech synthesis or audio playback
   */
  public stop(): void {
    if (this.currentUtterance) {
      this.currentUtterance.onend = null
      this.currentUtterance.onerror = null
      this.currentUtterance = null
    }
    if (this.synth && this.synth.speaking) {
      this.synth.cancel()
    }
    if (this.activeAudioSource) {
      try {
        this.activeAudioSource.stop()
        this.activeAudioSource.disconnect()
      } catch {
        // Source might already be stopped
      }
      this.activeAudioSource = null
    }
    if (this.isSpeaking.value && this.currentSpeaker.value) {
      this.onSpeechEnd(this.currentSpeaker.value)
    }
  }

  /**
   * Play OpenAI TTS Audio buffer through Web Audio 3D spatial panner
   */
  private async speakOpenAI(
    text: string,
    profile: NPCVoiceProfile,
    volume: number,
    npcPos?: { x: number; y: number; z: number }
  ): Promise<void> {
    const audioCtx = spatialAudio.getAudioContext()
    if (!audioCtx) throw new Error('No AudioContext')

    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('nw_api_key') || ''}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: profile.openAIVoice,
        input: text,
      }),
    })

    if (!res.ok) {
      throw new Error(`OpenAI TTS responded with ${res.status}`)
    }

    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    this.activeAudioSource = source

    const gain = audioCtx.createGain()
    gain.gain.setValueAtTime(volume, audioCtx.currentTime)

    if (npcPos) {
      const panner = audioCtx.createPanner()
      panner.panningModel = 'HRTF'
      panner.distanceModel = 'inverse'
      panner.refDistance = 3.0
      panner.maxDistance = 50.0
      if (panner.positionX) {
        panner.positionX.setValueAtTime(npcPos.x, audioCtx.currentTime)
        panner.positionY.setValueAtTime(npcPos.y, audioCtx.currentTime)
        panner.positionZ.setValueAtTime(npcPos.z, audioCtx.currentTime)
      } else {
        panner.setPosition(npcPos.x, npcPos.y, npcPos.z)
      }
      source.connect(gain)
      gain.connect(panner)
      panner.connect(audioCtx.destination)
    } else {
      source.connect(gain)
      gain.connect(audioCtx.destination)
    }

    await new Promise<void>((resolve) => {
      source.onended = () => resolve()
      source.start()
    })
  }

  /**
   * Synthesizes delightful procedural robotic chirps (R2-D2 style) using Web Audio oscillators
   */
  public playRobotChirp(basePitch: number = 1.5, pos?: { x: number; y: number; z: number }): void {
    const ctx = spatialAudio.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    const f0 = 440 * basePitch
    osc.frequency.setValueAtTime(f0, now)
    osc.frequency.exponentialRampToValueAtTime(f0 * 1.8, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.9, now + 0.16)
    osc.frequency.exponentialRampToValueAtTime(f0 * 2.2, now + 0.24)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    if (pos) {
      const panner = ctx.createPanner()
      panner.panningModel = 'HRTF'
      if (panner.positionX) {
        panner.positionX.setValueAtTime(pos.x, now)
        panner.positionY.setValueAtTime(pos.y, now)
        panner.positionZ.setValueAtTime(pos.z, now)
      } else {
        panner.setPosition(pos.x, pos.y, pos.z)
      }
      osc.connect(gain)
      gain.connect(panner)
      panner.connect(ctx.destination)
    } else {
      osc.connect(gain)
      gain.connect(ctx.destination)
    }

    osc.start(now)
    osc.stop(now + 0.3)
  }
}

export const tts = new TTSEngine()
