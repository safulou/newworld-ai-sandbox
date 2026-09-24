import * as THREE from 'three'
import { sound } from './audio'

export type NPCWingsType = 'none' | 'hologram_wings' | 'jetpack' | 'solar_fins'
export type NPCHeadgearType = 'none' | 'combat_visor' | 'halo_crown' | 'comm_antenna'
export type NPCAuraType = 'none' | 'plasma_shield' | 'quantum_sparkles' | 'matrix_code'
export type NPCPersonality = 'diligent' | 'cheerful' | 'stoic' | 'quirky'

export interface NPCCustomConfig {
  npcId: string
  armorColor: string // hex e.g. "#00ffff"
  glowColor: string
  wings: NPCWingsType
  headgear: NPCHeadgearType
  aura: NPCAuraType
  personality: NPCPersonality
  customGreeting?: string
}

export const DEFAULT_NPC_CUSTOMS: Record<string, NPCCustomConfig> = {
  npc_guide: {
    npcId: 'npc_guide',
    armorColor: '#00f0ff',
    glowColor: '#00f0ff',
    wings: 'hologram_wings',
    headgear: 'halo_crown',
    aura: 'plasma_shield',
    personality: 'diligent',
    customGreeting: '開拓者，我是 Nova。量子航標已為您全數校準！',
  },
  npc_builder: {
    npcId: 'npc_builder',
    armorColor: '#ffaa00',
    glowColor: '#ffaa00',
    wings: 'jetpack',
    headgear: 'combat_visor',
    aura: 'none',
    personality: 'cheerful',
    customGreeting: '嘿！Echo 在此，隨時準備大興土木構建賽博城邦！',
  },
  npc_miner: {
    npcId: 'npc_miner',
    armorColor: '#ff0055',
    glowColor: '#ff5577',
    wings: 'none',
    headgear: 'combat_visor',
    aura: 'none',
    personality: 'stoic',
    customGreeting: '深層玄武岩層掃描就緒，Bolt 隨時待命開採。',
  },
  npc_merchant: {
    npcId: 'npc_merchant',
    armorColor: '#a371f7',
    glowColor: '#d2a8ff',
    wings: 'solar_fins',
    headgear: 'comm_antenna',
    aura: 'matrix_code',
    personality: 'quirky',
    customGreeting: '來自跨星系的稀有體素貨物，Luna 應有盡有！',
  },
  npc_drone: {
    npcId: 'npc_drone',
    armorColor: '#00ff88',
    glowColor: '#7ee787',
    wings: 'solar_fins',
    headgear: 'comm_antenna',
    aura: 'quantum_sparkles',
    personality: 'cheerful',
    customGreeting: '嗶嗶！Sparky 能源滿格，隨身偵查掃描中！',
  },
}

export class NPCCustomizerEngine {
  private configs: Map<string, NPCCustomConfig> = new Map()
  private accessoryGroups: Map<string, THREE.Group> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  public getConfig(npcId: string): NPCCustomConfig {
    if (!this.configs.has(npcId)) {
      const def = DEFAULT_NPC_CUSTOMS[npcId] || {
        npcId,
        armorColor: '#00f0ff',
        glowColor: '#00f0ff',
        wings: 'none',
        headgear: 'none',
        aura: 'none',
        personality: 'diligent',
      }
      this.configs.set(npcId, { ...def })
    }
    return { ...this.configs.get(npcId)! }
  }

  public setConfig(config: NPCCustomConfig): void {
    this.configs.set(config.npcId, { ...config })
    this.saveToStorage()
    sound.playLevelUp()
    this.dispatchUpdate(config.npcId)
  }

  /**
   * Applies custom meshes and materials to an NPC companion instance
   */
  public applyToNPCGroup(npcId: string, npcGroup: THREE.Group, isFlying: boolean = false): void {
    const config = this.getConfig(npcId)

    // Remove previous accessory group if present
    if (this.accessoryGroups.has(npcId)) {
      const old = this.accessoryGroups.get(npcId)!
      npcGroup.remove(old)
      this.disposeGroup(old)
      this.accessoryGroups.delete(npcId)
    }

    const accessories = new THREE.Group()
    const colorHex = parseInt(config.glowColor.replace('#', '0x'), 16) || 0x00f0ff

    // 1. Wings Attachment (attached to upper back)
    if (config.wings !== 'none') {
      const wings = this.createWingsMesh(config.wings, colorHex)
      wings.position.set(0, isFlying ? 0.1 : 0.85, -0.28)
      accessories.add(wings)
    }

    // 2. Headgear Attachment
    if (config.headgear !== 'none') {
      const headgear = this.createHeadgearMesh(config.headgear, colorHex)
      headgear.position.set(0, isFlying ? 0.35 : 1.55, 0)
      accessories.add(headgear)
    }

    // 3. Aura Effect
    if (config.aura !== 'none') {
      const aura = this.createAuraMesh(config.aura, colorHex)
      aura.position.set(0, isFlying ? 0 : 0.8, 0)
      accessories.add(aura)
    }

    npcGroup.add(accessories)
    this.accessoryGroups.set(npcId, accessories)
  }

