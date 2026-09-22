import * as THREE from 'three'
import { BlockType, BuildAction, Vec3 } from '@/types/world'
import { sound } from './audio'
import { achievements } from './achievements'

export type MinigameType = 'none' | 'parkour' | 'target_practice' | 'laser_arena' | 'voxel_snake'

export interface MinigameState {
  type: MinigameType
  score: number
  timer: number
  isActive: boolean
  checkpointIndex: number
  combo: number
  comboTimer: number
  targetsHit: number
  snakeLength: number
  applesEaten: number
  statusMessage: string
  isGameOver: boolean
}

export interface CombatDrone {
  id: string
  mesh: THREE.Group
  position: THREE.Vector3
  targetPos: THREE.Vector3
  speed: number
  bobPhase: number
  alive: boolean
  respawnTime: number
}

export interface SnakeSegment {
  position: THREE.Vector3
  mesh: THREE.Mesh
}

export class MinigamesEngine {
  private scene: THREE.Scene | null = null
  private arenaOrigin: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

  public state: MinigameState = {
    type: 'none',
    score: 0,
    timer: 0,
    isActive: false,
    checkpointIndex: 0,
    combo: 1,
    comboTimer: 0,
    targetsHit: 0,
    snakeLength: 3,
    applesEaten: 0,
    statusMessage: '',
    isGameOver: false,
  }

  // Laser Arena Combat Drones
  public drones: CombatDrone[] = []
  private dronesGroup: THREE.Group = new THREE.Group()

