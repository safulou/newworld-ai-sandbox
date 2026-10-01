import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface TelemetryFrame {
  t: number // ms offset from run start
  x: number
  y: number
  z: number
  yaw: number
  isGliding: boolean
}

export interface GhostRecording {
  id: string
  courseId: string
  playerName: string
  totalTimeMs: number
  frames: TelemetryFrame[]
  recordedAt: number
}

export interface LeaderboardEntry {
  id: string
  rank: number
  playerName: string
  category: 'skyline_sprint' | 'inversion_gauntlet' | 'crystal_dragon' | 'boss_speedrun'
  scoreText: string
  scoreValue: number // lower is better for time, higher is better for weight
  challengeCode: string
}

export const DEFAULT_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'lb_1',
    rank: 1,
    playerName: 'Cyber_Phantom_X',
    category: 'skyline_sprint',
    scoreText: '00:14.28',
    scoreValue: 14280,
    challengeCode: 'NW_RACE_SKY_14280',
  },
  {
    id: 'lb_2',
    rank: 2,
    playerName: 'NeonValkyrie',
    category: 'skyline_sprint',
    scoreText: '00:16.85',
    scoreValue: 16850,
    challengeCode: 'NW_RACE_SKY_16850',
  },
  {
    id: 'lb_3',
    rank: 1,
    playerName: 'GravityHacker',
    category: 'inversion_gauntlet',
    scoreText: '00:22.40',
    scoreValue: 22400,
    challengeCode: 'NW_RACE_INV_22400',
  },
  {
    id: 'lb_4',
    rank: 1,
    playerName: 'VoidAngler_01',
    category: 'crystal_dragon',
    scoreText: '318.5 kg (472 cm)',
    scoreValue: 318.5,
    challengeCode: 'NW_FISH_DRAG_3185',
  },
]

export class GhostReplayEngine {
  public isRecording: boolean = false
  public isPlayingGhost: boolean = false
  public currentRecording: GhostRecording | null = null
  public activeGhost: GhostRecording | null = null

  public ghostPosition = new THREE.Vector3(0, 0, 0)
  public ghostYaw: number = 0
  public ghostIsGliding: boolean = false

  public leaderboards: LeaderboardEntry[] = []

  private recordStartTime: number = 0
  private lastSampleTime: number = 0
  private playbackElapsedMs: number = 0

