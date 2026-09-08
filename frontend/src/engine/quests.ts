import { BlockType } from '@/types/world'
import { sound } from './audio'
import { achievements } from './achievements'

export interface QuestStep {
  id: string
  description: string
  targetCount: number
  currentCount: number
  completed: boolean
}

export interface Quest {
  id: string
  title: string
  giverName: string
  giverRole: string
  description: string
  category: 'main' | 'building' | 'exploration' | 'scifi'
  steps: QuestStep[]
  rewardDescription: string
  rewardBlock?: BlockType
  completed: boolean
}

export const QUEST_CATALOG: Quest[] = [
  {
    id: 'quest_genesis',
    title: '第一塊基石 (First Keystone)',
    giverName: 'Alex',
    giverRole: 'Cyber Architect',
    description: '歡迎來到 NewWorld 元宇宙！請放置 5 個任意方塊，開始你的虛擬建造之旅。',
    category: 'main',
    steps: [
      { id: 'place_5_blocks', description: '在世界中放置 5 個方塊', targetCount: 5, currentCount: 0, completed: false },
    ],
    rewardDescription: '解鎖「量子超核」方塊配方與 100 經驗值',
    rewardBlock: 'quantum_core',
    completed: false,
  },
  {
    id: 'quest_sentinel_patrol',
    title: '邊境信號燈塔 (Sentinel Beacons)',
    giverName: 'Aegis',
    giverRole: 'Security Sentinel',
    description: '防衛機甲 Aegis 需要你在領地邊界搭建 3 座高於 Y=15 的光譜照明燈塔，以抵禦虛空侵蝕。',
    category: 'building',
    steps: [
      { id: 'place_3_emitters', description: '放置 3 個全光譜照明燈', targetCount: 3, currentCount: 0, completed: false },
    ],
    rewardDescription: '解鎖防衛機甲裝甲板與「電漿防護圍阻體」',
    rewardBlock: 'plasma_containment',
    completed: false,
  },
  {
    id: 'quest_quantum_circuit',
    title: '賽博邏輯網絡 (Quantum Logic Circuit)',
    giverName: 'Chronos',
    giverRole: 'Lore Master',
    description: '修復古代遺跡的能量網絡。連接至少 6 格能量導線並點亮照明燈。',
    category: 'scifi',
    steps: [
      { id: 'place_wires', description: '佈設 6 條能量導線', targetCount: 6, currentCount: 0, completed: false },
      { id: 'place_power', description: '放置 1 個恆定量子電源', targetCount: 1, currentCount: 0, completed: false },
    ],
    rewardDescription: '解鎖「量子傳送門」建造藍圖',
    rewardBlock: 'teleporter',
    completed: false,
  },
  {
    id: 'quest_sky_spire',
    title: '觸碰雲海的巨塔 (Skyward Citadel)',
    giverName: 'Vex',
    giverRole: 'Cyber Merchant',
    description: '星際商人需要一個高聳入雲的地標以引導運輸飛船。建造一座高達 Y=35 的通天高塔。',
    category: 'exploration',
    steps: [
      { id: 'reach_y35', description: '登上高度 Y >= 35 的高空', targetCount: 1, currentCount: 0, completed: false },
    ],
    rewardDescription: '解鎖「賽博霓虹全套調色盤」',
    rewardBlock: 'neon_cyan',
    completed: false,
  },
  {
    id: 'quest_style_overhaul',
    title: '全域賽博重鑄 (Cyber Re-Architect)',
    giverName: 'Alex',
    giverRole: 'Cyber Architect',
    description: '使用 AI Style Transfer 將你的建築群轉化為 Cyberpunk Neon Matrix 風格。',
    category: 'main',
    steps: [
      { id: 'apply_style', description: '執行 1 次風格遷移', targetCount: 1, currentCount: 0, completed: false },
    ],
    rewardDescription: '解鎖「矩陣代碼格網」專屬方塊',
    rewardBlock: 'matrix_grid',
    completed: false,
  },
]

export class QuestEngine {
  private quests: Map<string, Quest> = new Map()

  constructor() {
    this.load()
  }

  private load(): void {
    const saved = localStorage.getItem('nw_quests')
    const initialMap = new Map(QUEST_CATALOG.map(q => [q.id, JSON.parse(JSON.stringify(q))]))

    if (saved) {
      try {
        const parsed: Quest[] = JSON.parse(saved)
        for (const q of parsed) {
          if (initialMap.has(q.id)) {
            initialMap.set(q.id, q)
          }
        }
      } catch { /* ignore */ }
    }

    this.quests = initialMap
  }

  public save(): void {
    const list = Array.from(this.quests.values())
    localStorage.setItem('nw_quests', JSON.stringify(list))
  }

  public getAll(): Quest[] {
    return Array.from(this.quests.values())
  }

  public getActiveQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(q => !q.completed)
  }

  public trackProgress(stepId: string, amount: number = 1): void {
    let changed = false

    for (const quest of this.quests.values()) {
      if (quest.completed) continue

      for (const step of quest.steps) {
        if (step.id === stepId && !step.completed) {
          step.currentCount += amount
          if (step.currentCount >= step.targetCount) {
            step.currentCount = step.targetCount
            step.completed = true
          }
          changed = true
        }
      }

      // Check if all steps in this quest are completed
      if (quest.steps.every(s => s.completed)) {
        quest.completed = true
        this.notifyQuestComplete(quest)
        changed = true
      }
    }

    if (changed) {
      this.save()
    }
  }

  private notifyQuestComplete(quest: Quest): void {
    sound.playFanfare()
    achievements.trackProgress('master_builder_10', 1)
    window.dispatchEvent(
      new CustomEvent('quest-completed', {
        detail: {
          id: quest.id,
          title: quest.title,
          reward: quest.rewardDescription,
        },
      })
    )
  }
}

export const questEngine = new QuestEngine()
