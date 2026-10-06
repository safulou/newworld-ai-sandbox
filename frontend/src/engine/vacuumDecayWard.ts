/**
 * vacuumDecayWard.ts
 * 暗能量真空衰變抵禦力場與超對稱相變防護天幕引擎
 * 模擬偽真空向真真空相變坍縮之光速膨脹泡泡，提供希格斯勢能調控與超對稱天幕防護
 */

import { achievementsManager } from './achievements'

function playAudioTone(freq: number, duration: number = 0.2, type: OscillatorType = 'sine'): void {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch { /* ignore */ }
}

function playNoiseBurst(duration: number = 0.2, volume: number = 0.15): void {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    noise.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
  } catch { /* ignore */ }
}

export interface SupersymmetricAnchor {
  id: string
  name: string
  field: string
  efficiencyBonus: number
  level: number
  costEssence: number
  description: string
}

export interface VacuumWardState {
  higgsFieldPotentialGeV: number // 基準 125.09 GeV
  fieldStabilityPercent: number // 0~100%
  decayBubbleRadiusKm: number // 泡泡半徑 (km)
  isDecayExpanding: boolean
  susyFieldStrengthPercent: number // 0~100%
  vacuumEssence: number // 超對稱真空精華
  totalIncursionsRepelled: number
  anchors: Record<string, SupersymmetricAnchor>
  lastTickTimestamp: number
}

const STORAGE_KEY = 'newworld_vacuum_decay_ward_v1'

const DEFAULT_ANCHORS: Record<string, SupersymmetricAnchor> = {
  anchor_electroweak: {
    id: 'anchor_electroweak',
    name: '電弱對稱超對稱錨點 (Electroweak Anchor)',
    field: '電弱統一場',
    efficiencyBonus: 0.15,
    level: 1,
    costEssence: 200,
    description: '穩定 W/Z 玻色子質量態，防禦電弱真空衰變'
  },
  anchor_superstring: {
    id: 'anchor_superstring',
    name: '超弦張力校準錨點 (Superstring Tension Anchor)',
    field: '10維超弦場',
    efficiencyBonus: 0.25,
    level: 1,
    costEssence: 450,
    description: '調節微觀超弦張力，平息膜相變微擾'
  },
  anchor_quark_color: {
    id: 'anchor_quark_color',
    name: '夸克色荷凝聚錨點 (Quark Condensate Anchor)',
    field: '量子色動力學場',
    efficiencyBonus: 0.35,
    level: 1,
    costEssence: 800,
    description: '強化強交互作用真空凝聚態，阻止膠子真空穿隧'
  },
  anchor_singularity: {
    id: 'anchor_singularity',
    name: '引力微奇點錨點 (Gravitational Singularity Anchor)',
    field: '量子引力幾何場',
    efficiencyBonus: 0.50,
    level: 1,
    costEssence: 1500,
    description: '以極微普朗克奇點鎖定局部時空度規，終極抵禦相變'
  }
}

class VacuumDecayWardEngine {
  private state: VacuumWardState = {
    higgsFieldPotentialGeV: 125.09,
    fieldStabilityPercent: 92.5,
    decayBubbleRadiusKm: 12500,
    isDecayExpanding: true,
    susyFieldStrengthPercent: 65.0,
    vacuumEssence: 350,
    totalIncursionsRepelled: 0,
    anchors: JSON.parse(JSON.stringify(DEFAULT_ANCHORS)),
    lastTickTimestamp: Date.now()
  }

  constructor() {
    this.loadState()
  }

  public getState(): VacuumWardState {
    return this.state
  }

  public get anchors(): Record<string, SupersymmetricAnchor> {
    return this.state.anchors
  }

  public get vacuumEssence(): number {
    return this.state.vacuumEssence
  }

  public get fieldStabilityPercent(): number {
    return this.state.fieldStabilityPercent
  }

  public get susyFieldStrengthPercent(): number {
    return this.state.susyFieldStrengthPercent
  }

  public get decayBubbleRadiusKm(): number {
    return this.state.decayBubbleRadiusKm
  }

  /**
   * 強化指定超對稱錨點
   */
  public reinforceAnchor(anchorId: string): boolean {
    const anchor = this.state.anchors[anchorId]
    if (!anchor) return false

    if (this.state.vacuumEssence < anchor.costEssence) {
      return false
    }

    this.state.vacuumEssence -= anchor.costEssence
    anchor.level += 1
    anchor.costEssence = Math.round(anchor.costEssence * 1.6)

    // 提升整體防護力與穩定度
    this.state.susyFieldStrengthPercent = Math.min(100, this.state.susyFieldStrengthPercent + 8 * anchor.efficiencyBonus)
    this.state.fieldStabilityPercent = Math.min(100, this.state.fieldStabilityPercent + 5 * anchor.efficiencyBonus)

    this.saveState()

    // 播放強化音效
    playAudioTone(440, 0.15, 'sine')
    setTimeout(() => playAudioTone(660, 0.25, 'triangle'), 100)
    return true
  }

