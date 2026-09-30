<template>
  <div class="acoustics-overlay" @click.self="close">
    <div class="acoustics-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🎧</span>
          <div>
            <h2>真實空間聲學物理與濾波器 (Spatial Acoustic Physics)</h2>
            <p class="subtitle">水下聲學阻尼、密封艙室消音與深淵空間卷積殘響</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Live Oscilloscope & Audio Spectrum Canvas -->
      <div class="visualizer-box">
        <div class="canvas-header">
          <span>等離子音訊動態頻譜與示波器 (Plasma Oscilloscope)</span>
          <span class="freq-tag">{{ Math.round(acousticState.lowpassCutoff) }} Hz 截止頻率</span>
        </div>
        <canvas ref="canvasRef" width="760" height="150" class="audio-canvas"></canvas>
      </div>

      <!-- Telemetry Status Grid -->
      <div class="telemetry-grid">
        <div class="tele-card">
          <span class="label">低通截止頻率 (Lowpass)</span>
          <span class="val cyan">{{ Math.round(acousticState.lowpassCutoff) }} <small>Hz</small></span>
          <span class="desc">320Hz 潛水 / 720Hz 艙內 / 20kHz 露天</span>
        </div>

        <div class="tele-card">
          <span class="label">空間隔音衰減 (Occlusion)</span>
          <span class="val magenta">{{ acousticState.occlusionDb.toFixed(1) }} <small>dB</small></span>
          <span class="desc">密閉座艙與防爆門外部噪音阻尼</span>
        </div>

        <div class="tele-card">
          <span class="label">環境殘響深度 (Reverb)</span>
          <span class="val lime">{{ (acousticState.reverbIntensity * 100).toFixed(0) }} <small>%</small></span>
          <span class="desc">深淵巨型洞穴與深空邊緣空間反射</span>
        </div>

        <div class="tele-card">
          <span class="label">當前聲學環境 (Profile)</span>
          <span class="val yellow">{{ currentProfileLabel }}</span>
          <span class="desc">{{ currentProfileDesc }}</span>
        </div>
      </div>

      <!-- Interactive Sound Synthesis & Profile Simulation -->
      <div class="simulation-section">
        <h3>聲學物理合成與環境模擬 (Acoustic Profiles)</h3>
        <div class="buttons-grid">
          <button class="action-btn" @click="simulateEnvironment('open_air')">
            <span>☀️ 開放露天都市</span>
            <small>全頻段直通 (20kHz, 0dB)</small>
          </button>
          <button class="action-btn" @click="simulateEnvironment('cabin')">
            <span>🚄 磁浮膠囊/密封艙室</span>
            <small>座艙阻尼消音 (720Hz, -14dB)</small>
          </button>
          <button class="action-btn" @click="simulateEnvironment('underwater')">
            <span>🫧 水下/培養液浸沒</span>
            <small>深層水體共鳴 (320Hz, -10dB)</small>
          </button>
          <button class="action-btn" @click="simulateEnvironment('abyss')">
            <span>🌌 地心深淵巨大殘響</span>
            <small>空間卷積回音 (9kHz, 85% 殘響)</small>
          </button>
        </div>

        <div class="synth-triggers">
          <h4>🧪 實體程序化音效觸發 (Procedural Sound Pings)</h4>
          <div class="trigger-row">
            <button class="synth-btn" @click="playBubble">
              <span>🫧 水底諧振水泡 (Bubble Pop)</span>
            </button>
            <button class="synth-btn" @click="playSonar">
              <span>📡 空間主動聲納 (Sonar Pulse)</span>
            </button>
            <button class="synth-btn" @click="playCabinHum">
              <span>🌬️ 艙內通風低頻微鳴 (Cabin Vent Hum)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { acousticEnvironment } from '@/engine/acousticEnvironment'

const uiStore = useUIStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const acousticState = ref(acousticEnvironment.state)

let animationId: number | null = null

const currentProfileLabel = computed(() => {
  if (acousticState.value.isUnderwater) return '🫧 水下浸沒'
  if (acousticState.value.isInsideCabin) return '🚄 密封座艙'
  if (acousticState.value.currentRealm === 'core_abyss') return '🌋 地心深淵'
  if (acousticState.value.currentRealm === 'void_islands') return '🌌 深空浮島'
  return '☀️ 開放都市'
})

