import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export type BeltDirection = 'east' | 'west' | 'north' | 'south'

export interface ConveyorBelt {
  id: string
  x: number
  y: number
  z: number
  direction: BeltDirection
  speed: number // meters per second
}

export type FactoryItemType =
  | 'quantum_spore'
  | 'plasma_melon'
  | 'matrix_nightshade'
  | 'chrono_wheat'
  | 'cyber_iron'
  | 'energy_core'

export interface ConveyorItem {
  id: string
  type: FactoryItemType
  name: string
  color: string
  position: THREE.Vector3
  beltId: string
  progress: number // 0 to 1 along current tile
}

export interface ItemSorter {
  id: string
  x: number
  y: number
  z: number
  filterItemType: FactoryItemType
  divertDirection: BeltDirection
  passCount: number
  divertCount: number
  inventory: { type: FactoryItemType; count: number }[]
}

export interface AutonomousDroneMission {
  id: string
  name: string
  sourceName: string
  destName: string
  cargoType: FactoryItemType
  intervalSeconds: number
  elapsed: number
  status: 'idle' | 'flying_to_source' | 'loading' | 'flying_to_dest' | 'unloading'
  dronePosition: THREE.Vector3
  progress: number
}

export const ITEM_DEFINITIONS: Record<FactoryItemType, { name: string; color: string; icon: string }> = {
  quantum_spore: { name: '量子微光孢子', color: '#00f0ff', icon: '🍄' },
  plasma_melon: { name: '高能等離子蜜瓜', color: '#ff007f', icon: '🍉' },
  matrix_nightshade: { name: '矩陣賽博夜茄', color: '#a855f7', icon: '🍆' },
  chrono_wheat: { name: '時空基因小麥', color: '#eab308', icon: '🌾' },
  cyber_iron: { name: '高純度賽博鐵錠', color: '#94a3b8', icon: '🔩' },
  energy_core: { name: '超導能量晶核', color: '#38bdf8', icon: '💎' },
}

export class FactoryLogisticsEngine {
  public belts: ConveyorBelt[] = []
  public items: ConveyorItem[] = []
  public sorters: ItemSorter[] = []
  public missions: AutonomousDroneMission[] = []

  public isOverdrive: boolean = false
  public totalItemsProcessed: number = 0
  public itemsPerMinute: number = 0

  private processedHistory: number[] = [] // timestamps
  private meshGroup: THREE.Group | null = null

  constructor() {
    this.loadState()
  }

  public init(scene?: THREE.Scene): void {
    if (scene && !this.meshGroup) {
      this.meshGroup = new THREE.Group()
      this.meshGroup.name = 'FactoryLogisticsSceneGroup'
      scene.add(this.meshGroup)
    }
  }

  public addBelt(x: number, y: number, z: number, direction: BeltDirection = 'east'): ConveyorBelt {
    const existing = this.belts.find(b => b.x === x && b.y === y && b.z === z)
    if (existing) {
      existing.direction = direction
      this.saveState()
      return existing
    }

    const belt: ConveyorBelt = {
      id: `belt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      x,
      y,
      z,
      direction,
      speed: this.isOverdrive ? 5.0 : 2.5,
    }
    this.belts.push(belt)
    this.saveState()
    sound.playUiClick()
    return belt
  }

  public removeBelt(id: string): void {
    this.belts = this.belts.filter(b => b.id !== id)
    this.items = this.items.filter(i => i.beltId !== id)
    this.saveState()
  }

  public addSorter(
    x: number,
    y: number,
    z: number,
    filterItemType: FactoryItemType = 'quantum_spore',
    divertDirection: BeltDirection = 'north'
  ): ItemSorter {
    const existing = this.sorters.find(s => s.x === x && s.y === y && s.z === z)
    if (existing) {
      existing.filterItemType = filterItemType
      existing.divertDirection = divertDirection
      this.saveState()
      return existing
    }

    const sorter: ItemSorter = {
      id: `sorter_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      x,
      y,
      z,
      filterItemType,
      divertDirection,
      passCount: 0,
      divertCount: 0,
      inventory: [],
    }
    this.sorters.push(sorter)
    this.saveState()
    sound.playUiClick()
    return sorter
  }

