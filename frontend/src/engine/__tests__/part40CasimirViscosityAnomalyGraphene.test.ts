import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dynamicalCasimirEngine } from '../dynamicalCasimirEffect';
import { hallViscosityEngine } from '../hallViscosityReadRezayi';
import { gravitationalChiralAnomalyEngine } from '../gravitationalChiralAnomalyWeyl';
import { magicAngleGrapheneEngine } from '../magicAngleTwistedGraphene';

describe('Part 40: 動力學卡西米爾、霍爾黏度、外爾引力反常與魔角石墨烯平帶測試', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dynamicalCasimirEngine.reset();
    hallViscosityEngine.reset();
    gravitationalChiralAnomalyEngine.reset();
    magicAngleGrapheneEngine.reset();
  });

  describe('1. 動力學卡西米爾效應與 SQUID 加速運動邊界 (Dynamical Casimir Effect)', () => {
    it('應正確初始化微波頻率、反射鏡相對論速度與光子產生率', () => {
      const state = dynamicalCasimirEngine.getState();
      expect(state.boundaryOscillationFreqGhz).toBe(10.4);
      expect(state.effectiveMirrorVelocityBeta).toBe(0.25);
      expect(state.photonPairRatePerSec).toBeGreaterThan(1e5);
      expect(state.quantumSqueezingDb).toBeGreaterThan(0);
      expect(state.regime).toBe('relativistic-dynamical-casimir-emission');
    });

    it('降低反射鏡速度至微擾極限應進入寧靜基態虛光子對相', () => {
      dynamicalCasimirEngine.setMirrorVelocityBeta(0.01);
      const state = dynamicalCasimirEngine.getState();
      expect(state.effectiveMirrorVelocityBeta).toBe(0.01);
      expect(state.regime).toBe('quiescent-vacuum-virtual-pairs');
      expect(state.photonPairRatePerSec).toBeLessThan(1e6);
    });

    it('提高腔體 Q 值與反射鏡速度應產生強量子噪聲壓縮與高糾纏熵', () => {
      dynamicalCasimirEngine.setCavityQ(35000);
      dynamicalCasimirEngine.setMirrorVelocityBeta(0.35);
      const state = dynamicalCasimirEngine.getState();
      expect(state.quantumSqueezingDb).toBeGreaterThan(10.0);
      expect(state.twoModeEntanglementEntropy).toBeGreaterThan(1.5);
      expect(state.quadratureNoiseRatio).toBeLessThan(0.15);
      expect(state.regime).toBe('quantum-squeezing-saturation');
    });

    it('手動觸發 DCE 光子對爆發應累積計數並維持相對論發射相', () => {
      const initialCount = dynamicalCasimirEngine.getState().totalEmittedPhotonsCount;
      dynamicalCasimirEngine.triggerDceEmission();
      const state = dynamicalCasimirEngine.getState();
      expect(state.totalEmittedPhotonsCount).toBe(initialCount + 25000);
      expect(state.effectiveMirrorVelocityBeta).toBe(0.32);
      expect(state.regime).toBe('relativistic-dynamical-casimir-emission');
    });

    it('相態輪轉與重置應能正常循環且數值一致', () => {
      dynamicalCasimirEngine.cycleRegime();
      expect(dynamicalCasimirEngine.getState().regime).toBeDefined();
      dynamicalCasimirEngine.reset();
      expect(dynamicalCasimirEngine.getState().effectiveMirrorVelocityBeta).toBe(0.25);
      expect(dynamicalCasimirEngine.getState().squidMagneticFluxPhi0).toBe(0.35);
    });
  });

  describe('2. 量子霍爾奇性黏滯度與 Read-Rezayi 幾何流體 (Hall Viscosity & Read-Rezayi)', () => {
    it('應正確初始化 Read-Rezayi 霍爾黏度且能量耗散率嚴格為零', () => {
      const state = hallViscosityEngine.getState();
      expect(state.electronDensity10_11Cm2).toBe(2.4);
      expect(state.wenZeeShiftS).toBe(1.0);
      expect(state.meanOrbitalSpinSBar).toBe(0.5);
      expect(state.hallViscosityPascalS).toBeGreaterThan(0);
      expect(state.energyDissipationRateWatts).toBe(0.0);
      expect(state.regime).toBe('integer-qhe-hall-viscosity');
    });

    it('零拓撲移位時應退化為傳統常規耗散流體相', () => {
      hallViscosityEngine.setShiftS(0.0);
      const state = hallViscosityEngine.getState();
      expect(state.meanOrbitalSpinSBar).toBe(0.0);
      expect(state.regime).toBe('dissipative-viscous-fluid');
    });

    it('切換至 Laughlin 分數量子霍爾態應展現較高軌道自旋與聲學雙折射', () => {
      hallViscosityEngine.setFillingFactor(0.333);
      hallViscosityEngine.setShiftS(3.0);
      const state = hallViscosityEngine.getState();
      expect(state.meanOrbitalSpinSBar).toBe(1.5);
      expect(state.acousticBirefringenceSplitM_S).toBeGreaterThan(4.0);
      expect(state.regime).toBe('fractional-laughlin-odd-viscosity');
    });

    it('手動觸發手性剪切波應增加剪切循環數並轉入分數量子霍爾相', () => {
      const initialCycles = hallViscosityEngine.getState().shearStressCycleCount;
      hallViscosityEngine.triggerChiralShearWave();
      const state = hallViscosityEngine.getState();
      expect(state.shearStressCycleCount).toBe(initialCycles + 100);
      expect(state.regime).toBe('fractional-laughlin-odd-viscosity');
    });

    it('相態輪轉與重置應能正常還原預設態', () => {
      hallViscosityEngine.cycleRegime();
      expect(hallViscosityEngine.getState().regime).toBeDefined();
      hallViscosityEngine.reset();
      expect(hallViscosityEngine.getState().wenZeeShiftS).toBe(1.0);
      expect(hallViscosityEngine.getState().energyDissipationRateWatts).toBe(0.0);
    });
  });

  describe('3. 外爾費米子混合軸向-引力反常與熱電霍爾輸運 (Gravitational Chiral Anomaly)', () => {
    it('應正確初始化溫度梯度、平行磁場與熱電反常指標', () => {
      const state = gravitationalChiralAnomalyEngine.getState();
      expect(state.temperatureKelvin).toBe(25.0);
      expect(state.thermalGradientKPerMm).toBe(4.5);
      expect(state.magneticFieldParallelTesla).toBe(8.0);
      expect(state.lorentzRatioLOverL0).toBeGreaterThan(1.5);
      expect(state.regime).toBe('mixed-gravitational-anomaly-active');
    });

    it('極低磁場與弱熱梯度下應退化為傳統費米液體滿足維德曼-夫蘭茲定律', () => {
      gravitationalChiralAnomalyEngine.setMagneticField(0.1);
      gravitationalChiralAnomalyEngine.setThermalGradient(0.05);
      const state = gravitationalChiralAnomalyEngine.getState();
      expect(state.lorentzRatioLOverL0).toBeCloseTo(1.0, 1);
      expect(state.regime).toBe('trivial-fermi-liquid-lorentz');
    });

    it('強平行磁場應導致顯著的維德曼-夫蘭茲定律破壞 (L/L0 > 2.0)', () => {
      gravitationalChiralAnomalyEngine.setMagneticField(10.0);
      gravitationalChiralAnomalyEngine.setThermalGradient(6.0);
      const state = gravitationalChiralAnomalyEngine.getState();
      expect(state.lorentzRatioLOverL0).toBeGreaterThan(2.0);
      expect(state.longitudinalThermalConductivityWmK).toBeGreaterThan(15.0);
      expect(state.regime).toBe('quantum-wiedemann-franz-violation');
    });

    it('手動觸發引力反常熱輸運爆發應切換至量子化熱霍爾飽和相', () => {
      const initialCount = gravitationalChiralAnomalyEngine.getState().anomalyEventsAccumulatedCount;
      gravitationalChiralAnomalyEngine.triggerGravitationalAnomalyBurst();
      const state = gravitationalChiralAnomalyEngine.getState();
      expect(state.anomalyEventsAccumulatedCount).toBe(initialCount + 50);
      expect(state.regime).toBe('topological-thermal-hall-saturation');
    });

    it('輪轉相態與重置能正確回復初值', () => {
      gravitationalChiralAnomalyEngine.cycleRegime();
      expect(gravitationalChiralAnomalyEngine.getState().regime).toBeDefined();
      gravitationalChiralAnomalyEngine.reset();
      expect(gravitationalChiralAnomalyEngine.getState().magneticFieldParallelTesla).toBe(8.0);
    });
  });

  describe('4. 魔角扭轉雙層石墨烯平帶與非常規超導 (Magic-Angle Twisted Bilayer Graphene)', () => {
    it('應正確初始化魔角 1.08 度、超窄平帶帶寬與超導轉變溫度', () => {
      const state = magicAngleGrapheneEngine.getState();
      expect(state.twistAngleDeg).toBe(1.08);
      expect(state.flatBandWidthMev).toBeLessThan(10.0);
      expect(state.superconductingTcKelvin).toBeGreaterThan(1.0);
      expect(state.moireSuperlatticePeriodNm).toBeCloseTo(13.05, 1);
      expect(state.regime).toBe('unconventional-superconducting-dome');
    });

    it('偏離魔角時應色散加寬並進入色散狄拉克半金屬態', () => {
      magicAngleGrapheneEngine.setTwistAngle(1.40);
      const state = magicAngleGrapheneEngine.getState();
      expect(state.flatBandWidthMev).toBeGreaterThan(25.0);
      expect(state.superconductingTcKelvin).toBe(0.0);
      expect(state.regime).toBe('dispersive-dirac-semimetal');
    });

    it('精確半填充 nu = -2.0 處應打開關聯莫特能隙', () => {
      magicAngleGrapheneEngine.setTwistAngle(1.08);
      magicAngleGrapheneEngine.setFillingFactor(-2.0);
      magicAngleGrapheneEngine.setTemperature(3.5);
      const state = magicAngleGrapheneEngine.getState();
      expect(state.mottInsulatingGapMev).toBeGreaterThan(2.0);
      expect(state.regime).toBe('correlated-mott-insulator');
    });

    it('手動觸發超導相變應重置最佳載流子摻雜並進入非常規超導相', () => {
      const initialCount = magicAngleGrapheneEngine.getState().superconductingPhaseEventsCount;
      magicAngleGrapheneEngine.triggerSuperconductivity();
      const state = magicAngleGrapheneEngine.getState();
      expect(state.superconductingPhaseEventsCount).toBe(initialCount + 10);
      expect(state.twistAngleDeg).toBe(1.08);
      expect(state.moireFillingFactorNu).toBe(-2.15);
      expect(state.regime).toBe('unconventional-superconducting-dome');
    });

    it('輪轉相態與重置應能正常回復魔角平帶預設值', () => {
      magicAngleGrapheneEngine.cycleRegime();
      expect(magicAngleGrapheneEngine.getState().regime).toBeDefined();
      magicAngleGrapheneEngine.reset();
      expect(magicAngleGrapheneEngine.getState().twistAngleDeg).toBe(1.08);
      expect(magicAngleGrapheneEngine.getState().flatBandWidthMev).toBe(8.0);
    });
  });
});
