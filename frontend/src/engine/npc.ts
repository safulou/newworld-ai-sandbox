import * as THREE from 'three'
import { makePremiumMaterial } from './scene'
import { WorldEngine } from './world'
import { BlockPlacement, Vec3, BlockType } from '@/types/world'
import { sound } from './audio'
import { tts } from './tts'

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

export const NPC_GREETINGS: Record<string, string> = {
  npc_architect: '嗨，元宇宙建築師！有什麼新的構造靈感嗎？',
  npc_sentinel: '邊界防衛機甲啟動，區域掃描正常，隨時準備待命。',
  npc_lore: '時間在體素維度中交匯，我記錄著這片世界的每一次躍遷。',
  npc_merchant: '瞧瞧這片繁華星區，滿載著稀有體素與無限商機！',
  npc_drone: '嗶嗶！Sparky 伴隨偵查中，所有能源信號良好！',
}

export class NPCCompanion {
  private scene: THREE.Scene
  private group: THREE.Group
  private bodyMesh: THREE.Mesh
  private headMesh: THREE.Mesh
  private eyeMesh: THREE.Mesh
  private speechWaveMesh: THREE.Mesh
  private world: WorldEngine
  private isFlying: boolean

  public def: NPCDefinition
  public isBuilding: boolean = false
  public isSpeaking: boolean = false
  public speechText: string = ''
  private speechTimer: number = 0
  private lastGreetingTime: number = 0
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

    // 3D Speech Visualization Halo
    const waveGeo = new THREE.RingGeometry(0.25, 0.35, 16)
    const waveMat = new THREE.MeshBasicMaterial({
      color: def.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })
    this.speechWaveMesh = new THREE.Mesh(waveGeo, waveMat)
    this.speechWaveMesh.position.y = this.isFlying ? 0.65 : 1.95
    this.speechWaveMesh.rotation.x = Math.PI / 2
    this.group.add(this.speechWaveMesh)

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

  public getPosition(): THREE.Vector3 {
    return this.group.position
  }

  public startSpeaking(text: string, durationSec: number = 4): void {
    this.speechText = text
    this.isSpeaking = true
    this.speechTimer = durationSec
  }

