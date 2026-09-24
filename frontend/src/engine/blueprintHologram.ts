import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { sound } from './audio'
import { achievements } from './achievements'

export interface BlueprintBlock {
  x: number
  y: number
  z: number
  type: BlockType
}

export interface BlueprintDefinition {
  id: string
  name: string
  category: 'tower' | 'gate' | 'base' | 'scifi' | 'custom'
  icon: string
  description: string
  size: { width: number; height: number; depth: number }
  blocks: BlueprintBlock[]
}

// 1. Procedural generation helpers for built-in blueprints
function createWatchtower(): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  // 5x5 base, 12 height
  // 4 corner pillars
  for (let y = 0; y <= 10; y++) {
    blocks.push({ x: 0, y, z: 0, type: 'cyber_plating' })
    blocks.push({ x: 4, y, z: 0, type: 'cyber_plating' })
    blocks.push({ x: 0, y, z: 4, type: 'cyber_plating' })
    blocks.push({ x: 4, y, z: 4, type: 'cyber_plating' })
  }
  // Ladder / Core column in center
  for (let y = 0; y <= 10; y++) {
    blocks.push({ x: 2, y, z: 2, type: y === 0 ? 'jump_pad' : 'neon_cyan' })
  }
  // Platform floor at y=8
  for (let x = 0; x <= 4; x++) {
    for (let z = 0; z <= 4; z++) {
      if (x !== 2 || z !== 2) {
        blocks.push({ x, y: 8, z, type: 'concrete' })
      }
    }
  }
  // Glass railings at y=9
  for (let i = 0; i <= 4; i++) {
    blocks.push({ x: i, y: 9, z: 0, type: 'glass' })
    blocks.push({ x: i, y: 9, z: 4, type: 'glass' })
    blocks.push({ x: 0, y: 9, z: i, type: 'glass' })
    blocks.push({ x: 4, y: 9, z: i, type: 'glass' })
  }
  // Canopy roof at y=11
  for (let x = 0; x <= 4; x++) {
    for (let z = 0; z <= 4; z++) {
      blocks.push({ x, y: 11, z, type: (x === 0 || x === 4 || z === 0 || z === 4) ? 'neon_cyan' : 'cyber_plating' })
    }
  }
  // Crown beacon
  blocks.push({ x: 2, y: 12, z: 2, type: 'light_emitter' })
  return blocks
}

function createToriiGate(): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  // Pillars: x=1 and x=5, height 6
  for (let y = 0; y <= 5; y++) {
    blocks.push({ x: 1, y, z: 1, type: 'neon_magenta' })
    blocks.push({ x: 5, y, z: 1, type: 'neon_magenta' })
    // Stone foundation
    if (y === 0) {
      blocks.push({ x: 1, y: 0, z: 1, type: 'obsidian' })
      blocks.push({ x: 5, y: 0, z: 1, type: 'obsidian' })
    }
  }
  // Cross beam at y=4
  for (let x = 1; x <= 5; x++) {
    blocks.push({ x, y: 4, z: 1, type: 'neon_magenta' })
  }
  // Top curved beam at y=6 (extends from x=0 to x=6)
  for (let x = 0; x <= 6; x++) {
    blocks.push({ x, y: 6, z: 1, type: 'neon_magenta' })
  }
  // Crest at top center
  blocks.push({ x: 3, y: 5, z: 1, type: 'amethyst' })
  blocks.push({ x: 0, y: 7, z: 1, type: 'light_emitter' })
  blocks.push({ x: 6, y: 7, z: 1, type: 'light_emitter' })
  return blocks
}

function createDefenseBunker(): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  // 7x4x7 reinforced bunker
  for (let x = 0; x < 7; x++) {
    for (let z = 0; z < 7; z++) {
      // Floor
      blocks.push({ x, y: 0, z, type: 'iron_block' })
      // Ceiling
      blocks.push({ x, y: 4, z, type: 'iron_block' })

      // Walls
      if (x === 0 || x === 6 || z === 0 || z === 6) {
        for (let y = 1; y < 4; y++) {
          if (y === 2 && (x === 3 || z === 3)) {
            blocks.push({ x, y, z, type: 'hologram_glass' }) // slit window
          } else if (y === 1 && x === 3 && z === 0) {
            // doorway - leave air
          } else {
            blocks.push({ x, y, z, type: 'cyber_plating' })
          }
        }
      }
    }
  }
  // Inside generator & jump defense
  blocks.push({ x: 3, y: 1, z: 3, type: 'quantum_core' })
  blocks.push({ x: 3, y: 2, z: 3, type: 'light_emitter' })
  return blocks
}

