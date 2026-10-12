import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chiralSuperfluidEngine } from '../chiralSuperfluidPWave';
import { quantumSpinHallEngine } from '../quantumSpinHallHelical';
import { quantumKerrCombEngine } from '../quantumKerrSolitonComb';
import { holographicWeylFluidEngine } from '../holographicWeylFluid';

describe('Part 31: 拓撲手性超流體、量子自旋霍爾、克爾孤子光頻梳與全息外爾流體引擎測試套件', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 拓撲手性超流體 p_x + i p_y 庫珀對手性渦旋晶格反應堆 (chiralSuperfluidPWave)', () => {
    it('應正確初始化並提供拓撲非平凡 C=1 與半量子化渦旋預設值', () => {
      chiralSuperfluidEngine.resetDefaults();
      const state = chiralSuperfluidEngine.getState();
      expect(state.chernNumber).toBe(1);
      expect(state.pairingGapDeltaMev).toBeGreaterThan(0.5);
      expect(state.chemicalPotentialMuMev).toBeGreaterThan(0);
      expect(state.vortexDensityCount).toBeGreaterThan(0);
      expect(state.majoranaZeroModesCount).toBe(state.vortexDensityCount);
      expect(state.edgeSupercurrentMicroAmp).toBeGreaterThan(0);
      expect(state.spontaneousAngularMomentumHbar).toBeGreaterThan(0);
    });

    it('應正確約束參數上下界限', () => {
      chiralSuperfluidEngine.setParameters({
        pairingGapDeltaMev: 25.0, // 超出 12.0
        chemicalPotentialMuMev: -20.0, // 低於 -5.0
        vortexDensityCount: 150, // 超出 64
        temperatureKelvin: 0.0001, // 低於 0.001
        rotationalVelocityRads: 50.0 // 超出 25.0
      });
      const state = chiralSuperfluidEngine.getState();
      expect(state.pairingGapDeltaMev).toBe(12.0);
      expect(state.chemicalPotentialMuMev).toBe(-5.0);
      expect(state.vortexDensityCount).toBe(64);
      expect(state.temperatureKelvin).toBe(0.001);
      expect(state.rotationalVelocityRads).toBe(25.0);
    });

    it('化學勢小於零時應相變至平庸 BEC 跨接相 (C=0, 無馬約拉納零能模)', () => {
      chiralSuperfluidEngine.setParameters({
        chemicalPotentialMuMev: -2.0,
        regime: 'strong-pairing-bec-crossover'
      });
      const state = chiralSuperfluidEngine.getState();
      expect(state.chernNumber).toBe(0);
      expect(state.majoranaZeroModesCount).toBe(0);
      expect(state.topologicalEntropyKatsura).toBe(0.0);
    });

    it('切換配對相態與激發馬約拉納編織步進應正確更新指標', () => {
      chiralSuperfluidEngine.resetDefaults();
      const currentBefore = chiralSuperfluidEngine.getState().edgeSupercurrentMicroAmp;
      chiralSuperfluidEngine.injectMajoranaBraidingStep();
      expect(chiralSuperfluidEngine.getState().edgeSupercurrentMicroAmp).toBeGreaterThanOrEqual(currentBefore);

      chiralSuperfluidEngine.togglePairingPhase();
      expect(chiralSuperfluidEngine.getState().chemicalPotentialMuMev).toBeLessThan(0);
      expect(chiralSuperfluidEngine.getState().chernNumber).toBe(0);

      chiralSuperfluidEngine.togglePairingPhase();
      expect(chiralSuperfluidEngine.getState().chemicalPotentialMuMev).toBeGreaterThan(0);
      expect(chiralSuperfluidEngine.getState().chernNumber).toBe(1);
    });

    it('調用 update 應累積遙測記錄', () => {
      chiralSuperfluidEngine.update(0.1);
      expect(chiralSuperfluidEngine.getState().telemetryHistory.length).toBeGreaterThan(0);
    });
  });

  describe('2. 量子自旋霍爾效應螺旋邊緣態與時間反演反散射保護晶片 (quantumSpinHallHelical)', () => {
    it('應正確初始化並提供 ℤ₂=1 與量子化電導 G=2 e²/h 預設值', () => {
      quantumSpinHallEngine.resetDefaults();
      const state = quantumSpinHallEngine.getState();
      expect(state.z2Invariant).toBe(1);
      expect(state.conductanceE2H).toBeCloseTo(2.0, 1);
      expect(state.backscatteringSuppressionPercent).toBeGreaterThan(99.0);
      expect(state.spinPolarizationRatio).toBeGreaterThan(0.9);
      expect(state.meanFreePathMicrons).toBeGreaterThan(5.0);
    });

    it('應正確約束參數上下界限', () => {
      quantumSpinHallEngine.setParameters({
        quantumWellThicknessNm: 15.0, // 超出 9.0
        fermiEnergyMev: 100.0, // 超出 40.0
        magneticExchangeFieldTesla: -5.0, // 低於 0.0
        impurityDensityIndex: 2.5, // 超出 1.0
        bulkBandgapMev: 200.0 // 超出 100.0
      });
      const state = quantumSpinHallEngine.getState();
      expect(state.quantumWellThicknessNm).toBe(9.0);
      expect(state.fermiEnergyMev).toBe(40.0);
      expect(state.magneticExchangeFieldTesla).toBe(0.0);
      expect(state.impurityDensityIndex).toBe(1.0);
      expect(state.bulkBandgapMev).toBe(100.0);
    });

    it('厚度小於臨界值 6.3nm 時應退化為平庸絕緣體 (ℤ₂=0)', () => {
      quantumSpinHallEngine.setParameters({
        quantumWellThicknessNm: 5.2
      });
      const state = quantumSpinHallEngine.getState();
      expect(state.z2Invariant).toBe(0);
      expect(state.conductanceE2H).toBeLessThan(1.0);
    });

    it('施加磁性交換場破缺時間反演時應打開狄拉克隙並增加散射', () => {
      quantumSpinHallEngine.resetDefaults();
      quantumSpinHallEngine.toggleMagneticField();
      const state = quantumSpinHallEngine.getState();
      expect(state.magneticExchangeFieldTesla).toBeGreaterThan(0);
      expect(state.regime).toBe('magnetic-gap-opening');
      expect(state.backscatteringSuppressionPercent).toBeLessThan(99.0);

      quantumSpinHallEngine.toggleMagneticField();
      expect(quantumSpinHallEngine.getState().magneticExchangeFieldTesla).toBe(0.0);
      expect(quantumSpinHallEngine.getState().regime).toBe('ballistic-helical-transport');
    });

    it('注入純自旋流封包應提昇偏振度並記錄遙測', () => {
      quantumSpinHallEngine.injectPureSpinPacket();
      expect(quantumSpinHallEngine.getState().spinPolarizationRatio).toBe(1.0);
      quantumSpinHallEngine.update(0.1);
      expect(quantumSpinHallEngine.getState().telemetryHistory.length).toBeGreaterThan(0);
    });
  });

  describe('3. 巨克爾非線性量子光子斯奎茲頻梳發電機 (quantumKerrSolitonComb)', () => {
    it('應正確初始化並提供孤子脈寬、重頻與多模量子壓縮預設值', () => {
      quantumKerrCombEngine.resetDefaults();
      const state = quantumKerrCombEngine.getState();
      expect(state.solitonPulseWidthFemtosecond).toBeLessThan(100.0);
      expect(state.combLineCount).toBeGreaterThan(200);
      expect(state.repetitionRateGhz).toBeGreaterThan(100);
      expect(state.quantumSqueezingDb).toBeLessThan(-3.0); // 壓縮為負 dB
      expect(state.f2fInterferometricSnrDb).toBeGreaterThan(30.0);
    });

    it('應正確約束參數上下界限', () => {
      quantumKerrCombEngine.setParameters({
        cavityQualityFactorMillion: 120.0, // 超出 80.0
        pumpPowerMilliWatt: 1000.0, // 超出 600.0
        laserDetuningGhz: -20.0, // 低於 -5.0
        microRingRadiusMicrons: 500.0, // 超出 250.0
        dispersionParameterD2Khz: 2.0 // 低於 10.0
      });
      const state = quantumKerrCombEngine.getState();
      expect(state.cavityQualityFactorMillion).toBe(80.0);
      expect(state.pumpPowerMilliWatt).toBe(600.0);
      expect(state.laserDetuningGhz).toBe(-5.0);
      expect(state.microRingRadiusMicrons).toBe(250.0);
      expect(state.dispersionParameterD2Khz).toBe(10.0);
    });

    it('切換至量子壓縮體制應達到深縮小雜訊 (-10 dB 以下)', () => {
      quantumKerrCombEngine.setParameters({
        regime: 'quantum-squeezed-frequency-comb',
        cavityQualityFactorMillion: 50.0
      });
      const state = quantumKerrCombEngine.getState();
      expect(state.regime).toBe('quantum-squeezed-frequency-comb');
      expect(state.quantumSqueezingDb).toBeLessThan(-10.0);
    });

    it('紅失諧調頻步進與模式切換應正確執行', () => {
      quantumKerrCombEngine.resetDefaults();
      const detuningBefore = quantumKerrCombEngine.getState().laserDetuningGhz;
      quantumKerrCombEngine.triggerSolitonStepSweep();
      expect(quantumKerrCombEngine.getState().laserDetuningGhz).toBeGreaterThan(detuningBefore);

      quantumKerrCombEngine.toggleSqueezingMode();
      expect(quantumKerrCombEngine.getState().regime).toBe('quantum-squeezed-frequency-comb');
      quantumKerrCombEngine.update(0.1);
      expect(quantumKerrCombEngine.getState().telemetryHistory.length).toBeGreaterThan(0);
    });
  });

  describe('4. AdS_4/CFT_3 拓撲引力外爾半金屬全息量子臨界流體引擎 (holographicWeylFluid)', () => {
    it('應正確初始化並飽和 KSS 最小黏滯極限 η/s ≈ 0.0796', () => {
      holographicWeylFluidEngine.resetDefaults();
      const state = holographicWeylFluidEngine.getState();
      expect(state.viscosityToEntropyRatioEtaOverS).toBeCloseTo(0.0796, 3);
      expect(state.anomalousHallConductanceE2H).toBeGreaterThan(0.5);
      expect(state.planckianDissipationRateThz).toBeGreaterThan(10.0);
      expect(state.quantumEntropyDensity).toBeGreaterThan(20.0);
      expect(state.chiralVorticalConductivityCv).toBeGreaterThan(0);
    });

    it('應正確約束參數上下界限', () => {
      holographicWeylFluidEngine.setParameters({
        temperatureRatioTOverTc: 10.0, // 超出 5.0
        axialNodeSeparationB: 20.0, // 超出 8.0
        chemicalPotentialMu: -10.0, // 低於 0.0
        chernSimonsCouplingAlpha: 10.0, // 超出 5.0
        adsCurvatureRadiusL: 50.0 // 超出 20.0
      });
      const state = holographicWeylFluidEngine.getState();
      expect(state.temperatureRatioTOverTc).toBe(5.0);
      expect(state.axialNodeSeparationB).toBe(8.0);
      expect(state.chemicalPotentialMu).toBe(0.0);
      expect(state.chernSimonsCouplingAlpha).toBe(5.0);
      expect(state.adsCurvatureRadiusL).toBe(20.0);
    });

    it('切換體制應正確更新並反映各向異性黏滯或霍爾強化', () => {
      holographicWeylFluidEngine.setParameters({
        regime: 'holographic-anomalous-hall'
      });
      expect(holographicWeylFluidEngine.getState().regime).toBe('holographic-anomalous-hall');
      expect(holographicWeylFluidEngine.getState().anomalousHallConductanceE2H).toBeGreaterThan(2.0);

      holographicWeylFluidEngine.toggleKSSPrecision();
      expect(holographicWeylFluidEngine.getState().regime).toBe('kss-minimal-viscosity-fluid');
      expect(holographicWeylFluidEngine.getState().viscosityToEntropyRatioEtaOverS).toBe(0.0796);
    });

    it('激發軸向反常霍爾脈衝應提升電導率並累積遙測', () => {
      holographicWeylFluidEngine.resetDefaults();
      const hallBefore = holographicWeylFluidEngine.getState().anomalousHallConductanceE2H;
      holographicWeylFluidEngine.pulseAxialAnomalyPacket();
      expect(holographicWeylFluidEngine.getState().anomalousHallConductanceE2H).toBeGreaterThan(hallBefore);

      holographicWeylFluidEngine.update(0.1);
      expect(holographicWeylFluidEngine.getState().telemetryHistory.length).toBeGreaterThan(0);
    });
  });
});
