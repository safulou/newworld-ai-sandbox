<template>
  <div class="hydro-overlay" @click.self="close">
    <div class="hydro-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🧪</span>
          <div>
            <h2>賽博水耕溫室與基因合成台 (Cyber Hydroponics)</h2>
            <p class="subtitle">垂直高能生長塔、發光作物培育與能力合劑萃取</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Active Buffs Indicator Bar -->
      <div v-if="activeBuffs.length > 0" class="buff-bar">
        <span class="buff-title">⚡ 作用中生物賦能：</span>
        <div
          v-for="b in activeBuffs"
          :key="b.id"
          class="buff-tag"
        >
          {{ b.icon }} {{ b.name }} ({{ Math.ceil(b.remainingSeconds) }}s)
        </div>
      </div>

      <div class="main-layout">
        <!-- Left: Hydroponic Pods -->
        <div class="pods-section">
          <h3>🌱 垂直水耕生長槽</h3>
          <div class="pods-grid">
            <div
              v-for="pod in pods"
              :key="pod.id"
              class="pod-card"
            >
              <div class="pod-header">
                <span class="pod-num">槽位 #{{ pod.slotIndex + 1 }}</span>
                <span class="stage-tag" :class="pod.stage">
                  {{ getStageLabel(pod.stage) }}
                </span>
              </div>

              <!-- Crop Icon & Info -->
              <div class="pod-center">
                <div class="crop-icon-large" v-if="pod.cropId">
                  {{ getCropIcon(pod.cropId) }}
                </div>
                <div class="crop-icon-large empty" v-else>
                  🌱
                </div>
                <div class="crop-name">
                  {{ pod.cropId ? getCropName(pod.cropId) : '未播種 (空槽)' }}
                </div>
              </div>

              <!-- Progress & Hydration -->
              <div class="gauge-section" v-if="pod.cropId">
                <div class="gauge-row">
                  <span>生長成熟度</span>
                  <span>{{ Math.round(pod.growthProgress) }}%</span>
                </div>
                <div class="bar-bg">
                  <div class="bar-fill growth" :style="{ width: pod.growthProgress + '%' }"></div>
                </div>

                <div class="gauge-row mt">
                  <span>水耕養分水合</span>
                  <span>{{ Math.round(pod.hydration) }}%</span>
                </div>
                <div class="bar-bg">
                  <div class="bar-fill hydro" :style="{ width: pod.hydration + '%' }"></div>
                </div>
              </div>

              <!-- Pod Actions -->
              <div class="pod-actions">
                <button
                  v-if="!pod.cropId"
                  class="btn-pod primary"
                  @click="openSeedPicker(pod.slotIndex)"
                >
                  🌾 播種
                </button>
                <template v-else>
                  <button
                    v-if="pod.stage === 'mature'"
                    class="btn-pod harvest"
                    @click="harvest(pod.slotIndex)"
                  >
                    ✨ 採收作物
                  </button>
                  <button
                    v-else
                    class="btn-pod"
                    @click="water(pod.slotIndex)"
                  >
                    💧 噴霧水合
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Inventory & Bio-Synthesis Lab -->
        <div class="lab-section">
          <h3>📦 作物庫存</h3>
          <div class="inventory-chips">
            <div
              v-for="(count, cropId) in cropInventory"
              :key="cropId"
              class="inv-chip"
            >
              <span class="inv-icon">{{ getCropIcon(cropId) }}</span>
              <span class="inv-name">{{ getCropName(cropId) }}</span>
              <span class="inv-count">x{{ count }}</span>
            </div>
          </div>

          <h3 class="mt-lab">⚗️ 生物賦能合成工作台</h3>
          <div class="recipes-list">
            <div
              v-for="recipe in recipes"
              :key="recipe.id"
              class="recipe-card"
            >
              <div class="recipe-top">
                <span class="recipe-name">{{ recipe.icon }} {{ recipe.name }}</span>
                <span class="recipe-cost">
                  消耗 {{ recipe.requiredCount }}x {{ getCropName(recipe.requiredCropId) }}
                </span>
              </div>
              <p class="recipe-desc">{{ recipe.description }}</p>
              <button
                class="btn-brew"
                :disabled="(cropInventory[recipe.requiredCropId] || 0) < recipe.requiredCount"
                @click="brew(recipe.id)"
              >
                ⚗️ 提煉合劑
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
  cyberHydroponics,
  CROP_SPECIES,
  POTION_RECIPES,
  CropStage,
  HydroponicPod,
  BuffEffect,
  PotionRecipe
} from '@/engine/cyberHydroponics'

