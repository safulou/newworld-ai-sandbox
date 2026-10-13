/**
 * 非平衡態弗洛凱拓撲超導體與安德烈夫束縛態微波量子引擎
 * (Floquet Topological Superconductor & Andreev Bound State Microwave Engine)
 *
 * 核心物理理論：
 * 1. 弗洛凱週期驅動與反常馬約拉納 \pi-模 (Floquet Majorana 0 and \pi-Modes)：
 *    在週期性高頻微波驅動 V(t) = V_0 \cos(\Omega t) 下，時間平移對稱性離散化為 t \to t + T。
 *    準能量 (Quasi-energy) 譜被摺疊於第一弗洛凱-布里淵區 [-\hbar\Omega/2, \hbar\Omega/2]。
 *    系統突破靜態拓撲超導局限，可在準能量中心 \varepsilon = 0 與邊界 \varepsilon = \hbar\Omega/2 (\pi-模)
 *    同時湧現獨立受拓撲保護之非阿貝爾馬約拉納零能模，具有雙重拓撲不變量 (W_0, W_\pi) \in \mathbb{Z} \times \mathbb{Z}。
 * 2. 動態安德烈夫束縛態 (Dynamical Andreev Bound States, ABS)：
 *    在超導接面中，電子-電洞安德烈夫反射在微波光子交換下形成動態束縛態能階：
 *    E_{\text{ABS}}(\phi) = \pm \Delta \sqrt{1 - D \sin^2(\phi/2)}。
 * 3. Landau-Zener-Stückelberg (LZS) 週期相干量子干涉：
 *    當相位差 \phi 週期性掃過能級反交叉點時，非絕熱穿隧激發相干疊加，
 *    產生幾何 Stueckelberg 相位累積，驅動無耗散非平衡奇異多光子拓撲超電流。
 */

export type FloquetAndreevRegime =
  | 'floquet-majorana-pi-mode'          // 反常弗洛凱馬約拉納 \pi-模拓撲相 (W_\pi = 1)
  | 'dynamical-andreev-bound-states'    // 動態安德烈夫束縛態微波共振態 (ABS 能級分裂)
  | 'landau-zener-stueckelberg'         // LZS 週期相干量子干涉相 (Landau-Zener 條紋)
  | 'nonequilibrium-supercurrent';      // 非平衡多光子拓撲超電流驅動相 (無耗散量子泵)

export interface FloquetAndreevState {
  driveFrequencyGhz: number;            // 微波驅動頻率 \Omega / 2\pi (GHz, 1.0 ~ 60.0)
  driveAmplitudeVolts: number;          // 微波電壓振幅 V_0 (mV, 0.05 ~ 5.0)
  junctionTransparencyD: number;        // 接面穿透率 D (0.1 ~ 0.999)
  phaseDifferencePhiRad: number;        // 約瑟夫森相位差 \phi (rad, 0.0 ~ 6.28)
  superconductingGapMev: number;        // 靜態超導配對能隙 \Delta (meV, 0.1 ~ 4.0)
  regime: FloquetAndreevRegime;

  // 動態演算物理指標
  quasiEnergyMevZeroMode: number;       // \varepsilon = 0 馬約拉納零模準能量 (meV)
  quasiEnergyMevPiMode: number;         // \varepsilon = \hbar\Omega/2 馬約拉納 \pi-模準能量 (meV)
  andreevBoundStateEnergyMev: number;   // 安德烈夫束縛態能級 E_ABS (meV)
  floquetInvariantW0: number;           // 弗洛凱零模拓撲不變量 W_0 (0 或 1)
  floquetInvariantWPi: number;          // 弗洛凱 \pi-模拓撲不變量 W_\pi (0 或 1)
  nonequilibriumSupercurrentMicroAmp: number; // 非平衡拓撲超電流 I_c (\mu A)
  telemetryHistory: Array<{
    timestamp: number;
    absEnergy: number;
    currentMicroAmp: number;
    piModeEnergy: number;
  }>;
}

const STORAGE_KEY = 'newworld_floquet_andreev_state_v1';

