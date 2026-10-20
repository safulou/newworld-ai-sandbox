import { describe, it, expect, beforeEach } from 'vitest';
import { AltermagneticChiralSpinSplitterEngine } from '../altermagneticChiralSpinSplitter';
import { RydbergTopologicalSpinLiquidArrayEngine } from '../rydbergTopologicalSpinLiquidArray';
import { AxionQuarkNuggetDarkMatterResonatorEngine } from '../axionQuarkNuggetDarkMatterResonator';
import { TopologicalEulerClassMetamaterialEngine } from '../topologicalEulerClassMetamaterial';
import { achievements } from '../achievements';

describe('Part 54: 交錯磁性體手性自旋分光器、里德堡光鑷拓撲自旋液體陣列、軸子夸克團塊暗物質磁層諧振器與拓撲歐拉類多能隙超材料測試', () => {
  let altermagnetEngine: AltermagneticChiralSpinSplitterEngine;
  let rydbergEngine: RydbergTopologicalSpinLiquidArrayEngine;
  let aqnEngine: AxionQuarkNuggetDarkMatterResonatorEngine;
  let eulerEngine: TopologicalEulerClassMetamaterialEngine;

  beforeEach(() => {
    altermagnetEngine = new AltermagneticChiralSpinSplitterEngine();
    rydbergEngine = new RydbergTopologicalSpinLiquidArrayEngine();
    aqnEngine = new AxionQuarkNuggetDarkMatterResonatorEngine();
    eulerEngine = new TopologicalEulerClassMetamaterialEngine();
  });

  describe('1. 交錯磁性體手性自旋分光器與非互易自旋波二極體引擎 (AltermagneticChiralSpinSplitterEngine)', () => {
    it('應正確初始化 d-wave 多極階數、交換劈裂能、自旋分光角與 16 個動量空間費米瓣節點', () => {
      const state = altermagnetEngine.getState();
      expect(state.harmonicMultipoleOrderN).toBe(2);
      expect(state.exchangeSplittingEv).toBe(0.85);
      expect(state.fermiLobeNodes.length).toBe(16);
      expect(state.spinSplitterAngleDeg).toBeGreaterThan(20);
      expect(state.chiralMagnonSplittingThz).toBeGreaterThan(4.0);
    });

    it('調高多極階數、交換劈裂能與最佳奈爾取向角應提升手性磁振子劈裂與二極體整流比', () => {
      altermagnetEngine.setMultipoleOrder(6);
      altermagnetEngine.setExchangeSplitting(1.50);
      altermagnetEngine.setNeelVectorAngle(45.0);
      const state = altermagnetEngine.getState();
      expect(state.harmonicMultipoleOrderN).toBe(6);
      expect(state.spinSplitterAngleDeg).toBeGreaterThan(35);
      expect(state.chiralMagnonSplittingThz).toBeGreaterThan(9.0);
      expect(state.magnonDiodeRectificationRatio).toBeGreaterThan(0.9);
    });

    it('切換體制應設定對應的共線反鐵磁、d-wave、g-wave 或 i-wave 交錯磁體相', () => {
      altermagnetEngine.setRegime('collinear-afm-degenerate');
      let state = altermagnetEngine.getState();
      expect(state.activeRegime).toBe('collinear-afm-degenerate');
      expect(state.exchangeSplittingEv).toBe(0.08);

      altermagnetEngine.setRegime('i-wave-chiral-magnon-diode');
      state = altermagnetEngine.getState();
      expect(state.activeRegime).toBe('i-wave-chiral-magnon-diode');
      expect(state.harmonicMultipoleOrderN).toBe(6);
    });

    it('時間步進 update 應平滑推進相位並更新動量空間自旋極化瓣座標', () => {
      const prevPhase = altermagnetEngine.getState().pulsePhase;
      altermagnetEngine.update(0.05);
      const state = altermagnetEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.fermiLobeNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發交錯磁自旋分光音效與重設應安全不拋出異常', () => {
      expect(() => altermagnetEngine.triggerAltermagneticSound()).not.toThrow();
      expect(() => altermagnetEngine.reset()).not.toThrow();
    });
  });

  describe('2. 里德堡光鑷陣列非阿貝爾拓撲自旋液體與共振價鍵干涉儀引擎 (RydbergTopologicalSpinLiquidArrayEngine)', () => {
    it('應正確初始化里德堡阻塞比、歸一化失諧、Fredenhagen-Marcu 序參量與 18 個二聚體節點', () => {
      const state = rydbergEngine.getState();
      expect(state.blockadeRatioRbOverA).toBe(1.68);
      expect(state.normalizedDetuningDeltaOmega).toBe(1.85);
      expect(state.dimerNodes.length).toBe(18);
      expect(state.fredenhagenMarcuOrder).toBeGreaterThan(0.7);
      expect(state.wilsonLoopParityExpectation).toBeGreaterThan(0.7);
    });

    it('偏離紅寶石晶格阻塞窗口應降低拓撲序參量，進入阻塞窗口則最大化拓撲糾纏熵', () => {
      rydbergEngine.setBlockadeRatio(1.15);
      rydbergEngine.setNormalizedDetuning(-0.5);
      let state = rydbergEngine.getState();
      expect(state.fredenhagenMarcuOrder).toBeLessThan(0.25);

      rydbergEngine.setBlockadeRatio(1.72);
      rydbergEngine.setNormalizedDetuning(2.1);
      rydbergEngine.setRabiFrequency(9.0);
      state = rydbergEngine.getState();
      expect(state.fredenhagenMarcuOrder).toBeGreaterThan(0.85);
      expect(state.topologicalEntanglementGamma).toBeGreaterThan(0.85);
    });

    it('切換體制應設定對應的無序單體、VBS 結晶或非阿貝爾磁通子編織自旋液體相', () => {
      rydbergEngine.setRegime('disordered-paramagnetic-monomer');
      let state = rydbergEngine.getState();
      expect(state.activeRegime).toBe('disordered-paramagnetic-monomer');
      expect(state.blockadeRatioRbOverA).toBe(1.18);

      rydbergEngine.setRegime('non-abelian-vison-braiding-liquid');
      state = rydbergEngine.getState();
      expect(state.activeRegime).toBe('non-abelian-vison-braiding-liquid');
      expect(state.topologicalEntanglementGamma).toBeGreaterThan(1.1);
    });

    it('時間步進 update 應推動紅寶石晶格二聚體共振相位演化', () => {
      const prevPhase = rydbergEngine.getState().pulsePhase;
      rydbergEngine.update(0.06);
      const state = rydbergEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.dimerNodes[1].x).toBeGreaterThan(0);
    });

    it('觸發里德堡二聚體音效與重設應安全不拋出異常', () => {
      expect(() => rydbergEngine.triggerRydbergArraySound()).not.toThrow();
      expect(() => rydbergEngine.reset()).not.toThrow();
    });
  });

  describe('3. 相對論性軸子夸克團塊暗物質磁層諧振與反物質電離層湮滅引擎 (AxionQuarkNuggetDarkMatterResonatorEngine)', () => {
    it('應正確初始化重子荷對數、軸子質量、511 keV 湮滅通量與 16 個電離層射電噴流節點', () => {
      const state = aqnEngine.getState();
      expect(state.baryonChargeLog10B).toBe(26.2);
      expect(state.axionMassMicroEv).toBe(65.0);
      expect(state.jetNodes.length).toBe(16);
      expect(state.annihilation511KevFlux).toBeGreaterThan(50);
      expect(state.cflColorSuperconductingGapMev).toBeGreaterThan(95);
    });

    it('調高重子荷、軸子質量與磁層磁場應大幅提升 511 keV 通量與 Primakoff 射電功率', () => {
      aqnEngine.setBaryonChargeLog10(28.0);
      aqnEngine.setAxionMassMicroEv(200.0);
      aqnEngine.setMagnetosphereField(42.0);
      const state = aqnEngine.getState();
      expect(state.baryonChargeLog10B).toBe(28.0);
      expect(state.annihilation511KevFlux).toBeGreaterThan(1000);
      expect(state.primakoffRadioPowerMw).toBeGreaterThan(1500);
      expect(state.cflColorSuperconductingGapMev).toBeGreaterThan(135);
    });

    it('切換體制應設定對應的星際休眠、正電子球激發或 CFL 核心全功率湮滅相', () => {
      aqnEngine.setRegime('dormant-interstellar-aqn');
      let state = aqnEngine.getState();
      expect(state.activeRegime).toBe('dormant-interstellar-aqn');
      expect(state.baryonChargeLog10B).toBe(24.5);

      aqnEngine.setRegime('cfl-core-antimatter-annihilation-surge');
      state = aqnEngine.getState();
      expect(state.activeRegime).toBe('cfl-core-antimatter-annihilation-surge');
      expect(state.baryonChargeLog10B).toBe(28.2);
    });

    it('時間步進 update 應推動正電子電離層與軸子疇壁相位演化', () => {
      const prevPhase = aqnEngine.getState().pulsePhase;
      aqnEngine.update(0.05);
      const state = aqnEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.jetNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發夸克團塊諧振音效與重設應安全不拋出異常', () => {
      expect(() => aqnEngine.triggerAqnResonanceSound()).not.toThrow();
      expect(() => aqnEngine.reset()).not.toThrow();
    });
  });

  describe('4. 拓撲歐拉類多能隙超材料與非阿貝爾四元數節點編織引擎 (TopologicalEulerClassMetamaterialEngine)', () => {
    it('應正確初始化區塊歐拉類 χ_D = 2、編織應變度、湮滅阻挫能壘與 12 個四元數能帶節點', () => {
      const state = eulerEngine.getState();
      expect(state.patchEulerInvariantChi).toBe(2);
      expect(state.braidingStrainPercent).toBe(3.2);
      expect(state.bandNodes.length).toBe(12);
      expect(state.annihilationBarrierMev).toBeGreaterThan(30);
      expect(state.bandNodes[0].isAnnihilationProtected).toBe(true);
    });

    it('設定零歐拉類應消除湮滅阻挫能壘，調高至 χ_D = 4 則大幅提升能壘與邊界波導增益', () => {
      eulerEngine.setPatchEulerInvariant(0);
      let state = eulerEngine.getState();
      expect(state.patchEulerInvariantChi).toBe(0);
      expect(state.annihilationBarrierMev).toBe(0.0);
      expect(state.bandNodes[0].isAnnihilationProtected).toBe(false);

      eulerEngine.setPatchEulerInvariant(4);
      eulerEngine.setBraidingStrain(5.2);
      eulerEngine.setIntergapCoupling(14.0);
      state = eulerEngine.getState();
      expect(state.patchEulerInvariantChi).toBe(4);
      expect(state.annihilationBarrierMev).toBeGreaterThan(120);
      expect(state.edgeAcousticTransmissionDb).toBeGreaterThan(50);
    });

    it('切換體制應設定對應的平庸零歐拉態、Stiefel-Whitney 偶極或高階四元數晶格相', () => {
      eulerEngine.setRegime('trivial-zero-euler-annihilated');
      let state = eulerEngine.getState();
      expect(state.activeRegime).toBe('trivial-zero-euler-annihilated');
      expect(state.patchEulerInvariantChi).toBe(0);

      eulerEngine.setRegime('high-euler-quaternionic-meron-lattice');
      state = eulerEngine.getState();
      expect(state.activeRegime).toBe('high-euler-quaternionic-meron-lattice');
      expect(state.patchEulerInvariantChi).toBe(4);
    });

    it('時間步進 update 應推動相鄰能隙四元數節點動量空間編織軌跡演化', () => {
      const prevPhase = eulerEngine.getState().pulsePhase;
      eulerEngine.update(0.05);
      const state = eulerEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.bandNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發歐拉類四元數編織音效與重設應安全不拋出異常', () => {
      expect(() => eulerEngine.triggerEulerBraidingSound()).not.toThrow();
      expect(() => eulerEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 54 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 232 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(232);
    });

    it('應包含 Part 54 的 4 項全新成就並可順利解鎖', () => {
      const p54AchievementIds = [
        'altermagnetic_chiral_spin_splitter',
        'rydberg_topological_spin_liquid',
        'axion_quark_nugget_resonator',
        'topological_euler_class_metamaterial',
      ];

      for (const id of p54AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