  // Voxel Snake Assets
  public snakeSegments: SnakeSegment[] = []
  private snakeGroup: THREE.Group = new THREE.Group()
  private foodMesh: THREE.Mesh | null = null
  public foodPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  private lastSnakeStepPos: THREE.Vector3 = new THREE.Vector3()

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.scene.add(this.dronesGroup)
    this.scene.add(this.snakeGroup)
  }

  // ── 🏃‍♂️ 霓虹跑酷極限競速 (Neon Parkour Speedrun) ─────────────────────

  public generateParkourCourse(startPos: Vec3): BuildAction[] {
    this.cleanupGameEntities()
    const actions: BuildAction[] = []
    let curX = startPos.x
    let curY = startPos.y + 1
    let curZ = startPos.z

    const platformMaterials = ['neon_cyan', 'neon_magenta', 'neon_yellow', 'neon_green', 'quantum_core'] as const

    for (let i = 0; i < 20; i++) {
      const dx = (Math.random() - 0.5) * 6
      const dy = Math.floor(Math.random() * 2) + 1
      const dz = (Math.random() - 0.5) * 6

      curX += Math.round(dx)
      curY += dy
      curZ += Math.round(dz)

      const mat = platformMaterials[i % platformMaterials.length]

      // 2x2 platform
      actions.push(
        { type: 'place_block', position: [curX, curY, curZ], material: mat },
        { type: 'place_block', position: [curX + 1, curY, curZ], material: mat },
        { type: 'place_block', position: [curX, curY, curZ + 1], material: mat },
        { type: 'place_block', position: [curX + 1, curY, curZ + 1], material: mat }
      )

      if (i === 19) {
        // Goal beacon
        actions.push({ type: 'place_block', position: [curX, curY + 1, curZ], material: 'jump_pad' })
      }
    }

    this.state = {
      type: 'parkour',
      score: 0,
      timer: 0,
      isActive: true,
      checkpointIndex: 0,
      combo: 1,
      comboTimer: 0,
      targetsHit: 0,
      snakeLength: 0,
      applesEaten: 0,
      statusMessage: '🏃‍♂️ 跑酷關卡已生成！抵達終點彈跳墊結算！',
      isGameOver: false,
    }

    sound.playFanfare()
    achievements.unlock('jump_master')
    return actions
  }

  // ── 🔫 賽博 PvP 激光槍戰 (Cyber Laser PvP Arena) ────────────────────

  public generateLaserArena(origin: Vec3): BuildAction[] {
    this.cleanupGameEntities()
    this.arenaOrigin.set(origin.x, origin.y, origin.z)
    const actions: BuildAction[] = []
    const ox = Math.floor(origin.x)
    const oy = Math.floor(origin.y)
    const oz = Math.floor(origin.z)
    const size = 15 // half size -> 30x30 arena

    // 1. Neon Floor Grid & Boundary Walls
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        // Perimeter force-field wall
        if (Math.abs(x) === size || Math.abs(z) === size) {
          const wallMat = (x + z) % 2 === 0 ? 'neon_cyan' : 'neon_magenta'
          actions.push({ type: 'place_block', position: [ox + x, oy + 1, oz + z], material: wallMat })
          actions.push({ type: 'place_block', position: [ox + x, oy + 2, oz + z], material: 'glass' })
        }
      }
    }

    // 2. Tactical Cover Barricades & Corner High-Ground Towers
    const towerOffsets = [
      { x: -10, z: -10 },
      { x: 10, z: -10 },
      { x: -10, z: 10 },
      { x: 10, z: 10 },
    ]

    for (const t of towerOffsets) {
      // 3-tier sniper tower
      for (let h = 1; h <= 4; h++) {
        actions.push({ type: 'place_block', position: [ox + t.x, oy + h, oz + t.z], material: 'cyber_plating' })
      }
      // Jump pad at base of tower to launch player up
      actions.push({ type: 'place_block', position: [ox + t.x + 1, oy + 1, oz + t.z], material: 'jump_pad' })
      actions.push({ type: 'place_block', position: [ox + t.x, oy + 5, oz + t.z], material: 'neon_yellow' })
    }

    // Tactical center quantum obelisk
    actions.push(
      { type: 'place_block', position: [ox, oy + 1, oz], material: 'quantum_core' },
      { type: 'place_block', position: [ox, oy + 2, oz], material: 'quantum_core' },
      { type: 'place_block', position: [ox, oy + 3, oz], material: 'jump_pad' }
    )

    // Mid-ground cover barriers
    const covers = [
      { x: -5, z: 0 }, { x: 5, z: 0 }, { x: 0, z: -5 }, { x: 0, z: 5 },
      { x: -4, z: -4 }, { x: 4, z: 4 }
    ]
    for (const c of covers) {
      actions.push(
        { type: 'place_block', position: [ox + c.x, oy + 1, oz + c.z], material: 'concrete' },
        { type: 'place_block', position: [ox + c.x, oy + 2, oz + c.z], material: 'neon_cyan' }
      )
    }

    // 3. Spawn 5 Autonomous 3D Cyber Drones
    if (this.scene) {
      this.spawnLaserDrones(ox, oy, oz, size)
    }

    this.state = {
      type: 'laser_arena',
      score: 0,
      timer: 60, // 60s battle round
      isActive: true,
      checkpointIndex: 0,
      combo: 1,
      comboTimer: 0,
      targetsHit: 0,
      snakeLength: 0,
      applesEaten: 0,
      statusMessage: '🔫 激光競技場已就緒！使用電漿發射器擊毀所有敵方無人機！',
      isGameOver: false,
    }

    sound.playFanfare()
    return actions
  }

  private spawnLaserDrones(ox: number, oy: number, oz: number, size: number): void {
    this.cleanupDrones()

    for (let i = 0; i < 5; i++) {
      const droneGroup = new THREE.Group()

      // Core sphere
      const coreGeo = new THREE.OctahedronGeometry(0.55, 1)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9,
      })
      const coreMesh = new THREE.Mesh(coreGeo, coreMat)

      // Outer energy ring
      const ringGeo = new THREE.TorusGeometry(0.85, 0.06, 8, 24)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = Math.PI / 2
      ringMesh.name = 'ring'

      droneGroup.add(coreMesh, ringMesh)

      const spawnX = ox + (Math.random() - 0.5) * (size * 1.5)
      const spawnY = oy + 3 + Math.random() * 4
      const spawnZ = oz + (Math.random() - 0.5) * (size * 1.5)

      droneGroup.position.set(spawnX, spawnY, spawnZ)
      this.dronesGroup.add(droneGroup)

      this.drones.push({
        id: 'drone_' + i,
        mesh: droneGroup,
        position: droneGroup.position,
        targetPos: new THREE.Vector3(spawnX, spawnY, spawnZ),
        speed: 3.5 + Math.random() * 2,
        bobPhase: Math.random() * Math.PI * 2,
        alive: true,
        respawnTime: 0,
      })
    }
  }

  /**
   * Tests if a laser ray hit any active combat drone
   */
  public checkLaserHit(hitPoint: THREE.Vector3): boolean {
    if (this.state.type !== 'laser_arena' || !this.state.isActive) return false

    for (const drone of this.drones) {
      if (!drone.alive) continue

      const dist = drone.position.distanceTo(hitPoint)
      if (dist < 1.8) {
        // Drone Hit!
        drone.alive = false
        drone.mesh.visible = false
        drone.respawnTime = 3.0 // respawn in 3s

        this.state.targetsHit++
        this.state.score += 100 * this.state.combo
        this.state.combo = Math.min(8, this.state.combo + 1)
        this.state.comboTimer = 4.0 // 4s combo window

        sound.playBlockBreak()
        sound.playFanfare()

        if (this.state.targetsHit >= 5) {
          achievements.unlock('laser_arena_ace')
        }
        return true
      }
    }

    return false
  }

  // ── 🐍 3D 體素貪吃蛇 (3D Voxel Snake Arena) ──────────────────────────

  public generateSnakeArena(origin: Vec3): BuildAction[] {
    this.cleanupGameEntities()
    this.arenaOrigin.set(origin.x, origin.y, origin.z)
    const actions: BuildAction[] = []
    const ox = Math.floor(origin.x)
    const oy = Math.floor(origin.y)
    const oz = Math.floor(origin.z)
    const size = 12 // 24x24 arena

    // 1. Concrete Arena Floor with Neon Green Borders
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        const isBorder = Math.abs(x) === size || Math.abs(z) === size
        const mat: BlockType = isBorder ? 'neon_green' : (x + z) % 2 === 0 ? 'concrete' : 'cyber_plating'
        actions.push({ type: 'place_block', position: [ox + x, oy, oz + z], material: mat })

        if (isBorder) {
          // Boundary rail height 2
          actions.push(
            { type: 'place_block', position: [ox + x, oy + 1, oz + z], material: 'neon_green' },
            { type: 'place_block', position: [ox + x, oy + 2, oz + z], material: 'glass' }
          )
        }
      }
    }

    this.state = {
      type: 'voxel_snake',
      score: 0,
      timer: 0,
      isActive: true,
      checkpointIndex: 0,
      combo: 1,
      comboTimer: 0,
      targetsHit: 0,
      snakeLength: 3,
      applesEaten: 0,
      statusMessage: '🐍 3D 體素貪吃蛇已啟動！奔跑吞噬量子能量果，切勿撞牆或自身尾巴！',
      isGameOver: false,
    }

    this.lastSnakeStepPos.set(ox, oy + 1, oz)

    // Spawn first food apple
    if (this.scene) {
      this.spawnSnakeFood(ox, oy, oz, size - 2)
    }

    sound.playFanfare()
    return actions
  }

  private spawnSnakeFood(ox: number, oy: number, oz: number, range: number): void {
    if (!this.foodMesh) {
      const foodGeo = new THREE.DodecahedronGeometry(0.48)
      const foodMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
      })
      this.foodMesh = new THREE.Mesh(foodGeo, foodMat)
      this.snakeGroup.add(this.foodMesh)
    }

    const fx = ox + Math.round((Math.random() - 0.5) * range * 2)
    const fz = oz + Math.round((Math.random() - 0.5) * range * 2)
    this.foodPos.set(fx, oy + 1.2, fz)
    this.foodMesh.position.copy(this.foodPos)
    this.foodMesh.visible = true
  }

  private addSnakeSegment(pos: THREE.Vector3): void {
    const geo = new THREE.BoxGeometry(0.7, 0.7, 0.7)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aaff,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    this.snakeGroup.add(mesh)

    this.snakeSegments.unshift({ position: pos.clone(), mesh })

    // Trim excess segments beyond current snake length
    while (this.snakeSegments.length > this.state.snakeLength) {
      const tail = this.snakeSegments.pop()
      if (tail) {
        this.snakeGroup.remove(tail.mesh)
        tail.mesh.geometry.dispose()
      }
    }
  }

  // ── 🔄 Per-Frame Loop Update ────────────────────────────────────────

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (!this.state.isActive || this.state.isGameOver) return

    this.state.timer += delta

    // 1. Update Laser Arena
    if (this.state.type === 'laser_arena') {
      this.updateLaserArena(delta, playerPos)
    }

    // 2. Update Voxel Snake
    if (this.state.type === 'voxel_snake') {
      this.updateVoxelSnake(playerPos)
    }
  }

  private updateLaserArena(delta: number, playerPos: THREE.Vector3): void {
    // Countdown timer for 60s round
    const remaining = Math.max(0, 60 - Math.floor(this.state.timer))
    this.state.statusMessage = `⏱️ 剩餘時間: ${remaining}s | 🎯 擊破: ${this.state.targetsHit} 架 | ⭐ 分數: ${this.state.score} (連擊 x${this.state.combo})`

    if (this.state.comboTimer > 0) {
      this.state.comboTimer -= delta
      if (this.state.comboTimer <= 0) {
        this.state.combo = 1
      }
    }

    if (remaining <= 0) {
      this.endGame(true, `🏆 激光對決結算！總分: ${this.state.score} 分！`)
      return
    }

    // Animate Combat Drones
    for (const drone of this.drones) {
      if (!drone.alive) {
        drone.respawnTime -= delta
        if (drone.respawnTime <= 0) {
          drone.alive = true
          drone.mesh.visible = true
          drone.position.set(
            this.arenaOrigin.x + (Math.random() - 0.5) * 20,
            this.arenaOrigin.y + 3 + Math.random() * 4,
            this.arenaOrigin.z + (Math.random() - 0.5) * 20
          )
        }
        continue
      }

      // Rotate energy ring
      const ring = drone.mesh.getObjectByName('ring')
      if (ring) {
        ring.rotation.z += delta * 3
      }

      // Sinusoidal bobbing
      drone.bobPhase += delta * 2.5
      drone.position.y += Math.sin(drone.bobPhase) * 0.015

      // Gentle wander toward target or dodge away from player
      const distToPlayer = drone.position.distanceTo(playerPos)
      if (distToPlayer < 5.0) {
        // Evade player
        const evadeDir = drone.position.clone().sub(playerPos).normalize()
        drone.position.addScaledVector(evadeDir, delta * 3.0)
      } else {
        // Orbit
        drone.position.x += Math.cos(drone.bobPhase * 0.5) * delta * 2.0
        drone.position.z += Math.sin(drone.bobPhase * 0.5) * delta * 2.0
      }
    }
  }

  private updateVoxelSnake(playerPos: THREE.Vector3): void {
    // Rotate and pulse food apple
    if (this.foodMesh) {
      this.foodMesh.rotation.x += 0.03
      this.foodMesh.rotation.y += 0.04
      this.foodMesh.scale.setScalar(1.0 + Math.sin(Date.now() * 0.008) * 0.15)
    }

    // Check food consumption
    const distToFood = playerPos.distanceTo(this.foodPos)
    if (distToFood < 1.6) {
      this.state.applesEaten++
      this.state.snakeLength += 2
      this.state.score += 150 * Math.max(1, Math.floor(this.state.applesEaten / 3))
      sound.playFanfare()

      // Spawn next apple
      this.spawnSnakeFood(
        Math.floor(this.arenaOrigin.x),
        Math.floor(this.arenaOrigin.y),
        Math.floor(this.arenaOrigin.z),
        10
      )

      if (this.state.snakeLength >= 12) {
        achievements.unlock('voxel_snake_master')
      }
    }

    // Record trail step when player moves > 0.85m
    if (playerPos.distanceTo(this.lastSnakeStepPos) > 0.85) {
      this.lastSnakeStepPos.copy(playerPos)
      const segmentPos = new THREE.Vector3(
        playerPos.x,
        this.arenaOrigin.y + 0.5,
        playerPos.z
      )
      this.addSnakeSegment(segmentPos)
    }

    // Check tail collision (segments older than index 4)
    for (let i = 5; i < this.snakeSegments.length; i++) {
      const seg = this.snakeSegments[i]
      if (playerPos.distanceTo(seg.position) < 0.8) {
        this.endGame(false, `💥 貪吃蛇撞上自身尾巴！遊戲結束！最終得分: ${this.state.score}`)
        return
      }
    }

    // Check wall collision (outside 24x24 arena)
    const dx = Math.abs(playerPos.x - this.arenaOrigin.x)
    const dz = Math.abs(playerPos.z - this.arenaOrigin.z)
    if (dx > 12.5 || dz > 12.5) {
      this.endGame(false, `🚨 撞擊防護力場邊界！遊戲結束！最終得分: ${this.state.score}`)
      return
    }

    this.state.statusMessage = `🍏 吞噬能量果: ${this.state.applesEaten} 顆 | 📏 尾身長度: ${this.snakeSegments.length} 節 | ⭐ 得分: ${this.state.score}`
  }

  public endGame(victory: boolean, message: string): void {
    this.state.isGameOver = true
    this.state.isActive = false
    this.state.statusMessage = message
    if (victory) {
      sound.playFanfare()
    } else {
      sound.playBlockBreak()
    }
  }

  public cleanupGameEntities(): void {
    this.cleanupDrones()
    this.cleanupSnake()
    this.state.isActive = false
    this.state.type = 'none'
  }

  private cleanupDrones(): void {
    while (this.dronesGroup.children.length > 0) {
      const child = this.dronesGroup.children[0]
      this.dronesGroup.remove(child)
    }
    this.drones = []
  }

  private cleanupSnake(): void {
    while (this.snakeGroup.children.length > 0) {
      const child = this.snakeGroup.children[0]
      this.snakeGroup.remove(child)
    }
    this.snakeSegments = []
    this.foodMesh = null
  }

  public completeMinigame(): { timeSeconds: number; score: number } {
    this.cleanupGameEntities()
    sound.playFanfare()
    const result = { timeSeconds: Math.floor(this.state.timer), score: this.state.score || 1000 }
    return result
  }
}

export const minigames = new MinigamesEngine()
