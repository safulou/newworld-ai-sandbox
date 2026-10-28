import { describe, it, expect, beforeEach } from 'vitest'
import { NonHermitianExceptionalSurfaceGyroscopeEngine } from '../nonHermitianExceptionalSurfaceGyroscope'
import { CausalDynamicalTriangulationsSpacetimeEngine } from '../causalDynamicalTriangulationsSpacetime'
import { UraniumTopologicalSpinTripletSuperconductorEngine } from '../uraniumTopologicalSpinTripletSuperconductor'
import { DipolarQuantumFerroelectricSuperfluidEngine } from '../dipolarQuantumFerroelectricSuperfluid'
import { AchievementSystem } from '../achievements'

describe('Part 58: Non-Hermitian ES3 Gyroscope, CDT Spacetime, UTe2 Spin-Triplet Superconductor & Dipolar Ferroelectric Superfluid', () => {
  describe('NonHermitianExceptionalSurfaceGyroscopeEngine', () => {
    let engine: NonHermitianExceptionalSurfaceGyroscopeEngine

    beforeEach(() => {
      engine = new NonHermitianExceptionalSurfaceGyroscopeEngine()
      engine.reset()
    })

    it('initializes on a 3rd-order exceptional surface with positive Sagnac sensitivity boost', () => {
      const state = engine.getState()
      expect(state.exceptionalOrderN).toBe(3)
      expect(state.sensitivityEnhancementFactor).toBeGreaterThan(10)
      expect(state.riemannNodes.length).toBe(18)
    })

    it('switches exceptional surface order between N=1, EP2, and ES3', () => {
      engine.setExceptionalOrder(1)
      expect(engine.getState().exceptionalOrderN).toBe(1)
      engine.setExceptionalOrder(2)
      expect(engine.getState().exceptionalOrderN).toBe(2)
      engine.setExceptionalOrder(3)
      expect(engine.getState().exceptionalOrderN).toBe(3)
    })

    it('amplifies cube-root Sagnac splitting when rotation rate or regime is tuned', () => {
      engine.setRotationRate(0.005)
      const before = engine.getState().eigenfrequencySplittingKhz
      engine.setRotationRate(0.050)
      expect(engine.getState().eigenfrequencySplittingKhz).toBeGreaterThan(before)

      engine.setRegime('petermann-noise-squeezed-quantum-gyro')
      expect(engine.getState().sensitivityEnhancementFactor).toBeGreaterThan(50)
    })

    it('updates Riemann surface branch nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.25)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets state cleanly', () => {
      engine.setRotationRate(1.2)
      engine.reset()
      expect(engine.getState().rotationRateRadPerSec).toBeCloseTo(0.015, 3)
    })
  })

  describe('CausalDynamicalTriangulationsSpacetimeEngine', () => {
    let engine: CausalDynamicalTriangulationsSpacetimeEngine

    beforeEach(() => {
      engine = new CausalDynamicalTriangulationsSpacetimeEngine()
      engine.reset()
    })

    it('initializes in De Sitter emergence Phase C_dS with UV spectral dimension near 2 and macroscopic d_H = 4', () => {
      const state = engine.getState()
      expect(state.activeRegime).toBe('emergent-4d-desitter-universe-cds')
      expect(state.uvPlanckSpectralDimDs0).toBeGreaterThan(1.8)
      expect(state.uvPlanckSpectralDimDs0).toBeLessThan(2.2)
      expect(state.macroscopicHausdorffDimDh).toBeCloseTo(4.0, 1)
    })

    it('transitions across Phase A (branched polymer) and Phase B (crumpled)', () => {
      engine.setRegime('branched-polymer-phase-a')
      expect(engine.getState().macroscopicHausdorffDimDh).toBeLessThan(3.0)

      engine.setRegime('crumpled-collapsed-phase-b')
      expect(engine.getState().macroscopicHausdorffDimDh).toBeGreaterThan(5.0)
    })

    it('tunes bare inverse Newton coupling kappa_0 and causal anisotropy Delta', () => {
      engine.setBareInverseNewtonKappa0(2.20)
      engine.setCausalAnisotropyDelta(0.60)
      expect(engine.getState().deSitterThreeVolumePeak).toBeGreaterThan(140)
    })

    it('evolves causal simplex slices during update', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.5)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
      expect(engine.getState().simplexNodes.length).toBe(16)
    })

    it('resets CDT geometry parameters to Phase C_dS defaults', () => {
      engine.setBareInverseNewtonKappa0(4.2)
      engine.reset()
      expect(engine.getState().activeRegime).toBe('emergent-4d-desitter-universe-cds')
    })
  })

  describe('UraniumTopologicalSpinTripletSuperconductorEngine', () => {
    let engine: UraniumTopologicalSpinTripletSuperconductorEngine

    beforeEach(() => {
      engine = new UraniumTopologicalSpinTripletSuperconductorEngine()
      engine.reset()
    })

    it('initializes in the high-field Lazarus spin-triplet superconducting dome at 46.5 T', () => {
      const state = engine.getState()
      expect(state.appliedFieldTeslaB).toBeCloseTo(46.5, 1)
      expect(state.activeRegime).toBe('lazarus-ultra-high-field-reentrant-dome')
      expect(state.tripletOrderParameterDMeV).toBeGreaterThan(0.2)
    })

    it('switches across zero-field chiral triplet, metamagnetic 35T jump, and Lazarus re-entrant regimes', () => {
      engine.setRegime('zero-field-chiral-triplet-sc1')
      expect(engine.getState().appliedFieldTeslaB).toBeCloseTo(1.5, 1)

      engine.setRegime('metamagnetic-critical-jump-35t')
      expect(engine.getState().metamagneticPolarizationMuB).toBeGreaterThan(1.0)

      engine.setRegime('lazarus-ultra-high-field-reentrant-dome')
      expect(engine.getState().pauliLimitExceedanceRatio).toBeGreaterThan(14.0)
    })

    it('tunes applied magnetic field and b-c plane tilt angle to optimize Lazarus gap', () => {
      engine.setAppliedFieldTesla(47.0)
      engine.setFieldTiltAngleDeg(28.0)
      expect(engine.getState().tripletOrderParameterDMeV).toBeGreaterThan(0.4)
      expect(engine.getState().chiralMajoranaConductanceE2H).toBeGreaterThan(0.8)
    })

    it('updates d-vector spin-triplet Fermi nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.3)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
      expect(engine.getState().tripletNodes.length).toBe(16)
    })

    it('resets UTe2 parameters cleanly', () => {
      engine.setAppliedFieldTesla(10.0)
      engine.reset()
      expect(engine.getState().appliedFieldTeslaB).toBeCloseTo(46.5, 1)
    })
  })

  describe('DipolarQuantumFerroelectricSuperfluidEngine', () => {
    let engine: DipolarQuantumFerroelectricSuperfluidEngine

    beforeEach(() => {
      engine = new DipolarQuantumFerroelectricSuperfluidEngine()
      engine.reset()
    })

    it('initializes with a stable LHY-stabilized ferroelectric droplet array and softened roton gap', () => {
      const state = engine.getState()
      expect(state.relativeDipolarStrengthEpsDd).toBeGreaterThan(1.0)
      expect(state.ferroelectricPolarizationOrder).toBeGreaterThan(0.8)
      expect(state.lhyQuantumRepulsionEnergyNhz).toBeGreaterThan(10)
      expect(state.dropletNodes.length).toBe(13)
    })

    it('tunes relative dipolar strength eps_dd across repulsive BEC, roton threshold, and supersolid droplet crystal regimes', () => {
      engine.setRegime('contact-dominated-repulsive-bec')
      expect(engine.getState().relativeDipolarStrengthEpsDd).toBeLessThan(1.0)

      engine.setRegime('roton-minimum-softening-threshold')
      expect(engine.getState().relativeDipolarStrengthEpsDd).toBeCloseTo(1.02, 2)

      engine.setRegime('ferroelectric-supersolid-droplet-crystal')
      expect(engine.getState().ferroelectricPolarizationOrder).toBeGreaterThan(0.95)
    })

    it('enhances LHY quantum repulsion and equilibrium droplet density when electric dipole moment increases', () => {
      engine.setRelativeDipolarStrength(1.5)
      engine.setEffectiveElectricDipole(1.2)
      const lhyLow = engine.getState().lhyQuantumRepulsionEnergyNhz
      engine.setEffectiveElectricDipole(3.8)
      expect(engine.getState().lhyQuantumRepulsionEnergyNhz).toBeGreaterThan(lhyLow)
    })

    it('updates droplet honeycomb lattice phase over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.4)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets dipolar superfluid state cleanly', () => {
      engine.setEffectiveElectricDipole(4.2)
      engine.reset()
      expect(engine.getState().effectiveElectricDipoleDebye).toBeCloseTo(2.6, 2)
    })
  })

  describe('Part 58 Achievements Registration', () => {
    it('registers all 4 Part 58 frontier physics achievements and reaches >= 248 total achievements', () => {
      const ach = new AchievementSystem()
      const all = ach.getAll()
      expect(all.length).toBeGreaterThanOrEqual(248)

      const ids = [
        'non_hermitian_exceptional_surface_gyro',
        'causal_dynamical_triangulations_spacetime',
        'uranium_spin_triplet_lazarus_superconductor',
        'dipolar_quantum_ferroelectric_superfluid',
      ]
      for (const id of ids) {
        expect(all.some((a) => a.id === id)).toBe(true)
      }
    })

    it('unlocks Part 58 achievements via AchievementSystem.unlock()', () => {
      const ach = new AchievementSystem()
      ach.unlock('non_hermitian_exceptional_surface_gyro')
      ach.unlock('causal_dynamical_triangulations_spacetime')
      ach.unlock('uranium_spin_triplet_lazarus_superconductor')
      ach.unlock('dipolar_quantum_ferroelectric_superfluid')

      expect(ach.isUnlocked('non_hermitian_exceptional_surface_gyro')).toBe(true)
      expect(ach.isUnlocked('causal_dynamical_triangulations_spacetime')).toBe(true)
      expect(ach.isUnlocked('uranium_spin_triplet_lazarus_superconductor')).toBe(true)
      expect(ach.isUnlocked('dipolar_quantum_ferroelectric_superfluid')).toBe(true)
    })
  })
})
