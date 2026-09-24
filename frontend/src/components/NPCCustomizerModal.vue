<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel customizer-modal">
      <div class="modal-header">
        <div class="title-wrap">
          <h2>🤖 賽博 AI 伴侶換裝工作室 (NPC Studio)</h2>
          <span class="sub-badge">Accessories & Personality</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- NPC Selector Tabs -->
      <div class="npc-tabs">
        <button
          v-for="npc in npcList"
          :key="npc.id"
          :class="['npc-tab', { active: currentNpcId === npc.id }]"
          @click="selectNPC(npc.id)"
        >
          <span class="npc-icon">{{ npc.icon }}</span>
          <span class="npc-name">{{ npc.name }}</span>
        </button>
      </div>

      <div class="modal-body">
        <!-- Left: Customization Options -->
        <div class="controls-panel">
          <!-- Color Schemes -->
          <div class="control-section">
            <label class="section-title">🎨 發光等離子色彩 (Plasma Glow)：</label>
            <div class="color-palette">
              <button
                v-for="c in colorOptions"
                :key="c.hex"
                class="color-dot"
                :style="{ background: c.hex, boxShadow: activeConfig.glowColor === c.hex ? `0 0 10px ${c.hex}` : 'none' }"
                :class="{ active: activeConfig.glowColor === c.hex }"
                @click="activeConfig.glowColor = c.hex"
                :title="c.name"
              ></button>
            </div>
          </div>

          <!-- Wings / Back Accessories -->
          <div class="control-section">
            <label class="section-title">🕊️ 背部推進配件 (Back Wings)：</label>
            <div class="options-grid">
              <button
                v-for="w in wingOptions"
                :key="w.id"
                :class="['opt-btn', { active: activeConfig.wings === w.id }]"
                @click="activeConfig.wings = w.id"
              >
                {{ w.label }}
              </button>
            </div>
          </div>

          <!-- Headgear Accessories -->
          <div class="control-section">
            <label class="section-title">🥽 頭部戰術配件 (Headgear)：</label>
            <div class="options-grid">
              <button
                v-for="h in headgearOptions"
                :key="h.id"
                :class="['opt-btn', { active: activeConfig.headgear === h.id }]"
                @click="activeConfig.headgear = h.id"
              >
                {{ h.label }}
              </button>
            </div>
          </div>

          <!-- Aura Forcefields -->
          <div class="control-section">
            <label class="section-title">🛡️ 防護能量氣場 (Aura Field)：</label>
            <div class="options-grid">
              <button
                v-for="a in auraOptions"
                :key="a.id"
                :class="['opt-btn', { active: activeConfig.aura === a.id }]"
                @click="activeConfig.aura = a.id"
              >
                {{ a.label }}
              </button>
            </div>
          </div>

          <!-- Personality Preset -->
          <div class="control-section">
            <label class="section-title">🧠 性格核心設定 (Personality Core)：</label>
            <div class="options-grid">
              <button
                v-for="p in personalityOptions"
                :key="p.id"
                :class="['opt-btn', { active: activeConfig.personality === p.id }]"
                @click="activeConfig.personality = p.id"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Custom Greeting Input -->
          <div class="control-section">
            <label class="section-title">💬 自訂開拓者問候語：</label>
            <input
              type="text"
              v-model="activeConfig.customGreeting"
              class="greeting-input"
              placeholder="輸入專屬對話台詞..."
            />
          </div>
        </div>

        <!-- Right: Real-time Preset Summary & Info -->
        <div class="preview-panel">
          <div class="npc-preview-card">
            <div class="preview-avatar" :style="{ borderColor: activeConfig.glowColor }">
              <span class="big-icon">{{ currentNPCInfo?.icon }}</span>
            </div>
            <h3 class="preview-title" :style="{ color: activeConfig.glowColor }">
              {{ currentNPCInfo?.name }} · {{ currentNPCInfo?.role }}
            </h3>
            <div class="dialogue-bubble">
              "{{ activeConfig.customGreeting || '準備好開始新一輪元宇宙探險了嗎？' }}"
            </div>

            <div class="gear-summary">
              <div class="summary-row">
                <span>背部配件：</span>
                <strong>{{ getOptionLabel(wingOptions, activeConfig.wings) }}</strong>
              </div>
              <div class="summary-row">
                <span>頭部裝備：</span>
                <strong>{{ getOptionLabel(headgearOptions, activeConfig.headgear) }}</strong>
              </div>
              <div class="summary-row">
                <span>防護氣場：</span>
                <strong>{{ getOptionLabel(auraOptions, activeConfig.aura) }}</strong>
              </div>
              <div class="summary-row">
                <span>性格特質：</span>
                <strong>{{ getOptionLabel(personalityOptions, activeConfig.personality) }}</strong>
              </div>
            </div>

            <button class="save-apply-btn" @click="saveAndApply">
              💾 儲存並同步至世界
            </button>
            <span v-if="saveMessage" class="save-msg">{{ saveMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { npcCustomizer, NPCCustomConfig, NPCWingsType, NPCHeadgearType, NPCAuraType, NPCPersonality } from '@/engine/npcCustomizer'
import { npcManager } from '@/engine/npc'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const npcList = [
  { id: 'npc_guide', name: 'Nova', role: '導航領航員', icon: '🌟' },
  { id: 'npc_builder', name: 'Echo', role: '工程架構師', icon: '🔨' },
  { id: 'npc_miner', name: 'Bolt', role: '採礦工程師', icon: '⛏️' },
  { id: 'npc_merchant', name: 'Luna', role: '星際貿易商', icon: '💎' },
  { id: 'npc_drone', name: 'Sparky', role: '伴隨偵查機', icon: '🛸' },
]

const currentNpcId = ref('npc_guide')
const activeConfig = ref<NPCCustomConfig>(npcCustomizer.getConfig('npc_guide'))
const saveMessage = ref('')

const currentNPCInfo = computed(() => npcList.find(n => n.id === currentNpcId.value))

const colorOptions = [
  { name: '霓虹電光青', hex: '#00f0ff' },
  { name: '高能太陽金', hex: '#ffaa00' },
  { name: '脈衝能量紅', hex: '#ff0055' },
  { name: '量子紫羅蘭', hex: '#a371f7' },
  { name: '生化翠綠光', hex: '#00ff88' },
]

const wingOptions: { id: NPCWingsType; label: string }[] = [
  { id: 'none', label: '❌ 無' },
  { id: 'hologram_wings', label: '🕊️ 全息光翼' },
  { id: 'jetpack', label: '🚀 雙聯噴氣背包' },
  { id: 'solar_fins', label: '⚡ 太陽能翼板' },
]

const headgearOptions: { id: NPCHeadgearType; label: string }[] = [
  { id: 'none', label: '❌ 無' },
  { id: 'combat_visor', label: '🥽 戰術 HUD 眼罩' },
  { id: 'halo_crown', label: '👑 量子光環' },
  { id: 'comm_antenna', label: '📡 衛星通訊天線' },
]

const auraOptions: { id: NPCAuraType; label: string }[] = [
  { id: 'none', label: '❌ 無' },
  { id: 'plasma_shield', label: '🛡️ 電漿防護力場' },
  { id: 'quantum_sparkles', label: '✨ 量子星火環' },
  { id: 'matrix_code', label: '🟩 矩陣代碼環' },
]

const personalityOptions: { id: NPCPersonality; label: string }[] = [
  { id: 'diligent', label: '📋 認真嚴謹 (Diligent)' },
  { id: 'cheerful', label: '🎉 熱情樂觀 (Cheerful)' },
  { id: 'stoic', label: '🛡️ 冷靜寡言 (Stoic)' },
  { id: 'quirky', label: '🎭 幽默搞怪 (Quirky)' },
]

function selectNPC(id: string): void {
  currentNpcId.value = id
  activeConfig.value = npcCustomizer.getConfig(id)
  saveMessage.value = ''
}

function getOptionLabel(opts: { id: string; label: string }[], currentId: string): string {
  return opts.find(o => o.id === currentId)?.label || '預設'
}

function saveAndApply(): void {
  npcCustomizer.setConfig(activeConfig.value)

  // Apply to existing NPC in scene
  const npc = npcManager.getNPCById(currentNpcId.value)
  if (npc) {
    npcCustomizer.applyToNPCGroup(currentNpcId.value, npc.getGroup(), npc.def.isFlying)
    if (activeConfig.value.customGreeting) {
      npc.startSpeaking(activeConfig.value.customGreeting, 5)
    }
  }

  saveMessage.value = `✅ 已成功裝扮 ${currentNPCInfo.value?.name}！`
  setTimeout(() => { saveMessage.value = '' }, 2500)
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
}

.customizer-modal {
  width: 90vw;
  max-width: 920px;
  height: 82vh;
  max-height: 740px;
  background: rgba(13, 17, 23, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.35);
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #c9d1d9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: rgba(22, 27, 34, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #00f0ff;
}

.sub-badge {
  font-size: 0.72rem;
  background: rgba(0, 240, 255, 0.15);
  color: #58a6ff;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.close-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  font-size: 1.2rem;
  cursor: pointer;
}

.npc-tabs {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  background: #111620;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.npc-tab {
  background: transparent;
  border: 1px solid transparent;
  color: #8b949e;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.npc-tab.active {
  background: rgba(0, 240, 255, 0.15);
  border-color: rgba(0, 240, 255, 0.4);
  color: #00f0ff;
}

.modal-body {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.controls-panel {
  flex: 1.3;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 8px;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-size: 0.8rem;
  color: #8b949e;
  font-weight: 600;
}

.color-palette {
  display: flex;
  gap: 10px;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;
}

.color-dot.active {
  border-color: #fff;
  transform: scale(1.15);
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.opt-btn {
  background: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.opt-btn:hover {
  background: #21262d;
  border-color: #58a6ff;
}

.opt-btn.active {
  background: rgba(0, 240, 255, 0.15);
  border-color: #00f0ff;
  color: #00f0ff;
}

.greeting-input {
  background: #0d1117;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
}

/* Preview Panel */
.preview-panel {
  flex: 1;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.npc-preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  height: 100%;
}

.preview-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid #00f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1117;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
}

.big-icon {
  font-size: 2rem;
}

.preview-title {
  margin: 0;
  font-size: 1.1rem;
}

.dialogue-bubble {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #e6edf3;
  font-style: italic;
  width: 100%;
}

.gear-summary {
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #0d1117;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #21262d;
  font-size: 0.75rem;
  text-align: left;
}

.summary-row {
  display: flex;
  justify-content: space-between;
}

.summary-row span {
  color: #8b949e;
}

.summary-row strong {
  color: #58a6ff;
}

.save-apply-btn {
  margin-top: 10px;
  width: 100%;
  background: #238636;
  border: 1px solid #2ea043;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-apply-btn:hover {
  background: #2ea043;
  box-shadow: 0 0 12px rgba(46, 160, 67, 0.4);
}

.save-msg {
  font-size: 0.78rem;
  color: #00ff88;
  font-weight: bold;
}
</style>
