<template>
  <div class="overlay" @click.self="close">
    <div class="bt-panel glass-panel">
      <!-- Header -->
      <div class="header">
        <div class="title-area">
          <span class="icon">🧠</span>
          <h2>全息 AI 神經行為樹編輯器 (Holo Behavior Tree)</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Content -->
      <div class="content-body">
        <!-- Left: Brain Presets & Injection Target -->
        <div class="col-sidebar">
          <!-- Injection Target Selector -->
          <div class="card-box">
            <div class="subhead">🎯 實體大腦熱插拔注入</div>
            <div class="target-list">
              <button
                v-for="tgt in targets"
                :key="tgt.id"
                class="target-btn"
                :class="{ active: targetEntity === tgt.id }"
                @click="injectTo(tgt.id)"
              >
                <span class="t-icon">{{ tgt.icon }}</span>
                <div class="t-text">
                  <span class="t-title">{{ tgt.title }}</span>
                  <span class="t-desc">{{ tgt.desc }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Brain Presets -->
          <div class="card-box">
            <div class="subhead">📦 預設神經行為方案</div>
            <div class="presets-list">
              <div
                v-for="p in presets"
                :key="p.id"
                class="preset-item"
                :class="{ active: activePresetId === p.id }"
                @click="selectPreset(p.id)"
              >
                <div class="p-title">{{ p.name }}</div>
                <div class="p-desc">{{ p.description }}</div>
              </div>
            </div>
          </div>

          <!-- Environment Simulation Context Toggle -->
          <div class="card-box">
            <div class="subhead">🧪 環境模擬條件開關</div>
            <div class="env-toggles">
              <label class="toggle-row">
                <span>敵性目標靠近 (15m)</span>
                <input type="checkbox" v-model="env.enemyNearby" @change="onEnvChange" />
              </label>
              <label class="toggle-row">
                <span>自身血量低於 30%</span>
                <input type="checkbox" :checked="env.targetHp < 30" @change="toggleHp" />
              </label>
              <label class="toggle-row">
                <span>偵測到火災火源</span>
                <input type="checkbox" v-model="env.fireActive" @change="onEnvChange" />
              </label>
              <label class="toggle-row">
                <span>發現地表宇宙星塵</span>
                <input type="checkbox" v-model="env.stardustFound" @change="onEnvChange" />
              </label>
              <label class="toggle-row">
                <span>開拓者主人處於戰鬥</span>
                <input type="checkbox" v-model="env.masterInCombat" @change="onEnvChange" />
              </label>
            </div>
          </div>
        </div>

        <!-- Right: Behavior Tree Visualizer Hierarchy -->
        <div class="col-tree">
          <div class="card-box tree-canvas-box">
            <div class="tree-header">
              <div class="subhead">
                <span>🌳 神經突觸決策流層次圖</span>
                <span class="tick-indicator" :class="{ pulse: isTicking }">
                  ⚡ 決策週期：20Hz 實時評估中
                </span>
              </div>
              <button class="btn-step-tick" @click="stepTick">
                ▶️ 手動單步決策 (Tick)
              </button>
            </div>

            <!-- Recursive Node Renderer -->
            <div class="tree-scroll-area">
              <div class="tree-nodes-container">
                <BTNodeRenderer :node="treeRoot" :trace="activeTrace" />
              </div>
            </div>

            <!-- Trace Legend -->
            <div class="tree-legend">
              <span class="legend-item"><span class="badge success">●</span> SUCCESS (成功/命中)</span>
              <span class="legend-item"><span class="badge failure">●</span> FAILURE (失敗/未命中)</span>
              <span class="legend-item"><span class="badge running">●</span> RUNNING (執行中)</span>
              <span class="legend-item"><span class="badge active-pulse">●</span> ACTIVE TRACE (光流路徑)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  behaviorTree,
  BTNode
} from '@/engine/behaviorTree'
import { useUIStore } from '@/stores/ui'
import BTNodeRenderer from '@/components/BTNodeRenderer.vue'

const ui = useUIStore()

const targetEntity = ref(behaviorTree.targetEntity)
const presets = behaviorTree.presets
const activePresetId = ref('combat_vanguard')
const treeRoot = ref<BTNode>(behaviorTree.activeTree)
const activeTrace = ref<string[]>([...behaviorTree.activeTrace])
const env = ref({ ...behaviorTree.context })
const isTicking = ref(true)

const targets = [
  { id: 'npc_companion' as const, icon: '🤖', title: 'AI 伴侶工人 (Companion)', desc: '常駐跟隨與建築鋪設夥伴' },
  { id: 'eco_warden' as const, icon: '🚁', title: '生態巡護無人機 (Eco-Warden)', desc: '林區防火與環境復育無人機' },
  { id: 'cyber_hound' as const, icon: '🐾', title: '變異機械獵犬 (Cyber Hound)', desc: '近戰咬擊與雷射護衛寵物' }
]

