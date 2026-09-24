import { BlockType } from '@/types/world'
import { sound } from './audio'

export interface VoxelBlock {
  x: number
  y: number
  z: number
  type: BlockType
}

export interface Schematic {
  id: string
  name: string
  category: 'cyber' | 'architecture' | 'scifi' | 'nature'
  author: string
  dimensions: { width: number; height: number; depth: number }
  blocks: VoxelBlock[]
  createdAt: string
}

// -------------------------------------------------------------
// Built-in Cyber Prefabs
// -------------------------------------------------------------

export const PREFAB_NEON_TREE: Schematic = {
  id: 'prefab-neon-tree',
  name: '賽博霓虹樹 (Cyber Neon Tree)',
  category: 'cyber',
  author: 'System Architect',
  createdAt: '2026-09-24',
  dimensions: { width: 5, height: 6, depth: 5 },
  blocks: [
    // Trunk
    { x: 2, y: 0, z: 2, type: 'basalt' },
    { x: 2, y: 1, z: 2, type: 'basalt' },
    { x: 2, y: 2, z: 2, type: 'basalt' },
    { x: 2, y: 3, z: 2, type: 'matrix_grid' },
    // Foliage Layer 1 (y=3)
    { x: 1, y: 3, z: 2, type: 'neon_cyan' },
    { x: 3, y: 3, z: 2, type: 'neon_cyan' },
    { x: 2, y: 3, z: 1, type: 'neon_cyan' },
    { x: 2, y: 3, z: 3, type: 'neon_cyan' },
    // Foliage Layer 2 (y=4)
    { x: 1, y: 4, z: 1, type: 'neon_magenta' },
    { x: 2, y: 4, z: 1, type: 'amethyst' },
    { x: 3, y: 4, z: 1, type: 'neon_magenta' },
    { x: 1, y: 4, z: 2, type: 'amethyst' },
    { x: 2, y: 4, z: 2, type: 'quantum_core' },
    { x: 3, y: 4, z: 2, type: 'amethyst' },
    { x: 1, y: 4, z: 3, type: 'neon_magenta' },
    { x: 2, y: 4, z: 3, type: 'amethyst' },
    { x: 3, y: 4, z: 3, type: 'neon_magenta' },
    // Top Crown (y=5)
    { x: 2, y: 5, z: 2, type: 'neon_cyan' },
    { x: 1, y: 5, z: 2, type: 'neon_magenta' },
    { x: 3, y: 5, z: 2, type: 'neon_magenta' },
  ],
}

export const PREFAB_WARP_GATE: Schematic = {
  id: 'prefab-warp-gate',
  name: '量子傳送星門 (Quantum Warp Gate)',
  category: 'scifi',
  author: 'Nexus Engineer',
  createdAt: '2026-09-24',
  dimensions: { width: 5, height: 6, depth: 3 },
  blocks: [
    // Base platform
    { x: 1, y: 0, z: 1, type: 'obsidian' },
    { x: 2, y: 0, z: 1, type: 'jump_pad' },
    { x: 3, y: 0, z: 1, type: 'obsidian' },
    // Left Pillar
    { x: 0, y: 0, z: 1, type: 'cyber_plating' },
    { x: 0, y: 1, z: 1, type: 'cyber_plating' },
    { x: 0, y: 2, z: 1, type: 'warp_conduit' },
    { x: 0, y: 3, z: 1, type: 'cyber_plating' },
    { x: 0, y: 4, z: 1, type: 'neon_cyan' },
    // Right Pillar
    { x: 4, y: 0, z: 1, type: 'cyber_plating' },
    { x: 4, y: 1, z: 1, type: 'cyber_plating' },
    { x: 4, y: 2, z: 1, type: 'warp_conduit' },
    { x: 4, y: 3, z: 1, type: 'cyber_plating' },
    { x: 4, y: 4, z: 1, type: 'neon_cyan' },
    // Archway Header
    { x: 1, y: 5, z: 1, type: 'cyber_plating' },
    { x: 2, y: 5, z: 1, type: 'quantum_core' },
    { x: 3, y: 5, z: 1, type: 'cyber_plating' },
    // Portal Field (Hologram Glass)
    { x: 2, y: 1, z: 1, type: 'hologram_glass' },
    { x: 2, y: 2, z: 1, type: 'neon_magenta' },
    { x: 2, y: 3, z: 1, type: 'neon_cyan' },
    { x: 2, y: 4, z: 1, type: 'hologram_glass' },
  ],
}

