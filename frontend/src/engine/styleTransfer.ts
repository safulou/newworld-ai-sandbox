import { BlockType, BlockPlacement } from '@/types/world'
import { WorldEngine } from './world'
import { history } from './history'
import { sound } from './audio'

export type ArchitecturalStyle = 'cyberpunk' | 'temple' | 'biosphere' | 'gold_palace' | 'winter_frost'

export const STYLE_PALETTES: Record<ArchitecturalStyle, { name: string; icon: string; map: Record<BlockType, BlockType> }> = {
  cyberpunk: {
    name: 'Cyberpunk Neon Matrix',
    icon: '⚡',
    map: {
      air: 'air',
      grass: 'leaves',
      dirt: 'stone',
      stone: 'stone',
      wood: 'brick',
      leaves: 'glass',
      sand: 'stone',
      water: 'water',
      brick: 'brick',
      glass: 'glass',
      plank: 'stone',
      snow: 'glass',
    }
  },
  temple: {
    name: 'Ancient Oriental Temple',
    icon: '⛩️',
    map: {
      air: 'air',
      grass: 'grass',
      dirt: 'dirt',
      stone: 'stone',
      wood: 'wood',
      leaves: 'leaves',
      sand: 'sand',
      water: 'water',
      brick: 'brick',
      glass: 'wood',
      plank: 'wood',
      snow: 'stone',
    }
  },
  biosphere: {
    name: 'Crystal Glass Biosphere',
    icon: '🌿',
    map: {
      air: 'air',
      grass: 'leaves',
      dirt: 'grass',
      stone: 'glass',
      wood: 'wood',
      leaves: 'leaves',
      sand: 'grass',
      water: 'water',
      brick: 'glass',
      glass: 'glass',
      plank: 'glass',
      snow: 'glass',
    }
  },
  gold_palace: {
    name: 'Solar Golden Citadel',
    icon: '👑',
    map: {
      air: 'air',
      grass: 'sand',
      dirt: 'sand',
      stone: 'sand',
      wood: 'brick',
      leaves: 'glass',
      sand: 'sand',
      water: 'water',
      brick: 'brick',
      glass: 'glass',
      plank: 'sand',
      snow: 'sand',
    }
  },
  winter_frost: {
    name: 'Frozen Crystal Glacier',
    icon: '❄️',
    map: {
      air: 'air',
      grass: 'snow',
      dirt: 'stone',
      stone: 'stone',
      wood: 'glass',
      leaves: 'snow',
      sand: 'snow',
      water: 'glass',
      brick: 'stone',
      glass: 'glass',
      plank: 'glass',
      snow: 'snow',
    }
  }
}

/**
 * Transforms all player-placed blocks within a bounding radius to the target architectural theme
 */
export function applyStyleTransfer(
  world: WorldEngine,
  style: ArchitecturalStyle,
  center: { x: number; y: number; z: number },
  radius: number = 24
): number {
  const palette = STYLE_PALETTES[style]
  if (!palette) return 0

  const undoPlacements: BlockPlacement[] = []
  const redoPlacements: BlockPlacement[] = []
  let count = 0

  for (let x = center.x - radius; x <= center.x + radius; x++) {
    for (let y = 0; y <= 40; y++) {
      for (let z = center.z - radius; z <= center.z + radius; z++) {
        const current = world.getBlock(x, y, z)
        if (current !== 'air') {
          const target = palette.map[current]
          if (target && target !== current) {
            undoPlacements.push({ x, y, z, type: current })
            redoPlacements.push({ x, y, z, type: target })
            world.setBlock(x, y, z, target)
            count++
          }
        }
      }
    }
  }

  if (count > 0) {
    history.recordAction(`Style: ${palette.name} (${count} blocks)`, undoPlacements, redoPlacements)
    sound.playBuildComplete()
  }

  return count
}
