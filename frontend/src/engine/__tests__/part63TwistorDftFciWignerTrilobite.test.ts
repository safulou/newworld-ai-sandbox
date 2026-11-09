import { describe, it, expect, beforeEach } from 'vitest'
import { penroseTwistorSelfDualGravitonEngine } from '../penroseTwistorSelfDualGraviton'
import { doubleFieldTheoryNonGeometricFluxEngine } from '../doubleFieldTheoryNonGeometricFlux'
import { nonAbelianFciAnomalousWignerCrystalEngine } from '../nonAbelianFciAnomalousWignerCrystal'
import { ultralongRangeRydbergTrilobitePolaronEngine } from '../ultralongRangeRydbergTrilobitePolaron'
import { achievements } from '../achievements'

describe('Part 63 Frontier Engines: Penrose Twistor Graviton, Double Field Theory R-Flux, Non-Abelian FCI Wigner Crystal & Rydberg Trilobite Polaron', () => {
  describe('PenroseTwistorSelfDualGravitonEngine', () => {
    beforeEach(() => {
      penroseTwistorSelfDualGravitonEngine.reset()
    })

    it('initializes with nonlinear graviton self-dual Weyl deformation regime and 16 projective twistor line nodes', () => {
      const state = penroseTwistorSelfDualGravitonEngine.getState()
      expect(state.activeRegime).toBe('nonlinear-graviton-self-dual-weyl-deformation')
      expect(state.twistorNodes.length).toBe(16)
      expect(state.selfDualWeylCurvatureScalar).toBeGreaterThan(2.0)
      expect(state.wInfinityWardIdentityFidelity).toBeGreaterThan(0.9)
    })

    it('updates Hodges MHV graviton determinant amplitude and w_{1+∞} Ward fidelity across regimes', () => {
      penroseTwistorSelfDualGravitonEngine.setRegime('w-infinity-soft-graviton-symmetry-tower')
      const state = penroseTwistorSelfDualGravitonEngine.getState()
      expect(state.activeRegime).toBe('w-infinity-soft-graviton-symmetry-tower')
      expect(state.externalGravitonMultiplicityN).toBe(10)
      expect(state.hodgesMhvAmplitudeLogMod).toBeGreaterThan(5.0)
      expect(state.celestialTwistorOPEIndex).toBeGreaterThan(2.5)
    })

    it('clamps holomorphic deformation norm and advances twistor phase on update()', () => {
      penroseTwistorSelfDualGravitonEngine.setHolomorphicDeformationNorm(5.0)
      penroseTwistorSelfDualGravitonEngine.setExternalGravitonMultiplicity(20)
      const beforePhase = penroseTwistorSelfDualGravitonEngine.getState().pulsePhase
      penroseTwistorSelfDualGravitonEngine.update(0.25)
      const afterState = penroseTwistorSelfDualGravitonEngine.getState()
      expect(afterState.holomorphicDeformationNormH1).toBe(1.8)
      expect(afterState.externalGravitonMultiplicityN).toBe(12)
      expect(afterState.pulsePhase).toBeGreaterThan(beforePhase)
    })
  })

  describe('DoubleFieldTheoryNonGeometricFluxEngine', () => {
    beforeEach(() => {
      doubleFieldTheoryNonGeometricFluxEngine.reset()
    })

    it('initializes in locally non-geometric R-flux regime with 16 doubled torus coordinate nodes', () => {
      const state = doubleFieldTheoryNonGeometricFluxEngine.getState()
      expect(state.activeRegime).toBe('locally-nongeometric-nonassociative-r-flux')
      expect(state.doubledNodes.length).toBe(16)
      expect(state.jacobiatorNonAssociativity).toBeGreaterThan(2.0)
      expect(state.minimumQuantumVolumeLs3).toBeGreaterThan(1.5)
    })

    it('transitions across the Buscher T-duality chain H -> f -> Q -> R', () => {
      doubleFieldTheoryNonGeometricFluxEngine.setRegime('kalb-ramond-h-flux-geometric-torus')
      expect(doubleFieldTheoryNonGeometricFluxEngine.getState().tDualityBuscherChainStep).toBe(0)

      doubleFieldTheoryNonGeometricFluxEngine.setRegime('monodromy-t-fold-nongeometric-q-flux')
      expect(doubleFieldTheoryNonGeometricFluxEngine.getState().tDualityBuscherChainStep).toBe(2)

      doubleFieldTheoryNonGeometricFluxEngine.setRegime('locally-nongeometric-nonassociative-r-flux')
      const state = doubleFieldTheoryNonGeometricFluxEngine.getState()
      expect(state.tDualityBuscherChainStep).toBe(3)
      expect(state.sectionConditionViolationIndex).toBeGreaterThan(0.85)
    })

    it('clamps non-geometric R-flux quantum and advances phase on update()', () => {
      doubleFieldTheoryNonGeometricFluxEngine.setNonGeometricRFlux(12.0)
      doubleFieldTheoryNonGeometricFluxEngine.setWindingMomentumMixAngle(120.0)
      const beforePhase = doubleFieldTheoryNonGeometricFluxEngine.getState().pulsePhase
      doubleFieldTheoryNonGeometricFluxEngine.update(0.2)
      const state = doubleFieldTheoryNonGeometricFluxEngine.getState()
      expect(state.nonGeometricRFluxQuantum).toBe(6.0)
      expect(state.windingMomentumMixAngleDeg).toBe(90.0)
      expect(state.pulsePhase).toBeGreaterThan(beforePhase)
    })
  })

  describe('NonAbelianFciAnomalousWignerCrystalEngine', () => {
    beforeEach(() => {
      nonAbelianFciAnomalousWignerCrystalEngine.reset()
    })

    it('initializes in Moore-Read Pfaffian FCI regime with 6-fold torus GSD and 3/2 thermal Hall conductance', () => {
      const state = nonAbelianFciAnomalousWignerCrystalEngine.getState()
      expect(state.activeRegime).toBe('second-miniband-moore-read-pfaffian-fci')
      expect(state.torusGroundStateDegeneracy).toBe(6)
      expect(state.halfIntegerThermalHallK0).toBe(1.5)
      expect(state.crystalNodes.length).toBe(16)
    })

    it('drives reentrant phase transition to Anomalous Hall Wigner Crystal at high Coulomb ratio r_s', () => {
      nonAbelianFciAnomalousWignerCrystalEngine.setRegime('reentrant-anomalous-hall-wigner-crystal')
      const state = nonAbelianFciAnomalousWignerCrystalEngine.getState()
      expect(state.activeRegime).toBe('reentrant-anomalous-hall-wigner-crystal')
      expect(state.wignerCrystalBraggOrder).toBeGreaterThan(0.9)
      expect(state.torusGroundStateDegeneracy).toBe(1)
      expect(state.halfIntegerThermalHallK0).toBe(1.0)
    })

    it('clamps Coulomb-to-bandwidth ratio and quantum metric trace excess', () => {
      nonAbelianFciAnomalousWignerCrystalEngine.setCoulombToBandwidthRatio(25.0)
      nonAbelianFciAnomalousWignerCrystalEngine.setQuantumMetricTraceExcess(3.0)
      const state = nonAbelianFciAnomalousWignerCrystalEngine.getState()
      expect(state.coulombToBandwidthRatioRs).toBe(14.0)
      expect(state.quantumMetricTraceExcess).toBe(1.2)
    })
  })

  describe('UltralongRangeRydbergTrilobitePolaronEngine', () => {
    beforeEach(() => {
      ultralongRangeRydbergTrilobitePolaronEngine.reset()
    })

    it('initializes with kilodebye trilobite macrodimer and 16 wavefunction lobe nodes', () => {
      const state = ultralongRangeRydbergTrilobitePolaronEngine.getState()
      expect(state.activeRegime).toBe('high-l-trilobite-kilodebye-macrodimer')
      expect(state.lobeNodes.length).toBe(16)
      expect(state.permanentDipoleMomentDebye).toBeGreaterThan(1500)
      expect(state.equilibriumBondLengthA0).toBeGreaterThan(1800)
    })

    it('switches between p-wave butterfly state and many-body Rydberg Bose polaron shell', () => {
      ultralongRangeRydbergTrilobitePolaronEngine.setRegime('p-wave-shape-resonance-butterfly-state')
      const butterflyBond = ultralongRangeRydbergTrilobitePolaronEngine.getState().equilibriumBondLengthA0

      ultralongRangeRydbergTrilobitePolaronEngine.setRegime('many-body-rydberg-bose-polaron-shell')
      const polaronState = ultralongRangeRydbergTrilobitePolaronEngine.getState()
      expect(polaronState.equilibriumBondLengthA0).toBeGreaterThan(butterflyBond)
      expect(polaronState.polaronBoundBosonCount).toBeGreaterThan(40)
      expect(polaronState.ramseyPolaronRedshiftMHz).toBeGreaterThan(150)
    })

    it('clamps principal quantum number n and BEC density log', () => {
      ultralongRangeRydbergTrilobitePolaronEngine.setPrincipalQuantumNumber(150)
      ultralongRangeRydbergTrilobitePolaronEngine.setBecBackgroundDensityLog(20.0)
      const state = ultralongRangeRydbergTrilobitePolaronEngine.getState()
      expect(state.principalQuantumNumberN).toBe(95)
      expect(state.becBackgroundDensityLogCm3).toBe(15.2)
    })
  })

  describe('Part 63 Achievements Registration', () => {
    it('registers all 4 Part 63 achievements and reaches >= 268 total achievements', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(268)

      const ids = new Set(all.map(a => a.id))
      expect(ids.has('penrose_twistor_self_dual_graviton_amplitude')).toBe(true)
      expect(ids.has('double_field_theory_non_geometric_r_flux')).toBe(true)
      expect(ids.has('non_abelian_fci_anomalous_wigner_crystal')).toBe(true)
      expect(ids.has('ultralong_range_rydberg_trilobite_polaron')).toBe(true)
    })
  })
})
