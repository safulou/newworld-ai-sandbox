import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export type DimensionType = 'overworld' | 'neon_void' | 'crystal_subcore'

export interface DimensionInfo {
  id: DimensionType
  name: string
  icon: string
  themeColor: number
  gravityMultiplier: number
  skyColor: number
  description: string
}

export const DIMENSIONS: Record<DimensionType, DimensionInfo> = {
  overworld: {
    id: 'overworld',
    name: '霓虹都市主次元 (Neon Metropolis)',
    icon: '🏙️',
    themeColor: 0x00ffff,
    gravityMultiplier: 1.0,
    skyColor: 0x060714,
    description: '標準重力與常規物理法則的賽博都會主世界',
  },
  neon_void: {
    id: 'neon_void',
    name: '深空浮島虛空次元 (Neon Void Realm)',
    icon: '🌌',
    themeColor: 0xa371f7,
    gravityMultiplier: 0.45,
    skyColor: 0x12002b,
    description: '低重力漂浮空間，散落著富含紫水晶與量子核心的反重力浮島',
  },
  crystal_subcore: {
    id: 'crystal_subcore',
    name: '晶核地心深淵次元 (Crystal Subcore)',
    icon: '🌋',
    themeColor: 0xff4d00,
    gravityMultiplier: 1.35,
    skyColor: 0x260800,
    description: '超高壓地心結晶層，高重力環境與高能電漿岩漿湧流',
  },
}

export class DimensionWarpEngine {
  public currentDimension: DimensionType = 'overworld'
  public isWarping: boolean = false
  private generatedDimensions: Set<DimensionType> = new Set(['overworld'])

  public reset(): void {
    this.currentDimension = 'overworld'
    this.isWarping = false
  }

  public get currentInfo(): DimensionInfo {
    return DIMENSIONS[this.currentDimension]
  }

  public getGravityMultiplier(): number {
    return this.currentInfo.gravityMultiplier
  }

  /**
   * Warps player to target dimension with full atmospheric and coordinate transition
   */
  public warpTo(
    targetDimension: DimensionType,
    world?: any,
    camera?: THREE.PerspectiveCamera
  ): boolean {
    if (this.currentDimension === targetDimension || this.isWarping) {
      return false
    }

    this.isWarping = true
    sound.playTeleport()

    const prevDim = this.currentDimension
    this.currentDimension = targetDimension

    // Trigger dimensional terrain generation if first visit
    if (world && !this.generatedDimensions.has(targetDimension)) {
      this.generateDimensionTerrain(targetDimension, world)
      this.generatedDimensions.add(targetDimension)
    }

    // Camera displacement & effects
    if (camera) {
      if (targetDimension === 'neon_void') {
        camera.position.set(0, 45, 0) // spawn high on void floating island
      } else if (targetDimension === 'crystal_subcore') {
        camera.position.set(0, 15, 0)
      } else {
        camera.position.set(0, 10, 0)
      }
    }

    // Achievements
    if (targetDimension !== 'overworld') {
      achievements.unlock('dimension_voyager')
    }

    this.dispatchWarpEvent(prevDim, targetDimension)

    setTimeout(() => {
      this.isWarping = false
      sound.playLevelUp()
    }, 1200)

    return true
  }

  /**
   * Procedurally generates a cluster of floating dimension islands in the world
   */
  public generateDimensionTerrain(dim: DimensionType, world: any): void {
    if (!world || typeof world.setBlock !== 'function') return

    if (dim === 'neon_void') {
      // Create Central Void Island (40 to 45 height)
      for (let x = -8; x <= 8; x++) {
        for (let z = -8; z <= 8; z++) {
          const dist = Math.hypot(x, z)
          if (dist <= 7.5) {
            world.setBlock(x, 40, z, 'obsidian')
            world.setBlock(x, 41, z, dist < 5 ? 'amethyst' : 'matrix_grid')
            if (dist < 2.5) {
              world.setBlock(x, 42, z, 'neon_magenta')
            }
          }
        }
      }

      // Floating Quantum Monolith
      world.setBlock(0, 42, 0, 'quantum_core')
      world.setBlock(0, 43, 0, 'warp_conduit')
      world.setBlock(0, 44, 0, 'hologram_glass')

      // Satellite Mini Floating Rocks
      const satellites = [
        { ox: 14, oy: 46, oz: 10 },
        { ox: -12, oy: 43, oz: 14 },
        { ox: 10, oy: 48, oz: -14 },
      ]

      for (const sat of satellites) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            if (Math.hypot(dx, dz) <= 2) {
              world.setBlock(sat.ox + dx, sat.oy, sat.oz + dz, 'amethyst')
              world.setBlock(sat.ox + dx, sat.oy + 1, sat.oz + dz, 'neon_purple')
            }
          }
        }
      }
    } else if (dim === 'crystal_subcore') {
      // Subcore Volcanic Platform
      for (let x = -10; x <= 10; x++) {
        for (let z = -10; z <= 10; z++) {
          const dist = Math.hypot(x, z)
          if (dist <= 9) {
            world.setBlock(x, 12, z, 'basalt')
            world.setBlock(x, 13, z, (dist > 6) ? 'magma' : 'cyber_plating')
          }
        }
      }
      // Core Pillar
      for (let y = 14; y <= 22; y++) {
        world.setBlock(0, y, 0, 'plasma_containment')
      }
      world.setBlock(0, 23, 0, 'quantum_core')
    }
  }

  private dispatchWarpEvent(from: DimensionType, to: DimensionType): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dimension-warp', {
          detail: {
            from,
            to,
            gravity: this.getGravityMultiplier(),
            info: this.currentInfo,
          },
        })
      )
    }
  }
}

export const dimensionWarp = new DimensionWarpEngine()
