import { describe, it, expect, beforeEach, vi } from 'vitest';
import { superfluidHelium3Engine } from '../superfluidHelium3BPhase';
import { chiralMajoranaEngine } from '../chiralMajoranaFermionQAH';
import { blackHoleQuantumEchoesEngine } from '../blackHoleQuantumEchoes';
import { compositeFermionEngine } from '../compositeFermionHLRLiquid';

describe('Part 41: 超流氦-3、手性馬約拉納、黑洞量子迴聲與複合費米子測試', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    superfluidHelium3Engine.reset();
    chiralMajoranaEngine.reset();
    blackHoleQuantumEchoesEngine.reset();
    compositeFermionEngine.reset();
  });

  describe('1. 超流氦-3 拓撲 B 相與馬約拉納二維表面費米錐 (Superfluid Helium-3 B-Phase)', () => {
    it('應正確初始化超流能隙、臨界轉變溫度與拓撲 B 相', () => {
      const state = superfluidHelium3Engine.getState();
      expect(state.temperatureMilliKelvin).toBe(1.2);
      expect(state.pressureBar).toBe(21.0);
      expect(state.criticalTemperatureTcMk).toBeGreaterThan(1.5);
      expect(state.superfluidOrderParamDeltaUev).toBeGreaterThan(0.1);
      expect(state.surfaceMajoranaVelocityM_S).toBeGreaterThan(10.0);
      expect(state.regime).toBe('isotropic-b-phase-topological');
    });

    it('高於臨界溫度時能隙應歸零並進入正常費米液體相', () => {
      superfluidHelium3Engine.setTemperature(3.0);
      const state = superfluidHelium3Engine.getState();
      expect(state.superfluidOrderParamDeltaUev).toBe(0.0);
      expect(state.surfaceMajoranaVelocityM_S).toBe(0.0);
      expect(state.regime).toBe('normal-fermi-liquid-depaired');
    });

    it('手動激發表面安德烈夫馬約拉納共振應增加計數並轉移相態', () => {
      const initialCount = superfluidHelium3Engine.getState().surfaceAndreevBoundCount;
      superfluidHelium3Engine.triggerSurfaceAndreevResonance();
      const state = superfluidHelium3Engine.getState();
      expect(state.surfaceAndreevBoundCount).toBe(initialCount + 50);
      expect(state.regime).toBe('surface-andreev-majorana-bound');
    });

    it('調節樣品壓力應提高臨界轉變溫度', () => {
      superfluidHelium3Engine.setPressure(30.0);
      const state = superfluidHelium3Engine.getState();
      expect(state.criticalTemperatureTcMk).toBeCloseTo(0.93 + 0.046 * 30.0, 1);
    });

    it('相態輪轉與系統重置應能正常循環且數值一致', () => {
      superfluidHelium3Engine.cycleRegime();
      expect(superfluidHelium3Engine.getState().regime).toBeDefined();
      superfluidHelium3Engine.reset();
      expect(superfluidHelium3Engine.getState().temperatureMilliKelvin).toBe(1.2);
      expect(superfluidHelium3Engine.getState().pressureBar).toBe(21.0);
    });
  });

  describe('2. 量子反常霍爾-超導手性馬約拉納天使粒子 (Chiral Majorana Fermion Modes)', () => {
    it('應正確初始化交換場、超導能隙與半整數量子化霍爾平台', () => {
      const state = chiralMajoranaEngine.getState();
      expect(state.exchangeFieldMev).toBe(1.55);
      expect(state.superconductingPairGapMev).toBe(1.50);
      expect(state.hallConductanceE2OverH).toBe(0.5);
      expect(state.thermalHallConductanceCentralC).toBe(0.5);
      expect(state.majoranaDecouplingRatio).toBeGreaterThan(0.9);
      expect(state.regime).toBe('half-quantized-chiral-majorana-plateau');
    });

    it('弱交換場下應進入平庸超導相且霍爾電導歸零', () => {
      chiralMajoranaEngine.setExchangeField(0.4);
      const state = chiralMajoranaEngine.getState();
      expect(state.hallConductanceE2OverH).toBe(0.0);
      expect(state.thermalHallConductanceCentralC).toBe(0.0);
      expect(state.regime).toBe('trivial-superconducting-gap');
    });

    it('強交換場壓制超導態時應恢復整數量子反常霍爾狄拉克邊緣態', () => {
      chiralMajoranaEngine.setExchangeField(3.2);
      const state = chiralMajoranaEngine.getState();
      expect(state.hallConductanceE2OverH).toBe(1.0);
      expect(state.thermalHallConductanceCentralC).toBe(1.0);
      expect(state.regime).toBe('integer-qah-chiral-dirac-mode');
    });

    it('手動觸發馬約拉納半整數平台應累積事件計數並維持 0.5 平台', () => {
      const initialEvents = chiralMajoranaEngine.getState().accumulatedMajoranaEventsCount;
      chiralMajoranaEngine.triggerMajoranaPlateau();
      const state = chiralMajoranaEngine.getState();
      expect(state.accumulatedMajoranaEventsCount).toBe(initialEvents + 100);
      expect(state.hallConductanceE2OverH).toBe(0.5);
      expect(state.regime).toBe('half-quantized-chiral-majorana-plateau');
    });

    it('相態輪轉與重置應能正常還原預設態', () => {
      chiralMajoranaEngine.cycleRegime();
      expect(chiralMajoranaEngine.getState().regime).toBeDefined();
      chiralMajoranaEngine.reset();
      expect(chiralMajoranaEngine.getState().exchangeFieldMev).toBe(1.55);
      expect(chiralMajoranaEngine.getState().hallConductanceE2OverH).toBe(0.5);
    });
  });

  describe('3. 黑洞量子視界反射膜與引力波量子迴聲 (Black Hole Quantum Horizon Echoes)', () => {
    it('應正確初始化黑洞質量、量子膜反射率與迴聲時間延遲', () => {
      const state = blackHoleQuantumEchoesEngine.getState();
      expect(state.blackHoleMassSolar).toBe(35.0);
      expect(state.horizonReflectivityRatio).toBe(0.82);
      expect(state.echoDelayTimeMs).toBeGreaterThan(20.0);
      expect(state.fundamentalQuasinormalFreqHz).toBeGreaterThan(200.0);
      expect(state.regime).toBe('periodic-gravitational-wave-echo-train');
    });

    it('零反射率時應退化為經典廣義相對論無迴聲黑洞', () => {
      blackHoleQuantumEchoesEngine.setHorizonReflectivity(0.0);
      const state = blackHoleQuantumEchoesEngine.getState();
      expect(state.horizonReflectivityRatio).toBe(0.0);
      expect(state.regime).toBe('classical-black-hole-no-echo');
    });

    it('超高反射率與普朗克極限膜距應激發普朗克量子膜空腔諧振態', () => {
      blackHoleQuantumEchoesEngine.setHorizonReflectivity(0.92);
      blackHoleQuantumEchoesEngine.setQuantumMembraneDistance(0.8);
      const state = blackHoleQuantumEchoesEngine.getState();
      expect(state.regime).toBe('planckian-quantum-membrane-resonance');
      expect(state.cavityQualityFactorQ).toBeGreaterThan(10.0);
    });

    it('手動觸發並合與量子引力波迴聲爆發應增加偵測計數', () => {
      const initialCount = blackHoleQuantumEchoesEngine.getState().detectedEchoesTrainCount;
      blackHoleQuantumEchoesEngine.triggerQuantumEchoesBurst();
      const state = blackHoleQuantumEchoesEngine.getState();
      expect(state.detectedEchoesTrainCount).toBe(initialCount + 25);
      expect(state.regime).toBe('periodic-gravitational-wave-echo-train');
    });

    it('輪轉相態與重置能正確回復初值', () => {
      blackHoleQuantumEchoesEngine.cycleRegime();
      expect(blackHoleQuantumEchoesEngine.getState().regime).toBeDefined();
      blackHoleQuantumEchoesEngine.reset();
      expect(blackHoleQuantumEchoesEngine.getState().blackHoleMassSolar).toBe(35.0);
    });
  });

  describe('4. 幾何複合費米子與 Halperin-Lee-Read 偶分母非費米流體 (Composite Fermion HLR)', () => {
    it('應正確初始化半填充分數 nu=0.5、零等效磁場與複合費米面波矢', () => {
      const state = compositeFermionEngine.getState();
      expect(state.fillingFactorNu).toBe(0.500);
      expect(state.effectiveMagneticFieldTesla).toBe(0.0);
      expect(state.compositeFermiWavevectorInvNm).toBeGreaterThan(0.1);
      expect(state.regime).toBe('halperin-lee-read-half-filled-liquid');
    });

    it('切換至 Jain 分數序列 nu = 0.400 時應進入複合費米子分數量子霍爾相', () => {
      compositeFermionEngine.setFillingFactor(0.400);
      const state = compositeFermionEngine.getState();
      expect(state.fillingFactorNu).toBe(0.400);
      expect(state.regime).toBe('composite-fermion-fractional-qhe');
      expect(state.effectiveMagneticFieldTesla).toBeGreaterThan(1.0);
    });

    it('微小磁場偏離應產生有限迴旋軌道直徑', () => {
      compositeFermionEngine.setFillingFactor(0.530);
      const state = compositeFermionEngine.getState();
      expect(state.effectiveMagneticFieldTesla).not.toBe(0.0);
      expect(state.cyclotronOrbitDiameterNm).toBeLessThan(900.0);
      expect(state.cyclotronOrbitDiameterNm).toBeGreaterThan(50.0);
    });

    it('手動觸發幾何共振應增加循環數並切換至等效迴旋幾何共振相', () => {
      const initialCycles = compositeFermionEngine.getState().accumulatedResonanceCyclesCount;
      compositeFermionEngine.triggerGeometricResonance();
      const state = compositeFermionEngine.getState();
      expect(state.accumulatedResonanceCyclesCount).toBe(initialCycles + 50);
      expect(state.regime).toBe('effective-cyclotron-geometric-resonance');
    });

    it('輪轉相態與重置應能正常回復 HLR 預設態', () => {
      compositeFermionEngine.cycleRegime();
      expect(compositeFermionEngine.getState().regime).toBeDefined();
      compositeFermionEngine.reset();
      expect(compositeFermionEngine.getState().fillingFactorNu).toBe(0.500);
      expect(compositeFermionEngine.getState().effectiveMagneticFieldTesla).toBe(0.0);
    });
  });
});
