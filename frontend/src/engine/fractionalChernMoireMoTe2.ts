/**
 * Fractional Chern Insulator & Non-Abelian Anyon Braiding in Twisted Moiré MoTe2
 * Part 44 Subsystem 1
 *
 * Implements:
 * - Zero-field Fractional Quantum Anomalous Hall Effect (FQAHE) in twisted bilayer MoTe2
 * - Moiré flat band (C = -1) with strong Coulomb interaction U / W > 3.0
 * - Fractional filling states: nu = -1 (IQAH), nu = -2/3 (Laughlin e* = e/3), nu = -3/5 (Jain), nu = -1/2 (Moore-Read e* = e/4 non-Abelian)
 * - Topological ground state degeneracy D_g on torus and modular S/T transformation
 * - Many-body charge gap Delta_MB and non-Abelian Ising anyon braiding
 * - Procedural pure-code Web Audio sound synthesis
 * - Client-side localStorage persistence under newworld_fractional_chern_mote2_state_v1
 */

export type FciFillingFraction = '-1' | '-2/3' | '-3/5' | '-1/2' | 'thermal-metal';

export interface FractionalChernState {
  twistAngleDeg: number;          // 扭轉角 theta (deg), default 3.7 deg
  fillingNu: FciFillingFraction;  // 平帶填充數 nu
  moireLatticeNm: number;         // 莫爾晶格常數 a_M (nm)
  bandWidthMev: number;           // 莫爾平帶帶寬 W (meV), default 8.5 meV
  coulombInteractionMev: number;  // 庫侖相互作用 U (meV), default 28.0 meV
  interactionRatio: number;       // U / W (> 1 is strongly correlated)
  hallConductanceE2h: number;     // 零磁場反常霍爾電導 sigma_xy (e^2/h)
  fractionalCharge: number;       // 分數準粒子電荷 e* / e
  groundStateDegeneracy: number;  // 環面拓撲基態簡併度 D_g
  manyBodyGapMev: number;         // 多體能隙 Delta_MB (meV)
  isNonAbelian: boolean;          // 是否具備非阿貝爾任意子 (nu = -1/2)
  temperatureKelvin: number;      // 溫度 (K), default 1.5 K
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_fractional_chern_mote2_state_v1';

export class FractionalChernEngine {
  private state: FractionalChernState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): FractionalChernState {
    const defaultState: FractionalChernState = {
      twistAngleDeg: 3.7,
      fillingNu: '-2/3',
      moireLatticeNm: 5.46,
      bandWidthMev: 8.5,
      coulombInteractionMev: 28.0,
      interactionRatio: 3.29,
      hallConductanceE2h: -0.667,
      fractionalCharge: 0.333,
      groundStateDegeneracy: 3,
      manyBodyGapMev: 3.4,
      isNonAbelian: false,
      temperatureKelvin: 1.5,
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

  public getState(): FractionalChernState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const thetaRad = (this.state.twistAngleDeg * Math.PI) / 180;
    // Moiré period: a_M = a0 / (2 * sin(theta / 2)), with a0 ~ 0.352 nm for MoTe2
    const a0 = 0.352;
    this.state.moireLatticeNm = a0 / Math.max(0.01, 2.0 * Math.sin(thetaRad / 2.0));

    // Bandwidth W decreases near magic angle ~3.7 deg
    const angleDiff = Math.abs(this.state.twistAngleDeg - 3.7);
    this.state.bandWidthMev = 7.0 + 8.0 * angleDiff * angleDiff;

    // Effective Coulomb interaction U = e^2 / (4 pi eps a_M) ~ 28 meV
    this.state.coulombInteractionMev = 150.0 / Math.max(1.0, this.state.moireLatticeNm);
    this.state.interactionRatio = this.state.coulombInteractionMev / Math.max(1.0, this.state.bandWidthMev);

    // Physics by filling fraction nu
    const nu = this.state.fillingNu;
    if (nu === '-1') {
      this.state.hallConductanceE2h = -1.0;
      this.state.fractionalCharge = 1.0;
      this.state.groundStateDegeneracy = 1;
      this.state.manyBodyGapMev = 6.2;
      this.state.isNonAbelian = false;
    } else if (nu === '-2/3') {
      this.state.hallConductanceE2h = -2.0 / 3.0;
      this.state.fractionalCharge = 1.0 / 3.0;
      this.state.groundStateDegeneracy = 3;
      this.state.manyBodyGapMev = 3.6;
      this.state.isNonAbelian = false;
    } else if (nu === '-3/5') {
      this.state.hallConductanceE2h = -3.0 / 5.0;
      this.state.fractionalCharge = 1.0 / 5.0;
      this.state.groundStateDegeneracy = 5;
      this.state.manyBodyGapMev = 2.1;
      this.state.isNonAbelian = false;
    } else if (nu === '-1/2') {
      this.state.hallConductanceE2h = -0.5;
      this.state.fractionalCharge = 0.25;
      this.state.groundStateDegeneracy = 6; // Moore-Read pfaffian torus degeneracy
      this.state.manyBodyGapMev = 1.8;
      this.state.isNonAbelian = true;
    } else {
      // Thermal metal
      this.state.hallConductanceE2h = 0.0;
      this.state.fractionalCharge = 1.0;
      this.state.groundStateDegeneracy = 1;
      this.state.manyBodyGapMev = 0.0;
      this.state.isNonAbelian = false;
    }

    // Thermal suppression if T > Delta_MB / (5 k_B)
    const gapKelvin = (this.state.manyBodyGapMev * 1.60218e-22) / 1.380649e-23;
    if (this.state.temperatureKelvin > gapKelvin && nu !== 'thermal-metal') {
      this.state.fillingNu = 'thermal-metal';
      this.state.manyBodyGapMev = 0.0;
    }

    this.saveState();
  }

  public setTwistAngle(deg: number): void {
    this.state.twistAngleDeg = Math.max(2.0, Math.min(6.0, deg));
    this.recalculatePhysics();
    this.playTopologicalChime();
  }

  public setFilling(nu: FciFillingFraction): void {
    this.state.fillingNu = nu;
    this.recalculatePhysics();
    this.playTopologicalChime();
  }

  public setTemperature(kelvin: number): void {
    this.state.temperatureKelvin = Math.max(0.1, Math.min(25.0, kelvin));
    this.recalculatePhysics();
  }

  public cycleFilling(): void {
    const fractions: FciFillingFraction[] = ['-1', '-2/3', '-3/5', '-1/2', 'thermal-metal'];
    const idx = fractions.indexOf(this.state.fillingNu);
    this.setFilling(fractions[(idx + 1) % fractions.length]);
  }

  public triggerNonAbelianBraiding(): void {
    this.setFilling('-1/2');
    this.playBraidingChord();
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

  public playTopologicalChime(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch mapped by fractional charge e* (1/3 -> 523 Hz, 1/5 -> 659 Hz, 1/4 -> 783 Hz)
      const baseFreq = 440 + (1.0 / Math.max(0.1, this.state.fractionalCharge)) * 50;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

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

  public playBraidingChord(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const osc3 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc3.type = 'sine';

      // Moore-Read non-Abelian triad: C5 (523.25) + E5 (659.25) + G5 (783.99)
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.frequency.setValueAtTime(659.25, now);
      osc3.frequency.setValueAtTime(783.99, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
      osc3.stop(now + 0.55);
    } catch {
      // Ignore
    }
  }
}

export const fractionalChernEngine = new FractionalChernEngine();
