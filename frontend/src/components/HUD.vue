<template>
  <div class="hud">
    <!-- Top Left: Virtual Land Plot & Metaverse Info -->
    <div class="plot-panel glass-panel">
      <div class="plot-header">
        <span class="plot-icon">🏛️</span>
        <span class="plot-title">{{ currentPlot?.plotName || `Chunk [${currentChunk.cx}, ${currentChunk.cz}]` }}</span>
      </div>
      <div class="plot-owner">
        領地擁有者: <span :class="{ 'self-owned': isOwner, 'public-land': !currentPlot }">{{ ownerText }}</span>
      </div>
      <button v-if="!currentPlot" class="btn-claim" @click="claimPlot">
        ⚡ 認領此區塊領地
      </button>
    </div>

    <!-- Top Right: Action Bar & Provider Badge -->
    <div class="top-right-bar">
      <button class="hud-btn" @click="ui.openVoxImporter" title="MagicaVoxel 3D 體素資產 (U)">
        📦 VOX (U)
      </button>
      <button class="hud-btn" @click="ui.openDrone" title="無人偵查機 (Y)">
        🛸 無人機 (Y)
      </button>
      <button class="hud-btn" @click="ui.openSkins" title="化身換裝 (H)">
        🥋 換裝 (H)
      </button>
      <button class="hud-btn" @click="ui.openMinigames" title="小遊戲競技場 (O)">
        🎮 跑酷 (O)
      </button>
      <button class="hud-btn" @click="ui.openQuests" title="任務手冊 (J)">
        📜 任務 (J)
      </button>
      <button class="hud-btn" @click="ui.openTools" title="空間工具庫 (T)">
        🛠️ 工具 (T)
      </button>
      <button class="hud-btn" @click="ui.openShaders" title="光影著色器 (K)">
        ✨ 著色器 (K)
      </button>
      <button class="hud-btn" @click="ui.openPhoto" title="賽博拍照模式 (F4)">
        📷 拍照 (F4)
      </button>
      <button class="hud-btn" @click="ui.openAchievements" title="成就殿堂 (F5)">
        🏆 成就 (F5)
      </button>
      <button class="hud-btn" @click="ui.openExport" title="3D 模型匯出 (F6)">
        📦 匯出 (F6)
      </button>
      <button class="hud-btn dimension-btn" @click="ui.openDimension" title="量子次元躍遷 (F7)">
        🌌 次元 (F7)
      </button>
      <button class="hud-btn fishing-btn" @click="ui.openFishing" title="賽博等離子垂釣 (P)">
        🎣 垂釣 (P)
      </button>
      <button class="hud-btn weather-btn" @click="cycleWeather" title="切換元宇宙天候 (晴/雨/雪/雷暴/沙暴)">
        {{ weatherIcon }} {{ weatherName }}
      </button>
      <button class="hud-btn vehicle-btn" @click="cycleVehicle" title="切換載具 (G)">
        {{ vehicleIcon }} {{ vehicleName }}
      </button>
      <button class="hud-btn profiler-btn" @click="toggleProfiler" title="效能與空間偵錯面板 (F3)">
        📊 偵錯 (F3)
      </button>
      <button class="hud-btn voice-btn" :class="{ live: spatialVoice.isJoined && !spatialVoice.isMicMuted }" @click="ui.openSpatialVoice" title="3D 空間語音 (X / F8)">
        🎙️ 語音 (X)
      </button>
      <button class="hud-btn blueprint-btn" @click="ui.openBlueprints" title="全息建築藍圖庫 (B)">
        🏛️ 藍圖 (B)
      </button>
      <button class="hud-btn combat-btn" @click="toggleGameMode" :title="combatStats.mode === 'survival' ? '切換為創造模式' : '切換為生存冒險模式'">
        {{ combatStats.mode === 'survival' ? '❤️ 生存' : '🛡️ 創造' }}
      </button>
      <button class="hud-btn saber-btn" :class="{ live: combatStats.saberActive }" @click="toggleSaber" title="裝備/收起賽博光劍 (R)">
        🗡️ 光劍 (R)
      </button>
      <button class="hud-btn sequencer-btn" :class="{ recording: isRecording }" @click="toggleSequencerRecording" title="賽博音序錄製器">
        {{ isRecording ? '🔴 錄製中...' : '🎵 音序錄音' }}
      </button>
      <button class="hud-btn midi-btn" @click="exportTrackMIDI" title="匯出標準 MIDI 檔案 (.mid)">
        💾 MIDI
      </button>
      <button class="hud-btn piano-btn" @click="ui.openPianoRoll" title="鋼琴卷軸工作室 (N)">
        🎹 鋼琴 (N)
      </button>
      <button class="hud-btn schem-btn" @click="ui.openSchematic" title="體素藍圖工作室 (L)">
        🏗️ 藍圖 (L)
      </button>
      <button class="hud-btn radar-btn" @click="ui.toggleMinimap" title="戰術雷達顯示開關 (M)">
        🗺️ 雷達 (M)
      </button>
      <button class="hud-btn npc-custom-btn" @click="ui.openNpcCustomizer" title="AI 伴侶換裝與性格自訂 (C)">
        🤖 伴侶 (C)
      </button>
      <button v-if="currentVehType !== 'none'" class="hud-btn stunt-btn" @click="triggerRollLeft" title="特技左側翻滾 (Q)">
        🌀 翻滾 (Q)
      </button>
      <button v-if="currentVehType !== 'none'" class="hud-btn stunt-btn" @click="triggerRollRight" title="特技右側翻滾">
        🌀 翻滾 (右)
      </button>
      <button v-if="currentVehType !== 'none'" class="hud-btn warp-btn" @click="triggerWarpBurst" title="音速曲率衝刺">
        🚀 衝刺
      </button>
      <button v-if="currentVehType !== 'none'" class="hud-btn cannon-btn" @click="triggerVehicleFire" title="發射車載等離子雙聯脈衝砲 (左鍵點擊)">
        🔫 主砲 ({{ Math.floor(vehicleStats.energy) }}%)
      </button>
      <button class="hud-btn turbo-btn" @click="cycleTurboColor" title="自訂渦輪等離子色彩">
        🎨 渦輪: {{ currentTurbo }}
      </button>
      <button class="hud-btn overdrive-btn" :class="{ live: overdriveActive }" @click="toggleOverdrive" title="超頻增壓渦輪 (+50% 極速)">
        ⚡ 超頻
      </button>
      <button class="hud-btn pet-cannon-btn" :class="{ live: houndCannonActive }" @click="toggleHoundCannon" title="裝備/卸載機械犬雷射砲">
        {{ houndCannonActive ? '🔫 獵犬雷射 (ON)' : '🐾 獵犬雷射 (OFF)' }}
      </button>
      <button class="hud-btn undo-btn" @click="triggerUndo" title="還原上一步 (Ctrl+Z)">
        ↩️ 還原
      </button>
      <button class="hud-btn" @click="ui.openSettings" title="世界設定 (F1)">
        ⚙️ 設定 (F1)
      </button>
      <div class="online-players-badge" title="即時協同在線玩家">
        👥 {{ onlineCount }}人 在線
      </div>
      <div class="provider-badge" :class="settings.provider">
        {{ settings.provider === 'local' ? '🧱 本地 AI' : `⚡ ${settings.provider.toUpperCase()}` }}
      </div>
    </div>

    <!-- Floating Voice Quick Bar -->
    <div v-if="spatialVoice.isJoined" class="voice-floating-bar" @click="ui.openSpatialVoice" title="點擊設定 3D 空間語音 (X / F8)">
      <span class="voice-mic-icon" :class="{ speaking: spatialVoice.isLocalSpeaking, muted: spatialVoice.isMicMuted }">
        {{ spatialVoice.isMicMuted ? '🔇' : (spatialVoice.isLocalSpeaking ? '🔊' : '🎙️') }}
      </span>
      <span class="voice-text">
        {{ spatialVoice.isMicMuted ? '麥克風靜音' : (spatialVoice.isLocalSpeaking ? '發話中...' : '3D 語音已連線') }}
      </span>
      <span class="voice-peers-count" v-if="peersCount > 0">
        👥 {{ peersCount }}人
      </span>
    </div>

    <!-- Minigame Live Arena HUD -->
    <div v-if="minigames.state.isActive" class="minigame-hud-bar glass-panel">
      <div class="minigame-header">
        <span class="minigame-badge" :class="minigames.state.type">
          {{ minigameTitle }}
        </span>
        <span class="minigame-score">⭐ 得分: {{ minigames.state.score }}</span>
        <button class="minigame-quit-btn" @click="quitMinigame">✕ 結束挑戰</button>
      </div>
      <div class="minigame-msg">{{ minigames.state.statusMessage }}</div>
    </div>

    <!-- Center: Build status notification -->
    <div v-if="ui.buildStatus" class="build-status">{{ ui.buildStatus }}</div>

    <!-- Survival Mode Health & Shield Bars -->
    <div v-if="combatStats.mode === 'survival'" class="survival-status-hud glass-panel">
      <div class="status-row">
        <span class="status-label">🛡️ 護盾</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill shield-fill" :style="{ width: `${(combatStats.shield / combatStats.maxShield) * 100}%` }"></div>
        </div>
        <span class="status-val">{{ Math.round(combatStats.shield) }}</span>
      </div>
      <div class="status-row">
        <span class="status-label">❤️ 生命</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill hp-fill" :style="{ width: `${(combatStats.health / combatStats.maxHealth) * 100}%` }"></div>
        </div>
        <span class="status-val">{{ Math.round(combatStats.health) }}</span>
      </div>
    </div>

    <!-- Dungeon Boss Health Bar -->
    <div v-if="combatStats.bossActive" class="boss-health-bar glass-panel">
      <div class="boss-header">
        <span class="boss-title">👾 核心守衛者 (Core Guardian)</span>
        <span class="boss-hp-text">{{ Math.round(combatStats.bossHealth) }} / {{ combatStats.bossMaxHealth }}</span>
      </div>
      <div class="boss-bar-bg">
        <div class="boss-bar-fill" :style="{ width: `${(combatStats.bossHealth / combatStats.bossMaxHealth) * 100}%` }"></div>
      </div>
    </div>

    <!-- Bottom: Controls hint -->
    <div class="hint">
      WASD: 移動 | 右鍵: 放置/開關/調音/馴服 | 左鍵: 破壞/揮砍 | R: 光劍 | B: 全息藍圖 | G: 載具 | ⛅: 氣候 | ⚡: 電路 | 🌊: 流體 | 🐾: 機械伴侶 | X: 語音 | F3: 偵錯 | F9: 快捷鍵
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUIStore } from '@/stores/ui'
import { sound } from '@/engine/audio'
import { achievements } from '@/engine/achievements'
import { spatialVoice } from '@/engine/spatialVoice'
import { minigames } from '@/engine/minigames'
import { weather, WEATHER_ROSTER, WeatherType } from '@/engine/weather'
import { vehicles, VEHICLE_CONFIGS, VehicleType } from '@/engine/vehicles'
import { multiplayerSync } from '@/engine/multiplayerSync'
import { survivalCombat } from '@/engine/survivalCombat'
import { noteSequencer } from '@/engine/noteSequencer'
import { vehicleMod, TurboColor } from '@/engine/vehicleMod'
import { cyberFauna } from '@/engine/cyberFauna'
import { vehicleStunts } from '@/engine/vehicleStunts'
import { vehicleCombat } from '@/engine/vehicleCombat'

