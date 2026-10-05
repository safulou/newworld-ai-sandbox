/**
 * NewWorld AI Sandbox - Quantum Neural Consciousness Upload & Mind Transfer Engine
 * 
 * Implements:
 * - BCI Neural Digitalization & Mind Transfer across 4 physical/synthetic vessels (Pioneer Bio, Android Frame, Titan Frame, Ark Core Mind)
 * - 4 Deep Neural Skill Trees: Cyber Netrunner, Stellar Pilot, Voxel Architect, Psionic Resonance
 * - Synaptic node unlocking with Memory Shards & Sync Rate telemetry (0% to 100%)
 * - Pure Web Audio procedural audio synthesis (Synaptic spark buzz, mind upload harmonic ladder, transfer pulse)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type VesselId = 'pioneer_bio' | 'android_frame' | 'titan_frame' | 'ark_core_mind'

export interface NeuralVessel {
  id: VesselId
  name: string
  type: 'Organic' | 'Synthetic' | 'Heavy Mech' | 'Super AI'
  armorBonus: number
  speedMultiplier: number
  perkDescription: string
  color: string
}

export type SkillTreeId = 'cyber_netrunner' | 'stellar_pilot' | 'voxel_architect' | 'psionic_resonance'

export interface NeuralSynapseNode {
  id: string
  treeId: SkillTreeId
  name: string
  tier: number
  shardCost: number
  isUnlocked: boolean
  description: string
  statBuff: string
}

export interface NeuralStats {
  activeVessel: VesselId
  syncRate: number          // 0 to 100%
  memoryShards: number      // Currency to unlock skills
  totalNodesUnlocked: number
  overloadProtection: boolean
  statusMessage: string
}

export const NEURAL_VESSELS: Record<VesselId, NeuralVessel> = {
  pioneer_bio: {
    id: 'pioneer_bio',
    name: '原生碳基開拓者 (Pioneer Bio-Origin)',
    type: 'Organic',
    armorBonus: 0,
    speedMultiplier: 1.0,
    perkDescription: '原生神經反射，靈敏度高，心靈共振同調 +20%',
    color: '#00e5ff'
  },
  android_frame: {
    id: 'android_frame',
    name: '自律生化合金義體 (Android Frame)',
    type: 'Synthetic',
    armorBonus: 35,
    speedMultiplier: 1.25,
    perkDescription: '完全免疫太空輻射與真空環境，奔跑速度 +25%',
    color: '#00ff88'
  },
  titan_frame: {
    id: 'titan_frame',
    name: '重裝外骨骼泰坦機軀 (Titan Mech Frame)',
    type: 'Heavy Mech',
    armorBonus: 80,
    speedMultiplier: 0.9,
    perkDescription: '全武器火力 +50%，吸收 80% 外部動能衝擊',
    color: '#ff9100'
  },
  ark_core_mind: {
    id: 'ark_core_mind',
    name: '方舟母艦主控超智慧 (Ark Core Mind)',
    type: 'Super AI',
    armorBonus: 100,
    speedMultiplier: 1.5,
    perkDescription: '全域量子信標快速傳送零冷卻，母艦物料無限同調',
    color: '#bd00ff'
  }
}

export const SYNAPSE_NODES: NeuralSynapseNode[] = [
  // Cyber Netrunner Tree
  { id: 'net_1', treeId: 'cyber_netrunner', name: '緩衝超頻 (Buffer Overclock)', tier: 1, shardCost: 10, isUnlocked: true, description: '入侵矩陣緩衝區容量上限 +2 格', statBuff: 'Buffer +2' },
  { id: 'net_2', treeId: 'cyber_netrunner', name: '黑冰規避 (Black ICE Bypass)', tier: 2, shardCost: 20, isUnlocked: false, description: '遭遇致命 Black ICE 反衝傷害減免 60%', statBuff: 'ICE Def +60%' },
  { id: 'net_3', treeId: 'cyber_netrunner', name: '零日漏洞庫 (Zero-Day Arsenal)', tier: 3, shardCost: 35, isUnlocked: false, description: '滲透攻堅直接秒殺企業級子網防火牆 30%', statBuff: 'Instant Hack +30%' },

  // Stellar Pilot Tree
  { id: 'pilot_1', treeId: 'stellar_pilot', name: '曲率調諧 (Warp Vector Tuning)', tier: 1, shardCost: 10, isUnlocked: true, description: '星艦曲率躍遷充能時間縮短 30%', statBuff: 'Warp Charge -30%' },
  { id: 'pilot_2', treeId: 'stellar_pilot', name: '引力滑行 (Slingshot Mastery)', tier: 2, shardCost: 20, isUnlocked: false, description: '引力彈弓軌道甩出速度倍率額外 +1.5x', statBuff: 'Slingshot Boost +1.5x' },
  { id: 'pilot_3', treeId: 'stellar_pilot', name: '虛空慣性阻尼 (Void Drift Dampener)', tier: 3, shardCost: 35, isUnlocked: false, description: '微重力飛行姿態零慣性滑移漂移', statBuff: 'Inertia Fix +100%' },

  // Voxel Architect Tree
  { id: 'arch_1', treeId: 'voxel_architect', name: '奈米高速鋪設 (Nanite Rapid Build)', tier: 1, shardCost: 10, isUnlocked: true, description: 'AI 藍圖生成結構建造速度提升 50%', statBuff: 'Build Speed +50%' },
  { id: 'arch_2', treeId: 'voxel_architect', name: '物質轉化微胞 (Material Alchemy)', tier: 2, shardCost: 20, isUnlocked: false, description: '挖掘方塊時 25% 機率掉落稀有超導元素', statBuff: 'Alchemy Chance +25%' },
  { id: 'arch_3', treeId: 'voxel_architect', name: '戴森工程拓撲 (Dyson Shell Mesh)', tier: 3, shardCost: 35, isUnlocked: false, description: '戴森球宏工程物料投入效益翻倍', statBuff: 'Megastructure Eff +100%' },

  // Psionic Resonance Tree
  { id: 'psi_1', treeId: 'psionic_resonance', name: '超載念力盾 (Psionic Overcharge)', tier: 1, shardCost: 10, isUnlocked: true, description: '外骨骼與身軀偏折盾上限永久 +500', statBuff: 'Shield +500' },
  { id: 'psi_2', treeId: 'psionic_resonance', name: '時空鐘慢感測 (Temporal Attunement)', tier: 2, shardCost: 20, isUnlocked: false, description: '暗物質裂隙環境輻射累積速率降低 50%', statBuff: 'Rift Rad -50%' },
  { id: 'psi_3', treeId: 'psionic_resonance', name: '蜂巢意識超驗 (Hive Transcendence)', tier: 3, shardCost: 50, isUnlocked: false, description: '解鎖全意識節點神經連通，心智達到神性同調', statBuff: 'All Mastered' }
]

export class NeuralConsciousnessEngine {
  public vessels: Record<VesselId, NeuralVessel>
  public nodes: NeuralSynapseNode[] = []
  public stats: NeuralStats = {
    activeVessel: 'pioneer_bio',
    syncRate: 85,
    memoryShards: 120,
    totalNodesUnlocked: 4,
    overloadProtection: true,
    statusMessage: 'BCI 腦機接口神經意識網在線，意識心智同調率 85%。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.vessels = JSON.parse(JSON.stringify(NEURAL_VESSELS))
    this.nodes = JSON.parse(JSON.stringify(SYNAPSE_NODES))
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  // ── Mind Transfer ────────────────────────────────────────────────────────
  public transferMindTo(vesselId: VesselId): boolean {
    if (this.stats.activeVessel === vesselId) return false
    const target = this.vessels[vesselId]
    if (!target) return false

    this.stats.activeVessel = vesselId
    this.stats.syncRate = Math.min(100, this.stats.syncRate + 5)
    this.stats.statusMessage = `🧠 意識移魂注入成功！當前意識載體：[${target.name}]`

    this.playMindUpload()
    this.saveState()
    return true
  }

  // ── Synaptic Skills ──────────────────────────────────────────────────────
  public unlockNode(nodeId: string): boolean {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node || node.isUnlocked) return false

    if (this.stats.memoryShards < node.shardCost) return false

    this.stats.memoryShards -= node.shardCost
    node.isUnlocked = true
    this.stats.totalNodesUnlocked += 1
    this.stats.syncRate = Math.min(100, this.stats.syncRate + 8)
    this.stats.statusMessage = `⚡ 神經突觸節點 [${node.name}] 成功點亮解鎖！`

    // Check achievement if 8 or more nodes unlocked
    if (this.stats.totalNodesUnlocked >= 8) {
      achievements.trackProgress('mind_transcendent', 1)
    }

    this.playNeuralSynapse()
    this.saveState()
    return true
  }

  public harvestMemoryShards(amount: number = 25): void {
    this.stats.memoryShards += amount
    this.stats.statusMessage = `💎 透過神經冥想沉思獲取了 ${amount} 枚意識記憶碎片。`
    this.saveState()
  }

  // ── Procedural Web Audio Sound Synthesis ─────────────────────────────────
  public playNeuralSynapse(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.15)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  }

  public playMindUpload(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [440, 554.37, 659.25, 880, 1108.73] // A Major ascending ladder
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.08
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  // ── LocalStorage State Persistence ───────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_neural_mind', JSON.stringify({
        stats: this.stats,
        nodes: this.nodes
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_neural_mind')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.nodes) {
          this.nodes = parsed.nodes
        }
      }
    } catch { /* ignore */ }
  }
}

export const neuralConsciousness = new NeuralConsciousnessEngine()
