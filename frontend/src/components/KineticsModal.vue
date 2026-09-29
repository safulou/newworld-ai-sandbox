<template>
  <div class="kinetics-overlay" @click.self="close">
    <div class="kinetics-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">⚙️</span>
          <div>
            <h2>體素動力學與機巧控制台 (Voxel Kinetics)</h2>
            <p class="subtitle">垂直電梯、氣密防護滑門與全自動旋轉機械結構</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="tab-row">
        <button
          :class="['tab-btn', { active: activeTab === 'elevators' }]"
          @click="activeTab = 'elevators'"
        >
          🛗 升降電梯 ({{ elevators.length }})
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'doors' }]"
          @click="activeTab = 'doors'"
        >
          🚪 氣密滑門 ({{ blastDoors.length }})
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'gears' }]"
          @click="activeTab = 'gears'"
        >
          ⚙️ 旋轉齒輪 ({{ rotaryGears.length }})
        </button>
      </div>

      <!-- Tab 1: Elevators -->
      <div v-if="activeTab === 'elevators'" class="content-section">
        <div class="cards-grid">
          <div
            v-for="el in elevators"
            :key="el.id"
            class="contraption-card"
          >
            <div class="card-header">
              <span class="card-icon">🛗</span>
              <div class="card-title-group">
                <h4>{{ el.name }}</h4>
                <span class="card-status" :class="el.state">
                  {{ el.state === 'idle' ? '⚪ 停靠就緒' : el.state === 'moving_up' ? '🔼 上升中' : '🔽 下降中' }}
                </span>
              </div>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <span class="label">高度</span>
                <span class="val">{{ Math.round(el.currentY) }}m</span>
              </div>
              <div class="spec-item">
                <span class="label">行程區間</span>
                <span class="val">{{ el.minY }}m ~ {{ el.maxY }}m</span>
              </div>
            </div>

            <button
              class="btn-trigger"
              :disabled="el.state !== 'idle'"
              @click="triggerElevator(el.id)"
            >
              {{ el.currentY <= el.minY + 1.0 ? '🔼 升往高樓頂層' : '🔽 降回底層基座' }}
            </button>
          </div>
        </div>

        <div class="add-bar">
          <button class="btn-add" @click="spawnElevator">
            ➕ 於玩家周圍部署新升降電梯
          </button>
        </div>
      </div>

      <!-- Tab 2: Blast Doors -->
      <div v-else-if="activeTab === 'doors'" class="content-section">
        <div class="cards-grid">
          <div
            v-for="door in blastDoors"
            :key="door.id"
            class="contraption-card"
          >
            <div class="card-header">
              <span class="card-icon">🚪</span>
              <div class="card-title-group">
                <h4>{{ door.name }}</h4>
                <span class="card-status" :class="{ on: door.openProgress > 0.5 }">
                  {{ door.openProgress > 0.5 ? '🟢 氣密開啟' : '🔒 加壓緊閉' }}
                </span>
              </div>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <span class="label">座標</span>
                <span class="val">[{{ door.x }}, {{ door.y }}, {{ door.z }}]</span>
              </div>
              <div class="spec-item">
                <span class="label">感應模式</span>
                <span class="val">⚡ 3.8m 人體接近自動</span>
              </div>
            </div>
          </div>
        </div>

        <div class="add-bar">
          <button class="btn-add" @click="spawnDoor">
            ➕ 部署新氣密防護滑門
          </button>
        </div>
      </div>

      <!-- Tab 3: Rotary Gears -->
      <div v-else class="content-section">
        <div class="cards-grid">
          <div
            v-for="gear in rotaryGears"
            :key="gear.id"
            class="contraption-card"
          >
            <div class="card-header">
              <span class="card-icon">⚙️</span>
              <div class="card-title-group">
                <h4>{{ gear.name }}</h4>
                <span class="card-status on">🌀 旋轉中</span>
              </div>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <span class="label">轉速</span>
                <span class="val">{{ gear.rpm }} RPM</span>
              </div>
              <div class="spec-item">
                <span class="label">座標</span>
                <span class="val">[{{ gear.x }}, {{ gear.y }}, {{ gear.z }}]</span>
              </div>
            </div>
          </div>
        </div>

        <div class="add-bar">
          <button class="btn-add" @click="spawnGear">
            ➕ 部署新旋轉動力齒輪
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  voxelKinetics,
  ElevatorEntity,
  BlastDoorEntity,
  RotaryGearEntity
} from '@/engine/voxelKinetics'

