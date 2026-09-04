import { createNoise2D } from 'simplex-noise'
import { BlockType } from '@/types/world'

// We create two noise layers: one for macro elevation, one for micro details
const noise2D_macro = createNoise2D()
const noise2D_micro = createNoise2D()

export interface TerrainChunk {
  cx: number
  cz: number
  blocks: Record<string, BlockType>
}

// Generates a 16x16 chunk of terrain procedurally
export function generateChunk(cx: number, cz: number): TerrainChunk {
  const blocks: Record<string, BlockType> = {}
  
  const CHUNK_SIZE = 16
  const startX = cx * CHUNK_SIZE
  const startZ = cz * CHUNK_SIZE
  
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      const worldX = startX + x
      const worldZ = startZ + z
      
      // Calculate elevation
      // Macro noise: smooth rolling hills, scaled down a lot
      const nx = worldX / 64
      const nz = worldZ / 64
      const macro = noise2D_macro(nx, nz) // -1 to 1
      
      // Micro noise: slight bumps
      const micro = noise2D_micro(worldX / 16, worldZ / 16) * 0.2
      
      // Base elevation is around y = 0
      // We want interesting terrain, maybe some floating islands or deep valleys
      const elevation = Math.floor((macro + micro) * 10)
      
      // Generate column of blocks up to the elevation
      for (let y = -5; y <= elevation; y++) {
        const key = `${worldX},${y},${worldZ}`
        
        if (y === elevation) {
          // Surface layer
          if (elevation < -2) {
            blocks[key] = 'sand'
          } else {
            blocks[key] = 'grass'
          }
        } else if (y >= elevation - 3) {
          // Dirt layer underneath
          blocks[key] = 'dirt'
        } else {
          // Deep underground
          blocks[key] = 'stone'
        }
      }
      
      // Fill water if below y = -2
      for (let y = elevation + 1; y <= -2; y++) {
        const key = `${worldX},${y},${worldZ}`
        blocks[key] = 'water'
      }
    }
  }
  
  // Occasionally place some neon flora (Cyber trees)
  // We use a deterministic hash so they don't shift randomly, but Math.random works for this quick demo
  // if we don't care about persistence yet. But for persistence, we should rely on worldX/Z.
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      const worldX = startX + x
      const worldZ = startZ + z
      const elev = Math.floor((noise2D_macro(worldX/64, worldZ/64) + noise2D_micro(worldX/16, worldZ/16)*0.2) * 10)
      
      if (elev > 0) { // On land
        // simple pseudo-random based on coords
        const hash = Math.abs(Math.sin(worldX * 12.9898 + worldZ * 78.233)) * 43758.5453
        const rand = hash - Math.floor(hash)
        if (rand < 0.01) { // 1% chance for a tree
          blocks[`${worldX},${elev+1},${worldZ}`] = 'wood'
          blocks[`${worldX},${elev+2},${worldZ}`] = 'wood'
          blocks[`${worldX},${elev+3},${worldZ}`] = 'leaves'
          blocks[`${worldX-1},${elev+3},${worldZ}`] = 'leaves'
          blocks[`${worldX+1},${elev+3},${worldZ}`] = 'leaves'
          blocks[`${worldX},${elev+3},${worldZ-1}`] = 'leaves'
          blocks[`${worldX},${elev+3},${worldZ+1}`] = 'leaves'
          blocks[`${worldX},${elev+4},${worldZ}`] = 'leaves'
        }
      }
    }
  }
  
  return { cx, cz, blocks }
}