const settings = useSettingsStore()
const ui = useUIStore()

const onlineCount = computed(() => multiplayerSync.getOnlineCount())
const combatStats = ref({ ...survivalCombat.stats })
const vehicleStats = ref({ ...vehicleCombat.stats })

const currentWeatherType = ref<WeatherType>(weather.getWeather())
const currentVehType = ref<VehicleType>(vehicles.getVehicle())

const weatherName = computed(() => WEATHER_ROSTER[currentWeatherType.value]?.name || '晴朗')
const weatherIcon = computed(() => WEATHER_ROSTER[currentWeatherType.value]?.icon || '☀️')

const vehicleName = computed(() => VEHICLE_CONFIGS[currentVehType.value]?.name || '步巡')
const vehicleIcon = computed(() => VEHICLE_CONFIGS[currentVehType.value]?.icon || '👟')

function cycleWeather(): void {
  currentWeatherType.value = weather.cycleWeather()
  ui.setBuildStatus(`⛅ 天候已切換為：${weatherName.value}`)
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function cycleVehicle(): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyG', bubbles: true }))
  currentVehType.value = vehicles.getVehicle()
}

function toggleProfiler(): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'F3', bubbles: true }))
}

const peersCount = computed(() => spatialVoice.peers.size)

const minigameTitle = computed(() => {
  switch (minigames.state.type) {
    case 'laser_arena': return '🔫 賽博激光槍戰'
    case 'voxel_snake': return '🐍 3D 體素貪吃蛇'
    case 'parkour': return '🏃‍♂️ 霓虹極限跑酷'
    default: return '🎮 競技場挑戰'
  }
})

