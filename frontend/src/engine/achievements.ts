import { Achievement } from '@/types/world'
import { sound } from './audio'

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Building & Architecture
  { id: 'first_block', title: '創世之初', description: '放置你的第一個方塊', icon: '🧱', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'master_builder_10', title: '小試身手', description: '累積放置 10 個方塊', icon: '🏗️', unlocked: false, progress: 0, maxProgress: 10, category: 'building' },
  { id: 'master_builder_100', title: '城市工程師', description: '累積放置 100 個方塊', icon: '🏢', unlocked: false, progress: 0, maxProgress: 100, category: 'building' },
  { id: 'master_builder_1000', title: '元宇宙建築宗師', description: '累積放置 1,000 個方塊', icon: '🏛️', unlocked: false, progress: 0, maxProgress: 1000, category: 'building' },
  { id: 'mine_first', title: '破土而出', description: '開採摧毀 1 個方塊', icon: '⛏️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'mine_100', title: '礦業大亨', description: '開採摧毀 100 個方塊', icon: '💎', unlocked: false, progress: 0, maxProgress: 100, category: 'building' },
  { id: 'undo_redo', title: '時空逆轉', description: '使用一次撤銷 (Undo) 或重做 (Redo)', icon: '↩️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'worldedit_wand', title: '空間魔導師', description: '使用 WorldEdit 魔杖完成一次選區填充', icon: '🪄', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'style_transfer', title: '賽博重鑄', description: '使用 AI 風格遷移轉換既有建築', icon: '🎨', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'deploy_blueprint', title: '一鍵奇蹟', description: '從藍圖庫中部署一座巨型結構', icon: '📜', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },

  // Exploration & Physics
  { id: 'jump_master', title: '躍遷步伐', description: '累積跳躍 50 次', icon: '👟', unlocked: false, progress: 0, maxProgress: 50, category: 'exploration' },
  { id: 'reach_sky', title: '觸碰天穹', description: '移動至高度 Y > 50', icon: '☁️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'reach_abyss', title: '深淵凝視', description: '深入高度 Y < 5 的地下底層', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'teleport_warp', title: '空間躍遷', description: '踏入量子傳送門進行一次瞬移', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'jump_pad_boost', title: '引力彈射', description: '踩上引力彈跳墊飛向高空', icon: '🚀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'photo_snap', title: '元宇宙攝影家', description: '在拍照模式中儲存一張 4K 全景快照', icon: '📷', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'view_modes', title: '多重視界', description: '切換過所有視角模式 (RTS / FPP / TPP)', icon: '👁️', unlocked: false, progress: 0, maxProgress: 3, category: 'exploration' },

  // Sci-Fi & AI
  { id: 'ai_architect_prompt', title: '神經網絡構想', description: '透過 AI 自然語言生成一座自定義建築', icon: '🤖', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'npc_companion_chat', title: '數位知己', description: '與智慧 NPC 伴侶展開一次對話', icon: '💬', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'npc_build_order', title: '架構師代工', description: '指令 NPC 架構師協助完成建造', icon: '👷', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'synth_lofi', title: '賽博調音師', description: '啟動 Lo-Fi Ambient 過程生成合成器', icon: '🎵', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'chain_explorer', title: '鏈上公證', description: '查看一次不可竄改的 SHA-256 區塊鏈記帳簿', icon: '⛓️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'tnt_blast', title: '定向爆破', description: '引爆一次高能聚合炸藥 (TNT)', icon: '💥', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'logic_circuit', title: '數位邏輯', description: '連接一條能量導線並點亮照明燈', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'spatial_voice_chat', title: '量子通訊網', description: '啟用 3D WebRTC 空間語音通話', icon: '🎙️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'laser_arena_ace', title: '賽博神射手', description: '在激光競技場中命中 5 架以上敵方戰鬥無人機', icon: '🔫', unlocked: false, progress: 0, maxProgress: 5, category: 'scifi' },
  { id: 'voxel_snake_master', title: '量子貪食蛇', description: '體素貪吃蛇長度達到 12 節以上', icon: '🐍', unlocked: false, progress: 0, maxProgress: 12, category: 'scifi' },
  { id: 'npc_voice_hearer', title: '賽博同音', description: '聆聽智慧 AI NPC 的語音朗讀對話', icon: '🗣️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'note_sequencer', title: '電子樂大師', description: '觸發一次音符方塊發聲或電路自動音序', icon: '🎹', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'hologram_architect', title: '全息造物主', description: '透過全息投影藍圖建造一座建築', icon: '🏛️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'cyber_tamer', title: '機械馴獸師', description: '馴服一隻賽博機械犬作為忠實伴隨寵物', icon: '🐾', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'dimension_voyager', title: '次元穿梭者', description: '完成一次量子次元躍遷 (前往深空浮島或晶核深淵)', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'cyber_angler', title: '等離子釣手', description: '成功垂釣獲取第一條賽博水棲生物', icon: '🎣', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'airdrop_commander', title: '空投物流官', description: '部署無人機投送一次空投補給物資', icon: '📦', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'rail_master', title: '超迴路領航員', description: '搭乘磁浮列車以超過 100km/h 速度穿梭', icon: '🚄', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'kinetic_engineer', title: '動態機巧大師', description: '成功部署一座自動化垂直升降電梯或氣密滑門', icon: '⚙️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'cyber_botanist', title: '賽博植物學家', description: '在水耕溫室中培育並收穫第一批基因發光作物', icon: '🧪', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'logic_architect', title: '可視化邏輯宗師', description: '建立並執行一條自訂節點邏輯連線規則', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'factory_tycoon', title: '工業大亨', description: '在自動化工廠中運轉傳送帶並透過光電分揀器分流物料', icon: '🏭', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'sound_sculptor', title: '空間聲學大師', description: '體驗水下低通聲學濾波或密封座艙空間音場', icon: '🎧', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'holo_artist', title: '全息雕刻家', description: '使用微體素雕刻儀創作並在世界中投射全息光束', icon: '🔮', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'gravity_defier', title: '引力掌控者', description: '啟用反重力力場或踩上動能彈射踏板完成高空滑翔', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'stargazer_astronomer', title: '星空觀測大師', description: '在全息天文台中觀測天體軌道、採集墜落星塵或發現系外行星', icon: '🔭', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'fusion_engineer', title: '聚變工程大師', description: '點火等離子聚變反應堆核心並穩定運行輸出百萬瓦功率', icon: '☢️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'ghost_racer', title: '全息競速之王', description: '錄製個人最佳跑酷遙測幽靈並在天梯榜上完成非同步競速', icon: '🏁', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'ecosystem_guardian', title: '生態圈守護者', description: '自律生態無人機巡邏育苗且元宇宙生態健康指數達到 80% 以上', icon: '🐾', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'orbital_pioneer', title: '軌道星艦先驅', description: '在軌道造船塢裝配模組化星艦並進行軌道微重力試航', icon: '🚀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'abyssal_diver', title: '深海深淵潛航員', description: '搭乘深潛艇潛入水下極限海溝並發射主動聲納探測', icon: '🌊', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'neural_architect', title: '神經架構工程師', description: '編排全息 AI 神經行為樹並將大腦成功注入實體夥伴', icon: '🧠', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'netrunner_elite', title: '矩陣賽博黑客', description: '操作賽博甲板終端成功攻破代碼矩陣防火牆節點', icon: '💻', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'hyperjump_voyager', title: '曲率躍遷拓荒者', description: '啟動星艦曲率驅動核心完成跨星系深空蟲洞躍遷', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'ice_sentinel', title: '矩陣防火牆哨兵', description: '部署高級 ICE 矩陣防衛領地子網或破解企業級核心節點', icon: '🛡️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'leviathan_slayer', title: '深海利維坦征服者', description: '搭乘深潛艇在極限深淵海溝討伐擊潰機械利維坦 Boss', icon: '🐉', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'supergrid_overlord', title: '超導電網霸主', description: '達成全服多基地超導電網同調並在能源交易所獲利', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'colony_ark_commander', title: '母艦殖民最高指揮官', description: '擴建星際殖民地母艦生態圈且居民人口突破 300 人', icon: '🛸', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'syndicate_warlord', title: '辛迪加領地霸主', description: '統率公會陣營佔領戰略據點並領取累計破 5000 點領地分紅', icon: '🏴‍☠️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'exosuit_titan', title: '泰坦機甲外骨骼工程師', description: '鍛造升級生化機械外骨骼套裝並啟動超載推進', icon: '🦾', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'quantum_cartographer', title: '量子星網測繪宗師', description: '部署量子信標並完成 5 次跨維度波函數坍縮折躍', icon: '📡', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'fleet_admiral', title: '深空遠征艦隊司令', description: '組織多母艦艦隊完成深空遠征探索任務', icon: '🚀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'flagship_corsair', title: '旗艦突襲掠奪者', description: '參與並成功攻破敵對巨企之超級空天旗艦', icon: '💥', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'rift_walker', title: '暗物質裂隙穿梭者', description: '深入暗物質時空裂隙並採集稀世時間晶石與暗物質核心', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'dyson_architect', title: '戴森球宏工程建築師', description: '參與建造遠古戴森球並完成赤道超導集能環', icon: '☀️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'slingshot_navigator', title: '引力彈弓領航大師', description: '利用恆星重力井與戴森球完成超光速引力彈弓軌道穿越', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'titan_vanquisher', title: '宇宙泰坦終結者', description: '在全服世界事件中擊退主權級巨神克洛諾斯', icon: '👑', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'mind_transcendent', title: '超驗意識克隆大師', description: '完成意識數位化上傳並解鎖全套神經技能樹', icon: '🧬', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'quantum_broadcaster', title: '星際量子通訊員', description: '透過超空間量子星網發布廣播電文並獲得全服讚譽', icon: '📻', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'singularity_harvester', title: '奇點萃取宗師', description: '操作黑洞視界能層彭羅斯萃取站達到 100,000 MW 輸出功率', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'stargate_dialer', title: '星門終端校準師', description: '完成 7 楔形鎖符文撥號並成功穿梭超空間事件視界星門', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'council_speaker', title: '銀河議會領袖', description: '在星際議會投下關鍵決策票並成功通過一項全銀河法案章程', icon: '🏛️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'genome_architect', title: '異星基因工程師', description: '在全息基因工坊中成功重組外星 DNA 並培育出合成生物伴侶', icon: '🧪', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'kardashev_ascendant', title: '卡爾達肖夫超驗者', description: '文明能階突破 Type II 恆星級或啟動奇點超越飛升', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'dyson_swarm_architect', title: '戴森雲群集領航員', description: '在恆星軌道成功部署超過 500 面微波集能反光鏡', icon: '🛰️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'core_dynamo_master', title: '行星地核地磁宗師', description: '地熱超深鑽井深入外地核熔岩層並啟動地磁發電機屏障', icon: '🌋', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'chrono_navigator', title: '時空因果校準大師', description: '成功穩定時空閉環並化解因果債務避免時空反衝', icon: '⏳', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'multiverse_traveler', title: '多元宇宙觀測者', description: '鎖定平行宇宙泡泡共振頻率並完成跨維度探測', icon: '🫧', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'ringworld_architect', title: '環形世界工程師', description: '圍繞母恆星建造 1 AU 巨大宜居環形世界並完成首期板塊', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'genesis_oracle', title: '創世法則編織者', description: '成功微調宇宙基本物理常數並啟動創世神諭法令', icon: '📜', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'string_weaver', title: '超弦維度折疊宗師', description: '操作卡拉比-丘流形達成 1:100,000 超空間弦膜折疊', icon: '🎻', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'vacuum_warden', title: '真空中流砥柱', description: '成功展開超對稱防護天幕抵禦真空衰變相變泡泡', icon: '🛡️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'pbh_harvester', title: '太初黑洞牧星者', description: '成功建立磁約束籠並捕獲太初黑洞霍金爆發輻射', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'cosmic_cartographer', title: '宇宙纖維星圖宗師', description: '全維度觀測宇宙纖維網並同步量子糾纏全息星圖', icon: '🗺️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'tachyonic_prophet', title: '超光速先知', description: '透過快子逆因果通信接收來自未來的電報並化解時序悖論', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'neutrino_whisperer', title: '中微子低語者', description: '在超流體氦稀釋制冷陣列中成功捕獲聲子閃光能量', icon: '❄️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'quark_alchemist', title: '夸克鍊金術士', description: '在兆度高溫等離子體中激發強子相變並人工合成奇異重子塊', icon: '🔥', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'spinfoam_weaver', title: '自旋泡沫編織宗師', description: '操作圈量子引力自旋網絡躍遷並激發離散時空曲率量子', icon: '🕸️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'holographic_architect', title: '全息宇宙架構師', description: '同步事件視界 AdS/CFT 共形場對偶並投影全息邊界位元', icon: '🌐', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'wormhole_navigator', title: '蟲洞引力橋領航員', description: '穩定 ER=EPR 愛因斯坦-羅森橋喉部並實現跨時空量子傳態', icon: '🌉', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'gut_grand_unifier', title: '大統一理論先驅', description: '在 10^16 GeV 激發 X/Y 規範玻色子並驗證大統一相變', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'topological_braider', title: '拓撲編織宗師', description: '調諧陳類數拓撲不變量並引導無耗散手性邊緣流', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'cosmic_string_hunter', title: '宇宙弦捕手', description: '觀測 CMB 錐形空間透鏡並捕獲宇宙弦引力波脈衝', icon: '〰️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'antimatter_admiral', title: '反物質星艦提督', description: '達到 0.99c 相對論性航速並啟動暗能量湮滅推進', icon: '🚀', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'axion_primakov_pioneer', title: '軸子普里馬科夫先驅', description: '在 12T 超導微波共振腔中捕獲暗物質軸子轉化單光子', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'timereversal_specter', title: '時間鏡像破隱幽靈', description: '運用量子糾纏時間反演雷達穿透相干隱形偽裝', icon: '⏰', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'stringnet_demiurge', title: '弦網創世主', description: '於真空基態誘導弦網冷凝湧現光子與費米子', icon: '🕸️', unlocked: false, progress: 0, maxProgress: 1, category: 'building' },
  { id: 'supergravity_twistor_pilot', title: '超引力扭量飛行員', description: '啟動 N=8 超引力旋量推進並實現 100% 慣性質量消除', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'penrose_ccc_chronicler', title: '潘洛斯共形循環記錄官', description: '在 CMB 微波背景中捕獲前一宇宙紀元霍金點引力波環', icon: '⏳', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'topological_superfluid_architect', title: '拓撲超流架構師', description: '在量子反常霍爾晶片上引導手性零耗散超流體量子運算', icon: '💻', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'dark_fermi_squeezer', title: '費米暗面量子壓縮大師', description: '穿透泡利簡併壓力透鏡觀測太初暗矮星費米球', icon: '🔭', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'rainbow_graviton_prism', title: '彩虹度規重力稜鏡', description: '探測普朗克尺度彩虹度規色散並捕獲宇宙弦重力子暴', icon: '🌈', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'acoustic_hawking_harvester', title: '聲學霍金輻射採集者', description: '突破超音速聲學黑洞視界並提取熱聲子能量', icon: '🔊', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'scarred_time_crystal_chronos', title: '多體疤痕時間晶體之神', description: '激發離散時間晶體 2T 亞諧波破缺非熱化振盪', icon: '⌛', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'higher_order_corner_braider', title: '高階角態編織大師', description: '在四極矩拓撲超導體上完成零能馬約拉納非阿貝爾編織', icon: '📐', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'casimir_torque_artisan', title: '卡西米爾扭矩工匠', description: '調諧雙折射微片各向異性零點扭矩並實現真空自轉加速', icon: '⚙️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'holographic_anyon_coder', title: '全息任意子編碼宗師', description: '在龐加萊雙曲五邊形全息碼中完成斐波那契任意子融合', icon: '🔮', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'relativistic_teleport_runner', title: '相對論性穿梭行者', description: '在 500g 加速度下透過超流聲子波導完成跨視界量子隱形傳態', icon: '💫', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'planck_vacuum_dynamist', title: '普朗克真空動態大師', description: '透過 SQUID 超導反射鏡光速抖動激發動態卡西米爾微波光子對', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'supersolid_vortex_conductor', title: '超固體渦旋導體', description: '在偶極超固體液滴晶格中激發阿布里科索夫量子化渦旋並達成非經典轉動慣量異常', icon: '❄️', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'primordial_gw_astronomer', title: '原初引力波天文學者', description: '透過三臂激光干涉陣列觀測暴脹張量微擾原初引力波隨機背景', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'aharonov_bohm_interferometer', title: '阿哈羅諾夫-玻姆幾何干涉官', description: '調控穿透超導環的磁通量子並實現持續無耗散量子相干電流', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'weyl_chiral_anomaly_harnesser', title: '外爾手性反常調諧師', description: '在平行電磁場下觸發外爾半金屬節點軸向電荷泵浦並引發手性磁效應', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'exciton_polariton_condensate', title: '極化激元凝聚領航者', description: '激發半導體微腔中極化激元玻色-愛因斯坦凝聚與拓撲超流孤子流', icon: '✨', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'floquet_time_crystal', title: 'Floquet 離散時間晶體主宰', description: '鎖定週期驅動非平衡態 Floquet 預熱高原與 2T 亞諧波對稱破缺振盪', icon: '⏳', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'hawking_unruh_detector', title: '霍金-安魯全息探測特使', description: '利用模擬加速視界超導量子電路探測雙模壓縮真空態霍金輻射微波光子對', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'aharonov_casher_interferometer', title: '阿哈羅諾夫-卡舍爾自旋幾何師', description: '調諧線電荷電場幾何力矩引發中性自旋幾何相位相消干涉與無耗散自旋流', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'spinor_skyrmion_condensate', title: '旋量斯格明子天體領航員', description: '激發旋量玻色凝聚二維斯格明子自旋晶格與合成規範場狄拉克單極子', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'exceptional_point_laser', title: '非厄米奇異點調諧大師', description: '調諧非厄米宇稱-時間對稱奇異點並實現分數階立方根超靈敏拓撲激光放大', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'majorana_braiding_qubit', title: '馬約拉納零能編織宗師', description: '在 T 型拓撲超導接面完成馬約拉納零能模非阿貝爾編織與宇稱容錯邏輯門', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'kaluza_klein_micro_blackhole', title: '高維卡魯扎-克萊因黑洞探險家', description: '在 TeV 標度大額外維度探測微型黑洞四階段霍金蒸發爆炸與 KK 重力子塔', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'moire_flatband_superconductor', title: '莫爾平帶超導領航者', description: '在魔角雙層石墨烯超晶格激發強關聯莫特絕緣能隙與量子度規非常規超導圓頂', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'scifi' },
  { id: 'gravitational_wave_memory', title: '引力波度規記憶觀測者', description: '探測雙黑洞併合引力波暴留下之非線性克里斯托杜盧永久直流應變殘餘與 BMS 軟毛', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'antiferro_topological_magnon', title: '反鐵磁拓撲磁振子大師', description: '調諧雙子晶格太赫茲自旋波反鐵磁共振，觀測狄拉克能隙與非零熱霍爾導率', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'holographic_wormhole_teleport', title: '全息蟲洞穿梭隱形傳態官', description: '施加雙邊非局域雙跡耦合注入負能量應力張量，透過可穿越蟲洞喉部因果穿梭量子資訊', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'chiral_anomaly_pump', title: '外爾手性反常泵浦大師', description: '在外爾半金屬中激發 Adler-Bell-Jackiw 手性反常軸向電荷泵浦與無耗散手性磁效應超流', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'gravitational_spin_memory', title: '引力自旋記憶觀測者', description: '觀測雙克爾黑洞輻射角動量通量在天球誘發之 BMS 超旋轉永久自旋速度躍遷與時間延遲', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'hinge_majorana_superconductor', title: '二階拓撲鉸鏈超導宗師', description: '在 3D 二階拓撲超導相鄰表面質量反轉域壁激發 1D 手性馬約拉納鉸鏈態與半整數熱霍爾電導', icon: '📐', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'quantum_island_reactor', title: '全息量子島佩吉領航員', description: '在 AdS/BCFT 蒸發黑洞中極值化量子極值面湧現量子島，透過 Petz 逆映射重構內部量子資訊', icon: '🏝️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'kitaev_spin_liquid', title: '基塔耶夫自旋液體拓撲先驅', description: '在蜂巢晶格激發自旋分數化游走馬約拉納費米子與非阿貝爾伊辛任意子，量測半整數熱霍爾效應', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'kerr_photon_shadow', title: '極端克爾黑洞全息觀測官', description: '重構極值旋轉黑洞全息天球光子陰影 D 狀變形、極限李雅普諾夫光子子環與能層超輻射提取', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'repulsive_casimir_motor', title: '拓撲斥力卡西米爾動力宗師', description: '調諧手性超材料反轉栗弗席茲自由能實現量子真空懸浮斥力，驅動零靜摩擦奈米扭矩發電機', icon: '⚙️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'multiboundary_wormhole', title: '雙曲多端全息蟲洞網絡架構師', description: '在雙曲 AdS 多邊界黎曼面構建中央多體糾纏核心，以多跡負能量耦合實現多端夏皮羅時間超前傳態', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'fractional_anomalous_hall', title: '量子反常分數霍爾先鋒', description: '在零外加磁場莫爾超晶格中湧現 Laughlin 分數電荷任意子與分數量子化階躍電導', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'terahertz_josephson_mixer', title: '太赫茲約瑟夫森混頻大師', description: '調諧超導交流約瑟夫森高頻振盪與夏皮羅量子階躍，生成突破標準量子極限之雙模壓縮光子態', icon: '📻', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'axion_insulator_resonator', title: '動態軸子極化激元共振宗師', description: '在偶數層反鐵磁拓撲絕緣體激發量子化軸子角 θ=π 拓撲磁電響應與巨法拉第旋轉', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'holographic_complexity_action', title: '全息複雜度勞埃德領航員', description: '在 AdS 惠勒-德威特時空斑塊中驗證量子電路複雜度飽和勞埃德極限與震波折返延遲', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'chiral_pwave_superfluid', title: '拓撲手性超流大師', description: '在 2D 手性 p 波超流體激發拓撲非平凡陳數 C=1、半量子化渦旋束縛馬約拉納態與無耗散邊界超流', icon: '🌊', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'quantum_spin_hall_helical', title: '量子自旋霍爾先驅', description: '在 2D 拓撲絕緣體建立時間反演對稱 ℤ₂=1 保護之無背向散射自旋動量鎖定螺旋邊緣態', icon: '🛡️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'quantum_kerr_soliton_comb', title: '克爾孤子光頻梳宗師', description: '在微環超高 Q 諧振腔透過盧吉亞托-勒菲弗動力學鎖定八度光頻梳與多模量子壓縮態', icon: '🌈', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'holographic_weyl_fluid', title: '全息外爾流體領航員', description: '在 AdS₄/CFT₃ 全息對偶中驗證飽和 KSS 極限 η/s=1/(4π) 之宇宙近完美量子流體與拓撲反常流', icon: '🌪️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'modular_hamiltonian_vacuum', title: '富田-竹崎模態真空大師', description: '調諧林德勒雙曲旋轉對偶，驗證糾纏第一定律 δS_A = δ<K_A> 與 QEI 量子能量不等式約束', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'multichannel_kondo_nfl', title: '多通道近藤非費米金屬先驅', description: '在 2CK 雙通道過度屏蔽臨界點解鎖 1/2 ln 2 殘餘分數熵、孤立馬約拉納零模與對數奇異電阻', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'birefringent_grav_lens', title: '雙折射引力透鏡干涉大師', description: '在克爾黑洞外爾手性曲率場觀測左右圓偏振測地線分裂、孿生愛因斯坦環與幾何相微分時延', icon: '🔭', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'holographic_microstate_mesh', title: '全息微觀態弦網重構宗師', description: '在 AdS 彭加萊圓盤利用 HaPPY 完美張量網絡重構絨毛球平滑超重力冠帽與量子引力回波', icon: '🔮', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'fibonacci_anyon_braiding', title: '菲波那契金鍵編織大師', description: '操作黃金維度 d_τ 非阿貝爾任意子緻密辮群，編譯通用拓撲量子門且零退相干', icon: '🧬', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'celestial_holo_bms', title: '天球全息 BMS 記憶領航員', description: '在天球共形場論中驗證軟引力子定理瓦德恆等式，記錄超平移度規剪切永久時空記憶', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'floquet_andreev_superconductor', title: '弗洛凱安德烈夫量子宗師', description: '在高頻微波週期驅動下激發反常弗洛凱 π-模與動態安德烈夫束縛態 LZS 量子干涉', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'quantum_metric_superfluid', title: '莫爾幾何度規超流先鋒', description: '在魔角石墨烯扁帶透過富比尼-斯特迪量子度規突破常規 BCS 失效，驗證幾何超流剛度', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'twisted_polariton_flat_band', title: '扭轉光子晶體平帶宗師', description: '在魔角扭轉微腔中實現極化激元慢光色散、低閾值玻色-愛因斯坦凝聚與假自旋半孤子渦旋', icon: '🌈', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'wigner_crystal_quantum_melting', title: '維格納晶格量子向列領航員', description: '在強關聯二維電子氣中觀察六角維格納晶體熔化相變與電子向列量子液晶巨各向異性傳輸', icon: '❄️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'desitter_holo_static_patch', title: '德西特靜態膜全息先驅', description: '在德西特因果鑽石中計算吉本斯-霍金極端視界熵、Type II_1 馮諾依曼最大混態與佩奇島嶼', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'chiral_phonon_acoustic_hall', title: '手性聲子反常聲霍爾大師', description: '激發二維晶格原子圓周旋轉手性聲子，驗證零磁場量子反常聲霍爾橫向偏轉與單向聲學整流', icon: '🔊', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'axion_gravitational_cherenkov', title: '軸子宇宙弦引力切倫科夫先驅', description: '觀測超相對論性軸子宇宙弦激波突破雙度規引力子速度極限，激發相干引力波激波錐', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'four_d_quantum_hall_synthetic', title: '四維量子霍爾合成維度大師', description: '在光學晶格中構築正交合成維度，驗證第二陳數拓撲不變量與三維邊界手性外爾超表面', icon: '🌐', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'parafermion_zero_modes', title: '非阿貝爾帕拉費米子拓撲宗師', description: '在分數量子霍爾超導疇壁編織 Z_4 帕拉費米子零能模，直接編譯非克利福德拓撲邏輯門', icon: '🧬', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'calabi_yau_moduli_stabilization', title: '卡拉比-丘流形模場穩定性先鋒', description: '利用通量緊緻化與 KKLT 抗膜上推機制穩定六維超弦幾何模場，實現亞穩德西特真空暴脹', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'hawking_page_ads_phase_transition', title: '霍金-佩奇全息引力相變宗師', description: '在反德西特空間調控臨界溫度 T_HP，驗證熱 AdS 禁閉氣體與大黑洞解禁閉等離子相一階相變及波利亞科夫圈序參量', icon: '🕳️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'axion_ti_witten_effect', title: '拓撲絕緣體維騰二元荷先驅', description: '在 θ=π 3D 拓撲絕緣體中感應狄拉克單極子半整數電荷 q=±e/2，驗證拓撲磁電效應與表面量子霍爾態', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'parisi_spin_glass_ultrametric', title: '帕里西超度規自旋玻璃領航員', description: '在 SK 模型幾何阻挫下驗證全層次複本破缺序參量 q(x)、超度規分形樹狀幾何與橫向場量子退火穿隧', icon: '🌲', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'non_abelian_cosmic_vortex', title: '非阿貝爾宇宙渦旋發電機大師', description: '在 BPS 飽和界限 (β=1.0) 實現平行非阿貝爾渦旋弦零力中性平衡，激發色通量碰撞重聯阻挫與暴脹弦環爆發', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'aharonov_anandan_geometric_phase', title: '阿哈羅諾夫-安丹幾何相位宗師', description: '在射影希爾伯特空間駕馭非絕熱 AA 幾何相與威爾切克-齊非阿貝爾單元完整群，實現超高速容錯幾何量子邏輯門', icon: '📐', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'gravito_electromagnetism_lense_thirring', title: '引力磁性蘭斯-蒂靈時空拖曳大師', description: '在克爾旋轉時空度規中測量引力磁場、局域慣性系蘭斯-蒂靈剛性進動與極區超相對論噴流剪切加速', icon: '🧭', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'weyl_fermi_arc_chiral_magnetic', title: '外爾費米弧手性磁效應先驅', description: '在動量空間操控拓撲單極外爾節點與開放費米弧表面態，驗證平行電磁場手性反常軸向電荷泵浦與 CME 淨電流', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'd_brane_dbi_nonlinear_vacuum', title: 'D-膜重聯狄拉克-玻恩-英費爾德領航員', description: '在次弦長尺度誘發開弦快子凝聚幾何重聯喉管，驗證 DBI 玻恩極限臨界場飽和與膜世界暴脹輻射', icon: '🛡️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'topological_kondo_insulator', title: '近藤拓撲共振宗師', description: '在強關聯 f-d 雜化材料中觀測奇數表面狄拉克錐、時間反演對稱性保護自旋-動量鎖定與電阻飽和平台', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'magnetar_qed_vacuum_birefringence', title: '磁星 QED 真空雙折射領航員', description: '於施溫格超強磁場中測量尤拉-海森堡非線性真空雙折射、固態地殼星震斷裂與相對論阿爾芬波 QPO', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'holographic_superconductor', title: '全息超導凝聚先鋒', description: '透過 AdS/CFT 對偶突破 Breitenlohner-Freedman 穩定邊界，激發荷電 AdS-RN 黑洞純量毛髮凝聚與狄拉克超流奇異點', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'yang_mills_instanton_vacuum', title: 'θ-真空穿隧破缺大師', description: '在非阿貝爾規範場中觀測自對偶 BPST 瞬子量子穿隧、θ-真空能量週期調製與軸子 Peccei-Quinn 動態 CP 恢復', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'schwinger_vacuum_breakdown', title: '舒溫格強場真空衰變宗師', description: '突破 Euler-Heisenberg 非微擾臨界電場 E_crit，激發狄拉克負能海穿隧創生電子-正電子對與 Breit-Wheeler 級聯雪崩', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'black_hole_superradiance_axion', title: '克爾黑洞超輻射軸子凝聚領航員', description: '在能層彭羅斯能區引發超輕玻色子超輻射不穩定性，凝聚 Ψ₂₁₁ 引力原子星雲，觀測連續單色引力波與 Bosenova 星震', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'strange_metal_syk_chaos', title: '奇異金屬普朗克耗散與 SYK 混亂大師', description: '解體準粒子達到普朗克耗散極限 ħ/τ ≈ k_BT 與純線性電阻率，在全對全 4-費米子網絡中飽和 MSS 量子混亂上界與 AdS₂ 全息黑洞對偶', icon: '🔥', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'quantum_spin_hall_fractional_soliton', title: '拓撲量子自旋霍爾螺旋孤子先鋒', description: '在 BHZ 能帶反轉薄膜中開拓時間反演保護螺旋邊緣通道，實現零背散射量子化電導 2 e²/h，並於磁疇壁捕獲 Jackiw-Rebbi e/2 分數電荷孤子', icon: '🛡️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'dynamical_casimir_effect', title: '動力學卡西米爾光子創生大師', description: '透過 SQUID 磁通高頻調製驅動相對論運動反射鏡 (v_eff ≈ 0.25c)，自發激發非絕熱玻戈留玻夫真空衰變，創生糾纏微波光子對與雙模極限正交壓縮態', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'hall_viscosity_read_rezayi', title: '拓撲量子霍爾奇性黏度宗師', description: '在 2D 手性量子流體中解析 Read-Rezayi 拓撲軌道自旋移位定理，實現嚴格零焦耳耗散奇性剪切應力張量、聲學圓雙折射分裂與邊界曲率手性漂移', icon: '🌊', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'gravitational_chiral_anomaly_weyl', title: '外爾引力軸向反常熱輸運先鋒', description: '利用魯丁格虛引力勢場對偶激發外爾半金屬混合引力-手性反常，觀測平行電磁熱電正縱向磁熱導率 (LMTC) 與維德曼-夫蘭茲定律巨幅破缺', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'magic_angle_twisted_graphene', title: '魔角莫爾超晶格平帶超導領航員', description: '精確調諧雙層石墨烯至第一魔角 θ ≈ 1.08° 淬火狄拉克費米速度，於活性極窄平帶中觀測半填充整數關聯莫特絕緣能隙與微量摻雜非常規超導穹頂 (Tc ≈ 1.72 K)', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'superfluid_helium3_topological_b', title: '超流氦-3 拓撲 B 相馬約拉納先驅', description: '在極低溫 mK 凝聚態中觀測 p-波自旋三重態超流、萊格特相干自旋共振雙頻響應、Class DIII 拓撲表面無質量馬約拉納費米雙錐與橫向聲學阻抗異常', icon: '🧪', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'chiral_majorana_qah_half_quantized', title: '量子反常霍爾手性馬約拉納天使粒子宗師', description: '在磁性拓撲絕緣體-超導體雜化結調諧交換能隙與配對能隙，解離狄拉克邊緣通道為一對手性馬約拉納費米子，實現精確半整數量子化電導平台 0.5 e²/h 與 c = 1/2 熱霍爾中心荷', icon: '👼', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'black_hole_quantum_horizon_echoes', title: '黑洞量子視界引力波迴聲領航員', description: '在普朗克尺度微觀反射量子視界膜與光子球有效勢壘諧振腔中，探測雙黑洞主並合鈴鳴後的週期性衰減引力波量子迴聲序列與玻爾茲曼反射率衰減', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'composite_fermion_hlr_liquid', title: '複合費米子與 HLR 幾何費米面大師', description: '在朗道半填充 ν = 1/2 實現陳-西蒙斯雙統計通量附著與平均場完全抵消，構建 Halperin-Lee-Read 複合費米液體並透過納米條紋微結構探測迴旋共振 2Rc*/a 縱向磁阻振盪峰', icon: '⚛️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'disorder_anderson_topological_superfluid', title: '拓撲超流安德森局域化大師', description: '在拓撲超導體中調控淬火無序勢能，驗證 Thouless 逆參與率、李雅普諾夫局域化長度與馬約拉納零能模臨界無序韌性', icon: '🌪️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'rotating_bec_abrikosov_lattice', title: '旋轉玻色凝聚阿布里科索夫渦旋宗師', description: '在旋轉玻色-愛因斯坦凝聚中激發科氏規範勢、費曼量子化渦旋三角晶格常數與特卡琴科橫波剪切彈性', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'surface_code_topological_memory', title: '表面碼同調量子記憶體拓撲領航員', description: '在二維棋盤表面碼晶格中測量星形與方塊同調徵兆，執行最小權重完全匹配 (MWPM) 糾錯消除拓撲任意子並突破容錯閾值', icon: '🧩', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'holographic_entanglement_negativity', title: '全息糾纏負度與共形反常先鋒', description: '在 AdS3/CFT2 全息對偶中計算 Ryu-Takayanagi 測地線與糾纏楔橫截面 (EWCS)，驗證混合態對數糾纏負度與拓撲相變', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'dirac_klein_tunneling_veselago', title: '狄拉克克萊因穿隧與負折射透鏡宗師', description: '在二維狄拉克半金屬中驗證正入射假自旋守恆無背散射完美穿透 T=1，並調控 Veselago 負折射率 n2 < 0 實現焦散透鏡聚焦', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'spin_orbit_bec_stripe_phase', title: '自旋-軌道耦合玻色凝聚條紋超固先鋒', description: '在雙分量玻色凝聚體中合成拉什巴-杜塞爾豪斯自旋軌道耦合，自發破缺 U(1) 規範與空間平移對稱性，觀測條紋超固相與各向異性超流剛度', icon: '🌈', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'magnetic_weyl_axion_polariton', title: '磁性外爾半金屬軸子極化子宗師', description: '在磁性外爾半金屬中激發拓撲軸子電磁耦合與反鐵磁磁振子雜化，打開極化子全反射禁帶並觀測非互易反常法拉第光學旋光', icon: '🧲', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'holographic_page_island_thermalization', title: '全息佩奇曲線與量子極值島嶼領航員', description: '在蒸發黑洞 AdS2/JT 全息幾何中探測量子極值曲面 (QES) 拓撲突變與糾纏島嶼湧現，重構么正性佩奇曲線並消解黑洞資訊丟失佯謬', icon: '🏝️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'fractional_chern_moire_mote2', title: '莫爾分數陳絕緣體與非阿貝爾編織宗師', description: '在扭轉雙層 MoTe₂ 莫爾平帶中實現零磁場分數量子反常霍爾效應 (FQAHE)，觀測 ν=-1/2 摩爾-里德非阿貝爾任意子拓撲基態簡併與容錯量子編織', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'floquet_lzsm_qubit_interferometry', title: '弗洛凱-斯圖克伯格量子相干干涉大師', description: '在強週期驅動超導轉子量子位元中操控避交叉幾何路徑，解析斯圖克伯格菱形相干干涉條紋與貝索零點相干相消穿隧 (CDT)', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'kerr_newman_ergosphere_jet', title: '克爾-紐曼能層等離子體發電機先鋒', description: '在帶電旋轉黑洞克爾-紐曼能層中破解靜止極限，藉由布蘭福德-茲納耶克磁層發電機激發相對論極區阿爾芬噴流與彭羅斯超能粒子分裂 (η>1)', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'holographic_c_theorem_rg_flow', title: '全息重整化群流與不可逆 c-定理領航員', description: '在超引力疇壁 AdS/CFT 全息對偶中驗證零能量條件 (NEC)，追蹤扎莫洛奇科夫 c-函數單調遞減與微觀自由度不可逆粗粒化資訊流', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'quantum_vortex_hall_superfluid', title: '量子渦旋霍爾效應與雙重超流宗師', description: '在旋轉超流體中驗證粒子-渦旋對偶性與馬格納斯力橫向偏轉，觀測拓撲量子渦旋霍爾角偏轉與對偶超導-絕緣體臨界相變', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'floquet_majorana_time_crystal', title: '弗洛凱-馬約拉納時間晶體領航員', description: '在週期驅動基塔耶夫鏈中突破熱化極限，激發亞諧波 2T 週期倍增非平衡態結晶序與 0-π 雙邊界馬約拉納保護模', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'tachyonic_cosmic_reconnection', title: '引力重聯快子凝聚與閉弦裂變先鋒', description: '在超弦碰撞中誘發不穩定快子負質量平方凝聚，觀測重聯幾何喉管拓撲穿透與弦尖突引力子巨脈衝輻射', icon: '🪐', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'holographic_chaos_thermalization', title: '全息量子混亂與極大李雅普諾夫大師', description: '在 AdS/CFT 黑洞視界中飽和 MSS 普朗克混亂極限界限 λ_L = 2πk_B T / ℏ，追蹤 OTOC 指數衰減雪崩與宇宙最快擾亂時間', icon: '🌌', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'moire_excitonic_insulator_bec', title: '莫爾拓撲激子絕緣體與對流超流宗師', description: '在雙層過渡金屬硫化物莫爾異質結中激發層間激子庫侖結合與自發凝聚，觀測拓撲陳數 C=1 與無耗散對流超流電導', icon: '❄️', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'non_abelian_spin_superfluid', title: '非阿貝爾自旋超流與外爾扭折領航員', description: '在易面量子磁體中驅動無耗散純自旋超流 J_s = -ρ_s ∇φ_s，結合外爾手性反常激發拓撲自旋扭折孤子與自旋約瑟夫森高頻振盪', icon: '🌀', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'planckian_inflation_holo_antenna', title: '普朗克引力暴脹與全息對偶天線先鋒', description: '在早期宇宙慢滾暴脹中藉由全息重整化消解奇點，觀測張量-標量比 r 與微波背景輻射 CMB B-模式旋度偏振太初引力波', icon: '📡', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },
  { id: 'topological_non_reciprocal_laser', title: '拓撲非互易光子晶體奇異點雷射大師', description: '在非厄米拓撲光子晶體中破缺 PT 對稱性，跨越非厄米奇異點 (EP) 激發單向手性邊緣態雷射與高達 40 dB 巨非互易光學隔離', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },


  // Mastery
  { id: 'claim_land', title: '領地拓荒者', description: '在元宇宙中認領一塊專屬 Chunk 領地', icon: '🚩', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
  { id: 'export_obj', title: '數位資產化', description: '將你的建築作品匯出為 3D OBJ 模型', icon: '📦', unlocked: false, progress: 0, maxProgress: 1, category: 'mastery' },
]

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map()

  constructor() {
    this.load()
  }

  private load(): void {
    const initialMap = new Map(INITIAL_ACHIEVEMENTS.map(a => [a.id, { ...a }]))
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('nw_achievements')
      if (saved) {
        try {
          const parsed: Achievement[] = JSON.parse(saved)
          for (const a of parsed) {
            if (initialMap.has(a.id)) {
              initialMap.set(a.id, a)
            }
          }
        } catch { /* ignore */ }
      }
    }
    this.achievements = initialMap
  }

  public save(): void {
    if (typeof localStorage === 'undefined') return
    const list = Array.from(this.achievements.values())
    localStorage.setItem('nw_achievements', JSON.stringify(list))
  }

  public getAll(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  public isUnlocked(id: string): boolean {
    return this.achievements.get(id)?.unlocked ?? false
  }

  public trackProgress(id: string, amount: number = 1): void {
    const ach = this.achievements.get(id)
    if (!ach || ach.unlocked) return

    ach.progress += amount
    if (ach.progress >= ach.maxProgress) {
      ach.progress = ach.maxProgress
      ach.unlocked = true
      this.notifyUnlock(ach)
    }
    this.save()
  }

  public unlock(id: string): void {
    const ach = this.achievements.get(id)
    if (!ach || ach.unlocked) return

    ach.unlocked = true
    ach.progress = ach.maxProgress
    this.notifyUnlock(ach)
    this.save()
  }

  private notifyUnlock(ach: Achievement): void {
    sound.playFanfare()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('achievement-unlocked', {
          detail: {
            id: ach.id,
            title: ach.title,
            description: ach.description,
            icon: ach.icon,
          },
        })
      )
    }
  }
}

export const achievements = new AchievementSystem()
export const achievementsManager = achievements
