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
