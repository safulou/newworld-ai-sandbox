<template>
  <div class="factory-overlay" @click.self="close">
    <div class="factory-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🏭</span>
          <div>
            <h2>自動化工業物流調度中心 (Factory Logistics)</h2>
            <p class="subtitle">體素傳送帶輸送網、光電分揀過濾與無人機全自律航線</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Factory Telemetry & Power Bar -->
      <div class="telemetry-bar">
        <div class="stat-card">
          <span class="stat-label">吞吐率 (Throughput)</span>
          <span class="stat-value highlight">{{ itemsPerMinute }} <small>件 / 分鐘</small></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">累積處理總量</span>
          <span class="stat-value">{{ totalProcessed }} <small>件</small></span>
        </div>
        <div class="stat-card">
          <span class="stat-label">電網負載</span>
          <span class="stat-value" :class="{ 'warning-load': isOverdrive }">
            {{ Math.round(powerLoadKw) }} <small>kW</small>
          </span>
        </div>
        <div class="stat-card action-card">
          <button
            :class="['overdrive-btn', { active: isOverdrive }]"
            @click="toggleOverdrive"
          >
            {{ isOverdrive ? '⚡ 超頻運轉中 (2x 速)' : '⚙️ 標準運轉 (Standard)' }}
          </button>
        </div>
      </div>

      <!-- Main Columns -->
      <div class="main-grid">
        <!-- Left: Conveyor Belts & Sorters -->
        <div class="panel-section">
          <div class="section-title">
            <span>⚙️ 傳送帶與智能分揀器 (Belts & Sorters)</span>
            <span class="badge">{{ belts.length }} 軌道 / {{ sorters.length }} 分揀器</span>
          </div>

          <!-- Add Belt Controls -->
          <div class="builder-box">
            <h4>快速部署傳送帶</h4>
            <div class="input-row">
              <input v-model.number="newBeltX" type="number" placeholder="X" />
              <input v-model.number="newBeltY" type="number" placeholder="Y" />
              <input v-model.number="newBeltZ" type="number" placeholder="Z" />
              <select v-model="newBeltDir">
                <option value="east">東 (+X)</option>
                <option value="west">西 (-X)</option>
                <option value="north">北 (-Z)</option>
                <option value="south">南 (+Z)</option>
              </select>
              <button class="primary-btn" @click="addBelt">部署</button>
            </div>
          </div>

          <!-- Active Belts List -->
          <div class="list-container">
            <div v-for="b in belts" :key="b.id" class="belt-item">
              <span class="belt-coord">[{{ b.x }}, {{ b.y }}, {{ b.z }}]</span>
              <span class="belt-dir">方向: {{ dirLabel(b.direction) }}</span>
              <span class="belt-speed">{{ b.speed.toFixed(1) }} m/s</span>
              <button class="icon-btn del-btn" @click="removeBelt(b.id)">✕</button>
            </div>
          </div>

          <!-- Sorter Status -->
          <div class="sorter-box">
            <h4>智能光電分揀站</h4>
            <div v-for="s in sorters" :key="s.id" class="sorter-card">
              <div class="sorter-header">
                <span>分揀點 [{{ s.x }}, {{ s.y }}, {{ s.z }}]</span>
                <span class="tag">篩選: {{ itemName(s.filterItemType) }}</span>
              </div>
              <div class="sorter-stats">
                <span>分流: {{ s.divertCount }} 件 (向{{ dirLabel(s.divertDirection) }})</span>
                <span>直通: {{ s.passCount }} 件</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Drone Automated Routes & Manual Dispatch -->
        <div class="panel-section">
          <div class="section-title">
            <span>🚁 無人機自律調度任務 (Drone Fleet Missions)</span>
            <span class="badge">{{ missions.length }} 自律航線</span>
          </div>

          <div class="missions-container">
            <div v-for="m in missions" :key="m.id" class="mission-card">
              <div class="mission-top">
                <span class="m-name">{{ m.name }}</span>
                <span :class="['m-status', m.status]">{{ missionStatusLabel(m.status) }}</span>
              </div>
              <div class="m-route">
                <span>{{ m.sourceName }}</span>
                <span class="arrow">➔</span>
                <span>{{ m.destName }}</span>
                <span class="m-cargo">[{{ itemName(m.cargoType) }}]</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: m.progress * 100 + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Manual Item Spawn Test -->
          <div class="test-spawn-box">
            <h4>📦 物料生成注入測試 (Test Material Injection)</h4>
            <div class="item-buttons">
              <button
                v-for="(def, key) in itemDefs"
                :key="key"
                class="item-btn"
                @click="spawnItem(key)"
              >
                <span>{{ def.icon }}</span>
                <span>{{ def.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  factoryLogistics,
  ITEM_DEFINITIONS,
  FactoryItemType,
  BeltDirection,
} from '@/engine/factoryLogistics'

const uiStore = useUIStore()

const belts = ref(factoryLogistics.belts)
const sorters = ref(factoryLogistics.sorters)
const missions = ref(factoryLogistics.missions)
const isOverdrive = ref(factoryLogistics.isOverdrive)
const totalProcessed = ref(factoryLogistics.totalItemsProcessed)
const itemsPerMinute = ref(factoryLogistics.itemsPerMinute)
const powerLoadKw = ref(factoryLogistics.getPowerLoadKw())

const newBeltX = ref(5)
const newBeltY = ref(4)
const newBeltZ = ref(0)
const newBeltDir = ref<BeltDirection>('east')

const itemDefs = ITEM_DEFINITIONS

let timer: number | null = null

function updateState() {
  belts.value = [...factoryLogistics.belts]
  sorters.value = [...factoryLogistics.sorters]
  missions.value = [...factoryLogistics.missions]
  isOverdrive.value = factoryLogistics.isOverdrive
  totalProcessed.value = factoryLogistics.totalItemsProcessed
  itemsPerMinute.value = factoryLogistics.itemsPerMinute
  powerLoadKw.value = factoryLogistics.getPowerLoadKw()
}

onMounted(() => {
  timer = window.setInterval(updateState, 200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function close() {
  uiStore.mode = 'game'
}

function toggleOverdrive() {
  factoryLogistics.setOverdrive(!factoryLogistics.isOverdrive)
  updateState()
}

function addBelt() {
  factoryLogistics.addBelt(newBeltX.value, newBeltY.value, newBeltZ.value, newBeltDir.value)
  newBeltX.value++
  updateState()
}

function removeBelt(id: string) {
  factoryLogistics.removeBelt(id)
  updateState()
}

function spawnItem(type: FactoryItemType) {
  factoryLogistics.spawnItem(type)
  updateState()
}

function dirLabel(dir: BeltDirection): string {
  switch (dir) {
    case 'east': return '東 (+X)'
    case 'west': return '西 (-X)'
    case 'north': return '北 (-Z)'
    case 'south': return '南 (+Z)'
  }
}

function itemName(type: FactoryItemType): string {
  return ITEM_DEFINITIONS[type]?.name || type
}

function missionStatusLabel(status: string): string {
  switch (status) {
    case 'flying_to_source': return '🛫 前往取貨'
    case 'loading': return '📥 裝載物資'
    case 'flying_to_dest': return '✈️ 運送巡航'
    case 'unloading': return '📤 交付入庫'
    default: return '⚪ 待命'
  }
}
</script>

<style scoped>
.factory-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.factory-modal {
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
  border-radius: 12px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  padding-bottom: 14px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00f0ff;
  margin: 0;
}

.subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.telemetry-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f1f5f9;
}

.stat-value.highlight {
  color: #00f0ff;
}

.stat-value.warning-load {
  color: #ff007f;
}

.action-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.overdrive-btn {
  width: 100%;
  height: 100%;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: #00f0ff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.overdrive-btn.active {
  background: rgba(255, 0, 127, 0.2);
  border-color: #ff007f;
  color: #ff007f;
  box-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #38bdf8;
}

.badge {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.builder-box, .sorter-box, .test-spawn-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
}

.builder-box h4, .sorter-box h4, .test-spawn-box h4 {
  font-size: 0.82rem;
  color: #cbd5e1;
  margin: 0 0 10px 0;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  width: 50px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 6px;
  font-size: 0.85rem;
}

.input-row select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 6px;
  font-size: 0.85rem;
  flex: 1;
}

.primary-btn {
  background: #00f0ff;
  border: none;
  color: #040810;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #38bdf8;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.list-container {
  max-height: 140px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.belt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
}

.del-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
}

.sorter-card {
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid #a855f7;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sorter-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.sorter-stats {
  display: flex;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.75rem;
}

.missions-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mission-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mission-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
}

.m-status {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.m-status.flying_to_source, .m-status.flying_to_dest {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

.m-status.loading, .m-status.unloading {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}

.m-route {
  font-size: 0.78rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #00f0ff;
  transition: width 0.2s linear;
}

.item-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.item-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e2e8f0;
  padding: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-btn:hover {
  background: rgba(0, 240, 255, 0.15);
  border-color: #00f0ff;
}
</style>