function quitMinigame(): void {
  minigames.cleanupGameEntities()
  sound.playUiClick()
}

const currentChunk = ref({ cx: 0, cz: 0 })
const currentPlot = ref<any>(null)

const isOwner = computed(() => {
  return currentPlot.value && currentPlot.value.owner_id === settings.creatorId
})

const ownerText = computed(() => {
  if (!currentPlot.value) return '公共拓荒領地 (Public Domain)'
  if (isOwner.value) return '您本人 (擁有者)'
  return currentPlot.value.owner_id
})

function triggerUndo(): void {
  window.dispatchEvent(new CustomEvent('undo-build'))
}

async function fetchPlotInfo(cx: number, cz: number): Promise<void> {
  try {
    const res = await fetch(`http://localhost:4000/api/plots/${cx}/${cz}`)
    if (res.ok) {
      const data = await res.json()
      currentPlot.value = data
    }
  } catch {
    currentPlot.value = null
  }
}

async function claimPlot(): Promise<void> {
  try {
    const plotName = prompt('請為此領地命名：', `賽博莊園 [${currentChunk.value.cx}, ${currentChunk.value.cz}]`)
    if (!plotName) return

    const res = await fetch('http://localhost:4000/api/plots/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cx: currentChunk.value.cx,
        cz: currentChunk.value.cz,
        owner_id: settings.creatorId || 'anonymous_pioneer',
        plot_name: plotName
      })
    })
    if (res.ok) {
      const result = await res.json()
      currentPlot.value = result.plot
      sound.playFanfare()
      achievements.unlock('claim_land')
    }
  } catch (e) {
    console.error('Failed to claim plot', e)
  }
}

