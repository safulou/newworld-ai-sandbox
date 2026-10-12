import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chiralPumpEngine } from '../chiralAnomalyQuantumPump';
import { gwSpinMemoryEngine } from '../gravitationalSpinMemory';
import { hingeMajoranaEngine } from '../hingeMajoranaSuperconductor';
import { quantumIslandEngine } from '../quantumIslandReactor';

describe('Part 28: 拓撲手性反常、自旋記憶、鉸鏈超導與量子島反應堆測試套件', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 拓撲手性反常弗蘭肯斯坦量子泵浦反應堆 (chiralAnomalyQuantumPump)', () => {
    it('應正確初始化並提供合理的物理預設值', () => {
      const state = chiralPumpEngine.getState();
      expect(state.electricFieldKvCm).toBeGreaterThanOrEqual(0.1);
      expect(state.magneticFieldTesla).toBeGreaterThanOrEqual(0.5);
      expect(state.alignmentAngleDeg).toBeGreaterThanOrEqual(0);
      expect(state.axialChemicalPotentialMev).toBeGreaterThan(0);
      expect(state.chiralMagneticCurrent).toBeGreaterThan(0);
      expect(state.magnetoConductanceGainPct).toBeGreaterThan(0);
    });

    it('應允許調諧物理參數並自動約束數值上下限', () => {
      chiralPumpEngine.setParameters({
        electricFieldKvCm: 15.0, // 超出 10.0 上限
        magneticFieldTesla: 0.1,  // 低於 0.5 下限
        alignmentAngleDeg: 120,   // 超出 90 度
        interValleyRelaxationPs: 60.0 // 超出 50.0 ps
      });
      const state = chiralPumpEngine.getState();
      expect(state.electricFieldKvCm).toBe(10.0);
      expect(state.magneticFieldTesla).toBe(0.5);
      expect(state.alignmentAngleDeg).toBe(90.0);
      expect(state.interValleyRelaxationPs).toBe(50.0);
    });

    it('切換相態時應正確更新 regime 並觸發物理重算', () => {
      chiralPumpEngine.setParameters({ regime: 'chiral-magnetic-wave' });
      expect(chiralPumpEngine.getState().regime).toBe('chiral-magnetic-wave');
      expect(chiralPumpEngine.getState().chiralWaveVelocityKmS).toBeGreaterThan(0);

      chiralPumpEngine.setParameters({ regime: 'fermi-arc-transport' });
      expect(chiralPumpEngine.getState().regime).toBe('fermi-arc-transport');
    });

    it('觸發軸向反常脈衝與手性反轉應動態調整化學勢與電流方向', () => {
      const initialMu5 = chiralPumpEngine.getState().axialChemicalPotentialMev;
      chiralPumpEngine.pumpAxialPulse();
      expect(chiralPumpEngine.getState().axialChemicalPotentialMev).toBeGreaterThan(initialMu5);

      const currentBefore = chiralPumpEngine.getState().chiralMagneticCurrent;
      chiralPumpEngine.toggleChiralInversion();
      const currentAfter = chiralPumpEngine.getState().chiralMagneticCurrent;
      expect(currentAfter).toBeCloseTo(-currentBefore, 1);
    });

    it('update 迴圈應平滑衰減瞬態化學勢並記錄遙測歷史', () => {
      chiralPumpEngine.pumpAxialPulse();
      const boostedMu = chiralPumpEngine.getState().axialChemicalPotentialMev;
      chiralPumpEngine.update(1.0);
      expect(chiralPumpEngine.getState().axialChemicalPotentialMev).toBeLessThanOrEqual(boostedMu);
    });
  });

  describe('2. 引力波自旋記憶與天球角動量流干涉網 (gravitationalSpinMemory)', () => {
    it('應正確初始化並載入天球自旋記憶參數', () => {
      const state = gwSpinMemoryEngine.getState();
      expect(state.kerrSpinParameterChi).toBeGreaterThan(0);
      expect(state.totalMassSolar).toBeGreaterThan(0);
      expect(state.sourceDistanceMpc).toBeGreaterThan(0);
      expect(state.spinMemoryVelocityNmS).toBeGreaterThan(0);
      expect(state.rotationalTimeDelayAs).toBeGreaterThan(0);
      expect(state.celestialVorticityCurl).toBeGreaterThan(0);
    });

    it('參數邊界保護應正確運作', () => {
      gwSpinMemoryEngine.setParameters({
        kerrSpinParameterChi: 1.5,  // 超出 0.99 上限
        totalMassSolar: 10.0,       // 低於 20 上限
        sourceDistanceMpc: 2000.0,  // 超出 1000 上限
        misalignmentAngleDeg: -10   // 低於 0 下限
      });
      const state = gwSpinMemoryEngine.getState();
      expect(state.kerrSpinParameterChi).toBe(0.99);
      expect(state.totalMassSolar).toBe(20.0);
      expect(state.sourceDistanceMpc).toBe(1000.0);
      expect(state.misalignmentAngleDeg).toBe(0.0);
    });

    it('觸發雙黑洞自旋併合暴應提高爆發相位與自旋速度躍遷', () => {
      gwSpinMemoryEngine.triggerMergerSpinBurst();
      const state = gwSpinMemoryEngine.getState();
      expect(state.burstPhase).toBe(1.0);
      expect(state.spinMemoryVelocityNmS).toBeGreaterThan(0);
      expect(state.rotationalTimeDelayAs).toBeGreaterThan(0);
    });

    it('update 迴圈應衰減爆發相位', () => {
      gwSpinMemoryEngine.triggerMergerSpinBurst();
      gwSpinMemoryEngine.update(2.0);
      expect(gwSpinMemoryEngine.getState().burstPhase).toBeLessThan(1.0);
    });
  });

  describe('3. 三維二階拓撲超導馬約拉納手性鉸鏈態晶片 (hingeMajoranaSuperconductor)', () => {
    it('應正確初始化並展現相反的表面狄拉克質量項', () => {
      const state = hingeMajoranaEngine.getState();
      expect(state.bulkPairingGapDeltaMev).toBeGreaterThan(0);
      expect(state.zeemanExchangeFieldTesla).toBeGreaterThan(0);
      // X 表面與 Y 表面質量必須具備相反符號以形成鉸鏈域壁
      expect(Math.sign(state.surfaceMassGapXmev)).not.toBe(Math.sign(state.surfaceMassGapYmev));
      expect(state.majoranaVelocityKmS).toBeGreaterThan(0);
      // 熱霍爾電導比率應接近半整數量子化基準 0.50
      expect(state.thermalHallConductanceRatio).toBeCloseTo(0.50, 1);
    });

    it('參數調諧與各相態之拓撲示性數應正確響應', () => {
      hingeMajoranaEngine.setParameters({ regime: 'corner-zero-mode' });
      expect(hingeMajoranaEngine.getState().topologicalWindingNumber).toBe(8);

      hingeMajoranaEngine.setParameters({ regime: 'surface-mass-inversion' });
      expect(hingeMajoranaEngine.getState().topologicalWindingNumber).toBe(2);

      hingeMajoranaEngine.setParameters({ regime: 'fractional-thermal-hall' });
      expect(hingeMajoranaEngine.getState().topologicalWindingNumber).toBe(1);

      hingeMajoranaEngine.setParameters({ regime: 'chiral-hinge-majorana' });
      expect(hingeMajoranaEngine.getState().topologicalWindingNumber).toBe(4);
    });

    it('翻轉表面域壁磁化應切換鉸鏈傳播手性方向', () => {
      const initChirality = hingeMajoranaEngine.getState().isReversedChirality;
      hingeMajoranaEngine.invertSurfaceDomainWall();
      expect(hingeMajoranaEngine.getState().isReversedChirality).toBe(!initChirality);
    });

    it('步進編織激發應增強手性準粒子電流', () => {
      const currentBefore = hingeMajoranaEngine.getState().chiralCurrentNa;
      hingeMajoranaEngine.pumpHingeBraidingStep();
      expect(Math.abs(hingeMajoranaEngine.getState().chiralCurrentNa)).toBeGreaterThan(Math.abs(currentBefore));
    });

    it('update 迴圈應維護電流動態平衡並記錄遙測', () => {
      hingeMajoranaEngine.update(1.0);
      const state = hingeMajoranaEngine.getState();
      expect(state.majoranaVelocityKmS).toBeGreaterThan(0);
    });
  });

  describe('4. AdS/BCFT 邊界量子島黑洞資訊恢復反應堆 (quantumIslandReactor)', () => {
    it('應正確初始化並計算佩吉曲線糾纏熵與量子島狀態', () => {
      const state = quantumIslandEngine.getState();
      expect(state.evaporationTimeNormalized).toBeGreaterThanOrEqual(0);
      expect(state.adSCurvatureRadiusL).toBeGreaterThan(0);
      expect(state.hawkingEntropy).toBeGreaterThan(0);
      expect(state.pageEntropy).toBeLessThanOrEqual(state.hawkingEntropy);
    });

    it('在佩吉時間前應無量子島，在佩吉時間後應湧現量子極值面與量子島', () => {
      // 佩吉時間之前 (t = 0.1)
      quantumIslandEngine.setParameters({
        evaporationTimeNormalized: 0.1,
        regime: 'pre-page-hawking'
      });
      let state = quantumIslandEngine.getState();
      expect(state.isIslandFormed).toBe(false);
      expect(state.qesAreaTerm).toBe(0);
      expect(state.pageEntropy).toBe(state.hawkingEntropy);

      // 佩吉時間之後 (t = 0.8)
      quantumIslandEngine.setParameters({
        evaporationTimeNormalized: 0.8,
        regime: 'qes-island-turnaround'
      });
      state = quantumIslandEngine.getState();
      expect(state.isIslandFormed).toBe(true);
      expect(state.qesAreaTerm).toBeGreaterThan(0);
      expect(state.pageEntropy).toBeLessThan(state.hawkingEntropy);
      expect(state.decodingFidelityPct).toBeGreaterThan(70.0);
    });

    it('執行 Petz 逆映射應提升量子資訊恢復保真度', () => {
      quantumIslandEngine.setParameters({
        evaporationTimeNormalized: 0.7,
        regime: 'entanglement-wedge-recovery'
      });
      const fidelityBefore = quantumIslandEngine.getState().decodingFidelityPct;
      quantumIslandEngine.triggerPetzMapDecoding();
      expect(quantumIslandEngine.getState().decodingFidelityPct).toBeGreaterThanOrEqual(fidelityBefore);
    });

    it('advancePageEvaporation 應平滑步進蒸發時間並在滿期時循環', () => {
      quantumIslandEngine.setParameters({ evaporationTimeNormalized: 0.96 });
      quantumIslandEngine.advancePageEvaporation(0.05);
      expect(quantumIslandEngine.getState().evaporationTimeNormalized).toBe(0.05);
    });

    it('update 迴圈在希登-普雷斯基爾模式下應持續平滑演化', () => {
      quantumIslandEngine.setParameters({ regime: 'hayden-preskill-decoding' });
      const t0 = quantumIslandEngine.getState().evaporationTimeNormalized;
      quantumIslandEngine.update(1.0);
      expect(quantumIslandEngine.getState().evaporationTimeNormalized).not.toBe(t0);
    });
  });
});
