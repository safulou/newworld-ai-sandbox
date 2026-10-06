import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rainbowGravitonEngine } from '../rainbowGravitonMesh';
import { acousticBlackHoleEngine } from '../acousticBlackHole';
import { manyBodyScarredEngine } from '../manyBodyScarredTimeCrystal';
import { higherOrderTopoEngine } from '../higherOrderTopoSuperconductor';
import { achievements } from '../achievements';

describe('Part 22: Rainbow Metric, Acoustic Black Hole, Scarred Time Crystal & Corner State HOTSC', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('RainbowGravitonEngine (宇宙弦重力子彩虹度規探測網)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = rainbowGravitonEngine.getState();
      expect(state.model).toBeDefined();
      expect(state.probeEnergyRatio).toBeGreaterThan(0);
      expect(state.metricFactorF).toBeGreaterThan(0);
      expect(state.metricFactorG).toBeGreaterThan(0);
      expect(state.phaseVelocityC).toBeGreaterThan(0);
      expect(state.effectiveCurvature).toBeGreaterThanOrEqual(0);
      expect(state.rainbowFlux).toBeGreaterThanOrEqual(0);
    });

    it('切換 4 種彩虹能譜體制並正確重算度規因子', () => {
      rainbowGravitonEngine.setModel('planck_dispersion');
      expect(rainbowGravitonEngine.getState().model).toBe('planck_dispersion');
      expect(rainbowGravitonEngine.getState().metricFactorF).toBe(1.0);

      rainbowGravitonEngine.setModel('string_scattering');
      expect(rainbowGravitonEngine.getState().model).toBe('string_scattering');

      rainbowGravitonEngine.setModel('cosmic_microlens');
      expect(rainbowGravitonEngine.getState().model).toBe('cosmic_microlens');

      rainbowGravitonEngine.setModel('lqg_minimal_length');
      expect(rainbowGravitonEngine.getState().model).toBe('lqg_minimal_length');
    });

    it('設定探測能量尺度並驗證數值約束 (0.01 ~ 1.00)', () => {
      rainbowGravitonEngine.setProbeEnergy(0.75);
      expect(rainbowGravitonEngine.getState().probeEnergyRatio).toBe(0.75);

      // 上下限約束
      rainbowGravitonEngine.setProbeEnergy(-0.5);
      expect(rainbowGravitonEngine.getState().probeEnergyRatio).toBe(0.01);

      rainbowGravitonEngine.setProbeEnergy(2.5);
      expect(rainbowGravitonEngine.getState().probeEnergyRatio).toBe(1.0);
    });

    it('捕獲宇宙弦重力子暴並更新封包佇列與通量', () => {
      const prevBursts = rainbowGravitonEngine.getState().totalBurstsDetected;
      const prevFlux = rainbowGravitonEngine.getState().rainbowFlux;

      const packet = rainbowGravitonEngine.triggerGravitonCapture();
      expect(packet.id).toMatch(/^graviton-/);
      expect(packet.energyRatio).toBeGreaterThan(0);
      expect(packet.wavelengthNm).toBeGreaterThan(0);
      expect(packet.groupDelayPs).toBeGreaterThanOrEqual(0);
      expect(packet.snr).toBeGreaterThan(0);

      const state = rainbowGravitonEngine.getState();
      expect(state.totalBurstsDetected).toBe(prevBursts + 1);
      expect(state.rainbowFlux).toBeGreaterThan(prevFlux);
      expect(state.detectedPackets.length).toBeGreaterThanOrEqual(1);
    });

    it('校準度規網與自動校準更新循環', () => {
      const prevCalib = rainbowGravitonEngine.getState().meshCalibrationLevel;
      rainbowGravitonEngine.calibrateMesh();
      expect(rainbowGravitonEngine.getState().meshCalibrationLevel).toBeGreaterThanOrEqual(prevCalib);

      rainbowGravitonEngine.setAutoCalibrate(true);
      expect(rainbowGravitonEngine.getState().autoCalibrate).toBe(true);

      const prevFlux = rainbowGravitonEngine.getState().rainbowFlux;
      rainbowGravitonEngine.update(0.5);
      expect(rainbowGravitonEngine.getState().rainbowFlux).toBeGreaterThan(prevFlux);
    });
  });

  describe('AcousticBlackHoleEngine (超流真空聲學事件視界發電機)', () => {
    it('應正確初始化並返回預設聲學流體狀態', () => {
      const state = acousticBlackHoleEngine.getState();
      expect(state.mode).toBeDefined();
      expect(state.machNumber).toBeGreaterThan(0);
      expect(state.soundSpeedMs).toBeGreaterThan(0);
      expect(state.fluidVelocityMs).toBeGreaterThan(0);
      expect(state.acousticDynamoPowerKw).toBeGreaterThan(0);
    });

    it('切換 4 大運作架構並調控渦旋與馬赫數', () => {
      acousticBlackHoleEngine.setMode('vortex_kerr');
      expect(acousticBlackHoleEngine.getState().mode).toBe('vortex_kerr');

      acousticBlackHoleEngine.setMachNumber(2.2);
      expect(acousticBlackHoleEngine.getState().machNumber).toBe(2.2);
      expect(acousticBlackHoleEngine.getState().hawkingTemperatureNkT).toBeGreaterThan(0);

      acousticBlackHoleEngine.setVortexCirculation(5.0);
      expect(acousticBlackHoleEngine.getState().vortexCirculation).toBe(5.0);
      expect(acousticBlackHoleEngine.getState().superradianceGainDb).toBeGreaterThan(0);
    });

    it('採集霍金聲子對並驗證糾纏保真度與逃逸標記', () => {
      const prevPhonons = acousticBlackHoleEngine.getState().totalPhononsHarvested;
      const prevEnergy = acousticBlackHoleEngine.getState().harvestedPhononEnergy;

      const pair = acousticBlackHoleEngine.harvestHawkingPhonons();
      expect(pair.id).toMatch(/^phonon-/);
      expect(pair.energyEv).toBeGreaterThan(0);
      expect(pair.frequencyKhz).toBeGreaterThan(0);
      expect(pair.entanglementFidelity).toBeGreaterThan(0);
      expect(typeof pair.escaped).toBe('boolean');

      const state = acousticBlackHoleEngine.getState();
      expect(state.totalPhononsHarvested).toBe(prevPhonons + 1);
      expect(state.harvestedPhononEnergy).toBeGreaterThan(prevEnergy);
      expect(state.phononPairs.length).toBeGreaterThanOrEqual(1);
    });

    it('觸發超音速聲爆過渡與發電機更新循環', () => {
      const prevMach = acousticBlackHoleEngine.getState().machNumber;
      expect(prevMach).toBeGreaterThan(0);
      acousticBlackHoleEngine.triggerSonicBoomTransition();
      expect(acousticBlackHoleEngine.getState().machNumber).toBeGreaterThanOrEqual(1.0);
      expect(acousticBlackHoleEngine.getState().machNumber).not.toBe(0);

      const prevEnergy = acousticBlackHoleEngine.getState().harvestedPhononEnergy;
      acousticBlackHoleEngine.setAutoHarvest(true);
      acousticBlackHoleEngine.update(1.0);
      expect(acousticBlackHoleEngine.getState().harvestedPhononEnergy).toBeGreaterThan(prevEnergy);
    });
  });

  describe('ManyBodyScarredTimeCrystalEngine (量子多體疤痕時間晶體調諧器)', () => {
    it('應正確初始化並返回非熱化低糾纏狀態', () => {
      const state = manyBodyScarredEngine.getState();
      expect(state.topology).toBeDefined();
      expect(state.subharmonicMultiplier).toBeGreaterThanOrEqual(2);
      expect(state.entanglementEntropy).toBeLessThan(1.0); // 低糾纏疤痕特徵
      expect(state.revivalFidelityPercent).toBeGreaterThan(50);
      expect(state.timeCrystalFlux).toBeGreaterThan(0);
    });

    it('切換拓撲架構並設定亞諧波倍增週期 (2T, 3T, 4T)', () => {
      manyBodyScarredEngine.setTopology('pxp_rydberg_chain');
      expect(manyBodyScarredEngine.getState().subharmonicMultiplier).toBe(2);

      manyBodyScarredEngine.setTopology('flat_band_scar');
      expect(manyBodyScarredEngine.getState().subharmonicMultiplier).toBe(3);

      manyBodyScarredEngine.setTopology('athermal_rubidium');
      expect(manyBodyScarredEngine.getState().subharmonicMultiplier).toBe(4);

      manyBodyScarredEngine.setTopology('floquet_subharmonic_dtc');
      expect(manyBodyScarredEngine.getState().subharmonicMultiplier).toBe(2);
    });

    it('調節驅動頻率與翻轉角並重算復甦保真度', () => {
      manyBodyScarredEngine.setDrivingFrequency(60.0);
      expect(manyBodyScarredEngine.getState().drivingFrequencyHz).toBe(60.0);

      manyBodyScarredEngine.setFlipAngle(3.14159);
      expect(manyBodyScarredEngine.getState().revivalFidelityPercent).toBeGreaterThan(80.0);
    });

    it('激發疤痕復甦脈衝與 PXP 躍遷阻斷鐘響', () => {
      const prevCycles = manyBodyScarredEngine.getState().totalCyclesTuned;
      const prevFlux = manyBodyScarredEngine.getState().timeCrystalFlux;

      const record = manyBodyScarredEngine.triggerScarPulse();
      expect(record.id).toMatch(/^scar-/);
      expect(record.harmonicRatio).toContain('T');
      expect(record.revivalFidelity).toBeGreaterThan(0);
      expect(record.subharmonicPeakDb).toBeGreaterThan(0);

      const state = manyBodyScarredEngine.getState();
      expect(state.totalCyclesTuned).toBe(prevCycles + 1);
      expect(state.timeCrystalFlux).toBeGreaterThan(prevFlux);

      manyBodyScarredEngine.triggerPxpRevival();
      expect(manyBodyScarredEngine.getState().timeCrystalFlux).toBeGreaterThan(prevFlux + 60);
    });
  });

  describe('HigherOrderTopoSuperconductorEngine (拓撲超導高階角態量子中繼陣列)', () => {
    it('應正確初始化並體現四極矩零能角態束縛特徵', () => {
      const state = higherOrderTopoEngine.getState();
      expect(state.architecture).toBeDefined();
      expect(state.quadrupoleMass).toBeGreaterThan(0);
      expect(state.bulkGapMev).toBeGreaterThan(0);
      expect(state.majoranaZeroEnergyMev).toBeLessThan(0.01); // 極致逼近 0 能
      expect(state.braidingFidelityPercent).toBeGreaterThan(95.0);
      expect(state.relayEntanglementFidelity).toBeGreaterThan(0.9);
    });

    it('切換 4 大拓撲角態架構與調控四極矩質量', () => {
      higherOrderTopoEngine.setArchitecture('hinge_mode_bismuth');
      expect(higherOrderTopoEngine.getState().architecture).toBe('hinge_mode_bismuth');

      higherOrderTopoEngine.setQuadrupoleMass(1.4);
      expect(higherOrderTopoEngine.getState().quadrupoleMass).toBe(1.4);
      expect(higherOrderTopoEngine.getState().bulkGapMev).toBeGreaterThan(0);
      expect(higherOrderTopoEngine.getState().cornerLocalizationLengthNm).toBeGreaterThan(0);
    });

    it('執行馬約拉納角態非阿貝爾幾何編織操作', () => {
      const prevBraids = higherOrderTopoEngine.getState().totalBraidsExecuted;
      const prevFlux = higherOrderTopoEngine.getState().cornerFlux;

      const op = higherOrderTopoEngine.performMajoranaBraid(1, 2);
      expect(op.id).toMatch(/^braid-/);
      expect(op.braidedCorners).toEqual([1, 2]);
      expect(op.topologicalPhaseDeg).toBeGreaterThan(0);
      expect(op.fidelityPercent).toBeGreaterThan(90);
      expect(op.entangledQubits).toBeGreaterThan(0);

      const state = higherOrderTopoEngine.getState();
      expect(state.totalBraidsExecuted).toBe(prevBraids + 1);
      expect(state.cornerFlux).toBeGreaterThan(prevFlux);
      expect(state.braidHistory.length).toBeGreaterThanOrEqual(1);
    });

    it('傳輸糾纏密鑰與更新驅動循環', () => {
      const prevFlux = higherOrderTopoEngine.getState().cornerFlux;
      higherOrderTopoEngine.transmitEntangledKey();
      expect(higherOrderTopoEngine.getState().cornerFlux).toBeGreaterThan(prevFlux);

      higherOrderTopoEngine.setAutoBraid(true);
      higherOrderTopoEngine.update(1.0);
      expect(higherOrderTopoEngine.getState().cornerFlux).toBeGreaterThan(prevFlux + 80);
    });
  });

  describe('Achievements Expansion (成就殿堂擴充至 104 項終極里程碑)', () => {
    it('成就總數應達到至少 104 項', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(104);
    });

    it('應包含 Part 22 四大全新前沿成就定義', () => {
      const all = achievements.getAll();
      const ids = all.map(a => a.id);
      expect(ids).toContain('rainbow_graviton_prism');
      expect(ids).toContain('acoustic_hawking_harvester');
      expect(ids).toContain('scarred_time_crystal_chronos');
      expect(ids).toContain('higher_order_corner_braider');
    });
  });
});
