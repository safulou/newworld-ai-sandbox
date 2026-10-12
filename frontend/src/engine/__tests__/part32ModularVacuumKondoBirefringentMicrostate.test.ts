import { describe, it, expect, beforeEach, vi } from 'vitest';
import { modularHamiltonianVacuumEngine } from '../modularHamiltonianVacuum';
import { multiChannelKondoEngine } from '../multiChannelKondo';
import { birefringentGravLensEngine } from '../birefringentGravLens';
import { holographicMicrostateEngine } from '../holographicMicrostateMesh';

describe('Part 32: 富田-竹崎模態流、多通道近藤、雙折射引力透鏡與全息微觀態引擎測試套件', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 富田-竹崎模態流與量子糾纏真空引擎 (modularHamiltonianVacuum)', () => {
    it('應正確初始化並提供 Bisognano-Wichmann 林德勒模態流預設值', () => {
      modularHamiltonianVacuumEngine.resetDefaults();
      const state = modularHamiltonianVacuumEngine.getState();
      expect(state.regime).toBe('bisognano-wichmann-rindler');
      expect(state.entangledRegionRadiusLp).toBeGreaterThan(0);
      expect(state.unruhAccelerationScaleE20).toBeGreaterThan(0);
      expect(state.modularHamiltonianExpectation).toBeGreaterThan(0);
      expect(state.unruhTemperatureKelvin).toBeGreaterThan(0);
      expect(state.qeiStabilityBound).toBeGreaterThan(0);
      expect(state.relativeEntropyMonotonic).toBeGreaterThanOrEqual(0);
    });

    it('應正確約束參數上下界限', () => {
      modularHamiltonianVacuumEngine.setParameters({
        entangledRegionRadiusLp: 100.0, // 超出 50.0
        unruhAccelerationScaleE20: 50.0, // 超出 10.0
        modularTimeParameterS: -12.0, // 低於 -5.0
        vacuumNegativeEnergyFlux: 80.0, // 超出 25.0
        uvCutoffScaleGev: 1.0e15 // 低於 1.0e16
      });
      const state = modularHamiltonianVacuumEngine.getState();
      expect(state.entangledRegionRadiusLp).toBe(50.0);
      expect(state.unruhAccelerationScaleE20).toBe(10.0);
      expect(state.modularTimeParameterS).toBe(-5.0);
      expect(state.vacuumNegativeEnergyFlux).toBe(25.0);
      expect(state.uvCutoffScaleGev).toBe(1.0e16);
    });

    it('激發糾纏第一定律飽和態應校準 δS_A = δ<K_A>', () => {
      modularHamiltonianVacuumEngine.resetDefaults();
      modularHamiltonianVacuumEngine.saturateEntanglementFirstLaw();
      const state = modularHamiltonianVacuumEngine.getState();
      expect(state.regime).toBe('entanglement-first-law-saturation');
      expect(state.entanglementEntropyDeviation).toBe(state.modularHamiltonianExpectation);
    });

    it('步進模態流單參量自同構應更新模態時間參數', () => {
      modularHamiltonianVacuumEngine.resetDefaults();
      const beforeS = modularHamiltonianVacuumEngine.getState().modularTimeParameterS;
      modularHamiltonianVacuumEngine.stepModularFlow();
      const afterS = modularHamiltonianVacuumEngine.getState().modularTimeParameterS;
      expect(afterS).not.toBe(beforeS);
    });

    it('定時更新應維護遙測歷史隊列', () => {
      modularHamiltonianVacuumEngine.resetDefaults();
      modularHamiltonianVacuumEngine.update(0.16);
      const state = modularHamiltonianVacuumEngine.getState();
      expect(state.telemetryHistory.length).toBeGreaterThan(0);
    });
  });

  describe('2. 多通道近藤效應與非費米液體奇異金屬反應堆 (multiChannelKondo)', () => {
    it('應正確初始化並展現 2CK 雙通道過度屏蔽之 1/2 ln 2 殘餘分數熵', () => {
      multiChannelKondoEngine.resetDefaults();
      const state = multiChannelKondoEngine.getState();
      expect(state.regime).toBe('two-channel-overscreened-nfl');
      expect(state.channelAnisotropyDelta).toBe(0.0);
      expect(state.residualImpurityEntropy).toBeCloseTo(0.3466, 3);
      expect(state.nonFermiLiquidWeight).toBeGreaterThan(0.9);
      expect(state.magneticSusceptibilityLog).toBeGreaterThan(0);
    });

    it('應正確約束參數上下界限', () => {
      multiChannelKondoEngine.setParameters({
        kondoExchangeJkEv: 10.0, // 超出 3.0
        channelAnisotropyDelta: -5.0, // 低於 -1.0
        impurityLevelEdEv: 8.0, // 超出 1.0
        kondoTemperatureTk: 200.0, // 超出 120.0
        temperatureKelvin: 0.00001 // 低於 0.001
      });
      const state = multiChannelKondoEngine.getState();
      expect(state.kondoExchangeJkEv).toBe(3.0);
      expect(state.channelAnisotropyDelta).toBe(-1.0);
      expect(state.impurityLevelEdEv).toBe(1.0);
      expect(state.kondoTemperatureTk).toBe(120.0);
      expect(state.temperatureKelvin).toBe(0.001);
    });

    it('通道各向異性較大時應偏離非費米液體並流向完全屏蔽單重態', () => {
      multiChannelKondoEngine.setParameters({
        channelAnisotropyDelta: 0.8,
        regime: 'fermi-liquid-singlet-crossover'
      });
      const state = multiChannelKondoEngine.getState();
      expect(state.residualImpurityEntropy).toBeLessThan(0.3466);
      expect(state.nonFermiLiquidWeight).toBeLessThan(0.5);
    });

    it('對齊通道對稱性應復原非費米液體殘餘分數熵', () => {
      multiChannelKondoEngine.setParameters({ channelAnisotropyDelta: 0.6 });
      multiChannelKondoEngine.balanceChannelsSymmetry();
      const state = multiChannelKondoEngine.getState();
      expect(state.channelAnisotropyDelta).toBe(0.0);
      expect(state.residualImpurityEntropy).toBeCloseTo(0.3466, 3);
    });

    it('調諧至馬約拉納零模點應鎖定非阿貝爾殘餘熵態', () => {
      multiChannelKondoEngine.tuneToMajoranaPoint();
      const state = multiChannelKondoEngine.getState();
      expect(state.regime).toBe('non-abelian-majorana-entropy');
      expect(state.temperatureKelvin).toBe(0.005);
      expect(state.channelAnisotropyDelta).toBe(0.0);
    });
  });

  describe('3. 雙折射引力透鏡與偏振旋角幾何相光子干涉儀 (birefringentGravLens)', () => {
    it('應正確初始化並展現孿生愛因斯坦環與微分時延', () => {
      birefringentGravLensEngine.resetDefaults();
      const state = birefringentGravLensEngine.getState();
      expect(state.regime).toBe('gravitational-vacuum-birefringence');
      expect(state.blackHoleMassSolar).toBeGreaterThan(0);
      expect(state.dimensionlessSpinAOverM).toBeGreaterThanOrEqual(0);
      expect(state.einsteinRingRadiusMicroArcsec).toBeGreaterThan(0);
      expect(state.birefringentSplittingMicroArcsec).toBeGreaterThan(0);
      expect(state.differentialDelayPicoSec).toBeGreaterThan(0);
    });

    it('應正確約束參數上下界限', () => {
      birefringentGravLensEngine.setParameters({
        blackHoleMassSolar: 500.0, // 超出 200.0
        dimensionlessSpinAOverM: 1.5, // 超出 0.998
        chiralWeylCouplingAlpha: 20.0, // 超出 10.0
        impactParameterRg: 0.5, // 低於 2.5
        photonFrequencyGhz: 1000.0 // 超出 600.0
      });
      const state = birefringentGravLensEngine.getState();
      expect(state.blackHoleMassSolar).toBe(200.0);
      expect(state.dimensionlessSpinAOverM).toBe(0.998);
      expect(state.chiralWeylCouplingAlpha).toBe(10.0);
      expect(state.impactParameterRg).toBe(2.5);
      expect(state.photonFrequencyGhz).toBe(600.0);
    });

    it('發射偏振探針脈衝應增加偏振分裂與旋轉角', () => {
      birefringentGravLensEngine.resetDefaults();
      const splitBefore = birefringentGravLensEngine.getState().birefringentSplittingMicroArcsec;
      birefringentGravLensEngine.pulsePolarizationProbe();
      const splitAfter = birefringentGravLensEngine.getState().birefringentSplittingMicroArcsec;
      expect(splitAfter).toBeGreaterThan(splitBefore);
    });

    it('切換手性外爾耦合應在宇稱破缺與幾何相之間流轉', () => {
      birefringentGravLensEngine.resetDefaults();
      birefringentGravLensEngine.toggleChiralCoupling();
      expect(birefringentGravLensEngine.getState().regime).toBe('pancharatnam-berry-geodesic');
      birefringentGravLensEngine.toggleChiralCoupling();
      expect(birefringentGravLensEngine.getState().regime).toBe('weyl-curvature-parity-violation');
      expect(birefringentGravLensEngine.getState().chiralWeylCouplingAlpha).toBe(4.8);
    });
  });

  describe('4. AdS/CFT 蟲洞微觀態與哈密頓量截斷弦網張量重構機 (holographicMicrostateMesh)', () => {
    it('應正確初始化並展現絨毛球平滑超重力冠帽與貝肯斯坦微觀態熵', () => {
      holographicMicrostateEngine.resetDefaults();
      const state = holographicMicrostateEngine.getState();
      expect(state.regime).toBe('fuzzball-smooth-microstate');
      expect(state.stringChargeProductQ).toBeGreaterThan(0);
      expect(state.tensorNetworkDepth).toBeGreaterThanOrEqual(3);
      expect(state.microstateEntropyBekenstein).toBeGreaterThan(0);
      expect(state.tensorContractionFidelity).toBeGreaterThan(0.9);
      expect(state.geometricSmoothnessIndex).toBeGreaterThan(0.9);
    });

    it('應正確約束參數上下界限', () => {
      holographicMicrostateEngine.setParameters({
        microstateDimensionLog10: 20.0, // 超出 12.0
        stringChargeProductQ: 2000, // 超出 1200
        tensorNetworkDepth: 20, // 超出 12
        echoReflectivityPercent: 120.0, // 超出 99.0
        fuzzballCapRadiusPlanck: 0.1 // 低於 1.0
      });
      const state = holographicMicrostateEngine.getState();
      expect(state.microstateDimensionLog10).toBe(12.0);
      expect(state.stringChargeProductQ).toBe(1200);
      expect(state.tensorNetworkDepth).toBe(12);
      expect(state.echoReflectivityPercent).toBe(99.0);
      expect(state.fuzzballCapRadiusPlanck).toBe(1.0);
    });

    it('發射回波波包應增加回波延遲並拓展多極矩解析度', () => {
      holographicMicrostateEngine.resetDefaults();
      const delayBefore = holographicMicrostateEngine.getState().echoDelayTimeMilliSec;
      const momentsBefore = holographicMicrostateEngine.getState().multipoleMomentsCount;
      holographicMicrostateEngine.emitEchoWavepacket();
      expect(holographicMicrostateEngine.getState().echoDelayTimeMilliSec).toBeGreaterThan(delayBefore);
      expect(holographicMicrostateEngine.getState().multipoleMomentsCount).toBeGreaterThan(momentsBefore);
    });

    it('切換絨毛球平滑冠帽應在冠帽幾何與張量網絡湧現之間切換', () => {
      holographicMicrostateEngine.resetDefaults();
      expect(holographicMicrostateEngine.getState().regime).toBe('fuzzball-smooth-microstate');
      holographicMicrostateEngine.toggleFuzzballCap();
      expect(holographicMicrostateEngine.getState().regime).toBe('tensor-network-mera-emergence');
      holographicMicrostateEngine.toggleFuzzballCap();
      expect(holographicMicrostateEngine.getState().regime).toBe('fuzzball-smooth-microstate');
    });

    it('定時更新應維護遙測歷史隊列', () => {
      holographicMicrostateEngine.resetDefaults();
      holographicMicrostateEngine.update(0.16);
      const state = holographicMicrostateEngine.getState();
      expect(state.telemetryHistory.length).toBeGreaterThan(0);
    });
  });
});
