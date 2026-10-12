/**
 * 太赫茲超導約瑟夫森量子相干混頻器與微波雙模壓縮光子探針 (Terahertz Josephson Mixer & Squeezed Microwave Probe)
 *
 * 核心物理理論：
 * 1. 交流約瑟夫森效應 (AC Josephson Effect in THz Regime)：
 *    超導弱連接兩側庫珀對超導相位差 \phi(t) 隨跨接電壓 V 隨時間進動：
 *    \frac{d\phi}{dt} = \frac{2e}{\hbar} V。
 *    直流電壓 V 產生高頻振盪超導超流 I_s = I_c \sin\phi，約瑟夫森頻率常數為：
 *    f_J / V = \frac{2e}{h} \approx 483.5979\text{ GHz/mV}。
 *    在毫伏偏壓下直接在太赫茲 (0.1 ~ 5.0 THz) 頻域產生超快相干量子振盪。
 * 2. 夏皮羅量子鎖相階躍 (Shapiro Steps)：
 *    外加微波/太赫茲輻射場 f_{\text{rf}} 時，非線性相位差與外場發生高階混頻鎖相，
 *    在 I-V 曲線中湧現精確量子化平直階躍：
 *    V_n = n \frac{h f_{\text{rf}}}{2e}。
 * 3. 約瑟夫森非線性電感與雙模壓縮真空態 (TMSV)：
 *    非線性約瑟夫森電感 L_J(\phi) = \frac{\Phi_0}{2\pi I_c \cos\phi} 驅動無耗散參量下轉換，
 *    在太赫茲波段生成雙模壓縮真空光子態 (Two-Mode Squeezed Vacuum, TMSV)，
 *    噪聲方差低於標準量子極限 (SQL)，壓縮度達到 -10 ~ -16 dB。
 */

export type JosephsonMixerRegime =
  | 'squeezed-vacuum-tmsv'          // 雙模微波壓縮真空態 (突破 SQL 極限)
  | 'shapiro-phase-lock'            // 夏皮羅高階量子階躍鎖相態
  | 'parametric-four-wave-mix'      // 約瑟夫森非線性四波混頻放大態
  | 'quantum-noise-limited-detector';// 太赫茲量子極限相干探測態

export interface TerahertzJosephsonMixerState {
  biasVoltageMilliVolt: number;        // 直流偏壓 V_dc (mV, 0.1 ~ 8.0)
  rfPumpFrequencyThz: number;          // 太赫茲幫浦頻率 f_pump (THz, 0.2 ~ 4.0)
  junctionCriticalCurrentMicroAmp: number; // 約瑟夫森臨界電流 I_c (\mu A, 10 ~ 500)
  shapiroStepOrderN: number;           // 夏皮羅階數 n (0 ~ 5)
  temperatureKelvin: number;           // 結溫 T (K, 0.01 ~ 9.0)
  regime: JosephsonMixerRegime;
  // 動態演算物理指標
  josephsonFrequencyThz: number;       // 約瑟夫森振盪頻率 f_J (THz)
  shapiroStepVoltageMv: number;        // 當前夏皮羅台階電壓 V_n (mV)
  squeezingFactorDb: number;           // 微波雙模壓縮度 (dB, 負值表示低於真空噪聲)
  quantumEfficiencyPct: number;        // 探測量子效率 \eta (%)
  phaseJitterFemtosec: number;         // 相位抖動時間 \Delta t (fs)
  convertedMixerGainDb: number;        // 參量混頻增益 G (dB)
  telemetryHistory: Array<{
    timestamp: number;
    freqThz: number;
    squeezingDb: number;
    gainDb: number;
  }>;
}

const STORAGE_KEY = 'newworld_thz_josephson_mixer_state_v1';