  /**
   * 展開全域超對稱相變天幕 (Supersymmetric Screen) 抵禦真空泡泡
   */
  public activateSupersymmetricScreen(): { success: boolean; repelledKm: number } {
    if (this.state.susyFieldStrengthPercent < 20) {
      return { success: false, repelledKm: 0 }
    }

    // 抵禦泡泡衝擊，將泡泡半徑向外推擠或壓縮
    const repelledKm = Math.min(this.state.decayBubbleRadiusKm, Math.round(this.state.decayBubbleRadiusKm * 0.45 + 5000))
    this.state.decayBubbleRadiusKm = Math.max(1000, this.state.decayBubbleRadiusKm - repelledKm)

    // 消耗部分天幕強度，但激勵穩定度
    this.state.susyFieldStrengthPercent = Math.max(10, this.state.susyFieldStrengthPercent - 15)
    this.state.fieldStabilityPercent = Math.min(100, this.state.fieldStabilityPercent + 12)
    this.state.totalIncursionsRepelled += 1

    // 獲得抵禦真空回饋精華
    const reward = Math.round(repelledKm / 150) + 120
    this.state.vacuumEssence += reward

    // 檢查成就
    achievementsManager.unlock('vacuum_warden')

    this.saveState()

    // 播放天幕爆發音效
    playNoiseBurst(0.4, 0.3)
    playAudioTone(880, 0.35, 'sawtooth')
    setTimeout(() => playAudioTone(1320, 0.45, 'sine'), 150)

    return { success: true, repelledKm }
  }

  /**
   * 平息希格斯場微擾 (Stabilize Higgs Potential)
   */
  public stabilizeHiggsField(): boolean {
    if (this.state.fieldStabilityPercent >= 99) return false

    // 微調希格斯勢能回歸 125.09 GeV
    const diff = 125.09 - this.state.higgsFieldPotentialGeV
    this.state.higgsFieldPotentialGeV += diff * 0.6
    this.state.fieldStabilityPercent = Math.min(100, this.state.fieldStabilityPercent + 15)

    this.saveState()

    // 純音調滑音
    playAudioTone(330, 0.2, 'sine')
    setTimeout(() => playAudioTone(495, 0.3, 'sine'), 80)
    return true
  }

  /**
   * 採集相變臨界釋放之真空精華 (Harvest Vacuum Essence)
   */
  public harvestVacuumEssence(): number {
    // 依據天幕強度與希格斯穩定度產生精華
    const base = Math.round(this.state.susyFieldStrengthPercent * 0.8 + this.state.fieldStabilityPercent * 0.5)
    this.state.vacuumEssence += base
    this.saveState()

    playAudioTone(784, 0.15, 'sine')
    setTimeout(() => playAudioTone(1046, 0.2, 'triangle'), 80)
    return base
  }

  /**
   * 主循環物理更新
   */
  public update(delta: number): void {
    const now = Date.now()
    if (now - this.state.lastTickTimestamp < 1000) return
    this.state.lastTickTimestamp = now

    // 泡泡在真空中以光速常數級擴散
    if (this.state.isDecayExpanding) {
      const expansionRate = (100 - this.state.susyFieldStrengthPercent) * 25
      this.state.decayBubbleRadiusKm += Math.round(expansionRate * delta)

      // 泡泡擴大會稍微降低穩定度
      if (this.state.decayBubbleRadiusKm > 100000) {
        this.state.fieldStabilityPercent = Math.max(10, this.state.fieldStabilityPercent - 0.2)
      }
    }

    // 自然微動
    const wobble = (Math.random() - 0.5) * 0.04
    this.state.higgsFieldPotentialGeV = parseFloat((this.state.higgsFieldPotentialGeV + wobble).toFixed(3))

    // 錨點自動修復微量天幕
    let totalRegen = 0
    for (const a of Object.values(this.state.anchors)) {
      totalRegen += a.level * a.efficiencyBonus * 0.1
    }
    this.state.susyFieldStrengthPercent = Math.min(100, this.state.susyFieldStrengthPercent + totalRegen)

    this.saveState()
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch {
      // ignore
    }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        this.state = {
          ...this.state,
          ...parsed,
          anchors: { ...DEFAULT_ANCHORS, ...(parsed.anchors || {}) }
        }
      }
    } catch {
      // fallback
    }
  }
}

export const vacuumDecayWard = new VacuumDecayWardEngine()
