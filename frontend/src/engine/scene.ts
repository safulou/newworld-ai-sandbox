import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x070814) // deep cyber cosmic space
  scene.fog = new THREE.FogExp2(0x070814, 0.012)
  return scene
}

export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  return camera
}

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  return renderer
}

export function createPostProcessing(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): EffectComposer {
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.1, 0.4, 0.85)
  bloomPass.threshold = 0.45
  bloomPass.strength = 1.4
  bloomPass.radius = 0.75
  composer.addPass(bloomPass)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  return composer
}

export interface AtmosphereController {
  sun: THREE.DirectionalLight
  rim: THREE.DirectionalLight
  stars: THREE.Points
  update: (delta: number) => void
}

export function createAtmosphere(scene: THREE.Scene): AtmosphereController {
  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)

  const hemi = new THREE.HemisphereLight(0x3844aa, 0x051122, 0.6)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight(0xffeedd, 2.5)
  sun.position.set(30, 50, 30)
  sun.castShadow = true
  sun.shadow.mapSize.width = 2048
  sun.shadow.mapSize.height = 2048
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 150
  sun.shadow.camera.left = -40
  sun.shadow.camera.right = 40
  sun.shadow.camera.top = 40
  sun.shadow.camera.bottom = -40
  sun.shadow.bias = -0.0005
  scene.add(sun)

  const rim = new THREE.DirectionalLight(0x00f0ff, 1.8)
  rim.position.set(-30, 20, -30)
  scene.add(rim)

  // Starfield particle system
  const starGeo = new THREE.BufferGeometry()
  const starCount = 800
  const starPositions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 300
    starPositions[i + 1] = Math.random() * 80 + 10 // in sky
    starPositions[i + 2] = (Math.random() - 0.5) * 300
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.8,
    transparent: true,
    opacity: 0.8,
  })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  let time = 0
  const update = (delta: number) => {
    time += delta * 0.05
    // Slow star drift
    stars.rotation.y += delta * 0.008

    // Gentle sun orbit
    const sunAngle = time * 0.2
    sun.position.x = Math.cos(sunAngle) * 45
    sun.position.z = Math.sin(sunAngle) * 45
    sun.position.y = Math.max(10, Math.sin(sunAngle * 0.5) * 40 + 30)
  }

  return { sun, rim, stars, update }
}

export function createLights(scene: THREE.Scene): void {
  createAtmosphere(scene)
}

export function addBlockHighlight(scene: THREE.Scene): THREE.Mesh {
  const geo = new THREE.BoxGeometry(1.05, 1.05, 1.05)
  const edges = new THREE.EdgesGeometry(geo)
  const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, transparent: true, opacity: 0.8 })
  
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 })
  
  const mesh = new THREE.Mesh(geo, fillMat)
  const line = new THREE.LineSegments(edges, mat)
  mesh.add(line)
  
  mesh.visible = false
  scene.add(mesh)
  return mesh
}

export function makePremiumMaterial(colorHex: number, type: 'standard' | 'glass' | 'emissive' = 'standard'): THREE.Material {
  if (type === 'glass') {
    return new THREE.MeshPhysicalMaterial({
      color: colorHex,
      transmission: 0.9,
      opacity: 1,
      metalness: 0.1,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
    })
  } else if (type === 'emissive') {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 2.0,
      metalness: 0.2,
      roughness: 0.4
    })
  }
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.1,
    roughness: 0.8
  })
}