  public removeSorter(id: string): void {
    this.sorters = this.sorters.filter(s => s.id !== id)
    this.saveState()
  }

  public spawnItem(type: FactoryItemType, beltId?: string): ConveyorItem | null {
    const targetBelt = beltId ? this.belts.find(b => b.id === beltId) : this.belts[0]
    if (!targetBelt) return null

    const def = ITEM_DEFINITIONS[type]
    const item: ConveyorItem = {
      id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      name: def.name,
      color: def.color,
      position: new THREE.Vector3(targetBelt.x + 0.5, targetBelt.y + 0.4, targetBelt.z + 0.5),
      beltId: targetBelt.id,
      progress: 0,
    }
    this.items.push(item)
    return item
  }

  public addDroneMission(
    name: string,
    sourceName: string,
    destName: string,
    cargoType: FactoryItemType,
    intervalSeconds: number = 8
  ): AutonomousDroneMission {
    const mission: AutonomousDroneMission = {
      id: `mission_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name,
      sourceName,
      destName,
      cargoType,
      intervalSeconds,
      elapsed: 0,
      status: 'idle',
      dronePosition: new THREE.Vector3(0, 10, 0),
      progress: 0,
    }
    this.missions.push(mission)
    this.saveState()
    return mission
  }

  public removeDroneMission(id: string): void {
    this.missions = this.missions.filter(m => m.id !== id)
    this.saveState()
  }

  public setOverdrive(enabled: boolean): void {
    this.isOverdrive = enabled
    for (const b of this.belts) {
      b.speed = enabled ? 5.0 : 2.5
    }
  }

  public update(dt: number): void {
    const now = Date.now()

    // 1. Move items along belts
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i]
      const belt = this.belts.find(b => b.id === item.beltId)
      if (!belt) {
        this.items.splice(i, 1)
        continue
      }

      item.progress += (belt.speed / 1.0) * dt
      const dirVec = this.getDirectionVector(belt.direction)
      item.position.x = belt.x + 0.5 + dirVec.x * (item.progress - 0.5)
      item.position.z = belt.z + 0.5 + dirVec.z * (item.progress - 0.5)

      // When reaching end of current belt tile
      if (item.progress >= 1.0) {
        const nextX = Math.round(belt.x + dirVec.x)
        const nextZ = Math.round(belt.z + dirVec.z)

        // Check if there is a sorter at this location
        const sorter = this.sorters.find(s => s.x === nextX && s.y === belt.y && s.z === nextZ)
        let targetX = nextX
        let targetZ = nextZ

        if (sorter) {
          if (sorter.filterItemType === item.type) {
            sorter.divertCount++
            const divertVec = this.getDirectionVector(sorter.divertDirection)
            targetX = Math.round(belt.x + divertVec.x)
            targetZ = Math.round(belt.z + divertVec.z)
            achievements.unlock('factory_tycoon')
          } else {
            sorter.passCount++
          }
          // Put into sorter inventory
          const invSlot = sorter.inventory.find(inv => inv.type === item.type)
          if (invSlot) {
            invSlot.count++
          } else {
            sorter.inventory.push({ type: item.type, count: 1 })
          }
        }

        const nextBelt = this.belts.find(b => b.x === targetX && b.y === belt.y && b.z === targetZ)
        if (nextBelt) {
          item.beltId = nextBelt.id
          item.progress = 0
        } else {
          // Processed / Deposited at terminus
          this.totalItemsProcessed++
          this.processedHistory.push(now)
          this.items.splice(i, 1)

          if (this.totalItemsProcessed >= 10) {
            achievements.unlock('factory_tycoon')
          }
        }
      }
    }

    // 2. Compute throughput (items per minute)
    const oneMinAgo = now - 60000
    this.processedHistory = this.processedHistory.filter(t => t > oneMinAgo)
    this.itemsPerMinute = this.processedHistory.length

    // 3. Autonomous Drone Missions update
    for (const mission of this.missions) {
      mission.elapsed += dt
      const cycleTime = mission.intervalSeconds
      const stageProgress = (mission.elapsed % cycleTime) / cycleTime

      if (stageProgress < 0.25) {
        mission.status = 'flying_to_source'
        mission.progress = stageProgress / 0.25
        mission.dronePosition.set(-10 + mission.progress * 10, 8, 0)
      } else if (stageProgress < 0.35) {
        mission.status = 'loading'
        mission.progress = (stageProgress - 0.25) / 0.1
      } else if (stageProgress < 0.85) {
        mission.status = 'flying_to_dest'
        mission.progress = (stageProgress - 0.35) / 0.5
        mission.dronePosition.set(mission.progress * 20, 12, mission.progress * 15)
      } else {
        mission.status = 'unloading'
        mission.progress = (stageProgress - 0.85) / 0.15
        if (stageProgress >= 0.98 && mission.elapsed >= cycleTime) {
          this.spawnItem(mission.cargoType)
          mission.elapsed = 0
        }
      }
    }
  }

  public getPowerLoadKw(): number {
    const baseLoad = this.belts.length * 1.5 + this.sorters.length * 3.0 + this.missions.length * 8.0
    return this.isOverdrive ? baseLoad * 2.2 : baseLoad
  }

  private getDirectionVector(dir: BeltDirection): { x: number; z: number } {
    switch (dir) {
      case 'east': return { x: 1, z: 0 }
      case 'west': return { x: -1, z: 0 }
      case 'north': return { x: 0, z: -1 }
      case 'south': return { x: 0, z: 1 }
    }
  }

  public reset(): void {
    this.belts = [
      { id: 'belt_preset_1', x: 0, y: 4, z: 0, direction: 'east', speed: 2.5 },
      { id: 'belt_preset_2', x: 1, y: 4, z: 0, direction: 'east', speed: 2.5 },
      { id: 'belt_preset_3', x: 2, y: 4, z: 0, direction: 'east', speed: 2.5 },
      { id: 'belt_preset_4', x: 3, y: 4, z: 0, direction: 'east', speed: 2.5 },
      { id: 'belt_preset_5', x: 4, y: 4, z: 0, direction: 'east', speed: 2.5 },
    ]
    this.sorters = [
      {
        id: 'sorter_preset_1',
        x: 3,
        y: 4,
        z: 0,
        filterItemType: 'quantum_spore',
        divertDirection: 'south',
        passCount: 0,
        divertCount: 0,
        inventory: [],
      },
    ]
    this.missions = [
      {
        id: 'mission_preset_1',
        name: '溫室至煉金台全自動調度',
        sourceName: '賽博水耕溫室 #1',
        destName: '生物合成煉金台',
        cargoType: 'quantum_spore',
        intervalSeconds: 6,
        elapsed: 0,
        status: 'idle',
        dronePosition: new THREE.Vector3(0, 10, 0),
        progress: 0,
      },
    ]
    this.items = []
    this.totalItemsProcessed = 0
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') {
      this.reset()
      return
    }
    try {
      const data = localStorage.getItem('cyber_factory_logistics')
      if (data) {
        const parsed = JSON.parse(data)
        this.belts = parsed.belts || []
        this.sorters = parsed.sorters || []
        this.missions = parsed.missions || []
        this.totalItemsProcessed = parsed.totalItemsProcessed || 0
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
        belts: this.belts,
        sorters: this.sorters,
        missions: this.missions,
        totalItemsProcessed: this.totalItemsProcessed,
      }
      localStorage.setItem('cyber_factory_logistics', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const factoryLogistics = new FactoryLogisticsEngine()
