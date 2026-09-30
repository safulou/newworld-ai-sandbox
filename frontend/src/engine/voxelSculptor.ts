import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface SculptModel {
  id: string
  name: string
  voxels: Record<string, string> // key: `${x},${y},${z}`, value: hex color
  author: string
  createdAt: number
}

export interface HoloProjector {
  id: string
  name: string
  x: number
  y: number
  z: number
  modelId: string
  beamColor: string
  rotationSpeed: number
  scale: number
  isEmitting: boolean
  currentRotation: number
}

export interface HoloSign {
  id: string
  text: string
  x: number
  y: number
  z: number
  color: string
  scrollSpeed: number
  scrollOffset: number
  glow: boolean
}

export const NEON_PALETTE: string[] = [
  '#00f0ff', // Cyber Cyan
  '#ff007f', // Neon Magenta
  '#39ff14', // Electric Lime
  '#ffe600', // Laser Yellow
  '#a855f7', // Synthwave Violet
  '#38bdf8', // Plasma Blue
  '#f97316', // Magma Orange
  '#ffffff', // Quantum White
  '#64748b', // Slate Plating
  '#1e293b', // Deep Carbon
]

export const PRESET_SCULPTS: SculptModel[] = [
  {
    id: 'sculpt_trophy',
    name: '賽博先鋒榮譽獎盃',
    author: 'System',
    createdAt: Date.now(),
    voxels: (() => {
      const v: Record<string, string> = {}
      // Pedestal
      for (let x = 5; x <= 10; x++) {
        for (let z = 5; z <= 10; z++) {
          v[`${x},1,${z}`] = '#64748b'
          v[`${x},2,${z}`] = '#00f0ff'
        }
      }
      // Stem
      for (let y = 3; y <= 8; y++) {
        v[`7,${y},7`] = '#ffe600'
        v[`8,${y},8`] = '#ffe600'
      }
      // Cup
      for (let y = 9; y <= 14; y++) {
        for (let x = 5; x <= 10; x++) {
          for (let z = 5; z <= 10; z++) {
            if (x === 5 || x === 10 || z === 5 || z === 10 || y === 9) {
              v[`${x},${y},${z}`] = '#ffe600'
            }
          }
        }
      }
      // Core gem
      v['7,11,7'] = '#00f0ff'
      v['8,11,8'] = '#00f0ff'
      return v
    })(),
  },
  {
    id: 'sculpt_core',
    name: '全息等離子反應晶核',
    author: 'System',
    createdAt: Date.now(),
    voxels: (() => {
      const v: Record<string, string> = {}
      for (let x = 6; x <= 9; x++) {
        for (let y = 6; y <= 9; y++) {
          for (let z = 6; z <= 9; z++) {
            v[`${x},${y},${z}`] = '#ff007f'
          }
        }
      }
      // Outer ring
      v['5,7,7'] = '#00f0ff'
      v['10,7,7'] = '#00f0ff'
      v['7,5,7'] = '#39ff14'
      v['7,10,7'] = '#39ff14'
      return v
    })(),
  },
]

export class VoxelSculptorEngine {
  public models: SculptModel[] = []
  public activeModel: SculptModel
  public projectors: HoloProjector[] = []
  public signs: HoloSign[] = []

  public activeColor: string = '#00f0ff'
  public activeTool: 'chisel' | 'paint' | 'eraser' | 'box' = 'chisel'

  private meshGroup: THREE.Group | null = null

  constructor() {
    this.models = JSON.parse(JSON.stringify(PRESET_SCULPTS))
    this.activeModel = JSON.parse(JSON.stringify(PRESET_SCULPTS[0]))
    this.loadState()
  }

  public init(scene?: THREE.Scene): void {
    if (scene && !this.meshGroup) {
      this.meshGroup = new THREE.Group()
      this.meshGroup.name = 'HoloProjectorSceneGroup'
      scene.add(this.meshGroup)
    }
  }

  public setVoxel(x: number, y: number, z: number, color?: string): void {
    if (x < 0 || x >= 16 || y < 0 || y >= 16 || z < 0 || z >= 16) return
    const key = `${x},${y},${z}`
    this.activeModel.voxels[key] = color || this.activeColor
    achievements.unlock('holo_artist')
    sound.playUiClick()
    this.saveState()
  }

  public removeVoxel(x: number, y: number, z: number): void {
    const key = `${x},${y},${z}`
    delete this.activeModel.voxels[key]
    sound.playUiClick()
    this.saveState()
  }

  public fillBox(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, color: string): void {
    for (let x = Math.max(0, minX); x <= Math.min(15, maxX); x++) {
      for (let y = Math.max(0, minY); y <= Math.min(15, maxY); y++) {
        for (let z = Math.max(0, minZ); z <= Math.min(15, maxZ); z++) {
          this.activeModel.voxels[`${x},${y},${z}`] = color
        }
      }
    }
    achievements.unlock('holo_artist')
    this.saveState()
  }