const ui = useUIStore()

const activeTab = ref<'elevators' | 'doors' | 'gears'>('elevators')
const elevators = ref<ElevatorEntity[]>([...voxelKinetics.elevators])
const blastDoors = ref<BlastDoorEntity[]>([...voxelKinetics.blastDoors])
const rotaryGears = ref<RotaryGearEntity[]>([...voxelKinetics.rotaryGears])

let pollTimer: number | null = null

onMounted(() => {
  pollTimer = window.setInterval(() => {
    elevators.value = [...voxelKinetics.elevators]
    blastDoors.value = [...voxelKinetics.blastDoors]
    rotaryGears.value = [...voxelKinetics.rotaryGears]
  }, 100)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function triggerElevator(id: string): void {
  voxelKinetics.triggerElevator(id)
}

function spawnElevator(): void {
  const x = Math.round(Math.random() * 20 - 10)
  voxelKinetics.addElevator(x, 5, 22, `高能升降梯 #${elevators.value.length + 1}`)
  elevators.value = [...voxelKinetics.elevators]
  ui.setBuildStatus('🛗 已在空間中部署全新垂直升降梯！')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function spawnDoor(): void {
  const x = Math.round(Math.random() * 20 - 10)
  voxelKinetics.addBlastDoor(x, 5, 5, 'z', `防護氣密閘門 #${blastDoors.value.length + 1}`)
  blastDoors.value = [...voxelKinetics.blastDoors]
  ui.setBuildStatus('🚪 已部署全新全息氣密防護滑門！')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function spawnGear(): void {
  const x = Math.round(Math.random() * 20 - 10)
  voxelKinetics.addRotaryGear(x, 7, 10, 30, `動力發電機齒輪 #${rotaryGears.value.length + 1}`)
  rotaryGears.value = [...voxelKinetics.rotaryGears]
  ui.setBuildStatus('⚙️ 已部署全新量子動力齒輪！')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.kinetics-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;
}

.kinetics-modal {
  width: 95%;
  max-width: 800px;
  background: rgba(10, 16, 32, 0.96);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.15);
  padding: 24px;
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #00ffff);
}

.modal-header h2 {
  font-size: 1.35rem;
  margin: 0;
  background: linear-gradient(135deg, #00ffff, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  font-size: 1.2rem;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(255, 60, 60, 0.2);
  color: #ff6b6b;
}

.tab-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(0, 255, 255, 0.15);
  border-color: #00ffff;
  color: #00ffff;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
  max-height: 360px;
  overflow-y: auto;
}

.contraption-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.card-icon {
  font-size: 1.8rem;
}

.card-title-group h4 {
  margin: 0;
  font-size: 0.95rem;
}

.card-status {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 3px;
  background: rgba(255, 255, 255, 0.1);
}

.card-status.on {
  color: #39ff14;
  background: rgba(57, 255, 20, 0.15);
}

.card-status.moving_up, .card-status.moving_down {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.2);
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 8px;
  font-size: 0.8rem;
  margin-bottom: 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-item .label {
  color: #64748b;
  font-size: 0.72rem;
}

.btn-trigger {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #00ffff, #10b981);
  color: #050b14;
  font-weight: 700;
  cursor: pointer;
  margin-top: auto;
  transition: all 0.2s;
}

.btn-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-bar {
  display: flex;
  justify-content: flex-end;
}

.btn-add {
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid #00ffff;
  color: #00ffff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: rgba(0, 255, 255, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 680px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
