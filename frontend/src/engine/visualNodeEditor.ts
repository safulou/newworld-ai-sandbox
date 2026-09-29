import { sound } from './audio'
import { achievements } from './achievements'

export type NodeCategory = 'event' | 'condition' | 'action'

export interface LogicNode {
  id: string
  type: string
  category: NodeCategory
  title: string
  x: number
  y: number
  inputs: string[]
  outputs: string[]
  params: Record<string, any>
}

export interface LogicConnection {
  id: string
  fromNodeId: string
  fromOutput: string
  toNodeId: string
  toInput: string
}

export interface LogicGraph {
  id: string
  name: string
  description: string
  enabled: boolean
  nodes: LogicNode[]
  connections: LogicConnection[]
}

export const NODE_TEMPLATES: Record<string, Omit<LogicNode, 'id' | 'x' | 'y'>> = {
  event_player_enter: {
    type: 'event_player_enter',
    category: 'event',
    title: '🚶 玩家進入區域 (On Player Enter)',
    inputs: [],
    outputs: ['exec'],
    params: { radius: 5, targetX: 0, targetZ: 0 },
  },
  event_timer_tick: {
    type: 'event_timer_tick',
    category: 'event',
    title: '⏱️ 定時脈衝觸發 (Timer Tick)',
    inputs: [],
    outputs: ['exec'],
    params: { intervalSeconds: 10 },
  },
  cond_has_item: {
    type: 'cond_has_item',
    category: 'condition',
    title: '🔍 檢查持有物品 (Has Item)',
    inputs: ['exec'],
    outputs: ['true', 'false'],
    params: { itemId: 'quantum_core', count: 1 },
  },
  cond_time_of_day: {
    type: 'cond_time_of_day',
    category: 'condition',
    title: '🌙 檢查日夜天象 (Time Check)',
    inputs: ['exec'],
    outputs: ['true', 'false'],
    params: { targetTime: 'night' },
  },
  act_broadcast_msg: {
    type: 'act_broadcast_msg',
    category: 'action',
    title: '💬 廣播全息訊息 (Broadcast Message)',
    inputs: ['exec'],
    outputs: ['done'],
    params: { message: '歡迎來到賽博元宇宙中心！' },
  },
  act_play_sound: {
    type: 'act_play_sound',
    category: 'action',
    title: '🔊 播放環境音效 (Play Sound)',
    inputs: ['exec'],
    outputs: ['done'],
    params: { soundType: 'chime' },
  },
  act_call_airdrop: {
    type: 'act_call_airdrop',
    category: 'action',
    title: '📦 召喚空投補給 (Call Airdrop)',
    inputs: ['exec'],
    outputs: ['done'],
    params: { altitude: 35 },
  },
}

export const DEFAULT_PRESET_GRAPH: LogicGraph = {
  id: 'graph_welcome',
  name: '中央迎賓自動響鈴廣播 (Welcome Chime)',
  description: '當玩家進入中心區域時，自動觸發迎賓音效並向全息 HUD 發送廣播',
  enabled: true,
  nodes: [
    {
      id: 'node_1',
      type: 'event_player_enter',
      category: 'event',
      title: '🚶 玩家進入區域 (On Enter)',
      x: 40,
      y: 60,
      inputs: [],
      outputs: ['exec'],
      params: { radius: 8, targetX: 0, targetZ: 0 },
    },
    {
      id: 'node_2',
      type: 'act_play_sound',
      category: 'action',
      title: '🔊 播放迎賓音效 (Play Sound)',
      x: 320,
      y: 40,
      inputs: ['exec'],
      outputs: ['done'],
      params: { soundType: 'fanfare' },
    },
    {
      id: 'node_3',
      type: 'act_broadcast_msg',
      category: 'action',
      title: '💬 廣播歡迎訊息 (Broadcast)',
      x: 320,
      y: 180,
      inputs: ['exec'],
      outputs: ['done'],
      params: { message: '🌟 歡迎開拓者抵達中央核心樞紐！' },
    },
  ],
  connections: [
    { id: 'conn_1', fromNodeId: 'node_1', fromOutput: 'exec', toNodeId: 'node_2', toInput: 'exec' },
    { id: 'conn_2', fromNodeId: 'node_1', fromOutput: 'exec', toNodeId: 'node_3', toInput: 'exec' },
  ],
}

export class VisualNodeEditorEngine {
  public graphs: LogicGraph[] = []
  public activeGraphId: string = 'graph_welcome'

