/**
 * 圈量子宇宙學大反彈奇點消除與普朗克星霍金-白洞躍遷引擎
 * (Loop Quantum Cosmology Big Bounce Singularity Resolution & Planck Star Black-to-White Hole Transition Engine)
 *
 * 物理原理：
 * 1. 在圈量子引力 (Loop Quantum Gravity, LQG) 與圈量子宇宙學 (LQC, Ashtekar-Bojowald-Rovelli) 中，
 *    自旋網路空間幾何具有由 Barbero-Immirzi 參數 γ_{BI} ≈ 0.2375 決定的最小非零面積本徵值（面積能隙）
 *    Δ_{area} = 4√3 π γ_{BI} ℓ_{Pl}²。
 * 2. 量子全純修正 (Holonomy Correction) 將經典弗里德曼方程改寫為：
 *    H² = (8πG / 3) ρ (1 - ρ / ρ_{crit})，其中臨界普朗克密度 ρ_{crit} = √3 / (32π² γ_{BI}³ G² ℏ) ≈ 0.41 ρ_{Pl}。
 *    當宇宙或坍縮黑洞核心物質密度達到 ρ = ρ_{crit} 時，H → 0 且量子幾何排斥力觸發么正「大反彈」(Big Bounce)，
 *    徹底消除經典廣義相對論奇點。
 * 3. 在黑洞內部，坍縮物質在普朗克密度處停止並形成「普朗克星」(Planck Star)，藉由量子引力穿隧躍遷為白洞 (White Hole)，
 *    釋放特徵亞毫米與高能伽瑪暴信號。
 */

export type LqcBouncePlanckStarRegime =
  | 'classical-friedmann-collapse'
  | 'holonomy-quantum-repulsion-onset'
  | 'unitary-big-bounce-singularity-free'
  | 'planck-star-white-hole-tunneling';

export interface SpinNetworkBounceNode {
  id: number;
  x: number;
  y: number;
  spinLabelJ: number; // SU(2) spin quantum number j = 1/2, 1, 3/2, 2...
  areaQuantumLp2: number;
  holonomyCurvature: number;
  isRebounding: boolean;
}

export interface LqcBouncePlanckStarState {
  energyDensityRatioRhoOverCrit: number; // 核心能量密度比 ρ / ρ_{crit} (0.05 ~ 1.00)
  barberoImmirziGamma: number;           // Barbero-Immirzi 拓撲參數 γ_{BI} (0.12 ~ 0.50)
  minimumAreaGapLp2: number;             // LQG 最小面積能隙 Δ_{area} (ℓ_{Pl}²)
  effectiveHubbleRateSquared: number;    // 量子修正哈伯平方率 H² / H_{max}² (在 ρ=ρ_{crit}/2 達峰值，ρ=ρ_{crit} 歸零反彈)
  quantumRepulsionAcceleration: number;  // 量子幾何排斥加速度 ä / a (Pl units)
  whiteHoleBurstPeakMeV: number;         // 普朗克星-白洞穿隧爆發特徵能量 E_{WH} (MeV)
  activeRegime: LqcBouncePlanckStarRegime;
  pulsePhase: number;
  spinNodes: SpinNetworkBounceNode[];
}

const STORAGE_KEY = 'newworld_lqc_bounce_planck_star_state_v1';

