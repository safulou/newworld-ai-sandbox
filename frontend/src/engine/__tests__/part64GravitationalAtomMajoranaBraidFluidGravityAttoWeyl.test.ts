import { describe, it, expect, beforeEach } from 'vitest'
import { primordialBlackHoleAxionGravitationalAtomEngine } from '../primordialBlackHoleAxionGravitationalAtom'
import { majoranaSuperfluidVortexBraidingComputerEngine } from '../majoranaSuperfluidVortexBraidingComputer'
import { holographicFluidGravityHorizonTurbulenceEngine } from '../holographicFluidGravityHorizonTurbulence'
import { attosecondWeylHighHarmonicBerrySpectrometerEngine } from '../attosecondWeylHighHarmonicBerrySpectrometer'
import { achievements } from '../achievements'

describe('Part 64 Frontier Engines: PBH Axion Gravitational Atom, Majorana Vortex Braiding Computer, Holographic Fluid-Gravity Turbulence & Attosecond Weyl HHG Berry Spectrometer', () => {
  describe('PrimordialBlackHoleAxionGravitationalAtomEngine', () => {
    beforeEach(() => {
      primordialBlackHoleAxionGravitationalAtomEngine.reset()
    })

    it('initializes in |211> dipole superradiant cloud growth regime with 16 orbital nodes', () => {
      const state = primordialBlackHoleAxionGravitationalAtomEngine.getState()
      expect(state.activeRegime).toBe('superradiant-211-dipole-cloud-growth')
      expect(state.orbitalNodes.length).toBe(16)
      expect(state.axionCloudMassFractionPct).toBeGreaterThan(3.0)
      expect(state.reggeSpinDownEquilibriumA).toBeGreaterThan(0.5)
    })

    it('triggers Bosenova criticality above threshold in attractive axion self-interaction regime', () => {
      primordialBlackHoleAxionGravitationalAtomEngine.setRegime('attractive-axion-self-interaction-bosenova')
      const state = primordialBlackHoleAxionGravitationalAtomEngine.getState()
      expect(state.activeRegime).toBe('attractive-axion-self-interaction-bosenova')
      expect(state.bosenovaCriticalityRatio).toBeGreaterThan(1.0)
      expect(state.monochromaticGwStrainLog10).toBeGreaterThan(-20.0)
    })

    it('clamps gravitational fine-structure constant alpha_g and Kerr spin a_*', () => {
      primordialBlackHoleAxionGravitationalAtomEngine.setGravitationalFineStructureAlpha(0.95)
      primordialBlackHoleAxionGravitationalAtomEngine.setInitialKerrSpinParameter(1.5)
      const beforePhase = primordialBlackHoleAxionGravitationalAtomEngine.getState().pulsePhase
      primordialBlackHoleAxionGravitationalAtomEngine.update(0.25)
      const state = primordialBlackHoleAxionGravitationalAtomEngine.getState()
      expect(state.gravitationalFineStructureAlpha).toBe(0.48)
      expect(state.initialKerrSpinParameter).toBe(0.99)
      expect(state.pulsePhase).toBeGreaterThan(beforePhase)
    })
  })

  describe('MajoranaSuperfluidVortexBraidingComputerEngine', () => {
    beforeEach(() => {
      majoranaSuperfluidVortexBraidingComputerEngine.reset()
    })

    it('initializes with 16 vortex core nodes and 2^(N-1) ground state manifold dimension', () => {
      const state = majoranaSuperfluidVortexBraidingComputerEngine.getState()
      expect(state.vortexNodes.length).toBe(16)
      expect(state.activeHalfQuantumVortexCount).toBe(8)
      expect(state.groundStateManifoldDimension).toBe(8)
      expect(state.magicStateDistillationFidelity).toBeGreaterThan(0.99)
    })

    it('scales ground-state degeneracy and suppresses logical gate error in fault-tolerant universal braid regime', () => {
      majoranaSuperfluidVortexBraidingComputerEngine.setRegime('fault-tolerant-universal-braid-circuit')
      const state = majoranaSuperfluidVortexBraidingComputerEngine.getState()
      expect(state.activeHalfQuantumVortexCount).toBe(14)
      expect(state.groundStateManifoldDimension).toBe(64)
      expect(state.logicalCliffordGateErrorLog10).toBeLessThan(-12.0)
      expect(state.quasiparticlePoisoningTimeMs).toBeGreaterThan(1000)
    })

    it('enforces even half-quantum vortex counts and clamps CdGM minigap ratio', () => {
      majoranaSuperfluidVortexBraidingComputerEngine.setActiveHalfQuantumVortexCount(11)
      majoranaSuperfluidVortexBraidingComputerEngine.setCdgmCoreMinigapRatio(50.0)
      const state = majoranaSuperfluidVortexBraidingComputerEngine.getState()
      expect(state.activeHalfQuantumVortexCount % 2).toBe(0)
      expect(state.cdgmCoreMinigapRatio).toBe(24.0)
    })
  })

  describe('HolographicFluidGravityHorizonTurbulenceEngine', () => {
    beforeEach(() => {
      holographicFluidGravityHorizonTurbulenceEngine.reset()
    })

    it('initializes in inverse energy cascade regime with fractal horizon dimension D_H > 2', () => {
      const state = holographicFluidGravityHorizonTurbulenceEngine.getState()
      expect(state.activeRegime).toBe('inverse-energy-cascade-kolmogorov-k53')
      expect(state.eddyNodes.length).toBe(16)
      expect(state.horizonFractalDimensionDh).toBeGreaterThan(2.2)
      expect(state.kssViscosityToEntropyRatio4Pi).toBeCloseTo(0.84, 2)
    })

    it('modifies KSS viscosity-to-entropy bound via Gauss-Bonnet coupling and approaches Kolmogorov 5/3 slope at high Re', () => {
      holographicFluidGravityHorizonTurbulenceEngine.setRegime('giant-vortex-dipole-superfluid-condensate')
      const state = holographicFluidGravityHorizonTurbulenceEngine.getState()
      expect(state.kssViscosityToEntropyRatio4Pi).toBeLessThan(0.70)
      expect(state.horizonFractalDimensionDh).toBeGreaterThan(2.5)
      expect(state.inverseCascadeSpectralSlope).toBeLessThan(1.75)
    })

    it('clamps superfluid Reynolds number log10 and Gauss-Bonnet coupling lambda_GB', () => {
      holographicFluidGravityHorizonTurbulenceEngine.setSuperfluidReynoldsNumberLog10(12.0)
      holographicFluidGravityHorizonTurbulenceEngine.setGaussBonnetCouplingLambda(0.50)
      const state = holographicFluidGravityHorizonTurbulenceEngine.getState()
      expect(state.superfluidReynoldsNumberLog10).toBe(6.0)
      expect(state.gaussBonnetCouplingLambda).toBe(0.09)
    })
  })

  describe('AttosecondWeylHighHarmonicBerrySpectrometerEngine', () => {
    beforeEach(() => {
      attosecondWeylHighHarmonicBerrySpectrometerEngine.reset()
    })

    it('initializes in Berry monopole anomalous even-harmonics regime with sub-100as pulse width', () => {
      const state = attosecondWeylHighHarmonicBerrySpectrometerEngine.getState()
      expect(state.activeRegime).toBe('berry-monopole-anomalous-even-harmonics')
      expect(state.harmonicNodes.length).toBe(16)
      expect(state.isolatedAttosecondPulseWidthAs).toBeLessThan(100.0)
      expect(state.evenToOddBerryHarmonicRatio).toBeGreaterThan(0.5)
    })

    it('compresses isolated chiral XUV pulse width below 55 as at high electric field and C_Weyl = 4', () => {
      attosecondWeylHighHarmonicBerrySpectrometerEngine.setRegime('isolated-sub100as-chiral-xuv-attosecond-pulse')
      const state = attosecondWeylHighHarmonicBerrySpectrometerEngine.getState()
      expect(state.weylMonopoleChiralityCharge).toBe(4)
      expect(state.highHarmonicCutoffOrderN).toBeGreaterThan(40)
      expect(state.isolatedAttosecondPulseWidthAs).toBeLessThan(50.0)
    })

    it('clamps peak laser electric field and snaps Weyl monopole charge to valid topological integers {1, 2, 4}', () => {
      attosecondWeylHighHarmonicBerrySpectrometerEngine.setPeakLaserElectricField(80.0)
      attosecondWeylHighHarmonicBerrySpectrometerEngine.setWeylMonopoleChiralityCharge(3)
      const state = attosecondWeylHighHarmonicBerrySpectrometerEngine.getState()
      expect(state.peakLaserElectricFieldMvCm).toBe(36.0)
      expect([1, 2, 4]).toContain(state.weylMonopoleChiralityCharge)
    })
  })

  describe('Part 64 Achievements Registration', () => {
    it('registers all 4 Part 64 achievements and reaches >= 272 total achievements', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(272)

      const ids = new Set(all.map(a => a.id))
      expect(ids.has('pbh_superradiant_axion_gravitational_atom')).toBe(true)
      expect(ids.has('majorana_superfluid_vortex_braiding_computer')).toBe(true)
      expect(ids.has('holographic_fluid_gravity_horizon_turbulence')).toBe(true)
      expect(ids.has('attosecond_weyl_high_harmonic_berry_pulse')).toBe(true)
    })
  })
})
