<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="rift-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🕳️</span>
          <h2>量子暗物質時空裂隙探索 (Quantum Dark Matter Rifts)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="rift-content">
        <!-- Frequency Tuning & Stability Bar -->
        <div class="tuning-bar glass-panel">
          <div class="freq-dial">
            <span class="freq-label">📡 量子相位調諧頻率:</span>
            <span class="freq-display">{{ stats.currentFrequencyMHz }} MHz</span>
            <div class="freq-steppers">
              <button class="step-btn" @click="adjustFrequency(-50)">-50</button>
              <button class="step-btn" @click="adjustFrequency(-5)">-5</button>
              <button class="step-btn" @click="adjustFrequency(5)">+5</button>
              <button class="step-btn" @click="adjustFrequency(50)">+50</button>
            </div>
          </div>

          <div class="stability-box">
            <div class="stab-info">
              <span>🌀 空間裂隙穩定度:</span>
              <span class="stab-val" :style="{ color: stabilityColor }">{{ stats.riftStability }}%</span>
            </div>
            <div class="stab-bar">
              <div class="stab-fill" :style="{ width: `${stats.riftStability}%`, background: stabilityColor }"></div>
            </div>
          </div>
        </div>

        <!-- Dimension Select Grid (When rift is not open) -->
        <div v-if="!stats.isRiftOpen" class="dimensions-section">
          <h3>🌌 選擇目標暗物質裂隙維度:</h3>
          <div class="dimensions-grid">
            <div
              v-for="dim in dimensionsList"
              :key="dim.id"
              class="dim-card glass-panel"
              :style="{ borderColor: dim.color }"
            >
              <div class="dim-head">
                <span class="dim-title" :style="{ color: dim.color }">{{ dim.name }}</span>
                <span class="opt-freq">🎯 共振頻率: {{ dim.optimalFrequencyMHz }} MHz</span>
              </div>
              <p class="dim-sub">{{ dim.subTitle }}</p>
              <p class="dim-desc">{{ dim.description }}</p>

              <div class="dim-info">
                <span>☢️ 環境輻射: {{ dim.ambientRadiation }} Rad/s</span>
                <div class="drops-wrap">
                  <span class="drops-label">🎁 神話掉落:</span>
                  <span v-for="d in dim.mythicDrops" :key="d" class="drop-tag">{{ d }}</span>
                </div>
              </div>

              <button
                class="open-rift-btn"
                :style="{ background: dim.color }"
                @click="openRift(dim.id)"
              >
                🌀 強行撕裂空間並進入
              </button>
            </div>
          </div>
        </div>

        <!-- In-Rift Telemetry & Mineral Harvesting (When rift is open) -->
        <div v-else class="in-rift-view glass-panel">
          <div class="rift-hazard-bar">
            <div class="hazard-stat">
              <span>🛡️ 外骨骼防護盾:</span>
              <div class="hazard-bar">
                <div class="hazard-fill shield" :style="{ width: `${(stats.suitShield / stats.maxSuitShield) * 100}%` }"></div>
              </div>
              <span>{{ Math.round(stats.suitShield) }} / {{ stats.maxSuitShield }}</span>
            </div>

            <div class="hazard-stat">
              <span>☢️ 累積環境輻射量:</span>
              <div class="hazard-bar">
                <div class="hazard-fill rad" :style="{ width: `${stats.radiationLevel}%` }"></div>
              </div>
              <span :class="{ 'rad-danger': stats.radiationLevel > 70 }">{{ Math.round(stats.radiationLevel) }}%</span>
            </div>

            <div class="coolant-actions">
              <button
                class="coolant-btn"
                :disabled="stats.coolantPacks <= 0"
                @click="useCoolant"
              >
                🧪 注入冷卻劑 (剩餘: {{ stats.coolantPacks }})
              </button>
              <button
                class="craft-coolant-btn"
                :disabled="stats.darkMatterHarvested < 50"
                @click="craftCoolant"
              >
                🛠️ 合成冷卻劑 (50 暗物質)
              </button>
              <button class="exit-btn" @click="exitRift">
                🚪 關閉裂隙折返
              </button>
            </div>
          </div>

          <!-- Interactive Mineral Nodes -->
          <div class="nodes-section">
            <h4>⛏️ 裂隙維度可採集神話節點:</h4>
            <div class="nodes-grid">
              <div
                v-for="node in mineralNodes"
                :key="node.id"
                class="node-card glass-panel"
                :class="{ extracted: node.extracted }"
              >
                <div class="node-icon">{{ node.icon }}</div>
                <div class="node-meta">
                  <h5>{{ node.name }}</h5>
                  <div class="node-bar">
                    <div class="node-fill" :style="{ width: `${node.integrity}%` }"></div>
                  </div>
                  <span class="integ-text">構造完整度: {{ node.integrity }}%</span>
                </div>
                <button
                  class="harvest-btn"
                  :disabled="node.extracted"
                  @click="extractNode(node.id)"
                >
                  {{ node.extracted ? '✓ 已採掘' : '⚡ 脈衝開採' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Asset Counter & Status -->
        <div class="assets-footer glass-panel">
          <div class="asset-item">
            <span>🌌 暗物質微胞:</span>
            <strong>{{ stats.darkMatterHarvested }}</strong>
          </div>
          <div class="asset-item">
            <span>💎 四維時間晶石:</span>
            <strong>{{ stats.timeCrystalsHarvested }}</strong>
          </div>
          <div class="asset-item">
            <span>🔮 奇異點/零點核:</span>
            <strong>{{ stats.coresExtracted }}</strong>
          </div>
          <div class="asset-item">
            <span>🌀 穩固裂隙次數:</span>
            <strong>{{ stats.totalRiftsStabilized }} 次</strong>
          </div>
          <div class="status-msg">
            {{ stats.statusMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  darkMatterRifts,
  RIFT_DIMENSIONS,
  type RiftDimensionId
} from '@/engine/darkMatterRifts'

const ui = useUIStore()
const engine = darkMatterRifts
const stats = engine.stats
const mineralNodes = engine.mineralNodes
const dimensionsList = Object.values(RIFT_DIMENSIONS)

const stabilityColor = computed(() => {
  if (stats.riftStability >= 80) return '#00e676'
  if (stats.riftStability >= 40) return '#ffd600'
  return '#ff5252'
})

function close(): void {
  ui.closeOverlay()
}

function adjustFrequency(delta: number): void {
  engine.setFrequency(stats.currentFrequencyMHz + delta)
}

function openRift(dimId: RiftDimensionId): void {
  engine.stabilizeAndOpenRift(dimId)
}

function exitRift(): void {
  engine.exitRift()
}

function extractNode(id: string): void {
  engine.extractMineralNode(id)
}

function useCoolant(): void {
  engine.useCoolantPack()
}

function craftCoolant(): void {
  engine.craftCoolantPack()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.rift-modal {
  width: 92vw;
  max-width: 960px;
  max-height: 88vh;
  background: rgba(12, 10, 24, 0.95);
  border: 1px solid rgba(189, 0, 255, 0.4);
  box-shadow: 0 0 35px rgba(189, 0, 255, 0.25);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: #ede7f6;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(189, 0, 255, 0.25);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.8rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #e040fb;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ce93d8;
  font-size: 1.4rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff5252;
}

.rift-content {
  padding: 18px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tuning-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(25, 15, 45, 0.6);
  border: 1px solid rgba(189, 0, 255, 0.3);
  border-radius: 8px;
  padding: 14px 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.freq-dial {
  display: flex;
  align-items: center;
  gap: 12px;
}

.freq-label {
  font-size: 0.9rem;
  color: #d1c4e9;
}

.freq-display {
  font-size: 1.3rem;
  font-weight: 700;
  color: #00e5ff;
  font-family: monospace;
}

.freq-steppers {
  display: flex;
  gap: 6px;
}

.step-btn {
  background: rgba(189, 0, 255, 0.2);
  border: 1px solid #ba68c8;
  color: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.step-btn:hover {
  background: rgba(189, 0, 255, 0.4);
}

.stability-box {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stab-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.stab-val {
  font-weight: 700;
}

.stab-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.stab-fill {
  height: 100%;
  transition: width 0.3s;
}

.dimensions-section h3 {
  margin: 0 0 12px;
  font-size: 1.05rem;
  color: #e1bee7;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.dim-card {
  background: rgba(18, 12, 34, 0.7);
  border: 1px solid;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dim-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dim-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.opt-freq {
  font-size: 0.8rem;
  color: #80deea;
}

.dim-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #b39ddb;
}

.dim-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #d1c4e9;
  line-height: 1.35;
}

.dim-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  color: #ffcc80;
}

.drops-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.drop-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #e0f7fa;
}

.open-rift-btn {
  margin-top: auto;
  border: none;
  color: #fff;
  border-radius: 6px;
  padding: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.open-rift-btn:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.in-rift-view {
  background: rgba(15, 10, 30, 0.8);
  border: 1px solid rgba(189, 0, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rift-hazard-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.hazard-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.hazard-bar {
  width: 120px;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.hazard-fill.shield {
  height: 100%;
  background: #00e5ff;
}

.hazard-fill.rad {
  height: 100%;
  background: #ff5252;
}

.rad-danger {
  color: #ff1744;
  font-weight: 700;
}

.coolant-actions {
  display: flex;
  gap: 8px;
}

.coolant-btn {
  background: #00c853;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.craft-coolant-btn {
  background: #7c4dff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.exit-btn {
  background: #d50000;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.nodes-section h4 {
  margin: 0 0 10px;
  font-size: 0.95rem;
  color: #b39ddb;
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.node-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-card.extracted {
  opacity: 0.5;
  border-color: #78909c;
}

.node-icon {
  font-size: 1.8rem;
}

.node-meta h5 {
  margin: 0 0 4px;
  font-size: 0.9rem;
  color: #e0f7fa;
}

.node-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.node-fill {
  height: 100%;
  background: #ffd600;
}

.integ-text {
  font-size: 0.75rem;
  color: #b0bec5;
}

.harvest-btn {
  background: rgba(0, 229, 255, 0.2);
  border: 1px solid #00e5ff;
  color: #00e5ff;
  border-radius: 6px;
  padding: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.harvest-btn:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.4);
}

.harvest-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.assets-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  background: rgba(20, 15, 35, 0.6);
  border: 1px solid rgba(189, 0, 255, 0.25);
  border-radius: 8px;
  padding: 12px 18px;
}

.asset-item {
  display: flex;
  gap: 6px;
  font-size: 0.85rem;
}

.asset-item strong {
  color: #69f0ae;
}

.status-msg {
  width: 100%;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #b388ff;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 6px;
}
</style>
