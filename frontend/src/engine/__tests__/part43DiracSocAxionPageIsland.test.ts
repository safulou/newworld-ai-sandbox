import { describe, it, expect, beforeEach } from 'vitest';
import { diracKleinTunnelingEngine } from '../diracKleinTunnelingVeselago';
import { spinOrbitBecEngine } from '../spinOrbitBecStripePhase';
import { magneticWeylAxionEngine } from '../magneticWeylAxionPolariton';
import { holographicPageIslandEngine } from '../holographicPageIslandThermalization';

describe('Part 43 Cutting-Edge Subsystems Verification Suite', () => {

  // --- Subsystem 1: Dirac Klein Tunneling & Veselago Lens ---
  describe('Dirac Klein Tunneling & Negative Refraction Engine', () => {
    beforeEach(() => {
      diracKleinTunnelingEngine.setIncidentEnergy(0.15);
      diracKleinTunnelingEngine.setBarrierHeight(0.35);
      diracKleinTunnelingEngine.setBarrierWidth(50.0);
      diracKleinTunnelingEngine.setIncidentAngle(15.0);
    });

    it('1. should guarantee strictly perfect Klein transmission T(0) == 1.0 at normal incidence', () => {
      const T0 = diracKleinTunnelingEngine.calculateTransmission(0.0);
      expect(T0).toBeCloseTo(1.0, 5);

      const state = diracKleinTunnelingEngine.getState();
      expect(state.normalTransmission).toBe(1.0);
    });

    it('2. should exhibit angle-dependent transmission decrease and reflection', () => {
      const T15 = diracKleinTunnelingEngine.calculateTransmission(15.0);
      const T45 = diracKleinTunnelingEngine.calculateTransmission(45.0);
      expect(T15).toBeGreaterThan(0.0);
      expect(T15).toBeLessThanOrEqual(1.0);
      expect(T45).toBeLessThan(T15); // Higher angle has larger backscattering reflection

      const state = diracKleinTunnelingEngine.getState();
      expect(state.actualTransmission + state.reflectionProbability).toBeCloseTo(1.0, 5);
    });

    it('3. should calculate negative refractive index n2 < 0 and Veselago focal length when E < V0', () => {
      const state = diracKleinTunnelingEngine.getState();
      expect(state.refractiveIndexN2).toBeLessThan(0.0);
      expect(state.veselagoFocalLengthNm).toBeGreaterThan(0.0);
      expect(state.veselagoFocalLengthNm).toBeLessThan(state.barrierWidthNm);
    });

    it('4. should cycle through regimes and correctly configure Veselago lens regime', () => {
      diracKleinTunnelingEngine.setRegime('veselago-lens');
      let state = diracKleinTunnelingEngine.getState();
      expect(state.regime).toBe('veselago-lens');
      expect(state.refractiveIndexN2).toBeCloseTo(-1.0, 1);

      diracKleinTunnelingEngine.cycleRegime();
      state = diracKleinTunnelingEngine.getState();
      expect(['normal-klein', 'fabry-perot', 'veselago-lens', 'magnetic-confined']).toContain(state.regime);
    });

    it('5. should execute simulation loop and audio without exceptions', () => {
      expect(() => {
        diracKleinTunnelingEngine.update(0.016);
        diracKleinTunnelingEngine.triggerPerfectTunneling();
        diracKleinTunnelingEngine.playKleinTone();
      }).not.toThrow();
    });
  });

  // --- Subsystem 2: Spin-Orbit Coupled BEC & Stripe Supersolid ---
  describe('Spin-Orbit Coupled BEC Stripe Phase Engine', () => {
    beforeEach(() => {
      spinOrbitBecEngine.setRamanCoupling(2.0);
      spinOrbitBecEngine.setRamanDetuning(0.0);
      spinOrbitBecEngine.setRecoilWavenumber(8.0);
    });

    it('6. should calculate recoil energy E_R in kHz for 87Rb', () => {
      const state = spinOrbitBecEngine.getState();
      expect(state.recoilEnergyKhz).toBeGreaterThan(1.0);
      expect(state.recoilEnergyKhz).toBeLessThan(10.0);
    });

    it('7. should create double-well dispersion with non-zero k0 when Omega_R < 4 E_R', () => {
      const state = spinOrbitBecEngine.getState();
      expect(state.minimaWavenumberK0).toBeGreaterThan(0.0);
      expect(state.stripeContrast).toBeCloseTo(2.0 / 4.0, 2);
      expect(state.stripeWavelengthNm).toBeGreaterThan(100.0);
    });

    it('8. should show anisotropic superfluid fraction quenching along x-axis', () => {
      const state = spinOrbitBecEngine.getState();
      expect(state.superfluidFractionX).toBeLessThan(1.0);
      expect(state.superfluidFractionX).toBeGreaterThan(0.1);
      expect(state.superfluidFractionY).toBe(1.0);
    });

    it('9. should transition to single-minimum state when Omega_R >= 4 E_R', () => {
      spinOrbitBecEngine.setRamanCoupling(4.8);
      const state = spinOrbitBecEngine.getState();
      expect(state.regime).toBe('single-minimum');
      expect(state.minimaWavenumberK0).toBe(0.0);
      expect(state.stripeContrast).toBe(0.0);
    });

    it('10. should cycle regimes and trigger supersolid interference smoothly', () => {
      expect(() => {
        spinOrbitBecEngine.cycleRegime();
        spinOrbitBecEngine.triggerSupersolidInterference();
        spinOrbitBecEngine.update(0.016);
      }).not.toThrow();
      const state = spinOrbitBecEngine.getState();
      expect(state.regime).toBe('stripe-supersolid');
    });
  });

  // --- Subsystem 3: Magnetic Weyl Axion Polariton ---
  describe('Magnetic Weyl Axion Polariton Engine', () => {
    beforeEach(() => {
      magneticWeylAxionEngine.setAfmResonance(1.2);
      magneticWeylAxionEngine.setWeylSeparation(0.25);
      magneticWeylAxionEngine.setProbeFrequency(1.25);
    });

    it('11. should open finite polaritonic gap around AFM resonance frequency', () => {
      const state = magneticWeylAxionEngine.getState();
      expect(state.polaritonGapWidthThz).toBeGreaterThan(0.05);
      expect(state.polaritonGapWidthThz).toBeLessThan(1.0);
    });

    it('12. should exhibit total internal reflection inside polariton gap', () => {
      magneticWeylAxionEngine.setProbeFrequency(1.25); // Inside gap [1.2, 1.38]
      const state = magneticWeylAxionEngine.getState();
      expect(state.reflectivityR).toBeGreaterThan(0.9);
      expect(state.regime).toBe('axion-polariton-gap');
    });

    it('13. should calculate non-reciprocal Faraday rotation angle', () => {
      magneticWeylAxionEngine.setProbeFrequency(1.8); // Outside gap
      const state = magneticWeylAxionEngine.getState();
      expect(state.faradayRotationDeg).toBeGreaterThan(0.0);
      expect(state.faradayRotationDeg).toBeLessThanOrEqual(90.0);
      expect(state.kerrRotationDeg).toBeCloseTo(state.faradayRotationDeg * 0.5, 2);
    });

    it('14. should switch regimes and adjust parameters accordingly', () => {
      magneticWeylAxionEngine.setRegime('non-reciprocal-faraday');
      let state = magneticWeylAxionEngine.getState();
      expect(state.regime).toBe('non-reciprocal-faraday');

      magneticWeylAxionEngine.cycleRegime();
      state = magneticWeylAxionEngine.getState();
      expect(['afm-quiescent', 'axion-polariton-gap', 'non-reciprocal-faraday', 'weyl-node-annihilation']).toContain(state.regime);
    });

    it('15. should trigger polariton resonance and update state without error', () => {
      expect(() => {
        magneticWeylAxionEngine.triggerPolaritonResonance();
        magneticWeylAxionEngine.update(0.016);
      }).not.toThrow();
    });
  });

  // --- Subsystem 4: Holographic Page Island & Entanglement Thermalization ---
  describe('Holographic Page Island & Thermalization Engine', () => {
    beforeEach(() => {
      holographicPageIslandEngine.setInitialEntropy(1000.0);
      holographicPageIslandEngine.setEvaporationProgress(0.25);
      holographicPageIslandEngine.setCentralCharge(24.0);
    });

    it('16. should follow naive linear Hawking entropy in early radiation (no island)', () => {
      const state = holographicPageIslandEngine.getState();
      expect(state.hasIslandFormed).toBe(false);
      expect(state.islandRadiusFraction).toBe(0.0);
      expect(state.unitaryRadiationEntropy).toBeCloseTo(state.naiveHawkingEntropy, 1);
      expect(state.regime).toBe('early-hawking-radiation');
    });

    it('17. should trigger Quantum Extremal Surface (QES) island formation at Page time', () => {
      holographicPageIslandEngine.setEvaporationProgress(0.70); // Past Page time (tau ~ 0.50)
      const state = holographicPageIslandEngine.getState();
      expect(state.hasIslandFormed).toBe(true);
      expect(state.islandRadiusFraction).toBeGreaterThan(0.5);
      expect(state.unitaryRadiationEntropy).toBeLessThan(state.naiveHawkingEntropy);
      expect(state.regime).toBe('island-unitary-recovery');
    });

    it('18. should calculate finite quantum scrambling time t_scr', () => {
      const state = holographicPageIslandEngine.getState();
      expect(state.scramblingTimeMs).toBeGreaterThan(0.0);
      expect(state.scramblingTimeMs).toBeLessThan(1000.0);
    });

    it('19. should handle complete evaporation remnant state when tau -> 1.0', () => {
      holographicPageIslandEngine.setEvaporationProgress(0.98);
      const state = holographicPageIslandEngine.getState();
      expect(state.regime).toBe('complete-evaporation-remnant');
      expect(state.bekensteinEntropy).toBeLessThan(10.0);
    });

    it('20. should cycle regimes and trigger Page transition chime without throwing', () => {
      expect(() => {
        holographicPageIslandEngine.cycleRegime();
        holographicPageIslandEngine.triggerPageTransition();
        holographicPageIslandEngine.update(0.016);
      }).not.toThrow();
    });
  });

});