export const PREFAB_CYBER_TERMINAL: Schematic = {
  id: 'prefab-cyber-terminal',
  name: '全息操作控制台 (Holo Terminal)',
  category: 'architecture',
  author: 'Cyberdeck Master',
  createdAt: '2026-09-24',
  dimensions: { width: 3, height: 3, depth: 2 },
  blocks: [
    // Desk Base
    { x: 0, y: 0, z: 0, type: 'cyber_plating' },
    { x: 1, y: 0, z: 0, type: 'matrix_grid' },
    { x: 2, y: 0, z: 0, type: 'cyber_plating' },
    // Screen / Display Mount
    { x: 0, y: 1, z: 0, type: 'neon_yellow' },
    { x: 1, y: 1, z: 0, type: 'hologram_glass' },
    { x: 2, y: 1, z: 0, type: 'neon_yellow' },
    // Top Hologram Projector
    { x: 1, y: 2, z: 0, type: 'quantum_core' },
  ],
}

export const PREFAB_DEFENSE_TURRET: Schematic = {
  id: 'prefab-defense-turret',
  name: '自動哨兵防禦塔 (Sentinel Turret)',
  category: 'cyber',
  author: 'Fortress Guard',
  createdAt: '2026-09-24',
  dimensions: { width: 3, height: 4, depth: 3 },
  blocks: [
    // Tripod Base
    { x: 1, y: 0, z: 1, type: 'basalt' },
    { x: 1, y: 1, z: 1, type: 'cyber_plating' },
    // Turret Pod
    { x: 1, y: 2, z: 1, type: 'plasma_containment' },
    { x: 0, y: 2, z: 1, type: 'neon_orange' },
    { x: 2, y: 2, z: 1, type: 'neon_orange' },
    // Cannon Barrels
    { x: 1, y: 2, z: 0, type: 'obsidian' },
    { x: 1, y: 3, z: 1, type: 'neon_magenta' },
  ],
}

export class SchematicEngine {
  public prefabs: Schematic[] = [
    PREFAB_NEON_TREE,
    PREFAB_WARP_GATE,
    PREFAB_CYBER_TERMINAL,
    PREFAB_DEFENSE_TURRET,
  ]

  public customSchematics: Schematic[] = []
  public activeSchematic: Schematic = PREFAB_NEON_TREE
  public activeRotation: 0 | 90 | 180 | 270 = 0

  constructor() {
    this.loadCustomFromStorage()
  }

  public getAll(): Schematic[] {
    return [...this.prefabs, ...this.customSchematics]
  }

  public selectSchematic(id: string): Schematic | undefined {
    const found = this.getAll().find((s) => s.id === id)
    if (found) {
      this.activeSchematic = found
      sound.playUiClick()
    }
    return found
  }

