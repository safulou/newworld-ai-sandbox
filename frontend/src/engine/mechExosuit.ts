/**
 * NewWorld AI Sandbox - Leviathan Bio-Mechanical Exosuit Crafting Engine
 * 
 * Implements:
 * - 4 modular exosuit subsystems (Bio-Core, Superconductor Plating, Tri-Thrusters, Railgun)
 * - 3 flight/mobility modes (Grounded Walk, Anti-Gravity Hover Flight, Deep-Sea Supercavitation)
 * - Tactical abilities: Overdrive Booster Sprint, Twin Shoulder Railgun, Energy Shield Emitter
 * - Forging mechanics utilizing drops from Leviathan Boss, Abyssal Trench, and Cosmic Stardust
 * - Pure Web Audio procedural audio synthesis (Servo whine, thruster blast, railgun sonic crack)
 * - LocalStorage state & Meta-universe achievement integration
 */

import { achievements } from './achievements'

export type ExosuitMode = 'grounded' | 'hover_flight' | 'supercavitation'

export interface ExosuitModule {
  id: string
  name: string
  slot: 'core' | 'plating' | 'thrusters' | 'weapons'
  tier: number
  maxTier: number
  bonusHP: number
  speedMultiplier: number
  energyCapacity: number
  description: string
  color: string
}

export interface ExosuitMaterials {
  bioCores: number            // From Leviathan Boss
  superconductorPlates: number // From Abyssal Trench / Leviathan
  stardustOre: number          // From Meteorites
  credits: number
}

export interface ExosuitStats {
  mode: ExosuitMode
  isActive: boolean
  energy: number             // 0 to 100%
  maxEnergy: number
  shieldHP: number           // 0 to 800 HP
  maxShieldHP: number
  isOverdriving: boolean
  overdriveTimer: number     // 3 seconds burst
  railgunCooldown: number    // seconds
  totalDistanceTraveled: number
  totalKills: number
}

export const DEFAULT_MODULES: ExosuitModule[] = [
  {
    id: 'mod_core',
    name: '利維坦生化微胞裂變核心 (Leviathan Bio-Core)',
    slot: 'core',
    tier: 1,
    maxTier: 4,
    bonusHP: 150,
    speedMultiplier: 1.15,
    energyCapacity: 100,
    description: '汲取古代深海巨獸生物電漿，提供源源不絕的超載輸出。',
    color: '#00ffff',
  },
  {
    id: 'mod_plating',
    name: '深淵超導金屬外骨骼 (Abyssal Superconductor Shell)',
    slot: 'plating',
    tier: 1,
    maxTier: 4,
    bonusHP: 350,
    speedMultiplier: 1.0,
    energyCapacity: 50,
    description: '抵禦 200 Bar 極限深海水壓與高能脈衝雷射衝擊。',
    color: '#ff00aa',
  },
  {
    id: 'mod_thrusters',
    name: '三棲超空泡推進器 (Tri-Environment Cavitation Thrusters)',
    slot: 'thrusters',
    tier: 1,
    maxTier: 4,
    bonusHP: 80,
    speedMultiplier: 1.45,
    energyCapacity: 80,
    description: '在陸地反重力懸浮、在大氣層噴氣飛行、在水下形成超空泡氣膜無阻穿梭。',
    color: '#00ff88',
  },
  {
    id: 'mod_weapons',
    name: '雙聯肩射電漿軌道砲 (Twin Shoulder Plasma Railguns)',
    slot: 'weapons',
    tier: 1,
    maxTier: 4,
    bonusHP: 100,
    speedMultiplier: 1.05,
    energyCapacity: 60,
    description: '以音速 8 倍發射重金屬電漿貫通彈，對首領造成毀滅打擊。',
    color: '#ffaa00',
  },
]

export class MechExosuitEngine {
  public modules: ExosuitModule[] = JSON.parse(JSON.stringify(DEFAULT_MODULES))
  public materials: ExosuitMaterials = {
    bioCores: 2,
    superconductorPlates: 6,
    stardustOre: 45,
    credits: 3500,
  }

