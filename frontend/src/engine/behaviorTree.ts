/**
 * NewWorld AI Sandbox - Holographic AI Behavior Tree & Neural Brain Visualizer Engine
 *
 * Implements:
 * - Tree nodes: Root, Selector (Fallback ?), Sequence (->), Inverter (!), Condition ([?]), Action ([!]).
 * - Node execution states: SUCCESS, FAILURE, RUNNING.
 * - Real-time execution trace & active path pulse logging for visualizer rendering.
 * - Preset brain archetypes: Combat Vanguard, Eco-Medic Warden, Resource Forager, Cyber Jester.
 * - Hot-swapping brain injection into NPC Companion, Eco-Warden Drone, or Cyber Hound.
 * - Pure Web Audio synthesis: neural synapse pulse sounds and tree tick feedback.
 */

export type NodeStatus = 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'READY'
export type NodeType = 'selector' | 'sequence' | 'inverter' | 'condition' | 'action'

export interface BTNode {
  id: string
  name: string
  type: NodeType
  conditionType?: 'enemy_in_range' | 'health_low' | 'fire_detected' | 'stardust_detected' | 'master_in_combat'
  actionType?: 'attack_enemy' | 'deploy_shield' | 'extinguish_fire' | 'harvest_stardust' | 'patrol_perimeter' | 'dance_celebrate' | 'follow_master'
  children?: BTNode[]
  lastStatus?: NodeStatus
  lastTickTime?: number
}

export interface BrainPreset {
  id: string
  name: string
  description: string
  root: BTNode
}

export class BehaviorTreeEngine {
  private static instance: BehaviorTreeEngine | null = null
  private audioCtx: AudioContext | null = null

  // Active target for brain injection
  public targetEntity: 'npc_companion' | 'eco_warden' | 'cyber_hound' = 'npc_companion'

  // Current active tree
  public activeTree: BTNode

