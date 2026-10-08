import { describe, it, expect, beforeEach, vi } from 'vitest';
import { moireSuperconductorEngine } from '../moireFlatBandSuperconductor';
import { gwMemoryEngine } from '../gravitationalWaveMemory';
import { antiferroMagnonEngine } from '../antiferroTopologicalMagnon';
import { holographicWormholeEngine } from '../holographicWormholeTeleport';
import { achievements } from '../achievements';

describe('Part 27: Moiré Flat-Band Superconductor, GW Memory, Antiferromagnetic Magnon & Holographic Wormhole', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('MoireFlatBandSuperconductorEngine (拓撲莫爾超晶格平帶非常規超導反應堆)', () => {
    it('應正確初始化並返回預設物理狀態', () => {
      const state = moireSuperconductorEngine.getState();
      expect(state.twistAngleDeg).toBeCloseTo(1.08, 1);
      expect(state.moirePeriodNm).toBeGreaterThan(10);
      expect(state.flatBandwidthMev).toBeGreaterThan(0);
      expect(state.fermiVelocityRatio).toBeGreaterThan(0);
      expect(state.coulombRatioUW).toBeGreaterThan(0);
      expect(state.superconductingGapMev).toBeGreaterThanOrEqual(0);
      expect(state.criticalTempK).toBeGreaterThan(0);
      expect(state.quantumMetricTrace).toBeGreaterThan(0);
      expect(state.superfluidStiffness).toBeGreaterThan(0);
      expect(state.regime).toBeDefined();
    });

    it('調整旋轉扭角並驗證魔角平帶帶寬極小化', () => {
      // 設為魔角 1.08 度
      moireSuperconductorEngine.setTwistAngle(1.08);
      const magicBandwidth = moireSuperconductorEngine.getState().flatBandwidthMev;
      expect(magicBandwidth).toBeLessThan(10.0);

      // 偏離魔角 (如 2.2 度)，帶寬應大幅展寬
      moireSuperconductorEngine.setTwistAngle(2.2);
      const wideBandwidth = moireSuperconductorEngine.getState().flatBandwidthMev;
      expect(wideBandwidth).toBeGreaterThan(magicBandwidth);

      // 邊界防護 (0.8 ~ 3.0)
      moireSuperconductorEngine.setTwistAngle(0.2);
      expect(moireSuperconductorEngine.getState().twistAngleDeg).toBe(0.8);
      moireSuperconductorEngine.setTwistAngle(5.5);
      expect(moireSuperconductorEngine.getState().twistAngleDeg).toBe(3.0);
    });

    it('調整微觀填充數 ν 與層間雜化能', () => {
      moireSuperconductorEngine.setFillingFactor(-2.15);
      expect(moireSuperconductorEngine.getState().fillingFactor).toBe(-2.15);

      // 邊界防護 (-4.0 ~ 4.0)
      moireSuperconductorEngine.setFillingFactor(-6.0);
      expect(moireSuperconductorEngine.getState().fillingFactor).toBe(-4.0);
      moireSuperconductorEngine.setFillingFactor(6.0);
      expect(moireSuperconductorEngine.getState().fillingFactor).toBe(4.0);

      // 耦合能調節 (80 ~ 130)
      moireSuperconductorEngine.setInterlayerCoupling(110);
      expect(moireSuperconductorEngine.getState().interlayerCouplingW0).toBe(110);
      moireSuperconductorEngine.setInterlayerCoupling(50);
      expect(moireSuperconductorEngine.getState().interlayerCouplingW0).toBe(80);
      moireSuperconductorEngine.setInterlayerCoupling(200);
      expect(moireSuperconductorEngine.getState().interlayerCouplingW0).toBe(130);
    });

    it('切換 4 種強關聯莫爾拓撲體制', () => {
      moireSuperconductorEngine.setRegime('mott-insulator');
      expect(moireSuperconductorEngine.getState().regime).toBe('mott-insulator');
      expect(moireSuperconductorEngine.getState().superconductingGapMev).toBe(0);

      moireSuperconductorEngine.setRegime('unconventional-sc');
      expect(moireSuperconductorEngine.getState().regime).toBe('unconventional-sc');

      moireSuperconductorEngine.setRegime('valley-polarized');
      expect(moireSuperconductorEngine.getState().regime).toBe('valley-polarized');

      moireSuperconductorEngine.setRegime('quantum-metric-sf');
      expect(moireSuperconductorEngine.getState().regime).toBe('quantum-metric-sf');
      expect(moireSuperconductorEngine.getState().superfluidStiffness).toBeGreaterThan(0.5);
    });

    it('注入超流脈衝與動態演化更新', () => {
      const prevStiff = moireSuperconductorEngine.getState().superfluidStiffness;
      moireSuperconductorEngine.triggerSupercurrentPulse();
      expect(moireSuperconductorEngine.getState().superfluidStiffness).toBeGreaterThanOrEqual(prevStiff);

      moireSuperconductorEngine.update(0.016);
      expect(moireSuperconductorEngine.getState()).toBeDefined();
    });
  });

  describe('GravitationalWaveMemoryEngine (時空引力波記憶效應天線矩陣)', () => {
    it('應正確初始化並返回預設記憶狀態', () => {
      const state = gwMemoryEngine.getState();
      expect(state.sourceDistanceMpc).toBeGreaterThan(0);
      expect(state.totalMassSolar).toBeGreaterThan(0);
      expect(state.massRatioQ).toBeGreaterThanOrEqual(1.0);
      expect(state.radiatedEnergyPct).toBeGreaterThan(0);
      expect(state.memoryStrainH).toBeGreaterThan(0);
      expect(state.oscillatoryPeakH).toBeGreaterThan(0);
      expect(state.testMassDisplacementPm).toBeGreaterThan(0);
      expect(state.bmsSupertranslationCharge).toBeGreaterThan(0);
      expect(state.softGravitonDensity).toBeGreaterThan(0);
    });

    it('調整天體距離、總質量、質量比與輻射損失率', () => {
      gwMemoryEngine.setDistance(200);
      expect(gwMemoryEngine.getState().sourceDistanceMpc).toBe(200);
      gwMemoryEngine.setDistance(5);
      expect(gwMemoryEngine.getState().sourceDistanceMpc).toBe(10);
      gwMemoryEngine.setDistance(2000);
      expect(gwMemoryEngine.getState().sourceDistanceMpc).toBe(1000);

      gwMemoryEngine.setTotalMass(120);
      expect(gwMemoryEngine.getState().totalMassSolar).toBe(120);
      gwMemoryEngine.setTotalMass(5);
      expect(gwMemoryEngine.getState().totalMassSolar).toBe(10);
      gwMemoryEngine.setTotalMass(500);
      expect(gwMemoryEngine.getState().totalMassSolar).toBe(250);

      gwMemoryEngine.setMassRatio(2.5);
      expect(gwMemoryEngine.getState().massRatioQ).toBe(2.5);

      gwMemoryEngine.setRadiatedEnergy(6.0);
      expect(gwMemoryEngine.getState().radiatedEnergyPct).toBe(6.0);
    });

    it('切換 4 種引力波記憶體制', () => {
      gwMemoryEngine.setRegime('christodoulou-nonlinear');
      expect(gwMemoryEngine.getState().regime).toBe('christodoulou-nonlinear');

      gwMemoryEngine.setRegime('linear-supernova');
      expect(gwMemoryEngine.getState().regime).toBe('linear-supernova');

      gwMemoryEngine.setRegime('bms-supertranslation');
      expect(gwMemoryEngine.getState().regime).toBe('bms-supertranslation');
      expect(gwMemoryEngine.getState().bmsSupertranslationCharge).toBeGreaterThan(1.0);

      gwMemoryEngine.setRegime('soft-graviton-vacuum');
      expect(gwMemoryEngine.getState().regime).toBe('soft-graviton-vacuum');
      expect(gwMemoryEngine.getState().softGravitonDensity).toBeGreaterThan(2.0);
    });

    it('觸發雙黑洞併合引力波暴並動態前進相位', () => {
      gwMemoryEngine.triggerMergerBurst();
      expect(gwMemoryEngine.getState().mergerPhase).toBe(0.0);

      // 前進演化
      gwMemoryEngine.update(0.5);
      expect(gwMemoryEngine.getState().mergerPhase).toBeGreaterThan(0.0);

      // 持續演化至完全併合
      gwMemoryEngine.update(1.0);
      expect(gwMemoryEngine.getState().mergerPhase).toBe(1.0);
      expect(gwMemoryEngine.getState().waveformHistory.length).toBeGreaterThan(0);
    });
  });

  describe('AntiferroTopologicalMagnonEngine (反鐵磁拓撲磁振子狄拉克半金屬波導)', () => {
    it('應正確初始化並返回預設反鐵磁狀態', () => {
      const state = antiferroMagnonEngine.getState();
      expect(state.resonanceFreqThz).toBeGreaterThan(0.4);
      expect(state.topologicalGapMev).toBeGreaterThan(0);
      expect(state.chernNumber).toBeDefined();
      expect(state.thermalHallConductivity).toBeGreaterThanOrEqual(0);
      expect(state.spinWaveVelocityKmS).toBeGreaterThan(5.0);
      expect(state.berryCurvaturePeak).toBeGreaterThan(0);
    });

    it('調整外加磁場並驗證自旋翻轉相變 (Spin-Flop)', () => {
      // 弱場低於 4.8T
      antiferroMagnonEngine.setAppliedField(2.0);
      expect(antiferroMagnonEngine.getState().appliedFieldTesla).toBe(2.0);
      expect(antiferroMagnonEngine.getState().chernNumber).toBe(1);

      // 強場超過 4.8T (激發自旋翻轉)
      antiferroMagnonEngine.setAppliedField(6.0);
      expect(antiferroMagnonEngine.getState().appliedFieldTesla).toBe(6.0);
      expect(antiferroMagnonEngine.getState().chernNumber).toBe(2);

      // 邊界防護 (0 ~ 10 T)
      antiferroMagnonEngine.setAppliedField(-2.0);
      expect(antiferroMagnonEngine.getState().appliedFieldTesla).toBe(0.0);
      antiferroMagnonEngine.setAppliedField(15.0);
      expect(antiferroMagnonEngine.getState().appliedFieldTesla).toBe(10.0);
    });

    it('調整 DMI 耦合強度比與溫度', () => {
      antiferroMagnonEngine.setDmiRatio(0.35);
      expect(antiferroMagnonEngine.getState().dmiCouplingRatio).toBe(0.35);
      antiferroMagnonEngine.setDmiRatio(-0.2);
      expect(antiferroMagnonEngine.getState().dmiCouplingRatio).toBe(0.0);
      antiferroMagnonEngine.setDmiRatio(0.9);
      expect(antiferroMagnonEngine.getState().dmiCouplingRatio).toBe(0.5);

      antiferroMagnonEngine.setTemperature(100);
      expect(antiferroMagnonEngine.getState().temperatureKelvin).toBe(100);
      antiferroMagnonEngine.setTemperature(0.1);
      expect(antiferroMagnonEngine.getState().temperatureKelvin).toBe(1.0);
      antiferroMagnonEngine.setTemperature(400);
      expect(antiferroMagnonEngine.getState().temperatureKelvin).toBe(300.0);
    });

    it('切換 4 種反鐵磁磁振子體制', () => {
      antiferroMagnonEngine.setRegime('terahertz-waveguide');
      expect(antiferroMagnonEngine.getState().regime).toBe('terahertz-waveguide');

      antiferroMagnonEngine.setRegime('neel-spin-flop');
      expect(antiferroMagnonEngine.getState().regime).toBe('neel-spin-flop');

      antiferroMagnonEngine.setRegime('chiral-thermal-hall');
      expect(antiferroMagnonEngine.getState().regime).toBe('chiral-thermal-hall');

      antiferroMagnonEngine.setRegime('topological-edge-soliton');
      expect(antiferroMagnonEngine.getState().regime).toBe('topological-edge-soliton');
    });

    it('注入太赫茲激發脈衝與引擎更新', () => {
      const prevV = antiferroMagnonEngine.getState().spinWaveVelocityKmS;
      antiferroMagnonEngine.injectTHzMagnonPulse();
      expect(antiferroMagnonEngine.getState().spinWaveVelocityKmS).toBeGreaterThanOrEqual(prevV);

      antiferroMagnonEngine.update(0.016);
      expect(antiferroMagnonEngine.getState()).toBeDefined();
    });
  });

  describe('HolographicWormholeTeleportEngine (全息蟲洞量子隱形傳態對偶反應爐)', () => {
    it('應正確初始化並返回預設全息蟲洞狀態', () => {
      const state = holographicWormholeEngine.getState();
      expect(state.couplingStrengthG).toBeGreaterThanOrEqual(0);
      expect(state.tfdTemperature).toBeGreaterThan(0);
      expect(state.throatOpeningDv).toBeDefined();
      expect(state.teleportFidelity).toBeGreaterThanOrEqual(0.5);
      expect(state.negativeEnergyDensity).toBeLessThan(0);
      expect(state.mutualInformation).toBeGreaterThan(0);
      expect(state.lyapunovExponent).toBeGreaterThan(0);
      expect(state.qubitTransitPhase).toBe(0.0);
    });

    it('調整雙邊耦合強度 g 與 TFD 溫度', () => {
      holographicWormholeEngine.setCouplingG(1.2);
      expect(holographicWormholeEngine.getState().couplingStrengthG).toBe(1.2);
      expect(holographicWormholeEngine.getState().negativeEnergyDensity).toBeLessThan(0);

      // 邊界防護 (0.0 ~ 2.0)
      holographicWormholeEngine.setCouplingG(-0.5);
      expect(holographicWormholeEngine.getState().couplingStrengthG).toBe(0.0);
      holographicWormholeEngine.setCouplingG(3.5);
      expect(holographicWormholeEngine.getState().couplingStrengthG).toBe(2.0);

      // 溫度 (0.05 ~ 1.5)
      holographicWormholeEngine.setTemperature(0.8);
      expect(holographicWormholeEngine.getState().tfdTemperature).toBe(0.8);
      holographicWormholeEngine.setTemperature(0.01);
      expect(holographicWormholeEngine.getState().tfdTemperature).toBe(0.05);
      holographicWormholeEngine.setTemperature(3.0);
      expect(holographicWormholeEngine.getState().tfdTemperature).toBe(1.5);
    });

    it('切換 4 種全息蟲洞幾何體制', () => {
      holographicWormholeEngine.setRegime('thermofield-double');
      expect(holographicWormholeEngine.getState().regime).toBe('thermofield-double');
      expect(holographicWormholeEngine.getState().teleportFidelity).toBe(0.5);

      holographicWormholeEngine.setRegime('negative-energy-throat');
      expect(holographicWormholeEngine.getState().regime).toBe('negative-energy-throat');

      holographicWormholeEngine.setRegime('quantum-teleport-pulse');
      expect(holographicWormholeEngine.getState().regime).toBe('quantum-teleport-pulse');
      expect(holographicWormholeEngine.getState().teleportFidelity).toBeGreaterThan(0.9);

      holographicWormholeEngine.setRegime('syk-many-body-chaos');
      expect(holographicWormholeEngine.getState().regime).toBe('syk-many-body-chaos');
    });

    it('發射量子位元隱形傳態並前進穿梭相位', () => {
      holographicWormholeEngine.launchQubitTeleport();
      expect(holographicWormholeEngine.getState().qubitTransitPhase).toBeGreaterThan(0.0);

      // 穿梭中
      holographicWormholeEngine.update(0.5);
      expect(holographicWormholeEngine.getState().qubitTransitPhase).toBeGreaterThan(0.2);

      // 穿梭完成
      holographicWormholeEngine.update(1.5);
      expect(holographicWormholeEngine.getState().qubitTransitPhase).toBe(1.0);
    });
  });

  describe('Achievements Integration (成就系統擴充至 124 項)', () => {
    it('應具備總計至少 124 個成就', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(124);
    });

    it('應能成功解鎖 4 個 Part 27 全新成就', () => {
      achievements.unlock('moire_flatband_superconductor');
      expect(achievements.isUnlocked('moire_flatband_superconductor')).toBe(true);

      achievements.unlock('gravitational_wave_memory');
      expect(achievements.isUnlocked('gravitational_wave_memory')).toBe(true);

      achievements.unlock('antiferro_topological_magnon');
      expect(achievements.isUnlocked('antiferro_topological_magnon')).toBe(true);

      achievements.unlock('holographic_wormhole_teleport');
      expect(achievements.isUnlocked('holographic_wormhole_teleport')).toBe(true);
    });
  });
});