function createQuantumPyramid(): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  const levels = 5
  for (let l = 0; l < levels; l++) {
    const y = l
    const min = l
    const max = 8 - l
    for (let x = min; x <= max; x++) {
      for (let z = min; z <= max; z++) {
        if (x === min || x === max || z === min || z === max) {
          blocks.push({ x, y, z, type: l % 2 === 0 ? 'amethyst' : 'matrix_grid' })
        }
      }
    }
  }
  // Apex core
  blocks.push({ x: 4, y: 5, z: 4, type: 'quantum_core' })
  return blocks
}

function createCyberBridge(): BlueprintBlock[] {
  const blocks: BlueprintBlock[] = []
  const length = 10
  for (let z = 0; z < length; z++) {
    // Floor
    blocks.push({ x: 1, y: 0, z, type: 'concrete' })
    blocks.push({ x: 2, y: 0, z, type: 'wire_on' })
    blocks.push({ x: 3, y: 0, z, type: 'concrete' })
    // Railings
    blocks.push({ x: 0, y: 1, z, type: 'neon_yellow' })
    blocks.push({ x: 4, y: 1, z, type: 'neon_yellow' })
    blocks.push({ x: 0, y: 2, z, type: 'glass' })
    blocks.push({ x: 4, y: 2, z, type: 'glass' })
  }
  return blocks.filter(b => b.type)
}

export const BUILTIN_BLUEPRINTS: BlueprintDefinition[] = [
  {
    id: 'cyber_watchtower',
    name: '賽博霓虹瞭望塔',
    category: 'tower',
    icon: '🗼',
    description: '具備全息觀景層、引力躍升核心與頂部燈塔的 12 格高能防禦哨站。',
    size: { width: 5, height: 13, depth: 5 },
    blocks: createWatchtower(),
  },
  {
    id: 'torii_gate',
    name: '賽博日式鳥居',
    category: 'gate',
    icon: '⛩️',
    description: '融合東方神秘與賽博洋紅霓虹的光學結界鳥居，頂部配置雙端能量燈。',
    size: { width: 7, height: 8, depth: 3 },
    blocks: createToriiGate(),
  },
  {
    id: 'defense_bunker',
    name: '重裝空中地堡',
    category: 'base',
    icon: '🛡️',
    description: '精鋼裝甲與全息觀察窗密封防線，內部設置量子超核發電機。',
    size: { width: 7, height: 5, depth: 7 },
    blocks: createDefenseBunker(),
  },
  {
    id: 'quantum_pyramid',
    name: '量子矩陣金字塔',
    category: 'scifi',
    icon: '🔺',
    description: '階梯式紫水晶與矩陣網格神殿，頂端懸浮高純度量子能量核心。',
    size: { width: 9, height: 6, depth: 9 },
    blocks: createQuantumPyramid(),
  },
  {
    id: 'cyber_bridge',
    name: '霓虹高架步道橋',
    category: 'scifi',
    icon: '🌉',
    description: '10格長度的高密混凝土與能量導線長廊，配置防護玻璃與黃金霓虹護欄。',
    size: { width: 5, height: 3, depth: 10 },
    blocks: createCyberBridge(),
  },
]

export class BlueprintHologramEngine {
  private scene: THREE.Scene | null = null
  private previewGroup: THREE.Group = new THREE.Group()
  private activeBlueprint: BlueprintDefinition | null = null
  private anchorPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  private rotationAngle: number = 0 // 0, 90, 180, 270 degrees
  private isPreviewActive: boolean = false
  private animTimer: number = 0

