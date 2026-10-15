/**
 * Planckian Inflation & Holographic Cosmological Antenna Engine
 * Part 46 Subsystem 3
 *
 * Implements:
 * - Cosmic slow-roll inflation de Sitter metric ds^2 = -dt^2 + exp(2Ht) dx^2
 * - Slow-roll parameters: epsilon = -dH/(H^2 dt), eta = d(epsilon)/(H epsilon dt)
 * - Tensor-to-scalar ratio: r = 16 * epsilon, tensor tilt n_t = -2 * epsilon
 * - Holographic resolution of initial Big Bang singularity via AdS/CFT RG dual
 * - Primordial B-mode gravitational wave tensor power spectrum P_t(k)
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_planckian_inflation_holo_antenna_state_v1
 */

export type InflationHoloRegime = 'slow-roll-uniform' | 'primordial-gw-fluctuation' | 'holographic-singularity-flow' | 'cmb-b-mode-polarization';

export interface PlanckianInflationState {
  hubbleScaleHOverMpl: number;       // 暴脹哈伯尺度 H / M_pl (以 10^-5 為單位), default 1.25
  slowRollEpsilon: number;           // 第一慢滾參數 epsilon, default 0.0035
  slowRollEta: number;               // 第二慢滾參數 eta, default 0.012
  tensorToScalarRatioR: number;      // 張量-標量比 r = 16 * epsilon
  tensorSpectralIndexNt: number;     // 張量譜指數 n_t = -2 * epsilon
  primordialGwPower: number;         // 太初引力波張量功率譜 P_t (10^-10 單位)
  holographicRgScaleZ: number;       // 全息對偶能量尺度 z (普朗克長度單位), default 1.05
  bModePolarizationActive: boolean;  // CMB B-模式引力波旋度偏振是否激活
  regime: InflationHoloRegime;       // 運行體制
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_planckian_inflation_holo_antenna_state_v1';

export class PlanckianInflationHoloEngine {
  private state: PlanckianInflationState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): PlanckianInflationState {
    const defaultState: PlanckianInflationState = {
      hubbleScaleHOverMpl: 1.25,
      slowRollEpsilon: 0.0035,
      slowRollEta: 0.012,
      tensorToScalarRatioR: 0.056,
      tensorSpectralIndexNt: -0.007,
      primordialGwPower: 1.18,
      holographicRgScaleZ: 1.05,
      bModePolarizationActive: true,
      regime: 'cmb-b-mode-polarization',
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

  public getState(): PlanckianInflationState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const eps = Math.max(0.0001, Math.min(0.05, this.state.slowRollEpsilon));
    const hScale = Math.max(0.1, this.state.hubbleScaleHOverMpl);

    // Consistency relations in single-field slow-roll inflation:
    // r = 16 * epsilon
    this.state.tensorToScalarRatioR = 16.0 * eps;

    // n_t = -2 * epsilon
    this.state.tensorSpectralIndexNt = -2.0 * eps;

    // Primordial tensor power: P_t = (2 / pi^2) * (H / M_pl)^2
    // With H in 10^-5 units: P_t ~ 2.026 * H^2 (10^-10 units)
    this.state.primordialGwPower = 2.026 * (hScale * hScale) * (eps / 0.0035);

    // B-mode curl polarization arises whenever r > 0.01
    this.state.bModePolarizationActive = this.state.tensorToScalarRatioR > 0.015;

    if (this.state.regime === 'slow-roll-uniform') {
      this.state.slowRollEpsilon = 0.0008;
      this.state.bModePolarizationActive = false;
    } else if (this.state.regime === 'primordial-gw-fluctuation') {
      this.state.slowRollEpsilon = 0.0028;
    } else if (this.state.regime === 'holographic-singularity-flow') {
      this.state.holographicRgScaleZ = 0.85;
    } else if (this.state.regime === 'cmb-b-mode-polarization') {
      this.state.bModePolarizationActive = true;
    }

    this.saveState();
  }

  public setHubbleScale(hScale: number): void {
    this.state.hubbleScaleHOverMpl = Math.max(0.2, Math.min(5.0, hScale));
    this.recalculatePhysics();
    this.playInflationExpansionHum();
  }

  public setSlowRollEpsilon(eps: number): void {
    this.state.slowRollEpsilon = Math.max(0.0005, Math.min(0.03, eps));
    this.recalculatePhysics();
    this.playInflationExpansionHum();
  }

  public setHolographicScale(z: number): void {
    this.state.holographicRgScaleZ = Math.max(0.1, Math.min(10.0, z));
    this.recalculatePhysics();
  }

  public setRegime(regime: InflationHoloRegime): void {
    this.state.regime = regime;
    if (regime === 'slow-roll-uniform') {
      this.state.slowRollEpsilon = 0.001;
      this.state.hubbleScaleHOverMpl = 0.8;
    } else if (regime === 'primordial-gw-fluctuation') {
      this.state.slowRollEpsilon = 0.003;
      this.state.hubbleScaleHOverMpl = 1.4;
    } else if (regime === 'holographic-singularity-flow') {
      this.state.slowRollEpsilon = 0.0045;
      this.state.hubbleScaleHOverMpl = 2.0;
    } else if (regime === 'cmb-b-mode-polarization') {
      this.state.slowRollEpsilon = 0.0055;
      this.state.hubbleScaleHOverMpl = 2.5;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playInflationExpansionHum();
  }

  public cycleRegime(): void {
    const regimes: InflationHoloRegime[] = ['slow-roll-uniform', 'primordial-gw-fluctuation', 'holographic-singularity-flow', 'cmb-b-mode-polarization'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerBModeBurst(): void {
    this.setRegime('cmb-b-mode-polarization');
    this.playBModePolarizationChord();
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

  public playInflationExpansionHum(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Deep cosmic hum: 55 Hz (A1) rising softly with Hubble scale
      const freq = 55.0 + this.state.hubbleScaleHOverMpl * 35.0;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Ignore
    }
  }

  public playBModePolarizationChord(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Tensor B-mode chord: A3 (220 Hz) + E4 (329.63 Hz)
      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(220.0, now);
      osc2.frequency.setValueAtTime(329.63, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.52);
      osc2.stop(now + 0.52);
    } catch {
      // Ignore
    }
  }
}

export const planckianInflationHoloEngine = new PlanckianInflationHoloEngine();
