<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="mind-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🧬</span>
          <h2>量子神經意識克隆與移魂網絡 (Neural Consciousness & Mind Transfer)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="mind-content">
        <!-- Top Telemetry Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">🧠</span>
            <div>
              <span class="t-label">意識共振同調率:</span>
              <span class="t-val highlight">{{ stats.syncRate }}%</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">💎</span>
            <div>
              <span class="t-label">意識記憶碎片:</span>
              <span class="t-val shard-val">{{ stats.memoryShards }} 枚</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">⚡</span>
            <div>
              <span class="t-label">已同調神經突觸:</span>
              <span class="t-val">{{ stats.totalNodesUnlocked }} / {{ nodes.length }}</span>
            </div>
          </div>
          <div class="tele-item harvest-item">
            <button class="harvest-btn" @click="harvestShards">
              🧘 神經冥想沉思 (+25 碎片)
            </button>
          </div>
        </div>

        <!-- Status Message Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">💡</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- Section 1: Physical / Synthetic Vessels Deck -->
        <div class="vessels-section">
          <h3 class="section-title">🤖 意識物理載體 (Active & Standby Vessels)</h3>
          <div class="vessels-grid">
            <div
              v-for="v in vesselsList"
              :key="v.id"
              class="vessel-card glass-panel"
              :class="{ active: v.id === stats.activeVessel }"
              :style="{ borderColor: v.id === stats.activeVessel ? v.color : 'rgba(255, 255, 255, 0.12)' }"
            >
              <div class="vessel-header">
                <span class="vessel-type" :style="{ color: v.color }">{{ v.type }}</span>
                <span v-if="v.id === stats.activeVessel" class="active-badge" :style="{ background: v.color }">
                  當前主意識
                </span>
              </div>
              <h4 class="vessel-name">{{ v.name }}</h4>
              <p class="vessel-perk">{{ v.perkDescription }}</p>

              <div class="vessel-specs">
                <span>護甲加成: <strong>+{{ v.armorBonus }}</strong></span>
                <span>機動倍率: <strong>{{ v.speedMultiplier }}x</strong></span>
              </div>

              <button
                v-if="v.id !== stats.activeVessel"
                class="transfer-btn"
                :style="{ borderColor: v.color, color: v.color }"
                @click="transferMind(v.id)"
              >
                🔄 執行意識移魂注入
              </button>
              <div v-else class="vessel-active-indicator" :style="{ color: v.color }">
                ✓ 意識矩陣穩定載入中
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Neural Synapse Skill Trees -->
        <div class="synapse-section">
          <div class="synapse-header">
            <h3 class="section-title">🌌 神經意識突觸進化矩陣 (Synaptic Evolution Trees)</h3>
            <!-- Category Filter Tabs -->
            <div class="tree-tabs">
              <button
                v-for="tab in treeTabs"
                :key="tab.id"
                class="tab-btn"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.icon }} {{ tab.name }}
              </button>
            </div>
          </div>

          <!-- Synaptic Node Cards Grid -->
          <div class="nodes-grid">
            <div
              v-for="node in filteredNodes"
              :key="node.id"
              class="node-card glass-panel"
              :class="{ unlocked: node.isUnlocked, locked: !node.isUnlocked }"
            >
              <div class="node-top">
                <span class="node-tier">Tier {{ node.tier }}</span>
                <span class="node-buff">{{ node.statBuff }}</span>
              </div>
              <h4 class="node-name">{{ node.name }}</h4>
              <p class="node-desc">{{ node.description }}</p>

              <div class="node-action">
                <span v-if="node.isUnlocked" class="unlocked-tag">
                  ✓ 突觸已同調
                </span>
                <button
                  v-else
                  class="unlock-btn"
                  :disabled="stats.memoryShards < node.shardCost"
                  @click="unlockSynapse(node.id)"
                >
                  ⚡ 同調解鎖 ({{ node.shardCost }} 碎片)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  neuralConsciousness,
  NEURAL_VESSELS,
  SkillTreeId,
  VesselId
} from '../engine/neuralConsciousness'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)
const activeTab = ref<SkillTreeId | 'all'>('all')

const treeTabs: { id: SkillTreeId | 'all'; name: string; icon: string }[] = [
  { id: 'all', name: '全部天賦', icon: '🌐' },
  { id: 'cyber_netrunner', name: '網絡行者', icon: '💻' },
  { id: 'stellar_pilot', name: '恆星導航', icon: '🚀' },
  { id: 'voxel_architect', name: '體素工匠', icon: '🏗️' },
  { id: 'psionic_resonance', name: '心靈共振', icon: '🔮' }
]

