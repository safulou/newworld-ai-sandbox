<template>
  <canvas ref="canvas" class="game-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { createScene, createCamera, createRenderer, createLights, addBlockHighlight } from '@/engine/scene'
import { WorldEngine } from '@/engine/world'
import { Player } from '@/engine/player'
import { raycastBlock } from '@/engine/raycast'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { AIBuildResponse } from '@/types/world'

const emit = defineEmits<{
  (e: 'ready', world: WorldEngine): void
  (e: 'npc-interact', name: string): void
}>()

const canvas = ref<HTMLCanvasElement>()
const ui = useUIStore()
const settings = useSettingsStore()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: PointerLockControls
let world: WorldEngine
let player: Player
let highlight: THREE.Mesh
let animId: number
let clock: THREE.Clock

function init(): void {
  scene = createScene()
  camera = createCamera()
  renderer = createRenderer(canvas.value!)
  createLights(scene)
  highlight = addBlockHighlight(scene)

  world = new WorldEngine(scene)
  world.generateFlatWorld()
  player = new Player(camera)

  // place a guide NPC marker
  world.setBlock(4, 0, -4, 'glass')
  const npcMarker = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.8, 0.6),
    new THREE.MeshLambertMaterial({ color: 0xff9900 })
  )
  npcMarker.position.set(4, 0.9, -4)
  npcMarker.userData = { isNPC: true, name: 'World Guide' }
  scene.add(npcMarker)

  controls = new PointerLockControls(camera, renderer.domElement)
  controls.addEventListener('lock', () => ui.setLocked(true))
  controls.addEventListener('unlock', () => ui.setLocked(false))

  window.addEventListener('click', onCanvasClick)
  window.addEventListener('contextmenu', e => { e.preventDefault(); placeBlock() })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)

  clock = new THREE.Clock()
  emit('ready', world)
  loop()
}

function loop(): void {
  animId = requestAnimationFrame(loop)
  const delta = Math.min(clock.getDelta(), 0.1)

  if (controls.isLocked) player.update(delta, world)

  // update block highlight
  const rc = raycastBlock(camera, world)
  if (rc.hit) {
    highlight.visible = true
    highlight.position.set(rc.blockPos.x, rc.blockPos.y, rc.blockPos.z)
  } else {
    highlight.visible = false
  }

  renderer.render(scene, camera)
}

function onCanvasClick(): void {
  if (!controls.isLocked && ui.mode === 'game') {
    controls.lock()
    return
  }
  if (!controls.isLocked) return

  const rc = raycastBlock(camera, world)
  if (!rc.hit) return

  // check NPC
  const npcMeshes = scene.children.filter(c => c.userData?.isNPC)
  for (const npc of npcMeshes) {
    if (npc.position.distanceTo(camera.position) < 4) {
      controls.unlock()
      emit('npc-interact', npc.userData.name)
      return
    }
  }

  world.removeBlock(rc.blockPos.x, rc.blockPos.y, rc.blockPos.z)
}

function placeBlock(): void {
  if (!controls.isLocked) return
  const rc = raycastBlock(camera, world)
  if (!rc.hit) return
  const { normalPos } = rc
  world.setBlock(normalPos.x, normalPos.y, normalPos.z, settings.selectedBlock)
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'KeyT' && controls.isLocked) {
    controls.unlock()
    ui.openBuildPrompt()
  }
  if (e.code === 'F1') {
    if (controls.isLocked) controls.unlock()
    ui.openSettings()
  }
  if (e.code === 'F2') {
    saveWorld()
  }
  if (e.code === 'Escape' && ui.mode !== 'game') {
    ui.closeOverlay()
  }
  if (e.code === 'KeyE' && controls.isLocked) {
    // check nearby NPC
    const npcMeshes = scene.children.filter(c => c.userData?.isNPC)
    for (const npc of npcMeshes) {
      if (npc.position.distanceTo(camera.position) < 4) {
        controls.unlock()
        emit('npc-interact', npc.userData.name)
        return
      }
    }
  }
}

function saveWorld(): void {
  const data = world.toWorldData(settings.worldName)
  localStorage.setItem('nw_world', JSON.stringify(data))
  ui.setBuildStatus('World saved!')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function onResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// called by parent after AI build
function applyBuild(result: AIBuildResponse): void {
  for (const action of result.actions) {
    if (action.type === 'place_block') {
      world.setBlock(action.position[0], action.position[1], action.position[2], action.material)
    }
  }
  if (controls.isLocked === false) controls.lock()
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
    ui.setBuildStatus('World imported!')
    setTimeout(() => ui.setBuildStatus(''), 2000)
  } catch {
    alert('Invalid world JSON file.')
  }
}

function clearWorld(): void {
  world.clear()
  world.generateFlatWorld()
}

defineExpose({ applyBuild, exportWorld, importWorldJSON, clearWorld, saveWorld })

onMounted(() => { if (canvas.value) init() })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('click', onCanvasClick)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<style scoped>
.game-canvas { display: block; width: 100vw; height: 100vh; }
</style>
