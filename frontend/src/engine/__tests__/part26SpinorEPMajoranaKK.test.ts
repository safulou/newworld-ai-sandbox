import { describe, it, expect, beforeEach, vi } from 'vitest';
import { spinorSkyrmionEngine } from '../spinorSkyrmionCondensate';
import { exceptionalPointEngine } from '../exceptionalPointLaser';
import { majoranaBraidingEngine } from '../majoranaBraidingQubit';
import { kaluzaKleinBlackHoleEngine } from '../kaluzaKleinMicroBlackHole';
import { achievements } from '../achievements';

describe('Part 26: Spinor Skyrmion, Exceptional Point Laser, Majorana Braiding & Kaluza-Klein Micro Black Hole', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('SpinorSkyrmionEngine (旋量玻色-愛因斯坦凝聚斯格明子拓撲天體反應堆)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = spinorSkyrmionEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.spinF).toBe(1);
      expect(state.quadraticZeemanKhz).toBeDefined();
      expect(state.topologicalChargeQ).toBeDefined();
      expect(state.skyrmionDensity1e8).toBeGreaterThan(0);
      expect(state.spinNematicOrderParameter).toBeGreaterThan(0);
      expect(state.condensateCoherencePercent).toBeGreaterThan(0);
      expect(state.skyrmionHistory).toBeDefined();
    });

    it('切換 4 種旋量拓撲動力學體制並驗證拓撲荷', () => {
      spinorSkyrmionEngine.setRegime('ferromagnetic_skyrmion_lattice');
      expect(spinorSkyrmionEngine.getState().topologicalChargeQ).toBe(1);

      spinorSkyrmionEngine.setRegime('polar_coreless_vortex_pair');
      expect(spinorSkyrmionEngine.getState().topologicalChargeQ).toBe(0);

      spinorSkyrmionEngine.setRegime('synthetic_gauge_monopole');
      expect(spinorSkyrmionEngine.getState().topologicalChargeQ).toBe(2);

      spinorSkyrmionEngine.setRegime('spin_nematic_director_liquid');
      expect(spinorSkyrmionEngine.getState().topologicalChargeQ).toBe(1);
    });

    it('調整二次塞曼位移與斯格明子密度並約束邊界數值', () => {
      spinorSkyrmionEngine.setQuadraticZeeman(6.5);
      expect(spinorSkyrmionEngine.getState().quadraticZeemanKhz).toBe(6.5);

      // 邊界防護 (-5.0 ~ 15.0)
      spinorSkyrmionEngine.setQuadraticZeeman(-15.0);
      expect(spinorSkyrmionEngine.getState().quadraticZeemanKhz).toBe(-5.0);
      spinorSkyrmionEngine.setQuadraticZeeman(40.0);
      expect(spinorSkyrmionEngine.getState().quadraticZeemanKhz).toBe(15.0);

      // 密度防護 (1.0 ~ 20.0)
      spinorSkyrmionEngine.setSkyrmionDensity(12.5);
      expect(spinorSkyrmionEngine.getState().skyrmionDensity1e8).toBe(12.5);
      spinorSkyrmionEngine.setSkyrmionDensity(0.1);
      expect(spinorSkyrmionEngine.getState().skyrmionDensity1e8).toBe(1.0);
      spinorSkyrmionEngine.setSkyrmionDensity(55.0);
      expect(spinorSkyrmionEngine.getState().skyrmionDensity1e8).toBe(20.0);
    });

    it('成核斯格明子並更新歷史隊列', () => {
      const prevTotal = spinorSkyrmionEngine.getState().totalSkyrmionsGenerated;
      spinorSkyrmionEngine.nucleateSkyrmion();
      const updated = spinorSkyrmionEngine.getState();
      expect(updated.totalSkyrmionsGenerated).toBe(prevTotal + 1);
      expect(updated.skyrmionHistory.length).toBeGreaterThan(0);
      expect(updated.skyrmionHistory[0].coreRadiusNm).toBeGreaterThan(0);
    });

    it('更新循環與自動進動流微擾', () => {
      spinorSkyrmionEngine.toggleAutoPrecession();
      const toggled = spinorSkyrmionEngine.getState().autoTexturePrecession;
      spinorSkyrmionEngine.update(0.05);
      expect(spinorSkyrmionEngine.getState().spinNematicOrderParameter).toBeGreaterThan(0);
      if (!toggled) spinorSkyrmionEngine.toggleAutoPrecession();
    });
  });

  describe('ExceptionalPointEngine (非厄米拓撲奇異點雷射放大器)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = exceptionalPointEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.gainLossParameterGhz).toBeGreaterThan(0);
      expect(state.couplingStrengthGhz).toBeGreaterThan(0);
      expect(state.orderOfEP).toBeGreaterThanOrEqual(2);
      expect(state.sensitivityEnhancementRatio).toBeGreaterThan(0);
      expect(state.laserSlopeEfficiencyPercent).toBeGreaterThan(0);
      expect(state.sensingHistory).toBeDefined();
    });

    it('切換 4 種非厄米拓撲放大體制並驗證 EP 階數', () => {
      exceptionalPointEngine.setRegime('pt_symmetric_balanced_gain_loss');
      expect(exceptionalPointEngine.getState().orderOfEP).toBe(2);

      exceptionalPointEngine.setRegime('higher_order_ep3_sensor');
      expect(exceptionalPointEngine.getState().orderOfEP).toBe(3);

      exceptionalPointEngine.setRegime('topological_chiral_mode_transfer');
      expect(exceptionalPointEngine.getState().orderOfEP).toBe(2);

      exceptionalPointEngine.setRegime('unidirectional_invisibility_laser');
      expect(exceptionalPointEngine.getState().orderOfEP).toBe(2);
    });

    it('調整增益損耗率與耦合強度並約束邊界數值', () => {
      exceptionalPointEngine.setGainLoss(4.5);
      expect(exceptionalPointEngine.getState().gainLossParameterGhz).toBe(4.5);
      exceptionalPointEngine.setGainLoss(0.01);
      expect(exceptionalPointEngine.getState().gainLossParameterGhz).toBe(0.1);
      exceptionalPointEngine.setGainLoss(35.0);
      expect(exceptionalPointEngine.getState().gainLossParameterGhz).toBe(10.0);

      exceptionalPointEngine.setCoupling(5.2);
      expect(exceptionalPointEngine.getState().couplingStrengthGhz).toBe(5.2);
      exceptionalPointEngine.setCoupling(0.02);
      expect(exceptionalPointEngine.getState().couplingStrengthGhz).toBe(0.1);
      exceptionalPointEngine.setCoupling(40.0);
      expect(exceptionalPointEngine.getState().couplingStrengthGhz).toBe(10.0);
    });

    it('注入微擾傳感並計算分數階劈裂歷史記錄', () => {
      const prevPulses = exceptionalPointEngine.getState().totalLasingPulses;
      exceptionalPointEngine.injectSensingPerturbation();
      const updated = exceptionalPointEngine.getState();
      expect(updated.totalLasingPulses).toBe(prevPulses + 1);
      expect(updated.sensingHistory.length).toBeGreaterThan(0);
      expect(updated.sensingHistory[0].eigenvalueSplittingGhz).toBeGreaterThan(0);
    });

    it('更新循環與自動 EP 鎖定', () => {
      exceptionalPointEngine.toggleAutoStabilization();
      const toggled = exceptionalPointEngine.getState().autoEPStabilization;
      exceptionalPointEngine.update(0.05);
      expect(exceptionalPointEngine.getState().sensitivityEnhancementRatio).toBeGreaterThan(0);
      if (!toggled) exceptionalPointEngine.toggleAutoStabilization();
    });
  });

  describe('MajoranaBraidingEngine (拓撲馬約拉納零能模非阿貝爾量子編織晶片)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = majoranaBraidingEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.zeemanFieldTesla).toBeGreaterThan(0);
      expect(state.superconductingGapMev).toBeGreaterThan(0);
      expect(state.topologicalGapMev).toBeGreaterThan(0);
      expect(state.groundStateFidelityPercent).toBeGreaterThan(0);
      expect(state.qubitDecoherenceTimeUs).toBeGreaterThan(0);
      expect(state.braidHistory).toBeDefined();
    });

    it('切換 4 種拓撲編織體制', () => {
      majoranaBraidingEngine.setRegime('topological_kitaev_wire_edge');
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(1.0);

      majoranaBraidingEngine.setRegime('t_junction_non_abelian_braid');
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(1.25);

      majoranaBraidingEngine.setRegime('parity_qubit_topological_gate');
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(1.6);

      majoranaBraidingEngine.setRegime('majorana_surface_code_fault_tolerant');
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(2.0);
    });

    it('調整塞曼磁場與超導能隙並約束邊界數值', () => {
      majoranaBraidingEngine.setZeemanField(2.1);
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(2.1);
      majoranaBraidingEngine.setZeemanField(0.05);
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(0.2);
      majoranaBraidingEngine.setZeemanField(10.0);
      expect(majoranaBraidingEngine.getState().zeemanFieldTesla).toBe(3.0);

      majoranaBraidingEngine.setSuperconductingGap(1.5);
      expect(majoranaBraidingEngine.getState().superconductingGapMev).toBe(1.5);
      majoranaBraidingEngine.setSuperconductingGap(0.01);
      expect(majoranaBraidingEngine.getState().superconductingGapMev).toBe(0.1);
      majoranaBraidingEngine.setSuperconductingGap(5.0);
      expect(majoranaBraidingEngine.getState().superconductingGapMev).toBe(2.0);
    });

    it('執行非阿貝爾編織交換並累積歷史記錄', () => {
      const prevTotal = majoranaBraidingEngine.getState().totalBraidsExecuted;
      majoranaBraidingEngine.executeBraidStep();
      const updated = majoranaBraidingEngine.getState();
      expect(updated.totalBraidsExecuted).toBe(prevTotal + 1);
      expect(updated.braidHistory.length).toBeGreaterThan(0);
      expect(updated.braidHistory[0].topologicalFidelity).toBeGreaterThan(0.9);
    });

    it('更新循環與自動編織開關', () => {
      majoranaBraidingEngine.toggleAutoBraiding();
      const toggled = majoranaBraidingEngine.getState().autoBraidingCycle;
      majoranaBraidingEngine.update(0.05);
      expect(majoranaBraidingEngine.getState().topologicalGapMev).toBeGreaterThan(0);
      if (!toggled) majoranaBraidingEngine.toggleAutoBraiding();
    });
  });

  describe('KaluzaKleinBlackHoleEngine (卡魯扎-克萊因高維引力微型黑洞探針)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = kaluzaKleinBlackHoleEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.extraDimensionsCount).toBeGreaterThanOrEqual(2);
      expect(state.fundamentalPlanckScaleTev).toBeGreaterThan(0);
      expect(state.collisionEnergyTev).toBeGreaterThan(0);
      expect(state.horizonRadiusAttometer).toBeGreaterThan(0);
      expect(state.hawkingTemperatureGev).toBeGreaterThan(0);
      expect(state.kkGravitonEmissionRateMegaHz).toBeGreaterThan(0);
      expect(state.evaporationHistory).toBeDefined();
    });

    it('切換 4 種高維重力探測體制', () => {
      kaluzaKleinBlackHoleEngine.setRegime('tev_scale_gravity_blackhole');
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(3);

      kaluzaKleinBlackHoleEngine.setRegime('kk_graviton_tower_emission');
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(2);

      kaluzaKleinBlackHoleEngine.setRegime('four_stage_hawking_evaporation');
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(4);

      kaluzaKleinBlackHoleEngine.setRegime('planck_remnant_string_ball');
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(6);
    });

    it('調整維度數、普朗克能標與碰撞能並約束邊界', () => {
      kaluzaKleinBlackHoleEngine.setDimensions(5);
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(5);
      kaluzaKleinBlackHoleEngine.setDimensions(1);
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(2);
      kaluzaKleinBlackHoleEngine.setDimensions(10);
      expect(kaluzaKleinBlackHoleEngine.getState().extraDimensionsCount).toBe(6);

      kaluzaKleinBlackHoleEngine.setPlanckScale(4.2);
      expect(kaluzaKleinBlackHoleEngine.getState().fundamentalPlanckScaleTev).toBe(4.2);
      kaluzaKleinBlackHoleEngine.setPlanckScale(0.2);
      expect(kaluzaKleinBlackHoleEngine.getState().fundamentalPlanckScaleTev).toBe(1.0);
      kaluzaKleinBlackHoleEngine.setPlanckScale(25.0);
      expect(kaluzaKleinBlackHoleEngine.getState().fundamentalPlanckScaleTev).toBe(10.0);

      kaluzaKleinBlackHoleEngine.setCollisionEnergy(20.0);
      expect(kaluzaKleinBlackHoleEngine.getState().collisionEnergyTev).toBe(20.0);
      kaluzaKleinBlackHoleEngine.setCollisionEnergy(1.0);
      expect(kaluzaKleinBlackHoleEngine.getState().collisionEnergyTev).toBe(6.0);
      kaluzaKleinBlackHoleEngine.setCollisionEnergy(60.0);
      expect(kaluzaKleinBlackHoleEngine.getState().collisionEnergyTev).toBe(28.0);
    });

    it('激發高維重力坍縮成核並更新蒸發歷史記錄', () => {
      const prevTotal = kaluzaKleinBlackHoleEngine.getState().totalMicroBlackHolesFormed;
      kaluzaKleinBlackHoleEngine.triggerBlackHoleCollapse();
      const updated = kaluzaKleinBlackHoleEngine.getState();
      expect(updated.totalMicroBlackHolesFormed).toBe(prevTotal + 1);
      expect(updated.evaporationHistory.length).toBeGreaterThan(0);
      expect(updated.evaporationHistory[0].massTev).toBeGreaterThan(0);
    });

    it('更新循環與自動光度開關', () => {
      kaluzaKleinBlackHoleEngine.toggleColliderLuminosity();
      const toggled = kaluzaKleinBlackHoleEngine.getState().autoColliderLuminosity;
      kaluzaKleinBlackHoleEngine.update(0.05);
      expect(kaluzaKleinBlackHoleEngine.getState().kkGravitonEmissionRateMegaHz).toBeGreaterThan(0);
      if (!toggled) kaluzaKleinBlackHoleEngine.toggleColliderLuminosity();
    });
  });

  describe('Achievements Integration (成就系統擴充至 120 項)', () => {
    it('應具備總計至少 120 個成就', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(120);
    });

    it('應能成功解鎖 4 個 Part 26 全新成就', () => {
      achievements.unlock('spinor_skyrmion_condensate');
      expect(achievements.isUnlocked('spinor_skyrmion_condensate')).toBe(true);

      achievements.unlock('exceptional_point_laser');
      expect(achievements.isUnlocked('exceptional_point_laser')).toBe(true);

      achievements.unlock('majorana_braiding_qubit');
      expect(achievements.isUnlocked('majorana_braiding_qubit')).toBe(true);

      achievements.unlock('kaluza_klein_micro_blackhole');
      expect(achievements.isUnlocked('kaluza_klein_micro_blackhole')).toBe(true);
    });
  });
});
