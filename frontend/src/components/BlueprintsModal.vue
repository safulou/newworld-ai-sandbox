<template>
  <div class="overlay" @click.self="close">
    <div class="blueprint-panel glass-panel">
      <div class="header">
        <h2>🏛️ Architectural Blueprint Library</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <p class="subtitle">Deploy instant procedural mega-structures directly onto your plot</p>

      <div class="blueprint-grid">
        <div
          v-for="bp in blueprints"
          :key="bp.id"
          class="bp-card"
          :class="{ selected: selectedBp?.id === bp.id }"
          @click="selectedBp = bp"
        >
          <div class="bp-icon">{{ bp.icon }}</div>
          <div class="bp-info">
            <div class="bp-name">{{ bp.name }}</div>
            <div class="bp-desc">{{ bp.description }}</div>
            <div class="bp-meta">
              <span class="tag">{{ bp.category }}</span>
              <span class="blocks-count">~{{ bp.estimatedBlocks }} blocks</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn-cancel" @click="close">Cancel</button>
        <button
          class="btn-deploy"
          :disabled="!selectedBp"
          @click="deployBlueprint"
        >
          ⚡ Deploy "{{ selectedBp?.name || 'Selected' }}"
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { DSLCommand, BuildAction } from '@/types/world'
import { compileDSL } from '@/engine/dsl'
import { sound } from '@/engine/audio'

const emit = defineEmits<{
  (e: 'deploy', actions: BuildAction[]): void
}>()

const ui = useUIStore()

interface BlueprintItem {
  id: string
  name: string
  icon: string
  category: string
  description: string
  estimatedBlocks: number
  commands: DSLCommand[]
}

const selectedBp = ref<BlueprintItem | null>(null)

const blueprints: BlueprintItem[] = [
  {
    id: 'cyber-spire',
    name: 'Cyberpunk Neon Spire',
    icon: '🗼',
    category: 'Sci-Fi Mega-structure',
    description: 'A 28-meter tall skyscraper with double glass observation rings and a glowing bio-energy crown.',
    estimatedBlocks: 320,
    commands: [
      { type: 'cylinder', center: [0, 0, 0], radius: 4, height: 14, material: 'stone', hollow: true },
      { type: 'cylinder', center: [0, 8, 0], radius: 6, height: 2, material: 'glass', hollow: true },
      { type: 'cylinder', center: [0, 14, 0], radius: 3, height: 10, material: 'brick', hollow: true },
      { type: 'cylinder', center: [0, 18, 0], radius: 5, height: 2, material: 'glass', hollow: true },
      { type: 'sphere', center: [0, 26, 0], radius: 3, material: 'leaves' },
      { type: 'scatter', center: [0, 0, 0], radius: 9, count: 6, template: 'lamp' },
    ]
  },
  {
    id: 'citadel',
    name: 'Imperial Fortress',
    icon: '🏰',
    category: 'Medieval Castle',
    description: 'A fortified four-tower castle with perimeter battlements, courtyard paving, and brick parapets.',
    estimatedBlocks: 450,
    commands: [
      { type: 'box', from: [-8, 0, -8], to: [8, 5, 8], material: 'stone', hollow: true },
      { type: 'box', from: [-7, 0, -7], to: [7, 0, 7], material: 'plank' },
      { type: 'cylinder', center: [-8, 0, -8], radius: 2, height: 9, material: 'stone', hollow: false },
      { type: 'cylinder', center: [8, 0, -8], radius: 2, height: 9, material: 'stone', hollow: false },
      { type: 'cylinder', center: [-8, 0, 8], radius: 2, height: 9, material: 'stone', hollow: false },
      { type: 'cylinder', center: [8, 0, 8], radius: 2, height: 9, material: 'stone', hollow: false },
      { type: 'pyramid', base: [-8, 9, -8], size: 2, height: 3, material: 'brick' },
      { type: 'pyramid', base: [8, 9, -8], size: 2, height: 3, material: 'brick' },
      { type: 'pyramid', base: [-8, 9, 8], size: 2, height: 3, material: 'brick' },
      { type: 'pyramid', base: [8, 9, 8], size: 2, height: 3, material: 'brick' },
      { type: 'stairs', from: [0, 0, 9], steps: 3, direction: '-z', material: 'wood' },
    ]
  },
  {
    id: 'shrine',
    name: 'Neo-Tokyo Cyber Torii',
    icon: '⛩️',
    category: 'Oriental Cyberpunk',
    description: 'A majestic glowing Cyber Torii gate surrounded by enchanted ancient trees and stepping stones.',
    estimatedBlocks: 180,
    commands: [
      { type: 'box', from: [-4, 0, 0], to: [-3, 8, 1], material: 'brick' },
      { type: 'box', from: [3, 0, 0], to: [4, 8, 1], material: 'brick' },
      { type: 'box', from: [-6, 6, 0], to: [6, 7, 1], material: 'brick' },
      { type: 'box', from: [-7, 8, -1], to: [7, 9, 2], material: 'stone' },
      { type: 'box', from: [-2, 0, -4], to: [2, 0, 4], material: 'plank' },
      { type: 'scatter', center: [0, 0, 0], radius: 8, count: 4, template: 'tree' },
      { type: 'scatter', center: [0, 0, 0], radius: 5, count: 4, template: 'lamp' },
    ]
  },
  {
    id: 'bio-dome',
    name: 'Floating Bio-Dome',
    icon: '🏡',
    category: 'Eco Habitat',
    description: 'A glass biosphere dome containing lush flora, central water fountain, and snow crystal cap.',
    estimatedBlocks: 380,
    commands: [
      { type: 'cylinder', center: [0, 0, 0], radius: 7, height: 1, material: 'stone' },
      { type: 'sphere', center: [0, 6, 0], radius: 6, material: 'glass', hollow: true },
      { type: 'cylinder', center: [0, 1, 0], radius: 2, height: 1, material: 'water' },
      { type: 'scatter', center: [0, 1, 0], radius: 5, count: 4, template: 'tree' },
      { type: 'sphere', center: [0, 12, 0], radius: 1, material: 'snow' },
    ]
  },
  {
    id: 'warp-gate',
    name: 'Stargate Warp Portal',
    icon: '🌌',
    category: 'Cosmic Gateway',
    description: 'An ancient interdimensional gate with glowing cyan energy horizon and runic pillars.',
    estimatedBlocks: 210,
    commands: [
      { type: 'cylinder', center: [0, 5, 0], radius: 5, height: 2, material: 'stone', hollow: true },
      { type: 'cylinder', center: [0, 5, 0], radius: 4, height: 1, material: 'glass', hollow: false },
      { type: 'box', from: [-6, 0, -2], to: [6, 1, 2], material: 'stone' },
      { type: 'scatter', center: [0, 0, 0], radius: 8, count: 4, template: 'column' },
    ]
  }
]

