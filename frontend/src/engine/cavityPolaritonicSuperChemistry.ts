/**
 * 腔量子電動力學極化激元超化學與振動強耦合反應器引擎
 * (Cavity-QED Polaritonic Super-Chemistry & Vibrational Strong Coupling Reactor Engine)
 *
 * 物理原理：
 * 1. 在法布里-珀羅 (Fabry-Pérot) 太赫茲/紅外線微腔中，當 N_mol 個分子的振動或電子躍遷與腔真空電磁模 ω_c 發生集體強耦合
 *    (Vibrational/Electronic Strong Coupling, VSC/ESC) 時，集體拉比劈裂 ℏΩ_R = 2 ℏ g_0 √N_mol 將分子位能面 (PES)
 *    雜化劈裂為上極化激元態 |UP⟩、下極化激元態 |LP⟩ 與 N_mol - 1 個集體暗態 (Dark States)。
 * 2. 無需外部雷射泵浦，單憑光學微腔零點真空漲落即可重塑化學反應過渡態活化自由能壘 Δ(ΔG‡)，
 *    實現鍵選擇性真空催化或抑制 (Ebbesen 效應，反應速率增益比 k_VSC / k_0)。
 * 3. 在超強耦合體制 (Ultrastrong Coupling, Ω_R / ω_0 > 0.1) 下，基態混入虛光子與集體振動極化激元凝聚相干長度 ξ_pol。
 */

export type CavityPolaritonicChemistryRegime =
  | 'uncoupled-arrhenius-thermal-kinetics'
  | 'vibrational-strong-coupling-vsc-catalysis'
  | 'electronic-polariton-conical-intersection'
  | 'ultrastrong-vacuum-ground-state-condensate';

export interface PolaritonPesBranchNode {
  id: number;
  x: number;
  y: number;
  branchType: 'LP' | 'UP' | 'dark-manifold';
  hopfieldPhotonFraction: number;
  localBarrierShiftMev: number;
  vibronCoherenceWeight: number;
}

export interface CavityPolaritonicChemistryState {
  vacuumRabiSplittingMev: number;       // 集體真空拉比劈裂 ℏΩ_R (meV, 5.0 ~ 280.0)
  cavityVibrationDetuningMev: number;   // 腔模-分子振動失諧 δ_cav = ω_c - ω_v (meV, -50.0 ~ 50.0)
  cavityQualityFactorQ: number;         // 法布里-珀羅微腔品質因子 Q_cav (50 ~ 5000)
  activationBarrierReductionMev: number;// 極化激元活化能壘重整化降低量 |Δ(ΔG‡)| (meV)
  reactionRateEnhancementFactor: number;// 真空強耦合化學反應速率增益比 k_VSC / k_0
  polaritonDelocalizationNm: number;    // 極化激元跨分子非定域相干長度 ξ_pol (nm)
  activeRegime: CavityPolaritonicChemistryRegime;
  pulsePhase: number;
  pesNodes: PolaritonPesBranchNode[];
}

const STORAGE_KEY = 'newworld_cavity_polaritonic_chemistry_state_v1';

