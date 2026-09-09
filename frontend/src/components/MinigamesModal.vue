<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h2>🎮 元宇宙競技場 (Minigames Arena)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="games-grid">
        <div class="game-card">
          <div class="game-icon">🏃‍♂️</div>
          <div class="game-info">
            <h3>霓虹跑酷極限競速 (Neon Parkour Speedrun)</h3>
            <p>在半空中隨機生成 20 段發光體素躍遷平台，考驗你的衝刺、跳躍與反重力控制力！到達終點彈跳墊即刻結算秒數。</p>
          </div>
          <button class="launch-btn primary" @click="startParkour">
            🚀 啟動跑酷關卡
          </button>
        </div>

        <div class="game-card">
          <div class="game-icon">🎯</div>
          <div class="game-info">
            <h3>電漿定點靶場 (Plasma Target Range)</h3>
            <p>使用電漿爆破槍在限定時間內擊碎全息靶心，賺取積分與解鎖專屬成就。</p>
          </div>
          <button class="launch-btn secondary" @click="startTargetPractice">
            🔫 進入靶場
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tools } from '@/engine/tools'
import { useUIStore } from '@/stores/ui'
import { sound } from '@/engine/audio'

const emit = defineEmits<{
  (e: 'launch-parkour'): void
}>()

const ui = useUIStore()

function startParkour(): void {
  emit('launch-parkour')
  sound.playFanfare()
  ui.setBuildStatus('🏃‍♂️ 霓虹跑酷關卡已生成！請跳上平台抵達終點！')
  setTimeout(() => ui.setBuildStatus(''), 2500)
  close()
}

function startTargetPractice(): void {
  tools.setTool('blaster')
  sound.playFanfare()
  ui.setBuildStatus('🎯 已裝備電漿爆破發射器！自由射擊目標！')
  setTimeout(() => ui.setBuildStatus(''), 2500)
  close()
}

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 620px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.2rem;
  color: #00ffff;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.games-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 10px;
}

.game-icon {
  font-size: 2.2rem;
}

.game-info {
  flex: 1;
}

.game-info h3 {
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 4px;
}

.game-info p {
  font-size: 0.75rem;
  color: #888;
  line-height: 1.4;
}

.launch-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.launch-btn.primary {
  background: linear-gradient(135deg, #00ffff, #0088ff);
  color: #000;
}

.launch-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.4);
}

.launch-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
