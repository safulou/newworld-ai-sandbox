import { describe, it, expect, beforeEach } from 'vitest';
import { SuperconductingFluxonKnotCrystallizerEngine } from '../superconductingFluxonKnotCrystallizer';
import { TopologicalSpinMobiusResonatorEngine } from '../topologicalSpinMobiusResonator';
import { HolographicCasimirWormholeEngine } from '../holographicCasimirWormholeEngine';
import { SusyQcdMonopoleBecRingEngine } from '../susyQcdMonopoleBecRing';
import { achievements } from '../achievements';

describe('Part 51: 超導拓撲磁通結、自旋梅比烏斯條、卡西米爾蟲洞、超對稱磁單極凝聚測試', () => {
  let knotEngine: SuperconductingFluxonKnotCrystallizerEngine;
  let mobiusEngine: TopologicalSpinMobiusResonatorEngine;
  let wormholeEngine: HolographicCasimirWormholeEngine;
  let monopoleEngine: SusyQcdMonopoleBecRingEngine;

  beforeEach(() => {
    knotEngine = new SuperconductingFluxonKnotCrystallizerEngine();
    mobiusEngine = new TopologicalSpinMobiusResonatorEngine();
    wormholeEngine = new HolographicCasimirWormholeEngine();
    monopoleEngine = new SusyQcdMonopoleBecRingEngine();
  });

  describe('1. 超導拓撲磁通子扭結結晶器引擎 (SuperconductingFluxonKnotCrystallizerEngine)', () => {
    it('應正確初始化霍普夫不變量、螺旋度密度、約瑟夫森耦合與 16 個扭結採樣節點', () => {
      const state = knotEngine.getState();
      expect(state.hopfInvariantQ).toBe(2);
      expect(state.josephsonCouplingEjMeVR).toBe(15.0);
      expect(state.knotPoints.length).toBe(16);
      expect(state.topologicalBindingEnergyMev).toBeGreaterThan(15);
      expect(state.knotHelicityDensity).toBeGreaterThan(20);
    });

    it('調整霍普夫不變量與約瑟夫森耦合應顯著改變束縛能與臨界解結電流閾值', () => {
      knotEngine.setHopfInvariant(3);
      knotEngine.setJosephsonCoupling(25.0);
      knotEngine.setFluxonLatticeConstant(15.0);
      const state = knotEngine.getState();
      expect(state.hopfInvariantQ).toBe(3);
      expect(state.josephsonCouplingEjMeVR).toBe(25.0);
      expect(state.topologicalBindingEnergyMev).toBeGreaterThan(30);
      expect(state.untyingCurrentThresholdMa).toBeGreaterThan(40);
    });

    it('切換體制應設定對應的拓撲扭結相', () => {
      knotEngine.setRegime('unknotted-vortex-gas');
      let state = knotEngine.getState();
      expect(state.activeRegime).toBe('unknotted-vortex-gas');
      expect(state.hopfInvariantQ).toBe(0);
      expect(state.topologicalBindingEnergyMev).toBe(0);

      knotEngine.setRegime('trefoil-fluxon-knot');
      state = knotEngine.getState();
      expect(state.activeRegime).toBe('trefoil-fluxon-knot');
      expect(state.hopfInvariantQ).toBe(1);
    });

    it('時間步進 update 應平滑推進 pulsePhase 並更新三維投影座標', () => {
      const prevPhase = knotEngine.getState().pulsePhase;
      knotEngine.update(0.06);
      const state = knotEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.knotPoints[0].x).toBeGreaterThan(0);
    });

    it('觸發扭結音效與重設應安全不拋出異常', () => {
      expect(() => knotEngine.triggerKnotSound()).not.toThrow();
      expect(() => knotEngine.reset()).not.toThrow();
    });
  });

  describe('2. 拓撲非阿貝爾自旋梅比烏斯條共振腔引擎 (TopologicalSpinMobiusResonatorEngine)', () => {
    it('應正確初始化半扭轉數、幾何貝里相位、亞諧波干涉對比與 16 個曲面節點', () => {
      const state = mobiusEngine.getState();
      expect(state.twistNumberN).toBe(1);
      expect(state.berryPhaseRad).toBe(Math.PI);
      expect(state.nodes.length).toBe(16);
      expect(state.subharmonicInterference).toBeGreaterThan(0.7);
      expect(state.persistentSpinCurrentUa).toBeGreaterThan(5);
    });

    it('切換半扭轉數奇偶性應調制幾何貝里相位 (0 或 π) 與邊緣自旋流強度', () => {
      mobiusEngine.setTwistNumber(0); // 圓柱拓撲平庸
      let state = mobiusEngine.getState();
      expect(state.berryPhaseRad).toBe(0);
      expect(state.persistentSpinCurrentUa).toBeLessThan(10);

      mobiusEngine.setTwistNumber(3); // 三重梅比烏斯扭曲
      state = mobiusEngine.getState();
      expect(state.berryPhaseRad).toBe(Math.PI);
      expect(state.subharmonicInterference).toBeGreaterThan(0.7);
    });

    it('切換體制應設定對應的曲率幾何與自旋軌道耦合', () => {
      mobiusEngine.setRegime('cylindrical-trivial-ribbon');
      let state = mobiusEngine.getState();
      expect(state.activeRegime).toBe('cylindrical-trivial-ribbon');
      expect(state.twistNumberN).toBe(0);

      mobiusEngine.setRegime('non-abelian-holonomy-knot');
      state = mobiusEngine.getState();
      expect(state.activeRegime).toBe('non-abelian-holonomy-knot');
      expect(state.twistNumberN).toBe(3);
      expect(state.socStrengthAlpha).toBe(48.0);
    });

    it('時間步進 update 應推動自旋進動角與曲面節點深度分佈', () => {
      const prevPhase = mobiusEngine.getState().pulsePhase;
      mobiusEngine.update(0.05);
      const state = mobiusEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.nodes[0].xProj).toBeGreaterThan(0);
    });

    it('觸發梅比烏斯音效與重設應安全不拋出異常', () => {
      expect(() => mobiusEngine.triggerMobiusSound()).not.toThrow();
      expect(() => mobiusEngine.reset()).not.toThrow();
    });
  });

  describe('3. 全息卡西米爾暗能量蟲洞引擎 (HolographicCasimirWormholeEngine)', () => {
    it('應正確初始化卡西米爾間距、幻影暗能量 w、喉管半徑與雙曲截面節點', () => {
      const state = wormholeEngine.getState();
      expect(state.casimirPlateSeparationNm).toBe(25.0);
      expect(state.phantomDarkEnergyW).toBeLessThan(-1.0);
      expect(state.throatRadiusMeters).toBe(4.8);
      expect(state.profileNodes.length).toBe(14);
      expect(state.traversableQuantumFlux).toBeGreaterThan(0.25);
      expect(state.necViolationFactor).toBeGreaterThan(0.25);
    });

    it('調整板間距、暗能量 w 與喉管半徑應動態更新卡西米爾壓強與可穿越通量', () => {
      wormholeEngine.setPlateSeparation(15.0);
      wormholeEngine.setPhantomDarkEnergyW(-2.1);
      wormholeEngine.setThroatRadius(12.0);
      const state = wormholeEngine.getState();
      expect(state.casimirPlateSeparationNm).toBe(15.0);
      expect(state.phantomDarkEnergyW).toBe(-2.1);
      expect(state.throatRadiusMeters).toBe(12.0);
      expect(state.necViolationFactor).toBeGreaterThan(1.5);
      expect(state.traversableQuantumFlux).toBeGreaterThan(0.9);
      expect(state.casimirAttractiveForceN).toBeGreaterThan(100);
    });

    it('切換體制應切換至正確的真空破缺相', () => {
      wormholeEngine.setRegime('sub-critical-casimir-vacuum');
      let state = wormholeEngine.getState();
      expect(state.activeRegime).toBe('sub-critical-casimir-vacuum');
      expect(state.phantomDarkEnergyW).toBe(-0.95);

      wormholeEngine.setRegime('superluminal-horizon-expansion');
      state = wormholeEngine.getState();
      expect(state.activeRegime).toBe('superluminal-horizon-expansion');
      expect(state.throatRadiusMeters).toBe(18.5);
    });

    it('時間步進 update 應推動雙曲截面動態形變與負能量密度分佈', () => {
      const prevPhase = wormholeEngine.getState().pulsePhase;
      wormholeEngine.update(0.04);
      const state = wormholeEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.profileNodes[0].energyDensityRho).toBeLessThan(0);
    });

    it('觸發蟲洞低頻音效與重設應安全不拋出異常', () => {
      expect(() => wormholeEngine.triggerWormholeSound()).not.toThrow();
      expect(() => wormholeEngine.reset()).not.toThrow();
    });
  });

  describe('4. 超對稱量子色動力學磁單極玻色凝聚環引擎 (SusyQcdMonopoleBecRingEngine)', () => {
    it('應正確初始化單極密度、色弦張力、SW 模參數與 12 個圓環節點', () => {
      const state = monopoleEngine.getState();
      expect(state.monopoleDensityRhoM).toBe(18.5);
      expect(state.colorStringTensionGevFm).toBe(1.15);
      expect(state.seibergWittenTauImag).toBe(2.8);
      expect(state.ringNodes.length).toBe(12);
      expect(state.persistentDualCurrentUa).toBeGreaterThan(15);
      expect(state.dualMeissnerPenetrationNm).toBeGreaterThan(0);
    });

    it('調整單極密度與色弦張力應提升持久磁超電流並縮減對偶穿透深度', () => {
      monopoleEngine.setMonopoleDensity(36.0);
      monopoleEngine.setStringTension(3.2);
      monopoleEngine.setSeibergWittenCoupling(1.5);
      const state = monopoleEngine.getState();
      expect(state.monopoleDensityRhoM).toBe(36.0);
      expect(state.colorStringTensionGevFm).toBe(3.2);
      expect(state.persistentDualCurrentUa).toBeGreaterThan(100);
      expect(state.dualMeissnerPenetrationNm).toBeLessThan(8.0);
    });

    it('切換體制應切換對偶邁斯納與強禁閉相', () => {
      monopoleEngine.setRegime('coulomb-massless-monopole');
      let state = monopoleEngine.getState();
      expect(state.activeRegime).toBe('coulomb-massless-monopole');
      expect(state.colorStringTensionGevFm).toBe(0.35);

      monopoleEngine.setRegime('argyres-douglas-critical-point');
      state = monopoleEngine.getState();
      expect(state.activeRegime).toBe('argyres-douglas-critical-point');
      expect(state.monopoleDensityRhoM).toBe(46.0);
    });

    it('時間步進 update 應推動單極環動態旋轉與色通量密度調制', () => {
      const prevPhase = monopoleEngine.getState().pulsePhase;
      monopoleEngine.update(0.07);
      const state = monopoleEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.ringNodes[0].electricFluxDensity).toBeGreaterThan(0);
    });

    it('觸發對偶邁斯納音效與重設應安全不拋出異常', () => {
      expect(() => monopoleEngine.triggerMonopoleSound()).not.toThrow();
      expect(() => monopoleEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 51 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 220 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(220);
    });

    it('應包含 Part 51 的 4 項全新成就並可順利解鎖', () => {
      const p51AchievementIds = [
        'superconducting_fluxon_knot',
        'topological_spin_mobius',
        'holographic_casimir_wormhole',
        'susy_qcd_monopole_bec',
      ];

      for (const id of p51AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
