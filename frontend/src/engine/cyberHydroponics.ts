import { sound } from './audio'
import { achievements } from './achievements'

export type CropStage = 'seed' | 'sprout' | 'flowering' | 'mature'

export interface CyberCropSpecies {
  id: string
  name: string
  scientificName: string
  icon: string
  color: string
  description: string
  growthTimeSeconds: number
}

export interface HydroponicPod {
  id: string
  slotIndex: number
  cropId: string | null
  stage: CropStage
  growthProgress: number // 0 to 100
  hydration: number // 0 to 100
  autoMist: boolean
}

export interface BuffEffect {
  id: string
  name: string
  icon: string
  color: string
  durationSeconds: number
  remainingSeconds: number
}

export interface PotionRecipe {
  id: string
  name: string
  icon: string
  requiredCropId: string
  requiredCount: number
  buffId: string
  durationSeconds: number
  description: string
}

export const CROP_SPECIES: Record<string, CyberCropSpecies> = {
  quantum_spores: {
    id: 'quantum_spores',
    name: '量子靈芝孢子',
    scientificName: 'Ganoderma quantus',
    icon: '🍄',
    color: '#ec4899',
    description: '富含零點能量的發光真菌，散發紫粉色微粒。',
    growthTimeSeconds: 12,
  },
  plasma_melon: {
    id: 'plasma_melon',
    name: '等離子高能蜜瓜',
    scientificName: 'Cucumis plasmaticus',
    icon: '🍈',
    color: '#00ffff',
    description: '果肉內蘊含高頻電漿離子，具備極強的生化推進能。',
    growthTimeSeconds: 15,
  },
  matrix_nightshade: {
    id: 'matrix_nightshade',
    name: '矩陣夜光莓',
    scientificName: 'Solanum matrix',
    icon: '🫐',
    color: '#10b981',
    description: '在黑暗水耕槽中自主光合發光，能大幅強化生物視網膜。',
    growthTimeSeconds: 10,
  },
  chrono_wheat: {
    id: 'chrono_wheat',
    name: '時空金穗小麥',
    scientificName: 'Triticum chronos',
    icon: '🌾',
    color: '#f59e0b',
    description: '受時空波形調製生長的結晶小麥，能調諧人體引力場。',
    growthTimeSeconds: 14,
  },
}

export const POTION_RECIPES: PotionRecipe[] = [
  {
    id: 'potion_anti_gravity',
    name: '反引力量子合劑',
    icon: '🧪',
    requiredCropId: 'quantum_spores',
    requiredCount: 2,
    buffId: 'buff_low_gravity',
    durationSeconds: 60,
    description: '賦予 60 秒微重力滯空大跳躍能力 (+150% 跳躍高度)。',
  },
  {
    id: 'potion_sonic_speed',
    name: '音速等離子能量液',
    icon: '⚡',
    requiredCropId: 'plasma_melon',
    requiredCount: 2,
    buffId: 'buff_speed',
    durationSeconds: 60,
    description: '賦予 60 秒音速疾跑加成 (+75% 奔跑速度)。',
  },
  {
    id: 'potion_cyber_sight',
    name: '全息夜視感測藥劑',
    icon: '👁️',
    requiredCropId: 'matrix_nightshade',
    requiredCount: 2,
    buffId: 'buff_nightvision',
    durationSeconds: 90,
    description: '賦予 90 秒暗夜穿透熱成像視覺。',
  },
]

export class CyberHydroponicsEngine {
  public pods: HydroponicPod[] = []
  public cropInventory: Record<string, number> = {}
  public activeBuffs: BuffEffect[] = []

  private audioCtx: AudioContext | null = null

  constructor() {
    this.initPods()
    this.loadInventory()
  }

