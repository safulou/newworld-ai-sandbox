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
      { combo: 'HUD ⚙️', desc: '開啟 拓撲缺陷卡西米爾真空扭矩馬達 (Casimir Vacuum Torque Motor)' },
      { combo: 'HUD 🔮', desc: '開啟 非阿貝爾任意子全息量子糾錯編碼室 (Anyon Holographic Code)' },
      { combo: 'HUD 💫', desc: '開啟 相對論性量子資訊穿梭超流波導 (Relativistic Teleportation)' },
      { combo: 'HUD ⚡', desc: '開啟 極限普朗克常數真空相變臨界諧振腔 (Planck Vacuum Cavity)' },
      { combo: 'HUD ❄️', desc: '開啟 拓撲超固體量子渦旋流動反應堆 (Topological Supersolid)' },
      { combo: 'HUD 🌌', desc: '開啟 太初原初引力波隨機背景干涉儀 (Primordial SGWB)' },
      { combo: 'HUD 🧲', desc: '開啟 阿哈羅諾夫-玻姆幾何相位超導環陣列 (Aharonov-Bohm Ring)' },
      { combo: 'HUD ⚛️', desc: '開啟 超對稱外爾費米子手性反常能源核 (Weyl Chiral Anomaly)' },
      { combo: 'HUD ✨', desc: '開啟 拓撲激子極化激元量子流體反應堆 (Exciton-Polariton Condensate)' },
      { combo: 'HUD ⏳', desc: '開啟 非平衡態 Floquet 預熱拓撲時間晶體 (Floquet Prethermal Time Crystal)' },
      { combo: 'HUD 🌌', desc: '開啟 霍金-安魯效應全息引力對偶量子微波探測器 (Hawking-Unruh Detector)' },
      { combo: 'HUD 🧲', desc: '開啟 阿哈羅諾夫-卡舍爾中性費米子自旋拓撲干涉儀 (Aharonov-Casher Interferometer)' },
      { combo: 'HUD 🌀', desc: '開啟 旋量玻色-愛因斯坦凝聚斯格明子拓撲天體反應堆 (Spinor Skyrmion Condensate)' },
      { combo: 'HUD 🎯', desc: '開啟 非厄米拓撲奇異點雷射放大器 (Exceptional Point Laser)' },
      { combo: 'HUD ⚛️', desc: '開啟 拓撲馬約拉納零能模非阿貝爾量子編織晶片 (Majorana Braiding Chip)' },
      { combo: 'HUD 🕳️', desc: '開啟 卡魯扎-克萊因高維引力微型黑洞探針 (Kaluza-Klein Micro Black Hole)' },
      { combo: 'HUD 🌀', desc: '開啟 拓撲莫爾超晶格平帶非常規超導反應堆 (Moiré Flat-Band Superconductor)' },
      { combo: 'HUD 🌌', desc: '開啟 時空引力波記憶效應天線矩陣 (GW Memory Array)' },
      { combo: 'HUD 🧲', desc: '開啟 反鐵磁拓撲磁振子狄拉克半金屬波導 (Antiferromagnetic Magnon)' },
      { combo: 'HUD 🕳️', desc: '開啟 全息蟲洞量子隱形傳態對偶反應爐 (Holographic Traversable Wormhole)' },
      { combo: 'HUD ⚛️', desc: '開啟 拓撲手性反常弗蘭肯斯坦量子泵浦反應堆 (Chiral Anomaly Quantum Pump)' },
      { combo: 'HUD 🌀', desc: '開啟 引力波自旋記憶與天球角動量流干涉網 (GW Spin Memory Array)' },
      { combo: 'HUD 📐', desc: '開啟 三維二階拓撲超導馬約拉納手性鉸鏈態晶片 (HOTSC Hinge Majorana Chip)' },
      { combo: 'HUD 🏝️', desc: '開啟 AdS/BCFT 邊界量子島黑洞資訊恢復反應堆 (AdS/BCFT Quantum Island)' },
      { combo: 'HUD 🌀', desc: '開啟 拓撲分數量子自旋液體與基塔耶夫蜂巢晶格反應堆 (Fractional Quantum Spin Liquid)' },
      { combo: 'HUD 🕳️', desc: '開啟 克爾黑洞極端光子球與事件視界全息陰影重構陣列 (Kerr Photon Shadow Array)' },
      { combo: 'HUD ⚙️', desc: '開啟 手性超材料動態拓撲卡西米爾斥力發電機 (Repulsive Casimir Motor)' },
      { combo: 'HUD 🌌', desc: '開啟 AdS/dS 雙曲多端可穿越蟲洞多體糾纏網絡 (Multi-Boundary Wormhole Network)' },
      { combo: 'HUD ⚛️', desc: '開啟 量子反常分數霍爾反應堆 (Fractional Quantum Anomalous Hall)' },
      { combo: 'HUD 📻', desc: '開啟 太赫茲約瑟夫森量子混頻器 (THz Josephson Quantum Mixer)' },
      { combo: 'HUD 🧲', desc: '開啟 動態拓撲磁電效應軸子絕緣體諧振腔 (Axion Insulator Resonator)' },
      { combo: 'HUD 🌌', desc: '開啟 全息複雜度作用量引擎 (Holographic Complexity Engine)' },
      { combo: 'HUD 🌊', desc: '開啟 拓撲手性超流體 p_x + i p_y 反應堆 (Chiral Superfluid Reactor)' },
      { combo: 'HUD 🛡️', desc: '開啟 量子自旋霍爾效應螺旋晶片 (Quantum Spin Hall Chip)' },
      { combo: 'HUD 🌈', desc: '開啟 巨克爾量子孤子光頻梳發電機 (Kerr Soliton Comb)' },
      { combo: 'HUD 🌪️', desc: '開啟 全息外爾量子臨界流體引擎 (Holographic Weyl Fluid Engine)' },
      { combo: 'HUD ⚛️', desc: '開啟 富田-竹崎模態流與量子糾纏真空引擎 (Modular Hamiltonian Vacuum Engine)' },
      { combo: 'HUD 🌀', desc: '開啟 多通道近藤效應與非費米液體奇異金屬反應堆 (Multi-Channel Kondo Reactor)' },
      { combo: 'HUD 🔭', desc: '開啟 雙折射引力透鏡與偏振旋角幾何相光子干涉儀 (Birefringent Grav Lens)' },
      { combo: 'HUD 🔮', desc: '開啟 AdS/CFT 蟲洞微觀態與哈密頓量截斷弦網張量重構機 (Holo Microstate Mesh)' },
      { combo: 'HUD 🧬', desc: '開啟 菲波那契金鍵任意子編織處理器 (Fibonacci Anyon Processor)' },
      { combo: 'HUD 🌌', desc: '開啟 引力波天球全息與 BMS 漸近天線 (Celestial Holo BMS)' },
      { combo: 'HUD ⚡', desc: '開啟 弗洛凱拓撲超導與安德烈夫量子引擎 (Floquet Andreev Engine)' },
      { combo: 'HUD 🌀', desc: '開啟 莫爾平帶量子度規幾何超流反應堆 (Quantum Metric Superfluid)' },
      { combo: 'HUD 🌈', desc: '開啟 扭轉多層光子晶體拓撲平帶極化激元 (Twisted Polariton Flat-Band)' },
      { combo: 'HUD ❄️', desc: '開啟 高階維格納晶體量子熔化與向列量子液晶 (Wigner Crystal & Nematic Liquid)' },
      { combo: 'HUD 🌌', desc: '開啟 德西特宇宙全息對偶與靜態膜極端熵 (de Sitter Static Patch Holography)' },
      { combo: 'HUD 🔊', desc: '開啟 拓撲手性聲子與量子反常聲霍爾效應 (Chiral Phonon & Acoustic Hall)' },
      { combo: 'HUD ⚡', desc: '開啟 軸子弦星系激波與超光速引力切倫科夫輻射天線 (Axion Cherenkov)' },
      { combo: 'HUD 🌐', desc: '開啟 拓撲四維量子霍爾效應與第二陳數合成維度反應堆 (4D Quantum Hall)' },
      { combo: 'HUD 🧬', desc: '開啟 非阿貝爾分數量子霍爾帕拉費米子與拓撲四重量子位元處理器 (Parafermion)' },
      { combo: 'HUD 🪐', desc: '開啟 超弦緊緻化卡拉比-丘流形模場穩定性與宇宙暴脹發電機 (Calabi-Yau Moduli)' },
      { combo: 'HUD 🕳️', desc: '開啟 霍金-佩奇黑洞相變與全息引力凝聚 (Hawking-Page AdS Transition)' },
      { combo: 'HUD 🧲', desc: '開啟 三維拓撲絕緣體軸子電動力學與維騰效應 (Axion TI & Witten Effect)' },
      { combo: 'HUD 🌲', desc: '開啟 量子自旋玻璃帕里西極值破缺與超度規 (Parisi Spin Glass & Ultrametricity)' },
      { combo: 'HUD 🌀', desc: '開啟 非阿貝爾宇宙渦旋弦與暴脹發電機 (Non-Abelian Cosmic Vortex)' },
      { combo: 'HUD 📐', desc: '開啟 阿哈羅諾夫-安丹幾何相位與非阿貝爾拓撲泵浦 (Aharonov-Anandan Phase)' },
      { combo: 'HUD 🧭', desc: '開啟 引力電磁學與蘭斯-蒂靈時空拖曳 (Gravito-Electromagnetism & Lense-Thirring)' },
      { combo: 'HUD ⚡', desc: '開啟 外爾半金屬費米弧與手性磁效應 (Weyl Fermi Arc & CME)' },
      { combo: 'HUD 🛡️', desc: '開啟 超弦 D-膜重聯與 DBI 非線性真空反應堆 (D-Brane & DBI Vacuum)' },
      { combo: 'HUD ⚛️', desc: '開啟 拓撲近藤絕緣體與表面狄拉克錐 (Topological Kondo Insulator)' },
      { combo: 'HUD 🧲', desc: '開啟 中子星磁星 QED 真空雙折射與星震 (Magnetar QED & Starquake)' },
      { combo: 'HUD 🌌', desc: '開啟 全息超導與荷電黑洞 AdS-RN 純量凝聚 (Holographic Superconductor)' },
      { combo: 'HUD 🌀', desc: '開啟 瞬子真空隧道效應與楊-米爾斯 θ-真空 (Yang-Mills Instanton Vacuum)' },
      { combo: 'HUD ⚡', desc: '開啟 舒溫格真空衰變與強場 QED 級聯雪崩 (Schwinger Vacuum Breakdown)' },
      { combo: 'HUD 🌀', desc: '開啟 旋轉黑洞超輻射不穩定性與軸子玻色子雲 (Black Hole Superradiance & Axion)' },
      { combo: 'HUD 🔥', desc: '開啟 奇異金屬普朗克極限耗散與 SYK 全息混亂 (Strange Metal & SYK Chaos)' },
      { combo: 'HUD 🛡️', desc: '開啟 拓撲量子自旋霍爾螺旋邊緣態與分數孤子 (Quantum Spin Hall & Fractional Soliton)' },
      { combo: 'HUD ⚡', desc: '開啟 動力學卡西米爾效應與 SQUID 加速運動反射鏡 (Dynamical Casimir Effect)' },
      { combo: 'HUD 🌊', desc: '開啟 量子霍爾奇性黏度與 Read-Rezayi 幾何流體 (Hall Viscosity & Read-Rezayi)' },
      { combo: 'HUD 🌌', desc: '開啟 外爾費米子混合引力-手性反常與熱電輸運 (Gravitational Chiral Anomaly)' },
      { combo: 'HUD ⚛️', desc: '開啟 魔角扭轉雙層石墨烯平帶與非常規超導 (Magic-Angle Twisted Graphene)' },
      { combo: 'HUD 🧪', desc: '開啟 超流氦-3 拓撲 B 相與馬約拉納表面態 (Superfluid Helium-3 B Phase)' },
      { combo: 'HUD 👼', desc: '開啟 量子反常霍爾手性馬約拉納天使粒子 (Chiral Majorana Fermion Modes)' },
      { combo: 'HUD 🪐', desc: '開啟 黑洞量子視界引力波迴聲諧振腔 (Black Hole Quantum Echoes)' },
      { combo: 'HUD ⚛️', desc: '開啟 幾何複合費米子與 HLR 偶分母費米面 (Composite Fermion Liquid)' },
      { combo: 'HUD 🌪️', desc: '開啟 拓撲超流安德森局域化與 Thouless 逆參與率 (Disorder Anderson Superfluid)' },
      { combo: 'HUD 🌀', desc: '開啟 旋轉玻色-愛因斯坦凝聚阿布里科索夫渦旋晶格 (Rotating BEC Abrikosov Lattice)' },
      { combo: 'HUD 🧩', desc: '開啟 表面碼同調量子記憶體與 MWPM 糾錯 (Surface Code Quantum Memory)' },
      { combo: 'HUD 🌌', desc: '開啟 AdS3/CFT2 全息對偶糾纏負度與共形反常 (Holographic Entanglement Negativity)' },
      { combo: 'HUD 🎯', desc: '開啟 狄拉克克萊因穿隧與 Veselago 負折射透鏡 (Dirac Klein Tunneling & Lens)' },
      { combo: 'HUD 🌈', desc: '開啟 自旋-軌道耦合玻色凝聚條紋超固相 (Spin-Orbit Coupled BEC & Stripe Phase)' },
      { combo: 'HUD 🧲', desc: '開啟 磁性外爾半金屬軸子極化子與反鐵磁共振 (Magnetic Weyl Axion Polariton)' },
      { combo: 'HUD 🏝️', desc: '開啟 全息佩奇曲線與量子極值島嶼 (Holographic Page Island & QES)' },
      { combo: 'HUD 🌀', desc: '開啟 扭轉雙層 MoTe₂ 莫爾分數陳絕緣體與非阿貝爾任意子 (Fractional Chern MoTe2)' },
      { combo: 'HUD ⚡', desc: '開啟 弗洛凱-斯圖克伯格量子位元干涉與 CDT 穿隧相消 (Floquet-LZSM Interferometry)' },
      { combo: 'HUD 🪐', desc: '開啟 克爾-紐曼黑洞能層發電機與 BZ 極區噴流 (Kerr-Newman Ergosphere & Jet)' },
      { combo: 'HUD 🌌', desc: '開啟 全息重整化群流與不可逆 c-定理 (Holographic c-Theorem RG Flow)' },
      { combo: 'HUD 🌀', desc: '開啟 量子渦旋霍爾效應與雙重超流反應堆 (Quantum Vortex Hall Superfluid)' },
      { combo: 'HUD ⚡', desc: '開啟 弗洛凱-馬約拉納時間晶體與週期倍增 (Floquet Majorana Time Crystal)' },
      { combo: 'HUD 🪐', desc: '開啟 超弦重聯與快子喉管躍遷反應堆 (Tachyonic Cosmic String Reconnection)' },
      { combo: 'HUD 🌌', desc: '開啟 全息量子混亂與極大李雅普諾夫熱化反應堆 (Holographic Chaos & MSS Bound)' },
      { combo: 'HUD ❄️', desc: '開啟 莫爾拓撲激子絕緣體與對流超流反應堆 (Moiré Excitonic Insulator & Counterflow BEC)' },
      { combo: 'HUD 🌀', desc: '開啟 非阿貝爾自旋超流與外爾扭折反應堆 (Non-Abelian Spin Superfluid & Weyl Kink)' },
      { combo: 'HUD 📡', desc: '開啟 普朗克引力暴脹與全息對偶天線 (Planckian Inflation & Holographic Antenna)' },
      { combo: 'HUD 🎯', desc: '開啟 拓撲非互易光子晶體奇異點雷射發電機 (Topological Non-Reciprocal Laser)' },
      { combo: 'HUD ⚛️', desc: '開啟 莫爾分數量子自旋霍爾與雙重自旋液體反應堆 (Fractional QSH & Dual Spin Liquid)' },
      { combo: 'HUD ⚡', desc: '開啟 拓撲馬約拉納零模約瑟夫森二極體 (Topological Majorana Josephson Diode)' },
      { combo: 'HUD 🔮', desc: '開啟 旋轉黑洞全息超糾纏引力透鏡天線 (Holographic Hyper-Entangled Lens Antenna)' },
      { combo: 'HUD ❄️', desc: '開啟 高階非阿貝爾分形時間晶體反應堆 (Higher-Order Fractal Time Crystal)' },
      { combo: 'HUD 🌊', desc: '開啟 分數量子霍爾條紋相與向列液晶反應堆 (Fractional Quantum Hall Stripe & Nematic LC)' },
      { combo: 'HUD 🕸️', desc: '開啟 手性外爾半金屬拓撲超導二極體網絡 (Weyl Superconducting Diode Network)' },
      { combo: 'HUD 🕳️', desc: '開啟 微觀黑洞全息引力子隱形傳態天線 (Micro-Black Hole Holographic Teleportation)' },
      { combo: 'HUD 💎', desc: '開啟 自旋軌道耦合分形外爾時間晶體 (SOC Fractal Weyl Time Crystal)' },
      { combo: 'HUD 🌀', desc: '開啟 非厄米阿貝爾-希格斯弦拓撲渦旋網絡 (Non-Hermitian Higgs Strings)' },
      { combo: 'HUD 🧪', desc: '開啟 動態自旋極化子玻色凝聚膠體 (Dynamical Spin-Polaron Bose Gel)' },
      { combo: 'HUD 🌌', desc: '開啟 全息引力波奇異偏振探測天線 (Holographic GW Exotic Antenna)' },
      { combo: 'HUD 🧊', desc: '開啟 四維拓撲絕緣體二階陳數超幾何晶體 (4D Topological Hyper-Crystal)' },
      { combo: 'HUD ❄️', desc: '開啟 非阿貝爾分形高階拓撲超導體 (Non-Abelian Fractal HOTSC)' },
      { combo: 'HUD 🌪️', desc: '開啟 動態外爾手性引力異常流體 (Weyl Chiral Anomaly Fluid)' },
      { combo: 'HUD ✨', desc: '開啟 量子極化拓撲光子晶格 (Polariton Kagome Lattice)' },
      { combo: 'HUD 💥', desc: '開啟 旋量超流全息奇異孤子碰撞反應堆 (Spinor Soliton Collider)' },
      { combo: 'HUD 🪢', desc: '開啟 超導拓撲磁通子扭結結晶器 (Superconducting Fluxon Knot Crystallizer)' },
      { combo: 'HUD ♾️', desc: '開啟 拓撲非阿貝爾自旋梅比烏斯條共振腔 (Spin-Möbius Resonator)' },
      { combo: 'HUD 🌌', desc: '開啟 全息卡西米爾暗能量蟲洞引擎 (Casimir Dark Energy Wormhole Engine)' },
      { combo: 'HUD ⚛️', desc: '開啟 超對稱量子色動力學磁單極玻色凝聚環 (SUSY Monopole BEC Ring)' },
      { combo: 'HUD 🌀', desc: '開啟 非厄米奇異環霍普夫絕緣體與高階皮膚渦旋反應器 (Non-Hermitian Hopf Skin Insulator)' },
      { combo: 'HUD 🔺', desc: '開啟 分數維度碎形量子自旋液體與任意子對偶全息干涉儀 (Fractal Quantum Spin Liquid)' },
      { combo: 'HUD 🌊', desc: '開啟 相對論性引力波磁流體阿爾文孤子共振腔 (Gravitational-Wave Alfvén Soliton)' },
      { combo: 'HUD ❄️', desc: '開啟 超流玻色-費米混合拓撲激子超固體轉子 (Bose-Fermi Exciton Supersolid Rotor)' },
      { combo: 'HUD 🎵', desc: '開啟 拓撲手性時間反演破缺外爾聲子超流體與熱霍爾渦旋晶格 (Chiral Weyl Phonon Superfluid)' },
      { combo: 'HUD 🕸️', desc: '開啟 全息楊-米爾斯張量網路與多體糾纏幾何湧現重整化流引擎 (Holographic YM Tensor Network)' },
      { combo: 'HUD 💠', desc: '開啟 非阿貝爾量子自旋軌道液體與四極矩拓撲八極子絕緣體 (Spin-Orbital Octupole Insulator)' },
      { combo: 'HUD ⚡', desc: '開啟 超強雷射等離子體尾波場吉電子伏特對撞與量子輻射反作用反應堆 (Laser Wakefield QED Collider)' },
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
