import { InstrumentType, noteBlocks } from './noteBlocks'
import { noteSequencer, SequenceSong, NoteEvent } from './noteSequencer'
import { sound } from './audio'

export const PITCH_NAMES = [
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5',
]

export const STEP_COUNT = 16

export type PianoRollGrid = Record<InstrumentType, boolean[][]>

export class PianoRollEngine {
  public grid: PianoRollGrid
  public currentInstrument: InstrumentType = 'chip'
  public bpm: number = 120
  public currentStep: number = -1
  public isPlaying: boolean = false
  public isLooping: boolean = true

  private playbackTimer: any = null
  private onStepCallback?: (step: number) => void

  constructor() {
    this.grid = this.createEmptyGrid()
    this.loadPreset('neon_chip')
  }

  public createEmptyGrid(): PianoRollGrid {
    const makeInstrumentGrid = () => {
      // 25 rows (pitches 0-24), each has STEP_COUNT booleans
      const rows: boolean[][] = []
      for (let p = 0; p < 25; p++) {
        rows.push(new Array(STEP_COUNT).fill(false))
      }
      return rows
    }

    return {
      bell: makeInstrumentGrid(),
      bass: makeInstrumentGrid(),
      chip: makeInstrumentGrid(),
      drum: makeInstrumentGrid(),
    }
  }

  public toggleCell(instrument: InstrumentType, pitch: number, step: number): boolean {
    if (pitch < 0 || pitch >= 25 || step < 0 || step >= STEP_COUNT) return false
    const current = this.grid[instrument][pitch][step]
    const next = !current
    this.grid[instrument][pitch][step] = next

    if (next) {
      // Audition note sound immediately on click
      noteBlocks.playTone(pitch, instrument)
    }

    this.dispatchUpdate()
    return next
  }

  public clear(instrument?: InstrumentType): void {
    if (instrument) {
      for (let p = 0; p < 25; p++) {
        this.grid[instrument][p].fill(false)
      }
    } else {
      this.grid = this.createEmptyGrid()
    }
    sound.playUiClick()
    this.dispatchUpdate()
  }

  // -------------------------------------------------------------
  // Playback Loop
  // -------------------------------------------------------------

  public play(onStepChange?: (step: number) => void, onComplete?: () => void): void {
    this.stop()
    this.isPlaying = true
    this.onStepCallback = onStepChange
    this.currentStep = 0

    const stepIntervalMs = (60 / this.bpm / 4) * 1000 // 16th notes

    const tick = () => {
      if (!this.isPlaying) return

      // Trigger all active notes at current step across all 4 instruments
      const instruments: InstrumentType[] = ['bell', 'bass', 'chip', 'drum']
      for (const inst of instruments) {
        for (let pitch = 0; pitch < 25; pitch++) {
          if (this.grid[inst][pitch][this.currentStep]) {
            noteBlocks.playTone(pitch, inst)
          }
        }
      }

      if (this.onStepCallback) {
        this.onStepCallback(this.currentStep)
      }
      this.dispatchUpdate()

      this.playbackTimer = setTimeout(() => {
        if (!this.isPlaying) return
        this.currentStep++
        if (this.currentStep >= STEP_COUNT) {
          if (this.isLooping) {
            this.currentStep = 0
            tick()
          } else {
            this.stop()
            if (onComplete) onComplete()
          }
        } else {
          tick()
        }
      }, stepIntervalMs)
    }

    tick()
  }

