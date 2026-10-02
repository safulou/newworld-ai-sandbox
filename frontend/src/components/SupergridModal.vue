<template>
  <div class="overlay" @click.self="close">
    <div class="supergrid-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">⚡</span>
          <h2>全服多基地超導電網同調與能源交易調度 (Supergrid Power & Market)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Top High-Voltage Status Banner -->
      <div class="top-banner">
        <div class="banner-stat">
          <span class="b-lbl">⚡ 全網總發電</span>
          <span class="b-val gen">{{ grid.stats.totalGenerationMW.toLocaleString() }} MW</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🔌 全網總負載</span>
          <span class="b-val dem">{{ grid.stats.totalDemandMW.toLocaleString() }} MW</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">⏱️ 電網交流頻率</span>
          <span class="b-val" :class="getFreqClass(grid.stats.gridFrequency)">
            {{ grid.stats.gridFrequency.toFixed(2) }} Hz
          </span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🔋 SMES 超導磁能儲備</span>
          <span class="b-val">{{ Math.round(grid.stats.smesStoredMWh).toLocaleString() }} / {{ grid.stats.smesCapacityMWh.toLocaleString() }} MWh</span>
        </div>
        <div class="banner-stat">
          <span class="b-lbl">🛡️ 電網穩定指數</span>
          <span class="b-val" :class="grid.stats.stabilityPercent > 80 ? 'gen' : 'danger'">
            {{ grid.stats.stabilityPercent }}%
          </span>
        </div>
        <div class="banner-actions">
          <button class="btn-sync" @click="grid.autoBalanceFrequency()">
            ⚖️ 智慧同調 (Auto-Sync)
          </button>
          <button class="btn-shed" @click="grid.emergencyLoadShedding()">
            ⚡ 緊急卸載 (Shed)
          </button>
          <button v-if="grid.stats.isBlackout" class="btn-blackstart" @click="grid.manualBlackStart()">
            🔌 黑啟動 (Black Start)
          </button>
        </div>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="content-body">
        <!-- Col 1: Substations Grid Network -->
        <div class="col-substations card-box">
          <div class="subhead">
            <span>🌐 4 大次元骨幹變電所節點 (Interconnected Substations)</span>
            <span class="tag-badge">超導母線 100% 互聯</span>
          </div>

          <div class="substations-grid">
            <div
              v-for="sub in grid.substations"
              :key="sub.id"
              class="substation-card"
              :class="{ offline: !sub.isOnline, shed: sub.isShed }"
            >
              <div class="sub-head">
                <span class="sub-name" :style="{ color: sub.color }">{{ sub.name }}</span>
                <button class="toggle-btn" @click="grid.toggleSubstation(sub.id)">
                  {{ sub.isOnline ? '併網中' : '已離線' }}
                </button>
              </div>

              <div class="sub-loc">{{ sub.location }}</div>

              <div class="sub-power-row">
                <div class="p-item">
                  <span class="p-lbl">發電輸出:</span>
                  <strong class="gen">{{ sub.generationMW }} MW</strong>
                </div>
                <div class="p-item">
                  <span class="p-lbl">負載需求:</span>
                  <strong class="dem">{{ sub.isShed ? (sub.demandMW * 0.5) : sub.demandMW }} MW</strong>
                </div>
              </div>

              <div class="sub-slider-row">
                <label>調節出力 (MW):</label>
                <div class="slider-ctrls">
                  <button class="adj-btn" @click="grid.adjustSubstationOutput(sub.id, -200)">-200</button>
                  <input
                    type="range"
                    min="200"
                    max="6000"
                    step="100"
                    :value="sub.generationMW"
                    :disabled="!sub.isOnline"
                    @input="(e) => onSubOutputChange(sub.id, e)"
                  />
                  <button class="adj-btn" @click="grid.adjustSubstationOutput(sub.id, 200)">+200</button>
                </div>
              </div>

              <div class="sub-foot">
                <span v-if="sub.isShed" class="shed-badge">⚠️ 部分負載已切除</span>
                <span v-else class="norm-badge">✅ 全額穩定供電</span>
                <button class="shed-toggle" @click="grid.emergencyLoadShedding(sub.id)">
                  {{ sub.isShed ? '恢復負載' : '切除負載' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2: Energy & Carbon Market Exchange -->
        <div class="col-market card-box">
          <div class="subhead">
            <span>📈 即時能源期貨與碳配額交易所</span>
            <span class="ticker-trend" :class="grid.market.trend">
              {{ grid.market.trend === 'up' ? '▲ 上漲' : (grid.market.trend === 'down' ? '▼ 下跌' : '◆ 平穩') }}
            </span>
          </div>

          <!-- Market Prices Tickers -->
          <div class="tickers-panel">
            <div class="ticker-box">
              <span class="t-lbl">即時電價 (KWh)</span>
              <span class="t-val">{{ grid.market.kwhPrice.toFixed(3) }} <small>Credits</small></span>
            </div>
            <div class="ticker-box">
              <span class="t-lbl">綠色碳配額 (每噸)</span>
              <span class="t-val">{{ grid.market.carbonPrice.toFixed(1) }} <small>Credits</small></span>
            </div>
          </div>

          <!-- Price Sparkline Canvas -->
          <div class="chart-wrapper">
            <canvas ref="chartCanvas" width="380" height="90" class="spark-cvs"></canvas>
          </div>

          <!-- Player Power Wallet -->
          <div class="wallet-card">
            <div class="subhead" style="margin-bottom: 6px;">
              <span>💳 開拓者電力錢包</span>
              <span class="profit-val">累計獲利: {{ grid.wallet.totalProfit.toLocaleString() }} 點</span>
            </div>
            <div class="wallet-stats">
              <div class="w-item">
                <span class="w-lbl">餘額</span>
                <span class="w-val">{{ grid.wallet.credits.toLocaleString() }} 點</span>
              </div>
              <div class="w-item">
                <span class="w-lbl">持倉電力</span>
                <span class="w-val">{{ grid.wallet.powerContractsKWh.toLocaleString() }} KWh</span>
              </div>
              <div class="w-item">
                <span class="w-lbl">持倉碳權</span>
                <span class="w-val">{{ grid.wallet.carbonCreditsTon }} 噸</span>
              </div>
            </div>
          </div>

          <!-- Quick Trading Desk -->
          <div class="trade-desk">
            <div class="subhead" style="margin-bottom: 6px;">
              <span>⚡ 快速下單撮合台</span>
            </div>
            <div class="trade-buttons-grid">
              <button class="t-btn buy" @click="grid.buyPower(1000)">買入 1,000 KWh</button>
              <button class="t-btn sell" @click="grid.sellPower(1000)">賣出 1,000 KWh</button>
              <button class="t-btn buy" @click="grid.buyPower(5000)">買入 5,000 KWh</button>
              <button class="t-btn sell" @click="grid.sellPower(5000)">賣出 5,000 KWh</button>
              <button class="t-btn buy" @click="grid.buyCarbon(5)">購入 5 噸碳權</button>
              <button class="t-btn sell" @click="grid.sellCarbon(5)">售出 5 噸碳權</button>
            </div>
          </div>

          <!-- Dispatch Logs -->
          <div class="dispatch-logs">
            <div v-for="(log, idx) in grid.logs" :key="idx" class="d-line">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supergridPower } from '@/engine/supergridPower'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()
const grid = supergridPower
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartTimer: any = null

function close(): void {
  ui.closeOverlay()
}

function onSubOutputChange(subId: string, e: Event): void {
  const val = Number((e.target as HTMLInputElement).value)
  const sub = grid.substations.find(s => s.id === subId)
  if (sub) {
    grid.adjustSubstationOutput(subId, val - sub.generationMW)
  }
}

function getFreqClass(freq: number): string {
  if (freq >= 49.8 && freq <= 50.2) return 'gen'
  if (freq >= 49.4 && freq <= 50.6) return 'warn'
  return 'danger'
}

function renderChart(): void {
  const canvas = chartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fillRect(0, 0, width, height)

  const history = grid.market.priceHistory
  if (history.length < 2) return

  const min = Math.min(...history) * 0.95
  const max = Math.max(...history) * 1.05
  const stepX = width / (history.length - 1)

  ctx.beginPath()
  ctx.strokeStyle = '#00ffcc'
  ctx.lineWidth = 2

  history.forEach((val, i) => {
    const x = i * stepX
    const y = height - ((val - min) / (max - min)) * (height - 16) - 8
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  // Area under curve
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, 'rgba(0, 255, 200, 0.25)')
  grad.addColorStop(1, 'rgba(0, 255, 200, 0.0)')
  ctx.fillStyle = grad
  ctx.fill()
}

onMounted(() => {
  renderChart()
  chartTimer = setInterval(renderChart, 1000)
})

onUnmounted(() => {
  if (chartTimer) clearInterval(chartTimer)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 8, 20, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.supergrid-panel {
  width: 95vw;
  max-width: 1240px;
  height: 88vh;
  max-height: 820px;
  background: linear-gradient(135deg, rgba(8, 14, 30, 0.96), rgba(16, 24, 50, 0.96));
  border: 1px solid rgba(0, 255, 255, 0.35);
  box-shadow: 0 0 35px rgba(0, 255, 255, 0.2);
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
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-area h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
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
  background: rgba(0, 0, 0, 0.5);
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
.gen { color: #00ff88; }
.dem { color: #ffaa00; }
.warn { color: #ffaa00; }
.danger { color: #ff0055; }

.banner-actions {
  display: flex;
  gap: 8px;
}

.btn-sync {
  background: linear-gradient(90deg, #0088cc, #00ffff);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-shed {
  background: rgba(255, 170, 0, 0.25);
  border: 1px solid #ffaa00;
  color: #ffaa00;
  font-weight: bold;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-blackstart {
  background: rgba(255, 0, 85, 0.3);
  border: 1px solid #ff0055;
  color: #ff5588;
  font-weight: bold;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  animation: blink 0.8s infinite alternate;
}

@keyframes blink {
  from { opacity: 0.6; }
  to { opacity: 1.0; }
}

/* Content Body */
.content-body {
  display: grid;
  grid-template-columns: 1fr 420px;
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
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Substations Grid */
.substations-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.substation-card {
  background: rgba(20, 30, 60, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.substation-card.offline { opacity: 0.5; border-color: #555; }
.substation-card.shed { border-color: #ffaa00; }

.sub-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-name {
  font-weight: bold;
  font-size: 0.95rem;
}

.toggle-btn {
  background: rgba(0, 255, 200, 0.15);
  border: 1px solid rgba(0, 255, 200, 0.4);
  color: #00ffcc;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.sub-loc {
  font-size: 0.75rem;
  color: #88aacc;
  margin: 4px 0;
}

.sub-power-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin: 6px 0;
}

.sub-slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.75rem;
  color: #88aacc;
}

.slider-ctrls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.slider-ctrls input { flex: 1; }

.adj-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.7rem;
}

.sub-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.75rem;
}
.norm-badge { color: #00ff88; }
.shed-badge { color: #ffaa00; }

.shed-toggle {
  background: transparent;
  border: 1px solid #888;
  color: #ccc;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.7rem;
}

/* Col Market */
.col-market {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticker-trend.up { color: #00ff88; font-size: 0.8rem; }
.ticker-trend.down { color: #ff0055; font-size: 0.8rem; }
.ticker-trend.stable { color: #77aacc; font-size: 0.8rem; }

.tickers-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ticker-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.t-lbl {
  font-size: 0.7rem;
  color: #88aacc;
}

.t-val {
  font-size: 1.15rem;
  font-weight: bold;
  color: #00ffff;
}

.chart-wrapper {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
  height: 90px;
}
.spark-cvs {
  width: 100%;
  height: 100%;
  display: block;
}

.wallet-card {
  background: rgba(0, 0, 0, 0.4);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.profit-val {
  color: #00ff88;
  font-size: 0.8rem;
}

.wallet-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.w-item {
  display: flex;
  flex-direction: column;
}
.w-lbl { font-size: 0.65rem; color: #88aacc; }
.w-val { font-size: 0.85rem; font-weight: bold; color: #fff; }

.trade-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.t-btn {
  padding: 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
}
.t-btn.buy { background: rgba(0, 255, 136, 0.2); border: 1px solid #00ff88; color: #00ff88; }
.t-btn.sell { background: rgba(255, 170, 0, 0.2); border: 1px solid #ffaa00; color: #ffaa00; }
.t-btn:hover { filter: brightness(1.2); }

.dispatch-logs {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #88aacc;
  overflow-y: auto;
  flex: 1;
}

.d-line {
  margin: 2px 0;
}
</style>
