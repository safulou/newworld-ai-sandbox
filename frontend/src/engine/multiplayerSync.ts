import * as THREE from 'three'
import { Socket } from 'socket.io-client'
import { BlockType } from '@/types/world'
import { sound } from './audio'
import { VehicleType } from './vehicles'

export interface RemotePlayer {
  id: string
  name: string
  position: THREE.Vector3
  targetPosition: THREE.Vector3
  rotationY: number
  vehicle: VehicleType
  isSpeaking: boolean
  health?: number
  shield?: number
  group: THREE.Group
  nametagSprite?: THREE.Sprite
  vehicleMesh?: THREE.Mesh
}

export class MultiplayerSyncEngine {
  private socket: Socket | null = null
  private scene: THREE.Scene | null = null
  private world: any = null
  public remotePlayers: Map<string, RemotePlayer> = new Map()

  private lastEmitTime: number = 0
  private emitInterval: number = 0.066 // ~15 FPS broadcast rate

  public init(socket: Socket, scene: THREE.Scene, world: any): void {
    this.socket = socket
    this.scene = scene
    this.world = world

    this.bindSocketEvents()
  }

  private bindSocketEvents(): void {
    if (!this.socket) return

    // 1. Remote Player Sync
    this.socket.on('server:player-state', (data: any) => {
      this.handleRemotePlayerUpdate(data)
    })

    this.socket.on('server:player-leave', (data: { id: string }) => {
      this.removeRemotePlayer(data.id)
    })

    // 2. Real-time Co-op Block Synchronization
    this.socket.on('server:block-placed', (data: { x: number; y: number; z: number; type: BlockType; author?: string }) => {
      if (this.world) {
        this.world.setBlock(data.x, data.y, data.z, data.type, false)
        sound.playBlockPlace(data.type)
      }
    })

    this.socket.on('server:block-broken', (data: { x: number; y: number; z: number; author?: string }) => {
      if (this.world) {
        const prev = this.world.getBlock(data.x, data.y, data.z)
        this.world.removeBlock(data.x, data.y, data.z, false)
        if (prev) sound.playBlockBreak(prev)
      }
    })

    this.socket.on('server:player-health', (data: { id: string; health: number; maxHealth: number; shield: number; maxShield: number }) => {
      const player = this.remotePlayers.get(data.id)
      if (player) {
        player.health = data.health
        player.shield = data.shield
        this.updateNametag(player)
      }
    })
  }

  public emitLocalState(pos: THREE.Vector3, rotY: number, name: string, vehicle: VehicleType, isSpeaking: boolean): void {
    if (!this.socket) return

    const now = performance.now() / 1000
    if (now - this.lastEmitTime < this.emitInterval) return
    this.lastEmitTime = now

    this.socket.emit('client:player-sync', {
      name: name || 'Pioneer',
      x: pos.x,
      y: pos.y,
      z: pos.z,
      rotY,
      vehicle,
      isSpeaking,
    })
  }

  public broadcastBlockPlace(x: number, y: number, z: number, type: BlockType, author?: string): void {
    if (this.socket) {
      this.socket.emit('client:block-place', { x, y, z, type, author })
    }
  }

  public broadcastBlockBreak(x: number, y: number, z: number, author?: string): void {
    if (this.socket) {
      this.socket.emit('client:block-break', { x, y, z, author })
    }
  }

  private handleRemotePlayerUpdate(data: any): void {
    if (!this.scene) return

    let player = this.remotePlayers.get(data.id)
    if (!player) {
      player = this.createRemoteAvatar(data.id, data.name || 'Pioneer')
      this.remotePlayers.set(data.id, player)
    }

    player.name = data.name || 'Pioneer'
    player.targetPosition.set(data.x, data.y, data.z)
    player.rotationY = data.rotY || 0
    player.vehicle = data.vehicle || 'none'
    player.isSpeaking = !!data.isSpeaking

    this.updateNametag(player)
  }

