import { BlockType, Vec3 } from '@/types/world'
import { sound } from './audio'

export interface LogicWorldAccessor {
  getBlock(x: number, y: number, z: number): BlockType
  setBlock(x: number, y: number, z: number, type: BlockType): void
}

export class CyberLogicEngine {
  private activeSignals = new Map<string, number>() // key -> power level (0-15)
  private teleporters = new Map<string, Vec3>() // teleporter key -> target coords

  public toggleLever(x: number, y: number, z: number, world: LogicWorldAccessor): void {
    const key = `${x},${y},${z}`
    const isPowered = (this.activeSignals.get(key) ?? 0) > 0

    if (isPowered) {
      this.activeSignals.delete(key)
      sound.playUiClick()
    } else {
      this.activeSignals.set(key, 15)
      sound.playUiClick()
    }

    this.propagateSignals(world)
  }

  public checkPlayerInteract(
    playerPos: Vec3,
    world: LogicWorldAccessor,
    onTeleport?: (target: Vec3) => void,
    onJumpPad?: (velocity: Vec3) => void
  ): void {
    const px = Math.floor(playerPos.x)
    const py = Math.floor(playerPos.y)
    const pz = Math.floor(playerPos.z)

    const blockBelow = world.getBlock(px, py, pz)
    const blockUnderFeet = world.getBlock(px, py - 1, pz)

    // 1. Jump Pad Trigger
    if (blockBelow === 'jump_pad' || blockUnderFeet === 'jump_pad') {
      sound.playFanfare()
      onJumpPad?.({ x: 0, y: 18, z: 0 })
    }

    // 2. Quantum Teleporter Trigger
    if (blockBelow === 'teleporter' || blockUnderFeet === 'teleporter') {
      sound.playTeleport()
      const target = this.teleporters.get(`${px},${py},${pz}`) || {
        x: playerPos.x + 32,
        y: playerPos.y + 2,
        z: playerPos.z + 32,
      }
      onTeleport?.(target)
    }

    // 3. Pressure Plate Trigger
    if (blockBelow === 'pressure_plate') {
      this.activeSignals.set(`${px},${py},${pz}`, 15)
      this.propagateSignals(world)
    }
  }

  public propagateSignals(world: LogicWorldAccessor): void {
    const powerSources: Array<[number, number, number]> = []

    // Find all power sources and levers
    for (const [key, power] of this.activeSignals.entries()) {
      if (power > 0) {
        const [x, y, z] = key.split(',').map(Number)
        powerSources.push([x, y, z])
      }
    }

    const visited = new Set<string>()
    const queue: Array<{ pos: [number, number, number]; power: number }> = []

    for (const pos of powerSources) {
      queue.push({ pos, power: 15 })
    }

    while (queue.length > 0) {
      const { pos, power } = queue.shift()!
      const [x, y, z] = pos
      const key = `${x},${y},${z}`

      if (visited.has(key)) continue
      visited.add(key)

      const neighbors: Array<[number, number, number]> = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ]

      for (const [nx, ny, nz] of neighbors) {
        const nType = world.getBlock(nx, ny, nz)

        if (nType === 'wire_off' && power > 1) {
          world.setBlock(nx, ny, nz, 'wire_on')
          queue.push({ pos: [nx, ny, nz], power: power - 1 })
        } else if (nType === 'light_emitter') {
          // Lamp activated
        } else if (nType === 'tnt') {
          // TNT primed
          window.dispatchEvent(new CustomEvent('tnt-ignite', { detail: { x: nx, y: ny, z: nz } }))
        }
      }
    }
  }
}

export const logicEngine = new CyberLogicEngine()
