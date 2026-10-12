/**
 * 引力波自旋記憶與天球角動量流干涉網 (Gravitational-Wave Spin Memory & Angular Momentum Flux Array)
 *
 * 核心物理理論：
 * 1. 引力波自旋記憶效應 (Gravitational-Wave Spin Memory Effect)：
 *    不同於位移記憶由能量通量 dE/d\Omega 驅動，自旋記憶直接源於引力波輻射的角動量通量 dJ/d\Omega；
 *    波包穿過後，在測試粒子環中誘發永久非零的相對旋轉速度跳躍與時間延遲：
 *    \Delta v_{spin} \propto \frac{G}{r c^5} \int \frac{dJ_{gw}}{d\Omega} dt。
 * 2. BMS 超旋轉對稱性 (Bondi-Metzner-Sachs Superrotations Diff(S^2))：
 *    自旋記憶精確對偶於天球上的無窮維 BMS 超旋轉對稱性，由 Virasoro 共形向量場 Y^A(\theta,\phi) 規範。
 * 3. 次領頭階軟引力子定理 (Subleading Soft Graviton Theorem)：
 *    根據 Cachazo-Strominger 定理，自旋記憶對應於量子引力散射中 \mathcal{O}(\omega^0) 階次的次領頭軟引力子極點。
 */

export type GWSpinRegime =
  | 'kerr-spin-orbit'        // 克爾雙黑洞自旋軌道角動量記憶相
  | 'bms-superrotation'      // 天球超旋轉 BMS 幾何向量場映射相
  | 'subleading-soft-graviton' // 次領頭階軟引力子角動量殘餘相
  | 'pulsar-timing-curl';    // 脈衝星計時陣列自旋旋度殘餘相

export interface GWSpinMemoryState {
  kerrSpinParameterChi: number; // 克爾無量綱自旋參數 a/M (0.1 ~ 0.99)
  totalMassSolar: number;       // 雙星總質量 M (M_sun, 20 ~ 200)
  sourceDistanceMpc: number;    // 距離 r (Mpc, 50 ~ 1000)
  misalignmentAngleDeg: number; // 自旋與軌道角動量夾角 \theta_spin (0 ~ 90 度)
  regime: GWSpinRegime;
  // 動態演算物理指標
  spinMemoryVelocityNmS: number;// 測試粒子永久自旋速度躍遷 \Delta v_spin (nm/s)
  rotationalTimeDelayAs: number;// 旋轉 Sagnac 時間延遲 \Delta \tau_spin (阿秒 as)
  radiatedAngularMomentumPct: number; // 輻射角動量百分比 \Delta J / J_init (%)
  bmsSuperrotationCharge: number;     // BMS 超旋轉荷 Q_Y (a.u.)
  celestialVorticityCurl: number;     // 天球速度場旋度 \nabla \times v (10^-18 s^-1)
  burstPhase: number;           // 併合爆發相位 (0 ~ 1)
  telemetryHistory: Array<{
    timestamp: number;
    velocityNmS: number;
    timeDelayAs: number;
    angularMomentum: number;
  }>;
}

const STORAGE_KEY = 'newworld_gw_spin_memory_state_v1';