  constructor() {
    this.loadGraphs()
  }

  public get activeGraph(): LogicGraph {
    return this.graphs.find(g => g.id === this.activeGraphId) || this.graphs[0]
  }

  public addNode(type: string, x: number = 200, y: number = 100): LogicNode | null {
    const tmpl = NODE_TEMPLATES[type]
    if (!tmpl) return null

    const node: LogicNode = {
      id: `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      category: tmpl.category,
      title: tmpl.title,
      x,
      y,
      inputs: [...tmpl.inputs],
      outputs: [...tmpl.outputs],
      params: { ...tmpl.params },
    }

    this.activeGraph.nodes.push(node)
    this.saveGraphs()
    sound.playUiClick()
    achievements.unlock('logic_architect')
    return node
  }

  public removeNode(nodeId: string): void {
    const g = this.activeGraph
    g.nodes = g.nodes.filter(n => n.id !== nodeId)
    g.connections = g.connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    this.saveGraphs()
  }

  public addConnection(fromNodeId: string, fromOutput: string, toNodeId: string, toInput: string): LogicConnection | null {
    if (fromNodeId === toNodeId) return null
    const g = this.activeGraph

    // Avoid duplicate connections
    const exists = g.connections.some(c =>
      c.fromNodeId === fromNodeId && c.fromOutput === fromOutput &&
      c.toNodeId === toNodeId && c.toInput === toInput
    )
    if (exists) return null

    const conn: LogicConnection = {
      id: `conn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fromNodeId,
      fromOutput,
      toNodeId,
      toInput,
    }
    g.connections.push(conn)
    this.saveGraphs()
    sound.playUiClick()
    achievements.unlock('logic_architect')
    return conn
  }

  public removeConnection(connId: string): void {
    this.activeGraph.connections = this.activeGraph.connections.filter(c => c.id !== connId)
    this.saveGraphs()
  }

  /**
   * Evaluates logic network execution for a specific event
   */
  public triggerEvent(eventType: string, context?: any): void {
    for (const g of this.graphs) {
      if (!g.enabled) continue

      const eventNodes = g.nodes.filter(n => n.type === eventType)
      for (const evNode of eventNodes) {
        this.executeDownstream(g, evNode.id, 'exec', context)
      }
    }
  }

  private executeDownstream(g: LogicGraph, nodeId: string, outputPort: string, context?: any): void {
    const conns = g.connections.filter(c => c.fromNodeId === nodeId && c.fromOutput === outputPort)
    for (const conn of conns) {
      const targetNode = g.nodes.find(n => n.id === conn.toNodeId)
      if (!targetNode) continue

      if (targetNode.category === 'condition') {
        // Evaluate condition
        let condResult = true
        if (targetNode.type === 'cond_has_item') {
          condResult = true // Simulated pass
        } else if (targetNode.type === 'cond_time_of_day') {
          condResult = true
        }
        const port = condResult ? 'true' : 'false'
        this.executeDownstream(g, targetNode.id, port, context)
      } else if (targetNode.category === 'action') {
        // Execute Action
        this.performAction(targetNode, context)
        this.executeDownstream(g, targetNode.id, 'done', context)
      }
    }
  }

  private performAction(node: LogicNode, _context?: any): void {
    if (node.type === 'act_broadcast_msg') {
      const msg = node.params.message || '全息節點規則觸發'
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hud-status', { detail: msg }))
      }
    } else if (node.type === 'act_play_sound') {
      sound.playFanfare()
    } else if (node.type === 'act_call_airdrop') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('airdrop-dispatched', { detail: { target: { x: 0, y: 10, z: 0 } } }))
      }
    }
  }

  public reset(): void {
    this.graphs = [JSON.parse(JSON.stringify(DEFAULT_PRESET_GRAPH))]
    this.activeGraphId = 'graph_welcome'
  }

  private loadGraphs(): void {
    if (typeof localStorage === 'undefined') {
      this.reset()
      return
    }
    try {
      const data = localStorage.getItem('cyber_visual_logic_graphs')
      if (data) {
        this.graphs = JSON.parse(data)
      } else {
        this.reset()
      }
    } catch {
      this.reset()
    }
  }

  public saveGraphs(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('cyber_visual_logic_graphs', JSON.stringify(this.graphs))
    } catch {
      // Ignored
    }
  }
}

export const visualNodeEditor = new VisualNodeEditorEngine()
