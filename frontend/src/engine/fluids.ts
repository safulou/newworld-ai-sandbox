import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { sound } from './audio'

export interface FluidCell {
  x: number
  y: number
  z: number
  type: 'water' | 'magma'
  depth: number
}

export class FluidEngine {
  private activeFluids: Map<string, FluidCell> = new Map()
  private tickInterval: number = 0.3
  private timer: number = 0

  public addSource(x: number, y: number, z: number, type: 'water' | 'magma'): void {
    const key = `${x},${y},${z}`
    this.activeFluids.set(key, { x, y, z, type, depth: 4 })
  }

  public removeSource(x: number, y: number, z: number): void {
    const key = `${x},${y},${z}`
    this.activeFluids.delete(key)
  }

  public update(delta: number, world: any): void {
    this.timer += delta
    if (this.timer < this.tickInterval) return
    this.timer = 0

    if (!world || this.activeFluids.size === 0) return

    const nextBatch: FluidCell[] = []
    const toRemove: string[] = []

    for (const [key, cell] of this.activeFluids.entries()) {
      // If block was replaced or mined away, clear it
      const currentBlock = world.getBlock(cell.x, cell.y, cell.z)
      if (currentBlock !== cell.type && currentBlock !== null) {
        toRemove.push(key)
        continue
      }

      // Check block directly underneath
      const belowBlock = world.getBlock(cell.x, cell.y - 1, cell.z)

      // 1. Water & Magma Interaction: turns into Obsidian!
      if ((cell.type === 'water' && belowBlock === 'magma') || (cell.type === 'magma' && belowBlock === 'water')) {
        world.setBlock(cell.x, cell.y - 1, cell.z, 'obsidian')
        sound.playBlockBreak('glass')
        continue
      }

      // 2. Downward Flow (Gravity)
      if (!belowBlock || belowBlock === 'air') {
        world.setBlock(cell.x, cell.y - 1, cell.z, cell.type)
        nextBatch.push({ x: cell.x, y: cell.y - 1, z: cell.z, type: cell.type, depth: cell.depth })
        continue
      }

      // 3. Horizontal Spread if blocked below and depth > 1
      if (cell.depth > 1) {
        const neighbors = [
          [1, 0], [-1, 0], [0, 1], [0, -1]
        ]
        for (const [dx, dz] of neighbors) {
          const nx = cell.x + dx
          const nz = cell.z + dz
          const adjBlock = world.getBlock(nx, cell.y, nz)

          // Fluid meeting opposite fluid horizontally
          if ((cell.type === 'water' && adjBlock === 'magma') || (cell.type === 'magma' && adjBlock === 'water')) {
            world.setBlock(nx, cell.y, nz, 'obsidian')
            sound.playBlockBreak('glass')
            continue
          }

          if (!adjBlock || adjBlock === 'air') {
            world.setBlock(nx, cell.y, nz, cell.type)
            nextBatch.push({ x: nx, y: cell.y, z: nz, type: cell.type, depth: cell.depth - 1 })
          }
        }
      }
    }

    for (const key of toRemove) {
      this.activeFluids.delete(key)
    }

    for (const next of nextBatch) {
      const key = `${next.x},${next.y},${next.z}`
      if (!this.activeFluids.has(key)) {
        this.activeFluids.set(key, next)
      }
    }
  }

  public checkFluidImmersion(pos: THREE.Vector3, world: any): { inFluid: boolean; type: BlockType | null } {
    if (!world) return { inFluid: false, type: null }
    const bx = Math.floor(pos.x)
    const by = Math.floor(pos.y)
    const bz = Math.floor(pos.z)

    const blockAtFeet = world.getBlock(bx, by, bz)
    const blockAtWaist = world.getBlock(bx, by + 1, bz)

    if (blockAtFeet === 'water' || blockAtWaist === 'water') {
      return { inFluid: true, type: 'water' }
    }
    if (blockAtFeet === 'magma' || blockAtWaist === 'magma') {
      return { inFluid: true, type: 'magma' }
    }

    return { inFluid: false, type: null }
  }

  public clear(): void {
    this.activeFluids.clear()
  }
}

export const fluids = new FluidEngine()