class FloquetAndreevSuperconductorEngine {
  private state: FloquetAndreevState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): FloquetAndreevState {
    return {
      driveFrequencyGhz: 24.5,
      driveAmplitudeVolts: 1.25,
      junctionTransparencyD: 0.88,
      phaseDifferencePhiRad: 1.57, // \pi/2 最大超流
      superconductingGapMev: 1.8,
      regime: 'floquet-majorana-pi-mode',
      quasiEnergyMevZeroMode: 0.0,
      quasiEnergyMevPiMode: 0.051, // \hbar\Omega / 2
      andreevBoundStateEnergyMev: 0.62,
      floquetInvariantW0: 1,
      floquetInvariantWPi: 1,
      nonequilibriumSupercurrentMicroAmp: 42.6,
      telemetryHistory: []
    };
  }

  private loadState(): FloquetAndreevState {
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

  public getState(): FloquetAndreevState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<FloquetAndreevState, 'driveFrequencyGhz' | 'driveAmplitudeVolts' | 'junctionTransparencyD' | 'phaseDifferencePhiRad' | 'superconductingGapMev' | 'regime'>>): void {
    if (params.driveFrequencyGhz !== undefined) {
      this.state.driveFrequencyGhz = Math.max(1.0, Math.min(60.0, Number(params.driveFrequencyGhz)));
    }
    if (params.driveAmplitudeVolts !== undefined) {
      this.state.driveAmplitudeVolts = Math.max(0.05, Math.min(5.0, Number(params.driveAmplitudeVolts)));
    }
    if (params.junctionTransparencyD !== undefined) {
      this.state.junctionTransparencyD = Math.max(0.1, Math.min(0.999, Number(params.junctionTransparencyD)));
    }
    if (params.phaseDifferencePhiRad !== undefined) {
      this.state.phaseDifferencePhiRad = Math.max(0.0, Math.min(6.283, Number(params.phaseDifferencePhiRad)));
    }
    if (params.superconductingGapMev !== undefined) {
      this.state.superconductingGapMev = Math.max(0.1, Math.min(4.0, Number(params.superconductingGapMev)));
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

  public pulseMicrowavePump(): void {
    // 注入微波泵浦脈衝，提升驅動振幅
    this.state.driveAmplitudeVolts = Number((this.state.driveAmplitudeVolts + 0.35).toFixed(2));
    if (this.state.driveAmplitudeVolts > 5.0) {
      this.state.driveAmplitudeVolts = 1.0;
    }
    this.state.nonequilibriumSupercurrentMicroAmp = Number((this.state.nonequilibriumSupercurrentMicroAmp + 5.8).toFixed(1));
    this.recalculatePhysics();
    this.playTone(783.99, 'sawtooth'); // G5
    this.saveState();
  }

  public togglePiModeCoupling(): void {
    // 切換反常 \pi-模拓撲不變量 W_\pi
    if (this.state.regime === 'floquet-majorana-pi-mode') {
      this.state.regime = 'dynamical-andreev-bound-states';
      this.state.floquetInvariantWPi = 0;
    } else {
      this.state.regime = 'floquet-majorana-pi-mode';
      this.state.floquetInvariantWPi = 1;
    }
    this.recalculatePhysics();
    this.playTone(587.33, 'triangle'); // D5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { driveFrequencyGhz, driveAmplitudeVolts, junctionTransparencyD, phaseDifferencePhiRad, superconductingGapMev, regime } = this.state;

    // 1. \pi-模準能量 \hbar\Omega / 2 (1 GHz \approx 4.1357 \mu eV = 0.0041357 meV)
    const hbarOmegaMev = driveFrequencyGhz * 0.0041357;
    this.state.quasiEnergyMevPiMode = Number((hbarOmegaMev / 2.0).toFixed(4));
    this.state.quasiEnergyMevZeroMode = 0.0;

    // 2. 動態安德烈夫束縛態能級 E_ABS = \Delta \sqrt{1 - D \sin^2(\phi/2)}
    const sinHalf = Math.sin(phaseDifferencePhiRad / 2.0);
    const absFactor = Math.sqrt(Math.max(0.001, 1.0 - junctionTransparencyD * sinHalf * sinHalf));
    this.state.andreevBoundStateEnergyMev = Number((superconductingGapMev * absFactor).toFixed(3));

    // 3. 弗洛凱拓撲數判定
    if (regime === 'floquet-majorana-pi-mode') {
      this.state.floquetInvariantW0 = 1;
      this.state.floquetInvariantWPi = 1;
    } else if (regime === 'dynamical-andreev-bound-states') {
      this.state.floquetInvariantW0 = 1;
      this.state.floquetInvariantWPi = 0;
    } else {
      this.state.floquetInvariantW0 = 1;
      this.state.floquetInvariantWPi = (driveAmplitudeVolts > 1.5) ? 1 : 0;
    }

    // 4. 非平衡拓撲超電流 I_c \propto \partial E_ABS / \partial \phi
    const currentBase = (superconductingGapMev * junctionTransparencyD * Math.sin(phaseDifferencePhiRad)) / Math.max(0.1, 2.0 * absFactor);
    const photonAssisted = 1.0 + (driveAmplitudeVolts * 0.4);
    const pumpContribution = driveAmplitudeVolts * 6.5;
    this.state.nonequilibriumSupercurrentMicroAmp = Number((Math.max(1.0, Math.abs(currentBase) * 28.5 * photonAssisted + pumpContribution)).toFixed(1));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.sin(now * 0.003) * 0.05;
    this.state.nonequilibriumSupercurrentMicroAmp = Math.max(1.0, Number((this.state.nonequilibriumSupercurrentMicroAmp + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        absEnergy: this.state.andreevBoundStateEnergyMev,
        currentMicroAmp: this.state.nonequilibriumSupercurrentMicroAmp,
        piModeEnergy: this.state.quasiEnergyMevPiMode
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

  private playTone(freq = 600.0, type: OscillatorType = 'sine'): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.36);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const floquetAndreevEngine = new FloquetAndreevSuperconductorEngine();
