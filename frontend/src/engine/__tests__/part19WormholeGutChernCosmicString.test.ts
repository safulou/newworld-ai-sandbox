/**
 * part19WormholeGutChernCosmicString.test.ts
 * 單元測試：量子引力蟲洞橋、大統一理論規範玻色子對撞核心、拓撲量子幾何陳類數纖維叢、宇宙弦微波背景輻射透鏡測繪
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { wormholeBridge } from '../wormholeBridge'
import { gutCollider } from '../gutCollider'
import { topologicalChern } from '../topologicalChern'
import { cosmicStringCartographer } from '../cosmicStringCartographer'
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

describe('Part 19: 量子引力蟲洞橋、大統一對撞、拓撲陳類數與宇宙弦測繪測試', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. 量子引力蟲洞橋與愛因斯坦-羅森橋 (Wormhole Bridge)', () => {
    it('應正確初始化雙曲喉部半徑、卡西米爾負能量與 11 個幾何切片節點', () => {
      const state = wormholeBridge.getState()
      expect(state.throatRadiusPlanck).toBeGreaterThan(50)
      expect(state.casimirNegativeEnergyPercent).toBeGreaterThan(50)
      expect(wormholeBridge.throatNodes.length).toBe(11)
      expect(state.topologyType).toBe('morris_thorne')
    })

    it('切換拓撲模態應成功轉換至普朗克微蟲洞或克爾旋轉裂隙', () => {
      wormholeBridge.switchTopology('planckian')
      expect(wormholeBridge.topologyType).toBe('planckian')
      wormholeBridge.switchTopology('kerr_rift')
      expect(wormholeBridge.topologyType).toBe('kerr_rift')
      wormholeBridge.switchTopology('higher_dim')
      expect(wormholeBridge.topologyType).toBe('higher_dim')
    })

    it('注入卡西米爾負能量應拓寬喉部半徑並提升防塌縮度', () => {
      const prevRadius = wormholeBridge.throatRadiusPlanck
      const prevEnergy = wormholeBridge.casimirNegativeEnergyPercent
      const success = wormholeBridge.injectCasimirNegativeEnergy()
      expect(success).toBe(true)
      expect(wormholeBridge.throatRadiusPlanck).toBeGreaterThan(prevRadius)
      expect(wormholeBridge.casimirNegativeEnergyPercent).toBeGreaterThanOrEqual(prevEnergy)
    })

    it('執行跨喉部量子傳態應產出通量並解鎖蟲洞領航員成就', () => {
      const prevTeleports = wormholeBridge.getState().totalTeleportations
      const prevFlux = wormholeBridge.traversableFlux
      const res = wormholeBridge.teleportQuantumPayload()
      expect(res.success).toBe(true)
      expect(res.yieldFlux).toBeGreaterThan(0)
      expect(wormholeBridge.traversableFlux).toBe(prevFlux + res.yieldFlux)
      expect(wormholeBridge.getState().totalTeleportations).toBe(prevTeleports + 1)
      expect(achievementsManager.isUnlocked('wormhole_navigator')).toBe(true)
    })

    it('校準糾纏態與拓寬喉徑操作應能正常執行', () => {
      wormholeBridge.stabilizeEntanglement()
      expect(wormholeBridge.entanglementFidelityPercent).toBeGreaterThan(90)
    })

    it('週期 update 應安全執行且無崩潰', () => {
      expect(() => wormholeBridge.update(0.016)).not.toThrow()
    })
  })

  describe('2. 大統一理論規範玻色子對撞核心 (GUT Collider)', () => {
    it('應正確初始化 10^16 GeV 超大統一能標、耦合常數統一度與對撞模型', () => {
      const state = gutCollider.getState()
      expect(state.gutEnergyExponent).toBeCloseTo(16.0, 1)
      expect(state.gaugeCouplingUnificationPercent).toBeGreaterThan(70)
      expect(state.colliderMode).toBe('spinor_so10')
      expect(state.xyBosonYieldCounts).toBeGreaterThan(0)
    })

    it('激發超高能對撞應產出 X/Y 玻色子並解鎖大統一理論先驅成就', () => {
      const prevXY = gutCollider.xyBosonYieldCounts
      const res = gutCollider.fireGUTCollision()
      expect(res.xyBosonGained).toBeGreaterThan(0)
      expect(gutCollider.xyBosonYieldCounts).toBe(prevXY + res.xyBosonGained)
      expect(achievementsManager.isUnlocked('gut_grand_unifier')).toBe(true)
    })

    it('校準規範耦合常數應提升大統一耦合度', () => {
      const prevPercent = gutCollider.gaugeCouplingUnificationPercent
      const success = gutCollider.alignGaugeCouplings()
      expect(success).toBe(true)
      expect(gutCollider.gaugeCouplingUnificationPercent).toBeGreaterThanOrEqual(prevPercent)
    })

    it('凝聚磁單極子應消耗通量並提升單極子密度', () => {
      if (gutCollider.unificationFlux < 120) {
        gutCollider.fireGUTCollision()
      }
      const prevDensity = gutCollider.getState().monopoleDensity
      gutCollider.condenseMagneticMonopoles()
      expect(gutCollider.getState().monopoleDensity).toBeGreaterThanOrEqual(prevDensity)
    })

    it('切換對撞模式應成功切換為 SU(5) 或 E6', () => {
      gutCollider.switchMode('georgi_glashow_su5')
      expect(gutCollider.colliderMode).toBe('georgi_glashow_su5')
      gutCollider.switchMode('exceptional_e6')
      expect(gutCollider.colliderMode).toBe('exceptional_e6')
    })

    it('週期 update 應安全自律增長通量', () => {
      expect(() => gutCollider.update(0.016)).not.toThrow()
    })
  })

  describe('3. 拓撲量子幾何陳類數纖維叢 (Topological Chern Bundle)', () => {
    it('應正確初始化第一陳類數 C=1、貝里曲率與量子霍爾態', () => {
      const state = topologicalChern.getState()
      expect(state.chernNumber).toBe(1)
      expect(state.berryCurvatureFlux).toBeCloseTo(6.28, 1)
      expect(state.phaseType).toBe('quantum_hall')
      expect(topologicalChern.edgeWaves.length).toBe(8)
    })

    it('切換拓撲相態應成功轉換至拓撲絕緣體或韋爾半金屬', () => {
      topologicalChern.switchPhase('topological_insulator')
      expect(topologicalChern.phaseType).toBe('topological_insulator')
      topologicalChern.switchPhase('weyl_semimetal')
      expect(topologicalChern.phaseType).toBe('weyl_semimetal')
    })

    it('躍遷陳類數整數階應更新貝里曲率通量與量子化霍爾電導', () => {
      topologicalChern.shiftChernNumber(1)
      expect(topologicalChern.chernNumber).toBe(2)
      expect(topologicalChern.hallConductanceQuantized).toBe(2)
      topologicalChern.shiftChernNumber(-1)
      expect(topologicalChern.chernNumber).toBe(1)
    })

    it('任意子幾何編織應產出手性通量並解鎖拓撲編織宗師成就', () => {
      const prevFlux = topologicalChern.chiralFluxStockpile
      const gained = topologicalChern.braidAnyonicPhases()
      expect(gained).toBeGreaterThan(0)
      expect(topologicalChern.chiralFluxStockpile).toBe(prevFlux + gained)
      expect(achievementsManager.isUnlocked('topological_braider')).toBe(true)
    })

    it('強化拓撲保護度應防止熱退相干', () => {
      const prevProt = topologicalChern.topologicalProtectionPercent
      topologicalChern.reinforceProtection()
      expect(topologicalChern.topologicalProtectionPercent).toBeGreaterThanOrEqual(prevProt)
    })

    it('週期 update 應正常執行手性邊緣流演算', () => {
      expect(() => topologicalChern.update(0.016)).not.toThrow()
    })
  })

  describe('4. 宇宙弦微波背景輻射透鏡測繪 (Cosmic String Cartographer)', () => {
    it('應正確初始化宇宙弦張力 Gμ、角虧缺與閉合振盪環', () => {
      const state = cosmicStringCartographer.getState()
      expect(state.stringTensionGmuE7).toBeCloseTo(1.25, 2)
      expect(state.deficitAngleArcsec).toBeGreaterThan(0)
      expect(state.stringType).toBe('oscillating_loop')
    })

    it('切換宇宙弦型態應成功切換為南部-後藤長弦或超導宇宙弦', () => {
      cosmicStringCartographer.switchStringType('nambu_goto_open')
      expect(cosmicStringCartographer.stringType).toBe('nambu_goto_open')
      cosmicStringCartographer.switchStringType('superconducting_string')
      expect(cosmicStringCartographer.stringType).toBe('superconducting_string')
    })

    it('捕捉尖端/扭結引力微爆應收穫測繪通量並解鎖宇宙弦捕手成就', () => {
      const prevFlux = cosmicStringCartographer.cosmicStringFlux
      const prevBursts = cosmicStringCartographer.gravitationalWaveBursts
      const res = cosmicStringCartographer.detectGravitationalBurst()
      expect(res.fluxYield).toBeGreaterThan(0)
      expect(cosmicStringCartographer.cosmicStringFlux).toBe(prevFlux + res.fluxYield)
      expect(cosmicStringCartographer.gravitationalWaveBursts).toBe(prevBursts + 1)
      expect(achievementsManager.isUnlocked('cosmic_string_hunter')).toBe(true)
    })

    it('巡天測繪 CMB 透鏡階躍應提升覆蓋率與溫差觀測數據', () => {
      const prevCoverage = cosmicStringCartographer.surveyCoveragePercent
      const success = cosmicStringCartographer.surveyCMBLensing()
      expect(success).toBe(true)
      expect(cosmicStringCartographer.surveyCoveragePercent).toBeGreaterThan(prevCoverage)
    })

    it('微調宇宙弦張力應連動更新度規角虧缺', () => {
      const prevAngle = cosmicStringCartographer.deficitAngleArcsec
      cosmicStringCartographer.adjustStringTension(0.2)
      expect(cosmicStringCartographer.deficitAngleArcsec).toBeGreaterThan(prevAngle)
    })

    it('週期 update 應安全執行無異常', () => {
      expect(() => cosmicStringCartographer.update(0.016)).not.toThrow()
    })
  })

  describe('5. 成就系統整合測試', () => {
    it('成就總數應包含 Part 19 的 4 項全新科學前沿成就且總數達到 89 項', () => {
      const allAchievements = achievementsManager.getAll()
      const part19Ids = ['wormhole_navigator', 'gut_grand_unifier', 'topological_braider', 'cosmic_string_hunter']
      for (const id of part19Ids) {
        const found = allAchievements.find(a => a.id === id)
        expect(found).toBeDefined()
        expect(found?.title).toBeTruthy()
        expect(found?.description).toBeTruthy()
      }
      expect(allAchievements.length).toBeGreaterThanOrEqual(89)
    })
  })
})
