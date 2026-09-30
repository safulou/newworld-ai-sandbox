<template>
  <div class="parkour-overlay" @click.self="close">
    <div class="parkour-modal glass-panel">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <span class="header-icon">🌀</span>
          <div>
            <h2>定向重力異常與極限跑酷 (Gravity & Parkour)</h2>
            <p class="subtitle">反重力天花板倒立行走、動能彈射踏板、等離子滑翔翼與競速賽道</p>
          </div>
        </div>
        <button class="close-btn" @click="close" title="關閉 (ESC)">✕</button>
      </div>

      <!-- Gravity Controls & Glider Row -->
      <div class="controls-row">
        <!-- Gravity Inversion Card -->
        <div class="feature-card" :class="{ active: isInverted }">
          <div class="card-icon">🧲</div>
          <div class="card-body">
            <span class="card-title">引力方向控制 (Gravity Field)</span>
            <span class="card-desc">
              {{ isInverted ? '⚡ 當前：天花板倒立行走模式 (+22 G)' : '🌍 當前：地心標準重力 (-22 G)' }}
            </span>
          </div>
          <button
            :class="['action-toggle', { on: isInverted }]"
            @click="toggleGravity"
          >
            {{ isInverted ? '恢復正常重力' : '倒轉引力 (Invert)' }}
          </button>
        </div>

        <!-- Glider Wings Card -->
        <div class="feature-card" :class="{ active: isGliding }">
          <div class="card-icon">🪂</div>
          <div class="card-body">
            <span class="card-title">等離子滑翔羽翼 (Cyber Glider)</span>
            <span class="card-desc">
              {{ isGliding ? '✨ 光翼展開中：下落緩衝 (2.5m/s)' : '⚪ 羽翼收合中 (空中長按空白鍵)' }}
            </span>
          </div>
          <button
            :class="['action-toggle', { on: isGliding }]"
            @click="toggleGlider"
          >
            {{ isGliding ? '收起羽翼' : '展開光翼' }}
          </button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="main-grid">
        <!-- Left: Time-Attack Courses -->
        <div class="panel-section">
          <div class="section-title">
            <span>🏁 全息跑酷競速計時賽道 (Time-Attack Courses)</span>
            <span class="badge">{{ courses.length }} 賽道</span>
          </div>

          <div class="courses-list">
            <div
              v-for="c in courses"
              :key="c.id"
              :class="['course-card', { active: activeCourse?.id === c.id }]"
            >
              <div class="course-header">
                <span class="course-name">{{ c.name }}</span>
                <span class="course-pb">
                  最佳紀錄: {{ formatTime(c.bestTimeMs) }}
                </span>
              </div>
              <p class="course-desc">{{ c.description }}</p>
              <div class="course-footer">
                <span class="cp-count">🚩 {{ c.checkpoints.length }} 個全息檢查點</span>
                <button
                  v-if="activeCourse?.id === c.id && isRunActive"
                  class="course-btn danger"
                  @click="stopCourse"
                >
                  ⏹️ 放棄挑戰
                </button>
                <button
                  v-else
                  class="course-btn"
                  @click="startCourse(c.id)"
                >
                  ▶️ 進入計時挑戰
                </button>
              </div>
            </div>
          </div>

          <!-- Active Run Live HUD -->
          <div v-if="isRunActive && activeCourse" class="live-run-box">
            <div class="live-title">
              <span>⏱️ 當前挑戰中：{{ activeCourse.name }}</span>
              <span class="live-cp">進度: {{ currentCheckpointIdx }} / {{ activeCourse.checkpoints.length }}</span>
            </div>
            <div class="live-timer">{{ formatTime(currentRunElapsedMs) }}</div>
          </div>
        </div>

        <!-- Right: Sonic Launch Pads -->
        <div class="panel-section">
          <div class="section-title">
            <span>🚀 動能超音速彈射台 (Launch Pads)</span>
            <span class="badge">{{ launchPads.length }} 踏板</span>
          </div>

          <div class="add-pad-box">
            <h4>快速部署彈射踏板</h4>
            <div class="pad-inputs">
              <input v-model.number="newPadX" type="number" placeholder="X" />
              <input v-model.number="newPadY" type="number" placeholder="Y" />
              <input v-model.number="newPadZ" type="number" placeholder="Z" />
              <button class="primary-btn" @click="addLaunchPad">部署踏板</button>
            </div>
          </div>

          <div class="pads-list">
            <div v-for="p in launchPads" :key="p.id" class="pad-item">
              <div class="pad-info">
                <span class="pad-name">{{ p.name }}</span>
                <span class="pad-coord">[{{ p.x }}, {{ p.y }}, {{ p.z }}]</span>
              </div>
              <div class="pad-forces">
                <span class="tag">垂直: {{ p.verticalForce }} m/s</span>
                <span class="tag">前向: {{ p.forwardForce }} m/s</span>
                <button class="del-btn" @click="removeLaunchPad(p.id)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { gravityAnomalies } from '@/engine/gravityAnomalies'

