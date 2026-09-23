import * as THREE from 'three'
import { BlockType } from '@/types/world'
import { sound } from './audio'
import { explosives } from './explosives'

export interface CircuitSignal {
  x: number
  y: number
  z: number
  strength: number
  sourceType: BlockType
}

export interface CircuitListener {
  onJumpPadTriggered?: (position: THREE.Vector3) => void
  onTeleportTriggered?: (fromPos: THREE.Vector3, targetPos: THREE.Vector3) => void
}

export class CircuitEngine {
  private activeSwitches: Set<string> = new Set()
  private activeSensors: Set<string> = new Set()
  private activePressurePlates: Set<string> = new Set()

  private listeners: CircuitListener = {}
  private tickTimer: number = 0
  private lastSteppedKey: string | null = null

  public setListener(listeners: CircuitListener): void {
    this.listeners = listeners
  }

  public isSwitchActive(x: number, y: number, z: number): boolean {
    return this.activeSwitches.has(`${x},${y},${z}`)
  }

  public toggleLever(x: number, y: number, z: number, world: any): boolean {
    const key = `${x},${y},${z}`
    const isNowActive = !this.activeSwitches.has(key)
    if (isNowActive) {
      this.activeSwitches.add(key)
      sound.playUiClick()
    } else {
      this.activeSwitches.delete(key)
      sound.playUiClick()
    }
    this.simulateCircuits(world)
    return isNowActive
  }

  public update(delta: number, playerPos: THREE.Vector3, world: any, npcs?: { getGroup: () => THREE.Group }[]): void {
    this.tickTimer += delta
    if (this.tickTimer < 0.1) return
    this.tickTimer = 0

    const px = Math.floor(playerPos.x)
    const py = Math.floor(playerPos.y)
    const pz = Math.floor(playerPos.z)

    // 1. Check Pressure Plate under player's feet
    const blockBelowKey = `${px},${py - 1},${pz}`
    const blockFeetKey = `${px},${py},${pz}`
    const belowType = world.getBlock(px, py - 1, pz)
    const feetType = world.getBlock(px, py, pz)

    let steppingOnPlate = false
    let currentPlateKey = ''

    if (belowType === 'pressure_plate') {
      steppingOnPlate = true
      currentPlateKey = blockBelowKey
    } else if (feetType === 'pressure_plate') {
      steppingOnPlate = true
      currentPlateKey = blockFeetKey
    }

    if (steppingOnPlate && currentPlateKey) {
      if (!this.activePressurePlates.has(currentPlateKey)) {
        this.activePressurePlates.add(currentPlateKey)
        sound.playBlockBreak('copper')
        this.simulateCircuits(world)
      }
    } else if (this.activePressurePlates.size > 0) {
      this.activePressurePlates.clear()
      this.simulateCircuits(world)
    }

    // 2. Check Jump Pad under player's feet
    if (belowType === 'jump_pad' || feetType === 'jump_pad') {
      const padKey = belowType === 'jump_pad' ? blockBelowKey : blockFeetKey
      if (this.lastSteppedKey !== padKey) {
        this.lastSteppedKey = padKey
        sound.playJump()
        if (this.listeners.onJumpPadTriggered) {
          this.listeners.onJumpPadTriggered(playerPos)
        }
      }
    } else if (belowType === 'teleporter' || feetType === 'teleporter') {
      const portKey = belowType === 'teleporter' ? blockBelowKey : blockFeetKey
      if (this.lastSteppedKey !== portKey) {
        this.lastSteppedKey = portKey
        sound.playTeleport()
        // Teleport forward 16 blocks along player orientation
        const targetPos = playerPos.clone().add(new THREE.Vector3(0, 0, -12))
        if (this.listeners.onTeleportTriggered) {
          this.listeners.onTeleportTriggered(playerPos, targetPos)
        }
      }
    } else {
      this.lastSteppedKey = null
    }

    // 3. Proximity Sensors (Check within 4 meters)
    let sensorTriggered = false
    const radius = 4
    for (let ox = -radius; ox <= radius; ox++) {
      for (let oy = -radius; oy <= radius; oy++) {
        for (let oz = -radius; oz <= radius; oz++) {
          const bx = px + ox
          const by = py + oy
          const bz = pz + oz
          if (world.getBlock(bx, by, bz) === 'sensor_proximity') {
            const distSq = ox * ox + oy * oy + oz * oz
            if (distSq <= radius * radius) {
              const sensorKey = `${bx},${by},${bz}`
              this.activeSensors.add(sensorKey)
              sensorTriggered = true
            }
          }
        }
      }
    }

    // Check NPCs near sensors as well
    if (npcs) {
      for (const npc of npcs) {
        const npcPos = npc.getGroup().position
        const nx = Math.floor(npcPos.x)
        const ny = Math.floor(npcPos.y)
        const nz = Math.floor(npcPos.z)
        for (let ox = -3; ox <= 3; ox++) {
          for (let oy = -2; oy <= 2; oy++) {
            for (let oz = -3; oz <= 3; oz++) {
              if (world.getBlock(nx + ox, ny + oy, nz + oz) === 'sensor_proximity') {
                this.activeSensors.add(`${nx + ox},${ny + oy},${nz + oz}`)
                sensorTriggered = true
              }
            }
          }
        }
      }
    }

    if (sensorTriggered) {
      this.simulateCircuits(world)
    } else if (this.activeSensors.size > 0) {
      this.activeSensors.clear()
      this.simulateCircuits(world)
    }
  }