  constructor() {
    this.leaderboards = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD_ENTRIES))
    this.loadState()
  }

  public startRecording(courseId: string, playerName: string = 'Pioneer'): void {
    this.isRecording = true
    this.recordStartTime = Date.now()
    this.lastSampleTime = 0
    this.currentRecording = {
      id: `ghost_${Date.now()}`,
      courseId,
      playerName,
      totalTimeMs: 0,
      frames: [],
      recordedAt: Date.now(),
    }
  }

  public stopRecording(): GhostRecording | null {
    if (!this.isRecording || !this.currentRecording) return null
    this.isRecording = false
    this.currentRecording.totalTimeMs = Date.now() - this.recordStartTime
    const finished = this.currentRecording

    // Save as active personal ghost
    this.activeGhost = finished
    this.addLeaderboardEntry(
      finished.playerName,
      'skyline_sprint',
      finished.totalTimeMs,
      this.formatTime(finished.totalTimeMs)
    )

    achievements.unlock('ghost_racer')
    sound.playFanfare()
    this.saveState()
    return finished
  }

  public startGhostPlayback(ghost?: GhostRecording): void {
    const target = ghost || this.activeGhost
    if (!target || target.frames.length === 0) return

    this.activeGhost = target
    this.isPlayingGhost = true
    this.playbackElapsedMs = 0
  }

  public stopGhostPlayback(): void {
    this.isPlayingGhost = false
    this.playbackElapsedMs = 0
  }

  public sampleFrame(playerPos: THREE.Vector3, yaw: number, isGliding: boolean): void {
    if (!this.isRecording || !this.currentRecording) return
    const nowOffset = Date.now() - this.recordStartTime

    // Sample every 50ms (20Hz telemetry sampling, capturing first frame immediately)
    if (this.currentRecording.frames.length === 0 || nowOffset - this.lastSampleTime >= 50) {
      this.lastSampleTime = nowOffset
      this.currentRecording.frames.push({
        t: nowOffset,
        x: playerPos.x,
        y: playerPos.y,
        z: playerPos.z,
        yaw,
        isGliding,
      })
    }
  }

  public update(dt: number, playerPos?: THREE.Vector3, playerYaw?: number, isGliding?: boolean): void {
    // 1. Record telemetry
    if (this.isRecording && playerPos) {
      this.sampleFrame(playerPos, playerYaw || 0, !!isGliding)
    }

    // 2. Playback ghost replay with linear interpolation
    if (this.isPlayingGhost && this.activeGhost && this.activeGhost.frames.length > 1) {
      this.playbackElapsedMs += dt * 1000
      const frames = this.activeGhost.frames

      // Find surrounding frames
      let idx = 0
      while (idx < frames.length - 1 && frames[idx + 1].t < this.playbackElapsedMs) {
        idx++
      }

      if (idx >= frames.length - 1) {
        // Replay finished, loop or stop
        this.playbackElapsedMs = 0
        return
      }

      const f0 = frames[idx]
      const f1 = frames[idx + 1]
      const alpha = (this.playbackElapsedMs - f0.t) / (f1.t - f0.t || 1)

      this.ghostPosition.set(
        f0.x + (f1.x - f0.x) * alpha,
        f0.y + (f1.y - f0.y) * alpha,
        f0.z + (f1.z - f0.z) * alpha
      )
      this.ghostYaw = f0.yaw + (f1.yaw - f0.yaw) * alpha
      this.ghostIsGliding = f0.isGliding
    }
  }

  public exportChallengeCode(recording: GhostRecording): string {
    const minified = {
      p: recording.playerName,
      c: recording.courseId,
      t: recording.totalTimeMs,
      f: recording.frames.map(f => [
        Math.round(f.t),
        Math.round(f.x * 10) / 10,
        Math.round(f.y * 10) / 10,
        Math.round(f.z * 10) / 10,
        Math.round(f.yaw * 100) / 100,
        f.isGliding ? 1 : 0,
      ]),
    }
    return 'NW_GHOST_' + btoa(JSON.stringify(minified)).slice(0, 32)
  }

  public addLeaderboardEntry(
    playerName: string,
    category: 'skyline_sprint' | 'inversion_gauntlet' | 'crystal_dragon' | 'boss_speedrun',
    scoreValue: number,
    scoreText: string
  ): LeaderboardEntry {
    const entry: LeaderboardEntry = {
      id: `lb_${Date.now()}`,
      rank: 1,
      playerName,
      category,
      scoreValue,
      scoreText,
      challengeCode: `NW_CHALLENGE_${Math.floor(scoreValue)}`,
    }

    this.leaderboards.push(entry)
    // Recalculate ranks
    const catEntries = this.leaderboards.filter(l => l.category === category)
    catEntries.sort((a, b) => a.scoreValue - b.scoreValue)
    catEntries.forEach((e, idx) => { e.rank = idx + 1 })

    achievements.unlock('ghost_racer')
    this.saveState()
    return entry
  }

  public formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const cents = Math.floor((ms % 1000) / 10)
    const mins = Math.floor(seconds / 60)
    const remSec = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`
  }

  public reset(): void {
    this.isRecording = false
    this.isPlayingGhost = false
    this.currentRecording = null
    this.activeGhost = null
    this.leaderboards = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD_ENTRIES))
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_ghost_replay')
      if (data) {
        const parsed = JSON.parse(data)
        this.leaderboards = parsed.leaderboards || JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD_ENTRIES))
        this.activeGhost = parsed.activeGhost || null
      }
    } catch {
      // Ignored
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        leaderboards: this.leaderboards,
        activeGhost: this.activeGhost,
      }
      localStorage.setItem('cyber_ghost_replay', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const ghostReplay = new GhostReplayEngine()
