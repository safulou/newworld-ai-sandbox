import * as THREE from 'three'

export interface LODChunkMesh {
  cx: number
  cz: number
  lodLevel: number // 0: full detail, 1: medium (2x2 merged), 2: low (4x4 merged)
  group: THREE.Group
}

/**
 * Frustum Culling & Dynamic Distance-based Level-of-Detail (LOD) Manager.
 * Computes chunk distances relative to the camera and manages multi-tier mesh simplification.
 */
export class VoxelLODManager {
  private frustum = new THREE.Frustum()
  private projScreenMatrix = new THREE.Matrix4()

  public updateFrustum(camera: THREE.PerspectiveCamera): void {
    this.projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix)
  }

  public isChunkInFrustum(cx: number, cz: number, minY: number = 0, maxY: number = 64): boolean {
    const minX = cx * 16
    const maxX = (cx + 1) * 16
    const minZ = cz * 16
    const maxZ = (cz + 1) * 16

    const box = new THREE.Box3(
      new THREE.Vector3(minX, minY, minZ),
      new THREE.Vector3(maxX, maxY, maxZ)
    )

    return this.frustum.intersectsBox(box)
  }

  public getLODLevel(distanceChunks: number): number {
    if (distanceChunks <= 2) return 0 // High detail
    if (distanceChunks <= 4) return 1 // Medium detail
    return 2 // Low detail
  }
}

export const lodManager = new VoxelLODManager()
