<template>
  <div class="overlay" @click.self="close">
    <div class="inventory-panel glass-panel">
      <div class="header">
        <h2>🎒 Creative Block Catalog</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="search-bar">
        <input
          v-model="search"
          placeholder="Search materials (e.g. glass, neon, stone, wood)..."
          ref="searchInput"
        />
      </div>

      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="block-grid">
        <div
          v-for="block in filteredBlocks"
          :key="block.type"
          class="block-card"
          :class="{ selected: ui.selectedBlock === block.type }"
          @click="selectBlock(block.type)"
        >
          <div
            class="swatch"
            :style="{ backgroundColor: block.color, boxShadow: `0 0 12px ${block.color}` }"
          ></div>
          <div class="block-name">{{ block.name }}</div>
          <div class="block-tag">{{ block.category }}</div>
        </div>
      </div>

      <div class="footer">
        <span class="hint">Click any block to set as active hand item. Press ESC or E to return.</span>
        <button class="btn-done" @click="close">Done (E)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { BlockType } from '@/types/world'
import { sound } from '@/engine/audio'

const ui = useUIStore()
const search = ref('')
const activeCategory = ref('All')
const searchInput = ref<HTMLInputElement>()

interface CatalogItem {
  type: BlockType
  name: string
  category: 'Building' | 'Nature' | 'Sci-Fi' | 'Elements'
  color: string
}

const blocks: CatalogItem[] = [
  { type: 'stone', name: 'Cyber Metal Stone', category: 'Building', color: '#1a1a24' },
  { type: 'brick', name: 'Crimson Metal Brick', category: 'Building', color: '#4a1515' },
  { type: 'plank', name: 'Dark Slate Plank', category: 'Building', color: '#1c2b36' },
  { type: 'wood', name: 'Charred Timber Wood', category: 'Building', color: '#2d1711' },
  { type: 'glass', name: 'Cyan Luminous Glass', category: 'Sci-Fi', color: '#00ffff' },
  { type: 'leaves', name: 'Glowing Neon Flora', category: 'Sci-Fi', color: '#00ff88' },
  { type: 'grass', name: 'Bio Moss Grass', category: 'Nature', color: '#0b3d1f' },
  { type: 'dirt', name: 'Obsidian Soil Dirt', category: 'Nature', color: '#151110' },
  { type: 'sand', name: 'Desert Bronze Sand', category: 'Nature', color: '#3d352b' },
  { type: 'water', name: 'Aquamarine Fluid Water', category: 'Elements', color: '#00aaff' },
  { type: 'snow', name: 'Glacial Crystal Snow', category: 'Elements', color: '#ffffff' },
]

const categories = ['All', 'Building', 'Nature', 'Sci-Fi', 'Elements']

const filteredBlocks = computed(() => {
  return blocks.filter(b => {
    const matchesCat = activeCategory.value === 'All' || b.category === activeCategory.value
    const matchesSearch =
      b.name.toLowerCase().includes(search.value.toLowerCase()) ||
      b.type.toLowerCase().includes(search.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

function selectBlock(type: BlockType): void {
  ui.setSelectedBlock(type)
  sound.playBlockPlace(type)
  ui.setBuildStatus(`Hand: ${type.toUpperCase()}`)
  setTimeout(() => ui.setBuildStatus(''), 1500)
  close()
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  searchInput.value?.focus()
})
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  backdrop-filter: blur(8px);
}

.inventory-panel {
  width: 640px; max-width: 95vw; padding: 24px;
  background: rgba(14, 18, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
h2 { font-size: 20px; font-weight: 700; color: #00ffff; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #fff; }

.search-bar input {
  width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); color: #fff;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 10px 14px; font-size: 14px;
  outline: none; margin-bottom: 12px;
}
.search-bar input:focus { border-color: #00ffff; box-shadow: 0 0 10px rgba(0,255,255,0.3); }

.category-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.cat-btn {
  padding: 6px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8); border-radius: 8px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.cat-btn:hover { border-color: #00ffff; color: #fff; }
.cat-btn.active { background: rgba(0,255,255,0.2); border-color: #00ffff; color: #00ffff; font-weight: 700; }

.block-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  max-height: 320px; overflow-y: auto; padding-right: 4px;
}

.block-card {
  display: flex; flex-direction: column; align-items: center; padding: 12px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.block-card:hover {
  background: rgba(0,255,255,0.12); border-color: rgba(0,255,255,0.4); transform: translateY(-2px);
}
.block-card.selected {
  background: rgba(0,255,255,0.25); border: 2px solid #00ffff; box-shadow: 0 0 14px rgba(0,255,255,0.4);
}

.swatch { width: 36px; height: 36px; border-radius: 6px; margin-bottom: 8px; }
.block-name { font-size: 12px; font-weight: 700; text-align: center; color: #fff; }
.block-tag { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 2px; }

.footer {
  display: flex; justify-content: space-between; align-items: center; margin-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;
}
.hint { font-size: 11px; color: rgba(255,255,255,0.5); }
.btn-done {
  padding: 8px 20px; background: #00ffff; color: #000; border: none; border-radius: 8px;
  font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-done:hover { box-shadow: 0 0 16px rgba(0,255,255,0.6); transform: translateY(-1px); }
</style>
