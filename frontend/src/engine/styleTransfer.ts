import { BlockType, BlockPlacement } from '@/types/world'
import { WorldEngine } from './world'
import { history } from './history'
import { sound } from './audio'
import { achievements } from './achievements'

export type ArchitecturalStyle = 'cyberpunk' | 'temple' | 'biosphere' | 'gold_palace' | 'winter_frost'

export const STYLE_PALETTES: Record<ArchitecturalStyle, { name: string; icon: string; map: Partial<Record<BlockType, BlockType>> }> = {
  cyberpunk: {
    name: 'Cyberpunk Neon Matrix (賽博霓虹矩陣)',
    icon: '⚡',
    map: {
      grass: 'matrix_grid',
      dirt: 'basalt',
      stone: 'cyber_plating',
      wood: 'neon_cyan',
      leaves: 'neon_magenta',
      sand: 'basalt',
      water: 'neon_cyan',
      brick: 'neon_orange',
      glass: 'hologram_glass',
      plank: 'cyber_plating',
      snow: 'neon_yellow',
      concrete: 'cyber_plating',
      marble: 'neon_cyan',
    }
  },
  temple: {
    name: 'Ancient Oriental Temple (東方古剎神龕)',
    icon: '⛩️',
    map: {
      grass: 'grass',
      dirt: 'dirt',
      stone: 'basalt',
      wood: 'wood',
      leaves: 'bamboo',
      sand: 'sand',
      water: 'water',
      brick: 'brick',
      glass: 'wood',
      plank: 'wood',
      snow: 'marble',
      concrete: 'stone',
      cyber_plating: 'wood',
    }
  },
  biosphere: {
    name: 'Crystal Glass Biosphere (晶瑩生態穹頂)',
    icon: '🌿',
    map: {
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
      snow: 'ice',
      concrete: 'glass',
      cyber_plating: 'glass',
    }
  },
  gold_palace: {
    name: 'Solar Golden Citadel (輝煌太陽金殿)',
    icon: '👑',
    map: {
      grass: 'gold_ore',
      dirt: 'sand',
      stone: 'marble',
      wood: 'gold_ore',
      leaves: 'amethyst',
      sand: 'sand',
      water: 'diamond_block',
      brick: 'ruby',
      glass: 'hologram_glass',
      plank: 'gold_ore',
      snow: 'marble',
      concrete: 'marble',
      cyber_plating: 'gold_ore',
    }
  },
  winter_frost: {
    name: 'Frozen Crystal Glacier (極光冰霜冰川)',
    icon: '❄️',
    map: {
      grass: 'snow',
      dirt: 'stone',
      stone: 'ice',
      wood: 'glass',
      leaves: 'snow',
      sand: 'snow',
      water: 'ice',
      brick: 'stone',
      glass: 'ice',
      plank: 'ice',
      snow: 'snow',
      concrete: 'ice',
      cyber_plating: 'ice',
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
    achievements.unlock('style_transfer')
  }

  return count
}
