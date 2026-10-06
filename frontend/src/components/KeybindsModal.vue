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
      { combo: '滑鼠右鍵', desc: '放置方塊 / 開關撥桿 / 音符調音 / 馴養機械犬' },
      { combo: '滑鼠左鍵', desc: '開採方塊 / 光劍揮砍攻擊' },
      { combo: 'R', desc: '裝備 / 收起 賽博光劍 (Cyber Beam Saber)' },
      { combo: '1 ~ 9', desc: '快速選取 Hotbar 材質' },
      { combo: 'E', desc: '開啟全品類創造物品庫' },
      { combo: 'T', desc: '開啟空間多功能工具庫 (Tools)' },
      { combo: 'J', desc: '開啟元宇宙任務手冊 (Quest Log)' },
      { combo: 'U', desc: '開啟 MagicaVoxel .VOX 3D 資產中心' },
      { combo: 'Y', desc: '開啟 Sparky 無人偵查機控制與空投終端' },
      { combo: 'H', desc: '開啟 化身外觀換裝工作室' },
      { combo: 'O', desc: '開啟 霓虹跑酷競技場' },
      { combo: 'N', desc: '開啟 鋼琴卷軸多軌音序工作室 (Piano Roll)' },
      { combo: 'L', desc: '開啟 體素藍圖工作室 (Schematic Studio)' },
      { combo: 'P', desc: '開啟 賽博等離子垂釣與水棲圖鑑 (Plasma Angling)' },
      { combo: 'Ctrl + Z / Y', desc: '空間還原 (Undo) / 重做 (Redo)' },
    ]
  },
  {
    name: 'AI、次元、載具與系統',
    keys: [
      { combo: 'B', desc: '開啟 全息建築藍圖庫 (Hologram Blueprint)' },
      { combo: 'F7', desc: '開啟 量子次元躍遷門 (Dimension Warp Realm)' },
      { combo: 'M', desc: '切換 戰術全景圓形雷達 (Tactical Radar)' },
      { combo: 'C', desc: '開啟 AI 伴侶造型與性格工作室 (NPC Studio)' },
      { combo: 'Q', desc: '載具空中 360° 特技側滾 (Vehicle Barrel Roll)' },
      { combo: 'K', desc: '開啟 著色器與後製特效工作室 (Shaders)' },
      { combo: 'F4', desc: '開啟 賽博光影拍照相機 (Photo Mode)' },
      { combo: 'F5', desc: '開啟 元宇宙成就殿堂 (Achievements)' },
      { combo: 'F6', desc: '匯出 3D .OBJ 模型與 JSON 數據' },
      { combo: 'Enter', desc: '聚焦 / 開啟多人即時聊天室' },
      { combo: 'X / F8', desc: '開啟 3D WebRTC 空間語音通話 (Spatial Voice)' },
      { combo: 'F1', desc: '元宇宙世界設定 (日夜光影/API Key)' },
      { combo: 'F2', desc: '快速存檔世界' },
      { combo: 'F3', desc: '切換 賽博效能與空間偵錯面板 (Cyber Profiler)' },
      { combo: 'F9', desc: '開啟快捷鍵參照指南 (本視窗)' },
      { combo: 'F10', desc: '開啟 磁浮超迴路列車調度台 (Hyperloop Transit)' },
      { combo: 'F11', desc: '開啟 微體素全息雕刻儀與投影台 (Micro-Voxel Sculptor)' },
      { combo: 'F12', desc: '開啟 定向重力異常與極限跑酷 (Gravity & Parkour)' },
      { combo: 'HUD 🔭', desc: '開啟 全息星空天文台 (Celestial Observatory)' },
      { combo: 'HUD ☢️', desc: '開啟 等離子核聚變反應堆 (Plasma Fusion Reactor)' },
      { combo: 'HUD 🏆', desc: '開啟 幽靈競速電競天梯榜 (Ghost Replay & Leaderboard)' },
      { combo: 'HUD 🐾', desc: '開啟 AI 生態巡護與機械獸繁育 (Cyber Rangers & Eco-Wardens)' },
      { combo: 'HUD 🚀', desc: '開啟 軌道空間站與模組化星艦造船塢 (Orbital Drydock)' },
      { combo: 'HUD 🌊', desc: '開啟 深海深淵海溝與電漿深潛艇 (Abyssal Submersible)' },
      { combo: 'HUD 🧠', desc: '開啟 全息 AI 神經行為樹編輯器 (Holo Behavior Tree)' },
      { combo: 'HUD 💻', desc: '開啟 賽博甲板終端與網絡入侵協定 (Cyberdeck Netrunner)' },
      { combo: 'HUD 🌌', desc: '開啟 星艦超空間曲率躍遷驅動 (Hyperjump Drive)' },
      { combo: 'HUD 🛡️', desc: '開啟 賽博黑客領地防衛與網絡潛入 (Netrunner Subnet Warfare)' },
      { combo: 'HUD 🐉', desc: '開啟 深海深淵機械利維坦 Boss 討伐戰 (Deep-Sea Leviathan)' },
      { combo: 'HUD ⚡', desc: '開啟 全服多基地超導電網同調與能源交易 (Supergrid Power & Market)' },
      { combo: 'HUD 🛸', desc: '開啟 星際殖民地母艦生態圈 (Colony Ark & Biosphere)' },
      { combo: 'HUD 🏴‍☠️', desc: '開啟 賽博公會聯盟領地戰 (Syndicate Corporate Wars)' },
      { combo: 'HUD 🦾', desc: '開啟 利維坦生物機械外骨骼裝配鍛造 (Exosuit Forge)' },
      { combo: 'HUD 📡', desc: '開啟 全息星圖量子跨次元躍遷信標 (Stellar Beacon Network)' },
      { combo: 'HUD 🚀', desc: '開啟 多母艦軌道編隊與深空遠征艦隊 (Ark Fleet Expeditions)' },
      { combo: 'HUD 💥', desc: '開啟 公會空天旗艦突襲戰 (Syndicate Flagship Raids)' },
      { combo: 'HUD 🕳️', desc: '開啟 量子暗物質時空裂隙探索 (Quantum Dark Matter Rifts)' },
      { combo: 'HUD ☀️', desc: '開啟 遠古戴森球環形世界宏工程 (Dyson Sphere Megastructure)' },
      { combo: 'HUD 🪐', desc: '開啟 跨星系蟲洞引力彈弓軌道網絡 (Wormhole Slingshot)' },
      { combo: 'HUD 👑', desc: '開啟 全服世界首領宇宙泰坦浩劫 (World Titan Invasion)' },
      { combo: 'HUD 🧬', desc: '開啟 量子神經意識克隆與移魂網絡 (Neural Mind Transfer)' },
      { combo: 'HUD 📻', desc: '開啟 超空間量子通訊廣播與星網 (Quantum BBS)' },
      { combo: 'HUD 🕳️', desc: '開啟 黑洞視界能層與奇點萃取站 (Singularity Extractor)' },
      { combo: 'HUD 🌀', desc: '開啟 超空間星門躍遷航道與引力樞紐 (Stargate Network)' },
      { combo: 'HUD 🏛️', desc: '開啟 星際外交聯盟與銀河議會 (Galactic Council)' },
      { combo: 'HUD 🧪', desc: '開啟 異星基因工坊與生物誘變培育 (Genome Forge)' },
      { combo: 'HUD 🌌', desc: '開啟 卡爾達肖夫文明等級評定與奇點超越儀 (Kardashev Metric)' },
      { combo: 'HUD 🛰️', desc: '開啟 戴森雲反射群集拓撲網絡 (Dyson Swarm Mesh)' },
      { combo: 'HUD 🌋', desc: '開啟 全球地熱超深鑽井與行星地核引擎 (Planetary Core Dynamo)' },
      { combo: 'HUD ⏳', desc: '開啟 時間因果律校準儀與微型時空閉環 (Chrono Stabilizer)' },
      { combo: 'HUD 🫧', desc: '開啟 平行宇宙泡泡世界拓撲觀測儀 (Multiverse Bubble)' },
      { combo: 'HUD 🪐', desc: '開啟 星際巨構環形世界建造船塢 (Ringworld Fabricator)' },
      { combo: 'HUD 📜', desc: '開啟 量子宏觀創世神諭樹與宇宙常數微調 (Genesis Oracle)' },
      { combo: 'HUD 🎻', desc: '開啟 超弦維度空間折疊傳輸矩陣 (String Fold Matrix)' },
      { combo: 'HUD 🛡️', desc: '開啟 暗能量真空衰變抵禦力場 (Vacuum Decay Ward)' },
      { combo: 'HUD 🕳️', desc: '開啟 太初原初黑洞星雲發電機 (Primordial Black Hole)' },
      { combo: 'HUD 🗺️', desc: '開啟 量子糾纏全息星圖沙盤 (Quantum Holo-Starchart)' },
      { combo: 'HUD ⚡', desc: '開啟 超光速因果律超弦通訊網 (Tachyonic Causality Mesh)' },
      { combo: 'HUD ❄️', desc: '開啟 中微子超流體暗物質探測陣列 (Neutrino Detector)' },
      { combo: 'HUD 🔥', desc: '開啟 夸克膠子等離子體原始重子重組爐 (Quark Plasma Forge)' },
      { combo: 'HUD 🕸️', desc: '開啟 時空量子幾何自旋泡沫網絡 (Spinfoam Lattice)' },
      { combo: 'HUD 🌐', desc: '開啟 全息宇宙事件視界編碼矩陣 (Holographic Horizon)' },
      { combo: 'HUD 🌉', desc: '開啟 量子引力蟲洞橋與愛因斯坦-羅森橋 (Wormhole Bridge)' },
      { combo: 'HUD ⚛️', desc: '開啟 大統一理論規範玻色子對撞核心 (GUT Collider)' },
      { combo: 'HUD 🌀', desc: '開啟 拓撲量子幾何陳類數纖維叢 (Topological Chern)' },
      { combo: 'HUD 〰️', desc: '開啟 宇宙弦微波背景輻射透鏡測繪儀 (Cosmic String)' },
      { combo: 'HUD 🚀', desc: '開啟 反物質暗能量湮滅推進矩陣 (Antimatter Propulsion)' },
      { combo: 'HUD 🧲', desc: '開啟 軸子暗物質暈微波共振腔 (Axion Haloscope)' },
      { combo: 'HUD ⏰', desc: '開啟 量子糾纏時間鏡像拓撲雷達 (Time-Reversal Radar)' },
      { combo: 'HUD 🕸️', desc: '開啟 全息共形場宇宙弦網冷凝 (String-Net Condensate)' },
      { combo: 'HUD 🌀', desc: '開啟 旋量網絡超引力旋轉推進 (Supergravity Spinor)' },
      { combo: 'HUD ⏳', desc: '開啟 潘洛斯宇宙循環相干引力波測量儀 (Penrose CCC Detector)' },
      { combo: 'HUD 💻', desc: '開啟 量子霍爾反常邊緣態超流體晶片 (QAH Superfluid Microchip)' },
      { combo: 'HUD 🔭', desc: '開啟 費米子暗物質費米面量子壓縮透鏡 (Fermionic Dark Matter)' },
      { combo: 'HUD 🌈', desc: '開啟 宇宙弦重力子彩虹度規探測網 (Rainbow Graviton Mesh)' },
      { combo: 'HUD 🔊', desc: '開啟 超流真空聲學事件視界發電機 (Acoustic Black Hole)' },
      { combo: 'HUD ⌛', desc: '開啟 量子多體疤痕時間晶體調諧器 (Scarred Time Crystal)' },
      { combo: 'HUD 📐', desc: '開啟 拓撲超導高階角態量子中繼陣列 (Corner State Relay)' },


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
