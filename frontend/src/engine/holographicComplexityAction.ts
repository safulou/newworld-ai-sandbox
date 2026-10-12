/**
 * AdS/CFT 全息複雜度等於作用量引擎 (Holographic Complexity Equals Action & WDW Patch Dynamo)
 *
 * 核心物理理論：
 * 1. 複雜度等於作用量猜想 (Complexity Equals Action, CA Conjecture)：
 *    在 AdS/CFT 全息對偶中，邊界邊界共形場論 (CFT) 態的量子電路複雜度 C(\psi)
 *    精確對偶於 AdS 塊體內部惠勒-德威特 (Wheeler-DeWitt, WDW) 斑塊上的重力引力作用量：
 *    C = \frac{I_{\text{WDW}}}{\pi \hbar}。
 * 2. 勞埃德極限飽和 (Lloyd's Bound Saturation)：
 *    在黑洞事件視界形成後，內部蟲洞喉管長度與 WDW 斑塊作用量在極長時間內維持線性增長，
 *    其增長率嚴格飽和量子物理中計算操作的最大速率上限（勞埃德極限）：
 *    \frac{dC}{dt} = \frac{2M}{\pi \hbar}。
 * 3. 震波幾何折返與反衝效應 (Switchback Effect & Shock Waves)：
 *    在邊界時間插入早期微擾算符 W(t_w) 會在視界表面激發引力減震波 (Gravitational Shock Wave)，
 *    造成 WDW 作用量在經歷擾亂時間 t_{\text{scr}} = \frac{\beta}{2\pi} \ln S 後產生幾何折返延遲，
 *    完美復現量子電路中時間演化與非對易算符的相互抵消與混沌擴展。
 */

export type HolographicComplexityRegime =
  | 'action-wdw-lloyd-bound'       // CA 猜想：WDW 斑塊飽和勞埃德極限相
  | 'volume-maximal-slice'         // CV 猜想：極大類空超曲面體積生長相
  | 'late-time-saturation'         // 極晚期指數量子混沌飽和高原相
  | 'scrambling-switchback-shock';  // 減震波幾何折返與快速擾亂相

export interface HolographicComplexityState {
  blackHoleMassSolar: number;      // 黑洞質量 M (M_sun, 5.0 ~ 100.0)
  adsCurvatureRadius: number;      // AdS 曲率半徑 \ell (1.0 ~ 20.0)
  evolutionTimeGyr: number;        // 全息演化時間 t (Gyr, 0.0 ~ 50.0)
  boundaryQubitCount: number;      // 邊界微觀自由度 Qubit 數 (100 ~ 5000)
  regime: HolographicComplexityRegime;
  // 動態演算物理指標
  complexityValueGigaGates: number;// 全息量子電路複雜度 C (Giga Gates)
  actionGrowthRateGatesSec: number;// 作用量增長速率 dC/dt (x10^12 Gates/s)
  lloydBoundSaturationRatio: number; // 勞埃德極限飽和比率 (接近 1.00)
  wdwPatchVolumeAdS4: number;      // WDW 斑塊內部四維時空體積
  scramblingTimeGyr: number;       // 快速擾亂時間 t_scr (Gyr)
  shockwaveDelayGyr: number;       // 震波回衝時間延遲 (Gyr)
  telemetryHistory: Array<{
    timestamp: number;
    complexityGates: number;
    growthRate: number;
    lloydRatio: number;
  }>;
}

const STORAGE_KEY = 'newworld_holo_complexity_state_v1';

