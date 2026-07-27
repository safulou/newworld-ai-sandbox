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

export interface BuildAction {
  type: 'place_block'
  position: [number, number, number]
  material: BlockType
}

export interface AIBuildResponse {
  description: string
  actions: BuildAction[]
}

export interface NPCData {
  id: string
  name: string
  role: string
  position: Vec3
  systemPrompt: string
}