  // Preset Library
  public presets: BrainPreset[] = [
    {
      id: 'combat_vanguard',
      name: '⚔️ 戰鬥先鋒 (Combat Vanguard)',
      description: '主動鎖定 15m 內敵性實體；低血時優先張開等離子護盾防護主人。',
      root: {
        id: 'root_vanguard',
        name: '根節點 (Root Selector)',
        type: 'selector',
        children: [
          {
            id: 'seq_self_preserve',
            name: '緊急防禦序列',
            type: 'sequence',
            children: [
              { id: 'cond_low_hp', name: '自身血量低於 30%', type: 'condition', conditionType: 'health_low' },
              { id: 'act_shield', name: '開啟偏折力場護盾', type: 'action', actionType: 'deploy_shield' }
            ]
          },
          {
            id: 'seq_combat_strike',
            name: '接敵打擊序列',
            type: 'sequence',
            children: [
              { id: 'cond_enemy_near', name: '15m 內存在敵性目標', type: 'condition', conditionType: 'enemy_in_range' },
              { id: 'act_attack', name: '發動等離子光束射擊', type: 'action', actionType: 'attack_enemy' }
            ]
          },
          {
            id: 'act_escort',
            name: '伴隨主人貼身護航',
            type: 'action',
            actionType: 'follow_master'
          }
        ]
      }
    },
    {
      id: 'eco_warden_medic',
      name: '🌿 生態醫療巡護 (Eco-Warden Medic)',
      description: '自動巡邏周界，感測火災撲滅火源，在主人戰鬥時施加護盾。',
      root: {
        id: 'root_medic',
        name: '根節點 (Root Selector)',
        type: 'selector',
        children: [
          {
            id: 'seq_firefighting',
            name: '緊急滅火序列',
            type: 'sequence',
            children: [
              { id: 'cond_fire', name: '林區偵測到火災火源', type: 'condition', conditionType: 'fire_detected' },
              { id: 'act_extinguish', name: '噴灑超低溫滅火凝膠', type: 'action', actionType: 'extinguish_fire' }
            ]
          },
          {
            id: 'seq_protect_master',
            name: '護主防禦序列',
            type: 'sequence',
            children: [
              { id: 'cond_master_danger', name: '開拓者主人處於戰鬥', type: 'condition', conditionType: 'master_in_combat' },
              { id: 'act_medic_shield', name: '投射遠程量子防護屏障', type: 'action', actionType: 'deploy_shield' }
            ]
          },
          {
            id: 'act_patrol',
            name: '周界自律巡邏飛行',
            type: 'action',
            actionType: 'patrol_perimeter'
          }
        ]
      }
    },
    {
      id: 'resource_forager',
      name: '💎 資源探勘採樣 (Resource Forager)',
      description: '優先搜尋地表掉落之宇宙星塵與深海礦石，採樣後回歸隨行。',
      root: {
        id: 'root_forager',
        name: '根節點 (Root Selector)',
        type: 'selector',
        children: [
          {
            id: 'seq_stardust_harvest',
            name: '星塵搜集序列',
            type: 'sequence',
            children: [
              { id: 'cond_stardust', name: '探測到墜落宇宙星塵節點', type: 'condition', conditionType: 'stardust_detected' },
              { id: 'act_harvest', name: '自動開採並回收星塵碎片', type: 'action', actionType: 'harvest_stardust' }
            ]
          },
          {
            id: 'act_forager_follow',
            name: '緊隨開拓者並記錄地形',
            type: 'action',
            actionType: 'follow_master'
          }
        ]
      }
    },
    {
      id: 'cyber_jester',
      name: '🎭 賽博搞怪小丑 (Cyber Jester)',
      description: '隨性即興娛樂、慶祝勝利、發射慶祝粒子並隨主人狂歡。',
      root: {
        id: 'root_jester',
        name: '根節點 (Root Selector)',
        type: 'selector',
        children: [
          {
            id: 'act_dance',
            name: '轉圈旋轉特技舞步 (Pirouette)',
            type: 'action',
            actionType: 'dance_celebrate'
          },
          {
            id: 'act_jester_follow',
            name: '繞圈歡躍跟隨',
            type: 'action',
            actionType: 'follow_master'
          }
        ]
      }
    }
  ]

  // Environmental Context for AI evaluation
  public context = {
    enemyNearby: true,
    targetHp: 25,
    fireActive: false,
    stardustFound: true,
    masterInCombat: false
  }

  // Active execution path (node IDs) in latest tick
  public activeTrace: string[] = []

  private constructor() {
    this.activeTree = JSON.parse(JSON.stringify(this.presets[0].root))
    this.loadState()
  }