class TerahertzJosephsonMixerEngine {
  private state: TerahertzJosephsonMixerState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): TerahertzJosephsonMixerState {
    return {
      biasVoltageMilliVolt: 2.45,
      rfPumpFrequencyThz: 1.18,
      junctionCriticalCurrentMicroAmp: 180.0,
      shapiroStepOrderN: 2,
      temperatureKelvin: 0.15,
      regime: 'squeezed-vacuum-tmsv',
      josephsonFrequencyThz: 1.185,
      shapiroStepVoltageMv: 4.88,
      squeezingFactorDb: -13.6,
      quantumEfficiencyPct: 96.4,
      phaseJitterFemtosec: 42.5,
      convertedMixerGainDb: 22.8,
      telemetryHistory: []
    };
  }

  private loadState(): TerahertzJosephsonMixerState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
        };
      }
    } catch {
      // 降級取預設值
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存異常
    }
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.saveState();
  }

  public getState(): Readonly<TerahertzJosephsonMixerState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<TerahertzJosephsonMixerState,
    'biasVoltageMilliVolt' | 'rfPumpFrequencyThz' | 'junctionCriticalCurrentMicroAmp' | 'shapiroStepOrderN' | 'temperatureKelvin' | 'regime'
  >>): void {
    if (params.biasVoltageMilliVolt !== undefined) {
      this.state.biasVoltageMilliVolt = Math.max(0.1, Math.min(8.0, params.biasVoltageMilliVolt));
    }
    if (params.rfPumpFrequencyThz !== undefined) {
      this.state.rfPumpFrequencyThz = Math.max(0.2, Math.min(4.0, params.rfPumpFrequencyThz));
    }
    if (params.junctionCriticalCurrentMicroAmp !== undefined) {
      this.state.junctionCriticalCurrentMicroAmp = Math.max(10.0, Math.min(500.0, params.junctionCriticalCurrentMicroAmp));
    }
    if (params.shapiroStepOrderN !== undefined) {
      this.state.shapiroStepOrderN = Math.max(0, Math.min(5, Math.floor(params.shapiroStepOrderN)));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.01, Math.min(9.0, params.temperatureKelvin));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public pulseParametricPump(): void {
    this.playMixerSound(920, 0.35, 'sawtooth');
    this.state.convertedMixerGainDb = Math.min(35.0, this.state.convertedMixerGainDb + 4.5);
    this.state.squeezingFactorDb = Math.max(-18.0, this.state.squeezingFactorDb - 1.2);
    this.recomputePhysics();
    this.saveState();
  }

  public stepShapiroHarmonic(): void {
    this.playMixerSound(680, 0.45, 'triangle');
    this.state.shapiroStepOrderN = (this.state.shapiroStepOrderN + 1) % 6;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 參量增益隨熱漲落緩慢恢復名義值
    const nominalGain = 18.0 + 5.0 * Math.log10(this.state.junctionCriticalCurrentMicroAmp / 50.0);
    const decay = Math.exp(-delta * 0.35);
    this.state.convertedMixerGainDb = nominalGain + (this.state.convertedMixerGainDb - nominalGain) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        freqThz: Number(this.state.josephsonFrequencyThz.toFixed(3)),
        squeezingDb: Number(this.state.squeezingFactorDb.toFixed(1)),
        gainDb: Number(this.state.convertedMixerGainDb.toFixed(1))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const vDc = this.state.biasVoltageMilliVolt;
    const fPump = this.state.rfPumpFrequencyThz;
    const ic = this.state.junctionCriticalCurrentMicroAmp;
    const n = this.state.shapiroStepOrderN;
    const t = this.state.temperatureKelvin;

    // 約瑟夫森頻率 f_J = (2e / h) * V_dc = 0.4836 THz/mV
    const fJ = 0.4835979 * vDc;
    this.state.josephsonFrequencyThz = Number(fJ.toFixed(3));

    // 夏皮羅電壓階躍 V_n = n * (h / 2e) * f_rf = n * (f_rf / 0.4836)
    const vShapiro = n * (fPump / 0.4835979);
    this.state.shapiroStepVoltageMv = Number(vShapiro.toFixed(2));

    // 雙模壓縮度 S (dB) \propto - \sqrt{I_c / 50} * \exp(-T / 1.5)
    const thermalSuppression = Math.exp(-t / 1.5);
    const rawSqueezing = -8.0 - 5.5 * Math.sqrt(ic / 100.0) * thermalSuppression;
    this.state.squeezingFactorDb = Number(Math.max(-18.0, Math.min(-0.5, rawSqueezing)).toFixed(1));

    // 量子效率 \eta \approx (1 - 0.08 * T) * (1 - 0.02 * \Delta f)
    const freqMismatch = Math.abs(fJ - fPump);
    const efficiency = Math.max(10.0, Math.min(99.5, (100.0 - 6.5 * t - 4.2 * freqMismatch)));
    this.state.quantumEfficiencyPct = Number(efficiency.toFixed(1));

    // 相位抖動時間 \Delta t \propto \hbar / (2e I_c) * \sqrt{k_B T}
    const jitter = 15.0 + (35.0 / Math.sqrt(ic / 50.0)) * Math.sqrt(t + 0.1);
    this.state.phaseJitterFemtosec = Number(Math.min(250.0, jitter).toFixed(1));

    // 體制專屬修正
    if (this.state.regime === 'shapiro-phase-lock') {
      this.state.phaseJitterFemtosec = Number((this.state.phaseJitterFemtosec * 0.45).toFixed(1));
    } else if (this.state.regime === 'squeezed-vacuum-tmsv') {
      this.state.squeezingFactorDb = Number((this.state.squeezingFactorDb - 2.5).toFixed(1));
    }
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playMixerSound(freq: number, duration: number, type: OscillatorType): void {
    try {
      this.initAudioContext();
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 略過 Web Audio 異常
    }
  }
}

export const terahertzJosephsonMixerEngine = new TerahertzJosephsonMixerEngine();
export const josephsonMixerEngine = terahertzJosephsonMixerEngine;
