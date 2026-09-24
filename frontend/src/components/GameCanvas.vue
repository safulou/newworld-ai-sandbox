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
import { vehicles, VEHICLE_CONFIGS } from '@/engine/vehicles'
import { weather } from '@/engine/weather'
import { questEngine } from '@/engine/quests'
import { droneManager } from '@/engine/drone'
import { spatialAudio } from '@/engine/spatialAudio'
import { spatialVoice } from '@/engine/spatialVoice'
import { minigames } from '@/engine/minigames'
import { circuits } from '@/engine/circuits'
import { fluids } from '@/engine/fluids'
import { explosives } from '@/engine/explosives'
import { multiplayerSync } from '@/engine/multiplayerSync'
import { npcSociety } from '@/engine/npcSociety'
import { noteBlocks } from '@/engine/noteBlocks'
import { blueprintHologram } from '@/engine/blueprintHologram'
import { cyberFauna } from '@/engine/cyberFauna'
import { survivalCombat } from '@/engine/survivalCombat'
import { faunaGear } from '@/engine/faunaGear'
import { multiplayerCombat } from '@/engine/multiplayerCombat'
import { vehicleCombat } from '@/engine/vehicleCombat'
import { atmosphericAudio } from '@/engine/atmosphericAudio'
import { atmosphericParticles } from '@/engine/atmosphericParticles'

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

  // Initialize Autonomous AI NPC Roster, Vehicles, Drone, Spatial Audio, Weather & Voice
  npcManager.init(scene, world, new THREE.Vector3(0, 0, 0))
  vehicles.init(scene)
  weather.init(scene)
  droneManager.init(scene)
  spatialAudio.init()
  minigames.init(scene)
  explosives.init(scene)
  multiplayerSync.init(world.getSocket(), scene, world)
  spatialVoice.joinVoice(world.getSocket(), settings.creatorId, camera.position)
  noteBlocks.init(scene)
  blueprintHologram.init(scene)
  cyberFauna.init(scene, camera.position)
  survivalCombat.init(scene, camera)
  faunaGear.init(scene)
  multiplayerCombat.init(world.getSocket(), scene)

  circuits.setListener({
    onJumpPadTriggered: (pos) => {
      window.dispatchEvent(new CustomEvent('explosion-knockback', {
        detail: { origin: { x: pos.x, y: pos.y - 1, z: pos.z }, force: 20 }
      }))
    },
    onTeleportTriggered: (_from, target) => {
      camera.position.copy(target)
    }
  })

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mobile-mouse-click', onMobileMouseClick)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', onResize)
  window.addEventListener('time-of-day', onTimeOfDayChange)
  window.addEventListener('undo-build', onUndoBuild)
  window.addEventListener('direct-build', onDirectBuild)
  window.addEventListener('update-fov', onUpdateFOV)

  vehicleCombat.init(scene)
  atmosphericParticles.init(scene)
  atmosphericAudio.transitionToTimeOfDay(ui.timeOfDay)

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
  vehicles.update(delta, camera.position, true)
  weather.update(delta, camera.position)
  droneManager.update(delta, camera.position)
  minigames.update(delta, camera.position)
  circuits.update(delta, camera.position, world, npcManager.getNPCs())
  fluids.update(delta, world)
  explosives.update(delta)
  multiplayerSync.update(delta)
  npcSociety.update(delta, npcManager.getNPCs(), camera.position)
  noteBlocks.update(delta)
  blueprintHologram.update(delta)
  cyberFauna.update(delta, camera.position)
  survivalCombat.update(delta, camera.position)
  faunaGear.update(delta)
  multiplayerCombat.update(delta)
  vehicleCombat.update(delta, world)
  atmosphericParticles.update(delta, camera.position)

  // Hound Combat Support: if Boss Guardian is active, hounds fire laser at Boss
  const activeBoss = survivalCombat.getBoss()
  if (survivalCombat.stats.bossActive && activeBoss && !activeBoss.isDefeated) {
    cyberFauna.updateCombatHounds(delta, activeBoss.mesh.position, (from, to) => {
      faunaGear.spawnLaserBeam(from, to, 0x00ffff)
      survivalCombat.damageBoss(20, to)
    })
  }

  multiplayerSync.emitLocalState(camera.position, camera.rotation.y, settings.creatorId || 'Pioneer', vehicles.getVehicle(), spatialVoice.isLocalSpeaking)
  
  const camForward = new THREE.Vector3()
  camera.getWorldDirection(camForward)
  spatialVoice.update(camera.position, camForward, camera.up)

  for (const peer of spatialVoice.peers.values()) {
    world.setPlayerVoiceState(peer.id, peer.isSpeaking, peer.isMuted)
  }
  
  // High altitude quest & achievement check
  if (camera.position.y >= 35) {
    questEngine.trackProgress('reach_y35', 1)
    achievements.unlock('reach_sky')
  }

  // Throttle player broadcast & HUD position update & Profiler telemetry
  if (Math.random() < 0.1) {
    world.emitPlayerMove(camera.position.x, camera.position.y, camera.position.z)
    window.dispatchEvent(new CustomEvent('player-position', {
      detail: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        yaw: Math.atan2(camForward.x, camForward.z),
      }
    }))

    let facingStr = '北 (North)'
    if (Math.abs(camForward.x) > Math.abs(camForward.z)) {
      facingStr = camForward.x > 0 ? '東 (East +X)' : '西 (West -X)'
    } else {
      facingStr = camForward.z > 0 ? '南 (South +Z)' : '北 (North -Z)'
    }

    const cx = Math.floor(camera.position.x / 16)
    const cz = Math.floor(camera.position.z / 16)

    window.dispatchEvent(new CustomEvent('profiler-update', {
      detail: {
        coords: {
          x: camera.position.x.toFixed(1),
          y: camera.position.y.toFixed(1),
          z: camera.position.z.toFixed(1),
        },
        chunk: { cx, cz },
        facing: facingStr,
        biome: 'Neon City Core',
        drawCalls: renderer?.info?.render?.calls ?? 0,
        triangles: renderer?.info?.render?.triangles ?? 0,
        geometries: renderer?.info?.memory?.geometries ?? 0,
        textures: renderer?.info?.memory?.textures ?? 0,
      }
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

  // Vehicle Combat: Left click fires vehicle plasma cannons
  if (vehicles.getVehicle() !== 'none' && e.button === 0) {
    const camDir = new THREE.Vector3()
    camera.getWorldDirection(camDir)
    vehicleCombat.fire(camera.position, camDir, vehicles.getVehicle())
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
    const hitDrone = minigames.checkLaserHit(target)
    physics.triggerExplosion(target.x, target.y, target.z, hitDrone ? 4.5 : 3.5, world)
    atmosphere.spawnBreakEffect(target.x, target.y, target.z, hitDrone ? 0x00ffff : 0xff0055)
    achievements.unlock('tnt_blast')
    if (hitDrone) {
      ui.setBuildStatus(`🎯 擊破敵方無人機！總分: ${minigames.state.score} (連擊 x${minigames.state.combo})`)
    } else {
      ui.setBuildStatus('💥 電漿爆破引爆！')
    }
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
      ui.setBuildStatus(`📐 距離: ${res.distance.toFixed(2)}m (ΔX: ${res.dx}, ΔY: ${res.dy}, ΔZ: ${res.dz})`)
      setTimeout(() => ui.setBuildStatus(''), 3500)
    } else {
      ui.setBuildStatus('📐 已選取測量起點！請點擊終點。')
      setTimeout(() => ui.setBuildStatus(''), 2000)
    }
    return
  }

  // Standard Pickaxe / Hand placement
  if (e.button === 0) {
    // If Saber equipped -> swing attack!
    if (survivalCombat.stats.saberActive) {
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      survivalCombat.attackSwing(camera.position, camDir)
    }

    // Left Click: Mine / Break pointed block
    const breakPos = rc.point.clone().sub(rc.normal.clone().multiplyScalar(0.1))
    const bx = Math.floor(breakPos.x)
    const by = Math.floor(breakPos.y)
    const bz = Math.floor(breakPos.z)

    const blockType = world.getBlock(bx, by, bz)
    world.removeBlock(bx, by, bz)
    multiplayerSync.broadcastBlockBreak(bx, by, bz, settings.creatorId)
    if (blockType === 'water' || blockType === 'magma') {
      fluids.removeSource(bx, by, bz)
    }
    circuits.simulateCircuits(world)

    atmosphere.spawnBreakEffect(
      bx + 0.5,
      by + 0.5,
      bz + 0.5,
      BLOCK_COLORS[blockType] || 0x00ffff
    )
  } else if (e.button === 2) {
    // Check if interacting with Cyber Fauna (taming or sitting)
    if (cyberFauna.interactWithFauna(camera.position, ui.selectedBlock)) {
      return
    }

    // Right Click: check if interacting with Switch / Lever / Note block first
    const hitPos = rc.point.clone().sub(rc.normal.clone().multiplyScalar(0.1))
    const hx = Math.floor(hitPos.x)
    const hy = Math.floor(hitPos.y)
    const hz = Math.floor(hitPos.z)
    const hitBlock = world.getBlock(hx, hy, hz)

    if (hitBlock === 'note_block') {
      const newPitch = noteBlocks.tune(hx, hy, hz, world, scene)
      ui.setBuildStatus(`🎵 音符方塊音高已調節至: [${newPitch}/24] (半音階)`)
      setTimeout(() => ui.setBuildStatus(''), 1200)
      return
    }

    if (hitBlock === 'lever') {
      const active = circuits.toggleLever(hx, hy, hz, world)
      ui.setBuildStatus(active ? '💡 機械開關已導通 (ON)' : '💡 機械開關已斷開 (OFF)')
      setTimeout(() => ui.setBuildStatus(''), 1200)
      return
    }

    // Place currently active block
    const placePos = rc.point.clone().add(rc.normal.clone().multiplyScalar(0.1))
    const bx = Math.floor(placePos.x)
    const by = Math.floor(placePos.y)
    const bz = Math.floor(placePos.z)

    const prevType = world.getBlock(bx, by, bz)
    world.setBlock(bx, by, bz, ui.selectedBlock)
    world.recordSinglePlacement(bx, by, bz, prevType, ui.selectedBlock)
    multiplayerSync.broadcastBlockPlace(bx, by, bz, ui.selectedBlock, settings.creatorId)

    if (ui.selectedBlock === 'water' || ui.selectedBlock === 'magma') {
      fluids.addSource(bx, by, bz, ui.selectedBlock)
    }
    circuits.simulateCircuits(world)

    // Build near NPC rewards Affinity
    for (const npc of npcManager.getNPCs()) {
      if (npc.getGroup().position.distanceTo(placePos) < 8.0) {
        npcSociety.addAffinity(npc.def.id, 2)
        break
      }
    }

    // Quest tracking
    questEngine.trackProgress('place_5_blocks', 1)
    if (ui.selectedBlock === 'light_emitter') {
      questEngine.trackProgress('place_3_emitters', 1)
    }
    if (ui.selectedBlock === 'wire_off' || ui.selectedBlock === 'wire_on') {
      questEngine.trackProgress('place_wires', 1)
    }
    if (ui.selectedBlock === 'power_source') {
      questEngine.trackProgress('place_power', 1)
    }
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
  if (e.code === 'F9') ui.openKeybinds()
  if (e.code === 'F4') ui.openPhoto()
  if (e.code === 'F5') ui.openAchievements()
  if (e.code === 'F6') ui.openExport()
  if (e.code === 'F7') ui.openSynth()
  if (e.code === 'F8') ui.openSpatialVoice()
  
  if (ui.mode === 'game') {
    if (e.code === 'KeyX') ui.openSpatialVoice()
    if (e.code === 'KeyG') {
      const v = vehicles.cycleVehicle(camera.position)
      const config = VEHICLE_CONFIGS[v]
      ui.setBuildStatus(`${config.icon} ${config.name}已切換！（速度 ${config.speedMultiplier}x）`)
      setTimeout(() => ui.setBuildStatus(''), 1500)
    }
    if (e.code === 'KeyJ') ui.openQuests()
    if (e.code === 'KeyK') ui.openShaders()
    if (e.code === 'KeyT') ui.openTools()
    if (e.code === 'KeyC') ui.openChain()
    if (e.code === 'KeyE') ui.openInventory()
    if (e.code === 'KeyP') ui.openBlueprints()
    if (e.code === 'KeyM') ui.openSynth()
    if (e.code === 'KeyH') ui.openSkins()
    if (e.code === 'KeyO') ui.openMinigames()
    if (e.code === 'KeyN') ui.openCustomBlueprints()
    if (e.code === 'KeyU') ui.openVoxImporter()
    if (e.code === 'KeyY') ui.openDrone()
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) survivalCombat.toggleSaber()
    
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
  if (custom.detail) {
    if (atmosphere) atmosphere.setTimeOfDay(custom.detail)
    atmosphericAudio.transitionToTimeOfDay(custom.detail)
    atmosphericParticles.setTimeOfDay(custom.detail)
  }
}

watch(() => ui.timeOfDay, (newVal) => {
  if (newVal) {
    if (atmosphere) atmosphere.setTimeOfDay(newVal)
    atmosphericAudio.transitionToTimeOfDay(newVal)
    atmosphericParticles.setTimeOfDay(newVal)
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

function getPlayerPosition(): THREE.Vector3 {
  return camera ? camera.position.clone() : new THREE.Vector3(0, 5, 0)
}

function onMobileMouseClick(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    pointerDownPos.x = window.innerWidth / 2
    pointerDownPos.y = window.innerHeight / 2
    mouse.x = 0
    mouse.y = 0
    onMouseUp({
      button: custom.detail.button ?? 0,
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    } as MouseEvent)
  }
}

defineExpose({ applyBuild, undoBuild, redoBuild, exportWorld, importWorldJSON, clearWorld, saveWorld, getWorldBlocks, getPlayerPosition })

onMounted(() => { if (canvas.value) init() })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mobile-mouse-click', onMobileMouseClick)
  window.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('time-of-day', onTimeOfDayChange)
  window.removeEventListener('undo-build', onUndoBuild)
  window.removeEventListener('direct-build', onDirectBuild)
  window.removeEventListener('update-fov', onUpdateFOV)
  npcManager.dispose()
  vehicles.dispose()
  weather.dispose()
  explosives.dispose()
  multiplayerSync.dispose()
  fluids.clear()
  noteBlocks.dispose()
  blueprintHologram.dispose()
  cyberFauna.dispose()
  survivalCombat.dispose()
  faunaGear.dispose()
  multiplayerCombat.dispose()
  vehicleCombat.dispose()
  atmosphericAudio.dispose()
  atmosphericParticles.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
.game-canvas { display: block; width: 100vw; height: 100vh; cursor: crosshair; }
</style>
