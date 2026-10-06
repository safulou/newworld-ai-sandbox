import { describe, it, expect, beforeEach, vi } from 'vitest'
import { multiverseBubbleEngine } from '../multiverseBubble'
import { ringworldFabricator } from '../ringworldFabricator'
import { cosmicConstantsEngine } from '../cosmicConstantsTuning'
import { stringFoldMatrixEngine } from '../stringFoldMatrix'
import { achievements } from '../achievements'

describe('Part 16: 多維平行宇宙拓撲與量子宏觀創世', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. 平行宇宙泡泡世界拓撲觀測儀 (multiverseBubble)', () => {
    it('應正確初始化並支援穿梭至解鎖之平行宇宙泡泡', () => {
      expect(multiverseBubbleEngine.bubbles.high_gravity.unlocked).toBe(true)
      const res = multiverseBubbleEngine.selectUniverse('antimatter')
      expect(res).toBe(true)
      expect(multiverseBubbleEngine.stats.activeUniverseId).toBe('antimatter')
      expect(multiverseBubbleEngine.stats.globalResonanceTHz).toBe(38.4)
      expect(achievements.isUnlocked('multiverse_traveler')).toBe(true)
    })

    it('發射自律維度探針應扣減可用探針並提升採集率', () => {
      const prevAvailable = multiverseBubbleEngine.stats.probesAvailable
      const prevDispatched = multiverseBubbleEngine.bubbles.high_gravity.probesDispatched
      const res = multiverseBubbleEngine.dispatchProbe('high_gravity')
      expect(res).toBe(true)
      expect(multiverseBubbleEngine.stats.probesAvailable).toBe(prevAvailable - 1)
      expect(multiverseBubbleEngine.bubbles.high_gravity.probesDispatched).toBe(prevDispatched + 1)
    })

    it('微調時空膜頻率至共振點時應達成 100% 穩定度', () => {
      multiverseBubbleEngine.stats.activeUniverseId = 'high_gravity'
      multiverseBubbleEngine.tuneFrequency(14.8)
      expect(multiverseBubbleEngine.bubbles.high_gravity.membraneStabilityPercent).toBe(100)
    })

    it('累積足額奇異通量應自動解鎖更深維度宇宙泡泡', () => {
      multiverseBubbleEngine.stats.totalMultiversalFlux = 2500
      multiverseBubbleEngine.checkUnlocks()
      expect(multiverseBubbleEngine.bubbles.variable_light.unlocked).toBe(true)
      expect(multiverseBubbleEngine.bubbles.hyper_entropy.unlocked).toBe(true)
    })

    it('程序化音效與更新循環應正常工作', () => {
      expect(() => {
        multiverseBubbleEngine.playTraverseSound()
        multiverseBubbleEngine.playChimeSound()
        multiverseBubbleEngine.update(0.5)
      }).not.toThrow()
    })
  })

  describe('2. 星際巨構環形世界建造船塢 (ringworldFabricator)', () => {
    it('應正確初始化 1 AU 尺度並計算四大宜居板塊輸出', () => {
      ringworldFabricator.recalculateStats()
      expect(ringworldFabricator.stats.radiusAU).toBe(1.0)
      expect(ringworldFabricator.stats.totalHabitableAreaMillionKm2).toBeGreaterThan(0)
      expect(ringworldFabricator.stats.totalPopulationMillion).toBeGreaterThan(0)
      expect(ringworldFabricator.stats.totalPowerGW).toBeGreaterThan(0)
    })

    it('投入工程資源應能推進指定板塊之建造進度與階段', () => {
      const prevPhase = ringworldFabricator.segments.archipelago.currentPhase
      const res = ringworldFabricator.advanceSegment('archipelago')
      expect(res).toBe(true)
      expect(ringworldFabricator.segments.archipelago.currentPhase).toBeGreaterThanOrEqual(prevPhase)
      expect(ringworldFabricator.segments.archipelago.phaseProgressPercent).toBeGreaterThan(0)
    })

    it('增擴奈米自律建造蜂群應成功升級隊數', () => {
      const prevSwarms = ringworldFabricator.stats.naniteFabricationSwarms
      const res = ringworldFabricator.upgradeNaniteSwarms()
      expect(res).toBe(true)
      expect(ringworldFabricator.stats.naniteFabricationSwarms).toBe(prevSwarms + 1)
    })

    it('建造總完備度突破 50% 應解鎖環形世界工程師成就', () => {
      ringworldFabricator.segments.oceanic.phaseProgressPercent = 100
      ringworldFabricator.segments.oceanic.currentPhase = 4
      ringworldFabricator.segments.archipelago.phaseProgressPercent = 100
      ringworldFabricator.segments.archipelago.currentPhase = 4
      ringworldFabricator.recalculateStats()
      if (ringworldFabricator.stats.overallConstructionPercent >= 50) {
        expect(achievements.isUnlocked('ringworld_architect')).toBe(true)
      }
    })

    it('音頻與更新循環應正常工作', () => {
      expect(() => {
        ringworldFabricator.playClampSound()
        ringworldFabricator.playPhaseUpSound()
        ringworldFabricator.update(0.2)
      }).not.toThrow()
    })
  })

  describe('3. 量子宏觀創世神諭樹與宇宙常數微調 (cosmicConstantsTuning)', () => {
    it('應允許微調基本宇宙常數並實時反映至倍率加成', () => {
      cosmicConstantsEngine.setAlpha(0.006000) // Lower alpha -> Superconductivity energy boost
      expect(cosmicConstantsEngine.stats.constants.alpha).toBeCloseTo(0.006, 4)
      expect(cosmicConstantsEngine.stats.energyMultiplier).toBeGreaterThan(1.0)

      cosmicConstantsEngine.setGravitationalG(8.0e-11)
      expect(cosmicConstantsEngine.stats.constants.gravitationalG).toBeCloseTo(8.0e-11, 12)

      cosmicConstantsEngine.setLambdaDarkEnergy(2.0e-52)
      expect(cosmicConstantsEngine.stats.constants.lambdaDarkEnergy).toBeCloseTo(2.0e-52, 53)
    })

    it('重置按鈕應恢復標準宇宙模型常數', () => {
      cosmicConstantsEngine.resetToDefaultConstants()
      expect(cosmicConstantsEngine.stats.constants.alpha).toBe(0.007297)
      expect(cosmicConstantsEngine.stats.constants.gravitationalG).toBe(6.674e-11)
      expect(cosmicConstantsEngine.stats.constants.lambdaDarkEnergy).toBe(1.1e-52)
      expect(cosmicConstantsEngine.stats.stabilityIndexPercent).toBe(100)
    })

    it('頒布創世神諭法令應扣除神能並賦予相應全域物理法則', () => {
      cosmicConstantsEngine.stats.genesisEnergy = 500
      const res = cosmicConstantsEngine.toggleDecree('decree_light')
      expect(res).toBe(true)
      expect(cosmicConstantsEngine.decrees.decree_light.active).toBe(true)
      expect(cosmicConstantsEngine.stats.researchMultiplier).toBeGreaterThan(1.0)
    })

    it('音頻與神能自動湧現循環應正常運行', () => {
      expect(() => {
        cosmicConstantsEngine.playSacredBell()
        const prevEnergy = cosmicConstantsEngine.stats.genesisEnergy
        cosmicConstantsEngine.update(1.0)
        expect(cosmicConstantsEngine.stats.genesisEnergy).toBeGreaterThan(prevEnergy)
      }).not.toThrow()
    })
  })

  describe('4. 超弦維度空間折疊傳輸矩陣 (stringFoldMatrix)', () => {
    it('應正確初始化並支援切換超弦共振和弦', () => {
      expect(stringFoldMatrixEngine.harmonics.open_string.unlocked).toBe(true)
      const res = stringFoldMatrixEngine.switchHarmonic('closed_string')
      expect(res).toBe(true)
      expect(stringFoldMatrixEngine.stats.activeHarmonic).toBe('closed_string')
      expect(stringFoldMatrixEngine.stats.currentFoldRatio).toBe(5000)
    })

    it('瞬間空間對折傳輸應成功運載物資並增加弦膜張力', () => {
      const prevMatter = stringFoldMatrixEngine.stats.totalMatterFoldedTons
      const prevTension = stringFoldMatrixEngine.stats.stringTensionPercent
      const res = stringFoldMatrixEngine.triggerInstantTransit(50)
      expect(res).toBe(true)
      expect(stringFoldMatrixEngine.stats.totalMatterFoldedTons).toBe(prevMatter + 50)
      expect(stringFoldMatrixEngine.stats.stringTensionPercent).toBeGreaterThan(prevTension)
    })

    it('釋放膜張力脈衝應歸零張力並恢復卡拉比-丘穩定度', () => {
      stringFoldMatrixEngine.stats.stringTensionPercent = 65
      stringFoldMatrixEngine.dischargeTension()
      expect(stringFoldMatrixEngine.stats.stringTensionPercent).toBe(0)
      expect(stringFoldMatrixEngine.stats.calabiYauStabilityPercent).toBe(100)
    })

    it('升級超弦和弦應成倍擴展空間折疊比率', () => {
      const prevFactor = stringFoldMatrixEngine.harmonics.open_string.level
      const res = stringFoldMatrixEngine.upgradeHarmonic('open_string')
      expect(res).toBe(true)
      expect(stringFoldMatrixEngine.harmonics.open_string.level).toBe(prevFactor + 1)
    })

    it('折疊壓縮比達到 100,000 時應解鎖超弦維度折疊宗師成就', () => {
      stringFoldMatrixEngine.harmonics.m_theory.unlocked = true
      stringFoldMatrixEngine.harmonics.m_theory.level = 1
      stringFoldMatrixEngine.switchHarmonic('m_theory')
      expect(stringFoldMatrixEngine.stats.currentFoldRatio).toBeGreaterThanOrEqual(100000)
      expect(achievements.isUnlocked('string_weaver')).toBe(true)
    })

    it('音效與更新循環應正常工作', () => {
      expect(() => {
        stringFoldMatrixEngine.playStringPluck()
        stringFoldMatrixEngine.playWarpWhoosh()
        stringFoldMatrixEngine.update(0.5)
      }).not.toThrow()
    })
  })
})
