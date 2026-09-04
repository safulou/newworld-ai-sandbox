import * as THREE from 'three'
import { WorldEngine } from './world'

export interface RaycastResult {
  hit: boolean
  point: THREE.Vector3
  normal: THREE.Vector3
  npcName?: string
}

const raycaster = new THREE.Raycaster()

export function raycastMouse(
  camera: THREE.PerspectiveCamera,
  mouse: THREE.Vector2,
  world: WorldEngine,
  scene: THREE.Scene
): RaycastResult {
  raycaster.setFromCamera(mouse, camera)

  // 1. Check for NPCs first
  const npcMeshes = scene.children.filter(c => c.userData?.isNPC)
  const npcIntersects = raycaster.intersectObjects(npcMeshes, true)
  if (npcIntersects.length > 0) {
    // find root NPC group
    let obj: THREE.Object3D | null = npcIntersects[0].object
    while (obj && !obj.userData?.isNPC) obj = obj.parent
    if (obj) {
      return {
        hit: true,
        point: npcIntersects[0].point,
        normal: npcIntersects[0].face?.normal ?? new THREE.Vector3(0,1,0),
        npcName: obj.userData.name
      }
    }
  }

  // 2. Check for world blocks & terrain
  const worldMeshes = world.getRaycastableMeshes()
  const intersects = raycaster.intersectObjects(worldMeshes, false)
  if (intersects.length > 0) {
    return {
      hit: true,
      point: intersects[0].point,
      normal: intersects[0].face?.normal ?? new THREE.Vector3(0,1,0),
    }
  }

  return { hit: false, point: new THREE.Vector3(), normal: new THREE.Vector3() }
}
