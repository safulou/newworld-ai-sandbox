/**
 * axionHaloscope.ts
 * 軸子暗物質暈微波共振腔引擎 (Axion Haloscope Microwave Cavity Engine)
 * 
 * 物理與探測模擬：
 * 1. 普里馬科夫效應 (Sikivie Primakov Effect)：在超導高磁場 B_0 (~ 12 T) 中，冷暗物質軸子轉化為單色微波光子 (a + \gamma^* -> \gamma)。
 * 2. 超導高 Q 值共振腔 (Q ~ 1.5 x 10^5) 與量子極限超導參數放大器 (JPA / SQUID, T_sys -> T_SQL)。
 * 3. 旋轉介電調諧棒角度 (0° ~ 180°) 掃描軸子質量微電子伏特能區 (18 ~ 32 \mu eV)。
 * 4. 4 大軸子物理能區模式（KSVZ 強子軸子、DFSZ 大統一理論軸子、ALP 類軸子粒子、超弦緊緻化軸子）。
 * 5. 純代碼 Web Audio 合成微波掃頻滑音、量子噪聲底與軸子光子捕獲純音。
 */

export type AxionMode = 'ksvz_hadronic' | 'dfsz_gut' | 'alp_exotic' | 'string_compact_axion';

export interface AxionModeConfig {
  id: AxionMode;
  name: string;
  desc: string;
  couplingG: number; // |g_{a\gamma\gamma}| 無因次常數乘數
  snrBonus: number;
  expectedMassRangeUeV: string;
  baseAudioFreq: number;
}

export const AXION_MODES: Record<AxionMode, AxionModeConfig> = {
  ksvz_hadronic: {
    id: 'ksvz_hadronic',
    name: 'KSVZ 強子軸子態 (Kim-Shifman-Vainshtein-Zakharov)',
    desc: '無樹圖輕子耦合之經典強子模型，專注強相互作用 CP 破缺角修正與純膠子頂點',
    couplingG: 0.97,
    snrBonus: 1.0,
    expectedMassRangeUeV: '18.5 ~ 22.4 μeV',
    baseAudioFreq: 440,
  },
  dfsz_gut: {
    id: 'dfsz_gut',
    name: 'DFSZ 大統一軸子態 (Dine-Fischler-Srednicki-Zhitnitsky)',
    desc: '含夸克與帶電輕子重整化耦合，源自超對稱大統一規範對稱破缺尺度',
    couplingG: 0.36,
    snrBonus: 0.85,
    expectedMassRangeUeV: '22.5 ~ 26.8 μeV',
    baseAudioFreq: 523.25,
  },
  alp_exotic: {
    id: 'alp_exotic',
    name: 'ALP 奇異類軸子粒子 (Axion-Like Particle)',
    desc: '脫離 QCD 質量-耦合約束之超廣義擬純量玻色子，具更強雙光子有效頂點',
    couplingG: 2.45,
    snrBonus: 1.6,
    expectedMassRangeUeV: '12.0 ~ 38.0 μeV',
    baseAudioFreq: 659.25,
  },
  string_compact_axion: {
    id: 'string_compact_axion',
    name: '超弦緊緻化軸子暈 (String Compactification Axiverse)',
    desc: '卡拉比-丘六維流形微分形式零模拓撲循環凝聚，具多元模態超對稱性',
    couplingG: 4.12,
    snrBonus: 2.2,
    expectedMassRangeUeV: '5.0 ~ 50.0 μeV',
    baseAudioFreq: 783.99,
  },
};

const STORAGE_KEY = 'newworld_axion_haloscope_state_v1';

export class AxionHaloscopeEngine {
  private static instance: AxionHaloscopeEngine | null = null;

