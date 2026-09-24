<template>
  <div class="fishing-overlay" @click.self="close">
    <div class="fishing-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🎣</span>
          <div>
            <h2>賽博等離子垂釣 (Plasma Angling)</h2>
            <p class="subtitle">水冷管道與虛空湖泊的深海生化圖鑑</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="modal-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'angling' }]"
          @click="activeTab = 'angling'"
        >
          ⚡ 垂釣控制台
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'codex' }]"
          @click="activeTab = 'codex'"
        >
          📖 深海水棲圖鑑 ({{ discoveredCount }}/8)
        </button>
      </div>

      <!-- Tab 1: Angling Simulator & Minigame -->
      <div v-if="activeTab === 'angling'" class="angling-content">
        <!-- Idle State -->
        <div v-if="fishingState === 'idle'" class="state-container idle-state">
          <div class="rod-avatar">⚡🎣</div>
          <h3>等離子魚竿已就緒</h3>
          <p>將量子共振擬餌投入水域，靜待虛空與深海生物咬鉤。</p>
          <button class="btn-primary-action" @click="startCast">
            🚀 拋竿入水 (Cast Rod)
          </button>
        </div>

        <!-- Waiting State -->
        <div v-else-if="fishingState === 'waiting'" class="state-container waiting-state">
          <div class="bobber-wave">
            <span class="bobber-icon">🪱</span>
            <div class="ripple r1"></div>
            <div class="ripple r2"></div>
          </div>
          <h3>等候水面動靜中...</h3>
          <p class="waiting-tip">請專注觀察水面，當警報響起時請立即提竿！</p>
          <button class="btn-cancel" @click="cancelFishing">收回魚線</button>
        </div>

        <!-- Nibble State (Reaction QTE) -->
        <div v-else-if="fishingState === 'nibble'" class="state-container nibble-state">
          <div class="nibble-alert">⚠️ 魚訊急促咬鉤！ ⚠️</div>
          <button class="btn-hook" @click="attemptHook">
            ⚡ 立即提竿！ (HOOK NOW!) ⚡
          </button>
          <span class="hint-text">按空白鍵或點擊提竿！</span>
        </div>

        <!-- Hooked State (Tension Control Minigame) -->
        <div v-else-if="fishingState === 'hooked'" class="state-container hooked-state">
          <div class="fish-battle-info">
            <span class="target-name">目標：{{ currentTargetFish?.name || '神秘巨物' }}</span>
            <span class="rarity-badge" :class="currentTargetFish?.rarity">
              {{ currentTargetFish?.rarity.toUpperCase() }}
            </span>
          </div>

          <!-- Reel Progress -->
          <div class="progress-section">
            <div class="bar-header">
              <span>收線進度</span>
              <span>{{ Math.round(reelProgress) }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-fill" :style="{ width: reelProgress + '%' }"></div>
            </div>
          </div>

          <!-- Line Tension Meter with Sweet Zone -->
          <div class="tension-section">
            <div class="bar-header">
              <span>魚線張力 (維持在綠色最佳區間)</span>
              <span :class="['tension-val', { danger: lineTension > 85 || lineTension < 20 }]">
                {{ Math.round(lineTension) }}%
              </span>
            </div>
            <div class="tension-bar-track">
              <!-- Sweet Zone indicator (38% to 72%) -->
              <div class="sweet-zone" style="left: 38%; width: 34%;"></div>
              <div
                class="tension-needle"
                :style="{ left: lineTension + '%' }"
                :class="{ inZone: isInSweetZone }"
              ></div>
            </div>
          </div>

          <!-- Reeling Control -->
          <div class="reel-controls">
            <button
              class="btn-reel"
              :class="{ reeling: isReelingDown }"
              @mousedown="startReel"
              @mouseup="stopReel"
              @mouseleave="stopReel"
              @touchstart.prevent="startReel"
              @touchend.prevent="stopReel"
            >
              🔄 {{ isReelingDown ? '拉緊收線中...' : '按住收線 (Hold to Reel)' }}
            </button>
          </div>
        </div>

        <!-- Caught Success State -->
        <div v-else-if="fishingState === 'caught' && lastCatch" class="state-container caught-state">
          <div class="caught-card">
            <div class="caught-sparkles">✨ 🎉 捕獲成功！ 🎉 ✨</div>
            <div class="caught-icon">{{ lastCatch.species.icon }}</div>
            <h3 class="caught-name">{{ lastCatch.species.name }}</h3>
            <span class="scientific-name">{{ lastCatch.species.scientificName }}</span>
            <div class="caught-stats">
              <div class="stat-pill">重量: <strong>{{ lastCatch.weightKg }} kg</strong></div>
              <div class="stat-pill">身長: <strong>{{ lastCatch.lengthCm }} cm</strong></div>
              <div class="stat-pill rarity" :class="lastCatch.species.rarity">
                {{ lastCatch.species.rarity.toUpperCase() }}
              </div>
            </div>
            <p class="caught-lore">{{ lastCatch.species.description }}</p>
            <button class="btn-primary-action" @click="resetToIdle">
              🎣 再次垂釣
            </button>
          </div>
        </div>

        <!-- Escaped State -->
        <div v-else-if="fishingState === 'escaped'" class="state-container escaped-state">
          <div class="escaped-icon">💨 💥</div>
          <h3>魚兒掙脫逃逸了！</h3>
          <p>魚線張力失控或反應不及，水下巨獸已遁入虛空。</p>
          <button class="btn-primary-action" @click="resetToIdle">
            🔄 重整裝備 (Try Again)
          </button>
        </div>
      </div>

      <!-- Tab 2: Deep-Sea Codex (FishDex) -->
      <div v-else class="codex-content">
        <div class="codex-summary">
          <div class="summary-card">
            <span class="summary-label">已登錄物種</span>
            <span class="summary-val">{{ discoveredCount }} / 8</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">總垂釣尾數</span>
            <span class="summary-val">{{ totalCaught }} 尾</span>
          </div>
        </div>

        <div class="codex-grid">
          <div
            v-for="fish in allSpecies"
            :key="fish.id"
            :class="['codex-card', { discovered: !!records[fish.id] }]"
            :style="{ '--rarity-color': fish.color }"
          >
            <div class="card-icon">
              {{ records[fish.id] ? fish.icon : '❓' }}
            </div>
            <div class="card-details">
              <div class="card-top">
                <h4 class="card-name">{{ records[fish.id] ? fish.name : '未知生物' }}</h4>
                <span class="codex-rarity" :class="fish.rarity">{{ fish.rarity }}</span>
              </div>
              <div v-if="records[fish.id]" class="card-info">
                <span class="sci-name">{{ fish.scientificName }}</span>
                <p class="desc">{{ fish.description }}</p>
                <div class="codex-stats">
                  <span>獲取次數: <strong>{{ records[fish.id]?.caughtCount || 0 }}</strong></span>
                  <span>最大體重: <strong>{{ records[fish.id]?.maxWeightKg || 0 }} kg</strong></span>
                  <span>最大長度: <strong>{{ records[fish.id]?.maxLengthCm || 0 }} cm</strong></span>
                </div>
              </div>
              <div v-else class="card-locked">
                <span>尚未在任何次元水域捕獲該生物</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import {
  cyberFishing,
  FISH_SPECIES,
  FishSpecies,
  FishingState,
  FishRecord
} from '@/engine/cyberFishing'

const ui = useUIStore()

const activeTab = ref<'angling' | 'codex'>('angling')
const fishingState = ref<FishingState>(cyberFishing.state)
const currentTargetFish = ref<FishSpecies | null>(cyberFishing.currentTargetFish)
const lineTension = ref(cyberFishing.lineTension)
const reelProgress = ref(cyberFishing.reelProgress)
const isReelingDown = ref(false)
const lastCatch = ref(cyberFishing.lastCaughtFish)

const records = ref<Record<string, FishRecord>>(cyberFishing.getAllRecords())
const allSpecies = computed<FishSpecies[]>(() => Object.values(FISH_SPECIES))
const discoveredCount = computed(() => cyberFishing.getDiscoveredCount())
const totalCaught = computed(() => cyberFishing.getTotalCaughtCount())

const isInSweetZone = computed(() => {
  return lineTension.value >= cyberFishing.sweetZoneMin && lineTension.value <= cyberFishing.sweetZoneMax
})

let updateTimer: number | null = null

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  updateTimer = window.setInterval(() => {
    fishingState.value = cyberFishing.state
    currentTargetFish.value = cyberFishing.currentTargetFish
    lineTension.value = cyberFishing.lineTension
    reelProgress.value = cyberFishing.reelProgress
    lastCatch.value = cyberFishing.lastCaughtFish

    if (cyberFishing.state === 'hooked') {
      cyberFishing.updateReeling(0.05, isReelingDown.value)
    }

    if (cyberFishing.state === 'caught') {
      records.value = cyberFishing.getAllRecords()
    }
  }, 50)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (updateTimer) clearInterval(updateTimer)
  cyberFishing.clearTimers()
})

