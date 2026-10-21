/**
 * 中子星內核相對論性 π 介子凝聚與超流渦旋雪崩自轉突變引擎
 * (Relativistic Pion-Condensate Neutron Star Core & Superfluid Vortex Avalanche Glitch Engine)
 *
 * 物理原理：
 * 1. 在中子星內核高重子密度區 (ρ > 2 ρ_0，ρ_0 ≈ 2.8×10¹⁴ g/cm³ 為飽和核物質密度)，強核力 p-波吸引作用使 π⁰ 與 π⁻ 介子
 *    有效能量跨越費米面發生玻色凝聚 ⟨π(r)⟩ = f_π sin(θ_c) exp(i k_c · r)，形成具空間層狀調制的手性 π 介子凝聚晶格。
 * 2. 內核同時存在自旋三態 ³P₂ 中子超流半量子渦旋 (Half-Quantum Vortices) 與第 II 類超導質子磁通管。渦旋釘扎於 π 介子凝聚疇壁上，
 *    隨星殼電磁制動累積差動角速度滯後 ΔΩ_lag = Ω_superfluid - Ω_crust，馬格努斯力 F_Magnus = ρ_s κ × (v_s - v_L) 持續攀升。
 * 3. 當 ΔΩ_lag 突破臨界釘扎能壘 E_pin 時，數十億條超流渦旋集體脫釘雪崩 (Vortex Unpinning Avalanche)，瞬間將角動量傳遞給星殼，
 *    觸發脈衝星自轉頻率巨幅突變 (Giant Pulsar Glitch, Δν/ν ~ 10⁻⁶ - 10⁻⁵) 與 π 介子增強 Urca 過程微中子光度暴發 L_ν。
 */

export type PionCondensateGlitchRegime =
  | 'normal-nuclear-fermi-liquid'
  | 'pinned-3p2-superfluid-crust-lag'
  | 'chiral-pion-condensate-lattice'
  | 'catastrophic-vortex-unpinning-glitch';

export interface SuperfluidVortexPinningNode {
  id: number;
  x: number;
  y: number;
  isUnpinnedAvalanche: boolean;
  magnusForceMevFm: number;
  pionDomainWallAmp: number;
  halfQuantumCirculation: number; // 0.5 or 1.0 κ_0
}

export interface PionCondensateVortexAvalancheState {
  coreBaryonDensityRatioRho0: number;  // 核心重子密度比 ρ / ρ_0 (1.2 ~ 6.5)
  pionCondensateAngleDeg: number;      // 手性 π 介子凝聚混合角 θ_c (deg, 2.0 ~ 75.0)
  crustSuperfluidLagRadS: number;      // 超流-星殼差動角速度滯後 ΔΩ_lag (rad/s, 0.01 ~ 2.50)
  pulsarGlitchMagnitudePPM: number;    // 脈衝星自轉突變幅度 (Δν/ν) × 10⁶ (ppm)
  vortexPinningBarrierMev: number;     // 渦旋-介子疇壁釘扎能壘 E_pin (MeV)
  pionUrcaNeutrinoLum36ErgS: number;   // π 介子增強 Urca 微中子光度 L_ν (10³⁶ erg/s)
  activeRegime: PionCondensateGlitchRegime;
  pulsePhase: number;
  vortexNodes: SuperfluidVortexPinningNode[];
}

const STORAGE_KEY = 'newworld_pion_condensate_vortex_avalanche_state_v1';