  public clearCanvas(): void {
    this.activeModel.voxels = {}
    this.saveState()
  }

  public createNewModel(name: string): SculptModel {
    const newM: SculptModel = {
      id: `sculpt_${Date.now()}`,
      name: name || '未命名微體素創作',
      voxels: {},
      author: '開拓者',
      createdAt: Date.now(),
    }
    this.models.push(newM)
    this.activeModel = newM
    this.saveState()
    return newM
  }

  public selectModel(id: string): void {
    const found = this.models.find(m => m.id === id)
    if (found) {
      this.activeModel = JSON.parse(JSON.stringify(found))
    }
  }

  public saveActiveModel(): void {
    const idx = this.models.findIndex(m => m.id === this.activeModel.id)
    if (idx >= 0) {
      this.models[idx] = JSON.parse(JSON.stringify(this.activeModel))
    } else {
      this.models.push(JSON.parse(JSON.stringify(this.activeModel)))
    }
    achievements.unlock('holo_artist')
    sound.playBuildComplete()
    this.saveState()
  }

  // ── Holo Projector Pedestals ──────────────────────────────────────────
  public addProjector(x: number, y: number, z: number, modelId?: string, beamColor: string = '#00f0ff'): HoloProjector {
    const p: HoloProjector = {
      id: `proj_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: `全息投影台 #${this.projectors.length + 1}`,
      x,
      y,
      z,
      modelId: modelId || this.activeModel.id,
      beamColor,
      rotationSpeed: 1.2,
      scale: 1.0,
      isEmitting: true,
      currentRotation: 0,
    }
    this.projectors.push(p)
    achievements.unlock('holo_artist')
    sound.playFanfare()
    this.saveState()
    return p
  }

  public removeProjector(id: string): void {
    this.projectors = this.projectors.filter(p => p.id !== id)
    this.saveState()
  }

  public toggleProjector(id: string): void {
    const p = this.projectors.find(p => p.id === id)
    if (p) {
      p.isEmitting = !p.isEmitting
      sound.playUiClick()
      this.saveState()
    }
  }

  // ── 3D Neon Holo Signs ───────────────────────────────────────────────
  public addSign(text: string, x: number, y: number, z: number, color: string = '#00f0ff'): HoloSign {
    const sign: HoloSign = {
      id: `sign_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      text,
      x,
      y,
      z,
      color,
      scrollSpeed: 2.0,
      scrollOffset: 0,
      glow: true,
    }
    this.signs.push(sign)
    sound.playUiClick()
    this.saveState()
    return sign
  }

  public removeSign(id: string): void {
    this.signs = this.signs.filter(s => s.id !== id)
    this.saveState()
  }

  public update(dt: number): void {
    // Rotate holographic models in projectors
    for (const p of this.projectors) {
      if (p.isEmitting) {
        p.currentRotation += p.rotationSpeed * dt
      }
    }

    // Scroll neon signs
    for (const sign of this.signs) {
      sign.scrollOffset = (sign.scrollOffset + sign.scrollSpeed * dt * 10) % 100
    }
  }

  public reset(): void {
    this.models = JSON.parse(JSON.stringify(PRESET_SCULPTS))
    this.activeModel = JSON.parse(JSON.stringify(PRESET_SCULPTS[0]))
    this.projectors = [
      {
        id: 'proj_default_1',
        name: '市政大廳全息投影台',
        x: 0,
        y: 5,
        z: 0,
        modelId: 'sculpt_trophy',
        beamColor: '#00f0ff',
        rotationSpeed: 1.0,
        scale: 1.0,
        isEmitting: true,
        currentRotation: 0,
      },
    ]
    this.signs = [
      {
        id: 'sign_default_1',
        text: '★ NEWWORLD AI SANDBOX METAVERSE ★ 歡迎來到賽博開放世界 ★',
        x: 0,
        y: 8,
        z: 0,
        color: '#ff007f',
        scrollSpeed: 2.0,
        scrollOffset: 0,
        glow: true,
      },
    ]
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') {
      this.reset()
      return
    }
    try {
      const data = localStorage.getItem('cyber_voxel_sculptor')
      if (data) {
        const parsed = JSON.parse(data)
        this.models = parsed.models || JSON.parse(JSON.stringify(PRESET_SCULPTS))
        this.activeModel = parsed.activeModel || JSON.parse(JSON.stringify(PRESET_SCULPTS[0]))
        this.projectors = parsed.projectors || []
        this.signs = parsed.signs || []
      } else {
        this.reset()
      }
    } catch {
      this.reset()
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        models: this.models,
        activeModel: this.activeModel,
        projectors: this.projectors,
        signs: this.signs,
      }
      localStorage.setItem('cyber_voxel_sculptor', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const voxelSculptor = new VoxelSculptorEngine()
