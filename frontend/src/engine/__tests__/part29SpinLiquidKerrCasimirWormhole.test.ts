import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fractionalSpinLiquidEngine } from '../fractionalSpinLiquid';
import { kerrPhotonShadowEngine } from '../kerrPhotonShadow';
import { repulsiveCasimirMotorEngine } from '../repulsiveCasimirMotor';
import { multiBoundaryWormholeEngine } from '../multiBoundaryWormhole';

describe('Part 29: 拓撲自旋液體、克爾光子陰影、斥力卡西米爾與多端蟲洞測試套件', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. 拓撲分數量子自旋液體與基塔耶夫蜂巢晶格反應堆 (fractionalSpinLiquid)', () => {
    it('應正確初始化並提供合理的自旋液體物理預設值', () => {
      fractionalSpinLiquidEngine.resetDefaults();
      const state = fractionalSpinLiquidEngine.getState();
      expect(state.exchangeJxMev).toBeGreaterThan(0);
      expect(state.exchangeJyMev).toBeGreaterThan(0);
      expect(state.exchangeJzMev).toBeGreaterThan(0);
      expect(state.magneticFieldTesla).toBeGreaterThanOrEqual(0);
      expect(state.temperatureKelvin).toBeGreaterThan(0);
      expect(state.topologicalEntanglementEntropy).toBeCloseTo(0.693, 2); // ln 2
      expect(state.thermalHallConductanceRatio).toBeGreaterThan(0);
    });

    it('應正確調諧交換常數與磁場並進行邊界約束', () => {
      fractionalSpinLiquidEngine.setParameters({
        exchangeJxMev: 25.0, // 超過 20 上限
        exchangeJyMev: 0.1,  // 低於 1.0 下限
        magneticFieldTesla: 12.0, // 超過 10.0 上限
        temperatureKelvin: 0.001 // 低於 0.01 下限
      });
      const state = fractionalSpinLiquidEngine.getState();
      expect(state.exchangeJxMev).toBe(20.0);
      expect(state.exchangeJyMev).toBe(1.0);
      expect(state.magneticFieldTesla).toBe(10.0);
      expect(state.temperatureKelvin).toBe(0.01);
    });

    it('切換不同相態時應正確更新 regime 並重算拓撲指標', () => {
      fractionalSpinLiquidEngine.setParameters({ regime: 'toric-code-abelian' });
      expect(fractionalSpinLiquidEngine.getState().regime).toBe('toric-code-abelian');
      expect(fractionalSpinLiquidEngine.getState().topologicalEntanglementEntropy).toBeCloseTo(1.386, 2);

      fractionalSpinLiquidEngine.setParameters({ regime: 'gapless-majorana-metal' });
      expect(fractionalSpinLiquidEngine.getState().regime).toBe('gapless-majorana-metal');

      fractionalSpinLiquidEngine.setParameters({ regime: 'flux-vison-crystal' });
      expect(fractionalSpinLiquidEngine.getState().regime).toBe('flux-vison-crystal');
      expect(fractionalSpinLiquidEngine.getState().visonDensityPerPlaquette).toBeGreaterThan(0.5);

      fractionalSpinLiquidEngine.setParameters({ regime: 'non-abelian-ising' });
      expect(fractionalSpinLiquidEngine.getState().regime).toBe('non-abelian-ising');
    });

    it('注入 Vison 磁通渦旋與執行任意子編織應更新相位及遙測歷史', () => {
      const initialPhase = fractionalSpinLiquidEngine.getState().anyonBraidingPhaseDeg;
      fractionalSpinLiquidEngine.injectVisonVortex();
      expect(fractionalSpinLiquidEngine.getState().visonDensityPerPlaquette).toBeGreaterThanOrEqual(0.1);

      fractionalSpinLiquidEngine.braidIsingAnyonPair();
      const newPhase = fractionalSpinLiquidEngine.getState().anyonBraidingPhaseDeg;
      expect(newPhase).not.toBe(initialPhase);

      fractionalSpinLiquidEngine.update(0.5);
      expect(Array.isArray(fractionalSpinLiquidEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('2. 克爾黑洞極端光子球與事件視界全息陰影重構陣列 (kerrPhotonShadow)', () => {
    it('應正確初始化並計算克爾度規光子陰影幾何參數', () => {
      kerrPhotonShadowEngine.resetDefaults();
      const state = kerrPhotonShadowEngine.getState();
      expect(state.kerrSpinParameterA).toBeGreaterThan(0.5);
      expect(state.observerInclinationDeg).toBeGreaterThan(0);
      expect(state.shadowAreaRg2).toBeGreaterThan(0);
      expect(state.outerHorizonRg).toBeGreaterThan(1.0);
      expect(state.photonSphereProgradeRg).toBeGreaterThan(1.0);
      expect(state.photonSphereRetrogradeRg).toBeGreaterThan(state.photonSphereProgradeRg);
      expect(state.shadowAsymmetryRatio).toBeGreaterThan(0);
      expect(state.lyapunovExponent).toBeGreaterThan(2.0);
    });

    it('應約束自旋參數與傾角邊界並在極端極限下展現強烈不對稱 D 狀變形', () => {
      kerrPhotonShadowEngine.setParameters({
        kerrSpinParameterA: 0.998,
        observerInclinationDeg: 85.0
      });
      const state = kerrPhotonShadowEngine.getState();
      expect(state.kerrSpinParameterA).toBe(0.998);
      expect(state.observerInclinationDeg).toBe(85.0);
      expect(state.shadowAsymmetryRatio).toBeGreaterThan(0.4);
      expect(state.outerHorizonRg).toBeLessThan(1.2);
    });

    it('切換不同相態與觀測模式應正確變更 regime', () => {
      kerrPhotonShadowEngine.setParameters({ regime: 'photon-ring-multiloop' });
      expect(kerrPhotonShadowEngine.getState().regime).toBe('photon-ring-multiloop');

      kerrPhotonShadowEngine.setParameters({ regime: 'frame-dragging-ergosphere' });
      expect(kerrPhotonShadowEngine.getState().regime).toBe('frame-dragging-ergosphere');

      kerrPhotonShadowEngine.setParameters({ regime: 'shadow-asymmetry-metric' });
      expect(kerrPhotonShadowEngine.getState().regime).toBe('shadow-asymmetry-metric');
    });

    it('觸發能層超輻射功率提取與步進傾角應更新動態遙測', () => {
      const powerBefore = kerrPhotonShadowEngine.getState().penroseExtractionPowerMw;
      kerrPhotonShadowEngine.pulseErgosphereExtraction();
      expect(kerrPhotonShadowEngine.getState().penroseExtractionPowerMw).toBeGreaterThan(powerBefore);

      const incBefore = kerrPhotonShadowEngine.getState().observerInclinationDeg;
      kerrPhotonShadowEngine.stepInclinationAngle(10);
      expect(kerrPhotonShadowEngine.getState().observerInclinationDeg).not.toBe(incBefore);

      kerrPhotonShadowEngine.update(0.2);
      expect(Array.isArray(kerrPhotonShadowEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('3. 手性超材料動態拓撲卡西米爾斥力發電機 (repulsiveCasimirMotor)', () => {
    it('應正確初始化並在手性超材料反轉條件下展現斥力與平衡懸浮間隙', () => {
      repulsiveCasimirMotorEngine.resetDefaults();
      const state = repulsiveCasimirMotorEngine.getState();
      expect(state.cavitySeparationNm).toBeGreaterThan(0);
      expect(state.chiralPolarizationDegree).toBeGreaterThan(0);
      expect(state.casimirForcePn).toBeGreaterThan(0); // 斥力正值
      expect(state.isRepulsive).toBe(true);
      expect(state.levitationEquilibriumNm).toBeGreaterThan(0);
      expect(state.quantumTorquePnNm).toBeGreaterThan(0);
    });

    it('應對間隙、手性與拓撲角參數施行邊界保護', () => {
      repulsiveCasimirMotorEngine.setParameters({
        cavitySeparationNm: 5.0, // 低於 10 nm 下限
        chiralPolarizationDegree: 1.5, // 超出 1.0 上限
        topologicalThetaAngleRad: 4.0 // 超出 PI 上限
      });
      const state = repulsiveCasimirMotorEngine.getState();
      expect(state.cavitySeparationNm).toBe(10.0);
      expect(state.chiralPolarizationDegree).toBe(1.0);
      expect(state.topologicalThetaAngleRad).toBeCloseTo(Math.PI, 3);
    });

    it('切換相態時應正確更新物理配置', () => {
      repulsiveCasimirMotorEngine.setParameters({ regime: 'topological-torque-motor' });
      expect(repulsiveCasimirMotorEngine.getState().regime).toBe('topological-torque-motor');

      repulsiveCasimirMotorEngine.setParameters({ regime: 'zero-stiction-nanogap' });
      expect(repulsiveCasimirMotorEngine.getState().regime).toBe('zero-stiction-nanogap');

      repulsiveCasimirMotorEngine.setParameters({ regime: 'lifshitz-crossover-balance' });
      expect(repulsiveCasimirMotorEngine.getState().regime).toBe('lifshitz-crossover-balance');
    });

    it('觸發量子真空懸浮脈衝與調諧至平衡間隙應調整轉速與間隙', () => {
      const initialRpm = repulsiveCasimirMotorEngine.getState().rotorRpm;
      repulsiveCasimirMotorEngine.pulseTorqueBoost();
      expect(repulsiveCasimirMotorEngine.getState().rotorRpm).toBeGreaterThan(initialRpm);

      repulsiveCasimirMotorEngine.tuneToEquilibriumGap();
      const stateAfterTune = repulsiveCasimirMotorEngine.getState();
      expect(stateAfterTune.cavitySeparationNm).toBe(stateAfterTune.levitationEquilibriumNm);

      repulsiveCasimirMotorEngine.update(0.1);
      expect(Array.isArray(repulsiveCasimirMotorEngine.getState().telemetryHistory)).toBe(true);
    });
  });

  describe('4. AdS/dS 雙曲多端可穿越蟲洞多體糾纏網絡 (multiBoundaryWormhole)', () => {
    it('應正確初始化三端黎曼面與夏皮羅時間超前參數', () => {
      multiBoundaryWormholeEngine.resetDefaults();
      const state = multiBoundaryWormholeEngine.getState();
      expect(state.boundaryCountN).toBe(3);
      expect(state.wormholeRadiusAdS).toBeGreaterThan(0);
      expect(state.throatCouplingG).toBeGreaterThan(0);
      expect(state.shapiroAdvanceAs).toBeGreaterThan(0); // 時間超前
      expect(state.isThroatTraversable).toBe(true);
      expect(state.multipartiteFidelityPct).toBeGreaterThan(90);
    });

    it('應支援三端至四端邊界切換與參數保護', () => {
      multiBoundaryWormholeEngine.setParameters({
        boundaryCountN: 4,
        wormholeRadiusAdS: 20.0, // 超出 15.0 上限
        throatCouplingG: 0.05 // 低於 0.1 下限
      });
      const state = multiBoundaryWormholeEngine.getState();
      expect(state.boundaryCountN).toBe(4);
      expect(state.wormholeRadiusAdS).toBe(15.0);
      expect(state.throatCouplingG).toBe(0.1);
    });

    it('切換不同全息相態時應正確更新 regime', () => {
      multiBoundaryWormholeEngine.setParameters({ regime: 'multi-throat-shapiro-open' });
      expect(multiBoundaryWormholeEngine.getState().regime).toBe('multi-throat-shapiro-open');

      multiBoundaryWormholeEngine.setParameters({ regime: 'quantum-secret-sharing' });
      expect(multiBoundaryWormholeEngine.getState().regime).toBe('quantum-secret-sharing');

      multiBoundaryWormholeEngine.setParameters({ regime: 'entanglement-junction-flux' });
      expect(multiBoundaryWormholeEngine.getState().regime).toBe('entanglement-junction-flux');
    });

    it('切換邊界拓撲與注入量子封包應更新封包動態與遙測', () => {
      const nCountBefore = multiBoundaryWormholeEngine.getState().boundaryCountN;
      multiBoundaryWormholeEngine.toggleBoundaryTopology();
      expect(multiBoundaryWormholeEngine.getState().boundaryCountN).not.toBe(nCountBefore);

      const packetsBefore = multiBoundaryWormholeEngine.getState().activeTransitPackets;
      multiBoundaryWormholeEngine.injectMultiQubitPacket();
      expect(multiBoundaryWormholeEngine.getState().activeTransitPackets).toBeGreaterThan(packetsBefore);

      multiBoundaryWormholeEngine.update(0.1);
      expect(Array.isArray(multiBoundaryWormholeEngine.getState().telemetryHistory)).toBe(true);
    });
  });
});
