<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="fleet-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🚀</span>
          <h2>多母艦軌道編隊與深空遠征艦隊 (Ark Fleet Expeditions)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="modal-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          🛸 艦隊編隊與巡航
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'zones' }"
          @click="activeTab = 'zones'"
        >
          🌌 深空遠征星區
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'ships' }"
          @click="activeTab = 'ships'"
        >
          ⚓ 旗艦造船裝配
        </button>
      </div>

      <!-- Tab 1: Overview & Cruise Telemetry -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <!-- Resource Status Bar -->
        <div class="resource-bar">
          <div class="res-item">
            <span class="res-icon">⛽</span>
            <span class="res-label">反物質燃油:</span>
            <span class="res-val">{{ stats.fuel }} / {{ stats.maxFuel }}</span>
          </div>
          <div class="res-item">
            <span class="res-icon">📦</span>
            <span class="res-label">深空補給箱:</span>
            <span class="res-val">{{ stats.supplies }} / {{ stats.maxSupplies }}</span>
          </div>
          <div class="res-item">
            <span class="res-icon">💣</span>
            <span class="res-label">重型彈藥儲備:</span>
            <span class="res-val">{{ stats.ammo }} / {{ stats.maxAmmo }}</span>
          </div>
          <div class="res-item">
            <span class="res-icon">💖</span>
            <span class="res-label">艦隊士氣:</span>
            <span class="res-val" :class="{ low: stats.fleetMorale < 40 }">{{ stats.fleetMorale }}%</span>
          </div>
          <div class="res-item">
            <span class="res-icon">💳</span>
            <span class="res-label">遠征保險庫:</span>
            <span class="res-val highlight">{{ stats.creditsVault.toLocaleString() }} CR</span>
          </div>
        </div>

        <!-- Formation Selection -->
        <div class="formation-section">
          <div class="section-title">
            <span>🛡️ 戰術星艦編隊陣型:</span>
            <span class="buff-desc">{{ engine.getFormationBuff() }}</span>
          </div>
          <div class="formation-grid">
            <button
              class="form-btn"
              :class="{ active: stats.formation === 'v_formation' }"
              @click="setFormation('v_formation')"
            >
              <div class="form-icon">🔺</div>
              <div class="form-name">V 形箭頭衝刺陣 (V-Formation)</div>
              <div class="form-detail">航速 +25%，燃油經濟 +15%</div>
            </button>
            <button
              class="form-btn"
              :class="{ active: stats.formation === 'diamond' }"
              @click="setFormation('diamond')"
            >
              <div class="form-icon">💠</div>
              <div class="form-name">鑽石偏折重裝陣 (Diamond)</div>
              <div class="form-detail">護盾防禦同調 +30%</div>
            </button>
            <button
              class="form-btn"
              :class="{ active: stats.formation === 'orbital_ring' }"
              @click="setFormation('orbital_ring')"
            >
              <div class="form-icon">⭕</div>
              <div class="form-name">軌道環繞護航陣 (Orbital Ring)</div>
              <div class="form-detail">貨物採集 +40%，補給消耗 -20%</div>
            </button>
            <button
              class="form-btn"
              :class="{ active: stats.formation === 'hyper_line' }"
              @click="setFormation('hyper_line')"
            >
              <div class="form-icon">⚡</div>
              <div class="form-name">超空間突穿縱隊 (Hyper Line)</div>
              <div class="form-detail">遭遇戰攻堅先攻火力 +50%</div>
            </button>
          </div>
        </div>

        <!-- Active Transit Telemetry -->
        <div class="telemetry-card">
          <div class="tele-header">
            <h3>📡 當前航行折躍動態與遙測儀表</h3>
            <span class="state-badge" :class="stats.state">
              {{ stateLabel }}
            </span>
          </div>

          <div v-if="stats.state === 'in_transit' || stats.state === 'returning' || stats.state === 'completed'" class="progress-wrap">
            <div class="progress-info">
              <span>折躍進度: {{ Math.round(stats.transitProgress) }}%</span>
              <span>航速: {{ stats.transitSpeedLYs }} LY/s</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${stats.transitProgress}%` }"></div>
            </div>
          </div>

          <div v-if="stats.encounterResolvedMsg" class="event-msg">
            {{ stats.encounterResolvedMsg }}
          </div>

          <!-- Active Encounter Interactive Dialog -->
          <div v-if="stats.activeEncounter" class="encounter-alert glass-panel">
            <div class="encounter-header">
              <span class="enc-badge">{{ stats.activeEncounter.threatLevel }} 威脅</span>
              <h4>⚠️ {{ stats.activeEncounter.title }}</h4>
            </div>
            <p class="enc-desc">{{ stats.activeEncounter.description }}</p>
            <div class="enc-options">
              <button
                v-for="opt in stats.activeEncounter.options"
                :key="opt.action"
                class="opt-btn"
                @click="resolveEncounter(opt.action)"
              >
                <span>{{ opt.label }}</span>
                <span class="chance">勝率: {{ Math.round(opt.successChance * 100) }}%</span>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="tele-actions">
            <button
              v-if="stats.state === 'in_transit' || stats.state === 'encounter'"
              class="action-btn danger"
              @click="abortExpedition"
            >
              🛑 中斷遠征並折返母港
            </button>
            <button
              v-if="stats.state === 'completed'"
              class="action-btn success"
              @click="returnHangar"
            >
              🏆 回收成果並凱旋母港
            </button>
            <button
              class="action-btn primary"
              @click="resupplyFleet"
              :disabled="stats.creditsVault < 8000"
            >
              ⛽ 艦隊一鍵補給 (8,000 CR)
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Expedition Zones -->
      <div v-if="activeTab === 'zones'" class="tab-content">
        <div class="zones-grid">
          <div
            v-for="zone in expeditionZones"
            :key="zone.id"
            class="zone-card glass-panel"
            :style="{ borderColor: zone.color }"
          >
            <div class="zone-top">
              <span class="diff-badge" :class="zone.difficulty.toLowerCase()">
                {{ zone.difficulty }}
              </span>
              <span class="zone-dist">📍 {{ zone.distanceLY.toLocaleString() }} LY</span>
            </div>
            <h3 :style="{ color: zone.color }">{{ zone.name }}</h3>
            <p class="zone-sector">{{ zone.sectorName }}</p>
            <p class="zone-desc">{{ zone.description }}</p>

            <div class="zone-costs">
              <span>⛽ {{ zone.fuelCost }} 燃油</span>
              <span>📦 {{ zone.suppliesCost }} 補給</span>
            </div>

            <div class="zone-rewards">
              <span class="rew-title">🎁 潛在發現:</span>
              <span v-for="r in zone.potentialRewards" :key="r" class="rew-tag">{{ r }}</span>
            </div>

            <button
              class="launch-btn"
              :disabled="stats.state !== 'docked' || stats.fuel < zone.fuelCost || stats.supplies < zone.suppliesCost"
              @click="launchExpedition(zone.id)"
            >
              {{ stats.state !== 'docked' ? '艦隊遠征執行中' : '🚀 啟動超空間遠征' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 3: Capital Ships Fleet -->
      <div v-if="activeTab === 'ships'" class="tab-content">
        <div class="ships-actions">
          <button class="action-btn success" @click="repairAllShips" :disabled="stats.creditsVault < 5000">
            🔧 全艦隊裝甲與偏折盾維修 (5,000 CR)
          </button>
        </div>
        <div class="ships-grid">
          <div v-for="ship in ships" :key="ship.id" class="ship-card glass-panel">
            <div class="ship-header">
              <span class="ship-icon">{{ ship.icon }}</span>
              <div>
                <h4>{{ ship.name }}</h4>
                <span class="ship-role">{{ ship.classRole }} (Lv.{{ ship.level }})</span>
              </div>
            </div>

            <div class="ship-bars">
              <div class="bar-row">
                <span>🛡️ 偏折護盾:</span>
                <div class="mini-bar">
                  <div class="mini-fill shield" :style="{ width: `${(ship.shield / ship.maxShield) * 100}%` }"></div>
                </div>
                <span>{{ ship.shield }} / {{ ship.maxShield }}</span>
              </div>
              <div class="bar-row">
                <span>❤️ 裝甲外殼:</span>
                <div class="mini-bar">
                  <div class="mini-fill hull" :style="{ width: `${(ship.hull / ship.maxHull) * 100}%` }"></div>
                </div>
                <span>{{ ship.hull }} / {{ ship.maxHull }}</span>
              </div>
            </div>

            <div class="ship-stats">
              <span>⚔️ 火力: {{ ship.firepower }}</span>
              <span>📦 貨艙: {{ ship.cargoCapacity }}</span>
            </div>

            <p class="ship-perk">✨ 特效: {{ ship.specialPerk }}</p>

            <button
              class="upgrade-btn"
              :disabled="stats.creditsVault < ship.level * 15000"
              @click="upgradeShip(ship.id)"
            >
              ⬆️ 升級裝甲與火控 ({{ (ship.level * 15000).toLocaleString() }} CR)
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
import {
  arkFleetExpeditions,
  EXPEDITION_ZONES,
  type FormationType,
  type ZoneId,
  type ShipClassId
} from '@/engine/arkFleetExpeditions'

const ui = useUIStore()
const engine = arkFleetExpeditions
const stats = engine.stats
const ships = engine.ships
const expeditionZones = EXPEDITION_ZONES

const activeTab = ref<'overview' | 'zones' | 'ships'>('overview')

const stateLabel = computed(() => {
  switch (stats.state) {
    case 'docked': return '泊定母港 (Docked)'
    case 'in_transit': return '超空間巡弋折躍中 (In Warp)'
    case 'encounter': return '遭遇深空異常事件 (Encounter)'
    case 'returning': return '緊急折返母港中 (Returning)'
    case 'completed': return '遠征成功抵達目標 (Completed)'
    default: return '待命'
  }
})

function close(): void {
  ui.closeOverlay()
}

function setFormation(form: FormationType): void {
  engine.setFormation(form)
}

function launchExpedition(zoneId: ZoneId): void {
  if (engine.launchExpedition(zoneId)) {
    activeTab.value = 'overview'
  }
}

function abortExpedition(): void {
  engine.abortExpedition()
}

function returnHangar(): void {
  engine.returnToHangar()
}

function resolveEncounter(action: string): void {
  engine.resolveEncounter(action)
}

function resupplyFleet(): void {
  engine.resupplyFleet()
}

function upgradeShip(shipId: ShipClassId): void {
  engine.upgradeShip(shipId)
}

function repairAllShips(): void {
  engine.repairAllShips()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.fleet-modal {
  width: 92vw;
  max-width: 980px;
  max-height: 88vh;
  background: rgba(10, 16, 28, 0.94);
  border: 1px solid rgba(0, 255, 255, 0.35);
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  color: #e0f7fa;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
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
  font-weight: 700;
  color: #00ffff;
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #88c0d0;
  font-size: 1.4rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff5252;
}

.modal-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 24px 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.15);
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-bottom: none;
  padding: 8px 18px;
  color: #a0c0d0;
  font-size: 0.95rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(0, 255, 255, 0.15);
  border-color: rgba(0, 255, 255, 0.4);
  color: #00ffff;
  font-weight: 600;
}

.tab-content {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.resource-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  background: rgba(0, 20, 35, 0.6);
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.res-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.res-val {
  font-weight: 700;
  color: #80deea;
}

.res-val.highlight {
  color: #ffd54f;
}

.res-val.low {
  color: #ff5252;
}

.formation-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #80d8ff;
}

.buff-desc {
  font-size: 0.85rem;
  color: #a7ffeb;
}

.formation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.form-btn {
  background: rgba(12, 24, 40, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: inherit;
}

.form-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.5);
}

.form-btn.active {
  background: rgba(0, 255, 255, 0.18);
  border-color: #00ffff;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
}

.form-icon {
  font-size: 1.4rem;
  margin-bottom: 4px;
}

.form-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #e0f7fa;
}

.form-detail {
  font-size: 0.8rem;
  color: #80cbc4;
  margin-top: 4px;
}

.telemetry-card {
  background: rgba(8, 18, 32, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tele-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tele-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #00e5ff;
}

.state-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}

.state-badge.in_transit {
  background: rgba(0, 229, 255, 0.25);
  color: #00ffff;
}

.state-badge.encounter {
  background: rgba(255, 170, 0, 0.3);
  color: #ffd54f;
}

.state-badge.completed {
  background: rgba(0, 255, 136, 0.3);
  color: #69f0ae;
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #80deea;
}

.progress-bar {
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00b0ff, #00e5ff);
  transition: width 0.3s;
}

.event-msg {
  background: rgba(0, 229, 255, 0.12);
  border-left: 3px solid #00ffff;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #e0f7fa;
}

.encounter-alert {
  background: rgba(40, 20, 10, 0.85);
  border: 1px solid #ff9100;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.encounter-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.enc-badge {
  background: #ff3d00;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.encounter-header h4 {
  margin: 0;
  color: #ffd54f;
  font-size: 1rem;
}

.enc-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #ffe0b2;
}

.enc-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.opt-btn {
  background: rgba(255, 145, 0, 0.2);
  border: 1px solid #ff9100;
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
}

.opt-btn:hover {
  background: rgba(255, 145, 0, 0.4);
}

.opt-btn .chance {
  color: #ffe082;
  font-weight: 700;
}

.tele-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #00b4d8;
  color: #fff;
}

.action-btn.primary:hover:not(:disabled) {
  background: #0096c7;
}

.action-btn.success {
  background: #00c853;
  color: #fff;
}

.action-btn.success:hover:not(:disabled) {
  background: #00e676;
}

.action-btn.danger {
  background: #d50000;
  color: #fff;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.zone-card {
  background: rgba(10, 20, 36, 0.75);
  border: 1px solid;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zone-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.diff-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.diff-badge.normal {
  background: rgba(0, 229, 255, 0.3);
  color: #00e5ff;
}

.diff-badge.hard {
  background: rgba(255, 170, 0, 0.3);
  color: #ffaa00;
}

.diff-badge.extreme {
  background: rgba(189, 0, 255, 0.3);
  color: #e040fb;
}

.diff-badge.nightmare {
  background: rgba(255, 0, 85, 0.3);
  color: #ff1744;
}

.zone-dist {
  font-size: 0.8rem;
  color: #80cbc4;
}

.zone-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.zone-sector {
  margin: 0;
  font-size: 0.8rem;
  color: #88c0d0;
}

.zone-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #cfd8dc;
  line-height: 1.35;
}

.zone-costs {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #ffcc80;
}

.zone-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.8rem;
}

.rew-title {
  color: #80deea;
}

.rew-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: #e0f2f1;
}

.launch-btn {
  margin-top: auto;
  background: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.launch-btn:hover:not(:disabled) {
  background: #00acc1;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.4);
}

.launch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ships-actions {
  display: flex;
  justify-content: flex-end;
}

.ships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.ship-card {
  background: rgba(10, 20, 36, 0.75);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ship-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ship-icon {
  font-size: 1.8rem;
}

.ship-header h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #e0f7fa;
}

.ship-role {
  font-size: 0.75rem;
  color: #80cbc4;
}

.ship-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #b0bec5;
}

.mini-bar {
  flex: 1;
  margin: 0 8px;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}

.mini-fill.shield {
  height: 100%;
  background: #00e5ff;
}

.mini-fill.hull {
  height: 100%;
  background: #00e676;
}

.ship-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #ffd54f;
}

.ship-perk {
  margin: 0;
  font-size: 0.8rem;
  color: #a7ffeb;
}

.upgrade-btn {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid #00ffff;
  border-radius: 6px;
  color: #00ffff;
  padding: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-btn:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.3);
}

.upgrade-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
