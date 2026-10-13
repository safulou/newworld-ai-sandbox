import { describe, it, expect, beforeEach } from 'vitest';
import { hawkingPageAdSEngine } from '../hawkingPageAdSPhaseTransition';
import { axionTIWittenEngine } from '../axionTIWittenEffect';
import { parisiSpinGlassEngine } from '../parisiSpinGlassUltrametric';
import { nonAbelianCosmicVortexEngine } from '../nonAbelianCosmicVortex';

describe('Part 36: 霍金-佩奇相變、維騰效應、帕里西超度規自旋玻璃與非阿貝爾宇宙渦旋發電機', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 霍金-佩奇黑洞相變與全息引力凝聚反應堆 (Hawking-Page Engine)', () => {
    it('應具有預設大黑洞解禁閉相、負自由能差與正確臨界霍金-佩奇溫度', () => {
      hawkingPageAdSEngine.resetDefaults();
      const state = hawkingPageAdSEngine.getState();
      expect(state.adsRadiusL).toBe(4.0);
      expect(state.hawkingPageTempThp).toBeCloseTo(0.119, 2);
      expect(state.boundaryTemperatureT).toBe(0.35);
      expect(state.freeEnergyDifferenceDeltaF).toBeLessThan(0);
      expect(state.regime).toBe('large-bh-deconfined-plasma');
      expect(state.polyakovLoopExpectation).toBeGreaterThan(0.8);
    });

    it('冷卻邊界溫度應使系統相變至熱 AdS 顏色禁閉相態', () => {
      hawkingPageAdSEngine.resetDefaults();
      hawkingPageAdSEngine.coolToThermalAdS();
      const state = hawkingPageAdSEngine.getState();
      expect(state.boundaryTemperatureT).toBe(0.08);
      expect(state.freeEnergyDifferenceDeltaF).toBeGreaterThan(0);
      expect(state.regime).toBe('thermal-ads-confined-gas');
      expect(state.blackHoleHorizonEntropyS).toBe(0.0);
    });

    it('加熱邊界 CFT 溫度應擴大黑洞視界半徑並激增視界熵', () => {
      hawkingPageAdSEngine.resetDefaults();
      const initialEntropy = hawkingPageAdSEngine.getState().blackHoleHorizonEntropyS;
      hawkingPageAdSEngine.heatBoundaryCFT(0.5);
      const state = hawkingPageAdSEngine.getState();
      expect(state.boundaryTemperatureT).toBe(0.85);
      expect(state.blackHoleHorizonEntropyS).toBeGreaterThan(initialEntropy);
      expect(state.regime).toBe('large-bh-deconfined-plasma');
    });

    it('調控 AdS 曲率半徑應重新計算臨界霍金-佩奇溫度', () => {
      hawkingPageAdSEngine.resetDefaults();
      hawkingPageAdSEngine.tuneAdSCurvatureRadius(2.0); // L = 6.0
      const state = hawkingPageAdSEngine.getState();
      expect(state.adsRadiusL).toBe(6.0);
      expect(state.hawkingPageTempThp).toBeCloseTo(3 / (2 * Math.PI * 6.0), 2);
    });

    it('觸發霍金-佩奇相變應精確定位至雙穩態共存閾值', () => {
      hawkingPageAdSEngine.resetDefaults();
      hawkingPageAdSEngine.triggerHawkingPageTransition();
      const state = hawkingPageAdSEngine.getState();
      expect(state.boundaryTemperatureT).toBe(state.hawkingPageTempThp);
      expect(state.regime).toBe('metastable-coexistence-threshold');
    });

    it('時鐘推進應累積霍金-佩奇遙測歷史紀錄', () => {
      hawkingPageAdSEngine.resetDefaults();
      hawkingPageAdSEngine.update(1.2);
      const state = hawkingPageAdSEngine.getState();
      expect(Array.isArray(state.telemetryHistory)).toBe(true);
    });
  });

  describe('2. 三維拓撲絕緣體軸子電動力學與維騰效應反應堆 (Axion TI Witten Engine)', () => {
    it('應具有預設 θ=π 軸子角度、半整數分數二元荷 q=0.5e 與拓撲磁電效應', () => {
      axionTIWittenEngine.resetDefaults();
      const state = axionTIWittenEngine.getState();
      expect(state.axionAngleThetaRad).toBeCloseTo(Math.PI, 3);
      expect(state.inducedMonopoleChargeFractionalE).toBe(0.5);
      expect(state.magnetoelectricPolarizationPE10).toBeGreaterThan(0.0);
      expect(state.topologicalMagnetizationM).toBeGreaterThan(0.0);
      expect(state.regime).toBe('witten-effect-fractional-dyon');
    });

    it('注入脈衝電場應大幅增強拓撲磁化強度 M', () => {
      axionTIWittenEngine.resetDefaults();
      const initialM = axionTIWittenEngine.getState().topologicalMagnetizationM;
      axionTIWittenEngine.pulseElectricField(10.0);
      const state = axionTIWittenEngine.getState();
      expect(state.appliedElectricFieldVPerM).toBe(18.5);
      expect(state.topologicalMagnetizationM).toBeGreaterThan(initialM);
    });

    it('斜坡推進外加磁場應大幅提升拓撲電極化強度 P', () => {
      axionTIWittenEngine.resetDefaults();
      const initialP = axionTIWittenEngine.getState().magnetoelectricPolarizationPE10;
      axionTIWittenEngine.rampMagneticField(4.0);
      const state = axionTIWittenEngine.getState();
      expect(state.appliedMagneticFieldTesla).toBe(7.2);
      expect(state.magnetoelectricPolarizationPE10).toBeGreaterThan(initialP);
    });

    it('破缺表面時間反演對稱性應產生未配對半整數量子霍爾電導', () => {
      axionTIWittenEngine.resetDefaults();
      axionTIWittenEngine.breakTimeReversalGap(10.0);
      const state = axionTIWittenEngine.getState();
      expect(state.surfaceMagneticGapDeltaMev).toBe(14.5);
      expect(state.surfaceHallConductanceUnitsE2H).toBe(0.5);
      expect(state.regime).toBe('time-reversal-broken-half-hall');
    });

    it('調控軸子真空角應調製感應單極子電荷分數', () => {
      axionTIWittenEngine.resetDefaults();
      axionTIWittenEngine.setAxionVacuumTheta(1.5708); // π/2
      const state = axionTIWittenEngine.getState();
      expect(state.axionAngleThetaRad).toBe(1.5708);
      expect(state.inducedMonopoleChargeFractionalE).toBeCloseTo(0.25, 2);
    });
  });

  describe('3. 量子多體自旋玻璃帕里西極值破缺處理器 (Parisi Spin Glass Engine)', () => {
    it('應具有預設帕里西超度規破缺相、愛德華茲-安德森序參量與崎嶇亞穩態能谷', () => {
      parisiSpinGlassEngine.resetDefaults();
      const state = parisiSpinGlassEngine.getState();
      expect(state.temperatureKelvinT).toBe(0.65);
      expect(state.parisiEdwardsAndersonQEA).toBeGreaterThan(0.7);
      expect(state.ultrametricClusteringIndex).toBeGreaterThan(0.8);
      expect(state.energyLandscapeValleysLogN).toBeGreaterThan(30.0);
      expect(state.regime).toBe('parisi-full-rsb-ultrametric');
    });

    it('深化複本對稱破缺層次階數應提升超度規聚集指數與亞穩態數目', () => {
      parisiSpinGlassEngine.resetDefaults();
      const initialValleys = parisiSpinGlassEngine.getState().energyLandscapeValleysLogN;
      parisiSpinGlassEngine.deepenRSBBranching(2);
      const state = parisiSpinGlassEngine.getState();
      expect(state.rsbBranchingLevelK).toBe(6);
      expect(state.energyLandscapeValleysLogN).toBeGreaterThan(initialValleys);
    });

    it('施加強橫向量子磁場應激發量子退火穿隧態', () => {
      parisiSpinGlassEngine.resetDefaults();
      parisiSpinGlassEngine.rampQuantumTransverseField(2.5);
      const state = parisiSpinGlassEngine.getState();
      expect(state.transverseFieldGamma).toBe(3.7);
      expect(state.regime).toBe('quantum-annealing-tunneling');
      expect(state.quantumTunnelingRateGhz).toBeGreaterThan(5.0);
    });

    it('冷卻系統至極低溫應強化自旋玻璃凍結程度', () => {
      parisiSpinGlassEngine.resetDefaults();
      parisiSpinGlassEngine.coolToParisiGlass(-0.4);
      const state = parisiSpinGlassEngine.getState();
      expect(state.temperatureKelvinT).toBe(0.25);
      expect(state.parisiEdwardsAndersonQEA).toBeGreaterThan(0.85);
    });

    it('執行完整量子退火循環應穿隧崎嶇能壘並收斂至高階超度規態', () => {
      parisiSpinGlassEngine.resetDefaults();
      parisiSpinGlassEngine.triggerQuantumAnnealCycle();
      const state = parisiSpinGlassEngine.getState();
      expect(state.transverseFieldGamma).toBe(4.5);
      expect(state.temperatureKelvinT).toBe(0.2);
      expect(state.rsbBranchingLevelK).toBe(6);
    });
  });

  describe('4. 非可換阿貝爾-希格斯渦旋弦宇宙暴脹發電機 (Non-Abelian Cosmic Vortex Engine)', () => {
    it('應具有預設 BPS 臨界飽和拓撲相、弦間相互作用力為零且重聯幾率受阻', () => {
      nonAbelianCosmicVortexEngine.resetDefaults();
      const state = nonAbelianCosmicVortexEngine.getState();
      expect(state.bpsCouplingRatioBeta).toBe(1.0);
      expect(state.interVortexForceNormalized).toBe(0.0);
      expect(state.stringReconnectionProbP).toBeLessThan(0.3);
      expect(state.regime).toBe('bps-saturated-topological-vortex');
      expect(state.stringTensionMuGev2).toBeGreaterThan(10.0);
    });

    it('調控 BPS 耦合比應切換為吸引或排斥相互作用', () => {
      nonAbelianCosmicVortexEngine.resetDefaults();
      // 提升 beta > 1 產生排斥力 (Type II)
      nonAbelianCosmicVortexEngine.tuneBPSCouplingRatio(0.5);
      let state = nonAbelianCosmicVortexEngine.getState();
      expect(state.bpsCouplingRatioBeta).toBe(1.5);
      expect(state.interVortexForceNormalized).toBeGreaterThan(0.0);

      // 降至 beta < 1 產生吸引力 (Type I)
      nonAbelianCosmicVortexEngine.tuneBPSCouplingRatio(-0.9);
      state = nonAbelianCosmicVortexEngine.getState();
      expect(state.bpsCouplingRatioBeta).toBe(0.6);
      expect(state.interVortexForceNormalized).toBeLessThan(0.0);
    });

    it('鎖定 BPS 飽和界限應使相互作用力歸零平衡', () => {
      nonAbelianCosmicVortexEngine.resetDefaults();
      nonAbelianCosmicVortexEngine.tuneBPSCouplingRatio(0.8);
      nonAbelianCosmicVortexEngine.lockExactBPSSaturation();
      const state = nonAbelianCosmicVortexEngine.getState();
      expect(state.bpsCouplingRatioBeta).toBe(1.0);
      expect(state.interVortexForceNormalized).toBe(0.0);
      expect(state.regime).toBe('bps-saturated-topological-vortex');
    });

    it('激發拓撲環繞數應量子化擴展非阿貝爾通量量子與弦張力', () => {
      nonAbelianCosmicVortexEngine.resetDefaults();
      const initialTension = nonAbelianCosmicVortexEngine.getState().stringTensionMuGev2;
      nonAbelianCosmicVortexEngine.exciteWindingQuanta(2);
      const state = nonAbelianCosmicVortexEngine.getState();
      expect(state.vortexWindingNumberN).toBe(4);
      expect(state.nonAbelianFluxQuantumHBarC).toBe(8.0);
      expect(state.stringTensionMuGev2).toBeGreaterThan(initialTension);
    });

    it('激發非阿貝爾弦碰撞重聯應進入重聯激增相', () => {
      nonAbelianCosmicVortexEngine.resetDefaults();
      nonAbelianCosmicVortexEngine.triggerNonAbelianCollision();
      const state = nonAbelianCosmicVortexEngine.getState();
      expect(state.stringReconnectionProbP).toBe(0.85);
      expect(state.regime).toBe('non-abelian-flux-reconnection-surge');
    });
  });
});
