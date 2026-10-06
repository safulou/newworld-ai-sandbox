/**
 * part17VacuumPBHStarchartTachyon.test.ts
 * 單元測試：暗能量真空衰變抵禦、太初黑洞星雲發電、量子全息星圖沙盤、超光速因果律超弦通訊網
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vacuumDecayWard } from '../vacuumDecayWard'
import { primordialBlackHole } from '../primordialBlackHole'
import { cosmicHoloStarchart } from '../cosmicHoloStarchart'
import { tachyonicCausalityMesh } from '../tachyonicCausalityMesh'
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

describe('Part 17: 真空衰變防護、太初黑洞、全息星圖與快子因果網測試', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. 暗能量真空衰變抵禦力場 (Vacuum Decay Ward)', () => {
    it('應正確初始化希格斯勢能、天幕強度與 4 大超對稱錨點', () => {
      const state = vacuumDecayWard.getState()
      expect(state.higgsFieldPotentialGeV).toBeCloseTo(125.09, 1)
      expect(state.fieldStabilityPercent).toBeGreaterThan(0)
      expect(state.susyFieldStrengthPercent).toBeGreaterThan(0)
      expect(Object.keys(vacuumDecayWard.anchors).length).toBe(4)
      expect(vacuumDecayWard.anchors['anchor_electroweak']).toBeDefined()
    })

    it('強化指定超對稱錨點應消耗真空精華並提升天幕強度', () => {
      const prevLevel = vacuumDecayWard.anchors['anchor_electroweak'].level
      const prevStrength = vacuumDecayWard.susyFieldStrengthPercent
      const success = vacuumDecayWard.reinforceAnchor('anchor_electroweak')
      expect(success).toBe(true)
      expect(vacuumDecayWard.anchors['anchor_electroweak'].level).toBe(prevLevel + 1)
      expect(vacuumDecayWard.susyFieldStrengthPercent).toBeGreaterThanOrEqual(prevStrength)
    })

    it('平息希格斯微擾應校準勢能並提升真空間穩定度', () => {
      const prevStability = vacuumDecayWard.fieldStabilityPercent
      const success = vacuumDecayWard.stabilizeHiggsField()
      expect(success).toBe(true)
      expect(vacuumDecayWard.fieldStabilityPercent).toBeGreaterThanOrEqual(prevStability)
    })

    it('展開超對稱天幕應壓縮排斥相變泡泡半徑並獲得真空精華', () => {
      const prevRadius = vacuumDecayWard.decayBubbleRadiusKm
      const prevEssence = vacuumDecayWard.vacuumEssence
      const res = vacuumDecayWard.activateSupersymmetricScreen()
      expect(res.success).toBe(true)
      expect(res.repelledKm).toBeGreaterThan(0)
      expect(vacuumDecayWard.decayBubbleRadiusKm).toBeLessThan(prevRadius)
      expect(vacuumDecayWard.vacuumEssence).toBeGreaterThan(prevEssence)
    })

    it('展開超對稱天幕應成功解鎖 vacuum_warden 成就', () => {
      vacuumDecayWard.activateSupersymmetricScreen()
      expect(achievementsManager.isUnlocked('vacuum_warden')).toBe(true)
    })
  })

  describe('2. 太初原初黑洞星雲發電機 (Primordial Black Hole Nebula)', () => {
    it('應正確初始化 4 個原初黑洞與總發電量', () => {
      const state = primordialBlackHole.getState()
      expect(Object.keys(state.activeHoles).length).toBe(4)
      expect(state.activeHoles['pbh_micro']).toBeDefined()
      expect(state.activeHoles['pbh_asteroid']).toBeDefined()
      expect(state.totalGridPowerMW).toBeGreaterThan(0)
    })

    it('拋投物質補給質量應增加黑洞質量與蒸發時間', () => {
      const prevMass = primordialBlackHole.activeHoles['pbh_micro'].massKg
      const prevEvap = primordialBlackHole.activeHoles['pbh_micro'].evaporationSecondsRemaining
      const success = primordialBlackHole.feedMass('pbh_micro', 5000)
      expect(success).toBe(true)
      expect(primordialBlackHole.activeHoles['pbh_micro'].massKg).toBe(prevMass + 5000)
      expect(primordialBlackHole.activeHoles['pbh_micro'].evaporationSecondsRemaining).toBeGreaterThan(prevEvap)
    })

    it('調諧磁約束懸浮籠應成功提升穩定度', () => {
      const prevStab = primordialBlackHole.magneticConfinementStabilityPercent
      const success = primordialBlackHole.tuneMagneticCage()
      expect(success).toBe(true)
      expect(primordialBlackHole.magneticConfinementStabilityPercent).toBeGreaterThanOrEqual(prevStab)
    })

    it('採集霍金蒸發微爆能量應增加霍金光子並解鎖成就', () => {
      const prevPhotons = primordialBlackHole.totalHawkingPhotons
      const gained = primordialBlackHole.harvestHawkingBurst('pbh_micro')
      expect(gained).toBeGreaterThan(0)
      expect(primordialBlackHole.totalHawkingPhotons).toBe(prevPhotons + gained)
      expect(achievementsManager.isUnlocked('pbh_harvester')).toBe(true)
    })

    it('部署新微型太初黑洞應消耗光子通量並重置質量', () => {
      // 確保有足夠光子
      primordialBlackHole.getState().totalHawkingPhotons = 500
      const success = primordialBlackHole.deployNewMicroPBH()
      expect(success).toBe(true)
      expect(primordialBlackHole.activeHoles['pbh_micro'].massKg).toBe(1000)
    })
  })

  describe('3. 量子糾纏全息星圖沙盤 (Quantum Holo-Starchart)', () => {
    it('應正確初始化尺度並篩選當前沙盒系統結點', () => {
      const state = cosmicHoloStarchart.getState()
      expect(state.currentZoom).toBe('system_sandbox')
      expect(cosmicHoloStarchart.filteredNodes.length).toBeGreaterThan(0)
      expect(cosmicHoloStarchart.filteredNodes.every(n => n.scale === 'system_sandbox')).toBe(true)
    })

    it('切換縮放尺度應動態更新過濾天體結點', () => {
      cosmicHoloStarchart.setZoomScale('cosmic_web')
      expect(cosmicHoloStarchart.currentZoom).toBe('cosmic_web')
      expect(cosmicHoloStarchart.filteredNodes.every(n => n.scale === 'cosmic_web')).toBe(true)
    })

    it('量子糾纏同步中繼節點應標記已糾纏並累加製圖數據', () => {
      const target = cosmicHoloStarchart.nodes.find(n => !n.entangled)
      if (target) {
        const prevData = cosmicHoloStarchart.stellarCartographyData
        const success = cosmicHoloStarchart.syncEntangledRelay(target.id)
        expect(success).toBe(true)
        expect(target.entangled).toBe(true)
        expect(cosmicHoloStarchart.stellarCartographyData).toBeGreaterThan(prevData)
      }
    })

    it('掃描深空星區應獲取製圖數據與增加觀測纖維', () => {
      const prevData = cosmicHoloStarchart.stellarCartographyData
      const prevCount = cosmicHoloStarchart.getState().observedFilamentCount
      const reward = cosmicHoloStarchart.scanStellarRegion()
      expect(reward).toBeGreaterThan(0)
      expect(cosmicHoloStarchart.stellarCartographyData).toBe(prevData + reward)
      expect(cosmicHoloStarchart.getState().observedFilamentCount).toBe(prevCount + 1)
    })

    it('解析暗物質纖維網應消耗製圖數據並提升糾纏同步率', () => {
      cosmicHoloStarchart.getState().stellarCartographyData = 200
      const prevSync = cosmicHoloStarchart.entanglementSyncRatePercent
      const success = cosmicHoloStarchart.analyzeDarkMatterFilament()
      expect(success).toBe(true)
      expect(cosmicHoloStarchart.entanglementSyncRatePercent).toBeGreaterThanOrEqual(prevSync)
    })
  })

  describe('4. 超光速因果律超弦通訊網 (Tachyonic Causality Mesh)', () => {
    it('應正確初始化快子通量、因果律完整度與未來電報', () => {
      const state = tachyonicCausalityMesh.getState()
      expect(state.tachyonicFlux).toBeGreaterThan(0)
      expect(state.causalityIntegrityPercent).toBeGreaterThan(0)
      expect(Object.keys(state.dispatches).length).toBe(4)
      expect(state.dispatches['tele_flare']).toBeDefined()
    })

    it('接收並驗收未來電報應增加快子通量與因果完整度', () => {
      const prevFlux = tachyonicCausalityMesh.tachyonicFlux
      const prevIntegrity = tachyonicCausalityMesh.causalityIntegrityPercent
      const success = tachyonicCausalityMesh.receiveFutureTransmission('tele_flare')
      expect(success).toBe(true)
      expect(tachyonicCausalityMesh.tachyonicFlux).toBeGreaterThan(prevFlux)
      expect(tachyonicCausalityMesh.causalityIntegrityPercent).toBeGreaterThanOrEqual(prevIntegrity)
      expect(tachyonicCausalityMesh.dispatches['tele_flare'].resolved).toBe(true)
    })

    it('接收未來電報應解鎖 tachyonic_prophet 成就', () => {
      tachyonicCausalityMesh.receiveFutureTransmission('tele_resources')
      expect(achievementsManager.isUnlocked('tachyonic_prophet')).toBe(true)
    })

    it('反向廣播先知預警應消耗快子並擴展逆時間位移', () => {
      tachyonicCausalityMesh.getState().tachyonicFlux = 200
      const prevOffset = tachyonicCausalityMesh.temporalTimelineOffsetSeconds
      const success = tachyonicCausalityMesh.transmitPrecognitiveWarning()
      expect(success).toBe(true)
      expect(tachyonicCausalityMesh.temporalTimelineOffsetSeconds).toBeLessThan(prevOffset)
    })

    it('啟動因果律阻尼器應修復因果完整度', () => {
      tachyonicCausalityMesh.getState().causalityIntegrityPercent = 70
      const success = tachyonicCausalityMesh.dampenCausalityParadox()
      expect(success).toBe(true)
      expect(tachyonicCausalityMesh.causalityIntegrityPercent).toBe(85)
    })
  })
})