  public magneticFieldTesla: number = 12.0; // 8.0 ~ 16.0 T
  public cavityQFactor: number = 145000; // 品質因子 Q
  public tuningRodAngleDeg: number = 48.5; // 0 ~ 180°
  public systemNoiseTempKelvin: number = 0.12; // 0.05 ~ 0.50 K (接近量子極限)
  public axionPhotonsHarvested: number = 384; // 累積捕獲微波單光子數
  public currentMode: AxionMode = 'ksvz_hadronic';
  public isSweeping: boolean = false;
  public peakSignalFound: boolean = false;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): AxionHaloscopeEngine {
    if (!AxionHaloscopeEngine.instance) {
      AxionHaloscopeEngine.instance = new AxionHaloscopeEngine();
    }
    return AxionHaloscopeEngine.instance;
  }

  /**
   * 當前共振頻率 (GHz)
   * f = 4.5 + 2.7 * (tuningRodAngleDeg / 180)
   */
  public get resonanceFrequencyGhz(): number {
    return 4.5 + 2.7 * (this.tuningRodAngleDeg / 180);
  }

  /**
   * 當前軸子等效質量 (\mu eV)
   * m_a = (h * f) / c^2  ~ 4.135667 * f(GHz)
   */
  public get axionMassMicroEV(): number {
    return this.resonanceFrequencyGhz * 4.1357;
  }

  /**
   * 當前訊噪比 (Signal-to-Noise Ratio, SNR)
   * Sikivie 公式: P ~ g_{a\gamma\gamma}^2 * B_0^2 * V * Q * \rho_a
   */
  public get currentSNR(): number {
    const modeCfg = AXION_MODES[this.currentMode];
    const bFactor = Math.pow(this.magneticFieldTesla / 12.0, 2);
    const qFactor = this.cavityQFactor / 100000;
    const noiseFactor = 0.12 / Math.max(0.04, this.systemNoiseTempKelvin);

    // 模擬在特定角度 (例如 72.4° 與 138.2°) 存在暗物質共振暈峰值
    const target1 = 72.4;
    const target2 = 138.2;
    const dist1 = Math.abs(this.tuningRodAngleDeg - target1);
    const dist2 = Math.abs(this.tuningRodAngleDeg - target2);
    const resonanceProximity = Math.max(0, Math.exp(-dist1 * dist1 / 4.0) + Math.exp(-dist2 * dist2 / 4.0));

    const snr = (0.8 + 8.5 * resonanceProximity) * modeCfg.couplingG * bFactor * qFactor * noiseFactor * modeCfg.snrBonus;
    return parseFloat(snr.toFixed(2));
  }

  /**
   * 旋轉調諧棒微調共振腔幾何
   */
  public setTuningRodAngle(angle: number): void {
    this.tuningRodAngleDeg = Math.max(0, Math.min(180, angle));
    this.checkPeakDetection();
    this.saveState();
  }

  /**
   * 調控超導磁場強度 (Tesla)
   */
  public setMagneticField(tesla: number): void {
    this.magneticFieldTesla = Math.max(6.0, Math.min(18.0, tesla));
    this.saveState();
  }

  /**
   * 切換探測能區模式
   */
  public setMode(mode: AxionMode): void {
    this.currentMode = mode;
    this.playModeChime();
    this.saveState();
  }

  /**
   * 觸發量子放大器單光子採集
   */
  public harvestPhotons(): number {
    const snr = this.currentSNR;
    if (snr < 2.5) {
      return 0;
    }
    const gained = Math.max(1, Math.round(snr * 3.2));
    this.axionPhotonsHarvested += gained;
    this.playPhotonDetectionTone();
    this.saveState();
    return gained;
  }

  /**
   * 自動頻帶步進掃描 (Sweep Resonance Band)
   */
  public triggerSweep(): void {
    this.isSweeping = true;
    this.playMicrowaveChirp();
    const startAngle = this.tuningRodAngleDeg;
    const target = (startAngle + 12.0) % 180;
    this.setTuningRodAngle(target);
    this.isSweeping = false;
  }

  private checkPeakDetection(): void {
    if (this.currentSNR > 5.0) {
      this.peakSignalFound = true;
    } else {
      this.peakSignalFound = false;
    }
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 高 SNR 下緩慢被動吸收暗物質光子
    if (this.currentSNR > 4.5) {
      if (Math.random() < 0.08 * dt * (this.currentSNR / 5)) {
        this.axionPhotonsHarvested += 1;
      }
    }
  }

  // ================= 音效合成 (純 Web Audio API) =================

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * 播放微波共振腔掃頻音 (Chirp)
   */
  public playMicrowaveChirp(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(3200, t + 0.35);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放軸子光子捕獲純音 (Crystalline Photon Ping)
   */
  public playPhotonDetectionTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      [1318.51, 1567.98, 2093.0].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.08);
        gain.gain.setValueAtTime(0.2, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.42);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 模式切換和弦音
   */
  public playModeChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseFreq = AXION_MODES[this.currentMode].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.25);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        magneticFieldTesla: this.magneticFieldTesla,
        cavityQFactor: this.cavityQFactor,
        tuningRodAngleDeg: this.tuningRodAngleDeg,
        systemNoiseTempKelvin: this.systemNoiseTempKelvin,
        axionPhotonsHarvested: this.axionPhotonsHarvested,
        currentMode: this.currentMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 忽略
    }
  }

  public loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.magneticFieldTesla === 'number') this.magneticFieldTesla = parsed.magneticFieldTesla;
      if (typeof parsed.cavityQFactor === 'number') this.cavityQFactor = parsed.cavityQFactor;
      if (typeof parsed.tuningRodAngleDeg === 'number') this.tuningRodAngleDeg = parsed.tuningRodAngleDeg;
      if (typeof parsed.systemNoiseTempKelvin === 'number') this.systemNoiseTempKelvin = parsed.systemNoiseTempKelvin;
      if (typeof parsed.axionPhotonsHarvested === 'number') this.axionPhotonsHarvested = parsed.axionPhotonsHarvested;
      if (parsed.currentMode && AXION_MODES[parsed.currentMode as AxionMode]) {
        this.currentMode = parsed.currentMode as AxionMode;
      }
    } catch {
      // 忽略
    }
  }
}

export const axionHaloscope = AxionHaloscopeEngine.getInstance();
