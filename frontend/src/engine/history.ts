import { BlockPlacement, BlockType } from '@/types/world'
import type { WorldEngine } from './world'
import { sound } from './audio'

export interface HistoryEntry {
  description: string
  timestamp: number
  undoPlacements: BlockPlacement[]
  redoPlacements: BlockPlacement[]
}

export class HistoryEngine {
  private undoStack: HistoryEntry[] = []
  private redoStack: HistoryEntry[] = []
  private maxHistory: number = 30

  recordAction(description: string, undoPlacements: BlockPlacement[], redoPlacements: BlockPlacement[]): void {
    if (undoPlacements.length === 0 && redoPlacements.length === 0) return

    this.undoStack.push({
      description,
      timestamp: Date.now(),
      undoPlacements,
      redoPlacements,
    })

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift()
    }

    // Clear redo stack on new action
    this.redoStack = []
  }

  undo(world: WorldEngine): string | null {
    if (this.undoStack.length === 0) return null

    const entry = this.undoStack.pop()!
    this.redoStack.push(entry)

    for (const b of entry.undoPlacements) {
      world.setBlock(b.x, b.y, b.z, b.type as BlockType)
    }

    sound.playBlockBreak()
    return entry.description
  }

  redo(world: WorldEngine): string | null {
    if (this.redoStack.length === 0) return null

    const entry = this.redoStack.pop()!
    this.undoStack.push(entry)

    for (const b of entry.redoPlacements) {
      world.setBlock(b.x, b.y, b.z, b.type as BlockType)
    }

    sound.playBlockPlace('stone')
    return entry.description
  }

  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
  }
}

export const history = new HistoryEngine()
