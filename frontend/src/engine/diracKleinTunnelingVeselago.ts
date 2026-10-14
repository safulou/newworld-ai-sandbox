/**
 * Dirac Klein Tunneling & Negative Refractive Index Veselago Lens Engine
 * Part 43 Subsystem 1
 *
 * Implements:
 * - 2D Relativistic Dirac fermions in graphene/Dirac semimetal with electrostatic barrier V(x)
 * - Pseudospin-momentum locking and chiral transmission conservation
 * - Perfect Klein tunneling at normal incidence: T(0) == 1.0 (anti-backscattering phase cancellation)
 * - Fabry-Pérot interference fringes at oblique angles T(theta, q_x, D)
 * - Negative refractive index Veselago Dirac lens (n1 = +1, n2 < 0) and caustic focus
 * - Procedural pure-code Web Audio sound synthesis
 * - Client-side localStorage persistence under newworld_dirac_klein_tunneling_state_v1
 */

export type KleinRegime = 
  | 'normal-klein'      // 正入射完美克萊因穿隧相 (T(0) = 1.0)
  | 'fabry-perot'       // 斜入射法布里-佩羅干涉相
  | 'veselago-lens'     // 負折射率 Veselago 靜電透鏡相
  | 'magnetic-confined' // 強磁場朗道能階磁束縛態

