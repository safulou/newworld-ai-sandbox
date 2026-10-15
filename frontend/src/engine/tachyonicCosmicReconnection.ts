/**
 * Tachyonic Cosmic String Reconnection & Throat Transition Engine
 * Part 45 Subsystem 3
 *
 * Implements:
 * - Superstring / D-brane intercommutation and cosmic string collision
 * - Unstable D-brane / anti-D-brane tachyon condensation (m_T^2 < 0)
 * - Local reconnection throat geometry with cusp formation
 * - Closed-string graviton burst radiation: P_GW = Gamma * G * mu^2 * c
 * - Procedural pure-code Web Audio API sound synthesis
 * - Client-side localStorage persistence under newworld_tachyonic_cosmic_reconnection_state_v1
 */

export type TachyonicReconnectionRegime = 'free-string-wiggle' | 'tachyon-condensation' | 'throat-reconnection' | 'closed-string-decay';

export interface TachyonicReconnectionState {
  stringTensionGmu: number;          // 無因次宇宙弦張力 G*mu (以 10^-7 為單位), default 1.8
  collisionVelocityC: number;        // 碰撞相對速度 v / c (0.1 ~ 0.99), default 0.75
  tachyonMassSquared: number;        // 快子質量平方 m_T^2 (負值代表不穩定快子凝聚), default -4.2
  reconnectionProbability: number;   // 重聯穿透機率 P_rec (0.01 ~ 1.0), default 0.92
  gravitonBurstPowerWatts: number;   // 閉弦引力子輻射功率 P_GW (Watts)
  throatRadiusPlanck: number;        // 重聯喉管半徑 (普朗克長度單位), default 14.5
  cuspRadiationActive: boolean;      // 弦尖突 (Cusp) 相干噴流是否激活
  regime: TachyonicReconnectionRegime;// 運行體制
  audioEnabled: boolean;
  isSimulating: boolean;
  timeElapsed: number;
}

const STORAGE_KEY = 'newworld_tachyonic_cosmic_reconnection_state_v1';

export class TachyonicReconnectionEngine {
  private state: TachyonicReconnectionState;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private loadState(): TachyonicReconnectionState {
    const defaultState: TachyonicReconnectionState = {
      stringTensionGmu: 1.8,
      collisionVelocityC: 0.75,
      tachyonMassSquared: -4.2,
      reconnectionProbability: 0.92,
      gravitonBurstPowerWatts: 4.8e39,
      throatRadiusPlanck: 14.5,
      cuspRadiationActive: true,
      regime: 'throat-reconnection',
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

  public getState(): TachyonicReconnectionState {
    return { ...this.state };
  }

  public recalculatePhysics(): void {
    const gmu = Math.max(0.1, this.state.stringTensionGmu);
    const v = Math.max(0.05, Math.min(0.998, this.state.collisionVelocityC));
    const gammaFactor = 1.0 / Math.sqrt(Math.max(0.001, 1.0 - v * v));

    // Tachyon condensation dynamics: m_T^2 < 0 drives throat instability
    const mT2 = this.state.tachyonMassSquared;
    const isCondensed = mT2 < -0.5;

    // Throat radius in Planck lengths ~ sqrt(hbar c / |m_T^2|)
    if (isCondensed) {
      this.state.throatRadiusPlanck = 10.0 + Math.sqrt(Math.abs(mT2)) * 3.5;
    } else {
      this.state.throatRadiusPlanck = 2.0;
    }

    // Graviton radiation power from cosmic string reconnection & cusp:
    // P_GW = Gamma_0 * c^5 / G * (G*mu)^2 * gamma^2
    // With Gamma_0 ~ 50, G*mu ~ 1e-7, base power ~ 10^39 Watts
    const gmuBase = gmu * 1e-7;
    const c5OverG = 3.6e52; // Planck power ~ c^5 / G (Watts)
    this.state.gravitonBurstPowerWatts = 50.0 * c5OverG * (gmuBase * gmuBase) * (gammaFactor * gammaFactor);

    // Cusp formation occurs when relative velocity is relativistic
    this.state.cuspRadiationActive = v > 0.6 && isCondensed;

    // Reconnection probability for superstrings: P_rec depends on string coupling g_s
    if (this.state.regime === 'free-string-wiggle') {
      this.state.reconnectionProbability = 0.05;
      this.state.tachyonMassSquared = 1.2;
    } else if (this.state.regime === 'tachyon-condensation') {
      this.state.reconnectionProbability = 0.65;
    } else if (this.state.regime === 'throat-reconnection') {
      this.state.reconnectionProbability = 0.95;
    } else if (this.state.regime === 'closed-string-decay') {
      this.state.reconnectionProbability = 1.0;
    }

    this.saveState();
  }

  public setStringTension(gmu: number): void {
    this.state.stringTensionGmu = Math.max(0.1, Math.min(10.0, gmu));
    this.recalculatePhysics();
    this.playReconnectionGlissando();
  }

  public setCollisionVelocity(vC: number): void {
    this.state.collisionVelocityC = Math.max(0.1, Math.min(0.99, vC));
    this.recalculatePhysics();
  }

  public setTachyonMassSquared(m2: number): void {
    this.state.tachyonMassSquared = Math.max(-10.0, Math.min(5.0, m2));
    this.recalculatePhysics();
    this.playReconnectionGlissando();
  }

  public setRegime(regime: TachyonicReconnectionRegime): void {
    this.state.regime = regime;
    if (regime === 'free-string-wiggle') {
      this.state.tachyonMassSquared = 1.5;
    } else if (regime === 'tachyon-condensation') {
      this.state.tachyonMassSquared = -3.5;
    } else if (regime === 'throat-reconnection') {
      this.state.tachyonMassSquared = -5.8;
    }
    this.recalculatePhysics();
    this.state.regime = regime;
    this.saveState();
    this.playReconnectionGlissando();
  }

  public cycleRegime(): void {
    const regimes: TachyonicReconnectionRegime[] = ['free-string-wiggle', 'tachyon-condensation', 'throat-reconnection', 'closed-string-decay'];
    const idx = regimes.indexOf(this.state.regime);
    this.setRegime(regimes[(idx + 1) % regimes.length]);
  }

  public triggerThroatRupture(): void {
    this.setRegime('throat-reconnection');
    this.playThroatRuptureBurst();
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

  public playReconnectionGlissando(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Tachyon negative imaginary frequency sweep down to deep bass
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140.0, now);
      osc.frequency.exponentialRampToValueAtTime(45.0, now + 0.35);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  public playThroatRuptureBurst(): void {
    if (!this.state.audioEnabled) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc1.type = 'square';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(90.0, now);
      osc1.frequency.exponentialRampToValueAtTime(360.0, now + 0.25);

      osc2.frequency.setValueAtTime(180.0, now);
      osc2.frequency.exponentialRampToValueAtTime(720.0, now + 0.25);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400.0, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }
}

export const tachyonicReconnectionEngine = new TachyonicReconnectionEngine();
