<template>
  <div class="bt-node-branch">
    <div
      class="bt-node-box"
      :class="[
        getTypeClass(node.type),
        node.lastStatus ? node.lastStatus.toLowerCase() : 'ready',
        isFired ? 'active-pulse' : ''
      ]"
    >
      <div class="node-icon-badge">{{ getTypeIcon(node.type) }}</div>
      <div class="node-label">
        <span class="node-name">{{ node.name }}</span>
        <span class="node-type-label">{{ node.type.toUpperCase() }}</span>
      </div>
      <div
        class="node-status-pill"
        :class="node.lastStatus ? node.lastStatus.toLowerCase() : 'ready'"
      >
        {{ node.lastStatus || 'READY' }}
      </div>
    </div>

    <!-- Recursive children rendering -->
    <div v-if="node.children && node.children.length > 0" class="bt-children-row">
      <BTNodeRenderer
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :trace="trace"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BTNode } from '@/engine/behaviorTree'

defineOptions({
  name: 'BTNodeRenderer'
})

const props = defineProps<{
  node: BTNode
  trace: string[]
}>()

const isFired = computed(() => {
  return props.trace.includes(props.node.id)
})

function getTypeClass(type: string): string {
  switch (type) {
    case 'selector': return 'type-selector'
    case 'sequence': return 'type-sequence'
    case 'inverter': return 'type-inverter'
    case 'condition': return 'type-condition'
    case 'action': return 'type-action'
    default: return ''
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'selector': return '?'
    case 'sequence': return '→'
    case 'inverter': return '!'
    case 'condition': return '🔍'
    case 'action': return '⚡'
    default: return '•'
  }
}
</script>

<style scoped>
.bt-node-branch {
  display: flex; flex-direction: column; align-items: center;
  position: relative;
}
.bt-node-box {
  background: rgba(14, 20, 36, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px; padding: 8px 12px;
  display: flex; align-items: center; gap: 8px;
  min-width: 170px; max-width: 240px;
  transition: all 0.25s; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.bt-node-box.type-selector { border-color: #00aaff; }
.bt-node-box.type-sequence { border-color: #aa00ff; }
.bt-node-box.type-condition { border-color: #ffaa00; }
.bt-node-box.type-action { border-color: #00ff88; }

.bt-node-box.active-pulse {
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.8);
  border-color: #00ffff !important;
}

.node-icon-badge {
  background: rgba(255,255,255,0.1); width: 22px; height: 22px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px;
}
.node-label { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.node-name { font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node-type-label { font-size: 9px; color: rgba(255,255,255,0.4); }

.node-status-pill {
  font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
}
.node-status-pill.success { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
.node-status-pill.failure { background: rgba(255, 0, 85, 0.2); color: #ff0055; }
.node-status-pill.running { background: rgba(0, 255, 255, 0.2); color: #00ffff; }
.node-status-pill.ready { background: rgba(255, 255, 255, 0.1); color: rgba(255,255,255,0.5); }

.bt-children-row {
  display: flex; gap: 16px; margin-top: 14px; position: relative;
  padding-top: 10px;
}
.bt-children-row::before {
  content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px;
  background: rgba(0, 255, 255, 0.3);
}
</style>