const ui = useUIStore()

const pods = ref<HydroponicPod[]>([...cyberHydroponics.pods])
const cropInventory = ref<Record<string, number>>({ ...cyberHydroponics.cropInventory })
const activeBuffs = ref<BuffEffect[]>([...cyberHydroponics.activeBuffs])
const recipes = ref<PotionRecipe[]>([...POTION_RECIPES])

let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    cyberHydroponics.update(0.1)
    pods.value = [...cyberHydroponics.pods]
    cropInventory.value = { ...cyberHydroponics.cropInventory }
    activeBuffs.value = [...cyberHydroponics.activeBuffs]
  }, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function getCropName(id: string): string {
  return CROP_SPECIES[id]?.name || id
}

function getCropIcon(id: string): string {
  return CROP_SPECIES[id]?.icon || '🌱'
}

function getStageLabel(stage: CropStage): string {
  switch (stage) {
    case 'seed': return '胚芽種子'
    case 'sprout': return '嫩葉破土'
    case 'flowering': return '開花結實'
    case 'mature': return '豐收成熟'
  }
}

function openSeedPicker(slotIndex: number): void {
  const seeds = Object.keys(CROP_SPECIES)
  const randomSeed = seeds[Math.floor(Math.random() * seeds.length)]
  cyberHydroponics.plantCrop(slotIndex, randomSeed)
  pods.value = [...cyberHydroponics.pods]
}

function water(slotIndex: number): void {
  cyberHydroponics.waterPod(slotIndex)
}

function harvest(slotIndex: number): void {
  cyberHydroponics.harvestPod(slotIndex)
  pods.value = [...cyberHydroponics.pods]
  cropInventory.value = { ...cyberHydroponics.cropInventory }
  ui.setBuildStatus('🌾 成功採收發光基因作物！')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function brew(recipeId: string): void {
  const ok = cyberHydroponics.brewPotion(recipeId)
  if (ok) {
    cropInventory.value = { ...cyberHydroponics.cropInventory }
    activeBuffs.value = [...cyberHydroponics.activeBuffs]
    ui.setBuildStatus('🧪 基因合劑提煉成功！生物賦能已啟用')
    setTimeout(() => ui.setBuildStatus(''), 2000)
  }
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.hydro-overlay {
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

.hydro-modal {
  width: 95%;
  max-width: 880px;
  background: rgba(10, 16, 32, 0.96);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15);
  padding: 24px;
  color: #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #10b981);
}

.modal-header h2 {
  font-size: 1.35rem;
  margin: 0;
  background: linear-gradient(135deg, #10b981, #00ffff);
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

.buff-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 10px;
  padding: 8px 14px;
  margin-bottom: 16px;
  font-size: 0.85rem;
}

.buff-title {
  color: #10b981;
  font-weight: 700;
}

.buff-tag {
  background: rgba(0, 0, 0, 0.35);
  padding: 3px 8px;
  border-radius: 6px;
  color: #e2e8f0;
}

.main-layout {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 20px;
}

.pods-section h3, .lab-section h3 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: #10b981;
}

.mt-lab {
  margin-top: 18px !important;
}

.pods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pod-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.pod-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  margin-bottom: 8px;
}

.pod-num {
  color: #94a3b8;
}

.stage-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
}

.stage-tag.mature {
  background: rgba(16, 185, 129, 0.25);
  color: #34d399;
  font-weight: 700;
}

.pod-center {
  text-align: center;
  margin: 6px 0 10px;
}

.crop-icon-large {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
}

.crop-icon-large.empty {
  opacity: 0.3;
}

.crop-name {
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 2px;
}

.gauge-section {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
}

.gauge-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.gauge-row.mt {
  margin-top: 6px;
}

.bar-bg {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill.growth {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
}

.bar-fill.hydro {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #00ffff);
}

.btn-pod {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  transition: all 0.2s;
}

.btn-pod.primary {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
}

.btn-pod.harvest {
  background: linear-gradient(135deg, #10b981, #00ffff);
  border: none;
  color: #050b14;
}

.inventory-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.inv-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}

.inv-count {
  color: #10b981;
  font-weight: 700;
}

.recipes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.recipe-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px;
}

.recipe-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.recipe-cost {
  font-size: 0.75rem;
  color: #94a3b8;
}

.recipe-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 8px;
  line-height: 1.3;
}

.btn-brew {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, #10b981, #00ffff);
  color: #050b14;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-brew:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 720px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}
</style>
