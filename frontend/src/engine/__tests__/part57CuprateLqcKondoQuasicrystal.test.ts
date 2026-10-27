import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { TwistedCuprateHighTcJosephsonEngine } from '../twistedCuprateHighTcJosephson'
import { LoopQuantumCosmologyBouncePlanckStarEngine } from '../loopQuantumCosmologyBouncePlanckStar'
import { HeavyFermionKondoBreakdownQcpEngine } from '../heavyFermionKondoBreakdownQcp'
import { QuasicrystalTopologicalPhononDiodeEngine } from '../quasicrystalTopologicalPhononDiode'
import { useUIStore } from '../../stores/ui'
import { achievements } from '../achievements'

describe('Part 57 — Twisted Bilayer Cuprate d+id Josephson, LQC Big Bounce Planck Star, Heavy-Fermion Kondo QCP & Quasicrystal Phonon Diode', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('1. TwistedCuprateHighTcJosephsonEngine', () => {
    it('initializes near 45° magic twist angle with dominant 4e co-tunneling and chiral d+id topological gap', () => {
      const engine = new TwistedCuprateHighTcJosephsonEngine()
      const st = engine.getState()
      expect(st.twistAngleDeg).toBe(44.6)
      expect(st.coTunnelingHarmonicRatioJ2J1).toBeGreaterThan(2.5)
      expect(st.spontaneousTrsPhaseDeg).toBeGreaterThan(70)
      expect(st.chiralTopologicalGapMev).toBeGreaterThan(10)
      expect(st.lobeNodes).toHaveLength(16)
    })

    it('suppresses J2/|J1| and TRS breaking phase when twist angle moves away from 45° toward 30°', () => {
      const engine = new TwistedCuprateHighTcJosephsonEngine()
      engine.setTwistAngleDeg(31.0)
      expect(engine.getState().coTunnelingHarmonicRatioJ2J1).toBeLessThan(1.0)
      expect(engine.getState().spontaneousTrsPhaseDeg).toBeLessThan(35)
    })

    it('increases chiral topological gap and diode rectification when J2 co-tunneling increases near 45°', () => {
      const engine = new TwistedCuprateHighTcJosephsonEngine()
      engine.setTwistAngleDeg(44.8)
      engine.setInterlayerCouplingJ2(1.0)
      const lowGap = engine.getState().chiralTopologicalGapMev

      engine.setInterlayerCouplingJ2(5.0)
      expect(engine.getState().chiralTopologicalGapMev).toBeGreaterThan(lowGap)
    })

    it('switches regimes and advances pulsePhase on update', () => {
      const engine = new TwistedCuprateHighTcJosephsonEngine()
      engine.setRegime('semifluxon-fractional-shapiro-diode')
      expect(engine.getState().fractionalShapiroVisibility).toBeGreaterThan(0.9)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.2)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerTwistedCuprateSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new TwistedCuprateHighTcJosephsonEngine()
      engine.setTwistAngleDeg(33.0)
      engine.reset()
      expect(engine.getState().twistAngleDeg).toBe(44.6)
    })
  })

  describe('2. LoopQuantumCosmologyBouncePlanckStarEngine', () => {
    it('initializes near critical Planck density ρ_crit with positive quantum repulsion acceleration', () => {
      const engine = new LoopQuantumCosmologyBouncePlanckStarEngine()
      const st = engine.getState()
      expect(st.energyDensityRatioRhoOverCrit).toBe(0.96)
      expect(st.minimumAreaGapLp2).toBeCloseTo(5.17, 1)
      expect(st.quantumRepulsionAcceleration).toBeGreaterThan(2.0)
      expect(st.spinNodes).toHaveLength(18)
    })

    it('drives effective Hubble rate H² to zero at exact Big Bounce density ρ = ρ_crit', () => {
      const engine = new LoopQuantumCosmologyBouncePlanckStarEngine()
      engine.setEnergyDensityRatio(0.50)
      expect(engine.getState().effectiveHubbleRateSquared).toBeCloseTo(1.0, 2)

      engine.setEnergyDensityRatio(1.00)
      expect(engine.getState().effectiveHubbleRateSquared).toBe(0)
      expect(engine.getState().quantumRepulsionAcceleration).toBeGreaterThan(3.0)
    })

    it('scales minimum area gap Δ_area linearly with Barbero-Immirzi parameter γ_BI', () => {
      const engine = new LoopQuantumCosmologyBouncePlanckStarEngine()
      engine.setBarberoImmirziGamma(0.20)
      const areaLow = engine.getState().minimumAreaGapLp2
      engine.setBarberoImmirziGamma(0.40)
      expect(engine.getState().minimumAreaGapLp2).toBeCloseTo(areaLow * 2, 1)
    })

    it('switches regimes to Planck star white-hole tunneling and updates spin network nodes', () => {
      const engine = new LoopQuantumCosmologyBouncePlanckStarEngine()
      engine.setRegime('planck-star-white-hole-tunneling')
      expect(engine.getState().energyDensityRatioRhoOverCrit).toBe(1.0)
      expect(engine.getState().whiteHoleBurstPeakMeV).toBeGreaterThan(200)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.15)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerLqcBounceSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new LoopQuantumCosmologyBouncePlanckStarEngine()
      engine.setEnergyDensityRatio(0.15)
      engine.reset()
      expect(engine.getState().energyDensityRatioRhoOverCrit).toBe(0.96)
    })
  })

  describe('3. HeavyFermionKondoBreakdownQcpEngine', () => {
    it('initializes at the Kondo-breakdown QCP (g = 1.0) with enhanced quasiparticle effective mass', () => {
      const engine = new HeavyFermionKondoBreakdownQcpEngine()
      const st = engine.getState()
      expect(st.doniachTuningRatioG).toBe(1.0)
      expect(st.effectiveQuasiparticleMassRatio).toBeGreaterThan(600)
      expect(st.fermiSurfaceVolumeFraction).toBeCloseTo(0.75, 1)
      expect(st.latticeNodes).toHaveLength(16)
    })

    it('exhibits small-to-large Fermi surface reconstruction across g = 1.0', () => {
      const engine = new HeavyFermionKondoBreakdownQcpEngine()
      engine.setDoniachTuningRatio(0.50)
      const smallFs = engine.getState().fermiSurfaceVolumeFraction

      engine.setDoniachTuningRatio(1.60)
      const largeFs = engine.getState().fermiSurfaceVolumeFraction
      expect(smallFs).toBeLessThan(0.55)
      expect(largeFs).toBeGreaterThan(0.95)
    })

    it('suppresses QCP effective mass divergence when external magnetic field B increases', () => {
      const engine = new HeavyFermionKondoBreakdownQcpEngine()
      engine.setDoniachTuningRatio(1.0)
      engine.setMagneticFieldTesla(0.05)
      const peakMass = engine.getState().effectiveQuasiparticleMassRatio

      engine.setMagneticFieldTesla(10.0)
      expect(engine.getState().effectiveQuasiparticleMassRatio).toBeLessThan(peakMass)
    })

    it('switches regimes and updates momentum-space nodes on update', () => {
      const engine = new HeavyFermionKondoBreakdownQcpEngine()
      engine.setRegime('heavy-fermi-liquid-large-fermi-surface')
      expect(engine.getState().fermiSurfaceVolumeFraction).toBeGreaterThan(0.95)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.2)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerKondoQcpSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new HeavyFermionKondoBreakdownQcpEngine()
      engine.setDoniachTuningRatio(1.7)
      engine.reset()
      expect(engine.getState().doniachTuningRatioG).toBe(1.0)
    })
  })

  describe('4. QuasicrystalTopologicalPhononDiodeEngine', () => {
    it('initializes in Penrose 5-fold superspace C2 insulator regime with high acoustic diode isolation', () => {
      const engine = new QuasicrystalTopologicalPhononDiodeEngine()
      const st = engine.getState()
      expect(st.superspaceSecondChernC2).toBe(2)
      expect(st.acousticDiodeIsolationDb).toBeGreaterThan(45)
      expect(st.tileNodes).toHaveLength(15)
    })

    it('increases fractal bandgap width and diode isolation when superspace second Chern C2 increases', () => {
      const engine = new QuasicrystalTopologicalPhononDiodeEngine()
      engine.setSuperspaceSecondChern(1)
      const lowGap = engine.getState().fractalBandgapWidthKhz
      const lowIso = engine.getState().acousticDiodeIsolationDb

      engine.setSuperspaceSecondChern(6)
      expect(engine.getState().fractalBandgapWidthKhz).toBeGreaterThan(lowGap)
      expect(engine.getState().acousticDiodeIsolationDb).toBeGreaterThan(lowIso)
    })

    it('modulates phason pump phase and Fibonacci golden-ratio approximant order', () => {
      const engine = new QuasicrystalTopologicalPhononDiodeEngine()
      engine.setPhasonPumpPhase(1.50)
      engine.setApproximantOrder(12)
      expect(engine.getState().phasonPumpPhasePi).toBe(1.50)
      expect(engine.getState().goldenRatioApproximantOrder).toBe(12)
    })

    it('switches regimes to 8-fold Ammann-Beenker and updates superspace tile nodes', () => {
      const engine = new QuasicrystalTopologicalPhononDiodeEngine()
      engine.setRegime('ammann-beenker-8fold-chiral-edge')
      expect(engine.getState().tileNodes[0].rotationalSymmetryFold).toBe(8)
      const prevPhase = engine.getState().pulsePhase
      engine.update(0.15)
      expect(engine.getState().pulsePhase).toBeGreaterThan(prevPhase)
      expect(() => engine.triggerQuasicrystalPhononSound()).not.toThrow()
    })

    it('resets engine state cleanly', () => {
      const engine = new QuasicrystalTopologicalPhononDiodeEngine()
      engine.setSuperspaceSecondChern(5)
      engine.reset()
      expect(engine.getState().superspaceSecondChernC2).toBe(2)
    })
  })

  describe('5. UI Store & Achievement System Integration (Part 57)', () => {
    it('switches UI modes for all 4 Part 57 modals cleanly', () => {
      const ui = useUIStore()
      ui.openTwistedCuprateJosephson()
      expect(ui.mode).toBe('twisted-cuprate-josephson')
      ui.setTwistedCuprateJosephsonModal(false)
      expect(ui.mode).toBe('game')

      ui.openLoopQuantumCosmologyBounce()
      expect(ui.mode).toBe('loop-quantum-cosmology-bounce')
      ui.setLoopQuantumCosmologyBounceModal(false)
      expect(ui.mode).toBe('game')

      ui.openHeavyFermionKondoQcp()
      expect(ui.mode).toBe('heavy-fermion-kondo-qcp')
      ui.setHeavyFermionKondoQcpModal(false)
      expect(ui.mode).toBe('game')

      ui.openQuasicrystalPhononDiode()
      expect(ui.mode).toBe('quasicrystal-phonon-diode')
      ui.setQuasicrystalPhononDiodeModal(false)
      expect(ui.mode).toBe('game')
    })

    it('registers all 4 Part 57 achievements and reaches >= 244 total achievements', () => {
      const all = achievements.getAll()
      expect(all.length).toBeGreaterThanOrEqual(244)
      expect(all.some((a) => a.id === 'twisted_cuprate_high_tc_josephson')).toBe(true)
      expect(all.some((a) => a.id === 'lqc_big_bounce_planck_star')).toBe(true)
      expect(all.some((a) => a.id === 'heavy_fermion_kondo_breakdown_qcp')).toBe(true)
      expect(all.some((a) => a.id === 'quasicrystal_topological_phonon_diode')).toBe(true)
    })
  })
})