  public stopSpeaking(): void {
    this.speechText = ''
    this.isSpeaking = false
    this.speechTimer = 0
    if (this.speechWaveMesh && this.speechWaveMesh.material) {
      ;(this.speechWaveMesh.material as THREE.MeshBasicMaterial).opacity = 0
    }
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

  public async executeWorkerTask(
    task: 'pave' | 'flatten' | 'mine',
    playerPos: { x: number; y: number; z: number },
    playerDir?: { x: number; y: number; z: number }
  ): Promise<string> {
    if (this.isBuilding) return '正在執行前一項工程，請稍候...'
    this.isBuilding = true

    const px = Math.floor(playerPos.x)
    const py = Math.floor(playerPos.y)
    const pz = Math.floor(playerPos.z)
    const dx = playerDir ? Math.round(playerDir.x) : 1
    const dz = playerDir ? Math.round(playerDir.z) : 0

    if (task === 'pave') {
      const stepX = Math.abs(dx) >= Math.abs(dz) ? (Math.sign(dx) || 1) : 0
      const stepZ = Math.abs(dz) > Math.abs(dx) ? (Math.sign(dz) || 1) : 0

      for (let i = 1; i <= 8; i++) {
        const bx = px + stepX * i
        const bz = pz + stepZ * i
        this.world.setBlock(bx, py - 1, bz, 'cyber_plating')
        sound.playBlockPlace('cyber_plating')
        this.group.lookAt(bx, this.group.position.y, bz)
        await new Promise(r => setTimeout(r, 60))
      }
      this.isBuilding = false
      sound.playBuildComplete()
      return `報告架構師：已完成 8 格賽博路面鋪設！`
    } else if (task === 'flatten') {
      let count = 0
      for (let ox = -2; ox <= 2; ox++) {
        for (let oz = -2; oz <= 2; oz++) {
          for (let oy = 0; oy <= 2; oy++) {
            const bx = px + ox
            const by = py + oy
            const bz = pz + oz
            const existing = this.world.getBlock(bx, by, bz)
            if (existing && existing !== 'air') {
              this.world.setBlock(bx, by, bz, 'air')
              count++
            }
          }
        }
        sound.playBlockBreak()
        await new Promise(r => setTimeout(r, 50))
      }
      this.isBuilding = false
      sound.playBuildComplete()
      return `報告架構師：5x5 區域整地完工（共清理 ${count} 個體素方塊）！`
    } else { // mine
      for (let i = 1; i <= 4; i++) {
        const bx = px + i
        const by = py - i
        const bz = pz
        this.world.setBlock(bx, by, bz, 'air')
        this.world.setBlock(bx, by - 1, bz, 'stone')
        sound.playBlockBreak()
        await new Promise(r => setTimeout(r, 70))
      }
      this.isBuilding = false
      sound.playBuildComplete()
      return `報告架構師：4 階下行採礦坑道已開鑿就緒！`
    }
  }

  /**
   * Sequentially places blocks for an entire blueprint with construction animations and sound
   */
  public async executeBlueprintConstruction(blocks: { x: number; y: number; z: number; type: BlockType }[]): Promise<string> {
    this.isBuilding = true
    this.startSpeaking(`收到全息藍圖！我即刻前往現場進行施工（共 ${blocks.length} 個體素元件）...`, 5)

    let placed = 0
    // Sort blocks from bottom to top for realistic construction
    const sorted = [...blocks].sort((a, b) => a.y - b.y)

    for (const b of sorted) {
      this.world.setBlock(b.x, b.y, b.z, b.type)
      placed++
      if (placed % 4 === 0) {
        sound.playBlockBreak('concrete')
      }
      await new Promise(r => setTimeout(r, 40))
    }

    this.isBuilding = false
    sound.playBuildComplete()
    const finishMsg = `報告架構師！全息藍圖建築已全數完工（共 ${placed} 個方塊）！`
    this.startSpeaking(finishMsg, 6)
    return finishMsg
  }

  public update(delta: number, playerPos?: THREE.Vector3): void {
    this.walkTime += delta * 4

    // Dynamic Speech Wave Animation
    if (this.isSpeaking) {
      this.speechTimer -= delta
      if (this.speechTimer <= 0) {
        this.stopSpeaking()
      } else {
        const pulse = 1.0 + Math.sin(this.walkTime * 8) * 0.25
        this.speechWaveMesh.scale.set(pulse, pulse, pulse)
        const waveMat = this.speechWaveMesh.material as THREE.MeshBasicMaterial
        waveMat.opacity = 0.5 + Math.sin(this.walkTime * 10) * 0.4
        this.speechWaveMesh.rotation.z += delta * 3

        if (this.eyeMesh && this.eyeMesh.material) {
          const mat = this.eyeMesh.material as any
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = 1.2 + Math.sin(this.walkTime * 12) * 0.8
          }
        }
      }
    } else if (this.speechWaveMesh && this.speechWaveMesh.material) {
      ;(this.speechWaveMesh.material as THREE.MeshBasicMaterial).opacity = 0
    }

    if (playerPos && !this.isBuilding) {
      const dist = this.group.position.distanceTo(playerPos)

      // Proximity Voice Greeting (Trigger when player steps within 3.5m, cooldown 60s)
      const now = Date.now()
      if (dist < 3.5 && now - this.lastGreetingTime > 60000 && !this.isSpeaking && tts.state.enabled) {
        this.lastGreetingTime = now
        const greeting = NPC_GREETINGS[this.def.id]
        if (greeting) {
          this.startSpeaking(greeting, 4)
          tts.speak(this.def.id, greeting, this.group.position, playerPos)
        }
      }

      if (this.isFlying) {
        // Floating hover motion
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

          this.bodyMesh.position.y = 0.55 + Math.abs(Math.sin(this.walkTime * 3)) * 0.1
          this.headMesh.position.y = 1.38 + Math.abs(Math.sin(this.walkTime * 3)) * 0.1
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

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('npc-speech-start', (e: Event) => {
        const custom = e as CustomEvent
        if (custom.detail?.npcId) {
          const npc = this.getNPCById(custom.detail.npcId)
          if (npc) {
            npc.startSpeaking(custom.detail.text, 6)
          }
        }
      })
      window.addEventListener('npc-speech-end', (e: Event) => {
        const custom = e as CustomEvent
        if (custom.detail?.npcId) {
          const npc = this.getNPCById(custom.detail.npcId)
          if (npc) {
            npc.stopSpeaking()
          }
        }
      })
    }
  }

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

  public getNPCById(id: string): NPCCompanion | undefined {
    return this.npcs.find(n => n.def.id === id)
  }

  public getNPCByName(name: string): NPCCompanion | undefined {
    return this.npcs.find(n => n.def.name.toLowerCase() === name.toLowerCase())
  }

  public getNPCs(): NPCCompanion[] {
    return this.npcs
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
