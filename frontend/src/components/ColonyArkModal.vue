<template>
  <div class="overlay" @click.self="close">
    <div class="ark-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🛸</span>
          <h2>星際殖民地母艦生態圈 (Interstellar Colony Ark & Biosphere)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Top Life Support Metrics Banner -->
      <div class="top-banner">
        <div class="banner-stat">
          <span class="b-lbl">👥 殖民總人口</span>
          <span class="b-val pop">{{ ark.stats.population }} / {{ ark.stats.maxPopulation }}</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">😊 居民幸福度</span>
          <span class="b-val" :class="ark.stats.happiness > 75 ? 'good' : 'warn'">{{ Math.round(ark.stats.happiness) }}%</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🫁 氧氣大氣飽和度</span>
          <span class="b-val" :class="ark.stats.oxygenLevel > 90 ? 'good' : 'danger'">{{ ark.stats.oxygenLevel.toFixed(1) }}%</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🌀 人造引力場</span>
          <span class="b-val">{{ ark.stats.gravityG.toFixed(2) }} G</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🌾 儲備生物質 (糧食)</span>
          <span class="b-val good">{{ ark.stats.biomassKg.toLocaleString() }} kg</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">⚡ 母艦微奇異點輸出</span>
          <span class="b-val">{{ ark.stats.energyMW.toLocaleString() }} MW</span>
        </div>
      </div>

      <!-- Active Crisis Warning Banner -->
      <div v-if="ark.stats.activeCrisis" class="crisis-banner">
        <div class="crisis-info">
          <span class="crisis-icon">🚨</span>
          <div>
            <strong>【{{ ark.stats.activeCrisis.title }}】({{ ark.stats.activeCrisis.severity }})</strong>
            <p>{{ ark.stats.activeCrisis.description }} (尚餘 {{ Math.ceil(ark.stats.activeCrisis.timeRemaining) }} 秒)</p>
          </div>
        </div>
        <button class="btn-resolve" @click="ark.resolveCrisis()">
          🛠️ 緊急派員排除危機
        </button>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Col 1: Ark Modules Grid -->
        <div class="col-sections card-box">
          <div class="subhead">
            <span>🏗️ 母艦 4 大核心艙段擴建與人口派工</span>
            <span class="tag-badge">自律生態循環 100%</span>
          </div>

          <div class="sections-grid">
            <div
              v-for="sec in ark.sections"
              :key="sec.id"
              class="section-card"
              :style="{ borderColor: sec.color }"
            >
              <div class="sec-head">
                <span class="sec-name" :style="{ color: sec.color }">{{ sec.name }}</span>
                <span class="sec-tier">Level {{ sec.level }}/{{ sec.maxLevel }}</span>
              </div>
              <div class="sec-desc">{{ sec.description }}</div>
              
              <div class="sec-metrics">
                <span>產能效率: <strong>{{ sec.efficiency }}%</strong></span>
                <span>結構完整度: <strong>{{ sec.health }}%</strong></span>
              </div>

              <!-- Colonist Assignment -->
              <div class="assignment-row">
                <label>派工工程師: <strong>{{ sec.assignedColonists }} 人</strong></label>
                <div class="assign-btns">
                  <button class="adj-btn" @click="ark.assignColonists(sec.id, -10)">-10</button>
                  <button class="adj-btn" @click="ark.assignColonists(sec.id, 10)">+10</button>
                </div>
              </div>

              <div class="sec-actions">
                <button
                  class="btn-upgrade"
                  :disabled="sec.level >= sec.maxLevel || ark.stats.biomassKg < sec.level * 600"
                  @click="ark.upgradeSection(sec.id)"
                >
                  {{ sec.level >= sec.maxLevel ? '已達極限擴建' : `擴建擴充 (-${sec.level * 600}kg 糧食)` }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2: Telemetry & Demographics -->
        <div class="col-telemetry card-box">
          <div class="subhead">
            <span>📊 殖民人口統計與生態報告</span>
            <span class="cycle-tag">循環: {{ ark.stats.totalCycles }} 週期</span>
          </div>

          <div class="demo-stats">
            <div class="d-item">
              <span class="d-lbl">累計新生二代</span>
              <span class="d-val good">+{{ ark.stats.birthsCount }} 人</span>
            </div>
            <div class="d-item">
              <span class="d-lbl">意外損耗</span>
              <span class="d-val danger">-{{ ark.stats.lossesCount }} 人</span>
            </div>
            <div class="d-item">
              <span class="d-lbl">二氧化碳洗滌率</span>
              <span class="d-val">{{ ark.stats.co2ScrubRate.toFixed(1) }}%</span>
            </div>
          </div>

          <!-- Crisis Simulator Buttons (Debug/Sandbox features) -->
          <div class="crisis-triggers">
            <div class="subhead" style="margin-bottom: 6px;">
              <span>⚠️ 應急災害演練觸發</span>
            </div>
            <div class="trigger-buttons">
              <button class="trig-btn" @click="ark.triggerEmergencyCrisis('oxygen_leak')">演練: 隕石漏氧</button>
              <button class="trig-btn" @click="ark.triggerEmergencyCrisis('solar_flare')">演練: 脈衝輻射</button>
              <button class="trig-btn" @click="ark.triggerEmergencyCrisis('gravity_fluctuation')">演練: 重力失諧</button>
            </div>
          </div>

          <!-- Logs -->
          <div class="subhead" style="margin-top: 10px; margin-bottom: 6px;">
            <span>📜 艦載中央通訊廣播</span>
          </div>
          <div class="ark-logs">
            <div v-for="(log, idx) in ark.logs" :key="idx" class="a-line">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colonyArk } from '@/engine/colonyArk'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const ark = colonyArk

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 24, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ark-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(8, 16, 36, 0.96), rgba(16, 28, 56, 0.96));
  border: 1px solid rgba(0, 255, 200, 0.35);
  box-shadow: 0 0 35px rgba(0, 255, 200, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e0f0ff;
  font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(0, 255, 200, 0.2);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #00ffcc;
  text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
}

