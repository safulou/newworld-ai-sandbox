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
      <button class="hud-btn rail-btn" @click="ui.openRail" title="磁浮超迴路列車 (F10)">
        🚄 磁浮 (F10)
      </button>
      <button class="hud-btn kinetics-btn" @click="ui.openKinetics" title="體素動力學與升降電梯 (Kinetics)">
        ⚙️ 機巧
      </button>
      <button class="hud-btn hydro-btn" @click="ui.openHydroponics" title="賽博水耕溫室與基因合成 (Hydroponics)">
        🧪 水耕
      </button>
      <button class="hud-btn logic-btn" @click="ui.openVisualLogic" title="全息節點式視覺邏輯編輯器 (Visual Logic)">
        ⚡ 邏輯
      </button>
      <button class="hud-btn factory-btn" @click="ui.openFactory" title="自動化工業物流調度 (Factory)">
        🏭 工業
      </button>
      <button class="hud-btn acoustics-btn" @click="ui.openAcoustics" title="真實空間聲學物理與濾波器 (Acoustics)">
        🎧 聲學
      </button>
      <button class="hud-btn holo-btn" @click="ui.openSculptor" title="微體素全息雕刻儀與投影台 (F11)">
        🔮 雕刻 (F11)
      </button>
      <button class="hud-btn parkour-btn" @click="ui.openParkour" title="定向重力異常與極限跑酷 (F12)">
        🌀 跑酷 (F12)
      </button>
      <button class="hud-btn observatory-btn" @click="ui.openObservatory" title="全息星空天文台 (Observatory)">
        🔭 天文
      </button>
      <button class="hud-btn reactor-btn" @click="ui.openReactor" title="等離子核聚變反應堆 (Reactor)">
        ☢️ 聚變
      </button>
      <button class="hud-btn leaderboard-btn" @click="ui.openLeaderboard" title="幽靈競速電競天梯榜 (Leaderboard)">
        🏆 天梯
      </button>
      <button class="hud-btn rangers-btn" @click="ui.openRangers" title="AI 生態巡護與機械獸繁育 (Rangers)">
        🐾 巡護
      </button>
      <button class="hud-btn drydock-btn" @click="ui.openDrydock" title="軌道空間站與模組化星艦造船塢 (Drydock)">
        🚀 船塢
      </button>
      <button class="hud-btn abyssal-btn" @click="ui.openAbyssal" title="深海深淵海溝與電漿深潛艇 (Abyssal)">
        🌊 深潛
      </button>
      <button class="hud-btn bt-btn" @click="ui.openBehaviorTree" title="全息 AI 神經行為樹編輯器 (Behavior Tree)">
        🧠 腦圖
      </button>
      <button class="hud-btn cyberdeck-btn" @click="ui.openCyberdeck" title="賽博甲板終端與網絡入侵協定 (Cyberdeck)">
        💻 甲板
      </button>
      <button class="hud-btn hyperjump-btn" @click="ui.openHyperjump" title="星艦超空間曲率躍遷驅動 (Hyperjump)">
        🌌 躍遷
      </button>
      <button class="hud-btn netwar-btn" @click="ui.openNetrunnerWarfare" title="賽博黑客領地防衛與網絡潛入 (Netrunner Warfare)">
        🛡️ 攻防
      </button>
      <button class="hud-btn leviathan-btn" @click="ui.openLeviathan" title="深海深淵機械利維坦 Boss 討伐戰 (Leviathan)">
        🐉 巨獸
      </button>
      <button class="hud-btn supergrid-btn" @click="ui.openSupergrid" title="全服多基地超導電網同調與能源交易 (Supergrid)">
        ⚡ 電網
      </button>
      <button class="hud-btn ark-btn" @click="ui.openColonyArk" title="星際殖民地母艦生態圈 (Colony Ark)">
        🛸 母艦
      </button>
      <button class="hud-btn syndicate-btn" @click="ui.openSyndicate" title="賽博公會聯盟領地戰 (Syndicate)">
        🏴‍☠️ 公會
      </button>
      <button class="hud-btn exosuit-btn" @click="ui.openExosuit" title="利維坦生物機械外骨骼裝配鍛造 (Exosuit)">
        🦾 機甲
      </button>
      <button class="hud-btn beacon-btn" @click="ui.openStellarBeacon" title="全息星圖量子跨次元躍遷信標 (Stellar Beacon)">
        📡 信標
      </button>
      <button class="hud-btn fleet-btn" @click="ui.openArkExpedition" title="多母艦軌道編隊與深空遠征艦隊 (Fleet Expeditions)">
        🚀 艦隊
      </button>
      <button class="hud-btn flagship-btn" @click="ui.openFlagshipRaid" title="公會空天旗艦突襲戰 (Flagship Raids)">
        💥 突襲
      </button>
      <button class="hud-btn rift-btn" @click="ui.openDarkMatterRift" title="量子暗物質時空裂隙探索 (Dark Matter Rifts)">
        🕳️ 裂隙
      </button>
      <button class="hud-btn dyson-btn" @click="ui.openDysonSphere" title="遠古戴森球環形世界宏工程 (Dyson Sphere)">
        ☀️ 戴森
      </button>
      <button class="hud-btn slingshot-btn" @click="ui.openWormholeSlingshot" title="跨星系蟲洞引力彈弓軌道網絡 (Wormhole Slingshot)">
        🪐 彈弓
      </button>
      <button class="hud-btn titan-btn" @click="ui.openWorldTitan" title="全服世界首領宇宙泰坦浩劫 (World Titan Invasion)">
        👑 泰坦
      </button>
      <button class="hud-btn mind-btn" @click="ui.openNeuralMind" title="量子神經意識克隆與移魂網絡 (Neural Mind Transfer)">
        🧬 移魂
      </button>
      <button class="hud-btn broadcast-btn" @click="ui.openQuantumBroadcast" title="超空間量子通訊廣播與星網 (Quantum BBS)">
        📻 廣播
      </button>
      <button class="hud-btn singularity-btn" @click="ui.openSingularity" title="黑洞視界能層與奇點萃取站 (Singularity Extractor)">
        🕳️ 奇點
      </button>
      <button class="hud-btn stargate-btn" @click="ui.openStargate" title="超空間星門躍遷航道與引力樞紐 (Stargate Network)">
        🌀 星門
      </button>
      <button class="hud-btn council-btn" @click="ui.openCouncil" title="星際外交聯盟與銀河議會 (Galactic Council)">
        🏛️ 議會
      </button>
      <button class="hud-btn genome-btn" @click="ui.openGenomeForge" title="異星基因工坊與生物誘變培育 (Genome Forge)">
        🧪 基因
      </button>
      <button class="hud-btn kardashev-btn" @click="ui.openKardashev" title="卡爾達肖夫文明等級評定與奇點超越儀 (Kardashev Metric)">
        🌌 文明
      </button>
      <button class="hud-btn dyson-swarm-btn" @click="ui.openDysonSwarm" title="戴森雲反射群集拓撲網絡 (Dyson Swarm)">
        🛰️ 戴森雲
      </button>
      <button class="hud-btn planetary-core-btn" @click="ui.openPlanetaryCore" title="全球地熱超深鑽井與行星地核引擎 (Planetary Core)">
        🌋 地核
      </button>
      <button class="hud-btn chrono-btn" @click="ui.openChrono" title="時間因果律校準儀與微型時空閉環 (Chrono Stabilizer)">
        ⏳ 因果
      </button>
      <button class="hud-btn multiverse-btn" @click="ui.openMultiverse" title="平行宇宙泡泡世界拓撲觀測儀 (Multiverse Bubble)">
        🫧 泡泡
      </button>
      <button class="hud-btn ringworld-btn" @click="ui.openRingworld" title="星際巨構環形世界建造船塢 (Ringworld Fabricator)">
        🪐 環形
      </button>
      <button class="hud-btn genesis-oracle-btn" @click="ui.openGenesisOracle" title="量子宏觀創世神諭樹與宇宙常數微調 (Genesis Oracle)">
        📜 創世
      </button>
      <button class="hud-btn string-fold-btn" @click="ui.openStringFold" title="超弦維度空間折疊傳輸矩陣 (String Fold Matrix)">
        🎻 超弦
      </button>
      <button class="hud-btn vacuum-ward-btn" @click="ui.openVacuumWard" title="暗能量真空衰變抵禦力場 (Vacuum Decay Ward)">
        🛡️ 真空
      </button>
      <button class="hud-btn pbh-nebula-btn" @click="ui.openPrimordialNebula" title="太初原初黑洞星雲發電機 (Primordial Black Hole)">
        🕳️ 太初
      </button>
      <button class="hud-btn starchart-btn" @click="ui.openStarchart" title="量子糾纏全息星圖沙盤 (Quantum Holo-Starchart)">
        🗺️ 星圖
      </button>
      <button class="hud-btn tachyonic-btn" @click="ui.openTachyonic" title="超光速因果律超弦通訊網 (Tachyonic Causality Mesh)">
        ⚡ 快子
      </button>
      <button class="hud-btn neutrino-btn" @click="ui.openNeutrinoDetector" title="中微子超流體暗物質探測陣列 (Neutrino Detector)">
        ❄️ 中微子
      </button>
      <button class="hud-btn quark-plasma-btn" @click="ui.openQuarkPlasma" title="夸克膠子等離子體原始重子重組爐 (Quark Plasma Forge)">
        🔥 夸克
      </button>
      <button class="hud-btn spinfoam-btn" @click="ui.openSpinfoam" title="時空量子幾何自旋泡沫網絡 (Spinfoam Lattice)">
        🕸️ 自旋
      </button>
      <button class="hud-btn holographic-horizon-btn" @click="ui.openHolographicHorizon" title="全息宇宙事件視界編碼矩陣 (Holographic Horizon)">
        🌐 全息
      </button>
      <button class="hud-btn wormhole-bridge-btn" @click="ui.openWormholeBridge" title="量子引力蟲洞橋與愛因斯坦-羅森橋 (Wormhole Bridge)">
        🌉 蟲洞
      </button>
      <button class="hud-btn gut-collider-btn" @click="ui.openGutCollider" title="大統一理論規範玻色子對撞核心 (GUT Collider)">
        ⚛️ 大統一
      </button>
      <button class="hud-btn topological-chern-btn" @click="ui.openTopologicalChern" title="拓撲量子幾何陳類數纖維叢 (Topological Chern)">
        🌀 拓撲
      </button>
      <button class="hud-btn cosmic-string-btn" @click="ui.openCosmicString" title="宇宙弦微波背景輻射透鏡測繪儀 (Cosmic String)">
        〰️ 宇宙弦
      </button>
      <button class="hud-btn antimatter-btn" @click="ui.openAntimatterPropulsion" title="反物質暗能量湮滅推進矩陣 (Antimatter Propulsion)">
        🚀 反物質
      </button>
      <button class="hud-btn axion-btn" @click="ui.openAxionHaloscope" title="軸子暗物質暈微波共振腔 (Axion Haloscope)">
        🧲 軸子腔
      </button>
      <button class="hud-btn radar-btn" @click="ui.openTimeReversalRadar" title="量子糾纏時間鏡像拓撲雷達 (Time-Reversal Radar)">
        ⏰ 鏡像雷達
      </button>
      <button class="hud-btn string-net-btn" @click="ui.openStringNet" title="全息共形場宇宙弦網冷凝 (String-Net Condensate)">
        🕸️ 弦網
      </button>
      <button class="hud-btn sugra-btn" @click="ui.openSupergravitySpinor" title="旋量網絡超引力旋轉推進 (Supergravity Spinor)">
        🌀 超引力
      </button>
      <button class="hud-btn ccc-btn" @click="ui.openPenroseCCC" title="潘洛斯宇宙循環相干引力波測量儀 (Penrose CCC Detector)">
        ⏳ 潘洛斯
      </button>
      <button class="hud-btn qah-btn" @click="ui.openQuantumAnomalousHall" title="量子霍爾反常邊緣態超流體晶片 (QAH Superfluid Microchip)">
        💻 量子晶片
      </button>
      <button class="hud-btn dark-fermi-btn" @click="ui.openFermionicDarkMatter" title="費米子暗物質費米面量子壓縮透鏡 (Fermionic Dark Matter)">
        🔭 費米暗暈
      </button>
      <button class="hud-btn rainbow-btn" @click="ui.openRainbowGraviton" title="宇宙弦重力子彩虹度規探測網 (Rainbow Graviton Mesh)">
        🌈 彩虹度規
      </button>
      <button class="hud-btn acoustic-btn" @click="ui.openAcousticBlackHole" title="超流真空聲學事件視界發電機 (Acoustic Black Hole)">
        🔊 聲學黑洞
      </button>
      <button class="hud-btn scar-btn" @click="ui.openScarredTimeCrystal" title="量子多體疤痕時間晶體調諧器 (Scarred Time Crystal)">
        ⌛ 疤痕晶體
      </button>
      <button class="hud-btn corner-btn" @click="ui.openCornerState" title="拓撲超導高階角態量子中繼陣列 (Corner State Relay)">
        📐 角態超導
      </button>
      <button class="hud-btn casimir-btn" @click="ui.openCasimirTorque" title="拓撲缺陷卡西米爾真空扭矩馬達 (Casimir Vacuum Torque Motor)">
        ⚙️ 扭矩馬達
      </button>
      <button class="hud-btn anyon-btn" @click="ui.openAnyonHolographic" title="非阿貝爾任意子全息量子糾錯編碼室 (Anyon Holographic Code)">
        🔮 全息任意子
      </button>
      <button class="hud-btn teleport-btn" @click="ui.openRelativisticTeleport" title="相對論性量子資訊穿梭超流波導 (Relativistic Teleportation)">
        💫 量子傳態
      </button>
      <button class="hud-btn planck-cavity-btn" @click="ui.openPlanckVacuum" title="極限普朗克常數真空相變臨界諧振腔 (Planck Vacuum Cavity)">
        ⚡ 普朗克腔
      </button>
      <button class="hud-btn supersolid-btn" @click="ui.openTopologicalSupersolid" title="拓撲超固體量子渦旋流動反應堆 (Topological Supersolid)">
        ❄️ 拓撲超固
      </button>
      <button class="hud-btn primordial-gw-btn" @click="ui.openPrimordialGW" title="太初原初引力波隨機背景干涉儀 (Primordial SGWB)">
        🌌 原初引力
      </button>
      <button class="hud-btn aharonov-bohm-btn" @click="ui.openAharonovBohm" title="阿哈羅諾夫-玻姆幾何相位超導環陣列 (Aharonov-Bohm Ring)">
        🧲 AB 超導環
      </button>
      <button class="hud-btn weyl-chiral-btn" @click="ui.openWeylChiral" title="超對稱外爾費米子手性反常能源核 (Weyl Chiral Anomaly)">
        ⚛️ 外爾反常
      </button>
      <button class="hud-btn exciton-polariton-btn" @click="ui.openExcitonPolariton" title="拓撲激子極化激元量子流體反應堆 (Exciton-Polariton)">
        ✨ 極化凝聚
      </button>
      <button class="hud-btn floquet-dtc-btn" @click="ui.openFloquetTimeCrystal" title="非平衡態 Floquet 預熱拓撲時間晶體 (Floquet Time Crystal)">
        ⏳ Floquet晶體
      </button>
      <button class="hud-btn hawking-unruh-btn" @click="ui.openHawkingUnruh" title="霍金-安魯效應全息引力對偶量子微波探測器 (Hawking-Unruh)">
        🌌 霍金安魯
      </button>
      <button class="hud-btn aharonov-casher-btn" @click="ui.openAharonovCasher" title="阿哈羅諾夫-卡舍爾中性費米子自旋拓撲干涉儀 (Aharonov-Casher)">
        🧲 AC 自旋環
      </button>
      <button class="hud-btn spinor-skyrmion-btn" @click="ui.openSpinorSkyrmion" title="旋量玻色-愛因斯坦凝聚斯格明子拓撲天體反應堆 (Spinor Skyrmion)">
        🌀 斯格明子
      </button>
      <button class="hud-btn exceptional-point-btn" @click="ui.openExceptionalPoint" title="非厄米拓撲奇異點雷射放大器 (Exceptional Point Laser)">
        🎯 奇異點激光
      </button>
      <button class="hud-btn majorana-braiding-btn" @click="ui.openMajoranaBraiding" title="拓撲馬約拉納零能模非阿貝爾量子編織晶片 (Majorana Braiding)">
        ⚛️ 馬約拉納
      </button>
      <button class="hud-btn kaluza-klein-btn" @click="ui.openKaluzaKlein" title="卡魯扎-克萊因高維引力微型黑洞探針 (Kaluza-Klein Micro Black Hole)">
        🕳️ KK 微黑洞
      </button>
      <button class="hud-btn moire-flatband-btn" @click="ui.openMoireFlatBand" title="拓撲莫爾超晶格平帶非常規超導反應堆 (Moiré Flat-Band Superconductor)">
        🌀 莫爾超導
      </button>
      <button class="hud-btn gw-memory-btn" @click="ui.openGWMemory" title="時空引力波記憶效應天線矩陣 (GW Memory Array)">
        🌌 引力記憶
      </button>
      <button class="hud-btn antiferro-magnon-btn" @click="ui.openAntiferroMagnon" title="反鐵磁拓撲磁振子狄拉克半金屬波導 (Antiferromagnetic Magnon)">
        🧲 反鐵磁磁振子
      </button>
      <button class="hud-btn holographic-wormhole-btn" @click="ui.openHolographicWormhole" title="全息蟲洞量子隱形傳態對偶反應爐 (Holographic Traversable Wormhole)">
        🕳️ 全息蟲洞
      </button>
      <button class="hud-btn chiral-pump-btn" @click="ui.openChiralPump" title="拓撲手性反常弗蘭肯斯坦量子泵浦反應堆 (Chiral Anomaly Quantum Pump)">
        ⚛️ 外爾泵浦
      </button>
      <button class="hud-btn gw-spin-memory-btn" @click="ui.openGWSpinMemory" title="引力波自旋記憶與天球角動量流干涉網 (GW Spin Memory Array)">
        🌀 自旋記憶
      </button>
      <button class="hud-btn hinge-majorana-btn" @click="ui.openHingeMajorana" title="三維二階拓撲超導馬約拉納手性鉸鏈態晶片 (HOTSC Hinge Majorana Chip)">
        📐 鉸鏈超導
      </button>
      <button class="hud-btn quantum-island-btn" @click="ui.openQuantumIsland" title="AdS/BCFT 邊界量子島黑洞資訊恢復反應堆 (AdS/BCFT Quantum Island)">
        🏝️ 量子島
      </button>
      <button class="hud-btn spin-liquid-btn" @click="ui.openSpinLiquid" title="拓撲分數量子自旋液體與基塔耶夫蜂巢晶格反應堆 (Fractional Quantum Spin Liquid)">
        🌀 自旋液體
      </button>
      <button class="hud-btn kerr-shadow-btn" @click="ui.openKerrShadow" title="克爾黑洞極端光子球與事件視界全息陰影重構陣列 (Kerr Photon Shadow Array)">
        🕳️ 光子陰影
      </button>
      <button class="hud-btn repulsive-casimir-btn" @click="ui.openRepulsiveCasimir" title="手性超材料動態拓撲卡西米爾斥力發電機 (Repulsive Casimir Motor)">
        ⚙️ 斥力馬達
      </button>
      <button class="hud-btn multi-wormhole-btn" @click="ui.openMultiWormhole" title="AdS/dS 雙曲多端可穿越蟲洞多體糾纏網絡 (Multi-Boundary Wormhole Network)">
        🌌 多端蟲洞
      </button>
      <button class="hud-btn fqah-btn" @click="ui.openFractionalHall" title="量子反常分數霍爾反應堆 (Fractional Quantum Anomalous Hall)">
        ⚛️ 分數霍爾
      </button>
      <button class="hud-btn thz-josephson-btn" @click="ui.openThzJosephson" title="太赫茲約瑟夫森量子混頻器 (THz Josephson Quantum Mixer)">
        📻 約瑟夫森
      </button>
      <button class="hud-btn axion-insulator-btn" @click="ui.openAxionInsulator" title="動態拓撲磁電效應軸子絕緣體諧振腔 (Axion Insulator Resonator)">
        🧲 軸子絕緣
      </button>
      <button class="hud-btn holo-complexity-btn" @click="ui.openHoloComplexity" title="全息複雜度作用量引擎 (Holographic Complexity Engine)">
        🌌 全息複雜
      </button>
      <button class="hud-btn chiral-superfluid-btn" @click="ui.openChiralSuperfluid" title="拓撲手性超流體 p_x + i p_y 反應堆 (Chiral Superfluid Reactor)">
        🌊 手性超流
      </button>
      <button class="hud-btn quantum-spin-hall-btn" @click="ui.openQuantumSpinHall" title="量子自旋霍爾效應螺旋晶片 (Quantum Spin Hall Chip)">
        🛡️ 自旋霍爾
      </button>
      <button class="hud-btn kerr-comb-btn" @click="ui.openKerrComb" title="巨克爾量子孤子光頻梳發電機 (Kerr Soliton Comb)">
        🌈 克爾頻梳
      </button>
      <button class="hud-btn holo-weyl-fluid-btn" @click="ui.openHoloWeylFluid" title="全息外爾量子臨界流體引擎 (Holographic Weyl Fluid Engine)">
        🌪️ 全息外爾
      </button>
      <button class="hud-btn modular-vacuum-btn" @click="ui.openModularVacuum" title="富田-竹崎模態流與量子糾纏真空引擎 (Modular Vacuum Engine)">
        ⚛️ 模態真空
      </button>
      <button class="hud-btn multichannel-kondo-btn" @click="ui.openMultiChannelKondo" title="多通道近藤效應與非費米液體奇異金屬反應堆 (Multi-Channel Kondo Reactor)">
        🌀 近藤金屬
      </button>
      <button class="hud-btn birefringent-lens-btn" @click="ui.openBirefringentLens" title="雙折射引力透鏡與偏振旋角幾何相光子干涉儀 (Birefringent Grav Lens)">
        🔭 雙折透鏡
      </button>
      <button class="hud-btn holo-microstate-btn" @click="ui.openHoloMicrostate" title="AdS/CFT 蟲洞微觀態與哈密頓量截斷弦網張量重構機 (Holo Microstate Mesh)">
        🔮 絨毛全息
      </button>
      <button class="hud-btn fibonacci-anyon-btn" @click="ui.openFibonacciAnyon" title="菲波那契金鍵任意子編織處理器 (Fibonacci Anyon Processor)">
        🧬 金鍵編織
      </button>
      <button class="hud-btn celestial-bms-btn" @click="ui.openCelestialBms" title="引力波天球全息與 BMS 漸近天線 (Celestial Holo BMS)">
        🌌 天球全息
      </button>
      <button class="hud-btn floquet-andreev-btn" @click="ui.openFloquetAndreev" title="弗洛凱拓撲超導與安德烈夫量子引擎 (Floquet Andreev Engine)">
        ⚡ 弗洛凱超導
      </button>
      <button class="hud-btn quantum-metric-btn" @click="ui.openQuantumMetric" title="莫爾平帶量子度規幾何超流反應堆 (Quantum Metric Superfluid)">
        🌀 幾何度規
      </button>
      <button class="hud-btn twisted-polariton-btn" @click="ui.openTwistedPolariton" title="扭轉多層光子晶體拓撲平帶極化激元 (Twisted Polariton Flat-Band)">
        🌈 極化激元
      </button>
      <button class="hud-btn wigner-crystal-btn" @click="ui.openWignerCrystal" title="高階維格納晶體量子熔化與向列量子液晶 (Wigner Crystal & Nematic Liquid)">
        ❄️ 維格納晶體
      </button>
      <button class="hud-btn desitter-holo-btn" @click="ui.openDeSitterHolo" title="德西特宇宙全息對偶與靜態膜極端熵 (de Sitter Static Patch Holography)">
        🌌 德西特全息
      </button>
      <button class="hud-btn chiral-phonon-btn" @click="ui.openChiralPhonon" title="拓撲手性聲子與量子反常聲霍爾效應 (Chiral Phonon & Acoustic Hall)">
        🔊 手性聲子
      </button>
      <button class="hud-btn axion-cherenkov-btn" @click="ui.openAxionCherenkov" title="軸子弦星系激波與超光速引力切倫科夫輻射天線 (Axion Gravitational Cherenkov)">
        ⚡ 軸子切倫
      </button>
      <button class="hud-btn four-d-hall-btn" @click="ui.openFourDQuantumHall" title="拓撲四維量子霍爾效應與第二陳數合成維度反應堆 (4D Quantum Hall Effect)">
        🌐 四維霍爾
      </button>
      <button class="hud-btn parafermion-btn" @click="ui.openParafermion" title="非阿貝爾分數量子霍爾帕拉費米子與拓撲四重量子位元處理器 (Parafermion Processor)">
        🧬 帕拉費米
      </button>
      <button class="hud-btn calabi-yau-btn" @click="ui.openCalabiYauModuli" title="超弦緊緻化卡拉比-丘流形模場穩定性與宇宙暴脹發電機 (Calabi-Yau Moduli Engine)">
        🪐 卡拉比丘
      </button>
      <button class="hud-btn hawking-page-btn" @click="ui.openHawkingPageAdS" title="霍金-佩奇黑洞相變與全息引力凝聚 (Hawking-Page AdS Transition)">
        🕳️ 霍金佩奇
      </button>
      <button class="hud-btn axion-witten-btn" @click="ui.openAxionTIWitten" title="三維拓撲絕緣體軸子電動力學與維騰效應 (Axion TI & Witten Effect)">
        🧲 維騰效應
      </button>
      <button class="hud-btn parisi-spin-btn" @click="ui.openParisiSpinGlass" title="量子自旋玻璃帕里西極值破缺與超度規 (Parisi Spin Glass & Ultrametricity)">
        🌲 帕里西樹
      </button>
      <button class="hud-btn cosmic-vortex-btn" @click="ui.openNonAbelianVortex" title="非阿貝爾宇宙渦旋弦與暴脹發電機 (Non-Abelian Cosmic Vortex)">
        🌀 宇宙渦旋
      </button>
      <button class="hud-btn aa-phase-btn" @click="ui.openAAGeometricPhase" title="阿哈羅諾夫-安丹幾何相位與非阿貝爾拓撲泵浦 (Aharonov-Anandan Phase)">
        📐 AA幾何相
      </button>
      <button class="hud-btn gem-drag-btn" @click="ui.openGravitoElectromagnetism" title="引力電磁學與蘭斯-蒂靈時空拖曳 (Gravito-Electromagnetism & Lense-Thirring)">
        🧭 引力磁性
      </button>
      <button class="hud-btn weyl-fermi-btn" @click="ui.openWeylFermiArc" title="外爾半金屬費米弧與手性磁效應 (Weyl Fermi Arc & CME)">
        ⚡ 費米弧
      </button>
      <button class="hud-btn dbrane-dbi-btn" @click="ui.openDBraneDBI" title="超弦 D-膜重聯與 DBI 非線性真空反應堆 (D-Brane & DBI Vacuum)">
        🛡️ D膜重聯
      </button>
      <button class="hud-btn kondo-tki-btn" @click="ui.openTopologicalKondo" title="拓撲近藤絕緣體與表面狄拉克錐 (Topological Kondo Insulator)">
        ⚛️ 近藤絕緣
      </button>
      <button class="hud-btn magnetar-qed-btn" @click="ui.openMagnetarQED" title="中子星磁星 QED 真空雙折射與星震 (Magnetar QED & Starquake)">
        🧲 磁星雙折
      </button>
      <button class="hud-btn holo-sc-btn" @click="ui.openHolographicSuperconductor" title="全息超導與荷電黑洞 AdS-RN 純量凝聚 (Holographic Superconductor)">
        🌌 全息超導
      </button>
      <button class="hud-btn instanton-ym-btn" @click="ui.openInstantonVacuum" title="瞬子真空隧道效應與楊-米爾斯 θ-真空 (Yang-Mills Instanton Vacuum)">
        🌀 瞬子真空
      </button>
      <button class="hud-btn schwinger-vacuum-btn" @click="ui.openSchwingerVacuum" title="舒溫格效應與強場 QED 真空衰變 (Schwinger Vacuum Breakdown)">
        ⚡ 舒溫格
      </button>
      <button class="hud-btn superradiance-bh-btn" @click="ui.openBlackHoleSuperradiance" title="旋轉黑洞超輻射不穩定性與軸子玻色子雲 (Black Hole Superradiance & Axion)">
        🌀 超輻射
      </button>
      <button class="hud-btn strange-metal-btn" @click="ui.openStrangeMetalSYK" title="奇異金屬普朗克極限耗散與 SYK 模型 (Strange Metal & SYK Chaos)">
        🔥 奇異金屬
      </button>
      <button class="hud-btn helical-edge-btn" @click="ui.openQuantumSpinHallSoliton" title="拓撲量子自旋霍爾螺旋邊緣態與分數孤子 (Quantum Spin Hall & Fractional Soliton)">
        🛡️ 螺旋邊緣
      </button>
      <button class="hud-btn casimir-dce-btn" @click="ui.openDynamicalCasimir" title="動力學卡西米爾效應與加速運動反射鏡 (Dynamical Casimir Effect)">
        ⚡ 卡西米爾
      </button>
      <button class="hud-btn hall-viscosity-btn" @click="ui.openHallViscosity" title="量子霍爾黏度與非耗散奇性剪切應力 (Hall Viscosity & Read-Rezayi)">
        🌊 霍爾黏度
      </button>
      <button class="hud-btn chiral-anomaly-btn" @click="ui.openGravitationalAnomaly" title="外爾費米子混合引力-手性反常與熱電輸運 (Gravitational Chiral Anomaly)">
        🌌 引力反常
      </button>
      <button class="hud-btn matbg-graphene-btn" @click="ui.openMagicAngleGraphene" title="魔角扭轉雙層石墨烯平帶與非常規超導 (Magic-Angle Twisted Graphene)">
        ⚛️ 魔角平帶
      </button>
      <button class="hud-btn superfluid-he3-btn" @click="ui.openSuperfluidHelium3" title="超流氦-3 拓撲 B 相與馬約拉納費米表面 (Superfluid Helium-3 B Phase)">
        🧪 氦-3超流
      </button>
      <button class="hud-btn chiral-majorana-btn" @click="ui.openChiralMajorana" title="量子反常霍爾手性馬約拉納天使粒子 (Chiral Majorana Fermion Modes)">
        👼 天使粒子
      </button>
      <button class="hud-btn bh-echoes-btn" @click="ui.openBlackHoleEchoes" title="黑洞量子視界引力波迴聲諧振腔 (Black Hole Quantum Echoes)">
        🪐 視界迴聲
      </button>
      <button class="hud-btn composite-fermion-btn" @click="ui.openCompositeFermion" title="幾何複合費米子與 HLR 偶分母費米面 (Composite Fermion Liquid)">
        ⚛️ 複合費米
      </button>
      <button class="hud-btn disorder-anderson-btn" @click="ui.openDisorderAnderson" title="拓撲超流安德森局域化與 Thouless 逆參與率 (Disorder Anderson Superfluid)">
        🌪️ 安德森超流
      </button>
      <button class="hud-btn rotating-bec-btn" @click="ui.openRotatingBec" title="旋轉玻色-愛因斯坦凝聚阿布里科索夫渦旋晶格 (Rotating BEC Abrikosov Lattice)">
        🌀 旋轉凝聚
      </button>
      <button class="hud-btn surface-code-btn" @click="ui.openSurfaceCode" title="表面碼拓撲量子記憶體與 MWPM 糾錯 (Surface Code Quantum Memory)">
        🧩 表面碼
      </button>
      <button class="hud-btn holo-negativity-btn" @click="ui.openHolographicNegativity" title="AdS3/CFT2 全息對偶糾纏負度與共形反常 (Holographic Entanglement Negativity)">
        🌌 糾纏負度
      </button>
      <button class="hud-btn dirac-klein-btn" @click="ui.openDiracKlein" title="狄拉克克萊因穿隧與 Veselago 負折射透鏡 (Dirac Klein Tunneling & Lens)">
        🎯 克萊因穿隧
      </button>
      <button class="hud-btn soc-bec-btn" @click="ui.openSpinOrbitBec" title="自旋-軌道耦合玻色凝聚條紋超固相 (Spin-Orbit Coupled BEC & Stripe Phase)">
        🌈 條紋超固
      </button>
      <button class="hud-btn axion-polariton-btn" @click="ui.openAxionPolariton" title="磁性外爾半金屬軸子極化子與反鐵磁共振 (Magnetic Weyl Axion Polariton)">
        🧲 軸子極化
      </button>
      <button class="hud-btn page-island-btn" @click="ui.openPageIsland" title="全息佩奇曲線與量子極值島嶼 (Holographic Page Island & QES)">
        🏝️ 佩奇島嶼
      </button>
      <button class="hud-btn chern-mote2-btn" @click="ui.openFractionalChern" title="莫爾平帶分數陳絕緣體與非阿貝爾任意子編織 (Fractional Chern MoTe2)">
        🌀 分數陳
      </button>
      <button class="hud-btn floquet-lzsm-btn" @click="ui.openFloquetLzsm" title="弗洛凱-斯圖克伯格量子位元干涉與 CDT 穿隧相消 (Floquet-LZSM Interferometry)">
        ⚡ LZSM干涉
      </button>
      <button class="hud-btn kerr-newman-btn" @click="ui.openKerrNewman" title="克爾-紐曼黑洞能層發電機與 BZ 極區噴流 (Kerr-Newman Ergosphere & Jet)">
        🪐 能層噴流
      </button>
      <button class="hud-btn holo-c-theorem-btn" @click="ui.openHoloCTheorem" title="全息重整化群流與不可逆 c-定理 (Holographic c-Theorem RG Flow)">
        🌌 c-定理
      </button>
      <button class="hud-btn vortex-hall-btn" @click="ui.openVortexHall" title="量子渦旋霍爾效應與雙重超流反應堆 (Quantum Vortex Hall Superfluid)">
        🌀 渦旋霍爾
      </button>
      <button class="hud-btn floquet-crystal-btn" @click="ui.openFloquetMajoranaTimeCrystal" title="弗洛凱-馬約拉納時間晶體與週期倍增 (Floquet Majorana Time Crystal)">
        ⚡ 時間晶體
      </button>
      <button class="hud-btn tachyonic-rec-btn" @click="ui.openTachyonicReconnection" title="超弦重聯與快子喉管躍遷反應堆 (Tachyonic Cosmic String Reconnection)">
        🪐 快子重聯
      </button>
      <button class="hud-btn holo-chaos-btn" @click="ui.openHoloChaos" title="全息量子混亂與極大李雅普諾夫熱化反應堆 (Holographic Chaos & MSS Bound)">
        🌌 全息混亂
      </button>
      <button class="hud-btn exciton-bec-btn" @click="ui.openMoireExcitonBec" title="莫爾拓撲激子絕緣體與對流超流反應堆 (Moiré Excitonic Insulator & Counterflow BEC)">
        ❄️ 激子絕緣
      </button>
      <button class="hud-btn spin-superfluid-btn" @click="ui.openNonAbelianSpinSuperfluid" title="非阿貝爾自旋超流與外爾扭折反應堆 (Non-Abelian Spin Superfluid & Weyl Kink)">
        🌀 自旋超流
      </button>
      <button class="hud-btn inflation-holo-btn" @click="ui.openPlanckianInflationHolo" title="普朗克引力暴脹與全息對偶天線 (Planckian Inflation & Holographic Antenna)">
        📡 暴脹天線
      </button>
      <button class="hud-btn topo-laser-btn" @click="ui.openTopologicalLaser" title="拓撲非互易光子晶體奇異點雷射發電機 (Topological Non-Reciprocal Laser)">
        🎯 拓撲雷射
      </button>
      <button class="hud-btn fqsh-spin-btn" @click="ui.openFractionalQshSpinLiquid" title="莫爾分數量子自旋霍爾與雙重自旋液體反應堆 (Fractional QSH & Dual Spin Liquid)">
        ⚛️ 分數自旋
      </button>
      <button class="hud-btn majorana-diode-btn" @click="ui.openMajoranaJosephsonDiode" title="拓撲馬約拉納零模約瑟夫森二極體 (Majorana Josephson Diode)">
        ⚡ 二極體結
      </button>
      <button class="hud-btn hyper-lens-btn" @click="ui.openHolographicHyperEntangledLens" title="旋轉黑洞全息超糾纏引力透鏡天線 (Hyper-Entangled Lens Antenna)">
        🔮 超糾纏鏡
      </button>
      <button class="hud-btn fractal-crystal-btn" @click="ui.openHigherOrderFractalTimeCrystal" title="高階非阿貝爾分形時間晶體反應堆 (Higher-Order Fractal Time Crystal)">
        ❄️ 分形晶體
      </button>
      <button class="hud-btn fqh-stripe-btn" @click="ui.openFractionalHallStripeLiquidCrystal" title="分數量子霍爾條紋相與向列液晶反應堆 (Fractional Quantum Hall Stripe & Nematic LC)">
        🌊 條紋液晶
      </button>
      <button class="hud-btn weyl-diode-btn" @click="ui.openWeylSuperconductingDiodeNetwork" title="手性外爾半金屬拓撲超導二極體網絡 (Weyl Superconducting Diode Network)">
        🕸️ 外爾二極
      </button>
      <button class="hud-btn hole-teleport-btn" @click="ui.openMicroBlackHoleTeleportation" title="微觀黑洞全息引力子隱形傳態天線 (Micro-Black Hole Holographic Teleportation)">
        🕳️ 蟲洞傳態
      </button>
      <button class="hud-btn soc-crystal-btn" @click="ui.openSocFractalWeylTimeCrystal" title="自旋軌道耦合分形外爾時間晶體 (SOC Fractal Weyl Time Crystal)">
        💎 四維外爾
      </button>
      <button class="hud-btn higgs-string-btn" @click="ui.openNonHermitianAbelianHiggs" title="非厄米阿貝爾-希格斯弦拓撲渦旋網絡 (Non-Hermitian Higgs Strings)">
        🌀 希格斯弦
      </button>
      <button class="hud-btn spin-gel-btn" @click="ui.openDynamicalSpinPolaronGel" title="動態自旋極化子玻色凝聚膠體 (Dynamical Spin-Polaron Bose Gel)">
        🧪 極化膠體
      </button>
      <button class="hud-btn gw-antenna-btn" @click="ui.openHolographicGravitationalWave" title="全息引力波奇異偏振探測天線 (Holographic GW Exotic Antenna)">
        🌌 奇異引力
      </button>
      <button class="hud-btn hyper-crystal-btn" @click="ui.openFourDTopologicalHyperCrystal" title="四維拓撲絕緣體二階陳數超幾何晶體 (4D Topological Hyper-Crystal)">
        🧊 四維陳晶
      </button>
      <button class="hud-btn fractal-hots-btn" @click="ui.openNonAbelianFractalHots" title="非阿貝爾分形高階拓撲超導體 (Non-Abelian Fractal HOTSC)">
        ❄️ 分形超導
      </button>
      <button class="hud-btn weyl-fluid-btn" @click="ui.openWeylChiralGravitationalFluid" title="動態外爾手性引力異常流體 (Weyl Chiral Anomaly Fluid)">
        🌪️ 外爾引力
      </button>
      <button class="hud-btn polariton-lattice-btn" @click="ui.openQuantumPolaritonLattice" title="量子極化拓撲光子晶格 (Polariton Kagome Lattice)">
        ✨ 極化籠目
      </button>
      <button class="hud-btn soliton-collider-btn" @click="ui.openSpinorSolitonCollider" title="旋量超流全息奇異孤子碰撞反應堆 (Spinor Soliton Collider)">
        💥 孤子對撞
      </button>
      <button class="hud-btn fluxon-knot-btn" @click="ui.openFluxonKnot" title="超導拓撲磁通子扭結結晶器 (Superconducting Fluxon Knot)">
        🪢 磁通結
      </button>
      <button class="hud-btn spin-mobius-btn" @click="ui.openSpinMobius" title="拓撲非阿貝爾自旋梅比烏斯條共振腔 (Spin-Möbius Resonator)">
        ♾️ 梅比烏斯
      </button>
      <button class="hud-btn casimir-wormhole-btn" @click="ui.openCasimirWormhole" title="全息卡西米爾暗能量蟲洞引擎 (Casimir Dark Energy Wormhole)">
        🌌 卡西米爾
      </button>
      <button class="hud-btn susy-monopole-btn" @click="ui.openSusyMonopole" title="超對稱量子色動力學磁單極玻色凝聚環 (SUSY Monopole BEC Ring)">
        ⚛️ 磁單極
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
  } else if (e.code === 'F10') {
    e.preventDefault()
    ui.openRail()
  } else if (e.code === 'F11') {
    e.preventDefault()
    ui.openSculptor()
  } else if (e.code === 'F12') {
    e.preventDefault()
    ui.openParkour()
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

.axion-cherenkov-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.four-d-hall-btn {
  border-color: rgba(139, 92, 246, 0.4);
  color: #a78bfa;
}
.parafermion-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.calabi-yau-btn {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}
.hawking-page-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.axion-witten-btn {
  border-color: rgba(14, 165, 233, 0.4);
  color: #38bdf8;
}
.parisi-spin-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.cosmic-vortex-btn {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fb7185;
}
.aa-phase-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.gem-drag-btn {
  border-color: rgba(14, 165, 233, 0.4);
  color: #38bdf8;
}
.weyl-fermi-btn {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}
.dbrane-dbi-btn {
  border-color: rgba(139, 92, 246, 0.4);
  color: #c084fc;
}
.kondo-tki-btn {
  border-color: rgba(0, 243, 255, 0.4);
  color: #00f3ff;
}
.magnetar-qed-btn {
  border-color: rgba(255, 77, 121, 0.4);
  color: #ff4d79;
}
.holo-sc-btn {
  border-color: rgba(0, 255, 170, 0.4);
  color: #00ffaa;
}
.instanton-ym-btn {
  border-color: rgba(187, 119, 255, 0.4);
  color: #bb77ff;
}
.schwinger-vacuum-btn {
  border-color: rgba(0, 243, 255, 0.4);
  color: #00f3ff;
}
.superradiance-bh-btn {
  border-color: rgba(192, 132, 252, 0.4);
  color: #c084fc;
}
.strange-metal-btn {
  border-color: rgba(251, 113, 133, 0.4);
  color: #fb7185;
}
.helical-edge-btn {
  border-color: rgba(245, 158, 11, 0.4);
  color: #f59e0b;
}
.casimir-dce-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.hall-viscosity-btn {
  border-color: rgba(6, 182, 212, 0.4);
  color: #06b6d4;
}
.chiral-anomaly-btn {
  border-color: rgba(192, 132, 252, 0.4);
  color: #c084fc;
}
.matbg-graphene-btn {
  border-color: rgba(52, 211, 153, 0.4);
  color: #34d399;
}
.superfluid-he3-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.chiral-majorana-btn {
  border-color: rgba(250, 204, 21, 0.4);
  color: #facc15;
}
.bh-echoes-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.composite-fermion-btn {
  border-color: rgba(6, 182, 212, 0.4);
  color: #22d3ee;
}
.disorder-anderson-btn {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fb7185;
}
.rotating-bec-btn {
  border-color: rgba(14, 165, 233, 0.4);
  color: #38bdf8;
}
.surface-code-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.holo-negativity-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.dirac-klein-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.soc-bec-btn {
  border-color: rgba(236, 72, 153, 0.4);
  color: #f472b6;
}
.axion-polariton-btn {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fb7185;
}
.page-island-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.chern-mote2-btn {
  border-color: rgba(99, 102, 241, 0.4);
  color: #818cf8;
}
.floquet-lzsm-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.kerr-newman-btn {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}
.holo-c-theorem-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.vortex-hall-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.floquet-crystal-btn {
  border-color: rgba(236, 72, 153, 0.4);
  color: #f472b6;
}
.tachyonic-rec-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.holo-chaos-btn {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fb7185;
}
.exciton-bec-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.spin-superfluid-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.inflation-holo-btn {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}
.topo-laser-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.fqsh-spin-btn {
  border-color: rgba(14, 165, 233, 0.4);
  color: #38bdf8;
}
.majorana-diode-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.hyper-lens-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.fractal-crystal-btn {
  border-color: rgba(2, 132, 199, 0.4);
  color: #7dd3fc;
}
.fqh-stripe-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.weyl-diode-btn {
  border-color: rgba(99, 102, 241, 0.4);
  color: #818cf8;
}
.hole-teleport-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.soc-crystal-btn {
  border-color: rgba(45, 212, 191, 0.4);
  color: #2dd4bf;
}
.higgs-string-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.spin-gel-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.gw-antenna-btn {
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
}
.hyper-crystal-btn {
  border-color: rgba(236, 72, 153, 0.4);
  color: #f472b6;
}
.fractal-hots-btn {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}
.weyl-fluid-btn {
  border-color: rgba(217, 70, 239, 0.4);
  color: #d946ef;
}
.polariton-lattice-btn {
  border-color: rgba(6, 182, 212, 0.4);
  color: #22d3ee;
}
.soliton-collider-btn {
  border-color: rgba(249, 115, 22, 0.4);
  color: #fb923c;
}
.fluxon-knot-btn {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}
.spin-mobius-btn {
  border-color: rgba(6, 182, 212, 0.4);
  color: #22d3ee;
}
.casimir-wormhole-btn {
  border-color: rgba(217, 70, 239, 0.4);
  color: #e879f9;
}
.susy-monopole-btn {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
</style>
