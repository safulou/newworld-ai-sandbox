<template>
  <div class="overlay" @click.self="close">
    <div class="drydock-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🚀</span>
          <h2>軌道空間站與模組化星艦造船塢 (Orbital Drydock)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Left: Starship Assembly & Parts Picker -->
        <div class="col-assembly">
          <div class="card-box">
            <div class="subhead">
              <span>🛠️ 模組化星艦裝配台</span>
              <input
                v-model="starshipName"
                class="name-input"
                placeholder="星艦名稱..."
                @change="updateName"
              />
            </div>

            <!-- Slots Matrix -->
            <div class="slots-container">
              <div
                v-for="slotKey in slots"
                :key="slotKey"
                class="slot-card"
                :class="{ active: activeSlot === slotKey }"
                @click="activeSlot = slotKey"
              >
                <div class="slot-badge">{{ getSlotLabel(slotKey) }}</div>
                <div class="part-name">{{ getSelectedPartName(slotKey) }}</div>
                <div class="part-color-bar" :style="{ backgroundColor: getSelectedPartColor(slotKey) }"></div>
              </div>
            </div>

            <!-- Available Parts in Active Slot -->
            <div class="parts-picker">
              <div class="picker-title">可選裝配模組 - {{ getSlotLabel(activeSlot) }}</div>
              <div class="parts-list">
                <div
                  v-for="part in partsForSlot"
                  :key="part.id"
                  class="part-item"
                  :class="{ selected: starship[activeSlot] === part.id }"
                  @click="selectPart(activeSlot, part.id)"
                >
                  <div class="part-top">
                    <span class="p-name" :style="{ color: part.color }">{{ part.name }}</span>
                    <span class="p-tier">T{{ part.tier }}</span>
                  </div>
                  <div class="p-desc">{{ part.description }}</div>
                  <div class="p-stats">
                    <span v-if="part.hullBonus !== 0">裝甲 {{ part.hullBonus > 0 ? '+' : '' }}{{ part.hullBonus }}</span>
                    <span v-if="part.speedBonus !== 0">航速 {{ part.speedBonus > 0 ? '+' : '' }}{{ part.speedBonus }}</span>
                    <span v-if="part.shieldBonus !== 0">護盾 +{{ part.shieldBonus }}</span>
                    <span v-if="part.warpBonus !== 0">躍遷 +{{ part.warpBonus }}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Telemetry & Flight Bay -->
        <div class="col-flight">
          <!-- Starship Stats Card -->
          <div class="card-box">
            <div class="subhead">📊 星艦綜合計測</div>
            <div class="stats-grid">
              <div class="stat-pill">
                <span class="stat-label">艦體裝甲 (Hull)</span>
                <span class="stat-val hull">{{ stats.hull }} HP</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">巡航航速 (Speed)</span>
                <span class="stat-val speed">{{ stats.speed }} m/s</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">偏光護盾 (Shield)</span>
                <span class="stat-val shield">{{ stats.shield }} MW</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">曲率躍遷 (Warp)</span>
                <span class="stat-val warp">{{ stats.warpFactor }}c</span>
              </div>
            </div>
          </div>

          <!-- Orbital Telemetry & Zero-G Controls -->
          <div class="card-box">
            <div class="subhead">🛰️ 空間站氣閘與微重力遙測</div>
            <div class="telemetry-rows">
              <div class="tele-item">
                <span>軌道高度 (Y)：</span>
                <span class="tele-val">{{ Math.round(orbitalAltitude) }} m (低軌道)</span>
              </div>
              <div class="tele-item">
                <span>重力環境狀態：</span>
                <span class="tele-val" :class="isZeroG ? 'status-zero' : 'status-norm'">
                  {{ isZeroG ? '🌌 微重力漂移 (Zero-G)' : '🌍 站內人工重力 (1.0G)' }}
                </span>
              </div>
              <div class="tele-item">
                <span>氣閘氣壓狀態：</span>
                <span class="tele-val">{{ airlockPressure }}% ({{ airlockPressure > 50 ? '大氣密封' : '真空減壓' }})</span>
              </div>
              <div class="tele-item">
                <span>船塢泊位狀態：</span>
                <span class="tele-val bay-status">{{ getBayStatusLabel() }}</span>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="action-grid">
              <button
                class="btn-act airlock-btn"
                :disabled="isCycling"
                @click="cycleAirlock"
              >
                {{ isCycling ? '💨 氣閘排氣增壓中...' : (airlockPressure > 50 ? '🚪 氣閘減壓排氣 (出艙)' : '🚪 氣閘加壓充氣 (回艙)') }}
              </button>

              <button
                class="btn-act rcs-btn"
                @click="triggerRcs"
              >
                💨 RCS 姿態噴氣脈衝
              </button>

              <button
                v-if="bayStatus === 'docked'"
                class="btn-act launch-btn"
                @click="launchStarship"
              >
                🚀 出塢星艦航行測試
              </button>
              <button
                v-else-if="bayStatus === 'orbiting'"
                class="btn-act dock-btn"
                @click="dockStarship"
              >
                ⚓ 引導返航入塢泊定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as THREE from 'three'
