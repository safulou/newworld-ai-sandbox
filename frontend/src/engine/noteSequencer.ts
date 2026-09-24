import { InstrumentType, noteBlocks } from './noteBlocks'
import { sound } from './audio'

export interface NoteEvent {
  id: string
  time: number // seconds relative to recording start
  pitch: number // 0-24 (C3 to C5)
  instrument: InstrumentType // 'bell' | 'bass' | 'chip' | 'drum'
  volume: number // 0.0 - 1.0
  duration: number // seconds
}

export interface SequenceSong {
  version: string
  name: string
  bpm: number
  author: string
  createdAt: string
  totalDuration: number
  notes: NoteEvent[]
}

/**
 * Standard MIDI Variable-Length Quantity (VLQ) writer
 */
function toVariableLength(value: number): number[] {
  const bytes: number[] = []
  let val = Math.max(0, Math.floor(value))
  bytes.push(val & 0x7f)
  val >>= 7
  while (val > 0) {
    bytes.unshift((val & 0x7f) | 0x80)
    val >>= 7
  }
  return bytes
}

export class NoteSequencerEngine {
  public isRecording: boolean = false
  public isPlaying: boolean = false
  public currentSong: SequenceSong = {
    version: '1.0',
    name: 'Untitled Cyber Track',
    bpm: 120,
    author: 'Cyber Pioneer',
    createdAt: new Date().toISOString(),
    totalDuration: 0,
    notes: [],
  }

  private recordStartTime: number = 0
  private playbackTimer: any = null
  private scheduledTimeouts: any[] = []

  constructor() {
    this.loadFromStorage()
  }

  // -------------------------------------------------------------
  // 1. Recording Controls
  // -------------------------------------------------------------

  public startRecording(name: string = 'Cyber Jam Session', bpm: number = 120): void {
    this.stopPlayback()
    this.isRecording = true
    this.recordStartTime = typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000
    this.currentSong = {
      version: '1.0',
      name,
      bpm,
      author: 'Cyber Pioneer',
      createdAt: new Date().toISOString(),
      totalDuration: 0,
      notes: [],
    }
    sound.playUiClick()
    this.dispatchUpdate()
  }

  public recordNote(pitch: number, instrument: InstrumentType = 'bell', volume: number = 1.0, duration: number = 0.3): void {
    if (!this.isRecording) return
    const now = typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000
    const time = Math.max(0, now - this.recordStartTime)

    const note: NoteEvent = {
      id: Math.random().toString(36).substring(2, 9),
      time: parseFloat(time.toFixed(3)),
      pitch: Math.min(24, Math.max(0, pitch)),
      instrument,
      volume,
      duration,
    }

    this.currentSong.notes.push(note)
    this.currentSong.totalDuration = Math.max(this.currentSong.totalDuration, note.time + note.duration)
    this.dispatchUpdate()
  }

  public stopRecording(): SequenceSong {
    if (this.isRecording) {
      this.isRecording = false
      const now = typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000
      this.currentSong.totalDuration = Math.max(this.currentSong.totalDuration, now - this.recordStartTime)
      this.saveToStorage()
      sound.playUiClick()
      this.dispatchUpdate()
    }
    return this.currentSong
  }

  // -------------------------------------------------------------
  // 2. Playback Controls
  // -------------------------------------------------------------

  public play(onNote?: (note: NoteEvent) => void, onComplete?: () => void): void {
    this.stopPlayback()
    if (this.currentSong.notes.length === 0) return

    this.isPlaying = true

    this.currentSong.notes.forEach((note) => {
      const delayMs = note.time * 1000
      const tid = setTimeout(() => {
        if (!this.isPlaying) return
        noteBlocks.playTone(note.pitch, note.instrument)
        if (onNote) onNote(note)
      }, delayMs)
      this.scheduledTimeouts.push(tid)
    })

    const endDelayMs = (this.currentSong.totalDuration + 0.5) * 1000
    this.playbackTimer = setTimeout(() => {
      this.stopPlayback()
      if (onComplete) onComplete()
    }, endDelayMs)

    this.dispatchUpdate()
  }