  public static getInstance(): BehaviorTreeEngine {
    if (!BehaviorTreeEngine.instance) {
      BehaviorTreeEngine.instance = new BehaviorTreeEngine()
    }
    return BehaviorTreeEngine.instance
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.audioCtx = new AudioCtx()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  /**
   * Load preset by ID
   */
  public loadPreset(presetId: string): boolean {
    const preset = this.presets.find(p => p.id === presetId)
    if (!preset) return false
    this.activeTree = JSON.parse(JSON.stringify(preset.root))
    this.saveState()
    this.playSynapsePulseSound()
    return true
  }

  /**
   * Evaluate a condition node
   */
  private evaluateCondition(node: BTNode): NodeStatus {
    switch (node.conditionType) {
      case 'enemy_in_range':
        return this.context.enemyNearby ? 'SUCCESS' : 'FAILURE'
      case 'health_low':
        return this.context.targetHp < 30 ? 'SUCCESS' : 'FAILURE'
      case 'fire_detected':
        return this.context.fireActive ? 'SUCCESS' : 'FAILURE'
      case 'stardust_detected':
        return this.context.stardustFound ? 'SUCCESS' : 'FAILURE'
      case 'master_in_combat':
        return this.context.masterInCombat ? 'SUCCESS' : 'FAILURE'
      default:
        return 'SUCCESS'
    }
  }

  /**
   * Evaluate an action node
   */
  private evaluateAction(_node: BTNode): NodeStatus {
    return 'SUCCESS'
  }

  /**
   * Tick evaluate a node recursively
   */
  public tickNode(node: BTNode, trace: string[]): NodeStatus {
    trace.push(node.id)
    node.lastTickTime = Date.now()

    if (node.type === 'condition') {
      const status = this.evaluateCondition(node)
      node.lastStatus = status
      return status
    }

    if (node.type === 'action') {
      const status = this.evaluateAction(node)
      node.lastStatus = status
      return status
    }

    if (node.type === 'inverter') {
      if (!node.children || node.children.length === 0) {
        node.lastStatus = 'FAILURE'
        return 'FAILURE'
      }
      const childStatus = this.tickNode(node.children[0], trace)
      const res = childStatus === 'SUCCESS' ? 'FAILURE' : (childStatus === 'FAILURE' ? 'SUCCESS' : 'RUNNING')
      node.lastStatus = res
      return res
    }

    if (node.type === 'sequence') {
      // Sequence: returns FAILURE if any child fails, SUCCESS if all succeed
      if (!node.children || node.children.length === 0) {
        node.lastStatus = 'SUCCESS'
        return 'SUCCESS'
      }
      for (const child of node.children) {
        const childStatus = this.tickNode(child, trace)
        if (childStatus !== 'SUCCESS') {
          node.lastStatus = childStatus
          return childStatus
        }
      }
      node.lastStatus = 'SUCCESS'
      return 'SUCCESS'
    }

    if (node.type === 'selector') {
      // Selector: returns SUCCESS if any child succeeds, FAILURE if all fail
      if (!node.children || node.children.length === 0) {
        node.lastStatus = 'FAILURE'
        return 'FAILURE'
      }
      for (const child of node.children) {
        const childStatus = this.tickNode(child, trace)
        if (childStatus !== 'FAILURE') {
          node.lastStatus = childStatus
          return childStatus
        }
      }
      node.lastStatus = 'FAILURE'
      return 'FAILURE'
    }

    node.lastStatus = 'SUCCESS'
    return 'SUCCESS'
  }

  /**
   * Execute full tree tick
   */
  public tick(): { status: NodeStatus; trace: string[] } {
    const trace: string[] = []
    const status = this.tickNode(this.activeTree, trace)
    this.activeTrace = trace
    return { status, trace }
  }

  /**
   * Hot-swap inject active brain into selected target entity
   */
  public injectBrain(target: 'npc_companion' | 'eco_warden' | 'cyber_hound'): void {
    this.initAudio()
    this.targetEntity = target
    this.saveState()
    this.playInjectSound()
  }

  // --- Web Audio Procedural Synthesis ---

  private playSynapsePulseSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  private playInjectSound(): void {
    if (!this.audioCtx) return
    const now = this.audioCtx.currentTime
    const osc1 = this.audioCtx.createOscillator()
    const osc2 = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc1.type = 'triangle'
    osc2.type = 'sawtooth'

    osc1.frequency.setValueAtTime(440, now)
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.25)
    osc2.frequency.setValueAtTime(554.37, now) // C#5
    osc2.frequency.exponentialRampToValueAtTime(1108.73, now + 0.25)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.3)
    osc2.stop(now + 0.3)
  }

  // --- Persistence ---

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('newworld_active_tree', JSON.stringify(this.activeTree))
      localStorage.setItem('newworld_brain_target', this.targetEntity)
    }
  }

  private loadState(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTree = localStorage.getItem('newworld_active_tree')
      if (savedTree) {
        try {
          this.activeTree = JSON.parse(savedTree)
        } catch (e) {
          console.warn('Failed to parse active tree:', e)
        }
      }
      const savedTarget = localStorage.getItem('newworld_brain_target')
      if (savedTarget) {
        this.targetEntity = savedTarget as 'npc_companion' | 'eco_warden' | 'cyber_hound'
      }
    }
  }
}

export const behaviorTree = BehaviorTreeEngine.getInstance()
