/**
 * Holographic Quantum Chaos & MSS Thermalization Scrambling Engine
 * Part 45 Subsystem 4
 *
 * Implements:
 * - AdS/CFT Black Hole Quantum Chaos (Fastest Scramblers in the Universe)
 * - Out-of-Time-Order Correlator (OTOC): F(t) = <W^dagger(t) V^dagger(0) W(t) V(0)> ~ 1 - (1/N^2) * exp(lambda_L * t)
 * - Maldacena-Shenker-Stanford (MSS) maximal chaos bound saturation: lambda_L = 2pi * k_B * T / hbar
 * - Butterfly effect and spatial chaos wavefront: v_B = sqrt((d+1)/(2d)) * c
 * - Scrambling time t_* = (1 / lambda_L) * ln(N^2)
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_holographic_chaos_thermalization_state_v1
 */

export type HolographicChaosRegime = 'early-local-perturbation' | 'exponential-otoc-decay' | 'mss-bound-saturation' | 'thermal-scrambled-equilibrium';

export interface HolographicChaosState {
  hawkingTemperatureKelvin: number; // 霍金溫度 T_H (Kelvin), default 1.8 K
  entropyDegreesN2: number;         // 規範群秩或微觀自由度 N^2, default 2500
  lyapunovExponentLambda: number;   // 李雅普諾夫混亂指數 lambda_L (s^-1)
  mssBoundRatio: number;            // MSS 混亂界限飽和比例 lambda_L / (2pi k_B T / hbar) ~ 1.0
  scramblingTimeSec: number;        // 擾亂時間 t_* (s)
  otocCorrelatorVal: number;        // 時序失序關聯函數 OTOC F(t) (1.0 -> 0.0)
  butterflyVelocityC: number;       // 蝴蝶速度 v_B / c, default 0.816 (d=4 AdS_5: sqrt(5/6) ~ 0.912, d=2: sqrt(3/4) ~ 0.866)
  scrambledFractionPct: number;     // 資訊擾亂熱化百分比 (1 - F(t)) * 100%
  regime: HolographicChaosRegime;   // 混亂狀態
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_holographic_chaos_thermalization_state_v1';

export class HolographicChaosEngine {
  private state: HolographicChaosState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): HolographicChaosState {
    const defaultState: HolographicChaosState = {
      hawkingTemperatureKelvin: 1.8,
      entropyDegreesN2: 2500,
      lyapunovExponentLambda: 11.31,
      mssBoundRatio: 1.0,
      scramblingTimeSec: 0.69,
      otocCorrelatorVal: 0.82,
      butterflyVelocityC: 0.866,
      scrambledFractionPct: 18.0,
      regime: 'exponential-otoc-decay',
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

  public getState(): HolographicChaosState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const T = Math.max(0.1, this.state.hawkingTemperatureKelvin);
    const N2 = Math.max(10, this.state.entropyDegreesN2);

    // MSS bound: lambda_max = 2 * pi * T (in scaled dimensionless units where k_B / hbar = 1)
    const lambdaMax = 2.0 * Math.PI * T;
    this.state.lyapunovExponentLambda = lambdaMax;
    this.state.mssBoundRatio = 1.0; // Einstein gravity dual saturates MSS bound strictly

    // Scrambling time: t_* = (1 / lambda_L) * ln(N^2)
    this.state.scramblingTimeSec = Math.log(N2) / Math.max(0.01, lambdaMax);

    // Butterfly velocity in AdS_d+1 / CFT_d: v_B = sqrt((d+1) / (2d)) with d=3 -> sqrt(4/6) = 0.816
    this.state.butterflyVelocityC = Math.sqrt(4.0 / 6.0);

    // OTOC Correlator F(t) = max(0.0, 1 - (1 / N^2) * exp(lambda_L * t))
    const t = Math.max(0.0, this.state.timeElapsed % (this.state.scramblingTimeSec * 2.0));
    const growth = (1.0 / N2) * Math.exp(Math.min(25.0, lambdaMax * t));

    let fVal = Math.max(0.0, 1.0 - growth);
    if (this.state.regime === 'early-local-perturbation') {
      fVal = 0.98;
    } else if (this.state.regime === 'thermal-scrambled-equilibrium') {
      fVal = 0.01;
    } else if (this.state.regime === 'mss-bound-saturation') {
      fVal = 0.50;
    }

    this.state.otocCorrelatorVal = fVal;
    this.state.scrambledFractionPct = (1.0 - fVal) * 100.0;

    this.saveState();
  }

  public setTemperature(tKelvin: number): void {
    this.state.hawkingTemperatureKelvin = Math.max(0.1, Math.min(10.0, tKelvin));
    this.recalculatePhysics();
    this.playChaosTone();
  }

  public setEntropyDegrees(n2: number): void {
    this.state.entropyDegreesN2 = Math.max(50, Math.min(50000, n2));
    this.recalculatePhysics();
  }

  public setRegime(regime: HolographicChaosRegime): void {
    this.state.regime = regime;
    if (regime === 'early-local-perturbation') {
      this.state.timeElapsed = 0.05;
    } else if (regime === 'mss-bound-saturation') {
      this.state.timeElapsed = this.state.scramblingTimeSec * 0.85;
    } else if (regime === 'thermal-scrambled-equilibrium') {
      this.state.timeElapsed = this.state.scramblingTimeSec * 1.8;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playChaosTone();
  }

  public cycleRegime(): void {
    const regimes: HolographicChaosRegime[] = ['early-local-perturbation', 'exponential-otoc-decay', 'mss-bound-saturation', 'thermal-scrambled-equilibrium'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerRapidScramblingBurst(): void {
    this.setRegime('mss-bound-saturation');
    this.playScramblingBurst();
  }

  public update(delta: number): void {
    if (!this.state.isSimulating) return;
    this.state.timeElapsed += delta;
    this.recalculatePhysics();
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

  public playChaosTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch shifts dynamically with Lyapunov growth and temperature
      const freq = 160.0 + this.state.hawkingTemperatureKelvin * 80.0 + (1.0 - this.state.otocCorrelatorVal) * 350.0;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  public playScramblingBurst(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      // Butterfly chaos expansion interval: 261.63 (C4) -> 1046.50 (C6)
      osc1.frequency.setValueAtTime(261.63, now);
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);

      osc2.frequency.setValueAtTime(392.0, now);
      osc2.frequency.exponentialRampToValueAtTime(1568.0, now + 0.35);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
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

export const holographicChaosEngine = new HolographicChaosEngine();
