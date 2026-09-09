import { BlockType, BuildAction, Vec3 } from '@/types/world'
import { sound } from './audio'

export interface CustomBlueprint {
  id: string
  name: string
  author: string
  description: string
  size: { width: number; height: number; depth: number }
  blocksCount: number
  actions: BuildAction[]
  createdAt: string
}

export class SchematicManager {
  private customBlueprints: CustomBlueprint[] = []

  constructor() {
    this.load()
  }

  private load(): void {
    const saved = localStorage.getItem('nw_custom_blueprints')
    if (saved) {
      try {
        this.customBlueprints = JSON.parse(saved)
      } catch { /* ignore */ }
    }
  }

  public save(): void {
    localStorage.setItem('nw_custom_blueprints', JSON.stringify(this.customBlueprints))
  }

  public getAll(): CustomBlueprint[] {
    return this.customBlueprints
  }

  public createBlueprintFromVolume(
    name: string,
    author: string,
    description: string,
    pos1: Vec3,
    pos2: Vec3,
    getBlock: (x: number, y: number, z: number) => BlockType
  ): CustomBlueprint {
    const minX = Math.min(pos1.x, pos2.x)
    const maxX = Math.max(pos1.x, pos2.x)
    const minY = Math.min(pos1.y, pos2.y)
    const maxY = Math.max(pos1.y, pos2.y)
    const minZ = Math.min(pos1.z, pos2.z)
    const maxZ = Math.max(pos1.z, pos2.z)

    const actions: BuildAction[] = []

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const type = getBlock(x, y, z)
          if (type !== 'air') {
            actions.push({
              type: 'place_block',
              position: [x - minX, y - minY, z - minZ],
              material: type,
            })
          }
        }
      }
    }

    const bp: CustomBlueprint = {
      id: 'bp_' + Date.now(),
      name,
      author,
      description,
      size: {
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        depth: maxZ - minZ + 1,
      },
      blocksCount: actions.length,
      actions,
      createdAt: new Date().toLocaleDateString(),
    }

    this.customBlueprints.unshift(bp)
    this.save()
    sound.playBuildComplete()
    return bp
  }
}

export const schematicManager = new SchematicManager()