import {
  orbitalDrydock,
  STARSHIP_PARTS_CATALOG,
  StarshipConfig
} from '@/engine/orbitalDrydock'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

type SlotKey = keyof Omit<StarshipConfig, 'name'>
const slots: SlotKey[] = ['cockpit', 'thruster', 'wing', 'warp', 'shield']
const activeSlot = ref<SlotKey>('cockpit')

const starship = ref(orbitalDrydock.starship)
const starshipName = ref(orbitalDrydock.starship.name)
const stats = ref(orbitalDrydock.getStarshipStats())

const isZeroG = ref(orbitalDrydock.isZeroGActive)
const airlockPressure = ref(orbitalDrydock.airlockPressure)
const isCycling = ref(orbitalDrydock.isAirlockCycling)
const orbitalAltitude = ref(orbitalDrydock.orbitalAltitude)
const bayStatus = ref(orbitalDrydock.dockingBayStatus)

const partsForSlot = computed(() => {
  return STARSHIP_PARTS_CATALOG.filter(p => p.slot === activeSlot.value)
})

function getSlotLabel(slot: SlotKey): string {
  switch (slot) {
    case 'cockpit': return '指揮座艙'
    case 'thruster': return '推進主機'
    case 'wing': return '等離子光翼'
    case 'warp': return '躍遷折躍環'
    case 'shield': return '偏光防護盾'
  }
}

function getSelectedPartName(slot: SlotKey): string {
  const partId = starship.value[slot]
  const part = STARSHIP_PARTS_CATALOG.find(p => p.id === partId)
  return part ? part.name : '未安裝'
}

function getSelectedPartColor(slot: SlotKey): string {
  const partId = starship.value[slot]
  const part = STARSHIP_PARTS_CATALOG.find(p => p.id === partId)
  return part ? part.color : '#666'
}

function selectPart(slot: SlotKey, partId: string): void {
  orbitalDrydock.setPart(slot, partId)
  starship.value = { ...orbitalDrydock.starship }
  stats.value = orbitalDrydock.getStarshipStats()
}

function updateName(): void {
  orbitalDrydock.setStarshipName(starshipName.value)
}

function cycleAirlock(): void {
  isCycling.value = true
  orbitalDrydock.cycleAirlock(() => {
    isCycling.value = false
    airlockPressure.value = orbitalDrydock.airlockPressure
    isZeroG.value = orbitalDrydock.isZeroGActive
  })
  const timer = setInterval(() => {
    airlockPressure.value = orbitalDrydock.airlockPressure
    if (!orbitalDrydock.isAirlockCycling) {
      clearInterval(timer)
    }
  }, 100)
}

function triggerRcs(): void {
  orbitalDrydock.triggerRcsBurst(new THREE.Vector3(0, 0, -1))
}

function launchStarship(): void {
  orbitalDrydock.launchStarship()
  bayStatus.value = 'launching'
  setTimeout(() => {
    bayStatus.value = orbitalDrydock.dockingBayStatus
    isZeroG.value = orbitalDrydock.isZeroGActive
    airlockPressure.value = orbitalDrydock.airlockPressure
  }, 2600)
}

function dockStarship(): void {
  orbitalDrydock.dockStarship()
  bayStatus.value = 're-entering'
  setTimeout(() => {
    bayStatus.value = orbitalDrydock.dockingBayStatus
  }, 2100)
}

