<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="genome-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🧪</span>
          <h2>異星基因工坊與生物誘變培育 (Xenobiology Genome Forge)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Body -->
      <div class="genome-content">
        <!-- Telemetry Bar -->
        <div class="telemetry-bar glass-panel">
          <div class="tele-item">
            <span class="t-icon">🧪</span>
            <div>
              <span class="t-label">生物誘變催化劑:</span>
              <span class="t-val catalyst-val">{{ stats.bioCatalystsCount }} 點</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🐾</span>
            <div>
              <span class="t-label">已培育合成生物:</span>
              <span class="t-val">{{ stats.activeOrganismsCount }} / {{ blueprintsList.length }} 種</span>
            </div>
          </div>
          <div class="tele-item">
            <span class="t-icon">🧬</span>
            <div>
              <span class="t-label">基因拼接穩定指數:</span>
              <span class="t-val highlight">{{ stats.currentGeneStability }}%</span>
            </div>
          </div>
          <div class="tele-item harvest-item">
            <button class="harvest-btn" @click="harvestMutagen">
              🌱 萃取生物誘變催化劑 (+40 點)
            </button>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="status-banner glass-panel">
          <span class="status-icon">💡</span>
          <span class="status-txt">{{ stats.statusMessage }}</span>
        </div>

        <!-- Active Incubator Progress Stage -->
        <div v-if="stats.activeIncubatingOrganism" class="incubator-stage glass-panel">
          <div class="inc-header">
            <span class="inc-title">🧬 離心培育艙運轉中：[{{ blueprints[stats.activeIncubatingOrganism]?.name }}]</span>
            <span class="inc-percent">{{ Math.round(stats.incubatorProgress) }}%</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${stats.incubatorProgress}%` }"
            ></div>
          </div>
          <div class="inc-actions">
            <button class="accelerate-btn" @click="fastForward">
              ⚡ 超導激光誘導基因重組加速 (+35%)
            </button>
          </div>
        </div>

        <!-- 4 Exotic Gene Strands Cards -->
        <div class="strands-section">
          <h3 class="section-title">🔬 異星外源基因鏈庫 (Exotic Gene Strands)</h3>
          <div class="strands-grid">
            <div
              v-for="strand in strandsList"
              :key="strand.id"
              class="strand-card glass-panel"
              :style="{ borderColor: strand.color }"
            >
              <div class="strand-top">
                <span class="strand-name" :style="{ color: strand.color }">{{ strand.name }}</span>
                <span class="strand-cost">{{ strand.catalystCost }} 催化劑</span>
              </div>
              <p class="strand-desc">{{ strand.description }}</p>
              <div class="strand-specs">
                <span>基因活性: <strong>{{ strand.potency }}%</strong></span>
                <span>穩定度補正: <strong>{{ strand.stabilityMod > 0 ? `+${strand.stabilityMod}` : strand.stabilityMod }}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Organism Blueprints Grid -->
        <div class="blueprints-section">
          <h3 class="section-title">🐾 異星合成生物藍圖譜系 (Synthetic Bio-Constructs)</h3>
          <div class="blueprints-grid">
            <div
              v-for="bp in blueprintsList"
              :key="bp.id"
              class="bp-card glass-panel"
              :class="{ synthesized: bp.isSynthesized, incubating: stats.activeIncubatingOrganism === bp.id }"
              :style="{ borderColor: bp.isSynthesized ? bp.color : 'rgba(255, 255, 255, 0.12)' }"
            >
              <div class="bp-top">
                <span class="bp-type" :style="{ color: bp.color }">{{ bp.speciesType }}</span>
                <span v-if="bp.isSynthesized" class="bp-badge active" :style="{ background: bp.color }">已誕生</span>
                <span v-else-if="stats.activeIncubatingOrganism === bp.id" class="bp-badge incubating">培育中...</span>
                <span v-else class="bp-badge locked">待拼接</span>
              </div>

              <h4 class="bp-name">{{ bp.name }}</h4>
              <p class="bp-desc">{{ bp.description }}</p>

              <div class="bp-buffs">
                <div class="buff-row">
                  <span class="b-label">⚔️ 戰鬥強化:</span>
                  <span class="b-val">{{ bp.combatBuff }}</span>
                </div>
                <div class="buff-row">
                  <span class="b-label">🛠️ 功能特化:</span>
                  <span class="b-val">{{ bp.utilityPerk }}</span>
                </div>
              </div>

              <div class="bp-reqs">
                <span class="req-title">需要基因:</span>
                <div class="req-tags">
                  <span
                    v-for="sId in bp.requiredStrands"
                    :key="sId"
                    class="req-tag"
                    :style="{ color: strands[sId]?.color }"
                  >
                    {{ strands[sId]?.name.split(' ')[0] }}
                  </span>
                </div>
              </div>

              <button
                v-if="!bp.isSynthesized"
                class="incubate-btn"
                :disabled="stats.activeIncubatingOrganism !== null"
                @click="startIncubate(bp.id)"
              >
                🧬 啟動基因拼接與培育
              </button>
              <div v-else class="synthesized-tag" :style="{ color: bp.color }">
                ✓ 生物伴侶已在元宇宙世界漫步
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
  OrganismId,
  xenobiologyForge
} from '../engine/xenobiologyForge'
import { useUIStore } from '../stores/ui'

const ui = useUIStore()
const refreshTrigger = ref(0)

const stats = computed(() => {
  void refreshTrigger.value
  return xenobiologyForge.stats
})

const strands = computed(() => {
  void refreshTrigger.value
  return xenobiologyForge.strands
})

const strandsList = computed(() => {
  void refreshTrigger.value
  return Object.values(xenobiologyForge.strands)
})

const blueprints = computed(() => {
  void refreshTrigger.value
  return xenobiologyForge.blueprints
})

const blueprintsList = computed(() => {
  void refreshTrigger.value
  return Object.values(xenobiologyForge.blueprints)
})

function close(): void {
  ui.closeOverlay()
}

function harvestMutagen(): void {
  xenobiologyForge.harvestBioCatalyst(40)
  refreshTrigger.value += 1
}

function startIncubate(id: OrganismId): void {
  xenobiologyForge.startIncubation(id)
  refreshTrigger.value += 1
}

function fastForward(): void {
  xenobiologyForge.fastForwardIncubation(35)
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

.genome-modal {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(10, 18, 26, 0.95);
  border: 1px solid rgba(0, 255, 136, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(0, 255, 136, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-panel {
  background: rgba(16, 28, 36, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 255, 136, 0.25);
  background: rgba(0, 255, 136, 0.06);
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
  color: #00ff88;
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
  color: #00ff88;
}

.genome-content {
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
  color: #00ff88;
}

.catalyst-val {
  color: #00e5ff;
  text-shadow: 0 0 6px rgba(0, 229, 255, 0.4);
}

.harvest-btn {
  background: linear-gradient(135deg, #00c853, #69f0ae);
  color: #06120e;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.harvest-btn:hover {
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* Status Banner */
.status-banner {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  font-size: 0.82rem;
  color: #e8f5e9;
}

/* Active Incubator Stage */
.incubator-stage {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 255, 136, 0.08);
  border-color: rgba(0, 255, 136, 0.4);
}

.inc-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #00ff88;
}

.progress-track {
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c853, #00e5ff);
  transition: width 0.3s;
}

.accelerate-btn {
  align-self: flex-end;
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid #00ff88;
  color: #00ff88;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.accelerate-btn:hover {
  background: #00ff88;
  color: #05140d;
}

/* Strands Section */
.section-title {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.strands-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .strands-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.strand-card {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(14, 22, 30, 0.7);
}

.strand-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strand-name {
  font-size: 0.78rem;
  font-weight: 600;
}

.strand-cost {
  font-size: 0.68rem;
  color: #889;
}

.strand-desc {
  margin: 0;
  font-size: 0.7rem;
  color: #889;
  line-height: 1.3;
  min-height: 38px;
}

.strand-specs {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #9ab;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 6px;
  border-radius: 4px;
}

/* Blueprints Section */
.blueprints-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .blueprints-grid {
    grid-template-columns: 1fr;
  }
}

.bp-card {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(14, 22, 32, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.bp-card.synthesized {
  background: rgba(18, 28, 40, 0.85);
}

.bp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bp-type {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.bp-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
}

.bp-badge.active {
  color: #06120d;
}

.bp-badge.incubating {
  background: rgba(255, 145, 0, 0.2);
  color: #ff9100;
  border: 1px solid #ff9100;
}

.bp-badge.locked {
  background: rgba(255, 255, 255, 0.1);
  color: #889;
}

.bp-name {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #fff;
}

.bp-desc {
  margin: 0;
  font-size: 0.74rem;
  color: #ccd;
  line-height: 1.35;
}

.bp-buffs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 8px;
  border-radius: 4px;
}

.buff-row {
  display: flex;
  gap: 6px;
  font-size: 0.72rem;
}

.b-label {
  color: #889;
}

.b-val {
  color: #00ff88;
  font-weight: 600;
}

.bp-reqs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.req-title {
  font-size: 0.7rem;
  color: #889;
}

.req-tags {
  display: flex;
  gap: 6px;
}

.req-tag {
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.incubate-btn {
  margin-top: 4px;
  padding: 8px;
  background: linear-gradient(135deg, #00c853, #00e5ff);
  border: none;
  border-radius: 5px;
  color: #05140d;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.incubate-btn:hover:not(:disabled) {
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
  transform: translateY(-1px);
}

.incubate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.synthesized-tag {
  margin-top: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  padding: 4px;
}
</style>
