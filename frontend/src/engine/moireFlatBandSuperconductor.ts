/**
 * 拓撲莫爾超晶格平帶非常規超導反應堆 (Moiré Flat-Band Unconventional Superconductor)
 *
 * 核心物理理論：
 * 1. 魔角雙層石墨烯 (Magic-Angle Twisted Bilayer Graphene, MATBG, \theta \approx 1.08^\circ)：
 *    兩層石墨烯以微小相對扭角 \theta 疊加，形成超大莫爾超晶格週期 L_M = a / (2 \sin(\theta/2)) \approx 13.0 nm。
 * 2. 平帶色散 (Flat Band) 與費米速度歸零：
 *    在第一魔角處層間雜化使低能狄拉克錐速度 v_F^*(\theta) \to 0，帶寬壓縮至 W \sim 5 meV，
 *    庫侖排斥能與動能比 U/W \gg 1，激發強關聯物理。
 * 3. 關聯莫特絕緣態與超導圓頂 (Correlated Insulator & Superconducting Dome)：
 *    在整數微觀填充數 \nu = \pm 2 處電子關聯打開絕緣能隙，微幅摻雜後湧現非常規超導對稱態。
 * 4. 拓撲量子度規與超流剛度 (Quantum Metric & Superfluid Weight)：
 *    儘管有效質量極大 (平帶群速度近零)，幾何量子度規 g_ij 提供有限非零超流重 D_s \propto \int \sqrt{\det g} d^2k。
 */

export type MoireRegime =
  | 'mott-insulator'       // 莫特關聯絕緣相
  | 'unconventional-sc'    // 非常規庫珀對超導圓頂態
  | 'valley-polarized'     // 莫爾激子自發谷極化態
  | 'quantum-metric-sf';   // 量子度規幾何增益超流態

export interface MoireSuperconductorState {
  twistAngleDeg: number;       // 旋轉扭角 \theta (0.8 ~ 3.0 度，魔角 1.08 度)
  fillingFactor: number;       // 莫爾晶格填充數 \nu (-4.0 ~ +4.0)
  interlayerCouplingW0: number; // 層間 AA/AB 雜化能 (meV, 80 ~ 130)
  temperatureKelvin: number;   // 系統溫度 T (K, 0.05 ~ 15.0)
  regime: MoireRegime;
  // 動態演算物理指標
  moirePeriodNm: number;       // 莫爾超晶格常數 L_M (nm)
  flatBandwidthMev: number;    // 平帶帶寬 W (meV)
  fermiVelocityRatio: number;  // 費米速度比 v_F^* / v_F
  coulombRatioUW: number;      // 庫侖相互作用與帶寬比 U / W
  superconductingGapMev: number; // 超導能隙 \Delta_{SC} (meV)
  criticalTempK: number;       // 臨界超導轉變溫度 T_c (K)
  quantumMetricTrace: number;  // 量子幾何度規跡 Tr(g)
  superfluidStiffness: number; // 超流剛度 D_s (a.u.)
  telemetryHistory: Array<{
    timestamp: number;
    angle: number;
    bandwidth: number;
    superconductingGap: number;
    superfluidStiffness: number;
  }>;
}

const STORAGE_KEY = 'newworld_moire_superconductor_state_v1';
const GRAPHENE_A = 0.246; // nm (石墨烯晶格常數)
const MAGIC_ANGLE_DEG = 1.08;

