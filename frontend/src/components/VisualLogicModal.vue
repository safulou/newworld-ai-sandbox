<template>
  <div class="logic-overlay" @click.self="close">
    <div class="logic-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">⚡</span>
          <div>
            <h2>全息節點式視覺邏輯編輯器 (Visual Logic Graph)</h2>
            <p class="subtitle">連線式自製機關、互動密室與領地自動化規則</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Action Toolbar -->
      <div class="toolbar">
        <div class="add-buttons">
          <button class="btn-node event" @click="addNode('event_player_enter')">
            ➕ 玩家進入事件
          </button>
          <button class="btn-node condition" @click="addNode('cond_has_item')">
            ➕ 物品檢查條件
          </button>
          <button class="btn-node action" @click="addNode('act_broadcast_msg')">
            ➕ 廣播訊息動作
          </button>
          <button class="btn-node action" @click="addNode('act_call_airdrop')">
            ➕ 空投呼叫動作
          </button>
        </div>
        <div class="tools-right">
          <button class="btn-simulate" @click="simulateTrigger">
            ▶️ 模擬觸發運行 (Run Test)
          </button>
        </div>
      </div>

      <!-- Graph Canvas Workspace -->
      <div class="canvas-workspace">
        <!-- SVG Connections Layer -->
        <svg class="connections-svg">
          <path
            v-for="conn in connections"
            :key="conn.id"
            :d="getCurvePath(conn)"
            class="wire-path"
          />
        </svg>

        <!-- Nodes Layer -->
        <div
          v-for="node in nodes"
          :key="node.id"
          class="logic-node"
          :class="node.category"
          :style="{ left: node.x + 'px', top: node.y + 'px' }"
        >
          <div class="node-header">
            <span class="node-title">{{ node.title }}</span>
            <button class="btn-del" @click="deleteNode(node.id)">✕</button>
          </div>

          <div class="node-body">
            <!-- Ports Row -->
            <div class="ports-container">
              <!-- Inputs -->
              <div class="ports-col inputs">
                <div
                  v-for="port in node.inputs"
                  :key="port"
                  class="port-pill input"
                >
                  <span class="port-dot"></span>
                  <span class="port-name">{{ port }}</span>
                </div>
              </div>

              <!-- Outputs -->
              <div class="ports-col outputs">
                <div
                  v-for="port in node.outputs"
                  :key="port"
                  class="port-pill output"
                  @click="handlePortClick(node.id, port)"
                >
                  <span class="port-name">{{ port }}</span>
                  <span class="port-dot active"></span>
                </div>
              </div>
            </div>
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
  visualNodeEditor,
  LogicNode,
  LogicConnection
} from '@/engine/visualNodeEditor'

const ui = useUIStore()

const nodes = computed<LogicNode[]>(() => visualNodeEditor.activeGraph.nodes)
const connections = computed<LogicConnection[]>(() => visualNodeEditor.activeGraph.connections)

const selectedOutput = ref<{ nodeId: string; port: string } | null>(null)

function addNode(type: string): void {
  const x = 80 + Math.random() * 240
  const y = 60 + Math.random() * 180
  visualNodeEditor.addNode(type, Math.round(x), Math.round(y))
}

function deleteNode(id: string): void {
  visualNodeEditor.removeNode(id)
}

function handlePortClick(nodeId: string, port: string): void {
  if (!selectedOutput.value) {
    selectedOutput.value = { nodeId, port }
    ui.setBuildStatus(`⚡ 已選取輸出埠 [${port}]，請點選目標節點進行連線`)
    setTimeout(() => ui.setBuildStatus(''), 2000)
  } else {
    // If click another node, connect!
    if (selectedOutput.value.nodeId !== nodeId) {
      visualNodeEditor.addConnection(selectedOutput.value.nodeId, selectedOutput.value.port, nodeId, 'exec')
      ui.setBuildStatus('🔗 節點邏輯連線成功！')
      setTimeout(() => ui.setBuildStatus(''), 2000)
    }
    selectedOutput.value = null
  }
}

function simulateTrigger(): void {
  visualNodeEditor.triggerEvent('event_player_enter')
  ui.setBuildStatus('▶️ 模擬事件觸發：邏輯節點流已成功傳遞執行！')
  setTimeout(() => ui.setBuildStatus(''), 2500)
}

function getCurvePath(conn: LogicConnection): string {
  const from = nodes.value.find(n => n.id === conn.fromNodeId)
  const to = nodes.value.find(n => n.id === conn.toNodeId)
  if (!from || !to) return ''

  const x1 = from.x + 220
  const y1 = from.y + 40
  const x2 = to.x
  const y2 = to.y + 40
  const dx = Math.abs(x2 - x1) * 0.5

  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.logic-overlay {
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

.logic-modal {
  width: 96%;
  max-width: 940px;
  background: rgba(10, 16, 32, 0.96);
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.15);
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
  filter: drop-shadow(0 0 8px #a855f7);
}

.modal-header h2 {
  font-size: 1.35rem;
  margin: 0;
  background: linear-gradient(135deg, #a855f7, #38bdf8);
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
}

.add-buttons {
  display: flex;
  gap: 8px;
}

.btn-node {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  transition: all 0.2s;
}

.btn-node.event {
  border-color: #a855f7;
  color: #c084fc;
}

.btn-node.condition {
  border-color: #f59e0b;
  color: #fbbf24;
}

.btn-node.action {
  border-color: #00ffff;
  color: #38bdf8;
}

.btn-simulate {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7, #38bdf8);
  border: none;
  color: #050b14;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
}

.canvas-workspace {
  position: relative;
  width: 100%;
  height: 420px;
  background: radial-gradient(#1e1b4b 1px, #070914 1px);
  background-size: 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
}

.connections-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.wire-path {
  fill: none;
  stroke: #00ffff;
  stroke-width: 3;
  stroke-dasharray: 6 3;
  animation: wireFlow 1s linear infinite;
  filter: drop-shadow(0 0 4px #00ffff);
}

.logic-node {
  position: absolute;
  width: 220px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  user-select: none;
}

.logic-node.event { border-top: 3px solid #a855f7; }
.logic-node.condition { border-top: 3px solid #f59e0b; }
.logic-node.action { border-top: 3px solid #00ffff; }

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.node-title {
  font-size: 0.78rem;
  font-weight: 700;
}

.btn-del {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-del:hover {
  color: #ff6b6b;
}

.node-body {
  padding: 8px;
}

.ports-container {
  display: flex;
  justify-content: space-between;
}

.port-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}

.port-pill:hover {
  background: rgba(255, 255, 255, 0.08);
}

.port-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
}

.port-dot.active {
  background: #00ffff;
  box-shadow: 0 0 6px #00ffff;
}

@keyframes wireFlow {
  from { stroke-dashoffset: 18; }
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
</style>