class HolographicComplexityActionEngine {
  private state: HolographicComplexityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): HolographicComplexityState {
    return {
      blackHoleMassSolar: 32.0,
      adsCurvatureRadius: 8.5,
      evolutionTimeGyr: 14.2,
      boundaryQubitCount: 1024,
      regime: 'action-wdw-lloyd-bound',
      complexityValueGigaGates: 845.2,
      actionGrowthRateGatesSec: 64.0,
      lloydBoundSaturationRatio: 0.995,
      wdwPatchVolumeAdS4: 1280.5,
      scramblingTimeGyr: 1.85,
      shockwaveDelayGyr: 0.62,
      telemetryHistory: []
    };
  }

  private loadState(): HolographicComplexityState {
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

  public getState(): Readonly<HolographicComplexityState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<HolographicComplexityState,
    'blackHoleMassSolar' | 'adsCurvatureRadius' | 'evolutionTimeGyr' | 'boundaryQubitCount' | 'regime'
  >>): void {
    if (params.blackHoleMassSolar !== undefined) {
      this.state.blackHoleMassSolar = Math.max(5.0, Math.min(100.0, params.blackHoleMassSolar));
    }
    if (params.adsCurvatureRadius !== undefined) {
      this.state.adsCurvatureRadius = Math.max(1.0, Math.min(20.0, params.adsCurvatureRadius));
    }
    if (params.evolutionTimeGyr !== undefined) {
      this.state.evolutionTimeGyr = Math.max(0.0, Math.min(50.0, params.evolutionTimeGyr));
    }
    if (params.boundaryQubitCount !== undefined) {
      this.state.boundaryQubitCount = Math.max(100, Math.min(5000, Math.floor(params.boundaryQubitCount)));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public injectShockwavePerturbation(): void {
    this.playComplexitySound(440, 0.45, 'sawtooth');
    this.state.shockwaveDelayGyr += 0.85;
    this.state.complexityValueGigaGates = Math.max(10.0, this.state.complexityValueGigaGates - 45.0);
    this.recomputePhysics();
    this.saveState();
  }

  public stepEvolutionTime(deltaGyr: number = 2.0): void {
    this.playComplexitySound(660, 0.35, 'triangle');
    let nextTime = this.state.evolutionTimeGyr + deltaGyr;
    if (nextTime > 50.0) nextTime = 0.5;
    this.state.evolutionTimeGyr = Number(nextTime.toFixed(1));
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 時間自動緩慢推進
    this.state.evolutionTimeGyr = Number((this.state.evolutionTimeGyr + delta * 0.05).toFixed(2));
    if (this.state.evolutionTimeGyr > 50.0) this.state.evolutionTimeGyr = 0.5;

    // 震波延遲衰減
    if (this.state.shockwaveDelayGyr > 0.05) {
      this.state.shockwaveDelayGyr = Math.max(0, this.state.shockwaveDelayGyr - delta * 0.1);
    }

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        complexityGates: Number(this.state.complexityValueGigaGates.toFixed(1)),
        growthRate: Number(this.state.actionGrowthRateGatesSec.toFixed(1)),
        lloydRatio: Number(this.state.lloydBoundSaturationRatio.toFixed(3))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const m = this.state.blackHoleMassSolar;
    const l = this.state.adsCurvatureRadius;
    const t = this.state.evolutionTimeGyr;
    const s = this.state.boundaryQubitCount;

    // 勞埃德極限增長率: 2M / (\pi \hbar) \propto m * 2.0
    const lloydRate = m * 2.0;
    this.state.actionGrowthRateGatesSec = Number(lloydRate.toFixed(1));

    // 勞埃德極限飽和比率: 在晚期高度接近 1.00
    const saturation = 1.0 - 0.08 * Math.exp(-t / 3.5);
    this.state.lloydBoundSaturationRatio = Number(Math.min(1.0, Math.max(0.75, saturation)).toFixed(3));

    // 快速擾亂時間 t_scr \propto \ln(S)
    const tScr = 0.45 * Math.log(s);
    this.state.scramblingTimeGyr = Number(tScr.toFixed(2));

    // 總複雜度 C(t) \propto lloydRate * (t - t_delay)
    const effTime = Math.max(0, t - this.state.shockwaveDelayGyr);
    const compGates = effTime * lloydRate * 1.85 * (l / 8.5);
    this.state.complexityValueGigaGates = Number(Math.max(5.0, compGates).toFixed(1));

    // WDW 斑塊四維體積 V_WDW \propto l^2 * r_+ * t
    const rPlus = 1.5 * Math.cbrt(m * l * l);
    const wdwVol = (l * l) * rPlus * effTime * 1.2;
    this.state.wdwPatchVolumeAdS4 = Number(wdwVol.toFixed(1));

    // 體制修正
    if (this.state.regime === 'late-time-saturation') {
      this.state.lloydBoundSaturationRatio = 0.999;
    } else if (this.state.regime === 'volume-maximal-slice') {
      this.state.complexityValueGigaGates = Number((this.state.complexityValueGigaGates * 1.15).toFixed(1));
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

  private playComplexitySound(freq: number, duration: number, type: OscillatorType): void {
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

export const holographicComplexityActionEngine = new HolographicComplexityActionEngine();
export const complexityActionEngine = holographicComplexityActionEngine;
