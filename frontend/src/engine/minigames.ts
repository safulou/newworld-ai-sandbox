import { BuildAction, Vec3 } from '@/types/world'
import { sound } from './audio'
import { achievements } from './achievements'

export interface MinigameState {
  type: 'none' | 'parkour' | 'target_practice'
  score: number
  timer: number
  isActive: boolean
  checkpointIndex: number
}

export class MinigamesEngine {
  public state: MinigameState = {
    type: 'none',
    score: 0,
    timer: 0,
    isActive: false,
    checkpointIndex: 0,
  }

  public generateParkourCourse(startPos: Vec3): BuildAction[] {
    const actions: BuildAction[] = []
    let curX = startPos.x
    let curY = startPos.y + 1
    let curZ = startPos.z

    const platformMaterials = ['neon_cyan', 'neon_magenta', 'neon_yellow', 'neon_green', 'quantum_core'] as const

    for (let i = 0; i < 20; i++) {
      const dx = (Math.random() - 0.5) * 6
      const dy = Math.floor(Math.random() * 2) + 1
      const dz = (Math.random() - 0.5) * 6

      curX += Math.round(dx)
      curY += dy
      curZ += Math.round(dz)

      const mat = platformMaterials[i % platformMaterials.length]

      // 2x2 platform
      actions.push(
        { type: 'place_block', position: [curX, curY, curZ], material: mat },
        { type: 'place_block', position: [curX + 1, curY, curZ], material: mat },
        { type: 'place_block', position: [curX, curY, curZ + 1], material: mat },
        { type: 'place_block', position: [curX + 1, curY, curZ + 1], material: mat }
      )

      if (i === 19) {
        // Goal beacon
        actions.push({ type: 'place_block', position: [curX, curY + 1, curZ], material: 'jump_pad' })
      }
    }

    this.state = {
      type: 'parkour',
      score: 0,
      timer: 0,
      isActive: true,
      checkpointIndex: 0,
    }

    sound.playFanfare()
    achievements.unlock('jump_master')
    return actions
  }

  public update(delta: number): void {
    if (this.state.isActive) {
      this.state.timer += delta
    }
  }

  public completeMinigame(): { timeSeconds: number; score: number } {
    this.state.isActive = false
    sound.playFanfare()
    const result = { timeSeconds: Math.floor(this.state.timer), score: 1000 - Math.floor(this.state.timer * 10) }
    this.state.type = 'none'
    return result
  }
}

export const minigames = new MinigamesEngine()
