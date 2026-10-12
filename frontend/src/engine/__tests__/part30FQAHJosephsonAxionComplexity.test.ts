import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fractionalAnomalousHallEngine } from '../fractionalAnomalousHall';
import { terahertzJosephsonMixerEngine } from '../terahertzJosephsonMixer';
import { axionInsulatorResonatorEngine } from '../axionInsulatorResonator';
import { holographicComplexityActionEngine } from '../holographicComplexityAction';

describe('Part 30: 量子反常分數霍爾、太赫茲約瑟夫森混頻、動態軸子絕緣體與全息複雜度引擎測試套件', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 量子反常分數霍爾效應與莫爾平帶分數量子化反應堆 (fractionalAnomalousHall)', () => {
    it('應正確初始化並提供零磁場分數量子反常霍爾預設值', () => {
      fractionalAnomalousHallEngine.resetDefaults();
      const state = fractionalAnomalousHallEngine.getState();
      expect(state.moiréTwistAngleDeg).toBeGreaterThan(1.0);
      expect(state.fractionalConductanceE2H).toBeCloseTo(0.667, 2); // 2/3
      expect(state.quasiParticleChargeFraction).toBeCloseTo(0.333, 2); // e/3
      expect(state.topologicalGapMev).toBeGreaterThan(0);
      expect(state.berryCurvatureUniformity).toBeGreaterThan(0.5);
      expect(state.quantumMetricDeterminant).toBeGreaterThan(0);
      expect(state.chiralEdgeCurrentNanoAmp).toBeGreaterThan(0);
    });

    it('應正確調諧莫爾扭角、位移場與庫侖相互作用比並進行邊界約束', () => {
      fractionalAnomalousHallEngine.setParameters({
        moiréTwistAngleDeg: 5.5, // 超出 4.5 上限
        displacementFieldMvNm: -5.0, // 低於 0 下限
        interactionStrengthUOverW: 20.0, // 超出 15.0 上限
        temperatureKelvin: 0.001 // 低於 0.01 下限
      });
      const state = fractionalAnomalousHallEngine.getState();
      expect(state.moiréTwistAngleDeg).toBe(4.5);
      expect(state.displacementFieldMvNm).toBe(0.0);
      expect(state.interactionStrengthUOverW).toBe(15.0);
      expect(state.temperatureKelvin).toBe(0.01);
    });

    it('切換不同相態時應正確更新 regime 並重算量子指標', () => {
      fractionalAnomalousHallEngine.setParameters({ regime: 'composite-fermi-liquid' });
      expect(fractionalAnomalousHallEngine.getState().regime).toBe('composite-fermi-liquid');
      expect(fractionalAnomalousHallEngine.getState().incompressibleFluidDensity).toBeLessThan(0.3);

      fractionalAnomalousHallEngine.setParameters({ regime: 'wigner-crystal-charge-order' });
      expect(fractionalAnomalousHallEngine.getState().regime).toBe('wigner-crystal-charge-order');
      expect(fractionalAnomalousHallEngine.getState().fractionalConductanceE2H).toBe(0.0);

      fractionalAnomalousHallEngine.setParameters({ regime: 'non-abelian-moore-read' });
      expect(fractionalAnomalousHallEngine.getState().regime).toBe('non-abelian-moore-read');

      fractionalAnomalousHallEngine.setParameters({ regime: 'fractional-anyon-laughlin' });
      expect(fractionalAnomalousHallEngine.getState().regime).toBe('fractional-anyon-laughlin');
    });

    it('激發 Laughlin 任意子與切換分數階躍應更新邊界電流與填充數', () => {
      const currentBefore = fractionalAnomalousHallEngine.getState().chiralEdgeCurrentNanoAmp;
      fractionalAnomalousHallEngine.injectLaughlinQuasiParticle();
      expect(fractionalAnomalousHallEngine.getState().chiralEdgeCurrentNanoAmp).toBeGreaterThan(currentBefore);

      const nuBefore = fractionalAnomalousHallEngine.getState().fillingFactorNu;
      fractionalAnomalousHallEngine.cycleFillingFraction();
      expect(fractionalAnomalousHallEngine.getState().fillingFactorNu).not.toBe(nuBefore);

      fractionalAnomalousHallEngine.update(0.2);
      expect(Array.isArray(fractionalAnomalousHallEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('2. 太赫茲超導約瑟夫森量子相干混頻器與微波雙模壓縮光子探針 (terahertzJosephsonMixer)', () => {
    it('應正確初始化並計算交流約瑟夫森頻率與夏皮羅階梯電壓', () => {
      terahertzJosephsonMixerEngine.resetDefaults();
      const state = terahertzJosephsonMixerEngine.getState();
      expect(state.biasVoltageMilliVolt).toBeGreaterThan(0);
      expect(state.josephsonFrequencyThz).toBeGreaterThan(0.5);
      expect(state.shapiroStepVoltageMv).toBeGreaterThan(0);
      expect(state.squeezingFactorDb).toBeLessThan(0); // 負 dB 代表低於 SQL
      expect(state.quantumEfficiencyPct).toBeGreaterThan(80);
      expect(state.convertedMixerGainDb).toBeGreaterThan(15);
    });

    it('應對偏壓、幫浦頻率與階躍階數施行保護約束', () => {
      terahertzJosephsonMixerEngine.setParameters({
        biasVoltageMilliVolt: 12.0, // 超出 8.0 上限
        rfPumpFrequencyThz: 0.1,   // 低於 0.2 下限
        junctionCriticalCurrentMicroAmp: 600.0, // 超出 500 上限
        shapiroStepOrderN: 8       // 超出 5 上限
      });
      const state = terahertzJosephsonMixerEngine.getState();
      expect(state.biasVoltageMilliVolt).toBe(8.0);
      expect(state.rfPumpFrequencyThz).toBe(0.2);
      expect(state.junctionCriticalCurrentMicroAmp).toBe(500.0);
      expect(state.shapiroStepOrderN).toBe(5);
    });

    it('切換不同混頻相態時應正確更新 regime', () => {
      terahertzJosephsonMixerEngine.setParameters({ regime: 'shapiro-phase-lock' });
      expect(terahertzJosephsonMixerEngine.getState().regime).toBe('shapiro-phase-lock');

      terahertzJosephsonMixerEngine.setParameters({ regime: 'parametric-four-wave-mix' });
      expect(terahertzJosephsonMixerEngine.getState().regime).toBe('parametric-four-wave-mix');

      terahertzJosephsonMixerEngine.setParameters({ regime: 'quantum-noise-limited-detector' });
      expect(terahertzJosephsonMixerEngine.getState().regime).toBe('quantum-noise-limited-detector');

      terahertzJosephsonMixerEngine.setParameters({ regime: 'squeezed-vacuum-tmsv' });
      expect(terahertzJosephsonMixerEngine.getState().regime).toBe('squeezed-vacuum-tmsv');
    });

    it('注入參量放大幫浦與遞增夏皮羅台階應調整增益與電壓階躍', () => {
      const gainBefore = terahertzJosephsonMixerEngine.getState().convertedMixerGainDb;
      terahertzJosephsonMixerEngine.pulseParametricPump();
      expect(terahertzJosephsonMixerEngine.getState().convertedMixerGainDb).toBeGreaterThan(gainBefore);

      const nBefore = terahertzJosephsonMixerEngine.getState().shapiroStepOrderN;
      terahertzJosephsonMixerEngine.stepShapiroHarmonic();
      expect(terahertzJosephsonMixerEngine.getState().shapiroStepOrderN).not.toBe(nBefore);

      terahertzJosephsonMixerEngine.update(0.1);
      expect(Array.isArray(terahertzJosephsonMixerEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('3. 動態拓撲磁電效應軸子絕緣體諧振腔 (axionInsulatorResonator)', () => {
    it('應正確初始化並在偶數層反鐵磁拓撲絕緣體下鎖定量子化軸子角 θ ≈ π', () => {
      axionInsulatorResonatorEngine.resetDefaults();
      const state = axionInsulatorResonatorEngine.getState();
      expect(state.sampleLayerCount % 2).toBe(0);
      expect(state.quantizedThetaRad).toBeCloseTo(Math.PI, 2);
      expect(state.magnetoelectricResponseAlpha).toBeGreaterThan(0.9);
      expect(state.faradayRotationAngleDeg).toBeCloseTo(0.418, 2);
      expect(state.kerrRotationAngleDeg).toBeGreaterThan(80.0);
      expect(state.axionPolaritonRabiSplitGhz).toBeGreaterThan(2.0);
    });

    it('應約束反鐵磁層數為偶數並在交換能調控下演化能隙', () => {
      axionInsulatorResonatorEngine.setParameters({
        sampleLayerCount: 7, // 奇數應四捨五入至偶數 8
        magneticExchangeEnergyMev: 50.0, // 超出 40.0 上限
        cavityResonanceGhz: 150.0 // 超出 120.0 上限
      });
      const state = axionInsulatorResonatorEngine.getState();
      expect(state.sampleLayerCount).toBe(8);
      expect(state.magneticExchangeEnergyMev).toBe(40.0);
      expect(state.cavityResonanceGhz).toBe(120.0);
    });

    it('切換相態時應正確更新 regime', () => {
      axionInsulatorResonatorEngine.setParameters({ regime: 'axion-polariton-hybrid' });
      expect(axionInsulatorResonatorEngine.getState().regime).toBe('axion-polariton-hybrid');

      axionInsulatorResonatorEngine.setParameters({ regime: 'surface-half-hall-chiral' });
      expect(axionInsulatorResonatorEngine.getState().regime).toBe('surface-half-hall-chiral');

      axionInsulatorResonatorEngine.setParameters({ regime: 'canted-antiferro-crossover' });
      expect(axionInsulatorResonatorEngine.getState().regime).toBe('canted-antiferro-crossover');
    });

    it('激發動態軸子極化波與切換層數應調控拉比劈裂與能隙', () => {
      const rabiBefore = axionInsulatorResonatorEngine.getState().axionPolaritonRabiSplitGhz;
      axionInsulatorResonatorEngine.pumpDynamicalAxionWave();
      expect(axionInsulatorResonatorEngine.getState().axionPolaritonRabiSplitGhz).toBeGreaterThan(rabiBefore);

      const layersBefore = axionInsulatorResonatorEngine.getState().sampleLayerCount;
      axionInsulatorResonatorEngine.toggleLayerParity();
      expect(axionInsulatorResonatorEngine.getState().sampleLayerCount).not.toBe(layersBefore);

      axionInsulatorResonatorEngine.update(0.1);
      expect(Array.isArray(axionInsulatorResonatorEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('4. AdS/CFT 全息複雜度等於作用量引擎 (holographicComplexityAction)', () => {
    it('應正確初始化並飽和勞埃德極限計算速率', () => {
      holographicComplexityActionEngine.resetDefaults();
      const state = holographicComplexityActionEngine.getState();
      expect(state.blackHoleMassSolar).toBeGreaterThan(0);
      expect(state.adsCurvatureRadius).toBeGreaterThan(0);
      expect(state.complexityValueGigaGates).toBeGreaterThan(0);
      expect(state.actionGrowthRateGatesSec).toBeGreaterThan(0);
      expect(state.lloydBoundSaturationRatio).toBeGreaterThan(0.95); // 飽和度 ~ 1.00
      expect(state.wdwPatchVolumeAdS4).toBeGreaterThan(0);
    });

    it('應支援黑洞質量、曲率半徑與微觀 Qubit 數調控與保護', () => {
      holographicComplexityActionEngine.setParameters({
        blackHoleMassSolar: 120.0, // 超出 100 上限
        adsCurvatureRadius: 0.5,   // 低於 1.0 下限
        boundaryQubitCount: 8000   // 超出 5000 上限
      });
      const state = holographicComplexityActionEngine.getState();
      expect(state.blackHoleMassSolar).toBe(100.0);
      expect(state.adsCurvatureRadius).toBe(1.0);
      expect(state.boundaryQubitCount).toBe(5000);
    });

    it('切換不同全息相態時應正確更新 regime', () => {
      holographicComplexityActionEngine.setParameters({ regime: 'volume-maximal-slice' });
      expect(holographicComplexityActionEngine.getState().regime).toBe('volume-maximal-slice');

      holographicComplexityActionEngine.setParameters({ regime: 'late-time-saturation' });
      expect(holographicComplexityActionEngine.getState().regime).toBe('late-time-saturation');
      expect(holographicComplexityActionEngine.getState().lloydBoundSaturationRatio).toBeCloseTo(0.999, 3);

      holographicComplexityActionEngine.setParameters({ regime: 'scrambling-switchback-shock' });
      expect(holographicComplexityActionEngine.getState().regime).toBe('scrambling-switchback-shock');
    });

    it('注入減震波微擾與步進時間應產生折返延遲與複雜度增長', () => {
      const delayBefore = holographicComplexityActionEngine.getState().shockwaveDelayGyr;
      holographicComplexityActionEngine.injectShockwavePerturbation();
      expect(holographicComplexityActionEngine.getState().shockwaveDelayGyr).toBeGreaterThan(delayBefore);

      const timeBefore = holographicComplexityActionEngine.getState().evolutionTimeGyr;
      holographicComplexityActionEngine.stepEvolutionTime(5.0);
      expect(holographicComplexityActionEngine.getState().evolutionTimeGyr).toBeGreaterThan(timeBefore);

      holographicComplexityActionEngine.update(0.1);
      expect(Array.isArray(holographicComplexityActionEngine.getState().telemetryHistory)).toBe(true);
    });
  });
});
