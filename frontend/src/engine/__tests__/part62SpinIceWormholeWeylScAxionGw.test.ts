import { describe, it, expect, beforeEach } from 'vitest';
import {
  quantumSpinIceMonopolePlasmaEngine,
  QuantumSpinIceMonopolePlasmaEngine
} from '../quantumSpinIceMonopolePlasma';
import {
  holographicWormholeComplexityVolumeEngine,
  HolographicWormholeComplexityVolumeEngine
} from '../holographicWormholeComplexityVolume';
import {
  weylSuperconductorChiralAndreevLaserEngine,
  WeylSuperconductorChiralAndreevLaserEngine
} from '../weylSuperconductorChiralAndreevLaser';
import {
  axionStringDomainWallGwBackgroundEngine,
  AxionStringDomainWallGwBackgroundEngine
} from '../axionStringDomainWallGwBackground';
import { achievements } from '../achievements';

describe('Part 62 Frontier Physics Engines', () => {
  describe('1. QuantumSpinIceMonopolePlasmaEngine (非阿貝爾量子自旋冰與湧現規範磁單極子電漿引擎)', () => {
    beforeEach(() => {
      quantumSpinIceMonopolePlasmaEngine.reset();
    });

    it('initializes with coherent U(1) quantum spin liquid photon state and 16 pyrochlore tetrahedron nodes', () => {
      const state = quantumSpinIceMonopolePlasmaEngine.getState();
      expect(state.transverseExchangeRatioJpm).toBeCloseTo(0.14, 2);
      expect(state.emergentLightSpeedMps).toBeGreaterThan(10);
      expect(state.pinchPointSharpnessRatio).toBeGreaterThan(0.75);
      expect(state.tetrahedronNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('coherent-u1-quantum-spin-liquid-photon');
    });

    it('broadens neutron scattering pinch points in Debye-screened monopole plasma and boosts vison gap in vison crystal', () => {
      const engine = new QuantumSpinIceMonopolePlasmaEngine();
      engine.setRegime('debye-screened-monopole-plasma-pinch');
      expect(engine.getState().monopolePlasmaDensityPct).toBeCloseTo(42.5, 1);
      expect(engine.getState().pinchPointSharpnessRatio).toBeLessThan(0.35);

      engine.setRegime('pi-flux-fractionalized-vison-crystal');
      expect(engine.getState().visonGapEnergyMeV).toBeGreaterThan(0.5);
    });

    it('clamps transverse exchange and monopole plasma density and advances phase on update', () => {
      quantumSpinIceMonopolePlasmaEngine.setTransverseExchangeRatio(1.0);
      expect(quantumSpinIceMonopolePlasmaEngine.getState().transverseExchangeRatioJpm).toBe(0.35);

      quantumSpinIceMonopolePlasmaEngine.setMonopolePlasmaDensity(99.0);
      expect(quantumSpinIceMonopolePlasmaEngine.getState().monopolePlasmaDensityPct).toBe(65.0);

      const p0 = quantumSpinIceMonopolePlasmaEngine.getState().pulsePhase;
      quantumSpinIceMonopolePlasmaEngine.update(0.25);
      expect(quantumSpinIceMonopolePlasmaEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => quantumSpinIceMonopolePlasmaEngine.triggerQuantumSpinIceSound()).not.toThrow();
      quantumSpinIceMonopolePlasmaEngine.setTransverseExchangeRatio(0.3);
      quantumSpinIceMonopolePlasmaEngine.reset();
      expect(quantumSpinIceMonopolePlasmaEngine.getState().transverseExchangeRatioJpm).toBeCloseTo(0.14, 2);
    });
  });

  describe('2. HolographicWormholeComplexityVolumeEngine (全息蟲洞複雜度等於體積生長與後佩奇量子洛倫茲橋引擎)', () => {
    beforeEach(() => {
      holographicWormholeComplexityVolumeEngine.reset();
    });

    it('initializes with Lloyd-bound linear volume ramp and 16 maximal slice bridge nodes', () => {
      const state = holographicWormholeComplexityVolumeEngine.getState();
      expect(state.boundaryTimeExpEntropyRatio).toBeCloseTo(0.48, 2);
      expect(state.lloydGrowthRateRatio).toBeGreaterThan(0.85);
      expect(state.bridgeNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('lloyd-bound-linear-volume-ramp');
    });

    it('exhibits baby-universe tunneling plateau at exponential time and negative complexity growth in white-hole bounce', () => {
      const engine = new HolographicWormholeComplexityVolumeEngine();
      engine.setRegime('exponential-time-baby-universe-plateau');
      expect(engine.getState().babyUniverseTunnelingProb).toBeGreaterThan(0.9);
      expect(engine.getState().maximalSliceVolumeNormalized).toBeGreaterThan(0.95);

      engine.setRegime('white-hole-bounce-complexity-decreasing');
      expect(engine.getState().lloydGrowthRateRatio).toBeLessThan(0);
    });

    it('clamps time ratio and shockwave perturbation and advances phase on update', () => {
      holographicWormholeComplexityVolumeEngine.setBoundaryTimeRatio(5.0);
      expect(holographicWormholeComplexityVolumeEngine.getState().boundaryTimeExpEntropyRatio).toBe(1.6);

      holographicWormholeComplexityVolumeEngine.setShockwavePerturbation(10.0);
      expect(holographicWormholeComplexityVolumeEngine.getState().shockwavePerturbationEnergy).toBe(5.0);

      const p0 = holographicWormholeComplexityVolumeEngine.getState().pulsePhase;
      holographicWormholeComplexityVolumeEngine.update(0.25);
      expect(holographicWormholeComplexityVolumeEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => holographicWormholeComplexityVolumeEngine.triggerWormholeComplexitySound()).not.toThrow();
      holographicWormholeComplexityVolumeEngine.setBoundaryTimeRatio(1.2);
      holographicWormholeComplexityVolumeEngine.reset();
      expect(holographicWormholeComplexityVolumeEngine.getState().boundaryTimeExpEntropyRatio).toBeCloseTo(0.48, 2);
    });
  });

  describe('3. WeylSuperconductorChiralAndreevLaserEngine (拓撲外爾超導體手性安德烈夫束縛態與貝里偶極微波雷射引擎)', () => {
    beforeEach(() => {
      weylSuperconductorChiralAndreevLaserEngine.reset();
    });

    it('initializes with stimulated chiral Andreev microwave laser state and 16 Fermi-arc nodes', () => {
      const state = weylSuperconductorChiralAndreevLaserEngine.getState();
      expect(state.weylNodeSeparationInvNm).toBeCloseTo(0.92, 2);
      expect(state.stimulatedMicrowaveGainDb).toBeGreaterThan(10);
      expect(state.andreevNodes).toHaveLength(16);
      expect(state.andreevNodes[0].nodeChirality).toBe(1);
      expect(state.andreevNodes[15].nodeChirality).toBe(-1);
    });

    it('boosts second-harmonic rectification in Berry curvature dipole regime', () => {
      const engine = new WeylSuperconductorChiralAndreevLaserEngine();
      engine.setRegime('berry-curvature-dipole-second-harmonic');
      expect(engine.getState().berryCurvatureDipoleNm).toBeCloseTo(2.15, 2);
      expect(engine.getState().nonlinearHallRectificationPct).toBeGreaterThan(80);
    });

    it('clamps Weyl node separation, Berry dipole, and pump bias and advances phase on update', () => {
      weylSuperconductorChiralAndreevLaserEngine.setWeylNodeSeparation(5.0);
      expect(weylSuperconductorChiralAndreevLaserEngine.getState().weylNodeSeparationInvNm).toBe(1.8);

      weylSuperconductorChiralAndreevLaserEngine.setBerryCurvatureDipole(0.01);
      expect(weylSuperconductorChiralAndreevLaserEngine.getState().berryCurvatureDipoleNm).toBe(0.1);

      weylSuperconductorChiralAndreevLaserEngine.setQuasiparticlePumpBias(10.0);
      expect(weylSuperconductorChiralAndreevLaserEngine.getState().quasiparticlePumpBiasRatio).toBe(2.5);

      const p0 = weylSuperconductorChiralAndreevLaserEngine.getState().pulsePhase;
      weylSuperconductorChiralAndreevLaserEngine.update(0.2);
      expect(weylSuperconductorChiralAndreevLaserEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => weylSuperconductorChiralAndreevLaserEngine.triggerWeylAndreevLaserSound()).not.toThrow();
      weylSuperconductorChiralAndreevLaserEngine.setWeylNodeSeparation(1.5);
      weylSuperconductorChiralAndreevLaserEngine.reset();
      expect(weylSuperconductorChiralAndreevLaserEngine.getState().weylNodeSeparationInvNm).toBeCloseTo(0.92, 2);
    });
  });

  describe('4. AxionStringDomainWallGwBackgroundEngine (宇宙軸子弦-疇壁網路湮滅與納赫茲隨機引力波背景譜儀引擎)', () => {
    beforeEach(() => {
      axionStringDomainWallGwBackgroundEngine.reset();
    });

    it('initializes with nano-Hertz PTA peak state and 16 cosmic string-wall network nodes', () => {
      const state = axionStringDomainWallGwBackgroundEngine.getState();
      expect(state.pecceiQuinnScaleLogGeV).toBeCloseTo(14.2, 1);
      expect(state.hellingsDownsQuadrupoleSnr).toBeGreaterThan(10);
      expect(state.networkNodes).toHaveLength(16);
      expect(state.activeRegime).toBe('biased-ndw-greater-one-nanohertz-pta-peak');
    });

    it('increases gravitational-wave energy density with higher Peccei-Quinn scale and domain wall number N_DW', () => {
      const engine = new AxionStringDomainWallGwBackgroundEngine();
      engine.setRegime('post-inflation-scaling-axion-string-loops');
      const omegaLow = engine.getState().peakGwDensityLogOmegaH2;

      engine.setRegime('hellings-downs-pulsar-quadrupole-lock');
      const omegaHigh = engine.getState().peakGwDensityLogOmegaH2;
      expect(omegaHigh).toBeGreaterThan(omegaLow);
      expect(engine.getState().domainWallNumberNdw).toBe(6);
    });

    it('clamps PQ scale and snaps N_DW to allowed topological values and advances phase on update', () => {
      axionStringDomainWallGwBackgroundEngine.setPecceiQuinnScaleLog(20.0);
      expect(axionStringDomainWallGwBackgroundEngine.getState().pecceiQuinnScaleLogGeV).toBe(15.5);

      axionStringDomainWallGwBackgroundEngine.setDomainWallNumber(5);
      expect(axionStringDomainWallGwBackgroundEngine.getState().domainWallNumberNdw).toBe(6);

      const p0 = axionStringDomainWallGwBackgroundEngine.getState().pulsePhase;
      axionStringDomainWallGwBackgroundEngine.update(0.25);
      expect(axionStringDomainWallGwBackgroundEngine.getState().pulsePhase).toBeGreaterThan(p0);
    });

    it('safely executes Web Audio synthesis and resets state', () => {
      expect(() => axionStringDomainWallGwBackgroundEngine.triggerAxionStringGwSound()).not.toThrow();
      axionStringDomainWallGwBackgroundEngine.setPecceiQuinnScaleLog(11.0);
      axionStringDomainWallGwBackgroundEngine.reset();
      expect(axionStringDomainWallGwBackgroundEngine.getState().pecceiQuinnScaleLogGeV).toBeCloseTo(14.2, 1);
    });
  });

  describe('5. Part 62 Achievements Registration (264 Total Achievements)', () => {
    it('registers all 4 Part 62 frontier physics achievements and reaches at least 264 total achievements', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(264);

      const part62Ids = [
        'quantum_spin_ice_emergent_monopole_plasma',
        'holographic_wormhole_complexity_volume_plateau',
        'weyl_superconductor_chiral_andreev_laser',
        'axion_string_domain_wall_nanohertz_gw'
      ];

      for (const id of part62Ids) {
        const found = all.find((a) => a.id === id);
        expect(found).toBeDefined();
        achievements.unlock(id);
        expect(achievements.getAll().find((a) => a.id === id)?.unlocked).toBe(true);
      }
    });
  });
});