export class LoopQuantumCosmologyBouncePlanckStarEngine {
  private state: LqcBouncePlanckStarState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): LqcBouncePlanckStarState {
    const defaults: LqcBouncePlanckStarState = {
      energyDensityRatioRhoOverCrit: 0.96,
      barberoImmirziGamma: 0.2375,
      minimumAreaGapLp2: 5.17,
      effectiveHubbleRateSquared: 0.15,
      quantumRepulsionAcceleration: 2.84,
      whiteHoleBurstPeakMeV: 142.5,
      activeRegime: 'unitary-big-bounce-singularity-free',
      pulsePhase: 0,
      spinNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load LQC Bounce Planck Star state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save LQC Bounce Planck Star state:', e);
      }
    }
  }

  public getState(): Readonly<LqcBouncePlanckStarState> {
    return this.state;
  }

  public setEnergyDensityRatio(rhoRatio: number): void {
    this.state.energyDensityRatioRhoOverCrit = Math.max(0.05, Math.min(1.00, parseFloat(rhoRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setBarberoImmirziGamma(gamma: number): void {
    this.state.barberoImmirziGamma = Math.max(0.12, Math.min(0.50, parseFloat(gamma.toFixed(4))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: LqcBouncePlanckStarRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'classical-friedmann-collapse':
        this.state.energyDensityRatioRhoOverCrit = 0.15;
        this.state.barberoImmirziGamma = 0.2375;
        break;
      case 'holonomy-quantum-repulsion-onset':
        this.state.energyDensityRatioRhoOverCrit = 0.55;
        this.state.barberoImmirziGamma = 0.2375;
        break;
      case 'unitary-big-bounce-singularity-free':
        this.state.energyDensityRatioRhoOverCrit = 0.98;
        this.state.barberoImmirziGamma = 0.2375;
        break;
      case 'planck-star-white-hole-tunneling':
        this.state.energyDensityRatioRhoOverCrit = 1.00;
        this.state.barberoImmirziGamma = 0.185;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rho = this.state.energyDensityRatioRhoOverCrit;
    const gamma = this.state.barberoImmirziGamma;

    // 最小面積能隙 Δ_{area} = 4√3 π γ_{BI} ℓ_{Pl}² ≈ 21.7656 * γ_{BI}
    const areaGap = 4.0 * Math.sqrt(3.0) * Math.PI * gamma;
    this.state.minimumAreaGapLp2 = parseFloat(areaGap.toFixed(2));

    // LQC 修正弗里德曼方程歸一化哈伯平方率 H² / H_{max}² = 4 * (ρ/ρ_c) * (1 - ρ/ρ_c)
    const h2Norm = Math.max(0.0, 4.0 * rho * (1.0 - rho));
    this.state.effectiveHubbleRateSquared = parseFloat(h2Norm.toFixed(3));

    // 量子雷查杜里排斥加速度 ä/a ∝ ρ (3 ρ / ρ_c - 1)，當 ρ > ρ_c/3 時由吸引轉為排斥反彈
    const accel = 1.65 * rho * (3.0 * rho - 1.0) * (0.24 / gamma);
    this.state.quantumRepulsionAcceleration = parseFloat(accel.toFixed(2));

    // 普朗克星-白洞穿隧爆發峰值能量 E_{WH} (MeV)
    const whEnergy = 32.0 + 135.0 * Math.pow(rho, 1.8) * (0.25 / gamma);
    this.state.whiteHoleBurstPeakMeV = parseFloat(whEnergy.toFixed(1));

    // 生成 18 個 SU(2) 自旋網路量子幾何體素與大反彈雙曲喉部節點
    const nodes: SpinNetworkBounceNode[] = [];
    const count = 18;
    const bounceWaist = Math.max(24, 68 * (1.05 - 0.55 * rho));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.32;
      const radialPulse = bounceWaist + 36 * Math.abs(Math.cos(angle * 2.0 + this.state.pulsePhase * 0.5));

      const x = 165 + radialPulse * Math.cos(angle);
      const y = 160 + radialPulse * Math.sin(angle);

      const spinJ = 0.5 * ((i % 4) + 1);
      const areaQuanta = 8.0 * Math.PI * gamma * Math.sqrt(spinJ * (spinJ + 1.0));

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        spinLabelJ: spinJ,
        areaQuantumLp2: parseFloat(areaQuanta.toFixed(2)),
        holonomyCurvature: parseFloat((Math.sin(Math.PI * rho * 0.5)).toFixed(2)),
        isRebounding: rho > 0.5
      });
    }
    this.state.spinNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + this.state.energyDensityRatioRhoOverCrit * 0.9;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerLqcBounceSound(): void {
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
      const oscBounce = this.audioCtx.createOscillator();
      const oscSpin = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscBounce.type = 'sine';
      oscSpin.type = 'triangle';

      // 模擬坍縮至最小面積能隙後觸發大反彈頻率躍升 (V-shaped Big Bounce frequency trajectory)
      const fHigh = 520 + this.state.energyDensityRatioRhoOverCrit * 240;
      const fBounce = 150 + this.state.minimumAreaGapLp2 * 15;

      oscBounce.frequency.setValueAtTime(fHigh, t);
      oscBounce.frequency.exponentialRampToValueAtTime(fBounce, t + 0.18);
      oscBounce.frequency.exponentialRampToValueAtTime(fHigh * 1.15, t + 0.48);

      oscSpin.frequency.setValueAtTime(fBounce * 1.5, t);
      oscSpin.frequency.exponentialRampToValueAtTime(fHigh * 1.5, t + 0.48);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscBounce.connect(gain);
      oscSpin.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscBounce.start(t);
      oscSpin.start(t);
      oscBounce.stop(t + 0.58);
      oscSpin.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in LoopQuantumCosmologyBouncePlanckStarEngine:', e);
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

export const loopQuantumCosmologyBouncePlanckStarEngine = new LoopQuantumCosmologyBouncePlanckStarEngine();
