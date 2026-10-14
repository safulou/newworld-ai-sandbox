import { describe, it, expect, beforeEach } from 'vitest';
import { disorderAndersonEngine } from '../disorderAndersonTopologicalSuperfluid';
import { rotatingBecEngine } from '../rotatingBecAbrikosovLattice';
import { surfaceCodeEngine } from '../surfaceCodeQuantumMemory';
import { holographicNegativityEngine } from '../holographicEntanglementNegativity';

describe('Part 42 Cutting-Edge Quantum & Theoretical Physics Suite', () => {
  beforeEach(() => {
    disorderAndersonEngine.reset();
    rotatingBecEngine.reset();
    surfaceCodeEngine.reset();
    holographicNegativityEngine.reset();
  });

  // ==========================================
  // 1. 拓撲超流體安德森局域化引擎測試 (1 - 5)
  // ==========================================
  describe('Disorder-Induced Anderson Localization in Topological Superfluids', () => {
    it('1. 應初始化為純淨拓撲馬約拉納擴展相並維持低 IPR', () => {
      const state = disorderAndersonEngine.getState();
      expect(state.regime).toBe('clean-topological-majorana-extended');
      expect(state.inverseParticipationRatioIPR).toBeLessThan(0.3);
      expect(state.criticalDisorderThresholdWc).toBeGreaterThan(3.0);
      expect(state.spatialWavefunctionProfile).toHaveLength(32);
      // 兩端尖峰
      expect(state.spatialWavefunctionProfile[0]).toBeGreaterThan(0.5);
      expect(state.spatialWavefunctionProfile[31]).toBeGreaterThan(0.5);
    });

    it('2. 強化無序勢能 W 應觸發安德森局域化轉變並急劇縮短局域化長度', () => {
      disorderAndersonEngine.setDisorderStrength(8.5);
      const state = disorderAndersonEngine.getState();
      expect(state.regime).toBe('anderson-localized-trivial-insulator');
      expect(state.inverseParticipationRatioIPR).toBeGreaterThan(0.5);
      expect(state.localizationLengthNm).toBeLessThan(10.0);
    });

    it('3. 調諧至臨界無序閾值應進入臨界多重分形遷移率邊緣相', () => {
      const wc = disorderAndersonEngine.getState().criticalDisorderThresholdWc;
      disorderAndersonEngine.setDisorderStrength(wc);
      const state = disorderAndersonEngine.getState();
      expect(state.regime).toBe('critical-multifractal-mobility-edge');
      expect(state.quenchedEntropyJoulePerK).toBeGreaterThan(0.3);
    });

    it('4. 觸發量子淬火重採樣應累加計數並重組空間波函數', () => {
      const initialCount = disorderAndersonEngine.getState().accumulatedQuenchesCount;
      disorderAndersonEngine.triggerQuantumQuench();
      const state = disorderAndersonEngine.getState();
      expect(state.accumulatedQuenchesCount).toBe(initialCount + 1);
      expect(state.spatialWavefunctionProfile).toHaveLength(32);
    });

    it('5. 輪轉相態與重置功能驗證', () => {
      disorderAndersonEngine.cycleRegime();
      expect(disorderAndersonEngine.getState().regime).toBe('critical-multifractal-mobility-edge');
      disorderAndersonEngine.reset();
      expect(disorderAndersonEngine.getState().regime).toBe('clean-topological-majorana-extended');
    });
  });

  // ==========================================
  // 2. 旋轉 BEC 阿布里科索夫渦旋晶格引擎測試 (6 - 10)
  // ==========================================
  describe('Rotating BEC Abrikosov Vortex Lattice Engine', () => {
    it('6. 應預設為阿布里科索夫六角三角渦旋晶格相並具備正確物理常數', () => {
      const state = rotatingBecEngine.getState();
      expect(state.regime).toBe('triangular-abrikosov-lattice-crystalline');
      expect(state.vortexCount).toBeGreaterThan(10);
      expect(state.feynmanVortexDensityPerMm2).toBeGreaterThan(50.0);
      expect(state.tkachenkoWaveSpeedMmS).toBeGreaterThan(0.1);
      expect(state.vortexPositions.length).toBeGreaterThan(10);
    });

    it('7. 低於第一臨界頻率 Ω < Ω_c1 應進入亞臨界無旋超流體相且渦旋為零', () => {
      rotatingBecEngine.setRotationFrequency(5.0);
      const state = rotatingBecEngine.getState();
      expect(state.regime).toBe('subcritical-irrotational-superfluid');
      expect(state.vortexCount).toBe(0);
      expect(state.feynmanVortexDensityPerMm2).toBe(0);
    });

    it('8. 極限旋轉接近橫向陷阱頻率 Ω ≈ ω_perp 應進入最低朗道能級近晶相', () => {
      rotatingBecEngine.setTrapFrequency(180.0);
      rotatingBecEngine.setRotationFrequency(176.0); // ratio > 0.95
      const state = rotatingBecEngine.getState();
      expect(state.regime).toBe('lowest-landau-level-quantum-hall-smectic');
      expect(state.tkachenkoWaveSpeedMmS).toBeGreaterThan(0.15);
    });

    it('9. 觸發晶格結晶應精確重組六角晶位與 Tkachenko 彈性波速', () => {
      rotatingBecEngine.triggerLatticeCrystallization();
      const state = rotatingBecEngine.getState();
      expect(state.regime).toBe('triangular-abrikosov-lattice-crystalline');
      expect(state.vortexPositions[0]).toEqual({ x: 0, y: 0, phase: 0 });
      expect(state.abrikosovLatticeConstantMicron).toBeGreaterThan(1.0);
    });

    it('10. 累計旋轉圈數與引擎更新推進驗證', () => {
      const initialRevs = rotatingBecEngine.getState().accumulatedRotationRevolutions;
      rotatingBecEngine.update(1.0); // 1 秒推進
      expect(rotatingBecEngine.getState().accumulatedRotationRevolutions).toBeGreaterThan(initialRevs);
    });
  });

  // ==========================================
  // 3. 表面碼拓撲量子記憶體引擎測試 (11 - 15)
  // ==========================================
  describe('Surface Code Topological Quantum Memory Engine', () => {
    it('11. 應初始化為寧靜容錯基態代碼空間且保真度極高', () => {
      const state = surfaceCodeEngine.getState();
      expect(state.regime).toBe('quiescent-fault-tolerant-code-space');
      expect(state.codeDistanceD).toBe(5);
      expect(state.totalDataQubitsCount).toBe(41);
      expect(state.faultToleranceThresholdPth).toBe(0.0105);
      expect(state.logicalFidelityPercent).toBeGreaterThan(99.9);
    });

    it('12. 物理錯誤率突破容錯閾值 p > p_th 應觸發邏輯錯誤滲流臨界相', () => {
      surfaceCodeEngine.setPhysicalErrorRate(0.025); // 2.5% > 1.05%
      const state = surfaceCodeEngine.getState();
      expect(state.regime).toBe('logical-error-percolation-threshold');
      expect(state.logicalErrorRatePerCycle).toBeGreaterThan(0.05);
      expect(state.logicalFidelityPercent).toBeLessThan(99.0);
    });

    it('13. 碼距增長應使低於閾值的邏輯錯誤率呈現指數級衰減', () => {
      surfaceCodeEngine.setPhysicalErrorRate(0.003); // 0.3%
      surfaceCodeEngine.setCodeDistance(3);
      const errD3 = surfaceCodeEngine.getState().logicalErrorRatePerCycle;

      surfaceCodeEngine.setCodeDistance(7);
      const errD7 = surfaceCodeEngine.getState().logicalErrorRatePerCycle;

      expect(errD7).toBeLessThan(errD3);
    });

    it('14. 觸發 MWPM 糾錯應消除任意子缺陷並修復至容錯區間', () => {
      surfaceCodeEngine.setPhysicalErrorRate(0.02);
      surfaceCodeEngine.triggerMwpmCorrection();
      const state = surfaceCodeEngine.getState();
      expect(state.regime).toBe('mwpm-topological-string-correction');
      expect(state.physicalErrorRateP).toBe(0.0025);
    });

    it('15. 碼距約束保證必須為奇數整數', () => {
      surfaceCodeEngine.setCodeDistance(6);
      expect(surfaceCodeEngine.getState().codeDistanceD).toBe(7);
      surfaceCodeEngine.setCodeDistance(4);
      expect(surfaceCodeEngine.getState().codeDistanceD).toBe(5);
    });
  });

  // ==========================================
  // 4. 全息共形反常與糾纏負度引擎測試 (16 - 20)
  // ==========================================
  describe('Holographic Conformal Anomaly & Entanglement Negativity Engine', () => {
    it('16. 應預設為連通糾纏楔相且對數負度顯著非零', () => {
      const state = holographicNegativityEngine.getState();
      expect(state.regime).toBe('connected-entanglement-wedge-non-zero-negativity');
      expect(state.logarithmicNegativityE).toBeGreaterThan(2.0);
      expect(state.entanglementWedgeCrossSectionEW).toBeGreaterThan(0.2);
      expect(state.criticalSeparationDc).toBe(40.0);
    });

    it('17. 間距 d 超過臨界相變距離 d_c 應觸發一級斷開相變且負度嚴格為零', () => {
      holographicNegativityEngine.setIntervalSeparationD(60.0); // 60 > dc = 40
      const state = holographicNegativityEngine.getState();
      expect(state.regime).toBe('disjoint-disconnected-wedge-vanishing-negativity');
      expect(state.logarithmicNegativityE).toBe(0.0);
      expect(state.entanglementWedgeCrossSectionEW).toBe(0.0);
    });

    it('18. 處於臨界分離間距 d ≈ d_c 時應進入臨界共形橫截面拓撲相變相', () => {
      holographicNegativityEngine.setIntervalSeparationD(40.5); // dc = 40
      const state = holographicNegativityEngine.getState();
      expect(state.regime).toBe('critical-conformal-cross-section-transition');
    });

    it('19. 觸發最大糾纏楔重整應顯著放大 EWCS 與對數負度', () => {
      holographicNegativityEngine.triggerMaxEntanglementWedge();
      const state = holographicNegativityEngine.getState();
      expect(state.regime).toBe('connected-entanglement-wedge-non-zero-negativity');
      expect(state.intervalSeparationD).toBe(5.0);
      expect(state.logarithmicNegativityE).toBeGreaterThan(4.0);
    });

    it('20. 高溫全息等離子體環境應誘發熱幾何抑制相態', () => {
      holographicNegativityEngine.setTemperature(3.5);
      const state = holographicNegativityEngine.getState();
      expect(state.regime).toBe('large-central-charge-thermal-holo-plasma');
    });
  });
});
