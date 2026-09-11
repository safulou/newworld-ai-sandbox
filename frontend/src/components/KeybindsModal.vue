<template>
  <div class="overlay" @click.self="close">
    <div class="help-panel glass-panel">
      <div class="header">
        <h2>⌨️ 操作控制與快捷鍵指南 (Keybindings Reference)</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="key-grid">
        <div v-for="cat in keyCategories" :key="cat.name" class="cat-group">
          <div class="cat-title">{{ cat.name }}</div>
          <div v-for="k in cat.keys" :key="k.combo" class="key-row">
            <span class="key-combo">{{ k.combo }}</span>
            <span class="key-desc">{{ k.desc }}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn-done" @click="close">了解 (ESC / F3)</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

interface KeyEntry {
  combo: string
  desc: string
}

interface KeyCategory {
  name: string
  keys: KeyEntry[]
}

const keyCategories: KeyCategory[] = [
  {
    name: '視角、移動與載具',
    keys: [
      { combo: 'W / A / S / D', desc: '前後左右平移' },
      { combo: 'Space', desc: '跳躍 / 飛行上升' },
      { combo: 'Shift', desc: '衝刺 / 飛行下降' },
      { combo: 'G', desc: '召喚 / 收起 賽博懸浮滑板 (Hoverboard)' },
      { combo: 'V', desc: '切換視角 (RTS / 第一人稱 / 第三人稱)' },
      { combo: 'F', desc: '切換創造飛行 vs 重力行走' },
    ]
  },
  {
    name: '建造、工具與任務',
    keys: [
      { combo: '滑鼠右鍵', desc: '放置手持方塊 (附空間音效)' },
      { combo: '滑鼠左鍵', desc: '破壞挖掘方塊 (附粒子碎屑)' },
      { combo: '1 ~ 9', desc: '快速選取 Hotbar 材質' },
      { combo: 'E', desc: '開啟全品類創造物品庫' },
      { combo: 'T', desc: '開啟空間多功能工具庫 (Tools)' },
      { combo: 'J', desc: '開啟元宇宙任務手冊 (Quest Log)' },
      { combo: 'U', desc: '開啟 MagicaVoxel .VOX 3D 資產中心' },
      { combo: 'Y', desc: '開啟 Sparky 無人偵查機控制台' },
      { combo: 'H', desc: '開啟 化身外觀換裝工作室' },
      { combo: 'O', desc: '開啟 霓虹跑酷競技場' },
      { combo: 'N', desc: '開啟 自訂體素藍圖工作室' },
      { combo: 'Ctrl + Z / Y', desc: '空間還原 (Undo) / 重做 (Redo)' },
    ]
  },
  {
    name: 'AI、光影與系統',
    keys: [
      { combo: 'B', desc: '開啟 AI Voxel Architect 自然語言建造' },
      { combo: 'P', desc: '開啟 3D 建築巨型藍圖庫' },
      { combo: 'K', desc: '開啟 著色器與後製特效工作室 (Shaders)' },
      { combo: 'F4', desc: '開啟 賽博光影拍照相機 (Photo Mode)' },
      { combo: 'F5', desc: '開啟 元宇宙成就殿堂 (Achievements)' },
      { combo: 'F6', desc: '匯出 3D .OBJ 模型與 JSON 數據' },
      { combo: 'M / F7', desc: '開啟 Lo-Fi 合成音頻工作室' },
      { combo: 'C', desc: '開啟 SHA-256 區塊鏈記帳簿' },
      { combo: 'Enter', desc: '聚焦 / 開啟多人即時聊天室' },
      { combo: 'F1', desc: '元宇宙世界設定 (日夜光影/API Key)' },
      { combo: 'F2', desc: '快速存檔世界' },
      { combo: 'F3', desc: '開啟快捷鍵參照指南 (本視窗)' },
    ]
  }
]

function close(): void {
  ui.closeOverlay()
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(8px);
}

.help-panel {
  width: 780px; max-width: 95vw; padding: 24px;
  background: rgba(14, 18, 32, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 14px; color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
h2 { font-size: 20px; font-weight: 700; color: #00ffff; }
.close-btn { background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; }
.close-btn:hover { color: #fff; }

.key-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-height: 440px; overflow-y: auto;
}

.cat-group {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 12px;
}
.cat-title {
  font-size: 13px; font-weight: 700; color: #00ffff; margin-bottom: 10px;
  border-bottom: 1px solid rgba(0,255,255,0.2); padding-bottom: 4px;
}

.key-row {
  display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px;
}
.key-combo {
  font-family: monospace; font-size: 11px; font-weight: 700; color: #ffd700;
  background: rgba(255,215,0,0.1); padding: 2px 6px; border-radius: 4px; width: fit-content;
}
.key-desc {
  font-size: 11px; color: rgba(255,255,255,0.75); line-height: 1.3;
}

.footer {
  display: flex; justify-content: flex-end; margin-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;
}
.btn-done {
  padding: 8px 20px; background: #00ffff; color: #000; border: none; border-radius: 8px;
  font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-done:hover { box-shadow: 0 0 16px rgba(0,255,255,0.6); transform: translateY(-1px); }
</style>
