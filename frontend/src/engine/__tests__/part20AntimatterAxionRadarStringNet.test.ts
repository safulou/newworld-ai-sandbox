import { describe, it, expect, beforeEach, vi } from 'vitest'
import { antimatterPropulsion, ANTIMATTER_MODES } from '../antimatterPropulsion'
import { axionHaloscope, AXION_MODES } from '../axionHaloscope'
import { timeReversalRadar, TIME_REVERSAL_MODES } from '../timeReversalRadar'
import { stringNetCondensate, STRING_NET_PHASES } from '../stringNetCondensate'
import { achievements } from '../achievements'
import { useUIStore } from '../../stores/ui'
import { setActivePinia, createPinia } from 'pinia'

describe('Part 20: 前沿高能物理與拓撲冷凝矩陣整合測試套件', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 模擬 localStorage
    const store: Record<string, string> = {}
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v },
      removeItem: (k: string) => { delete store[k] },
      clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    })
  })

  describe('1. 反物質暗能量湮滅推進矩陣 (AntimatterPropulsionEngine)', () => {
    it('應正確初始化航行狀態與勞侖茲因子 γ', () => {
      antimatterPropulsion.velocityFraction = 0.6
      const gamma = antimatterPropulsion.lorentzGamma
      // 1 / sqrt(1 - 0.36) = 1 / 0.8 = 1.25
      expect(gamma).toBeCloseTo(1.25, 2)
      expect(antimatterPropulsion.currentIsp).toBeGreaterThan(1e6)
    })

    it('觸發湮滅微爆應消耗反物質並加速逼近光速', () => {
      antimatterPropulsion.antimatterReserveMg = 50.0
      antimatterPropulsion.velocityFraction = 0.5
      antimatterPropulsion.magneticNozzleIntegrity = 95.0
      const initialBursts = antimatterPropulsion.totalBursts

      const ok = antimatterPropulsion.triggerAnnihilationBurst()
      expect(ok).toBe(true)
      expect(antimatterPropulsion.antimatterReserveMg).toBeLessThan(50.0)
      expect(antimatterPropulsion.velocityFraction).toBeGreaterThan(0.5)
      expect(antimatterPropulsion.totalBursts).toBe(initialBursts + 1)
      expect(antimatterPropulsion.currentThrustKN).toBeGreaterThan(1000)
    })

    it('反物質枯竭時應拒絕微爆', () => {
      antimatterPropulsion.antimatterReserveMg = 0.5
      const ok = antimatterPropulsion.triggerAnnihilationBurst()
      expect(ok).toBe(false)
    })

    it('應支援切換 4 大推進模式與補給修復', () => {
      antimatterPropulsion.setMode('dark_energy_warp')
      expect(antimatterPropulsion.currentMode).toBe('dark_energy_warp')
      expect(ANTIMATTER_MODES.dark_energy_warp.gammaMultiplier).toBe(1.45)

      antimatterPropulsion.setDarkEnergyRatio(0.75)
      expect(antimatterPropulsion.darkEnergyRatio).toBe(0.75)

      antimatterPropulsion.magneticNozzleIntegrity = 70.0
      antimatterPropulsion.repairMagneticNozzle()
      expect(antimatterPropulsion.magneticNozzleIntegrity).toBe(88.0)

      antimatterPropulsion.antimatterReserveMg = 20.0
      antimatterPropulsion.restockAntimatter(30.0)
      expect(antimatterPropulsion.antimatterReserveMg).toBe(50.0)
    })

    it('主迴圈更新應隨時間推進光年與衰減推力', () => {
      antimatterPropulsion.currentThrustKN = 800.0
      const initialLy = antimatterPropulsion.accumulatedLightYears
      antimatterPropulsion.update(0.5)
      expect(antimatterPropulsion.currentThrustKN).toBeLessThan(800.0)
      expect(antimatterPropulsion.accumulatedLightYears).toBeGreaterThanOrEqual(initialLy)
    })
  })

  describe('2. 軸子暗物質暈微波共振腔 (AxionHaloscopeEngine)', () => {
    it('應正確計算微波共振頻率與對應軸子質量', () => {
      axionHaloscope.setTuningRodAngle(0)
      expect(axionHaloscope.resonanceFrequencyGhz).toBeCloseTo(4.5, 1)
      expect(axionHaloscope.axionMassMicroEV).toBeCloseTo(4.5 * 4.1357, 1)

      axionHaloscope.setTuningRodAngle(180)
      expect(axionHaloscope.resonanceFrequencyGhz).toBeCloseTo(7.2, 1)
    })

    it('調諧至共振峰時 SNR 應顯著提升並支援光子採集', () => {
      axionHaloscope.setMode('ksvz_hadronic')
      axionHaloscope.setMagneticField(12.0)
      axionHaloscope.systemNoiseTempKelvin = 0.12

      // 在共振角 72.4° 附近
      axionHaloscope.setTuningRodAngle(72.4)
      expect(axionHaloscope.currentSNR).toBeGreaterThan(5.0)

      const initialPhotons = axionHaloscope.axionPhotonsHarvested
      const harvested = axionHaloscope.harvestPhotons()
      expect(harvested).toBeGreaterThan(0)
      expect(axionHaloscope.axionPhotonsHarvested).toBe(initialPhotons + harvested)
    })

    it('頻帶自動掃描應步進調諧棒角度', () => {
      axionHaloscope.setTuningRodAngle(30.0)
      axionHaloscope.triggerSweep()
      expect(axionHaloscope.tuningRodAngleDeg).toBeCloseTo(42.0, 1)
    })

    it('支援切換 4 大軸子理論能區與磁場調諧', () => {
      axionHaloscope.setMode('string_compact_axion')
      expect(axionHaloscope.currentMode).toBe('string_compact_axion')
      expect(AXION_MODES.string_compact_axion.couplingG).toBe(4.12)

      axionHaloscope.setMagneticField(15.5)
      expect(axionHaloscope.magneticFieldTesla).toBe(15.5)
    })
  })

  describe('3. 量子糾纏時間鏡像拓撲雷達 (TimeReversalRadarEngine)', () => {
    it('應初始化雷達相干保真度與預設匿蹤目標', () => {
      expect(timeReversalRadar.coherenceIntegrity).toBeGreaterThan(0)
      expect(timeReversalRadar.targets.length).toBe(4)
      expect(timeReversalRadar.targets.every(t => typeof t.cloakingPercent === 'number')).toBe(true)
    })

    it('釋放時間反演聚焦脈衝應穿透隱匿並可能解密目標', () => {
      timeReversalRadar.coherenceIntegrity = 100
      timeReversalRadar.setMode('retrocausal_matrix') // 最高穿透因數 2.8

      const target = timeReversalRadar.targets[0]
      target.cloakingPercent = 30
      target.uncloaked = false
      const initialEchoes = timeReversalRadar.accumulatedEchoes

      timeReversalRadar.triggerPulse()
      expect(timeReversalRadar.isPulsing).toBe(true)
      expect(target.cloakingPercent).toBeLessThan(30)
      if (target.cloakingPercent <= 15) {
        expect(target.uncloaked).toBe(true)
        expect(timeReversalRadar.accumulatedEchoes).toBeGreaterThan(initialEchoes)
      }
    })

    it('超低溫量子泵應提升相干度', () => {
      timeReversalRadar.coherenceIntegrity = 50.0
      timeReversalRadar.tuneCoherenceStabilizer()
      expect(timeReversalRadar.coherenceIntegrity).toBe(62.0)
    })

    it('支援切換 4 大時間反演探測體制與刷新空域目標', () => {
      timeReversalRadar.setMode('closed_timelike_loop')
      expect(timeReversalRadar.currentMode).toBe('closed_timelike_loop')
      expect(TIME_REVERSAL_MODES.closed_timelike_loop.penetrationFactor).toBe(2.1)

      timeReversalRadar.refreshTargets()
      expect(timeReversalRadar.targets.length).toBe(4)
      expect(timeReversalRadar.targets.every(t => t.uncloaked === false)).toBe(true)
    })

    it('主迴圈更新應推進脈衝波前進度與掃描方位角', () => {
      timeReversalRadar.isPulsing = true
      timeReversalRadar.pulseProgress = 0.2
      timeReversalRadar.update(0.5)
      expect(timeReversalRadar.pulseProgress).toBeGreaterThan(0.2)
    })
  })

  describe('4. 全息共形場宇宙弦網冷凝 (StringNetCondensateEngine)', () => {
    it('應正確取得基態拓撲簡併度 D', () => {
      stringNetCondensate.setPhase('fibonacci_anyon_net')
      expect(stringNetCondensate.groundStateDegeneracy).toBe(5)

      stringNetCondensate.setPhase('toric_code_z2')
      expect(stringNetCondensate.groundStateDegeneracy).toBe(4)
      expect(STRING_NET_PHASES.toric_code_z2.anyonType).toBe('Abelian e/m/ε')
    })

    it('弦分支融合應提升純度並激發湧現光子通量', () => {
      stringNetCondensate.condensatePurity = 80.0
      const initialFlux = stringNetCondensate.emergentPhotonsFlux
      const initialFusions = stringNetCondensate.totalFusions

      stringNetCondensate.triggerBranchFusion()
      expect(stringNetCondensate.condensatePurity).toBeGreaterThan(80.0)
      expect(stringNetCondensate.emergentPhotonsFlux).toBeGreaterThan(initialFlux)
      expect(stringNetCondensate.totalFusions).toBe(initialFusions + 1)
    })

    it('激發開弦端點應湧現一對費米子準粒子', () => {
      stringNetCondensate.condensatePurity = 70.0
      const initialFermions = stringNetCondensate.emergentFermionsCount

      stringNetCondensate.exciteFermionPair()
      expect(stringNetCondensate.emergentFermionsCount).toBe(initialFermions + 2)
      expect(stringNetCondensate.condensatePurity).toBeLessThan(70.0)
    })

    it('真空基態淨化與弦密度調諧應正常運作', () => {
      stringNetCondensate.condensatePurity = 50.0
      stringNetCondensate.purifyGroundState()
      expect(stringNetCondensate.condensatePurity).toBeCloseTo(64.5, 1)

      stringNetCondensate.setBranchDensity(2.1)
      expect(stringNetCondensate.stringBranchDensity).toBe(2.1)
    })

    it('主迴圈更新應持續自然湧現光子通量', () => {
      const initialFlux = stringNetCondensate.emergentPhotonsFlux
      stringNetCondensate.update(1.0)
      expect(stringNetCondensate.emergentPhotonsFlux).toBeGreaterThan(initialFlux)
    })
  })

  describe('5. 元宇宙成就殿堂與 UI Store 整合驗證', () => {
    it('成就清單應包含至少 96 項，且包含 Part 20 四大終極物理成就', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(96)

      const p20Ids = ['antimatter_admiral', 'axion_primakov_pioneer', 'timereversal_specter', 'stringnet_demiurge']
      p20Ids.forEach((id) => {
        const found = all.find(a => a.id === id)
        expect(found).toBeDefined()
        expect(found?.title).toBeTruthy()
        expect(found?.description).toBeTruthy()
      })
    })

    it('UI Store 應正確切換 Part 20 四大模態視窗模式', () => {
      const ui = useUIStore()

      ui.openAntimatterPropulsion()
      expect(ui.mode).toBe('antimatter-propulsion')

      ui.openAxionHaloscope()
      expect(ui.mode).toBe('axion-haloscope')

      ui.openTimeReversalRadar()
      expect(ui.mode).toBe('time-reversal-radar')

      ui.openStringNet()
      expect(ui.mode).toBe('string-net')

      ui.setAntimatterPropulsionModal(false)
      expect(ui.mode).toBe('game')
    })
  })
})