  /**
   * Re-evaluates all circuit components and propagates power across wires
   */
  public simulateCircuits(world: any): void {
    if (!world || !world.getPlayerBlocks) return

    const playerBlocks: Map<string, { type: BlockType; mesh: any }> = world.getPlayerBlocks()
    const poweredCoords: Set<string> = new Set()
    const queue: { x: number; y: number; z: number; signal: number }[] = []

    // 1. Gather all active primary sources
    for (const [key, block] of playerBlocks.entries()) {
      const [x, y, z] = key.split(',').map(Number)
      if (block.type === 'power_source') {
        poweredCoords.add(key)
        queue.push({ x, y, z, signal: 15 })
      } else if (block.type === 'lever' && this.activeSwitches.has(key)) {
        poweredCoords.add(key)
        queue.push({ x, y, z, signal: 15 })
      } else if (block.type === 'pressure_plate' && this.activePressurePlates.has(key)) {
        poweredCoords.add(key)
        queue.push({ x, y, z, signal: 15 })
      } else if (block.type === 'sensor_proximity' && this.activeSensors.has(key)) {
        poweredCoords.add(key)
        queue.push({ x, y, z, signal: 15 })
      }
    }

    // 2. BFS Power Signal Propagation across adjacent wires and logic gates
    const visited = new Set<string>()
    const directions = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ]

    while (queue.length > 0) {
      const cur = queue.shift()!
      const curKey = `${cur.x},${cur.y},${cur.z}`
      if (visited.has(curKey)) continue
      visited.add(curKey)

      if (cur.signal <= 1) continue

      for (const [dx, dy, dz] of directions) {
        const nx = cur.x + dx
        const ny = cur.y + dy
        const nz = cur.z + dz
        const nKey = `${nx},${ny},${nz}`
        const nBlock = world.getBlock(nx, ny, nz)

        if (!nBlock) continue

        // Check wires
        if (nBlock === 'wire_off' || nBlock === 'wire_on') {
          poweredCoords.add(nKey)
          queue.push({ x: nx, y: ny, z: nz, signal: cur.signal - 1 })
        }
        // Repeater boosts signal back to 15
        else if (nBlock === 'repeater') {
          poweredCoords.add(nKey)
          queue.push({ x: nx, y: ny, z: nz, signal: 15 })
        }
        // Actuators
        else if (nBlock === 'jump_pad' || nBlock === 'light_emitter' || nBlock === 'tnt' || nBlock === 'teleporter') {
          poweredCoords.add(nKey)
          // If TNT receives power -> trigger detonation!
          if (nBlock === 'tnt') {
            explosives.detonate(nx, ny, nz, world)
          }
        }
      }
    }

    // 3. Update wire meshes visually (wire_off <-> wire_on)
    for (const [key, block] of playerBlocks.entries()) {
      const [x, y, z] = key.split(',').map(Number)
      if (block.type === 'wire_off' && poweredCoords.has(key)) {
        world.setBlock(x, y, z, 'wire_on', false)
      } else if (block.type === 'wire_on' && !poweredCoords.has(key)) {
        world.setBlock(x, y, z, 'wire_off', false)
      }
    }
  }
}

export const circuits = new CircuitEngine()