  public stats: ExosuitStats = {
    mode: 'grounded',
    isActive: false,
    energy: 100,
    maxEnergy: 100,
    shieldHP: 400,
    maxShieldHP: 400,
    isOverdriving: false,
    overdriveTimer: 0,
    railgunCooldown: 0,
    totalDistanceTraveled: 0,
    totalKills: 0,
  }

  public logs: string[] = ['[機甲中樞] 利維坦生化機械外骨骼已裝載完畢，待命中。']
  private audioCtx: AudioContext | null = null

  constructor() {
    this.loadState()
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public addLog(msg: string): void {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false })
    this.logs.unshift(`[${time}] ${msg}`)
    if (this.logs.length > 50) this.logs.pop()
  }

  public toggleEquip(): boolean {
    this.stats.isActive = !this.stats.isActive
    if (this.stats.isActive) {
      this.addLog('【外骨骼啟動】生化裝甲神經接駁就緒！防禦與移動速度大幅飆升！')
      this.playSuitStartup()
      achievements.unlock('exosuit_titan')
    } else {
      this.stats.mode = 'grounded'
      this.addLog('【外骨骼收折】卸載機甲外裝，切換為標準開拓者防護服模式。')
    }
    this.saveState()
    return this.stats.isActive
  }

  public setMode(mode: ExosuitMode): void {
    if (!this.stats.isActive) return
    this.stats.mode = mode
    this.addLog(`[姿態切換] 機甲轉換為【${this.getModeLabel(mode)}】。`)
    this.playThrusterBoost()
    this.saveState()
  }

  public activateOverdrive(): { success: boolean; message: string } {
    if (!this.stats.isActive) return { success: false, message: '請先裝備外骨骼套裝' }
    if (this.stats.energy < 30) return { success: false, message: '電容能量不足 (需 30%)' }
    if (this.stats.isOverdriving) return { success: false, message: '超載衝刺進行中' }

    this.stats.energy -= 30
    this.stats.isOverdriving = true
    this.stats.overdriveTimer = 3.5
    this.addLog('⚡【超載推進】生化核心極限過載！速度 +200%，外殼護盾獲得絕對抗性！')
    this.playThrusterBoost()
    this.saveState()
    return { success: true, message: '超載爆發啟動！' }
  }

  public fireRailgun(): { success: boolean; message: string } {
    if (!this.stats.isActive) return { success: false, message: '請先裝備外骨骼套裝' }
    if (this.stats.railgunCooldown > 0) return { success: false, message: `冷卻中 (${this.stats.railgunCooldown.toFixed(1)}s)` }
    if (this.stats.energy < 15) return { success: false, message: '能量不足' }

    this.stats.energy -= 15
    this.stats.railgunCooldown = 3.0
    const dmg = 450 + Math.round(Math.random() * 120)
    this.stats.totalKills++

    this.addLog(`💥【電漿軌道砲開火】雙聯發射高超音速電磁貫通彈！造成 ${dmg} 點重裝甲爆破傷害！`)
    this.playRailgunFire()
    this.saveState()
    return { success: true, message: `軌道砲命中！造成 ${dmg} 點傷害。` }
  }

  public forgeModule(moduleId: string): { success: boolean; message: string } {
    const mod = this.modules.find(m => m.id === moduleId)
    if (!mod) return { success: false, message: '找不到指定模組' }
    if (mod.tier >= mod.maxTier) return { success: false, message: '已達最高鍛造階級' }

    const plateReq = mod.tier * 2
    const stardustReq = mod.tier * 15

    if (this.materials.superconductorPlates < plateReq || this.materials.stardustOre < stardustReq) {
      return { success: false, message: `材料不足！需超導板 x${plateReq}、星塵 x${stardustReq}。` }
    }

    this.materials.superconductorPlates -= plateReq
    this.materials.stardustOre -= stardustReq
    mod.tier++
    mod.bonusHP += 120
    mod.speedMultiplier += 0.1
    this.stats.maxShieldHP += 120
    this.stats.shieldHP = this.stats.maxShieldHP

    this.addLog(`⚒️【鍛造完成】${mod.name} 升級至 Tier ${mod.tier}！機甲護盾與動力進一步躍升。`)
    this.playSuitStartup()
    achievements.unlock('exosuit_titan')
    this.saveState()
    return { success: true, message: `${mod.name} 鍛造升級成功！` }
  }

  public getModeLabel(mode: ExosuitMode): string {
    switch (mode) {
      case 'grounded': return '地面機動模式 (Grounded)'
      case 'hover_flight': return '反重力高空懸浮 (Hover Flight)'
      case 'supercavitation': return '深海超空泡極速穿梭 (Supercavitation)'
    }
  }

  // ── Engine Loop Update ──────────────────────────────────────────────────────
  public update(delta: number): void {
    if (delta <= 0) return

    // Cooldown and overdrive timers
    if (this.stats.railgunCooldown > 0) this.stats.railgunCooldown = Math.max(0, this.stats.railgunCooldown - delta)
    if (this.stats.isOverdriving) {
      this.stats.overdriveTimer = Math.max(0, this.stats.overdriveTimer - delta)
      if (this.stats.overdriveTimer <= 0) {
        this.stats.isOverdriving = false
        this.addLog('超載噴氣結束，核心恢復常態散熱。')
      }
    }

    // Energy trickle recharge
    if (this.stats.energy < this.stats.maxEnergy && !this.stats.isOverdriving) {
      this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + delta * 6)
    }

    // Shield trickle recharge
    if (this.stats.shieldHP < this.stats.maxShieldHP) {
      this.stats.shieldHP = Math.min(this.stats.maxShieldHP, this.stats.shieldHP + delta * 15)
    }
  }

  // ── Procedural Web Audio Synthesis ──────────────────────────────────────────
  public playSuitStartup(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Ascending servo frequency sweep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playThrusterBoost(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.4)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  public playRailgunFire(): void {
    const ctx = this.getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // High snap + sub boom
    const snap = ctx.createOscillator()
    const snapGain = ctx.createGain()
    snap.type = 'square'
    snap.frequency.setValueAtTime(2800, now)
    snap.frequency.exponentialRampToValueAtTime(80, now + 0.2)

    snapGain.gain.setValueAtTime(0.4, now)
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    snap.connect(snapGain)
    snapGain.connect(ctx.destination)
    snap.start(now)
    snap.stop(now + 0.2)

    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(120, now)
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.6)

    subGain.gain.setValueAtTime(0.5, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    sub.connect(subGain)
    subGain.connect(ctx.destination)
    sub.start(now)
    sub.stop(now + 0.6)
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('nw_mech_exosuit')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.stats) Object.assign(this.stats, parsed.stats)
        if (parsed.materials) Object.assign(this.materials, parsed.materials)
        if (parsed.modules && Array.isArray(parsed.modules)) {
          for (const m of parsed.modules) {
            const match = this.modules.find(x => x.id === m.id)
            if (match) {
              match.tier = m.tier ?? match.tier
              match.bonusHP = m.bonusHP ?? match.bonusHP
            }
          }
        }
      }
    } catch {
      // Ignore load error
    }
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const payload = {
        stats: {
          isActive: this.stats.isActive,
          mode: this.stats.mode,
          totalDistanceTraveled: this.stats.totalDistanceTraveled,
          totalKills: this.stats.totalKills,
        },
        materials: this.materials,
        modules: this.modules.map(m => ({ id: m.id, tier: m.tier, bonusHP: m.bonusHP })),
      }
      localStorage.setItem('nw_mech_exosuit', JSON.stringify(payload))
    } catch {
      // Ignore save error
    }
  }
}

export const mechExosuit = new MechExosuitEngine()
