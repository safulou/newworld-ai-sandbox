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
  { id: 'dungeon_slayer', title: '核心征服者', description: '闖關賽博地下城挑戰並擊敗核心守衛', icon: '⚔️', unlocked: false, progress: 0, maxProgress: 1, category: 'exploration' },

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
