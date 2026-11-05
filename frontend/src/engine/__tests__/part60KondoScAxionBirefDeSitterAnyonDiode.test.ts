import { describe, it, expect, beforeEach } from 'vitest'
import { TopologicalKondoSuperconductorEngine } from '../topologicalKondoSuperconductor'
import { AxionPhotonBirefringenceInterferometerEngine } from '../axionPhotonBirefringenceInterferometer'
import { HolographicDeSitterStaticPatchIslandEngine } from '../holographicDeSitterStaticPatchIsland'
import { NonAbelianAnyonThermalDiodeEngine } from '../nonAbelianAnyonThermalDiode'
import { AchievementSystem } from '../achievements'

describe('Part 60: Topological Kondo Superconductor, Axion-Photon Birefringence Interferometer, Holographic De Sitter Static Patch & Non-Abelian Anyon Thermal Diode', () => {
  describe('TopologicalKondoSuperconductorEngine', () => {
    let engine: TopologicalKondoSuperconductorEngine

    beforeEach(() => {
      engine = new TopologicalKondoSuperconductorEngine()
      engine.reset()
    })

    it('initializes in the Class DIII Majorana Kramers Pair phase with Z2 = 1 and near-4e2/h conductance', () => {
      const state = engine.getState()
      expect(state.diiiZ2TopologicalInvariant).toBe(1)
      expect(state.kramersZeroBiasConductanceE2H).toBeGreaterThan(3.5)
      expect(state.kramersNodes.length).toBe(16)
    })

    it('transitions across trivial singlet, DIII Kramers pair, fractional 8pi spin pump, and Zeeman Class D regimes', () => {
      engine.setRegime('trivial-heavy-fermion-singlet-sc')
      expect(engine.getState().diiiZ2TopologicalInvariant).toBe(0)

      engine.setRegime('fractional-8pi-spin-josephson-pump')
      expect(engine.getState().fractionalJosephson8PiWeight).toBeGreaterThan(0.9)

      engine.setRegime('zeeman-split-chiral-class-d-crossover')
      expect(engine.getState().diiiZ2TopologicalInvariant).toBe(0)
    })

    it('suppresses Kramers double-channel conductance when time-reversal-breaking Zeeman field increases', () => {
      engine.setKondoHybridizationStrength(16.0)
      engine.setTimeReversalBreakingZeeman(0.05)
      const gProtected = engine.getState().kramersZeroBiasConductanceE2H
      engine.setTimeReversalBreakingZeeman(4.50)
      expect(engine.getState().kramersZeroBiasConductanceE2H).toBeLessThan(gProtected)
    })

    it('evolves Majorana Kramers vortex nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.35)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets state cleanly', () => {
      engine.setKondoHybridizationStrength(3.0)
      engine.reset()
      expect(engine.getState().kondoHybridizationStrengthMeV).toBeCloseTo(14.5, 1)
    })
  })

  describe('AxionPhotonBirefringenceInterferometerEngine', () => {
    let engine: AxionPhotonBirefringenceInterferometerEngine

    beforeEach(() => {
      engine = new AxionPhotonBirefringenceInterferometerEngine()
      engine.reset()
    })

    it('initializes in the bow-tie birefringence cavity regime with positive LCP/RCP rotation', () => {
      const state = engine.getState()
      expect(state.birefringenceRotationNrad).toBeGreaterThan(15.0)
      expect(state.shotNoiseSqueezedSnr).toBeGreaterThan(5.0)
      expect(state.cavityNodes.length).toBe(16)
    })

    it('switches across bow-tie cavity, ALPS-II LSW, ultralight ALP halo, and squeezed vacuum regimes', () => {
      engine.setRegime('primakoff-light-shining-through-wall-alps')
      expect(engine.getState().opticalCavityFinesseK).toBeCloseTo(150.0, 1)

      engine.setRegime('quantum-squeezed-vacuum-shot-noise-bypass')
      expect(engine.getState().shotNoiseSqueezedSnr).toBeGreaterThan(40.0)
    })

    it('amplifies vacuum birefringence rotation when axion-photon coupling or magnetic field increases', () => {
      engine.setAxionPhotonCoupling(1.0)
      const rotLow = engine.getState().birefringenceRotationNrad
      engine.setAxionPhotonCoupling(8.5)
      expect(engine.getState().birefringenceRotationNrad).toBeGreaterThan(rotLow)
    })

    it('updates bow-tie cavity polarization nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.4)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets axion birefringence parameters cleanly', () => {
      engine.setTransverseMagneticField(2.5)
      engine.reset()
      expect(engine.getState().transverseMagneticFieldTesla).toBeCloseTo(9.5, 1)
    })
  })

  describe('HolographicDeSitterStaticPatchIslandEngine', () => {
    let engine: HolographicDeSitterStaticPatchIslandEngine

    beforeEach(() => {
      engine = new HolographicDeSitterStaticPatchIslandEngine()
      engine.reset()
    })

    it('initializes with a nucleated antipodal cosmological entanglement island past the Page time', () => {
      const state = engine.getState()
      expect(state.observerPageTimeRatio).toBeGreaterThan(1.0)
      expect(state.antipodalIslandCoveragePct).toBeGreaterThan(75.0)
      expect(state.typeII1TracePurityIndex).toBeGreaterThan(0.9)
      expect(state.penroseNodes.length).toBe(18)
    })

    it('transitions across pre-Page thermal bath, Type II1 maximal entropy, antipodal island, and hyperfast scrambling regimes', () => {
      engine.setRegime('pre-page-gibbons-hawking-thermal-bath')
      expect(engine.getState().antipodalIslandCoveragePct).toBeLessThan(15.0)

      engine.setRegime('type-ii1-von-neumann-maximal-entropy-state')
      expect(engine.getState().generalizedPageEntropyRatio).toBeCloseTo(1.0, 2)
    })

    it('increases Gibbons-Hawking horizon temperature when De Sitter radius decreases', () => {
      engine.setDeSitterRadiusRatio(45.0)
      const tLow = engine.getState().gibbonsHawkingTempMeV
      engine.setDeSitterRadiusRatio(10.0)
      expect(engine.getState().gibbonsHawkingTempMeV).toBeGreaterThan(tLow)
    })

    it('updates Penrose static-patch horizon and island nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.3)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets De Sitter static patch state cleanly', () => {
      engine.setObserverPageTimeRatio(0.25)
      engine.reset()
      expect(engine.getState().observerPageTimeRatio).toBeCloseTo(1.42, 2)
    })
  })

  describe('NonAbelianAnyonThermalDiodeEngine', () => {
    let engine: NonAbelianAnyonThermalDiodeEngine

    beforeEach(() => {
      engine = new NonAbelianAnyonThermalDiodeEngine()
      engine.reset()
    })

    it('initializes with even N_sigma = 2 Ising anyons, high e/4 visibility, and kappa_xy = 2.50 kappa_0', () => {
      const state = engine.getState()
      expect(state.localizedAnyonCountNsigma).toBe(2)
      expect(state.halfIntegerThermalHallK0).toBeCloseTo(2.50, 2)
      expect(state.e4InterferenceVisibility).toBeGreaterThan(0.6)
      expect(state.braidingNodes.length).toBe(16)
    })

    it('exhibits the non-Abelian even-odd interference extinction effect when N_sigma switches between even and odd', () => {
      engine.setLocalizedAnyonCount(2)
      const visEven = engine.getState().e4InterferenceVisibility
      engine.setLocalizedAnyonCount(3)
      const visOdd = engine.getState().e4InterferenceVisibility

      expect(visEven).toBeGreaterThan(0.6)
      expect(visOdd).toBeLessThan(0.1)
    })

    it('boosts chiral Majorana thermal diode rectification when thermal bias increases', () => {
      engine.setThermalGradientRatio(0.20)
      const rectLow = engine.getState().thermalDiodeRectificationPct
      engine.setThermalGradientRatio(2.20)
      expect(engine.getState().thermalDiodeRectificationPct).toBeGreaterThan(rectLow)
    })

    it('updates QPC braiding interferometer nodes over time', () => {
      const p0 = engine.getState().pulsePhase
      engine.update(0.45)
      expect(engine.getState().pulsePhase).toBeGreaterThan(p0)
    })

    it('resets non-Abelian anyon thermal diode state cleanly', () => {
      engine.setLocalizedAnyonCount(7)
      engine.reset()
      expect(engine.getState().localizedAnyonCountNsigma).toBe(2)
    })
  })

  describe('Part 60 Achievements Registration', () => {
    it('registers all 4 Part 60 frontier physics achievements and reaches >= 256 total achievements', () => {
      const ach = new AchievementSystem()
      const all = ach.getAll()
      expect(all.length).toBeGreaterThanOrEqual(256)

      const ids = [
        'topological_kondo_majorana_kramers_superconductor',
        'axion_photon_birefringence_interferometer',
        'holographic_desitter_static_patch_island',
        'non_abelian_anyon_thermal_diode_interferometer',
      ]
      for (const id of ids) {
        expect(all.some((a) => a.id === id)).toBe(true)
      }
    })

    it('unlocks Part 60 achievements via AchievementSystem.unlock()', () => {
      const ach = new AchievementSystem()
      ach.unlock('topological_kondo_majorana_kramers_superconductor')
      ach.unlock('axion_photon_birefringence_interferometer')
      ach.unlock('holographic_desitter_static_patch_island')
      ach.unlock('non_abelian_anyon_thermal_diode_interferometer')

      expect(ach.isUnlocked('topological_kondo_majorana_kramers_superconductor')).toBe(true)
      expect(ach.isUnlocked('axion_photon_birefringence_interferometer')).toBe(true)
      expect(ach.isUnlocked('holographic_desitter_static_patch_island')).toBe(true)
      expect(ach.isUnlocked('non_abelian_anyon_thermal_diode_interferometer')).toBe(true)
    })
  })
})
