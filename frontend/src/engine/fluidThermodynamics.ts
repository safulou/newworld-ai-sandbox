import { sound } from './audio'
import { achievements } from './achievements'

export type ThermalFluidType = 'water' | 'lava' | 'steam' | 'cryo_coolant' | 'none'

export interface ThermalCell {
  x: number
  y: number
  z: number
  temperatureC: number
  fluidType: ThermalFluidType
}

export interface FusionReactorCore {
  isIgnited: boolean
  coreTempC: number
  targetTempC: number
  powerOutputMw: number
  coolantFlowLps: number
  containmentFieldIntegrity: number // 0 to 100%
  controlRodsPercent: number // 0% = full power, 100% = full dampening
  steamPressureKpa: number
  isMeltdownWarning: boolean
  isScrammed: boolean
}

export class FluidThermodynamicsEngine {
  public reactor: FusionReactorCore = {
    isIgnited: false,
    coreTempC: 25,
    targetTempC: 25,
    powerOutputMw: 0,
    coolantFlowLps: 150,
    containmentFieldIntegrity: 100,
    controlRodsPercent: 100,
    steamPressureKpa: 101.3,
    isMeltdownWarning: false,
    isScrammed: true,
  }

  public thermalCells: Map<string, ThermalCell> = new Map()
  public turbineRpm: number = 0
  public steamPowerKw: number = 0

  constructor() {
    this.initDefaultCells()
    this.loadState()
  }

  private initDefaultCells(): void {
    // Default sample thermal junctions
    this.setCell(0, 4, 0, 1200, 'lava')
    this.setCell(1, 4, 0, 20, 'water')
    this.setCell(0, 4, 1, -196, 'cryo_coolant')
  }

  public setCell(x: number, y: number, z: number, tempC: number, fluidType: ThermalFluidType): void {
    const key = `${x},${y},${z}`
    this.thermalCells.set(key, { x, y, z, temperatureC: tempC, fluidType })
  }

  public getCell(x: number, y: number, z: number): ThermalCell | undefined {
    return this.thermalCells.get(`${x},${y},${z}`)
  }

  public igniteReactor(): boolean {
    this.reactor.isIgnited = true
    this.reactor.isScrammed = false
    this.reactor.controlRodsPercent = 25
    sound.playWhoosh()
    achievements.unlock('fusion_engineer')
    this.saveState()
    return true
  }

  public scramReactor(): void {
    this.reactor.controlRodsPercent = 100
    this.reactor.isScrammed = true
    this.reactor.isMeltdownWarning = false
    sound.playExplosion()
    this.saveState()
  }

  public setControlRods(percent: number): void {
    this.reactor.controlRodsPercent = Math.max(0, Math.min(100, percent))
    this.saveState()
  }

  public setCoolantFlow(lps: number): void {
    this.reactor.coolantFlowLps = Math.max(0, Math.min(500, lps))
    this.saveState()
  }

  public update(dt: number): void {
    // 1. Reactor Thermal Dynamics
    if (this.reactor.isIgnited) {
      const fuelHeating = (100 - this.reactor.controlRodsPercent) * 28 * dt
      const coolingRate = this.reactor.coolantFlowLps * 0.18 * dt

      this.reactor.coreTempC += fuelHeating - coolingRate
      this.reactor.coreTempC = Math.max(25, this.reactor.coreTempC)

      // Power output scales with core temp and fuel burn
      if (this.reactor.controlRodsPercent < 100) {
        this.reactor.powerOutputMw = (this.reactor.coreTempC / 2200) * 850
      } else {
        this.reactor.powerOutputMw *= Math.pow(0.92, dt * 60)
      }

      // Steam pressure generation
      this.reactor.steamPressureKpa = 101.3 + (this.reactor.coreTempC / 100) * 45
      this.turbineRpm = Math.min(3600, (this.reactor.steamPressureKpa / 600) * 3600)
      this.steamPowerKw = (this.turbineRpm / 3600) * 450

      // Meltdown warning threshold (> 2600 °C)
      if (this.reactor.coreTempC > 2600) {
        this.reactor.isMeltdownWarning = true
        this.reactor.containmentFieldIntegrity = Math.max(0, this.reactor.containmentFieldIntegrity - 3 * dt)
      } else {
        this.reactor.isMeltdownWarning = false
        this.reactor.containmentFieldIntegrity = Math.min(100, this.reactor.containmentFieldIntegrity + 1 * dt)
      }

      if (this.reactor.coreTempC > 1500) {
        achievements.unlock('fusion_engineer')
      }
    } else {
      this.reactor.coreTempC = Math.max(25, this.reactor.coreTempC - 15 * dt)
      this.reactor.powerOutputMw *= Math.pow(0.9, dt * 60)
      this.turbineRpm *= Math.pow(0.95, dt * 60)
    }

    // 2. Cell phase transitions (Heat conduction between neighboring cells)
    for (const cell of this.thermalCells.values()) {
      if (cell.fluidType === 'water' && cell.temperatureC >= 100) {
        cell.fluidType = 'steam'
      } else if (cell.fluidType === 'steam' && cell.temperatureC < 95) {
        cell.fluidType = 'water'
      }
    }
  }

  public reset(): void {
    this.reactor = {
      isIgnited: false,
      coreTempC: 25,
      targetTempC: 25,
      powerOutputMw: 0,
      coolantFlowLps: 150,
      containmentFieldIntegrity: 100,
      controlRodsPercent: 100,
      steamPressureKpa: 101.3,
      isMeltdownWarning: false,
      isScrammed: true,
    }
    this.thermalCells.clear()
    this.initDefaultCells()
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('cyber_fluid_thermodynamics')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.reactor) {
          this.reactor = { ...this.reactor, ...parsed.reactor }
        }
      }
    } catch {
      // Ignored
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = {
        reactor: this.reactor,
      }
      localStorage.setItem('cyber_fluid_thermodynamics', JSON.stringify(data))
    } catch {
      // Ignored
    }
  }
}

export const fluidThermodynamics = new FluidThermodynamicsEngine()