class GravitationalSpinMemoryEngine {
  private state: GWSpinMemoryState;
  private audioCtx: AudioContext | null = null;
  private isBursting = false;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): GWSpinMemoryState {
    return {
      kerrSpinParameterChi: 0.85,
      totalMassSolar: 75.0,
      sourceDistanceMpc: 380.0,
      misalignmentAngleDeg: 28.0,
      regime: 'kerr-spin-orbit',
      spinMemoryVelocityNmS: 4.62,
      rotationalTimeDelayAs: 184.0,
      radiatedAngularMomentumPct: 22.5,
      bmsSuperrotationCharge: 3.18,
      celestialVorticityCurl: 1.95,
      burstPhase: 0.0,
      telemetryHistory: []
    };
  }

  private loadState(): GWSpinMemoryState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: parsed.telemetryHistory || []
        };
      }
    } catch {
      // fallback
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): GWSpinMemoryState {
    return this.state;
  }

  public setKerrSpin(chi: number): void {
    this.state.kerrSpinParameterChi = Math.max(0.1, Math.min(0.99, chi));
    this.recalculatePhysics();
  }

  public setTotalMass(solar: number): void {
    this.state.totalMassSolar = Math.max(20, Math.min(200, solar));
    this.recalculatePhysics();
  }

  public setDistance(mpc: number): void {
    this.state.sourceDistanceMpc = Math.max(50, Math.min(1000, mpc));
    this.recalculatePhysics();
  }

  public setMisalignmentAngle(deg: number): void {
    this.state.misalignmentAngleDeg = Math.max(0, Math.min(90, deg));
    this.recalculatePhysics();
  }

  public setRegime(regime: GWSpinRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playRegimeChord(regime);
  }

  public setParameters(params: Partial<Pick<GWSpinMemoryState,
    'kerrSpinParameterChi' | 'totalMassSolar' | 'sourceDistanceMpc' | 'misalignmentAngleDeg' | 'regime'
  >>): void {
    if (params.kerrSpinParameterChi !== undefined) {
      this.state.kerrSpinParameterChi = Math.max(0.1, Math.min(0.99, params.kerrSpinParameterChi));
    }
    if (params.totalMassSolar !== undefined) {
      this.state.totalMassSolar = Math.max(20.0, Math.min(200.0, params.totalMassSolar));
    }
    if (params.sourceDistanceMpc !== undefined) {
      this.state.sourceDistanceMpc = Math.max(50.0, Math.min(1000.0, params.sourceDistanceMpc));
    }
    if (params.misalignmentAngleDeg !== undefined) {
      this.state.misalignmentAngleDeg = Math.max(0.0, Math.min(90.0, params.misalignmentAngleDeg));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public triggerMergerSpinBurst(): void {
    this.isBursting = true;
    this.state.burstPhase = 1.0;
    this.state.spinMemoryVelocityNmS = Number((this.state.spinMemoryVelocityNmS * 1.35).toFixed(2));
    this.recalculatePhysics();
    this.playSpinBurstAudio();
    this.saveState();
  }

  public triggerSpinBurst(): void {
    this.triggerMergerSpinBurst();
  }

  public update(delta: number): void {
    if (this.isBursting) {
      this.state.burstPhase = Math.max(0, this.state.burstPhase - delta * 0.4);
      if (this.state.burstPhase <= 0.01) {
        this.state.burstPhase = 0;
        this.isBursting = false;
      }
    }

    this.recalculatePhysics();

    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        velocityNmS: this.state.spinMemoryVelocityNmS,
        timeDelayAs: this.state.rotationalTimeDelayAs,
        angularMomentum: this.state.radiatedAngularMomentumPct
      });
      if (this.state.telemetryHistory.length > 50) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recalculatePhysics(): void {
    const chi = this.state.kerrSpinParameterChi;
    const M = this.state.totalMassSolar;
    const r = this.state.sourceDistanceMpc;
    const thetaRad = (this.state.misalignmentAngleDeg * Math.PI) / 180;

    // 1. 輻射角動量比例 \Delta J / J_init
    // 高自旋且自旋進動進一步增強角動量不對稱輻射
    this.state.radiatedAngularMomentumPct = Math.max(5.0, 15.0 * chi * (1 + 0.5 * Math.sin(thetaRad)));

    // 2. 永久自旋速度躍遷 \Delta v_spin \propto \frac{G \Delta J}{r c^5}
    const distScale = 400.0 / r;
    const massScale = M / 70.0;
    const baseVel = 3.8 * distScale * massScale * chi * Math.sin(thetaRad + 0.2);
    this.state.spinMemoryVelocityNmS = Math.max(0.2, baseVel);

    // 3. 旋轉 Sagnac 時間延遲 \Delta \tau_spin (阿秒 as, 10^-18 s)
    this.state.rotationalTimeDelayAs = Math.max(10.0, this.state.spinMemoryVelocityNmS * 42.0);

    // 4. BMS 超旋轉荷 Q_Y
    this.state.bmsSuperrotationCharge = Math.max(0.5, 2.5 * chi * (M / 60.0));

    // 5. 天球速度場旋度 \nabla \times v
    this.state.celestialVorticityCurl = Math.max(0.1, 0.45 * this.state.spinMemoryVelocityNmS);

    // 體制修正
    switch (this.state.regime) {
      case 'kerr-spin-orbit':
        this.state.spinMemoryVelocityNmS *= 1.3;
        break;
      case 'bms-superrotation':
        this.state.bmsSuperrotationCharge *= 1.6;
        break;
      case 'subleading-soft-graviton':
        this.state.rotationalTimeDelayAs *= 1.25;
        break;
      case 'pulsar-timing-curl':
        this.state.celestialVorticityCurl *= 1.5;
        break;
    }
  }

  // === Procedural Web Audio API ===
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playSpinBurstAudio(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 1. 克爾自旋高頻旋進口哨滑音 (Spinning chirp whistle)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(720, now + 0.5);

      gain1.gain.setValueAtTime(0.02, now);
      gain1.gain.linearRampToValueAtTime(0.15, now + 0.45);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.7);

      // 2. 自旋角動量旋度微渦音 (Curl vortex whoosh)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(95, now + 0.35);
      osc2.frequency.linearRampToValueAtTime(45, now + 0.85);

      gain2.gain.setValueAtTime(0.12, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.1);
    } catch {
      // ignore
    }
  }

  private playRegimeChord(regime: GWSpinRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freqs = [349.23, 440.0, 523.25]; // F4, A4, C5
      if (regime === 'bms-superrotation') freqs = [392.0, 493.88, 587.33]; // G4, B4, D5
      if (regime === 'subleading-soft-graviton') freqs = [440.0, 523.25, 659.25]; // A4, C5, E5
      if (regime === 'pulsar-timing-curl') freqs = [293.66, 369.99, 440.0]; // D4, F#4, A4

      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04 / (idx + 1), this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
      });
    } catch {
      // ignore
    }
  }
}

export const gwSpinMemoryEngine = new GravitationalSpinMemoryEngine();