function onPlayerMoved(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    const ncx = Math.floor(custom.detail.x / 16)
    const ncz = Math.floor(custom.detail.z / 16)
    if (ncx !== currentChunk.value.cx || ncz !== currentChunk.value.cz) {
      currentChunk.value = { cx: ncx, cz: ncz }
      fetchPlotInfo(ncx, ncz)
    }
  }
}

function onKey(e: KeyboardEvent): void {
  if (e.code === 'KeyG') {
    setTimeout(() => {
      currentVehType.value = vehicles.getVehicle()
    }, 50)
  } else if (e.code === 'KeyN') {
    ui.openPianoRoll()
  } else if (e.code === 'KeyL') {
    ui.openSchematic()
  } else if (e.code === 'KeyM') {
    ui.toggleMinimap()
  } else if (e.code === 'KeyC') {
    ui.openNpcCustomizer()
  } else if (e.code === 'KeyP') {
    ui.openFishing()
  } else if (e.code === 'F7') {
    e.preventDefault()
    ui.openDimension()
  } else if (e.code === 'KeyQ' && currentVehType.value !== 'none') {
    triggerRollLeft()
  }
}

function triggerVehicleFire(): void {
  const custom = new CustomEvent('mobile-mouse-click', { detail: { button: 0 } })
  window.dispatchEvent(custom)
}

