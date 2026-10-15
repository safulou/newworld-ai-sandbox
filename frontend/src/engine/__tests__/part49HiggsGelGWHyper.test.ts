import { describe, it, expect, beforeEach } from 'vitest';
import { NonHermitianAbelianHiggsEngine } from '../nonHermitianAbelianHiggsString';
import { DynamicalSpinPolaronBoseGelEngine } from '../dynamicalSpinPolaronBoseGel';
import { HolographicGravitationalWaveAntennaEngine } from '../holographicGravitationalWaveAntenna';
import { FourDTopologicalHyperCrystalEngine } from '../fourDTopologicalHyperCrystal';
import { achievements } from '../achievements';

describe('Part 49: 非厄米希格斯弦、動態自旋極化膠體、全息奇異引力波、四維陳晶子系統測試', () => {
  let higgsEngine: NonHermitianAbelianHiggsEngine;
  let gelEngine: DynamicalSpinPolaronBoseGelEngine;
  let gwEngine: HolographicGravitationalWaveAntennaEngine;
  let hyperEngine: FourDTopologicalHyperCrystalEngine;

  beforeEach(() => {
    higgsEngine = new NonHermitianAbelianHiggsEngine();
    gelEngine = new DynamicalSpinPolaronBoseGelEngine();
    gwEngine = new HolographicGravitationalWaveAntennaEngine();
    hyperEngine = new FourDTopologicalHyperCrystalEngine();
  });

  describe('1. 非厄米阿貝爾-希格斯弦拓撲渦旋網絡引擎 (NonHermitianAbelianHiggsEngine)', () => {
    it('應正確初始化希格斯真空期望值、宇宙弦張力與渦旋節點陣列', () => {
      const state = higgsEngine.getState();
      expect(state.higgsVevGev).toBe(2.4);
      expect(state.stringTensionGev2).toBeGreaterThan(10);
      expect(state.vortices.length).toBe(6);
      expect(state.vortexWindingN).toBe(2);
    });

    it('調整非厄米耗散率 γ_NH 應改變趨膚局域化係數與奇異點接近度', () => {
      higgsEngine.setNhDissipation(0.707); // 奇異點臨界值
      const state = higgsEngine.getState();
      expect(state.nhDissipationRate).toBeCloseTo(0.707, 3);
      expect(state.exceptionalPointProximity).toBeGreaterThan(0.9);
      expect(state.skinLocalizationFactor).toBeGreaterThan(0.5);
    });

    it('切換體制應設定對應的 GL 參數與卷繞數', () => {
      higgsEngine.setRegime('abelian-superconducting-vortex');
      let state = higgsEngine.getState();
      expect(state.activeRegime).toBe('abelian-superconducting-vortex');
      expect(state.nhDissipationRate).toBe(0.05);

      higgsEngine.setRegime('cosmic-string-reconnection');
      state = higgsEngine.getState();
      expect(state.activeRegime).toBe('cosmic-string-reconnection');
      expect(state.vortexWindingN).toBe(4);
    });

    it('時間步進 update 應平滑推進 pulsePhase 並更新渦旋節點座標', () => {
      const prevPhase = higgsEngine.getState().pulsePhase;
      higgsEngine.update(0.05);
      const state = higgsEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.vortices[0].x).toBeGreaterThan(0);
    });

    it('觸發音效與重設應安全不拋出異常', () => {
      expect(() => higgsEngine.triggerChirpSound()).not.toThrow();
      expect(() => higgsEngine.reset()).not.toThrow();
      expect(higgsEngine.getState().higgsVevGev).toBe(2.4);
    });
  });

  describe('2. 動態自旋極化子玻色凝聚膠體引擎 (DynamicalSpinPolaronBoseGelEngine)', () => {
    it('應正確初始化自旋-聲子耦合強度、膠體密度與複數剪切模量', () => {
      const state = gelEngine.getState();
      expect(state.spinPhononCouplingG).toBe(1.6);
      expect(state.gelDensity1e18).toBe(5.2);
      expect(state.storageModulusGPrimeKPa).toBeGreaterThan(0);
      expect(state.lossModulusGDoublePrimeKPa).toBeGreaterThan(0);
      expect(state.clusters.length).toBe(7);
    });

    it('調整耦合常數與頻率應重整化有效質量並計算黏彈損耗因子', () => {
      gelEngine.setSpinPhononCoupling(2.5);
      gelEngine.setShearFrequency(90);
      const state = gelEngine.getState();
      expect(state.effectiveMassRatio).toBeGreaterThan(8.0);
      expect(state.lossFactorTanDelta).toBeGreaterThan(0);
      expect(state.storageModulusGPrimeKPa).toBeGreaterThan(state.lossModulusGDoublePrimeKPa);
    });

    it('切換體制應適配極化子相變參數', () => {
      gelEngine.setRegime('coherent-supersolid-gel');
      let state = gelEngine.getState();
      expect(state.activeRegime).toBe('coherent-supersolid-gel');
      expect(state.spinPhononCouplingG).toBe(2.4);

      gelEngine.setRegime('polaron-fermi-liquid');
      state = gelEngine.getState();
      expect(state.activeRegime).toBe('polaron-fermi-liquid');
      expect(state.spinPhononCouplingG).toBe(0.4);
    });

    it('調整膠體密度應線性增強自旋極化率與儲能模量', () => {
      gelEngine.setGelDensity(8.0);
      const state = gelEngine.getState();
      expect(state.gelDensity1e18).toBe(8.0);
      expect(state.spinPolarizabilityChi).toBeGreaterThan(6.0);
      expect(state.clusters[0].radius).toBeGreaterThan(8.0);
    });

    it('動態 update 應更新骨架應變振幅與自旋極化度', () => {
      gelEngine.update(0.1);
      const state = gelEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(0);
      expect(state.clusters[0].strainAmplitude).toBeGreaterThan(0);
      expect(() => gelEngine.triggerGelResonanceSound()).not.toThrow();
      expect(() => gelEngine.reset()).not.toThrow();
    });
  });

  describe('3. 全息引力波奇異偏振探測天線引擎 (HolographicGravitationalWaveAntennaEngine)', () => {
    it('應正確初始化 6 大偏振模式（含張量、呼吸純量、剪切向量模）', () => {
      const state = gwEngine.getState();
      expect(state.patterns.length).toBe(6);
      expect(state.strainHPlus).toBeGreaterThan(0);
      expect(state.strainHBreathing).toBeGreaterThan(0);
      expect(state.holographicSnrDb).toBeGreaterThan(20);
    });

    it('調整奇異偏振比率與傾角應重構引力應變分量與全息信噪比', () => {
      gwEngine.setExoticRatio(0.85);
      gwEngine.setSkyInclination(60);
      const state = gwEngine.getState();
      expect(state.exoticPolarizationRatio).toBe(0.85);
      expect(state.strainHBreathing).toBeGreaterThan(state.strainHCross);
      expect(state.holographicSnrDb).toBeGreaterThan(30);
    });

    it('共振腔品質因數 log10(Q) 應顯著增益全息信噪比 SNR', () => {
      gwEngine.setCavityQuality(6.8);
      const snrHigh = gwEngine.getState().holographicSnrDb;
      gwEngine.setCavityQuality(4.2);
      const snrLow = gwEngine.getState().holographicSnrDb;
      expect(snrHigh).toBeGreaterThan(snrLow);
    });

    it('切換至全六偏振極限相應具有高光學品質與極限應變響應', () => {
      gwEngine.setRegime('full-six-polarization-extreme');
      const state = gwEngine.getState();
      expect(state.activeRegime).toBe('full-six-polarization-extreme');
      expect(state.cavityQualityLogQ).toBe(6.9);
      expect(state.exoticPolarizationRatio).toBe(0.95);
    });

    it('時間推進 update 應週期性調製偏振四極矩受激形變橢圓軸比', () => {
      gwEngine.update(0.1);
      const state = gwEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(0);
      expect(state.patterns[2].type).toBe('scalar');
      expect(() => gwEngine.triggerChirpSound()).not.toThrow();
      expect(() => gwEngine.reset()).not.toThrow();
    });
  });

  describe('4. 四維拓撲絕緣體二階陳數超幾何晶體引擎 (FourDTopologicalHyperCrystalEngine)', () => {
    it('應正確生成超立方體 16 個 4D 頂點與 32 條超幾何邊', () => {
      const state = hyperEngine.getState();
      expect(state.vertices.length).toBe(16);
      expect(state.edges.length).toBe(32);
      expect(state.secondChernNumberC2).toBe(1);
      expect(state.berryCurvatureFlux).toBeGreaterThan(70);
    });

    it('調控狄拉克質量 M₄ 應引發二階陳數相變 (C₂ = 0, 1, 2)', () => {
      // 平庸相 |M| > 2
      hyperEngine.setDiracMass(2.4);
      let state = hyperEngine.getState();
      expect(state.secondChernNumberC2).toBe(0);
      expect(state.berryCurvatureFlux).toBe(0);

      // 單二階拓撲相 0 < M < 2
      hyperEngine.setDiracMass(1.2);
      state = hyperEngine.getState();
      expect(state.secondChernNumberC2).toBe(1);

      // 雙重二階超幾何相 -2 < M < 0
      hyperEngine.setDiracMass(-1.1);
      state = hyperEngine.getState();
      expect(state.secondChernNumberC2).toBe(2);
      expect(state.nonLinearHallConductance).toBe(2);
    });

    it('四維 SO(4) 超空間旋轉應更新 2D 投影座標', () => {
      const origProjX = hyperEngine.getState().vertices[0].projX;
      hyperEngine.setHyperRotation(120);
      const newProjX = hyperEngine.getState().vertices[0].projX;
      expect(newProjX).not.toBe(origProjX);
    });

    it('時間步進 update 應平滑轉動超立方體投影', () => {
      hyperEngine.update(0.1);
      const state = hyperEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(0);
      expect(() => hyperEngine.triggerHyperSound()).not.toThrow();
      expect(() => hyperEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 49 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 212 項終極里程碑', () => {
      expect(achievements.getAll().length).toBe(212);
    });

    it('應包含 Part 49 的 4 項全新成就並可順利解鎖', () => {
      const p49AchievementIds = [
        'non_hermitian_abelian_higgs_string',
        'dynamical_spin_polaron_bose_gel',
        'holographic_gravitational_wave_antenna',
        'four_d_topological_hyper_crystal',
      ];

      for (const id of p49AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
