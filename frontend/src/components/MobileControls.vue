<template>
  <div v-if="isTouchActive" class="mobile-controls-container">
    <!-- Left Virtual Joystick -->
    <div
      class="joystick-zone"
      ref="joystickZone"
      @touchstart.prevent="onTouchStartJoystick"
      @touchmove.prevent="onTouchMoveJoystick"
      @touchend.prevent="onTouchEndJoystick"
    >
      <div class="joystick-base">
        <div
          class="joystick-thumb"
          :style="{ transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)` }"
        ></div>
      </div>
    </div>

    <!-- Right Action Buttons Cluster -->
    <div class="actions-cluster">
      <div class="action-row top-row">
        <button class="mob-btn voice-btn" @click="emitKey('KeyX')" title="空間語音 (X)">
          🎙️
        </button>
        <button class="mob-btn veh-btn" @click="emitKey('KeyG')" title="切換載具 (G)">
          🛹
        </button>
        <button class="mob-btn arena-btn" @click="emitKey('KeyO')" title="競技場 (O)">
          🎮
        </button>
      </div>

      <div class="action-row main-row">
        <button class="mob-btn break-btn" @click="emitMouse(0)" title="開採 / 射擊">
          ⛏️
        </button>
        <button class="mob-btn place-btn" @click="emitMouse(2)" title="放置方塊">
          🧱
        </button>
        <button class="mob-btn jump-btn" @click="emitKey('Space')" title="跳躍 (Space)">
          🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isTouchActive = ref(false)
const thumbPos = ref({ x: 0, y: 0 })
const joystickZone = ref<HTMLElement>()

let touchId: number | null = null
let startPos = { x: 0, y: 0 }
const maxRadius = 45

function emitKey(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }))
  setTimeout(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }))
  }, 100)
}

function emitMouse(button: number): void {
  window.dispatchEvent(new CustomEvent('mobile-mouse-click', { detail: { button } }))
}

function onTouchStartJoystick(e: TouchEvent): void {
  if (touchId !== null) return
  const t = e.changedTouches[0]
  touchId = t.identifier
  startPos = { x: t.clientX, y: t.clientY }
  thumbPos.value = { x: 0, y: 0 }
}

function onTouchMoveJoystick(e: TouchEvent): void {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]
    if (t.identifier === touchId) {
      const dx = t.clientX - startPos.x
      const dy = t.clientY - startPos.y
      const dist = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx)

      const clampedDist = Math.min(dist, maxRadius)
      thumbPos.value = {
        x: Math.cos(angle) * clampedDist,
        y: Math.sin(angle) * clampedDist,
      }

      // Dispatch virtual WASD keys
      const threshold = 12
      const isW = dy < -threshold
      const isS = dy > threshold
      const isA = dx < -threshold
      const isD = dx > threshold

      window.dispatchEvent(new CustomEvent('virtual-joystick-move', {
        detail: {
          w: isW,
          s: isS,
          a: isA,
          d: isD,
          dx: thumbPos.value.x / maxRadius,
          dy: thumbPos.value.y / maxRadius,
        }
      }))
      break
    }
  }
}

function onTouchEndJoystick(e: TouchEvent): void {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]
    if (t.identifier === touchId) {
      touchId = null
      thumbPos.value = { x: 0, y: 0 }
      window.dispatchEvent(new CustomEvent('virtual-joystick-move', {
        detail: { w: false, s: false, a: false, d: false, dx: 0, dy: 0 }
      }))
      break
    }
  }
}

onMounted(() => {
  // Detect touch capability or allow force enabling on small screens
  isTouchActive.value = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 1024
  )
})
</script>

<style scoped>
.mobile-controls-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  user-select: none;
}

.joystick-zone {
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 140px;
  height: 140px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joystick-base {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(14, 22, 42, 0.6);
  border: 2px solid rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.joystick-thumb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, #00ffff 20%, #0088cc 80%);
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.6);
  transition: transform 0.05s ease-out;
}

.actions-cluster {
  position: absolute;
  bottom: 25px;
  right: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
}

.action-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.mob-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(14, 22, 42, 0.75);
  border: 1.5px solid rgba(0, 255, 255, 0.4);
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s, background 0.1s;
}

.mob-btn:active {
  transform: scale(0.92);
  background: rgba(0, 255, 255, 0.3);
}

.jump-btn {
  background: rgba(0, 255, 136, 0.25);
  border-color: #00ff88;
  font-size: 22px;
}

.break-btn {
  background: rgba(255, 0, 85, 0.25);
  border-color: #ff0055;
}

.place-btn {
  background: rgba(0, 255, 255, 0.25);
  border-color: #00ffff;
}
</style>
