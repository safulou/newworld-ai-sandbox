import * as THREE from 'three'

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  scene.fog = new THREE.Fog(0x87ceeb, 40, 80)
  return scene
}

export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200)
  return camera
}

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  return renderer
}

export function createLights(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight(0xfff5e0, 1.2)
  sun.position.set(20, 40, 20)
  sun.castShadow = true
  sun.shadow.mapSize.width = 2048
  sun.shadow.mapSize.height = 2048
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 200
  sun.shadow.camera.left = -50
  sun.shadow.camera.right = 50
  sun.shadow.camera.top = 50
  sun.shadow.camera.bottom = -50
  scene.add(sun)
}

export function addBlockHighlight(scene: THREE.Scene): THREE.Mesh {
  const geo = new THREE.BoxGeometry(1.01, 1.01, 1.01)
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.visible = false
  scene.add(mesh)
  return mesh
}
