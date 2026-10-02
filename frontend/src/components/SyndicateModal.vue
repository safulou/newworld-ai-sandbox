<template>
  <div class="overlay" @click.self="close">
    <div class="syndicate-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🏴‍☠️</span>
          <h2>賽博公會聯盟領地戰 (Syndicate Corporate Wars)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Factions Selection Bar -->
      <div class="factions-bar">
        <div
          v-for="fac in warfare.factions"
          :key="fac.id"
          class="faction-chip"
          :class="{ active: warfare.player.faction === fac.id }"
          :style="{ borderColor: fac.color }"
          @click="warfare.joinFaction(fac.id)"
        >
          <div class="fac-title" :style="{ color: fac.color }">{{ fac.name }}</div>
          <div class="fac-perk">{{ fac.perkDescription }}</div>
          <div v-if="warfare.player.faction === fac.id" class="active-badge">✦ 目前效忠 ✦</div>
        </div>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Col 1: 5 Contested World Sectors -->
        <div class="col-territories card-box">
          <div class="subhead">
            <span>🗺️ 5 大戰略據點支配權與稅率分紅</span>
            <span class="tag-badge">全域動態爭奪中</span>
          </div>

          <div class="territories-list">
            <div
              v-for="sec in warfare.territories"
              :key="sec.id"
              class="sector-card"
              :class="{
                'my-faction': sec.controllingFaction === warfare.player.faction,
                'enemy-faction': sec.controllingFaction !== warfare.player.faction
              }"
            >
              <div class="sec-head">
                <span class="sec-name">{{ sec.name }}</span>
                <span class="fac-tag" :style="{ color: getFactionColor(sec.controllingFaction) }">
                  {{ getFactionName(sec.controllingFaction) }}
                </span>
              </div>
              <div class="sec-loc">{{ sec.location }}</div>

              <div class="sec-metrics">
                <div class="m-row">
                  <span>控制強度</span>
                  <strong>{{ sec.controlPoints }} / {{ sec.maxControlPoints }}</strong>
                </div>
                <div class="meter-track">
                  <div
                    class="meter-fill"
                    :style="{
                      width: (sec.controlPoints / sec.maxControlPoints * 100) + '%',
                      backgroundColor: getFactionColor(sec.controllingFaction)
                    }"
                  ></div>
                </div>
                <div class="sec-meta-foot">
                  <span>防衛階級: Tier {{ sec.defenseTier }}</span>
                  <span>每日分紅池: {{ sec.dailyDividends.toLocaleString() }} 點</span>
                </div>
              </div>

              <!-- War Operations -->
              <div class="sec-actions">
                <button
                  v-if="sec.controllingFaction === warfare.player.faction"
                  class="btn-defend"
                  @click="warfare.deployDefense(sec.id)"
                >
                  🛡️ 部署量子防衛陣列 (+60 控制點)
                </button>
                <button
                  v-else
                  class="btn-attack"
                  @click="warfare.launchBlitz(sec.id)"
                >
                  ⚔️ 發起子網突擊侵略 (Assault)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2: Player Military Profile & Dividends -->
        <div class="col-profile card-box">
          <div class="subhead">
            <span>🎖️ 開拓者軍事指揮檔案</span>
            <span class="rank-badge">{{ warfare.player.rank }}</span>
          </div>

          <div class="profile-card">
            <div class="p-row">
              <span class="p-lbl">軍階功勳</span>
              <span class="p-val good">{{ warfare.player.meritPoints }} 功勳點</span>
            </div>
            <div class="p-row">
              <span class="p-lbl">累計佔領大捷</span>
              <span class="p-val">{{ warfare.player.battlesWon }} 勝</span>
            </div>
            <div class="p-row">
              <span class="p-lbl">累計領取分紅</span>
              <span class="p-val">{{ warfare.player.totalDividendsClaimed.toLocaleString() }} 點</span>
            </div>
          </div>

          <!-- Dividend Claim Vault -->
          <div class="dividend-box">
            <div class="d-head">
              <span>💰 待領取領地稅率分紅</span>
              <span class="d-amt">{{ warfare.player.dividendClaimable.toLocaleString() }} 點</span>
            </div>
            <button
              class="btn-claim"
              :disabled="warfare.player.dividendClaimable <= 0"
              @click="warfare.claimDividends()"
            >
              📥 領取至個人錢包
            </button>
          </div>

          <!-- Military War Logs -->
          <div class="subhead" style="margin-top: 14px; margin-bottom: 6px;">
            <span>📜 陣營即時前線戰報</span>
          </div>
          <div class="war-logs">
            <div v-for="(log, idx) in warfare.warLogs" :key="idx" class="w-line">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { syndicateWarfare } from '@/engine/syndicateWarfare'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const warfare = syndicateWarfare

function close(): void {
  ui.closeOverlay()
}

function getFactionName(fId: string): string {
  const f = warfare.factions.find(x => x.id === fId)
  return f ? f.name : fId
}

function getFactionColor(fId: string): string {
  const f = warfare.factions.find(x => x.id === fId)
  return f ? f.color : '#00ffff'
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 20, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.syndicate-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(8, 14, 30, 0.96), rgba(18, 24, 48, 0.96));
  border: 1px solid rgba(255, 170, 0, 0.35);
  box-shadow: 0 0 35px rgba(255, 170, 0, 0.2);
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
  border-bottom: 1px solid rgba(255, 170, 0, 0.2);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #ffaa00;
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
}

.close-btn {
  background: transparent;
  border: none;
  color: #88aacc;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-btn:hover { color: #ff0055; }

/* Factions Bar */
.factions-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.faction-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.faction-chip:hover { background: rgba(255, 255, 255, 0.08); }
.faction-chip.active { background: rgba(255, 170, 0, 0.15); box-shadow: 0 0 10px rgba(255, 170, 0, 0.2); }

.fac-title { font-weight: bold; font-size: 0.85rem; }
.fac-perk { font-size: 0.7rem; color: #88aacc; }
.active-badge { font-size: 0.65rem; color: #ffaa00; font-weight: bold; margin-top: 2px; }

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
  background: rgba(255, 170, 0, 0.15);
  color: #ffaa00;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Territories */
.territories-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
}

.sector-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sector-card.my-faction { border-left: 4px solid #00ff88; }
.sector-card.enemy-faction { border-left: 4px solid #ff0055; }

.sec-head {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.sec-name { font-size: 0.95rem; }
.fac-tag { font-size: 0.8rem; }

.sec-loc { font-size: 0.75rem; color: #88aacc; }

.sec-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.meter-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: width 0.2s ease;
}

.sec-meta-foot {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #6688aa;
}

.sec-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.btn-defend {
  flex: 1;
  padding: 6px;
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid #00ff88;
  color: #00ff88;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-attack {
  flex: 1;
  padding: 6px;
  background: rgba(255, 0, 85, 0.2);
  border: 1px solid #ff0055;
  color: #ff5588;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

/* Col Profile */
.rank-badge {
  background: #ffaa00;
  color: #000;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.p-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
.good { color: #00ff88; font-weight: bold; }

.dividend-box {
  background: rgba(255, 170, 0, 0.12);
  border: 1px solid rgba(255, 170, 0, 0.35);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.d-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}
.d-amt { font-size: 1.15rem; font-weight: bold; color: #ffaa00; }

.btn-claim {
  padding: 10px;
  background: linear-gradient(90deg, #ff8800, #ffaa00);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-claim:disabled { background: rgba(255, 255, 255, 0.1); color: #666; cursor: not-allowed; }

.war-logs {
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

.w-line { margin: 3px 0; }
</style>
