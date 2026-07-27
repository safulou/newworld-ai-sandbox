import * as THREE from 'three'
import { WorldEngine } from './world'

const PLAYER_HEIGHT = 1.8
const PLAYER_WIDTH = 0.6
const GRAVITY = -20
const JUMP_FORCE = 8
const MOVE_SPEED = 5

export class Player {
  camera: THREE.PerspectiveCamera
  velocity = new THREE.Vector3()
  onGround = false
  private keys: Record<string, boolean> = {}

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.camera.position.set(0, 2, 5)
    this.setupInput()
  }

  private setupInput(): void {
    window.addEventListener('keydown', e => { this.keys[e.code] = true })
    window.addEventListener('keyup', e => { this.keys[e.code] = false })
  }

  jump(): void {
    if (this.onGround) {
      this.velocity.y = JUMP_FORCE
      this.onGround = false
    }
  }

  update(delta: number, world: WorldEngine): void {
    if (this.keys['Space']) this.jump()

    const dir = new THREE.Vector3()
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    this.camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0))

    if (this.keys['KeyW']) dir.add(forward)
    if (this.keys['KeyS']) dir.sub(forward)
    if (this.keys['KeyA']) dir.sub(right)
    if (this.keys['KeyD']) dir.add(right)
    if (dir.lengthSq() > 0) dir.normalize()

    this.velocity.x = dir.x * MOVE_SPEED
    this.velocity.z = dir.z * MOVE_SPEED
    this.velocity.y += GRAVITY * delta

    this.resolveCollisions(delta, world)
  }

  private resolveCollisions(delta: number, world: WorldEngine): void {
    const pos = this.camera.position
    const hw = PLAYER_WIDTH / 2

    // vertical
    pos.y += this.velocity.y * delta
    const feetY = pos.y - PLAYER_HEIGHT
    const headY = pos.y

    const floorY = Math.floor(feetY)
    if (world.isSolidAt(pos.x, floorY, pos.z)) {
      pos.y = floorY + 1 + PLAYER_HEIGHT
      this.velocity.y = 0
      this.onGround = true
    } else {
      this.onGround = false
    }
    if (world.isSolidAt(pos.x, Math.ceil(headY), pos.z)) {
      pos.y = Math.ceil(headY) - PLAYER_HEIGHT - 0.01
      this.velocity.y = Math.min(0, this.velocity.y)
    }

    // horizontal
    pos.x += this.velocity.x * delta
    if (world.isSolidAt(pos.x + hw, pos.y - 0.5, pos.z) ||
        world.isSolidAt(pos.x - hw, pos.y - 0.5, pos.z)) {
      pos.x -= this.velocity.x * delta
    }
    pos.z += this.velocity.z * delta
    if (world.isSolidAt(pos.x, pos.y - 0.5, pos.z + hw) ||
        world.isSolidAt(pos.x, pos.y - 0.5, pos.z - hw)) {
      pos.z -= this.velocity.z * delta
    }
  }
}