export class CavityPolaritonicSuperChemistryEngine {
  private state: CavityPolaritonicChemistryState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): CavityPolaritonicChemistryState {
    const defaults: CavityPolaritonicChemistryState = {
      vacuumRabiSplittingMev: 115.0,
      cavityVibrationDetuningMev: 0.0,
      cavityQualityFactorQ: 1800,
      activationBarrierReductionMev: 54.2,
      reactionRateEnhancementFactor: 14.8,
      polaritonDelocalizationNm: 42.5,
      activeRegime: 'vibrational-strong-coupling-vsc-catalysis',
      pulsePhase: 0,
      pesNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Cavity Polaritonic Chemistry state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Cavity Polaritonic Chemistry state:', e);
      }
    }
  }

  public getState(): Readonly<CavityPolaritonicChemistryState> {
    return this.state;
  }

  public setVacuumRabiSplitting(omegaRMev: number): void {
    this.state.vacuumRabiSplittingMev = Math.max(5.0, Math.min(280.0, parseFloat(omegaRMev.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCavityVibrationDetuning(detMev: number): void {
    this.state.cavityVibrationDetuningMev = Math.max(-50.0, Math.min(50.0, parseFloat(detMev.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCavityQualityFactor(qFactor: number): void {
    this.state.cavityQualityFactorQ = Math.max(50, Math.min(5000, Math.round(qFactor)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: CavityPolaritonicChemistryRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'uncoupled-arrhenius-thermal-kinetics':
        this.state.vacuumRabiSplittingMev = 8.0;
        this.state.cavityVibrationDetuningMev = 35.0;
        this.state.cavityQualityFactorQ = 120;
        break;
      case 'vibrational-strong-coupling-vsc-catalysis':
        this.state.vacuumRabiSplittingMev = 120.0;
        this.state.cavityVibrationDetuningMev = 0.0;
        this.state.cavityQualityFactorQ = 2200;
        break;
      case 'electronic-polariton-conical-intersection':
        this.state.vacuumRabiSplittingMev = 195.0;
        this.state.cavityVibrationDetuningMev = -5.0;
        this.state.cavityQualityFactorQ = 3400;
        break;
      case 'ultrastrong-vacuum-ground-state-condensate':
        this.state.vacuumRabiSplittingMev = 265.0;
        this.state.cavityVibrationDetuningMev = 0.0;
        this.state.cavityQualityFactorQ = 4800;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rabi = this.state.vacuumRabiSplittingMev;
    const det = this.state.cavityVibrationDetuningMev;
    const qCav = this.state.cavityQualityFactorQ;

    // 零失諧共振羅倫茲增強因子
    const resonanceFactor = 1.0 / (1.0 + Math.pow(det / 28.0, 2));
    const qBoost = 0.5 + 0.5 * Math.tanh(qCav / 1500.0);

    // 活化能壘降低量 |Δ(ΔG‡)| ≈ ½ ℏΩ_R * Resonance * Q_boost
    const barrierShift = 0.48 * rabi * resonanceFactor * qBoost;
    this.state.activationBarrierReductionMev = parseFloat(barrierShift.toFixed(1));

    // 真空催化反應速率增益比 k_VSC / k_0 = exp(|Δ(ΔG‡)| / k_B T_eff)
    const rateGain = Math.min(250.0, Math.exp(barrierShift / 26.0));
    this.state.reactionRateEnhancementFactor = parseFloat(rateGain.toFixed(1));

    // 極化激元非定域相干長度 ξ_pol (nm)
    const delocNm = 8.0 + 0.28 * rabi * Math.sqrt(qCav / 500.0) * resonanceFactor;
    this.state.polaritonDelocalizationNm = parseFloat(delocNm.toFixed(1));

    // Hopfield 光子混合係數 |α_ph|² = ½ (1 + δ / √(δ² + Ω_R²))
    const hopfield = 0.5 * (1.0 + det / Math.sqrt(det * det + rabi * rabi));

    // 生成 18 個上/下極化激元分支 (UP / LP) 位能面反交叉節點
    const nodes: PolaritonPesBranchNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const isUpper = i < 9;
      const idx = i % 9;
      const qCoord = (idx / 8) * 220 + 55; // Reaction coordinate x from 55 to 275
      const normQ = (idx - 4) / 4; // -1 to +1

      const splitPx = Math.min(62, 14 + rabi * 0.18 * resonanceFactor);
      const baseCurveY = 160 - 38 * Math.exp(-normQ * normQ * 2.2);
      const yOffset = isUpper ? -splitPx : splitPx;
      const waveRipple = 5 * Math.sin(this.state.pulsePhase * 1.5 + idx);

      nodes.push({
        id: i,
        x: parseFloat(qCoord.toFixed(1)),
        y: parseFloat((baseCurveY + yOffset + waveRipple).toFixed(1)),
        branchType: isUpper ? 'UP' : 'LP',
        hopfieldPhotonFraction: parseFloat((isUpper ? hopfield : 1.0 - hopfield).toFixed(2)),
        localBarrierShiftMev: parseFloat(barrierShift.toFixed(1)),
        vibronCoherenceWeight: parseFloat((0.35 + 0.6 * resonanceFactor * qBoost).toFixed(2))
      });
    }
    this.state.pesNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + this.state.vacuumRabiSplittingMev / 140.0;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerPolaritonicChemistrySound(): void {
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
      const oscLP = this.audioCtx.createOscillator();
      const oscUP = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscLP.type = 'sine';
      oscUP.type = 'triangle';

      // 下極化激元 LP 與上極化激元 UP 真空拉比劈裂雙音
      const fCenter = 420 + this.state.cavityVibrationDetuningMev * 2.0;
      const fSplit = this.state.vacuumRabiSplittingMev * 1.25;

      oscLP.frequency.setValueAtTime(Math.max(140, fCenter - fSplit * 0.5), t);
      oscLP.frequency.exponentialRampToValueAtTime(Math.max(120, fCenter - fSplit * 0.65), t + 0.34);

      oscUP.frequency.setValueAtTime(fCenter + fSplit * 0.5, t);
      oscUP.frequency.exponentialRampToValueAtTime(fCenter + fSplit * 0.85, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      oscLP.connect(gain);
      oscUP.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscLP.start(t);
      oscUP.start(t);
      oscLP.stop(t + 0.56);
      oscUP.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in CavityPolaritonicSuperChemistryEngine:', e);
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

export const cavityPolaritonicSuperChemistryEngine = new CavityPolaritonicSuperChemistryEngine();
