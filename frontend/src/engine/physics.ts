import { BlockType } from '@/types/world'
import { isFallingBlock, isLiquid } from './blocks'
import { sound } from './audio'

export interface VoxelWorldAccessor {
  getBlock(x: number, y: number, z: number): BlockType
  setBlock(x: number, y: number, z: number, type: BlockType): void
  isSolidAt(x: number, y: number, z: number): boolean
}

export class VoxelPhysicsEngine {
  private activeFallingBlocks = new Set<string>()
  private activeFluids = new Set<string>()
  private tickInterval = 0.1 // 100ms per physics tick
  private timeSinceLastTick = 0

  public registerBlockChange(x: number, y: number, z: number, type: BlockType): void {
    const key = `${x},${y},${z}`
    if (isFallingBlock(type)) {
      this.activeFallingBlocks.add(key)
    }
    if (isLiquid(type)) {
      this.activeFluids.add(key)
    }
    // Also wake up blocks above
    this.activeFallingBlocks.add(`${x},${y + 1},${z}`)
    this.activeFluids.add(`${x},${y + 1},${z}`)
  }

  public update(delta: number, world: VoxelWorldAccessor): void {
    this.timeSinceLastTick += delta
    if (this.timeSinceLastTick < this.tickInterval) return
    this.timeSinceLastTick = 0

    this.stepFallingBlocks(world)
    this.stepFluids(world)
  }

  private stepFallingBlocks(world: VoxelWorldAccessor): void {
    if (this.activeFallingBlocks.size === 0) return

    const keysToProcess = Array.from(this.activeFallingBlocks)
    this.activeFallingBlocks.clear()

    for (const key of keysToProcess) {
      const [x, y, z] = key.split(',').map(Number)
      const currentType = world.getBlock(x, y, z)

      if (!isFallingBlock(currentType)) continue
      if (y <= 0) continue

      const belowType = world.getBlock(x, y - 1, z)
      if (belowType === 'air' || belowType === 'water') {
        // Drop down
        world.setBlock(x, y, z, 'air')
        world.setBlock(x, y - 1, z, currentType)
        this.activeFallingBlocks.add(`${x},${y - 1},${z}`)
        this.activeFallingBlocks.add(`${x},${y + 1},${z}`)
      }
    }
  }

  private stepFluids(world: VoxelWorldAccessor): void {
    if (this.activeFluids.size === 0) return

    const keysToProcess = Array.from(this.activeFluids)
    this.activeFluids.clear()

    for (const key of keysToProcess) {
      const [x, y, z] = key.split(',').map(Number)
      const currentType = world.getBlock(x, y, z)

      if (!isLiquid(currentType)) continue
      if (y <= 0) continue

      // Water interaction with magma -> obsidian
      const neighbors = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ]

      for (const [nx, ny, nz] of neighbors) {
        const nType = world.getBlock(nx, ny, nz)
        if (currentType === 'water' && nType === 'magma') {
          world.setBlock(nx, ny, nz, 'obsidian')
        }
      }

      // Downward flow
      const belowType = world.getBlock(x, y - 1, z)
      if (belowType === 'air') {
        world.setBlock(x, y - 1, z, currentType)
        this.activeFluids.add(`${x},${y - 1},${z}`)
      }
    }
  }

  public triggerExplosion(
    cx: number,
    cy: number,
    cz: number,
    radius: number = 3.5,
    world: VoxelWorldAccessor
  ): void {
    sound.playExplosion()

    const r = Math.ceil(radius)
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          const distSq = dx * dx + dy * dy + dz * dz
          if (distSq <= radius * radius) {
            const bx = Math.floor(cx + dx)
            const by = Math.floor(cy + dy)
            const bz = Math.floor(cz + dz)

            const current = world.getBlock(bx, by, bz)
            if (current !== 'air' && current !== 'obsidian') {
              world.setBlock(bx, by, bz, 'air')
              this.registerBlockChange(bx, by, bz, 'air')
            }
          }
        }
      }
    }
  }
}

export const physics = new VoxelPhysicsEngine()
