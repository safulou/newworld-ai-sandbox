import { describe, it, expect, beforeEach, vi } from 'vitest';
import { casimirTorqueEngine } from '../casimirTorqueMotor';
import { anyonHolographicEngine } from '../anyonHolographicCode';
import { relativisticTeleportEngine } from '../relativisticTeleportation';
import { planckVacuumEngine } from '../planckVacuumCavity';
import { achievements } from '../achievements';

describe('Part 23: Casimir Torque Motor, Anyon Holographic Code, Relativistic Teleport & Planck Vacuum Cavity', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('CasimirTorqueEngine (拓撲缺陷卡西米爾真空扭矩馬達)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = casimirTorqueEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.gapDistanceNm).toBeGreaterThan(0);
      expect(state.rotationAngleDeg).toBeGreaterThanOrEqual(0);
      expect(state.torqueFemtoNm).toBeGreaterThan(0);
      expect(state.rotationSpeedRpm).toBeGreaterThan(0);
      expect(state.levitationStabilityPercent).toBeGreaterThan(0);
      expect(state.torqueLogs).toBeDefined();
    });

    it('切換 4 種卡西米爾扭矩體制並驗證物理動態重算', () => {
      casimirTorqueEngine.setRegime('chiral_weyl');
      expect(casimirTorqueEngine.getState().regime).toBe('chiral_weyl');

      casimirTorqueEngine.setRegime('negative_casimir_levitation');
      expect(casimirTorqueEngine.getState().regime).toBe('negative_casimir_levitation');

      casimirTorqueEngine.setRegime('dynamical_vacuum_drive');
      expect(casimirTorqueEngine.getState().regime).toBe('dynamical_vacuum_drive');

      casimirTorqueEngine.setRegime('birefringent_calcite');
      expect(casimirTorqueEngine.getState().regime).toBe('birefringent_calcite');
    });

    it('調整晶圓奈米間距與方位旋轉角度並約束邊界', () => {
      casimirTorqueEngine.setGapDistanceNm(25);
      expect(casimirTorqueEngine.getState().gapDistanceNm).toBe(25);

      // 上下限約束 (10.0 ~ 120.0 nm)
      casimirTorqueEngine.setGapDistanceNm(2);
      expect(casimirTorqueEngine.getState().gapDistanceNm).toBe(10.0);
      casimirTorqueEngine.setGapDistanceNm(300);
      expect(casimirTorqueEngine.getState().gapDistanceNm).toBe(120.0);

      // 設定角度為 45 度 (最大扭矩角)
      casimirTorqueEngine.setRotationAngleDeg(45);
      expect(casimirTorqueEngine.getState().rotationAngleDeg).toBe(45);
      expect(casimirTorqueEngine.getState().torqueFemtoNm).toBeGreaterThan(0);

      // 上下限約束 (0 ~ 180 度)
      casimirTorqueEngine.setRotationAngleDeg(-20);
      expect(casimirTorqueEngine.getState().rotationAngleDeg).toBe(0);
      casimirTorqueEngine.setRotationAngleDeg(360);
      expect(casimirTorqueEngine.getState().rotationAngleDeg).toBe(180);
    });

    it('觸發旋轉衝擊日誌與零點共振增益', () => {
      const prevSpins = casimirTorqueEngine.getState().totalSpinsExecuted;
      const prevFlux = casimirTorqueEngine.getState().vacuumZeroEnergyFlux;

      const log = casimirTorqueEngine.spinMotor();
      expect(log.id).toMatch(/^torque-/);
      expect(log.torqueFemtoNm).toBeGreaterThan(0);
      expect(log.rpm).toBeGreaterThan(0);

      const state = casimirTorqueEngine.getState();
      expect(state.totalSpinsExecuted).toBe(prevSpins + 1);
      expect(state.vacuumZeroEnergyFlux).toBeGreaterThan(prevFlux);
      expect(state.torqueLogs.length).toBeGreaterThanOrEqual(1);

      // 共振增益
      casimirTorqueEngine.triggerResonanceBoost();
      expect(casimirTorqueEngine.getState().rotationAngleDeg).toBe(45.0);

      // 自動驅動與更新循環
      casimirTorqueEngine.setAutoDrive(true);
      expect(casimirTorqueEngine.getState().autoDrive).toBe(true);
      const fluxBeforeUpdate = casimirTorqueEngine.getState().vacuumZeroEnergyFlux;
      casimirTorqueEngine.update(0.5);
      expect(casimirTorqueEngine.getState().vacuumZeroEnergyFlux).toBeGreaterThan(fluxBeforeUpdate);
    });
  });

  describe('AnyonHolographicEngine (非阿貝爾任意子全息量子糾錯編碼室)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = anyonHolographicEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.adsCurvatureRadius).toBeGreaterThan(0);
      expect(state.codeDistanceD).toBeGreaterThanOrEqual(3);
      expect(state.physicalQubitsCount).toBeGreaterThan(0);
      expect(state.logicalQubitsCount).toBeGreaterThan(0);
      expect(state.anyonBraidingFidelity).toBeGreaterThan(0);
      expect(state.fusionHistory).toBeDefined();
    });

    it('切換 4 種全息編碼體制與 AdS 曲率半徑', () => {
      anyonHolographicEngine.setRegime('fibonacci_braiding');
      expect(anyonHolographicEngine.getState().regime).toBe('fibonacci_braiding');

      anyonHolographicEngine.setRegime('stabilizer_syndrome');
      expect(anyonHolographicEngine.getState().regime).toBe('stabilizer_syndrome');

      anyonHolographicEngine.setRegime('fault_tolerant_memory');
      expect(anyonHolographicEngine.getState().regime).toBe('fault_tolerant_memory');

      anyonHolographicEngine.setRegime('happy_pentagon_code');
      expect(anyonHolographicEngine.getState().regime).toBe('happy_pentagon_code');

      // 調整 AdS 曲率半徑 (1.0 ~ 8.0)
      anyonHolographicEngine.setAdSCurvatureRadius(5.5);
      expect(anyonHolographicEngine.getState().adsCurvatureRadius).toBe(5.5);

      anyonHolographicEngine.setAdSCurvatureRadius(0.2);
      expect(anyonHolographicEngine.getState().adsCurvatureRadius).toBe(1.0);

      anyonHolographicEngine.setAdSCurvatureRadius(15.0);
      expect(anyonHolographicEngine.getState().adsCurvatureRadius).toBe(8.0);
    });

    it('設定代碼距離 (d=3..9) 並驗證邏輯錯誤率指數衰減', () => {
      anyonHolographicEngine.setCodeDistance(3);
      const err3 = anyonHolographicEngine.getState().logicalErrorRatePercent;

      anyonHolographicEngine.setCodeDistance(7);
      const err7 = anyonHolographicEngine.getState().logicalErrorRatePercent;
      expect(err7).toBeLessThan(err3);
    });

    it('執行斐波那契任意子融合測試與穩定子提取', () => {
      const prevCorrected = anyonHolographicEngine.getState().totalSyndromesCorrected;
      const prevEntropy = anyonHolographicEngine.getState().holographicEntropyFlux;

      const record = anyonHolographicEngine.performFibonacciFusion();
      expect(record.id).toMatch(/^fusion-/);
      expect(['vacuum_1', 'anyon_tau']).toContain(record.channel);
      expect(record.logicalFidelityPercent).toBeGreaterThan(0);

      const state = anyonHolographicEngine.getState();
      expect(state.fusionHistory.length).toBeGreaterThanOrEqual(1);
      expect(state.holographicEntropyFlux).toBeGreaterThan(prevEntropy);

      // 提取症候群
      anyonHolographicEngine.extractSyndrome();
      expect(anyonHolographicEngine.getState().totalSyndromesCorrected).toBeGreaterThan(prevCorrected);

      // 自動校正與更新
      anyonHolographicEngine.setAutoCorrect(true);
      expect(anyonHolographicEngine.getState().autoCorrect).toBe(true);
      const entropyBeforeUpdate = anyonHolographicEngine.getState().holographicEntropyFlux;
      anyonHolographicEngine.update(0.5);
      expect(anyonHolographicEngine.getState().holographicEntropyFlux).toBeGreaterThan(entropyBeforeUpdate);
    });
  });

  describe('RelativisticTeleportEngine (相對論性量子資訊穿梭超流波導)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = relativisticTeleportEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.accelerationG).toBeGreaterThan(0);
      expect(state.unruhTemperatureMicroK).toBeGreaterThan(0);
      expect(state.bellFidelityPercent).toBeGreaterThan(0);
      expect(state.quantumInformationThroughputQps).toBeGreaterThan(0);
      expect(state.eventHistory).toBeDefined();
    });

    it('切換 4 種相對論傳態體制與加速度並計算烏魯赫熱力學效應', () => {
      relativisticTeleportEngine.setRegime('cross_horizon_phonon');
      expect(relativisticTeleportEngine.getState().regime).toBe('cross_horizon_phonon');

      relativisticTeleportEngine.setRegime('ctc_gravity_channel');
      expect(relativisticTeleportEngine.getState().regime).toBe('ctc_gravity_channel');

      relativisticTeleportEngine.setRegime('lossless_relativistic_qkd');
      expect(relativisticTeleportEngine.getState().regime).toBe('lossless_relativistic_qkd');

      relativisticTeleportEngine.setRegime('unruh_immune_bell');
      expect(relativisticTeleportEngine.getState().regime).toBe('unruh_immune_bell');

      // 加速度設定 (1 ~ 500 g)
      relativisticTeleportEngine.setAccelerationG(120.0);
      expect(relativisticTeleportEngine.getState().accelerationG).toBe(120.0);
      expect(relativisticTeleportEngine.getState().unruhTemperatureMicroK).toBeGreaterThan(0);

      // 邊界防護
      relativisticTeleportEngine.setAccelerationG(0.2);
      expect(relativisticTeleportEngine.getState().accelerationG).toBe(1.0);

      relativisticTeleportEngine.setAccelerationG(800.0);
      expect(relativisticTeleportEngine.getState().accelerationG).toBe(500.0);
    });

    it('執行跨視界量子隱形傳態記錄與通量累計', () => {
      const prevTeleports = relativisticTeleportEngine.getState().totalTeleportsExecuted;
      const prevFlux = relativisticTeleportEngine.getState().teleportFlux;

      const record = relativisticTeleportEngine.teleportQuantumState();
      expect(record.id).toMatch(/^teleport-/);
      expect(record.fidelityPercent).toBeGreaterThan(0);
      expect(record.entanglementPreservedPercent).toBeGreaterThan(0);
      expect(record.unruhNoiseSuppressedDb).toBeGreaterThan(0);

      const state = relativisticTeleportEngine.getState();
      expect(state.totalTeleportsExecuted).toBe(prevTeleports + 1);
      expect(state.teleportFlux).toBeGreaterThan(prevFlux);
      expect(state.eventHistory.length).toBeGreaterThanOrEqual(1);

      // 自動中繼與更新
      relativisticTeleportEngine.setAutoTeleport(true);
      expect(relativisticTeleportEngine.getState().autoTeleport).toBe(true);
      const fluxBefore = relativisticTeleportEngine.getState().teleportFlux;
      relativisticTeleportEngine.update(0.5);
      expect(relativisticTeleportEngine.getState().teleportFlux).toBeGreaterThan(fluxBefore);
    });
  });

  describe('PlanckVacuumEngine (極限普朗克常數真空相變臨界諧振腔)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = planckVacuumEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.mirrorFrequencyGhz).toBeGreaterThan(0);
      expect(state.cavityQualityFactor).toBeGreaterThan(0);
      expect(state.photonProductionRateKps).toBeGreaterThan(0);
      expect(state.effectivePlanckScale).toBeGreaterThan(0);
      expect(state.phaseTransitionCriticalityPercent).toBeGreaterThan(0);
      expect(state.photonPairs).toBeDefined();
    });

    it('切換 4 種真空相變體制與諧振腔參數', () => {
      planckVacuumEngine.setRegime('vibrating_mirror');
      expect(planckVacuumEngine.getState().regime).toBe('vibrating_mirror');

      planckVacuumEngine.setRegime('critical_vacuum_bec');
      expect(planckVacuumEngine.getState().regime).toBe('critical_vacuum_bec');

      planckVacuumEngine.setRegime('planck_fluctuation_tap');
      expect(planckVacuumEngine.getState().regime).toBe('planck_fluctuation_tap');

      planckVacuumEngine.setRegime('squid_dynamical_vacuum');
      expect(planckVacuumEngine.getState().regime).toBe('squid_dynamical_vacuum');

      // 頻率設定 (2.0 ~ 24.0 GHz)
      planckVacuumEngine.setMirrorFrequencyGhz(18.5);
      expect(planckVacuumEngine.getState().mirrorFrequencyGhz).toBe(18.5);

      planckVacuumEngine.setMirrorFrequencyGhz(0.5);
      expect(planckVacuumEngine.getState().mirrorFrequencyGhz).toBe(2.0);

      planckVacuumEngine.setMirrorFrequencyGhz(50.0);
      expect(planckVacuumEngine.getState().mirrorFrequencyGhz).toBe(24.0);

      // 品質因子 Q (10^4 ~ 10^7)
      planckVacuumEngine.setCavityQualityFactor(500000);
      expect(planckVacuumEngine.getState().cavityQualityFactor).toBe(500000);
    });

    it('觸發動態微波光子對生成與臨界相變衝擊波', () => {
      const prevHarvested = planckVacuumEngine.getState().totalPhotonsHarvested;
      const prevEnergy = planckVacuumEngine.getState().extractedVacuumEnergyPj;

      const pair = planckVacuumEngine.generateDynamicalPhotons();
      expect(pair.id).toMatch(/^dce-/);
      expect(pair.frequencyGhz).toBeGreaterThan(0);
      expect(pair.quantumSqueezingDb).toBeGreaterThan(0);
      expect(pair.entangled).toBe(true);

      const state = planckVacuumEngine.getState();
      expect(state.totalPhotonsHarvested).toBe(prevHarvested + 2);
      expect(state.extractedVacuumEnergyPj).toBeGreaterThan(prevEnergy);
      expect(state.photonPairs.length).toBeGreaterThanOrEqual(1);

      // 觸發真空相變衝擊波
      planckVacuumEngine.triggerPhaseTransition();
      expect(planckVacuumEngine.getState().phaseTransitionCriticalityPercent).toBeGreaterThanOrEqual(99.0);

      // 自動激發與更新
      planckVacuumEngine.setAutoExcite(true);
      expect(planckVacuumEngine.getState().autoExcite).toBe(true);
      const energyBefore = planckVacuumEngine.getState().extractedVacuumEnergyPj;
      planckVacuumEngine.update(0.5);
      expect(planckVacuumEngine.getState().extractedVacuumEnergyPj).toBeGreaterThan(energyBefore);
    });
  });

  describe('Part 23 成就系統驗證', () => {
    it('應擴展包含至少 108 項成就，並包含 Part 23 四項專屬成就', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(108);

      const casimirAch = all.find(a => a.id === 'casimir_torque_artisan');
      expect(casimirAch).toBeDefined();
      expect(casimirAch?.title).toContain('卡西米爾');

      const anyonAch = all.find(a => a.id === 'holographic_anyon_coder');
      expect(anyonAch).toBeDefined();
      expect(anyonAch?.title).toContain('任意子');

      const teleportAch = all.find(a => a.id === 'relativistic_teleport_runner');
      expect(teleportAch).toBeDefined();
      expect(teleportAch?.title).toContain('相對論');

      const planckAch = all.find(a => a.id === 'planck_vacuum_dynamist');
      expect(planckAch).toBeDefined();
      expect(planckAch?.title).toContain('普朗克');
    });
  });
});
