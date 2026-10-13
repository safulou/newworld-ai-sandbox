import { describe, it, expect, beforeEach, vi } from 'vitest';
import { topologicalKondoEngine } from '../topologicalKondoInsulator';
import { magnetarQEDEngine } from '../magnetarQEDVacuumBirefringence';
import { holographicSuperconductorEngine } from '../holographicSuperconductorAdSRN';
import { yangMillsInstantonEngine } from '../yangMillsInstantonVacuum';

describe('Part 38: 拓撲近藤、磁星QED、全息超導與楊-米爾斯瞬子引擎測試', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    topologicalKondoEngine.reset();
    magnetarQEDEngine.reset();
    holographicSuperconductorEngine.reset();
    yangMillsInstantonEngine.reset();
  });

  describe('1. 拓撲近藤絕緣體 (Topological Kondo Insulator, TKI)', () => {
    it('應正確初始化並具備強拓撲不變量 Z_2 = 1 與飽和電阻平台', () => {
      const state = topologicalKondoEngine.getState();
      expect(state.z2TopologicalInvariant).toBe(1);
      expect(state.kondoGapDeltaMev).toBeGreaterThan(10.0);
      expect(state.temperatureKelvin).toBeLessThan(5.0);
      expect(state.saturationPlateauActive).toBe(true);
      expect(state.regime).toBe('topological-surface-dirac-saturation');
    });

    it('溫度升高應消除拓撲表面飽和平台並過渡至高溫重費米液體', () => {
      topologicalKondoEngine.setTemperature(120.0);
      const state = topologicalKondoEngine.getState();
      expect(state.saturationPlateauActive).toBe(false);
      expect(state.regime).toBe('high-temp-heavy-fermi-liquid');
      expect(state.kondoGapDeltaMev).toBeLessThan(5.0); // 高溫熱漲落抹平近藤能隙
    });

    it('增大雜化強度 V_fd 應顯著加寬近藤能隙與提高重費米子有效質量', () => {
      topologicalKondoEngine.setHybridizationStrength(0.30);
      const state = topologicalKondoEngine.getState();
      expect(state.kondoGapDeltaMev).toBeGreaterThan(25.0);
      expect(state.effectiveMassRatioMStar).toBeGreaterThan(150.0);
    });

    it('低溫拓撲淬火 triggerThermalQuench 應啟動淬火相態並更新指標', () => {
      topologicalKondoEngine.triggerThermalQuench();
      const state = topologicalKondoEngine.getState();
      expect(state.temperatureKelvin).toBe(0.5);
      expect(state.regime).toBe('parity-inverted-kondo-quench');
      expect(state.saturationPlateauActive).toBe(true);
    });

    it('週期性輪轉相態與遙測更新應正常工作', () => {
      const initialRegime = topologicalKondoEngine.getState().regime;
      topologicalKondoEngine.cycleRegime();
      expect(topologicalKondoEngine.getState().regime).not.toBe(initialRegime);

      topologicalKondoEngine.update(1.0);
      expect(topologicalKondoEngine.getState().bulkResistivityOhmCm).toBeGreaterThan(0);
    });
  });

  describe('2. 磁星 QED 真空雙折射與星震阿爾芬剪切波 (Magnetar QED & Starquake)', () => {
    it('應正確初始化並展現強 QED 真空雙折射與高偏振度', () => {
      const state = magnetarQEDEngine.getState();
      expect(state.bOverBqedRatio).toBeGreaterThan(1.0);
      expect(state.deltaRefractiveIndex).toBeGreaterThan(0);
      expect(state.linearPolarizationDegreePiL).toBeGreaterThan(0.75);
      expect(state.alfvenWaveSpeedRatioC).toBeGreaterThan(0.99);
      expect(state.regime).toBe('quiescent-vacuum-birefringence');
    });

    it('增加磁場應進一步提升折射率差與光速比', () => {
      magnetarQEDEngine.setMagneticField(1.0e15); // 10^15 Gauss
      const state = magnetarQEDEngine.getState();
      expect(state.bOverBqedRatio).toBeGreaterThan(20.0);
      expect(state.deltaRefractiveIndex).toBeGreaterThan(1.0e-4);
    });

    it('地殼剪切應變超標應進入災變性星震態', () => {
      magnetarQEDEngine.setCrustStress(1.1);
      const state = magnetarQEDEngine.getState();
      expect(state.regime).toBe('catastrophic-starquake-flare');
    });

    it('手動觸發星震 triggerStarquake 應釋放巨型耀斑並激發 QPO', () => {
      const countBefore = magnetarQEDEngine.getState().starquakeTriggerCount;
      magnetarQEDEngine.triggerStarquake();
      const state = magnetarQEDEngine.getState();
      expect(state.starquakeTriggerCount).toBe(countBefore + 1);
      expect(state.flareEnergyErg).toBeGreaterThanOrEqual(1.0e44);
      expect(state.regime).toBe('catastrophic-starquake-flare');
    });

    it('相態循環與 update 應使星震餘震衰減過渡至阿爾芬波諧振', () => {
      magnetarQEDEngine.triggerStarquake();
      magnetarQEDEngine.update(3.0); // 模擬時間流逝讓應變衰退
      const state = magnetarQEDEngine.getState();
      expect(state.regime).toBe('alfven-qpo-resonance');
    });
  });

  describe('3. 全息超導與荷電黑洞 AdS-RN 純量凝聚 (Holographic Superconductor)', () => {
    it('在 T < Tc 下應自發開啟超導序參量與超流密度', () => {
      const state = holographicSuperconductorEngine.getState();
      expect(state.temperatureRatioTOverTc).toBeLessThan(1.0);
      expect(state.orderParameterO2Gev2).toBeGreaterThan(0.5);
      expect(state.superfluidDensityNsGev).toBeGreaterThan(0.5);
      expect(state.opticalGapOmegaGGev).toBeGreaterThan(0.2);
      expect(state.bfBoundExceeded).toBe(true);
      expect(state.regime).toBe('hairy-black-hole-condensate');
    });

    it('升高溫度高於臨界值 T > Tc 應使序參量與超流密度消失', () => {
      holographicSuperconductorEngine.setTemperatureRatio(1.6);
      const state = holographicSuperconductorEngine.getState();
      expect(state.orderParameterO2Gev2).toBe(0.0);
      expect(state.superfluidDensityNsGev).toBe(0.0);
      expect(state.opticalGapOmegaGGev).toBe(0.0);
      expect(state.regime).toBe('normal-metallic-ads-rn');
    });

    it('增加邊界化學勢 mu 應提升臨界溫度 Tc', () => {
      const tcBefore = holographicSuperconductorEngine.getState().criticalTemperatureTcGev;
      holographicSuperconductorEngine.setChemicalPotential(7.5);
      const tcAfter = holographicSuperconductorEngine.getState().criticalTemperatureTcGev;
      expect(tcAfter).toBeGreaterThan(tcBefore);
    });

    it('觸發超導淬火 triggerPhaseTransition 應進入能隙飽和超流相', () => {
      holographicSuperconductorEngine.triggerPhaseTransition();
      const state = holographicSuperconductorEngine.getState();
      expect(state.temperatureRatioTOverTc).toBe(0.15);
      expect(state.regime).toBe('gap-saturating-superfluid');
      expect(state.orderParameterO2Gev2).toBeGreaterThan(1.5);
    });

    it('相態輪轉與重置應符合全息預期', () => {
      holographicSuperconductorEngine.cycleRegime();
      expect(holographicSuperconductorEngine.getState().regime).toBeDefined();
      holographicSuperconductorEngine.reset();
      expect(holographicSuperconductorEngine.getState().temperatureRatioTOverTc).toBe(0.45);
    });
  });

  describe('4. 楊-米爾斯 BPST 瞬子真空與拓撲 \theta 角 (Yang-Mills Instanton Vacuum)', () => {
    it('應正確初始化瞬子作用量與 \theta 依賴的真空能量密度', () => {
      const state = yangMillsInstantonEngine.getState();
      expect(state.instantonActionS).toBeGreaterThan(20.0);
      expect(state.wkbTunnelingRateGamma).toBeGreaterThan(0);
      expect(state.vacuumEnergyDensityMevFm3).toBeLessThan(0); // -\chi_t \cos(\theta)
      expect(state.regime).toBe('theta-vacuum-interference');
    });

    it('改變拓撲角 \theta 應週期性調製真空能量密度', () => {
      yangMillsInstantonEngine.setThetaAngle(0.0);
      const e0 = yangMillsInstantonEngine.getState().vacuumEnergyDensityMevFm3;
      yangMillsInstantonEngine.setThetaAngle(Math.PI);
      const ePi = yangMillsInstantonEngine.getState().vacuumEnergyDensityMevFm3;
      expect(e0).toBeLessThan(0); // -\chi_t \cos(0) = -\chi_t
      expect(ePi).toBeGreaterThan(0); // -\chi_t \cos(\pi) = +\chi_t
    });

    it('啟動軸子機制應將有效角歸零並進入 CP 恢復相', () => {
      yangMillsInstantonEngine.setThetaAngle(1.5);
      yangMillsInstantonEngine.toggleAxionMechanism();
      const state = yangMillsInstantonEngine.getState();
      expect(state.axionMechanismEnabled).toBe(true);
      expect(state.effectiveThetaBarRad).toBeLessThan(0.01);
      expect(state.regime).toBe('axion-cp-restoration');
    });

    it('觸發瞬子量子穿隧應累計次數並更新狀態', () => {
      const countBefore = yangMillsInstantonEngine.getState().tunnelingEventsCount;
      yangMillsInstantonEngine.triggerInstantonTunneling();
      const state = yangMillsInstantonEngine.getState();
      expect(state.tunnelingEventsCount).toBe(countBefore + 1);
    });

    it('耦合常數變化應影響作用量與 WKB 速率', () => {
      yangMillsInstantonEngine.setGaugeCoupling(2.2);
      const state = yangMillsInstantonEngine.getState();
      expect(state.instantonActionS).toBeLessThan(20.0);
      expect(state.wkbTunnelingRateGamma).toBeGreaterThan(1e-3);
    });
  });
});
