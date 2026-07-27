<template>
  <div class="overlay" @click.self="close">
    <div class="panel">
      <h2>✨ AI World Builder</h2>
      <p class="sub">Describe what you want to build in any language</p>

      <div class="examples">
        <span v-for="ex in examples" :key="ex" class="chip" @click="prompt = ex">{{ ex }}</span>
      </div>

      <textarea
        v-model="prompt"
        placeholder="e.g. Build me a stone castle with a tall tower..."
        rows="4"
        @keydown.enter.ctrl="submit"
      />

      <div class="origin-row">
        <label>Build at: X</label>
        <input v-model.number="ox" type="number" style="width:60px" />
        <label>Y</label>
        <input v-model.number="oy" type="number" style="width:60px" />
        <label>Z</label>
        <input v-model.number="oz" type="number" style="width:60px" />
      </div>

      <div class="actions">
        <button class="btn-cancel" @click="close">Cancel (ESC)</button>
        <button class="btn-build" :disabled="loading || !prompt.trim()" @click="submit">
          {{ loading ? 'Building...' : '⚡ Build (Ctrl+Enter)' }}
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { generateBuild } from '@/engine/ai'

const emit = defineEmits<{ (e: 'build', result: ReturnType<typeof generateBuild> extends Promise<infer T> ? T : never, origin: {x:number;y:number;z:number}): void }>()

const ui = useUIStore()
const settings = useSettingsStore()

const prompt = ref('')
const loading = ref(false)
const error = ref('')
const ox = ref(0)
const oy = ref(0)
const oz = ref(0)

const examples = [
  'A small wooden house',
  'Stone castle with towers',
  'A pine forest',
  'Sand pyramid',
  'Snowy cabin',
]

function close(): void { ui.closeOverlay() }

async function submit(): Promise<void> {
  if (!prompt.value.trim() || loading.value) return
  loading.value = true
  error.value = ''
  ui.setBuildStatus('AI is thinking...')
  try {
    const result = await generateBuild(
      prompt.value,
      settings.apiKey,
      settings.provider,
      { x: ox.value, y: oy.value, z: oz.value }
    )
    emit('build', result, { x: ox.value, y: oy.value, z: oz.value })
    ui.setBuildStatus(`Built: ${result.description}`)
    setTimeout(() => ui.setBuildStatus(''), 3000)
    close()
  } catch (e) {
    error.value = String(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.panel {
  background: #1a1a2e; color: #eee; padding: 28px 32px; border-radius: 12px;
  width: 480px; max-width: 95vw; font-family: monospace;
}
h2 { margin: 0 0 4px; font-size: 20px; }
.sub { margin: 0 0 14px; color: #888; font-size: 13px; }

.examples { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.chip {
  background: #2a2a4a; padding: 4px 10px; border-radius: 20px; font-size: 12px;
  cursor: pointer; border: 1px solid #444;
}
.chip:hover { border-color: #7c7cff; color: #fff; }

textarea {
  width: 100%; box-sizing: border-box; background: #111; color: #eee;
  border: 1px solid #444; border-radius: 6px; padding: 10px; font-size: 14px;
  font-family: monospace; resize: vertical;
}
textarea:focus { outline: none; border-color: #7c7cff; }

.origin-row {
  display: flex; align-items: center; gap: 8px; margin: 10px 0; font-size: 13px; color: #aaa;
}
.origin-row input { background: #111; color: #eee; border: 1px solid #444; border-radius: 4px; padding: 4px; }

.actions { display: flex; gap: 10px; margin-top: 16px; }
.btn-cancel {
  flex: 1; padding: 10px; background: #333; color: #aaa; border: none; border-radius: 6px; cursor: pointer;
}
.btn-build {
  flex: 2; padding: 10px; background: #5555ff; color: #fff; border: none; border-radius: 6px;
  cursor: pointer; font-weight: bold; font-size: 14px;
}
.btn-build:disabled { background: #333; color: #666; cursor: not-allowed; }
.btn-build:not(:disabled):hover { background: #7777ff; }
.error { color: #ff6b6b; font-size: 12px; margin-top: 8px; }
</style>
