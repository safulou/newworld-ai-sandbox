import * as THREE from 'three'
import { BlockType, Vec3, WorldData } from '@/types/world'
import { BLOCK_COLORS, blockKey, isSolid } from './blocks'
import { makePremiumMaterial } from './scene'
import { generateChunk } from './terrain'
import { io, Socket } from 'socket.io-client'
import { DecentralizedWorker } from './worker'
import { useSettingsStore } from '@/stores/settings'
import { sound } from './audio'

export class WorldEngine {
  private scene: THREE.Scene
  private worker: DecentralizedWorker

  // collision grid — tracks every solid cell (world + player blocks)
  private collisionGrid = new Set<string>()

  // player-placed individual blocks (interactive, per-block meshes)
  private playerBlocks = new Map<string, { type: BlockType; mesh: THREE.Mesh }>()

  // Chunks map string "cx,cz" to a set of meshes in that chunk
  private chunks = new Map<string, { meshes: THREE.Object3D[]; generated: boolean }>()
  
  // Track camera for chunk loading
  private lastChunkX = -999
  private lastChunkZ = -999

  private socket: Socket
  private otherPlayers = new Map<string, THREE.Group>()

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.socket = io('http://localhost:4000')
    this.worker = new DecentralizedWorker(this.socket)

    this.socket.on('set-block', (data: { x: number, y: number, z: number, type: string }) => {
      this.applyBlockLocal(data.x, data.y, data.z, data.type as BlockType, false)
    })

    this.socket.on('clear-world', () => {
      this.clear()
    })