const currentProfileDesc = computed(() => {
  if (acousticState.value.isUnderwater) return '低頻共振與水流阻尼'
  if (acousticState.value.isInsideCabin) return '雙層玻璃隔音消噪'
  if (acousticState.value.currentRealm === 'core_abyss') return '玄武岩巨大空間脈衝殘響'
  return '無障礙聲波自由傳播'
})

function close() {
  uiStore.mode = 'game'
}

function simulateEnvironment(type: 'open_air' | 'cabin' | 'underwater' | 'abyss') {
  if (type === 'underwater') {
    acousticEnvironment.setEnvironment(true, false, 'neon_city')
  } else if (type === 'cabin') {
    acousticEnvironment.setEnvironment(false, true, 'neon_city')
  } else if (type === 'abyss') {
    acousticEnvironment.setEnvironment(false, false, 'core_abyss')
  } else {
    acousticEnvironment.setEnvironment(false, false, 'neon_city')
  }
}

function playBubble() {
  acousticEnvironment.playUnderwaterBubble()
}

function playSonar() {
  acousticEnvironment.playSonarPulse()
}

function playCabinHum() {
  acousticEnvironment.playCabinVentHum()
}

function renderVisualizer() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // Background
  ctx.fillStyle = 'rgba(6, 11, 25, 0.4)'
  ctx.fillRect(0, 0, width, height)

  const timeData = acousticEnvironment.getTimeDomainData()
  const freqData = acousticEnvironment.getFrequencyData()

  // 1. Draw Spectrum Bars (Neon Green / Cyan)
  const barWidth = width / (freqData.length || 64)
  for (let i = 0; i < freqData.length; i++) {
    const val = freqData[i] / 255
    const barHeight = val * (height * 0.7)
    ctx.fillStyle = `rgba(0, 240, 255, ${0.15 + val * 0.6})`
    ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight)
  }

  // 2. Draw Oscilloscope Waveform (Neon Pink)
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ff007f'
  ctx.beginPath()

  const sliceWidth = width / (timeData.length || 64)
  let x = 0

  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] / 128.0
    const y = (v * height) / 2

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    x += sliceWidth
  }

  ctx.stroke()

  animationId = requestAnimationFrame(renderVisualizer)
}

onMounted(() => {
  renderVisualizer()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.acoustics-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.acoustics-modal {
  width: 840px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(13, 20, 36, 0.92);
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
  border-radius: 12px;
  padding: 24px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  padding-bottom: 14px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 2rem;
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00f0ff;
  margin: 0;
}

.subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.visualizer-box {
  background: rgba(6, 11, 25, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
}

.freq-tag {
  color: #00f0ff;
  font-weight: 600;
}

.audio-canvas {
  width: 100%;
  height: 140px;
  border-radius: 6px;
  background: #030712;
}

.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.tele-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tele-card .label {
  font-size: 0.72rem;
  color: #94a3b8;
}

.tele-card .val {
  font-size: 1.25rem;
  font-weight: 700;
}

.tele-card .val.cyan { color: #00f0ff; }
.tele-card .val.magenta { color: #ff007f; }
.tele-card .val.lime { color: #39ff14; }
.tele-card .val.yellow { color: #ffe600; }

.tele-card .desc {
  font-size: 0.68rem;
  color: #64748b;
}

.simulation-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.simulation-section h3 {
  font-size: 0.95rem;
  color: #38bdf8;
  margin: 0;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.action-btn {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(0, 240, 255, 0.15);
  border-color: #00f0ff;
  transform: translateY(-1px);
}

.action-btn span {
  font-size: 0.85rem;
  font-weight: 600;
}

.action-btn small {
  font-size: 0.7rem;
  color: #94a3b8;
}

.synth-triggers {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 12px;
}

.synth-triggers h4 {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin: 0 0 10px 0;
}

.trigger-row {
  display: flex;
  gap: 10px;
}

.synth-btn {
  flex: 1;
  background: rgba(255, 0, 127, 0.1);
  border: 1px solid rgba(255, 0, 127, 0.3);
  color: #ff007f;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.synth-btn:hover {
  background: rgba(255, 0, 127, 0.25);
  box-shadow: 0 0 12px rgba(255, 0, 127, 0.4);
}
</style>
