import { describe, it, expect, beforeEach, vi } from 'vitest'
import { kardashevEngine } from '../kardashevTranscendence'
import { dysonSwarmEngine } from '../dysonSwarmMesh'
import { planetaryCoreEngine } from '../planetaryCoreEngine'
import { chronoStabilizer } from '../chronoStabilizer'
import { achievements } from '../achievements'

describe('Part 15: 天體級超維度工程與卡爾達肖夫文明指標', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. 卡爾達肖夫文明等級評定與奇點超越儀 (kardashevTranscendence)', () => {
    it('應正確根據瓦特功率計算卡爾達肖夫文明指數 (K = (log10(P) - 6) / 10)', () => {
      // 10^16 Watts = Type 1.00
      kardashevEngine.setBasePower(1e16)
      expect(kardashevEngine.stats.kardashevIndex).toBeCloseTo(1.0, 1)
      expect(kardashevEngine.stats.tier).toBe('Type I')

      // 10^26 Watts = Type 2.00
      kardashevEngine.setBasePower(1e26)
      expect(kardashevEngine.stats.kardashevIndex).toBeCloseTo(2.0, 1)
      expect(kardashevEngine.stats.tier).toBe('Type II')
    })

    it('外部超結構功率注入應提升文明指數與天梯支柱解鎖狀態', () => {
      kardashevEngine.setBasePower(1e12)
      kardashevEngine.feedExternalPower(1e22)
      expect(kardashevEngine.stats.kardashevIndex).toBeGreaterThan(1.2)
      expect(kardashevEngine.pillars.stellar_shield.unlocked).toBe(true)
    })

    it('應在滿足能階門檻時升級天梯支柱並提升全局倍率', () => {
      kardashevEngine.setBasePower(1e18)
      const prevMultiplier = kardashevEngine.stats.globalPowerMultiplier
      const res = kardashevEngine.upgradePillar('climate_grid')
      expect(res).toBe(true)
      expect(kardashevEngine.pillars.climate_grid.level).toBeGreaterThanOrEqual(2)
      expect(kardashevEngine.stats.globalPowerMultiplier).toBeGreaterThanOrEqual(prevMultiplier)
    })

    it('未達飛升條件時應阻止奇點超越，達成條件時應成功獲得超越星芒', () => {
      // Not ready case
      kardashevEngine.stats.ascensionReadinessPercent = 50
      kardashevEngine.stats.kardashevIndex = 1.5
      expect(kardashevEngine.triggerAscension()).toBe(false)

      // Ready case
      kardashevEngine.stats.ascensionReadinessPercent = 100
      kardashevEngine.stats.kardashevIndex = 2.2
      const prevShards = kardashevEngine.stats.transcendenceShards
      const res = kardashevEngine.triggerAscension()
      expect(res).toBe(true)
      expect(kardashevEngine.stats.transcendenceShards).toBeGreaterThan(prevShards)
      expect(kardashevEngine.stats.ascensionCount).toBe(1)
    })

    it('程序化音效與更新循環應正常運行', () => {
      expect(() => {
        kardashevEngine.playPillarChime()
        kardashevEngine.playAscensionHarmonics()
        kardashevEngine.update(0.1)
      }).not.toThrow()
    })
  })

  describe('2. 戴森雲反射群集拓撲網絡 (dysonSwarmMesh)', () => {
    it('應正確統計開普勒軌道殼層之反光鏡數量與總能量輸出', () => {
      dysonSwarmEngine.recalculatePower()
      expect(dysonSwarmEngine.stats.totalMirrors).toBeGreaterThan(0)
      expect(dysonSwarmEngine.stats.harnessedPowerWatts).toBeGreaterThan(0)
      expect(dysonSwarmEngine.stats.harnessedPowerGW).toBeGreaterThan(0)
    })

    it('應能向指定開普勒殼層發射新增反射光帆', () => {
      const prevMirrors = dysonSwarmEngine.shells.equatorial.mirrorCount
      const res = dysonSwarmEngine.launchMirrors('equatorial', 25)
      expect(res).toBe(true)
      expect(dysonSwarmEngine.shells.equatorial.mirrorCount).toBe(prevMirrors + 25)
    })

    it('應能切換微波能束聚焦目標 (受電網 / 星門 / 物質鍛爐)', () => {
      dysonSwarmEngine.setBeamTarget('warp_gate')
      expect(dysonSwarmEngine.stats.beamTarget).toBe('warp_gate')

      dysonSwarmEngine.setBeamTarget('industrial_forge')
      expect(dysonSwarmEngine.stats.beamTarget).toBe('industrial_forge')
    })

    it('姿態推進校準與奈米維修升級應正常運作', () => {
      dysonSwarmEngine.stats.alignmentEfficiencyPercent = 50
      dysonSwarmEngine.calibrateAlignment()
      expect(dysonSwarmEngine.stats.alignmentEfficiencyPercent).toBe(100)

      const prevLvl = dysonSwarmEngine.stats.naniteRepairLevel
      dysonSwarmEngine.upgradeNaniteRepair()
      expect(dysonSwarmEngine.stats.naniteRepairLevel).toBe(prevLvl + 1)
    })

    it('更新循環中太陽風漂移與物質合成應正常計算', () => {
      dysonSwarmEngine.stats.beamTarget = 'industrial_forge'
      const prevMatter = dysonSwarmEngine.stats.totalMatterSynthesizedKg
      dysonSwarmEngine.update(1.0)
      expect(dysonSwarmEngine.stats.totalMatterSynthesizedKg).toBeGreaterThanOrEqual(prevMatter)
    })
  })

  describe('3. 全球地熱超深鑽井與行星地核引擎 (planetaryCoreEngine)', () => {
    it('應正確根據深度解鎖地層並提升地磁發電機磁盾', () => {
      planetaryCoreEngine.stats.currentDepthKm = 100
      planetaryCoreEngine.updateStratumStatus()
      expect(planetaryCoreEngine.strata.upper_mantle.unlocked).toBe(true)
      expect(planetaryCoreEngine.stats.geodynamoShieldPercent).toBeGreaterThan(45)

      // Outer core reach (>2890 km)
      planetaryCoreEngine.stats.currentDepthKm = 3000
      planetaryCoreEngine.updateStratumStatus()
      expect(planetaryCoreEngine.strata.outer_core.unlocked).toBe(true)
      expect(achievements.isUnlocked('core_dynamo_master')).toBe(true)
    })

    it('應能切換與升級深層鑽具', () => {
      const res = planetaryCoreEngine.switchDrillBit('graphene')
      expect(res).toBe(true)
      expect(planetaryCoreEngine.stats.activeDrillBit).toBe('graphene')

      const prevSpeed = planetaryCoreEngine.drillBits.graphene.drillingSpeedKmSec
      planetaryCoreEngine.upgradeDrillBit('graphene')
      expect(planetaryCoreEngine.drillBits.graphene.drillingSpeedKmSec).toBeGreaterThan(prevSpeed)
    })

    it('脈衝構造洩壓閥應能安全釋放板塊應力並產出深核結晶', () => {
      planetaryCoreEngine.stats.tectonicStressPercent = 60
      const prevCrystals = planetaryCoreEngine.stats.coreCrystalsHarvested
      const res = planetaryCoreEngine.ventTectonicStress()
      expect(res).toBe(true)
      expect(planetaryCoreEngine.stats.tectonicStressPercent).toBe(0)
      expect(planetaryCoreEngine.stats.coreCrystalsHarvested).toBeGreaterThan(prevCrystals)
    })

    it('音頻與深度更新循環應正常工作', () => {
      expect(() => {
        planetaryCoreEngine.playRumbleSound()
        planetaryCoreEngine.playVentingHiss()
        planetaryCoreEngine.update(0.5)
      }).not.toThrow()
    })
  })

  describe('4. 時間因果律校準儀與微型時空閉環 (chronoStabilizer)', () => {
    it('應允許預借未來時間線資源並建立因果債務', () => {
      const prevDebts = chronoStabilizer.activeDebts.length
      const res = chronoStabilizer.borrowFutureResource('research')
      expect(res).toBe(true)
      expect(chronoStabilizer.activeDebts.length).toBe(prevDebts + 1)
      expect(chronoStabilizer.stats.paradoxFluxPercent).toBeGreaterThan(10)
    })

    it('及時平息償還因果債務應消除債務並降低反衝度', () => {
      chronoStabilizer.borrowFutureResource('energy')
      const debt = chronoStabilizer.activeDebts[chronoStabilizer.activeDebts.length - 1]
      const prevFlux = chronoStabilizer.stats.paradoxFluxPercent
      const res = chronoStabilizer.repayDebt(debt.id)
      expect(res).toBe(true)
      expect(chronoStabilizer.stats.paradoxFluxPercent).toBeLessThan(prevFlux)
      expect(chronoStabilizer.stats.debtsResolvedCount).toBeGreaterThan(0)
    })

    it('超光速粒子注入應抑制反衝度', () => {
      chronoStabilizer.stats.tachyonParticles = 50
      chronoStabilizer.stats.paradoxFluxPercent = 40
      const res = chronoStabilizer.injectTachyons()
      expect(res).toBe(true)
      expect(chronoStabilizer.stats.paradoxFluxPercent).toBe(20)
      expect(chronoStabilizer.stats.tachyonParticles).toBe(25)
    })

    it('時空實驗室模組應可正常升級', () => {
      chronoStabilizer.stats.tachyonParticles = 500
      const prevLvl = chronoStabilizer.modules.condenser.level
      const res = chronoStabilizer.upgradeModule('condenser')
      expect(res).toBe(true)
      expect(chronoStabilizer.modules.condenser.level).toBe(prevLvl + 1)
    })

    it('因果反衝度過高時應呈現警告狀態，債務超時應被處理', () => {
      chronoStabilizer.borrowFutureResource('tachyon')
      const debt = chronoStabilizer.activeDebts[0]
      debt.remainingSeconds = 0.05
      chronoStabilizer.update(0.1) // triggers debt expiration
      expect(chronoStabilizer.stats.paradoxFluxPercent).toBeGreaterThan(15)
    })
  })
})
