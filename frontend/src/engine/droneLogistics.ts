import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface PatrolWaypoint {
  id: string
  x: number
  y: number
  z: number
  name: string
}

export interface AirdropCrate {
  id: string
  position: THREE.Vector3
  targetY: number
  fallSpeed: number
  isLanded: boolean
  loot: string[]
  mesh?: THREE.Group
}

export class DroneLogisticsEngine {
  public waypoints: PatrolWaypoint[] = []
  public activeWaypointIndex: number = 0
  public isPatrolling: boolean = false
  public patrolSpeed: number = 6.0
  public activeCrates: AirdropCrate[] = []

  private scene: THREE.Scene | null = null

  public init(scene: THREE.Scene): void {
    this.scene = scene
  }

  /**
   * Adds a new 3D waypoint for drone autonomous navigation
   */
  public addWaypoint(pos: { x: number; y: number; z: number }, name?: string): PatrolWaypoint {
    const wp: PatrolWaypoint = {
      id: `wp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      x: Math.round(pos.x),
      y: Math.max(10, Math.round(pos.y)),
      z: Math.round(pos.z),
      name: name || `航點 #${this.waypoints.length + 1}`,
    }
    this.waypoints.push(wp)
    sound.playUiClick()
    return wp
  }

  public removeWaypoint(id: string): boolean {
    const idx = this.waypoints.findIndex(w => w.id === id)
    if (idx !== -1) {
      this.waypoints.splice(idx, 1)
      if (this.activeWaypointIndex >= this.waypoints.length) {
        this.activeWaypointIndex = 0
      }
      return true
    }
    return false
  }

  public clearWaypoints(): void {
    this.waypoints = []
    this.activeWaypointIndex = 0
    this.isPatrolling = false
  }

  public startPatrol(): boolean {
    if (this.waypoints.length === 0) return false
    this.isPatrolling = true
    sound.playFanfare()
    return true
  }

  public stopPatrol(): void {
    this.isPatrolling = false
  }

  public getActiveWaypoint(): PatrolWaypoint | null {
    if (this.waypoints.length === 0) return null
    return this.waypoints[this.activeWaypointIndex] || null
  }

  /**
   * Dispatches tactical aerial airdrop crate over specified target coordinates
   */
  public spawnAirdrop(dropPos: THREE.Vector3, targetY: number = 10): AirdropCrate {
    const id = `crate_${Date.now()}`
    const startY = Math.max(dropPos.y + 30, targetY + 30)

    const cratePos = new THREE.Vector3(dropPos.x, startY, dropPos.z)
    const loot = ['quantum_core', 'plasma_containment', 'amethyst', 'matrix_grid', 'neon_blue']

    const crateObj: AirdropCrate = {
      id,
      position: cratePos,
      targetY,
      fallSpeed: 4.5,
      isLanded: false,
      loot,
    }

    if (this.scene) {
      const mesh = this.createAirdropMesh()
      mesh.position.copy(cratePos)
      this.scene.add(mesh)
      crateObj.mesh = mesh
    }

    this.activeCrates.push(crateObj)
    sound.playTeleport()

    achievements.unlock('airdrop_commander')

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('airdrop-dispatched', {
          detail: {
            id,
            target: { x: dropPos.x, y: targetY, z: dropPos.z },
          },
        })
      )
    }

    return crateObj
  }

  private createAirdropMesh(): THREE.Group {
    const group = new THREE.Group()

    // Crate Body
    const crateGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4)
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
    })
    const crate = new THREE.Mesh(crateGeo, crateMat)
    group.add(crate)

    // Glowing Neon Cross / Cargo Mark
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const hBandGeo = new THREE.BoxGeometry(1.42, 0.2, 1.42)
    const hBand = new THREE.Mesh(hBandGeo, lineMat)
    group.add(hBand)

    // Parachute Lines
    const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5)
    const cord1 = new THREE.Mesh(lineGeo, lineMat)
    cord1.position.set(0.6, 1.4, 0.6)
    cord1.rotation.z = -0.2
    group.add(cord1)

    const cord2 = new THREE.Mesh(lineGeo, lineMat)
    cord2.position.set(-0.6, 1.4, -0.6)
    cord2.rotation.z = 0.2
    group.add(cord2)

    // Parachute Canopy Dome
    const canopyGeo = new THREE.SphereGeometry(2.0, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      roughness: 0.5,
      metalness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const canopy = new THREE.Mesh(canopyGeo, canopyMat)
    canopy.position.set(0, 2.5, 0)
    group.add(canopy)

    return group
  }

  /**
   * Main per-frame physics & waypoint update
   */
  public update(delta: number, world?: any, droneMesh?: THREE.Group): void {
    // 1. Update Airdrop Crates
    for (let i = this.activeCrates.length - 1; i >= 0; i--) {
      const crate = this.activeCrates[i]
      if (!crate.isLanded) {
        crate.position.y -= crate.fallSpeed * delta

        if (crate.mesh) {
          crate.mesh.position.copy(crate.position)
          // Gentle sway during descent
          crate.mesh.rotation.z = Math.sin(performance.now() * 0.003) * 0.08
          crate.mesh.rotation.x = Math.cos(performance.now() * 0.002) * 0.06
        }

        // Check ground touchdown
        if (crate.position.y <= crate.targetY) {
          crate.position.y = crate.targetY
          crate.isLanded = true

          // Unpack voxels into world
          if (world && typeof world.setBlock === 'function') {
            const bx = Math.round(crate.position.x)
            const by = Math.round(crate.targetY)
            const bz = Math.round(crate.position.z)

            world.setBlock(bx, by, bz, 'quantum_core')
            world.setBlock(bx + 1, by, bz, 'amethyst')
            world.setBlock(bx - 1, by, bz, 'plasma_containment')
            world.setBlock(bx, by, bz + 1, 'matrix_grid')
          }

          sound.playExplosion()

          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('airdrop-landed', {
                detail: {
                  id: crate.id,
                  position: crate.position.clone(),
                  loot: crate.loot,
                },
              })
            )
          }

          // Remove parachute canopy from mesh
          if (crate.mesh) {
            // Fade out mesh after 10s
            setTimeout(() => {
              if (this.scene && crate.mesh) {
                this.scene.remove(crate.mesh)
              }
            }, 10000)
          }
        }
      }
    }

    // 2. Update Drone Waypoint Navigation if patrolling
    if (this.isPatrolling && droneMesh && this.waypoints.length > 0) {
      const targetWp = this.waypoints[this.activeWaypointIndex]
      if (targetWp) {
        const targetPos = new THREE.Vector3(targetWp.x, targetWp.y, targetWp.z)
        const dir = targetPos.clone().sub(droneMesh.position)
        const dist = dir.length()

        if (dist <= 1.5) {
          // Reached waypoint, advance to next
          this.activeWaypointIndex = (this.activeWaypointIndex + 1) % this.waypoints.length
          sound.playUiClick()
        } else {
          dir.normalize()
          droneMesh.position.addScaledVector(dir, this.patrolSpeed * delta)
          droneMesh.lookAt(targetPos)
        }
      }
    }
  }
}

export const droneLogistics = new DroneLogisticsEngine()
