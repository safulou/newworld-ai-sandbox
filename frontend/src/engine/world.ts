import * as THREE from 'three'
import { BlockType, Vec3, WorldData } from '@/types/world'
import { BLOCK_COLORS, BLOCK_SIZE, blockKey, isSolid } from './blocks'

export class WorldEngine {
  private scene: THREE.Scene
  private blocks: Map<string, { type: BlockType; mesh: THREE.Mesh }> = new Map()
  private geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  setBlock(x: number, y: number, z: number, type: BlockType): void {
    const key = blockKey(x, y, z)
    const existing = this.blocks.get(key)
    if (existing) {
      this.scene.remove(existing.mesh)
      this.blocks.delete(key)
    }
    if (type === 'air') return

    const material = new THREE.MeshLambertMaterial({
      color: BLOCK_COLORS[type],
      transparent: type === 'glass' || type === 'water',
      opacity: type === 'glass' ? 0.5 : type === 'water' ? 0.7 : 1.0,
    })
    const mesh = new THREE.Mesh(this.geometry, material)
    mesh.position.set(x, y, z)
    mesh.userData = { blockType: type, bx: x, by: y, bz: z }
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)
    this.blocks.set(key, { type, mesh })
  }

  getBlock(x: number, y: number, z: number): BlockType {
    return this.blocks.get(blockKey(x, y, z))?.type ?? 'air'
  }

  removeBlock(x: number, y: number, z: number): void {
    this.setBlock(x, y, z, 'air')
  }

  isSolidAt(x: number, y: number, z: number): boolean {
    const b = this.getBlock(Math.floor(x), Math.floor(y), Math.floor(z))
    return isSolid(b)
  }

  generateFlatWorld(width = 32, depth = 32): void {
    for (let x = -width / 2; x < width / 2; x++) {
      for (let z = -depth / 2; z < depth / 2; z++) {
        this.setBlock(x, -1, z, 'grass')
        this.setBlock(x, -2, z, 'dirt')
        this.setBlock(x, -3, z, 'stone')
      }
    }
    // spawn trees
    const treePositions: [number, number][] = [[-6, -6], [6, -8], [-8, 8], [5, 7]]
    for (const [tx, tz] of treePositions) {
      this.placeTree(tx, 0, tz)
    }
  }

  private placeTree(x: number, y: number, z: number): void {
    for (let i = 0; i < 4; i++) this.setBlock(x, y + i, z, 'wood')
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = 3; dy <= 5; dy++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && dy >= 5) continue
          this.setBlock(x + dx, y + dy, z + dz, 'leaves')
        }
      }
    }
  }

  toWorldData(name: string): WorldData {
    const chunkMap: Record<string, Record<string, BlockType>> = {}
    for (const [key, { type }] of this.blocks) {
      const [xs, ys, zs] = key.split(',')
      const cx = Math.floor(parseInt(xs) / 16)
      const cz = Math.floor(parseInt(zs) / 16)
      const ckey = `${cx},${cz}`
      if (!chunkMap[ckey]) chunkMap[ckey] = {}
      chunkMap[ckey][`${xs},${ys},${zs}`] = type
    }
    return {
      name,
      version: '0.1.0',
      chunks: Object.entries(chunkMap).map(([ckey, blocks]) => {
        const [cx, cz] = ckey.split(',').map(Number)
        return { cx, cz, blocks }
      }),
      spawnPoint: { x: 0, y: 2, z: 0 },
    }
  }

  loadWorldData(data: WorldData): void {
    this.clear()
    for (const chunk of data.chunks) {
      for (const [key, type] of Object.entries(chunk.blocks)) {
        const [x, y, z] = key.split(',').map(Number)
        this.setBlock(x, y, z, type)
      }
    }
  }

  clear(): void {
    for (const { mesh } of this.blocks.values()) {
      this.scene.remove(mesh)
    }
    this.blocks.clear()
  }

  getBlockMeshes(): THREE.Mesh[] {
    return Array.from(this.blocks.values()).map(b => b.mesh)
  }

  getSpawnPoint(): Vec3 {
    return { x: 0, y: 2, z: 0 }
  }
}
