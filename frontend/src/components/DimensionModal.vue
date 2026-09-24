<template>
  <div class="dimension-overlay" @click.self="close">
    <div class="dimension-modal glass-panel">
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🌌</span>
          <div>
            <h2>量子次元躍遷門 (Quantum Dimension Warp)</h2>
            <p class="subtitle">穿梭於多元賽博宇宙與晶核深淵之間</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Current Location Status Banner -->
      <div class="current-status-banner">
        <span class="status-dot"></span>
        <span class="status-label">當前座標次元：</span>
        <span class="status-name">{{ currentDimInfo.icon }} {{ currentDimInfo.name }}</span>
        <span class="status-gravity">引力常數：{{ currentDimInfo.gravityMultiplier }}G</span>
      </div>

      <!-- Dimension Selection Cards -->
      <div class="dimension-grid">
        <div
          v-for="dim in dimensionList"
          :key="dim.id"
          :class="['dimension-card', { active: dim.id === currentDimId, warping: isWarpingTo === dim.id }]"
          :style="{ '--dim-color': '#' + dim.themeColor.toString(16).padStart(6, '0') }"
        >
          <div class="card-glow-bg"></div>
          <div class="card-header">
            <span class="dim-icon">{{ dim.icon }}</span>
            <div class="dim-title-group">
              <h3 class="dim-title">{{ dim.name }}</h3>
              <span class="dim-tag" :class="dim.id">{{ getDimensionTag(dim.id) }}</span>
            </div>
          </div>

          <p class="dim-desc">{{ dim.description }}</p>

          <div class="dim-specs">
            <div class="spec-row">
              <span class="spec-label">重力係數</span>
              <span class="spec-value" :class="{ low: dim.gravityMultiplier < 1, high: dim.gravityMultiplier > 1 }">
                {{ dim.gravityMultiplier }}x {{ getGravityLabel(dim.gravityMultiplier) }}
              </span>
            </div>
            <div class="spec-row">
              <span class="spec-label">地貌特徵</span>
              <span class="spec-value">{{ getTerrainDesc(dim.id) }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">天穹光譜</span>
              <span class="spec-value color-badge">
                <span class="color-preview" :style="{ backgroundColor: '#' + dim.skyColor.toString(16).padStart(6, '0') }"></span>
                #{{ dim.skyColor.toString(16).padStart(6, '0').toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <button
              v-if="dim.id === currentDimId"
              class="btn-warp current"
              disabled
            >
              📍 當前停留空間
            </button>
            <button
              v-else
              class="btn-warp action"
              :disabled="isWarping"
              @click="initiateWarp(dim.id)"
            >
              <span v-if="isWarpingTo === dim.id">🌀 躍遷傳送中...</span>
              <span v-else>🚀 啟動量子躍遷</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { dimensionWarp, DIMENSIONS, DimensionType, DimensionInfo } from '@/engine/dimensionWarp'

const ui = useUIStore()

const currentDimId = ref<DimensionType>(dimensionWarp.currentDimension)
const isWarping = ref(false)
const isWarpingTo = ref<DimensionType | null>(null)

const dimensionList = computed<DimensionInfo[]>(() => Object.values(DIMENSIONS))
const currentDimInfo = computed<DimensionInfo>(() => DIMENSIONS[currentDimId.value])

function getDimensionTag(id: DimensionType): string {
  switch (id) {
    case 'overworld': return '都會實體層'
    case 'neon_void': return '微重力反重力島'
    case 'crystal_subcore': return '高壓超核心'
  }
}

function getGravityLabel(gravity: number): string {
  if (gravity < 1.0) return '(漂浮)'
  if (gravity > 1.0) return '(重壓)'
  return '(標準)'
}

function getTerrainDesc(id: DimensionType): string {
  switch (id) {
    case 'overworld': return '平原、高樓與現代賽博都市'
    case 'neon_void': return '紫水晶群島、虛空巨石'
    case 'crystal_subcore': return '地心玄武岩、電漿湧流柱'
  }
}

function initiateWarp(target: DimensionType): void {
  if (isWarping.value || target === currentDimId.value) return

  isWarping.value = true
  isWarpingTo.value = target

  // Attempt warp via dimension engine
  dimensionWarp.warpTo(target)
  currentDimId.value = target

  setTimeout(() => {
    isWarping.value = false
    isWarpingTo.value = null
    ui.setBuildStatus(`🌀 量子躍遷完成！歡迎來到 ${DIMENSIONS[target].name}`)
    setTimeout(() => ui.setBuildStatus(''), 2500)
    close()
  }, 1200)
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.dimension-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;
}

.dimension-modal {
  width: 95%;
  max-width: 920px;
  background: rgba(10, 16, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.15);
  padding: 28px;
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #a371f7);
}

.modal-header h2 {
  font-size: 1.4rem;
  margin: 0;
  background: linear-gradient(135deg, #00ffff, #a371f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 0.85rem;
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
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 60, 60, 0.2);
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.current-status-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 22px;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #39ff14;
  box-shadow: 0 0 8px #39ff14;
  animation: pulse 2s infinite;
}

.status-name {
  font-weight: 700;
  color: #00ffff;
}

.status-gravity {
  margin-left: auto;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.dimension-card {
  position: relative;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dimension-card:hover {
  transform: translateY(-3px);
  border-color: var(--dim-color);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px var(--dim-color);
}

.dimension-card.active {
  border-color: var(--dim-color);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 20px var(--dim-color);
}

.dimension-card.warping {
  animation: warpingFlash 0.3s infinite alternate;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.dim-icon {
  font-size: 2rem;
}

.dim-title-group {
  flex: 1;
}

.dim-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.dim-tag {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 3px;
  background: rgba(255, 255, 255, 0.1);
}

.dim-tag.overworld {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.15);
}

.dim-tag.neon_void {
  color: #d8b4fe;
  background: rgba(168, 85, 247, 0.2);
}

.dim-tag.crystal_subcore {
  color: #fdba74;
  background: rgba(251, 146, 60, 0.2);
}

.dim-desc {
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.4;
  margin: 0 0 14px;
  min-height: 48px;
}

.dim-specs {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 0.8rem;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  color: #64748b;
}

.spec-value {
  color: #e2e8f0;
  font-weight: 500;
}

.spec-value.low {
  color: #a78bfa;
}

.spec-value.high {
  color: #fb923c;
}

.color-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
}

.color-preview {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.card-footer {
  margin-top: auto;
}

.btn-warp {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-warp.current {
  background: rgba(255, 255, 255, 0.05);
  color: #64748b;
  cursor: default;
}

.btn-warp.action {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(168, 85, 247, 0.4));
  border: 1px solid var(--dim-color);
  color: #ffffff;
}

.btn-warp.action:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.6), rgba(168, 85, 247, 0.7));
  box-shadow: 0 0 15px var(--dim-color);
}

.btn-warp:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes warpingFlash {
  from { box-shadow: 0 0 10px var(--dim-color); }
  to { box-shadow: 0 0 35px var(--dim-color), inset 0 0 20px var(--dim-color); }
}

@media (max-width: 820px) {
  .dimension-grid {
    grid-template-columns: 1fr;
  }
}
</style>
