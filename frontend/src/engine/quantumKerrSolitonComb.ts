/**
 * 巨克爾非線性量子光子斯奎茲頻梳發電機
 * (Giant Kerr Nonlinear Soliton Frequency Comb & Quantum Squeezing Generator)
 *
 * 核心物理理論：
 * 1. 盧吉亞托-勒菲弗方程 (Lugiato-Lefever Equation, LLE) 與微環耗散克爾孤子 (DKS)：
 *    在超高品質因子 (Q > 10^7) 氮化矽 (Si3N4) 微環光學諧振腔中，連續波 (CW) 激光泵浦
 *    與三階巨克爾非線性 \chi^{(3)} 及反常群速度色散 (GVD, D_2 > 0) 交互耦合。
 *    非線性相位調製補償腔損耗與色散展寬，自發鎖模湧現飛秒級超短耗散克爾光孤子。
 * 2. 八度跨度光學頻率梳 (Octave-Spanning Optical Frequency Comb)：
 *    高能孤子光譜藉由微結構色散工程擴展超過一個光學八度 (Octave)，
 *    每一齒光頻精確滿足 f_n = f_{\text{ceo}} + n f_{\text{rep}}。
 *    藉由 f-2f 自參考干涉儀可測量並鎖定載波包絡偏移頻率 f_{\text{ceo}}，提供世界級光學原子鐘頻標。
 * 3. 多模量子壓縮光子態 (Multi-Mode Quantum Squeezing)：
 *    自發四波混頻 (FWM) 與克爾介質真空起伏交互作用，在對稱側帶齒上產生
 *    強關聯量子糾纏光子對，形成突破標準量子極限 (SQL) 之多模壓縮態 (可達 -14 dB 壓縮度)。
 */

export type KerrCombRegime =
  | 'dissipative-kerr-soliton'       // 單孤子低雜訊鎖模相 (阿秒超快脈衝列車)
  | 'octave-spanning-comb'           // 八度跨度超寬譜自參考相 (f-2f 載波包絡鎖定)
  | 'multi-soliton-crystal'          // 超穩定孤子分子晶體態 (高諧波等間距輸出)
  | 'quantum-squeezed-frequency-comb';// 多模量子壓縮亞泊松光子相 (突破散粒雜訊極限)

export interface KerrCombState {
  cavityQualityFactorMillion: number;// 腔品質因子 Q (百萬, 1.0 ~ 80.0, 即 10^6 ~ 8x10^7)
  pumpPowerMilliWatt: number;        // 泵浦激光功率 P_in (mW, 10.0 ~ 600.0)
  laserDetuningGhz: number;          // 激光-腔失諧量 \delta (GHz, -5.0 ~ 15.0)
  microRingRadiusMicrons: number;    // 微環諧振腔半徑 R (μm, 20.0 ~ 250.0)
  dispersionParameterD2Khz: number;  // 二階反常色散參數 D_2 / 2\pi (kHz, 10.0 ~ 500.0)
  regime: KerrCombRegime;

  // 動態演算物理指標
  solitonPulseWidthFemtosecond: number; // 孤子光脈衝寬度 \tau_p (fs)
  combLineCount: number;             // 有效頻率梳齒數量 (齒)
  repetitionRateGhz: number;         // 脈衝重複頻率 f_rep (GHz)
  quantumSqueezingDb: number;        // 多模量子噪聲壓縮度 (dB, 負值表示低於 SQL)
  f2fInterferometricSnrDb: number;   // f-2f 自參考干涉信噪比 (dB)
  photonPhaseNoiseDbcHz: number;     // 載波相位雜訊 (dBc/Hz @ 10kHz)
  telemetryHistory: Array<{
    timestamp: number;
    pulseWidthFs: number;
    squeezingDb: number;
    combLines: number;
  }>;
}

const STORAGE_KEY = 'newworld_kerr_soliton_comb_state_v1';

