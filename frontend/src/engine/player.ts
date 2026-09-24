import * as THREE from 'three'
import { WorldEngine } from './world'
import { sound } from './audio'
import { BlockType } from '@/types/world'
import { vehicles } from './vehicles'
import { fluids } from './fluids'
import { survivalCombat } from './survivalCombat'

export type CameraViewMode = 'rts' | 'fpp' | 'tpp'

export class PlayerController {
  private camera: THREE.PerspectiveCamera
  private world: WorldEngine
  private domElement: HTMLElement

  // Position & Physics
  public position = new THREE.Vector3(0, 15, 8)
  public velocity = new THREE.Vector3(0, 0, 0)
  public rotation = new THREE.Euler(0, 0, 0, 'YXZ')

  public viewMode: CameraViewMode = 'rts'
  public flyMode: boolean = false
  public isGrounded: boolean = false
  public isLocked: boolean = false

  private keys: Record<string, boolean> = {}
  private moveSpeed = 8
  private sprintMultiplier = 1.8
  private jumpForce = 8.5
  private gravity = -22
  private eyeHeight = 1.6

  // Third-person target mesh
  private avatarMesh: THREE.Group

  constructor(camera: THREE.PerspectiveCamera, world: WorldEngine, domElement: HTMLElement) {
    this.camera = camera
    this.world = world
    this.domElement = domElement

    // Create local avatar for TPP mode
    this.avatarMesh = new THREE.Group()
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3, metalness: 0.8 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.35), bodyMat)
    body.position.y = 0.5
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.4), bodyMat)
    head.position.y = 1.25
    this.avatarMesh.add(body, head)
    this.avatarMesh.visible = false

    this.bindEvents()
  }

  getAvatar(): THREE.Group {
    return this.avatarMesh
  }

  public launchUpward(force: number = 18): void {
    this.velocity.y = force
    this.isGrounded = false
  }

  public setPosition(pos: THREE.Vector3): void {
    this.position.copy(pos)
    this.velocity.set(0, 0, 0)
  }

  private bindEvents(): void {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('virtual-joystick-move', this.onJoystickMove)
    window.addEventListener('explosion-knockback', this.onKnockback)
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('virtual-joystick-move', this.onJoystickMove)
    window.removeEventListener('explosion-knockback', this.onKnockback)
  }

  private onKnockback = (e: Event) => {
    const detail = (e as CustomEvent).detail
    if (detail && detail.origin) {
      const dir = this.position.clone().sub(new THREE.Vector3(detail.origin.x, detail.origin.y, detail.origin.z)).normalize()
      dir.y = Math.max(0.4, dir.y)
      this.velocity.addScaledVector(dir, detail.force || 8)
      this.isGrounded = false
      if (detail.damage) {
        survivalCombat.takeDamage(detail.damage)
      }
    }
  }

  private onJoystickMove = (e: Event) => {
    const detail = (e as CustomEvent).detail
    if (detail) {
      this.keys['KeyW'] = !!detail.w
      this.keys['KeyS'] = !!detail.s
      this.keys['KeyA'] = !!detail.a
      this.keys['KeyD'] = !!detail.d
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true

    // Toggle camera mode with 'V'
    if (e.code === 'KeyV') {
      this.cycleViewMode()
    }

    // Toggle fly mode with 'KeyF'
    if (e.code === 'KeyF') {
      this.flyMode = !this.flyMode
      this.velocity.set(0, 0, 0)
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isLocked || this.viewMode === 'rts') return

    const sensitivity = 0.0022
    this.rotation.y -= e.movementX * sensitivity
    this.rotation.x -= e.movementY * sensitivity
    this.rotation.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.rotation.x))
  }

  public cycleViewMode(): void {
    if (this.viewMode === 'rts') {
      this.viewMode = 'fpp'
      this.avatarMesh.visible = false
      this.requestPointerLock()
    } else if (this.viewMode === 'fpp') {
      this.viewMode = 'tpp'
      this.avatarMesh.visible = true
    } else {
      this.viewMode = 'rts'
      this.avatarMesh.visible = false
      this.exitPointerLock()
    }
  }

  public requestPointerLock(): void {
    if (this.domElement.requestPointerLock) {
      this.domElement.requestPointerLock()
      this.isLocked = true
    }
  }

  public exitPointerLock(): void {
    if (document.exitPointerLock) {
      document.exitPointerLock()
      this.isLocked = false
    }
  }

  // ── Physics & Movement Update ────────────────────────────────────────
  public update(delta: number): void {
    if (this.viewMode === 'rts') return // RTS camera managed by OrbitControls

    const speed = this.moveSpeed * (this.keys['ShiftLeft'] || this.keys['ShiftRight'] ? this.sprintMultiplier : 1) * vehicles.getSpeedMultiplier()

    // Calculate forward & right vectors based on yaw
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y)
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y)

    const moveDir = new THREE.Vector3(0, 0, 0)
    if (this.keys['KeyW']) moveDir.add(forward)
    if (this.keys['KeyS']) moveDir.sub(forward)
    if (this.keys['KeyD']) moveDir.add(right)
    if (this.keys['KeyA']) moveDir.sub(right)

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize()
      this.velocity.x = moveDir.x * speed
      this.velocity.z = moveDir.z * speed

      if (this.isGrounded && !this.flyMode) {
        const blockBelow = this.world.getBlock(
          Math.floor(this.position.x),
          Math.floor(this.position.y - 0.2),
          Math.floor(this.position.z)
        )
        sound.playFootstep(blockBelow as BlockType)
      }
    } else {
      this.velocity.x *= 0.6
      this.velocity.z *= 0.6
    }

    if (this.flyMode) {
      if (this.keys['Space']) this.velocity.y = speed
      else if (this.keys['KeyC'] || this.keys['ControlLeft']) this.velocity.y = -speed
      else this.velocity.y = 0
    } else {
      // Check immersion in fluid (water / magma)
      const fluidState = fluids.checkFluidImmersion(this.position, this.world)
      if (fluidState.inFluid) {
        // Fluid buoyancy & viscous damping
        this.velocity.y += 24 * delta
        this.velocity.y = Math.min(this.velocity.y, 4.0)
        this.velocity.x *= 0.85
        this.velocity.z *= 0.85

        if (this.keys['Space']) {
          this.velocity.y = 5.2
        }
      } else {
        // Normal Gravity & Jumping
        if (!this.isGrounded) {
          this.velocity.y += this.gravity * delta
        } else {
          if (this.keys['Space']) {
            this.velocity.y = this.jumpForce
            this.isGrounded = false
            sound.playJump()
          }
        }
      }
    }

    // Magma environmental hazard check
    const footBlock = this.world.getBlock(Math.floor(this.position.x), Math.floor(this.position.y), Math.floor(this.position.z))
    const belowBlock = this.world.getBlock(Math.floor(this.position.x), Math.floor(this.position.y - 0.5), Math.floor(this.position.z))
    if (footBlock === 'magma' || belowBlock === 'magma') {
      survivalCombat.takeDamage(16 * delta)
    }

    // Apply movement with simple voxel collision
    this.moveWithCollision(delta)

    // Update Avatar Position & Camera
    this.avatarMesh.position.copy(this.position)
    this.avatarMesh.rotation.y = this.rotation.y

    const isMoving = this.velocity.lengthSq() > 0.1
    vehicles.update(delta, this.position, isMoving, this.rotation.y)

    if (this.viewMode === 'fpp') {
      this.camera.position.set(this.position.x, this.position.y + this.eyeHeight, this.position.z)
      this.camera.quaternion.setFromEuler(this.rotation)
    } else if (this.viewMode === 'tpp') {
      const offset = new THREE.Vector3(0, 1.8, 4.5).applyEuler(new THREE.Euler(this.rotation.x * 0.4, this.rotation.y, 0, 'YXZ'))
      this.camera.position.copy(this.position).add(offset)
      this.camera.lookAt(this.position.x, this.position.y + this.eyeHeight * 0.8, this.position.z)
    }
  }

  private moveWithCollision(delta: number): void {
    if (this.flyMode) {
      this.position.addScaledVector(this.velocity, delta)
      return
    }

    // Horizontal movement
    const nextX = this.position.x + this.velocity.x * delta
    const nextZ = this.position.z + this.velocity.z * delta
    const nextY = this.position.y + this.velocity.y * delta

    // Check collision at foot and head level
    if (!this.world.isSolidAt(nextX, this.position.y, this.position.z) &&
        !this.world.isSolidAt(nextX, this.position.y + 1, this.position.z)) {
      this.position.x = nextX
    } else {
      // Auto-step up 1 block if obstacle is only 1 block high
      if (!this.world.isSolidAt(nextX, this.position.y + 1.2, this.position.z) && this.isGrounded) {
        this.position.y += 0.4
        this.position.x = nextX
      }
    }

    if (!this.world.isSolidAt(this.position.x, this.position.y, nextZ) &&
        !this.world.isSolidAt(this.position.x, this.position.y + 1, nextZ)) {
      this.position.z = nextZ
    } else {
      if (!this.world.isSolidAt(this.position.x, this.position.y + 1.2, nextZ) && this.isGrounded) {
        this.position.y += 0.4
        this.position.z = nextZ
      }
    }

    // Vertical movement
    if (this.velocity.y < 0) {
      // Falling
      if (this.world.isSolidAt(this.position.x, nextY, this.position.z)) {
        if (this.velocity.y < -16) {
          survivalCombat.takeDamage(Math.floor((Math.abs(this.velocity.y) - 16) * 3))
        }
        this.position.y = Math.floor(nextY) + 1.0
        this.velocity.y = 0
        this.isGrounded = true
      } else {
        this.position.y = nextY
        this.isGrounded = false
      }
    } else if (this.velocity.y > 0) {
      // Rising / Jumping
      if (this.world.isSolidAt(this.position.x, nextY + 1.8, this.position.z)) {
        this.velocity.y = 0
      } else {
        this.position.y = nextY
        this.isGrounded = false
      }
    }
  }
}
