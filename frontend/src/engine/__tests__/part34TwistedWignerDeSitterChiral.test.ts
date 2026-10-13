import { describe, it, expect, beforeEach, vi } from 'vitest';
import { twistedPolaritonEngine } from '../twistedPolaritonFlatBand';
import { wignerCrystalEngine } from '../wignerCrystalQuantumMelting';
import { deSitterHoloEngine } from '../deSitterHoloStaticPatch';
import { chiralPhononEngine } from '../chiralPhononAcousticHall';

describe('Part 34: 扭轉光子晶體、維格納量子熔化、德西特全息與手性聲子反應堆', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 扭轉多層光子晶體拓撲平帶極化激元 (Twisted Polariton Engine)', () => {
    it('應具有正確的初始物理參數與莫爾平帶慢光 BEC 相態', () => {
      twistedPolaritonEngine.resetDefaults();
      const state = twistedPolaritonEngine.getState();
      expect(state.twistAngleDeg).toBe(1.80);
      expect(state.groupVelocityNormalized).toBeLessThan(0.01);
      expect(state.becCondensateFractionPercent).toBeGreaterThan(65.0);
      expect(state.secondOrderCoherenceG2).toBeLessThan(1.5);
      expect(state.regime).toBe('flat-band-slow-light-condensation');
    });

    it('注入強脈衝雷射光束應激發更高 BEC 凝聚態佔比並提升光學二階相干度', () => {
      twistedPolaritonEngine.resetDefaults();
      const initialBec = twistedPolaritonEngine.getState().becCondensateFractionPercent;
      twistedPolaritonEngine.pulseOpticalPump(25.0);
      const updated = twistedPolaritonEngine.getState();
      expect(updated.pumpLaserPowerMilliWatt).toBe(57.0);
      expect(updated.becCondensateFractionPercent).toBeGreaterThanOrEqual(initialBec);
      expect(updated.secondOrderCoherenceG2).toBeLessThanOrEqual(1.1);
    });

    it('調諧微腔長度應動態改換激子-光子失諧量', () => {
      twistedPolaritonEngine.resetDefaults();
      twistedPolaritonEngine.tuneCavityResonance(5.0);
      const state = twistedPolaritonEngine.getState();
      expect(state.cavityDetuningDeltaMev).toBe(3.0);
    });

    it('微調遠離魔角時光子群速度應顯著增大且平帶被打破', () => {
      twistedPolaritonEngine.resetDefaults();
      twistedPolaritonEngine.setTwistAngle(3.8);
      const state = twistedPolaritonEngine.getState();
      expect(state.twistAngleDeg).toBe(3.8);
      expect(state.groupVelocityNormalized).toBeGreaterThan(0.05);
    });

    it('激發手性拓撲偏壓應產生假自旋拓撲半孤子漩渦相', () => {
      twistedPolaritonEngine.resetDefaults();
      twistedPolaritonEngine.triggerSolitonVortex();
      twistedPolaritonEngine.triggerSolitonVortex();
      const state = twistedPolaritonEngine.getState();
      expect(state.teTmSplittingStrength).toBeGreaterThan(2.5);
      expect(state.regime).toBe('pseudospin-vortex-soliton');
      expect(state.solitonTopologicalCharge).toBeGreaterThanOrEqual(1);
    });

    it('更新時鐘應累積遙測遙感歷史', () => {
      twistedPolaritonEngine.resetDefaults();
      twistedPolaritonEngine.update(1.0);
      const state = twistedPolaritonEngine.getState();
      expect(Array.isArray(state.telemetryHistory)).toBe(true);
      expect(state.telemetryHistory.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('2. 高階維格納晶體量子熔化與向列量子液晶 (Wigner Crystal Engine)', () => {
    it('應具有正確的初始六角維格納晶體剛性與剪切模量', () => {
      wignerCrystalEngine.resetDefaults();
      const state = wignerCrystalEngine.getState();
      expect(state.wignerParameterRs).toBeGreaterThan(37.0);
      expect(state.regime).toBe('hexagonal-wigner-crystal');
      expect(state.latticeShearModulusMu).toBeGreaterThan(0);
      expect(state.depinningThresholdFieldVcm).toBeGreaterThan(0.2);
    });

    it('壓縮並提高電子密度應促成量子熔化並進入電子向列量子液晶相', () => {
      wignerCrystalEngine.resetDefaults();
      wignerCrystalEngine.compressElectronDensity(3.0); // 顯著增加密度
      const state = wignerCrystalEngine.getState();
      expect(state.electronDensityN10Cm2).toBeGreaterThan(3.0);
      expect(state.wignerParameterRs).toBeLessThan(37.0);
      expect(state.latticeShearModulusMu).toBe(0); // 剪切模量在液晶/液體中完全消失
      expect(state.resistivityAnisotropyRatio).toBeGreaterThan(5.0);
    });

    it('掃描強磁場應淬滅動能促成高磁場再結晶與微波位移共振', () => {
      wignerCrystalEngine.resetDefaults();
      wignerCrystalEngine.sweepMagneticField(9.5);
      const state = wignerCrystalEngine.getState();
      expect(state.magneticFieldTesla).toBe(9.5);
      expect(state.microwaveResonanceFreqGhz).toBeGreaterThan(8.0);
    });

    it('施加面內剪切應變應定向旋轉向列指向矢', () => {
      wignerCrystalEngine.resetDefaults();
      const initialAngle = wignerCrystalEngine.getState().directorAngleRad;
      wignerCrystalEngine.applyInPlaneStrain(0.5);
      const updated = wignerCrystalEngine.getState();
      expect(updated.directorAngleRad).not.toBe(initialAngle);
    });

    it('注入微波偏壓應解釘滑移晶格位錯', () => {
      wignerCrystalEngine.resetDefaults();
      const initialEth = wignerCrystalEngine.getState().depinningThresholdFieldVcm;
      wignerCrystalEngine.pulseDefectDepinning();
      const state = wignerCrystalEngine.getState();
      expect(state.depinningThresholdFieldVcm).toBeLessThanOrEqual(initialEth);
    });
  });

  describe('3. 德西特宇宙全息對偶與靜態膜極端熵 (de Sitter Holographic Engine)', () => {
    it('應具有預設吉本斯-霍金視界半徑、視界溫度與吉本斯-霍金最大視界熵', () => {
      deSitterHoloEngine.resetDefaults();
      const state = deSitterHoloEngine.getState();
      expect(state.cosmologicalConstantLambda).toBe(1.10);
      expect(state.horizonRadiusLdsGigaLy).toBeGreaterThan(14.0);
      expect(state.gibbonsHawkingEntropyS120).toBeGreaterThan(10.0);
      expect(state.vonNeumannMaximalEntropyRank).toBeGreaterThan(0.9);
      expect(state.regime).toBe('gibbons-hawking-thermal-equilibrium');
    });

    it('調控宇宙學常數應動態收縮或擴張宇宙學視界半徑', () => {
      deSitterHoloEngine.resetDefaults();
      deSitterHoloEngine.modulateCosmologicalConstant(1.5); // 增加 Lambda
      const state = deSitterHoloEngine.getState();
      expect(state.cosmologicalConstantLambda).toBe(2.6);
      expect(state.horizonRadiusLdsGigaLy).toBeLessThan(12.0); // 膨脹加劇，視界半徑縮小
    });

    it('注入靜態膜微黑洞質量應激發佩奇糾纏島嶼轉折', () => {
      deSitterHoloEngine.resetDefaults();
      deSitterHoloEngine.injectStaticPatchMass(25.0);
      const state = deSitterHoloEngine.getState();
      expect(state.staticPatchBlackHoleMassSolar).toBe(29.5);
      expect(state.pageEntanglementIslandRatio).toBeGreaterThan(0.65);
      expect(state.regime).toBe('desitter-page-entanglement-transition');
    });

    it('觸發真假真空泡泡核化應進入 Coleman-De Luccia 衰變相', () => {
      deSitterHoloEngine.resetDefaults();
      deSitterHoloEngine.triggerBubbleNucleation();
      const state = deSitterHoloEngine.getState();
      expect(state.bubbleNucleationTension).toBeLessThan(0.8);
      expect(state.regime).toBe('coleman-deluccia-bubble-nucleation');
    });

    it('採樣視界微觀態應恢復 Type II_1 馮諾依曼代數最大混態', () => {
      deSitterHoloEngine.resetDefaults();
      deSitterHoloEngine.sampleHorizonMicrostates();
      const state = deSitterHoloEngine.getState();
      expect(state.vonNeumannMaximalEntropyRank).toBeGreaterThan(0.98);
    });
  });

  describe('4. 拓撲手性聲子與量子反常聲霍爾效應 (Chiral Phonon Engine)', () => {
    it('應具有預設手性角動量、拓撲陳數與反常橫向聲偏轉角', () => {
      chiralPhononEngine.resetDefaults();
      const state = chiralPhononEngine.getState();
      expect(state.phononChiralityIndex).toBe(1.0);
      expect(state.topologicalPhononChernNumber).toBe(1);
      expect(state.transverseAcousticDeflectionDeg).toBeGreaterThan(10.0);
      expect(state.thermalAcousticHallKappaXy).toBeGreaterThan(0.0);
      expect(state.regime).toBe('acoustic-anomalous-hall-deflection');
    });

    it('反轉原子手性旋轉應瞬態反轉反常聲偏轉方向與聲熱霍爾係數符號', () => {
      chiralPhononEngine.resetDefaults();
      chiralPhononEngine.switchPhononHandedness(-1.0);
      const state = chiralPhononEngine.getState();
      expect(state.phononChiralityIndex).toBe(-1.0);
      expect(state.topologicalPhononChernNumber).toBe(-1);
      expect(state.transverseAcousticDeflectionDeg).toBeLessThan(-10.0);
      expect(state.thermalAcousticHallKappaXy).toBeLessThan(0.0);
    });

    it('注入聲熱流脈衝應增強聲子貝里曲率與偏轉強度', () => {
      chiralPhononEngine.resetDefaults();
      const initialOmega = chiralPhononEngine.getState().phononBerryCurvatureOmega;
      chiralPhononEngine.injectAcousticHeatFlux(1.2);
      const state = chiralPhononEngine.getState();
      expect(state.phononBerryCurvatureOmega).toBeGreaterThan(initialOmega);
    });

    it('調諧聲學共振頻率應準確更新聲頻', () => {
      chiralPhononEngine.resetDefaults();
      chiralPhononEngine.tuneAcousticResonance(11.8);
      const state = chiralPhononEngine.getState();
      expect(state.acousticFrequencyTHz).toBe(11.8);
    });

    it('激發磁子-聲子非共線強耦合應進入極化激元雜化相並大幅提升聲二極體單向整流比', () => {
      chiralPhononEngine.resetDefaults();
      chiralPhononEngine.coupleMagnonDrive();
      chiralPhononEngine.coupleMagnonDrive();
      const state = chiralPhononEngine.getState();
      expect(state.magnonCouplingStrength).toBeGreaterThan(2.8);
      expect(state.acousticDiodeRectificationRatio).toBeGreaterThan(30.0);
      expect(state.regime).toBe('magnon-phonon-hybrid-polariton');
    });
  });
});
