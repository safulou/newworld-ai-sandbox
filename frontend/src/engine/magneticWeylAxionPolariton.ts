/**
 * Magnetic Weyl Semimetal Axion Polariton & Antiferromagnetic Resonance Engine
 * Part 43 Subsystem 3
 *
 * Implements:
 * - Dynamic axion electrodynamics: L_theta = (alpha / 4*pi^2) * theta(r,t) * (E . B)
 * - Antiferromagnetic magnon hybridization with electromagnetic TE/TM modes
 * - Axion polariton anti-crossing dispersion and polaritonic bandgap Delta_omega_gap
 * - Total internal reflection inside polariton gap & giant non-reciprocal Faraday rotation theta_F
 * - Procedural pure-code Web Audio sound synthesis
 * - Client-side localStorage persistence under newworld_magnetic_weyl_axion_polariton_state_v1
 */

export type AxionPolaritonRegime =
  | 'afm-quiescent'           // 寧靜反鐵磁基態 (delta_theta = 0)
  | 'axion-polariton-gap'     // 軸子極化子反交叉能隙態 (omega ~ omega_AFM)
  | 'non-reciprocal-faraday'  // 非互易反常法拉第光學旋光態
  | 'weyl-node-annihilation'  // 磁化驅動外爾節點湮滅拓撲態