  public stop(): void {
    this.isPlaying = false
    this.currentStep = -1
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer)
      this.playbackTimer = null
    }
    if (this.onStepCallback) {
      this.onStepCallback(-1)
    }
    this.dispatchUpdate()
  }

  // -------------------------------------------------------------
  // Synchronization with NoteSequencer & MIDI
  // -------------------------------------------------------------

  /**
   * Compiles current piano roll grid into a SequenceSong for export/storage
   */
  public compileToSong(name: string = 'Piano Roll Composition'): SequenceSong {
    const stepDuration = 60 / this.bpm / 4 // duration of a 16th note in seconds
    const notes: NoteEvent[] = []
    const instruments: InstrumentType[] = ['bell', 'bass', 'chip', 'drum']

    for (let s = 0; s < STEP_COUNT; s++) {
      const time = parseFloat((s * stepDuration).toFixed(3))
      for (const inst of instruments) {
        for (let pitch = 0; pitch < 25; pitch++) {
          if (this.grid[inst][pitch][s]) {
            notes.push({
              id: `${inst}-${pitch}-${s}`,
              time,
              pitch,
              instrument: inst,
              volume: 0.9,
              duration: parseFloat((stepDuration * 0.9).toFixed(3)),
            })
          }
        }
      }
    }

    return {
      version: '1.0',
      name,
      bpm: this.bpm,
      author: 'Cyber Composer',
      createdAt: new Date().toISOString(),
      totalDuration: parseFloat((STEP_COUNT * stepDuration).toFixed(3)),
      notes,
    }
  }

  public exportMIDI(filename: string = 'piano_roll_track.mid'): void {
    const song = this.compileToSong('Piano Roll Session')
    noteSequencer.currentSong = song
    noteSequencer.downloadMIDI(filename)
  }

  public exportJSON(filename: string = 'piano_roll_track.synth.json'): void {
    const song = this.compileToSong('Piano Roll Session')
    noteSequencer.currentSong = song
    noteSequencer.downloadJSON(filename)
  }

  public loadFromSong(song: SequenceSong): void {
    this.clear()
    this.bpm = song.bpm || 120
    const stepDuration = 60 / this.bpm / 4

    song.notes.forEach((n) => {
      const step = Math.min(STEP_COUNT - 1, Math.max(0, Math.round(n.time / stepDuration)))
      const pitch = Math.min(24, Math.max(0, n.pitch))
      if (this.grid[n.instrument]) {
        this.grid[n.instrument][pitch][step] = true
      }
    })
    this.dispatchUpdate()
  }

  // -------------------------------------------------------------
  // Presets
  // -------------------------------------------------------------

  public loadPreset(name: 'neon_chip' | 'crystal_bell' | 'cyber_techno'): void {
    this.clear()
    if (name === 'neon_chip') {
      this.bpm = 130
      // Chip melody
      const melody = [
        { s: 0, p: 12 }, { s: 2, p: 14 }, { s: 4, p: 15 }, { s: 6, p: 19 },
        { s: 8, p: 17 }, { s: 10, p: 15 }, { s: 12, p: 14 }, { s: 14, p: 12 },
      ]
      melody.forEach((m) => { this.grid.chip[m.p][m.s] = true })

      // Bassline
      const bass = [
        { s: 0, p: 0 }, { s: 4, p: 3 }, { s: 8, p: 5 }, { s: 12, p: 0 },
      ]
      bass.forEach((b) => { this.grid.bass[b.p][b.s] = true })

      // Drum kicks
      const drums = [0, 4, 8, 12]
      drums.forEach((d) => { this.grid.drum[0][d] = true })
    } else if (name === 'crystal_bell') {
      this.bpm = 95
      const bellArp = [
        { s: 0, p: 12 }, { s: 2, p: 16 }, { s: 4, p: 19 }, { s: 6, p: 24 },
        { s: 8, p: 21 }, { s: 10, p: 19 }, { s: 12, p: 16 }, { s: 14, p: 14 },
      ]
      bellArp.forEach((b) => { this.grid.bell[b.p][b.s] = true })
      this.grid.bass[0][0] = true
      this.grid.bass[5][8] = true
    } else {
      this.bpm = 135
      // 4-on-the-floor cyber kicks
      ;[0, 2, 4, 6, 8, 10, 12, 14].forEach((s) => { this.grid.drum[0][s] = true })
      // Offbeat bass
      ;[1, 3, 5, 7, 9, 11, 13, 15].forEach((s) => { this.grid.bass[3][s] = true })
      // Lead riff
      ;[{ s: 0, p: 15 }, { s: 6, p: 18 }, { s: 10, p: 20 }, { s: 14, p: 22 }].forEach((l) => {
        this.grid.chip[l.p][l.s] = true
      })
    }
    sound.playUiClick()
    this.dispatchUpdate()
  }

  public getPitchName(pitch: number): string {
    return PITCH_NAMES[pitch] || `P${pitch}`
  }

  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('piano-roll-update', {
          detail: {
            bpm: this.bpm,
            isPlaying: this.isPlaying,
            currentStep: this.currentStep,
            instrument: this.currentInstrument,
          },
        })
      )
    }
  }
}

export const pianoRoll = new PianoRollEngine()
