import { describe, it, expect, beforeEach } from 'vitest';
import {
  timeQuasicrystalFloquetPumpEngine,
  TimeQuasicrystalFloquetPumpEngine
} from '../timeQuasicrystalFloquetPump';
import {
  planckCoreRegularBlackHoleRemnantEngine,
  PlanckCoreRegularBlackHoleRemnantEngine
} from '../planckCoreRegularBlackHoleRemnant';
import {
  twistedTrilayerGrapheneTripletScEngine,
  TwistedTrilayerGrapheneTripletScEngine
} from '../twistedTrilayerGrapheneTripletSc';
import {
  superfluidHe3KibbleZurekMonopoleEngine,
  SuperfluidHe3KibbleZurekMonopoleEngine
} from '../superfluidHe3KibbleZurekMonopole';
import { achievements } from '../achievements';

describe('Part 61 Frontier Physics Engines', () => {
  describe('1. TimeQuasicrystalFloquetPumpEngine (時間準晶與多頻無理數弗洛凱高階拓撲泵浦引擎)', () => {
    beforeEach(() => {
      timeQuasicrystalFloquetPumpEngine.reset();
    });

    it('initializes with golden-ratio Fibonacci time quasicrystal state and 16 synthetic frequency lattice nodes', () => {
      const state = timeQuasicrystalFloquetPumpEngine.getState();
      expect(state.frequencyRatioGoldenDetuning).toBeCloseTo(1.618, 3);
      expect(state.syntheticFrequencyChernNumber).toBe(1);
      expect(state.subharmonicQuasiOrderParam).toBeGreaterThan(0.8);
      expect(state.frequencyNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('golden-ratio-fibonacci-time-quasicrystal');
    });

    it('updates synthetic frequency Chern number and energy pump rate across regimes', () => {
      const engine = new TimeQuasicrystalFloquetPumpEngine();
      engine.setRegime('quantized-synthetic-frequency-chern-pump');
      expect(engine.getState().syntheticFrequencyChernNumber).toBe(2);
      expect(engine.getState().quantizedEnergyPumpRateHw2).toBeGreaterThan(2.5);

      engine.setRegime('ergodic-floquet-thermalization-breakdown');
      expect(engine.getState().syntheticFrequencyChernNumber).toBe(0);
      expect(engine.getState().quantizedEnergyPumpRateHw2).toBe(0);
    });

    it('clamps frequency ratio and many-body interaction parameters and advances phase on update', () => {
      timeQuasicrystalFloquetPumpEngine.setFrequencyRatio(5.0);
      expect(timeQuasicrystalFloquetPumpEngine.getState().frequencyRatioGoldenDetuning).toBe(2.2);

      timeQuasicrystalFloquetPumpEngine.setManyBodyInteraction(0.01);
      expect(timeQuasicrystalFloquetPumpEngine.getState().manyBodyInteractionStrengthJ).toBe(0.05);

      const initialPhase = timeQuasicrystalFloquetPumpEngine.getState().pulsePhase;
      timeQuasicrystalFloquetPumpEngine.update(0.25);
      expect(timeQuasicrystalFloquetPumpEngine.getState().pulsePhase).toBeGreaterThan(initialPhase);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => timeQuasicrystalFloquetPumpEngine.triggerTimeQuasicrystalSound()).not.toThrow();
      timeQuasicrystalFloquetPumpEngine.setFrequencyRatio(1.95);
      timeQuasicrystalFloquetPumpEngine.reset();
      expect(timeQuasicrystalFloquetPumpEngine.getState().frequencyRatioGoldenDetuning).toBeCloseTo(1.618, 3);
    });
  });

  describe('2. PlanckCoreRegularBlackHoleRemnantEngine (漸近安全量子引力普朗克核黑洞殘餘與非奇異正則視界共振器引擎)', () => {
    beforeEach(() => {
      planckCoreRegularBlackHoleRemnantEngine.reset();
    });

    it('initializes with extremal horizon merger Planck remnant state and 18 horizon echo nodes', () => {
      const state = planckCoreRegularBlackHoleRemnantEngine.getState();
      expect(state.blackHoleMassPlanckRatio).toBeCloseTo(1.85, 2);
      expect(state.rgQuantumParameterOmega).toBeCloseTo(1.18, 2);
      expect(state.remnantStabilityIndex).toBeGreaterThan(0.9);
      expect(state.horizonNodes).toHaveLength(18);
      expect(state.activeRegime).toBe('extremal-horizon-merger-planck-remnant');
    });

    it('drives Hawking temperature toward zero at critical Planck remnant mass and increases horizon separation at large mass', () => {
      const engine = new PlanckCoreRegularBlackHoleRemnantEngine();
      engine.setBlackHoleMassRatio(1.15);
      engine.setRgQuantumParameter(1.50);
      expect(engine.getState().hawkingTemperaturePlanckRatio).toBe(0);
      expect(engine.getState().horizonSeparationPlanck).toBe(0);

      engine.setRegime('semiclassical-two-horizon-hawking-evaporation');
      expect(engine.getState().horizonSeparationPlanck).toBeGreaterThan(10);
      expect(engine.getState().hawkingTemperaturePlanckRatio).toBeGreaterThan(0);
    });

    it('clamps mass and RG quantum parameters and advances phase on update', () => {
      planckCoreRegularBlackHoleRemnantEngine.setBlackHoleMassRatio(25.0);
      expect(planckCoreRegularBlackHoleRemnantEngine.getState().blackHoleMassPlanckRatio).toBe(12.0);

      planckCoreRegularBlackHoleRemnantEngine.setRgQuantumParameter(0.1);
      expect(planckCoreRegularBlackHoleRemnantEngine.getState().rgQuantumParameterOmega).toBe(0.4);

      const p0 = planckCoreRegularBlackHoleRemnantEngine.getState().pulsePhase;
      planckCoreRegularBlackHoleRemnantEngine.update(0.3);
      expect(planckCoreRegularBlackHoleRemnantEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => planckCoreRegularBlackHoleRemnantEngine.triggerPlanckRemnantSound()).not.toThrow();
      planckCoreRegularBlackHoleRemnantEngine.setBlackHoleMassRatio(6.0);
      planckCoreRegularBlackHoleRemnantEngine.reset();
      expect(planckCoreRegularBlackHoleRemnantEngine.getState().blackHoleMassPlanckRatio).toBeCloseTo(1.85, 2);
    });
  });

  describe('3. TwistedTrilayerGrapheneTripletScEngine (扭轉三層石墨烯平帶自旋三重態莫爾超導與手性包立極限突破引擎)', () => {
    beforeEach(() => {
      twistedTrilayerGrapheneTripletScEngine.reset();
    });

    it('initializes at magic angle 1.56 deg with Pauli-limit violation > 3x and 16 moiré pairing nodes', () => {
      const state = twistedTrilayerGrapheneTripletScEngine.getState();
      expect(state.alternatingTwistAngleDeg).toBeCloseTo(1.56, 2);
      expect(state.pauliLimitViolationRatio).toBeGreaterThan(3.0);
      expect(state.moireNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('pauli-limit-violating-spin-triplet-phase');
    });

    it('exhibits high-in-plane-field reentrant non-unitary spin-triplet superconductivity', () => {
      const engine = new TwistedTrilayerGrapheneTripletScEngine();
      engine.setRegime('high-inplane-field-reentrant-nonunitary-sc');
      expect(engine.getState().inPlaneMagneticFieldTesla).toBeCloseTo(9.6, 1);
      expect(engine.getState().tripletSuperconductingGapMeV).toBeGreaterThan(0.5);
      expect(engine.getState().moireNodes[0].tripletSpinProjectionSz).toBe(1);
    });

    it('clamps twist angle, magnetic field, and displacement field parameters and updates phase', () => {
      twistedTrilayerGrapheneTripletScEngine.setAlternatingTwistAngle(0.5);
      expect(twistedTrilayerGrapheneTripletScEngine.getState().alternatingTwistAngleDeg).toBe(1.3);

      twistedTrilayerGrapheneTripletScEngine.setInPlaneMagneticField(20.0);
      expect(twistedTrilayerGrapheneTripletScEngine.getState().inPlaneMagneticFieldTesla).toBe(12.0);

      twistedTrilayerGrapheneTripletScEngine.setDisplacementFieldDz(2.0);
      expect(twistedTrilayerGrapheneTripletScEngine.getState().displacementFieldDzVnm).toBe(0.9);

      const p0 = twistedTrilayerGrapheneTripletScEngine.getState().pulsePhase;
      twistedTrilayerGrapheneTripletScEngine.update(0.2);
      expect(twistedTrilayerGrapheneTripletScEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => twistedTrilayerGrapheneTripletScEngine.triggerTrilayerGrapheneSound()).not.toThrow();
      twistedTrilayerGrapheneTripletScEngine.setAlternatingTwistAngle(1.75);
      twistedTrilayerGrapheneTripletScEngine.reset();
      expect(twistedTrilayerGrapheneTripletScEngine.getState().alternatingTwistAngleDeg).toBeCloseTo(1.56, 2);
    });
  });

  describe('4. SuperfluidHe3KibbleZurekMonopoleEngine (超流氦-3 宇宙學基布爾-祖瑞克相變單極子與愛因斯坦-嘉當扭率渦旋模擬器引擎)', () => {
    beforeEach(() => {
      superfluidHe3KibbleZurekMonopoleEngine.reset();
    });

    it('initializes with A-B interface Dirac monopole Boojum array and 16 topological defect nodes', () => {
      const state = superfluidHe3KibbleZurekMonopoleEngine.getState();
      expect(state.quenchRateInverseTauQ).toBeCloseTo(3.4, 2);
      expect(state.abPhaseBoundaryPressureBar).toBeCloseTo(24.5, 1);
      expect(state.diracMonopoleHomotopyCount).toBeGreaterThanOrEqual(6);
      expect(state.defectNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('ab-interface-dirac-monopole-boojum-array');
    });

    it('scales Kibble-Zurek vortex density with square root of quench rate and boosts torsion in high-pressure He3-A phase', () => {
      const engine = new SuperfluidHe3KibbleZurekMonopoleEngine();
      engine.setQuenchRateInverseTauQ(1.0);
      const densityLow = engine.getState().kibbleZurekVortexDensityMm2;
      engine.setQuenchRateInverseTauQ(4.0);
      const densityHigh = engine.getState().kibbleZurekVortexDensityMm2;
      expect(densityHigh / densityLow).toBeCloseTo(2.0, 1);

      engine.setRegime('chiral-he3a-weyl-einstein-cartan-torsion');
      expect(engine.getState().einsteinCartanTorsionScalar).toBeGreaterThan(3.5);
    });

    it('clamps quench rate and pressure parameters and advances phase on update', () => {
      superfluidHe3KibbleZurekMonopoleEngine.setQuenchRateInverseTauQ(20.0);
      expect(superfluidHe3KibbleZurekMonopoleEngine.getState().quenchRateInverseTauQ).toBe(8.5);

      superfluidHe3KibbleZurekMonopoleEngine.setAbPhasePressureBar(0.1);
      expect(superfluidHe3KibbleZurekMonopoleEngine.getState().abPhaseBoundaryPressureBar).toBe(1.0);

      const p0 = superfluidHe3KibbleZurekMonopoleEngine.getState().pulsePhase;
      superfluidHe3KibbleZurekMonopoleEngine.update(0.25);
      expect(superfluidHe3KibbleZurekMonopoleEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => superfluidHe3KibbleZurekMonopoleEngine.triggerHe3KibbleZurekSound()).not.toThrow();
      superfluidHe3KibbleZurekMonopoleEngine.setAbPhasePressureBar(10.0);
      superfluidHe3KibbleZurekMonopoleEngine.reset();
      expect(superfluidHe3KibbleZurekMonopoleEngine.getState().abPhaseBoundaryPressureBar).toBeCloseTo(24.5, 1);
    });
  });

  describe('5. Part 61 Achievements Registration (260 Total Achievements)', () => {
    it('registers all 4 Part 61 frontier physics achievements and reaches at least 260 total achievements', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(260);

      const part61Ids = [
        'time_quasicrystal_incommensurate_floquet_pump',
        'planck_core_regular_black_hole_remnant',
        'twisted_trilayer_graphene_pauli_violation_sc',
        'superfluid_he3_kibble_zurek_torsion_monopole'
      ];

      for (const id of part61Ids) {
        const found = all.find((a) => a.id === id);
        expect(found).toBeDefined();
        achievements.unlock(id);
        expect(achievements.getAll().find((a) => a.id === id)?.unlocked).toBe(true);
      }
    });
  });
});
