import * as THREE from 'three'
import { BlockPlacement, BlockType, BuildAction, Vec3, WorldData } from '@/types/world'
import { BLOCK_COLORS, blockKey, isSolid } from './blocks'
import { makePremiumMaterial } from './scene'
import { generateChunk } from './terrain'
import { io, Socket } from 'socket.io-client'
import { DecentralizedWorker } from './worker'
import { useSettingsStore } from '@/stores/settings'
import { sound } from './audio'
import { history, HistoryEngine } from './history'

export interface ClaimedPlot {
  cx: number
  cz: number
  owner_id: string
  plot_name: string
  claimed_at?: string
}

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

  // Plot visual borders
  private plotBordersGroup = new THREE.Group()
  private claimedPlots: ClaimedPlot[] = []
  private currentChunkCoords = { cx: 0, cz: 0 }

  // History Engine
  public history: HistoryEngine = history

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.scene.add(this.plotBordersGroup)

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
      if (data.status === 'completed' || data.status === 'done') {
        sound.playBuildComplete()
      }
      window.dispatchEvent(new CustomEvent('build-progress', { detail: data }))
    })

    this.socket.on('plot-claimed', (plot: ClaimedPlot) => {
      const idx = this.claimedPlots.findIndex(p => p.cx === plot.cx && p.cz === plot.cz)
      if (idx >= 0) {
        this.claimedPlots[idx] = plot
      } else {
        this.claimedPlots.push(plot)
      }
      this.renderPlotBorders()
    })

    this.fetchPlots()
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
      existing.mesh.geometry.dispose()
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
        mesh.position.y -= 32 * delta
        if (mesh.position.y < mesh.userData.targetY) mesh.position.y = mesh.userData.targetY
      }
      if (mesh.scale.x < 1) {
        const s = Math.min(1, mesh.scale.x + 7 * delta)
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
    const prevType = this.getBlock(x, y, z)
    sound.playBlockBreak()
    this.setBlock(x, y, z, 'air')
    if (prevType !== 'air') {
      this.history.recordAction(`Break block (${prevType})`, [{ x, y, z, type: prevType }], [{ x, y, z, type: 'air' }])
    }
  }

  recordSinglePlacement(x: number, y: number, z: number, prevType: BlockType, newType: BlockType): void {
    this.history.recordAction(`Place block (${newType})`, [{ x, y, z, type: prevType }], [{ x, y, z, type: newType }])
  }

  // ── Batch Actions & Spatial Build History ────────────────────────────

  applyBuildActions(actions: BuildAction[], description: string = 'Procedural Build'): void {
    const undoPlacements: BlockPlacement[] = []
    const redoPlacements: BlockPlacement[] = []

    for (const act of actions) {
      if (act.type === 'place_block') {
        const [x, y, z] = act.position
        const prevType = this.getBlock(x, y, z)
        undoPlacements.push({ x, y, z, type: prevType })
        redoPlacements.push({ x, y, z, type: act.material })
        this.setBlock(x, y, z, act.material)
      }
    }

    this.history.recordAction(description, undoPlacements, redoPlacements)
  }

  undoLastBuild(): boolean {
    const desc = this.history.undo(this)
    if (desc) {
      sound.playBlockBreak()
      return true
    }
    return false
  }

  redoLastBuild(): boolean {
    const desc = this.history.redo(this)
    if (desc) {
      sound.playBlockPlace('stone')
      return true
    }
    return false
  }

  // ── Collision ────────────────────────────────────────────────────────

  isSolidAt(x: number, y: number, z: number): boolean {
    return this.collisionGrid.has(blockKey(Math.floor(x), Math.floor(y), Math.floor(z)))
  }

  // ── Virtual Real Estate / Plot Visual Grid Borders ───────────────────

  async fetchPlots(): Promise<void> {
    try {
      const res = await fetch('http://localhost:4000/api/plots')
      if (res.ok) {
        this.claimedPlots = await res.json()
        this.renderPlotBorders()
      }
    } catch { /* ignore offline */ }
  }

  updateActiveChunk(cx: number, cz: number): void {
    if (cx === this.currentChunkCoords.cx && cz === this.currentChunkCoords.cz) return
    this.currentChunkCoords = { cx, cz }
    this.renderPlotBorders()
  }

  private renderPlotBorders(): void {
    // Clear old border meshes
    while (this.plotBordersGroup.children.length > 0) {
      const obj = this.plotBordersGroup.children[0]
      if (obj) {
        this.plotBordersGroup.remove(obj)
        if (obj instanceof THREE.LineSegments || obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
        }
      }
    }

    const { cx: curCx, cz: curCz } = this.currentChunkCoords

    // 1. Current chunk border (Glowing Cyan)
    const curGeo = this.createChunkBorderGeometry(curCx, curCz, 0.08)
    const curMat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    })
    const curLine = new THREE.LineSegments(curGeo, curMat)
    this.plotBordersGroup.add(curLine)

    // 2. Claimed plots borders (Glowing Gold with corner beacons)
    const pylonGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8)
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 2.5,
      metalness: 0.4,
      roughness: 0.2,
    })

    const claimedMat = new THREE.LineBasicMaterial({
      color: 0xffd700,
      linewidth: 2,
      transparent: true,
      opacity: 0.9,
    })

    for (const plot of this.claimedPlots) {
      const geo = this.createChunkBorderGeometry(plot.cx, plot.cz, 0.1)
      const line = new THREE.LineSegments(geo, claimedMat)
      this.plotBordersGroup.add(line)

      // Add 4 corner glowing beacons
      const minX = plot.cx * 16
      const maxX = (plot.cx + 1) * 16
      const minZ = plot.cz * 16
      const maxZ = (plot.cz + 1) * 16

      const corners = [
        [minX, minZ],
        [maxX, minZ],
        [maxX, maxZ],
        [minX, maxZ],
      ]

      for (const [px, pz] of corners) {
        const pylon = new THREE.Mesh(pylonGeo, pylonMat)
        pylon.position.set(px, 0.9, pz)
        this.plotBordersGroup.add(pylon)
      }
    }
  }

  private createChunkBorderGeometry(cx: number, cz: number, yOffset: number = 0.05): THREE.BufferGeometry {
    const minX = cx * 16
    const maxX = (cx + 1) * 16
    const minZ = cz * 16
    const maxZ = (cz + 1) * 16

    const points: number[] = [
      // Top Edge
      minX, yOffset, minZ,
      maxX, yOffset, minZ,
      // Right Edge
      maxX, yOffset, minZ,
      maxX, yOffset, maxZ,
      // Bottom Edge
      maxX, yOffset, maxZ,
      minX, yOffset, maxZ,
      // Left Edge
      minX, yOffset, maxZ,
      minX, yOffset, minZ,
    ]

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }

  // ── Procedural Chunk Loading ─────────────────────────────────────────

  updateChunks(cameraX: number, cameraZ: number): void {
    const cx = Math.floor(cameraX / 16)
    const cz = Math.floor(cameraZ / 16)
    
    this.updateActiveChunk(cx, cz)

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
    } catch {
      // Backend offline, proceed to procedural generation
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
      } catch { /* ignore */ }
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
      mesh.geometry.dispose()
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
    this.history.clear()
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
