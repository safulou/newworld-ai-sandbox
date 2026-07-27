import { BlockType } from '@/types/world'

export const BLOCK_SIZE = 1

export const BLOCK_COLORS: Record<BlockType, number> = {
  air:    0x000000,
  grass:  0x5a8a3c,
  dirt:   0x8b5e3c,
  stone:  0x888888,
  wood:   0x6b4423,
  leaves: 0x2d6e2d,
  sand:   0xe2c97e,
  water:  0x3a7dc9,
  brick:  0xb05030,
  glass:  0xadd8e6,
  plank:  0xc8a05a,
  snow:   0xf0f0f0,
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
