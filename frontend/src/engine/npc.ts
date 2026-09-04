import * as THREE from 'three'
import { makePremiumMaterial } from './scene'
import { WorldEngine } from './world'
import { BlockPlacement } from '@/types/world'
import { sound } from './audio'

export interface NPCState {
  id: string
  name: string
  role: string
  position: THREE.Vector3
  targetPos: THREE.Vector3 | null
  isBuilding: boolean
}

export class NPCCompanion {
  private scene: THREE.Scene
  private group: THREE.Group
  private bodyMesh: THREE.Mesh
  private headMesh: THREE.Mesh
  private eyeMesh: THREE.Mesh
  private world: WorldEngine

  public state: NPCState
  private walkTime: number = 0

  constructor(scene: THREE.Scene, world: WorldEngine, startPos = new THREE.Vector3(0, 0, 4), name = 'Cyber Architect') {
    this.scene = scene
    this.world = world

    this.state = {
      id: 'companion_01',
      name,
      role: 'Autonomous Builder Companion',
      position: startPos.clone(),
      targetPos: null,
      isBuilding: false,
    }

    this.group = new THREE.Group()
    this.group.userData = { isNPC: true, name: this.state.name }

    // Cyber Android Visuals
    const armorMat = makePremiumMaterial(0x00ffff, 'emissive')
    const darkMat = makePremiumMaterial(0x1a1a24, 'standard')
    const glowMat = makePremiumMaterial(0x00ff88, 'emissive')

    this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.45), armorMat)
    this.bodyMesh.position.y = 0.55
    this.bodyMesh.castShadow = true

    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.5), darkMat)
    this.headMesh.position.y = 1.38
    this.headMesh.castShadow = true

    // Cyber Visor / Eyes
    this.eyeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.1), glowMat)
    this.eyeMesh.position.set(0, 1.38, 0.26)

    this.group.add(this.bodyMesh, this.headMesh, this.eyeMesh)
    this.group.position.copy(this.state.position)
    this.scene.add(this.group)
  }

  public setTarget(target: THREE.Vector3): void {
    this.state.targetPos = target.clone()
  }

  // Autonomous construction behavior
  public async executeBuildOrder(blocks: BlockPlacement[]): Promise<void> {
    this.state.isBuilding = true
    
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]
      this.world.setBlock(b.x, b.y, b.z, b.type)
      sound.playBlockPlace(b.type)
      
      // Look towards current building location
      this.group.lookAt(b.x, this.group.position.y, b.z)
      
      // Step every 40ms for fast responsive construction animation
      await new Promise(r => setTimeout(r, 35))
    }

    this.state.isBuilding = false
    sound.playBuildComplete()
  }

  public update(delta: number, playerPos?: THREE.Vector3): void {
    // If not actively building, gently follow or face the player
    if (playerPos && !this.state.isBuilding) {
      const dist = this.group.position.distanceTo(playerPos)

      if (dist > 5 && dist < 30) {
        // Move towards player
        const dir = playerPos.clone().sub(this.group.position).normalize()
        dir.y = 0
        this.group.position.addScaledVector(dir, 4 * delta)
        this.group.lookAt(playerPos.x, this.group.position.y, playerPos.z)

        // Walking bob animation
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

  public dispose(): void {
    this.scene.remove(this.group)
  }
}
