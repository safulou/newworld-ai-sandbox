/**
 * Non-Abelian Spin Superfluid & Weyl Fermion Topological Kink Engine
 * Part 46 Subsystem 2
 *
 * Implements:
 * - Easy-plane quantum magnet dissipationless pure spin supercurrent J_s = -rho_s * grad(phi_s)
 * - Spin Josephson effect: spin precession frequency omega_s = 2 * mu_s / hbar
 * - Topological spin kink / domain wall soliton formation of width xi_s
 * - Coupling to Weyl semimetal chiral anomaly and topological charge accumulation
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_non_abelian_spin_superfluid_state_v1
 */

export type SpinSuperfluidRegime = 'uniform-spin-ground' | 'dissipationless-supercurrent' | 'topological-spin-kink' | 'spin-josephson-oscillation';

export interface NonAbelianSpinState {
  spinChemicalPotentialUeV: number;   // 自旋化學勢偏置 mu_s (ueV), default 45.0
  spinStiffnessRhoS: number;          // 自旋超流剛度 rho_s (meV / nm), default 18.5
  phaseGradientGradPhi: number;       // 自旋進動相位梯度 grad(phi_s) (rad / nm), default 0.12
  spinSupercurrentDensity: number;    // 無耗散純自旋超流密度 J_s = rho_s * grad(phi_s)
  spinJosephsonFrequencyGhz: number;  // 自旋約瑟夫森進動頻率 omega_s (GHz)
  solitonKinkWidthNm: number;         // 拓撲自旋扭折孤子寬度 xi_s (nm), default 16.8
  chiralChargeAccumulation: number;   // 外爾手性電荷積累量 rho_5 (a.u.)
  topologicalWindingNumber: number;   // 拓撲自旋繞數 W_s, default 1
  regime: SpinSuperfluidRegime;       // 運行體制
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_non_abelian_spin_superfluid_state_v1';

export class NonAbelianSpinSuperfluidEngine {
  private state: NonAbelianSpinState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): NonAbelianSpinState {
    const defaultState: NonAbelianSpinState = {
      spinChemicalPotentialUeV: 45.0,
      spinStiffnessRhoS: 18.5,
      phaseGradientGradPhi: 0.12,
      spinSupercurrentDensity: 2.22,
      spinJosephsonFrequencyGhz: 136.7,
      solitonKinkWidthNm: 16.8,
      chiralChargeAccumulation: 0.85,
      topologicalWindingNumber: 1,
      regime: 'dissipationless-supercurrent',
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

  public getState(): NonAbelianSpinState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const muS = Math.max(0.1, this.state.spinChemicalPotentialUeV);
    const rhoS = Math.max(0.1, this.state.spinStiffnessRhoS);
    const gradPhi = Math.max(0.001, this.state.phaseGradientGradPhi);

    // Spin supercurrent: J_s = rho_s * grad(phi_s)
    this.state.spinSupercurrentDensity = rhoS * gradPhi;

    // Spin Josephson relation: omega_s = (2 * mu_s) / hbar
    // 1 ueV / hbar = 1.5192675 GHz
    this.state.spinJosephsonFrequencyGhz = 2.0 * muS * 1.5192675;

    // Topological spin kink width ~ sqrt(A_ex / K_easy)
    this.state.solitonKinkWidthNm = Math.sqrt(rhoS * 15.2);

    // Chiral anomaly charge accumulation in coupled Weyl node
    this.state.chiralChargeAccumulation = Math.min(5.0, (this.state.spinSupercurrentDensity * 0.42));

    if (this.state.regime === 'uniform-spin-ground') {
      this.state.topologicalWindingNumber = 0;
      this.state.phaseGradientGradPhi = 0.005;
      this.state.spinSupercurrentDensity = 0.01;
    } else if (this.state.regime === 'dissipationless-supercurrent') {
      this.state.topologicalWindingNumber = 1;
    } else if (this.state.regime === 'topological-spin-kink') {
      this.state.topologicalWindingNumber = 2;
    } else if (this.state.regime === 'spin-josephson-oscillation') {
      this.state.topologicalWindingNumber = 1;
    }

    this.saveState();
  }

  public setSpinChemicalPotential(mu: number): void {
    this.state.spinChemicalPotentialUeV = Math.max(1.0, Math.min(200.0, mu));
    this.recalculatePhysics();
    this.playSpinPrecessionTone();
  }

  public setSpinStiffness(rho: number): void {
    this.state.spinStiffnessRhoS = Math.max(1.0, Math.min(50.0, rho));
    this.recalculatePhysics();
  }

  public setPhaseGradient(grad: number): void {
    this.state.phaseGradientGradPhi = Math.max(0.01, Math.min(0.5, grad));
    this.recalculatePhysics();
    this.playSpinPrecessionTone();
  }

  public setRegime(regime: SpinSuperfluidRegime): void {
    this.state.regime = regime;
    if (regime === 'uniform-spin-ground') {
      this.state.spinChemicalPotentialUeV = 5.0;
      this.state.phaseGradientGradPhi = 0.01;
    } else if (regime === 'dissipationless-supercurrent') {
      this.state.spinChemicalPotentialUeV = 45.0;
      this.state.phaseGradientGradPhi = 0.15;
    } else if (regime === 'topological-spin-kink') {
      this.state.spinChemicalPotentialUeV = 75.0;
      this.state.phaseGradientGradPhi = 0.28;
    } else if (regime === 'spin-josephson-oscillation') {
      this.state.spinChemicalPotentialUeV = 135.0;
      this.state.phaseGradientGradPhi = 0.35;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playSpinPrecessionTone();
  }

  public cycleRegime(): void {
    const regimes: SpinSuperfluidRegime[] = ['uniform-spin-ground', 'dissipationless-supercurrent', 'topological-spin-kink', 'spin-josephson-oscillation'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerSpinJosephsonBurst(): void {
    this.setRegime('spin-josephson-oscillation');
    this.playSpinJosephsonBurst();
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

  public playSpinPrecessionTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Pitch dynamically scales with spin supercurrent density
      const freq = 200.0 + this.state.spinSupercurrentDensity * 90.0;
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

  public playSpinJosephsonBurst(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // High-frequency spin Josephson tremolo: A5 (880 Hz) -> A6 (1760 Hz)
      osc1.type = 'square';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(880.0, now);
      osc1.frequency.exponentialRampToValueAtTime(1760.0, now + 0.3);

      osc2.frequency.setValueAtTime(1320.0, now);
      osc2.frequency.exponentialRampToValueAtTime(2640.0, now + 0.3);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
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

export const nonAbelianSpinSuperfluidEngine = new NonAbelianSpinSuperfluidEngine();
