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
  addBlockHighlight, createPostProcessing,
} from '@/engine/scene'
import { BLOCK_COLORS } from '@/engine/blocks'
import { WorldEngine } from '@/engine/world'
import { raycastMouse } from '@/engine/raycast'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { AIBuildResponse, BuildAction, BlockType } from '@/types/world'
import { sound } from '@/engine/audio'
import { tools } from '@/engine/tools'
import { physics } from '@/engine/physics'
import { achievements } from '@/engine/achievements'
import { npcManager } from '@/engine/npc'

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

  // Initialize Autonomous AI NPC Roster
  npcManager.init(scene, world, new THREE.Vector3(0, 0, 0))

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)
  window.addEventListener('time-of-day', onTimeOfDayChange)
  window.addEventListener('undo-build', onUndoBuild)
  window.addEventListener('direct-build', onDirectBuild)
  window.addEventListener('update-fov', onUpdateFOV)

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
  npcManager.update(delta, camera.position)
  
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

function onMouseDown(e: MouseEvent): void {
  pointerDownPos.x = e.clientX
  pointerDownPos.y = e.clientY
}

function onMouseUp(e: MouseEvent): void {
  if (ui.mode !== 'game') return

  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
  if (dist > 5) {
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

  const activeTool = tools.getActiveTool()

  if (activeTool === 'blaster') {
    // Plasma Blaster Tool
    const target = rc.point.clone()
    physics.triggerExplosion(target.x, target.y, target.z, 3.5, world)
    atmosphere.spawnBreakEffect(target.x, target.y, target.z, 0xff0055)
    achievements.unlock('tnt_blast')
    ui.setBuildStatus('💥 Plasma Blaster Detonation!')
    setTimeout(() => ui.setBuildStatus(''), 1500)
    return
  }

  if (activeTool === 'palette_brush') {
    // Palette Brush Tool: replace block material in place
    const targetPos = rc.point.clone().sub(rc.normal.clone().multiplyScalar(0.1))
    const bx = Math.floor(targetPos.x)
    const by = Math.floor(targetPos.y)
    const bz = Math.floor(targetPos.z)
    world.setBlock(bx, by, bz, ui.selectedBlock)
    sound.playBlockPlace(ui.selectedBlock)
    return
  }

  if (activeTool === 'ruler') {
    // Ruler Distance Measurement Tool
    const targetPos = rc.point.clone().sub(rc.normal.clone().multiplyScalar(0.1))
    const res = tools.setRulerPoint({
      x: Math.floor(targetPos.x),
      y: Math.floor(targetPos.y),
      z: Math.floor(targetPos.z),
    })
    if (res) {
      ui.setBuildStatus(`📐 Distance: ${res.distance.toFixed(2)}m (ΔX: ${res.dx}, ΔY: ${res.dy}, ΔZ: ${res.dz})`)
      setTimeout(() => ui.setBuildStatus(''), 3500)
    } else {
      ui.setBuildStatus('📐 Ruler Point 1 set! Click Point 2.')
      setTimeout(() => ui.setBuildStatus(''), 2000)
    }
    return
  }

  // Standard Pickaxe / Hand placement
  if (e.button === 0) {
    // Left Click: Mine / Break pointed block
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
    // Right Click: Place currently active block
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
  if (e.code === 'F3') ui.openKeybinds()
  if (e.code === 'F4') ui.openPhoto()
  if (e.code === 'F5') ui.openAchievements()
  if (e.code === 'F6') ui.openExport()
  if (e.code === 'F7') ui.openSynth()
  
  if (ui.mode === 'game') {
    if (e.code === 'KeyT') ui.openTools()
    if (e.code === 'KeyC') ui.openChain()
    if (e.code === 'KeyE') ui.openInventory()
    if (e.code === 'KeyP') ui.openBlueprints()
    if (e.code === 'KeyM') ui.openSynth()
    
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

function onUpdateFOV(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail && camera) {
    camera.fov = custom.detail
    camera.updateProjectionMatrix()
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
    ui.setBuildStatus('↩️ 成功還原上一步空間建造操作')
    setTimeout(() => ui.setBuildStatus(''), 2200)
  } else {
    ui.setBuildStatus('ℹ️ 目前沒有可還原的操作')
    setTimeout(() => ui.setBuildStatus(''), 1500)
  }
}

function redoBuild(): void {
  const success = world.redoLastBuild()
  if (success) {
    ui.setBuildStatus('🔁 成功重做空間建造操作')
    setTimeout(() => ui.setBuildStatus(''), 2200)
  }
}

function saveWorld(): void {
  localStorage.setItem('nw_world', JSON.stringify(world.toWorldData(settings.worldName)))
  sound.playBuildComplete()
  ui.setBuildStatus('💾 世界已成功保存至本地存檔！')
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
    achievements.trackProgress('ai_architect_prompt', 1)
    ui.setBuildStatus(`✨ 成功具象化建構 ${actions.length} 個體素方塊！`)
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
    ui.setBuildStatus('✨ 世界數據成功匯入！')
    setTimeout(() => ui.setBuildStatus(''), 2500)
  } catch {
    alert('無效的世界 JSON 檔案格式。')
  }
}

function clearWorld(): void {
  world.clear()
}

function getWorldBlocks(): Map<string, { type: BlockType; mesh: THREE.Mesh }> {
  return world.getPlayerBlocks()
}

defineExpose({ applyBuild, undoBuild, redoBuild, exportWorld, importWorldJSON, clearWorld, saveWorld, getWorldBlocks })

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
  window.removeEventListener('update-fov', onUpdateFOV)
  npcManager.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
.game-canvas { display: block; width: 100vw; height: 100vh; cursor: crosshair; }
</style>