function triggerRollLeft(): void {
  const success = vehicleStunts.triggerBarrelRoll('left')
  if (success) {
    ui.setBuildStatus('🌀 執行左側 360° 特技翻滾！')
    setTimeout(() => ui.setBuildStatus(''), 1500)
  }
}

function triggerRollRight(): void {
  const success = vehicleStunts.triggerBarrelRoll('right')
  if (success) {
    ui.setBuildStatus('🌀 執行右側 360° 特技翻滾！')
    setTimeout(() => ui.setBuildStatus(''), 1500)
  }
}

function triggerWarpBurst(): void {
  const success = vehicleStunts.triggerWarpBurst()
  if (success) {
    ui.setBuildStatus('🚀 啟動音速曲率推進！速度短暫爆發 +75%')
    setTimeout(() => ui.setBuildStatus(''), 1500)
  }
}

function toggleGameMode(): void {
  const next = survivalCombat.toggleGameMode()
  ui.setBuildStatus(`模式已切換為：${next === 'survival' ? '❤️ 生存冒險模式' : '🛡️ 創造模式'}`)
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function toggleSaber(): void {
  const active = survivalCombat.toggleSaber()
  ui.setBuildStatus(active ? '🗡️ 賽博光劍已裝備 (左鍵揮砍)' : '🗡️ 賽博光劍已收起')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function onCombatStatsUpdate(e: Event): void {
  combatStats.value = { ...(e as CustomEvent).detail }
}

const isRecording = ref(noteSequencer.isRecording)
const notesCount = ref(noteSequencer.currentSong.notes.length)
const currentTurbo = ref<TurboColor>(vehicleMod.config.turboColor)
const overdriveActive = ref(vehicleMod.config.overdriveBooster)
const houndCannonActive = ref(false)

function toggleSequencerRecording(): void {
  if (noteSequencer.isRecording) {
    const song = noteSequencer.stopRecording()
    isRecording.value = false
    notesCount.value = song.notes.length
    ui.setBuildStatus(`⏹️ 音序錄製完成！共錄製 ${song.notes.length} 個音符`)
  } else {
    noteSequencer.startRecording()
    isRecording.value = true
    ui.setBuildStatus('🔴 音序錄製開始！敲擊或激發音符方塊即可記錄旋律')
  }
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function exportTrackMIDI(): void {
  if (noteSequencer.currentSong.notes.length === 0) {
    noteSequencer.loadPreset('cyber_arp')
  }
  noteSequencer.downloadMIDI()
  ui.setBuildStatus('💾 已成功匯出標準 MIDI 音軌檔 (.mid)！')
  setTimeout(() => ui.setBuildStatus(''), 2500)
}

function cycleTurboColor(): void {
  const colors: TurboColor[] = ['cyan', 'magenta', 'gold', 'lime', 'violet']
  const next = colors[(colors.indexOf(currentTurbo.value) + 1) % colors.length]
  vehicleMod.setTurboColor(next)
  currentTurbo.value = next
  ui.setBuildStatus(`🎨 載具等離子色彩：${next.toUpperCase()}`)
  setTimeout(() => ui.setBuildStatus(''), 1500)
}

function toggleOverdrive(): void {
  const active = vehicleMod.toggleMod('overdriveBooster')
  overdriveActive.value = active
  ui.setBuildStatus(active ? '⚡ 超頻增壓模組已啟動 (速度加乘 +50%)' : '⚡ 超頻增壓模組已關閉')
  setTimeout(() => ui.setBuildStatus(''), 2000)
}

function toggleHoundCannon(): void {
  houndCannonActive.value = !houndCannonActive.value
  if (houndCannonActive.value) {
    cyberFauna.equipTamedHoundsCannon(vehicleMod.getTurboHex())
    ui.setBuildStatus('🔫 機械獵犬已裝備肩扛式微型能量雷射砲！(戰鬥警戒模式)')
  } else {
    cyberFauna.unequipTamedHoundsCannon()
    ui.setBuildStatus('🐾 機械獵犬雷射砲已卸載 (悠閒伴侶模式)')
  }
  setTimeout(() => ui.setBuildStatus(''), 2500)
}

function onSequencerUpdate(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    isRecording.value = custom.detail.isRecording
    notesCount.value = custom.detail.song?.notes?.length ?? 0
  }
}

function onVehicleCombatUpdate(e: Event): void {
  const custom = e as CustomEvent
  if (custom.detail) {
    vehicleStats.value = { ...custom.detail }
  }
}

onMounted(() => {
  window.addEventListener('player-position', onPlayerMoved)
  window.addEventListener('keydown', onKey)
  window.addEventListener('combat-stats-update', onCombatStatsUpdate)
  window.addEventListener('sequencer-update', onSequencerUpdate)
  window.addEventListener('vehicle-combat-update', onVehicleCombatUpdate)
  fetchPlotInfo(0, 0)
  sound.startAmbience()
})

onUnmounted(() => {
  window.removeEventListener('player-position', onPlayerMoved)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('combat-stats-update', onCombatStatsUpdate)
  window.removeEventListener('sequencer-update', onSequencerUpdate)
  window.removeEventListener('vehicle-combat-update', onVehicleCombatUpdate)
  sound.stopAmbience()
})
</script>

<style scoped>
.hud { position: fixed; inset: 0; pointer-events: none; font-family: 'Inter', system-ui, sans-serif; }

.plot-panel {
  position: absolute; top: 20px; left: 20px;
  background: rgba(12, 16, 28, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  pointer-events: auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}
.plot-header { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; color: #00ffff; }
.plot-owner { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.public-land { color: #00ff88; font-weight: 600; }
.self-owned { color: #ffd700; font-weight: 700; text-shadow: 0 0 8px rgba(255,215,0,0.5); }
.btn-claim {
  margin-top: 8px; background: rgba(0, 255, 255, 0.2); border: 1px solid #00ffff;
  color: #00ffff; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
  cursor: pointer; transition: all 0.2s;
}
.btn-claim:hover { background: #00ffff; color: #000; transform: translateY(-1px); box-shadow: 0 0 10px rgba(0,255,255,0.5); }

.top-right-bar {
  position: absolute; top: 20px; right: 20px;
  display: flex; align-items: center; gap: 8px;
  pointer-events: auto; flex-wrap: wrap; justify-content: flex-end; max-width: 78vw;
}

.hud-btn {
  background: rgba(12, 16, 28, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff; padding: 6px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.hud-btn:hover { border-color: #00ffff; color: #00ffff; box-shadow: 0 0 10px rgba(0,255,255,0.25); transform: translateY(-1px); }

.voice-btn.live {
  border-color: #00ff88;
  color: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

.sequencer-btn.recording {
  border-color: #ff0055;
  color: #ff0055;
  box-shadow: 0 0 12px rgba(255, 0, 85, 0.45);
  animation: pulse-rec 1s infinite alternate;
}
@keyframes pulse-rec {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.overdrive-btn.live,
.pet-cannon-btn.live {
  border-color: #ffd700;
  color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.voice-floating-bar {
  position: absolute;
  top: 75px;
  right: 20px;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 20px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: all 0.2s;
}

.voice-floating-bar:hover {
  border-color: #00ffff;
  transform: translateY(-1px);
}

.voice-mic-icon.speaking {
  animation: pulseSpeaking 0.5s infinite alternate;
}

.voice-peers-count {
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

@keyframes pulseSpeaking {
  from { transform: scale(1.0); text-shadow: 0 0 4px #00ff88; }
  to { transform: scale(1.2); text-shadow: 0 0 12px #00ff88; }
}

.minigame-hud-bar {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 14, 26, 0.92);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  pointer-events: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 255, 255, 0.2);
  z-index: 60;
  animation: fadeIn 0.25s ease;
}

.minigame-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.minigame-badge {
  font-size: 13px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 6px;
  background: rgba(0, 255, 255, 0.15);
  color: #00ffff;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.minigame-badge.laser_arena {
  background: rgba(255, 0, 127, 0.2);
  color: #ff007f;
  border-color: rgba(255, 0, 127, 0.5);
}

.minigame-badge.voxel_snake {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border-color: rgba(0, 255, 136, 0.5);
}

.minigame-score {
  font-size: 14px;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.minigame-quit-btn {
  background: rgba(255, 70, 70, 0.2);
  border: 1px solid rgba(255, 70, 70, 0.4);
  color: #ff5555;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.minigame-quit-btn:hover {
  background: rgba(255, 70, 70, 0.4);
  color: #fff;
}

.minigame-msg {
  font-size: 12px;
  font-weight: 600;
  color: #eee;
  letter-spacing: 0.5px;
}

.undo-btn {
  border-color: rgba(0, 255, 255, 0.3);
  color: #00ffff;
}

.online-players-badge {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #34d399;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

.provider-badge {
  background: rgba(12, 16, 28, 0.82); backdrop-filter: blur(12px);
  color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
  border: 1px solid rgba(255,255,255,0.15);
}
.provider-badge.openai { color: #10a37f; border-color: rgba(16,163,127,0.4); }
.provider-badge.gemini { color: #4285f4; border-color: rgba(66,133,244,0.4); }
.provider-badge.claude { color: #f59e0b; border-color: rgba(245,158,11,0.4); }

.hint {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.85); font-size: 12px; white-space: nowrap;
  background: rgba(12, 16, 28, 0.82); backdrop-filter: blur(12px);
  padding: 6px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  font-weight: 500;
}

.build-status {
  position: absolute; top: 15%; left: 50%; transform: translate(-50%, 0);
  background: rgba(0,255,255,0.15); color: #00ffff; padding: 12px 28px; border-radius: 10px;
  border: 1px solid rgba(0,255,255,0.4); backdrop-filter: blur(12px);
  font-size: 15px; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,255,0.5);
  box-shadow: 0 0 24px rgba(0,255,255,0.25);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* Survival Status HUD */
.survival-status-hud {
  position: absolute;
  bottom: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(10, 16, 32, 0.85);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  width: 220px;
  pointer-events: auto;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  width: 50px;
  color: #eee;
}

.progress-bar-bg {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.shield-fill {
  background: linear-gradient(90deg, #0088ff, #00ffff);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}

.hp-fill {
  background: linear-gradient(90deg, #ff0055, #ff4466);
  box-shadow: 0 0 8px rgba(255, 0, 85, 0.5);
}

.status-val {
  font-size: 11px;
  font-family: monospace;
  font-weight: 700;
  color: #fff;
  width: 26px;
  text-align: right;
}

/* Boss Health Bar */
.boss-health-bar {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 440px;
  max-width: 90vw;
  background: rgba(15, 10, 25, 0.9);
  border: 1.5px solid #ff007f;
  border-radius: 12px;
  padding: 10px 18px;
  box-shadow: 0 0 20px rgba(255, 0, 127, 0.4);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.boss-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  color: #ff007f;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.boss-bar-bg {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 0, 127, 0.3);
}

.boss-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff0055, #ff00aa, #aa00ff);
  box-shadow: 0 0 10px rgba(255, 0, 170, 0.8);
  transition: width 0.15s ease-out;
}

.combat-btn {
  border-color: rgba(255, 0, 85, 0.4);
  color: #ff3377;
}

.saber-btn {
  border-color: rgba(0, 255, 255, 0.4);
  color: #00ffff;
}
.saber-btn.live {
  background: rgba(0, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.6);
}
</style>
