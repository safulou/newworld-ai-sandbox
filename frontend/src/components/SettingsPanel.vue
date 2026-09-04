<template>
  <div class="overlay" @click.self="close">
    <div class="panel glass-panel">
      <h2>⚙️ Metaverse Settings</h2>

      <label>World Name</label>
      <input v-model="worldName" @change="settings.setWorldName(worldName)" />

      <label>Creator ID (Blockchain Identity)</label>
      <input v-model="creatorId" @change="settings.setCreatorId(creatorId)" placeholder="e.g. Satoshi_Nakamoto" />

      <label>Atmosphere & Time of Day</label>
      <div class="time-buttons">
        <button
          v-for="t in times"
          :key="t.id"
          class="time-btn"
          :class="{ active: ui.timeOfDay === t.id }"
          @click="ui.setTimeOfDay(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <label>AI Architecture Engine (BYOK)</label>
      <select v-model="provider" @change="settings.setProvider(provider as AIProvider)">
        <option value="local">🧱 Local Procedural DSL (Zero Key Needed)</option>
        <option value="gemini">🔵 Google Gemini 2.5 Flash (Recommended)</option>
        <option value="openai">⚡ OpenAI GPT-4o mini</option>
        <option value="claude">🟠 Anthropic Claude 3.5 Sonnet</option>
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
          🔒 Stored in browser localStorage only. Never transmitted to any third-party server.
        </p>
      </template>

      <div class="world-actions">
        <button @click="saveWorld">💾 Save (F2)</button>
        <button @click="exportWorld">📤 Export JSON</button>
        <label class="import-btn">
          📥 Import JSON
          <input type="file" accept=".json" @change="importWorld" style="display:none" />
        </label>
        <button class="danger" @click="clearWorld">🗑️ Reset World</button>
      </div>

      <button class="btn-close" @click="close">Save & Return to Sandbox (ESC)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore, TimeOfDay } from '@/stores/ui'
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
const creatorId = ref(settings.creatorId)
const provider = ref<AIProvider>(settings.provider)
const apiKey = ref(settings.apiKey)

const times: { id: TimeOfDay; label: string }[] = [
  { id: 'dawn', label: '🌅 Dawn' },
  { id: 'day', label: '☀️ Noon' },
  { id: 'sunset', label: '🌆 Sunset' },
  { id: 'night', label: '🌌 Night' },
]

function close(): void { ui.closeOverlay() }
function saveWorld(): void { emit('save') }
function exportWorld(): void { emit('export') }
function clearWorld(): void { if (confirm('Clear all blocks in world?')) emit('clear') }

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
  backdrop-filter: blur(6px);
}
.panel {
  background: rgba(14, 18, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.25);
  color: #eee; padding: 28px 32px; border-radius: 14px;
  width: 440px; max-width: 95vw; font-family: 'Inter', system-ui, sans-serif;
  display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
}
h2 { margin: 0 0 8px; font-size: 20px; color: #00ffff; }
label { font-size: 13px; color: #aaa; margin-top: 4px; font-weight: 600; }
input, select {
  width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); color: #eee;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 10px 12px; font-size: 13px; font-family: inherit;
}
input:focus, select:focus { outline: none; border-color: #00ffff; box-shadow: 0 0 8px rgba(0,255,255,0.3); }

.time-buttons {
  display: flex; gap: 8px;
}
.time-btn {
  flex: 1; padding: 8px 4px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 8px;
  font-size: 12px; cursor: pointer; transition: all 0.2s;
}
.time-btn:hover { border-color: #00ffff; background: rgba(0,255,255,0.1); }
.time-btn.active {
  background: rgba(0,255,255,0.2); border: 1.5px solid #00ffff; color: #00ffff; font-weight: 700;
}

.hint { font-size: 11px; color: #888; margin: 0; line-height: 1.4; }

.world-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.world-actions button, .import-btn {
  padding: 8px 14px; background: rgba(255,255,255,0.06); color: #eee; border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;
  transition: all 0.2s;
}
.world-actions button:hover, .import-btn:hover { border-color: #00ffff; color: #00ffff; }
.world-actions .danger { color: #ff6b6b; border-color: rgba(255,100,100,0.3); }
.world-actions .danger:hover { background: rgba(255,50,50,0.15); border-color: #ff5555; }

.btn-close {
  padding: 11px; background: #00ffff; color: #000; border: none; border-radius: 8px;
  cursor: pointer; font-weight: 700; margin-top: 10px; transition: all 0.2s;
  box-shadow: 0 0 12px rgba(0,255,255,0.3);
}
.btn-close:hover { transform: translateY(-1px); box-shadow: 0 0 18px rgba(0,255,255,0.6); }
</style>
