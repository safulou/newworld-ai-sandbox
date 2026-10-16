import { describe, it, expect, beforeEach } from 'vitest';
import { NonAbelianFractalTopologicalSuperconductorEngine } from '../nonAbelianFractalTopologicalSuperconductor';
import { WeylChiralGravitationalFluidEngine } from '../weylChiralGravitationalFluid';
import { QuantumPolaritonTopologicalLatticeEngine } from '../quantumPolaritonTopologicalLattice';
import { SpinorSolitonColliderEngine } from '../spinorSolitonCollider';
import { achievements } from '../achievements';

describe('Part 50: 非阿貝爾分形高階拓撲超導、外爾手性引力異常流體、極化光子晶格、旋量孤子碰撞測試', () => {
  let fractalScEngine: NonAbelianFractalTopologicalSuperconductorEngine;
  let weylFluidEngine: WeylChiralGravitationalFluidEngine;
  let polaritonEngine: QuantumPolaritonTopologicalLatticeEngine;
  let solitonEngine: SpinorSolitonColliderEngine;

  beforeEach(() => {
    fractalScEngine = new NonAbelianFractalTopologicalSuperconductorEngine();
    weylFluidEngine = new WeylChiralGravitationalFluidEngine();
    polaritonEngine = new QuantumPolaritonTopologicalLatticeEngine();
    solitonEngine = new SpinorSolitonColliderEngine();
  });

  describe('1. 非阿貝爾分形高階拓撲超導體引擎 (NonAbelianFractalTopologicalSuperconductorEngine)', () => {
    it('應正確初始化超導能隙、SOC 強度、角隅模陣列與布洛赫球參數', () => {
      const state = fractalScEngine.getState();
      expect(state.pairingGapDelta).toBe(2.8);
      expect(state.socStrengthAlpha).toBe(28.0);
      expect(state.cornerModes.length).toBe(8);
      expect(state.cornerModes.filter(c => c.isExterior).length).toBe(4);
      expect(state.cornerModes.filter(c => !c.isExterior).length).toBe(4);
      expect(state.braidingFidelity).toBeGreaterThan(0.95);
    });

    it('調整超導配對能隙與自旋軌道耦合應改變角隅定域長度與編織保真度', () => {
      const initLoc = fractalScEngine.getState().cornerModeLocalizationNm;
      fractalScEngine.setPairingGap(4.5);
      fractalScEngine.setSocStrength(15.0);
      const state = fractalScEngine.getState();
      expect(state.pairingGapDelta).toBe(4.5);
      expect(state.socStrengthAlpha).toBe(15.0);
      expect(state.braidingFidelity).toBeGreaterThan(0.98);
      expect(state.cornerModeLocalizationNm).not.toBe(initLoc);
    });

    it('切換體制應設定對應的物理參數', () => {
      fractalScEngine.setRegime('trivial-fractal-metal');
      let state = fractalScEngine.getState();
      expect(state.activeRegime).toBe('trivial-fractal-metal');
      expect(state.pairingGapDelta).toBe(0.6);

      fractalScEngine.setRegime('non-abelian-braiding-qubit');
      state = fractalScEngine.getState();
      expect(state.activeRegime).toBe('non-abelian-braiding-qubit');
      expect(state.pairingGapDelta).toBe(4.2);
      expect(state.chemicalPotentialMu).toBe(0.02);
    });

    it('時間步進 update 應平滑推進 pulsePhase 並更新角隅波函數密度', () => {
      const prevPhase = fractalScEngine.getState().pulsePhase;
      fractalScEngine.update(0.05);
      const state = fractalScEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.cornerModes[0].wavefunctionDensity).toBeGreaterThan(0);
    });

    it('觸發編織音效與重設應安全不拋出異常', () => {
      expect(() => fractalScEngine.triggerBraidingSound()).not.toThrow();
      expect(() => fractalScEngine.reset()).not.toThrow();
    });
  });

  describe('2. 動態外爾手性引力異常流體引擎 (WeylChiralGravitationalFluidEngine)', () => {
    it('應正確初始化手性化學勢、渦度、溫度與流線採樣節點', () => {
      const state = weylFluidEngine.getState();
      expect(state.chiralChemicalPotentialMu5).toBe(18.5);
      expect(state.fluidVorticityOmega).toBe(45.0);
      expect(state.fluidTemperatureK).toBe(12.0);
      expect(state.streamlines.length).toBe(8);
      expect(state.chiralVorticalCurrent).toBeGreaterThan(0);
      expect(state.thermalHallConductivity).toBeGreaterThan(0);
    });

    it('調整手性化學勢、渦度與溫度應動態更新 CVE 電流、熱霍爾率與李雅普諾夫指數', () => {
      weylFluidEngine.setChiralPotential(30.0);
      weylFluidEngine.setVorticity(80.0);
      weylFluidEngine.setTemperature(35.0);
      const state = weylFluidEngine.getState();
      expect(state.chiralChemicalPotentialMu5).toBe(30.0);
      expect(state.fluidVorticityOmega).toBe(80.0);
      expect(state.fluidTemperatureK).toBe(35.0);
      expect(state.chiralVorticalCurrent).toBeGreaterThan(50);
      expect(state.thermalHallConductivity).toBeGreaterThan(5);
      expect(state.lyapunovExponent).toBeGreaterThan(4);
    });

    it('切換體制應設定相應的極限微觀環境', () => {
      weylFluidEngine.setRegime('laminar-weyl-gas');
      let state = weylFluidEngine.getState();
      expect(state.activeRegime).toBe('laminar-weyl-gas');
      expect(state.fluidVorticityOmega).toBe(5.0);

      weylFluidEngine.setRegime('fast-thermal-scrambling');
      state = weylFluidEngine.getState();
      expect(state.activeRegime).toBe('fast-thermal-scrambling');
      expect(state.chiralChemicalPotentialMu5).toBe(38.0);
      expect(state.fluidTemperatureK).toBe(48.0);
    });

    it('時間步進 update 應推進流線座標與局部曲率密度', () => {
      const prevPhase = weylFluidEngine.getState().pulsePhase;
      weylFluidEngine.update(0.04);
      const state = weylFluidEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.streamlines[0].vorticityMag).toBeGreaterThan(0);
    });

    it('觸發流體渦旋音效與重設應安全不拋出異常', () => {
      expect(() => weylFluidEngine.triggerVortexSound()).not.toThrow();
      expect(() => weylFluidEngine.reset()).not.toThrow();
    });
  });

  describe('3. 量子極化拓撲光子晶格引擎 (QuantumPolaritonTopologicalLatticeEngine)', () => {
    it('應正確初始化激子-光子失諧量、泵浦比、TE-TM 裂分與 12 個籠目頂點', () => {
      const state = polaritonEngine.getState();
      expect(state.cavityDetuningDelta).toBe(0.5);
      expect(state.pumpPowerRatioP).toBe(2.4);
      expect(state.teTmSplittingDeltaLt).toBe(2.8);
      expect(state.nodes.length).toBe(12);
      expect(state.nodes.filter(n => n.isFlatBandLocked).length).toBe(6);
      expect(state.polaritonLasingCoherence).toBeGreaterThan(0.7);
    });

    it('調整泵浦功率與 TE-TM 裂分應提升雷射相干度與手性邊緣流', () => {
      polaritonEngine.setPumpPowerRatio(4.5);
      polaritonEngine.setTeTmSplitting(4.8);
      polaritonEngine.setCavityDetuning(0.0);
      const state = polaritonEngine.getState();
      expect(state.pumpPowerRatioP).toBe(4.5);
      expect(state.teTmSplittingDeltaLt).toBe(4.8);
      expect(state.polaritonLasingCoherence).toBeGreaterThan(0.95);
      expect(state.chiralEdgeCurrent).toBeGreaterThan(0.9);
      expect(state.flatbandDispersionSlope).toBeLessThan(0.05);
    });

    it('切換體制應切換至正確的極化相', () => {
      polaritonEngine.setRegime('linear-photonic-kagome');
      let state = polaritonEngine.getState();
      expect(state.activeRegime).toBe('linear-photonic-kagome');
      expect(state.pumpPowerRatioP).toBe(0.4);

      polaritonEngine.setRegime('flatband-condensation-laser');
      state = polaritonEngine.getState();
      expect(state.activeRegime).toBe('flatband-condensation-laser');
      expect(state.pumpPowerRatioP).toBe(4.2);
    });

    it('時間步進 update 應推動節點光場強度與擬自旋進動角', () => {
      const prevPhase = polaritonEngine.getState().pulsePhase;
      polaritonEngine.update(0.06);
      const state = polaritonEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.nodes[0].intensity).toBeGreaterThan(0);
    });

    it('觸發拓撲雷射音效與重設應安全不拋出異常', () => {
      expect(() => polaritonEngine.triggerLaserSound()).not.toThrow();
      expect(() => polaritonEngine.reset()).not.toThrow();
    });
  });

  describe('4. 旋量超流全息奇異孤子碰撞反應堆引擎 (SpinorSolitonColliderEngine)', () => {
    it('應正確初始化自旋交換相互作用 c₂、相對碰撞速度與雙孤子波包座標', () => {
      const state = solitonEngine.getState();
      expect(state.spinInteractionC2Hz).toBe(-6.5);
      expect(state.collisionVelocityRatio).toBe(0.85);
      expect(state.impactParameterUm).toBe(1.2);
      expect(state.packet.xLeft).toBeLessThan(state.packet.xRight);
      expect(state.holographicHorizonEntropyDelta).toBeGreaterThan(15);
    });

    it('調整相互作用、速度與衝擊參數應更新自旋進動率與全息視界熵增', () => {
      solitonEngine.setSpinInteraction(-15.0);
      solitonEngine.setCollisionVelocity(1.6);
      solitonEngine.setImpactParameter(0.5);
      const state = solitonEngine.getState();
      expect(state.spinInteractionC2Hz).toBe(-15.0);
      expect(state.collisionVelocityRatio).toBe(1.6);
      expect(state.impactParameterUm).toBe(0.5);
      expect(state.spinPrecessionRateHz).toBeGreaterThan(20);
      expect(state.holographicHorizonEntropyDelta).toBeGreaterThan(60);
    });

    it('切換體制應設定對應的極性或鐵磁碰撞條件', () => {
      solitonEngine.setRegime('polar-ground-fluid');
      let state = solitonEngine.getState();
      expect(state.activeRegime).toBe('polar-ground-fluid');
      expect(state.spinInteractionC2Hz).toBe(15.0); // 極性相 c2 > 0

      solitonEngine.setRegime('holographic-black-hole-merger');
      state = solitonEngine.getState();
      expect(state.activeRegime).toBe('holographic-black-hole-merger');
      expect(state.spinInteractionC2Hz).toBe(-18.0);
      expect(state.impactParameterUm).toBe(0.1);
    });

    it('時間步進 update 應推動孤子中心對撞運動與自旋分量分佈', () => {
      const prevPhase = solitonEngine.getState().pulsePhase;
      solitonEngine.update(0.08);
      const state = solitonEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.packet.spinDensityPlus1).toBeGreaterThan(0);
      expect(state.packet.spinDensityMinus1).toBeGreaterThan(0);
    });

    it('觸發孤子對撞音效與重設應安全不拋出異常', () => {
      expect(() => solitonEngine.triggerCollisionSound()).not.toThrow();
      expect(() => solitonEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 50 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 216 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(216);
    });

    it('應包含 Part 50 的 4 項全新成就並可順利解鎖', () => {
      const p50AchievementIds = [
        'non_abelian_fractal_hots',
        'weyl_chiral_gravitational_fluid',
        'quantum_polariton_lattice',
        'spinor_soliton_collider',
      ];

      for (const id of p50AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
