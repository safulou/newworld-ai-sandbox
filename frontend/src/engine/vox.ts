import { BlockType, BlockPlacement } from '@/types/world'

/**
 * Utility to generate volume fills and parse/export standard voxel structures
 */

export function fillVolume(
  from: { x: number; y: number; z: number },
  to: { x: number; y: number; z: number },
  material: BlockType,
  hollow: boolean = false
): BlockPlacement[] {
  const minX = Math.min(from.x, to.x)
  const maxX = Math.max(from.x, to.x)
  const minY = Math.min(from.y, to.y)
  const maxY = Math.max(from.y, to.y)
  const minZ = Math.min(from.z, to.z)
  const maxZ = Math.max(from.z, to.z)

  const placements: BlockPlacement[] = []

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        if (hollow) {
          const isEdge =
            x === minX || x === maxX ||
            y === minY || y === maxY ||
            z === minZ || z === maxZ
          if (!isEdge) continue
        }
        placements.push({ x, y, z, type: material })
      }
    }
  }

  return placements
}

export function exportVoxelSchematic(name: string, blocks: BlockPlacement[]): Blob {
  const payload = {
    name,
    version: '1.0.0',
    generator: 'NewWorld AI Sandbox',
    exportedAt: new Date().toISOString(),
    blockCount: blocks.length,
    blocks,
  }

  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
}
