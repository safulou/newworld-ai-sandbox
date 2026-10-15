/**
 * Moiré Topological Excitonic Insulator & Exciton BEC Superfluid Engine
 * Part 46 Subsystem 1
 *
 * Implements:
 * - TMD Moiré heterobilayer (WSe2/MoSe2) interlayer exciton binding
 * - Excitonic Insulator phase transition when binding energy E_b > Delta_0
 * - Berezinskii-Kosterlitz-Thouless (BKT) Exciton Bose-Einstein Condensation (BEC)
 * - Dissipationless counterflow superfluidity (rho_CF = 0) with critical velocity v_c
 * - Topological exciton Chern number C_exc = 1 and anomalous Hall drag
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_moire_excitonic_insulator_bec_state_v1
 */

export type MoireExcitonRegime = 'exciton-gas' | 'topological-excitonic-insulator' | 'exciton-bec-condensate' | 'counterflow-superfluid';

export interface MoireExcitonState {
  twistAngleDeg: number;            // 莫爾扭轉角 theta (度), default 2.15
  excitonBindingEnergyMeV: number;  // 層間激子結合能 E_b (meV), default 145.0
  singleParticleGapMeV: number;     // 單粒子能隙 Delta_0 (meV), default 92.0
  excitonOrderParamMeV: number;     // 激子序參量 Delta_exc = sqrt(E_b^2 - Delta_0^2)
  excitonDensityCm2: number;        // 激子面密度 n_exc (以 10^12 cm^-2 為單位), default 1.8
  bktTransitionTempKelvin: number;  // BKT 激子凝聚臨界轉變溫度 T_BKT (K)
  counterflowCriticalVelocityMs: number; // 對流超流臨界速度 v_c (m/s)
  topologicalChernNum: number;      // 激子拓撲陳數 C_exc, default 1
  counterflowSuperfluidActive: boolean; // 是否處於無耗散對流超流態
  regime: MoireExcitonRegime;       // 運行體制
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_moire_excitonic_insulator_bec_state_v1';

export class MoireExcitonicInsulatorEngine {
  private state: MoireExcitonState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): MoireExcitonState {
    const defaultState: MoireExcitonState = {
      twistAngleDeg: 2.15,
      excitonBindingEnergyMeV: 145.0,
      singleParticleGapMeV: 92.0,
      excitonOrderParamMeV: 112.2,
      excitonDensityCm2: 1.8,
      bktTransitionTempKelvin: 48.5,
      counterflowCriticalVelocityMs: 14200.0,
      topologicalChernNum: 1,
      counterflowSuperfluidActive: true,
      regime: 'exciton-bec-condensate',
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

  public getState(): MoireExcitonState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const Eb = Math.max(10.0, this.state.excitonBindingEnergyMeV);
    const Delta0 = Math.max(10.0, this.state.singleParticleGapMeV);
    const n = Math.max(0.1, this.state.excitonDensityCm2);

    // Excitonic insulator instability condition: E_b > Delta_0
    if (Eb > Delta0) {
      this.state.excitonOrderParamMeV = Math.sqrt(Eb * Eb - Delta0 * Delta0);
    } else {
      this.state.excitonOrderParamMeV = 0.0;
    }

    // BKT Transition Temperature: T_BKT ~ (hbar^2 * n_exc) / (2 * m_exc * k_B)
    // In scaled TMD units: T_BKT ~ 27.0 * n (Kelvin)
    this.state.bktTransitionTempKelvin = 26.94 * n * (this.state.excitonOrderParamMeV > 0 ? 1.0 : 0.05);

    // Counterflow critical velocity: v_c = sqrt(Delta_exc / m_exc)
    const mExcKg = 0.35 * 9.109e-31; // Effective exciton mass ~ 0.35 m_e
    const deltaJoules = this.state.excitonOrderParamMeV * 1.602e-22;
    this.state.counterflowCriticalVelocityMs = Math.sqrt(Math.max(1.0, 2.0 * deltaJoules / mExcKg));

    // Counterflow superfluid active when in BEC or counterflow regime
    if (this.state.regime === 'exciton-gas') {
      this.state.counterflowSuperfluidActive = false;
      this.state.topologicalChernNum = 0;
    } else if (this.state.regime === 'topological-excitonic-insulator') {
      this.state.counterflowSuperfluidActive = false;
      this.state.topologicalChernNum = 1;
    } else if (this.state.regime === 'exciton-bec-condensate') {
      this.state.counterflowSuperfluidActive = true;
      this.state.topologicalChernNum = 1;
    } else if (this.state.regime === 'counterflow-superfluid') {
      this.state.counterflowSuperfluidActive = true;
      this.state.topologicalChernNum = 1;
    }

    this.saveState();
  }

  public setTwistAngle(angle: number): void {
    this.state.twistAngleDeg = Math.max(0.5, Math.min(5.0, angle));
    // Binding energy peaks near moiré magic angle ~ 2.1 deg
    const deltaTheta = this.state.twistAngleDeg - 2.1;
    this.state.excitonBindingEnergyMeV = 160.0 - (deltaTheta * deltaTheta) * 25.0;
    this.recalculatePhysics();
    this.playExcitonChime();
  }

  public setExcitonBindingEnergy(eb: number): void {
    this.state.excitonBindingEnergyMeV = Math.max(20.0, Math.min(250.0, eb));
    this.recalculatePhysics();
    this.playExcitonChime();
  }

  public setSingleParticleGap(gap: number): void {
    this.state.singleParticleGapMeV = Math.max(10.0, Math.min(200.0, gap));
    this.recalculatePhysics();
  }

  public setExcitonDensity(density: number): void {
    this.state.excitonDensityCm2 = Math.max(0.1, Math.min(10.0, density));
    this.recalculatePhysics();
  }

  public setRegime(regime: MoireExcitonRegime): void {
    this.state.regime = regime;
    if (regime === 'exciton-gas') {
      this.state.singleParticleGapMeV = 160.0;
      this.state.excitonBindingEnergyMeV = 70.0;
    } else if (regime === 'topological-excitonic-insulator') {
      this.state.singleParticleGapMeV = 95.0;
      this.state.excitonBindingEnergyMeV = 135.0;
    } else if (regime === 'exciton-bec-condensate') {
      this.state.singleParticleGapMeV = 80.0;
      this.state.excitonBindingEnergyMeV = 165.0;
    } else if (regime === 'counterflow-superfluid') {
      this.state.singleParticleGapMeV = 60.0;
      this.state.excitonBindingEnergyMeV = 190.0;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playExcitonChime();
  }

  public cycleRegime(): void {
    const regimes: MoireExcitonRegime[] = ['exciton-gas', 'topological-excitonic-insulator', 'exciton-bec-condensate', 'counterflow-superfluid'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerCounterflowBurst(): void {
    this.setRegime('counterflow-superfluid');
    this.playCounterflowBurst();
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

  public playExcitonChime(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch tuned with exciton order parameter Delta_exc
      const freq = 360.0 + this.state.excitonOrderParamMeV * 4.5;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignore
    }
  }

  public playCounterflowBurst(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Counterflow dual harmonic chord: E5 (659.25 Hz) + B5 (987.77 Hz)
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(987.77, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
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

export const moireExcitonicInsulatorEngine = new MoireExcitonicInsulatorEngine();
