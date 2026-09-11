import { BlockType, BlockPlacement } from '@/types/world'

/**
 * MagicaVoxel .VOX binary format parser and procedural voxel model generator
 */

export interface ParsedVoxModel {
  name: string
  size: { x: number; y: number; z: number }
  blocks: BlockPlacement[]
  palette: Array<{ r: number; g: number; b: number; a: number }>
}

/**
 * Parses binary .vox (MagicaVoxel) file buffer
 */
export function parseVoxBinary(buffer: ArrayBuffer, modelName: string = 'Imported_Vox'): ParsedVoxModel {
  const view = new DataView(buffer)
  let offset = 0

  // 1. Check Magic number 'VOX ' (0x56 0x4F 0x58 0x20)
  const magic = String.fromCharCode(
    view.getUint8(offset++),
    view.getUint8(offset++),
    view.getUint8(offset++),
    view.getUint8(offset++)
  )

  if (magic !== 'VOX ') {
    throw new Error('Invalid .VOX file header: Expected "VOX "')
  }

  // Version
  offset += 4

  let size = { x: 16, y: 16, z: 16 }
  const rawVoxels: Array<{ x: number; y: number; z: number; colorIndex: number }> = []
  const palette: Array<{ r: number; g: number; b: number; a: number }> = []

  // Read MAIN chunk
  while (offset < buffer.byteLength) {
    if (offset + 12 > buffer.byteLength) break

    const chunkId = String.fromCharCode(
      view.getUint8(offset++),
      view.getUint8(offset++),
      view.getUint8(offset++),
      view.getUint8(offset++)
    )

    const chunkSize = view.getUint32(offset, true)
    offset += 4
    const childrenSize = view.getUint32(offset, true)
    offset += 4

    const chunkEnd = offset + chunkSize

    if (chunkId === 'SIZE') {
      size = {
        x: view.getUint32(offset, true),
        y: view.getUint32(offset + 4, true),
        z: view.getUint32(offset + 8, true),
      }
    } else if (chunkId === 'XYZI') {
      const numVoxels = view.getUint32(offset, true)
      let vOffset = offset + 4
      for (let i = 0; i < numVoxels; i++) {
        if (vOffset + 4 > chunkEnd) break
        const vx = view.getUint8(vOffset++)
        const vy = view.getUint8(vOffset++)
        const vz = view.getUint8(vOffset++)
        const colorIdx = view.getUint8(vOffset++)
        rawVoxels.push({ x: vx, y: vy, z: vz, colorIndex: colorIdx })
      }
    } else if (chunkId === 'RGBA') {
      let pOffset = offset
      for (let i = 0; i < 256; i++) {
        if (pOffset + 4 > chunkEnd) break
        const r = view.getUint8(pOffset++)
        const g = view.getUint8(pOffset++)
        const b = view.getUint8(pOffset++)
        const a = view.getUint8(pOffset++)
        palette.push({ r, g, b, a })
      }
    }

    offset = chunkEnd + (chunkId === 'MAIN' ? 0 : childrenSize)
  }

  // Convert raw voxels to BlockPlacement
  // Mapping color palettes to nearest cyber block types
  const blocks: BlockPlacement[] = rawVoxels.map(v => {
    let blockType: BlockType = 'concrete'
    if (palette.length > v.colorIndex) {
      const col = palette[v.colorIndex - 1] || { r: 128, g: 128, b: 128 }
      blockType = mapColorToBlockType(col.r, col.g, col.b)
    } else {
      // Default material mapping based on height/index
      const types: BlockType[] = ['neon_cyan', 'neon_magenta', 'cyber_plating', 'concrete', 'glass', 'gold_ore']
      blockType = types[v.colorIndex % types.length]
    }

    // MagicaVoxel coordinate system conversion: Z is up, Y is depth
    return {
      x: v.x - Math.floor(size.x / 2),
      y: v.z,
      z: v.y - Math.floor(size.y / 2),
      type: blockType,
    }
  })

  return {
    name: modelName,
    size,
    blocks,
    palette,
  }
}