    this.socket.on('player-move', (data: { id: string, x: number, y: number, z: number }) => {
      let avatar = this.otherPlayers.get(data.id)
      if (!avatar) {
        avatar = new THREE.Group()
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 1.1, 0.4),
          makePremiumMaterial(0x00ffff, 'emissive')
        )
        body.position.y = 0.55
        const head = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.55, 0.4),
          makePremiumMaterial(0x00ffff, 'emissive')
        )
        head.position.y = 1.38
        avatar.add(body, head)
        this.scene.add(avatar)
        this.otherPlayers.set(data.id, avatar)
      }
      avatar.position.set(data.x, data.y, data.z)
    })

    this.socket.on('player-leave', (data: { id: string }) => {
      const avatar = this.otherPlayers.get(data.id)
      if (avatar) {
        this.scene.remove(avatar)
        this.otherPlayers.delete(data.id)
      }
    })

    this.socket.on('chat-message', (data: { role: string, content: string }) => {
      window.dispatchEvent(new CustomEvent('ai-chat', { detail: data }))
    })

    this.socket.on('build-progress', (data: any) => {
      if (data.status === 'completed') {
        sound.playBuildComplete()
      }
      window.dispatchEvent(new CustomEvent('build-progress', { detail: data }))
    })
  }

  getWorker(): DecentralizedWorker {
    return this.worker
  }

  getSocket(): Socket {
    return this.socket
  }

  emitPlayerMove(x: number, y: number, z: number): void {
    const settings = useSettingsStore()
    this.socket.emit('player-move', { x, y, z, creatorId: settings.creatorId })
  }

  // ── Player block interaction ─────────────────────────────────────────

  setBlock(x: number, y: number, z: number, type: BlockType): void {
    // Optimistic local update with sound
    this.applyBlockLocal(x, y, z, type, true)
    
    // Emit to server
    const settings = useSettingsStore()
    this.socket.emit('set-block', { x, y, z, type, creatorId: settings.creatorId })
  }

  applyBlockLocal(x: number, y: number, z: number, type: BlockType, playAudio: boolean = true): void {
    const key = blockKey(x, y, z)
    const existing = this.playerBlocks.get(key)
    if (existing) {
      this.scene.remove(existing.mesh)
      this.playerBlocks.delete(key)
      this.collisionGrid.delete(key)
    }
    if (type === 'air') return

    if (playAudio) {
      sound.playBlockPlace(type)
    }

    let matType: 'standard' | 'glass' | 'emissive' = 'standard'
    if (type === 'glass' || type === 'water') matType = 'glass'
    if (type === 'snow' || type === 'leaves') matType = 'emissive'

    const mat = makePremiumMaterial(BLOCK_COLORS[type], matType)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat)
    
    mesh.scale.set(0.1, 0.1, 0.1)
    mesh.position.set(x, y + 8, z)
    mesh.userData = { blockType: type, bx: x, by: y, bz: z, targetY: y }
    
    mesh.castShadow = true
    mesh.receiveShadow = true

    this.scene.add(mesh)
    this.playerBlocks.set(key, { type, mesh })
    if (isSolid(type)) this.collisionGrid.add(key)
  }

  animateBlocks(delta: number): void {
    for (const { mesh } of this.playerBlocks.values()) {
      if (mesh.position.y > mesh.userData.targetY) {
        mesh.position.y -= 30 * delta
        if (mesh.position.y < mesh.userData.targetY) mesh.position.y = mesh.userData.targetY
      }
      if (mesh.scale.x < 1) {
        const s = Math.min(1, mesh.scale.x + 6 * delta)
        mesh.scale.set(s, s, s)
      }
    }
  }

  getBlock(x: number, y: number, z: number): BlockType {
    const pType = this.playerBlocks.get(blockKey(x, y, z))?.type
    if (pType) return pType
    return 'air'
  }

  removeBlock(x: number, y: number, z: number): void {
    sound.playBlockBreak()
    this.setBlock(x, y, z, 'air')
  }

  // ── Collision ────────────────────────────────────────────────────────

  isSolidAt(x: number, y: number, z: number): boolean {
    return this.collisionGrid.has(blockKey(Math.floor(x), Math.floor(y), Math.floor(z)))
  }

  // ── Procedural Chunk Loading ─────────────────────────────────────────

  updateChunks(cameraX: number, cameraZ: number): void {
    const cx = Math.floor(cameraX / 16)
    const cz = Math.floor(cameraZ / 16)
    
    if (cx === this.lastChunkX && cz === this.lastChunkZ) return
    
    this.lastChunkX = cx
    this.lastChunkZ = cz
    
    const RENDER_DISTANCE = 3
    const activeChunks = new Set<string>()

    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const tcx = cx + dx
        const tcz = cz + dz
        const ckey = `${tcx},${tcz}`
        activeChunks.add(ckey)
        
        if (!this.chunks.has(ckey)) {
          this.loadChunk(tcx, tcz)
        }
      }
    }
    
    // Unload chunks out of range
    for (const [ckey, chunkData] of this.chunks.entries()) {
      if (!activeChunks.has(ckey)) {
        for (const mesh of chunkData.meshes) {
          this.scene.remove(mesh)
        }
        this.chunks.delete(ckey)
      }
    }
  }

  private async loadChunk(cx: number, cz: number): Promise<void> {
    const ckey = `${cx},${cz}`
    
    let chunkBlocks: Record<string, BlockType> | null = null

    try {
      const res = await fetch(`http://localhost:4000/api/chunks/${cx}/${cz}`)
      if (res.ok) chunkBlocks = await res.json()
    } catch (e) {
      console.warn('Backend not reachable, falling back to local generation')
    }

    if (!chunkBlocks) {
      const chunkData = generateChunk(cx, cz)
      chunkBlocks = chunkData.blocks
      try {
        await fetch('http://localhost:4000/api/chunks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chunkData)
        })
      } catch (e) { /* ignore */ }
    }

    const meshes: THREE.Object3D[] = []

    for (const [key, type] of Object.entries(chunkBlocks)) {
      const [x, y, z] = key.split(',').map(Number)
      
      let matType: 'standard' | 'glass' | 'emissive' = 'standard'
      if (type === 'glass' || type === 'water') matType = 'glass'
      if (type === 'snow' || type === 'leaves') matType = 'emissive'

      const mat = makePremiumMaterial(BLOCK_COLORS[type], matType)
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat)
      mesh.position.set(x + 0.5, y + 0.5, z + 0.5)
      
      mesh.receiveShadow = true
      
      this.scene.add(mesh)
      meshes.push(mesh)
      
      if (isSolid(type)) {
        this.collisionGrid.add(blockKey(Math.floor(x), Math.floor(y), Math.floor(z)))
      }
    }
    
    this.chunks.set(ckey, { meshes, generated: true })
  }

  // ── Serialization ────────────────────────────────────────────────────

  toWorldData(name: string): WorldData {
    const chunkMap: Record<string, Record<string, BlockType>> = {}
    for (const [key, { type }] of this.playerBlocks) {
      const [xs, ys, zs] = key.split(',')
      const cx = Math.floor(parseInt(xs) / 16)
      const cz = Math.floor(parseInt(zs) / 16)
      const ckey = `${cx},${cz}`
      if (!chunkMap[ckey]) chunkMap[ckey] = {}
      chunkMap[ckey][`${xs},${ys},${zs}`] = type
    }
    return {
      name,
      version: '0.2.0',
      chunks: Object.entries(chunkMap).map(([ckey, blocks]) => {
        const [cx, cz] = ckey.split(',').map(Number)
        return { cx, cz, blocks }
      }),
      spawnPoint: { x: 0, y: 15, z: 0 },
    }
  }

  loadWorldData(data: WorldData): void {
    this.clearPlayerBlocks()
    for (const chunk of data.chunks) {
      for (const [key, type] of Object.entries(chunk.blocks)) {
        const [x, y, z] = key.split(',').map(Number)
        this.setBlock(x, y, z, type)
      }
    }
  }

  private clearPlayerBlocks(): void {
    for (const { mesh } of this.playerBlocks.values()) {
      this.scene.remove(mesh)
    }
    this.playerBlocks.clear()
  }

  clearWorldMeshes(): void {
    for (const chunk of this.chunks.values()) {
      for (const mesh of chunk.meshes) {
        this.scene.remove(mesh)
      }
    }
    this.chunks.clear()
    this.collisionGrid.clear()
    for (const [key, { type }] of this.playerBlocks) {
      if (isSolid(type)) this.collisionGrid.add(key)
    }
  }

  clear(): void {
    this.clearPlayerBlocks()
    this.clearWorldMeshes()
  }

  getSpawnPoint(): Vec3 {
    return { x: 0, y: 15, z: 8 }
  }

  getRaycastableMeshes(): THREE.Object3D[] {
    const meshes: THREE.Object3D[] = []
    for (const chunk of this.chunks.values()) {
      meshes.push(...chunk.meshes)
    }
    for (const { mesh } of this.playerBlocks.values()) {
      meshes.push(mesh)
    }
    return meshes
  }
}
