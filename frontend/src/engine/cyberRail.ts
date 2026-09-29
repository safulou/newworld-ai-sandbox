import * as THREE from 'three'
import { sound } from './audio'
import { achievements } from './achievements'

export interface RailStation {
  id: string
  name: string
  position: THREE.Vector3
  dimension: string
}

export interface RailWaypoint {
  x: number
  y: number
  z: number
  speedLimit?: number
}

export interface RailRoute {
  id: string
  name: string
  color: string
  stations: RailStation[]
  waypoints: RailWaypoint[]
}

export interface TrainPodState {
  id: string
  routeId: string
  waypointIndex: number
  progress: number // 0 to 1 along current segment
  speedKmh: number // 0 to 120
  targetSpeedKmh: number
  isBoarded: boolean
  isAutoCruise: boolean
  position: THREE.Vector3
  rotationY: number
}

export const PRESET_ROUTES: RailRoute[] = [
  {
    id: 'metro_loop',
    name: '霓虹都會中央環狀線 (Metropolis Metro)',
    color: '#00ffff',
    stations: [
      { id: 'st_central', name: '中央廣場總站 (Central Hub)', position: new THREE.Vector3(0, 5, 0), dimension: 'overworld' },
      { id: 'st_tech', name: '高能科技園區 (Tech Sector)', position: new THREE.Vector3(50, 7, 30), dimension: 'overworld' },
      { id: 'st_port', name: '星際太空空港 (Spaceport)', position: new THREE.Vector3(10, 10, 70), dimension: 'overworld' },
      { id: 'st_bay', name: '水冷港灣站 (Cooling Bay)', position: new THREE.Vector3(-40, 6, 20), dimension: 'overworld' },
    ],
    waypoints: [
      { x: 0, y: 5, z: 0, speedLimit: 40 },
      { x: 25, y: 6, z: 15, speedLimit: 80 },
      { x: 50, y: 7, z: 30, speedLimit: 120 },
      { x: 30, y: 9, z: 50, speedLimit: 100 },
      { x: 10, y: 10, z: 70, speedLimit: 110 },
      { x: -15, y: 8, z: 45, speedLimit: 90 },
      { x: -40, y: 6, z: 20, speedLimit: 70 },
      { x: -20, y: 5, z: 10, speedLimit: 60 },
      { x: 0, y: 5, z: 0, speedLimit: 40 },
    ],
  },
  {
    id: 'void_express',
    name: '深空浮島超迴路快線 (Void Hyperloop)',
    color: '#a855f7',
    stations: [
      { id: 'st_void_core', name: '虛空傳送核心 (Void Core)', position: new THREE.Vector3(0, 42, 0), dimension: 'neon_void' },
      { id: 'st_amethyst', name: '紫晶浮島站 (Amethyst Isle)', position: new THREE.Vector3(14, 46, 10), dimension: 'neon_void' },
      { id: 'st_satellite', name: '星衛觀測哨 (Satellite Outpost)', position: new THREE.Vector3(-12, 43, 14), dimension: 'neon_void' },
    ],
    waypoints: [
      { x: 0, y: 42, z: 0, speedLimit: 50 },
      { x: 7, y: 44, z: 5, speedLimit: 100 },
      { x: 14, y: 46, z: 10, speedLimit: 120 },
      { x: 1, y: 45, z: 12, speedLimit: 90 },
      { x: -12, y: 43, z: 14, speedLimit: 110 },
      { x: -6, y: 42, z: 7, speedLimit: 80 },
      { x: 0, y: 42, z: 0, speedLimit: 50 },
    ],
  },
]

export class CyberRailEngine {
  public routes: RailRoute[] = [...PRESET_ROUTES]
  public currentRouteId: string = 'metro_loop'
  public pod: TrainPodState = {
    id: 'pod_alpha',
    routeId: 'metro_loop',
    waypointIndex: 0,
    progress: 0,
    speedKmh: 0,
    targetSpeedKmh: 60,
    isBoarded: false,
    isAutoCruise: true,
    position: new THREE.Vector3(0, 5, 0),
    rotationY: 0,
  }

  private podMesh: THREE.Group | null = null
  private scene: THREE.Scene | null = null
  private audioCtx: AudioContext | null = null