  // Wireframe material for hologram blocks
  private holoMat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.65,
  })

  // Box geometry cached
  private boxGeom: THREE.BoxGeometry = new THREE.BoxGeometry(0.96, 0.96, 0.96)

  constructor() {
    this.previewGroup.name = 'blueprint_hologram_group'
  }

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.scene.add(this.previewGroup)
    this.previewGroup.visible = false
  }

  public getActiveBlueprint(): BlueprintDefinition | null {
    return this.activeBlueprint
  }

  public getIsPreviewActive(): boolean {
    return this.isPreviewActive
  }

  public setAnchorPosition(pos: THREE.Vector3): void {
    this.anchorPosition.copy(pos).floor()
    this.previewGroup.position.copy(this.anchorPosition)
  }

  public rotate(): number {
    this.rotationAngle = (this.rotationAngle + 90) % 360
    this.rebuildHologramMesh()
    sound.playUiClick()
    return this.rotationAngle
  }

  public showBlueprint(blueprintId: string, anchorPos?: THREE.Vector3): void {
    const bp = BUILTIN_BLUEPRINTS.find(b => b.id === blueprintId)
    if (!bp) return

    this.activeBlueprint = bp
    this.isPreviewActive = true
    this.previewGroup.visible = true

    if (anchorPos) {
      this.setAnchorPosition(anchorPos)
    }

    this.rebuildHologramMesh()
    sound.playUiClick()
  }

  public hideBlueprint(): void {
    this.isPreviewActive = false
    this.previewGroup.visible = false
    this.clearHologramMesh()
  }

  private clearHologramMesh(): void {
    while (this.previewGroup.children.length > 0) {
      const child = this.previewGroup.children[0]
      this.previewGroup.remove(child)
      if ((child as any).geometry && (child as any).geometry !== this.boxGeom) {
        ;(child as any).geometry.dispose()
      }
    }
  }

  private rebuildHologramMesh(): void {
    this.clearHologramMesh()
    if (!this.activeBlueprint) return

    const rad = (this.rotationAngle * Math.PI) / 180
    const cos = Math.round(Math.cos(rad))
    const sin = Math.round(Math.sin(rad))

    for (const b of this.activeBlueprint.blocks) {
      // Rotate x, z around origin
      const rx = b.x * cos - b.z * sin
      const rz = b.x * sin + b.z * cos

      const mesh = new THREE.Mesh(this.boxGeom, this.holoMat)
      mesh.position.set(rx + 0.5, b.y + 0.5, rz + 0.5)
      this.previewGroup.children.push(mesh)
      mesh.parent = this.previewGroup
    }
  }

  /**
   * Get transformed world coordinates for each block
   */
  public getTransformedBlocks(): { x: number; y: number; z: number; type: BlockType }[] {
    if (!this.activeBlueprint) return []
    const rad = (this.rotationAngle * Math.PI) / 180
    const cos = Math.round(Math.cos(rad))
    const sin = Math.round(Math.sin(rad))

    const list: { x: number; y: number; z: number; type: BlockType }[] = []
    for (const b of this.activeBlueprint.blocks) {
      const rx = b.x * cos - b.z * sin
      const rz = b.x * sin + b.z * cos
      list.push({
        x: this.anchorPosition.x + rx,
        y: this.anchorPosition.y + b.y,
        z: this.anchorPosition.z + rz,
        type: b.type,
      })
    }
    return list
  }

  /**
   * Instantly converts hologram preview into physical world voxels
   */
  public instantBuild(world: any, multiplayerSync?: any): number {
    const blocks = this.getTransformedBlocks()
    if (blocks.length === 0 || !world) return 0

    for (const b of blocks) {
      world.setBlock(b.x, b.y, b.z, b.type)
      if (multiplayerSync && multiplayerSync.broadcastBlockPlace) {
        multiplayerSync.broadcastBlockPlace(b.x, b.y, b.z, b.type)
      }
    }

    sound.playBuildComplete()
    achievements.unlock('hologram_architect')
    this.hideBlueprint()
    return blocks.length
  }

  /**
   * Dispatches the blueprint construction work to an NPC worker companion
   */
  public async assignToNPC(npcCompanion: any): Promise<number> {
    const blocks = this.getTransformedBlocks()
    if (blocks.length === 0 || !npcCompanion) return 0

    this.hideBlueprint()
    if (npcCompanion.executeBlueprintConstruction) {
      await npcCompanion.executeBlueprintConstruction(blocks)
    }
    achievements.unlock('hologram_architect')
    return blocks.length
  }

  /**
   * Render loop update: pulsing hologram emission
   */
  public update(delta: number): void {
    if (!this.isPreviewActive) return
    this.animTimer += delta * 3
    const pulse = 0.45 + Math.sin(this.animTimer) * 0.25
    this.holoMat.opacity = pulse
  }

  public dispose(): void {
    this.hideBlueprint()
    if (this.scene) {
      this.scene.remove(this.previewGroup)
    }
    this.boxGeom.dispose()
    this.holoMat.dispose()
  }
}

export const blueprintHologram = new BlueprintHologramEngine()