const stats = computed(() => {
  void refreshTrigger.value
  return neuralConsciousness.stats
})

const nodes = computed(() => {
  void refreshTrigger.value
  return neuralConsciousness.nodes
})

const vesselsList = computed(() => {
  void refreshTrigger.value
  return Object.values(NEURAL_VESSELS)
})

const filteredNodes = computed(() => {
  void refreshTrigger.value
  if (activeTab.value === 'all') {
    return neuralConsciousness.nodes
  }
  return neuralConsciousness.nodes.filter(n => n.treeId === activeTab.value)
})

function close(): void {
  ui.closeOverlay()
}

function transferMind(vesselId: VesselId): void {
  neuralConsciousness.transferMindTo(vesselId)
  refreshTrigger.value += 1
}

function unlockSynapse(nodeId: string): void {
  neuralConsciousness.unlockNode(nodeId)
  refreshTrigger.value += 1
}

function harvestShards(): void {
  neuralConsciousness.harvestMemoryShards(25)
  refreshTrigger.value += 1
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.mind-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(14, 18, 30, 0.95);
  border: 1px solid rgba(0, 229, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(22, 28, 48, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.25);
  background: rgba(0, 229, 255, 0.06);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title h2 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #00e5ff;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #00e5ff;
}

.mind-content {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Telemetry Bar */
.telemetry-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.tele-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-icon {
  font-size: 1.3rem;
}

.t-label {
  font-size: 0.76rem;
  color: #889;
  display: block;
}

.t-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.t-val.highlight {
  color: #00e5ff;
}

.shard-val {
  color: #bd00ff;
  text-shadow: 0 0 6px rgba(189, 0, 255, 0.4);
}

.harvest-btn {
  background: linear-gradient(135deg, #00b0ff, #00e5ff);
  color: #0a1120;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.harvest-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

/* Status Banner */
.status-banner {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.25);
  font-size: 0.82rem;
  color: #e0f7fa;
}

/* Section Title */
.section-title {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

/* Vessels Deck */
.vessels-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .vessels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.vessel-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s;
  background: rgba(18, 24, 40, 0.7);
}

.vessel-card.active {
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
  background: rgba(18, 28, 48, 0.9);
}

.vessel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vessel-type {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.active-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: #050a12;
  padding: 2px 6px;
  border-radius: 10px;
}

.vessel-name {
  margin: 2px 0 0 0;
  font-size: 0.86rem;
  font-weight: 600;
  color: #fff;
}

.vessel-perk {
  font-size: 0.72rem;
  color: #889;
  line-height: 1.3;
  min-height: 38px;
  margin: 0;
}

.vessel-specs {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #9ab;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.transfer-btn {
  margin-top: 6px;
  background: transparent;
  border: 1px solid;
  border-radius: 5px;
  padding: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.transfer-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.vessel-active-indicator {
  margin-top: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  padding: 5px;
}

/* Synapse Section */
.synapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.tree-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: #9ab;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(0, 229, 255, 0.18);
  border-color: #00e5ff;
  color: #00e5ff;
  font-weight: 600;
}

/* Nodes Grid */
.nodes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .nodes-grid {
    grid-template-columns: 1fr;
  }
}

.node-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.node-card.unlocked {
  border-color: rgba(0, 255, 136, 0.4);
  background: rgba(0, 255, 136, 0.06);
}

.node-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-tier {
  font-size: 0.7rem;
  color: #889;
  text-transform: uppercase;
}

.node-buff {
  font-size: 0.72rem;
  font-weight: 700;
  color: #00ff88;
  background: rgba(0, 255, 136, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
}

.node-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.node-desc {
  margin: 0;
  font-size: 0.72rem;
  color: #889;
  line-height: 1.3;
  min-height: 34px;
}

.node-action {
  margin-top: auto;
  padding-top: 6px;
}

.unlocked-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #00ff88;
}

.unlock-btn {
  width: 100%;
  padding: 6px;
  background: rgba(0, 229, 255, 0.15);
  border: 1px solid #00e5ff;
  border-radius: 5px;
  color: #00e5ff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.unlock-btn:hover:not(:disabled) {
  background: #00e5ff;
  color: #06101c;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

.unlock-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.2);
  color: #889;
}
</style>
