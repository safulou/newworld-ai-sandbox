<template>
  <div class="overlay" @click.self="close">
    <div class="panel">
      <h2>⚙️ Settings</h2>

      <label>World Name</label>
      <input v-model="worldName" @change="settings.setWorldName(worldName)" />

      <label>AI Provider</label>
      <select v-model="provider" @change="settings.setProvider(provider as AIProvider)">
        <option value="local">🧱 Local (no API key needed)</option>
        <option value="openai">⚡ OpenAI (GPT-4o mini)</option>
        <option value="gemini">🔵 Google Gemini 1.5 Flash</option>
        <option value="claude">🟠 Anthropic Claude Haiku</option>
      </select>

      <template v-if="provider !== 'local'">
        <label>API Key</label>
        <input
          v-model="apiKey"
          type="password"
          :placeholder="`Enter your ${provider} API key`"
          @change="settings.setApiKey(apiKey)"
        />
        <p class="hint">
          ⚠️ Stored in browser localStorage only. Never sent to any server — calls go directly to the AI provider.
        </p>
      </template>

      <div class="world-actions">
        <button @click="saveWorld">💾 Save World (F2)</button>
        <button @click="exportWorld">📤 Export JSON</button>
        <label class="import-btn">
          📥 Import JSON
          <input type="file" accept=".json" @change="importWorld" style="display:none" />
        </label>
        <button class="danger" @click="clearWorld">🗑️ Clear World</button>
      </div>

      <button class="btn-close" @click="close">Close (ESC)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore, AIProvider } from '@/stores/settings'

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'export'): void
  (e: 'import', data: string): void
  (e: 'clear'): void
}>()

const ui = useUIStore()
const settings = useSettingsStore()

const worldName = ref(settings.worldName)
const provider = ref<AIProvider>(settings.provider)
const apiKey = ref(settings.apiKey)

function close(): void { ui.closeOverlay() }
function saveWorld(): void { emit('save') }
function exportWorld(): void { emit('export') }
function clearWorld(): void { if (confirm('Clear all blocks?')) emit('clear') }

function importWorld(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { emit('import', ev.target?.result as string) }
  reader.readAsText(file)
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.panel {
  background: #1a1a2e; color: #eee; padding: 28px 32px; border-radius: 12px;
  width: 400px; max-width: 95vw; font-family: monospace;
  display: flex; flex-direction: column; gap: 10px;
}
h2 { margin: 0 0 8px; }
label { font-size: 13px; color: #aaa; margin-top: 4px; }
input, select {
  width: 100%; box-sizing: border-box; background: #111; color: #eee;
  border: 1px solid #444; border-radius: 6px; padding: 8px 10px; font-size: 13px; font-family: monospace;
}
input:focus, select:focus { outline: none; border-color: #7c7cff; }
.hint { font-size: 11px; color: #888; margin: 0; }

.world-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.world-actions button, .import-btn {
  padding: 8px 12px; background: #2a2a4a; color: #eee; border: 1px solid #444;
  border-radius: 6px; cursor: pointer; font-size: 12px; font-family: monospace;
}
.world-actions button:hover, .import-btn:hover { border-color: #7c7cff; }
.world-actions .danger { color: #ff6b6b; border-color: #663333; }
.world-actions .danger:hover { background: #331a1a; }

.btn-close {
  padding: 10px; background: #5555ff; color: #fff; border: none; border-radius: 6px;
  cursor: pointer; font-weight: bold; margin-top: 8px;
}
.btn-close:hover { background: #7777ff; }
</style>
