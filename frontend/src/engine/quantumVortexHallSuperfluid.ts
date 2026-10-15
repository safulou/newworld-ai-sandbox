/**
 * Quantum Vortex Hall Effect & Dual Superfluidity Engine
 * Part 45 Subsystem 1
 *
 * Implements:
 * - Particle-Vortex Duality in rotating superfluids
 * - Magnus force on quantized vortices: F_M = rho_s * kappa x (v_L - v_s)
 * - Vortex Hall conductivity and Hall angle: tan(theta_H) = (rho_s * kappa) / eta_drag
 * - Vortex pinning, lattice melting, and dual superconductor-insulator transition
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_quantum_vortex_hall_state_v1
 */

export type VortexHallRegime = 'vortex-hall-flow' | 'zero-dissipation-pinned' | 'vortex-liquid-nematic' | 'dual-insulator-transition';

export interface QuantumVortexHallState {
  superfluidDensityRhoS: number;  // 超流體密度 rho_s (10^18 m^-2), default 2.4
  vortexCirculationKappa: number; // 量子化環量 kappa = h / m (10^-7 m^2/s), default 1.0
  dragCoefficientEta: number;     // 介質摩擦拖曳係數 eta_drag, default 0.45
  appliedCurrentDensity: number;  // 外加傳輸電流密度 J (A/m), default 1.8
  magnusForceMagnitude: number;   // 馬格納斯力大小 F_M (10^-12 N/m)
  vortexVelocityVL: number;       // 渦旋縱向漂移速度 v_L (mm/s)
  hallAngleDeg: number;           // 渦旋霍爾角 theta_H (deg)
  vortexHallConductivity: number; // 渦旋反常霍爾電導 sigma_VH (e^2/h)
  pinningPotentialStrength: number;// 針扎勢能強度 V_pin (meV), default 0.8
  regime: VortexHallRegime;       // 運行體制
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_quantum_vortex_hall_state_v1';

export class QuantumVortexHallEngine {
  private state: QuantumVortexHallState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): QuantumVortexHallState {
    const defaultState: QuantumVortexHallState = {
      superfluidDensityRhoS: 2.4,
      vortexCirculationKappa: 1.0,
      dragCoefficientEta: 0.45,
      appliedCurrentDensity: 1.8,
      magnusForceMagnitude: 4.32,
      vortexVelocityVL: 3.25,
      hallAngleDeg: 79.4,
      vortexHallConductivity: 0.98,
      pinningPotentialStrength: 0.8,
      regime: 'vortex-hall-flow',
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

  public getState(): QuantumVortexHallState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const rhoS = Math.max(0.1, this.state.superfluidDensityRhoS);
    const kappa = Math.max(0.1, this.state.vortexCirculationKappa);
    const eta = Math.max(0.01, this.state.dragCoefficientEta);
    const J = Math.max(0.0, this.state.appliedCurrentDensity);
    const Vpin = Math.max(0.0, this.state.pinningPotentialStrength);

    // Lorentz-like Magnus force per unit vortex length: F_M = rho_s * kappa * v_s
    const vs = J * 1.2; // Superfluid velocity proportional to current
    this.state.magnusForceMagnitude = rhoS * kappa * vs;

    // Depinning condition: if F_M < Vpin, vortex is strictly pinned (zero dissipation)
    const isPinned = this.state.magnusForceMagnitude < Vpin * 2.5;

    // Hall angle: tan(theta_H) = (rho_s * kappa) / eta_drag
    const tanTheta = (rhoS * kappa) / eta;
    this.state.hallAngleDeg = (Math.atan(tanTheta) * 180.0) / Math.PI;

    if (this.state.regime === 'zero-dissipation-pinned' || isPinned) {
      this.state.vortexVelocityVL = 0.0;
      this.state.vortexHallConductivity = 1.0; // Strictly quantized, zero longitudinal loss
    } else if (this.state.regime === 'vortex-liquid-nematic') {
      // Fluctuating vortex lines
      const netForce = Math.max(0.0, this.state.magnusForceMagnitude - Vpin);
      this.state.vortexVelocityVL = (netForce / eta) * 1.5;
      this.state.vortexHallConductivity = Math.max(0.1, 1.0 - 0.25 * this.state.vortexVelocityVL);
    } else if (this.state.regime === 'dual-insulator-transition') {
      // Vortices condense, particles localize: dual insulator phase
      this.state.vortexVelocityVL = 8.5;
      this.state.vortexHallConductivity = 0.0;
    } else {
      // Steady vortex hall flow
      const netForce = Math.max(0.0, this.state.magnusForceMagnitude - Vpin * 0.8);
      this.state.vortexVelocityVL = netForce / eta;
      this.state.vortexHallConductivity = Math.sin((this.state.hallAngleDeg * Math.PI) / 180.0);
    }

    this.saveState();
  }

  public setSuperfluidDensity(rho: number): void {
    this.state.superfluidDensityRhoS = Math.max(0.2, Math.min(6.0, rho));
    this.recalculatePhysics();
    this.playVortexTone();
  }

  public setDragCoefficient(eta: number): void {
    this.state.dragCoefficientEta = Math.max(0.05, Math.min(2.5, eta));
    this.recalculatePhysics();
  }

  public setAppliedCurrent(j: number): void {
    this.state.appliedCurrentDensity = Math.max(0.0, Math.min(5.0, j));
    this.recalculatePhysics();
    this.playVortexTone();
  }

  public setPinningStrength(vPin: number): void {
    this.state.pinningPotentialStrength = Math.max(0.0, Math.min(3.0, vPin));
    this.recalculatePhysics();
  }

  public setRegime(regime: VortexHallRegime): void {
    this.state.regime = regime;
    if (regime === 'zero-dissipation-pinned') {
      this.state.pinningPotentialStrength = 2.5;
    } else if (regime === 'dual-insulator-transition') {
      this.state.appliedCurrentDensity = 4.5;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playVortexTone();
  }

  public cycleRegime(): void {
    const regimes: VortexHallRegime[] = ['vortex-hall-flow', 'zero-dissipation-pinned', 'vortex-liquid-nematic', 'dual-insulator-transition'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerVortexDepinningBurst(): void {
    this.setRegime('vortex-hall-flow');
    this.playDepinningBurst();
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

  public playVortexTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch mapped by vortex velocity and Hall angle
      const freq = 220.0 + this.state.vortexVelocityVL * 40.0 + (this.state.hallAngleDeg / 90.0) * 200.0;
      osc.type = 'sine';
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

  public playDepinningBurst(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(329.63, now); // E4
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5

      osc2.frequency.setValueAtTime(493.88, now); // B4
      osc2.frequency.exponentialRampToValueAtTime(987.77, now + 0.3); // B5

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

export const quantumVortexHallEngine = new QuantumVortexHallEngine();