function onKeyDown(e: KeyboardEvent): void {
  if (e.code === 'Space') {
    e.preventDefault()
    if (cyberFishing.state === 'nibble') {
      attemptHook()
    } else if (cyberFishing.state === 'hooked') {
      startReel()
    }
  } else if (e.code === 'Escape') {
    close()
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (e.code === 'Space' && cyberFishing.state === 'hooked') {
    stopReel()
  }
}

function startCast(): void {
  cyberFishing.castRod()
  fishingState.value = cyberFishing.state
}

function cancelFishing(): void {
  cyberFishing.reset()
  fishingState.value = cyberFishing.state
}

function attemptHook(): void {
  cyberFishing.hookLine()
  fishingState.value = cyberFishing.state
  currentTargetFish.value = cyberFishing.currentTargetFish
}

function startReel(): void {
  isReelingDown.value = true
}

function stopReel(): void {
  isReelingDown.value = false
}

function resetToIdle(): void {
  cyberFishing.reset()
  fishingState.value = cyberFishing.state
  lastCatch.value = null
}

function close(): void {
  cyberFishing.clearTimers()
  ui.closeOverlay()
}
</script>

<style scoped>
.fishing-overlay {
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

.fishing-modal {
  width: 95%;
  max-width: 860px;
  background: rgba(10, 16, 32, 0.96);
  border: 1px solid rgba(0, 255, 255, 0.3);
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
  background: linear-gradient(135deg, #00ffff, #3b82f6);
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

.modal-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
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

.angling-content {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 520px;
}

.rod-avatar {
  font-size: 4rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 16px rgba(0, 255, 255, 0.5));
}

.btn-primary-action {
  background: linear-gradient(135deg, #00ffff, #3b82f6);
  border: none;
  color: #050b14;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 12px 28px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  transition: all 0.2s;
}

.btn-primary-action:hover {
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.7);
}

.bobber-wave {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.bobber-icon {
  font-size: 2.4rem;
  z-index: 2;
  animation: bobberFloat 2s infinite ease-in-out;
}

.ripple {
  position: absolute;
  border: 2px solid #00ffff;
  border-radius: 50%;
  animation: rippleSpread 2s infinite ease-out;
}

.ripple.r2 {
  animation-delay: 0.8s;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 14px;
}

.nibble-alert {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff0055;
  text-shadow: 0 0 12px #ff0055;
  animation: flashAlert 0.25s infinite alternate;
  margin-bottom: 18px;
}

.btn-hook {
  background: linear-gradient(135deg, #ff0055, #ff5500);
  border: 2px solid #fff;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 800;
  padding: 16px 36px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(255, 0, 85, 0.8);
  animation: pulseScale 0.3s infinite alternate;
}

.hooked-state {
  width: 100%;
}

.fish-battle-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
}

.target-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.rarity-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.rarity-badge.common { background: rgba(0, 255, 255, 0.2); color: #00ffff; }
.rarity-badge.uncommon { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.rarity-badge.rare { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
.rarity-badge.epic { background: rgba(236, 72, 153, 0.2); color: #ec4899; }
.rarity-badge.legendary { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

.progress-section, .tension-section {
  width: 100%;
  margin-bottom: 16px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: #94a3b8;
}

.progress-bar-bg {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #00ffff);
  transition: width 0.05s linear;
}

.tension-bar-track {
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sweet-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(57, 255, 20, 0.35);
  border-left: 2px dashed #39ff14;
  border-right: 2px dashed #39ff14;
}

.tension-needle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  background: #ff0055;
  transform: translateX(-50%);
  border-radius: 3px;
  transition: left 0.05s linear;
  box-shadow: 0 0 10px #ff0055;
}

.tension-needle.inZone {
  background: #39ff14;
  box-shadow: 0 0 12px #39ff14;
}

.btn-reel {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  border: 2px solid #00ffff;
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  cursor: pointer;
  user-select: none;
  transition: all 0.1s;
}

.btn-reel.reeling {
  background: #00ffff;
  color: #050b14;
  box-shadow: 0 0 25px #00ffff;
}

.caught-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
}

.caught-icon {
  font-size: 3.5rem;
  margin: 10px 0;
}

.caught-stats {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 14px 0;
}

.stat-pill {
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.caught-lore {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 12px 0 20px;
}

.escaped-icon {
  font-size: 3.5rem;
  margin-bottom: 12px;
}

.codex-content {
  max-height: 480px;
  overflow-y: auto;
}

.codex-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.78rem;
  color: #94a3b8;
}

.summary-val {
  font-size: 1.2rem;
  font-weight: 700;
  color: #00ffff;
}

.codex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.codex-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 12px;
  opacity: 0.55;
  transition: all 0.2s;
}

.codex-card.discovered {
  opacity: 1;
  border-color: var(--rarity-color);
  background: rgba(15, 23, 42, 0.9);
}

.card-icon {
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.card-details {
  flex: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.codex-rarity {
  font-size: 0.7rem;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.sci-name {
  font-size: 0.75rem;
  font-style: italic;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.desc {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0 0 6px;
  line-height: 1.3;
}

.codex-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.72rem;
  color: #cbd5e1;
}

.card-locked {
  font-size: 0.78rem;
  color: #64748b;
  padding-top: 8px;
}

@keyframes bobberFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes rippleSpread {
  0% { width: 10px; height: 10px; opacity: 1; }
  100% { width: 90px; height: 90px; opacity: 0; }
}

@keyframes flashAlert {
  from { opacity: 0.4; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1.02); }
}

@keyframes pulseScale {
  from { transform: scale(1); }
  to { transform: scale(1.04); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 720px) {
  .codex-grid {
    grid-template-columns: 1fr;
  }
}
</style>
