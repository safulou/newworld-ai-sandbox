/**
 * Holographic c-Theorem & Renormalization Group (RG) Flow Engine
 * Part 44 Subsystem 4
 *
 * Implements:
 * - AdS/CFT Holographic RG Flow with Domain Wall supergravity metric
 * - Null Energy Condition (NEC): T_uv N^u N^v >= 0 ensuring A''(r) <= 0
 * - Holographic c-function: c(z) monotonically decreasing along RG flow from UV (z=0) to IR (z->inf)
 * - Irreversible coarse-graining of microscopic degrees of freedom (Zamolodchikov / Cardy / Komargodski-Schwimmer c-theorem)
 * - Beta function beta(g) = dg / d ln(mu) with UV & IR conformal fixed points
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_holographic_c_theorem_state_v1
 */

export type HolographicRgRegime = 'uv-fixed-point' | 'rg-c-flow' | 'ir-conformal-fixed' | 'domain-wall-kink';

export interface HolographicCTheoremState {
  uvCentralCharge: number;         // 紫外中央荷 c_UV (高能自由度), default 120.0
  irCentralCharge: number;         // 紅外中央荷 c_IR (低能自由度), default 42.0
  energyScaleZ: number;            // 全息徑向能量尺度 z (0.01 ~ 10.0, z->0 為 UV, z 大為 IR), default 1.5
  currentCentralCharge: number;    // 當前能階中央荷 c(z)
  scalarCouplingG: number;         // 標量場耦合強度 g(z)
  betaFunctionVal: number;         // 貝塔函數 beta(g) = dg / d ln(mu)
  necConditionMet: boolean;        // 零能量條件 (NEC) 是否滿足 (保證 c'(z) <= 0)
  degreesOfFreedomLossPct: number; // 自由度損失比例 (c_UV - c(z)) / c_UV * 100%
  regime: HolographicRgRegime;     // RG 流動狀態
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_holographic_c_theorem_state_v1';

export class HolographicCTheoremEngine {
  private state: HolographicCTheoremState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): HolographicCTheoremState {
    const defaultState: HolographicCTheoremState = {
      uvCentralCharge: 120.0,
      irCentralCharge: 42.0,
      energyScaleZ: 1.5,
      currentCentralCharge: 82.5,
      scalarCouplingG: 1.25,
      betaFunctionVal: -0.48,
      necConditionMet: true,
      degreesOfFreedomLossPct: 31.25,
      regime: 'rg-c-flow',
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

  public getState(): HolographicCTheoremState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const cUv = Math.max(10.0, this.state.uvCentralCharge);
    // Ensure c_IR <= c_UV by c-theorem
    const cIr = Math.max(1.0, Math.min(cUv - 1.0, this.state.irCentralCharge));
    this.state.irCentralCharge = cIr;

    const z = Math.max(0.01, Math.min(10.0, this.state.energyScaleZ));

    // Holographic domain wall profile:
    // c(z) = c_IR + (c_UV - c_IR) / (1 + (z / z_0)^2)
    const z0 = 2.0;
    const ratio = (z / z0);
    const denominator = 1.0 + ratio * ratio;
    const cZ = cIr + (cUv - cIr) / denominator;
    this.state.currentCentralCharge = cZ;

    // Loss of degrees of freedom (irreversible information loss)
    this.state.degreesOfFreedomLossPct = ((cUv - cZ) / cUv) * 100.0;

    // Scalar coupling g(z) flowing from g_UV=0 to g_IR=g*
    const gStar = 2.5;
    this.state.scalarCouplingG = gStar * (ratio / Math.sqrt(1.0 + ratio * ratio));

    // Beta function beta(g) = - z * dc/dz * (some factor)
    // dc/dz = -2 * (c_UV - c_IR) * z / (z0^2 * (1 + (z/z0)^2)^2)
    const dcdz = (-2.0 * (cUv - cIr) * z) / (z0 * z0 * denominator * denominator);
    this.state.betaFunctionVal = dcdz * 0.15; // Negative along flow, 0 at endpoints

    // Null energy condition always satisfied in physical domain wall:
    // A''(r) <= 0 guarantees d(c)/dz <= 0
    this.state.necConditionMet = dcdz <= 0.0001;

    this.saveState();
  }

  public setEnergyScale(z: number): void {
    this.state.energyScaleZ = Math.max(0.01, Math.min(10.0, z));
    this.recalculatePhysics();
    this.playFlowTone();
  }

  public setUvCharge(cUv: number): void {
    this.state.uvCentralCharge = Math.max(20.0, Math.min(500.0, cUv));
    this.recalculatePhysics();
  }

  public setIrCharge(cIr: number): void {
    this.state.irCentralCharge = Math.max(1.0, Math.min(this.state.uvCentralCharge - 1.0, cIr));
    this.recalculatePhysics();
  }

  public setRegime(regime: HolographicRgRegime): void {
    this.state.regime = regime;
    if (regime === 'uv-fixed-point') {
      this.state.energyScaleZ = 0.05;
    } else if (regime === 'ir-conformal-fixed') {
      this.state.energyScaleZ = 9.5;
    } else if (regime === 'domain-wall-kink') {
      this.state.energyScaleZ = 2.0;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playFlowTone();
  }

  public cycleRegime(): void {
    const regimes: HolographicRgRegime[] = ['uv-fixed-point', 'rg-c-flow', 'ir-conformal-fixed', 'domain-wall-kink'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerKinkTransition(): void {
    this.setRegime('domain-wall-kink');
    this.playKinkResonance();
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

  public playFlowTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch decreases from UV high frequency to IR low frequency
      const freq = 180.0 + (this.state.currentCentralCharge / this.state.uvCentralCharge) * 620.0;
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

  public playKinkResonance(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Harmonic interval representing domain wall bound state
      osc1.frequency.setValueAtTime(349.23, now); // F4
      osc2.frequency.setValueAtTime(523.25, now); // C5

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch {
      // Ignore
    }
  }
}

export const holographicCTheoremEngine = new HolographicCTheoremEngine();