class MoireFlatBandSuperconductorEngine {
  private state: MoireSuperconductorState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): MoireSuperconductorState {
    return {
      twistAngleDeg: 1.08,
      fillingFactor: -2.15, // 靠近 \nu = -2 最佳超導圓頂微摻雜
      interlayerCouplingW0: 105.0,
      temperatureKelvin: 1.2,
      regime: 'unconventional-sc',
      moirePeriodNm: 13.06,
      flatBandwidthMev: 5.2,
      fermiVelocityRatio: 0.04,
      coulombRatioUW: 5.77,
      superconductingGapMev: 1.45,
      criticalTempK: 2.85,
      quantumMetricTrace: 3.42,
      superfluidStiffness: 0.88,
      telemetryHistory: []
    };
  }

  private loadState(): MoireSuperconductorState {
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

  public getState(): MoireSuperconductorState {
    return this.state;
  }

  public setTwistAngle(deg: number): void {
    this.state.twistAngleDeg = Math.max(0.8, Math.min(3.0, deg));
    this.recalculatePhysics();
    this.playAudioChirp(440 + (deg - 1.08) * 200, 0.1);
  }

  public setFillingFactor(nu: number): void {
    this.state.fillingFactor = Math.max(-4.0, Math.min(4.0, nu));
    this.recalculatePhysics();
  }

  public setInterlayerCoupling(w0: number): void {
    this.state.interlayerCouplingW0 = Math.max(80.0, Math.min(130.0, w0));
    this.recalculatePhysics();
  }

  public setTemperature(k: number): void {
    this.state.temperatureKelvin = Math.max(0.05, Math.min(15.0, k));
    this.recalculatePhysics();
  }

  public setRegime(regime: MoireRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playAudioChord(regime);
  }

  public triggerSupercurrentPulse(): void {
    // 注入超流激發脈衝
    this.state.superfluidStiffness = Math.min(2.5, this.state.superfluidStiffness * 1.35);
    this.playPulseTone(587.33, 0.25); // D5
  }

  public update(_delta: number): void {
    // 輕微熱波動與自發量子重構
    const thermalFluc = (Math.random() - 0.5) * 0.01 * this.state.temperatureKelvin;
    this.recalculatePhysics(thermalFluc);

    // 紀錄遙測
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        angle: this.state.twistAngleDeg,
        bandwidth: this.state.flatBandwidthMev,
        superconductingGap: this.state.superconductingGapMev,
        superfluidStiffness: this.state.superfluidStiffness
      });
      if (this.state.telemetryHistory.length > 50) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recalculatePhysics(perturbation = 0): void {
    const thetaRad = (this.state.twistAngleDeg * Math.PI) / 180;
    // 1. 莫爾週期 L_M = a / (2 sin(theta/2))
    this.state.moirePeriodNm = GRAPHENE_A / (2 * Math.sin(thetaRad / 2));

    // 2. 角度偏差與平帶帶寬 W
    const angleDev = Math.abs(this.state.twistAngleDeg - MAGIC_ANGLE_DEG);
    const baseW = 4.8 + 45.0 * Math.pow(angleDev, 1.8);
    this.state.flatBandwidthMev = Math.max(3.0, baseW + perturbation);

    // 3. 費米速度比 v_F^* / v_F
    this.state.fermiVelocityRatio = Math.max(0.01, Math.min(1.0, 0.03 + 1.2 * angleDev));

    // 4. 庫侖能量 U ~ e^2 / (\epsilon L_M) \approx 30 meV
    const U = 32.0;
    this.state.coulombRatioUW = U / this.state.flatBandwidthMev;

    // 5. 臨界溫度與超導能隙 (取決於填充數 \nu 與帶寬 W)
    // 最佳超導圓頂出現在 \nu 接近 -2.1 或 +2.2
    const distDome1 = Math.abs(this.state.fillingFactor - (-2.15));
    const distDome2 = Math.abs(this.state.fillingFactor - (+2.2));
    const domeProximity = Math.max(0, 1 - Math.min(distDome1, distDome2) / 0.85);

    // 溫度衰減係數
    const maxTc = (3.2 * (105 / this.state.interlayerCouplingW0)) / (1 + angleDev * 8);
    this.state.criticalTempK = Math.max(0.05, maxTc * domeProximity);

    const tempRatio = this.state.temperatureKelvin / (this.state.criticalTempK + 0.01);
    if (tempRatio < 1.0) {
      this.state.superconductingGapMev = 1.76 * 0.0862 * this.state.criticalTempK * Math.sqrt(1 - Math.pow(tempRatio, 2));
    } else {
      this.state.superconductingGapMev = 0.0;
    }

    // 6. 量子度規 Tr(g) 與超流剛度 D_s
    // 拓撲莫爾能帶具有非零 Fubini-Study 量子度規
    this.state.quantumMetricTrace = Math.max(1.0, 3.8 / (1 + angleDev * 4));

    // 根據體制修正
    switch (this.state.regime) {
      case 'mott-insulator':
        this.state.superconductingGapMev = 0.0;
        this.state.superfluidStiffness = 0.02;
        break;
      case 'unconventional-sc':
        this.state.superfluidStiffness = (this.state.superconductingGapMev > 0 ? 0.85 : 0.1) * (1 - tempRatio * 0.5);
        break;
      case 'valley-polarized':
        this.state.superconductingGapMev *= 0.4;
        this.state.superfluidStiffness = 0.45;
        break;
      case 'quantum-metric-sf':
        // 量子度規賦予平帶超流強勁剛度
        this.state.superfluidStiffness = 0.35 + 0.25 * this.state.quantumMetricTrace;
        break;
    }

    this.state.superfluidStiffness = Math.max(0.01, Math.min(2.0, this.state.superfluidStiffness));
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

  private playPulseTone(freq: number, duration: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  private playAudioChirp(freq: number, duration: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, this.audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  private playAudioChord(regime: MoireRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freqs = [329.63, 440.0, 523.25]; // E4, A4, C5
      if (regime === 'mott-insulator') freqs = [220.0, 261.63, 311.13]; // A3, C4, Eb4 (diminished)
      if (regime === 'unconventional-sc') freqs = [329.63, 392.0, 493.88]; // E4, G4, B4 (harmonic minor)
      if (regime === 'quantum-metric-sf') freqs = [440.0, 554.37, 659.25]; // A4, C#5, E5 (major bright)

      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05 / (idx + 1), this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.45);
      });
    } catch {
      // ignore
    }
  }
}

export const moireSuperconductorEngine = new MoireFlatBandSuperconductorEngine();