class QuantumKerrCombEngine {
  private state: KerrCombState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): KerrCombState {
    return {
      cavityQualityFactorMillion: 25.0, // 2.5 x 10^7
      pumpPowerMilliWatt: 180.0,
      laserDetuningGhz: 4.2,
      microRingRadiusMicrons: 80.0,
      dispersionParameterD2Khz: 120.0,
      regime: 'dissipative-kerr-soliton',
      solitonPulseWidthFemtosecond: 42.5,
      combLineCount: 380,
      repetitionRateGhz: 282.5,
      quantumSqueezingDb: -11.5,
      f2fInterferometricSnrDb: 46.8,
      photonPhaseNoiseDbcHz: -138.2,
      telemetryHistory: []
    };
  }

  private loadState(): KerrCombState {
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
      // 降級取預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存例外
    }
  }

  public getState(): KerrCombState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<KerrCombState, 'cavityQualityFactorMillion' | 'pumpPowerMilliWatt' | 'laserDetuningGhz' | 'microRingRadiusMicrons' | 'dispersionParameterD2Khz' | 'regime'>>): void {
    if (params.cavityQualityFactorMillion !== undefined) {
      this.state.cavityQualityFactorMillion = Math.max(1.0, Math.min(80.0, Number(params.cavityQualityFactorMillion)));
    }
    if (params.pumpPowerMilliWatt !== undefined) {
      this.state.pumpPowerMilliWatt = Math.max(10.0, Math.min(600.0, Number(params.pumpPowerMilliWatt)));
    }
    if (params.laserDetuningGhz !== undefined) {
      this.state.laserDetuningGhz = Math.max(-5.0, Math.min(15.0, Number(params.laserDetuningGhz)));
    }
    if (params.microRingRadiusMicrons !== undefined) {
      this.state.microRingRadiusMicrons = Math.max(20.0, Math.min(250.0, Number(params.microRingRadiusMicrons)));
    }
    if (params.dispersionParameterD2Khz !== undefined) {
      this.state.dispersionParameterD2Khz = Math.max(10.0, Math.min(500.0, Number(params.dispersionParameterD2Khz)));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }

    this.recalculatePhysics();
    this.playTone();
    this.saveState();
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public triggerSolitonStepSweep(): void {
    // 激發紅失諧調頻步驟以穩定單孤子態
    this.state.laserDetuningGhz = Number((this.state.laserDetuningGhz + 0.8).toFixed(1));
    if (this.state.laserDetuningGhz > 14.0) {
      this.state.laserDetuningGhz = 3.5;
    }
    this.recalculatePhysics();
    this.playTone(880.0, 'sine'); // A5
    this.saveState();
  }

  public toggleSqueezingMode(): void {
    // 快速切換量子壓縮優化體制
    if (this.state.regime !== 'quantum-squeezed-frequency-comb') {
      this.state.regime = 'quantum-squeezed-frequency-comb';
    } else {
      this.state.regime = 'octave-spanning-comb';
    }
    this.recalculatePhysics();
    this.playTone(698.46, 'sawtooth'); // F5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { cavityQualityFactorMillion, pumpPowerMilliWatt, laserDetuningGhz, microRingRadiusMicrons, dispersionParameterD2Khz, regime } = this.state;

    // 1. 重複頻率 f_rep \approx c / (2\pi n_g R)
    // 假設群折射率 n_g = 2.0，光速 3e8 m/s
    // 當 R = 80 um，周長 L = 502.65 um，f_rep = 3e8 / (2 * 502.65e-6) \approx 298 GHz
    const fRep = (3e8 / (2.0 * (2 * Math.PI * microRingRadiusMicrons * 1e-6))) / 1e9;
    this.state.repetitionRateGhz = Number(fRep.toFixed(1));

    // 2. 孤子脈寬 (色散越強、功率適度時脈衝越壓縮)
    const isDetuned = laserDetuningGhz > 1.0;
    const baseWidth = isDetuned ? (550.0 / Math.sqrt(Math.max(1, dispersionParameterD2Khz))) : 180.0;
    const widthBoost = regime === 'dissipative-kerr-soliton' ? 0.75 : 1.2;
    this.state.solitonPulseWidthFemtosecond = Number(Math.max(12.0, baseWidth * widthBoost * Math.sqrt(100.0 / pumpPowerMilliWatt)).toFixed(1));

    // 3. 頻率梳齒數量 (八度跨度時可達 800+ 齒)
    if (regime === 'octave-spanning-comb') {
      this.state.combLineCount = Math.round(Math.min(1200, 650 + pumpPowerMilliWatt * 0.8));
      this.state.f2fInterferometricSnrDb = Number((48.0 + cavityQualityFactorMillion * 0.2).toFixed(1));
    } else if (regime === 'multi-soliton-crystal') {
      this.state.combLineCount = Math.round(240 + pumpPowerMilliWatt * 0.3);
      this.state.f2fInterferometricSnrDb = 35.0;
    } else {
      this.state.combLineCount = Math.round(350 + pumpPowerMilliWatt * 0.4);
      this.state.f2fInterferometricSnrDb = 42.0;
    }

    // 4. 多模量子壓縮度 (dB)
    if (regime === 'quantum-squeezed-frequency-comb') {
      const qFactor = Math.min(1.0, cavityQualityFactorMillion / 40.0);
      this.state.quantumSqueezingDb = Number((-9.0 - qFactor * 6.5).toFixed(1)); // 可達 -15.5 dB
    } else {
      this.state.quantumSqueezingDb = Number((-4.0 - (cavityQualityFactorMillion / 50.0) * 3.0).toFixed(1));
    }

    // 5. 相位雜訊
    this.state.photonPhaseNoiseDbcHz = Number((-120.0 - cavityQualityFactorMillion * 0.6).toFixed(1));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.sin(now * 0.0025) * 0.04;
    this.state.quantumSqueezingDb = Number((this.state.quantumSqueezingDb + drift * delta * 0.1).toFixed(2));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        pulseWidthFs: this.state.solitonPulseWidthFemtosecond,
        squeezingDb: this.state.quantumSqueezingDb,
        combLines: this.state.combLineCount
      });
      if (this.state.telemetryHistory.length > 25) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq = 587.33, type: OscillatorType = 'sine'): void { // D5
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.31);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const quantumKerrCombEngine = new QuantumKerrCombEngine();
