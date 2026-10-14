import { describe, it, expect, beforeEach, vi } from 'vitest';
import { schwingerVacuumEngine } from '../schwingerVacuumBreakdown';
import { blackHoleSuperradianceEngine } from '../blackHoleSuperradianceAxion';
import { strangeMetalSYKEngine } from '../strangeMetalSYKChaos';
import { quantumSpinHallEngine } from '../quantumSpinHallFractionalSoliton';

describe('Part 39: 舒溫格真空、黑洞超輻射、奇異金屬SYK與自旋霍爾螺旋孤子測試', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    schwingerVacuumEngine.reset();
    blackHoleSuperradianceEngine.reset();
    strangeMetalSYKEngine.reset();
    quantumSpinHallEngine.reset();
  });

  describe('1. 舒溫格效應與強場 QED 真空衰變雪崩 (Schwinger Vacuum Breakdown)', () => {
    it('應正確初始化並處於強場電離萌生區', () => {
      const state = schwingerVacuumEngine.getState();
      expect(state.fieldRatioEOverEcrit).toBeGreaterThanOrEqual(0.1);
      expect(state.pairProductionRateM4S).toBeGreaterThan(0);
      expect(state.avalancheGrowthRatePerFs).toBeGreaterThan(0);
      expect(state.regime).toBe('quantum-schwinger-pair-onset');
    });

    it('增大電場應顯著增加正負電子對產率與場比', () => {
      schwingerVacuumEngine.setElectricField(1.32e18 * 0.5); // 0.5 E_crit
      const state = schwingerVacuumEngine.getState();
      expect(state.fieldRatioEOverEcrit).toBeCloseTo(0.5, 1);
      expect(state.pairProductionRateM4S).toBeGreaterThan(1e30);
    });

    it('低電場下應進入亞臨界穿隧壓制相', () => {
      schwingerVacuumEngine.setElectricField(3.0e16);
      const state = schwingerVacuumEngine.getState();
      expect(state.regime).toBe('sub-critical-tunneling-suppressed');
      expect(state.fieldRatioEOverEcrit).toBeLessThan(0.08);
    });

    it('手動觸發真空衰變雪崩應切換相態並累計計數', () => {
      const countBefore = schwingerVacuumEngine.getState().totalPairCreationsCount;
      schwingerVacuumEngine.triggerVacuumBreakdown();
      const state = schwingerVacuumEngine.getState();
      expect(state.totalPairCreationsCount).toBe(countBefore + 1);
      expect(state.regime).toBe('qed-cascade-avalanche');
    });

    it('輪轉相態與重置應符合預期', () => {
      schwingerVacuumEngine.cycleRegime();
      expect(schwingerVacuumEngine.getState().regime).toBeDefined();
      schwingerVacuumEngine.reset();
      expect(schwingerVacuumEngine.getState().fieldRatioEOverEcrit).toBe(0.20);
    });
  });

  describe('2. 旋轉黑洞超輻射不穩定性與軸子玻色子星雲 (Black Hole Superradiance & Axion)', () => {
    it('應正確初始化引力原子精細常數與地平線旋轉頻率', () => {
      const state = blackHoleSuperradianceEngine.getState();
      expect(state.gravitationalAlphaG).toBeGreaterThan(0.05);
      expect(state.horizonFrequencyHz).toBeGreaterThan(150.0);
      expect(state.continuousGwFrequencyHz).toBeGreaterThan(0);
      expect(state.regime).toBe('exponential-superradiant-instability');
    });

    it('調高自旋參數應提升地平線旋轉頻率', () => {
      const fBefore = blackHoleSuperradianceEngine.getState().horizonFrequencyHz;
      blackHoleSuperradianceEngine.setSpin(0.98);
      const fAfter = blackHoleSuperradianceEngine.getState().horizonFrequencyHz;
      expect(fAfter).toBeGreaterThan(fBefore);
    });

    it('星雲質量比例增高應進入連續引力波發射相', () => {
      blackHoleSuperradianceEngine.setCloudMassFraction(0.05);
      const state = blackHoleSuperradianceEngine.getState();
      expect(state.regime).toBe('continuous-gravitational-wave-hum');
      expect(state.gwLuminosityErgS).toBeGreaterThan(1e35);
    });

    it('手動觸發 Bosenova 應引發引力塌縮並累計次數', () => {
      const countBefore = blackHoleSuperradianceEngine.getState().bosenovaCollapseCount;
      blackHoleSuperradianceEngine.triggerBosenova();
      const state = blackHoleSuperradianceEngine.getState();
      expect(state.bosenovaCollapseCount).toBe(countBefore + 1);
      expect(state.regime).toBe('bosenova-explosive-collapse');
    });

    it('時間流逝應使 Bosenova 星震餘波衰退', () => {
      blackHoleSuperradianceEngine.triggerBosenova();
      blackHoleSuperradianceEngine.update(2.0);
      expect(blackHoleSuperradianceEngine.getState().cloudMassFraction).toBeLessThan(0.10);
    });
  });

  describe('3. 奇異金屬普朗克極限耗散與 SYK 模型全息量子混亂 (Strange Metal & SYK)', () => {
    it('應展現普朗克極限散射時間與線性電阻率', () => {
      const state = strangeMetalSYKEngine.getState();
      expect(state.planckianScatteringTimeFs).toBeGreaterThan(0);
      expect(state.linearResistivityMicroOhmCm).toBeGreaterThan(10.0);
      expect(state.mssBoundSaturationRatio).toBeGreaterThan(0.9);
      expect(state.regime).toBe('strange-metal-planckian-linear');
    });

    it('升高溫度應縮短普朗克散射時間並按線性增大電阻率', () => {
      const rBefore = strangeMetalSYKEngine.getState().linearResistivityMicroOhmCm;
      const tauBefore = strangeMetalSYKEngine.getState().planckianScatteringTimeFs;
      strangeMetalSYKEngine.setTemperature(100.0);
      const state = strangeMetalSYKEngine.getState();
      expect(state.linearResistivityMicroOhmCm).toBeGreaterThan(rBefore);
      expect(state.planckianScatteringTimeFs).toBeLessThan(tauBefore);
    });

    it('增大馬約拉納費米子數 N 應對數延長信息爬亂時間', () => {
      const tBefore = strangeMetalSYKEngine.getState().scramblingTimeFs;
      strangeMetalSYKEngine.setMajoranaN(512);
      const tAfter = strangeMetalSYKEngine.getState().scramblingTimeFs;
      expect(tAfter).toBeGreaterThan(tBefore);
    });

    it('手動觸發快速量子爬亂應進入飽和混亂相態', () => {
      strangeMetalSYKEngine.triggerFastScrambling();
      const state = strangeMetalSYKEngine.getState();
      expect(state.regime).toBe('syk-fast-scrambling-chaos');
      expect(state.mssBoundSaturationRatio).toBeGreaterThan(0.95);
    });

    it('相態循環與重置功能應正常', () => {
      strangeMetalSYKEngine.cycleRegime();
      expect(strangeMetalSYKEngine.getState().regime).toBeDefined();
      strangeMetalSYKEngine.reset();
      expect(strangeMetalSYKEngine.getState().temperatureKelvin).toBe(45.0);
    });
  });

  describe('4. 拓撲量子自旋霍爾螺旋邊緣態與分數量子電荷孤子 (Quantum Spin Hall)', () => {
    it('在厚度 d > d_c 下應處於能帶反轉相並具備量子化電導 2 e^2/h', () => {
      const state = quantumSpinHallEngine.getState();
      expect(state.bandInversionMassMev).toBeLessThan(0); // M < 0 拓撲反轉
      expect(state.quantizedConductanceMicroSiemens).toBeCloseTo(77.48, 1);
      expect(state.backscatteringSuppressionPercent).toBeGreaterThan(95.0);
      expect(state.regime).toBe('topological-qsh-helical-edge');
    });

    it('量子阱厚度小於臨界值 d < d_c 應進入正常平庸絕緣體', () => {
      quantumSpinHallEngine.setWellThickness(5.0);
      const state = quantumSpinHallEngine.getState();
      expect(state.bandInversionMassMev).toBeGreaterThan(0); // M > 0 平庸
      expect(state.regime).toBe('normal-band-insulator');
      expect(state.quantizedConductanceMicroSiemens).toBeLessThan(5.0);
    });

    it('外加磁性交換場應破壞時間反演對稱性並抑制電導', () => {
      quantumSpinHallEngine.setExchangeField(1.0);
      const state = quantumSpinHallEngine.getState();
      expect(state.quantizedConductanceMicroSiemens).toBeLessThan(70.0);
      expect(state.regime).toBe('magnetic-domain-wall-gap');
    });

    it('手動觸發孤子創生應束縛 Jackiw-Rebbi 分數電荷 e/2', () => {
      const countBefore = quantumSpinHallEngine.getState().solitonCreationsCount;
      quantumSpinHallEngine.triggerSolitonCreation();
      const state = quantumSpinHallEngine.getState();
      expect(state.solitonCreationsCount).toBe(countBefore + 1);
      expect(state.solitonFractionalChargeE).toBe(0.5);
      expect(state.regime).toBe('fractional-soliton-confinement');
    });

    it('相態輪轉與重置應完全復原為拓撲螺旋邊緣態', () => {
      quantumSpinHallEngine.cycleRegime();
      expect(quantumSpinHallEngine.getState().regime).toBeDefined();
      quantumSpinHallEngine.reset();
      expect(quantumSpinHallEngine.getState().quantumWellThicknessNm).toBe(7.2);
      expect(quantumSpinHallEngine.getState().regime).toBe('topological-qsh-helical-edge');
    });
  });
});
