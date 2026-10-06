import { describe, it, expect, beforeEach, vi } from 'vitest'
import { supergravitySpinor, SUGRA_MODES } from '../supergravitySpinor'
import { penroseCCCDetector, CCC_MODES } from '../penroseCCCDetector'
import { quantumAnomalousHall, QAH_ARCHITECTURES } from '../quantumAnomalousHall'
import { fermionicDarkMatter, DARK_FERMI_MODES } from '../fermionicDarkMatter'
import { achievements } from '../achievements'
import { useUIStore } from '../../stores/ui'
import { setActivePinia, createPinia } from 'pinia'

describe('Part 21: 超引力旋量、潘洛斯共形循環、量子反常霍爾與費米暗物質整合測試', () => {
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

  describe('1. 旋量網絡超引力旋轉推進 (SupergravitySpinorEngine)', () => {
    it('應正確計算有效慣性質量係數並支援 100% 慣性消融', () => {
      supergravitySpinor.setInertiaSuppression(80.0)
      expect(supergravitySpinor.effectiveInertialMassRatio).toBeCloseTo(0.20, 2)

      supergravitySpinor.setInertiaSuppression(100.0)
      expect(supergravitySpinor.effectiveInertialMassRatio).toBeLessThan(0.001)
    })

    it('觸發無慣性超引力幾何躍遷應累積通量並推進次數', () => {
      supergravitySpinor.gravitinoCoherence = 90.0
      const initialFlux = supergravitySpinor.twistorFlux
      const initialJumps = supergravitySpinor.totalSpinorJumps

      const ok = supergravitySpinor.triggerSpinorJump()
      expect(ok).toBe(true)
      expect(supergravitySpinor.isJumping).toBe(true)
      expect(supergravitySpinor.twistorFlux).toBeGreaterThan(initialFlux)
      expect(supergravitySpinor.totalSpinorJumps).toBe(initialJumps + 1)
      expect(supergravitySpinor.gravitinoCoherence).toBeLessThan(90.0)
    })

    it('相干度不足時應拒絕無慣性躍遷', () => {
      supergravitySpinor.gravitinoCoherence = 15.0
      const ok = supergravitySpinor.triggerSpinorJump()
      expect(ok).toBe(false)
    })

    it('引力微子調諧與模式切換應正常運作', () => {
      supergravitySpinor.gravitinoCoherence = 50.0
      supergravitySpinor.tuneGravitinoCoherence()
      expect(supergravitySpinor.gravitinoCoherence).toBe(65.0)

      supergravitySpinor.setMode('twistor_spinor_warp')
      expect(supergravitySpinor.currentMode).toBe('twistor_spinor_warp')
      expect(SUGRA_MODES.twistor_spinor_warp.inertiaSuppressionMultiplier).toBe(1.7)
    })

    it('主迴圈更新應隨時間推進旋量角動量', () => {
      supergravitySpinor.isJumping = true
      supergravitySpinor.jumpProgress = 0.2
      supergravitySpinor.update(0.5)
      expect(supergravitySpinor.jumpProgress).toBeGreaterThan(0.2)
    })
  })

  describe('2. 潘洛斯宇宙循環相干引力波測量儀 (PenroseCCCDetectorEngine)', () => {
    it('應正確初始化當前宇宙紀元與共形平滑度', () => {
      expect(penroseCCCDetector.aeonIndex).toBeGreaterThanOrEqual(1)
      expect(penroseCCCDetector.metricCurvatureSmoothness).toBeGreaterThan(0)
    })

    it('掃描 CMB 霍金點應累積捕獲環數並更新信噪比', () => {
      const initialPoints = penroseCCCDetector.hawkingPointsLogged
      const gained = penroseCCCDetector.scanHawkingPoints()
      expect(gained).toBeGreaterThanOrEqual(1)
      expect(penroseCCCDetector.hawkingPointsLogged).toBe(initialPoints + gained)
      expect(penroseCCCDetector.cccGravitonSNR).toBeGreaterThan(0)
    })

    it('調諧共形比例因子 Ω 與切換觀測體制', () => {
      penroseCCCDetector.setConformalOmega(2.45)
      expect(penroseCCCDetector.conformalFactorOmega).toBe(2.45)

      penroseCCCDetector.setMode('conformal_rescaling_metric')
      expect(penroseCCCDetector.currentMode).toBe('conformal_rescaling_metric')
      expect(CCC_MODES.conformal_rescaling_metric.snrMultiplier).toBe(2.0)
    })

    it('跨越共形邊界應推進宇宙紀元索引', () => {
      const currentAeon = penroseCCCDetector.aeonIndex
      penroseCCCDetector.advanceAeon()
      expect(penroseCCCDetector.aeonIndex).toBe(currentAeon + 1)
      expect(penroseCCCDetector.horizonIntegrity).toBe(100.0)
    })

    it('主迴圈更新應維持引力子背景數值活性', () => {
      penroseCCCDetector.update(1.0)
      expect(typeof penroseCCCDetector.cccGravitonSNR).toBe('number')
    })
  })

  describe('3. 量子霍爾反常邊緣態超流體晶片 (QuantumAnomalousHallEngine)', () => {
    it('應正確反映架構之雜質散射免疫度', () => {
      quantumAnomalousHall.setArchitecture('ferromagnetic_cr_bi2te3')
      expect(quantumAnomalousHall.defectImmunityPercent).toBe(96.5)
      expect(quantumAnomalousHall.quantumConductanceQuanta).toBe(1)
    })

    it('執行零耗散拓撲量子運算應推進運算計數', () => {
      const initialOps = quantumAnomalousHall.qubitOperationsCount
      const ops = quantumAnomalousHall.executeTopologicalCompute()
      expect(ops).toBeGreaterThan(0)
      expect(quantumAnomalousHall.qubitOperationsCount).toBe(initialOps + ops)
    })

    it('注入低溫聲子阻尼應提升能隙與超流速度', () => {
      quantumAnomalousHall.bandgapMilliEV = 30.0
      quantumAnomalousHall.chipTemperatureMilliKelvin = 25.0
      quantumAnomalousHall.coolAndStabilize()
      expect(quantumAnomalousHall.bandgapMilliEV).toBeGreaterThan(30.0)
      expect(quantumAnomalousHall.chipTemperatureMilliKelvin).toBeLessThan(25.0)
    })

    it('切換至馬約拉納零能模匯流排架構', () => {
      quantumAnomalousHall.setArchitecture('majorana_zero_mode_bus')
      expect(quantumAnomalousHall.currentArchitecture).toBe('majorana_zero_mode_bus')
      expect(QAH_ARCHITECTURES.majorana_zero_mode_bus.defectImmunity).toBe(99.8)
    })

    it('主迴圈更新應自然積累拓撲運算', () => {
      const initialOps = quantumAnomalousHall.qubitOperationsCount
      quantumAnomalousHall.update(1.0)
      expect(quantumAnomalousHall.qubitOperationsCount).toBeGreaterThan(initialOps)
    })
  })

  describe('4. 費米子暗物質費米面量子壓縮透鏡 (FermionicDarkMatterEngine)', () => {
    it('應正確計算費米波長與動量關係', () => {
      fermionicDarkMatter.setFermiMomentum(20.0)
      expect(fermionicDarkMatter.fermiWavelengthAngstrom).toBeCloseTo(12.398 / 20.0, 2)
    })

    it('探測費米球波前應發現暗天體並提升簡併壓', () => {
      const initialBodies = fermionicDarkMatter.discoveredDarkBodiesCount
      const initialPressure = fermionicDarkMatter.pauliPressureMegaPascal
      const ok = fermionicDarkMatter.probeFermiSurface()
      expect(ok).toBe(true)
      expect(fermionicDarkMatter.discoveredDarkBodiesCount).toBe(initialBodies + 1)
      expect(fermionicDarkMatter.pauliPressureMegaPascal).toBeGreaterThan(initialPressure)
    })

    it('調諧量子壓縮度與切換能態模式', () => {
      fermionicDarkMatter.setQuantumSqueezing(18.5)
      expect(fermionicDarkMatter.quantumSqueezingDb).toBe(18.5)

      fermionicDarkMatter.setMode('pauli_degeneracy_core')
      expect(fermionicDarkMatter.currentMode).toBe('pauli_degeneracy_core')
      expect(DARK_FERMI_MODES.pauli_degeneracy_core.fermiRadiusScale).toBe(1.4)
    })

    it('主迴圈更新應維持透鏡分辨率進展', () => {
      fermionicDarkMatter.lensResolutionPercent = 80.0
      fermionicDarkMatter.update(1.0)
      expect(fermionicDarkMatter.lensResolutionPercent).toBeGreaterThanOrEqual(80.0)
    })
  })

  describe('5. 成就殿堂 100 項里程碑與 UI Store 整合驗證', () => {
    it('成就清單應圓滿達成 100 項終極里程碑，並包含 Part 21 四大前沿物理成就', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(100)

      const p21Ids = [
        'supergravity_twistor_pilot',
        'penrose_ccc_chronicler',
        'topological_superfluid_architect',
        'dark_fermi_squeezer',
      ]
      p21Ids.forEach((id) => {
        const found = all.find(a => a.id === id)
        expect(found).toBeDefined()
        expect(found?.title).toBeTruthy()
        expect(found?.description).toBeTruthy()
      })
    })

    it('UI Store 應正確切換 Part 21 四大模態視窗模式', () => {
      const ui = useUIStore()

      ui.openSupergravitySpinor()
      expect(ui.mode).toBe('supergravity-spinor')

      ui.openPenroseCCC()
      expect(ui.mode).toBe('penrose-ccc')

      ui.openQuantumAnomalousHall()
      expect(ui.mode).toBe('quantum-anomalous-hall')

      ui.openFermionicDarkMatter()
      expect(ui.mode).toBe('fermionic-dark-matter')

      ui.setSupergravitySpinorModal(false)
      expect(ui.mode).toBe('game')
    })
  })
})
