import { BlockType } from '@/types/world'

export interface DungeonRoom {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
}

/**
 * Procedural Underground Cavern & Cyber Ruin Generator.
 */
export function generateDungeonChunk(
  cx: number,
  cz: number,
  baseBlocks: Record<string, BlockType>
): Record<string, BlockType> {
  const blocks = { ...baseBlocks }
  const minX = cx * 16
  const maxX = (cx + 1) * 16
  const minZ = cz * 16
  const maxZ = (cz + 1) * 16

  // 1. Carve underground cavern chambers at Y: 4 to 12
  const seed = Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453
  const hasCavern = Math.abs(seed - Math.floor(seed)) > 0.4

  if (hasCavern) {
    const chamberCenterX = Math.floor(minX + 8)
    const chamberCenterY = 7
    const chamberCenterZ = Math.floor(minZ + 8)
    const radius = 5

    for (let x = minX; x < maxX; x++) {
      for (let z = minZ; z < maxZ; z++) {
        for (let y = 2; y < 14; y++) {
          const dx = x - chamberCenterX
          const dy = y - chamberCenterY
          const dz = z - chamberCenterZ
          const distSq = dx * dx + dy * dy * 1.5 + dz * dz

          if (distSq < radius * radius) {
            // Hollow out chamber
            blocks[`${x},${y},${z}`] = 'air'
          } else if (distSq < (radius + 1) * (radius + 1)) {
            // Chamber wall: Basalt & Amethyst crystals
            if (y === 2) {
              blocks[`${x},${y},${z}`] = 'magma'
            } else if (Math.random() < 0.15) {
              blocks[`${x},${y},${z}`] = 'amethyst'
            } else if (Math.random() < 0.08) {
              blocks[`${x},${y},${z}`] = 'quantum_core'
            } else {
              blocks[`${x},${y},${z}`] = 'basalt'
            }
          }
        }
      }
    }

    // Spawn ancient cyber altar at center of cavern
    blocks[`${chamberCenterX},2,${chamberCenterZ}`] = 'quantum_core'
    blocks[`${chamberCenterX},3,${chamberCenterZ}`] = 'teleporter'
  }

  return blocks
}