.close-btn {
  background: transparent;
  border: none;
  color: #88aacc;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-btn:hover { color: #ff0055; }

/* Top Banner */
.top-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 10px;
}

.banner-stat {
  display: flex;
  flex-direction: column;
}

.b-lbl {
  font-size: 0.7rem;
  color: #88aacc;
}

.b-val {
  font-size: 1.1rem;
  font-weight: bold;
}
.pop { color: #00ffff; }
.good { color: #00ff88; }
.warn { color: #ffaa00; }
.danger { color: #ff0055; }

.crisis-banner {
  background: rgba(255, 0, 85, 0.25);
  border-bottom: 1px solid #ff0055;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crisis-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.crisis-icon { font-size: 1.4rem; }
.crisis-info p { margin: 2px 0 0; font-size: 0.75rem; color: #ffaacc; }

.btn-resolve {
  background: #ff0055;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 85, 0.5);
}

/* Content Body */
.content-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  padding: 16px;
  flex: 1;
  overflow: hidden;
}

.card-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.subhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 600;
  color: #77ccff;
  margin-bottom: 10px;
}

.tag-badge {
  background: rgba(0, 255, 200, 0.15);
  color: #00ffcc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Sections Grid */
.sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.section-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sec-name { font-weight: bold; font-size: 0.95rem; }
.sec-tier { font-size: 0.75rem; color: #88aacc; }

.sec-desc {
  font-size: 0.75rem;
  color: #a0c0e0;
  margin: 6px 0;
  line-height: 1.3;
}

.sec-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin: 6px 0;
}

.assignment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin: 6px 0;
}

.assign-btns {
  display: flex;
  gap: 4px;
}
.adj-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.7rem;
}

.btn-upgrade {
  width: 100%;
  padding: 8px;
  background: rgba(0, 255, 200, 0.2);
  border: 1px solid rgba(0, 255, 200, 0.4);
  color: #00ffcc;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
.btn-upgrade:disabled {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: not-allowed;
}

/* Col Telemetry */
.demo-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.d-item {
  background: rgba(255, 255, 255, 0.04);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.d-lbl { font-size: 0.65rem; color: #88aacc; }
.d-val { font-size: 0.95rem; font-weight: bold; color: #fff; }

.trigger-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}

.trig-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #a0c0e0;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}
.trig-btn:hover { background: rgba(255, 170, 0, 0.2); border-color: #ffaa00; color: #ffaa00; }

.ark-logs {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #88ccee;
  overflow-y: auto;
  flex: 1;
}

.a-line {
  margin: 3px 0;
}
</style>
