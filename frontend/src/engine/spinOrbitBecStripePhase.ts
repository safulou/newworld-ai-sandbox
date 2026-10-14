/**
 * Spin-Orbit Coupled Bose-Einstein Condensate & Stripe Phase Superfluidity Engine
 * Part 43 Subsystem 2
 *
 * Implements:
 * - Two-component BEC with synthetic 1D Rashba-Dresselhaus Spin-Orbit Coupling (SOC)
 * - Single-particle double-well dispersion: E_-(k_x) with minima at +-k_0 = +-k_R * sqrt(1 - (hbar*Omega_R / 4*E_R)^2)
 * - Spontaneous gauge U(1) and spatial translation breaking: Stripe Supersolid Phase
 * - Stripe density contrast C = (hbar * Omega_R) / (4 * E_R), wavelength lambda_stripe = pi / k_0
 * - Anisotropic superfluid fraction: f_s,x (quenched along SOC axis) vs f_s,y (complete)
 * - Procedural pure-code Web Audio sound synthesis
 * - Client-side localStorage persistence under newworld_spin_orbit_bec_stripe_state_v1
 */

export type SocBecRegime =
  | 'stripe-supersolid'   // 空間週期條紋超固態 (Omega_R < 4 E_R)
  | 'single-minimum'     // 單能阱零動量凝聚態 (Omega_R >= 4 E_R)
  | 'plane-wave'         // 自旋極化平面波態 (非零 detuning)
  | 'raman-quench'       // 非絕熱拉曼淬火動態孤子態