  public rotateClockwise(): 0 | 90 | 180 | 270 {
    const sequence: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270]
    const idx = sequence.indexOf(this.activeRotation)
    this.activeRotation = sequence[(idx + 1) % sequence.length]
    sound.playUiClick()
    return this.activeRotation
  }

  /**
   * Rotates a schematic's block coordinates around the Y axis
   */
  public rotate(schem: Schematic, angle: 0 | 90 | 180 | 270): Schematic {
    if (angle === 0) return schem

    const origW = schem.dimensions.width
    const origD = schem.dimensions.depth

    let newWidth = origW
    let newDepth = origD

    if (angle === 90 || angle === 270) {
      newWidth = origD
      newDepth = origW
    }

    const rotatedBlocks: VoxelBlock[] = schem.blocks.map((b) => {
      let nx = b.x
      let nz = b.z

      if (angle === 90) {
        nx = origD - 1 - b.z
        nz = b.x
      } else if (angle === 180) {
        nx = origW - 1 - b.x
        nz = origD - 1 - b.z
      } else if (angle === 270) {
        nx = b.z
        nz = origW - 1 - b.x
      }

      return {
        x: nx,
        y: b.y,
        z: nz,
        type: b.type,
      }
    })

    return {
      ...schem,
      dimensions: {
        width: newWidth,
        height: schem.dimensions.height,
        depth: newDepth,
      },
      blocks: rotatedBlocks,
    }
  }

  /**
   * Captures a 3D bounding box region from the world and creates a new Schematic
   */
  public copyRegion(
    world: any,
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
    name: string = '自訂體素藍圖'
  ): Schematic {
    const x0 = Math.min(minX, maxX)
    const y0 = Math.min(minY, maxY)
    const z0 = Math.min(minZ, maxZ)
    const x1 = Math.max(minX, maxX)
    const y1 = Math.max(minY, maxY)
    const z1 = Math.max(minZ, maxZ)

    const width = x1 - x0 + 1
    const height = y1 - y0 + 1
    const depth = z1 - z0 + 1

    const blocks: VoxelBlock[] = []

    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        for (let z = z0; z <= z1; z++) {
          const type = world.getBlock(x, y, z) as BlockType
          if (type && type !== 'air') {
            blocks.push({
              x: x - x0,
              y: y - y0,
              z: z - z0,
              type,
            })
          }
        }
      }
    }

    const schem: Schematic = {
      id: `custom-${Date.now()}`,
      name,
      category: 'cyber',
      author: 'Player',
      dimensions: { width, height, depth },
      blocks,
      createdAt: new Date().toISOString(),
    }

    this.customSchematics.push(schem)
    this.saveCustomToStorage()
    sound.playBuildComplete()
    return schem
  }

  /**
   * Instantly stamps the schematic into the world at (posX, posY, posZ)
   */
  public paste(
    world: any,
    schem: Schematic,
    posX: number,
    posY: number,
    posZ: number,
    angle: 0 | 90 | 180 | 270 = 0,
    ignoreAir: boolean = true
  ): number {
    const oriented = this.rotate(schem, angle)
    let placedCount = 0

    for (const b of oriented.blocks) {
      if (ignoreAir && b.type === 'air') continue
      world.setBlock(posX + b.x, posY + b.y, posZ + b.z, b.type)
      placedCount++
    }

    sound.playBlockPlace('cyber_plating')
    return placedCount
  }

  // -------------------------------------------------------------
  // Storage & JSON Export / Import
  // -------------------------------------------------------------

  public exportJSON(schem: Schematic): string {
    return JSON.stringify(schem, null, 2)
  }

  public downloadJSON(schem: Schematic, filename?: string): void {
    if (typeof window === 'undefined') return
    const name = filename || `${schem.name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_')}.schem.json`
    const jsonStr = this.exportJSON(schem)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  public importJSON(jsonStr: string): Schematic | null {
    try {
      const parsed = JSON.parse(jsonStr) as Schematic
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.blocks) || !parsed.dimensions) {
        return null
      }
      this.customSchematics.push(parsed)
      this.saveCustomToStorage()
      sound.playLevelUp()
      return parsed
    } catch {
      return null
    }
  }

  private saveCustomToStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('cyber_schematics', JSON.stringify(this.customSchematics))
    } catch {
      // storage full or disabled
    }
  }

  private loadCustomFromStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem('cyber_schematics')
      if (raw) {
        this.customSchematics = JSON.parse(raw)
      }
    } catch {
      // ignore
    }
  }
}

export const schematics = new SchematicEngine()