export interface MagneticWeylAxionState {
  afmResonanceThz: number;        // 反鐵磁共振頻率 omega_AFM / 2pi (THz), default 1.2 THz
  weylSeparationB0Ev: number;     // 外爾節點動量軸子強度 b0 (eV), default 0.25 eV
  dielectricConstantEps: number;  // 背景介電常數 epsilon_r, default 12.0
  sampleThicknessUm: number;      // 晶體厚度 d (um), default 10.0 um
  probeFrequencyThz: number;      // 探測光頻率 omega / 2pi (THz), default 1.25 THz
  polaritonGapWidthThz: number;   // 極化子能隙寬度 Delta_omega (THz)
  reflectivityR: number;          // 光學反射率 R (0.0 to 1.0)
  faradayRotationDeg: number;     // 非互易法拉第旋轉角 theta_F (deg)
  kerrRotationDeg: number;        // 柯爾旋轉角 theta_K (deg)
  axionMagnonHybridization: number;// 軸子-磁振子雜化權重 (0.0 to 1.0)
  regime: AxionPolaritonRegime;
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_magnetic_weyl_axion_polariton_state_v1';
const FINE_STRUCTURE_ALPHA = 1 / 137.035999;
const C_LIGHT = 299792458; // m/s

export class MagneticWeylAxionEngine {
  private state: MagneticWeylAxionState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): MagneticWeylAxionState {
    const defaultState: MagneticWeylAxionState = {
      afmResonanceThz: 1.2,
      weylSeparationB0Ev: 0.25,
      dielectricConstantEps: 12.0,
      sampleThicknessUm: 10.0,
      probeFrequencyThz: 1.25,
      polaritonGapWidthThz: 0.18,
      reflectivityR: 0.98,
      faradayRotationDeg: 28.5,
      kerrRotationDeg: 14.2,
      axionMagnonHybridization: 0.85,
      regime: 'axion-polariton-gap',
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

  public getState(): MagneticWeylAxionState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const w_afm = this.state.afmResonanceThz;
    const b0 = this.state.weylSeparationB0Ev;
    const eps = this.state.dielectricConstantEps;
    const w = this.state.probeFrequencyThz;
    const d_um = this.state.sampleThicknessUm;

    // Dimensionless axion-photon hybridization parameter scaled by band Berry curvature
    const g_eff = (b0 / (2.0 * Math.PI * Math.max(0.1, w_afm))) * (10.0 / Math.sqrt(eps));
    const gapWidth = w_afm * (Math.sqrt(1.0 + g_eff * 0.8) - 1.0) + 0.14 * (b0 / 0.25);
    this.state.polaritonGapWidthThz = Math.max(0.06, Math.min(0.5, gapWidth));

    // Gap upper bound
    const gapUpper = w_afm + gapWidth;
    const isInsideGap = (w >= w_afm && w <= gapUpper);

    if (isInsideGap) {
      // Total internal reflection inside polariton gap
      this.state.reflectivityR = 0.96 + 0.038 * Math.sin(((w - w_afm) / gapWidth) * Math.PI);
      this.state.axionMagnonHybridization = 0.92;
      this.state.regime = 'axion-polariton-gap';
    } else {
      // Outside gap: transparent transmission with strong Faraday rotation
      const detuning = Math.abs(w - w_afm);
      const T_trans = 1.0 / (1.0 + (gapWidth * gapWidth) / (4.0 * Math.max(0.001, detuning * detuning)));
      this.state.reflectivityR = Math.max(0.05, 1.0 - T_trans);
      this.state.axionMagnonHybridization = Math.max(0.05, 0.5 * Math.exp(-detuning / (2.0 * gapWidth)));
    }

    // Non-reciprocal Faraday rotation theta_F = (w * d / 2c) * Delta_n
    // In magnetic Weyl semimetal, Delta_n ~ (alpha * b0 / pi) * (w_afm^2 / |w^2 - w_afm^2|)
    const deltaN = (FINE_STRUCTURE_ALPHA * b0 * 10.0) / (Math.PI * Math.max(0.05, Math.abs(w * w - w_afm * w_afm)));
    const opticalPhase = (2.0 * Math.PI * (w * 1e12) * (d_um * 1e-6)) / C_LIGHT;
    const faradayRad = (opticalPhase * deltaN) * 0.5;
    this.state.faradayRotationDeg = Math.min(85.0, Math.abs(faradayRad * (180 / Math.PI)));
    this.state.kerrRotationDeg = this.state.faradayRotationDeg * 0.5;

    this.saveState();
  }

  public setAfmResonance(thz: number): void {
    this.state.afmResonanceThz = Math.max(0.2, Math.min(5.0, thz));
    this.recalculatePhysics();
    this.playPolaritonChirp();
  }

  public setWeylSeparation(ev: number): void {
    this.state.weylSeparationB0Ev = Math.max(0.05, Math.min(1.0, ev));
    this.recalculatePhysics();
  }

  public setProbeFrequency(thz: number): void {
    this.state.probeFrequencyThz = Math.max(0.2, Math.min(6.0, thz));
    this.recalculatePhysics();
  }

  public setRegime(regime: AxionPolaritonRegime): void {
    if (regime === 'afm-quiescent') {
      this.state.weylSeparationB0Ev = 0.05;
      this.state.probeFrequencyThz = 0.5;
    } else if (regime === 'axion-polariton-gap') {
      this.state.weylSeparationB0Ev = 0.35;
      this.state.probeFrequencyThz = this.state.afmResonanceThz + 0.05;
    } else if (regime === 'non-reciprocal-faraday') {
      this.state.weylSeparationB0Ev = 0.45;
      this.state.probeFrequencyThz = this.state.afmResonanceThz + 0.8;
    } else if (regime === 'weyl-node-annihilation') {
      this.state.weylSeparationB0Ev = 0.85;
      this.state.probeFrequencyThz = 2.4;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playPolaritonChirp();
  }

  public cycleRegime(): void {
    const regimes: AxionPolaritonRegime[] = ['afm-quiescent', 'axion-polariton-gap', 'non-reciprocal-faraday', 'weyl-node-annihilation'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerPolaritonResonance(): void {
    this.setRegime('axion-polariton-gap');
    this.playPolaritonChirp();
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
      // Ignore
    }
  }

  public playPolaritonChirp(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      // Anti-crossing frequency glide: 440 Hz -> 880 Hz & 660 Hz -> 1320 Hz
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.38);

      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.38);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Ignore
    }
  }
}

export const magneticWeylAxionEngine = new MagneticWeylAxionEngine();