  public init(scene: THREE.Scene): void {
    this.scene = scene
    this.createPodMesh()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public playArrivalChime(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [587.33, 880] // D5, A5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.15)
      gain.gain.setValueAtTime(0.2, now + idx * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.45)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.15)
      osc.stop(now + idx * 0.15 + 0.5)
    })
  }

  public playWhooshSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.2)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.5)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.5)
  }

  public createPodMesh(): THREE.Group {
    if (this.podMesh && this.scene) {
      this.scene.remove(this.podMesh)
    }

    const group = new THREE.Group()

    // Streamlined Bullet Pod Chassis
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.8, 6.0)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 1.0
    group.add(body)

    // Aerodynamic Nose Cone
    const noseGeo = new THREE.ConeGeometry(1.2, 2.0, 16)
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    const nose = new THREE.Mesh(noseGeo, noseMat)
    nose.rotation.x = Math.PI / 2
    nose.position.set(0, 1.0, 3.8)
    group.add(nose)

    // Glass Canopy (Hologram cockpit)
    const glassGeo = new THREE.BoxGeometry(2.0, 0.8, 3.2)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6,
    })
    const glass = new THREE.Mesh(glassGeo, glassMat)
    glass.position.set(0, 1.7, 0.5)
    group.add(glass)

    // Maglev Skids with Underglow
    const skidGeo = new THREE.BoxGeometry(2.6, 0.2, 5.6)
    const skidMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1.5,
    })
    const skid = new THREE.Mesh(skidGeo, skidMat)
    skid.position.y = 0.1
    group.add(skid)

    if (this.scene) {
      this.scene.add(group)
    }
    this.podMesh = group
    return group
  }

  public get currentRoute(): RailRoute {
    return this.routes.find(r => r.id === this.currentRouteId) || this.routes[0]
  }

  public selectRoute(routeId: string): boolean {
    const route = this.routes.find(r => r.id === routeId)
    if (!route) return false
    this.currentRouteId = routeId
    this.pod.routeId = routeId
    this.pod.waypointIndex = 0
    this.pod.progress = 0
    this.pod.speedKmh = 0
    if (route.waypoints.length > 0) {
      const p = route.waypoints[0]
      this.pod.position.set(p.x, p.y, p.z)
    }
    sound.playUiClick()
    return true
  }

  public toggleBoarding(camera?: THREE.PerspectiveCamera): boolean {
    this.pod.isBoarded = !this.pod.isBoarded
    sound.playUiClick()
    if (this.pod.isBoarded) {
      this.playWhooshSound()
      if (camera) {
        camera.position.set(this.pod.position.x, this.pod.position.y + 1.6, this.pod.position.z)
      }
    }
    return this.pod.isBoarded
  }

  public setTargetSpeed(kmh: number): void {
    this.pod.targetSpeedKmh = Math.max(0, Math.min(120, kmh))
  }

  public toggleAutoCruise(): boolean {
    this.pod.isAutoCruise = !this.pod.isAutoCruise
    sound.playUiClick()
    return this.pod.isAutoCruise
  }

  /**
   * Main per-frame physics & waypoint movement
   */
  public update(delta: number, camera?: THREE.PerspectiveCamera): void {
    const route = this.currentRoute
    if (!route || route.waypoints.length < 2) return

    // 1. Acceleration / deceleration physics
    if (this.pod.isAutoCruise) {
      const currentWp = route.waypoints[this.pod.waypointIndex]
      const limit = currentWp?.speedLimit ?? 80
      this.pod.targetSpeedKmh = limit
    }

    if (this.pod.speedKmh < this.pod.targetSpeedKmh) {
      this.pod.speedKmh = Math.min(this.pod.targetSpeedKmh, this.pod.speedKmh + 30 * delta)
    } else if (this.pod.speedKmh > this.pod.targetSpeedKmh) {
      this.pod.speedKmh = Math.max(this.pod.targetSpeedKmh, this.pod.speedKmh - 45 * delta)
    }

    // Check achievement for 100+ km/h
    if (this.pod.speedKmh >= 100) {
      achievements.unlock('rail_master')
    }

    if (this.pod.speedKmh <= 0.5) return

    // 2. Waypoint progress calculation
    const currentWp = route.waypoints[this.pod.waypointIndex]
    const nextIdx = (this.pod.waypointIndex + 1) % route.waypoints.length
    const nextWp = route.waypoints[nextIdx]

    const pA = new THREE.Vector3(currentWp.x, currentWp.y, currentWp.z)
    const pB = new THREE.Vector3(nextWp.x, nextWp.y, nextWp.z)
    const segmentLength = pA.distanceTo(pB)

    if (segmentLength > 0.01) {
      // Speed in m/s = speedKmh / 3.6
      const speedMs = this.pod.speedKmh / 3.6
      const step = (speedMs * delta) / segmentLength
      this.pod.progress += step

      if (this.pod.progress >= 1.0) {
        this.pod.progress -= 1.0
        this.pod.waypointIndex = nextIdx

        // Check if next waypoint corresponds to a station
        const station = route.stations.find(st => st.position.distanceTo(pB) < 3.0)
        if (station) {
          this.playArrivalChime()
        }
      }

      // Linear interpolation between current and next waypoint
      this.pod.position.lerpVectors(pA, pB, this.pod.progress)

      // Calculate heading angle
      const dir = pB.clone().sub(pA).normalize()
      this.pod.rotationY = Math.atan2(dir.x, dir.z)
    }

    // 3. Update Pod 3D Mesh
    if (this.podMesh) {
      this.podMesh.position.copy(this.pod.position)
      this.podMesh.rotation.y = this.pod.rotationY
    }

    // 4. Update Camera if boarded
    if (this.pod.isBoarded && camera) {
      // Smoothly mount player camera inside cabin
      const eyePos = this.pod.position.clone().add(new THREE.Vector3(0, 1.8, 0))
      camera.position.lerp(eyePos, 0.4)
    }
  }

  public getPodPosition(): THREE.Vector3 {
    return this.pod.position.clone()
  }
}

export const cyberRail = new CyberRailEngine()
