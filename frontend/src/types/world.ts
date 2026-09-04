export type BlockType =
  // Nature & Earth
  | 'air'
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'leaves'
  | 'sand'
  | 'water'
  | 'snow'
  | 'ice'
  | 'mud'
  | 'clay'
  | 'gravel'
  | 'magma'
  | 'obsidian'
  | 'amethyst'
  | 'emerald'
  | 'ruby'
  | 'gold_ore'
  | 'diamond_block'
  | 'flower_rose'
  | 'flower_dandelion'
  | 'mushroom_glow'
  | 'bamboo'
  | 'cactus'
  | 'vine'
  // Construction & Architecture
  | 'brick'
  | 'glass'
  | 'plank'
  | 'concrete'
  | 'marble'
  | 'basalt'
  | 'iron_block'
  | 'copper'
  | 'cyber_plating'
  | 'solar_panel'
  | 'hologram_glass'
  | 'mirror'
  // Sci-Fi & Cyber Neon
  | 'neon_cyan'
  | 'neon_magenta'
  | 'neon_yellow'
  | 'neon_green'
  | 'neon_orange'
  | 'neon_purple'
  | 'matrix_grid'
  | 'quantum_core'
  | 'plasma_containment'
  | 'warp_conduit'
  // Interactive & Logic Systems
  | 'wire_off'
  | 'wire_on'
  | 'logic_gate_and'
  | 'logic_gate_or'
  | 'logic_gate_not'
  | 'power_source'
  | 'repeater'
  | 'lever'
  | 'pressure_plate'
  | 'sensor_proximity'
  | 'jump_pad'
  | 'teleporter'
  | 'tnt'
  | 'light_emitter'

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
  title: string
  avatarColor: number
  position: Vec3
  systemPrompt: string
  dialogueLines: string[]
}

export interface PlotData {
  cx: number
  cz: number
  ownerId: string
  plotName: string
  claimedAt: string
}

export type ToolType =
  | 'pickaxe'
  | 'wand'
  | 'gravity_gun'
  | 'palette_brush'
  | 'blaster'
  | 'ruler'

export type GameMode = 'creative' | 'survival' | 'parkour'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  category: 'building' | 'exploration' | 'scifi' | 'mastery'
}

export interface Quest {
  id: string
  title: string
  giver: string
  description: string
  reward: string
  progress: number
  goal: number
  completed: boolean
}
