/**
 * NewWorld AI Sandbox - Megastructure Ringworld Fabricator & Habitable Segment Engine
 * 
 * Implements:
 * - 1 AU radius megastructure orbital ring encircling the home star
 * - 4 Habitable Planetary Segments:
 *   1. Oceanic Segment (碧藍遠古深海洋板塊): Marine biosphere & atmospheric moisture
 *   2. Sky Archipelago Segment (浮空反重力群島板塊): Grav-repulsion islands & residential parks
 *   3. Megalopolis Segment (賽博蜂巢超巨都市板塊): Hyper-dense urban habitats & credits
 *   4. Glacial Superconductor Segment (極地低溫超導冰冠板塊): Cryogenic labs & superconductivity
 * - 4 Engineering Fabrication Phases:
 *   Phase 1: Super-Torus Ring Foundation (底層剛性超環骨架)
 *   Phase 2: 1,000 km Atmospheric Retention Walls (千公里大氣防散失外壁)
 *   Phase 3: Topsoil & Biosphere Genesis Seeding (地表土層生態播種)
 *   Phase 4: Counter-Rotating Day-Night Shadow Panels (對轉自律晝夜遮光板)
 * - Nanite Fabrication Swarms & Titanium-Carbon Composites investment
 * - Pure Web Audio procedural audio synthesis (Mega-clamp pneumatic latch & solar wind harmonic hum)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type RingSegmentId = 'oceanic' | 'archipelago' | 'megalopolis' | 'glacial'

export interface RingSegment {
  id: RingSegmentId
  name: string
  habitableAreaMillionKm2: number
  populationMillion: number
  powerOutputGW: number
  creditsPerSec: number
  phaseProgressPercent: number
  currentPhase: number // 1 to 4
  unlocked: boolean
  description: string
  icon: string
}

export interface RingworldStats {
  radiusAU: number // 1.0 AU (~149.6 million km)
  circumferenceMillionKm: number // ~940 million km
  widthKm: number // 1.6 million km
  totalHabitableAreaMillionKm2: number
  totalPopulationMillion: number
  totalPowerGW: number
  creditsPerSec: number
  overallConstructionPercent: number
  naniteFabricationSwarms: number
  isConstructing: boolean
  statusMessage: string
}

export const RING_SEGMENTS: Record<RingSegmentId, RingSegment> = {
  oceanic: {
    id: 'oceanic',
    name: '碧藍遠古深海洋板塊 (Oceanic Segment)',
    habitableAreaMillionKm2: 250,
    populationMillion: 45,
    powerOutputGW: 12000,
    creditsPerSec: 180,
    phaseProgressPercent: 100,
    currentPhase: 4,
    unlocked: true,
    description: '廣袤無垠的星際人造海洋，容納數以億計的深海生物與浮游微藻，為整個環帶輸送氧氣與水循環。',
    icon: '🌊'
  },
  archipelago: {
    id: 'archipelago',
    name: '浮空反重力群島板塊 (Sky Archipelago Segment)',
    habitableAreaMillionKm2: 180,
    populationMillion: 65,
    powerOutputGW: 18000,
    creditsPerSec: 260,
    phaseProgressPercent: 65,
    currentPhase: 3,
    unlocked: true,
    description: '懸浮於大氣中層的反重力浮島群，具備優雅的空中生態園區與滑翔航道。',
    icon: '🏝️'
  },
  megalopolis: {
    id: 'megalopolis',
    name: '賽博蜂巢超巨都市板塊 (Megalopolis Segment)',
    habitableAreaMillionKm2: 320,
    populationMillion: 180,
    powerOutputGW: 35000,
    creditsPerSec: 650,
    phaseProgressPercent: 40,
    currentPhase: 2,
    unlocked: true,
    description: '多層次立體垂直蜂巢都市，融合高密度開拓者居住區、商業中繼樞紐與量子金融中心。',
    icon: '🏙️'
  },
  glacial: {
    id: 'glacial',
    name: '極地低溫超導冰冠板塊 (Glacial Segment)',
    habitableAreaMillionKm2: 150,
    populationMillion: 20,
    powerOutputGW: 28000,
    creditsPerSec: 420,
    phaseProgressPercent: 15,
    currentPhase: 1,
    unlocked: false,
    description: '維持極端低溫的零阻超導冰原，座落著全環帶最頂尖的微觀物理與量子超弦實驗室。',
    icon: '❄️'
  }
}

export class RingworldFabricatorEngine {
  public stats: RingworldStats = {
    radiusAU: 1.0,
    circumferenceMillionKm: 940,
    widthKm: 1600000,
    totalHabitableAreaMillionKm2: 900,
    totalPopulationMillion: 310,
    totalPowerGW: 93000,
    creditsPerSec: 1510,
    overallConstructionPercent: 55.0,
    naniteFabricationSwarms: 4,
    isConstructing: true,
    statusMessage: '1 AU 巨型環形世界工程船塢運作中，各板塊工程蜂群持續施工。'
  }

  public segments: Record<RingSegmentId, RingSegment> = JSON.parse(JSON.stringify(RING_SEGMENTS))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.recalculateStats()
  }

  // ── Calculation ────────────────────────────────────────────────────────────
  public recalculateStats(): void {
    let totalArea = 0
    let totalPop = 0
    let totalPower = 0
    let totalCredits = 0
    let totalProgressSum = 0

    Object.values(this.segments).forEach(seg => {
      if (seg.unlocked) {
        const factor = (seg.currentPhase - 1 + seg.phaseProgressPercent / 100) / 4
        totalArea += seg.habitableAreaMillionKm2 * factor
        totalPop += seg.populationMillion * factor
        totalPower += seg.powerOutputGW * factor
        totalCredits += seg.creditsPerSec * factor
        totalProgressSum += (seg.currentPhase - 1) * 25 + seg.phaseProgressPercent * 0.25
      }
    })

    this.stats.totalHabitableAreaMillionKm2 = Math.floor(totalArea)
    this.stats.totalPopulationMillion = Math.floor(totalPop)
    this.stats.totalPowerGW = Math.floor(totalPower)
    this.stats.creditsPerSec = Math.floor(totalCredits)
    this.stats.overallConstructionPercent = parseFloat((totalProgressSum / 4).toFixed(1))

    if (this.stats.overallConstructionPercent >= 25) {
      this.segments.glacial.unlocked = true
    }

    if (this.stats.overallConstructionPercent >= 50) {
      achievements.unlock('ringworld_architect')
    }

    this.saveState()
  }

  // ── Advance Construction on Segment ────────────────────────────────────────
  public advanceSegment(segmentId: RingSegmentId): boolean {
    const seg = this.segments[segmentId]
    if (!seg || !seg.unlocked) return false

    if (seg.currentPhase >= 4 && seg.phaseProgressPercent >= 100) {
      this.stats.statusMessage = `板塊【${seg.name}】已全部竣工完備！`
      return false
    }

    seg.phaseProgressPercent += 25
    if (seg.phaseProgressPercent >= 100 && seg.currentPhase < 4) {
      seg.currentPhase++
      seg.phaseProgressPercent = 0
      this.stats.statusMessage = `🎉 板塊【${seg.name}】成功晉升至階段 ${seg.currentPhase}！`
      this.playPhaseUpSound()
    } else {
      this.stats.statusMessage = `奈米工程蜂群已投入施工，【${seg.name}】建造進度推進至 ${seg.phaseProgressPercent}%！`
      this.playClampSound()
    }

    this.recalculateStats()
    return true
  }

  // ── Upgrade Nanite Fabrication Swarms ──────────────────────────────────────
  public upgradeNaniteSwarms(): boolean {
    if (this.stats.naniteFabricationSwarms >= 10) return false
    this.stats.naniteFabricationSwarms++
    this.stats.statusMessage = `自律奈米建造蜂群已增擴至 ${this.stats.naniteFabricationSwarms} 隊，建造推進速度提升！`
    this.playClampSound()
    this.saveState()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isConstructing) return

    // Autonomous slow fabrication by nanite swarms
    const autoProgress = 0.05 * this.stats.naniteFabricationSwarms * delta

    Object.values(this.segments).forEach(seg => {
      if (seg.unlocked && (seg.currentPhase < 4 || seg.phaseProgressPercent < 100)) {
        seg.phaseProgressPercent += autoProgress
        if (seg.phaseProgressPercent >= 100 && seg.currentPhase < 4) {
          seg.currentPhase++
          seg.phaseProgressPercent = 0
        }
      }
    })

    this.recalculateStats()
  }

  // ── Web Audio Procedural Synthesis ─────────────────────────────────────────
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  public playClampSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  public playPhaseUpSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [261.63, 329.63, 392.00, 523.25] // C4-E4-G4-C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + idx * 0.08

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_ringworld_v1', JSON.stringify({
        stats: this.stats,
        segments: this.segments
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_ringworld_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.segments) {
          this.segments = parsed.segments
        }
      }
    } catch { /* ignore */ }
  }
}

export const ringworldFabricator = new RingworldFabricatorEngine()
