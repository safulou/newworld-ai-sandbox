export type BlockType =
  | 'air'
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'leaves'
  | 'sand'
  | 'water'
  | 'brick'
  | 'glass'
  | 'plank'
  | 'snow'

export interface Block {
  type: BlockType
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Chunk {
  cx: number
  cz: number
  blocks: Record<string, BlockType>
}

export interface WorldData {
  name: string
  version: string
  chunks: Chunk[]
  spawnPoint: Vec3
}

export interface BlockPlacement {
  x: number
  y: number
  z: number
  type: BlockType
}

export type DSLCommand =
  | { type: 'place_block'; position: [number, number, number]; material: BlockType }
  | { type: 'box'; from: [number, number, number]; to: [number, number, number]; material: BlockType; hollow?: boolean }
  | { type: 'cylinder'; center: [number, number, number]; radius: number; height: number; material: BlockType; hollow?: boolean }
  | { type: 'pyramid'; base: [number, number, number]; size: number; height: number; material: BlockType; hollow?: boolean }
  | { type: 'sphere'; center: [number, number, number]; radius: number; material: BlockType; hollow?: boolean }
  | { type: 'stairs'; from: [number, number, number]; steps: number; direction: '+x' | '-x' | '+z' | '-z'; material: BlockType }
  | { type: 'scatter'; center: [number, number, number]; radius: number; count: number; template: 'tree' | 'rock' | 'column' | 'lamp' }

export interface BuildAction {
  type: 'place_block'
  position: [number, number, number]
  material: BlockType
}

export interface AIBuildResponse {
  description: string
  commands?: DSLCommand[]
  actions: BuildAction[]
}

export interface NPCData {
  id: string
  name: string
  role: string
  position: Vec3
  systemPrompt: string
}

export interface PlotData {
  cx: number
  cz: number
  ownerId: string
  plotName: string
  claimedAt: string
}
