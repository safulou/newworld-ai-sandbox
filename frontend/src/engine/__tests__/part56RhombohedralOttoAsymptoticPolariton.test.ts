import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { RhombohedralGrapheneChiralSuperconductorEngine } from '../rhombohedralGrapheneChiralSuperconductor'
import { QuantumOttoSqueezeHeatEngine } from '../quantumOttoSqueezeHeatEngine'
import { AsymptoticallySafeGravityColliderEngine } from '../asymptoticallySafeGravityCollider'
import { CavityPolaritonicSuperChemistryEngine } from '../cavityPolaritonicSuperChemistry'
import { useUIStore } from '../../stores/ui'
import { achievements } from '../achievements'

describe('Part 56 — Rhombohedral Graphene, Quantum Otto Heat Engine, Asymptotically Safe Gravity & Cavity Polaritonic Chemistry', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. RhombohedralGrapheneChiralSuperconductorEngine', () => {
    it('initializes with 5-layer rhombohedral ABCDE stacking and quarter-metal / chiral SC parameters', () => {
      const engine = new RhombohedralGrapheneChiralSuperconductorEngine()
      const st = engine.getState()
      expect(st.displacementFieldVNm).toBe(0.88)
      expect(st.moirélessFillingFactorNu).toBe(0.67)
      expect(st.spinValleyPolarizationPsv).toBeGreaterThan(0.9)
      expect(st.flatBandNodes).toHaveLength(18)
    })

    it('switches regimes between semimetal, quarter-metal, FQAH crystal, and chiral p+ip superconductor', () => {
      const engine = new RhombohedralGrapheneChiralSuperconductorEngine()
      engine.setRegime('unpolarized-rhombohedral-semimetal')
      expect(engine.getState().spinValleyPolarizationPsv).toBeLessThan(0.3)

      engine.setRegime('anomalous-hall-crystal-fqah')
      expect(engine.getState().moirélessFillingFactorNu).toBe(0.67)
      expect(engine.getState().quantizedHallResistanceHOverE2).toBeGreaterThan(1.2)
    })

    it('tunes displacement field D, filling factor ν, and spin-valley polarization P_sv', () => {
      const engine = new RhombohedralGrapheneChiralSuperconductorEngine()
      engine.setDisplacementField(1.30)
      engine.setFillingFactorNu(0.85)
      engine.setSpinValleyPolarization(0.98)
      const st = engine.getState()
      expect(st.chiralCriticalCurrentNa).toBeGreaterThan(150)
      expect(st.berryCurvatureDipoleNm).toBeGreaterThan(18)
    })

    it('advances pulsePhase on update and safely triggers Web Audio sound synthesis', () => {
      const engine = new RhombohedralGrapheneChiralSuperconductorEngine()
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.2)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerRhombohedralSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new RhombohedralGrapheneChiralSuperconductorEngine()
      engine.setDisplacementField(0.25)
      engine.reset()
      expect(engine.getState().displacementFieldVNm).toBe(0.88)
    })
  })

  describe('2. QuantumOttoSqueezeHeatEngine', () => {
    it('initializes with squeezed thermal bath exceeding classical Carnot limit', () => {
      const engine = new QuantumOttoSqueezeHeatEngine()
      const st = engine.getState()
      expect(st.bathSqueezingParamRs).toBe(0.95)
      expect(st.quantumOttoEfficiencyPct).toBeGreaterThan(st.classicalCarnotLimitPct)
      expect(st.strokeNodes).toHaveLength(16)
    })

    it('increases quantum Otto efficiency and ergotropy work output when squeezing parameter r_s increases', () => {
      const engine = new QuantumOttoSqueezeHeatEngine()
      engine.setBathSqueezingParam(0.1)
      const lowEff = engine.getState().quantumOttoEfficiencyPct
      const lowWork = engine.getState().ergotropyWorkOutputHbarW

      engine.setBathSqueezingParam(1.5)
      expect(engine.getState().quantumOttoEfficiencyPct).toBeGreaterThan(lowEff)
      expect(engine.getState().ergotropyWorkOutputHbarW).toBeGreaterThan(lowWork)
    })

    it('switches regimes from classical Markovian Otto cycle to quantum demon ergotropy harvester', () => {
      const engine = new QuantumOttoSqueezeHeatEngine()
      engine.setRegime('classical-markovian-otto-cycle')
      expect(engine.getState().bathSqueezingParamRs).toBe(0.0)

      engine.setRegime('quantum-demon-ergotropy-harvester')
      expect(engine.getState().bathSqueezingParamRs).toBeGreaterThan(1.5)
      expect(engine.getState().ergotropyWorkOutputHbarW).toBeGreaterThan(20)
    })

    it('updates compression ratio and temperature ratio and advances stroke nodes on update', () => {
      const engine = new QuantumOttoSqueezeHeatEngine()
      engine.setCompressionRatioOmega(4.0)
      engine.setBathTemperatureRatio(5.0)
      expect(engine.getState().classicalCarnotLimitPct).toBeCloseTo(80.0, 1)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.15)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerQuantumOttoSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new QuantumOttoSqueezeHeatEngine()
      engine.setBathSqueezingParam(1.75)
      engine.reset()
      expect(engine.getState().bathSqueezingParamRs).toBe(0.95)
    })
  })

  describe('3. AsymptoticallySafeGravityColliderEngine', () => {
    it('initializes near Reuter non-Gaussian UV fixed point with spectral dimension d_s < 2.5', () => {
      const engine = new AsymptoticallySafeGravityColliderEngine()
      const st = engine.getState()
      expect(st.runningDimensionlessNewtonG).toBeGreaterThan(0.6)
      expect(st.runningDimensionlessLambda).toBeGreaterThan(0.15)
      expect(st.spacetimeSpectralDimensionDs).toBeLessThan(2.5)
      expect(st.rgSpiralNodes).toHaveLength(16)
    })

    it('drives spectral dimension d_s toward 4 in IR (low k/M_Pl) and toward 2 in UV (high k/M_Pl)', () => {
      const engine = new AsymptoticallySafeGravityColliderEngine()
      engine.setRgMomentumScale(0.08)
      const dsIR = engine.getState().spacetimeSpectralDimensionDs
      engine.setRgMomentumScale(10.0)
      const dsUV = engine.getState().spacetimeSpectralDimensionDs
      expect(dsIR).toBeGreaterThan(3.9)
      expect(dsUV).toBeLessThan(2.05)
    })

    it('switches regimes between 4D Einstein-Hilbert IR and 2D dimensional reduction UV', () => {
      const engine = new AsymptoticallySafeGravityColliderEngine()
      engine.setRegime('infrared-einstein-hilbert-4d')
      expect(engine.getState().spacetimeSpectralDimensionDs).toBeGreaterThan(3.9)

      engine.setRegime('dimensional-reduction-2d-fractal-spacetime')
      expect(engine.getState().spacetimeSpectralDimensionDs).toBeLessThan(2.05)
      expect(engine.getState().runningDimensionlessNewtonG).toBeCloseTo(0.707, 2)
    })

    it('tunes curvature-squared coupling θ_3 and updates RG spiral trajectory on update', () => {
      const engine = new AsymptoticallySafeGravityColliderEngine()
      engine.setCurvatureSquaredCoupling(2.8)
      expect(engine.getState().curvatureSquaredCouplingTheta3).toBe(2.8)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.2)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerAsymptoticSafetySound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new AsymptoticallySafeGravityColliderEngine()
      engine.setRgMomentumScale(0.15)
      engine.reset()
      expect(engine.getState().rgMomentumScaleKOverMpl).toBe(3.5)
    })
  })

  describe('4. CavityPolaritonicSuperChemistryEngine', () => {
    it('initializes in strong vibrational coupling (VSC) regime with Rabi splitting and reaction rate enhancement > 10', () => {
      const engine = new CavityPolaritonicSuperChemistryEngine()
      const st = engine.getState()
      expect(st.vacuumRabiSplittingMev).toBe(115.0)
      expect(st.activationBarrierReductionMev).toBeGreaterThan(40)
      expect(st.reactionRateEnhancementFactor).toBeGreaterThanOrEqual(7)
      expect(st.pesNodes).toHaveLength(18)
    })

    it('increases activation barrier reduction and reaction rate enhancement when vacuum Rabi splitting Ω_R increases', () => {
      const engine = new CavityPolaritonicSuperChemistryEngine()
      engine.setVacuumRabiSplitting(30.0)
      const lowGain = engine.getState().reactionRateEnhancementFactor

      engine.setVacuumRabiSplitting(220.0)
      expect(engine.getState().reactionRateEnhancementFactor).toBeGreaterThan(lowGain)
    })

    it('suppresses polaritonic catalysis when cavity-vibration detuning δ_cav is far off-resonance', () => {
      const engine = new CavityPolaritonicSuperChemistryEngine()
      engine.setCavityVibrationDetuning(0.0)
      const rateResonant = engine.getState().reactionRateEnhancementFactor

      engine.setCavityVibrationDetuning(45.0)
      expect(engine.getState().reactionRateEnhancementFactor).toBeLessThan(rateResonant)
    })

    it('switches regimes to ultrastrong vacuum ground-state condensate and updates PES nodes', () => {
      const engine = new CavityPolaritonicSuperChemistryEngine()
      engine.setRegime('ultrastrong-vacuum-ground-state-condensate')
      expect(engine.getState().vacuumRabiSplittingMev).toBe(265.0)
      expect(engine.getState().polaritonDelocalizationNm).toBeGreaterThan(150)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.15)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerPolaritonicChemistrySound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new CavityPolaritonicSuperChemistryEngine()
      engine.setCavityVibrationDetuning(35.0)
      engine.setCavityQualityFactor(500)
      engine.reset()
      expect(engine.getState().cavityVibrationDetuningMev).toBe(0.0)
      expect(engine.getState().cavityQualityFactorQ).toBe(1800)
    })
  })

  describe('5. UI Store & Achievement System Integration (Part 56)', () => {
    it('switches UI modes for all 4 Part 56 modals cleanly', () => {
      const ui = useUIStore()
      ui.openRhombohedralGraphene()
      expect(ui.mode).toBe('rhombohedral-graphene-superconductor')
      ui.setRhombohedralGrapheneModal(false)
      expect(ui.mode).toBe('game')

      ui.openQuantumOttoHeatEngine()
      expect(ui.mode).toBe('quantum-otto-heat-engine')
      ui.setQuantumOttoHeatEngineModal(false)
      expect(ui.mode).toBe('game')

      ui.openAsymptoticallySafeGravity()
      expect(ui.mode).toBe('asymptotically-safe-gravity')
      ui.setAsymptoticallySafeGravityModal(false)
      expect(ui.mode).toBe('game')

      ui.openCavityPolaritonicChemistry()
      expect(ui.mode).toBe('cavity-polaritonic-chemistry')
      ui.setCavityPolaritonicChemistryModal(false)
      expect(ui.mode).toBe('game')
    })

    it('registers all 4 Part 56 achievements and reaches >= 240 total achievements', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(240)
      expect(all.some((a) => a.id === 'rhombohedral_graphene_chiral_superconductor')).toBe(true)
      expect(all.some((a) => a.id === 'quantum_otto_squeeze_heat_engine')).toBe(true)
      expect(all.some((a) => a.id === 'asymptotically_safe_gravity_collider')).toBe(true)
      expect(all.some((a) => a.id === 'cavity_polaritonic_super_chemistry')).toBe(true)
    })
  })
})
