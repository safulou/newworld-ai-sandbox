import { describe, it, expect, beforeEach } from 'vitest';
import { KagomePairDensityWaveLoopCurrentEngine } from '../kagomePairDensityWaveLoopCurrent';
import { FloquetNonAbelianPhotonicWaveguideEngine } from '../floquetNonAbelianPhotonicWaveguide';
import { HolographicSykWormholeTeleportationEngine } from '../holographicSykWormholeTeleportation';
import { PionCondensateNeutronStarVortexAvalancheEngine } from '../pionCondensateNeutronStarVortexAvalanche';
import { achievements } from '../achievements';

describe('Part 55: 籠目金屬配對密度波與環電流超導、弗洛凱螺旋光子波導非阿貝爾編織、全息 SYK 可穿越蟲洞傳態與中子星 π 介子凝聚渦旋雪崩測試', () => {
  let kagomeEngine: KagomePairDensityWaveLoopCurrentEngine;
  let waveguideEngine: FloquetNonAbelianPhotonicWaveguideEngine;
  let sykWormholeEngine: HolographicSykWormholeTeleportationEngine;
  let pionGlitchEngine: PionCondensateNeutronStarVortexAvalancheEngine;

  beforeEach(() => {
    kagomeEngine = new KagomePairDensityWaveLoopCurrentEngine();
    waveguideEngine = new FloquetNonAbelianPhotonicWaveguideEngine();
    sykWormholeEngine = new HolographicSykWormholeTeleportationEngine();
    pionGlitchEngine = new PionCondensateNeutronStarVortexAvalancheEngine();
  });

  describe('1. 籠目金屬配對密度波與手性軌道環電流超導引擎 (KagomePairDensityWaveLoopCurrentEngine)', () => {
    it('應正確初始化軌道環電流磁通、3Q PDW 振幅、電荷-6e 凝聚分數與 18 個大衛之星節點', () => {
      const state = kagomeEngine.getState();
      expect(state.orbitalLoopFluxMilliPhi0).toBe(18.5);
      expect(state.pdwModulationAmpMev).toBe(1.65);
      expect(state.kagomeNodes.length).toBe(18);
      expect(state.charge6eCondensateFraction).toBeGreaterThan(0.45);
      expect(state.josephsonDiodeEfficiencyPct).toBeGreaterThan(10);
    });

    it('調高軌道環電流磁通、PDW 振幅並對準范霍夫奇異點應最大化 6e 凝聚與二極體整流效率', () => {
      kagomeEngine.setOrbitalLoopFlux(40.0);
      kagomeEngine.setPdwModulationAmp(3.25);
      kagomeEngine.setVanHoveDetuning(0.5);
      const state = kagomeEngine.getState();
      expect(state.orbitalLoopFluxMilliPhi0).toBe(40.0);
      expect(state.charge6eCondensateFraction).toBeGreaterThan(0.82);
      expect(state.josephsonDiodeEfficiencyPct).toBeGreaterThan(30);
      expect(state.polarKerrRotationMicroRad).toBeGreaterThan(120);
    });

    it('切換體制應設定對應的范霍夫金屬、手性環電流 CDW 或殘留電荷-6e 玻色凝聚相', () => {
      kagomeEngine.setRegime('normal-van-hove-kagome-metal');
      let state = kagomeEngine.getState();
      expect(state.activeRegime).toBe('normal-van-hove-kagome-metal');
      expect(state.orbitalLoopFluxMilliPhi0).toBe(1.2);

      kagomeEngine.setRegime('vestigial-charge-6e-condensate');
      state = kagomeEngine.getState();
      expect(state.activeRegime).toBe('vestigial-charge-6e-condensate');
      expect(state.kagomeNodes[0].vortexWindingChargeE).toBe(6);
    });

    it('時間步進 update 應平滑推進相位並更新籠目大衛之星超晶格節點座標', () => {
      const prevPhase = kagomeEngine.getState().pulsePhase;
      kagomeEngine.update(0.05);
      const state = kagomeEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.kagomeNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發籠目 6e 超導諧音與重設應安全不拋出異常', () => {
      expect(() => kagomeEngine.triggerKagomePdwSound()).not.toThrow();
      expect(() => kagomeEngine.reset()).not.toThrow();
    });
  });

  describe('2. 弗洛凱螺旋調制光子波導陣列與非阿貝爾任意子編織器引擎 (FloquetNonAbelianPhotonicWaveguideEngine)', () => {
    it('應正確初始化螺旋調制空間頻率、波導半徑、Wilczek-Zee 和樂保真度與 16 個波導核心節點', () => {
      const state = waveguideEngine.getState();
      expect(state.helixModulationFreqCm).toBe(10.5);
      expect(state.helixRadiusUm).toBe(14.0);
      expect(state.waveguideNodes.length).toBe(16);
      expect(state.wilczekZeeHolonomyNorm).toBeGreaterThan(0.75);
      expect(state.homBraidingVisibilityPct).toBeGreaterThan(80);
    });

    it('調高螺旋頻率、螺旋半徑與倏逝波耦合應提升 π-模拓撲能隙與雙光子 HOM 編織可見度', () => {
      waveguideEngine.setHelixModulationFreq(22.0);
      waveguideEngine.setHelixRadius(32.0);
      waveguideEngine.setEvanescentCoupling(13.5);
      const state = waveguideEngine.getState();
      expect(state.helixModulationFreqCm).toBe(22.0);
      expect(state.wilczekZeeHolonomyNorm).toBeGreaterThan(0.95);
      expect(state.floquetPiGapInverseCm).toBeGreaterThan(12.0);
      expect(state.homBraidingVisibilityPct).toBeGreaterThan(95);
    });

    it('切換體制應設定對應的平直阿貝爾陣列、反常弗洛凱手性邊界或 π-模任意子編織相', () => {
      waveguideEngine.setRegime('straight-abelian-waveguide-array');
      let state = waveguideEngine.getState();
      expect(state.activeRegime).toBe('straight-abelian-waveguide-array');
      expect(state.helixModulationFreqCm).toBe(1.5);

      waveguideEngine.setRegime('pi-mode-photonic-anyon-braider');
      state = waveguideEngine.getState();
      expect(state.activeRegime).toBe('pi-mode-photonic-anyon-braider');
      expect(state.helixModulationFreqCm).toBe(21.0);
    });

    it('時間步進 update 應推動三維螺旋波導世界線編織軌跡演化', () => {
      const prevPhase = waveguideEngine.getState().pulsePhase;
      waveguideEngine.update(0.06);
      const state = waveguideEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.waveguideNodes[1].x).toBeGreaterThan(0);
    });

    it('觸發非阿貝爾光子編織音效與重設應安全不拋出異常', () => {
      expect(() => waveguideEngine.triggerFloquetWaveguideSound()).not.toThrow();
      expect(() => waveguideEngine.reset()).not.toThrow();
    });
  });

  describe('3. 全息 SYK 雙邊耦合可穿越蟲洞與量子資訊引力傳態引擎 (HolographicSykWormholeTeleportationEngine)', () => {
    it('應正確初始化雙邊耦合強度、無因次逆溫、算符尺寸纏繞相干度與 16 個全息馬約拉納弦節點', () => {
      const state = sykWormholeEngine.getState();
      expect(state.bilinearCouplingMuOverJ).toBe(0.22);
      expect(state.inverseTemperatureBetaJ).toBe(18.0);
      expect(state.chordNodes.length).toBe(16);
      expect(state.sizeWindingCoherenceW).toBeGreaterThan(0.75);
      expect(state.teleportationFidelityF).toBeGreaterThan(0.75);
    });

    it('調高雙邊 GJW 耦合、逆溫度與馬約拉納費米子總數應提升蟲洞喉部能隙與引力傳態保真度', () => {
      sykWormholeEngine.setBilinearCouplingMu(0.50);
      sykWormholeEngine.setInverseTemperatureBetaJ(36.0);
      sykWormholeEngine.setMajoranaFermionCount(120);
      const state = sykWormholeEngine.getState();
      expect(state.majoranaFermionCountN).toBe(120);
      expect(state.schwarzianThroatGapOverJ).toBeGreaterThan(0.2);
      expect(state.sizeWindingCoherenceW).toBeGreaterThan(0.92);
      expect(state.teleportationFidelityF).toBeGreaterThan(0.92);
    });

    it('切換體制應設定對應的解耦雙黑洞、負能量衝擊波聚焦或 Maldacena-Qi 永恆蟲洞相', () => {
      sykWormholeEngine.setRegime('disconnected-chaotic-black-holes');
      let state = sykWormholeEngine.getState();
      expect(state.activeRegime).toBe('disconnected-chaotic-black-holes');
      expect(state.bilinearCouplingMuOverJ).toBe(0.02);

      sykWormholeEngine.setRegime('maldacena-qi-eternal-wormhole');
      state = sykWormholeEngine.getState();
      expect(state.activeRegime).toBe('maldacena-qi-eternal-wormhole');
      expect(state.majoranaFermionCountN).toBe(120);
    });

    it('時間步進 update 應推動 AdS₂ 蟲洞喉部穿越測地線節點演化', () => {
      const prevPhase = sykWormholeEngine.getState().pulsePhase;
      sykWormholeEngine.update(0.05);
      const state = sykWormholeEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.chordNodes[12].x).toBeGreaterThan(0);
    });

    it('觸發全息蟲洞尺寸纏繞音效與重設應安全不拋出異常', () => {
      expect(() => sykWormholeEngine.triggerSykWormholeSound()).not.toThrow();
      expect(() => sykWormholeEngine.reset()).not.toThrow();
    });
  });

  describe('4. 中子星內核相對論性 π 介子凝聚與超流渦旋雪崩自轉突變引擎 (PionCondensateNeutronStarVortexAvalancheEngine)', () => {
    it('應正確初始化核心重子密度比、π 介子凝聚角、自轉突變幅度與 18 個超流渦旋釘扎節點', () => {
      const state = pionGlitchEngine.getState();
      expect(state.coreBaryonDensityRatioRho0).toBe(3.6);
      expect(state.pionCondensateAngleDeg).toBe(38.0);
      expect(state.vortexNodes.length).toBe(18);
      expect(state.pulsarGlitchMagnitudePPM).toBeGreaterThan(3.0);
      expect(state.pionUrcaNeutrinoLum36ErgS).toBeGreaterThan(40);
    });

    it('調高核心重子密度、π 介子凝聚角與差動角速度滯後應大幅提升脈衝星自轉突變幅度與微中子光度', () => {
      pionGlitchEngine.setCoreBaryonDensityRatio(6.0);
      pionGlitchEngine.setPionCondensateAngle(70.0);
      pionGlitchEngine.setCrustSuperfluidLag(2.30);
      const state = pionGlitchEngine.getState();
      expect(state.coreBaryonDensityRatioRho0).toBe(6.0);
      expect(state.vortexPinningBarrierMev).toBeGreaterThan(12.0);
      expect(state.pulsarGlitchMagnitudePPM).toBeGreaterThan(35.0);
      expect(state.pionUrcaNeutrinoLum36ErgS).toBeGreaterThan(500);
    });

    it('切換體制應設定對應的常規費米液體、³P₂ 超流釘扎或巨型渦旋脫釘雪崩突變相', () => {
      pionGlitchEngine.setRegime('normal-nuclear-fermi-liquid');
      let state = pionGlitchEngine.getState();
      expect(state.activeRegime).toBe('normal-nuclear-fermi-liquid');
      expect(state.coreBaryonDensityRatioRho0).toBe(1.4);

      pionGlitchEngine.setRegime('catastrophic-vortex-unpinning-glitch');
      state = pionGlitchEngine.getState();
      expect(state.activeRegime).toBe('catastrophic-vortex-unpinning-glitch');
      expect(state.coreBaryonDensityRatioRho0).toBe(5.8);
    });

    it('時間步進 update 應推動 ³P₂ 半量子超流渦旋雪崩螺旋軌跡演化', () => {
      const prevPhase = pionGlitchEngine.getState().pulsePhase;
      pionGlitchEngine.update(0.05);
      const state = pionGlitchEngine.getState();
      expect(state.pulsePhase).toBeGreaterThan(prevPhase);
      expect(state.vortexNodes[0].x).toBeGreaterThan(0);
    });

    it('觸發脈衝星渦旋雪崩音效與重設應安全不拋出異常', () => {
      expect(() => pionGlitchEngine.triggerPulsarGlitchSound()).not.toThrow();
      expect(() => pionGlitchEngine.reset()).not.toThrow();
    });
  });

  describe('5. 成就系統總數與 Part 55 里程碑檢驗', () => {
    it('成就總數應已正式擴展至 236 項終極里程碑', () => {
      expect(achievements.getAll().length).toBeGreaterThanOrEqual(236);
    });

    it('應包含 Part 55 的 4 項全新成就並可順利解鎖', () => {
      const p55AchievementIds = [
        'kagome_pair_density_wave_loop_current',
        'floquet_non_abelian_photonic_waveguide',
        'holographic_syk_wormhole_teleportation',
        'pion_condensate_vortex_avalanche',
      ];

      for (const id of p55AchievementIds) {
        expect(achievements.isUnlocked(id)).toBe(false);
        achievements.unlock(id);
        expect(achievements.isUnlocked(id)).toBe(true);
      }
    });
  });
});
