import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { TimeOfDay } from '@/stores/ui'

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x060714) // deep cyber cosmic space
  scene.fog = new THREE.FogExp2(0x060714, 0.012)
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
  renderer.toneMappingExposure = 1.15
  return renderer
}

export function createPostProcessing(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): EffectComposer {
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // Fine-tuned bloom pass for stunning cyberpunk neon glow
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.35, // strength
    0.75, // radius
    0.38  // threshold
  )
  composer.addPass(bloomPass)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  return composer
}

export interface AtmosphereTheme {
  skyColor: number
  fogColor: number
  fogDensity: number
  sunColor: number
  sunIntensity: number
  sunPosition: THREE.Vector3
  rimColor: number
  rimIntensity: number
  ambientColor: number
  ambientIntensity: number
  hemiSky: number
  hemiGround: number
  hemiIntensity: number
  starOpacity: number
  rainOpacity: number
}

export const ATMOSPHERE_THEMES: Record<TimeOfDay, AtmosphereTheme> = {
  night: {
    skyColor: 0x050612,
    fogColor: 0x050612,
    fogDensity: 0.012,
    sunColor: 0x4466ff,
    sunIntensity: 1.2,
    sunPosition: new THREE.Vector3(20, 35, 20),
    rimColor: 0x00ffff,
    rimIntensity: 2.2,
    ambientColor: 0x112244,
    ambientIntensity: 0.35,
    hemiSky: 0x223366,
    hemiGround: 0x050a18,
    hemiIntensity: 0.5,
    starOpacity: 0.95,
    rainOpacity: 0.75,
  },
  dawn: {
    skyColor: 0x1e1028,
    fogColor: 0x1e1028,
    fogDensity: 0.010,
    sunColor: 0xff9955,
    sunIntensity: 2.4,
    sunPosition: new THREE.Vector3(45, 25, 15),
    rimColor: 0x00ffcc,
    rimIntensity: 1.6,
    ambientColor: 0xdd8866,
    ambientIntensity: 0.45,
    hemiSky: 0xff6688,
    hemiGround: 0x151025,
    hemiIntensity: 0.6,
    starOpacity: 0.35,
    rainOpacity: 0.2,
  },
  day: {
    skyColor: 0x0a1c36,
    fogColor: 0x0a1c36,
    fogDensity: 0.008,
    sunColor: 0xffffff,
    sunIntensity: 2.8,
    sunPosition: new THREE.Vector3(30, 65, 30),
    rimColor: 0x33ccff,
    rimIntensity: 1.4,
    ambientColor: 0xddeeff,
    ambientIntensity: 0.55,
    hemiSky: 0x5599ff,
    hemiGround: 0x112233,
    hemiIntensity: 0.7,
    starOpacity: 0.05,
    rainOpacity: 0.0,
  },
  sunset: {
    skyColor: 0x250630,
    fogColor: 0x250630,
    fogDensity: 0.011,
    sunColor: 0xff2a70,
    sunIntensity: 2.6,
    sunPosition: new THREE.Vector3(-45, 20, 25),
    rimColor: 0x00f5ff,
    rimIntensity: 2.4,
    ambientColor: 0xff5588,
    ambientIntensity: 0.42,
    hemiSky: 0x991166,
    hemiGround: 0x0a0418,
    hemiIntensity: 0.6,
    starOpacity: 0.75,
    rainOpacity: 0.65,
  }
}

export interface AtmosphereController {
  sun: THREE.DirectionalLight
  rim: THREE.DirectionalLight
  ambient: THREE.AmbientLight
  hemi: THREE.HemisphereLight
  stars: THREE.Points
  rain: THREE.Points
  setTimeOfDay: (t: TimeOfDay) => void
  spawnBreakEffect: (x: number, y: number, z: number, colorHex?: number) => void
  update: (delta: number) => void
}

interface ShootingStar {
  startPos: THREE.Vector3
  currentPos: THREE.Vector3
  dir: THREE.Vector3
  speed: number
  life: number
  maxLife: number
  active: boolean
}

