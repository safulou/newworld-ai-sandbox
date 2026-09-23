import * as THREE from 'three'
import { NPC_ROSTER, NPCCompanion } from './npc'
import { tts } from './tts'

export interface SocialExchange {
  speaker1Id: string
  line1: string
  speaker2Id: string
  line2: string
}

export const SOCIAL_DIALOGUES: SocialExchange[] = [
  {
    speaker1Id: 'npc_architect',
    line1: 'Vex，我正在規劃空島樞紐，你手頭上那批高純度量子晶體能打個折扣嗎？',
    speaker2Id: 'npc_merchant',
    line2: '哎呀 Alex，好貨不等人！不過看在老搭檔份上，送你兩箱超導合金當搭頭！',
  },
  {
    speaker1Id: 'npc_sentinel',
    line1: 'Sparky，回報空域掃描結果，是否有未授權的虛空磁暴干擾？',
    speaker2Id: 'npc_drone',
    line2: '嗶嗶！Sparky 偵測完成：能量屏障數值 100%，無任何異常信號入侵！',
  },
  {
    speaker1Id: 'npc_lore',
    line1: 'Alex，這片體素山脈的底層幾何排列，隱約記載著上一紀元量子文明的坐標。',
    speaker2Id: 'npc_architect',
    line2: '令人驚嘆，古老算法的精確度竟然絲毫不亞於我們現代的生成矩陣。',
  },
  {
    speaker1Id: 'npc_merchant',
    line1: 'Chronos 大學者，你在古蹟挖到的那些發光古幣，我出五萬體素信用點收購如何？',
    speaker2Id: 'npc_lore',
    line2: '歷史的厚度不是虛擬貨幣所能衡量的，商人朋友，知識當留存給後人探索。',
  },
  {
    speaker1Id: 'npc_sentinel',
    line1: 'Alex，北側城牆的防禦基底需要進一步加厚，以防電漿洪流衝擊。',
    speaker2Id: 'npc_architect',
    line2: '明白，我已經安排奈米機器人注入玄武岩核心，強度將提升三倍。',
  }
]

export class NPCSocietyEngine {
  private affinities: Record<string, number> = {}
  private socialTimer: number = 0
  private isChatting: boolean = false
  public recentLogs: { from: string; to: string; text: string; time: string }[] = []

  constructor() {
    this.loadAffinities()
  }

  private loadAffinities(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      const stored = localStorage.getItem('nw_npc_affinities')
      if (stored) {
        this.affinities = JSON.parse(stored)
      } else {
        for (const def of NPC_ROSTER) {
          this.affinities[def.id] = 20
        }
      }
    } catch {
      for (const def of NPC_ROSTER) {
        this.affinities[def.id] = 20
      }
    }
  }

  private saveAffinities(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_npc_affinities', JSON.stringify(this.affinities))
    } catch { /* ignore */ }
  }

  public getAffinity(npcId: string): number {
    return this.affinities[npcId] ?? 20
  }

  public addAffinity(npcId: string, amount: number): number {
    const cur = this.affinities[npcId] ?? 20
    const next = Math.max(0, Math.min(100, cur + amount))
    this.affinities[npcId] = next
    this.saveAffinities()
    return next
  }

  public getAffinityRank(npcId: string): { title: string; color: string } {
    const pts = this.getAffinity(npcId)
    if (pts >= 80) return { title: '元宇宙靈魂知己', color: '#ff00ff' }
    if (pts >= 55) return { title: '深度信任夥伴', color: '#00ffff' }
    if (pts >= 30) return { title: '可靠冒險隊友', color: '#00ff88' }
    return { title: '初識拓荒者', color: '#94a3b8' }
  }

  public update(delta: number, npcs: NPCCompanion[], playerPos: THREE.Vector3): void {
    this.socialTimer += delta
    if (this.socialTimer < 18.0 || this.isChatting) return
    this.socialTimer = 0

    // Look for two NPCs close to each other (< 12m)
    if (npcs.length < 2) return

    for (let i = 0; i < npcs.length; i++) {
      for (let j = i + 1; j < npcs.length; j++) {
        const npcA = npcs[i]
        const npcB = npcs[j]
        const dist = npcA.getGroup().position.distanceTo(npcB.getGroup().position)

        if (dist <= 12.0) {
          this.triggerAutonomousSocialExchange(npcA, npcB, playerPos)
          return
        }
      }
    }
  }

  private triggerAutonomousSocialExchange(npcA: NPCCompanion, npcB: NPCCompanion, playerPos: THREE.Vector3): void {
    const matching = SOCIAL_DIALOGUES.find(
      d => (d.speaker1Id === npcA.def.id && d.speaker2Id === npcB.def.id) ||
           (d.speaker1Id === npcB.def.id && d.speaker2Id === npcA.def.id)
    )
    if (!matching) return

    this.isChatting = true
    const first = matching.speaker1Id === npcA.def.id ? npcA : npcB
    const second = matching.speaker1Id === npcA.def.id ? npcB : npcA

    // NPC A speaks
    first.startSpeaking(matching.line1, 4.0)
    tts.speak(matching.line1, first.def.id, first.getGroup().position, playerPos)
    this.logSocialEvent(first.def.name, second.def.name, matching.line1)

    // NPC B replies after 3.5s
    setTimeout(() => {
      second.startSpeaking(matching.line2, 4.0)
      tts.speak(matching.line2, second.def.id, second.getGroup().position, playerPos)
      this.logSocialEvent(second.def.name, first.def.name, matching.line2)

      setTimeout(() => {
        this.isChatting = false
      }, 3500)
    }, 3500)
  }

  private logSocialEvent(from: string, to: string, text: string): void {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false })
    this.recentLogs.unshift({ from, to, text, time })
    if (this.recentLogs.length > 20) {
      this.recentLogs.pop()
    }
    window.dispatchEvent(new CustomEvent('npc-social-event', {
      detail: { from, to, text, time }
    }))
  }
}

export const npcSociety = new NPCSocietyEngine()
