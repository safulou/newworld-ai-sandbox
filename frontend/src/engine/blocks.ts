import { BlockType } from '@/types/world'

export const BLOCK_SIZE = 1

// Premium Neon Oasis palette
export const BLOCK_COLORS: Record<BlockType, number> = {
  air:    0x000000,
  grass:  0x0b3d1f,  // very dark moss green
  dirt:   0x151110,  // dark obsidian/asphalt
  stone:  0x1a1a24,  // cyber metal grey
  wood:   0x2d1711,  // dark charred wood
  leaves: 0x00ff88,  // glowing neon green flora
  sand:   0x3d352b,  // dark bronze
  water:  0x00aaff,  // glowing cyan water
  brick:  0x4a1515,  // deep crimson metal
  glass:  0x00ffff,  // pure cyan glowing glass
  plank:  0x1c2b36,  // dark slate blue
  snow:   0xffffff,  // pure white emissive
}

export const SOLID_BLOCKS = new Set<BlockType>([
  'grass', 'dirt', 'stone', 'wood', 'leaves',
  'sand', 'brick', 'glass', 'plank', 'snow',
])

export function isSolid(type: BlockType): boolean {
  return SOLID_BLOCKS.has(type)
}

export function blockKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}