  public stopPlayback(): void {
    this.isPlaying = false
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer)
      this.playbackTimer = null
    }
    this.scheduledTimeouts.forEach((tid) => clearTimeout(tid))
    this.scheduledTimeouts = []
    this.dispatchUpdate()
  }

  // -------------------------------------------------------------
  // 3. JSON Export & Import
  // -------------------------------------------------------------

  public exportJSON(): string {
    return JSON.stringify(this.currentSong, null, 2)
  }

  public importJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed && Array.isArray(parsed.notes)) {
        this.currentSong = {
          version: parsed.version || '1.0',
          name: parsed.name || 'Imported Cyber Track',
          bpm: parsed.bpm || 120,
          author: parsed.author || 'Anonymous',
          createdAt: parsed.createdAt || new Date().toISOString(),
          totalDuration: parsed.totalDuration || 0,
          notes: parsed.notes,
        }
        this.saveToStorage()
        this.dispatchUpdate()
        return true
      }
    } catch {
      // ignore
    }
    return false
  }

  // -------------------------------------------------------------
  // 4. Binary Standard MIDI File (.mid SMF format 0) Generator
  // -------------------------------------------------------------

  /**
   * Generates a valid standard binary MIDI file buffer (SMF 0)
   */
  public exportMIDI(): Uint8Array {
    const ticksPerQuarter = 480
    const microsecondsPerQuarter = Math.round(60000000 / (this.currentSong.bpm || 120))
    const secondsPerTick = (60 / (this.currentSong.bpm || 120)) / ticksPerQuarter

    // Create raw MIDI events array with absolute ticks
    interface MidiRawEvent {
      tick: number
      bytes: number[]
    }
    const events: MidiRawEvent[] = []

    // Meta Event: Tempo (0x51)
    events.push({
      tick: 0,
      bytes: [
        0xff, 0x51, 0x03,
        (microsecondsPerQuarter >> 16) & 0xff,
        (microsecondsPerQuarter >> 8) & 0xff,
        microsecondsPerQuarter & 0xff,
      ],
    })

    // Meta Event: Track Name (0x03)
    const nameBytes = Array.from(new TextEncoder().encode(this.currentSong.name.substring(0, 32)))
    events.push({
      tick: 0,
      bytes: [0xff, 0x03, ...toVariableLength(nameBytes.length), ...nameBytes],
    })

    // Process Notes (Sort into Note On and Note Off events)
    this.currentSong.notes.forEach((note) => {
      const startTick = Math.max(0, Math.round(note.time / secondsPerTick))
      const endTick = Math.max(startTick + 1, Math.round((note.time + note.duration) / secondsPerTick))

      // Pitch mapping: 0-24 maps to C3 (48) up to C5 (72)
      // Drums map to General MIDI Percussion Channel 9 (10 in 1-based, 0x99 status)
      const isDrum = note.instrument === 'drum'
      const channel = isDrum ? 0x09 : 0x00
      const midiNote = isDrum ? 36 : Math.min(127, Math.max(0, 48 + note.pitch))
      const velocity = Math.min(127, Math.max(1, Math.round(note.volume * 100)))

      // Note On (0x90 | channel)
      events.push({
        tick: startTick,
        bytes: [0x90 | channel, midiNote, velocity],
      })

      // Note Off (0x80 | channel)
      events.push({
        tick: endTick,
        bytes: [0x80 | channel, midiNote, 0],
      })
    })

    // Sort events by absolute tick
    events.sort((a, b) => a.tick - b.tick)

    // Convert to delta-time byte stream
    const trackBytes: number[] = []
    let lastTick = 0

    events.forEach((ev) => {
      const delta = Math.max(0, ev.tick - lastTick)
      lastTick = ev.tick
      trackBytes.push(...toVariableLength(delta))
      trackBytes.push(...ev.bytes)
    })

    // End of Track meta event (0xFF 0x2F 0x00)
    trackBytes.push(...toVariableLength(0))
    trackBytes.push(0xff, 0x2f, 0x00)

    // Build MThd Header Chunk
    const header = [
      0x4d, 0x54, 0x68, 0x64, // 'MThd'
      0x00, 0x00, 0x00, 0x06, // Chunk length: 6 bytes
      0x00, 0x00,             // Format 0 (Single track)
      0x00, 0x01,             // 1 Track
      (ticksPerQuarter >> 8) & 0xff, ticksPerQuarter & 0xff, // Division (480)
    ]

    // Build MTrk Track Chunk
    const trackLength = trackBytes.length
    const trackHeader = [
      0x4d, 0x54, 0x72, 0x6b, // 'MTrk'
      (trackLength >> 24) & 0xff,
      (trackLength >> 16) & 0xff,
      (trackLength >> 8) & 0xff,
      trackLength & 0xff,
    ]

    const fullMidi = new Uint8Array([...header, ...trackHeader, ...trackBytes])
    return fullMidi
  }

  // -------------------------------------------------------------
  // 5. Download Helpers (Browser Safe)
  // -------------------------------------------------------------

  public downloadJSON(filename: string = 'cyber_track.synth.json'): void {
    if (typeof document === 'undefined') return
    const blob = new Blob([this.exportJSON()], { type: 'application/json' })
    this.triggerDownload(blob, filename)
  }

  public downloadMIDI(filename: string = 'cyber_track.mid'): void {
    if (typeof document === 'undefined') return
    const midiBytes = this.exportMIDI()
    const blob = new Blob([midiBytes.buffer as ArrayBuffer], { type: 'audio/midi' })
    this.triggerDownload(blob, filename)
  }

  private triggerDownload(blob: Blob, filename: string): void {
    if (typeof document === 'undefined') return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // -------------------------------------------------------------
  // 6. Presets
  // -------------------------------------------------------------

  public loadPreset(presetName: 'cyber_arp' | 'matrix_sunrise' | 'dungeon_bass'): void {
    if (presetName === 'cyber_arp') {
      this.currentSong = {
        version: '1.0',
        name: 'Cyberpunk Neon Arp',
        bpm: 128,
        author: 'AI Architect',
        createdAt: new Date().toISOString(),
        totalDuration: 4.0,
        notes: [
          { id: '1', time: 0.0, pitch: 0, instrument: 'bass', volume: 0.9, duration: 0.25 },
          { id: '2', time: 0.25, pitch: 7, instrument: 'chip', volume: 0.8, duration: 0.2 },
          { id: '3', time: 0.5, pitch: 12, instrument: 'chip', volume: 0.8, duration: 0.2 },
          { id: '4', time: 0.75, pitch: 15, instrument: 'bell', volume: 0.9, duration: 0.3 },
          { id: '5', time: 1.0, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '6', time: 1.25, pitch: 7, instrument: 'chip', volume: 0.8, duration: 0.2 },
          { id: '7', time: 1.5, pitch: 14, instrument: 'chip', volume: 0.8, duration: 0.2 },
          { id: '8', time: 1.75, pitch: 19, instrument: 'bell', volume: 0.9, duration: 0.3 },
          { id: '9', time: 2.0, pitch: 3, instrument: 'bass', volume: 0.9, duration: 0.25 },
          { id: '10', time: 2.5, pitch: 15, instrument: 'bell', volume: 0.9, duration: 0.3 },
          { id: '11', time: 3.0, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '12', time: 3.5, pitch: 24, instrument: 'bell', volume: 1.0, duration: 0.4 },
        ],
      }
    } else if (presetName === 'matrix_sunrise') {
      this.currentSong = {
        version: '1.0',
        name: 'Matrix Sunrise Chime',
        bpm: 96,
        author: 'Chronos',
        createdAt: new Date().toISOString(),
        totalDuration: 3.5,
        notes: [
          { id: '1', time: 0.0, pitch: 12, instrument: 'bell', volume: 0.9, duration: 0.5 },
          { id: '2', time: 0.6, pitch: 16, instrument: 'bell', volume: 0.9, duration: 0.5 },
          { id: '3', time: 1.2, pitch: 19, instrument: 'bell', volume: 0.95, duration: 0.6 },
          { id: '4', time: 1.8, pitch: 24, instrument: 'bell', volume: 1.0, duration: 0.8 },
          { id: '5', time: 2.4, pitch: 7, instrument: 'bass', volume: 0.8, duration: 0.9 },
        ],
      }
    } else {
      this.currentSong = {
        version: '1.0',
        name: 'Dungeon Techno Bass',
        bpm: 135,
        author: 'Vex',
        createdAt: new Date().toISOString(),
        totalDuration: 2.0,
        notes: [
          { id: '1', time: 0.0, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '2', time: 0.25, pitch: 2, instrument: 'bass', volume: 0.8, duration: 0.2 },
          { id: '3', time: 0.5, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '4', time: 0.75, pitch: 5, instrument: 'chip', volume: 0.8, duration: 0.2 },
          { id: '5', time: 1.0, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '6', time: 1.25, pitch: 7, instrument: 'bass', volume: 0.9, duration: 0.2 },
          { id: '7', time: 1.5, pitch: 0, instrument: 'drum', volume: 1.0, duration: 0.2 },
          { id: '8', time: 1.75, pitch: 12, instrument: 'bell', volume: 0.9, duration: 0.2 },
        ],
      }
    }
    this.saveToStorage()
    this.dispatchUpdate()
  }

  // -------------------------------------------------------------
  // 7. Storage & Event Bus
  // -------------------------------------------------------------

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_note_sequence', JSON.stringify(this.currentSong))
    } catch {
      // ignore
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('nw_note_sequence')
      if (data) {
        this.currentSong = JSON.parse(data)
      }
    } catch {
      // ignore
    }
  }

  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sequencer-update', {
          detail: {
            isRecording: this.isRecording,
            isPlaying: this.isPlaying,
            song: this.currentSong,
          },
        })
      )
    }
  }
}

export const noteSequencer = new NoteSequencerEngine()

noteBlocks.onNoteTriggered = (pitch, instrument) => {
  if (noteSequencer.isRecording) {
    noteSequencer.recordNote(pitch, instrument)
  }
}
