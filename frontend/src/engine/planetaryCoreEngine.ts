/**
 * NewWorld AI Sandbox - Planetary Core Dynamo & Super-Deep Geothermal Borehole Engine
 * 
 * Implements:
 * - Planetary Stratum Penetration:
 *   1. Crust (地殼岩石圈: 0 - 35 km)
 *   2. Upper Mantle (上部地函與軟流圈: 35 - 670 km)
 *   3. Lower Mantle (下部地函高壓矽酸鹽層: 670 - 2,890 km)
 *   4. Outer Liquid Core (外地核液態鐵鎳對流層: 2,890 - 5,150 km)
 * - Drill Bit Technologies:
 *   1. 碳化鎢超硬鑽頭 (Tungsten-Carbide)
 *   2. 鑽石石墨烯複合鑽頭 (Diamond-Graphene)
 *   3. 反物質等離子熔蝕錐 (Antimatter Plasma)
 *   4. 引力奇點微型隧道儀 (Graviton Singularity)
 * - Geodynamo Magnetic Amplification:
 *   Liquid iron-nickel convective dynamo boosts planetary magnetic shield against cosmic storms.
 * - Supercritical Fluid Geothermal Power Generation:
 *   Converts mantle & core heat to steady base-load megawatt power.
 * - Tectonic Stress & Magma Venting:
 *   Drilling creates seismic stress; periodic pulse venting prevents earthquakes and yields rare Core Crystals.
 * - Pure Web Audio procedural audio synthesis (Drill subterranean rumble & steam venting hiss)
 * - LocalStorage state persistence & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type PlanetaryStratumId = 'crust' | 'upper_mantle' | 'lower_mantle' | 'outer_core'

export interface PlanetaryStratum {
  id: PlanetaryStratumId
  name: string
  depthStartKm: number
  depthEndKm: number
  temperatureK: number
  pressureGPa: number
  unlocked: boolean
  powerBonusMW: number
}

export type DrillBitType = 'tungsten' | 'graphene' | 'plasma' | 'singularity'

export interface DrillBit {
  id: DrillBitType
  name: string
  drillingSpeedKmSec: number
  heatResistanceK: number
  costCredits: number
  level: number
}

export interface PlanetaryCoreStats {
  currentDepthKm: number
  targetStratum: PlanetaryStratumId
  coreTemperatureK: number
  geodynamoShieldPercent: number
  totalGeothermalPowerMW: number
  tectonicStressPercent: number
  coreCrystalsHarvested: number
  activeDrillBit: DrillBitType
  isDrilling: boolean
  seismicWarning: boolean
  statusMessage: string
}

export const STRATA: Record<PlanetaryStratumId, PlanetaryStratum> = {
  crust: {
    id: 'crust',
    name: '地殼岩石圈 (Lithosphere)',
    depthStartKm: 0,
    depthEndKm: 35,
    temperatureK: 800,
    pressureGPa: 1.2,
    unlocked: true,
    powerBonusMW: 2500
  },
  upper_mantle: {
    id: 'upper_mantle',
    name: '上地函與軟流圈 (Asthenosphere)',
    depthStartKm: 35,
    depthEndKm: 670,
    temperatureK: 2100,
    pressureGPa: 24,
    unlocked: false,
    powerBonusMW: 25000
  },
  lower_mantle: {
    id: 'lower_mantle',
    name: '下地函結晶矽酸鹽層 (Mesosphere)',
    depthStartKm: 670,
    depthEndKm: 2890,
    temperatureK: 3500,
    pressureGPa: 136,
    unlocked: false,
    powerBonusMW: 120000
  },
  outer_core: {
    id: 'outer_core',
    name: '外地核液態鐵鎳對流熔層 (Outer Liquid Core)',
    depthStartKm: 2890,
    depthEndKm: 5150,
    temperatureK: 5800,
    pressureGPa: 330,
    unlocked: false,
    powerBonusMW: 850000
  }
}

export const DRILL_BITS: Record<DrillBitType, DrillBit> = {
  tungsten: {
    id: 'tungsten',
    name: '碳化鎢重型衝擊鑽頭 (Tungsten Drill)',
    drillingSpeedKmSec: 0.15,
    heatResistanceK: 1500,
    costCredits: 5000,
    level: 1
  },
  graphene: {
    id: 'graphene',
    name: '奈米金剛石石墨烯鑽錐 (Diamond-Graphene)',
    drillingSpeedKmSec: 0.45,
    heatResistanceK: 3000,
    costCredits: 25000,
    level: 0
  },
  plasma: {
    id: 'plasma',
    name: '反物質超高溫等離子熔蝕鑽 (Antimatter Plasma)',
    drillingSpeedKmSec: 1.2,
    heatResistanceK: 5000,
    costCredits: 80000,
    level: 0
  },
  singularity: {
    id: 'singularity',
    name: '引力微奇點空泡鑽孔儀 (Graviton Singularity)',
    drillingSpeedKmSec: 3.5,
    heatResistanceK: 8000,
    costCredits: 200000,
    level: 0
  }
}

export class PlanetaryCoreEngine {
  public stats: PlanetaryCoreStats = {
    currentDepthKm: 12.5,
    targetStratum: 'crust',
    coreTemperatureK: 850,
    geodynamoShieldPercent: 65,
    totalGeothermalPowerMW: 3200,
    tectonicStressPercent: 18.0,
    coreCrystalsHarvested: 0,
    activeDrillBit: 'tungsten',
    isDrilling: true,
    seismicWarning: false,
    statusMessage: '超深地熱鑽井穩定運行中，正在貫穿地殼莫氏不連續面。'
  }

  public strata: Record<PlanetaryStratumId, PlanetaryStratum> = JSON.parse(JSON.stringify(STRATA))
  public drillBits: Record<DrillBitType, DrillBit> = JSON.parse(JSON.stringify(DRILL_BITS))

  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
    this.updateStratumStatus()
  }

  // ── Stratum & Depth Calculation ────────────────────────────────────────────
  public updateStratumStatus(): void {
    const depth = this.stats.currentDepthKm

    if (depth >= 35) this.strata.upper_mantle.unlocked = true
    if (depth >= 670) this.strata.lower_mantle.unlocked = true
    if (depth >= 2890) {
      this.strata.outer_core.unlocked = true
      achievements.unlock('core_dynamo_master')
    }

    // Determine current stratum
    if (depth < 35) {
      this.stats.targetStratum = 'crust'
      this.stats.coreTemperatureK = 400 + (depth / 35) * 600
    } else if (depth < 670) {
      this.stats.targetStratum = 'upper_mantle'
      this.stats.coreTemperatureK = 1000 + ((depth - 35) / 635) * 1500
    } else if (depth < 2890) {
      this.stats.targetStratum = 'lower_mantle'
      this.stats.coreTemperatureK = 2500 + ((depth - 670) / 2220) * 1500
    } else {
      this.stats.targetStratum = 'outer_core'
      this.stats.coreTemperatureK = 4000 + Math.min(2000, ((depth - 2890) / 2260) * 2000)
    }

    // Power generation from all unlocked strata
    let power = 0
    Object.values(this.strata).forEach(s => {
      if (s.unlocked) power += s.powerBonusMW
    })
    // Add current depth bonus
    power += depth * 12
    this.stats.totalGeothermalPowerMW = Math.floor(power)

    // Geodynamo shield reaches 100% at outer core
    this.stats.geodynamoShieldPercent = Math.min(100, Math.floor(45 + (depth / 2890) * 55))

    this.saveState()
  }

  // ── Upgrade / Select Drill Bit ─────────────────────────────────────────────
  public switchDrillBit(bitId: DrillBitType): boolean {
    const bit = this.drillBits[bitId]
    if (!bit) return false
    this.stats.activeDrillBit = bitId
    this.stats.statusMessage = `已裝備鑽具：【${bit.name}】`
    this.playRumbleSound()
    this.saveState()
    return true
  }

  public upgradeDrillBit(bitId: DrillBitType): boolean {
    const bit = this.drillBits[bitId]
    if (!bit) return false
    bit.level++
    bit.drillingSpeedKmSec *= 1.25
    this.stats.statusMessage = `鑽具【${bit.name}】已升級至 Lv.${bit.level}`
    this.playRumbleSound()
    this.saveState()
    return true
  }

  // ── Vent Tectonic Stress (Safe Seismic Relief) ─────────────────────────────
  public ventTectonicStress(): boolean {
    if (this.stats.tectonicStressPercent < 5) return false

    const vented = this.stats.tectonicStressPercent
    this.stats.tectonicStressPercent = 0
    this.stats.seismicWarning = false

    // Harvest volcanic core crystals proportional to vented stress
    const crystals = Math.max(1, Math.floor(vented / 12))
    this.stats.coreCrystalsHarvested += crystals

    this.stats.statusMessage = `💨 構造洩壓閥啟動成功！釋放 ${vented.toFixed(1)}% 板塊應力，凝結收穫 ${crystals} 枚深核結晶！`
    this.playVentingHiss()
    this.saveState()
    return true
  }

  // ── Game Loop Tick ─────────────────────────────────────────────────────────
  public update(delta: number): void {
    if (!this.stats.isDrilling) return

    const activeBit = this.drillBits[this.stats.activeDrillBit]
    const speed = (activeBit?.drillingSpeedKmSec ?? 0.1) * delta

    // Check if heat exceeds bit limit
    if (this.stats.coreTemperatureK > (activeBit?.heatResistanceK ?? 2000)) {
      this.stats.statusMessage = `⚠️ 警告：當前地層溫度超過【${activeBit.name}】耐受極限，鑽孔速度受限！`
    } else {
      this.stats.currentDepthKm = Math.min(5150, this.stats.currentDepthKm + speed)
    }

    // Seismic stress accumulation
    const stressGain = 0.25 * delta * (1 + (this.stats.currentDepthKm / 1000) * 0.2)
    this.stats.tectonicStressPercent = Math.min(100, this.stats.tectonicStressPercent + stressGain)

    if (this.stats.tectonicStressPercent >= 80) {
      this.stats.seismicWarning = true
    }

    // Uncontrolled tremor if hits 100%
    if (this.stats.tectonicStressPercent >= 100) {
      this.stats.tectonicStressPercent = 40
      this.stats.seismicWarning = false
      this.stats.statusMessage = '💥 突發未受控地函應力微震！地熱渦輪防護跳脫，臨時損失部分發電效能。'
    }

    this.updateStratumStatus()
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

  public playRumbleSound(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(55, now)
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.6)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playVentingHiss(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // White noise puff for steam/magma venting
    const bufferSize = ctx.sampleRate * 0.4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, now)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.4)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  // ── LocalStorage State Persistence ─────────────────────────────────────────
  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_planetary_core_v1', JSON.stringify({
        stats: this.stats,
        strata: this.strata,
        drillBits: this.drillBits
      }))
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_planetary_core_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) {
          this.stats = { ...this.stats, ...parsed.stats }
        }
        if (parsed.strata) {
          this.strata = parsed.strata
        }
        if (parsed.drillBits) {
          this.drillBits = parsed.drillBits
        }
      }
    } catch { /* ignore */ }
  }
}

export const planetaryCoreEngine = new PlanetaryCoreEngine()