  public createWingsMesh(type: NPCWingsType, color: number): THREE.Group {
    const group = new THREE.Group()
    const wingMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })

    if (type === 'hologram_wings') {
      // Dual ethereal energy wings
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(0.9, 0.6)
      shape.lineTo(1.2, 0.2)
      shape.lineTo(0.4, -0.3)
      shape.closePath()

      const geom = new THREE.ShapeGeometry(shape)
      const leftWing = new THREE.Mesh(geom, wingMat)
      leftWing.rotation.y = 0.3
      const rightWing = leftWing.clone()
      rightWing.scale.x = -1
      rightWing.rotation.y = -0.3

      group.add(leftWing, rightWing)
    } else if (type === 'jetpack') {
      // Twin propulsion thrusters
      const cylGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.6, 12)
      const jetMat = new THREE.MeshStandardMaterial({ color: 0x222938, metalness: 0.9 })
      const nozMat = new THREE.MeshBasicMaterial({ color })

      const left = new THREE.Mesh(cylGeo, jetMat)
      left.position.x = -0.22
      const leftNoz = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 8), nozMat)
      leftNoz.rotation.x = Math.PI
      leftNoz.position.set(-0.22, -0.35, 0)

      const right = left.clone()
      right.position.x = 0.22
      const rightNoz = leftNoz.clone()
      rightNoz.position.x = 0.22

      group.add(left, leftNoz, right, rightNoz)
    } else if (type === 'solar_fins') {
      // Angular solar panels
      const finGeo = new THREE.BoxGeometry(0.7, 0.05, 0.3)
      const leftFin = new THREE.Mesh(finGeo, wingMat)
      leftFin.position.set(-0.5, 0, 0)
      leftFin.rotation.z = 0.25

      const rightFin = leftFin.clone()
      rightFin.position.x = 0.5
      rightFin.rotation.z = -0.25

      group.add(leftFin, rightFin)
    }

    return group
  }

  public createHeadgearMesh(type: NPCHeadgearType, color: number): THREE.Group {
    const group = new THREE.Group()
    const glowMat = new THREE.MeshBasicMaterial({ color, wireframe: false })

    if (type === 'halo_crown') {
      // Floating ring halo
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.035, 8, 24), glowMat)
      torus.rotation.x = Math.PI / 2
      torus.position.y = 0.25
      group.add(torus)
    } else if (type === 'combat_visor') {
      // Curved HUD targeting visor
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.15), glowMat)
      visor.position.set(0, -0.1, 0.24)
      group.add(visor)
    } else if (type === 'comm_antenna') {
      // Sci-fi communication mast
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6), glowMat)
      antenna.position.set(0.24, 0.25, -0.1)
      antenna.rotation.z = -0.15
      group.add(antenna)
    }

    return group
  }

  public createAuraMesh(type: NPCAuraType, color: number): THREE.Group {
    const group = new THREE.Group()

    if (type === 'plasma_shield') {
      // Hexagonal outer forcefield cage
      const shieldMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      })
      const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), shieldMat)
      group.add(sphere)
    } else if (type === 'quantum_sparkles' || type === 'matrix_code') {
      // Ring of orbiting energy sparks
      const ringMat = new THREE.MeshBasicMaterial({ color, wireframe: true })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.04, 6, 16), ringMat)
      ring.rotation.x = Math.PI / 3
      group.add(ring)
    }

    return group
  }

  private disposeGroup(group: THREE.Group): void {
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose())
        } else if (obj.material) {
          obj.material.dispose()
        }
      }
    })
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const arr = Array.from(this.configs.entries())
      localStorage.setItem('cyber_npc_customizations', JSON.stringify(arr))
    } catch {
      // storage full
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem('cyber_npc_customizations')
      if (raw) {
        const arr = JSON.parse(raw) as [string, NPCCustomConfig][]
        arr.forEach(([id, cfg]) => this.configs.set(id, cfg))
      }
    } catch {
      // ignore
    }
  }

  private dispatchUpdate(npcId: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('npc-custom-updated', { detail: { npcId } }))
    }
  }
}

export const npcCustomizer = new NPCCustomizerEngine()
