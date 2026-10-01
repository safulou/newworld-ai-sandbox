<template>
  <div class="overlay" @click.self="close">
    <div class="deck-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">💻</span>
          <h2>賽博甲板終端與網絡入侵協定 (Cyberdeck Netrunner)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Main Layout: Split Screen -->
      <div class="content-body">
        <!-- Left: CRT CLI Terminal -->
        <div class="col-terminal">
          <div class="crt-screen">
            <div class="scanlines"></div>
            <div ref="termOutput" class="terminal-output">
              <div v-for="(line, idx) in history" :key="idx" class="term-line">
                {{ line }}
              </div>
            </div>
            <div class="cli-input-row">
              <span class="prompt">root@deck:~$</span>
              <input
                ref="cliInput"
                v-model="inputCommand"
                type="text"
                class="cli-input"
                placeholder="輸入指令 (如 help, scan, jackin node_relay_01)..."
                @keydown.enter="submitCmd"
              />
            </div>
          </div>
          <!-- Quick Action Buttons -->
          <div class="quick-btns">
            <button class="btn-q" @click="quickCmd('help')">❓ 說明</button>
            <button class="btn-q" @click="quickCmd('scan')">📡 掃描節點</button>
            <button class="btn-q" @click="quickCmd('status')">📊 甲板狀態</button>
            <button class="btn-q" @click="quickCmd('clear')">🧹 清除螢幕</button>
          </div>
        </div>

        <!-- Right: Active Matrix Breach Minigame -->
        <div class="col-matrix">
          <div class="card-box matrix-box">
            <div class="subhead">
              <span>⚡ 破冰協定：代碼矩陣 (Buffer Breach)</span>
              <span
                v-if="session && !session.isFinished"
                class="timer-badge"
                :class="{ urgent: session.timeLeftSeconds <= 10 }"
              >
                ⏱️ {{ session.timeLeftSeconds }}s
              </span>
            </div>

            <!-- If No Active Session -->
            <div v-if="!session || session.isFinished" class="matrix-idle">
              <div v-if="session && session.isFinished" class="result-banner" :class="session.isSuccess ? 'success' : 'fail'">
                {{ session.isSuccess ? '🎉 侵入成功！防火牆已瓦解' : '💀 侵入失敗！ICE 防火牆反制阻斷' }}
              </div>
              <p class="idle-tip">
                在左側終端機輸入 <code>scan</code> 檢視節點，<br/>
                或點擊下方按鈕直接連線入侵目標節點！
              </p>
              <div class="quick-targets">
                <button
                  v-for="node in nodes"
                  :key="node.id"
                  class="target-card"
                  :class="{ breached: node.isBreached }"
                  @click="quickJackin(node.id)"
                >
                  <div class="t-top">
                    <span class="t-name">{{ node.name }}</span>
                    <span class="t-status">{{ node.isBreached ? '🟢 已破譯' : `🔴 SEC-${node.securityLevel}` }}</span>
                  </div>
                  <div class="t-desc">{{ node.description }}</div>
                </button>
              </div>
            </div>

            <!-- Active Matrix Game Grid -->
            <div v-else class="matrix-active">
              <!-- Target Sequence & Buffer -->
              <div class="hud-seq-row">
                <div class="seq-group">
                  <span class="label">目標破譯字節序列：</span>
                  <div class="bytes-row">
                    <span
                      v-for="(b, idx) in session.targetSequence"
                      :key="idx"
                      class="byte-chip target"
                    >
                      {{ b }}
                    </span>
                  </div>
                </div>

                <div class="seq-group">
                  <span class="label">緩衝區 ({{ session.buffer.length }}/{{ session.bufferLimit }})：</span>
                  <div class="bytes-row">
                    <span
                      v-for="i in session.bufferLimit"
                      :key="i"
                      class="byte-chip buffer"
                    >
                      {{ session.buffer[i - 1] || '__' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 5x5 Hex Grid -->
              <div class="hex-grid">
                <div
                  v-for="(row, rIdx) in session.grid"
                  :key="rIdx"
                  class="grid-row"
                  :class="{ activeRow: session.activeMode === 'row' && session.activeIdx === rIdx }"
                >
                  <div
                    v-for="(cell, cIdx) in row"
                    :key="cIdx"
                    class="grid-cell"
                    :class="{
                      used: cell.used,
                      activeCol: session.activeMode === 'col' && session.activeIdx === cIdx,
                      selectable: isCellSelectable(rIdx, cIdx)
                    }"
                    @click="onCellClick(rIdx, cIdx)"
                  >
                    {{ cell.byte }}
                  </div>
                </div>
              </div>

              <div class="guidance-bar">
                <span>
                  {{ session.activeMode === 'row' ? `請於【第 ${session.activeIdx + 1} 橫列】中選取字節` : `請於【第 ${session.activeIdx + 1} 直行】中選取字節` }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  cyberdeckNetrunning,
  BreachSession
} from '@/engine/cyberdeckNetrunning'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

const history = ref<string[]>([...cyberdeckNetrunning.terminalHistory])
const inputCommand = ref('')
const session = ref<BreachSession | null>(cyberdeckNetrunning.breachSession)
const nodes = ref(cyberdeckNetrunning.nodes)

const termOutput = ref<HTMLElement | null>(null)
const cliInput = ref<HTMLInputElement | null>(null)

function scrollToBottom(): void {
  nextTick(() => {
    if (termOutput.value) {
      termOutput.value.scrollTop = termOutput.value.scrollHeight
    }
  })
}

function submitCmd(): void {
  if (!inputCommand.value.trim()) return
  const cmd = inputCommand.value
  inputCommand.value = ''
  history.value = [...cyberdeckNetrunning.executeCommand(cmd)]
  session.value = cyberdeckNetrunning.breachSession
  scrollToBottom()
}

function quickCmd(cmd: string): void {
  history.value = [...cyberdeckNetrunning.executeCommand(cmd)]
  session.value = cyberdeckNetrunning.breachSession
  scrollToBottom()
}

function quickJackin(nodeId: string): void {
  quickCmd(`jackin ${nodeId}`)
}

function isCellSelectable(r: number, c: number): boolean {
  if (!session.value || session.value.isFinished) return false
  if (session.value.grid[r][c].used) return false
  if (session.value.activeMode === 'row' && r === session.value.activeIdx) return true
  if (session.value.activeMode === 'col' && c === session.value.activeIdx) return true
  return false
}

function onCellClick(r: number, c: number): void {
  if (!isCellSelectable(r, c)) return
  cyberdeckNetrunning.selectCell(r, c)
  history.value = [...cyberdeckNetrunning.terminalHistory]
  session.value = cyberdeckNetrunning.breachSession
  scrollToBottom()
}

onMounted(() => {
  scrollToBottom()
  if (cliInput.value) {
    cliInput.value.focus()
  }
})

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(2, 4, 10, 0.88);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(10px);
}
.deck-panel {
  width: 1040px; max-width: 95vw; max-height: 90vh;
  background: rgba(6, 10, 20, 0.96);
  border: 1px solid rgba(0, 255, 120, 0.4);
  border-radius: 14px; color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  display: flex; flex-direction: column; overflow: hidden;
}
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid rgba(0, 255, 120, 0.2);
  background: rgba(0, 255, 120, 0.05);
}
.title-area { display: flex; align-items: center; gap: 10px; }
.title-area h2 { font-size: 18px; color: #00ff77; font-weight: 700; margin: 0; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #ff0055; }

.content-body {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  padding: 16px; overflow-y: auto;
}

.crt-screen {
  background: #020b06; border: 2px solid #00aa44; border-radius: 8px;
  height: 380px; display: flex; flex-direction: column; position: relative;
  overflow: hidden; box-shadow: inset 0 0 20px rgba(0, 255, 80, 0.2);
}
.scanlines {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px; z-index: 10;
}
.terminal-output {
  flex: 1; overflow-y: auto; padding: 12px; font-family: 'Courier New', monospace;
  font-size: 12px; color: #00ff66; display: flex; flex-direction: column; gap: 4px;
}
.cli-input-row {
  display: flex; align-items: center; padding: 8px 12px;
  background: rgba(0, 40, 15, 0.8); border-top: 1px solid #00aa44;
}
.prompt { font-family: 'Courier New', monospace; font-size: 12px; color: #00ff88; margin-right: 8px; }
.cli-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: #00ffaa; font-family: 'Courier New', monospace; font-size: 12px;
}

.quick-btns { display: flex; gap: 8px; margin-top: 10px; }
.btn-q {
  background: rgba(0, 255, 120, 0.1); border: 1px solid #00aa44;
  color: #00ff77; border-radius: 6px; padding: 6px 12px; font-size: 11px;
  cursor: pointer; transition: all 0.2s;
}
.btn-q:hover { background: #00aa44; color: #000; font-weight: 700; }

.card-box {
  background: rgba(10, 18, 30, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; padding: 14px;
}
.subhead {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; font-weight: 700; color: #00ff88; margin-bottom: 12px;
}
.timer-badge {
  background: rgba(0, 255, 120, 0.2); border: 1px solid #00ff77;
  padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #00ff77;
}
.timer-badge.urgent {
  background: rgba(255, 0, 85, 0.2); border-color: #ff0055; color: #ff0055;
  animation: pulse-urgent 0.8s infinite alternate;
}
@keyframes pulse-urgent { 0% { opacity: 0.7; } 100% { opacity: 1; } }

.result-banner {
  padding: 10px; border-radius: 6px; text-align: center; font-weight: 700; font-size: 13px;
  margin-bottom: 12px;
}
.result-banner.success { background: rgba(0, 255, 136, 0.2); border: 1px solid #00ff88; color: #00ff88; }
.result-banner.fail { background: rgba(255, 0, 85, 0.2); border: 1px solid #ff0055; color: #ff0055; }

.idle-tip { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5; margin-bottom: 12px; }
.quick-targets { display: flex; flex-direction: column; gap: 8px; }
.target-card {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; padding: 10px; cursor: pointer; text-align: left;
  transition: all 0.2s;
}
.target-card:hover { border-color: #00ff88; background: rgba(0, 255, 120, 0.05); }
.target-card.breached { border-color: rgba(0, 255, 136, 0.4); opacity: 0.8; }
.t-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; }
.t-name { color: #fff; }
.t-status { font-size: 11px; }
.t-desc { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 4px; }

.hud-seq-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.seq-group { display: flex; flex-direction: column; gap: 4px; }
.label { font-size: 11px; color: rgba(255,255,255,0.6); }
.bytes-row { display: flex; gap: 6px; }
.byte-chip {
  background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; font-weight: 700;
}
.byte-chip.target { border-color: #00ffff; color: #00ffff; }
.byte-chip.buffer { border-color: #ffd700; color: #ffd700; }

.hex-grid {
  display: flex; flex-direction: column; gap: 6px; margin: 12px 0;
  background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px;
}
.grid-row { display: flex; justify-content: space-between; border-radius: 4px; }
.grid-row.activeRow { background: rgba(0, 255, 120, 0.1); border-left: 3px solid #00ff88; }
.grid-cell {
  width: 44px; height: 38px; display: flex; align-items: center; justify-content: center;
  font-family: monospace; font-size: 13px; font-weight: 700; border-radius: 4px;
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5);
  transition: all 0.2s;
}
.grid-cell.activeCol { background: rgba(0, 255, 120, 0.08); border-top: 2px solid #00ff88; }
.grid-cell.selectable {
  background: rgba(0, 255, 120, 0.2); color: #00ffaa; cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 255, 120, 0.3);
}
.grid-cell.selectable:hover {
  background: #00ff88; color: #000; transform: scale(1.08);
}
.grid-cell.used { opacity: 0.15; color: #555; pointer-events: none; }

.guidance-bar {
  text-align: center; font-size: 11px; color: #00ff88;
  background: rgba(0, 255, 120, 0.1); padding: 6px; border-radius: 4px;
}
</style>
