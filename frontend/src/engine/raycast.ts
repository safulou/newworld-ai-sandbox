import * as THREE from 'three'
import { WorldEngine } from './world'
import { BlockType } from '@/types/world'

export interface RaycastResult {
  hit: boolean
  blockPos: THREE.Vector3
  normalPos: THREE.Vector3
  blockType: BlockType
}

export function raycastBlock(
  camera: THREE.PerspectiveCamera,
  world: WorldEngine,
  maxDistance = 6
): RaycastResult {
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)

  const pos = camera.position.clone()
  const step = 0.05

  let prev = pos.clone()
  for (let d = 0; d < maxDistance; d += step) {
    pos.addScaledVector(dir, step)
    const bx = Math.floor(pos.x)
    const by = Math.floor(pos.y)
    const bz = Math.floor(pos.z)
    const type = world.getBlock(bx, by, bz)
    if (type !== 'air') {
      const normalPos = new THREE.Vector3(
        Math.floor(prev.x),
        Math.floor(prev.y),
        Math.floor(prev.z)
      )
      return {
        hit: true,
        blockPos: new THREE.Vector3(bx, by, bz),
        normalPos,
        blockType: type,
      }
    }
    prev.copy(pos)
  }
  return {
    hit: false,
    blockPos: new THREE.Vector3(),
    normalPos: new THREE.Vector3(),
    blockType: 'air',
  }
}
