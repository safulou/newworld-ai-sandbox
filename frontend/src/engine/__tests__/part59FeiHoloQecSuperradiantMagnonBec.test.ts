import { describe, it, expect, beforeEach } from 'vitest'
import { FractionalExcitonicInsulatorEngine } from '../fractionalExcitonicInsulator'
import { HolographicQuantumErrorCorrectionCodeEngine } from '../holographicQuantumErrorCorrectionCode'
import { CavityQedSuperradiantTimeCrystalEngine } from '../cavityQedSuperradiantTimeCrystal'
import { MagnonPolaritonBecInterferometerEngine } from '../magnonPolaritonBecInterferometer'
import { AchievementSystem } from '../achievements'

describe('Part 59: Fractional Excitonic Insulator, Holographic QEC Bulk Reconstruction, Cavity-QED Superradiant Time Crystal & Magnon-Polariton BEC Interferometer', () => {
  describe('FractionalExcitonicInsulatorEngine', () => {
    let engine: FractionalExcitonicInsulatorEngine

    beforeEach(() => {
      engine = new FractionalExcitonicInsulatorEngine()
      engine.reset()
    })

    it('initializes in the nu=1/3 Fractional Excitonic Insulator regime with quantized counterflow Hall drag', () => {
      const state = engine.getState()
      expect(state.fractionalDenominatorM).toBe(3)
      expect(state.excitonicInsulatorGapMeV).toBeGreaterThan(2.0)
      expect(state.counterflowHallDragHPerE2).toBeGreaterThan(2.5)
      expect(state.excitonNodes.length).toBe(16)
    })

    it('switches across decoupled FCI, nu=1/3 FEI, CF counterflow superfluid, and nu=1/5 magnetoroton crystallization', () => {
      engine.setRegime('decoupled-bilayer-fractional-chern-liquid')
      expect(engine.getState().interlayerCoulombRatioUd).toBeCloseTo(0.45, 2)

      engine.setRegime('composite-fermion-counterflow-superfluid')
      expect(engine.getState().cfSuperfluidStiffnessKelvin).toBeGreaterThan(8.0)

      engine.setRegime('fractional-magnetoroton-crystallization')
      expect(engine.getState().fractionalDenominatorM).toBe(5)
    })

    it('modulates FEI pairing gap when interlayer Coulomb ratio or displacement field is tuned', () => {
      engine.setDisplacementField(5.0)
      engine.setInterlayerCoulombRatio(0.60)
      const lowGap = engine.getState().excitonicInsulatorGapMeV
      engine.setInterlayerCoulombRatio(3.20)
      expect(engine.getState().excitonicInsulatorGapMeV).toBeGreaterThan(lowGap)
    })

    it('evolves bilayer exciton dipole vortex nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.35)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets state cleanly', () => {
      engine.setDisplacementField(95.0)
      engine.reset()
      expect(engine.getState().displacementFieldMvNm).toBeCloseTo(18.0, 1)
    })
  })

  describe('HolographicQuantumErrorCorrectionCodeEngine', () => {
    let engine: HolographicQuantumErrorCorrectionCodeEngine

    beforeEach(() => {
      engine = new HolographicQuantumErrorCorrectionCodeEngine()
      engine.reset()
    })

    it('initializes on a {5,4} hyperbolic pentagon tensor network with high entanglement wedge fidelity', () => {
      const state = engine.getState()
      expect(state.activeRegime).toBe('happy-pentagon-perfect-tensor-code')
      expect(state.wedgeReconstructionFidelity).toBeGreaterThan(0.85)
      expect(state.rtMinimalCutBondCount).toBeGreaterThanOrEqual(4)
      expect(state.tensorNodes.length).toBe(19)
    })

    it('switches across HaPPY pentagon, greedy wedge, erasure threshold, and uberholography regimes', () => {
      engine.setRegime('greedy-entanglement-wedge-reconstruction')
      expect(engine.getState().wedgeReconstructionFidelity).toBeGreaterThan(0.95)

      engine.setRegime('erasure-threshold-phase-transition')
      expect(engine.getState().boundaryErasureRatePerase).toBeCloseTo(0.48, 2)
    })

    it('degrades bulk logical reconstruction fidelity when boundary erasure rate exceeds threshold', () => {
      engine.setBoundarySubregionFraction(0.75)
      engine.setBoundaryErasureRate(0.05)
      const highFid = engine.getState().wedgeReconstructionFidelity
      engine.setBoundaryErasureRate(0.58)
      expect(engine.getState().wedgeReconstructionFidelity).toBeLessThan(highFid)
    })

    it('updates hyperbolic tensor nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.4)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets holographic QEC parameters cleanly', () => {
      engine.setBoundarySubregionFraction(0.25)
      engine.reset()
      expect(engine.getState().boundarySubregionFractionFa).toBeCloseTo(0.68, 2)
    })
  })

  describe('CavityQedSuperradiantTimeCrystalEngine', () => {
    let engine: CavityQedSuperradiantTimeCrystalEngine

    beforeEach(() => {
      engine = new CavityQedSuperradiantTimeCrystalEngine()
      engine.reset()
    })

    it('initializes in the autonomous limit-cycle continuous time crystal regime', () => {
      const state = engine.getState()
      expect(state.activeRegime).toBe('autonomous-limit-cycle-continuous-time-crystal')
      expect(state.limitCycleFrequencyKhz).toBeGreaterThan(50)
      expect(state.liouvillianCoherenceQualityQ).toBeGreaterThan(100)
      expect(state.limitCycleNodes.length).toBe(16)
    })

    it('transitions across subthreshold decay, stationary Hepp-Lieb, limit-cycle CTC, and chaotic Dicke regimes', () => {
      engine.setRegime('subthreshold-normal-cavity-decay')
      expect(engine.getState().limitCycleFrequencyKhz).toBeLessThan(15)

      engine.setRegime('autonomous-limit-cycle-continuous-time-crystal')
      expect(engine.getState().schawlowTownesSuppressionDb).toBeGreaterThan(25)
    })

    it('increases limit-cycle oscillation frequency with collective Dicke cooperativity', () => {
      engine.setIncoherentRepumpRatio(1.5)
      engine.setCollectiveCooperativity(4.0)
      const fLow = engine.getState().limitCycleFrequencyKhz
      engine.setCollectiveCooperativity(18.0)
      expect(engine.getState().limitCycleFrequencyKhz).toBeGreaterThan(fLow)
    })

    it('evolves Dicke Bloch limit-cycle trajectory nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.3)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets cavity-QED time crystal state cleanly', () => {
      engine.setCollectiveCooperativity(2.0)
      engine.reset()
      expect(engine.getState().collectiveCooperativityC).toBeCloseTo(14.5, 1)
    })
  })

  describe('MagnonPolaritonBecInterferometerEngine', () => {
    let engine: MagnonPolaritonBecInterferometerEngine

    beforeEach(() => {
      engine = new MagnonPolaritonBecInterferometerEngine()
      engine.reset()
    })

    it('initializes with a macroscopic +-k0 magnon-polariton BEC and non-reciprocal DMI phase shift', () => {
      const state = engine.getState()
      expect(state.becCondensateFractionPct).toBeGreaterThan(50)
      expect(state.nonreciprocalSagnacPhaseRad).toBeGreaterThan(1.0)
      expect(state.condensateNodes.length).toBe(16)
    })

    it('switches across thermal gas, parametric BEC, strong Rabi coupling, and DMI Sagnac regimes', () => {
      engine.setRegime('subthreshold-thermal-magnon-gas')
      expect(engine.getState().becCondensateFractionPct).toBeLessThan(30)

      engine.setRegime('strong-coupling-magnon-polariton-rabi-split')
      expect(engine.getState().vacuumRabiCouplingMhz).toBeCloseTo(158.0, 1)
    })

    it('enhances non-reciprocal Sagnac phase shift when interfacial DMI constant increases', () => {
      engine.setInterfacialDmiConstant(0.20)
      const pLow = engine.getState().nonreciprocalSagnacPhaseRad
      engine.setInterfacialDmiConstant(1.90)
      expect(engine.getState().nonreciprocalSagnacPhaseRad).toBeGreaterThan(pLow)
    })

    it('updates double-minimum condensate interference nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.45)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets magnon-polariton BEC state cleanly', () => {
      engine.setParametricPumpRatio(0.40)
      engine.reset()
      expect(engine.getState().parametricPumpRatioPth).toBeCloseTo(2.35, 2)
    })
  })

  describe('Part 59 Achievements Registration', () => {
    it('registers all 4 Part 59 frontier physics achievements and reaches >= 252 total achievements', () => {
      const ach = new AchievementSystem()
      const all = ach.getAll()
      expect(all.length).toBeGreaterThanOrEqual(252)

      const ids = [
        'fractional_excitonic_insulator_bilayer',
        'holographic_qec_happy_bulk_reconstruction',
        'cavity_qed_superradiant_time_crystal',
        'magnon_polariton_bec_sagnac_interferometer',
      ]
      for (const id of ids) {
        expect(all.some((a) => a.id === id)).toBe(true)
      }
    })

    it('unlocks Part 59 achievements via AchievementSystem.unlock()', () => {
      const ach = new AchievementSystem()
      ach.unlock('fractional_excitonic_insulator_bilayer')
      ach.unlock('holographic_qec_happy_bulk_reconstruction')
      ach.unlock('cavity_qed_superradiant_time_crystal')
      ach.unlock('magnon_polariton_bec_sagnac_interferometer')

      expect(ach.isUnlocked('fractional_excitonic_insulator_bilayer')).toBe(true)
      expect(ach.isUnlocked('holographic_qec_happy_bulk_reconstruction')).toBe(true)
      expect(ach.isUnlocked('cavity_qed_superradiant_time_crystal')).toBe(true)
      expect(ach.isUnlocked('magnon_polariton_bec_sagnac_interferometer')).toBe(true)
    })
  })
})
