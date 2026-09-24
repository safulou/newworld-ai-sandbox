import { sound } from './audio'

export type TurboColor = 'cyan' | 'magenta' | 'gold' | 'lime' | 'violet'
export type ExhaustStyle = 'plasma' | 'warp' | 'spark'

export interface VehicleModConfig {
  turboColor: TurboColor
  exhaustStyle: ExhaustStyle
  overdriveBooster: boolean
  gravStabilizer: boolean
}

export const TURBO_HEX_MAP: Record<TurboColor, number> = {
  cyan: 0x00ffff,
  magenta: 0xff007f,
  gold: 0xffaa00,
  lime: 0x39ff14,
  violet: 0xa855f7,
}

export class VehicleModManager {
  public config: VehicleModConfig = {
    turboColor: 'cyan',
    exhaustStyle: 'plasma',
    overdriveBooster: false,
    gravStabilizer: false,
  }

  constructor() {
    this.loadFromStorage()
  }

  public setTurboColor(color: TurboColor): void {
    this.config.turboColor = color
    this.saveToStorage()
    sound.playUiClick()
    this.dispatchUpdate()
  }

  public setExhaustStyle(style: ExhaustStyle): void {
    this.config.exhaustStyle = style
    this.saveToStorage()
    sound.playUiClick()
    this.dispatchUpdate()
  }

  public toggleMod(mod: 'overdriveBooster' | 'gravStabilizer'): boolean {
    this.config[mod] = !this.config[mod]
    this.saveToStorage()
    sound.playUiClick()
    this.dispatchUpdate()
    return this.config[mod]
  }

  public getTurboHex(): number {
    return TURBO_HEX_MAP[this.config.turboColor] || 0x00ffff
  }

  /**
   * Calculates effective speed multiplier with overdrive mods applied
   */
  public getEffectiveSpeedMultiplier(baseMultiplier: number, isSprinting: boolean): number {
    let mult = baseMultiplier
    if (this.config.overdriveBooster) {
      mult += 0.5
      if (isSprinting) {
        mult += 0.4 // Overdrive burst
      }
    }
    return parseFloat(mult.toFixed(2))
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('nw_vehicle_mod', JSON.stringify(this.config))
    } catch {
      // ignore
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const data = localStorage.getItem('nw_vehicle_mod')
      if (data) {
        this.config = { ...this.config, ...JSON.parse(data) }
      }
    } catch {
      // ignore
    }
  }

  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('vehicle-mod-update', {
          detail: { ...this.config, turboHex: this.getTurboHex() },
        })
      )
    }
  }
}

export const vehicleMod = new VehicleModManager()
