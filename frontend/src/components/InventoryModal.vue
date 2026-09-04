<template>
  <div class="overlay" @click.self="close">
    <div class="inventory-panel glass-panel">
      <div class="header">
        <h2>🎒 全品類創造物品庫 (Creative Block Catalog)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="search-bar">
        <input
          v-model="search"
          placeholder="搜尋方塊材質 (例如：霓虹、玻璃、黑曜石、金礦、導線)..."
          ref="searchInput"
        />
      </div>

      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
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
            :style="{ backgroundColor: block.colorHex, boxShadow: `0 0 12px ${block.colorHex}` }"
          ></div>
          <div class="block-name">{{ block.displayName }}</div>
          <div class="block-tag">{{ block.type }}</div>
        </div>
      </div>

      <div class="footer">
        <span class="hint">點選任意方塊即可裝備為手持方塊。按 ESC 或 E 鍵關閉。</span>
        <button class="btn-done" @click="close">完成 (E)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { BlockType } from '@/types/world'
import { BLOCK_REGISTRY } from '@/engine/blocks'
import { sound } from '@/engine/audio'

const ui = useUIStore()
const search = ref('')
const activeCategory = ref('all')
const searchInput = ref<HTMLInputElement>()

const categories = [
  { id: 'all', name: '全部 (All)' },
  { id: 'nature', name: '🌿 自然生態 (Nature)' },
  { id: 'building', name: '🏛️ 建築結構 (Building)' },
  { id: 'scifi', name: '⚡ 賽博霓虹 (Sci-Fi)' },
  { id: 'logic', name: '🔌 邏輯機關 (Logic)' },
]

const allItems = computed(() => {
  return Object.entries(BLOCK_REGISTRY)
    .filter(([type]) => type !== 'air')
    .map(([type, prop]) => {
      const hex = '#' + prop.color.toString(16).padStart(6, '0')
      return {
        type: type as BlockType,
        displayName: prop.displayName,
        category: prop.category,
        colorHex: hex,
      }
    })
})

const filteredBlocks = computed(() => {
  return allItems.value.filter(b => {
    const matchesCat = activeCategory.value === 'all' || b.category === activeCategory.value
    const matchesSearch =
      b.displayName.toLowerCase().includes(search.value.toLowerCase()) ||
      b.type.toLowerCase().includes(search.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

function selectBlock(type: BlockType): void {
  ui.setSelectedBlock(type)
  sound.playBlockPlace(type)
  ui.setBuildStatus(`手持方塊：${BLOCK_REGISTRY[type]?.displayName || type}`)
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
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(8px);
}

.inventory-panel {
  width: 720px; max-width: 95vw; padding: 24px;
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

.category-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.cat-btn {
  padding: 6px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8); border-radius: 8px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.cat-btn:hover { border-color: #00ffff; color: #fff; }
.cat-btn.active { background: rgba(0,255,255,0.2); border-color: #00ffff; color: #00ffff; font-weight: 700; }

.block-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  max-height: 380px; overflow-y: auto; padding-right: 6px;
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
