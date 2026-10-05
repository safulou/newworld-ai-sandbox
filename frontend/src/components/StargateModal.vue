<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="stargate-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🌀</span>
          <h2>超空間星門躍遷航道與引力樞紐 (Hyperspace Stargate Network)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="stargate-content">
        <!-- Telemetry Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">🪐</span>
            <div>
              <span class="t-label">當前出發星門:</span>
              <span class="t-val highlight">{{ originHub.name }}</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">⚡</span>
            <div>
              <span class="t-label">星門電網儲能:</span>
              <span class="t-val">{{ stats.networkPowerKWh.toLocaleString() }} kWh</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🚀</span>
            <div>
              <span class="t-label">累計成功躍遷:</span>
              <span class="t-val">{{ stats.totalTransitsCompleted }} 次</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">💰</span>
            <div>
              <span class="t-label">累計通行費收益:</span>
              <span class="t-val toll-val">{{ stats.totalTollsEarnedCredits.toLocaleString() }} CR</span>
            </div>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">💡</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- Stargate Hubs Grid -->
        <div class="hubs-section">
          <h3 class="section-title">🌌 銀河星門終端節點 (Galactic Stargate Terminus)</h3>
          <div class="hubs-grid">
            <div
              v-for="hub in hubsList"
              :key="hub.id"
              class="hub-card glass-panel"
              :class="{
                'is-origin': hub.id === stats.activeOrigin,
                'is-target': hub.id === stats.targetDestination,
                'is-active': hub.status === 'active_open'
              }"
              :style="{ borderColor: hub.id === stats.targetDestination ? hub.color : 'rgba(255, 255, 255, 0.12)' }"
              @click="selectDestination(hub.id)"
            >
              <div class="hub-header">
                <span class="hub-sector" :style="{ color: hub.color }">{{ hub.galaxySector }}</span>
                <span v-if="hub.id === stats.activeOrigin" class="status-tag origin">出發地</span>
                <span v-else-if="hub.id === stats.targetDestination" class="status-tag target">目標星門</span>
                <span v-else-if="hub.status === 'active_open'" class="status-tag open">蟲洞開啟</span>
              </div>

              <h4 class="hub-name">{{ hub.name }}</h4>
              <p class="hub-desc">{{ hub.description }}</p>

              <div class="hub-specs">
                <span>航距: <strong>{{ hub.distanceLY }} LY</strong></span>
                <span>過路費: <strong>{{ hub.transitTollCredits }} CR</strong></span>
                <span>穩定度: <strong>{{ hub.wormholeStability }}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chevron Dialing Chamber -->
        <div class="dialing-chamber glass-panel">
          <div class="chamber-top">
            <h3 class="section-title">🔒 7 楔形鎖符文咬合序列 (Chevron Dialing Sequence)</h3>
            <span class="lock-counter">已鎖定: {{ stats.currentChevronLocked }} / 7</span>
          </div>

          <!-- 7 Chevrons Visual Dots -->
          <div class="chevrons-row">
            <div
              v-for="idx in 7"
              :key="idx"
              class="chevron-box"
              :class="{ locked: idx <= stats.currentChevronLocked }"
            >
              <span class="chev-num">#{{ idx }}</span>
              <span class="chev-icon">⚡</span>
              <span class="chev-status">{{ idx <= stats.currentChevronLocked ? 'LOCKED' : 'OPEN' }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="dialing-actions">
            <button
              class="dial-btn lock"
              :disabled="!stats.targetDestination || stats.currentChevronLocked >= 7 || stats.isWormholeOpen"
              @click="lockChevron"
            >
              🔒 手動鎖定下一枚楔形鎖 (#{{ stats.currentChevronLocked + 1 }})
            </button>

            <button
              class="dial-btn auto"
              :disabled="!stats.targetDestination || stats.currentChevronLocked >= 7 || stats.isWormholeOpen"
              @click="autoDial"
            >
              ⚡ 快速超導自動撥號 (Auto Dial 7 Chevrons)
            </button>

            <button
              v-if="!stats.isWormholeOpen"
              class="dial-btn open"
              :disabled="!stats.targetDestination || stats.currentChevronLocked < 7"
              @click="openWormhole"
            >
              🌀 激發事件視界蟲洞水面 (Open Wormhole -25,000 kWh)
            </button>

            <button
              v-else
              class="dial-btn traverse"
              @click="traverse"
            >
              🚀 執行超維度星門躍遷穿梭 (Traverse Gate)
            </button>

            <button
              v-if="stats.isWormholeOpen"
              class="dial-btn shutdown"
              @click="shutdown"
            >
              🛑 緊急斷開蟲洞視界
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  StargateId,
  stargateNetwork
} from '../engine/stargateNetwork'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)