export class PionCondensateNeutronStarVortexAvalancheEngine {
  private state: PionCondensateVortexAvalancheState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): PionCondensateVortexAvalancheState {
    const defaults: PionCondensateVortexAvalancheState = {
      coreBaryonDensityRatioRho0: 3.6,
      pionCondensateAngleDeg: 38.0,
      crustSuperfluidLagRadS: 0.85,
      pulsarGlitchMagnitudePPM: 6.42,
      vortexPinningBarrierMev: 4.85,
      pionUrcaNeutrinoLum36ErgS: 92.4,
      activeRegime: 'chiral-pion-condensate-lattice',
      pulsePhase: 0,
      vortexNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Pion-Condensate Vortex Avalanche state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Pion-Condensate Vortex Avalanche state:', e);
      }
    }
  }

  public getState(): Readonly<PionCondensateVortexAvalancheState> {
    return this.state;
  }

  public setCoreBaryonDensityRatio(rhoRatio: number): void {
    this.state.coreBaryonDensityRatioRho0 = Math.max(1.2, Math.min(6.5, parseFloat(rhoRatio.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setPionCondensateAngle(angleDeg: number): void {
    this.state.pionCondensateAngleDeg = Math.max(2.0, Math.min(75.0, parseFloat(angleDeg.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCrustSuperfluidLag(lagRadS: number): void {
    this.state.crustSuperfluidLagRadS = Math.max(0.01, Math.min(2.50, parseFloat(lagRadS.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: PionCondensateGlitchRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'normal-nuclear-fermi-liquid':
        this.state.coreBaryonDensityRatioRho0 = 1.4;
        this.state.pionCondensateAngleDeg = 4.0;
        this.state.crustSuperfluidLagRadS = 0.05;
        break;
      case 'pinned-3p2-superfluid-crust-lag':
        this.state.coreBaryonDensityRatioRho0 = 2.6;
        this.state.pionCondensateAngleDeg = 22.0;
        this.state.crustSuperfluidLagRadS = 0.65;
        break;
      case 'chiral-pion-condensate-lattice':
        this.state.coreBaryonDensityRatioRho0 = 4.2;
        this.state.pionCondensateAngleDeg = 46.0;
        this.state.crustSuperfluidLagRadS = 1.25;
        break;
      case 'catastrophic-vortex-unpinning-glitch':
        this.state.coreBaryonDensityRatioRho0 = 5.8;
        this.state.pionCondensateAngleDeg = 68.0;
        this.state.crustSuperfluidLagRadS = 2.25;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rho = this.state.coreBaryonDensityRatioRho0;
    const thetaRad = (this.state.pionCondensateAngleDeg * Math.PI) / 180;
    const lag = this.state.crustSuperfluidLagRadS;

    const sinTheta = Math.sin(thetaRad);

    // 渦旋-介子疇壁釘扎能壘 E_pin (MeV)
    const pinBarrier = 0.8 + 2.4 * rho * sinTheta;
    this.state.vortexPinningBarrierMev = parseFloat(pinBarrier.toFixed(2));

    // 脈衝星自轉突變幅度 (Δν/ν) × 10⁶ (ppm)
    const glitchPpm = 1.35 * rho * Math.pow(lag, 1.25) * (0.5 + 1.4 * sinTheta);
    this.state.pulsarGlitchMagnitudePPM = parseFloat(glitchPpm.toFixed(2));

    // π 介子凝聚增強準粒子 β 衰變微中子光度 L_ν (10³⁶ erg/s) ∝ sin²(θ_c) * (ρ/ρ_0)^(4/3)
    const urcaLum = 12.0 * Math.pow(rho, 1.33) * (0.15 + 3.8 * sinTheta * sinTheta) * (1 + 0.25 * lag);
    this.state.pionUrcaNeutrinoLum36ErgS = parseFloat(urcaLum.toFixed(1));

    // 生成 18 個 ³P₂ 中子超流半量子渦旋與 π 介子凝聚疇壁節點
    const nodes: SuperfluidVortexPinningNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const shell = i < 6 ? 42 : i < 12 ? 76 : 108;
      const isAvalanche = lag > 1.1 || i % 3 === 0;
      const radialDrift = isAvalanche ? 10 * Math.sin(this.state.pulsePhase * 1.4 + i) : 2;
      const angle = (i / 6) * 2 * Math.PI + this.state.pulsePhase * (isAvalanche ? 0.55 : 0.2);

      const rNow = shell + radialDrift;
      const x = 165 + rNow * Math.cos(angle);
      const y = 160 + rNow * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        isUnpinnedAvalanche: isAvalanche,
        magnusForceMevFm: parseFloat((lag * rho * 0.65).toFixed(2)),
        pionDomainWallAmp: parseFloat(sinTheta.toFixed(2)),
        halfQuantumCirculation: rho > 3.0 ? 0.5 : 1.0
      });
    }
    this.state.vortexNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.9 + this.state.crustSuperfluidLagRadS * 0.9;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerPulsarGlitchSound(): void {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const oscSpin = this.audioCtx.createOscillator();
      const oscBurst = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscSpin.type = 'sawtooth';
      oscBurst.type = 'triangle';

      const fPreGlitch = 160 + this.state.coreBaryonDensityRatioRho0 * 42;
      const fPostGlitch = fPreGlitch + this.state.pulsarGlitchMagnitudePPM * 28;

      oscSpin.frequency.setValueAtTime(fPreGlitch, t);
      oscSpin.frequency.exponentialRampToValueAtTime(fPostGlitch, t + 0.32);

      oscBurst.frequency.setValueAtTime(fPreGlitch * 1.5, t);
      oscBurst.frequency.exponentialRampToValueAtTime(fPostGlitch * 1.6, t + 0.32);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.17, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscSpin.connect(gain);
      oscBurst.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscSpin.start(t);
      oscBurst.start(t);
      oscSpin.stop(t + 0.57);
      oscBurst.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in PionCondensateNeutronStarVortexAvalancheEngine:', e);
    }
  }

  public reset(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.state = this.loadState();
    this.recomputePhysics();
  }
}

export const pionCondensateNeutronStarVortexAvalancheEngine = new PionCondensateNeutronStarVortexAvalancheEngine();
