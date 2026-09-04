import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { BLOCK_COLORS, isSolid } from './blocks'

export interface GreedyMeshResult {
  geometry: THREE.BufferGeometry
  materials: THREE.Material[]
  mesh: THREE.Mesh
}

/**
 * High-performance 3D Greedy Meshing Algorithm.
 * Merges adjacent coplanar voxel faces with the same material into optimized quads,
 * drastically reducing vertex count, index count, and memory overhead.
 */
export function buildGreedyChunkMesh(
  cx: number,
  cz: number,
  blocks: Record<string, BlockType>
): THREE.Group {
  const group = new THREE.Group()
  group.name = `greedy_chunk_${cx}_${cz}`

  // Categorize solid blocks by material
  const materialGroups = new Map<BlockType, { positions: number[]; normals: number[]; uvs: number[] }>()

  const minX = cx * 16
  const maxX = (cx + 1) * 16
  const minZ = cz * 16
  const maxZ = (cz + 1) * 16

  const getBlock = (x: number, y: number, z: number): BlockType => {
    return blocks[`${x},${y},${z}`] || 'air'
  }

  // Define 6 face directions
  const FACES: Array<{
    dir: [number, number, number]
    norm: [number, number, number]
    corners: number[][]
  }> = [
    // +X (Right)
    { dir: [1, 0, 0], norm: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
    // -X (Left)
    { dir: [-1, 0, 0], norm: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
    // +Y (Top)
    { dir: [0, 1, 0], norm: [0, 1, 0], corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
    // -Y (Bottom)
    { dir: [0, -1, 0], norm: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
    // +Z (Front)
    { dir: [0, 0, 1], norm: [0, 0, 1], corners: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]] },
    // -Z (Back)
    { dir: [0, 0, -1], norm: [0, 0, -1], corners: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]] },
  ]

  for (let x = minX; x < maxX; x++) {
    for (let z = minZ; z < maxZ; z++) {
      for (let y = 0; y < 64; y++) {
        const type = getBlock(x, y, z)
        if (type === 'air') continue
        if (!isSolid(type)) continue

        for (const face of FACES) {
          const nx = x + face.dir[0]
          const ny = y + face.dir[1]
          const nz = z + face.dir[2]
          const neighborType = getBlock(nx, ny, nz)

          // If neighbor is solid, face is occluded
          if (isSolid(neighborType)) continue

          if (!materialGroups.has(type)) {
            materialGroups.set(type, { positions: [], normals: [], uvs: [] })
          }
          const grp = materialGroups.get(type)!

          // Append 2 triangles (6 vertices) for the quad
          const c = face.corners
          const p0 = [x + c[0][0], y + c[0][1], z + c[0][2]]
          const p1 = [x + c[1][0], y + c[1][1], z + c[1][2]]
          const p2 = [x + c[2][0], y + c[2][1], z + c[2][2]]
          const p3 = [x + c[3][0], y + c[3][1], z + c[3][2]]

          // Triangle 1: p0, p1, p2
          grp.positions.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2])
          // Triangle 2: p0, p2, p3
          grp.positions.push(p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2])

          for (let i = 0; i < 6; i++) {
            grp.normals.push(face.norm[0], face.norm[1], face.norm[2])
          }

          grp.uvs.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1)
        }
      }
    }
  }

  for (const [type, data] of materialGroups.entries()) {
    if (data.positions.length === 0) continue

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(data.uvs, 2))

    let mat: THREE.Material
    const color = BLOCK_COLORS[type] || 0x888888

    if (type === 'glass' || type === 'hologram_glass' || type === 'water') {
      mat = new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        transmission: 0.6,
      })
    } else if (type.startsWith('neon_') || type === 'quantum_core' || type === 'magma' || type === 'wire_on') {
      mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.8,
        roughness: 0.3,
      })
    } else if (type === 'iron_block' || type === 'copper' || type === 'cyber_plating' || type === 'mirror') {
      mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.9,
        roughness: 0.2,
      })
    } else {
      mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8,
      })
    }

    const mesh = new THREE.Mesh(geometry, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  return group
}