const stats = computed(() => {
  void refreshTrigger.value
  return stargateNetwork.stats
})

const hubsList = computed(() => {
  void refreshTrigger.value
  return Object.values(stargateNetwork.hubs)
})

const originHub = computed(() => {
  void refreshTrigger.value
  return stargateNetwork.hubs[stargateNetwork.stats.activeOrigin]
})

function close(): void {
  ui.closeOverlay()
}

function selectDestination(id: StargateId): void {
  stargateNetwork.selectDestination(id)
  refreshTrigger.value += 1
}

function lockChevron(): void {
  stargateNetwork.lockNextChevron()
  refreshTrigger.value += 1
}

function autoDial(): void {
  stargateNetwork.autoDialAllChevrons()
  refreshTrigger.value += 1
}

function openWormhole(): void {
  stargateNetwork.openWormhole()
  refreshTrigger.value += 1
}

function traverse(): void {
  stargateNetwork.traverseWormhole()
  refreshTrigger.value += 1
}

function shutdown(): void {
  stargateNetwork.shutdownWormhole()
  refreshTrigger.value += 1
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.stargate-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(12, 18, 32, 0.95);
  border: 1px solid rgba(0, 229, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(20, 28, 48, 0.7);
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

.stargate-content {
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

.toll-val {
  color: #ffd700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
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

/* Hubs Section */
.section-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.hubs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
}

@media (max-width: 820px) {
  .hubs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.hub-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(18, 24, 40, 0.7);
}

.hub-card:hover {
  transform: translateY(-2px);
  background: rgba(22, 32, 54, 0.85);
}

.hub-card.is-origin {
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
  border-color: #00e5ff;
}

.hub-card.is-target {
  box-shadow: 0 0 16px rgba(255, 145, 0, 0.35);
  border-color: #ff9100;
}

.hub-card.is-active {
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hub-sector {
  font-size: 0.68rem;
  font-weight: 600;
}

.status-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
}

.status-tag.origin {
  background: rgba(0, 229, 255, 0.2);
  color: #00e5ff;
}

.status-tag.target {
  background: rgba(255, 145, 0, 0.2);
  color: #ff9100;
}

.status-tag.open {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.hub-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.hub-desc {
  margin: 0;
  font-size: 0.7rem;
  color: #889;
  line-height: 1.3;
  min-height: 38px;
}

.hub-specs {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.68rem;
  color: #9ab;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 6px;
  border-radius: 4px;
}

/* Dialing Chamber */
.dialing-chamber {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chamber-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lock-counter {
  font-size: 0.82rem;
  font-weight: 700;
  color: #00e5ff;
}

.chevrons-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.chevron-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.3s;
}

.chevron-box.locked {
  background: rgba(0, 229, 255, 0.15);
  border-color: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.chev-num {
  font-size: 0.68rem;
  color: #889;
}

.chev-icon {
  font-size: 1rem;
  opacity: 0.3;
}

.chevron-box.locked .chev-icon {
  opacity: 1;
  color: #ffea00;
  text-shadow: 0 0 6px #ffea00;
}

.chev-status {
  font-size: 0.62rem;
  font-weight: 700;
  color: #889;
}

.chevron-box.locked .chev-status {
  color: #00ff88;
}

/* Dialing Actions */
.dialing-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dial-btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.dial-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dial-btn.lock {
  background: rgba(0, 229, 255, 0.15);
  border-color: #00e5ff;
  color: #00e5ff;
}

.dial-btn.lock:hover:not(:disabled) {
  background: rgba(0, 229, 255, 0.25);
}

.dial-btn.auto {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.dial-btn.auto:hover:not(:disabled) {
  border-color: #ff9100;
  color: #ff9100;
}

.dial-btn.open {
  background: linear-gradient(135deg, #00b0ff, #00e5ff);
  color: #06101c;
  font-weight: 700;
}

.dial-btn.open:hover:not(:disabled) {
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
}

.dial-btn.traverse {
  background: linear-gradient(135deg, #00c853, #69f0ae);
  color: #06101c;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.02); }
}

.dial-btn.shutdown {
  background: rgba(255, 23, 68, 0.2);
  border-color: #ff1744;
  color: #ff5252;
}
</style>
