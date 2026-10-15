import { describe, it, expect, beforeEach } from 'vitest';
import { FractionalHallStripeLiquidCrystalEngine } from '../fractionalHallStripeLiquidCrystal';
import { WeylSuperconductingDiodeNetworkEngine } from '../weylSuperconductingDiodeNetwork';
import { MicroBlackHoleTeleportationEngine } from '../microBlackHoleTeleportationAntenna';
import { SocFractalWeylTimeCrystalEngine } from '../socFractalWeylTimeCrystal';
import { achievements } from '../achievements';

describe('Part 48: 霍爾條紋向列相、外爾超導二極體、微觀黑洞全息傳態、分形外爾時間晶體子系統測試', () => {
  let stripeEngine: FractionalHallStripeLiquidCrystalEngine;
  let weylDiodeEngine: WeylSuperconductingDiodeNetworkEngine;
  let blackHoleEngine: MicroBlackHoleTeleportationEngine;
  let timeCrystalEngine: SocFractalWeylTimeCrystalEngine;

  beforeEach(() => {
    stripeEngine = new FractionalHallStripeLiquidCrystalEngine();
    weylDiodeEngine = new WeylSuperconductingDiodeNetworkEngine();
    blackHoleEngine = new MicroBlackHoleTeleportationEngine();
    timeCrystalEngine = new SocFractalWeylTimeCrystalEngine();
  });

  describe('1. 分數量子霍爾條紋相與向列液晶相變引擎 (FractionalHallStripeLiquidCrystalEngine)', () => {
    it('應正確初始化半填充高朗道能級、巨各向異性比與條紋相切面採樣', () => {
      const state = stripeEngine.getState();
      expect(state.landauFillingNu).toBe(4.5);
      expect(state.anisotropyRatio).toBeGreaterThan(50);
      expect(state.stripeDensityField.length).toBeGreaterThan(0);
      expect(state.nematicOrderParameterS).toBeGreaterThan(0.5);
    });

    it('切換朗道填充因子至非半整數應進入泡泡晶格相或等方性費米液體', () => {
      stripeEngine.setLandauFilling(4.25);
      let state = stripeEngine.getState();
      expect(state.activeRegime).toBe('triangular-bubble-lattice');
      expect(state.bubbleClusterRadiusNm).toBeGreaterThan(0);

      stripeEngine.setLandauFilling(4.0);
      state = stripeEngine.getState();
      expect(state.activeRegime).toBe('isotropic-fermi-liquid');
      expect(state.anisotropyRatio).toBe(1.0);
    });

    it('調整向列液晶指向矢角度應重新計算縱向電阻各向異性', () => {
      stripeEngine.setNematicAngle(90.0);
      const state = stripeEngine.getState();
      expect(state.nematicDirectorAngleDeg).toBe(90.0);
      expect(state.longitudinalResistivityYy).toBeGreaterThan(state.longitudinalResistivityXx);
    });

    it('時間推進 update 應平滑演化 pulsePhase', () => {
      const initialPhase = stripeEngine.getState().pulsePhase;
      stripeEngine.update(0.1);
      expect(stripeEngine.getState().pulsePhase).toBeGreaterThan(initialPhase);
    });

    it('觸發音效與重設應安全不拋出異常', () => {
      expect(() => stripeEngine.triggerChirpAudio()).not.toThrow();
      expect(() => stripeEngine.resetDefaults()).not.toThrow();
      expect(stripeEngine.getState().landauFillingNu).toBe(4.5);
    });
  });

  describe('2. 手性外爾半金屬拓撲超導二極體網絡引擎 (WeylSuperconductingDiodeNetworkEngine)', () => {
    it('應正確初始化 4 端點超導結與整流效率張量', () => {
      const state = weylDiodeEngine.getState();
      expect(state.multiTerminalCount).toBe(4);
      expect(state.rectificationMatrix.length).toBe(4);
      expect(state.rectificationMatrix[0].length).toBe(4);
      expect(state.networkDiodeEfficiencyPercent).toBeGreaterThan(0);
    });

    it('調整手性化學勢 μ_5 與節點間距應改變非互易整流效率', () => {
      weylDiodeEngine.setChiralChemicalPotential(20.0);
      weylDiodeEngine.setWeylNodeSeparation(0.8);
      const state = weylDiodeEngine.getState();
      expect(state.chiralChemicalPotentialMu5).toBe(20.0);
      expect(state.weylNodeSeparationK0).toBe(0.8);
      expect(state.networkDiodeEfficiencyPercent).toBeGreaterThan(20);
    });

    it('切換可編程邏輯閘模式應正確調配端點超導相位', () => {
      weylDiodeEngine.setLogicGateMode('AND');
      expect(weylDiodeEngine.getState().logicGateMode).toBe('AND');

      weylDiodeEngine.setLogicGateMode('OR');
      expect(weylDiodeEngine.getState().logicGateMode).toBe('OR');
    });

    it('時間步進與聲學合成器調用應無異常', () => {
      const prevPhase = weylDiodeEngine.getState().pulsePhase;
      weylDiodeEngine.update(0.05);
      expect(weylDiodeEngine.getState().pulsePhase).toBeGreaterThan(prevPhase);
      expect(() => weylDiodeEngine.triggerChirpAudio()).not.toThrow();
      expect(() => weylDiodeEngine.resetDefaults()).not.toThrow();
    });
  });

  describe('3. 微觀黑洞全息引力子糾纏隱形傳態天線引擎 (MicroBlackHoleTeleportationEngine)', () => {
    it('應正確初始化 ER=EPR 雙面 AdS 黑洞與可穿越蟲洞喉管參數', () => {
      const state = blackHoleEngine.getState();
      expect(state.hawkingTemperatureKelvin).toBe(45.0);
      expect(state.wormholeThroatRadiusNm).toBeGreaterThan(0);
      expect(state.teleportationFidelity).toBeGreaterThan(0.95);
      expect(state.activeRegime).toBe('holographic-teleportation-active');
    });

    it('負能量衝擊波增強應擴大蟲洞喉管半徑與提升隱形傳態保真度', () => {
      blackHoleEngine.setNegativeEnergyFlux(18.0);
      const state = blackHoleEngine.getState();
      expect(state.negativeEnergyFlux).toBe(18.0);
      expect(state.wormholeThroatRadiusNm).toBeGreaterThan(15.0);
      expect(state.teleportationFidelity).toBeGreaterThanOrEqual(0.98);
    });

    it('霍金溫度調高應縮短量子攪拌時間 t_*', () => {
      blackHoleEngine.setHawkingTemperature(90.0);
      const state = blackHoleEngine.getState();
      expect(state.hawkingTemperatureKelvin).toBe(90.0);
      expect(state.scramblingTimeMs).toBeLessThan(15.0);
    });

    it('推進時間與發射傳態脈衝應安全執行', () => {
      const prevPhase = blackHoleEngine.getState().pulsePhase;
      blackHoleEngine.update(0.05);
      expect(blackHoleEngine.getState().pulsePhase).toBeGreaterThan(prevPhase);
      expect(() => blackHoleEngine.triggerChirpAudio()).not.toThrow();
      expect(() => blackHoleEngine.resetDefaults()).not.toThrow();
    });

    it('負能量衝擊波歸零時蟲洞喉管應關閉且保真度驟降', () => {
      blackHoleEngine.setNegativeEnergyFlux(0.0);
      const state = blackHoleEngine.getState();
      expect(state.wormholeThroatRadiusNm).toBe(0.0);
      expect(state.teleportationFidelity).toBeLessThan(0.1);
      expect(state.qubitStateTransferred).toBe(false);
    });
  });

  describe('4. 自旋軌道耦合分形外爾時間晶體引擎 (SocFractalWeylTimeCrystalEngine)', () => {
    it('應正確初始化 4T 週期四倍化次諧波時間晶體與分形維度', () => {
      const state = timeCrystalEngine.getState();
      expect(state.subharmonicPeriodMultiple).toBe(4);
      expect(state.fractalHausdorffDim).toBeGreaterThan(2.0);
      expect(state.timeCrystalRigidityIndex).toBeGreaterThan(0.8);
      expect(state.fourierSpectrumSeries.length).toBe(64);
    });

    it('調整 SOC 強度與翻轉微擾 ε 應影響拓撲剛性指數與頻譜峰值', () => {
      timeCrystalEngine.setSocStrength(35.0);
      timeCrystalEngine.setPerturbationEpsilon(0.02);
      const state = timeCrystalEngine.getState();
      expect(state.socStrengthLambda).toBe(35.0);
      expect(state.perturbationEpsilon).toBe(0.02);
      expect(state.activeRegime).toBe('hofstadter-fractal-topological-rigid');
      expect(state.fourierSubharmonicPeakDb).toBeGreaterThan(0);
    });

    it('翻轉脈衝微擾過大時時間晶體應退化為熱化遍歷相', () => {
      timeCrystalEngine.setPerturbationEpsilon(0.24);
      const state = timeCrystalEngine.getState();
      expect(state.timeCrystalRigidityIndex).toBeLessThan(0.2);
      expect(state.activeRegime).toBe('thermalized-ergodic');
    });

    it('調整分形遞歸深度 (1~5) 應更新豪斯多夫分形維度 d_f', () => {
      timeCrystalEngine.setFractalRecursionDepth(5);
      expect(timeCrystalEngine.getState().fractalHausdorffDim).toBeGreaterThan(2.5);
      timeCrystalEngine.setFractalRecursionDepth(1);
      expect(timeCrystalEngine.getState().fractalHausdorffDim).toBeLessThan(2.5);
    });

    it('時間步進應驅動序參量次諧波振盪並記錄歷史時間軌跡', () => {
      timeCrystalEngine.update(0.1);
      const state = timeCrystalEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(0);
      expect(state.magnetizationTrajectory.length).toBeGreaterThan(0);
      expect(() => timeCrystalEngine.triggerChirpAudio()).not.toThrow();
      expect(() => timeCrystalEngine.resetDefaults()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 48 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 208 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(208);
    });

    it('應包含 Part 48 的 4 項全新成就並可順利解鎖', () => {
      const p48AchievementIds = [
        'fractional_hall_stripe_liquid_crystal',
        'weyl_superconducting_diode_network',
        'micro_black_hole_teleportation',
        'soc_fractal_weyl_time_crystal',
      ];

      for (const id of p48AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