export function createAtmosphere(scene: THREE.Scene): AtmosphereController {
  const currentTheme: TimeOfDay = 'night'
  let targetTheme: AtmosphereTheme = ATMOSPHERE_THEMES[currentTheme]

  // Lights
  const ambient = new THREE.AmbientLight(targetTheme.ambientColor, targetTheme.ambientIntensity)
  scene.add(ambient)

  const hemi = new THREE.HemisphereLight(targetTheme.hemiSky, targetTheme.hemiGround, targetTheme.hemiIntensity)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight(targetTheme.sunColor, targetTheme.sunIntensity)
  sun.position.copy(targetTheme.sunPosition)
  sun.castShadow = true
  sun.shadow.mapSize.width = 2048
  sun.shadow.mapSize.height = 2048
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 150
  sun.shadow.camera.left = -45
  sun.shadow.camera.right = 45
  sun.shadow.camera.top = 45
  sun.shadow.camera.bottom = -45
  sun.shadow.bias = -0.0005
  scene.add(sun)

  const rim = new THREE.DirectionalLight(targetTheme.rimColor, targetTheme.rimIntensity)
  rim.position.set(-35, 25, -35)
  scene.add(rim)

  // Cosmic Starfield Particle System
  const starCount = 1000
  const starGeo = new THREE.BufferGeometry()
  const starPositions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 350
    starPositions[i + 1] = Math.random() * 90 + 12
    starPositions[i + 2] = (Math.random() - 0.5) * 350
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.9,
    transparent: true,
    opacity: targetTheme.starOpacity,
  })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // Cyber Neon Rain Particle System
  const rainCount = 1800
  const rainGeo = new THREE.BufferGeometry()
  const rainPositions = new Float32Array(rainCount * 3)
  const rainVelocities = new Float32Array(rainCount)

  for (let i = 0; i < rainCount; i++) {
    const idx = i * 3
    rainPositions[idx] = (Math.random() - 0.5) * 120
    rainPositions[idx + 1] = Math.random() * 50
    rainPositions[idx + 2] = (Math.random() - 0.5) * 120
    rainVelocities[i] = 25 + Math.random() * 20
  }

  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3))
  const rainMat = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.45,
    transparent: true,
    opacity: targetTheme.rainOpacity,
    blending: THREE.AdditiveBlending,
  })
  const rain = new THREE.Points(rainGeo, rainMat)
  scene.add(rain)

  // Shooting Stars System
  const shootingStarsCount = 4
  const shootingStars: ShootingStar[] = []
  const shootingStarGeo = new THREE.BufferGeometry()
  const shootingStarPositions = new Float32Array(shootingStarsCount * 2 * 3)
  shootingStarGeo.setAttribute('position', new THREE.BufferAttribute(shootingStarPositions, 3))

  const shootingStarMat = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  })
  const shootingStarLines = new THREE.LineSegments(shootingStarGeo, shootingStarMat)
  scene.add(shootingStarLines)

  for (let i = 0; i < shootingStarsCount; i++) {
    shootingStars.push({
      startPos: new THREE.Vector3(),
      currentPos: new THREE.Vector3(),
      dir: new THREE.Vector3(-1, -0.4, -0.5).normalize(),
      speed: 120,
      life: 0,
      maxLife: 0,
      active: false,
    })
  }

  function triggerShootingStar(star: ShootingStar) {
    const angle = Math.random() * Math.PI * 2
    const radius = 80 + Math.random() * 60
    star.startPos.set(
      Math.cos(angle) * radius,
      50 + Math.random() * 30,
      Math.sin(angle) * radius
    )
    star.currentPos.copy(star.startPos)
    star.dir.set(
      -(Math.random() * 0.8 + 0.4),
      -(Math.random() * 0.4 + 0.2),
      -(Math.random() * 0.8 + 0.4)
    ).normalize()
    star.speed = 100 + Math.random() * 60
    star.life = 0
    star.maxLife = 0.8 + Math.random() * 0.6
    star.active = true
  }

  // Debris / Voxel Break Particles Group
  const debrisGroup = new THREE.Group()
  scene.add(debrisGroup)

  interface DebrisParticle {
    mesh: THREE.Mesh
    vel: THREE.Vector3
    rotVel: THREE.Vector3
    life: number
    maxLife: number
  }
  const activeDebris: DebrisParticle[] = []
  const debrisGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2)

  function spawnBreakEffect(x: number, y: number, z: number, colorHex: number = 0x00ffff) {
    const count = 10
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
    })

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(debrisGeo, mat)
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.6,
        y + (Math.random() - 0.5) * 0.6,
        z + (Math.random() - 0.5) * 0.6
      )
      debrisGroup.add(mesh)

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 4 + 2,
        (Math.random() - 0.5) * 6
      )
      const rotVel = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )

      activeDebris.push({
        mesh,
        vel,
        rotVel,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.2,
      })
    }
  }

  let meteorTimer = 0
  let time = 0

  const setTimeOfDay = (t: TimeOfDay) => {
    targetTheme = ATMOSPHERE_THEMES[t] || ATMOSPHERE_THEMES.night
  }

  const update = (delta: number) => {
    time += delta * 0.05

    // Smooth transition to target atmosphere
    const lerpSpeed = Math.min(1, delta * 3.0)

    // Sky & Fog color
    const targetBg = new THREE.Color(targetTheme.skyColor)
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetBg, lerpSpeed)
    }
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.lerp(targetBg, lerpSpeed)
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetTheme.fogDensity, lerpSpeed)
    }

    // Lights
    const targetSunColor = new THREE.Color(targetTheme.sunColor)
    sun.color.lerp(targetSunColor, lerpSpeed)
    sun.intensity = THREE.MathUtils.lerp(sun.intensity, targetTheme.sunIntensity, lerpSpeed)
    sun.position.lerp(targetTheme.sunPosition, lerpSpeed)

    const targetRimColor = new THREE.Color(targetTheme.rimColor)
    rim.color.lerp(targetRimColor, lerpSpeed)
    rim.intensity = THREE.MathUtils.lerp(rim.intensity, targetTheme.rimIntensity, lerpSpeed)

    const targetAmbColor = new THREE.Color(targetTheme.ambientColor)
    ambient.color.lerp(targetAmbColor, lerpSpeed)
    ambient.intensity = THREE.MathUtils.lerp(ambient.intensity, targetTheme.ambientIntensity, lerpSpeed)

    const targetHemiSky = new THREE.Color(targetTheme.hemiSky)
    const targetHemiGnd = new THREE.Color(targetTheme.hemiGround)
    hemi.color.lerp(targetHemiSky, lerpSpeed)
    hemi.groundColor.lerp(targetHemiGnd, lerpSpeed)
    hemi.intensity = THREE.MathUtils.lerp(hemi.intensity, targetTheme.hemiIntensity, lerpSpeed)

    // Starfield
    starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, targetTheme.starOpacity, lerpSpeed)
    stars.rotation.y += delta * 0.005

    // Neon Rain
    rainMat.opacity = THREE.MathUtils.lerp(rainMat.opacity, targetTheme.rainOpacity, lerpSpeed)
    if (rainMat.opacity > 0.01) {
      rain.visible = true
      const posAttr = rainGeo.attributes.position as THREE.BufferAttribute
      const positions = posAttr.array as Float32Array

      for (let i = 0; i < rainCount; i++) {
        const idx = i * 3
        positions[idx + 1] -= rainVelocities[i] * delta
        positions[idx] += delta * 1.5 // subtle wind drift
        positions[idx + 2] += delta * 0.8

        if (positions[idx + 1] < 0) {
          positions[idx] = (Math.random() - 0.5) * 120
          positions[idx + 1] = 48 + Math.random() * 4
          positions[idx + 2] = (Math.random() - 0.5) * 120
        }
      }
      posAttr.needsUpdate = true
    } else {
      rain.visible = false
    }

    // Shooting Stars
    meteorTimer += delta
    if (meteorTimer > 2.0 && targetTheme.starOpacity > 0.4) {
      meteorTimer = 0
      const inactive = shootingStars.find(s => !s.active)
      if (inactive) {
        triggerShootingStar(inactive)
      }
    }

    const starPosAttr = shootingStarGeo.attributes.position as THREE.BufferAttribute
    const sPositions = starPosAttr.array as Float32Array

    for (let i = 0; i < shootingStarsCount; i++) {
      const star = shootingStars[i]
      const baseIdx = i * 6
      if (star.active) {
        star.life += delta
        star.currentPos.addScaledVector(star.dir, star.speed * delta)

        const tailLen = Math.min(18, star.speed * 0.1)
        const tailPos = star.currentPos.clone().addScaledVector(star.dir, -tailLen)

        sPositions[baseIdx] = star.currentPos.x
        sPositions[baseIdx + 1] = star.currentPos.y
        sPositions[baseIdx + 2] = star.currentPos.z

        sPositions[baseIdx + 3] = tailPos.x
        sPositions[baseIdx + 4] = tailPos.y
        sPositions[baseIdx + 5] = tailPos.z

        if (star.life >= star.maxLife) {
          star.active = false
          sPositions[baseIdx] = 0
          sPositions[baseIdx + 1] = -100
          sPositions[baseIdx + 2] = 0
          sPositions[baseIdx + 3] = 0
          sPositions[baseIdx + 4] = -100
          sPositions[baseIdx + 5] = 0
        }
      } else {
        sPositions[baseIdx] = 0
        sPositions[baseIdx + 1] = -100
        sPositions[baseIdx + 2] = 0
        sPositions[baseIdx + 3] = 0
        sPositions[baseIdx + 4] = -100
        sPositions[baseIdx + 5] = 0
      }
    }
    starPosAttr.needsUpdate = true

    // Debris Particles Update
    for (let i = activeDebris.length - 1; i >= 0; i--) {
      const p = activeDebris[i]
      p.life += delta
      if (p.life >= p.maxLife) {
        debrisGroup.remove(p.mesh)
        p.mesh.geometry.dispose()
        activeDebris.splice(i, 1)
        continue
      }

      p.vel.y -= 12 * delta // gravity
      p.mesh.position.addScaledVector(p.vel, delta)
      p.mesh.rotation.x += p.rotVel.x * delta
      p.mesh.rotation.y += p.rotVel.y * delta

      const progress = p.life / p.maxLife
      const scale = (1 - progress)
      p.mesh.scale.set(scale, scale, scale)
    }
  }

  return { sun, rim, ambient, hemi, stars, rain, setTimeOfDay, spawnBreakEffect, update }
}

export function createLights(scene: THREE.Scene): void {
  createAtmosphere(scene)
}

export function addBlockHighlight(scene: THREE.Scene): THREE.Mesh {
  const geo = new THREE.BoxGeometry(1.04, 1.04, 1.04)
  const edges = new THREE.EdgesGeometry(geo)
  const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, transparent: true, opacity: 0.85 })
  
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.18 })
  
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
      roughness: 0.08,
      ior: 1.5,
      thickness: 0.6,
      transparent: true,
    })
  } else if (type === 'emissive') {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 2.2,
      metalness: 0.2,
      roughness: 0.35
    })
  }
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.15,
    roughness: 0.75
  })
}
