import { describe, it, expect, beforeEach } from 'vitest';
import { TopologicalChiralWeylPhononSuperfluidEngine } from '../topologicalChiralWeylPhononSuperfluid';
import { HolographicYangMillsTensorNetworkEngine } from '../holographicYangMillsTensorNetwork';
import { SpinOrbitalOctupoleInsulatorEngine } from '../spinOrbitalOctupoleInsulator';
import { LaserWakefieldQuantumRadiationColliderEngine } from '../laserWakefieldQuantumRadiationCollider';
import { achievements } from '../achievements';

describe('Part 53: 拓撲手性外爾聲子超流體、全息楊-米爾斯張量網路、自旋軌道拓撲八極子絕緣體與雷射尾波場強場 QED 對撞測試', () => {
  let phononEngine: TopologicalChiralWeylPhononSuperfluidEngine;
  let ymTensorEngine: HolographicYangMillsTensorNetworkEngine;
  let octupoleEngine: SpinOrbitalOctupoleInsulatorEngine;
  let wakefieldEngine: LaserWakefieldQuantumRadiationColliderEngine;

  beforeEach(() => {
    phononEngine = new TopologicalChiralWeylPhononSuperfluidEngine();
    ymTensorEngine = new HolographicYangMillsTensorNetworkEngine();
    octupoleEngine = new SpinOrbitalOctupoleInsulatorEngine();
    wakefieldEngine = new LaserWakefieldQuantumRadiationColliderEngine();
  });

  describe('1. 拓撲手性時間反演破缺外爾聲子超流體與熱霍爾渦旋晶格引擎 (TopologicalChiralWeylPhononSuperfluidEngine)', () => {
    it('應正確初始化外爾聲子單極荷、自旋聲子耦合、熱霍爾電導率與 14 個聲子渦旋節點', () => {
      const state = phononEngine.getState();
      expect(state.phononMonopoleChargeC).toBe(2);
      expect(state.spinPhononCouplingMeV).toBe(18.5);
      expect(state.phononNodes.length).toBe(14);
      expect(state.thermalHallConductivityMw).toBeGreaterThan(20);
      expect(state.chiralAngularMomentumDensity).toBeGreaterThan(1.0);
    });

    it('調高聲子單極荷、自旋聲子耦合與熱梯度應顯著提升熱霍爾電導率與超流相干度', () => {
      phononEngine.setPhonopoleCharge(4);
      phononEngine.setSpinPhononCoupling(38.0);
      phononEngine.setThermalGradient(24.0);
      const state = phononEngine.getState();
      expect(state.phononMonopoleChargeC).toBe(4);
      expect(state.thermalHallConductivityMw).toBeGreaterThan(150);
      expect(state.superfluidCoherenceFraction).toBeGreaterThan(0.85);
    });

    it('切換體制應設定對應的外爾聲子與熱霍爾超流相', () => {
      phononEngine.setRegime('achiral-acoustic-lattice');
      let state = phononEngine.getState();
      expect(state.activeRegime).toBe('achiral-acoustic-lattice');
      expect(state.phononMonopoleChargeC).toBe(1);

      phononEngine.setRegime('quantized-thermal-hall-superfluid');
      state = phononEngine.getState();
      expect(state.activeRegime).toBe('quantized-thermal-hall-superfluid');
      expect(state.phononMonopoleChargeC).toBe(4);
    });

    it('時間步進 update 應平滑推進相位並更新布里淵區聲子節點座標', () => {
      const prevPhase = phononEngine.getState().pulsePhase;
      phononEngine.update(0.05);
      const state = phononEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.phononNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發外爾聲子音效與重設應安全不拋出異常', () => {
      expect(() => phononEngine.triggerWeylPhononSound()).not.toThrow();
      expect(() => phononEngine.reset()).not.toThrow();
    });
  });

  describe('2. 全息楊-米爾斯張量網路與多體糾纏幾何湧現重整化流引擎 (HolographicYangMillsTensorNetworkEngine)', () => {
    it('應正確初始化 SU(N_c) 階數、張量鍵維度、笠-高柳糾纏熵與 16 個雙曲張量節點', () => {
      const state = ymTensorEngine.getState();
      expect(state.gaugeGroupRankNc).toBe(3);
      expect(state.tensorBondDimensionChi).toBe(8);
      expect(state.tensorNodes.length).toBe(16);
      expect(state.ryuTakayanagiEntropyKb).toBeGreaterThan(15);
      expect(state.wilsonStringTensionSigma).toBeGreaterThan(0.5);
    });

    it('提高規範群階數、張量鍵維度與耦合常數應提升笠-高柳糾纏熵與威爾森面積律弦張力', () => {
      ymTensorEngine.setGaugeGroupRank(6);
      ymTensorEngine.setTensorBondDimension(24);
      ymTensorEngine.setYmCouplingSquared(4.5);
      const state = ymTensorEngine.getState();
      expect(state.gaugeGroupRankNc).toBe(6);
      expect(state.tensorBondDimensionChi).toBe(24);
      expect(state.ryuTakayanagiEntropyKb).toBeGreaterThan(70);
      expect(state.wilsonStringTensionSigma).toBeGreaterThan(2.0);
    });

    it('切換體制應設定對應的全息重整化流與禁閉-解禁閉相', () => {
      ymTensorEngine.setRegime('uv-conformal-perimeter-law');
      let state = ymTensorEngine.getState();
      expect(state.activeRegime).toBe('uv-conformal-perimeter-law');
      expect(state.gaugeGroupRankNc).toBe(2);

      ymTensorEngine.setRegime('ads-black-hole-deconfinement-horizon');
      state = ymTensorEngine.getState();
      expect(state.activeRegime).toBe('ads-black-hole-deconfinement-horizon');
      expect(state.gaugeGroupRankNc).toBe(8);
    });

    it('時間步進 update 應推動雙曲圓盤張量網路相位與威爾森通量演化', () => {
      const prevPhase = ymTensorEngine.getState().pulsePhase;
      ymTensorEngine.update(0.06);
      const state = ymTensorEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.tensorNodes[1].x).toBeGreaterThan(0);
    });

    it('觸發雙曲重整化音效與重設應安全不拋出異常', () => {
      expect(() => ymTensorEngine.triggerYmTensorSound()).not.toThrow();
      expect(() => ymTensorEngine.reset()).not.toThrow();
    });
  });

  describe('3. 非阿貝爾量子自旋軌道液體與四極矩拓撲八極子絕緣體引擎 (SpinOrbitalOctupoleInsulatorEngine)', () => {
    it('應正確初始化躍遷比、Kugel-Khomskii 耦合、體八極矩不變量與 8 個頂角分數化電荷節點', () => {
      const state = octupoleEngine.getState();
      expect(state.intercellHoppingRatioLambda).toBe(2.1);
      expect(state.quantizedOctupoleIndexQxyz).toBe(0.5);
      expect(state.cornerVertices.length).toBe(8);
      expect(state.cornerFractionalChargeE).toBeGreaterThan(0.4);
      expect(state.su4SpinOrbitalGapMev).toBeGreaterThan(10);
    });

    it('調低躍遷比至平庸區應使體拓撲八極矩歸零，調高至拓撲區則恢復 q_xyz = 0.5e', () => {
      octupoleEngine.setHoppingRatioLambda(0.6);
      octupoleEngine.setPlaquettePiFlux(0.3);
      let state = octupoleEngine.getState();
      expect(state.quantizedOctupoleIndexQxyz).toBe(0.0);

      octupoleEngine.setHoppingRatioLambda(3.0);
      octupoleEngine.setPlaquettePiFlux(1.0);
      octupoleEngine.setKugelKhomskiiCoupling(50.0);
      state = octupoleEngine.getState();
      expect(state.quantizedOctupoleIndexQxyz).toBe(0.5);
      expect(state.cornerFractionalChargeE).toBeGreaterThan(0.48);
      expect(state.su4SpinOrbitalGapMev).toBeGreaterThan(40);
    });

    it('切換體制應設定對應的莫特絕緣、四極矩或 SU(4) 自旋軌道八極子相', () => {
      octupoleEngine.setRegime('trivial-dipolar-mott-insulator');
      let state = octupoleEngine.getState();
      expect(state.activeRegime).toBe('trivial-dipolar-mott-insulator');
      expect(state.quantizedOctupoleIndexQxyz).toBe(0.0);

      octupoleEngine.setRegime('su4-non-abelian-spin-orbital-liquid');
      state = octupoleEngine.getState();
      expect(state.activeRegime).toBe('su4-non-abelian-spin-orbital-liquid');
      expect(state.quantizedOctupoleIndexQxyz).toBe(0.5);
    });

    it('時間步進 update 應推動三維 BBH 立方體旋轉投影與自旋軌道糾纏度調制', () => {
      const prevPhase = octupoleEngine.getState().pulsePhase;
      octupoleEngine.update(0.05);
      const state = octupoleEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.cornerVertices[0].x).toBeGreaterThan(0);
    });

    it('觸發八極子共鳴音效與重設應安全不拋出異常', () => {
      expect(() => octupoleEngine.triggerOctupoleSound()).not.toThrow();
      expect(() => octupoleEngine.reset()).not.toThrow();
    });
  });

  describe('4. 超強雷射等離子體尾波場吉電子伏特對撞與量子輻射反作用反應堆引擎 (LaserWakefieldQuantumRadiationColliderEngine)', () => {
    it('應正確初始化雷射矢勢 a_0、等離子體密度、尾波場梯度、量子非線性參數 χ_e 與 16 個粒子節點', () => {
      const state = wakefieldEngine.getState();
      expect(state.laserNormalizedPotentialA0).toBe(45.0);
      expect(state.plasmaDensity18Cm3).toBe(4.5);
      expect(state.bunchParticles.length).toBe(16);
      expect(state.wakefieldGradientGvM).toBeGreaterThan(100);
      expect(state.quantumNonlinearityChiE).toBeGreaterThan(0.5);
    });

    it('調高雷射矢勢 a_0 與等離子體密度應大幅提升加速梯度、χ_e 與 Breit-Wheeler 正負電子對產生率', () => {
      wakefieldEngine.setLaserPotentialA0(105.0);
      wakefieldEngine.setPlasmaDensity(14.0);
      const state = wakefieldEngine.getState();
      expect(state.laserNormalizedPotentialA0).toBe(105.0);
      expect(state.wakefieldGradientGvM).toBeGreaterThan(400);
      expect(state.quantumNonlinearityChiE).toBeGreaterThan(3.0);
      expect(state.breitWheelerPairRateGiga).toBeGreaterThan(100);
    });

    it('切換體制應設定對應的線性尾波場、空泡加速或 Breit-Wheeler 雪崩相', () => {
      wakefieldEngine.setRegime('linear-plasma-wakefield');
      let state = wakefieldEngine.getState();
      expect(state.activeRegime).toBe('linear-plasma-wakefield');
      expect(state.laserNormalizedPotentialA0).toBe(4.0);

      wakefieldEngine.setRegime('breit-wheeler-pair-avalanche');
      state = wakefieldEngine.getState();
      expect(state.activeRegime).toBe('breit-wheeler-pair-avalanche');
      expect(state.laserNormalizedPotentialA0).toBe(110.0);
    });

    it('時間步進 update 應推動電子束 Betatron 振盪軌跡演化', () => {
      const prevPhase = wakefieldEngine.getState().pulsePhase;
      wakefieldEngine.update(0.05);
      const state = wakefieldEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.bunchParticles[0].x).toBeGreaterThan(0);
    });

    it('觸發尾波場對撞音效與重設應安全不拋出異常', () => {
      expect(() => wakefieldEngine.triggerWakefieldColliderSound()).not.toThrow();
      expect(() => wakefieldEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 53 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 228 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(228);
    });

    it('應包含 Part 53 的 4 項全新成就並可順利解鎖', () => {
      const p53AchievementIds = [
        'topological_chiral_weyl_phonon',
        'holographic_yang_mills_tensor',
        'spin_orbital_octupole_insulator',
        'laser_wakefield_quantum_radiation',
      ];

      for (const id of p53AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
