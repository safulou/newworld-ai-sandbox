import * as THREE from 'three'
import { BlockType, BlockPlacement } from '@/types/world'
import { WorldEngine } from './world'
import { history } from './history'
import { sound } from './audio'

export class WorldEditEngine {
  private world: WorldEngine
  private selectionBox: THREE.Box3Helper | null = null
  private box3 = new THREE.Box3()

  public pos1: THREE.Vector3 | null = null
  public pos2: THREE.Vector3 | null = null
  public wandActive: boolean = false

  constructor(world: WorldEngine) {
    this.world = world
  }

  public setPos1(x: number, y: number, z: number, scene: THREE.Scene): void {
    this.pos1 = new THREE.Vector3(x, y, z)
    this.updateSelectionVisual(scene)
    sound.playBlockPlace('glass')
  }

  public setPos2(x: number, y: number, z: number, scene: THREE.Scene): void {
    this.pos2 = new THREE.Vector3(x, y, z)
    this.updateSelectionVisual(scene)
    sound.playBlockPlace('glass')
  }

  private updateSelectionVisual(scene: THREE.Scene): void {
    if (!this.pos1 || !this.pos2) return

    const minX = Math.min(this.pos1.x, this.pos2.x)
    const maxX = Math.max(this.pos1.x, this.pos2.x) + 1
    const minY = Math.min(this.pos1.y, this.pos2.y)
    const maxY = Math.max(this.pos1.y, this.pos2.y) + 1
    const minZ = Math.min(this.pos1.z, this.pos2.z)
    const maxZ = Math.max(this.pos1.z, this.pos2.z) + 1

    this.box3.set(new THREE.Vector3(minX, minY, minZ), new THREE.Vector3(maxX, maxY, maxZ))

    if (!this.selectionBox) {
      this.selectionBox = new THREE.Box3Helper(this.box3, new THREE.Color(0x00ffff))
      scene.add(this.selectionBox)
    }
  }

  public clearSelection(scene: THREE.Scene): void {
    this.pos1 = null
    this.pos2 = null
    if (this.selectionBox) {
      scene.remove(this.selectionBox)
      this.selectionBox.dispose()
      this.selectionBox = null
    }
  }

  // ── Fill Selection ───────────────────────────────────────────────────
  public fillSelection(material: BlockType, hollow = false): number {
    if (!this.pos1 || !this.pos2) return 0

    const minX = Math.min(this.pos1.x, this.pos2.x)
    const maxX = Math.max(this.pos1.x, this.pos2.x)
    const minY = Math.min(this.pos1.y, this.pos2.y)
    const maxY = Math.max(this.pos1.y, this.pos2.y)
    const minZ = Math.min(this.pos1.z, this.pos2.z)
    const maxZ = Math.max(this.pos1.z, this.pos2.z)

    const undoPlacements: BlockPlacement[] = []
    const redoPlacements: BlockPlacement[] = []
    let count = 0

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          if (hollow) {
            const isBorder =
              x === minX || x === maxX ||
              y === minY || y === maxY ||
              z === minZ || z === maxZ
            if (!isBorder) continue
          }

          const prevType = this.world.getBlock(x, y, z)
          undoPlacements.push({ x, y, z, type: prevType })
          redoPlacements.push({ x, y, z, type: material })
          this.world.setBlock(x, y, z, material)
          count++
        }
      }
    }

    history.recordAction(`//set ${material} (${count} blocks)`, undoPlacements, redoPlacements)
    sound.playBuildComplete()
    return count
  }

  // ── Replace Selection ────────────────────────────────────────────────
  public replaceSelection(fromType: BlockType, toType: BlockType): number {
    if (!this.pos1 || !this.pos2) return 0

    const minX = Math.min(this.pos1.x, this.pos2.x)
    const maxX = Math.max(this.pos1.x, this.pos2.x)
    const minY = Math.min(this.pos1.y, this.pos2.y)
    const maxY = Math.max(this.pos1.y, this.pos2.y)
    const minZ = Math.min(this.pos1.z, this.pos2.z)
    const maxZ = Math.max(this.pos1.z, this.pos2.z)

    const undoPlacements: BlockPlacement[] = []
    const redoPlacements: BlockPlacement[] = []
    let count = 0

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const current = this.world.getBlock(x, y, z)
          if (current === fromType) {
            undoPlacements.push({ x, y, z, type: current })
            redoPlacements.push({ x, y, z, type: toType })
            this.world.setBlock(x, y, z, toType)
            count++
          }
        }
      }
    }

    history.recordAction(`//replace ${fromType} -> ${toType} (${count} blocks)`, undoPlacements, redoPlacements)
    sound.playBuildComplete()
    return count
  }

  // ── Sphere Brush Tool ────────────────────────────────────────────────
  public applySphereBrush(center: { x: number; y: number; z: number }, radius: number, material: BlockType, hollow = false): number {
    const r = Math.max(1, Math.round(radius))
    const rSq = r * r
    const innerSq = (r - 1) * (r - 1)

    const undoPlacements: BlockPlacement[] = []
    const redoPlacements: BlockPlacement[] = []
    let count = 0

    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          const dSq = dx * dx + dy * dy + dz * dz
          if (dSq <= rSq) {
            if (hollow && dSq < innerSq) continue

            const x = Math.floor(center.x + dx)
            const y = Math.floor(center.y + dy)
            const z = Math.floor(center.z + dz)

            const prev = this.world.getBlock(x, y, z)
            undoPlacements.push({ x, y, z, type: prev })
            redoPlacements.push({ x, y, z, type: material })
            this.world.setBlock(x, y, z, material)
            count++
          }
        }
      }
    }

    history.recordAction(`Sphere Brush (${count} blocks)`, undoPlacements, redoPlacements)
    sound.playBlockPlace(material)
    return count
  }
}
