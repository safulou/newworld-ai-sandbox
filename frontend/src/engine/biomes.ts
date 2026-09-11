import { BlockType, BlockPlacement } from '@/types/world'

export type BiomeType =
  | 'CYBER_METROPOLIS'
  | 'GLACIAL_PEAKS'
  | 'VOLCANIC_UNDERWORLD'
  | 'NEON_FOREST'
  | 'FLOATING_SKYLANDS'

export interface BiomeConfig {
  id: BiomeType
  name: string
  icon: string
  description: string
  primarySurface: BlockType
  subSurface: BlockType
  foundation: BlockType
  foliageOrGlow: BlockType
  rareOre: BlockType
  fogColor: string
  skyColor: string
  lightColor: string
}

export const BIOMES: Record<BiomeType, BiomeConfig> = {
  CYBER_METROPOLIS: {
    id: 'CYBER_METROPOLIS',
    name: '賽博大都會 (Cyber Metropolis)',
    icon: '🏙️',
    description: '高聳的混凝土與鋼骨摩天樓、霓虹迴路公路與量子伺服核心。',
    primarySurface: 'concrete',
    subSurface: 'cyber_plating',
    foundation: 'iron_block',
    foliageOrGlow: 'neon_cyan',
    rareOre: 'gold_ore',
    fogColor: '#0a0e1a',
    skyColor: '#05070e',
    lightColor: '#00f0ff',
  },
  GLACIAL_PEAKS: {
    id: 'GLACIAL_PEAKS',
    name: '極地晶晶山脈 (Glacial Peaks)',
    icon: '🏔️',
    description: '萬年冰川與高純度極光冰晶，隱藏著珍貴的鑽石/藍晶礦脈。',
    primarySurface: 'snow',
    subSurface: 'ice',
    foundation: 'stone',
    foliageOrGlow: 'ice',
    rareOre: 'diamond_block',
    fogColor: '#1a2638',
    skyColor: '#0d1829',
    lightColor: '#80d0ff',
  },
  VOLCANIC_UNDERWORLD: {
    id: 'VOLCANIC_UNDERWORLD',
    name: '熔岩熾熱荒原 (Volcanic Underworld)',
    icon: '🌋',
    description: '熾熱翻滾的玄武岩與熔岩河流，黑曜石熔殼與紅寶石晶簇。',
    primarySurface: 'obsidian',
    subSurface: 'magma',
    foundation: 'stone',
    foliageOrGlow: 'magma',
    rareOre: 'ruby',
    fogColor: '#2b0c0c',
    skyColor: '#1a0505',
    lightColor: '#ff4400',
  },
  NEON_FOREST: {
    id: 'NEON_FOREST',
    name: '螢光生物聚落 (Neon Forest)',
    icon: '🌲',
    description: '散發柔和生機螢光的賽博林木、發光真菌與祖母綠能量池。',
    primarySurface: 'grass',
    subSurface: 'dirt',
    foundation: 'stone',
    foliageOrGlow: 'neon_green',
    rareOre: 'emerald',
    fogColor: '#0a1f14',
    skyColor: '#06140d',
    lightColor: '#39ff14',
  },
  FLOATING_SKYLANDS: {
    id: 'FLOATING_SKYLANDS',
    name: '反重力浮空群島 (Floating Skylands)',
    icon: '🏝️',
    description: '懸浮於萬米高空的雲端白玉島嶼，由古代量子超核提供浮力。',
    primarySurface: 'marble',
    subSurface: 'glass',
    foundation: 'stone',
    foliageOrGlow: 'quantum_core',
    rareOre: 'amethyst',
    fogColor: '#1b122e',
    skyColor: '#100820',
    lightColor: '#bf55ec',
  },
}

export class BiomeGenerator {
  /**
   * Generates a 32x32 terrain chunk tailored to a specific Biome
   */
  public generateBiomeChunk(
    chunkX: number,
    chunkZ: number,
    biomeType: BiomeType
  ): BlockPlacement[] {
    const blocks: BlockPlacement[] = []
    const biome = BIOMES[biomeType]
    const size = 32
    const baseX = chunkX * size
    const baseZ = chunkZ * size

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const wx = baseX + x
        const wz = baseZ + z

        // Height variation using mathematical waves
        let height = 4
        if (biomeType === 'GLACIAL_PEAKS') {
          height = Math.floor(6 + Math.sin(wx * 0.15) * 5 + Math.cos(wz * 0.15) * 5)
        } else if (biomeType === 'VOLCANIC_UNDERWORLD') {
          height = Math.floor(3 + Math.sin(wx * 0.2) * 2 + Math.cos(wz * 0.2) * 2)
        } else if (biomeType === 'FLOATING_SKYLANDS') {
          height = Math.floor(12 + Math.sin(wx * 0.1) * 3 + Math.cos(wz * 0.1) * 3)
        } else {
          height = Math.floor(3 + Math.sin(wx * 0.08) * 2 + Math.cos(wz * 0.08) * 2)
        }

        const startY = biomeType === 'FLOATING_SKYLANDS' ? 8 : 0

        for (let y = startY; y <= height; y++) {
          let blockType: BlockType = biome.foundation

          if (y === height) {
            // Surface layer
            blockType = biome.primarySurface
          } else if (y >= height - 2) {
            // Subsurface
            blockType = biome.subSurface
          }

          // Rare ore generation
          if (y < height - 2 && Math.random() < 0.04) {
            blockType = biome.rareOre
          }

          blocks.push({ x: wx, y, z: wz, type: blockType })
        }

        // Biome Special Features
        if (x % 8 === 0 && z % 8 === 0 && Math.random() > 0.4) {
          if (biomeType === 'CYBER_METROPOLIS') {
            // Neon Streetlight / Beacon
            for (let ly = height + 1; ly <= height + 4; ly++) {
              blocks.push({ x: wx, y: ly, z: wz, type: 'iron_block' })
            }
            blocks.push({ x: wx, y: height + 5, z: wz, type: 'neon_cyan' })
          } else if (biomeType === 'NEON_FOREST') {
            // Cyber Tree
            for (let ty = height + 1; ty <= height + 5; ty++) {
              blocks.push({ x: wx, y: ty, z: wz, type: 'wood' })
            }
            for (let tx = -1; tx <= 1; tx++) {
              for (let tz = -1; tz <= 1; tz++) {
                blocks.push({ x: wx + tx, y: height + 6, z: wz + tz, type: 'neon_green' })
              }
            }
          } else if (biomeType === 'VOLCANIC_UNDERWORLD') {
            // Magma Vent
            blocks.push({ x: wx, y: height + 1, z: wz, type: 'magma' })
          } else if (biomeType === 'FLOATING_SKYLANDS') {
            // Quantum Energy Monolith
            blocks.push({ x: wx, y: height + 1, z: wz, type: 'marble' })
            blocks.push({ x: wx, y: height + 2, z: wz, type: 'quantum_core' })
          }
        }
      }
    }

    return blocks
  }
}

export const biomeGenerator = new BiomeGenerator()
