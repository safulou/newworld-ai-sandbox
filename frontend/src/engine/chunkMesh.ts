import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { BLOCK_COLORS, BLOCK_REGISTRY, isSolid } from './blocks'
import { makePremiumMaterial } from './scene'

export interface ChunkMeshGroup {
  cx: number
  cz: number
  instancedMeshes: Map<BlockType, THREE.InstancedMesh>
  rootGroup: THREE.Group
}

const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1)

/**
 * Builds optimized InstancedMesh objects for a 16x16 chunk.
 * Skips fully occluded voxels to drastically reduce vertex and instance count.
 */
export function buildChunkInstancedMeshes(
  cx: number,
  cz: number,
  blocks: Record<string, BlockType>
): ChunkMeshGroup {
  const rootGroup = new THREE.Group()
  rootGroup.name = `chunk_${cx}_${cz}`

  // Group block coordinates by material
  const materialGroups = new Map<BlockType, THREE.Vector3[]>()

  // Fast occlusion check helper
  const blockKeys = new Set(Object.keys(blocks))
  const isOccluded = (x: number, y: number, z: number) => {
    return (
      blockKeys.has(`${x + 1},${y},${z}`) &&
      blockKeys.has(`${x - 1},${y},${z}`) &&
      blockKeys.has(`${x},${y + 1},${z}`) &&
      blockKeys.has(`${x},${y - 1},${z}`) &&
      blockKeys.has(`${x},${y},${z + 1}`) &&
      blockKeys.has(`${x},${y},${z - 1}`)
    )
  }

  for (const [key, type] of Object.entries(blocks)) {
    if (type === 'air') continue
    const [x, y, z] = key.split(',').map(Number)

    // Hidden face / solid interior occlusion skipping
    if (isSolid(type) && isOccluded(x, y, z)) {
      continue
    }

    if (!materialGroups.has(type)) {
      materialGroups.set(type, [])
    }
    materialGroups.get(type)!.push(new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5))
  }

  const instancedMeshes = new Map<BlockType, THREE.InstancedMesh>()
  const dummy = new THREE.Object3D()

  for (const [type, positions] of materialGroups.entries()) {
    if (positions.length === 0) continue

    const prop = BLOCK_REGISTRY[type]
    let matType: 'standard' | 'glass' | 'emissive' = 'standard'
    if (prop?.renderType === 'glass') matType = 'glass'
    else if (prop?.renderType === 'emissive' || type.startsWith('neon_') || type === 'quantum_core') matType = 'emissive'

    const mat = makePremiumMaterial(BLOCK_COLORS[type] || 0x888888, matType)
    const instancedMesh = new THREE.InstancedMesh(unitBoxGeo, mat, positions.length)
    instancedMesh.castShadow = matType !== 'glass'
    instancedMesh.receiveShadow = true

    for (let i = 0; i < positions.length; i++) {
      dummy.position.copy(positions[i])
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    instancedMeshes.set(type, instancedMesh)
    rootGroup.add(instancedMesh)
  }

  return { cx, cz, instancedMeshes, rootGroup }
}