/**
 * Maps RGB color to closest sandbox BlockType
 */
export function mapColorToBlockType(r: number, g: number, b: number): BlockType {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const isGray = max - min < 25

  if (isGray) {
    if (r > 200) return 'marble'
    if (r > 140) return 'concrete'
    if (r > 70) return 'stone'
    return 'obsidian'
  }

  if (r > 180 && g < 100 && b < 100) return 'ruby'
  if (r < 100 && g > 180 && b < 100) return 'emerald'
  if (r < 100 && g < 100 && b > 180) return 'diamond_block'
  if (r > 180 && g > 180 && b < 100) return 'gold_ore'
  if (r > 180 && g < 100 && b > 180) return 'neon_magenta'
  if (r < 100 && g > 180 && b > 180) return 'neon_cyan'
  if (r > 180 && g > 100 && b < 50) return 'magma'
  if (r < 100 && g > 150 && b > 200) return 'ice'

  return 'cyber_plating'
}

/**
 * Generates built-in high-quality Cyber Voxel models
 */
export function generatePresetVoxModel(presetId: 'mech' | 'spaceship' | 'dragon' | 'spire' | 'cybertree'): ParsedVoxModel {
  const blocks: BlockPlacement[] = []

  switch (presetId) {
    case 'mech': {
      // Cyber Assault Mech
      // Legs
      for (let y = 0; y <= 6; y++) {
        blocks.push({ x: -2, y, z: 0, type: 'cyber_plating' })
        blocks.push({ x: 2, y, z: 0, type: 'cyber_plating' })
        blocks.push({ x: -2, y, z: 1, type: 'iron_block' })
        blocks.push({ x: 2, y, z: 1, type: 'iron_block' })
      }
      // Torso
      for (let x = -3; x <= 3; x++) {
        for (let y = 7; y <= 12; y++) {
          for (let z = -1; z <= 2; z++) {
            const isCore = x === 0 && y === 9 && z === 2
            blocks.push({ x, y, z, type: isCore ? 'quantum_core' : 'cyber_plating' })
          }
        }
      }
      // Cockpit visor
      for (let x = -2; x <= 2; x++) {
        blocks.push({ x, y: 11, z: 2, type: 'neon_cyan' })
      }
      // Arms & Cannons
      for (let y = 8; y <= 11; y++) {
        blocks.push({ x: -4, y, z: 0, type: 'iron_block' })
        blocks.push({ x: 4, y, z: 0, type: 'iron_block' })
      }
      for (let z = 0; z <= 5; z++) {
        blocks.push({ x: -4, y: 9, z, type: z === 5 ? 'neon_magenta' : 'iron_block' })
        blocks.push({ x: 4, y: 9, z, type: z === 5 ? 'neon_magenta' : 'iron_block' })
      }
      // Shoulder missile pods
      blocks.push({ x: -3, y: 13, z: 0, type: 'gold_ore' })
      blocks.push({ x: 3, y: 13, z: 0, type: 'gold_ore' })
      return { name: 'Titan-V Cyber Mech', size: { x: 10, y: 14, z: 8 }, blocks, palette: [] }
    }

    case 'spaceship': {
      // Quantum Interceptor Spaceship
      for (let z = -6; z <= 6; z++) {
        const width = Math.max(1, Math.floor(5 - Math.abs(z) * 0.7))
        for (let x = -width; x <= width; x++) {
          blocks.push({ x, y: 1, z, type: 'cyber_plating' })
          if (Math.abs(x) < width) {
            blocks.push({ x, y: 2, z, type: z < 0 ? 'glass' : 'cyber_plating' })
          }
        }
      }
      // Cockpit
      blocks.push({ x: 0, y: 3, z: -2, type: 'neon_cyan' })
      blocks.push({ x: 0, y: 3, z: -1, type: 'neon_cyan' })
      // Thrusters
      blocks.push({ x: -2, y: 1, z: 6, type: 'neon_magenta' })
      blocks.push({ x: 2, y: 1, z: 6, type: 'neon_magenta' })
      blocks.push({ x: 0, y: 2, z: 6, type: 'quantum_core' })
      // Wings
      for (let wx = 3; wx <= 8; wx++) {
        const wz = Math.floor(wx * 0.6)
        blocks.push({ x: -wx, y: 1, z: wz, type: 'iron_block' })
        blocks.push({ x: wx, y: 1, z: wz, type: 'iron_block' })
        blocks.push({ x: -wx, y: 1, z: wz + 1, type: 'neon_cyan' })
        blocks.push({ x: wx, y: 1, z: wz + 1, type: 'neon_cyan' })
      }
      return { name: 'Hyper-V Phantom Corvette', size: { x: 18, y: 4, z: 14 }, blocks, palette: [] }
    }

    case 'dragon': {
      // Cybernetic Wyvern
      for (let z = -5; z <= 8; z++) {
        blocks.push({ x: 0, y: 4, z, type: 'obsidian' })
        blocks.push({ x: 0, y: 5, z, type: z % 2 === 0 ? 'neon_magenta' : 'obsidian' })
      }
      // Head
      blocks.push({ x: 0, y: 5, z: -6, type: 'obsidian' })
      blocks.push({ x: -1, y: 6, z: -6, type: 'ruby' })
      blocks.push({ x: 1, y: 6, z: -6, type: 'ruby' })
      // Wings
      for (let i = 1; i <= 6; i++) {
        blocks.push({ x: -i, y: 5 + Math.floor(i * 0.5), z: 0, type: 'cyber_plating' })
        blocks.push({ x: i, y: 5 + Math.floor(i * 0.5), z: 0, type: 'cyber_plating' })
        blocks.push({ x: -i, y: 5 + Math.floor(i * 0.5), z: 1, type: 'neon_magenta' })
        blocks.push({ x: i, y: 5 + Math.floor(i * 0.5), z: 1, type: 'neon_magenta' })
      }
      return { name: 'Aether Cyber Dragon', size: { x: 14, y: 8, z: 16 }, blocks, palette: [] }
    }

    case 'spire': {
      // Quantum Obelisk Spire
      for (let y = 0; y <= 24; y++) {
        const radius = Math.max(1, Math.floor(4 - y * 0.12))
        for (let x = -radius; x <= radius; x++) {
          for (let z = -radius; z <= radius; z++) {
            const isEdge = Math.abs(x) === radius || Math.abs(z) === radius
            if (isEdge) {
              const isGlow = y % 3 === 0
              blocks.push({ x, y, z, type: isGlow ? 'neon_cyan' : 'marble' })
            } else if (x === 0 && z === 0) {
              blocks.push({ x, y, z, type: 'quantum_core' })
            }
          }
        }
      }
      // Crown tip
      blocks.push({ x: 0, y: 25, z: 0, type: 'gold_ore' })
      blocks.push({ x: 0, y: 26, z: 0, type: 'neon_cyan' })
      return { name: 'Chronos Quantum Spire', size: { x: 9, y: 27, z: 9 }, blocks, palette: [] }
    }

    case 'cybertree': {
      // Bioluminescent Cyber Tree
      for (let y = 0; y <= 10; y++) {
        blocks.push({ x: 0, y, z: 0, type: 'wood' })
        if (y >= 4) {
          blocks.push({ x: 1, y, z: 0, type: 'neon_green' })
          blocks.push({ x: -1, y, z: 0, type: 'neon_green' })
        }
      }
      // Canopy
      for (let cx = -4; cx <= 4; cx++) {
        for (let cy = 9; cy <= 14; cy++) {
          for (let cz = -4; cz <= 4; cz++) {
            const dist = Math.sqrt(cx * cx + (cy - 11) * (cy - 11) + cz * cz)
            if (dist < 3.8) {
              const isGlow = Math.random() > 0.4
              blocks.push({ x: cx, y: cy, z: cz, type: isGlow ? 'neon_green' : 'leaves' })
            }
          }
        }
      }
      return { name: 'Bioluminescent Cyber Tree', size: { x: 9, y: 15, z: 9 }, blocks, palette: [] }
    }
  }
}