selectedBp.value = blueprints[0]

function close(): void { ui.closeOverlay() }

function deployBlueprint(): void {
  if (!selectedBp.value) return
  const actions = compileDSL(selectedBp.value.commands, { x: 0, y: 0, z: 0 })
  emit('deploy', actions)
  sound.playBuildComplete()
  ui.setBuildStatus(`✨ Deployed "${selectedBp.value.name}"!`)
  setTimeout(() => ui.setBuildStatus(''), 2500)
  close()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  backdrop-filter: blur(6px);
}

.blueprint-panel {
  width: 680px; max-width: 95vw; padding: 24px;
  background: rgba(14, 18, 30, 0.92);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 14px; color: #fff;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7);
}

.header {
  display: flex; justify-content: space-between; align-items: center;
}
h2 { font-size: 20px; font-weight: 700; color: #00ffff; }
.close-btn {
  background: transparent; border: none; color: rgba(255,255,255,0.6);
  font-size: 18px; cursor: pointer;
}
.close-btn:hover { color: #fff; }

.subtitle {
  font-size: 13px; color: rgba(255,255,255,0.5); margin: 4px 0 16px;
}

.blueprint-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  max-height: 420px; overflow-y: auto; padding-right: 4px;
}

.bp-card {
  display: flex; gap: 12px; padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.bp-card:hover {
  background: rgba(0,255,255,0.08); border-color: rgba(0,255,255,0.3);
  transform: translateY(-2px);
}
.bp-card.selected {
  background: rgba(0,255,255,0.18); border: 2px solid #00ffff;
  box-shadow: 0 0 16px rgba(0,255,255,0.3);
}

.bp-icon { font-size: 28px; display: flex; align-items: center; justify-content: center; }
.bp-info { flex: 1; }
.bp-name { font-size: 14px; font-weight: 700; color: #fff; }
.bp-desc { font-size: 11px; color: rgba(255,255,255,0.6); margin: 4px 0 8px; line-height: 1.4; }
.bp-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.tag { color: #00ffff; background: rgba(0,255,255,0.1); padding: 2px 6px; border-radius: 4px; }
.blocks-count { color: rgba(255,255,255,0.4); font-family: monospace; }

.footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;
}
.btn-cancel {
  background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 8px 16px; cursor: pointer;
}
.btn-cancel:hover { color: #fff; }
.btn-deploy {
  background: #00ffff; color: #000; border: none; padding: 9px 22px; border-radius: 8px;
  font-weight: 700; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 0 12px rgba(0,255,255,0.4);
}
.btn-deploy:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 20px rgba(0,255,255,0.7); }
.btn-deploy:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
