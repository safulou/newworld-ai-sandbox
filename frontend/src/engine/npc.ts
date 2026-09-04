import * as THREE from 'three'
import { makePremiumMaterial } from './scene'
import { WorldEngine } from './world'
import { BlockPlacement, Vec3 } from '@/types/world'
import { sound } from './audio'

export interface NPCDefinition {
  id: string
  name: string
  role: string
  title: string
  color: number
  startOffset: Vec3
  isFlying?: boolean
}

export const NPC_ROSTER: NPCDefinition[] = [
  { id: 'npc_architect', name: 'Alex', role: 'Cyber Architect', title: '首席元宇宙架構師', color: 0x00ffff, startOffset: { x: 3, y: 0, z: 4 } },
  { id: 'npc_sentinel', name: 'Aegis', role: 'Security Sentinel', title: '邊界防衛機甲', color: 0xff0055, startOffset: { x: -4, y: 0, z: 3 } },
  { id: 'npc_lore', name: 'Chronos', role: 'Lore Master', title: '量子歷史學者', color: 0xffaa00, startOffset: { x: 0, y: 0, z: -5 } },
  { id: 'npc_merchant', name: 'Vex', role: 'Cyber Merchant', title: '星際貿易商', color: 0x00ff88, startOffset: { x: -3, y: 0, z: -4 } },
  { id: 'npc_drone', name: 'Sparky', role: 'Pet Drone', title: '伴隨偵查無人機', color: 0xcc00ff, startOffset: { x: 1.5, y: 2.2, z: 1.5 }, isFlying: true },
]

export class NPCCompanion {
  private scene: THREE.Scene
  private group: THREE.Group
  private bodyMesh: THREE.Mesh
  private headMesh: THREE.Mesh
  private eyeMesh: THREE.Mesh
  private world: WorldEngine
  private isFlying: boolean

  public def: NPCDefinition
  public isBuilding: boolean = false
  private walkTime: number = 0

  constructor(scene: THREE.Scene, world: WorldEngine, def: NPCDefinition, spawnPos: THREE.Vector3) {
    this.scene = scene
    this.world = world
    this.def = def
    this.isFlying = !!def.isFlying

    this.group = new THREE.Group()
    this.group.userData = { isNPC: true, name: def.name, role: def.role, id: def.id }

    const armorMat = makePremiumMaterial(def.color, 'emissive')
    const darkMat = makePremiumMaterial(0x1a1a24, 'standard')
    const glowMat = makePremiumMaterial(def.color, 'emissive')

    if (this.isFlying) {
      // Drone geometry
      this.bodyMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), armorMat)
      this.headMesh = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.45, 16), glowMat)
      this.headMesh.rotation.x = Math.PI / 2
      this.eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), glowMat)
      this.group.add(this.bodyMesh, this.headMesh, this.eyeMesh)
    } else {
      // Humanoid cyber android
      this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.45), armorMat)
      this.bodyMesh.position.y = 0.55
      this.bodyMesh.castShadow = true

      this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.5), darkMat)
      this.headMesh.position.y = 1.38
      this.headMesh.castShadow = true

      this.eyeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.1), glowMat)
      this.eyeMesh.position.set(0, 1.38, 0.26)

      this.group.add(this.bodyMesh, this.headMesh, this.eyeMesh)
    }

    this.group.position.set(
      spawnPos.x + def.startOffset.x,
      spawnPos.y + def.startOffset.y,
      spawnPos.z + def.startOffset.z
    )
    this.scene.add(this.group)
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  public async executeBuildOrder(blocks: BlockPlacement[]): Promise<void> {
    this.isBuilding = true
    
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]
      this.world.setBlock(b.x, b.y, b.z, b.type)
      sound.playBlockPlace(b.type)
      this.group.lookAt(b.x, this.group.position.y, b.z)
      await new Promise(r => setTimeout(r, 35))
    }

    this.isBuilding = false
    sound.playBuildComplete()
  }

  public update(delta: number, playerPos?: THREE.Vector3): void {
    if (playerPos && !this.isBuilding) {
      const dist = this.group.position.distanceTo(playerPos)

      if (this.isFlying) {
        // Floating hover motion
        this.walkTime += delta * 4
        this.group.position.y = playerPos.y + 2.0 + Math.sin(this.walkTime) * 0.3
        const target = playerPos.clone().add(new THREE.Vector3(1.5, 2.0, 1.5))
        this.group.position.lerp(target, 2 * delta)
        this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)
        this.headMesh.rotation.z += delta * 3
      } else {
        if (dist > 5 && dist < 30) {
          const dir = playerPos.clone().sub(this.group.position).normalize()
          dir.y = 0
          this.group.position.addScaledVector(dir, 3.5 * delta)
          this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)

          this.walkTime += delta * 12
          this.bodyMesh.position.y = 0.55 + Math.abs(Math.sin(this.walkTime)) * 0.1
          this.headMesh.position.y = 1.38 + Math.abs(Math.sin(this.walkTime)) * 0.1
        } else {
          this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)
          this.bodyMesh.position.y = 0.55
          this.headMesh.position.y = 1.38
        }
      }
    }
  }

  public dispose(): void {
    this.scene.remove(this.group)
  }
}

export class NPCManager {
  private npcs: NPCCompanion[] = []

  public init(scene: THREE.Scene, world: WorldEngine, spawnPoint: THREE.Vector3): void {
    this.dispose()
    for (const def of NPC_ROSTER) {
      const npc = new NPCCompanion(scene, world, def, spawnPoint)
      this.npcs.push(npc)
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    for (const npc of this.npcs) {
      npc.update(delta, playerPos)
    }
  }

  public getNPCByName(name: string): NPCCompanion | undefined {
    return this.npcs.find(n => n.def.name.toLowerCase() === name.toLowerCase())
  }

  public getAllNPCGroups(): THREE.Group[] {
    return this.npcs.map(n => n.getGroup())
  }

  public dispose(): void {
    for (const npc of this.npcs) {
      npc.dispose()
    }
    this.npcs = []
  }
}

export const npcManager = new NPCManager()