  private initPods(): void {
    this.pods = []
    for (let i = 0; i < 4; i++) {
      this.pods.push({
        id: `pod_${i}`,
        slotIndex: i,
        cropId: i === 0 ? 'plasma_melon' : i === 1 ? 'quantum_spores' : null,
        stage: i === 0 ? 'flowering' : i === 1 ? 'sprout' : 'seed',
        growthProgress: i === 0 ? 60 : i === 1 ? 25 : 0,
        hydration: 90,
        autoMist: true,
      })
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public playSpraySound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const bufferSize = ctx.sampleRate * 0.2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(2000, now)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  public playBrewSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [392, 523.25, 659.25, 783.99]
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      gain.gain.setValueAtTime(0.15, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.35)
    })
  }

  public plantCrop(slotIndex: number, cropId: string): boolean {
    const pod = this.pods.find(p => p.slotIndex === slotIndex)
    if (!pod || pod.cropId !== null) return false
    pod.cropId = cropId
    pod.stage = 'seed'
    pod.growthProgress = 0
    pod.hydration = 100
    sound.playUiClick()
    return true
  }

  public waterPod(slotIndex: number): void {
    const pod = this.pods.find(p => p.slotIndex === slotIndex)
    if (!pod) return
    pod.hydration = 100
    this.playSpraySound()
  }

  public toggleAutoMist(slotIndex: number): boolean {
    const pod = this.pods.find(p => p.slotIndex === slotIndex)
    if (!pod) return false
    pod.autoMist = !pod.autoMist
    sound.playUiClick()
    return pod.autoMist
  }

  public harvestPod(slotIndex: number): boolean {
    const pod = this.pods.find(p => p.slotIndex === slotIndex)
    if (!pod || pod.stage !== 'mature' || !pod.cropId) return false

    const harvestedId = pod.cropId
    this.cropInventory[harvestedId] = (this.cropInventory[harvestedId] || 0) + 1
    this.saveInventory()

    pod.cropId = null
    pod.stage = 'seed'
    pod.growthProgress = 0

    sound.playBuildComplete()
    achievements.unlock('cyber_botanist')
    return true
  }

  public brewPotion(recipeId: string): boolean {
    const recipe = POTION_RECIPES.find(r => r.id === recipeId)
    if (!recipe) return false

    const count = this.cropInventory[recipe.requiredCropId] || 0
    if (count < recipe.requiredCount) return false

    this.cropInventory[recipe.requiredCropId] -= recipe.requiredCount
    this.saveInventory()

    // Add or refresh active buff
    const existing = this.activeBuffs.find(b => b.id === recipe.buffId)
    if (existing) {
      existing.remainingSeconds = recipe.durationSeconds
    } else {
      this.activeBuffs.push({
        id: recipe.buffId,
        name: recipe.name,
        icon: recipe.icon,
        color: '#00ffff',
        durationSeconds: recipe.durationSeconds,
        remainingSeconds: recipe.durationSeconds,
      })
    }

    this.playBrewSound()
    return true
  }

  public update(delta: number): void {
    // 1. Update growth in hydroponic pods
    for (const pod of this.pods) {
      if (pod.cropId) {
        const sp = CROP_SPECIES[pod.cropId]
        if (sp && pod.stage !== 'mature') {
          // Hydration drain
          pod.hydration = Math.max(0, pod.hydration - delta * 1.5)
          if (pod.hydration <= 10 && pod.autoMist) {
            pod.hydration = 100
          }

          const hydrationFactor = pod.hydration > 20 ? 1.0 : 0.25
          const growthSpeed = (100 / sp.growthTimeSeconds) * hydrationFactor
          pod.growthProgress = Math.min(100, pod.growthProgress + growthSpeed * delta)

          if (pod.growthProgress >= 100) {
            pod.stage = 'mature'
          } else if (pod.growthProgress >= 65) {
            pod.stage = 'flowering'
          } else if (pod.growthProgress >= 25) {
            pod.stage = 'sprout'
          }
        }
      }
    }

    // 2. Update active buffs countdown
    for (let i = this.activeBuffs.length - 1; i >= 0; i--) {
      const buff = this.activeBuffs[i]
      buff.remainingSeconds -= delta
      if (buff.remainingSeconds <= 0) {
        this.activeBuffs.splice(i, 1)
      }
    }
  }

  private loadInventory(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('cyber_crops_inventory')
      if (saved) {
        this.cropInventory = JSON.parse(saved)
      } else {
        // Initial gift crops
        this.cropInventory = {
          quantum_spores: 4,
          plasma_melon: 3,
          matrix_nightshade: 2,
        }
      }
    } catch {
      // Ignored
    }
  }

  private saveInventory(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('cyber_crops_inventory', JSON.stringify(this.cropInventory))
    } catch {
      // Ignored
    }
  }
}

export const cyberHydroponics = new CyberHydroponicsEngine()
