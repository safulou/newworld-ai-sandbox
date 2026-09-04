<template>
  <canvas ref="canvas" class="game-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  createScene, createCamera, createRenderer, createAtmosphere, AtmosphereController,
  addBlockHighlight, createPostProcessing, makePremiumMaterial,
} from '@/engine/scene'
import { BLOCK_COLORS } from '@/engine/blocks'
import { WorldEngine } from '@/engine/world'
import { raycastMouse } from '@/engine/raycast'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { AIBuildResponse, BuildAction } from '@/types/world'
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
const pointerDownPos = { x: 0, y: 0 }

function init(): void {
  scene = createScene()
  camera = createCamera()
  renderer = createRenderer(canvas.value!)
  composer = createPostProcessing(renderer, scene, camera)
  atmosphere = createAtmosphere(scene)
  atmosphere.setTimeOfDay(ui.timeOfDay)
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
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)
  window.addEventListener('time-of-day', onTimeOfDayChange)
  window.addEventListener('undo-build', onUndoBuild)
  window.addEventListener('direct-build', onDirectBuild)

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
      // Show highlight at the adjacent placement voxel
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

function onMouseDown(e: MouseEvent): void {
  pointerDownPos.x = e.clientX
  pointerDownPos.y = e.clientY
}

function onMouseUp(e: MouseEvent): void {
  if (ui.mode !== 'game') return

  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
  if (dist > 5) {
    // Player was dragging camera orbit, ignore block placement/breaking
    return
  }

  const rc = raycastMouse(camera, mouse, world, scene)
  if (!rc.hit) return

  if (rc.npcName) {
    if (e.button === 0) {
      emit('npc-interact', rc.npcName)
    }
    return
  }

  if (e.button === 0) {
    // ── Left Click: Mine / Break pointed block ───────────────────────
    const breakPos = rc.point.clone().sub(rc.normal.clone().multiplyScalar(0.1))
    const bx = Math.floor(breakPos.x)
    const by = Math.floor(breakPos.y)
    const bz = Math.floor(breakPos.z)

    const blockType = world.getBlock(bx, by, bz)
    world.removeBlock(bx, by, bz)
    atmosphere.spawnBreakEffect(
      bx + 0.5,
      by + 0.5,
      bz + 0.5,
      BLOCK_COLORS[blockType] || 0x00ffff
    )
  } else if (e.button === 2) {
    // ── Right Click: Place currently active block ─────────────────────
    const placePos = rc.point.clone().add(rc.normal.clone().multiplyScalar(0.1))
    const bx = Math.floor(placePos.x)
    const by = Math.floor(placePos.y)
    const bz = Math.floor(placePos.z)

    const prevType = world.getBlock(bx, by, bz)
    world.setBlock(bx, by, bz, ui.selectedBlock)
    world.recordSinglePlacement(bx, by, bz, prevType, ui.selectedBlock)
  }
}

function onContextMenu(e: MouseEvent): void {
  if (ui.mode === 'game') {
    e.preventDefault()
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'F1') ui.openSettings()
  if (e.code === 'F2') saveWorld()
  
  if (ui.mode === 'game') {
    // P Key -> Blueprints Modal
    if (e.code === 'KeyP') {
      ui.openBlueprints()
    }
    // B Key -> AI Build Prompt
    if (e.code === 'KeyB') {
      window.dispatchEvent(new CustomEvent('open-build', {
        detail: { x: Math.floor(camera.position.x), y: 0, z: Math.floor(camera.position.z) }
      }))
      ui.openBuildPrompt()
    }
    // Ctrl+Z -> Spatial Undo
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
      e.preventDefault()
      undoBuild()
    }
    // Ctrl+Y or Ctrl+Shift+Z -> Redo
    if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
      e.preventDefault()
      redoBuild()
    }
  }

  if (e.code === 'Escape' && ui.mode !== 'game') {
    ui.closeOverlay()
  }
}

function onTimeOfDayChange(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail && atmosphere) {
    atmosphere.setTimeOfDay(custom.detail)
  }
}

watch(() => ui.timeOfDay, (newVal) => {
  if (atmosphere && newVal) {
    atmosphere.setTimeOfDay(newVal)
  }
})

function onUndoBuild(): void {
  undoBuild()
}

function onDirectBuild(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    applyBuild(custom.detail)
  }
}

function undoBuild(): void {
  const success = world.undoLastBuild()
  if (success) {
    ui.setBuildStatus('↩️ Reverted build operation')
    setTimeout(() => ui.setBuildStatus(''), 2200)
  } else {
    ui.setBuildStatus('ℹ️ No build history to undo')
    setTimeout(() => ui.setBuildStatus(''), 1500)
  }
}

function redoBuild(): void {
  const success = world.redoLastBuild()
  if (success) {
    ui.setBuildStatus('🔁 Redone build operation')
    setTimeout(() => ui.setBuildStatus(''), 2200)
  }
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

function applyBuild(result: AIBuildResponse | BuildAction[]): void {
  let actions: BuildAction[] = []
  let desc = 'Voxel Structure'

  if (Array.isArray(result)) {
    actions = result
  } else if (result && result.actions) {
    actions = result.actions
    desc = result.description || 'AI Architecture'
  }

  if (actions.length > 0) {
    world.applyBuildActions(actions, desc)
    sound.playBuildComplete()
    ui.setBuildStatus(`✨ Materialized ${actions.length} blocks!`)
    setTimeout(() => ui.setBuildStatus(''), 2500)
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

defineExpose({ applyBuild, undoBuild, redoBuild, exportWorld, importWorldJSON, clearWorld, saveWorld })

onMounted(() => { if (canvas.value) init() })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('time-of-day', onTimeOfDayChange)
  window.removeEventListener('undo-build', onUndoBuild)
  window.removeEventListener('direct-build', onDirectBuild)
  renderer?.dispose()
})
</script>

<style scoped>
.game-canvas { display: block; width: 100vw; height: 100vh; cursor: crosshair; }
</style>
