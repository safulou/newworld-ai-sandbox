/**
 * NewWorld AI Sandbox - Xenobiology Genome Forge & Bio-Mutagen Lab Engine
 * 
 * Implements:
 * - Alien DNA Sequencing, Gene Splicing & Synthetic Organism Incubator
 * - 4 Exotic Alien Gene Strands (Bioluminescence, Cryo-Endolith, Crystalline Chitin, Psionic Void Gland)
 * - 4 Synthetic Hybrid Organism Blueprints (Neon Leviathan Spawn, Crystal Hexapod, Void Manta, Astral Psionic Hound)
 * - Gene Stability index (0% ~ 100%), Bio-Catalyst Mutagen economy, Incubation cycle
 * - Pure Web Audio procedural audio synthesis (Centrifuge whirl, gene splicing laser click, incubator bubbling, breakthrough fanfare)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type GeneStrandId = 'bioluminescent_strand' | 'cryo_endolith_strand' | 'crystalline_chitin' | 'psionic_void_gland'

export interface GeneStrand {
  id: GeneStrandId
  name: string
  potency: number
  stabilityMod: number
  catalystCost: number
  description: string
  color: string
}

export type OrganismId = 'neon_leviathan_spawn' | 'crystal_hexapod' | 'void_manta' | 'astral_psionic_hound'

export interface OrganismBlueprint {
  id: OrganismId
  name: string
  speciesType: 'Aquatic Bio-Mech' | 'Silicon Construct' | 'Void Glider' | 'Psionic Beast'
  requiredStrands: GeneStrandId[]
  isSynthesized: boolean
  combatBuff: string
  utilityPerk: string
  color: string
  description: string
}

export interface GenomeStats {
  bioCatalystsCount: number
  activeOrganismsCount: number
  incubatorProgress: number // 0 ~ 100%
  activeIncubatingOrganism: OrganismId | null
  currentGeneStability: number // 0 ~ 100%
  statusMessage: string
}

export const GENE_STRANDS: Record<GeneStrandId, GeneStrand> = {
  bioluminescent_strand: {
    id: 'bioluminescent_strand',
    name: '發光生物發色團 (Bioluminescent Lumiphore)',
    potency: 85,
    stabilityMod: +10,
    catalystCost: 35,
    description: '源自深海深淵水母的螢光發光蛋白質，能在黑暗太空中發散炫目霓虹輝光。',
    color: '#00e5ff'
  },
  cryo_endolith_strand: {
    id: 'cryo_endolith_strand',
    name: '極限低溫耐性孢子 (Cryo-Adapted Endolith)',
    potency: 92,
    stabilityMod: -5,
    catalystCost: 50,
    description: '能在接近絕對零度（3K）的真空彗星冰層中休眠存活，極致強化生物外殼抗輻射性。',
    color: '#00ff88'
  },
  crystalline_chitin: {
    id: 'crystalline_chitin',
    name: '矽基晶體幾丁裝甲 (Crystalline Chitin Carapace)',
    potency: 95,
    stabilityMod: -12,
    catalystCost: 65,
    description: '由時間晶體與矽酸鹽聚合交錯的超硬生物幾丁質，物理與動能防禦強化 +150。',
    color: '#ff9100'
  },
  psionic_void_gland: {
    id: 'psionic_void_gland',
    name: '虛空心靈感知腺體 (Void Psionic Gland)',
    potency: 99,
    stabilityMod: -18,
    catalystCost: 80,
    description: '能捕捉暗物質微震的心靈感知器官，賦予生物短距次元閃爍與全域心靈感應力場。',
    color: '#bd00ff'
  }
}

export const ORGANISM_BLUEPRINTS: Record<OrganismId, OrganismBlueprint> = {
  neon_leviathan_spawn: {
    id: 'neon_leviathan_spawn',
    name: '賽博發光幼體利維坦 (Neon Leviathan Hatchling)',
    speciesType: 'Aquatic Bio-Mech',
    requiredStrands: ['bioluminescent_strand', 'cryo_endolith_strand'],
    isSynthesized: true,
    combatBuff: '水下深潛衝刺速度 +40%',
    utilityPerk: '周圍 30m 範圍自動發散霓虹生物照明',
    color: '#00e5ff',
    description: '體型精緻但具備巨獸基因的幼年利維坦，在水域與真空中暢行無阻。'
  },
  crystal_hexapod: {
    id: 'crystal_hexapod',
    name: '矽基晶核工程巨蛛 (Crystal Hexapod Worker)',
    speciesType: 'Silicon Construct',
    requiredStrands: ['cryo_endolith_strand', 'crystalline_chitin'],
    isSynthesized: false,
    combatBuff: '近戰抗擊打吸收 60% 物理傷害',
    utilityPerk: '採礦時 30% 機率雙倍產出稀有水晶',
    color: '#ff9100',
    description: '六足矽基晶體節肢生物，裝配高頻震動螯肢，是天生的採礦與建築伴侶。'
  },
  void_manta: {
    id: 'void_manta',
    name: '虛空次元穿梭蝠鱝 (Void Rift Manta)',
    speciesType: 'Void Glider',
    requiredStrands: ['bioluminescent_strand', 'psionic_void_gland'],
    isSynthesized: false,
    combatBuff: '空中滑翔飛行速度 +65%',
    utilityPerk: '每 30 秒自動觸發一次短程微型次元閃爍',
    color: '#00ff88',
    description: '如星空幻影般縹緲的巨型飛幔，能在引力異常區與暗物質裂隙間輕盈滑翔。'
  },
  astral_psionic_hound: {
    id: 'astral_psionic_hound',
    name: '星界突變靈能戰犬 (Astral Psionic Alpha Hound)',
    speciesType: 'Psionic Beast',
    requiredStrands: ['crystalline_chitin', 'psionic_void_gland'],
    isSynthesized: false,
    combatBuff: '全武器與獠牙攻擊附加靈能破甲',
    utilityPerk: '鎖定世界 Boss 主動發動心靈咆哮致盲 3 秒',
    color: '#bd00ff',
    description: '結合幾丁重甲與心靈共振腺體的終極伴隨戰鬥獸，忠誠而極度致命。'
  }
}

export class XenobiologyForgeEngine {
  public strands: Record<GeneStrandId, GeneStrand>
  public blueprints: Record<OrganismId, OrganismBlueprint>
  public stats: GenomeStats = {
    bioCatalystsCount: 180,
    activeOrganismsCount: 1,
    incubatorProgress: 0,
    activeIncubatingOrganism: null,
    currentGeneStability: 92,
    statusMessage: '基因拼接培養艙已滅菌在線，DNA 雙螺旋重組儀待命中。'
  }

  private audioCtx: AudioContext | null = null

  constructor() {
    this.strands = JSON.parse(JSON.stringify(GENE_STRANDS))
    this.blueprints = JSON.parse(JSON.stringify(ORGANISM_BLUEPRINTS))
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

  // ── Incubation Controls ────────────────────────────────────────────────────
  public startIncubation(organismId: OrganismId): boolean {
    const bp = this.blueprints[organismId]
    if (!bp || bp.isSynthesized) return false
    if (this.stats.activeIncubatingOrganism !== null) return false

    // Calculate total catalyst cost
    let totalCost = 0
    bp.requiredStrands.forEach(sId => {
      totalCost += this.strands[sId].catalystCost
    })

    if (this.stats.bioCatalystsCount < totalCost) {
      this.stats.statusMessage = `⚠️ 生物誘變催化劑不足 (需 ${totalCost} 點)！`
      return false
    }

    this.stats.bioCatalystsCount -= totalCost
    this.stats.activeIncubatingOrganism = organismId
    this.stats.incubatorProgress = 0

    // Compute stability
    let baseStability = 100
    bp.requiredStrands.forEach(sId => {
      baseStability += this.strands[sId].stabilityMod
    })
    this.stats.currentGeneStability = Math.max(50, Math.min(100, baseStability))

    this.stats.statusMessage = `🧬 [${bp.name}] 基因拼接開始！離心培育艙已注入羊水微胞。`
    this.playCentrifugeSound()
    this.saveState()
    return true
  }

  public fastForwardIncubation(deltaProgress: number = 35): void {
    if (!this.stats.activeIncubatingOrganism) return

    this.stats.incubatorProgress = Math.min(100, this.stats.incubatorProgress + deltaProgress)
    this.playSplicingClickSound()

    if (this.stats.incubatorProgress >= 100) {
      this.completeIncubation()
    } else {
      this.stats.statusMessage = `⚡ 基因重組推進中... 培育進度: ${Math.round(this.stats.incubatorProgress)}%`
      this.saveState()
    }
  }

  private completeIncubation(): void {
    if (!this.stats.activeIncubatingOrganism) return

    const bp = this.blueprints[this.stats.activeIncubatingOrganism]
    bp.isSynthesized = true
    this.stats.activeOrganismsCount += 1
    this.stats.statusMessage = `🎉 恭喜！外星合成生物 [${bp.name}] 破卵誕生！解鎖特性：${bp.combatBuff}`

    this.stats.activeIncubatingOrganism = null
    this.stats.incubatorProgress = 100

    // Achievement
    achievements.trackProgress('genome_architect', 1)

    this.playBirthFanfare()
    this.saveState()
  }

  public harvestBioCatalyst(amount: number = 40): void {
    this.stats.bioCatalystsCount += amount
    this.stats.statusMessage = `🧪 從水耕溫室與深淵菌毯中萃取了 ${amount} 點生物誘變催化劑。`
    this.saveState()
  }

  // ── Procedural Web Audio Sound Synthesis ───────────────────────────────────
  public playCentrifugeSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.6)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playSplicingClickSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, now)
    osc.frequency.setValueAtTime(2400, now + 0.05)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  public playBirthFanfare(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50] // C Major fanfare
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.08
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.22, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_xenobiology_forge', JSON.stringify({
        stats: this.stats,
        blueprints: this.blueprints,
        strands: this.strands
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_xenobiology_forge')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.blueprints) {
          this.blueprints = parsed.blueprints
        }
        if (parsed.strands) {
          this.strands = parsed.strands
        }
      }
    } catch { /* ignore */ }
  }
}

export const xenobiologyForge = new XenobiologyForgeEngine()
