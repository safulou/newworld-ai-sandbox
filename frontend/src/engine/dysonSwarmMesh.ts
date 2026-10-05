/**
 * NewWorld AI Sandbox - Dyson Swarm Mesh Collector & Solar Laser Relay Array Engine
 * 
 * Implements:
 * - Distributed orbital solar collector satellite mesh (Equatorial, Polar, Inclined Keplerian shells)
 * - Stellar luminosity harvesting (Sun luminosity ~3.828e26 W)
 * - 3 Focused Energy Beaming Targets:
 *   1. Planetary Collector Grid (Ground Power Direct Inflow)
 *   2. Warp Gate / Wormhole Capacitor (Accelerates space traversal charging)
 *   3. Orbital Industrial Forge (High-energy solar matter synthesis)
 * - Dynamic Orbital Mechanics:
 *   - Solar wind radiation pressure induces orbital misalignment (Alignment efficiency 0 - 100%)
 *   - Attitude thrusters re-calibration
 *   - Micrometeoroid wear & tear degradation
 *   - Nanite repair swarm automation
 * - Pure Web Audio procedural audio synthesis (Laser microwave beam hum & rocket launch burst)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type SwarmBeamTarget = 'planetary_grid' | 'warp_gate' | 'industrial_forge'

export type OrbitalShellType = 'equatorial' | 'polar' | 'inclined'

export interface OrbitalShell {
  id: OrbitalShellType
  name: string
  radiusAU: number
  mirrorCount: number
  inclinationDeg: number
  activeRays: number
  efficiencyPercent: number
}

export interface DysonSwarmStats {
  totalMirrors: number
  starLuminosityWatts: number // ~ 3.828e26 W
  harnessedPowerWatts: number
  harnessedPowerGW: number
  beamTarget: SwarmBeamTarget
  alignmentEfficiencyPercent: number
  naniteRepairLevel: number
  integrityPercent: number
  isBeaming: boolean
  totalMatterSynthesizedKg: number
  statusMessage: string
}

export const INITIAL_SHELLS: Record<OrbitalShellType, OrbitalShell> = {
  equatorial: {
    id: 'equatorial',
    name: '赤道共振集能環軌道 (Equatorial Ring Shell)',
    radiusAU: 0.45,
    mirrorCount: 120,
    inclinationDeg: 0,
    activeRays: 8,
    efficiencyPercent: 96
  },
  polar: {
    id: 'polar',
    name: '極地高緯覆蓋軌道 (Polar Swarm Shell)',
    radiusAU: 0.58,
    mirrorCount: 80,
    inclinationDeg: 88,
    activeRays: 6,
    efficiencyPercent: 92
  },
  inclined: {
    id: 'inclined',
    name: '傾角黃道交錯網 (Inclined Mesh Shell)',
    radiusAU: 0.72,
    mirrorCount: 50,
    inclinationDeg: 45,
    activeRays: 4,
    efficiencyPercent: 88
  }
}

export class DysonSwarmEngine {
  public stats: DysonSwarmStats = {
    totalMirrors: 250,
    starLuminosityWatts: 3.828e26,
    harnessedPowerWatts: 1.5e19,
    harnessedPowerGW: 15000000,
    beamTarget: 'planetary_grid',
    alignmentEfficiencyPercent: 95.0,
    naniteRepairLevel: 1,
    integrityPercent: 98.5,
    isBeaming: true,
    totalMatterSynthesizedKg: 1200,
    statusMessage: '戴森雲反射群集拓撲陣列運轉中，光能正聚焦傳輸至行星接收網。'
  }

  public shells: Record<OrbitalShellType, OrbitalShell> = JSON.parse(JSON.stringify(INITIAL_SHELLS))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.recalculatePower()
  }

  // ── Calculation ────────────────────────────────────────────────────────────
  public recalculatePower(): void {
    let totalMirrors = 0
    let weightedEfficiency = 0

    Object.values(this.shells).forEach(shell => {
      totalMirrors += shell.mirrorCount
      weightedEfficiency += shell.mirrorCount * (shell.efficiencyPercent / 100)
    })

    this.stats.totalMirrors = totalMirrors
    const avgShellEff = totalMirrors > 0 ? (weightedEfficiency / totalMirrors) : 0.8

    // Each mirror captures approximately 1.2e17 Watts of solar flux at ~0.5 AU
    const basePower = totalMirrors * 1.2e17 * avgShellEff
    const finalPower = basePower * (this.stats.alignmentEfficiencyPercent / 100) * (this.stats.integrityPercent / 100)

    this.stats.harnessedPowerWatts = finalPower
    this.stats.harnessedPowerGW = Math.floor(finalPower / 1e9)

    if (this.stats.totalMirrors >= 500) {
      achievements.unlock('dyson_swarm_architect')
    }

    this.saveState()
  }

  // ── Launch New Mirrors ─────────────────────────────────────────────────────
  public launchMirrors(shellType: OrbitalShellType, amount: number = 25): boolean {
    const shell = this.shells[shellType]
    if (!shell) return false

    shell.mirrorCount += amount
    this.stats.statusMessage = `🚀 成功發射並展開 ${amount} 面反射光帆進入【${shell.name}】！`
    this.playLaunchSound()
    this.recalculatePower()
    return true
  }

  // ── Set Energy Beaming Focus ───────────────────────────────────────────────
  public setBeamTarget(target: SwarmBeamTarget): void {
    this.stats.beamTarget = target
    const targetNames: Record<SwarmBeamTarget, string> = {
      planetary_grid: '行星地表高頻微波接收基站 (Power Grid)',
      warp_gate: '超空間星門躍遷充電重力井 (Warp Capacitor)',
      industrial_forge: '軌道太陽光壓物質合成鍛爐 (Matter Forge)'
    }
    this.stats.statusMessage = `已將戴森微波束聚焦目標切換至：${targetNames[target]}`
    this.playBeamPulse()
    this.saveState()
  }

  // ── Align Attitude Thrusters ───────────────────────────────────────────────
  public calibrateAlignment(): void {
    this.stats.alignmentEfficiencyPercent = 100.0
    this.stats.statusMessage = '微推力離子姿態發動機已啟動，所有光帆軌道共振角已恢復 100% 理想聚焦！'
    this.playBeamPulse()
    this.recalculatePower()
  }

  // ── Upgrade Nanite Repair Swarm ────────────────────────────────────────────
  public upgradeNaniteRepair(): boolean {
    if (this.stats.naniteRepairLevel >= 5) return false
    this.stats.naniteRepairLevel++
    this.stats.integrityPercent = 100
    this.stats.statusMessage = `奈米自律維護蜂群已升級至 Lv.${this.stats.naniteRepairLevel}，微隕石自動修復率大幅提升！`
    this.playBeamPulse()
    this.saveState()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isBeaming) return

    // Solar wind misalignment perturbation
    const drift = 0.08 * delta
    this.stats.alignmentEfficiencyPercent = Math.max(40, this.stats.alignmentEfficiencyPercent - drift)

    // Micrometeoroid wear & tear vs Nanite repair
    const wear = 0.04 * delta
    const repair = 0.03 * this.stats.naniteRepairLevel * delta
    this.stats.integrityPercent = Math.min(100, Math.max(30, this.stats.integrityPercent - wear + repair))

    // Synthesis effect if targeting forge
    if (this.stats.beamTarget === 'industrial_forge') {
      this.stats.totalMatterSynthesizedKg += (this.stats.totalMirrors * 0.05 * delta)
    }

    this.recalculatePower()
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

  public playLaunchSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.4)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.45)
  }

  public playBeamPulse(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_dyson_swarm_v1', JSON.stringify({
        stats: this.stats,
        shells: this.shells
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_dyson_swarm_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.shells) {
          this.shells = parsed.shells
        }
      }
    } catch { /* ignore */ }
  }
}

export const dysonSwarmEngine = new DysonSwarmEngine()