export interface SpinOrbitBecState {
  ramanCouplingER: number;       // 拉曼耦合強度 hbar * Omega_R / E_R (0.0 to 6.0), default 2.0
  ramanDetuningER: number;       // 拉曼失諧 hbar * delta / E_R (-2.0 to 2.0), default 0.0
  recoilWavenumberUm: number;    // 回衝波矢 k_R (1/um), default 8.0 um^-1 (for ~790 nm laser)
  atomicMassAmu: number;         // 原子質量 (amu), default 87 (87Rb)
  condensateDensity10e14: number;// 凝聚體密度 (10^14 cm^-3), default 1.2
  minimaWavenumberK0: number;    // 基態能阱動量 k0 (1/um)
  stripeWavelengthNm: number;    // 條紋空間週期 lambda_stripe (nm)
  stripeContrast: number;        // 條紋密度反差 C (0.0 to 1.0)
  superfluidFractionX: number;   // 沿 SOC 軸超流比例 f_s,x (0.0 to 1.0)
  superfluidFractionY: number;   // 垂直軸超流比例 f_s,y (0.0 to 1.0)
  recoilEnergyKhz: number;       // 回衝能量 E_R / h (kHz)
  regime: SocBecRegime;
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_spin_orbit_bec_stripe_state_v1';
const HBAR = 1.054571817e-34; // J s
const AMU_KG = 1.66053906660e-27; // kg

export class SpinOrbitBecStripeEngine {
  private state: SpinOrbitBecState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): SpinOrbitBecState {
    const defaultState: SpinOrbitBecState = {
      ramanCouplingER: 2.0,
      ramanDetuningER: 0.0,
      recoilWavenumberUm: 8.0,
      atomicMassAmu: 87.0,
      condensateDensity10e14: 1.2,
      minimaWavenumberK0: 6.928,
      stripeWavelengthNm: 453.4,
      stripeContrast: 0.5,
      superfluidFractionX: 0.65,
      superfluidFractionY: 1.0,
      recoilEnergyKhz: 3.68,
      regime: 'stripe-supersolid',
      audioEnabled: true,
      isSimulating: true,
      timeElapsed: 0.0,
    };

    if (typeof localStorage === 'undefined') return defaultState;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return defaultState;
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore
    }
  }

  public getState(): SpinOrbitBecState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const omegaR = this.state.ramanCouplingER; // in units of E_R
    const delta = this.state.ramanDetuningER;   // in units of E_R
    const kR_um = this.state.recoilWavenumberUm;
    const kR_m = kR_um * 1e6;
    const m_kg = this.state.atomicMassAmu * AMU_KG;

    // Recoil energy E_R = hbar^2 * k_R^2 / (2 * m)
    const ER_joules = (HBAR * HBAR * kR_m * kR_m) / (2 * m_kg);
    this.state.recoilEnergyKhz = (ER_joules / (6.62607015e-34)) * 1e-3;

    // Critical coupling threshold for double-well to single-well is Omega_c = 4.0 E_R (when delta = 0)
    const isDoubleWell = Math.abs(delta) < 0.1 ? (omegaR < 4.0) : (omegaR * omegaR < 16.0 - 4.0 * delta * delta);

    if (isDoubleWell && omegaR < 4.0) {
      // Two minima at +-k0
      const ratio = omegaR / 4.0;
      const k0_um = kR_um * Math.sqrt(Math.max(0.001, 1.0 - ratio * ratio));
      this.state.minimaWavenumberK0 = k0_um;

      // Stripe wavelength lambda = pi / k0
      this.state.stripeWavelengthNm = (Math.PI / (k0_um * 1e-3)); // nm

      // Stripe contrast C = Omega_R / (4 E_R)
      this.state.stripeContrast = Math.max(0.0, Math.min(1.0, ratio));

      // Superfluid fraction f_s,x = [1 + (4/omegaR)(1 - (omegaR/4)^2)]^-1 * (1 - C^2 / 2)
      const denom = 1.0 + (1.0 / Math.max(0.05, ratio)) * (1.0 - ratio * ratio);
      const fsx = (1.0 / denom) * (1.0 - 0.5 * this.state.stripeContrast * this.state.stripeContrast);
      this.state.superfluidFractionX = Math.max(0.05, Math.min(1.0, fsx));
      this.state.superfluidFractionY = 1.0;

      if (Math.abs(delta) > 0.3) {
        this.state.regime = 'plane-wave';
      } else {
        this.state.regime = 'stripe-supersolid';
      }
    } else {
      // Single minimum at k = 0
      this.state.minimaWavenumberK0 = 0.0;
      this.state.stripeWavelengthNm = 0.0;
      this.state.stripeContrast = 0.0;

      // Superfluid fraction f_s,x recovers towards 1.0 as Omega_R becomes large
      this.state.superfluidFractionX = Math.min(1.0, 0.4 + 0.1 * omegaR);
      this.state.superfluidFractionY = 1.0;
      this.state.regime = 'single-minimum';
    }

    this.saveState();
  }

  public setRamanCoupling(omegaR: number): void {
    this.state.ramanCouplingER = Math.max(0.1, Math.min(6.0, omegaR));
    this.recalculatePhysics();
    this.playCouplingTone();
  }

  public setRamanDetuning(delta: number): void {
    this.state.ramanDetuningER = Math.max(-2.0, Math.min(2.0, delta));
    this.recalculatePhysics();
  }

  public setRecoilWavenumber(kR: number): void {
    this.state.recoilWavenumberUm = Math.max(2.0, Math.min(20.0, kR));
    this.recalculatePhysics();
  }

  public setRegime(regime: SocBecRegime): void {
    this.state.regime = regime;
    if (regime === 'stripe-supersolid') {
      this.state.ramanCouplingER = 2.0;
      this.state.ramanDetuningER = 0.0;
    } else if (regime === 'single-minimum') {
      this.state.ramanCouplingER = 4.8;
      this.state.ramanDetuningER = 0.0;
    } else if (regime === 'plane-wave') {
      this.state.ramanCouplingER = 1.8;
      this.state.ramanDetuningER = 1.2;
    } else if (regime === 'raman-quench') {
      this.state.ramanCouplingER = 3.95;
      this.state.ramanDetuningER = 0.0;
    }
    this.recalculatePhysics();
    this.playStripeChirp();
  }

  public cycleRegime(): void {
    const regimes: SocBecRegime[] = ['stripe-supersolid', 'single-minimum', 'plane-wave', 'raman-quench'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerSupersolidInterference(): void {
    this.setRegime('stripe-supersolid');
    this.playStripeChirp();
  }

  public update(delta: number): void {
    if (!this.state.isSimulating) return;
    this.state.timeElapsed += delta;
  }

  // --- Procedural Pure-Code Web Audio API ---
  private initAudio(): void {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    } catch {
      // Audio not supported
    }
  }

  public playCouplingTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch mapped to Raman coupling Omega_R (220 Hz -> 660 Hz)
      const freq = 220 + (this.state.ramanCouplingER / 6.0) * 440;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Ignore
    }
  }

  public playStripeChirp(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Twin minimum interference chords: 349.23 Hz (F4) + 523.25 Hz (C5)
      osc1.frequency.setValueAtTime(349.23, now);
      osc1.frequency.exponentialRampToValueAtTime(698.46, now + 0.4);

      osc2.frequency.setValueAtTime(523.25, now);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.48);
      osc2.stop(now + 0.48);
    } catch {
      // Ignore
    }
  }
}

export const spinOrbitBecEngine = new SpinOrbitBecStripeEngine();
