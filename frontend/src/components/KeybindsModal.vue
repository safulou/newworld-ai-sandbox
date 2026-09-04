<template>
  <div class="overlay" @click.self="close">
    <div class="help-panel glass-panel">
      <div class="header">
        <h2>⌨️ Controls & Keybindings Reference</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="key-grid">
        <div v-for="cat in keyCategories" :key="cat.name" class="cat-group">
          <div class="cat-title">{{ cat.name }}</div>
          <div v-for="k in cat.keys" :key="k.combo" class="key-row">
            <span class="key-combo">{{ k.combo }}</span>
            <span class="key-desc">{{ k.desc }}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn-done" @click="close">Got It (ESC / F3)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

interface KeyEntry {
  combo: string
  desc: string
}

interface KeyCategory {
  name: string
  keys: KeyEntry[]
}

const keyCategories: KeyCategory[] = [
  {
    name: 'Movement & Physics',
    keys: [
      { combo: 'W / A / S / D', desc: 'Walk forward / left / back / right' },
      { combo: 'Space', desc: 'Jump / Ascend in fly mode' },
      { combo: 'Shift', desc: 'Sprint / Descend in fly mode' },
      { combo: 'V', desc: 'Toggle Perspective (RTS / First-Person / Third-Person)' },
      { combo: 'F', desc: 'Toggle Creative Flying vs Gravity' },
    ]
  },
  {
    name: 'Building & Actions',
    keys: [
      { combo: 'Right Click', desc: 'Place selected hand block' },
      { combo: 'Left Click', desc: 'Mine & shatter block (with VFX)' },
      { combo: '1 ~ 9', desc: 'Quick select hotbar materials' },
      { combo: 'E', desc: 'Open Creative Block Catalog' },
      { combo: 'Ctrl + Z / Y', desc: 'Undo / Redo building actions' },
    ]
  },
  {
    name: 'AI & Metaverse Tools',
    keys: [
      { combo: 'B', desc: 'Open AI Voxel Architect prompt' },
      { combo: 'P', desc: 'Open 3D Blueprints Library' },
      { combo: 'M', desc: 'Toggle Lo-Fi Ambient Synth music' },
      { combo: 'F1', desc: 'Metaverse Settings & Atmosphere' },
      { combo: 'F2', desc: 'Save World to local storage' },
      { combo: 'F3', desc: 'Open Keybindings Help (this screen)' },
    ]
  }
]

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  backdrop-filter: blur(8px);
}

.help-panel {
  width: 680px; max-width: 95vw; padding: 24px;
  background: rgba(14, 18, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
h2 { font-size: 20px; font-weight: 700; color: #00ffff; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #fff; }

.key-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-height: 420px; overflow-y: auto;
}

.cat-group {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 12px;
}
.cat-title {
  font-size: 13px; font-weight: 700; color: #00ffff; margin-bottom: 10px;
  border-bottom: 1px solid rgba(0,255,255,0.2); padding-bottom: 4px;
}

.key-row {
  display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;
}
.key-combo {
  font-family: monospace; font-size: 11px; font-weight: 700; color: #ffd700;
  background: rgba(255,215,0,0.1); padding: 2px 6px; border-radius: 4px; width: fit-content;
}
.key-desc {
  font-size: 11px; color: rgba(255,255,255,0.75); line-height: 1.3;
}

.footer {
  display: flex; justify-content: flex-end; margin-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;
}
.btn-done {
  padding: 8px 20px; background: #00ffff; color: #000; border: none; border-radius: 8px;
  font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-done:hover { box-shadow: 0 0 16px rgba(0,255,255,0.6); transform: translateY(-1px); }
</style>
