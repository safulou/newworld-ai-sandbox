import { describe, it, expect, beforeEach } from 'vitest';
import { NonHermitianHopfSkinInsulatorEngine } from '../nonHermitianHopfSkinInsulator';
import { FractalQuantumSpinLiquidInterferometerEngine } from '../fractalQuantumSpinLiquidInterferometer';
import { GravitationalAlfvenSolitonResonatorEngine } from '../gravitationalAlfvenSolitonResonator';
import { BoseFermiExcitonSupersolidRotorEngine } from '../boseFermiExcitonSupersolidRotor';
import { achievements } from '../achievements';

describe('Part 52: 非厄米霍普夫皮膚渦旋、碎形量子自旋液體、相對論引力波阿爾文孤子與玻色-費米激子超固體測試', () => {
  let hopfSkinEngine: NonHermitianHopfSkinInsulatorEngine;
  let fractalQslEngine: FractalQuantumSpinLiquidInterferometerEngine;
  let alfvenEngine: GravitationalAlfvenSolitonResonatorEngine;
  let supersolidEngine: BoseFermiExcitonSupersolidRotorEngine;

  beforeEach(() => {
    hopfSkinEngine = new NonHermitianHopfSkinInsulatorEngine();
    fractalQslEngine = new FractalQuantumSpinLiquidInterferometerEngine();
    alfvenEngine = new GravitationalAlfvenSolitonResonatorEngine();
    supersolidEngine = new BoseFermiExcitonSupersolidRotorEngine();
  });

  describe('1. 非厄米奇異環霍普夫絕緣體與高階皮膚渦旋反應器引擎 (NonHermitianHopfSkinInsulatorEngine)', () => {
    it('應正確初始化霍普夫環繞數、奇異環半徑、趨膚局域化長度與 16 個皮膚渦旋節點', () => {
      const state = hopfSkinEngine.getState();
      expect(state.hopfLinkingNumberWh).toBe(2);
      expect(state.nonReciprocalGamma).toBe(0.65);
      expect(state.nodes.length).toBe(16);
      expect(state.exceptionalRingRadiusNmInv).toBeGreaterThan(0.3);
      expect(state.skinLocalizationXiNm).toBeGreaterThan(1.0);
      expect(state.cornerSkinDensity).toBeGreaterThan(20);
    });

    it('調高非互易趨膚參數與增益損耗應縮減局域化長度並提升頂角皮膚密度與編織指數', () => {
      hopfSkinEngine.setHopfLinkingNumber(4);
      hopfSkinEngine.setNonReciprocalGamma(1.35);
      hopfSkinEngine.setGainLossParameter(32.0);
      const state = hopfSkinEngine.getState();
      expect(state.hopfLinkingNumberWh).toBe(4);
      expect(state.nonReciprocalGamma).toBe(1.35);
      expect(state.complexBraidingIndex).toBeGreaterThanOrEqual(8);
      expect(state.cornerSkinDensity).toBeGreaterThan(80);
      expect(state.skinLocalizationXiNm).toBeLessThan(3.0);
    });

    it('切換體制應設定對應的非厄米霍普夫與高階皮膚相', () => {
      hopfSkinEngine.setRegime('hermitian-hopf-link');
      let state = hopfSkinEngine.getState();
      expect(state.activeRegime).toBe('hermitian-hopf-link');
      expect(state.hopfLinkingNumberWh).toBe(1);

      hopfSkinEngine.setRegime('complex-braiding-vortex-collapse');
      state = hopfSkinEngine.getState();
      expect(state.activeRegime).toBe('complex-braiding-vortex-collapse');
      expect(state.hopfLinkingNumberWh).toBe(4);
      expect(state.gainLossParameterMev).toBe(36.0);
    });

    it('時間步進 update 應平滑推進相位並更新節點複數相位角', () => {
      const prevPhase = hopfSkinEngine.getState().pulsePhase;
      hopfSkinEngine.update(0.05);
      const state = hopfSkinEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.nodes[0].x).toBeGreaterThan(0);
    });

    it('觸發非厄米編織音效與重設應安全不拋出異常', () => {
      expect(() => hopfSkinEngine.triggerHopfSkinSound()).not.toThrow();
      expect(() => hopfSkinEngine.reset()).not.toThrow();
    });
  });

  describe('2. 分數維度碎形量子自旋液體與任意子對偶全息干涉儀引擎 (FractalQuantumSpinLiquidInterferometerEngine)', () => {
    it('應正確初始化豪斯多夫維度、譜維度、拓撲糾纏熵與 15 個謝爾賓斯基碎形格點', () => {
      const state = fractalQslEngine.getState();
      expect(state.hausdorffDimensionDh).toBe(1.585);
      expect(state.sites.length).toBe(15);
      expect(state.spectralDimensionDs).toBeGreaterThan(1.2);
      expect(state.topologicalEntanglementGamma).toBeGreaterThan(0.3);
      expect(state.anyonInterferenceVisibility).toBeGreaterThan(0.1);
    });

    it('調整豪斯多夫維度、Kitaev 交換耦合與磁通子數應更新拓撲糾纏熵與干涉可見度', () => {
      fractalQslEngine.setHausdorffDimension(1.88);
      fractalQslEngine.setKitaevExchange(42.0);
      fractalQslEngine.setVisonVortexCount(8);
      const state = fractalQslEngine.getState();
      expect(state.hausdorffDimensionDh).toBe(1.88);
      expect(state.kitaevExchangeJMeV).toBe(42.0);
      expect(state.visonVortexCount).toBe(8);
      expect(state.topologicalEntanglementGamma).toBeGreaterThan(1.0);
      expect(state.spectralDimensionDs).toBeGreaterThan(1.4);
    });

    it('切換體制應設定對應的碎形自旋液體與任意子編織相', () => {
      fractalQslEngine.setRegime('abelian-toric-code-phase');
      let state = fractalQslEngine.getState();
      expect(state.activeRegime).toBe('abelian-toric-code-phase');
      expect(state.visonVortexCount).toBe(2);

      fractalQslEngine.setRegime('non-abelian-ising-anyon-braiding');
      state = fractalQslEngine.getState();
      expect(state.activeRegime).toBe('non-abelian-ising-anyon-braiding');
      expect(state.visonVortexCount).toBe(7);
    });

    it('時間步進 update 應推動巡遊馬約拉納密度與任意子相位演化', () => {
      const prevPhase = fractalQslEngine.getState().pulsePhase;
      fractalQslEngine.update(0.06);
      const state = fractalQslEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.sites[0].majoranaDensity).toBeGreaterThan(0);
    });

    it('觸發碎形自旋液體音效與重設應安全不拋出異常', () => {
      expect(() => fractalQslEngine.triggerFractalQslSound()).not.toThrow();
      expect(() => fractalQslEngine.reset()).not.toThrow();
    });
  });

  describe('3. 相對論性引力波磁流體阿爾文孤子共振腔引擎 (GravitationalAlfvenSolitonResonatorEngine)', () => {
    it('應正確初始化引力波應變、磁化參數、相對論阿爾文波速比與 18 個波前節點', () => {
      const state = alfvenEngine.getState();
      expect(state.gwStrainLog10).toBe(-18.5);
      expect(state.magnetizationSigma).toBe(14.0);
      expect(state.waveNodes.length).toBe(18);
      expect(state.alfvenVelocityRatioC).toBeGreaterThan(0.9);
      expect(state.gertsenshteinConversionPct).toBeGreaterThan(10);
    });

    it('提升引力波應變、磁化參數與馬赫數應提高阿爾文波速比、轉換率與坡印廷光度', () => {
      alfvenEngine.setGwStrainLog10(-16.5);
      alfvenEngine.setMagnetizationSigma(40.0);
      alfvenEngine.setSolitonMachNumber(4.2);
      const state = alfvenEngine.getState();
      expect(state.gwStrainLog10).toBe(-16.5);
      expect(state.alfvenVelocityRatioC).toBeGreaterThan(0.98);
      expect(state.gertsenshteinConversionPct).toBeGreaterThan(50);
      expect(state.poyntingFluxLuminosity).toBeGreaterThan(120);
    });

    it('切換體制應設定對應的 GRMHD 孤子與 FRB 激波相', () => {
      alfvenEngine.setRegime('linear-alfven-gw-dispersion');
      let state = alfvenEngine.getState();
      expect(state.activeRegime).toBe('linear-alfven-gw-dispersion');
      expect(state.magnetizationSigma).toBe(2.0);

      alfvenEngine.setRegime('relativistic-frb-poynting-shock');
      state = alfvenEngine.getState();
      expect(state.activeRegime).toBe('relativistic-frb-poynting-shock');
      expect(state.solitonMachNumber).toBe(4.4);
    });

    it('時間步進 update 應推動 DNLS 孤子包絡傳播', () => {
      const prevPhase = alfvenEngine.getState().pulsePhase;
      alfvenEngine.update(0.05);
      const state = alfvenEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.waveNodes[8].solitonEnvelope).toBeGreaterThan(0);
    });

    it('觸發阿爾文孤子音效與重設應安全不拋出異常', () => {
      expect(() => alfvenEngine.triggerAlfvenSolitonSound()).not.toThrow();
      expect(() => alfvenEngine.reset()).not.toThrow();
    });
  });

  describe('4. 超流玻色-費米混合拓撲激子超固體轉子引擎 (BoseFermiExcitonSupersolidRotorEngine)', () => {
    it('應正確初始化偶極耦合、費米面嵌套、旋子能隙、NCRI 超流分數與 13 個激子液滴', () => {
      const state = supersolidEngine.getState();
      expect(state.dipolarCouplingDd).toBe(42.0);
      expect(state.fermiSurfaceNestingKf).toBe(1.85);
      expect(state.droplets.length).toBe(13);
      expect(state.ncriSuperfluidFractionFs).toBeGreaterThan(0.2);
      expect(state.crystalModulationContrast).toBeGreaterThan(0.4);
    });

    it('調高偶極耦合與費米面嵌套應軟化旋子能隙並提高超固體晶格對比度', () => {
      supersolidEngine.setDipolarCoupling(75.0);
      supersolidEngine.setFermiSurfaceNesting(3.2);
      supersolidEngine.setSyntheticRotation(18.0);
      const state = supersolidEngine.getState();
      expect(state.dipolarCouplingDd).toBe(75.0);
      expect(state.rotonEnergyGapMev).toBeLessThan(0.5);
      expect(state.crystalModulationContrast).toBeGreaterThan(0.85);
      expect(state.droplets[0].hasInterstitialVortex).toBe(true);
    });

    it('切換體制應切換至對應的激子超固體相', () => {
      supersolidEngine.setRegime('normal-exciton-fermi-liquid');
      let state = supersolidEngine.getState();
      expect(state.activeRegime).toBe('normal-exciton-fermi-liquid');
      expect(state.dipolarCouplingDd).toBe(10.0);

      supersolidEngine.setRegime('topological-vortex-supersolid-crystal');
      state = supersolidEngine.getState();
      expect(state.activeRegime).toBe('topological-vortex-supersolid-crystal');
      expect(state.syntheticRotationOmega).toBe(21.5);
    });

    it('時間步進 update 應推動六角超固體轉子旋轉與超流相位演化', () => {
      const prevPhase = supersolidEngine.getState().pulsePhase;
      supersolidEngine.update(0.06);
      const state = supersolidEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.droplets[1].x).toBeGreaterThan(0);
    });

    it('觸發超固體雙模音效與重設應安全不拋出異常', () => {
      expect(() => supersolidEngine.triggerSupersolidSound()).not.toThrow();
      expect(() => supersolidEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 52 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 224 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(224);
    });

    it('應包含 Part 52 的 4 項全新成就並可順利解鎖', () => {
      const p52AchievementIds = [
        'non_hermitian_hopf_skin',
        'fractal_quantum_spin_liquid',
        'gravitational_alfven_soliton',
        'bose_fermi_exciton_supersolid',
      ];

      for (const id of p52AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