  private createRemoteAvatar(id: string, name: string): RemotePlayer {
    const group = new THREE.Group()

    // Cyber Avatar Body
    const bodyGeo = new THREE.BoxGeometry(0.65, 0.95, 0.4)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a2b4c,
      metalness: 0.8,
      roughness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 0.5

    // Cyber Head with Visor
    const headGeo = new THREE.BoxGeometry(0.45, 0.45, 0.4)
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1,
    })
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.y = 1.25

    const visorGeo = new THREE.BoxGeometry(0.46, 0.15, 0.15)
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.0,
    })
    const visor = new THREE.Mesh(visorGeo, visorMat)
    visor.position.set(0, 1.25, -0.16)

    group.add(body, head, visor)

    // Billboard Nametag
    const nametag = this.createNametagSprite(name, false)
    nametag.position.set(0, 1.85, 0)
    group.add(nametag)

    if (this.scene) {
      this.scene.add(group)
    }

    return {
      id,
      name,
      position: new THREE.Vector3(0, -999, 0),
      targetPosition: new THREE.Vector3(0, -999, 0),
      rotationY: 0,
      vehicle: 'none',
      isSpeaking: false,
      group,
      nametagSprite: nametag,
    }
  }

  private createNametagSprite(name: string, isSpeaking: boolean, health: number = 100, shield: number = 100): THREE.Sprite {
    if (typeof document === 'undefined') {
      return new THREE.Sprite()
    }
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 80
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = isSpeaking ? 'rgba(0, 255, 200, 0.85)' : 'rgba(10, 15, 30, 0.75)'
      ctx.roundRect(10, 6, 236, 68, 8)
      ctx.fill()
      ctx.strokeStyle = isSpeaking ? '#00ffff' : '#38bdf8'
      ctx.lineWidth = 3
      ctx.roundRect(10, 6, 236, 68, 8)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const label = isSpeaking ? `🔊 ${name}` : name
      ctx.fillText(label, 128, 28)

      // Dual HP & Shield Mini-Bars
      const barX = 24
      const barWidth = 208
      const barHeight = 6

      // Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(barX, 48, barWidth, barHeight)
      ctx.fillRect(barX, 58, barWidth, barHeight)

      // Shield bar (Cyan)
      const sW = Math.max(0, Math.min(barWidth, (shield / 100) * barWidth))
      ctx.fillStyle = '#00ffff'
      ctx.fillRect(barX, 48, sW, barHeight)

      // HP bar (Emerald Green)
      const hW = Math.max(0, Math.min(barWidth, (health / 100) * barWidth))
      ctx.fillStyle = '#00ff88'
      ctx.fillRect(barX, 58, hW, barHeight)
    }

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(2.4, 0.75, 1)
    return sprite
  }

  private updateNametag(player: RemotePlayer): void {
    if (!player.nametagSprite) return
    player.group.remove(player.nametagSprite)
    player.nametagSprite = this.createNametagSprite(player.name, player.isSpeaking, player.health ?? 100, player.shield ?? 100)
    player.nametagSprite.position.set(0, 1.95, 0)
    player.group.add(player.nametagSprite)
  }

  private removeRemotePlayer(id: string): void {
    const player = this.remotePlayers.get(id)
    if (player && this.scene) {
      this.scene.remove(player.group)
      this.remotePlayers.delete(id)
    }
  }

  public update(delta: number): void {
    // Smooth lerp remote avatar positions
    const lerpRate = Math.min(1.0, delta * 12)
    for (const player of this.remotePlayers.values()) {
      player.position.lerp(player.targetPosition, lerpRate)
      player.group.position.copy(player.position)
      player.group.rotation.y = player.rotationY
    }
  }

  public getOnlineCount(): number {
    return this.remotePlayers.size + 1 // Remotes + local player
  }

  public dispose(): void {
    if (this.scene) {
      for (const player of this.remotePlayers.values()) {
        this.scene.remove(player.group)
      }
    }
    this.remotePlayers.clear()
    this.socket = null
    this.scene = null
    this.world = null
  }
}

export const multiplayerSync = new MultiplayerSyncEngine()