const uiStore = useUIStore()

const isInverted = ref(gravityAnomalies.isInverted)
const isGliding = ref(gravityAnomalies.isGliding)
const courses = ref(gravityAnomalies.courses)
const launchPads = ref(gravityAnomalies.launchPads)

const activeCourse = ref(gravityAnomalies.activeCourse)
const currentCheckpointIdx = ref(gravityAnomalies.currentCheckpointIdx)
const isRunActive = ref(gravityAnomalies.isRunActive)
const currentRunElapsedMs = ref(gravityAnomalies.currentRunElapsedMs)

const newPadX = ref(10)
const newPadY = ref(4)
const newPadZ = ref(10)

let timer: number | null = null

function updateState() {
  isInverted.value = gravityAnomalies.isInverted
  isGliding.value = gravityAnomalies.isGliding
  courses.value = [...gravityAnomalies.courses]
  launchPads.value = [...gravityAnomalies.launchPads]
  activeCourse.value = gravityAnomalies.activeCourse
  currentCheckpointIdx.value = gravityAnomalies.currentCheckpointIdx
  isRunActive.value = gravityAnomalies.isRunActive
  currentRunElapsedMs.value = gravityAnomalies.currentRunElapsedMs
}

onMounted(() => {
  timer = window.setInterval(updateState, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function close() {
  uiStore.mode = 'game'
}

function toggleGravity() {
  gravityAnomalies.toggleGravityInversion()
  updateState()
}

function toggleGlider() {
  gravityAnomalies.setGliding(!gravityAnomalies.isGliding)
  updateState()
}

function startCourse(courseId: string) {
  gravityAnomalies.startCourse(courseId)
  updateState()
}

function stopCourse() {
  gravityAnomalies.stopCourse()
  updateState()
}

function addLaunchPad() {
  gravityAnomalies.addLaunchPad(newPadX.value, newPadY.value, newPadZ.value, 26, 18)
  newPadX.value += 5
  updateState()
}

function removeLaunchPad(id: string) {
  gravityAnomalies.removeLaunchPad(id)
  updateState()
}

function formatTime(ms: number | null): string {
  if (ms === null || ms === undefined) return '--:--.--'
  const seconds = Math.floor(ms / 1000)
  const cents = Math.floor((ms % 1000) / 10)
  const mins = Math.floor(seconds / 60)
  const remSec = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.parkour-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.parkour-modal {
  width: 900px;
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

.controls-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.feature-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s;
}

.feature-card.active {
  border-color: #00f0ff;
  background: rgba(0, 240, 255, 0.1);
}

.card-icon {
  font-size: 1.8rem;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f1f5f9;
}

.card-desc {
  font-size: 0.75rem;
  color: #94a3b8;
}

.action-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-toggle.on {
  background: #00f0ff;
  border-color: #00f0ff;
  color: #040810;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #38bdf8;
}

.badge {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.courses-list, .pads-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-card.active {
  border-color: #ffe600;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-name {
  font-weight: 600;
  font-size: 0.88rem;
}

.course-pb {
  font-size: 0.75rem;
  color: #ffe600;
}

.course-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.cp-count {
  font-size: 0.72rem;
  color: #64748b;
}

.course-btn {
  background: rgba(0, 240, 255, 0.15);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.course-btn:hover {
  background: #00f0ff;
  color: #040810;
}

.course-btn.danger {
  border-color: #ef4444;
  color: #ef4444;
}

.live-run-box {
  background: rgba(255, 230, 0, 0.1);
  border: 1px solid #ffe600;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.live-title {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #ffe600;
}

.live-timer {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  font-family: monospace;
}

.add-pad-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px;
}

.add-pad-box h4 {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin: 0 0 10px 0;
}

.pad-inputs {
  display: flex;
  gap: 8px;
}

.pad-inputs input {
  width: 50px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 6px;
  font-size: 0.82rem;
}

.primary-btn {
  background: #00f0ff;
  border: none;
  color: #040810;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.pad-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px 10px;
}

.pad-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pad-name {
  font-size: 0.82rem;
  font-weight: 600;
}

.pad-coord {
  font-size: 0.7rem;
  color: #94a3b8;
}

.pad-forces {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag {
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: #94a3b8;
}

.del-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px 6px;
}
</style>
