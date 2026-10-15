import { describe, it, expect, beforeEach } from 'vitest';
import { moireExcitonicInsulatorEngine } from '../moireExcitonicInsulatorBec';
import { nonAbelianSpinSuperfluidEngine } from '../nonAbelianSpinSuperfluid';
import { planckianInflationHoloEngine } from '../planckianInflationHoloAntenna';
import { topologicalNonReciprocalLaserEngine } from '../topologicalNonReciprocalLaser';

describe('Part 46 Cutting-Edge Subsystems Verification Suite', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  // --- Subsystem 1: Moiré Topological Excitonic Insulator & Exciton BEC Superfluid ---
  describe('Moiré Topological Excitonic Insulator & BEC Engine', () => {
    it('1. should compute exciton order parameter when Eb > Delta_0', () => {
      moireExcitonicInsulatorEngine.setExcitonBindingEnergy(150.0);
      moireExcitonicInsulatorEngine.setSingleParticleGap(90.0);
      const state = moireExcitonicInsulatorEngine.getState();
      // Delta_exc = sqrt(150^2 - 90^2) = sqrt(22500 - 8100) = sqrt(14400) = 120.0
      expect(state.excitonOrderParamMeV).toBeCloseTo(120.0, 1);
    });

    it('2. should quench order parameter when Eb <= Delta_0 in normal exciton gas', () => {
      moireExcitonicInsulatorEngine.setExcitonBindingEnergy(80.0);
      moireExcitonicInsulatorEngine.setSingleParticleGap(120.0);
      const state = moireExcitonicInsulatorEngine.getState();
      expect(state.excitonOrderParamMeV).toBe(0.0);
    });

    it('3. should evaluate BKT transition temperature and counterflow critical velocity', () => {
      moireExcitonicInsulatorEngine.setExcitonBindingEnergy(160.0);
      moireExcitonicInsulatorEngine.setSingleParticleGap(90.0);
      moireExcitonicInsulatorEngine.setExcitonDensity(2.0);
      const state = moireExcitonicInsulatorEngine.getState();
      expect(state.bktTransitionTempKelvin).toBeGreaterThan(40.0);
      expect(state.counterflowCriticalVelocityMs).toBeGreaterThan(5000.0);
      expect(state.topologicalChernNum).toBe(1);
    });

    it('4. should cycle regimes smoothly and trigger counterflow burst', () => {
      moireExcitonicInsulatorEngine.setRegime('exciton-gas');
      expect(moireExcitonicInsulatorEngine.getState().regime).toBe('exciton-gas');
      expect(moireExcitonicInsulatorEngine.getState().counterflowSuperfluidActive).toBe(false);

      moireExcitonicInsulatorEngine.triggerCounterflowBurst();
      expect(moireExcitonicInsulatorEngine.getState().regime).toBe('counterflow-superfluid');
      expect(moireExcitonicInsulatorEngine.getState().counterflowSuperfluidActive).toBe(true);

      moireExcitonicInsulatorEngine.cycleRegime();
      expect(moireExcitonicInsulatorEngine.getState().regime).toBe('exciton-gas');
    });

    it('5. should update simulation time and execute procedural audio without throwing', () => {
      moireExcitonicInsulatorEngine.update(0.05);
      expect(moireExcitonicInsulatorEngine.getState().timeElapsed).toBeGreaterThan(0.0);
      expect(() => moireExcitonicInsulatorEngine.playExcitonChime()).not.toThrow();
      expect(() => moireExcitonicInsulatorEngine.playCounterflowBurst()).not.toThrow();
    });
  });

  // --- Subsystem 2: Non-Abelian Spin Superfluid & Weyl Fermion Topological Kink ---
  describe('Non-Abelian Spin Superfluid Engine', () => {
    it('6. should calculate dissipationless spin supercurrent J_s = rho_s * grad(phi)', () => {
      nonAbelianSpinSuperfluidEngine.setSpinStiffness(20.0);
      nonAbelianSpinSuperfluidEngine.setPhaseGradient(0.15);
      const state = nonAbelianSpinSuperfluidEngine.getState();
      expect(state.spinSupercurrentDensity).toBeCloseTo(3.0, 2);
    });

    it('7. should calculate spin Josephson precession frequency omega_s = 2 * mu_s / hbar', () => {
      nonAbelianSpinSuperfluidEngine.setSpinChemicalPotential(50.0);
      const state = nonAbelianSpinSuperfluidEngine.getState();
      // 2 * 50.0 * 1.5192675 ~ 151.93 GHz
      expect(state.spinJosephsonFrequencyGhz).toBeCloseTo(151.93, 1);
    });

    it('8. should determine topological spin kink width and chiral anomaly charge', () => {
      nonAbelianSpinSuperfluidEngine.setSpinStiffness(25.0);
      const state = nonAbelianSpinSuperfluidEngine.getState();
      expect(state.solitonKinkWidthNm).toBeGreaterThan(15.0);
      expect(state.chiralChargeAccumulation).toBeGreaterThan(0.0);
    });

    it('9. should cycle regimes and trigger spin Josephson burst', () => {
      nonAbelianSpinSuperfluidEngine.setRegime('uniform-spin-ground');
      expect(nonAbelianSpinSuperfluidEngine.getState().topologicalWindingNumber).toBe(0);

      nonAbelianSpinSuperfluidEngine.triggerSpinJosephsonBurst();
      expect(nonAbelianSpinSuperfluidEngine.getState().regime).toBe('spin-josephson-oscillation');

      nonAbelianSpinSuperfluidEngine.cycleRegime();
      expect(nonAbelianSpinSuperfluidEngine.getState().regime).toBe('uniform-spin-ground');
    });

    it('10. should update simulation loop and synthesize spin precession audio', () => {
      nonAbelianSpinSuperfluidEngine.update(0.033);
      expect(nonAbelianSpinSuperfluidEngine.getState().timeElapsed).toBeGreaterThan(0.0);
      expect(() => nonAbelianSpinSuperfluidEngine.playSpinPrecessionTone()).not.toThrow();
      expect(() => nonAbelianSpinSuperfluidEngine.playSpinJosephsonBurst()).not.toThrow();
    });
  });

  // --- Subsystem 3: Planckian Inflation & Holographic Cosmological Antenna ---
  describe('Planckian Inflation & Holographic Antenna Engine', () => {
    it('11. should compute tensor-to-scalar ratio r = 16 * epsilon and spectral tilt n_t = -2 * epsilon', () => {
      planckianInflationHoloEngine.setSlowRollEpsilon(0.004);
      const state = planckianInflationHoloEngine.getState();
      expect(state.tensorToScalarRatioR).toBeCloseTo(0.064, 4);
      expect(state.tensorSpectralIndexNt).toBeCloseTo(-0.008, 4);
    });

    it('12. should evaluate primordial gravitational wave power spectrum', () => {
      planckianInflationHoloEngine.setHubbleScale(2.0);
      planckianInflationHoloEngine.setSlowRollEpsilon(0.0035);
      const state = planckianInflationHoloEngine.getState();
      // P_t = 2.026 * 4.0 * 1.0 ~ 8.10
      expect(state.primordialGwPower).toBeCloseTo(8.10, 1);
    });

    it('13. should activate B-mode polarization when r > 0.015', () => {
      planckianInflationHoloEngine.setSlowRollEpsilon(0.002);
      expect(planckianInflationHoloEngine.getState().bModePolarizationActive).toBe(true);

      planckianInflationHoloEngine.setRegime('slow-roll-uniform');
      expect(planckianInflationHoloEngine.getState().bModePolarizationActive).toBe(false);
    });

    it('14. should cycle regimes and trigger B-mode polarization burst', () => {
      planckianInflationHoloEngine.triggerBModeBurst();
      expect(planckianInflationHoloEngine.getState().regime).toBe('cmb-b-mode-polarization');
      expect(planckianInflationHoloEngine.getState().bModePolarizationActive).toBe(true);

      planckianInflationHoloEngine.cycleRegime();
      expect(planckianInflationHoloEngine.getState().regime).toBe('slow-roll-uniform');
    });

    it('15. should update simulation time and synthesize cosmic expansion hum', () => {
      planckianInflationHoloEngine.update(0.04);
      expect(planckianInflationHoloEngine.getState().timeElapsed).toBeGreaterThan(0.0);
      expect(() => planckianInflationHoloEngine.playInflationExpansionHum()).not.toThrow();
      expect(() => planckianInflationHoloEngine.playBModePolarizationChord()).not.toThrow();
    });
  });

  // --- Subsystem 4: Topological Non-Reciprocal Photonic Crystal Laser ---
  describe('Topological Non-Reciprocal Photonic Crystal Laser Engine', () => {
    it('16. should break PT symmetry when gain/loss parameter exceeds EP threshold', () => {
      topologicalNonReciprocalLaserEngine.setGainLossParameter(16.0);
      const state = topologicalNonReciprocalLaserEngine.getState();
      expect(state.isPtSymmetryBroken).toBe(true);
      expect(state.chiralEdgeModeActive).toBe(true);
    });

    it('17. should compute giant optical non-reciprocal isolation ratio Iso > 35 dB', () => {
      topologicalNonReciprocalLaserEngine.setGainLossParameter(18.0);
      topologicalNonReciprocalLaserEngine.setPumpPower(80.0);
      const state = topologicalNonReciprocalLaserEngine.getState();
      expect(state.isolationRatioDb).toBeGreaterThan(35.0);
      expect(state.forwardTransmissionTPlus).toBeGreaterThan(0.8);
      expect(state.backwardExtinctionTMinus).toBeLessThan(0.001);
    });

    it('18. should maintain reciprocal transmission below EP threshold', () => {
      topologicalNonReciprocalLaserEngine.setRegime('pt-symmetric-quiescent');
      const state = topologicalNonReciprocalLaserEngine.getState();
      expect(state.isPtSymmetryBroken).toBe(false);
      expect(state.chiralEdgeModeActive).toBe(false);
      expect(state.isolationRatioDb).toBe(0.0);
    });

    it('19. should cycle regimes and trigger high isolation burst', () => {
      topologicalNonReciprocalLaserEngine.triggerIsolationBurst();
      expect(topologicalNonReciprocalLaserEngine.getState().regime).toBe('high-isolation-limit');
      expect(topologicalNonReciprocalLaserEngine.getState().isolationRatioDb).toBeGreaterThan(40.0);

      topologicalNonReciprocalLaserEngine.cycleRegime();
      expect(topologicalNonReciprocalLaserEngine.getState().regime).toBe('pt-symmetric-quiescent');
    });

    it('20. should update simulation loop and synthesize laser cavity tone', () => {
      topologicalNonReciprocalLaserEngine.update(0.016);
      expect(topologicalNonReciprocalLaserEngine.getState().timeElapsed).toBeGreaterThan(0.0);
      expect(() => topologicalNonReciprocalLaserEngine.playLaserCavityTone()).not.toThrow();
      expect(() => topologicalNonReciprocalLaserEngine.playIsolationBurst()).not.toThrow();
    });
  });

  // --- Part 46 Achievements Integration ---
  describe('Part 46 Achievements System Integration', () => {
    it('21. should register all 4 Part 46 cutting-edge achievements reaching 200 total', async () => {
      const { achievements } = await import('../achievements');
      const all = achievements.getAll();
      expect(all.length).toBe(200);

      const part46Ids = [
        'moire_excitonic_insulator_bec',
        'non_abelian_spin_superfluid',
        'planckian_inflation_holo_antenna',
        'topological_non_reciprocal_laser',
      ];

      for (const id of part46Ids) {
        const ach = all.find(a => a.id === id);
        expect(ach).toBeDefined();
        expect(ach?.title).toBeDefined();
        expect(ach?.description).toBeDefined();
        expect(ach?.icon).toBeDefined();
      }
    });
  });
});
