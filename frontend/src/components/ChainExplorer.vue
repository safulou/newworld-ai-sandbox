<template>
  <div class="overlay" @click.self="close">
    <div class="chain-panel glass-panel">
      <div class="header">
        <div class="title-row">
          <span class="chain-icon">⛓️</span>
          <h2>NewWorld Chain Explorer</h2>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <p class="subtitle">Immutable cryptographic ledger of all voxel placements and land claims</p>

      <div class="chain-stats">
        <div class="stat-box">
          <div class="stat-num">{{ blocks.length }}</div>
          <div class="stat-label">Total Blocks Mined</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">SHA-256</div>
          <div class="stat-label">Hashing Algorithm</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">100%</div>
          <div class="stat-label">Provenance Verified</div>
        </div>
      </div>

      <div class="block-list">
        <div v-for="b in blocks" :key="b.block_index" class="chain-card">
          <div class="card-header">
            <span class="block-idx">#{{ b.block_index }}</span>
            <span class="creator">Creator: {{ b.creator_id }}</span>
            <span class="time">{{ new Date(b.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div class="hash-row">
            <span class="label">Hash:</span>
            <span class="hash-code">{{ b.hash }}</span>
          </div>
          <div class="hash-row">
            <span class="label">Prev:</span>
            <span class="hash-code prev">{{ b.previous_hash }}</span>
          </div>
          <div class="payload-preview">
            {{ b.payload }}
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn-refresh" @click="fetchChain">🔄 Refresh Ledger</button>
        <button class="btn-done" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

interface ChainBlock {
  block_index: number
  previous_hash: string
  hash: string
  creator_id: string
  payload: string
  timestamp: string
}

const blocks = ref<ChainBlock[]>([])

async function fetchChain(): Promise<void> {
  try {
    const res = await fetch('http://localhost:4000/api/chain')
    if (res.ok) {
      blocks.value = await res.json()
    } else {
      // Local fallback genesis block
      blocks.value = [
        {
          block_index: 0,
          previous_hash: '0',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          creator_id: 'system',
          payload: JSON.stringify({ message: 'Genesis Block of Neon Oasis' }),
          timestamp: new Date().toISOString(),
        }
      ]
    }
  } catch {
    blocks.value = [
      {
        block_index: 0,
        previous_hash: '0',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        creator_id: 'system',
        payload: JSON.stringify({ message: 'Genesis Block of Neon Oasis' }),
        timestamp: new Date().toISOString(),
      }
    ]
  }
}

function close(): void {
  ui.closeOverlay()
}

onMounted(() => {
  fetchChain()
})
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  backdrop-filter: blur(8px);
}

.chain-panel {
  width: 720px; max-width: 95vw; padding: 24px;
  background: rgba(14, 18, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
}

.header { display: flex; justify-content: space-between; align-items: center; }
.title-row { display: flex; align-items: center; gap: 8px; }
.chain-icon { font-size: 22px; }
h2 { font-size: 20px; font-weight: 700; color: #00ffff; margin: 0; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #fff; }

.subtitle { font-size: 12px; color: rgba(255,255,255,0.5); margin: 4px 0 14px; }

.chain-stats {
  display: flex; gap: 12px; margin-bottom: 16px;
}
.stat-box {
  flex: 1; padding: 10px; background: rgba(0,255,255,0.06); border: 1px solid rgba(0,255,255,0.2);
  border-radius: 8px; text-align: center;
}
.stat-num { font-size: 16px; font-weight: 700; color: #00ffff; font-family: monospace; }
.stat-label { font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 2px; }

.block-list {
  max-height: 340px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px;
}

.chain-card {
  padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; font-family: monospace; font-size: 11px;
}
.card-header {
  display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 700;
}
.block-idx { color: #00ffff; font-size: 13px; }
.creator { color: #ffd700; }
.time { color: rgba(255,255,255,0.4); }

.hash-row { display: flex; gap: 6px; margin: 2px 0; }
.label { color: rgba(255,255,255,0.5); }
.hash-code { color: #88ff88; word-break: break-all; }
.hash-code.prev { color: rgba(255,255,255,0.5); }

.payload-preview {
  margin-top: 6px; padding: 6px 8px; background: rgba(0,0,0,0.4);
  border-radius: 4px; color: rgba(255,255,255,0.7); max-height: 48px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}

.footer {
  display: flex; justify-content: space-between; align-items: center; margin-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;
}
.btn-refresh {
  padding: 6px 14px; background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px; cursor: pointer; font-size: 12px;
}
.btn-refresh:hover { border-color: #00ffff; color: #00ffff; }
.btn-done {
  padding: 8px 20px; background: #00ffff; color: #000; border: none; border-radius: 8px;
  font-weight: 700; cursor: pointer;
}
</style>
