import { BlockType, ToolType, Vec3 } from '@/types/world'
import { sound } from './audio'

export interface ToolActionContext {
  targetBlock: Vec3 | null
  targetNormal: Vec3 | null
  currentBlockType: BlockType
  rulerStart: Vec3 | null
  rulerEnd: Vec3 | null
}

export class ToolManager {
  private activeTool: ToolType = 'pickaxe'
  private rulerStart: Vec3 | null = null
  private rulerEnd: Vec3 | null = null

  public getActiveTool(): ToolType {
    return this.activeTool
  }

  public setTool(tool: ToolType): void {
    this.activeTool = tool
    sound.playUiClick()
    window.dispatchEvent(new CustomEvent('tool-change', { detail: tool }))
  }

  public setRulerPoint(pos: Vec3): { distance: number; dx: number; dy: number; dz: number } | null {
    if (!this.rulerStart) {
      this.rulerStart = pos
      sound.playUiClick()
      return null
    } else {
      this.rulerEnd = pos
      sound.playFanfare()
      const dx = Math.abs(this.rulerEnd.x - this.rulerStart.x)
      const dy = Math.abs(this.rulerEnd.y - this.rulerStart.y)
      const dz = Math.abs(this.rulerEnd.z - this.rulerStart.z)
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      const result = { distance, dx, dy, dz }
      this.rulerStart = null
      this.rulerEnd = null
      return result
    }
  }

  public resetRuler(): void {
    this.rulerStart = null
    this.rulerEnd = null
  }
}

export const tools = new ToolManager()
