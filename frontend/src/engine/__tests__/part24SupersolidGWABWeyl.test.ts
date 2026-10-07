import { describe, it, expect, beforeEach, vi } from 'vitest';
import { topologicalSupersolidEngine } from '../topologicalSupersolid';
import { primordialGWEngine } from '../primordialGravitationalWave';
import { aharonovBohmEngine } from '../aharonovBohmRing';
import { weylChiralEngine } from '../weylChiralAnomaly';
import { achievements } from '../achievements';

describe('Part 24: Topological Supersolid, Primordial GW, Aharonov-Bohm Ring & Weyl Chiral Anomaly', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('TopologicalSupersolidEngine (拓撲超固體量子渦旋流動反應堆)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = topologicalSupersolidEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.dipolarInteractionRatio).toBeGreaterThan(0);
      expect(state.rotonMinimumEnergyKhz).toBeGreaterThan(0);
      expect(state.superfluidFractionPercent).toBeGreaterThan(0);
      expect(state.dropletCount).toBeGreaterThanOrEqual(7);
      expect(state.rotationalInertiaFraction).toBeGreaterThan(0);
      expect(state.vortexHistory).toBeDefined();
    });

    it('切換 4 種超固體體制並驗證雙重對稱破缺重算', () => {
      topologicalSupersolidEngine.setRegime('roton_excitation_condensate');
      expect(topologicalSupersolidEngine.getState().regime).toBe('roton_excitation_condensate');

      topologicalSupersolidEngine.setRegime('quantized_vortex_lattice');
      expect(topologicalSupersolidEngine.getState().regime).toBe('quantized_vortex_lattice');

      topologicalSupersolidEngine.setRegime('non_classical_rotational_inertia');
      expect(topologicalSupersolidEngine.getState().regime).toBe('non_classical_rotational_inertia');

      topologicalSupersolidEngine.setRegime('droplet_crystal_superfluid');
      expect(topologicalSupersolidEngine.getState().regime).toBe('droplet_crystal_superfluid');
    });

    it('調整偶極相互作用比與羅頓能級並約束邊界', () => {
      topologicalSupersolidEngine.setDipolarRatio(1.85);
      expect(topologicalSupersolidEngine.getState().dipolarInteractionRatio).toBe(1.85);

      // 上下限防護 (0.5 ~ 2.5)
      topologicalSupersolidEngine.setDipolarRatio(0.1);
      expect(topologicalSupersolidEngine.getState().dipolarInteractionRatio).toBe(0.5);
      topologicalSupersolidEngine.setDipolarRatio(4.0);
      expect(topologicalSupersolidEngine.getState().dipolarInteractionRatio).toBe(2.5);

      // 羅頓極小值 (0.1 ~ 15.0 kHz)
      topologicalSupersolidEngine.setRotonMinimumKhz(3.5);
      expect(topologicalSupersolidEngine.getState().rotonMinimumEnergyKhz).toBe(3.5);
      topologicalSupersolidEngine.setRotonMinimumKhz(0.01);
      expect(topologicalSupersolidEngine.getState().rotonMinimumEnergyKhz).toBe(0.1);
      topologicalSupersolidEngine.setRotonMinimumKhz(30.0);
      expect(topologicalSupersolidEngine.getState().rotonMinimumEnergyKhz).toBe(15.0);
    });

    it('成核激發量子化渦旋線、羅頓共振與自動更新循環', () => {
      const prevVortices = topologicalSupersolidEngine.getState().totalVorticesNucleated;
      const prevFlux = topologicalSupersolidEngine.getState().supersolidEnergyFlux;

      const vortex = topologicalSupersolidEngine.nucleateVortex();
      expect(vortex.id).toMatch(/^vortex-/);
      expect(vortex.coreRadiusNm).toBeGreaterThan(0);
      expect(vortex.circulationQuantum).toBe(1);
      expect(vortex.superfluidFraction).toBeGreaterThan(0);

      const state = topologicalSupersolidEngine.getState();
      expect(state.totalVorticesNucleated).toBe(prevVortices + 1);
      expect(state.supersolidEnergyFlux).toBeGreaterThan(prevFlux);
      expect(state.vortexHistory.length).toBeGreaterThanOrEqual(1);

      // 羅頓共振激波
      topologicalSupersolidEngine.triggerRotonResonance();
      expect(topologicalSupersolidEngine.getState().rotonMinimumEnergyKhz).toBe(0.5);

      // 自動渦旋成核更新
      topologicalSupersolidEngine.setAutoVortexInjection(true);
      expect(topologicalSupersolidEngine.getState().autoVortexInjection).toBe(true);
      const fluxBefore = topologicalSupersolidEngine.getState().supersolidEnergyFlux;
      topologicalSupersolidEngine.update(0.5);
      expect(topologicalSupersolidEngine.getState().supersolidEnergyFlux).toBeGreaterThan(fluxBefore);
    });
  });

  describe('PrimordialGravitationalWaveEngine (太初原初引力波隨機背景干涉儀)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = primordialGWEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.tensorToScalarRatioR).toBeGreaterThan(0);
      expect(state.interferometerArmLengthGm).toBeGreaterThan(0);
      expect(state.detectorSensitivitySnr).toBeGreaterThan(0);
      expect(state.hellingsDownsCorrelation).toBeGreaterThan(0);
      expect(state.waveHistory).toBeDefined();
    });

    it('切換 4 種隨機引力波背景體制與臂長調節', () => {
      primordialGWEngine.setRegime('first_order_electroweak_pt');
      expect(primordialGWEngine.getState().regime).toBe('first_order_electroweak_pt');

      primordialGWEngine.setRegime('primordial_black_hole_merger');
      expect(primordialGWEngine.getState().regime).toBe('primordial_black_hole_merger');

      primordialGWEngine.setRegime('cosmic_string_loop_kinks');
      expect(primordialGWEngine.getState().regime).toBe('cosmic_string_loop_kinks');

      primordialGWEngine.setRegime('slow_roll_inflation_tensor');
      expect(primordialGWEngine.getState().regime).toBe('slow_roll_inflation_tensor');

      // 臂長調節 (1.0 ~ 5.0 Gm)
      primordialGWEngine.setArmLengthGm(3.8);
      expect(primordialGWEngine.getState().interferometerArmLengthGm).toBe(3.8);
      primordialGWEngine.setArmLengthGm(0.2);
      expect(primordialGWEngine.getState().interferometerArmLengthGm).toBe(1.0);
      primordialGWEngine.setArmLengthGm(10.0);
      expect(primordialGWEngine.getState().interferometerArmLengthGm).toBe(5.0);
    });

    it('調控張量標量比 r (0.001 ~ 0.050) 並約束邊界', () => {
      primordialGWEngine.setTensorRatioR(0.045);
      expect(primordialGWEngine.getState().tensorToScalarRatioR).toBe(0.045);

      primordialGWEngine.setTensorRatioR(0.0001);
      expect(primordialGWEngine.getState().tensorToScalarRatioR).toBe(0.001);

      primordialGWEngine.setTensorRatioR(0.1);
      expect(primordialGWEngine.getState().tensorToScalarRatioR).toBe(0.050);
    });

    it('捕獲原初張量引力波包、TDI 相位校準與自動追蹤更新', () => {
      const prevPackets = primordialGWEngine.getState().detectedPacketsCount;
      const prevEnergy = primordialGWEngine.getState().totalEnergyHarvestedEv;

      const packet = primordialGWEngine.captureStrainPacket();
      expect(packet.id).toMatch(/^gw-/);
      expect(packet.centralFrequencyHz).toBeGreaterThan(0);
      expect(packet.crossCorrelationSnr).toBeGreaterThan(0);
      expect(['plus', 'cross', 'mixed']).toContain(packet.tensorPolarization);

      const state = primordialGWEngine.getState();
      expect(state.detectedPacketsCount).toBe(prevPackets + 1);
      expect(state.totalEnergyHarvestedEv).toBeGreaterThan(prevEnergy);
      expect(state.waveHistory.length).toBeGreaterThanOrEqual(1);

      // TDI 校準
      primordialGWEngine.calibrateInterferometer();
      expect(primordialGWEngine.getState().detectorSensitivitySnr).toBeGreaterThan(0);

      // 自動追蹤與更新
      primordialGWEngine.setAutoTracking(true);
      expect(primordialGWEngine.getState().autoCorrelationTracking).toBe(true);
      const energyBefore = primordialGWEngine.getState().totalEnergyHarvestedEv;
      primordialGWEngine.update(0.5);
      expect(primordialGWEngine.getState().totalEnergyHarvestedEv).toBeGreaterThan(energyBefore);
    });
  });

  describe('AharonovBohmRingEngine (阿哈羅諾夫-玻姆幾何相位超導環陣列)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = aharonovBohmEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.magneticFluxRatio).toBeGreaterThanOrEqual(0);
      expect(state.ringRadiusNm).toBeGreaterThan(0);
      expect(state.interferenceVisibilityPercent).toBeGreaterThan(0);
      expect(state.phaseCoherenceLengthUm).toBeGreaterThan(0);
      expect(state.currentHistory).toBeDefined();
    });

    it('切換 4 種幾何相位干涉體制與超導環半徑', () => {
      aharonovBohmEngine.setRegime('aharonov_casher_spin_topological');
      expect(aharonovBohmEngine.getState().regime).toBe('aharonov_casher_spin_topological');

      aharonovBohmEngine.setRegime('mesoscopic_quantum_ring_multipath');
      expect(aharonovBohmEngine.getState().regime).toBe('mesoscopic_quantum_ring_multipath');

      aharonovBohmEngine.setRegime('topological_flux_qubit_coherence');
      expect(aharonovBohmEngine.getState().regime).toBe('topological_flux_qubit_coherence');

      aharonovBohmEngine.setRegime('fractional_flux_persistent_current');
      expect(aharonovBohmEngine.getState().regime).toBe('fractional_flux_persistent_current');

      // 半徑調節 (50 ~ 500 nm)
      aharonovBohmEngine.setRingRadiusNm(250.0);
      expect(aharonovBohmEngine.getState().ringRadiusNm).toBe(250.0);
      aharonovBohmEngine.setRingRadiusNm(20.0);
      expect(aharonovBohmEngine.getState().ringRadiusNm).toBe(50.0);
      aharonovBohmEngine.setRingRadiusNm(800.0);
      expect(aharonovBohmEngine.getState().ringRadiusNm).toBe(500.0);
    });

    it('調整磁通量子比 Φ/Φ₀ (0.0 ~ 3.0) 並計算幾何相位與持續電流', () => {
      aharonovBohmEngine.setFluxRatio(1.25);
      expect(aharonovBohmEngine.getState().magneticFluxRatio).toBe(1.25);
      expect(aharonovBohmEngine.getState().geometricPhaseRad).toBeGreaterThanOrEqual(0);

      // 上下限約束
      aharonovBohmEngine.setFluxRatio(-0.5);
      expect(aharonovBohmEngine.getState().magneticFluxRatio).toBe(0.0);
      aharonovBohmEngine.setFluxRatio(5.0);
      expect(aharonovBohmEngine.getState().magneticFluxRatio).toBe(3.0);
    });

    it('採樣持續超導量子干涉、鎖定最佳磁通與自動調變循環', () => {
      const prevQuanta = aharonovBohmEngine.getState().totalFluxQuantaCount;
      const prevFlux = aharonovBohmEngine.getState().persistentEnergyFlux;

      const log = aharonovBohmEngine.sampleInterference();
      expect(log.id).toMatch(/^ab-/);
      expect(log.interferenceVisibility).toBeGreaterThan(0);

      const state = aharonovBohmEngine.getState();
      expect(state.totalFluxQuantaCount).toBe(prevQuanta + 1);
      expect(state.persistentEnergyFlux).toBeGreaterThan(prevFlux);
      expect(state.currentHistory.length).toBeGreaterThanOrEqual(1);

      // 鎖定 0.25 磁通極大值
      aharonovBohmEngine.lockOptimumPersistentFlux();
      expect(aharonovBohmEngine.getState().magneticFluxRatio).toBe(0.25);

      // 自動調變與更新
      aharonovBohmEngine.setAutoModulation(true);
      expect(aharonovBohmEngine.getState().autoFluxModulation).toBe(true);
      const fluxBefore = aharonovBohmEngine.getState().persistentEnergyFlux;
      aharonovBohmEngine.update(0.5);
      expect(aharonovBohmEngine.getState().persistentEnergyFlux).toBeGreaterThan(fluxBefore);
    });
  });

  describe('WeylChiralAnomalyEngine (超對稱外爾費米子手性反常能源核)', () => {
    it('應正確初始化並返回預設狀態', () => {
      const state = weylChiralEngine.getState();
      expect(state.regime).toBeDefined();
      expect(state.electricFieldVPerM).toBeGreaterThan(0);
      expect(state.magneticFieldTesla).toBeGreaterThan(0);
      expect(state.chiralChemicalPotentialMev).toBeGreaterThan(0);
      expect(state.axialConductivityMs).toBeGreaterThan(0);
      expect(state.fermiArcLengthNm).toBeGreaterThan(0);
      expect(state.pumpingHistory).toBeDefined();
    });

    it('切換 4 種手性反常能源體制與電磁場強度調節', () => {
      weylChiralEngine.setRegime('chiral_magnetic_axial_current');
      expect(weylChiralEngine.getState().regime).toBe('chiral_magnetic_axial_current');

      weylChiralEngine.setRegime('non_abelian_berry_monopole');
      expect(weylChiralEngine.getState().regime).toBe('non_abelian_berry_monopole');

      weylChiralEngine.setRegime('supersymmetric_partner_fermion');
      expect(weylChiralEngine.getState().regime).toBe('supersymmetric_partner_fermion');

      weylChiralEngine.setRegime('weyl_node_chiral_charge_pumping');
      expect(weylChiralEngine.getState().regime).toBe('weyl_node_chiral_charge_pumping');

      // 電場 E (10 ~ 500 V/m)
      weylChiralEngine.setElectricField(250.0);
      expect(weylChiralEngine.getState().electricFieldVPerM).toBe(250.0);
      weylChiralEngine.setElectricField(2.0);
      expect(weylChiralEngine.getState().electricFieldVPerM).toBe(10.0);
      weylChiralEngine.setElectricField(800.0);
      expect(weylChiralEngine.getState().electricFieldVPerM).toBe(500.0);

      // 磁場 B (0.5 ~ 14.0 T)
      weylChiralEngine.setMagneticField(9.5);
      expect(weylChiralEngine.getState().magneticFieldTesla).toBe(9.5);
      weylChiralEngine.setMagneticField(0.1);
      expect(weylChiralEngine.getState().magneticFieldTesla).toBe(0.5);
      weylChiralEngine.setMagneticField(20.0);
      expect(weylChiralEngine.getState().magneticFieldTesla).toBe(14.0);
    });

    it('觸發外爾手性反常電荷泵浦、超對稱增益與更新循環', () => {
      const prevEvents = weylChiralEngine.getState().totalPumpingEventsCount;
      const prevFlux = weylChiralEngine.getState().chiralEnergyFlux;

      const event = weylChiralEngine.triggerChiralPump();
      expect(event.id).toMatch(/^chiral-/);
      expect(event.edotBProduct).toBeGreaterThan(0);
      expect(event.axialCurrentDensityAmp).toBeGreaterThan(0);

      const state = weylChiralEngine.getState();
      expect(state.totalPumpingEventsCount).toBe(prevEvents + 1);
      expect(state.chiralEnergyFlux).toBeGreaterThan(prevFlux);
      expect(state.pumpingHistory.length).toBeGreaterThanOrEqual(1);

      // 超對稱相變增益
      weylChiralEngine.triggerSupersymmetricBoost();
      expect(weylChiralEngine.getState().magneticFieldTesla).toBe(12.0);

      // 自動泵浦與更新
      weylChiralEngine.setAutoPumping(true);
      expect(weylChiralEngine.getState().autoPumping).toBe(true);
      const fluxBefore = weylChiralEngine.getState().chiralEnergyFlux;
      weylChiralEngine.update(0.5);
      expect(weylChiralEngine.getState().chiralEnergyFlux).toBeGreaterThan(fluxBefore);
    });
  });

  describe('Part 24 成就系統驗證', () => {
    it('應擴展包含至少 112 項成就，並包含 Part 24 四項專屬成就', () => {
      const all = achievements.getAll();
      expect(all.length).toBeGreaterThanOrEqual(112);

      const supersolidAch = all.find(a => a.id === 'supersolid_vortex_conductor');
      expect(supersolidAch).toBeDefined();
      expect(supersolidAch?.title).toContain('超固體');

      const gwAch = all.find(a => a.id === 'primordial_gw_astronomer');
      expect(gwAch).toBeDefined();
      expect(gwAch?.title).toContain('引力波');

      const abAch = all.find(a => a.id === 'aharonov_bohm_interferometer');
      expect(abAch).toBeDefined();
      expect(abAch?.title).toContain('阿哈羅諾夫');

      const weylAch = all.find(a => a.id === 'weyl_chiral_anomaly_harnesser');
      expect(weylAch).toBeDefined();
      expect(weylAch?.title).toContain('外爾');
    });
  });
});