function getBayStatusLabel(): string {
  switch (bayStatus.value) {
    case 'docked': return '🟢 已在塢泊定 (Docked)'
    case 'launching': return '🟡 推進離塢程序中...'
    case 'orbiting': return '🌌 軌道自由航行中'
    case 're-entering': return '🟠 返航減速入塢中...'
  }
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(4, 6, 14, 0.85);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(10px);
}
.drydock-panel {
  width: 960px; max-width: 95vw; max-height: 90vh;
  background: rgba(10, 14, 26, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  display: flex; flex-direction: column; overflow: hidden;
}
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid rgba(0, 255, 255, 0.15);
  background: rgba(0, 255, 255, 0.05);
}
.title-area { display: flex; align-items: center; gap: 10px; }
.title-area h2 { font-size: 18px; color: #00ffff; font-weight: 700; margin: 0; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #ff0055; }

.content-body {
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px;
  padding: 20px; overflow-y: auto;
}

.card-box {
  background: rgba(14, 20, 36, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; padding: 16px; margin-bottom: 16px;
}
.subhead {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 14px; font-weight: 700; color: #00e5ff; margin-bottom: 12px;
}
.name-input {
  background: rgba(0,0,0,0.5); border: 1px solid rgba(0,255,255,0.4);
  color: #fff; border-radius: 6px; padding: 4px 8px; font-size: 12px; width: 180px;
}

.slots-container {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 16px;
}
.slot-card {
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px; padding: 8px; text-align: center; cursor: pointer;
  transition: all 0.2s; position: relative;
}
.slot-card.active {
  border-color: #00ffff; background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}
.slot-badge { font-size: 11px; color: rgba(255,255,255,0.7); }
.part-name { font-size: 12px; font-weight: 600; margin: 4px 0; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.part-color-bar { height: 3px; border-radius: 2px; }

.parts-picker { margin-top: 10px; }
.picker-title { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
.parts-list { display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto; }
.part-item {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;
}
.part-item:hover { border-color: #00ffff; background: rgba(0, 255, 255, 0.05); }
.part-item.selected { border-color: #00ff88; background: rgba(0, 255, 136, 0.1); }
.part-top { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; }
.p-tier { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px; }
.p-desc { font-size: 11px; color: rgba(255,255,255,0.6); margin: 4px 0; }
.p-stats { display: flex; gap: 10px; font-size: 11px; color: #00ffcc; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stat-pill {
  background: rgba(0,0,0,0.4); border-radius: 8px; padding: 10px;
  display: flex; flex-direction: column; gap: 4px;
}
.stat-label { font-size: 11px; color: rgba(255,255,255,0.6); }
.stat-val { font-size: 15px; font-weight: 700; }
.stat-val.hull { color: #ffaa00; }
.stat-val.speed { color: #00ffff; }
.stat-val.shield { color: #00ff88; }
.stat-val.warp { color: #ff00ff; }

.telemetry-rows { display: flex; flex-direction: column; gap: 8px; font-size: 12px; margin-bottom: 14px; }
.tele-item { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px; }
.tele-val { font-weight: 600; color: #fff; }
.tele-val.status-zero { color: #00ffff; text-shadow: 0 0 6px rgba(0,255,255,0.5); }
.tele-val.status-norm { color: #00ff88; }
.tele-val.bay-status { color: #ffcc00; }

.action-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
.btn-act {
  background: rgba(0, 255, 255, 0.15); border: 1px solid #00ffff;
  color: #00ffff; border-radius: 6px; padding: 8px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-act:hover:not(:disabled) {
  background: #00ffff; color: #000; box-shadow: 0 0 12px rgba(0,255,255,0.5);
}
.btn-act:disabled { opacity: 0.5; cursor: not-allowed; }
.rcs-btn { border-color: #00ff88; color: #00ff88; }
.rcs-btn:hover:not(:disabled) { background: #00ff88; color: #000; }
.launch-btn { border-color: #ff00aa; color: #ff00aa; }
.launch-btn:hover:not(:disabled) { background: #ff00aa; color: #000; }
.dock-btn { border-color: #ffaa00; color: #ffaa00; }
.dock-btn:hover:not(:disabled) { background: #ffaa00; color: #000; }
</style>