function selectPreset(presetId: string): void {
  activePresetId.value = presetId
  behaviorTree.loadPreset(presetId)
  treeRoot.value = behaviorTree.activeTree
  stepTick()
}

function injectTo(target: 'npc_companion' | 'eco_warden' | 'cyber_hound'): void {
  targetEntity.value = target
  behaviorTree.injectBrain(target)
  const tgtName = targets.find(t => t.id === target)?.title || target
  ui.setBuildStatus(`🧠 已將當前神經行為樹成功熱插拔注入至「${tgtName}」！`)
  setTimeout(() => ui.setBuildStatus(''), 2500)
}

function toggleHp(e: Event): void {
  const checked = (e.target as HTMLInputElement).checked
  env.value.targetHp = checked ? 20 : 100
  onEnvChange()
}

function onEnvChange(): void {
  behaviorTree.context = { ...env.value }
  stepTick()
}

function stepTick(): void {
  const result = behaviorTree.tick()
  activeTrace.value = [...result.trace]
}

let tickInterval: number | null = null
onMounted(() => {
  stepTick()
  tickInterval = window.setInterval(() => {
    stepTick()
  }, 1000)
})

onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
})

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(4, 8, 16, 0.88);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(10px);
}
.bt-panel {
  width: 1020px; max-width: 95vw; max-height: 90vh;
  background: rgba(10, 16, 28, 0.96);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  display: flex; flex-direction: column; overflow: hidden;
}
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid rgba(0, 255, 255, 0.15);
  background: rgba(0, 255, 255, 0.05);
}
.title-area { display: flex; align-items: center; gap: 10px; }
.title-area h2 { font-size: 18px; color: #00ffff; font-weight: 700; margin: 0; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #ff0055; }

.content-body {
  display: grid; grid-template-columns: 320px 1fr; gap: 16px;
  padding: 16px; overflow-y: auto;
}

.card-box {
  background: rgba(14, 22, 38, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px; padding: 14px; margin-bottom: 14px;
}
.subhead {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; font-weight: 700; color: #00e5ff; margin-bottom: 10px;
}

.target-list { display: flex; flex-direction: column; gap: 6px; }
.target-btn {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 8px; display: flex; align-items: center; gap: 8px;
  cursor: pointer; transition: all 0.2s; text-align: left;
}
.target-btn:hover { border-color: #00ffff; background: rgba(0, 255, 255, 0.05); }
.target-btn.active { border-color: #00ff88; background: rgba(0, 255, 136, 0.15); }
.t-icon { font-size: 18px; }
.t-text { display: flex; flex-direction: column; }
.t-title { font-size: 12px; font-weight: 700; color: #fff; }
.t-desc { font-size: 10px; color: rgba(255,255,255,0.5); }

.presets-list { display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto; }
.preset-item {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px; padding: 8px 10px; cursor: pointer; transition: all 0.2s;
}
.preset-item:hover { border-color: #00ffff; }
.preset-item.active { border-color: #00e5ff; background: rgba(0, 229, 255, 0.1); }
.p-title { font-size: 12px; font-weight: 700; color: #00ffff; }
.p-desc { font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 2px; }

.env-toggles { display: flex; flex-direction: column; gap: 6px; font-size: 11px; }
.toggle-row {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px;
}
.toggle-row input { cursor: pointer; }

.tree-canvas-box { display: flex; flex-direction: column; height: 100%; min-height: 480px; }
.tree-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.tick-indicator { font-size: 11px; color: #00ff88; }
.tick-indicator.pulse { animation: tick-pulse 1.2s infinite alternate; }
@keyframes tick-pulse { 0% { opacity: 0.6; } 100% { opacity: 1; text-shadow: 0 0 8px #00ff88; } }

.btn-step-tick {
  background: rgba(0, 255, 255, 0.15); border: 1px solid #00ffff;
  color: #00ffff; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700;
  cursor: pointer;
}
.btn-step-tick:hover { background: #00ffff; color: #000; }

.tree-scroll-area {
  flex: 1; overflow: auto; background: rgba(6, 10, 18, 0.85);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px;
}
.tree-nodes-container { display: flex; flex-direction: column; align-items: center; gap: 16px; }

.tree-legend {
  display: flex; gap: 14px; font-size: 11px; color: rgba(255,255,255,0.6);
  margin-top: 10px; justify-content: center;
}
.badge.success { color: #00ff88; }
.badge.failure { color: #ff0055; }
.badge.running { color: #00ffff; }
.badge.active-pulse { color: #ffd700; }
</style>
