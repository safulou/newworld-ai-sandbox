import { describe, it, expect, beforeEach, vi } from 'vitest';
import { excitonPolaritonEngine } from '../excitonPolaritonCondensate';
import { floquetTimeCrystalEngine } from '../floquetTimeCrystal';
import { hawkingUnruhDetectorEngine } from '../hawkingUnruhDetector';
import { aharonovCasherEngine } from '../aharonovCasher';
import { achievements } from '../achievements';

describe('Part 25: Exciton-Polariton, Floquet Time Crystal, Hawking-Unruh & Aharonov-Casher', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('ExcitonPolaritonEngine (拓撲激子極化激元量子流體反應堆)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = excitonPolaritonEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.rabiSplittingMev).toBeGreaterThan(0);
      expect(state.condensateFraction).toBeGreaterThan(0);
      expect(state.soundVelocityKmPerS).toBeGreaterThan(0);
      expect(state.reservoirDensity1e10).toBeGreaterThan(0);
      expect(state.superfluidPurityPercent).toBeGreaterThan(0);
      expect(state.solitonHistory).toBeDefined();
    });

    it('切換 4 種極化激元體制並驗證拓撲陳數重算', () => {
      excitonPolaritonEngine.setRegime('bose_einstein_condensate_phase');
      expect(excitonPolaritonEngine.getState().regime).toBe('bose_einstein_condensate_phase');
      expect(excitonPolaritonEngine.getState().topologicalChernNumber).toBe(0);

      excitonPolaritonEngine.setRegime('topological_chiral_edge_soliton');
      expect(excitonPolaritonEngine.getState().regime).toBe('topological_chiral_edge_soliton');
      expect(excitonPolaritonEngine.getState().topologicalChernNumber).toBe(1);

      excitonPolaritonEngine.setRegime('half_quantum_vortex_superfluid');
      expect(excitonPolaritonEngine.getState().regime).toBe('half_quantum_vortex_superfluid');
      expect(excitonPolaritonEngine.getState().topologicalChernNumber).toBe(1);

      excitonPolaritonEngine.setRegime('room_temperature_polariton_laser');
      expect(excitonPolaritonEngine.getState().regime).toBe('room_temperature_polariton_laser');
      expect(excitonPolaritonEngine.getState().topologicalChernNumber).toBe(0);
    });

    it('調整拉比分裂能與失諧度並約束邊界數值', () => {
      excitonPolaritonEngine.setRabiSplitting(22.4);
      expect(excitonPolaritonEngine.getState().rabiSplittingMev).toBe(22.4);

      // 上下限防護 (8.0 ~ 30.0 meV)
      excitonPolaritonEngine.setRabiSplitting(2.0);
      expect(excitonPolaritonEngine.getState().rabiSplittingMev).toBe(8.0);
      excitonPolaritonEngine.setRabiSplitting(45.0);
      expect(excitonPolaritonEngine.getState().rabiSplittingMev).toBe(30.0);

      // 失諧度 (-10.0 ~ 10.0 meV)
      excitonPolaritonEngine.setDetuning(4.5);
      expect(excitonPolaritonEngine.getState().cavityDetuningMev).toBe(4.5);
      excitonPolaritonEngine.setDetuning(-25.0);
      expect(excitonPolaritonEngine.getState().cavityDetuningMev).toBe(-10.0);
      excitonPolaritonEngine.setDetuning(35.0);
      expect(excitonPolaritonEngine.getState().cavityDetuningMev).toBe(10.0);
    });

    it('注入拓撲孤子脈衝並累積歷史隊列與光子收穫', () => {
      const prevSolitons = excitonPolaritonEngine.getState().solitonCount;
      const prevPhotons = excitonPolaritonEngine.getState().totalHarvestedPhotonCount;
      excitonPolaritonEngine.injectSolitonPulse();
      const updated = excitonPolaritonEngine.getState();
      expect(updated.solitonCount).toBeGreaterThanOrEqual(prevSolitons);
      expect(updated.totalHarvestedPhotonCount).toBeGreaterThan(prevPhotons);
      expect(updated.solitonHistory.length).toBeGreaterThan(0);
      expect(updated.solitonHistory[0].depthRatio).toBeGreaterThan(0);
    });

    it('更新循環與自動泵浦調製運行', () => {
      excitonPolaritonEngine.toggleAutoPumping();
      const toggled = excitonPolaritonEngine.getState().autoPumpingModulation;
      excitonPolaritonEngine.update(0.1);
      expect(excitonPolaritonEngine.getState().soundVelocityKmPerS).toBeGreaterThan(0);
      if (!toggled) excitonPolaritonEngine.toggleAutoPumping();
    });
  });

  describe('FloquetTimeCrystalEngine (非平衡態 Floquet 預熱拓撲時間晶體)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = floquetTimeCrystalEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.drivePeriodMs).toBeGreaterThan(0);
      expect(state.driveFrequencyKhz).toBeGreaterThan(0);
      expect(state.subharmonicOrder).toBeGreaterThanOrEqual(1);
      expect(state.floquetGapMev).toBeGreaterThan(0);
      expect(state.prethermalLifetimeSec).toBeGreaterThan(0);
      expect(state.timeTranslationSymmetryBreakingPercent).toBeGreaterThan(0);
      expect(state.stroboscopicHistory).toBeDefined();
    });

    it('切換 4 種 Floquet 動力學體制並驗證亞諧波與陳數', () => {
      floquetTimeCrystalEngine.setRegime('subharmonic_2t_time_crystal');
      expect(floquetTimeCrystalEngine.getState().subharmonicOrder).toBe(2);
      expect(floquetTimeCrystalEngine.getState().floquetChernIndex).toBe(0);

      floquetTimeCrystalEngine.setRegime('anomalous_floquet_chern_insulator');
      expect(floquetTimeCrystalEngine.getState().subharmonicOrder).toBe(1);
      expect(floquetTimeCrystalEngine.getState().floquetChernIndex).toBe(1);

      floquetTimeCrystalEngine.setRegime('floquet_prethermal_plateau');
      expect(floquetTimeCrystalEngine.getState().subharmonicOrder).toBe(2);

      floquetTimeCrystalEngine.setRegime('many_body_localized_dtc');
      expect(floquetTimeCrystalEngine.getState().subharmonicOrder).toBe(2);
    });

    it('調整驅動週期與 Floquet 能隙並約束邊界數值', () => {
      floquetTimeCrystalEngine.setDrivePeriod(8.0);
      expect(floquetTimeCrystalEngine.getState().drivePeriodMs).toBe(8.0);
      expect(floquetTimeCrystalEngine.getState().driveFrequencyKhz).toBeCloseTo(1 / 8.0, 2);

      // 上下限 (1.0 ~ 20.0 ms)
      floquetTimeCrystalEngine.setDrivePeriod(0.2);
      expect(floquetTimeCrystalEngine.getState().drivePeriodMs).toBe(1.0);
      floquetTimeCrystalEngine.setDrivePeriod(50.0);
      expect(floquetTimeCrystalEngine.getState().drivePeriodMs).toBe(20.0);

      // 能隙 (2.0 ~ 40.0 meV)
      floquetTimeCrystalEngine.setFloquetGap(18.5);
      expect(floquetTimeCrystalEngine.getState().floquetGapMev).toBe(18.5);
      floquetTimeCrystalEngine.setFloquetGap(0.5);
      expect(floquetTimeCrystalEngine.getState().floquetGapMev).toBe(2.0);
      floquetTimeCrystalEngine.setFloquetGap(99.0);
      expect(floquetTimeCrystalEngine.getState().floquetGapMev).toBe(40.0);
    });

    it('觸發頻閃自旋反轉並產生 2T 交替磁化強度記錄', () => {
      floquetTimeCrystalEngine.triggerCycleFlip();
      const first = floquetTimeCrystalEngine.getState().stroboscopicMagnetization;
      floquetTimeCrystalEngine.triggerCycleFlip();
      const second = floquetTimeCrystalEngine.getState().stroboscopicMagnetization;

      // 奇偶週期自旋方向應相反 (符號相異)
      expect(first * second).toBeLessThan(0);
      expect(floquetTimeCrystalEngine.getState().stroboscopicHistory.length).toBeGreaterThan(0);
    });

    it('更新循環與自動驅動開關', () => {
      floquetTimeCrystalEngine.toggleAutoDriving();
      const toggled = floquetTimeCrystalEngine.getState().autoStroboscopicDriving;
      floquetTimeCrystalEngine.update(0.05);
      expect(floquetTimeCrystalEngine.getState().prethermalLifetimeSec).toBeGreaterThan(0);
      if (!toggled) floquetTimeCrystalEngine.toggleAutoDriving();
    });
  });

  describe('HawkingUnruhDetectorEngine (霍金-安魯效應全息引力對偶量子微波探測器)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = hawkingUnruhDetectorEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.effectiveAcceleration1e18).toBeGreaterThan(0);
      expect(state.hawkingUnruhTempMilliKelvin).toBeGreaterThan(0);
      expect(state.squeezingFactorDb).toBeGreaterThan(0);
      expect(state.microwavePhotonRateMegaHz).toBeGreaterThan(0);
      expect(state.twoModeEntanglementEntropy).toBeGreaterThan(0);
      expect(state.quantumFidelityPercent).toBeGreaterThan(0);
      expect(state.burstHistory).toBeDefined();
    });

    it('切換 4 種全息微波探測體制', () => {
      hawkingUnruhDetectorEngine.setRegime('analog_blackhole_event_horizon');
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(6.5);

      hawkingUnruhDetectorEngine.setRegime('unruh_accelerated_frame_squeezing');
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(8.2);

      hawkingUnruhDetectorEngine.setRegime('two_mode_squeezed_microwave');
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(4.8);

      hawkingUnruhDetectorEngine.setRegime('holographic_ryu_takayanagi_boundary');
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(3.2);
    });

    it('調整等效加速度與壓縮度並約束邊界數值', () => {
      hawkingUnruhDetectorEngine.setAcceleration(5.5);
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(5.5);
      // 安魯溫度驗證: T_U = a * 4.05 mK
      expect(hawkingUnruhDetectorEngine.getState().hawkingUnruhTempMilliKelvin).toBeCloseTo(5.5 * 4.05, 1);

      // 上下限 (1.0 ~ 10.0)
      hawkingUnruhDetectorEngine.setAcceleration(0.1);
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(1.0);
      hawkingUnruhDetectorEngine.setAcceleration(50.0);
      expect(hawkingUnruhDetectorEngine.getState().effectiveAcceleration1e18).toBe(10.0);

      // 壓縮度 (3.0 ~ 20.0 dB)
      hawkingUnruhDetectorEngine.setSqueezingDb(14.0);
      expect(hawkingUnruhDetectorEngine.getState().squeezingFactorDb).toBe(14.0);
      hawkingUnruhDetectorEngine.setSqueezingDb(1.0);
      expect(hawkingUnruhDetectorEngine.getState().squeezingFactorDb).toBe(3.0);
      hawkingUnruhDetectorEngine.setSqueezingDb(30.0);
      expect(hawkingUnruhDetectorEngine.getState().squeezingFactorDb).toBe(20.0);
    });

    it('觸發微波光子暴採集並更新歷史記錄', () => {
      const prevBursts = hawkingUnruhDetectorEngine.getState().totalBurstsDetected;
      hawkingUnruhDetectorEngine.triggerPhotonBurst();
      const updated = hawkingUnruhDetectorEngine.getState();
      expect(updated.totalBurstsDetected).toBe(prevBursts + 1);
      expect(updated.burstHistory.length).toBeGreaterThan(0);
      expect(updated.burstHistory[0].frequencyGhz).toBeGreaterThan(0);
    });

    it('更新循環與自動視界漲落', () => {
      hawkingUnruhDetectorEngine.toggleAutoFluctuation();
      const toggled = hawkingUnruhDetectorEngine.getState().autoHorizonFluctuation;
      hawkingUnruhDetectorEngine.update(0.05);
      expect(hawkingUnruhDetectorEngine.getState().twoModeEntanglementEntropy).toBeGreaterThan(0);
      if (!toggled) hawkingUnruhDetectorEngine.toggleAutoFluctuation();
    });
  });

  describe('AharonovCasherEngine (阿哈羅諾夫-卡舍爾中性費米子自旋拓撲干涉儀)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = aharonovCasherEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.lineChargeDensityNCPerM).toBeDefined();
      expect(state.acGeometricPhaseRad).toBeDefined();
      expect(state.spinConductanceG0).toBeGreaterThanOrEqual(0);
      expect(state.rashbaCouplingPicoEVm).toBeGreaterThanOrEqual(0);
      expect(state.spinPrecessionAngleDeg).toBeGreaterThanOrEqual(0);
      expect(state.spinPolarizationPercent).toBeGreaterThan(0);
      expect(state.interferenceContrastRatio).toBeGreaterThan(0);
      expect(state.telemetryHistory).toBeDefined();
    });

    it('切換 4 種自旋拓撲體制', () => {
      aharonovCasherEngine.setRegime('neutral_neutron_geometric_phase');
      expect(aharonovCasherEngine.getState().regime).toBe('neutral_neutron_geometric_phase');

      aharonovCasherEngine.setRegime('rashba_spin_orbit_nanoring');
      expect(aharonovCasherEngine.getState().regime).toBe('rashba_spin_orbit_nanoring');

      aharonovCasherEngine.setRegime('magnon_spin_wave_interference');
      expect(aharonovCasherEngine.getState().regime).toBe('magnon_spin_wave_interference');

      aharonovCasherEngine.setRegime('duality_flux_spin_topological_gate');
      expect(aharonovCasherEngine.getState().regime).toBe('duality_flux_spin_topological_gate');
    });

    it('調整線電荷密度與 Rashba 耦合並驗證 AC 相位與導納調製', () => {
      // 當 λ = 0 時，Φ_AC = 0，G 應達到最大值 1.0 G_0
      aharonovCasherEngine.setLineCharge(0.0);
      expect(aharonovCasherEngine.getState().acGeometricPhaseRad).toBe(0.0);
      expect(aharonovCasherEngine.getState().spinConductanceG0).toBe(1.0);

      // 當 λ = 8.5 nC/m 時，Φ_AC = π，發生相消干涉，G 降至極低陷波
      aharonovCasherEngine.setLineCharge(8.5);
      expect(aharonovCasherEngine.getState().acGeometricPhaseRad).toBeCloseTo(Math.PI, 2);
      expect(aharonovCasherEngine.getState().spinConductanceG0).toBeLessThan(0.1);

      // 邊界防護 (-20.0 ~ 20.0)
      aharonovCasherEngine.setLineCharge(-35.0);
      expect(aharonovCasherEngine.getState().lineChargeDensityNCPerM).toBe(-20.0);
      aharonovCasherEngine.setLineCharge(45.0);
      expect(aharonovCasherEngine.getState().lineChargeDensityNCPerM).toBe(20.0);

      // Rashba 耦合防護 (0.0 ~ 50.0)
      aharonovCasherEngine.setRashbaCoupling(30.0);
      expect(aharonovCasherEngine.getState().rashbaCouplingPicoEVm).toBe(30.0);
      aharonovCasherEngine.setRashbaCoupling(-5.0);
      expect(aharonovCasherEngine.getState().rashbaCouplingPicoEVm).toBe(0.0);
      aharonovCasherEngine.setRashbaCoupling(100.0);
      expect(aharonovCasherEngine.getState().rashbaCouplingPicoEVm).toBe(50.0);
    });

    it('採樣自旋干涉事件並記錄歷史', () => {
      const prevTotal = aharonovCasherEngine.getState().totalInterferenceEvents;
      aharonovCasherEngine.recordInterferenceShot();
      const updated = aharonovCasherEngine.getState();
      expect(updated.totalInterferenceEvents).toBe(prevTotal + 1);
      expect(updated.telemetryHistory.length).toBeGreaterThan(0);
      expect(updated.telemetryHistory[0].polarizationPurity).toBeGreaterThan(0);
    });

    it('更新循環與自動閘極掃描', () => {
      aharonovCasherEngine.toggleAutoSweep();
      const toggled = aharonovCasherEngine.getState().autoGateSweep;
      aharonovCasherEngine.update(0.05);
      expect(aharonovCasherEngine.getState().spinConductanceG0).toBeGreaterThanOrEqual(0);
      if (!toggled) aharonovCasherEngine.toggleAutoSweep();
    });
  });

  describe('Achievements Integration (成就系統擴充驗證)', () => {
    it('應具備總計至少 116 個成就', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(116);
    });

    it('應能成功解鎖 4 個 Part 25 全新成就', () => {
      achievements.unlock('exciton_polariton_condensate');
      expect(achievements.isUnlocked('exciton_polariton_condensate')).toBe(true);

      achievements.unlock('floquet_time_crystal');
      expect(achievements.isUnlocked('floquet_time_crystal')).toBe(true);

      achievements.unlock('hawking_unruh_detector');
      expect(achievements.isUnlocked('hawking_unruh_detector')).toBe(true);

      achievements.unlock('aharonov_casher_interferometer');
      expect(achievements.isUnlocked('aharonov_casher_interferometer')).toBe(true);
    });
  });
});
