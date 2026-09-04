<template>
  <canvas ref="canvas" class="game-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  createScene, createCamera, createRenderer, createAtmosphere, AtmosphereController,
  addBlockHighlight, createPostProcessing, makePremiumMaterial,
} from '@/engine/scene'
import { WorldEngine } from '@/engine/world'
import { raycastMouse } from '@/engine/raycast'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { AIBuildResponse } from '@/types/world'
import { sound } from '@/engine/audio'

const emit = defineEmits<{
  (e: 'ready', world: WorldEngine): void
  (e: 'npc-interact', name: string): void
}>()

const canvas = ref<HTMLCanvasElement>()
const ui = useUIStore()
const settings = useSettingsStore()

let renderer: THREE.WebGLRenderer
let composer: EffectComposer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let world: WorldEngine
let highlight: THREE.Mesh
let atmosphere: AtmosphereController
let animId: number
let clock: THREE.Clock

const mouse = new THREE.Vector2(-100, -100)

function init(): void {
  scene = createScene()
  camera = createCamera()
  renderer = createRenderer(canvas.value!)
  composer = createPostProcessing(renderer, scene, camera)
  atmosphere = createAtmosphere(scene)
  highlight = addBlockHighlight(scene)

  world = new WorldEngine(scene)

  camera.position.set(0, 20, 24)
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.maxPolarAngle = Math.PI / 2 - 0.05
  controls.update()

  clock = new THREE.Clock()

  // Holographic AI Guide / NPC
  const npcGroup = new THREE.Group()
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
  npcGroup.add(body, head)
  npcGroup.position.set(0, 0, 4)
  npcGroup.userData = { isNPC: true, name: 'Cyber Architect' }
  scene.add(npcGroup)

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onCanvasClick)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)

  emit('ready', world)
  loop()
}

function loop(): void {
  animId = requestAnimationFrame(loop)
  const delta = Math.min(clock.getDelta(), 0.1)
  
  controls.update()
  atmosphere.update(delta)
  world.animateBlocks(delta)
  world.updateChunks(camera.position.x, camera.position.z)
  
  // Throttle player broadcast & HUD position update
  if (Math.random() < 0.1) {
    world.emitPlayerMove(camera.position.x, camera.position.y, camera.position.z)
    window.dispatchEvent(new CustomEvent('player-position', {
      detail: { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    }))
  }

  // Update hover highlight
  if (ui.mode === 'game') {
    const rc = raycastMouse(camera, mouse, world, scene)
    highlight.visible = rc.hit && !rc.npcName
    if (rc.hit && !rc.npcName) {
      const p = rc.point.clone().add(rc.normal.clone().multiplyScalar(0.1))
      highlight.position.set(Math.floor(p.x) + 0.5, Math.floor(p.y) + 0.5, Math.floor(p.z) + 0.5)
    }
  } else {
    highlight.visible = false
  }

  composer.render()
}

function onMouseMove(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}

function onCanvasClick(e: MouseEvent): void {
  if (ui.mode !== 'game') return
  if (e.button !== 0) return // left click only

  const rc = raycastMouse(camera, mouse, world, scene)
  if (!rc.hit) return

  if (rc.npcName) {
    emit('npc-interact', rc.npcName)
    return
  }

  // Click on block -> open build command center anchor
  const p = rc.point.clone().add(rc.normal.clone().multiplyScalar(0.1))
  const bx = Math.floor(p.x)
  const by = Math.floor(p.y)
  const bz = Math.floor(p.z)
  
  window.dispatchEvent(new CustomEvent('open-build', { detail: { x: bx, y: by, z: bz } }))
  ui.openBuildPrompt()
}

function onContextMenu(e: MouseEvent): void {
  // Prevent browser context menu on right click
  if (ui.mode === 'game') {
    e.preventDefault()
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'F1') ui.openSettings()
  if (e.code === 'F2') saveWorld()
  if (e.code === 'KeyB' && ui.mode === 'game') {
    window.dispatchEvent(new CustomEvent('open-build', {
      detail: { x: Math.floor(camera.position.x), y: 0, z: Math.floor(camera.position.z) }
    }))
    ui.openBuildPrompt()
  }
  if (e.code === 'Escape' && ui.mode !== 'game') ui.closeOverlay()
}

function saveWorld(): void {
  localStorage.setItem('nw_world', JSON.stringify(world.toWorldData(settings.worldName)))
  sound.playBuildComplete()
  ui.setBuildStatus('💾 World saved to local storage!')
  setTimeout(() => ui.setBuildStatus(''), 2500)
}

function onResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function applyBuild(result: AIBuildResponse): void {
  for (const action of result.actions) {
    if (action.type === 'place_block') {
      world.setBlock(action.position[0], action.position[1], action.position[2], action.material)
    }
  }
}

function exportWorld(): void {
  const data = world.toWorldData(settings.worldName)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${settings.worldName.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importWorldJSON(jsonStr: string): void {
  try {
    const data = JSON.parse(jsonStr)
    world.loadWorldData(data)
    settings.setWorldName(data.name ?? 'Imported World')
    sound.playBuildComplete()
    ui.setBuildStatus('✨ World imported successfully!')
    setTimeout(() => ui.setBuildStatus(''), 2500)
  } catch {
    alert('Invalid world JSON file.')
  }
}

function clearWorld(): void {
  world.clear()
}

defineExpose({ applyBuild, exportWorld, importWorldJSON, clearWorld, saveWorld })

onMounted(() => { if (canvas.value) init() })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onCanvasClick)
  window.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<style scoped>
.game-canvas { display: block; width: 100vw; height: 100vh; cursor: crosshair; }
</style>
