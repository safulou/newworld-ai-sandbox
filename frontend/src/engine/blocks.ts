import { BlockType } from '@/types/world'

export const BLOCK_SIZE = 1

export type MaterialRenderType = 'standard' | 'glass' | 'emissive' | 'metallic' | 'foliage'

export interface BlockProperties {
  color: number
  emissiveColor?: number
  emissiveIntensity?: number
  roughness?: number
  metalness?: number
  opacity?: number
  renderType: MaterialRenderType
  solid: boolean
  liquid?: boolean
  falling?: boolean
  lightLevel?: number
  category: 'nature' | 'building' | 'scifi' | 'logic'
  displayName: string
}

export const BLOCK_REGISTRY: Record<BlockType, BlockProperties> = {
  // Nature & Earth
  air: { color: 0x000000, renderType: 'standard', solid: false, category: 'nature', displayName: '空氣' },
  grass: { color: 0x165b33, roughness: 0.8, renderType: 'standard', solid: true, category: 'nature', displayName: '霓光青草' },
  dirt: { color: 0x221a15, roughness: 0.9, renderType: 'standard', solid: true, category: 'nature', displayName: '黑曜壤土' },
  stone: { color: 0x2e3440, roughness: 0.6, metalness: 0.2, renderType: 'standard', solid: true, category: 'nature', displayName: '深空玄武石' },
  wood: { color: 0x3d2314, roughness: 0.7, renderType: 'standard', solid: true, category: 'nature', displayName: '賽博沉香木' },
  leaves: { color: 0x00ff88, emissiveColor: 0x00ff88, emissiveIntensity: 0.5, renderType: 'emissive', solid: true, category: 'nature', displayName: '發光霓虹葉' },
  sand: { color: 0x8b7355, roughness: 0.9, renderType: 'standard', solid: true, falling: true, category: 'nature', displayName: '金沙' },
  water: { color: 0x00aaff, opacity: 0.6, roughness: 0.1, renderType: 'glass', solid: false, liquid: true, category: 'nature', displayName: '量子流體' },
  snow: { color: 0xffffff, emissiveColor: 0xffffff, emissiveIntensity: 0.3, renderType: 'emissive', solid: true, category: 'nature', displayName: '極光凝雪' },
  ice: { color: 0x99e6ff, opacity: 0.8, roughness: 0.05, renderType: 'glass', solid: true, category: 'nature', displayName: '極地晶冰' },
  mud: { color: 0x2c1d11, roughness: 0.95, renderType: 'standard', solid: true, category: 'nature', displayName: '淤泥' },
  clay: { color: 0x778899, roughness: 0.6, renderType: 'standard', solid: true, category: 'nature', displayName: '黏土' },
  gravel: { color: 0x4a4a5a, roughness: 0.9, renderType: 'standard', solid: true, falling: true, category: 'nature', displayName: '礫石' },
  magma: { color: 0xff3300, emissiveColor: 0xff4400, emissiveIntensity: 2.0, lightLevel: 15, renderType: 'emissive', solid: true, category: 'nature', displayName: '熔岩熔岩塊' },
  obsidian: { color: 0x0d0d1a, roughness: 0.2, metalness: 0.8, renderType: 'metallic', solid: true, category: 'nature', displayName: '黑曜石' },
  amethyst: { color: 0x9933ff, emissiveColor: 0xaa44ff, emissiveIntensity: 1.5, lightLevel: 10, renderType: 'emissive', solid: true, category: 'nature', displayName: '紫水晶' },
  emerald: { color: 0x00ff66, emissiveColor: 0x00ff66, emissiveIntensity: 1.2, lightLevel: 9, renderType: 'emissive', solid: true, category: 'nature', displayName: '祖母綠' },
  ruby: { color: 0xff0055, emissiveColor: 0xff0055, emissiveIntensity: 1.4, lightLevel: 9, renderType: 'emissive', solid: true, category: 'nature', displayName: '紅寶石' },
  gold_ore: { color: 0xffcc00, metalness: 0.9, roughness: 0.2, renderType: 'metallic', solid: true, category: 'nature', displayName: '金礦石' },
  diamond_block: { color: 0x00ffff, emissiveColor: 0x00ffff, emissiveIntensity: 1.8, lightLevel: 12, renderType: 'emissive', solid: true, category: 'nature', displayName: '鑽石璀璨塊' },
  flower_rose: { color: 0xff1144, emissiveColor: 0xff1144, emissiveIntensity: 0.8, renderType: 'emissive', solid: false, category: 'nature', displayName: '霓光玫瑰' },
  flower_dandelion: { color: 0xffdd00, emissiveColor: 0xffdd00, emissiveIntensity: 0.8, renderType: 'emissive', solid: false, category: 'nature', displayName: '發光蒲公英' },
  mushroom_glow: { color: 0x00e5ff, emissiveColor: 0x00e5ff, emissiveIntensity: 1.6, lightLevel: 8, renderType: 'emissive', solid: false, category: 'nature', displayName: '幽能夜光菇' },
  bamboo: { color: 0x22cc55, renderType: 'standard', solid: true, category: 'nature', displayName: '青翠竹' },
  cactus: { color: 0x1f7a3a, renderType: 'standard', solid: true, category: 'nature', displayName: '仙人掌' },
  vine: { color: 0x1a8c44, renderType: 'standard', solid: false, category: 'nature', displayName: '藤蔓' },

  // Construction & Architecture
  brick: { color: 0x6e1b1b, roughness: 0.8, renderType: 'standard', solid: true, category: 'building', displayName: '深緋紅磚' },
  glass: { color: 0x00ffff, opacity: 0.35, roughness: 0.05, renderType: 'glass', solid: true, category: 'building', displayName: '全息透光玻璃' },
  plank: { color: 0x2c3e50, roughness: 0.6, renderType: 'standard', solid: true, category: 'building', displayName: '石板甲板' },
  concrete: { color: 0x7f8c8d, roughness: 0.9, renderType: 'standard', solid: true, category: 'building', displayName: '高密混凝土' },
  marble: { color: 0xecf0f1, roughness: 0.2, metalness: 0.1, renderType: 'standard', solid: true, category: 'building', displayName: '白紋大理石' },
  basalt: { color: 0x1c1c24, roughness: 0.7, renderType: 'standard', solid: true, category: 'building', displayName: '黑玄武岩' },
  iron_block: { color: 0xbdc3c7, metalness: 0.85, roughness: 0.25, renderType: 'metallic', solid: true, category: 'building', displayName: '精鋼鍛塊' },
  copper: { color: 0xd35400, metalness: 0.8, roughness: 0.3, renderType: 'metallic', solid: true, category: 'building', displayName: '氧化紫銅' },
  cyber_plating: { color: 0x111936, metalness: 0.9, roughness: 0.2, renderType: 'metallic', solid: true, category: 'building', displayName: '賽博裝甲板' },
  solar_panel: { color: 0x0a192f, emissiveColor: 0x0066cc, emissiveIntensity: 0.4, metalness: 0.7, renderType: 'emissive', solid: true, category: 'building', displayName: '光電太陽能板' },
  hologram_glass: { color: 0xff00ff, opacity: 0.45, renderType: 'glass', solid: true, category: 'building', displayName: '霓虹洋紅玻璃' },
  mirror: { color: 0xffffff, metalness: 0.98, roughness: 0.02, renderType: 'metallic', solid: true, category: 'building', displayName: '超鏡面反光板' },

  // Sci-Fi & Cyber Neon
  neon_cyan: { color: 0x00ffff, emissiveColor: 0x00ffff, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(青)' },
  neon_magenta: { color: 0xff007f, emissiveColor: 0xff007f, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(洋紅)' },
  neon_yellow: { color: 0xffff00, emissiveColor: 0xffff00, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(黃)' },
  neon_green: { color: 0x00ff33, emissiveColor: 0x00ff33, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(翠綠)' },
  neon_orange: { color: 0xff6600, emissiveColor: 0xff6600, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(橙)' },
  neon_purple: { color: 0x8800ff, emissiveColor: 0x8800ff, emissiveIntensity: 2.2, lightLevel: 14, renderType: 'emissive', solid: true, category: 'scifi', displayName: '賽博霓虹(紫)' },
  matrix_grid: { color: 0x003311, emissiveColor: 0x00ff44, emissiveIntensity: 1.2, renderType: 'emissive', solid: true, category: 'scifi', displayName: '矩陣代碼格網' },
  quantum_core: { color: 0x001133, emissiveColor: 0x00e5ff, emissiveIntensity: 2.8, lightLevel: 15, renderType: 'emissive', solid: true, category: 'scifi', displayName: '量子超核' },
  plasma_containment: { color: 0x330033, emissiveColor: 0xff00bb, emissiveIntensity: 2.5, lightLevel: 13, renderType: 'emissive', solid: true, category: 'scifi', displayName: '電漿防護圍阻體' },
  warp_conduit: { color: 0x0d2b45, emissiveColor: 0x203c56, emissiveIntensity: 1.0, renderType: 'emissive', solid: true, category: 'scifi', displayName: '曲率躍遷導管' },

  // Interactive & Logic Systems
  wire_off: { color: 0x441111, renderType: 'standard', solid: false, category: 'logic', displayName: '未通電導線' },
  wire_on: { color: 0xff2222, emissiveColor: 0xff0000, emissiveIntensity: 1.8, lightLevel: 10, renderType: 'emissive', solid: false, category: 'logic', displayName: '導通能量線' },
  logic_gate_and: { color: 0x1f2421, emissiveColor: 0x3d5a80, emissiveIntensity: 0.8, renderType: 'emissive', solid: true, category: 'logic', displayName: '邏輯及閘 (AND)' },
  logic_gate_or: { color: 0x1f2421, emissiveColor: 0x98c1d9, emissiveIntensity: 0.8, renderType: 'emissive', solid: true, category: 'logic', displayName: '邏輯或閘 (OR)' },
  logic_gate_not: { color: 0x1f2421, emissiveColor: 0xee6c4d, emissiveIntensity: 0.8, renderType: 'emissive', solid: true, category: 'logic', displayName: '邏輯非閘 (NOT)' },
  power_source: { color: 0xffcc00, emissiveColor: 0xffbb00, emissiveIntensity: 2.5, lightLevel: 15, renderType: 'emissive', solid: true, category: 'logic', displayName: '恆定量子電源' },
  repeater: { color: 0x334455, emissiveColor: 0x55aaff, emissiveIntensity: 1.2, renderType: 'emissive', solid: true, category: 'logic', displayName: '信號中繼放大器' },
  lever: { color: 0x8b5a2b, metalness: 0.5, renderType: 'standard', solid: true, category: 'logic', displayName: '機械開關撥桿' },
  pressure_plate: { color: 0x556677, renderType: 'standard', solid: false, category: 'logic', displayName: '重力感應踏板' },
  sensor_proximity: { color: 0x1a2530, emissiveColor: 0x00ffaa, emissiveIntensity: 1.5, lightLevel: 8, renderType: 'emissive', solid: true, category: 'logic', displayName: '光電接近感知器' },
  jump_pad: { color: 0x00ffcc, emissiveColor: 0x00ffcc, emissiveIntensity: 2.5, lightLevel: 12, renderType: 'emissive', solid: true, category: 'logic', displayName: '引力躍升彈跳墊' },
  teleporter: { color: 0xaa00ff, emissiveColor: 0xcc44ff, emissiveIntensity: 3.0, lightLevel: 15, renderType: 'emissive', solid: false, category: 'logic', displayName: '量子傳送門' },
  tnt: { color: 0xdd2200, emissiveColor: 0xff3300, emissiveIntensity: 0.8, renderType: 'emissive', solid: true, category: 'logic', displayName: '高能聚合炸藥' },
  light_emitter: { color: 0xffffff, emissiveColor: 0xffffff, emissiveIntensity: 3.0, lightLevel: 15, renderType: 'emissive', solid: true, category: 'logic', displayName: '全光譜照明燈' },
}

export const BLOCK_COLORS: Record<BlockType, number> = Object.fromEntries(
  Object.entries(BLOCK_REGISTRY).map(([type, prop]) => [type, prop.color])
) as Record<BlockType, number>

export function isSolid(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.solid ?? false
}

export function isLiquid(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.liquid ?? false
}

export function isFallingBlock(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.falling ?? false
}

export function getLightLevel(type: BlockType): number {
  return BLOCK_REGISTRY[type]?.lightLevel ?? 0
}

export function blockKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}
