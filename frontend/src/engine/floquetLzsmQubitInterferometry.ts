/**
 * Floquet-Landau-Zener-Stückelberg-Majorana (LZSM) Qubit Interferometry
 * Part 44 Subsystem 2
 *
 * Implements:
 * - Strongly periodically driven two-level superconducting qubit: H(t) = -epsilon(t)/2 * sigma_z - Delta/2 * sigma_x
 * - Drive: epsilon(t) = epsilon_0 + A * cos(omega * t)
 * - Single passage transition probability P_LZ = exp(-pi * Delta^2 / (2 * hbar * v))
 * - Stückelberg phase Phi_St accumulated between avoided crossings
 * - LZSM constructive / destructive interference fringes (diamond patterns in epsilon_0 vs A)
 * - Coherent Destruction of Tunneling (CDT) at Bessel zeros J_0(A / (hbar * omega)) = 0
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_floquet_lzsm_qubit_state_v1
 */

export type LzsmRegime = 'lzsm-fringes' | 'coherent-destruction' | 'adiabatic-passage' | 'multiphoton-resonance';

export interface FloquetLzsmState {
  biasEpsilon0Ghz: number;         // 靜態偏置 epsilon_0 (GHz), default 1.2
  driveAmplitudeAGhz: number;     // 驅動振幅 A (GHz), default 4.8
  driveFrequencyOmegaGhz: number; // 驅動頻率 omega / 2pi (GHz), default 2.0
  tunnelingDeltaGhz: number;      // 穿隧分裂 Delta (GHz), default 0.35
  stuckelbergPhaseRad: number;    // 斯圖克伯格干涉相位 Phi_St (rad)
  besselJ0Val: number;            // 貝索函數值 J_0(A / omega)
  transitionProbPlz: number;      // 單次蘭道-塞納穿隧機率 P_LZ
  excitedStatePopulation: number; // 激發態粒子數布居 P_+ (0.0 ~ 1.0)
  regime: LzsmRegime;             // 干涉模式
  coherentDestructionActive: boolean; // 是否處於 CDT 穿隧相消點
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_floquet_lzsm_qubit_state_v1';

// Exact mathematical Taylor series for 0th-order Bessel function J_0(x)
function besselJ0(x: number): number {
  const xHalf = x / 2.0;
  let term = 1.0;
  let sum = 1.0;
  for (let m = 1; m <= 25; m++) {
    term *= -(xHalf * xHalf) / (m * m);
    sum += term;
    if (Math.abs(term) < 1e-12) break;
  }
  return sum;
}

export class FloquetLzsmEngine {
  private state: FloquetLzsmState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): FloquetLzsmState {
    const defaultState: FloquetLzsmState = {
      biasEpsilon0Ghz: 1.2,
      driveAmplitudeAGhz: 4.8,
      driveFrequencyOmegaGhz: 2.0,
      tunnelingDeltaGhz: 0.35,
      stuckelbergPhaseRad: 1.57,
      besselJ0Val: 0.0,
      transitionProbPlz: 0.15,
      excitedStatePopulation: 0.52,
      regime: 'lzsm-fringes',
      coherentDestructionActive: false,
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

  public getState(): FloquetLzsmState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const eps0 = this.state.biasEpsilon0Ghz;
    const A = this.state.driveAmplitudeAGhz;
    const omega = Math.max(0.1, this.state.driveFrequencyOmegaGhz);
    const Delta = Math.max(0.01, this.state.tunnelingDeltaGhz);

    // Dimensionless driving parameter x = A / (hbar * omega)
    const x = A / omega;
    this.state.besselJ0Val = besselJ0(x);

    // Speed of crossing at epsilon(t) = 0: v = A * omega * sqrt(1 - (eps0 / A)^2) if |eps0| < A
    const canCross = Math.abs(eps0) < A;
    let v = 0.01;
    if (canCross) {
      v = A * omega * Math.sqrt(Math.max(0.001, 1.0 - (eps0 / A) * (eps0 / A)));
    }

    // Landau-Zener probability: P_LZ = exp(-pi * Delta^2 / (2 * v))
    const pLz = canCross ? Math.exp((-Math.PI * Delta * Delta) / (2.0 * Math.max(0.01, v))) : 0.0;
    this.state.transitionProbPlz = pLz;

    // Stückelberg Phase accumulated along adiabatic cycle:
    // Phi_St ~ (1 / omega) * int sqrt((eps0 + A cos tau)^2 + Delta^2) dtau
    // Approximated analytically by elliptic mean energy
    const meanEnergy = Math.sqrt(eps0 * eps0 + 0.5 * A * A + Delta * Delta);
    this.state.stuckelbergPhaseRad = (meanEnergy / omega) * Math.PI;

    // Interference interference condition:
    // P_+ = 4 * P_LZ * (1 - P_LZ) * sin^2(Phi_St + phi_Stokes)
    const sinTerm = Math.sin(this.state.stuckelbergPhaseRad);
    let population = 4.0 * pLz * (1.0 - pLz) * sinTerm * sinTerm;

    // CDT condition: when J_0(A / omega) ~ 0, tunneling is completely suppressed
    const isCdt = Math.abs(this.state.besselJ0Val) < 0.08;
    this.state.coherentDestructionActive = isCdt;

    if (this.state.regime === 'coherent-destruction') {
      population = population * Math.abs(this.state.besselJ0Val);
    } else if (this.state.regime === 'adiabatic-passage') {
      population = 1.0 - pLz;
    } else if (this.state.regime === 'multiphoton-resonance') {
      // Peaks when eps0 ~ n * omega
      const nRes = Math.round(eps0 / omega);
      const detuning = Math.abs(eps0 - nRes * omega);
      const resonancePeak = Math.exp(-detuning * detuning * 12.0);
      population = Math.min(1.0, population + 0.45 * resonancePeak);
    } else if (isCdt) {
      population = population * Math.abs(this.state.besselJ0Val);
    }

    this.state.excitedStatePopulation = Math.max(0.0, Math.min(1.0, population));
    this.saveState();
  }

  public setBias(eps0: number): void {
    this.state.biasEpsilon0Ghz = Math.max(-10.0, Math.min(10.0, eps0));
    this.recalculatePhysics();
    this.playInterferenceChirp();
  }

  public setDriveAmplitude(A: number): void {
    this.state.driveAmplitudeAGhz = Math.max(0.1, Math.min(15.0, A));
    this.recalculatePhysics();
    this.playInterferenceChirp();
  }

  public setDriveFrequency(omega: number): void {
    this.state.driveFrequencyOmegaGhz = Math.max(0.2, Math.min(8.0, omega));
    this.recalculatePhysics();
  }

  public setTunneling(delta: number): void {
    this.state.tunnelingDeltaGhz = Math.max(0.01, Math.min(2.0, delta));
    this.recalculatePhysics();
  }

  public setRegime(regime: LzsmRegime): void {
    this.state.regime = regime;
    if (regime === 'coherent-destruction') {
      // Set A / omega to first Bessel zero ~ 2.404825
      this.state.driveAmplitudeAGhz = 2.404825 * this.state.driveFrequencyOmegaGhz;
    } else if (regime === 'multiphoton-resonance') {
      this.state.driveAmplitudeAGhz = 4.0;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playInterferenceChirp();
  }

  public cycleRegime(): void {
    const regimes: LzsmRegime[] = ['lzsm-fringes', 'coherent-destruction', 'adiabatic-passage', 'multiphoton-resonance'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
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

  public playInterferenceChirp(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Frequency modulated by population and drive frequency
      const fStart = 320 + this.state.excitedStatePopulation * 480;
      const fEnd = fStart + (this.state.coherentDestructionActive ? -180 : 220);

      osc.type = this.state.coherentDestructionActive ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(fStart, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(50, fEnd), now + 0.28);

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
}

export const floquetLzsmEngine = new FloquetLzsmEngine();
