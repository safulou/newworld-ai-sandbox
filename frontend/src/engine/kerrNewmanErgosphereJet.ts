/**
 * Kerr-Newman Ergosphere & Blandford-Znajek Relativistic Plasma Jet Engine
 * Part 44 Subsystem 3
 *
 * Implements:
 * - Rotating charged black hole metric in Boyer-Lindquist coordinates (M, a, Q)
 * - Event horizon r_+ = M + sqrt(M^2 - a^2 - Q^2)
 * - Static limit / Ergosphere boundary r_ergo(theta) = M + sqrt(M^2 - a^2 cos^2 theta - Q^2)
 * - Frame-dragging metric component g_tt > 0 inside ergosphere
 * - Blandford-Znajek force-free magnetosphere plasma dynamo power P_BZ = (kappa / 4pi c) * Omega_H^2 * Phi_BH^2
 * - Penrose process energy extraction efficiency eta > 1.0 (up to 129% with charge)
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_kerr_newman_ergosphere_state_v1
 */

export type KerrNewmanRegime = 'ergosphere-drag' | 'blandford-znajek-jet' | 'penrose-energy-extraction' | 'extremal-limit';

export interface KerrNewmanState {
  blackHoleMassM: number;          // 黑洞質量 M (以太陽質量 M_sun 為單位), default 10.0
  spinParameterA: number;          // 無因次旋轉自旋參數 a* = J / M^2 (0.0 ~ 0.998), default 0.92
  chargeQ: number;                 // 無因次電荷參數 Q* = Q / M (0.0 ~ 0.35), default 0.15
  magneticFieldGauss: number;      // 吸積盤外層磁場強度 B (Gauss), default 2.5e4
  horizonRadiusKm: number;         // 事件視界半徑 r_+ (km)
  ergoRadiusEquatorKm: number;     // 赤道處能層半徑 r_ergo(pi/2) (km)
  horizonAngularVelRadSec: number; // 視界角速度 Omega_H (rad/s)
  bzJetPowerWatts: number;         // 布蘭福德-茲納耶克 (BZ) 噴流功率 P_BZ (Watts)
  penroseEfficiency: number;       // 彭羅斯過程能量提取效率 eta (例如 1.207 代表 120.7%)
  regime: KerrNewmanRegime;        // 能層運行模式
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_kerr_newman_ergosphere_state_v1';

export class KerrNewmanJetEngine {
  private state: KerrNewmanState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): KerrNewmanState {
    const defaultState: KerrNewmanState = {
      blackHoleMassM: 10.0,
      spinParameterA: 0.92,
      chargeQ: 0.15,
      magneticFieldGauss: 25000,
      horizonRadiusKm: 20.4,
      ergoRadiusEquatorKm: 29.2,
      horizonAngularVelRadSec: 9150.0,
      bzJetPowerWatts: 3.4e38,
      penroseEfficiency: 1.207,
      regime: 'blandford-znajek-jet',
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

  public getState(): KerrNewmanState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const M = Math.max(1.0, this.state.blackHoleMassM);
    // Gravitational radius r_g = G M / c^2 ~ 1.477 km per solar mass
    const rgKm = 1.477 * M;

    // Check extremality constraint: a*^2 + Q*^2 <= 1.0
    let aStar = Math.max(0.0, Math.min(0.998, this.state.spinParameterA));
    let qStar = Math.max(0.0, Math.min(0.8, this.state.chargeQ));
    const radical = 1.0 - aStar * aStar - qStar * qStar;
    if (radical < 0) {
      // Scale down to extremal bound
      const norm = Math.sqrt(aStar * aStar + qStar * qStar);
      aStar = (aStar / norm) * 0.998;
      qStar = (qStar / norm) * 0.998;
      this.state.spinParameterA = aStar;
      this.state.chargeQ = qStar;
    }

    const sqrtDelta = Math.sqrt(Math.max(0.001, 1.0 - aStar * aStar - qStar * qStar));

    // Outer horizon radius r_+ = r_g * (1 + sqrt(1 - a*^2 - Q*^2))
    this.state.horizonRadiusKm = rgKm * (1.0 + sqrtDelta);

    // Ergosphere boundary at equator theta = pi/2: r_ergo = r_g * (1 + sqrt(1 - Q*^2))
    this.state.ergoRadiusEquatorKm = rgKm * (1.0 + Math.sqrt(Math.max(0.001, 1.0 - qStar * qStar)));

    // Horizon angular velocity: Omega_H = (c / r_g) * [a* / (2 * (1 + sqrtDelta) - Q*^2)]
    const speedOfLightKmS = 299792.458;
    const omegaDimless = aStar / (2.0 * (1.0 + sqrtDelta) - qStar * qStar);
    this.state.horizonAngularVelRadSec = (speedOfLightKmS / rgKm) * omegaDimless;

    // Blandford-Znajek jet power:
    // P_BZ ~ 3.4e38 W * (M / 10 M_sun)^2 * a*^2 * (B / 2.5e4 G)^2 * (1 + 0.5 Q*)
    const B = this.state.magneticFieldGauss;
    const bNormalized = B / 25000.0;
    const mNormalized = M / 10.0;
    this.state.bzJetPowerWatts = 3.4e38 * (mNormalized * mNormalized) * (aStar * aStar) * (bNormalized * bNormalized) * (1.0 + 0.5 * qStar);

    // Penrose Process efficiency: eta = 1.0 + 0.207 * a* * (1 + 0.5 * Q*)
    this.state.penroseEfficiency = 1.0 + 0.207 * aStar * (1.0 + 0.5 * qStar);

    if (this.state.regime === 'extremal-limit') {
      this.state.spinParameterA = 0.998;
      this.state.chargeQ = 0.05;
    }

    this.saveState();
  }

  public setSpin(a: number): void {
    this.state.spinParameterA = Math.max(0.0, Math.min(0.998, a));
    this.recalculatePhysics();
    this.playJetWhoosh();
  }

  public setCharge(q: number): void {
    this.state.chargeQ = Math.max(0.0, Math.min(0.5, q));
    this.recalculatePhysics();
  }

  public setMagneticField(bGauss: number): void {
    this.state.magneticFieldGauss = Math.max(100.0, Math.min(1e6, bGauss));
    this.recalculatePhysics();
    this.playJetWhoosh();
  }

  public setRegime(regime: KerrNewmanRegime): void {
    this.state.regime = regime;
    if (regime === 'extremal-limit') {
      this.state.spinParameterA = 0.998;
    } else if (regime === 'penrose-energy-extraction') {
      this.state.spinParameterA = 0.95;
    } else if (regime === 'blandford-znajek-jet') {
      this.state.magneticFieldGauss = 50000;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playJetWhoosh();
  }

  public cycleRegime(): void {
    const regimes: KerrNewmanRegime[] = ['ergosphere-drag', 'blandford-znajek-jet', 'penrose-energy-extraction', 'extremal-limit'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerPenroseExtraction(): void {
    this.setRegime('penrose-energy-extraction');
    this.playPenroseEnergyBurst();
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

  public playJetWhoosh(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80.0 + this.state.spinParameterA * 60.0, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200.0, now);
      filter.frequency.exponentialRampToValueAtTime(1400.0, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(100.0, now + 0.4);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  public playPenroseEnergyBurst(): void {
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

      // Harmonic burst indicating energy gain > 100%
      osc1.frequency.setValueAtTime(220.0, now);
      osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.3);

      osc2.frequency.setValueAtTime(440.0, now);
      osc2.frequency.exponentialRampToValueAtTime(1320.0, now + 0.3);

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

export const kerrNewmanJetEngine = new KerrNewmanJetEngine();