export interface DiracKleinState {
  incidentEnergyEv: number;       // 入射費米能 E (eV), default 0.15 eV
  barrierHeightEv: number;        // 靜電勢壘高度 V0 (eV), default 0.35 eV
  barrierWidthNm: number;         // 勢壘寬度 D (nm), default 50 nm
  incidentAngleDeg: number;       // 入射角 theta (deg), 0 to 80 deg
  fermiVelocityMs: number;        // 費米速度 v_F (m/s), 1.0e6 m/s
  normalTransmission: number;     // 正入射透射率 T(0) == 1.0
  actualTransmission: number;     // 當前角度透射率 T(theta)
  refractiveIndexN2: number;      // 勢壘內有效折射率 n2 = sgn(E - V0) * |E - V0| / E
  veselagoFocalLengthNm: number;  // Veselago 透鏡焦點距離 (nm)
  fabryPerotPhaseRad: number;     // 勢壘內往返干涉相位 2 * q_x * D
  reflectionProbability: number;  // 反射率 R = 1 - T
  regime: KleinRegime;
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_dirac_klein_tunneling_state_v1';
const HBAR = 1.054571817e-34; // J s
const EV_TO_JOULE = 1.602176634e-19;

export class DiracKleinTunnelingEngine {
  private state: DiracKleinState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): DiracKleinState {
    const defaultState: DiracKleinState = {
      incidentEnergyEv: 0.15,
      barrierHeightEv: 0.35,
      barrierWidthNm: 50.0,
      incidentAngleDeg: 15.0,
      fermiVelocityMs: 1.0e6,
      normalTransmission: 1.0,
      actualTransmission: 0.85,
      refractiveIndexN2: -1.33,
      veselagoFocalLengthNm: 37.5,
      fabryPerotPhaseRad: 4.25,
      reflectionProbability: 0.15,
      regime: 'veselago-lens',
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
      // Fallback to default
    }
    return defaultState;
  }

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore storage errors
    }
  }

  public getState(): DiracKleinState {
    return { ...this.state };
  }

  /**
   * Calculate transmission coefficient T(theta) through 2D Dirac electrostatic barrier
   * T(theta) = cos^2(theta) * cos^2(theta') / [cos^2(q_x D) cos^2(theta) cos^2(theta') + sin^2(q_x D)(1 - s s' sin(theta) sin(theta'))^2]
   */
  public calculateTransmission(angleDeg: number): number {
    const E = this.state.incidentEnergyEv;
    const V0 = this.state.barrierHeightEv;
    const D_m = this.state.barrierWidthNm * 1e-9;
    const vF = this.state.fermiVelocityMs;

    const theta = (angleDeg * Math.PI) / 180;
    const s = Math.sign(E) || 1;
    const sPrime = Math.sign(E - V0) || -1;

    const kF = (Math.abs(E) * EV_TO_JOULE) / (HBAR * vF);
    const qF = (Math.abs(E - V0) * EV_TO_JOULE) / (HBAR * vF);

    const ky = kF * Math.sin(theta);

    // Check if evanescent inside barrier
    if (Math.abs(ky) >= qF) {
      // Evanescent wave inside barrier, exponential decay
      const kappa = Math.sqrt(ky * ky - qF * qF);
      const T_evan = Math.exp(-2 * kappa * D_m);
      return Math.max(0.0, Math.min(1.0, T_evan));
    }

    const sinThetaPrime = ky / qF;
    const thetaPrime = Math.asin(Math.max(-1.0, Math.min(1.0, sinThetaPrime)));
    const cosTheta = Math.cos(theta);
    const cosThetaPrime = Math.cos(thetaPrime);

    const qx = qF * cosThetaPrime;
    const qxD = qx * D_m;

    const cosTerm = Math.cos(qxD) * cosTheta * cosThetaPrime;
    const sinTerm = Math.sin(qxD) * (1 - s * sPrime * Math.sin(theta) * Math.sin(thetaPrime));

    const denominator = cosTerm * cosTerm + sinTerm * sinTerm;
    if (denominator <= 1e-12) return 1.0;

    const T = (cosTheta * cosTheta * cosThetaPrime * cosThetaPrime) / denominator;
    return Math.max(0.0, Math.min(1.0, T));
  }

  public recalculatePhysics(): void {
    const E = this.state.incidentEnergyEv;
    const V0 = this.state.barrierHeightEv;
    const D_nm = this.state.barrierWidthNm;

    // Normal incidence is strictly 1.0 (anti-backscattering)
    this.state.normalTransmission = 1.0;

    // Actual transmission at user-selected angle
    this.state.actualTransmission = this.calculateTransmission(this.state.incidentAngleDeg);
    this.state.reflectionProbability = 1.0 - this.state.actualTransmission;

    // Negative refractive index n2 = sgn(E - V0) * ( |E - V0| / E )
    const sPrime = Math.sign(E - V0) || -1;
    this.state.refractiveIndexN2 = sPrime * (Math.abs(E - V0) / Math.max(0.01, E));

    // Veselago focal length f_v = D / (1 + |n2|)
    const absN2 = Math.abs(this.state.refractiveIndexN2);
    this.state.veselagoFocalLengthNm = D_nm / Math.max(0.1, 1.0 + absN2);

    // Fabry-Perot round-trip phase
    const vF = this.state.fermiVelocityMs;
    const qF = (Math.abs(E - V0) * EV_TO_JOULE) / (HBAR * vF);
    const theta = (this.state.incidentAngleDeg * Math.PI) / 180;
    const kF = (Math.abs(E) * EV_TO_JOULE) / (HBAR * vF);
    const ky = kF * Math.sin(theta);
    const qx = Math.abs(ky) < qF ? Math.sqrt(qF * qF - ky * ky) : 0;
    this.state.fabryPerotPhaseRad = 2.0 * qx * (D_nm * 1e-9);

    // Update regime if not overridden
    if (this.state.incidentAngleDeg <= 0.1) {
      this.state.regime = 'normal-klein';
    } else if (this.state.refractiveIndexN2 < -0.9 && this.state.refractiveIndexN2 > -1.1) {
      this.state.regime = 'veselago-lens';
    } else if (Math.abs(Math.sin(this.state.fabryPerotPhaseRad / 2)) < 0.2) {
      this.state.regime = 'fabry-perot';
    }

    this.saveState();
  }

  public setIncidentEnergy(ev: number): void {
    this.state.incidentEnergyEv = Math.max(0.02, Math.min(1.0, ev));
    this.recalculatePhysics();
    this.playKleinTone();
  }

  public setBarrierHeight(ev: number): void {
    this.state.barrierHeightEv = Math.max(0.05, Math.min(2.0, ev));
    this.recalculatePhysics();
    this.playKleinTone();
  }

  public setBarrierWidth(nm: number): void {
    this.state.barrierWidthNm = Math.max(10.0, Math.min(200.0, nm));
    this.recalculatePhysics();
  }

  public setIncidentAngle(deg: number): void {
    this.state.incidentAngleDeg = Math.max(0.0, Math.min(80.0, deg));
    this.recalculatePhysics();
  }

  public setRegime(r: KleinRegime): void {
    this.state.regime = r;
    if (r === 'normal-klein') {
      this.state.incidentAngleDeg = 0.0;
    } else if (r === 'veselago-lens') {
      this.state.incidentAngleDeg = 20.0;
      this.state.barrierHeightEv = this.state.incidentEnergyEv * 2.0; // n2 = -1.0
    } else if (r === 'fabry-perot') {
      this.state.incidentAngleDeg = 35.0;
    }
    this.recalculatePhysics();
    this.playTransmissionChirp();
  }

  public cycleRegime(): void {
    const regimes: KleinRegime[] = ['normal-klein', 'fabry-perot', 'veselago-lens', 'magnetic-confined'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerPerfectTunneling(): void {
    this.state.incidentAngleDeg = 0.0;
    this.recalculatePhysics();
    this.playTransmissionChirp();
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

  public playKleinTone(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Frequency mapped from transmission rate (400 Hz -> 880 Hz)
      const baseFreq = 400 + this.state.actualTransmission * 480;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore
    }
  }

  public playTransmissionChirp(): void {
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

      // Sweep simulating Veselago optical focus: 523.25 Hz -> 1046.5 Hz
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35);

      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.35);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.42);
      osc2.stop(now + 0.42);
    } catch {
      // Ignore
    }
  }
}

export const diracKleinTunnelingEngine = new DiracKleinTunnelingEngine();
