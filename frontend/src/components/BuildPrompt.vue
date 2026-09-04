<template>
  <div class="build-prompt-overlay" @click.self="close">
    <div class="build-panel glass-panel">
      <div class="header">
        <h2>⚡ AI Voxel Architect</h2>
        <span class="badge">Procedural DSL v2</span>
      </div>
      <p class="subtitle">Anchor Coordinates: [{{ ox }}, {{ oy }}, {{ oz }}]</p>
      
      <div class="input-group">
        <textarea
          v-model="prompt"
          placeholder="Describe your structure (e.g. 'Cyberpunk skyscraper with glowing glass decks', 'Medieval stone castle with 4 towers')..."
          @keydown.enter.prevent="submit"
        />
      </div>

      <div class="section-title">Inspiration Presets</div>
      <div class="examples">
        <button
          v-for="ex in examples"
          :key="ex"
          @click="prompt = ex"
        >
          {{ ex }}
        </button>
      </div>

      <div class="actions">
        <button class="btn-cancel" @click="close">Cancel</button>
        <button class="btn-submit" :disabled="!prompt.trim() || loading" @click="submit">
          {{ loading ? 'Synthesizing...' : 'Construct World' }}
        </button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'

const ui = useUIStore()
const settings = useSettingsStore()

const prompt = ref('')
const loading = ref(false)
const error = ref('')
const ox = ref(0)
const oy = ref(0)
const oz = ref(0)

const examples = [
  'Medieval stone castle with 4 towers',
  'Cyberpunk skyscraper with neon foliage',
  'Cozy wooden cottage with chimney',
  'Desert pyramid with palm oasis',
  'Ancient Japanese Pagoda',
  'Bioluminescent enchanted forest',
]

function onOpenBuild(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    ox.value = custom.detail.x
    oy.value = custom.detail.y
    oz.value = custom.detail.z
  }
}

onMounted(() => {
  window.addEventListener('open-build', onOpenBuild)
})
onUnmounted(() => {
  window.removeEventListener('open-build', onOpenBuild)
})

function close(): void { ui.closeOverlay() }

async function submit(): Promise<void> {
  if (!prompt.value.trim() || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:4000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: prompt.value, 
        cx: ox.value, 
        cz: oz.value,
        creatorId: settings.creatorId
      })
    })
    const data = await res.json()
    if (data.status === 'error') {
      throw new Error(data.message)
    }
    close()
  } catch (e) {
    error.value = String(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.build-prompt-overlay {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  z-index: 100;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
}

.build-panel {
  width: 520px; padding: 24px;
}

.glass-panel {
  background: rgba(15, 18, 32, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

h2 { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #00ffff; }
.badge {
  font-size: 11px;
  padding: 3px 8px;
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  color: #00ffff;
  font-family: monospace;
}

.subtitle { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 14px; font-family: monospace; }
.section-title { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }

.input-group textarea {
  width: 100%; height: 100px; padding: 12px;
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px; color: #fff; font-family: inherit; font-size: 14px;
  resize: none; outline: none; transition: border-color 0.2s;
  box-sizing: border-box;
}
.input-group textarea:focus { border-color: #00ffff; box-shadow: 0 0 8px rgba(0, 255, 255, 0.2); }

.examples {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
}
.examples button {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85); padding: 6px 12px; border-radius: 16px; font-size: 12px;
  cursor: pointer; transition: all 0.2s;
}
.examples button:hover { background: rgba(0,255,255,0.2); border-color: #00ffff; color: #fff; transform: translateY(-1px); }

.actions { display: flex; justify-content: flex-end; gap: 12px; }
button { font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; }
.btn-cancel {
  background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 8px 14px;
}
.btn-cancel:hover { color: #fff; }
.btn-submit {
  background: #00ffff; color: #000; border: none; padding: 9px 20px; border-radius: 8px;
  transition: all 0.2s;
  font-weight: 700;
  box-shadow: 0 0 12px rgba(0,255,255,0.3);
}
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 18px rgba(0,255,255,0.6); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.error { margin-top: 12px; color: #ff5555; font-size: 13px; }
</style>
