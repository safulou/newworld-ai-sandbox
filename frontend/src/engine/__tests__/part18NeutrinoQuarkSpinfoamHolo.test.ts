/**
 * part18NeutrinoQuarkSpinfoamHolo.test.ts
 * 單元測試：中微子超流體暗物質探測陣列、夸克膠子等離子體重組爐、時空量子幾何自旋泡沫網絡、全息宇宙事件視界編碼矩陣
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { neutrinoDetector } from '../neutrinoDetector'
import { quarkGluonPlasma } from '../quarkGluonPlasma'
import { spinfoamGeometry } from '../spinfoamGeometry'
import { holographicHorizon } from '../holographicHorizon'
import { achievementsManager } from '../achievements'

// Mock spatial audio
vi.mock('../spatialAudio', () => ({
  playAudioTone: vi.fn(),
  playNoiseBurst: vi.fn(),
  sound: {
    playUiClick: vi.fn(),
    playFanfare: vi.fn()
  }
}))

describe('Part 18: 宇宙基石微觀高能與圈量子幾何測試', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. 中微子超流體暗物質探測陣列 (Neutrino Superfluid Detector)', () => {
    it('應正確初始化極低溫稀釋腔體、4 大探測組件與味態振盪參數', () => {
      const state = neutrinoDetector.getState()
      expect(state.cryoTempMilliKelvin).toBeCloseTo(0.85, 2)
      expect(state.superfluidPhononFlux).toBeGreaterThan(0)
      expect(Object.keys(neutrinoDetector.sensors).length).toBe(4)
      expect(neutrinoDetector.sensors['cryo_pump']).toBeDefined()
      expect(state.flavorOscillationRatio.electron + state.flavorOscillationRatio.muon + state.flavorOscillationRatio.tau).toBe(100)
    })

    it('升級指定超低溫組件應消耗聲子通量並降低極低溫漂移', () => {
      const prevLevel = neutrinoDetector.sensors['cryo_pump'].level
      const prevCost = neutrinoDetector.sensors['cryo_pump'].costPhonon
      const prevFlux = neutrinoDetector.superfluidPhononFlux

      // 保證足夠聲子通量
      if (prevFlux < prevCost) {
        neutrinoDetector.harvestPhononBurst()
      }

      const success = neutrinoDetector.upgradeSensor('cryo_pump')
      expect(success).toBe(true)
      expect(neutrinoDetector.sensors['cryo_pump'].level).toBe(prevLevel + 1)
      expect(neutrinoDetector.sensors['cryo_pump'].costPhonon).toBeGreaterThan(prevCost)
    })

    it('深度校準制冷槽應進一步冷卻稀釋溫度並提升過濾純度', () => {
      const prevTemp = neutrinoDetector.cryoTempMilliKelvin
      const prevPurity = neutrinoDetector.shieldingPurityPercent
      const success = neutrinoDetector.calibrateCryoChamber()
      expect(success).toBe(true)
      expect(neutrinoDetector.cryoTempMilliKelvin).toBeLessThanOrEqual(prevTemp)
      expect(neutrinoDetector.shieldingPurityPercent).toBeGreaterThanOrEqual(prevPurity)
    })

    it('調諧味態濾鏡應動態更新味態比例並記錄事件', () => {
      const prevEvents = neutrinoDetector.getState().totalEventsLogged
      const ratio = neutrinoDetector.tuneOscillationFilter()
      expect(ratio.electron + ratio.muon + ratio.tau).toBe(100)
      expect(neutrinoDetector.getState().totalEventsLogged).toBe(prevEvents + 1)
    })

    it('捕獲聲子閃光應獲得聲子通量並解鎖中微子低語者成就', () => {
      const prevFlux = neutrinoDetector.superfluidPhononFlux
      const gained = neutrinoDetector.harvestPhononBurst()
      expect(gained).toBeGreaterThan(0)
      expect(neutrinoDetector.superfluidPhononFlux).toBe(prevFlux + gained)
      expect(achievementsManager.isUnlocked('neutrino_whisperer')).toBe(true)
    })

    it('週期 update 應安全執行且無異常崩潰', () => {
      expect(() => neutrinoDetector.update(0.016)).not.toThrow()
    })
  })

  describe('2. 夸克膠子等離子體重組爐 (Quark-Gluon Plasma Forge)', () => {
    it('應正確初始化 2 兆度高溫腔體、漸近自由度與夸克味態能階', () => {
      const state = quarkGluonPlasma.getState()
      expect(state.chamberTempTrillionK).toBeGreaterThanOrEqual(1.5)
      expect(state.asymptoticFreedomPercent).toBeGreaterThan(50)
      expect(Object.keys(quarkGluonPlasma.quarkDensities).length).toBe(4)
      expect(quarkGluonPlasma.quarkDensities.up.unlocked).toBe(true)
      expect(quarkGluonPlasma.quarkDensities.strange.unlocked).toBe(true)
    })

    it('激發重離子對撞應使反應腔溫暴升並提升漸近自由度', () => {
      const prevTemp = quarkGluonPlasma.chamberTempTrillionK
      const prevFreedom = quarkGluonPlasma.asymptoticFreedomPercent
      const res = quarkGluonPlasma.triggerHeavyIonCollision()
      expect(res.tempDelta).toBeGreaterThan(0)
      expect(quarkGluonPlasma.chamberTempTrillionK).toBeGreaterThan(prevTemp)
      expect(quarkGluonPlasma.asymptoticFreedomPercent).toBeGreaterThanOrEqual(prevFreedom)
    })

    it('調節超導磁力噴嘴應強化拘束壓', () => {
      const prevPressure = quarkGluonPlasma.confinementPressureTeraBar
      const success = quarkGluonPlasma.regulateMagneticNozzle()
      expect(success).toBe(true)
      expect(quarkGluonPlasma.confinementPressureTeraBar).toBeGreaterThan(prevPressure)
    })

    it('合成奇異重子塊應消耗束能並解鎖夸克鍊金術士成就', () => {
      const prevStockpile = quarkGluonPlasma.strangeletStockpile
      const synthesized = quarkGluonPlasma.synthesizeStrangelet()
      expect(synthesized).toBeGreaterThan(0)
      expect(quarkGluonPlasma.strangeletStockpile).toBe(prevStockpile + synthesized)
      expect(achievementsManager.isUnlocked('quark_alchemist')).toBe(true)
    })

    it('注入夸克冷卻劑淬火應安全降低腔溫', () => {
      const prevTemp = quarkGluonPlasma.chamberTempTrillionK
      const success = quarkGluonPlasma.quenchPlasma()
      expect(success).toBe(true)
      expect(quarkGluonPlasma.chamberTempTrillionK).toBeLessThan(prevTemp)
    })

    it('週期 update 應自然調和腔溫無異常', () => {
      expect(() => quarkGluonPlasma.update(0.016)).not.toThrow()
    })
  })

  describe('3. 時空量子幾何自旋泡沫網絡 (Spinfoam Quantum Geometry)', () => {
    it('應正確初始化 16 普朗克節點、正四面體幾何與自旋量子', () => {
      const state = spinfoamGeometry.getState()
      expect(state.planckianNodesCount).toBe(16)
      expect(spinfoamGeometry.nodes.length).toBe(16)
      expect(state.currentLattice).toBe('tetrahedron')
      expect(state.quantumCurvatureQuanta).toBeGreaterThan(0)
    })

    it('切換幾何模態應成功轉換至超球面、五胞體或克萊因環', () => {
      spinfoamGeometry.switchLattice('hypersphere')
      expect(spinfoamGeometry.currentLattice).toBe('hypersphere')
      spinfoamGeometry.switchLattice('pentachoron')
      expect(spinfoamGeometry.currentLattice).toBe('pentachoron')
      spinfoamGeometry.switchLattice('torus')
      expect(spinfoamGeometry.currentLattice).toBe('torus')
    })

    it('演化自旋網絡應躍遷節點自旋 j 並重新計算本徵面積與體積', () => {
      const prevVolume = spinfoamGeometry.getState().totalQuantumVolumePlanck
      const success = spinfoamGeometry.evolveSpinNetwork()
      expect(success).toBe(true)
      expect(spinfoamGeometry.getState().totalQuantumVolumePlanck).toBeGreaterThan(prevVolume)
    })

    it('激發曲率量子應收穫離散幾何能量並解鎖自旋泡沫編織宗師成就', () => {
      const prevCurvature = spinfoamGeometry.quantumCurvatureQuanta
      const gained = spinfoamGeometry.exciteQuantumCurvature()
      expect(gained).toBeGreaterThan(0)
      expect(spinfoamGeometry.quantumCurvatureQuanta).toBe(prevCurvature + gained)
      expect(achievementsManager.isUnlocked('spinfoam_weaver')).toBe(true)
    })

    it('諧振單純形幾何振幅應提升 4-單純形相干度', () => {
      const prevCoherence = spinfoamGeometry.fourSimplexCoherencePercent
      spinfoamGeometry.harmonizeSimplexAmplitude()
      expect(spinfoamGeometry.fourSimplexCoherencePercent).toBeGreaterThanOrEqual(prevCoherence)
    })

    it('週期 update 應安全執行自旋微量漂移', () => {
      expect(() => spinfoamGeometry.update(0.016)).not.toThrow()
    })
  })

  describe('4. 全息宇宙事件視界編碼矩陣 (Holographic Horizon Matrix)', () => {
    it('應正確初始化 24 邊界量子位元、視界表面積與貝肯斯坦熵', () => {
      const state = holographicHorizon.getState()
      expect(state.horizonAreaPlanck2).toBeGreaterThan(0)
      expect(state.bekensteinEntropyBits).toBe(Math.round(state.horizonAreaPlanck2 / 4))
      expect(holographicHorizon.boundaryQubits.length).toBe(24)
      expect(state.bulkDimensions).toBe(5)
    })

    it('投影體空間至邊界共形場應產出全息位元並擴展視界表面積', () => {
      const prevBits = holographicHorizon.holographicBitsStream
      const prevArea = holographicHorizon.horizonAreaPlanck2
      const res = holographicHorizon.projectBulkToBoundary()
      expect(res.entropyYield).toBeGreaterThan(0)
      expect(holographicHorizon.holographicBitsStream).toBe(prevBits + res.entropyYield)
      expect(holographicHorizon.horizonAreaPlanck2).toBeGreaterThan(prevArea)
    })

    it('同步 AdS/CFT 全息對偶應提升保真度並解鎖全息宇宙架構師成就', () => {
      const prevFidelity = holographicHorizon.cftDualityFidelityPercent
      const success = holographicHorizon.syncAdSCFTDuality()
      expect(success).toBe(true)
      expect(holographicHorizon.cftDualityFidelityPercent).toBeGreaterThanOrEqual(prevFidelity)
      expect(achievementsManager.isUnlocked('holographic_architect')).toBe(true)
    })

    it('擴展視界表面積應提升最大編碼極限與貝肯斯坦熵', () => {
      // 確保全息位元流足夠
      if (holographicHorizon.holographicBitsStream < 300) {
        holographicHorizon.compressBulkSlice()
      }
      const prevArea = holographicHorizon.horizonAreaPlanck2
      const prevEntropy = holographicHorizon.bekensteinEntropyBits
      const success = holographicHorizon.expandHorizonArea()
      expect(success).toBe(true)
      expect(holographicHorizon.horizonAreaPlanck2).toBe(prevArea + 512)
      expect(holographicHorizon.bekensteinEntropyBits).toBeGreaterThan(prevEntropy)
    })

    it('體幾何拓撲切片壓縮應產出全息位元流', () => {
      const prevBits = holographicHorizon.holographicBitsStream
      const gained = holographicHorizon.compressBulkSlice()
      expect(gained).toBeGreaterThan(0)
      expect(holographicHorizon.holographicBitsStream).toBe(prevBits + gained)
    })

    it('週期 update 應自然產生被動位元流無異常', () => {
      expect(() => holographicHorizon.update(0.016)).not.toThrow()
    })
  })

  describe('5. 成就系統整合測試', () => {
    it('成就總數應包含 Part 18 的 4 項全新科學前沿成就', () => {
      const allAchievements = achievementsManager.getAll()
      const part18Ids = ['neutrino_whisperer', 'quark_alchemist', 'spinfoam_weaver', 'holographic_architect']
      for (const id of part18Ids) {
        const found = allAchievements.find(a => a.id === id)
        expect(found).toBeDefined()
        expect(found?.title).toBeTruthy()
        expect(found?.description).toBeTruthy()
      }
      expect(allAchievements.length).toBeGreaterThanOrEqual(85)
    })
  })
})
